"use client";
import { useState, useMemo } from "react";
import { useTheme, tk, scoreColor, scoreBg, barColor } from "../lib/theme";
import { BRAND, mockModules } from "../lib/mockData";
import ModeBadge from "../components/ModeBadge";
import FindingCard from "../components/FindingCard";
import ModuleDeepDive from "../components/ModuleDeepDive";
import EvidenceDrawer from "../components/EvidenceDrawer";

/**
 * Report — Master-Detail layout.
 * Left: sticky sidebar nav (col-span-3), sorted worst-first.
 * Right: exclusive content pane (col-span-9) — summary or module deep dive.
 * Props:
 *   onOpenModule — (module) => void  (navigates to FullScreenModule)
 */
export default function Report({ onOpenModule }) {
  const { isDark } = useTheme();
  const t = tk(isDark);
  const [activeSection, setActiveSection]   = useState("summary");
  const [expandedFindings, setExpanded]     = useState(false);
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [drawerFinding, setDrawerFinding]   = useState(null);
  const [drawerModule, setDrawerModule]     = useState(null);

  const sortedModules = useMemo(() => [...mockModules].sort((a, b) => a.final_score - b.final_score), []);

  const selectedModule = useMemo(
    () => mockModules.find(m => m.module_name === activeSection) || null,
    [activeSection]
  );

  const allFindings = useMemo(() => {
    const order = { P0: 0, P1: 1, P2: 2 };
    return mockModules
      .flatMap(m => (m.findings || []).map(f => ({ ...f, module: m.display_name, module_name: m.module_name })))
      .sort((a, b) => order[a.priority] - order[b.priority]);
  }, []);

  const topFindings  = allFindings.slice(0, 2);
  const restFindings = allFindings.slice(2);
  const p0 = allFindings.filter(f => f.priority === "P0");
  const p1 = allFindings.filter(f => f.priority === "P1");
  const p2 = allFindings.filter(f => f.priority === "P2");

  const openEvidence = (finding) => {
    const moduleData = mockModules.find(m => m.module_name === finding.module_name) || null;
    setDrawerFinding(finding);
    setDrawerModule(moduleData);
    setDrawerOpen(true);
  };

  const handleFocusModule = (module_name) => {
    if (module_name) setActiveSection(module_name);
  };

  return (
    <>
      <div className={`flex-1 overflow-y-auto ${t.canvas}`}>
        <div className="max-w-screen-xl mx-auto px-6 py-6">

          {/* ── Header card ── */}
          <div className={`${t.card} rounded-2xl border ${t.border} shadow-sm p-6 mb-6`}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className={`text-xl font-bold ${t.textPrimary}`}>{BRAND.name}</h1>
                  <ModeBadge mode="robust" />
                </div>
                <p className={`text-xs ${t.textMuted}`}>{BRAND.domain} · 23 Feb 2026 · 28 min</p>
              </div>
              <div className="flex gap-2">
                <button className={`text-xs ${t.ctaGhost} px-3 py-1.5 rounded-lg`}>Export PDF</button>
                <button className={`text-xs ${t.ctaGhost} px-3 py-1.5 rounded-lg`}>Copy link</button>
              </div>
            </div>

            {/* Overall score + interpretation */}
            <div className="flex items-start gap-8 mb-5">
              <div className="flex-shrink-0">
                <p className={`text-xs ${t.textMuted} uppercase tracking-wide font-medium mb-1`}>AI Trust Score</p>
                <div className="flex items-end gap-2">
                  <span className={`text-5xl font-black leading-none ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>74</span>
                  <span className={`text-3xl font-bold mb-1 leading-none ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>B</span>
                </div>
              </div>
              <div className="flex-1 pt-1">
                <p className={`text-xs ${t.textMuted} uppercase tracking-wide font-medium mb-2`}>Interpretation</p>
                <p className={`text-sm ${t.textSecondary} leading-relaxed`}>
                  "Strong AI visibility for branded queries but critical SERP schema gaps are limiting structured reach. Schema and backlink work will have outsized impact."
                </p>
              </div>
            </div>

            {/* Mini bar chart — click to activate module */}
            <div>
              <p className={`text-xs ${t.textMuted} uppercase tracking-wide font-medium mb-2`}>
                Module overview
                <span className="normal-case font-normal opacity-50 ml-1">· click bar to open module · red dot = P0</span>
              </p>
              <div className="flex items-end gap-2 h-16">
                {[...mockModules].reverse().map(m => {
                  const hasP0    = m.findings.some(f => f.priority === "P0");
                  const isActive = m.module_name === activeSection;
                  return (
                    <button
                      key={m.module_name}
                      onClick={() => setActiveSection(m.module_name)}
                      title={`${m.display_name}: ${m.final_score}`}
                      className="flex-1 flex flex-col items-center justify-end gap-1 group"
                    >
                      <div className="w-full flex flex-col justify-end rounded-t overflow-hidden relative" style={{ height: 48 }}>
                        <div
                          className={`w-full rounded-sm transition-opacity ${barColor(m.final_score)} ${
                            isActive ? "opacity-100 ring-2 ring-[#8B5CF6] ring-offset-1 ring-offset-transparent" : "opacity-50 group-hover:opacity-80"
                          }`}
                          style={{ height: `${(m.final_score / 100) * 48}px` }}
                        />
                        {hasP0 && (
                          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <span className={`text-xs font-bold ${scoreColor(m.final_score, isDark)}`}>{m.final_score}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Master-Detail layout ── */}
          <div className="grid grid-cols-12 gap-6 items-start">

            {/* LEFT: Sidebar navigation */}
            <div className="col-span-12 lg:col-span-3">

              {/* Mobile pill row */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden whitespace-nowrap">
                <button
                  onClick={() => setActiveSection("summary")}
                  className={`flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                    activeSection === "summary" ? t.cta : `${t.card} border ${t.border} ${t.textSecondary} ${t.hover}`
                  }`}
                >
                  Executive Summary
                </button>
                {sortedModules.map(m => {
                  const isActive = activeSection === m.module_name;
                  const hasP0    = m.findings?.some(f => f.priority === "P0");
                  return (
                    <button key={m.module_name} onClick={() => setActiveSection(m.module_name)}
                      className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                        isActive ? t.cta : `${t.card} border ${t.border} ${t.textSecondary} ${t.hover}`
                      }`}
                    >
                      {hasP0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                      {m.display_name}
                      <span className={`font-black text-xs ml-1 ${isActive ? "text-white opacity-70" : scoreColor(m.final_score, isDark)}`}>
                        {m.final_score}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop sticky sidebar */}
              <div className="hidden lg:block sticky top-4 h-[calc(100vh-7rem)] overflow-y-auto">
                <div className={`${t.sidebar} rounded-2xl border ${t.border} shadow-sm overflow-hidden`}>

                  {/* Summary nav item */}
                  <button
                    onClick={() => setActiveSection("summary")}
                    className={`w-full text-left px-4 py-3.5 transition-all relative ${
                      activeSection === "summary" ? "bg-[#8B5CF6]/10" : t.hover
                    }`}
                  >
                    {activeSection === "summary" && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#8B5CF6] rounded-r" />
                    )}
                    <p className={`text-sm font-semibold ${activeSection === "summary" ? "text-[#F1F5F9]" : t.textSecondary}`}>
                      Executive Summary
                    </p>
                    <p className={`text-xs mt-0.5 ${t.textMuted}`}>All findings · P0/P1/P2</p>
                  </button>

                  <div className={`border-t ${t.border} mx-4`} />
                  <p className={`text-[10px] ${t.textMuted} uppercase tracking-widest font-bold px-4 py-2.5`}>
                    Modules · worst first
                  </p>

                  <div className={t.divideY}>
                    {sortedModules.map(m => {
                      const isActive = activeSection === m.module_name;
                      const hasP0    = m.findings?.some(f => f.priority === "P0");
                      const hasP1    = m.findings?.some(f => f.priority === "P1");
                      return (
                        <button
                          key={m.module_name}
                          onClick={() => setActiveSection(m.module_name)}
                          aria-current={isActive ? "page" : undefined}
                          className={`w-full text-left px-4 py-3 transition-all relative ${isActive ? "bg-[#8B5CF6]/10" : t.hover}`}
                        >
                          {isActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#8B5CF6] rounded-r" />}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                {hasP0 && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.p0pill}`}>P0</span>}
                                {!hasP0 && hasP1 && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.p1pill}`}>P1</span>}
                              </div>
                              <p className={`text-xs font-semibold leading-tight ${isActive ? "text-[#F1F5F9]" : t.textPrimary}`}>
                                {m.display_name}
                              </p>
                              <p className={`text-[10px] mt-0.5 truncate ${t.textMuted}`}>
                                {m.north_star?.label}: {m.north_star?.value}
                              </p>
                            </div>
                            <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${scoreBg(m.final_score, isDark)}`}>
                              <span className={`text-sm font-black ${scoreColor(m.final_score, isDark)}`}>{m.final_score}</span>
                            </div>
                          </div>
                          <div className={`mt-2 h-0.5 rounded-full ${isDark ? "bg-[#2A2A3D]" : "bg-gray-100"}`}>
                            <div className={`h-full rounded-full ${barColor(m.final_score)}`} style={{ width: `${m.final_score}%` }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className={`px-4 py-3 border-t ${t.border} ${t.elevated}`}>
                    <p className={`text-[10px] ${t.textMuted} leading-relaxed`}>
                      Score · P0/P1 tag<br />Click to load deep dive →
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Exclusive content pane */}
            <div className="col-span-12 lg:col-span-9 pb-24">

              {/* SUMMARY */}
              {activeSection === "summary" && (
                <div className="space-y-6">
                  <div className={`${t.card} rounded-xl border ${t.border} shadow-sm p-6`}>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className={`text-xs font-bold ${t.textMuted} uppercase tracking-widest`}>Executive Summary</h2>
                      <span className={`text-xs ${t.aiTag} px-2 py-0.5 rounded-md`}>AI-generated</span>
                    </div>
                    <p className={`text-sm ${t.textSecondary} leading-relaxed mb-3`}>
                      BrandX has a strong foundation in branded AI search visibility — scoring 82 on the AI Search Visibility module — but faces critical gaps in structured data and authority signals that limit non-branded discovery reach. The most urgent risk is SERP schema absence across 75% of product detail pages, preventing structured rich results and reducing click-through potential by an estimated 30–40%.
                    </p>
                    <p className={`text-sm ${t.textSecondary} leading-relaxed`}>
                      Combined with a below-median backlink profile (DR 28 vs category median DR 54), the brand is effectively invisible in the authority layer that AI search engines use as a trust signal. Addressing schema and backlink gaps in that order will have the highest ROI.
                    </p>
                  </div>

                  <div className={`${t.card} rounded-xl border ${t.border} shadow-sm p-5`}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className={`text-xs font-bold ${t.textMuted} uppercase tracking-widest`}>Top Priority Findings</h2>
                      <p className={`text-xs ${t.textMuted}`}>Click module tag to open deep dive →</p>
                    </div>
                    <div className="space-y-3">
                      {topFindings.map((f, i) => (
                        <FindingCard key={i} f={f} onViewEvidence={openEvidence} onFocusModule={handleFocusModule} />
                      ))}
                      {!expandedFindings && restFindings.length > 0 && (
                        <button
                          onClick={() => setExpanded(true)}
                          className={`w-full text-sm ${t.textMuted} hover:text-[#8B5CF6] py-2 font-medium border border-dashed ${t.border} rounded-lg transition-colors`}
                        >
                          + {restFindings.length} more findings
                        </button>
                      )}
                      {expandedFindings && restFindings.map((f, i) => (
                        <FindingCard key={i + 2} f={f} onViewEvidence={openEvidence} onFocusModule={handleFocusModule} />
                      ))}
                    </div>
                  </div>

                  {expandedFindings && (
                    <div className={`${t.card} rounded-xl border ${t.border} shadow-sm p-5`}>
                      <h2 className={`text-xs font-bold ${t.textMuted} uppercase tracking-widest mb-4`}>All Findings</h2>
                      {[
                        { label: "P0 — Act now",   items: p0, color: "text-red-400"   },
                        { label: "P1 — This week", items: p1, color: "text-amber-400" },
                        { label: "P2 — Backlog",   items: p2, color: "text-sky-400"   },
                      ].map(tier => tier.items.length > 0 && (
                        <div key={tier.label} className="mb-5 last:mb-0">
                          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${tier.color}`}>{tier.label}</p>
                          <div className="space-y-3">
                            {tier.items.map((f, i) => (
                              <FindingCard key={i} f={f} onViewEvidence={openEvidence} onFocusModule={handleFocusModule} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MODULE DEEP DIVE — exclusive render */}
              {selectedModule && (
                <div className={`${t.card} rounded-xl border ${t.border} shadow-sm overflow-hidden`}>
                  <div className={`px-6 py-4 border-b ${t.border} flex items-center justify-between`}>
                    <div>
                      <p className={`text-[10px] ${t.textMuted} uppercase tracking-widest font-bold mb-0.5`}>Module deep dive</p>
                      <p className={`text-lg font-bold ${t.textPrimary}`}>{selectedModule.display_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-black ${scoreColor(selectedModule.final_score, isDark)}`}>
                        {selectedModule.final_score}
                      </span>
                      <button
                        onClick={() => onOpenModule?.(selectedModule)}
                        className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-semibold border border-[#8B5CF6]/30 rounded-lg px-3 py-1.5 hover:bg-[#8B5CF6]/10 transition-colors"
                      >
                        Full screen →
                      </button>
                    </div>
                  </div>
                  <ModuleDeepDive
                    m={selectedModule}
                    onOpenFullScreen={onOpenModule}
                    onViewEvidence={(f, m) => { setDrawerFinding(f); setDrawerModule(m); setDrawerOpen(true); }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EvidenceDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        finding={drawerFinding}
        moduleData={drawerModule}
      />
    </>
  );
}
