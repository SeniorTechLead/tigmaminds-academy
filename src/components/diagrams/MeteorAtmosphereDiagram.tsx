export default function MeteorAtmosphereDiagram() {
  return (
    <div className="dark:text-inherit w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 580"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Meteoroid entering Earth atmosphere: compression heating causes the bright streak we call a shooting star"
      >
        <defs>
          <linearGradient id="ma-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c0a1a" />
            <stop offset="40%" stopColor="#1e1b4b" />
            <stop offset="70%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
          <linearGradient id="ma-trail" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0" />
            <stop offset="30%" stopColor="#fde68a" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#fb923c" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="ma-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#fde68a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ma-atmo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Background: space */}
        <rect width="780" height="580" fill="url(#ma-sky)" />

        {/* Stars */}
        {[[60,30],[150,70],[280,20],[400,55],[520,15],[650,45],[720,80],[90,110],[350,90],[600,100],[180,140],[460,130],[700,25],[40,85]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="#e0e7ff" opacity={0.4 + (i % 4) * 0.15} />
        ))}

        {/* Title */}
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          What Happens When a Meteoroid Hits the Atmosphere
        </text>

        {/* Atmosphere layers */}
        <rect x="0" y="160" width="780" height="420" fill="url(#ma-atmo)" />

        {/* Layer labels */}
        <text x="760" y="178" textAnchor="end" fontSize="11" fill="#818cf8" fontWeight="600">Thermosphere (80+ km)</text>
        <line x1="0" y1="160" x2="780" y2="160" stroke="#818cf8" strokeWidth="0.5" strokeDasharray="6 4" opacity="0.4" />

        <text x="760" y="278" textAnchor="end" fontSize="11" fill="#60a5fa" fontWeight="600">Mesosphere (50–80 km)</text>
        <line x1="0" y1="270" x2="780" y2="270" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="6 4" opacity="0.4" />
        <text x="760" y="290" textAnchor="end" fontSize="10" fill="#93c5fd" opacity="0.7">← Most meteors burn up here</text>

        <text x="760" y="368" textAnchor="end" fontSize="11" fill="#38bdf8" fontWeight="600">Stratosphere (12–50 km)</text>
        <line x1="0" y1="360" x2="780" y2="360" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="6 4" opacity="0.4" />

        <text x="760" y="448" textAnchor="end" fontSize="11" fill="#22d3ee" fontWeight="600">Troposphere (0–12 km)</text>
        <line x1="0" y1="440" x2="780" y2="440" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="6 4" opacity="0.4" />

        {/* Earth surface */}
        <ellipse cx="390" cy="600" rx="500" ry="60" fill="#166534" opacity="0.6" />
        <ellipse cx="390" cy="600" rx="500" ry="55" fill="#15803d" opacity="0.3" />

        {/* Meteoroid trail */}
        <polygon points="100,70 480,340 476,348 96,78" fill="url(#ma-trail)" />

        {/* Compression zone ahead of meteoroid */}
        <ellipse cx="480" cy="344" rx="28" ry="22" fill="url(#ma-glow)" />

        {/* Meteoroid body */}
        <circle cx="480" cy="344" r="8" fill="#78350f" stroke="#92400e" strokeWidth="1.5" />
        <circle cx="477" cy="341" r="2" fill="#a16207" opacity="0.6" />

        {/* Ablation particles */}
        {[[455,330],[440,318],[425,305],[460,322],[445,310],[468,334]].map(([x,y], i) => (
          <circle key={`ab${i}`} cx={x} cy={y} r={1.5 - i * 0.15} fill="#fbbf24" opacity={0.7 - i * 0.08} />
        ))}

        {/* Annotation callouts */}
        {/* 1: Space rock */}
        <g>
          <line x1="100" y1="72" x2="50" y2="108" stroke="#fcd34d" strokeWidth="1" />
          <rect x="10" y="110" width="180" height="38" rx="4" fill="#1e1b4b" stroke="#fcd34d" strokeWidth="0.8" />
          <text x="100" y="126" textAnchor="middle" fontSize="11" fill="#fef3c7" fontWeight="600">Meteoroid in space</text>
          <text x="100" y="140" textAnchor="middle" fontSize="10" fill="#c4b5fd">Speed: 11–72 km/s</text>
        </g>

        {/* 2: Compression heating */}
        <g>
          <line x1="508" y1="344" x2="570" y2="310" stroke="#f59e0b" strokeWidth="1" />
          <rect x="570" y="290" width="195" height="50" rx="4" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="0.8" />
          <text x="668" y="306" textAnchor="middle" fontSize="11" fill="#fef3c7" fontWeight="600">Compression heating</text>
          <text x="668" y="320" textAnchor="middle" fontSize="10" fill="#fde68a">Air ahead is compressed</text>
          <text x="668" y="333" textAnchor="middle" fontSize="10" fill="#fde68a">to 20,000–40,000 °C</text>
        </g>

        {/* 3: Glowing trail */}
        <g>
          <line x1="300" y1="210" x2="230" y2="195" stroke="#fbbf24" strokeWidth="1" />
          <rect x="70" y="178" width="160" height="38" rx="4" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="0.8" />
          <text x="150" y="194" textAnchor="middle" fontSize="11" fill="#fef3c7" fontWeight="600">Glowing plasma trail</text>
          <text x="150" y="208" textAnchor="middle" fontSize="10" fill="#fde68a">Ionised air + ablated rock</text>
        </g>

        {/* Key insight box */}
        <rect x="30" y="470" width="720" height="80" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" opacity="0.9" />
        <text x="390" y="492" textAnchor="middle" fontSize="13" fontWeight="700" fill="#c4b5fd">
          Key Insight: It is NOT friction that makes meteors glow
        </text>
        <text x="390" y="510" textAnchor="middle" fontSize="11" fill="#e0e7ff">
          The meteoroid compresses the air ahead of it so violently that the air heats
        </text>
        <text x="390" y="526" textAnchor="middle" fontSize="11" fill="#e0e7ff">
          to tens of thousands of degrees. This superheated air radiates light —
        </text>
        <text x="390" y="542" textAnchor="middle" fontSize="11" fill="#e0e7ff">
          exactly like a shockwave, not like rubbing your hands together.
        </text>
      </svg>
    </div>
  );
}
