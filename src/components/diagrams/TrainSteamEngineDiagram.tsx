const TrainSteamEngineDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 620 540"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how a steam engine converts heat into motion through the thermodynamic cycle"
      >
        <style>{`
          .ts-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .ts-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .ts-section { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .ts-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .ts-tiny { font-family: system-ui, sans-serif; font-size: 9px; }
          @keyframes steamPuff {
            0%, 100% { opacity: 0.3; transform: translateY(0); }
            50% { opacity: 0.8; transform: translateY(-6px); }
          }
          .ts-steam { animation: steamPuff 2s ease-in-out infinite; }
          @keyframes pistonMove {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(30px); }
          }
          .ts-piston { animation: pistonMove 2s ease-in-out infinite; }
        `}</style>

        <defs>
          <marker id="ts-arr-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="ts-arr-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="ts-arr-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="ts-arr-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <linearGradient id="ts-fire" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="620" height="540" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="310" y="26" textAnchor="middle" className="ts-title fill-gray-800 dark:fill-slate-100">
          The Steam Engine: Turning Heat into Motion
        </text>

        {/* === MAIN DIAGRAM: Cross-section === */}
        <text x="220" y="52" textAnchor="middle" className="ts-section fill-red-600 dark:fill-red-400">
          Inside a Steam Locomotive
        </text>

        {/* Firebox */}
        <rect x="30" y="90" width="100" height="120" rx="4"
          className="fill-red-100 dark:fill-red-900/30 stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        {/* Flames */}
        <ellipse cx="55" cy="180" rx="12" ry="20" fill="url(#ts-fire)" opacity="0.8" />
        <ellipse cx="75" cy="175" rx="10" ry="18" fill="url(#ts-fire)" opacity="0.7" />
        <ellipse cx="95" cy="178" rx="11" ry="19" fill="url(#ts-fire)" opacity="0.75" />
        <text x="80" y="82" textAnchor="middle" className="ts-small fill-red-600 dark:fill-red-400" fontWeight="600">
          1. FIREBOX
        </text>
        <text x="80" y="232" textAnchor="middle" className="ts-tiny fill-red-600 dark:fill-red-400">
          Coal burns at ~1200\u00B0C
        </text>

        {/* Boiler */}
        <rect x="130" y="90" width="140" height="80" rx="20"
          className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        {/* Water tubes */}
        {[100, 115, 130, 145, 160].map((y) => (
          <line key={y} x1="130" y1={y} x2="270" y2={y} stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
        ))}
        <text x="200" y="82" textAnchor="middle" className="ts-small fill-blue-600 dark:fill-blue-400" fontWeight="600">
          2. BOILER
        </text>
        <text x="200" y="190" textAnchor="middle" className="ts-tiny fill-blue-600 dark:fill-blue-400">
          Water heated to steam
        </text>
        <text x="200" y="202" textAnchor="middle" className="ts-tiny fill-blue-600 dark:fill-blue-400">
          at 200\u00B0C, 15 atm pressure
        </text>

        {/* Steam puffs from chimney */}
        <rect x="165" y="60" width="16" height="30" rx="2"
          className="fill-gray-400 dark:fill-gray-500" />
        <g className="ts-steam">
          <circle cx="173" cy="50" r="8" className="fill-gray-300 dark:fill-gray-600" opacity="0.5" />
          <circle cx="180" cy="40" r="10" className="fill-gray-300 dark:fill-gray-600" opacity="0.4" />
          <circle cx="168" cy="32" r="7" className="fill-gray-300 dark:fill-gray-600" opacity="0.3" />
        </g>

        {/* Steam pipe to cylinder */}
        <line x1="270" y1="120" x2="310" y2="120" stroke="#60a5fa" strokeWidth="3" />
        <path d="M 295 115 L 310 120 L 295 125" fill="#60a5fa" />

        {/* Cylinder */}
        <rect x="310" y="96" width="100" height="50" rx="6"
          className="fill-gray-200 dark:fill-gray-700 stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        {/* Piston */}
        <g className="ts-piston">
          <rect x="325" y="106" width="12" height="30" rx="2"
            className="fill-gray-500 dark:fill-gray-400" />
        </g>
        <text x="360" y="88" textAnchor="middle" className="ts-small fill-gray-700 dark:fill-gray-300" fontWeight="600">
          3. CYLINDER
        </text>
        <text x="360" y="165" textAnchor="middle" className="ts-tiny fill-gray-600 dark:fill-gray-400">
          Steam pushes piston
        </text>
        <text x="360" y="177" textAnchor="middle" className="ts-tiny fill-gray-600 dark:fill-gray-400">
          back and forth
        </text>

        {/* Connecting rod to wheel */}
        <line x1="410" y1="121" x2="470" y2="150" stroke="#f59e0b" strokeWidth="3" />

        {/* Crankshaft and wheel */}
        <circle cx="490" cy="170" r="40" className="fill-gray-200 dark:fill-gray-700 stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <circle cx="490" cy="170" r="6" className="fill-gray-600 dark:fill-gray-400" />
        <circle cx="470" cy="150" r="4" fill="#f59e0b" />
        <text x="490" y="82" textAnchor="middle" className="ts-small fill-amber-600 dark:fill-amber-400" fontWeight="600">
          4. DRIVING WHEEL
        </text>
        <text x="540" y="190" className="ts-tiny fill-amber-600 dark:fill-amber-400">
          Crankshaft converts
        </text>
        <text x="540" y="202" className="ts-tiny fill-amber-600 dark:fill-amber-400">
          linear \u2192 rotary motion
        </text>

        {/* Rail */}
        <rect x="430" y="210" width="120" height="8" rx="2"
          className="fill-gray-400 dark:fill-gray-500" />

        {/* Divider */}
        <line x1="20" y1="250" x2="600" y2="250" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* === BOTTOM: Energy flow and efficiency === */}
        <text x="310" y="274" textAnchor="middle" className="ts-section fill-emerald-600 dark:fill-emerald-400">
          Energy Flow: From Coal to Motion
        </text>

        {/* Energy flow chain */}
        {[
          { x: 30, label: 'Chemical\nEnergy', sub: '(coal)', pct: '100%', color: '#ef4444', bg: 'fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-800' },
          { x: 150, label: 'Heat\nEnergy', sub: '(steam)', pct: '~85%', color: '#f59e0b', bg: 'fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-800' },
          { x: 270, label: 'Pressure\nEnergy', sub: '(cylinder)', pct: '~25%', color: '#60a5fa', bg: 'fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-800' },
          { x: 390, label: 'Kinetic\nEnergy', sub: '(wheels)', pct: '~8%', color: '#22c55e', bg: 'fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-300 dark:stroke-emerald-800' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={step.x} y="290" width="110" height="70" rx="6"
              className={step.bg} strokeWidth="1" />
            {step.label.split('\n').map((line, j) => (
              <text key={j} x={step.x + 55} y={308 + j * 14} textAnchor="middle"
                className="ts-small" fill={step.color} fontWeight="600">
                {line}
              </text>
            ))}
            <text x={step.x + 55} y={340} textAnchor="middle" className="ts-tiny fill-gray-500 dark:fill-gray-400">
              {step.sub}
            </text>
            <text x={step.x + 55} y={354} textAnchor="middle" className="ts-small" fill={step.color}>
              {step.pct}
            </text>
            {i < 3 && (
              <path d={`M \${step.x + 114} 325 L \${step.x + 146} 325`}
                stroke="#94a3b8" strokeWidth="2" markerEnd="url(#ts-arr-green)" />
            )}
          </g>
        ))}

        {/* Lost energy label */}
        <rect x="510" y="290" width="95" height="70" rx="6"
          className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-700" strokeWidth="1" />
        <text x="557" y="310" textAnchor="middle" className="ts-small fill-gray-600 dark:fill-gray-400" fontWeight="600">
          Lost as heat
        </text>
        <text x="557" y="326" textAnchor="middle" className="ts-tiny fill-gray-500 dark:fill-gray-400">
          Exhaust steam,
        </text>
        <text x="557" y="338" textAnchor="middle" className="ts-tiny fill-gray-500 dark:fill-gray-400">
          radiation, friction
        </text>
        <text x="557" y="354" textAnchor="middle" className="ts-small fill-red-500 dark:fill-red-400">
          ~92% lost!
        </text>

        {/* Arrow from chain to lost */}
        <path d="M 450 370 Q 480 390 510 370" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" fill="none" />

        {/* Comparison section */}
        <line x1="20" y1="380" x2="600" y2="380" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="310" y="404" textAnchor="middle" className="ts-section fill-purple-600 dark:fill-purple-400">
          Efficiency Comparison
        </text>

        {[
          { label: 'Steam engine', eff: 8, color: '#ef4444' },
          { label: 'Diesel engine', eff: 35, color: '#f59e0b' },
          { label: 'Electric motor', eff: 90, color: '#22c55e' },
        ].map((eng, i) => (
          <g key={i}>
            <text x="140" y={430 + i * 34} textAnchor="end" className="ts-small fill-gray-600 dark:fill-gray-400">
              {eng.label}
            </text>
            <rect x="150" y={418 + i * 34} width={eng.eff * 4} height="18" rx="3" fill={eng.color} opacity="0.8" />
            <text x={158 + eng.eff * 4} y={432 + i * 34} className="ts-small fill-gray-700 dark:fill-gray-300">
              {eng.eff}%
            </text>
          </g>
        ))}

        {/* Fun fact */}
        <rect x="380" y="416" width="210" height="100" rx="6"
          className="fill-purple-50 dark:fill-purple-900/20 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1" />
        <text x="485" y="434" textAnchor="middle" className="ts-small fill-purple-700 dark:fill-purple-300" fontWeight="600">
          Why steam engines survive
        </text>
        {[
          'Despite low efficiency, steam',
          'engines run on ANY fuel: coal, wood,',
          'even dried cow dung. This made them',
          'perfect for remote mountain railways',
          'where diesel supply was unreliable.',
          'The Darjeeling Toy Train still uses',
          'steam for heritage tourism today.',
        ].map((line, i) => (
          <text key={i} x="390" y={450 + i * 12} className="ts-tiny fill-purple-600 dark:fill-purple-400">
            {line}
          </text>
        ))}

      </svg>
    </div>
  );
};

export default TrainSteamEngineDiagram;
