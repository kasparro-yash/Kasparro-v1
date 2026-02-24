"use client";

/**
 * KASPARRO THEME — single source of truth
 *
 * Exports:
 *   ThemeCtx   — React context, value shape: { isDark, toggleDark }
 *   useTheme   — hook: const { isDark, toggleDark } = useTheme()
 *   tk(d)      — token map, call with isDark boolean
 *   scoreColor, barColor, scoreBg, heatColor — visual helpers
 *   fmtDate    — ISO → "23 Feb 2026" (UTC-safe)
 *
 * DARK MODE PALETTE (locked)
 * Canvas:   #030307  | Surface:  #0B0B14  | Card:    #1E1E2E
 * Sidebar:  #1E293B  | Border:   #2A2A3D  | Divider: #2A2A3D
 * Primary:  #F1F5F9  | Secondary:#94A3B8  | Muted:   #475569
 * Active:   rgba(139,92,246,0.08) + 2px solid #8B5CF6 left border
 * CTA:      #8B5CF6  | Hover CTA:#7C3AED
 * Score badges: tinted bg-*-900/30 text-*-400 ring-*-400/20
 */

import { createContext, useContext } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────
// Default shape matches live value exactly — safe outside a provider.
export const ThemeCtx = createContext({ isDark: true, toggleDark: () => {} });
export const useTheme = () => useContext(ThemeCtx);

// ─── Token map ────────────────────────────────────────────────────────────────
// canvas  → outermost page bg
// surface → topnav / main bg panels
// card    → elevated content panels
// sidebar → distinct sidebar surface (warmer/bluer than card)
// elevated→ content within card (tab bodies, action lists)
export const tk = (d) => ({
  // Backgrounds
  canvas:   d ? "bg-[#030307]"        : "bg-gray-50",
  surface:  d ? "bg-[#0B0B14]"        : "bg-white",
  card:     d ? "bg-[#1E1E2E]"        : "bg-white",
  sidebar:  d ? "bg-[#1E293B]"        : "bg-white",
  elevated: d ? "bg-[#1E293B]"        : "bg-gray-50",
  input:    d ? "bg-[#1E1E2E]"        : "bg-gray-50",
  hover:    d ? "hover:bg-[#1E1E2E]"  : "hover:bg-gray-50",
  // Borders
  border:   d ? "border-[#2A2A3D]"           : "border-gray-200",
  borderTop:d ? "border-t border-[#2A2A3D]"  : "border-t border-gray-100",
  borderT:  d ? "border-t border-[#2A2A3D]"  : "border-t border-gray-100",
  divideY:  d ? "divide-y divide-[#2A2A3D]"  : "divide-y divide-gray-100",
  // Text
  textPrimary:   d ? "text-[#F1F5F9]" : "text-gray-900",
  textSecondary: d ? "text-[#94A3B8]" : "text-gray-600",
  textMuted:     d ? "text-[#475569]" : "text-gray-400",
  textLabel:     d ? "text-[#64748B]" : "text-gray-500",
  // Hover text — static tokens, Tailwind JIT-safe (no hover:${} concatenation)
  hoverTextPrimary:   d ? "hover:text-[#F1F5F9]" : "hover:text-gray-900",
  hoverTextSecondary: d ? "hover:text-[#94A3B8]" : "hover:text-gray-700",
  hoverTextMuted:     d ? "hover:text-[#64748B]" : "hover:text-gray-600",
  // CTA
  cta:      d ? "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white" : "bg-slate-900 hover:bg-slate-700 text-white",
  ctaGhost: d ? "border border-[#2A2A3D] text-[#94A3B8] hover:bg-[#1E1E2E]" : "border border-gray-200 text-gray-500 hover:bg-gray-50",
  // Tabs
  tabActive: d ? "border-[#8B5CF6] text-[#A78BFA]"                      : "border-slate-900 text-slate-900",
  tabInact:  d ? "border-transparent text-[#475569] hover:text-[#94A3B8]" : "border-transparent text-gray-400 hover:text-gray-600",
  // Segmented control
  seg:      d ? "bg-[#1E1E2E]" : "bg-gray-100",
  segActive:d ? "bg-[#2A2A3D] text-[#F1F5F9] shadow-sm" : "bg-white text-gray-900 shadow-sm",
  segInact: d ? "text-[#475569] hover:text-[#94A3B8]"   : "text-gray-500 hover:text-gray-700",
  // Mode badge
  modeLite:   d ? "bg-[#1E1E2E] text-[#94A3B8] border border-[#2A2A3D]" : "bg-gray-100 text-gray-600 border border-gray-300",
  modeMedium: d ? "bg-sky-600 text-white"   : "bg-blue-600 text-white",
  modeRobust: d ? "bg-[#8B5CF6] text-white" : "bg-slate-900 text-white",
  // Severity tags (FindingCard labels)
  p0tag:  d ? "text-red-400 bg-red-900/25 border border-red-500/30"       : "text-red-600 bg-red-50 border border-red-200",
  p1tag:  d ? "text-amber-400 bg-amber-900/25 border border-amber-500/30" : "text-amber-700 bg-amber-50 border border-amber-200",
  p2tag:  d ? "text-sky-400 bg-sky-900/25 border border-sky-500/30"       : "text-sky-700 bg-sky-50 border border-sky-200",
  p0ring: d ? "ring-1 ring-red-500/20"   : "ring-1 ring-red-200",
  p1ring: d ? "ring-1 ring-amber-500/20" : "ring-1 ring-amber-100",
  p2ring: d ? "ring-1 ring-sky-500/20"   : "ring-1 ring-sky-100",
  // Small severity pills (sidebar, rail)
  p0pill: d ? "bg-red-900/30 text-red-400 border border-red-500/30"       : "bg-red-50 text-red-600 border border-red-200",
  p1pill: d ? "bg-amber-900/30 text-amber-400 border border-amber-500/30" : "bg-amber-50 text-amber-700 border border-amber-200",
  // North star widget
  northStar: d ? "bg-[#1E293B] text-[#F1F5F9]" : "bg-slate-900 text-white",
  // Driver pills
  driverBad:     d ? "bg-red-900/25 text-red-400 border border-red-500/25"       : "bg-red-50 text-red-700 border border-red-200",
  driverWarn:    d ? "bg-amber-900/25 text-amber-400 border border-amber-500/25" : "bg-amber-50 text-amber-700 border border-amber-200",
  driverNeutral: d ? "bg-[#1E1E2E] text-[#94A3B8] border border-[#2A2A3D]"      : "bg-gray-100 text-gray-600 border border-gray-200",
  // Misc
  aiTag:            d ? "bg-[#1E293B] text-[#94A3B8]" : "bg-gray-100 text-gray-400",
  findingAction:    d ? "bg-[#1E1E2E]"                : "bg-gray-50",
  evidenceRow:      d ? "bg-[#1E1E2E]"                : "bg-gray-50",
  evidenceRowHover: d ? "hover:bg-[#1E293B]"          : "hover:bg-gray-50",
  progressTrack:    d ? "bg-[#1E1E2E]"                : "bg-gray-100",
});

