export default function OceanStormSurgeDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 560 400" className="w-full h-auto" role="img"
        aria-label="Animated storm surge diagram showing cyclone pushing ocean water onto land">
        <defs>
          <style>{`
            @keyframes ss-cycloneSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            @keyframes ss-windPush {
              0% { transform: translateX(0); opacity: 1; }
              100% { transform: translateX(50px); opacity: 0; }
            }
            @keyframes ss-surgeRise {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes ss-rainFall {
              0% { transform: translateY(0); opacity: 1; }
              100% { transform: translateY(40px); opacity: 0; }
            }
            @keyframes ss-waveRoll {
              0%, 100% { d: path("M 10,230 Q 60,218 110,230 Q 160,242 210,230 Q 260,218 310,230 Q 340,238 370,226"); }
              50% { d: path("M 10,230 Q 60,242 110,230 Q 160,218 210,230 Q 260,242 310,230 Q 340,220 370,228"); }
            }
            @keyframes ss-flashPulse {
              0%, 90%, 100% { opacity: 0; }
              92% { opacity: 0.9; }
              95% { opacity: 0; }
            }
            @keyframes ss-houseSubmerge {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(2px); }
            }
            .ss-cyclone { transform-origin: 200px 90px; animation: ss-cycloneSpin 8s linear infinite; }
            .ss-wind1 { animation: ss-windPush 1.5s ease-out infinite; }
            .ss-wind2 { animation: ss-windPush 1.5s ease-out 0.5s infinite; }
            .ss-wind3 { animation: ss-windPush 1.5s ease-out 1s infinite; }
            .ss-surge { animation: ss-surgeRise 4s ease-in-out infinite; }
            .ss-rain { animation: ss-rainFall 0.8s linear infinite; }
            .ss-rain2 { animation: ss-rainFall 0.8s linear 0.2s infinite; }
            .ss-rain3 { animation: ss-rainFall 0.8s linear 0.4s infinite; }
            .ss-rain4 { animation: ss-rainFall 0.8s linear 0.6s infinite; }
            .ss-rain5 { animation: ss-rainFall 0.8s linear 0.1s infinite; }
            .ss-rain6 { animation: ss-rainFall 0.8s linear 0.3s infinite; }
            .ss-rain7 { animation: ss-rainFall 0.8s linear 0.5s infinite; }
            .ss-rain8 { animation: ss-rainFall 0.8s linear 0.7s infinite; }
            .ss-flash { animation: ss-flashPulse 4s ease-in-out infinite; }
            .ss-flash2 { animation: ss-flashPulse 4s ease-in-out 2s infinite; }
            .ss-house { animation: ss-houseSubmerge 4s ease-in-out infinite; }
          `}</style>

          <linearGradient id="ss-stormSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#1e1b4b] dark:[stop-color:#0f0a2e]" />
            <stop offset="100%" className="[stop-color:#312e81] dark:[stop-color:#1e1b4b]" />
          </linearGradient>
          <linearGradient id="ss-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#1d4ed8] dark:[stop-color:#1e3a5f]" />
            <stop offset="100%" className="[stop-color:#1e3a8a] dark:[stop-color:#0c1524]" />
          </linearGradient>
          <linearGradient id="ss-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#a16207] dark:[stop-color:#713f12]" />
            <stop offset="100%" className="[stop-color:#78350f] dark:[stop-color:#431407]" />
          </linearGradient>
        </defs>

        {/* Dark storm sky */}
        <rect width="560" height="400" rx="6" fill="url(#ss-stormSky)" />

        {/* Lightning flashes */}
        <path className="ss-flash" d="M 160,50 L 155,75 L 165,72 L 152,105" fill="none" stroke="#fef08a" strokeWidth="2" />
        <path className="ss-flash2" d="M 250,55 L 248,80 L 256,78 L 244,108" fill="none" stroke="#fef08a" strokeWidth="1.5" />

        {/* Spinning cyclone */}
        <g className="ss-cyclone">
          {/* Spiral arms */}
          <path d="M 200,90 Q 200,50 240,60 Q 260,65 250,90" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.5" />
          <path d="M 200,90 Q 200,130 160,120 Q 140,115 150,90" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.5" />
          <path d="M 200,90 Q 240,90 230,60 Q 225,45 200,55" fill="none" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.4" />
          <path d="M 200,90 Q 160,90 170,120 Q 175,135 200,125" fill="none" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.4" />
          {/* Outer ring */}
          <circle cx="200" cy="90" r="55" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="8,4" opacity="0.4" />
          <circle cx="200" cy="90" r="40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.5" />
        </g>
        {/* Eye (stays still) */}
        <circle cx="200" cy="90" r="12" fill="none" stroke="#fbbf24" strokeWidth="2" />
        <text x="200" y="94" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Eye</text>
        <text x="200" y="28" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f87171">Cyclone</text>

        {/* Rain falling from cyclone */}
        {[140,158,176,194,212,230,248,160,185,220,240,152,200].map((x, i) => (
          <line key={`sr-${i}`}
            className={`ss-rain${(i % 8) + 1 === 1 ? '' : ((i % 8) + 1 === 9 ? '' : ((i % 8) + 1).toString())}`}
            x1={x} y1={145 + (i % 3) * 5} x2={x - 2} y2={153 + (i % 3) * 5}
            stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        ))}

        {/* Wind arrows pushing right */}
        <g className="ss-wind1">
          <line x1="90" y1="100" x2="130" y2="100" stroke="#93c5fd" strokeWidth="2.5" />
          <polygon points="130,96 140,100 130,104" fill="#93c5fd" />
        </g>
        <g className="ss-wind2">
          <line x1="80" y1="118" x2="125" y2="118" stroke="#93c5fd" strokeWidth="2" />
          <polygon points="125,114 135,118 125,122" fill="#93c5fd" />
        </g>
        <g className="ss-wind3">
          <line x1="95" y1="80" x2="130" y2="80" stroke="#93c5fd" strokeWidth="2" />
          <polygon points="130,76 140,80 130,84" fill="#93c5fd" />
        </g>
        <text x="55" y="104" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#93c5fd">Wind</text>

        {/* Low pressure label */}
        <text x="200" y="158" textAnchor="middle" fontSize="10" fill="#fb923c">Low pressure lifts water</text>

        {/* Normal sea level line */}
        <line x1="10" y1="230" x2="540" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="6,4" />
        <text x="60" y="224" textAnchor="middle" fontSize="10" fill="#64748b">Normal sea level</text>

        {/* Ocean base */}
        <rect x="10" y="230" width="350" height="130" fill="url(#ss-ocean)" opacity="0.6" />

        {/* Seabed slope */}
        <line x1="10" y1="360" x2="360" y2="230" stroke="#a16207" strokeWidth="2.5" />
        <text x="140" y="310" textAnchor="middle" fontSize="10" fill="#ca8a04">Gently sloping seabed</text>
        <text x="140" y="322" textAnchor="middle" fontSize="10" fill="#ca8a04">(amplifies surge)</text>

        {/* Animated surge water rising */}
        <g className="ss-surge">
          <path d="M 220,230 Q 280,170 350,178 L 440,178 L 440,360 L 220,360 Z"
            fill="#2563eb" opacity="0.35" />
          <path d="M 220,230 Q 280,170 350,178 L 440,178"
            fill="none" stroke="#60a5fa" strokeWidth="2.5" />
          {/* Flooding over coast */}
          <path d="M 350,178 L 440,178 L 440,220 Q 410,188 360,195 Z" fill="#3b82f6" opacity="0.25" />
          <text x="400" y="195" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Flooding</text>
        </g>

        {/* Surge height bracket */}
        <line x1="460" y1="178" x2="460" y2="230" stroke="#f87171" strokeWidth="2" />
        <line x1="452" y1="178" x2="468" y2="178" stroke="#f87171" strokeWidth="2" />
        <line x1="452" y1="230" x2="468" y2="230" stroke="#f87171" strokeWidth="2" />
        <text x="502" y="198" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f87171">Storm</text>
        <text x="502" y="212" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f87171">Surge</text>
        <text x="502" y="226" textAnchor="middle" fontSize="10" fill="#fca5a5">3-10 m</text>

        {/* Land/coast */}
        <polygon points="360,230 550,230 550,360 360,360" fill="url(#ss-land)" />
        <polygon points="360,230 395,210 440,200 490,205 550,230" fill="#854d0e" opacity="0.7" />

        {/* Houses on coast */}
        <g className="ss-house">
          {/* House 1 */}
          <rect x="415" y="200" width="20" height="22" fill="#94a3b8" />
          <polygon points="410,200 425,185 440,200" fill="#dc2626" />
          <rect x="422" y="210" width="6" height="12" fill="#475569" />
          {/* House 2 */}
          <rect x="460" y="206" width="16" height="18" fill="#94a3b8" />
          <polygon points="456,206 468,194 480,206" fill="#dc2626" />
          <rect x="465" y="214" width="5" height="10" fill="#475569" />
        </g>

        {/* Key info bar */}
        <rect x="15" y="368" width="530" height="26" rx="4" fill="none" stroke="#475569" strokeWidth="1" />
        <text x="280" y="385" textAnchor="middle" fontSize="10" fill="#94a3b8">
          Surge depends on: storm intensity + coastline shape + seabed slope + tide timing
        </text>
      </svg>
    </div>
  );
}
