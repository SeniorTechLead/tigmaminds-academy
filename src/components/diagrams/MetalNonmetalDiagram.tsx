export default function MetalNonmetalDiagram() {
  const metals = [
    [1,1],[2,1],[3,1],[4,1],
    [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],
    [1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],
    [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],
    [1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],
    [1,6],[2,6],
  ];
  const nonmetals = [
    [18,0],
    [13,1],[14,1],[15,1],[16,1],[17,1],[18,1],
    [15,2],[16,2],[17,2],[18,2],
    [16,3],[17,3],[18,3],
    [17,4],[18,4],
    [18,5],
  ];
  const metalloids = [
    [13,2],[14,2],
    [13,3],[14,3],[15,3],
    [13,4],[14,4],[15,4],[16,4],
    [13,5],[14,5],[15,5],[16,5],
  ];

  const ox = 20, oy = 40, cw = 25, ch = 25, gap = 1;

  const Cell = ({ col, row, color }: { col: number; row: number; color: string }) => (
    <rect
      x={ox + col * (cw + gap)}
      y={oy + row * (ch + gap)}
      width={cw}
      height={ch}
      rx="2"
      className={color}
      opacity={0.75}
    />
  );

  // Staircase line separating metals from nonmetals/metalloids
  const stairX = (c: number) => ox + c * (cw + gap);
  const stairY = (r: number) => oy + r * (ch + gap);
  const staircasePath = `M ${stairX(13)},${stairY(1)} L ${stairX(13)},${stairY(2)} L ${stairX(14)},${stairY(2)} L ${stairX(14)},${stairY(3)} L ${stairX(15)},${stairY(3)} L ${stairX(15)},${stairY(4)} L ${stairX(16)},${stairY(4)} L ${stairX(16)},${stairY(5)} L ${stairX(17)},${stairY(5)} L ${stairX(17)},${stairY(6)}`;

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 343" className="w-full max-w-2xl mx-auto" role="img" aria-label="Mini periodic table showing metals, nonmetals, and metalloids with staircase line">
        <text x="250" y="25" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Metals, Nonmetals &amp; Metalloids</text>

        {/* Metal cells */}
        {metals.map(([c, r], i) => (
          <Cell key={`m${i}`} col={c} row={r} color="fill-blue-400 dark:fill-blue-600" />
        ))}
        {/* Nonmetal cells */}
        {nonmetals.map(([c, r], i) => (
          <Cell key={`n${i}`} col={c} row={r} color="fill-emerald-400 dark:fill-emerald-600" />
        ))}
        {/* Metalloid cells */}
        {metalloids.map(([c, r], i) => (
          <Cell key={`d${i}`} col={c} row={r} color="fill-pink-400 dark:fill-pink-600" />
        ))}

        {/* Hydrogen special case */}
        <rect x={ox + 1 * (cw + gap)} y={oy} width={cw} height={ch} rx="2" className="fill-emerald-400 dark:fill-emerald-600" opacity={0.75} />
        <text x={ox + 1 * (cw + gap) + 12} y={oy + 16} textAnchor="middle" className="fill-white" fontSize="10" fontWeight="bold">H</text>

        {/* Staircase line */}
        <path d={staircasePath} fill="none" className="stroke-gray-800 dark:stroke-gray-200" strokeWidth="2.5" strokeLinejoin="round" />
        <text x={stairX(15) + 5} y={stairY(2) - 5} className="fill-gray-600 dark:fill-gray-300" fontSize="10">staircase</text>

        {/* Legend */}
        <rect x="100" y="225" width="16" height="16" rx="3" className="fill-blue-400 dark:fill-blue-600" />
        <text x="122" y="238" className="fill-gray-700 dark:fill-gray-200" fontSize="11">Metals</text>
        <rect x="195" y="225" width="16" height="16" rx="3" className="fill-emerald-400 dark:fill-emerald-600" />
        <text x="217" y="238" className="fill-gray-700 dark:fill-gray-200" fontSize="11">Nonmetals</text>
        <rect x="310" y="225" width="16" height="16" rx="3" className="fill-pink-400 dark:fill-pink-600" />
        <text x="332" y="238" className="fill-gray-700 dark:fill-gray-200" fontSize="11">Metalloids</text>

        {/* Properties */}
        <text x="80" y="270" className="fill-blue-600 dark:fill-blue-400" fontSize="10">Shiny, conductive, malleable</text>
        <text x="230" y="270" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">Dull, brittle, insulators</text>
        <text x="380" y="270" className="fill-pink-600 dark:fill-pink-400" fontSize="10">Mixed properties</text>

        <text x="250" y="293" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">The staircase line divides metals (left) from nonmetals (right)</text>
      </svg>
    </div>
  );
}
