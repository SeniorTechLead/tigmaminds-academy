export default function EMCSquaredDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 525 298" className="w-full max-w-2xl mx-auto" role="img" aria-label="E equals mc squared diagram">
        {/* Title */}
        <text x="225" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="16" fontWeight="bold">
          E = mc²
        </text>

        {/* Scale / balance beam */}
        {/* Fulcrum */}
        <polygon points="225,155 210,175 240,175" className="fill-gray-400 dark:fill-gray-500" />
        <line x1="60" y1="155" x2="390" y2="155" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="3" strokeLinecap="round" />

        {/* Left pan — mass */}
        <line x1="110" y1="155" x2="110" y2="130" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <rect x="65" y="100" width="90" height="30" rx="6" className="fill-blue-100 dark:fill-blue-900/50 stroke-blue-400" strokeWidth="1.5" />
        <text x="110" y="120" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="13" fontWeight="bold">1 gram</text>
        <text x="110" y="90" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">Tiny mass</text>

        {/* Equals sign on beam */}
        <text x="225" y="148" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="16" fontWeight="bold">=</text>

        {/* Right pan — energy */}
        <line x1="340" y1="155" x2="340" y2="110" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <rect x="275" y="75" width="130" height="35" rx="6" className="fill-amber-100 dark:fill-amber-900/50 stroke-amber-400" strokeWidth="1.5" />
        <text x="340" y="97" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="13" fontWeight="bold">9 × 10¹³ J</text>
        <text x="340" y="65" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">Enormous energy</text>

        {/* Calculation */}
        <rect x="75" y="190" width="300" height="48" rx="8" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="225" y="209" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11">
          E = 0.001 kg × (3 × 10⁸ m/s)² = 9 × 10¹³ J
        </text>
        <text x="225" y="228" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          c = speed of light = 300,000,000 m/s
        </text>

        {/* Visual comparison */}
        <text x="225" y="248" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="600">
          Enough to power a city for a day!
        </text>

        {/* Decorative lightning bolts on energy side */}
        <text x="275" y="95" className="fill-amber-500" fontSize="14">⚡</text>
        <text x="395" y="95" className="fill-amber-500" fontSize="14">⚡</text>
      </svg>
    </div>
  );
}
