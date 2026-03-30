export default function GeoMountainGrowthDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 400" className="w-full max-w-xl mx-auto" role="img" aria-label="Himalaya collision diagram showing Indian plate crashing into Eurasian plate with height gain rate">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          How the Himalayas Grow — Plate Collision
        </text>

        {/* Sky */}
        <rect x="0" y="28" width="520" height="72" className="fill-sky-100 dark:fill-sky-900/30" />

        {/* Snow caps */}
        <path d="M 200,100 L 230,55 L 260,100 Z" className="fill-white dark:fill-gray-200" />
        <path d="M 245,100 L 280,42 L 315,100 Z" className="fill-white dark:fill-gray-200" />
        <path d="M 290,100 L 320,60 L 350,100 Z" className="fill-white dark:fill-gray-200" />

        {/* Mountain range (Himalayas) */}
        <path d="M 120,180 L 180,110 L 220,130 L 230,55 L 260,100 L 280,42 L 320,60 L 350,100 L 370,120 L 420,180 Z"
          className="fill-stone-400 dark:fill-stone-600" />
        <path d="M 120,180 L 180,130 L 230,100 L 280,75 L 320,95 L 370,130 L 420,180 Z"
          className="fill-stone-500 dark:fill-stone-500" opacity="0.5" />

        {/* Height annotation */}
        <line x1="450" y1="42" x2="450" y2="180" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
        <line x1="440" y1="42" x2="460" y2="42" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
        <line x1="440" y1="180" x2="460" y2="180" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
        <text x="468" y="105" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">8,849 m</text>
        <text x="468" y="118" className="fill-red-600 dark:fill-red-400" fontSize="10">(Everest)</text>

        {/* Growth arrow */}
        <line x1="280" y1="32" x2="280" y2="18" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#arrowGreen)" />
        <text x="296" y="28" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="bold">+1 cm/yr</text>
        <defs>
          <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0,0 L 8,3 L 0,6 Z" className="fill-emerald-500" />
          </marker>
          <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0,0 L 8,3 L 0,6 Z" className="fill-blue-500" />
          </marker>
          <marker id="arrowOrange" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M 8,0 L 0,3 L 8,6 Z" className="fill-orange-500" />
          </marker>
        </defs>

        {/* Ground level */}
        <rect x="0" y="180" width="520" height="10" className="fill-green-300 dark:fill-green-700" />

        {/* Crust layers */}
        {/* Eurasian plate (left) */}
        <rect x="0" y="190" width="260" height="50" className="fill-amber-200 dark:fill-amber-800" />
        <text x="80" y="220" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="11" fontWeight="bold">
          EURASIAN PLATE
        </text>

        {/* Indian plate (right) — subducting under */}
        <rect x="260" y="190" width="260" height="50" className="fill-orange-200 dark:fill-orange-800" />
        <text x="400" y="220" textAnchor="middle" className="fill-orange-800 dark:fill-orange-200" fontSize="11" fontWeight="bold">
          INDIAN PLATE
        </text>

        {/* Collision zone */}
        <path d="M 240,190 L 260,240 L 280,190 Z" className="fill-red-400 dark:fill-red-600" opacity="0.5" />

        {/* Movement arrows */}
        <line x1="350" y1="215" x2="290" y2="215" className="stroke-orange-500" strokeWidth="2.5" markerEnd="url(#arrowOrange)" />
        <text x="310" y="212" textAnchor="middle" className="fill-orange-600 dark:fill-orange-400" fontSize="10">5 cm/yr →</text>

        {/* Mantle */}
        <rect x="0" y="240" width="520" height="60" className="fill-red-200 dark:fill-red-900/40" />
        {/* Convection arrows */}
        <path d="M 80,290 Q 80,255 130,255 Q 180,255 180,290" fill="none" className="stroke-red-400 dark:stroke-red-500" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />
        <path d="M 340,290 Q 340,255 390,255 Q 440,255 440,290" fill="none" className="stroke-red-400 dark:stroke-red-500" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />
        <text x="260" y="275" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="bold">
          MANTLE (slowly flowing rock)
        </text>

        {/* Timeline box */}
        <rect x="20" y="310" width="480" height="80" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="330" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="11" fontWeight="bold">
          50 Million Years of Collision
        </text>
        <text x="260" y="348" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          India broke from Africa ~130 Mya, drifted north at 15 cm/yr, and slammed into Asia ~50 Mya.
        </text>
        <text x="260" y="364" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          The collision crumpled the crust upward — forming the Himalayas, still rising at ~1 cm/year.
        </text>
        <text x="260" y="380" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Erosion removes ~0.5 cm/yr, so net growth is about 0.5 cm/yr — 50 m per 10,000 years.
        </text>
      </svg>
    </div>
  );
}
