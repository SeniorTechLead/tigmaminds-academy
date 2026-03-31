export default function SunsetPathDiagram() {
  const spectrumColors = [
    { color: '#8B00FF', label: 'Violet' },
    { color: '#4169E1', label: 'Blue' },
    { color: '#00A86B', label: 'Green' },
    { color: '#FFD700', label: 'Yellow' },
    { color: '#FF8C00', label: 'Orange' },
    { color: '#DC143C', label: 'Red' },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 via-indigo-950 to-orange-950 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
        Why Sunsets Are Orange — The Path Length Effect
      </p>
      <svg viewBox="0 0 800 520" className="w-full max-w-2xl mx-auto">
        {/* Stars */}
        {Array.from({ length: 20 }, (_, i) => (
          <circle key={i} cx={30 + Math.random() * 740} cy={10 + Math.random() * 50} r={0.8} className="fill-gray-900 dark:fill-white" opacity={0.3} />
        ))}

        {/* --- Summary boxes --- */}
        <rect x="30" y="70" width="230" height="46" rx="8" fill="rgba(255,255,255,0.07)" />
        <text x="145" y="90" textAnchor="middle" fontSize="12" className="fill-gray-900 dark:fill-white">
          <tspan fontWeight="bold">Noon:</tspan> white-yellow sun
        </text>
        <text x="145" y="106" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)">All colours arrive ✓</text>

        <rect x="530" y="70" width="240" height="46" rx="8" fill="rgba(255,140,0,0.12)" />
        <text x="650" y="90" textAnchor="middle" fontSize="12" fill="#FF8C00">
          <tspan fontWeight="bold">Sunset:</tspan> orange-red sun
        </text>
        <text x="650" y="106" textAnchor="middle" fontSize="11" fill="rgba(255,165,0,0.5)">Blue, green, yellow scattered away ✗</text>

        {/* --- Comparison text --- */}
        <text x="400" y="150" textAnchor="middle" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.4)">More air = more scattering = fewer short wavelengths survive</text>

        {/* --- Earth surface --- */}
        <path d="M 0 380 Q 400 350 800 380 L 800 460 L 0 460 Z" fill="#2d5016" />
        <path d="M 0 382 Q 400 352 800 382" stroke="#4a7c28" strokeWidth={1} fill="none" />

        {/* --- Atmosphere band --- */}
        <path d="M 0 310 Q 400 280 800 310 L 800 380 Q 400 350 0 380 Z" fill="rgba(135,206,235,0.08)" />

        {/* ════════ NOON (left side) ════════ */}
        {/* Sun at top */}
        <circle cx="170" cy="30" r="20" fill="#FFF8DC" />
        <circle cx="170" cy="30" r="15" fill="#FFD700" />
        {[0, 30, -30, 60, -60].map((angle, i) => (
          <line key={i}
            x1={170 + Math.sin(angle * Math.PI / 180) * 24}
            y1={30 + Math.cos(angle * Math.PI / 180) * 24}
            x2={170 + Math.sin(angle * Math.PI / 180) * 32}
            y2={30 + Math.cos(angle * Math.PI / 180) * 32}
            stroke="#FFD700" strokeWidth={1.5} />
        ))}

        {/* Noon beam — straight down */}
        <line x1="170" y1="52" x2="170" y2="310" stroke="white" strokeWidth={3} opacity={0.4} />
        <line x1="170" y1="310" x2="170" y2="365" stroke="white" strokeWidth={3} opacity={0.6} />

        {/* Short path label */}
        <text x="200" y="230" fontSize="11" fill="rgba(255,255,255,0.4)">Short path</text>
        <text x="200" y="246" fontSize="11" fill="rgba(255,255,255,0.4)">~20 km of air</text>

        {/* All colours arrive */}
        <text x="170" y="280" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)">All colours arrive</text>
        {spectrumColors.map((c, i) => (
          <circle key={i} cx={135 + i * 14} cy="295" r={4} fill={c.color} opacity={0.85} />
        ))}

        {/* Noon observer */}
        <g transform="translate(170, 350)">
          <circle cx="0" cy="0" r="6" fill="#e5c07b" />
          <line x1="0" y1="6" x2="0" y2="20" stroke="#e5c07b" strokeWidth={1.8} />
          <line x1="-5" y1="12" x2="5" y2="12" stroke="#e5c07b" strokeWidth={1.2} />
          <line x1="0" y1="20" x2="-4" y2="28" stroke="#e5c07b" strokeWidth={1.2} />
          <line x1="0" y1="20" x2="4" y2="28" stroke="#e5c07b" strokeWidth={1.2} />
        </g>
        <text x="170" y="410" textAnchor="middle" fontSize="13" fontWeight="bold" className="fill-gray-900 dark:fill-white">NOON</text>

        {/* ════════ SUNSET (right side) ════════ */}
        {/* Sun at horizon — far right */}
        <circle cx="720" cy="355" r="22" fill="#FF6B35" opacity={0.8} />
        <circle cx="720" cy="355" r="16" fill="#FF4500" />

        {/* Beam path from sun toward observer */}
        <line x1="700" y1="350" x2="420" y2="360" stroke="#FF8C00" strokeWidth={2.5} opacity={0.35} strokeDasharray="5 3" />

        {/* Scattered colours along the beam — VISIBLE with labels */}
        {/* Violet — scattered first */}
        <circle cx="670" cy="340" r={4} fill="#8B00FF" opacity={0.5} />
        <line x1="670" y1="340" x2="665" y2="305" stroke="#8B00FF" strokeWidth={1.5} opacity={0.4} />
        <text x="665" y="298" textAnchor="middle" fontSize="9" fill="#8B00FF" opacity={0.7}>V</text>

        {/* Blue */}
        <circle cx="640" cy="345" r={4} fill="#4169E1" opacity={0.5} />
        <line x1="640" y1="345" x2="635" y2="310" stroke="#4169E1" strokeWidth={1.5} opacity={0.4} />
        <text x="635" y="303" textAnchor="middle" fontSize="9" fill="#4169E1" opacity={0.7}>B</text>

        {/* Green */}
        <circle cx="605" cy="350" r={4} fill="#00A86B" opacity={0.4} />
        <line x1="605" y1="350" x2="600" y2="315" stroke="#00A86B" strokeWidth={1.5} opacity={0.4} />
        <text x="600" y="308" textAnchor="middle" fontSize="9" fill="#00A86B" opacity={0.7}>G</text>

        {/* Yellow */}
        <circle cx="565" cy="354" r={4} fill="#FFD700" opacity={0.4} />
        <line x1="565" y1="354" x2="560" y2="320" stroke="#FFD700" strokeWidth={1.5} opacity={0.4} />
        <text x="560" y="313" textAnchor="middle" fontSize="9" fill="#FFD700" opacity={0.7}>Y</text>

        {/* "scattered away" label — above the scatter lines, clear */}
        <text x="635" y="285" textAnchor="middle" fontSize="11" fontWeight="600" fill="#93c5fd">↑ scattered away</text>

        {/* Surviving orange + red — clearly arriving at observer */}
        <circle cx="460" cy="358" r={5} fill="#FF8C00" opacity={0.95} />
        <circle cx="475" cy="357" r={5} fill="#DC143C" opacity={0.95} />

        {/* Observer — well to the left, clear space */}
        <g transform="translate(420, 345)">
          <circle cx="0" cy="0" r="7" fill="#e5c07b" />
          <line x1="0" y1="7" x2="0" y2="24" stroke="#e5c07b" strokeWidth={2} />
          <line x1="0" y1="14" x2="10" y2="9" stroke="#e5c07b" strokeWidth={1.5} />
          <line x1="0" y1="14" x2="-8" y2="19" stroke="#e5c07b" strokeWidth={1.5} />
          <line x1="0" y1="24" x2="-5" y2="34" stroke="#e5c07b" strokeWidth={1.5} />
          <line x1="0" y1="24" x2="5" y2="34" stroke="#e5c07b" strokeWidth={1.5} />
        </g>

        {/* Labels below observer — in the green earth area */}
        <text x="420" y="415" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#FF8C00">SUNSET</text>
        <text x="420" y="432" textAnchor="middle" fontSize="11" fill="#fdba74">sees only orange &amp; red</text>

        {/* Arrow showing what survived */}
        <text x="510" y="340" textAnchor="middle" fontSize="10" fill="#f97316">only these two survive →</text>

        {/* Bottom note */}
        <text x="400" y="490" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.3)">
          Short wavelengths (violet, blue, green, yellow) scatter away — long wavelengths (orange, red) pass through
        </text>
      </svg>
    </div>
  );
}
