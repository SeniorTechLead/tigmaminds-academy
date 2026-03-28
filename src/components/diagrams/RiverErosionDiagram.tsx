export default function RiverErosionDiagram() {
  // River erosion stages: Young (V-shaped) → Mature (meanders) → Old (floodplain, oxbow)

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 600 250"
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label="River erosion diagram showing young, mature, and old river stages"
      >
        <defs>
          <style>{`
            @keyframes flow-dash {
              to { stroke-dashoffset: -20; }
            }
            .water-flow {
              stroke-dasharray: 6 4;
              animation: flow-dash 0.8s linear infinite;
            }
            .water-flow-slow {
              stroke-dasharray: 4 6;
              animation: flow-dash 1.4s linear infinite;
            }
          `}</style>

          {/* Earth fill gradient */}
          <linearGradient id="earth-young" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78716C" />
            <stop offset="100%" stopColor="#57534E" />
          </linearGradient>
          <linearGradient id="earth-mature" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A16207" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="earth-old" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#65A30D" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#A16207" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Water gradient */}
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="600" height="250" fill="#1E1B2E" rx="8" />

        {/* Title */}
        <text x="300" y="18" textAnchor="middle" fill="#D6D3D1" fontSize="12" fontWeight="700">
          River Valley Evolution
        </text>

        {/* Progression arrow */}
        <line x1="40" y1="35" x2="560" y2="35" stroke="#64748B" strokeWidth="1" markerEnd="url(#stage-arrow)" />
        <defs>
          <marker id="stage-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5 Z" fill="#64748B" />
          </marker>
        </defs>
        <text x="100" y="32" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="600">Young</text>
        <text x="300" y="32" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="600">Mature</text>
        <text x="500" y="32" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="600">Old</text>

        {/* Separators */}
        <line x1="200" y1="40" x2="200" y2="210" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="400" y1="40" x2="400" y2="210" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* ===== YOUNG RIVER (V-shaped valley) ===== */}
        <g>
          {/* Left valley wall */}
          <polygon
            points="10,60 100,190 10,190"
            fill="url(#earth-young)"
          />
          {/* Right valley wall */}
          <polygon
            points="190,60 100,190 190,190"
            fill="url(#earth-young)"
          />
          {/* Rocky texture lines */}
          <line x1="30" y1="100" x2="60" y2="130" stroke="#44403C" strokeWidth="0.5" opacity="0.6" />
          <line x1="50" y1="80" x2="75" y2="120" stroke="#44403C" strokeWidth="0.5" opacity="0.6" />
          <line x1="140" y1="100" x2="125" y2="130" stroke="#44403C" strokeWidth="0.5" opacity="0.6" />
          <line x1="160" y1="80" x2="135" y2="120" stroke="#44403C" strokeWidth="0.5" opacity="0.6" />

          {/* Narrow V-shaped water channel */}
          <polygon
            points="90,160 100,190 110,160"
            fill="url(#water)"
            opacity="0.9"
          />

          {/* Fast water flow lines */}
          <line x1="100" y1="162" x2="100" y2="185" stroke="#7DD3FC" strokeWidth="1.5" className="water-flow" />
          <line x1="96" y1="165" x2="96" y2="183" stroke="#7DD3FC" strokeWidth="0.8" className="water-flow" />
          <line x1="104" y1="165" x2="104" y2="183" stroke="#7DD3FC" strokeWidth="0.8" className="water-flow" />

          {/* Vertical erosion arrow */}
          <line x1="100" y1="195" x2="100" y2="208" stroke="#EF4444" strokeWidth="1.5" markerEnd="url(#erosion-down)" />
          <defs>
            <marker id="erosion-down" markerWidth="5" markerHeight="5" refX="2.5" refY="4" orient="auto">
              <path d="M0,0 L2.5,5 L5,0 Z" fill="#EF4444" />
            </marker>
          </defs>

          {/* Label */}
          <text x="100" y="220" textAnchor="middle" fill="#FCA5A5" fontSize="9" fontWeight="600">
            Erosion ↓
          </text>
          <text x="100" y="232" textAnchor="middle" fill="#78716C" fontSize="7">
            V-shaped valley
          </text>
          <text x="100" y="242" textAnchor="middle" fill="#78716C" fontSize="7">
            Fast, steep flow
          </text>
        </g>

        {/* ===== MATURE RIVER (wider valley, meanders) ===== */}
        <g>
          {/* Wider valley walls — gentler slopes */}
          <polygon
            points="210,80 260,190 210,190"
            fill="url(#earth-mature)"
          />
          <polygon
            points="390,80 340,190 390,190"
            fill="url(#earth-mature)"
          />

          {/* Valley floor */}
          <rect x="260" y="155" width="80" height="35" fill="#92400E" opacity="0.5" />

          {/* Meandering river path */}
          <path
            d="M280,155 Q270,165 280,175 Q295,188 310,175 Q325,162 320,155"
            fill="url(#water)"
            opacity="0.85"
          />

          {/* Flow lines following meander */}
          <path
            d="M282,158 Q272,168 282,178 Q296,190 312,178 Q322,165 318,158"
            fill="none"
            stroke="#7DD3FC"
            strokeWidth="1"
            className="water-flow-slow"
          />
          <path
            d="M286,160 Q278,168 286,176 Q296,185 308,176 Q316,167 314,160"
            fill="none"
            stroke="#7DD3FC"
            strokeWidth="0.8"
            className="water-flow-slow"
          />

          {/* Lateral erosion arrows */}
          <line x1="258" y1="172" x2="248" y2="172" stroke="#F97316" strokeWidth="1.2" markerEnd="url(#erosion-left)" />
          <line x1="342" y1="172" x2="352" y2="172" stroke="#F97316" strokeWidth="1.2" markerEnd="url(#erosion-right)" />
          <defs>
            <marker id="erosion-left" markerWidth="5" markerHeight="5" refX="0" refY="2.5" orient="auto">
              <path d="M5,0 L0,2.5 L5,5 Z" fill="#F97316" />
            </marker>
            <marker id="erosion-right" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="#F97316" />
            </marker>
          </defs>

          {/* Soil layers on slopes */}
          <line x1="220" y1="120" x2="250" y2="160" stroke="#78350F" strokeWidth="0.5" opacity="0.4" />
          <line x1="380" y1="120" x2="350" y2="160" stroke="#78350F" strokeWidth="0.5" opacity="0.4" />

          {/* Label */}
          <text x="300" y="220" textAnchor="middle" fill="#FDBA74" fontSize="9" fontWeight="600">
            Erosion ←→
          </text>
          <text x="300" y="232" textAnchor="middle" fill="#92400E" fontSize="7">
            Wider valley
          </text>
          <text x="300" y="242" textAnchor="middle" fill="#92400E" fontSize="7">
            Meanders form
          </text>
        </g>

        {/* ===== OLD RIVER (flat floodplain, oxbow lake) ===== */}
        <g>
          {/* Very gentle / flat land — almost no valley walls */}
          <polygon
            points="410,140 420,190 410,190"
            fill="url(#earth-old)"
            opacity="0.5"
          />
          <polygon
            points="590,140 580,190 590,190"
            fill="url(#earth-old)"
            opacity="0.5"
          />

          {/* Wide flat floodplain */}
          <rect x="420" y="155" width="160" height="35" rx="2" fill="#65A30D" opacity="0.15" />
          <rect x="420" y="165" width="160" height="25" rx="2" fill="#92400E" opacity="0.35" />

          {/* Deposition sediment layers */}
          <rect x="430" y="175" width="140" height="3" fill="#D97706" opacity="0.3" rx="1" />
          <rect x="435" y="180" width="130" height="2" fill="#B45309" opacity="0.25" rx="1" />

          {/* Wide, slow, meandering river */}
          <path
            d="M440,160 Q430,170 450,178 Q475,188 490,175 Q505,162 520,170 Q540,182 555,175 Q565,168 560,160"
            fill="url(#water)"
            opacity="0.75"
            strokeWidth="0"
          />

          {/* Slow flow lines */}
          <path
            d="M445,165 Q438,172 452,178 Q474,186 488,176 Q503,165 518,172 Q536,180 550,174"
            fill="none"
            stroke="#7DD3FC"
            strokeWidth="0.8"
            className="water-flow-slow"
          />

          {/* Oxbow lake (cut-off meander) */}
          <ellipse cx="475" cy="152" rx="16" ry="8" fill="#0284C7" opacity="0.6" />
          <ellipse cx="475" cy="152" rx="12" ry="5" fill="#38BDF8" opacity="0.4" />
          <text x="475" y="143" textAnchor="middle" fill="#7DD3FC" fontSize="6" opacity="0.8">
            oxbow lake
          </text>

          {/* Deposition symbol (downward settled dots) */}
          <circle cx="460" cy="188" r="1.5" fill="#D97706" opacity="0.6" />
          <circle cx="470" cy="186" r="1.2" fill="#D97706" opacity="0.5" />
          <circle cx="510" cy="187" r="1.5" fill="#D97706" opacity="0.6" />
          <circle cx="530" cy="185" r="1.2" fill="#D97706" opacity="0.5" />
          <circle cx="490" cy="189" r="1" fill="#D97706" opacity="0.4" />

          {/* Label */}
          <text x="500" y="220" textAnchor="middle" fill="#BEF264" fontSize="9" fontWeight="600">
            Deposition
          </text>
          <text x="500" y="232" textAnchor="middle" fill="#4D7C0F" fontSize="7">
            Flat floodplain
          </text>
          <text x="500" y="242" textAnchor="middle" fill="#4D7C0F" fontSize="7">
            Oxbow lakes form
          </text>
        </g>

        {/* Stage progression labels */}
        <text x="155" y="47" textAnchor="middle" fill="#64748B" fontSize="8">→</text>
        <text x="350" y="47" textAnchor="middle" fill="#64748B" fontSize="8">→</text>
      </svg>
    </div>
  );
}
