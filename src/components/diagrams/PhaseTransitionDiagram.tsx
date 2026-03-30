export default function PhaseTransitionDiagram() {
  const cx = 200, cy = 200, r = 110;
  const states = [
    { label: 'Solid', angle: -90, color: 'fill-blue-600 dark:fill-blue-400', icon: '🧊' },
    { label: 'Liquid', angle: 30, color: 'fill-emerald-600 dark:fill-emerald-400', icon: '💧' },
    { label: 'Gas', angle: 150, color: 'fill-red-600 dark:fill-red-400', icon: '💨' },
  ];

  const transitions = [
    { from: -90, to: 30, label: 'Melting', outer: true },
    { from: 30, to: 150, label: 'Boiling', outer: true },
    { from: 150, to: -90 + 360, label: 'Deposition', outer: true },
    { from: 30, to: -90 + 360, label: 'Freezing', outer: false },
    { from: 150, to: 30, label: 'Condensation', outer: false },
    { from: -90, to: 150, label: 'Sublimation', outer: false },
  ];

  const posAt = (angle: number, radius: number) => ({
    x: cx + Math.cos((angle * Math.PI) / 180) * radius,
    y: cy + Math.sin((angle * Math.PI) / 180) * radius,
  });

  return (
    <div className="my-4">
      <svg viewBox="0 0 420 435" className="w-full max-w-md mx-auto" role="img" aria-label="Phase transition diagram showing melting, boiling, condensation, freezing, sublimation, and deposition">
        <text x="200" y="30" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Phase Transitions</text>

        {/* State nodes */}
        {states.map((s, i) => {
          const pos = posAt(s.angle, r);
          return (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r="38" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
              <text x={pos.x} y={pos.y + 5} textAnchor="middle" className={s.color} fontSize="14" fontWeight="bold">{s.label}</text>
            </g>
          );
        })}

        {/* Outer transitions (forward: melting, boiling, deposition) */}
        {/* Melting: Solid → Liquid */}
        <path d={`M ${posAt(-60, r + 42).x},${posAt(-60, r + 42).y} A ${r + 42},${r + 42} 0 0,1 ${posAt(0, r + 42).x},${posAt(0, r + 42).y}`}
          fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" markerEnd="url(#phaseArrowA)" />
        <text x={posAt(-30, r + 60).x} y={posAt(-30, r + 60).y} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="11" fontWeight="600">Melting</text>
        <text x={posAt(-30, r + 72).x} y={posAt(-30, r + 72).y} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(+heat)</text>

        {/* Boiling: Liquid → Gas */}
        <path d={`M ${posAt(60, r + 42).x},${posAt(60, r + 42).y} A ${r + 42},${r + 42} 0 0,1 ${posAt(120, r + 42).x},${posAt(120, r + 42).y}`}
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" markerEnd="url(#phaseArrowR)" />
        <text x={posAt(90, r + 60).x} y={posAt(90, r + 60).y} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="600">Boiling</text>
        <text x={posAt(90, r + 72).x} y={posAt(90, r + 72).y} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(+heat)</text>

        {/* Freezing: Liquid → Solid (inner arc) */}
        <path d={`M ${posAt(0, r - 42).x},${posAt(0, r - 42).y} A ${r - 42},${r - 42} 0 0,0 ${posAt(-60, r - 42).x},${posAt(-60, r - 42).y}`}
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#phaseArrowBl)" />
        <text x={posAt(-30, r - 56).x} y={posAt(-30, r - 56).y} textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="10">Freezing</text>

        {/* Condensation: Gas → Liquid (inner arc) */}
        <path d={`M ${posAt(120, r - 42).x},${posAt(120, r - 42).y} A ${r - 42},${r - 42} 0 0,0 ${posAt(60, r - 42).x},${posAt(60, r - 42).y}`}
          fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#phaseArrowG)" />
        <text x={posAt(90, r - 56).x} y={posAt(90, r - 56).y} textAnchor="middle" className="fill-emerald-500 dark:fill-emerald-400" fontSize="10">Condensation</text>

        {/* Sublimation: Solid → Gas (shortcut, straight line at bottom) */}
        <line x1={posAt(-90, r).x - 30} y1={posAt(-90, r).y - 35} x2={posAt(150, r).x + 30} y2={posAt(150, r).y - 5}
          className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#phaseArrowP)" />
        <text x="200" y="60" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="11" fontWeight="600">Sublimation</text>

        {/* Deposition: Gas → Solid (shortcut) */}
        <line x1={posAt(150, r).x + 20} y1={posAt(150, r).y + 10} x2={posAt(-90, r).x + 30} y2={posAt(-90, r).y - 20}
          className="stroke-pink-500 dark:stroke-pink-400" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#phaseArrowPk)" />
        <text x="200" y="78" textAnchor="middle" className="fill-pink-500 dark:fill-pink-400" fontSize="10">Deposition</text>

        <text x="200" y="385" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Adding heat moves right; removing heat moves left</text>

        <defs>
          <marker id="phaseArrowA" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-500 dark:fill-amber-400" />
          </marker>
          <marker id="phaseArrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-red-500 dark:fill-red-400" />
          </marker>
          <marker id="phaseArrowBl" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
          <marker id="phaseArrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-emerald-500 dark:fill-emerald-400" />
          </marker>
          <marker id="phaseArrowP" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-purple-500 dark:fill-purple-400" />
          </marker>
          <marker id="phaseArrowPk" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-pink-500 dark:fill-pink-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
