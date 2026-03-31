export default function JasmineScentClockDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Circadian clock controlling scent release: VOC production peaks at dusk to attract nocturnal moth pollinators"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">
          The Biological Clock: Scent on a Schedule
        </text>

        {/* 24-hour clock circle */}
        <g transform="translate(200, 220)">
          {/* Clock face */}
          <circle cx="0" cy="0" r="130" className="fill-gray-50 dark:fill-gray-900/30" stroke="#6b7280" strokeWidth="1.5" />

          {/* Day half */}
          <path d="M0,-130 A130,130 0 0,1 0,130" fill="#fbbf24" opacity="0.1" />
          <text x="60" y="5" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">DAY</text>

          {/* Night half */}
          <path d="M0,130 A130,130 0 0,1 0,-130" fill="#312e81" opacity="0.1" />
          <text x="-60" y="5" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-indigo-500 dark:fill-indigo-400">NIGHT</text>

          {/* Hour marks */}
          {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => {
            const angle = (h / 24) * 2 * Math.PI - Math.PI / 2;
            const x1 = Math.cos(angle) * 118;
            const y1 = Math.sin(angle) * 118;
            const x2 = Math.cos(angle) * 130;
            const y2 = Math.sin(angle) * 130;
            const lx = Math.cos(angle) * 142;
            const ly = Math.sin(angle) * 142;
            return (
              <g key={h}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9ca3af" strokeWidth="2" />
                <text x={lx} y={ly + 4} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-gray-400">
                  {`${String(h).padStart(2, '0')}:00`}
                </text>
              </g>
            );
          })}

          {/* Scent intensity curve (polar-ish representation) */}
          {/* Peak from ~18:00 to ~06:00 */}
          {Array.from({ length: 24 }).map((_, h) => {
            const angle = (h / 24) * 2 * Math.PI - Math.PI / 2;
            const intensity = h >= 18 || h <= 5 ? 0.6 + 0.4 * Math.sin(((h >= 18 ? h - 18 : h + 6) / 12) * Math.PI) : 0.05;
            const r = 40 + intensity * 65;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <circle key={h} cx={x} cy={y} r="4" fill="#a855f7" opacity={0.3 + intensity * 0.6} />
            );
          })}

          {/* Center label */}
          <circle cx="0" cy="0" r="30" className="fill-white dark:fill-slate-950" stroke="#9ca3af" strokeWidth="1" />
          <text x="0" y="-5" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">VOC</text>
          <text x="0" y="8" textAnchor="middle" fontSize="10" className="fill-purple-600 dark:fill-purple-400">release</text>

          {/* Sunset/sunrise markers */}
          <text x="0" y="-135" textAnchor="middle" fontSize="18">&#x1F305;</text>
          <text x="0" y="152" textAnchor="middle" fontSize="18">&#x1F307;</text>
        </g>

        {/* Right panel: What happens at dusk */}
        <g transform="translate(380, 70)">
          <rect width="280" height="300" rx="8" className="fill-purple-50 dark:fill-purple-950/20" stroke="#9333ea" strokeWidth="1" />
          <text x="140" y="24" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">At Dusk</text>

          {/* Gene activation chain */}
          <g transform="translate(20, 45)">
            <rect width="240" height="36" rx="6" className="fill-indigo-100 dark:fill-indigo-900/30" stroke="#6366f1" strokeWidth="1" />
            <text x="120" y="15" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-700 dark:fill-indigo-300">Clock genes (TOC1/CCA1)</text>
            <text x="120" y="29" textAnchor="middle" fontSize="10" className="fill-indigo-600 dark:fill-indigo-400">activate at dusk</text>
          </g>

          <line x1="140" y1="85" x2="140" y2="100" stroke="#9333ea" strokeWidth="1.5" markerEnd="url(#arr-scent)" />

          <g transform="translate(20, 105)">
            <rect width="240" height="36" rx="6" className="fill-green-100 dark:fill-green-900/30" stroke="#16a34a" strokeWidth="1" />
            <text x="120" y="15" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-700 dark:fill-green-300">Enzyme genes ramp up</text>
            <text x="120" y="29" textAnchor="middle" fontSize="10" className="fill-green-600 dark:fill-green-400">terpenoid biosynthesis pathway</text>
          </g>

          <line x1="140" y1="145" x2="140" y2="160" stroke="#9333ea" strokeWidth="1.5" markerEnd="url(#arr-scent)" />

          <g transform="translate(20, 165)">
            <rect width="240" height="36" rx="6" className="fill-purple-100 dark:fill-purple-900/30" stroke="#9333ea" strokeWidth="1" />
            <text x="120" y="15" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">VOCs released</text>
            <text x="120" y="29" textAnchor="middle" fontSize="10" className="fill-purple-600 dark:fill-purple-400">linalool, methyl benzoate</text>
          </g>

          <line x1="140" y1="205" x2="140" y2="220" stroke="#9333ea" strokeWidth="1.5" markerEnd="url(#arr-scent)" />

          <g transform="translate(20, 225)">
            <rect width="240" height="50" rx="6" className="fill-amber-100 dark:fill-amber-900/30" stroke="#f59e0b" strokeWidth="1" />
            <text x="120" y="17" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Moths follow scent</text>
            <text x="120" y="33" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400">Pollination happens at night</text>
            <text x="120" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">White flowers visible in moonlight</text>
          </g>
        </g>

        {/* Bottom summary */}
        <rect x="50" y="390" width="600" height="24" rx="6" className="fill-purple-50 dark:fill-purple-950/30" stroke="#9333ea" strokeWidth="1" />
        <text x="350" y="407" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-purple-800 dark:fill-purple-200">
          Scent at dusk, silence at dawn \u2014 the circadian clock saves energy by timing VOCs to pollinator activity
        </text>

        <defs>
          <marker id="arr-scent" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
            <path d="M0,0 L4,8 L8,0" fill="#9333ea" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
