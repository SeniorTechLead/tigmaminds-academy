export default function RockCycleDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 530 425" className="w-full max-w-lg mx-auto" role="img" aria-label="Rock cycle diagram showing igneous, sedimentary, and metamorphic rocks">
        <defs>
          <marker id="rc-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Title */}
        <text x="225" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          The Rock Cycle
        </text>

        {/* --- Rock type nodes --- */}
        {/* Igneous Rock (top) */}
        <rect x="155" y="45" width="140" height="45" rx="22" className="fill-red-100 dark:fill-red-900" stroke="#ef4444" strokeWidth="1.5" />
        <text x="225" y="65" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="12" fontWeight="bold">Igneous Rock</text>
        <text x="225" y="78" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10">(granite, basalt)</text>

        {/* Sediment (right) */}
        <rect x="310" y="155" width="120" height="45" rx="22" className="fill-amber-100 dark:fill-amber-900" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="370" y="175" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="12" fontWeight="bold">Sediment</text>
        <text x="370" y="188" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">(sand, gravel)</text>

        {/* Sedimentary Rock (bottom right) */}
        <rect x="290" y="280" width="140" height="45" rx="22" className="fill-yellow-100 dark:fill-yellow-900" stroke="#eab308" strokeWidth="1.5" />
        <text x="360" y="300" textAnchor="middle" className="fill-yellow-700 dark:fill-yellow-300" fontSize="12" fontWeight="bold">Sedimentary</text>
        <text x="360" y="313" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400" fontSize="10">(sandstone, limestone)</text>

        {/* Metamorphic Rock (bottom left) */}
        <rect x="20" y="280" width="140" height="45" rx="22" className="fill-purple-100 dark:fill-purple-900" stroke="#a855f7" strokeWidth="1.5" />
        <text x="90" y="300" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="12" fontWeight="bold">Metamorphic</text>
        <text x="90" y="313" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="10">(marble, slate)</text>

        {/* Magma (bottom center) */}
        <rect x="150" y="355" width="150" height="40" rx="20" className="fill-orange-100 dark:fill-orange-900" stroke="#f97316" strokeWidth="1.5" />
        <text x="225" y="375" textAnchor="middle" className="fill-orange-700 dark:fill-orange-300" fontSize="12" fontWeight="bold">Magma / Lava</text>

        {/* --- Arrows with process labels --- */}

        {/* Igneous → Sediment (weathering & erosion) — top right */}
        <path d="M 295,75 Q 360,90 370,150" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#rc-arrow)" />
        <text x="355" y="110" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Weathering</text>
        <text x="355" y="122" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">& Erosion</text>

        {/* Sediment → Sedimentary (compaction & cementation) — right side down */}
        <path d="M 370,200 L 370,275" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#rc-arrow)" />
        <text x="400" y="240" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Compaction</text>
        <text x="400" y="252" className="fill-gray-600 dark:fill-gray-300" fontSize="10">& Cementation</text>

        {/* Sedimentary → Metamorphic (heat & pressure) — bottom */}
        <path d="M 290,302 L 165,302" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#rc-arrow)" />
        <text x="225" y="296" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Heat &</text>
        <text x="225" y="308" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Pressure</text>

        {/* Metamorphic → Magma (melting) — bottom left to center */}
        <path d="M 120,325 Q 150,355 175,365" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#rc-arrow)" />
        <text x="115" y="358" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Melting</text>

        {/* Magma → Igneous (cooling) — center bottom to top */}
        <path d="M 200,355 Q 130,250 180,95" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#rc-arrow)" />
        <text x="120" y="210" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Cooling &</text>
        <text x="120" y="222" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Solidifying</text>

        {/* Shortcut: Sedimentary → Magma (melting) */}
        <path d="M 330,325 Q 290,360 300,370" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#rc-arrow)" />

        {/* Shortcut: Igneous → Metamorphic (heat/pressure directly) */}
        <path d="M 170,90 Q 80,180 80,275" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#rc-arrow)" />
        <text x="45" y="185" className="fill-gray-500 dark:fill-gray-400" fontSize="9">Heat &</text>
        <text x="45" y="196" className="fill-gray-500 dark:fill-gray-400" fontSize="9">Pressure</text>
      </svg>
    </div>
  );
}
