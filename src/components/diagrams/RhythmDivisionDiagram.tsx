export default function RhythmDivisionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Rhythm as time division: whole notes subdivide into halves, quarters, eighths, showing polyrhythm"
      >
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">
          Rhythm: Dividing Time into Patterns
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Every rhythm is a mathematical subdivision of a steady beat
        </text>

        {/* Time bar */}
        <line x1="100" y1="80" x2="700" y2="80" stroke="#94a3b8" strokeWidth="1" />

        {/* Whole note */}
        <g>
          <rect x="100" y="90" width="600" height="30" rx="4" fill="#8b5cf6" opacity="0.2" stroke="#8b5cf6" strokeWidth="1.5" />
          <circle cx="400" cy="105" r="8" fill="#8b5cf6" opacity="0.7" />
          <text x="60" y="110" textAnchor="end" fontSize="11" fontWeight="600" className="fill-violet-600 dark:fill-violet-400">Whole</text>
          <text x="720" y="110" fontSize="10" className="fill-gray-500 dark:fill-slate-400">\u00d71</text>
        </g>

        {/* Half notes */}
        <g>
          {[0, 1].map((i) => (
            <g key={i}>
              <rect x={100 + i * 300} y="130" width="300" height="30" rx="4" fill="#a855f7" opacity="0.15" stroke="#a855f7" strokeWidth="1" />
              <circle cx={100 + i * 300 + 150} cy="145" r="7" fill="#a855f7" opacity="0.7" />
            </g>
          ))}
          <text x="60" y="150" textAnchor="end" fontSize="11" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">Half</text>
          <text x="720" y="150" fontSize="10" className="fill-gray-500 dark:fill-slate-400">\u00d72</text>
        </g>

        {/* Quarter notes */}
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={100 + i * 150} y="170" width="150" height="30" rx="4" fill="#d946ef" opacity="0.1" stroke="#d946ef" strokeWidth="1" />
              <circle cx={100 + i * 150 + 75} cy="185" r="6" fill="#d946ef" opacity="0.7" />
            </g>
          ))}
          <text x="60" y="190" textAnchor="end" fontSize="11" fontWeight="600" className="fill-fuchsia-600 dark:fill-fuchsia-400">Quarter</text>
          <text x="720" y="190" fontSize="10" className="fill-gray-500 dark:fill-slate-400">\u00d74</text>
        </g>

        {/* Eighth notes */}
        <g>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <rect x={100 + i * 75} y="210" width="75" height="30" rx="3" fill="#ec4899" opacity="0.08" stroke="#ec4899" strokeWidth="0.8" />
              <circle cx={100 + i * 75 + 37} cy="225" r="5" fill="#ec4899" opacity="0.6" />
            </g>
          ))}
          <text x="60" y="230" textAnchor="end" fontSize="11" fontWeight="600" className="fill-pink-600 dark:fill-pink-400">Eighth</text>
          <text x="720" y="230" fontSize="10" className="fill-gray-500 dark:fill-slate-400">\u00d78</text>
        </g>

        {/* Polyrhythm section */}
        <rect x="80" y="265" width="620" height="110" rx="10" className="fill-purple-50 dark:fill-purple-950" stroke="#a855f7" strokeWidth="1.5" />
        <text x="390" y="288" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">
          Dimasa Polyrhythm: 3 against 4
        </text>

        {/* 4-beat pattern */}
        <g>
          <text x="100" y="315" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">Drum 1 (4 beats):</text>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={250 + i * 120} cy="310" r="8" fill="#3b82f6" opacity="0.7" />
          ))}
        </g>

        {/* 3-beat pattern */}
        <g>
          <text x="100" y="345" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">Drum 2 (3 beats):</text>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={250 + i * 160} cy="340" r="8" fill="#ef4444" opacity="0.7" />
          ))}
        </g>

        <text x="390" y="368" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          They align every 12 beats (LCM of 3 and 4) \u2014 creating tension and release
        </text>

        {/* Summary */}
        <rect x="120" y="390" width="540" height="36" rx="8" className="fill-purple-50 dark:fill-purple-950" stroke="#a855f7" strokeWidth="1.5" />
        <text x="390" y="408" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">
          Rhythm = ratios of time. Polyrhythm = multiple ratios simultaneously.
        </text>
        <text x="390" y="422" textAnchor="middle" fontSize="11" className="fill-purple-600 dark:fill-purple-400">
          The brain's basal ganglia and cerebellum process rhythm using the same circuits as movement.
        </text>
      </svg>
    </div>
  );
}
