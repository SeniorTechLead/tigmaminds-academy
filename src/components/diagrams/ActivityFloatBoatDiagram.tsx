export default function ActivityFloatBoatDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: build two foil boats, test cargo capacity and speed, record results"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .step { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .floating { animation: float 2.5s ease-in-out infinite; }
        `}</style>

        {/* Background */}
        <rect width="630" height="420" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="315" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: Build and Test Two Foil Boats
        </text>

        {/* === Step 1: Build === */}
        <text x="160" y="58" textAnchor="middle" className="step fill-blue-400">Step 1: Build</text>

        {/* Foil sheet */}
        <rect x="40" y="70" width="60" height="40" rx="2" fill="#9ca3af" opacity="0.5" stroke="#d1d5db" strokeWidth="1" />
        <text x="70" y="94" textAnchor="middle" className="small fill-slate-300">foil</text>

        {/* Arrow */}
        <line x1="110" y1="90" x2="130" y2="90" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="135,90 128,86 128,94" className="fill-gray-500 dark:fill-slate-400" />

        {/* Boat A: wide flat */}
        <g className="floating">
          <path d="M 145 80 L 140 100 L 210 100 L 205 80 Z"
            fill="#d1d5db" opacity="0.4" stroke="#e5e7eb" strokeWidth="1.5" />
          <text x="175" y="94" textAnchor="middle" className="small fill-slate-200">A: wide + flat</text>
        </g>

        {/* Foil sheet 2 */}
        <rect x="40" y="115" width="60" height="40" rx="2" fill="#9ca3af" opacity="0.5" stroke="#d1d5db" strokeWidth="1" />
        <text x="70" y="139" textAnchor="middle" className="small fill-slate-300">foil</text>

        {/* Arrow */}
        <line x1="110" y1="135" x2="130" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="135,135 128,131 128,139" className="fill-gray-500 dark:fill-slate-400" />

        {/* Boat B: narrow pointed */}
        <g className="floating" style={{ animationDelay: '0.5s' }}>
          <path d="M 140 135 L 155 120 L 210 120 L 210 150 L 155 150 Z"
            fill="#d1d5db" opacity="0.4" stroke="#e5e7eb" strokeWidth="1.5" />
          <text x="180" y="139" textAnchor="middle" className="small fill-slate-200">B: narrow + pointed</text>
        </g>

        {/* Materials list */}
        <rect x="230" y="68" width="90" height="92" rx="4" fill="#1e3a5f" opacity="0.4" />
        <text x="275" y="84" textAnchor="middle" className="small fill-cyan-300" fontWeight="600">You need:</text>
        <text x="275" y="100" textAnchor="middle" className="small fill-slate-300">2 foil sheets</text>
        <text x="275" y="114" textAnchor="middle" className="small fill-slate-300">20 coins</text>
        <text x="275" y="128" textAnchor="middle" className="small fill-slate-300">tub of water</text>
        <text x="275" y="142" textAnchor="middle" className="small fill-slate-300">ruler</text>
        <text x="275" y="156" textAnchor="middle" className="small fill-slate-300">notebook</text>

        {/* === Step 2: Cargo Test === */}
        <text x="450" y="58" textAnchor="middle" className="step fill-green-400">Step 2: Cargo Test</text>

        {/* Tub with water */}
        <path d="M 360 100 Q 360 170 450 170 Q 540 170 540 100"
          fill="none" stroke="#94a3b8" strokeWidth="2" />
        {/* Water */}
        <path d="M 365 105 Q 365 160 450 160 Q 535 160 535 105 Z"
          fill="#1e40af" opacity="0.25" />
        {/* Water surface */}
        <line x1="365" y1="105" x2="535" y2="105" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,2" />

        {/* Boat with coins */}
        <g className="floating">
          <path d="M 410 105 L 405 120 L 495 120 L 490 105 Z"
            fill="#d1d5db" opacity="0.4" stroke="#e5e7eb" strokeWidth="1" />
          {/* Coins */}
          <circle cx="430" cy="108" r="4" fill="#fbbf24" opacity="0.7" />
          <circle cx="440" cy="108" r="4" fill="#fbbf24" opacity="0.7" />
          <circle cx="450" cy="108" r="4" fill="#fbbf24" opacity="0.7" />
          <circle cx="460" cy="108" r="4" fill="#fbbf24" opacity="0.7" />
          <circle cx="470" cy="108" r="4" fill="#fbbf24" opacity="0.7" />
        </g>

        <text x="450" y="185" textAnchor="middle" className="small fill-slate-300">
          Add coins one at a time.
        </text>
        <text x="450" y="198" textAnchor="middle" className="small fill-slate-300">
          How many before it sinks?
        </text>

        {/* === Step 3: Speed Test === */}
        <text x="160" y="220" textAnchor="middle" className="step fill-purple-400">Step 3: Speed Test</text>

        {/* Tub top view */}
        <rect x="40" y="235" width="240" height="70" rx="4" fill="#1e40af" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />

        {/* Boat A */}
        <rect x="55" y="258" width="24" height="14" rx="2" fill="#d1d5db" opacity="0.5" />
        <text x="67" y="268" textAnchor="middle" className="small fill-slate-200">A</text>
        {/* Push arrow */}
        <line x1="45" y1="265" x2="53" y2="265" stroke="#a855f7" strokeWidth="2" />

        {/* Boat B */}
        <path d="M 55 290 L 62 283 L 79 283 L 79 297 L 62 297 Z"
          fill="#d1d5db" opacity="0.5" />
        <text x="70" y="293" textAnchor="middle" className="small fill-slate-200">B</text>
        {/* Push arrow */}
        <line x1="45" y1="290" x2="53" y2="290" stroke="#a855f7" strokeWidth="2" />

        {/* Distance markers */}
        <line x1="250" y1="235" x2="250" y2="305" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
        <text x="260" y="275" className="small fill-slate-400">finish</text>

        <text x="160" y="320" textAnchor="middle" className="small fill-slate-300">
          Push each with equal force. Which reaches the end first?
        </text>

        {/* === Step 4: Record === */}
        <text x="470" y="220" textAnchor="middle" className="step fill-amber-400">Step 4: Record</text>

        {/* Table */}
        <rect x="360" y="232" width="240" height="100" rx="4" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="1" />

        {/* Headers */}
        <line x1="360" y1="252" x2="600" y2="252" stroke="#334155" strokeWidth="1" />
        <line x1="440" y1="232" x2="440" y2="332" stroke="#334155" strokeWidth="1" />
        <line x1="520" y1="232" x2="520" y2="332" stroke="#334155" strokeWidth="1" />

        <text x="400" y="246" textAnchor="middle" className="small fill-slate-400">Test</text>
        <text x="480" y="246" textAnchor="middle" className="small fill-slate-400">Boat A</text>
        <text x="560" y="246" textAnchor="middle" className="small fill-slate-400">Boat B</text>

        <text x="400" y="272" textAnchor="middle" className="small fill-slate-300">Coins held</text>
        <text x="480" y="272" textAnchor="middle" className="small fill-green-300">___</text>
        <text x="560" y="272" textAnchor="middle" className="small fill-green-300">___</text>

        <line x1="360" y1="282" x2="600" y2="282" stroke="#334155" strokeWidth="0.5" />

        <text x="400" y="298" textAnchor="middle" className="small fill-slate-300">Speed</text>
        <text x="480" y="298" textAnchor="middle" className="small fill-green-300">___</text>
        <text x="560" y="298" textAnchor="middle" className="small fill-green-300">___</text>

        <line x1="360" y1="308" x2="600" y2="308" stroke="#334155" strokeWidth="0.5" />

        <text x="400" y="324" textAnchor="middle" className="small fill-slate-300">Stability</text>
        <text x="480" y="324" textAnchor="middle" className="small fill-green-300">___</text>
        <text x="560" y="324" textAnchor="middle" className="small fill-green-300">___</text>

        {/* Key question */}
        <rect x="40" y="350" width="550" height="58" rx="6" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
        <text x="315" y="368" textAnchor="middle" className="label fill-cyan-300" fontWeight="600">
          Think About This:
        </text>
        <text x="315" y="384" textAnchor="middle" className="small fill-slate-300">
          Boat A (wide, flat) should carry more coins but move slower.
        </text>
        <text x="315" y="398" textAnchor="middle" className="small fill-slate-300">
          Boat B (narrow, pointed) should glide farther but carry fewer coins. Why is this the same
        </text>
        <text x="315" y="412" textAnchor="middle" className="small fill-amber-300">
          trade-off that real Brahmaputra boat builders face?
        </text>
      </svg>
    </div>
  );
}