// ─── Score / color helpers ────────────────────────────────────────────────────
export const scoreColor = (s, d) =>
  s >= 70 ? (d ? "text-emerald-400" : "text-emerald-600") :
  s >= 50 ? (d ? "text-amber-400"   : "text-amber-600")   :
             (d ? "text-red-400"    : "text-red-500");

export const barColor = (s) =>
  s >= 70 ? "bg-emerald-500" : s >= 50 ? "bg-amber-400" : "bg-red-400";

export const scoreBg = (s, d) =>
  s >= 70 ? (d ? "bg-emerald-900/30 ring-1 ring-emerald-400/20" : "bg-emerald-50") :
  s >= 50 ? (d ? "bg-amber-900/25 ring-1 ring-amber-400/20"     : "bg-amber-50")   :
             (d ? "bg-red-900/25 ring-1 ring-red-400/20"        : "bg-red-50");

// Dark mode uses tinted backgrounds — not pastel light-mode colours
export const heatColor = (v, d) =>
  d ? (
    v >= 80 ? "bg-emerald-900/50 text-emerald-300" :
    v >= 60 ? "bg-emerald-900/35 text-emerald-400" :
    v >= 40 ? "bg-amber-900/35 text-amber-300"     :
    v >= 20 ? "bg-orange-900/35 text-orange-300"   :
              "bg-red-900/35 text-red-300"
  ) : (
    v >= 80 ? "bg-emerald-600 text-white"   :
    v >= 60 ? "bg-emerald-400 text-white"   :
    v >= 40 ? "bg-amber-300 text-gray-800"  :
    v >= 20 ? "bg-orange-300 text-gray-800" :
              "bg-red-200 text-gray-700"
  );

// UTC-safe — prevents local timezone shifting audit dates by a day
export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    timeZone: "UTC", day: "numeric", month: "short", year: "numeric",
  });
