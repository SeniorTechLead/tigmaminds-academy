export default function StarTelescopeDiagram() {
  const instruments = [
    { label: 'Naked Eye', aperture: '7mm', mag: 6, pupilR: 6, x: 80 },
    { label: 'Binoculars', aperture: '50mm', mag: 9, pupilR: 16, x: 230 },
    { label: 'Telescope', aperture: '200mm', mag: 13, pupilR: 32, x: 400 },
  ];

  return (
    <svg viewBox="0 0 546 340" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Telescope comparison showing bigger aperture reveals fainter stars">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Bigger Aperture = Fainter Stars Visible</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">More light collected means more stars revealed</text>

      {instruments.map((inst) => (
        <g key={inst.label}>
          {/* Aperture circle */}
          <circle cx={inst.x} cy="115" r={inst.pupilR} fill="none" stroke="#60a5fa" strokeWidth="2" />
          <circle cx={inst.x} cy="115" r={inst.pupilR} fill="#1e3a5f" opacity={0.4} />

          {/* Light rays entering */}
          {Array.from({ length: Math.min(Math.round(inst.pupilR / 3), 8) }).map((_, i) => {
            const angle = (i / Math.min(Math.round(inst.pupilR / 3), 8)) * Math.PI * 2;
            const sr = inst.pupilR * 0.6;
            return (
              <line
                key={i}
                x1={inst.x + Math.cos(angle) * (inst.pupilR + 10)}
                y1={115 + Math.sin(angle) * (inst.pupilR + 10) - 20}
                x2={inst.x + Math.cos(angle) * sr}
                y2={115 + Math.sin(angle) * sr}
                stroke="#fef3c7"
                strokeWidth="0.8"
                opacity={0.4}
              />
            );
          })}

          {/* Label */}
          <text x={inst.x} y={160} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="12" fontWeight="600">{inst.label}</text>
          <text x={inst.x} y={175} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">{inst.aperture} aperture</text>

          {/* Sky view circle */}
          <circle cx={inst.x} cy="230" r="35" fill="#020617" stroke="#334155" strokeWidth="1" />

          {/* Stars visible — more for bigger apertures */}
          {inst.label === 'Naked Eye' && (
            <g>
              {[[-10,-10],[5,-15],[15,5],[-5,10],[10,15],[-15,0]].map(([dx,dy], i) => (
                <circle key={i} cx={inst.x + dx} cy={230 + dy} r="1.5" fill="#fef3c7" opacity={0.8} />
              ))}
              <text x={inst.x} y="276" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">~5,000 stars</text>
            </g>
          )}
          {inst.label === 'Binoculars' && (
            <g>
              {[[-10,-10],[5,-15],[15,5],[-5,10],[10,15],[-15,0],[-20,8],[18,-8],[0,-20],[8,20],[-12,18],[20,-15],[-8,-22],[22,0]].map(([dx,dy], i) => (
                <circle key={i} cx={inst.x + dx} cy={230 + dy} r={i < 6 ? 1.5 : 1} fill="#fef3c7" opacity={i < 6 ? 0.8 : 0.5} />
              ))}
              <text x={inst.x} y="276" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">~100,000 stars</text>
            </g>
          )}
          {inst.label === 'Telescope' && (
            <g>
              {Array.from({ length: 30 }).map((_, i) => {
                const a = i * 137.5 * (Math.PI / 180);
                const r = 4 + (i / 30) * 28;
                return (
                  <circle key={i} cx={inst.x + Math.cos(a) * r} cy={230 + Math.sin(a) * r} r={i < 6 ? 1.5 : i < 14 ? 1 : 0.7} fill="#fef3c7" opacity={i < 6 ? 0.8 : i < 14 ? 0.5 : 0.3} />
                );
              })}
              <text x={inst.x} y="276" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">~millions</text>
            </g>
          )}

          {/* Mag limit */}
          <text x={inst.x} y="290" textAnchor="middle" fill="#60a5fa" fontSize="9">limit: mag {inst.mag}</text>
        </g>
      ))}

      {/* Arrows between */}
      <line x1="140" y1="115" x2="170" y2="115" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
      <line x1="310" y1="115" x2="340" y2="115" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
      <defs>
        <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0,0 8,3 0,6" fill="#475569" />
        </marker>
      </defs>
    </svg>
  );
}
