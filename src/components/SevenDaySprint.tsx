import React, { useState } from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Circle, 
  PhoneCall, 
  ShieldAlert, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { CaseRecord } from '../types/bizpulse';

interface SevenDaySprintProps {
  caseRecord?: CaseRecord;
}

export const SevenDaySprint: React.FC<SevenDaySprintProps> = ({ caseRecord }) => {
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({
    'sprint-1': false,
    'sprint-2': false,
    'sprint-3': false,
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleAction = (key: string) => {
    setCompletedActions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const action1Script = `Kia ora [Client Name],

I hope you are well.

I am writing regarding invoice [Invoice #] for NZ$[Amount], which is currently [Days] days overdue against our standard 20-day terms.

We value our partnership and have continued servicing your team in good faith. However, to maintain our engineer scheduling and cloud supplier commitments, our company policy requires that accounts overdue past 45 days be brought current.

Please arrange payment by [Day after tomorrow at 5:00 PM], or contact me directly today to agree on a formal payment arrangement. If we do not hear from you or receive remittance, non-emergency technical support tickets will be paused until the balance is cleared.

Thank you for your prompt attention to this matter.

Ngā mihi,
[Wife / Finance Director Name]
[Company Name]`;

  const action2Script = `Kia ora [Client MD/CEO Name],

Vish here. I wanted to reach out directly to check in on how our team has been supporting you over the past quarter.

With IT and cybersecurity evolving so rapidly in New Zealand, I’d love to buy you a coffee or lunch next Tuesday or Thursday to review your technology roadmap for the coming 12 months.

I want to share some exciting upgrades to our proactive monitoring and cybersecurity stack, and ensure our service levels are directly aligned with your business goals this year.

Let me know what day works best for your schedule.

Ngā mihi,
Vish
Managing Director`;

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-rose-950/60 border border-amber-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                The Next 7 Days
              </span>
              <span className="text-slate-400 text-xs">Non-Negotiable Execution</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              The Three Most Important Actions for the Next 7 Days
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Forget 12-month dreams or marketing campaigns. If you do not execute these three moves in the next 168 hours, your cash buffer will evaporate and key staff may resign.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-w-[200px] text-center shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Sprint Status</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">
              {Object.values(completedActions).filter(Boolean).length} / 3 Done
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              168-Hour Countdown
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Action Cards */}
      <div className="space-y-6">
        {/* Action 1 */}
        <div className={`p-6 rounded-2xl border transition-all ${
          completedActions['sprint-1'] 
            ? 'bg-slate-900/40 border-emerald-900/50' 
            : 'bg-slate-900/90 border-slate-800 shadow-xl'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <button
                onClick={() => toggleAction('sprint-1')}
                className="mt-1 text-slate-400 hover:text-emerald-400 transition"
              >
                {completedActions['sprint-1'] ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center">
                    #1
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                    Day 1–3 Priority (Cash Fortress)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Owners: Wife + Vish
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-2">
                  Execute the 48-Hour Stop-Work Notice on the NZ$58,000 Overdue Accounts
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs text-slate-300">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong>What to do: </strong>
                Your wife issues written 48-hour credit hold notices to every customer with invoices over 45 days overdue (NZ$58,000 total). On Day 2, Vish personally calls the business owners of the top 3 debtors.
              </p>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Vish's Phone Talk Track:</span>
                <p className="italic text-slate-200">
                  "Kia ora [Name], Vish here. We've valued supporting your team for years, but our finance policy requires accounts to be current to dispatch engineers. We have $14,000 overdue past 60 days. Can we process this today via direct credit, or split 50% today and 50% next week so we don't have to pause support?"
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Ready-to-Use 48-Hour Email Notice:</span>
                <button
                  onClick={() => copyToClipboard(action1Script, 'action-1')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-[11px]"
                >
                  {copiedKey === 'action-1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'action-1' ? 'Copied' : 'Copy Email'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-slate-400 font-mono text-[11px] whitespace-pre-wrap max-h-44 overflow-y-auto">
                {action1Script}
              </pre>
            </div>
          </div>
        </div>

        {/* Action 2 */}
        <div className={`p-6 rounded-2xl border transition-all ${
          completedActions['sprint-2'] 
            ? 'bg-slate-900/40 border-emerald-900/50' 
            : 'bg-slate-900/90 border-slate-800 shadow-xl'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <button
                onClick={() => toggleAction('sprint-2')}
                className="mt-1 text-slate-400 hover:text-emerald-400 transition"
              >
                {completedActions['sprint-2'] ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                    #2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Day 2–5 Priority (Revenue Protection)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Owner: Vish
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-2">
                  Lock Down the Flight-Risk Large Client (Executive Coffee / Lunch)
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs text-slate-300">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong>What to do: </strong>
                One large customer is actively flirting with a national MSP provider. Do NOT send an email or offer a desperate fee cut. Vish calls the Managing Director directly and invites them to lunch.
              </p>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-semibold block">How to Beat National Providers Without Discounting:</span>
                <ul className="space-y-1 text-slate-300">
                  <li>• <strong>Named Engineers: </strong> National MSPs rotate offshore tier-1 helpdesk agents who know nothing about the client's business.</li>
                  <li>• <strong>Zero Ticket Bureaucracy: </strong> No 4-hour SLA holding patterns for urgent executive issues.</li>
                  <li>• <strong>Executive Attention: </strong> The actual business owner (Vish) is personally accountable.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Vish's Meeting Invite Script:</span>
                <button
                  onClick={() => copyToClipboard(action2Script, 'action-2')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-[11px]"
                >
                  {copiedKey === 'action-2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'action-2' ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-slate-400 font-mono text-[11px] whitespace-pre-wrap max-h-44 overflow-y-auto">
                {action2Script}
              </pre>
            </div>
          </div>
        </div>

        {/* Action 3 */}
        <div className={`p-6 rounded-2xl border transition-all ${
          completedActions['sprint-3'] 
            ? 'bg-slate-900/40 border-emerald-900/50' 
            : 'bg-slate-900/90 border-slate-800 shadow-xl'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <button
                onClick={() => toggleAction('sprint-3')}
                className="mt-1 text-slate-400 hover:text-emerald-400 transition"
              >
                {completedActions['sprint-3'] ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-300 font-bold text-xs flex items-center justify-center">
                    #3
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                    Day 1–4 Priority (Operational Sanity)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Owners: Senior Tech + Service Desk Dispatch
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-2">
                  Install the Service Desk Firewall & 10:00 AM – 2:00 PM Deep Work Shield
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-blue-400 block mb-1">1. Triage Gatekeeper</span>
              <p className="leading-relaxed">
                100% of phone calls and ticket queues route through the 2 service-desk staff. No customer can call the senior technician’s mobile directly.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block mb-1">2. 4-Hour Deep Work Vault</span>
              <p className="leading-relaxed">
                Senior tech is blocked from routine tickets between 10:00 AM and 2:00 PM daily to focus exclusively on complex architecture, system outages, and SOP documentation.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400 block mb-1">3. Technician Retention Signal</span>
              <p className="leading-relaxed">
                Gather the 2 at-risk technicians on Friday afternoon. Announce the new triage rules and tell them: "We heard you. We are ending the chaotic interruption cycle starting now."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
