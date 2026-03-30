export default function GlacierDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 437"
        className="w-full"
        role="img"
        aria-label="Glacier anatomy showing accumulation zone where snow falls, equilibrium line, and ablation zone where ice melts, with moraines labeled"
      >
        <rect x="0" y="0" width="600" height="400" className="fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Anatomy of a Glacier
        </text>

        {/* Mountain / bedrock */}
        <polygon
          points="20,360 80,240 150,140 220,80 280,60 330,90 370,140 430,220 500,300 580,360"
          className="fill-gray-700/50"
        />
        <polygon
          points="20,360 80,240 150,140 220,80 280,60 330,90 370,140 430,220 500,300 580,360"
          fill="none"
          className="stroke-gray-500"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Glacier body — sitting on the slope */}
        <defs>
          <linearGradient id="glacierGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#93c5fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M180,110 Q220,88 270,78 Q310,85 340,110 Q380,155 420,220 Q440,260 460,300 Q465,320 450,330 Q430,340 400,335 Q360,320 330,280 Q290,220 260,170 Q230,130 180,110 Z"
          fill="url(#glacierGrad)"
        />
        <path
          d="M180,110 Q220,88 270,78 Q310,85 340,110 Q380,155 420,220 Q440,260 460,300 Q465,320 450,330 Q430,340 400,335 Q360,320 330,280 Q290,220 260,170 Q230,130 180,110 Z"
          fill="none"
          className="stroke-blue-300"
          strokeWidth="1.5"
        />

        {/* Crevasses */}
        {[
          "M240,120 Q245,130 238,140",
          "M280,140 Q285,155 278,165",
          "M320,180 Q326,195 318,205",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" className="stroke-blue-600/50" strokeWidth="1" />
        ))}

        {/* ACCUMULATION ZONE label */}
        <rect x="140" y="95" width="120" height="18" rx="3" className="fill-white/15" />
        <text x="200" y="108" textAnchor="middle" fontSize="9" className="fill-white" fontWeight="700">
          Accumulation zone
        </text>

        {/* Snow falling */}
        {[195, 210, 225, 240, 260, 280, 215, 250].map((x, i) => (
          <g key={`snow-${i}`}>
            <circle cx={x} cy={50 + (i * 13) % 35} r="1.5" className="fill-white/50" />
          </g>
        ))}
        <text x="230" y="48" fontSize="7" className="fill-white/60">
          Snow falls here
        </text>

        {/* Equilibrium line */}
        <line x1="240" y1="190" x2="400" y2="250" className="stroke-amber-400" strokeWidth="2" strokeDasharray="6 4" />
        <rect x="300" y="200" width="115" height="18" rx="3" className="fill-amber-900/60" />
        <text x="357" y="213" textAnchor="middle" fontSize="9" className="fill-amber-300" fontWeight="800">
          Equilibrium line
        </text>
        <text x="357" y="226" textAnchor="middle" fontSize="7" className="fill-gray-400">
          gain = loss here
        </text>

        {/* ABLATION ZONE label */}
        <rect x="380" y="268" width="100" height="18" rx="3" className="fill-blue-900/40" />
        <text x="430" y="281" textAnchor="middle" fontSize="9" className="fill-blue-300" fontWeight="700">
          Ablation zone
        </text>
        <text x="430" y="294" textAnchor="middle" fontSize="7" className="fill-gray-400">
          Ice melts here
        </text>

        {/* Ice flow arrows */}
        <defs>
          <marker id="iceFlowArr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <path d="M0,0 L7,2.5 L0,5" className="fill-blue-200" />
          </marker>
        </defs>
        {[
          { x1: 230, y1: 140, x2: 270, y2: 170 },
          { x1: 290, y1: 190, x2: 330, y2: 230 },
          { x1: 350, y1: 250, x2: 390, y2: 290 },
        ].map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} className="stroke-blue-200" strokeWidth="1.5" markerEnd="url(#iceFlowArr)" />
        ))}
        <text x="365" y="245" fontSize="7" className="fill-blue-200" transform="rotate(40,365,245)">
          Ice flows downhill
        </text>

        {/* Meltwater stream */}
        <path d="M455,325 Q465,340 475,345 Q485,342 490,350 Q500,358 515,360" fill="none" className="stroke-blue-400" strokeWidth="2" strokeLinecap="round" />
        <text x="495" y="355" fontSize="7" className="fill-blue-300">
          Meltwater
        </text>

        {/* Moraines */}
        {/* Lateral moraine — rocky edges */}
        {[
          { x: 175, y: 115 },
          { x: 168, y: 130 },
          { x: 162, y: 148 },
          { x: 440, y: 270 },
          { x: 450, y: 285 },
          { x: 455, y: 302 },
        ].map((r, i) => (
          <circle key={`lat-${i}`} cx={r.x} cy={r.y} r="3" className="fill-gray-500/60 stroke-gray-400" strokeWidth="0.5" />
        ))}

        {/* Terminal moraine */}
        {[435, 445, 455, 450, 440].map((x, i) => (
          <circle key={`term-${i}`} cx={x} cy={332 + (i % 2) * 4} r="3.5" className="fill-gray-500/60 stroke-gray-400" strokeWidth="0.5" />
        ))}
        <text x="432" y="350" fontSize="7" className="fill-gray-300" fontWeight="600">
          Terminal moraine
        </text>

        <text x="130" y="150" fontSize="7" className="fill-gray-300" fontWeight="600">
          Lateral moraine
        </text>

        {/* Bedrock label */}
        <text x="80" y="350" fontSize="8" className="fill-gray-500" fontWeight="600">
          Bedrock
        </text>

        {/* Insight */}
        <rect x="40" y="372" width="520" height="22" rx="4" className="fill-slate-800" />
        <text x="300" y="387" textAnchor="middle" fontSize="9" className="fill-gray-300" fontWeight="600">
          Glaciers are rivers of ice — snow piles up at the top, melts at the bottom
        </text>
      </svg>
    </div>
  );
}
