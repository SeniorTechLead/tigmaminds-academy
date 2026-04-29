/* HilsaRiverHealthDiagram – River health indicators: dissolved oxygen, indicator species, water quality */

const zones = [
  { label: 'Healthy River', color: '#22c55e', bg: '#22c55e15', do2: '8-12 mg/L', temp: '18-24°C', species: ['Hilsa', 'Mahseer', 'Mayfly larvae', 'Freshwater mussels'], verdict: 'High biodiversity = clean water' },
  { label: 'Stressed River', color: '#f59e0b', bg: '#f59e0b15', do2: '4-6 mg/L', temp: '26-30°C', species: ['Catfish', 'Snails', 'Some algae'], verdict: 'Fewer sensitive species' },
  { label: 'Polluted River', color: '#ef4444', bg: '#ef444415', do2: '<2 mg/L', temp: '>32°C', species: ['Tubifex worms', 'Rat-tail maggots', 'Blue-green algae'], verdict: 'Only pollution-tolerant species survive' },
];

// DO2 bar chart data
const doLevels = [
  { label: 'Healthy', value: 10, color: '#22c55e' },
  { label: 'Stressed', value: 5, color: '#f59e0b' },
  { label: 'Polluted', value: 1.5, color: '#ef4444' },
];

const barW = 50, barGap = 30, barBase = 200, barMaxH = 110;
const barStartX = 400;

export default function HilsaRiverHealthDiagram() {
  return (
    <svg
      viewBox="0 0 592 340"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="River health indicators: dissolved oxygen levels, water temperature, and indicator species for healthy, stressed, and polluted rivers"
    >
      {/* Title */}
      <text x="296" y="20" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
        River Health = Fish Health
      </text>
      <text x="296" y="36" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
        Dissolved oxygen and indicator species tell the story
      </text>

      {/* Zone cards */}
      {zones.map((z, i) => {
        const y = 52 + i * 95;
        return (
          <g key={i}>
            <rect x="20" y={y} width="340" height="85" rx="6" fill={z.bg} stroke={z.color} strokeWidth="1" opacity="0.8" />
            {/* Zone title */}
            <circle cx="36" cy={y + 14} r="5" fill={z.color} />
            <text x="48" y={y + 18} fontSize="11" fontWeight="700" fill={z.color}>{z.label}</text>

            {/* Metrics */}
            <text x="34" y={y + 35} fontSize="9" className="fill-gray-600 dark:fill-gray-300">
              Dissolved O₂: <tspan fontWeight="600">{z.do2}</tspan>
            </text>
            <text x="34" y={y + 48} fontSize="9" className="fill-gray-600 dark:fill-gray-300">
              Temperature: <tspan fontWeight="600">{z.temp}</tspan>
            </text>

            {/* Species */}
            <text x="200" y={y + 18} fontSize="8" fontWeight="600" className="fill-gray-500 dark:fill-gray-400">Indicator species:</text>
            {z.species.map((sp, j) => (
              <text key={j} x="200" y={y + 30 + j * 11} fontSize="8" className="fill-gray-600 dark:fill-gray-300">
                • {sp}
              </text>
            ))}

            {/* Verdict */}
            <text x="34" y={y + 73} fontSize="8" fontStyle="italic" fill={z.color}>
              {z.verdict}
            </text>
          </g>
        );
      })}

      {/* DO2 bar chart */}
      <text x={barStartX + 75} y="55" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">
        Dissolved Oxygen
      </text>
      <text x={barStartX + 75} y="67" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
        (mg/L)
      </text>

      {/* Y-axis */}
      <line x1={barStartX - 5} y1={barBase} x2={barStartX - 5} y2={barBase - barMaxH - 10} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
      {[0, 4, 8, 12].map(v => {
        const y = barBase - (v / 12) * barMaxH;
        return (
          <g key={v}>
            <line x1={barStartX - 8} y1={y} x2={barStartX - 3} y2={y} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.8" />
            <text x={barStartX - 12} y={y + 3} textAnchor="end" fontSize="7" className="fill-gray-500 dark:fill-gray-400">{v}</text>
          </g>
        );
      })}

      {/* Bars */}
      {doLevels.map((d, i) => {
        const x = barStartX + i * (barW + barGap);
        const h = (d.value / 12) * barMaxH;
        return (
          <g key={i}>
            <rect x={x} y={barBase - h} width={barW} height={h} rx="3" fill={d.color} opacity="0.75" />
            <text x={x + barW / 2} y={barBase - h - 5} textAnchor="middle" fontSize="8" fontWeight="600" fill={d.color}>
              {d.value}
            </text>
            <text x={x + barW / 2} y={barBase + 12} textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
              {d.label}
            </text>
          </g>
        );
      })}

      {/* Fish survival threshold */}
      <line x1={barStartX - 5} y1={barBase - (4 / 12) * barMaxH} x2={barStartX + 3 * (barW + barGap)} y2={barBase - (4 / 12) * barMaxH} stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" />
      <text x={barStartX + 3 * (barW + barGap) + 2} y={barBase - (4 / 12) * barMaxH + 3} fontSize="7" className="fill-red-500 dark:fill-red-400">
        Fish stress
      </text>
      <text x={barStartX + 3 * (barW + barGap) + 2} y={barBase - (4 / 12) * barMaxH + 12} fontSize="7" className="fill-red-500 dark:fill-red-400">
        threshold
      </text>

      {/* Key insight */}
      <rect x="370" y="230" width="200" height="65" rx="6" className="fill-blue-50 dark:fill-blue-950" stroke="#3b82f6" strokeWidth="0.8" opacity="0.8" />
      <text x="470" y="248" textAnchor="middle" fontSize="9" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">Key Insight</text>
      <text x="470" y="262" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Fish are biological sensors.</text>
      <text x="470" y="274" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Presence of hilsa = healthy river.</text>
      <text x="470" y="286" textAnchor="middle" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Absence = investigate pollution.</text>

      {/* Bottom note */}
      <text x="296" y="330" textAnchor="middle" fontSize="10" fontStyle="italic" className="fill-gray-400 dark:fill-gray-500">
        Hilsa need {'>'}6 mg/L dissolved oxygen and {'<'}28°C water to thrive
      </text>
    </svg>
  );
}
