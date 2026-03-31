export default function JasmineStomataClockDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Stomata open-close cycle: guard cells swell to open the pore for gas exchange during the day and close at night to conserve water"
      >
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Stomata: Breathing on a Clock
        </text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Guard cells open and close the pore on a circadian rhythm
        </text>

        {/* Open stomata */}
        <g transform="translate(120, 90)">
          <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Day: OPEN</text>

          {/* Guard cells - open */}
          <ellipse cx="-30" cy="70" rx="18" ry="55" fill="#22c55e" opacity="0.5" transform="rotate(-15, -30, 70)" />
          <ellipse cx="30" cy="70" rx="18" ry="55" fill="#22c55e" opacity="0.5" transform="rotate(15, 30, 70)" />

          {/* Pore */}
          <ellipse cx="0" cy="70" rx="12" ry="40" fill="none" stroke="#16a34a" strokeWidth="2" />

          {/* Arrows: CO2 in, O2 out, H2O out */}
          <text x="-70" y="50" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">CO\u2082 in</text>
          <line x1="-52" y1="52" x2="-14" y2="62" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arr-stom)" />

          <text x="70" y="50" fontSize="11" fontWeight="600" className="fill-red-500 dark:fill-red-400">O\u2082 out</text>
          <line x1="14" y1="62" x2="52" y2="52" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arr-stom-r)" />

          <text x="0" y="140" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-cyan-600 dark:fill-cyan-400">H\u2082O out</text>
          <line x1="0" y1="115" x2="0" y2="128" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arr-stom-c)" />

          <text x="0" y="165" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Guard cells swell with water</text>
          <text x="0" y="178" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">\u2192 pore opens for gas exchange</text>
        </g>

        {/* Closed stomata */}
        <g transform="translate(450, 90)">
          <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">Night: CLOSED</text>

          {/* Guard cells - closed */}
          <ellipse cx="-12" cy="70" rx="14" ry="50" fill="#6b7280" opacity="0.4" transform="rotate(-3, -12, 70)" />
          <ellipse cx="12" cy="70" rx="14" ry="50" fill="#6b7280" opacity="0.4" transform="rotate(3, 12, 70)" />

          {/* Pore closed */}
          <line x1="0" y1="28" x2="0" y2="112" stroke="#374151" strokeWidth="2" />

          {/* X marks */}
          <text x="-60" y="55" fontSize="11" className="fill-gray-400 dark:fill-gray-500">CO\u2082 \u2715</text>
          <text x="50" y="55" fontSize="11" className="fill-gray-400 dark:fill-gray-500">O\u2082 \u2715</text>

          <text x="0" y="140" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-600 dark:fill-indigo-400">Water conserved</text>

          <text x="0" y="165" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Guard cells release water</text>
          <text x="0" y="178" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">\u2192 pore closes to prevent drying</text>
        </g>

        {/* Arrow between states */}
        <g>
          <path d="M220,140 Q300,120 360,140" fill="none" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arr-stom-y)" />
          <text x="290" y="118" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400">Sunset triggers</text>
          <path d="M360,210 Q300,230 220,210" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr-stom-p)" />
          <text x="290" y="245" textAnchor="middle" fontSize="10" className="fill-indigo-500 dark:fill-indigo-400">Sunrise triggers</text>
        </g>

        {/* Bottom: circadian note */}
        <rect x="50" y="300" width="600" height="65" rx="8" className="fill-purple-50 dark:fill-purple-950/20" stroke="#9333ea" strokeWidth="1" />
        <text x="350" y="322" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">
          Clock-controlled, not just light-reactive
        </text>
        <text x="350" y="340" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">
          Even in constant darkness, stomata continue their open/close rhythm for several days
        </text>
        <text x="350" y="356" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">
          \u2014 proving the circadian clock runs independently of current light conditions
        </text>

        <defs>
          <marker id="arr-stom" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#3b82f6" />
          </marker>
          <marker id="arr-stom-r" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#ef4444" />
          </marker>
          <marker id="arr-stom-c" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
            <path d="M0,0 L4,8 L8,0" fill="#06b6d4" />
          </marker>
          <marker id="arr-stom-y" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#f59e0b" />
          </marker>
          <marker id="arr-stom-p" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
