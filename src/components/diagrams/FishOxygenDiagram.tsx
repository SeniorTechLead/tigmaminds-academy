/* FishOxygenDiagram – Dissolved oxygen: how fish breathe, gills, warm vs cold water O₂ */

const tempData = [
  { temp: 5, do2: 12.8, color: '#3b82f6', label: '5\u00B0C' },
  { temp: 10, do2: 11.3, color: '#06b6d4', label: '10\u00B0C' },
  { temp: 15, do2: 10.1, color: '#22c55e', label: '15\u00B0C' },
  { temp: 20, do2: 9.1, color: '#f59e0b', label: '20\u00B0C' },
  { temp: 25, do2: 8.2, color: '#f97316', label: '25\u00B0C' },
  { temp: 30, do2: 7.5, color: '#ef4444', label: '30\u00B0C' },
  { temp: 35, do2: 6.9, color: '#dc2626', label: '35\u00B0C' },
];

const barMaxH = 100;
const barW = 36;
const barGap = 14;
const barBaseY = 245;
const maxDO = 14;

export default function FishOxygenDiagram() {
  return (
    <svg
      viewBox="0 0 592 360"
      className="w-full max-w-lg mx-auto my-6"
      role="img"
      aria-label="Dissolved oxygen diagram showing how gills work and how warm water holds less oxygen than cold water"
    >
      {/* Title */}
      <text x="296" y="20" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
        Dissolved Oxygen \u2014 Fish Need to Breathe Too
      </text>
      <text x="296" y="36" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
        Gills extract O\u2082 dissolved in water \u2014 but warmer water holds less
      </text>

      {/* LEFT: Gill cross-section */}
      <text x="130" y="58" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
        How Gills Extract Oxygen
      </text>

      {/* Water flow arrow */}
      <path d="M30,110 L230,110" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowBlue)" opacity="0.6" />
      <text x="130" y="104" textAnchor="middle" fontSize="8" className="fill-blue-500 dark:fill-blue-400">
        Water flow (O\u2082 rich) \u2192
      </text>

      {/* Gill arch */}
      <rect x="55" y="120" width="150" height="80" rx="8" className="fill-blue-50 dark:fill-blue-950" stroke="#3b82f6" strokeWidth="1" />
      <text x="130" y="136" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">
        Gill Filament
      </text>

      {/* Lamellae — thin folds */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const x = 70 + i * 22;
        return (
          <g key={i}>
            <rect x={x} y="142" width="14" height="46" rx="3" fill="#ef444430" stroke="#ef4444" strokeWidth="0.8" />
            {/* Blood flow arrows (opposite to water) */}
            <line x1={x + 7} y1="186" x2={x + 7} y2="144" stroke="#ef4444" strokeWidth="1" markerEnd="url(#arrowRed)" />
          </g>
        );
      })}
      <text x="130" y="205" textAnchor="middle" fontSize="8" className="fill-red-500 dark:fill-red-400">
        \u2190 Blood flow (countercurrent)
      </text>

      {/* O₂ diffusion arrows */}
      {[0, 1, 2].map(i => {
        const x = 81 + i * 44;
        return (
          <g key={`o2-${i}`}>
            <text x={x} y="158" textAnchor="middle" fontSize="7" fontWeight="700" className="fill-green-600 dark:fill-green-400">O\u2082</text>
            <line x1={x} y1="160" x2={x} y2="170" stroke="#22c55e" strokeWidth="1" strokeDasharray="2,2" />
            <text x={x} y="178" textAnchor="middle" fontSize="6" className="fill-green-500 dark:fill-green-400">\u2193</text>
          </g>
        );
      })}

      {/* Key insight */}
      <rect x="20" y="218" width="225" height="35" rx="5" className="fill-green-50 dark:fill-green-950" stroke="#22c55e" strokeWidth="1" />
      <text x="132" y="234" textAnchor="middle" fontSize="8" className="fill-green-700 dark:fill-green-300">
        Countercurrent flow extracts up to 80\u201390%
      </text>
      <text x="132" y="246" textAnchor="middle" fontSize="8" className="fill-green-700 dark:fill-green-300">
        of dissolved O\u2082 \u2014 far better than lungs (~25%)
      </text>

      {/* RIGHT: Temperature vs DO bar chart */}
      <text x="430" y="58" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
        Warm Water = Less Oxygen
      </text>

      {/* Y axis */}
      <line x1="290" y1={barBaseY} x2="290" y2={barBaseY - barMaxH - 15} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
      {[0, 4, 8, 12].map(v => {
        const y = barBaseY - (v / maxDO) * barMaxH;
        return (
          <g key={v}>
            <line x1="286" y1={y} x2="290" y2={y} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
            <text x="282" y={y + 3} textAnchor="end" fontSize="8" className="fill-gray-500 dark:fill-gray-400">{v}</text>
          </g>
        );
      })}
      <text x="275" y={barBaseY - barMaxH / 2} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400" transform={`rotate(-90, 275, ${barBaseY - barMaxH / 2})`}>
        mg/L
      </text>

      {/* Bars */}
      {tempData.map((d, i) => {
        const x = 300 + i * (barW + barGap);
        const h = (d.do2 / maxDO) * barMaxH;
        return (
          <g key={i}>
            <rect x={x} y={barBaseY - h} width={barW} height={h} rx="3" fill={d.color} opacity="0.75" />
            <text x={x + barW / 2} y={barBaseY - h - 4} textAnchor="middle" fontSize="8" fontWeight="600" fill={d.color}>
              {d.do2}
            </text>
            <text x={x + barW / 2} y={barBaseY + 12} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
              {d.label}
            </text>
          </g>
        );
      })}

      {/* X axis label */}
      <text x="430" y={barBaseY + 26} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">
        Water Temperature
      </text>

      {/* Stress zone */}
      <line x1="300" y1={barBaseY - (4 / maxDO) * barMaxH} x2={300 + 7 * (barW + barGap) - barGap} y2={barBaseY - (4 / maxDO) * barMaxH} stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" />
      <text x={300 + 7 * (barW + barGap) - barGap + 4} y={barBaseY - (4 / maxDO) * barMaxH + 3} fontSize="7" className="fill-red-500 dark:fill-red-400">
        Stress
      </text>
      <text x={300 + 7 * (barW + barGap) - barGap + 4} y={barBaseY - (4 / maxDO) * barMaxH + 12} fontSize="7" className="fill-red-500 dark:fill-red-400">
        zone
      </text>

      {/* Bottom summary */}
      <rect x="80" y="300" width="432" height="45" rx="6" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1" />
      <text x="296" y="318" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
        When dissolved O\u2082 drops below ~4 mg/L, fish gasp at the surface or jump
      </text>
      <text x="296" y="334" textAnchor="middle" fontSize="9" className="fill-amber-600 dark:fill-amber-400">
        Hot summers + pollution + algal blooms = less oxygen = stressed fish
      </text>

      {/* Arrow markers */}
      <defs>
        <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#3b82f6" />
        </marker>
        <marker id="arrowRed" markerWidth="6" markerHeight="5" refX="3" refY="5" orient="auto">
          <path d="M0,0 L3,5 L6,0" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}
