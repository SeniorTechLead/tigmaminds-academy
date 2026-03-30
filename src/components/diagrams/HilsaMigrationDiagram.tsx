/* HilsaMigrationDiagram – Anadromous migration from Bay of Bengal upstream into the Brahmaputra */

const RIVER_PTS = [
  { x: 30, y: 170 }, { x: 100, y: 175 }, { x: 180, y: 160 },
  { x: 260, y: 155 }, { x: 340, y: 145 }, { x: 420, y: 135 },
  { x: 500, y: 120 }, { x: 560, y: 105 },
];

const toPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

const riverPath = toPath(RIVER_PTS);

// Fish silhouette (simple)
const Fish = ({ x, y, flip }: { x: number; y: number; flip?: boolean }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -0.6 : 0.6},0.6)`}>
    <path d="M0,0 Q8,-6 18,0 Q8,6 0,0Z" fill="#f59e0b" opacity="0.85" />
    <path d="M-6,0 L-2,-4 L-2,4Z" fill="#f59e0b" opacity="0.7" />
  </g>
);

const ARROW_LEN = 440;

export default function HilsaMigrationDiagram() {
  return (
    <>
      <style>{`
        @keyframes swimUp {
          from { stroke-dashoffset: ${ARROW_LEN}; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes pulse-gold {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>

      <svg
        viewBox="0 0 592 280"
        className="w-full max-w-lg mx-auto my-6"
        role="img"
        aria-label="Hilsa migration: anadromous journey from Bay of Bengal upstream into the Brahmaputra to spawn"
      >
        {/* Water background */}
        <rect x="0" y="90" width="592" height="190" rx="6" fill="#0c4a6e" opacity="0.15" />

        {/* Bay of Bengal label */}
        <text x="55" y="210" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-500 dark:fill-blue-400">
          Bay of
        </text>
        <text x="55" y="222" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-500 dark:fill-blue-400">
          Bengal
        </text>

        {/* Spawning ground label */}
        <text x="530" y="90" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
          Spawning
        </text>
        <text x="530" y="102" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
          Grounds
        </text>

        {/* River channel */}
        <path d={riverPath} fill="none" stroke="#3b82f6" strokeWidth="36" opacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={riverPath} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Salinity gradient bar */}
        <defs>
          <linearGradient id="sal-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="40%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>
        </defs>
        <rect x="60" y="240" width="480" height="8" rx="4" fill="url(#sal-grad)" opacity="0.6" />
        <text x="60" y="260" fontSize="8" className="fill-gray-500 dark:fill-gray-400">Saltwater (35 ppt)</text>
        <text x="280" y="260" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">Brackish</text>
        <text x="540" y="260" textAnchor="end" fontSize="8" className="fill-gray-500 dark:fill-gray-400">Freshwater (0 ppt)</text>

        {/* Migration arrow */}
        <path
          d={riverPath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeDasharray={ARROW_LEN}
          strokeDashoffset="0"
          strokeLinecap="round"
          markerEnd="url(#arrow-gold)"
          style={{ animation: `swimUp 3s ease-out forwards` }}
          opacity="0.8"
        />
        <defs>
          <marker id="arrow-gold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Fish at different stages */}
        <g style={{ animation: 'pulse-gold 2s ease-in-out infinite' }}>
          <Fish x={80} y={172} />
          <Fish x={170} y={162} />
          <Fish x={270} y={155} />
          <Fish x={370} y={143} />
          <Fish x={470} y={125} />
        </g>

        {/* Stage labels */}
        <text x="80" y="145" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Ocean</text>
        <text x="80" y="153" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">feeding</text>

        <text x="200" y="138" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Estuary</text>
        <text x="200" y="146" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">adjustment</text>

        <text x="340" y="122" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Upstream</text>
        <text x="340" y="130" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">swim</text>

        <text x="480" y="100" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Spawn &</text>
        <text x="480" y="108" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">release eggs</text>

        {/* Title */}
        <text x="296" y="22" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
          Hilsa Anadromous Migration
        </text>
        <text x="296" y="38" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          Sea to river, hundreds of kilometres, burning fat as fuel
        </text>

        {/* Monsoon cue */}
        <text x="296" y="58" textAnchor="middle" fontSize="9" fontStyle="italic" className="fill-cyan-600 dark:fill-cyan-400">
          Triggered by monsoon floods raising river levels
        </text>
      </svg>
    </>
  );
}
