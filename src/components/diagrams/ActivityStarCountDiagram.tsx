export default function ActivityStarCountDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 425"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Star counting activity: compare city sky with about 20 stars to dark sky with thousands of stars"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .count { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
          @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .twinkle1 { animation: twinkle 2s ease-in-out infinite; }
          .twinkle2 { animation: twinkle 2.5s ease-in-out infinite 0.5s; }
          .twinkle3 { animation: twinkle 1.8s ease-in-out infinite 1s; }
        `}</style>

        {/* Background */}
        <rect width="600" height="380" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: Count Stars From Two Locations
        </text>

        {/* --- Left panel: City sky --- */}
        <rect x="20" y="45" width="265" height="230" rx="6" fill="#1e1b2e" />

        {/* Orange light pollution glow */}
        <ellipse cx="152" cy="275" rx="140" ry="60" fill="#f97316" opacity="0.08" />
        <ellipse cx="152" cy="275" rx="100" ry="40" fill="#f97316" opacity="0.06" />

        {/* City skyline */}
        <rect x="40" y="220" width="30" height="55" fill="#334155" />
        <rect x="45" y="225" width="6" height="6" fill="#fbbf24" opacity="0.7" />
        <rect x="57" y="232" width="6" height="6" fill="#fbbf24" opacity="0.5" />
        <rect x="80" y="200" width="40" height="75" fill="#374151" />
        <rect x="85" y="205" width="6" height="6" fill="#fbbf24" opacity="0.6" />
        <rect x="95" y="215" width="6" height="6" fill="#fbbf24" opacity="0.8" />
        <rect x="105" y="205" width="6" height="6" fill="#fbbf24" opacity="0.5" />
        <rect x="85" y="225" width="6" height="6" fill="#fbbf24" opacity="0.4" />
        <rect x="130" y="230" width="25" height="45" fill="#334155" />
        <rect x="165" y="210" width="35" height="65" fill="#374151" />
        <rect x="170" y="215" width="6" height="6" fill="#fbbf24" opacity="0.7" />
        <rect x="185" y="225" width="6" height="6" fill="#fbbf24" opacity="0.5" />
        <rect x="210" y="235" width="28" height="40" fill="#334155" />
        <rect x="245" y="220" width="30" height="55" fill="#374151" />

        {/* Streetlights */}
        <line x1="55" y1="260" x2="55" y2="275" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="55" cy="258" r="3" fill="#fbbf24" opacity="0.9" />
        <ellipse cx="55" cy="265" rx="8" ry="4" fill="#fbbf24" opacity="0.15" />
        <line x1="190" y1="260" x2="190" y2="275" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="190" cy="258" r="3" fill="#fbbf24" opacity="0.9" />
        <ellipse cx="190" cy="265" rx="8" ry="4" fill="#fbbf24" opacity="0.15" />

        {/* Few dim stars (~20) */}
        {[
          [60,70],[90,55],[130,80],[170,60],[200,90],[240,65],
          [55,110],[100,130],[145,105],[190,120],[230,100],[260,130],
          [75,160],[120,170],[160,150],[210,165],[250,155],
          [95,95],[180,85],[140,140]
        ].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={1.2} className="fill-gray-700 dark:fill-slate-200"
            opacity={0.4 + (i % 3) * 0.15}
            className={i % 4 === 0 ? 'twinkle1' : ''} />
        ))}

        <text x="152" y="295" textAnchor="middle" className="count fill-orange-400">~20 stars</text>
        <text x="152" y="310" textAnchor="middle" className="label fill-slate-400">City sky</text>
        <text x="152" y="324" textAnchor="middle" className="small fill-orange-300">Light pollution hides most stars</text>

        {/* --- Right panel: Dark sky --- */}
        <rect x="315" y="45" width="265" height="230" rx="6" fill="#0a0a1a" />

        {/* Milky Way band */}
        <ellipse cx="447" cy="140" rx="130" ry="25" fill="#c4b5fd" opacity="0.06"
          transform="rotate(-30,447,140)" />
        <ellipse cx="447" cy="140" rx="110" ry="15" fill="#e0d5ff" opacity="0.05"
          transform="rotate(-30,447,140)" />

        {/* Many bright stars */}
        {Array.from({ length: 80 }, (_, i) => {
          const cx = 325 + (i * 37 + i * i * 7) % 245;
          const cy = 55 + (i * 23 + i * i * 3) % 210;
          const r = 0.5 + (i % 5) * 0.4;
          const opacity = 0.5 + (i % 4) * 0.15;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} className="fill-gray-900 dark:fill-slate-50"
              opacity={opacity}
              className={i % 7 === 0 ? 'twinkle2' : i % 11 === 0 ? 'twinkle3' : ''} />
          );
        })}

        {/* A few bright stars */}
        <circle cx="380" cy="80" r="2" fill="#fef3c7" opacity="0.9" />
        <circle cx="500" cy="100" r="2.5" fill="#e0f2fe" opacity="0.85" />
        <circle cx="430" cy="180" r="2" fill="#fef3c7" opacity="0.9" />
        <circle cx="540" cy="200" r="1.8" fill="#e0f2fe" opacity="0.8" />

        {/* Dark horizon — gentle hills */}
        <path d="M 315 265 Q 360 250 400 260 Q 450 245 500 255 Q 550 248 580 258 L 580 275 L 315 275 Z"
          className="fill-white dark:fill-slate-950" />

        <text x="447" y="295" textAnchor="middle" className="count fill-indigo-300">~4000 stars</text>
        <text x="447" y="310" textAnchor="middle" className="label fill-slate-400">Dark sky</text>
        <text x="447" y="324" textAnchor="middle" className="small fill-indigo-300">No light pollution</text>

        {/* --- Notebook at bottom --- */}
        <rect x="200" y="335" width="200" height="38" rx="4" fill="#fef3c7" />
        <line x1="210" y1="348" x2="390" y2="348" stroke="#d97706" strokeWidth="0.5" />
        <line x1="210" y1="358" x2="390" y2="358" stroke="#d97706" strokeWidth="0.5" />
        <line x1="210" y1="368" x2="390" y2="368" stroke="#d97706" strokeWidth="0.5" />
        {/* Tally marks */}
        <text x="220" y="347" className="small" fill="#92400e">City: |||| |||| |||| ||||</text>
        <text x="220" y="357" className="small" fill="#92400e">Dark: |||| |||| |||| |||| |||| ...</text>
        <text x="220" y="367" className="small" fill="#92400e">Fist patch: city 3, dark 40+</text>

        {/* Instruction */}
        <text x="300" y="375" textAnchor="middle" className="small fill-slate-500">
          Count stars in a fist-sized patch of sky from two locations
        </text>

        {/* VS divider */}
        <text x="300" y="165" textAnchor="middle" className="title fill-slate-600">VS</text>
      </svg>
    </div>
  );
}
