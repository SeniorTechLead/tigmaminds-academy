export default function StarCCDDiagram() {
  /* Simulated pixel grid with photon counts */
  const grid = [
    [2, 3, 5, 12, 8, 3, 2, 1],
    [3, 5, 15, 45, 38, 10, 4, 2],
    [4, 12, 42, 120, 95, 35, 8, 3],
    [3, 8, 30, 98, 85, 28, 6, 2],
    [2, 4, 10, 25, 18, 8, 3, 2],
    [1, 3, 4, 6, 5, 3, 2, 1],
  ];

  const cellSize = 36;
  const gridX = 220;
  const gridY = 80;

  return (
    <svg viewBox="0 0 620 336" className="w-full max-w-2xl mx-auto my-4" role="img" aria-label="CCD sensor diagram showing how digital cameras capture starlight as a grid of photon counts">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">CCD: How Digital Cameras Capture Starlight</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Each pixel counts incoming photons</text>

      {/* Photons arriving */}
      {[260, 290, 310, 275, 330, 250, 340].map((x, i) => (
        <g key={i}>
          <line x1={x + (i % 3) * 5 - 5} y1={55 + i * 2} x2={x} y2={75} stroke="#fef3c7" strokeWidth="0.8" opacity={0.4} />
          <circle cx={x + (i % 3) * 5 - 5} cy={54 + i * 2} r="1.5" fill="#fef3c7" opacity={0.6} />
        </g>
      ))}
      <text x="310" y="60" fill="#fef3c7" fontSize="8" opacity={0.6}>photons</text>

      {/* CCD Grid */}
      {grid.map((row, ri) =>
        row.map((val, ci) => {
          const x = gridX + ci * cellSize;
          const y = gridY + ri * cellSize;
          const maxVal = 120;
          const brightness = Math.min(val / maxVal, 1);
          const fillColor = brightness > 0.5
            ? `rgba(254, 243, 199, ${brightness})`
            : brightness > 0.15
            ? `rgba(251, 191, 36, ${brightness * 0.8})`
            : `rgba(71, 85, 105, ${0.2 + brightness * 0.3})`;
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={cellSize} height={cellSize} fill={fillColor} stroke="#334155" strokeWidth="0.5" />
              <text x={x + cellSize / 2} y={y + cellSize / 2 + 4} textAnchor="middle" fill={brightness > 0.3 ? '#0f172a' : '#94a3b8'} fontSize="8" fontWeight={brightness > 0.3 ? '600' : '400'}>
                {val}
              </text>
            </g>
          );
        })
      )}

      {/* Grid labels */}
      <text x={gridX + (cellSize * 8) / 2} y={gridY - 6} textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="600">CCD Pixel Grid</text>

      {/* Left panel: explanation */}
      <rect x="20" y="80" width="185" height="140" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="112" y="100" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">How it works:</text>

      <circle cx="40" cy="118" r="4" fill="#475569" />
      <text x="50" y="121" className="fill-gray-500 dark:fill-slate-400" fontSize="9">1. Photons hit silicon chip</text>

      <circle cx="40" cy="140" r="4" fill="#475569" />
      <text x="50" y="143" className="fill-gray-500 dark:fill-slate-400" fontSize="9">2. Each pixel builds up charge</text>

      <circle cx="40" cy="162" r="4" fill="#475569" />
      <text x="50" y="165" className="fill-gray-500 dark:fill-slate-400" fontSize="9">3. Charge read as a number</text>

      <circle cx="40" cy="184" r="4" fill="#475569" />
      <text x="50" y="187" className="fill-gray-500 dark:fill-slate-400" fontSize="9">4. High number = bright pixel</text>

      <text x="112" y="210" textAnchor="middle" fill="#60a5fa" fontSize="9">Digital image = grid of numbers!</text>

      {/* Bright star annotation */}
      <line x1={gridX + 3 * cellSize + cellSize / 2} y1={gridY + 2 * cellSize + cellSize / 2} x2="490" y2="200" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x="490" y="195" textAnchor="end" fill="#fbbf24" fontSize="9" fontWeight="600">Star center</text>
      <text x="490" y="207" textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">120 photons</text>

      {/* Bottom note */}
      <rect x="80" y="270" width="360" height="24" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="286" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Longer exposure = more photons = fainter stars detected</text>
    </svg>
  );
}
