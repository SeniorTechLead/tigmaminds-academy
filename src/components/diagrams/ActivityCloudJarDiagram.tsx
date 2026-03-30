const ActivityCloudJarDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 560 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Step-by-step diagram showing how to make a cloud in a jar using warm water, ice, and a match"
      >
        <style>{`
          @keyframes cloud-appear {
            0%, 30% { opacity: 0; }
            50% { opacity: 0.4; }
            100% { opacity: 0.7; }
          }
          .cloud-form { animation: cloud-appear 4s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
        `}</style>

        <rect width="560" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="280" y="26" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Try It: Make a Cloud in a Jar
        </text>

        {/* STEP 1 */}
        <rect x="20" y="45" width="150" height="170" rx="8"
          className="fill-blue-50 dark:fill-blue-900/20" stroke="#3b82f6" strokeWidth="1" />
        <text x="95" y="62" textAnchor="middle" className="step-text fill-blue-700 dark:fill-blue-300">Step 1</text>
        <text x="95" y="76" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">Pour warm water</text>
        <text x="95" y="88" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">into a glass jar</text>

        {/* Jar */}
        <rect x="55" y="100" width="80" height="100" rx="4"
          className="fill-blue-100 dark:fill-blue-900/40 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
        {/* Water */}
        <rect x="57" y="155" width="76" height="43" rx="2"
          className="fill-blue-300 dark:fill-blue-600" opacity="0.6" />
        {/* Steam lines */}
        <path d="M 80 150 Q 78 140 82 130" fill="none" className="stroke-blue-300 dark:stroke-blue-500" strokeWidth="1" opacity="0.5" />
        <path d="M 100 148 Q 98 138 102 128" fill="none" className="stroke-blue-300 dark:stroke-blue-500" strokeWidth="1" opacity="0.5" />
        <path d="M 120 150 Q 118 140 122 130" fill="none" className="stroke-blue-300 dark:stroke-blue-500" strokeWidth="1" opacity="0.5" />

        {/* STEP 2 */}
        <rect x="195" y="45" width="150" height="170" rx="8"
          className="fill-orange-50 dark:fill-orange-900/20" stroke="#f97316" strokeWidth="1" />
        <text x="270" y="62" textAnchor="middle" className="step-text fill-orange-700 dark:fill-orange-300">Step 2</text>
        <text x="270" y="76" textAnchor="middle" className="label-text fill-orange-600 dark:fill-orange-400">Light a match, blow</text>
        <text x="270" y="88" textAnchor="middle" className="label-text fill-orange-600 dark:fill-orange-400">out, drop smoke in</text>

        {/* Jar with match */}
        <rect x="230" y="100" width="80" height="100" rx="4"
          className="fill-blue-100 dark:fill-blue-900/40 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <rect x="232" y="155" width="76" height="43" rx="2"
          className="fill-blue-300 dark:fill-blue-600" opacity="0.6" />
        {/* Match */}
        <line x1="260" y1="95" x2="260" y2="130" className="stroke-yellow-700 dark:stroke-yellow-500" strokeWidth="2" />
        <circle cx="260" cy="92" r="3" className="fill-orange-500" />
        {/* Smoke particles */}
        <circle cx="265" cy="120" r="1.5" className="fill-gray-400" opacity="0.6" />
        <circle cx="258" cy="128" r="1" className="fill-gray-400" opacity="0.5" />
        <circle cx="270" cy="115" r="1" className="fill-gray-400" opacity="0.4" />
        <text x="270" y="145" textAnchor="middle" className="label-text fill-orange-600 dark:fill-orange-400" fontSize="8">Smoke = nuclei!</text>

        {/* STEP 3 */}
        <rect x="370" y="45" width="170" height="170" rx="8"
          className="fill-cyan-50 dark:fill-cyan-900/20" stroke="#06b6d4" strokeWidth="1" />
        <text x="455" y="62" textAnchor="middle" className="step-text fill-cyan-700 dark:fill-cyan-300">Step 3</text>
        <text x="455" y="76" textAnchor="middle" className="label-text fill-cyan-600 dark:fill-cyan-400">Place bag of ice on</text>
        <text x="455" y="88" textAnchor="middle" className="label-text fill-cyan-600 dark:fill-cyan-400">top &#8212; watch the cloud!</text>

        {/* Jar with ice and cloud */}
        <rect x="410" y="108" width="80" height="100" rx="4"
          className="fill-blue-100 dark:fill-blue-900/40 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <rect x="412" y="165" width="76" height="41" rx="2"
          className="fill-blue-300 dark:fill-blue-600" opacity="0.6" />
        {/* Ice on top */}
        <rect x="405" y="100" width="90" height="14" rx="4"
          className="fill-cyan-200 dark:fill-cyan-700" opacity="0.8" />
        <text x="450" y="110" textAnchor="middle" className="label-text fill-cyan-700 dark:fill-cyan-300" fontSize="8">ICE</text>
        {/* Cloud forming inside */}
        <ellipse cx="450" cy="140" rx="28" ry="10" className="fill-white dark:fill-gray-400 cloud-form" />
        <ellipse cx="440" cy="135" rx="18" ry="8" className="fill-gray-100 dark:fill-gray-300 cloud-form" />
        <ellipse cx="458" cy="136" rx="16" ry="7" className="fill-gray-100 dark:fill-gray-300 cloud-form" />

        {/* EXPLANATION */}
        <rect x="20" y="230" width="520" height="120" rx="8"
          className="fill-amber-50 dark:fill-amber-900/20" stroke="#f59e0b" strokeWidth="1" />
        <text x="280" y="250" textAnchor="middle" className="step-text fill-amber-700 dark:fill-amber-300" fontSize="11">
          What Just Happened &#8212; The Science
        </text>

        <text x="40" y="270" className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600">Warm water</text>
        <text x="120" y="270" className="label-text fill-amber-600 dark:fill-amber-400">&#8594; evaporation fills jar with water vapor (invisible)</text>

        <text x="40" y="288" className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600">Match smoke</text>
        <text x="124" y="288" className="label-text fill-amber-600 dark:fill-amber-400">&#8594; provides condensation nuclei (tiny particles for water to grab onto)</text>

        <text x="40" y="306" className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600">Ice on top</text>
        <text x="108" y="306" className="label-text fill-amber-600 dark:fill-amber-400">&#8594; cools the air to its dew point (like altitude cooling in real atmosphere)</text>

        <text x="40" y="324" className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600">Result</text>
        <text x="78" y="324" className="label-text fill-amber-600 dark:fill-amber-400">&#8594; vapor condenses on smoke particles &#8594; visible cloud forms inside the jar!</text>

        <text x="40" y="342" className="label-text fill-amber-600 dark:fill-amber-400" fontStyle="italic">Try it WITHOUT the match. What happens? (Much weaker cloud &#8212; nuclei matter!)</text>

        {/* Materials list */}
        <rect x="20" y="365" width="250" height="62" rx="6"
          className="fill-green-50 dark:fill-green-900/20" stroke="#22c55e" strokeWidth="1" />
        <text x="145" y="382" textAnchor="middle" className="step-text fill-green-700 dark:fill-green-300">You Need:</text>
        <text x="40" y="398" className="label-text fill-green-600 dark:fill-green-400">&#x2022; Glass jar with lid  &#x2022; Warm water</text>
        <text x="40" y="412" className="label-text fill-green-600 dark:fill-green-400">&#x2022; Match or incense  &#x2022; Ice cubes/bag</text>

        {/* Safety note */}
        <rect x="290" y="365" width="250" height="62" rx="6"
          className="fill-red-50 dark:fill-red-900/20" stroke="#ef4444" strokeWidth="1" />
        <text x="415" y="382" textAnchor="middle" className="step-text fill-red-700 dark:fill-red-300">Safety:</text>
        <text x="310" y="398" className="label-text fill-red-600 dark:fill-red-400">&#x2022; Adult supervision for match</text>
        <text x="310" y="412" className="label-text fill-red-600 dark:fill-red-400">&#x2022; Use warm (not boiling) water</text>
      </svg>
    </div>
  );
};

export default ActivityCloudJarDiagram;
