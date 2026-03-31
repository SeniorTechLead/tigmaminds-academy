export default function ClimateVsWeatherDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 540 360" className="w-full h-auto" role="img"
        aria-label="Animated side-by-side comparison: weather is chaotic and jumpy, climate is smooth and gradual">
        <style>{`
          @keyframes drawJagged {
            0% { stroke-dashoffset: 600; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes drawSmooth {
            0% { stroke-dashoffset: 300; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes rainDrop {
            0% { transform: translateY(-6px); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: translateY(14px); opacity: 0; }
          }
          @keyframes cloudDrift {
            0% { transform: translateX(0); }
            50% { transform: translateX(12px); }
            100% { transform: translateX(0); }
          }
          @keyframes sunPeek {
            0%, 100% { opacity: 0; transform: scale(0.7); }
            30%, 70% { opacity: 0.9; transform: scale(1); }
          }
          @keyframes sunHide {
            0%, 100% { opacity: 0.9; }
            40%, 60% { opacity: 0; }
          }
          @keyframes tempBarRise {
            0% { height: 0; y: 265; }
            100% { height: 50; y: 215; }
          }
          @keyframes tempFlicker {
            0% { height: 30; y: 235; }
            15% { height: 45; y: 220; }
            30% { height: 20; y: 245; }
            45% { height: 50; y: 215; }
            60% { height: 15; y: 250; }
            75% { height: 40; y: 225; }
            90% { height: 25; y: 240; }
            100% { height: 30; y: 235; }
          }
          @keyframes lightningFlash {
            0%, 90%, 100% { opacity: 0; }
            93%, 97% { opacity: 1; }
          }
          @keyframes decadeLabel {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .jagged-line { stroke-dasharray: 600; animation: drawJagged 4s linear infinite; }
          .smooth-line { stroke-dasharray: 300; animation: drawSmooth 6s ease-out infinite; }
          .rain1 { animation: rainDrop 0.9s linear infinite; }
          .rain2 { animation: rainDrop 0.9s linear 0.3s infinite; }
          .rain3 { animation: rainDrop 0.9s linear 0.6s infinite; }
          .rain4 { animation: rainDrop 0.7s linear 0.15s infinite; }
          .rain5 { animation: rainDrop 0.7s linear 0.45s infinite; }
          .cloud-move { animation: cloudDrift 5s ease-in-out infinite; }
          .sun-appear { animation: sunPeek 6s ease-in-out infinite; }
          .sun-vanish { animation: sunHide 6s ease-in-out infinite; }
          .temp-flicker { animation: tempFlicker 3s ease-in-out infinite; }
          .temp-steady { animation: tempBarRise 5s ease-out forwards; }
          .lightning { animation: lightningFlash 4s linear infinite; }
          .decade-fade { animation: decadeLabel 3s ease-out forwards; }
        `}</style>

        <rect width="540" height="360" rx="8" className="fill-slate-950" />

        <text x="270" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          Climate vs Weather
        </text>

        {/* ===== WEATHER SIDE (Left) ===== */}
        <rect x="15" y="42" width="248" height="270" rx="8" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="15" y="42" width="248" height="28" rx="8" fill="#1e40af" opacity="0.3" />
        <text x="139" y="61" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#93c5fd">WEATHER</text>

        <text x="139" y="85" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">What you get today</text>

        {/* Animated weather scene */}
        {/* Sun that appears and disappears */}
        <circle cx="55" cy="110" r="14" fill="#fbbf24" className="sun-appear" />

        {/* Drifting cloud that sometimes covers sun */}
        <g className="cloud-move">
          <ellipse cx="80" cy="108" rx="24" ry="11" className="fill-gray-500 dark:fill-slate-400" opacity="0.85" />
          <ellipse cx="65" cy="112" rx="16" ry="9" className="fill-gray-500 dark:fill-slate-400" opacity="0.85" />
          <ellipse cx="95" cy="112" rx="16" ry="9" className="fill-gray-500 dark:fill-slate-400" opacity="0.85" />
          {/* Rain falling from cloud */}
          <line x1="72" y1="120" x2="72" y2="126" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="rain1" />
          <line x1="82" y1="120" x2="82" y2="126" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="rain2" />
          <line x1="92" y1="120" x2="92" y2="126" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="rain3" />
          <line x1="67" y1="121" x2="67" y2="127" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="rain4" />
          <line x1="87" y1="121" x2="87" y2="127" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="rain5" />
        </g>

        {/* Storm cloud with lightning */}
        <g transform="translate(150, 98)">
          <ellipse cx="30" cy="0" rx="26" ry="12" className="fill-gray-400 dark:fill-slate-500" />
          <ellipse cx="12" cy="4" rx="17" ry="10" className="fill-gray-400 dark:fill-slate-500" />
          <ellipse cx="48" cy="4" rx="17" ry="10" className="fill-gray-400 dark:fill-slate-500" />
          {/* Lightning bolt */}
          <polyline points="30,14 26,22 32,22 27,32" fill="none" stroke="#fbbf24" strokeWidth="2" className="lightning" />
        </g>

        <text x="139" y="150" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Changes hour by hour, day by day</text>
        <text x="139" y="164" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Specific place and time</text>

        {/* Flickering temperature bar */}
        <rect x="30" y="235" width="12" height="30" rx="2" fill="#60a5fa" className="temp-flicker" />
        <text x="36" y="280" textAnchor="middle" fontSize="9" className="fill-gray-400 dark:fill-slate-500">T</text>

        {/* Weather graph — jagged self-drawing line */}
        <line x1="52" y1="180" x2="52" y2="275" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="52" y1="275" x2="240" y2="275" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <polyline
          points="58,255 72,235 82,262 94,228 106,260 116,242 128,222 140,265 152,240 166,255 178,232 192,258 206,245 220,260 235,238"
          fill="none" stroke="#60a5fa" strokeWidth="2" className="jagged-line" />
        <text x="146" y="292" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">Days →</text>

        {/* ===== CLIMATE SIDE (Right) ===== */}
        <rect x="277" y="42" width="248" height="270" rx="8" fill="none" stroke="#f87171" strokeWidth="1.5" />
        <rect x="277" y="42" width="248" height="28" rx="8" fill="#991b1b" opacity="0.3" />
        <text x="401" y="61" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fca5a5">CLIMATE</text>

        <text x="401" y="85" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f87171">What you expect over decades</text>

        {/* Steady thermometer icon */}
        <rect x="340" y="100" width="8" height="35" rx="4" fill="none" stroke="#f87171" strokeWidth="1.5" />
        <circle cx="344" cy="140" r="7" fill="none" stroke="#f87171" strokeWidth="1.5" />
        <rect x="342" y="115" width="4" height="22" rx="2" fill="#f87171" className="temp-steady" />
        <text x="360" y="125" fontSize="10" fill="#fca5a5">Avg</text>

        {/* Graph icon */}
        <text x="410" y="128" fontSize="22">📊</text>

        <text x="401" y="155" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Average of 30+ years of weather</text>
        <text x="401" y="169" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Long-term pattern for a region</text>

        {/* Steady temperature bar rising gradually */}
        <rect x="292" y="215" width="12" height="50" rx="2" fill="#f87171" className="temp-steady" opacity="0.7" />
        <text x="298" y="280" textAnchor="middle" fontSize="9" className="fill-gray-400 dark:fill-slate-500">T</text>

        {/* Climate graph — smooth slowly-drawing trend */}
        <line x1="314" y1="180" x2="314" y2="275" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="314" y1="275" x2="500" y2="275" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <path
          d="M 320 262 Q 355 258, 380 252 Q 415 244, 440 235 Q 460 228, 475 220 Q 490 214, 496 208"
          fill="none" stroke="#f87171" strokeWidth="2.5" className="smooth-line" />
        {/* Shaded area under trend */}
        <path
          d="M 320 262 Q 355 258, 380 252 Q 415 244, 440 235 Q 460 228, 475 220 Q 490 214, 496 208 L 496 275 L 320 275 Z"
          fill="#f87171" opacity="0.08" />
        <text x="408" y="292" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">Decades →</text>

        {/* Decade markers */}
        <text x="330" y="275" fontSize="8" fill="#475569" className="decade-fade" style={{ animationDelay: '0.5s' }}>1990</text>
        <text x="380" y="275" fontSize="8" fill="#475569" className="decade-fade" style={{ animationDelay: '1.5s' }}>2000</text>
        <text x="430" y="275" fontSize="8" fill="#475569" className="decade-fade" style={{ animationDelay: '2.5s' }}>2010</text>
        <text x="480" y="275" fontSize="8" fill="#475569" className="decade-fade" style={{ animationDelay: '3.5s' }}>2020</text>

        {/* Key insight */}
        <rect x="60" y="322" width="420" height="28" rx="6" fill="none" stroke="#fbbf24" strokeWidth="1" />
        <text x="270" y="340" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">
          Climate is what you expect. Weather is what you get.
        </text>
      </svg>
    </div>
  );
}
