export default function FishIridescenceDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 600 360" className="w-full max-w-xl mx-auto" role="img" aria-label="Diagram showing how guanine crystals in fish scales create iridescence through thin-film interference">
        <defs>
          <linearGradient id="fishScaleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="25%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="75%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <marker id="fishArrowGold" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#eab308" />
          </marker>
          <marker id="fishArrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="fishArrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#ef4444" />
          </marker>
        </defs>

        <text x="300" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Why Fish Shimmer: Guanine Crystal Interference</text>

        {/* Left side: fish scale cross-section */}
        <text x="150" y="48" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">Cross-section of a fish scale</text>

        {/* Skin layer */}
        <rect x="30" y="60" width="240" height="30" rx="3" className="fill-rose-100 dark:fill-rose-900/40" />
        <text x="150" y="80" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400" fontSize="10">Skin (epidermis)</text>

        {/* Guanine crystal stack */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <rect x="50" y={100 + i * 28} width="200" height="8" rx="2" fill={`rgba(168, 85, 247, ${0.3 + i * 0.1})`} className="dark:opacity-80" />
            <rect x="50" y={112 + i * 28} width="200" height="16" rx="1" className="fill-sky-50 dark:fill-sky-900/30" opacity="0.6" />
          </g>
        ))}
        <text x="270" y="115" className="fill-purple-600 dark:fill-purple-400" fontSize="10" fontWeight="bold">guanine</text>
        <text x="270" y="127" className="fill-purple-600 dark:fill-purple-400" fontSize="10">crystal</text>
        <text x="270" y="145" className="fill-sky-500 dark:fill-sky-400" fontSize="10">cytoplasm</text>
        <text x="270" y="157" className="fill-sky-500 dark:fill-sky-400" fontSize="10">gap</text>

        {/* Dimension annotation */}
        <line x1="40" y1="100" x2="40" y2="240" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1="36" y1="100" x2="44" y2="100" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1="36" y1="240" x2="44" y2="240" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="20" y="175" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" transform="rotate(-90, 20, 175)">~100 nm</text>

        {/* Incoming white light */}
        <line x1="80" y1="55" x2="120" y2="100" className="stroke-yellow-400" strokeWidth="2.5" markerEnd="url(#fishArrowGold)" />
        <text x="62" y="52" className="fill-yellow-500 dark:fill-yellow-400" fontSize="10" fontWeight="bold">white light</text>

        {/* Reflected rays at different layers */}
        <line x1="120" y1="100" x2="80" y2="145" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
        <line x1="125" y1="128" x2="85" y2="170" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />

        {/* Combined reflected ray going up */}
        <line x1="95" y1="60" x2="140" y2="100" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" strokeDasharray="4,2" />
        <text x="55" y="270" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Each layer reflects a tiny bit.</text>
        <text x="55" y="284" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Reflected waves that are</text>
        <text x="55" y="298" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">in phase = bright color!</text>
        <text x="55" y="316" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Out of phase = cancelled.</text>

        {/* Right side: angle-dependent color shift */}
        <text x="450" y="48" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">Color changes with angle</text>

        {/* Fish scale mockup */}
        <ellipse cx="450" cy="165" rx="100" ry="60" fill="url(#fishScaleGrad)" opacity="0.5" />
        <ellipse cx="450" cy="165" rx="100" ry="60" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" fill="none" />

        {/* Eye at angle 1 */}
        <circle cx="380" cy="80" r="8" className="fill-gray-300 dark:fill-gray-600" />
        <circle cx="382" cy="79" r="3" className="fill-gray-700 dark:fill-gray-300" />
        <line x1="388" y1="85" x2="420" y2="140" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#fishArrowBlue)" />
        <text x="360" y="70" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">blue</text>

        {/* Eye at angle 2 */}
        <circle cx="520" cy="80" r="8" className="fill-gray-300 dark:fill-gray-600" />
        <circle cx="522" cy="79" r="3" className="fill-gray-700 dark:fill-gray-300" />
        <line x1="516" y1="87" x2="480" y2="140" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" markerEnd="url(#fishArrowRed)" />
        <text x="540" y="70" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">red</text>

        <text x="450" y="250" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Different angles select</text>
        <text x="450" y="264" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">different wavelengths</text>

        {/* Bottom summary */}
        <rect x="340" y="285" width="220" height="52" rx="6" className="fill-purple-50 dark:fill-purple-900/30" />
        <text x="450" y="304" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" fontWeight="bold">No pigment needed!</text>
        <text x="450" y="320" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="10">Structure alone creates</text>
        <text x="450" y="334" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="10">the rainbow shimmer.</text>

        {/* Platelet thickness note */}
        <text x="300" y="352" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Guanine platelets: 5–20 nm thick — about 5,000× thinner than a hair</text>
      </svg>
    </div>
  );
}
