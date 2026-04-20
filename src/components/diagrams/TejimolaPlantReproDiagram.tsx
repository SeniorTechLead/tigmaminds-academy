import { useState } from 'react';

// ── Click to Explore — Plant Anatomy ─────────────────────────
// Interactive plant diagram: click any part (root, stem, leaf,
// flower, fruit) to highlight it and see its function.
// Pulses gently to invite interaction.

type Part = 'roots' | 'stem' | 'leaf' | 'flower' | 'fruit' | null;

const PART_INFO: Record<string, { title: string; desc: string; color: string }> = {
  roots: {
    title: 'Roots',
    desc: 'Anchor the plant, absorb water and minerals from soil, store food (starch). Root hairs multiply surface area by 100×.',
    color: '#92400e',
  },
  stem: {
    title: 'Stem',
    desc: 'Supports leaves and flowers, transports water up (xylem) and sugar down (phloem). In trees, old xylem becomes wood.',
    color: '#4d7c0f',
  },
  leaf: {
    title: 'Leaves',
    desc: 'Photosynthesis factory — captures sunlight, takes in CO₂, releases O₂. Stomata on the underside control gas exchange.',
    color: '#15803d',
  },
  flower: {
    title: 'Flower',
    desc: 'Reproductive organ. Petals attract pollinators, anthers produce pollen (male), stigma receives pollen (female), ovary becomes fruit.',
    color: '#be185d',
  },
  fruit: {
    title: 'Fruit',
    desc: 'Developed from the ovary after fertilization. Protects seeds and aids dispersal — by wind, water, animals, or explosion.',
    color: '#dc2626',
  },
};

