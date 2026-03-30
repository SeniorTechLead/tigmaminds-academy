export default function AgniHeatTransferDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 560 380"
        className="w-full h-auto"
        role="img"
        aria-label="Three modes of heat transfer: conduction, convection, and radiation"
      >
        <style>{`
          .aht-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .aht-label { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .aht-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .aht-mid { font-family: system-ui, sans-serif; font-size: 11px; }
        `}</style>

        <defs>
          <marker id="aht-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
          <marker id="aht-red-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-red-500 dark:fill-red-400" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="560" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="280" y="26" textAnchor="middle" className="aht-title fill-gray-700 dark:fill-gray-200">
          Three Ways Heat Travels
        </text>

        {/* ===== 1. CONDUCTION (left) ===== */}
        <rect x="20" y="50" width="160" height="200" rx="6"
          className="fill-orange-50 dark:fill-orange-900/10 stroke-orange-300 dark:stroke-orange-700" strokeWidth="1" />
        <text x="100" y="72" textAnchor="middle" className="aht-label fill-orange-700 dark:fill-orange-300">
          Conduction
        </text>
        <text x="100" y="86" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          (through solids)
        </text>

        {/* Metal spoon in fire */}
        <rect x="40" y="170" width="120" height="8" rx="3"
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        {/* Heat gradient on spoon */}
        <rect x="40" y="170" width="30" height="8" rx="3" className="fill-red-500" opacity="0.8" />
        <rect x="70" y="170" width="30" height="8" className="fill-orange-400" opacity="0.7" />
        <rect x="100" y="170" width="30" height="8" className="fill-yellow-300" opacity="0.6" />
        <rect x="130" y="170" width="30" height="8" rx="3" className="fill-gray-300 dark:fill-gray-600" opacity="0.5" />

        {/* Fire at left end */}
        <ellipse cx="38" cy="155" rx="12" ry="18" className="fill-orange-400/60 dark:fill-orange-500/30" />
        <ellipse cx="38" cy="160" rx="6" ry="10" className="fill-yellow-300/60 dark:fill-yellow-400/40" />

        {/* Direction arrows */}
        <line x1="50" y1="196" x2="145" y2="196" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" markerEnd="url(#aht-red-arrow)" />
        <text x="98" y="212" textAnchor="middle" className="aht-small fill-red-600 dark:fill-red-400">
          Vibrations pass atom-to-atom
        </text>
        <text x="100" y="225" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          Touch a hot spoon —
        </text>
        <text x="100" y="237" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          heat travels through the metal
        </text>

        {/* ===== 2. CONVECTION (centre) ===== */}
        <rect x="195" y="50" width="160" height="200" rx="6"
          className="fill-blue-50 dark:fill-blue-900/10 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="275" y="72" textAnchor="middle" className="aht-label fill-blue-700 dark:fill-blue-300">
          Convection
        </text>
        <text x="275" y="86" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          (through fluids/air)
        </text>

        {/* Convection loop arrows */}
        <path d="M 250,205 L 250,115 Q 250,100 265,100 L 285,100 Q 300,100 300,115 L 300,205"
          className="stroke-red-400 dark:stroke-red-300" strokeWidth="2" fill="none" markerEnd="url(#aht-red-arrow)" />
        <line x1="300" y1="205" x2="300" y2="205" className="stroke-transparent" />
        {/* Return path (cool) */}
        <path d="M 230,115 L 230,200 Q 230,215 245,215" className="stroke-blue-400 dark:stroke-blue-300" strokeWidth="1.5" fill="none" markerEnd="url(#aht-arrow)" />
        <path d="M 315,200 L 315,115 Q 315,100 300,100" className="stroke-blue-400 dark:stroke-blue-300" strokeWidth="1.5" fill="none" />

        <text x="258" y="155" textAnchor="middle" className="aht-small fill-red-600 dark:fill-red-400">Hot</text>
        <text x="258" y="167" textAnchor="middle" className="aht-small fill-red-600 dark:fill-red-400">rises</text>
        <text x="322" y="165" textAnchor="middle" className="aht-small fill-blue-600 dark:fill-blue-400">Cool</text>
        <text x="322" y="177" textAnchor="middle" className="aht-small fill-blue-600 dark:fill-blue-400">sinks</text>

        {/* Fire at base */}
        <ellipse cx="275" cy="215" rx="15" ry="10" className="fill-orange-400/50 dark:fill-orange-500/30" />

        <text x="275" y="237" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          Hot air rises, cool air sinks
        </text>
        <text x="275" y="249" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          → convection current
        </text>

        {/* ===== 3. RADIATION (right) ===== */}
        <rect x="370" y="50" width="170" height="200" rx="6"
          className="fill-red-50 dark:fill-red-900/10 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="455" y="72" textAnchor="middle" className="aht-label fill-red-700 dark:fill-red-300">
          Radiation
        </text>
        <text x="455" y="86" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          (electromagnetic waves)
        </text>

        {/* Sun-like source */}
        <circle cx="420" cy="160" r="20" className="fill-yellow-300 dark:fill-yellow-500/60 stroke-yellow-500 dark:stroke-yellow-400" strokeWidth="1.5" />

        {/* Radiation waves outward */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 420 + 25 * Math.cos(rad);
          const y1 = 160 + 25 * Math.sin(rad);
          const x2 = 420 + 50 * Math.cos(rad);
          const y2 = 160 + 50 * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              className="stroke-red-400 dark:stroke-red-300" strokeWidth="1.5"
              strokeDasharray="4,3" />
          );
        })}

        {/* Person feeling warmth */}
        <circle cx="500" cy="155" r="8" className="fill-gray-300 dark:fill-gray-600 stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <line x1="500" y1="163" x2="500" y2="185" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />

        <text x="455" y="220" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          No medium needed —
        </text>
        <text x="455" y="232" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          travels through vacuum
        </text>
        <text x="455" y="244" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          (how Sun warms Earth)
        </text>

        {/* Summary row */}
        <rect x="20" y="270" width="520" height="100" rx="6"
          className="fill-gray-50 dark:fill-gray-800/50 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
        <text x="280" y="290" textAnchor="middle" className="aht-label fill-gray-700 dark:fill-gray-200">
          All Three at a Campfire
        </text>
        <text x="280" y="308" textAnchor="middle" className="aht-small fill-orange-600 dark:fill-orange-400">
          Conduction: your hand burns touching a hot stick
        </text>
        <text x="280" y="324" textAnchor="middle" className="aht-small fill-blue-600 dark:fill-blue-400">
          Convection: hot smoke and sparks rise into the night sky
        </text>
        <text x="280" y="340" textAnchor="middle" className="aht-small fill-red-600 dark:fill-red-400">
          Radiation: you feel warmth on your face from metres away
        </text>
        <text x="280" y="360" textAnchor="middle" className="aht-small fill-gray-500 dark:fill-gray-400">
          Agni’s fire demonstrates all three modes simultaneously
        </text>
      </svg>
    </div>
  );
}
