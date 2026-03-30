export default function BacteriaStructureDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 505 340" className="w-full max-w-lg mx-auto" role="img" aria-label="Bacteria structure diagram">
        <defs>
          <marker id="bacLabel" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" className="fill-gray-400" />
          </marker>
        </defs>

        {/* Title */}
        <text x="225" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Bacterial Cell Structure
        </text>

        {/* Flagellum */}
        <path d="M 100,150 Q 70,130 55,150 Q 40,170 25,150 Q 10,130 0,150"
          fill="none" className="stroke-purple-400 dark:stroke-purple-300" strokeWidth="2" />

        {/* Pili (thin hair-like) */}
        {[40, 60, 80, 240, 260, 280].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 225;
          const cy = 150;
          const r1x = 110;
          const r1y = 60;
          const sx = cx + (r1x + 2) * Math.cos(rad);
          const sy = cy + (r1y + 2) * Math.sin(rad);
          const ex = cx + (r1x + 25) * Math.cos(rad);
          const ey = cy + (r1y + 25) * Math.sin(rad);
          return <line key={i} x1={sx} y1={sy} x2={ex} y2={ey}
            className="stroke-pink-400 dark:stroke-pink-300" strokeWidth="1" />;
        })}

        {/* Cell wall (outer) */}
        <ellipse cx="225" cy="150" rx="115" ry="65"
          className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-500 dark:stroke-amber-400" strokeWidth="3" />

        {/* Cell membrane (inner, slightly smaller) */}
        <ellipse cx="225" cy="150" rx="105" ry="57"
          className="fill-emerald-100 dark:fill-emerald-900/20 stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" strokeDasharray="4,2" />

        {/* Cytoplasm fill */}
        <ellipse cx="225" cy="150" rx="100" ry="53"
          className="fill-sky-50 dark:fill-sky-900/20" />

        {/* Nucleoid (irregular DNA region) */}
        <path d="M 190,135 Q 210,115 240,125 Q 260,135 250,155 Q 240,170 215,165 Q 195,155 190,135 Z"
          className="fill-blue-200 dark:fill-blue-800/40 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
        {/* DNA strands inside nucleoid */}
        <path d="M 200,140 Q 220,130 235,140 Q 245,148 230,155 Q 215,160 205,150"
          fill="none" className="stroke-blue-600 dark:stroke-blue-300" strokeWidth="1" />

        {/* Plasmid (small circle) */}
        <circle cx="290" cy="155" r="12" fill="none"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
        <path d="M 282,148 Q 290,142 298,148" fill="none" className="stroke-red-400" strokeWidth="1" />

        {/* Ribosomes (small dots) */}
        {[[160, 140], [175, 165], [165, 155], [270, 135], [285, 170], [310, 145], [180, 130], [155, 160]].map(([rx, ry], i) => (
          <circle key={i} cx={rx} cy={ry} r="3" className="fill-gray-600 dark:fill-gray-400" />
        ))}

        {/* Label lines and text */}
        {/* Cell wall */}
        <line x1="340" y1="100" x2="310" y2="115" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#bacLabel)" />
        <text x="345" y="100" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="600">Cell wall</text>

        {/* Cell membrane */}
        <line x1="370" y1="130" x2="325" y2="140" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#bacLabel)" />
        <text x="375" y="130" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="600">Cell membrane</text>

        {/* Cytoplasm */}
        <line x1="370" y1="160" x2="305" y2="158" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#bacLabel)" />
        <text x="375" y="160" className="fill-sky-600 dark:fill-sky-400" fontSize="10" fontWeight="600">Cytoplasm</text>

        {/* Nucleoid */}
        <line x1="370" y1="190" x2="255" y2="155" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#bacLabel)" />
        <text x="375" y="190" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="600">Nucleoid (DNA)</text>

        {/* Ribosomes */}
        <line x1="90" y1="230" x2="158" y2="162" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#bacLabel)" />
        <text x="30" y="235" className="fill-gray-600 dark:fill-gray-400" fontSize="10" fontWeight="600">Ribosomes</text>

        {/* Plasmid */}
        <line x1="370" y1="220" x2="302" y2="160" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#bacLabel)" />
        <text x="375" y="220" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="600">Plasmid</text>

        {/* Flagellum */}
        <line x1="30" y1="230" x2="35" y2="160" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#bacLabel)" />
        <text x="10" y="245" className="fill-purple-600 dark:fill-purple-400" fontSize="10" fontWeight="600">Flagellum</text>

        {/* Pili */}
        <line x1="90" y1="260" x2="175" y2="205" className="stroke-gray-400" strokeWidth="1" markerEnd="url(#bacLabel)" />
        <text x="55" y="268" className="fill-pink-600 dark:fill-pink-400" fontSize="10" fontWeight="600">Pili</text>

        {/* Type label */}
        <text x="225" y="290" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Rod-shaped (bacillus) bacterium
        </text>
      </svg>
    </div>
  );
}
