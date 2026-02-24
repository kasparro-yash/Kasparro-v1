"use client";

/**
 * KASPARRO — app/page.jsx
 *
 * This file is intentionally thin. It owns:
 *   - isDark state (theme source of truth)
 *   - screen / moduleCtx routing state
 *   - ThemeCtx.Provider (broadcasts to all children)
 *
 * All UI logic lives in /screens and /components.
 * All data lives in /lib/mockData.js → swap for API hooks when ready.
 * All theme tokens live in /lib/theme.js.
 */

import { useState }       from "react";
import { ThemeCtx, tk }   from "../lib/theme";
import TopNav             from "../components/TopNav";
import Dashboard          from "../screens/Dashboard";
import NewAudit           from "../screens/NewAudit";
import Progress           from "../screens/Progress";
import Report             from "../screens/Report";
import FullScreenModule   from "../screens/FullScreenModule";

const SCREENS = {
  dashboard:  "Dashboard",
  "new-audit":"New Audit",
  progress:   "Audit Progress",
  report:     "Report View",
};

export default function App() {
  const [isDark, setIsDark]     = useState(true);   // dark mode on by default
  const [screen, setScreen]     = useState("dashboard");
  const [moduleCtx, setModuleCtx] = useState(null);

  const t = tk(isDark);

  const openModule = (m) => { setModuleCtx(m); setScreen("module"); };

  return (
    <ThemeCtx.Provider value={{ isDark, toggleDark: () => setIsDark(d => !d) }}>
      <div className={`h-screen flex flex-col ${t.canvas} font-sans`}>

        <TopNav
          onNav={setScreen}
          current={screen}
          moduleTitle={screen === "module" ? moduleCtx?.display_name : null}
        />

        {/* Dev preview screen switcher — remove before production */}
        {screen !== "module" && (
          <div className={`${t.surface} border-b ${t.border} px-6 py-2 flex items-center gap-3 z-10`}>
            <div className="flex gap-1">
              {Object.entries(SCREENS).map(([k, v]) => (
                <button key={k} onClick={() => setScreen(k)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                    screen === k ? t.cta : `${t.textMuted} ${t.hover}`
                  }`}>
                  {v}
                </button>
              ))}
            </div>
            <span className={`${t.textMuted} opacity-30`}>|</span>
            <span className={`text-xs ${t.textMuted} italic`}>dev preview · click tabs to jump screens</span>
          </div>
        )}

        {screen === "dashboard" && <Dashboard       onNav={setScreen} />}
        {screen === "new-audit" && <NewAudit         onNav={setScreen} />}
        {screen === "progress"  && <Progress         onNav={setScreen} />}
        {screen === "report"    && <Report           onOpenModule={openModule} />}
        {screen === "module" && moduleCtx && (
          <FullScreenModule m={moduleCtx} onBack={() => setScreen("report")} />
        )}

      </div>
    </ThemeCtx.Provider>
  );
}
