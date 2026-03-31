export default function OrchidSymbiosisSpectrumDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Symbiosis spectrum from mutualism through commensalism to parasitism with examples"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-fuchsia-600 dark:fill-fuchsia-400">
          The Symbiosis Spectrum
        </text>

        {/* Spectrum bar */}
        <defs>
          <linearGradient id="symbiosis-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <rect x="100" y="65" width="580" height="20" rx="10" fill="url(#symbiosis-grad)" opacity="0.7" />

        {/* Labels along spectrum */}
        <text x="140" y="58" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-green-600 dark:fill-green-400">Mutualism</text>
        <text x="390" y="58" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">Commensalism</text>
        <text x="640" y="58" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-red-600 dark:fill-red-400">Parasitism</text>

        <text x="140" y="105" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Both benefit</text>
        <text x="390" y="105" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">One benefits, other unaffected</text>
        <text x="640" y="105" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">One benefits, other harmed</text>

        {/* Mutualism example */}
        <g transform="translate(140, 130)">
          <rect x="-100" y="0" width="200" height="110" rx="8" className="fill-green-50 dark:fill-green-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-green-700 dark:fill-green-300">
            Mycorrhizae
          </text>
          <text x="0" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Fungus {"\u2194"} Plant roots
          </text>
          <text x="0" y="58" textAnchor="middle" fontSize="10" className="fill-green-600 dark:fill-green-400">
            Fungus gets: sugar
          </text>
          <text x="0" y="72" textAnchor="middle" fontSize="10" className="fill-green-600 dark:fill-green-400">
            Plant gets: minerals, water
          </text>
          <text x="0" y="90" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            90% of plant species use this
          </text>
        </g>

        {/* Commensalism example */}
        <g transform="translate(390, 130)">
          <rect x="-110" y="0" width="220" height="110" rx="8" className="fill-blue-50 dark:fill-blue-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">
            Orchid on Tree
          </text>
          <text x="0" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Orchid {"\u2192"} Tree unaffected
          </text>
          <text x="0" y="58" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">
            Orchid gets: sunlight access, support
          </text>
          <text x="0" y="72" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">
            Tree gets: nothing (or slight weight)
          </text>
          <text x="0" y="90" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Orchid does NOT tap the tree{"\u2019"}s sap
          </text>
        </g>

        {/* Parasitism example */}
        <g transform="translate(640, 130)">
          <rect x="-100" y="0" width="200" height="110" rx="8" className="fill-red-50 dark:fill-red-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-red-700 dark:fill-red-300">
            Mistletoe on Tree
          </text>
          <text x="0" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Mistletoe {"\u2192"} Tree harmed
          </text>
          <text x="0" y="58" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">
            Mistletoe gets: water, minerals, sugar
          </text>
          <text x="0" y="72" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">
            Tree loses: nutrients, may weaken
          </text>
          <text x="0" y="90" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Roots penetrate vascular tissue
          </text>
        </g>

        {/* Shifting arrow */}
        <g transform="translate(390, 270)">
          <rect x="-280" y="0" width="560" height="70" rx="8" className="fill-amber-50 dark:fill-amber-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
            Relationships Can Shift Along the Spectrum
          </text>
          <text x="0" y="42" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Too many orchids on one branch {"\u2192"} weight breaks branch {"\u2192"} shifts toward parasitism
          </text>
          <text x="0" y="58" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Climate change, nutrient stress, or competition can shift any relationship
          </text>
        </g>

        {/* Conservation note */}
        <g transform="translate(390, 360)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-fuchsia-600 dark:fill-fuchsia-400">
            Orchid Conservation Depends on All Three Relationships
          </text>
          <text x="0" y="18" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Orchids need: host trees (commensalism) + mycorrhizal fungi (mutualism) + freedom from parasites
          </text>
        </g>

        <text x="390" y="408" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Symbiosis spectrum: same two species can shift from mutualism to parasitism depending on conditions
        </text>
      </svg>
    </div>
  );
}
