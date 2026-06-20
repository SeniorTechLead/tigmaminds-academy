/**
 * List comprehension anatomy: [expression for item in iterable if condition].
 * Shows the source list flowing through the expression + filter into a new list.
 *
 * Used in the "List Comprehensions — One-Line Loops" section.
 */
export default function PyComprehensionDiagram() {
  const W = 720, H = 290;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A list comprehension takes a source list, keeps items passing the filter, applies the expression, and builds a new list. Example squares the even numbers.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="32" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">[ expression  for item in list  if condition ]</text>

        {/* annotated syntax */}
        <rect x="40" y="52" width="640" height="40" rx="8" fill="#0f172a" className="dark:fill-gray-950" />
        <text x="60" y="78" fontSize="14" fontFamily="monospace" fill="#e2e8f0">[<tspan fill="#fdba74">x*x</tspan> <tspan fill="#93c5fd">for</tspan> x <tspan fill="#93c5fd">in</tspan> nums <tspan fill="#86efac">if</tspan> x % 2 == 0]</text>

        {/* source list */}
        <text x="110" y="130" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">nums</text>
        {[1, 2, 3, 4, 5, 6].map((n, i) => (
          <g key={i}>
            <rect x={60 + i * 34} y="140" width="30" height="30" rx="5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
            <text x={75 + i * 34} y="160" textAnchor="middle" fontSize="12" fill="#334155" className="dark:fill-gray-200">{n}</text>
          </g>
        ))}

        {/* filter+expr box */}
        <line x1="280" y1="155" x2="340" y2="155" stroke="#64748b" strokeWidth="2" markerEnd="url(#pc-a)" />
        <rect x="345" y="128" width="150" height="56" rx="9" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" className="dark:fill-purple-900/40 dark:stroke-purple-400" />
        <text x="420" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">keep evens,</text>
        <text x="420" y="168" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">then square</text>
        <line x1="495" y1="155" x2="555" y2="155" stroke="#64748b" strokeWidth="2" markerEnd="url(#pc-a)" />

        {/* result list */}
        {[4, 16, 36].map((n, i) => (
          <g key={i}>
            <rect x={560 + i * 38} y="140" width="34" height="30" rx="5" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.2" className="dark:fill-green-900/40 dark:stroke-green-400" />
            <text x={577 + i * 38} y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-green-300">{n}</text>
          </g>
        ))}
        <text x="615" y="130" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-green-300">result</text>

        <text x="40" y="225" fontSize="11" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">One line replaces a loop: filter with "if", transform with the expression.</text>
        <defs><marker id="pc-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
