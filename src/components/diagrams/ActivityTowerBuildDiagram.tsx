export default function ActivityTowerBuildDiagram() {
  return (
    <svg viewBox="0 0 520 340" className="w-full max-w-2xl mx-auto">
      <text x="260" y="22" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">Spaghetti Tower Challenge</text>

      {/* Ground */}
      <rect x="0" y="290" width="520" height="50" fill="#374151" />

      {/* LEFT: Bad design — narrow and tall */}
      <g>
        <line x1="90" y1="100" x2="90" y2="290" stroke="#b45309" strokeWidth="2" />
        <line x1="110" y1="100" x2="110" y2="290" stroke="#b45309" strokeWidth="2" />
        {/* Horizontal ties */}
        <line x1="90" y1="150" x2="110" y2="150" stroke="#b45309" strokeWidth="1.5" />
        <line x1="90" y1="200" x2="110" y2="200" stroke="#b45309" strokeWidth="1.5" />
        <line x1="90" y1="250" x2="110" y2="250" stroke="#b45309" strokeWidth="1.5" />
        {/* Marshmallow */}
        <circle cx="100" cy="90" r="12" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="100" y="75" textAnchor="middle" fill="#f59e0b" fontSize="10">Marshmallow</text>
        {/* X mark */}
        <text x="100" y="315" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">WEAK</text>
        <text x="100" y="330" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">No triangles</text>
        {/* Wobble arrows */}
        <path d="M 70 180 Q 60 170 70 160" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3" />
        <text x="50" y="175" fill="#ef4444" fontSize="10">wobble</text>
      </g>

      {/* CENTRE: Good design — triangulated */}
      <g>
        {/* Wide base */}
        <line x1="220" y1="290" x2="260" y2="160" stroke="#b45309" strokeWidth="2" />
        <line x1="300" y1="290" x2="260" y2="160" stroke="#b45309" strokeWidth="2" />
        <line x1="220" y1="290" x2="300" y2="290" stroke="#b45309" strokeWidth="2" />
        {/* Middle triangle */}
        <line x1="235" y1="240" x2="285" y2="240" stroke="#b45309" strokeWidth="1.5" />
        <line x1="235" y1="240" x2="260" y2="190" stroke="#b45309" strokeWidth="1.5" />
        <line x1="285" y1="240" x2="260" y2="190" stroke="#b45309" strokeWidth="1.5" />
        {/* Top section */}
        <line x1="260" y1="160" x2="260" y2="100" stroke="#b45309" strokeWidth="2" />
        <line x1="248" y1="160" x2="260" y2="100" stroke="#b45309" strokeWidth="1.5" />
        <line x1="272" y1="160" x2="260" y2="100" stroke="#b45309" strokeWidth="1.5" />
        {/* Marshmallow */}
        <circle cx="260" cy="88" r="12" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Checkmark */}
        <text x="260" y="315" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">STRONG</text>
        <text x="260" y="330" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Triangle = rigid</text>
      </g>

      {/* RIGHT: Why triangles work */}
      <g>
        <text x="420" y="75" textAnchor="middle" className="fill-gray-400 dark:fill-gray-400" fontSize="11" fontWeight="bold">Why Triangles?</text>

        {/* Square — deforms */}
        <rect x="380" y="100" width="40" height="40" fill="none" stroke="#ef4444" strokeWidth="2" rx="1" />
        <text x="400" y="158" textAnchor="middle" fill="#ef4444" fontSize="10">Square collapses</text>
        {/* Push arrow */}
        <line x1="425" y1="115" x2="435" y2="115" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#atArrowRed)" />
        {/* Deformed shape */}
        <polygon points="440,100 490,108 482,148 432,140" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3" />

        {/* Triangle — rigid */}
        <polygon points="400,190 380,240 420,240" fill="none" stroke="#22c55e" strokeWidth="2" />
        <text x="400" y="258" textAnchor="middle" fill="#22c55e" fontSize="10">Triangle is rigid</text>
        {/* Push arrow */}
        <line x1="425" y1="210" x2="435" y2="210" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#atArrowGreen)" />
        {/* Same shape */}
        <polygon points="460,190 440,240 480,240" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3" />
        <text x="470" y="210" fill="#22c55e" fontSize="10">Same!</text>
      </g>

      {/* Materials list */}
      <text x="420" y="280" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">You need:</text>
      <text x="420" y="295" textAnchor="middle" className="fill-gray-400 dark:fill-gray-400" fontSize="10">20 spaghetti + tape</text>
      <text x="420" y="308" textAnchor="middle" className="fill-gray-400 dark:fill-gray-400" fontSize="10">+ 1 marshmallow on top</text>

      <defs>
        <marker id="atArrowRed" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
        </marker>
        <marker id="atArrowGreen" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
        </marker>
      </defs>
    </svg>
  );
}
