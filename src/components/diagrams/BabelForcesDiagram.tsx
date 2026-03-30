export default function BabelForcesDiagram() {
  return (
    <svg viewBox="0 0 520 340" className="w-full max-w-lg mx-auto">
      {/* Title */}
      <text x="260" y="22" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">Three Forces Every Structure Must Handle</text>

      {/* Ground */}
      <rect x="0" y="300" width="520" height="40" fill="#374151" />
      <text x="260" y="330" textAnchor="middle" fill="#6b7280" fontSize="11">Ground</text>

      {/* COMPRESSION — left */}
      <g>
        <rect x="40" y="160" width="60" height="130" fill="#4b5563" stroke="#9ca3af" strokeWidth="1.5" rx="3" />
        <text x="70" y="230" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Stone</text>
        <text x="70" y="244" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Column</text>
        {/* Top force arrow down */}
        <line x1="70" y1="100" x2="70" y2="155" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#bfArrowRed)" />
        <text x="70" y="90" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Weight</text>
        {/* Bottom force arrow up */}
        <line x1="70" y1="300" x2="70" y2="295" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#bfArrowRed)" />
        {/* Squeeze arrows */}
        <line x1="30" y1="220" x2="38" y2="220" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#bfArrowYellow)" />
        <line x1="110" y1="220" x2="102" y2="220" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#bfArrowYellow)" />
        <text x="70" y="145" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">COMPRESSION</text>
        <text x="70" y="50" textAnchor="middle" fill="#d1d5db" fontSize="10">Squeezing force</text>
        <text x="70" y="63" textAnchor="middle" fill="#9ca3af" fontSize="10">Stone is excellent</text>
      </g>

      {/* TENSION — centre */}
      <g>
        {/* Two blocks with cable between them */}
        <rect x="195" y="180" width="30" height="30" fill="#4b5563" stroke="#9ca3af" strokeWidth="1.5" rx="2" />
        <rect x="295" y="180" width="30" height="30" fill="#4b5563" stroke="#9ca3af" strokeWidth="1.5" rx="2" />
        <line x1="225" y1="195" x2="295" y2="195" stroke="#60a5fa" strokeWidth="3" />
        {/* Pull-apart arrows */}
        <line x1="190" y1="195" x2="165" y2="195" stroke="#60a5fa" strokeWidth="2.5" markerEnd="url(#bfArrowBlue)" />
        <line x1="330" y1="195" x2="355" y2="195" stroke="#60a5fa" strokeWidth="2.5" markerEnd="url(#bfArrowBlue)" />
        <text x="260" y="145" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold">TENSION</text>
        <text x="260" y="50" textAnchor="middle" fill="#d1d5db" fontSize="10">Pulling-apart force</text>
        <text x="260" y="63" textAnchor="middle" fill="#9ca3af" fontSize="10">Steel cables are excellent</text>
        <text x="260" y="230" textAnchor="middle" fill="#60a5fa" fontSize="10">Cable stretched between anchors</text>
      </g>

      {/* SHEAR — right */}
      <g>
        {/* Two blocks sliding past each other */}
        <rect x="410" y="175" width="70" height="25" fill="#6b7280" stroke="#9ca3af" strokeWidth="1.5" rx="2" />
        <rect x="420" y="205" width="70" height="25" fill="#4b5563" stroke="#9ca3af" strokeWidth="1.5" rx="2" />
        {/* Opposing arrows */}
        <line x1="480" y1="187" x2="500" y2="187" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#bfArrowPurple)" />
        <line x1="420" y1="217" x2="400" y2="217" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#bfArrowPurple)" />
        <text x="450" y="145" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="bold">SHEAR</text>
        <text x="450" y="50" textAnchor="middle" fill="#d1d5db" fontSize="10">Sliding force</text>
        <text x="450" y="63" textAnchor="middle" fill="#9ca3af" fontSize="10">Wind on a tower</text>
        <text x="450" y="255" textAnchor="middle" fill="#a78bfa" fontSize="10">Layers slide past</text>
        <text x="450" y="268" textAnchor="middle" fill="#a78bfa" fontSize="10">each other</text>
      </g>

      {/* Key insight */}
      <text x="260" y="285" textAnchor="middle" fill="#d1d5db" fontSize="10">The Tower of Babel failed because ancient builders only understood compression.</text>

      <defs>
        <marker id="bfArrowRed" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
        </marker>
        <marker id="bfArrowYellow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#fbbf24" />
        </marker>
        <marker id="bfArrowBlue" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#60a5fa" />
        </marker>
        <marker id="bfArrowPurple" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#a78bfa" />
        </marker>
      </defs>
    </svg>
  );
}
