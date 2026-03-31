export default function FishUmiamLakeDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 600 400" className="w-full max-w-xl mx-auto" role="img" aria-label="Diagram of Umiam Lake ecology showing light zones, thermal layers, and how clarity affects fish iridescence">
        <defs>
          <linearGradient id="lakeDepth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#0891b2" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#164e63" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <text x="300" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Umiam Lake — Meghalaya’s Mirror</text>

        {/* Sky */}
        <rect x="30" y="35" width="540" height="50" rx="6" fill="url(#skyGrad)" className="dark:opacity-40" />

        {/* Sun */}
        <circle cx="100" cy="55" r="16" className="fill-yellow-300 dark:fill-yellow-500" opacity="0.8" />
        <text x="100" y="59" textAnchor="middle" className="fill-yellow-700 dark:fill-yellow-200" fontSize="10">☀</text>

        {/* Hill silhouettes */}
        <path d="M30,85 Q80,50 130,85 Q180,50 230,85 L230,85 Z" className="fill-green-700 dark:fill-green-900" opacity="0.3" />
        <path d="M370,85 Q420,55 470,85 Q520,55 570,85 L570,85 Z" className="fill-green-700 dark:fill-green-900" opacity="0.3" />
        <text x="80" y="80" className="fill-green-800 dark:fill-green-400" fontSize="10">Khasi Hills</text>
        <text x="430" y="80" className="fill-green-800 dark:fill-green-400" fontSize="10">pine forests</text>

        {/* Lake water */}
        <rect x="30" y="85" width="540" height="250" rx="6" fill="url(#lakeDepth)" className="dark:opacity-70" />

        {/* Surface line */}
        <line x1="30" y1="85" x2="570" y2="85" className="stroke-cyan-300 dark:stroke-cyan-600" strokeWidth="2" />
        <text x="300" y="100" textAnchor="middle" className="fill-white dark:fill-cyan-200" fontSize="10" fontWeight="bold">Surface — elevation ~1,000 m</text>

        {/* Light rays entering water */}
        <line x1="110" y1="55" x2="150" y2="85" className="stroke-yellow-400" strokeWidth="1.5" opacity="0.8" />
        <line x1="110" y1="55" x2="180" y2="85" className="stroke-yellow-400" strokeWidth="1.5" opacity="0.8" />
        <line x1="150" y1="85" x2="170" y2="160" className="stroke-yellow-300" strokeWidth="1" opacity="0.6" strokeDasharray="4,3" />
        <line x1="180" y1="85" x2="210" y2="200" className="stroke-yellow-300" strokeWidth="1" opacity="0.4" strokeDasharray="4,3" />

        {/* Photic zone */}
        <rect x="40" y="88" width="110" height="90" rx="4" fill="none" className="stroke-yellow-400 dark:stroke-yellow-500" strokeWidth="1" strokeDasharray="5,3" />
        <text x="95" y="108" textAnchor="middle" className="fill-yellow-200 dark:fill-yellow-400" fontSize="10" fontWeight="bold">Photic zone</text>
        <text x="95" y="122" textAnchor="middle" className="fill-yellow-100 dark:fill-yellow-300" fontSize="10">Sunlight reaches</text>
        <text x="95" y="136" textAnchor="middle" className="fill-yellow-100 dark:fill-yellow-300" fontSize="10">here → algae grow</text>

        {/* Thermal layers */}
        <text x="450" y="112" className="fill-red-300 dark:fill-red-400" fontSize="10" fontWeight="bold">Epilimnion (warm)</text>
        <text x="450" y="126" className="fill-red-200 dark:fill-red-300" fontSize="10">~20–25°C in summer</text>

        <line x1="350" y1="155" x2="560" y2="155" className="stroke-orange-300 dark:stroke-orange-500" strokeWidth="1.5" strokeDasharray="6,3" />
        <text x="450" y="170" className="fill-orange-300 dark:fill-orange-400" fontSize="10" fontWeight="bold">Thermocline</text>
        <text x="450" y="184" className="fill-orange-200 dark:fill-orange-300" fontSize="10">Temperature drops sharply</text>

        <text x="450" y="220" className="fill-blue-300 dark:fill-blue-400" fontSize="10" fontWeight="bold">Hypolimnion (cold)</text>
        <text x="450" y="234" className="fill-blue-200 dark:fill-blue-300" fontSize="10">~8–12°C year-round</text>

        {/* Fish with shimmer */}
        <text x="220" y="155" className="fill-white" fontSize="22">\uD83D\uDC1F</text>
        <text x="260" y="148" className="fill-cyan-200 dark:fill-cyan-300" fontSize="10">Iridescent fish!</text>
        <text x="260" y="162" className="fill-cyan-100 dark:fill-cyan-300" fontSize="10">Clear water lets</text>
        <text x="260" y="176" className="fill-cyan-100 dark:fill-cyan-300" fontSize="10">sunlight reach scales</text>

        {/* Clarity comparison boxes */}
        <rect x="40" y="200" width="150" height="60" rx="5" className="fill-green-900/30 dark:fill-green-900/40" />
        <text x="115" y="218" textAnchor="middle" className="fill-green-300 dark:fill-green-400" fontSize="10" fontWeight="bold">✓ Clear water</text>
        <text x="115" y="234" textAnchor="middle" className="fill-green-200 dark:fill-green-300" fontSize="10">Light penetrates deep</text>
        <text x="115" y="248" textAnchor="middle" className="fill-green-200 dark:fill-green-300" fontSize="10">Fish colors vivid</text>

        <rect x="200" y="200" width="150" height="60" rx="5" className="fill-amber-900/30 dark:fill-amber-900/40" />
        <text x="275" y="218" textAnchor="middle" className="fill-amber-300 dark:fill-amber-400" fontSize="10" fontWeight="bold">✗ Turbid water</text>
        <text x="275" y="234" textAnchor="middle" className="fill-amber-200 dark:fill-amber-300" fontSize="10">Particles scatter light</text>
        <text x="275" y="248" textAnchor="middle" className="fill-amber-200 dark:fill-amber-300" fontSize="10">Colors muted, dull</text>

        {/* Algae note */}
        <text x="95" y="284" textAnchor="middle" className="fill-green-400 dark:fill-green-500" fontSize="10">●</text>
        <text x="95" y="284" textAnchor="middle" className="fill-green-400 dark:fill-green-500" fontSize="14">·</text>
        <text x="115" y="288" className="fill-green-300 dark:fill-green-400" fontSize="10">Algae — microscopic plants</text>
        <text x="115" y="302" className="fill-green-200 dark:fill-green-300" fontSize="10">Too much = murky green water</text>
        <text x="115" y="316" className="fill-green-200 dark:fill-green-300" fontSize="10">Just right = healthy ecosystem</text>

        {/* Lake bed */}
        <rect x="30" y="330" width="540" height="10" rx="3" className="fill-amber-800 dark:fill-amber-900" opacity="0.4" />

        {/* Bottom fact */}
        <rect x="60" y="350" width="480" height="40" rx="6" className="fill-teal-50 dark:fill-teal-900/30" />
        <text x="300" y="368" textAnchor="middle" className="fill-teal-700 dark:fill-teal-300" fontSize="10" fontWeight="bold">Umiam Lake: 220 hectares, 15 km from Shillong</text>
        <text x="300" y="382" textAnchor="middle" className="fill-teal-600 dark:fill-teal-400" fontSize="10">Created in 1965 by damming the Umiam River. Pine-forested watershed keeps sediment low → clear water.</text>
      </svg>
    </div>
  );
}
