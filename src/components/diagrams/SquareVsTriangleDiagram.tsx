export default function SquareVsTriangleDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox="0 0 550 450"
        className="w-full"
        role="img"
        aria-label="Side-by-side comparison showing that a square frame collapses under force but adding a diagonal makes it rigid with triangles"
      >
        {/* ══════════ LEFT PANEL — Square frame (weak) ══════════ */}
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
            Square frame
          </text>

          {/* Original square — solid sticks */}
          <line x1="60" y1="60" x2="200" y2="60" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="4" strokeLinecap="round" />
          <line x1="200" y1="60" x2="200" y2="200" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="4" strokeLinecap="round" />
          <line x1="200" y1="200" x2="60" y2="200" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="4" strokeLinecap="round" />
          <line x1="60" y1="200" x2="60" y2="60" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="4" strokeLinecap="round" />

          {/* Joint circles at corners */}
          <circle cx="60" cy="60" r="5" className="fill-amber-200 dark:fill-amber-800 stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.5" />
          <circle cx="200" cy="60" r="5" className="fill-amber-200 dark:fill-amber-800 stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="5" className="fill-amber-200 dark:fill-amber-800 stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.5" />
          <circle cx="60" cy="200" r="5" className="fill-amber-200 dark:fill-amber-800 stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.5" />

          {/* Red arrow pushing top-right corner to the right */}
          <defs>
            <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0,0 8,3 0,6" className="fill-red-500 dark:fill-red-400" />
            </marker>
          </defs>
          <line
            x1="218"
            y1="60"
            x2="248"
            y2="60"
            className="stroke-red-500 dark:stroke-red-400"
            strokeWidth="2.5"
            markerEnd="url(#arrowRed)"
          />

          {/* Collapsed diamond — dashed lines showing deformation */}
          <line x1="95" y1="50" x2="230" y2="95" className="stroke-red-400 dark:stroke-red-500" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 3" />
          <line x1="230" y1="95" x2="165" y2="210" className="stroke-red-400 dark:stroke-red-500" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 3" />
          <line x1="165" y1="210" x2="25" y2="160" className="stroke-red-400 dark:stroke-red-500" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 3" />
          <line x1="25" y1="160" x2="95" y2="50" className="stroke-red-400 dark:stroke-red-500" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 3" />

          {/* Collapsed joint circles */}
          <circle cx="95" cy="50" r="4" className="fill-red-200 dark:fill-red-900 stroke-red-400 dark:stroke-red-500" strokeWidth="1" />
          <circle cx="230" cy="95" r="4" className="fill-red-200 dark:fill-red-900 stroke-red-400 dark:stroke-red-500" strokeWidth="1" />
          <circle cx="165" cy="210" r="4" className="fill-red-200 dark:fill-red-900 stroke-red-400 dark:stroke-red-500" strokeWidth="1" />
          <circle cx="25" cy="160" r="4" className="fill-red-200 dark:fill-red-900 stroke-red-400 dark:stroke-red-500" strokeWidth="1" />

          {/* Red X */}
          <g transform="translate(130, 240)">
            <circle cx="0" cy="0" r="14" className="fill-red-100 dark:fill-red-900/50 stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
            <line x1="-6" y1="-6" x2="6" y2="6" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="6" y1="-6" x2="-6" y2="6" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* "Weak" label */}
          <text
            x="130"
            y="268"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            className="fill-red-600 dark:fill-red-400"
          >
            Weak
          </text>

          {/* Description */}
          <text
            x="130"
            y="286"
            textAnchor="middle"
            fontSize="9"
            className="fill-red-600 dark:fill-red-400"
            fontWeight="600"
          >
            Push one corner →
          </text>
          <text
            x="130"
            y="298"
            textAnchor="middle"
            fontSize="9"
            className="fill-red-600 dark:fill-red-400"
            fontWeight="600"
          >
            collapses into a diamond
          </text>
        </g>

        {/* ══════════ Divider ══════════ */}
        <line
          x1="260"
          y1="10"
          x2="260"
          y2="310"
          className="stroke-gray-300 dark:stroke-gray-600"
          strokeWidth="1"
          strokeDasharray="4 3"
        />

        {/* ══════════ RIGHT PANEL — Square + diagonal (strong) ══════════ */}
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
            Add one diagonal
          </text>

          {/* Square sticks */}
          <line x1="320" y1="60" x2="460" y2="60" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="4" strokeLinecap="round" />
          <line x1="460" y1="60" x2="460" y2="200" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="4" strokeLinecap="round" />
          <line x1="460" y1="200" x2="320" y2="200" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="4" strokeLinecap="round" />
          <line x1="320" y1="200" x2="320" y2="60" className="stroke-amber-700 dark:stroke-amber-500" strokeWidth="4" strokeLinecap="round" />

          {/* Diagonal stick */}
          <line x1="320" y1="60" x2="460" y2="200" className="stroke-green-600 dark:stroke-green-400" strokeWidth="3.5" strokeLinecap="round" />

          {/* Small triangle fill hints to show the two triangles */}
          <polygon points="320,60 460,60 460,200" className="fill-green-100/40 dark:fill-green-800/20" />
          <polygon points="320,60 460,200 320,200" className="fill-green-200/40 dark:fill-green-700/20" />

          {/* Joint circles at corners */}
          <circle cx="320" cy="60" r="5" className="fill-amber-200 dark:fill-amber-800 stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.5" />
          <circle cx="460" cy="60" r="5" className="fill-amber-200 dark:fill-amber-800 stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.5" />
          <circle cx="460" cy="200" r="5" className="fill-amber-200 dark:fill-amber-800 stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.5" />
          <circle cx="320" cy="200" r="5" className="fill-amber-200 dark:fill-amber-800 stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.5" />

          {/* Red arrow pushing top-right corner — same force */}
          <line
            x1="478"
            y1="60"
            x2="508"
            y2="60"
            className="stroke-red-500 dark:stroke-red-400"
            strokeWidth="2.5"
            markerEnd="url(#arrowRed)"
          />

          {/* "No movement" indicator — small double lines showing rigidity */}
          <line x1="468" y1="54" x2="468" y2="66" className="stroke-green-600 dark:stroke-green-400" strokeWidth="2" strokeLinecap="round" />
          <line x1="473" y1="54" x2="473" y2="66" className="stroke-green-600 dark:stroke-green-400" strokeWidth="2" strokeLinecap="round" />

          {/* Green check */}
          <g transform="translate(390, 240)">
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

          {/* "Strong" label */}
          <text
            x="390"
            y="268"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            className="fill-green-700 dark:fill-green-400"
          >
            Strong
          </text>

          {/* Description */}
          <text
            x="390"
            y="286"
            textAnchor="middle"
            fontSize="9"
            className="fill-green-700 dark:fill-green-400"
            fontWeight="600"
          >
            The diagonal locks the shape —
          </text>
          <text
            x="390"
            y="298"
            textAnchor="middle"
            fontSize="9"
            className="fill-green-700 dark:fill-green-400"
            fontWeight="600"
          >
            triangles are rigid
          </text>
        </g>

        {/* ══════════ BOTTOM — Takeaway ══════════ */}
        <line
          x1="20"
          y1="320"
          x2="500"
          y2="320"
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth="1"
        />

        {/* Small triangle icons as decoration */}
        <polygon points="120,355 130,340 140,355" className="fill-amber-400/60 dark:fill-amber-600/40 stroke-amber-600 dark:stroke-amber-400" strokeWidth="1" />
        <polygon points="260,355 270,340 280,355" className="fill-amber-400/60 dark:fill-amber-600/40 stroke-amber-600 dark:stroke-amber-400" strokeWidth="1" />
        <polygon points="380,355 390,340 400,355" className="fill-amber-400/60 dark:fill-amber-600/40 stroke-amber-600 dark:stroke-amber-400" strokeWidth="1" />

        {/* Labels under triangles */}
        <text x="130" y="370" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">bridges</text>
        <text x="270" y="370" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">bicycle frames</text>
        <text x="390" y="370" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">basket weaves</text>

        <text
          x="260"
          y="400"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          className="fill-amber-700 dark:fill-amber-400"
          fontFamily="sans-serif"
        >
          This is why bridges, bicycle frames, and basket weaves use triangles
        </text>
      </svg>
    </div>
  );
}
