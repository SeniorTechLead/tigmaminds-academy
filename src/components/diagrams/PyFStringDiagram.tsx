/**
 * f-string anatomy: how f"...{expr:spec}..." substitutes values and applies a
 * format spec. Shows the template and the rendered result with format specs.
 *
 * Used in the "String Formatting — f-strings and Beyond" section.
 */
export default function PyFStringDiagram() {
  const W = 720, H = 300;
  const specs = [
    { code: ':.2f', means: '2 decimal places', ex: '3.14159 → 3.14' },
    { code: ':,', means: 'thousands separator', ex: '1000000 → 1,000,000' },
    { code: ':>10', means: 'right-align in 10', ex: '"hi" → "        hi"' },
  ];
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="An f-string embeds expressions in curly braces and applies a format spec after a colon. Examples show two decimals, thousands separators, and right alignment.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="32" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">f-strings: embed values, then format them</text>

        {/* template -> result */}
        <rect x="40" y="55" width="330" height="44" rx="8" fill="#0f172a" className="dark:fill-gray-950" />
        <text x="58" y="83" fontSize="13" fontFamily="monospace" fill="#e2e8f0">f"Total: <tspan fill="#86efac">{`{price:.2f}`}</tspan>"</text>
        <line x1="370" y1="77" x2="430" y2="77" stroke="#64748b" strokeWidth="2" markerEnd="url(#pfs-a)" />
        <rect x="435" y="55" width="245" height="44" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-green-900/40 dark:stroke-green-400" />
        <text x="452" y="83" fontSize="13" fontFamily="monospace" fill="#15803d" className="dark:fill-green-300">Total: 3.14</text>

        <text x="40" y="135" fontSize="12" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">Format specs after the colon:</text>
        {specs.map((s, i) => (
          <g key={i}>
            <rect x="40" y={150 + i * 44} width="110" height="34" rx="7" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.3" className="dark:fill-purple-900/40 dark:stroke-purple-400" />
            <text x="95" y={172 + i * 44} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">{s.code}</text>
            <text x="165" y={172 + i * 44} fontSize="11" fill="#334155" className="dark:fill-gray-200">{s.means}</text>
            <text x="380" y={172 + i * 44} fontSize="11" fontFamily="monospace" fill="#475569" className="dark:fill-gray-400">{s.ex}</text>
          </g>
        ))}
        <defs><marker id="pfs-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
