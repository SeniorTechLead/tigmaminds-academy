export default function FractalZoomDiagram() {
  // Generate a simple fractal tree
  interface Seg {
    x1: number; y1: number; x2: number; y2: number; depth: number;
  }

  function buildTree(
    x1: number, y1: number, angle: number, len: number,
    depth: number, max: number
  ): Seg[] {
    const x2 = x1 + Math.cos(angle) * len;
    const y2 = y1 + Math.sin(angle) * len;
    const seg: Seg = { x1, y1, x2, y2, depth };
    if (depth >= max) return [seg];
    const spread = (28 * Math.PI) / 180;
    const nLen = len * 0.65;
    return [
      seg,
      ...buildTree(x2, y2, angle - spread, nLen, depth + 1, max),
      ...buildTree(x2, y2, angle + spread, nLen, depth + 1, max),
    ];
  }

  // Main tree (larger, left side)
  const mainSegs = buildTree(160, 310, -Math.PI / 2, 90, 0, 5);

  // Medium branch (zoom 1) - same shape, smaller
  const midSegs = buildTree(390, 275, -Math.PI / 2, 55, 0, 4);

  // Tiny twig (zoom 2) - same shape, smallest
  const tinySegs = buildTree(565, 250, -Math.PI / 2, 35, 0, 3);

  const branchColor = (d: number, maxD: number) => {
    const ratio = maxD > 0 ? d / maxD : 0;
    const r = Math.round(100 + ratio * 80);
    const g = Math.round(180 + ratio * 60);
    const b = Math.round(100 + ratio * 50);
    return `rgb(${r},${g},${b})`;
  };

  const strokeW = (d: number, maxD: number, base: number) =>
    Math.max(base * Math.pow(0.55, d), 0.8);

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 670 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Fractal self-similarity: a tree branching pattern looks the same at every scale"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .sub { font-family: system-ui, sans-serif; font-size: 10px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
          .tag { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
        `}</style>

        <rect width="670" height="400" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="335" y="28" textAnchor="middle" className="title fill-amber-300">
          Fractal Self-Similarity
        </text>

        {/* === Main tree === */}
        <g>
          {mainSegs.map((s, i) => (
            <line
              key={`m-${i}`}
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={branchColor(s.depth, 5)}
              strokeWidth={strokeW(s.depth, 5, 7)}
              strokeLinecap="round"
            />
          ))}
          {/* Leaves */}
          {mainSegs.filter(s => s.depth === 5).map((s, i) => (
            <circle key={`ml-${i}`} cx={s.x2} cy={s.y2} r={2} fill="#4ade80" opacity={0.7} />
          ))}
          <text x={160} y={340} textAnchor="middle" className="label fill-green-300">Whole Tree</text>

          {/* Zoom box on a branch */}
          <rect x={140} y={140} width={55} height={65} rx="3"
            fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x={197} y={150} className="sub fill-amber-400">zoom in</text>
        </g>

        {/* Arrow: main -> mid */}
        <line x1={252} y1={170} x2={320} y2={170}
          stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#zoomArrow)" />

        {/* === Medium branch === */}
        <g>
          {/* Background box */}
          <rect x={325} y={115} width={130} height={180} rx="5"
            className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />

          {midSegs.map((s, i) => (
            <line
              key={`mid-${i}`}
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={branchColor(s.depth, 4)}
              strokeWidth={strokeW(s.depth, 4, 5)}
              strokeLinecap="round"
            />
          ))}
          {midSegs.filter(s => s.depth === 4).map((s, i) => (
            <circle key={`mdl-${i}`} cx={s.x2} cy={s.y2} r={1.8} fill="#4ade80" opacity={0.7} />
          ))}
          <text x={390} y={310} textAnchor="middle" className="label fill-green-300">One Branch</text>

          {/* Zoom box */}
          <rect x={372} y={175} width={40} height={45} rx="2"
            fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x={414} y={185} className="sub fill-amber-400">zoom in</text>
        </g>

        {/* Arrow: mid -> tiny */}
        <line x1={460} y1={195} x2={500} y2={195}
          stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#zoomArrow)" />

        {/* === Tiny twig === */}
        <g>
          {/* Background box */}
          <rect x={505} y={140} width={130} height={155} rx="5"
            className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />

          {tinySegs.map((s, i) => (
            <line
              key={`t-${i}`}
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={branchColor(s.depth, 3)}
              strokeWidth={strokeW(s.depth, 3, 4)}
              strokeLinecap="round"
            />
          ))}
          {tinySegs.filter(s => s.depth === 3).map((s, i) => (
            <circle key={`tl-${i}`} cx={s.x2} cy={s.y2} r={1.5} fill="#4ade80" opacity={0.7} />
          ))}
          <text x={565} y={310} textAnchor="middle" className="label fill-green-300">One Twig</text>
        </g>

        <defs>
          <marker id="zoomArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Equals signs / similarity callout */}
        <text x={160} y={365} textAnchor="middle" className="tag fill-cyan-400">Whole</text>
        <text x={240} y={365} textAnchor="middle" className="tag fill-slate-400">=</text>
        <text x={390} y={340} textAnchor="middle" className="tag fill-cyan-400">Branch</text>
        <text x={478} y={340} textAnchor="middle" className="tag fill-slate-400">=</text>
        <text x={565} y={340} textAnchor="middle" className="tag fill-cyan-400">Twig</text>

        {/* Bottom label */}
        <text x="335" y="388" textAnchor="middle" className="label fill-amber-300">
          Same pattern at every scale -- that's a fractal!
        </text>
      </svg>
    </div>
  );
}
