export default function BeeVenomChemistryDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 546 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="Bee venom chemistry diagram showing melittin structure and mechanism">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Bee Venom Chemistry</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Melittin: the main active component (50% of dry venom)</text>

        {/* Melittin alpha-helix representation */}
        <g transform="translate(260, 130)">
          <text x="0" y="-35" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">Melittin Peptide (26 amino acids)</text>

          {/* Helix backbone */}
          <path
            d="M -160,0 Q -140,-25 -120,0 Q -100,25 -80,0 Q -60,-25 -40,0 Q -20,25 0,0 Q 20,-25 40,0 Q 60,25 80,0 Q 100,-25 120,0 Q 140,25 160,0"
            fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.6"
          />

          {/* Amino acid circles along helix */}
          {Array.from({ length: 13 }).map((_, i) => {
            const x = -160 + i * 25;
            const y = i % 2 === 0 ? 0 : (i % 4 === 1 ? -12 : 12);
            const isHydrophobic = i < 10;
            return (
              <circle
                key={i}
                cx={x} cy={y}
                r="6"
                fill={isHydrophobic ? "#f59e0b" : "#3b82f6"}
                opacity="0.7"
                stroke={isHydrophobic ? "#d97706" : "#2563eb"}
                strokeWidth="1"
              />
            );
          })}

          {/* Labels */}
          <rect x="-170" y="25" width="80" height="14" rx="3" fill="#f59e0b" opacity="0.15" />
          <text x="-130" y="35" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#f59e0b">Hydrophobic end</text>
          <rect x="90" y="25" width="80" height="14" rx="3" fill="#3b82f6" opacity="0.15" />
          <text x="130" y="35" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#3b82f6">Hydrophilic end</text>

          <text x="0" y="55" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">
            Amphipathic: one end loves water, other end loves lipids
          </text>
        </g>

        {/* Mechanism of action */}
        <g transform="translate(260, 230)">
          <text x="0" y="-20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">How Melittin Attacks Cells</text>

          {/* Step 1: Approach cell membrane */}
          <g transform="translate(-160, 30)">
            <rect x="-50" y="-25" width="100" height="55" rx="6" fill="#ef4444" opacity="0.06" stroke="#ef4444" strokeWidth="0.8" />
            <text x="0" y="-12" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ef4444">1. Bind</text>
            {/* Membrane */}
            <line x1="-35" y1="15" x2="35" y2="15" stroke="#60a5fa" strokeWidth="3" opacity="0.4" />
            {/* Melittin arrow */}
            <polygon points="0,-5 -5,5 5,5" fill="#f59e0b" opacity="0.7" />
            <line x1="0" y1="5" x2="0" y2="12" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="0" y="35" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Sticks to membrane</text>
          </g>

          {/* Step 2: Insert into membrane */}
          <g transform="translate(0, 30)">
            <rect x="-50" y="-25" width="100" height="55" rx="6" fill="#ef4444" opacity="0.06" stroke="#ef4444" strokeWidth="0.8" />
            <text x="0" y="-12" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ef4444">2. Insert</text>
            {/* Membrane with melittin inserted */}
            <line x1="-35" y1="15" x2="-8" y2="15" stroke="#60a5fa" strokeWidth="3" opacity="0.4" />
            <line x1="8" y1="15" x2="35" y2="15" stroke="#60a5fa" strokeWidth="3" opacity="0.4" />
            <rect x="-5" y="5" width="10" height="18" rx="2" fill="#f59e0b" opacity="0.7" />
            <text x="0" y="35" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Punches through</text>
          </g>

          {/* Step 3: Form pores */}
          <g transform="translate(160, 30)">
            <rect x="-50" y="-25" width="100" height="55" rx="6" fill="#ef4444" opacity="0.06" stroke="#ef4444" strokeWidth="0.8" />
            <text x="0" y="-12" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ef4444">3. Pore</text>
            {/* Membrane with pore */}
            <line x1="-35" y1="12" x2="-12" y2="12" stroke="#60a5fa" strokeWidth="3" opacity="0.4" />
            <line x1="12" y1="12" x2="35" y2="12" stroke="#60a5fa" strokeWidth="3" opacity="0.4" />
            {/* Pore opening with leaking contents */}
            <circle cx="-12" cy="15" r="3" fill="#f59e0b" opacity="0.6" />
            <circle cx="12" cy="15" r="3" fill="#f59e0b" opacity="0.6" />
            {/* Leaking */}
            <circle cx="-3" cy="20" r="2" fill="#22c55e" opacity="0.4" />
            <circle cx="3" cy="8" r="2" fill="#22c55e" opacity="0.4" />
            <circle cx="0" cy="25" r="1.5" fill="#22c55e" opacity="0.3" />
            <text x="0" y="35" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Cell contents leak</text>
          </g>

          {/* Arrows between steps */}
          <line x1="-100" y1="30" x2="-60" y2="30" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" />
          <polygon points="-60,30 -66,27 -66,33" fill="#ef4444" opacity="0.4" />
          <line x1="60" y1="30" x2="100" y2="30" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" />
          <polygon points="100,30 94,27 94,33" fill="#ef4444" opacity="0.4" />
        </g>

        {/* Venom composition — bottom */}
        <g transform="translate(260, 350)">
          <text x="0" y="-15" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Venom Composition</text>

          {[
            { label: "Melittin", pct: 50, color: "#ef4444" },
            { label: "Phospholipase", pct: 12, color: "#f59e0b" },
            { label: "Apamin", pct: 3, color: "#eab308" },
            { label: "Histamine", pct: 1, color: "#a855f7" },
            { label: "Other", pct: 34, color: "#64748b" },
          ].map((comp, i) => {
            const startX = -200;
            const totalW = 400;
            const prevWidth = [0, 50, 62, 65, 66].slice(0, i).reduce((a, b) => a + b, 0);
            const w = (comp.pct / 100) * totalW;
            return (
              <g key={i}>
                <rect x={startX + (prevWidth / 100) * totalW} y="0" width={w} height="14" fill={comp.color} opacity="0.5" />
                {w > 30 && (
                  <text x={startX + (prevWidth / 100) * totalW + w / 2} y="10" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">
                    {comp.label} {comp.pct}%
                  </text>
                )}
              </g>
            );
          })}

          <text x="0" y="30" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">
            Medical research: melittin shows promise against cancer cells and HIV
          </text>
        </g>
      </svg>
    </div>
  );
}
