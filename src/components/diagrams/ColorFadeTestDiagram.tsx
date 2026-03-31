export default function ColorFadeTestDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Comparing how pigment colors fade over decades while structural colors remain vivid">
        <rect width="700" height="360" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Why Structural Color Never Fades</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Sunlight breaks pigment molecules \u2014 but it cannot break geometry</text>

        {/* Time axis */}
        <line x1="100" y1="280" x2="620" y2="280" strokeWidth="1.5" className="stroke-gray-400 dark:stroke-slate-500" />
        {['New', '10 years', '50 years', '100 years', '500 years'].map((t, i) => (
          <text key={i} x={100 + i * 130} y="298" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{t}</text>
        ))}
        <text x="360" y="318" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Time</text>

        {/* Pigment color bars (fading) */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={`p${i}`}>
            <rect x={100 + i * 130 - 25} y={120} width="50" height={60} rx="4" fill="#ef4444" opacity={1 - i * 0.2} />
          </g>
        ))}
        <text x="60" y="155" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444" transform="rotate(-90, 60, 155)">Pigment</text>

        {/* Structural color bars (not fading) */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={`s${i}`}>
            <rect x={100 + i * 130 - 25} y={200} width="50" height={60} rx="4" fill="#3b82f6" opacity="0.9" />
          </g>
        ))}
        <text x="60" y="235" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3b82f6" transform="rotate(-90, 60, 235)">Structural</text>

        {/* Labels */}
        <text x="360" y="80" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">Pigment: UV light breaks the molecules \u2192 color fades</text>
        <text x="360" y="96" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">Structural: nanostructure stays intact \u2192 color stays vivid</text>

        {/* Bottom fact */}
        <text x="350" y="342" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Museum kingfisher feathers from the 1800s are still brilliant blue today</text>
      </svg>
    </div>
  );
}
