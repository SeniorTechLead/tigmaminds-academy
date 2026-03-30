export default function EnergyConversionChainDiagram() {
  const steps = [
    { x: 15, label: 'Sun', sub: 'Nuclear energy', color: 'fill-yellow-400', textColor: 'fill-yellow-800' },
    { x: 120, label: 'Plant', sub: 'Chemical energy', color: 'fill-emerald-400 dark:fill-emerald-500', textColor: 'fill-emerald-800 dark:fill-emerald-200' },
    { x: 225, label: 'Food', sub: 'Chemical energy', color: 'fill-amber-300 dark:fill-amber-500', textColor: 'fill-amber-800 dark:fill-amber-200' },
    { x: 330, label: 'Muscle', sub: 'Kinetic energy', color: 'fill-blue-300 dark:fill-blue-500', textColor: 'fill-blue-800 dark:fill-blue-200' },
    { x: 435, label: 'Heat', sub: 'Thermal energy', color: 'fill-red-300 dark:fill-red-500', textColor: 'fill-red-800 dark:fill-red-200' },
  ];

  const arrows = [
    { x: 82, label: 'Photosynthesis' },
    { x: 187, label: 'Eating' },
    { x: 292, label: 'Metabolism' },
    { x: 397, label: 'Friction' },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 546 190" className="w-full max-w-2xl mx-auto" role="img" aria-label="Energy conversion chain diagram">
        <defs>
          <marker id="ecArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Step boxes */}
        {steps.map((step, i) => (
          <g key={i}>
            <rect x={step.x} y="35" width="70" height="55" rx="10" className={step.color} opacity="0.85" />
            <text x={step.x + 35} y="60" textAnchor="middle" className={step.textColor} fontSize="12" fontWeight="bold">{step.label}</text>
            <text x={step.x + 35} y="78" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="9">{step.sub}</text>
          </g>
        ))}

        {/* Arrows between steps */}
        {arrows.map((arrow, i) => (
          <g key={`arrow-${i}`}>
            <line x1={arrow.x + 3} y1="62" x2={arrow.x + 33} y2="62" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#ecArrow)" />
            <text x={arrow.x + 18} y="110" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{arrow.label}</text>
          </g>
        ))}

        {/* Sun rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const cx = 50, cy = 20;
          return (
            <line key={angle}
              x1={cx + Math.cos(rad) * 8} y1={cy + Math.sin(rad) * 8}
              x2={cx + Math.cos(rad) * 14} y2={cy + Math.sin(rad) * 14}
              className="stroke-yellow-400" strokeWidth="1.5" strokeLinecap="round" />
          );
        })}
        <circle cx="50" cy="20" r="7" className="fill-yellow-400" />

        {/* Title */}
        <text x="260" y="140" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">
          Energy is never created or destroyed — only converted
        </text>
      </svg>
    </div>
  );
}
