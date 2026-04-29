/**
 * Tara holds up a butterfly. A vertical line down the middle is the axis of
 * bilateral symmetry: every dot on the left wing has a mirror partner on
 * the right. Beside her: a starfish showing 5-fold radial symmetry.
 *
 * Used to open the Symmetry in Biology section.
 */
import Tara from './people/Tara';

export default function ButterflySymmetryDiagram() {
  const W = 760, H = 380;

  // Butterfly geometry — body vertical at bcx
  const bcx = 280, bcy = 200;
  const wingW = 100, wingH = 80;

  // Starfish — 5 radial arms
  const scx = 580, scy = 200;
  const armLen = 70;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A butterfly has bilateral (mirror) symmetry; a starfish has 5-fold radial symmetry">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Two kinds of symmetry
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Butterflies fold; starfish rotate.
        </text>

        {/* Tara on far left */}
        <Tara x={100} y={350} scale={1.0} pose="pointing" />

        {/* BUTTERFLY (left half) */}
        {/* Body */}
        <ellipse cx={bcx} cy={bcy} rx="6" ry="32" fill="#451a03" stroke="#1c1917" strokeWidth="1.2" />
        {/* Antennae */}
        <path d={`M ${bcx - 3} ${bcy - 30} Q ${bcx - 14} ${bcy - 50} ${bcx - 18} ${bcy - 60}`} fill="none" stroke="#1c1917" strokeWidth="1.4" />
        <path d={`M ${bcx + 3} ${bcy - 30} Q ${bcx + 14} ${bcy - 50} ${bcx + 18} ${bcy - 60}`} fill="none" stroke="#1c1917" strokeWidth="1.4" />
        <circle cx={bcx - 18} cy={bcy - 60} r="2" fill="#1c1917" />
        <circle cx={bcx + 18} cy={bcy - 60} r="2" fill="#1c1917" />

        {/* Wings — drawn symmetrically using mirroring */}
        {[-1, 1].map((side) => (
          <g key={side}>
            {/* Upper wing */}
            <path
              d={`M ${bcx + side * 5} ${bcy - 20}
                  Q ${bcx + side * 60} ${bcy - 60} ${bcx + side * 90} ${bcy - 30}
                  Q ${bcx + side * 80} ${bcy + 5} ${bcx + side * 5} ${bcy - 5} Z`}
              fill="#f97316" stroke="#7c2d12" strokeWidth="1.4" />
            {/* Lower wing */}
            <path
              d={`M ${bcx + side * 5} ${bcy + 5}
                  Q ${bcx + side * 50} ${bcy + 30} ${bcx + side * 60} ${bcy + 60}
                  Q ${bcx + side * 30} ${bcy + 50} ${bcx + side * 5} ${bcy + 25} Z`}
              fill="#fb923c" stroke="#7c2d12" strokeWidth="1.4" />
            {/* Wing dots — at mirrored positions */}
            <circle cx={bcx + side * 40} cy={bcy - 30} r="6" fill="#7c2d12" />
            <circle cx={bcx + side * 65} cy={bcy - 25} r="4" fill="#fef9c3" />
            <circle cx={bcx + side * 35} cy={bcy + 30} r="4" fill="#7c2d12" />
          </g>
        ))}

        {/* Mirror axis through butterfly */}
        <line x1={bcx} y1={bcy - 90} x2={bcx} y2={bcy + 90}
          stroke="#dc2626" strokeWidth="2" strokeDasharray="6 4" />
        <text x={bcx} y={bcy - 100} textAnchor="middle" fontSize="11" fontWeight="700" fill="#dc2626">
          mirror axis
        </text>

        {/* Label below butterfly */}
        <text x={bcx} y={350} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Bilateral symmetry
        </text>
        <text x={bcx} y={366} textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          1 mirror line
        </text>

        {/* STARFISH on right */}
        {(() => {
          const pts: string[] = [];
          for (let i = 0; i < 10; i++) {
            const a = (-Math.PI / 2) + (i * Math.PI) / 5;
            const r = i % 2 === 0 ? armLen : armLen * 0.4;
            pts.push(`${scx + r * Math.cos(a)},${scy + r * Math.sin(a)}`);
          }
          return (
            <polygon points={pts.join(' ')}
              fill="#fb923c" stroke="#7c2d12" strokeWidth="1.6" />
          );
        })()}
        {/* Centre */}
        <circle cx={scx} cy={scy} r="10" fill="#7c2d12" />
        {/* Bumps on each arm */}
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (-Math.PI / 2) + (i * 2 * Math.PI) / 5;
          const bx = scx + armLen * 0.55 * Math.cos(a);
          const by = scy + armLen * 0.55 * Math.sin(a);
          return <circle key={i} cx={bx} cy={by} r="3" fill="#fef9c3" />;
        })}

        {/* 5 rotational axes */}
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (-Math.PI / 2) + (i * 2 * Math.PI) / 5;
          const x2 = scx + (armLen + 22) * Math.cos(a);
          const y2 = scy + (armLen + 22) * Math.sin(a);
          return <line key={i} x1={scx} y1={scy} x2={x2} y2={y2}
            stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />;
        })}

        {/* Label below starfish */}
        <text x={scx} y={350} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Radial symmetry
        </text>
        <text x={scx} y={366} textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          5 rotation axes
        </text>
      </svg>
    </div>
  );
}
