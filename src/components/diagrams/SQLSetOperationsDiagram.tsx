/**
 * Interactive Venn diagram showing UNION, INTERSECT, EXCEPT, UNION ALL.
 * Two queries produce two result sets — the set operation combines them.
 */
import { useState } from 'react';

type Op = 'union' | 'intersect' | 'except' | 'union-all';

const queryA = { label: 'Query A', desc: "Kaziranga elephants", items: ['Ranga', 'Gaja', 'Tara'] };
const queryB = { label: 'Query B', desc: "Elephants > 4000kg", items: ['Ranga', 'Gaja', 'Tara', 'Mohini'].filter(n => ['Ranga', 'Gaja', 'Tara'].includes(n)).length > 0
  ? ['Ranga', 'Gaja', 'Tara']  // Let me fix this properly
  : [] };

// Recalculate properly
const setA = ['Ranga', 'Gaja', 'Tara']; // Kaziranga elephants
const setB = ['Ranga', 'Gaja', 'Tara']; // weight > 4000 (Ranga 4500, Gaja 5200, Tara 4100)
// These overlap too much — let me use better sets

const elephantsA = ['Ranga', 'Gaja', 'Tara']; // Kaziranga park
const elephantsB = ['Ranga', 'Gaja', 'Mohini']; // Have sightings (Tara has 0, Bala has 1 but let's use Ranga, Gaja, Mohini for cleaner demo)

const onlyA = elephantsA.filter(x => !elephantsB.includes(x)); // ['Tara']
const onlyB = elephantsB.filter(x => !elephantsA.includes(x)); // ['Mohini']
const both = elephantsA.filter(x => elephantsB.includes(x));   // ['Ranga', 'Gaja']

const opInfo: Record<Op, { label: string; sql: string; result: string[]; desc: string; vennHighlight: 'all' | 'both' | 'onlyA' | 'allDups' }> = {
  union: {
    label: 'UNION',
    sql: "SELECT name FROM elephants WHERE park = 'Kaziranga'\nUNION\nSELECT e.name FROM elephants e JOIN sightings s ON e.id = s.elephant_id;",
    result: [...new Set([...elephantsA, ...elephantsB])].sort(),
    desc: 'All names from both queries, duplicates removed. Ranga and Gaja appear in both but show up only once.',
    vennHighlight: 'all',
  },
  intersect: {
    label: 'INTERSECT',
    sql: "SELECT name FROM elephants WHERE park = 'Kaziranga'\nINTERSECT\nSELECT e.name FROM elephants e JOIN sightings s ON e.id = s.elephant_id;",
    result: both.sort(),
    desc: 'Only names that appear in BOTH results. Ranga and Gaja are in Kaziranga AND have sightings.',
    vennHighlight: 'both',
  },
  except: {
    label: 'EXCEPT',
    sql: "SELECT name FROM elephants WHERE park = 'Kaziranga'\nEXCEPT\nSELECT e.name FROM elephants e JOIN sightings s ON e.id = s.elephant_id;",
    result: onlyA,
    desc: 'Names in A but NOT in B. Tara is in Kaziranga but has no sightings.',
    vennHighlight: 'onlyA',
  },
  'union-all': {
    label: 'UNION ALL',
    sql: "SELECT name FROM elephants WHERE park = 'Kaziranga'\nUNION ALL\nSELECT e.name FROM elephants e JOIN sightings s ON e.id = s.elephant_id;",
    result: [...elephantsA, ...elephantsB].sort(),
    desc: 'All names from both, keeping duplicates. Ranga and Gaja appear twice — once from each query.',
    vennHighlight: 'allDups',
  },
};

