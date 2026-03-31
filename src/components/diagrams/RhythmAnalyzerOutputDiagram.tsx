export default function RhythmAnalyzerOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Project output: spectrogram and frequency analysis of Dimasa drumming patterns"
      >
        <rect width="780" height="400" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">
          Project Output: Rhythm Frequency Analyzer
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Spectrogram showing frequency vs time for a drum pattern
        </text>

        {/* Spectrogram area */}
        <rect x="100" y="75" width="580" height="140" rx="6" fill="#1e1b4b" />

        {/* Simulated spectrogram bands */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((t) => {
          const x = 105 + t * 72;
          return (
            <g key={t}>
              {/* Low frequency hit */}
              <rect x={x} y="170" width="30" height="20" rx="2" fill="#fbbf24" opacity={t % 2 === 0 ? 0.9 : 0.3} />
              {/* Mid frequency */}
              <rect x={x} y="145" width="30" height="20" rx="2" fill="#f97316" opacity={t % 3 === 0 ? 0.8 : 0.2} />
              {/* High frequency */}
              <rect x={x} y="120" width="30" height="20" rx="2" fill="#ef4444" opacity={t % 4 === 0 ? 0.7 : 0.1} />
              {/* Very high */}
              <rect x={x} y="95" width="30" height="20" rx="2" fill="#a855f7" opacity={t % 2 === 0 ? 0.3 : 0.05} />
            </g>
          );
        })}

        {/* Axis labels */}
        <text x="80" y="95" textAnchor="end" fontSize="9" fill="#94a3b8">4 kHz</text>
        <text x="80" y="135" textAnchor="end" fontSize="9" fill="#94a3b8">2 kHz</text>
        <text x="80" y="175" textAnchor="end" fontSize="9" fill="#94a3b8">500 Hz</text>
        <text x="80" y="210" textAnchor="end" fontSize="9" fill="#94a3b8">100 Hz</text>
        <text x="390" y="230" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Time \u2192
        </text>

        {/* Frequency spectrum below */}
        <text x="390" y="260" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
          Dominant Frequencies
        </text>

        {/* Frequency bars */}
        <g transform="translate(0, 265)">
          {[
            { x: 160, label: '120 Hz', h: 80, color: '#fbbf24', desc: 'Drum fundamental' },
            { x: 280, label: '240 Hz', h: 50, color: '#f97316', desc: '2nd harmonic' },
            { x: 400, label: '360 Hz', h: 30, color: '#ef4444', desc: '3rd harmonic' },
            { x: 520, label: '480 Hz', h: 18, color: '#a855f7', desc: '4th harmonic' },
            { x: 640, label: '600 Hz', h: 10, color: '#6366f1', desc: '5th harmonic' },
          ].map((b) => (
            <g key={b.x}>
              <rect x={b.x - 25} y={100 - b.h} width="50" height={b.h} rx="3" fill={b.color} opacity="0.7" />
              <text x={b.x} y={95 - b.h} textAnchor="middle" fontSize="10" fontWeight="600" fill={b.color}>
                {b.label}
              </text>
              <text x={b.x} y="115" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">
                {b.desc}
              </text>
            </g>
          ))}
          <line x1="120" y1="100" x2="680" y2="100" stroke="#94a3b8" strokeWidth="1" />
        </g>

        <text x="390" y="395" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Generated with Python FFT analysis of recorded drumming
        </text>
      </svg>
    </div>
  );
}
