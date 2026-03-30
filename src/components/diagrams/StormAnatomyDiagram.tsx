const StormAnatomyDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 441"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cross-section of a cyclone showing rainbands, eyewall, and eye with wind circulation arrows"
      >
        <style>{`
          @keyframes rainFall {
            0% { transform: translateY(-6px); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: translateY(6px); opacity: 0; }
          }
          @keyframes warmRise {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          .rain-drop { animation: rainFall 1.2s linear infinite; }
          .rd1 { animation-delay: 0s; }
          .rd2 { animation-delay: 0.3s; }
          .rd3 { animation-delay: 0.6s; }
          .rd4 { animation-delay: 0.9s; }
          .rd5 { animation-delay: 0.15s; }
          .rd6 { animation-delay: 0.45s; }
          .rd7 { animation-delay: 0.75s; }
          .rd8 { animation-delay: 1.05s; }
          .warm-rise { animation: warmRise 2s ease-in-out infinite; }
          .wr1 { animation-delay: 0s; }
          .wr2 { animation-delay: 0.5s; }
          .wr3 { animation-delay: 1s; }
          .wr4 { animation-delay: 1.5s; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
        `}</style>

        <defs>
          <marker id="sa-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="sa-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="sa-arrow-slate" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-300" />
          </marker>
          <linearGradient id="sa-eyewall-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Anatomy of a Cyclone — Cross Section
        </text>

        {/* Sea surface */}
        <rect x="0" y="310" width="600" height="110" rx="0"
          className="fill-blue-400 dark:fill-blue-800" opacity="0.5" />
        <rect x="0" y="310" width="600" height="4"
          className="fill-blue-500 dark:fill-blue-600" />
        <path d="M 0 312 Q 25 307 50 312 Q 75 317 100 312 Q 125 307 150 312 Q 175 317 200 312 Q 225 307 250 312 Q 275 317 300 312 Q 325 307 350 312 Q 375 317 400 312 Q 425 307 450 312 Q 475 317 500 312 Q 525 307 550 312 Q 575 317 600 312"
          fill="none" className="stroke-blue-300 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Sea label */}
        <text x="300" y="370" textAnchor="middle"
          className="title-text fill-blue-700 dark:fill-blue-300">
          Warm Ocean Fuel
        </text>
        <text x="300" y="385" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Surface temperature &gt;26.5°C powers the storm
        </text>

        {/* Outer rainbands — far left */}
        <ellipse cx="80" cy="210" rx="70" ry="80"
          className="fill-sky-200 dark:fill-sky-800" opacity="0.4" />
        <ellipse cx="80" cy="200" rx="55" ry="65"
          className="fill-sky-300 dark:fill-sky-700" opacity="0.35" />

        {/* Outer rainbands — far right */}
        <ellipse cx="520" cy="210" rx="70" ry="80"
          className="fill-sky-200 dark:fill-sky-800" opacity="0.4" />
        <ellipse cx="520" cy="200" rx="55" ry="65"
          className="fill-sky-300 dark:fill-sky-700" opacity="0.35" />

        {/* Inner rainbands — left */}
        <ellipse cx="165" cy="190" rx="65" ry="95"
          className="fill-blue-300 dark:fill-blue-700" opacity="0.4" />

        {/* Inner rainbands — right */}
        <ellipse cx="435" cy="190" rx="65" ry="95"
          className="fill-blue-300 dark:fill-blue-700" opacity="0.4" />

        {/* Eyewall — left (tallest, darkest) */}
        <ellipse cx="240" cy="175" rx="50" ry="120"
          fill="url(#sa-eyewall-grad)" className="dark:opacity-80" opacity="0.7" />

        {/* Eyewall — right (tallest, darkest) */}
        <ellipse cx="360" cy="175" rx="50" ry="120"
          fill="url(#sa-eyewall-grad)" className="dark:opacity-80" opacity="0.7" />

        {/* Eye — clear center */}
        <ellipse cx="300" cy="190" rx="40" ry="100"
          className="fill-sky-100 dark:fill-sky-900" />
        <ellipse cx="300" cy="190" rx="30" ry="85"
          className="fill-sky-50 dark:fill-sky-950" />

        {/* Rain in eyewall — left */}
        {[
          { x: 218, y: 200, d: 'rd1' }, { x: 228, y: 215, d: 'rd2' },
          { x: 238, y: 195, d: 'rd3' }, { x: 252, y: 210, d: 'rd4' },
        ].map(({ x, y, d }) => (
          <line key={`rel-${x}`} x1={x} y1={y} x2={x - 1} y2={y + 7}
            stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"
            className={`rain-drop ${d}`} />
        ))}

        {/* Rain in eyewall — right */}
        {[
          { x: 348, y: 200, d: 'rd5' }, { x: 358, y: 215, d: 'rd6' },
          { x: 370, y: 195, d: 'rd7' }, { x: 382, y: 210, d: 'rd8' },
        ].map(({ x, y, d }) => (
          <line key={`rer-${x}`} x1={x} y1={y} x2={x - 1} y2={y + 7}
            stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"
            className={`rain-drop ${d}`} />
        ))}

        {/* Rain in outer bands */}
        {[
          { x: 65, y: 210, d: 'rd1' }, { x: 90, y: 220, d: 'rd3' },
          { x: 150, y: 205, d: 'rd5' }, { x: 170, y: 220, d: 'rd7' },
          { x: 430, y: 205, d: 'rd2' }, { x: 450, y: 220, d: 'rd4' },
          { x: 510, y: 210, d: 'rd6' }, { x: 535, y: 220, d: 'rd8' },
        ].map(({ x, y, d }) => (
          <line key={`rob-${x}`} x1={x} y1={y} x2={x - 1} y2={y + 5}
            stroke="#93c5fd" strokeWidth="1" strokeLinecap="round"
            className={`rain-drop ${d}`} />
        ))}

        {/* Warm air rising through eyewall — left */}
        {[220, 240].map((x, i) => (
          <line key={`wl-${i}`} x1={x} y1={305} x2={x} y2={230}
            stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#sa-arrow-red)"
            className={`warm-rise wr${i + 1}`} />
        ))}
        {/* Warm air rising through eyewall — right */}
        {[360, 380].map((x, i) => (
          <line key={`wr-${i}`} x1={x} y1={305} x2={x} y2={230}
            stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#sa-arrow-red)"
            className={`warm-rise wr${i + 3}`} />
        ))}

        {/* Outflow at top */}
        <path d="M 260 68 Q 200 55 140 65" fill="none"
          className="stroke-slate-500 dark:stroke-slate-300" strokeWidth="1.5"
          markerEnd="url(#sa-arrow-slate)" />
        <path d="M 340 68 Q 400 55 460 65" fill="none"
          className="stroke-slate-500 dark:stroke-slate-300" strokeWidth="1.5"
          markerEnd="url(#sa-arrow-slate)" />

        {/* Inflow at bottom */}
        <path d="M 120 300 Q 160 308 205 303" fill="none"
          className="stroke-slate-500 dark:stroke-slate-300" strokeWidth="1.5"
          markerEnd="url(#sa-arrow-slate)" />
        <path d="M 480 300 Q 440 308 395 303" fill="none"
          className="stroke-slate-500 dark:stroke-slate-300" strokeWidth="1.5"
          markerEnd="url(#sa-arrow-slate)" />

        {/* Cool air sinking in eye */}
        <line x1="295" y1="110" x2="295" y2="160"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#sa-arrow-blue)" opacity="0.8" />
        <line x1="305" y1="120" x2="305" y2="170"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#sa-arrow-blue)" opacity="0.8" />

        {/* ---- LABELS ---- */}

        {/* Rainbands label — left */}
        <line x1="80" y1="120" x2="80" y2="145"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="80" y="115" textAnchor="middle"
          className="label-text fill-sky-600 dark:fill-sky-400" fontWeight="600">
          Rainbands
        </text>
        <text x="80" y="100" textAnchor="middle"
          className="label-text fill-sky-500 dark:fill-sky-400">
          Widespread rain
        </text>

        {/* Eyewall label — pointing to left eyewall */}
        <line x1="240" y1="65" x2="240" y2="80"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="240" y="58" textAnchor="middle"
          className="label-text fill-blue-800 dark:fill-blue-200" fontWeight="700">
          Eyewall
        </text>
        <text x="240" y="46" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400">
          Strongest winds (250+ km/h)
        </text>

        {/* Eye label */}
        <text x="300" y="188" textAnchor="middle"
          className="title-text fill-sky-700 dark:fill-sky-300">
          Eye
        </text>
        <text x="300" y="202" textAnchor="middle"
          className="label-text fill-sky-600 dark:fill-sky-400">
          Calm, clear
        </text>
        <text x="300" y="215" textAnchor="middle"
          className="label-text fill-sky-600 dark:fill-sky-400">
          20–60 km wide
        </text>

        {/* Outflow label */}
        <text x="470" y="55" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400">
          Outflow at top
        </text>

        {/* Inflow label */}
        <text x="130" y="295" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400">
          Winds spiral in
        </text>

        {/* Warm air label */}
        <text x="220" y="295" textAnchor="start"
          className="label-text fill-red-500 dark:fill-red-400">
          Warm moist air
        </text>
      </svg>
    </div>
  );
};

export default StormAnatomyDiagram;
