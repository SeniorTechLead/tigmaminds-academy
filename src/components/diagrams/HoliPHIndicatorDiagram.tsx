export default function HoliPHIndicatorDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="pH indicators: turmeric turns red in base, red cabbage changes color across the pH scale"
      >
        <rect width="700" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-pink-600 dark:fill-pink-400">
          pH Indicators: Colors That Reveal Chemistry
        </text>

        {/* Turmeric demo */}
        <rect x="40" y="55" width="620" height="140" rx="10" className="fill-amber-50 dark:fill-amber-950/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1.5" />
        <text x="350" y="78" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">
          Turmeric: Nature's pH Indicator
        </text>

        {/* Three cups showing turmeric in different pH */}
        {[
          { x: 140, fill: '#fbbf24', label: 'Turmeric + water', ph: 'pH 7 (neutral)', note: 'Yellow' },
          { x: 350, fill: '#ef4444', label: 'Turmeric + baking soda', ph: 'pH 9+ (base)', note: 'Turns RED' },
          { x: 560, fill: '#fbbf24', label: 'Turmeric + vinegar', ph: 'pH 3 (acid)', note: 'Stays yellow' },
        ].map(({ x, fill, label, ph, note }) => (
          <g key={label}>
            {/* Cup */}
            <path d={`M ${x - 25} 100 L ${x - 22} 160 Q ${x} 170 ${x + 22} 160 L ${x + 25} 100`}
              fill={fill} opacity="0.3" stroke={fill} strokeWidth="1.5" />
            <text x={x} y="128" textAnchor="middle" fontSize="10" fontWeight="600" style={{ fill }}>{note}</text>
            <text x={x} y="152" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-slate-400">{ph}</text>
            <text x={x} y="186" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{label}</text>
          </g>
        ))}

        {/* Arrow showing change */}
        <path d="M 200 130 L 290 130" fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow-red-ph)" />
        <text x="245" y="122" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-red-500 dark:fill-red-400">Add base</text>

        <defs>
          <marker id="arrow-red-ph" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#ef4444" />
          </marker>
        </defs>

        {/* Why it changes */}
        <text x="350" y="218" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-pink-600 dark:fill-pink-400">
          Why Does Turmeric Change Color?
        </text>
        <text x="350" y="240" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Curcumin's molecular structure CHANGES when it gains or loses a hydrogen ion (H\u207a).
        </text>
        <text x="350" y="258" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Different structure = absorbs different wavelengths = different color.
        </text>
        <text x="350" y="276" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          In base: curcumin loses H\u207a \u2192 extended conjugation \u2192 absorbs green \u2192 reflects RED.
        </text>

        {/* Red cabbage full pH scale */}
        <rect x="40" y="295" width="620" height="130" rx="10" className="fill-purple-50 dark:fill-purple-950/20 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1.5" />
        <text x="350" y="318" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">
          Red Cabbage: Rainbow pH Indicator
        </text>

        {/* pH scale with colors */}
        {[
          { ph: 2, color: '#ef4444', label: 'Red' },
          { ph: 4, color: '#f472b6', label: 'Pink' },
          { ph: 6, color: '#a855f7', label: 'Purple' },
          { ph: 7, color: '#8b5cf6', label: 'Violet' },
          { ph: 8, color: '#3b82f6', label: 'Blue' },
          { ph: 10, color: '#06b6d4', label: 'Blue-green' },
          { ph: 12, color: '#22c55e', label: 'Green' },
          { ph: 14, color: '#eab308', label: 'Yellow' },
        ].map(({ ph, color, label }, i) => {
          const x = 75 + i * 72;
          return (
            <g key={ph}>
              <rect x={x} y="340" width="60" height="30" rx="4" fill={color} opacity="0.5" />
              <text x={x + 30} y="360" textAnchor="middle" fontSize="9" fontWeight="600" fill="white">{label}</text>
              <text x={x + 30} y="385" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">pH {ph}</text>
            </g>
          );
        })}

        <text x="170" y="410" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">\u2190 Acidic</text>
        <text x="350" y="410" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Neutral</text>
        <text x="530" y="410" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">Basic \u2192</text>

        {/* Bottom insight */}
        <rect x="60" y="430" width="580" height="40" rx="8" className="fill-pink-50 dark:fill-pink-950/30 stroke-pink-200 dark:stroke-pink-800" strokeWidth="1" />
        <text x="350" y="448" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-pink-700 dark:fill-pink-300">
          Anthocyanins in red cabbage have 8 color states \u2014 one of nature's best pH indicators
        </text>
        <text x="350" y="464" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Same chemistry as tea polyphenols changing color with oxidation
        </text>
      </svg>
    </div>
  );
}
