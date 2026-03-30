export default function MolecularShapeDiagram() {
  const panelW = 120;
  const panelH = 240;
  const gap = 10;

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 546 262"
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label="Molecular shapes: linear, bent, tetrahedral, trigonal planar"
      >
        {/* Panel 1: Linear — CO2 */}
        <g transform="translate(10, 10)">
          <rect width={panelW} height={panelH} rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={panelW / 2} y="20" textAnchor="middle" fontSize="12"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Linear
          </text>
          <text x={panelW / 2} y="34" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            CO₂
          </text>
          {/* O — C — O */}
          <circle cx="25" cy="120" r="14" className="fill-red-400" />
          <text x="25" y="124" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">O</text>
          <line x1="39" y1="120" x2="47" y2="120" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx={panelW / 2} cy="120" r="14" className="fill-gray-600 dark:fill-gray-400" />
          <text x={panelW / 2} y="124" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">C</text>
          <line x1="73" y1="120" x2="81" y2="120" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="95" cy="120" r="14" className="fill-red-400" />
          <text x="95" y="124" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">O</text>
          {/* Angle */}
          <text x={panelW / 2} y="155" textAnchor="middle" fontSize="11"
            fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            180°
          </text>
        </g>

        {/* Panel 2: Bent — H2O */}
        <g transform={`translate(${panelW + gap + 10}, 10)`}>
          <rect width={panelW} height={panelH} rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={panelW / 2} y="20" textAnchor="middle" fontSize="12"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Bent
          </text>
          <text x={panelW / 2} y="34" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            H₂O
          </text>
          {/* H — O — H at 104.5° */}
          <circle cx={panelW / 2} cy="100" r="14" className="fill-red-400" />
          <text x={panelW / 2} y="104" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">O</text>
          <line x1="48" y1="110" x2="30" y2="140" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="25" cy="148" r="12" className="fill-blue-300 dark:fill-blue-500" />
          <text x="25" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">H</text>
          <line x1="72" y1="110" x2="90" y2="140" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="95" cy="148" r="12" className="fill-blue-300 dark:fill-blue-500" />
          <text x="95" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">H</text>
          {/* Angle arc */}
          <path d={`M 48,118 A 20,20 0 0,1 72,118`} fill="none"
            className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1" />
          <text x={panelW / 2} y="175" textAnchor="middle" fontSize="11"
            fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            104.5°
          </text>
        </g>

        {/* Panel 3: Tetrahedral — CH4 */}
        <g transform={`translate(${2 * (panelW + gap) + 10}, 10)`}>
          <rect width={panelW} height={panelH} rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={panelW / 2} y="20" textAnchor="middle" fontSize="12"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Tetrahedral
          </text>
          <text x={panelW / 2} y="34" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            CH₄
          </text>
          {/* Central C */}
          <circle cx={panelW / 2} cy="110" r="14" className="fill-gray-600 dark:fill-gray-400" />
          <text x={panelW / 2} y="114" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">C</text>
          {/* 4 H atoms in pseudo-3D tetrahedral */}
          {/* Top */}
          <line x1="60" y1="97" x2="60" y2="60" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="60" cy="52" r="10" className="fill-blue-300 dark:fill-blue-500" />
          <text x="60" y="56" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">H</text>
          {/* Left */}
          <line x1="48" y1="117" x2="20" y2="145" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="15" cy="150" r="10" className="fill-blue-300 dark:fill-blue-500" />
          <text x="15" y="154" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">H</text>
          {/* Right */}
          <line x1="72" y1="117" x2="100" y2="145" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="105" cy="150" r="10" className="fill-blue-300 dark:fill-blue-500" />
          <text x="105" y="154" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">H</text>
          {/* Front (wedge — dashed for behind) */}
          <line x1="60" y1="124" x2="60" y2="160" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="60" cy="168" r="10" className="fill-blue-200 dark:fill-blue-600" />
          <text x="60" y="172" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white">H</text>
          <text x={panelW / 2} y="200" textAnchor="middle" fontSize="11"
            fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            109.5°
          </text>
        </g>

        {/* Panel 4: Trigonal Planar — BF3 */}
        <g transform={`translate(${3 * (panelW + gap) + 10}, 10)`}>
          <rect width={panelW} height={panelH} rx="6"
            className="fill-gray-50 dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
          <text x={panelW / 2} y="20" textAnchor="middle" fontSize="12"
            fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
            Trigonal Planar
          </text>
          <text x={panelW / 2} y="34" textAnchor="middle" fontSize="10"
            className="fill-gray-500 dark:fill-gray-400">
            BF₃
          </text>
          {/* Central B */}
          <circle cx={panelW / 2} cy="110" r="14" className="fill-green-500 dark:fill-green-400" />
          <text x={panelW / 2} y="114" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-white">B</text>
          {/* Top F */}
          <line x1="60" y1="96" x2="60" y2="64" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="60" cy="55" r="12" className="fill-yellow-400 dark:fill-yellow-500" />
          <text x="60" y="59" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-gray-800">F</text>
          {/* Bottom-left F */}
          <line x1="48" y1="119" x2="20" y2="155" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="14" cy="162" r="12" className="fill-yellow-400 dark:fill-yellow-500" />
          <text x="14" y="166" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-gray-800">F</text>
          {/* Bottom-right F */}
          <line x1="72" y1="119" x2="100" y2="155" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
          <circle cx="106" cy="162" r="12" className="fill-yellow-400 dark:fill-yellow-500" />
          <text x="106" y="166" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-gray-800">F</text>
          <text x={panelW / 2} y="195" textAnchor="middle" fontSize="11"
            fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            120°
          </text>
        </g>
      </svg>
    </div>
  );
}
