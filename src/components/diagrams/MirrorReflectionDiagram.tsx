export default function MirrorReflectionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 442 295" className="w-full max-w-2xl mx-auto" role="img" aria-label="Mirror reflection diagram showing incident ray, normal, and reflected ray with equal angles">
        {/* Mirror surface */}
        <rect x="195" y="30" width="10" height="190" rx="2" className="fill-sky-200 dark:fill-sky-800" />
        <rect x="205" y="30" width="6" height="190" rx="1" className="fill-gray-300 dark:fill-gray-600" />
        {/* Hatching behind mirror */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <line key={i} x1="211" y1={35 + i * 20} x2="220" y2={45 + i * 20} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        ))}
        <text x="225" y="130" className="fill-gray-500 dark:fill-gray-400" fontSize="10">mirror</text>

        {/* Normal line (dashed, perpendicular to mirror) */}
        <line x1="60" y1="125" x2="195" y2="125" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="80" y="118" className="fill-gray-500 dark:fill-gray-400" fontSize="10">normal</text>

        {/* Incident ray */}
        <line x1="40" y1="45" x2="195" y2="125" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2.5" markerEnd="url(#mirrorArrow)" />
        <text x="75" y="72" className="fill-amber-600 dark:fill-amber-400" fontSize="11" fontWeight="600">incident ray</text>

        {/* Reflected ray */}
        <line x1="195" y1="125" x2="40" y2="205" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" markerEnd="url(#mirrorArrowB)" />
        <text x="68" y="200" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="600">reflected ray</text>

        {/* Angle of incidence arc */}
        <path d="M 145,125 A 50,50 0 0,1 160,93" fill="none" className="stroke-amber-500" strokeWidth="1.5" />
        <text x="135" y="102" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="11" fontWeight="bold">θᵢ</text>

        {/* Angle of reflection arc */}
        <path d="M 145,125 A 50,50 0 0,0 160,157" fill="none" className="stroke-blue-500" strokeWidth="1.5" />
        <text x="135" y="155" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="bold">θᵣ</text>

        {/* Point of incidence */}
        <circle cx="195" cy="125" r="4" className="fill-red-500" />

        {/* Law text */}
        <rect x="240" y="60" width="145" height="50" rx="8" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="312" y="80" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="bold">Law of Reflection</text>
        <text x="312" y="100" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="13" fontWeight="bold">θᵢ = θᵣ</text>

        <text x="200" y="245" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Angle of incidence always equals angle of reflection</text>

        <defs>
          <marker id="mirrorArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-500 dark:fill-amber-400" />
          </marker>
          <marker id="mirrorArrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
