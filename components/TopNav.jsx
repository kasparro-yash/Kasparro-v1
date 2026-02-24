"use client";
import { useTheme, tk } from "../lib/theme";
import { BRAND } from "../lib/mockData";
import ThemeToggle from "./ThemeToggle";

/**
 * TopNav
 * Props:
 *   onNav        — (screen: string) => void
 *   current      — active screen key
 *   moduleTitle  — string | null  (shows breadcrumb when in module full-screen)
 */
export default function TopNav({ onNav, current, moduleTitle }) {
  const { isDark } = useTheme();
  const t = tk(isDark);

  return (
    <div className={`h-14 ${t.surface} border-b ${t.border} flex items-center justify-between px-6 flex-shrink-0 z-20`}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNav("dashboard")}
          className={`font-black ${isDark ? "text-[#F1F5F9]" : "text-slate-900"} tracking-tight text-lg`}
        >
          KASPARRO
        </button>
        {moduleTitle && (
          <>
            <span className={t.textMuted}>/</span>
            <span className={`text-sm font-semibold ${t.textSecondary}`}>{BRAND.name}</span>
            <span className={t.textMuted}>/</span>
            <span className={`text-sm font-semibold ${t.textPrimary}`}>{moduleTitle}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {current !== "new-audit" && (
          <button
            onClick={() => onNav("new-audit")}
            className={`${t.cta} text-sm font-medium px-4 py-2 rounded-lg transition-colors`}
          >
            + Run new audit
          </button>
        )}
        {current !== "dashboard" && (
          <button
            onClick={() => onNav("dashboard")}
            className={`text-sm ${t.ctaGhost} px-3 py-1.5 rounded-lg transition-colors`}
          >
            ← Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
