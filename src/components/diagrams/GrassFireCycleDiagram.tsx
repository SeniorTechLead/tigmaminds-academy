export default function GrassFireCycleDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Fire cycle in grasslands: controlled burn removes dead thatch, ash returns nutrients, fresh shoots emerge from roots, tall grass regrows"
      >
        <rect width="700" height="480" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          The Grassland Fire Cycle
        </text>

        {/* Stage 1: Overgrown */}
        <g transform="translate(50, 70)">
          <rect width="140" height="140" rx="8" className="fill-emerald-50 dark:fill-emerald-950/40" stroke="#059669" strokeWidth="1.5" />
          <text x="70" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">1. Overgrown</text>
          {/* Dead thatch layer */}
          <rect x="15" y="90" width="110" height="30" rx="3" fill="#a16207" opacity="0.5" />
          <text x="70" y="109" textAnchor="middle" fontSize="10" className="fill-amber-900 dark:fill-amber-200">Dead thatch</text>
          {/* Tall brown grass */}
          {[25, 40, 55, 70, 85, 100].map((cx, i) => (
            <line key={i} x1={cx} y1={90} x2={cx + (i % 2 ? 3 : -3)} y2={38} stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          ))}
          <text x="70" y="135" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Blocks sunlight</text>
        </g>

        {/* Arrow 1-2 */}
        <g>
          <line x1="200" y1="140" x2="235" y2="140" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-fire)" />
        </g>

        {/* Stage 2: Controlled burn */}
        <g transform="translate(245, 70)">
          <rect width="140" height="140" rx="8" className="fill-orange-50 dark:fill-orange-950/40" stroke="#ea580c" strokeWidth="1.5" />
          <text x="70" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-orange-700 dark:fill-orange-300">2. Controlled Burn</text>
          {/* Flames */}
          {[30, 55, 80, 105].map((cx, i) => (
            <g key={i}>
              <ellipse cx={cx} cy={70} rx="10" ry="22" fill="#ef4444" opacity="0.7" />
              <ellipse cx={cx} cy={65} rx="6" ry="14" fill="#f59e0b" opacity="0.8" />
              <ellipse cx={cx} cy={62} rx="3" ry="8" fill="#fef3c7" opacity="0.9" />
            </g>
          ))}
          {/* Ground */}
          <rect x="15" y="95" width="110" height="15" rx="3" fill="#44403c" opacity="0.6" />
          <text x="70" y="130" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Removes dead matter</text>
        </g>

        {/* Arrow 2-3 */}
        <line x1="395" y1="140" x2="430" y2="140" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-fire)" />

        {/* Stage 3: Ash & nutrients */}
        <g transform="translate(440, 70)">
          <rect width="140" height="140" rx="8" className="fill-gray-50 dark:fill-gray-900/40" stroke="#6b7280" strokeWidth="1.5" />
          <text x="70" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">3. Ash Layer</text>
          {/* Ash ground */}
          <rect x="15" y="75" width="110" height="20" rx="3" fill="#9ca3af" opacity="0.4" />
          {/* Nutrient symbols */}
          {["P", "K", "Ca"].map((n, i) => (
            <g key={i}>
              <circle cx={35 + i * 35} cy={60} r="12" className="fill-amber-100 dark:fill-amber-900/50" stroke="#f59e0b" strokeWidth="1" />
              <text x={35 + i * 35} y={64} textAnchor="middle" fontSize="10" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">{n}</text>
            </g>
          ))}
          <text x="70" y="115" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Phosphorus, potassium,</text>
          <text x="70" y="128" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">calcium return to soil</text>
        </g>

        {/* Stage 4: Fresh shoots */}
        <g transform="translate(50, 260)">
          <rect width="140" height="140" rx="8" className="fill-lime-50 dark:fill-lime-950/40" stroke="#65a30d" strokeWidth="1.5" />
          <text x="70" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-lime-700 dark:fill-lime-300">4. Fresh Shoots</text>
          {/* Soil */}
          <rect x="15" y="95" width="110" height="25" rx="3" fill="#78350f" opacity="0.3" />
          {/* Underground roots */}
          {[35, 55, 75, 95].map((cx, i) => (
            <path key={i} d={`M${cx},120 Q${cx + 5},108 ${cx},95`} fill="none" stroke="#92400e" strokeWidth="1.5" />
          ))}
          {/* Green shoots emerging */}
          {[35, 55, 75, 95].map((cx, i) => (
            <line key={i} x1={cx} y1={95} x2={cx} y2={65 - i * 3} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          ))}
          <text x="70" y="135" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Roots survive fire</text>
        </g>

        {/* Arrow 4-5 */}
        <line x1="200" y1="330" x2="235" y2="330" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-fire)" />

        {/* Stage 5: Tall grass regrown */}
        <g transform="translate(245, 260)">
          <rect width="140" height="140" rx="8" className="fill-green-50 dark:fill-green-950/40" stroke="#16a34a" strokeWidth="1.5" />
          <text x="70" y="20" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-green-700 dark:fill-green-300">5. Tall Grass (5m)</text>
          {/* Tall green grass */}
          {[25, 38, 51, 64, 77, 90, 103].map((cx, i) => (
            <line key={i} x1={cx} y1={120} x2={cx + (i % 2 ? 4 : -4)} y2={35} stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          ))}
          {/* Rhino silhouette hidden */}
          <ellipse cx="70" cy="95" rx="30" ry="18" fill="#6b7280" opacity="0.3" />
          <text x="70" y="135" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Rhinos hidden inside</text>
        </g>

        {/* Arrow back to stage 1 */}
        <path d="M385,330 Q500,330 500,260 Q500,230 470,230" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" />
        <text x="510" y="280" fontSize="10" className="fill-amber-600 dark:fill-amber-400">Cycle repeats</text>

        {/* Arrow marker */}
        <defs>
          <marker id="arrow-fire" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Key insight box */}
        <rect x="50" y="430" width="600" height="36" rx="6" className="fill-amber-50 dark:fill-amber-950/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="453" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-amber-800 dark:fill-amber-200">
          Without periodic fire, grasslands convert to forest and rhinos lose their habitat
        </text>
      </svg>
    </div>
  );
}
