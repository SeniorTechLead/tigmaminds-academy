export default function NucleusStructureDiagram() {
  // Packed nucleons in the nucleus
  const protons = [
    { x: 130, y: 140 }, { x: 155, y: 125 }, { x: 165, y: 155 },
    { x: 140, y: 170 }, { x: 120, y: 155 }, { x: 148, y: 148 },
  ];
  const neutrons = [
    { x: 138, y: 128 }, { x: 160, y: 140 }, { x: 150, y: 168 },
    { x: 125, y: 145 }, { x: 145, y: 155 }, { x: 135, y: 162 },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 350 300" className="w-full max-w-md mx-auto" role="img" aria-label="Nucleus structure showing protons and neutrons held by strong nuclear force">
        <text x="175" y="25" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Nucleus Structure</text>

        {/* Atom boundary (much larger, dashed) */}
        <circle cx="145" cy="150" r="120" fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="8,6" />
        <text x="270" y="60" className="fill-gray-400 dark:fill-gray-500" fontSize="10">atom boundary</text>

        {/* Nucleus cluster */}
        <circle cx="145" cy="150" r="38" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" />

        {/* Neutrons (gray) - draw first so protons overlap */}
        {neutrons.map((n, i) => (
          <circle key={`n${i}`} cx={n.x} cy={n.y} r="10" className="fill-gray-400 dark:fill-gray-500 stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        ))}

        {/* Protons (red) */}
        {protons.map((p, i) => (
          <circle key={`p${i}`} cx={p.x} cy={p.y} r="10" className="fill-red-400 dark:fill-red-500 stroke-red-600 dark:stroke-red-400" strokeWidth="1" />
        ))}

        {/* Strong force arrows between some nucleons */}
        {[
          [protons[0], neutrons[0]],
          [protons[1], neutrons[1]],
          [neutrons[2], protons[2]],
          [protons[3], neutrons[3]],
        ].map(([a, b], i) => {
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <g key={`f${i}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" strokeDasharray="3,2" />
              <circle cx={mx} cy={my} r="2" className="fill-amber-500 dark:fill-amber-400" />
            </g>
          );
        })}

        {/* Labels on nucleons */}
        <text x={protons[0].x} y={protons[0].y + 4} textAnchor="middle" className="fill-white" fontSize="10" fontWeight="bold">p⁺</text>
        <text x={neutrons[0].x} y={neutrons[0].y + 4} textAnchor="middle" className="fill-white" fontSize="10" fontWeight="bold">n⁰</text>

        {/* Legend */}
        <circle cx="230" cy="120" r="8" className="fill-red-400 dark:fill-red-500" />
        <text x="244" y="124" className="fill-gray-700 dark:fill-gray-200" fontSize="11">Proton (p⁺)</text>
        <circle cx="230" cy="145" r="8" className="fill-gray-400 dark:fill-gray-500" />
        <text x="244" y="149" className="fill-gray-700 dark:fill-gray-200" fontSize="11">Neutron (n⁰)</text>
        <line x1="222" y1="168" x2="238" y2="168" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" strokeDasharray="3,2" />
        <text x="244" y="172" className="fill-gray-700 dark:fill-gray-200" fontSize="11">Strong force</text>

        {/* Size comparison */}
        <line x1="40" y1="215" x2="40" y2="85" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" markerStart="url(#nucBar)" markerEnd="url(#nucBar)" />
        <text x="28" y="155" className="fill-gray-500 dark:fill-gray-400" fontSize="10" transform="rotate(-90, 28, 155)">~10⁻¹⁰ m (atom)</text>

        <line x1="107" y1="165" x2="107" y2="135" className="stroke-red-400 dark:stroke-red-300" strokeWidth="1" markerStart="url(#nucBar2)" markerEnd="url(#nucBar2)" />

        <rect x="195" y="195" width="145" height="40" rx="6" className="fill-gray-100 dark:fill-gray-800" />
        <text x="267" y="211" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">Nucleus is ~10⁻¹⁵ m</text>
        <text x="267" y="226" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">100,000× smaller than atom!</text>

        <text x="175" y="290" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Strong nuclear force holds protons and neutrons together</text>

        <defs>
          <marker id="nucBar" markerWidth="6" markerHeight="8" refX="3" refY="4" orient="auto">
            <line x1="0" y1="4" x2="6" y2="4" className="stroke-gray-400" strokeWidth="1.5" />
          </marker>
          <marker id="nucBar2" markerWidth="6" markerHeight="8" refX="3" refY="4" orient="auto">
            <line x1="0" y1="4" x2="6" y2="4" className="stroke-red-400" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
