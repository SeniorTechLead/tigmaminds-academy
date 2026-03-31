export default function SinteringProcessDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Sintering process: how heat fuses clay particles from loose powder into solid ceramic"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">
          Sintering: Heat Fuses Clay into Ceramic
        </text>

        {/* Stage 1: Loose particles */}
        <g transform="translate(130, 100)">
          <text x="0" y="-10" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
            Before Firing
          </text>
          <text x="0" y="8" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            (loose particles)
          </text>
          {[
            [0, 50], [-25, 85], [25, 85], [-15, 120], [15, 120],
            [0, 155], [-30, 155], [30, 155], [-10, 55], [10, 90],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="18" fill="#d97706" opacity="0.6" stroke="#92400e" strokeWidth="1" />
          ))}
          <text x="0" y="200" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            \u2248 25\u00b0C
          </text>
        </g>

        {/* Arrow 1 */}
        <g>
          <line x1="220" y1="180" x2="280" y2="180" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#sinter-arrow)" />
          <text x="250" y="165" textAnchor="middle" fontSize="11" className="fill-red-500 dark:fill-red-400" fontWeight="600">
            Heat
          </text>
        </g>

        {/* Stage 2: Necking */}
        <g transform="translate(370, 100)">
          <text x="0" y="-10" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
            Necking Stage
          </text>
          <text x="0" y="8" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            (particles start bonding)
          </text>
          {[
            [0, 50], [-22, 82], [22, 82], [-12, 116], [12, 116],
            [0, 150], [-26, 150], [26, 150], [-8, 54], [8, 86],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="17" fill="#ea580c" opacity="0.7" stroke="#9a3412" strokeWidth="1.5" />
          ))}
          {/* Neck connections */}
          {[
            [0, 50, -22, 82], [0, 50, 22, 82], [-22, 82, -12, 116],
            [22, 82, 12, 116], [-12, 116, 0, 150], [12, 116, 26, 150],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={`n${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9a3412" strokeWidth="3" opacity="0.5" />
          ))}
          <text x="0" y="200" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            \u2248 900\u00b0C
          </text>
        </g>

        {/* Arrow 2 */}
        <g>
          <line x1="460" y1="180" x2="520" y2="180" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#sinter-arrow)" />
          <text x="490" y="165" textAnchor="middle" fontSize="11" className="fill-red-500 dark:fill-red-400" fontWeight="600">
            More heat
          </text>
        </g>

        {/* Stage 3: Fully sintered */}
        <g transform="translate(620, 100)">
          <text x="0" y="-10" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
            Fully Sintered
          </text>
          <text x="0" y="8" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            (dense ceramic)
          </text>
          <rect x="-45" y="40" width="90" height="130" rx="10" fill="#c2410c" opacity="0.85" stroke="#7c2d12" strokeWidth="2" />
          {/* Grain boundaries */}
          <line x1="-30" y1="70" x2="30" y2="90" stroke="#7c2d12" strokeWidth="1" opacity="0.5" />
          <line x1="-35" y1="110" x2="35" y2="120" stroke="#7c2d12" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="45" x2="-10" y2="140" stroke="#7c2d12" strokeWidth="1" opacity="0.5" />
          <text x="0" y="115" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">
            Dense
          </text>
          <text x="0" y="200" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            \u2248 1200\u00b0C+
          </text>
        </g>

        <defs>
          <marker id="sinter-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Temperature scale */}
        <rect x="80" y="360" width="620" height="10" rx="5" fill="url(#temp-grad)" />
        <defs>
          <linearGradient id="temp-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <text x="80" y="390" fontSize="10" className="fill-gray-500 dark:fill-slate-400">25\u00b0C</text>
        <text x="700" y="390" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">1400\u00b0C</text>
        <text x="390" y="390" textAnchor="middle" fontSize="10" className="fill-red-500 dark:fill-red-400" fontWeight="600">
          573\u00b0C quartz inversion zone (critical!)
        </text>

        {/* Bottom summary */}
        <rect x="120" y="410" width="540" height="50" rx="8" className="fill-orange-50 dark:fill-orange-950" stroke="#ea580c" strokeWidth="1.5" />
        <text x="390" y="432" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-orange-700 dark:fill-orange-300">
          Sintering fuses particles by atomic diffusion at contact points
        </text>
        <text x="390" y="450" textAnchor="middle" fontSize="11" className="fill-orange-600 dark:fill-orange-400">
          The pot shrinks 8\u201315% as pores close and density increases
        </text>
      </svg>
    </div>
  );
}
