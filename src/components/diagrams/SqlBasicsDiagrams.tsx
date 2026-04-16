import { useState, useEffect, useCallback } from 'react';

const DARK_BG = 'bg-white dark:bg-gray-900';
const CELL = 'px-3 py-1.5 text-xs font-mono transition-all duration-500';
const HEADER = 'px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400';
const LABEL = 'text-[10px] font-bold uppercase tracking-wider';

const elephants = [
  { id: 1, name: 'Ranga', weight: 4500, park: 'Kaziranga' },
  { id: 2, name: 'Mohini', weight: 3800, park: 'Manas' },
  { id: 3, name: 'Gaja', weight: 5200, park: 'Kaziranga' },
  { id: 4, name: 'Tara', weight: 4100, park: 'Kaziranga' },
  { id: 5, name: 'Bala', weight: 3200, park: 'Manas' },
];

/* ════════════════════════════════════════════
   1. SelectWhereDiagram — rows highlight as filter applies
   ════════════════════════════════════════════ */
export function SelectWhereDiagram() {
  const filters = [
    { label: 'SELECT * FROM elephants', where: null, cols: ['id', 'name', 'weight', 'park'] },
    { label: "WHERE park = 'Kaziranga'", where: (e: typeof elephants[0]) => e.park === 'Kaziranga', cols: ['id', 'name', 'weight', 'park'] },
    { label: 'WHERE weight > 4000', where: (e: typeof elephants[0]) => e.weight > 4000, cols: ['id', 'name', 'weight', 'park'] },
    { label: 'SELECT name, weight', where: null, cols: ['name', 'weight'] },
  ];

  const [step, setStep] = useState(0);
  const filter = filters[step];

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-lg mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>elephants table</span>
        <div className="flex gap-1">
          {filters.map((f, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`px-2 py-1 rounded text-[10px] font-mono ${i === step ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              {['id', 'name', 'weight', 'park'].map(col => (
                <th key={col} className={`${HEADER} ${filter.cols.includes(col) ? 'text-cyan-400' : 'text-gray-600'}`}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {elephants.map((e, i) => {
              const matches = !filter.where || filter.where(e);
              return (
                <tr key={e.id} className={`border-b border-gray-200 dark:border-gray-800 transition-all duration-500 ${
                  matches ? 'bg-cyan-900/20' : 'opacity-30'
                }`}>
                  {(['id', 'name', 'weight', 'park'] as const).map(col => (
                    <td key={col} className={`${CELL} ${
                      filter.cols.includes(col)
                        ? (matches ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600')
                        : 'text-gray-700'
                    }`}>
                      {e[col]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 font-mono text-xs text-cyan-400 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
        {filter.label}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {!filter.where && filter.cols.length === 4 ? 'All rows, all columns — the full table' :
         filter.where ? `${elephants.filter(filter.where).length} rows match the condition` :
         `Only ${filter.cols.join(', ')} columns selected`}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   2. OrderByDiagram — rows visually reorder
   ════════════════════════════════════════════ */
export function OrderByDiagram() {
  const sorts = [
    { label: 'Original order', key: 'id' as const, asc: true },
    { label: 'ORDER BY weight ASC', key: 'weight' as const, asc: true },
    { label: 'ORDER BY weight DESC', key: 'weight' as const, asc: false },
    { label: 'ORDER BY name ASC', key: 'name' as const, asc: true },
  ];

  const [step, setStep] = useState(0);
  const sort = sorts[step];

  const sorted = [...elephants].sort((a, b) => {
    const va = a[sort.key];
    const vb = b[sort.key];
    if (typeof va === 'number' && typeof vb === 'number') return sort.asc ? va - vb : vb - va;
    return sort.asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-lg mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>ORDER BY</span>
        <div className="flex gap-1">
          {sorts.map((s, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`px-2 py-1 rounded text-[10px] ${i === step ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              {s.label.replace('ORDER BY ', '').replace('Original order', 'default')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {sorted.map((e, i) => (
          <div key={e.id}
            className="flex items-center gap-3 px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 transition-all duration-500"
            style={{ transform: `translateY(0px)` }}>
            <span className="text-[10px] text-gray-600 w-4">{i + 1}</span>
            <span className="text-sm text-gray-900 dark:text-white font-medium w-20">{e.name}</span>
            <span className={`text-sm font-mono w-16 ${sort.key === 'weight' ? 'text-amber-400' : 'text-gray-400'}`}>{e.weight}kg</span>
            <span className={`text-xs ${sort.key === 'name' ? 'text-amber-400' : 'text-gray-500'}`}>{e.park}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 font-mono text-xs text-amber-400 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
        {sort.label}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   3. GroupByDiagram — rows slide into groups
   ════════════════════════════════════════════ */
export function GroupByDiagram() {
  const [grouped, setGrouped] = useState(false);

  const parks = ['Kaziranga', 'Manas'];
  const groups = parks.map(p => ({
    park: p,
    members: elephants.filter(e => e.park === p),
    count: elephants.filter(e => e.park === p).length,
    avgWeight: Math.round(elephants.filter(e => e.park === p).reduce((s, e) => s + e.weight, 0) / elephants.filter(e => e.park === p).length),
  }));

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-lg mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>GROUP BY park</span>
        <button onClick={() => setGrouped(!grouped)}
          className={`px-3 py-1 rounded text-[10px] font-semibold ${grouped ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
          {grouped ? 'Grouped' : 'Click to GROUP BY'}
        </button>
      </div>

      {!grouped ? (
        <div className="space-y-1">
          {elephants.map(e => (
            <div key={e.id} className="flex items-center gap-3 px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800">
              <span className="text-sm text-gray-900 dark:text-white w-20">{e.name}</span>
              <span className="text-xs text-gray-400 w-16">{e.weight}kg</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                e.park === 'Kaziranga' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-blue-900/50 text-blue-400'
              }`}>{e.park}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(g => (
            <div key={g.park} className={`rounded-lg border-2 p-3 transition-all duration-500 ${
              g.park === 'Kaziranga' ? 'border-emerald-600 bg-emerald-900/10' : 'border-blue-600 bg-blue-900/10'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold ${g.park === 'Kaziranga' ? 'text-emerald-400' : 'text-blue-400'}`}>{g.park}</span>
                <div className="flex gap-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">COUNT: <span className="text-gray-900 dark:text-white font-bold">{g.count}</span></span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">AVG: <span className="text-gray-900 dark:text-white font-bold">{g.avgWeight}kg</span></span>
                </div>
              </div>
              <div className="flex gap-2">
                {g.members.map(e => (
                  <span key={e.id} className="text-[10px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{e.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 font-mono text-xs text-emerald-400 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
        {grouped ? 'SELECT park, COUNT(*), AVG(weight) FROM elephants GROUP BY park' : 'SELECT * FROM elephants'}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   4. JoinDiagram — two tables connecting
   ════════════════════════════════════════════ */
export function JoinDiagram() {
  const leftTable = [
    { id: 1, name: 'Ranga', park_id: 1 },
    { id: 2, name: 'Mohini', park_id: 2 },
    { id: 3, name: 'Gaja', park_id: 1 },
  ];
  const rightTable = [
    { id: 1, name: 'Kaziranga', state: 'Assam' },
    { id: 2, name: 'Manas', state: 'Assam' },
    { id: 3, name: 'Nameri', state: 'Assam' },
  ];

  const [showJoin, setShowJoin] = useState(false);
  const [highlight, setHighlight] = useState<number | null>(null);

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-xl mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>JOIN</span>
        <button onClick={() => { setShowJoin(!showJoin); setHighlight(null); }}
          className={`px-3 py-1 rounded text-[10px] font-semibold ${showJoin ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
          {showJoin ? 'Joined' : 'Click to JOIN'}
        </button>
      </div>

      {!showJoin ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Left table */}
          <div>
            <p className="text-[10px] font-bold text-cyan-400 mb-2">elephants</p>
            <table className="w-full">
              <thead><tr className="border-b border-gray-300 dark:border-gray-700">
                <th className={HEADER}>name</th><th className={HEADER}>park_id</th>
              </tr></thead>
              <tbody>
                {leftTable.map(r => (
                  <tr key={r.id} className={`border-b border-gray-200 dark:border-gray-800 cursor-pointer transition-all ${
                    highlight === r.park_id ? 'bg-purple-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`} onMouseEnter={() => setHighlight(r.park_id)} onMouseLeave={() => setHighlight(null)}>
                    <td className={`${CELL} text-gray-900 dark:text-white`}>{r.name}</td>
                    <td className={`${CELL} ${highlight === r.park_id ? 'text-purple-400 font-bold' : 'text-gray-400'}`}>{r.park_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right table */}
          <div>
            <p className="text-[10px] font-bold text-amber-400 mb-2">parks</p>
            <table className="w-full">
              <thead><tr className="border-b border-gray-300 dark:border-gray-700">
                <th className={HEADER}>id</th><th className={HEADER}>name</th><th className={HEADER}>state</th>
              </tr></thead>
              <tbody>
                {rightTable.map(r => (
                  <tr key={r.id} className={`border-b border-gray-200 dark:border-gray-800 transition-all ${
                    highlight === r.id ? 'bg-purple-900/30' : ''
                  }`}>
                    <td className={`${CELL} ${highlight === r.id ? 'text-purple-400 font-bold' : 'text-gray-400'}`}>{r.id}</td>
                    <td className={`${CELL} text-gray-900 dark:text-white`}>{r.name}</td>
                    <td className={`${CELL} text-gray-500 dark:text-gray-400`}>{r.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[10px] font-bold text-purple-400 mb-2">elephants JOIN parks ON park_id = parks.id</p>
          <table className="w-full">
            <thead><tr className="border-b border-gray-300 dark:border-gray-700">
              <th className={`${HEADER} text-cyan-400`}>name</th>
              <th className={`${HEADER} text-purple-400`}>park_id</th>
              <th className={`${HEADER} text-amber-400`}>park</th>
              <th className={`${HEADER} text-amber-400`}>state</th>
            </tr></thead>
            <tbody>
              {leftTable.map(l => {
                const r = rightTable.find(r => r.id === l.park_id)!;
                return (
                  <tr key={l.id} className="border-b border-gray-200 dark:border-gray-800 bg-purple-900/10">
                    <td className={`${CELL} text-gray-900 dark:text-white`}>{l.name}</td>
                    <td className={`${CELL} text-purple-400`}>{l.park_id}</td>
                    <td className={`${CELL} text-gray-900 dark:text-white`}>{r.name}</td>
                    <td className={`${CELL} text-gray-500 dark:text-gray-400`}>{r.state}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            Nameri has no elephants — it does not appear in an INNER JOIN.
            Use LEFT JOIN to include it with NULLs.
          </p>
        </div>
      )}

      <div className="mt-3 font-mono text-xs text-purple-400 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
        {showJoin
          ? 'SELECT e.name, p.name AS park, p.state FROM elephants e JOIN parks p ON e.park_id = p.id'
          : 'Hover over park_id to see the connection'}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   5. SubqueryDiagram — nested query boxes
   ════════════════════════════════════════════ */
export function SubqueryDiagram() {
  const [phase, setPhase] = useState(0);
  // Phase 0: show the full query
  // Phase 1: inner query executes → result
  // Phase 2: outer query uses result

  const run = () => {
    setPhase(0);
    setTimeout(() => setPhase(1), 600);
    setTimeout(() => setPhase(2), 1800);
  };

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-lg mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>Subquery</span>
        <button onClick={run}
          className="px-3 py-1 rounded text-[10px] font-semibold bg-gray-200 dark:bg-gray-800 text-orange-400 hover:bg-gray-300 dark:hover:bg-gray-700">
          ▶ Run step-by-step
        </button>
      </div>

      {/* The nested query */}
      <div className={`rounded-lg border-2 p-3 transition-all duration-500 ${
        phase >= 2 ? 'border-orange-500 bg-orange-900/10' : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800'
      }`}>
        <p className="text-[10px] text-gray-500 mb-1">Outer query</p>
        <p className="font-mono text-xs text-orange-300">
          SELECT name, weight FROM elephants
        </p>
        <p className="font-mono text-xs text-orange-300">
          WHERE weight {'>'} (
        </p>

        {/* Inner query box */}
        <div className={`ml-4 my-2 rounded border-2 p-2 transition-all duration-500 ${
          phase >= 1 ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-100/50 dark:bg-gray-800/50'
        }`}>
          <p className="text-[10px] text-gray-500 mb-1">Inner query {phase >= 1 ? '→ executes first!' : ''}</p>
          <p className="font-mono text-xs text-cyan-300">SELECT AVG(weight) FROM elephants</p>
          {phase >= 1 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-gray-500">Result:</span>
              <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded">4160.0</span>
            </div>
          )}
        </div>

        <p className="font-mono text-xs text-orange-300">)</p>

        {phase >= 2 && (
          <div className="mt-2 border-t border-gray-700 pt-2">
            <p className="text-[10px] text-gray-500 mb-1">Becomes: WHERE weight {'>'} 4160.0</p>
            <div className="space-y-1">
              {elephants.filter(e => e.weight > 4160).map(e => (
                <div key={e.id} className="flex gap-3 text-xs">
                  <span className="text-gray-900 dark:text-white font-medium">{e.name}</span>
                  <span className="text-orange-400">{e.weight}kg</span>
                  <span className="text-emerald-400">✓ above average</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   6. MutateDiagram — INSERT, UPDATE, DELETE
   ════════════════════════════════════════════ */
export function MutateDiagram() {
  const [rows, setRows] = useState([...elephants]);
  const [lastAction, setLastAction] = useState('');
  const [flash, setFlash] = useState<{ id: number; type: 'insert' | 'update' | 'delete' } | null>(null);

  const insert = () => {
    const newRow = { id: rows.length + 1, name: 'Nandi', weight: 3900, park: 'Nameri' };
    setRows(prev => [...prev, newRow]);
    setFlash({ id: newRow.id, type: 'insert' });
    setLastAction("INSERT INTO elephants VALUES (6, 'Nandi', 3900, 'Nameri')");
    setTimeout(() => setFlash(null), 1500);
  };

  const update = () => {
    setRows(prev => prev.map(r => r.name === 'Ranga' ? { ...r, weight: 4700 } : r));
    setFlash({ id: 1, type: 'update' });
    setLastAction("UPDATE elephants SET weight = 4700 WHERE name = 'Ranga'");
    setTimeout(() => setFlash(null), 1500);
  };

  const del = () => {
    const target = rows.find(r => r.name === 'Nandi') || rows[rows.length - 1];
    setFlash({ id: target.id, type: 'delete' });
    setLastAction(`DELETE FROM elephants WHERE name = '${target.name}'`);
    setTimeout(() => {
      setRows(prev => prev.filter(r => r.id !== target.id));
      setFlash(null);
    }, 800);
  };

  const reset = () => {
    setRows([...elephants]);
    setFlash(null);
    setLastAction('');
  };

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-lg mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500 dark:text-gray-500`}>INSERT / UPDATE / DELETE</span>
        <div className="flex gap-1">
          <button onClick={insert} className="px-2 py-1 rounded text-[10px] bg-emerald-800 text-emerald-300 hover:bg-emerald-700">INSERT</button>
          <button onClick={update} className="px-2 py-1 rounded text-[10px] bg-amber-800 text-amber-300 hover:bg-amber-700">UPDATE</button>
          <button onClick={del} className="px-2 py-1 rounded text-[10px] bg-red-800 text-red-300 hover:bg-red-700">DELETE</button>
          <button onClick={reset} className="px-2 py-1 rounded text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Reset</button>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700">
            <th className={HEADER}>id</th><th className={HEADER}>name</th>
            <th className={HEADER}>weight</th><th className={HEADER}>park</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(e => (
            <tr key={e.id} className={`border-b border-gray-200 dark:border-gray-800 transition-all duration-500 ${
              flash?.id === e.id
                ? flash.type === 'insert' ? 'bg-emerald-900/40'
                : flash.type === 'update' ? 'bg-amber-900/40'
                : flash.type === 'delete' ? 'bg-red-900/40 opacity-50 scale-95' : ''
                : ''
            }`}>
              <td className={`${CELL} text-gray-500 dark:text-gray-500`}>{e.id}</td>
              <td className={`${CELL} text-gray-900 dark:text-white`}>{e.name}</td>
              <td className={`${CELL} ${flash?.id === e.id && flash.type === 'update' ? 'text-amber-400 font-bold' : 'text-gray-300'}`}>{e.weight}</td>
              <td className={`${CELL} text-gray-500 dark:text-gray-400`}>{e.park}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {lastAction && (
        <div className="mt-3 font-mono text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
          {lastAction}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">{rows.length} rows</p>
    </div>
  );
}
