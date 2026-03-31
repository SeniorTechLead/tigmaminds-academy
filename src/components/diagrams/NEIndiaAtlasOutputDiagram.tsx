export default function NEIndiaAtlasOutputDiagram() {
  const states = [
    { name: 'AR', w: 83, pop: 1.4, c: '#3b82f6' },
    { name: 'AS', w: 78, pop: 35.6, c: '#22c55e' },
    { name: 'MN', w: 22, pop: 3.1, c: '#ec4899' },
    { name: 'ML', w: 22, pop: 3.3, c: '#8b5cf6' },
    { name: 'MZ', w: 21, pop: 1.2, c: '#14b8a6' },
    { name: 'NL', w: 16, pop: 2.3, c: '#f59e0b' },
    { name: 'TR', w: 10, pop: 4.1, c: '#f97316' },
    { name: 'SK', w: 7, pop: 0.7, c: '#6366f1' },
  ];
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Project output: comparative bar chart of NE India states by area and population">
        <rect width="780" height="300" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="28" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Project Output: NE India Comparative Atlas</text>
        <line x1="80" y1="250" x2="740" y2="250" stroke="#64748b" strokeWidth="1" />
        {states.map((s, i) => {
          const x = 95 + i * 80;
          const areaH = (s.w / 90) * 180;
          const popH = (s.pop / 40) * 180;
          return (<g key={i}>
            <rect x={x} y={250 - areaH} width="25" height={areaH} fill={s.c} fillOpacity="0.4" rx="2" />
            <rect x={x + 28} y={250 - popH} width="25" height={popH} fill={s.c} fillOpacity="0.8" rx="2" />
            <text x={x + 25} y={268} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">{s.name}</text>
          </g>);
        })}
        <rect x="500" y="42" width="15" height="10" fill="#94a3b8" fillOpacity="0.4" /><text x="520" y="51" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Area</text>
        <rect x="570" y="42" width="15" height="10" fill="#94a3b8" fillOpacity="0.8" /><text x="590" y="51" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Population</text>
        <text x="390" y="290" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Assam has the largest population but not the largest area {'\u2014'} density varies dramatically across the region</text>
      </svg>
    </div>
  );
}
