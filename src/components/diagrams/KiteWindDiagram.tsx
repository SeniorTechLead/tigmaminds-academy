const KiteWindDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 600 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram explaining wind as an energy source: Beaufort scale, thermals, and wind measurement"
      >
        <style>{`
          @keyframes thermalRise {
            0% { transform: translateY(0); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translateY(-60px); opacity: 0; }
          }
          .thermal-rise {
            animation: thermalRise 3s ease-out infinite;
          }
          .thermal-d1 { animation-delay: 0.8s; }
          .thermal-d2 { animation-delay: 1.6s; }
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
          .fact-text {
            font-family: system-ui, sans-serif;
            font-size: 9.5px;
          }
          .scale-text {
            font-family: system-ui, sans-serif;
            font-size: 8.5px;
          }
        `}</style>

        <defs>
          <marker id="kw-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="520" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="24" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Wind — The Invisible River
        </text>

        {/* === TOP LEFT: Beaufort Scale (simplified) === */}
        <rect x="15" y="40" width="340" height="210" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="185" y="58" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          Beaufort Wind Scale (for kite flyers)
        </text>

        {/* Scale bars */}
        {[
          { force: '0-1', speed: '0-5', label: 'Calm / Light air', color: '#e2e8f0', darkColor: '#334155', note: 'Too weak for kites' },
          { force: '2', speed: '6-11', label: 'Light breeze', color: '#bae6fd', darkColor: '#0c4a6e', note: 'Leaves rustle' },
          { force: '3', speed: '12-19', label: 'Gentle breeze', color: '#7dd3fc', darkColor: '#075985', note: 'Perfect for kites!' },
          { force: '4', speed: '20-28', label: 'Moderate breeze', color: '#38bdf8', darkColor: '#0369a1', note: 'Flags fully extended' },
          { force: '5', speed: '29-38', label: 'Fresh breeze', color: '#0ea5e9', darkColor: '#0284c7', note: 'Strong kites only' },
          { force: '6+', speed: '39+', label: 'Strong+', color: '#f87171', darkColor: '#991b1b', note: 'Too dangerous!' },
        ].map((row, i) => (
          <g key={i}>
            <rect x="25" y={72 + i * 28} width={50 + (i + 1) * 35} height="20" rx="3"
              fill={row.color} className="dark:opacity-80" />
            <rect x="25" y={72 + i * 28} width={50 + (i + 1) * 35} height="20" rx="3"
              className="hidden dark:block" fill={row.darkColor} opacity="0.8" />
            <text x="30" y={86 + i * 28} className="scale-text fill-slate-700 dark:fill-slate-200" fontWeight="600">
              F{row.force}
            </text>
            <text x="58" y={86 + i * 28} className="scale-text fill-slate-600 dark:fill-slate-300">
              {row.speed} km/h
            </text>
            <text x={62 + (i + 1) * 35} y={86 + i * 28} className="scale-text fill-slate-500 dark:fill-slate-400">
              {row.label}
            </text>
          </g>
        ))}

        {/* Kite zone bracket */}
        <line x1="340" y1="100" x2="340" y2="178"
          stroke="#4ade80" strokeWidth="2" />
        <line x1="335" y1="100" x2="340" y2="100" stroke="#4ade80" strokeWidth="2" />
        <line x1="335" y1="178" x2="340" y2="178" stroke="#4ade80" strokeWidth="2" />
        <text x="344" y="144" className="scale-text fill-green-600 dark:fill-green-400" fontWeight="600">
          Kite
        </text>
        <text x="344" y="155" className="scale-text fill-green-600 dark:fill-green-400" fontWeight="600">
          zone
        </text>

        {/* === TOP RIGHT: Thermals === */}
        <rect x="370" y="40" width="215" height="210" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.5" />
        <text x="477" y="58" textAnchor="middle"
          className="section-title fill-amber-700 dark:fill-amber-300">
          Thermals: Hot Air Columns
        </text>

        {/* Ground with sun-heated area */}
        <rect x="400" y="210" width="150" height="15" rx="3"
          className="fill-amber-200 dark:fill-amber-700" />
        <text x="475" y="220" textAnchor="middle"
          className="scale-text fill-amber-800 dark:fill-amber-300">
          Sun-warmed ground
        </text>

        {/* Rising thermal arrows */}
        {[0,1,2].map(i => (
          <g key={i}>
            <line x1={440 + i * 30} y1={200} x2={440 + i * 30} y2={140}
              stroke="#fbbf24" strokeWidth="2" markerEnd="url(#kw-arrow-amber)"
              className={`thermal-rise ${i > 0 ? `thermal-d${i}` : ''}`} />
          </g>
        ))}

        {/* Cool air sinking arrows */}
        <text x="395" y="80" className="fact-text fill-blue-500 dark:fill-blue-400">
          Cool air
        </text>
        <text x="395" y="92" className="fact-text fill-blue-500 dark:fill-blue-400">
          sinks
        </text>
        <text x="530" y="80" className="fact-text fill-blue-500 dark:fill-blue-400">
          Cool air
        </text>
        <text x="530" y="92" className="fact-text fill-blue-500 dark:fill-blue-400">
          sinks
        </text>

        {/* Cloud formed at top */}
        <ellipse cx="475" cy="78" rx="30" ry="12"
          className="fill-slate-200 dark:fill-slate-600" opacity="0.6" />

        {/* Explanation */}
        <text x="385" y="120" className="fact-text fill-slate-600 dark:fill-slate-300">
          Sun heats the ground unevenly.
        </text>
        <text x="385" y="133" className="fact-text fill-slate-600 dark:fill-slate-300">
          Hot patches create rising columns
        </text>
        <text x="385" y="146" className="fact-text fill-slate-600 dark:fill-slate-300">
          of warm air called thermals.
        </text>
        <text x="385" y="163" className="fact-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          Kites get extra lift in thermals.
        </text>
        <text x="385" y="176" className="fact-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          Birds circle inside them to soar.
        </text>

        {/* === BOTTOM: Wind measurement and the Brahmaputra === */}
        <rect x="15" y="265" width="570" height="110" rx="6"
          className="fill-sky-50 dark:fill-sky-950" opacity="0.5" />
        <text x="300" y="285" textAnchor="middle"
          className="section-title fill-sky-700 dark:fill-sky-300">
          How Is Wind Measured?
        </text>

        {/* Anemometer sketch */}
        <line x1="80" y1="310" x2="80" y2="355" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
        <line x1="55" y1="320" x2="105" y2="320" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <circle cx="55" cy="318" r="5" className="fill-slate-300 dark:fill-slate-600" />
        <circle cx="105" cy="318" r="5" className="fill-slate-300 dark:fill-slate-600" />
        <line x1="68" y1="310" x2="92" y2="330" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <circle cx="68" cy="308" r="5" className="fill-slate-300 dark:fill-slate-600" />
        <circle cx="92" cy="332" r="5" className="fill-slate-300 dark:fill-slate-600" />
        <text x="55" y="365" className="scale-text fill-slate-500 dark:fill-slate-400" textAnchor="middle">
          Anemometer
        </text>

        {/* Methods list */}
        <text x="140" y="305" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Anemometer: spinning cups measure wind speed in km/h or m/s
        </text>
        <text x="140" y="320" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Wind vane: arrow points into the wind, showing direction
        </text>
        <text x="140" y="335" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Beaufort scale: estimate speed from observing trees, flags, waves
        </text>
        <text x="140" y="350" className="fact-text fill-slate-600 dark:fill-slate-300">
          • Weather balloon: measures wind at altitude (where kites fly)
        </text>
        <text x="140" y="365" className="fact-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          Simple test: hold up a wet finger — the cool side faces the wind!
        </text>

        {/* Brahmaputra connection */}
        <rect x="15" y="390" width="570" height="115" rx="6"
          className="fill-green-50 dark:fill-green-950 stroke-green-200 dark:stroke-green-800" strokeWidth="1" />
        <text x="300" y="410" textAnchor="middle"
          className="section-title fill-green-700 dark:fill-green-300">
          Guwahati’s Kite-Friendly Wind
        </text>
        <text x="300" y="430" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          In January, cool dry air from the north meets warmer air rising from the Brahmaputra.
        </text>
        <text x="300" y="445" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          The river acts like a heating strip — it creates thermals along the banks.
        </text>
        <text x="300" y="460" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          These thermals combine with the steady winter breeze to create ideal kite conditions:
        </text>
        <text x="300" y="478" textAnchor="middle"
          className="fact-text fill-green-600 dark:fill-green-400" fontWeight="600">
          Beaufort force 3–4, with rising air pockets that give kites extra lift.
        </text>
        <text x="300" y="495" textAnchor="middle"
          className="fact-text fill-slate-500 dark:fill-slate-400">
          This is why Biren tested his kite by the river — the wind there is not random; it’s predictable.
        </text>
      </svg>
    </div>
  );
};

export default KiteWindDiagram;
