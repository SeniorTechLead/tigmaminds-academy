export default function MetallicBondDiagram() {
  const ionPositions: [number, number][] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const x = 45 + col * 55 + (row % 2 === 1 ? 27 : 0);
      const y = 40 + row * 50;
      ionPositions.push([x, y]);
    }
  }

  /* Delocalized electrons scattered between ions */
  const electrons: [number, number][] = [
    [70, 55], [140, 30], [210, 65], [280, 45], [350, 60],
    [55, 100], [120, 85], [190, 110], [260, 95], [330, 105],
    [85, 150], [155, 135], [225, 155], [295, 140], [365, 150],
    [60, 195], [130, 180], [200, 200], [270, 185], [340, 195],
    [100, 70], [170, 150], [240, 30], [310, 170], [380, 90],
    [95, 210], [165, 210], [235, 220], [305, 215], [375, 210],
  ];

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 420 295"
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label="Metallic bonding: sea of electrons model"
      >
        {/* Background for electron sea */}
        <rect x="10" y="10" width="380" height="215" rx="8"
          className="fill-blue-50/50 dark:fill-blue-950/30" />

        {/* Delocalized electrons */}
        {electrons.map(([x, y], i) => (
          <g key={`e-${i}`}>
            <circle cx={x} cy={y} r="3"
              className="fill-blue-400 dark:fill-blue-300" opacity="0.7">
              <animate
                attributeName="cx"
                values={`${x};${x + (i % 2 === 0 ? 8 : -8)};${x}`}
                dur={`${2 + (i % 3)}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${y};${y + (i % 2 === 0 ? -6 : 6)};${y}`}
                dur={`${2.5 + (i % 2)}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* Positive ion cores */}
        {ionPositions.map(([x, y], i) => (
          <g key={`ion-${i}`}>
            <circle cx={x} cy={y} r="16"
              className="fill-gray-200 dark:fill-gray-600 stroke-gray-400 dark:stroke-gray-500"
              strokeWidth="1.5" />
            <text x={x} y={y + 5} textAnchor="middle" fontSize="14"
              fontWeight="bold" className="fill-red-500 dark:fill-red-400">
              +
            </text>
          </g>
        ))}

        {/* Label */}
        <text x="200" y="245" textAnchor="middle" fontSize="12"
          fontWeight="bold" className="fill-gray-600 dark:fill-gray-300">
          Sea of electrons model — metallic bonding
        </text>

        {/* Legend */}
        <circle cx="30" cy="245" r="3" className="fill-blue-400 dark:fill-blue-300" />
        <text x="38" y="248" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          e⁻
        </text>
        <circle cx="60" cy="245" r="6"
          className="fill-gray-200 dark:fill-gray-600 stroke-gray-400 dark:stroke-gray-500"
          strokeWidth="1" />
        <text x="70" y="248" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          Metal ion
        </text>
      </svg>
    </div>
  );
}
