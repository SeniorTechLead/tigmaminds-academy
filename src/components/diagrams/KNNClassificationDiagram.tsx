import { useEffect, useState } from "react";

/* ── Data points ── */
const calmPoints = [
  { x: 120, y: 280 },
  { x: 160, y: 240 },
  { x: 140, y: 200 },
  { x: 180, y: 260 },
  { x: 200, y: 220 },
  { x: 100, y: 250 },
  { x: 220, y: 200 },
];

const nervousPoints = [
  { x: 300, y: 140 },
  { x: 340, y: 100 },
  { x: 280, y: 120 },
  { x: 360, y: 160 },
  { x: 320, y: 80 },
];

const dangerPoints = [
  { x: 400, y: 60 },
  { x: 420, y: 100 },
  { x: 440, y: 50 },
];

/* The unknown point */
const queryPt = { x: 240, y: 180 };

/* Three nearest neighbours (hand-picked for visual clarity) */
const neighbors = [
  { pt: calmPoints[4], cls: "Calm" },     // (200,220)
  { pt: calmPoints[6], cls: "Calm" },     // (220,200)
  { pt: nervousPoints[2], cls: "Nervous" }, // (280,120)
];

const kRadius = 85;

export default function KNNClassificationDiagram() {
  const [progress, setProgress] = useState(0); // 0 → 1

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200; // ms
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setProgress(t);
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const circleR = kRadius * progress;
  const lineProgress = Math.max(0, (progress - 0.5) * 2); // starts at 50%

  /* Axis geometry */
  const axisLeft = 60;
  const axisBottom = 360;
  const axisTop = 30;
  const axisRight = 470;

  return (
    <div className="w-full max-w-lg mx-auto my-6">
      <svg
        viewBox="0 0 525 441"
        className="w-full"
        role="img"
        aria-label="k-Nearest Neighbors classification diagram"
      >
        {/* ── Axes ── */}
        <line
          x1={axisLeft}
          y1={axisBottom}
          x2={axisRight}
          y2={axisBottom}
          className="stroke-gray-400 dark:stroke-gray-500"
          strokeWidth="1.5"
        />
        <line
          x1={axisLeft}
          y1={axisBottom}
          x2={axisLeft}
          y2={axisTop}
          className="stroke-gray-400 dark:stroke-gray-500"
          strokeWidth="1.5"
        />
        {/* X label */}
        <text
          x={(axisLeft + axisRight) / 2}
          y={393}
          textAnchor="middle"
          fontSize="12"
          className="fill-gray-600 dark:fill-gray-300"
          fontFamily="sans-serif"
        >
          Frequency (Hz)
        </text>
        {/* Y label */}
        <text
          x={16}
          y={(axisTop + axisBottom) / 2}
          textAnchor="middle"
          fontSize="12"
          className="fill-gray-600 dark:fill-gray-300"
          fontFamily="sans-serif"
          transform={`rotate(-90, 16, ${(axisTop + axisBottom) / 2})`}
        >
          Pulse rate
        </text>

        {/* ── Dashed k-radius circle ── */}
        <circle
          cx={queryPt.x}
          cy={queryPt.y}
          r={Math.max(0, circleR)}
          fill="none"
          className="stroke-gray-500 dark:stroke-gray-400"
          strokeWidth="1.5"
          strokeDasharray="5 3"
        />
        {progress > 0.8 && (
          <text
            x={queryPt.x + circleR + 6}
            y={queryPt.y - 4}
            fontSize="11"
            fontWeight="bold"
            className="fill-gray-600 dark:fill-gray-300"
            fontFamily="monospace"
          >
            k=3
          </text>
        )}

        {/* ── Connection lines to neighbors ── */}
        {neighbors.map((n, i) => {
          const dx = n.pt.x - queryPt.x;
          const dy = n.pt.y - queryPt.y;
          const endX = queryPt.x + dx * lineProgress;
          const endY = queryPt.y + dy * lineProgress;
          return (
            <line
              key={`line-${i}`}
              x1={queryPt.x}
              y1={queryPt.y}
              x2={endX}
              y2={endY}
              className={
                n.cls === "Calm"
                  ? "stroke-emerald-400 dark:stroke-emerald-500"
                  : "stroke-red-400 dark:stroke-red-500"
              }
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity={lineProgress}
            />
          );
        })}

        {/* ── Calm points (green) ── */}
        {calmPoints.map((p, i) => (
          <circle
            key={`calm-${i}`}
            cx={p.x}
            cy={p.y}
            r="8"
            className="fill-emerald-400 dark:fill-emerald-500 stroke-emerald-700 dark:stroke-emerald-300"
            strokeWidth="1.5"
          />
        ))}

        {/* ── Nervous points (red) ── */}
        {nervousPoints.map((p, i) => (
          <circle
            key={`nervous-${i}`}
            cx={p.x}
            cy={p.y}
            r="8"
            className="fill-red-400 dark:fill-red-500 stroke-red-700 dark:stroke-red-300"
            strokeWidth="1.5"
          />
        ))}

        {/* ── Danger points (orange) ── */}
        {dangerPoints.map((p, i) => (
          <circle
            key={`danger-${i}`}
            cx={p.x}
            cy={p.y}
            r="8"
            className="fill-orange-400 dark:fill-orange-500 stroke-orange-700 dark:stroke-orange-300"
            strokeWidth="1.5"
          />
        ))}

        {/* ── Query point (gray star with ?) ── */}
        <polygon
          points={starPoints(queryPt.x, queryPt.y, 14, 7, 5)}
          className="fill-gray-300 dark:fill-gray-600 stroke-gray-600 dark:stroke-gray-300"
          strokeWidth="1.5"
        />
        <text
          x={queryPt.x}
          y={queryPt.y + 5}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          className="fill-gray-800 dark:fill-gray-100 pointer-events-none"
          fontFamily="sans-serif"
        >
          ?
        </text>

        {/* ── Legend ── */}
        <g transform="translate(380, 280)">
          <circle cx="0" cy="0" r="6" className="fill-emerald-400 dark:fill-emerald-500" />
          <text x="12" y="4" fontSize="11" className="fill-gray-700 dark:fill-gray-300">
            Calm
          </text>
          <circle cx="0" cy="22" r="6" className="fill-red-400 dark:fill-red-500" />
          <text x="12" y="26" fontSize="11" className="fill-gray-700 dark:fill-gray-300">
            Nervous
          </text>
          <circle cx="0" cy="44" r="6" className="fill-orange-400 dark:fill-orange-500" />
          <text x="12" y="48" fontSize="11" className="fill-gray-700 dark:fill-gray-300">
            Danger
          </text>
        </g>

        {/* ── Vote result ── */}
        {progress >= 1 && (
          <g>
            <rect
              x={85}
              y={32}
              width={280}
              height={28}
              rx="6"
              className="fill-emerald-100/80 dark:fill-emerald-900/40 stroke-emerald-400 dark:stroke-emerald-600"
              strokeWidth="1"
            />
            <text
              x={225}
              y={51}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              className="fill-emerald-800 dark:fill-emerald-200"
              fontFamily="sans-serif"
            >
              2 Calm vs 1 Nervous → Prediction: Calm
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/* Utility: generate star polygon points string */
function starPoints(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  nPoints: number,
): string {
  const pts: string[] = [];
  for (let i = 0; i < nPoints * 2; i++) {
    const angle = (Math.PI * i) / nPoints - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(" ");
}
