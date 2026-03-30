export default function ChurningEmulsifierDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" role="img" aria-label="Emulsifier molecule with polar head in water and nonpolar tail in oil, bridging the two layers">
        <style>{`
          .em-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .em-label { font-family: system-ui, sans-serif; font-size: 10px; }
          .em-small { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="480" height="280" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="240" y="24" textAnchor="middle" className="em-title fill-gray-700 dark:fill-gray-200">How Emulsifiers Bridge Oil and Water</text>

        {/* Oil layer (top) */}
        <rect x="40" y="40" width="400" height="90" rx="4" className="fill-yellow-100 dark:fill-yellow-800/30" />
        <text x="60" y="60" className="em-label fill-yellow-600 dark:fill-yellow-400" fontWeight="600">Oil (nonpolar)</text>

        {/* Water layer (bottom) */}
        <rect x="40" y="130" width="400" height="90" rx="4" className="fill-blue-100 dark:fill-blue-800/30" />
        <text x="60" y="210" className="em-label fill-blue-600 dark:fill-blue-400" fontWeight="600">Water (polar)</text>

        {/* Emulsifier molecules at interface */}
        {[120, 200, 280, 360].map((x, i) => (
          <g key={i}>
            {/* Nonpolar tail (in oil) */}
            <line x1={x} y1={80} x2={x} y2={120} className="stroke-yellow-500" strokeWidth="3" />
            <text x={x + 8} y={95} className="em-small fill-yellow-600 dark:fill-yellow-400">tail</text>
            {/* Polar head (in water) */}
            <circle cx={x} cy={135} r={10} className="fill-blue-400 dark:fill-blue-500" />
            <text x={x + 14} y={142} className="em-small fill-blue-600 dark:fill-blue-300">head</text>
          </g>
        ))}

        {/* Interface line */}
        <line x1="40" y1="130" x2="440" y2="130" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="4 3" />
        <text x="445" y="134" className="em-small fill-gray-500 dark:fill-gray-400">interface</text>

        {/* Legend */}
        <line x1="60" y1="245" x2="80" y2="245" className="stroke-yellow-500" strokeWidth="3" />
        <text x="85" y="249" className="em-small fill-gray-600 dark:fill-gray-300">Nonpolar tail (dissolves in oil)</text>

        <circle cx="250" cy="245" r="6" className="fill-blue-400" />
        <text x="260" y="249" className="em-small fill-gray-600 dark:fill-gray-300">Polar head (dissolves in water)</text>

        <text x="240" y="272" textAnchor="middle" className="em-small fill-gray-400 dark:fill-gray-500">Soap and lecithin are emulsifiers — one end likes water, the other likes oil</text>
      </svg>
    </div>
  );
}
