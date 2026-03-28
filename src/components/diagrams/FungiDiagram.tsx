export default function FungiDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 400 350" className="w-full max-w-lg mx-auto" role="img" aria-label="Mushroom anatomy and fungi diagram">
        {/* Sky / above ground */}
        <rect x="0" y="0" width="400" height="180" className="fill-sky-50 dark:fill-gray-900" />

        {/* Ground line */}
        <rect x="0" y="180" width="400" height="170" rx="0" className="fill-amber-100 dark:fill-amber-950" />
        <line x1="0" y1="180" x2="400" y2="180" className="stroke-amber-400 dark:stroke-amber-700" strokeWidth="2" />
        <text x="380" y="195" textAnchor="end" className="fill-amber-600 dark:fill-amber-400" fontSize="10">Soil</text>

        {/* Mushroom cap */}
        <ellipse cx="200" cy="60" rx="70" ry="40" className="fill-amber-600 dark:fill-amber-500" />
        <ellipse cx="200" cy="65" rx="65" ry="8" className="fill-amber-400 dark:fill-amber-600" />

        {/* Cap spots */}
        <circle cx="180" cy="48" r="5" className="fill-amber-300 dark:fill-amber-400" opacity="0.6" />
        <circle cx="210" cy="42" r="4" className="fill-amber-300 dark:fill-amber-400" opacity="0.6" />
        <circle cx="195" cy="56" r="3" className="fill-amber-300 dark:fill-amber-400" opacity="0.6" />

        {/* Gills */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = 160 + i * 10;
          return (
            <line key={i} x1={x} y1="73" x2={x + (i < 5 ? -3 : 3)} y2="95"
              className="stroke-amber-300 dark:stroke-amber-600" strokeWidth="1" />
          );
        })}

        {/* Stem */}
        <rect x="188" y="90" width="24" height="90" rx="4" className="fill-amber-200 dark:fill-amber-700 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1" />

        {/* Ring on stem */}
        <ellipse cx="200" cy="110" rx="18" ry="4" className="fill-amber-300 dark:fill-amber-600" />

        {/* Mycelium underground */}
        {/* Main roots spreading */}
        <path d="M 200,180 Q 200,210 170,230 Q 140,250 100,260" fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
        <path d="M 200,180 Q 200,220 230,240 Q 260,260 310,270" fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
        <path d="M 200,180 Q 190,230 180,260 Q 170,290 160,310" fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
        <path d="M 200,180 Q 210,230 220,260 Q 230,290 250,310" fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />

        {/* Smaller hyphae branches */}
        <path d="M 160,240 Q 140,245 120,240" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
        <path d="M 140,255 Q 120,265 90,270" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
        <path d="M 240,250 Q 260,245 285,250" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
        <path d="M 270,265 Q 290,275 320,280" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
        <path d="M 175,270 Q 155,280 130,285" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
        <path d="M 225,275 Q 245,285 270,290" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
        <path d="M 165,295 Q 145,305 120,310" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
        <path d="M 245,300 Q 265,305 290,308" fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />

        {/* Hyphae tips */}
        {[[90, 270], [85, 260], [120, 240], [320, 280], [285, 250], [310, 270], [120, 310], [290, 308], [130, 285], [270, 290]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" className="fill-amber-400 dark:fill-amber-500" />
        ))}

        {/* Decomposing matter */}
        <rect x="70" y="290" width="30" height="10" rx="3" className="fill-amber-700 dark:fill-amber-800" opacity="0.5" />
        <rect x="300" y="300" width="25" height="8" rx="3" className="fill-amber-700 dark:fill-amber-800" opacity="0.5" />
        <text x="85" y="318" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="9">dead leaf</text>

        {/* Labels */}
        {/* Cap */}
        <line x1="270" y1="50" x2="320" y2="35" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="322" y="38" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="600">Cap (pileus)</text>

        {/* Gills */}
        <line x1="245" y1="82" x2="310" y2="75" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="312" y="78" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="600">Gills</text>
        <text x="312" y="90" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(spore release)</text>

        {/* Ring */}
        <line x1="218" y1="110" x2="310" y2="110" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="312" y="114" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="600">Ring (annulus)</text>

        {/* Stem */}
        <line x1="188" y1="140" x2="100" y2="140" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="52" y="144" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="600">Stem (stipe)</text>

        {/* Mycelium */}
        <line x1="200" y1="210" x2="50" y2="220" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="32" y="215" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Mycelium</text>
        <text x="32" y="228" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(hyphae network)</text>

        {/* Decomposer role */}
        <rect x="20" y="330" width="360" height="18" rx="4" className="fill-emerald-100 dark:fill-emerald-900/30" />
        <text x="200" y="343" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="10" fontWeight="600">
          Decomposer: breaks down dead organic matter, recycling nutrients into soil
        </text>
      </svg>
    </div>
  );
}
