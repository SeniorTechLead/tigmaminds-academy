import { useState } from "react";

const words = ["The", "elephant", "rumbled", "because", "it", "was", "nervous"];

// Attention weights: attentionMatrix[sourceWordIdx][targetWordIdx]
const attentionMatrix: number[][] = [
  // The       elephant  rumbled  because  it     was    nervous
  [0.10, 0.45, 0.15, 0.05, 0.10, 0.05, 0.10], // The
  [0.15, 0.20, 0.25, 0.05, 0.10, 0.05, 0.20], // elephant
  [0.05, 0.55, 0.10, 0.05, 0.05, 0.02, 0.18], // rumbled
  [0.03, 0.15, 0.20, 0.10, 0.12, 0.10, 0.30], // because
  [0.08, 0.62, 0.08, 0.04, 0.05, 0.05, 0.08], // it
  [0.05, 0.15, 0.05, 0.05, 0.35, 0.10, 0.25], // was
  [0.03, 0.35, 0.30, 0.05, 0.07, 0.05, 0.15], // nervous
];

const explanations: Record<number, string> = {
  0: "\"The\" is a function word. The model distributes attention broadly, with a lean toward \"elephant\" \u2014 the noun it modifies.",
  1: "\"Elephant\" attends to itself, \"rumbled\" (what it did), and \"nervous\" (its state) \u2014 building a picture of the subject.",
  2: "To understand \"rumbled\", the model attends most to \"elephant\" (what rumbled?) and \"nervous\" (evidence of nervousness).",
  3: "\"Because\" is a connector. It looks ahead to \"nervous\" (the reason) and back to \"rumbled\" (the effect).",
  4: "The model learns that \"it\" refers to \"elephant\" \u2014 not \"rumbled\" or \"because\". This is self-attention: each word looks at every other word to understand context.",
  5: "\"Was\" links subject to state. It attends strongly to \"it\" (the subject) and \"nervous\" (the predicate).",
  6: "To understand \"nervous\", the model attends most to \"elephant\" (what is nervous?) and \"rumbled\" (evidence of nervousness).",
};

const BOX_W = 64;
const BOX_H = 36;
const BOX_GAP = 8;
const TOTAL_W = words.length * BOX_W + (words.length - 1) * BOX_GAP;
const START_X = (560 - TOTAL_W) / 2;
const PERCENT_Y = 28;   // percentage labels above the boxes
const WORD_Y = 48;       // word boxes
const ARC_START_Y = WORD_Y + BOX_H + 6; // arcs start below boxes

function wordCenterX(idx: number) {
  return START_X + idx * (BOX_W + BOX_GAP) + BOX_W / 2;
}

export default function TransformerAttentionDiagram() {
  const [selectedIdx, setSelectedIdx] = useState(4); // "it" by default

  const weights = selectedIdx >= 0 ? attentionMatrix[selectedIdx] : [];
  const maxWeight = Math.max(...weights);

  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 420"
        className="w-full h-auto"
        role="img"
        aria-label="Transformer self-attention diagram showing how words attend to each other"
      >
        <defs>
          <filter id="ta-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Attention arcs — below the word boxes, clear of percentage labels */}
        {selectedIdx >= 0 &&
          words.map((_, targetIdx) => {
            const w = weights[targetIdx];
            if (targetIdx === selectedIdx) return null;
            const normalizedW = w / maxWeight;

            const sx = wordCenterX(selectedIdx);
            const tx = wordCenterX(targetIdx);

            const dist = Math.abs(targetIdx - selectedIdx);
            const depth = 25 + dist * 20;
            const midX = (sx + tx) / 2;

            const isStrong = normalizedW > 0.5;

            return (
              <path
                key={`conn-${targetIdx}`}
                d={`M ${sx} ${ARC_START_Y} Q ${midX} ${ARC_START_Y + depth} ${tx} ${ARC_START_Y}`}
                fill="none"
                stroke={isStrong ? "#34d399" : "#64748b"}
                strokeWidth={0.5 + normalizedW * 3.5}
                opacity={0.15 + normalizedW * 0.75}
                style={{ transition: "all 0.35s ease" }}
                filter={normalizedW > 0.7 ? "url(#ta-glow)" : undefined}
              />
            );
          })}

        {/* Word boxes + percentage labels above */}
        {words.map((word, idx) => {
          const isSelected = idx === selectedIdx;
          const x = START_X + idx * (BOX_W + BOX_GAP);

          let targetHighlight = false;
          let targetWeight = 0;
          if (selectedIdx >= 0 && idx !== selectedIdx) {
            targetWeight = weights[idx] / maxWeight;
            targetHighlight = targetWeight > 0.5;
          }

          return (
            <g
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              style={{ cursor: "pointer" }}
            >
              {/* Percentage label ABOVE the box */}
              {selectedIdx >= 0 && idx !== selectedIdx && (
                <text
                  x={x + BOX_W / 2}
                  y={PERCENT_Y}
                  textAnchor="middle"
                  fill={targetHighlight ? "#34d399" : "#64748b"}
                  fontSize={10}
                  fontWeight={600}
                  opacity={0.3 + targetWeight * 0.7}
                  style={{ transition: "all 0.3s" }}
                >
                  {(weights[idx] * 100).toFixed(0)}%
                </text>
              )}

              {/* Highlight ring for selected word */}
              {isSelected && (
                <rect
                  x={x - 3}
                  y={WORD_Y - 3}
                  width={BOX_W + 6}
                  height={BOX_H + 6}
                  rx={10}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  opacity={0.7}
                  filter="url(#ta-glow)"
                />
              )}

              <rect
                x={x}
                y={WORD_Y}
                width={BOX_W}
                height={BOX_H}
                rx={7}
                fill={
                  isSelected
                    ? "#78350f"
                    : targetHighlight
                    ? "#064e3b"
                    : "#1e293b"
                }
                stroke={
                  isSelected
                    ? "#f59e0b"
                    : targetHighlight
                    ? "#34d399"
                    : "#475569"
                }
                strokeWidth={isSelected ? 2.5 : targetHighlight ? 2 : 1.5}
                style={{ transition: "all 0.3s ease" }}
              />

              <text
                x={x + BOX_W / 2}
                y={WORD_Y + BOX_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={
                  isSelected
                    ? "#fbbf24"
                    : targetHighlight
                    ? "#6ee7b7"
                    : "#cbd5e1"
                }
                fontSize={12}
                fontWeight={isSelected ? 700 : 500}
                style={{ transition: "fill 0.3s" }}
              >
                {word}
              </text>
            </g>
          );
        })}

        {/* Explanation box */}
        {selectedIdx >= 0 && (
          <foreignObject x={30} y={270} width={500} height={70}>
            <div
              style={{
                color: "#e2e8f0",
                fontSize: "11.5px",
                lineHeight: "1.5",
                textAlign: "center",
                padding: "8px 12px",
                background: "rgba(30, 41, 59, 0.85)",
                borderRadius: "8px",
                border: "1px solid #334155",
              }}
            >
              {explanations[selectedIdx]}
            </div>
          </foreignObject>
        )}

        {/* Bottom summary */}
        <foreignObject x={20} y={350} width={520} height={55}>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "10px",
              lineHeight: "1.5",
              textAlign: "center",
              padding: "4px 8px",
            }}
          >
            This is how ChatGPT, Google Translate, and every modern AI language
            model works. The transformer architecture processes all words
            simultaneously, using attention to understand relationships.
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
