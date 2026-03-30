import { useState } from "react";

/* ── Pre-defined data points for each correlation type ── */

// Positive correlation: study hours vs test score (trending up-right)
const positivePoints = [
  { x: 12, y: 105 }, { x: 22, y: 90 }, { x: 35, y: 78 },
  { x: 48, y: 65 }, { x: 55, y: 58 }, { x: 65, y: 48 },
  { x: 72, y: 40 }, { x: 82, y: 30 }, { x: 95, y: 22 },
  { x: 105, y: 15 }, { x: 115, y: 10 },
];

// No correlation: random scatter
const nonePoints = [
  { x: 15, y: 25 }, { x: 30, y: 85 }, { x: 45, y: 40 },
  { x: 55, y: 100 }, { x: 65, y: 15 }, { x: 75, y: 60 },
  { x: 85, y: 95 }, { x: 95, y: 35 }, { x: 105, y: 70 },
  { x: 115, y: 50 }, { x: 50, y: 55 },
];

// Negative correlation: TV hours vs test score (trending down-right)
const negativePoints = [
  { x: 10, y: 12 }, { x: 20, y: 20 }, { x: 35, y: 30 },
  { x: 45, y: 42 }, { x: 55, y: 48 }, { x: 65, y: 58 },
  { x: 78, y: 68 }, { x: 85, y: 78 }, { x: 98, y: 88 },
  { x: 108, y: 95 }, { x: 118, y: 105 },
];

type HighlightType = "all" | "positive" | "none" | "negative";

const COLORS = {
  positive: "#22c55e",
  none: "#94a3b8",
  negative: "#ef4444",
};

/* ── One scatter plot ── */
function ScatterPlot({
  offsetX,
  points,
  color,
  label,
  xLabel,
  yLabel,
  trendLine,
  dimmed,
}: {
  offsetX: number;
  points: { x: number; y: number }[];
  color: string;
  label: string;
  xLabel: string;
  yLabel: string;
  trendLine?: { x1: number; y1: number; x2: number; y2: number };
  dimmed: boolean;
}) {
  const plotW = 130;
  const plotH = 120;
  const originX = offsetX + 20;
  const originY = 170;
  const opacity = dimmed ? 0.15 : 1;

  return (
    <g opacity={opacity} style={{ transition: "opacity 0.3s ease" }}>
      {/* Y axis */}
      <line
        x1={originX}
        y1={originY}
        x2={originX}
        y2={originY - plotH}
        stroke="#cbd5e1"
        strokeWidth={1}
      />
      {/* X axis */}
      <line
        x1={originX}
        y1={originY}
        x2={originX + plotW}
        y2={originY}
        stroke="#cbd5e1"
        strokeWidth={1}
      />

      {/* Axis labels */}
      <text
        x={originX + plotW / 2}
        y={originY + 14}
        textAnchor="middle"
        fontSize={10}
        fill="#64748b"
      >
        {xLabel}
      </text>
      <text
        x={originX - 10}
        y={originY - plotH / 2}
        textAnchor="middle"
        fontSize={10}
        fill="#64748b"
        transform={`rotate(-90, ${originX - 10}, ${originY - plotH / 2})`}
      >
        {yLabel}
      </text>

      {/* Trend line */}
      {trendLine && (
        <line
          x1={originX + trendLine.x1}
          y1={originY - trendLine.y1}
          x2={originX + trendLine.x2}
          y2={originY - trendLine.y2}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={0.7}
        />
      )}

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={originX + p.x}
          cy={originY - p.y}
          r={4}
          fill={color}
          stroke="#fff"
          strokeWidth={0.5}
        />
      ))}

      {/* Title label */}
      <text
        x={originX + plotW / 2}
        y={originY - plotH - 8}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={color}
      >
        {label}
      </text>
    </g>
  );
}

/* ── Main component ── */
export default function CorrelationDiagram() {
  const [active, setActive] = useState<HighlightType>("all");

  const buttons: { key: HighlightType; text: string; color: string }[] = [
    { key: "all", text: "Show All", color: "#334155" },
    { key: "positive", text: "Positive", color: COLORS.positive },
    { key: "none", text: "None", color: COLORS.none },
    { key: "negative", text: "Negative", color: COLORS.negative },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      {/* Control buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
        {buttons.map((b) => (
          <button
            key={b.key}
            onClick={() => setActive(b.key)}
            style={{
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: active === b.key ? 700 : 400,
              border: `2px solid ${b.color}`,
              borderRadius: 6,
              background: active === b.key ? b.color : "transparent",
              color: active === b.key ? "#fff" : b.color,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {b.text}
          </button>
        ))}
      </div>

      <svg
        viewBox="0 0 567 231"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ background: "#f8fafc", borderRadius: 8 }}
      >
        {/* Title */}
        <text x={270} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1e293b">
          Types of Correlation
        </text>

        {/* Positive correlation */}
        <ScatterPlot
          offsetX={10}
          points={positivePoints}
          color={COLORS.positive}
          label="Positive (r ≈ 0.9)"
          xLabel="Study hours"
          yLabel="Score"
          trendLine={{ x1: 8, y1: 108, x2: 120, y2: 8 }}
          dimmed={active !== "all" && active !== "positive"}
        />

        {/* No correlation */}
        <ScatterPlot
          offsetX={185}
          points={nonePoints}
          color={COLORS.none}
          label="None (r ≈ 0.0)"
          xLabel="Shoe size"
          yLabel="Score"
          dimmed={active !== "all" && active !== "none"}
        />

        {/* Negative correlation */}
        <ScatterPlot
          offsetX={360}
          points={negativePoints}
          color={COLORS.negative}
          label="Negative (r ≈ -0.8)"
          xLabel="TV hours"
          yLabel="Score"
          trendLine={{ x1: 8, y1: 8, x2: 120, y2: 108 }}
          dimmed={active !== "all" && active !== "negative"}
        />
      </svg>
    </div>
  );
}
