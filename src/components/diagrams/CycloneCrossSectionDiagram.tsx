const CycloneCrossSectionDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 660 367"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cross-section of a tropical cyclone showing internal structure"
      >
        <style>{`
          @keyframes rainFall {
            0% { transform: translateY(-8px); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: translateY(8px); opacity: 0; }
          }
          @keyframes warmRise {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          .rain-drop {
            animation: rainFall 1.2s linear infinite;
          }
          .rain-drop-d1 { animation-delay: 0s; }
          .rain-drop-d2 { animation-delay: 0.3s; }
          .rain-drop-d3 { animation-delay: 0.6s; }
          .rain-drop-d4 { animation-delay: 0.9s; }
          .rain-drop-d5 { animation-delay: 0.15s; }
          .rain-drop-d6 { animation-delay: 0.45s; }
          .rain-drop-d7 { animation-delay: 0.75s; }
          .rain-drop-d8 { animation-delay: 1.05s; }
          .warm-arrow {
            animation: warmRise 2s ease-in-out infinite;
          }
          .warm-arrow-d1 { animation-delay: 0s; }
          .warm-arrow-d2 { animation-delay: 0.5s; }
          .warm-arrow-d3 { animation-delay: 1s; }
          .warm-arrow-d4 { animation-delay: 1.5s; }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 12px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          <marker id="cyc-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="cyc-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="cyc-arrow-wind" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-300" />
          </marker>
          {/* Cloud gradient */}
          <linearGradient id="eyewall-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
          <linearGradient id="rainband-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="600" height="350" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Sea surface */}
        <rect x="0" y="260" width="600" height="90" rx="0"
          className="fill-blue-400 dark:fill-blue-800" opacity="0.6" />
        <rect x="0" y="260" width="600" height="4"
          className="fill-blue-500 dark:fill-blue-600" />
        {/* Wave hints */}
        <path d="M 0 262 Q 30 256 60 262 Q 90 268 120 262 Q 150 256 180 262 Q 210 268 240 262 Q 270 256 300 262 Q 330 268 360 262 Q 390 256 420 262 Q 450 268 480 262 Q 510 256 540 262 Q 570 268 600 262"
          fill="none" className="stroke-blue-300 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Outer rain bands — left */}
        <ellipse cx="130" cy="170" rx="95" ry="70"
          className="fill-gray-300 dark:fill-gray-600" opacity="0.5" />
        <ellipse cx="130" cy="160" rx="80" ry="55"
          className="fill-gray-400 dark:fill-gray-500" opacity="0.4" />

        {/* Outer rain bands — right */}
        <ellipse cx="470" cy="170" rx="95" ry="70"
          className="fill-gray-300 dark:fill-gray-600" opacity="0.5" />
        <ellipse cx="470" cy="160" rx="80" ry="55"
          className="fill-gray-400 dark:fill-gray-500" opacity="0.4" />

        {/* Eyewall — dark cloud mass */}
        <ellipse cx="300" cy="155" rx="140" ry="100"
          fill="url(#eyewall-grad)" className="dark:opacity-80" opacity="0.7" />
        <ellipse cx="300" cy="145" rx="120" ry="85"
          className="fill-gray-600 dark:fill-gray-500" opacity="0.8" />

        {/* Eye — clear center */}
        <ellipse cx="300" cy="155" rx="35" ry="50"
          className="fill-sky-200 dark:fill-sky-800" />
        <ellipse cx="300" cy="155" rx="28" ry="42"
          className="fill-sky-100 dark:fill-sky-900" />

        {/* Cool dry air sinking in eye (blue arrows down) */}
        <line x1="290" y1="110" x2="290" y2="145"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cyc-arrow-blue)" opacity="0.8" />
        <line x1="310" y1="115" x2="310" y2="150"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cyc-arrow-blue)" opacity="0.8" />
        <line x1="300" y1="155" x2="300" y2="190"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cyc-arrow-blue)" opacity="0.8" />

        {/* Warm moist air arrows rising — left eyewall */}
        {[210, 230].map((x, i) => (
          <line key={`wl-${i}`} x1={x} y1="255" x2={x} y2="190"
            stroke="#ef4444" strokeWidth="2.5"
            markerEnd="url(#cyc-arrow-red)"
            className={`warm-arrow warm-arrow-d${i + 1}`} />
        ))}
        {/* Warm moist air arrows rising — right eyewall */}
        {[370, 390].map((x, i) => (
          <line key={`wr-${i}`} x1={x} y1="255" x2={x} y2="190"
            stroke="#ef4444" strokeWidth="2.5"
            markerEnd="url(#cyc-arrow-red)"
            className={`warm-arrow warm-arrow-d${i + 3}`} />
        ))}

        {/* Rain dashes in eyewall — left side */}
        {[
          { x: 195, y: 200, d: 'd1' }, { x: 210, y: 210, d: 'd2' },
          { x: 225, y: 195, d: 'd3' }, { x: 240, y: 215, d: 'd4' },
        ].map(({ x, y, d }) => (
          <line key={`rl-${x}`} x1={x} y1={y} x2={x - 1} y2={y + 8}
            stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"
            className={`rain-drop rain-drop-${d}`} />
        ))}
        {/* Rain dashes in eyewall — right side */}
        {[
          { x: 360, y: 200, d: 'd5' }, { x: 375, y: 210, d: 'd6' },
          { x: 390, y: 195, d: 'd7' }, { x: 405, y: 215, d: 'd8' },
        ].map(({ x, y, d }) => (
          <line key={`rr-${x}`} x1={x} y1={y} x2={x - 1} y2={y + 8}
            stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"
            className={`rain-drop rain-drop-${d}`} />
        ))}

        {/* Rain in outer bands */}
        {[
          { x: 100, y: 185, d: 'd1' }, { x: 120, y: 195, d: 'd3' }, { x: 145, y: 188, d: 'd5' },
          { x: 455, y: 185, d: 'd2' }, { x: 475, y: 195, d: 'd4' }, { x: 500, y: 188, d: 'd6' },
        ].map(({ x, y, d }) => (
          <line key={`ro-${x}`} x1={x} y1={y} x2={x - 1} y2={y + 6}
            stroke="#93c5fd" strokeWidth="1" strokeLinecap="round"
            className={`rain-drop rain-drop-${d}`} />
        ))}

        {/* Wind direction arrows — counterclockwise spiral hints */}
        {/* Top: left to right */}
        <path d="M 220 95 Q 260 75 320 80" fill="none"
          className="stroke-slate-500 dark:stroke-slate-300" strokeWidth="1.5"
          markerEnd="url(#cyc-arrow-wind)" />
        {/* Right: top to bottom */}
        <path d="M 430 120 Q 445 160 430 200" fill="none"
          className="stroke-slate-500 dark:stroke-slate-300" strokeWidth="1.5"
          markerEnd="url(#cyc-arrow-wind)" />
        {/* Bottom: right to left */}
        <path d="M 380 240 Q 340 252 280 248" fill="none"
          className="stroke-slate-500 dark:stroke-slate-300" strokeWidth="1.5"
          markerEnd="url(#cyc-arrow-wind)" />
        {/* Left: bottom to top */}
        <path d="M 170 200 Q 155 160 170 120" fill="none"
          className="stroke-slate-500 dark:stroke-slate-300" strokeWidth="1.5"
          markerEnd="url(#cyc-arrow-wind)" />

        {/* Labels */}
        <text x="300" y="160" textAnchor="middle"
          className="title-text fill-sky-700 dark:fill-sky-300">
          Eye
        </text>
        <text x="300" y="172" textAnchor="middle"
          className="label-text fill-sky-600 dark:fill-sky-400">
          (calm)
        </text>

        {/* Eyewall label */}
        <text x="240" y="130" textAnchor="end"
          className="label-text fill-gray-700 dark:fill-gray-200" fontWeight="600">
          Eyewall
        </text>
        <text x="240" y="142" textAnchor="end"
          className="label-text fill-gray-600 dark:fill-gray-300">
          (strongest winds)
        </text>

        {/* Rain bands label */}
        <text x="100" y="130" textAnchor="middle"
          className="label-text fill-gray-600 dark:fill-gray-300">
          Rain bands
        </text>

        {/* Warm moist air label */}
        <text x="210" y="280" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400">
          Warm moist
        </text>
        <text x="210" y="292" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400">
          air rises
        </text>

        {/* Cool dry air label */}
        <text x="300" y="100" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400">
          Cool dry air sinks
        </text>

        {/* Sea label */}
        <text x="530" y="295" textAnchor="middle"
          className="label-text fill-blue-700 dark:fill-blue-300" fontWeight="600">
          Warm Ocean
        </text>

        {/* Wind direction note */}
        <text x="500" y="110" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400">
          Winds spiral
        </text>
        <text x="500" y="122" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400">
          counterclockwise (NH)
        </text>
      </svg>
    </div>
  );
};

export default CycloneCrossSectionDiagram;
