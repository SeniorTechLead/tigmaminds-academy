export default function OceanDepthZonesDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 520 420" className="w-full h-auto" role="img"
        aria-label="Diagram showing ocean depth zones with pressure and temperature gradients">
        <rect width="520" height="420" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Ocean Depth Zones
        </text>

        {/* Zone backgrounds */}
        <rect x="120" y="45" width="260" height="55" rx="4" fill="#60a5fa" opacity="0.35" />
        <rect x="120" y="100" width="260" height="65" rx="0" fill="#3b82f6" opacity="0.3" />
        <rect x="120" y="165" width="260" height="65" rx="0" fill="#1d4ed8" opacity="0.3" />
        <rect x="120" y="230" width="260" height="65" rx="0" fill="#1e3a8a" opacity="0.35" />
        <rect x="120" y="295" width="260" height="65" rx="0" fill="#172554" opacity="0.4" />
        <rect x="120" y="360" width="260" height="45" rx="4" fill="#0f172a" opacity="0.5" />

        {/* Zone labels */}
        <text x="250" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#93c5fd">Epipelagic (Sunlight Zone)</text>
        <text x="250" y="78" textAnchor="middle" fontSize="10" fill="#bfdbfe">0-200 m | Phytoplankton, fish, coral</text>

        <text x="250" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">Mesopelagic (Twilight Zone)</text>
        <text x="250" y="140" textAnchor="middle" fontSize="10" fill="#93c5fd">200-1,000 m | Dim light, jellyfish</text>

        <text x="250" y="192" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#3b82f6">Bathypelagic (Midnight Zone)</text>
        <text x="250" y="207" textAnchor="middle" fontSize="10" fill="#60a5fa">1,000-4,000 m | Total darkness</text>

        <text x="250" y="258" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2563eb">Abyssopelagic (Abyss)</text>
        <text x="250" y="273" textAnchor="middle" fontSize="10" fill="#3b82f6">4,000-6,000 m | Near freezing</text>

        <text x="250" y="323" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1d4ed8">Hadopelagic (Trenches)</text>
        <text x="250" y="338" textAnchor="middle" fontSize="10" fill="#2563eb">6,000-11,000 m | 1,000+ atm</text>

        {/* Organisms */}
        <text x="370" y="78" fontSize="14">&#x1F41F;</text>
        <text x="370" y="142" fontSize="14">&#x1FAB8;</text>
        <text x="370" y="207" fontSize="10" fill="#fbbf24">&#x2728;</text>
        <text x="366" y="220" fontSize="10" fill="#fbbf24">Bioluminescent</text>
        <text x="370" y="273" fontSize="14">&#x1F991;</text>
        <text x="370" y="338" fontSize="10" fill="#f87171">Hydrothermal vents</text>

        {/* Seabed */}
        <rect x="120" y="395" width="260" height="10" rx="4" fill="#713f12" opacity="0.5" />
        <text x="250" y="404" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ca8a04">Challenger Deep: 10,935 m</text>

        {/* Light penetration arrow */}
        <text x="55" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Light</text>
        <line x1="55" y1="60" x2="55" y2="105" stroke="#fbbf24" strokeWidth="2" />
        <line x1="55" y1="105" x2="55" y2="160" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
        <text x="55" y="120" textAnchor="middle" fontSize="10" fill="#fbbf24" opacity="0.6">fades</text>
        <text x="55" y="175" textAnchor="middle" fontSize="10" fill="#64748b">None</text>

        {/* Pressure scale */}
        <text x="460" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f87171">Pressure</text>
        <line x1="460" y1="62" x2="460" y2="390" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#depthArr)" />
        <text x="460" y="105" textAnchor="middle" fontSize="10" fill="#fca5a5">20 atm</text>
        <text x="460" y="175" textAnchor="middle" fontSize="10" fill="#fca5a5">100 atm</text>
        <text x="460" y="245" textAnchor="middle" fontSize="10" fill="#fca5a5">400 atm</text>
        <text x="460" y="320" textAnchor="middle" fontSize="10" fill="#fca5a5">600 atm</text>
        <text x="460" y="380" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f87171">1,100 atm</text>

        {/* Temperature scale */}
        <text x="30" y="250" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">Temp</text>
        <text x="30" y="80" textAnchor="middle" fontSize="10" fill="#6ee7b7">25 degrees C</text>
        <text x="30" y="210" textAnchor="middle" fontSize="10" fill="#6ee7b7">4 degrees C</text>
        <text x="30" y="350" textAnchor="middle" fontSize="10" fill="#6ee7b7">1-4 degrees C</text>

        <defs>
          <marker id="depthArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#f87171" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
