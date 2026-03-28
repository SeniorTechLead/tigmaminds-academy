export default function DominantRecessiveDiagram() {
  const purpleFlower = (cx: number, cy: number, size: number = 1) => (
    <g>
      {[0, 72, 144, 216, 288].map(angle => {
        const rad = (angle * Math.PI) / 180;
        const px = cx + Math.cos(rad) * 10 * size;
        const py = cy + Math.sin(rad) * 10 * size;
        return <ellipse key={angle} cx={px} cy={py} rx={7 * size} ry={5 * size} transform={`rotate(${angle}, ${px}, ${py})`} className="fill-purple-500 dark:fill-purple-400" />;
      })}
      <circle cx={cx} cy={cy} r={4 * size} className="fill-yellow-300" />
    </g>
  );

  const whiteFlower = (cx: number, cy: number, size: number = 1) => (
    <g>
      {[0, 72, 144, 216, 288].map(angle => {
        const rad = (angle * Math.PI) / 180;
        const px = cx + Math.cos(rad) * 10 * size;
        const py = cy + Math.sin(rad) * 10 * size;
        return <ellipse key={angle} cx={px} cy={py} rx={7 * size} ry={5 * size} transform={`rotate(${angle}, ${px}, ${py})`} className="fill-gray-200 dark:fill-gray-500" stroke="#9ca3af" strokeWidth="0.5" />;
      })}
      <circle cx={cx} cy={cy} r={4 * size} className="fill-yellow-300" />
    </g>
  );

  return (
    <div className="my-4">
      <svg viewBox="0 0 500 300" className="w-full max-w-lg mx-auto" role="img" aria-label="Dominant and recessive flower color inheritance diagram">
        {/* Title */}
        <text x="250" y="16" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Dominant vs Recessive Inheritance</text>

        {/* P Generation */}
        <text x="20" y="55" className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontWeight="600">P:</text>
        {purpleFlower(100, 55)}
        <text x="100" y="78" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="10" fontWeight="600">PP</text>
        <text x="100" y="90" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Purple</text>

        <text x="200" y="58" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="14">×</text>

        {whiteFlower(300, 55)}
        <text x="300" y="78" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">pp</text>
        <text x="300" y="90" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">White</text>

        {/* Arrow to F1 */}
        <line x1="200" y1="95" x2="200" y2="115" className="stroke-gray-400" strokeWidth="1.5" />
        <polygon points="196,115 200,123 204,115" className="fill-gray-400" />

        {/* F1 Generation */}
        <text x="20" y="148" className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontWeight="600">F1:</text>
        <text x="55" y="148" className="fill-gray-500 dark:fill-gray-400" fontSize="10">All</text>
        {purpleFlower(120, 145)}
        {purpleFlower(170, 145)}
        {purpleFlower(220, 145)}
        {purpleFlower(270, 145)}
        <text x="200" y="170" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="10" fontWeight="600">All Pp (Purple)</text>
        <text x="200" y="182" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">P is dominant over p</text>

        {/* F1 cross */}
        <text x="370" y="148" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Pp × Pp</text>

        {/* Arrow to F2 */}
        <line x1="200" y1="188" x2="200" y2="208" className="stroke-gray-400" strokeWidth="1.5" />
        <polygon points="196,208 200,216 204,208" className="fill-gray-400" />

        {/* F2 Generation */}
        <text x="20" y="242" className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontWeight="600">F2:</text>
        {purpleFlower(90, 240)}
        <text x="90" y="260" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="10">PP</text>
        {purpleFlower(155, 240)}
        <text x="155" y="260" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="10">Pp</text>
        {purpleFlower(220, 240)}
        <text x="220" y="260" textAnchor="middle" className="fill-purple-600 dark:fill-purple-300" fontSize="10">Pp</text>
        {whiteFlower(285, 240)}
        <text x="285" y="260" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">pp</text>

        {/* Ratio */}
        <rect x="340" y="225" width="150" height="35" rx="6" className="fill-amber-100 dark:fill-amber-900" stroke="#f59e0b" strokeWidth="1" />
        <text x="415" y="240" textAnchor="middle" className="fill-amber-700 dark:fill-amber-200" fontSize="11" fontWeight="bold">3 Purple : 1 White</text>
        <text x="415" y="254" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">3:1 ratio</text>

        {/* Bottom note */}
        <text x="250" y="290" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">P = dominant allele (purple) &nbsp; p = recessive allele (white)</text>
      </svg>
    </div>
  );
}
