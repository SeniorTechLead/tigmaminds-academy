export default function ActivitySoundDistanceDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 500 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto"
        role="img" aria-label="Sound distance measurement experiment">

        <text x="250" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" className="fill-gray-900 dark:fill-slate-50">
          Try This: Inverse Square Law Test
        </text>
        <text x="250" y="42" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          How does sound get quieter with distance?
        </text>

        <rect x="30" y="80" width="40" height="50" rx="6" className="fill-amber-100 dark:fill-amber-900" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="50" y="108" textAnchor="middle" fontSize="18">{'📱'}</text>
        <text x="50" y="148" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Phone</text>
        <text x="50" y="160" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">playing</text>
        <text x="50" y="172" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">a tone</text>

        {[
          { d: '1m', x: 130, db: '~70 dB', bar: 140 },
          { d: '2m', x: 220, db: '~64 dB', bar: 110 },
          { d: '4m', x: 310, db: '~58 dB', bar: 80 },
          { d: '8m', x: 400, db: '~52 dB', bar: 50 },
        ].map((m, i) => (
          <g key={i}>
            <line x1={70} y1="105" x2={m.x} y2="105" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
            <circle cx={m.x} cy="105" r="4" fill="#3b82f6" />
            <text x={m.x} y="90" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">{m.d}</text>
            <rect x={m.x - 15} y={230 - m.bar} width="30" height={m.bar} rx="4" fill="#3b82f6" opacity={0.7 - i * 0.15} />
            <text x={m.x} y={224 - m.bar} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">{m.db}</text>
          </g>
        ))}

        <line x1="110" y1="230" x2="430" y2="230" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="270" y="248" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Loudness at each distance</text>

        <g transform="translate(30, 268)">
          <text x="0" y="0" fontSize="11" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">How to do it:</text>
          <text x="0" y="18" fontSize="10" className="fill-gray-600 dark:fill-slate-300">1. Play a steady tone on your phone (use a tone generator app)</text>
          <text x="0" y="32" fontSize="10" className="fill-gray-600 dark:fill-slate-300">2. Use a dB meter app on a second phone to measure loudness</text>
          <text x="0" y="46" fontSize="10" className="fill-gray-600 dark:fill-slate-300">3. Measure at 1m, 2m, 4m, 8m — does it drop ~6 dB each time?</text>
        </g>

        <text x="250" y="332" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
          Double the distance → quarter the intensity → ~6 dB quieter
        </text>
      </svg>
    </div>
  );
}
