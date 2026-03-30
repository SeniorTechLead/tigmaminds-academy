export default function ParticleModelDiagram() {
  const solidParticles = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      solidParticles.push({ x: 35 + col * 22, y: 70 + row * 22 });
    }
  }

  const liquidParticles = [
    { x: 210, y: 72 }, { x: 230, y: 78 }, { x: 250, y: 68 },
    { x: 215, y: 95 }, { x: 238, y: 92 }, { x: 258, y: 88 },
    { x: 222, y: 115 }, { x: 245, y: 112 }, { x: 265, y: 108 },
    { x: 210, y: 135 }, { x: 233, y: 130 }, { x: 255, y: 128 },
    { x: 220, y: 152 }, { x: 242, y: 148 }, { x: 260, y: 145 },
  ];

  const gasParticles = [
    { x: 400, y: 55 }, { x: 445, y: 70 }, { x: 420, y: 100 },
    { x: 460, y: 48 }, { x: 395, y: 130 }, { x: 455, y: 120 },
    { x: 415, y: 155 }, { x: 450, y: 155 }, { x: 430, y: 80 },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 575 247" className="w-full max-w-xl mx-auto" role="img" aria-label="Particle model showing solid, liquid, and gas states">
        {/* Solid container */}
        <rect x="15" y="40" width="140" height="130" rx="4" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <text x="85" y="30" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="12" fontWeight="bold">Solid</text>
        {solidParticles.map((p, i) => (
          <circle key={`s${i}`} cx={p.x} cy={p.y} r="9" className="fill-blue-400 dark:fill-blue-500 stroke-blue-600 dark:stroke-blue-400" strokeWidth="1" />
        ))}
        <text x="85" y="185" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Tight, ordered grid</text>
        <text x="85" y="197" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Vibrate in place</text>

        {/* Liquid container */}
        <rect x="195" y="40" width="140" height="130" rx="4" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <text x="265" y="30" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="bold">Liquid</text>
        {liquidParticles.map((p, i) => (
          <circle key={`l${i}`} cx={p.x} cy={p.y} r="9" className="fill-emerald-400 dark:fill-emerald-500 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1" />
        ))}
        <text x="265" y="185" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Close but random</text>
        <text x="265" y="197" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Slide past each other</text>

        {/* Gas container */}
        <rect x="375" y="40" width="140" height="130" rx="4" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <text x="445" y="30" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="12" fontWeight="bold">Gas</text>
        {gasParticles.map((p, i) => (
          <g key={`g${i}`}>
            <circle cx={p.x} cy={p.y} r="8" className="fill-red-400 dark:fill-red-500 stroke-red-600 dark:stroke-red-400" strokeWidth="1" />
            {/* Motion arrows */}
            <line
              x1={p.x + 10} y1={p.y - 2}
              x2={p.x + 18} y2={p.y - 6}
              className="stroke-red-300 dark:stroke-red-400" strokeWidth="1" markerEnd="url(#gasArrow)"
            />
          </g>
        ))}
        <text x="445" y="185" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Far apart, fast</text>
        <text x="445" y="197" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Move freely</text>

        {/* Energy arrows between states */}
        <text x="160" y="108" textAnchor="middle" className="fill-amber-500 dark:fill-amber-400" fontSize="18">→</text>
        <text x="160" y="122" textAnchor="middle" className="fill-amber-500 dark:fill-amber-400" fontSize="10">+heat</text>
        <text x="340" y="108" textAnchor="middle" className="fill-amber-500 dark:fill-amber-400" fontSize="18">→</text>
        <text x="340" y="122" textAnchor="middle" className="fill-amber-500 dark:fill-amber-400" fontSize="10">+heat</text>

        <defs>
          <marker id="gasArrow" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" className="fill-red-300 dark:fill-red-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
