/* FishRiverHealthDiagram – River health indicators: fish behavior as signals, pollution, citizen science */

const indicators = [
  { label: 'Healthy', color: '#22c55e', bg: '#22c55e12', do2: '8\u201312', behavior: 'Normal swimming, occasional jumps', species: 'Mahseer, hilsa, mayfly larvae', signal: 'High biodiversity, clear water' },
  { label: 'Stressed', color: '#f59e0b', bg: '#f59e0b12', do2: '4\u20136', behavior: 'Frequent surface gasping, clustering at rapids', species: 'Catfish, snails, some algae', signal: 'Fewer sensitive species, mild odour' },
  { label: 'Degraded', color: '#ef4444', bg: '#ef444412', do2: '<2', behavior: 'Mass jumping, fish kills, surface gulping', species: 'Tubifex worms, rat-tail maggots', signal: 'Foul smell, foam, only tolerant species' },
];

const ciSciSteps = [
  { step: '1. Observe', detail: 'Count jumps per 10 min at the same spot', color: '#3b82f6' },
  { step: '2. Record', detail: 'Date, time, temperature, weather, water colour', color: '#22c55e' },
  { step: '3. Compare', detail: 'Track changes week over week, season over season', color: '#f59e0b' },
  { step: '4. Report', detail: 'Share data with local fisheries or pollution board', color: '#a855f7' },
];

export default function FishRiverHealthDiagram() {
  return (
    <svg
      viewBox="0 0 592 420"
      className="w-full max-w-lg mx-auto my-6"
      role="img"
      aria-label="River health indicators showing how fish behavior signals water quality, with a citizen science observation protocol"
    >
      {/* Title */}
      <text x="296" y="20" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
        River Health Indicators
      </text>
      <text x="296" y="36" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
        Fish behaviour tells you what instruments cannot
      </text>

      {/* Health zones */}
      {indicators.map((ind, i) => {
        const y = 50 + i * 75;
        return (
          <g key={i}>
            <rect x="20" y={y} width="350" height="65" rx="6" fill={ind.bg} stroke={ind.color} strokeWidth="1" />
            <circle cx="36" cy={y + 14} r="6" fill={ind.color} opacity="0.3" />
            <text x="36" y={y + 18} textAnchor="middle" fontSize="10" fontWeight="700" fill={ind.color}>
              {i === 0 ? '\u2714' : i === 1 ? '\u26A0' : '\u2716'}
            </text>
            <text x="52" y={y + 18} fontSize="11" fontWeight="700" fill={ind.color}>{ind.label}</text>
            <text x="160" y={y + 18} fontSize="8" className="fill-gray-500 dark:fill-gray-400">DO\u2082: {ind.do2} mg/L</text>

            <text x="34" y={y + 33} fontSize="8" className="fill-gray-600 dark:fill-gray-300">
              Behaviour: {ind.behavior}
            </text>
            <text x="34" y={y + 45} fontSize="8" className="fill-gray-600 dark:fill-gray-300">
              Indicator species: {ind.species}
            </text>
            <text x="34" y={y + 57} fontSize="7" fontStyle="italic" fill={ind.color}>
              Signal: {ind.signal}
            </text>
          </g>
        );
      })}

      {/* Pollution sources arrow */}
      <text x="210" y="290" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">
        Common Threats
      </text>
      {['Industrial discharge', 'Agricultural runoff', 'Sewage', 'Deforestation (silt)'].map((t, i) => (
        <g key={i}>
          <circle cx={50 + i * 105} cy="308" r="4" fill="#ef4444" opacity="0.4" />
          <text x={50 + i * 105} y="322" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
            {t}
          </text>
        </g>
      ))}

      {/* RIGHT: Citizen Science */}
      <rect x="388" y="50" width="190" height="270" rx="8" className="fill-blue-50 dark:fill-blue-950" stroke="#3b82f6" strokeWidth="1" />
      <text x="483" y="70" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">
        Citizen Science
      </text>
      <text x="483" y="84" textAnchor="middle" fontSize="8" className="fill-blue-600 dark:fill-blue-400">
        You can monitor your river
      </text>

      {ciSciSteps.map((s, i) => {
        const y = 98 + i * 52;
        return (
          <g key={i}>
            <circle cx="408" cy={y + 10} r="10" fill={s.color} opacity="0.15" />
            <text x="408" y={y + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill={s.color}>
              {i + 1}
            </text>
            <text x="424" y={y + 10} fontSize="9" fontWeight="600" fill={s.color}>{s.step}</text>
            <text x="424" y={y + 24} fontSize="7" className="fill-gray-600 dark:fill-gray-300">{s.detail}</text>
            {i < 3 && (
              <line x1="408" y1={y + 28} x2="408" y2={y + 42} stroke={s.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
            )}
          </g>
        );
      })}

      {/* Bottom summary */}
      <rect x="40" y="345" width="512" height="60" rx="6" className="fill-green-50 dark:fill-green-950" stroke="#22c55e" strokeWidth="1" />
      <text x="296" y="365" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-700 dark:fill-green-300">
        Fish are living sensors \u2014 their behaviour responds to changes before instruments detect them
      </text>
      <text x="296" y="382" textAnchor="middle" fontSize="9" className="fill-green-600 dark:fill-green-400">
        If fish jump more than usual, something in the river has changed. Investigate.
      </text>
      <text x="296" y="397" textAnchor="middle" fontSize="8" fontStyle="italic" className="fill-gray-500 dark:fill-gray-400">
        Indigenous fishermen have tracked these patterns for generations \u2014 modern ecology confirms their knowledge
      </text>
    </svg>
  );
}
