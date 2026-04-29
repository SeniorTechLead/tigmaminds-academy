export default function WoodpeckerImpulseTheoryDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Impulse equals force times time: extending time reduces peak force, crumple zone analogy"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .eq { font-family: system-ui, sans-serif; font-size: 15px; font-weight: 600; }
        `}</style>

        <rect width="640" height="430" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Impulse-Momentum Theorem
        </text>

        {/* Formula */}
        <rect x="140" y="38" width="360" height="28" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="320" y="58" textAnchor="middle" className="eq" fill="#fbbf24">
          J = F x dt   (same impulse, different shapes)
        </text>

        {/* Two force-time graphs side by side */}
        {/* Hard impact (short time, high force) */}
        <g transform="translate(30, 85)">
          <text x="120" y="0" textAnchor="middle" className="label" fill="#ef4444" fontWeight="600">Hard Impact (no absorption)</text>

          <line x1="30" y1="15" x2="30" y2="165" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
          <line x1="30" y1="165" x2="260" y2="165" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

          <text x="10" y="90" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500" transform="rotate(-90,10,90)">Force</text>
          <text x="145" y="183" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Time</text>

          {/* Tall narrow spike */}
          <path d="M70,165 L75,25 L80,165" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="2" />

          {/* Peak force label */}
          <line x1="77" y1="25" x2="150" y2="25" stroke="#fca5a5" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="155" y="29" className="sm" fill="#fca5a5">Peak: very high</text>

          {/* Time bracket */}
          <line x1="70" y1="175" x2="80" y2="175" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="75" y="190" textAnchor="middle" className="sm" fill="#fbbf24">dt (tiny)</text>

          {/* Area label */}
          <text x="140" y="105" className="sm fill-gray-500 dark:fill-slate-400">Area = Impulse J</text>
        </g>

        {/* Absorbed impact (long time, low force) */}
        <g transform="translate(330, 85)">
          <text x="130" y="0" textAnchor="middle" className="label" fill="#22c55e" fontWeight="600">Absorbed Impact (with spongy bone)</text>

          <line x1="30" y1="15" x2="30" y2="165" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
          <line x1="30" y1="165" x2="270" y2="165" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

          <text x="10" y="90" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500" transform="rotate(-90,10,90)">Force</text>
          <text x="150" y="183" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Time</text>

          {/* Wide low curve */}
          <path d="M50,165 Q85,105 130,95 Q170,85 220,165" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="2" />

          {/* Peak force label */}
          <line x1="130" y1="95" x2="195" y2="65" stroke="#86efac" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="200" y="60" className="sm" fill="#86efac">Peak: much lower</text>

          {/* Time bracket */}
          <line x1="50" y1="175" x2="220" y2="175" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="135" y="190" textAnchor="middle" className="sm" fill="#fbbf24">dt (extended)</text>

          {/* Area label */}
          <text x="155" y="135" className="sm fill-gray-500 dark:fill-slate-400">Same area = Same J</text>
        </g>

        {/* Key insight */}
        <rect x="80" y="288" width="480" height="32" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#fbbf24" strokeWidth="1" />
        <text x="320" y="309" textAnchor="middle" className="label" fill="#fbbf24">
          Same momentum change, but spreading it over time reduces peak force dramatically
        </text>

        {/* Crumple zone analogy */}
        <g transform="translate(30, 335)">
          <text x="290" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" fontWeight="600">
            Same Principle: Car Crumple Zones
          </text>

          {/* Rigid car */}
          <g transform="translate(30, 15)">
            <rect x="0" y="5" width="60" height="25" rx="3" fill="#475569" stroke="#64748b" strokeWidth="1" />
            <circle cx="12" cy="33" r="6" fill="#334155" stroke="#64748b" strokeWidth="1" />
            <circle cx="48" cy="33" r="6" fill="#334155" stroke="#64748b" strokeWidth="1" />
            <rect x="60" y="0" width="8" height="35" rx="2" fill="#ef4444" opacity="0.5" />
            <text x="30" y="58" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Rigid = high force</text>
          </g>

          {/* Crumple car */}
          <g transform="translate(220, 15)">
            <rect x="0" y="5" width="40" height="25" rx="3" fill="#475569" stroke="#64748b" strokeWidth="1" />
            <circle cx="8" cy="33" r="6" fill="#334155" stroke="#64748b" strokeWidth="1" />
            <circle cx="32" cy="33" r="6" fill="#334155" stroke="#64748b" strokeWidth="1" />
            {/* Crumple zone */}
            <path d="M40,5 L48,8 L42,13 L50,18 L44,23 L52,28 L40,30" fill="none" stroke="#22c55e" strokeWidth="1.5" />
            <text x="30" y="58" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Crumple = low force</text>
          </g>

          {/* Woodpecker skull */}
          <g transform="translate(430, 15)">
            <ellipse cx="30" cy="18" rx="25" ry="22" className="fill-gray-100 dark:fill-slate-800" stroke="#d97706" strokeWidth="1.5" />
            <ellipse cx="30" cy="18" rx="18" ry="15" fill="#d97706" opacity="0.15" strokeDasharray="3 2" stroke="#d97706" strokeWidth="1" />
            <polygon points="55,16 80,15 80,22 55,21" fill="#d97706" />
            <text x="40" y="58" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Spongy bone = crumple</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
