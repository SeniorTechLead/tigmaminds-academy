export default function Volume3DDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 540 250" className="w-full max-w-xl mx-auto" role="img" aria-label="Four 3D shapes with volume formulas: cube, cylinder, sphere, and cone">
        <text x="270" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Volume of 3D Shapes</text>

        {/* Cube */}
        <g>
          {/* Front face */}
          <rect x="25" y="75" width="60" height="60" className="fill-blue-200 dark:fill-blue-800 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
          {/* Top face */}
          <polygon points="25,75 50,55 110,55 85,75" className="fill-blue-100 dark:fill-blue-700 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
          {/* Right face */}
          <polygon points="85,75 110,55 110,115 85,135" className="fill-blue-300 dark:fill-blue-900 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />

          {/* Dimension label s */}
          <text x="55" y="148" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">s</text>
          <line x1="25" y1="140" x2="85" y2="140" className="stroke-blue-400" strokeWidth="1" markerStart="url(#volBar)" markerEnd="url(#volBar)" />

          <text x="65" y="175" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="12" fontWeight="bold">Cube</text>
          <text x="65" y="190" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">V = s³</text>
        </g>

        {/* Cylinder */}
        <g>
          {/* Body */}
          <rect x="155" y="65" width="60" height="70" className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" />
          {/* Top ellipse */}
          <ellipse cx="185" cy="65" rx="30" ry="10" className="fill-emerald-100 dark:fill-emerald-700 stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" />
          {/* Bottom ellipse */}
          <ellipse cx="185" cy="135" rx="30" ry="10" className="fill-emerald-300 dark:fill-emerald-900 stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" />

          {/* Radius */}
          <line x1="185" y1="65" x2="215" y2="65" className="stroke-red-400" strokeWidth="1" strokeDasharray="3,2" />
          <text x="200" y="58" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10">r</text>
          {/* Height */}
          <line x1="222" y1="65" x2="222" y2="135" className="stroke-red-400" strokeWidth="1" markerStart="url(#volBarR)" markerEnd="url(#volBarR)" />
          <text x="230" y="105" className="fill-red-500 dark:fill-red-400" fontSize="10">h</text>

          <text x="185" y="175" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="12" fontWeight="bold">Cylinder</text>
          <text x="185" y="190" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">V = πr²h</text>
        </g>

        {/* Sphere */}
        <g>
          <circle cx="315" cy="100" r="40" className="fill-purple-200 dark:fill-purple-800 stroke-purple-500 dark:stroke-purple-400" strokeWidth="1.5" />
          {/* Equator ellipse */}
          <ellipse cx="315" cy="100" rx="40" ry="12" fill="none" className="stroke-purple-400 dark:stroke-purple-500" strokeWidth="1" strokeDasharray="3,2" />
          {/* Radius */}
          <line x1="315" y1="100" x2="355" y2="100" className="stroke-red-400" strokeWidth="1.5" />
          <text x="338" y="95" className="fill-red-500 dark:fill-red-400" fontSize="10">r</text>
          <circle cx="315" cy="100" r="2" className="fill-red-400" />

          <text x="315" y="175" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="12" fontWeight="bold">Sphere</text>
          <text x="315" y="190" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">V = ⁴⁄₃πr³</text>
        </g>

        {/* Cone */}
        <g>
          {/* Cone body (triangle) */}
          <polygon points="445,60 415,135 475,135" className="fill-amber-200 dark:fill-amber-800 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
          {/* Base ellipse */}
          <ellipse cx="445" cy="135" rx="30" ry="10" className="fill-amber-300 dark:fill-amber-900 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
          {/* Apex point */}
          <circle cx="445" cy="60" r="2" className="fill-amber-600" />

          {/* Radius */}
          <line x1="445" y1="135" x2="475" y2="135" className="stroke-red-400" strokeWidth="1" strokeDasharray="3,2" />
          <text x="462" y="150" className="fill-red-500 dark:fill-red-400" fontSize="10">r</text>
          {/* Height */}
          <line x1="482" y1="60" x2="482" y2="135" className="stroke-red-400" strokeWidth="1" markerStart="url(#volBarR)" markerEnd="url(#volBarR)" />
          <text x="490" y="100" className="fill-red-500 dark:fill-red-400" fontSize="10">h</text>

          <text x="445" y="175" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="12" fontWeight="bold">Cone</text>
          <text x="445" y="190" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">V = ⅓πr²h</text>
        </g>

        {/* Note */}
        <text x="270" y="215" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">A cone is exactly ⅓ the volume of a cylinder with the same base and height</text>

        <defs>
          <marker id="volBar" markerWidth="6" markerHeight="8" refX="3" refY="4" orient="auto">
            <line x1="0" y1="4" x2="6" y2="4" className="stroke-blue-400" strokeWidth="1.5" />
          </marker>
          <marker id="volBarR" markerWidth="6" markerHeight="8" refX="3" refY="4" orient="auto">
            <line x1="0" y1="4" x2="6" y2="4" className="stroke-red-400" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
