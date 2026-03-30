// Pre-compute exponential curve: y = A * e^(r*x)
const expPoints = Array.from({ length: 100 }, (_, i) => {
  const t = i / 99; // 0..1
  const x = 60 + t * 390; // plot area x: 60..450
  const raw = 2 * Math.exp(4.5 * t); // grows from ~2 to ~180
  const y = 260 - (raw / 200) * 220; // map to SVG y (260 = bottom, 40 = top)
  return { x, y: Math.max(y, 20) }; // clamp so it doesn't fly above viewBox
});

// Pre-compute logistic S-curve: y = K / (1 + e^(-r*(x - x0)))
const K = 150; // carrying capacity in raw units
const logisticPoints = Array.from({ length: 100 }, (_, i) => {
  const t = i / 99;
  const x = 60 + t * 390;
  const raw = K / (1 + Math.exp(-10 * (t - 0.45)));
  const y = 260 - (raw / 200) * 220;
  return { x, y };
});

const toPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

const expPath = toPath(expPoints);
const logPath = toPath(logisticPoints);

// Approximate path lengths for stroke-dasharray animation
const EXP_LEN = 620;
const LOG_LEN = 520;

// Carrying capacity line y-position (K mapped to SVG y)
const kY = 260 - (K / 200) * 220; // ~95

export default function PopulationGrowthCurve() {
  return (
    <>
      <style>{`
        @keyframes drawExp {
          from { stroke-dashoffset: ${EXP_LEN}; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drawLog {
          from { stroke-dashoffset: ${LOG_LEN}; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      <svg
        viewBox="0 0 592 342"
        className="w-full max-w-lg mx-auto my-6"
        role="img"
        aria-label="Population growth curves: exponential vs logistic, showing carrying capacity K = 300 sangai"
      >
        {/* --- Axes --- */}
        {/* Y-axis */}
        <line x1="60" y1="30" x2="60" y2="270" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        {/* X-axis */}
        <line x1="60" y1="260" x2="460" y2="260" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

        {/* Axis labels */}
        <text
          x="25" y="150"
          textAnchor="middle"
          transform="rotate(-90,25,150)"
          className="fill-gray-600 dark:fill-gray-300"
          fontSize="12"
          fontWeight="600"
        >
          Population
        </text>
        <text
          x="260" y="292"
          textAnchor="middle"
          className="fill-gray-600 dark:fill-gray-300"
          fontSize="12"
          fontWeight="600"
        >
          Time
        </text>

        {/* --- Carrying capacity dashed line --- */}
        <line
          x1="60" y1={kY} x2="460" y2={kY}
          className="stroke-gray-500 dark:stroke-gray-400"
          strokeWidth="1.2"
          strokeDasharray="6,4"
        />
        <text
          x="462" y={kY - 6}
          className="fill-gray-600 dark:fill-gray-300"
          fontSize="9"
          fontWeight="600"
        >
          Carrying capacity (K)
        </text>
        <text
          x="462" y={kY + 8}
          className="fill-gray-500 dark:fill-gray-400"
          fontSize="8"
          fontStyle="italic"
        >
          K = 300 sangai
        </text>

        {/* --- Exponential curve --- */}
        <path
          d={expPath}
          fill="none"
          className="stroke-rose-500"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={EXP_LEN}
          strokeDashoffset="0"
          style={{ animation: "drawExp 2s ease-out forwards" }}
        />

        {/* --- Logistic curve --- */}
        <path
          d={logPath}
          fill="none"
          className="stroke-emerald-500"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={LOG_LEN}
          strokeDashoffset="0"
          style={{ animation: "drawLog 2.4s ease-out forwards" }}
        />

        {/* --- Annotations --- */}
        {/* Exponential label — positioned near the steep rise */}
        <text
          x="340" y="48"
          className="fill-rose-600 dark:fill-rose-400"
          fontSize="9"
          fontWeight="600"
        >
          Exponential: unlimited resources
        </text>

        {/* Logistic label — positioned near the levelling-off zone */}
        <text
          x="320" y={kY + 24}
          className="fill-emerald-600 dark:fill-emerald-400"
          fontSize="9"
          fontWeight="600"
        >
          Logistic: resources limited
        </text>
      </svg>
    </>
  );
}
