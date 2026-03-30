export default function BabelBucklingDiagram() {
  return (
    <svg viewBox="0 0 520 360" className="w-full max-w-lg mx-auto">
      <text x="260" y="22" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">Why Tall Buildings Need Wide Bases</text>

      {/* Ground */}
      <rect x="0" y="310" width="520" height="50" fill="#374151" />

      {/* LEFT: Narrow tower — unstable */}
      <g>
        {/* Tower body (narrow) */}
        <rect x="75" y="80" width="30" height="230" fill="#92400e" stroke="#b45309" strokeWidth="1.5" rx="2" />
        {/* Cracks */}
        <line x1="80" y1="200" x2="95" y2="210" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="100" y1="160" x2="85" y2="175" stroke="#ef4444" strokeWidth="1.5" />
        {/* Lean arrow */}
        <path d="M 90 60 Q 115 50 120 80" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" markerEnd="url(#bbArrowRed)" />
        <text x="130" y="65" fill="#ef4444" fontSize="10">Topples!</text>
        {/* Dimensions */}
        <line x1="60" y1="80" x2="60" y2="310" stroke="#9ca3af" strokeWidth="0.5" />
        <text x="50" y="200" textAnchor="middle" fill="#9ca3af" fontSize="10" transform="rotate(-90 50 200)">230 m</text>
        <line x1="75" y1="318" x2="105" y2="318" stroke="#9ca3af" strokeWidth="0.5" />
        <text x="90" y="336" textAnchor="middle" fill="#9ca3af" fontSize="10">30 m</text>
        {/* Ratio */}
        <text x="90" y="50" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Ratio 7.7:1</text>
        <text x="90" y="345" textAnchor="middle" fill="#ef4444" fontSize="10">UNSTABLE</text>
      </g>

      {/* CENTRE: Pyramid — stable */}
      <g>
        <polygon points="260,80 210,310 310,310" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
        {/* Compression arrows down the sides */}
        <line x1="235" y1="195" x2="225" y2="250" stroke="#22c55e" strokeWidth="2" markerEnd="url(#bbArrowGreen)" />
        <line x1="285" y1="195" x2="295" y2="250" stroke="#22c55e" strokeWidth="2" markerEnd="url(#bbArrowGreen)" />
        <text x="260" y="220" textAnchor="middle" fill="white" fontSize="10">Forces spread</text>
        <text x="260" y="233" textAnchor="middle" fill="white" fontSize="10">outward</text>
        {/* Dimensions */}
        <text x="260" y="50" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">Ratio 1.1:1</text>
        <line x1="210" y1="318" x2="310" y2="318" stroke="#9ca3af" strokeWidth="0.5" />
        <text x="260" y="336" textAnchor="middle" fill="#9ca3af" fontSize="10">100 m base</text>
        <text x="260" y="345" textAnchor="middle" fill="#22c55e" fontSize="10">EXTREMELY STABLE</text>
      </g>

      {/* RIGHT: Modern tapered tower — efficient */}
      <g>
        {/* Tapered shape */}
        <polygon points="430,80 435,85 445,310 415,310 425,85" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5" />
        {/* Wider base extension */}
        <polygon points="415,310 445,310 455,310 405,310" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1" />
        <rect x="400" y="280" width="60" height="30" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5" rx="2" />
        {/* Cross bracing */}
        <line x1="420" y1="130" x2="440" y2="180" stroke="#60a5fa" strokeWidth="0.8" opacity="0.5" />
        <line x1="440" y1="130" x2="420" y2="180" stroke="#60a5fa" strokeWidth="0.8" opacity="0.5" />
        <line x1="418" y1="200" x2="442" y2="250" stroke="#60a5fa" strokeWidth="0.8" opacity="0.5" />
        <line x1="442" y1="200" x2="418" y2="250" stroke="#60a5fa" strokeWidth="0.8" opacity="0.5" />
        <text x="430" y="50" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">Ratio 3.8:1</text>
        <text x="430" y="65" textAnchor="middle" fill="#d1d5db" fontSize="10">Tapered + braced</text>
        <text x="430" y="345" textAnchor="middle" fill="#60a5fa" fontSize="10">MODERN SOLUTION</text>
      </g>

      {/* Formula */}
      <text x="260" y="285" textAnchor="middle" fill="#d1d5db" fontSize="11">Euler buckling: P = π²EI / L² — halve length, 4× the strength</text>

      <defs>
        <marker id="bbArrowRed" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
        </marker>
        <marker id="bbArrowGreen" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
        </marker>
      </defs>
    </svg>
  );
}
