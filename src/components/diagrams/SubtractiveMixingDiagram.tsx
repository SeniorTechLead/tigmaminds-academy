export default function SubtractiveMixingDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Venn diagram showing subtractive color mixing with CMY primary pigments and their overlaps"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Subtractive Color Mixing (Pigments)
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Cyan, Magenta, and Yellow are the primary pigment colors
        </text>

        {/* White background to show subtractive */}
        <rect x="140" y="75" width="500" height="340" rx="10" fill="#fafafa" stroke="#e5e7eb" strokeWidth="1" />
        <text x="160" y="96" fontSize="10" className="fill-gray-400 dark:fill-slate-500">white paper (reflects all light)</text>

        {/* CMY Venn circles */}
        <circle cx="340" cy="200" r="100" fill="#06b6d4" fillOpacity="0.4" />
        <circle cx="440" cy="200" r="100" fill="#ec4899" fillOpacity="0.4" />
        <circle cx="390" cy="290" r="100" fill="#eab308" fillOpacity="0.4" />

        {/* Labels for primary pigments */}
        <text x="285" y="175" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0891b2">Cyan</text>
        <text x="285" y="192" textAnchor="middle" fontSize="10" fill="#0891b2">absorbs Red</text>
        <text x="495" y="175" textAnchor="middle" fontSize="13" fontWeight="700" fill="#db2777">Magenta</text>
        <text x="495" y="192" textAnchor="middle" fontSize="10" fill="#db2777">absorbs Green</text>
        <text x="390" y="355" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ca8a04">Yellow</text>
        <text x="390" y="372" textAnchor="middle" fontSize="10" fill="#ca8a04">absorbs Blue</text>

        {/* Overlap labels */}
        <text x="390" y="190" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4338ca">Blue</text>
        <text x="345" y="260" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">Green</text>
        <text x="435" y="260" textAnchor="middle" fontSize="12" fontWeight="700" fill="#dc2626">Red</text>

        {/* Center - all three overlap = black */}
        <circle cx="390" cy="235" r="20" fill="#1e1b18" fillOpacity="0.8" />
        <text x="390" y="240" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">Black</text>

        {/* Comparison with additive */}
        <rect x="40" y="420" width="340" height="45" rx="8" fill="#ec4899" fillOpacity="0.08" stroke="#ec4899" strokeWidth="1" />
        <text x="210" y="440" textAnchor="middle" fontSize="11" fontWeight="600" fill="#db2777">
          Subtractive (pigments): Start white, add filters
        </text>
        <text x="210" y="455" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          More mixing {'\u2192'} darker {'\u2192'} all three = black
        </text>

        <rect x="400" y="420" width="340" height="45" rx="8" fill="#3b82f6" fillOpacity="0.08" stroke="#3b82f6" strokeWidth="1" />
        <text x="570" y="440" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2563eb">
          Additive (screens): Start black, add light
        </text>
        <text x="570" y="455" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          More mixing {'\u2192'} brighter {'\u2192'} all three = white
        </text>
      </svg>
    </div>
  );
}
