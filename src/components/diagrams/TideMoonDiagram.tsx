export default function TideMoonDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" role="img"
        aria-label="Diagram showing the Moon's gravitational pull creating tidal bulges on Earth">
        <rect width="520" height="400" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Why the Ocean Breathes: The Moon Pulls Water
        </text>

        {/* Moon */}
        <circle cx="460" cy="200" r="28" fill="#d1d5db" />
        <circle cx="450" cy="190" r="5" fill="#9ca3af" opacity="0.5" />
        <circle cx="468" cy="205" r="3" fill="#9ca3af" opacity="0.5" />
        <circle cx="455" cy="210" r="4" fill="#9ca3af" opacity="0.4" />
        <text x="460" y="245" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e2e8f0">Moon</text>

        {/* Earth */}
        <circle cx="200" cy="200" r="60" fill="#1e40af" />
        {/* Continents */}
        <ellipse cx="185" cy="185" rx="20" ry="15" fill="#16a34a" opacity="0.7" />
        <ellipse cx="215" cy="210" rx="12" ry="10" fill="#16a34a" opacity="0.7" />
        <text x="200" y="204" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Earth</text>

        {/* Tidal bulge — near side (toward Moon) */}
        <ellipse cx="200" cy="200" rx="90" ry="58" fill="#3b82f6" opacity="0.3" />

        {/* High tide labels */}
        <text x="295" y="198" fontSize="10" fontWeight="bold" fill="#60a5fa">HIGH</text>
        <text x="295" y="210" fontSize="10" fontWeight="bold" fill="#60a5fa">TIDE</text>

        <text x="105" y="198" fontSize="10" fontWeight="bold" fill="#60a5fa">HIGH</text>
        <text x="105" y="210" fontSize="10" fontWeight="bold" fill="#60a5fa">TIDE</text>

        {/* Low tide labels */}
        <text x="193" y="140" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">LOW TIDE</text>
        <text x="193" y="272" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">LOW TIDE</text>

        {/* Gravitational pull arrows */}
        <line x1="295" y1="200" x2="420" y2="200" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6,3" />
        <text x="355" y="193" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Gravity pulls</text>
        <text x="355" y="173" textAnchor="middle" fontSize="10" fill="#fbbf24">Moon's gravitational pull</text>
        <text x="355" y="183" textAnchor="middle" fontSize="10" fill="#fbbf24">stretches the ocean</text>

        {/* Explanation boxes */}
        <rect x="20" y="295" width="230" height="90" rx="8" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        <text x="135" y="315" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">Near-side bulge</text>
        <text x="135" y="332" textAnchor="middle" fontSize="10" fill="#94a3b8">Water closest to the Moon gets</text>
        <text x="135" y="346" textAnchor="middle" fontSize="10" fill="#94a3b8">pulled toward it more strongly</text>
        <text x="135" y="360" textAnchor="middle" fontSize="10" fill="#94a3b8">than the solid Earth beneath it.</text>
        <text x="135" y="378" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">= water bulges toward Moon</text>

        <rect x="270" y="295" width="230" height="90" rx="8" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
        <text x="385" y="315" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c4b5fd">Far-side bulge</text>
        <text x="385" y="332" textAnchor="middle" fontSize="10" fill="#94a3b8">Earth gets pulled toward the</text>
        <text x="385" y="346" textAnchor="middle" fontSize="10" fill="#94a3b8">Moon more than the far-side</text>
        <text x="385" y="360" textAnchor="middle" fontSize="10" fill="#94a3b8">water, leaving water behind.</text>
        <text x="385" y="378" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">= water bulges away too!</text>
      </svg>
    </div>
  );
}
