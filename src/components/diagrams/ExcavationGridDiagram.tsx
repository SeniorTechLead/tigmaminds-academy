export default function ExcavationGridDiagram() {
  const gridSize = 5;
  const cellW = 80;
  const cellH = 60;
  const ox = 120;
  const oy = 80;

  const finds: { r: number; c: number; icon: string; label: string }[] = [
    { r: 0, c: 1, icon: '\uD83E\uDE99', label: 'Coin' },
    { r: 1, c: 3, icon: '\uD83C\uDFFA', label: 'Pottery' },
    { r: 2, c: 0, icon: '\uD83E\uDEA8', label: 'Stone tool' },
    { r: 2, c: 4, icon: '\uD83E\uDD9B', label: 'Bone' },
    { r: 3, c: 2, icon: '\uD83D\uDD25', label: 'Charcoal' },
    { r: 4, c: 1, icon: '\uD83D\uDC8E', label: 'Bead' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 660 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Excavation grid showing how archaeologists record artifact locations">
        <rect width="660" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="330" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Preservation vs Excavation</text>
        <text x="330" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Excavation destroys context \u2014 so every find must be recorded on a grid</text>

        {/* Column headers */}
        {Array.from({ length: gridSize }).map((_, c) => (
          <text key={c} x={ox + c * cellW + cellW / 2} y={oy - 8} textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">{String.fromCharCode(65 + c)}</text>
        ))}
        {/* Row headers */}
        {Array.from({ length: gridSize }).map((_, r) => (
          <text key={r} x={ox - 16} y={oy + r * cellH + cellH / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">{r + 1}</text>
        ))}

        {/* Grid cells */}
        {Array.from({ length: gridSize }).map((_, r) =>
          Array.from({ length: gridSize }).map((_, c) => (
            <rect key={`${r}-${c}`} x={ox + c * cellW} y={oy + r * cellH} width={cellW} height={cellH} className="fill-amber-50/50 dark:fill-amber-900/10" stroke="#d4a574" strokeWidth="1" />
          ))
        )}

        {/* Artifact finds */}
        {finds.map((f, i) => (
          <g key={i}>
            <text x={ox + f.c * cellW + cellW / 2} y={oy + f.r * cellH + cellH / 2 + 2} textAnchor="middle" fontSize="20">{f.icon}</text>
            <text x={ox + f.c * cellW + cellW / 2} y={oy + f.r * cellH + cellH - 4} textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-slate-400">{f.label}</text>
          </g>
        ))}

        {/* Annotation box */}
        <rect x="80" y={oy + gridSize * cellH + 20} width="500" height="60" rx="8" className="fill-rose-50 dark:fill-rose-900/15" stroke="#f43f5e" strokeWidth="1" />
        <text x="330" y={oy + gridSize * cellH + 44} textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">The excavation dilemma</text>
        <text x="330" y={oy + gridSize * cellH + 62} textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Digging reveals artifacts but destroys the layers that date them \u2014 you can only dig once.</text>
      </svg>
    </div>
  );
}
