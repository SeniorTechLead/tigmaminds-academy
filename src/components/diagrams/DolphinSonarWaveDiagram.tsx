export default function DolphinSonarWaveDiagram() {
  return (
    <svg
      viewBox="0 0 640 340"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Speed of sound in water vs air, showing why sonar works better underwater"
    >
      <defs>
        <style>{`
          @keyframes dWaterPulse {
            0% { opacity: 0.2; }
            50% { opacity: 0.8; }
            100% { opacity: 0.2; }
          }
          .d-water-pulse { animation: dWaterPulse 2s ease-in-out infinite; }
          @keyframes dAirPulse {
            0% { opacity: 0.2; }
            50% { opacity: 0.6; }
            100% { opacity: 0.2; }
          }
          .d-air-pulse { animation: dAirPulse 2s ease-in-out infinite; animation-delay: 0.5s; }
        `}</style>
      </defs>

      <rect width="640" height="340" rx="12" className="fill-gray-900" />

      <text x="320" y="24" textAnchor="middle" className="fill-gray-400" fontSize="11" fontWeight="600">
        The Speed of Sound &mdash; Water vs Air
      </text>

      {/* === WATER section (top) === */}
      <rect x="30" y="40" width="580" height="120" rx="8" fill="#0c4a6e" opacity="0.4" />
      <text x="50" y="60" fill="#7dd3fc" fontSize="10" fontWeight="600">WATER</text>

      {/* Molecules packed close */}
      <g transform="translate(60, 70)">
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={i * 18} cy={15 + (i % 2) * 8} r="6" fill="#0284c7" opacity="0.6" stroke="#38bdf8" strokeWidth="1" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`l${i}`} x1={i * 18 + 6} y1={15 + (i % 2) * 8} x2={(i + 1) * 18 - 6} y2={15 + ((i + 1) % 2) * 8} stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />
        ))}
        <text x="0" y="50" fill="#7dd3fc" fontSize="8">Molecules close together</text>
      </g>

      {/* Speed bar */}
      <rect x="320" y="65" width="270" height="24" rx="4" fill="#0369a1" className="d-water-pulse" />
      <text x="455" y="82" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">1,480 m/s</text>
      <text x="320" y="108" fill="#7dd3fc" fontSize="9">Vibrations transfer fast through tightly packed molecules</text>
      <text x="320" y="120" fill="#7dd3fc" fontSize="9">Sound travels farther &mdash; less energy lost to absorption</text>

      {/* === AIR section (middle) === */}
      <rect x="30" y="170" width="580" height="120" rx="8" fill="#1c1917" opacity="0.4" />
      <text x="50" y="190" fill="#d4d4d8" fontSize="10" fontWeight="600">AIR</text>

      {/* Molecules spread apart */}
      <g transform="translate(60, 200)">
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={i * 28} cy={15 + (i % 3) * 10} r="5" fill="#57534e" opacity="0.6" stroke="#a8a29e" strokeWidth="1" />
        ))}
        <text x="0" y="55" fill="#a8a29e" fontSize="8">Molecules far apart</text>
      </g>

      {/* Speed bar (shorter) */}
      <rect x="320" y="195" width="63" height="24" rx="4" fill="#78716c" className="d-air-pulse" />
      <text x="351" y="212" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">343 m/s</text>
      <text x="320" y="238" fill="#a8a29e" fontSize="9">Vibrations transfer slowly through sparse molecules</text>
      <text x="320" y="250" fill="#a8a29e" fontSize="9">Sound fades faster &mdash; more energy absorbed</text>

      {/* === Comparison === */}
      <rect x="120" y="300" width="400" height="30" rx="6" fill="#1e293b" stroke="#374151" strokeWidth="1" />
      <text x="320" y="320" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="700" fontFamily="monospace">
        Water: 4.3x faster &#8594; sonar works best underwater
      </text>

      {/* Scale comparison */}
      <text x="595" y="85" textAnchor="end" fill="#22d3ee" fontSize="10" fontWeight="700">4.3x</text>
      <line x1="590" y1="90" x2="590" y2="210" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4,3" />
      <text x="595" y="215" textAnchor="end" fill="#a8a29e" fontSize="10" fontWeight="700">1x</text>
    </svg>
  );
}
