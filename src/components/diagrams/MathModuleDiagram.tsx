/**
 * Interactive diagram showing Python math module functions visually.
 * Number line with floor/ceil/round, plus common functions.
 */
import { useState } from 'react';

type Tab = 'rounding' | 'powers' | 'statistics';

export default function MathModuleDiagram() {
  const [tab, setTab] = useState<Tab>('rounding');

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Tab selector */}
      <div className="flex justify-center gap-1 mb-3">
        {([
          ['rounding', 'Floor / Ceil / Round'],
          ['powers', 'Powers & Roots'],
          ['statistics', 'Mean / Median'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === key
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'rounding' && <RoundingView />}
      {tab === 'powers' && <PowersView />}
      {tab === 'statistics' && <StatisticsView />}
    </div>
  );
}

/* ── Rounding: number line with floor/ceil/round ── */
function RoundingView() {
  const totalW = 480;
  const lineY = 100;
  const padL = 40;
  const lineW = 400;

  const value = 3.7;
  const floor = 3;
  const ceil = 4;
  const rounded = 4;

  const xOf = (v: number) => padL + ((v - 1) / 5) * lineW;

  return (
    <svg viewBox={`0 0 ${totalW} 200`} className="w-full" role="img" aria-label="Number line showing floor, ceil, and round of 3.7">
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        math.floor() / math.ceil() / round()
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontFamily="monospace">
        value = 3.7
      </text>

      {/* Number line */}
      <line x1={padL} y1={lineY} x2={padL + lineW} y2={lineY} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
      {[1, 2, 3, 4, 5, 6].map(v => (
        <g key={v}>
          <line x1={xOf(v)} y1={lineY - 5} x2={xOf(v)} y2={lineY + 5} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
          <text x={xOf(v)} y={lineY + 18} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontFamily="monospace">
            {v}
          </text>
        </g>
      ))}

      {/* Value marker (diamond) */}
      <g>
        <circle cx={xOf(value)} cy={lineY} r="5" className="fill-amber-400 stroke-amber-600" strokeWidth="2" />
        <text x={xOf(value)} y={lineY - 12} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="11" fontWeight="700">
          3.7
        </text>
      </g>

      {/* Floor arrow (down-left to 3) */}
      <g>
        <line x1={xOf(value) - 10} y1={lineY + 30} x2={xOf(floor) + 5} y2={lineY + 30}
          className="stroke-sky-400" strokeWidth="2" markerEnd="url(#floorArrow)" />
        <circle cx={xOf(floor)} cy={lineY + 30} r="4" className="fill-sky-400" />
        <text x={(xOf(value) + xOf(floor)) / 2} y={lineY + 48} textAnchor="middle"
          className="fill-sky-600 dark:fill-sky-400" fontSize="10" fontWeight="700">
          floor(3.7) = 3
        </text>
        <text x={(xOf(value) + xOf(floor)) / 2} y={lineY + 60} textAnchor="middle"
          className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          always rounds down
        </text>
      </g>

      {/* Ceil arrow (up-right to 4) */}
      <g>
        <line x1={xOf(value) + 10} y1={lineY - 30} x2={xOf(ceil) - 5} y2={lineY - 30}
          className="stroke-emerald-400" strokeWidth="2" />
        <circle cx={xOf(ceil)} cy={lineY - 30} r="4" className="fill-emerald-400" />
        <text x={(xOf(value) + xOf(ceil)) / 2} y={lineY - 42} textAnchor="middle"
          className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="700">
          ceil(3.7) = 4
        </text>
        <text x={(xOf(value) + xOf(ceil)) / 2} y={lineY - 54} textAnchor="middle"
          className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          always rounds up
        </text>
      </g>

      {/* Round indicator */}
      <g>
        <text x={xOf(rounded)} y={lineY + 80} textAnchor="middle"
          className="fill-violet-600 dark:fill-violet-400" fontSize="10" fontWeight="700">
          round(3.7) = 4
        </text>
        <text x={xOf(rounded)} y={lineY + 92} textAnchor="middle"
          className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          nearest integer (banker's rounding for .5)
        </text>
      </g>
    </svg>
  );
}

/* ── Powers & Roots visual ── */
function PowersView() {
  const totalW = 480;

  const funcs = [
    { fn: 'math.sqrt(16)', result: '4.0', visual: '√16', color: 'emerald', desc: 'Square root' },
    { fn: 'math.pow(2, 10)', result: '1024.0', visual: '2¹⁰', color: 'sky', desc: 'Power (float)' },
    { fn: '2 ** 10', result: '1024', visual: '2¹⁰', color: 'sky', desc: 'Power (int)' },
    { fn: 'math.log(100, 10)', result: '2.0', visual: 'log₁₀100', color: 'violet', desc: 'Logarithm' },
    { fn: 'math.log2(256)', result: '8.0', visual: 'log₂256', color: 'violet', desc: 'Base-2 log' },
    { fn: 'abs(-42)', result: '42', visual: '|-42|', color: 'amber', desc: 'Absolute value' },
  ];

  return (
    <svg viewBox={`0 0 ${totalW} 230`} className="w-full" role="img" aria-label="Common math functions with examples">
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Powers, Roots &amp; Logarithms
      </text>

      {funcs.map((f, i) => {
        const y = 40 + i * 30;
        const colors: Record<string, { box: string; text: string }> = {
          emerald: { box: 'fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400', text: 'fill-emerald-700 dark:fill-emerald-300' },
          sky: { box: 'fill-sky-100 dark:fill-sky-900/30 stroke-sky-400', text: 'fill-sky-700 dark:fill-sky-300' },
          violet: { box: 'fill-violet-100 dark:fill-violet-900/30 stroke-violet-400', text: 'fill-violet-700 dark:fill-violet-300' },
          amber: { box: 'fill-amber-100 dark:fill-amber-900/30 stroke-amber-400', text: 'fill-amber-700 dark:fill-amber-300' },
        };
        return (
          <g key={i}>
            {/* Visual notation */}
            <text x="55" y={y + 14} textAnchor="middle"
              className={colors[f.color].text} fontSize="14" fontWeight="700">
              {f.visual}
            </text>
            {/* Code */}
            <rect x="95" y={y} width="195" height="22" rx="5"
              className={colors[f.color].box} strokeWidth="1" />
            <text x="192" y={y + 14} textAnchor="middle"
              className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600" fontFamily="monospace">
              {f.fn}
            </text>
            {/* Arrow */}
            <text x="300" y={y + 14} className="fill-gray-400" fontSize="10">→</text>
            {/* Result */}
            <text x="320" y={y + 14}
              className="fill-gray-800 dark:fill-gray-200" fontSize="11" fontWeight="800" fontFamily="monospace">
              {f.result}
            </text>
            {/* Description */}
            <text x="395" y={y + 14}
              className="fill-gray-500 dark:fill-gray-400" fontSize="9">
              {f.desc}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Statistics basics ── */
function StatisticsView() {
  const data = [3, 5, 5, 7, 9];
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const totalW = 480;
  const lineY = 90;
  const padL = 40;
  const lineW = 400;
  const xOf = (v: number) => padL + ((v - 1) / 10) * lineW;

  return (
    <svg viewBox={`0 0 ${totalW} 210`} className="w-full" role="img" aria-label="Mean and median on a number line">
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        statistics.mean() / statistics.median()
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontFamily="monospace">
        data = [3, 5, 5, 7, 9]
      </text>

      {/* Computation */}
      <text x={totalW / 2} y="52" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
        mean = (3+5+5+7+9) ÷ 5 = {mean.toFixed(1)}    |    median = middle value = {median}
      </text>

      {/* Number line */}
      <line x1={padL} y1={lineY} x2={padL + lineW} y2={lineY} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
      {Array.from({ length: 11 }, (_, i) => i + 1).map(v => (
        <g key={v}>
          <line x1={xOf(v)} y1={lineY - 4} x2={xOf(v)} y2={lineY + 4} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
          <text x={xOf(v)} y={lineY + 16} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontFamily="monospace">{v}</text>
        </g>
      ))}

      {/* Data dots (stacked for duplicates) */}
      {(() => {
        const freq: Record<number, number> = {};
        return data.map((v, i) => {
          freq[v] = (freq[v] || 0) + 1;
          const stack = freq[v];
          return (
            <circle key={i} cx={xOf(v)} cy={lineY - 14 - (stack - 1) * 16} r="6"
              className="fill-gray-300 dark:fill-gray-600 stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
          );
        });
      })()}

      {/* Mean indicator */}
      <line x1={xOf(mean)} y1={lineY + 24} x2={xOf(mean)} y2={lineY + 50}
        className="stroke-sky-400" strokeWidth="2" />
      <circle cx={xOf(mean)} cy={lineY + 24} r="3" className="fill-sky-400" />
      <text x={xOf(mean)} y={lineY + 64} textAnchor="middle"
        className="fill-sky-600 dark:fill-sky-400" fontSize="10" fontWeight="700">
        mean = {mean.toFixed(1)}
      </text>

      {/* Median indicator */}
      <line x1={xOf(median)} y1={lineY + 74} x2={xOf(median)} y2={lineY + 96}
        className="stroke-emerald-400" strokeWidth="2" />
      <circle cx={xOf(median)} cy={lineY + 74} r="3" className="fill-emerald-400" />
      <text x={xOf(median)} y={lineY + 110} textAnchor="middle"
        className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="700">
        median = {median}
      </text>

      {/* Insight */}
      <text x={totalW / 2} y="196" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
        Mean is sensitive to outliers. Median is robust — use median for skewed data.
      </text>
    </svg>
  );
}
