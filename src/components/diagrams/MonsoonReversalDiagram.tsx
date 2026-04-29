const MonsoonReversalDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 560"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing the seasonal reversal of monsoon winds between summer and winter"
      >
        <style>{`
          @keyframes windFlow {
            0% { stroke-dashoffset: 16; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes itczShift {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .wind-flow {
            animation: windFlow 1.5s linear infinite;
          }
          .itcz-pulse {
            animation: itczShift 2s ease-in-out infinite;
          }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 12px;
            font-weight: 600;
          }
          .section-title {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
          }
          .small-text {
            font-family: system-ui, sans-serif;
            font-size: 9px;
          }
        `}</style>

        <defs>
          <marker id="mrev-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="mrev-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="mrev-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
          </marker>
          <marker id="mrev-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="620" height="540" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Main title */}
        <text x="310" y="22" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          The Great Reversal — Summer vs Winter Monsoon
        </text>

        {/* ===== TOP HALF: SUMMER MONSOON (June–September) ===== */}
        <rect x="15" y="35" width="590" height="225" rx="6"
          className="fill-red-50/50 dark:fill-red-900/10 stroke-red-200 dark:stroke-red-800" strokeWidth="1" />

        <text x="310" y="52" textAnchor="middle"
          className="section-title fill-red-700 dark:fill-red-300">
          SUMMER (June–September): Southwest Monsoon — WET season
        </text>

        {/* Simplified map: India + ocean */}
        {/* Indian landmass */}
        <path d="M 200 80 L 260 80 L 280 100 L 300 80 L 360 80 L 380 110 L 370 140 L 340 170 L 310 200 L 290 210 L 270 195 L 240 170 L 220 140 L 200 110 Z"
          className="fill-amber-200 dark:fill-amber-800" stroke="#d97706" strokeWidth="1.5" />
        <text x="290" y="140" textAnchor="middle"
          className="label-text fill-amber-900 dark:fill-amber-200" fontWeight="600">
          India
        </text>
        <text x="290" y="155" textAnchor="middle"
          className="small-text fill-red-600 dark:fill-red-400">
          HOT (45°C)
        </text>
        <text x="290" y="167" textAnchor="middle"
          className="small-text fill-red-600 dark:fill-red-400">
          LOW pressure
        </text>

        {/* Himalayas */}
        <path d="M 190 80 L 210 62 L 230 72 L 250 58 L 270 68 L 290 55 L 310 65 L 330 60 L 350 70 L 370 80"
          fill="none" stroke="#94a3b8" strokeWidth="2.5" />
        <text x="290" y="53" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          Himalayas (wall)
        </text>

        {/* Indian Ocean */}
        <rect x="120" y="215" width="340" height="40" rx="4"
          className="fill-blue-200 dark:fill-blue-800" opacity="0.6" />
        <text x="290" y="233" textAnchor="middle"
          className="label-text fill-blue-800 dark:fill-blue-200">
          Indian Ocean (cooler, HIGH pressure)
        </text>

        {/* ITCZ over land in summer */}
        <line x1="180" y1="95" x2="400" y2="95"
          stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" className="itcz-pulse" />
        <text x="420" y="98" className="small-text fill-red-600 dark:fill-red-400" fontWeight="600">
          ITCZ (shifts north)
        </text>

        {/* Southwest monsoon wind arrows */}
        <path d="M 160 240 Q 170 200, 220 160" fill="none" stroke="#34d399" strokeWidth="2.5"
          strokeDasharray="8 4" className="wind-flow" markerEnd="url(#mrev-arrow-green)" />
        <path d="M 210 245 Q 230 200, 270 170" fill="none" stroke="#34d399" strokeWidth="2.5"
          strokeDasharray="8 4" className="wind-flow" markerEnd="url(#mrev-arrow-green)" />
        <path d="M 280 245 Q 310 200, 330 160" fill="none" stroke="#34d399" strokeWidth="2.5"
          strokeDasharray="8 4" className="wind-flow" markerEnd="url(#mrev-arrow-green)" />

        {/* Wind label */}
        <rect x="420" y="150" width="175" height="60" rx="4"
          className="fill-emerald-50 dark:fill-emerald-900/30 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="507" y="167" textAnchor="middle"
          className="label-text fill-emerald-700 dark:fill-emerald-300" fontWeight="600">
          SW Monsoon winds
        </text>
        <text x="507" y="181" textAnchor="middle"
          className="small-text fill-emerald-600 dark:fill-emerald-400">
          Moist ocean air rushes to
        </text>
        <text x="507" y="193" textAnchor="middle"
          className="small-text fill-emerald-600 dark:fill-emerald-400">
          hot land → HEAVY RAIN
        </text>
        <text x="507" y="205" textAnchor="middle"
          className="small-text fill-emerald-600 dark:fill-emerald-400">
          (80% of India’s annual rain)
        </text>

        {/* ===== BOTTOM HALF: WINTER MONSOON (October–March) ===== */}
        <rect x="15" y="270" width="590" height="225" rx="6"
          className="fill-blue-50/50 dark:fill-blue-900/10 stroke-blue-200 dark:stroke-blue-800" strokeWidth="1" />

        <text x="310" y="287" textAnchor="middle"
          className="section-title fill-blue-700 dark:fill-blue-300">
          WINTER (October–March): Northeast Monsoon — DRY season (mostly)
        </text>

        {/* India in winter */}
        <path d="M 200 315 L 260 315 L 280 335 L 300 315 L 360 315 L 380 345 L 370 375 L 340 405 L 310 435 L 290 445 L 270 430 L 240 405 L 220 375 L 200 345 Z"
          className="fill-blue-100 dark:fill-blue-900" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="290" y="375" textAnchor="middle"
          className="label-text fill-blue-900 dark:fill-blue-200" fontWeight="600">
          India
        </text>
        <text x="290" y="390" textAnchor="middle"
          className="small-text fill-blue-600 dark:fill-blue-400">
          COLD (10°C)
        </text>
        <text x="290" y="402" textAnchor="middle"
          className="small-text fill-blue-600 dark:fill-blue-400">
          HIGH pressure
        </text>

        {/* Himalayas */}
        <path d="M 190 315 L 210 297 L 230 307 L 250 293 L 270 303 L 290 290 L 310 300 L 330 295 L 350 305 L 370 315"
          fill="none" stroke="#94a3b8" strokeWidth="2.5" />

        {/* Indian Ocean in winter */}
        <rect x="120" y="448" width="340" height="35" rx="4"
          className="fill-blue-300 dark:fill-blue-700" opacity="0.6" />
        <text x="290" y="468" textAnchor="middle"
          className="label-text fill-blue-900 dark:fill-blue-100">
          Indian Ocean (warmer, LOW pressure)
        </text>

        {/* ITCZ over ocean in winter */}
        <line x1="130" y1="450" x2="450" y2="450"
          stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 3" className="itcz-pulse" />
        <text x="470" y="453" className="small-text fill-blue-600 dark:fill-blue-400" fontWeight="600">
          ITCZ (shifts south)
        </text>

        {/* NE monsoon wind arrows (land to sea) */}
        <path d="M 240 380 Q 220 420, 180 455" fill="none" stroke="#f59e0b" strokeWidth="2.5"
          strokeDasharray="8 4" className="wind-flow" markerEnd="url(#mrev-arrow-amber)" />
        <path d="M 290 410 Q 280 430, 260 460" fill="none" stroke="#f59e0b" strokeWidth="2.5"
          strokeDasharray="8 4" className="wind-flow" markerEnd="url(#mrev-arrow-amber)" />
        <path d="M 340 380 Q 350 420, 370 455" fill="none" stroke="#f59e0b" strokeWidth="2.5"
          strokeDasharray="8 4" className="wind-flow" markerEnd="url(#mrev-arrow-amber)" />

        {/* Wind label */}
        <rect x="420" y="380" width="175" height="60" rx="4"
          className="fill-amber-50 dark:fill-amber-900/30 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="507" y="397" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          NE Monsoon winds
        </text>
        <text x="507" y="411" textAnchor="middle"
          className="small-text fill-amber-600 dark:fill-amber-400">
          DRY cold air blows from
        </text>
        <text x="507" y="423" textAnchor="middle"
          className="small-text fill-amber-600 dark:fill-amber-400">
          land to ocean → dry season
        </text>
        <text x="507" y="435" textAnchor="middle"
          className="small-text fill-amber-600 dark:fill-amber-400">
          (except Tamil Nadu coast)
        </text>

        {/* Reversal arrow between sections */}
        <path d="M 30 258 L 30 272" stroke="#6366f1" strokeWidth="2"
          markerEnd="url(#mrev-arrow-blue)" />
        <text x="45" y="268" className="small-text fill-indigo-600 dark:fill-indigo-400" fontWeight="600">
          WINDS REVERSE 180°
        </text>

        {/* Bottom summary */}
        <rect x="30" y="500" width="560" height="32" rx="4"
          className="fill-indigo-50 dark:fill-indigo-900/20 stroke-indigo-300 dark:stroke-indigo-700" strokeWidth="1" />
        <text x="310" y="514" textAnchor="middle"
          className="label-text fill-indigo-700 dark:fill-indigo-200" fontWeight="600">
          The ITCZ (Inter-Tropical Convergence Zone) shifts north in summer and south in winter,
        </text>
        <text x="310" y="526" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-300">
          dragging the wind belts with it. This is why the monsoon reverses — it follows the sun’s seasonal migration.
        </text>
      </svg>
    </div>
  );
};

export default MonsoonReversalDiagram;
