import { useState, useMemo } from "react";

interface Branch {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
  width: number;
}

function generateBranches(
  x1: number,
  y1: number,
  angle: number,
  length: number,
  depth: number,
  maxDepth: number,
  width: number
): Branch[] {
  const x2 = x1 + length * Math.cos(angle);
  const y2 = y1 + length * Math.sin(angle);
  const branch: Branch = { x1, y1, x2, y2, depth, width };

  if (depth >= maxDepth) return [branch];

  const newLength = length * 0.7;
  const newWidth = Math.max(width * 0.65, 1);
  const spread = (30 * Math.PI) / 180;

  return [
    branch,
    ...generateBranches(x2, y2, angle - spread, newLength, depth + 1, maxDepth, newWidth),
    ...generateBranches(x2, y2, angle + spread, newLength, depth + 1, maxDepth, newWidth),
  ];
}

export default function FractalTreeDiagram() {
  const [depth, setDepth] = useState(3);

  const branches = useMemo(
    () => generateBranches(250, 380, -Math.PI / 2, 100, 0, depth, 10),
    [depth]
  );

  // Leaves are endpoints of deepest branches
  const leaves = branches.filter((b) => b.depth === depth);

  // Interpolate branch color from dark brown to lighter as depth increases
  const branchColor = (d: number) => {
    const ratio = depth > 0 ? d / depth : 0;
    const r = Math.round(139 + ratio * 60);
    const g = Math.round(69 + ratio * 60);
    const b = Math.round(19 + ratio * 40);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="w-full max-w-lg mx-auto my-6">
      <svg viewBox="0 0 525 420" className="w-full" aria-label="Fractal tree diagram">
        {branches.map((b, i) => (
          <line
            key={i}
            x1={b.x1}
            y1={b.y1}
            x2={b.x2}
            y2={b.y2}
            stroke={branchColor(b.depth)}
            strokeWidth={b.width}
            strokeLinecap="round"
          />
        ))}
        {leaves.map((b, i) => (
          <circle key={`leaf-${i}`} cx={b.x2} cy={b.y2} r={3} fill="#22c55e" />
        ))}
        <text
          x={250}
          y={20}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          className="text-gray-800 dark:text-gray-200"
          fill="currentColor"
        >
          Depth: {depth}
        </text>
      </svg>

      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => setDepth((d) => Math.max(1, d - 1))}
          disabled={depth <= 1}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-40 text-sm font-medium"
          aria-label="Decrease depth"
        >
          &minus;
        </button>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200" style={{ fontSize: 13 }}>
          Recursion Depth
        </span>
        <button
          onClick={() => setDepth((d) => Math.min(6, d + 1))}
          disabled={depth >= 6}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-40 text-sm font-medium"
          aria-label="Increase depth"
        >
          +
        </button>
      </div>
    </div>
  );
}
