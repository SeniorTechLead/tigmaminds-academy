import { useState } from 'react';

// ── Click Inside a Chart ──────────────────────────────────────
// Interactive anatomy of a matplotlib plot. Click any piece —
// title, x-label, y-label, axis, legend, tick, data line — to
// see what it's called and the matplotlib code that creates it.

type Part = 'title' | 'xlabel' | 'ylabel' | 'xaxis' | 'yaxis' | 'legend' | 'grid' | 'data' | 'ticks' | null;

const INFO: Record<string, { label: string; code: string; desc: string }> = {
  title: {
    label: 'Title',
    code: 'plt.title("Weight vs Age")',
    desc: 'Tells the reader what the chart is about in one line.',
  },
  xlabel: {
    label: 'X-axis label',
    code: 'plt.xlabel("Age (years)")',
    desc: 'Describes the horizontal variable. ALWAYS include units.',
  },
  ylabel: {
    label: 'Y-axis label',
    code: 'plt.ylabel("Weight (kg)")',
    desc: 'Describes the vertical variable. ALWAYS include units.',
  },
  xaxis: {
    label: 'X axis (bottom)',
    code: 'plt.xlim(0, 40)',
    desc: 'The horizontal reference line. Usually represents the independent variable.',
  },
  yaxis: {
    label: 'Y axis (left)',
    code: 'plt.ylim(0, 6000)',
    desc: 'The vertical reference line. Usually represents the dependent variable.',
  },
  legend: {
    label: 'Legend',
    code: 'plt.legend()',
    desc: 'Labels each series when you have multiple lines. Essential when comparing groups.',
  },
  grid: {
    label: 'Grid',
    code: 'plt.grid(True, alpha=0.3)',
    desc: 'Helps the reader estimate exact values. Keep it subtle (low alpha).',
  },
  data: {
    label: 'Data series',
    code: 'plt.plot(ages, weights, label="Asian elephants")',
    desc: 'The actual line, bar, or dots representing your data. This is the whole point of the chart.',
  },
  ticks: {
    label: 'Tick marks',
    code: 'plt.xticks([0, 10, 20, 30, 40])',
    desc: 'The small marks and numbers along each axis. Usually matplotlib picks these for you.',
  },
};

