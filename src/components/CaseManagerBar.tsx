import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  FolderSync, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertCircle,
  FileText,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { CaseRecord } from '../types/bizpulse';
import { DEMO_CASE_ID } from '../data/demonstrationCase';

interface CaseManagerBarProps {
  cases: CaseRecord[];
  activeCase: CaseRecord;
  onSwitchCase: (caseId: string) => void;
  onNewCase: () => void;
  onLoadDemoCase: () => void;
  onDeleteCase: (caseId: string) => void;
  onExportJson: () => void;
  onImportJson: (jsonString: string) => void;
}

export const CaseManagerBar: React.FC<CaseManagerBarProps> = ({
  cases,
  activeCase,
  onSwitchCase,
  onNewCase,
  onLoadDemoCase,
  onDeleteCase,
  onExportJson,
  onImportJson
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportJson(text);
        setImportError(null);
        setIsOpen(false);
      } catch (err: any) {
        setImportError('Invalid JSON case file. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Active Case Selector Pill */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            Active Case:
          </span>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-500/60 text-slate-100 font-medium transition shadow-sm"
            >
              <span className="max-w-[200px] sm:max-w-[300px] truncate text-left">
                {activeCase.profile.name}
              </span>
              {activeCase.profile.isDemonstrationCase && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Demo
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu of Cases */}
            {isOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-1">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Switch Assessment Case</span>
                  <span className="font-mono text-slate-500">{cases.length} saved</span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                  {cases.map((c) => {
                    const isCurrent = c.id === activeCase.id;
                    return (
                      <div
                        key={c.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg transition ${
                          isCurrent
                            ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold'
                            : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <button
                          onClick={() => {
                            onSwitchCase(c.id);
                            setIsOpen(false);
                          }}
                          className="flex-1 text-left truncate mr-2"
                        >
                          <div className="truncate text-xs text-white">{c.profile.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {c.profile.industry} • {c.profile.country} ({c.profile.currency})
                          </div>
                        </button>

                        <div className="flex items-center gap-1">
                          {c.profile.isDemonstrationCase ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                              Demo
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete assessment for "${c.profile.name}"?`)) {
                                  onDeleteCase(c.id);
                                }
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1 transition"
                              title="Delete case"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dropdown Footer Actions */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5 text-center">
                  <button
                    onClick={() => {
                      onNewCase();
                      setIsOpen(false);
                    }}
                    className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New Business</span>
                  </button>
                  <button
                    onClick={() => {
                      onLoadDemoCase();
                      setIsOpen(false);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 transition"
                  >
                    <FolderSync className="w-3 h-3 text-blue-400" />
                    <span>Load Demo MSP</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Case Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewCase}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition text-[11px] font-semibold"
          >
            <Plus className="w-3 h-3" />
            <span>New Case</span>
          </button>

          <button
            onClick={onLoadDemoCase}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-[11px]"
            title="Load the pre-filled NZ Managed IT Services test scenario"
          >
            <FolderSync className="w-3 h-3 text-blue-400" />
            <span>Load Demo Case</span>
          </button>

          <button
            onClick={onExportJson}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition text-[11px]"
            title="Backup active case as JSON"
          >
            <Download className="w-3 h-3" />
            <span className="hidden md:inline">Export JSON</span>
          </button>

          <label className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition text-[11px] cursor-pointer">
            <Upload className="w-3 h-3" />
            <span className="hidden md:inline">Import</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>
      </div>

      {importError && (
        <div className="max-w-7xl mx-auto mt-2 p-2 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{importError}</span>
          </div>
          <button onClick={() => setImportError(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
};
