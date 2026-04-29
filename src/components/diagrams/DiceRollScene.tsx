/**
 * Tara and Bipin sit on the floor playing with a six-sided die. Each face
 * has equal chance — 1/6. The diagram shows the die mid-air with the six
 * possible outcomes laid out as faces around it.
 *
 * Used to open the Probability section.
 */
import Tara from './people/Tara';
import Bipin from './people/Bipin';

export default function DiceRollScene() {
  const W = 760, H = 380;
  const groundY = 320;

  // Six dice faces shown in a row
  const faces = [1, 2, 3, 4, 5, 6];
  const faceW = 60, faceGap = 16;
  const totalW = faces.length * faceW + (faces.length - 1) * faceGap;
  const startX = (W - totalW) / 2;

  // Pip positions for each face (relative to face centre, square 60×60)
  const pipFor = (n: number): [number, number][] => {
    const c = 0; const o = 16;
    if (n === 1) return [[c, c]];
    if (n === 2) return [[-o, -o], [o, o]];
    if (n === 3) return [[-o, -o], [c, c], [o, o]];
    if (n === 4) return [[-o, -o], [o, -o], [-o, o], [o, o]];
    if (n === 5) return [[-o, -o], [o, -o], [c, c], [-o, o], [o, o]];
    return [[-o, -o], [o, -o], [-o, c], [o, c], [-o, o], [o, o]]; // 6
  };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara and Bipin roll a die: six equally-likely outcomes, each probability 1/6">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="290" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Six faces, six chances
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Every face: probability = 1/6 ≈ 16.7%.
        </text>

        {/* Tara on left */}
        <Tara x={90} y={groundY} scale={0.95} pose="thinking" />
        {/* Bipin on right */}
        <Bipin x={W - 90} y={groundY} scale={0.95} pose="standing" flip={true} />

        {/* Six faces shown in a row */}
        {faces.map((n, i) => {
          const x = startX + i * (faceW + faceGap);
          const y = 200;
          return (
            <g key={n}>
              {/* Die face */}
              <rect x={x} y={y} width={faceW} height={faceW} rx="8"
                fill="white" stroke="#0f172a" strokeWidth="2" />
              {/* Pips */}
              {pipFor(n).map(([dx, dy], j) => (
                <circle key={j} cx={x + faceW / 2 + dx} cy={y + faceW / 2 + dy} r="4" fill="#0f172a" />
              ))}
              {/* Probability label below */}
              <rect x={x + 4} y={y + faceW + 6} width={faceW - 8} height="22" rx="11"
                fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
              <text x={x + faceW / 2} y={y + faceW + 21} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
                1 / 6
              </text>
            </g>
          );
        })}

        {/* Footer */}
        <rect x={W / 2 - 240} y={H - 30} width="480" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          The six probabilities sum to 6 × (1/6) = 1. (Something *must* happen.)
        </text>
      </svg>
    </div>
  );
}
