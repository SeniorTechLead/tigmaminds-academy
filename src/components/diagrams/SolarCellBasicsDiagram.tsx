export default function SolarCellBasicsDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Solar cell cross-section showing how sunlight knocks electrons free in a silicon junction to produce electricity"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-yellow-600 dark:fill-yellow-400">
          Solar Cell: Sunlight \u2192 Electricity
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Photons knock electrons free in silicon, creating electric current
        </text>

        {/* Sunlight arrows */}
        {[200, 300, 400, 500, 600].map((x) => (
          <g key={x}>
            <line x1={x} y1="70" x2={x} y2="115" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#sun-arrow)" />
          </g>
        ))}
        <text x="130" y="95" fontSize="11" fontWeight="600" className="fill-yellow-500 dark:fill-yellow-400">
          Sunlight (photons)
        </text>

        <defs>
          <marker id="sun-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#fbbf24" />
          </marker>
          <marker id="elec-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Anti-reflection coating */}
        <rect x="150" y="120" width="480" height="15" rx="2" fill="#1d4ed8" opacity="0.3" stroke="#2563eb" strokeWidth="1" />
        <text x="660" y="132" fontSize="10" className="fill-blue-500 dark:fill-blue-400">Anti-reflection coating</text>

        {/* N-type silicon */}
        <rect x="150" y="137" width="480" height="70" rx="0" fill="#dbeafe" opacity="0.5" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="390" y="165" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">
          N-type Silicon (extra electrons)
        </text>
        <text x="390" y="182" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400">
          Doped with phosphorus \u2014 has free electrons
        </text>

        {/* Junction */}
        <rect x="150" y="207" width="480" height="16" rx="0" fill="#a855f7" opacity="0.3" />
        <text x="660" y="219" fontSize="10" fontWeight="600" className="fill-violet-600 dark:fill-violet-400">P-N Junction</text>

        {/* P-type silicon */}
        <rect x="150" y="223" width="480" height="70" rx="0" fill="#fecaca" opacity="0.4" stroke="#ef4444" strokeWidth="1.5" />
        <text x="390" y="253" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-red-700 dark:fill-red-300">
          P-type Silicon (missing electrons = "holes")
        </text>
        <text x="390" y="270" textAnchor="middle" fontSize="10" className="fill-red-500 dark:fill-red-400">
          Doped with boron \u2014 has positive "holes"
        </text>

        {/* Metal back contact */}
        <rect x="150" y="295" width="480" height="15" rx="2" fill="#94a3b8" opacity="0.6" stroke="#64748b" strokeWidth="1" />
        <text x="660" y="307" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Metal back contact</text>

        {/* Electron flow arrows */}
        <path d="M 250 180 Q 200 180 200 220 Q 200 330 150 330 L 100 330 Q 80 330 80 300 L 80 170 Q 80 140 100 140 L 150 140" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#elec-arrow)" />
        <text x="55" y="250" fontSize="10" fontWeight="600" className="fill-blue-500 dark:fill-blue-400" transform="rotate(-90, 55, 250)">
          Electron flow
        </text>

        {/* Light bulb at top of circuit */}
        <circle cx="80" y="140" r="0" />
        <text x="60" y="150" fontSize="18">&#x1F4A1;</text>

        {/* Process steps */}
        <rect x="100" y="340" width="580" height="100" rx="10" className="fill-yellow-50 dark:fill-yellow-950" stroke="#eab308" strokeWidth="1.5" />
        <text x="390" y="362" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-yellow-700 dark:fill-yellow-300">
          How it works in 3 steps:
        </text>
        {[
          '1. Photon hits silicon \u2192 knocks an electron free (photoelectric effect)',
          '2. P-N junction creates an electric field that pushes electrons one way, holes the other',
          '3. Electrons flow through the external circuit = usable electricity',
        ].map((step, i) => (
          <text key={i} x="140" y={383 + i * 18} fontSize="11" className="fill-gray-700 dark:fill-slate-300">
            {step}
          </text>
        ))}
      </svg>
    </div>
  );
}
