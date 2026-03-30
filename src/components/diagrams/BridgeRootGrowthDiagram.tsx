export default function BridgeRootGrowthDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="How Khasi people grow a living root bridge: aerial roots guided through betel nut troughs across a river"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 9.5px; }
          .step-num { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
        `}</style>

        <rect width="700" height="460" rx="8" className="fill-slate-900" />

        <text x="350" y="28" textAnchor="middle" className="title fill-emerald-300">
          How a Living Root Bridge Grows
        </text>

        {/* --- Left bank with Ficus elastica tree --- */}
        {/* Ground / left bank */}
        <path d="M 0 340 Q 80 330 160 350 Q 180 355 200 380 L 200 460 L 0 460 Z"
          fill="#3f6212" opacity="0.7" />
        {/* Right bank */}
        <path d="M 500 380 Q 520 355 540 350 Q 620 330 700 340 L 700 460 L 500 460 Z"
          fill="#3f6212" opacity="0.7" />

        {/* River */}
        <rect x="200" y="380" width="300" height="80" fill="#1e3a5f" opacity="0.6" />
        <path d="M 200 400 Q 260 392 350 400 Q 440 408 500 400" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
        <path d="M 200 420 Q 280 412 350 420 Q 420 428 500 420" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
        <text x="350" y="445" textAnchor="middle" className="label fill-blue-300" opacity="0.6">River</text>

        {/* Ficus elastica trunk */}
        <rect x="60" y="80" width="40" height="260" rx="8" fill="#5c4033" />
        <rect x="55" y="80" width="50" height="15" rx="4" fill="#4a3228" />

        {/* Canopy */}
        <ellipse cx="80" cy="65" rx="70" ry="50" fill="#166534" opacity="0.7" />
        <ellipse cx="60" cy="55" rx="50" ry="35" fill="#15803d" opacity="0.6" />
        <ellipse cx="100" cy="50" rx="45" ry="30" fill="#16a34a" opacity="0.5" />
        <text x="80" y="42" textAnchor="middle" className="small fill-green-200">Ficus elastica</text>

        {/* --- Aerial roots hanging down --- */}
        {/* Root 1 - hanging free */}
        <path d="M 75 110 Q 73 160 78 200" fill="none" stroke="#a3a38c" strokeWidth="2.5" />
        <text x="55" y="155" className="small fill-amber-300" transform="rotate(-80 55 155)">aerial root</text>

        {/* Root 2 - being guided */}
        <path d="M 90 130 Q 95 180 100 230 Q 105 260 110 290" fill="none" stroke="#a3a38c" strokeWidth="2" />

        {/* --- Betel nut trough (the key mechanism) --- */}
        {/* Trough shape - hollow half-pipe */}
        <path d="M 140 340 Q 145 330 150 340" fill="none" stroke="#8B7355" strokeWidth="2" />
        <rect x="140" y="332" width="360" height="10" rx="3" fill="#a08060" opacity="0.8" />
        <rect x="145" y="334" width="350" height="6" rx="2" fill="#6b5030" opacity="0.5" />

        {/* Root growing through trough */}
        <path d="M 110 290 Q 130 320 150 336 Q 250 337 350 337 Q 450 337 500 355"
          fill="none" stroke="#7cb342" strokeWidth="3" strokeDasharray="8,4" />

        {/* Root tip emerging on far side */}
        <circle cx="505" cy="358" r="4" fill="#aed581" />

        {/* --- Labels --- */}
        {/* Step 1 */}
        <g>
          <circle cx="85" cy="280" r="10" fill="#f59e0b" opacity="0.8" />
          <text x="85" y="284" textAnchor="middle" className="step-num fill-slate-900">1</text>
          <text x="130" y="275" className="label fill-amber-300">Select young</text>
          <text x="130" y="288" className="label fill-amber-300">aerial root</text>
        </g>

        {/* Step 2 */}
        <g>
          <circle cx="250" cy="310" r="10" fill="#f59e0b" opacity="0.8" />
          <text x="250" y="314" textAnchor="middle" className="step-num fill-slate-900">2</text>
          <text x="250" y="300" textAnchor="middle" className="label fill-amber-300">Guide through betel nut trough</text>
        </g>

        {/* Step 3 */}
        <g>
          <circle cx="520" cy="340" r="10" fill="#f59e0b" opacity="0.8" />
          <text x="520" y="344" textAnchor="middle" className="step-num fill-slate-900">3</text>
          <text x="570" y="330" className="label fill-amber-300">Root anchors</text>
          <text x="570" y="343" className="label fill-amber-300">in far bank</text>
        </g>

        {/* Timeline bar at bottom */}
        <rect x="50" y="395" width="600" height="3" rx="1" fill="#475569" />
        <rect x="50" y="395" width="200" height="3" rx="1" fill="#f59e0b" opacity="0.6" />
        <text x="50" y="415" className="small fill-slate-400">Year 0</text>
        <text x="250" y="415" className="small fill-amber-400">Year 5</text>
        <text x="400" y="415" className="small fill-slate-500">Year 15</text>
        <text x="550" y="415" className="small fill-slate-500">Year 30+</text>
        <text x="150" y="430" className="small fill-amber-300">Roots cross gap</text>
        <text x="400" y="430" className="small fill-slate-400">Walkable bridge</text>
        <text x="575" y="430" className="small fill-slate-400">Self-strengthening</text>

        {/* Inosculation callout */}
        <rect x="360" y="50" width="280" height="55" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <text x="370" y="68" className="label fill-emerald-300" fontWeight="600">Inosculation</text>
        <text x="370" y="82" className="small fill-slate-300">Roots pressed together long enough</text>
        <text x="370" y="94" className="small fill-slate-300">fuse into one living tissue — the bridge</text>
        <text x="370" y="106" className="small fill-slate-300">becomes a single interconnected structure.</text>

        {/* Small inosculation detail */}
        <g transform="translate(590, 130)">
          <line x1="-20" y1="0" x2="0" y2="0" stroke="#7cb342" strokeWidth="3" />
          <line x1="0" y1="0" x2="20" y2="0" stroke="#a3a38c" strokeWidth="3" />
          <ellipse cx="0" cy="0" rx="6" ry="8" fill="#558b2f" opacity="0.5" />
          <text x="0" y="20" textAnchor="middle" className="small fill-slate-400">fused joint</text>
        </g>
      </svg>
    </div>
  );
}
