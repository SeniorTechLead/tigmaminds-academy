/**
 * Interactive diagram showing what INSERT, UPDATE, and DELETE do to a table.
 * Students click each operation and see the table change with the affected row highlighted.
 */
import { useState } from 'react';

type Op = 'none' | 'insert' | 'update' | 'delete';

interface Row {
  id: number;
  name: string;
  weight: number;
  park: string;
}

const INITIAL_ROWS: Row[] = [
  { id: 1, name: 'Ranga', weight: 4500, park: 'Kaziranga' },
  { id: 2, name: 'Mohini', weight: 3800, park: 'Manas' },
  { id: 3, name: 'Gaja', weight: 5200, park: 'Kaziranga' },
];

const opInfo: Record<Op, { sql: string; desc: string }> = {
  none: { sql: 'SELECT * FROM elephants;', desc: 'Original table — 3 rows.' },
  insert: {
    sql: "INSERT INTO elephants (id, name, weight, park)\nVALUES (4, 'Tara', 4100, 'Kaziranga');",
    desc: 'A new row is added at the bottom.',
  },
  update: {
    sql: "UPDATE elephants SET weight = 4600\nWHERE name = 'Ranga';",
    desc: "Ranga's weight changes from 4500 → 4600. Only the matching row is modified.",
  },
  delete: {
    sql: "DELETE FROM elephants\nWHERE name = 'Mohini';",
    desc: 'Mohini\'s row is removed entirely. The other rows are untouched.',
  },
};

function getRows(op: Op): { rows: Row[]; highlightId: number | null; highlightType: 'insert' | 'update' | 'delete' | null } {
  switch (op) {
    case 'insert':
      return {
        rows: [...INITIAL_ROWS, { id: 4, name: 'Tara', weight: 4100, park: 'Kaziranga' }],
        highlightId: 4,
        highlightType: 'insert',
      };
    case 'update':
      return {
        rows: INITIAL_ROWS.map(r => r.name === 'Ranga' ? { ...r, weight: 4600 } : r),
        highlightId: 1,
        highlightType: 'update',
      };
    case 'delete':
      return {
        rows: INITIAL_ROWS.filter(r => r.name !== 'Mohini'),
        highlightId: 2,
        highlightType: 'delete',
      };
    default:
      return { rows: INITIAL_ROWS, highlightId: null, highlightType: null };
  }
}

const highlightColors = {
  insert: 'bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-l-emerald-500',
  update: 'bg-amber-50 dark:bg-amber-900/30 border-l-4 border-l-amber-500',
  delete: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-l-red-500 line-through opacity-50',
};

export default function SQLMutationDiagram() {
  const [op, setOp] = useState<Op>('none');
  const { rows, highlightId, highlightType } = getRows(op);
  const info = opInfo[op];

  // For delete, show the deleted row with strikethrough then the remaining
  const displayRows = op === 'delete'
    ? [...INITIAL_ROWS] // show all, but mark Mohini as deleted
    : rows;

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Click an operation to see what it does to the table</p>
      </div>

      <div className="p-5">
        {/* Operation buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { key: 'none' as Op, label: 'Original', color: 'gray' },
            { key: 'insert' as Op, label: 'INSERT', color: 'emerald' },
            { key: 'update' as Op, label: 'UPDATE', color: 'amber' },
            { key: 'delete' as Op, label: 'DELETE', color: 'red' },
          ]).map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setOp(key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                op === key
                  ? color === 'emerald' ? 'bg-emerald-500 text-white'
                    : color === 'amber' ? 'bg-amber-500 text-white'
                    : color === 'red' ? 'bg-red-500 text-white'
                    : 'bg-gray-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* SQL statement */}
        <pre className="text-xs font-mono bg-gray-900 text-gray-100 rounded-lg p-3 mb-3 whitespace-pre">{info.sql}</pre>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">{info.desc}</p>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                {['id', 'name', 'weight', 'park'].map(col => (
                  <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs font-mono">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((r, i) => {
                const isHighlighted = r.id === highlightId;
                const isDeleted = op === 'delete' && r.name === 'Mohini';
                const baseClass = i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50';
                const rowClass = isDeleted
                  ? highlightColors.delete
                  : isHighlighted && highlightType
                    ? highlightColors[highlightType]
                    : baseClass;

                return (
                  <tr key={r.id} className={rowClass}>
                    <td className="px-3 py-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">{r.id}</td>
                    <td className={`px-3 py-1.5 font-mono text-xs ${isHighlighted || isDeleted ? 'font-bold' : ''} text-gray-800 dark:text-gray-200`}>{r.name}</td>
                    <td className="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-200">
                      {r.weight}
                      {isHighlighted && op === 'update' && (
                        <span className="ml-2 text-amber-600 dark:text-amber-400 text-[10px]">was 4500</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">{r.park}</td>
                  </tr>
                );
              })}
              {/* Show the new row badge for INSERT */}
              {op === 'insert' && (
                <tr>
                  <td colSpan={4} className="px-3 py-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ↑ New row added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {op === 'none' && '3 rows'}
          {op === 'insert' && '4 rows (1 added)'}
          {op === 'update' && '3 rows (1 modified)'}
          {op === 'delete' && '2 rows (1 removed)'}
        </p>
      </div>
    </div>
  );
}
