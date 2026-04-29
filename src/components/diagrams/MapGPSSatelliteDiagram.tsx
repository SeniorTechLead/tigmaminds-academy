export default function MapGPSSatelliteDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" role="img"
        aria-label="Diagram showing GPS trilateration from three satellites to determine position">
        <rect width="520" height="380" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          GPS: Trilateration from Satellites
        </text>

        {/* Satellite 1 */}
        <rect x="70" y="55" width="36" height="18" rx="3" fill="#475569" />
        <line x1="65" y1="64" x2="56" y2="54" stroke="#60a5fa" strokeWidth="2" />
        <line x1="65" y1="64" x2="56" y2="74" stroke="#60a5fa" strokeWidth="2" />
        <line x1="106" y1="64" x2="116" y2="54" stroke="#60a5fa" strokeWidth="2" />
        <line x1="106" y1="64" x2="116" y2="74" stroke="#60a5fa" strokeWidth="2" />
        <text x="88" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Sat 1</text>

        {/* Satellite 2 */}
        <rect x="392" y="55" width="36" height="18" rx="3" fill="#475569" />
        <line x1="387" y1="64" x2="377" y2="54" stroke="#60a5fa" strokeWidth="2" />
        <line x1="387" y1="64" x2="377" y2="74" stroke="#60a5fa" strokeWidth="2" />
        <line x1="428" y1="64" x2="438" y2="54" stroke="#60a5fa" strokeWidth="2" />
        <line x1="428" y1="64" x2="438" y2="74" stroke="#60a5fa" strokeWidth="2" />
        <text x="410" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Sat 2</text>

        {/* Satellite 3 */}
        <rect x="232" y="85" width="36" height="18" rx="3" fill="#475569" />
        <line x1="227" y1="94" x2="217" y2="84" stroke="#60a5fa" strokeWidth="2" />
        <line x1="227" y1="94" x2="217" y2="104" stroke="#60a5fa" strokeWidth="2" />
        <line x1="268" y1="94" x2="278" y2="84" stroke="#60a5fa" strokeWidth="2" />
        <line x1="268" y1="94" x2="278" y2="104" stroke="#60a5fa" strokeWidth="2" />
        <text x="250" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Sat 3</text>

        {/* Distance circles (trilateration) */}
        <circle cx="88" cy="64" r="180" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5" />
        <circle cx="410" cy="64" r="200" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5" />
        <circle cx="250" cy="94" r="150" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5" />

        {/* Signal lines to receiver */}
        <line x1="88" y1="73" x2="250" y2="240" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="410" y1="73" x2="250" y2="240" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="250" y1="103" x2="250" y2="240" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" />

        {/* Distance labels */}
        <text x="155" y="160" textAnchor="middle" fontSize="10" fill="#fca5a5">d1</text>
        <text x="345" y="160" textAnchor="middle" fontSize="10" fill="#6ee7b7">d2</text>
        <text x="262" y="175" fontSize="10" fill="#fde68a">d3</text>

        {/* Receiver / Your position */}
        <circle cx="250" cy="244" r="8" fill="#fbbf24" />
        <text x="250" y="248" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#451a03">You</text>
        <text x="250" y="268" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Your Position</text>
        <text x="250" y="282" textAnchor="middle" fontSize="10" fill="#fde68a">26.14 degrees N, 91.74 degrees E</text>

        {/* Explanation boxes */}
        <rect x="20" y="300" width="230" height="65" rx="6" fill="none" stroke="#a78bfa" strokeWidth="1" />
        <text x="135" y="318" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c4b5fd">How It Works</text>
        <text x="135" y="334" textAnchor="middle" fontSize="10" fill="#94a3b8">Each satellite sends its position + exact</text>
        <text x="135" y="348" textAnchor="middle" fontSize="10" fill="#94a3b8">time. Your phone calculates distance from</text>
        <text x="135" y="360" textAnchor="middle" fontSize="10" fill="#94a3b8">signal travel time. 4+ satellites = 3D fix.</text>

        <rect x="270" y="300" width="230" height="65" rx="6" fill="none" stroke="#f87171" strokeWidth="1" />
        <text x="385" y="318" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fca5a5">Relativity Correction</text>
        <text x="385" y="334" textAnchor="middle" fontSize="10" fill="#94a3b8">Satellite clocks tick 38 microseconds/day</text>
        <text x="385" y="348" textAnchor="middle" fontSize="10" fill="#94a3b8">faster (Einstein's relativity). Without</text>
        <text x="385" y="360" textAnchor="middle" fontSize="10" fill="#94a3b8">correction, GPS drifts 10 km/day!</text>

        <defs>
          <marker id="gpsArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
