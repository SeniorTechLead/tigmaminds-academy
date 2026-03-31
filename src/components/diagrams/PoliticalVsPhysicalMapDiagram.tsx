export default function PoliticalVsPhysicalMapDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Side-by-side comparison of a political map showing borders and capitals vs a physical map showing terrain and elevation"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Political vs Physical Maps
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Same land, two completely different ways of seeing it
        </text>

        {/* Political Map */}
        <rect x="30" y="70" width="345" height="310" rx="10" className="fill-white dark:fill-slate-900" stroke="#3b82f6" strokeWidth="2" />
        <text x="202" y="95" textAnchor="middle" fontSize="14" fontWeight="700" fill="#3b82f6">
          Political Map
        </text>
        <text x="202" y="112" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Shows human-made divisions
        </text>

        {/* Stylized NE India political regions */}
        <rect x="50" y="125" width="120" height="80" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
        <text x="110" y="155" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1d4ed8">Arunachal</text>
        <text x="110" y="170" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1d4ed8">Pradesh</text>
        <circle cx="100" cy="185" r="3" fill="#ef4444" />
        <text x="115" y="189" fontSize="9" fill="#ef4444">Itanagar</text>

        <rect x="50" y="210" width="150" height="50" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
        <text x="125" y="240" textAnchor="middle" fontSize="11" fontWeight="600" fill="#166534">Assam</text>
        <circle cx="140" cy="248" r="3" fill="#ef4444" />
        <text x="155" y="252" fontSize="9" fill="#ef4444">Dispur</text>

        <rect x="175" y="125" width="90" height="60" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
        <text x="220" y="160" textAnchor="middle" fontSize="10" fontWeight="600" fill="#92400e">Nagaland</text>

        <rect x="205" y="210" width="90" height="50" rx="4" fill="#fce7f3" stroke="#ec4899" strokeWidth="1" />
        <text x="250" y="240" textAnchor="middle" fontSize="10" fontWeight="600" fill="#9d174d">Manipur</text>

        <rect x="50" y="265" width="80" height="45" rx="4" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1" />
        <text x="90" y="292" textAnchor="middle" fontSize="10" fontWeight="600" fill="#4338ca">Meghalaya</text>

        <rect x="135" y="265" width="70" height="45" rx="4" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1" />
        <text x="170" y="292" textAnchor="middle" fontSize="10" fontWeight="600" fill="#15803d">Mizoram</text>

        <rect x="210" y="265" width="75" height="45" rx="4" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1" />
        <text x="247" y="292" textAnchor="middle" fontSize="10" fontWeight="600" fill="#854d0e">Tripura</text>

        <text x="202" y="330" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Shows: borders, capitals, state names
        </text>
        <text x="202" y="345" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Ignores: mountains, rivers, elevation
        </text>
        <text x="202" y="362" textAnchor="middle" fontSize="10" fontWeight="600" fill="#3b82f6">
          Answers: "Who governs this land?"
        </text>

        {/* Physical Map */}
        <rect x="405" y="70" width="345" height="310" rx="10" className="fill-white dark:fill-slate-900" stroke="#22c55e" strokeWidth="2" />
        <text x="577" y="95" textAnchor="middle" fontSize="14" fontWeight="700" fill="#22c55e">
          Physical Map
        </text>
        <text x="577" y="112" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Shows natural features
        </text>

        {/* Terrain visualization */}
        {/* High mountains - dark brown */}
        <path d="M425,140 L480,125 L540,130 L600,120 L660,135 L730,140 L730,170 L425,170 Z" fill="#8b4513" fillOpacity="0.5" />
        <text x="570" y="152" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="600">Himalayas (6000m+)</text>

        {/* Hills - lighter brown */}
        <path d="M425,170 L430,165 L500,175 L560,160 L620,170 L680,165 L730,170 L730,210 L425,210 Z" fill="#a0522d" fillOpacity="0.35" />
        <text x="580" y="195" textAnchor="middle" fontSize="9" className="fill-gray-700 dark:fill-slate-300">Hills (500-3000m)</text>

        {/* Plains - green */}
        <rect x="425" y="210" width="305" height="50" fill="#22c55e" fillOpacity="0.15" />
        <text x="577" y="235" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Brahmaputra Valley (plains, 50-100m)</text>
        {/* River */}
        <path d="M425,230 Q500,225 540,232 Q600,240 660,228 Q700,222 730,230" fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.5" />
        <text x="640" y="250" fontSize="9" fill="#3b82f6">Brahmaputra</text>

        {/* Southern hills */}
        <path d="M425,260 L500,265 L560,255 L620,268 L680,260 L730,265 L730,310 L425,310 Z" fill="#a0522d" fillOpacity="0.25" />
        <text x="577" y="285" textAnchor="middle" fontSize="9" className="fill-gray-700 dark:fill-slate-300">Patkai & Lushai Hills</text>

        {/* Elevation legend */}
        <rect x="430" y="310" width="20" height="10" fill="#8b4513" fillOpacity="0.5" />
        <text x="455" y="319" fontSize="9" className="fill-gray-500 dark:fill-slate-400">High</text>
        <rect x="490" y="310" width="20" height="10" fill="#a0522d" fillOpacity="0.35" />
        <text x="515" y="319" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Mid</text>
        <rect x="545" y="310" width="20" height="10" fill="#22c55e" fillOpacity="0.15" />
        <text x="570" y="319" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Low</text>

        <text x="577" y="345" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Shows: mountains, rivers, elevation
        </text>
        <text x="577" y="360" textAnchor="middle" fontSize="10" fontWeight="600" fill="#22c55e">
          Answers: "What does this land look like?"
        </text>

        {/* Bottom insight */}
        <rect x="80" y="395" width="620" height="50" rx="10" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1" />
        <text x="390" y="415" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-800 dark:fill-amber-200">
          Key insight: Political borders often follow physical features
        </text>
        <text x="390" y="434" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-amber-300">
          Rivers, mountain ridges, and valleys naturally separate communities {'\u2014'} and then become state borders
        </text>
      </svg>
    </div>
  );
}
