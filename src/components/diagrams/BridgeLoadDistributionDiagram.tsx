export default function BridgeLoadDistributionDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 700 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="How a living root bridge distributes load through its root network compared to a single beam"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 9.5px; }
          .val { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
        `}</style>

        <rect width="700" height="440" rx="8" className="fill-slate-900" />

        <text x="350" y="28" textAnchor="middle" className="title fill-emerald-300">
          Load Distribution: Single Beam vs Root Network
        </text>

        {/* --- TOP: Simple beam (bad) --- */}
        <text x="175" y="58" textAnchor="middle" className="label fill-red-300" fontWeight="600">
          Single Beam Bridge
        </text>

        {/* Supports */}
        <polygon points="50,175 65,195 35,195" className="fill-gray-400 dark:fill-slate-500" />
        <polygon points="300,175 315,195 285,195" className="fill-gray-400 dark:fill-slate-500" />

        {/* Beam */}
        <rect x="50" y="165" width="250" height="10" rx="2" fill="#78716c" />

        {/* Person on bridge */}
        <circle cx="175" cy="140" r="8" fill="#fbbf24" />
        <line x1="175" y1="148" x2="175" y2="162" stroke="#fbbf24" strokeWidth="2" />

        {/* Weight arrow */}
        <line x1="175" y1="120" x2="175" y2="135" stroke="#ef4444" strokeWidth="2" />
        <polygon points="175,120 171,128 179,128" fill="#ef4444" />
        <text x="175" y="115" textAnchor="middle" className="small fill-red-400">700 N</text>

        {/* Stress concentration - red zone in middle */}
        <rect x="140" y="175" width="70" height="6" rx="2" fill="#ef4444" opacity="0.5" />
        <text x="175" y="200" textAnchor="middle" className="small fill-red-300">All stress concentrated here</text>
        <text x="175" y="212" textAnchor="middle" className="small fill-red-400">Maximum bending moment at center</text>

        {/* --- TOP RIGHT: Root network (good) --- */}
        <text x="525" y="58" textAnchor="middle" className="label fill-green-300" fontWeight="600">
          Root Network Bridge
        </text>

        {/* Bank supports (natural) */}
        <rect x="385" y="155" width="30" height="45" rx="6" fill="#5c4033" />
        <rect x="635" y="155" width="30" height="45" rx="6" fill="#5c4033" />

        {/* Root network - multiple intertwined paths */}
        {/* Main catenary roots */}
        <path d="M 400 165 Q 450 175 525 180 Q 600 175 650 165"
          fill="none" stroke="#16a34a" strokeWidth="3.5" opacity="0.8" />
        <path d="M 400 170 Q 460 185 525 188 Q 590 185 650 170"
          fill="none" stroke="#22c55e" strokeWidth="2.5" opacity="0.7" />
        <path d="M 400 160 Q 440 168 525 172 Q 610 168 650 160"
          fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.6" />

        {/* Cross-connections (inosculated roots) */}
        {[440, 480, 520, 560, 600].map((x, i) => (
          <line key={i} x1={x} y1={165 + (i % 2) * 3} x2={x} y2={180 + (i % 2) * 5}
            stroke="#15803d" strokeWidth="1.5" opacity="0.5" />
        ))}

        {/* Person on bridge */}
        <circle cx="525" cy="140" r="8" fill="#fbbf24" />
        <line x1="525" y1="148" x2="525" y2="162" stroke="#fbbf24" strokeWidth="2" />

        {/* Weight arrow */}
        <line x1="525" y1="120" x2="525" y2="135" stroke="#ef4444" strokeWidth="2" />
        <polygon points="525,120 521,128 529,128" fill="#ef4444" />
        <text x="525" y="115" textAnchor="middle" className="small fill-red-400">700 N</text>

        {/* Distributed force arrows (smaller, spread out) */}
        {[455, 485, 515, 545, 575].map((x, i) => (
          <g key={i}>
            <line x1={x} y1={190} x2={x} y2={198} stroke="#22c55e" strokeWidth="1.5" />
            <polygon points={`${x},200 ${x-3},194 ${x+3},194`} fill="#22c55e" />
          </g>
        ))}
        <text x="525" y="215" textAnchor="middle" className="small fill-green-300">Load shared across many roots</text>
        <text x="525" y="227" textAnchor="middle" className="small fill-green-400">No single point of failure</text>

        {/* --- BOTTOM: Force diagram --- */}
        <rect x="30" y="245" width="640" height="175" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600"  strokeWidth="1" />

        <text x="350" y="268" textAnchor="middle" className="label fill-amber-300" fontWeight="600">
          Why Networks Beat Single Members
        </text>

        {/* Left column: beam failure */}
        <g transform="translate(80, 290)">
          <rect x="0" y="0" width="120" height="8" rx="2" fill="#78716c" />
          {/* Crack */}
          <line x1="60" y1="-2" x2="60" y2="10" stroke="#ef4444" strokeWidth="2" />
          <text x="60" y="-8" textAnchor="middle" className="small fill-red-400">crack = total failure</text>
          <text x="60" y="25" textAnchor="middle" className="small fill-slate-400">One crack breaks</text>
          <text x="60" y="37" textAnchor="middle" className="small fill-slate-400">the entire bridge</text>
        </g>

        {/* Right column: root redundancy */}
        <g transform="translate(320, 285)">
          {/* Multiple roots */}
          <line x1="0" y1="0" x2="200" y2="0" stroke="#16a34a" strokeWidth="2.5" />
          <line x1="0" y1="8" x2="200" y2="8" stroke="#22c55e" strokeWidth="2" />
          <line x1="0" y1="15" x2="200" y2="15" stroke="#4ade80" strokeWidth="2" />
          {/* One broken */}
          <line x1="90" y1="-2" x2="110" y2="2" stroke="#ef4444" strokeWidth="2" />
          <text x="100" y="-8" textAnchor="middle" className="small fill-red-400">one root breaks</text>
          <text x="100" y="35" textAnchor="middle" className="small fill-green-300">Others carry the load</text>
          <text x="100" y="47" textAnchor="middle" className="small fill-green-300">+ new roots grow to replace it</text>
        </g>

        {/* Bottom comparison numbers */}
        <g transform="translate(80, 370)">
          <rect x="0" y="0" width="200" height="30" rx="4" fill="#7f1d1d" opacity="0.3" />
          <text x="100" y="14" textAnchor="middle" className="val fill-red-300">Steel beam: 50-year lifespan</text>
          <text x="100" y="26" textAnchor="middle" className="small fill-red-400">Rusts in Meghalaya rain</text>
        </g>
        <g transform="translate(420, 370)">
          <rect x="0" y="0" width="200" height="30" rx="4" fill="#14532d" opacity="0.3" />
          <text x="100" y="14" textAnchor="middle" className="val fill-green-300">Root bridge: 500+ years</text>
          <text x="100" y="26" textAnchor="middle" className="small fill-green-400">Self-repairs in Meghalaya rain</text>
        </g>
      </svg>
    </div>
  );
}
