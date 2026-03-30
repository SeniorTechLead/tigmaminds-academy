export default function MapTopoProfileDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 575 360"
        className="w-full"
        role="img"
        aria-label="Topographic profile: a line across a map with elevation plotted below showing mountains, valleys, and a river"
      >
        <rect width="500" height="330" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Topographic Profile
        </text>

        {/* Top section: map view with contour lines */}
        <rect x="40" y="40" width="420" height="100" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.8" />
        <text x="250" y="55" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">Map View (from above)</text>

        {/* Contour rings for mountain 1 */}
        <ellipse cx="130" cy="95" rx="40" ry="25" fill="none" stroke="#a16207" strokeWidth="0.8" />
        <ellipse cx="130" cy="95" rx="28" ry="17" fill="none" stroke="#a16207" strokeWidth="0.8" />
        <ellipse cx="130" cy="95" rx="16" ry="10" fill="none" stroke="#a16207" strokeWidth="0.8" />
        <text x="130" y="98" textAnchor="middle" fontSize="7" fill="#fbbf24" fontFamily="sans-serif">Mt. A</text>

        {/* River */}
        <path d="M210,60 Q230,80 240,100 Q250,120 260,135" fill="none" stroke="#3b82f6" strokeWidth="1.5" />

        {/* Contour rings for mountain 2 */}
        <ellipse cx="340" cy="90" rx="50" ry="30" fill="none" stroke="#a16207" strokeWidth="0.8" />
        <ellipse cx="340" cy="90" rx="35" ry="20" fill="none" stroke="#a16207" strokeWidth="0.8" />
        <ellipse cx="340" cy="90" rx="20" ry="12" fill="none" stroke="#a16207" strokeWidth="0.8" />
        <ellipse cx="340" cy="90" rx="10" ry="6" fill="none" stroke="#a16207" strokeWidth="0.8" />
        <text x="340" y="93" textAnchor="middle" fontSize="7" fill="#fbbf24" fontFamily="sans-serif">Mt. B</text>

        {/* Profile line A--B across the map */}
        <line x1="55" y1="95" x2="445" y2="90" stroke="#ef4444" strokeWidth="2" />
        <circle cx="55" cy="95" r="4" fill="#ef4444" />
        <circle cx="445" cy="90" r="4" fill="#ef4444" />
        <text x="55" y="85" textAnchor="middle" fontSize="9" fontWeight="600" fill="#ef4444" fontFamily="sans-serif">A</text>
        <text x="445" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill="#ef4444" fontFamily="sans-serif">B</text>

        {/* Arrow connecting to profile */}
        <line x1="250" y1="143" x2="250" y2="155" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowTopo)" />
        <defs>
          <marker id="arrowTopo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Bottom section: elevation profile */}
        <rect x="40" y="160" width="420" height="130" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.8" />
        <text x="250" y="175" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">Elevation Profile (side view)</text>

        {/* Y-axis */}
        <line x1="60" y1="185" x2="60" y2="275" stroke="#64748b" strokeWidth="0.8" />
        {[0, 500, 1000, 1500].map((elev, i) => {
          const y = 275 - i * 22;
          return (
            <g key={elev}>
              <line x1="55" y1={y} x2="60" y2={y} stroke="#64748b" strokeWidth="0.5" />
              <text x="52" y={y + 3} textAnchor="end" fontSize="7" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">{elev}m</text>
            </g>
          );
        })}
        <text x="30" y="230" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" transform="rotate(-90,30,230)">
          Elevation
        </text>

        {/* X-axis */}
        <line x1="60" y1="275" x2="445" y2="275" stroke="#64748b" strokeWidth="0.8" />
        <text x="252" y="288" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">Distance along line A → B</text>

        {/* Elevation profile curve */}
        <path
          d="M60,270 Q90,268 110,250 Q130,210 145,195 Q160,215 180,255 Q200,268 230,270 Q245,270 250,265 Q260,270 290,260 Q320,230 340,200 Q355,188 365,195 Q380,215 400,250 Q430,268 445,270"
          fill="none"
          stroke="#4ade80"
          strokeWidth="2"
        />
        {/* Filled area under the profile */}
        <path
          d="M60,270 Q90,268 110,250 Q130,210 145,195 Q160,215 180,255 Q200,268 230,270 Q245,270 250,265 Q260,270 290,260 Q320,230 340,200 Q355,188 365,195 Q380,215 400,250 Q430,268 445,270 L445,275 L60,275Z"
          fill="#166534"
          opacity="0.4"
        />

        {/* Mountain peak labels */}
        <text x="145" y="190" textAnchor="middle" fontSize="8" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">Mt. A</text>
        <text x="355" y="183" textAnchor="middle" fontSize="8" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">Mt. B</text>

        {/* River crossing */}
        <line x1="250" y1="262" x2="250" y2="275" stroke="#3b82f6" strokeWidth="2" />
        <text x="250" y="258" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="sans-serif">River</text>

        {/* Valley label */}
        <text x="190" y="265" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">valley</text>

        {/* Bottom caption */}
        <text x="250" y="310" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Slice through the map to see elevation changes along any line.
        </text>
      </svg>
    </div>
  );
}
