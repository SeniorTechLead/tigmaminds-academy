export default function ActivityBoatShapeDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Activity: build three foil boats with different hull shapes and race them by blowing"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Foil Boat Hull Race
        </text>
        <text x="390" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: aluminum foil, a coin, a bathtub or basin, a straw for blowing
        </text>

        {/* Three hull shapes */}
        {[
          { x: 150, name: 'Wide & Flat', shape: 'M -40,0 L -40,20 L 40,20 L 40,0 Z', predict: 'Most stable but slowest?', color: '#ef4444' },
          { x: 390, name: 'Narrow & Pointed', shape: 'M 0,-5 L -20,20 L 20,20 Z', predict: 'Fast but tippy?', color: '#22c55e' },
          { x: 630, name: 'Round Bowl', shape: 'M -30,0 Q -35,20 0,25 Q 35,20 30,0 Z', predict: 'Spins in circles?', color: '#3b82f6' },
        ].map((hull) => (
          <g key={hull.name} transform={`translate(${hull.x}, 80)`}>
            <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="600" fill={hull.color}>
              {hull.name}
            </text>
            {/* Hull cross-section */}
            <g transform="translate(0, 30)">
              <path d={hull.shape} fill={hull.color} opacity="0.2" stroke={hull.color} strokeWidth="1.5" />
              {/* Water line */}
              <line x1="-50" y1="10" x2="50" y2="10" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,3" />
              <circle cx="0" cy="5" r="5" fill="#6b7280" opacity="0.5" />
              <text x="0" y="50" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">coin inside</text>
            </g>
            <text x="0" y="110" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              Prediction: {hull.predict}
            </text>
            {/* Result box */}
            <rect x="-55" y="120" width="110" height="30" rx="4" fill={hull.color} opacity="0.1" stroke={hull.color} strokeWidth="1" />
            <text x="0" y="140" textAnchor="middle" fontSize="11" fill={hull.color}>
              Result: ___ cm
            </text>
          </g>
        ))}

        {/* Test setup */}
        <g transform="translate(390, 250)">
          <rect x="-330" y="0" width="660" height="55" rx="8" className="fill-cyan-50 dark:fill-cyan-950" opacity="0.5" />
          <text x="0" y="20" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-cyan-700 dark:fill-cyan-300">
            How to Test
          </text>
          <text x="0" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Line up all three boats. Blow through a straw from 10 cm behind each (same effort). Measure distance traveled.
          </text>
        </g>

        {/* Analysis questions */}
        <g transform="translate(390, 325)">
          <rect x="-310" y="0" width="620" height="70" rx="8" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.5" />
          <text x="0" y="20" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
            Think About
          </text>
          <text x="0" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Which went farthest? Which went straightest? Which tipped over?
          </text>
          <text x="0" y="56" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            How does this explain why Majuli racing boats are long and narrow, not short and wide?
          </text>
        </g>

        <text x="390" y="410" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Test three hull shapes and discover the trade-off between speed, stability, and drag
        </text>
      </svg>
    </div>
  );
}
