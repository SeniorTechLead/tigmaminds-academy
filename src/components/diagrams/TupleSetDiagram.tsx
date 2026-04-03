/**
 * Interactive diagram showing tuples (immutable, ordered) vs sets (mutable, unique).
 * Left: tuple as locked boxes with indices. Right: set as a Venn-style circle with dedup.
 */
import { useState } from 'react';

export default function TupleSetDiagram() {
  const [tab, setTab] = useState<'tuple' | 'set'>('tuple');

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Toggle */}
      <div className="flex justify-center gap-2 mb-3">
        <button
          onClick={() => setTab('tuple')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'tuple'
              ? 'bg-violet-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Tuples
        </button>
        <button
          onClick={() => setTab('set')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'set'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Sets
        </button>
      </div>

      {tab === 'tuple' ? <TupleView /> : <SetView />}
    </div>
  );
}

/* ── Tuple: ordered, immutable boxes with lock icon ── */
function TupleView() {
  const items = [
    { val: '"Kaziranga"', color: 'amber' },
    { val: '26.14', color: 'sky' },
    { val: '91.74', color: 'emerald' },
  ];
  const boxW = 100;
  const boxH = 44;
  const gap = 8;
  const startX = 45;
  const totalW = startX + items.length * (boxW + gap) + 40;

  return (
    <svg viewBox={`0 0 ${totalW} 220`} className="w-full" role="img" aria-label="Tuple diagram showing ordered immutable boxes">
      {/* Title */}
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Tuple: Ordered &amp; Immutable
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        location = ("Kaziranga", 26.14, 91.74)
      </text>

      {/* Boxes */}
      {items.map((item, i) => {
        const x = startX + i * (boxW + gap);
        const y = 52;
        const fills: Record<string, string> = {
          amber: 'fill-amber-100 dark:fill-amber-900/30 stroke-amber-400',
          sky: 'fill-sky-100 dark:fill-sky-900/30 stroke-sky-400',
          emerald: 'fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400',
        };
        const texts: Record<string, string> = {
          amber: 'fill-amber-700 dark:fill-amber-300',
          sky: 'fill-sky-700 dark:fill-sky-300',
          emerald: 'fill-emerald-700 dark:fill-emerald-300',
        };
        return (
          <g key={i}>
            {/* Index above */}
            <text x={x + boxW / 2} y={y - 6} textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontFamily="monospace" fontWeight="600">
              [{i}]
            </text>
            {/* Box */}
            <rect x={x} y={y} width={boxW} height={boxH} rx="8"
              className={fills[item.color]} strokeWidth="2" />
            {/* Value */}
            <text x={x + boxW / 2} y={y + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
              className={texts[item.color]} fontSize="13" fontWeight="700" fontFamily="monospace">
              {item.val}
            </text>
            {/* Lock icon (small padlock) */}
            <g transform={`translate(${x + boxW - 14}, ${y + 4})`}>
              <rect x="2" y="5" width="8" height="6" rx="1" className="fill-gray-400 dark:fill-gray-500" />
              <path d="M3 5 V3 a3 3 0 0 1 6 0 V5" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>
        );
      })}

      {/* Unpacking demo */}
      <g transform="translate(0, 115)">
        <text x={totalW / 2} y="0" textAnchor="middle" className="fill-violet-600 dark:fill-violet-400" fontSize="11" fontWeight="700">
          Tuple Unpacking
        </text>
        <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontFamily="monospace">
          park, lat, lon = location
        </text>

        {/* Arrow from tuple to variables */}
        {items.map((item, i) => {
          const sx = startX + i * (boxW + gap) + boxW / 2;
          const varNames = ['park', 'lat', 'lon'];
          const varVals = ['"Kaziranga"', '26.14', '91.74'];
          return (
            <g key={i}>
              <line x1={sx} y1="22" x2={sx} y2="36" className="stroke-violet-300 dark:stroke-violet-600" strokeWidth="1" strokeDasharray="3 2" />
              <text x={sx} y="32" textAnchor="middle" className="fill-violet-400" fontSize="8">↓</text>
              {/* Variable box */}
              <rect x={sx - 44} y="40" width="88" height="28" rx="6"
                className="fill-violet-50 dark:fill-violet-900/20 stroke-violet-300 dark:stroke-violet-700" strokeWidth="1" />
              <text x={sx} y="52" textAnchor="middle" className="fill-violet-700 dark:fill-violet-300" fontSize="10" fontWeight="600" fontFamily="monospace">
                {varNames[i]}
              </text>
              <text x={sx} y="63" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8" fontFamily="monospace">
                = {varVals[i]}
              </text>
            </g>
          );
        })}
      </g>

      {/* Footnote */}
      <text x={totalW / 2} y="208" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
        Tuples are hashable — they can be dict keys. Lists cannot.
      </text>
    </svg>
  );
}

/* ── Set: unique, unordered, with deduplication visual ── */
function SetView() {
  const input = ['elephant', 'rhino', 'elephant', 'tiger', 'rhino', 'dolphin'];
  const unique = [...new Set(input)];

  const boxH = 22;
  const totalW = 440;
  const inputY = 50;
  const arrowY = inputY + input.length * (boxH + 3) + 10;
  const setY = arrowY + 30;

  const colors: Record<string, { bg: string; text: string }> = {
    elephant: { bg: 'fill-amber-100 dark:fill-amber-900/30 stroke-amber-400', text: 'fill-amber-700 dark:fill-amber-300' },
    rhino: { bg: 'fill-sky-100 dark:fill-sky-900/30 stroke-sky-400', text: 'fill-sky-700 dark:fill-sky-300' },
    tiger: { bg: 'fill-orange-100 dark:fill-orange-900/30 stroke-orange-400', text: 'fill-orange-700 dark:fill-orange-300' },
    dolphin: { bg: 'fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400', text: 'fill-emerald-700 dark:fill-emerald-300' },
  };

  const totalH = setY + unique.length * (boxH + 3) + 55;

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label="Set diagram showing deduplication">
      {/* Title */}
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Set: Unique Values Only
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontFamily="monospace">
        {'set(["elephant", "rhino", "elephant", "tiger", "rhino", "dolphin"])'}
      </text>

      {/* Input list (left side) */}
      <text x="50" y={inputY - 6} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">
        Input list
      </text>
      {input.map((item, i) => {
        const isDup = input.indexOf(item) !== i;
        const y = inputY + i * (boxH + 3);
        return (
          <g key={i}>
            <rect x="10" y={y} width="80" height={boxH} rx="5"
              className={colors[item].bg}
              strokeWidth="1.5" opacity={isDup ? 0.4 : 1} />
            <text x="50" y={y + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
              className={colors[item].text} fontSize="10" fontWeight="600" fontFamily="monospace"
              opacity={isDup ? 0.5 : 1}>
              {item}
            </text>
            {isDup && (
              <text x="100" y={y + boxH / 2 + 1} dominantBaseline="central"
                className="fill-red-400 dark:fill-red-500" fontSize="9" fontWeight="700">
                ✕ duplicate
              </text>
            )}
          </g>
        );
      })}

      {/* Arrow */}
      <text x="50" y={arrowY + 4} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10">
        ↓ duplicates removed
      </text>

      {/* Result set (left side) */}
      <text x="50" y={setY - 6} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">
        Result set
      </text>
      {unique.map((item, i) => {
        const y = setY + i * (boxH + 3);
        return (
          <g key={item}>
            <rect x="10" y={y} width="80" height={boxH} rx="5"
              className={colors[item].bg} strokeWidth="1.5" />
            <text x="50" y={y + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
              className={colors[item].text} fontSize="10" fontWeight="600" fontFamily="monospace">
              {item}
            </text>
          </g>
        );
      })}

      {/* Set operations (right side) */}
      <g transform={`translate(220, ${inputY})`}>
        <text x="100" y="-6" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="700">
          Set Operations
        </text>

        {/* Two overlapping circles (mini Venn) */}
        <circle cx="70" cy="55" r="42" className="fill-sky-100/50 dark:fill-sky-900/20 stroke-sky-400" strokeWidth="1.5" fillOpacity="0.5" />
        <circle cx="120" cy="55" r="42" className="fill-amber-100/50 dark:fill-amber-900/20 stroke-amber-400" strokeWidth="1.5" fillOpacity="0.5" />
        <text x="52" y="50" className="fill-sky-700 dark:fill-sky-300" fontSize="8" fontWeight="600">A only</text>
        <text x="95" y="42" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="8" fontWeight="700">A∩B</text>
        <text x="130" y="50" className="fill-amber-700 dark:fill-amber-300" fontSize="8" fontWeight="600">B only</text>

        <text x="55" y="78" className="fill-sky-600 dark:fill-sky-400" fontSize="7">A</text>
        <text x="130" y="78" className="fill-amber-600 dark:fill-amber-400" fontSize="7">B</text>

        {/* Legend */}
        {[
          { op: 'A | B', desc: 'Union (all)', y: 112 },
          { op: 'A & B', desc: 'Intersection (shared)', y: 128 },
          { op: 'A - B', desc: 'Difference (A only)', y: 144 },
          { op: 'A ^ B', desc: 'Symmetric diff', y: 160 },
        ].map(({ op, desc, y }) => (
          <g key={op}>
            <text x="20" y={y} className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="700" fontFamily="monospace">
              {op}
            </text>
            <text x="72" y={y} className="fill-gray-500 dark:fill-gray-400" fontSize="9">
              {desc}
            </text>
          </g>
        ))}
      </g>

      {/* Footnote */}
      <text x={totalW / 2} y={totalH - 8} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
        x in my_set is O(1) — instant lookup. x in my_list is O(n) — slow for big lists.
      </text>
    </svg>
  );
}
