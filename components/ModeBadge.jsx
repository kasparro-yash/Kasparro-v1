"use client";
import { useTheme, tk } from "../lib/theme";

export default function ModeBadge({ mode }) {
  const { isDark } = useTheme();
  const t = tk(isDark);
  const cls = mode === "lite" ? t.modeLite : mode === "medium" ? t.modeMedium : t.modeRobust;
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${cls}`}>
      {mode}
    </span>
  );
}
