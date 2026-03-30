export default function AdaptationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 567 233" className="w-full max-w-xl mx-auto" role="img" aria-label="Adaptation examples from NE India">
        {/* Title */}
        <text x="270" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Adaptations in NE India Wildlife
        </text>

        {/* Rhino — Protection */}
        <g transform="translate(30, 40)">
          {/* Body */}
          <ellipse cx="70" cy="80" rx="55" ry="35" className="fill-gray-400 dark:fill-gray-500" />
          {/* Head */}
          <ellipse cx="125" cy="75" rx="25" ry="20" className="fill-gray-400 dark:fill-gray-500" />
          {/* Horn */}
          <polygon points="145,60 150,40 155,60" className="fill-gray-600 dark:fill-gray-300" />
          {/* Legs */}
          <rect x="35" y="110" width="14" height="25" rx="3" className="fill-gray-500 dark:fill-gray-600" />
          <rect x="80" y="110" width="14" height="25" rx="3" className="fill-gray-500 dark:fill-gray-600" />
          <rect x="105" y="110" width="14" height="25" rx="3" className="fill-gray-500 dark:fill-gray-600" />
          {/* Armor plates */}
          <path d="M 30,70 Q 70,55 110,70" fill="none" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1.5" />
          <path d="M 35,85 Q 70,95 105,85" fill="none" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1.5" />
          {/* Eye */}
          <circle cx="135" cy="70" r="3" className="fill-gray-800 dark:fill-gray-200" />
          {/* Label */}
          <text x="70" y="155" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Indian Rhino</text>
          <text x="70" y="170" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">Thick armor plates</text>
          <text x="70" y="183" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">→ Protection</text>
        </g>

        {/* Pitcher Plant — Nutrition */}
        <g transform="translate(200, 40)">
          {/* Stem */}
          <path d="M 70,140 L 70,80" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2" fill="none" />
          {/* Pitcher shape */}
          <path d="M 45,80 Q 40,30 55,15 Q 70,5 85,15 Q 100,30 95,80 Z"
            className="fill-emerald-400 dark:fill-emerald-500" opacity="0.8" />
          {/* Liquid inside */}
          <path d="M 50,65 Q 70,75 90,65 L 90,78 Q 70,82 50,78 Z"
            className="fill-emerald-600 dark:fill-emerald-700" opacity="0.6" />
          {/* Lid */}
          <ellipse cx="70" cy="12" rx="20" ry="8" className="fill-emerald-500 dark:fill-emerald-600" />
          {/* Rim */}
          <ellipse cx="70" cy="80" rx="25" ry="5" className="fill-red-400 dark:fill-red-500" opacity="0.7" />
          {/* Insect */}
          <circle cx="72" cy="55" r="3" className="fill-gray-700 dark:fill-gray-300" />
          <text x="82" y="58" className="fill-gray-500 dark:fill-gray-400" fontSize="8">insect</text>
          {/* Arrow showing insect falling */}
          <line x1="72" y1="40" x2="72" y2="50" className="stroke-gray-500" strokeWidth="1" markerEnd="url(#adaptArrow)" />
          {/* Label */}
          <text x="70" y="155" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Pitcher Plant</text>
          <text x="70" y="170" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">Trap-shaped leaves</text>
          <text x="70" y="183" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">→ Nutrition</text>
        </g>

        {/* Red Panda — Warmth */}
        <g transform="translate(380, 40)">
          {/* Body */}
          <ellipse cx="65" cy="85" rx="35" ry="28" className="fill-red-500 dark:fill-red-600" />
          {/* Head */}
          <circle cx="95" cy="65" r="20" className="fill-red-500 dark:fill-red-600" />
          {/* White face patches */}
          <circle cx="88" cy="60" r="5" className="fill-white dark:fill-gray-200" />
          <circle cx="102" cy="60" r="5" className="fill-white dark:fill-gray-200" />
          {/* Eyes */}
          <circle cx="88" cy="60" r="2" className="fill-gray-800" />
          <circle cx="102" cy="60" r="2" className="fill-gray-800" />
          {/* Nose */}
          <circle cx="95" cy="67" r="2" className="fill-gray-800" />
          {/* Ears */}
          <circle cx="82" cy="48" r="6" className="fill-red-600 dark:fill-red-700" />
          <circle cx="108" cy="48" r="6" className="fill-red-600 dark:fill-red-700" />
          {/* Fluffy tail */}
          <ellipse cx="25" cy="95" rx="22" ry="12" className="fill-red-600 dark:fill-red-700" transform="rotate(-20, 25, 95)" />
          {/* Fur marks on tail */}
          <line x1="15" y1="90" x2="35" y2="90" className="stroke-amber-400" strokeWidth="2" />
          <line x1="12" y1="97" x2="38" y2="97" className="stroke-amber-400" strokeWidth="2" />
          {/* Legs */}
          <rect x="45" y="108" width="12" height="20" rx="3" className="fill-gray-800 dark:fill-gray-900" />
          <rect x="75" y="108" width="12" height="20" rx="3" className="fill-gray-800 dark:fill-gray-900" />
          {/* Fur texture lines */}
          {[0, 1, 2, 3].map(i => (
            <line key={i} x1={45 + i * 12} y1={75} x2={48 + i * 12} y2={70}
              className="stroke-red-700 dark:stroke-red-400" strokeWidth="1" opacity="0.5" />
          ))}
          {/* Label */}
          <text x="65" y="150" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Red Panda</text>
          <text x="65" y="165" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">Dense thick fur</text>
          <text x="65" y="178" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">→ Warmth</text>
        </g>

        {/* Arrow marker */}
        <defs>
          <marker id="adaptArrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" className="fill-gray-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
