export default function OwlRodConeDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Rod cells vs cone cells in the retina: rods are 100x more sensitive for night vision but see no color, cones detect color in bright light"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-400">
          Rod Cells vs Cone Cells
        </text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Two types of photoreceptors in your retina — owls have extreme rod density
        </text>

        {/* Rod cell */}
        <g transform="translate(80, 75)">
          <rect width="240" height="300" rx="8" className="fill-indigo-50 dark:fill-indigo-950/20" stroke="#6366f1" strokeWidth="1.5" />
          <text x="120" y="24" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">ROD CELL</text>

          {/* Rod shape */}
          <rect x="95" y="45" width="50" height="100" rx="8" className="fill-indigo-200 dark:fill-indigo-800/40" stroke="#6366f1" strokeWidth="1.5" />
          <rect x="105" y="45" width="30" height="40" rx="4" fill="#818cf8" opacity="0.5" />
          <text x="120" y="70" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-indigo-900 dark:fill-indigo-100">Rhodopsin</text>
          <text x="120" y="82" textAnchor="middle" fontSize="8" className="fill-indigo-700 dark:fill-indigo-300">discs</text>

          {/* Synapse */}
          <rect x="107" y="145" width="26" height="12" rx="3" fill="#6366f1" opacity="0.3" />

          {/* Properties */}
          <g transform="translate(15, 175)">
            {[
              { icon: '\u2713', text: 'Extremely sensitive (single photon!)', color: 'text-emerald-600 dark:text-emerald-400' },
              { icon: '\u2713', text: '100\u00d7 more sensitive than cones', color: 'text-emerald-600 dark:text-emerald-400' },
              { icon: '\u2713', text: 'Night vision specialist', color: 'text-emerald-600 dark:text-emerald-400' },
              { icon: '\u2715', text: 'No color detection', color: 'text-red-500 dark:text-red-400' },
              { icon: '\u2715', text: 'Low spatial resolution (grainy)', color: 'text-red-500 dark:text-red-400' },
            ].map((p, i) => (
              <text key={i} x="0" y={i * 20} fontSize="11" className={`fill-gray-700 dark:fill-gray-300`}>
                <tspan className={p.color} fontWeight="700">{p.icon}</tspan> {p.text}
              </text>
            ))}
          </g>

          <text x="120" y="294" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-indigo-600 dark:fill-indigo-400">
            Owl: ∼1,000,000 rods/mm²
          </text>
        </g>

        {/* Cone cell */}
        <g transform="translate(380, 75)">
          <rect width="240" height="300" rx="8" className="fill-amber-50 dark:fill-amber-950/20" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="120" y="24" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">CONE CELL</text>

          {/* Cone shape */}
          <path d="M95,145 L105,50 L135,50 L145,145 Z" rx="4" className="fill-amber-200 dark:fill-amber-800/40" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Color segments */}
          <rect x="108" y="55" width="24" height="20" rx="2" fill="#ef4444" opacity="0.4" />
          <rect x="108" y="75" width="24" height="20" rx="2" fill="#22c55e" opacity="0.4" />
          <rect x="108" y="95" width="24" height="20" rx="2" fill="#3b82f6" opacity="0.4" />
          <text x="120" y="68" textAnchor="middle" fontSize="8" className="fill-red-700 dark:fill-red-300">R</text>
          <text x="120" y="88" textAnchor="middle" fontSize="8" className="fill-green-700 dark:fill-green-300">G</text>
          <text x="120" y="108" textAnchor="middle" fontSize="8" className="fill-blue-700 dark:fill-blue-300">B</text>

          {/* Synapse */}
          <rect x="107" y="145" width="26" height="12" rx="3" fill="#f59e0b" opacity="0.3" />

          {/* Properties */}
          <g transform="translate(15, 175)">
            {[
              { icon: '\u2713', text: 'Detects color (R, G, B types)', color: 'text-emerald-600 dark:text-emerald-400' },
              { icon: '\u2713', text: 'High spatial resolution (sharp)', color: 'text-emerald-600 dark:text-emerald-400' },
              { icon: '\u2713', text: 'Bright-light specialist', color: 'text-emerald-600 dark:text-emerald-400' },
              { icon: '\u2715', text: 'Needs lots of light to work', color: 'text-red-500 dark:text-red-400' },
              { icon: '\u2715', text: 'Useless at night', color: 'text-red-500 dark:text-red-400' },
            ].map((p, i) => (
              <text key={i} x="0" y={i * 20} fontSize="11" className={`fill-gray-700 dark:fill-gray-300`}>
                <tspan className={p.color} fontWeight="700">{p.icon}</tspan> {p.text}
              </text>
            ))}
          </g>

          <text x="120" y="294" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
            Human: ∼150,000 rods/mm²
          </text>
        </g>

        {/* Bottom comparison */}
        <rect x="50" y="390" width="600" height="24" rx="6" className="fill-indigo-50 dark:fill-indigo-950/30" stroke="#6366f1" strokeWidth="1" />
        <text x="350" y="407" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-800 dark:fill-indigo-200">
          Owl eyes: 5% of body weight (vs 0.0003% in humans) — giant eyes = more rods = better night vision
        </text>
      </svg>
    </div>
  );
}
