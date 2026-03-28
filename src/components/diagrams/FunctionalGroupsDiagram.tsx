export default function FunctionalGroupsDiagram() {
  const groups = [
    {
      name: "Hydroxyl",
      formula: "—OH",
      type: "Alcohol",
      example: "Ethanol",
      color: "fill-blue-100 dark:fill-blue-900/40",
      border: "stroke-blue-300 dark:stroke-blue-700",
      accent: "fill-blue-600 dark:fill-blue-400",
    },
    {
      name: "Carboxyl",
      formula: "—COOH",
      type: "Carboxylic Acid",
      example: "Acetic acid",
      color: "fill-red-100 dark:fill-red-900/40",
      border: "stroke-red-300 dark:stroke-red-700",
      accent: "fill-red-600 dark:fill-red-400",
    },
    {
      name: "Amino",
      formula: "—NH₂",
      type: "Amine",
      example: "Methylamine",
      color: "fill-green-100 dark:fill-green-900/40",
      border: "stroke-green-300 dark:stroke-green-700",
      accent: "fill-green-600 dark:fill-green-400",
    },
    {
      name: "Carbonyl",
      formula: "—C=O",
      type: "Ketone / Aldehyde",
      example: "Acetone",
      color: "fill-amber-100 dark:fill-amber-900/40",
      border: "stroke-amber-300 dark:stroke-amber-700",
      accent: "fill-amber-600 dark:fill-amber-400",
    },
  ];

  const cellW = 118;
  const cellH = 240;
  const gap = 8;

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 500 250"
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label="Common functional groups in organic chemistry"
      >
        <text x="250" y="16" textAnchor="middle" fontSize="12"
          fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
          Common Functional Groups
        </text>

        {groups.map((g, i) => {
          const x = 6 + i * (cellW + gap);
          const y = 26;
          return (
            <g key={g.name}>
              <rect x={x} y={y} width={cellW} height={cellH - 30} rx="6"
                className={`${g.color} ${g.border}`} strokeWidth="1.5" />

              {/* Group name */}
              <text x={x + cellW / 2} y={y + 22} textAnchor="middle"
                fontSize="12" fontWeight="bold" className={g.accent}>
                {g.name}
              </text>

              {/* Structural formula */}
              <rect x={x + 10} y={y + 35} width={cellW - 20} height="40" rx="4"
                className="fill-white dark:fill-gray-700" />
              <text x={x + cellW / 2} y={y + 62} textAnchor="middle"
                fontSize="18" fontWeight="bold"
                className="fill-gray-800 dark:fill-gray-100" fontFamily="serif">
                {g.formula}
              </text>

              {/* Type label */}
              <text x={x + cellW / 2} y={y + 100} textAnchor="middle"
                fontSize="10" fontWeight="600"
                className="fill-gray-600 dark:fill-gray-300">
                {g.type}
              </text>

              {/* Divider */}
              <line x1={x + 15} y1={y + 110} x2={x + cellW - 15} y2={y + 110}
                className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />

              {/* R—group visual */}
              <text x={x + cellW / 2} y={y + 130} textAnchor="middle"
                fontSize="10" className="fill-gray-500 dark:fill-gray-400">
                R
              </text>
              <line x1={x + cellW / 2 + 6} y1={y + 127} x2={x + cellW / 2 + 20} y2={y + 127}
                className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
              <text x={x + cellW / 2 + 32} y={y + 130} textAnchor="middle"
                fontSize="10" fontWeight="600" className={g.accent}>
                {g.formula.replace("—", "")}
              </text>

              {/* Example */}
              <text x={x + cellW / 2} y={y + 158} textAnchor="middle"
                fontSize="10" className="fill-gray-500 dark:fill-gray-400">
                Example:
              </text>
              <text x={x + cellW / 2} y={y + 172} textAnchor="middle"
                fontSize="11" fontWeight="600"
                className="fill-gray-700 dark:fill-gray-200">
                {g.example}
              </text>

              {/* Key property */}
              <text x={x + cellW / 2} y={y + 198} textAnchor="middle"
                fontSize="10" className="fill-gray-400 dark:fill-gray-500">
                {g.name === "Hydroxyl" && "Polar, H-bonding"}
                {g.name === "Carboxyl" && "Acidic, donates H⁺"}
                {g.name === "Amino" && "Basic, accepts H⁺"}
                {g.name === "Carbonyl" && "Polar C=O bond"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
