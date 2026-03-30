export default function GeoErosionProcessDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 400" className="w-full max-w-xl mx-auto" role="img" aria-label="Weathering types and erosion agents including water, ice, wind, gravity, and biology">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Erosion — How Landscapes Are Shaped
        </text>

        {/* Central mountain being eroded */}
        <path d="M 180,190 L 260,80 L 340,190 Z" className="fill-stone-400 dark:fill-stone-600" />
        <path d="M 200,190 L 260,100 L 320,190 Z" className="fill-stone-300 dark:fill-stone-500" opacity="0.6" />
        <text x="260" y="170" textAnchor="middle" className="fill-stone-700 dark:fill-stone-200" fontSize="10" fontWeight="bold">Mountain</text>
        <text x="260" y="182" textAnchor="middle" className="fill-stone-600 dark:fill-stone-300" fontSize="10">(being worn down)</text>

        {/* Erosion balance arrow at top */}
        <line x1="185" y1="55" x2="215" y2="55" className="stroke-emerald-500" strokeWidth="2" />
        <text x="200" y="50" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="bold">↑ Uplift</text>
        <line x1="305" y1="55" x2="335" y2="55" className="stroke-red-500" strokeWidth="2" />
        <text x="320" y="50" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">↓ Erosion</text>
        <text x="260" y="68" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Height = uplift − erosion</text>

        {/* 1. WATER — top left */}
        <rect x="10" y="90" width="145" height="95" rx="6" className="fill-blue-50 dark:fill-blue-900/20" stroke="#3b82f6" strokeWidth="1" />
        <text x="82" y="108" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">
          💧 Water
        </text>
        <text x="82" y="124" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">
          Most powerful agent
        </text>
        <text x="20" y="140" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Rivers carve valleys</text>
        <text x="20" y="154" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Rain dissolves rock</text>
        <text x="20" y="168" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Waves pound cliffs</text>
        {/* Arrow pointing toward mountain */}
        <line x1="155" y1="138" x2="178" y2="138" className="stroke-blue-400" strokeWidth="2" markerEnd="url(#eroArrow)" />

        {/* 2. ICE — top right */}
        <rect x="365" y="90" width="145" height="95" rx="6" className="fill-cyan-50 dark:fill-cyan-900/20" stroke="#06b6d4" strokeWidth="1" />
        <text x="438" y="108" textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300" fontSize="11" fontWeight="bold">
          🧊 Ice
        </text>
        <text x="438" y="124" textAnchor="middle" className="fill-cyan-600 dark:fill-cyan-400" fontSize="10">
          Frost wedging + glaciers
        </text>
        <text x="375" y="140" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Water freezes in cracks</text>
        <text x="375" y="154" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Expands 9%, splits rock</text>
        <text x="375" y="168" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Glaciers gouge valleys</text>
        <line x1="365" y1="138" x2="342" y2="138" className="stroke-cyan-400" strokeWidth="2" markerEnd="url(#eroArrowL)" />

        {/* 3. WIND — bottom left */}
        <rect x="10" y="210" width="145" height="85" rx="6" className="fill-yellow-50 dark:fill-yellow-900/20" stroke="#eab308" strokeWidth="1" />
        <text x="82" y="228" textAnchor="middle" className="fill-yellow-700 dark:fill-yellow-300" fontSize="11" fontWeight="bold">
          💨 Wind
        </text>
        <text x="20" y="246" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Sand blasts rock faces</text>
        <text x="20" y="260" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Carries away topsoil</text>
        <text x="20" y="274" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Sculpts desert shapes</text>
        <line x1="155" y1="245" x2="195" y2="210" className="stroke-yellow-500" strokeWidth="2" markerEnd="url(#eroArrow)" />

        {/* 4. GRAVITY — bottom right */}
        <rect x="365" y="210" width="145" height="85" rx="6" className="fill-red-50 dark:fill-red-900/20" stroke="#ef4444" strokeWidth="1" />
        <text x="438" y="228" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="bold">
          ⬇ Gravity
        </text>
        <text x="375" y="246" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Rockfalls & landslides</text>
        <text x="375" y="260" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Slow soil creep</text>
        <text x="375" y="274" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Always moves downhill</text>
        <line x1="365" y1="245" x2="325" y2="210" className="stroke-red-400" strokeWidth="2" markerEnd="url(#eroArrowL)" />

        {/* 5. BIOLOGY — bottom center */}
        <rect x="175" y="210" width="170" height="75" rx="6" className="fill-green-50 dark:fill-green-900/20" stroke="#22c55e" strokeWidth="1" />
        <text x="260" y="228" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="11" fontWeight="bold">
          🌱 Biological
        </text>
        <text x="185" y="246" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Roots pry rock apart</text>
        <text x="185" y="260" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Burrowing animals loosen soil</text>
        <text x="185" y="274" className="fill-gray-600 dark:fill-gray-300" fontSize="10">• Lichens dissolve surfaces</text>

        {/* Arrow defs */}
        <defs>
          <marker id="eroArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0,0 L 8,3 L 0,6 Z" className="fill-gray-500" />
          </marker>
          <marker id="eroArrowL" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M 8,0 L 0,3 L 8,6 Z" className="fill-gray-500" />
          </marker>
        </defs>

        {/* Comparison box */}
        <rect x="20" y="305" width="480" height="85" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="325" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="11" fontWeight="bold">
          Old vs Young Mountains — Erosion in Action
        </text>
        {/* Young mountain */}
        <path d="M 80,370 L 120,340 L 160,370 Z" className="fill-stone-500 dark:fill-stone-400" />
        <text x="120" y="385" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Himalayas</text>
        <text x="120" y="370" textAnchor="middle" className="fill-white dark:fill-gray-200" fontSize="10">8,849 m</text>
        <text x="120" y="345" className="fill-gray-500 dark:fill-gray-400" fontSize="10">50 Myr old</text>

        {/* Old mountain */}
        <path d="M 330,370 L 370,355 L 410,370 Z" className="fill-stone-300 dark:fill-stone-500" />
        <text x="370" y="385" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Appalachians</text>
        <text x="370" y="368" textAnchor="middle" className="fill-stone-600 dark:fill-stone-300" fontSize="10">2,037 m</text>
        <text x="370" y="350" className="fill-gray-500 dark:fill-gray-400" fontSize="10">480 Myr old</text>

        {/* Arrow between them */}
        <text x="245" y="365" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="22">→</text>
        <text x="245" y="380" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">430 Myr of</text>
        <text x="245" y="390" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">erosion</text>
      </svg>
    </div>
  );
}
