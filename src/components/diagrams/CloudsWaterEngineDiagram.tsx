export default function CloudsWaterEngineDiagram() {
  const w = 720;
  const h = 480;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        role="img"
        aria-label="The water cycle engine: sun heats ocean, water evaporates, rises and condenses into clouds, falls as rain, flows through rivers back to the ocean, then repeats"
      >
        <defs>
          <linearGradient id="cwe-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="cwe-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <radialGradient id="cwe-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <marker id="cwe-arrow" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
            <path d="M0,1 L8,4 L0,7" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
          </marker>
          <marker id="cwe-arrow-y" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
            <path d="M0,1 L8,4 L0,7" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          </marker>
          <marker id="cwe-arrow-g" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
            <path d="M0,1 L8,4 L0,7" fill="none" stroke="#4ade80" strokeWidth="1.5" />
          </marker>
        </defs>

        {/* Sky */}
        <rect width={w} height={h} rx="10" fill="url(#cwe-sky)" />

        {/* Sun */}
        <circle cx="80" cy="60" r="45" fill="url(#cwe-sun)" />
        <circle cx="80" cy="60" r="20" fill="#fcd34d" />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={80 + 25 * Math.cos(rad)}
              y1={60 + 25 * Math.sin(rad)}
              x2={80 + 38 * Math.cos(rad)}
              y2={60 + 38 * Math.sin(rad)}
              stroke="#fcd34d"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {/* Title */}
        <text x={w / 2} y="28" textAnchor="middle" fontSize="15" fontWeight="700" fill="#f0f9ff">
          The Water Cycle Engine
        </text>

        {/* Ocean */}
        <path d="M0,400 Q60,385 120,400 Q180,415 240,400 Q300,385 360,400 Q420,415 480,400 Q540,385 600,400 Q660,415 720,400 L720,480 L0,480 Z" fill="url(#cwe-ocean)" />
        <text x="360" y="440" textAnchor="middle" fontSize="14" fontWeight="600" fill="#bae6fd">
          Ocean
        </text>

        {/* Mountain */}
        <polygon points="520,395 580,270 620,310 660,250 700,395" fill="#334155" fillOpacity="0.7" />
        <polygon points="660,250 700,395 720,395 720,250" fill="#334155" fillOpacity="0.5" />
        <text x="620" y="350" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">
          Mountains
        </text>

        {/* River */}
        <path d="M630,320 Q600,350 560,370 Q520,385 480,395" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        <text x="550" y="365" fontSize="10" fill="#7dd3fc" fontWeight="600">River</text>

        {/* Step 1: Evaporation \u2014 rising arrows from ocean */}
        <path d="M200,390 Q190,330 180,260" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#cwe-arrow-y)" />
        <path d="M280,390 Q270,320 260,260" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#cwe-arrow-y)" />

        {/* Label 1 */}
        <rect x="130" y="310" width="110" height="34" rx="4" fill="#0f172a" fillOpacity="0.8" />
        <text x="185" y="326" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fbbf24">
          {"\u2460 Evaporation"}
        </text>
        <text x="185" y="340" textAnchor="middle" fontSize="10" fill="#fde68a" fillOpacity="0.8">
          Sun heats water
        </text>

        {/* Cloud cluster */}
        <g>
          <ellipse cx="350" cy="140" rx="90" ry="35" fill="#e2e8f0" fillOpacity="0.8" />
          <ellipse cx="310" cy="130" rx="55" ry="30" fill="#f1f5f9" fillOpacity="0.85" />
          <ellipse cx="390" cy="130" rx="50" ry="25" fill="#f8fafc" fillOpacity="0.8" />
          <ellipse cx="350" cy="118" rx="45" ry="22" fill="#ffffff" fillOpacity="0.9" />
        </g>

        {/* Label 2: Condensation */}
        <rect x="260" y="75" width="180" height="34" rx="4" fill="#0f172a" fillOpacity="0.8" />
        <text x="350" y="91" textAnchor="middle" fontSize="12" fontWeight="700" fill="#c4b5fd">
          {"\u2461 Condensation"}
        </text>
        <text x="350" y="105" textAnchor="middle" fontSize="10" fill="#ddd6fe" fillOpacity="0.8">
          Vapour \u2192 cloud droplets
        </text>

        {/* Wind arrow pushing cloud toward mountain */}
        <path d="M440,135 Q480,130 520,140" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#cwe-arrow)" />
        <text x="480" y="125" textAnchor="middle" fontSize="10" fill="#94a3b8">Wind</text>

        {/* Step 3: Precipitation (rain) */}
        {[320, 340, 360, 380].map((x, i) => (
          <g key={`rain-${i}`}>
            <line x1={x} y1={170} x2={x - 4} y2={195} stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
            <line x1={x + 10} y1={185} x2={x + 6} y2={210} stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}

        <rect x="410" y="185" width="120" height="34" rx="4" fill="#0f172a" fillOpacity="0.8" />
        <text x="470" y="201" textAnchor="middle" fontSize="12" fontWeight="700" fill="#60a5fa">
          {"\u2462 Precipitation"}
        </text>
        <text x="470" y="215" textAnchor="middle" fontSize="10" fill="#93c5fd" fillOpacity="0.8">
          Rain, snow, hail
        </text>

        {/* Step 4: Collection / runoff */}
        <path d="M400,240 Q430,300 470,370 Q490,390 500,395" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="5 3" markerEnd="url(#cwe-arrow-g)" />

        <rect x="425" y="290" width="130" height="34" rx="4" fill="#0f172a" fillOpacity="0.8" />
        <text x="490" y="306" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4ade80">
          {"\u2463 Collection"}
        </text>
        <text x="490" y="320" textAnchor="middle" fontSize="10" fill="#86efac" fillOpacity="0.8">
          Rivers \u2192 back to ocean
        </text>

        {/* Cycle arrow connecting ocean back to evaporation */}
        <path d="M140,420 Q80,420 60,400 Q40,370 60,340 Q80,310 130,310" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#cwe-arrow-y)" />

        {/* Mawsynram callout */}
        <rect x="8" y="140" width="200" height="50" rx="6" fill="#0f172a" fillOpacity="0.85" />
        <text x="16" y="158" fontSize="11" fontWeight="700" fill="#7dd3fc">
          Mawsynram, Meghalaya
        </text>
        <text x="16" y="172" fontSize="10" fill="#cbd5e1">
          Receives ~12 000 mm rain/year
        </text>
        <text x="16" y="184" fontSize="10" fill="#cbd5e1">
          because moist winds hit the Khasi Hills
        </text>

        {/* Bottom: repeat label */}
        <text x={w / 2} y={h - 10} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">
          The cycle never stops \u2014 the same water has been cycling for billions of years
        </text>
      </svg>
    </div>
  );
}