export default function PlotAnatomyDiagram() {
  const [selected, setSelected] = useState<Part>(null);

  const opacity = (p: Part) => selected === null ? 1 : selected === p ? 1 : 0.25;
  const W = 540, H = 340;

  // Generate a simple curve
  const points = Array.from({ length: 40 }, (_, i) => {
    const age = i + 1;
    const weight = 500 + age * 120 + Math.sin(age * 0.5) * 200;
    return { age, weight };
  });
  const xOf = (age: number) => 80 + (age / 40) * 360;
  const yOf = (w: number) => 270 - (w / 6000) * 220;

  return (
    <div className="bg-gradient-to-b from-amber-50 via-slate-50 to-emerald-50 dark:from-amber-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          Click Inside a Chart
        </p>
        {selected && (
          <button onClick={() => setSelected(null)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition">
            Reset
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {/* The plot */}
        <div className="md:col-span-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
            aria-label="Interactive matplotlib chart — click labels, axes, legend, grid, data to learn">

            {/* Chart frame */}
            <rect x={80} y={50} width={360} height={220} fill="white" className="dark:fill-slate-800" stroke="#cbd5e1" strokeWidth="1" />

            {/* Grid */}
            <g onClick={() => setSelected('grid')} className="cursor-pointer" opacity={opacity('grid')}>
              {[0, 1, 2, 3, 4].map(i => (
                <line key={`hg-${i}`}
                  x1={80} y1={50 + i * 55} x2={440} y2={50 + i * 55}
                  stroke={selected === 'grid' ? '#10b981' : '#e2e8f0'} className="dark:stroke-gray-700"
                  strokeWidth={selected === 'grid' ? 1.5 : 0.7}
                  strokeDasharray={selected === 'grid' ? '4 2' : '2 2'} />
              ))}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={`vg-${i}`}
                  x1={80 + i * 90} y1={50} x2={80 + i * 90} y2={270}
                  stroke={selected === 'grid' ? '#10b981' : '#e2e8f0'} className="dark:stroke-gray-700"
                  strokeWidth={selected === 'grid' ? 1.5 : 0.7}
                  strokeDasharray={selected === 'grid' ? '4 2' : '2 2'} />
              ))}
            </g>

            {/* Data series */}
            <g onClick={() => setSelected('data')} className="cursor-pointer" opacity={opacity('data')}>
              <polyline
                points={points.map(p => `${xOf(p.age)},${yOf(p.weight)}`).join(' ')}
                fill="none"
                stroke={selected === 'data' ? '#f59e0b' : '#3b82f6'}
                strokeWidth={selected === 'data' ? 3.5 : 2}
                style={selected === 'data' ? { filter: 'drop-shadow(0 0 4px #fbbf24)' } : undefined} />
              {selected === 'data' && points.filter((_, i) => i % 5 === 0).map((p, i) => (
                <circle key={i} cx={xOf(p.age)} cy={yOf(p.weight)} r="4" fill="#f59e0b" />
              ))}
            </g>

            {/* X axis */}
            <line x1={80} y1={270} x2={440} y2={270}
              onClick={() => setSelected('xaxis')}
              className="cursor-pointer"
              stroke={selected === 'xaxis' ? '#ef4444' : '#0f172a'} strokeWidth={selected === 'xaxis' ? 3 : 1.5}
              opacity={opacity('xaxis')} />

            {/* Y axis */}
            <line x1={80} y1={50} x2={80} y2={270}
              onClick={() => setSelected('yaxis')}
              className="cursor-pointer"
              stroke={selected === 'yaxis' ? '#ef4444' : '#0f172a'} strokeWidth={selected === 'yaxis' ? 3 : 1.5}
              opacity={opacity('yaxis')} />

            {/* X ticks */}
            <g onClick={() => setSelected('ticks')} className="cursor-pointer" opacity={opacity('ticks')}>
              {[0, 10, 20, 30, 40].map((v, i) => (
                <g key={`xt-${v}`}>
                  <line x1={80 + i * 90} y1={270} x2={80 + i * 90} y2={274}
                    stroke={selected === 'ticks' ? '#8b5cf6' : '#0f172a'}
                    strokeWidth={selected === 'ticks' ? 2.5 : 1.5} />
                  <text x={80 + i * 90} y={288} textAnchor="middle"
                    className={selected === 'ticks' ? 'fill-violet-700 dark:fill-violet-300 font-bold' : 'fill-slate-700 dark:fill-slate-300'}
                    fontSize="10">{v}</text>
                </g>
              ))}
              {/* Y ticks */}
              {[0, 2000, 4000, 6000].map(v => {
                const y = yOf(v);
                return (
                  <g key={`yt-${v}`}>
                    <line x1={76} y1={y} x2={80} y2={y}
                      stroke={selected === 'ticks' ? '#8b5cf6' : '#0f172a'}
                      strokeWidth={selected === 'ticks' ? 2.5 : 1.5} />
                    <text x={72} y={y + 3} textAnchor="end"
                      className={selected === 'ticks' ? 'fill-violet-700 dark:fill-violet-300 font-bold' : 'fill-slate-700 dark:fill-slate-300'}
                      fontSize="9">{v}</text>
                  </g>
                );
              })}
            </g>

            {/* Title */}
            <text x={260} y={35} textAnchor="middle"
              onClick={() => setSelected('title')}
              className={`cursor-pointer ${selected === 'title' ? 'fill-rose-600 dark:fill-rose-400' : 'fill-slate-900 dark:fill-slate-100'}`}
              fontSize="14" fontWeight="bold"
              opacity={opacity('title')}>
              Weight vs Age — Kaziranga elephants
            </text>

            {/* X label */}
            <text x={260} y={315} textAnchor="middle"
              onClick={() => setSelected('xlabel')}
              className={`cursor-pointer ${selected === 'xlabel' ? 'fill-rose-600 dark:fill-rose-400 font-bold' : 'fill-slate-700 dark:fill-slate-300'}`}
              fontSize="11"
              opacity={opacity('xlabel')}>
              Age (years)
            </text>

            {/* Y label — rotated */}
            <text x={25} y={160} textAnchor="middle"
              onClick={() => setSelected('ylabel')}
              className={`cursor-pointer ${selected === 'ylabel' ? 'fill-rose-600 dark:fill-rose-400 font-bold' : 'fill-slate-700 dark:fill-slate-300'}`}
              fontSize="11"
              transform="rotate(-90, 25, 160)"
              opacity={opacity('ylabel')}>
              Weight (kg)
            </text>

            {/* Legend */}
            <g onClick={() => setSelected('legend')} className="cursor-pointer" opacity={opacity('legend')}>
              <rect x={340} y={62} width={90} height={28} rx={3}
                fill="white" className="dark:fill-slate-800"
                stroke={selected === 'legend' ? '#0ea5e9' : '#cbd5e1'}
                strokeWidth={selected === 'legend' ? 2.5 : 1} />
              <line x1={346} y1={76} x2={362} y2={76} stroke="#3b82f6" strokeWidth="2" />
              <text x={368} y={80} className="fill-slate-800 dark:fill-slate-100" fontSize="10">Asian elephants</text>
            </g>
          </svg>
        </div>

        {/* Info panel */}
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          {selected ? (
            <>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Chart element
              </div>
              <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300 mb-2">
                {INFO[selected].label}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-200 mb-3">
                {INFO[selected].desc}
              </p>
              <div className="bg-slate-900 rounded p-2 font-mono text-[11px] text-amber-300">
                {INFO[selected].code}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm py-8">
              Click any part of the chart<br/>to see its matplotlib name.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
