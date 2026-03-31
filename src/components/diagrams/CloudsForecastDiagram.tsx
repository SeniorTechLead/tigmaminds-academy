export default function CloudsForecastDiagram() {
  const w = 720;
  const h = 500;

  const methods = [
    {
      x: 40,
      y: 70,
      w: 200,
      h: 170,
      title: "Cloud Reading (Traditional)",
      color: "#fbbf24",
      items: [
        "Cirrus → rain in 1–2 days",
        "Building cumulus → afternoon storm",
        "Low stratus → drizzle",
        'Dawan\'s method: learn "personalities"',
      ],
    },
    {
      x: 260,
      y: 70,
      w: 200,
      h: 170,
      title: "Barometric Pressure",
      color: "#60a5fa",
      items: [
        "Falling pressure → storm coming",
        "Rising pressure → clearing skies",
        "Rapid drop → severe weather",
        "Measured with barometer (hPa)",
      ],
    },
    {
      x: 480,
      y: 70,
      w: 210,
      h: 170,
      title: "Numerical Weather Models",
      color: "#a78bfa",
      items: [
        "3D grid of atmosphere cells",
        "Solve fluid dynamics equations",
        "40 million observations/day",
        "Accurate to ~5 days for detail",
      ],
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        role="img"
        aria-label="Weather forecasting: three methods compared. Cloud reading is traditional observation, barometric pressure uses instruments, and numerical weather models use computers to solve equations"
      >
        <rect width={w} height={h} rx="10" className="fill-slate-950" />

        {/* Title */}
        <text x={w / 2} y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f0f9ff">
          How We Predict Weather
        </text>
        <text x={w / 2} y="50" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Three approaches — from Dawan’s cloud journal to supercomputers
        </text>

        {/* Three method boxes */}
        {methods.map((m) => (
          <g key={m.title}>
            <rect x={m.x} y={m.y} width={m.w} height={m.h} rx="8" className="fill-gray-100 dark:fill-slate-800" stroke={m.color} strokeWidth="1.5" />
            <text x={m.x + m.w / 2} y={m.y + 22} textAnchor="middle" fontSize="12" fontWeight="700" fill={m.color}>
              {m.title}
            </text>
            <line x1={m.x + 10} y1={m.y + 32} x2={m.x + m.w - 10} y2={m.y + 32} stroke={m.color} strokeWidth="0.5" strokeOpacity="0.4" />
            {m.items.map((item, i) => (
              <text key={i} x={m.x + 14} y={m.y + 50 + i * 18} fontSize="10" className="fill-gray-600 dark:fill-slate-300">
                {"• " + item}
              </text>
            ))}
          </g>
        ))}

        {/* Accuracy timeline */}
        <rect x="40" y="270" width="650" height="100" rx="8" className="fill-white dark:fill-slate-950" fillOpacity="0.8" />
        <text x={w / 2} y="290" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">
          Forecast Accuracy Over Time
        </text>

        {/* Timeline axis */}
        <line x1="80" y1="340" x2="660" y2="340" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
        {[
          { label: "Now", x: 80, acc: "99%" },
          { label: "1 day", x: 195, acc: "95%" },
          { label: "3 days", x: 310, acc: "85%" },
          { label: "5 days", x: 425, acc: "70%" },
          { label: "10 days", x: 540, acc: "50%" },
          { label: "14+ days", x: 655, acc: "?" },
        ].map((t) => (
          <g key={t.label}>
            <line x1={t.x} y1={335} x2={t.x} y2={345} stroke="#94a3b8" strokeWidth="1.5" />
            <text x={t.x} y="358" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              {t.label}
            </text>
            <text x={t.x} y="322" textAnchor="middle" fontSize="11" fontWeight="600" fill="#4ade80">
              {t.acc}
            </text>
          </g>
        ))}

        {/* Accuracy bar — gradient from green to red */}
        <defs>
          <linearGradient id="cf-acc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <rect x="80" y="308" width="575" height="6" rx="3" fill="url(#cf-acc)" fillOpacity="0.5" />

        {/* Why forecasts go wrong */}
        <rect x="40" y="385" width="310" height="100" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="195" y="405" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f87171">
          Why Forecasts Go Wrong
        </text>
        <text x="55" y="425" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
          {"• The atmosphere is chaotic — tiny errors grow fast"}
        </text>
        <text x="55" y="441" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
          {"• We can’t measure every air molecule"}
        </text>
        <text x="55" y="457" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
          {"• Oceans, mountains, cities all add complexity"}
        </text>
        <text x="55" y="473" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
          {"• After ~10 days, prediction ≈ coin flip"}
        </text>

        {/* Ensemble models */}
        <rect x="370" y="385" width="320" height="100" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="530" y="405" textAnchor="middle" fontSize="12" fontWeight="700" fill="#a78bfa">
          Ensemble Models
        </text>
        <text x="385" y="425" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
          {"• Run the same model 50 times"}
        </text>
        <text x="385" y="441" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
          {"• Each time with slightly different start"}
        </text>
        <text x="385" y="457" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
          {"• If all 50 agree → high confidence"}
        </text>
        <text x="385" y="473" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
          {"• If they scatter → uncertain forecast"}
        </text>

        {/* Ensemble fan illustration */}
        {[0, 1, 2, 3, 4].map((i) => {
          const spread = (i - 2) * 5;
          return (
            <path
              key={i}
              d={`M580,410 Q610,${420 + spread} 640,${415 + spread * 2}`}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1"
              strokeOpacity={0.3 + i * 0.15}
            />
          );
        })}
      </svg>
    </div>
  );
}
