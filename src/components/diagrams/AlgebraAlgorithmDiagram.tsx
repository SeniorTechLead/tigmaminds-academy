/**
 * AlgebraAlgorithmDiagram — Al-Khwarizmi's step-by-step procedure as a flowchart.
 * Shows how his method for solving equations IS an algorithm.
 */
export default function AlgebraAlgorithmDiagram() {
  const steps = [
    { y: 54, label: 'START: Read the equation', shape: 'oval', color: 'fill-gray-200 dark:fill-gray-700' },
    { y: 100, label: 'Are there terms to move?', shape: 'diamond', color: 'fill-amber-100 dark:fill-amber-800' },
    { y: 150, label: 'al-Jabr: move negatives\nto the other side', shape: 'rect', color: 'fill-blue-100 dark:fill-blue-800' },
    { y: 200, label: 'al-Muqabala: combine\nlike terms', shape: 'rect', color: 'fill-blue-100 dark:fill-blue-800' },
    { y: 250, label: 'Is it linear or quadratic?', shape: 'diamond', color: 'fill-amber-100 dark:fill-amber-800' },
    { y: 300, label: 'Solve: isolate x\nor complete the square', shape: 'rect', color: 'fill-emerald-100 dark:fill-emerald-800' },
    { y: 350, label: 'DONE: x = answer', shape: 'oval', color: 'fill-green-200 dark:fill-green-700' },
  ];

  const cx = 200;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 400 390" className="w-full" role="img" aria-label="Flowchart of al-Khwarizmi's algorithm for solving equations">
        <rect width="400" height="390" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="24" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">The Original Algorithm</text>

        {/* Arrows between steps */}
        {steps.slice(0, -1).map((s, i) => (
          <line key={`a${i}`} x1={cx} y1={s.y + 14} x2={cx} y2={steps[i + 1].y - 14} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#arrowAlg)" />
        ))}

        <defs>
          <marker id="arrowAlg" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 Z" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>

        {steps.map((s, i) => {
          const w = 180, h = 28;
          if (s.shape === 'oval') {
            return (
              <g key={i}>
                <rect x={cx - w / 2} y={s.y - h / 2} width={w} height={h} rx="14" className={`${s.color} stroke-gray-500 dark:stroke-gray-400`} strokeWidth="1" />
                <text x={cx} y={s.y + 4} textAnchor="middle" className="fill-gray-800 dark:fill-gray-100" fontSize="10" fontWeight="bold">{s.label}</text>
              </g>
            );
          }
          if (s.shape === 'diamond') {
            const dh = 22;
            return (
              <g key={i}>
                <polygon points={`${cx},${s.y - dh} ${cx + w / 2.5},${s.y} ${cx},${s.y + dh} ${cx - w / 2.5},${s.y}`} className={`${s.color} stroke-gray-500 dark:stroke-gray-400`} strokeWidth="1" />
                <text x={cx} y={s.y + 4} textAnchor="middle" className="fill-gray-800 dark:fill-gray-100" fontSize="10">{s.label}</text>
              </g>
            );
          }
          // rect with multiline
          const lines = s.label.split('\n');
          return (
            <g key={i}>
              <rect x={cx - w / 2} y={s.y - h / 2} width={w} height={h} rx="4" className={`${s.color} stroke-gray-500 dark:stroke-gray-400`} strokeWidth="1" />
              {lines.map((ln, li) => (
                <text key={li} x={cx} y={s.y + (li - (lines.length - 1) / 2) * 12 + 4} textAnchor="middle" className="fill-gray-800 dark:fill-gray-100" fontSize="10">{ln}</text>
              ))}
            </g>
          );
        })}

        {/* Side labels */}
        <text x="50" y={steps[1].y + 4} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">Yes →</text>
        <text x="330" y={steps[4].y - 8} className="fill-gray-500 dark:fill-gray-400" fontSize="10">Linear or</text>
        <text x="330" y={steps[4].y + 4} className="fill-gray-500 dark:fill-gray-400" fontSize="10">Quadratic</text>

        <text x="200" y="380" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Every step is precise and repeatable — this IS an algorithm.</text>
      </svg>
    </div>
  );
}
