"use client";
import { useState, useEffect } from "react";
import { useTheme, tk, scoreColor } from "../lib/theme";
import { BRAND, mockProgressModules } from "../lib/mockData";
import ModeBadge from "../components/ModeBadge";

const FINAL_SCORES = [82, 43, 78, 71, 58, 66, 89];

export default function Progress({ onNav }) {
  const { isDark } = useTheme();
  const t = tk(isDark);
  const [pct, setPct] = useState(62);
  const [modules, setModules] = useState(mockProgressModules);
  const [done, setDone] = useState(false);

  // Advance overall progress bar
  useEffect(() => {
    if (done) return;
    const timer = setInterval(() => {
      setPct(p => {
        if (p >= 100) { clearInterval(timer); setDone(true); setTimeout(() => onNav("report"), 1400); return 100; }
        return Math.min(100, p + Math.random() * 2);
      });
    }, 500);
    return () => clearInterval(timer);
  }, [done]);

  // Advance individual module statuses as pct crosses thresholds
  useEffect(() => {
    if (pct >= 74  && modules[2].status === "in_progress") setModules(p => p.map((m, i) => i === 2 ? { ...m, status: "completed", final_score: 78 } : i === 3 ? { ...m, status: "in_progress" } : m));
    if (pct >= 85  && modules[3].status === "in_progress") setModules(p => p.map((m, i) => i === 3 ? { ...m, status: "completed", final_score: 71 } : i === 4 ? { ...m, status: "in_progress" } : m));
    if (pct >= 93  && modules[4].status === "in_progress") setModules(p => p.map((m, i) => i === 4 ? { ...m, status: "completed", final_score: 58 } : i === 5 ? { ...m, status: "in_progress" } : m));
    if (pct >= 100) setModules(p => p.map((m, i) => ({ ...m, status: "completed", final_score: m.final_score ?? FINAL_SCORES[i] })));
  }, [pct]);

  const statusIcon = {
    completed:   { icon: "✓", cls: "text-emerald-400" },
    in_progress: { icon: "◌", cls: "text-[#8B5CF6] animate-pulse" },
    pending:     { icon: "○", cls: t.textMuted },
  };

  return (
    <div className={`flex-1 overflow-y-auto ${t.canvas}`}>
      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className={`text-xl font-bold ${t.textPrimary}`}>{BRAND.name}</h1>
              <ModeBadge mode="robust" />
            </div>
            <p className={`text-sm ${t.textMuted}`}>Audit started 23 Feb · 14:32</p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-black ${t.textPrimary}`}>{Math.round(pct)}%</p>
            {done
              ? <p className="text-xs text-emerald-400 font-semibold">Complete ✓</p>
              : <p className={`text-xs ${t.textMuted}`}>~{Math.max(1, Math.round((100 - pct) / 2 * 0.5))} min left</p>
            }
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className={`w-full h-2.5 ${t.progressTrack} rounded-full overflow-hidden`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-500" : "bg-[#8B5CF6]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Module status list */}
        <div className={`${t.card} rounded-2xl border ${t.border} shadow-sm overflow-hidden mb-5`}>
          {modules.map((m, i) => {
            const s = statusIcon[m.status];
            return (
              <div
                key={m.module_name}
                className={`flex items-center gap-4 px-5 py-3.5 ${i < modules.length - 1 ? `border-b ${t.border}` : ""}`}
              >
                <span className={`text-lg w-5 text-center flex-shrink-0 ${s.cls}`}>{s.icon}</span>
                <span className={`flex-1 text-sm ${t.textPrimary} font-medium`}>{m.display_name}</span>
                {m.status === "completed" && m.final_score !== null
                  ? <span className={`text-sm font-bold ${scoreColor(m.final_score, isDark)}`}>{m.final_score}</span>
                  : <span className={`text-xs ${t.textMuted}`}>{m.status === "in_progress" ? "Running..." : m.status}</span>
                }
              </div>
            );
          })}
        </div>

        <p className={`text-xs ${t.textMuted} text-center`}>
          You can close this tab — the audit continues in the background.
        </p>
      </div>
    </div>
  );
}
