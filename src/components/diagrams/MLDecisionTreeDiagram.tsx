/**
 * A decision tree as a flowchart of yes/no questions branching to leaf answers.
 * Two levels of questions, three leaves.
 *
 * Used in the "Decision Trees" section.
 */
export default function MLDecisionTreeDiagram() {
  const W = 720, H = 340;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A decision tree: the root asks if pulse rate is high; no leads to calm, yes asks if amplitude is high, branching to danger or nervous.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="32" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Branch on yes/no questions until you reach an answer</text>

        {/* edges first (under nodes) */}
        <line x1="360" y1="100" x2="200" y2="170" stroke="#94a3b8" strokeWidth="2" />
        <line x1="360" y1="100" x2="500" y2="170" stroke="#94a3b8" strokeWidth="2" />
        <line x1="500" y1="210" x2="420" y2="270" stroke="#94a3b8" strokeWidth="2" />
        <line x1="500" y1="210" x2="600" y2="270" stroke="#94a3b8" strokeWidth="2" />

        {/* edge labels */}
        <text x="262" y="138" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">no</text>
        <text x="445" y="138" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">yes</text>
        <text x="448" y="245" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">yes</text>
        <text x="560" y="245" fontSize="11" fontWeight="700" fill="#64748b" className="dark:fill-gray-400">no</text>

        {/* root question */}
        <rect x="270" y="60" width="180" height="44" rx="22" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x="360" y="87" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Pulse rate high?</text>

        {/* leaf calm */}
        <rect x="120" y="172" width="160" height="40" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-green-900/40 dark:stroke-green-400" />
        <text x="200" y="197" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-green-300">calm</text>

        {/* second question */}
        <rect x="410" y="172" width="180" height="44" rx="22" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x="500" y="199" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Amplitude high?</text>

        {/* leaf danger */}
        <rect x="340" y="272" width="160" height="40" rx="10" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" className="dark:fill-red-900/40 dark:stroke-red-400" />
        <text x="420" y="297" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">danger</text>

        {/* leaf nervous */}
        <rect x="520" y="272" width="160" height="40" rx="10" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x="600" y="297" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b45309" className="dark:fill-amber-300">nervous</text>
      </svg>
    </div>
  );
}
