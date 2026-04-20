import { useState } from 'react';

// ── Click Inside a Table ──────────────────────────────────────
// Interactive table. Click column headers or cells to see what
// each part is called (primary key, foreign key, column, row,
// data type, cell). Row hover highlights the whole row.

type Part = 'pk' | 'fk' | 'column' | 'row' | 'cell' | 'datatype' | null;

const INFO: Record<string, { title: string; desc: string; color: string }> = {
  pk: {
    title: 'Primary Key',
    desc: 'A column that uniquely identifies each row. No two rows can have the same primary key value. The database uses this to find any row instantly.',
    color: '#f59e0b',
  },
  fk: {
    title: 'Foreign Key',
    desc: 'A column that references the primary key of another table. It\'s how tables connect to each other — the glue of a relational database.',
    color: '#8b5cf6',
  },
  column: {
    title: 'Column',
    desc: 'A category of data (name, age, weight). Every row has a value for every column. All values in one column must be the same type.',
    color: '#3b82f6',
  },
  row: {
    title: 'Row (Record)',
    desc: 'A single record — one individual thing. One elephant, one student, one order. Every table is a list of rows.',
    color: '#10b981',
  },
  cell: {
    title: 'Cell',
    desc: 'One piece of data — the intersection of a row and a column. This is the smallest unit of a database.',
    color: '#ec4899',
  },
  datatype: {
    title: 'Data Type',
    desc: 'The KIND of value a column holds: INTEGER for whole numbers, TEXT for strings, REAL for decimals, DATE for dates. The database enforces the type.',
    color: '#14b8a6',
  },
};

const ROWS = [
  { id: 1, name: 'Ranga', weight: 5200, park_id: 1 },
  { id: 2, name: 'Tara', weight: 3800, park_id: 1 },
  { id: 3, name: 'Bali', weight: 4650, park_id: 2 },
  { id: 4, name: 'Kavita', weight: 4100, park_id: 2 },
];

export default function SQLTableDiagram() {
  const [selected, setSelected] = useState<Part>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  const opacity = (part: Part) =>
    selected === null ? 1 : selected === part ? 1 : 0.35;

  return (
    <div className="bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 dark:from-sky-950 dark:via-slate-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
          Click Inside a Table
        </p>
        {selected && (
          <button
            onClick={() => setSelected(null)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-300 dark:border-slate-700 overflow-hidden min-w-max">
            {/* Table name header */}
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b-2 border-slate-300 dark:border-slate-700 font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
              elephants
            </div>

            {/* Column headers */}
            <div className="flex border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              {[
                { key: 'id', label: 'id', type: 'INTEGER', isPK: true },
                { key: 'name', label: 'name', type: 'TEXT', isPK: false },
                { key: 'weight', label: 'weight', type: 'INTEGER', isPK: false },
                { key: 'park_id', label: 'park_id', type: 'INTEGER', isFK: true },
              ].map(col => (
                <div key={col.key}
                  onClick={() => setSelected(col.isPK ? 'pk' : col.isFK ? 'fk' : 'column')}
                  className={`flex-1 min-w-[80px] px-3 py-2 cursor-pointer transition font-mono text-xs font-bold select-none hover:bg-blue-50 dark:hover:bg-blue-900/20 border-r border-slate-200 dark:border-slate-700 last:border-r-0`}
                  style={{
                    opacity: opacity(col.isPK ? 'pk' : col.isFK ? 'fk' : 'column'),
                    background: selected === 'column' && !col.isPK && !col.isFK ? '#dbeafe' :
                              selected === 'pk' && col.isPK ? '#fef3c7' :
                              selected === 'fk' && col.isFK ? '#ede9fe' : undefined,
                  }}>
                  <div className="flex items-center gap-1">
                    {col.isPK && <span title="PK" className="text-amber-500">🔑</span>}
                    {col.isFK && <span title="FK" className="text-purple-500">🔗</span>}
                    <span className="text-slate-900 dark:text-slate-100">{col.label}</span>
                  </div>
                  <div
                    onClick={(e) => { e.stopPropagation(); setSelected('datatype'); }}
                    className="text-[10px] text-teal-600 dark:text-teal-400 font-normal mt-0.5 cursor-pointer"
                    style={{ opacity: opacity('datatype') }}>
                    {col.type}
                  </div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {ROWS.map((r, i) => (
              <div key={r.id}
                onClick={() => setSelected('row')}
                onMouseEnter={() => setHoverRow(i)}
                onMouseLeave={() => setHoverRow(null)}
                className={`flex border-b border-slate-100 dark:border-slate-700 last:border-b-0 cursor-pointer transition ${
                  hoverRow === i ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                }`}
                style={{ opacity: opacity('row') }}>
                {Object.entries(r).map(([k, v], j) => (
                  <div key={j}
                    onClick={(e) => { e.stopPropagation(); setSelected('cell'); }}
                    className="flex-1 min-w-[80px] px-3 py-2 font-mono text-sm text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-700 last:border-r-0 hover:ring-2 hover:ring-pink-500/50 transition"
                    style={{
                      background: selected === 'cell' ? '#fce7f3' : undefined,
                      opacity: opacity('cell'),
                    }}>
                    {v}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Click any part — column header, cell, row, or the data type
          </p>
        </div>

        {/* Info panel */}
        <div className="flex-1 min-w-[200px] max-w-sm">
          {selected ? (
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-4 border border-white/10 h-full">
              <h3 className="text-lg font-bold mb-2" style={{ color: INFO[selected].color }}>
                {INFO[selected].title}
              </h3>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {INFO[selected].desc}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8 h-full flex items-center justify-center">
              Click anywhere in the table to explore
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
