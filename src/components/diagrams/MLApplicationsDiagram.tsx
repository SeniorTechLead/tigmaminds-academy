/**
 * The same ML pipeline (features → labels → train → predict) fanning out to many
 * domains: images, spam, medical, translation. Shows one shared recipe powering
 * different applications.
 *
 * Used in the "From Elephants to Everything" section.
 */
export default function MLApplicationsDiagram() {
  const W = 760, H = 340;
  const apps = [
    { y: 70, name: 'Image recognition', feat: 'pixels', label: 'cat / dog / car' },
    { y: 135, name: 'Spam filter', feat: 'word counts', label: 'spam / not spam' },
    { y: 200, name: 'Medical diagnosis', feat: 'blood tests', label: 'healthy / ill' },
    { y: 265, name: 'Translation', feat: 'word sequence', label: 'target language' },
  ];
  const hubX = 175, hubY = 167;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="One shared recipe — features, labels, train, predict — fans out to image recognition, spam filtering, medical diagnosis, and translation.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">One recipe, many applications</text>

        {/* Hub: the shared recipe */}
        <rect x={hubX - 95} y={hubY - 55} width="190" height="110" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x={hubX} y={hubY - 32} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">The ML recipe</text>
        {['features', '→ labels', '→ train', '→ predict'].map((s, i) => (
          <text key={i} x={hubX} y={hubY - 12 + i * 17} textAnchor="middle" fontSize="11" fill="#334155" className="dark:fill-gray-200">{s}</text>
        ))}

        {/* Apps on the right */}
        {apps.map((a, i) => (
          <g key={i}>
            <line x1={hubX + 95} y1={hubY} x2="430" y2={a.y} stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="430" y={a.y - 24} width="300" height="48" rx="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
            <text x="444" y={a.y - 4} fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">{a.name}</text>
            <text x="444" y={a.y + 14} fontSize="10" fill="#475569" className="dark:fill-gray-400">{a.feat} → {a.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
