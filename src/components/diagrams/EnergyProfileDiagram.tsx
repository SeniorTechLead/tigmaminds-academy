export default function EnergyProfileDiagram() {
  return (
    <div className="my-4">
      <svg
        viewBox="0 0 450 300"
        className="w-full max-w-lg mx-auto"
        role="img"
        aria-label="Energy profile diagram comparing reaction with and without catalyst"
      >
        {/* Axes */}
        <line x1="60" y1="260" x2="420" y2="260"
          className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="1.5" />
        <line x1="60" y1="260" x2="60" y2="20"
          className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="1.5" />

        {/* Axis labels */}
        <text x="240" y="290" textAnchor="middle" fontSize="12"
          className="fill-gray-600 dark:fill-gray-300">
          Reaction Progress
        </text>
        <text x="20" y="140" textAnchor="middle" fontSize="12"
          className="fill-gray-600 dark:fill-gray-300"
          transform="rotate(-90, 20, 140)">
          Energy
        </text>

        {/* Axis arrows */}
        <polygon points="420,260 414,255 414,265" className="fill-gray-600 dark:fill-gray-400" />
        <polygon points="60,20 55,26 65,26" className="fill-gray-600 dark:fill-gray-400" />

        {/* Reactants level */}
        <line x1="70" y1="130" x2="140" y2="130"
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="4 3" />
        <text x="80" y="125" fontSize="11" fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200">
          Reactants
        </text>

        {/* Products level */}
        <line x1="310" y1="200" x2="400" y2="200"
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="4 3" />
        <text x="330" y="195" fontSize="11" fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200">
          Products
        </text>

        {/* Without catalyst curve (higher hump) */}
        <path
          d="M 100,130 C 140,130 160,40 220,40 C 280,40 300,200 360,200"
          fill="none"
          className="stroke-red-500 dark:stroke-red-400"
          strokeWidth="2.5"
        />

        {/* With catalyst curve (lower hump) */}
        <path
          d="M 100,130 C 140,130 170,80 220,80 C 270,80 300,200 360,200"
          fill="none"
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2.5"
          strokeDasharray="8 4"
        />

        {/* Activation energy — without catalyst */}
        <line x1="220" y1="130" x2="220" y2="40"
          className="stroke-red-400 dark:stroke-red-300" strokeWidth="1" strokeDasharray="3 2" />
        <text x="232" y="80" fontSize="10"
          className="fill-red-600 dark:fill-red-300">
          Ea
        </text>
        {/* Brace-like marker */}
        <line x1="216" y1="40" x2="224" y2="40"
          className="stroke-red-400 dark:stroke-red-300" strokeWidth="1" />
        <line x1="216" y1="130" x2="224" y2="130"
          className="stroke-red-400 dark:stroke-red-300" strokeWidth="1" />

        {/* Activation energy — with catalyst */}
        <line x1="190" y1="130" x2="190" y2="80"
          className="stroke-blue-400 dark:stroke-blue-300" strokeWidth="1" strokeDasharray="3 2" />
        <text x="170" y="108" fontSize="10"
          className="fill-blue-600 dark:fill-blue-300">
          Ea'
        </text>
        <line x1="186" y1="80" x2="194" y2="80"
          className="stroke-blue-400 dark:stroke-blue-300" strokeWidth="1" />
        <line x1="186" y1="130" x2="194" y2="130"
          className="stroke-blue-400 dark:stroke-blue-300" strokeWidth="1" />

        {/* Delta H (energy difference) */}
        <line x1="400" y1="130" x2="400" y2="200"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
        <polygon points="400,200 396,192 404,192" className="fill-green-500 dark:fill-green-400" />
        <text x="410" y="168" fontSize="10" fontWeight="600"
          className="fill-green-600 dark:fill-green-400">
          ΔH
        </text>

        {/* Legend */}
        <line x1="80" y1="30" x2="110" y2="30"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" />
        <text x="115" y="34" fontSize="10"
          className="fill-gray-600 dark:fill-gray-300">
          Without catalyst
        </text>
        <line x1="230" y1="30" x2="260" y2="30"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" strokeDasharray="8 4" />
        <text x="265" y="34" fontSize="10"
          className="fill-gray-600 dark:fill-gray-300">
          With catalyst
        </text>

        {/* Exothermic label */}
        <text x="240" y="275" textAnchor="middle" fontSize="10"
          className="fill-gray-500 dark:fill-gray-400">
          Exothermic reaction (products lower than reactants)
        </text>
      </svg>
    </div>
  );
}
