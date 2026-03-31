export default function ActivityStringPitchDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Activity: discover the harmonic series with a rubber band stretched over a box"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Discover the Harmonic Series
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          One rubber band reveals the same physics behind every stringed instrument
        </text>

        {/* Box diagram */}
        <g transform="translate(390, 140)">
          {/* Box */}
          <rect x="-150" y="-20" width="300" height="70" rx="6" fill="#d97706" opacity="0.2" stroke="#92400e" strokeWidth="2" />
          {/* Sound hole */}
          <ellipse cx="0" cy="20" rx="30" ry="15" fill="#1e293b" opacity="0.3" />
          {/* Rubber band (full) */}
          <line x1="-150" y1="-10" x2="150" y2="-10" stroke="#3b82f6" strokeWidth="3" />
          <text x="0" y="-20" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            Full length = fundamental note
          </text>
        </g>

        {/* Half length */}
        <g transform="translate(390, 250)">
          <rect x="-150" y="-20" width="300" height="70" rx="6" fill="#d97706" opacity="0.2" stroke="#92400e" strokeWidth="2" />
          <ellipse cx="0" cy="20" rx="30" ry="15" fill="#1e293b" opacity="0.3" />
          <line x1="-150" y1="-10" x2="0" y2="-10" stroke="#8b5cf6" strokeWidth="3" />
          <line x1="0" y1="-10" x2="150" y2="-10" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* Finger pressing */}
          <circle cx="0" cy="-10" r="6" fill="#ef4444" opacity="0.6" />
          <text x="0" y="-28" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-500 dark:fill-red-400">
            press here
          </text>
          <text x="-75" y="-20" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-violet-600 dark:fill-violet-400">
            1/2 length = octave (2\u00d7 frequency)
          </text>
        </g>

        {/* Instructions */}
        <rect x="80" y="340" width="620" height="100" rx="10" className="fill-fuchsia-50 dark:fill-fuchsia-950" stroke="#d946ef" strokeWidth="1.5" />
        <text x="390" y="362" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-fuchsia-700 dark:fill-fuchsia-300">
          What to do:
        </text>
        {[
          '1. Stretch a rubber band tightly over an open box or between two pencils on a table.',
          '2. Pluck it and listen to the pitch. This is the fundamental frequency.',
          '3. Press the band at the exact midpoint and pluck one half. Pitch jumps up one octave!',
          '4. Try 1/3, 1/4, 1/5 of the length. Each produces a note in the harmonic series.',
        ].map((step, i) => (
          <text key={i} x="110" y={382 + i * 16} fontSize="11" className="fill-gray-700 dark:fill-slate-300">
            {step}
          </text>
        ))}
      </svg>
    </div>
  );
}
