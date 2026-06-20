/**
 * Working with files: the with open(...) block opens a file, reads/writes inside
 * the block, and auto-closes on exit. Shows the lifecycle.
 *
 * Used in the "Working with Files" section.
 */
export default function PyFileIODiagram() {
  const W = 700, H = 300;
  const steps = [
    { y: 90, t: 'open', s: 'with open("data.txt") as f:', color: '#3b82f6', lf: '#dbeafe', dc: 'dark:fill-blue-900/40 dark:stroke-blue-400', tc: '#1d4ed8' },
    { y: 160, t: 'use', s: 'read / write inside the block', color: '#8b5cf6', lf: '#ede9fe', dc: 'dark:fill-purple-900/40 dark:stroke-purple-400', tc: '#6d28d9' },
    { y: 230, t: 'close', s: 'auto-closed when block ends', color: '#16a34a', lf: '#dcfce7', dc: 'dark:fill-green-900/40 dark:stroke-green-400', tc: '#15803d' },
  ];
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="The with open block opens a file, lets you read or write inside it, then closes it automatically when the block ends.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="40" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">"with open(...)" handles closing for you</text>

        {/* bracket showing the block */}
        <path d="M70,80 q-14,0 -14,14 v140 q0,14 14,14" fill="none" stroke="#cbd5e1" strokeWidth="2" className="dark:stroke-gray-600" />

        {steps.map((s, i) => (
          <g key={i}>
            <rect x="90" y={s.y - 26} width="560" height="52" rx="10" fill={s.lf} stroke={s.color} strokeWidth="1.5" className={s.dc} />
            <text x="112" y={s.y - 4} fontSize="13" fontWeight="700" fill={s.tc} className="dark:fill-gray-100">{s.t}</text>
            <text x="112" y={s.y + 15} fontSize="11" fontFamily="monospace" fill="#475569" className="dark:fill-gray-300">{s.s}</text>
            {i < steps.length - 1 && <line x1="370" y1={s.y + 26} x2="370" y2={steps[i + 1].y - 26} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#pf-a)" />}
          </g>
        ))}
        <defs><marker id="pf-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#94a3b8" /></marker></defs>
      </svg>
    </div>
  );
}
