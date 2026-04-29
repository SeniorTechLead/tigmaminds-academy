export default function MapWebGISDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 525 395"
        className="w-full"
        role="img"
        aria-label="Web mapping stack: tile server sends pre-rendered tiles to the browser, organized by zoom level, x, and y coordinates"
      >
        <rect width="500" height="350" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          How Web Maps Work
        </text>

        {/* Top: Tile Server */}
        <rect x="150" y="45" width="200" height="50" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#a78bfa" strokeWidth="1.2" />
        <text x="250" y="65" textAnchor="middle" fontSize="11" fontWeight="700" fill="#a78bfa" fontFamily="sans-serif">
          Tile Server
        </text>
        <text x="250" y="80" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Stores millions of pre-rendered images
        </text>

        {/* Arrow down */}
        <line x1="250" y1="95" x2="250" y2="120" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowWeb)" />
        <text x="280" y="112" fontSize="8" fill="#f59e0b" fontFamily="sans-serif">HTTPS request</text>

        {/* Middle: Tile Grid */}
        <rect x="55" y="125" width="390" height="115" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.8" />
        <text x="250" y="142" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
          Map Tiles — z/x/y addressing
        </text>

        {/* Zoom level examples */}
        {/* Zoom 0: whole world = 1 tile */}
        <g>
          <text x="80" y="162" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">z=0</text>
          <rect x="65" y="165" width="30" height="30" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
          <ellipse cx="80" cy="180" rx="10" ry="8" fill="#166534" opacity="0.6" />
          <text x="80" y="207" textAnchor="middle" fontSize="7" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">1 tile</text>
        </g>

        {/* Zoom 2: 4x4 = 16 tiles */}
        <g>
          <text x="170" y="162" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">z=2</text>
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`z2-${r}-${c}`}
                x={140 + c * 15}
                y={165 + r * 10}
                width="15"
                height="10"
                fill={r === 1 && c === 2 ? "#166534" : "#1e3a5f"}
                stroke="#3b82f6"
                strokeWidth="0.3"
              />
            ))
          )}
          <text x="170" y="215" textAnchor="middle" fontSize="7" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">16 tiles</text>
        </g>

        {/* Zoom 5: many tiles, show a 6x4 sample */}
        <g>
          <text x="280" y="162" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">z=5</text>
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3, 4, 5].map((c) => (
              <rect
                key={`z5-${r}-${c}`}
                x={250 + c * 10}
                y={165 + r * 10}
                width="10"
                height="10"
                fill={(r + c) % 3 === 0 ? "#166534" : "#1e3a5f"}
                stroke="#3b82f6"
                strokeWidth="0.2"
              />
            ))
          )}
          <text x="280" y="215" textAnchor="middle" fontSize="7" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">1024 tiles</text>
        </g>

        {/* Zoom 18 note */}
        <g>
          <text x="385" y="162" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">z=18</text>
          <rect x="360" y="165" width="50" height="40" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.5" />
          {/* Detailed features at max zoom */}
          <line x1="365" y1="180" x2="405" y2="175" stroke="#f59e0b" strokeWidth="1" />
          <rect x="375" y="170" width="5" height="4" fill="#92400e" />
          <rect x="390" y="180" width="4" height="3" fill="#92400e" />
          <text x="385" y="215" textAnchor="middle" fontSize="7" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">68 billion!</text>
        </g>

        {/* Tile address example */}
        <rect x="110" y="220" width="280" height="16" rx="3" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
        <text x="250" y="231" textAnchor="middle" fontSize="8" fill="#fcd34d" fontFamily="monospace">
          https://tile.server.com/z/x/y.png → /14/12456/7203.png
        </text>

        {/* Arrow down to browser */}
        <line x1="250" y1="240" x2="250" y2="258" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowWeb)" />

        {/* Bottom: Browser */}
        <rect x="100" y="262" width="300" height="55" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="1.2" />

        {/* Browser chrome */}
        <rect x="100" y="262" width="300" height="14" rx="6" fill="#334155" />
        <circle cx="112" cy="269" r="3" fill="#ef4444" />
        <circle cx="122" cy="269" r="3" fill="#f59e0b" />
        <circle cx="132" cy="269" r="3" fill="#22c55e" />
        <rect x="145" y="265" width="160" height="8" rx="2" className="fill-gray-100 dark:fill-slate-800" />
        <text x="225" y="272" textAnchor="middle" fontSize="6" className="fill-gray-500 dark:fill-slate-400" fontFamily="monospace">maps.example.com</text>

        {/* Map content in browser */}
        <rect x="105" y="280" width="290" height="32" fill="#1e3a5f" />
        {/* Stitched tiles */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <rect
            key={i}
            x={105 + i * 29}
            y={280}
            width="29"
            height="32"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.2"
            opacity="0.4"
          />
        ))}
        <path d="M110,300 Q180,290 250,295 Q320,300 390,293" fill="none" stroke="#4ade80" strokeWidth="1" />
        <circle cx="250" cy="296" r="3" fill="#ef4444" />
        <text x="260" y="293" fontSize="6" fill="#fbbf24" fontFamily="sans-serif">You</text>

        <text x="250" y="330" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          How Google Maps works: millions of pre-rendered tiles stitched in your browser.
        </text>
        <text x="250" y="345" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          Zoom in = higher z = more tiles = more detail.
        </text>

        <defs>
          <marker id="arrowWeb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