export default function SQLSetOperationsDiagram() {
  const [op, setOp] = useState<Op>('union');
  const info = opInfo[op];

  const circleR = 55;
  const cx1 = 90;
  const cx2 = 160;
  const cy = 70;

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Set Operations: Combine Two Query Results</p>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(opInfo) as Op[]).map(k => (
            <button key={k} onClick={() => setOp(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                op === k ? 'bg-violet-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>{opInfo[k].label}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Venn diagram */}
          <svg viewBox="0 0 250 150" className="w-full max-w-xs mx-auto" role="img" aria-label={`Venn diagram showing ${info.label}`}>
            {/* Circle A */}
            <circle cx={cx1} cy={cy} r={circleR}
              className={`stroke-sky-400 stroke-2 ${
                info.vennHighlight === 'all' || info.vennHighlight === 'onlyA' || info.vennHighlight === 'allDups' ? 'fill-sky-100 dark:fill-sky-900/30' : 'fill-sky-50/30 dark:fill-sky-900/10'
              }`} fillOpacity={info.vennHighlight === 'both' ? 0.15 : 0.5} />

            {/* Circle B */}
            <circle cx={cx2} cy={cy} r={circleR}
              className={`stroke-emerald-400 stroke-2 ${
                info.vennHighlight === 'all' || info.vennHighlight === 'allDups' ? 'fill-emerald-100 dark:fill-emerald-900/30' : 'fill-emerald-50/30 dark:fill-emerald-900/10'
              }`} fillOpacity={info.vennHighlight === 'both' || info.vennHighlight === 'onlyA' ? 0.15 : 0.5} />

            {/* Intersection highlight */}
            {(info.vennHighlight === 'both' || info.vennHighlight === 'all' || info.vennHighlight === 'allDups') && (
              <clipPath id="clipA"><circle cx={cx1} cy={cy} r={circleR} /></clipPath>
            )}
            {(info.vennHighlight === 'both' || info.vennHighlight === 'all' || info.vennHighlight === 'allDups') && (
              <circle cx={cx2} cy={cy} r={circleR} clipPath="url(#clipA)"
                className="fill-amber-200 dark:fill-amber-800/40" fillOpacity={0.7} />
            )}

            {/* Labels */}
            <text x={cx1 - 25} y={cy - 5} className="fill-sky-700 dark:fill-sky-300" fontSize="9" fontWeight="700">A</text>
            <text x={cx1 - 25} y={cy + 7} className="fill-sky-600 dark:fill-sky-400" fontSize="7">Kaziranga</text>
            <text x={cx2 + 10} y={cy - 5} className="fill-emerald-700 dark:fill-emerald-300" fontSize="9" fontWeight="700">B</text>
            <text x={cx2 + 10} y={cy + 7} className="fill-emerald-600 dark:fill-emerald-400" fontSize="7">Has sightings</text>

            {/* Names in sections */}
            <text x={cx1 - 30} y={cy + 25} className="fill-sky-600 dark:fill-sky-400" fontSize="8" fontWeight={info.vennHighlight === 'onlyA' ? '800' : '500'}>Tara</text>
            <text x={(cx1 + cx2) / 2} y={cy - 5} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="8" fontWeight={info.vennHighlight === 'both' ? '800' : '500'}>Ranga</text>
            <text x={(cx1 + cx2) / 2} y={cy + 8} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="8" fontWeight={info.vennHighlight === 'both' ? '800' : '500'}>Gaja</text>
            <text x={cx2 + 15} y={cy + 25} className="fill-emerald-600 dark:fill-emerald-400" fontSize="8">Mohini</text>

            {/* Operation label */}
            <text x="125" y="142" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="700">{info.label}</text>
          </svg>

          {/* Result */}
          <div>
            <pre className="text-[10px] font-mono bg-gray-900 text-gray-300 rounded-lg p-2 mb-3 whitespace-pre">{info.sql}</pre>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-3 py-1.5 text-left text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">name</th>
                  </tr>
                </thead>
                <tbody>
                  {info.result.map((name, i) => (
                    <tr key={`${name}-${i}`} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                      <td className="px-3 py-1 font-mono text-xs text-gray-800 dark:text-gray-200">
                        {name}
                        {op === 'union-all' && elephantsA.includes(name) && elephantsB.includes(name) && i >= elephantsA.length &&
                          <span className="text-amber-500 text-[10px] ml-2">(duplicate)</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{info.result.length} row{info.result.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300">{info.desc}</p>
      </div>
    </div>
  );
}
