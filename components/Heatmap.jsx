"use client";
import { useTheme, tk, heatColor } from "../lib/theme";

export default function Heatmap({ data }) {
  const { isDark } = useTheme();
  const t = tk(isDark);

  return (
    <div className="overflow-x-auto">
      <p className={`text-xs ${t.textMuted} mb-3 font-medium`}>{data.title}</p>
      <div className="inline-block min-w-full">
        <div className="flex mb-1 ml-24">
          {data.cols.map(c => (
            <div key={c} className={`flex-1 text-center text-xs ${t.textMuted} font-medium px-1 min-w-14`}>{c}</div>
          ))}
        </div>
        {data.rows.map((row, ri) => (
          <div key={ri} className="flex items-center gap-1 mb-1">
            <div className={`w-24 text-xs ${t.textSecondary} font-medium text-right pr-2 flex-shrink-0 truncate`}>{row}</div>
            {data.values[ri].map((v, ci) => (
              <div
                key={ci}
                className={`flex-1 min-w-14 h-10 rounded-md flex items-center justify-center text-xs font-bold ${heatColor(v, isDark)}`}
              >
                {v}%
              </div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-3">
          <span className={`text-xs ${t.textMuted}`}>Low</span>
          {[10, 30, 50, 70, 90].map(v => (
            <div key={v} className={`w-6 h-3 rounded ${heatColor(v, isDark)}`} />
          ))}
          <span className={`text-xs ${t.textMuted}`}>High</span>
        </div>
      </div>
    </div>
  );
}
