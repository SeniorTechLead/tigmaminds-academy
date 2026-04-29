export default function NitrogenCycleDiagram() {
  const cx = 250, cy = 190, r = 140;
  const steps = [
    { label: 'N₂ in\natmosphere', angle: -90, color: 'fill-sky-500 dark:fill-sky-400' },
    { label: 'Nitrogen-fixing\nbacteria', angle: -40, color: 'fill-emerald-500 dark:fill-emerald-400' },
    { label: 'NH₃\n(ammonia)', angle: 10, color: 'fill-amber-500 dark:fill-amber-400' },
    { label: 'NO₃⁻\n(nitrates)', angle: 60, color: 'fill-orange-500 dark:fill-orange-400' },
    { label: 'Plants\nabsorb', angle: 115, color: 'fill-green-600 dark:fill-green-400' },
    { label: 'Animals\nconsume', angle: 160, color: 'fill-red-500 dark:fill-red-400' },
    { label: 'Decomposers\nbreak down', angle: 210, color: 'fill-amber-700 dark:fill-amber-500' },
    { label: 'Denitrifying\nbacteria', angle: -145, color: 'fill-purple-500 dark:fill-purple-400' },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 442" className="w-full max-w-2xl mx-auto" role="img" aria-label="Nitrogen cycle diagram showing circular flow from atmospheric nitrogen through organisms and back">
        <text x="250" y="25" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">The Nitrogen Cycle</text>

        {/* Step nodes */}
        {steps.map((step, i) => {
          const rad = (step.angle * Math.PI) / 180;
          const x = cx + Math.cos(rad) * r;
          const y = cy + Math.sin(rad) * r;
          const lines = step.label.split('\n');
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="32" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1.5" />
              {lines.map((line, li) => (
                <text key={li} x={x} y={y + (li - (lines.length - 1) / 2) * 12} textAnchor="middle" className={step.color} fontSize="10" fontWeight="600" dominantBaseline="central">
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* Arrows between steps */}
        {steps.map((_, i) => {
          const next = (i + 1) % steps.length;
          const a1 = (steps[i].angle * Math.PI) / 180;
          const a2 = (steps[next].angle * Math.PI) / 180;
          const x1 = cx + Math.cos(a1) * (r + 36);
          const y1 = cy + Math.sin(a1) * (r + 36);
          const x2 = cx + Math.cos(a2) * (r + 36);
          const y2 = cy + Math.sin(a2) * (r + 36);
          const mx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * -0.15;
          const my = (y1 + y2) / 2 + (cy - (y1 + y2) / 2) * -0.15;
          return (
            <path key={`a${i}`}
              d={`M ${x1},${y1} Q ${mx},${my} ${x2},${y2}`}
              fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5"
              markerEnd="url(#nArrow)"
            />
          );
        })}

        {/* Process labels along arrows */}
        <text x="370" y="75" className="fill-gray-500 dark:fill-gray-400" fontSize="10">fixation</text>
        <text x="410" y="155" className="fill-gray-500 dark:fill-gray-400" fontSize="10">nitrification</text>
        <text x="400" y="240" className="fill-gray-500 dark:fill-gray-400" fontSize="10">nitrification</text>
        <text x="310" y="335" className="fill-gray-500 dark:fill-gray-400" fontSize="10">absorption</text>
        <text x="160" y="350" className="fill-gray-500 dark:fill-gray-400" fontSize="10">consumption</text>
        <text x="60" y="295" className="fill-gray-500 dark:fill-gray-400" fontSize="10">decomposition</text>
        <text x="35" y="180" className="fill-gray-500 dark:fill-gray-400" fontSize="10">ammonification</text>
        <text x="80" y="75" className="fill-gray-500 dark:fill-gray-400" fontSize="10">denitrification</text>

        <text x="250" y="392" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Nitrogen continuously cycles between atmosphere, soil, and living organisms</text>

        <defs>
          <marker id="nArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
