export default function DataQualityTargetDiagram() {
  const targets = [
    { cx: 150, label: 'Accurate & Precise', desc: 'Close to truth, tightly grouped', dots: [{x:-3,y:-2},{x:2,y:1},{x:-1,y:3},{x:1,y:-1}] },
    { cx: 350, label: 'Accurate but Imprecise', desc: 'Centered on truth, but scattered', dots: [{x:-12,y:-8},{x:10,y:6},{x:-6,y:10},{x:8,y:-10}] },
    { cx: 550, label: 'Precise but Inaccurate', desc: 'Tightly grouped, but off-center', dots: [{x:15,y:12},{x:17,y:14},{x:14,y:16},{x:16,y:13}] },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Data quality target diagrams showing accuracy vs precision and the difference between them">
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Data Quality: Accuracy vs Precision</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Good data needs both — and awareness of bias</text>

        {targets.map((t, i) => (
          <g key={i}>
            {/* Target rings */}
            <circle cx={t.cx} cy="160" r="50" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
            <circle cx={t.cx} cy="160" r="35" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
            <circle cx={t.cx} cy="160" r="20" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
            <circle cx={t.cx} cy="160" r="3" fill="#ef4444" opacity="0.5" />

            {/* Data points */}
            {t.dots.map((d, j) => (
              <circle key={j} cx={t.cx + d.x} cy={160 + d.y} r="4" fill="#3b82f6" opacity="0.7" />
            ))}

            {/* Label */}
            <text x={t.cx} y="230" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{t.label}</text>
            <text x={t.cx} y="246" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{t.desc}</text>
          </g>
        ))}

        {/* Status indicators */}
        <text x="150" y="265" textAnchor="middle" fontSize="12" fill="#22c55e">✓ Ideal</text>
        <text x="350" y="265" textAnchor="middle" fontSize="12" fill="#f59e0b">⚠ Needs more data</text>
        <text x="550" y="265" textAnchor="middle" fontSize="12" fill="#ef4444">✗ Systematic bias</text>

        {/* Bias explanation */}
        <rect x="80" y="290" width="540" height="60" rx="8" className="fill-amber-50 dark:fill-amber-900/15" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="312" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Bias in butterfly counting</text>
        <text x="350" y="330" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">You notice bright butterflies more than dull ones — your count is biased toward colorful species</text>
        <text x="350" y="344" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Solution: train observers, use photo verification, and report effort (time spent looking)</text>
      </svg>
    </div>
  );
}
