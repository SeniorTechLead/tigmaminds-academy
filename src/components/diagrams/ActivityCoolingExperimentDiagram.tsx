const ActivityCoolingExperimentDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 600 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Step-by-step offline activity: testing evaporative cooling with dry hand, wet hand, and mud-coated hand"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .step-num { font-family: system-ui, sans-serif; font-size: 16px; font-weight: 700; }
          @keyframes evap { 0%{opacity:0.7;transform:translateY(0)} 100%{opacity:0;transform:translateY(-12px)} }
          .evap { animation: evap 2s ease-out infinite; }
        `}</style>

        <rect width="600" height="400" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="300" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          Try It: The Elephant Cooling Experiment
        </text>
        <text x="300" y="45" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">
          Test evaporative cooling on your own hands — no lab required
        </text>

        {/* Step 1: Dry hand */}
        <rect x="20" y="62" width="175" height="200" rx="8"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <circle cx="50" cy="82" r="14" className="fill-slate-200 dark:fill-slate-700" />
        <text x="50" y="87" textAnchor="middle" className="step-num fill-slate-600 dark:fill-slate-300">1</text>
        <text x="120" y="87" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-200">
          Dry Hand
        </text>

        {/* Hand shape */}
        <rect x="70" y="110" width="55" height="75" rx="6"
          className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
        <text x="97" y="148" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400">DRY</text>

        {/* Wind arrows */}
        <text x="145" y="140" className="small fill-slate-500 dark:fill-slate-400">← wave</text>
        <text x="145" y="155" className="small fill-slate-500 dark:fill-slate-400">30 sec</text>

        <text x="107" y="210" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          Result: feels normal
        </text>
        <text x="107" y="224" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          No evaporation =
        </text>
        <text x="107" y="238" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          no cooling
        </text>
        <rect x="55" y="246" width="105" height="10" rx="3" className="fill-slate-200 dark:fill-slate-700" />
        <rect x="55" y="246" width="20" height="10" rx="3" fill="#ef4444" opacity="0.5" />
        <text x="165" y="255" className="small fill-slate-500 dark:fill-slate-400">cool</text>

        {/* Step 2: Wet hand */}
        <rect x="212" y="62" width="175" height="200" rx="8"
          className="fill-blue-50 dark:fill-blue-900/10 stroke-blue-300 dark:stroke-blue-600" strokeWidth="1.5" />
        <circle cx="242" cy="82" r="14" className="fill-blue-100 dark:fill-blue-900/30" />
        <text x="242" y="87" textAnchor="middle" className="step-num fill-blue-600 dark:fill-blue-400">2</text>
        <text x="312" y="87" textAnchor="middle" className="heading fill-blue-700 dark:fill-blue-300">
          Wet Hand
        </text>

        {/* Hand shape */}
        <rect x="262" y="110" width="55" height="75" rx="6"
          fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="289" y="148" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400">WET</text>

        {/* Evaporation drops */}
        {[270, 285, 300].map((x, i) => (
          <g key={i} className="evap" style={{ animationDelay: `\${i * 0.5}s` }}>
            <text x={x} y={106} textAnchor="middle" className="small fill-blue-400">↑</text>
          </g>
        ))}

        <text x="337" y="140" className="small fill-blue-500 dark:fill-blue-400">← wave</text>
        <text x="337" y="155" className="small fill-blue-500 dark:fill-blue-400">30 sec</text>

        <text x="299" y="210" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Result: feels COOL
        </text>
        <text x="299" y="224" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Water evaporates fast
        </text>
        <text x="299" y="238" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Absorbs your body heat
        </text>
        <rect x="247" y="246" width="105" height="10" rx="3" className="fill-slate-200 dark:fill-slate-700" />
        <rect x="247" y="246" width="60" height="10" rx="3" fill="#3b82f6" opacity="0.5" />
        <text x="357" y="255" className="small fill-blue-500 dark:fill-blue-400">cool</text>

        {/* Step 3: Mud hand */}
        <rect x="404" y="62" width="175" height="200" rx="8"
          className="fill-amber-50 dark:fill-amber-900/10 stroke-amber-300 dark:stroke-amber-600" strokeWidth="1.5" />
        <circle cx="434" cy="82" r="14" className="fill-amber-100 dark:fill-amber-900/30" />
        <text x="434" y="87" textAnchor="middle" className="step-num fill-amber-600 dark:fill-amber-400">3</text>
        <text x="504" y="87" textAnchor="middle" className="heading fill-amber-700 dark:fill-amber-300">
          Mud Hand
        </text>

        {/* Hand shape */}
        <rect x="454" y="110" width="55" height="75" rx="6"
          fill="#92400e" opacity="0.25" stroke="#92400e" strokeWidth="1.5" />
        <text x="481" y="148" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400">MUD</text>

        {/* Slow evaporation */}
        {[462, 477, 492].map((x, i) => (
          <g key={i} className="evap" style={{ animationDelay: `\${i * 0.8}s` }}>
            <text x={x} y={106} textAnchor="middle" className="small fill-amber-500">↑</text>
          </g>
        ))}

        <text x="529" y="140" className="small fill-amber-600 dark:fill-amber-400">← wait</text>
        <text x="529" y="155" className="small fill-amber-600 dark:fill-amber-400">5 min</text>

        <text x="491" y="210" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-300">
          Result: STILL cool
        </text>
        <text x="491" y="224" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-300">
          Mud holds water
        </text>
        <text x="491" y="238" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-300">
          Evaporates slowly = longer
        </text>
        <rect x="439" y="246" width="105" height="10" rx="3" className="fill-slate-200 dark:fill-slate-700" />
        <rect x="439" y="246" width="95" height="10" rx="3" fill="#f59e0b" opacity="0.5" />
        <text x="549" y="255" className="small fill-amber-500 dark:fill-amber-400">cool</text>

        {/* Bottom: The Science */}
        <rect x="30" y="278" width="540" height="110" rx="8"
          className="fill-emerald-50 dark:fill-emerald-900/15 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="1.5" />
        <text x="300" y="298" textAnchor="middle" className="heading fill-emerald-700 dark:fill-emerald-400">
          What You Just Proved
        </text>

        <text x="300" y="316" textAnchor="middle" className="label fill-emerald-600 dark:fill-emerald-300">
          Evaporation absorbs heat — 2,260 joules per gram of water that evaporates.
        </text>
        <text x="300" y="332" textAnchor="middle" className="label fill-emerald-600 dark:fill-emerald-300">
          Plain water evaporates fast → intense but short cooling.
        </text>
        <text x="300" y="348" textAnchor="middle" className="label fill-emerald-600 dark:fill-emerald-300">
          Mud holds water in its particles → slow, steady evaporation for hours.
        </text>
        <text x="300" y="368" textAnchor="middle" className="label fill-emerald-700 dark:fill-emerald-200" fontWeight="600">
          This is why elephants choose mud over plain water — longer-lasting cooling.
        </text>
      </svg>
    </div>
  );
};

export default ActivityCoolingExperimentDiagram;
