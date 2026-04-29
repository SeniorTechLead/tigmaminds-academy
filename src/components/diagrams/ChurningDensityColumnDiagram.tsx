export default function ChurningDensityColumnDiagram() {
  const layers = [
    { name: 'Honey', density: 1.42, color: '#d97706', y: 20, h: 40 },
    { name: 'Milk', density: 1.03, color: '#fefce8', y: 60, h: 40 },
    { name: 'Water', density: 1.00, color: '#60a5fa', y: 100, h: 40 },
    { name: 'Vegetable oil', density: 0.92, color: '#fbbf24', y: 140, h: 40 },
    { name: 'Rubbing alcohol', density: 0.79, color: '#c4b5fd', y: 180, h: 40 },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 400 280" className="w-full max-w-xl mx-auto" role="img" aria-label="Density column showing liquids layered by density">
        <text x="200" y="16" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Density Column</text>

        {/* Glass container */}
        <rect x="100" y="20" width="140" height="200" rx="4" fill="none" stroke="#94a3b8" strokeWidth="2" />

        {/* Liquid layers */}
        {layers.map((l, i) => (
          <g key={i}>
            <rect x="101" y={l.y} width="138" height={l.h} fill={l.color} opacity={0.85} />
            <text x="250" y={l.y + 25} className="fill-gray-700 dark:fill-gray-200" fontSize="10">
              {l.name} ({l.density} g/cm³)
            </text>
            <line x1="240" y1={l.y + 20} x2="248" y2={l.y + 20} stroke="#94a3b8" strokeWidth="1" />
          </g>
        ))}

        {/* Arrow showing density direction */}
        <text x="70" y="80" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">Less</text>
        <text x="70" y="90" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">dense</text>
        <line x1="70" y1="95" x2="70" y2="200" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#density-arrow)" />
        <text x="70" y="215" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">More</text>
        <text x="70" y="225" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">dense</text>

        <defs>
          <marker id="density-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-500 dark:fill-slate-400" />
          </marker>
        </defs>

        <text x="200" y="270" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Denser liquids sink to the bottom</text>
      </svg>
    </div>
  );
}
