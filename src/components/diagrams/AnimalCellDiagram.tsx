export default function AnimalCellDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 572 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Animal cell diagram">
        <defs>
          <marker id="cell-arrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Cell membrane — double line (phospholipid bilayer) */}
        <ellipse cx="250" cy="200" rx="220" ry="170" fill="none" className="stroke-amber-700 dark:stroke-amber-400" strokeWidth="4" />
        <ellipse cx="250" cy="200" rx="215" ry="165" fill="none" className="stroke-amber-700 dark:stroke-amber-400" strokeWidth="1.5" />

        {/* Cytoplasm fill */}
        <ellipse cx="250" cy="200" rx="212" ry="162" className="fill-sky-100 dark:fill-sky-900" opacity="0.5" />

        {/* Nucleus */}
        <ellipse cx="250" cy="195" rx="60" ry="50" className="fill-indigo-300 dark:fill-indigo-700" opacity="0.8" />
        <ellipse cx="250" cy="195" rx="60" ry="50" fill="none" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2.5" />
        {/* Nucleolus */}
        <circle cx="240" cy="175" r="14" className="fill-indigo-500 dark:fill-indigo-400" opacity="0.7" />
        <text x="250" y="210" textAnchor="middle" className="fill-indigo-900 dark:fill-indigo-200" fontSize="11" fontWeight="bold">Nucleus</text>

        {/* Rough ER — wavy lines with dots (ribosomes), near nucleus */}
        <path d="M 145,150 Q 135,160 145,170 Q 155,180 145,190 Q 135,200 145,210"
          fill="none" className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2" />
        <path d="M 155,145 Q 145,155 155,165 Q 165,175 155,185 Q 145,195 155,205"
          fill="none" className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2" />
        {/* Ribosomes (dots on rough ER) */}
        {[150, 160, 170, 180, 190, 200, 210].map(y => (
          <circle key={`rib1-${y}`} cx={y % 20 === 0 ? 143 : 147} cy={y} r="2" className="fill-purple-700 dark:fill-purple-300" />
        ))}
        {[145, 155, 165, 175, 185, 195, 205].map(y => (
          <circle key={`rib2-${y}`} cx={y % 20 === 5 ? 153 : 157} cy={y} r="2" className="fill-purple-700 dark:fill-purple-300" />
        ))}

        {/* Smooth ER — wavy lines without dots */}
        <path d="M 130,230 Q 120,240 130,250 Q 140,260 130,270"
          fill="none" className="stroke-purple-400 dark:stroke-purple-300" strokeWidth="2" />
        <path d="M 140,225 Q 130,235 140,245 Q 150,255 140,265"
          fill="none" className="stroke-purple-400 dark:stroke-purple-300" strokeWidth="2" />

        {/* Mitochondria (bean-shaped, top-right area) */}
        <ellipse cx="370" cy="150" rx="28" ry="14" transform="rotate(-20, 370, 150)" className="fill-red-400 dark:fill-red-600" opacity="0.8" />
        <path d="M 348,147 Q 360,140 370,147 Q 380,140 390,147" fill="none" className="stroke-red-700 dark:stroke-red-300" strokeWidth="1" />
        <ellipse cx="370" cy="150" rx="28" ry="14" transform="rotate(-20, 370, 150)" fill="none" className="stroke-red-700 dark:stroke-red-400" strokeWidth="2" />

        {/* Second mitochondrion (bottom-left) */}
        <ellipse cx="160" cy="300" rx="24" ry="12" transform="rotate(15, 160, 300)" className="fill-orange-400 dark:fill-orange-600" opacity="0.8" />
        <path d="M 140,298 Q 150,292 160,298 Q 170,292 178,298" fill="none" className="stroke-red-700 dark:stroke-red-300" strokeWidth="1" />
        <ellipse cx="160" cy="300" rx="24" ry="12" transform="rotate(15, 160, 300)" fill="none" className="stroke-red-700 dark:stroke-red-400" strokeWidth="2" />

        {/* Golgi apparatus — stacked pancakes (right side) */}
        {[0, 18, 36, 54].map(dy => (
          <ellipse key={`golgi-${dy}`} cx={350 - dy * 0.5} cy={250 + dy} rx={30 - dy * 0.3} ry="5"
            className="fill-yellow-300 dark:fill-yellow-600" stroke="#b8860b" strokeWidth="1.2" />
        ))}

        {/* Lysosomes — small circles */}
        <circle cx="300" cy="310" r="10" className="fill-emerald-400 dark:fill-emerald-600" opacity="0.8" />
        <circle cx="300" cy="310" r="10" fill="none" className="stroke-emerald-700 dark:stroke-emerald-400" strokeWidth="1.5" />
        <circle cx="400" cy="230" r="9" className="fill-emerald-400 dark:fill-emerald-600" opacity="0.8" />
        <circle cx="400" cy="230" r="9" fill="none" className="stroke-emerald-700 dark:stroke-emerald-400" strokeWidth="1.5" />

        {/* ---- LABELS WITH LEADER LINES ---- */}

        {/* Cell membrane label */}
        <line x1="470" y1="120" x2="450" y2="80" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" markerEnd="url(#cell-arrow)" />
        <text x="410" y="75" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Cell membrane</text>

        {/* Nucleus label */}
        <line x1="250" y1="145" x2="250" y2="105" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="250" y="100" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Nucleus</text>

        {/* Nucleolus label */}
        <line x1="270" y1="180" x2="320" y2="135" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="322" y="133" className="fill-gray-700 dark:fill-gray-300" fontSize="10">Nucleolus</text>

        {/* Rough ER label */}
        <line x1="145" y1="155" x2="80" y2="115" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="78" y="113" textAnchor="end" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Rough ER</text>

        {/* Smooth ER label */}
        <line x1="130" y1="245" x2="55" y2="260" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="53" y="258" textAnchor="end" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Smooth ER</text>

        {/* Mitochondria label */}
        <line x1="390" y1="140" x2="440" y2="110" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="442" y="108" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Mitochondria</text>

        {/* Golgi apparatus label */}
        <line x1="380" y1="265" x2="430" y2="290" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="432" y="295" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Golgi apparatus</text>

        {/* Lysosome label */}
        <line x1="300" y1="325" x2="300" y2="355" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x="300" y="367" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">Lysosome</text>

        {/* Cytoplasm label */}
        <text x="200" y="340" className="fill-sky-600 dark:fill-sky-300" fontSize="10" fontStyle="italic">Cytoplasm</text>

        {/* Title */}
        <text x="250" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Animal Cell</text>
      </svg>
    </div>
  );
}
