/**
 * Humans infer; computers need every micro-step. Left: a human instruction
 * ("buy milk"). Right: the literal step list a computer requires.
 *
 * Used in the "How Computers Follow Instructions" section.
 */
export default function PyLiteralStepsDiagram() {
  const W = 720, H = 320;
  const steps = ['Stand up', 'Turn left', 'Walk 12 steps', 'Open the door', 'Find the word MILK', 'Pick it up'];
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A human understands the vague instruction buy milk, but a computer needs every literal micro-step spelled out in order.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Computers are fast but literal — spell out every step</text>

        {/* Human side */}
        <rect x="40" y="70" width="220" height="90" rx="12" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-green-900/40 dark:stroke-green-400" />
        <text x="150" y="100" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Human hears:</text>
        <text x="150" y="126" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a" className="dark:fill-gray-100">"Buy milk"</text>
        <text x="150" y="146" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#475569" className="dark:fill-gray-400">fills in the rest</text>

        {/* arrow */}
        <line x1="260" y1="115" x2="320" y2="115" stroke="#64748b" strokeWidth="2" markerEnd="url(#pls-a)" />

        {/* Computer side: literal list */}
        <rect x="330" y="55" width="350" height="235" rx="12" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" className="dark:fill-gray-800 dark:stroke-blue-400" />
        <text x="505" y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Computer needs:</text>
        {steps.map((s, i) => (
          <g key={i}>
            <text x="352" y={108 + i * 28} fontSize="11" fontWeight="700" fill="#94a3b8" className="dark:fill-gray-500">{i + 1}.</text>
            <text x="372" y={108 + i * 28} fontSize="12" fill="#334155" className="dark:fill-gray-200">{s}</text>
          </g>
        ))}
        <defs><marker id="pls-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
