export default function CloudsFormationDiagram() {
  const w = 700;
  const h = 500;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        role="img"
        aria-label="How clouds form: evaporation from water, rising air cools to dew point, water vapour condenses on tiny particles into visible cloud droplets"
      >
        <defs>
          <linearGradient id="cf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="cf-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          <linearGradient id="cf-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <radialGradient id="cf-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width={w} height={h} rx="10" fill="url(#cf-sky)" />

        {/* Sun */}
        <circle cx="620" cy="60" r="50" fill="url(#cf-sun)" />
        <circle cx="620" cy="60" r="22" fill="#fcd34d" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={620 + 28 * Math.cos(rad)}
              y1={60 + 28 * Math.sin(rad)}
              x2={620 + 42 * Math.cos(rad)}
              y2={60 + 42 * Math.sin(rad)}
              stroke="#fcd34d"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Ground */}
        <rect x="0" y="400" width={w} height="100" fill="url(#cf-ground)" />

        {/* Lake / water body */}
        <ellipse cx="160" cy="405" rx="130" ry="30" fill="url(#cf-water)" />
        <text x="160" y="410" textAnchor="middle" fontSize="13" fontWeight="600" fill="#e0f2fe">
          Lake
        </text>

        {/* Step 1: Evaporation arrows from lake */}
        {[90, 130, 170, 210, 230].map((x, i) => (
          <g key={`evap-${i}`}>
            <line
              x1={x}
              y1={380}
              x2={x + (i % 2 === 0 ? -5 : 5)}
              y2={340}
              stroke="#93c5fd"
              strokeWidth="2"
              strokeDasharray="4 3"
              markerEnd="url(#cf-arrow-up)"
            />
          </g>
        ))}
        <defs>
          <marker id="cf-arrow-up" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M1,7 L4,1 L7,7" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
          </marker>
        </defs>

        {/* Label: Evaporation */}
        <rect x="60" y="340" width="110" height="24" rx="4" fill="#0c4a6e" fillOpacity="0.8" />
        <text x="115" y="357" textAnchor="middle" fontSize="12" fontWeight="600" fill="#7dd3fc">
          {"1. Evaporation"}
        </text>

        {/* Step 2: Rising air arrow */}
        <path d="M350,370 Q340,290 340,230" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="6 4" />
        <polygon points="335,235 340,218 345,235" fill="#fbbf24" />

        <rect x="350" y="280" width="140" height="42" rx="4" fill="#0c4a6e" fillOpacity="0.8" />
        <text x="420" y="296" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fde68a">
          {"2. Warm air rises"}
        </text>
        <text x="420" y="312" textAnchor="middle" fontSize="10" fill="#fde68a" fillOpacity="0.8">
          Cools 6.5\u00b0C per 1 000 m
        </text>

        {/* Step 3: Dew point line */}
        <line x1="30" y1="200" x2={w - 30} y2="200" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="8 4" />
        <text x={w - 35} y="196" textAnchor="end" fontSize="11" fill="#e2e8f0" fontWeight="600">
          Dew point level
        </text>

        {/* Step 3: Condensation */}
        <rect x="180" y="152" width="170" height="42" rx="4" fill="#0c4a6e" fillOpacity="0.8" />
        <text x="265" y="168" textAnchor="middle" fontSize="11" fontWeight="600" fill="#c4b5fd">
          {"3. Air reaches dew point"}
        </text>
        <text x="265" y="183" textAnchor="middle" fontSize="10" fill="#c4b5fd" fillOpacity="0.8">
          Vapour condenses on dust
        </text>

        {/* Condensation nuclei close-up */}
        {[220, 260, 300].map((x, i) => (
          <g key={`nucleus-${i}`}>
            <circle cx={x} cy={130} r="3" fill="#94a3b8" />
            <circle cx={x} cy={130} r="7" fill="#93c5fd" fillOpacity="0.4" />
          </g>
        ))}
        <text x="260" y="120" textAnchor="middle" fontSize="10" fill="#cbd5e1">
          Dust particles + water droplets
        </text>

        {/* Step 4: Cloud */}
        <g>
          <ellipse cx="440" cy="90" rx="100" ry="40" fill="#f1f5f9" fillOpacity="0.85" />
          <ellipse cx="400" cy="80" rx="60" ry="35" fill="#e2e8f0" fillOpacity="0.9" />
          <ellipse cx="480" cy="80" rx="55" ry="30" fill="#f8fafc" fillOpacity="0.85" />
          <ellipse cx="440" cy="65" rx="50" ry="28" fill="#f8fafc" fillOpacity="0.9" />
        </g>

        <rect x="385" y="42" width="110" height="22" rx="4" fill="#0c4a6e" fillOpacity="0.8" />
        <text x="440" y="58" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f0f9ff">
          {"4. Cloud forms!"}
        </text>

        {/* Bottom info */}
        <rect x="380" y="420" width="300" height="60" rx="6" fill="#0f172a" fillOpacity="0.7" />
        <text x="530" y="440" textAnchor="middle" fontSize="11" fontWeight="600" fill="#7dd3fc">
          Key fact
        </text>
        <text x="530" y="455" textAnchor="middle" fontSize="10" fill="#cbd5e1">
          Each cloud droplet is only 10\u201320 \u00b5m wide
        </text>
        <text x="530" y="468" textAnchor="middle" fontSize="10" fill="#cbd5e1">
          \u2014 one-tenth the thickness of a hair
        </text>

        {/* Temperature scale on left */}
        <text x="16" y="405" fontSize="10" fill="#86efac">30\u00b0C</text>
        <text x="16" y="320" fontSize="10" fill="#86efac">24\u00b0C</text>
        <text x="16" y="205" fontSize="10" fill="#93c5fd">11\u00b0C</text>
        <text x="16" y="80" fontSize="10" fill="#c4b5fd">3\u00b0C</text>
        <line x1="48" y1="75" x2="48" y2="400" stroke="#475569" strokeWidth="1" />
      </svg>
    </div>
  );
}
