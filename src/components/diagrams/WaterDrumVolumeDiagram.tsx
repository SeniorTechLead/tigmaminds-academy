/**
 * A cylindrical water drum (radius 0.5 m, height 1.2 m). Tara stands beside
 * it; volume formula and number of litres shown to the side. Visualises
 * 3D volume calculation as a real, fillable thing.
 *
 * Used in the 3D Volume section.
 */
import Tara from './people/Tara';

export default function WaterDrumVolumeDiagram() {
  const W = 720, H = 380;
  const groundY = 320;

  // Drum geometry
  const drumCx = 360, drumBaseY = groundY - 10;
  const drumRadius = 75; // visible width = 2 × radius
  const drumHeight = 200; // visible height
  const drumTopY = drumBaseY - drumHeight;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A cylindrical water drum: volume = pi r squared h">

        <defs>
          <linearGradient id="sky-wd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-wd)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />

        {/* Ground */}
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          How much water does it hold?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Cylinder volume = π r² h.
        </text>

        {/* Tara on left */}
        <Tara x={140} y={groundY} scale={1.0} pose="pointing" />

        {/* Drum body — front face */}
        {/* Front rectangle */}
        <rect x={drumCx - drumRadius} y={drumTopY + 10} width={drumRadius * 2} height={drumHeight - 10}
          fill="#0ea5e9" stroke="#0c4a6e" strokeWidth="2" />
        {/* Top ellipse — viewed from slightly above */}
        <ellipse cx={drumCx} cy={drumTopY + 10} rx={drumRadius} ry="14"
          fill="#38bdf8" stroke="#0c4a6e" strokeWidth="2" />
        {/* Inner top ellipse — water surface */}
        <ellipse cx={drumCx} cy={drumTopY + 10} rx={drumRadius - 4} ry="10"
          fill="#0c4a6e" stroke="#075985" strokeWidth="1" />
        {/* Bottom ellipse hint */}
        <ellipse cx={drumCx} cy={drumBaseY} rx={drumRadius} ry="10"
          fill="none" stroke="#0c4a6e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

        {/* Highlights/specular */}
        <rect x={drumCx - drumRadius + 10} y={drumTopY + 16} width="6" height={drumHeight - 24} fill="#7dd3fc" opacity="0.4" />

        {/* Water-level lines (gradations) */}
        {[0.25, 0.5, 0.75].map((t, i) => {
          const y = drumTopY + 10 + (drumHeight - 10) * (1 - t);
          return (
            <g key={i}>
              <line x1={drumCx - drumRadius - 10} y1={y} x2={drumCx - drumRadius - 4} y2={y} stroke="#475569" strokeWidth="1.2" />
              <text x={drumCx - drumRadius - 14} y={y + 4} textAnchor="end" fontSize="10" fill="#475569" className="dark:fill-gray-400">{Math.round(t * 942)}L</text>
            </g>
          );
        })}

        {/* Diameter label (on top ellipse) */}
        <line x1={drumCx - drumRadius} y1={drumTopY - 18} x2={drumCx + drumRadius} y2={drumTopY - 18}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#arR-wd)" markerStart="url(#arL-wd)" />
        <defs>
          <marker id="arR-wd" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
          <marker id="arL-wd" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#475569" />
          </marker>
        </defs>
        <rect x={drumCx - 40} y={drumTopY - 36} width="80" height="20" rx="10"
          fill="#cffafe" stroke="#06b6d4" strokeWidth="1" className="dark:fill-cyan-900/40 dark:stroke-cyan-400" />
        <text x={drumCx} y={drumTopY - 22} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0e7490" className="dark:fill-cyan-200">
          d = 1 m
        </text>

        {/* Height label — placed at the LEFT of the drum, away from the volume panel */}
        <rect x={drumCx - drumRadius - 130} y={(drumBaseY + drumTopY) / 2 - 11} width="68" height="22" rx="11"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={drumCx - drumRadius - 96} y={(drumBaseY + drumTopY) / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          h = 1.2 m
        </text>
        {/* Re-draw the height arrow on the LEFT side of the drum so the label has context */}
        <line x1={drumCx - drumRadius - 50} y1={drumBaseY} x2={drumCx - drumRadius - 50} y2={drumTopY + 10}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#arU2-wd)" markerStart="url(#arD2-wd)" />
        <defs>
          <marker id="arU2-wd" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#475569" />
          </marker>
          <marker id="arD2-wd" markerWidth="6" markerHeight="8" refX="3" refY="7" orient="auto">
            <polygon points="0 0, 3 8, 6 0" fill="#475569" />
          </marker>
        </defs>

        {/* Volume calculation panel — bottom right */}
        <rect x="500" y="80" width="200" height="180" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="1.5" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="600" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Volume = π r² h
        </text>
        <line x1="514" y1="116" x2="686" y2="116" stroke="#cbd5e1" strokeWidth="0.8" />
        <text x="514" y="138" fontSize="11" fill="#475569" className="dark:fill-gray-300">r = 0.5 m</text>
        <text x="514" y="158" fontSize="11" fill="#475569" className="dark:fill-gray-300">h = 1.2 m</text>
        <text x="514" y="184" fontSize="11" fill="#1e293b" className="dark:fill-gray-100">V = π × 0.25 × 1.2</text>
        <text x="514" y="204" fontSize="11" fill="#1e293b" className="dark:fill-gray-100">  ≈ 0.942 m³</text>
        <line x1="514" y1="214" x2="686" y2="214" stroke="#cbd5e1" strokeWidth="0.8" />
        <text x="600" y="240" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0c4a6e" className="dark:fill-blue-300">
          ≈ 942 litres
        </text>

        {/* Footer */}
        <rect x={W / 2 - 220} y={H - 30} width="440" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          1 m³ = 1,000 litres. The drum can fill nearly a thousand 1-litre bottles.
        </text>
      </svg>
    </div>
  );
}
