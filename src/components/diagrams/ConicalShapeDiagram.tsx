export default function ConicalShapeDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox="0 0 568 399"
        className="w-full"
        role="img"
        aria-label="Side-by-side comparison showing why a cone shape sheds rain better than a flat surface"
      >
        {/* ══════════ LEFT PANEL — Flat surface ══════════ */}
        <g>
          {/* Panel heading */}
          <text
            x="130"
            y="24"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            className="fill-gray-700 dark:fill-gray-200"
          >
            Flat surface
          </text>

          {/* Flat disc (side view — a thin rectangle) */}
          <rect
            x="60"
            y="140"
            width="140"
            height="6"
            rx="2"
            className="fill-amber-400 dark:fill-amber-500 stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="1.5"
          />

          {/* Water puddle on top */}
          <ellipse
            cx="130"
            cy="134"
            rx="40"
            ry="6"
            className="fill-blue-400/70 dark:fill-blue-500/60"
          />
          <ellipse
            cx="130"
            cy="134"
            rx="40"
            ry="6"
            fill="none"
            className="stroke-blue-500 dark:stroke-blue-400"
            strokeWidth="1"
          />

          {/* Rain drops falling */}
          {[85, 115, 145, 170].map((x, i) => (
            <g key={`flat-rain-${i}`}>
              <circle cx={x} cy={50 + i * 18} r="3" className="fill-blue-400 dark:fill-blue-400" />
              <circle cx={x + 20} cy={65 + i * 14} r="2.5" className="fill-blue-400 dark:fill-blue-400" />
            </g>
          ))}

          {/* Red X */}
          <g transform="translate(130, 175)">
            <circle cx="0" cy="0" r="14" className="fill-red-100 dark:fill-red-900/50 stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
            <line x1="-6" y1="-6" x2="6" y2="6" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="6" y1="-6" x2="-6" y2="6" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Label */}
          <text
            x="130"
            y="208"
            textAnchor="middle"
            fontSize="10"
            className="fill-red-600 dark:fill-red-400"
            fontWeight="600"
          >
            Water pools in the centre
          </text>

          {/* Stick figure head underneath flat surface */}
          <circle
            cx="130"
            cy="158"
            r="7"
            fill="none"
            className="stroke-gray-500 dark:stroke-gray-400"
            strokeWidth="1.2"
          />
          <line x1="130" y1="165" x2="130" y2="220" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="3 2" />
        </g>

        {/* ══════════ Divider ══════════ */}
        <line
          x1="260"
          y1="10"
          x2="260"
          y2="230"
          className="stroke-gray-300 dark:stroke-gray-600"
          strokeWidth="1"
          strokeDasharray="4 3"
        />

        {/* ══════════ RIGHT PANEL — Cone (Japi shape) ══════════ */}
        <g>
          {/* Panel heading */}
          <text
            x="390"
            y="24"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            className="fill-gray-700 dark:fill-gray-200"
          >
            Cone (Japi shape)
          </text>

          {/* Cone shape (triangle, side view) */}
          <polygon
            points="390,80 310,146 470,146"
            className="fill-amber-300/80 dark:fill-amber-600/60 stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Rain drops falling */}
          {[340, 370, 410, 440].map((x, i) => (
            <g key={`cone-rain-${i}`}>
              <circle cx={x} cy={42 + i * 10} r="3" className="fill-blue-400 dark:fill-blue-400" />
              <circle cx={x - 15} cy={50 + i * 8} r="2.5" className="fill-blue-400 dark:fill-blue-400" />
            </g>
          ))}

          {/* Water runoff arrows — LEFT side */}
          <defs>
            <marker
              id="arrowBlue"
              markerWidth="7"
              markerHeight="5"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0,0 7,2.5 0,5" className="fill-blue-500 dark:fill-blue-400" />
            </marker>
          </defs>

          {/* Left slope runoff */}
          <line
            x1="340"
            y1="118"
            x2="308"
            y2="150"
            className="stroke-blue-500 dark:stroke-blue-400"
            strokeWidth="2"
            markerEnd="url(#arrowBlue)"
          />
          <line
            x1="355"
            y1="108"
            x2="318"
            y2="148"
            className="stroke-blue-500 dark:stroke-blue-400"
            strokeWidth="1.5"
            markerEnd="url(#arrowBlue)"
          />

          {/* Right slope runoff */}
          <line
            x1="440"
            y1="118"
            x2="472"
            y2="150"
            className="stroke-blue-500 dark:stroke-blue-400"
            strokeWidth="2"
            markerEnd="url(#arrowBlue)"
          />
          <line
            x1="425"
            y1="108"
            x2="462"
            y2="148"
            className="stroke-blue-500 dark:stroke-blue-400"
            strokeWidth="1.5"
            markerEnd="url(#arrowBlue)"
          />

          {/* Dripping drops below edges */}
          <circle cx="302" cy="158" r="2" className="fill-blue-400 dark:fill-blue-400" />
          <circle cx="300" cy="168" r="1.5" className="fill-blue-300 dark:fill-blue-500" />
          <circle cx="478" cy="158" r="2" className="fill-blue-400 dark:fill-blue-400" />
          <circle cx="480" cy="168" r="1.5" className="fill-blue-300 dark:fill-blue-500" />

          {/* Green check */}
          <g transform="translate(390, 175)">
            <circle cx="0" cy="0" r="14" className="fill-green-100 dark:fill-green-900/50 stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
            <polyline
              points="-6,0 -2,5 7,-5"
              fill="none"
              className="stroke-green-600 dark:stroke-green-400"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Label */}
          <text
            x="390"
            y="208"
            textAnchor="middle"
            fontSize="10"
            className="fill-green-700 dark:fill-green-400"
            fontWeight="600"
          >
            Water runs off the slope
          </text>

          {/* Stick figure head underneath cone */}
          <circle
            cx="390"
            cy="158"
            r="7"
            fill="none"
            className="stroke-gray-500 dark:stroke-gray-400"
            strokeWidth="1.2"
          />
          <line x1="390" y1="165" x2="390" y2="220" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="3 2" />
        </g>

        {/* ══════════ BOTTOM — Slope angle diagram ══════════ */}
        <line
          x1="20"
          y1="245"
          x2="500"
          y2="245"
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth="1"
        />

        <g transform="translate(80, 290)">
          {/* Horizontal base line */}
          <line
            x1="0"
            y1="0"
            x2="80"
            y2="0"
            className="stroke-gray-500 dark:stroke-gray-400"
            strokeWidth="1.5"
          />
          {/* Sloped line (the cone's side) */}
          <line
            x1="0"
            y1="0"
            x2="80"
            y2="-50"
            className="stroke-amber-500 dark:stroke-amber-400"
            strokeWidth="2"
          />
          {/* Angle arc */}
          <path
            d="M 24,0 A 24,24 0 0,1 20.5,-8.3"
            fill="none"
            className="stroke-gray-600 dark:stroke-gray-300"
            strokeWidth="1.2"
          />
          {/* Angle label */}
          <text
            x="30"
            y="-2"
            fontSize="10"
            className="fill-gray-600 dark:fill-gray-300"
            fontWeight="600"
          >
            slope angle
          </text>
        </g>

        {/* Explanation text */}
        <text
          x="260"
          y="332"
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-600 dark:fill-gray-300"
          fontFamily="sans-serif"
        >
          Steeper = faster runoff, but less shade.
        </text>
        <text
          x="260"
          y="348"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          className="fill-amber-700 dark:fill-amber-400"
          fontFamily="sans-serif"
        >
          The japi is the sweet spot.
        </text>

        {/* Small spectrum bar showing the trade-off */}
        <g transform="translate(160, 358)">
          <rect x="0" y="0" width="200" height="6" rx="3" className="fill-gray-200 dark:fill-gray-700" />
          {/* Gradient fill for the spectrum */}
          <defs>
            <linearGradient id="slopeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" className="[stop-color:theme(colors.blue.400)]" />
              <stop offset="50%" className="[stop-color:theme(colors.amber.400)]" />
              <stop offset="100%" className="[stop-color:theme(colors.red.400)]" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="200" height="6" rx="3" fill="url(#slopeGrad)" opacity="0.7" />
          {/* Japi marker */}
          <polygon points="100,-3 96,3 104,-3" className="fill-amber-600 dark:fill-amber-400" />
          <line x1="100" y1="-2" x2="100" y2="8" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
          <text x="0" y="18" fontSize="9" className="fill-gray-500 dark:fill-gray-400">Flat (pools)</text>
          <text x="200" y="18" textAnchor="end" fontSize="9" className="fill-gray-500 dark:fill-gray-400">Very steep (no shade)</text>
        </g>
      </svg>
    </div>
  );
}
