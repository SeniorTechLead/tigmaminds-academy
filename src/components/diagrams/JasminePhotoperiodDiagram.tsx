export default function JasminePhotoperiodDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Photoperiodism diagram showing how night jasmine measures darkness duration to trigger blooming, with light flash experiment"
      >
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">
          Photoperiodism: How Plants Measure Night
        </text>

        {/* Timeline bars */}
        {/* Normal short night - no bloom */}
        <g transform="translate(50, 65)">
          <text x="0" y="14" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">Summer (short night)</text>
          <rect x="0" y="24" width="350" height="28" rx="4" fill="#fbbf24" opacity="0.4" />
          <text x="175" y="43" textAnchor="middle" fontSize="10" className="fill-amber-800 dark:fill-amber-200">Day: 14 hours</text>
          <rect x="350" y="24" width="200" height="28" rx="4" fill="#1e293b" opacity="0.7" />
          <text x="450" y="43" textAnchor="middle" fontSize="10" fill="white">Night: 10 hours</text>
          <rect x="570" y="24" width="80" height="28" rx="4" className="fill-red-100 dark:fill-red-900/30" stroke="#ef4444" strokeWidth="1" />
          <text x="610" y="43" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-700 dark:fill-red-300">No bloom</text>
        </g>

        {/* Normal long night - bloom! */}
        <g transform="translate(50, 130)">
          <text x="0" y="14" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">Autumn (long night)</text>
          <rect x="0" y="24" width="260" height="28" rx="4" fill="#fbbf24" opacity="0.4" />
          <text x="130" y="43" textAnchor="middle" fontSize="10" className="fill-amber-800 dark:fill-amber-200">Day: 10 hours</text>
          <rect x="260" y="24" width="290" height="28" rx="4" fill="#1e293b" opacity="0.7" />
          <text x="405" y="43" textAnchor="middle" fontSize="10" fill="white">Night: 14 hours (uninterrupted)</text>
          <rect x="570" y="24" width="80" height="28" rx="4" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#16a34a" strokeWidth="1" />
          <text x="610" y="43" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">{'\u2713'} Blooms!</text>
        </g>

        {/* Critical experiment: flash of light */}
        <g transform="translate(50, 195)">
          <text x="0" y="14" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">Experiment: Light flash at midnight</text>
          <rect x="0" y="24" width="260" height="28" rx="4" fill="#fbbf24" opacity="0.4" />
          <text x="130" y="43" textAnchor="middle" fontSize="10" className="fill-amber-800 dark:fill-amber-200">Day: 10 hours</text>
          <rect x="260" y="24" width="130" height="28" rx="4" fill="#1e293b" opacity="0.7" />
          {/* Flash */}
          <rect x="390" y="20" width="16" height="36" rx="2" fill="#fbbf24" opacity="0.8" />
          <text x="398" y="16" textAnchor="middle" fontSize="16">{'\u26a1'}</text>
          <rect x="406" y="24" width="144" height="28" rx="4" fill="#1e293b" opacity="0.7" />
          <rect x="570" y="24" width="80" height="28" rx="4" className="fill-red-100 dark:fill-red-900/30" stroke="#ef4444" strokeWidth="1" />
          <text x="610" y="43" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-700 dark:fill-red-300">No bloom!</text>
        </g>

        {/* Explanation */}
        <rect x="50" y="270" width="600" height="45" rx="6" className="fill-purple-50 dark:fill-purple-950/30" stroke="#9333ea" strokeWidth="1" />
        <text x="350" y="290" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-purple-800 dark:fill-purple-200">
          Key discovery: Plants measure UNINTERRUPTED darkness, not daylight
        </text>
        <text x="350" y="306" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-gray-400">
          A brief light flash resets the dark timer \u2014 proving the plant counts continuous night hours
        </text>

        {/* Critical night length marker */}
        <g transform="translate(50, 335)">
          <rect width="600" height="90" rx="8" className="fill-indigo-50 dark:fill-indigo-950/30" stroke="#6366f1" strokeWidth="1" />
          <text x="300" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">Critical Night Length</text>
          {/* Scale bar */}
          <rect x="40" y="40" width="520" height="12" rx="6" className="fill-gray-200 dark:fill-gray-700" />
          <rect x="40" y="40" width="320" height="12" rx="6" fill="#ef4444" opacity="0.3" />
          <rect x="360" y="40" width="200" height="12" rx="6" fill="#22c55e" opacity="0.3" />
          <line x1="360" y1="35" x2="360" y2="58" stroke="#6366f1" strokeWidth="2" />
          <text x="360" y="72" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">Critical threshold</text>
          <text x="200" y="72" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">Night too short \u2192 no bloom</text>
          <text x="470" y="72" textAnchor="middle" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">Night long enough \u2192 bloom</text>
        </g>
      </svg>
    </div>
  );
}
