export default function MountainRadiationDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 650 430"
        className="w-full"
        role="img"
        aria-label="Diagram showing thermal radiation escape at altitude with day versus night temperature comparison at different altitudes"
      >
        <rect x="0" y="0" width="650" height="430" className="fill-slate-900" rx="8" />

        {/* Title */}
        <text x="325" y="24" textAnchor="middle" fontSize="13" className="fill-gray-200" fontWeight="700">
          Thermal Radiation & Temperature Swings at Altitude
        </text>

        {/* Left side: Day vs Night comparison at sea level */}
        <g transform="translate(30, 45)">
          <text x="130" y="14" textAnchor="middle" fontSize="11" className="fill-green-300" fontWeight="700">
            Sea Level (thick atmosphere)
          </text>

          {/* Atmosphere box */}
          <rect x="20" y="26" width="220" height="120" rx="6" className="fill-blue-900/30 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

          {/* Greenhouse gas molecules */}
          {[
            [55, 44], [100, 39], [155, 46], [200, 42],
            [65, 69], [120, 64], [175, 72],
            [50, 94], [105, 89], [160, 96], [205, 92],
            [75, 114], [130, 119], [185, 112],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="3" className="fill-green-400" opacity="0.4" />
              <circle cx={cx} cy={cy} r="5" fill="none" className="stroke-green-400" strokeWidth="0.5" opacity="0.3" />
            </g>
          ))}

          {/* Ground */}
          <rect x="20" y="146" width="220" height="16" rx="2" className="fill-amber-800/50" />
          <text x="130" y="158" textAnchor="middle" fontSize="10" className="fill-amber-200">Ground surface</text>

          {/* Heat arrows going up and being reflected back */}
          {[65, 130, 185].map((x, i) => (
            <g key={i}>
              {/* Upward radiation */}
              <line x1={x} y1={144} x2={x} y2={74} className="stroke-red-400" strokeWidth="1.5" markerEnd="url(#heatUp)" />
              {/* Reflected back down */}
              <line x1={x + 8} y1={79} x2={x + 8} y2={134} className="stroke-orange-400" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#heatDown)" />
            </g>
          ))}

          <defs>
            <marker id="heatUp" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 10 L 5 0 L 10 10 Z" className="fill-red-400" />
            </marker>
            <marker id="heatDown" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 5 10 L 10 0 Z" className="fill-orange-400" />
            </marker>
          </defs>

          {/* Labels */}
          <text x="130" y="180" textAnchor="middle" fontSize="10" className="fill-gray-300">
            Heat radiated up is trapped and re-emitted down
          </text>

          {/* Day/Night temps */}
          <rect x="20" y="192" width="100" height="34" rx="3" className="fill-amber-900/40" />
          <text x="70" y="207" textAnchor="middle" fontSize="10" className="fill-amber-200" fontWeight="600">Day</text>
          <text x="70" y="221" textAnchor="middle" fontSize="11" className="fill-amber-300" fontWeight="700">30 °C</text>

          <rect x="140" y="192" width="100" height="34" rx="3" className="fill-indigo-900/40" />
          <text x="190" y="207" textAnchor="middle" fontSize="10" className="fill-indigo-200" fontWeight="600">Night</text>
          <text x="190" y="221" textAnchor="middle" fontSize="11" className="fill-indigo-300" fontWeight="700">22 °C</text>

          <text x="130" y="246" textAnchor="middle" fontSize="10" className="fill-green-300" fontWeight="700">
            Swing: 8 °C
          </text>
        </g>

        {/* Right side: Day vs Night at high altitude */}
        <g transform="translate(330, 45)">
          <text x="130" y="14" textAnchor="middle" fontSize="11" className="fill-blue-300" fontWeight="700">
            5 000 m (thin atmosphere)
          </text>

          {/* Thin atmosphere box */}
          <rect x="20" y="26" width="220" height="120" rx="6" className="fill-blue-900/15 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 2" />

          {/* Fewer greenhouse molecules */}
          {[
            [80, 49], [170, 54],
            [110, 84],
            [65, 114], [175, 109],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="3" className="fill-green-400" opacity="0.25" />
              <circle cx={cx} cy={cy} r="5" fill="none" className="stroke-green-400" strokeWidth="0.5" opacity="0.15" />
            </g>
          ))}

          {/* Ground */}
          <rect x="20" y="146" width="220" height="16" rx="2" className="fill-amber-800/50" />
          <text x="130" y="158" textAnchor="middle" fontSize="10" className="fill-amber-200">Ground surface</text>

          {/* Heat arrows escaping to space */}
          {[65, 130, 185].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={144} x2={x} y2={32} className="stroke-red-400" strokeWidth="1.5" markerEnd="url(#heatUp)" />
              {/* Arrow escaping out the top */}
              <text x={x} y={24} textAnchor="middle" fontSize="10" className="fill-red-300">
                {"↑"}
              </text>
            </g>
          ))}

          {/* "Escapes to space" label */}
          <text x="130" y="20" textAnchor="middle" fontSize="10" className="fill-red-300" fontWeight="600">
            Heat escapes to space
          </text>

          {/* Labels */}
          <text x="130" y="180" textAnchor="middle" fontSize="10" className="fill-gray-300">
            Less gas to trap heat -- radiation escapes freely
          </text>

          {/* Day/Night temps */}
          <rect x="20" y="192" width="100" height="34" rx="3" className="fill-amber-900/40" />
          <text x="70" y="207" textAnchor="middle" fontSize="10" className="fill-amber-200" fontWeight="600">Day</text>
          <text x="70" y="221" textAnchor="middle" fontSize="11" className="fill-amber-300" fontWeight="700">5 °C</text>

          <rect x="140" y="192" width="100" height="34" rx="3" className="fill-indigo-900/40" />
          <text x="190" y="207" textAnchor="middle" fontSize="10" className="fill-indigo-200" fontWeight="600">Night</text>
          <text x="190" y="221" textAnchor="middle" fontSize="11" className="fill-indigo-300" fontWeight="700">-25 °C</text>

          <text x="130" y="246" textAnchor="middle" fontSize="10" className="fill-red-300" fontWeight="700">
            Swing: 30 °C
          </text>
        </g>

        {/* Comparison bar chart */}
        <g transform="translate(50, 310)">
          <text x="275" y="12" textAnchor="middle" fontSize="11" className="fill-gray-300" fontWeight="700">
            Temperature Swing Comparison
          </text>

          {/* Sea level bar */}
          <rect x="95" y="24" width={8 * 10} height="20" rx="3" className="fill-green-500/50" />
          <text x="88" y="38" textAnchor="end" fontSize="10" className="fill-gray-300">Sea level</text>
          <text x={95 + 8 * 10 + 8} y="38" fontSize="10" className="fill-green-300" fontWeight="600">8 °C swing</text>

          {/* 3000m bar */}
          <rect x="95" y="50" width={20 * 10} height="20" rx="3" className="fill-blue-500/40" />
          <text x="88" y="64" textAnchor="end" fontSize="10" className="fill-gray-300">3 000 m</text>
          <text x={95 + 20 * 10 + 8} y="64" fontSize="10" className="fill-blue-300" fontWeight="600">20 °C swing</text>

          {/* 5000m bar */}
          <rect x="95" y="76" width={30 * 10} height="20" rx="3" className="fill-purple-500/40" />
          <text x="88" y="90" textAnchor="end" fontSize="10" className="fill-gray-300">5 000 m</text>
          <text x={95 + 30 * 10 + 8} y="90" fontSize="10" className="fill-purple-300" fontWeight="600">30 °C swing</text>
        </g>
      </svg>
    </div>
  );
}
