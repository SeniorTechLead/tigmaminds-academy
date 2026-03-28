import { useState, useEffect } from "react";

const inputNodes = [
  { id: "i0", label: "Freq", y: 80 },
  { id: "i1", label: "Pulse", y: 190 },
  { id: "i2", label: "Amp", y: 300 },
];

const hiddenNodes = [
  { id: "h0", label: "h1", y: 50 },
  { id: "h1", label: "h2", y: 140 },
  { id: "h2", label: "h3", y: 230 },
  { id: "h3", label: "h4", y: 320 },
];

const outputNodes = [
  { id: "o0", label: "Calm", y: 80, color: "#22c55e" },
  { id: "o1", label: "Nervous", y: 190, color: "#f97316" },
  { id: "o2", label: "Danger", y: 300, color: "#ef4444" },
];

const INPUT_X = 90;
const HIDDEN_X = 280;
const OUTPUT_X = 470;
const NODE_R = 26;

// Weights: inputToHidden[inputIdx][hiddenIdx]
const inputToHidden = [
  [0.9, 0.3, 0.7, 0.2],
  [0.4, 0.8, 0.5, 0.6],
  [0.2, 0.5, 0.3, 0.9],
];

// Weights: hiddenToOutput[hiddenIdx][outputIdx]
const hiddenToOutput = [
  [0.8, 0.2, 0.3],
  [0.3, 0.7, 0.5],
  [0.5, 0.6, 0.8],
  [0.2, 0.4, 0.9],
];

// Strongest-path info per output node
const outputExplanations: Record<string, string> = {
  o0: "Low frequency + slow pulse \u2192 Calm",
  o1: "Moderate frequency + rising pulse \u2192 Nervous",
  o2: "High amplitude + fast pulse \u2192 Danger",
};

// For each output, define which paths are "strong" (input->hidden weight * hidden->output weight)
function getPathStrengths(outputIdx: number) {
  const strengths: { ih: [number, number]; weight: number; ho: [number, number]; hoWeight: number }[] = [];
  for (let i = 0; i < 3; i++) {
    for (let h = 0; h < 4; h++) {
      const combined = inputToHidden[i][h] * hiddenToOutput[h][outputIdx];
      strengths.push({
        ih: [i, h],
        weight: inputToHidden[i][h],
        ho: [h, outputIdx],
        hoWeight: hiddenToOutput[h][outputIdx],
      });
    }
  }
  return strengths;
}

