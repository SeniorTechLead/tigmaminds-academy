export default function TransectMethodDiagram() {
  const butterflies = [
    { x: 140, y: 145, sp: 'A' }, { x: 200, y: 155, sp: 'B' }, { x: 280, y: 140, sp: 'A' },
    { x: 340, y: 160, sp: 'C' }, { x: 400, y: 148, sp: 'A' }, { x: 420, y: 138, sp: 'B' },
    { x: 480, y: 155, sp: 'C' }, { x: 520, y: 142, sp: 'A' },
  ];

  const colors: Record<string, string> = { A: '#f59e0b', B: '#3b82f6', C: '#ef4444' };

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Transect survey method: walk a fixed path and count every butterfly within 5 meters on each side">
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">The Transect Method</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Walk a fixed path at a steady pace — count everything you see within 5 m on each side</text>

        {/* Transect path */}
        <line x1="100" y1="170" x2="600" y2="170" stroke="#22c55e" strokeWidth="3" strokeDasharray="10 5" />
        <text x="80" y="175" textAnchor="end" fontSize="10" fill="#22c55e" fontWeight="600">Start</text>
        <text x="620" y="175" fontSize="10" fill="#22c55e" fontWeight="600">End</text>

        {/* 5m buffer zone */}
        <rect x="100" y="120" width="500" height="100" rx="4" fill="#22c55e" opacity="0.06" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 3" />
        <text x="610" y="130" fontSize="10" className="fill-gray-500 dark:fill-slate-400">5 m</text>
        <text x="610" y="210" fontSize="10" className="fill-gray-500 dark:fill-slate-400">5 m</text>

        {/* Walker icon */}
        <circle cx="320" cy="170" r="8" fill="#22c55e" opacity="0.3" />
        <text x="320" y="174" textAnchor="middle" fontSize="10">🚶</text>

        {/* Butterflies */}
        {butterflies.map((b, i) => (
          <g key={i}>
            <circle cx={b.x} cy={b.y} r="10" fill={colors[b.sp]} opacity="0.2" />
            <text x={b.x} y={b.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={colors[b.sp]}>{b.sp}</text>
          </g>
        ))}

        {/* Tally box */}
        <rect x="120" y="240" width="200" height="80" rx="6" className="fill-gray-50 dark:fill-slate-800/50" stroke="#94a3b8" strokeWidth="1" />
        <text x="220" y="260" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Tally Sheet</text>
        <text x="140" y="280" fontSize="11" fill="#f59e0b">Species A: 4</text>
        <text x="140" y="296" fontSize="11" fill="#3b82f6">Species B: 2</text>
        <text x="140" y="312" fontSize="11" fill="#ef4444">Species C: 2</text>

        {/* Rules box */}
        <rect x="360" y="240" width="260" height="80" rx="6" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
        <text x="490" y="260" textAnchor="middle" fontSize="12" fontWeight="600" fill="#22c55e">Transect Rules</text>
        {[
          'Same path every time',
          'Same time of day',
          'Same walking speed',
          'Record weather conditions',
        ].map((r, i) => (
          <text key={i} x="380" y={278 + i * 14} fontSize="10" className="fill-gray-600 dark:fill-slate-300">• {r}</text>
        ))}

        <text x="350" y="356" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Consistency is everything — if you change the method, you can’t compare results</text>
      </svg>
    </div>
  );
}
