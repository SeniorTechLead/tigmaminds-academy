export default function ActivityTrackingDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full"
        role="img"
        aria-label="Offline activity: track animals in your neighbourhood using observation sheets, then estimate populations with mark-recapture logic"
      >
        <rect x="0" y="0" width="600" height="400" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="13" className="fill-gray-200" fontWeight="700">
          Activity: Be a Wildlife Tracker
        </text>

        {/* Step 1 */}
        <rect x="15" y="44" width="175" height="170" rx="6" className="fill-slate-800/60" />
        <text x="102" y="64" textAnchor="middle" fontSize="11" className="fill-amber-300" fontWeight="600">
          Step 1: Choose a Site
        </text>
        {/* Garden icon */}
        <rect x="40" y="78" width="125" height="80" rx="4" className="fill-emerald-950/40" />
        <text x="102" y="105" textAnchor="middle" fontSize="24">🌳</text>
        <text x="102" y="128" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">Garden, park,</text>
        <text x="102" y="140" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">pond, or balcony</text>
        <text x="102" y="168" textAnchor="middle" fontSize="9" className="fill-gray-500">Visit same spot, same time</text>
        <text x="102" y="180" textAnchor="middle" fontSize="9" className="fill-gray-500">for 5 days</text>

        {/* Step 2 */}
        <rect x="210" y="44" width="175" height="170" rx="6" className="fill-slate-800/60" />
        <text x="297" y="64" textAnchor="middle" fontSize="11" className="fill-blue-300" fontWeight="600">
          Step 2: Record
        </text>
        {/* Data sheet */}
        <rect x="230" y="78" width="130" height="90" rx="3" className="fill-white/5" stroke="#6b7280" strokeWidth="0.5" />
        {['Day | Species | Count | Marked?', '────────────────────', ' 1  | Mynah   |  3   |  —', ' 2  | Mynah   |  4   |  1★', ' 3  | Mynah   |  5   |  2★'].map((row, i) => (
          <text key={i} x="240" y={94 + i * 14} fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontFamily="monospace">
            {row}
          </text>
        ))}
        <text x="297" y="185" textAnchor="middle" fontSize="9" className="fill-gray-500">Note any individually</text>
        <text x="297" y="197" textAnchor="middle" fontSize="9" className="fill-gray-500">recognisable features (★)</text>

        {/* Step 3 */}
        <rect x="405" y="44" width="180" height="170" rx="6" className="fill-slate-800/60" />
        <text x="495" y="64" textAnchor="middle" fontSize="11" className="fill-green-300" fontWeight="600">
          Step 3: Estimate
        </text>
        <text x="495" y="90" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-300">
          Use your re-sightings:
        </text>
        <text x="495" y="115" textAnchor="middle" fontSize="13" className="fill-white" fontWeight="600">
          N = (M × C) / R
        </text>
        <text x="495" y="140" textAnchor="middle" fontSize="10" className="fill-amber-300">M = birds you recognised</text>
        <text x="495" y="155" textAnchor="middle" fontSize="10" className="fill-blue-300">C = total counted Day 2</text>
        <text x="495" y="170" textAnchor="middle" fontSize="10" className="fill-green-300">R = recognised on Day 2</text>
        <text x="495" y="195" textAnchor="middle" fontSize="9" className="fill-gray-500">
          Compare to your raw count!
        </text>

        {/* Tips section */}
        <rect x="15" y="228" width="570" height="70" rx="6" className="fill-indigo-950/30" />
        <text x="300" y="248" textAnchor="middle" fontSize="11" className="fill-indigo-300" fontWeight="600">
          Tips for Identifying Individuals
        </text>
        {[
          { x: 80, icon: '🐦', tip: 'Missing feathers\nor leg bands' },
          { x: 210, icon: '🐛', tip: 'Unique colour\npatterns' },
          { x: 340, icon: '🐈', tip: 'Scars, ear nicks,\ntail shape' },
          { x: 470, icon: '🦎', tip: 'Size differences\nor behaviour' },
        ].map((t, i) => (
          <g key={i}>
            <text x={t.x} y={t.tip.split('\n').length > 0 ? 268 : 272} textAnchor="middle" fontSize="16">{t.icon}</text>
            {t.tip.split('\n').map((line, j) => (
              <text key={j} x={t.x} y={282 + j * 12} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">{line}</text>
            ))}
          </g>
        ))}

        {/* Think about it */}
        <rect x="15" y="310" width="570" height="80" rx="6" className="fill-amber-950/30" />
        <text x="300" y="330" textAnchor="middle" fontSize="11" className="fill-amber-300" fontWeight="600">
          Think About It
        </text>
        <text x="300" y="350" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-300">
          Your estimate will not be perfect. Real wildlife scientists face the same challenges:
        </text>
        <text x="300" y="368" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          animals hide, move unpredictably, and look alike. That is why they use GPS, camera traps,
        </text>
        <text x="300" y="383" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          and statistical models together — no single method is enough.
        </text>
      </svg>
    </div>
  );
}
