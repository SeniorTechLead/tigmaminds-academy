export default function MapGISDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 535 375"
        className="w-full"
        role="img"
        aria-label="GIS layers stacked: terrain on bottom, roads in middle, buildings on top, all aligned by coordinates"
      >
        <rect width="500" height="340" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          GIS: Stacking Data Layers
        </text>

        {/* We'll draw 3 stacked parallelogram layers in pseudo-3D */}
        {/* Layer 1 (bottom): Terrain/Elevation */}
        <g>
          <polygon
            points="80,260 280,260 320,210 120,210"
            fill="#166534"
            stroke="#4ade80"
            strokeWidth="1"
          />
          {/* Terrain features — hills */}
          <path d="M130,240 Q150,220 170,240" fill="#15803d" stroke="#22c55e" strokeWidth="0.8" />
          <path d="M200,235 Q230,215 260,235" fill="#14532d" stroke="#22c55e" strokeWidth="0.8" />
          {/* River */}
          <path d="M140,250 Q180,230 220,245 Q260,255 290,235" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          {/* Label */}
          <text x="55" y="240" textAnchor="end" fontSize="10" fontWeight="600" fill="#4ade80" fontFamily="sans-serif">
            Terrain &amp;
          </text>
          <text x="55" y="252" textAnchor="end" fontSize="10" fontWeight="600" fill="#4ade80" fontFamily="sans-serif">
            Elevation
          </text>
        </g>

        {/* Layer 2 (middle): Roads */}
        <g>
          <polygon
            points="80,200 280,200 320,150 120,150"
            className="fill-gray-100 dark:fill-slate-800"
            stroke="#f59e0b"
            strokeWidth="1"
            opacity="0.85"
          />
          {/* Roads */}
          <line x1="130" y1="190" x2="270" y2="160" stroke="#f59e0b" strokeWidth="2" />
          <line x1="160" y1="195" x2="240" y2="155" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="180" y1="165" x2="250" y2="185" stroke="#d97706" strokeWidth="1" />
          {/* Intersection dots */}
          <circle cx="200" cy="178" r="2.5" fill="#fbbf24" />
          <circle cx="230" cy="170" r="2.5" fill="#fbbf24" />
          {/* Label */}
          <text x="55" y="180" textAnchor="end" fontSize="10" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
            Roads
          </text>
        </g>

        {/* Layer 3 (top): Buildings */}
        <g>
          <polygon
            points="80,140 280,140 320,90 120,90"
            className="fill-gray-100 dark:fill-slate-800"
            stroke="#a78bfa"
            strokeWidth="1"
            opacity="0.85"
          />
          {/* Buildings as small rectangles */}
          {[
            { x: 140, y: 110, w: 12, h: 10 },
            { x: 170, y: 105, w: 15, h: 12 },
            { x: 210, y: 100, w: 10, h: 10 },
            { x: 240, y: 95, w: 18, h: 14 },
            { x: 190, y: 120, w: 8, h: 8 },
            { x: 260, y: 110, w: 10, h: 10 },
          ].map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="#7c3aed" stroke="#a78bfa" strokeWidth="0.5" rx="1" />
          ))}
          {/* Label */}
          <text x="55" y="120" textAnchor="end" fontSize="10" fontWeight="600" fill="#a78bfa" fontFamily="sans-serif">
            Buildings
          </text>
        </g>

        {/* Vertical alignment lines (showing coordinates line up) */}
        {[170, 230].map((x) => (
          <line
            key={x}
            x1={x}
            y1={95}
            x2={x}
            y2={255}
            stroke="#64748b"
            strokeWidth="0.5"
            strokeDasharray="2 3"
            opacity="0.5"
          />
        ))}

        {/* Right side: explanation */}
        <g>
          <text x="380" y="100" textAnchor="middle" fontSize="10" fill="#a78bfa" fontFamily="sans-serif">
            Layer 3: Buildings
          </text>
          <text x="380" y="160" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="sans-serif">
            Layer 2: Roads
          </text>
          <text x="380" y="220" textAnchor="middle" fontSize="10" fill="#4ade80" fontFamily="sans-serif">
            Layer 1: Terrain
          </text>

          {/* Stacking arrow */}
          <line x1="380" y1="230" x2="380" y2="110" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrowGIS)" />
          <text x="405" y="170" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" transform="rotate(-90, 405, 170)">
            stacked by coordinates
          </text>
        </g>

        <defs>
          <marker id="arrowGIS" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" className="fill-gray-500 dark:fill-slate-400" />
          </marker>
        </defs>

        {/* Key insight */}
        <rect x="60" y="275" width="380" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
        <text x="250" y="294" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          GIS: stack different data layers on the same map.
        </text>

        <text x="250" y="325" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          Each layer has the same coordinate system, so they line up perfectly.
        </text>
      </svg>
    </div>
  );
}
