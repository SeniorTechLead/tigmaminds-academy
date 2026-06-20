/**
 * Model evaluation flow: held-back test data → model predictions → compare to
 * true labels → per-class report (precision/recall). Shows why accuracy alone
 * is not enough.
 *
 * Used in the "Evaluating a Model" section.
 */
export default function MLEvaluationFlowDiagram() {
  const W = 740, H = 250;
  const steps = [
    { x: 30, t: 'Test set', s: 'held back', fill: '#ffedd5', stroke: '#f97316', tc: '#c2410c', dc: 'dark:fill-orange-900/30 dark:stroke-orange-400' },
    { x: 220, t: 'Model predicts', s: 'one label each', fill: '#eff6ff', stroke: '#3b82f6', tc: '#1d4ed8', dc: 'dark:fill-blue-900/40 dark:stroke-blue-400' },
    { x: 410, t: 'Compare to truth', s: 'right vs wrong', fill: '#f1f5f9', stroke: '#94a3b8', tc: '#334155', dc: 'dark:fill-gray-700 dark:stroke-gray-500' },
    { x: 590, t: 'Per-class report', s: 'precision · recall', fill: '#dcfce7', stroke: '#16a34a', tc: '#15803d', dc: 'dark:fill-green-900/40 dark:stroke-green-400' },
  ];
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Evaluation flow: the held-back test set goes through the model, predictions are compared to true labels, producing a per-class precision and recall report.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Accuracy alone can mislead — check each class</text>

        {steps.map((s, i) => (
          <g key={i}>
            <rect x={s.x} y="90" width="130" height="70" rx="11" fill={s.fill} stroke={s.stroke} strokeWidth="1.8" className={s.dc} />
            <text x={s.x + 65} y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill={s.tc} className="dark:fill-gray-100">{s.t}</text>
            <text x={s.x + 65} y="142" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">{s.s}</text>
            {i < steps.length - 1 && (
              <line x1={s.x + 130} y1="125" x2={steps[i + 1].x} y2="125" stroke="#64748b" strokeWidth="2" markerEnd="url(#mef-a)" />
            )}
          </g>
        ))}
        <text x="370" y="195" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">A model that always guesses "calm" can score 95% yet miss every danger signal.</text>
        <defs>
          <marker id="mef-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker>
        </defs>
      </svg>
    </div>
  );
}
