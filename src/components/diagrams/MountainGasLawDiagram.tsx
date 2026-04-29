export default function MountainGasLawDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 433"
        className="w-full"
        role="img"
        aria-label="Ideal gas law diagram comparing a small dense gas container at sea level with a larger less dense container at 5000 metres"
      >
        <rect x="0" y="0" width="600" height="410" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="22" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Ideal Gas Law: PV = nRT
        </text>

        {/* Formula banner */}
        <rect x="180" y="32" width="240" height="24" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#64748b" strokeWidth="1" />
        <text x="300" y="48" textAnchor="middle" fontSize="11" className="fill-sky-300" fontWeight="700" fontFamily="serif">
          P V = n R T
        </text>
        <text x="300" y="72" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
          P = pressure &middot; V = volume &middot; n = amount &middot; R = gas constant &middot; T = temperature
        </text>

        {/* Sea level container */}
        <g>
          <text x="150" y="100" textAnchor="middle" fontSize="10" className="fill-green-300" fontWeight="700">
            Sea Level (0 m)
          </text>

          {/* Container outline */}
          <rect x="85" y="110" width="130" height="130" rx="6" fill="none" className="stroke-green-400" strokeWidth="2" />

          {/* Dense gas dots */}
          {[
            [105, 130], [135, 125], [165, 135], [195, 128],
            [110, 155], [140, 150], [170, 158], [195, 152],
            [105, 180], [135, 175], [165, 182], [195, 178],
            [110, 205], [140, 200], [170, 208], [195, 202],
            [120, 142], [155, 140], [185, 145],
            [115, 168], [150, 165], [180, 170],
            [125, 192], [155, 190], [185, 195],
            [100, 218], [130, 220], [160, 215], [190, 222],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" className="fill-sky-400" opacity="0.8" />
          ))}

          {/* Labels */}
          <text x="150" y="260" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
            P = 1013 hPa
          </text>
          <text x="150" y="274" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
            T = 15 °C (288 K)
          </text>
          <text x="150" y="288" textAnchor="middle" fontSize="9" className="fill-green-300" fontWeight="600">
            Dense, tightly packed
          </text>
        </g>

        {/* Arrow between containers */}
        <g>
          <line x1="240" y1="175" x2="310" y2="175" className="stroke-amber-400" strokeWidth="2" markerEnd="url(#gasArrow)" />
          <defs>
            <marker id="gasArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 Z" className="fill-amber-400" />
            </marker>
          </defs>
          <text x="275" y="165" textAnchor="middle" fontSize="8" className="fill-amber-300" fontWeight="600">
            Altitude
          </text>
          <text x="275" y="190" textAnchor="middle" fontSize="8" className="fill-amber-300" fontWeight="600">
            increases
          </text>
        </g>

        {/* High altitude container — larger, sparser */}
        <g>
          <text x="440" y="100" textAnchor="middle" fontSize="10" className="fill-blue-300" fontWeight="700">
            High Altitude (5 000 m)
          </text>

          {/* Larger container */}
          <rect x="345" y="105" width="190" height="145" rx="6" fill="none" className="stroke-blue-400" strokeWidth="2" strokeDasharray="6 3" />

          {/* Expansion arrows at corners */}
          {[
            [345, 105, 335, 95],
            [535, 105, 545, 95],
            [345, 250, 335, 260],
            [535, 250, 545, 260],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-orange-400" strokeWidth="1.5" markerEnd="url(#expandArrow)" />
          ))}
          <defs>
            <marker id="expandArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 Z" className="fill-orange-400" />
            </marker>
          </defs>

          {/* Sparse gas dots */}
          {[
            [375, 130], [430, 140], [490, 125],
            [360, 170], [410, 165], [460, 175], [515, 168],
            [380, 210], [440, 200], [500, 215],
            [370, 238], [425, 235], [480, 240],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" className="fill-sky-400" opacity="0.45" />
          ))}

          {/* Labels */}
          <text x="440" y="270" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
            P = 540 hPa (about half)
          </text>
          <text x="440" y="284" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
            T = -17.5 °C (255 K)
          </text>
          <text x="440" y="298" textAnchor="middle" fontSize="9" className="fill-blue-300" fontWeight="600">
            Expanded, spread out
          </text>
        </g>

        {/* Key relationship box */}
        <rect x="60" y="310" width="480" height="48" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#64748b" strokeWidth="0.5" />
        <text x="300" y="328" textAnchor="middle" fontSize="9" className="fill-gray-200" fontWeight="600">
          When P drops (lower pressure at altitude), V increases (gas expands).
        </text>
        <text x="300" y="343" textAnchor="middle" fontSize="9" className="fill-gray-200" fontWeight="600">
          Same number of molecules spread over more space = thinner, less dense air.
        </text>

        {/* Insight */}
        <rect x="60" y="368" width="480" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" />
        <text x="80" y="383" fontSize="9" className="fill-amber-300" fontWeight="600">
          This is why every breath at 5 000 m delivers ~half the oxygen of sea level.
        </text>
      </svg>
    </div>
  );
}
