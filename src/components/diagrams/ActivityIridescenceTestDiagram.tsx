export default function ActivityIridescenceTestDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: compare structural color (CD, soap bubble) with pigment color (paint) by tilting objects"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-400">
          Try This: Structural Color vs Pigment Color
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: a CD or DVD, a soap bubble wand, and a painted object
        </text>

        {/* Step 1: CD */}
        <rect x="40" y="70" width="200" height="160" rx="8" className="fill-indigo-50 dark:fill-indigo-950/30 stroke-indigo-200 dark:stroke-indigo-700" strokeWidth="1" />
        <text x="140" y="90" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-700 dark:fill-indigo-300">Step 1: Tilt a CD</text>
        {/* CD shape */}
        <circle cx="140" cy="145" r="40" className="fill-gray-200 dark:fill-slate-700" />
        <circle cx="140" cy="145" r="10" className="fill-gray-400 dark:fill-slate-500" />
        {/* Rainbow shimmer */}
        <path d="M 100 125 Q 120 115 140 120 Q 160 125 180 118" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
        <path d="M 100 135 Q 120 128 140 133 Q 160 138 180 130" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
        <path d="M 100 145 Q 120 140 140 145 Q 160 150 180 142" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
        <text x="140" y="202" textAnchor="middle" fontSize="10" className="fill-indigo-600 dark:fill-indigo-400">Colors shift as you tilt</text>
        <text x="140" y="216" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">\u2192 Structural color!</text>

        {/* Step 2: Soap bubble */}
        <rect x="250" y="70" width="200" height="160" rx="8" className="fill-cyan-50 dark:fill-cyan-950/30 stroke-cyan-200 dark:stroke-cyan-700" strokeWidth="1" />
        <text x="350" y="90" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-cyan-700 dark:fill-cyan-300">Step 2: Soap Bubble</text>
        <circle cx="350" cy="150" r="35" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
        <path d="M 320 135 Q 340 125 360 135" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
        <path d="M 325 150 Q 345 140 365 150" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        <path d="M 328 165 Q 348 158 368 165" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5" />
        <text x="350" y="202" textAnchor="middle" fontSize="10" className="fill-cyan-600 dark:fill-cyan-400">Swirling rainbow bands</text>
        <text x="350" y="216" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">\u2192 Thin-film interference!</text>

        {/* Step 3: Painted object */}
        <rect x="460" y="70" width="200" height="160" rx="8" className="fill-amber-50 dark:fill-amber-950/30 stroke-amber-200 dark:stroke-amber-700" strokeWidth="1" />
        <text x="560" y="90" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Step 3: Red Paint</text>
        <rect x="525" y="110" width="70" height="70" rx="4" fill="#ef4444" opacity="0.7" />
        <text x="560" y="150" textAnchor="middle" fontSize="20">\ud83c\udfa8</text>
        <text x="560" y="202" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400">Red from every angle</text>
        <text x="560" y="216" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">\u2192 Pigment color (chemical)</text>

        {/* Comparison table */}
        <rect x="60" y="250" width="580" height="110" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="350" y="272" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Your Observations</text>

        {['Property', 'Structural Color', 'Pigment Color'].map((h, i) => (
          <text key={h} x={140 + i * 200} y="294" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">{h}</text>
        ))}
        <line x1="70" y1="300" x2="630" y2="300" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />

        {[
          ['Changes with angle?', 'YES \u2014 shifts colors', 'NO \u2014 same color'],
          ['Survives grinding?', 'NO \u2014 color vanishes', 'YES \u2014 powder is colored'],
          ['Source?', 'Nanostructure', 'Chemical molecules'],
        ].map((row, i) => (
          <g key={i}>
            {row.map((cell, j) => (
              <text key={j} x={140 + j * 200} y={318 + i * 16} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">{cell}</text>
            ))}
          </g>
        ))}

        {/* Bottom insight */}
        <rect x="60" y="380" width="580" height="65" rx="8" className="fill-indigo-50 dark:fill-indigo-950/30 stroke-indigo-200 dark:stroke-indigo-800" strokeWidth="1" />
        <text x="350" y="400" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-700 dark:fill-indigo-300">
          Peacock feathers use structural color
        </text>
        <text x="350" y="418" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
          Melanin rods arranged in nano-layers create thin-film interference \u2014
        </text>
        <text x="350" y="434" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
          the same physics as your CD and soap bubble, just smaller and more precise.
        </text>
      </svg>
    </div>
  );
}
