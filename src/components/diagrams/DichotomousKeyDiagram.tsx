export default function DichotomousKeyDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 340" className="w-full max-w-2xl mx-auto" role="img" aria-label="Dichotomous key for NE India animals">
        {/* Title */}
        <text x="250" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Dichotomous Key: Identify NE India Animals
        </text>

        {/* Question 1: Does it have hooves? */}
        <rect x="155" y="35" width="190" height="32" rx="8"
          className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />
        <text x="250" y="56" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">
          Does it have hooves?
        </text>

        {/* Yes branch (left) */}
        <line x1="210" y1="67" x2="130" y2="105" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
        <text x="155" y="85" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="bold">Yes</text>

        {/* No branch (right) */}
        <line x1="290" y1="67" x2="370" y2="105" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x="340" y="85" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">No</text>

        {/* Question 2a: Horn or antlers? */}
        <rect x="35" y="105" width="190" height="32" rx="8"
          className="fill-purple-100 dark:fill-purple-900/40 stroke-purple-400 dark:stroke-purple-500" strokeWidth="1.5" />
        <text x="130" y="126" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="11" fontWeight="bold">
          Horn or antlers?
        </text>

        {/* Question 2b: Can it fly? */}
        <rect x="275" y="105" width="190" height="32" rx="8"
          className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400 dark:stroke-amber-500" strokeWidth="1.5" />
        <text x="370" y="126" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">
          Can it fly?
        </text>

        {/* Horn branch */}
        <line x1="85" y1="137" x2="55" y2="175" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
        <text x="55" y="160" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Horn</text>

        {/* Antlers branch */}
        <line x1="175" y1="137" x2="205" y2="175" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x="198" y="160" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Antlers</text>

        {/* Yes fly branch */}
        <line x1="325" y1="137" x2="295" y2="175" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
        <text x="295" y="160" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="bold">Yes</text>

        {/* No fly branch */}
        <line x1="415" y1="137" x2="445" y2="175" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x="440" y="160" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">No</text>

        {/* Result: Rhino */}
        <g transform="translate(5, 180)">
          <rect x="0" y="0" width="100" height="55" rx="10"
            className="fill-gray-200 dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
          {/* Simple rhino icon */}
          <ellipse cx="50" cy="20" rx="25" ry="12" className="fill-gray-400 dark:fill-gray-500" />
          <polygon points="70,14 75,5 78,14" className="fill-gray-600 dark:fill-gray-300" />
          <text x="50" y="46" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Rhino</text>
        </g>

        {/* Result: Deer */}
        <g transform="translate(155, 180)">
          <rect x="0" y="0" width="100" height="55" rx="10"
            className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400 dark:stroke-amber-500" strokeWidth="1.5" />
          {/* Simple deer icon */}
          <ellipse cx="50" cy="22" rx="18" ry="10" className="fill-amber-300 dark:fill-amber-600" />
          <line x1="42" y1="13" x2="35" y2="3" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
          <line x1="35" y1="3" x2="30" y2="7" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
          <line x1="58" y1="13" x2="65" y2="3" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
          <line x1="65" y1="3" x2="70" y2="7" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
          <text x="50" y="46" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">Deer</text>
        </g>

        {/* Result: Hornbill */}
        <g transform="translate(245, 180)">
          <rect x="0" y="0" width="100" height="55" rx="10"
            className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="1.5" />
          {/* Simple bird icon */}
          <ellipse cx="50" cy="20" rx="15" ry="12" className="fill-emerald-300 dark:fill-emerald-600" />
          <polygon points="65,17 80,15 65,20" className="fill-amber-500 dark:fill-amber-400" />
          {/* Casque on beak */}
          <path d="M 65,14 Q 72,8 78,12" fill="none" className="stroke-amber-600" strokeWidth="2" />
          {/* Wing */}
          <path d="M 40,18 Q 30,8 38,5" fill="none" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />
          <text x="50" y="46" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="11" fontWeight="bold">Hornbill</text>
        </g>

        {/* Result: Tiger */}
        <g transform="translate(395, 180)">
          <rect x="0" y="0" width="100" height="55" rx="10"
            className="fill-orange-100 dark:fill-orange-900/30 stroke-orange-400 dark:stroke-orange-500" strokeWidth="1.5" />
          {/* Simple tiger icon */}
          <ellipse cx="50" cy="20" rx="22" ry="14" className="fill-orange-300 dark:fill-orange-600" />
          {/* Stripes */}
          {[38, 46, 54, 62].map(sx => (
            <line key={sx} x1={sx} y1={12} x2={sx} y2={28}
              className="stroke-orange-700 dark:stroke-orange-300" strokeWidth="1.5" />
          ))}
          {/* Ears */}
          <circle cx="33" cy="9" r="5" className="fill-orange-400 dark:fill-orange-500" />
          <circle cx="67" cy="9" r="5" className="fill-orange-400 dark:fill-orange-500" />
          <text x="50" y="46" textAnchor="middle" className="fill-orange-700 dark:fill-orange-300" fontSize="11" fontWeight="bold">Tiger</text>
        </g>

        {/* Bottom note */}
        <text x="250" y="290" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          A dichotomous key uses yes/no questions to identify organisms
        </text>
      </svg>
    </div>
  );
}
