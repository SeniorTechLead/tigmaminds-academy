import { useState } from "react";

interface Example {
  freq: number;
  pulse: number;
  result: string;
  path: string[];
  color: string;
  highlightClass: string;
  arrowFill: string;
}

const examples: Example[] = [
  {
    freq: 45,
    pulse: 2.0,
    result: "DANGER",
    path: ["start", "d1", "d1-yes", "danger"],
    color: "#ef4444",
    highlightClass: "stroke-red-500",
    arrowFill: "fill-red-500",
  },
  {
    freq: 80,
    pulse: 0.5,
    result: "CALM",
    path: ["start", "d1", "d1-no", "d2", "d2-yes", "d3", "d3-yes", "calm"],
    color: "#22c55e",
    highlightClass: "stroke-emerald-500",
    arrowFill: "fill-emerald-500",
  },
  {
    freq: 120,
    pulse: 1.5,
    result: "NERVOUS",
    path: ["start", "d1", "d1-no", "d2", "d2-no", "nervous"],
    color: "#f97316",
    highlightClass: "stroke-orange-500",
    arrowFill: "fill-orange-500",
  },
];

function isActive(path: string[], ...ids: string[]) {
  return ids.every((id) => path.includes(id));
}

function opacity(path: string[], ...ids: string[]) {
  return isActive(path, ...ids) ? 1 : 0.5;
}

function strokeColor(path: string[], ex: Example, ...ids: string[]) {
  return isActive(path, ...ids) ? ex.color : "#9ca3af";
}

/* Reusable arrow marker (placed inside a <defs>) */
function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 540 456"
      refX="10"
      refY="3.5"
      markerWidth="8"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <polygon points="0 0, 10 3.5, 0 7" fill={color} />
    </marker>
  );
}

