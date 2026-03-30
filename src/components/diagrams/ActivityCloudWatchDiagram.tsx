export default function ActivityCloudWatchDiagram() {
  const w = 720;
  const h = 500;

  const days = [
    { day: "Mon AM", cloud: "wispy", weather: "Sunny", color: "#fbbf24", correct: true },
    { day: "Mon PM", cloud: "puffy", weather: "Sunny", color: "#fbbf24", correct: true },
    { day: "Tue AM", cloud: "flat grey", weather: "Drizzle", color: "#60a5fa", correct: true },
    { day: "Tue PM", cloud: "towers", weather: "Thunderstorm", color: "#a78bfa", correct: true },
    { day: "Wed AM", cloud: "clearing", weather: "Partly sunny", color: "#86efac", correct: true },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        role="img"
        aria-label="Cloud journal activity: observe clouds morning and evening for five days, draw what you see, note the weather that follows, and look for patterns"
      >
        <rect width={w} height={h} rx="10" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x={w / 2} y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-amber-500">
          Try This: Keep a Cloud Journal (5 Days)
        </text>
        <text x={w / 2} y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: a notebook, a pencil, and a window with a view of the sky
        </text>

        {/* Materials / instructions */}
        <rect x="30" y="70" width="320" height="140" rx="8" className="fill-amber-50 dark:fill-amber-950/30" stroke="#fbbf24" strokeWidth="1" />
        <text x="45" y="92" fontSize="13" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">
          How To Do It
        </text>
        {[
          "\u2460 Look at the sky every morning and evening",
          "\u2461 Draw what you see \u2014 shape, height, colour",
          "\u2462 Write one word: puffy, flat, wispy, towering",
          "\u2463 Record the weather that follows",
          "\u2464 After 5 days, look for patterns!",
        ].map((step, i) => (
          <text key={i} x="45" y={112 + i * 18} fontSize="11" className="fill-gray-700 dark:fill-slate-300">
            {step}
          </text>
        ))}

        {/* Questions to ask yourself */}
        <rect x="370" y="70" width="320" height="140" rx="8" className="fill-sky-50 dark:fill-sky-950/30" stroke="#38bdf8" strokeWidth="1" />
        <text x="385" y="92" fontSize="13" fontWeight="700" className="fill-sky-700 dark:fill-sky-300">
          Questions to Answer
        </text>
        {[
          "Did wispy clouds lead to rain later?",
          "Did tall towers always bring storms?",
          "What cloud shape meant sunny weather?",
          "Were your predictions better than guessing?",
          "Could you name clouds like Dawan did?",
        ].map((q, i) => (
          <text key={i} x="385" y={112 + i * 18} fontSize="11" className="fill-gray-700 dark:fill-slate-300">
            {"\u2022 " + q}
          </text>
        ))}

        {/* Example journal page */}
        <rect x="30" y="225" width="660" height="40" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x={w / 2} y="250" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-200">
          Example Journal Entries
        </text>

        {/* Journal rows */}
        {days.map((d, i) => {
          const y = 278 + i * 40;
          return (
            <g key={d.day}>
              <rect x="30" y={y} width="660" height="36" rx="4" className={i % 2 === 0 ? "fill-gray-50 dark:fill-slate-900" : "fill-white dark:fill-slate-950"} />
              {/* Day */}
              <text x="45" y={y + 22} fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
                {d.day}
              </text>
              {/* Cloud drawing placeholder */}
              <rect x="140" y={y + 6} width="80" height="24" rx="12" fill={d.color} fillOpacity="0.15" stroke={d.color} strokeWidth="1" />
              <text x="180" y={y + 23} textAnchor="middle" fontSize="10" fill={d.color} fontWeight="600">
                {d.cloud}
              </text>
              {/* Weather */}
              <text x="260" y={y + 22} fontSize="11" className="fill-gray-600 dark:fill-slate-400">
                {"\u2192 " + d.weather}
              </text>
              {/* Prediction */}
              <text x="430" y={y + 22} fontSize="10" className="fill-gray-500 dark:fill-slate-500">
                {i === 0
                  ? "Cirrus = rain in 1\u20132 days?"
                  : i === 1
                    ? "Fair cumulus = staying sunny"
                    : i === 2
                      ? "Grey sheet = drizzle coming"
                      : i === 3
                        ? "Towering = storm by evening"
                        : "Breaking up = clearing"}
              </text>
              {/* Checkmark */}
              <text x="650" y={y + 22} fontSize="14" fill={d.correct ? "#4ade80" : "#f87171"}>
                {d.correct ? "\u2713" : "\u2717"}
              </text>
            </g>
          );
        })}

        {/* Bottom tip */}
        <rect x="30" y={h - 28} width="660" height="22" rx="4" className="fill-emerald-50 dark:fill-emerald-950/30" />
        <text x={w / 2} y={h - 12} textAnchor="middle" fontSize="11" className="fill-emerald-700 dark:fill-emerald-400" fontWeight="600">
          Science tip: Dawan became accurate because he observed every day \u2014 pattern recognition takes practice, not equipment
        </text>
      </svg>
    </div>
  );
}
