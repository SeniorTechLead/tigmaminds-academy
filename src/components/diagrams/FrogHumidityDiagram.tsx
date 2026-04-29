export default function FrogHumidityDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="How humidity carries sound further: moist air transmits sound better than dry air"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-cyan-600 dark:fill-cyan-400">
          Why Frogs Call After Rain: Humidity Carries Sound
        </text>

        {/* Split comparison: Dry vs Humid */}
        <line x1="350" y1="55" x2="350" y2="380" className="stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" strokeDasharray="6 4" />

        {/* DRY SIDE */}
        <text x="175" y="72" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Dry Air (40% humidity)
        </text>

        {/* Frog calling */}
        <circle cx="80" cy="220" r="20" className="fill-emerald-200 dark:fill-emerald-800" stroke="#065f46" strokeWidth="1.5" />
        <text x="80" y="224" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-emerald-800 dark:fill-emerald-200">🐸</text>

        {/* Sound waves - fading quickly */}
        {[1, 2, 3, 4].map((i) => (
          <path key={`dry${i}`}
            d={`M ${80 + i * 50} ${220 - 20 + i * 2} Q ${80 + i * 50 + 10} ${220} ${80 + i * 50} ${220 + 20 - i * 2}`}
            fill="none" stroke="#f59e0b" strokeWidth={2.5 - i * 0.5} opacity={0.8 - i * 0.18} />
        ))}

        {/* Absorption markers */}
        {[140, 190, 230].map((x, i) => (
          <g key={`abs${i}`}>
            <text x={x} y="180" textAnchor="middle" fontSize="16" className="fill-red-400 dark:fill-red-500">×</text>
          </g>
        ))}

        <text x="175" y="300" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Dry air absorbs high-
        </text>
        <text x="175" y="314" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          frequency sound faster
        </text>
        <text x="175" y="340" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
          Sound fades after ~30 m
        </text>

        {/* HUMID SIDE */}
        <text x="525" y="72" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-cyan-600 dark:fill-cyan-400">
          Humid Air (90%+ humidity)
        </text>

        {/* Frog calling */}
        <circle cx="390" cy="220" r="20" className="fill-emerald-200 dark:fill-emerald-800" stroke="#065f46" strokeWidth="1.5" />
        <text x="390" y="224" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-emerald-800 dark:fill-emerald-200">🐸</text>

        {/* Sound waves - travelling far */}
        {[1, 2, 3, 4, 5].map((i) => (
          <path key={`humid${i}`}
            d={`M ${390 + i * 45} ${220 - 22 + i * 1} Q ${390 + i * 45 + 10} ${220} ${390 + i * 45} ${220 + 22 - i * 1}`}
            fill="none" stroke="#06b6d4" strokeWidth={2.5 - i * 0.3} opacity={0.85 - i * 0.12} />
        ))}

        {/* Water droplet icons */}
        {[430, 470, 510, 550, 590].map((x, i) => (
          <text key={`drop${i}`} x={x} y="170" textAnchor="middle" fontSize="10" className="fill-cyan-400 dark:fill-cyan-500" opacity="0.5">
            💧
          </text>
        ))}

        <text x="525" y="300" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Moist air absorbs less
        </text>
        <text x="525" y="314" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          sound energy per metre
        </text>
        <text x="525" y="340" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-cyan-600 dark:fill-cyan-400">
          Sound carries ~100 m+
        </text>

        {/* Bottom insight */}
        <rect x="60" y="390" width="580" height="56" rx="8" className="fill-cyan-50 dark:fill-cyan-950/30 stroke-cyan-200 dark:stroke-cyan-800" strokeWidth="1" />
        <text x="350" y="412" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-cyan-700 dark:fill-cyan-300">
          After rain, humidity spikes above 80% → sound travels 2–3× further
        </text>
        <text x="350" y="430" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Frogs call when conditions maximize their range — not to predict rain, but to exploit it
        </text>
      </svg>
    </div>
  );
}
