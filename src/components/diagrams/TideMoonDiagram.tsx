export default function TideMoonDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 560 440" className="w-full h-auto" role="img"
        aria-label="Animated diagram showing the Moon orbiting Earth and creating tidal bulges with a water level indicator">
        <style>{`
          @keyframes tm-moon-orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes tm-earth-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes tm-bulge-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes tm-tide-rise {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-18px); }
            50% { transform: translateY(0); }
            75% { transform: translateY(-18px); }
          }
          @keyframes tm-label-high {
            0%, 100% { opacity: 1; }
            35%, 65% { opacity: 0; }
          }
          @keyframes tm-label-low {
            0%, 100% { opacity: 0; }
            35%, 65% { opacity: 1; }
          }
          @keyframes tm-star-twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          @keyframes tm-grav-dash {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -18; }
          }
          .tm-moon { animation: tm-moon-orbit 20s linear infinite; transform-origin: 230px 195px; }
          .tm-bulge { animation: tm-bulge-rotate 20s linear infinite; transform-origin: 230px 195px; }
          .tm-earth { animation: tm-earth-spin 60s linear infinite; transform-origin: 230px 195px; }
          .tm-tide { animation: tm-tide-rise 10s ease-in-out infinite; }
          .tm-high { animation: tm-label-high 10s ease-in-out infinite; }
          .tm-low { animation: tm-label-low 10s ease-in-out infinite; }
          .tm-star1 { animation: tm-star-twinkle 3s ease-in-out infinite; }
          .tm-star2 { animation: tm-star-twinkle 3s ease-in-out 1s infinite; }
          .tm-star3 { animation: tm-star-twinkle 3s ease-in-out 2s infinite; }
          .tm-grav { animation: tm-grav-dash 1s linear infinite; }
        `}</style>

        <rect width="560" height="440" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="280" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Why the Ocean Breathes: The Moon Pulls Water
        </text>

        {/* Stars background */}
        <circle cx="50" cy="60" r="1.5" fill="#e2e8f0" className="tm-star1" />
        <circle cx="120" cy="45" r="1" fill="#e2e8f0" className="tm-star2" />
        <circle cx="480" cy="55" r="1.5" fill="#e2e8f0" className="tm-star3" />
        <circle cx="510" cy="90" r="1" fill="#e2e8f0" className="tm-star1" />
        <circle cx="60" cy="120" r="1" fill="#e2e8f0" className="tm-star2" />
        <circle cx="440" cy="42" r="1.2" fill="#e2e8f0" className="tm-star3" />
        <circle cx="370" cy="58" r="1" fill="#e2e8f0" className="tm-star1" />
        <circle cx="100" cy="280" r="1" fill="#e2e8f0" className="tm-star2" />
        <circle cx="30" cy="200" r="1.2" fill="#e2e8f0" className="tm-star3" />

        {/* Moon orbit path (faint ring) */}
        <circle cx="230" cy="195" r="140" fill="none" stroke="#475569" strokeWidth="0.8" strokeDasharray="4,6" />

        {/* Tidal bulge — rotates with moon */}
        <g className="tm-bulge">
          <ellipse cx="230" cy="195" rx="95" ry="56" fill="#3b82f6" opacity="0.2" />
        </g>

        {/* Earth — slowly spinning */}
        <g className="tm-earth">
          <circle cx="230" cy="195" r="55" fill="#1e40af" />
          {/* Continents */}
          <ellipse cx="215" cy="180" rx="18" ry="13" fill="#16a34a" opacity="0.7" />
          <ellipse cx="248" cy="200" rx="10" ry="9" fill="#16a34a" opacity="0.6" />
          <ellipse cx="220" cy="215" rx="8" ry="5" fill="#16a34a" opacity="0.5" />
        </g>
        <text x="230" y="199" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Earth</text>

        {/* Moon — orbiting around Earth */}
        <g className="tm-moon">
          <g transform="translate(370, 195)">
            <circle cx="0" cy="0" r="22" fill="#d1d5db" />
            <circle cx="-6" cy="-6" r="4" fill="#9ca3af" opacity="0.5" />
            <circle cx="6" cy="4" r="2.5" fill="#9ca3af" opacity="0.5" />
            <circle cx="-3" cy="8" r="3" fill="#9ca3af" opacity="0.4" />
            <text x="0" y="36" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e2e8f0">Moon</text>
          </g>
        </g>

        {/* Gravitational pull line (animated dashes) */}
        <line x1="288" y1="195" x2="345" y2="195" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6,3" className="tm-grav" opacity="0.6" />

        {/* Tide indicator box */}
        <rect x="465" y="100" width="80" height="180" rx="6" fill="none" stroke="#475569" strokeWidth="1" />
        <text x="505" y="95" textAnchor="middle" fontSize="10" fontWeight="600" fill="#94a3b8">Coastline</text>

        {/* Water in the indicator */}
        <g className="tm-tide" style={{ transformOrigin: '505px 280px' }}>
          <rect x="467" y="200" width="76" height="78" rx="4" fill="#3b82f6" opacity="0.5" />
          {/* Tiny wave on top of water */}
          <path d="M467,200 Q480,195 493,200 Q506,205 519,200 Q532,195 543,200" fill="none" stroke="#60a5fa" strokeWidth="1" />
        </g>

        {/* Tide labels — alternate */}
        <g className="tm-high">
          <text x="505" y="170" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">HIGH</text>
          <text x="505" y="184" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">TIDE</text>
        </g>
        <g className="tm-low">
          <text x="505" y="170" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#93c5fd">LOW</text>
          <text x="505" y="184" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#93c5fd">TIDE</text>
        </g>

        {/* High/Low tide markers on Earth */}
        <g className="tm-bulge">
          <text x="332" y="192" fontSize="10" fontWeight="bold" fill="#60a5fa">HIGH</text>
          <text x="332" y="204" fontSize="10" fontWeight="bold" fill="#60a5fa">TIDE</text>
          <text x="110" y="192" fontSize="10" fontWeight="bold" fill="#60a5fa">HIGH</text>
          <text x="110" y="204" fontSize="10" fontWeight="bold" fill="#60a5fa">TIDE</text>
          <text x="218" y="132" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">LOW TIDE</text>
          <text x="218" y="268" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">LOW TIDE</text>
        </g>

        {/* Explanation boxes */}
        <rect x="15" y="330" width="255" height="95" rx="8" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
        <text x="142" y="350" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">Near-side bulge</text>
        <text x="142" y="367" textAnchor="middle" fontSize="10" fill="#94a3b8">Water closest to the Moon gets</text>
        <text x="142" y="381" textAnchor="middle" fontSize="10" fill="#94a3b8">pulled toward it more strongly</text>
        <text x="142" y="395" textAnchor="middle" fontSize="10" fill="#94a3b8">than the solid Earth beneath.</text>
        <text x="142" y="413" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">= water bulges toward Moon</text>

        <rect x="290" y="330" width="255" height="95" rx="8" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
        <text x="417" y="350" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c4b5fd">Far-side bulge</text>
        <text x="417" y="367" textAnchor="middle" fontSize="10" fill="#94a3b8">Earth gets pulled toward the</text>
        <text x="417" y="381" textAnchor="middle" fontSize="10" fill="#94a3b8">Moon more than the far-side</text>
        <text x="417" y="395" textAnchor="middle" fontSize="10" fill="#94a3b8">water, leaving water behind.</text>
        <text x="417" y="413" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">= water bulges away too!</text>
      </svg>
    </div>
  );
}
