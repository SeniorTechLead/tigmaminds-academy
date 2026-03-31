export default function FishStructuralColorDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 600 340" className="w-full max-w-xl mx-auto" role="img" aria-label="Comparison of pigment color versus structural color, showing why structural color never fades">
        <defs>
          <marker id="fscArrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <path d="M0,0 L7,2.5 L0,5" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        <text x="300" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Structural Color vs Pigment Color</text>

        {/* LEFT: Pigment Color */}
        <text x="150" y="52" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">Pigment Color</text>

        {/* Paint molecule absorbing */}
        <rect x="40" y="70" width="220" height="90" rx="6" className="fill-red-50 dark:fill-red-900/20" />
        <text x="150" y="90" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">White light hits pigment molecule</text>

        {/* Incoming arrows - multiple colors */}
        <line x1="70" y1="100" x2="100" y2="120" className="stroke-blue-400" strokeWidth="1.5" />
        <line x1="90" y1="100" x2="110" y2="120" className="stroke-green-400" strokeWidth="1.5" />
        <line x1="110" y1="100" x2="120" y2="120" className="stroke-yellow-400" strokeWidth="1.5" />
        <line x1="130" y1="100" x2="130" y2="120" className="stroke-red-400" strokeWidth="2" />

        {/* Pigment blob */}
        <ellipse cx="130" cy="130" rx="30" ry="15" className="fill-red-400 dark:fill-red-500" opacity="0.8" />
        <text x="130" y="134" textAnchor="middle" className="fill-white" fontSize="10" fontWeight="bold">pigment</text>

        {/* Absorbed (X marks) */}
        <text x="80" y="148" className="fill-gray-400" fontSize="12">\u2717</text>
        <text x="100" y="142" className="fill-gray-400" fontSize="10">absorbed</text>

        {/* Reflected red */}
        <line x1="145" y1="120" x2="180" y2="100" className="stroke-red-500" strokeWidth="2" markerEnd="url(#fscArrow)" />
        <text x="190" y="98" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">red reflected</text>

        {/* Fading section */}
        <rect x="40" y="175" width="220" height="70" rx="6" className="fill-amber-50 dark:fill-amber-900/20" />
        <text x="150" y="195" textAnchor="middle" className="fill-amber-700 dark:fill-amber-400" fontSize="10" fontWeight="bold">\u2600 UV light breaks chemical bonds</text>
        <text x="150" y="212" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Pigment molecules degrade over time</text>

        {/* Fading illustration */}
        <rect x="60" y="222" width="30" height="15" rx="2" className="fill-red-500" />
        <text x="95" y="233" className="fill-gray-500 dark:fill-gray-400" fontSize="10">\u2192</text>
        <rect x="105" y="222" width="30" height="15" rx="2" className="fill-red-300" />
        <text x="140" y="233" className="fill-gray-500 dark:fill-gray-400" fontSize="10">\u2192</text>
        <rect x="150" y="222" width="30" height="15" rx="2" className="fill-red-100 dark:fill-red-900/30" />
        <text x="195" y="233" className="fill-gray-500 dark:fill-gray-400" fontSize="10">fades!</text>

        {/* RIGHT: Structural Color */}
        <text x="450" y="52" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="bold">Structural Color</text>

        <rect x="340" y="70" width="220" height="90" rx="6" className="fill-blue-50 dark:fill-blue-900/20" />
        <text x="450" y="90" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">White light hits nano-layers</text>

        {/* Thin film layers */}
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x="380" y={100 + i * 10} width="140" height="4" rx="1" className="fill-indigo-300 dark:fill-indigo-600" opacity={0.4 + i * 0.15} />
        ))}

        {/* Incoming white light */}
        <line x1="400" y1="96" x2="420" y2="100" className="stroke-yellow-400" strokeWidth="2" />

        {/* Interference produces blue */}
        <line x1="430" y1="100" x2="460" y2="80" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#fscArrow)" />
        <text x="470" y="78" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">blue (from structure)</text>

        <text x="450" y="150" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Constructive interference</text>

        {/* No fading section */}
        <rect x="340" y="175" width="220" height="70" rx="6" className="fill-green-50 dark:fill-green-900/20" />
        <text x="450" y="195" textAnchor="middle" className="fill-green-700 dark:fill-green-400" fontSize="10" fontWeight="bold">\u2600 UV cannot break structure</text>
        <text x="450" y="212" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Physical layers stay intact</text>

        {/* No fading */}
        <rect x="370" y="222" width="30" height="15" rx="2" className="fill-blue-500" />
        <text x="405" y="233" className="fill-gray-500 dark:fill-gray-400" fontSize="10">\u2192</text>
        <rect x="415" y="222" width="30" height="15" rx="2" className="fill-blue-500" />
        <text x="450" y="233" className="fill-gray-500 dark:fill-gray-400" fontSize="10">\u2192</text>
        <rect x="460" y="222" width="30" height="15" rx="2" className="fill-blue-500" />
        <text x="505" y="233" className="fill-green-600 dark:fill-green-400" fontSize="10" fontWeight="bold">never fades!</text>

        {/* Bottom examples */}
        <rect x="30" y="260" width="540" height="65" rx="8" className="fill-gray-50 dark:fill-gray-800/50" />
        <text x="300" y="280" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Examples in nature</text>
        <text x="110" y="300" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Pigment: flamingo pink</text>
        <text x="110" y="314" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(carotenoid pigment from food)</text>
        <text x="300" y="300" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Structural: peacock feather</text>
        <text x="300" y="314" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(melanin rods + air gaps)</text>
        <text x="490" y="300" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Structural: fish iridescence</text>
        <text x="490" y="314" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(guanine crystal platelets)</text>
      </svg>
    </div>
  );
}
