/**
 * Bipin examines a section of honeycomb. The hexagons tessellate perfectly
 * — no gaps. Compare to circles (gaps everywhere) and squares (works but
 * less efficient). Visual: three side-by-side panels.
 *
 * Used to open the Tessellations section.
 */
import Bipin from './people/Bipin';

export default function HoneycombHexagonDiagram() {
  const W = 760, H = 380;
  const groundY = 320;

  // Three panels — circles, squares, hexagons
  const panel = (cx: number, label: string, ok: boolean, perimeter: string) => ({
    cx, label, ok, perimeter, x: cx - 90, w: 180, y: 100, h: 160,
  });
  const panels = [
    panel(180, 'Circles', false, '— wastes space'),
    panel(390, 'Squares', true,  'p ≈ 4.00 √A'),
    panel(600, 'Hexagons', true, 'p ≈ 3.72 √A'),
  ];

  // Hexagon points (flat-top hexagon centred at cx, cy, with circumradius r)
  const hexPoints = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Why bees use hexagons: the most efficient way to tile a surface with no gaps">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Counter / table */}
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Why do bees build hexagons?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Maximum room for honey, minimum wax.
        </text>

        {/* Bipin on bottom right */}
        <Bipin x={690} y={groundY} scale={0.9} pose="pointing" flip={true} />

        {/* Three panels */}
        {/* Panel 1: Circles with gaps */}
        <g>
          <rect x={panels[0].x} y={panels[0].y} width={panels[0].w} height={panels[0].h} rx="8"
            fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          {/* 7 circles in a hex packing */}
          {[
            [0, 0], [1, 0], [-1, 0],
            [0.5, 0.866], [-0.5, 0.866], [0.5, -0.866], [-0.5, -0.866],
          ].map(([dx, dy], i) => (
            <circle key={i} cx={panels[0].cx + dx * 36} cy={panels[0].y + 80 + dy * 36} r="20"
              fill="#fde047" stroke="#a16207" strokeWidth="1.3" />
          ))}
          {/* X marks for gaps */}
          <text x={panels[0].cx + 18} y={panels[0].y + 70} textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">✗</text>
          <text x={panels[0].cx - 18} y={panels[0].y + 70} textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">✗</text>
          <text x={panels[0].cx + 18} y={panels[0].y + 105} textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">✗</text>
          <text x={panels[0].cx - 18} y={panels[0].y + 105} textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">✗</text>
          <text x={panels[0].cx} y={panels[0].y - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#dc2626">{panels[0].label}</text>
          <text x={panels[0].cx} y={panels[0].y + panels[0].h + 16} textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="600">Gaps everywhere ✗</text>
        </g>

        {/* Panel 2: Squares */}
        <g>
          <rect x={panels[1].x} y={panels[1].y} width={panels[1].w} height={panels[1].h} rx="8"
            fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          {/* 4×4 grid of squares */}
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, c) => (
              <rect key={`${r}-${c}`}
                x={panels[1].x + 14 + c * 38} y={panels[1].y + 18 + r * 30}
                width="36" height="28" fill="#fde68a" stroke="#a16207" strokeWidth="1.2" />
            ))
          )}
          <text x={panels[1].cx} y={panels[1].y - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">{panels[1].label}</text>
          <text x={panels[1].cx} y={panels[1].y + panels[1].h + 16} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600" className="dark:fill-gray-300">{panels[1].perimeter}</text>
        </g>

        {/* Panel 3: Hexagons */}
        <g>
          <rect x={panels[2].x} y={panels[2].y} width={panels[2].w} height={panels[2].h} rx="8"
            fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Honeycomb of hexagons — flat-top */}
          {(() => {
            const r = 22;
            const dx = r * Math.sqrt(3);
            const dy = r * 1.5;
            const hexes: { cx: number; cy: number }[] = [];
            for (let row = 0; row < 4; row++) {
              for (let col = 0; col < 4; col++) {
                const cx = panels[2].x + 25 + col * dx + (row % 2 === 1 ? dx / 2 : 0);
                const cy = panels[2].y + 30 + row * dy;
                if (cx > panels[2].x && cx < panels[2].x + panels[2].w && cy > panels[2].y && cy < panels[2].y + panels[2].h) {
                  hexes.push({ cx, cy });
                }
              }
            }
            return hexes.map((h, i) => (
              <polygon key={i} points={hexPoints(h.cx, h.cy, r)}
                fill="#fde047" stroke="#a16207" strokeWidth="1.4"
                transform={`rotate(30, ${h.cx}, ${h.cy})`} />
            ));
          })()}
          <text x={panels[2].cx} y={panels[2].y - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#16a34a">{panels[2].label} ★</text>
          <text x={panels[2].cx} y={panels[2].y + panels[2].h + 16} textAnchor="middle" fontSize="11" fill="#16a34a" fontWeight="700">{panels[2].perimeter}</text>
        </g>

        {/* Footer */}
        <rect x={W / 2 - 280} y={H - 30} width="560" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Hexagons enclose the same area as squares with 7% less perimeter — 7% less wax for bees.
        </text>
      </svg>
    </div>
  );
}
