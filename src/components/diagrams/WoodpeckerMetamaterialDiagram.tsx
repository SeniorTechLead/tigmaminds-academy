export default function WoodpeckerMetamaterialDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Engineered metamaterial structures inspired by spongy bone with lattice designs"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="630" height="430" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="315" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Metamaterials: Engineering Spongy Bone
        </text>

        {/* Natural spongy bone */}
        <g transform="translate(20, 50)">
          <rect x="0" y="0" width="180" height="165" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#d97706" strokeWidth="1.5" />
          <text x="90" y="20" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">Natural Spongy Bone</text>

          {/* Organic structure (irregular) */}
          <g transform="translate(18, 28)">
            {/* Random-looking trabeculae network */}
            {[
              [10,10,40,15], [40,15,55,40], [55,40,30,50], [30,50,10,35], [10,35,10,10],
              [40,15,70,10], [70,10,90,25], [90,25,80,50], [80,50,55,40],
              [70,10,110,15], [110,15,125,35], [125,35,110,55], [110,55,80,50],
              [30,50,40,75], [40,75,70,80], [70,80,80,50],
              [40,75,20,90], [20,90,50,100], [50,100,70,80],
              [70,80,100,90], [100,90,125,75], [125,75,110,55],
              [50,100,80,110], [80,110,100,90],
            ].map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d97706" strokeWidth="2" opacity="0.6" />
            ))}
            {/* Nodes */}
            {[[10,10],[40,15],[55,40],[30,50],[10,35],[70,10],[90,25],[80,50],[110,15],[125,35],[110,55],[40,75],[70,80],[20,90],[50,100],[100,90],[125,75],[80,110]].map(([cx,cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" fill="#d97706" opacity="0.4" />
            ))}
          </g>
          <text x="90" y="156" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Irregular, organic structure</text>
        </g>

        {/* Arrow */}
        <g transform="translate(205, 115)">
          <text x="10" y="0" className="label fill-gray-400 dark:fill-slate-500">Inspire</text>
          <line x1="0" y1="8" x2="40" y2="8" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" markerEnd="url(#wpm-arr)" />
        </g>

        <defs>
          <marker id="wpm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#475569" />
          </marker>
        </defs>

        {/* Engineered lattice 1: BCC */}
        <g transform="translate(250, 50)">
          <rect x="0" y="0" width="170" height="165" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="85" y="20" textAnchor="middle" className="label" fill="#7dd3fc" fontWeight="600">BCC Lattice</text>

          <g transform="translate(25, 28)">
            {/* 3x3 BCC unit cells */}
            {[0, 1, 2].map(row => (
              [0, 1, 2].map(col => {
                const ox = col * 38;
                const oy = row * 35;
                return (
                  <g key={`${row}-${col}`}>
                    {/* Cube edges */}
                    <rect x={ox} y={oy} width="38" height="35" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
                    {/* Diagonal to center */}
                    <line x1={ox} y1={oy} x2={ox + 19} y2={oy + 17.5} stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />
                    <line x1={ox + 38} y1={oy} x2={ox + 19} y2={oy + 17.5} stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />
                    <line x1={ox} y1={oy + 35} x2={ox + 19} y2={oy + 17.5} stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />
                    <line x1={ox + 38} y1={oy + 35} x2={ox + 19} y2={oy + 17.5} stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />
                    {/* Center node */}
                    <circle cx={ox + 19} cy={oy + 17.5} r="2.5" fill="#38bdf8" opacity="0.5" />
                  </g>
                );
              })
            ))}
          </g>
          <text x="85" y="146" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Regular, optimized</text>
          <text x="85" y="159" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">for uniform load</text>
        </g>

        {/* Engineered lattice 2: Gyroid */}
        <g transform="translate(430, 50)">
          <rect x="0" y="0" width="180" height="165" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="90" y="20" textAnchor="middle" className="label" fill="#c4b5fd" fontWeight="600">Gyroid Structure</text>

          <g transform="translate(18, 28)">
            {/* Gyroid-like wavy intersecting surfaces */}
            {[0, 1, 2, 3].map(i => (
              <path key={`h-${i}`}
                d={`M0,${i * 28 + 10} Q35,${i * 28 - 5} 70,${i * 28 + 10} Q105,${i * 28 + 25} 140,${i * 28 + 10}`}
                fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.5"
              />
            ))}
            {[0, 1, 2, 3, 4].map(i => (
              <path key={`v-${i}`}
                d={`M${i * 35},0 Q${i * 35 + 15},40 ${i * 35},80 Q${i * 35 - 15},100 ${i * 35},110`}
                fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.3"
              />
            ))}
          </g>
          <text x="90" y="146" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Continuous surface,</text>
          <text x="90" y="159" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">max energy absorption</text>
        </g>

        {/* Comparison table */}
        <g transform="translate(30, 230)">
          <rect x="0" y="0" width="570" height="100" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="285" y="20" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">Property Comparison</text>

          {/* Headers */}
          <text x="190" y="38" textAnchor="middle" className="sm" fill="#d97706">Natural Bone</text>
          <text x="345" y="38" textAnchor="middle" className="sm" fill="#38bdf8">BCC Lattice</text>
          <text x="490" y="38" textAnchor="middle" className="sm" fill="#a78bfa">Gyroid</text>

          {[
            { prop: 'Weight', a: 'Light', b: 'Ultra-light', c: 'Ultra-light' },
            { prop: 'Absorption', a: 'High', b: 'High', c: 'Very High' },
            { prop: 'Self-repair', a: 'Yes!', b: 'No', c: 'No' },
          ].map((r, i) => (
            <g key={i} transform={`translate(0, ${52 + i * 16})`}>
              <text x="75" y="0" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">{r.prop}</text>
              <text x="190" y="0" textAnchor="middle" className="sm" fill="#fbbf24">{r.a}</text>
              <text x="345" y="0" textAnchor="middle" className="sm" fill="#7dd3fc">{r.b}</text>
              <text x="490" y="0" textAnchor="middle" className="sm" fill="#c4b5fd">{r.c}</text>
            </g>
          ))}
        </g>

        {/* 3D printing note */}
        <g transform="translate(30, 345)">
          <rect x="0" y="0" width="570" height="70" rx="8" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <text x="285" y="20" textAnchor="middle" className="label" fill="#22c55e" fontWeight="600">
            Made Possible by 3D Printing
          </text>
          <text x="285" y="36" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            These complex internal structures were impossible to manufacture until additive
          </text>
          <text x="285" y="49" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            manufacturing (3D printing) allowed layer-by-layer construction of lattice geometries.
          </text>
          <text x="285" y="62" textAnchor="middle" className="sm" fill="#86efac">
            Materials: titanium, nylon, carbon-fiber composites
          </text>
        </g>
      </svg>
    </div>
  );
}
