export default function SquareCubeLawDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Square-cube law: why small animals can glide but large ones cannot, showing surface area vs volume scaling"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          The Square-Cube Law: Why Small Animals Glide Better
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Double the size → surface area ×4, but volume (mass) ×8
        </text>

        {/* Three cubes of increasing size */}
        {[
          { x: 150, size: 40, label: 'Small (1\u00d7)', sa: '6', vol: '1', ratio: '6.0', color: '#22c55e', animal: 'Flying squirrel (1 kg)' },
          { x: 390, size: 65, label: 'Medium (2\u00d7)', sa: '24', vol: '8', ratio: '3.0', color: '#f59e0b', animal: 'Cat-sized (8 kg)' },
          { x: 630, size: 90, label: 'Large (3\u00d7)', sa: '54', vol: '27', ratio: '2.0', color: '#ef4444', animal: 'Dog-sized (27 kg)' },
        ].map((c) => (
          <g key={c.x}>
            <text x={c.x} y="90" textAnchor="middle" fontSize="13" fontWeight="700" fill={c.color}>
              {c.label}
            </text>
            {/* Cube */}
            <rect
              x={c.x - c.size / 2}
              y={220 - c.size}
              width={c.size}
              height={c.size}
              rx="4"
              fill={c.color}
              opacity="0.25"
              stroke={c.color}
              strokeWidth="2"
            />
            {/* 3D effect */}
            <path
              d={`M ${c.x - c.size / 2} ${220 - c.size} L ${c.x - c.size / 2 + c.size * 0.25} ${220 - c.size - c.size * 0.2} L ${c.x + c.size / 2 + c.size * 0.25} ${220 - c.size - c.size * 0.2} L ${c.x + c.size / 2} ${220 - c.size}`}
              fill={c.color}
              opacity="0.15"
              stroke={c.color}
              strokeWidth="1"
            />
            <path
              d={`M ${c.x + c.size / 2} ${220 - c.size} L ${c.x + c.size / 2 + c.size * 0.25} ${220 - c.size - c.size * 0.2} L ${c.x + c.size / 2 + c.size * 0.25} ${220 - c.size * 0.2} L ${c.x + c.size / 2} ${220}`}
              fill={c.color}
              opacity="0.1"
              stroke={c.color}
              strokeWidth="1"
            />

            <text x={c.x} y="242" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
              Surface: {c.sa} units²
            </text>
            <text x={c.x} y="260" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
              Volume: {c.vol} units³
            </text>
            <text x={c.x} y="280" textAnchor="middle" fontSize="12" fontWeight="700" fill={c.color}>
              SA/Vol = {c.ratio}
            </text>
            <text x={c.x} y="300" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              {c.animal}
            </text>
          </g>
        ))}

        {/* Explanation */}
        <rect x="80" y="320" width="620" height="55" rx="10" className="fill-blue-50 dark:fill-blue-950" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="390" y="342" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">
          Higher surface-to-volume ratio = better gliding
        </text>
        <text x="390" y="360" textAnchor="middle" fontSize="11" className="fill-blue-600 dark:fill-blue-400">
          Small animals have relatively more surface (wing area) per unit of mass (weight).
        </text>
        <text x="390" y="374" textAnchor="middle" fontSize="11" className="fill-blue-600 dark:fill-blue-400">
          That is why flying squirrels glide but elephants never could!
        </text>

        {/* The math */}
        <rect x="120" y="390" width="540" height="55" rx="8" className="fill-slate-50 dark:fill-slate-900" stroke="#94a3b8" strokeWidth="1" />
        <text x="390" y="410" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
          The Math: Surface area scales as L², volume as L³
        </text>
        <text x="390" y="430" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Wing loading (mass / wing area) increases with size → bigger animals need powered flight
        </text>
      </svg>
    </div>
  );
}
