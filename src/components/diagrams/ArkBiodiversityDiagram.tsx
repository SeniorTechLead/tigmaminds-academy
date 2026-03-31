export default function ArkBiodiversityDiagram() {
  const levels = [
    { label: 'Domain', ex: 'Eukarya', w: 380, color: '#a855f7' },
    { label: 'Kingdom', ex: 'Animalia', w: 340, color: '#8b5cf6' },
    { label: 'Phylum', ex: 'Chordata', w: 300, color: '#6366f1' },
    { label: 'Class', ex: 'Mammalia', w: 260, color: '#3b82f6' },
    { label: 'Order', ex: 'Carnivora', w: 220, color: '#0ea5e9' },
    { label: 'Family', ex: 'Canidae', w: 180, color: '#14b8a6' },
    { label: 'Genus', ex: 'Canis', w: 140, color: '#22c55e' },
    { label: 'Species', ex: 'C. lupus (wolf)', w: 100, color: '#eab308' },
  ];
  return (
    <svg viewBox="0 0 500 340" className="w-full max-w-lg mx-auto">
      <text x="250" y="22" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">Taxonomy — Classifying Life</text>
      <text x="250" y="40" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">8.7 million species, organised into 8 levels</text>

      {levels.map((lv, i) => {
        const y = 55 + i * 32;
        const x = (500 - lv.w) / 2;
        return (
          <g key={i}>
            <rect x={x} y={y} width={lv.w} height="24" rx="4" fill={lv.color} opacity="0.2" stroke={lv.color} strokeWidth="1" />
            <text x={x + 8} y={y + 16} fill={lv.color} fontSize="10" fontWeight="bold">{lv.label}</text>
            <text x={x + lv.w - 8} y={y + 16} textAnchor="end" className="fill-gray-400 dark:fill-gray-400" fontSize="10">{lv.ex}</text>
          </g>
        );
      })}

      {/* Keystone callout */}
      <g transform="translate(50, 318)">
        <circle cx="0" cy="-5" r="6" fill="#ef4444" opacity="0.6" />
        <text x="12" y="-1" fill="#f87171" fontSize="10" fontWeight="bold">Keystone species</text>
        <text x="180" y="-1" className="fill-gray-500 dark:fill-gray-400" fontSize="9">— remove one, and the whole ecosystem shifts</text>
      </g>
    </svg>
  );
}