export default function TejimolaPlantReproDiagram() {
  const [selected, setSelected] = useState<Part>(null);

  const isActive = (part: Part) => selected === part;
  const opacity = (part: Part) => selected === null ? 0.85 : isActive(part) ? 1 : 0.3;
  const stroke = (part: Part) => isActive(part) ? 'white' : 'none';
  const strokeW = (part: Part) => isActive(part) ? 2 : 0;

  const W = 400, H = 450;
  const cx = 200;

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-slate-50 to-amber-50 dark:from-emerald-950 dark:via-slate-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Click to Explore — Plant Anatomy
        </p>
        {selected && (
          <button
            onClick={() => setSelected(null)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs" role="img"
          aria-label="Interactive plant diagram — click each part to learn about it">

          {/* ── Soil ── */}
          <rect x="0" y="340" width={W} height="110" fill="#451a03" opacity="0.4" rx="0" />

          {/* ── Roots ── */}
          <g onClick={() => setSelected(selected === 'roots' ? null : 'roots')}
            className="cursor-pointer" opacity={opacity('roots')}>
            <path d={`M ${cx},340 L ${cx - 60},400 M ${cx},340 L ${cx + 70},410 M ${cx},340 L ${cx},430 M ${cx - 60},400 L ${cx - 90},420 M ${cx + 70},410 L ${cx + 100},430`}
              stroke="#92400e" strokeWidth="4" fill="none" strokeLinecap="round"
              style={{ filter: isActive('roots') ? 'drop-shadow(0 0 6px #fbbf24)' : 'none' }} />
            {/* Root hairs */}
            {[-60, -30, 0, 40, 70].map((dx, i) => (
              <line key={`rh-${i}`}
                x1={cx + dx} y1={370 + i * 8}
                x2={cx + dx + (i % 2 === 0 ? -15 : 15)} y2={375 + i * 8}
                stroke="#b45309" strokeWidth="1" opacity="0.6" />
            ))}
            <text x={cx} y={H - 5} textAnchor="middle" fill="#fbbf24" fontSize="10"
              stroke={stroke('roots')} strokeWidth={strokeW('roots') * 0.3}>
              Roots
            </text>
          </g>

          {/* ── Stem ── */}
          <g onClick={() => setSelected(selected === 'stem' ? null : 'stem')}
            className="cursor-pointer" opacity={opacity('stem')}>
            <rect x={cx - 6} y="130" width="12" height="210" fill="#4d7c0f" rx="4"
              stroke={stroke('stem')} strokeWidth={strokeW('stem')}
              style={{ filter: isActive('stem') ? 'drop-shadow(0 0 6px #84cc16)' : 'none' }} />
            {/* Nodes */}
            {[180, 230, 280].map(ny => (
              <ellipse key={`node-${ny}`} cx={cx} cy={ny} rx="8" ry="3" fill="#365314" />
            ))}
          </g>

          {/* ── Leaves ── */}
          <g onClick={() => setSelected(selected === 'leaf' ? null : 'leaf')}
            className="cursor-pointer" opacity={opacity('leaf')}>
            {[
              { x: cx - 50, y: 180, rot: -30, rx: 30, ry: 12 },
              { x: cx + 50, y: 170, rot: 25, rx: 28, ry: 11 },
              { x: cx - 45, y: 230, rot: -20, rx: 25, ry: 10 },
              { x: cx + 48, y: 240, rot: 15, rx: 26, ry: 10 },
              { x: cx - 30, y: 280, rot: -35, rx: 22, ry: 9 },
              { x: cx + 35, y: 290, rot: 30, rx: 24, ry: 9 },
            ].map((l, i) => (
              <g key={`leaf-${i}`}>
                <line x1={cx} y1={l.y} x2={l.x} y2={l.y} stroke="#4d7c0f" strokeWidth="1.5" />
                <ellipse cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} fill="#22c55e"
                  transform={`rotate(${l.rot}, ${l.x}, ${l.y})`}
                  stroke={stroke('leaf')} strokeWidth={strokeW('leaf')}
                  style={{ filter: isActive('leaf') ? 'drop-shadow(0 0 6px #4ade80)' : 'none' }} />
                {/* Leaf vein */}
                <line x1={l.x - l.rx * 0.6 * Math.cos(l.rot * Math.PI / 180)}
                  y1={l.y - l.rx * 0.6 * Math.sin(l.rot * Math.PI / 180)}
                  x2={l.x + l.rx * 0.6 * Math.cos(l.rot * Math.PI / 180)}
                  y2={l.y + l.rx * 0.6 * Math.sin(l.rot * Math.PI / 180)}
                  stroke="#166534" strokeWidth="0.5" opacity="0.5" />
              </g>
            ))}
          </g>

          {/* ── Flower ── */}
          <g onClick={() => setSelected(selected === 'flower' ? null : 'flower')}
            className="cursor-pointer" opacity={opacity('flower')}>
            {/* Petals */}
            {[0, 1, 2, 3, 4].map(i => {
              const angle = (i * 72 - 90) * Math.PI / 180;
              const px = cx + Math.cos(angle) * 22;
              const py = 105 + Math.sin(angle) * 18;
              return (
                <ellipse key={`petal-${i}`} cx={px} cy={py} rx="14" ry="9" fill="#f472b6"
                  transform={`rotate(${i * 72 - 90}, ${px}, ${py})`}
                  stroke={stroke('flower')} strokeWidth={strokeW('flower')}
                  style={{ filter: isActive('flower') ? 'drop-shadow(0 0 6px #f472b6)' : 'none' }} />
              );
            })}
            {/* Center */}
            <circle cx={cx} cy={105} r="8" fill="#fbbf24" />
            {/* Stigma */}
            <circle cx={cx} cy={98} r="3" fill="#16a34a" />
          </g>

          {/* ── Fruit ── */}
          <g onClick={() => setSelected(selected === 'fruit' ? null : 'fruit')}
            className="cursor-pointer" opacity={opacity('fruit')}>
            <ellipse cx={cx + 35} cy={120} rx="12" ry="16" fill="#dc2626"
              stroke={stroke('fruit')} strokeWidth={strokeW('fruit')}
              style={{ filter: isActive('fruit') ? 'drop-shadow(0 0 6px #ef4444)' : 'none' }} />
            <line x1={cx + 35} y1={104} x2={cx + 35} y2={98} stroke="#4d7c0f" strokeWidth="1.5" />
            {/* Seeds inside */}
            <circle cx={cx + 33} cy={118} r="2" fill="#fef9c3" opacity="0.6" />
            <circle cx={cx + 37} cy={122} r="2" fill="#fef9c3" opacity="0.6" />
          </g>

          {/* Prompt text */}
          {!selected && (
            <text x={cx} y={25} textAnchor="middle" fill="#86efac" fontSize="10" opacity="0.6">
              ↑ Click any part to learn about it
            </text>
          )}
        </svg>

        {/* Info panel */}
        <div className="flex-1 min-w-[200px]">
          {selected ? (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-bold mb-2" style={{ color: PART_INFO[selected].color === '#15803d' ? '#4ade80' : PART_INFO[selected].color }}>
                {PART_INFO[selected].title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {PART_INFO[selected].desc}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm py-8">
              Click a plant part to explore its function
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
