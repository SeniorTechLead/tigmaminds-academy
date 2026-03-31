export default function NDVIFieldDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 460" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="NDVI map of a paddy field showing healthy green areas and stressed brown areas detected by drone">
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#16a34a">Drone Health Map: NDVI Shows What Eyes Cannot</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Healthy plants reflect infrared light; sick plants do not — drones measure this</text>

        {/* Field grid - NDVI heatmap */}
        <g transform="translate(90, 80)">
          <text x="150" y="-5" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">NDVI Drone Scan of Paddy Field</text>
          {[
            [0.8, 0.8, 0.7, 0.8, 0.9, 0.8],
            [0.7, 0.3, 0.2, 0.4, 0.8, 0.8],
            [0.8, 0.2, 0.1, 0.3, 0.7, 0.9],
            [0.7, 0.4, 0.3, 0.5, 0.8, 0.8],
            [0.8, 0.8, 0.7, 0.7, 0.9, 0.8],
            [0.9, 0.8, 0.8, 0.8, 0.8, 0.9],
          ].map((row, r) =>
            row.map((val, c) => {
              const green = Math.round(val * 200 + 30);
              const red = Math.round((1 - val) * 200 + 30);
              return (
                <g key={`${r}-${c}`}>
                  <rect x={c * 50} y={r * 45} width="49" height="44" rx="2" fill={`rgb(${red}, ${green}, 30)`} opacity="0.8" />
                  <text x={c * 50 + 25} y={r * 45 + 27} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">{val.toFixed(1)}</text>
                </g>
              );
            })
          )}
          {/* Pest zone label */}
          <rect x="45" y="40" width="160" height="140" rx="4" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6,3" />
          <text x="125" y="200" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ef4444">Pest damage zone!</text>
        </g>

        {/* Legend */}
        <g transform="translate(440, 85)">
          <text x="110" y="0" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">NDVI Scale</text>
          <defs>
            <linearGradient id="ndvi-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <rect x="80" y="15" width="30" height="200" rx="4" fill="url(#ndvi-grad)" />
          <text x="125" y="30" fontSize="11" fontWeight="600" fill="#22c55e">0.9 Healthy</text>
          <text x="125" y="115" fontSize="11" fontWeight="600" fill="#eab308">0.5 Stressed</text>
          <text x="125" y="210" fontSize="11" fontWeight="600" fill="#ef4444">0.1 Dying</text>

          {/* Formula */}
          <rect x="0" y="235" width="280" height="50" rx="6" className="fill-gray-100 dark:fill-slate-800" />
          <text x="140" y="258" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">
            NDVI = (NIR − Red) / (NIR + Red)
          </text>
          <text x="140" y="278" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            NIR = near-infrared light, invisible to your eyes
          </text>
        </g>

        {/* Bottom: comparison */}
        <rect x="60" y="370" width="310" height="70" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" className="dark:fill-emerald-950/20" />
        <text x="215" y="392" textAnchor="middle" fontSize="12" fontWeight="700" fill="#10b981">Healthy rice (NDVI ≈ 0.8)</text>
        <text x="215" y="410" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Absorbs red for photosynthesis</text>
        <text x="215" y="426" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Reflects infrared → high NDVI</text>

        <rect x="400" y="370" width="340" height="70" rx="8" fill="#fef2f2" stroke="#ef4444" strokeWidth="1" className="dark:fill-red-950/20" />
        <text x="570" y="392" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444">Pest-damaged rice (NDVI ≈ 0.2)</text>
        <text x="570" y="410" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Chlorophyll destroyed by pests</text>
        <text x="570" y="426" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Reflects less infrared → low NDVI</text>
      </svg>
    </div>
  );
}
