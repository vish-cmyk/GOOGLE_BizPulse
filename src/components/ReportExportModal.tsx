import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  FileText, 
  FileCode, 
  Check, 
  X, 
  Sparkles,
  Activity,
  Layers,
  Calendar,
  Building2,
  PieChart,
  Presentation,
  ShieldCheck,
  Image as ImageIcon,
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { CaseRecord } from '../types/bizpulse';

interface ReportExportModalProps {
  caseRecord: CaseRecord;
  isOpen: boolean;
  onClose: () => void;
  onPrintReport: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  caseRecord,
  isOpen,
  onClose,
  onPrintReport
}) => {
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const { profile, healthInputs, overallHealth, recommendations, financials } = caseRecord;

  // 1. Generate clean Word-compatible Document (.doc)
  const handleDownloadWordDoc = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${profile.name} - Commercial Turnaround Report</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; margin: 40px; color: #1e293b; }
          h1 { color: #0f172a; font-size: 24pt; border-bottom: 2pt solid #0284c7; padding-bottom: 6pt; }
          h2 { color: #0369a1; font-size: 16pt; margin-top: 18pt; }
          h3 { color: #334155; font-size: 13pt; margin-top: 12pt; }
          table { width: 100%; border-collapse: collapse; margin-top: 10pt; }
          th, td { border: 1pt solid #cbd5e1; padding: 6pt 8pt; text-align: left; font-size: 10pt; }
          th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
          .badge { padding: 3pt 6pt; border-radius: 4pt; font-size: 9pt; font-weight: bold; }
          .box { background-color: #f8fafc; border: 1pt solid #e2e8f0; padding: 12pt; border-radius: 6pt; margin: 10pt 0; }
          .footer { font-size: 8pt; color: #64748b; margin-top: 30pt; border-top: 1pt solid #e2e8f0; padding-top: 6pt; }
        </style>
      </head>
      <body>
        <h1>${profile.name}</h1>
        <p><strong>Commercial Turnaround Diagnostic & Strategic Action Report</strong></p>
        <p><em>Industry: ${profile.industry} | Structure: ${profile.businessType} | Country: ${profile.country} (${profile.currency}) | Date: ${new Date().toLocaleDateString()}</em></p>
        
        <h2>1. Executive Summary & Health Assessment</h2>
        <div class="box">
          <p><strong>Overall Business Health:</strong> ${overallHealth?.overallRating || 'Pending Evaluation'} (Score: ${overallHealth?.overallScore ?? 'N/A'}/100)</p>
          <p><strong>Primary Commercial Objective:</strong> ${profile.primaryObjective}</p>
          <p><strong>Stated Primary Concern:</strong> ${profile.primaryConcern || 'Unspecified'}</p>
          <p><strong>Operating Track Record:</strong> ${profile.yearsOperating} years | <strong>Team:</strong> ${profile.employeeCount} staff, ${profile.subcontractorCount} subcontractors</p>
        </div>

        <h2>2. The Eight Commercial Health Dimensions</h2>
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Status</th>
              <th>Evidence Basis</th>
              <th>Owner-Reported Operational Notes</th>
            </tr>
          </thead>
          <tbody>
            ${Object.values(healthInputs).map(item => `
              <tr>
                <td><strong>${item.title}</strong></td>
                <td>${item.status.toUpperCase()}</td>
                <td>${item.evidenceType}</td>
                <td>${item.notes || 'None provided'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${recommendations ? `
          <h2>3. Turnaround Diagnostic & Action Recommendations</h2>
          <div class="box">
            <h3>Primary Commercial Observation</h3>
            <p>${recommendations.initialObservation}</p>
            <h3>Commercial Impact Rationale</h3>
            <p>${recommendations.commercialWhy}</p>
            <h3>Strategic Recommendation</h3>
            <p>${recommendations.initialRecommendation}</p>
            <h3>Immediate 48-Hour Action</h3>
            <p><strong>${recommendations.immediateAction}</strong></p>
            ${recommendations.specialistAdviceNeeded ? `
              <p><em>Specialist Advice Trigger: ${recommendations.specialistAdviceNeeded}</em></p>
            ` : ''}
          </div>
        ` : ''}

        <div class="footer">
          Generated via Relaunch BizPulse Executive Turnaround Engine • Case ID: ${profile.caseId}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}_Turnaround_Report.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadStatus('Word document (.doc) downloaded successfully!');
    setTimeout(() => setDownloadStatus(null), 3500);
  };

  // 2. Generate PowerPoint Presentation Slide Deck (.ppt / HTML slide presentation)
  const handleDownloadPowerPointDeck = () => {
    const slidesHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:p='urn:schemas-microsoft-com:office:powerpoint' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${profile.name} — Commercial Briefing Presentation</title>
        <style>
          body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
          .slide { background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 40px; margin-bottom: 30px; min-height: 480px; box-sizing: border-box; page-break-after: always; }
          h1 { color: #f59e0b; font-size: 28pt; margin: 0 0 10px 0; }
          h2 { color: #38bdf8; font-size: 20pt; border-bottom: 1px solid #475569; padding-bottom: 8px; margin-top: 0; }
          h3 { color: #e2e8f0; font-size: 14pt; margin-top: 15px; }
          p, li { font-size: 12pt; color: #cbd5e1; line-height: 1.5; }
          .badge { background: #f59e0b22; color: #fbbf24; border: 1px solid #f59e0b44; padding: 4px 10px; border-radius: 6px; font-size: 10pt; font-weight: bold; }
          .grid { display: table; width: 100%; margin-top: 15px; }
          .col { display: table-cell; width: 50%; vertical-align: top; padding-right: 15px; }
          .card { background: #0f172a; border: 1px solid #334155; padding: 15px; border-radius: 8px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <!-- Slide 1: Title -->
        <div class="slide">
          <span class="badge">Relaunch BizPulse • Commercial Executive Briefing</span>
          <h1>${profile.name}</h1>
          <p style="font-size: 16pt; color: #94a3b8;">${profile.industry} (${profile.country})</p>
          <div class="card" style="margin-top: 30px;">
            <p><strong>Primary Objective:</strong> ${profile.primaryObjective}</p>
            <p><strong>Primary Commercial Concern:</strong> ${profile.primaryConcern || 'Operational & Margin Friction'}</p>
            <p><strong>Team Size:</strong> ${profile.employeeCount} Employees, ${profile.subcontractorCount} Subcontractors | <strong>Currency:</strong> ${profile.currency}</p>
            <p><strong>Assessment Date:</strong> ${overallHealth?.assessmentDate || new Date().toISOString().split('T')[0]}</p>
          </div>
        </div>

        <!-- Slide 2: Overall Health & 8 Dimensions -->
        <div class="slide">
          <h2>Overall Business Health & 8-Dimension Scorecard</h2>
          <p><strong>Overall Status:</strong> <span class="badge">${overallHealth?.overallRating || 'Incomplete'} (${overallHealth?.overallScore ?? 0}/100)</span></p>
          <div class="grid">
            <div class="col">
              <div class="card">
                <h3>8 Dimensions Status</h3>
                <ul>
                  ${Object.values(healthInputs).slice(0, 4).map(h => `<li><strong>${h.title}:</strong> ${h.status.toUpperCase()}</li>`).join('')}
                </ul>
              </div>
            </div>
            <div class="col">
              <div class="card">
                <h3>8 Dimensions Status (Continued)</h3>
                <ul>
                  ${Object.values(healthInputs).slice(4).map(h => `<li><strong>${h.title}:</strong> ${h.status.toUpperCase()}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
          ${overallHealth?.criticalRisksIdentified ? `
            <div class="card" style="border-color: #ef444488; background: #ef444411;">
              <strong style="color: #f87171;">Critical Risk Drivers:</strong>
              <ul>
                ${overallHealth.criticalRisksIdentified.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Slide 3: Diagnostic Observation & Action Plan -->
        <div class="slide">
          <h2>Turnaround Strategy & Immediate Priorities</h2>
          ${recommendations ? `
            <div class="card">
              <h3 style="color: #fbbf24;">Primary Commercial Observation</h3>
              <p>${recommendations.initialObservation}</p>
            </div>
            <div class="card">
              <h3 style="color: #38bdf8;">Strategic Recommendation</h3>
              <p>${recommendations.initialRecommendation}</p>
            </div>
            <div class="card" style="border-color: #10b98188; background: #10b98111;">
              <strong style="color: #34d399;">Immediate 48–72 Hour Action:</strong>
              <p>${recommendations.immediateAction}</p>
            </div>
          ` : `
            <div class="card">
              <p>Recommendations awaiting generation in the Recommendation Engine tab.</p>
            </div>
          `}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([slidesHtml], { type: 'application/vnd.ms-powerpoint' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}_Executive_Slides.ppt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadStatus('PowerPoint summary deck (.ppt) downloaded successfully!');
    setTimeout(() => setDownloadStatus(null), 3500);
  };

  // 3. Generate Business Health Infographic (SVG / Vector infographic)
  const handleDownloadInfographic = () => {
    const score = overallHealth?.overallScore ?? 50;
    const rating = overallHealth?.overallRating ?? 'Pending';
    const dims = Object.values(healthInputs);

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600" style="background:#0f172a; font-family:sans-serif;">
        <rect width="900" height="600" fill="#0f172a"/>
        <text x="40" y="50" fill="#f59e0b" font-size="22" font-weight="bold">Relaunch BizPulse • Business Health Infographic</text>
        <text x="40" y="80" fill="#ffffff" font-size="26" font-weight="bold">${profile.name}</text>
        <text x="40" y="105" fill="#94a3b8" font-size="14">${profile.industry} • ${profile.country} (${profile.currency}) • Case: ${profile.caseId}</text>

        <!-- Score Box -->
        <rect x="660" y="30" width="200" height="90" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1"/>
        <text x="760" y="55" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">OVERALL HEALTH</text>
        <text x="760" y="90" fill="${score >= 70 ? '#34d399' : score >= 45 ? '#fbbf24' : '#f87171'}" font-size="28" text-anchor="middle" font-weight="bold">${score}/100</text>
        <text x="760" y="110" fill="#e2e8f0" font-size="12" text-anchor="middle">${rating}</text>

        <!-- 8 Dimensions Visual Grid -->
        <text x="40" y="150" fill="#38bdf8" font-size="16" font-weight="bold">The Eight Commercial Health Dimensions</text>
        ${dims.map((d, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 40 + col * 420;
          const y = 170 + row * 90;
          const color = d.status === 'healthy' ? '#10b981' : d.status === 'needs_attention' ? '#f59e0b' : d.status === 'at_risk' ? '#ef4444' : '#3b82f6';
          return `
            <g>
              <rect x="${x}" y="${y}" width="400" height="75" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
              <circle cx="${x + 25}" cy="${y + 25}" r="8" fill="${color}"/>
              <text x="${x + 45}" y="${y + 29}" fill="#ffffff" font-size="13" font-weight="bold">${d.title}</text>
              <text x="${x + 380}" y="${y + 29}" fill="${color}" font-size="11" font-weight="bold" text-anchor="end">${d.status.toUpperCase()}</text>
              <text x="${x + 45}" y="${y + 52}" fill="#94a3b8" font-size="11">${(d.notes || 'No specific notes entered').substring(0, 48)}...</text>
            </g>
          `;
        }).join('')}

        <!-- Footer -->
        <rect x="40" y="535" width="820" height="40" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
        <text x="55" y="560" fill="#94a3b8" font-size="11">Primary Objective: ${profile.primaryObjective.substring(0, 60)}... • Confirmed Evidence-Based Assessment</text>
      </svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}_Health_Infographic.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadStatus('Business Health Infographic (.svg) downloaded successfully!');
    setTimeout(() => setDownloadStatus(null), 3500);
  };

  // 4. Generate clean Markdown Summary (.md)
  const handleDownloadMarkdown = () => {
    let md = `# ${profile.name} — Commercial Turnaround Report\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}  \n`;
    md += `**Case ID:** ${profile.caseId}  \n`;
    md += `**Industry:** ${profile.industry} (${profile.businessType})  \n`;
    md += `**Location:** ${profile.country} (${profile.currency})  \n`;
    md += `**Workforce:** ${profile.employeeCount} staff, ${profile.subcontractorCount} subcontractors  \n\n`;
    
    md += `## 1. Business Essentials\n`;
    md += `- **Primary Objective:** ${profile.primaryObjective}\n`;
    md += `- **Primary Concern:** ${profile.primaryConcern || 'Unspecified'}\n`;
    md += `- **Products / Services:** ${profile.mainProductsServices}\n`;
    md += `- **Target Customers:** ${profile.mainCustomerTypes}\n\n`;

    if (overallHealth) {
      md += `## 2. Business Health Summary\n`;
      md += `- **Overall Rating:** ${overallHealth.overallRating} (${overallHealth.overallScore}/100)\n`;
      md += `- **Assessment Date:** ${overallHealth.assessmentDate}\n`;
      md += `- **Critical Risks:**\n`;
      overallHealth.criticalRisksIdentified.forEach(r => md += `  * ${r}\n`);
      md += `- **Core Strengths:**\n`;
      overallHealth.strongestAreas.forEach(s => md += `  * ${s}\n`);
      md += `\n`;
    }

    md += `## 3. Eight Commercial Health Dimensions\n\n`;
    Object.values(healthInputs).forEach(h => {
      md += `### ${h.title}\n`;
      md += `- **Status:** ${h.status.toUpperCase()}\n`;
      md += `- **Operational Notes:** ${h.notes || 'None provided'}\n\n`;
    });

    if (recommendations) {
      md += `## 4. Turnaround Recommendations\n\n`;
      md += `### Primary Observation\n${recommendations.initialObservation}\n\n`;
      md += `### Commercial Why\n${recommendations.commercialWhy}\n\n`;
      md += `### Strategic Recommendation\n${recommendations.initialRecommendation}\n\n`;
      md += `### Immediate 48-Hour Action\n${recommendations.immediateAction}\n\n`;
      if (recommendations.specialistAdviceNeeded) {
        md += `### Specialist Advice Trigger\n${recommendations.specialistAdviceNeeded}\n\n`;
      }
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}_Briefing.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadStatus('Markdown report downloaded successfully!');
    setTimeout(() => setDownloadStatus(null), 3500);
  };

  // 5. Generate JSON Raw Data Backup (.json)
  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(caseRecord, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}_CaseData.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadStatus('JSON data export downloaded successfully!');
    setTimeout(() => setDownloadStatus(null), 3500);
  };

  // 6. Generate CSV Spreadsheet (.csv)
  const handleDownloadCsv = () => {
    const rows = [
      ['Dimension', 'Status', 'Evidence Basis', 'Notes'],
      ...Object.values(healthInputs).map(h => [
        `"${h.title.replace(/"/g, '""')}"`,
        `"${h.status}"`,
        `"${h.evidenceType}"`,
        `"${(h.notes || '').replace(/"/g, '""')}"`
      ])
    ];

    if (financials) {
      rows.push([]);
      rows.push(['Financial Metric', 'Value', 'Currency']);
      rows.push(['Annual Revenue', financials.annualRevenue?.toString() || '', profile.currency]);
      rows.push(['Reported Operating Profit', financials.operatingProfit?.toString() || '', profile.currency]);
      rows.push(['Accounts Receivable', financials.accountsReceivable?.toString() || '', profile.currency]);
      rows.push(['Overdue Receivables', financials.overdueReceivables?.toString() || '', profile.currency]);
      rows.push(['Available Cash', financials.cashInBank?.toString() || '', profile.currency]);
      rows.push(['Overdraft / Credit Drawn', financials.creditFacilityUsed?.toString() || '', profile.currency]);
      rows.push(['Overdraft / Credit Limit', financials.creditFacilityLimit?.toString() || '', profile.currency]);
    }

    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}_Scorecard.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadStatus('CSV scorecard exported successfully!');
    setTimeout(() => setDownloadStatus(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 space-y-5 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Export Executive Reports & Presentation Deck</h3>
              <p className="text-xs text-slate-400">Current case: {profile.name} ({profile.country})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {downloadStatus && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{downloadStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Option 1: PDF Print */}
          <button
            onClick={() => {
              onClose();
              onPrintReport();
            }}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 hover:bg-slate-850 transition text-left flex flex-col justify-between space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-xs block group-hover:text-amber-400">
                PDF / Print Report
              </span>
              <span className="text-[11px] text-slate-400">
                Formatted executive memo via browser print
              </span>
            </div>
          </button>

          {/* Option 2: Word Document */}
          <button
            onClick={handleDownloadWordDoc}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 hover:bg-slate-850 transition text-left flex flex-col justify-between space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-xs block group-hover:text-amber-400">
                Word Document (.doc)
              </span>
              <span className="text-[11px] text-slate-400">
                Native Word/Google Docs formatted report
              </span>
            </div>
          </button>

          {/* Option 3: PowerPoint Deck */}
          <button
            onClick={handleDownloadPowerPointDeck}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 hover:bg-slate-850 transition text-left flex flex-col justify-between space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-xs block group-hover:text-amber-400">
                PowerPoint (.ppt)
              </span>
              <span className="text-[11px] text-slate-400">
                Executive briefing slide presentation
              </span>
            </div>
          </button>

          {/* Option 4: Business Health Infographic */}
          <button
            onClick={handleDownloadInfographic}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 hover:bg-slate-850 transition text-left flex flex-col justify-between space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-xs block group-hover:text-amber-400">
                Health Infographic
              </span>
              <span className="text-[11px] text-slate-400">
                Vector 8D scorecard infographic (.svg)
              </span>
            </div>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadMarkdown}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
              title="Download structured Markdown summary"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
              title="Export scorecard & financials as CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scorecard (.csv)</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
              title="Download full case data as portable JSON"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Data (.json)</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Case ID: {profile.caseId}
          </span>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Every export is strictly compiled from the active case (<strong>{profile.name}</strong>) and excludes information from other businesses.
          </span>
        </div>
      </div>
    </div>
  );
};
