export default function FireflySyncStepsDiagram() {
  const w = 520, h = 370;

  // Phase values for each step (0-1 range, representing timing)
  const steps = [
    { label: 'Step 1: Random', phases: [0.1, 0.7, 0.3, 0.9, 0.5, 0.2, 0.8, 0.6] },
    { label: 'Step 2: Adjusting', phases: [0.3, 0.5, 0.35, 0.6, 0.45, 0.35, 0.55, 0.5] },
    { label: 'Step 3: Synchronized', phases: [0.48, 0.5, 0.49, 0.51, 0.5, 0.49, 0.5, 0.5] },
  ];

  const barStartX = 140;
  const barWidth = 320;
  const barH = 6;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Three steps of firefly synchronization: random, adjusting, and synchronized phases">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Firefly Synchronization</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Kuramoto model: nudge toward your neighbor</text>

        {steps.map((step, si) => {
          const groupY = 65 + si * 100;
          return (
            <g key={si}>
              {/* Step label */}
              <text x="20" y={groupY + 5} fill="#f59e0b" fontSize="11" fontWeight="600">{step.label}</text>

              {/* Timeline track */}
              <rect x={barStartX} y={groupY + 14} width={barWidth} height="50" rx="6" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="0.5" />

              {/* Time axis */}
              <line x1={barStartX + 10} y1={groupY + 58} x2={barStartX + barWidth - 10} y2={groupY + 58} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
              <text x={barStartX + 10} y={groupY + 68} className="fill-gray-400 dark:fill-slate-500" fontSize="7">0</text>
              <text x={barStartX + barWidth - 10} y={groupY + 68} className="fill-gray-400 dark:fill-slate-500" fontSize="7" textAnchor="end">1 cycle</text>

              {/* Phase markers for each firefly */}
              {step.phases.map((phase, fi) => {
                const x = barStartX + 15 + phase * (barWidth - 30);
                const y = groupY + 20 + fi * barH;
                const isSynced = si === 2;
                return (
                  <g key={fi}>
                    {/* Bar showing when this firefly flashes */}
                    <rect x={x - 8} y={y} width="16" height={barH - 1} rx="2" fill="#4ade80" opacity={isSynced ? 0.9 : 0.6} />
                    {/* Glow for synced state */}
                    {isSynced && <rect x={x - 12} y={y - 2} width="24" height={barH + 3} rx="3" fill="#4ade80" opacity="0.1" />}
                  </g>
                );
              })}

              {/* Arrow between steps */}
              {si < 2 && (
                <g>
                  <line x1={w / 2} y1={groupY + 75} x2={w / 2} y2={groupY + 90} stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#syncArrow)" />
                  <text x={w / 2 + 15} y={groupY + 86} className="fill-gray-500 dark:fill-slate-400" fontSize="8">
                    {si === 0 ? 'each adjusts toward neighbors' : 'phases converge'}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Bottom explanation */}
        <rect x="40" y="310" width="440" height="44" rx="8" className="fill-white dark:fill-slate-950" stroke="#f59e0b" strokeWidth="1" />
        <text x={w / 2} y="328" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Rule: If my neighbor flashes before me, speed up. If after, slow down.</text>
        <text x={w / 2} y="344" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">After enough rounds, everyone ends up flashing together — emergent synchronization!</text>

        <defs>
          <marker id="syncArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
