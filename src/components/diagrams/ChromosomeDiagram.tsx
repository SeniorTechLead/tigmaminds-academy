export default function ChromosomeDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 500 200" className="w-full max-w-lg mx-auto" role="img" aria-label="DNA to chromatin to chromosome hierarchy diagram">
        {/* Title */}
        <text x="250" y="16" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">DNA Packaging: Three Levels of Coiling</text>

        {/* Level 1: DNA double helix */}
        <g>
          <rect x="10" y="30" width="140" height="130" rx="8" className="fill-blue-50 dark:fill-blue-950" stroke="#3b82f6" strokeWidth="1" />
          <text x="80" y="48" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="12" fontWeight="600">DNA Double Helix</text>
          {/* Double helix representation */}
          <path d="M 40,65 Q 60,70 80,65 Q 100,60 120,65 Q 100,70 80,75 Q 60,80 40,75 Q 60,70 80,65" className="stroke-red-400" strokeWidth="2" fill="none" />
          <path d="M 40,75 Q 60,80 80,75 Q 100,70 120,75 Q 100,80 80,85 Q 60,90 40,85 Q 60,80 80,75" className="stroke-blue-400" strokeWidth="2" fill="none" />
          <path d="M 40,85 Q 60,90 80,85 Q 100,80 120,85 Q 100,90 80,95 Q 60,100 40,95 Q 60,90 80,85" className="stroke-red-400" strokeWidth="2" fill="none" />
          <path d="M 40,95 Q 60,100 80,95 Q 100,90 120,95 Q 100,100 80,105 Q 60,110 40,105 Q 60,100 80,95" className="stroke-blue-400" strokeWidth="2" fill="none" />
          {/* Rungs */}
          {[68, 78, 88, 98].map((y, i) => (
            <line key={i} x1={55} y1={y} x2={105} y2={y} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
          ))}
          {/* Base pair labels */}
          <text x="65" y="124" className="fill-red-500" fontSize="10">A-T</text>
          <text x="95" y="124" className="fill-blue-500" fontSize="10">G-C</text>
          <text x="80" y="148" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">2 nm wide</text>
        </g>

        {/* Arrow 1 */}
        <g>
          <line x1="155" y1="100" x2="175" y2="100" className="stroke-gray-400" strokeWidth="1.5" markerEnd="url(#chr-arrow)" />
          <text x="165" y="92" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">coils</text>
        </g>

        {/* Level 2: Chromatin (beads on string) */}
        <g>
          <rect x="180" y="30" width="140" height="130" rx="8" className="fill-green-50 dark:fill-green-950" stroke="#22c55e" strokeWidth="1" />
          <text x="250" y="48" textAnchor="middle" className="fill-green-600 dark:fill-green-300" fontSize="12" fontWeight="600">Chromatin</text>
          <text x="250" y="60" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(beads on a string)</text>
          {/* Histone beads with DNA wrapped around */}
          {[
            { cx: 210, cy: 80 },
            { cx: 240, cy: 90 },
            { cx: 270, cy: 80 },
            { cx: 210, cy: 110 },
            { cx: 240, cy: 120 },
            { cx: 270, cy: 110 },
          ].map((pos, i) => (
            <g key={i}>
              <circle cx={pos.cx} cy={pos.cy} r="10" className="fill-amber-300 dark:fill-amber-600" stroke="#d97706" strokeWidth="1" />
            </g>
          ))}
          {/* Connecting DNA string */}
          <path d="M 220,80 Q 230,75 240,80 Q 250,85 260,80 M 270,90 Q 260,100 250,100 Q 230,100 220,100 M 210,100 Q 220,105 230,110 Q 240,115 250,110 Q 260,105 270,110"
            className="stroke-red-400" strokeWidth="1.5" fill="none" />
          <text x="250" y="148" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">11 nm (histones)</text>
        </g>

        {/* Arrow 2 */}
        <g>
          <line x1="325" y1="100" x2="345" y2="100" className="stroke-gray-400" strokeWidth="1.5" markerEnd="url(#chr-arrow)" />
          <text x="335" y="92" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">folds</text>
        </g>

        {/* Level 3: Chromosome */}
        <g>
          <rect x="350" y="30" width="140" height="130" rx="8" className="fill-purple-50 dark:fill-purple-950" stroke="#a855f7" strokeWidth="1" />
          <text x="420" y="48" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="12" fontWeight="600">Chromosome</text>
          {/* X-shaped chromosome */}
          <path d="M 395,65 Q 410,90 395,115 Q 405,105 420,115 Q 410,90 420,65 Q 410,75 395,65 Z"
            className="fill-purple-400 dark:fill-purple-500" stroke="#7e22ce" strokeWidth="1.5" />
          {/* Centromere */}
          <ellipse cx="407" cy="90" rx="6" ry="4" className="fill-purple-700 dark:fill-purple-300" />
          <text x="440" y="92" className="fill-gray-500 dark:fill-gray-400" fontSize="10">centromere</text>
          <line x1="413" y1="90" x2="437" y2="90" className="stroke-gray-400" strokeWidth="0.8" />
          {/* Sister chromatids label */}
          <text x="420" y="148" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">700 nm (condensed)</text>
        </g>

        {/* Zoom label */}
        <text x="250" y="185" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11">Each level is more tightly packed than the last</text>

        <defs>
          <marker id="chr-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" className="fill-gray-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
