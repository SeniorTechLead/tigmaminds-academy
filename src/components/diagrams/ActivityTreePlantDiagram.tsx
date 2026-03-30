export default function ActivityTreePlantDiagram() {
  const steps = [
    { n: 1, title: 'Choose a spot', desc: 'Sunlight, space from walls, away from wires', icon: 'sun' },
    { n: 2, title: 'Dig the hole', desc: '2× wider than roots, same depth as pot', icon: 'dig' },
    { n: 3, title: 'Prepare the soil', desc: 'Mix in compost or cow dung for nutrients', icon: 'soil' },
    { n: 4, title: 'Place the seedling', desc: 'Keep root crown level with ground surface', icon: 'plant' },
    { n: 5, title: 'Fill and firm', desc: 'Pack soil gently, no air pockets around roots', icon: 'fill' },
    { n: 6, title: 'Water deeply', desc: 'Soak the soil, not just the surface', icon: 'water' },
  ];

  return (
    <svg viewBox="0 0 680 380" className="w-full rounded-xl">
      <rect width="680" height="380" rx="16" className="fill-white dark:fill-slate-950" />
      <text x="340" y="28" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" style={{ fontSize: 16, fontWeight: 700 }}>How to Plant a Seedling</text>
      <text x="340" y="46" textAnchor="middle" style={{ fontSize: 11 }} className="fill-gray-500 dark:fill-slate-400">Follow these steps to give your tree the best chance of survival</text>

      {steps.map((s, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 30 + col * 218;
        const y = 60 + row * 160;
        const colors = ['#FBBF24', '#A16207', '#78716C', '#22C55E', '#8B6F47', '#3B82F6'];
        const bgColors = ['#FEF3C7', '#FEF3C7', '#F5F5F4', '#F0FDF4', '#FEF3C7', '#EFF6FF'];

        return (
          <g key={i}>
            <rect x={x} y={y} width="205" height="145" rx="10" fill={bgColors[i]} className="dark:fill-slate-900" stroke={colors[i]} strokeWidth="1.5" opacity={0.9} />

            {/* Step number */}
            <circle cx={x + 20} cy={y + 20} r="14" fill={colors[i]} opacity={0.9} />
            <text x={x + 20} y={y + 25} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} fill="#fff">{s.n}</text>

            {/* Title */}
            <text x={x + 42} y={y + 25} style={{ fontSize: 12, fontWeight: 700 }} className="fill-gray-900 dark:fill-slate-50">{s.title}</text>
            <text x={x + 102} y={y + 45} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-600 dark:fill-slate-400">{s.desc}</text>

            {/* Mini illustration for each step */}
            {i === 0 && (
              <g>
                <circle cx={x + 102} cy={y + 80} r="18" fill="#FBBF24" opacity={0.3} />
                <circle cx={x + 102} cy={y + 80} r="10" fill="#FBBF24" />
                <text x={x + 102} y={y + 84} textAnchor="middle" style={{ fontSize: 10 }} fill="#92400E">☀</text>
                <rect x={x + 60} y={y + 105} width="85" height="15" rx="4" fill="#A3E635" opacity={0.5} />
                <text x={x + 102} y={y + 116} textAnchor="middle" style={{ fontSize: 10 }} fill="#365314">open ground</text>
              </g>
            )}
            {i === 1 && (
              <g>
                <path d={`M${x + 60},${y + 110} L${x + 80},${y + 70} L${x + 120},${y + 70} L${x + 145},${y + 110} Z`} fill="#8B6F47" opacity={0.3} />
                <path d={`M${x + 75},${y + 110} L${x + 88},${y + 80} L${x + 118},${y + 80} L${x + 130},${y + 110} Z`} fill="#FEF3C7" className="dark:fill-slate-800" />
                <text x={x + 102} y={y + 100} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">2× wide</text>
                <line x1={x + 72} y1={y + 112} x2={x + 133} y2={y + 112} stroke="#8B6F47" strokeWidth="1" strokeDasharray="3,2" />
              </g>
            )}
            {i === 2 && (
              <g>
                <rect x={x + 70} y={y + 75} width="65" height="45" rx="6" fill="#78716C" opacity={0.3} />
                {[0, 1, 2, 3, 4].map((d) => (
                  <circle key={d} cx={x + 82 + d * 12} cy={y + 95} r="4" fill={d % 2 === 0 ? '#8B6F47' : '#A16207'} opacity={0.6} />
                ))}
                <text x={x + 102} y={y + 115} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-600 dark:fill-slate-400">compost + soil</text>
              </g>
            )}
            {i === 3 && (
              <g>
                <rect x={x + 98} y={y + 80} width="5" height="30" fill="#6B4226" />
                <ellipse cx={x + 100} cy={y + 76} rx="14" ry="10" fill="#22C55E" opacity={0.8} />
                <path d={`M${x + 90},${y + 110} C${x + 85},${y + 118} ${x + 95},${y + 122} ${x + 100},${y + 115}`} stroke="#6B4226" strokeWidth="1.5" fill="none" />
                <path d={`M${x + 110},${y + 110} C${x + 115},${y + 118} ${x + 105},${y + 122} ${x + 100},${y + 115}`} stroke="#6B4226" strokeWidth="1.5" fill="none" />
                <line x1={x + 65} y1={y + 110} x2={x + 140} y2={y + 110} stroke="#8B6F47" strokeWidth="1.5" />
                <text x={x + 102} y={y + 135} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">crown at soil level</text>
              </g>
            )}
            {i === 4 && (
              <g>
                <rect x={x + 65} y={y + 100} width="75" height="20" rx="4" fill="#8B6F47" opacity={0.5} />
                <rect x={x + 98} y={y + 75} width="5" height="25" fill="#6B4226" />
                <ellipse cx={x + 100} cy={y + 72} rx="12" ry="9" fill="#22C55E" opacity={0.8} />
                {[75, 90, 110, 125].map((ax, ai) => (
                  <path key={ai} d={`M${x + ax},${y + 95} L${x + ax},${y + 100}`} stroke="#8B6F47" strokeWidth="2" />
                ))}
                <text x={x + 102} y={y + 132} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">firm gently</text>
              </g>
            )}
            {i === 5 && (
              <g>
                <rect x={x + 98} y={y + 70} width="5" height="35" fill="#6B4226" />
                <ellipse cx={x + 100} cy={y + 67} rx="14" ry="10" fill="#22C55E" opacity={0.8} />
                {[0, 1, 2, 3, 4].map((w) => (
                  <circle key={w} cx={x + 72 + w * 14} cy={y + 108 + Math.sin(w) * 3} r="3" fill="#3B82F6" opacity={0.5} />
                ))}
                <path d={`M${x + 130},${y + 80} C${x + 140},${y + 90} ${x + 125},${y + 95} ${x + 120},${y + 100}`} stroke="#3B82F6" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
                <text x={x + 102} y={y + 132} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">soak the roots</text>
              </g>
            )}

            {/* Arrow to next step */}
            {i < 5 && i !== 2 && (
              <path d={`M${x + 208},${y + 72} L${x + 218},${y + 72}`} stroke="#9CA3AF" strokeWidth="1.5" markerEnd="url(#arrowTP)" />
            )}
          </g>
        );
      })}

      {/* Arrows from row 1 to row 2 */}
      <path d="M340,200 C340,215 340,215 120,220" stroke="#9CA3AF" strokeWidth="1.5" markerEnd="url(#arrowTP)" strokeDasharray="4,3" />

      <defs>
        <marker id="arrowTP" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#9CA3AF" /></marker>
      </defs>
    </svg>
  );
}
