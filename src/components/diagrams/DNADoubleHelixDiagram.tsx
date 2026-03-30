export default function DNADoubleHelixDiagram() {
  // Generate helix backbone points
  const basePairs = 10;
  const pairSpacing = 32;
  const startY = 50;
  const centerX = 150;
  const amplitude = 50;

  // Base pair sequence
  const sequence: Array<[string, string, string, string]> = [
    ["A", "T", "#ef4444", "#22c55e"],  // red - green
    ["G", "C", "#3b82f6", "#eab308"],  // blue - yellow
    ["T", "A", "#22c55e", "#ef4444"],
    ["A", "T", "#ef4444", "#22c55e"],
    ["C", "G", "#eab308", "#3b82f6"],
    ["G", "C", "#3b82f6", "#eab308"],
    ["T", "A", "#22c55e", "#ef4444"],
    ["C", "G", "#eab308", "#3b82f6"],
    ["A", "T", "#ef4444", "#22c55e"],
    ["G", "C", "#3b82f6", "#eab308"],
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 380 420" className="w-full max-w-xs mx-auto" role="img" aria-label="DNA double helix diagram">
        <defs>
          <marker id="dna-arrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Title */}
        <text x="150" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">DNA Double Helix</text>

        {/* Draw base pairs and backbone segments */}
        {sequence.map((pair, i) => {
          const y = startY + i * pairSpacing;
          // Sinusoidal offset to simulate helix twist
          const phase = (i / basePairs) * Math.PI * 2.5;
          const leftX = centerX - 35 + Math.sin(phase) * amplitude;
          const rightX = centerX + 35 - Math.sin(phase) * amplitude;

          // Determine if strands cross (which is "in front")
          const leftInFront = Math.cos(phase) > 0;

          return (
            <g key={i}>
              {/* Base pair connecting bar (hydrogen bonds) */}
              <line x1={leftX} y1={y} x2={rightX} y2={y}
                stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3,2" />

              {/* Left base */}
              <circle cx={leftX} cy={y} r="10" fill={pair[2]} opacity="0.85" />
              <text x={leftX} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{pair[0]}</text>

              {/* Right base */}
              <circle cx={rightX} cy={y} r="10" fill={pair[3]} opacity="0.85" />
              <text x={rightX} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{pair[1]}</text>

              {/* Backbone segments (connect to next pair) */}
              {i < basePairs - 1 && (() => {
                const nextY = startY + (i + 1) * pairSpacing;
                const nextPhase = ((i + 1) / basePairs) * Math.PI * 2.5;
                const nextLeftX = centerX - 35 + Math.sin(nextPhase) * amplitude;
                const nextRightX = centerX + 35 - Math.sin(nextPhase) * amplitude;

                return (
                  <>
                    {/* Left backbone */}
                    <line x1={leftX} y1={y} x2={nextLeftX} y2={nextY}
                      className={leftInFront ? "stroke-blue-600 dark:stroke-blue-400" : "stroke-blue-400 dark:stroke-blue-600"}
                      strokeWidth={leftInFront ? 3 : 2} opacity={leftInFront ? 1 : 0.5} />
                    {/* Right backbone */}
                    <line x1={rightX} y1={y} x2={nextRightX} y2={nextY}
                      className={!leftInFront ? "stroke-orange-600 dark:stroke-orange-400" : "stroke-orange-400 dark:stroke-orange-600"}
                      strokeWidth={!leftInFront ? 3 : 2} opacity={!leftInFront ? 1 : 0.5} />
                  </>
                );
              })()}
            </g>
          );
        })}

        {/* Labels */}

        {/* Backbone label — left */}
        <line x1="75" y1="100" x2="40" y2="80" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="38" y="75" textAnchor="end" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Sugar-phosphate</text>
        <text x="38" y="86" textAnchor="end" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">backbone</text>

        {/* Base pairs label */}
        <line x1="172" y1="146" x2="248" y2="130" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="250" y="128" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Base pairs</text>

        {/* Hydrogen bonds label */}
        <line x1="150" y1="210" x2="248" y2="195" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="250" y="193" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Hydrogen</text>
        <text x="250" y="204" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">bonds</text>

        {/* Legend */}
        <g transform="translate(10, 360)">
          <circle cx="10" cy="0" r="6" fill="#ef4444" />
          <text x="20" y="4" className="fill-gray-700 dark:fill-gray-300" fontSize="10">A</text>
          <circle cx="50" cy="0" r="6" fill="#22c55e" />
          <text x="60" y="4" className="fill-gray-700 dark:fill-gray-300" fontSize="10">T</text>

          <circle cx="100" cy="0" r="6" fill="#3b82f6" />
          <text x="110" y="4" className="fill-gray-700 dark:fill-gray-300" fontSize="10">G</text>
          <circle cx="140" cy="0" r="6" fill="#eab308" />
          <text x="150" y="4" className="fill-gray-700 dark:fill-gray-300" fontSize="10">C</text>

          <text x="190" y="4" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(A-T, G-C pairing)</text>
        </g>
      </svg>
    </div>
  );
}
