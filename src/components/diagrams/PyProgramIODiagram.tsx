/**
 * A program as input → process → output, like a recipe: ingredients in, steps
 * applied, finished dish out.
 *
 * Used in the "What Is a Program?" section of the python guide.
 */
export default function PyProgramIODiagram() {
  const W = 720, H = 230;
  const stages = [
    { x: 40, t: 'Input', s: 'data in', ex: 'ingredients', fill: '#dbeafe', stroke: '#3b82f6', tc: '#1d4ed8', dc: 'dark:fill-blue-900/40 dark:stroke-blue-400' },
    { x: 290, t: 'Process', s: 'do something', ex: 'chop · mix · cook', fill: '#ede9fe', stroke: '#8b5cf6', tc: '#6d28d9', dc: 'dark:fill-purple-900/40 dark:stroke-purple-400' },
    { x: 540, t: 'Output', s: 'result out', ex: 'finished dish', fill: '#dcfce7', stroke: '#16a34a', tc: '#15803d', dc: 'dark:fill-green-900/40 dark:stroke-green-400' },
  ];
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A program takes input (data in), processes it (does something), and returns output (result out) — like a recipe turning ingredients into a finished dish.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="40" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Every program: take in, do something, give back</text>
        {stages.map((s, i) => (
          <g key={i}>
            <rect x={s.x} y="80" width="140" height="90" rx="12" fill={s.fill} stroke={s.stroke} strokeWidth="2" className={s.dc} />
            <text x={s.x + 70} y="112" textAnchor="middle" fontSize="14" fontWeight="700" fill={s.tc} className="dark:fill-gray-100">{s.t}</text>
            <text x={s.x + 70} y="132" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">{s.s}</text>
            <text x={s.x + 70} y="152" textAnchor="middle" fontSize="10" fontStyle="italic" fill={s.tc} className="dark:fill-gray-400">{s.ex}</text>
            {i < stages.length - 1 && (
              <line x1={s.x + 140} y1="125" x2={stages[i + 1].x} y2="125" stroke="#64748b" strokeWidth="2.5" markerEnd="url(#pyio-a)" />
            )}
          </g>
        ))}
        <defs><marker id="pyio-a" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
