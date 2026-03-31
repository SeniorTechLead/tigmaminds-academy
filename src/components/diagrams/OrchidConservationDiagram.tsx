export default function OrchidConservationDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Orchid conservation challenges: habitat loss, fungal dependency, and propagation strategies"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-fuchsia-600 dark:fill-fuchsia-400">
          Orchid Conservation: Why They Are Fragile
        </text>

        {/* Three threat columns */}
        {[
          {
            x: 150, title: 'Habitat Loss', color: 'red',
            items: ['Deforestation removes host trees', 'Epiphytes have nowhere to grow', 'Cloud forests especially vulnerable', 'NE India lost 30% forest cover'],
          },
          {
            x: 390, title: 'Fungal Dependency', color: 'amber',
            items: ['Seeds MUST find compatible fungus', 'No fungus = no germination', 'Fungi are soil-specific', 'Soil disturbance kills partners'],
          },
          {
            x: 630, title: 'Over-collection', color: 'purple',
            items: ['Rare orchids worth thousands', 'Wild collection outpaces reproduction', 'Slow growth: years to flower', 'Many species not yet described'],
          },
        ].map((col) => (
          <g key={col.title} transform={`translate(${col.x}, 65)`}>
            <rect x="-120" y="0" width="240" height="160" rx="8"
              className={`fill-${col.color}-50 dark:fill-${col.color}-950`} opacity="0.4" />
            <text x="0" y="24" textAnchor="middle" fontSize="13" fontWeight="700"
              className={`fill-${col.color}-600 dark:fill-${col.color}-400`}>
              {col.title}
            </text>
            {col.items.map((item, i) => (
              <text key={i} x="0" y={50 + i * 22} textAnchor="middle" fontSize="11"
                className="fill-gray-600 dark:fill-slate-300">
                {item}
              </text>
            ))}
          </g>
        ))}

        {/* Solutions section */}
        <g transform="translate(390, 250)">
          <rect x="-340" y="0" width="680" height="120" rx="8" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.5" />
          <text x="0" y="25" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
            Conservation Strategies
          </text>

          {/* Strategy 1 */}
          <g transform="translate(-220, 45)">
            <circle cx="0" cy="8" r="16" fill="#22c55e" opacity="0.2" />
            <text x="0" y="12" textAnchor="middle" fontSize="14">🌱</text>
            <text x="0" y="35" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Symbiotic Propagation</text>
            <text x="0" y="50" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Grow orchids with their</text>
            <text x="0" y="62" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">fungal partner in labs</text>
          </g>

          {/* Strategy 2 */}
          <g transform="translate(0, 45)">
            <circle cx="0" cy="8" r="16" fill="#22c55e" opacity="0.2" />
            <text x="0" y="12" textAnchor="middle" fontSize="14">🌳</text>
            <text x="0" y="35" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Protect Host Forests</text>
            <text x="0" y="50" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Save trees = save the</text>
            <text x="0" y="62" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">entire epiphyte community</text>
          </g>

          {/* Strategy 3 */}
          <g transform="translate(220, 45)">
            <circle cx="0" cy="8" r="16" fill="#22c55e" opacity="0.2" />
            <text x="0" y="12" textAnchor="middle" fontSize="14">📋</text>
            <text x="0" y="35" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">CITES Protection</text>
            <text x="0" y="50" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">All orchids are listed</text>
            <text x="0" y="62" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">under international trade law</text>
          </g>
        </g>

        <text x="390" y="400" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Orchids are the world{"\u2019"}s most species-rich plant family (~28,000 species) and among the most threatened
        </text>
      </svg>
    </div>
  );
}
