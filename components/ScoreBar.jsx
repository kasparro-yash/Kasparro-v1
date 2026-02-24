"use client";
import { useTheme, tk, scoreColor, barColor } from "../lib/theme";

export default function ScoreBar({ label, value, benchmark, weight, showDelta }) {
  const { isDark } = useTheme();
  const t = tk(isDark);
  const delta = value - benchmark;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${t.textSecondary} font-medium`}>{label}</span>
          <span className={`text-xs ${t.textMuted}`}>wt. {weight}</span>
        </div>
        <div className="flex items-center gap-3">
          {showDelta && (
            <span className={`text-xs font-semibold ${
              delta >= 0
                ? (isDark ? "text-emerald-400" : "text-emerald-600")
                : (isDark ? "text-red-400"     : "text-red-600")
            }`}>
              {delta >= 0 ? "+" : ""}{delta} vs avg
            </span>
          )}
          <span className={`text-sm font-bold ${scoreColor(value, isDark)}`}>{value}</span>
        </div>
      </div>
      <div className={`relative h-2.5 ${t.progressTrack} rounded-full`}>
        <div
          className={`h-full rounded-full transition-all ${barColor(value)}`}
          style={{ width: `${value}%` }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-0.5 h-5 ${isDark ? "bg-[#475569]" : "bg-gray-500"} opacity-60 rounded-full`}
          style={{ left: `${benchmark}%` }}
        />
      </div>
      <div className={`flex items-center justify-between mt-1 text-xs ${t.textMuted}`}>
        <span>0</span>
        <span style={{ marginLeft: `${Math.max(0, benchmark - 4)}%` }}>▲ {benchmark} avg</span>
        <span>100</span>
      </div>
    </div>
  );
}
