const CloudRainProcessDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 620 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram comparing two rain processes: collision-coalescence (warm rain) and the Bergeron ice-crystal process"
      >
        <style>{`
          @keyframes fall-drop {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(30px); opacity: 0; }
          }
          @keyframes grow-pulse {
            0%, 100% { r: 3; }
            50% { r: 5; }
          }
          .drop-fall { animation: fall-drop 2s ease-in infinite; }
          .drop-fall-2 { animation: fall-drop 2s ease-in 0.7s infinite; }
          .grow { animation: grow-pulse 2s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
        `}</style>

        <rect width="620" height="480" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="310" y="26" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Why Some Clouds Rain and Others Don&#x2019;t
        </text>

        {/* Dividing line */}
        <line x1="310" y1="38" x2="310" y2="420" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,4" />

        {/* LEFT SIDE: Collision-Coalescence (warm rain) */}
        <text x="155" y="52" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300" fontSize="11">
          Warm Rain Process
        </text>
        <text x="155" y="66" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400">
          (Collision-Coalescence)
        </text>

        {/* Cloud outline left */}
        <ellipse cx="155" cy="130" rx="110" ry="50" className="fill-gray-200 dark:fill-gray-700" opacity="0.4" />

        {/* Step A: Small droplets */}
        <text x="60" y="100" className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">A. Tiny droplets</text>
        <text x="60" y="112" className="label-text fill-slate-500 dark:fill-slate-400">(~10 &#181;m) &mdash; too light</text>
        <text x="60" y="124" className="label-text fill-slate-500 dark:fill-slate-400">to fall as rain</text>
        {[80, 100, 120, 140, 160].map((cx, i) => (
          <circle key={`sm-${i}`} cx={cx} cy={135 + (i % 2) * 5} r="2"
            className="fill-blue-400 dark:fill-blue-500" />
        ))}

        {/* Step B: Collisions */}
        <text x="60" y="175" className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">B. Droplets collide</text>
        <text x="60" y="187" className="label-text fill-slate-500 dark:fill-slate-400">and merge (coalesce)</text>
        {/* Medium drops */}
        <circle cx="100" cy="205" r="4" className="fill-blue-400 dark:fill-blue-500" />
        <circle cx="115" cy="208" r="3" className="fill-blue-300 dark:fill-blue-400" />
        <defs>
          <marker id="crp-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>
        <line x1="112" y1="207" x2="105" y2="206" className="stroke-blue-400" strokeWidth="1" markerEnd="url(#crp-arrow)" />
        {/* Merged drop */}
        <circle cx="160" cy="207" r="6" className="fill-blue-500 dark:fill-blue-600 grow" />
        <text x="175" y="210" className="label-text fill-blue-500 dark:fill-blue-400">= bigger drop</text>

        {/* Step C: Large enough to fall */}
        <text x="60" y="245" className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">C. Drop reaches ~2 mm</text>
        <text x="60" y="257" className="label-text fill-slate-500 dark:fill-slate-400">Gravity overcomes updraft</text>
        <circle cx="155" cy="275" r="8" className="fill-blue-500 dark:fill-blue-600" />
        <text x="170" y="278" className="label-text fill-blue-500 dark:fill-blue-400">= raindrop!</text>

        {/* Falling rain */}
        <circle cx="130" cy="310" r="4" className="fill-blue-500 dark:fill-blue-600 drop-fall" />
        <circle cx="170" cy="305" r="3.5" className="fill-blue-500 dark:fill-blue-600 drop-fall-2" />

        {/* Size comparison */}
        <rect x="40" y="340" width="230" height="52" rx="6"
          className="fill-blue-50 dark:fill-blue-900/30" stroke="#3b82f6" strokeWidth="1" />
        <text x="155" y="356" textAnchor="middle" className="label-text fill-blue-700 dark:fill-blue-300" fontWeight="600">Size matters:</text>
        <circle cx="80" cy="372" r="2" className="fill-blue-400" />
        <text x="92" y="376" className="label-text fill-blue-600 dark:fill-blue-400">Cloud: 10 &#181;m</text>
        <circle cx="170" cy="372" r="5" className="fill-blue-500" />
        <text x="182" y="376" className="label-text fill-blue-600 dark:fill-blue-400">Rain: 2,000 &#181;m</text>

        {/* RIGHT SIDE: Bergeron (ice-crystal) process */}
        <text x="465" y="52" textAnchor="middle"
          className="step-text fill-purple-700 dark:fill-purple-300" fontSize="11">
          Ice-Crystal Process
        </text>
        <text x="465" y="66" textAnchor="middle"
          className="label-text fill-purple-500 dark:fill-purple-400">
          (Bergeron-Findeisen)
        </text>

        {/* Cloud outline right */}
        <ellipse cx="465" cy="130" rx="110" ry="50" className="fill-gray-200 dark:fill-gray-700" opacity="0.4" />

        {/* Temperature zones */}
        <rect x="330" y="85" width="30" height="40" rx="3" className="fill-blue-100 dark:fill-blue-900" opacity="0.5" />
        <text x="345" y="102" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400" fontSize="8">&lt;0&#176;C</text>
        <text x="345" y="116" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400" fontSize="8">zone</text>

        {/* Step A: Mixed phase */}
        <text x="370" y="100" className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">A. Mixed-phase cloud</text>
        <text x="370" y="112" className="label-text fill-slate-500 dark:fill-slate-400">Supercooled water + ice</text>
        {/* Water droplets */}
        {[410, 430, 450, 470].map((cx, i) => (
          <circle key={`w-${i}`} cx={cx} cy={128 + (i % 2) * 4} r="2"
            className="fill-blue-400 dark:fill-blue-500" />
        ))}
        {/* Ice crystal */}
        <text x="495" y="135" className="fill-cyan-400 dark:fill-cyan-300" fontSize="14">&#10052;</text>

        {/* Step B: Ice crystals steal water */}
        <text x="370" y="170" className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">B. Ice steals vapor</text>
        <text x="370" y="182" className="label-text fill-slate-500 dark:fill-slate-400">Vapor pressure over ice &lt;</text>
        <text x="370" y="194" className="label-text fill-slate-500 dark:fill-slate-400">vapor pressure over water</text>

        {/* Arrows from droplets to crystal */}
        <defs>
          <marker id="crp-arrow-cyan" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
          </marker>
        </defs>
        <line x1="410" y1="210" x2="440" y2="210" className="stroke-cyan-400 dark:stroke-cyan-500" strokeWidth="1" markerEnd="url(#crp-arrow-cyan)" />
        <circle cx="400" cy="210" r="2" className="fill-blue-400" opacity="0.5" />
        <text x="455" y="214" className="fill-cyan-400 dark:fill-cyan-300" fontSize="18">&#10052;</text>
        <text x="475" y="214" className="label-text fill-cyan-500 dark:fill-cyan-400">grows fast!</text>

        {/* Step C: Falls and melts */}
        <text x="370" y="250" className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">C. Crystal falls, melts</text>
        <text x="370" y="262" className="label-text fill-slate-500 dark:fill-slate-400">into rain (or stays as snow)</text>

        {/* Ice to rain transition */}
        <text x="430" y="284" className="fill-cyan-400 dark:fill-cyan-300" fontSize="16">&#10052;</text>
        <line x1="445" y1="280" x2="465" y2="280" className="stroke-slate-400" strokeWidth="1" />
        <text x="468" y="284" className="label-text fill-slate-500 dark:fill-slate-400">melts at 0&#176;C</text>
        <line x1="455" y1="284" x2="455" y2="296" className="stroke-slate-400" strokeWidth="1" />
        <circle cx="455" cy="305" r="5" className="fill-blue-500 dark:fill-blue-600 drop-fall" />

        {/* Key fact box right */}
        <rect x="340" y="340" width="250" height="52" rx="6"
          className="fill-purple-50 dark:fill-purple-900/30" stroke="#a855f7" strokeWidth="1" />
        <text x="465" y="356" textAnchor="middle" className="label-text fill-purple-700 dark:fill-purple-300" fontWeight="600">Most mid-latitude rain starts as ice</text>
        <text x="465" y="370" textAnchor="middle" className="label-text fill-purple-600 dark:fill-purple-400">even in summer. The Bergeron process</text>
        <text x="465" y="384" textAnchor="middle" className="label-text fill-purple-600 dark:fill-purple-400">is cloud seeding&#x2019;s natural version.</text>

        {/* Bottom summary */}
        <rect x="100" y="410" width="420" height="56" rx="8"
          className="fill-amber-50 dark:fill-amber-900/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="310" y="430" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">
          Why Meghi the cloud didn&#x2019;t rain:
        </text>
        <text x="310" y="446" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          Droplets too small + no ice nuclei = no rain. Cloud seeding adds the missing nuclei.
        </text>
        <text x="310" y="458" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          A raindrop needs ~1 million cloud droplets to merge together.
        </text>
      </svg>
    </div>
  );
};

export default CloudRainProcessDiagram;
