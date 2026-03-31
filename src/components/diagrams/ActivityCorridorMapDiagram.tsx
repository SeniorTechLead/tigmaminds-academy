export default function ActivityCorridorMapDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: draw a wildlife corridor map connecting two forest patches across a landscape"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-green-600 dark:fill-green-400">
          Try This: Design a Wildlife Corridor
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: graph paper, colored pencils, and a ruler
        </text>

        {/* Instructions */}
        {[
          { step: '1', text: 'Draw a 10\u00d710 grid on graph paper. Each cell = 1 km\u00b2.' },
          { step: '2', text: 'Color 2 forest patches (green), 1 road (gray), farms (yellow), village (red).' },
          { step: '3', text: 'Draw the cheapest path from Forest A to Forest B avoiding road/village.' },
          { step: '4', text: 'Calculate: How many cells does your corridor use? How wide is it?' },
        ].map(({ step, text }, i) => (
          <g key={step}>
            <circle cx="72" cy={78 + i * 30} r="12" className="fill-green-500" opacity="0.15" />
            <text x="72" y={82 + i * 30} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-green-500">{step}</text>
            <text x="95" y={82 + i * 30} fontSize="11" className="fill-gray-700 dark:fill-slate-300">{text}</text>
          </g>
        ))}

        {/* Example grid */}
        <rect x="60" y="200" width="300" height="240" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="210" y="220" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Example Map</text>

        {/* Grid cells */}
        {Array.from({ length: 7 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => {
            const x = 75 + col * 32;
            const y = 230 + row * 27;
            // Forest A
            if ((row <= 1 && col <= 2) || (row === 2 && col <= 1)) return (
              <rect key={`${row}-${col}`} x={x} y={y} width="30" height="25" rx="2" fill="#10b981" opacity="0.3" stroke="#10b981" strokeWidth="0.5" />
            );
            // Forest B
            if ((row >= 5 && col >= 5) || (row === 4 && col >= 6)) return (
              <rect key={`${row}-${col}`} x={x} y={y} width="30" height="25" rx="2" fill="#10b981" opacity="0.3" stroke="#10b981" strokeWidth="0.5" />
            );
            // Road
            if (col === 4) return (
              <rect key={`${row}-${col}`} x={x} y={y} width="30" height="25" rx="2" fill="#6b7280" opacity="0.2" stroke="#6b7280" strokeWidth="0.5" />
            );
            // Village
            if (row === 3 && col === 3) return (
              <rect key={`${row}-${col}`} x={x} y={y} width="30" height="25" rx="2" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="0.5" />
            );
            // Farm
            if ((row === 2 && col >= 3 && col <= 5) || (row === 4 && col >= 2 && col <= 4)) return (
              <rect key={`${row}-${col}`} x={x} y={y} width="30" height="25" rx="2" fill="#fbbf24" opacity="0.15" stroke="#fbbf24" strokeWidth="0.5" />
            );
            // Empty
            return (
              <rect key={`${row}-${col}`} x={x} y={y} width="30" height="25" rx="2" fill="none" className="stroke-gray-200 dark:stroke-slate-700" strokeWidth="0.5" />
            );
          })
        )}

        {/* Labels */}
        <text x="100" y="248" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Forest A</text>
        <text x="280" y="405" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Forest B</text>

        {/* Corridor path (dotted) */}
        <path d="M 115 285 L 140 310 L 175 340 L 210 365 L 245 380 L 280 395"
          fill="none" stroke="#14b8a6" strokeWidth="3" strokeDasharray="5 3" opacity="0.6" />

        {/* Legend */}
        <rect x="400" y="200" width="260" height="200" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="530" y="220" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Legend &amp; Cost</text>
        {[
          { color: '#10b981', label: 'Forest', cost: '1 (easy)' },
          { color: '#fbbf24', label: 'Farm', cost: '3 (moderate)' },
          { color: '#6b7280', label: 'Road', cost: '8 (hard)' },
          { color: '#ef4444', label: 'Village', cost: '\u221e (blocked)' },
          { color: '#14b8a6', label: 'Your corridor', cost: '\u2014' },
        ].map(({ color, label, cost }, i) => (
          <g key={label}>
            <rect x="420" y={232 + i * 24} width="16" height="14" rx="2" fill={color} opacity="0.4" />
            <text x="444" y={243 + i * 24} fontSize="10" className="fill-gray-600 dark:fill-slate-400">{label}</text>
            <text x="580" y={243 + i * 24} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{cost}</text>
          </g>
        ))}

        <text x="530" y="368" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-teal-600 dark:fill-teal-400">
          Lowest total cost = best corridor!
        </text>
        <text x="530" y="385" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">
          This is how real conservation
        </text>
        <text x="530" y="398" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">
          planners design corridors.
        </text>

        {/* Bottom */}
        <rect x="60" y="420" width="580" height="30" rx="6" className="fill-green-50 dark:fill-green-950/30 stroke-green-200 dark:stroke-green-800" strokeWidth="1" />
        <text x="350" y="440" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-700 dark:fill-green-300">
          You just did GIS corridor modeling \u2014 using paper instead of a computer!
        </text>
      </svg>
    </div>
  );
}
