export default function StratigraphyLayersDiagram() {
  const layers = [
    { y: 60, h: 60, color: '#a3e635', label: 'Modern soil', age: '0\u2013100 years', items: 'Plastic, coins' },
    { y: 120, h: 65, color: '#facc15', label: 'Medieval layer', age: '500\u20131,000 years', items: 'Pottery, bronze' },
    { y: 185, h: 70, color: '#fb923c', label: 'Ancient layer', age: '1,000\u20132,000 years', items: 'Stone carvings' },
    { y: 255, h: 70, color: '#f87171', label: 'Deep ancient', age: '2,000\u20135,000 years', items: 'Flint tools' },
    { y: 325, h: 65, color: '#a78bfa', label: 'Bedrock', age: 'Millions of years', items: 'No artifacts' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 460" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Stratigraphy diagram showing deeper layers are older">
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Stratigraphy: Deeper = Older</text>
        <text x="350" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Law of Superposition \u2014 undisturbed layers stack youngest on top</text>

        {layers.map((l, i) => (
          <g key={i}>
            <rect x="80" y={l.y} width="360" height={l.h} fill={l.color} opacity="0.25" stroke={l.color} strokeWidth="1.5" rx="2" />
            {/* texture dots */}
            {Array.from({ length: 8 }).map((_, d) => (
              <circle key={d} cx={110 + d * 40 + (i % 2 ? 15 : 0)} cy={l.y + l.h / 2} r="3" fill={l.color} opacity="0.5" />
            ))}
            <text x="260" y={l.y + l.h / 2 - 8} textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-800 dark:fill-gray-100">{l.label}</text>
            <text x="260" y={l.y + l.h / 2 + 10} textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{l.items}</text>
            {/* age label right */}
            <text x="460" y={l.y + l.h / 2 + 4} fontSize="11" fontWeight="500" className="fill-gray-700 dark:fill-slate-300">{l.age}</text>
          </g>
        ))}

        {/* Arrow: deeper = older */}
        <line x1="620" y1="70" x2="620" y2="380" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowRed)" />
        <defs><marker id="arrowRed" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" /></marker></defs>
        <text x="620" y="400" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444">OLDER</text>
        <text x="620" y="62" textAnchor="middle" fontSize="12" fontWeight="700" fill="#22c55e">NEWER</text>

        {/* Key idea */}
        <text x="350" y="440" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Each layer is a chapter \u2014 the deeper you dig, the further back in time you read</text>
      </svg>
    </div>
  );
}
