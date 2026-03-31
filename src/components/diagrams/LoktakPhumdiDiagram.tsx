export default function LoktakPhumdiDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 400" className="w-full max-w-lg mx-auto" role="img" aria-label="Cross-section of a phumdi floating island showing layers of vegetation, organic matter, and trapped gas">
        <rect width="560" height="400" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="280" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34d399">Phumdi Cross-Section: A Floating Island</text>

        {/* Water */}
        <rect x="30" y="200" width="500" height="170" rx="6" fill="#1e3a5f" opacity="0.7" />
        <text x="60" y="340" fontSize="11" fill="#93c5fd" opacity="0.7">Lake water</text>
        {/* Water ripples */}
        {[80, 180, 300, 420].map((x, i) => (
          <path key={i} d={`M${x},200 q20,-6 40,0 q20,6 40,0`} fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
        ))}

        {/* Phumdi body — organic mat */}
        <path d="M60,160 Q80,140 120,150 Q180,130 240,145 Q320,125 400,140 Q450,130 500,155 L500,250 Q450,265 400,255 Q320,270 240,258 Q180,272 120,260 Q80,268 60,255 Z" fill="#5b4020" opacity="0.85" />
        <path d="M60,160 Q80,140 120,150 Q180,130 240,145 Q320,125 400,140 Q450,130 500,155 L500,250 Q450,265 400,255 Q320,270 240,258 Q180,272 120,260 Q80,268 60,255 Z" fill="none" stroke="#92400e" strokeWidth="1.5" />

        {/* Top vegetation layer */}
        <path d="M60,160 Q80,140 120,150 Q180,130 240,145 Q320,125 400,140 Q450,130 500,155 L500,175 Q450,165 400,172 Q320,158 240,170 Q180,160 120,172 Q80,165 60,175 Z" fill="#166534" opacity="0.8" />

        {/* Grass/plants on top */}
        {[90, 130, 170, 210, 260, 310, 350, 390, 440, 470].map((x, i) => (
          <g key={`grass-${i}`}>
            <line x1={x} y1={150 - (i % 3) * 5} x2={x - 5} y2={120 - (i % 3) * 8 - i * 0.5} stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            <line x1={x} y1={150 - (i % 3) * 5} x2={x + 5} y2={125 - (i % 3) * 6 - i * 0.3} stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Gas bubbles trapped in mat */}
        {[
          { x: 120, y: 220, r: 5 }, { x: 200, y: 235, r: 4 }, { x: 280, y: 215, r: 6 },
          { x: 350, y: 240, r: 3 }, { x: 420, y: 225, r: 5 }, { x: 160, y: 245, r: 3 },
          { x: 380, y: 210, r: 4 }, { x: 460, y: 245, r: 3 },
        ].map((b, i) => (
          <circle key={`bubble-${i}`} cx={b.x} cy={b.y} r={b.r} fill="#93c5fd" opacity="0.3" stroke="#60a5fa" strokeWidth="0.5" />
        ))}

        {/* Root tangles */}
        {[100, 200, 310, 420].map((x, i) => (
          <g key={`root-${i}`} opacity="0.5">
            <path d={`M${x},175 q-10,30 5,50 q10,15 -5,30`} fill="none" stroke="#a16207" strokeWidth="1.5" />
            <path d={`M${x + 15},178 q5,25 -8,45 q-5,20 8,35`} fill="none" stroke="#a16207" strokeWidth="1" />
          </g>
        ))}

        {/* Waterline label */}
        <line x1="30" y1="200" x2="530" y2="200" stroke="#60a5fa" strokeWidth="1" strokeDasharray="6,3" opacity="0.6" />
        <text x="535" y="204" fontSize="9" fill="#93c5fd" textAnchor="start">Waterline</text>

        {/* Labels with lines */}
        {/* Vegetation layer */}
        <line x1="160" y1="100" x2="160" y2="148" stroke="#4ade80" strokeWidth="1" strokeDasharray="3,2" />
        <rect x="70" y="82" width="180" height="18" rx="3" fill="#166534" opacity="0.3" />
        <text x="160" y="95" textAnchor="middle" fontSize="10" fill="#4ade80">Living vegetation (grasses, sedges)</text>

        {/* Organic mat */}
        <line x1="450" y1="190" x2="500" y2="180" stroke="#d97706" strokeWidth="1" strokeDasharray="3,2" />
        <rect x="410" y="168" width="140" height="18" rx="3" fill="#78350f" opacity="0.3" />
        <text x="480" y="180" textAnchor="middle" fontSize="9" fill="#fbbf24">Decomposing organic mat</text>

        {/* Gas bubbles label */}
        <line x1="280" y1="215" x2="310" y2="280" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3,2" />
        <rect x="230" y="280" width="160" height="18" rx="3" fill="#1e3a5f" opacity="0.4" />
        <text x="310" y="293" textAnchor="middle" fontSize="9" fill="#93c5fd">Trapped CH4 + CO2 gas (buoyancy)</text>

        {/* Thickness annotation */}
        <line x1="42" y1="155" x2="42" y2="260" stroke="white" strokeWidth="1" />
        <line x1="36" y1="155" x2="48" y2="155" stroke="white" strokeWidth="1" />
        <line x1="36" y1="260" x2="48" y2="260" stroke="white" strokeWidth="1" />
        <text x="46" y="212" fontSize="9" className="fill-gray-900 dark:fill-white" transform="rotate(-90, 46, 212)" textAnchor="middle">~1-2 m thick</text>

        {/* Key insight */}
        <rect x="60" y="360" width="440" height="28" rx="6" fill="#065f46" opacity="0.3" />
        <text x="280" y="378" textAnchor="middle" fontSize="10" fill="#6ee7b7">Gas bubbles + low bulk density = the phumdi floats like a natural raft</text>
      </svg>
    </div>
  );
}
