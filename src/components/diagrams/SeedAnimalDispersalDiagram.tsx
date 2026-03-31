export default function SeedAnimalDispersalDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Animal dispersal: epizoochory (hooks on fur) vs endozoochory (eaten and excreted)"
      >
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Zoochory: Seeds That Hitch Rides on Animals
        </text>

        {/* Dividing line */}
        <line x1="390" y1="60" x2="390" y2="440" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="6,4" className="dark:stroke-slate-700" />

        {/* EPIZOOCHORY - Left side */}
        <g transform="translate(195, 70)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
            Epizoochory (Outside)
          </text>
          <text x="0" y="18" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Seeds attach to fur, feathers, or clothing
          </text>

          {/* Burr seed with hooks */}
          <g transform="translate(-80, 50)">
            <circle cx="0" cy="0" r="14" fill="#a16207" />
            {/* Hooks radiating out */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12;
              const rad = (angle * Math.PI) / 180;
              const x1 = Math.cos(rad) * 14;
              const y1 = Math.sin(rad) * 14;
              const x2 = Math.cos(rad) * 26;
              const y2 = Math.sin(rad) * 26;
              const hookX = x2 + Math.cos(rad + 1.2) * 5;
              const hookY = y2 + Math.sin(rad + 1.2) * 5;
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#92400e" strokeWidth="1.2" />
                  <line x1={x2} y1={y2} x2={hookX} y2={hookY} stroke="#92400e" strokeWidth="1" />
                </g>
              );
            })}
            <text x="0" y="45" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
              Burdock burr
            </text>
          </g>

          {/* Fur surface representation */}
          <g transform="translate(80, 40)">
            <rect x="-50" y="-15" width="100" height="55" rx="6" fill="#d2b48c" opacity="0.3" />
            {/* Fur strands */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line
                key={i}
                x1={-45 + i * 5}
                y1="40"
                x2={-42 + i * 5}
                y2="-10"
                stroke="#b8860b"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
            {/* Hook gripping fur */}
            <circle cx="0" cy="10" r="8" fill="#a16207" />
            <path d="M 8,10 L 14,4 L 18,8" fill="none" stroke="#92400e" strokeWidth="1.5" />
            <text x="0" y="60" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              Hooks grip fur strands
            </text>
          </g>

          {/* Velcro connection */}
          <g transform="translate(0, 170)">
            <rect x="-140" y="0" width="280" height="50" rx="6" className="fill-amber-50 dark:fill-amber-950" opacity="0.5" />
            <text x="0" y="20" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
              Biomimicry: Velcro (1941)
            </text>
            <text x="0" y="38" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              George de Mestral studied burr hooks {"\u2192"} invented hook-and-loop fastener
            </text>
          </g>
        </g>

        {/* ENDOZOOCHORY - Right side */}
        <g transform="translate(585, 70)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-rose-600 dark:fill-rose-400">
            Endozoochory (Inside)
          </text>
          <text x="0" y="18" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Seeds eaten, survive digestion, deposited far away
          </text>

          {/* Fruit with seed inside */}
          <g transform="translate(-60, 60)">
            <ellipse cx="0" cy="0" rx="22" ry="18" fill="#ef4444" opacity="0.7" />
            <circle cx="0" cy="0" r="6" fill="#92400e" />
            <text x="0" y="32" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              Fleshy fruit
            </text>
            <text x="0" y="44" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              (sugar = payment)
            </text>
          </g>

          {/* Arrow showing journey */}
          <g transform="translate(0, 55)">
            <line x1="-25" y1="0" x2="25" y2="0" stroke="#ef4444" strokeWidth="2" markerEnd="url(#endo-arrow)" />
            <defs>
              <marker id="endo-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M 0,0 L 8,3 L 0,6 Z" fill="#ef4444" />
              </marker>
            </defs>
          </g>

          {/* Stomach acid */}
          <g transform="translate(60, 50)">
            <ellipse cx="0" cy="0" rx="28" ry="22" fill="none" stroke="#eab308" strokeWidth="1.5" />
            <text x="0" y="-4" textAnchor="middle" fontSize="10" className="fill-yellow-600 dark:fill-yellow-400">Stomach</text>
            <text x="0" y="8" textAnchor="middle" fontSize="10" className="fill-yellow-600 dark:fill-yellow-400">acid</text>
            <circle cx="0" cy="0" r="5" fill="#92400e" />
            <text x="0" y="32" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              Tough coat survives
            </text>
          </g>

          {/* Deposit */}
          <g transform="translate(0, 140)">
            <ellipse cx="0" cy="10" rx="30" ry="12" fill="#92400e" opacity="0.3" />
            <circle cx="0" cy="5" r="5" fill="#92400e" />
            {/* Sprout */}
            <path d="M 0,0 C -3,-15 3,-25 0,-30" stroke="#22c55e" strokeWidth="2" fill="none" />
            <ellipse cx="-4" cy="-28" rx="6" ry="4" fill="#22c55e" opacity="0.8" />
            <ellipse cx="4" cy="-32" rx="6" ry="4" fill="#22c55e" opacity="0.8" />
            <text x="0" y="35" textAnchor="middle" fontSize="10" className="fill-green-600 dark:fill-green-400">
              Deposited with fertilizer!
            </text>
          </g>
        </g>

        {/* Bottom comparison box */}
        <g transform="translate(390, 360)">
          <rect x="-340" y="0" width="680" height="100" rx="8" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.5" />
          <text x="0" y="25" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
            In Assam: Indian Rhinoceros as Seed Disperser
          </text>
          <text x="0" y="48" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">
            Rhino dung contains viable seeds from dozens of plant species
          </text>
          <text x="0" y="68" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">
            Each dung pile = a potential garden scattered across the grasslands
          </text>
          <text x="0" y="88" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-500">
            If rhinos go extinct, these plants lose their primary dispersal partner
          </text>
        </g>

        <text x="390" y="500" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Animal dispersal (zoochory): seeds use animals as taxis via hooks or fruit
        </text>
      </svg>
    </div>
  );
}
