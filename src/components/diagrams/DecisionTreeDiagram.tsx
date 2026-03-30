import { useState } from "react";

/* ── Test animals ── */
const testAnimals = [
  { name: "Elephant", emoji: "🐘", weight: 4500, hasTrunk: true, barks: false },
  { name: "Dog",      emoji: "🐕", weight: 30,   hasTrunk: false, barks: true },
  { name: "Cat",      emoji: "🐱", weight: 5,    hasTrunk: false, barks: false },
];

/* ── Node positions ── */
const nodes = {
  root:      { x: 280, y: 50 },
  hasTrunk:  { x: 140, y: 170 },
  barks:     { x: 420, y: 170 },
  elephant:  { x: 70,  y: 310 },
  rhino:     { x: 210, y: 310 },
  dog:       { x: 350, y: 310 },
  cat:       { x: 490, y: 310 },
};

/* ── Classification paths ── */
type Path = ("root" | "hasTrunk" | "barks" | "elephant" | "rhino" | "dog" | "cat")[];

function classify(animal: typeof testAnimals[0]): Path {
  if (animal.weight > 100) {
    return animal.hasTrunk
      ? ["root", "hasTrunk", "elephant"]
      : ["root", "hasTrunk", "rhino"];
  }
  return animal.barks
    ? ["root", "barks", "dog"]
    : ["root", "barks", "cat"];
}

/* ── Edge definitions ── */
const edges: { from: keyof typeof nodes; to: keyof typeof nodes; label: string; color: string }[] = [
  { from: "root",     to: "hasTrunk", label: "Yes", color: "#22c55e" },
  { from: "root",     to: "barks",    label: "No",  color: "#ef4444" },
  { from: "hasTrunk", to: "elephant", label: "Yes", color: "#22c55e" },
  { from: "hasTrunk", to: "rhino",    label: "No",  color: "#ef4444" },
  { from: "barks",    to: "dog",      label: "Yes", color: "#22c55e" },
  { from: "barks",    to: "cat",      label: "No",  color: "#ef4444" },
];

/* ── Leaf metadata ── */
const leaves: Record<string, { emoji: string; label: string; bg: string }> = {
  elephant: { emoji: "🐘", label: "ELEPHANT", bg: "#166534" },
  rhino:    { emoji: "🦏", label: "RHINO",    bg: "#166534" },
  dog:      { emoji: "🐕", label: "DOG",      bg: "#1e40af" },
  cat:      { emoji: "🐱", label: "CAT",      bg: "#92400e" },
};

/* ── Helpers ── */
function RoundedRect({
  x, y, w, h, fill, stroke, opacity, children,
}: {
  x: number; y: number; w: number; h: number;
  fill: string; stroke: string; opacity: number;
  children: React.ReactNode;
}) {
  return (
    <g opacity={opacity} style={{ transition: "opacity 0.4s" }}>
      <rect
        x={x - w / 2} y={y - h / 2} width={w} height={h}
        rx={10} fill={fill} stroke={stroke} strokeWidth={2}
      />
      {children}
    </g>
  );
}

