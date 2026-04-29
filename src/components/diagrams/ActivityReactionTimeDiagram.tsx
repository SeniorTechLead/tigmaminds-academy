export default function ActivityReactionTimeDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 340"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Step-by-step instructions for the ruler-drop reaction time test"
      >
        <defs>
          <marker id="art-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        <rect width="500" height="340" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Ruler-Drop Reaction Time Test
        </text>

        {/* Step 1: Setup */}
        <rect x="20" y="45" width="140" height="180" rx="6"
          className="fill-blue-50 dark:fill-blue-950/30 stroke-blue-300 dark:stroke-blue-600" strokeWidth="1" />
        <text x="90" y="65" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-300">Step 1: Setup</text>

        {/* Ruler held at top */}
        <rect x="82" y="80" width="8" height="120" rx="2"
          className="fill-amber-300 dark:fill-amber-600" />
        {/* cm markings */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <line x1="90" y1={80 + i * 20} x2="96" y2={80 + i * 20}
              className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="0.5" />
            <text x="100" y={84 + i * 20} fontFamily="system-ui, sans-serif"
              fontSize="7" className="fill-slate-400 dark:fill-slate-500">{i * 5}</text>
          </g>
        ))}
        {/* Hand holding top */}
        <ellipse cx="86" cy="78" rx="15" ry="8"
          className="fill-orange-200 dark:fill-orange-800 stroke-orange-400" strokeWidth="1" />
        <text x="90" y="215" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="8" className="fill-slate-500 dark:fill-slate-400">Partner holds ruler</text>

        {/* Step 2: Ready */}
        <rect x="175" y="45" width="140" height="180" rx="6"
          className="fill-green-50 dark:fill-green-950/30 stroke-green-300 dark:stroke-green-600" strokeWidth="1" />
        <text x="245" y="65" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-green-600 dark:fill-green-300">Step 2: Ready</text>

        {/* Ruler with hand open at bottom */}
        <rect x="237" y="80" width="8" height="120" rx="2"
          className="fill-amber-300 dark:fill-amber-600" />
        {/* Open fingers at 0 mark */}
        <path d="M 225,200 Q 230,195 241,200" fill="none"
          className="stroke-orange-400 dark:stroke-orange-500" strokeWidth="2" />
        <path d="M 251,200 Q 260,195 265,200" fill="none"
          className="stroke-orange-400 dark:stroke-orange-500" strokeWidth="2" />
        <text x="245" y="215" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="8" className="fill-slate-500 dark:fill-slate-400">Fingers at 0 cm mark</text>

        {/* Step 3: Catch */}
        <rect x="330" y="45" width="150" height="180" rx="6"
          className="fill-purple-50 dark:fill-purple-950/30 stroke-purple-300 dark:stroke-purple-600" strokeWidth="1" />
        <text x="405" y="65" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-purple-600 dark:fill-purple-300">Step 3: Catch!</text>

        {/* Ruler dropped further, fingers closed */}
        <rect x="397" y="105" width="8" height="100" rx="2"
          className="fill-amber-300 dark:fill-amber-600" />
        {/* Arrow showing drop */}
        <line x1="415" y1="80" x2="415" y2="110" stroke="#f59e0b" strokeWidth="2"
          markerEnd="url(#art-arrow)" />
        <text x="430" y="100" fontFamily="system-ui, sans-serif" fontSize="8"
          className="fill-amber-500 dark:fill-amber-400">dropped!</text>
        {/* Closed fingers */}
        <ellipse cx="401" cy="175" rx="12" ry="7"
          className="fill-orange-200 dark:fill-orange-800 stroke-orange-400" strokeWidth="1.5" />
        <text x="401" y="200" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="8" className="fill-slate-500 dark:fill-slate-400">Caught at 18 cm</text>

        {/* Formula section */}
        <rect x="20" y="240" width="460" height="85" rx="8"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="250" y="262" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-200">
          Convert Distance to Reaction Time
        </text>
        <text x="250" y="282" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="700" fontFamily="monospace"
          className="fill-purple-600 dark:fill-purple-300">
          t = √(2d / g)
        </text>
        <text x="250" y="300" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-600 dark:fill-slate-300">
          d = distance fallen (m) | g = 9.8 m/s² | t = reaction time (s)
        </text>
        <text x="250" y="316" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-300">
          18 cm → t = √(2 × 0.18 / 9.8) = 0.19 seconds — average human reaction time!
        </text>
      </svg>
    </div>
  );
}
