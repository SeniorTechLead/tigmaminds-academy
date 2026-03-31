export default function DawnChorusOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Project output: dawn chorus timing model predicting when each bird species starts singing on any date">
        <rect width="780" height="340" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">Your Project: Dawn Chorus Timing Model</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Predict when each bird species starts singing on any date, from sunrise data</text>

        {/* Scatter plot preview */}
        <g transform="translate(60, 75)">
          {/* Axes */}
          <line x1="40" y1="0" x2="40" y2="180" stroke="#94a3b8" strokeWidth="1" />
          <line x1="40" y1="180" x2="360" y2="180" stroke="#94a3b8" strokeWidth="1" />
          <text x="200" y="205" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Sunrise time (month)</text>
          <text x="15" y="90" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" transform="rotate(-90, 15, 90)">First call time</text>

          {/* Data points for 3 species */}
          {[
            { species: 'Robin', color: '#ef4444', points: [[60,20],[100,30],[160,60],[220,90],[280,60],[340,30]] },
            { species: 'Cuckoo', color: '#f59e0b', points: [[60,50],[100,60],[160,90],[220,120],[280,90],[340,60]] },
            { species: 'Sparrow', color: '#92400e', points: [[60,80],[100,90],[160,120],[220,150],[280,120],[340,90]] },
          ].map((sp, si) => (
            <g key={si}>
              {sp.points.map(([x, y], pi, arr) => (
                <g key={pi}>
                  <circle cx={x} cy={y} r="4" fill={sp.color} opacity="0.7" />
                  {pi > 0 && <line x1={arr[pi - 1][0]} y1={arr[pi - 1][1]} x2={x} y2={y} stroke={sp.color} strokeWidth="1.5" strokeDasharray="3,2" opacity="0.5" />}
                </g>
              ))}
            </g>
          ))}

          {/* Legend */}
          {[
            { label: 'Robin (-80 min)', color: '#ef4444', y: 220 },
            { label: 'Cuckoo (-30 min)', color: '#f59e0b', y: 220 },
            { label: 'Sparrow (-10 min)', color: '#92400e', y: 220 },
          ].map((l, i) => (
            <g key={i} transform={`translate(${50 + i * 110}, ${l.y})`}>
              <circle r="4" fill={l.color} />
              <text x="10" y="4" fontSize="10" fontWeight="600" fill={l.color}>{l.label}</text>
            </g>
          ))}
        </g>

        {/* Right: prediction box */}
        <rect x="440" y="75" width="300" height="200" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="590" y="100" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Prediction Engine</text>
        <rect x="460" y="115" width="260" height="30" rx="4" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" strokeWidth="1" />
        <text x="590" y="134" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Input: Date → March 15, Assam</text>

        <text x="590" y="165" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Sunrise: 5:42 AM</text>

        {[
          { bird: 'Robin starts', time: '4:22 AM', color: '#ef4444' },
          { bird: 'Cuckoo starts', time: '5:12 AM', color: '#f59e0b' },
          { bird: 'Sparrow starts', time: '5:32 AM', color: '#92400e' },
        ].map((p, i) => (
          <text key={i} x="590" y={190 + i * 22} textAnchor="middle" fontSize="11" fill={p.color} fontWeight="600">{p.bird}: {p.time}</text>
        ))}
        <text x="590" y="260" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">Model uses sunrise + species offset</text>

        {/* Bottom */}
        <rect x="60" y="295" width="660" height="30" rx="6" fill="#f59e0b" opacity="0.1" />
        <text x="390" y="314" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">
          Level 4: collect sunrise data for 12 months, model 5 species offsets, predict and verify
        </text>
      </svg>
    </div>
  );
}
