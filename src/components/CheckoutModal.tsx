import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  X, 
  CreditCard, 
  ArrowRight, 
  Lock, 
  HelpCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Bot
} from 'lucide-react';
import { CaseRecord } from '../types/bizpulse';

interface CheckoutModalProps {
  caseRecord: CaseRecord;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (record: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  caseRecord,
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currency = caseRecord.profile.currency || 'NZD';
  const price = 99;

  const handleStartCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: caseRecord.id,
          businessName: caseRecord.profile.name,
          currency: currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session.');
      }

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error initiating checkout.');
      setIsLoading(false);
    }
  };

  const handleInstantSandboxUnlock = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mockSessionId = `cs_sandbox_${Date.now()}`;
      const response = await fetch('/api/payment/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: mockSessionId,
          caseId: caseRecord.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Sandbox verification failed.');
      }

      const data = await response.json();
      if (data.paid && data.record) {
        onPaymentSuccess(data.record);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Sandbox unlock failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 space-y-6 p-6 sm:p-8 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Executive Upgrade
              </span>
              <h3 className="text-xl font-bold text-white">
                Comprehensive Turnaround Diagnostic OS
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Banner */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">One-Time Diagnostic License</span>
            <div className="text-3xl font-extrabold text-white mt-0.5 font-mono">
              {currency} ${price}
              <span className="text-xs font-normal text-slate-400"> + GST</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
              No recurring subscription • Lifetime case access
            </span>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-end gap-1 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Stripe 256-bit SSL</span>
            </div>
            <div>New Zealand Commercial Terms</div>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            What is Included with this Business License:
          </span>

          <div className="grid grid-cols-1 gap-2">
            {[
              { icon: FileText, title: 'Complete 10-Section Executive Turnaround Memo', desc: 'Case-specific commercial diagnosis, root causes, and 48-hour decision gates.' },
              { icon: DollarSign, title: 'Interactive Working Capital & Overdraft Simulator', desc: 'Real-time modeling of delinquent debt recovery and upfront supplies float.' },
              { icon: TrendingUp, title: 'Customer Economics & Price Review Sensitivity Engine', desc: 'Mathematical sensitivity of 8–12% price adjustments against churn risk.' },
              { icon: Bot, title: 'Live AI Commercial Advisory Console (Gemini 3.8 Flash)', desc: 'Roleplay customer discussions, test strategies, and generate firm legal letters.' },
              { icon: Sparkles, title: 'Universal Export Suite', desc: 'Download Word (.doc), PowerPoint (.ppt), Vector Infographic (.svg), and PDF.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-200 block">{f.title}</strong>
                    <span className="text-slate-400 text-[11px]">{f.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleStartCheckout}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition transform active:scale-[0.98]"
          >
            <CreditCard className="w-4 h-4" />
            <span>{isLoading ? 'Connecting to Stripe...' : `Proceed to Secure Checkout (${currency} $${price})`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Stripe Test Mode Supported</span>
            <button
              onClick={handleInstantSandboxUnlock}
              disabled={isLoading}
              className="text-amber-400/80 hover:text-amber-300 underline font-mono"
              title="Instantly simulate confirmed payment for testing without entering credit cards"
            >
              [Dev Test: Instant Sandbox Unlock]
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