export default function FlowchartDiagram() {
  const [idx, setIdx] = useState(0);
  const ex = examples[idx];
  const p = ex.path;

  return (
    <div className="my-6">
      <svg
        viewBox="0 0 500 450"
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label="Flowchart showing if/elif/else decision logic for classifying elephant mood"
      >
        <defs>
          <ArrowMarker id="ah-active" color={ex.color} />
          <ArrowMarker id="ah-dim" color="#9ca3af" />
        </defs>

        {/* ============ START ============ */}
        <g opacity={opacity(p, "start")}>
          <rect
            x="170"
            y="8"
            width="160"
            height="36"
            rx="18"
            className="fill-emerald-100 dark:fill-emerald-900/40"
            stroke={strokeColor(p, ex, "start")}
            strokeWidth="2"
          />
          <text
            x="250"
            y="32"
            textAnchor="middle"
            className="fill-emerald-800 dark:fill-emerald-200"
            fontSize="13"
            fontWeight="600"
            fontFamily="monospace"
          >
            New rumble detected
          </text>
        </g>

        {/* Arrow: start → d1 */}
        <line
          x1="250"
          y1="44"
          x2="250"
          y2="72"
          stroke={strokeColor(p, ex, "d1")}
          strokeWidth="2"
          opacity={opacity(p, "d1")}
          markerEnd={
            isActive(p, "d1") ? "url(#ah-active)" : "url(#ah-dim)"
          }
        />

        {/* ============ DIAMOND 1: frequency < 60? ============ */}
        <g opacity={opacity(p, "d1")}>
          <polygon
            points="250,72 340,112 250,152 160,112"
            className="fill-sky-50 dark:fill-sky-900/30"
            stroke={strokeColor(p, ex, "d1")}
            strokeWidth="2"
          />
          <text
            x="250"
            y="109"
            textAnchor="middle"
            className="fill-sky-800 dark:fill-sky-200"
            fontSize="12"
            fontWeight="600"
            fontFamily="monospace"
          >
            frequency &lt; 60?
          </text>
        </g>

        {/* ---- D1 YES → DANGER (left) ---- */}
        {/* Horizontal line left from diamond */}
        <line
          x1="160"
          y1="112"
          x2="80"
          y2="112"
          stroke={strokeColor(p, ex, "d1-yes")}
          strokeWidth="2"
          opacity={opacity(p, "d1-yes")}
        />
        {/* Vertical line down to DANGER box */}
        <line
          x1="80"
          y1="112"
          x2="80"
          y2="145"
          stroke={strokeColor(p, ex, "d1-yes")}
          strokeWidth="2"
          opacity={opacity(p, "d1-yes")}
          markerEnd={
            isActive(p, "d1-yes") ? "url(#ah-active)" : "url(#ah-dim)"
          }
        />
        <text
          x="118"
          y="105"
          textAnchor="middle"
          className="fill-gray-800 dark:fill-gray-200"
          fontSize="13"
          fontWeight="700"
          fontFamily="monospace"
          opacity={opacity(p, "d1-yes")}
        >
          Yes
        </text>

        {/* DANGER box */}
        <g opacity={opacity(p, "danger")}>
          <rect
            x="30"
            y="150"
            width="100"
            height="36"
            rx="4"
            className="fill-red-100 dark:fill-red-900/40"
            stroke={strokeColor(p, ex, "danger")}
            strokeWidth="2"
          />
          <text
            x="80"
            y="174"
            textAnchor="middle"
            className="fill-red-700 dark:fill-red-300"
            fontSize="14"
            fontWeight="bold"
            fontFamily="monospace"
          >
            DANGER
          </text>
        </g>

        {/* ---- D1 NO → D2 (down) ---- */}
        <line
          x1="250"
          y1="152"
          x2="250"
          y2="188"
          stroke={strokeColor(p, ex, "d1-no", "d2")}
          strokeWidth="2"
          opacity={opacity(p, "d1-no")}
          markerEnd={
            isActive(p, "d1-no") ? "url(#ah-active)" : "url(#ah-dim)"
          }
        />
        <text
          x="264"
          y="168"
          className="fill-gray-800 dark:fill-gray-200"
          fontSize="13"
          fontWeight="700"
          fontFamily="monospace"
          opacity={opacity(p, "d1-no")}
        >
          No
        </text>

        {/* ============ DIAMOND 2: frequency < 95? ============ */}
        <g opacity={opacity(p, "d2")}>
          <polygon
            points="250,188 340,228 250,268 160,228"
            className="fill-sky-50 dark:fill-sky-900/30"
            stroke={strokeColor(p, ex, "d2")}
            strokeWidth="2"
          />
          <text
            x="250"
            y="225"
            textAnchor="middle"
            className="fill-sky-800 dark:fill-sky-200"
            fontSize="12"
            fontWeight="600"
            fontFamily="monospace"
          >
            frequency &lt; 95?
          </text>
        </g>

        {/* ---- D2 NO → NERVOUS (right) ---- */}
        <line
          x1="340"
          y1="228"
          x2="410"
          y2="228"
          stroke={strokeColor(p, ex, "d2-no")}
          strokeWidth="2"
          opacity={opacity(p, "d2-no")}
        />
        <line
          x1="410"
          y1="228"
          x2="410"
          y2="261"
          stroke={strokeColor(p, ex, "d2-no")}
          strokeWidth="2"
          opacity={opacity(p, "d2-no")}
          markerEnd={
            isActive(p, "d2-no") ? "url(#ah-active)" : "url(#ah-dim)"
          }
        />
        <text
          x="378"
          y="222"
          textAnchor="middle"
          className="fill-gray-800 dark:fill-gray-200"
          fontSize="13"
          fontWeight="700"
          fontFamily="monospace"
          opacity={opacity(p, "d2-no")}
        >
          No
        </text>

        {/* NERVOUS box */}
        <g opacity={opacity(p, "nervous")}>
          <rect
            x="360"
            y="266"
            width="100"
            height="36"
            rx="4"
            className="fill-orange-100 dark:fill-orange-900/40"
            stroke={strokeColor(p, ex, "nervous")}
            strokeWidth="2"
          />
          <text
            x="410"
            y="290"
            textAnchor="middle"
            className="fill-orange-700 dark:fill-orange-300"
            fontSize="14"
            fontWeight="bold"
            fontFamily="monospace"
          >
            NERVOUS
          </text>
        </g>

        {/* ---- D2 YES → D3 (down) ---- */}
        <line
          x1="250"
          y1="268"
          x2="250"
          y2="304"
          stroke={strokeColor(p, ex, "d2-yes", "d3")}
          strokeWidth="2"
          opacity={opacity(p, "d2-yes")}
          markerEnd={
            isActive(p, "d2-yes") ? "url(#ah-active)" : "url(#ah-dim)"
          }
        />
        <text
          x="232"
          y="288"
          textAnchor="end"
          className="fill-gray-800 dark:fill-gray-200"
          fontSize="13"
          fontWeight="700"
          fontFamily="monospace"
          opacity={opacity(p, "d2-yes")}
        >
          Yes
        </text>

        {/* ============ DIAMOND 3: pulse_rate < 1.0? ============ */}
        <g opacity={opacity(p, "d3")}>
          <polygon
            points="250,304 340,344 250,384 160,344"
            className="fill-sky-50 dark:fill-sky-900/30"
            stroke={strokeColor(p, ex, "d3")}
            strokeWidth="2"
          />
          <text
            x="250"
            y="341"
            textAnchor="middle"
            className="fill-sky-800 dark:fill-sky-200"
            fontSize="12"
            fontWeight="600"
            fontFamily="monospace"
          >
            pulse_rate &lt; 1.0?
          </text>
        </g>

        {/* ---- D3 YES → CALM (left) ---- */}
        <line
          x1="160"
          y1="344"
          x2="80"
          y2="344"
          stroke={strokeColor(p, ex, "d3-yes")}
          strokeWidth="2"
          opacity={opacity(p, "d3-yes")}
        />
        <line
          x1="80"
          y1="344"
          x2="80"
          y2="377"
          stroke={strokeColor(p, ex, "d3-yes")}
          strokeWidth="2"
          opacity={opacity(p, "d3-yes")}
          markerEnd={
            isActive(p, "d3-yes") ? "url(#ah-active)" : "url(#ah-dim)"
          }
        />
        <text
          x="118"
          y="337"
          textAnchor="middle"
          className="fill-gray-800 dark:fill-gray-200"
          fontSize="13"
          fontWeight="700"
          fontFamily="monospace"
          opacity={opacity(p, "d3-yes")}
        >
          Yes
        </text>

        {/* CALM box */}
        <g opacity={opacity(p, "calm")}>
          <rect
            x="30"
            y="382"
            width="100"
            height="36"
            rx="4"
            className="fill-emerald-100 dark:fill-emerald-900/40"
            stroke={strokeColor(p, ex, "calm")}
            strokeWidth="2"
          />
          <text
            x="80"
            y="406"
            textAnchor="middle"
            className="fill-emerald-700 dark:fill-emerald-300"
            fontSize="14"
            fontWeight="bold"
            fontFamily="monospace"
          >
            CALM
          </text>
        </g>

        {/* ---- D3 NO → ALERT (right) ---- */}
        <line
          x1="340"
          y1="344"
          x2="410"
          y2="344"
          stroke={strokeColor(p, ex, "d3-no")}
          strokeWidth="2"
          opacity={opacity(p, "d3-no")}
        />
        <line
          x1="410"
          y1="344"
          x2="410"
          y2="377"
          stroke={strokeColor(p, ex, "d3-no")}
          strokeWidth="2"
          opacity={opacity(p, "d3-no")}
          markerEnd={
            isActive(p, "d3-no") ? "url(#ah-active)" : "url(#ah-dim)"
          }
        />
        <text
          x="378"
          y="337"
          textAnchor="middle"
          className="fill-gray-800 dark:fill-gray-200"
          fontSize="13"
          fontWeight="700"
          fontFamily="monospace"
          opacity={opacity(p, "d3-no")}
        >
          No
        </text>

        {/* ALERT box */}
        <g opacity={opacity(p, "d3-no")}>
          <rect
            x="360"
            y="382"
            width="100"
            height="36"
            rx="4"
            className="fill-amber-100 dark:fill-amber-900/40"
            stroke={strokeColor(p, ex, "d3-no")}
            strokeWidth="2"
          />
          <text
            x="410"
            y="406"
            textAnchor="middle"
            className="fill-amber-700 dark:fill-amber-300"
            fontSize="14"
            fontWeight="bold"
            fontFamily="monospace"
          >
            ALERT
          </text>
        </g>
      </svg>

      {/* Controls below the diagram */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
          freq = {ex.freq}, pulse_rate = {ex.pulse} →{" "}
          <span className="font-bold" style={{ color: ex.color }}>
            {ex.result}
          </span>
        </p>
        <button
          onClick={() => setIdx((i) => (i + 1) % examples.length)}
          className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Next example
        </button>
      </div>
    </div>
  );
}
