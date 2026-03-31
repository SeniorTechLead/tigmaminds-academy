export default function BoatCurrentDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 620 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how a boat fights river current: drag, thrust, and upstream navigation strategies"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          @keyframes flow {
            0% { transform: translateX(0); }
            100% { transform: translateX(30px); }
          }
          .flowing { animation: flow 2s linear infinite; }
          @keyframes flowSlow {
            0% { transform: translateX(0); }
            100% { transform: translateX(15px); }
          }
          .flowSlow { animation: flowSlow 3s linear infinite; }
        `}</style>

        {/* Background */}
        <rect width="620" height="430" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="310" y="28" textAnchor="middle" className="title fill-amber-300">
          Fighting the Current \u2014 Forces on a River Boat
        </text>

        {/* === TOP: Force diagram === */}
        <text x="310" y="55" textAnchor="middle" className="heading fill-slate-300">
          Forces Acting on a Boat in a River
        </text>

        {/* River (top view) */}
        <rect x="40" y="70" width="540" height="120" rx="4" fill="#1e3a5f" opacity="0.4" />

        {/* Current flow arrows */}
        <g className="flowing" opacity="0.5">
          <line x1="60" y1="100" x2="100" y2="100" stroke="#60a5fa" strokeWidth="1.5" />
          <polygon points="105,100 95,96 95,104" fill="#60a5fa" />
          <line x1="60" y1="130" x2="100" y2="130" stroke="#60a5fa" strokeWidth="1.5" />
          <polygon points="105,130 95,126 95,134" fill="#60a5fa" />
          <line x1="60" y1="160" x2="100" y2="160" stroke="#60a5fa" strokeWidth="1.5" />
          <polygon points="105,160 95,156 95,164" fill="#60a5fa" />
        </g>
        <text x="45" y="90" className="small fill-blue-400">current</text>

        {/* Boat (top view) - pointed left (heading upstream) */}
        <path d="M 240 130 L 280 115 L 380 115 L 380 145 L 280 145 Z"
          fill="#92400e" stroke="#d97706" strokeWidth="1.5" />
        <text x="330" y="134" textAnchor="middle" className="small fill-amber-200">boat</text>

        {/* Thrust arrow (left, upstream) */}
        <line x1="240" y1="130" x2="175" y2="130" stroke="#22c55e" strokeWidth="3" />
        <polygon points="170,130 182,124 182,136" fill="#22c55e" />
        <text x="190" y="118" className="label fill-green-400">Thrust</text>
        <text x="190" y="106" className="small fill-green-300">(engine/oars)</text>

        {/* Drag arrow (right, opposing motion) */}
        <line x1="380" y1="130" x2="430" y2="130" stroke="#ef4444" strokeWidth="2.5" />
        <polygon points="435,130 425,125 425,135" fill="#ef4444" />
        <text x="410" y="118" className="label fill-red-400">Drag</text>

        {/* Current force arrow (right, pushing downstream) */}
        <line x1="310" y1="145" x2="370" y2="145" stroke="#60a5fa" strokeWidth="2.5" />
        <polygon points="375,145 365,140 365,150" fill="#60a5fa" />
        <text x="340" y="165" textAnchor="middle" className="label fill-blue-400">Current push</text>

        {/* Net force equation */}
        <text x="500" y="100" textAnchor="middle" className="small fill-slate-300">
          To go upstream:
        </text>
        <text x="500" y="118" textAnchor="middle" className="small fill-green-300">
          Thrust &gt; Drag + Current
        </text>
        <text x="500" y="140" textAnchor="middle" className="small fill-slate-400">
          Speed over ground =
        </text>
        <text x="500" y="155" textAnchor="middle" className="small fill-cyan-300">
          Boat speed \u2212 Current speed
        </text>

        {/* === BOTTOM: Navigation strategies === */}
        <text x="310" y="215" textAnchor="middle" className="heading fill-slate-300">
          How Brahmaputra Boatmen Navigate Upstream
        </text>

        {/* Strategy 1: Hug the bank */}
        <rect x="30" y="230" width="170" height="160" rx="6" fill="#1e3a5f" opacity="0.4" stroke="#3b82f6" strokeWidth="1" />
        <text x="115" y="250" textAnchor="middle" className="heading fill-cyan-400">
          Hug the Bank
        </text>

        {/* River cross-section showing speed profile */}
        <rect x="50" y="265" width="130" height="50" rx="3" fill="#0f172a" />
        {/* Speed arrows - faster in center, slower at edges */}
        <line x1="60" y1="290" x2="72" y2="290" stroke="#60a5fa" strokeWidth="1.5" />
        <polygon points="75,290 70,287 70,293" fill="#60a5fa" />
        <line x1="95" y1="290" x2="130" y2="290" stroke="#60a5fa" strokeWidth="2" />
        <polygon points="135,290 128,286 128,294" fill="#60a5fa" />
        <line x1="155" y1="290" x2="167" y2="290" stroke="#60a5fa" strokeWidth="1.5" />
        <polygon points="170,290 165,287 165,293" fill="#60a5fa" />

        <text x="65" y="278" className="small fill-green-300">slow</text>
        <text x="108" y="278" className="small fill-red-300">fast</text>
        <text x="155" y="278" className="small fill-green-300">slow</text>

        {/* Bank labels */}
        <rect x="48" y="265" width="5" height="50" fill="#92400e" />
        <rect x="177" y="265" width="5" height="50" fill="#92400e" />

        {/* Boat near bank */}
        <rect x="56" y="286" width="12" height="8" rx="1" fill="#fbbf24" />

        <text x="115" y="335" textAnchor="middle" className="small fill-slate-300">
          Current is weakest near
        </text>
        <text x="115" y="348" textAnchor="middle" className="small fill-slate-300">
          the riverbank (friction)
        </text>
        <text x="115" y="365" textAnchor="middle" className="small fill-green-300">
          Less force to overcome
        </text>

        {/* Strategy 2: Use eddies */}
        <rect x="225" y="230" width="170" height="160" rx="6" fill="#1e3a5f" opacity="0.4" stroke="#3b82f6" strokeWidth="1" />
        <text x="310" y="250" textAnchor="middle" className="heading fill-cyan-400">
          Ride the Eddies
        </text>

        {/* Eddy behind obstacle */}
        <rect x="245" y="268" width="130" height="55" rx="3" fill="#0f172a" />
        {/* Rock/obstacle */}
        <circle cx="290" cy="290" r="10" fill="#6b7280" stroke="#9ca3af" strokeWidth="1" />
        <text x="290" y="294" textAnchor="middle" className="small fill-slate-300">rock</text>
        {/* Main current */}
        <line x1="250" y1="278" x2="370" y2="278" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,2" />
        <polygon points="370,278 364,275 364,281" fill="#60a5fa" />
        {/* Eddy (reverse flow) */}
        <path d="M 305 295 Q 330 300 330 290 Q 330 280 305 285" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <polygon points="305,285 310,282 310,288" fill="#22c55e" />

        <text x="310" y="340" textAnchor="middle" className="small fill-slate-300">
          Behind rocks/bends, water
        </text>
        <text x="310" y="353" textAnchor="middle" className="small fill-slate-300">
          flows backward (eddies)
        </text>
        <text x="310" y="370" textAnchor="middle" className="small fill-green-300">
          Free upstream push!
        </text>

        {/* Strategy 3: Tacking */}
        <rect x="420" y="230" width="170" height="160" rx="6" fill="#1e3a5f" opacity="0.4" stroke="#3b82f6" strokeWidth="1" />
        <text x="505" y="250" textAnchor="middle" className="heading fill-cyan-400">
          Zigzag (Tacking)
        </text>

        {/* River with zigzag path */}
        <rect x="440" y="268" width="130" height="55" rx="3" fill="#0f172a" />
        {/* Current */}
        <line x1="445" y1="290" x2="565" y2="290" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,2" opacity="0.4" />
        {/* Zigzag path */}
        <polyline points="555,310 520,280 490,305 460,275"
          fill="none" stroke="#fbbf24" strokeWidth="2" />
        <polygon points="455,275 462,270 462,280" fill="#fbbf24" />
        {/* Boat */}
        <rect x="456" y="272" width="10" height="6" rx="1" fill="#fbbf24" />

        <text x="505" y="340" textAnchor="middle" className="small fill-slate-300">
          Crossing at an angle
        </text>
        <text x="505" y="353" textAnchor="middle" className="small fill-slate-300">
          reduces current resistance
        </text>
        <text x="505" y="370" textAnchor="middle" className="small fill-green-300">
          Used by sail boats
        </text>

        {/* Key insight */}
        <rect x="60" y="400" width="500" height="20" rx="4" fill="#1e3a5f" opacity="0.6" />
        <text x="310" y="414" textAnchor="middle" className="small fill-blue-200">
          Brahmaputra current: 2\u20135 m/s in monsoon \u2014 skilled boatmen read the water to find slow paths
        </text>
      </svg>
    </div>
  );
}