export default function NeuralNetworkDiagram() {
  const [activeOutput, setActiveOutput] = useState<string | null>(null);
  const [pulseProgress, setPulseProgress] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (!animating) return;
    let frame: number;
    let start: number | null = null;
    const duration = 1800;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      setPulseProgress(p);
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setAnimating(false);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animating]);

  const activeIdx = activeOutput
    ? outputNodes.findIndex((n) => n.id === activeOutput)
    : -1;

  // Pre-compute strong connections for active output
  let strongIH = new Set<string>();
  let strongHO = new Set<string>();
  if (activeIdx >= 0) {
    const paths = getPathStrengths(activeIdx);
    // Top 5 combined paths
    const sorted = [...paths].sort(
      (a, b) => b.weight * b.hoWeight - a.weight * a.hoWeight
    );
    const top = sorted.slice(0, 5);
    top.forEach((p) => {
      strongIH.add(`${p.ih[0]}-${p.ih[1]}`);
      strongHO.add(`${p.ho[0]}-${p.ho[1]}`);
    });
  }

  function connectionOpacity(key: string, isStrong: boolean) {
    if (activeOutput === null) return 0.45;
    return isStrong ? 0.9 : 0.12;
  }

  function connectionWidth(weight: number, isStrong: boolean) {
    if (activeOutput !== null && !isStrong) return 0.5;
    return 1 + weight * 3;
  }

  // Pulse gradient offset based on x position
  function pulseColor(x1: number, x2: number) {
    if (!animating) return undefined;
    const mid = (x1 + x2) / 2;
    const norm = (mid - INPUT_X) / (OUTPUT_X - INPUT_X);
    const diff = pulseProgress - norm;
    if (diff > -0.15 && diff < 0.15) {
      const intensity = 1 - Math.abs(diff) / 0.15;
      return `rgba(96, 165, 250, ${intensity * 0.7})`;
    }
    return undefined;
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 420"
        className="w-full h-auto"
        role="img"
        aria-label="Neural network diagram with input, hidden, and output layers"
      >
        <defs>
          <filter id="nn-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Input to Hidden connections */}
        {inputNodes.map((inp, i) =>
          hiddenNodes.map((hid, h) => {
            const key = `${i}-${h}`;
            const isStrong = strongIH.has(key);
            const w = inputToHidden[i][h];
            const pulse = pulseColor(INPUT_X, HIDDEN_X);
            return (
              <line
                key={`ih-${key}`}
                x1={INPUT_X + NODE_R}
                y1={inp.y}
                x2={HIDDEN_X - NODE_R}
                y2={hid.y}
                stroke={
                  pulse ||
                  (isStrong && activeOutput ? "#60a5fa" : "#64748b")
                }
                strokeWidth={connectionWidth(w, isStrong)}
                opacity={connectionOpacity(key, isStrong)}
                style={{ transition: "opacity 0.3s, stroke 0.3s, stroke-width 0.3s" }}
              />
            );
          })
        )}

        {/* Hidden to Output connections */}
        {hiddenNodes.map((hid, h) =>
          outputNodes.map((out, o) => {
            const key = `${h}-${o}`;
            const isStrong = strongHO.has(key);
            const w = hiddenToOutput[h][o];
            const pulse = pulseColor(HIDDEN_X, OUTPUT_X);
            return (
              <line
                key={`ho-${key}`}
                x1={HIDDEN_X + NODE_R}
                y1={hid.y}
                x2={OUTPUT_X - NODE_R}
                y2={out.y}
                stroke={
                  pulse ||
                  (isStrong && activeOutput ? out.color : "#64748b")
                }
                strokeWidth={connectionWidth(w, isStrong)}
                opacity={connectionOpacity(key, isStrong)}
                style={{ transition: "opacity 0.3s, stroke 0.3s, stroke-width 0.3s" }}
              />
            );
          })
        )}

        {/* Input nodes */}
        {inputNodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={INPUT_X}
              cy={node.y}
              r={NODE_R}
              fill="#1e3a5f"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <text
              x={INPUT_X}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#93c5fd"
              fontSize={13}
              fontWeight={600}
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Hidden nodes */}
        {hiddenNodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={HIDDEN_X}
              cy={node.y}
              r={NODE_R}
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth={2}
            />
            <text
              x={HIDDEN_X}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94a3b8"
              fontSize={12}
              fontWeight={600}
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Output nodes */}
        {outputNodes.map((node) => {
          const isActive = activeOutput === node.id;
          return (
            <g
              key={node.id}
              onClick={() =>
                setActiveOutput(isActive ? null : node.id)
              }
              onMouseEnter={() => setActiveOutput(node.id)}
              onMouseLeave={() => setActiveOutput(null)}
              style={{ cursor: "pointer" }}
            >
              {isActive && (
                <circle
                  cx={OUTPUT_X}
                  cy={node.y}
                  r={NODE_R + 5}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={2}
                  opacity={0.5}
                  filter="url(#nn-glow)"
                />
              )}
              <circle
                cx={OUTPUT_X}
                cy={node.y}
                r={NODE_R}
                fill={isActive ? node.color + "33" : "#1e293b"}
                stroke={node.color}
                strokeWidth={isActive ? 3 : 2}
                style={{ transition: "all 0.2s" }}
              />
              <text
                x={OUTPUT_X}
                y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={node.color}
                fontSize={10}
                fontWeight={700}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Layer labels */}
        <text x={INPUT_X} y={365} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={600}>
          Input Layer
        </text>
        <text x={HIDDEN_X} y={365} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={600}>
          Hidden Layer
        </text>
        <text x={OUTPUT_X} y={365} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={600}>
          Output Layer
        </text>

        {/* Active output explanation */}
        {activeOutput && activeIdx >= 0 && (
          <text
            x={280}
            y={390}
            textAnchor="middle"
            fill={outputNodes[activeIdx].color}
            fontSize={10}
            fontWeight={600}
          >
            {outputExplanations[activeOutput]}
          </text>
        )}
      </svg>

      <p className="text-center text-sm text-slate-400 mt-3 px-4">
        Each connection has a weight. Training adjusts weights until the
        network classifies correctly.
      </p>
    </div>
  );
}
