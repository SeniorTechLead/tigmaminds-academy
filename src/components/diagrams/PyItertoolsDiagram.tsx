/**
 * itertools building blocks: small visual examples of chain, cycle, product, and
 * combinations — each showing inputs and the lazy stream they produce.
 *
 * Used in the "The itertools Module — Power Tools for Iteration" section.
 */
export default function PyItertoolsDiagram() {
  const W = 720, H = 320;
  const rows = [
    { y: 80, name: 'chain', desc: 'join iterables', io: '[A,B] + [C] → A B C' },
    { y: 145, name: 'cycle', desc: 'repeat forever', io: '[A,B] → A B A B …' },
    { y: 210, name: 'product', desc: 'all pairs', io: '[A,B]×[1,2] → A1 A2 B1 B2' },
    { y: 275, name: 'combinations', desc: 'choose 2', io: '[A,B,C] → AB AC BC' },
  ];
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="itertools building blocks: chain joins iterables, cycle repeats forever, product gives all pairs, and combinations chooses items — each producing a lazy stream.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="40" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Lazy iteration building blocks</text>

        {rows.map((r, i) => (
          <g key={i}>
            <rect x="40" y={r.y - 24} width="170" height="48" rx="9" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" className="dark:fill-purple-900/40 dark:stroke-purple-400" />
            <text x="56" y={r.y - 4} fontSize="13" fontWeight="700" fontFamily="monospace" fill="#6d28d9" className="dark:fill-purple-300">{r.name}</text>
            <text x="56" y={r.y + 14} fontSize="10" fill="#475569" className="dark:fill-gray-300">{r.desc}</text>
            <line x1="210" y1={r.y} x2="270" y2={r.y} stroke="#64748b" strokeWidth="2" markerEnd="url(#pit-a)" />
            <rect x="275" y={r.y - 20} width="405" height="40" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
            <text x="292" y={r.y + 5} fontSize="12" fontFamily="monospace" fill="#0f172a" className="dark:fill-gray-100">{r.io}</text>
          </g>
        ))}
        <defs><marker id="pit-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
