export default function RiceGrowthOutputDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 620 350" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Sample growth curve chart showing rice seedling height over 21 days under different conditions">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="350" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-green-700 dark:fill-green-300">
          Project Output: Rice Growth Curves
        </text>

        {/* Axes */}
        <line x1="80" y1="270" x2="560" y2="270" stroke="#94a3b8" strokeWidth="1.5" className="dark:stroke-slate-500" />
        <line x1="80" y1="270" x2="80" y2="60" stroke="#94a3b8" strokeWidth="1.5" className="dark:stroke-slate-500" />

        {/* X-axis labels */}
        <text x="310" y="295" textAnchor="middle" className="label fill-slate-600 dark:fill-slate-400">Days after planting</text>
        {[0, 3, 7, 10, 14, 17, 21].map((d, i) => (
          <g key={i}>
            <text x={80 + (d / 21) * 480} y={285} textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">{d}</text>
            <line x1={80 + (d / 21) * 480} y1={270} x2={80 + (d / 21) * 480} y2={275} stroke="#94a3b8" strokeWidth="1" />
          </g>
        ))}

        {/* Y-axis labels */}
        <text x="35" y="170" textAnchor="middle" className="label fill-slate-600 dark:fill-slate-400" transform="rotate(-90, 35, 170)">Height (mm)</text>
        {[0, 20, 40, 60, 80, 100].map((h, i) => (
          <g key={i}>
            <text x={72} y={270 - (h / 100) * 200 + 4} textAnchor="end" className="small fill-slate-500 dark:fill-slate-400">{h}</text>
            <line x1={75} y1={270 - (h / 100) * 200} x2={80} y2={270 - (h / 100) * 200} stroke="#94a3b8" strokeWidth="1" />
            {h > 0 && <line x1={80} y1={270 - (h / 100) * 200} x2={560} y2={270 - (h / 100) * 200} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />}
          </g>
        ))}

        {/* Curve 1: Normal water (control) */}
        <polyline points="80,270 148,265 240,248 285,225 353,190 398,165 468,135 560,100"
          fill="none" stroke="#3b82f6" strokeWidth="2.5" className="dark:stroke-blue-400" />
        {/* Data points */}
        {[[80,270],[148,265],[240,248],[285,225],[353,190],[398,165],[468,135],[560,100]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" className="dark:fill-blue-400" />
        ))}

        {/* Curve 2: With fertilizer */}
        <polyline points="80,270 148,262 240,235 285,200 353,155 398,125 468,90 560,65"
          fill="none" stroke="#16a34a" strokeWidth="2.5" className="dark:stroke-green-400" />
        {[[80,270],[148,262],[240,235],[285,200],[353,155],[398,125],[468,90],[560,65]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#16a34a" className="dark:fill-green-400" />
        ))}

        {/* Curve 3: Low light */}
        <polyline points="80,270 148,268 240,260 285,252 353,240 398,232 468,222 560,215"
          fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,3" className="dark:stroke-amber-400" />
        {[[80,270],[148,268],[240,260],[285,252],[353,240],[398,232],[468,222],[560,215]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#f59e0b" className="dark:fill-amber-400" />
        ))}

        {/* Legend */}
        <rect x="100" y="305" width="420" height="35" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <line x1="115" y1="320" x2="140" y2="320" stroke="#3b82f6" strokeWidth="2.5" />
        <text x="148" y="324" className="small fill-blue-600 dark:fill-blue-400">Normal water</text>
        <line x1="255" y1="320" x2="280" y2="320" stroke="#16a34a" strokeWidth="2.5" />
        <text x="288" y="324" className="small fill-green-600 dark:fill-green-400">With fertilizer</text>
        <line x1="395" y1="320" x2="420" y2="320" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,3" />
        <text x="428" y="324" className="small fill-amber-600 dark:fill-amber-400">Low light</text>
      </svg>
    </div>
  );
}
