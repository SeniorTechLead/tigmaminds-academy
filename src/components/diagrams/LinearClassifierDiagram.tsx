import { useEffect, useState } from "react";

/* ── Pre-computed dot positions ── */

/* Top panel: linearly separable */
const calmDotsLinear = [
  { x: 60, y: 140 }, { x: 80, y: 120 }, { x: 100, y: 150 },
  { x: 70, y: 160 }, { x: 110, y: 130 }, { x: 90, y: 170 },
  { x: 50, y: 150 }, { x: 120, y: 140 },
];
const nervousDotsLinear = [
  { x: 280, y: 30 },  { x: 310, y: 50 },  { x: 330, y: 20 },
  { x: 350, y: 60 },  { x: 300, y: 70 },  { x: 340, y: 40 },
  { x: 370, y: 55 },  { x: 290, y: 45 },
];

/* Bottom panel: NOT linearly separable (ring pattern) */
const innerDots = [
  { x: 190, y: 320 }, { x: 225, y: 340 }, { x: 205, y: 305 },
  { x: 240, y: 325 }, { x: 175, y: 310 }, { x: 215, y: 350 },
];
const outerDots = [
  { x: 100, y: 270 }, { x: 140, y: 380 }, { x: 165, y: 255 },
  { x: 300, y: 265 }, { x: 310, y: 370 }, { x: 260, y: 390 },
  { x: 110, y: 340 }, { x: 325, y: 320 }, { x: 255, y: 255 },
  { x: 150, y: 395 }, { x: 330, y: 280 }, { x: 285, y: 395 },
];

/* Separating line for top panel — diagonal from upper-left to lower-right, through the gap */
const linearLineX1 = 160;
const linearLineY1 = 20;
const linearLineX2 = 260;
const linearLineY2 = 165;

/* Failing straight line for bottom panel */
const failLineX1 = 100;
const failLineY1 = 260;
const failLineX2 = 330;
const failLineY2 = 400;

/* Check which outer dots are mis-classified by the straight line */
function wrongSideOfLine(pt: { x: number; y: number }) {
  /* Line goes from (120,240) to (320,380). Points to the LEFT are "inner" side. */
  const dx = failLineX2 - failLineX1;
  const dy = failLineY2 - failLineY1;
  const cross = dx * (pt.y - failLineY1) - dy * (pt.x - failLineX1);
  return cross > 0; // on the inner-class side of the line
}

/* Curved boundary: a circle centred on the inner cluster */
const curveCenter = { x: 210, y: 325 };
const curveRadius = 55;

