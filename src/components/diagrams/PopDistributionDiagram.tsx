export default function PopDistributionDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" role="img"
        aria-label="World map showing population density hotspots">
        <rect width="520" height="360" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Population Distribution: Where People Live
        </text>

        {/* Simplified world map outline */}
        {/* North America */}
        <path d="M 50 90 Q 60 70, 90 65 Q 120 60, 140 75 Q 150 85, 140 110 Q 130 140, 110 150 Q 100 155, 90 145 Q 70 130, 55 110 Z"
          fill="none" stroke="#475569" strokeWidth="1" />
        {/* South America */}
        <path d="M 105 160 Q 115 155, 125 165 Q 135 190, 130 220 Q 125 250, 115 260 Q 105 265, 100 250 Q 95 220, 100 190 Z"
          fill="none" stroke="#475569" strokeWidth="1" />
        {/* Europe */}
        <path d="M 230 65 Q 250 55, 270 60 Q 280 65, 275 80 Q 265 90, 250 85 Q 235 80, 230 65 Z"
          fill="none" stroke="#475569" strokeWidth="1" />
        {/* Africa */}
        <path d="M 240 100 Q 260 95, 280 105 Q 290 130, 285 160 Q 275 190, 260 200 Q 245 195, 240 170 Q 235 140, 240 100 Z"
          fill="none" stroke="#475569" strokeWidth="1" />
        {/* Asia */}
        <path d="M 290 55 Q 340 45, 390 55 Q 420 65, 440 80 Q 450 100, 430 110 Q 410 120, 380 115 Q 350 130, 320 120 Q 300 110, 290 90 Q 285 70, 290 55 Z"
          fill="none" stroke="#475569" strokeWidth="1" />
        {/* India */}
        <path d="M 330 115 Q 340 110, 355 120 Q 360 140, 350 155 Q 340 160, 330 150 Q 325 135, 330 115 Z"
          fill="none" stroke="#475569" strokeWidth="1" />
        {/* Australia */}
        <path d="M 400 190 Q 430 180, 450 195 Q 460 210, 445 225 Q 420 230, 405 215 Q 395 200, 400 190 Z"
          fill="none" stroke="#475569" strokeWidth="1" />

        {/* Population hotspot dots (size = density) */}
        {/* East Asia */}
        <circle cx="400" cy="85" r="18" fill="#f87171" opacity="0.4" />
        <circle cx="400" cy="85" r="10" fill="#f87171" opacity="0.5" />
        <text x="400" y="89" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fca5a5">1.4B</text>

        {/* South Asia */}
        <circle cx="345" cy="135" r="16" fill="#f87171" opacity="0.4" />
        <circle cx="345" cy="135" r="9" fill="#f87171" opacity="0.5" />
        <text x="345" y="139" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fca5a5">1.4B</text>

        {/* SE Asia */}
        <circle cx="385" cy="120" r="12" fill="#fb923c" opacity="0.4" />
        <text x="385" y="124" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fdba74">700M</text>

        {/* Europe */}
        <circle cx="255" cy="72" r="10" fill="#fbbf24" opacity="0.4" />
        <text x="255" y="76" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fde68a">450M</text>

        {/* E. North America */}
        <circle cx="105" cy="95" r="8" fill="#fbbf24" opacity="0.35" />

        {/* W. Africa / Nigeria */}
        <circle cx="250" cy="130" r="10" fill="#fb923c" opacity="0.35" />

        {/* Sparse areas */}
        <text x="80" y="240" textAnchor="middle" fontSize="10" fill="#64748b">Sparse</text>
        <text x="430" y="210" textAnchor="middle" fontSize="10" fill="#64748b">Sparse</text>

        {/* NE India callout */}
        <rect x="360" y="145" width="5" height="5" rx="1" fill="#34d399" />
        <line x1="363" y1="150" x2="420" y2="175" stroke="#34d399" strokeWidth="1" strokeDasharray="3,2" />
        <text x="420" y="172" fontSize="10" fontWeight="bold" fill="#6ee7b7">NE India</text>
        <text x="420" y="184" fontSize="10" fill="#6ee7b7">170/km2</text>

        {/* Legend */}
        <rect x="30" y="275" width="460" height="75" rx="6" fill="none" stroke="#475569" strokeWidth="1" />
        <text x="260" y="293" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e2e8f0">Factors Controlling Distribution</text>

        <circle cx="70" cy="315" r="5" fill="#34d399" opacity="0.5" />
        <text x="82" y="319" fontSize="10" fill="#94a3b8">Flat, fertile land</text>

        <circle cx="190" cy="315" r="5" fill="#60a5fa" opacity="0.5" />
        <text x="202" y="319" fontSize="10" fill="#94a3b8">Near rivers/coast</text>

        <circle cx="330" cy="315" r="5" fill="#fbbf24" opacity="0.5" />
        <text x="342" y="319" fontSize="10" fill="#94a3b8">Economic opportunity</text>

        <text x="260" y="340" textAnchor="middle" fontSize="10" fill="#fbbf24">
          Most people live below 500 m elevation, near water, in temperate or tropical climates
        </text>
      </svg>
    </div>
  );
}
