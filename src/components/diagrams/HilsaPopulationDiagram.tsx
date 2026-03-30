/* HilsaPopulationDiagram – Overfishing, MSY, and population collapse */

// Logistic growth with different harvest rates
const K = 200; // carrying capacity (visual units)
const r = 0.25;
const years = 40;

function simulate(harvestFraction: number): number[] {
  const pop = [180];
  for (let t = 1; t < years; t++) {
    const N = pop[t - 1];
    const growth = r * N * (1 - N / K);
    const harvest = harvestFraction * N;
    pop.push(Math.max(N + growth - harvest, 0));
  }
  return pop;
}

const scenarios = [
  { rate: 0, label: 'No fishing', color: '#22c55e' },
  { rate: 0.05, label: '5% harvest (sustainable)', color: '#3b82f6' },
  { rate: 0.12, label: '12% harvest (at MSY)', color: '#f59e0b' },
  { rate: 0.25, label: '25% harvest (collapse)', color: '#ef4444' },
];

const simData = scenarios.map(s => ({ ...s, data: simulate(s.rate) }));

// Map to SVG coords
const plotL = 70, plotR = 540, plotT = 55, plotB = 220;

function toX(t: number) { return plotL + (t / (years - 1)) * (plotR - plotL); }
function toY(n: number) { return plotB - (n / K) * (plotB - plotT); }

function makePath(data: number[]): string {
  return data.map((n, t) => `${t === 0 ? 'M' : 'L'}${toX(t).toFixed(1)},${toY(n).toFixed(1)}`).join(' ');
}

export default function HilsaPopulationDiagram() {
  return (
    <svg
      viewBox="0 0 592 310"
      className="w-full max-w-lg mx-auto my-6"
      role="img"
      aria-label="Overfishing simulation: population under no fishing, sustainable harvest, MSY, and overfishing collapse"
    >
      {/* Title */}
      <text x="296" y="20" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
        Overfishing &mdash; When We Take Too Much
      </text>
      <text x="296" y="36" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
        Same river, four fishing strategies, very different outcomes
      </text>

      {/* Axes */}
      <line x1={plotL} y1={plotT - 5} x2={plotL} y2={plotB + 5} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.2" />
      <line x1={plotL - 5} y1={plotB} x2={plotR + 5} y2={plotB} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.2" />

      <text x={plotL - 8} y={(plotT + plotB) / 2} textAnchor="middle" transform={`rotate(-90,${plotL - 8},${(plotT + plotB) / 2})`} fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">
        Fish Population
      </text>
      <text x={(plotL + plotR) / 2} y={plotB + 22} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-gray-300">
        Years
      </text>

      {/* Carrying capacity line */}
      <line x1={plotL} y1={toY(K)} x2={plotR} y2={toY(K)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
      <text x={plotR + 4} y={toY(K) + 3} fontSize="8" className="fill-gray-500 dark:fill-gray-400">K</text>

      {/* Grid lines */}
      {[10, 20, 30].map(t => (
        <g key={t}>
          <line x1={toX(t)} y1={plotT} x2={toX(t)} y2={plotB} stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
          <text x={toX(t)} y={plotB + 12} textAnchor="middle" fontSize="7" className="fill-gray-400 dark:fill-gray-500">{t}</text>
        </g>
      ))}

      {/* Population curves */}
      {simData.map((s, i) => (
        <path key={i} d={makePath(s.data)} fill="none" stroke={s.color} strokeWidth="2" opacity="0.85" />
      ))}

      {/* Legend */}
      {simData.map((s, i) => (
        <g key={i} transform={`translate(80, ${245 + i * 15})`}>
          <line x1="0" y1="0" x2="18" y2="0" stroke={s.color} strokeWidth="2.5" />
          <text x="24" y="3.5" fontSize="9" className="fill-gray-600 dark:fill-gray-300">{s.label}</text>
        </g>
      ))}

      {/* MSY annotation */}
      <text x={plotR - 10} y={toY(simulate(0.12)[years - 1]) - 8} textAnchor="end" fontSize="8" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
        MSY: maximum
      </text>
      <text x={plotR - 10} y={toY(simulate(0.12)[years - 1]) + 2} textAnchor="end" fontSize="8" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
        sustainable yield
      </text>

      {/* Collapse annotation */}
      <text x={toX(25)} y={toY(0) + 14} textAnchor="middle" fontSize="8" fontWeight="600" className="fill-red-500 dark:fill-red-400">
        Population collapse!
      </text>
    </svg>
  );
}
