export default function MolecularMotionDiagram() {
  // Seeded pseudo-random for consistent layout
  const seed = (n: number) => {
    let x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const panelW = 160;
  const panelH = 140;
  const gap = 20;
  const startX = 20;
  const startY = 20;
  const r = 5;

  // Solid: ordered grid
  const solidMolecules: { cx: number; cy: number }[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      solidMolecules.push({
        cx: startX + 30 + col * 22,
        cy: startY + 25 + row * 24,
      });
    }
  }

  // Liquid: loosely packed
  const liquidMolecules: { cx: number; cy: number }[] = [];
  const lx = startX + panelW + gap;
  for (let i = 0; i < 18; i++) {
    liquidMolecules.push({
      cx: lx + 15 + seed(i * 2) * (panelW - 30),
      cy: startY + 15 + seed(i * 2 + 1) * (panelH - 40),
    });
  }

  // Gas: widely scattered
  const gasMolecules: { cx: number; cy: number }[] = [];
  const gx = startX + 2 * (panelW + gap);
  for (let i = 0; i < 15; i++) {
    gasMolecules.push({
      cx: gx + 15 + seed(i * 3 + 50) * (panelW - 30),
      cy: startY + 15 + seed(i * 3 + 51) * (panelH - 40),
    });
  }

  // Arrow helper for motion direction
  const Arrow = ({ x, y, dx, dy, color }: { x: number; y: number; dx: number; dy: number; color: string }) => {
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;
    const nx = dx / len;
    const ny = dy / len;
    return (
      <line
        x1={x} y1={y}
        x2={x + dx} y2={y + dy}
        stroke={color} strokeWidth="1.2"
        markerEnd="none"
      />
    );
  };

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 200" className="w-full max-w-2xl mx-auto" role="img" aria-label="Molecular motion in solid, liquid, and gas states">
        <style>{`
          @keyframes vibrate {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(1px, -1px); }
            50% { transform: translate(-1px, 1px); }
            75% { transform: translate(1px, 1px); }
          }
          @keyframes drift {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(3px, -2px); }
            50% { transform: translate(-2px, 3px); }
            75% { transform: translate(2px, -1px); }
          }
          @keyframes fly {
            0%, 100% { transform: translate(0, 0); }
            20% { transform: translate(5px, -4px); }
            40% { transform: translate(-4px, 6px); }
            60% { transform: translate(6px, 2px); }
            80% { transform: translate(-3px, -5px); }
          }
          .mol-solid { animation: vibrate 0.4s ease-in-out infinite; }
          .mol-liquid { animation: drift 1.5s ease-in-out infinite; }
          .mol-gas { animation: fly 1.2s ease-in-out infinite; }
        `}</style>

        {/* ======== SOLID ======== */}
        <rect x={startX} y={startY} width={panelW} height={panelH} rx={6} fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1.5" />
        <text x={startX + panelW / 2} y={startY - 5} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="700">Solid</text>

        {solidMolecules.map((m, i) => (
          <g key={`s${i}`} className="mol-solid" style={{ animationDelay: `${i * 30}ms` }}>
            <circle cx={m.cx} cy={m.cy} r={r} className="fill-blue-400 dark:fill-blue-500 stroke-blue-600 dark:stroke-blue-400" strokeWidth="0.8" />
            {/* Small vibration arrows */}
            <line x1={m.cx + 6} y1={m.cy} x2={m.cx + 9} y2={m.cy - 2} className="stroke-blue-400" strokeWidth="0.8" opacity={0.6} />
          </g>
        ))}

        <text x={startX + panelW / 2} y={startY + panelH + 16} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="600">Low T</text>
        <text x={startX + panelW / 2} y={startY + panelH + 30} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Fixed positions, vibrate</text>

        {/* ======== LIQUID ======== */}
        <rect x={lx} y={startY} width={panelW} height={panelH} rx={6} fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1.5" />
        <text x={lx + panelW / 2} y={startY - 5} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="700">Liquid</text>

        {liquidMolecules.map((m, i) => {
          const adx = (seed(i * 5 + 10) - 0.5) * 12;
          const ady = (seed(i * 5 + 11) - 0.5) * 12;
          return (
            <g key={`l${i}`} className="mol-liquid" style={{ animationDelay: `${i * 80}ms` }}>
              <circle cx={m.cx} cy={m.cy} r={r} className="fill-teal-400 dark:fill-teal-500 stroke-teal-600 dark:stroke-teal-400" strokeWidth="0.8" />
              <line x1={m.cx + r} y1={m.cy} x2={m.cx + r + adx * 0.5} y2={m.cy + ady * 0.5} className="stroke-teal-500" strokeWidth="0.8" opacity={0.5} />
            </g>
          );
        })}

        <text x={lx + panelW / 2} y={startY + panelH + 16} textAnchor="middle" className="fill-teal-600 dark:fill-teal-400" fontSize="11" fontWeight="600">Medium T</text>
        <text x={lx + panelW / 2} y={startY + panelH + 30} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Slide past each other</text>

        {/* ======== GAS ======== */}
        <rect x={gx} y={startY} width={panelW} height={panelH} rx={6} fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1.5" />
        <text x={gx + panelW / 2} y={startY - 5} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="700">Gas</text>

        {gasMolecules.map((m, i) => {
          const adx = (seed(i * 7 + 30) - 0.5) * 24;
          const ady = (seed(i * 7 + 31) - 0.5) * 24;
          return (
            <g key={`g${i}`} className="mol-gas" style={{ animationDelay: `${i * 60}ms` }}>
              <circle cx={m.cx} cy={m.cy} r={r - 1} className="fill-red-400 dark:fill-red-500 stroke-red-600 dark:stroke-red-400" strokeWidth="0.8" />
              <line x1={m.cx} y1={m.cy} x2={m.cx + adx * 0.6} y2={m.cy + ady * 0.6} className="stroke-red-400" strokeWidth="1" opacity={0.6} />
              {/* Arrowhead */}
              <circle cx={m.cx + adx * 0.6} cy={m.cy + ady * 0.6} r={1} className="fill-red-400" opacity={0.6} />
            </g>
          );
        })}

        <text x={gx + panelW / 2} y={startY + panelH + 16} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="600">High T</text>
        <text x={gx + panelW / 2} y={startY + panelH + 30} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Fast, random directions</text>

        {/* Temperature arrow across bottom */}
        <line x1={60} y1={192} x2={480} y2={192} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <polygon points="480,192 474,189 474,195" className="fill-gray-400 dark:fill-gray-500" />
        <text x={270} y={200} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Increasing temperature & kinetic energy →</text>
      </svg>
    </div>
  );
}
