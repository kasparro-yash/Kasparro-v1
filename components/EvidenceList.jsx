"use client";
import { useState } from "react";
import { useTheme, tk } from "../lib/theme";

export default function EvidenceList({ evidence }) {
  const { isDark } = useTheme();
  const t = tk(isDark);
  const [expanded, setExpanded] = useState({});

  return (
    <div className="space-y-2">
      {evidence.map((e, i) => (
        <div key={i} className={`${t.card} rounded-xl border ${t.border} shadow-sm overflow-hidden`}>
          <button
            onClick={() => setExpanded(p => ({ ...p, [i]: !p[i] }))}
            className={`w-full flex items-center justify-between px-4 py-3 ${t.evidenceRowHover} transition-colors`}
          >
            <div className="flex items-center gap-3 text-left">
              <span className={`text-xs font-semibold ${t.textLabel} w-40 flex-shrink-0`}>{e.type}</span>
              <span className={`text-sm ${t.textPrimary} font-medium`}>{e.value}</span>
            </div>
            {e.rows?.length > 0 && (
              <span className="text-xs text-[#8B5CF6] font-semibold flex-shrink-0 ml-3">
                {expanded[i] ? "Hide ▲" : `${e.rows.length} rows ▼`}
              </span>
            )}
          </button>
          {expanded[i] && e.rows?.length > 0 && (
            <div className={`${t.borderT} px-4 pb-3 pt-2`}>
              <div className="grid grid-cols-3 gap-2 px-2 mb-1.5">
                {["Source / Item", "Value", "Signal"].map(h => (
                  <span key={h} className={`text-xs font-semibold ${t.textMuted} uppercase tracking-wide`}>{h}</span>
                ))}
              </div>
              {e.rows.map((row, ri) => (
                <div key={ri} className={`grid grid-cols-3 gap-2 ${t.evidenceRow} rounded-lg px-3 py-2 mb-1`}>
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
  );
}
