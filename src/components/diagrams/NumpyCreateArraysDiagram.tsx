/**
 * Ways to create NumPy arrays: from a list, and via helpers zeros, arange,
 * linspace. Each shows the call and the resulting array.
 *
 * Used in the "Creating Arrays" sections of the numpy guide.
 */
export default function NumpyCreateArraysDiagram() {
  const W = 720, H = 290;
  const rows = [
    { call: 'np.array([1, 2, 3])', out: '[1, 2, 3]' },
    { call: 'np.zeros(4)', out: '[0. 0. 0. 0.]' },
    { call: 'np.arange(0, 6, 2)', out: '[0 2 4]' },
    { call: 'np.linspace(0, 1, 5)', out: '[0. .25 .5 .75 1.]' },
  ];
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Creating NumPy arrays: from a list with np.array, all zeros with np.zeros, a stepped range with np.arange, and evenly spaced points with np.linspace.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Four ways to build an array</text>
        {rows.map((r, i) => (
          <g key={i}>
            <rect x="40" y={60 + i * 54} width="300" height="42" rx="8" fill="#0f172a" className="dark:fill-gray-950" />
            <text x="58" y={86 + i * 54} fontSize="12" fontFamily="monospace" fill="#93c5fd">{r.call}</text>
            <line x1="340" y1={81 + i * 54} x2="400" y2={81 + i * 54} stroke="#64748b" strokeWidth="2" markerEnd="url(#nca-a)" />
            <rect x="405" y={60 + i * 54} width="275" height="42" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.3" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
            <text x="423" y={86 + i * 54} fontSize="12" fontFamily="monospace" fontWeight="600" fill="#1d4ed8" className="dark:fill-blue-300">{r.out}</text>
          </g>
        ))}
        <defs><marker id="nca-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
