/**
 * Firing ceramics: wet clay → kiln heat drives off water → silicate crystals
 * fuse into a rigid network. Before/after states with the kiln in the middle.
 *
 * Used in the "Ceramics — From River Clay to Space Shuttles" section.
 */
export default function MatCeramicFiringDiagram() {
  const W = 720, H = 250;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Firing ceramics: wet clay with loose particles and water goes into a hot kiln, which drives off water and fuses the silicate particles into a rigid interlocking network.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Heat fuses loose clay into a rigid network</text>

        {/* wet clay */}
        <rect x="40" y="70" width="170" height="140" rx="12" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" className="dark:fill-yellow-900/30 dark:stroke-yellow-600" />
        <text x="125" y="94" textAnchor="middle" fontSize="12" fontWeight="700" fill="#a16207" className="dark:fill-yellow-300">Wet clay</text>
        {[[75, 130], [110, 120], [150, 140], [90, 165], [140, 170], [170, 130]].map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="9" fill="#d6b56a" stroke="#a16207" strokeWidth="1" className="dark:fill-yellow-700/50" />
        ))}
        {/* water droplets */}
        {[[100, 145], [130, 155], [160, 160]].map((p, i) => <circle key={'w' + i} cx={p[0]} cy={p[1]} r="3" fill="#3b82f6" />)}
        <text x="125" y="200" textAnchor="middle" fontSize="9" fill="#475569" className="dark:fill-gray-400">loose particles + water</text>

        {/* kiln */}
        <line x1="210" y1="140" x2="270" y2="140" stroke="#64748b" strokeWidth="2" markerEnd="url(#mcf-a)" />
        <rect x="278" y="95" width="150" height="90" rx="10" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.8" className="dark:fill-red-900/30 dark:stroke-red-400" />
        <text x="353" y="130" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">Kiln</text>
        <text x="353" y="150" textAnchor="middle" fontSize="11" fill="#b91c1c" className="dark:fill-red-300">~1000°C</text>
        <text x="353" y="168" textAnchor="middle" fontSize="9" fill="#475569" className="dark:fill-gray-400">water driven off</text>
        <line x1="428" y1="140" x2="488" y2="140" stroke="#64748b" strokeWidth="2" markerEnd="url(#mcf-a)" />

        {/* fired ceramic */}
        <rect x="500" y="70" width="180" height="140" rx="12" fill="#e2e8f0" stroke="#475569" strokeWidth="1.8" className="dark:fill-gray-700 dark:stroke-gray-400" />
        <text x="590" y="94" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" className="dark:fill-gray-100">Fired ceramic</text>
        {/* interlocking crystals */}
        {[[540, 130], [575, 125], [615, 135], [555, 160], [600, 162], [635, 145]].map((p, i) => (
          <polygon key={i} points={`${p[0]},${p[1] - 11} ${p[0] + 11},${p[1]} ${p[0]},${p[1] + 11} ${p[0] - 11},${p[1]}`} fill="#94a3b8" stroke="#334155" strokeWidth="1" className="dark:fill-gray-500" />
        ))}
        <text x="590" y="200" textAnchor="middle" fontSize="9" fill="#475569" className="dark:fill-gray-400">fused, rigid, waterproof</text>
        <defs><marker id="mcf-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
