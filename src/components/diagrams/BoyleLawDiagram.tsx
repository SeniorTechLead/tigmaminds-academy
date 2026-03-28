export default function BoyleLawDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 450 250" className="w-full max-w-lg mx-auto" role="img" aria-label="Boyle's Law diagram showing pressure and volume relationship">
        {/* Title */}
        <text x="225" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Boyle&apos;s Law: P × V = constant (at constant T)
        </text>

        {/* State 1: Large volume, low pressure */}
        <g transform="translate(30, 40)">
          {/* Cylinder */}
          <rect x="20" y="10" width="120" height="160" rx="4"
            className="fill-sky-50 dark:fill-sky-900/20 stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          {/* Gas particles */}
          {[[40, 60], [80, 40], [60, 100], [100, 70], [50, 140], [110, 120], [70, 80], [90, 150]].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="5" className="fill-blue-400 dark:fill-blue-500" opacity="0.7">
              <animate attributeName="cx" values={`${px};${px + 5};${px - 3};${px}`} dur="3s" repeatCount="indefinite" />
            </circle>
          ))}
          {/* Piston (at top) */}
          <rect x="18" y="2" width="124" height="14" rx="3"
            className="fill-gray-400 dark:fill-gray-500 stroke-gray-600" strokeWidth="1.5" />
          <rect x="72" y="-15" width="16" height="20" rx="2" className="fill-gray-500 dark:fill-gray-600" />
          {/* Labels */}
          <text x="80" y="195" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="bold">
            Large Volume
          </text>
          <text x="80" y="210" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
            Low Pressure
          </text>
        </g>

        {/* Arrow between states */}
        <g transform="translate(195, 100)">
          <line x1="0" y1="20" x2="50" y2="20" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <polygon points="50,14 65,20 50,26" className="fill-gray-500 dark:fill-gray-400" />
          <text x="32" y="12" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Compress</text>
        </g>

        {/* State 2: Small volume, high pressure */}
        <g transform="translate(275, 40)">
          {/* Cylinder */}
          <rect x="20" y="80" width="120" height="90" rx="4"
            className="fill-sky-100 dark:fill-sky-800/30 stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          {/* Gas particles (same number, tighter) */}
          {[[45, 100], [75, 95], [55, 125], [95, 110], [50, 145], [100, 140], [65, 110], [85, 150]].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="5" className="fill-red-400 dark:fill-red-500" opacity="0.8">
              <animate attributeName="cx" values={`${px};${px + 3};${px - 2};${px}`} dur="2s" repeatCount="indefinite" />
            </circle>
          ))}
          {/* Piston (pushed down) */}
          <rect x="18" y="72" width="124" height="14" rx="3"
            className="fill-gray-400 dark:fill-gray-500 stroke-gray-600" strokeWidth="1.5" />
          <rect x="72" y="40" width="16" height="35" rx="2" className="fill-gray-500 dark:fill-gray-600" />
          {/* Compression arrows */}
          <line x1="80" y1="30" x2="80" y2="42" className="stroke-red-500" strokeWidth="2" />
          <polygon points="74,42 80,52 86,42" className="fill-red-500" />
          {/* Labels */}
          <text x="80" y="195" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="bold">
            Small Volume
          </text>
          <text x="80" y="210" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
            High Pressure
          </text>
        </g>

        {/* Formula at bottom */}
        <rect x="130" y="225" width="190" height="22" rx="6" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="225" y="241" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
          P₁ × V₁ = P₂ × V₂
        </text>
      </svg>
    </div>
  );
}
