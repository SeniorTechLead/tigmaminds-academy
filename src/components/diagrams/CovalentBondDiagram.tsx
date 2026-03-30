export default function CovalentBondDiagram() {
  /* Electron dot: a small filled circle */
  const Dot = ({ x, y, shared }: { x: number; y: number; shared?: boolean }) => (
    <circle cx={x} cy={y} r={3} className={shared ? 'fill-amber-500' : 'fill-gray-500 dark:fill-gray-400'} />
  );

  return (
    <div className="my-4">
      <svg viewBox="0 0 567 242" className="w-full max-w-2xl mx-auto" role="img" aria-label="Covalent bond electron sharing diagram">
        {/* Title */}
        <text x="270" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Covalent Bonds: Sharing Electrons
        </text>

        {/* ── H₂ — Single Bond ── */}
        {(() => {
          const cx1 = 55, cx2 = 105, cy = 95;
          return (
            <g>
              {/* Atom circles */}
              <circle cx={cx1} cy={cy} r={24} fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx={cx2} cy={cy} r={24} fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" strokeDasharray="3,3" />
              {/* Atom labels */}
              <text x={cx1} y={cy + 4} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="16" fontWeight="bold">H</text>
              <text x={cx2} y={cy + 4} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="16" fontWeight="bold">H</text>

              {/* Non-bonding electron on each H */}
              <Dot x={cx1 - 20} y={cy} />
              <Dot x={cx2 + 20} y={cy} />

              {/* Shared pair (highlighted) */}
              <Dot x={78} y={cy - 4} shared />
              <Dot x={78} y={cy + 4} shared />

              {/* Bond line */}
              <line x1={cx1 + 10} y1={cy} x2={cx2 - 10} y2={cy} className="stroke-amber-500" strokeWidth="2" opacity="0.4" />

              {/* Label */}
              <text x={80} y={145} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Single bond</text>
              <text x={80} y={160} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">H&#8322;</text>
              <text x={80} y={175} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">1 shared pair</text>
            </g>
          );
        })()}

        {/* ── O₂ — Double Bond ── */}
        {(() => {
          const cx1 = 220, cx2 = 290, cy = 95;
          return (
            <g>
              <circle cx={cx1} cy={cy} r={28} fill="none" className="stroke-red-400 dark:stroke-red-500" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx={cx2} cy={cy} r={28} fill="none" className="stroke-red-400 dark:stroke-red-500" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x={cx1} y={cy + 5} textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="16" fontWeight="bold">O</text>
              <text x={cx2} y={cy + 5} textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="16" fontWeight="bold">O</text>

              {/* Non-bonding pairs on O */}
              <Dot x={cx1 - 22} y={cy - 10} />
              <Dot x={cx1 - 22} y={cy + 10} />
              <Dot x={cx1} y={cy - 26} />
              <Dot x={cx1} y={cy + 26} />
              <Dot x={cx2 + 22} y={cy - 10} />
              <Dot x={cx2 + 22} y={cy + 10} />
              <Dot x={cx2} y={cy - 26} />
              <Dot x={cx2} y={cy + 26} />

              {/* Shared pairs (2 pairs = 4 dots) */}
              <Dot x={255} y={cy - 8} shared />
              <Dot x={255} y={cy - 2} shared />
              <Dot x={255} y={cy + 2} shared />
              <Dot x={255} y={cy + 8} shared />

              {/* Bond lines */}
              <line x1={cx1 + 12} y1={cy - 5} x2={cx2 - 12} y2={cy - 5} className="stroke-amber-500" strokeWidth="2" opacity="0.4" />
              <line x1={cx1 + 12} y1={cy + 5} x2={cx2 - 12} y2={cy + 5} className="stroke-amber-500" strokeWidth="2" opacity="0.4" />

              <text x={255} y={145} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Double bond</text>
              <text x={255} y={160} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">O&#8322;</text>
              <text x={255} y={175} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">2 shared pairs</text>
            </g>
          );
        })()}

        {/* ── N₂ — Triple Bond ── */}
        {(() => {
          const cx1 = 400, cx2 = 470, cy = 95;
          return (
            <g>
              <circle cx={cx1} cy={cy} r={28} fill="none" className="stroke-indigo-400 dark:stroke-indigo-500" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx={cx2} cy={cy} r={28} fill="none" className="stroke-indigo-400 dark:stroke-indigo-500" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x={cx1} y={cy + 5} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="16" fontWeight="bold">N</text>
              <text x={cx2} y={cy + 5} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="16" fontWeight="bold">N</text>

              {/* Lone pairs on N */}
              <Dot x={cx1 - 24} y={cy} />
              <Dot x={cx1 - 18} y={cy} />
              <Dot x={cx2 + 24} y={cy} />
              <Dot x={cx2 + 18} y={cy} />

              {/* Shared pairs (3 pairs = 6 dots) */}
              <Dot x={435} y={cy - 10} shared />
              <Dot x={435} y={cy - 4} shared />
              <Dot x={435} y={cy + 2} shared />
              <Dot x={435} y={cy + 8} shared />
              <Dot x={435} y={cy - 16} shared />
              <Dot x={435} y={cy + 14} shared />

              {/* Bond lines */}
              <line x1={cx1 + 12} y1={cy - 8} x2={cx2 - 12} y2={cy - 8} className="stroke-amber-500" strokeWidth="2" opacity="0.4" />
              <line x1={cx1 + 12} y1={cy} x2={cx2 - 12} y2={cy} className="stroke-amber-500" strokeWidth="2" opacity="0.4" />
              <line x1={cx1 + 12} y1={cy + 8} x2={cx2 - 12} y2={cy + 8} className="stroke-amber-500" strokeWidth="2" opacity="0.4" />

              <text x={435} y={145} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Triple bond</text>
              <text x={435} y={160} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">N&#8322;</text>
              <text x={435} y={175} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">3 shared pairs</text>
            </g>
          );
        })()}

        {/* Legend */}
        <circle cx="170" cy="192" r="3" className="fill-gray-500 dark:fill-gray-400" />
        <text x="178" y="195" className="fill-gray-500 dark:fill-gray-400" fontSize="10">= non-bonding electron</text>
        <circle cx="320" cy="192" r="3" className="fill-amber-500" />
        <text x="328" y="195" className="fill-amber-600 dark:fill-amber-400" fontSize="10">= shared electron</text>
      </svg>
    </div>
  );
}
