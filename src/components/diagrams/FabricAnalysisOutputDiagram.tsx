export default function FabricAnalysisOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Output of fabric analysis project showing thread count vs tensile strength for different weaves">
        <rect width="780" height="300" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="28" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Project Output: Thread Count vs Fabric Strength</text>
        <line x1="100" y1="250" x2="700" y2="250" stroke="#64748b" strokeWidth="1" />
        <line x1="100" y1="50" x2="100" y2="250" stroke="#64748b" strokeWidth="1" />
        <text x="400" y="278" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Threads per cm</text>
        {[
          { name: 'Muslin', tc: 15, str: 30, c: '#94a3b8' },
          { name: 'Cotton', tc: 30, str: 50, c: '#22c55e' },
          { name: 'Denim', tc: 40, str: 75, c: '#3b82f6' },
          { name: 'Silk', tc: 55, str: 60, c: '#f59e0b' },
          { name: 'Tawang wool', tc: 25, str: 65, c: '#ec4899' },
        ].map((f, i) => {
          const x = 100 + (f.tc / 60) * 600;
          const y = 250 - (f.str / 100) * 200;
          return (<g key={i}><circle cx={x} cy={y} r="10" fill={f.c} stroke="#fff" strokeWidth="1.5" /><text x={x} y={y - 15} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{f.name}</text></g>);
        })}
        <text x="390" y="293" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Higher thread count generally increases strength, but weave pattern matters too</text>
      </svg>
    </div>
  );
}
