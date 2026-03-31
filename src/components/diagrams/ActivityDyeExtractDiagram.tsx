export default function ActivityDyeExtractDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: extract dyes from turmeric and red cabbage, test with acid and base"
      >
        <rect width="700" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-rose-600 dark:fill-rose-400">
          Try This: Extract Natural Dyes &amp; Test pH
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: turmeric, red cabbage, vinegar, baking soda, 6 cups, water
        </text>

        {/* Steps */}
        {[
          { step: '1', text: 'Boil chopped red cabbage in water for 10 min. Strain \u2192 purple liquid.' },
          { step: '2', text: 'Mix turmeric powder with warm water \u2192 yellow liquid.' },
          { step: '3', text: 'Pour each into 3 cups: one plain, one + vinegar, one + baking soda.' },
          { step: '4', text: 'Record the color changes in a table. Which is the better indicator?' },
        ].map(({ step, text }, i) => (
          <g key={step}>
            <circle cx="72" cy={78 + i * 32} r="13" className="fill-rose-500" opacity="0.15" />
            <text x="72" y={82 + i * 32} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-rose-500">{step}</text>
            <text x="95" y={82 + i * 32} fontSize="11" className="fill-gray-700 dark:fill-slate-300">{text}</text>
          </g>
        ))}

        {/* Results grid */}
        <rect x="40" y="215" width="620" height="170" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="350" y="238" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Expected Results</text>

        {/* Table headers */}
        {['', 'Plain Water', '+ Vinegar (acid)', '+ Baking Soda (base)'].map((h, i) => (
          <text key={h} x={100 + i * 155} y="260" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">{h}</text>
        ))}
        <line x1="50" y1="268" x2="650" y2="268" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />

        {/* Turmeric row */}
        <text x="100" y="290" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">Turmeric</text>
        {[
          { x: 255, color: '#fbbf24', text: 'Yellow' },
          { x: 410, color: '#fbbf24', text: 'Yellow (no change)' },
          { x: 565, color: '#ef4444', text: 'RED!' },
        ].map(({ x, color, text }) => (
          <g key={x}>
            <circle cx={x - 40} cy={286} r="8" fill={color} opacity="0.5" />
            <text x={x} y={290} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">{text}</text>
          </g>
        ))}

        {/* Red cabbage row */}
        <text x="100" y="328" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">Red Cabbage</text>
        {[
          { x: 255, color: '#8b5cf6', text: 'Purple' },
          { x: 410, color: '#f472b6', text: 'Pink/Red' },
          { x: 565, color: '#22c55e', text: 'Green/Yellow' },
        ].map(({ x, color, text }) => (
          <g key={x}>
            <circle cx={x - 40} cy={324} r="8" fill={color} opacity="0.5" />
            <text x={x} y={328} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">{text}</text>
          </g>
        ))}

        {/* Analysis prompt */}
        <text x="350" y="365" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-rose-600 dark:fill-rose-400">
          Which is the better pH indicator? (Hint: which one shows MORE color changes?)
        </text>

        {/* Bonus */}
        <rect x="40" y="395" width="620" height="70" rx="8" className="fill-rose-50 dark:fill-rose-950/30 stroke-rose-200 dark:stroke-rose-800" strokeWidth="1" />
        <text x="350" y="415" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-rose-700 dark:fill-rose-300">
          Bonus Experiment: Dye a Fabric Strip
        </text>
        <text x="350" y="435" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
          Soak cotton strips in turmeric water for 30 min. Wash one untreated strip and one
        </text>
        <text x="350" y="450" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
          pre-soaked in alum (mordant) water. Compare color retention \u2014 the alum strip keeps its color!
        </text>
      </svg>
    </div>
  );
}
