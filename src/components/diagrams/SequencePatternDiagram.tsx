export default function SequencePatternDiagram() {
  const arithValues = [2, 5, 8, 11];
  const geoValues = [2, 4, 8, 16];
  const maxGeo = 16;
  const barMaxH = 120;

  return (
    <div className="my-4">
      <svg viewBox="0 0 500 250" className="w-full max-w-lg mx-auto" role="img" aria-label="Sequence patterns comparing arithmetic (linear) and geometric (exponential) growth">
        {/* Arithmetic Sequence */}
        <text x="125" y="22" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="13" fontWeight="bold">Arithmetic Sequence</text>
        <text x="125" y="37" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Common difference = +3</text>

        {/* Bars */}
        {arithValues.map((v, i) => {
          const barH = (v / maxGeo) * barMaxH;
          const x = 45 + i * 45;
          return (
            <g key={`a${i}`}>
              <rect x={x} y={160 - barH} width="30" height={barH} rx="3" className="fill-blue-400 dark:fill-blue-500" />
              <text x={x + 15} y={155 - barH} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="12" fontWeight="bold">{v}</text>
              {i < arithValues.length - 1 && (
                <text x={x + 37} y={130} textAnchor="middle" className="fill-blue-400 dark:fill-blue-500" fontSize="11">+3</text>
              )}
            </g>
          );
        })}

        {/* Linear growth line */}
        <line x1="60" y1={160 - (2 / maxGeo) * barMaxH} x2="195" y2={160 - (11 / maxGeo) * barMaxH} className="stroke-blue-300 dark:stroke-blue-600" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="125" y="180" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Linear growth (straight line)</text>

        {/* Divider */}
        <line x1="250" y1="15" x2="250" y2="230" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="5,5" />

        {/* Geometric Sequence */}
        <text x="375" y="22" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="13" fontWeight="bold">Geometric Sequence</text>
        <text x="375" y="37" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Common ratio = ×2</text>

        {geoValues.map((v, i) => {
          const barH = (v / maxGeo) * barMaxH;
          const x = 295 + i * 45;
          return (
            <g key={`g${i}`}>
              <rect x={x} y={160 - barH} width="30" height={barH} rx="3" className="fill-emerald-400 dark:fill-emerald-500" />
              <text x={x + 15} y={155 - barH} textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="12" fontWeight="bold">{v}</text>
              {i < geoValues.length - 1 && (
                <text x={x + 37} y={130} textAnchor="middle" className="fill-emerald-400 dark:fill-emerald-500" fontSize="11">×2</text>
              )}
            </g>
          );
        })}

        {/* Exponential growth curve */}
        <path d={`M 310,${160 - (2 / maxGeo) * barMaxH} Q 370,${160 - (5 / maxGeo) * barMaxH} 445,${160 - barMaxH}`}
          fill="none" className="stroke-emerald-300 dark:stroke-emerald-600" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="375" y="180" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Exponential growth (curve)</text>

        {/* Formulas */}
        <rect x="25" y="195" width="200" height="28" rx="6" className="fill-blue-50 dark:fill-blue-900/30" />
        <text x="125" y="214" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="600">aₙ = a₁ + (n-1)d = 2 + 3(n-1)</text>

        <rect x="275" y="195" width="200" height="28" rx="6" className="fill-emerald-50 dark:fill-emerald-900/30" />
        <text x="375" y="214" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="600">aₙ = a₁ × rⁿ⁻¹ = 2 × 2ⁿ⁻¹</text>

        <text x="250" y="245" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Arithmetic adds the same amount; Geometric multiplies by the same factor</text>
      </svg>
    </div>
  );
}
