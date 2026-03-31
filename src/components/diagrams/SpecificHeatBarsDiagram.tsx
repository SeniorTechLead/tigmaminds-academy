export default function SpecificHeatBarsDiagram() {
  const data = [
    { name: 'Water', cp: 4186, color: '#3b82f6', note: 'Takes ages to heat up' },
    { name: 'Wood', cp: 1700, color: '#22c55e', note: '' },
    { name: 'Charcoal', cp: 1000, color: '#6b7280', note: 'Low density = little stored energy' },
    { name: 'Iron', cp: 450, color: '#ef4444', note: '' },
    { name: 'Copper', cp: 385, color: '#f59e0b', note: 'Heats and cools fast' },
  ];

  const maxBar = 380;

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Specific heat capacity comparison showing water stores the most heat energy per kilogram">
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Specific Heat Capacity</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Energy needed to raise 1 kg by 1\u00B0C (J/kg\u00B7K) \u2014 higher = stores more heat</text>

        {data.map((d, i) => {
          const barW = (d.cp / 4186) * maxBar;
          const y = 75 + i * 50;
          return (
            <g key={i}>
              <text x="100" y={y + 20} textAnchor="end" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{d.name}</text>
              <rect x="115" y={y + 4} width={barW} height="26" rx="4" fill={d.color} opacity="0.35" />
              <rect x="115" y={y + 4} width={barW} height="26" rx="4" fill="none" stroke={d.color} strokeWidth="1.5" />
              <text x={123 + barW} y={y + 22} fontSize="11" fontWeight="500" fill={d.color}>{d.cp.toLocaleString()}</text>
              {d.note && <text x={123 + barW + 50} y={y + 22} fontSize="10" className="fill-gray-500 dark:fill-slate-400">{d.note}</text>}
            </g>
          );
        })}

        {/* Key insight */}
        <rect x="100" y="330" width="500" height="30" rx="6" className="fill-blue-50 dark:fill-blue-900/15" stroke="#3b82f6" strokeWidth="1" />
        <text x="350" y="350" textAnchor="middle" fontSize="11" className="fill-gray-700 dark:fill-slate-200">Charcoal at 500\u00B0C stores far less energy per cm\u00B3 than iron at the same temperature \u2014 your foot cools it quickly</text>
      </svg>
    </div>
  );
}
