/**
 * ActivityStarFinderDiagram — Offline activity: build a simple
 * star finder (planisphere) from cardboard to identify constellations.
 */
export default function ActivityStarFinderDiagram() {
  const cx = 200;
  const cy = 130;
  const outerR = 100;
  const innerR = 70;

  // Constellation dots: Big Dipper pattern
  const dipper = [
    [170, 95], [180, 105], [192, 108], [205, 104],
    [210, 115], [222, 125], [230, 118],
  ];

  // Month markers around the edge
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="Build a star finder planisphere to identify constellations">
        <rect width="400" height="260" className="fill-white dark:fill-slate-950" rx="8" />

        <text x="200" y="18" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="12" fontWeight="bold">Build Your Own Star Finder</text>

        {/* Outer disc (date wheel) */}
        <circle cx={cx} cy={cy} r={outerR} className="fill-gray-100 dark:fill-slate-800" stroke="#64748b" strokeWidth="1.5" />

        {/* Month markers */}
        {months.map((m, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const tx = cx + (outerR - 12) * Math.cos(angle);
          const ty = cy + (outerR - 12) * Math.sin(angle);
          const tickOuter = outerR - 2;
          const tickInner = outerR - 7;
          return (
            <g key={i}>
              <line x1={cx + tickInner * Math.cos(angle)} y1={cy + tickInner * Math.sin(angle)} x2={cx + tickOuter * Math.cos(angle)} y2={cy + tickOuter * Math.sin(angle)} stroke="#94a3b8" strokeWidth="1" />
              <text x={tx} y={ty + 3} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">{m}</text>
            </g>
          );
        })}

        {/* Inner viewing window (cutout overlay) */}
        <circle cx={cx} cy={cy} r={innerR} fill="#0f172a" opacity="0.85" />
        <text x={cx} y={cy - innerR + 14} textAnchor="middle" fill="#94a3b8" fontSize="10">Visible sky tonight</text>

        {/* Stars visible in the window */}
        {dipper.map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r="2" fill="#fbbf24" />
        ))}
        {/* Connect Big Dipper lines */}
        <polyline points={dipper.slice(0, 4).map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.5" />
        <polyline points={dipper.slice(3).map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.5" />
        <text x="220" y="140" fill="#fbbf24" fontSize="10" opacity="0.7">Big Dipper</text>

        {/* Scattered additional stars */}
        {[[175, 125], [215, 90], [190, 140], [230, 100], [160, 110]].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r="1" fill="#e2e8f0" opacity="0.4" />
        ))}

        {/* Polaris */}
        <circle cx="198" cy="80" r="2.5" fill="#67e8f9" />
        <text x="198" y="76" textAnchor="middle" fill="#67e8f9" fontSize="10">Polaris</text>

        {/* Arrow showing rotation */}
        <path d={`M ${cx + outerR + 8} ${cy - 15} A ${outerR + 8} ${outerR + 8} 0 0 1 ${cx + outerR + 8} ${cy + 15}`} fill="none" stroke="#f472b6" strokeWidth="1.5" markerEnd="url(#arrowPink)" />
        <defs>
          <marker id="arrowPink" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#f472b6" />
          </marker>
        </defs>
        <text x={cx + outerR + 16} y={cy + 4} fill="#f472b6" fontSize="10">Rotate</text>
        <text x={cx + outerR + 16} y={cy + 14} fill="#f472b6" fontSize="10">to date</text>

        {/* Instructions */}
        <text x="200" y="244" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="10">Align tonight’s date with current time — the window shows your sky</text>
      </svg>
    </div>
  );
}
