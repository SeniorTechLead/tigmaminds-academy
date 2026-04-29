export default function StarCatalogDiagram() {
  const headers = ['ID', 'RA (h:m:s)', 'Dec (d:m:s)', 'Mag (V)', 'B-V', 'Type'];
  const colWidths = [55, 80, 80, 55, 50, 55];
  const rows = [
    ['Sirius', '06:45:09', '-16:42:58', '-1.46', '0.00', 'A1V'],
    ['Vega', '18:36:56', '+38:47:01', '+0.03', '0.00', 'A0V'],
    ['Betelgeuse', '05:55:10', '+07:24:25', '+0.42', '+1.85', 'M1Iab'],
    ['Polaris', '02:31:49', '+89:15:51', '+1.98', '+0.60', 'F7Ib'],
    ['Rigel', '05:14:32', '-08:12:06', '+0.12', '-0.03', 'B8Ia'],
    ['Sun', '---', '---', '-26.74', '+0.65', 'G2V'],
  ];

  const startX = 40;
  const startY = 70;
  const rowH = 26;
  const totalW = colWidths.reduce((a, b) => a + b, 0);

  return (
    <svg viewBox="0 0 546 343" className="w-full max-w-2xl mx-auto my-4" role="img" aria-label="Star catalog table showing RA, Dec, magnitude, color index, and spectral type">
      <rect width="520" height="310" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Star Catalog</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">How astronomers organize stellar data</text>

      {/* Table header */}
      <rect x={startX} y={startY} width={totalW} height={rowH} rx="4" fill="#334155" />
      {headers.map((h, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        return (
          <text key={h} x={x + colWidths[i] / 2} y={startY + 17} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700">{h}</text>
        );
      })}

      {/* Table rows */}
      {rows.map((row, ri) => {
        const y = startY + rowH + ri * rowH;
        const bgFill = ri % 2 === 0 ? '#1e293b' : '#0f172a';
        return (
          <g key={ri}>
            <rect x={startX} y={y} width={totalW} height={rowH} fill={bgFill} />
            {row.map((cell, ci) => {
              const x = startX + colWidths.slice(0, ci).reduce((a, b) => a + b, 0);
              const color = ci === 0 ? '#e2e8f0' : '#94a3b8';
              const weight = ci === 0 ? '600' : '400';
              return (
                <text key={ci} x={x + colWidths[ci] / 2} y={y + 17} textAnchor="middle" fill={color} fontSize="8.5" fontWeight={weight} fontFamily="monospace">{cell}</text>
              );
            })}
          </g>
        );
      })}

      {/* Table border */}
      <rect x={startX} y={startY} width={totalW} height={rowH * 7} fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" rx="4" />

      {/* Column separators */}
      {colWidths.slice(0, -1).map((_, i) => {
        const x = startX + colWidths.slice(0, i + 1).reduce((a, b) => a + b, 0);
        return <line key={i} x1={x} y1={startY} x2={x} y2={startY + rowH * 7} stroke="#334155" strokeWidth="0.5" />;
      })}

      {/* Legend */}
      <rect x="40" y="260" width="440" height="42" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="90" y="277" fill="#60a5fa" fontSize="9" fontWeight="600">RA/Dec:</text>
      <text x="145" y="277" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Sky coordinates (like latitude/longitude)</text>
      <text x="90" y="293" fill="#60a5fa" fontSize="9" fontWeight="600">Spectral Type:</text>
      <text x="170" y="293" className="fill-gray-500 dark:fill-slate-400" fontSize="8">O B A F G K M (hot → cool) + luminosity class</text>
      <text x="360" y="277" fill="#fbbf24" fontSize="8" fontWeight="600">B-V &lt; 0 = blue</text>
      <text x="360" y="293" fill="#fbbf24" fontSize="8" fontWeight="600">B-V &gt; 1 = red</text>
    </svg>
  );
}
