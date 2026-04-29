export default function RadioactiveDecayDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 577 298" className="w-full max-w-2xl mx-auto" role="img" aria-label="Radioactive decay diagram showing alpha, beta, and gamma radiation penetration through paper, aluminum, and lead">
        <text x="250" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Types of Radioactive Decay</text>

        {/* Radiation source */}
        <circle cx="40" cy="130" r="22" className="fill-yellow-300 dark:fill-yellow-600 stroke-yellow-500" strokeWidth="2" />
        <text x="40" y="125" textAnchor="middle" className="fill-yellow-800 dark:fill-yellow-200" fontSize="10" fontWeight="bold">Radio-</text>
        <text x="40" y="137" textAnchor="middle" className="fill-yellow-800 dark:fill-yellow-200" fontSize="10" fontWeight="bold">active</text>
        <text x="40" y="160" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">source</text>

        {/* Three rays emanating */}
        {/* Alpha ray - top */}
        <line x1="62" y1="115" x2="140" y2="75" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" markerEnd="url(#radArrowR)" />
        <text x="85" y="82" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="bold">Alpha (a)</text>

        {/* Beta ray - middle */}
        <line x1="62" y1="130" x2="220" y2="130" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" markerEnd="url(#radArrowB)" />
        <text x="100" y="125" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="bold">Beta (b)</text>

        {/* Gamma ray - bottom */}
        <line x1="62" y1="145" x2="400" y2="185" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" markerEnd="url(#radArrowG)" />
        <text x="95" y="158" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="bold">Gamma (g)</text>

        {/* Paper barrier */}
        <rect x="145" y="50" width="8" height="160" rx="1" className="fill-amber-200 dark:fill-amber-700" />
        <text x="149" y="45" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="600">Paper</text>
        {/* Alpha stops here - X mark */}
        <text x="152" y="80" textAnchor="middle" className="fill-red-500" fontSize="14" fontWeight="bold">X</text>
        {/* Beta and Gamma pass through */}
        <line x1="153" y1="130" x2="220" y2="130" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" strokeDasharray="4,3" />
        <line x1="153" y1="152" x2="260" y2="165" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" strokeDasharray="4,3" />

        {/* Aluminum barrier */}
        <rect x="225" y="50" width="12" height="160" rx="2" className="fill-gray-300 dark:fill-gray-500" />
        <text x="231" y="45" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">Aluminum</text>
        {/* Beta stops here */}
        <text x="231" y="135" textAnchor="middle" className="fill-blue-500" fontSize="14" fontWeight="bold">X</text>
        {/* Gamma passes through */}
        <line x1="237" y1="162" x2="350" y2="178" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" strokeDasharray="4,3" />

        {/* Lead barrier */}
        <rect x="355" y="50" width="20" height="160" rx="3" className="fill-gray-500 dark:fill-gray-600" />
        <text x="365" y="45" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Lead</text>
        {/* Gamma stops (mostly) */}
        <text x="365" y="188" textAnchor="middle" className="fill-emerald-500" fontSize="14" fontWeight="bold">X</text>

        {/* Properties */}
        <rect x="400" y="55" width="95" height="70" rx="6" className="fill-gray-100 dark:fill-gray-800" />
        <text x="447" y="72" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10">a: He nucleus</text>
        <text x="447" y="88" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="10">b: electron</text>
        <text x="447" y="104" textAnchor="middle" className="fill-emerald-500 dark:fill-emerald-400" fontSize="10">g: EM wave</text>
        <text x="447" y="118" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(most penetrating)</text>

        {/* Penetration scale */}
        <line x1="100" y1="235" x2="430" y2="235" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" markerEnd="url(#radArrowGr)" />
        <text x="265" y="248" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Increasing penetrating power →</text>

        <defs>
          <marker id="radArrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-red-500 dark:fill-red-400" />
          </marker>
          <marker id="radArrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
          <marker id="radArrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-emerald-500 dark:fill-emerald-400" />
          </marker>
          <marker id="radArrowGr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
