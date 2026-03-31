export default function IncandescentVsLEDDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Comparison of incandescent bulb (heats a filament) versus LED (electroluminescence) showing energy efficiency"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Incandescent vs LED: Where Does the Energy Go?
        </text>

        {/* Incandescent bulb side */}
        <g transform="translate(200, 80)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">
            Incandescent Bulb
          </text>
          <text x="0" y="18" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            (heats a wire until it glows)
          </text>

          {/* Bulb shape */}
          <ellipse cx="0" cy="90" rx="50" ry="60" fill="#fef3c7" opacity="0.3" stroke="#f59e0b" strokeWidth="2" />
          {/* Filament */}
          <path d="M -15 80 Q -10 60 0 80 Q 10 100 15 80" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          {/* Base */}
          <rect x="-25" y="148" width="50" height="20" rx="4" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />

          {/* Heat arrows */}
          {[-40, -28, 28, 40].map((dx) => (
            <g key={dx}>
              <line x1={dx} y1="55" x2={dx * 1.3} y2="30" stroke="#ef4444" strokeWidth="1.5" opacity="0.7" />
            </g>
          ))}
          <text x="65" y="50" fontSize="10" className="fill-red-500 dark:fill-red-400" fontWeight="600">
            90% heat!
          </text>

          {/* Energy breakdown */}
          <rect x="-70" y="195" width="140" height="90" rx="8" fill="#ef4444" opacity="0.1" stroke="#ef4444" strokeWidth="1" />
          <rect x="-70" y="195" width="140" height="81" rx="0" fill="#ef4444" opacity="0.15" />
          <text x="0" y="240" textAnchor="middle" fontSize="20" fontWeight="700" className="fill-red-500 dark:fill-red-400">
            90% heat
          </text>
          <rect x="-70" y="276" width="140" height="9" rx="0" fill="#fbbf24" opacity="0.5" />
          <text x="0" y="300" textAnchor="middle" fontSize="11" className="fill-amber-600 dark:fill-amber-400" fontWeight="600">
            10% light
          </text>
        </g>

        {/* LED side */}
        <g transform="translate(570, 80)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
            LED
          </text>
          <text x="0" y="18" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            (electrons emit photons directly)
          </text>

          {/* LED shape */}
          <rect x="-30" y="65" width="60" height="40" rx="6" fill="#dbeafe" opacity="0.5" stroke="#3b82f6" strokeWidth="2" />
          <path d="M -30 65 Q 0 30 30 65" fill="#dbeafe" opacity="0.4" stroke="#3b82f6" strokeWidth="2" />

          {/* Light rays */}
          {[-35, -20, 0, 20, 35].map((dx) => (
            <line key={dx} x1={dx * 0.5} y1="40" x2={dx} y2="15" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
          ))}
          <text x="55" y="30" fontSize="10" className="fill-blue-500 dark:fill-blue-400" fontWeight="600">
            50%+ light!
          </text>

          {/* Leads */}
          <line x1="-10" y1="105" x2="-10" y2="145" stroke="#94a3b8" strokeWidth="2" />
          <line x1="10" y1="105" x2="10" y2="155" stroke="#94a3b8" strokeWidth="2" />

          {/* Energy breakdown */}
          <rect x="-70" y="195" width="140" height="90" rx="8" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" strokeWidth="1" />
          <rect x="-70" y="195" width="140" height="45" rx="0" fill="#3b82f6" opacity="0.15" />
          <text x="0" y="225" textAnchor="middle" fontSize="18" fontWeight="700" className="fill-blue-500 dark:fill-blue-400">
            50%+ light
          </text>
          <rect x="-70" y="240" width="140" height="45" rx="0" fill="#ef4444" opacity="0.1" />
          <text x="0" y="270" textAnchor="middle" fontSize="14" className="fill-red-400 dark:fill-red-500">
            ~50% heat
          </text>
        </g>

        {/* VS divider */}
        <text x="390" y="180" textAnchor="middle" fontSize="24" fontWeight="700" className="fill-gray-300 dark:fill-slate-600">
          vs
        </text>

        {/* Bottom comparison */}
        <rect x="100" y="400" width="580" height="60" rx="10" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="390" y="422" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">
          Same brightness (1600 lumens): incandescent = 100W, LED = 10W
        </text>
        <text x="390" y="442" textAnchor="middle" fontSize="11" className="fill-amber-600 dark:fill-amber-400">
          LEDs use 90% less electricity because they skip the heating step entirely.
        </text>
        <text x="390" y="456" textAnchor="middle" fontSize="11" className="fill-amber-600 dark:fill-amber-400">
          An oil diya produces only ~12 lumens. One LED replaces 8 diyas.
        </text>
      </svg>
    </div>
  );
}
