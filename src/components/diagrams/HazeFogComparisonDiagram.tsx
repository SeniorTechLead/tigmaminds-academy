export default function HazeFogComparisonDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Haze vs fog vs clear air: how particle size and density change mountain visibility and color"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          Haze vs Fog vs Clear Air
        </text>

        {/* Three comparison panels */}
        {[
          {
            x: 140, title: 'Clear Air (after rain)', subtitle: 'Rayleigh scattering only',
            mountainColor: '#3b82f6', mountainOpacity: 0.6, bgColor: '#dbeafe', bgOpacity: 0.05,
            desc: 'Deep, vivid blue', particles: 3,
          },
          {
            x: 390, title: 'Haze (humid day)', subtitle: 'Rayleigh + Mie scattering',
            mountainColor: '#93c5fd', mountainOpacity: 0.4, bgColor: '#e0e7ff', bgOpacity: 0.15,
            desc: 'Pale blue-white', particles: 12,
          },
          {
            x: 640, title: 'Fog (very thick)', subtitle: 'Mie scattering dominates',
            mountainColor: '#d1d5db', mountainOpacity: 0.2, bgColor: '#f3f4f6', bgOpacity: 0.3,
            desc: 'Mountain invisible', particles: 25,
          },
        ].map((panel) => (
          <g key={panel.title} transform={`translate(${panel.x}, 60)`}>
            <rect x="-115" y="0" width="230" height="240" rx="8" fill={panel.bgColor} opacity={panel.bgOpacity} />
            <rect x="-115" y="0" width="230" height="240" rx="8" fill="none" stroke="#d4d4d8" strokeWidth="1" className="dark:stroke-slate-700" />
            <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
              {panel.title}
            </text>
            <text x="0" y="38" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              {panel.subtitle}
            </text>

            {/* Mountain silhouette */}
            <path d="M -80,180 L -20,70 L 20,100 L 60,60 L 100,180 Z"
              fill={panel.mountainColor} opacity={panel.mountainOpacity} />

            {/* Scattered particles */}
            {Array.from({ length: panel.particles }).map((_, i) => (
              <circle
                key={i}
                cx={-80 + (i % 8) * 25}
                cy={60 + Math.floor(i / 8) * 40 + (i % 3) * 15}
                r={1 + (panel.particles > 10 ? 1.5 : 0)}
                fill="#94a3b8"
                opacity={0.3}
              />
            ))}

            <text x="0" y="205" textAnchor="middle" fontSize="12" fontWeight="600" fill={panel.mountainColor}>
              {panel.desc}
            </text>
            <text x="0" y="225" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              Visibility: {panel.particles < 5 ? '50+ km' : panel.particles < 15 ? '5\u201320 km' : '< 1 km'}
            </text>
          </g>
        ))}

        {/* Scattering type comparison */}
        <g transform="translate(390, 320)">
          <rect x="-330" y="0" width="660" height="70" rx="8" className="fill-indigo-50 dark:fill-indigo-950" opacity="0.5" />
          <text x="-150" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            Rayleigh (small molecules)
          </text>
          <text x="-150" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Blue scatters 4{"\u00D7"} more than red
          </text>
          <text x="-150" y="56" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            {"\u2192"} blue mountains, blue sky
          </text>

          <line x1="0" y1="8" x2="0" y2="60" stroke="#d4d4d8" strokeWidth="1" className="dark:stroke-slate-600" />

          <text x="170" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">
            Mie (water droplets, dust)
          </text>
          <text x="170" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            All colours scatter equally
          </text>
          <text x="170" y="56" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            {"\u2192"} white haze, grey fog
          </text>
        </g>

        <text x="390" y="410" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Haflong{"\u2019"}s mountains are bluest on clear days after rain washes particles from the air
        </text>
      </svg>
    </div>
  );
}
