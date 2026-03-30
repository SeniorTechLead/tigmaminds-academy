export default function FireflyKuramotoDiagram() {
  const w = 520, h = 400;

  // Oscillator positions in a ring
  const oscCount = 6;
  const centerX = 150;
  const centerY = 170;
  const radius = 70;

  // Before sync: random angles
  const beforeAngles = [0.3, 1.8, 4.2, 2.7, 5.5, 0.9];
  // After sync: nearly aligned
  const afterAngles = [1.5, 1.55, 1.48, 1.52, 1.5, 1.47];

  const handLen = 22;

  const oscPositions = Array.from({ length: oscCount }).map((_, i) => {
    const angle = (i / oscCount) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Kuramoto coupling model: oscillators with clock hands syncing through neighbor coupling forces">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Kuramoto Coupling Model</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Each oscillator adjusts its phase toward its neighbors</text>

        {/* --- BEFORE (left) --- */}
        <text x={centerX} y="72" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="600">Before: Out of Sync</text>

        {/* Coupling arrows between neighbors (before) */}
        {oscPositions.map((pos, i) => {
          const next = oscPositions[(i + 1) % oscCount];
          return (
            <line
              key={`coupB${i}`}
              x1={centerX + pos.x}
              y1={centerY + pos.y}
              x2={centerX + next.x}
              y2={centerY + next.y}
              stroke="#f59e0b"
              strokeWidth="0.8"
              strokeDasharray="3 3"
              opacity="0.4"
            />
          );
        })}

        {/* Oscillators (before) */}
        {oscPositions.map((pos, i) => {
          const ox = centerX + pos.x;
          const oy = centerY + pos.y;
          const angle = beforeAngles[i];
          const hx = ox + Math.cos(angle) * handLen;
          const hy = oy + Math.sin(angle) * handLen;
          return (
            <g key={`bOsc${i}`}>
              <circle cx={ox} cy={oy} r="18" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
              <circle cx={ox} cy={oy} r="3" className="fill-gray-500 dark:fill-slate-400" />
              {/* Clock hand */}
              <line x1={ox} y1={oy} x2={hx} y2={hy} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              <circle cx={hx} cy={hy} r="3" fill="#ef4444" />
            </g>
          );
        })}

        {/* --- ARROW between --- */}
        <line x1="240" y1="170" x2="280" y2="170" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#kuraArrow)" />
        <text x="260" y="158" textAnchor="middle" fill="#f59e0b" fontSize="8">N steps</text>

        {/* --- AFTER (right) --- */}
        <text x="380" y="72" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="600">After: Synchronized!</text>

        {/* Coupling arrows between neighbors (after) */}
        {oscPositions.map((pos, i) => {
          const next = oscPositions[(i + 1) % oscCount];
          return (
            <line
              key={`coupA${i}`}
              x1={380 + pos.x}
              y1={centerY + pos.y}
              x2={380 + next.x}
              y2={centerY + next.y}
              stroke="#4ade80"
              strokeWidth="0.8"
              opacity="0.3"
            />
          );
        })}

        {/* Oscillators (after) */}
        {oscPositions.map((pos, i) => {
          const ox = 380 + pos.x;
          const oy = centerY + pos.y;
          const angle = afterAngles[i];
          const hx = ox + Math.cos(angle) * handLen;
          const hy = oy + Math.sin(angle) * handLen;
          return (
            <g key={`aOsc${i}`}>
              <circle cx={ox} cy={oy} r="18" className="fill-gray-100 dark:fill-slate-800" stroke="#4ade80" strokeWidth="1" opacity="0.8" />
              <circle cx={ox} cy={oy} r="3" fill="#4ade80" />
              {/* Clock hand - all pointing same way */}
              <line x1={ox} y1={oy} x2={hx} y2={hy} stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
              <circle cx={hx} cy={hy} r="3" fill="#4ade80" />
              {/* Glow */}
              <circle cx={ox} cy={oy} r="22" fill="#4ade80" opacity="0.06" />
            </g>
          );
        })}

        {/* Coupling force explanation */}
        <rect x="30" y="275" width="460" height="50" rx="6" className="fill-white dark:fill-slate-950" stroke="#f59e0b" strokeWidth="1" />
        <text x={w / 2} y="293" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Coupling rule: dθᵢ/dt = ωᵢ + (K/N) × Σ sin(θⱼ − θᵢ)</text>
        <text x={w / 2} y="310" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Each oscillator nudges its phase toward the average of its neighbors</text>
        <text x={w / 2} y="320" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">K = coupling strength — higher K means faster sync</text>

        {/* Key insight */}
        <rect x="60" y="340" width="400" height="44" rx="6" className="fill-white dark:fill-slate-950" stroke="#4ade80" strokeWidth="1" />
        <text x={w / 2} y="358" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="600">No conductor. No leader. Pure neighbor interaction → group sync.</text>
        <text x={w / 2} y="374" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">This is exactly how real fireflies synchronize on Majuli riverbanks</text>

        <defs>
          <marker id="kuraArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
