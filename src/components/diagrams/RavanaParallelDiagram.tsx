export default function RavanaParallelDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Comparison of serial processing (one task at a time) versus parallel processing (many tasks simultaneously)"
      >
        <defs>
          <marker id="rp-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
        </defs>

        <rect width="500" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Serial vs Parallel Processing
        </text>

        {/* SERIAL — one head, one task at a time */}
        <text x="130" y="55" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-red-500 dark:fill-red-400">
          One Head (Serial)
        </text>

        {/* Timeline blocks — serial */}
        {['Task A', 'Task B', 'Task C', 'Task D'].map((label, i) => {
          const x = 30 + i * 80;
          const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'];
          return (
            <g key={i}>
              <rect x={x} y={70} width="70" height="30" rx="4" fill={colors[i]} opacity="0.8" />
              <text x={x + 35} y={89} textAnchor="middle" fontFamily="system-ui, sans-serif"
                fontSize="10" fill="white" fontWeight="600">{label}</text>
              {i < 3 && (
                <line x1={x + 72} y1={85} x2={x + 78} y2={85}
                  stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#rp-arrow)" />
              )}
            </g>
          );
        })}
        <text x="400" y="89" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-500 dark:fill-slate-400">⏱ 4 units</text>

        {/* Arrow showing time */}
        <line x1="30" y1="115" x2="360" y2="115" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
        <text x="195" y="128" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-400 dark:fill-slate-500">Time →</text>

        {/* PARALLEL — ten heads, multiple tasks at once */}
        <text x="130" y="155" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-green-500 dark:fill-green-400">
          Ten Heads (Parallel)
        </text>

        {/* Parallel lanes */}
        {['Task A', 'Task B', 'Task C', 'Task D'].map((label, i) => {
          const y = 170 + i * 30;
          const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'];
          return (
            <g key={i}>
              <text x="25" y={y + 14} fontFamily="system-ui, sans-serif" fontSize="9"
                className="fill-slate-400 dark:fill-slate-500">Head {i + 1}</text>
              <rect x={70} y={y} width="70" height="22" rx="4" fill={colors[i]} opacity="0.8" />
              <text x={105} y={y + 15} textAnchor="middle" fontFamily="system-ui, sans-serif"
                fontSize="9" fill="white" fontWeight="600">{label}</text>
            </g>
          );
        })}
        <text x="180" y="205" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-500 dark:fill-slate-400">⏱ 1 unit</text>

        {/* Speedup callout */}
        <rect x="260" y="168" width="200" height="55" rx="8"
          className="fill-green-50 dark:fill-green-900/30 stroke-green-400 dark:stroke-green-600" strokeWidth="1.5" />
        <text x="360" y="188" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="700" className="fill-green-600 dark:fill-green-300">
          4x Speedup!
        </text>
        <text x="360" y="204" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-600 dark:fill-slate-300">
          4 tasks, 4 workers = 1 time unit
        </text>
        <text x="360" y="217" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-500 dark:fill-slate-400">
          (ideal parallel speedup)
        </text>

        {/* Ravana metaphor section */}
        <line x1="30" y1="310" x2="470" y2="310" stroke="#94a3b8" strokeWidth="0.5" />

        {/* Ravana's 10 heads as processors */}
        <text x="250" y="330" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-amber-600 dark:fill-amber-300">
          Ravana's 10 Heads = 10 Parallel Processors
        </text>

        {/* Head circles */}
        {Array.from({ length: 10 }, (_, i) => {
          const x = 45 + i * 43;
          const labels = ['War', 'Vedas', 'Music', 'Art', 'Law', 'Science', 'Magic', 'Astro', 'Heal', 'Plan'];
          return (
            <g key={i}>
              <circle cx={x} cy={370} r="16"
                className="fill-amber-100 dark:fill-amber-900/50 stroke-amber-400 dark:stroke-amber-500" strokeWidth="1.5" />
              <text x={x} y={374} textAnchor="middle" fontFamily="system-ui, sans-serif"
                fontSize="7" fontWeight="600" className="fill-amber-700 dark:fill-amber-200">{labels[i]}</text>
            </g>
          );
        })}
        <text x="250" y="405" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          Each head mastered a different domain — parallel expertise
        </text>
      </svg>
    </div>
  );
}
