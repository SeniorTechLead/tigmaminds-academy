/**
 * ZamzamPorosityDiagram — Compares porosity and permeability of different rock types.
 * Shows packed grains with pore spaces, and how connectivity affects water flow.
 */
export default function ZamzamPorosityDiagram() {
  const rocks = [
    { label: 'Gravel', porosity: '25-40%', perm: 'High', grains: 6, gapSize: 12, color: '#a16207', connected: true },
    { label: 'Sandstone', porosity: '10-30%', perm: 'Medium', grains: 10, gapSize: 7, color: '#ca8a04', connected: true },
    { label: 'Clay', porosity: '40-70%', perm: 'Very Low', grains: 18, gapSize: 3, color: '#64748b', connected: false },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="Porosity vs permeability comparison for gravel, sandstone, and clay">
        <rect width="400" height="260" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Porosity vs Permeability</text>
        <text x="200" y="38" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Pore space (porosity) does NOT always mean water flows easily (permeability)</text>

        {rocks.map((rock, ri) => {
          const bx = 25 + ri * 130;
          const by = 55;
          const bw = 110;
          const bh = 110;

          // Generate grain circles
          const grains: { cx: number; cy: number; r: number }[] = [];
          const r = rock.gapSize > 8 ? 14 : rock.gapSize > 5 ? 9 : 5;
          const cols = Math.ceil(Math.sqrt(rock.grains));
          for (let i = 0; i < rock.grains; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const spacing = bw / (cols + 1);
            grains.push({
              cx: bx + spacing * (col + 1) + (row % 2 === 1 ? spacing * 0.3 : 0),
              cy: by + 15 + spacing * (row + 0.5),
              r: r,
            });
          }

          return (
            <g key={ri}>
              {/* Box */}
              <rect x={bx} y={by} width={bw} height={bh} rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#94a3b8" strokeWidth="1" />

              {/* Water background for pores */}
              <rect x={bx + 1} y={by + 1} width={bw - 2} height={bh - 2} rx="5" fill="#60a5fa" opacity="0.15" />

              {/* Grains */}
              {grains.map((g, gi) => (
                <circle key={gi} cx={g.cx} cy={g.cy} r={g.r} fill={rock.color} opacity="0.7" stroke={rock.color} strokeWidth="0.5" />
              ))}

              {/* Flow arrow or X */}
              {rock.connected ? (
                <g>
                  <line x1={bx + 15} y1={by + bh + 14} x2={bx + bw - 15} y2={by + bh + 14} stroke="#3b82f6" strokeWidth="2" />
                  <polygon points={`${bx + bw - 15},${by + bh + 14} ${bx + bw - 20},${by + bh + 11} ${bx + bw - 20},${by + bh + 17}`} fill="#3b82f6" />
                  <text x={bx + bw / 2} y={by + bh + 28} textAnchor="middle" fill="#3b82f6" fontSize="9">Water flows →</text>
                </g>
              ) : (
                <g>
                  <line x1={bx + 30} y1={by + bh + 8} x2={bx + bw - 30} y2={by + bh + 22} stroke="#ef4444" strokeWidth="2" />
                  <line x1={bx + 30} y1={by + bh + 22} x2={bx + bw - 30} y2={by + bh + 8} stroke="#ef4444" strokeWidth="2" />
                  <text x={bx + bw / 2} y={by + bh + 36} textAnchor="middle" fill="#ef4444" fontSize="9">Water trapped</text>
                </g>
              )}

              {/* Label */}
              <text x={bx + bw / 2} y={by + bh + 55} textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="12" fontWeight="bold">{rock.label}</text>
              <text x={bx + bw / 2} y={by + bh + 68} textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="10">Porosity: {rock.porosity}</text>
              <text x={bx + bw / 2} y={by + bh + 80} textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="10">Permeability: {rock.perm}</text>
            </g>
          );
        })}

        {/* Key insight */}
        <text x="200" y="252" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Key: Clay has MORE pore space than gravel, but water cannot flow through it!</text>
      </svg>
    </div>
  );
}
