export default function WoodStrengthOutputDiagram() {
  const woods = [
    { name: 'Balsa', density: 16, strength: 12, color: '#fef3c7' },
    { name: 'Pine', density: 50, strength: 40, color: '#d4a574' },
    { name: 'Oak', density: 60, strength: 55, color: '#a0522d' },
    { name: 'Sal', density: 88, strength: 78, color: '#8b4513' },
    { name: 'Teak', density: 65, strength: 62, color: '#6b4226' },
  ];
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Scatter plot showing wood density vs strength for different species">
        <rect width="780" height="300" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="28" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Project Output: Wood Density vs Strength</text>
        <line x1="80" y1="250" x2="720" y2="250" stroke="#64748b" strokeWidth="1" />
        <line x1="80" y1="50" x2="80" y2="250" stroke="#64748b" strokeWidth="1" />
        <text x="400" y="278" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Density (g/cm{'\u00B3'} {'\u00D7'}100)</text>
        <text x="30" y="150" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" transform="rotate(-90,30,150)">Strength (MPa)</text>
        {woods.map((w, i) => {
          const x = 80 + (w.density / 100) * 640;
          const y = 250 - (w.strength / 100) * 200;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="10" fill={w.color} stroke="#64748b" strokeWidth="1" />
              <text x={x} y={y - 16} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{w.name}</text>
            </g>
          );
        })}
        <text x="390" y="293" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Denser woods are generally stronger {'\u2014'} sal is among the strongest tropical hardwoods</text>
      </svg>
    </div>
  );
}
