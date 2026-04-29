export default function EarthLayersDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 502 445" className="w-full max-w-2xl mx-auto" role="img" aria-label="Cross-section of Earth showing layers">
        {/* Inner core */}
        <circle cx="200" cy="200" r="180" className="fill-amber-800 dark:fill-amber-900" />
        {/* Outer core */}
        <circle cx="200" cy="200" r="180" className="fill-yellow-600 dark:fill-yellow-700" />
        {/* Mantle */}
        <circle cx="200" cy="200" r="140" className="fill-orange-500 dark:fill-orange-600" />
        {/* Outer core circle */}
        <circle cx="200" cy="200" r="85" className="fill-yellow-500 dark:fill-yellow-600" />
        {/* Inner core circle */}
        <circle cx="200" cy="200" r="45" className="fill-red-600 dark:fill-red-700" />

        {/* Cut-away: reveal cross-section with a wedge mask */}
        <defs>
          <clipPath id="earth-clip">
            <path d="M 200,200 L 200,0 A 200,200 0 0,1 400,200 Z" />
          </clipPath>
        </defs>

        {/* Full circle rendering — the wedge clip shows the slice */}
        <g clipPath="url(#earth-clip)">
          <circle cx="200" cy="200" r="180" className="fill-amber-900 dark:fill-amber-950" stroke="#7c2d12" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" className="fill-orange-400 dark:fill-orange-600" stroke="#c2410c" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="85" className="fill-yellow-400 dark:fill-yellow-500" stroke="#ca8a04" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="45" className="fill-red-500 dark:fill-red-600" stroke="#dc2626" strokeWidth="0.5" />
        </g>

        {/* Surface outline */}
        <circle cx="200" cy="200" r="180" fill="none" className="stroke-gray-700 dark:stroke-gray-400" strokeWidth="1.5" />

        {/* Label lines and text — right side of wedge */}
        {/* Crust label */}
        <line x1="340" y1="60" x2="370" y2="40" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
        <text x="372" y="36" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Crust</text>
        <text x="372" y="48" className="fill-gray-500 dark:fill-gray-400" fontSize="10">5–70 km</text>

        {/* Mantle label */}
        <line x1="310" y1="110" x2="360" y2="80" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
        <text x="362" y="76" className="fill-orange-700 dark:fill-orange-300" fontSize="11" fontWeight="bold">Mantle</text>
        <text x="362" y="88" className="fill-gray-500 dark:fill-gray-400" fontSize="10">2,900 km</text>

        {/* Outer core label */}
        <line x1="260" y1="155" x2="350" y2="130" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
        <text x="352" y="126" className="fill-yellow-700 dark:fill-yellow-300" fontSize="11" fontWeight="bold">Outer Core</text>
        <text x="352" y="138" className="fill-gray-500 dark:fill-gray-400" fontSize="10">2,200 km (liquid)</text>

        {/* Inner core label */}
        <line x1="225" y1="185" x2="340" y2="170" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1" />
        <text x="342" y="166" className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="bold">Inner Core</text>
        <text x="342" y="178" className="fill-gray-500 dark:fill-gray-400" fontSize="10">1,200 km (solid)</text>

        {/* Title */}
        <text x="200" y="395" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">
          Layers of the Earth
        </text>
      </svg>
    </div>
  );
}
