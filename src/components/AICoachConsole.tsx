import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  MessageSquare, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb,
  UserCheck,
  Building2,
  Coins
} from 'lucide-react';
import { SCRIPT_PRESETS } from '../data/coachingBriefing';
import { ScriptPreset, CaseRecord, BusinessProfile } from '../types/bizpulse';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

interface AICoachConsoleProps {
  caseRecord: CaseRecord;
  onUpdateCase?: (updated: CaseRecord) => void;
  initialPrompt?: string;
}

export const AICoachConsole: React.FC<AICoachConsoleProps> = ({
  caseRecord,
  onUpdateCase,
  initialPrompt
}) => {
  const profile = caseRecord.profile;

  const getInitialWelcomeText = (p: BusinessProfile) => {
    if (p.isDemonstrationCase) {
      return `Kia ora Vish and Managing Partner. I am your direct, commercially minded executive coach. I know your numbers inside out: NZ$1.28M revenue, NZ$100k paper profit, NZ$38k cash, NZ$52k overdraft used, and NZ$58k in >60-day overdue accounts.

I am here to protect your solvency, relieve debt collection pressure, shield your senior technician, and build a high-margin, manageable IT business.

Ask me any tough tactical question, or click one of the quick script presets below to generate client communications right now.`;
    }
    return `Welcome to your Executive Commercial Coaching Console for ${p.name}.
I am calibrated specifically for your business in ${p.industry} (${p.country}, Currency: ${p.currency}).

Stated Primary Objective: "${p.primaryObjective}"
Primary Concern: "${p.primaryConcern || 'Commercial pressure and operational bottlenecks'}"

I am ready to help you analyze cash flow, negotiate price increases, protect team capacity, or draft firm client communications. What commercial issue should we tackle today?`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-0',
      sender: 'coach',
      text: getInitialWelcomeText(profile),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>(initialPrompt || '');
  const [selectedTopic, setSelectedTopic] = useState<string>('Solvency & Collections');

  const defaultRole = profile.isDemonstrationCase 
    ? 'Managing Director (Vish)' 
    : `Owner / Managing Director (${profile.name})`;
  const [userRole, setUserRole] = useState<string>(defaultRole);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  // Script Generator Modal / View
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<ScriptPreset | null>(null);

  // When profile changes, reset welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'm-0',
        sender: 'coach',
        text: getInitialWelcomeText(caseRecord.profile),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setUserRole(
      caseRecord.profile.isDemonstrationCase 
        ? 'Managing Director (Vish)' 
        : `Owner / Managing Director (${caseRecord.profile.name})`
    );
  }, [caseRecord.id]);

  useEffect(() => {
    if (initialPrompt) {
      setInputPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const roleOptions = profile.isDemonstrationCase
    ? [
        'Managing Director (Vish)',
        'Finance/Operations (Partner)',
        'Senior Systems Engineer'
      ]
    : [
        `Owner / Managing Director (${profile.name})`,
        'Finance & Administration Lead',
        'Operations / Service Manager',
        'General Manager / Partner'
      ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          topic: selectedTopic,
          userRole: userRole,
          businessProfile: caseRecord.profile,
          healthInputs: caseRecord.healthInputs,
          financials: caseRecord.financials,
          overallHealth: caseRecord.overallHealth,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response from coach');
      }

      const data = await response.json();
      const coachMsg: Message = {
        id: `c-${Date.now()}`,
        sender: 'coach',
        text: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, coachMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'coach',
        text: `Error communicating with Executive Coach: ${err.message}. Please check that your dev server is active and GEMINI_API_KEY is configured.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePresetScript = async (preset: ScriptPreset) => {
    setSelectedPreset(preset);
    setIsGeneratingScript(true);
    setGeneratedScript(null);

    try {
      const response = await fetch('/api/coach/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptType: preset.title,
          businessProfile: caseRecord.profile,
          details: preset.defaultPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const data = await response.json();
      setGeneratedScript(data.script);
    } catch (err: any) {
      console.error(err);
      setGeneratedScript(`Error generating script: ${err.message}`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Interactive Advisory Console
              </span>
              <span className="text-slate-400 text-xs">Powered by Gemini 3.8 Flash</span>
              {profile.isDemonstrationCase && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Demo Case: NZ MSP
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Executive Small-Business Coach (Live Advisory)
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Trained on {profile.name} ({profile.industry}, {profile.country}). Grounded in your 8 health dimensions, working capital constraints, and primary concerns. Roleplay difficult client conversations, draft letters, or challenge strategic decisions.
            </p>
          </div>

          {/* User Persona Selector */}
          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Speaking as:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="bg-slate-900 text-xs font-bold text-amber-400 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[240px]"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Script Presets Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Instant Professional Script Generator ({profile.country} Commercial Format)
          </span>
          <span className="text-xs text-slate-500">1-Click AI Generation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCRIPT_PRESETS.map((preset: ScriptPreset) => (
            <button
              key={preset.id}
              onClick={() => handleGeneratePresetScript(preset)}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 transition text-left space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                  {preset.category}
                </span>
                <Sparkles className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition" />
              </div>
              <h4 className="font-semibold text-slate-200 text-xs line-clamp-1 group-hover:text-white">
                {preset.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Script Display Modal/Drawer */}
      {selectedPreset && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-slate-100 text-sm">
                  Generated Script: {selectedPreset.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Calibrated for {profile.name} ({profile.country}, Currency: {profile.currency})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {generatedScript && (
                <button
                  onClick={() => copyToClipboard(generatedScript, 'generated-script')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                >
                  {copiedScriptId === 'generated-script' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Script</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => setSelectedPreset(null)}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>

          <div className="mt-4">
            {isGeneratingScript ? (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Gemini is drafting your custom commercial correspondence...</span>
              </div>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {generatedScript}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px]">
        {/* Chat Control Sub-Bar */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Consultation Topic:</span>
            <div className="flex flex-wrap gap-1">
              {[
                'Solvency & Collections',
                'Pricing & Contracts',
                'Client Retention',
                'Service Desk Firefighting',
                'Hiring vs Marketing'
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    selectedTopic === topic
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'm-reset',
                  sender: 'coach',
                  text: getInitialWelcomeText(profile),
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isCoach = msg.sender === 'coach';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isCoach ? 'justify-start' : 'justify-end'}`}
              >
                {isCoach && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-md text-slate-950 font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-md ${
                    isCoach
                      ? 'bg-slate-950 border border-slate-800 text-slate-200'
                      : 'bg-amber-500 text-slate-950 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 opacity-60 text-[10px]">
                    <span className="font-bold">
                      {isCoach ? 'Turnaround Coach' : userRole}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>

                {!isCoach && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shrink-0 text-slate-950">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Coach is analyzing commercial implications...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask your coach about cash flow, customer negotiations, pricing adjustments, or team protection...`}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/10 transition transform active:scale-95"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 px-1">
            <span>Context: {profile.name} ({profile.industry})</span>
            <span>All responses grounded in evidence and commercial triage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
