export default function PithaScienceOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Project output: controlled baking experiment comparing 4 pitha batches with different variables">
        <rect width="780" height="360" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#d97706">Your Project: Pitha Science Experiment</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Change one variable at a time, measure the results — real food science!</text>

        {/* 4 batches */}
        {[
          { label: 'Control', variable: 'Standard recipe', color: '#22c55e', browning: '60%', texture: 'Medium', rise: '1 cm' },
          { label: 'More sugar', variable: '2× jaggery', color: '#d97706', browning: '85%', texture: 'Crispy', rise: '0.8 cm' },
          { label: 'Higher heat', variable: '200°C vs 160°C', color: '#ef4444', browning: '90%', texture: 'Hard', rise: '0.5 cm' },
          { label: 'Longer time', variable: '10 min vs 5 min', color: '#8b5cf6', browning: '75%', texture: 'Dry', rise: '0.9 cm' },
        ].map((b, i) => (
          <g key={i} transform={`translate(${45 + i * 180}, 75)`}>
            <rect width="165" height="220" rx="8" className="fill-gray-50 dark:fill-slate-800" stroke={b.color} strokeWidth="1.5" />

            {/* Header */}
            <rect width="165" height="28" rx="8" fill={b.color} opacity="0.2" />
            <text x="82" y="19" textAnchor="middle" fontSize="12" fontWeight="700" fill={b.color}>{b.label}</text>

            {/* Variable */}
            <text x="82" y="48" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{b.variable}</text>

            {/* Pitha visual - colored by browning */}
            <rect x="40" y="60" width="85" height="40" rx="20" fill={b.color} opacity={0.15 + parseFloat(b.browning) / 300} stroke={b.color} strokeWidth="1" />

            {/* Results */}
            <text x="15" y="125" fontSize="10" fontWeight="600" fill={b.color}>Browning:</text>
            <rect x="85" y="115" width={parseFloat(b.browning) * 0.7} height="12" rx="3" fill={b.color} opacity="0.4" />
            <text x={90 + parseFloat(b.browning) * 0.7} y="125" fontSize="10" fill={b.color}>{b.browning}</text>

            <text x="15" y="148" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Texture: {b.texture}</text>
            <text x="15" y="168" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Rise: {b.rise}</text>

            {/* Science explanation */}
            <text x="82" y="195" textAnchor="middle" fontSize="9" className="fill-gray-400 dark:fill-slate-500">
              {[
                'Baseline reference',
                'More Maillard reactants',
                'Faster Maillard rate',
                'More reaction time',
              ][i]}
            </text>
          </g>
        ))}

        {/* Method label */}
        <rect x="60" y="310" width="660" height="36" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="328" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          Scientific method: change ONE variable per batch, keep everything else the same
        </text>
        <text x="390" y="342" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          This is how food scientists work — and how you can explain exactly why each pitha tastes different
        </text>
      </svg>
    </div>
  );
}
