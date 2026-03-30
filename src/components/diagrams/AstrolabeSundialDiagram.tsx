/**
 * AstrolabeSundialDiagram — How people told time before clocks.
 * Shows a sundial with shadow, sun positions at different hours,
 * and the concept of time from celestial position.
 */
export default function AstrolabeSundialDiagram() {
  const cx = 200;
  const cy = 130;
  const dialR = 80;

  // Hour marks around the dial
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const hourAngles = hours.map((h) => (h - 12) * 15); // 15 deg per hour

  // Current "time" shadow at ~10am = -30 degrees from noon
  const shadowAngle = -30;
  const shadowRad = (shadowAngle * Math.PI) / 180;

  // Sun arc positions
  const sunArc = [-70, -40, -10, 20, 50, 70];
  const sunLabels = ['7am', '9am', '11am', '1pm', '3pm', '5pm'];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="How sundials tell time from the sun's position">
        <rect width="400" height="260" className="fill-white dark:fill-slate-950" rx="8" />

        {/* Title */}
        <text x="200" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Before Clocks: Time from the Sun</text>

        {/* Sun arc at top */}
        <path d={`M 40 70 Q 200 -20 360 70`} fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
        {sunArc.map((deg, i) => {
          const t = (i + 0.5) / sunArc.length;
          const sx = 40 + t * 320;
          const sy = 70 - Math.sin(t * Math.PI) * 50;
          return (
            <g key={i}>
              <circle cx={sx} cy={sy} r="6" fill="#fbbf24" opacity={i === 1 ? 1 : 0.4} />
              <text x={sx} y={sy - 10} textAnchor="middle" fill="#fbbf24" fontSize="8" opacity={i === 1 ? 1 : 0.5}>{sunLabels[i]}</text>
            </g>
          );
        })}

        {/* Sundial base */}
        <ellipse cx={cx} cy={cy + dialR + 10} rx={dialR + 20} ry="12" fill="#334155" opacity="0.6" />
        <circle cx={cx} cy={cy} r={dialR} className="fill-gray-100 dark:fill-slate-800" stroke="#64748b" strokeWidth="1.5" />

        {/* Hour marks */}
        {hours.map((h) => {
          const deg = (h - 12) * 15;
          const rad = (deg * Math.PI) / 180;
          const inner = dialR - 12;
          const outer = dialR - 3;
          const x1 = cx + inner * Math.sin(rad);
          const y1 = cy - inner * Math.cos(rad);
          const x2 = cx + outer * Math.sin(rad);
          const y2 = cy - outer * Math.cos(rad);
          const lx = cx + (dialR - 22) * Math.sin(rad);
          const ly = cy - (dialR - 22) * Math.cos(rad);
          return (
            <g key={h}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="1" />
              <text x={lx} y={ly + 3} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">{h > 12 ? h - 12 + 'pm' : h + (h === 12 ? 'pm' : 'am')}</text>
            </g>
          );
        })}

        {/* Gnomon (the upright stick) */}
        <line x1={cx} y1={cy} x2={cx} y2={cy - 18} stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />

        {/* Shadow */}
        <line x1={cx} y1={cy} x2={cx + (dialR - 15) * Math.sin(shadowRad)} y2={cy - (dialR - 15) * Math.cos(shadowRad)} stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <text x={cx + (dialR + 5) * Math.sin(shadowRad)} y={cy - (dialR + 5) * Math.cos(shadowRad)} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">10am</text>

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" className="fill-gray-700 dark:fill-slate-200" />

        {/* Explanation labels */}
        <text x="200" y="232" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Shadow moves as the Sun crosses the sky</text>
        <text x="200" y="248" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">15 degrees per hour (360 / 24 = 15)</text>

        {/* Arrow showing sun-to-shadow connection */}
        <line x1="120" y1="42" x2={cx + 20 * Math.sin(shadowRad)} y2={cy - 50} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
      </svg>
    </div>
  );
}
