export default function BanyanAllometryDiagram() {
  // Log-log plot points for diameter vs height, diameter vs crown, diameter vs biomass
  const heightPoints = [
    [60, 280], [90, 240], [120, 210], [150, 185], [180, 170], [210, 158], [240, 150], [270, 145], [300, 142],
  ];
  const crownPoints = [
    [60, 270], [90, 250], [120, 225], [150, 200], [180, 178], [210, 155], [240, 135], [270, 118], [300, 105],
  ];
  const biomassPoints = [
    [60, 285], [90, 260], [120, 230], [150, 195], [180, 160], [210, 128], [240, 100], [270, 78], [300, 60],
  ];

  function polyline(pts: number[][]): string {
    return pts.map(([x, y]) => `${x},${y}`).join(" ");
  }

  return (
    <div className="my-4">
      <svg viewBox="0 0 547 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="Allometric relationships showing log-log plots of tree diameter versus height, crown width, and biomass">
        <rect width="500" height="400" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Allometric Relationships</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">How tree measurements scale with diameter (log-log)</text>

        {/* Axes */}
        <line x1="50" y1="300" x2="330" y2="300" className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#alloArrow)" />
        <line x1="50" y1="300" x2="50" y2="50" className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#alloArrow)" />

        {/* X axis label */}
        <text x="190" y="325" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">log(Diameter) →</text>
        {/* X ticks */}
        {[80, 130, 180, 230, 280].map((x, i) => (
          <g key={`xtick-${i}`}>
            <line x1={x} y1={298} x2={x} y2={304} className="stroke-slate-600" strokeWidth="1" />
            <text x={x} y={315} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">{[10, 30, 50, 100, 200][i]} cm</text>
          </g>
        ))}

        {/* Y axis label */}
        <text x="22" y="175" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" transform="rotate(-90, 22, 175)">log(Measurement) →</text>

        {/* Grid lines */}
        {[100, 150, 200, 250].map((y, i) => (
          <line key={`grid-${i}`} x1={52} y1={y} x2={330} y2={y} className="stroke-slate-800" strokeWidth="0.5" />
        ))}

        {/* Curve 1: Diameter vs Height (green) */}
        <polyline points={polyline(heightPoints)} className="stroke-green-400" strokeWidth="2" fill="none" />
        {heightPoints.map(([x, y], i) => (
          <circle key={`h-${i}`} cx={x} cy={y} r="2.5" className="fill-green-400" />
        ))}

        {/* Curve 2: Diameter vs Crown Width (amber) */}
        <polyline points={polyline(crownPoints)} className="stroke-amber-400" strokeWidth="2" fill="none" />
        {crownPoints.map(([x, y], i) => (
          <circle key={`c-${i}`} cx={x} cy={y} r="2.5" className="fill-amber-400" />
        ))}

        {/* Curve 3: Diameter vs Biomass (blue — steepest) */}
        <polyline points={polyline(biomassPoints)} className="stroke-blue-400" strokeWidth="2" fill="none" />
        {biomassPoints.map(([x, y], i) => (
          <circle key={`b-${i}`} cx={x} cy={y} r="2.5" className="fill-blue-400" />
        ))}

        {/* Legend */}
        <rect x="350" y="60" width="135" height="90" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="360" y="78" className="fill-gray-600 dark:fill-slate-300" fontSize="9" fontWeight="bold">Power Laws:</text>

        <line x1="360" y1="95" x2="385" y2="95" className="stroke-green-400" strokeWidth="2" />
        <text x="392" y="99" className="fill-green-400" fontSize="8">Height ~ D⁰·⁵</text>

        <line x1="360" y1="115" x2="385" y2="115" className="stroke-amber-400" strokeWidth="2" />
        <text x="392" y="119" className="fill-amber-400" fontSize="8">Crown ~ D⁰·⁸</text>

        <line x1="360" y1="135" x2="385" y2="135" className="stroke-blue-400" strokeWidth="2" />
        <text x="392" y="139" className="fill-blue-400" fontSize="8">Biomass ~ D²·⁵</text>

        {/* Annotation */}
        <rect x="350" y="170" width="135" height="55" rx="6" className="fill-amber-900" opacity="0.5" />
        <text x="417" y="188" textAnchor="middle" className="fill-amber-300" fontSize="8" fontWeight="bold">Key insight:</text>
        <text x="417" y="200" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="7">Doubling diameter</text>
        <text x="417" y="212" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="7">= ~5.6× more biomass</text>
        <text x="417" y="224" textAnchor="middle" className="fill-amber-400" fontSize="7">(2^2.5 = 5.66)</text>

        {/* Bottom note */}
        <text x="250" y="355" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">These power laws let scientists estimate biomass from a single measurement</text>
        <text x="250" y="370" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Measure diameter at breast height (DBH) → calculate everything else</text>

        <defs>
          <marker id="alloArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-400 dark:fill-slate-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
