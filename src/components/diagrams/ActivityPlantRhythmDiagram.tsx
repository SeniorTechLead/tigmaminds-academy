export default function ActivityPlantRhythmDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: observe a plant at 4 times each day for 3 days, noting leaf position, flower state, and scent to document circadian rhythms"
      >
        <rect width="700" height="400" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Track a Plant\u2019s Daily Rhythm
        </text>
        <text x="350" y="50" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: a houseplant or garden plant, a notebook, 3 days of patience
        </text>

        {/* Four observation times */}
        {[
          { time: '7 AM', icon: '\u2600\uFE0F', label: 'Morning', y: 80, obs: 'Leaves up? Flowers open? Scent?' },
          { time: '12 PM', icon: '\u2600\uFE0F', label: 'Noon', y: 150, obs: 'Any change from morning?' },
          { time: '6 PM', icon: '\u{1F307}', label: 'Evening', y: 220, obs: 'Leaves drooping? New flowers?' },
          { time: '10 PM', icon: '\u{1F319}', label: 'Night', y: 290, obs: 'Leaves folded? Scent stronger?' },
        ].map((slot, i) => (
          <g key={i} transform={`translate(50, ${slot.y})`}>
            <rect width="600" height="55" rx="8" className={i % 2 === 0 ? "fill-purple-50 dark:fill-purple-950/20" : "fill-indigo-50 dark:fill-indigo-950/20"} stroke={i % 2 === 0 ? "#9333ea" : "#6366f1"} strokeWidth="1" />

            {/* Time */}
            <text x="20" y="22" fontSize="22">{slot.icon}</text>
            <text x="50" y="22" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">{slot.time}</text>
            <text x="50" y="38" fontSize="11" className="fill-gray-500 dark:fill-slate-400">{slot.label}</text>

            {/* What to observe */}
            <text x="160" y="22" fontSize="11" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">Observe:</text>
            <text x="160" y="38" fontSize="11" className="fill-gray-600 dark:fill-gray-400">{slot.obs}</text>

            {/* Recording boxes for 3 days */}
            {[1, 2, 3].map((d) => (
              <g key={d} transform={`translate(${370 + (d - 1) * 75}, 8)`}>
                <rect width="65" height="36" rx="4" className="fill-white dark:fill-slate-800" stroke="#d1d5db" strokeWidth="1" />
                <text x="33" y="14" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">{`Day ${d}`}</text>
                <text x="33" y="28" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-gray-600">record</text>
              </g>
            ))}
          </g>
        ))}

        {/* Bottom insight */}
        <rect x="50" y="355" width="600" height="36" rx="6" className="fill-amber-50 dark:fill-amber-950/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="372" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-800 dark:fill-amber-200">
          Best plants: prayer plant (folds leaves at night), mimosa, oxalis, or any flowering plant
        </text>
        <text x="350" y="386" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          You\u2019re documenting the same circadian rhythm that controls night jasmine blooming
        </text>
      </svg>
    </div>
  );
}
