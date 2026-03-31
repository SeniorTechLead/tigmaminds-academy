export default function BoatBuoyancyDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 620 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Buoyancy diagram comparing a floating boat and a sinking block, showing weight and buoyant force arrows"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .formula { font-family: system-ui, sans-serif; font-size: 11px; font-style: italic; }
          @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          .bobbing { animation: bob 3s ease-in-out infinite; }
          @keyframes sink {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(3px); }
          }
          .sinking { animation: sink 2.5s ease-in-out infinite; }
        `}</style>

        {/* Background */}
        <rect width="620" height="440" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="310" y="28" textAnchor="middle" className="title fill-amber-300">
          Why Do Boats Float? — Archimedes' Principle
        </text>

        {/* === LEFT: Floating Boat === */}
        <text x="160" y="58" textAnchor="middle" className="label fill-green-400" fontWeight="700">
          Floats \u2714
        </text>

        {/* Water */}
        <rect x="30" y="200" width="260" height="170" rx="4" fill="#1e3a5f" opacity="0.6" />
        <line x1="30" y1="200" x2="290" y2="200" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6,3" />
        <text x="40" y="196" className="small fill-blue-400">waterline</text>

        {/* Boat hull (cross-section) */}
        <g className="bobbing">
          {/* Hull shape */}
          <path d="M 90 200 L 80 240 Q 160 270 240 240 L 230 200 Z"
            fill="#92400e" stroke="#d97706" strokeWidth="1.5" />
          {/* Air inside hull */}
          <path d="M 95 200 L 88 230 Q 160 255 232 230 L 225 200 Z"
            fill="#fbbf24" opacity="0.15" />
          <text x="160" y="222" textAnchor="middle" className="small fill-amber-300">air inside</text>

          {/* Deck */}
          <rect x="90" y="188" width="140" height="12" rx="2" fill="#78350f" stroke="#d97706" strokeWidth="1" />

          {/* Person on boat */}
          <circle cx="160" cy="172" r="8" fill="#fbbf24" />
          <line x1="160" y1="180" x2="160" y2="188" stroke="#fbbf24" strokeWidth="2" />
        </g>

        {/* Weight arrow (down) */}
        <line x1="160" y1="140" x2="160" y2="160" stroke="#ef4444" strokeWidth="2.5" />
        <polygon points="160,165 155,155 165,155" fill="#ef4444" />
        <text x="175" y="148" className="label fill-red-400">Weight (W)</text>

        {/* Buoyant force arrow (up) */}
        <line x1="160" y1="285" x2="160" y2="265" stroke="#22c55e" strokeWidth="2.5" />
        <polygon points="160,260 155,270 165,270" fill="#22c55e" />
        <text x="198" y="282" className="label fill-green-400">Buoyant force (F</text>
        <text x="282" y="286" className="small fill-green-400">B</text>
        <text x="288" y="282" className="label fill-green-400">)</text>

        {/* Displaced water label */}
        <path d="M 90 240 Q 160 270 240 240" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3,2" />
        <text x="160" y="302" textAnchor="middle" className="small fill-blue-300">
          Displaced water weight = Boat weight
        </text>

        {/* Equation */}
        <text x="160" y="330" textAnchor="middle" className="formula fill-green-300">
          F_B = \u03C1_water \u00D7 g \u00D7 V_displaced
        </text>
        <text x="160" y="348" textAnchor="middle" className="small fill-slate-400">
          When F_B \u2265 W \u2192 object floats
        </text>

        {/* === RIGHT: Sinking Block === */}
        <text x="460" y="58" textAnchor="middle" className="label fill-red-400" fontWeight="700">
          Sinks \u2718
        </text>

        {/* Water */}
        <rect x="330" y="200" width="260" height="170" rx="4" fill="#1e3a5f" opacity="0.6" />
        <line x1="330" y1="200" x2="590" y2="200" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6,3" />

        {/* Solid steel block */}
        <g className="sinking">
          <rect x="430" y="240" width="60" height="50" rx="3" fill="#6b7280" stroke="#9ca3af" strokeWidth="1.5" />
          <text x="460" y="270" textAnchor="middle" className="small fill-slate-300">steel</text>
          <text x="460" y="282" textAnchor="middle" className="small fill-slate-400">7800 kg/m\u00B3</text>
        </g>

        {/* Weight arrow (down, longer) */}
        <line x1="460" y1="130" x2="460" y2="225" stroke="#ef4444" strokeWidth="2.5" />
        <polygon points="460,230 455,220 465,220" fill="#ef4444" />
        <text x="500" y="172" className="label fill-red-400">W (big)</text>

        {/* Buoyant force arrow (up, shorter) */}
        <line x1="460" y1="320" x2="460" y2="305" stroke="#22c55e" strokeWidth="2.5" />
        <polygon points="460,300 455,310 465,310" fill="#22c55e" />
        <text x="503" y="318" className="label fill-green-400">F_B (small)</text>

        {/* Explanation */}
        <text x="460" y="348" textAnchor="middle" className="small fill-slate-400">
          W &gt; F_B \u2192 sinks
        </text>
        <text x="460" y="362" textAnchor="middle" className="small fill-slate-500">
          Solid steel: density &gt; water
        </text>

        {/* Key insight box */}
        <rect x="60" y="390" width="500" height="38" rx="6" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
        <text x="310" y="408" textAnchor="middle" className="small fill-blue-200">
          Key: Same steel can float or sink. A hollow hull encloses air, lowering average density.
        </text>
        <text x="310" y="422" textAnchor="middle" className="small fill-blue-300">
          Average density = total mass \u00F7 total volume (including air space)
        </text>
      </svg>
    </div>
  );
}
