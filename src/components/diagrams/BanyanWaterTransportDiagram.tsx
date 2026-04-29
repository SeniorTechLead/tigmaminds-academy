export default function BanyanWaterTransportDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 555 455" className="w-full max-w-2xl mx-auto" role="img" aria-label="Water transport in a tree showing xylem carrying water up and phloem carrying sugars down">
        <rect width="500" height="420" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Water &amp; Sugar Transport</text>

        {/* Canopy */}
        <ellipse cx="250" cy="80" rx="110" ry="50" className="fill-green-700" opacity="0.7" />
        <text x="250" y="75" textAnchor="middle" className="fill-green-200" fontSize="9" fontWeight="bold">Leaves</text>
        <text x="250" y="88" textAnchor="middle" className="fill-green-300" fontSize="8">Transpiration pulls water up</text>

        {/* Evaporation arrows from canopy */}
        {[180, 220, 260, 300].map((x, i) => (
          <g key={i}>
            <line x1={x} y1={45} x2={x} y2={30} className="stroke-blue-400" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#waterEvapArrow)">
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1.5s" repeatCount="indefinite" />
            </line>
          </g>
        ))}
        <text x="250" y="25" textAnchor="middle" className="fill-blue-400" fontSize="8">Water vapor escapes</text>

        {/* Tree trunk - split view */}
        <rect x="210" y="120" width="80" height="200" rx="6" className="fill-amber-800" />

        {/* Xylem (left half of trunk) */}
        <rect x="215" y="125" width="32" height="190" rx="3" className="fill-blue-900" opacity="0.6" />
        <text x="231" y="220" textAnchor="middle" className="fill-blue-300" fontSize="10" fontWeight="bold" transform="rotate(-90, 231, 220)">XYLEM</text>

        {/* Phloem (right half of trunk) */}
        <rect x="253" y="125" width="32" height="190" rx="3" className="fill-amber-900" opacity="0.6" />
        <text x="269" y="220" textAnchor="middle" className="fill-amber-300" fontSize="10" fontWeight="bold" transform="rotate(-90, 269, 220)">PHLOEM</text>

        {/* Water going UP through xylem */}
        {[280, 250, 220, 190, 160].map((y, i) => (
          <g key={`up-${i}`}>
            <circle cx="231" cy={y} r="4" className="fill-blue-400" opacity="0.7">
              <animate attributeName="cy" from={y + 20} to={y - 20} dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Sugars going DOWN through phloem */}
        {[160, 190, 220, 250, 280].map((y, i) => (
          <g key={`down-${i}`}>
            <circle cx="269" cy={y} r="4" className="fill-amber-400" opacity="0.7">
              <animate attributeName="cy" from={y - 20} to={y + 20} dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Left label: Water UP */}
        <g>
          <line x1="210" y1="180" x2="100" y2="180" className="stroke-blue-400" strokeWidth="1" />
          <rect x="30" y="165" width="75" height="36" rx="6" className="fill-blue-900" />
          <text x="67" y="180" textAnchor="middle" className="fill-blue-300" fontSize="9" fontWeight="bold">Water ↑</text>
          <text x="67" y="193" textAnchor="middle" className="fill-blue-400" fontSize="8">(H₂O + minerals)</text>
        </g>

        {/* Right label: Sugar DOWN */}
        <g>
          <line x1="290" y1="220" x2="380" y2="220" className="stroke-amber-400" strokeWidth="1" />
          <rect x="380" y="205" width="90" height="36" rx="6" className="fill-amber-900" />
          <text x="425" y="220" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Sugar ↓</text>
          <text x="425" y="233" textAnchor="middle" className="fill-amber-400" fontSize="8">(glucose to roots)</text>
        </g>

        {/* UP arrow */}
        <line x1="231" y1="310" x2="231" y2="130" className="stroke-blue-400" strokeWidth="2" markerEnd="url(#waterUpArrow)" />

        {/* DOWN arrow */}
        <line x1="269" y1="130" x2="269" y2="310" className="stroke-amber-400" strokeWidth="2" markerEnd="url(#sugarDownArrow)" />

        {/* Roots */}
        <path d="M 220,320 Q 170,340 80,360" className="stroke-amber-700" strokeWidth="3" fill="none" />
        <path d="M 280,320 Q 330,340 420,360" className="stroke-amber-700" strokeWidth="3" fill="none" />
        <text x="80" y="375" className="fill-blue-400" fontSize="8">Roots absorb water</text>
        <text x="420" y="375" textAnchor="end" className="fill-amber-400" fontSize="8">Roots receive sugar</text>

        {/* Ground line */}
        <line x1="50" y1="320" x2="450" y2="320" className="stroke-amber-800" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Summary */}
        <text x="250" y="405" textAnchor="middle" className="fill-green-300" fontSize="9">Transpiration pull: water travels up to 100 m in tall trees</text>

        <defs>
          <marker id="waterUpArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 6, 4 0, 8 6" className="fill-blue-400" />
          </marker>
          <marker id="sugarDownArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 4 6, 8 0" className="fill-amber-400" />
          </marker>
          <marker id="waterEvapArrow" markerWidth="6" markerHeight="5" refX="3" refY="0" orient="auto">
            <polygon points="0 5, 3 0, 6 5" className="fill-blue-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
