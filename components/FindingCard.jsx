"use client";
import { useTheme, tk } from "../lib/theme";

/**
 * FindingCard
 * Props:
 *   f               — finding object
 *   onViewEvidence  — (finding) => void  | null
 *   onFocusModule   — (module_name) => void | null
 */
export default function FindingCard({ f, onViewEvidence, onFocusModule }) {
  const { isDark } = useTheme();
  const t = tk(isDark);

  const dot      = f.priority === "P0" ? "bg-red-500"   : f.priority === "P1" ? "bg-amber-400" : "bg-sky-400";
  const tag      = f.priority === "P0" ? t.p0tag        : f.priority === "P1" ? t.p1tag        : t.p2tag;
  const ring     = f.priority === "P0" ? t.p0ring       : f.priority === "P1" ? t.p1ring       : t.p2ring;
  const label    = f.priority === "P0" ? "Act now"      : f.priority === "P1" ? "This week"    : "Backlog";
  const impactCls =
    f.priority === "P0" ? (isDark ? "bg-red-900/25 text-red-400"     : "bg-red-50 text-red-600")   :
    f.priority === "P1" ? (isDark ? "bg-amber-900/25 text-amber-400" : "bg-amber-50 text-amber-700") :
                          (isDark ? "bg-sky-900/25 text-sky-400"     : "bg-sky-50 text-sky-700");

  return (
    <div className={`${t.card} rounded-xl border ${t.border} p-4 ${ring} shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${tag}`}>{label}</span>
              {f.module && (
                <button
                  onClick={() => onFocusModule?.(f.module_name)}
                  className={`text-xs ${t.textMuted} hover:text-[#8B5CF6] hover:underline transition-colors`}
                  title="Open module deep dive"
                >
                  {f.module}
                </button>
              )}
            </div>
            {f.impact_metric && (
              <span className={`text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded-md ${impactCls}`}>
                {f.impact_metric}
              </span>
            )}
          </div>
          <p className={`text-sm font-semibold ${t.textPrimary} mb-1 leading-snug`}>{f.title}</p>
          <p className={`text-xs ${t.textMuted} mb-3 leading-relaxed`}>{f.score_basis}</p>
          <div className={`flex items-start gap-2 ${t.findingAction} rounded-lg p-2.5 mb-2`}>
            <span className={`${t.textMuted} text-xs mt-0.5 flex-shrink-0`}>→</span>
            <p className={`text-xs ${t.textSecondary} leading-relaxed`}>{f.action}</p>
          </div>
          <div className="flex items-center gap-3">
            {onViewEvidence && f.evidence_refs?.length > 0 && (
              <button
                onClick={() => onViewEvidence(f)}
                className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors"
              >
                View evidence →
              </button>
            )}
            {onFocusModule && f.module_name && (
              <button
                onClick={() => onFocusModule(f.module_name)}
                className={`text-xs ${t.textMuted} ${t.hoverTextPrimary} font-medium transition-colors`}
              >
                Go to module →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
