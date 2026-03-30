export default function PlateBoundaryDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 595 242" className="w-full max-w-2xl mx-auto" role="img" aria-label="Three types of plate boundaries: convergent, divergent, and transform">
        <defs>
          <marker id="pb-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-600 dark:fill-gray-300" />
          </marker>
        </defs>

        {/* --- Panel 1: Convergent --- */}
        <g>
          <rect x="5" y="5" width="170" height="185" rx="6" className="fill-gray-50 dark:fill-gray-800" stroke="#d1d5db" strokeWidth="0.5" />
          <text x="90" y="24" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Convergent</text>

          {/* Ground/crust blocks */}
          <rect x="15" y="100" width="70" height="40" className="fill-amber-700 dark:fill-amber-800" rx="2" />
          <rect x="95" y="100" width="70" height="40" className="fill-amber-600 dark:fill-amber-700" rx="2" />
          <text x="50" y="125" textAnchor="middle" className="fill-amber-100" fontSize="10">Plate A</text>
          <text x="130" y="125" textAnchor="middle" className="fill-amber-100" fontSize="10">Plate B</text>

          {/* Arrows pushing together */}
          <line x1="20" y1="90" x2="60" y2="90" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#pb-arrow)" />
          <line x1="160" y1="90" x2="120" y2="90" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#pb-arrow)" />

          {/* Mountains forming at boundary */}
          <polygon points="80,100 90,60 100,100" className="fill-stone-500 dark:fill-stone-600" />
          <polygon points="70,100 82,70 94,100" className="fill-stone-400 dark:fill-stone-500" />
          <polygon points="86,100 98,65 110,100" className="fill-stone-500 dark:fill-stone-600" />

          {/* Label */}
          <text x="90" y="155" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Plates push together</text>
          <text x="90" y="168" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Mountains form</text>
        </g>

        {/* --- Panel 2: Divergent --- */}
        <g>
          <rect x="185" y="5" width="170" height="185" rx="6" className="fill-gray-50 dark:fill-gray-800" stroke="#d1d5db" strokeWidth="0.5" />
          <text x="270" y="24" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Divergent</text>

          {/* Ground/crust blocks with gap */}
          <rect x="195" y="100" width="60" height="40" className="fill-amber-700 dark:fill-amber-800" rx="2" />
          <rect x="285" y="100" width="60" height="40" className="fill-amber-600 dark:fill-amber-700" rx="2" />
          <text x="225" y="125" textAnchor="middle" className="fill-amber-100" fontSize="10">Plate A</text>
          <text x="315" y="125" textAnchor="middle" className="fill-amber-100" fontSize="10">Plate B</text>

          {/* Arrows pulling apart */}
          <line x1="250" y1="90" x2="210" y2="90" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#pb-arrow)" />
          <line x1="290" y1="90" x2="330" y2="90" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#pb-arrow)" />

          {/* New crust (magma rising) */}
          <rect x="255" y="95" width="30" height="45" rx="2" className="fill-red-500 dark:fill-red-600" />
          <text x="270" y="116" textAnchor="middle" className="fill-red-100" fontSize="9">New</text>
          <text x="270" y="127" textAnchor="middle" className="fill-red-100" fontSize="9">crust</text>

          {/* Rising magma arrow */}
          <line x1="270" y1="145" x2="270" y2="160" className="stroke-red-400" strokeWidth="1.5" />
          <text x="270" y="172" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="9">Magma rises</text>

          {/* Label */}
          <text x="270" y="155" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Plates pull apart</text>
        </g>

        {/* --- Panel 3: Transform --- */}
        <g>
          <rect x="365" y="5" width="170" height="185" rx="6" className="fill-gray-50 dark:fill-gray-800" stroke="#d1d5db" strokeWidth="0.5" />
          <text x="450" y="24" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Transform</text>

          {/* Ground/crust blocks */}
          <rect x="375" y="65" width="60" height="40" className="fill-amber-700 dark:fill-amber-800" rx="2" />
          <rect x="375" y="115" width="60" height="40" className="fill-amber-600 dark:fill-amber-700" rx="2" />
          <rect x="455" y="65" width="60" height="40" className="fill-amber-600 dark:fill-amber-700" rx="2" />
          <rect x="455" y="115" width="60" height="40" className="fill-amber-700 dark:fill-amber-800" rx="2" />

          {/* Boundary line */}
          <line x1="435" y1="60" x2="455" y2="160" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" strokeDasharray="4,3" />

          {/* Arrows sliding past */}
          <line x1="395" y1="60" x2="395" y2="42" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#pb-arrow)" />
          <line x1="495" y1="160" x2="495" y2="178" className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" markerEnd="url(#pb-arrow)" />

          <text x="385" y="92" className="fill-amber-100" fontSize="10">Plate A</text>
          <text x="465" y="140" className="fill-amber-100" fontSize="10">Plate B</text>

          {/* Label */}
          <text x="450" y="192" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Plates slide past</text>
        </g>
      </svg>
    </div>
  );
}
