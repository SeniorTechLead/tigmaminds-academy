export default function LogicGateSymbolsDiagram() {
  const labelColor = 'fill-gray-900 dark:fill-slate-50';
  const subColor = 'fill-gray-500 dark:fill-slate-400';
  const tableHead = 'fill-blue-600 dark:fill-blue-400';
  const tableCell = 'fill-gray-600 dark:fill-gray-300';
  const gateStroke = 'stroke-gray-700 dark:stroke-gray-200';
  const wireStroke = 'stroke-gray-400 dark:stroke-gray-500';

  const gates: {
    name: string;
    expr: string;
    rows: [number, number, number][];
    body: (cx: number, cy: number) => JSX.Element;
  }[] = [
    {
      name: 'AND', expr: 'A · B',
      rows: [[0,0,0],[0,1,0],[1,0,0],[1,1,1]],
      body: (cx, cy) => (
        <path d={`M${cx-18} ${cy-16} L${cx+2} ${cy-16} A16 16 0 0 1 ${cx+2} ${cy+16} L${cx-18} ${cy+16} Z`}
          fill="none" className={gateStroke} strokeWidth="2" />
      ),
    },
    {
      name: 'OR', expr: 'A + B',
      rows: [[0,0,0],[0,1,1],[1,0,1],[1,1,1]],
      body: (cx, cy) => (
        <path d={`M${cx-20} ${cy-16} Q${cx-6} ${cy} ${cx-20} ${cy+16} Q${cx+4} ${cy+16} ${cx+18} ${cy} Q${cx+4} ${cy-16} ${cx-20} ${cy-16} Z`}
          fill="none" className={gateStroke} strokeWidth="2" />
      ),
    },
    {
      name: 'NOT', expr: '¬A',
      rows: [[0,-1,1],[1,-1,0]],
      body: (cx, cy) => (
        <g>
          <polygon points={`${cx-16},${cy-14} ${cx+12},${cy} ${cx-16},${cy+14}`}
            fill="none" className={gateStroke} strokeWidth="2" />
          <circle cx={cx+16} cy={cy} r={3.5} fill="none" className={gateStroke} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'NAND', expr: '¬(A · B)',
      rows: [[0,0,1],[0,1,1],[1,0,1],[1,1,0]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-18} ${cy-16} L${cx+2} ${cy-16} A16 16 0 0 1 ${cx+2} ${cy+16} L${cx-18} ${cy+16} Z`}
            fill="none" className={gateStroke} strokeWidth="2" />
          <circle cx={cx+19} cy={cy} r={3.5} fill="none" className={gateStroke} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'NOR', expr: '¬(A + B)',
      rows: [[0,0,1],[0,1,0],[1,0,0],[1,1,0]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-20} ${cy-16} Q${cx-6} ${cy} ${cx-20} ${cy+16} Q${cx+4} ${cy+16} ${cx+18} ${cy} Q${cx+4} ${cy-16} ${cx-20} ${cy-16} Z`}
            fill="none" className={gateStroke} strokeWidth="2" />
          <circle cx={cx+22} cy={cy} r={3.5} fill="none" className={gateStroke} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'XOR', expr: 'A ⊕ B',
      rows: [[0,0,0],[0,1,1],[1,0,1],[1,1,0]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-20} ${cy-16} Q${cx-6} ${cy} ${cx-20} ${cy+16} Q${cx+4} ${cy+16} ${cx+18} ${cy} Q${cx+4} ${cy-16} ${cx-20} ${cy-16} Z`}
            fill="none" className={gateStroke} strokeWidth="2" />
          <path d={`M${cx-25} ${cy-16} Q${cx-11} ${cy} ${cx-25} ${cy+16}`}
            fill="none" className={gateStroke} strokeWidth="2" />
        </g>
      ),
    },
    {
      name: 'XNOR', expr: '¬(A ⊕ B)',
      rows: [[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
      body: (cx, cy) => (
        <g>
          <path d={`M${cx-20} ${cy-16} Q${cx-6} ${cy} ${cx-20} ${cy+16} Q${cx+4} ${cy+16} ${cx+18} ${cy} Q${cx+4} ${cy-16} ${cx-20} ${cy-16} Z`}
            fill="none" className={gateStroke} strokeWidth="2" />
          <path d={`M${cx-25} ${cy-16} Q${cx-11} ${cy} ${cx-25} ${cy+16}`}
            fill="none" className={gateStroke} strokeWidth="2" />
          <circle cx={cx+22} cy={cy} r={3.5} fill="none" className={gateStroke} strokeWidth="2" />
        </g>
      ),
    },
  ];

  // Layout: 4 columns, gate on top, truth table below — stacked vertically
  const colW = 180;
  const gateH = 80;    // gate symbol area — more breathing room
  const tableH = 80;   // truth table area
  const cellH = gateH + tableH;
  const cols = 4;
  const rows = 2;

  return (
    <div className="my-4">
      <svg
        viewBox={`0 0 ${colW * cols} ${cellH * rows}`}
        className="w-full max-w-3xl mx-auto"
        role="img"
        aria-label="All seven logic gate symbols with truth tables"
      >
        {gates.map((g, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const ox = col * colW;
          const oy = row * cellH;
          const cx = ox + colW / 2;
          const cy = oy + 40;
          const isNot = g.name === 'NOT';
          const colNames = isNot ? ['A', 'Q'] : ['A', 'B', 'Q'];
          const outX = ['NAND','NOR','XNOR'].includes(g.name) ? cx + 26 : g.name === 'NOT' ? cx + 20 : cx + 18;

          return (
            <g key={g.name}>
              {/* Gate name */}
              <text x={cx} y={oy + 14} textAnchor="middle" className={labelColor} fontSize="13" fontWeight="700">
                {g.name}
              </text>

              {/* Gate symbol */}
              {g.body(cx, cy)}

              {/* Input wires */}
              {isNot ? (
                <line x1={cx - 36} y1={cy} x2={cx - 16} y2={cy} className={wireStroke} strokeWidth="1.5" />
              ) : (
                <>
                  <line x1={cx - 36} y1={cy - 8} x2={cx - 18} y2={cy - 8} className={wireStroke} strokeWidth="1.5" />
                  <line x1={cx - 36} y1={cy + 8} x2={cx - 18} y2={cy + 8} className={wireStroke} strokeWidth="1.5" />
                </>
              )}

              {/* Output wire */}
              <line x1={outX} y1={cy} x2={cx + 38} y2={cy} className={wireStroke} strokeWidth="1.5" />

              {/* Wire labels — well outside the gate */}
              {isNot ? (
                <text x={cx - 40} y={cy + 4} textAnchor="end" className={subColor} fontSize="11">A</text>
              ) : (
                <>
                  <text x={cx - 40} y={cy - 4} textAnchor="end" className={subColor} fontSize="11">A</text>
                  <text x={cx - 40} y={cy + 12} textAnchor="end" className={subColor} fontSize="11">B</text>
                </>
              )}
              <text x={cx + 42} y={cy + 4} className={subColor} fontSize="11">Q</text>

              {/* Expression — below the gate with breathing room */}
              <text x={cx} y={oy + gateH - 6} textAnchor="middle" className={subColor} fontSize="11">{g.expr}</text>

              {/* Truth table — stacked below */}
              {colNames.map((c, ci) => (
                <text key={c} x={cx - 16 + ci * 20} y={oy + gateH + 16} textAnchor="middle" className={tableHead} fontSize="11" fontWeight="600">{c}</text>
              ))}
              {g.rows.map((r, ri) => {
                const vals = isNot ? [r[0], r[2]] : r;
                return vals.map((v, vi) => (
                  <text key={`${ri}-${vi}`} x={cx - 16 + vi * 20} y={oy + gateH + 32 + ri * 14} textAnchor="middle" className={tableCell} fontSize="11">
                    {v === -1 ? '–' : v}
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
