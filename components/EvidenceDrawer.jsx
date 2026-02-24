"use client";
import { useTheme, tk } from "../lib/theme";

/**
 * EvidenceDrawer — slide-in panel anchored right.
 * Props:
 *   isOpen     — boolean
 *   onClose    — () => void
 *   finding    — finding object | null
 *   moduleData — module object (used to look up evidence by index)
 */
export default function EvidenceDrawer({ isOpen, onClose, finding, moduleData }) {
  const { isDark } = useTheme();
  const t = tk(isDark);

  if (!isOpen || !finding) return null;

  const items = (finding.evidence_refs || [])
    .map(i => moduleData?.evidence?.[i])
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`relative w-full max-w-lg ${t.surface} border-l ${t.border} shadow-2xl flex flex-col h-full`}>
        {/* Header */}
        <div className={`flex items-start justify-between p-5 border-b ${t.border}`}>
          <div>
            <p className={`text-xs ${t.textMuted} uppercase tracking-wide font-medium mb-1`}>Evidence</p>
            <p className={`text-sm font-semibold ${t.textPrimary} leading-snug`}>{finding.title}</p>
            {finding.impact_metric && (
              <p className="text-xs font-bold text-red-400 mt-1">{finding.impact_metric}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close evidence drawer"
            className={`${t.textMuted} ${t.hoverTextPrimary} text-xl leading-none ml-4 mt-0.5`}
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {items.length === 0 && (
            <p className={`text-sm ${t.textMuted} italic`}>No evidence rows for this finding.</p>
          )}
          {items.map((ev, i) => (
            <div key={i}>
              <p className={`text-xs font-bold ${t.textMuted} uppercase tracking-wide mb-2`}>{ev.type}</p>
              <div className={`${t.elevated} rounded-xl border ${t.border} px-4 py-2.5 mb-2`}>
                <p className={`text-sm font-semibold ${t.textPrimary}`}>{ev.value}</p>
              </div>
              {ev.rows?.length > 0 && (
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-2 px-2 mb-1">
                    {["Source / Item", "Value", "Signal"].map(h => (
                      <span key={h} className={`text-xs font-semibold ${t.textMuted} uppercase tracking-wide`}>{h}</span>
                    ))}
                  </div>
                  {ev.rows.map((row, ri) => (
                    <div key={ri} className={`grid grid-cols-3 gap-2 ${t.card} rounded-lg border ${t.border} px-3 py-2.5`}>
                      <span className={`text-xs ${t.textSecondary} font-medium`}>{row.col1}</span>
                      <span className={`text-xs ${t.textPrimary} font-bold`}>{row.col2}</span>
                      <span className={`text-xs ${t.textMuted}`}>{row.col3}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
