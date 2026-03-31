export default function OrchidEpiphyteAnatomyDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Orchid epiphyte anatomy: velamen roots, aerial moisture capture, and attachment to host bark"
      >
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-fuchsia-600 dark:fill-fuchsia-400">
          Epiphyte Anatomy: How Orchids Live on Trees
        </text>

        {/* Tree trunk */}
        <rect x="60" y="50" width="80" height="450" rx="10" fill="#92400e" opacity="0.4" />
        {/* Bark texture */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="65" y1={70 + i * 35} x2="135" y2={75 + i * 35} stroke="#78350f" strokeWidth="1" opacity="0.3" />
        ))}
        <text x="100" y="490" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Host Tree Trunk</text>

        {/* Orchid plant on trunk */}
        <g transform="translate(180, 200)">
          {/* Roots gripping bark */}
          <path d="M -40,40 Q -60,30 -80,35" stroke="#a3a3a3" strokeWidth="4" fill="none" />
          <path d="M -35,50 Q -55,55 -80,50" stroke="#a3a3a3" strokeWidth="3.5" fill="none" />
          <path d="M -30,60 Q -50,70 -75,65" stroke="#a3a3a3" strokeWidth="3" fill="none" />

          {/* Root velamen cross-section callout */}
          <g transform="translate(220, 60)">
            <line x1="-145" y1="0" x2="-30" y2="0" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3,2" className="dark:stroke-slate-600" />
            <circle cx="0" cy="0" r="30" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
            {/* Outer velamen layer */}
            <circle cx="0" cy="0" r="28" fill="#e9d5ff" opacity="0.3" />
            <circle cx="0" cy="0" r="18" fill="#d8b4fe" opacity="0.3" />
            {/* Inner cortex */}
            <circle cx="0" cy="0" r="10" fill="#22c55e" opacity="0.4" />
            {/* Center vascular */}
            <circle cx="0" cy="0" r="4" fill="#16a34a" />
            <text x="0" y="45" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">Root Cross-Section</text>
            <text x="40" y="-18" fontSize="10" className="fill-purple-500 dark:fill-purple-400">velamen</text>
            <text x="40" y="-6" fontSize="10" className="fill-purple-500 dark:fill-purple-400">(spongy layer)</text>
            <text x="40" y="10" fontSize="10" className="fill-green-500 dark:fill-green-400">cortex</text>
            <text x="40" y="22" fontSize="10" className="fill-green-600 dark:fill-green-400">vascular</text>
          </g>

          {/* Pseudobulb */}
          <ellipse cx="0" cy="20" rx="18" ry="28" fill="#22c55e" opacity="0.5" stroke="#16a34a" strokeWidth="1.5" />
          <text x="60" y="20" fontSize="10" className="fill-green-600 dark:fill-green-400">pseudobulb</text>
          <text x="60" y="32" fontSize="10" className="fill-green-600 dark:fill-green-400">(water storage)</text>

          {/* Leaves */}
          <path d="M -5,-10 Q -30,-50 -15,-90" stroke="#16a34a" strokeWidth="2" fill="#22c55e" opacity="0.6" />
          <path d="M 5,-10 Q 30,-50 15,-90" stroke="#16a34a" strokeWidth="2" fill="#22c55e" opacity="0.6" />
          <path d="M 0,-15 Q 5,-60 0,-100" stroke="#16a34a" strokeWidth="2" fill="#22c55e" opacity="0.6" />

          {/* Flower */}
          <g transform="translate(35, -80)">
            <ellipse cx="-8" cy="-8" rx="10" ry="6" fill="#d946ef" opacity="0.7" />
            <ellipse cx="8" cy="-8" rx="10" ry="6" fill="#d946ef" opacity="0.7" />
            <ellipse cx="0" cy="4" rx="8" ry="10" fill="#f0abfc" opacity="0.8" />
            <circle cx="0" cy="0" r="3" fill="#fcd34d" />
          </g>
        </g>

        {/* Moisture arrows */}
        <g transform="translate(500, 100)">
          <rect x="-100" y="0" width="250" height="140" rx="8" className="fill-blue-50 dark:fill-blue-950" opacity="0.5" />
          <text x="25" y="22" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            How Epiphytes Get Water
          </text>
          <text x="25" y="42" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{"\u2022"} Rain running down bark</text>
          <text x="25" y="58" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{"\u2022"} Mist and cloud moisture</text>
          <text x="25" y="74" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{"\u2022"} Humid air (velamen absorbs)</text>
          <text x="25" y="94" fontSize="11" fontWeight="600" className="fill-blue-500 dark:fill-blue-400">How Epiphytes Get Nutrients</text>
          <text x="25" y="110" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{"\u2022"} Dust and debris on bark</text>
          <text x="25" y="126" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{"\u2022"} Dissolved minerals in rainwater</text>
        </g>

        {/* Key difference box */}
        <g transform="translate(500, 280)">
          <rect x="-100" y="0" width="250" height="100" rx="8" className="fill-fuchsia-50 dark:fill-fuchsia-950" opacity="0.5" />
          <text x="25" y="22" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-fuchsia-700 dark:fill-fuchsia-300">
            Epiphyte {"\u2260"} Parasite
          </text>
          <text x="25" y="42" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{"\u2718"} Roots do NOT penetrate bark</text>
          <text x="25" y="58" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{"\u2718"} Does NOT steal sap or sugar</text>
          <text x="25" y="74" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{"\u2714"} Uses tree only as platform</text>
          <text x="25" y="90" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{"\u2714"} Makes own food via photosynthesis</text>
        </g>

        {/* Bottom note */}
        <g transform="translate(390, 420)">
          <rect x="-260" y="0" width="520" height="45" rx="6" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.5" />
          <text x="0" y="18" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">
            One large tree in NE India{"\u2019"}s cloud forests can host 50+ epiphyte species:
          </text>
          <text x="0" y="36" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">
            orchids, ferns, mosses, lichens {"\u2014"} a vertical ecosystem from ground to canopy
          </text>
        </g>

        <text x="390" y="508" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Epiphyte anatomy: aerial roots with velamen absorb moisture without harming the host tree
        </text>
      </svg>
    </div>
  );
}