export default function LinearClassifierDiagram() {
  const [showCurve, setShowCurve] = useState(false);
  const [drawProgress, setDrawProgress] = useState(0);

  /* Animate boundary drawing */
  useEffect(() => {
    setDrawProgress(0);
    let frame: number;
    const start = performance.now();
    const duration = 800;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setDrawProgress(t);
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [showCurve]);

  /* Dashed line length for draw-in effect */
  const topLineLen = Math.hypot(linearLineX2 - linearLineX1, linearLineY2 - linearLineY1);
  const bottomLineLen = Math.hypot(failLineX2 - failLineX1, failLineY2 - failLineY1);
  const curveCircumference = 2 * Math.PI * curveRadius;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <button
          onClick={() => setShowCurve(false)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
            !showCurve ? "bg-sky-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          Linear boundary
        </button>
        <button
          onClick={() => setShowCurve(true)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
            showCurve ? "bg-violet-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          Curved boundary
        </button>
      </div>

      <svg
        viewBox="0 0 500 460"
        className="w-full"
        style={{ background: "#0f172a", borderRadius: 12 }}
      >
        {/* ════════════ TOP PANEL: linearly separable ════════════ */}
        <g>
          {/* Panel background */}
          <rect x={20} y={5} width={420} height={200} rx={8} fill="#1e293b" opacity={0.5} />

          {/* Title */}
          <text x={230} y={22} textAnchor="middle" fill="#e2e8f0" fontSize={12} fontWeight={700}>
            Linearly Separable
          </text>

          {/* Axes */}
          <line x1={35} y1={165} x2={420} y2={165} stroke="#475569" strokeWidth={1} />
          <line x1={35} y1={165} x2={35} y2={15} stroke="#475569" strokeWidth={1} />
          <text x={230} y={180} textAnchor="middle" fill="#64748b" fontSize={9}>
            Frequency (Hz)
          </text>
          <text
            x={14} y={90}
            textAnchor="middle"
            fill="#64748b"
            fontSize={9}
            transform="rotate(-90, 14, 90)"
          >
            Pulse rate
          </text>

          {/* Calm dots (green) */}
          {calmDotsLinear.map((pt, i) => (
            <circle key={`calm-l-${i}`} cx={pt.x} cy={pt.y} r={5} fill="#4ade80" opacity={0.85} />
          ))}

          {/* Nervous dots (red) */}
          {nervousDotsLinear.map((pt, i) => (
            <circle key={`nerv-l-${i}`} cx={pt.x} cy={pt.y} r={5} fill="#f87171" opacity={0.85} />
          ))}

          {/* Separating line */}
          <line
            x1={linearLineX1} y1={linearLineY1}
            x2={linearLineX2} y2={linearLineY2}
            stroke="#38bdf8"
            strokeWidth={2.5}
            strokeDasharray={topLineLen}
            strokeDashoffset={topLineLen * (1 - drawProgress)}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />

          {/* Label */}
          <text x={230} y={198} textAnchor="middle" fill="#22d3ee" fontSize={10}>
            A single line separates the classes ✓
          </text>

          {/* Legend */}
          <circle cx={330} cy={30} r={4} fill="#4ade80" />
          <text x={338} y={34} fill="#94a3b8" fontSize={9}>Calm</text>
          <circle cx={375} cy={30} r={4} fill="#f87171" />
          <text x={383} y={34} fill="#94a3b8" fontSize={9}>Nervous</text>
        </g>

        {/* ════════════ BOTTOM PANEL: not linearly separable ════════════ */}
        <g>
          {/* Panel background */}
          <rect x={20} y={220} width={420} height={210} rx={8} fill="#1e293b" opacity={0.5} />

          {/* Title */}
          <text x={230} y={238} textAnchor="middle" fill="#e2e8f0" fontSize={12} fontWeight={700}>
            Not Linearly Separable
          </text>

          {/* Axes */}
          <line x1={35} y1={410} x2={420} y2={410} stroke="#475569" strokeWidth={1} />
          <line x1={35} y1={410} x2={35} y2={235} stroke="#475569" strokeWidth={1} />
          <text x={230} y={425} textAnchor="middle" fill="#64748b" fontSize={9}>
            Frequency (Hz)
          </text>
          <text
            x={14} y={320}
            textAnchor="middle"
            fill="#64748b"
            fontSize={9}
            transform="rotate(-90, 14, 320)"
          >
            Pulse rate
          </text>

          {/* Inner dots (green) */}
          {innerDots.map((pt, i) => (
            <circle key={`inner-${i}`} cx={pt.x} cy={pt.y} r={5} fill="#4ade80" opacity={0.85} />
          ))}

          {/* Outer dots (red) */}
          {outerDots.map((pt, i) => {
            const misclassified = !showCurve && wrongSideOfLine(pt);
            return (
              <g key={`outer-${i}`}>
                <circle cx={pt.x} cy={pt.y} r={5} fill="#f87171" opacity={0.85} />
                {misclassified && (
                  <text
                    x={pt.x + 8} y={pt.y + 4}
                    fill="#fbbf24" fontSize={11} fontWeight={700}
                  >
                    ✗
                  </text>
                )}
              </g>
            );
          })}

          {/* Straight failing line (always shown when linear mode) */}
          {!showCurve && (
            <line
              x1={failLineX1} y1={failLineY1}
              x2={failLineX2} y2={failLineY2}
              stroke="#f87171"
              strokeWidth={2.5}
              strokeDasharray={bottomLineLen}
              strokeDashoffset={bottomLineLen * (1 - drawProgress)}
              opacity={0.8}
            />
          )}

          {/* Curved boundary (circle) */}
          {showCurve && (
            <circle
              cx={curveCenter.x} cy={curveCenter.y} r={curveRadius}
              fill="none"
              stroke="#a78bfa"
              strokeWidth={2.5}
              strokeDasharray={curveCircumference}
              strokeDashoffset={curveCircumference * (1 - drawProgress)}
            />
          )}

          {/* Bottom label */}
          <text x={230} y={445} textAnchor="middle" fill={showCurve ? "#a78bfa" : "#fbbf24"} fontSize={9.5}>
            {showCurve
              ? "A curved boundary separates them — neural networks learn these curves"
              : "A straight line fails — some dots end up on the wrong side ✗"}
          </text>

          {/* Legend */}
          <circle cx={330} cy={247} r={4} fill="#4ade80" />
          <text x={338} y={251} fill="#94a3b8" fontSize={9}>Inner class</text>
          <circle cx={395} cy={247} r={4} fill="#f87171" />
          <text x={403} y={251} fill="#94a3b8" fontSize={9}>Outer</text>
        </g>
      </svg>
    </div>
  );
}
