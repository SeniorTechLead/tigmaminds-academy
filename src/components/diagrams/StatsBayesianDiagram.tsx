/**
 * Bayesian updating: prior belief + new evidence → posterior belief. Shows belief
 * bars shifting for the "tiger in Kaziranga vs Guwahati" example.
 *
 * Used in the "Bayesian Inference" section.
 */
export default function StatsBayesianDiagram() {
  const W = 720, H = 290;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Bayesian inference: a prior belief is combined with new evidence to produce an updated posterior belief. Context like being in Kaziranga shifts how much a tiger sighting is believed.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Update beliefs as evidence arrives</text>

        {/* Prior */}
        <rect x="40" y="80" width="170" height="150" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="125" y="104" textAnchor="middle" fontSize="12" fontWeight="700" fill="#64748b" className="dark:fill-gray-300">Prior</text>
        <text x="125" y="120" textAnchor="middle" fontSize="9" fill="#94a3b8" className="dark:fill-gray-500">what you knew</text>
        <rect x="70" y="200" width="110" height="14" rx="4" fill="#e2e8f0" className="dark:fill-gray-700" />
        <rect x="70" y="200" width="40" height="14" rx="4" fill="#3b82f6" className="dark:fill-blue-500" />
        <text x="125" y="190" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">tigers rare here</text>

        {/* + Evidence */}
        <text x="240" y="160" textAnchor="middle" fontSize="20" fontWeight="800" fill="#64748b" className="dark:fill-gray-400">+</text>
        <rect x="270" y="80" width="170" height="150" rx="12" fill="#fff7ed" stroke="#f97316" strokeWidth="1.4" className="dark:fill-orange-900/30 dark:stroke-orange-400" />
        <text x="355" y="104" textAnchor="middle" fontSize="12" fontWeight="700" fill="#c2410c" className="dark:fill-orange-300">Evidence</text>
        <text x="355" y="120" textAnchor="middle" fontSize="9" fill="#9a3412" className="dark:fill-orange-200">new observation</text>
        <text x="355" y="160" textAnchor="middle" fontSize="11" fill="#334155" className="dark:fill-gray-200">"I saw a tiger</text>
        <text x="355" y="178" textAnchor="middle" fontSize="11" fill="#334155" className="dark:fill-gray-200">in Kaziranga"</text>

        {/* = Posterior */}
        <text x="470" y="160" textAnchor="middle" fontSize="20" fontWeight="800" fill="#64748b" className="dark:fill-gray-400">=</text>
        <rect x="500" y="80" width="180" height="150" rx="12" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.4" className="dark:fill-green-900/40 dark:stroke-green-400" />
        <text x="590" y="104" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Posterior</text>
        <text x="590" y="120" textAnchor="middle" fontSize="9" fill="#15803d" className="dark:fill-green-400">updated belief</text>
        <rect x="525" y="200" width="130" height="14" rx="4" fill="#e2e8f0" className="dark:fill-gray-700" />
        <rect x="525" y="200" width="105" height="14" rx="4" fill="#16a34a" className="dark:fill-green-500" />
        <text x="590" y="190" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">now quite believable</text>
      </svg>
    </div>
  );
}
