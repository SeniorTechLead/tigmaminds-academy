export default function ExpectedValueDiagram() {
  const outcomes = [
    { faces: '1–2', prob: '2/6', payout: '$0', color: 'fill-red-200 dark:fill-red-900/40', textColor: 'fill-red-700 dark:fill-red-300', label: 'Lose' },
    { faces: '3–5', prob: '3/6', payout: '$1', color: 'fill-amber-200 dark:fill-amber-900/40', textColor: 'fill-amber-700 dark:fill-amber-300', label: 'Win $1' },
    { faces: '6', prob: '1/6', payout: '$5', color: 'fill-emerald-200 dark:fill-emerald-900/40', textColor: 'fill-emerald-700 dark:fill-emerald-300', label: 'Win $5' },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 585 282" className="w-full max-w-xl mx-auto" role="img" aria-label="Expected value dice game diagram">
        {/* Title */}
        <text x="250" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">
          Dice Game: Pay $2 to play
        </text>

        {/* Die face */}
        <rect x="20" y="40" width="50" height="50" rx="8" className="fill-white dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <circle cx="35" cy="55" r="3" className="fill-gray-700 dark:fill-gray-300" />
        <circle cx="55" cy="55" r="3" className="fill-gray-700 dark:fill-gray-300" />
        <circle cx="45" cy="65" r="3" className="fill-gray-700 dark:fill-gray-300" />
        <circle cx="35" cy="75" r="3" className="fill-gray-700 dark:fill-gray-300" />
        <circle cx="55" cy="75" r="3" className="fill-gray-700 dark:fill-gray-300" />

        {/* Outcome boxes */}
        {outcomes.map((o, i) => {
          const y = 42 + i * 38;
          return (
            <g key={i}>
              <rect x="95" y={y} width="395" height="32" rx="6" className={o.color} />
              <text x="115" y={y + 20} className={o.textColor} fontSize="11" fontWeight="bold">Roll {o.faces}</text>
              <text x="195" y={y + 20} className="fill-gray-600 dark:fill-gray-300" fontSize="11">P = {o.prob}</text>
              <text x="275" y={y + 20} className="fill-gray-600 dark:fill-gray-300" fontSize="11">{o.label}</text>
              <text x="365" y={y + 20} className="fill-gray-600 dark:fill-gray-300" fontSize="11">Payout: {o.payout}</text>
              <text x="455" y={y + 20} className={o.textColor} fontSize="11" fontWeight="600">
                {i === 0 ? '×$0' : i === 1 ? '×$1' : '×$5'}
              </text>
            </g>
          );
        })}

        {/* Calculation box */}
        <rect x="45" y="162" width="410" height="78" rx="8" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        <text x="250" y="180" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Expected Value Calculation</text>

        <text x="250" y="198" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11">
          EV = (1/6)(5) + (3/6)(1) + (2/6)(0) − 2
        </text>
        <text x="250" y="215" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11">
          = 0.833 + 0.500 + 0 − 2.00
        </text>
        <text x="250" y="232" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="12" fontWeight="bold">
          EV = −$0.17 per game (you lose on average)
        </text>
      </svg>
    </div>
  );
}
