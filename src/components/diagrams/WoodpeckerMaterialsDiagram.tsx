export default function WoodpeckerMaterialsDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 443"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Stress-strain curves comparing bone, steel, and carbon fiber"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="600" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Material Comparison: Stress-Strain Curves
        </text>

        {/* Graph */}
        <g transform="translate(80, 55)">
          {/* Y axis */}
          <line x1="0" y1="0" x2="0" y2="260" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
          {/* X axis */}
          <line x1="0" y1="260" x2="440" y2="260" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

          <text x="-45" y="130" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" transform="rotate(-90,-45,130)">
            Stress (MPa)
          </text>
          <text x="220" y="290" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">
            Strain (%)
          </text>

          {/* Gridlines */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i} x1="0" y1={260 - i * 52} x2="440" y2={260 - i * 52} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1" />
          ))}

          {/* Steel - high stress, moderate strain, steep then plateau */}
          <path
            d="M0,260 L60,40 L100,30 C150,28 250,25 350,20"
            fill="none" stroke="#94a3b8" strokeWidth="3"
          />
          <text x="355" y="16" className="label fill-gray-600 dark:fill-slate-300" fontWeight="600">Steel</text>
          <text x="355" y="30" className="sm fill-gray-500 dark:fill-slate-400">Strong but heavy</text>

          {/* Carbon fiber - very high stress, very low strain, brittle snap */}
          <path
            d="M0,260 L40,50 L50,40"
            fill="none" stroke="#38bdf8" strokeWidth="3"
          />
          {/* Brittle failure X */}
          <line x1="45" y1="35" x2="55" y2="45" stroke="#38bdf8" strokeWidth="2" />
          <line x1="55" y1="35" x2="45" y2="45" stroke="#38bdf8" strokeWidth="2" />
          <text x="65" y="40" className="label" fill="#7dd3fc" fontWeight="600">Carbon Fiber</text>
          <text x="65" y="54" className="sm" fill="#7dd3fc">Strong but brittle</text>

          {/* Woodpecker bone - moderate stress, energy absorption curve */}
          <path
            d="M0,260 C30,200 60,120 100,90 C140,70 200,65 280,80 C330,90 360,110 380,140"
            fill="none" stroke="#d97706" strokeWidth="3"
          />
          <text x="385" y="136" className="label" fill="#fbbf24" fontWeight="600">Bone</text>
          <text x="385" y="150" className="sm" fill="#fbbf24">Tough + flexible</text>

          {/* Energy absorption area for bone (shaded) */}
          <path
            d="M0,260 C30,200 60,120 100,90 C140,70 200,65 280,80 C330,90 360,110 380,140 L380,260 Z"
            fill="#d97706" opacity="0.08"
          />
          <text x="180" y="200" textAnchor="middle" className="sm" fill="#d97706" opacity="0.7">
            Energy absorbed
          </text>

          {/* Spongy bone - even more flexible */}
          <path
            d="M0,260 C40,220 80,180 120,160 C160,145 220,140 300,160 C350,175 380,200 400,230"
            fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="6 3"
          />
          <text x="405" y="226" className="label" fill="#86efac" fontWeight="600">Spongy Bone</text>
          <text x="405" y="240" className="sm" fill="#86efac">Maximum absorption</text>
        </g>

        {/* Legend / comparison table */}
        <g transform="translate(60, 340)">
          {[
            { name: 'Steel', strength: 'High', weight: 'Heavy', absorb: 'Low', color: '#94a3b8' },
            { name: 'Carbon Fiber', strength: 'Very High', weight: 'Light', absorb: 'Very Low', color: '#38bdf8' },
            { name: 'Dense Bone', strength: 'Moderate', weight: 'Light', absorb: 'Moderate', color: '#d97706' },
            { name: 'Spongy Bone', strength: 'Low', weight: 'Very Light', absorb: 'Very High', color: '#22c55e' },
          ].map((m, i) => (
            <g key={i} transform={`translate(${i * 120}, 0)`}>
              <circle cx="8" cy="6" r="5" fill={m.color} opacity="0.7" />
              <text x="18" y="10" className="sm" fill={m.color} fontWeight="600">{m.name}</text>
              <text x="18" y="22" className="sm fill-gray-400 dark:fill-slate-500">Absorb: {m.absorb}</text>
            </g>
          ))}
        </g>

        <text x="300" y="393" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">
          Bone combines strength and energy absorption — something no single engineered material matches
        </text>
      </svg>
    </div>
  );
}
