export default function EyeAnatomyDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 322" className="w-full max-w-lg mx-auto" role="img" aria-label="Human eye anatomy cross-section">
        {/* Outer eye shape (sclera) */}
        <ellipse cx="220" cy="150" rx="160" ry="110" className="fill-gray-100 dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-500" strokeWidth="2" />

        {/* Vitreous humor */}
        <ellipse cx="230" cy="150" rx="140" ry="95" className="fill-sky-50 dark:fill-sky-950" opacity="0.6" />

        {/* Retina (inner lining) */}
        <path d="M 100,70 Q 370,70 380,150 Q 370,230 100,230" fill="none" className="stroke-rose-400 dark:stroke-rose-500" strokeWidth="3" />

        {/* Cornea */}
        <path d="M 80,70 Q 40,150 80,230" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="3" />

        {/* Iris */}
        <ellipse cx="105" cy="150" rx="12" ry="40" className="fill-amber-600 dark:fill-amber-500" opacity="0.7" />

        {/* Pupil */}
        <ellipse cx="105" cy="150" rx="6" ry="18" className="fill-gray-900 dark:fill-gray-950" />

        {/* Lens */}
        <ellipse cx="130" cy="150" rx="15" ry="35" className="fill-blue-200/50 dark:fill-blue-400/20 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Optic nerve */}
        <path d="M 378,150 L 430,155 Q 445,156 445,165 L 440,195" fill="none" className="stroke-yellow-600 dark:stroke-yellow-400" strokeWidth="5" strokeLinecap="round" />
        <circle cx="378" cy="150" r="8" className="fill-yellow-200 dark:fill-yellow-800 stroke-yellow-600 dark:stroke-yellow-400" strokeWidth="1.5" />

        {/* Light rays */}
        {[-20, 0, 20].map((offset, i) => (
          <line key={i} x1="5" y1={150 + offset * 1.5} x2="100" y2={150 + offset * 0.3}
            className="stroke-yellow-400 dark:stroke-yellow-500" strokeWidth="1.5" strokeDasharray="4,3">
            <animate attributeName="stroke-dashoffset" from="14" to="0" dur="1.5s" repeatCount="indefinite" />
          </line>
        ))}
        {/* Light converging on retina */}
        {[-20, 0, 20].map((offset, i) => (
          <line key={`r-${i}`} x1="145" y1={150 + offset * 0.2} x2="340" y2="150"
            className="stroke-yellow-400 dark:stroke-yellow-500" strokeWidth="1" opacity="0.6" />
        ))}
        {/* Focal point on retina */}
        <circle cx="340" cy="150" r="4" className="fill-yellow-400">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Labels */}
        {/* Cornea */}
        <line x1="60" y1="85" x2="25" y2="55" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="22" y="48" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="600">Cornea</text>

        {/* Iris */}
        <line x1="105" y1="105" x2="105" y2="42" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="105" y="36" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="11" fontWeight="600">Iris</text>

        {/* Pupil */}
        <line x1="105" y1="195" x2="105" y2="260" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="105" y="272" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Pupil</text>

        {/* Lens */}
        <line x1="145" y1="115" x2="165" y2="42" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="165" y="36" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="11" fontWeight="600">Lens</text>

        {/* Vitreous humor */}
        <text x="240" y="200" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400" fontSize="10">Vitreous humor</text>

        {/* Retina */}
        <line x1="360" y1="100" x2="390" y2="55" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="390" y="48" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400" fontSize="11" fontWeight="600">Retina</text>

        {/* Optic nerve */}
        <text x="440" y="215" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400" fontSize="10" fontWeight="600">Optic</text>
        <text x="440" y="226" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400" fontSize="10" fontWeight="600">nerve</text>

        {/* Light label */}
        <text x="12" y="140" className="fill-yellow-600 dark:fill-yellow-400" fontSize="10" fontWeight="600">Light</text>

        {/* Focus label */}
        <text x="320" y="170" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400" fontSize="10">Focal point</text>
      </svg>
    </div>
  );
}
