export default function CellComparisonDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 540 300" className="w-full max-w-2xl mx-auto" role="img" aria-label="Animal cell vs plant cell comparison">
        {/* Title */}
        <text x="270" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Animal Cell vs Plant Cell
        </text>

        {/* ── Animal Cell (left) ── */}
        <ellipse cx="140" cy="160" rx="120" ry="100" className="fill-orange-50 dark:fill-orange-900/20 stroke-orange-400" strokeWidth="2" />
        <text x="140" y="50" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="bold">Animal Cell</text>

        {/* Cell membrane label */}
        <text x="140" y="72" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">(cell membrane only)</text>

        {/* Nucleus — shared */}
        <ellipse cx="140" cy="145" rx="30" ry="25" className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-500" strokeWidth="1.5" />
        <text x="140" y="149" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="10" fontWeight="600">Nucleus</text>

        {/* Mitochondria — shared */}
        <ellipse cx="90" cy="195" rx="18" ry="10" className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-400" strokeWidth="1" />
        <text x="90" y="199" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="8">Mito</text>

        {/* ER — shared */}
        <path d="M 170,110 Q 180,120 170,130 Q 160,140 170,150" fill="none" className="stroke-blue-400" strokeWidth="1.2" />
        <text x="185" y="130" className="fill-blue-600 dark:fill-blue-300" fontSize="8">ER</text>

        {/* Golgi — shared */}
        <path d="M 95,100 Q 110,95 105,110 Q 100,120 115,118" fill="none" className="stroke-blue-400" strokeWidth="1.2" />
        <text x="80" y="100" className="fill-blue-600 dark:fill-blue-300" fontSize="8">Golgi</text>

        {/* Small vacuoles */}
        <circle cx="180" cy="200" r="8" className="fill-purple-100 dark:fill-purple-900/20 stroke-purple-300" strokeWidth="1" />
        <text x="180" y="220" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">small vacuoles</text>

        {/* ── Plant Cell (right) ── */}
        {/* Cell wall — thick outer boundary */}
        <rect x="290" y="60" width="230" height="200" rx="12" className="fill-none stroke-green-600 dark:stroke-green-400" strokeWidth="4" />
        <text x="405" y="50" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="bold">Plant Cell</text>

        {/* Cell membrane inside wall */}
        <ellipse cx="405" cy="160" rx="105" ry="90" className="fill-emerald-50 dark:fill-emerald-900/15 stroke-orange-400" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Cell wall label — plant only */}
        <text x="525" y="110" textAnchor="end" className="fill-green-600 dark:fill-green-400" fontSize="9" fontWeight="600">Cell wall</text>
        <line x1="519" y1="112" x2="519" y2="140" className="stroke-green-500" strokeWidth="0.8" />

        {/* Large central vacuole — plant only */}
        <ellipse cx="410" cy="170" rx="45" ry="35" className="fill-green-100 dark:fill-green-900/20 stroke-green-500" strokeWidth="1.5" />
        <text x="410" y="167" textAnchor="middle" className="fill-green-600 dark:fill-green-400" fontSize="9" fontWeight="600">Central</text>
        <text x="410" y="179" textAnchor="middle" className="fill-green-600 dark:fill-green-400" fontSize="9" fontWeight="600">Vacuole</text>

        {/* Nucleus — shared */}
        <ellipse cx="370" cy="115" rx="25" ry="20" className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-500" strokeWidth="1.5" />
        <text x="370" y="119" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="10" fontWeight="600">Nucleus</text>

        {/* Mitochondria — shared */}
        <ellipse cx="340" cy="210" rx="16" ry="9" className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-400" strokeWidth="1" />
        <text x="340" y="213" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="8">Mito</text>

        {/* ER — shared */}
        <path d="M 440,100 Q 450,110 440,120 Q 430,130 440,140" fill="none" className="stroke-blue-400" strokeWidth="1.2" />
        <text x="455" y="120" className="fill-blue-600 dark:fill-blue-300" fontSize="8">ER</text>

        {/* Golgi — shared */}
        <path d="M 460,190 Q 475,185 470,200 Q 465,210 480,208" fill="none" className="stroke-blue-400" strokeWidth="1.2" />
        <text x="485" y="200" className="fill-blue-600 dark:fill-blue-300" fontSize="8">Golgi</text>

        {/* Chloroplasts — plant only */}
        <ellipse cx="340" cy="145" rx="14" ry="9" className="fill-green-300 dark:fill-green-700 stroke-green-600" strokeWidth="1" />
        <text x="320" y="139" textAnchor="end" className="fill-green-600 dark:fill-green-400" fontSize="8" fontWeight="600">Chloro-</text>
        <text x="320" y="149" textAnchor="end" className="fill-green-600 dark:fill-green-400" fontSize="8" fontWeight="600">plast</text>

        <ellipse cx="470" cy="155" rx="14" ry="9" className="fill-green-300 dark:fill-green-700 stroke-green-600" strokeWidth="1" />

        {/* Legend */}
        <rect x="10" y="272" width="10" height="10" rx="2" className="fill-blue-200 dark:fill-blue-800 stroke-blue-500" strokeWidth="0.5" />
        <text x="24" y="281" className="fill-blue-600 dark:fill-blue-300" fontSize="10">Shared organelles</text>

        <rect x="160" y="272" width="10" height="10" rx="2" className="fill-green-200 dark:fill-green-800 stroke-green-500" strokeWidth="0.5" />
        <text x="174" y="281" className="fill-green-600 dark:fill-green-400" fontSize="10">Plant-cell only</text>
      </svg>
    </div>
  );
}
