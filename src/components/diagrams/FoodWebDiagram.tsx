import { useState } from "react";

interface Organism {
  id: string;
  label: string;
  x: number;
  y: number;
  level: "producer" | "primary" | "predator";
}

const organisms: Organism[] = [
  // Producers (bottom)
  { id: "grass", label: "Elephant Grass", x: 100, y: 330, level: "producer" },
  { id: "rice", label: "Rice Paddy", x: 270, y: 330, level: "producer" },
  { id: "bamboo", label: "Bamboo", x: 440, y: 330, level: "producer" },
  // Primary consumers (middle)
  { id: "rhino", label: "Rhino", x: 120, y: 210, level: "primary" },
  { id: "deer", label: "Deer", x: 300, y: 210, level: "primary" },
  { id: "insects", label: "Insects", x: 460, y: 210, level: "primary" },
  // Predators (top)
  { id: "tiger", label: "Tiger", x: 180, y: 90, level: "predator" },
  { id: "eagle", label: "Eagle", x: 380, y: 90, level: "predator" },
];

// Arrows: [source, consumer] — energy flows from source upward to consumer
const connections: [string, string][] = [
  ["grass", "rhino"],
  ["grass", "deer"],
  ["rice", "deer"],
  ["rice", "insects"],
  ["bamboo", "insects"],
  ["bamboo", "rhino"],
  ["rhino", "tiger"],
  ["deer", "tiger"],
  ["deer", "eagle"],
  ["insects", "eagle"],
];

const levelColors = {
  producer: {
    fill: "fill-emerald-500 dark:fill-emerald-600",
    stroke: "stroke-emerald-700 dark:stroke-emerald-400",
    text: "fill-emerald-950 dark:fill-emerald-100",
    highlight: "fill-emerald-300 dark:fill-emerald-400",
  },
  primary: {
    fill: "fill-amber-400 dark:fill-amber-600",
    stroke: "stroke-amber-600 dark:stroke-amber-400",
    text: "fill-amber-950 dark:fill-amber-100",
    highlight: "fill-amber-200 dark:fill-amber-300",
  },
  predator: {
    fill: "fill-rose-500 dark:fill-rose-600",
    stroke: "stroke-rose-700 dark:stroke-rose-400",
    text: "fill-rose-950 dark:fill-rose-100",
    highlight: "fill-rose-300 dark:fill-rose-400",
  },
};

const RADIUS = 28;

function getOrg(id: string) {
  return organisms.find((o) => o.id === id)!;
}

