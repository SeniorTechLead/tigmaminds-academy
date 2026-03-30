export default function ChurningSeparationPipelineDiagram() {
  const stages = [
    { label: 'Crude\nMixture', x: 30, color: 'fill-gray-400 dark:fill-gray-500' },
    { label: 'Filter', x: 120, color: 'fill-amber-400 dark:fill-amber-500' },
    { label: 'Centrifuge', x: 210, color: 'fill-blue-400 dark:fill-blue-500' },
    { label: 'Distill', x: 300, color: 'fill-orange-400 dark:fill-orange-500' },
    { label: 'Chromato-\ngraph', x: 390, color: 'fill-purple-400 dark:fill-purple-500' },
    { label: 'Pure\nProducts', x: 480, color: 'fill-emerald-400 dark:fill-emerald-500' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 560 200" className="w-full h-auto" role="img" aria-label="Separation pipeline showing crude mixture going through filtering, centrifuging, distillation, and chromatography to produce pure products">
        <style>{`
          .sp-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .sp-label { font-family: system-ui, sans-serif; font-size: 9px; font-weight: 600; }
          .sp-small { font-family: system-ui, sans-serif; font-size: 8px; }
        `}</style>

        <rect width="560" height="200" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="280" y="24" textAnchor="middle" className="sp-title fill-gray-700 dark:fill-gray-200">Separation Pipeline</text>

        {/* Stages */}
        {stages.map((s, i) => (
          <g key={i}>
            <rect x={s.x} y="55" width="60" height="60" rx="8" className={`${s.color}`} opacity="0.3" />
            <rect x={s.x} y="55" width="60" height="60" rx="8" fill="none" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
            {s.label.split('\n').map((line, li) => (
              <text key={li} x={s.x + 30} y={82 + li * 12} textAnchor="middle" className="sp-label fill-gray-700 dark:fill-gray-200">{line}</text>
            ))}
            {/* Arrow between stages */}
            {i < stages.length - 1 && (
              <line x1={s.x + 62} y1="85" x2={stages[i + 1].x - 2} y2="85" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#sp-arrow)" />
            )}
          </g>
        ))}

        {/* What each stage removes */}
        <text x="150" y="140" textAnchor="middle" className="sp-small fill-gray-500 dark:fill-gray-400">Removes solids</text>
        <text x="240" y="140" textAnchor="middle" className="sp-small fill-gray-500 dark:fill-gray-400">Separates by density</text>
        <text x="330" y="140" textAnchor="middle" className="sp-small fill-gray-500 dark:fill-gray-400">Separates by BP</text>
        <text x="420" y="140" textAnchor="middle" className="sp-small fill-gray-500 dark:fill-gray-400">Separates by affinity</text>

        {/* Purity bar */}
        <text x="280" y="165" textAnchor="middle" className="sp-small fill-gray-600 dark:fill-gray-300">Purity increases with each step</text>
        <defs>
          <linearGradient id="sp-purity" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <marker id="sp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>
        <rect x="80" y="175" width="400" height="8" rx="4" fill="url(#sp-purity)" opacity="0.5" />
        <text x="80" y="193" className="sp-small fill-gray-400">Crude</text>
        <text x="480" y="193" textAnchor="end" className="sp-small fill-emerald-500">99.9% pure</text>
      </svg>
    </div>
  );
}
