/**
 * AstrolabeFunctionsDiagram — The astrolabe as "smartphone of the medieval world."
 * Shows the various functions: time-telling, direction-finding, sunrise/sunset prediction,
 * surveying heights, and casting horoscopes.
 */
export default function AstrolabeFunctionsDiagram() {
  const cx = 220;
  const cy = 110;
  const r = 65;

  // Functions arranged around the astrolabe
  const functions = [
    { angle: -90, label: 'Tell Time', sub: 'day or night', color: '#fbbf24', icon: 'M-4,-6 L4,-6 L4,6 L-4,6 Z M0,-6 L0,-9 M-2,-9 L2,-9' },
    { angle: -30, label: 'Find Direction', sub: 'qibla, north', color: '#38bdf8', icon: 'M0,-8 L3,6 L-3,6 Z' },
    { angle: 30, label: 'Predict Sunrise', sub: '& sunset times', color: '#ef4444', icon: 'M0,-5 A5,5 0 1,1 0,5 M-8,0 L8,0' },
    { angle: 90, label: 'Survey Heights', sub: 'buildings, mountains', color: '#10b981', icon: 'M-6,6 L0,-6 L6,6 Z' },
    { angle: 150, label: 'Star Positions', sub: 'any date, any hour', color: '#a78bfa', icon: 'M0,-6 L2,-2 L6,-2 L3,1 L4,6 L0,3 L-4,6 L-3,1 L-6,-2 L-2,-2 Z' },
    { angle: 210, label: 'Prayer Times', sub: 'five daily salat', color: '#f472b6', icon: 'M-4,-6 Q0,-10 4,-6 L4,4 Q0,8 -4,4 Z' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 440 240" className="w-full" role="img" aria-label="The many functions of an astrolabe">
        <rect width="440" height="240" className="fill-white dark:fill-slate-950" rx="8" />

        <text x="220" y="20" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">The Astrolabe: Smartphone of the Medieval World</text>

        {/* Central astrolabe representation */}
        <circle cx={cx} cy={cy} r={r} className="fill-gray-100 dark:fill-slate-800" stroke="#64748b" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r - 8} fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.7" />
        <circle cx={cx} cy={cy} r={r - 20} fill="none" stroke="#334155" strokeWidth="0.7" />

        {/* Rete pattern (simplified star pointer overlay) */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line key={deg} x1={cx} y1={cy} x2={cx + (r - 10) * Math.cos(rad)} y2={cy + (r - 10) * Math.sin(rad)} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
          );
        })}

        {/* Central pivot */}
        <circle cx={cx} cy={cy} r="4" fill="#fbbf24" />

        {/* Degree marks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const deg = i * 15;
          const rad = (deg * Math.PI) / 180;
          return (
            <line key={i} x1={cx + (r - 2) * Math.cos(rad)} y1={cy + (r - 2) * Math.sin(rad)} x2={cx + r * Math.cos(rad)} y2={cy + r * Math.sin(rad)} stroke="#64748b" strokeWidth="0.7" />
          );
        })}

        {/* Function labels radiating outward */}
        {functions.map((f, i) => {
          const rad = (f.angle * Math.PI) / 180;
          const labelR = r + 50;
          const lx = cx + labelR * Math.cos(rad);
          const ly = cy + labelR * Math.sin(rad);
          const lineEndX = cx + (r + 5) * Math.cos(rad);
          const lineEndY = cy + (r + 5) * Math.sin(rad);

          return (
            <g key={i}>
              {/* Connecting line */}
              <line x1={lineEndX} y1={lineEndY} x2={lx} y2={ly} stroke={f.color} strokeWidth="0.7" opacity="0.5" />

              {/* Label circle */}
              <circle cx={lx} cy={ly} r="12" className="fill-gray-100 dark:fill-slate-800" stroke={f.color} strokeWidth="1" />

              {/* Icon path */}
              <g transform={`translate(${lx},${ly}) scale(0.8)`}>
                <path d={f.icon} fill={f.color} opacity="0.8" />
              </g>

              {/* Text */}
              <text x={lx} y={ly + 20} textAnchor="middle" fill={f.color} fontSize="8" fontWeight="bold">{f.label}</text>
              <text x={lx} y={ly + 29} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">{f.sub}</text>
            </g>
          );
        })}

        {/* Bottom note */}
        <text x="220" y="228" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">One brass instrument, carried in your hand, doing what now takes six different apps</text>
      </svg>
    </div>
  );
}
