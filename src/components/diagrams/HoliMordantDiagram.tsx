export default function HoliMordantDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Mordants: metal ions bridge dye molecules to fabric fibers, making colors permanent"
      >
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Mordants: Fixing Color to Fabric
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Without a mordant, natural dyes wash right out
        </text>

        {/* Without mordant */}
        <rect x="40" y="70" width="290" height="200" rx="10" className="fill-red-50 dark:fill-red-950/20 stroke-red-300 dark:stroke-red-700" strokeWidth="1.5" />
        <text x="185" y="94" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-red-700 dark:fill-red-300">Without Mordant</text>

        {/* Fabric fiber */}
        <line x1="70" y1="180" x2="290" y2="180" stroke="#d1d5db" strokeWidth="12" strokeLinecap="round" />
        <text x="180" y="184" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">Cotton fiber</text>

        {/* Dye molecules sitting loosely */}
        {[90, 140, 190, 240].map((x) => (
          <g key={x}>
            <circle cx={x} cy="155" r="8" fill="#ef4444" opacity="0.5" />
            <text x={x} y="158" textAnchor="middle" fontSize="7" fill="white">Dye</text>
          </g>
        ))}

        {/* Water washing */}
        <path d="M 70 200 Q 120 210 180 205 Q 230 200 290 210" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="180" y="225" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400">\ud83d\udca7 Water washes dye away</text>

        {/* Arrows showing detachment */}
        {[90, 140, 190, 240].map((x) => (
          <path key={`a${x}`} d={`M ${x} 147 L ${x} 130`} fill="none" stroke="#ef4444" strokeWidth="1" markerEnd="url(#arrow-red-mo)" strokeDasharray="3 2" />
        ))}
        <text x="185" y="260" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">
          Color fades after 1\u20132 washes
        </text>

        <defs>
          <marker id="arrow-red-mo" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5" fill="#ef4444" />
          </marker>
        </defs>

        {/* With mordant */}
        <rect x="370" y="70" width="290" height="200" rx="10" className="fill-emerald-50 dark:fill-emerald-950/20 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1.5" />
        <text x="515" y="94" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">With Mordant (e.g. Alum)</text>

        {/* Fabric fiber */}
        <line x1="400" y1="180" x2="620" y2="180" stroke="#d1d5db" strokeWidth="12" strokeLinecap="round" />
        <text x="510" y="184" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">Cotton fiber</text>

        {/* Mordant-dye bridges */}
        {[420, 470, 520, 570].map((x) => (
          <g key={x}>
            {/* Mordant ion (bridge) */}
            <circle cx={x} cy="160" r="5" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
            <text x={x} y="163" textAnchor="middle" fontSize="5" fill="white">Al</text>
            {/* Dye molecule bonded to mordant */}
            <circle cx={x} cy="143" r="8" fill="#ef4444" opacity="0.7" />
            <text x={x} y="146" textAnchor="middle" fontSize="7" fill="white">Dye</text>
            {/* Bond lines */}
            <line x1={x} y1="151" x2={x} y2="155" stroke="#d97706" strokeWidth="1.5" />
            <line x1={x} y1="165" x2={x} y2="174" stroke="#d97706" strokeWidth="1.5" />
          </g>
        ))}

        <text x="515" y="207" textAnchor="middle" fontSize="9" className="fill-amber-600 dark:fill-amber-400">
          Metal ion bonds to BOTH dye and fiber
        </text>

        <text x="515" y="225" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400">\ud83d\udca7 Water cannot break the bond</text>

        <text x="515" y="260" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400">
          Color survives 50+ washes
        </text>

        {/* Common mordants */}
        <rect x="60" y="290" width="580" height="80" rx="8" className="fill-amber-50 dark:fill-amber-950/20 stroke-amber-200 dark:stroke-amber-700" strokeWidth="1" />
        <text x="350" y="312" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">Common Mordants</text>
        {[
          { x: 140, name: 'Alum (Al\u00b3\u207a)', use: 'Brightens colors', safe: 'Safe' },
          { x: 310, name: 'Iron (Fe\u00b2\u207a)', use: 'Darkens/saddens colors', safe: 'Safe' },
          { x: 480, name: 'Copper (Cu\u00b2\u207a)', use: 'Greens and blues', safe: 'Use carefully' },
        ].map(({ x, name, use, safe }) => (
          <g key={name}>
            <text x={x} y={336} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">{name}</text>
            <text x={x} y={350} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{use}</text>
            <text x={x} y={362} textAnchor="middle" fontSize="9" className="fill-gray-400 dark:fill-slate-500">{safe}</text>
          </g>
        ))}

        {/* Connection to tea/Holi */}
        <rect x="60" y="385" width="580" height="44" rx="8" className="fill-rose-50 dark:fill-rose-950/30 stroke-rose-200 dark:stroke-rose-800" strokeWidth="1" />
        <text x="350" y="405" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-rose-700 dark:fill-rose-300">
          Tea Gardens + Holi = Same Chemistry
        </text>
        <text x="350" y="422" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Tea polyphenols bind to metal ions (tannin + iron = black ink). Holi dyes use the same mordant chemistry to fix to skin and fabric.
        </text>
      </svg>
    </div>
  );
}
