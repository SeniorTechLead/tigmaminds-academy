export default function GrassNDVIDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="NDVI measurement: satellite detects red and near-infrared reflected light from vegetation to calculate greenness index"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          NDVI: Seeing Greenness from Space
        </text>

        {/* Satellite */}
        <g transform="translate(350, 65)">
          <rect x="-15" y="-12" width="30" height="24" rx="3" fill="#64748b" />
          <rect x="-45" y="-6" width="30" height="12" rx="2" fill="#3b82f6" opacity="0.6" />
          <rect x="15" y="-6" width="30" height="12" rx="2" fill="#3b82f6" opacity="0.6" />
          <text x="0" y="32" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-gray-400">Satellite sensor</text>
        </g>

        {/* Sunlight down */}
        <line x1="130" y1="50" x2="200" y2="210" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3" />
        <text x="120" y="45" fontSize="11" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">Sunlight</text>

        {/* Ground: healthy vegetation */}
        <rect x="50" y="220" width="250" height="80" rx="8" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#16a34a" strokeWidth="1.5" />
        <text x="175" y="240" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Healthy Vegetation</text>

        {/* Red absorbed */}
        <rect x="70" y="260" width="100" height="28" rx="4" fill="#ef4444" opacity="0.3" />
        <text x="120" y="278" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-700 dark:fill-red-300">Red: ABSORBED</text>
        <text x="120" y="295" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(used for photosynthesis)</text>

        {/* NIR reflected */}
        <rect x="190" y="260" width="100" height="28" rx="4" fill="#16a34a" opacity="0.3" />
        <text x="240" y="278" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-700 dark:fill-green-300">NIR: REFLECTED</text>

        {/* Reflected NIR arrow to satellite */}
        <line x1="260" y1="220" x2="340" y2="90" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arr-ndvi)" />
        <text x="310" y="145" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400" transform="rotate(-40, 310, 145)">NIR reflected</text>

        {/* Tiny red reflected */}
        <line x1="140" y1="220" x2="330" y2="90" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" />
        <text x="220" y="155" fontSize="10" className="fill-red-400 dark:fill-red-500" transform="rotate(-30, 220, 155)">Little red</text>

        {/* Ground: bare soil */}
        <rect x="400" y="220" width="250" height="80" rx="8" className="fill-amber-100 dark:fill-amber-900/30" stroke="#b45309" strokeWidth="1.5" />
        <text x="525" y="240" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">Bare Soil / Ash</text>

        {/* Both reflected similarly */}
        <rect x="420" y="260" width="95" height="28" rx="4" fill="#ef4444" opacity="0.3" />
        <text x="468" y="278" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-700 dark:fill-red-300">Red: reflected</text>
        <rect x="535" y="260" width="95" height="28" rx="4" fill="#16a34a" opacity="0.2" />
        <text x="583" y="278" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-700 dark:fill-green-300">NIR: similar</text>

        {/* Arrows from bare soil */}
        <line x1="490" y1="220" x2="365" y2="90" stroke="#b45309" strokeWidth="1" strokeDasharray="4 3" />

        {/* Formula box */}
        <rect x="100" y="330" width="500" height="75" rx="8" className="fill-blue-50 dark:fill-blue-950/30" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="350" y="352" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">
          NDVI = (NIR − Red) / (NIR + Red)
        </text>
        <text x="200" y="376" textAnchor="middle" fontSize="11" className="fill-emerald-600 dark:fill-emerald-400">
          Healthy grass: NDVI ≈ 0.6–0.8
        </text>
        <text x="500" y="376" textAnchor="middle" fontSize="11" className="fill-amber-600 dark:fill-amber-400">
          Burnt ground: NDVI ≈ 0.0–0.1
        </text>
        <text x="350" y="396" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Recovery tracked weekly: NDVI rises as shoots emerge from roots
        </text>

        <defs>
          <marker id="arr-ndvi" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#16a34a" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
