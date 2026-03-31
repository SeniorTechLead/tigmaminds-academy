export default function LaminarTurbulentDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 620 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Comparison of laminar flow with smooth parallel streamlines versus turbulent flow with chaotic eddies, with Reynolds number threshold">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .formula { font-family: system-ui, sans-serif; font-size: 12px; font-style: italic; }
          @keyframes flow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -40; } }
          .flowing { animation: flow 2s linear infinite; }
        `}</style>
        <rect width="620" height="380" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-cyan-700 dark:fill-cyan-300">
          Laminar vs Turbulent Flow
        </text>

        {/* LEFT: Laminar */}
        <rect x="30" y="50" width="270" height="140" rx="6" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" className="dark:fill-cyan-900/10 dark:stroke-cyan-800" />
        <text x="165" y="70" textAnchor="middle" className="label fill-cyan-600 dark:fill-cyan-400" fontWeight="700">Laminar Flow</text>
        <text x="165" y="85" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Smooth, parallel layers</text>

        {/* Pipe walls */}
        <line x1="50" y1="100" x2="280" y2="100" stroke="#64748b" strokeWidth="2" className="dark:stroke-slate-500" />
        <line x1="50" y1="175" x2="280" y2="175" stroke="#64748b" strokeWidth="2" className="dark:stroke-slate-500" />

        {/* Smooth streamlines */}
        {[110, 125, 137, 150, 163].map((y, i) => (
          <line key={i} x1="60" y1={y} x2="270" y2={y} stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="8,4" className="flowing dark:stroke-cyan-400" />
        ))}

        {/* Velocity profile (parabolic) */}
        <path d="M 55 100 Q 30 137 55 175" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <text x="35" y="142" textAnchor="end" className="small fill-amber-600 dark:fill-amber-400">fast</text>
        <text x="50" y="105" className="small fill-amber-600 dark:fill-amber-400">slow</text>

        {/* RIGHT: Turbulent */}
        <rect x="320" y="50" width="270" height="140" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" className="dark:fill-red-900/10 dark:stroke-red-800" />
        <text x="455" y="70" textAnchor="middle" className="label fill-red-600 dark:fill-red-400" fontWeight="700">Turbulent Flow</text>
        <text x="455" y="85" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Chaotic, mixing eddies</text>

        {/* Pipe walls */}
        <line x1="340" y1="100" x2="570" y2="100" stroke="#64748b" strokeWidth="2" className="dark:stroke-slate-500" />
        <line x1="340" y1="175" x2="570" y2="175" stroke="#64748b" strokeWidth="2" className="dark:stroke-slate-500" />

        {/* Chaotic swirls */}
        <path d="M 360 120 Q 380 108 400 125 Q 420 140 440 118 Q 460 100 480 130 Q 500 155 520 120 Q 540 100 560 135" fill="none" stroke="#ef4444" strokeWidth="1.5" className="dark:stroke-red-400" />
        <path d="M 360 150 Q 385 165 405 140 Q 425 118 445 155 Q 465 170 485 145 Q 505 125 525 160 Q 545 170 560 148" fill="none" stroke="#ef4444" strokeWidth="1.5" className="dark:stroke-red-400" />
        {/* Eddy circles */}
        <circle cx="420" cy="130" r="10" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        <circle cx="490" cy="145" r="8" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        <circle cx="540" cy="125" r="6" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5" />

        {/* Reynolds Number */}
        <rect x="40" y="205" width="540" height="70" rx="6" fill="#f0fdfa" stroke="#5eead4" strokeWidth="1" className="dark:fill-teal-900/15 dark:stroke-teal-700" />
        <text x="310" y="225" textAnchor="middle" className="label fill-teal-700 dark:fill-teal-300" fontWeight="600">Reynolds Number — Predicts Flow Type</text>
        <text x="310" y="248" textAnchor="middle" className="formula fill-teal-800 dark:fill-teal-200">
          Re = (\u03C1 \u00D7 v \u00D7 D) / \u03BC
        </text>
        <text x="310" y="268" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">
          \u03C1 = fluid density, v = velocity, D = pipe/river width, \u03BC = viscosity
        </text>

        {/* Threshold scale */}
        <rect x="40" y="288" width="540" height="40" rx="4" fill="none" />
        <rect x="40" y="295" width="540" height="10" rx="5" fill="#e2e8f0" className="dark:fill-slate-700" />
        {/* Gradient bar */}
        <rect x="40" y="295" width="200" height="10" rx="5" fill="#06b6d4" opacity="0.6" />
        <rect x="240" y="295" width="140" height="10" fill="#fbbf24" opacity="0.6" />
        <rect x="380" y="295" width="200" height="10" rx="5" fill="#ef4444" opacity="0.6" />

        <text x="140" y="322" textAnchor="middle" className="small fill-cyan-600 dark:fill-cyan-400" fontWeight="600">Re &lt; 2,000</text>
        <text x="140" y="335" textAnchor="middle" className="small fill-cyan-600 dark:fill-cyan-400">Laminar</text>
        <text x="310" y="322" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400" fontWeight="600">2,000\u20134,000</text>
        <text x="310" y="335" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400">Transitional</text>
        <text x="480" y="322" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Re &gt; 4,000</text>
        <text x="480" y="335" textAnchor="middle" className="small fill-red-600 dark:fill-red-400">Turbulent</text>

        {/* River note */}
        <text x="310" y="365" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">
          The Brahmaputra at Nimatighat: Re \u2248 10,000,000+ — wildly turbulent!
        </text>
      </svg>
    </div>
  );
}
