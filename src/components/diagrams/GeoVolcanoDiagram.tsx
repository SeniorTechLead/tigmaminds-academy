export default function GeoVolcanoDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 420" className="w-full max-w-xl mx-auto" role="img" aria-label="Cross-section of a volcano showing magma chamber, conduit, and eruption">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Volcano Cross-Section — Pressure Cooker Underground
        </text>

        {/* Sky */}
        <rect x="0" y="28" width="520" height="92" className="fill-sky-100 dark:fill-sky-900/30" />

        {/* Eruption plume */}
        <ellipse cx="260" cy="50" rx="50" ry="25" className="fill-gray-300 dark:fill-gray-500" opacity="0.7" />
        <ellipse cx="250" cy="38" rx="35" ry="18" className="fill-gray-400 dark:fill-gray-500" opacity="0.6" />
        <ellipse cx="270" cy="30" rx="25" ry="12" className="fill-gray-400 dark:fill-gray-600" opacity="0.5" />
        <text x="340" y="45" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Ash cloud</text>

        {/* Lava fountain from crater */}
        <path d="M 252,72 Q 245,55 250,65 Q 255,50 260,65 Q 265,48 268,65 Z" className="fill-red-500 dark:fill-red-400" opacity="0.8" />
        <path d="M 255,75 Q 250,60 258,68 Q 262,55 265,70 Z" className="fill-orange-400 dark:fill-orange-500" opacity="0.9" />

        {/* Volcano exterior */}
        <path d="M 80,240 L 240,78 L 260,85 L 280,78 L 440,240 Z" className="fill-stone-500 dark:fill-stone-600" />

        {/* Lava flow on side */}
        <path d="M 310,140 Q 340,170 380,200 Q 400,215 410,230 L 400,235 Q 390,220 370,205 Q 340,180 315,150 Z"
          className="fill-red-500 dark:fill-red-400" opacity="0.7" />
        <text x="405" y="195" className="fill-red-600 dark:fill-red-400" fontSize="10">Lava flow</text>

        {/* Crater */}
        <ellipse cx="260" cy="80" rx="20" ry="6" className="fill-red-700 dark:fill-red-600" />
        <text x="295" y="82" className="fill-gray-700 dark:fill-gray-200" fontSize="10">Crater</text>

        {/* Ground surface */}
        <rect x="0" y="240" width="520" height="8" className="fill-green-300 dark:fill-green-700" />

        {/* Underground layers */}
        <rect x="0" y="248" width="520" height="80" className="fill-amber-100 dark:fill-amber-900/50" />

        {/* Conduit (pipe) inside volcano */}
        <rect x="252" y="85" width="16" height="195" className="fill-red-600 dark:fill-red-500" opacity="0.6" />
        <text x="215" y="180" className="fill-red-700 dark:fill-red-200" fontSize="10" fontWeight="bold">Conduit</text>

        {/* Layers inside volcano (lava and ash) */}
        <path d="M 140,240 Q 180,200 200,180 L 240,120 L 250,85 L 252,85 L 252,240 Z"
          className="fill-stone-400 dark:fill-stone-500" opacity="0.3" />
        <text x="165" y="195" className="fill-stone-700 dark:fill-stone-300" fontSize="10">Old lava</text>
        <text x="165" y="207" className="fill-stone-700 dark:fill-stone-300" fontSize="10">& ash layers</text>

        {/* Magma chamber */}
        <ellipse cx="260" cy="340" rx="110" ry="45" className="fill-red-600 dark:fill-red-500" opacity="0.5" />
        <ellipse cx="260" cy="340" rx="90" ry="35" className="fill-orange-500 dark:fill-orange-600" opacity="0.6" />
        <ellipse cx="260" cy="340" rx="60" ry="22" className="fill-yellow-400 dark:fill-yellow-500" opacity="0.5" />
        <text x="260" y="345" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="11" fontWeight="bold">
          MAGMA CHAMBER
        </text>

        {/* Conduit connecting chamber to crater */}
        <path d="M 252,280 Q 250,310 250,320" fill="none" className="stroke-red-500" strokeWidth="16" opacity="0.4" />
        <path d="M 268,280 Q 270,310 270,320" fill="none" className="stroke-red-500" strokeWidth="0" />

        {/* Labels for underground */}
        <text x="30" y="268" className="fill-amber-700 dark:fill-amber-300" fontSize="10">Crust (rock layers)</text>

        {/* Deep rock below chamber */}
        <rect x="0" y="328" width="520" height="52" className="fill-stone-300 dark:fill-stone-700" opacity="0.4" />

        {/* Gas bubbles in conduit */}
        <circle cx="258" cy="140" r="3" className="fill-yellow-300 dark:fill-yellow-400" opacity="0.8" />
        <circle cx="263" cy="165" r="2" className="fill-yellow-300 dark:fill-yellow-400" opacity="0.7" />
        <circle cx="256" cy="195" r="3.5" className="fill-yellow-300 dark:fill-yellow-400" opacity="0.7" />
        <circle cx="265" cy="230" r="2.5" className="fill-yellow-300 dark:fill-yellow-400" opacity="0.6" />
        <text x="280" y="230" className="fill-yellow-700 dark:fill-yellow-300" fontSize="10">Gas bubbles</text>
        <text x="280" y="242" className="fill-yellow-700 dark:fill-yellow-300" fontSize="10">expand as</text>
        <text x="280" y="254" className="fill-yellow-700 dark:fill-yellow-300" fontSize="10">pressure drops</text>

        {/* Pressure annotation */}
        <text x="260" y="368" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Dissolved gases in magma expand as it rises — like opening a shaken fizzy drink
        </text>

        {/* Viscosity comparison */}
        <rect x="20" y="385" width="230" height="28" rx="4" className="fill-green-100 dark:fill-green-900/30" stroke="#16a34a" strokeWidth="1" />
        <text x="135" y="403" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="10">
          Runny magma → gentle flow (Hawaii)
        </text>
        <rect x="270" y="385" width="230" height="28" rx="4" className="fill-red-100 dark:fill-red-900/30" stroke="#dc2626" strokeWidth="1" />
        <text x="385" y="403" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="10">
          Thick magma → explosive! (St. Helens)
        </text>
      </svg>
    </div>
  );
}
