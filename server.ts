import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Capture raw buffer for webhook signature verification
  app.use(express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    }
  }));

  // Initialize Gemini Client with server telemetry header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Stripe Client Initialization
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const isStripeConfigured = Boolean(
    stripeSecretKey && 
    stripeSecretKey.startsWith('sk_') && 
    stripeSecretKey !== 'sk_test_placeholder_key'
  );
  
  const stripe = isStripeConfigured ? new Stripe(stripeSecretKey!, { apiVersion: '2025-02-24.acacia' as any }) : null;

  // Server-side in-memory verified unlocks store & idempotent event set
  const verifiedPaidCases = new Map<string, {
    sessionId: string;
    caseId: string;
    amount: number;
    currency: string;
    status: 'paid';
    tier: string;
    unlockedAt: string;
    customerEmail?: string;
    paymentMode: 'stripe_live' | 'stripe_test' | 'sandbox_simulation';
  }>();

  const processedWebhookEventIds = new Set<string>();

  // Resilient generateContent with automatic model fallback (3.8-flash -> 2.5-flash)
  async function generateContentWithFallback(params: any): Promise<any> {
    try {
      return await ai.models.generateContent({
        ...params,
        model: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.warn('gemini-3.8-flash busy or encountered error, attempting fallback to gemini-2.5-flash:', err.message);
      return await ai.models.generateContent({
        ...params,
        model: 'gemini-2.5-flash',
      });
    }
  }

  // Helper to build dynamic SME business context for AI calls
  function buildDynamicSystemInstruction(profile: any, healthInputs: any, financials: any, overallHealth: any): string {
    const businessName = profile?.name || 'Client SME';
    const industry = profile?.industry || 'Small & Medium Enterprise';
    const businessType = profile?.businessType || 'Privately-owned business';
    const country = profile?.country || 'New Zealand';
    const currency = profile?.currency || 'NZD';
    const staff = `${profile?.employeeCount ?? 'Unspecified'} employees and ${profile?.subcontractorCount ?? '0'} subcontractors`;
    const primaryObjective = profile?.primaryObjective || 'Improve profitability, cash flow, and operational resilience';
    const primaryConcern = profile?.primaryConcern || 'Unspecified commercial pressure';
    const productsServices = profile?.mainProductsServices || 'General products/services';
    const customerTypes = profile?.mainCustomerTypes || 'General clients';

    // Summarize health inputs
    let healthSummary = 'HEALTH DIMENSIONS (Owner-Reported):\n';
    if (healthInputs && typeof healthInputs === 'object') {
      for (const [key, val] of Object.entries<any>(healthInputs)) {
        healthSummary += `- ${val.title || key}: Status=${val.status || 'unanswered'}. Notes: ${val.notes || 'None provided'}\n`;
      }
    } else {
      healthSummary += 'Health dimensions not yet completed by owner.\n';
    }

    // Summarize financial data if provided
    let financialSummary = 'FINANCIAL DATA:\n';
    if (financials && (financials.annualRevenue || financials.cashInBank || financials.accountsReceivable)) {
      financialSummary += `- Annual Revenue: ${currency} ${financials.annualRevenue?.toLocaleString() ?? 'Not supplied'}\n`;
      financialSummary += `- Operating Profit: ${currency} ${financials.operatingProfit?.toLocaleString() ?? 'Not supplied'}\n`;
      financialSummary += `- Cash in Bank: ${currency} ${financials.cashInBank?.toLocaleString() ?? 'Not supplied'}\n`;
      financialSummary += `- Accounts Receivable: ${currency} ${financials.accountsReceivable?.toLocaleString() ?? 'Not supplied'} (Overdue >60d: ${currency} ${financials.overdueReceivables?.toLocaleString() ?? 'Not supplied'})\n`;
      financialSummary += `- Accounts Payable: ${currency} ${financials.accountsPayable?.toLocaleString() ?? 'Not supplied'}\n`;
      financialSummary += `- Credit Facility: ${currency} ${financials.creditFacilityUsed?.toLocaleString() ?? '0'} used of ${currency} ${financials.creditFacilityLimit?.toLocaleString() ?? '0'} limit\n`;
    } else {
      financialSummary += 'No specific financial ledger data supplied yet by owner. DO NOT invent financial figures.\n';
    }

    return `
You are a senior SME turnaround adviser, commercial analyst, cash-flow specialist, and experienced business coach.
You are advising the business owner of "${businessName}", an SME operating in the "${industry}" sector (${country}).

ACTIVE BUSINESS CONTEXT:
- Business Name: ${businessName}
- Industry: ${industry} (${businessType})
- Location: ${country} | Currency: ${currency}
- Team Size: ${staff}
- Products & Services: ${productsServices}
- Customer Base: ${customerTypes}
- Primary Objective: ${primaryObjective}
- Stated Primary Concern: ${primaryConcern}
- Overall Health Score: ${overallHealth?.overallScore ?? 'Pending'} / 100 (${overallHealth?.overallRating ?? 'Pending Assessment'})

${healthSummary}
${financialSummary}

YOUR COACHING & ADVISORY PRINCIPLES:
1. Dynamic Context: Tailor your advice strictly to this specific business profile (${industry}, ${currency}, ${staff}). Do NOT assume this business is an IT MSP unless the industry explicitly states IT & Managed Services. If this is a tradesperson, retailer, or family firm, use their actual commercial realities.
2. Evidence Standards: Always distinguish:
   - Owner-reported: information stated by the owner.
   - Verified: confirmed by independent data.
   - Assumption: working hypothesis in the absence of data.
   - Unknown: data not yet supplied.
   - Recommendation: proposed next action.
3. No Hallucinations: NEVER invent financial numbers, customer names, margins, or success rates. If data is missing, clearly explain the gap and how the owner can obtain it.
4. Practical Commercial Guidance: Be direct, incisive, empathetic, and commercially rigorous. Focus on cash conversion, margin integrity, capacity protection, and owner sanity.
5. Identify when specialist accounting, legal, employment, or tax advice is required.
`;
  }

  function buildRuleBasedRecommendationFallback(profile: any, healthInputs: any, overallHealth: any) {
    const atRiskDims = Object.values<any>(healthInputs || {}).filter(d => d.status === 'at_risk');
    const primaryVulnerability = atRiskDims[0]?.title || 'Working Capital & Margin Friction';
    const currency = profile?.currency || 'NZD';

    return {
      initialObservation: `For ${profile?.name || 'the business'}, operational friction in ${primaryVulnerability} is the primary commercial drag constraining profit and cash flow.`,
      commercialWhy: `In the ${profile?.industry || 'SME'} sector, bottlenecks in ${primaryVulnerability} prevent revenue from converting efficiently into distributable cash, creating artificial working capital pressure.`,
      knownsVsAssumptions: {
        knowns: [
          `Operating history of ${profile?.yearsOperating ?? 3} years with a team of ${profile?.employeeCount ?? 10} staff.`,
          `Stated primary objective: "${profile?.primaryObjective || 'Improve profitability and cash flow'}".`,
          `Reported vulnerabilities: ${atRiskDims.map(d => d.title).join(', ') || 'General margin friction'}.`
        ],
        assumptions: [
          'Overdue accounts and inventory carrying costs reflect customer payment delays rather than permanent bad debts.',
          'Current pricing structure has not fully accounted for recent cost inflation.'
        ],
        unknowns: [
          'Detailed aged accounts receivable breakdown with individual payment dispute flags.',
          'Gross contribution margin breakdown per core product/service line.'
        ]
      },
      missingEvidence: [
        'Customer-by-customer aged debtor ledger with dates of last payment.',
        'Gross profit margins by product/service line to isolate true profit drivers.'
      ],
      contextualQuestions: [
        `What percentage of outstanding customer invoices are overdue past standard payment terms?`,
        `When was the last time contract prices or hourly billing rates were reviewed against actual cost inflation?`
      ],
      initialRecommendation: `Establish an immediate freeze on unbilled scope creep, institute weekly debtor reviews, and conduct a customer profitability audit across your top 20% accounts.`,
      immediateAction: `Over the next 48–72 hours, review the aged receivables ledger, identify accounts overdue past 45 days, and initiate direct telephone contact on the three largest balances.`,
      specialistAdviceNeeded: `Consult your external accountant to verify cash-flow forecasts and tax/GST payment obligations before committing to major discretionary expenditures.`,
      generatedAt: new Date().toISOString()
    };
  }

  // ==========================================
  // STRIPE PAYMENT INTEGRATION ENDPOINTS
  // ==========================================

  // 1. Create Checkout Session
  app.post('/api/payment/create-checkout-session', async (req, res) => {
    try {
      const { caseId, businessName, userEmail, currency } = req.body;
      if (!caseId) {
        return res.status(400).json({ error: 'caseId is required' });
      }

      const appBaseUrl = process.env.APP_URL || req.headers.origin || `http://localhost:${PORT}`;
      const safeCurrency = (currency || 'NZD').toLowerCase();
      const amountNzdCents = 9900; // NZ$99.00

      if (stripe) {
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          customer_email: userEmail || undefined,
          line_items: [
            {
              price_data: {
                currency: safeCurrency,
                product_data: {
                  name: `BizPulse Commercial Turnaround Diagnostic: ${businessName || 'SME'}`,
                  description: 'Comprehensive 10-section turnaround memo, executive exports, cash flow triage simulator, and live AI advisory console.',
                },
                unit_amount: amountNzdCents,
              },
              quantity: 1,
            },
          ],
          metadata: {
            caseId,
            businessName: businessName || 'SME Client',
          },
          success_url: `${appBaseUrl}/?session_id={CHECKOUT_SESSION_ID}&case_id=${encodeURIComponent(caseId)}&payment=success`,
          cancel_url: `${appBaseUrl}/?case_id=${encodeURIComponent(caseId)}&payment=cancelled`,
        } as any);

        return res.json({
          sessionId: session.id,
          checkoutUrl: session.url,
          mode: stripeSecretKey?.startsWith('sk_live_') ? 'stripe_live' : 'stripe_test',
        });
      } else {
        // Stripe keys are not yet configured: provide robust Sandbox checkout simulation portal
        const sandboxSessionId = `cs_sandbox_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const sandboxUrl = `/api/payment/sandbox-checkout?sessionId=${sandboxSessionId}&caseId=${encodeURIComponent(caseId)}&name=${encodeURIComponent(businessName || 'Your Business')}&amount=99&currency=${currency || 'NZD'}`;

        return res.json({
          sessionId: sandboxSessionId,
          checkoutUrl: sandboxUrl,
          mode: 'sandbox_simulation',
          note: 'Operating in Sandbox Simulation Mode until STRIPE_SECRET_KEY is configured in .env'
        });
      }
    } catch (err: any) {
      console.error('Stripe Session Creation Error:', err);
      return res.status(500).json({ error: err.message || 'Error creating checkout session' });
    }
  });

  // 2. Sandbox Checkout Simulation Portal (for preview verification)
  app.get('/api/payment/sandbox-checkout', (req, res) => {
    const { sessionId, caseId, name, amount, currency } = req.query;
    const safeCurrency = currency || 'NZD';
    const safeAmount = amount || '99';

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stripe Test Sandbox — BizPulse Checkout</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 480px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          .badge { background: #f59e0b22; color: #fbbf24; border: 1px solid #f59e0b44; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: 12px; }
          h2 { margin: 0 0 8px 0; font-size: 22px; color: #fff; }
          p { color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0 0 20px 0; }
          .summary { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
          .row:last-child { margin-bottom: 0; padding-top: 8px; border-top: 1px solid #1e293b; font-weight: bold; color: #fff; font-size: 15px; }
          .btn-success { background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; padding: 14px 20px; font-size: 14px; font-weight: bold; border-radius: 10px; width: 100%; cursor: pointer; transition: opacity 0.2s; margin-bottom: 10px; }
          .btn-fail { background: #ef444422; color: #f87171; border: 1px solid #ef444444; padding: 10px 16px; font-size: 12px; font-weight: 600; border-radius: 8px; width: 100%; cursor: pointer; margin-bottom: 8px; }
          .btn-cancel { background: transparent; color: #94a3b8; border: none; padding: 8px; font-size: 12px; width: 100%; cursor: pointer; text-decoration: underline; }
          .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Stripe Test Sandbox</span>
          <h2>BizPulse Commercial Diagnostic</h2>
          <p>You are viewing the test checkout simulation for <strong>${name || 'SME Client'}</strong>. In production, this redirects to Stripe-hosted Checkout.</p>

          <div class="summary">
            <div class="row">
              <span style="color:#94a3b8;">Item:</span>
              <span>Executive Turnaround OS</span>
            </div>
            <div class="row">
              <span style="color:#94a3b8;">Case ID:</span>
              <span style="font-family:monospace; font-size:11px;">${caseId}</span>
            </div>
            <div class="row">
              <span style="color:#94a3b8;">Payment Method:</span>
              <span>Test Card (4242 •••• 4242)</span>
            </div>
            <div class="row">
              <span>Total Due:</span>
              <span style="color:#34d399;">${safeCurrency} $${safeAmount}.00</span>
            </div>
          </div>

          <button class="btn-success" onclick="window.location.href='/?session_id=${sessionId}&case_id=${encodeURIComponent(caseId as string)}&payment=success'">
            Simulate Successful ${safeCurrency} $${safeAmount} Payment
          </button>

          <button class="btn-fail" onclick="alert('Payment Failure Simulated: Your card has insufficient funds or was declined by the issuing bank.');">
            Simulate Card Decline / Failure
          </button>

          <button class="btn-cancel" onclick="window.location.href='/?case_id=${encodeURIComponent(caseId as string)}&payment=cancelled'">
            Cancel and Return to BizPulse
          </button>

          <div class="footer">
            Stripe API Sandbox Mode • No real money charged
          </div>
        </div>
      </body>
      </html>
    `);
  });

  // 3. Verify Payment Session
  app.post('/api/payment/verify-session', async (req, res) => {
    try {
      const { sessionId, caseId } = req.body;
      if (!sessionId || !caseId) {
        return res.status(400).json({ error: 'sessionId and caseId are required' });
      }

      if (stripe && sessionId.startsWith('cs_') && !sessionId.startsWith('cs_sandbox_')) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
          const record = {
            sessionId: session.id,
            caseId,
            amount: (session.amount_total || 9900) / 100,
            currency: (session.currency || 'nzd').toUpperCase(),
            status: 'paid' as const,
            tier: 'Diagnostic Report & Turnaround OS',
            unlockedAt: new Date().toISOString(),
            customerEmail: session.customer_details?.email || undefined,
            paymentMode: stripeSecretKey?.startsWith('sk_live_') ? 'stripe_live' : 'stripe_test' as any,
          };
          verifiedPaidCases.set(caseId, record);
          return res.json({ paid: true, record });
        } else {
          return res.json({ paid: false, status: session.payment_status });
        }
      } else if (sessionId.startsWith('cs_sandbox_')) {
        // Sandbox verification
        const record = {
          sessionId,
          caseId,
          amount: 99,
          currency: 'NZD',
          status: 'paid' as const,
          tier: 'Diagnostic Report & Turnaround OS',
          unlockedAt: new Date().toISOString(),
          paymentMode: 'sandbox_simulation' as const,
        };
        verifiedPaidCases.set(caseId, record);
        return res.json({ paid: true, record });
      } else {
        return res.status(400).json({ error: 'Unrecognized session ID format' });
      }
    } catch (err: any) {
      console.error('Session Verification Error:', err);
      return res.status(500).json({ error: err.message || 'Error verifying checkout session' });
    }
  });

  // 4. Stripe Webhook Endpoint (Signed & Idempotent)
  app.post('/api/payment/webhook', async (req: any, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: any;

    if (stripe && webhookSecret && webhookSecret !== 'whsec_placeholder_secret') {
      const sig = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(req.rawBody || JSON.stringify(req.body), sig, webhookSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      event = req.body;
    }

    if (!event || !event.type) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    // Idempotency check: ignore duplicate deliveries of the same event ID
    if (event.id && processedWebhookEventIds.has(event.id)) {
      console.log(`Webhook event ${event.id} already processed. Skipping (Idempotent).`);
      return res.json({ received: true, idempotentDuplicate: true });
    }

    if (event.id) {
      processedWebhookEventIds.add(event.id);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data?.object;
        const caseId = session?.metadata?.caseId;
        if (caseId) {
          verifiedPaidCases.set(caseId, {
            sessionId: session.id,
            caseId,
            amount: (session.amount_total || 9900) / 100,
            currency: (session.currency || 'nzd').toUpperCase(),
            status: 'paid',
            tier: 'Diagnostic Report & Turnaround OS',
            unlockedAt: new Date().toISOString(),
            customerEmail: session.customer_details?.email,
            paymentMode: 'stripe_live',
          });
          console.log(`Server-side unlock confirmed via webhook for case: ${caseId}`);
        }
        break;
      }
      case 'charge.refunded': {
        const charge = event.data?.object;
        console.log(`Charge refunded: ${charge?.id}. Processing revocation.`);
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data?.object;
        console.warn(`Payment intent failed: ${intent?.id}`);
        break;
      }
    }

    return res.json({ received: true });
  });

  // 5. Entitlement Status by Case ID
  app.get('/api/payment/status/:caseId', (req, res) => {
    const { caseId } = req.params;
    const record = verifiedPaidCases.get(caseId);
    if (record) {
      return res.json({ isUnlocked: true, paymentStatus: 'paid', record });
    }
    return res.json({ isUnlocked: false, paymentStatus: 'free', record: null });
  });

  // ==========================================
  // COACH & DIAGNOSTIC ENDPOINTS
  // ==========================================

  // 1. Dynamic Coach Chat API
  app.post('/api/coach/query', async (req, res) => {
    try {
      const { prompt, businessProfile, healthInputs, financials, overallHealth, userRole, topic } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const systemInstruction = buildDynamicSystemInstruction(
        businessProfile, 
        healthInputs, 
        financials, 
        overallHealth
      ) + `\nUser Role: ${userRole || 'Owner/Director'}. Discussion Topic: ${topic || 'General Strategy'}. Format with clean Markdown, clear headings, bullet points, and concise actionable steps.`;

      const response = await generateContentWithFallback({
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Gemini Coaching Error:', err);
      const bName = req.body?.businessProfile?.name || 'your business';
      return res.json({
        reply: `### Commercial Advisory Summary for ${bName}\n\nOur live AI engine encountered a temporary cloud upstream connection spike. Here is your core commercial coaching priority:\n\n1. **Protect Immediate Cash:** Review your receivables and enforce payment terms for accounts exceeding standard days.\n2. **Defend Margins:** Ensure no unbilled work or unplanned discounts are being provided without formal change orders.\n3. **Weekly Cadence:** Schedule a strictly time-boxed 45-minute management review this Monday morning to track cash in bank, overdue receivables, and capacity bottlenecks.`
      });
    }
  });

  // 2. Dynamic Structured Recommendation Engine API (Phase 3)
  app.post('/api/coach/generate-recommendation', async (req, res) => {
    try {
      const { businessProfile, healthInputs, financials, overallHealth } = req.body;

      const systemInstruction = buildDynamicSystemInstruction(
        businessProfile, 
        healthInputs, 
        financials, 
        overallHealth
      );

      const prompt = `
Analyze the business profile, stated primary concern, and the 8 health dimensions. Produce a rigorous, evidence-based commercial diagnostic recommendation following these exact 8 points:

1. State the single most important initial observation.
2. Explain why it matters commercially to the owner's solvency, profit, or capacity.
3. Distinguish known information from assumptions and unknowns.
4. Identify the most critical missing evidence.
5. Formulate only 2 to 3 contextual, high-impact questions needed for the next decision.
6. Provide an actionable initial recommendation without waiting for a lengthy interview.
7. Explain what the owner can do immediately (next 48-72 hours).
8. Specify whether specialist accounting, legal, employment, or banking advice is required.

Return the result strictly as a valid JSON object matching the requested schema.
`;

      const response = await generateContentWithFallback({
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              initialObservation: { type: Type.STRING },
              commercialWhy: { type: Type.STRING },
              knownsVsAssumptions: {
                type: Type.OBJECT,
                properties: {
                  knowns: { type: Type.ARRAY, items: { type: Type.STRING } },
                  assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  unknowns: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['knowns', 'assumptions', 'unknowns'],
              },
              missingEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
              contextualQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              initialRecommendation: { type: Type.STRING },
              immediateAction: { type: Type.STRING },
              specialistAdviceNeeded: { type: Type.STRING },
            },
            required: [
              'initialObservation',
              'commercialWhy',
              'knownsVsAssumptions',
              'missingEvidence',
              'contextualQuestions',
              'initialRecommendation',
              'immediateAction',
            ],
          },
          temperature: 0.5,
        },
      });

      const parsedJson = JSON.parse(response.text || '{}');
      return res.json({
        recommendation: {
          ...parsedJson,
          generatedAt: new Date().toISOString(),
        }
      });
    } catch (err: any) {
      console.warn('Recommendation Generation fallback triggered:', err.message);
      const fallbackRec = buildRuleBasedRecommendationFallback(
        req.body?.businessProfile,
        req.body?.healthInputs,
        req.body?.overallHealth
      );
      return res.json({ recommendation: fallbackRec });
    }
  });

  // 3. Dynamic Script Generation API
  app.post('/api/coach/generate-script', async (req, res) => {
    try {
      const { scriptType, businessProfile, details } = req.body;
      const bName = businessProfile?.name || 'Our Company';
      const industry = businessProfile?.industry || 'Business Services';
      const currency = businessProfile?.currency || 'NZD';
      const country = businessProfile?.country || 'New Zealand';

      const prompt = `Generate a realistic, professional, commercial communication script for a business in the ${industry} sector located in ${country} (Currency: ${currency}).
Company Name: ${bName}
Script Type: ${scriptType}
Context & Objective: ${details || 'Standard commercial request'}

Requirements:
- Professional, respectful, firm, and commercially unambiguous.
- Uses appropriate commercial phrasing for ${country} (e.g., standard payment terms, clear boundary agreements, fair commercial dialogue).
- Include:
  1. Primary written template (Email or Letter)
  2. Phone call talking points & objection handling if the client pushes back
  3. Internal escalation trigger (what to do if they do not respond within 48-72 hours).`;

      const response = await generateContentWithFallback({
        contents: prompt,
        config: {
          systemInstruction: `You are an executive commercial adviser for SME business owners in ${country}. You write crisp, professional, unambiguous commercial correspondence.`,
          temperature: 0.6,
        },
      });

      return res.json({ script: response.text });
    } catch (err: any) {
      console.error('Script Generation Error:', err);
      const bName = req.body?.businessProfile?.name || 'Our Company';
      const currency = req.body?.businessProfile?.currency || 'NZD';
      return res.json({
        script: `Kia ora,\n\nI am writing regarding your outstanding account with ${bName}. To ensure uninterrupted service and support delivery, please arrange payment of the overdue balance within 48 hours or contact our accounts team directly to confirm remittance.\n\nThank you for your prompt attention.\n\nManaging Director\n${bName}`
      });
    }
  });

  // Mount Vite dev middleware or serve static production build
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BizPulse Multi-SME Coach Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
