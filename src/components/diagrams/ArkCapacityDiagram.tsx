export default function ArkCapacityDiagram() {
  const categories = [
    { label: 'Tiny (<1 kg)', pct: 45, color: '#22c55e', ex: 'mice, frogs, songbirds' },
    { label: 'Small (1-10 kg)', pct: 35, color: '#3b82f6', ex: 'rabbits, ducks, lizards' },
    { label: 'Medium (10-100 kg)', pct: 12, color: '#f59e0b', ex: 'sheep, dogs, eagles' },
    { label: 'Large (100-1000 kg)', pct: 6, color: '#ef4444', ex: 'cattle, horses, bears' },
    { label: 'Mega (>1000 kg)', pct: 2, color: '#a855f7', ex: 'elephants, rhinos' },
  ];
  let y = 90;
  return (
    <svg viewBox="0 0 500 340" className="w-full max-w-lg mx-auto">
      <text x="250" y="25" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">Ark Capacity Breakdown</text>
      <text x="250" y="45" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">135 m x 22.5 m x 13.5 m = ~41,000 m³ | 3 decks</text>

      {/* Ark cross-section */}
      <g transform="translate(20, 60)">
        <path d="M 0 200 L 10 240 Q 60 260 120 260 Q 180 260 230 240 L 240 200 Z" fill="none" stroke="#b45309" strokeWidth="2" />
        {/* Deck lines */}
        <line x1="5" y1="200" x2="235" y2="200" stroke="#78350f" strokeWidth="1.5" />
        <line x1="12" y1="230" x2="228" y2="230" stroke="#78350f" strokeWidth="1.5" />
        {/* Roof */}
        <line x1="0" y1="200" x2="240" y2="200" stroke="#b45309" strokeWidth="2" />
        <path d="M 30 200 L 120 180 L 210 200" fill="none" stroke="#b45309" strokeWidth="1.5" />
        {/* Labels */}
        <text x="120" y="196" textAnchor="middle" fill="#fbbf24" fontSize="9">Upper deck — birds, small</text>
        <text x="120" y="218" textAnchor="middle" className="fill-gray-400 dark:fill-gray-400" fontSize="9">Middle deck — supplies</text>
        <text x="120" y="248" textAnchor="middle" fill="#93c5fd" fontSize="9">Lower deck — large animals</text>
      </g>

      {/* Size distribution bars */}
      {categories.map((cat, i) => {
        const row = y + i * 38;
        return (
          <g key={i}>
            <text x="290" y={row} className="fill-gray-400 dark:fill-gray-400" fontSize="10">{cat.label}</text>
            <rect x="290" y={row + 5} width={cat.pct * 1.8} height="12" fill={cat.color} rx="2" opacity="0.8" />
            <text x={295 + cat.pct * 1.8} y={row + 15} fill={cat.color} fontSize="9">{cat.pct}%</text>
            <text x="290" y={row + 28} className="fill-gray-500 dark:fill-gray-500" fontSize="8">{cat.ex}</text>
          </g>
        );
      })}

      <text x="380" y="80" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontWeight="bold">Species by body size</text>

      {/* Key stat */}
      <text x="250" y="330" textAnchor="middle" className="fill-gray-400 dark:fill-gray-400" fontSize="10">~35,000 land vertebrate species x 2 = 70,000 animals to house</text>
    </svg>
  );
}
