/**
 * Lost-wax casting steps: sculpt in wax → encase in mould → melt wax out →
 * pour metal → break mould to reveal. Five-step strip.
 *
 * Used in the "Lost-Wax Casting — Turning Wax into Metal" section.
 */
export default function MatLostWaxDiagram() {
  const W = 740, H = 230;
  const steps = [
    { t: '1. Wax model', c: '#f59e0b' },
    { t: '2. Encase', c: '#78716c' },
    { t: '3. Melt out', c: '#dc2626' },
    { t: '4. Pour metal', c: '#ea580c' },
    { t: '5. Reveal', c: '#16a34a' },
  ];
  const boxW = 122, gap = 16, ox = 24, y = 80, cy = 130;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Lost-wax casting in five steps: sculpt a wax model, encase it in a mould, melt the wax out, pour in molten metal, then break the mould to reveal the metal object.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="42" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Lost-wax casting: wax becomes metal</text>
        {steps.map((s, i) => {
          const x = ox + i * (boxW + gap);
          return (
            <g key={i}>
              <rect x={x} y={y} width={boxW} height="100" rx="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" className="dark:fill-gray-800 dark:stroke-gray-600" />
              {/* simple glyph */}
              {i === 0 && <circle cx={x + boxW / 2} cy={cy} r="20" fill="#fde68a" stroke={s.c} strokeWidth="2" className="dark:fill-amber-700/50" />}
              {i === 1 && <rect x={x + boxW / 2 - 22} y={cy - 22} width="44" height="44" rx="4" fill="#d6d3d1" stroke={s.c} strokeWidth="2" className="dark:fill-stone-600" />}
              {i === 2 && <g><rect x={x + boxW / 2 - 22} y={cy - 22} width="44" height="44" rx="4" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="1.5" className="dark:fill-stone-700" /><path d={`M${x + boxW / 2} ${cy - 14} q8 14 0 22 q-8 -8 0 -22`} fill={s.c} /></g>}
              {i === 3 && <g><rect x={x + boxW / 2 - 22} y={cy - 22} width="44" height="44" rx="4" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="1.5" className="dark:fill-stone-700" /><path d={`M${x + boxW / 2} ${cy - 16} l7 16 l-7 12 l-7 -12 z`} fill={s.c} /></g>}
              {i === 4 && <circle cx={x + boxW / 2} cy={cy} r="20" fill="#bbf7d0" stroke={s.c} strokeWidth="2" className="dark:fill-green-800/50" />}
              <text x={x + boxW / 2} y={y + 92} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155" className="dark:fill-gray-100">{s.t}</text>
              {i < steps.length - 1 && <line x1={x + boxW} y1={cy} x2={x + boxW + gap} y2={cy} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#mlw-a)" />}
            </g>
          );
        })}
        <defs><marker id="mlw-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" /></marker></defs>
      </svg>
    </div>
  );
}
