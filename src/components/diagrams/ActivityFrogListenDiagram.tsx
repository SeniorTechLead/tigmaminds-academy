export default function ActivityFrogListenDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: listen to a frog chorus and count distinct call types on rainy vs dry evenings"
      >
        <rect width="700" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Try This: Frog Chorus Field Study
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: a rainy evening, ears, a notebook, and a pencil
        </text>

        {/* Steps */}
        {[
          { y: 80, step: '1', color: 'fill-cyan-500', text: 'Wait for a rainy evening. Sit under shelter near a pond or wet field.' },
          { y: 130, step: '2', color: 'fill-emerald-500', text: 'Listen quietly for 5 minutes. Count distinct "voices" (high, low, fast, slow).' },
          { y: 180, step: '3', color: 'fill-blue-500', text: 'Record: time, weather (rainy/cloudy/clear), and number of call types.' },
          { y: 230, step: '4', color: 'fill-amber-500', text: 'Repeat on a DRY evening. Compare the two counts.' },
        ].map(({ y, step, color, text }) => (
          <g key={step}>
            <circle cx="80" cy={y + 10} r="16" className={color} opacity="0.15" />
            <text x="80" y={y + 15} textAnchor="middle" fontSize="14" fontWeight="700" className={color}>{step}</text>
            <text x="110" y={y + 15} fontSize="12" className="fill-gray-700 dark:fill-slate-300">{text}</text>
          </g>
        ))}

        {/* Data table template */}
        <rect x="60" y="275" width="580" height="130" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="350" y="296" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Your Data Table</text>

        {/* Table headers */}
        {['Date', 'Weather', 'Temp', 'Calls Heard', 'Distinct Types'].map((h, i) => (
          <text key={h} x={110 + i * 115} y="320" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">{h}</text>
        ))}
        <line x1="70" y1="326" x2="630" y2="326" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />

        {/* Example row */}
        {['15 Jul', 'Rainy', '26\u00b0C', 'Many', '5 types'].map((v, i) => (
          <text key={`ex${i}`} x={110 + i * 115} y="346" textAnchor="middle" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400" fontStyle="italic">{v}</text>
        ))}
        {['18 Jul', 'Dry', '30\u00b0C', 'Few', '2 types'].map((v, i) => (
          <text key={`ex2${i}`} x={110 + i * 115} y="366" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400" fontStyle="italic">{v}</text>
        ))}

        {/* Blank rows */}
        {[386, 395].map((y) => (
          <line key={y} x1="70" y1={y} x2="630" y2={y} className="stroke-gray-200 dark:stroke-slate-700" strokeWidth="0.5" strokeDasharray="4 3" />
        ))}

        {/* What you're doing */}
        <rect x="60" y="420" width="580" height="48" rx="8" className="fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-200 dark:stroke-emerald-800" strokeWidth="1" />
        <text x="350" y="440" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
          You are doing real bioacoustics fieldwork!
        </text>
        <text x="350" y="456" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Ecologists use the exact same method \u2014 with microphones instead of ears \u2014 to monitor frog populations
        </text>
      </svg>
    </div>
  );
}
