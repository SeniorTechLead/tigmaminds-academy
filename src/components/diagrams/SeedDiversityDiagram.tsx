export default function SeedDiversityDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Seed diversity comparison: monoculture versus diverse traditional farming">
        <rect width="520" height="420" rx="12" className="fill-white dark:fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" className="fill-emerald-400" fontSize="14" fontWeight="bold">Genetic Diversity in Crops</text>

        {/* LEFT: Monoculture */}
        <text x="135" y="56" textAnchor="middle" className="fill-red-400" fontSize="12" fontWeight="bold">Monoculture (Modern)</text>

        {/* Identical plants in rows */}
        {[0, 1, 2, 3, 4].map(row =>
          [0, 1, 2, 3].map(col => (
            <g key={`mono-${row}-${col}`} transform={`translate(${55 + col * 42}, ${72 + row * 50})`}>
              <line x1="10" y1="35" x2="10" y2="18" className="stroke-green-600" strokeWidth="2" />
              <ellipse cx="10" cy="14" rx="8" ry="6" className="fill-green-600" />
              <circle cx="10" cy="38" r="3" className="fill-amber-700" />
            </g>
          ))
        )}

        {/* Blight spreading */}
        <path d="M 60,140 Q 100,130 170,145 Q 200,160 220,180" className="stroke-red-500" strokeWidth="2" strokeDasharray="4,3" fill="none" />
        <text x="200" y="135" className="fill-red-400" fontSize="10">blight spreads</text>
        <text x="200" y="147" className="fill-red-400" fontSize="10">to ALL plants</text>

        {/* X marks on some plants */}
        {[[55, 170], [97, 220], [139, 170], [181, 220], [55, 270]].map(([cx, cy], i) => (
          <g key={`x-${i}`}>
            <line x1={cx + 4} y1={cy - 4} x2={cx + 16} y2={cy + 8} className="stroke-red-500" strokeWidth="2" />
            <line x1={cx + 16} y1={cy - 4} x2={cx + 4} y2={cy + 8} className="stroke-red-500" strokeWidth="2" />
          </g>
        ))}

        {/* Monoculture label */}
        <rect x="30" y="340" width="210" height="50" rx="6" className="fill-red-900/40" />
        <text x="135" y="358" textAnchor="middle" className="fill-red-300" fontSize="10">One variety = one weakness</text>
        <text x="135" y="374" textAnchor="middle" className="fill-red-300" fontSize="10">If disease strikes, everything dies</text>

        {/* Divider */}
        <line x1="260" y1="45" x2="260" y2="330" className="stroke-slate-600" strokeWidth="1" strokeDasharray="4,4" />

        {/* RIGHT: Traditional diverse farming */}
        <text x="390" y="56" textAnchor="middle" className="fill-emerald-400" fontSize="12" fontWeight="bold">Traditional Seed Keeping</text>

        {/* Diverse plants — different colors, shapes, sizes */}
        {/* Row 1: Tall rice varieties */}
        <g transform="translate(285, 72)">
          <line x1="10" y1="40" x2="10" y2="12" className="stroke-green-500" strokeWidth="2" />
          <ellipse cx="10" cy="8" rx="9" ry="5" className="fill-green-500" />
          <circle cx="10" cy="43" r="3" className="fill-amber-800" />
        </g>
        <g transform="translate(325, 72)">
          <line x1="10" y1="35" x2="10" y2="15" className="stroke-green-700" strokeWidth="2.5" />
          <ellipse cx="10" cy="11" rx="7" ry="7" className="fill-green-700" />
          <circle cx="10" cy="38" r="3.5" className="fill-gray-100 dark:fill-slate-800" />
        </g>
        <g transform="translate(365, 72)">
          <line x1="10" y1="30" x2="10" y2="14" className="stroke-lime-500" strokeWidth="1.5" />
          <ellipse cx="10" cy="10" rx="6" ry="5" className="fill-lime-500" />
          <circle cx="10" cy="33" r="2.5" className="fill-amber-600" />
        </g>
        <g transform="translate(405, 72)">
          <line x1="10" y1="38" x2="10" y2="10" className="stroke-emerald-600" strokeWidth="2" />
          <ellipse cx="10" cy="7" rx="10" ry="5" className="fill-emerald-600" />
          <circle cx="10" cy="41" r="3" className="fill-red-900" />
        </g>
        <g transform="translate(445, 72)">
          <line x1="10" y1="32" x2="10" y2="16" className="stroke-green-400" strokeWidth="2" />
          <ellipse cx="10" cy="12" rx="8" ry="6" className="fill-green-400" />
          <circle cx="10" cy="35" r="3" className="fill-amber-500" />
        </g>

        {/* Row 2: Different varieties */}
        <g transform="translate(285, 130)">
          <line x1="10" y1="35" x2="10" y2="16" className="stroke-yellow-600" strokeWidth="2" />
          <ellipse cx="10" cy="12" rx="7" ry="6" className="fill-yellow-600" />
          <circle cx="10" cy="38" r="3" className="fill-yellow-800" />
        </g>
        <g transform="translate(325, 130)">
          <line x1="10" y1="38" x2="10" y2="12" className="stroke-green-800" strokeWidth="2.5" />
          <ellipse cx="10" cy="8" rx="9" ry="6" className="fill-green-800" />
          <circle cx="10" cy="41" r="3.5" className="fill-amber-900" />
        </g>
        <g transform="translate(365, 130)">
          <line x1="10" y1="30" x2="10" y2="14" className="stroke-teal-500" strokeWidth="1.5" />
          <ellipse cx="10" cy="10" rx="6" ry="5" className="fill-teal-500" />
          <circle cx="10" cy="33" r="2.5" className="fill-teal-800" />
        </g>
        <g transform="translate(405, 130)">
          <line x1="10" y1="34" x2="10" y2="13" className="stroke-emerald-400" strokeWidth="2" />
          <ellipse cx="10" cy="10" rx="8" ry="5" className="fill-emerald-400" />
          <circle cx="10" cy="37" r="3" className="fill-amber-700" />
        </g>
        <g transform="translate(445, 130)">
          <line x1="10" y1="36" x2="10" y2="10" className="stroke-green-600" strokeWidth="2" />
          <ellipse cx="10" cy="7" rx="7" ry="6" className="fill-green-600" />
          <circle cx="10" cy="39" r="3" className="fill-slate-700" />
        </g>

        {/* Blight arrow — but only some affected */}
        <path d="M 310,200 Q 340,195 370,205" className="stroke-red-500" strokeWidth="2" strokeDasharray="4,3" fill="none" />

        {/* Shield icons on resistant plants */}
        {[325, 405, 445].map((cx, i) => (
          <g key={`shield-${i}`} transform={`translate(${cx}, 210)`}>
            <path d="M 10,0 L 18,4 L 18,12 Q 18,18 10,22 Q 2,18 2,12 L 2,4 Z" className="fill-emerald-500/40 stroke-emerald-400" strokeWidth="1" />
            <text x="10" y="15" textAnchor="middle" className="fill-emerald-300" fontSize="8">✓</text>
          </g>
        ))}

        {/* Some X marks — fewer than monoculture */}
        {[[285, 210], [365, 210]].map(([cx, cy], i) => (
          <g key={`xd-${i}`}>
            <line x1={cx + 4} y1={cy} x2={cx + 16} y2={cy + 12} className="stroke-red-400" strokeWidth="1.5" />
            <line x1={cx + 16} y1={cy} x2={cx + 4} y2={cy + 12} className="stroke-red-400" strokeWidth="1.5" />
          </g>
        ))}

        {/* Seed variety labels */}
        {[
          { x: 295, y: 265, label: 'Black rice', color: 'fill-slate-300' },
          { x: 335, y: 280, label: 'Sticky corn', color: 'fill-yellow-300' },
          { x: 375, y: 265, label: 'King chilli', color: 'fill-red-300' },
          { x: 415, y: 280, label: 'Wild bean', color: 'fill-green-300' },
          { x: 455, y: 265, label: 'Millet', color: 'fill-amber-300' },
        ].map((v, i) => (
          <text key={i} x={v.x} y={v.y} textAnchor="middle" className={v.color} fontSize="8">{v.label}</text>
        ))}

        {/* Diverse label */}
        <rect x="280" y="340" width="210" height="50" rx="6" className="fill-emerald-900/40" />
        <text x="385" y="358" textAnchor="middle" className="fill-emerald-300" fontSize="10">Many varieties = many defences</text>
        <text x="385" y="374" textAnchor="middle" className="fill-emerald-300" fontSize="10">Some survive any threat</text>

        {/* Irish Potato Famine callout */}
        <rect x="30" y="398" width="460" height="18" rx="4" className="fill-amber-900/30" />
        <text x="260" y="411" textAnchor="middle" className="fill-amber-300" fontSize="10">Ireland, 1845: one potato variety + one blight = 1 million deaths</text>
      </svg>
    </div>
  );
}
