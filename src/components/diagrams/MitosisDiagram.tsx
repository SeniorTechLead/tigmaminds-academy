export default function MitosisDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 540 200" className="w-full max-w-xl mx-auto" role="img" aria-label="Mitosis stages diagram">
        {/* Title */}
        <text x="270" y="16" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Stages of Mitosis</text>

        {/* Prophase */}
        <g>
          <ellipse cx="70" cy="110" rx="55" ry="55" className="fill-blue-100 dark:fill-blue-900" stroke="#3b82f6" strokeWidth="2" />
          {/* Condensing chromosomes */}
          <path d="M 55,85 Q 60,95 55,105" className="stroke-red-500" strokeWidth="3" fill="none" />
          <path d="M 70,80 Q 75,95 70,110" className="stroke-red-500" strokeWidth="3" fill="none" />
          <path d="M 85,85 Q 80,100 85,115" className="stroke-red-500" strokeWidth="3" fill="none" />
          <path d="M 60,115 Q 70,120 80,115" className="stroke-orange-500" strokeWidth="3" fill="none" />
          {/* Nuclear envelope breaking */}
          <path d="M 20,85 Q 15,110 20,135" className="stroke-blue-400" strokeWidth="1.5" strokeDasharray="4,3" fill="none" />
          <path d="M 120,85 Q 125,110 120,135" className="stroke-blue-400" strokeWidth="1.5" strokeDasharray="4,3" fill="none" />
          <text x="70" y="178" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="12" fontWeight="600">Prophase</text>
          <text x="70" y="192" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Chromosomes condense</text>
        </g>

        {/* Arrow */}
        <text x="137" y="113" className="fill-gray-400" fontSize="18">→</text>

        {/* Metaphase */}
        <g>
          <ellipse cx="205" cy="110" rx="55" ry="55" className="fill-green-100 dark:fill-green-900" stroke="#22c55e" strokeWidth="2" />
          {/* Chromosomes at metaphase plate */}
          <line x1="205" y1="60" x2="205" y2="160" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="3,3" />
          {/* X-shaped chromosomes lined up */}
          <g className="stroke-red-500" strokeWidth="2.5" fill="none">
            <path d="M 200,80 L 210,90 M 210,80 L 200,90" />
            <path d="M 200,97 L 210,107 M 210,97 L 200,107" />
            <path d="M 200,114 L 210,124 M 210,114 L 200,124" />
            <path d="M 200,131 L 210,141 M 210,131 L 200,141" />
          </g>
          {/* Spindle fibers */}
          <line x1="175" y1="70" x2="200" y2="85" className="stroke-purple-300 dark:stroke-purple-500" strokeWidth="0.8" />
          <line x1="175" y1="70" x2="200" y2="105" className="stroke-purple-300 dark:stroke-purple-500" strokeWidth="0.8" />
          <line x1="235" y1="70" x2="210" y2="85" className="stroke-purple-300 dark:stroke-purple-500" strokeWidth="0.8" />
          <line x1="235" y1="70" x2="210" y2="105" className="stroke-purple-300 dark:stroke-purple-500" strokeWidth="0.8" />
          <text x="205" y="178" textAnchor="middle" className="fill-green-600 dark:fill-green-300" fontSize="12" fontWeight="600">Metaphase</text>
          <text x="205" y="192" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Line up at center</text>
        </g>

        {/* Arrow */}
        <text x="272" y="113" className="fill-gray-400" fontSize="18">→</text>

        {/* Anaphase */}
        <g>
          <ellipse cx="340" cy="110" rx="55" ry="55" className="fill-yellow-100 dark:fill-yellow-900" stroke="#eab308" strokeWidth="2" />
          {/* Chromosomes pulling apart to left */}
          <g className="stroke-red-500" strokeWidth="2.5" fill="none">
            <path d="M 318,85 L 318,92" />
            <path d="M 322,100 L 322,107" />
            <path d="M 318,115 L 318,122" />
            <path d="M 322,130 L 322,137" />
          </g>
          {/* Chromosomes pulling apart to right */}
          <g className="stroke-orange-500" strokeWidth="2.5" fill="none">
            <path d="M 358,85 L 358,92" />
            <path d="M 362,100 L 362,107" />
            <path d="M 358,115 L 358,122" />
            <path d="M 362,130 L 362,137" />
          </g>
          {/* Arrows showing movement */}
          <text x="310" y="78" className="fill-gray-400" fontSize="10">←</text>
          <text x="365" y="78" className="fill-gray-400" fontSize="10">→</text>
          <text x="340" y="178" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-300" fontSize="12" fontWeight="600">Anaphase</text>
          <text x="340" y="192" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Pull apart</text>
        </g>

        {/* Arrow */}
        <text x="407" y="113" className="fill-gray-400" fontSize="18">→</text>

        {/* Telophase */}
        <g>
          <ellipse cx="455" cy="110" rx="22" ry="48" className="fill-purple-100 dark:fill-purple-900" stroke="#a855f7" strokeWidth="2" />
          <ellipse cx="495" cy="110" rx="22" ry="48" className="fill-purple-100 dark:fill-purple-900" stroke="#a855f7" strokeWidth="2" />
          {/* Chromosomes in each nucleus */}
          <g className="stroke-red-500" strokeWidth="2" fill="none">
            <path d="M 450,95 L 450,105" />
            <path d="M 460,100 L 460,110" />
            <path d="M 455,115 L 455,125" />
          </g>
          <g className="stroke-orange-500" strokeWidth="2" fill="none">
            <path d="M 490,95 L 490,105" />
            <path d="M 500,100 L 500,110" />
            <path d="M 495,115 L 495,125" />
          </g>
          {/* Cleavage furrow */}
          <line x1="475" y1="62" x2="475" y2="158" className="stroke-purple-400" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="475" y="178" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="12" fontWeight="600">Telophase</text>
          <text x="475" y="192" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Two nuclei form</text>
        </g>
      </svg>
    </div>
  );
}
