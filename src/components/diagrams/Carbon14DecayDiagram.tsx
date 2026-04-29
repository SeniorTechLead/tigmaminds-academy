export default function Carbon14DecayDiagram() {
  // C-14 half-life decay curve points
  const points = [
    { x: 80, y: 80, label: '100%', age: '0' },
    { x: 200, y: 180, label: '50%', age: '5,730' },
    { x: 320, y: 230, label: '25%', age: '11,460' },
    { x: 440, y: 260, label: '12.5%', age: '17,190' },
    { x: 560, y: 278, label: '6.25%', age: '22,920' },
  ];

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 660 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Carbon-14 decay curve showing how remaining C-14 halves every 5,730 years">
        <rect width="660" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="330" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Carbon-14 Decay Curve</text>
        <text x="330" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Half-life = 5,730 years — every half-life, half the ¹⁴C is gone</text>

        {/* Axes */}
        <line x1="80" y1="300" x2="600" y2="300" strokeWidth="1.5" className="stroke-gray-400 dark:stroke-slate-500" />
        <line x1="80" y1="70" x2="80" y2="300" strokeWidth="1.5" className="stroke-gray-400 dark:stroke-slate-500" />

        {/* Y-axis label */}
        <text x="30" y="190" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300" transform="rotate(-90, 30, 190)">¹⁴C remaining (%)</text>
        {/* X-axis label */}
        <text x="340" y="340" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Years before present</text>

        {/* Curve */}
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Shaded area */}
        <path d={`${pathD} L560,300 L80,300 Z`} fill="#3b82f6" opacity="0.1" />

        {/* Data points and labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#3b82f6" />
            <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#3b82f6">{p.label}</text>
            {/* Age labels on x-axis */}
            <text x={p.x} y="316" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{p.age}</text>
            <line x1={p.x} y1="298" x2={p.x} y2="304" strokeWidth="1" className="stroke-gray-400 dark:stroke-slate-500" />
            {/* Half-life bracket */}
            {i < points.length - 1 && (
              <text x={(p.x + points[i + 1].x) / 2} y="356" textAnchor="middle" fontSize="10" fill="#f59e0b">½</text>
            )}
          </g>
        ))}

        {/* Half-life annotation */}
        <line x1="80" y1="80" x2="200" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="200" y1="80" x2="200" y2="180" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" />
        <text x="145" y="72" textAnchor="middle" fontSize="10" fill="#f59e0b">1 half-life</text>
      </svg>
    </div>
  );
}
