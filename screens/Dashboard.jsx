"use client";
import { useState } from "react";
import { useTheme, tk, scoreColor, fmtDate } from "../lib/theme";
import { BRAND, mockAudits } from "../lib/mockData";
import ModeBadge from "../components/ModeBadge";

export default function Dashboard({ onNav }) {
  const { isDark } = useTheme();
  const t = tk(isDark);
  const [filter, setFilter] = useState("all");

  const filtered  = filter === "all" ? mockAudits : mockAudits.filter(a => a.status === filter);
  const scored    = mockAudits.filter(a => typeof a.overall_score === "number");
  const bestScore = scored.length ? Math.max(...scored.map(a => a.overall_score)) : null;
  const bestAudit = bestScore === null ? null : scored.find(a => a.overall_score === bestScore);

  const statusCfg = {
    completed: { dot: "bg-emerald-500",           text: isDark ? "text-emerald-400" : "text-emerald-700", label: "Completed"       },
    running:   { dot: "bg-blue-500 animate-pulse", text: "text-blue-500",                                  label: "Running"         },
    queued:    { dot: "bg-gray-400",               text: t.textMuted,                                      label: "Queued"          },
    failed:    { dot: "bg-red-500",                text: "text-red-400",                                   label: "Failed"          },
    partial:   { dot: "bg-amber-400",              text: isDark ? "text-amber-400" : "text-amber-700",     label: "Partial results" },
  };

  return (
    <div className={`flex-1 overflow-y-auto ${t.canvas}`}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Brand card */}
        <div className={`${t.card} rounded-2xl border ${t.border} shadow-sm p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs ${t.textMuted} uppercase tracking-widest font-medium mb-1`}>Your brand</p>
              <h1 className={`text-2xl font-black ${t.textPrimary}`}>{BRAND.name}</h1>
              <p className={`text-sm ${t.textMuted}`}>{BRAND.domain}</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className={`text-3xl font-black ${bestScore === null ? t.textMuted : scoreColor(bestScore, isDark)}`}>
                  {bestScore === null ? "—" : bestScore}
                </p>
                <p className={`text-xs ${t.textMuted} mt-0.5`}>Best score</p>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-black ${bestScore === null ? t.textMuted : scoreColor(bestScore, isDark)}`}>
                  {bestAudit?.grade ?? "—"}
                </p>
                <p className={`text-xs ${t.textMuted} mt-0.5`}>Best grade</p>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-black ${t.textPrimary}`}>{mockAudits.length}</p>
                <p className={`text-xs ${t.textMuted} mt-0.5`}>Audits run</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-sm font-bold ${t.textPrimary}`}>Audit History</h2>
          <div className={`flex gap-1 ${t.surface} border ${t.border} rounded-lg p-1`}>
            {["all", "running", "completed", "failed"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-md capitalize font-medium transition-all ${
                  filter === f ? t.cta : `${t.textMuted} ${t.hover}`
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Audit list */}
        <div className="space-y-3">
          {filtered.map(a => {
            const sc = statusCfg[a.status];
            return (
              <div key={a.run_id} className={`${t.card} rounded-xl border ${t.border} shadow-sm p-4 hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <ModeBadge mode={a.audit_mode} />
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                        <span className={sc.text}>{sc.label}{a.status === "running" ? ` · ${a.progress_pct}%` : ""}</span>
                      </span>
                    </div>
                    {a.status === "running" && (
                      <div className={`w-48 h-1 ${t.progressTrack} rounded-full overflow-hidden mb-2`}>
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.progress_pct}%` }} />
                      </div>
                    )}
                    <div className={`flex items-center gap-2 text-xs ${t.textMuted}`}>
                      <span>{fmtDate(a.queued_at)}</span>
                      {a.duration_seconds && <span>· {Math.round(a.duration_seconds / 60)} min</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {a.overall_score !== null && (
                      <div className="flex items-end gap-1">
                        <span className={`text-2xl font-black ${scoreColor(a.overall_score, isDark)}`}>{a.overall_score}</span>
                        <span className={`text-base font-bold mb-0.5 leading-none ${scoreColor(a.overall_score, isDark)}`}>{a.grade}</span>
                      </div>
                    )}
                    <button
                      onClick={() => onNav(
                        a.status === "completed" || a.status === "partial" ? "report" :
                        a.status === "running" ? "progress" : "dashboard"
                      )}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                        a.status === "failed"  ? (isDark ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"   : "bg-red-50 text-red-600 hover:bg-red-100")   :
                        a.status === "running" ? (isDark ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50" : "bg-blue-50 text-blue-700 hover:bg-blue-100") :
                        t.cta
                      }`}
                    >
                      {a.status === "completed" || a.status === "partial" ? "View report" : a.status === "running" ? "View status" : "Retry"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
