/**
 * The Maillard reaction: sugars + amino acids + heat above 140°C → brown crust
 * with hundreds of new flavour/aroma compounds.
 *
 * Used in the "Food Chemistry — Cooking as a Chemical Lab" section.
 */
export default function MatMaillardDiagram() {
  const W = 720, H = 240;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="The Maillard reaction: sugars plus amino acids heated above 140 degrees Celsius produce a brown crust and hundreds of new flavour and aroma compounds.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">The Maillard reaction: how food browns</text>

        {/* reactants */}
        <rect x="40" y="80" width="150" height="46" rx="9" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.4" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x="115" y="108" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Sugars</text>
        <text x="115" y="146" textAnchor="middle" fontSize="16" fontWeight="800" fill="#64748b" className="dark:fill-gray-400">+</text>
        <rect x="40" y="160" width="150" height="46" rx="9" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.4" className="dark:fill-green-900/40 dark:stroke-green-400" />
        <text x="115" y="188" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Amino acids</text>

        {/* heat */}
        <line x1="195" y1="143" x2="290" y2="143" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#mm-a)" />
        <rect x="215" y="116" width="60" height="26" rx="13" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.4" className="dark:fill-red-900/40 dark:stroke-red-400" />
        <text x="245" y="134" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">&gt;140°C</text>

        {/* product: browned food */}
        <rect x="300" y="100" width="160" height="86" rx="12" fill="#fde68a" stroke="#b45309" strokeWidth="1.8" className="dark:fill-amber-800/40 dark:stroke-amber-500" />
        <text x="380" y="135" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">Brown crust</text>
        <text x="380" y="158" textAnchor="middle" fontSize="10" fill="#78350f" className="dark:fill-amber-300">pitha · roti · grilled fish</text>

        {/* aromas */}
        <line x1="460" y1="143" x2="525" y2="143" stroke="#64748b" strokeWidth="2" markerEnd="url(#mm-a)" />
        <rect x="535" y="108" width="150" height="70" rx="12" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" className="dark:fill-purple-900/40 dark:stroke-purple-400" />
        <text x="610" y="138" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">Hundreds of new</text>
        <text x="610" y="158" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6d28d9" className="dark:fill-purple-300">flavour compounds</text>
        <defs><marker id="mm-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
