export default function JasminePhytochromeDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Phytochrome molecular switch: Pr form converts to Pfr in red light, Pfr slowly reverts to Pr in darkness, triggering flowering when Pfr drops below threshold"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">
          Phytochrome: The Molecular Light Switch
        </text>

        {/* Pr form */}
        <g transform="translate(120, 90)">
          <circle cx="0" cy="0" r="40" className="fill-red-100 dark:fill-red-900/30" stroke="#ef4444" strokeWidth="2" />
          <text x="0" y="-8" textAnchor="middle" fontSize="18" fontWeight="700" className="fill-red-700 dark:fill-red-300">Pr</text>
          <text x="0" y="10" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">Absorbs red</text>
          <text x="0" y="22" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">660 nm</text>
          <text x="0" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Inactive form</text>
        </g>

        {/* Forward arrow: red light converts Pr to Pfr */}
        <g>
          <path d="M175,70 Q300,30 425,70" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arr-phy-red)" />
          <text x="300" y="40" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-red-600 dark:fill-red-400">Red light (sunlight)</text>
          <text x="300" y="55" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Fast conversion</text>
        </g>

        {/* Pfr form */}
        <g transform="translate(480, 90)">
          <circle cx="0" cy="0" r="40" className="fill-blue-100 dark:fill-blue-900/30" stroke="#3b82f6" strokeWidth="2" />
          <text x="0" y="-8" textAnchor="middle" fontSize="18" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Pfr</text>
          <text x="0" y="10" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">Absorbs far-red</text>
          <text x="0" y="22" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">730 nm</text>
          <text x="0" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Active form</text>
        </g>

        {/* Reverse arrow: darkness slowly converts Pfr back to Pr */}
        <g>
          <path d="M425,115 Q300,155 175,115" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 3" markerEnd="url(#arr-phy-blue)" />
          <text x="300" y="145" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-600 dark:fill-indigo-400">Darkness (slow reversion)</text>
          <text x="300" y="160" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">This is the “timer”</text>
        </g>

        {/* Pfr level graph over time */}
        <g transform="translate(70, 200)">
          <rect width="560" height="180" rx="8" className="fill-gray-50 dark:fill-gray-900/30" stroke="#6b7280" strokeWidth="1" />
          <text x="280" y="20" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">Pfr Level Over 24 Hours</text>

          {/* Axes */}
          <line x1="60" y1="150" x2="530" y2="150" stroke="#9ca3af" strokeWidth="1" />
          <line x1="60" y1="35" x2="60" y2="150" stroke="#9ca3af" strokeWidth="1" />

          {/* Y axis labels */}
          <text x="55" y="42" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">High</text>
          <text x="55" y="150" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Low</text>
          <text x="25" y="95" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400" transform="rotate(-90, 25, 95)">Pfr level</text>

          {/* Threshold line */}
          <line x1="60" y1="110" x2="530" y2="110" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" />
          <text x="540" y="114" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">Threshold</text>

          {/* Day region */}
          <rect x="60" y="30" width="220" height="120" fill="#fbbf24" opacity="0.08" />
          <text x="170" y="168" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400">Day (light)</text>

          {/* Night region */}
          <rect x="280" y="30" width="250" height="120" fill="#312e81" opacity="0.08" />
          <text x="405" y="168" textAnchor="middle" fontSize="10" className="fill-indigo-600 dark:fill-indigo-400">Night (darkness)</text>

          {/* Pfr curve: high during day, drops in night */}
          <path
            d="M60,45 L280,45 Q290,45 300,55 L400,100 L460,125 L530,140"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
          />

          {/* Bloom trigger zone */}
          <rect x="440" y="110" width="90" height="40" rx="4" fill="#22c55e" opacity="0.15" stroke="#16a34a" strokeWidth="1" />
          <text x="485" y="128" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Bloom</text>
          <text x="485" y="140" textAnchor="middle" fontSize="9" className="fill-emerald-600 dark:fill-emerald-400">triggered!</text>
        </g>

        {/* Bottom summary */}
        <rect x="70" y="395" width="560" height="20" rx="4" className="fill-purple-50 dark:fill-purple-950/30" />
        <text x="350" y="410" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-purple-800 dark:fill-purple-200">
          Long night → Pfr drops below threshold → flowering genes activate
        </text>

        <defs>
          <marker id="arr-phy-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#ef4444" />
          </marker>
          <marker id="arr-phy-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
