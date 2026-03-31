export default function NEIndiaStatesDiagram() {
  const states = [
    { name: 'Arunachal Pradesh', year: '1987', area: '83,743', pop: '1.4M', color: '#3b82f6', x: 200, y: 80 },
    { name: 'Assam', year: '1947', area: '78,438', pop: '35.6M', color: '#22c55e', x: 200, y: 160 },
    { name: 'Meghalaya', year: '1972', area: '22,429', pop: '3.3M', color: '#8b5cf6', x: 110, y: 240 },
    { name: 'Nagaland', year: '1963', area: '16,579', pop: '2.3M', color: '#f59e0b', x: 380, y: 120 },
    { name: 'Manipur', year: '1972', area: '22,327', pop: '3.1M', color: '#ec4899', x: 380, y: 200 },
    { name: 'Mizoram', year: '1987', area: '21,081', pop: '1.2M', color: '#14b8a6', x: 240, y: 300 },
    { name: 'Tripura', year: '1972', area: '10,486', pop: '4.1M', color: '#f97316', x: 100, y: 320 },
    { name: 'Sikkim', year: '1975', area: '7,096', pop: '0.7M', color: '#6366f1', x: 80, y: 100 },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Timeline and data chart showing the seven sister states plus Sikkim, with year of statehood, area, and population"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          The Seven Sisters + One Brother
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Eight states carved over decades from one territory {'\u2014'} each with its own identity
        </text>

        {/* Timeline */}
        <line x1="50" y1="85" x2="50" y2="400" stroke="#64748b" strokeWidth="2" />

        {/* Timeline events */}
        {[
          { year: '1947', label: 'Independence: most NE = Assam', y: 92, color: '#22c55e' },
          { year: '1963', label: 'Nagaland (1st to separate)', y: 142, color: '#f59e0b' },
          { year: '1972', label: 'Meghalaya, Manipur, Tripura', y: 210, color: '#8b5cf6' },
          { year: '1975', label: 'Sikkim joins India', y: 275, color: '#6366f1' },
          { year: '1987', label: 'Arunachal Pradesh, Mizoram', y: 340, color: '#3b82f6' },
        ].map((evt, i) => (
          <g key={i}>
            <circle cx="50" cy={evt.y} r="6" fill={evt.color} />
            <text x="65" y={evt.y + 4} fontSize="12" fontWeight="700" fill={evt.color}>{evt.year}</text>
            <text x="120" y={evt.y + 4} fontSize="11" className="fill-gray-600 dark:fill-slate-300">{evt.label}</text>
          </g>
        ))}

        {/* State comparison table */}
        <g transform="translate(400, 75)">
          {/* Header */}
          <text x="0" y="0" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">State</text>
          <text x="150" y="0" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Area (km\u00B2)</text>
          <text x="270" y="0" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Population</text>
          <line x1="-10" y1="8" x2="350" y2="8" stroke="#64748b" strokeWidth="0.5" />

          {states.map((s, i) => (
            <g key={s.name}>
              <rect x="-15" y={15 + i * 36} width="370" height="32" rx="4" fill={s.color} fillOpacity={i % 2 === 0 ? 0.05 : 0.02} />
              <circle cx="0" cy={30 + i * 36} r="5" fill={s.color} />
              <text x="12" y={34 + i * 36} fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{s.name}</text>
              <text x="150" y={34 + i * 36} fontSize="11" className="fill-gray-500 dark:fill-slate-400">{s.area}</text>
              <text x="270" y={34 + i * 36} fontSize="11" className="fill-gray-500 dark:fill-slate-400">{s.pop}</text>
            </g>
          ))}
        </g>

        {/* Bottom insight */}
        <rect x="60" y="410" width="660" height="55" rx="10" fill="#f59e0b" fillOpacity="0.08" stroke="#f59e0b" strokeWidth="1" />
        <text x="390" y="430" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-800 dark:fill-amber-200">
          Why 8 states? Each community fought for self-governance
        </text>
        <text x="390" y="450" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-amber-300">
          Mountains and rivers created natural isolation {'\u2192'} distinct languages, cultures, identities {'\u2192'} demand for separate states
        </text>
      </svg>
    </div>
  );
}
