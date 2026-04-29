export default function BambooAuxinDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Auxin and gibberellin: plant growth hormones that control cell elongation in bamboo"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-green-600 dark:fill-green-400">
          Auxin &amp; Gibberellin: Growth Hormone Duo
        </text>

        {/* Auxin panel */}
        <rect x="40" y="60" width="300" height="340" rx="10" className="fill-violet-50 dark:fill-violet-950/20 stroke-violet-300 dark:stroke-violet-700" strokeWidth="1.5" />
        <text x="190" y="84" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-violet-700 dark:fill-violet-300">Auxin (IAA)</text>
        <text x="190" y="100" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Discovered 1920s by Frits Went</text>

        {/* Acid growth mechanism */}
        <text x="190" y="125" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-violet-600 dark:fill-violet-400">Acid Growth Mechanism</text>

        {/* Step flow */}
        {[
          { y: 145, text: '1. Auxin binds to cell membrane receptor', icon: '\ud83d\udd11' },
          { y: 175, text: '2. Proton pumps push H\u207a into cell wall', icon: '\u26a1' },
          { y: 205, text: '3. Wall acidifies \u2192 expansins activate', icon: '\ud83e\uddea' },
          { y: 235, text: '4. Cellulose bonds loosen', icon: '\ud83d\udd13' },
          { y: 265, text: '5. Turgor pressure stretches cell UP', icon: '\u2b06\ufe0f' },
          { y: 295, text: '6. Wall re-stiffens with new cellulose', icon: '\ud83e\uddf1' },
        ].map(({ y, text, icon }) => (
          <g key={y}>
            <text x="65" y={y} fontSize="12">{icon}</text>
            <text x="82" y={y} fontSize="10" className="fill-gray-600 dark:fill-slate-400">{text}</text>
          </g>
        ))}

        {/* Polar transport note */}
        <rect x="55" y="320" width="270" height="65" rx="6" className="fill-violet-100 dark:fill-violet-900/30" />
        <text x="190" y="340" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-violet-700 dark:fill-violet-300">
          Polar Auxin Transport
        </text>
        <text x="190" y="355" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
          Auxin flows one-way: apex → base
        </text>
        <text x="190" y="370" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
          Concentrates where growth is needed
        </text>

        {/* Gibberellin panel */}
        <rect x="360" y="60" width="300" height="340" rx="10" className="fill-teal-50 dark:fill-teal-950/20 stroke-teal-300 dark:stroke-teal-700" strokeWidth="1.5" />
        <text x="510" y="84" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-teal-700 dark:fill-teal-300">Gibberellin (GA)</text>
        <text x="510" y="100" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Discovered in rice "foolish seedling" disease</text>

        <text x="510" y="125" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-teal-600 dark:fill-teal-400">What Gibberellin Does</text>

        {[
          { y: 145, text: 'Promotes STEM elongation', icon: '\u2195\ufe0f' },
          { y: 175, text: 'Stimulates cell division in meristems', icon: '\ud83d\udd04' },
          { y: 205, text: 'Breaks seed dormancy', icon: '\ud83c\udf31' },
          { y: 235, text: 'Works WITH auxin (synergistic)', icon: '\ud83e\udd1d' },
        ].map(({ y, text, icon }) => (
          <g key={y}>
            <text x="380" y={y} fontSize="12">{icon}</text>
            <text x="400" y={y} fontSize="10" className="fill-gray-600 dark:fill-slate-400">{text}</text>
          </g>
        ))}

        {/* Bamboo hormone levels */}
        <rect x="375" y="270" width="270" height="115" rx="6" className="fill-teal-100 dark:fill-teal-900/30" />
        <text x="510" y="290" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-teal-700 dark:fill-teal-300">
          In Bamboo Specifically
        </text>
        <text x="510" y="310" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
          Gibberellin levels surge during rapid growth
        </text>
        <text x="510" y="328" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
          Young internodes: HIGH auxin + HIGH GA
        </text>
        <text x="510" y="346" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
          Mature segments: LOW auxin + LOW GA
        </text>
        <text x="510" y="368" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-teal-600 dark:fill-teal-400">
          Gradient = growth where needed only
        </text>

        {/* Bottom summary */}
        <rect x="60" y="415" width="580" height="34" rx="8" className="fill-green-50 dark:fill-green-950/30 stroke-green-200 dark:stroke-green-800" strokeWidth="1" />
        <text x="350" y="437" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-700 dark:fill-green-300">
          Auxin loosens walls + Gibberellin drives elongation = bamboo's growth speed
        </text>
      </svg>
    </div>
  );
}
