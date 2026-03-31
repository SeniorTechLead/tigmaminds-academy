export default function GrassC4PathwayDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Comparison of C3 and C4 photosynthesis pathways showing how C4 plants concentrate CO2 around RuBisCO to eliminate photorespiration"
      >
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          C3 vs C4 Photosynthesis
        </text>

        {/* C3 Panel */}
        <g transform="translate(30, 55)">
          <rect width="300" height="340" rx="8" className="fill-red-50 dark:fill-red-950/20" stroke="#ef4444" strokeWidth="1.5" />
          <text x="150" y="24" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-red-700 dark:fill-red-300">C3 Plants (rice, wheat)</text>

          {/* Mesophyll cell */}
          <rect x="30" y="50" width="240" height="120" rx="12" className="fill-green-100 dark:fill-green-900/30" stroke="#16a34a" strokeWidth="1" />
          <text x="150" y="68" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-800 dark:fill-green-200">Mesophyll Cell</text>

          {/* RuBisCO with problem */}
          <circle cx="100" cy="120" r="24" className="fill-blue-100 dark:fill-blue-900/40" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="100" y="116" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">RuBisCO</text>
          <text x="100" y="128" textAnchor="middle" fontSize="9" className="fill-blue-600 dark:fill-blue-400">grabs O\u2082!</text>

          {/* CO2 arrow */}
          <text x="45" y="88" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-gray-400">CO\u2082</text>
          <line x1="65" y1="85" x2="80" y2="100" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arr-c4)" />

          {/* O2 arrow (problem) */}
          <text x="160" y="88" fontSize="11" fontWeight="600" className="fill-red-600 dark:fill-red-400">O\u2082</text>
          <line x1="165" y1="92" x2="125" y2="110" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arr-c4-red)" />

          {/* Photorespiration */}
          <rect x="140" y="105" width="115" height="48" rx="6" className="fill-red-100 dark:fill-red-900/30" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
          <text x="198" y="122" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-700 dark:fill-red-300">Photorespiration</text>
          <text x="198" y="135" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">Wastes energy</text>
          <text x="198" y="147" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">\u22120% to \u221230% output</text>

          {/* Result bar */}
          <rect x="30" y="190" width="240" height="30" rx="6" className="fill-red-100 dark:fill-red-900/30" />
          <text x="150" y="210" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-red-800 dark:fill-red-200">
            Hot conditions = more O\u2082 grabs = less sugar
          </text>

          {/* Productivity bar */}
          <rect x="30" y="240" width="240" height="24" rx="4" className="fill-gray-100 dark:fill-gray-800/40" />
          <rect x="30" y="240" width="120" height="24" rx="4" className="fill-green-400 dark:fill-green-600" opacity="0.7" />
          <text x="150" y="257" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">Productivity in heat: moderate</text>

          {/* Temperature note */}
          <text x="150" y="290" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">Optimal: 15\u201325\u00b0C</text>
          <text x="150" y="306" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">Struggles above 30\u00b0C</text>
        </g>

        {/* C4 Panel */}
        <g transform="translate(370, 55)">
          <rect width="300" height="340" rx="8" className="fill-emerald-50 dark:fill-emerald-950/20" stroke="#16a34a" strokeWidth="1.5" />
          <text x="150" y="24" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">C4 Plants (elephant grass)</text>

          {/* Mesophyll cell */}
          <rect x="30" y="50" width="240" height="55" rx="12" className="fill-green-100 dark:fill-green-900/30" stroke="#16a34a" strokeWidth="1" />
          <text x="150" y="68" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-800 dark:fill-green-200">Mesophyll Cell</text>
          <text x="150" y="83" textAnchor="middle" fontSize="10" className="fill-green-700 dark:fill-green-300">CO\u2082 \u2192 C4 acid (concentrates CO\u2082)</text>

          {/* Arrow down */}
          <line x1="150" y1="108" x2="150" y2="122" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arr-c4)" />
          <text x="195" y="118" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">Pumped in</text>

          {/* Bundle sheath cell */}
          <rect x="30" y="125" width="240" height="65" rx="12" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#059669" strokeWidth="1.5" />
          <text x="150" y="143" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-800 dark:fill-emerald-200">Bundle Sheath Cell</text>

          {/* RuBisCO happy */}
          <circle cx="100" cy="170" r="18" className="fill-blue-100 dark:fill-blue-900/40" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="100" y="167" textAnchor="middle" fontSize="9" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">RuBisCO</text>
          <text x="100" y="178" textAnchor="middle" fontSize="8" className="fill-emerald-600 dark:fill-emerald-400">high CO\u2082</text>

          {/* Check mark */}
          <text x="160" y="170" fontSize="20" className="fill-emerald-500">\u2713</text>
          <text x="185" y="172" fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">No wasted O\u2082 grabs</text>

          {/* Result bar */}
          <rect x="30" y="210" width="240" height="30" rx="6" className="fill-emerald-100 dark:fill-emerald-900/30" />
          <text x="150" y="230" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-800 dark:fill-emerald-200">
            Hot conditions = still efficient!
          </text>

          {/* Productivity bar */}
          <rect x="30" y="260" width="240" height="24" rx="4" className="fill-gray-100 dark:fill-gray-800/40" />
          <rect x="30" y="260" width="220" height="24" rx="4" className="fill-emerald-400 dark:fill-emerald-600" opacity="0.7" />
          <text x="150" y="277" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">Productivity in heat: 50\u2013100% higher</text>

          {/* Temperature note */}
          <text x="150" y="310" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">Optimal: 30\u201345\u00b0C</text>
          <text x="150" y="326" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">Grows 5\u20136m per season!</text>
        </g>

        {/* Markers */}
        <defs>
          <marker id="arr-c4" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#16a34a" />
          </marker>
          <marker id="arr-c4-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#ef4444" />
          </marker>
        </defs>

        {/* Bottom insight */}
        <rect x="50" y="410" width="600" height="24" rx="6" className="fill-emerald-50 dark:fill-emerald-950/30" stroke="#16a34a" strokeWidth="1" />
        <text x="350" y="427" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-800 dark:fill-emerald-200">
          Kaziranga\u2019s C4 grasses grow tall enough to hide 2,000+ rhinos
        </text>
      </svg>
    </div>
  );
}
