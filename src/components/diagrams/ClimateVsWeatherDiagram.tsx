export default function ClimateVsWeatherDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" role="img"
        aria-label="Side-by-side comparison of climate versus weather">
        <rect width="520" height="340" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Climate vs Weather
        </text>

        {/* Weather box */}
        <rect x="20" y="45" width="230" height="245" rx="8" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="20" y="45" width="230" height="30" rx="8 8 0 0" fill="#1e40af" opacity="0.3" />
        <text x="135" y="65" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#93c5fd">WEATHER</text>

        <text x="135" y="95" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">What you get today</text>

        {/* Weather icons row */}
        <text x="60" y="128" fontSize="22">&#x2600;&#xFE0F;</text>
        <text x="105" y="128" fontSize="22">&#x1F327;&#xFE0F;</text>
        <text x="150" y="128" fontSize="22">&#x26C8;&#xFE0F;</text>
        <text x="195" y="128" fontSize="22">&#x2744;&#xFE0F;</text>

        <text x="135" y="155" textAnchor="middle" fontSize="10" fill="#94a3b8">Changes hour by hour, day by day</text>
        <text x="135" y="172" textAnchor="middle" fontSize="10" fill="#94a3b8">Specific place and time</text>
        <text x="135" y="189" textAnchor="middle" fontSize="10" fill="#94a3b8">Temperature, humidity, wind,</text>
        <text x="135" y="203" textAnchor="middle" fontSize="10" fill="#94a3b8">cloud cover, precipitation</text>

        {/* Weather graph - jagged */}
        <text x="40" y="230" fontSize="10" fill="#64748b">T</text>
        <line x1="48" y1="220" x2="48" y2="270" stroke="#475569" strokeWidth="1" />
        <line x1="48" y1="270" x2="225" y2="270" stroke="#475569" strokeWidth="1" />
        <polyline points="55,250 70,235 85,255 100,230 115,260 130,240 145,225 160,258 175,242 190,250 205,238 220,255"
          fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="137" y="285" textAnchor="middle" fontSize="10" fill="#64748b">Days</text>

        {/* Climate box */}
        <rect x="270" y="45" width="230" height="245" rx="8" fill="none" stroke="#f87171" strokeWidth="1.5" />
        <rect x="270" y="45" width="230" height="30" rx="8 8 0 0" fill="#991b1b" opacity="0.3" />
        <text x="385" y="65" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fca5a5">CLIMATE</text>

        <text x="385" y="95" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f87171">What you expect over decades</text>

        {/* Climate pattern */}
        <text x="340" y="128" fontSize="22">&#x1F321;&#xFE0F;</text>
        <text x="400" y="128" fontSize="22">&#x1F4CA;</text>

        <text x="385" y="155" textAnchor="middle" fontSize="10" fill="#94a3b8">Average of 30+ years of weather</text>
        <text x="385" y="172" textAnchor="middle" fontSize="10" fill="#94a3b8">Long-term pattern for a region</text>
        <text x="385" y="189" textAnchor="middle" fontSize="10" fill="#94a3b8">Determines crops, buildings,</text>
        <text x="385" y="203" textAnchor="middle" fontSize="10" fill="#94a3b8">clothing, disease patterns</text>

        {/* Climate graph - smooth trend */}
        <text x="288" y="230" fontSize="10" fill="#64748b">T</text>
        <line x1="298" y1="220" x2="298" y2="270" stroke="#475569" strokeWidth="1" />
        <line x1="298" y1="270" x2="475" y2="270" stroke="#475569" strokeWidth="1" />
        <path d="M 305 258 Q 340 255, 370 250 Q 410 243, 440 235 Q 460 228, 470 222"
          fill="none" stroke="#f87171" strokeWidth="2" />
        <text x="387" y="285" textAnchor="middle" fontSize="10" fill="#64748b">Decades</text>

        {/* Key insight */}
        <rect x="60" y="300" width="400" height="30" rx="6" fill="none" stroke="#fbbf24" strokeWidth="1" />
        <text x="260" y="320" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">
          Climate is what you expect. Weather is what you get.
        </text>
      </svg>
    </div>
  );
}
