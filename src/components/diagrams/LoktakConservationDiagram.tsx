export default function LoktakConservationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 440" className="w-full max-w-2xl mx-auto" role="img" aria-label="Conservation strategy diagram for Loktak Lake showing interconnected actions">
        <rect width="560" height="440" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="280" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34d399">Saving Loktak: A Conservation System</text>
        <text x="280" y="42" textAnchor="middle" fontSize="9" fill="#6ee7b7" opacity="0.7">Every action connects to every other</text>

        {/* Central node: Sangai survival */}
        <circle cx="280" cy="220" r="50" fill="#065f46" opacity="0.4" stroke="#34d399" strokeWidth="2" />
        <text x="280" y="215" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#34d399">Sangai</text>
        <text x="280" y="230" textAnchor="middle" fontSize="10" fill="#6ee7b7">Survival</text>

        {/* Outer nodes */}
        {/* 1. Water management (top) */}
        <circle cx="280" cy="80" r="40" fill="#1e3a5f" opacity="0.4" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="280" y="76" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#93c5fd">Water Level</text>
        <text x="280" y="90" textAnchor="middle" fontSize="8" fill="#7dd3fc">Management</text>
        <line x1="280" y1="120" x2="280" y2="170" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />

        {/* 2. Phumdi restoration (left) */}
        <circle cx="120" cy="150" r="40" fill="#166534" opacity="0.3" stroke="#22c55e" strokeWidth="1.5" />
        <text x="120" y="146" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#4ade80">Phumdi</text>
        <text x="120" y="160" textAnchor="middle" fontSize="8" fill="#22c55e">Restoration</text>
        <line x1="155" y1="170" x2="235" y2="200" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arrowGreen)" />

        {/* 3. Invasive species control (right) */}
        <circle cx="440" cy="150" r="40" fill="#7f1d1d" opacity="0.3" stroke="#f87171" strokeWidth="1.5" />
        <text x="440" y="146" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5">Invasive</text>
        <text x="440" y="160" textAnchor="middle" fontSize="8" fill="#f87171">Removal</text>
        <line x1="405" y1="170" x2="325" y2="200" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#arrowRed)" />

        {/* 4. Community livelihoods (bottom-left) */}
        <circle cx="140" cy="330" r="40" fill="#78350f" opacity="0.3" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="140" y="326" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fcd34d">Community</text>
        <text x="140" y="340" textAnchor="middle" fontSize="8" fill="#fbbf24">Livelihoods</text>
        <line x1="175" y1="310" x2="245" y2="250" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowYellow)" />

        {/* 5. Monitoring & research (bottom-right) */}
        <circle cx="420" cy="330" r="40" fill="#312e81" opacity="0.3" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="420" y="326" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#c4b5fd">Monitoring</text>
        <text x="420" y="340" textAnchor="middle" fontSize="8" fill="#a78bfa">& Research</text>
        <line x1="385" y1="310" x2="315" y2="250" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#arrowPurple)" />

        {/* Cross-connections (lighter, showing interconnection) */}
        {/* Water -> Phumdi */}
        <path d="M245,90 Q180,100 140,115" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="3,3" />
        {/* Water -> Invasive */}
        <path d="M315,90 Q380,100 420,115" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="3,3" />
        {/* Phumdi -> Community */}
        <path d="M120,190 Q120,260 130,290" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="3,3" />
        {/* Invasive -> Monitoring */}
        <path d="M440,190 Q440,260 430,290" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="3,3" />
        {/* Community -> Monitoring */}
        <path d="M180,340 Q280,360 380,340" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="3,3" />

        {/* Arrow markers */}
        <defs>
          <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill="#60a5fa" />
          </marker>
          <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill="#22c55e" />
          </marker>
          <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill="#f87171" />
          </marker>
          <marker id="arrowYellow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill="#fbbf24" />
          </marker>
          <marker id="arrowPurple" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill="#a78bfa" />
          </marker>
        </defs>

        {/* Key details in boxes at bottom */}
        <rect x="30" y="395" width="500" height="35" rx="6" fill="#065f46" opacity="0.2" />
        <text x="280" y="410" textAnchor="middle" fontSize="9" fill="#6ee7b7">Carrying capacity = f(phumdi area, thickness, food quality, water level, disturbance)</text>
        <text x="280" y="424" textAnchor="middle" fontSize="8" fill="#6ee7b7" opacity="0.7">Change any one factor and the maximum deer population shifts</text>
      </svg>
    </div>
  );
}
