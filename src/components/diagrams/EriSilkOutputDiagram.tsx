export default function EriSilkOutputDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 620 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Radar chart comparing silk fiber properties: tensile strength, elasticity, warmth, and biodegradability across eri, mulberry, and polyester"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="620" height="380" rx="8" className="fill-white dark:fill-slate-900" />

        <text x="310" y="28" textAnchor="middle" className="title fill-amber-700 dark:fill-amber-300">
          Project Output: Fiber Property Comparison
        </text>

        {/* Radar chart center */}
        {/* Axes */}
        {[
          { angle: -90, label: 'Tensile Strength', lx: 310, ly: 60 },
          { angle: -18, label: 'Elasticity', lx: 510, ly: 140 },
          { angle: 54, label: 'Warmth', lx: 490, ly: 310 },
          { angle: 126, label: 'Biodegradability', lx: 130, ly: 310 },
          { angle: 198, label: 'Moisture Absorption', lx: 100, ly: 140 },
        ].map((ax, i) => {
          const rad = (ax.angle * Math.PI) / 180;
          const cx = 310, cy = 200, r = 120;
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={cx + r * Math.cos(rad)} y2={cy + r * Math.sin(rad)}
                stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-600" />
              <text x={ax.lx} y={ax.ly} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">{ax.label}</text>
            </g>
          );
        })}

        {/* Grid circles */}
        {[40, 80, 120].map(r => (
          <circle key={r} cx={310} cy={200} r={r} fill="none" stroke="#e2e8f0" strokeWidth="0.8" className="dark:stroke-slate-700" />
        ))}

        {/* Data polygons */}
        {/* Eri silk: high warmth, high biodeg, moderate strength, good moisture, moderate elasticity */}
        {(() => {
          const cx = 310, cy = 200;
          const angles = [-90, -18, 54, 126, 198].map(a => (a * Math.PI) / 180);
          const eriVals = [0.6, 0.5, 0.95, 0.95, 0.8];
          const mulVals = [0.85, 0.7, 0.4, 0.9, 0.6];
          const polyVals = [0.9, 0.8, 0.3, 0.1, 0.15];
          const r = 120;

          const toPoints = (vals: number[]) =>
            vals.map((v, i) => `${cx + r * v * Math.cos(angles[i])},${cy + r * v * Math.sin(angles[i])}`).join(' ');

          return (
            <>
              <polygon points={toPoints(polyVals)} fill="#8b5cf6" opacity="0.15" stroke="#8b5cf6" strokeWidth="1.5" className="dark:stroke-purple-400" />
              <polygon points={toPoints(mulVals)} fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" className="dark:stroke-amber-400" />
              <polygon points={toPoints(eriVals)} fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="2" className="dark:stroke-emerald-400" />
            </>
          );
        })()}

        {/* Legend */}
        <rect x="40" y="340" width="14" height="14" rx="2" fill="#10b981" opacity="0.7" />
        <text x="60" y="352" className="small fill-emerald-700 dark:fill-emerald-400" fontWeight="600">Eri Silk</text>

        <rect x="160" y="340" width="14" height="14" rx="2" fill="#f59e0b" opacity="0.7" />
        <text x="180" y="352" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Mulberry Silk</text>

        <rect x="320" y="340" width="14" height="14" rx="2" fill="#8b5cf6" opacity="0.7" />
        <text x="340" y="352" className="small fill-purple-700 dark:fill-purple-400" fontWeight="600">Polyester</text>

        <text x="310" y="372" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">
          Eri silk excels in warmth, biodegradability, and moisture absorption
        </text>
      </svg>
    </div>
  );
}
