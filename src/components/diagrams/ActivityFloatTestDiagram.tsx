export default function ActivityFloatTestDiagram() {
  return (
    <svg viewBox="0 0 500 260" className="w-full max-w-lg mx-auto">
      <text x="250" y="22" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">Activity: Tinfoil Boat Challenge</text>

      {/* Basin with water */}
      <rect x="50" y="120" width="400" height="100" rx="8" fill="#1e3a5f" opacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="250" y="210" textAnchor="middle" fill="#60a5fa" fontSize="9">Basin of water</text>

      {/* Boat 1 — flat bottom */}
      <g>
        <path d="M 90 130 L 85 155 L 155 155 L 150 130 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" />
        <text x="120" y="148" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="bold">Flat</text>
        {/* Coins */}
        <circle cx="105" cy="128" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <circle cx="117" cy="126" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <circle cx="129" cy="127" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <circle cx="137" cy="128" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <text x="120" y="112" textAnchor="middle" fill="#22c55e" fontSize="10">12 coins</text>
      </g>

      {/* Boat 2 — V-shape */}
      <g>
        <path d="M 210 130 L 220 160 L 280 160 L 290 130 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" />
        <path d="M 220 160 L 250 170 L 280 160" fill="none" stroke="#9ca3af" strokeWidth="1" />
        <text x="250" y="153" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="bold">V-hull</text>
        <circle cx="237" cy="128" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <circle cx="250" cy="126" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <circle cx="263" cy="128" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <text x="250" y="112" textAnchor="middle" fill="#f59e0b" fontSize="10">8 coins</text>
      </g>

      {/* Boat 3 — round */}
      <g>
        <ellipse cx="380" cy="148" rx="40" ry="18" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" />
        <text x="380" y="152" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="bold">Round</text>
        <circle cx="370" cy="133" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <circle cx="383" cy="131" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <circle cx="396" cy="133" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <text x="380" y="112" textAnchor="middle" fill="#f59e0b" fontSize="10">10 coins</text>
      </g>

      {/* Instructions */}
      <text x="250" y="55" textAnchor="middle" fill="#d1d5db" fontSize="10">30cm x 30cm foil sheet → shape → float → add coins until it sinks</text>
      <text x="250" y="72" textAnchor="middle" fill="#9ca3af" fontSize="9">Which hull design holds the most weight? That design displaces the most water.</text>

      {/* Waterline */}
      <line x1="50" y1="160" x2="450" y2="160" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="4 3" />
      <text x="460" y="163" fill="#60a5fa" fontSize="8">waterline</text>

      <text x="250" y="248" textAnchor="middle" fill="#22c55e" fontSize="10">The boat that displaces the most water wins — Archimedes in action!</text>
    </svg>
  );
}
