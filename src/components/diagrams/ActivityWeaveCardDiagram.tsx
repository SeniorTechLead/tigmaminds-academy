export default function ActivityWeaveCardDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Step-by-step offline activity: weave a small mat from paper strips to understand warp, weft, and tension"
      >
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#6366f1">
          Try This: Paper Strip Weaving
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: 10 paper strips (2 colors, 1 cm wide), tape, scissors
        </text>

        {/* Step 1 */}
        <rect x="30" y="75" width="350" height="150" rx="10" className="fill-white dark:fill-slate-900" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="55" cy="100" r="14" fill="#6366f1" fillOpacity="0.2" />
        <text x="55" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6366f1">1</text>
        <text x="78" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Tape 5 warp strips to a table</text>
        {/* 5 vertical strips taped at top */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <rect x={65 + i * 55} y="120" width="20" height="90" rx="2" fill="#6366f1" fillOpacity="0.3" stroke="#6366f1" strokeWidth="1" />
            <rect x={60 + i * 55} y="115" width="30" height="10" rx="2" fill="#94a3b8" fillOpacity="0.3" />
          </g>
        ))}
        <text x="200" y="130" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">tape</text>

        {/* Step 2 */}
        <rect x="400" y="75" width="350" height="150" rx="10" className="fill-white dark:fill-slate-900" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="425" cy="100" r="14" fill="#f59e0b" fillOpacity="0.2" />
        <text x="425" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">2</text>
        <text x="448" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Weave weft strips over/under</text>
        {/* Vertical strips */}
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={435 + i * 50} y="120" width="16" height="90" rx="2" fill="#6366f1" fillOpacity="0.2" stroke="#6366f1" strokeWidth="0.5" />
        ))}
        {/* Horizontal weft */}
        {[0, 1, 2].map(row => (
          <g key={row}>
            {[0, 1, 2, 3, 4].map(col => {
              const over = (row + col) % 2 === 0;
              const x = 435 + col * 50;
              const y = 130 + row * 26;
              return (
                <rect
                  key={col}
                  x={x - 5}
                  y={y}
                  width="26"
                  height="12"
                  rx="2"
                  fill="#f59e0b"
                  fillOpacity={over ? 0.7 : 0.15}
                  stroke="#f59e0b"
                  strokeWidth={over ? 1 : 0.3}
                />
              );
            })}
          </g>
        ))}
        <text x="575" y="215" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Over, under, over, under...
        </text>

        {/* Step 3 */}
        <rect x="30" y="245" width="350" height="100" rx="10" className="fill-white dark:fill-slate-900" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="55" cy="270" r="14" fill="#22c55e" fillOpacity="0.2" />
        <text x="55" y="276" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">3</text>
        <text x="78" y="276" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Push weft rows tight</text>
        <text x="60" y="300" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Use a ruler to push each new row snugly
        </text>
        <text x="60" y="318" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          against the previous one. This is the "beat"
        </text>
        <text x="60" y="336" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          step {'\u2014'} it makes the weave dense and strong.
        </text>

        {/* Step 4 */}
        <rect x="400" y="245" width="350" height="100" rx="10" className="fill-white dark:fill-slate-900" stroke="#ec4899" strokeWidth="1.5" />
        <circle cx="425" cy="270" r="14" fill="#ec4899" fillOpacity="0.2" />
        <text x="425" y="276" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ec4899">4</text>
        <text x="448" y="276" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Test and compare</text>
        <text x="420" y="300" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Try pulling your weave apart {'\u2014'} it resists!
        </text>
        <text x="420" y="318" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Compare a tight weave vs a loose one.
        </text>
        <text x="420" y="336" fontSize="11" fontWeight="600" fill="#ec4899">
          Which is stronger? Why?
        </text>

        {/* Challenge */}
        <rect x="80" y="365" width="620" height="60" rx="10" fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeWidth="1" />
        <text x="390" y="388" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6366f1">
          Challenge: Create a pattern!
        </text>
        <text x="390" y="408" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-indigo-300">
          Use 3 colors. Design a repeating pattern on graph paper FIRST, then weave it.
        </text>
        <text x="390" y="422" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-indigo-300">
          You have just become a weaver-programmer: the graph paper is your code, the weave is the output.
        </text>
      </svg>
    </div>
  );
}
