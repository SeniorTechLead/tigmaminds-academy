export default function EriAhimsaDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 620 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Comparison of conventional silk production (kills pupa) versus ahimsa eri silk (moth emerges alive)"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes steam { 0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 0.7; transform: translateY(-4px); } }
          .steam { animation: steam 2s ease-in-out infinite; }
        `}</style>

        <rect width="620" height="400" rx="8" className="fill-white dark:fill-slate-900" />

        <text x="310" y="28" textAnchor="middle" className="title fill-emerald-700 dark:fill-emerald-300">
          Conventional vs Ahimsa Silk Production
        </text>

        {/* Divider */}
        <line x1="310" y1="50" x2="310" y2="380" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="6,4" className="dark:stroke-slate-700" />

        {/* LEFT: Conventional */}
        <text x="155" y="60" textAnchor="middle" className="label fill-red-600 dark:fill-red-400" fontWeight="700">Conventional (Mulberry)</text>

        {/* Step 1: Sealed cocoon */}
        <rect x="40" y="80" width="230" height="55" rx="4" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" className="dark:fill-red-900/15 dark:stroke-red-800" />
        <text x="55" y="98" className="small fill-red-700 dark:fill-red-400" fontWeight="600">Step 1: Cocoon sealed shut</text>
        <ellipse cx="200" cy="105" rx="20" ry="13" fill="#e8d5b7" stroke="#a3845c" strokeWidth="1" className="dark:fill-amber-900/40" />
        <text x="200" y="109" textAnchor="middle" className="small fill-slate-700 dark:fill-slate-300">pupa</text>
        <text x="55" y="125" className="small fill-slate-600 dark:fill-slate-400">Continuous silk thread: 600–900 m</text>

        {/* Step 2: Boiling */}
        <rect x="40" y="150" width="230" height="55" rx="4" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" className="dark:fill-red-900/15 dark:stroke-red-800" />
        <text x="55" y="168" className="small fill-red-700 dark:fill-red-400" fontWeight="600">Step 2: Cocoons boiled</text>
        {/* Pot */}
        <rect x="185" y="165" width="30" height="20" rx="3" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
        {/* Steam wisps */}
        <g className="steam">
          <path d="M 192 163 Q 190 155 195 150" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 200 163 Q 202 155 198 148" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 208 163 Q 210 155 206 150" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        </g>
        <text x="55" y="195" className="small fill-red-500 dark:fill-red-400">Pupa killed to preserve thread</text>

        {/* Step 3: Reeling */}
        <rect x="40" y="220" width="230" height="55" rx="4" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" className="dark:fill-red-900/15 dark:stroke-red-800" />
        <text x="55" y="238" className="small fill-red-700 dark:fill-red-400" fontWeight="600">Step 3: Reeling (machine)</text>
        <text x="55" y="255" className="small fill-slate-600 dark:fill-slate-400">Smooth, continuous filament</text>
        <text x="55" y="268" className="small fill-slate-600 dark:fill-slate-400">~5,000 silkworms per kg</text>

        {/* RIGHT: Ahimsa */}
        <text x="465" y="60" textAnchor="middle" className="label fill-emerald-600 dark:fill-emerald-400" fontWeight="700">Ahimsa / Eri Silk</text>

        {/* Step 1: Open cocoon */}
        <rect x="330" y="80" width="250" height="55" rx="4" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/15 dark:stroke-emerald-800" />
        <text x="345" y="98" className="small fill-emerald-700 dark:fill-emerald-400" fontWeight="600">Step 1: Cocoon open at one end</text>
        <ellipse cx="510" cy="105" rx="20" ry="13" fill="#e8d5b7" stroke="#a3845c" strokeWidth="1" className="dark:fill-amber-900/40" />
        <path d="M 529 100 Q 535 105 529 110" fill="none" stroke="#10b981" strokeWidth="2" />
        <text x="345" y="125" className="small fill-slate-600 dark:fill-slate-400">Eri cocoon has natural opening</text>

        {/* Step 2: Moth emerges */}
        <rect x="330" y="150" width="250" height="55" rx="4" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/15 dark:stroke-emerald-800" />
        <text x="345" y="168" className="small fill-emerald-700 dark:fill-emerald-400" fontWeight="600">Step 2: Moth emerges alive!</text>
        {/* Small moth */}
        <ellipse cx="520" cy="178" rx="5" ry="10" fill="#d4c5a9" stroke="#8b7355" strokeWidth="0.8" className="dark:fill-stone-600" />
        <ellipse cx="510" cy="174" rx="12" ry="7" fill="#f5e6d3" stroke="#c9a96e" strokeWidth="0.8" opacity="0.7" className="dark:fill-stone-700/60" />
        <ellipse cx="530" cy="174" rx="12" ry="7" fill="#f5e6d3" stroke="#c9a96e" strokeWidth="0.8" opacity="0.7" className="dark:fill-stone-700/60" />
        <text x="345" y="195" className="small fill-emerald-600 dark:fill-emerald-400">Moth lives to lay eggs</text>

        {/* Step 3: Spinning */}
        <rect x="330" y="220" width="250" height="55" rx="4" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/15 dark:stroke-emerald-800" />
        <text x="345" y="238" className="small fill-emerald-700 dark:fill-emerald-400" fontWeight="600">Step 3: Hand spinning (not reeling)</text>
        <text x="345" y="255" className="small fill-slate-600 dark:fill-slate-400">Short staple fibers → spun like cotton</text>
        <text x="345" y="268" className="small fill-slate-600 dark:fill-slate-400">Textured, warm fabric</text>

        {/* Summary row */}
        <rect x="40" y="295" width="230" height="85" rx="6" fill="#fef2f2" stroke="#ef4444" strokeWidth="1" className="dark:fill-red-900/10 dark:stroke-red-800" />
        <text x="155" y="315" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Result: Smooth, lustrous silk</text>
        <text x="155" y="332" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">Cost: ~5,000 lives per kg</text>
        <text x="155" y="349" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Decomposes at ~250°C</text>
        <text x="155" y="366" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Cool to touch (smooth fibers)</text>

        <rect x="330" y="295" width="250" height="85" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" className="dark:fill-emerald-900/10 dark:stroke-emerald-800" />
        <text x="455" y="315" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Result: Warm, textured silk</text>
        <text x="455" y="332" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">Cost: Zero lives</text>
        <text x="455" y="349" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Stable to ~300°C</text>
        <text x="455" y="366" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Warm (trapped air pockets)</text>
      </svg>
    </div>
  );
}
