export default function ThermalShockDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Thermal shock: why pots crack when temperature changes too fast, showing expansion mismatch"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-red-600 dark:fill-red-400">
          Thermal Shock: Why Pots Crack
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          When the outside expands faster than the inside, stress builds until the pot cracks
        </text>

        {/* Left: Slow heating (safe) */}
        <g transform="translate(200, 100)">
          <text x="0" y="-10" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-green-600 dark:fill-green-400">
            Slow Heating ✔
          </text>
          {/* Pot shape */}
          <ellipse cx="0" cy="60" rx="75" ry="20" fill="none" stroke="#65a30d" strokeWidth="2" />
          <path d="M -75 60 Q -80 130 -60 160 Q 0 180 60 160 Q 80 130 75 60" fill="#65a30d" opacity="0.2" stroke="#65a30d" strokeWidth="2" />
          {/* Even temperature arrows */}
          {[-50, -25, 0, 25, 50].map((x) => (
            <g key={x}>
              <line x1={x} y1="35" x2={x} y2="55" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#heat-arrow)" />
            </g>
          ))}
          <text x="0" y="195" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
            Even expansion throughout
          </text>
          <text x="0" y="210" textAnchor="middle" fontSize="11" className="fill-green-600 dark:fill-green-400" fontWeight="600">
            No cracking
          </text>
        </g>

        {/* Right: Fast heating (crack) */}
        <g transform="translate(570, 100)">
          <text x="0" y="-10" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-red-600 dark:fill-red-400">
            Fast Heating ✘
          </text>
          {/* Pot shape with crack */}
          <ellipse cx="0" cy="60" rx="75" ry="20" fill="none" stroke="#dc2626" strokeWidth="2" />
          <path d="M -75 60 Q -80 130 -60 160 Q 0 180 60 160 Q 80 130 75 60" fill="#dc2626" opacity="0.15" stroke="#dc2626" strokeWidth="2" />
          {/* Crack line */}
          <path d="M 10 65 L 5 90 L 15 110 L 8 135 L 18 155" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          {/* Hot outside, cool inside labels */}
          <text x="-90" y="120" fontSize="10" className="fill-red-500 dark:fill-red-400" fontWeight="600">
            HOT
          </text>
          <text x="0" y="120" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400" fontWeight="600">
            COOL
          </text>
          <text x="90" y="120" fontSize="10" className="fill-red-500 dark:fill-red-400" fontWeight="600">
            HOT
          </text>
          <text x="0" y="195" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
            Outside expands, inside doesn't
          </text>
          <text x="0" y="210" textAnchor="middle" fontSize="11" className="fill-red-600 dark:fill-red-400" fontWeight="600">
            Stress → CRACK
          </text>
        </g>

        <defs>
          <marker id="heat-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Quartz inversion detail */}
        <rect x="100" y="320" width="580" height="60" rx="8" className="fill-amber-50 dark:fill-amber-950" stroke="#d97706" strokeWidth="1.5" />
        <text x="390" y="340" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">
          Critical zone: 573°C — Quartz Inversion
        </text>
        <text x="390" y="358" textAnchor="middle" fontSize="11" className="fill-amber-600 dark:fill-amber-400">
          At 573°C, quartz crystals suddenly expand 2%. If the kiln heats too fast here,
        </text>
        <text x="390" y="372" textAnchor="middle" fontSize="11" className="fill-amber-600 dark:fill-amber-400">
          the sudden expansion cracks the pot. Potters slow down through this zone.
        </text>

        {/* Bottom summary */}
        <rect x="120" y="400" width="540" height="60" rx="8" className="fill-red-50 dark:fill-red-950" stroke="#dc2626" strokeWidth="1.5" />
        <text x="390" y="422" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-red-700 dark:fill-red-300">
          Thermal shock = stress from uneven expansion
        </text>
        <text x="390" y="440" textAnchor="middle" fontSize="11" className="fill-red-600 dark:fill-red-400">
          Same reason: pouring boiling water into a cold glass can shatter it.
        </text>
        <text x="390" y="456" textAnchor="middle" fontSize="11" className="fill-red-600 dark:fill-red-400">
          Potters raise and lower kiln temperature slowly to prevent this.
        </text>
      </svg>
    </div>
  );
}
