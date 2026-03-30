export default function HanumanAltitudeZonesDiagram() {
  const zones = [
    { y: 280, h: 50, label: 'Tropical Forest', range: '0–1,000 m', color: 'fill-green-600 dark:fill-green-700', textColor: 'fill-green-100', flora: 'Sal, teak, bamboo' },
    { y: 225, h: 55, label: 'Subtropical', range: '1,000–2,000 m', color: 'fill-green-500 dark:fill-green-600', textColor: 'fill-green-100', flora: 'Oak, rhododendron' },
    { y: 170, h: 55, label: 'Temperate', range: '2,000–3,500 m', color: 'fill-emerald-400 dark:fill-emerald-500', textColor: 'fill-emerald-900', flora: 'Conifers, ferns, medicinal herbs' },
    { y: 120, h: 50, label: 'Subalpine', range: '3,500–4,500 m', color: 'fill-teal-300 dark:fill-teal-500', textColor: 'fill-teal-900', flora: 'Juniper, dwarf shrubs' },
    { y: 80, h: 40, label: 'Alpine Meadow', range: '4,500–5,500 m', color: 'fill-yellow-200 dark:fill-yellow-400', textColor: 'fill-yellow-900', flora: 'Grasses, mosses, rare herbs' },
    { y: 55, h: 25, label: 'Snow/Ice', range: '5,500 m +', color: 'fill-white dark:fill-gray-200', textColor: 'fill-gray-700', flora: 'No plants' },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 520 370" className="w-full max-w-lg mx-auto" role="img" aria-label="Altitude zones on a Himalayan mountain showing plant types at each level">
        {/* Title */}
        <text x="260" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Himalayan Altitude Zones
        </text>
        <text x="260" y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Why rare plants grow only at certain heights
        </text>

        {/* Mountain silhouette */}
        <path d="M 60,330 L 200,55 L 340,330 Z" className="fill-gray-300/30 dark:fill-gray-600/30" />

        {/* Zones as horizontal bands clipped to mountain */}
        <defs>
          <clipPath id="mtn-clip">
            <path d="M 60,330 L 200,55 L 340,330 Z" />
          </clipPath>
        </defs>

        <g clipPath="url(#mtn-clip)">
          {zones.map((z, i) => (
            <rect key={i} x="60" y={z.y} width="280" height={z.h} className={z.color} />
          ))}
        </g>

        {/* Mountain outline */}
        <path d="M 60,330 L 200,55 L 340,330 Z" fill="none" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1.5" />

        {/* Labels on right side */}
        {zones.map((z, i) => (
          <g key={i}>
            <line x1="342" y1={z.y + z.h / 2} x2="360" y2={z.y + z.h / 2} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
            <text x="365" y={z.y + z.h / 2 - 4} className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">{z.label}</text>
            <text x="365" y={z.y + z.h / 2 + 8} className="fill-gray-500 dark:fill-gray-400" fontSize="9">{z.range}</text>
            <text x="365" y={z.y + z.h / 2 + 19} className="fill-gray-400 dark:fill-gray-500" fontSize="8" fontStyle="italic">{z.flora}</text>
          </g>
        ))}

        {/* Annotations: UV, O2, temperature */}
        <text x="50" y="80" textAnchor="end" className="fill-purple-600 dark:fill-purple-400" fontSize="9" fontWeight="bold">↑ UV</text>
        <text x="50" y="93" textAnchor="end" className="fill-blue-600 dark:fill-blue-400" fontSize="9" fontWeight="bold">↓ O₂</text>
        <text x="50" y="106" textAnchor="end" className="fill-cyan-600 dark:fill-cyan-400" fontSize="9" fontWeight="bold">↓ Temp</text>
        <line x1="55" y1="75" x2="55" y2="320" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="3 3" />

        {/* Sanjeevani hint */}
        <circle cx="200" cy="95" r="8" className="fill-yellow-400 dark:fill-yellow-500 stroke-yellow-600 dark:stroke-yellow-400" strokeWidth="1.5" />
        <text x="200" y="99" textAnchor="middle" className="fill-yellow-800 dark:fill-yellow-900" fontSize="10" fontWeight="bold">✦</text>
        <text x="218" y="95" className="fill-yellow-600 dark:fill-yellow-400" fontSize="9" fontWeight="bold">Sanjeevani?</text>

        {/* Caption */}
        <text x="260" y="358" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          Temperature drops ~6.5°C per 1,000 m. Rare herbs survive where most plants cannot.
        </text>
      </svg>
    </div>
  );
}