export default function DecisionTreeDiagram() {
  const [animalIdx, setAnimalIdx] = useState(0);
  const [activePath, setActivePath] = useState<Path | null>(null);

  const animal = testAnimals[animalIdx];

  const handleClassify = () => setActivePath(classify(animal));

  const handleNext = () => {
    setActivePath(null);
    setAnimalIdx((i) => (i + 1) % testAnimals.length);
  };

  const isOnPath = (nodeKey: string) =>
    activePath ? activePath.includes(nodeKey as Path[number]) : true;

  const edgeOnPath = (from: string, to: string) => {
    if (!activePath) return true;
    const fi = activePath.indexOf(from as Path[number]);
    const ti = activePath.indexOf(to as Path[number]);
    return fi !== -1 && ti !== -1 && ti === fi + 1;
  };

  const resultNode = activePath ? activePath[activePath.length - 1] : null;
  const resultLeaf = resultNode ? leaves[resultNode] : null;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <span className="text-lg text-gray-800 dark:text-slate-200">
          Test: <strong>{animal.emoji} {animal.name}</strong>{" "}
          <span className="text-sm text-gray-500 dark:text-slate-400">
            ({animal.weight} kg{animal.hasTrunk ? ", has trunk" : ""}{animal.barks ? ", barks" : ""})
          </span>
        </span>
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={handleClassify}
          disabled={activePath !== null}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Classify
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-slate-600 hover:bg-slate-500 text-white transition"
        >
          Next animal
        </button>
      </div>

      {/* Result banner */}
      {resultLeaf && (
        <div className="text-center mb-3 text-lg font-bold text-emerald-400">
          Result: {resultLeaf.emoji} {resultLeaf.label} ✓
        </div>
      )}

      {/* SVG Tree */}
      <svg
        viewBox="0 0 588 441"
        className="w-full"
        style={{ background: "#0f172a", borderRadius: 12 }}
      >
        {/* Title */}
        <text x={280} y={25} textAnchor="middle" fill="#94a3b8" fontSize={13} fontWeight={600}>
          Decision-Tree Animal Classifier
        </text>

        {/* Edges */}
        {edges.map(({ from, to, label, color }) => {
          const a = nodes[from];
          const b = nodes[to];
          const on = edgeOnPath(from, to);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const isYes = label === "Yes";
          return (
            <g key={`${from}-${to}`} opacity={activePath ? (on ? 1 : 0.2) : 0.7} style={{ transition: "opacity 0.4s" }}>
              <line
                x1={a.x} y1={a.y + 20} x2={b.x} y2={b.y - 20}
                stroke={on && activePath ? color : "#475569"}
                strokeWidth={on && activePath ? 3 : 2}
                style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
              />
              <text
                x={mx + (isYes ? -14 : 14)}
                y={my - 4}
                textAnchor="middle"
                fill={on && activePath ? color : "#94a3b8"}
                fontSize={12}
                fontWeight={700}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Decision nodes */}
        {([
          { key: "root",     label: "Weight > 100 kg?" },
          { key: "hasTrunk", label: "Has trunk?" },
          { key: "barks",    label: "Barks?" },
        ] as const).map(({ key, label }) => {
          const { x, y } = nodes[key];
          const on = isOnPath(key);
          return (
            <RoundedRect
              key={key}
              x={x} y={y} w={150} h={40}
              fill={on && activePath ? "#1e293b" : "#1e293b"}
              stroke={on && activePath ? "#38bdf8" : "#475569"}
              opacity={activePath ? (on ? 1 : 0.2) : 1}
            >
              <text x={x} y={y + 5} textAnchor="middle" fill="#e2e8f0" fontSize={13} fontWeight={600}>
                {label}
              </text>
            </RoundedRect>
          );
        })}

        {/* Leaf nodes */}
        {(Object.entries(leaves) as [string, typeof leaves[string]][]).map(([key, { emoji, label, bg }]) => {
          const { x, y } = nodes[key as keyof typeof nodes];
          const on = isOnPath(key);
          const isResult = resultNode === key;
          return (
            <g
              key={key}
              opacity={activePath ? (on ? 1 : 0.2) : 1}
              style={{ transition: "opacity 0.4s" }}
            >
              <rect
                x={x - 55} y={y - 25} width={110} height={50}
                rx={10}
                fill={isResult ? bg : "#1e293b"}
                stroke={isResult ? "#4ade80" : "#475569"}
                strokeWidth={isResult ? 3 : 2}
                style={{ transition: "fill 0.4s, stroke 0.4s" }}
              />
              <text x={x} y={y - 2} textAnchor="middle" fontSize={22}>
                {emoji}
              </text>
              <text x={x} y={y + 18} textAnchor="middle" fill="#e2e8f0" fontSize={12} fontWeight={700}>
                {label}
              </text>
            </g>
          );
        })}

        {/* Active animal indicator at the root */}
        {activePath && (
          <text
            x={nodes.root.x}
            y={nodes.root.y - 25}
            textAnchor="middle"
            fontSize={22}
          >
            {animal.emoji}
          </text>
        )}

        {/* Legend */}
        <g transform="translate(20, 380)">
          <circle cx={8} cy={0} r={5} fill="#22c55e" />
          <text x={18} y={4} fill="#94a3b8" fontSize={10}>Yes branch</text>
          <circle cx={108} cy={0} r={5} fill="#ef4444" />
          <text x={118} y={4} fill="#94a3b8" fontSize={10}>No branch</text>
          <rect x={200} y={-6} width={12} height={12} rx={3} fill="#1e293b" stroke="#38bdf8" strokeWidth={1.5} />
          <text x={218} y={4} fill="#94a3b8" fontSize={10}>Active node</text>
        </g>
      </svg>
    </div>
  );
}
