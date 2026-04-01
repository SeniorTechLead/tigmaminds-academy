/**
 * Static recursion tree for factorial(4).
 * Shows the call stack unfolding and folding back.
 */
export default function RecursionTreeDiagram() {
  const calls = [
    { label: 'factorial(4)', x: 180, y: 30, result: '= 4 × 6 = 24' },
    { label: 'factorial(3)', x: 180, y: 75, result: '= 3 × 2 = 6' },
    { label: 'factorial(2)', x: 180, y: 120, result: '= 2 × 1 = 2' },
    { label: 'factorial(1)', x: 180, y: 165, result: '= 1 (base case)' },
  ];

  return (
    <svg viewBox="0 0 380 240" className="w-full max-w-sm mx-auto" role="img" aria-label="Recursion tree showing factorial(4) call stack">
      {/* Title */}
      <text x="190" y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="12" fontWeight="700">
        Recursion: factorial(4)
      </text>

      {/* Arrows connecting calls */}
      {calls.slice(0, -1).map((c, i) => (
        <g key={i}>
          {/* Down arrow (calling) */}
          <line x1={c.x - 30} y1={c.y + 14} x2={calls[i + 1].x - 30} y2={calls[i + 1].y - 6}
            className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x={c.x - 46} y={(c.y + calls[i + 1].y) / 2 + 4}
            className="fill-blue-500 dark:fill-blue-400" fontSize="8" textAnchor="middle">
            calls
          </text>
          {/* Up arrow (returning) */}
          <line x1={c.x + 30} y1={calls[i + 1].y - 6} x2={c.x + 30} y2={c.y + 14}
            className="stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="1.5" />
          <text x={c.x + 46} y={(c.y + calls[i + 1].y) / 2 + 4}
            className="fill-emerald-500 dark:fill-emerald-400" fontSize="8" textAnchor="middle">
            returns
          </text>
        </g>
      ))}

      {/* Call boxes */}
      {calls.map((c, i) => {
        const isBase = i === calls.length - 1;
        return (
          <g key={i}>
            <rect x={c.x - 56} y={c.y - 10} width="112" height="24" rx="6"
              className={
                isBase ? 'fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400 dark:stroke-emerald-600' :
                'fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700'
              }
              strokeWidth="1.5" />
            <text x={c.x} y={c.y + 4} textAnchor="middle"
              className={isBase ? 'fill-emerald-700 dark:fill-emerald-300' : 'fill-blue-700 dark:fill-blue-300'}
              fontSize="11" fontWeight="700" fontFamily="monospace">
              {c.label}
            </text>
            {/* Result on the right */}
            <text x={c.x + 64} y={c.y + 4}
              className={isBase ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-gray-500 dark:fill-gray-400'}
              fontSize="9" fontWeight="600">
              {c.result}
            </text>
          </g>
        );
      })}

      {/* Explanation */}
      <text x="190" y="200" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">
        Each call waits for the one below to return
      </text>
      <text x="190" y="215" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
        Base case (n=1) returns directly — then results flow back up
      </text>
      <text x="190" y="230" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
        4 calls deep = 4 stack frames. Too deep (&gt;1000) causes stack overflow.
      </text>
    </svg>
  );
}
