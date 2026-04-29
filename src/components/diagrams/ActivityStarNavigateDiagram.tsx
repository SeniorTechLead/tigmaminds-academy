/**
 * ActivityStarNavigateDiagram — Offline activity: find Polaris and estimate latitude.
 * Shows the Big Dipper pointer stars leading to Polaris, and how to measure
 * altitude using a fist-at-arm's-length method.
 */
export default function ActivityStarNavigateDiagram() {
  // Big Dipper stars (relative positions)
  const dipper = [
    { x: 100, y: 140, name: '' },
    { x: 115, y: 125, name: '' },
    { x: 140, y: 118, name: '' },
    { x: 165, y: 120, name: '' },
    { x: 175, y: 100, name: 'Dubhe' },
    { x: 155, y: 95, name: '' },
    { x: 148, y: 108, name: 'Merak' },
  ];

  // Polaris
  const polarisX = 220;
  const polarisY = 50;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 440 240" className="w-full" role="img" aria-label="How to find Polaris and estimate your latitude">
        <rect width="440" height="240" className="fill-white dark:fill-slate-950" rx="8" />

        <text x="220" y="20" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="12" fontWeight="bold">Activity: Find Polaris &amp; Estimate Your Latitude</text>

        {/* Stars of Big Dipper */}
        {dipper.map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r="3" className="fill-gray-700 dark:fill-slate-200" />
            {s.name && <text x={s.x - 8} y={s.y + 12} className="fill-gray-500 dark:fill-slate-400" fontSize="7">{s.name}</text>}
          </g>
        ))}

        {/* Dipper lines */}
        {[[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]].map(([a, b], i) => (
          <line key={i} x1={dipper[a].x} y1={dipper[a].y} x2={dipper[b].x} y2={dipper[b].y} stroke="#64748b" strokeWidth="1" />
        ))}

        {/* Pointer line from Merak-Dubhe to Polaris */}
        <line x1={dipper[6].x} y1={dipper[6].y} x2={dipper[4].x} y2={dipper[4].y} stroke="#fbbf24" strokeWidth="1.5" />
        <line x1={dipper[4].x} y1={dipper[4].y} x2={polarisX} y2={polarisY} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" />

        {/* Polaris */}
        <circle cx={polarisX} cy={polarisY} r="5" fill="#fbbf24" />
        <text x={polarisX + 10} y={polarisY + 4} fill="#fbbf24" fontSize="9" fontWeight="bold">Polaris</text>
        <text x={polarisX + 10} y={polarisY + 14} className="fill-gray-500 dark:fill-slate-400" fontSize="7">(North Star)</text>

        <text x="120" y="160" className="fill-gray-400 dark:fill-slate-500" fontSize="8">Big Dipper</text>
        <text x="175" y="80" fill="#fbbf24" fontSize="7">5x this distance</text>

        {/* Right panel: fist measurement */}
        <rect x="270" y="35" width="155" height="190" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="0.7" />
        <text x="348" y="52" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="9" fontWeight="bold">Measure with Your Fist</text>

        {/* Horizon + altitude illustration */}
        <line x1="285" y1="180" x2="410" y2="180" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="290" y="192" fill="#475569" fontSize="7">Horizon</text>

        {/* Observer */}
        <circle cx="300" cy="175" r="4" fill="#38bdf8" />

        {/* Fist stacks */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="318" y={160 - i * 25} width="20" height="20" rx="3" fill="none" stroke="#f97316" strokeWidth="1.2" />
            <text x="328" y={174 - i * 25} textAnchor="middle" fill="#f97316" fontSize="8">10 degrees</text>
          </g>
        ))}

        {/* Polaris dot at ~35 deg */}
        <circle cx="370" cy="100" r="4" fill="#fbbf24" />
        <text x="380" y="103" fill="#fbbf24" fontSize="7">Polaris</text>

        {/* Steps */}
        <text x="348" y="210" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">1 fist at arm's length ~ 10 degrees</text>
        <text x="348" y="220" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">Count fists from horizon to Polaris</text>
      </svg>
    </div>
  );
}
