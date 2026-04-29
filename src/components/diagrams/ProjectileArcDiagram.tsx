export default function ProjectileArcDiagram() {
  // Compute parabolic arc points for a given launch angle (degrees)
  const computeArc = (angleDeg: number, v0: number = 1, steps: number = 40) => {
    const theta = (angleDeg * Math.PI) / 180;
    const g = 9.8;
    const tFlight = (2 * v0 * Math.sin(theta)) / g;
    const points: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tFlight;
      const x = v0 * Math.cos(theta) * t;
      const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;
      points.push(`${x},${-y}`);
    }
    return points;
  };

  const angles = [
    { deg: 15, color: '#f97316', label: '15°' },
    { deg: 30, color: '#a855f7', label: '30°' },
    { deg: 45, color: '#22c55e', label: '45°' },
    { deg: 60, color: '#3b82f6', label: '60°' },
  ];

  // Normalize: scale all arcs so 45° range fits well
  const v0 = 20;
  const g = 9.8;
  const maxRange = (v0 * v0) / g; // range at 45°

  const originX = 60;
  const groundY = 310;
  const scaleX = 370 / maxRange;
  const scaleY = 370 / maxRange;

  const getPath = (angleDeg: number) => {
    const theta = (angleDeg * Math.PI) / 180;
    const tFlight = (2 * v0 * Math.sin(theta)) / g;
    const steps = 50;
    const points: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tFlight;
      const x = originX + v0 * Math.cos(theta) * t * scaleX;
      const y = groundY - (v0 * Math.sin(theta) * t - 0.5 * g * t * t) * scaleY;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M ${points.join(' L ')}`;
  };

  // Landing x for each angle
  const getLandingX = (angleDeg: number) => {
    const theta = (angleDeg * Math.PI) / 180;
    const range = (v0 * v0 * Math.sin(2 * theta)) / g;
    return originX + range * scaleX;
  };

  // Peak height for label placement
  const getPeak = (angleDeg: number) => {
    const theta = (angleDeg * Math.PI) / 180;
    const tPeak = (v0 * Math.sin(theta)) / g;
    const xPeak = originX + v0 * Math.cos(theta) * tPeak * scaleX;
    const yPeak = groundY - (v0 * Math.sin(theta) * tPeak - 0.5 * g * tPeak * tPeak) * scaleY;
    return { x: xPeak, y: yPeak };
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Parabolic projectile trajectories at different launch angles showing 45 degrees gives maximum range"
      >
        <defs>
          {angles.map((a) => (
            <marker key={a.deg} id={`pa-arrow-${a.deg}`} viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={a.color} />
            </marker>
          ))}
        </defs>

        {/* Background */}
        <rect width="500" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="30" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Projectile Range vs. Launch Angle
        </text>

        {/* Ground line */}
        <line x1="40" y1={groundY} x2="470" y2={groundY}
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />
        {/* Ground hatching */}
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={45 + i * 20} y1={groundY} x2={55 + i * 20} y2={groundY + 10}
            className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        ))}

        {/* Launch point */}
        <circle cx={originX} cy={groundY} r="4" className="fill-slate-700 dark:fill-slate-200" />

        {/* Angle arcs at launch point */}
        {angles.map((a) => {
          const r = 30 + a.deg * 0.3;
          const endX = originX + r * Math.cos((a.deg * Math.PI) / 180);
          const endY = groundY - r * Math.sin((a.deg * Math.PI) / 180);
          return (
            <g key={`angle-${a.deg}`}>
              <path
                d={`M ${originX + r},${groundY} A ${r},${r} 0 0,0 ${endX.toFixed(1)},${endY.toFixed(1)}`}
                fill="none" stroke={a.color} strokeWidth="1.5" opacity="0.6" />
              <text
                x={originX + (r + 12) * Math.cos(((a.deg / 2) * Math.PI) / 180)}
                y={groundY - (r + 12) * Math.sin(((a.deg / 2) * Math.PI) / 180)}
                textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10"
                fontWeight="bold" fill={a.color}>
                {a.label}
              </text>
            </g>
          );
        })}

        {/* Arcs */}
        {angles.map((a) => (
          <path key={a.deg} d={getPath(a.deg)} fill="none" stroke={a.color}
            strokeWidth={a.deg === 45 ? 3 : 2} opacity={a.deg === 45 ? 1 : 0.8} />
        ))}

        {/* Landing markers */}
        {angles.map((a) => {
          const lx = getLandingX(a.deg);
          return (
            <g key={`land-${a.deg}`}>
              <line x1={lx} y1={groundY - 5} x2={lx} y2={groundY + 5}
                stroke={a.color} strokeWidth="2" />
            </g>
          );
        })}

        {/* Peak labels */}
        {angles.map((a) => {
          const peak = getPeak(a.deg);
          const offsetY = a.deg === 60 ? -12 : a.deg === 45 ? -10 : -10;
          return (
            <text key={`lbl-${a.deg}`} x={peak.x} y={peak.y + offsetY}
              textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10"
              fontWeight="bold" fill={a.color}>
              {a.label}
            </text>
          );
        })}

        {/* 45° highlight label */}
        <rect x={getLandingX(45) - 45} y={groundY + 14} width="90" height="20" rx="4"
          className="fill-green-100 dark:fill-green-900/40 stroke-green-500 dark:stroke-green-600" strokeWidth="1" />
        <text x={getLandingX(45)} y={groundY + 28} textAnchor="middle"
          fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="bold"
          className="fill-green-700 dark:fill-green-300">
          Max range!
        </text>

        {/* Formula box */}
        <rect x="270" y="355" width="210" height="50" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="375" y="375" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Range Formula
        </text>
        <text x="375" y="397" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="15" fontWeight="bold" className="fill-slate-800 dark:fill-slate-100">
          R = v² sin(2θ) / g
        </text>

        {/* Insight */}
        <rect x="20" y="355" width="230" height="50" rx="8"
          className="fill-green-50 dark:fill-green-900/30 stroke-green-300 dark:stroke-green-700" strokeWidth="1.5" />
        <text x="135" y="375" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-green-700 dark:fill-green-300">
          Why 45°?
        </text>
        <text x="135" y="395" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-600 dark:fill-green-400">
          sin(2 × 45°) = sin(90°) = 1 (maximum!)
        </text>
      </svg>
    </div>
  );
}
