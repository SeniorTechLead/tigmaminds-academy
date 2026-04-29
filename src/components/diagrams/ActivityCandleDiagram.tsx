export default function ActivityCandleDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 520 340"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity showing how to safely observe a candle flame and test combustion"
      >
        <style>{`
          .acd-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .acd-label { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .acd-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .acd-step { font-family: system-ui, sans-serif; font-size: 11px; }
        `}</style>

        {/* Background */}
        <rect width="520" height="340" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="26" textAnchor="middle" className="acd-title fill-gray-700 dark:fill-gray-200">
          Activity: Candle Flame Investigation
        </text>

        {/* Safety banner */}
        <rect x="30" y="38" width="460" height="22" rx="4"
          className="fill-red-100 dark:fill-red-900/30 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="260" y="53" textAnchor="middle" className="acd-small fill-red-700 dark:fill-red-300">
          ⚠ Adult supervision required. Work on a fireproof surface. Keep water nearby.
        </text>

        {/* Step 1: Light and observe */}
        <rect x="20" y="70" width="145" height="130" rx="6"
          className="fill-amber-50 dark:fill-amber-900/10 stroke-amber-300 dark:stroke-amber-600" strokeWidth="1" />
        <circle cx="35" cy="84" r="10" className="fill-amber-500 dark:fill-amber-400" />
        <text x="35" y="88" textAnchor="middle" className="acd-small fill-white dark:fill-white">1</text>
        <text x="55" y="88" className="acd-label fill-amber-700 dark:fill-amber-300">Light + Draw</text>

        {/* Mini candle */}
        <rect x="70" y="135" width="20" height="35" rx="2" className="fill-yellow-200 dark:fill-yellow-800/40 stroke-yellow-500" strokeWidth="1" />
        <ellipse cx="80" cy="120" rx="10" ry="20" className="fill-orange-300/50 dark:fill-orange-500/30" />
        <ellipse cx="80" cy="125" rx="5" ry="12" className="fill-yellow-300/60 dark:fill-yellow-400/40" />

        <text x="92" y="115" textAnchor="middle" className="acd-small fill-gray-600 dark:fill-gray-400">Sketch the</text>
        <text x="92" y="127" textAnchor="middle" className="acd-small fill-gray-600 dark:fill-gray-400">flame zones</text>
        <text x="92" y="186" textAnchor="middle" className="acd-small fill-gray-500 dark:fill-gray-400">Label: dark,</text>
        <text x="92" y="196" textAnchor="middle" className="acd-small fill-gray-500 dark:fill-gray-400">yellow, blue</text>

        {/* Step 2: Glass jar test */}
        <rect x="185" y="70" width="145" height="130" rx="6"
          className="fill-blue-50 dark:fill-blue-900/10 stroke-blue-300 dark:stroke-blue-600" strokeWidth="1" />
        <circle cx="200" cy="84" r="10" className="fill-blue-500 dark:fill-blue-400" />
        <text x="200" y="88" textAnchor="middle" className="acd-small fill-white dark:fill-white">2</text>
        <text x="225" y="88" className="acd-label fill-blue-700 dark:fill-blue-300">Jar Test</text>

        {/* Jar over candle */}
        <rect x="225" y="110" width="40" height="60" rx="4"
          className="fill-blue-100/30 dark:fill-blue-900/20 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" strokeDasharray="4,2" />
        <rect x="238" y="140" width="14" height="24" rx="2" className="fill-yellow-200 dark:fill-yellow-800/40 stroke-yellow-500" strokeWidth="1" />
        <ellipse cx="245" cy="133" rx="6" ry="12" className="fill-orange-300/40" />

        <text x="257" y="186" textAnchor="middle" className="acd-small fill-gray-500 dark:fill-gray-400">Cover with jar.</text>
        <text x="257" y="196" textAnchor="middle" className="acd-small fill-gray-500 dark:fill-gray-400">Flame dies: no O₂!</text>

        {/* Step 3: Soot test */}
        <rect x="350" y="70" width="145" height="130" rx="6"
          className="fill-gray-50 dark:fill-gray-800/30 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <circle cx="365" cy="84" r="10" className="fill-gray-500 dark:fill-gray-400" />
        <text x="365" y="88" textAnchor="middle" className="acd-small fill-white dark:fill-white">3</text>
        <text x="395" y="88" className="acd-label fill-gray-700 dark:fill-gray-300">Soot Test</text>

        {/* Spoon held in flame */}
        <rect x="395" y="140" width="60" height="6" rx="2" className="fill-gray-400 dark:fill-gray-500 stroke-gray-500" strokeWidth="1" />
        <ellipse cx="395" cy="133" rx="8" ry="16" className="fill-orange-300/40" />
        <circle cx="435" cy="143" r="6" className="fill-gray-700 dark:fill-gray-600" />

        <text x="422" y="170" textAnchor="middle" className="acd-small fill-gray-500 dark:fill-gray-400">Hold spoon above</text>
        <text x="422" y="182" textAnchor="middle" className="acd-small fill-gray-500 dark:fill-gray-400">flame. Black soot =</text>
        <text x="422" y="194" textAnchor="middle" className="acd-small fill-gray-500 dark:fill-gray-400">incomplete combustion</text>

        {/* Recording section */}
        <rect x="20" y="210" width="480" height="120" rx="6"
          className="fill-green-50 dark:fill-green-900/10 stroke-green-300 dark:stroke-green-700" strokeWidth="1" />
        <text x="260" y="230" textAnchor="middle" className="acd-label fill-green-700 dark:fill-green-300">
          Record Your Observations
        </text>

        {/* Table */}
        <text x="40" y="252" className="acd-step fill-gray-600 dark:fill-gray-400">
          • How many seconds until the jar flame goes out? ____
        </text>
        <text x="40" y="268" className="acd-step fill-gray-600 dark:fill-gray-400">
          • Which flame zone is hottest? (hold a toothpick across) ____
        </text>
        <text x="40" y="284" className="acd-step fill-gray-600 dark:fill-gray-400">
          • What colour is the base of the flame vs the tip? ____
        </text>
        <text x="40" y="300" className="acd-step fill-gray-600 dark:fill-gray-400">
          • Does a bigger jar make the flame last longer? Why? ____
        </text>
        <text x="40" y="320" className="acd-small fill-green-600 dark:fill-green-400">
          Bonus: Try two jar sizes and time them. More air volume = more O₂ = longer burn time!
        </text>
      </svg>
    </div>
  );
}
