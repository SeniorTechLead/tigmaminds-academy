/**
 * AstrolabeProjectionDiagram — Stereographic projection: flattening a sphere onto a disk.
 * Shows the celestial sphere on the left, projection rays from south pole through points
 * on the sphere onto a flat plate, and the resulting flat disk on the right.
 */
export default function AstrolabeProjectionDiagram() {
  const sphereCx = 120;
  const sphereCy = 120;
  const sphereR = 70;
  const diskCx = 320;
  const diskCy = 120;
  const diskR = 70;

  // Points on sphere (angles from north pole)
  const starAngles = [20, 40, 60, 75];
  const starLabels = ['Polaris', 'Vega', 'Altair', 'Horizon'];
  const starColors = ['#fbbf24', '#38bdf8', '#a78bfa', '#ef4444'];

  // South pole is bottom of sphere
  const spY = sphereCy + sphereR;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 440 250" className="w-full" role="img" aria-label="Stereographic projection: flattening the sky onto a disk">
        <rect width="440" height="250" className="fill-white dark:fill-slate-950" rx="8" />

        <text x="220" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Stereographic Projection</text>

        {/* Left: Celestial Sphere */}
        <text x={sphereCx} y="42" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Celestial Sphere</text>
        <circle cx={sphereCx} cy={sphereCy} r={sphereR} fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

        {/* Equator line */}
        <ellipse cx={sphereCx} cy={sphereCy} rx={sphereR} ry="15" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 2" />

        {/* North pole */}
        <circle cx={sphereCx} cy={sphereCy - sphereR} r="3" fill="#10b981" />
        <text x={sphereCx + 8} y={sphereCy - sphereR - 5} fill="#10b981" fontSize="8">N</text>

        {/* South pole (projection point) */}
        <circle cx={sphereCx} cy={spY} r="4" fill="#ef4444" />
        <text x={sphereCx + 10} y={spY + 4} fill="#ef4444" fontSize="8">S (eye)</text>

        {/* Stars on sphere + projection lines */}
        {starAngles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const sx = sphereCx + sphereR * Math.sin(rad) * 0.3;
          const sy = sphereCy - sphereR * Math.cos(rad);
          // Projected distance on disk (simplified stereographic)
          const projR = diskR * Math.tan(rad / 2) / Math.tan(75 / 2 * Math.PI / 180);
          const dx = diskCx;
          const dy = diskCy - Math.min(projR, diskR - 5);

          return (
            <g key={i}>
              {/* Star on sphere */}
              <circle cx={sx} cy={sy} r="4" fill={starColors[i]} />
              <text x={sx - 20} y={sy + 3} textAnchor="end" fill={starColors[i]} fontSize="7">{starLabels[i]}</text>

              {/* Projection ray from south pole through star to disk */}
              <line x1={sphereCx} y1={spY} x2={dx} y2={dy} stroke={starColors[i]} strokeWidth="0.7" strokeDasharray="3 2" opacity="0.5" />

              {/* Projected point on disk */}
              <circle cx={dx} cy={dy} r="4" fill={starColors[i]} />
              <text x={dx + 12} y={dy + 3} fill={starColors[i]} fontSize="7">{starLabels[i]}</text>
            </g>
          );
        })}

        {/* Arrow between sphere and disk */}
        <text x="220" y="118" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="20">&#x2192;</text>
        <text x="220" y="132" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">project</text>

        {/* Right: Flat Disk (the rete/tympan) */}
        <text x={diskCx} y="42" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Astrolabe Plate (flat)</text>
        <circle cx={diskCx} cy={diskCy} r={diskR} fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

        {/* Concentric altitude circles on disk */}
        {[0.3, 0.55, 0.8].map((f, i) => (
          <circle key={i} cx={diskCx} cy={diskCy} r={diskR * f} fill="none" stroke="#334155" strokeWidth="0.7" strokeDasharray="2 2" />
        ))}

        {/* Center = zenith */}
        <circle cx={diskCx} cy={diskCy} r="2" fill="#10b981" />
        <text x={diskCx} y={diskCy + 12} textAnchor="middle" fill="#10b981" fontSize="7">zenith</text>

        {/* Key insight */}
        <text x="220" y="222" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">Circles on the sphere stay as circles on the disk</text>
        <text x="220" y="238" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">This is why stereographic projection is perfect for astrolabes</text>
      </svg>
    </div>
  );
}
