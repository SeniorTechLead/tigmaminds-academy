export default function MajuliProtectionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 580 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram showing four erosion protection methods: bamboo porcupines, vetiver grass, geotextile bags, and gabion walls">
        <rect width="580" height="420" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="290" y="26" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Protecting Majuli: Engineering vs Nature</text>

        {/* Grid of 4 methods */}

        {/* 1. Bamboo Porcupines (top-left) */}
        <rect x="15" y="42" width="270" height="170" rx="8" className="fill-slate-800" />
        <text x="150" y="62" textAnchor="middle" className="fill-emerald-400" fontSize="12" fontWeight="bold">Bamboo Porcupines</text>

        {/* Water */}
        <rect x="25" y="120" width="250" height="50" rx="4" className="fill-blue-900" opacity="0.4" />

        {/* Porcupine structures */}
        {[70, 140, 210].map((cx, i) => (
          <g key={`porc-${i}`}>
            {/* Cross-braced bamboo */}
            <line x1={cx - 15} y1={125} x2={cx + 15} y2={155} className="stroke-amber-600" strokeWidth="2.5" />
            <line x1={cx + 15} y1={125} x2={cx - 15} y2={155} className="stroke-amber-600" strokeWidth="2.5" />
            <line x1={cx} y1={120} x2={cx} y2={160} className="stroke-amber-600" strokeWidth="2.5" />
            <circle cx={cx} cy={140} r="3" className="fill-amber-500" />
          </g>
        ))}

        {/* Sediment collecting */}
        {[55, 80, 125, 155, 195, 225].map((x, i) => (
          <circle key={`sed-${i}`} cx={x} cy={158 + (i % 2) * 4} r="2" className="fill-amber-500" opacity="0.6">
            <animate attributeName="cy" values={`${150 + i * 2};${158 + (i % 2) * 4}`} dur="3s" repeatCount="indefinite" />
          </circle>
        ))}

        <text x="150" y="182" textAnchor="middle" className="fill-slate-300" fontSize="10">Slows water \u2192 traps sediment \u2192 rebuilds bank</text>
        <text x="150" y="197" textAnchor="middle" className="fill-emerald-500" fontSize="10" fontWeight="bold">Cost: Low | Lifespan: 5\u201310 years</text>

        {/* 2. Vetiver Grass (top-right) */}
        <rect x="295" y="42" width="270" height="170" rx="8" className="fill-slate-800" />
        <text x="430" y="62" textAnchor="middle" className="fill-emerald-400" fontSize="12" fontWeight="bold">Vetiver Grass Barriers</text>

        {/* Riverbank cross-section */}
        <path d="M 305,170 L 305,120 Q 380,100 460,110 L 555,110 L 555,170 Z" className="fill-amber-800" opacity="0.4" />

        {/* Grass tufts */}
        {[340, 370, 400, 430, 460, 490].map((x, i) => {
          const baseY = 108 + Math.abs(i - 2.5) * 3;
          return (
            <g key={`grass-${i}`}>
              {/* Blades */}
              <line x1={x} y1={baseY} x2={x - 6} y2={baseY - 20} className="stroke-green-400" strokeWidth="1.5" />
              <line x1={x} y1={baseY} x2={x + 6} y2={baseY - 22} className="stroke-green-500" strokeWidth="1.5" />
              <line x1={x} y1={baseY} x2={x + 1} y2={baseY - 24} className="stroke-green-400" strokeWidth="1.5" />
              {/* Roots */}
              <line x1={x} y1={baseY} x2={x - 8} y2={baseY + 25} className="stroke-amber-500" strokeWidth="1" opacity="0.6" />
              <line x1={x} y1={baseY} x2={x + 5} y2={baseY + 28} className="stroke-amber-500" strokeWidth="1" opacity="0.6" />
              <line x1={x} y1={baseY} x2={x - 2} y2={baseY + 30} className="stroke-amber-500" strokeWidth="1" opacity="0.6" />
            </g>
          );
        })}

        {/* Root zone label */}
        <text x="430" y="155" textAnchor="middle" className="fill-amber-400" fontSize="10">Deep roots bind soil</text>

        <text x="430" y="182" textAnchor="middle" className="fill-slate-300" fontSize="10">Living roots hold bank together permanently</text>
        <text x="430" y="197" textAnchor="middle" className="fill-emerald-500" fontSize="10" fontWeight="bold">Cost: Very low | Lifespan: Permanent</text>

        {/* 3. Geotextile Bags (bottom-left) */}
        <rect x="15" y="222" width="270" height="170" rx="8" className="fill-slate-800" />
        <text x="150" y="242" textAnchor="middle" className="fill-sky-400" fontSize="12" fontWeight="bold">Geotextile Bags</text>

        {/* Stacked bags */}
        {[
          [60, 340, 50, 18], [115, 340, 50, 18], [170, 340, 50, 18],
          [88, 320, 50, 18], [143, 320, 50, 18],
          [115, 300, 50, 18],
        ].map(([x, y, w, h], i) => (
          <g key={`bag-${i}`}>
            <rect x={x} y={y} width={w} height={h} rx="8" className="fill-slate-600" stroke="#64748b" strokeWidth="1" />
            <line x1={x + 10} y1={y + h / 2} x2={x + w - 10} y2={y + h / 2} className="stroke-slate-500" strokeWidth="0.5" />
          </g>
        ))}

        {/* Water side */}
        <rect x="25" y="330" width="30" height="40" rx="4" className="fill-blue-900" opacity="0.4" />
        <text x="40" y="355" textAnchor="middle" className="fill-blue-400" fontSize="9" transform="rotate(-90, 40, 355)">Water</text>

        {/* Land side */}
        <rect x="225" y="290" width="50" height="80" rx="4" className="fill-emerald-900" opacity="0.3" />
        <text x="250" y="335" textAnchor="middle" className="fill-emerald-500" fontSize="9">Land</text>

        <text x="150" y="370" textAnchor="middle" className="fill-slate-300" fontSize="10">Sand-filled fabric bags absorb wave energy</text>
        <text x="150" y="385" textAnchor="middle" className="fill-sky-400" fontSize="10" fontWeight="bold">Cost: Moderate | Lifespan: 10\u201320 years</text>

        {/* 4. Gabion Walls (bottom-right) */}
        <rect x="295" y="222" width="270" height="170" rx="8" className="fill-slate-800" />
        <text x="430" y="242" textAnchor="middle" className="fill-sky-400" fontSize="12" fontWeight="bold">Gabion Rock Walls</text>

        {/* Wire mesh boxes with rocks */}
        {[
          [340, 330, 70, 35], [415, 330, 70, 35],
          [365, 293, 70, 35],
        ].map(([x, y, w, h], i) => (
          <g key={`gabion-${i}`}>
            <rect x={x} y={y} width={w} height={h} rx="2" fill="none" className="stroke-slate-400" strokeWidth="1.5" />
            {/* Rocks inside */}
            {Array.from({ length: 8 }, (_, j) => (
              <circle key={j} cx={x + 8 + (j % 4) * 16} cy={y + 10 + Math.floor(j / 4) * 15}
                r={4 + (j % 3)} className="fill-slate-500" opacity="0.6" />
            ))}
          </g>
        ))}

        {/* Water arrows hitting gabion */}
        <path d="M 310,350 L 335,350" fill="none" className="stroke-blue-400" strokeWidth="1.5" markerEnd="url(#majProtArrow)">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
        </path>

        <text x="430" y="376" textAnchor="middle" className="fill-slate-300" fontSize="10">Wire cages filled with rock resist wave force</text>
        <text x="430" y="391" textAnchor="middle" className="fill-sky-400" fontSize="10" fontWeight="bold">Cost: High | Lifespan: 20\u201350 years</text>

        {/* Bottom summary */}
        <rect x="30" y="398" width="520" height="18" rx="4" className="fill-amber-900" opacity="0.5" />
        <text x="290" y="412" textAnchor="middle" className="fill-amber-300" fontSize="10">Best results combine natural solutions (grass, bamboo) with engineered barriers (geotextiles, gabions)</text>

        <defs>
          <marker id="majProtArrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M0,0 L6,2 L0,4 Z" className="fill-blue-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
