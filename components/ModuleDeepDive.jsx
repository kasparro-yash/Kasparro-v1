"use client";
import { useState } from "react";
import { useTheme, tk, scoreColor, scoreBg } from "../lib/theme";
import FindingCard from "./FindingCard";
import ScoreBar from "./ScoreBar";
import Heatmap from "./Heatmap";
import EvidenceList from "./EvidenceList";

/**
 * ModuleDeepDive — inline tabbed panel, rendered inside Report's right pane.
 * Props:
 *   m                — module object
 *   onOpenFullScreen — (module) => void
 *   onViewEvidence   — (finding, moduleData) => void
 */
export default function ModuleDeepDive({ m, onOpenFullScreen, onViewEvidence }) {
  const { isDark } = useTheme();
  const t = tk(isDark);
  const [tab, setTab] = useState("findings");
  const [showDelta, setShowDelta] = useState(false);
  const tabs = ["findings", "score breakdown", "evidence", "patterns", "actions"];

  const driverCls = (i) =>
    i === 0 ? t.driverBad : i === 1 ? t.driverWarn : t.driverNeutral;

  return (
    <div className={`border-t ${t.border}`}>
      {/* Module header */}
      <div className={`${t.surface} px-5 pt-4 pb-3 border-b ${t.border}`}>
        <div className="flex items-start gap-4 mb-3">
          <div className={`rounded-xl px-4 py-3 flex flex-col items-center flex-shrink-0 min-w-16 ${scoreBg(m.final_score, isDark)}`}>
            <span className={`text-3xl font-black leading-none ${scoreColor(m.final_score, isDark)}`}>{m.final_score}</span>
            <span className={`text-xs ${t.textMuted} mt-0.5`}>/ 100</span>
          </div>
          <div className={`flex-shrink-0 ${t.northStar} rounded-xl px-4 py-2.5 min-w-36`}>
            <p className="text-xs opacity-60 mb-0.5">{m.north_star.label}</p>
            <p className="text-xl font-black leading-none">{m.north_star.value}</p>
            <p className={`text-xs mt-0.5 ${m.north_star.positive ? "text-emerald-400" : "text-red-400"}`}>{m.north_star.delta}</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${t.textSecondary} leading-relaxed italic border-l-2 border-[#2A2A3D] pl-3 mb-2`}>
              "{m.interpretation}"
            </p>
            <div className="flex flex-wrap gap-1.5">
              {m.drivers.map((d, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-medium ${driverCls(i)}`}>{d}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className={`flex gap-4 text-xs ${t.textMuted}`}>
            <span>Confidence <span className={`font-semibold ${t.textSecondary}`}>{Math.round(m.confidence * 100)}%</span></span>
            <span>Coverage <span className={`font-semibold ${t.textSecondary}`}>{Math.round(m.coverage * 100)}%</span></span>
            <span className={m.findings.some(f => f.priority === "P0") ? "text-red-400 font-semibold" : t.textMuted}>
              {m.findings.filter(f => f.priority === "P0").length}P0 · {m.findings.filter(f => f.priority === "P1").length}P1 · {m.findings.filter(f => f.priority === "P2").length}P2
            </span>
          </div>
          <button
            onClick={() => onOpenFullScreen?.(m)}
            className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-semibold transition-colors"
          >
            Open full screen →
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${t.border} ${t.surface} px-4`}>
        {tabs.map(tb => (
          <button key={tb} onClick={() => setTab(tb)}
            className={`text-xs font-semibold capitalize px-4 py-3 border-b-2 transition-all whitespace-nowrap ${tab === tb ? t.tabActive : t.tabInact}`}>
            {tb}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={`${t.surface} p-5`}>
        {tab === "findings" && (
          <div className="space-y-3">
            {m.findings.length === 0
              ? <p className={`text-sm ${t.textMuted} italic`}>No findings for this module.</p>
              : m.findings.map((f, i) => (
                  <FindingCard
                    key={i}
                    f={f}
                    onViewEvidence={onViewEvidence ? (f) => onViewEvidence(f, m) : null}
                  />
                ))
            }
          </div>
        )}
        {tab === "score breakdown" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className={`text-xs ${t.textMuted}`}>Gray line = category benchmark</p>
              <button
                onClick={() => setShowDelta(!showDelta)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${showDelta ? t.cta : t.ctaGhost}`}
              >
                {showDelta ? "Hide delta" : "Show vs benchmark"}
              </button>
            </div>
            {m.score_components.map((c, i) => <ScoreBar key={i} {...c} showDelta={showDelta} />)}
          </div>
        )}
        {tab === "evidence"  && <EvidenceList evidence={m.evidence} />}
        {tab === "patterns"  && <Heatmap data={m.patterns} />}
        {tab === "actions"   && (
          <div>
            <p className={`text-xs ${t.textMuted} uppercase font-semibold tracking-wide mb-3`}>
              Recommended actions — priority order
            </p>
            <div className="space-y-2.5">
              {m.actions.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 ${t.card} rounded-xl border ${t.border} px-4 py-3.5 shadow-sm`}>
                  <span className={`w-6 h-6 rounded-full ${isDark ? "bg-[#8B5CF6]" : "bg-slate-900"} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {i + 1}
                  </span>
                  <p className={`text-sm ${t.textSecondary} leading-relaxed`}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
