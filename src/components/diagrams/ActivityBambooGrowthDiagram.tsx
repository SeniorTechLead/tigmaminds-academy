export default function ActivityBambooGrowthDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: measure a bean sprout's daily growth to see the S-curve of plant growth"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Try This: Track a Plant's Growth Curve
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: bean seeds, a pot, soil, water, a ruler, and a notebook
        </text>

        {/* Steps */}
        {[
          { step: '1', text: 'Plant 3 bean seeds in damp soil. Place in sunlight.' },
          { step: '2', text: 'Measure height with a ruler at the SAME time every day.' },
          { step: '3', text: 'Record in a table: Day, Height (cm), Growth today (cm).' },
          { step: '4', text: 'After 3 weeks, plot Height vs Day on graph paper.' },
        ].map(({ step, text }, i) => (
          <g key={step}>
            <circle cx="80" cy={82 + i * 36} r="14" className="fill-emerald-500" opacity="0.15" />
            <text x="80" y={86 + i * 36} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-emerald-500">{step}</text>
            <text x="105" y={86 + i * 36} fontSize="11" className="fill-gray-700 dark:fill-slate-300">{text}</text>
          </g>
        ))}

        {/* Expected S-curve */}
        <rect x="60" y="230" width="580" height="180" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="350" y="252" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">What You Should See: The S-Curve</text>

        {/* Axes */}
        <line x1="120" y1="380" x2="580" y2="380" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1" />
        <line x1="120" y1="380" x2="120" y2="265" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="350" y="398" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Days</text>
        <text x="98" y="322" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" transform="rotate(-90 98 322)">Height</text>

        {/* S-curve path */}
        <path d="M 130 375 C 180 372 220 368 270 340 C 320 305 380 280 420 275 C 470 272 530 270 570 270"
          fill="none" stroke="#10b981" strokeWidth="2.5" />

        {/* Phase labels */}
        <text x="180" y="365" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">Lag</text>
        <text x="180" y="378" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Slow start</text>

        <text x="340" y="310" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400">Exponential</text>
        <text x="340" y="323" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Rapid growth!</text>

        <text x="510" y="264" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">Plateau</text>
        <text x="510" y="277" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Max height</text>

        {/* Bottom insight */}
        <rect x="60" y="420" width="580" height="30" rx="6" className="fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-200 dark:stroke-emerald-800" strokeWidth="1" />
        <text x="350" y="440" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
          Bamboo follows the same S-curve \u2014 just 30\u00d7 faster than your bean sprout!
        </text>
      </svg>
    </div>
  );
}
