export default function MapGISLayersDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" role="img"
        aria-label="Diagram showing GIS map layers stacked on top of each other">
        <rect width="520" height="380" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          GIS: Stacking Map Layers
        </text>

        {/* Layer 5 (top) - Population density */}
        <g transform="translate(120, 50)">
          <path d="M 0 40 L 60 0 L 300 0 L 240 40 Z" fill="#7c3aed" opacity="0.25" stroke="#a78bfa" strokeWidth="1" />
          <circle cx="110" cy="15" r="12" fill="#a78bfa" opacity="0.4" />
          <circle cx="180" cy="10" r="8" fill="#a78bfa" opacity="0.3" />
          <circle cx="220" cy="20" r="6" fill="#a78bfa" opacity="0.25" />
          <text x="310" y="20" fontSize="11" fontWeight="bold" fill="#c4b5fd">Population density</text>
        </g>

        {/* Layer 4 - Forest cover */}
        <g transform="translate(120, 100)">
          <path d="M 0 40 L 60 0 L 300 0 L 240 40 Z" fill="#166534" opacity="0.3" stroke="#34d399" strokeWidth="1" />
          <rect x="80" y="8" width="50" height="20" rx="4" fill="#22c55e" opacity="0.4" />
          <rect x="170" y="5" width="40" height="25" rx="4" fill="#22c55e" opacity="0.3" />
          <text x="310" y="20" fontSize="11" fontWeight="bold" fill="#6ee7b7">Forest cover</text>
        </g>

        {/* Layer 3 - Elevation/terrain */}
        <g transform="translate(120, 150)">
          <path d="M 0 40 L 60 0 L 300 0 L 240 40 Z" fill="#92400e" opacity="0.25" stroke="#f59e0b" strokeWidth="1" />
          <path d="M 100 30 L 130 8 L 160 22 L 190 5 L 220 28" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="310" y="20" fontSize="11" fontWeight="bold" fill="#fde68a">Elevation</text>
        </g>

        {/* Layer 2 - Rivers/water */}
        <g transform="translate(120, 200)">
          <path d="M 0 40 L 60 0 L 300 0 L 240 40 Z" fill="#1e40af" opacity="0.25" stroke="#60a5fa" strokeWidth="1" />
          <path d="M 100 10 Q 140 25, 170 15 Q 200 5, 230 20" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <path d="M 140 30 Q 160 20, 190 28" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="310" y="20" fontSize="11" fontWeight="bold" fill="#93c5fd">Rivers and water</text>
        </g>

        {/* Layer 1 (bottom) - Roads */}
        <g transform="translate(120, 250)">
          <path d="M 0 40 L 60 0 L 300 0 L 240 40 Z" fill="#475569" opacity="0.3" stroke="#94a3b8" strokeWidth="1" />
          <line x1="80" y1="25" x2="230" y2="10" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="150" y1="5" x2="170" y2="35" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="310" y="20" fontSize="11" fontWeight="bold" fill="#cbd5e1">Roads</text>
        </g>

        {/* Vertical bracket showing all layers */}
        <line x1="100" y1="55" x2="100" y2="285" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" />
        <text x="50" y="170" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24" transform="rotate(-90, 50, 170)">
          Layers align geographically
        </text>

        {/* Question examples */}
        <rect x="30" y="310" width="460" height="60" rx="6" fill="none" stroke="#475569" strokeWidth="1" />
        <text x="260" y="328" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e2e8f0">GIS answers spatial questions by combining layers:</text>
        <text x="260" y="346" textAnchor="middle" fontSize="10" fill="#fbbf24">
          "Where are areas with high flood risk AND dense population?"
        </text>
        <text x="260" y="362" textAnchor="middle" fontSize="10" fill="#34d399">
          "Which villages are more than 10 km from the nearest hospital?"
        </text>
      </svg>
    </div>
  );
}
