/**
 * Three bond types side by side: ionic (electron transferred), covalent
 * (electron shared), metallic (sea of shared electrons).
 *
 * Used in the "Atoms and Chemical Bonds" section.
 */
export default function MatChemicalBondsDiagram() {
  const W = 720, H = 300;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Three chemical bonds: ionic bonds transfer an electron, covalent bonds share an electron between atoms, and metallic bonds share a sea of electrons across many atoms.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">How atoms bond shapes the material</text>

        {/* Ionic */}
        <g transform="translate(30, 70)">
          <rect x="0" y="0" width="200" height="190" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
          <text x="100" y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Ionic</text>
          <circle cx="60" cy="95" r="26" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
          <text x="60" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Na⁺</text>
          <circle cx="140" cy="95" r="26" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" className="dark:fill-green-900/40 dark:stroke-green-400" />
          <text x="140" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Cl⁻</text>
          <line x1="80" y1="80" x2="118" y2="90" stroke="#f97316" strokeWidth="2" markerEnd="url(#bond-a)" />
          <circle cx="98" cy="84" r="4" fill="#f97316" />
          <text x="100" y="150" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">electron transferred</text>
          <text x="100" y="168" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#64748b" className="dark:fill-gray-500">hard, brittle</text>
        </g>

        {/* Covalent */}
        <g transform="translate(260, 70)">
          <rect x="0" y="0" width="200" height="190" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
          <text x="100" y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">Covalent</text>
          <circle cx="62" cy="95" r="26" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" className="dark:fill-purple-900/40 dark:stroke-purple-400" />
          <text x="62" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">C</text>
          <circle cx="138" cy="95" r="26" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" className="dark:fill-purple-900/40 dark:stroke-purple-400" />
          <text x="138" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">C</text>
          <circle cx="92" cy="95" r="5" fill="#f97316" />
          <circle cx="108" cy="95" r="5" fill="#f97316" />
          <text x="100" y="150" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">electrons shared</text>
          <text x="100" y="168" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#64748b" className="dark:fill-gray-500">very strong (diamond)</text>
        </g>

        {/* Metallic */}
        <g transform="translate(490, 70)">
          <rect x="0" y="0" width="200" height="190" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
          <text x="100" y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b45309" className="dark:fill-amber-300">Metallic</text>
          {[[55, 80], [105, 80], [55, 120], [105, 120], [80, 100]].map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="16" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
          ))}
          {[[40, 65], [125, 70], [70, 135], [120, 130], [150, 100], [35, 110]].map((p, i) => (
            <circle key={'e' + i} cx={p[0]} cy={p[1]} r="3.5" fill="#f97316" />
          ))}
          <text x="100" y="160" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">sea of free electrons</text>
          <text x="100" y="178" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#64748b" className="dark:fill-gray-500">conductive, bendable</text>
        </g>
        <defs><marker id="bond-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#f97316" /></marker></defs>
      </svg>
    </div>
  );
}
