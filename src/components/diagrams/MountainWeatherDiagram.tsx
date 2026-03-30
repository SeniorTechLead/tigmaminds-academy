export default function MountainWeatherDiagram() {
  const bottom = 340;

  /* Mountain shape — side view */
  const mtnPoly = "40,340 120,280 200,180 260,100 300,80 340,110 380,170 440,260 500,320 560,340";

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 437"
        className="w-full"
        role="img"
        aria-label="Orographic lifting diagram showing wind hitting a mountain, forming clouds and rain on the windward side, and dry air descending on the leeward side"
      >
        <rect x="0" y="0" width="600" height="400" className="fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="24" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Orographic Lifting — Mountain Weather
        </text>

        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="30" width="600" height="310" fill="url(#skyGrad)" />

        {/* Mountain */}
        <defs>
          <linearGradient id="mtnWeatherGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#6b7280" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <polygon points={mtnPoly} fill="url(#mtnWeatherGrad)" />
        <polygon points={mtnPoly} fill="none" className="stroke-gray-400" strokeWidth="2" strokeLinejoin="round" />

        {/* Snow cap */}
        <polygon points="260,100 300,80 340,110 310,108 280,105" className="fill-white/40" />

        {/* WINDWARD SIDE — left */}
        {/* Wind arrows */}
        <defs>
          <marker id="windArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" className="fill-blue-400" />
          </marker>
          <marker id="upArr" markerWidth="6" markerHeight="8" refX="3" refY="0" orient="auto">
            <path d="M0,8 L3,0 L6,8" className="fill-blue-300" />
          </marker>
        </defs>

        {/* Horizontal wind arrows */}
        {[240, 270, 300].map((y, i) => (
          <line key={i} x1={10 + i * 10} y1={y} x2={80 + i * 5} y2={y} className="stroke-blue-400" strokeWidth="2" markerEnd="url(#windArr)" />
        ))}
        <text x="20" y="235" fontSize="9" className="fill-blue-300" fontWeight="700">
          Moist wind
        </text>

        {/* Rising air arrows (along windward slope) */}
        {[
          { x1: 130, y1: 270, x2: 155, y2: 230 },
          { x1: 170, y1: 220, x2: 195, y2: 170 },
          { x1: 210, y1: 165, x2: 235, y2: 120 },
        ].map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} className="stroke-blue-300" strokeWidth="1.5" markerEnd="url(#upArr)" />
        ))}
        <text x="135" y="195" fontSize="7" className="fill-blue-200" fontWeight="600" transform="rotate(-50,135,195)">
          Air forced up
        </text>

        {/* Clouds on windward side */}
        {[
          { cx: 180, cy: 105, rx: 30, ry: 14 },
          { cx: 210, cy: 90, rx: 35, ry: 16 },
          { cx: 245, cy: 80, rx: 28, ry: 12 },
          { cx: 160, cy: 120, rx: 25, ry: 10 },
        ].map((c, i) => (
          <ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} className="fill-gray-300/40" />
        ))}
        <text x="190" y="68" textAnchor="middle" fontSize="8" className="fill-gray-300" fontWeight="600">
          Clouds form
        </text>

        {/* Rain drops */}
        {[150, 170, 190, 210, 230, 160, 200, 180].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={120 + (i % 3) * 15}
            x2={x - 2}
            y2={132 + (i % 3) * 15}
            className="stroke-blue-400"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        <text x="155" y="175" fontSize="8" className="fill-blue-300" fontWeight="600">
          Rain / snow
        </text>

        {/* Windward label */}
        <rect x="55" y={bottom + 6} width="100" height="18" rx="3" className="fill-blue-900/40" />
        <text x="105" y={bottom + 19} textAnchor="middle" fontSize="9" className="fill-blue-300" fontWeight="700">
          Windward side
        </text>

        {/* LEEWARD SIDE — right */}
        {/* Descending dry air arrows */}
        <defs>
          <marker id="downArr" markerWidth="6" markerHeight="8" refX="3" refY="8" orient="auto">
            <path d="M0,0 L3,8 L6,0" className="fill-amber-400" />
          </marker>
        </defs>
        {[
          { x1: 370, y1: 130, x2: 400, y2: 190 },
          { x1: 410, y1: 180, x2: 440, y2: 240 },
          { x1: 450, y1: 240, x2: 470, y2: 280 },
        ].map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} className="stroke-amber-400" strokeWidth="1.5" markerEnd="url(#downArr)" />
        ))}
        <text x="435" y="170" fontSize="7" className="fill-amber-300" fontWeight="600" transform="rotate(50,435,170)">
          Dry air descends
        </text>

        {/* Clear sky — sun */}
        <circle cx="480" cy="70" r="18" className="fill-amber-400/30" />
        <circle cx="480" cy="70" r="10" className="fill-amber-300/60" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={480 + 14 * Math.cos(rad)}
              y1={70 + 14 * Math.sin(rad)}
              x2={480 + 22 * Math.cos(rad)}
              y2={70 + 22 * Math.sin(rad)}
              className="stroke-amber-300/50"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Leeward label */}
        <rect x="390" y={bottom + 6} width="140" height="18" rx="3" className="fill-amber-900/30" />
        <text x="460" y={bottom + 19} textAnchor="middle" fontSize="9" className="fill-amber-300" fontWeight="700">
          Leeward (rain shadow)
        </text>

        {/* Dry landscape hint */}
        <text x="470" y={bottom - 10} textAnchor="middle" fontSize="7" className="fill-amber-200/60">
          Dry, warm
        </text>

        {/* Insight bar */}
        <rect x="40" y="372" width="520" height="22" rx="4" className="fill-slate-800" />
        <text x="300" y="387" textAnchor="middle" fontSize="9" className="fill-gray-300" fontWeight="600">
          Mountains force air up → cooling → clouds + rain on one side, dry on the other
        </text>
      </svg>
    </div>
  );
}
