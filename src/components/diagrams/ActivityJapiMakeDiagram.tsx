/**
 * ActivityJapiMakeDiagram - Step-by-step visual guide for making
 * a paper/cardboard japi hat to explore cone geometry hands-on.
 */
export default function ActivityJapiMakeDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox="0 0 584 400"
        className="w-full"
        role="img"
        aria-label="Step-by-step guide to making a paper japi hat: draw circle, cut sector, fold into cone, measure angles"
      >
        {/* Title */}
        <text
          x="280"
          y="22"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          className="fill-gray-700 dark:fill-gray-200"
        >
          Make a paper japi: explore cone geometry
        </text>

        {/* ===== STEP 1: Draw a circle ===== */}
        <g transform="translate(75, 100)">
          <circle
            cx="0"
            cy="0"
            r="55"
            fill="none"
            className="stroke-amber-500 dark:stroke-amber-400"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <circle cx="0" cy="0" r="2.5" className="fill-gray-600 dark:fill-gray-300" />
          {/* Radius line */}
          <line
            x1="0"
            y1="0"
            x2="50"
            y2="0"
            className="stroke-gray-500 dark:stroke-gray-400"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <text
            x="25"
            y="-6"
            textAnchor="middle"
            fontSize="10"
            className="fill-gray-600 dark:fill-gray-300"
          >
            15 cm
          </text>
          {/* Compass hint */}
          <line
            x1="0"
            y1="0"
            x2="15"
            y2="-40"
            className="stroke-gray-400 dark:stroke-gray-500"
            strokeWidth="0.8"
          />
          <circle cx="15" cy="-40" r="2" className="fill-gray-400 dark:fill-gray-500" />
        </g>
        <text
          x="75"
          y="175"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200"
        >
          1. Draw a circle
        </text>
        <text
          x="75"
          y="190"
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500 dark:fill-gray-400"
        >
          Radius = 15 cm
        </text>

        {/* ===== STEP 2: Cut a sector ===== */}
        <g transform="translate(225, 100)">
          {/* Full circle outline */}
          <circle
            cx="0"
            cy="0"
            r="55"
            fill="none"
            className="stroke-gray-300 dark:stroke-gray-600"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          {/* Remaining sector (270 degrees) */}
          <path
            d={`M 0,-55 A 55,55 0 1,1 -55,0 L 0,0 Z`}
            className="fill-amber-200/60 dark:fill-amber-700/30 stroke-amber-500 dark:stroke-amber-400"
            strokeWidth="1.5"
          />
          {/* Removed sector (90 degrees) */}
          <path
            d={`M 0,0 L -55,0 A 55,55 0 0,1 0,-55 Z`}
            className="fill-red-100/50 dark:fill-red-900/20 stroke-red-400 dark:stroke-red-400"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          {/* Scissors icon hint */}
          <text
            x="-30"
            y="-28"
            fontSize="14"
            className="fill-red-400 dark:fill-red-400"
          >
            ✂
          </text>
          {/* Angle label for removed sector */}
          <path
            d="M -18,0 A 18,18 0 0,1 0,-18"
            fill="none"
            className="stroke-red-400 dark:stroke-red-400"
            strokeWidth="1"
          />
          <text
            x="-14"
            y="-14"
            fontSize="10"
            className="fill-red-500 dark:fill-red-400"
          >
            90°
          </text>
        </g>
        <text
          x="225"
          y="175"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200"
        >
          2. Cut out a sector
        </text>
        <text
          x="225"
          y="190"
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500 dark:fill-gray-400"
        >
          Remove 90° wedge
        </text>

        {/* ===== STEP 3: Fold into cone ===== */}
        <g transform="translate(375, 100)">
          {/* Cone shape (triangle side view) */}
          <polygon
            points="0,-50 -45,30 45,30"
            className="fill-amber-300/70 dark:fill-amber-600/40 stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Base ellipse */}
          <ellipse
            cx="0"
            cy="30"
            rx="45"
            ry="10"
            className="fill-amber-400/40 dark:fill-amber-700/30 stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="1"
          />
          {/* Height line */}
          <line
            x1="0"
            y1="-50"
            x2="0"
            y2="30"
            className="stroke-gray-500 dark:stroke-gray-400"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <text
            x="6"
            y="-5"
            fontSize="10"
            className="fill-gray-600 dark:fill-gray-300"
          >
            h
          </text>
          {/* Slant height label */}
          <text
            x="28"
            y="-4"
            fontSize="10"
            className="fill-amber-700 dark:fill-amber-400"
          >
            l = 15cm
          </text>
          {/* Curl arrows to show folding */}
          <path
            d="M -55,10 C -50,-10 -30,-30 -10,-40"
            fill="none"
            className="stroke-gray-400 dark:stroke-gray-500"
            strokeWidth="1"
            markerEnd="url(#foldArrow)"
          />
          <path
            d="M 55,10 C 50,-10 30,-30 10,-40"
            fill="none"
            className="stroke-gray-400 dark:stroke-gray-500"
            strokeWidth="1"
            markerEnd="url(#foldArrow)"
          />
          <defs>
            <marker
              id="foldArrow"
              markerWidth="6"
              markerHeight="5"
              refX="5"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0,0 6,2.5 0,5" className="fill-gray-400 dark:fill-gray-500" />
            </marker>
          </defs>
        </g>
        <text
          x="375"
          y="175"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200"
        >
          3. Fold into a cone
        </text>
        <text
          x="375"
          y="190"
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500 dark:fill-gray-400"
        >
          Tape the edges together
        </text>

        {/* ===== STEP 4: Measure and compare ===== */}
        <g transform="translate(510, 100)">
          {/* Mini cone */}
          <polygon
            points="0,-35 -25,20 25,20"
            className="fill-amber-200/60 dark:fill-amber-600/30 stroke-amber-500 dark:stroke-amber-400"
            strokeWidth="1.2"
          />
          {/* Protractor arc */}
          <path
            d="M -25,20 A 30,30 0 0,1 25,20"
            fill="none"
            className="stroke-blue-400 dark:stroke-blue-400"
            strokeWidth="1.5"
          />
          {/* Angle tick marks */}
          {[30, 45, 60, 75, 90, 105, 120, 135, 150].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const inner = 25;
            const outer = 28;
            return (
              <line
                key={deg}
                x1={-Math.cos(rad) * inner}
                y1={20 - Math.sin(rad) * inner}
                x2={-Math.cos(rad) * outer}
                y2={20 - Math.sin(rad) * outer}
                className="stroke-blue-400 dark:stroke-blue-400"
                strokeWidth="0.8"
              />
            );
          })}
          {/* Angle label */}
          <text
            x="0"
            y="45"
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            className="fill-blue-600 dark:fill-blue-400"
          >
            apex angle?
          </text>
        </g>
        <text
          x="510"
          y="175"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200"
        >
          4. Measure
        </text>
        <text
          x="510"
          y="190"
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500 dark:fill-gray-400"
        >
          What is the apex angle?
        </text>

        {/* ===== BOTTOM: The math connection ===== */}
        <line
          x1="20"
          y1="215"
          x2="540"
          y2="215"
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth="1"
        />

        {/* Formula box */}
        <rect
          x="30"
          y="230"
          width="500"
          height="70"
          rx="8"
          className="fill-amber-50 dark:fill-amber-950/30 stroke-amber-300 dark:stroke-amber-700"
          strokeWidth="1"
        />

        <text
          x="280"
          y="253"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200"
        >
          Why does removing 90° make a good japi?
        </text>
        <text
          x="280"
          y="272"
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-600 dark:fill-gray-300"
        >
          Remaining arc = 270° out of 360° = 3/4 of the circle
        </text>
        <text
          x="280"
          y="290"
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-600 dark:fill-gray-300"
        >
          New base circumference = 3/4 × original = shorter base, steeper cone
        </text>

        {/* Try it prompt */}
        <text
          x="280"
          y="325"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          className="fill-amber-700 dark:fill-amber-400"
        >
          Try different sector sizes: 60° (gentle slope) vs 120° (steep cone)
        </text>
        <text
          x="280"
          y="345"
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500 dark:fill-gray-400"
        >
          Which cone sheds water best? Which gives the most shade?
        </text>

        {/* Three mini cones showing the trade-off */}
        <g transform="translate(140, 378)">
          {/* Gentle */}
          <polygon
            points="0,-12 -22,8 22,8"
            className="fill-blue-200/60 dark:fill-blue-800/30 stroke-blue-400 dark:stroke-blue-400"
            strokeWidth="1"
          />
          <text
            x="0"
            y="20"
            textAnchor="middle"
            fontSize="10"
            className="fill-gray-500 dark:fill-gray-400"
          >
            60° removed
          </text>
        </g>
        <g transform="translate(280, 378)">
          {/* Medium (japi) */}
          <polygon
            points="0,-18 -20,8 20,8"
            className="fill-amber-300/70 dark:fill-amber-600/40 stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="20"
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            className="fill-amber-700 dark:fill-amber-400"
          >
            90° (japi)
          </text>
        </g>
        <g transform="translate(420, 378)">
          {/* Steep */}
          <polygon
            points="0,-25 -14,8 14,8"
            className="fill-red-200/60 dark:fill-red-800/30 stroke-red-400 dark:stroke-red-400"
            strokeWidth="1"
          />
          <text
            x="0"
            y="20"
            textAnchor="middle"
            fontSize="10"
            className="fill-gray-500 dark:fill-gray-400"
          >
            120° removed
          </text>
        </g>
      </svg>
    </div>
  );
}
