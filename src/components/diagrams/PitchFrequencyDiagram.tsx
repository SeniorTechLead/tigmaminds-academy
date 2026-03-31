export default function PitchFrequencyDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Pitch and frequency: showing how doubling frequency raises pitch by one octave"
      >
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-fuchsia-600 dark:fill-fuchsia-400">
          Pitch = Frequency: The Octave Relationship
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Double the frequency = one octave higher
        </text>

        {/* Low frequency wave */}
        <g transform="translate(0, 100)">
          <text x="80" y="0" fontSize="13" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            Low pitch: 261 Hz (Middle C)
          </text>
          <path
            d="M 80 50 Q 160 10 240 50 Q 320 90 400 50 Q 480 10 560 50 Q 640 90 700 50"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
          />
          <text x="720" y="55" fontSize="11" className="fill-blue-500 dark:fill-blue-400">C4</text>
        </g>

        {/* High frequency wave (double) */}
        <g transform="translate(0, 210)">
          <text x="80" y="0" fontSize="13" fontWeight="600" className="fill-violet-600 dark:fill-violet-400">
            High pitch: 523 Hz (C one octave up)
          </text>
          <path
            d="M 80 50 Q 120 10 160 50 Q 200 90 240 50 Q 280 10 320 50 Q 360 90 400 50 Q 440 10 480 50 Q 520 90 560 50 Q 600 10 640 50 Q 660 90 700 50"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
          />
          <text x="720" y="55" fontSize="11" className="fill-violet-500 dark:fill-violet-400">C5</text>
        </g>

        {/* Frequency ratio annotation */}
        <rect x="150" y="320" width="480" height="50" rx="8" className="fill-fuchsia-50 dark:fill-fuchsia-950" stroke="#d946ef" strokeWidth="1.5" />
        <text x="390" y="340" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-fuchsia-700 dark:fill-fuchsia-300">
          523 Hz \u00f7 261 Hz = 2:1 ratio = one octave
        </text>
        <text x="390" y="360" textAnchor="middle" fontSize="11" className="fill-fuchsia-600 dark:fill-fuchsia-400">
          The wave on top fits exactly 2 cycles into the same time as 1 cycle below
        </text>

        {/* Key intervals */}
        <text x="390" y="400" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
          Key musical ratios:
        </text>
        <text x="390" y="420" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Octave = 2:1 \u00a0\u00a0|\u00a0\u00a0 Fifth = 3:2 \u00a0\u00a0|\u00a0\u00a0 Fourth = 4:3 \u00a0\u00a0|\u00a0\u00a0 These simple ratios sound most harmonious
        </text>
      </svg>
    </div>
  );
}
