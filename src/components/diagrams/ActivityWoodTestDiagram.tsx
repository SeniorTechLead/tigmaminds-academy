export default function ActivityWoodTestDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: test wood grain strength by snapping a stick along vs across the grain"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#c9a86c">
          Try This: Test Grain Direction Yourself
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: two thin wooden sticks (popsicle sticks, skewers, or thin branches)
        </text>

        {/* Test 1: Along grain */}
        <rect x="40" y="75" width="330" height="200" rx="10" className="fill-white dark:fill-slate-900" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="70" cy="100" r="16" fill="#22c55e" fillOpacity="0.2" />
        <text x="70" y="106" textAnchor="middle" fontSize="14" fontWeight="700" fill="#22c55e">1</text>
        <text x="95" y="106" fontSize="13" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Try to snap ALONG the grain</text>

        {/* Stick with grain - horizontal */}
        <rect x="80" y="130" width="250" height="20" rx="3" fill="#c9a86c" stroke="#a16207" strokeWidth="1" />
        {[140, 148, 156, 164].map(y => (
          <line key={y} x1="85" y1={y - 6} x2="325" y2={y - 6} stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
        ))}
        <text x="205" y="167" textAnchor="middle" fontSize="10" fill="#a16207">{'\u2190'} grain lines run this way {'\u2192'}</text>

        {/* Hands pulling */}
        <text x="65" y="142" fontSize="20">{'\u270B'}</text>
        <text x="330" y="142" fontSize="20">{'\u270B'}</text>
        <text x="65" y="175" fontSize="10" fill="#22c55e">{'\u2190'} pull</text>
        <text x="330" y="175" fontSize="10" fill="#22c55e">pull {'\u2192'}</text>

        <text x="205" y="210" textAnchor="middle" fontSize="12" fontWeight="600" fill="#22c55e">
          Very hard to break!
        </text>
        <text x="205" y="228" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          The fibers hold together
        </text>
        <text x="205" y="258" textAnchor="middle" fontSize="22">{'\uD83D\uDCAA'}</text>

        {/* Test 2: Across grain */}
        <rect x="410" y="75" width="330" height="200" rx="10" className="fill-white dark:fill-slate-900" stroke="#ef4444" strokeWidth="1.5" />
        <circle cx="440" cy="100" r="16" fill="#ef4444" fillOpacity="0.2" />
        <text x="440" y="106" textAnchor="middle" fontSize="14" fontWeight="700" fill="#ef4444">2</text>
        <text x="465" y="106" fontSize="13" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Try to split ACROSS the grain</text>

        {/* Stick with grain - splitting */}
        <rect x="450" y="130" width="120" height="20" rx="3" fill="#c9a86c" stroke="#a16207" strokeWidth="1" />
        <rect x="580" y="130" width="120" height="20" rx="3" fill="#c9a86c" stroke="#a16207" strokeWidth="1" />
        {[140, 148, 156, 164].map(y => (
          <g key={y}>
            <line x1="455" y1={y - 6} x2="565" y2={y - 6} stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
            <line x1="585" y1={y - 6} x2="695" y2={y - 6} stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          </g>
        ))}
        {/* Split crack */}
        <path d="M572,128 L570,135 L574,142 L569,149 L573,155" fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* Hands pushing apart */}
        <text x="440" y="142" fontSize="20">{'\u270B'}</text>
        <text x="700" y="142" fontSize="20">{'\u270B'}</text>

        <text x="575" y="210" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ef4444">
          Splits apart easily!
        </text>
        <text x="575" y="228" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Fibers separate from each other
        </text>
        <text x="575" y="258" textAnchor="middle" fontSize="22">{'\uD83D\uDCA5'}</text>

        {/* Step 3: Newspaper test */}
        <rect x="100" y="295" width="580" height="70" rx="10" className="fill-white dark:fill-slate-900" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="130" cy="320" r="16" fill="#f59e0b" fillOpacity="0.2" />
        <text x="130" y="326" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f59e0b">3</text>
        <text x="155" y="320" fontSize="13" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Bonus: Try tearing a newspaper
        </text>
        <text x="155" y="340" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Tear it top-to-bottom (along the fiber direction) {'\u2014'} smooth, straight tear.
        </text>
        <text x="155" y="356" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Tear it side-to-side (across the fibers) {'\u2014'} ragged, difficult tear. Same principle!
        </text>

        {/* What you learned */}
        <rect x="100" y="385" width="580" height="55" rx="10" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1" />
        <text x="390" y="408" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f59e0b">
          What this teaches you:
        </text>
        <text x="390" y="428" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-amber-300">
          Materials with aligned fibers are strong in one direction and weak in the other {'\u2014'} this is called anisotropy
        </text>
      </svg>
    </div>
  );
}
