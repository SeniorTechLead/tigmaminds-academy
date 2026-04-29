export default function WorkForceDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 490 290" className="w-full max-w-2xl mx-auto" role="img" aria-label="Work and force diagram showing a person pushing a box with force vector, displacement, and angle theta">
        {/* Ground */}
        <line x1="30" y1="185" x2="420" y2="185" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="2" />
        {/* Ground hatching */}
        {Array.from({ length: 20 }, (_, i) => (
          <line key={i} x1={35 + i * 20} y1="185" x2={45 + i * 20} y2="195" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        ))}

        {/* Box */}
        <rect x="200" y="135" width="50" height="50" rx="4" className="fill-amber-200 dark:fill-amber-800 stroke-amber-500" strokeWidth="2" />
        <text x="225" y="165" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="12" fontWeight="bold">Box</text>

        {/* Person (stick figure) */}
        <circle cx="135" cy="105" r="12" fill="none" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="135" y1="117" x2="135" y2="155" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="135" y1="155" x2="120" y2="183" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="135" y1="155" x2="150" y2="183" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />
        {/* Arms pushing */}
        <line x1="135" y1="130" x2="195" y2="150" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />

        {/* Force vector (at an angle) */}
        <line x1="200" y1="155" x2="310" y2="120" className="stroke-red-500 dark:stroke-red-400" strokeWidth="3" markerEnd="url(#wfArrowR)" />
        <text x="270" y="118" className="fill-red-600 dark:fill-red-400" fontSize="13" fontWeight="bold">F</text>

        {/* Displacement vector (horizontal) */}
        <line x1="200" y1="205" x2="350" y2="205" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" markerEnd="url(#wfArrowB)" />
        <text x="275" y="222" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="12" fontWeight="bold">d (displacement)</text>

        {/* Horizontal component of force (dashed) */}
        <line x1="200" y1="155" x2="310" y2="155" className="stroke-red-300 dark:stroke-red-500" strokeWidth="1.5" strokeDasharray="5,3" />
        <text x="255" y="152" textAnchor="middle" className="fill-red-400 dark:fill-red-300" fontSize="10">F cos θ</text>

        {/* Angle arc */}
        <path d="M 240,155 A 40,40 0 0,0 248,142" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
        <text x="250" y="150" className="fill-emerald-600 dark:fill-emerald-400" fontSize="13" fontWeight="bold">θ</text>

        {/* Formula box */}
        <rect x="280" y="35" width="160" height="65" rx="8" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1.5" />
        <text x="360" y="55" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Work Done</text>
        <text x="360" y="78" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100" fontSize="16" fontWeight="bold">W = F d cos θ</text>
        <text x="360" y="93" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">measured in Joules (J)</text>

        {/* Key points */}
        <text x="225" y="240" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Only the component of force in the direction of motion does work
        </text>

        <defs>
          <marker id="wfArrowR" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-red-500 dark:fill-red-400" />
          </marker>
          <marker id="wfArrowB" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
