export default function BabelSkyscraperDiagram() {
  return (
    <svg viewBox="0 0 520 380" className="w-full max-w-2xl mx-auto">
      <text x="260" y="22" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">Modern Skyscraper Anatomy</text>

      {/* Ground line */}
      <rect x="0" y="330" width="520" height="50" fill="#374151" />

      {/* Building outer shell */}
      <rect x="180" y="40" width="160" height="290" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600"  strokeWidth="2" rx="4" />

      {/* Core (inner rectangle) */}
      <rect x="240" y="50" width="40" height="280" fill="#334155" stroke="#60a5fa" strokeWidth="1.5" rx="2" />
      <text x="260" y="190" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold" transform="rotate(-90 260 190)">STEEL CORE</text>

      {/* Floor beams radiating from core */}
      {[80, 120, 160, 200, 240, 280].map((y, i) => (
        <g key={i}>
          <line x1="240" y1={y} x2="185" y2={y} stroke="#94a3b8" strokeWidth="1" />
          <line x1="280" y1={y} x2="335" y2={y} stroke="#94a3b8" strokeWidth="1" />
        </g>
      ))}

      {/* Cross bracing on left */}
      <line x1="185" y1="80" x2="235" y2="160" stroke="#fbbf24" strokeWidth="1.5" />
      <line x1="235" y1="80" x2="185" y2="160" stroke="#fbbf24" strokeWidth="1.5" />
      <line x1="185" y1="200" x2="235" y2="280" stroke="#fbbf24" strokeWidth="1.5" />
      <line x1="235" y1="200" x2="185" y2="280" stroke="#fbbf24" strokeWidth="1.5" />

      {/* Cross bracing on right */}
      <line x1="285" y1="80" x2="335" y2="160" stroke="#fbbf24" strokeWidth="1.5" />
      <line x1="335" y1="80" x2="285" y2="160" stroke="#fbbf24" strokeWidth="1.5" />
      <line x1="285" y1="200" x2="335" y2="280" stroke="#fbbf24" strokeWidth="1.5" />
      <line x1="335" y1="200" x2="285" y2="280" stroke="#fbbf24" strokeWidth="1.5" />

      {/* Foundation below ground */}
      <rect x="160" y="330" width="200" height="40" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5" rx="3" />
      <text x="260" y="355" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold">Deep foundation (piles)</text>

      {/* Wind force */}
      <g>
        <line x1="80" y1="100" x2="175" y2="100" stroke="#ef4444" strokeWidth="2" markerEnd="url(#bsArrowRed)" />
        <line x1="90" y1="150" x2="175" y2="150" stroke="#ef4444" strokeWidth="2" markerEnd="url(#bsArrowRed)" />
        <line x1="100" y1="200" x2="175" y2="200" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#bsArrowRed)" />
        <text x="70" y="85" fill="#ef4444" fontSize="11" fontWeight="bold">Wind</text>
        <text x="60" y="98" fill="#ef4444" fontSize="10">Strongest</text>
        <text x="60" y="111" fill="#ef4444" fontSize="10">at top</text>
      </g>

      {/* Labels — right side */}
      <g>
        {/* Curtain wall */}
        <line x1="340" y1="60" x2="380" y2="60" stroke="#94a3b8" strokeWidth="0.5" />
        <text x="385" y="55" fill="#d1d5db" fontSize="10" fontWeight="bold">Glass curtain wall</text>
        <text x="385" y="68" fill="#9ca3af" fontSize="10">Non-structural skin</text>

        {/* Bracing */}
        <line x1="340" y1="130" x2="380" y2="130" stroke="#fbbf24" strokeWidth="0.5" />
        <text x="385" y="125" fill="#fbbf24" fontSize="10" fontWeight="bold">Diagonal bracing</text>
        <text x="385" y="138" fill="#9ca3af" fontSize="10">Resists shear from wind</text>

        {/* Core label */}
        <line x1="340" y1="200" x2="380" y2="200" stroke="#60a5fa" strokeWidth="0.5" />
        <text x="385" y="195" fill="#60a5fa" fontSize="10" fontWeight="bold">Central core</text>
        <text x="385" y="208" fill="#9ca3af" fontSize="10">Handles compression</text>

        {/* Floor label */}
        <line x1="340" y1="240" x2="380" y2="240" stroke="#94a3b8" strokeWidth="0.5" />
        <text x="385" y="235" fill="#d1d5db" fontSize="10" fontWeight="bold">Floor beams</text>
        <text x="385" y="248" fill="#9ca3af" fontSize="10">Handle tension + load</text>
      </g>

      {/* Weight arrow */}
      <line x1="260" y1="35" x2="260" y2="325" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 3" />
      <text x="155" y="325" fill="#22c55e" fontSize="10">Gravity path → core → foundation → bedrock</text>

      <defs>
        <marker id="bsArrowRed" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}
