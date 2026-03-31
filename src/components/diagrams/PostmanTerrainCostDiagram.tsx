export default function PostmanTerrainCostDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Terrain affects travel cost: uphill costs 4x more energy than flat ground, showing Tobler's hiking function relating slope to walking speed"
      >
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          Terrain Cost: Why Shortest \u2260 Fastest
        </text>

        {/* Cross-section of terrain */}
        <g transform="translate(50, 60)">
          <rect width="600" height="170" rx="8" className="fill-amber-50 dark:fill-amber-950/20" stroke="#b45309" strokeWidth="1" />

          {/* Terrain profile */}
          <path
            d="M30,140 Q80,140 120,130 Q160,80 200,50 Q230,35 260,50 Q300,80 340,130 Q380,140 420,135 Q460,120 500,100 Q530,90 560,100"
            fill="none"
            stroke="#78350f"
            strokeWidth="2"
            className="dark:stroke-amber-600"
          />

          {/* Flat ground reference */}
          <line x1="30" y1="140" x2="560" y2="140" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 2" className="dark:stroke-gray-600" />

          {/* Route A: direct over mountain (short distance) */}
          <path
            d="M30,140 L200,50 L340,130"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="6 3"
          />
          <text x="200" y="30" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-red-600 dark:fill-red-400">Route A: 5 km direct</text>
          <text x="200" y="44" textAnchor="middle" fontSize="10" className="fill-red-500 dark:fill-red-400">\u2191500m climb \u2192 3 hours!</text>

          {/* Route B: around the base (longer distance) */}
          <path
            d="M30,140 Q100,155 200,150 Q300,155 340,130"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
          />
          <text x="200" y="165" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-green-600 dark:fill-green-400">Route B: 8 km around</text>
          <text x="200" y="155" textAnchor="middle" fontSize="10" className="fill-green-500 dark:fill-green-400">Mostly flat \u2192 1.5 hours!</text>

          {/* Energy cost labels */}
          <g transform="translate(400, 20)">
            <rect width="180" height="70" rx="6" className="fill-white dark:fill-slate-900" stroke="#6b7280" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">Energy Cost</text>
            <text x="90" y="36" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Uphill: 4\u00d7 flat ground</text>
            <text x="90" y="50" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Steep downhill: 2\u00d7 flat</text>
            <text x="90" y="64" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Gentle downhill: 0.8\u00d7 flat</text>
          </g>
        </g>

        {/* Tobler's function */}
        <g transform="translate(50, 250)">
          <rect width="600" height="110" rx="8" className="fill-blue-50 dark:fill-blue-950/20" stroke="#3b82f6" strokeWidth="1" />
          <text x="300" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Tobler\u2019s Hiking Function</text>

          {/* Simplified speed vs slope chart */}
          <g transform="translate(40, 35)">
            {/* Axes */}
            <line x1="0" y1="55" x2="220" y2="55" stroke="#9ca3af" strokeWidth="1" />
            <line x1="110" y1="10" x2="110" y2="55" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 2" />

            {/* Speed curve */}
            <path
              d="M10,45 Q30,38 50,28 Q70,15 90,10 Q110,12 130,18 Q150,30 170,40 Q190,48 210,50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />

            {/* Labels */}
            <text x="0" y="68" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Steep up</text>
            <text x="90" y="68" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">\u22125%</text>
            <text x="190" y="68" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Steep down</text>
            <text x="-35" y="30" fontSize="10" className="fill-gray-500 dark:fill-slate-400" transform="rotate(-90, -15, 30)">Speed</text>

            {/* Peak label */}
            <text x="90" y="6" fontSize="10" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">Peak: gentle downhill</text>
          </g>

          {/* Key numbers */}
          <g transform="translate(300, 35)">
            <text x="0" y="14" fontSize="11" className="fill-gray-700 dark:fill-gray-300">\u2022 Flat ground: \u223c5 km/h</text>
            <text x="0" y="32" fontSize="11" className="fill-gray-700 dark:fill-gray-300">\u2022 30% grade uphill: \u223c1.7 km/h</text>
            <text x="0" y="50" fontSize="11" className="fill-gray-700 dark:fill-gray-300">\u2022 Gentle downhill (\u22125%): \u223c6 km/h (fastest)</text>
            <text x="0" y="68" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">\u2192 GPS apps use this to predict arrival time</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
