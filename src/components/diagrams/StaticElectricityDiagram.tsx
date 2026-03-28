export default function StaticElectricityDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 500 280" className="w-full max-w-xl mx-auto" role="img" aria-label="Static electricity: charge transfer and attraction">
        {/* Title */}
        <text x={250} y={18} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="700">Static Electricity</text>

        {/* ======== BALLOON (left) ======== */}
        {/* Balloon body */}
        <ellipse cx={140} cy={100} rx={55} ry={65} className="fill-blue-200 dark:fill-blue-800 stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        {/* Balloon knot */}
        <polygon points="140,165 135,175 145,175" className="fill-blue-300 dark:fill-blue-700 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1" />
        <text x={140} y={190} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="600">Balloon</text>

        {/* Negative charges on balloon */}
        {[
          [120, 70], [155, 75], [125, 100], [160, 100],
          [130, 130], [155, 125], [140, 88], [115, 115],
        ].map(([cx, cy], i) => (
          <g key={`neg${i}`}>
            <circle cx={cx} cy={cy} r={6} className="fill-blue-100 dark:fill-blue-900 stroke-blue-500" strokeWidth="1" />
            <text x={cx} y={cy + 4} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="700">−</text>
          </g>
        ))}

        {/* ======== HAIR (right) ======== */}
        {/* Head shape */}
        <ellipse cx={340} cy={105} rx={40} ry={50} className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-500" strokeWidth="2" />
        <text x={340} y={165} textAnchor="middle" className="fill-amber-700 dark:fill-amber-400" fontSize="11" fontWeight="600">Hair</text>

        {/* Hair strands standing up (attracted to balloon) */}
        {[-25, -15, -5, 5, 15, 25].map((offset, i) => (
          <path
            key={`hair${i}`}
            d={`M ${340 + offset},${55} Q ${340 + offset - 15},${30} ${340 + offset - 20},${15}`}
            fill="none"
            className="stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* Positive charges on hair */}
        {[
          [325, 85], [355, 85], [330, 115], [350, 115], [340, 95], [340, 130],
        ].map(([cx, cy], i) => (
          <g key={`pos${i}`}>
            <circle cx={cx} cy={cy} r={6} className="fill-red-100 dark:fill-red-900/40 stroke-red-500" strokeWidth="1" />
            <text x={cx} y={cy + 4} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="700">+</text>
          </g>
        ))}

        {/* ======== ELECTRIC FIELD LINES (attraction) ======== */}
        {[80, 100, 120].map((y, i) => (
          <g key={`field${i}`}>
            <path
              d={`M ${195},${y} Q ${240},${y + (i - 1) * 8} ${295},${y}`}
              fill="none"
              className="stroke-violet-400 dark:stroke-violet-500"
              strokeWidth="1.2"
              strokeDasharray="4,3"
            />
            {/* Arrow pointing toward balloon (attraction) */}
            <polygon
              points={`${200},${y} ${207},${y - 3} ${207},${y + 3}`}
              className="fill-violet-400 dark:fill-violet-500"
            />
          </g>
        ))}

        <text x={245} y={140} textAnchor="middle" className="fill-violet-600 dark:fill-violet-400" fontSize="10">attraction</text>

        {/* ======== LABELS ======== */}
        <text x={250} y={200} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">
          Electrons transfer from hair to balloon
        </text>
        <text x={250} y={216} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11">
          Unlike charges attract
        </text>

        {/* ======== SPARK SCENE (bottom) ======== */}
        <line x1={60} y1={232} x2={440} y2={232} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" />

        {/* Finger */}
        <rect x={140} y={240} width={40} height={16} rx={8} className="fill-amber-200 dark:fill-amber-800 stroke-amber-500" strokeWidth="1.5" />
        <text x={160} y={270} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Finger</text>

        {/* Spark zigzag */}
        <polyline
          points="180,248 195,243 205,253 215,243 225,248"
          fill="none"
          className="stroke-yellow-400"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Spark glow */}
        <circle cx={203} cy={248} r={8} className="fill-yellow-300 dark:fill-yellow-500" opacity={0.3} />
        <text x={203} y={276} textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400" fontSize="10" fontWeight="600">Spark!</text>

        {/* Doorknob */}
        <circle cx={240} cy={248} r={12} className="fill-gray-300 dark:fill-gray-600 stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <rect x={252} y={242} width={20} height={12} rx={2} className="fill-gray-300 dark:fill-gray-600 stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x={255} y={276} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Doorknob</text>

        {/* Explanation */}
        <text x={400} y={252} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Excess electrons discharge</text>
      </svg>
    </div>
  );
}
