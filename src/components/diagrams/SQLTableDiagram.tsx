/**
 * Visual diagram showing a database table with columns, rows, primary key,
 * and data type annotations. Uses an "elephants" table as the example.
 */
export default function SQLTableDiagram() {
  const columns = [
    { name: 'id', type: 'INTEGER', pk: true },
    { name: 'name', type: 'TEXT', pk: false },
    { name: 'weight', type: 'REAL', pk: false },
    { name: 'park', type: 'TEXT', pk: false },
  ];

  const rows = [
    ['1', 'Ranga', '4500', 'Kaziranga'],
    ['2', 'Mohini', '3800', 'Manas'],
    ['3', 'Gaja', '5200', 'Kaziranga'],
    ['4', 'Tara', '4100', 'Kaziranga'],
  ];

  const colW = [55, 95, 75, 110];
  const rowH = 28;
  const headerH = 32;
  const typeH = 20;
  const padL = 70;
  const padT = 58;
  const totalTableW = colW.reduce((a, b) => a + b, 0);
  const totalW = padL + totalTableW + 130;
  const totalH = padT + headerH + typeH + rows.length * rowH + 75;

  const colX = (i: number) => padL + colW.slice(0, i).reduce((a, b) => a + b, 0);

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Database table diagram showing elephants table with columns, types, and primary key">
      {/* Title */}
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Table: elephants
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        Each row is a record. Each column is a field.
      </text>

      {/* Table border */}
      <rect x={padL} y={padT} width={totalTableW} height={headerH + typeH + rows.length * rowH}
        rx="8" className="fill-white dark:fill-gray-900 stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />

      {/* Column headers */}
      <rect x={padL} y={padT} width={totalTableW} height={headerH}
        rx="8" className="fill-sky-100 dark:fill-sky-900/40 stroke-sky-300 dark:stroke-sky-700" strokeWidth="1.5" />
      {/* Bottom corners aren't rounded */}
      <rect x={padL} y={padT + 8} width={totalTableW} height={headerH - 8}
        className="fill-sky-100 dark:fill-sky-900/40" />

      {columns.map((col, i) => (
        <g key={i}>
          <text x={colX(i) + colW[i] / 2} y={padT + 20} textAnchor="middle"
            className="fill-sky-800 dark:fill-sky-200" fontSize="11" fontWeight="700" fontFamily="monospace">
            {col.name}
          </text>
          {/* Primary key icon */}
          {col.pk && (
            <g transform={`translate(${colX(i) + colW[i] / 2 + 16}, ${padT + 8})`}>
              <text className="fill-amber-500" fontSize="10">🔑</text>
            </g>
          )}
        </g>
      ))}

      {/* Data types row */}
      <rect x={padL} y={padT + headerH} width={totalTableW} height={typeH}
        className="fill-gray-50 dark:fill-gray-800/50" />
      {columns.map((col, i) => (
        <text key={i} x={colX(i) + colW[i] / 2} y={padT + headerH + 13} textAnchor="middle"
          className="fill-gray-400 dark:fill-gray-500" fontSize="8" fontFamily="monospace">
          {col.type}
        </text>
      ))}

      {/* Data rows */}
      {rows.map((row, ri) => {
        const y = padT + headerH + typeH + ri * rowH;
        const isEven = ri % 2 === 0;
        return (
          <g key={ri}>
            {/* Zebra stripe */}
            <rect x={padL} y={y} width={totalTableW} height={rowH}
              className={isEven ? 'fill-white dark:fill-gray-900' : 'fill-gray-50 dark:fill-gray-800/30'}
              rx={ri === rows.length - 1 ? 8 : undefined} />
            {/* Cell values */}
            {row.map((val, ci) => (
              <text key={ci} x={colX(ci) + colW[ci] / 2} y={y + 17} textAnchor="middle"
                className={ci === 0
                  ? 'fill-amber-600 dark:fill-amber-400'
                  : 'fill-gray-700 dark:fill-gray-300'}
                fontSize="10" fontWeight={ci === 0 ? '700' : '500'} fontFamily="monospace">
                {val}
              </text>
            ))}
            {/* Row separator */}
            {ri < rows.length - 1 && (
              <line x1={padL} y1={y + rowH} x2={padL + totalTableW} y2={y + rowH}
                className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
            )}
          </g>
        );
      })}

      {/* Column separators */}
      {columns.slice(1).map((_, i) => (
        <line key={i} x1={colX(i + 1)} y1={padT} x2={colX(i + 1)} y2={padT + headerH + typeH + rows.length * rowH}
          className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
      ))}

      {/* Annotations */}
      {/* Row arrow */}
      <g transform={`translate(${padL + totalTableW + 8}, ${padT + headerH + typeH + 12})`}>
        <line x1="0" y1="0" x2="25" y2="0" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="30" y="4" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">
          → row (record)
        </text>
      </g>

      {/* Column arrow */}
      <g transform={`translate(${colX(2) + colW[2] / 2}, ${padT - 4})`}>
        <text x="0" y="-4" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontWeight="600">
          ↑ column (field)
        </text>
      </g>

      {/* PK annotation */}
      <g transform={`translate(${padL - 6}, ${padT + headerH + typeH + 10})`}>
        <text x="0" y="4" textAnchor="end" className="fill-amber-600 dark:fill-amber-400" fontSize="9" fontWeight="600">
          PK
        </text>
        <text x="0" y="16" textAnchor="end" className="fill-gray-400 dark:fill-gray-500" fontSize="7">
          unique
        </text>
        <text x="0" y="26" textAnchor="end" className="fill-gray-400 dark:fill-gray-500" fontSize="7">
          per row
        </text>
      </g>

      {/* Footnote */}
      <text x={totalW / 2} y={totalH - 8} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
        PRIMARY KEY = unique identifier. TEXT, INTEGER, REAL = data types. NOT NULL = required.
      </text>
    </svg>
  );
}
