export default function RiverOxbowDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 600 480" className="w-full h-auto" role="img"
        aria-label="Animated four-stage diagram showing how a river meander evolves into an oxbow lake, cycling through stages">
        <style>{`
          @keyframes ro-cycle {
            0%, 20% { opacity: 1; }
            25%, 95% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes ro-cycle2 {
            0%, 20% { opacity: 0; }
            25%, 45% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          @keyframes ro-cycle3 {
            0%, 45% { opacity: 0; }
            50%, 70% { opacity: 1; }
            75%, 100% { opacity: 0; }
          }
          @keyframes ro-cycle4 {
            0%, 70% { opacity: 0; }
            75%, 95% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes ro-flow-right {
            0% { offset-distance: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
          @keyframes ro-erode-pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.15); }
          }
          @keyframes ro-deposit-grow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
          @keyframes ro-breakthrough {
            0%, 40% { opacity: 0; stroke-dashoffset: 40; }
            50% { opacity: 1; stroke-dashoffset: 0; }
            100% { opacity: 1; stroke-dashoffset: 0; }
          }
          @keyframes ro-oxbow-fill {
            0%, 60% { fill-opacity: 0; }
            80%, 100% { fill-opacity: 0.4; }
          }
          @keyframes ro-stage-border {
            0%, 20% { stroke: #3b82f6; stroke-width: 2; }
            25%, 95% { stroke: #334155; stroke-width: 1; }
            100% { stroke: #3b82f6; stroke-width: 2; }
          }
          @keyframes ro-stage-border2 {
            0%, 20% { stroke: #334155; stroke-width: 1; }
            25%, 45% { stroke: #3b82f6; stroke-width: 2; }
            50%, 100% { stroke: #334155; stroke-width: 1; }
          }
          @keyframes ro-stage-border3 {
            0%, 45% { stroke: #334155; stroke-width: 1; }
            50%, 70% { stroke: #3b82f6; stroke-width: 2; }
            75%, 100% { stroke: #334155; stroke-width: 1; }
          }
          @keyframes ro-stage-border4 {
            0%, 70% { stroke: #334155; stroke-width: 1; }
            75%, 95% { stroke: #3b82f6; stroke-width: 2; }
            100% { stroke: #334155; stroke-width: 1; }
          }
          @keyframes ro-indicator {
            0%, 20% { cx: 87; }
            25%, 45% { cx: 212; }
            50%, 70% { cx: 337; }
            75%, 95% { cx: 462; }
            100% { cx: 87; }
          }
          .ro-s1 { animation: ro-cycle 16s ease-in-out infinite; }
          .ro-s2 { animation: ro-cycle2 16s ease-in-out infinite; }
          .ro-s3 { animation: ro-cycle3 16s ease-in-out infinite; }
          .ro-s4 { animation: ro-cycle4 16s ease-in-out infinite; }
          .ro-b1 { animation: ro-stage-border 16s ease-in-out infinite; }
          .ro-b2 { animation: ro-stage-border2 16s ease-in-out infinite; }
          .ro-b3 { animation: ro-stage-border3 16s ease-in-out infinite; }
          .ro-b4 { animation: ro-stage-border4 16s ease-in-out infinite; }
          .ro-flow { offset-rotate: 0deg; animation: ro-flow-right 2.5s linear infinite; }
          .ro-erode { animation: ro-erode-pulse 2s ease-in-out infinite; transform-origin: center; }
          .ro-deposit { animation: ro-deposit-grow 2.5s ease-in-out infinite; }
          .ro-dot { animation: ro-indicator 16s ease-in-out infinite; }
        `}</style>

        <defs>
          <marker id="ro-arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5 Z" fill="#ef4444" />
          </marker>
        </defs>

        <rect width="600" height="480" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-900 dark:fill-slate-50">
          Meander to Oxbow Lake — Watch It Happen
        </text>

        {/* Stage indicator bar */}
        <g transform="translate(50, 38)">
          <rect x="0" y="0" width="500" height="6" rx="3" fill="#334155" opacity="0.3" />
          <circle r="6" cy="3" fill="#3b82f6" className="ro-dot" />
          <text x="37" y="18" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Stage 1</text>
          <text x="162" y="18" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Stage 2</text>
          <text x="287" y="18" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Stage 3</text>
          <text x="412" y="18" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Stage 4</text>
        </g>

        {/* ========== MAIN ANIMATION AREA ========== */}
        {/* Floodplain background */}
        <rect x="30" y="70" width="540" height="280" rx="6" fill="#65a30d" opacity="0.06" />

        {/* ---- Stage 1: Gentle meander ---- */}
        <g className="ro-s1">
          <rect x="30" y="70" width="540" height="280" rx="6" fill="none" className="stroke-slate-700" strokeWidth="1 ro-b1" />

          <text x="50" y="95" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">1</text>
          <text x="70" y="95" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Gentle meander forms</text>

          {/* River with gentle S-curve */}
          <path d="M50,210 Q120,210 180,180 Q240,150 300,180 Q360,210 420,210 Q480,210 550,210"
            fill="none" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" opacity="0.5" />

          {/* Flow particles */}
          {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((d, i) => (
            <circle key={`f1-${i}`} r="3" fill="#38bdf8"
              className="ro-flow"
              style={{ offsetPath: `path("M50,210 Q120,210 180,180 Q240,150 300,180 Q360,210 420,210 Q480,210 550,210")`, animationDelay: `${d * 2.5}s` }} />
          ))}

          {/* Erosion arrows on outside of bends */}
          <g className="ro-erode" style={{ transformOrigin: '180px 170px' }}>
            <line x1="180" y1="175" x2="180" y2="155" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#ro-arr)" />
            <text x="168" y="148" fontSize="10" className="fill-red-500 dark:fill-red-400">Erosion</text>
          </g>
          <g className="ro-erode" style={{ transformOrigin: '300px 190px', animationDelay: '1s' }}>
            <line x1="300" y1="185" x2="300" y2="205" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#ro-arr)" />
            <text x="310" y="220" fontSize="10" className="fill-red-500 dark:fill-red-400">Erosion</text>
          </g>

          {/* Deposition on inside */}
          <ellipse cx="240" cy="165" rx="15" ry="6" fill="#d6b560" opacity="0.3" className="ro-deposit" />
          <text x="240" y="158" textAnchor="middle" fontSize="9" className="fill-amber-600 dark:fill-amber-400">Deposit</text>
          <ellipse cx="350" cy="200" rx="15" ry="6" fill="#d6b560" opacity="0.3" className="ro-deposit" />
          <text x="350" y="216" textAnchor="middle" fontSize="9" className="fill-amber-600 dark:fill-amber-400">Deposit</text>

          <text x="300" y="310" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Water flows faster on the outside of bends, eroding the bank
          </text>
        </g>

        {/* ---- Stage 2: Pronounced meander ---- */}
        <g className="ro-s2">
          <rect x="30" y="70" width="540" height="280" rx="6" fill="none" className="stroke-slate-700" strokeWidth="1" />

          <text x="50" y="95" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">2</text>
          <text x="70" y="95" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Meander becomes pronounced</text>

          {/* More extreme S-curve */}
          <path d="M50,210 Q100,210 150,170 Q200,110 260,150 Q310,190 310,210 Q310,230 260,270 Q200,310 150,260 Q120,235 420,210 Q480,210 550,210"
            fill="none" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" opacity="0.5" />

          {/* Flow particles */}
          {[0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84].map((d, i) => (
            <circle key={`f2-${i}`} r="3" fill="#38bdf8"
              className="ro-flow"
              style={{ offsetPath: `path("M50,210 Q100,210 150,170 Q200,110 260,150 Q310,190 310,210 Q310,230 260,270 Q200,310 150,260 Q120,235 420,210 Q480,210 550,210")`, animationDelay: `${d * 2.5}s` }} />
          ))}

          {/* Neck narrows indicator */}
          <line x1="145" y1="200" x2="155" y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
          <line x1="170" y1="240" x2="160" y2="240" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />

          <rect x="110" y="208" width="60" height="24" rx="4" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
          <text x="140" y="224" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-500 dark:fill-red-400">Neck</text>
          <text x="140" y="238" textAnchor="middle" fontSize="9" className="fill-red-500 dark:fill-red-400">narrows</text>

          <text x="300" y="310" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Erosion continues — the neck between the loops gets thinner
          </text>
        </g>

        {/* ---- Stage 3: Breakthrough ---- */}
        <g className="ro-s3">
          <rect x="30" y="70" width="540" height="280" rx="6" fill="none" className="stroke-slate-700" strokeWidth="1" />

          <text x="50" y="95" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">3</text>
          <text x="70" y="95" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">River breaks through the neck!</text>

          {/* Old meander loop — fading */}
          <path d="M150,210 Q200,110 260,150 Q310,190 310,210 Q310,230 260,270 Q200,310 160,250"
            fill="none" stroke="#93c5fd" strokeWidth="6" strokeLinecap="round" opacity="0.25" />

          {/* New straight channel — bold */}
          <path d="M50,210 Q100,210 150,210 Q250,210 350,210 Q450,210 550,210"
            fill="none" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" opacity="0.6" />

          {/* Flow particles on straight channel */}
          {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((d, i) => (
            <circle key={`f3-${i}`} r="3" fill="#38bdf8"
              className="ro-flow"
              style={{ offsetPath: `path("M50,210 Q100,210 150,210 Q250,210 350,210 Q450,210 550,210")`, animationDelay: `${d * 2.5}s` }} />
          ))}

          {/* Breakthrough highlight */}
          <circle cx="155" cy="210" r="14" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4,3">
            <animate attributeName="r" values="10;16;10" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <text x="155" y="188" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-500 dark:fill-amber-400">Breakthrough!</text>

          <text x="300" y="310" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            The river takes the shorter, straighter path — more energy-efficient
          </text>
        </g>

        {/* ---- Stage 4: Oxbow lake ---- */}
        <g className="ro-s4">
          <rect x="30" y="70" width="540" height="280" rx="6" fill="none" className="stroke-slate-700" strokeWidth="1" />

          <text x="50" y="95" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">4</text>
          <text x="70" y="95" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Oxbow lake (beel) forms</text>

          {/* Straight river */}
          <path d="M50,210 Q150,210 250,210 Q400,210 550,210"
            fill="none" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" opacity="0.6" />

          {/* Flow particles */}
          {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((d, i) => (
            <circle key={`f4-${i}`} r="3" fill="#38bdf8"
              className="ro-flow"
              style={{ offsetPath: `path("M50,210 Q150,210 250,210 Q400,210 550,210")`, animationDelay: `${d * 2.5}s` }} />
          ))}

          {/* Oxbow lake — crescent shaped */}
          <path d="M150,200 Q200,110 260,150 Q310,190 310,210 Q310,230 260,270 Q200,310 160,240"
            fill="#38bdf8" fillOpacity="0.35" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />

          {/* Sediment plugs blocking old connections */}
          <ellipse cx="152" cy="215" rx="10" ry="16" fill="#d6b560" opacity="0.6" />
          <ellipse cx="158" cy="240" rx="8" ry="12" fill="#d6b560" opacity="0.5" />

          {/* Oxbow label */}
          <text x="245" y="195" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Oxbow</text>
          <text x="245" y="212" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Lake</text>
          <text x="245" y="235" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(locally: beel)</text>

          {/* Vegetation growing around oxbow */}
          <text x="190" y="130" fontSize="14">🌿</text>
          <text x="310" y="170" fontSize="12">🌿</text>
          <text x="290" y="280" fontSize="14">🌿</text>

          <text x="300" y="310" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Sediment seals the old channel — a crescent lake remains on the floodplain
          </text>
        </g>

        {/* Bottom note */}
        <text x="300" y="385" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Stages cycle automatically — watch how erosion reshapes the river over time
        </text>

        {/* Brahmaputra reference */}
        <text x="300" y="405" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">
          The Brahmaputra valley has dozens of oxbow lakes (beels) visible from satellite
        </text>

        {/* Legend */}
        <g transform="translate(80, 420)">
          <rect x="0" y="0" width="12" height="8" rx="2" fill="#ef4444" opacity="0.6" />
          <text x="18" y="8" fontSize="10" className="fill-gray-600 dark:fill-slate-400">Erosion (outside bend)</text>

          <rect x="160" y="0" width="12" height="8" rx="2" fill="#d6b560" opacity="0.6" />
          <text x="178" y="8" fontSize="10" className="fill-gray-600 dark:fill-slate-400">Deposition (inside bend)</text>

          <rect x="340" y="0" width="12" height="8" rx="2" fill="#38bdf8" opacity="0.5" />
          <text x="358" y="8" fontSize="10" className="fill-gray-600 dark:fill-slate-400">Water flow</text>
        </g>
      </svg>
    </div>
  );
}
