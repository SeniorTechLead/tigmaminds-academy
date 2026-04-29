export default function TurtleEarthLayersDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Earth's internal layers: thin crust, thick mantle with convection currents, liquid outer core, solid inner core with temperatures and depths"
      >
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Earth’s Internal Structure
        </text>

        {/* Earth cross-section */}
        <g transform="translate(220, 240)">
          {/* Inner core */}
          <circle cx="0" cy="0" r="35" fill="#fbbf24" opacity="0.8" />
          <text x="0" y="-5" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-amber-900">Inner</text>
          <text x="0" y="8" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-amber-900">Core</text>
          <text x="0" y="22" textAnchor="middle" fontSize="9" className="fill-amber-800">Solid iron</text>

          {/* Outer core */}
          <circle cx="0" cy="0" r="75" fill="#f97316" opacity="0.4" />
          <text x="0" y="-55" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-orange-800 dark:fill-orange-200">Outer Core</text>
          <text x="0" y="-42" textAnchor="middle" fontSize="9" className="fill-orange-700 dark:fill-orange-300">Liquid iron/nickel</text>

          {/* Mantle */}
          <circle cx="0" cy="0" r="140" fill="#ef4444" opacity="0.2" />
          <text x="-95" y="-100" fontSize="10" fontWeight="600" className="fill-red-800 dark:fill-red-200">Mantle</text>
          <text x="-95" y="-87" fontSize="9" className="fill-red-700 dark:fill-red-300">Hot, slowly flowing rock</text>

          {/* Crust */}
          <circle cx="0" cy="0" r="155" fill="none" stroke="#78350f" strokeWidth="6" opacity="0.6" />
          <text x="105" y="-120" fontSize="10" fontWeight="600" className="fill-amber-900 dark:fill-amber-200">Crust</text>
          <text x="105" y="-107" fontSize="9" className="fill-amber-700 dark:fill-amber-400">5–70 km thin!</text>

          {/* Convection arrows in mantle */}
          <path d="M-60,-90 Q-80,-50 -60,-10" fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arr-earth)" />
          <path d="M-60,-10 Q-40,-50 -60,-90" fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arr-earth-b)" />
          <path d="M60,-90 Q80,-50 60,-10" fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arr-earth)" />
          <path d="M60,-10 Q40,-50 60,-90" fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arr-earth-b)" />
        </g>

        {/* Right panel: details */}
        <g transform="translate(420, 60)">
          {[
            { layer: 'Crust', depth: '0\u201370 km', temp: '0\u2013500\u00b0C', color: '#92400e', note: 'Where we live. Continental crust is granite; oceanic crust is basalt.' },
            { layer: 'Mantle', depth: '70\u20132,900 km', temp: '500\u20133,700\u00b0C', color: '#ef4444', note: 'Solid but flows slowly like thick honey. Drives plate tectonics.' },
            { layer: 'Outer Core', depth: '2,900\u20135,100 km', temp: '3,700\u20134,400\u00b0C', color: '#f97316', note: 'Liquid iron and nickel. Creates Earth\u2019s magnetic field.' },
            { layer: 'Inner Core', depth: '5,100\u20136,371 km', temp: '5,200\u00b0C', color: '#fbbf24', note: 'Solid iron ball. Hotter than the Sun\u2019s surface!' },
          ].map((l, i) => (
            <g key={i} transform={`translate(0, ${i * 85})`}>
              <rect width="250" height="75" rx="6" fill={l.color} opacity="0.1" stroke={l.color} strokeWidth="1" />
              <circle cx="15" cy="15" r="8" fill={l.color} opacity="0.5" />
              <text x="30" y="19" fontSize="12" fontWeight="700" fill={l.color}>{l.layer}</text>
              <text x="15" y="36" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Depth: {l.depth}</text>
              <text x="15" y="50" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Temp: {l.temp}</text>
              <text x="15" y="66" fontSize="9" className="fill-gray-500 dark:fill-slate-400" style={{ maxWidth: 220 }}>{l.note}</text>
            </g>
          ))}
        </g>

        {/* Bottom note */}
        <rect x="50" y="410" width="600" height="24" rx="6" className="fill-amber-50 dark:fill-amber-950/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="427" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-800 dark:fill-amber-200">
          Convection currents in the mantle push tectonic plates — the engine behind mountains and earthquakes
        </text>

        <defs>
          <marker id="arr-earth" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#ef4444" />
          </marker>
          <marker id="arr-earth-b" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
