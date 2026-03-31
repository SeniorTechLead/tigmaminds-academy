export default function PatternEncodingDiagram() {
  const grid = [
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1],
    [1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
    [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
    [1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0],
    [0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1],
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how weaving patterns encode information as binary grids, like traditional NE Indian textiles"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Patterns Encode Information
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Traditional weaving patterns are binary grids {'\u2014'} just like computer data
        </text>

        {/* Weaving grid */}
        <text x="250" y="85" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6366f1">
          Weaving Pattern Grid
        </text>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <rect
              key={`${r}-${c}`}
              x={80 + c * 22}
              y={95 + r * 22}
              width="20"
              height="20"
              fill={cell ? '#6366f1' : '#f59e0b'}
              fillOpacity={cell ? 0.7 : 0.3}
              stroke="#94a3b8"
              strokeWidth="0.5"
            />
          ))
        )}

        {/* Legend */}
        <rect x="80" y="280" width="20" height="14" fill="#6366f1" fillOpacity="0.7" />
        <text x="108" y="292" fontSize="10" className="fill-gray-600 dark:fill-slate-300">= warp on top (1)</text>
        <rect x="220" y="280" width="20" height="14" fill="#f59e0b" fillOpacity="0.3" />
        <text x="248" y="292" fontSize="10" className="fill-gray-600 dark:fill-slate-300">= weft on top (0)</text>

        {/* Binary representation */}
        <text x="590" y="85" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">
          As Binary Code
        </text>
        {grid.map((row, r) => (
          <text key={r} x="490" y={112 + r * 22} fontSize="12" fontFamily="monospace" className="fill-gray-600 dark:fill-slate-300">
            {row.join('')}
          </text>
        ))}

        {/* Arrow connecting them */}
        <path d="M440,180 L470,180" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#pattern-arrow)" />
        <defs>
          <marker id="pattern-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Cultural encoding */}
        <rect x="40" y="310" width="700" height="130" rx="10" fill="#6366f1" fillOpacity="0.05" stroke="#6366f1" strokeWidth="1" />
        <text x="390" y="335" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6366f1">
          Traditional Patterns Carry Meaning
        </text>

        {[
          { x: 110, pattern: '\u25C6\u25C6\u25C6', meaning: 'Diamond = mountains' },
          { x: 270, pattern: '\u223F\u223F\u223F', meaning: 'Wave = rivers' },
          { x: 430, pattern: '\u2726\u2726\u2726', meaning: 'Star = clan identity' },
          { x: 590, pattern: '\u25B2\u25B2\u25B2', meaning: 'Triangle = fertility' },
        ].map((p, i) => (
          <g key={i}>
            <text x={p.x} y={370} textAnchor="middle" fontSize="22" fill="#6366f1">{p.pattern}</text>
            <text x={p.x} y={395} textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{p.meaning}</text>
          </g>
        ))}

        <text x="390" y="425" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-indigo-300">
          A Naga shawl tells you the wearer&apos;s tribe, village, rank, and achievements {'\u2014'} all encoded in the pattern
        </text>
      </svg>
    </div>
  );
}