export default function FoodWebDiagram() {
  const [selected, setSelected] = useState<string | null>(null);

  const connectedIds = new Set<string>();
  const activeConnections = new Set<string>();
  if (selected) {
    connectedIds.add(selected);
    connections.forEach(([src, dst]) => {
      if (src === selected || dst === selected) {
        connectedIds.add(src);
        connectedIds.add(dst);
        activeConnections.add(`${src}-${dst}`);
      }
    });
  }

  function isHighlighted(id: string) {
    return selected === null || connectedIds.has(id);
  }

  function isArrowHighlighted(src: string, dst: string) {
    return selected === null || activeConnections.has(`${src}-${dst}`);
  }

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label="NE India food web diagram showing energy flow from producers to predators"
      >
        <defs>
          <marker
            id="fw-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 1 L 8 5 L 0 9 z"
              className="fill-gray-500 dark:fill-gray-400"
            />
          </marker>
          <marker
            id="fw-arrow-active"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" className="fill-sky-500" />
          </marker>
          {/* Energy gradient bar */}
          <linearGradient id="energy-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* Trophic level bands */}
        <rect x="50" y="55" width="430" height="70" rx="8" className="fill-rose-500/5 dark:fill-rose-400/5" />
        <rect x="50" y="175" width="430" height="70" rx="8" className="fill-amber-500/5 dark:fill-amber-400/5" />
        <rect x="50" y="295" width="430" height="70" rx="8" className="fill-emerald-500/5 dark:fill-emerald-400/5" />

        {/* Level labels */}
        <text x="60" y="72" fontSize="9" className="fill-rose-400 dark:fill-rose-300" fontWeight="600">Predators</text>
        <text x="60" y="192" fontSize="9" className="fill-amber-500 dark:fill-amber-400" fontWeight="600">Primary Consumers</text>
        <text x="60" y="312" fontSize="9" className="fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Producers</text>

        {/* Connection arrows */}
        {connections.map(([src, dst]) => {
          const s = getOrg(src);
          const d = getOrg(dst);
          const dx = d.x - s.x;
          const dy = d.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / dist;
          const ny = dy / dist;
          // Shorten line so it starts/ends at circle edge
          const x1 = s.x + nx * RADIUS;
          const y1 = s.y + ny * RADIUS;
          const x2 = d.x - nx * RADIUS;
          const y2 = d.y - ny * RADIUS;
          const active = isArrowHighlighted(src, dst);
          return (
            <line
              key={`${src}-${dst}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={active && selected ? 2.5 : 1.5}
              strokeDasharray="6,4"
              className={
                active && selected
                  ? "stroke-sky-500"
                  : "stroke-gray-400 dark:stroke-gray-500"
              }
              opacity={active ? 1 : 0.15}
              markerEnd={
                active && selected
                  ? "url(#fw-arrow-active)"
                  : "url(#fw-arrow)"
              }
            >
              <animate
                attributeName="stroke-dashoffset"
                from="20"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </line>
          );
        })}

        {/* Organism circles */}
        {organisms.map((org) => {
          const colors = levelColors[org.level];
          const highlighted = isHighlighted(org.id);
          const isSelected = selected === org.id;
          return (
            <g
              key={org.id}
              className="cursor-pointer"
              onClick={() => setSelected(selected === org.id ? null : org.id)}
              role="button"
              tabIndex={0}
              aria-label={`${org.label} — click to show connections`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelected(selected === org.id ? null : org.id);
                }
              }}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle
                  cx={org.x}
                  cy={org.y}
                  r={RADIUS + 5}
                  className="stroke-sky-400"
                  strokeWidth="2"
                  fill="none"
                >
                  <animate
                    attributeName="r"
                    values={`${RADIUS + 4};${RADIUS + 7};${RADIUS + 4}`}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                cx={org.x}
                cy={org.y}
                r={RADIUS}
                className={
                  highlighted
                    ? isSelected
                      ? colors.highlight
                      : colors.fill
                    : "fill-gray-300 dark:fill-gray-600"
                }
                opacity={highlighted ? 1 : 0.3}
              />
              <circle
                cx={org.x}
                cy={org.y}
                r={RADIUS}
                fill="none"
                className={highlighted ? colors.stroke : "stroke-gray-400 dark:stroke-gray-500"}
                strokeWidth="2"
                opacity={highlighted ? 1 : 0.3}
              />
              <text
                x={org.x}
                y={org.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight="600"
                className={highlighted ? colors.text : "fill-gray-500 dark:fill-gray-400"}
                opacity={highlighted ? 1 : 0.4}
              >
                {org.label}
              </text>
            </g>
          );
        })}

        {/* Side annotation — Energy bar */}
        <g>
          <text
            x="540"
            y="60"
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            className="fill-gray-600 dark:fill-gray-300"
          >
            Energy
          </text>
          <rect
            x="533"
            y="68"
            width="14"
            height="260"
            rx="7"
            fill="url(#energy-grad)"
            opacity="0.7"
          />
          {/* Percentage labels */}
          <text x="540" y="100" textAnchor="middle" fontSize="8" fontWeight="bold" className="fill-rose-700 dark:fill-rose-300">
            1%
          </text>
          <text x="540" y="215" textAnchor="middle" fontSize="8" fontWeight="bold" className="fill-amber-700 dark:fill-amber-300">
            10%
          </text>
          <text x="540" y="325" textAnchor="middle" fontSize="8" fontWeight="bold" className="fill-emerald-700 dark:fill-emerald-300">
            100%
          </text>
          <text
            x="540"
            y="348"
            textAnchor="middle"
            fontSize="7"
            className="fill-gray-500 dark:fill-gray-400"
          >
            decreases
          </text>
          <text
            x="540"
            y="358"
            textAnchor="middle"
            fontSize="7"
            className="fill-gray-500 dark:fill-gray-400"
          >
            each level
          </text>
          {/* Upward arrow on bar */}
          <line x1="540" y1="66" x2="540" y2="56" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#fw-arrow)" />
        </g>

        {/* Tap hint */}
        {!selected && (
          <text
            x="300"
            y="393"
            textAnchor="middle"
            fontSize="9"
            className="fill-gray-400 dark:fill-gray-500"
          >
            Tap an organism to see its connections
          </text>
        )}
      </svg>
    </div>
  );
}
