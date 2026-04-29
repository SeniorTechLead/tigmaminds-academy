export default function MapBufferOverlayDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 550 368"
        className="w-full"
        role="img"
        aria-label="GIS operations: buffer around a river for flood zone, and overlay of forest plus steep slope for erosion risk"
      >
        <rect width="500" height="330" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          GIS Operations: Buffer &amp; Overlay
        </text>

        {/* Panel 1: Buffer */}
        <rect x="15" y="48" width="225" height="230" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.8" />
        <text x="127" y="68" textAnchor="middle" fontSize="12" fontWeight="700" fill="#60a5fa" fontFamily="sans-serif">
          Buffer
        </text>
        <text x="127" y="82" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Ring around a feature at set distance
        </text>

        {/* River */}
        <path
          d="M40,140 Q70,120 100,135 Q130,155 160,140 Q190,120 215,130"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <text x="218" y="126" fontSize="8" fill="#60a5fa" fontFamily="sans-serif">River</text>

        {/* Buffer zone — wider path around river */}
        <path
          d="M35,140 Q65,115 100,130 Q135,150 165,135 Q195,115 220,125"
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.8"
          strokeDasharray="3 2"
        />
        <path
          d="M45,145 Q75,125 100,140 Q125,160 155,145 Q185,125 210,135"
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.8"
          strokeDasharray="3 2"
        />

        {/* Flood zone fill between buffer lines */}
        <path
          d="M35,140 Q65,115 100,130 Q135,150 165,135 Q195,115 220,125 L210,135 Q185,125 155,145 Q125,160 100,140 Q75,125 45,145Z"
          fill="#ef4444"
          opacity="0.15"
        />

        {/* Buffer distance annotation */}
        <line x1="100" y1="135" x2="100" y2="128" stroke="#fbbf24" strokeWidth="0.8" />
        <line x1="100" y1="128" x2="85" y2="128" stroke="#fbbf24" strokeWidth="0.8" />
        <text x="75" y="125" textAnchor="end" fontSize="7" fill="#fbbf24" fontFamily="sans-serif">500m</text>

        {/* Legend */}
        <line x1="35" y1="180" x2="55" y2="180" stroke="#3b82f6" strokeWidth="2" />
        <text x="60" y="183" fontSize="8" fill="#d1d5db" fontFamily="sans-serif">River</text>
        <rect x="35" y="190" width="20" height="8" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="0.5" />
        <text x="60" y="197" fontSize="8" fill="#d1d5db" fontFamily="sans-serif">Flood risk zone (500m buffer)</text>

        {/* Use case */}
        <text x="127" y="225" textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="sans-serif" fontWeight="600">
          Use: No building within 500m of river
        </text>
        <text x="127" y="240" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Also used for: noise zones, wildlife corridors
        </text>

        {/* Panel 2: Overlay */}
        <rect x="260" y="48" width="225" height="230" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.8" />
        <text x="372" y="68" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4ade80" fontFamily="sans-serif">
          Overlay
        </text>
        <text x="372" y="82" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Combine two layers to find intersections
        </text>

        {/* Layer A: Forest */}
        <ellipse cx="345" cy="135" rx="55" ry="40" fill="#166534" opacity="0.5" stroke="#4ade80" strokeWidth="1" />
        <text x="320" y="125" fontSize="9" fill="#bbf7d0" fontFamily="sans-serif">Forest</text>

        {/* Layer B: Steep slope > 30° */}
        <ellipse cx="395" cy="140" rx="50" ry="38" fill="#92400e" opacity="0.4" stroke="#d97706" strokeWidth="1" />
        <text x="420" y="130" fontSize="9" fill="#fcd34d" fontFamily="sans-serif">Slope</text>
        <text x="420" y="140" fontSize="8" fill="#fcd34d" fontFamily="sans-serif">&gt;30°</text>

        {/* Intersection = erosion risk */}
        <ellipse cx="370" cy="138" rx="25" ry="25" fill="#ef4444" opacity="0.35" />
        <text x="370" y="142" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fef2f2" fontFamily="sans-serif">
          Erosion
        </text>
        <text x="370" y="152" textAnchor="middle" fontSize="7" fill="#fef2f2" fontFamily="sans-serif">
          Risk!
        </text>

        {/* Equation visual */}
        <text x="372" y="195" textAnchor="middle" fontSize="10" fill="#d1d5db" fontFamily="sans-serif">
          Forest
        </text>
        <text x="372" y="208" textAnchor="middle" fontSize="12" fill="#f59e0b" fontFamily="sans-serif" fontWeight="700">
          ∩
        </text>
        <text x="372" y="221" textAnchor="middle" fontSize="10" fill="#d1d5db" fontFamily="sans-serif">
          Steep Slope
        </text>
        <text x="372" y="234" textAnchor="middle" fontSize="12" fill="#f59e0b" fontFamily="sans-serif" fontWeight="700">
          =
        </text>
        <text x="372" y="248" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f87171" fontFamily="sans-serif">
          Erosion Risk Zones
        </text>
        <text x="372" y="265" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          Also: union, difference, clip
        </text>

        {/* Bottom caption */}
        <text x="250" y="300" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Buffer creates zones around features. Overlay finds where layers intersect.
        </text>
        <text x="250" y="318" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          These are the core spatial analysis tools in any GIS software.
        </text>
      </svg>
    </div>
  );
}
