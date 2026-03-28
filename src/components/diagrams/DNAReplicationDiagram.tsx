export default function DNAReplicationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 500 300" className="w-full max-w-lg mx-auto" role="img" aria-label="DNA Replication Fork diagram">
        <defs>
          <marker id="dnaArrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-gray-500" />
          </marker>
          <marker id="dnaArrowBlue" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-blue-500" />
          </marker>
          <marker id="dnaArrowRed" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-red-500" />
          </marker>
        </defs>

        {/* Title */}
        <text x="250" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          DNA Replication Fork
        </text>

        {/* Original double-stranded DNA (left, zipped) */}
        {/* Top strand */}
        <path d="M 30,100 Q 70,95 110,100 Q 150,105 180,115"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="3" />
        {/* Bottom strand */}
        <path d="M 30,140 Q 70,145 110,140 Q 150,135 180,125"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="3" />

        {/* Base pair rungs (zipped region) */}
        {[40, 60, 80, 100, 120, 140, 160].map((x, i) => {
          const topY = 100 + (x > 110 ? (x - 110) * 0.2 : 0) - (x < 70 ? (70 - x) * 0.05 : (x - 70) * 0.05);
          const botY = 140 - (x > 110 ? (x - 110) * 0.2 : 0) + (x < 70 ? (70 - x) * 0.05 : (x - 70) * 0.05);
          if (x > 155) return null;
          return (
            <line key={i} x1={x} y1={topY + 3} x2={x} y2={botY - 3}
              className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
          );
        })}

        {/* Helicase at the fork */}
        <circle cx="185" cy="120" r="15" className="fill-yellow-300 dark:fill-yellow-600 stroke-yellow-500" strokeWidth="1.5" />
        <text x="185" y="124" textAnchor="middle" className="fill-yellow-800 dark:fill-yellow-200" fontSize="8" fontWeight="bold">Heli-</text>
        <text x="185" y="133" textAnchor="middle" className="fill-yellow-800 dark:fill-yellow-200" fontSize="8" fontWeight="bold">case</text>
        {/* Helicase label line */}
        <line x1="185" y1="136" x2="185" y2="165" className="stroke-gray-400" strokeWidth="1" />
        <text x="185" y="178" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400" fontSize="10" fontWeight="600">
          Helicase
        </text>
        <text x="185" y="190" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          (unzips DNA)
        </text>

        {/* Leading strand (top, continuous) */}
        <path d="M 200,105 Q 260,80 340,65 Q 400,55 460,50"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="3" />
        {/* New complementary strand (continuous) */}
        <path d="M 210,115 Q 270,92 350,78 Q 410,68 460,63"
          fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" strokeDasharray="0" />

        {/* DNA polymerase on leading strand */}
        <ellipse cx="350" cy="68" rx="18" ry="12" className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-500" strokeWidth="1" />
        <text x="350" y="72" textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-200" fontSize="7" fontWeight="bold">Pol III</text>

        {/* Leading strand direction arrow */}
        <line x1="400" y1="45" x2="445" y2="40" className="stroke-blue-500" strokeWidth="1.5" markerEnd="url(#dnaArrowBlue)" />
        <text x="430" y="35" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="600">5′→3′</text>

        {/* Lagging strand (bottom, Okazaki fragments) */}
        <path d="M 200,135 Q 260,160 340,175 Q 400,185 460,190"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="3" />

        {/* Okazaki fragments (new strand, discontinuous) */}
        <path d="M 210,125 L 260,145" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" />
        <path d="M 270,148 L 320,163" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" />
        <path d="M 330,166 L 380,178" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" />
        <path d="M 390,181 L 440,190" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" />

        {/* Gaps between fragments */}
        {[265, 325, 385].map(x => (
          <text key={x} x={x} y={x * 0.33 + 70} textAnchor="middle" className="fill-gray-400" fontSize="12">⋯</text>
        ))}

        {/* DNA polymerase on lagging strand */}
        <ellipse cx="400" cy="182" rx="18" ry="12" className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-500" strokeWidth="1" />
        <text x="400" y="186" textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-200" fontSize="7" fontWeight="bold">Pol III</text>

        {/* Lagging strand direction arrow */}
        <line x1="260" y1="155" x2="220" y2="138" className="stroke-red-500" strokeWidth="1.5" markerEnd="url(#dnaArrowRed)" />
        <text x="230" y="163" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="600">3′→5′</text>

        {/* Labels */}
        <text x="440" y="45" textAnchor="start" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">Leading strand</text>
        <text x="440" y="55" textAnchor="start" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(continuous)</text>

        <text x="440" y="205" textAnchor="start" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">Lagging strand</text>
        <text x="440" y="215" textAnchor="start" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(Okazaki fragments)</text>

        {/* Legend */}
        <g transform="translate(30, 230)">
          <line x1="0" y1="5" x2="25" y2="5" className="stroke-blue-500" strokeWidth="3" />
          <text x="30" y="9" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Original template</text>

          <line x1="0" y1="25" x2="25" y2="25" className="stroke-red-500" strokeWidth="3" />
          <text x="30" y="29" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Original template</text>

          <line x1="200" y1="5" x2="225" y2="5" className="stroke-emerald-500" strokeWidth="2.5" />
          <text x="230" y="9" className="fill-gray-600 dark:fill-gray-300" fontSize="10">New strand</text>

          <circle cx="212" cy="25" r="8" className="fill-yellow-300 dark:fill-yellow-600" />
          <text x="230" y="29" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Helicase</text>
        </g>

        {/* Replication direction */}
        <line x1="170" y1="290" x2="300" y2="290" className="stroke-gray-500" strokeWidth="1.5" markerEnd="url(#dnaArrow)" />
        <text x="235" y="286" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Replication direction →</text>
      </svg>
    </div>
  );
}
