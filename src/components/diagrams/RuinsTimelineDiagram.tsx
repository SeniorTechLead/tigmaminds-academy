export default function RuinsTimelineDiagram() {
  const events = [
    { x: 80, label: 'Temple built', date: '~900 CE', color: '#f59e0b' },
    { x: 220, label: 'Temple in use', date: '900\u20131100 CE', color: '#22c55e' },
    { x: 360, label: 'Abandoned', date: '~1100 CE', color: '#ef4444' },
    { x: 480, label: 'Forest grows over', date: '1200\u20131800', color: '#10b981' },
    { x: 600, label: 'Rediscovered', date: '~1900s', color: '#3b82f6' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Timeline showing how ruins tell stories from construction to rediscovery">
        <rect width="700" height="320" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">How Ruins Tell Stories</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Each phase leaves clues archaeologists can read</text>

        {/* Timeline line */}
        <line x1="60" y1="140" x2="640" y2="140" strokeWidth="3" className="stroke-gray-300 dark:stroke-slate-600" />

        {events.map((e, i) => (
          <g key={i}>
            <circle cx={e.x} cy={140} r="8" fill={e.color} />
            <line x1={e.x} y1={148} x2={e.x} y2={180} stroke={e.color} strokeWidth="1.5" />
            <text x={e.x} y={200} textAnchor="middle" fontSize="12" fontWeight="600" fill={e.color}>{e.label}</text>
            <text x={e.x} y={218} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{e.date}</text>
          </g>
        ))}

        {/* Clue annotations */}
        {[
          { x: 140, y: 90, text: 'Stone style dates\nthe builders' },
          { x: 290, y: 90, text: 'Wear patterns show\nyears of worship' },
          { x: 420, y: 90, text: 'Collapse patterns\nreveal the cause' },
          { x: 540, y: 90, text: 'Soil layers & tree roots\ncover the evidence' },
        ].map((a, i) => (
          <text key={i} x={a.x} y={a.y} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
            {a.text.split('\n').map((line, j) => (
              <tspan key={j} x={a.x} dy={j === 0 ? 0 : 13}>{line}</tspan>
            ))}
          </text>
        ))}

        {/* Bottom key idea */}
        <rect x="100" y="248" width="500" height="46" rx="8" className="fill-amber-50 dark:fill-amber-900/20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="268" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Every phase of a building’s life leaves physical evidence.</text>
        <text x="350" y="284" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Archaeologists read these clues to reconstruct stories from stone.</text>
      </svg>
    </div>
  );
}
