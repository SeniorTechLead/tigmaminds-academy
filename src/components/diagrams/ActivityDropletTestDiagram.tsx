export default function ActivityDropletTestDiagram() {
  const surfaces = [
    { x: 100, name: 'Waxy leaf', angle: 'high', dropY: 135, dropRx: 8, dropRy: 10 },
    { x: 240, name: 'Fuzzy leaf', angle: 'medium', dropY: 142, dropRx: 12, dropRy: 8 },
    { x: 380, name: 'Smooth plastic', angle: 'medium', dropY: 143, dropRx: 14, dropRy: 7 },
    { x: 520, name: 'Paper', angle: 'low', dropY: 148, dropRx: 22, dropRy: 4 },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 660 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Activity: drip water on different surfaces and compare droplet shapes to measure hydrophobicity">
        <rect width="660" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="330" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#22c55e">Try This: The Droplet Shape Test</text>
        <text x="330" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">You need: water dropper, waxy leaf (taro/nasturtium), fuzzy leaf, plastic, paper</text>

        {/* Surface comparison */}
        {surfaces.map((s, i) => (
          <g key={i}>
            <rect x={s.x - 50} y="80" width="100" height="100" rx="6" className="fill-gray-50 dark:fill-slate-800/50" stroke="#94a3b8" strokeWidth="1" />
            {/* Surface line */}
            <line x1={s.x - 40} y1="155" x2={s.x + 40} y2="155" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1.5" />
            {/* Water droplet */}
            <ellipse cx={s.x} cy={s.dropY} rx={s.dropRx} ry={s.dropRy} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />
            <text x={s.x} y="175" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{s.name}</text>
          </g>
        ))}

        {/* Ranking arrow */}
        <line x1="80" y1="205" x2="580" y2="205" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#rankArr)" />
        <defs><marker id="rankArr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#22c55e" /></marker></defs>
        <text x="80" y="222" fontSize="10" fill="#22c55e" fontWeight="600">Most water-repellent</text>
        <text x="580" y="222" textAnchor="end" fontSize="10" fill="#ef4444" fontWeight="600">Least water-repellent</text>

        {/* Explanation */}
        <rect x="80" y="240" width="500" height="40" rx="6" className="fill-blue-50 dark:fill-blue-900/15" stroke="#3b82f6" strokeWidth="1" />
        <text x="330" y="258" textAnchor="middle" fontSize="11" className="fill-gray-700 dark:fill-slate-200">Rounder droplet = higher contact angle = more hydrophobic surface</text>
        <text x="330" y="272" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Lotus leaves would score the highest — water barely touches them</text>

        {/* Steps */}
        {[
          { n: '1', text: 'Drip one drop of water onto each surface from the same height' },
          { n: '2', text: 'Look from the side: is the drop tall and round, or flat and spread?' },
          { n: '3', text: 'Tilt each surface gently \u2014 which drop rolls off first?' },
          { n: '4', text: 'Sprinkle dirt on the waxy leaf, then add water \u2014 does it self-clean?' },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={110} cy={305 + i * 26} r="10" fill="#22c55e" opacity="0.15" />
            <text x={110} y={309 + i * 26} textAnchor="middle" fontSize="11" fontWeight="700" fill="#22c55e">{s.n}</text>
            <text x={130} y={309 + i * 26} fontSize="12" className="fill-gray-700 dark:fill-slate-200">{s.text}</text>
          </g>
        ))}

        <text x="330" y="408" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">The lotus effect: water rolls off and takes the dirt with it — nature’s self-cleaning surface</text>
      </svg>
    </div>
  );
}
