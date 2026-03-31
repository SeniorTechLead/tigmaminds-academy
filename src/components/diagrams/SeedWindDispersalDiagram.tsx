export default function SeedWindDispersalDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Wind dispersal mechanisms: dandelion pappus, maple samara, and orchid dust seed compared"
      >
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Wind Dispersal: Three Strategies
        </text>

        {/* Dandelion section */}
        <g transform="translate(130, 100)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Dandelion Pappus
          </text>
          {/* Stem */}
          <line x1="0" y1="60" x2="0" y2="180" stroke="#65a30d" strokeWidth="2.5" />
          {/* Seed body */}
          <ellipse cx="0" cy="60" rx="4" ry="8" fill="#a16207" />
          {/* Pappus filaments radiating out */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            const rad = (angle * Math.PI) / 180;
            const x2 = Math.cos(rad) * 45;
            const y2 = -Math.sin(rad) * 35 - 10;
            return (
              <line
                key={i}
                x1="0" y1="52"
                x2={x2} y2={y2 + 52}
                stroke="#e5e7eb"
                strokeWidth="0.8"
                className="dark:stroke-slate-500"
              />
            );
          })}
          <circle cx="0" cy="42" r="3" fill="#fef3c7" opacity="0.6" />
          {/* Vortex ring indicator */}
          <ellipse cx="0" cy="25" rx="30" ry="8" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
          <text x="0" y="205" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Terminal velocity: 0.3 m/s
          </text>
          <text x="0" y="220" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Range: up to 100+ km
          </text>
          {/* Arrow showing separated vortex ring */}
          <text x="50" y="22" fontSize="10" className="fill-blue-500 dark:fill-blue-400">separated</text>
          <text x="50" y="34" fontSize="10" className="fill-blue-500 dark:fill-blue-400">vortex ring</text>
        </g>

        {/* Maple samara section */}
        <g transform="translate(390, 100)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Maple Samara
          </text>
          {/* Wing shape */}
          <g transform="translate(0, 80) rotate(-30)">
            <path
              d="M 0,0 Q 10,-5 50,-10 Q 65,-8 70,0 Q 65,4 50,6 Q 10,5 0,0 Z"
              fill="#84cc16" opacity="0.7"
            />
            {/* Veins */}
            <line x1="5" y1="0" x2="65" y2="-4" stroke="#65a30d" strokeWidth="0.8" />
            <line x1="20" y1="-1" x2="35" y2="-8" stroke="#65a30d" strokeWidth="0.5" />
            <line x1="35" y1="0" x2="50" y2="-7" stroke="#65a30d" strokeWidth="0.5" />
          </g>
          {/* Seed body */}
          <circle cx="-5" cy="78" r="6" fill="#92400e" />
          {/* Rotation arrow */}
          <path d="M -30,120 A 25,25 0 1,1 25,115" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seed-arrow)" />
          <defs>
            <marker id="seed-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M 0,0 L 8,3 L 0,6 Z" fill="#f59e0b" />
            </marker>
          </defs>
          <text x="0" y="155" textAnchor="middle" fontSize="11" className="fill-amber-600 dark:fill-amber-400">
            Autorotation (like a helicopter)
          </text>
          <text x="0" y="205" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Terminal velocity: 0.9 m/s
          </text>
          <text x="0" y="220" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Range: up to 1 km
          </text>
        </g>

        {/* Orchid dust seed section */}
        <g transform="translate(650, 100)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Orchid Dust Seed
          </text>
          {/* Tiny seed (exaggerated for visibility) */}
          <circle cx="0" cy="90" r="2" fill="#d97706" />
          <circle cx="0" cy="90" r="8" fill="none" stroke="#d4d4d8" strokeWidth="0.5" strokeDasharray="2,2" className="dark:stroke-slate-600" />
          <text x="20" y="88" fontSize="10" className="fill-gray-400 dark:fill-slate-500">0.05 mg</text>
          <text x="20" y="100" fontSize="10" className="fill-gray-400 dark:fill-slate-500">(actual size: \u2022)</text>
          {/* Floating dots showing air currents */}
          {[60, 75, 105, 120, 135].map((y, i) => (
            <circle key={i} cx={-15 + i * 8} cy={y} r="1.5" fill="#a78bfa" opacity={0.3 + i * 0.1} />
          ))}
          <text x="0" y="170" textAnchor="middle" fontSize="11" className="fill-purple-500 dark:fill-purple-400">
            So tiny it floats like dust
          </text>
          <text x="0" y="205" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Terminal velocity: {"\u2248"} 0 m/s
          </text>
          <text x="0" y="220" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Range: 1,000+ km (air currents)
          </text>
        </g>

        {/* Wind arrows across bottom */}
        <g transform="translate(0, 340)">
          <rect x="40" y="0" width="700" height="100" rx="8" className="fill-blue-50 dark:fill-blue-950" opacity="0.5" />
          <text x="390" y="25" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            Key Principle: Increase Size-to-Mass Ratio
          </text>
          <text x="390" y="48" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">
            Drag force {"\u221D"} radius{"\u00B2"}  |  Gravity {"\u221D"} mass  |  Terminal velocity = balance point
          </text>
          <text x="390" y="68" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">
            Larger effective radius + lower mass = slower fall = farther wind travel
          </text>
          {/* Wind arrows */}
          {[100, 250, 400, 550, 680].map((x, i) => (
            <line key={i} x1={x} y1="85" x2={x + 40} y2="85" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#wind-arrow)" opacity={0.4 + i * 0.1} />
          ))}
          <defs>
            <marker id="wind-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M 0,0 L 8,3 L 0,6 Z" fill="#3b82f6" />
            </marker>
          </defs>
        </g>

        {/* Bottom credit */}
        <text x="390" y="500" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Wind dispersal (anemochory): three evolutionary strategies for airborne seeds
        </text>
      </svg>
    </div>
  );
}
