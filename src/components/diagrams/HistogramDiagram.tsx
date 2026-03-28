import { useState } from "react";

type Distribution = "normal" | "right-skewed" | "left-skewed";

const distributions: Record<
  Distribution,
  { heights: number[]; label: string; description: string; barColor: string; curveColor: string }
> = {
  normal: {
    heights: [2, 5, 9, 14, 14, 9, 5, 2],
    label: "Normal (Bell Curve)",
    description: "Most values near the center \u2014 symmetric",
    barColor: "#60a5fa",
    curveColor: "#2563eb",
  },
  "right-skewed": {
    heights: [14, 11, 8, 6, 4, 3, 2, 1],
    label: "Right-Skewed",
    description: "Long tail to the right \u2014 few very high values",
    barColor: "#fbbf24",
    curveColor: "#d97706",
  },
  "left-skewed": {
    heights: [1, 2, 3, 4, 6, 8, 11, 14],
    label: "Left-Skewed",
    description: "Long tail to the left \u2014 few very low values",
    barColor: "#a78bfa",
    curveColor: "#7c3aed",
  },
};

const binLabels = ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80"];

const MARGIN = { top: 40, right: 20, bottom: 50, left: 50 };
const CHART_W = 432; // 8 bars * 50 + 7 gaps * 4 = 428, rounded up
const CHART_H = 200;
const SVG_W = MARGIN.left + CHART_W + MARGIN.right;
const SVG_H = MARGIN.top + CHART_H + MARGIN.bottom;
const BAR_W = 50;
const GAP = 4;
const MAX_VAL = 14;

function buildCurvePath(heights: number[]): string {
  // Generate smooth cubic bezier through the midpoints of each bar top
  const points = heights.map((h, i) => {
    const x = MARGIN.left + i * (BAR_W + GAP) + BAR_W / 2;
    const y = MARGIN.top + CHART_H - (h / MAX_VAL) * CHART_H;
    return { x, y };
  });

  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpx1 = curr.x + (next.x - curr.x) / 3;
    const cpx2 = next.x - (next.x - curr.x) / 3;
    d += ` C ${cpx1} ${curr.y}, ${cpx2} ${next.y}, ${next.x} ${next.y}`;
  }

  return d;
}

export default function HistogramDiagram() {
  const [active, setActive] = useState<Distribution>("normal");
  const dist = distributions[active];

  const yTicks = [0, 4, 8, 12, 16];

  return (
    <div style={{ width: "100%", maxWidth: 560, margin: "0 auto" }}>
      {/* Toggle buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
        {(Object.keys(distributions) as Distribution[]).map((key) => {
          const d = distributions[key];
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: isActive ? `2px solid ${d.curveColor}` : "2px solid #d1d5db",
                background: isActive ? d.barColor + "30" : "#f9fafb",
                color: isActive ? d.curveColor : "#374151",
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Description */}
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: dist.curveColor,
          fontWeight: 600,
          margin: "0 0 8px",
          minHeight: 20,
        }}
      >
        {dist.description}
      </p>

      {/* SVG chart */}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: "block" }}>
        {/* Y-axis */}
        <line
          x1={MARGIN.left}
          y1={MARGIN.top}
          x2={MARGIN.left}
          y2={MARGIN.top + CHART_H}
          className="stroke-gray-500 dark:stroke-gray-400"
          strokeWidth={1.5}
        />
        {/* Y-axis label */}
        <text
          x={14}
          y={MARGIN.top + CHART_H / 2}
          textAnchor="middle"
          fontSize={11}
          className="fill-gray-500 dark:fill-gray-400"
          transform={`rotate(-90, 14, ${MARGIN.top + CHART_H / 2})`}
        >
          Frequency
        </text>
        {/* Y ticks */}
        {yTicks.map((val) => {
          const y = MARGIN.top + CHART_H - (val / MAX_VAL) * CHART_H;
          return (
            <g key={val}>
              <line x1={MARGIN.left - 4} y1={y} x2={MARGIN.left} y2={y} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth={1} />
              <text x={MARGIN.left - 7} y={y + 3.5} textAnchor="end" fontSize={10} className="fill-gray-500 dark:fill-gray-400">
                {val}
              </text>
              {/* Grid line */}
              <line
                x1={MARGIN.left}
                y1={y}
                x2={MARGIN.left + CHART_W}
                y2={y}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth={0.5}
              />
            </g>
          );
        })}

        {/* X-axis */}
        <line
          x1={MARGIN.left}
          y1={MARGIN.top + CHART_H}
          x2={MARGIN.left + CHART_W}
          y2={MARGIN.top + CHART_H}
          className="stroke-gray-500 dark:stroke-gray-400"
          strokeWidth={1.5}
        />
        {/* X-axis label */}
        <text
          x={MARGIN.left + CHART_W / 2}
          y={SVG_H - 4}
          textAnchor="middle"
          fontSize={11}
          className="fill-gray-500 dark:fill-gray-400"
        >
          Score ranges
        </text>

        {/* Bars */}
        {dist.heights.map((h, i) => {
          const barH = (h / MAX_VAL) * CHART_H;
          const x = MARGIN.left + i * (BAR_W + GAP);
          const y = MARGIN.top + CHART_H - barH;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={BAR_W}
                height={barH}
                rx={4}
                ry={4}
                fill={dist.barColor}
                opacity={0.75}
                style={{ transition: "all 0.4s ease" }}
              />
              {/* Clip the rounded bottom by covering it */}
              <rect
                x={x}
                y={MARGIN.top + CHART_H - Math.min(barH, 4)}
                width={BAR_W}
                height={Math.min(barH, 4)}
                fill={dist.barColor}
                opacity={0.75}
                style={{ transition: "all 0.4s ease" }}
              />
              {/* Bin label */}
              <text
                x={x + BAR_W / 2}
                y={MARGIN.top + CHART_H + 14}
                textAnchor="middle"
                fontSize={10}
                className="fill-gray-500 dark:fill-gray-400"
              >
                {binLabels[i]}
              </text>
            </g>
          );
        })}

        {/* Smooth curve overlay */}
        <path
          d={buildCurvePath(dist.heights)}
          fill="none"
          stroke={dist.curveColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "all 0.4s ease" }}
        />
      </svg>
    </div>
  );
}
