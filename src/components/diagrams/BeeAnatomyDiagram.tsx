export default function BeeAnatomyDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 565 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee anatomy diagram showing compound eyes, antennae, pollen baskets, and stinger">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Honey Bee Anatomy</text>

        {/* Bee body — large side view */}
        <g transform="translate(260, 200)">
          {/* Head */}
          <ellipse cx="-100" cy="-10" rx="35" ry="30" className="fill-gray-100 dark:fill-slate-800" stroke="#eab308" strokeWidth="1.5" />
          {/* Compound eye */}
          <ellipse cx="-115" cy="-20" rx="14" ry="18" fill="#78350f" stroke="#a16207" strokeWidth="1" />
          {/* Ocelli (simple eyes) */}
          <circle cx="-95" cy="-32" r="3" fill="#d97706" />
          <circle cx="-100" cy="-35" r="3" fill="#d97706" />
          <circle cx="-105" cy="-32" r="3" fill="#d97706" />

          {/* Antennae */}
          <path d="M -90,-30 Q -70,-60 -55,-70" fill="none" stroke="#a16207" strokeWidth="2" />
          <path d="M -85,-35 Q -60,-65 -45,-72" fill="none" stroke="#a16207" strokeWidth="2" />
          <circle cx="-55" cy="-70" r="2" fill="#d97706" />
          <circle cx="-45" cy="-72" r="2" fill="#d97706" />

          {/* Proboscis (tongue) */}
          <path d="M -105,15 Q -100,35 -95,45" fill="none" stroke="#d97706" strokeWidth="2" />

          {/* Thorax */}
          <ellipse cx="-30" cy="-5" rx="40" ry="32" fill="#eab308" stroke="#d97706" strokeWidth="1.5" />
          {/* Fuzzy texture */}
          {[[-45, -15], [-35, -25], [-25, -18], [-15, -25], [-30, 10], [-20, 15]].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="1.5" fill="#fcd34d" opacity="0.5" />
          ))}

          {/* Wings */}
          <ellipse cx="-20" cy="-40" rx="45" ry="14" fill="#bfdbfe" opacity="0.25" stroke="#93c5fd" strokeWidth="0.8" transform="rotate(-10, -20, -40)" />
          <ellipse cx="-10" cy="-35" rx="30" ry="10" fill="#bfdbfe" opacity="0.2" stroke="#93c5fd" strokeWidth="0.8" transform="rotate(-5, -10, -35)" />

          {/* Abdomen */}
          <ellipse cx="50" cy="0" rx="65" ry="35" fill="#eab308" stroke="#d97706" strokeWidth="1.5" />
          {/* Stripes */}
          {[20, 40, 60, 75].map((xOff) => (
            <ellipse key={xOff} cx={xOff} cy="0" rx="6" ry="33" className="fill-gray-100 dark:fill-slate-800" opacity="0.5" />
          ))}

          {/* Legs (3 pairs) */}
          {/* Front legs */}
          <line x1="-50" y1="20" x2="-65" y2="55" stroke="#a16207" strokeWidth="2.5" />
          <line x1="-65" y1="55" x2="-55" y2="70" stroke="#a16207" strokeWidth="2" />
          {/* Middle legs */}
          <line x1="-20" y1="25" x2="-25" y2="60" stroke="#a16207" strokeWidth="2.5" />
          <line x1="-25" y1="60" x2="-15" y2="75" stroke="#a16207" strokeWidth="2" />
          {/* Hind legs with pollen baskets */}
          <line x1="20" y1="28" x2="15" y2="62" stroke="#a16207" strokeWidth="2.5" />
          <line x1="15" y1="62" x2="25" y2="78" stroke="#a16207" strokeWidth="2" />
          {/* Pollen basket (corbicula) */}
          <ellipse cx="18" cy="60" rx="8" ry="12" fill="#f59e0b" opacity="0.6" stroke="#fbbf24" strokeWidth="1.5" />

          {/* Stinger */}
          <line x1="115" y1="0" x2="130" y2="0" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2.5" />
          <polygon points="130,0 140,-3 140,3" className="fill-gray-100 dark:fill-slate-800" />
        </g>

        {/* Labels with leader lines */}
        {/* Compound eye */}
        <line x1="130" y1="175" x2="80" y2="135" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="60" y="130" fontSize="9" fontWeight="bold" fill="#fbbf24">Compound Eye</text>
        <text x="60" y="142" fontSize="7" className="fill-gray-500 dark:fill-slate-400">~6,900 facets (ommatidia)</text>
        <text x="60" y="152" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Sees UV light, detects polarization</text>

        {/* Ocelli */}
        <line x1="160" y1="163" x2="130" y2="120" stroke="#d97706" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="108" y="116" fontSize="8" fontWeight="bold" fill="#d97706">3 Ocelli</text>

        {/* Antennae */}
        <line x1="210" y1="128" x2="240" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="245" y="95" fontSize="9" fontWeight="bold" fill="#fbbf24">Antennae</text>
        <text x="245" y="107" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Smell, touch, taste, temperature</text>
        <text x="245" y="117" fontSize="7" className="fill-gray-500 dark:fill-slate-400">~170 odor receptors</text>

        {/* Proboscis */}
        <line x1="160" y1="240" x2="120" y2="260" stroke="#d97706" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="50" y="265" fontSize="9" fontWeight="bold" fill="#d97706">Proboscis</text>
        <text x="50" y="277" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Straw-like tongue for nectar</text>

        {/* Wings */}
        <line x1="240" y1="158" x2="240" y2="85" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="155" y="80" fontSize="9" fontWeight="bold" fill="#93c5fd">Wings (2 pairs)</text>
        <text x="155" y="92" fontSize="7" className="fill-gray-500 dark:fill-slate-400">230 beats/sec, ~24 km/h</text>

        {/* Pollen basket */}
        <line x1="278" y1="260" x2="278" y2="300" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="278" y="312" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fbbf24">Pollen Basket</text>
        <text x="278" y="324" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">(Corbicula) on hind legs</text>
        <text x="278" y="334" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Carries pollen back to hive</text>

        {/* Stinger */}
        <line x1="390" y1="200" x2="430" y2="200" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="435" y="195" fontSize="9" fontWeight="bold" fill="#ef4444">Stinger</text>
        <text x="435" y="207" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Barbed — stays in skin</text>
        <text x="435" y="217" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Workers die after stinging</text>

        {/* Body section labels at bottom */}
        <g transform="translate(260, 375)">
          <rect x="-200" y="-12" width="80" height="18" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#eab308" strokeWidth="1" />
          <text x="-160" y="2" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#eab308">Head</text>
          <rect x="-80" y="-12" width="80" height="18" rx="4" fill="#eab308" opacity="0.2" stroke="#eab308" strokeWidth="1" />
          <text x="-40" y="2" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#eab308">Thorax</text>
          <rect x="40" y="-12" width="100" height="18" rx="4" fill="#eab308" opacity="0.35" stroke="#eab308" strokeWidth="1" />
          <text x="90" y="2" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#eab308">Abdomen</text>
        </g>
      </svg>
    </div>
  );
}
