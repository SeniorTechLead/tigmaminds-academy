const CloudSeedingDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 620 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing cloud seeding: aircraft releasing silver iodide particles into clouds to trigger rain"
      >
        <style>{`
          @keyframes scatter {
            0% { opacity: 0; transform: translateY(0); }
            30% { opacity: 1; }
            100% { opacity: 0; transform: translateY(20px) translateX(10px); }
          }
          @keyframes rain-fall {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(40px); opacity: 0; }
          }
          .scatter-1 { animation: scatter 2.5s ease-out infinite; }
          .scatter-2 { animation: scatter 2.5s ease-out 0.5s infinite; }
          .scatter-3 { animation: scatter 2.5s ease-out 1s infinite; }
          .rain-1 { animation: rain-fall 1.8s linear infinite; }
          .rain-2 { animation: rain-fall 1.8s linear 0.4s infinite; }
          .rain-3 { animation: rain-fall 1.8s linear 0.8s infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
        `}</style>

        <rect width="620" height="460" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="310" y="26" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Cloud Seeding &#8212; Making Rain on Demand
        </text>

        {/* Sky background */}
        <defs>
          <linearGradient id="cs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#87CEEB" />
          </linearGradient>
        </defs>
        <rect x="20" y="38" width="580" height="280" rx="6" fill="url(#cs-sky)" opacity="0.15" />

        {/* Large cloud */}
        <ellipse cx="310" cy="120" rx="180" ry="65" className="fill-gray-300 dark:fill-gray-600" opacity="0.5" />
        <ellipse cx="260" cy="105" rx="100" ry="45" className="fill-gray-200 dark:fill-gray-500" opacity="0.5" />
        <ellipse cx="370" cy="105" rx="110" ry="50" className="fill-gray-200 dark:fill-gray-500" opacity="0.5" />
        <ellipse cx="310" cy="90" rx="120" ry="40" className="fill-white dark:fill-gray-400" opacity="0.4" />

        {/* Aircraft */}
        <g transform="translate(170, 130)">
          {/* Fuselage */}
          <ellipse cx="0" cy="0" rx="30" ry="5" className="fill-slate-600 dark:fill-slate-300" />
          {/* Wings */}
          <line x1="-8" y1="0" x2="-8" y2="-15" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2" />
          <line x1="-8" y1="-15" x2="-25" y2="-15" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2" />
          <line x1="-8" y1="0" x2="-8" y2="15" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2" />
          <line x1="-8" y1="15" x2="-25" y2="15" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2" />
          {/* Tail */}
          <line x1="25" y1="0" x2="30" y2="-8" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="1.5" />
          {/* Nose */}
          <circle cx="-28" cy="0" r="3" className="fill-slate-500 dark:fill-slate-400" />
        </g>

        {/* Silver iodide particles being released */}
        <circle cx="210" cy="140" r="2" className="fill-yellow-400 scatter-1" />
        <circle cx="215" cy="138" r="1.5" className="fill-yellow-500 scatter-2" />
        <circle cx="205" cy="142" r="1.5" className="fill-yellow-400 scatter-3" />
        <circle cx="220" cy="141" r="2" className="fill-yellow-500 scatter-1" />

        {/* Label: Silver iodide */}
        <rect x="30" y="155" width="140" height="40" rx="5"
          className="fill-yellow-100 dark:fill-yellow-900/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="100" y="170" textAnchor="middle" className="step-text fill-yellow-700 dark:fill-yellow-300">Silver Iodide (AgI)</text>
        <text x="100" y="184" textAnchor="middle" className="label-text fill-yellow-600 dark:fill-yellow-400">Crystal mimics ice structure</text>

        {/* Process steps on right */}
        {/* Step 1 */}
        <rect x="420" y="50" width="180" height="44" rx="6"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.85" stroke="#3b82f6" strokeWidth="1" />
        <text x="510" y="66" textAnchor="middle" className="step-text fill-blue-700 dark:fill-blue-300">1. Release AgI particles</text>
        <text x="510" y="80" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">1 gram = 10 trillion nuclei</text>

        {/* Step 2 */}
        <rect x="420" y="105" width="180" height="44" rx="6"
          className="fill-purple-100 dark:fill-purple-900" opacity="0.85" stroke="#a855f7" strokeWidth="1" />
        <text x="510" y="121" textAnchor="middle" className="step-text fill-purple-700 dark:fill-purple-300">2. Water freezes on AgI</text>
        <text x="510" y="135" textAnchor="middle" className="label-text fill-purple-600 dark:fill-purple-400">Same Bergeron process, faster</text>

        {/* Step 3 */}
        <rect x="420" y="160" width="180" height="44" rx="6"
          className="fill-green-100 dark:fill-green-900" opacity="0.85" stroke="#22c55e" strokeWidth="1" />
        <text x="510" y="176" textAnchor="middle" className="step-text fill-green-700 dark:fill-green-300">3. Ice crystals grow</text>
        <text x="510" y="190" textAnchor="middle" className="label-text fill-green-600 dark:fill-green-400">Fall and melt into rain</text>

        {/* Rain drops */}
        <circle cx="280" cy="200" r="3" className="fill-blue-500 rain-1" />
        <circle cx="310" cy="195" r="3.5" className="fill-blue-500 rain-2" />
        <circle cx="340" cy="200" r="3" className="fill-blue-500 rain-3" />
        <circle cx="260" cy="198" r="2.5" className="fill-blue-500 rain-2" />
        <circle cx="360" cy="196" r="2.5" className="fill-blue-500 rain-1" />

        {/* Ground with village */}
        <rect x="20" y="310" width="580" height="8" rx="2"
          className="fill-green-300 dark:fill-green-800" opacity="0.6" />

        {/* Methods comparison at bottom */}
        <text x="310" y="338" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200" fontSize="11">
          Three Methods of Cloud Seeding
        </text>

        {/* Method 1: Aircraft */}
        <rect x="30" y="350" width="170" height="58" rx="6"
          className="fill-blue-50 dark:fill-blue-900/30" stroke="#3b82f6" strokeWidth="1" />
        <text x="115" y="366" textAnchor="middle" className="step-text fill-blue-700 dark:fill-blue-300">Aircraft Flares</text>
        <text x="115" y="380" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">Fly through cloud, burn AgI</text>
        <text x="115" y="394" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">Most common method</text>

        {/* Method 2: Ground generators */}
        <rect x="220" y="350" width="170" height="58" rx="6"
          className="fill-green-50 dark:fill-green-900/30" stroke="#22c55e" strokeWidth="1" />
        <text x="305" y="366" textAnchor="middle" className="step-text fill-green-700 dark:fill-green-300">Ground Generators</text>
        <text x="305" y="380" textAnchor="middle" className="label-text fill-green-600 dark:fill-green-400">Burn AgI solution, wind</text>
        <text x="305" y="394" textAnchor="middle" className="label-text fill-green-600 dark:fill-green-400">carries particles upward</text>

        {/* Method 3: Dry ice */}
        <rect x="410" y="350" width="180" height="58" rx="6"
          className="fill-purple-50 dark:fill-purple-900/30" stroke="#a855f7" strokeWidth="1" />
        <text x="500" y="366" textAnchor="middle" className="step-text fill-purple-700 dark:fill-purple-300">Dry Ice (CO&#8322;)</text>
        <text x="500" y="380" textAnchor="middle" className="label-text fill-purple-600 dark:fill-purple-400">Supercools air so fast</text>
        <text x="500" y="394" textAnchor="middle" className="label-text fill-purple-600 dark:fill-purple-400">that ice forms instantly</text>

        {/* Effectiveness note */}
        <rect x="100" y="420" width="420" height="30" rx="6"
          className="fill-amber-50 dark:fill-amber-900/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="310" y="440" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Effectiveness: 5&#8211;15% increase in rainfall. Only works on clouds that already have moisture.
        </text>
      </svg>
    </div>
  );
};

export default CloudSeedingDiagram;
