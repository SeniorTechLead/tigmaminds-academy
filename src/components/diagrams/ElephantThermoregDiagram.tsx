const ElephantThermoregDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 640 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how elephants regulate body temperature using mud, ears, and shade"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes pulse-cool { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
          .cool-pulse { animation: pulse-cool 3s ease-in-out infinite; }
          @keyframes ear-flap { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(1.08)} }
          .ear-anim { animation: ear-flap 2s ease-in-out infinite; transform-origin: 290px 185px; }
        `}</style>

        {/* Background */}
        <rect width="640" height="420" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="320" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          How Elephants Stay Cool — No Sweat Glands Needed
        </text>

        {/* Sun */}
        <circle cx="560" cy="70" r="28" fill="#fbbf24" opacity="0.8" />
        <text x="560" y="110" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400">
          Solar radiation
        </text>
        {/* Heat rays from sun */}
        {[210, 230, 250].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={i}
              x1={560 + 32 * Math.cos(rad)} y1={70 + 32 * Math.sin(rad)}
              x2={560 + 60 * Math.cos(rad)} y2={70 + 60 * Math.sin(rad)}
              stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          );
        })}

        {/* Elephant body — simple side view */}
        <ellipse cx="300" cy="220" rx="120" ry="80"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />
        {/* Head */}
        <ellipse cx="195" cy="195" rx="45" ry="50"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />
        {/* Trunk */}
        <path d="M165 225 Q140 270 155 310"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="3" fill="none" />
        {/* Ear */}
        <g className="ear-anim">
          <ellipse cx="210" cy="185" rx="35" ry="50"
            fill="#ef4444" opacity="0.25" stroke="#ef4444" strokeWidth="1.5" />
          <text x="210" y="140" textAnchor="middle" className="small fill-red-600 dark:fill-red-400">
            Blood-rich ears
          </text>
          <text x="210" y="152" textAnchor="middle" className="small fill-red-600 dark:fill-red-400">
            radiate heat
          </text>
        </g>
        {/* Legs */}
        {[250, 290, 330, 370].map((x, i) => (
          <rect key={i} x={x - 8} y="280" width="16" height="55" rx="4"
            className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        ))}
        {/* Eye */}
        <circle cx="180" cy="185" r="4" className="fill-slate-700 dark:fill-slate-200" />

        {/* Mud layer on body */}
        <path d="M195 260 Q250 290 310 290 Q370 285 400 255"
          stroke="#92400e" strokeWidth="5" fill="none" opacity="0.5" strokeLinecap="round" />
        <text x="310" y="310" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400">
          Mud coating
        </text>

        {/* Evaporation arrows from mud */}
        {[240, 290, 340].map((x, i) => (
          <g key={i} className="cool-pulse" style={{ animationDelay: `\${i * 0.5}s` }}>
            <line x1={x} y1={265} x2={x} y2={235} stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#evap-arrow)" />
          </g>
        ))}
        <defs>
          <marker id="evap-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Labels around elephant */}
        {/* Problem box */}
        <rect x="20" y="50" width="200" height="68" rx="6"
          className="fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="120" y="70" textAnchor="middle" className="label fill-red-700 dark:fill-red-400" fontWeight="600">
          The Problem
        </text>
        <text x="120" y="86" textAnchor="middle" className="small fill-red-600 dark:fill-red-300">
          No sweat glands
        </text>
        <text x="120" y="100" textAnchor="middle" className="small fill-red-600 dark:fill-red-300">
          Huge body = massive heat
        </text>
        <text x="120" y="114" textAnchor="middle" className="small fill-red-600 dark:fill-red-300">
          Hot climate (35-40 °C)
        </text>

        {/* Solution boxes */}
        {/* Mud */}
        <rect x="20" y="340" width="145" height="68" rx="6"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-400 dark:stroke-amber-700" strokeWidth="1" />
        <text x="92" y="358" textAnchor="middle" className="label fill-amber-700 dark:fill-amber-400" fontWeight="600">
          ❶ Mud Bath
        </text>
        <text x="92" y="374" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-300">
          Evaporative cooling
        </text>
        <text x="92" y="388" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-300">
          UV sunscreen (SPF 5-10)
        </text>
        <text x="92" y="402" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-300">
          Parasite barrier
        </text>

        {/* Ears */}
        <rect x="180" y="340" width="145" height="68" rx="6"
          className="fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="252" y="358" textAnchor="middle" className="label fill-red-700 dark:fill-red-400" fontWeight="600">
          ❷ Ear Flapping
        </text>
        <text x="252" y="374" textAnchor="middle" className="small fill-red-600 dark:fill-red-300">
          Blood vessels radiate heat
        </text>
        <text x="252" y="388" textAnchor="middle" className="small fill-red-600 dark:fill-red-300">
          Wind = forced convection
        </text>
        <text x="252" y="402" textAnchor="middle" className="small fill-red-600 dark:fill-red-300">
          Cools blood up to 5 °C
        </text>

        {/* Skin wrinkles */}
        <rect x="340" y="340" width="145" height="68" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-400 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="412" y="358" textAnchor="middle" className="label fill-emerald-700 dark:fill-emerald-400" fontWeight="600">
          ❸ Wrinkled Skin
        </text>
        <text x="412" y="374" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-300">
          Cracks trap moisture
        </text>
        <text x="412" y="388" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-300">
          10× more surface area
        </text>
        <text x="412" y="402" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-300">
          Hours of slow evaporation
        </text>

        {/* Behavior */}
        <rect x="500" y="340" width="125" height="68" rx="6"
          className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="562" y="358" textAnchor="middle" className="label fill-blue-700 dark:fill-blue-400" fontWeight="600">
          ❹ Behavior
        </text>
        <text x="562" y="374" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Seek shade at midday
        </text>
        <text x="562" y="388" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Spray water on body
        </text>
        <text x="562" y="402" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Feed at cooler hours
        </text>

        {/* Evaporation label */}
        <text x="370" y="240" textAnchor="start" className="small fill-blue-600 dark:fill-blue-400">
          Water evaporates → absorbs
        </text>
        <text x="370" y="253" textAnchor="start" className="small fill-blue-600 dark:fill-blue-400">
          2,260 J per gram of heat
        </text>

        {/* Temperature indicator */}
        <rect x="470" y="160" width="150" height="52" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-400 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="545" y="180" textAnchor="middle" className="label fill-emerald-700 dark:fill-emerald-400" fontWeight="600">
          Target: 35.5-36.5 °C
        </text>
        <text x="545" y="196" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-300">
          Just 6 °C above = lethal
        </text>
        <text x="545" y="208" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-300">
          Narrow survival window
        </text>
      </svg>
    </div>
  );
};

export default ElephantThermoregDiagram;
