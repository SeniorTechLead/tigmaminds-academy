export default function OceanCurrentDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 540 420" className="w-full h-auto" role="img"
        aria-label="Animated thermohaline ocean conveyor belt with warm and cold currents flowing, sinking at poles, rising at equator">
        <style>{`
          @keyframes flowRight {
            0% { transform: translateX(-40px); opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translateX(400px); opacity: 0; }
          }
          @keyframes flowLeft {
            0% { transform: translateX(40px); opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translateX(-400px); opacity: 0; }
          }
          @keyframes sinkDown {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(100px); opacity: 0.3; }
          }
          @keyframes riseUp {
            0% { transform: translateY(0); opacity: 0.3; }
            100% { transform: translateY(-100px); opacity: 1; }
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.3; }
          }
          @keyframes waveRipple {
            0% { d: path("M 30 82 Q 80 76, 130 82 Q 180 88, 230 82 Q 280 76, 330 82 Q 380 88, 430 82 Q 480 76, 510 82"); }
            50% { d: path("M 30 82 Q 80 88, 130 82 Q 180 76, 230 82 Q 280 88, 330 82 Q 380 76, 430 82 Q 480 88, 510 82"); }
            100% { d: path("M 30 82 Q 80 76, 130 82 Q 180 88, 230 82 Q 280 76, 330 82 Q 380 88, 430 82 Q 480 76, 510 82"); }
          }
          .warm1 { animation: flowRight 5s linear infinite; }
          .warm2 { animation: flowRight 5s linear 0.7s infinite; }
          .warm3 { animation: flowRight 5s linear 1.4s infinite; }
          .warm4 { animation: flowRight 5s linear 2.1s infinite; }
          .warm5 { animation: flowRight 5s linear 2.8s infinite; }
          .warm6 { animation: flowRight 5s linear 3.5s infinite; }
          .warm7 { animation: flowRight 5s linear 4.2s infinite; }
          .cold1 { animation: flowLeft 6s linear infinite; }
          .cold2 { animation: flowLeft 6s linear 0.85s infinite; }
          .cold3 { animation: flowLeft 6s linear 1.7s infinite; }
          .cold4 { animation: flowLeft 6s linear 2.55s infinite; }
          .cold5 { animation: flowLeft 6s linear 3.4s infinite; }
          .cold6 { animation: flowLeft 6s linear 4.25s infinite; }
          .cold7 { animation: flowLeft 6s linear 5.1s infinite; }
          .sink1 { animation: sinkDown 3s ease-in infinite; }
          .sink2 { animation: sinkDown 3s ease-in 1s infinite; }
          .sink3 { animation: sinkDown 3s ease-in 2s infinite; }
          .rise1 { animation: riseUp 3s ease-out infinite; }
          .rise2 { animation: riseUp 3s ease-out 1s infinite; }
          .rise3 { animation: riseUp 3s ease-out 2s infinite; }
          .shimmer-wave { animation: shimmer 3s ease-in-out infinite; }
        `}</style>

        <rect width="540" height="420" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="270" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Ocean Currents: The Great Conveyor Belt
        </text>
        <text x="270" y="44" textAnchor="middle" fontSize="11" className="fill-slate-500 dark:fill-slate-400">
          Thermohaline circulation — driven by temperature and salt
        </text>

        {/* Labels */}
        <text x="48" y="68" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">Equator</text>
        <text x="492" y="68" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">Poles</text>

        {/* Sun at equator */}
        <circle cx="48" cy="78" r="8" fill="#fbbf24" opacity="0.7" />

        {/* Ice at poles */}
        <polygon points="480,75 490,68 500,75" fill="#e0f2fe" opacity="0.8" />
        <polygon points="490,75 500,68 510,75" fill="#bae6fd" opacity="0.7" />

        {/* Surface water layer — warm */}
        <rect x="30" y="84" width="480" height="65" rx="4" className="fill-red-100 dark:fill-red-900/15" />
        {/* Shimmer overlay */}
        <rect x="30" y="84" width="480" height="65" rx="4" fill="#fca5a5" className="shimmer-wave" />

        <text x="50" y="100" fontSize="10" fontWeight="bold" className="fill-red-600 dark:fill-red-400">WARM SURFACE</text>
        <text x="50" y="114" fontSize="10" className="fill-red-500 dark:fill-red-400">Heated by the Sun near the equator</text>

        {/* Warm surface current arrows (static path) */}
        <path d="M 60,108 Q 150,98 270,108 Q 390,118 480,103" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.3" />

        {/* Animated warm particles flowing right */}
        <circle cx="60" cy="108" r="4" fill="#ef4444" className="warm1" />
        <circle cx="60" cy="112" r="3.5" fill="#f87171" className="warm2" />
        <circle cx="60" cy="104" r="3" fill="#ef4444" className="warm3" />
        <circle cx="60" cy="110" r="4" fill="#dc2626" className="warm4" />
        <circle cx="60" cy="106" r="3.5" fill="#f87171" className="warm5" />
        <circle cx="60" cy="115" r="3" fill="#ef4444" className="warm6" />
        <circle cx="60" cy="102" r="3.5" fill="#dc2626" className="warm7" />

        {/* Direction label */}
        <text x="270" y="94" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">
          Warm current flows toward poles →
        </text>

        {/* Sinking zone at poles */}
        <rect x="475" y="85" width="30" height="130" rx="4" fill="#a78bfa" opacity="0.1" />
        {/* Animated sinking particles */}
        <circle cx="490" cy="110" r="3.5" fill="#a78bfa" className="sink1" />
        <circle cx="485" cy="110" r="3" fill="#8b5cf6" className="sink2" />
        <circle cx="495" cy="110" r="3" fill="#a78bfa" className="sink3" />
        <text x="510" y="158" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a78bfa"
          transform="rotate(90, 510, 158)">SINKS</text>

        {/* Deep water layer — cold */}
        <rect x="30" y="149" width="480" height="120" rx="4" className="fill-blue-100 dark:fill-blue-900/15" />
        <text x="50" y="172" fontSize="10" fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">COLD DEEP WATER</text>
        <text x="50" y="186" fontSize="10" className="fill-blue-500 dark:fill-blue-400">Dense, salty, cold water sinks and flows deep</text>

        {/* Cold deep current path (static) */}
        <path d="M 480,215 Q 370,225 270,215 Q 150,205 60,220" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />

        {/* Animated cold particles flowing left */}
        <circle cx="480" cy="215" r="4" fill="#3b82f6" className="cold1" />
        <circle cx="480" cy="220" r="3.5" fill="#2563eb" className="cold2" />
        <circle cx="480" cy="210" r="3" fill="#3b82f6" className="cold3" />
        <circle cx="480" cy="218" r="4" fill="#1d4ed8" className="cold4" />
        <circle cx="480" cy="212" r="3.5" fill="#2563eb" className="cold5" />
        <circle cx="480" cy="224" r="3" fill="#3b82f6" className="cold6" />
        <circle cx="480" cy="208" r="3.5" fill="#1d4ed8" className="cold7" />

        {/* Direction label */}
        <text x="270" y="242" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">
          ← Cold current flows along the deep ocean floor
        </text>

        {/* Rising zone at equator */}
        <rect x="30" y="85" width="30" height="130" rx="4" fill="#10b981" opacity="0.1" />
        {/* Animated rising particles */}
        <circle cx="45" cy="210" r="3.5" fill="#10b981" className="rise1" />
        <circle cx="40" cy="210" r="3" fill="#34d399" className="rise2" />
        <circle cx="50" cy="210" r="3" fill="#10b981" className="rise3" />
        <text x="22" y="168" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10b981"
          transform="rotate(-90, 22, 168)">RISES</text>

        {/* Explanation boxes */}
        <rect x="30" y="285" width="155" height="120" rx="8" className="fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="108" y="305" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-red-600 dark:fill-red-400">Why it moves</text>
        <text x="108" y="323" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">Sun heats equatorial</text>
        <text x="108" y="337" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">water. Warm water is</text>
        <text x="108" y="351" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">less dense, so it flows</text>
        <text x="108" y="365" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">along the surface.</text>
        <text x="108" y="393" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-red-500 dark:fill-red-400">Temperature difference</text>

        <rect x="198" y="285" width="145" height="120" rx="8" className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="270" y="305" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">Why it sinks</text>
        <text x="270" y="323" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">At the poles, water</text>
        <text x="270" y="337" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">cools and ice forms,</text>
        <text x="270" y="351" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">leaving salt behind.</text>
        <text x="270" y="365" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">Cold + salty = dense.</text>
        <text x="270" y="393" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-blue-500 dark:fill-blue-400">Salinity difference</text>

        <rect x="356" y="285" width="155" height="120" rx="8" className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="434" y="305" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-emerald-600 dark:fill-emerald-400">Why it matters</text>
        <text x="434" y="323" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">Carries heat from</text>
        <text x="434" y="337" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">the tropics to the</text>
        <text x="434" y="351" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">poles. One full loop</text>
        <text x="434" y="365" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">takes ~1,000 years!</text>
        <text x="434" y="393" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-emerald-500 dark:fill-emerald-400">Climate regulation</text>
      </svg>
    </div>
  );
}
