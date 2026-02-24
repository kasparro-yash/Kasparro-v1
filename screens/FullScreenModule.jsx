"use client";
import { useState } from "react";
import { useTheme, tk, scoreColor, scoreBg } from "../lib/theme";
import FindingCard from "../components/FindingCard";
import ScoreBar from "../components/ScoreBar";
import Heatmap from "../components/Heatmap";
import EvidenceList from "../components/EvidenceList";
import EvidenceDrawer from "../components/EvidenceDrawer";

/**
 * FullScreenModule — full-page view of a single module.
 * Props:
 *   m      — module object
 *   onBack — () => void  (returns to Report)
 */
export default function FullScreenModule({ m, onBack }) {
  const { isDark } = useTheme();
  const t = tk(isDark);
  const [tab, setTab]           = useState("findings");
  const [showDelta, setShowDelta] = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [drawerFinding, setDrawerFinding] = useState(null);
  const tabs = ["findings", "score breakdown", "evidence", "patterns", "actions"];

  const driverCls = (i) =>
    i === 0 ? t.driverBad : i === 1 ? t.driverWarn : t.driverNeutral;

  return (
    <>
      <div className={`flex-1 overflow-y-auto ${t.canvas}`}>
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* Back */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className={`text-xs ${t.ctaGhost} px-3 py-1.5 rounded-lg transition-colors`}
            >
              ← Back to report
            </button>
          </div>

          {/* Module header card */}
          <div className={`${t.card} rounded-2xl border ${t.border} shadow-sm p-6 mb-6`}>
            <div className="flex items-start gap-6 mb-4">
              <div className={`rounded-xl px-6 py-4 flex flex-col items-center flex-shrink-0 ${scoreBg(m.final_score, isDark)}`}>
                <span className={`text-4xl font-black leading-none ${scoreColor(m.final_score, isDark)}`}>{m.final_score}</span>
                <span className={`text-xs ${t.textMuted} mt-1`}>/ 100</span>
              </div>
              <div className={`flex-shrink-0 ${t.northStar} rounded-xl px-5 py-3`}>
                <p className="text-xs opacity-60 mb-0.5">{m.north_star.label}</p>
                <p className="text-2xl font-black leading-none">{m.north_star.value}</p>
                <p className={`text-xs mt-0.5 ${m.north_star.positive ? "text-emerald-400" : "text-red-400"}`}>{m.north_star.delta}</p>
              </div>
              <div className="flex-1">
                <h1 className={`text-xl font-bold ${t.textPrimary} mb-1`}>{m.display_name}</h1>
                <p className={`text-sm ${t.textSecondary} leading-relaxed italic mb-3`}>"{m.interpretation}"</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.drivers.map((d, i) => (
                    <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-medium ${driverCls(i)}`}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-6 text-xs ${t.textMuted} pt-3 border-t ${t.border}`}>
              <span>Confidence <span className={`font-semibold ${t.textSecondary}`}>{Math.round(m.confidence * 100)}%</span></span>
              <span>Coverage <span className={`font-semibold ${t.textSecondary}`}>{Math.round(m.coverage * 100)}%</span></span>
              <span className={m.findings.some(f => f.priority === "P0") ? "text-red-400 font-semibold" : ""}>
                {m.findings.filter(f => f.priority === "P0").length} critical · {m.findings.filter(f => f.priority === "P1").length} important · {m.findings.filter(f => f.priority === "P2").length} monitor
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex border-b ${t.border} ${t.card} rounded-t-xl px-4 shadow-sm`}>
            {tabs.map(tb => (
              <button key={tb} onClick={() => setTab(tb)}
                className={`text-sm font-semibold capitalize px-5 py-3.5 border-b-2 transition-all whitespace-nowrap ${tab === tb ? t.tabActive : t.tabInact}`}>
                {tb}
              </button>
            ))}
          </div>

          {/* Tab body */}
          <div className={`${t.surface} border border-t-0 ${t.border} rounded-b-xl p-6 shadow-sm`}>
            {tab === "findings" && (
              <div className="space-y-4 max-w-2xl">
                {m.findings.map((f, i) => (
                  <FindingCard
                    key={i}
                    f={f}
                    onViewEvidence={(f) => { setDrawerFinding(f); setDrawerOpen(true); }}
                  />
                ))}
              </div>
            )}
            {tab === "score breakdown" && (
              <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-5">
                  <p className={`text-sm ${t.textMuted}`}>Gray line marks category benchmark.</p>
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
              <div className="max-w-2xl space-y-3">
                {m.actions.map((a, i) => (
                  <div key={i} className={`flex items-start gap-4 ${t.elevated} rounded-xl border ${t.border} px-5 py-4`}>
                    <span className={`w-7 h-7 rounded-full ${isDark ? "bg-[#8B5CF6]" : "bg-slate-900"} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
                      {i + 1}
                    </span>
                    <p className={`text-sm ${t.textSecondary} leading-relaxed`}>{a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <EvidenceDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        finding={drawerFinding}
        moduleData={m}
      />
    </>
  );
}
