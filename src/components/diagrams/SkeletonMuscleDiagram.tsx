export default function SkeletonMuscleDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 430 345" className="w-full max-w-md mx-auto" role="img" aria-label="Bicep and tricep antagonistic muscle pair diagram">
        {/* Title */}
        <text x="200" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Antagonistic Muscle Pair: Bicep &amp; Tricep</text>

        {/* === State 1: Bicep contracted (arm bent) === */}
        <text x="100" y="42" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="12" fontWeight="600">Flexion (bending)</text>

        {/* Upper arm bone (humerus) */}
        <line x1="50" y1="70" x2="50" y2="180" className="stroke-gray-300 dark:stroke-gray-500" strokeWidth="10" strokeLinecap="round" />
        {/* Forearm bone (bent up) */}
        <line x1="50" y1="180" x2="130" y2="110" className="stroke-gray-300 dark:stroke-gray-500" strokeWidth="8" strokeLinecap="round" />
        {/* Joint */}
        <circle cx="50" cy="180" r="8" className="fill-gray-200 dark:fill-gray-600" stroke="#6b7280" strokeWidth="1.5" />

        {/* Bicep (contracted - short and thick) */}
        <path d="M 45,80 Q 25,120 30,140 Q 35,155 50,160 Q 65,155 70,140 Q 75,120 55,80 Z"
          className="fill-red-400 dark:fill-red-600" opacity="0.8" stroke="#dc2626" strokeWidth="1" />
        <text x="50" y="128" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="10" fontWeight="bold">Bicep</text>
        <text x="50" y="140" textAnchor="middle" className="fill-red-800 dark:fill-red-200" fontSize="10">(contracts)</text>

        {/* Tricep (relaxed - long and thin) */}
        <path d="M 55,80 Q 65,120 63,150 Q 60,170 55,180 Q 50,170 48,150 Q 46,120 55,80 Z"
          className="fill-blue-300 dark:fill-blue-700" opacity="0.6" stroke="#3b82f6" strokeWidth="1" />
        <text x="80" y="165" className="fill-blue-700 dark:fill-blue-200" fontSize="10">Tricep</text>
        <text x="80" y="177" className="fill-blue-600 dark:fill-blue-300" fontSize="10">(relaxes)</text>

        {/* Hand */}
        <circle cx="135" cy="105" r="10" className="fill-amber-200 dark:fill-amber-700" stroke="#d97706" strokeWidth="1" />
        <text x="148" y="108" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Hand</text>

        {/* Movement arrow */}
        <path d="M 150,130 Q 145,115 140,105" className="stroke-green-500" strokeWidth="2" fill="none" />
        <polygon points="138,110 140,102 145,112" className="fill-green-500" />

        {/* Shoulder */}
        <circle cx="50" cy="70" r="6" className="fill-gray-200 dark:fill-gray-600" stroke="#6b7280" strokeWidth="1" />
        <text x="50" y="62" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Shoulder</text>

        {/* === State 2: Tricep contracted (arm straight) === */}
        <text x="300" y="42" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="12" fontWeight="600">Extension (straightening)</text>

        {/* Upper arm bone */}
        <line x1="260" y1="70" x2="260" y2="180" className="stroke-gray-300 dark:stroke-gray-500" strokeWidth="10" strokeLinecap="round" />
        {/* Forearm bone (straight down) */}
        <line x1="260" y1="180" x2="260" y2="260" className="stroke-gray-300 dark:stroke-gray-500" strokeWidth="8" strokeLinecap="round" />
        {/* Joint */}
        <circle cx="260" cy="180" r="8" className="fill-gray-200 dark:fill-gray-600" stroke="#6b7280" strokeWidth="1.5" />

        {/* Bicep (relaxed - long and thin) */}
        <path d="M 255,80 Q 245,120 247,150 Q 250,170 255,180 Q 260,170 262,150 Q 264,120 258,80 Z"
          className="fill-red-300 dark:fill-red-800" opacity="0.6" stroke="#dc2626" strokeWidth="1" />
        <text x="230" y="128" textAnchor="end" className="fill-red-600 dark:fill-red-300" fontSize="10">Bicep</text>
        <text x="230" y="140" textAnchor="end" className="fill-red-500 dark:fill-red-400" fontSize="10">(relaxes)</text>

        {/* Tricep (contracted - short and thick) */}
        <path d="M 265,80 Q 290,110 285,140 Q 280,155 265,160 Q 250,155 247,140 Q 242,110 265,80 Z"
          className="fill-blue-400 dark:fill-blue-600" opacity="0.8" stroke="#3b82f6" strokeWidth="1" />
        <text x="300" y="128" className="fill-blue-800 dark:fill-blue-100" fontSize="10" fontWeight="bold">Tricep</text>
        <text x="300" y="140" className="fill-blue-700 dark:fill-blue-200" fontSize="10">(contracts)</text>

        {/* Hand */}
        <circle cx="260" cy="268" r="10" className="fill-amber-200 dark:fill-amber-700" stroke="#d97706" strokeWidth="1" />

        {/* Movement arrow */}
        <path d="M 275,240 Q 272,252 270,262" className="stroke-green-500" strokeWidth="2" fill="none" />
        <polygon points="267,258 270,266 275,256" className="fill-green-500" />

        {/* Shoulder */}
        <circle cx="260" cy="70" r="6" className="fill-gray-200 dark:fill-gray-600" stroke="#6b7280" strokeWidth="1" />
        <text x="260" y="62" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Shoulder</text>

        {/* Divider */}
        <line x1="195" y1="35" x2="195" y2="285" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" strokeDasharray="4,4" />

        {/* Bottom note */}
        <text x="200" y="295" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">When one muscle contracts, the other relaxes — they work as a pair</text>
      </svg>
    </div>
  );
}
