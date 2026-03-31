export default function SalHeartwoodDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cross-section of a tree trunk showing bark, sapwood, heartwood, and growth rings"
      >
        <rect width="780" height="500" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Heartwood vs Sapwood: Inside a Tree Trunk
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Cross-section of a sal tree trunk showing its layered structure
        </text>

        {/* Cross section */}
        <g transform="translate(300, 280)">
          {/* Bark outer */}
          <circle cx="0" cy="0" r="180" fill="#5c3d2e" />
          {/* Inner bark (phloem) */}
          <circle cx="0" cy="0" r="168" fill="#7a5c40" />
          {/* Sapwood - lighter */}
          <circle cx="0" cy="0" r="155" fill="#c9a86c" />
          {/* Growth rings in sapwood */}
          {[148, 140, 132, 124].map(r => (
            <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="#b89858" strokeWidth="0.7" />
          ))}
          {/* Heartwood - darker center */}
          <circle cx="0" cy="0" r="110" fill="#8b6914" />
          {/* Growth rings in heartwood */}
          {[100, 88, 76, 64, 52, 40, 28].map(r => (
            <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="#7a5e10" strokeWidth="0.5" />
          ))}
          {/* Pith center */}
          <circle cx="0" cy="0" r="15" fill="#6b5510" />

          {/* Medullary rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line
              key={angle}
              x1={15 * Math.cos(angle * Math.PI / 180)}
              y1={15 * Math.sin(angle * Math.PI / 180)}
              x2={155 * Math.cos(angle * Math.PI / 180)}
              y2={155 * Math.sin(angle * Math.PI / 180)}
              stroke="#a08030" strokeWidth="0.5" strokeOpacity="0.4"
            />
          ))}
        </g>

        {/* Labels with pointer lines */}
        {/* Bark */}
        <line x1="460" y1="115" x2="462" y2="115" stroke="#94a3b8" strokeWidth="1" />
        <line x1="462" y1="115" x2="475" y2="282" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="475" cy="282" r="3" fill="#5c3d2e" />
        <text x="480" y="110" fontSize="13" fontWeight="700" fill="#8b6c54">Bark</text>
        <text x="480" y="126" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Protects from insects</text>
        <text x="480" y="140" fontSize="11" className="fill-gray-500 dark:fill-slate-400">and disease</text>

        {/* Sapwood */}
        <line x1="555" y1="180" x2="440" y2="220" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="440" cy="220" r="3" fill="#c9a86c" />
        <text x="562" y="175" fontSize="13" fontWeight="700" fill="#c9a86c">Sapwood</text>
        <text x="562" y="191" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Alive! Carries water</text>
        <text x="562" y="205" fontSize="11" className="fill-gray-500 dark:fill-slate-400">from roots to leaves</text>

        {/* Heartwood */}
        <line x1="555" y1="300" x2="380" y2="300" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="380" cy="300" r="3" fill="#8b6914" />
        <text x="562" y="295" fontSize="13" fontWeight="700" fill="#b89858">Heartwood</text>
        <text x="562" y="311" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Dead cells packed with</text>
        <text x="562" y="325" fontSize="11" className="fill-gray-500 dark:fill-slate-400">resins {'\u2014'} the strongest part</text>

        {/* Pith */}
        <line x1="555" y1="380" x2="310" y2="280" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="310" cy="280" r="3" fill="#6b5510" />
        <text x="562" y="375" fontSize="13" fontWeight="700" fill="#7a6820">Pith</text>
        <text x="562" y="391" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Soft center from the</text>
        <text x="562" y="405" fontSize="11" className="fill-gray-500 dark:fill-slate-400">tree&apos;s first year of growth</text>

        {/* Growth rings callout */}
        <rect x="50" y="430" width="680" height="45" rx="8" fill="#c9a86c" fillOpacity="0.1" stroke="#c9a86c" strokeWidth="1" />
        <text x="390" y="450" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-amber-200">
          Each ring = one year of growth. Wide rings = good rain year. Narrow rings = drought year.
        </text>
        <text x="390" y="466" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-amber-300">
          Sal heartwood is so dense (specific gravity 0.88) that it sinks in water
        </text>
      </svg>
    </div>
  );
}
