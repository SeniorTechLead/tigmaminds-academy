export default function HydroDesalinationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 604 400" className="w-full max-w-xl mx-auto" role="img" aria-label="Animated reverse osmosis desalination showing water forced through semipermeable membrane while salt is rejected">
        <defs>
          <style>{`
            @keyframes ro-waterPass {
              0% { transform: translateX(0); opacity: 1; }
              40% { opacity: 1; }
              60% { transform: translateX(40px); opacity: 0.9; }
              100% { transform: translateX(100px); opacity: 0; }
            }
            @keyframes ro-saltBounce {
              0% { transform: translateX(0); }
              30% { transform: translateX(12px); }
              50% { transform: translateX(-8px); }
              70% { transform: translateX(4px); }
              100% { transform: translateX(0); }
            }
            @keyframes ro-pressureArrow {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(8px); }
            }
            @keyframes ro-brineDrip {
              0% { transform: translateY(0); opacity: 0.8; }
              100% { transform: translateY(30px); opacity: 0; }
            }
            @keyframes ro-freshCollect {
              0% { transform: translateY(-10px); opacity: 0; }
              50% { opacity: 0.8; }
              100% { transform: translateY(0); opacity: 0; }
            }
            @keyframes ro-membraneGlow {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.6; }
            }
            @keyframes ro-saltJitter {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(1px, -1px); }
              50% { transform: translate(-1px, 1px); }
              75% { transform: translate(1px, 0.5px); }
            }
            .ro-wp { animation: ro-waterPass 3s ease-in-out infinite; }
            .ro-wp2 { animation: ro-waterPass 3s ease-in-out 0.6s infinite; }
            .ro-wp3 { animation: ro-waterPass 3s ease-in-out 1.2s infinite; }
            .ro-wp4 { animation: ro-waterPass 3s ease-in-out 1.8s infinite; }
            .ro-wp5 { animation: ro-waterPass 3s ease-in-out 2.4s infinite; }
            .ro-sb { animation: ro-saltBounce 2s ease-in-out infinite; }
            .ro-sb2 { animation: ro-saltBounce 2s ease-in-out 0.5s infinite; }
            .ro-sb3 { animation: ro-saltBounce 2s ease-in-out 1s infinite; }
            .ro-sb4 { animation: ro-saltBounce 2s ease-in-out 1.5s infinite; }
            .ro-pa { animation: ro-pressureArrow 1.5s ease-in-out infinite; }
            .ro-bd { animation: ro-brineDrip 2s linear infinite; }
            .ro-bd2 { animation: ro-brineDrip 2s linear 0.7s infinite; }
            .ro-bd3 { animation: ro-brineDrip 2s linear 1.4s infinite; }
            .ro-fc { animation: ro-freshCollect 2.5s ease-out infinite; }
            .ro-fc2 { animation: ro-freshCollect 2.5s ease-out 0.8s infinite; }
            .ro-fc3 { animation: ro-freshCollect 2.5s ease-out 1.6s infinite; }
            .ro-mg { animation: ro-membraneGlow 2s ease-in-out infinite; }
            .ro-sj { animation: ro-saltJitter 1.2s ease-in-out infinite; }
            .ro-sj2 { animation: ro-saltJitter 1.2s ease-in-out 0.3s infinite; }
            .ro-sj3 { animation: ro-saltJitter 1.2s ease-in-out 0.6s infinite; }
            .ro-sj4 { animation: ro-saltJitter 1.2s ease-in-out 0.9s infinite; }
          `}</style>

          <linearGradient id="ro-salty" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#1e40af] dark:[stop-color:#1e3a5f]" />
            <stop offset="100%" className="[stop-color:#1e3a8a] dark:[stop-color:#172554]" />
          </linearGradient>
          <linearGradient id="ro-fresh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#7dd3fc] dark:[stop-color:#0c4a6e]" />
            <stop offset="100%" className="[stop-color:#bae6fd] dark:[stop-color:#164e63]" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="280" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Reverse Osmosis — Turning Seawater into Drinking Water
        </text>

        {/* Main chamber */}
        <rect x="30" y="40" width="500" height="220" rx="8" className="fill-gray-100 dark:fill-gray-800" stroke="#6b7280" strokeWidth="2" />

        {/* LEFT: Salty water chamber */}
        <rect x="40" y="50" width="210" height="200" rx="4" fill="url(#ro-salty)" opacity="0.7" />
        <text x="145" y="72" textAnchor="middle" className="fill-blue-200 dark:fill-blue-200" fontSize="12" fontWeight="bold">SEAWATER</text>
        <text x="145" y="86" textAnchor="middle" className="fill-blue-300 dark:fill-blue-300" fontSize="10">(35 g salt/litre)</text>

        {/* Salt crystals (Na+/Cl- jittering) */}
        {[
          [70, 120, 'Na⁺', 'ro-sj'], [120, 140, 'Cl⁻', 'ro-sj2'], [170, 115, 'Na⁺', 'ro-sj3'],
          [85, 165, 'Cl⁻', 'ro-sj4'], [155, 175, 'Na⁺', 'ro-sj'], [100, 195, 'Cl⁻', 'ro-sj2'],
          [180, 150, 'Na⁺', 'ro-sj3'], [60, 190, 'Cl⁻', 'ro-sj4'], [140, 110, 'Na⁺', 'ro-sj'],
          [195, 185, 'Cl⁻', 'ro-sj2'],
        ].map(([cx, cy, label, cls], i) => (
          <g key={`salt-${i}`} className={cls as string}>
            {/* White crystal speck behind */}
            <rect x={Number(cx) - 5} y={Number(cy) - 5} width="10" height="10" rx="1" fill="#fff" opacity="0.5" />
            <circle cx={Number(cx)} cy={Number(cy)} r="6" fill={(label as string).startsWith('Na') ? '#f87171' : '#4ade80'} opacity="0.85" />
            <text x={Number(cx)} y={Number(cy) + 3} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">{label as string}</text>
          </g>
        ))}

        {/* Water molecules on left side */}
        {[[110, 132], [75, 175], [165, 162], [125, 200], [90, 145], [180, 130]].map(([cx, cy], i) => (
          <circle key={`wl-${i}`} cx={cx} cy={cy} r="3.5" fill="#60a5fa" opacity="0.8" />
        ))}

        {/* Pressure arrows (animated push) */}
        <g className="ro-pa">
          {[95, 135, 175].map((y) => (
            <g key={`pa-${y}`}>
              <line x1="46" y1={y} x2="76" y2={y} stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
              <polygon points={`76,${y - 4} 86,${y} 76,${y + 4}`} fill="#fb923c" />
            </g>
          ))}
        </g>
        <text x="48" y="218" className="fill-orange-600 dark:fill-orange-400" fontSize="10" fontWeight="bold">HIGH PRESSURE</text>
        <text x="48" y="232" className="fill-orange-500 dark:fill-orange-300" fontSize="10">50-80 atm  →</text>

        {/* CENTER: Semipermeable membrane */}
        <rect x="254" y="46" width="14" height="208" rx="3" className="fill-purple-400 dark:fill-purple-600" opacity="0.8" />
        {/* Glow effect */}
        <rect x="254" y="46" width="14" height="208" rx="3" className="ro-mg" fill="#c084fc" />
        {/* Pores */}
        {[75, 105, 135, 165, 195, 225].map((y) => (
          <ellipse key={`pore-${y}`} cx="261" cy={y} rx="4" ry="2.5" className="fill-purple-200 dark:fill-purple-400" opacity="0.8" />
        ))}
        <text x="261" y="38" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" fontWeight="bold">Semipermeable</text>
        <text x="261" y="268" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" fontWeight="bold">Membrane</text>

        {/* Water particles squeezing through (animated) */}
        <circle className="ro-wp" cx="248" cy="105" r="3" fill="#60a5fa" />
        <circle className="ro-wp2" cx="248" cy="135" r="3" fill="#60a5fa" />
        <circle className="ro-wp3" cx="248" cy="165" r="3" fill="#60a5fa" />
        <circle className="ro-wp4" cx="248" cy="195" r="3" fill="#60a5fa" />
        <circle className="ro-wp5" cx="248" cy="225" r="3" fill="#60a5fa" />

        {/* Salt bouncing off membrane (animated) */}
        <g className="ro-sb">
          <circle cx="238" cy="90" r="5" fill="#f87171" opacity="0.7" />
          <text x="238" y="93" textAnchor="middle" fill="#fff" fontSize="6">Na</text>
        </g>
        <g className="ro-sb2">
          <circle cx="240" cy="150" r="5" fill="#4ade80" opacity="0.7" />
          <text x="240" y="153" textAnchor="middle" fill="#fff" fontSize="6">Cl</text>
        </g>
        <g className="ro-sb3">
          <circle cx="236" cy="120" r="5" fill="#f87171" opacity="0.7" />
          <text x="236" y="123" textAnchor="middle" fill="#fff" fontSize="6">Na</text>
        </g>
        <g className="ro-sb4">
          <circle cx="239" cy="185" r="5" fill="#4ade80" opacity="0.7" />
          <text x="239" y="188" textAnchor="middle" fill="#fff" fontSize="6">Cl</text>
        </g>

        {/* Blocked symbols */}
        <text x="244" y="95" fill="#ef4444" fontSize="12" fontWeight="bold">✗</text>
        <text x="244" y="155" fill="#ef4444" fontSize="12" fontWeight="bold">✗</text>
        <text x="244" y="125" fill="#ef4444" fontSize="12" fontWeight="bold">✗</text>
        <text x="244" y="190" fill="#ef4444" fontSize="12" fontWeight="bold">✗</text>

        {/* Passed symbols */}
        <text x="272" y="110" fill="#22c55e" fontSize="11" fontWeight="bold">✓</text>
        <text x="272" y="140" fill="#22c55e" fontSize="11" fontWeight="bold">✓</text>
        <text x="272" y="170" fill="#22c55e" fontSize="11" fontWeight="bold">✓</text>
        <text x="272" y="200" fill="#22c55e" fontSize="11" fontWeight="bold">✓</text>

        {/* RIGHT: Fresh water chamber */}
        <rect x="272" y="50" width="248" height="200" rx="4" fill="url(#ro-fresh)" opacity="0.5" />
        <text x="396" y="72" textAnchor="middle" className="fill-sky-700 dark:fill-sky-200" fontSize="12" fontWeight="bold">FRESH WATER</text>
        <text x="396" y="86" textAnchor="middle" className="fill-sky-600 dark:fill-sky-300" fontSize="10">(salt removed)</text>

        {/* Clean water molecules collecting on right */}
        {[
          [310, 120], [350, 140], [400, 115], [320, 165], [385, 175],
          [340, 195], [420, 135], [370, 200], [300, 150], [450, 160],
          [430, 190], [360, 110], [480, 140], [335, 220],
        ].map(([cx, cy], i) => (
          <circle key={`wr-${i}`} cx={cx} cy={cy} r="3.5" fill="#38bdf8" opacity="0.7" />
        ))}
        {/* Fresh collecting animation */}
        <circle className="ro-fc" cx="380" cy="210" r="3" fill="#38bdf8" />
        <circle className="ro-fc2" cx="420" cy="205" r="3" fill="#38bdf8" />
        <circle className="ro-fc3" cx="350" cy="215" r="3" fill="#38bdf8" />

        <rect x="300" y="232" width="190" height="16" rx="3" className="fill-sky-200 dark:fill-sky-800" opacity="0.8" />
        <text x="395" y="244" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" fontSize="10" fontWeight="bold">
          ✔ Clean drinking water
        </text>

        {/* Brine waste output */}
        <path d="M 145,250 L 145,278 L 80,278" fill="none" stroke="#f87171" strokeWidth="2.5" />
        <polygon points="80,274 70,278 80,282" fill="#f87171" />
        <circle className="ro-bd" cx="130" cy="255" r="2.5" fill="#fca5a5" />
        <circle className="ro-bd2" cx="115" cy="262" r="2" fill="#fca5a5" />
        <circle className="ro-bd3" cx="100" cy="270" r="2.5" fill="#fca5a5" />
        <text x="42" y="275" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="bold">Brine</text>
        <text x="42" y="288" className="fill-red-500 dark:fill-red-400" fontSize="10">(super-salty)</text>

        {/* Explanation */}
        <rect x="20" y="298" width="520" height="48" rx="6" className="fill-purple-50 dark:fill-purple-900/20" stroke="#9333ea" strokeWidth="1" />
        <text x="280" y="316" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="11" fontWeight="bold">
          How Reverse Osmosis Works
        </text>
        <text x="280" y="332" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Membrane pores (0.1 nm) let water (0.28 nm) through but block hydrated salt ions (0.7 nm)
        </text>

        {/* Energy comparison */}
        <rect x="20" y="352" width="520" height="42" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="280" y="368" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="11" fontWeight="bold">Energy Cost</text>
        <rect x="50" y="374" width="80" height="10" rx="2" className="fill-green-400 dark:fill-green-600" />
        <text x="140" y="383" className="fill-gray-600 dark:fill-gray-300" fontSize="10">RO: 3-5 kWh/m³</text>
        <rect x="280" y="374" width="150" height="10" rx="2" className="fill-red-400 dark:fill-red-600" />
        <text x="440" y="383" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Distillation: 25+ (6× more!)</text>
      </svg>
    </div>
  );
}
