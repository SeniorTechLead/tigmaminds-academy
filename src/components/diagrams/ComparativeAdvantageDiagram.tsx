/**
 * Comparative advantage: two regions each specialize in the good with the lower
 * opportunity cost, then trade — and both end up with more. Uses the
 * Assam (tea) / Tamil Nadu (electronics) example from the guide.
 *
 * Used in the "Trade and Comparative Advantage" section.
 */
export default function ComparativeAdvantageDiagram() {
  const W = 720, H = 320;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img"
        aria-label="Assam specializes in tea and Tamil Nadu in electronics because each has a lower opportunity cost in that good; they trade and both end up with more.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Each region makes what it gives up least to produce</text>

        {/* Assam panel */}
        <rect x="30" y="60" width="270" height="150" rx="12" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" className="dark:fill-green-900/30 dark:stroke-green-500" />
        <text x="165" y="86" textAnchor="middle" fontSize="13" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Assam</text>
        <text x="165" y="108" textAnchor="middle" fontSize="11" fill="#334155" className="dark:fill-gray-200">Makes tea cheaply (climate, soil)</text>
        <text x="165" y="132" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Opportunity cost of 1kg tea</text>
        <text x="165" y="150" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a" className="dark:fill-gray-100">= 0.5kg electronics  (low)</text>
        <text x="165" y="180" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#15803d" className="dark:fill-green-300">→ specialize in 🍃 TEA</text>

        {/* Tamil Nadu panel */}
        <rect x="420" y="60" width="270" height="150" rx="12" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8" className="dark:fill-blue-900/30 dark:stroke-blue-500" />
        <text x="555" y="86" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Tamil Nadu</text>
        <text x="555" y="108" textAnchor="middle" fontSize="11" fill="#334155" className="dark:fill-gray-200">Makes electronics cheaply (factories)</text>
        <text x="555" y="132" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">Opportunity cost of 1kg electronics</text>
        <text x="555" y="150" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a" className="dark:fill-gray-100">= 0.75kg tea  (low)</text>
        <text x="555" y="180" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#1d4ed8" className="dark:fill-blue-300">→ specialize in 💻 ELECTRONICS</text>

        {/* trade arrows */}
        <line x1="300" y1="115" x2="420" y2="115" stroke="#16a34a" strokeWidth="2.5" markerEnd="url(#ca-g)" />
        <text x="360" y="108" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d" className="dark:fill-green-300">tea →</text>
        <line x1="420" y1="155" x2="300" y2="155" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#ca-b)" />
        <text x="360" y="172" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">← electronics</text>

        {/* outcome banner */}
        <rect x="120" y="240" width="480" height="50" rx="10" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" className="dark:fill-yellow-900/30 dark:stroke-yellow-600" />
        <text x="360" y="262" textAnchor="middle" fontSize="12" fontWeight="700" fill="#854d0e" className="dark:fill-yellow-200">Both trade and end up with MORE of both goods</text>
        <text x="360" y="280" textAnchor="middle" fontSize="10" fill="#713f12" className="dark:fill-yellow-300">— even if one region were better at making everything (Ricardo, 1817)</text>

        <defs>
          <marker id="ca-g" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#16a34a" /></marker>
          <marker id="ca-b" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#2563eb" /></marker>
        </defs>
      </svg>
    </div>
  );
}
