/**
 * Tara holds a fern leaf. Beside her, a magnifying-glass "zoom" reveals
 * that each frond is a miniature copy of the whole leaf — and inside each
 * sub-frond, the same shape appears again. Self-similarity in three levels.
 *
 * Used to open the Fractals section.
 */
import Tara from './people/Tara';

export default function FernFractalDiagram() {
  const W = 760, H = 380;
  const groundY = 340;

  // Recursive fern shape — render branching pattern
  // Use simple recursive function: a "frond" at (x, y) with length L pointing direction (degrees)
  type Frond = { x: number; y: number; len: number; angle: number; depth: number };

  const drawFrond = (f: Frond, branches: JSX.Element[], color: string) => {
    if (f.depth === 0 || f.len < 2) return;
    const ar = (f.angle * Math.PI) / 180;
    const x2 = f.x + f.len * Math.cos(ar);
    const y2 = f.y + f.len * Math.sin(ar);
    branches.push(
      <line key={`${f.x}-${f.y}-${f.depth}-${branches.length}`}
        x1={f.x} y1={f.y} x2={x2} y2={y2}
        stroke={color} strokeWidth={Math.max(0.5, f.depth * 0.6)} strokeLinecap="round" />
    );
    // Side fronds along the stem at intervals
    const sideCount = 6;
    for (let i = 1; i <= sideCount; i++) {
      const t = i / (sideCount + 1);
      const sx = f.x + t * f.len * Math.cos(ar);
      const sy = f.y + t * f.len * Math.sin(ar);
      const sideLen = f.len * 0.45 * (1 - t * 0.6);
      // Left and right side fronds
      drawFrond({ x: sx, y: sy, len: sideLen, angle: f.angle - 50, depth: f.depth - 1 }, branches, color);
      drawFrond({ x: sx, y: sy, len: sideLen, angle: f.angle + 50, depth: f.depth - 1 }, branches, color);
    }
  };

  const fern1: JSX.Element[] = [];
  drawFrond({ x: 280, y: groundY - 20, len: 130, angle: -85, depth: 4 }, fern1, '#16a34a');

  // Zoomed-in detail: a single frond, scaled up, beside the main fern
  const fern2: JSX.Element[] = [];
  drawFrond({ x: 540, y: groundY - 30, len: 110, angle: -85, depth: 3 }, fern2, '#22c55e');

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A fern leaf is a fractal: each frond is a miniature copy of the whole">

        <defs>
          <linearGradient id="sky-ff" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dbeafe" />
            <stop offset="1" stopColor="#fef9c3" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-ff)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#65a30d" opacity="0.6" className="dark:fill-emerald-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara picks up a fern
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Look at one frond — it looks just like the whole leaf.
        </text>

        {/* Tara on far left */}
        <Tara x={100} y={groundY} scale={1.0} pose="lookingDown" />

        {/* Whole fern leaf */}
        {fern1}
        <text x="280" y={groundY + 18} textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-green-300">
          The whole leaf
        </text>

        {/* Zoom marker — circle around one frond */}
        <circle cx="280" cy="190" r="40" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4 3" />
        {/* Magnifier connector */}
        <line x1="320" y1="170" x2="430" y2="120" stroke="#f97316" strokeWidth="2" strokeDasharray="4 3" />
        {/* Zoom panel */}
        <rect x="430" y="80" width="280" height="220" rx="10"
          fill="white" stroke="#f97316" strokeWidth="2.5" className="dark:fill-gray-800" />
        <text x="570" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f97316">
          🔍 Zoomed in
        </text>
        {fern2}
        <text x="570" y={groundY - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-green-300">
          One frond — same shape!
        </text>

        {/* Footer fact */}
        <rect x={W / 2 - 220} y={H - 30} width="440" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          A fractal: a pattern that repeats at every scale — rivers, lightning, lungs, coastlines.
        </text>
      </svg>
    </div>
  );
}
