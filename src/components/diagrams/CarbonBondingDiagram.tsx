export default function CarbonBondingDiagram() {
  const panelW = 170;

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 540 200"
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label="Carbon bonding: tetrahedral, chain, and benzene ring"
      >
        {/* Panel 1: Tetrahedral carbon */}
        <g transform="translate(5, 5)">
          <rect width={panelW} height="190" rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={panelW / 2} y="20" textAnchor="middle" fontSize="11"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Tetrahedral Carbon
          </text>

          {/* Central C */}
          <circle cx="85" cy="100" r="16" className="fill-gray-600 dark:fill-gray-400" />
          <text x="85" y="104" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">C</text>

          {/* 4 bonds in pseudo-3D */}
          {/* Top */}
          <line x1="85" y1="84" x2="85" y2="48" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="85" cy="42" r="10" className="fill-blue-300 dark:fill-blue-500" />
          <text x="85" y="46" textAnchor="middle" fontSize="10" className="fill-white">H</text>
          {/* Bottom-left */}
          <line x1="72" y1="112" x2="40" y2="148" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="34" cy="154" r="10" className="fill-blue-300 dark:fill-blue-500" />
          <text x="34" y="158" textAnchor="middle" fontSize="10" className="fill-white">H</text>
          {/* Bottom-right */}
          <line x1="98" y1="112" x2="130" y2="148" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="136" cy="154" r="10" className="fill-blue-300 dark:fill-blue-500" />
          <text x="136" y="158" textAnchor="middle" fontSize="10" className="fill-white">H</text>
          {/* Behind (dashed) */}
          <line x1="85" y1="116" x2="85" y2="150" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="85" cy="158" r="10" className="fill-blue-200 dark:fill-blue-600" />
          <text x="85" y="162" textAnchor="middle" fontSize="10" className="fill-white">H</text>

          <text x={panelW / 2} y="185" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            sp³ hybridised, 109.5°
          </text>
        </g>

        {/* Panel 2: Carbon chain */}
        <g transform={`translate(${panelW + 12}, 5)`}>
          <rect width={panelW} height="190" rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={panelW / 2} y="20" textAnchor="middle" fontSize="11"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Carbon Chain
          </text>

          {/* C—C—C—C chain with H atoms */}
          {[0, 1, 2, 3].map((i) => {
            const x = 25 + i * 35;
            const y = 95;
            return (
              <g key={i}>
                {/* C-C bond */}
                {i < 3 && (
                  <line x1={x + 12} y1={y} x2={x + 23} y2={y}
                    className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
                )}
                {/* Carbon atom */}
                <circle cx={x} cy={y} r="12" className="fill-gray-600 dark:fill-gray-400" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">C</text>
                {/* H atoms above and below */}
                <line x1={x} y1={y - 12} x2={x} y2={y - 28}
                  className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
                <circle cx={x} cy={y - 33} r="7" className="fill-blue-300 dark:fill-blue-500" />
                <text x={x} y={y - 30} textAnchor="middle" fontSize="8" className="fill-white">H</text>
                <line x1={x} y1={y + 12} x2={x} y2={y + 28}
                  className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
                <circle cx={x} cy={y + 33} r="7" className="fill-blue-300 dark:fill-blue-500" />
                <text x={x} y={y + 36} textAnchor="middle" fontSize="8" className="fill-white">H</text>
              </g>
            );
          })}

          {/* End H atoms */}
          <line x1="13" y1="95" x2="5" y2="95"
            className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
          <text x="3" y="99" textAnchor="end" fontSize="10" className="fill-blue-500 dark:fill-blue-400">H</text>
          <line x1="142" y1="95" x2="155" y2="95"
            className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
          <text x="160" y="99" fontSize="10" className="fill-blue-500 dark:fill-blue-400">H</text>

          <text x={panelW / 2} y="165" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            Butane: C₄H₁₀
          </text>
          <text x={panelW / 2} y="180" textAnchor="middle" fontSize="10"
            className="fill-gray-400 dark:fill-gray-500">
            Catenation — C chains
          </text>
        </g>

        {/* Panel 3: Benzene ring */}
        <g transform={`translate(${2 * (panelW + 12)}, 5)`}>
          <rect width={panelW} height="190" rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={panelW / 2} y="20" textAnchor="middle" fontSize="11"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Benzene Ring
          </text>

          {/* Hexagonal ring */}
          {(() => {
            const rcx = panelW / 2;
            const rcy = 100;
            const r = 35;
            const pts: [number, number][] = [];
            for (let k = 0; k < 6; k++) {
              const angle = (Math.PI / 3) * k - Math.PI / 2;
              pts.push([rcx + r * Math.cos(angle), rcy + r * Math.sin(angle)]);
            }
            return (
              <>
                {/* Bonds */}
                {pts.map((p, k) => {
                  const next = pts[(k + 1) % 6];
                  return (
                    <g key={`b-${k}`}>
                      <line x1={p[0]} y1={p[1]} x2={next[0]} y2={next[1]}
                        className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="2" />
                      {/* Alternating double bonds */}
                      {k % 2 === 0 && (
                        <line
                          x1={p[0] + (rcx - p[0]) * 0.2}
                          y1={p[1] + (rcy - p[1]) * 0.2}
                          x2={next[0] + (rcx - next[0]) * 0.2}
                          y2={next[1] + (rcy - next[1]) * 0.2}
                          className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1.5" />
                      )}
                    </g>
                  );
                })}
                {/* Carbon atoms at vertices */}
                {pts.map((p, k) => {
                  const hAngle = (Math.PI / 3) * k - Math.PI / 2;
                  const hx = rcx + (r + 25) * Math.cos(hAngle);
                  const hy = rcy + (r + 25) * Math.sin(hAngle);
                  return (
                    <g key={`c-${k}`}>
                      <circle cx={p[0]} cy={p[1]} r="10"
                        className="fill-gray-600 dark:fill-gray-400" />
                      <text x={p[0]} y={p[1] + 4} textAnchor="middle"
                        fontSize="9" fontWeight="bold" className="fill-white">C</text>
                      {/* H bond */}
                      <line x1={p[0]} y1={p[1]}
                        x2={hx} y2={hy}
                        className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
                      <text x={hx} y={hy + 4} textAnchor="middle"
                        fontSize="9" className="fill-blue-500 dark:fill-blue-400">H</text>
                    </g>
                  );
                })}
              </>
            );
          })()}

          <text x={panelW / 2} y="165" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            Benzene: C₆H₆
          </text>
          <text x={panelW / 2} y="180" textAnchor="middle" fontSize="10"
            className="fill-gray-400 dark:fill-gray-500">
            Ring structure
          </text>
        </g>
      </svg>
    </div>
  );
}
