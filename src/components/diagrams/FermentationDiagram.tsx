export default function FermentationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 565 279" className="w-full max-w-xl mx-auto" role="img" aria-label="Fermentation pathways diagram">
        <defs>
          <marker id="fermArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Title */}
        <text x="250" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">
          Fermentation: Two Pathways
        </text>

        {/* Glucose (center-left) */}
        <rect x="30" y="90" width="100" height="45" rx="10" className="fill-blue-200 dark:fill-blue-900/50 stroke-blue-400" strokeWidth="1.5" />
        <text x="80" y="112" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="12" fontWeight="bold">Glucose</text>
        <text x="80" y="126" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">C₆H₁₂O₆</text>

        {/* No oxygen label */}
        <text x="80" y="80" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10" fontWeight="600">No O₂ needed</text>

        {/* Branching arrows */}
        {/* Top arrow — alcoholic */}
        <line x1="130" y1="100" x2="195" y2="68" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#fermArrow)" />
        {/* Bottom arrow — lactic */}
        <line x1="130" y1="125" x2="195" y2="168" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#fermArrow)" />

        {/* ALCOHOLIC FERMENTATION (top) */}
        <rect x="195" y="38" width="150" height="55" rx="10" className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400" strokeWidth="1.5" />
        <text x="270" y="56" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">Alcoholic Fermentation</text>
        <text x="270" y="72" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">by yeast</text>
        <text x="270" y="86" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(anaerobic)</text>

        {/* Products of alcoholic */}
        <line x1="345" y1="65" x2="380" y2="50" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#fermArrow)" />
        <line x1="345" y1="65" x2="380" y2="80" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#fermArrow)" />

        <rect x="380" y="35" width="100" height="26" rx="6" className="fill-purple-200 dark:fill-purple-900/40" />
        <text x="430" y="52" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" fontWeight="600">Ethanol (C₂H₅OH)</text>

        <rect x="380" y="68" width="80" height="26" rx="6" className="fill-gray-200 dark:fill-gray-700" />
        <text x="420" y="85" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">CO₂ + Energy</text>

        {/* LACTIC ACID FERMENTATION (bottom) */}
        <rect x="195" y="148" width="150" height="55" rx="10" className="fill-rose-100 dark:fill-rose-900/40 stroke-rose-400" strokeWidth="1.5" />
        <text x="270" y="167" textAnchor="middle" className="fill-rose-700 dark:fill-rose-300" fontSize="11" fontWeight="bold">Lactic Acid Fermentation</text>
        <text x="270" y="183" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">by bacteria / muscle cells</text>
        <text x="270" y="196" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(anaerobic)</text>

        {/* Products of lactic */}
        <line x1="345" y1="175" x2="380" y2="175" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#fermArrow)" />

        <rect x="380" y="160" width="110" height="30" rx="6" className="fill-rose-200 dark:fill-rose-900/40" />
        <text x="435" y="178" textAnchor="middle" className="fill-rose-700 dark:fill-rose-300" fontSize="10" fontWeight="600">Lactic acid + Energy</text>

        {/* Assam connection */}
        <rect x="80" y="210" width="340" height="30" rx="8" className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="1" />
        <text x="250" y="229" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="11" fontWeight="600">
          In Assam: Rice beer (Apong/Laopani) uses yeast; Pitha dough rises from CO₂
        </text>
      </svg>
    </div>
  );
}
