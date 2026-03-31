export default function LogicGateSymbolsDiagram() {
  const gateColor = 'text-gray-700 dark:text-gray-200';
  const wireColor = 'text-gray-400 dark:text-gray-500';
  const labelColor = 'fill-gray-700 dark:fill-gray-200';
  const subColor = 'fill-gray-500 dark:fill-gray-400';
  const tableHead = 'fill-blue-600 dark:fill-blue-400';
  const tableCell = 'fill-gray-600 dark:fill-gray-300';

  /* Each gate: x offset, name, symbol body, truth-table rows [A, B, Out] */
  const gates: {
    name: string;
    expr: string;
    rows: [number, number, number][];
    body: (cx: number, cy: number) => JSX.Element;
  }[] = [
    {
      name: 'AND',
      expr: 'A \u00B7 B',
      rows: [[0,0,0],[0,1,0],[1,0,0],[1,1,1]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-16} ${cy-14} L${cx} ${cy-14} A14 14 0 0 1 ${cx} ${cy+14} L${cx-16} ${cy+14} Z`}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'OR',
      expr: 'A + B',
      rows: [[0,0,0],[0,1,1],[1,0,1],[1,1,1]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-18} ${cy-14} Q${cx-6} ${cy} ${cx-18} ${cy+14} Q${cx+4} ${cy+14} ${cx+16} ${cy} Q${cx+4} ${cy-14} ${cx-18} ${cy-14} Z`}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'NOT',
      expr: '\u00ACA',
      rows: [[0,-1,1],[1,-1,0]],
      body: (cx, cy) => (
        <g>
          <polygon points={`${cx-14},${cy-12} ${cx+10},${cy} ${cx-14},${cy+12}`}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
          <circle cx={cx+14} cy={cy} r={3}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'NAND',
      expr: '\u00AC(A \u00B7 B)',
      rows: [[0,0,1],[0,1,1],[1,0,1],[1,1,0]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-16} ${cy-14} L${cx} ${cy-14} A14 14 0 0 1 ${cx} ${cy+14} L${cx-16} ${cy+14} Z`}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
          <circle cx={cx+15} cy={cy} r={3}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'NOR',
      expr: '\u00AC(A + B)',
      rows: [[0,0,1],[0,1,0],[1,0,0],[1,1,0]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-18} ${cy-14} Q${cx-6} ${cy} ${cx-18} ${cy+14} Q${cx+4} ${cy+14} ${cx+16} ${cy} Q${cx+4} ${cy-14} ${cx-18} ${cy-14} Z`}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
          <circle cx={cx+19} cy={cy} r={3}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'XOR',
      expr: 'A \u2295 B',
      rows: [[0,0,0],[0,1,1],[1,0,1],[1,1,0]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-18} ${cy-14} Q${cx-6} ${cy} ${cx-18} ${cy+14} Q${cx+4} ${cy+14} ${cx+16} ${cy} Q${cx+4} ${cy-14} ${cx-18} ${cy-14} Z`}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
          <path d={`M${cx-22} ${cy-14} Q${cx-10} ${cy} ${cx-22} ${cy+14}`}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'XNOR',
      expr: '\u00AC(A \u2295 B)',
      rows: [[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-18} ${cy-14} Q${cx-6} ${cy} ${cx-18} ${cy+14} Q${cx+4} ${cy+14} ${cx+16} ${cy} Q${cx+4} ${cy-14} ${cx-18} ${cy-14} Z`}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
          <path d={`M${cx-22} ${cy-14} Q${cx-10} ${cy} ${cx-22} ${cy+14}`}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
          <circle cx={cx+19} cy={cy} r={3}
            fill="none" stroke="currentColor" className={gateColor} strokeWidth="2" />
        </g>
      ),
    },
  ];

  const colW = 162;
  const rowH = 100;

  return (
    <div className="my-4">
      <svg
        viewBox={`0 0 ${colW * 4} ${rowH * 2 + 10}`}
        className="w-full max-w-3xl mx-auto"
        role="img"
        aria-label="All seven logic gate symbols with truth tables"
      >
        {gates.map((g, idx) => {
          const col = idx % 4;
          const row = Math.floor(idx / 4);
          const ox = col * colW;
          const oy = row * rowH;
          const cx = ox + 50;
          const cy = oy + 30;
          const isNot = g.name === 'NOT';
          const cols = isNot ? ['A', 'Q'] : ['A', 'B', 'Q'];

          return (
            <g key={g.name}>
              {/* Gate name */}
              <text x={ox + colW / 2} y={oy + 12} textAnchor="middle" className={labelColor} fontSize="12" fontWeight="700">
                {g.name}
              </text>

              {/* Gate symbol */}
              {g.body(cx, cy)}

              {/* Input wires */}
              {isNot ? (
                <line x1={cx - 28} y1={cy} x2={cx - 14} y2={cy} stroke="currentColor" className={wireColor} strokeWidth="1.5" />
              ) : (
                <>
                  <line x1={cx - 30} y1={cy - 7} x2={cx - 16} y2={cy - 7} stroke="currentColor" className={wireColor} strokeWidth="1.5" />
                  <line x1={cx - 30} y1={cy + 7} x2={cx - 16} y2={cy + 7} stroke="currentColor" className={wireColor} strokeWidth="1.5" />
                </>
              )}
              {/* Output wire */}
              <line x1={cx + (g.name === 'NAND' || g.name === 'NOR' || g.name === 'XNOR' ? 22 : g.name === 'NOT' ? 17 : 14)} y1={cy} x2={cx + 30} y2={cy} stroke="currentColor" className={wireColor} strokeWidth="1.5" />

              {/* Wire labels */}
              {isNot ? (
                <text x={cx - 32} y={cy + 4} textAnchor="end" className={subColor} fontSize="10">A</text>
              ) : (
                <>
                  <text x={cx - 32} y={cy - 4} textAnchor="end" className={subColor} fontSize="10">A</text>
                  <text x={cx - 32} y={cy + 11} textAnchor="end" className={subColor} fontSize="10">B</text>
                </>
              )}
              <text x={cx + 33} y={cy + 4} className={subColor} fontSize="10">Q</text>

              {/* Expression */}
              <text x={ox + colW / 2} y={oy + 52} textAnchor="middle" className={subColor} fontSize="10">{g.expr}</text>

              {/* Mini truth table */}
              {cols.map((c, ci) => (
                <text key={c} x={ox + 90 + ci * 20} y={oy + 66} textAnchor="middle" className={tableHead} fontSize="10" fontWeight="600">{c}</text>
              ))}
              {g.rows.map((r, ri) => {
                const vals = isNot ? [r[0], r[2]] : r;
                return vals.map((v, vi) => (
                  <text key={`${ri}-${vi}`} x={ox + 90 + vi * 20} y={oy + 78 + ri * 11} textAnchor="middle" className={tableCell} fontSize="10">
                    {v === -1 ? '\u2013' : v}
                  </text>
                ));
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
