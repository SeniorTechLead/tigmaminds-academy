export default function ClimateFactorsDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 540 280" className="w-full max-w-2xl mx-auto" role="img" aria-label="Five factors affecting climate">
        {/* Title */}
        <text x="270" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Factors Affecting Climate
        </text>

        {/* --- Factor 1: Latitude (Sun Angle) --- */}
        <g>
          <rect x="10" y="40" width="100" height="110" rx="6" className="fill-orange-50 dark:fill-orange-950" stroke="#fb923c" strokeWidth="1" />
          {/* Sun icon */}
          <circle cx="60" cy="65" r="12" className="fill-yellow-400" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line key={`s1-${angle}`}
                x1={60 + Math.cos(rad) * 15} y1={65 + Math.sin(rad) * 15}
                x2={60 + Math.cos(rad) * 20} y2={65 + Math.sin(rad) * 20}
                className="stroke-yellow-400" strokeWidth="1.5" />
            );
          })}
          {/* Angled rays hitting surface */}
          <line x1="55" y1="77" x2="40" y2="100" className="stroke-yellow-500" strokeWidth="1" />
          <line x1="65" y1="77" x2="80" y2="100" className="stroke-yellow-500" strokeWidth="1" />
          <line x1="25" y1="100" x2="95" y2="100" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
          <text x="60" y="118" textAnchor="middle" className="fill-orange-700 dark:fill-orange-300" fontSize="11" fontWeight="bold">Latitude</text>
          <text x="60" y="130" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Sun angle</text>
          <text x="60" y="142" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">varies</text>
        </g>

        {/* --- Factor 2: Altitude --- */}
        <g>
          <rect x="118" y="40" width="100" height="110" rx="6" className="fill-blue-50 dark:fill-blue-950" stroke="#60a5fa" strokeWidth="1" />
          {/* Mountain with temperature gradient */}
          <polygon points="168,100 138,100 168,58" className="fill-stone-400 dark:fill-stone-600" />
          <polygon points="168,100 198,100 168,58" className="fill-stone-500 dark:fill-stone-700" />
          {/* Snow cap */}
          <polygon points="168,58 158,72 178,72" className="fill-white dark:fill-gray-300" />
          {/* Temperature arrows */}
          <line x1="200" y1="98" x2="200" y2="62" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
          <polygon points="200,60 196,68 204,68" className="fill-blue-500 dark:fill-blue-400" />
          <text x="210" y="75" className="fill-blue-500 dark:fill-blue-400" fontSize="9">Cooler</text>
          <text x="210" y="98" className="fill-red-500 dark:fill-red-400" fontSize="9">Warmer</text>
          <text x="168" y="118" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">Altitude</text>
          <text x="168" y="130" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Higher = cooler</text>
          <text x="168" y="142" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">6.5°C/km drop</text>
        </g>

        {/* --- Factor 3: Distance from Sea --- */}
        <g>
          <rect x="226" y="40" width="100" height="110" rx="6" className="fill-cyan-50 dark:fill-cyan-950" stroke="#22d3ee" strokeWidth="1" />
          {/* Sea and land */}
          <rect x="236" y="75" width="35" height="25" className="fill-blue-400 dark:fill-blue-600" rx="2" />
          <text x="253" y="92" textAnchor="middle" className="fill-blue-100" fontSize="9">Sea</text>
          <rect x="281" y="75" width="35" height="25" className="fill-green-600 dark:fill-green-700" rx="2" />
          <text x="298" y="92" textAnchor="middle" className="fill-green-100" fontSize="9">Land</text>
          {/* Double arrow */}
          <line x1="253" y1="68" x2="298" y2="68" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
          <polygon points="296,65 300,68 296,71" className="fill-gray-500 dark:fill-gray-400" />
          <polygon points="256,65 252,68 256,71" className="fill-gray-500 dark:fill-gray-400" />
          <text x="276" y="118" textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300" fontSize="11" fontWeight="bold">Distance</text>
          <text x="276" y="130" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">from sea</text>
          <text x="276" y="142" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Moderates temp</text>
        </g>

        {/* --- Factor 4: Ocean Currents --- */}
        <g>
          <rect x="334" y="40" width="100" height="110" rx="6" className="fill-teal-50 dark:fill-teal-950" stroke="#2dd4bf" strokeWidth="1" />
          {/* Wavy current arrows */}
          <path d="M 350,70 Q 365,60 380,70 Q 395,80 410,70" fill="none" className="stroke-red-400" strokeWidth="2" />
          <polygon points="410,67 414,70 410,73" className="fill-red-400" />
          <text x="415" y="65" className="fill-red-500 dark:fill-red-400" fontSize="9">Warm</text>

          <path d="M 350,90 Q 365,80 380,90 Q 395,100 410,90" fill="none" className="stroke-blue-400" strokeWidth="2" />
          <polygon points="410,87 414,90 410,93" className="fill-blue-400" />
          <text x="415" y="95" className="fill-blue-500 dark:fill-blue-400" fontSize="9">Cool</text>

          <text x="384" y="118" textAnchor="middle" className="fill-teal-700 dark:fill-teal-300" fontSize="11" fontWeight="bold">Ocean</text>
          <text x="384" y="130" textAnchor="middle" className="fill-teal-700 dark:fill-teal-300" fontSize="11" fontWeight="bold">Currents</text>
          <text x="384" y="142" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Move heat</text>
        </g>

        {/* --- Factor 5: Rain Shadow --- */}
        <g>
          <rect x="442" y="40" width="90" height="110" rx="6" className="fill-purple-50 dark:fill-purple-950" stroke="#a78bfa" strokeWidth="1" />
          {/* Mountain and rain shadow */}
          <polygon points="487,100 462,100 487,60" className="fill-stone-400 dark:fill-stone-600" />
          <polygon points="487,100 512,100 487,60" className="fill-stone-300 dark:fill-stone-500" />
          {/* Cloud on windward side */}
          <ellipse cx="465" cy="65" rx="12" ry="7" className="fill-gray-300 dark:fill-gray-500" />
          {/* Rain drops */}
          <line x1="460" y1="73" x2="460" y2="80" className="stroke-blue-400" strokeWidth="1" />
          <line x1="468" y1="73" x2="468" y2="80" className="stroke-blue-400" strokeWidth="1" />
          {/* Dry side label */}
          <text x="505" y="85" className="fill-amber-600 dark:fill-amber-400" fontSize="9">Dry</text>

          <text x="487" y="118" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="11" fontWeight="bold">Rain</text>
          <text x="487" y="130" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="11" fontWeight="bold">Shadow</text>
          <text x="487" y="142" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">Blocks moisture</text>
        </g>

        {/* Summary line */}
        <text x="270" y="175" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          These five factors together determine the climate of a region.
        </text>

        {/* NE India example box */}
        <rect x="100" y="190" width="340" height="80" rx="6" className="fill-emerald-50 dark:fill-emerald-950" stroke="#34d399" strokeWidth="1" />
        <text x="270" y="210" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="11" fontWeight="bold">
          NE India Example
        </text>
        <text x="270" y="226" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">
          Low latitude (tropical) + low altitude + near Bay of Bengal
        </text>
        <text x="270" y="240" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">
          + warm ocean currents + orographic rain (Khasi Hills)
        </text>
        <text x="270" y="256" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10">
          = Humid subtropical, heavy monsoons, Cherrapunji among wettest places
        </text>
      </svg>
    </div>
  );
}
