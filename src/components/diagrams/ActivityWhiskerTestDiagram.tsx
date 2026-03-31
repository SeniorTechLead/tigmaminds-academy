export default function ActivityWhiskerTestDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Offline activity: blindfold test comparing spatial awareness with and without stick feelers">
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">Try This: Build Your Own Whiskers</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Test how much better you navigate in darkness with stick "feelers" vs without</text>

        {/* Setup */}
        <g transform="translate(40, 80)">
          <rect width="340" height="280" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="170" y="24" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Setup</text>

          {/* Obstacle course - top view */}
          <rect x="20" y="40" width="300" height="180" rx="6" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
          <text x="170" y="55" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">Room with obstacles (chairs, boxes)</text>

          {/* Obstacles */}
          <rect x="60" y="80" width="40" height="40" rx="4" className="fill-gray-300 dark:fill-slate-600" />
          <text x="80" y="105" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Chair</text>
          <rect x="160" y="120" width="50" height="30" rx="4" className="fill-gray-300 dark:fill-slate-600" />
          <text x="185" y="140" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Box</text>
          <rect x="240" y="70" width="35" height="50" rx="4" className="fill-gray-300 dark:fill-slate-600" />
          <text x="257" y="100" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Bin</text>

          {/* Person with blindfold */}
          <circle cx="45" cy="185" r="8" fill="#d4a574" />
          <rect x="37" y="181" width="16" height="5" rx="2" fill="#1e293b" />
          <text x="45" y="210" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Blindfolded</text>

          {/* Sticks as whiskers */}
          <line x1="53" y1="180" x2="95" y2="165" stroke="#78350f" strokeWidth="2" />
          <line x1="53" y1="185" x2="100" y2="185" stroke="#78350f" strokeWidth="2" />
          <line x1="53" y1="190" x2="95" y2="205" stroke="#78350f" strokeWidth="2" />
          <text x="100" y="225" fontSize="10" fontWeight="600" fill="#f59e0b">Two sticks = whiskers!</text>

          {/* Steps */}
          <text x="20" y="250" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Steps:</text>
          <text x="20" y="268" fontSize="10" className="fill-gray-600 dark:fill-slate-300">1. Blindfold → cross room → time it</text>
        </g>

        {/* Results comparison */}
        <g transform="translate(400, 80)">
          <rect width="340" height="280" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="170" y="24" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Record Results</text>

          {/* Trial 1: No sticks */}
          <rect x="20" y="45" width="300" height="55" rx="6" fill="#ef4444" opacity="0.08" stroke="#ef4444" strokeWidth="1" />
          <text x="170" y="64" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ef4444">Without sticks (no whiskers)</text>
          <text x="170" y="84" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Time: ___ sec | Collisions: ___</text>

          {/* Trial 2: With sticks */}
          <rect x="20" y="115" width="300" height="55" rx="6" fill="#22c55e" opacity="0.08" stroke="#22c55e" strokeWidth="1" />
          <text x="170" y="134" textAnchor="middle" fontSize="12" fontWeight="600" fill="#22c55e">With two sticks (whiskers!)</text>
          <text x="170" y="154" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Time: ___ sec | Collisions: ___</text>

          {/* Prediction */}
          <rect x="20" y="185" width="300" height="75" rx="6" fill="#f59e0b" opacity="0.08" stroke="#f59e0b" strokeWidth="1" />
          <text x="170" y="204" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f59e0b">What to expect</text>
          <text x="170" y="224" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">With sticks: fewer collisions, more confidence</text>
          <text x="170" y="242" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">You just experienced what a tiger feels 24/7!</text>
        </g>

        {/* Bottom insight */}
        <rect x="60" y="375" width="660" height="30" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="395" textAnchor="middle" fontSize="12" fontWeight="600" fill="#f59e0b">
          Tigers have ~30 whiskers operating simultaneously — your 2 sticks are just 7% of their system!
        </text>
      </svg>
    </div>
  );
}
