"use client";
import { useState } from "react";
import { useTheme, tk } from "../lib/theme";
import { BRAND } from "../lib/mockData";
import ModeBadge from "../components/ModeBadge";

const MODES = [
  { id: "lite",   modules: 2, time: "~2 min",  desc: "Fast directional scan. AI visibility + SERP schema only." },
  { id: "medium", modules: 4, time: "~10 min", desc: "Standard 4-module report with full narrative and priority findings." },
  { id: "robust", modules: 7, time: "~30 min", desc: "Complete 7-module audit. Full priority framework. Client-ready." },
];

export default function NewAudit({ onNav }) {
  const { isDark } = useTheme();
  const t = tk(isDark);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(null);
  const [competitors, setCompetitors] = useState(["garden-of-life.com"]);
  const [compInput, setCompInput] = useState("");

  const totalSteps = mode === "robust" ? 3 : 2;
  const addComp = () => { if (compInput) { setCompetitors([...competitors, compInput]); setCompInput(""); } };

  return (
    <div className={`flex-1 overflow-y-auto ${t.canvas}`}>
      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Brand context bar */}
        <div className={`${isDark ? "bg-[#1E293B]" : "bg-slate-900"} rounded-xl px-4 py-3 mb-6 flex items-center justify-between`}>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Running audit for</p>
            <p className="text-sm font-bold text-white">{BRAND.name} · {BRAND.domain}</p>
          </div>
          <span className="text-slate-500 text-xs">Step {step} of {totalSteps}</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s
                  ? (isDark ? "bg-[#8B5CF6] text-white" : "bg-slate-900 text-white")
                  : `${t.elevated} ${t.textMuted} border ${t.border}`
              }`}>{s}</div>
              {s < totalSteps && (
                <div className={`w-16 h-0.5 ${step > s ? (isDark ? "bg-[#8B5CF6]" : "bg-slate-900") : t.progressTrack}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Choose mode */}
        {step === 1 && (
          <div>
            <h2 className={`text-lg font-bold ${t.textPrimary} mb-4`}>Choose audit mode</h2>
            <div className="space-y-3 mb-5">
              {MODES.map(m2 => (
                <button key={m2.id} onClick={() => setMode(m2.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    mode === m2.id
                      ? (isDark ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-slate-900 bg-slate-50 ring-1 ring-slate-900")
                      : `${t.border} ${t.card} ${t.hover}`
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <ModeBadge mode={m2.id} />
                        {mode === m2.id && (
                          <span className={isDark ? "text-[#A78BFA] font-bold" : "text-slate-900 font-bold"}>✓</span>
                        )}
                      </div>
                      <p className={`text-sm ${t.textSecondary}`}>{m2.desc}</p>
                    </div>
                    <div className={`text-right text-xs ${t.textMuted} ml-4 flex-shrink-0`}>
                      <p className={`font-semibold ${t.textSecondary}`}>{m2.modules} modules</p>
                      <p>{m2.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              disabled={!mode}
              onClick={() => setStep(2)}
              className={`w-full ${t.cta} font-semibold py-3 rounded-xl disabled:opacity-30 transition-colors`}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 (robust only) — Add competitors */}
        {step === 2 && mode === "robust" && (
          <div>
            <h2 className={`text-lg font-bold ${t.textPrimary} mb-4`}>Add competitors</h2>
            <div className="space-y-2 mb-3">
              {competitors.map(c => (
                <div key={c} className={`flex items-center gap-2 ${t.card} border ${t.border} rounded-lg px-3 py-2.5`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#8B5CF6]" : "bg-slate-400"} flex-shrink-0`} />
                  <span className={`text-sm ${t.textPrimary} flex-1`}>{c}</span>
                  <button
                    onClick={() => setCompetitors(competitors.filter(x => x !== c))}
                    aria-label={`Remove competitor ${c}`}
                    className={`${t.textMuted} hover:text-red-400`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-5">
              <input
                value={compInput}
                onChange={e => setCompInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addComp(); }}
                placeholder="competitor.com"
                className={`flex-1 text-sm border ${t.border} ${t.input} ${t.textPrimary} rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B5CF6]`}
              />
              <button
                onClick={addComp}
                className={`text-sm ${t.elevated} ${t.hover} px-4 py-2 rounded-lg font-medium ${t.textSecondary} border ${t.border}`}
              >
                + Add
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className={`flex-1 ${t.ctaGhost} font-medium py-3 rounded-xl`}>Back</button>
              <button
                onClick={() => setStep(3)}
                disabled={competitors.length === 0}
                className={`flex-1 ${t.cta} font-semibold py-3 rounded-xl disabled:opacity-30`}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Confirm & run — step 2 for lite/medium, step 3 for robust */}
        {((step === 2 && mode !== "robust") || (step === 3 && mode === "robust")) && (
          <div>
            <h2 className={`text-lg font-bold ${t.textPrimary} mb-4`}>Confirm & run</h2>
            <div className={`${t.card} border ${t.border} rounded-xl divide-y ${t.divideY} mb-5 overflow-hidden`}>
              {[
                ["Brand",    BRAND.name],
                ["Mode",     null],
                ["Modules",  `${MODES.find(m2 => m2.id === mode)?.modules} modules`],
                ["Est. time", MODES.find(m2 => m2.id === mode)?.time],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center px-4 py-3 text-sm">
                  <span className={t.textMuted}>{k}</span>
                  {k === "Mode"
                    ? <ModeBadge mode={mode} />
                    : <span className={`font-semibold ${t.textPrimary}`}>{v}</span>
                  }
                </div>
              ))}
              {mode === "robust" && (
                <div className="flex justify-between items-start px-4 py-3 text-sm">
                  <span className={t.textMuted}>Competitors</span>
                  <div className="text-right">
                    {competitors.map(c => <p key={c} className={`font-medium ${t.textPrimary}`}>{c}</p>)}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(mode === "robust" ? 2 : 1)}
                className={`flex-1 ${t.ctaGhost} font-medium py-3 rounded-xl`}
              >
                Back
              </button>
              <button
                onClick={() => onNav("progress")}
                className={`flex-1 ${t.cta} font-bold py-3 rounded-xl`}
              >
                Run audit ▸
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
