export default function BoatBrahmaputraDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="The Brahmaputra as a braided river: cross-section showing channels, sandbars, and shifting course"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          @keyframes shimmer {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .shimmering { animation: shimmer 4s ease-in-out infinite; }
        `}</style>

        {/* Background */}
        <rect width="630" height="480" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="315" y="28" textAnchor="middle" className="title fill-amber-300">
          The Brahmaputra — A River That Moves
        </text>

        {/* === TOP: Bird's eye view of braided channels === */}
        <text x="315" y="55" textAnchor="middle" className="heading fill-slate-300">
          Braided River (top view)
        </text>

        {/* River corridor */}
        <rect x="30" y="65" width="570" height="120" rx="6" fill="#0c2d48" opacity="0.5" />

        {/* Multiple braided channels */}
        <path d="M 40 95 Q 100 80 160 100 Q 220 120 280 95 Q 340 70 400 90 Q 460 110 520 95 Q 560 85 590 100"
          fill="none" stroke="#3b82f6" strokeWidth="8" opacity="0.5" className="shimmering" />
        <path d="M 40 120 Q 80 140 140 125 Q 200 108 260 130 Q 320 150 380 125 Q 440 100 500 125 Q 550 140 590 130"
          fill="none" stroke="#3b82f6" strokeWidth="6" opacity="0.4" className="shimmering" style={{ animationDelay: '1s' }} />
        <path d="M 40 145 Q 100 160 160 150 Q 230 138 300 155 Q 370 170 440 150 Q 510 135 590 155"
          fill="none" stroke="#3b82f6" strokeWidth="5" opacity="0.35" className="shimmering" style={{ animationDelay: '2s' }} />

        {/* Sandbars */}
        <ellipse cx="180" cy="115" rx="25" ry="10" fill="#d4a574" opacity="0.7" />
        <text x="180" y="119" textAnchor="middle" className="small fill-amber-900">sandbar</text>

        <ellipse cx="350" cy="108" rx="20" ry="8" fill="#d4a574" opacity="0.7" />

        <ellipse cx="480" cy="140" rx="22" ry="9" fill="#d4a574" opacity="0.6" />

        {/* Majuli island */}
        <ellipse cx="300" cy="130" rx="30" ry="14" fill="#4ade80" opacity="0.4" stroke="#22c55e" strokeWidth="1" />
        <text x="300" y="134" textAnchor="middle" className="small fill-green-300">Majuli</text>

        {/* Bank erosion arrows */}
        <line x1="40" y1="75" x2="55" y2="85" stroke="#ef4444" strokeWidth="1.5" />
        <polygon points="58,87 50,83 52,91" fill="#ef4444" />
        <text x="30" y="72" className="small fill-red-400">erosion</text>

        <line x1="590" y1="160" x2="575" y2="170" stroke="#fbbf24" strokeWidth="1.5" />
        <polygon points="572,172 580,168 578,176" fill="#fbbf24" />
        <text x="580" y="180" className="small fill-amber-400">deposit</text>

        {/* Width label */}
        <line x1="40" y1="190" x2="590" y2="190" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
        <text x="315" y="205" textAnchor="middle" className="label fill-slate-400">
          Width: up to 10 km in monsoon season
        </text>

        {/* === MIDDLE: Cross-section === */}
        <text x="315" y="230" textAnchor="middle" className="heading fill-slate-300">
          Cross-Section (why it shifts)
        </text>

        {/* Ground level */}
        <rect x="30" y="240" width="570" height="100" rx="4" fill="#1a1a2e" />

        {/* River bed profile */}
        <path d="M 30 250 L 80 250 Q 120 250 140 270 Q 170 310 210 300 Q 240 290 260 310 Q 290 330 330 310 Q 370 290 400 310 Q 430 325 470 300 Q 510 275 540 260 L 600 250"
          fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />

        {/* Water surface */}
        <line x1="80" y1="265" x2="540" y2="265" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5,3" />

        {/* Sediment */}
        <ellipse cx="210" cy="298" rx="20" ry="6" fill="#d4a574" opacity="0.5" />
        <ellipse cx="330" cy="308" rx="15" ry="5" fill="#d4a574" opacity="0.5" />

        {/* Channel labels */}
        <text x="175" y="285" textAnchor="middle" className="small fill-blue-300">channel 1</text>
        <text x="295" y="300" textAnchor="middle" className="small fill-blue-300">channel 2</text>
        <text x="435" y="290" textAnchor="middle" className="small fill-blue-300">channel 3</text>

        {/* Banks */}
        <rect x="30" y="245" width="55" height="18" rx="2" fill="#4a3728" />
        <text x="58" y="258" textAnchor="middle" className="small fill-amber-400">north bank</text>
        <rect x="535" y="245" width="65" height="18" rx="2" fill="#4a3728" />
        <text x="568" y="258" textAnchor="middle" className="small fill-amber-400">south bank</text>

        {/* Erosion/deposition arrows */}
        <path d="M 85 252 Q 95 260 105 252" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <text x="95" y="248" textAnchor="middle" className="small fill-red-400">↓</text>

        <path d="M 505 262 L 515 252" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="520" y="250" className="small fill-amber-300">+</text>

        {/* === BOTTOM: Why navigation is dangerous === */}
        <text x="315" y="360" textAnchor="middle" className="heading fill-red-400">
          Why Navigation Is Dangerous
        </text>

        {/* Danger boxes */}
        <g>
          <rect x="30" y="372" width="130" height="55" rx="5" fill="#7f1d1d" opacity="0.3" stroke="#ef4444" strokeWidth="1" />
          <text x="95" y="390" textAnchor="middle" className="small fill-red-300" fontWeight="600">Shifting Sandbars</text>
          <text x="95" y="404" textAnchor="middle" className="small fill-slate-400">Sand moves daily</text>
          <text x="95" y="416" textAnchor="middle" className="small fill-slate-400">in monsoon floods</text>
        </g>

        <g>
          <rect x="175" y="372" width="130" height="55" rx="5" fill="#7f1d1d" opacity="0.3" stroke="#ef4444" strokeWidth="1" />
          <text x="240" y="390" textAnchor="middle" className="small fill-red-300" fontWeight="600">Bank Collapse</text>
          <text x="240" y="404" textAnchor="middle" className="small fill-slate-400">Soft soil crumbles</text>
          <text x="240" y="416" textAnchor="middle" className="small fill-slate-400">without warning</text>
        </g>

        <g>
          <rect x="320" y="372" width="130" height="55" rx="5" fill="#7f1d1d" opacity="0.3" stroke="#ef4444" strokeWidth="1" />
          <text x="385" y="390" textAnchor="middle" className="small fill-red-300" fontWeight="600">Hidden Currents</text>
          <text x="385" y="404" textAnchor="middle" className="small fill-slate-400">Underwater flows</text>
          <text x="385" y="416" textAnchor="middle" className="small fill-slate-400">can drag boats</text>
        </g>

        <g>
          <rect x="465" y="372" width="135" height="55" rx="5" fill="#7f1d1d" opacity="0.3" stroke="#ef4444" strokeWidth="1" />
          <text x="532" y="390" textAnchor="middle" className="small fill-red-300" fontWeight="600">Monsoon Floods</text>
          <text x="532" y="404" textAnchor="middle" className="small fill-slate-400">Water rises 5–10 m</text>
          <text x="532" y="416" textAnchor="middle" className="small fill-slate-400">in weeks</text>
        </g>

        {/* Key stat */}
        <rect x="60" y="438" width="510" height="32" rx="6" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
        <text x="315" y="452" textAnchor="middle" className="small fill-blue-200">
          The Brahmaputra carries 590 million tonnes of sediment per year — more than almost any river on Earth
        </text>
        <text x="315" y="465" textAnchor="middle" className="small fill-blue-300">
          It can shift its main channel by kilometres in a single monsoon season
        </text>
      </svg>
    </div>
  );
}
