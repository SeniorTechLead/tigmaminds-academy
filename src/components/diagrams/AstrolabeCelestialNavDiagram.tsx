/**
 * AstrolabeCelestialNavDiagram — Finding your way by stars.
 * Shows altitude/azimuth coordinate system, Polaris at the north,
 * and how measuring star altitude gives your latitude.
 */
export default function AstrolabeCelestialNavDiagram() {
  const cx = 220;
  const horizonY = 170;
  const groundW = 380;

  // Polaris position
  const polarisAngle = 35; // degrees altitude = latitude
  const polarisRad = (polarisAngle * Math.PI) / 180;
  const polarisX = cx;
  const polarisY = horizonY - 120 * Math.sin(polarisRad);

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 440 250" className="w-full" role="img" aria-label="Celestial navigation: finding latitude from Polaris">
        <rect width="440" height="250" className="fill-white dark:fill-slate-950" rx="8" />

        <text x="220" y="20" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Finding Your Way by Stars</text>

        {/* Sky dome */}
        <path d={`M 30 ${horizonY} Q ${cx} 20 ${30 + groundW} ${horizonY}`} fill="none" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4 3" />

        {/* Horizon line */}
        <line x1="30" y1={horizonY} x2={30 + groundW} y2={horizonY} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <text x="35" y={horizonY + 14} fill="#475569" fontSize="8">Horizon (0 degrees)</text>

        {/* Ground */}
        <rect x="30" y={horizonY} width={groundW} height="20" className="fill-gray-100 dark:fill-slate-800" opacity="0.5" rx="2" />

        {/* Observer */}
        <circle cx={cx} cy={horizonY - 3} r="5" fill="#38bdf8" />
        <line x1={cx} y1={horizonY - 3} x2={cx} y2={horizonY - 18} stroke="#38bdf8" strokeWidth="2" />
        <text x={cx} y={horizonY + 14} textAnchor="middle" fill="#38bdf8" fontSize="8">You</text>

        {/* Zenith line */}
        <line x1={cx} y1={horizonY - 18} x2={cx} y2="35" stroke="#334155" strokeWidth="1" strokeDasharray="3 2" />
        <text x={cx + 3} y="40" className="fill-gray-400 dark:fill-slate-500" fontSize="7">Zenith (90 degrees)</text>

        {/* Stars */}
        {[[80, 60, 'Vega', '#a78bfa'], [350, 45, 'Altair', '#60a5fa'], [160, 75, 'Deneb', '#34d399']].map(([xOff, alt, name, color], i) => {
          const sy = horizonY - (Number(alt) / 90) * 140;
          return (
            <g key={i}>
              <circle cx={Number(xOff)} cy={sy} r="3" fill={String(color)} opacity="0.7" />
              <text x={Number(xOff)} y={sy - 7} textAnchor="middle" fill={String(color)} fontSize="7" opacity="0.7">{String(name)}</text>
            </g>
          );
        })}

        {/* Polaris - the key star */}
        <circle cx={polarisX} cy={polarisY} r="5" fill="#fbbf24" />
        <text x={polarisX + 10} y={polarisY - 3} fill="#fbbf24" fontSize="9" fontWeight="bold">Polaris</text>

        {/* Altitude angle arc from horizon to Polaris */}
        <path
          d={`M ${cx + 50} ${horizonY} A 50 50 0 0 0 ${cx + 50 * Math.cos(polarisRad)} ${horizonY - 50 * Math.sin(polarisRad)}`}
          fill="none" stroke="#fbbf24" strokeWidth="1.5"
        />
        <text x={cx + 58} y={horizonY - 18} fill="#fbbf24" fontSize="9" fontWeight="bold">{polarisAngle} degrees</text>

        {/* Line from observer to Polaris */}
        <line x1={cx} y1={horizonY - 18} x2={polarisX} y2={polarisY} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />

        {/* Azimuth arc on horizon */}
        <path d={`M ${cx} ${horizonY} L ${cx + 60} ${horizonY}`} stroke="#10b981" strokeWidth="1.5" />
        <text x={cx + 65} y={horizonY - 3} fill="#10b981" fontSize="8">North</text>

        {/* Compass points */}
        {[['N', 0], ['E', 90], ['S', 180], ['W', -90]].map(([label, deg]) => {
          const r = groundW / 2 - 10;
          const rad = ((Number(deg) - 90) * Math.PI) / 180;
          const lx = cx + r * Math.cos(rad);
          return (
            <text key={String(label)} x={lx} y={horizonY + 14} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">{String(label)}</text>
          );
        })}

        {/* Key insight box */}
        <rect x="60" y="210" width="320" height="32" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#fbbf24" strokeWidth="0.7" />
        <text x="220" y="224" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">Altitude of Polaris = Your Latitude</text>
        <text x="220" y="236" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">If Polaris is 35 degrees above the horizon, you are at 35 degrees N latitude</text>
      </svg>
    </div>
  );
}
