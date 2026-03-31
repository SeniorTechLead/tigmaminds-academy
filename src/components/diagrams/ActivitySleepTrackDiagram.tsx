export default function ActivitySleepTrackDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Offline activity: track your own circadian rhythm by recording energy levels every 2 hours for 5 days">
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">Try This: Map Your Own Circadian Rhythm</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Track your energy level every 2 hours for 5 days — you will see a pattern!</text>

        {/* Sample chart */}
        <g transform="translate(80, 80)">
          <text x="300" y="0" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Sample: One Day of Energy Tracking</text>

          {/* Y axis */}
          <line x1="30" y1="20" x2="30" y2="200" stroke="#94a3b8" strokeWidth="1" />
          {[10, 8, 6, 4, 2].map((v, i) => (
            <g key={i}>
              <text x="22" y={24 + i * 45} textAnchor="end" fontSize="10" className="fill-gray-400 dark:fill-slate-500">{v}</text>
              <line x1="28" y1={20 + i * 45} x2="620" y2={20 + i * 45} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
            </g>
          ))}
          <text x="10" y="110" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" transform="rotate(-90, 10, 110)">Energy (1-10)</text>

          {/* X axis */}
          <line x1="30" y1="200" x2="620" y2="200" stroke="#94a3b8" strokeWidth="1" />

          {/* Data points and line */}
          {[
            { h: '6AM', v: 4, x: 60 }, { h: '8AM', v: 7, x: 130 },
            { h: '10AM', v: 9, x: 200 }, { h: '12PM', v: 8, x: 270 },
            { h: '2PM', v: 5, x: 340 }, { h: '4PM', v: 7, x: 410 },
            { h: '6PM', v: 6, x: 480 }, { h: '8PM', v: 4, x: 550 },
          ].map((p, i, arr) => {
            const y = 200 - (p.v / 10) * 180;
            const prevY = i > 0 ? 200 - (arr[i - 1].v / 10) * 180 : y;
            const prevX = i > 0 ? arr[i - 1].x : p.x;
            return (
              <g key={i}>
                {i > 0 && <line x1={prevX} y1={prevY} x2={p.x} y2={y} stroke="#f59e0b" strokeWidth="2.5" />}
                <circle cx={p.x} cy={y} r="5" fill="#f59e0b" />
                <text x={p.x} y="218" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{p.h}</text>
              </g>
            );
          })}

          {/* Labels on peaks/dips */}
          <text x="200" y="10" textAnchor="middle" fontSize="10" fontWeight="600" fill="#22c55e">Peak focus!</text>
          <text x="340" y="175" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ef4444">Post-lunch dip</text>
        </g>

        {/* Instructions */}
        <rect x="60" y="320" width="660" height="80" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="342" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">How to Track</text>
        {[
          '1. Every 2 hours from waking to bedtime, rate your energy 1-10 on paper',
          '2. Do this for 5 days (include weekends — you might wake later!)',
          '3. Plot all 5 days on the same graph — look for repeating peaks and dips',
          '4. Compare with a family member — are your rhythms the same?',
        ].map((step, i) => (
          <text key={i} x="100" y={358 + i * 14} fontSize="10" className="fill-gray-600 dark:fill-slate-300">{step}</text>
        ))}
      </svg>
    </div>
  );
}
