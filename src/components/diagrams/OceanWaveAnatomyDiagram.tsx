export default function OceanWaveAnatomyDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 600 380" className="w-full h-auto" role="img"
        aria-label="Animated ocean wave anatomy showing crest, trough, wavelength, amplitude, and circular water molecule motion">
        <style>{`
          @keyframes owa-wave-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-200px); }
          }
          @keyframes owa-boat-bob {
            0%, 100% { transform: translateY(0px) rotate(-3deg); }
            50% { transform: translateY(-18px) rotate(3deg); }
          }
          @keyframes owa-orbit {
            0% { transform: rotate(0deg) translateX(18px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
          }
          @keyframes owa-orbit-sm {
            0% { transform: rotate(0deg) translateX(12px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(12px) rotate(-360deg); }
          }
          @keyframes owa-orbit-xs {
            0% { transform: rotate(0deg) translateX(7px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(7px) rotate(-360deg); }
          }
          @keyframes owa-arrow-pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes owa-gull {
            0%, 100% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(8px) translateY(-4px); }
            75% { transform: translateX(-6px) translateY(-2px); }
          }
          .owa-wave { animation: owa-wave-scroll 4s linear infinite; }
          .owa-boat { animation: owa-boat-bob 4s ease-in-out infinite; transform-origin: center bottom; }
          .owa-mol1 { animation: owa-orbit 3s linear infinite; transform-origin: center center; }
          .owa-mol2 { animation: owa-orbit-sm 3s linear 1s infinite; transform-origin: center center; }
          .owa-mol3 { animation: owa-orbit-xs 3s linear 0.5s infinite; transform-origin: center center; }
          .owa-arrow { animation: owa-arrow-pulse 2s ease-in-out infinite; }
          .owa-gull { animation: owa-gull 5s ease-in-out infinite; }
        `}</style>

        <defs>
          <clipPath id="owa-clip">
            <rect x="30" y="40" width="540" height="300" />
          </clipPath>
          <marker id="owa-arY" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" stroke="#fbbf24" strokeWidth="1" />
          </marker>
          <marker id="owa-arYL" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M8,0 L0,3 L8,6" fill="none" stroke="#fbbf24" strokeWidth="1" />
          </marker>
          <marker id="owa-arG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" stroke="#34d399" strokeWidth="1" />
          </marker>
          <marker id="owa-arGL" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M8,0 L0,3 L8,6" fill="none" stroke="#34d399" strokeWidth="1" />
          </marker>
          <marker id="owa-arW" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          </marker>
        </defs>

        <rect width="600" height="380" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="300" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Wave Anatomy: Energy Traveling, Not Water
        </text>

        {/* Still water line */}
        <line x1="30" y1="180" x2="570" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="6,4" />
        <text x="572" y="177" textAnchor="end" fontSize="10" fill="#64748b">Still water level</text>

        {/* Animated wave surface + water fill — double-wide, clipped, scrolling left */}
        <g clipPath="url(#owa-clip)">
          <g className="owa-wave">
            {/* Wave line (800px wide to allow seamless loop of 200px period) */}
            <path
              d="M30,180 C55,110 105,110 130,180 C155,250 205,250 230,180 C255,110 305,110 330,180 C355,250 405,250 430,180 C455,110 505,110 530,180 C555,250 605,250 630,180 C655,110 705,110 730,180 C755,250 805,250 830,180"
              fill="none" stroke="#3b82f6" strokeWidth="2.5"
            />
            {/* Water fill beneath wave */}
            <path
              d="M30,180 C55,110 105,110 130,180 C155,250 205,250 230,180 C255,110 305,110 330,180 C355,250 405,250 430,180 C455,110 505,110 530,180 C555,250 605,250 630,180 C655,110 705,110 730,180 C755,250 805,250 830,180 L830,340 L30,340 Z"
              fill="#1e3a5f" opacity="0.35"
            />

            {/* Crest label — moves with wave */}
            <circle cx="130" cy="110" r="4" fill="#60a5fa" />
            <line x1="130" y1="102" x2="130" y2="80" stroke="#60a5fa" strokeWidth="1" />
            <text x="130" y="74" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">Crest</text>

            {/* Trough label */}
            <circle cx="230" cy="250" r="4" fill="#a78bfa" />
            <line x1="230" y1="258" x2="230" y2="278" stroke="#a78bfa" strokeWidth="1" />
            <text x="230" y="292" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a78bfa">Trough</text>

            {/* Wavelength arrow between two crests */}
            <line x1="130" y1="64" x2="330" y2="64" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#owa-arY)" markerStart="url(#owa-arYL)" />
            <text x="230" y="58" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Wavelength</text>

            {/* Second crest dot */}
            <circle cx="330" cy="110" r="4" fill="#60a5fa" />
          </g>
        </g>

        {/* Amplitude arrows — stationary */}
        <line x1="42" y1="110" x2="42" y2="180" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#owa-arG)" markerStart="url(#owa-arGL)" />
        <text x="50" y="150" fontSize="10" fontWeight="bold" fill="#34d399">Amplitude</text>

        {/* Boat bobbing on top */}
        <g className="owa-boat" style={{ transformOrigin: '300px 156px' }}>
          <path d="M280,162 Q290,172 300,172 Q310,172 320,162 Z" fill="#a16207" />
          <line x1="300" y1="162" x2="300" y2="142" stroke="#78716c" strokeWidth="1.5" />
          <polygon points="300,142 315,152 300,158" fill="#f5f5f4" opacity="0.8" />
        </g>

        {/* Seagull */}
        <g className="owa-gull" style={{ transformOrigin: '480px 60px' }}>
          <text x="480" y="65" textAnchor="middle" fontSize="18">🐦</text>
        </g>

        {/* Orbital motion molecules */}
        {/* Depth 1 — large orbit */}
        <circle cx="420" cy="180" r="18" fill="none" stroke="#f97316" strokeWidth="1.2" strokeDasharray="4,3" opacity="0.6" />
        <g style={{ transformOrigin: '420px 180px' }} className="owa-mol1">
          <circle cx="0" cy="0" r="4" fill="#f97316" style={{ transform: 'translate(420px, 180px)' }} />
        </g>
        {/* Use a positioned dot that orbits */}
        <circle cx="420" cy="162" r="4" fill="#f97316" className="owa-mol1" style={{ transformOrigin: '420px 180px' }} />

        {/* Depth 2 — medium orbit */}
        <circle cx="420" cy="220" r="12" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
        <circle cx="420" cy="208" r="3" fill="#fb923c" className="owa-mol2" style={{ transformOrigin: '420px 220px' }} />

        {/* Depth 3 — small orbit */}
        <circle cx="420" cy="255" r="7" fill="none" stroke="#f97316" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.3" />
        <circle cx="420" cy="248" r="2.5" fill="#fdba74" className="owa-mol3" style={{ transformOrigin: '420px 255px' }} />

        <text x="460" y="178" fontSize="10" fontWeight="bold" fill="#f97316">Water molecules</text>
        <text x="460" y="192" fontSize="10" fill="#fb923c">orbit in circles —</text>
        <text x="460" y="204" fontSize="10" fill="#fb923c">smaller with depth</text>

        {/* Seabed — stationary */}
        <rect x="30" y="320" width="540" height="20" rx="3" fill="#78716c" opacity="0.5" />
        <text x="300" y="335" textAnchor="middle" fontSize="10" fill="#a8a29e">Seabed — stays still</text>

        {/* Direction of energy arrow */}
        <line x1="160" y1="355" x2="360" y2="355" stroke="#e2e8f0" strokeWidth="1.5" markerEnd="url(#owa-arW)" className="owa-arrow" />
        <text x="260" y="372" textAnchor="middle" fontSize="11" fontWeight="600" fill="#e2e8f0">
          Direction of wave energy →
        </text>
      </svg>
    </div>
  );
}
