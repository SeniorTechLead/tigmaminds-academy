export default function SymmetryTypesMandala() {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Butterfly wing (bilateral) helper
  const butterflyWing = (cx: number, cy: number, side: 1 | -1) => {
    const s = side;
    return `M ${cx},${cy - 30}
      C ${cx + s * 35},${cy - 50} ${cx + s * 50},${cy - 25} ${cx + s * 40},${cy}
      C ${cx + s * 50},${cy + 20} ${cx + s * 35},${cy + 40} ${cx},${cy + 25} Z`;
  };

  // Rotational flower petals (6-fold)
  const petalCount = 6;
  const petalAngle = 360 / petalCount;
  const flowerCx = 335;
  const flowerCy = 175;
  const petalR = 42;

  // Mandala ring petals (8-fold, both symmetries)
  const mandalaCx = 545;
  const mandalaCy = 175;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 670 370"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Three types of symmetry: bilateral, rotational, and combined in a mandala"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .sub { font-family: system-ui, sans-serif; font-size: 10px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
        `}</style>

        <rect width="670" height="370" rx="8" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="335" y="30" textAnchor="middle" className="title fill-amber-300">
          Three Types of Symmetry
        </text>

        {/* === Panel 1: Bilateral Symmetry (Butterfly) === */}
        <g>
          {/* Left wing */}
          <path d={butterflyWing(120, 175, -1)} fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="1.5" />
          {/* Right wing */}
          <path d={butterflyWing(120, 175, 1)} fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="1.5" />
          {/* Wing markings */}
          <circle cx={85} cy={165} r={10} fill="#a78bfa" opacity={0.5} />
          <circle cx={155} cy={165} r={10} fill="#a78bfa" opacity={0.5} />
          <circle cx={78} cy={185} r={6} fill="#a78bfa" opacity={0.4} />
          <circle cx={162} cy={185} r={6} fill="#a78bfa" opacity={0.4} />
          {/* Body */}
          <ellipse cx={120} cy={175} rx={4} ry={28} fill="#7c3aed" />
          {/* Antennae */}
          <path d="M 118,148 Q 105,125 98,118" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx={97} cy={117} r={2.5} fill="#7c3aed" />
          <path d="M 122,148 Q 135,125 142,118" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx={143} cy={117} r={2.5} fill="#7c3aed" />

          {/* Mirror line */}
          <line x1={120} y1={95} x2={120} y2={255} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x={120} y={268} textAnchor="middle" className="sub fill-amber-400">mirror line</text>

          {/* Label */}
          <text x={120} y={298} textAnchor="middle" className="label fill-purple-300">Bilateral</text>
          <text x={120} y={314} textAnchor="middle" className="sub fill-slate-400">1 mirror line</text>
          <text x={120} y={328} textAnchor="middle" className="sub fill-slate-400">Left = Right</text>
        </g>

        {/* === Panel 2: Rotational Symmetry (6-fold flower) === */}
        <g>
          {/* Petals */}
          {Array.from({ length: petalCount }).map((_, i) => {
            const angle = i * petalAngle - 90;
            const rad = toRad(angle);
            const tipX = flowerCx + Math.cos(rad) * petalR;
            const tipY = flowerCy + Math.sin(rad) * petalR;
            const leftRad = toRad(angle - 20);
            const rightRad = toRad(angle + 20);
            const baseR = petalR * 0.3;
            return (
              <path
                key={i}
                d={`M ${flowerCx},${flowerCy}
                    L ${flowerCx + Math.cos(leftRad) * baseR},${flowerCy + Math.sin(leftRad) * baseR}
                    Q ${(flowerCx + tipX) / 2 + Math.cos(leftRad) * 5},${(flowerCy + tipY) / 2 + Math.sin(leftRad) * 5} ${tipX},${tipY}
                    Q ${(flowerCx + tipX) / 2 + Math.cos(rightRad) * 5},${(flowerCy + tipY) / 2 + Math.sin(rightRad) * 5} ${flowerCx + Math.cos(rightRad) * baseR},${flowerCy + Math.sin(rightRad) * baseR}
                    Z`}
                fill="#fca5a5"
                stroke="#ef4444"
                strokeWidth="1"
                opacity={0.85}
              />
            );
          })}
          {/* Center */}
          <circle cx={flowerCx} cy={flowerCy} r={10} fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />

          {/* Rotation arrow */}
          <path
            d={`M ${flowerCx + 52},${flowerCy - 15} A 55,55 0 0,1 ${flowerCx + 52},${flowerCy + 15}`}
            fill="none" stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#rotArrow)"
          />
          <defs>
            <marker id="rotArrow" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <polygon points="0,0 7,2.5 0,5" fill="#22d3ee" />
            </marker>
          </defs>
          <text x={flowerCx + 65} y={flowerCy + 5} className="sub fill-cyan-400" textAnchor="start">
            60 each
          </text>

          {/* Label */}
          <text x={flowerCx} y={298} textAnchor="middle" className="label fill-red-300">Rotational</text>
          <text x={flowerCx} y={314} textAnchor="middle" className="sub fill-slate-400">6-fold: 360/6 = 60</text>
          <text x={flowerCx} y={328} textAnchor="middle" className="sub fill-slate-400">Rotate and it looks the same</text>
        </g>

        {/* === Panel 3: Both Combined (Mandala ring) === */}
        <g>
          {/* Outer ring */}
          <circle cx={mandalaCx} cy={mandalaCy} r={60} fill="none" stroke="#4ade80" strokeWidth="1" opacity={0.3} />
          <circle cx={mandalaCx} cy={mandalaCy} r={45} fill="none" stroke="#4ade80" strokeWidth="0.8" opacity={0.2} />

          {/* 8 teardrop petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = i * 45;
            const rad = toRad(angle - 90);
            const tipX = mandalaCx + Math.cos(rad) * 50;
            const tipY = mandalaCy + Math.sin(rad) * 50;
            const lRad = toRad(angle - 90 - 15);
            const rRad = toRad(angle - 90 + 15);
            const midR = 22;
            return (
              <path
                key={i}
                d={`M ${mandalaCx},${mandalaCy}
                    Q ${mandalaCx + Math.cos(lRad) * midR},${mandalaCy + Math.sin(lRad) * midR} ${tipX},${tipY}
                    Q ${mandalaCx + Math.cos(rRad) * midR},${mandalaCy + Math.sin(rRad) * midR} ${mandalaCx},${mandalaCy} Z`}
                fill="#86efac"
                stroke="#22c55e"
                strokeWidth="1"
                opacity={0.7}
              />
            );
          })}

          {/* 8 small circles between petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = i * 45 + 22.5;
            const rad = toRad(angle - 90);
            return (
              <circle
                key={`dot-${i}`}
                cx={mandalaCx + Math.cos(rad) * 32}
                cy={mandalaCy + Math.sin(rad) * 32}
                r={4}
                fill="#4ade80"
                opacity={0.5}
              />
            );
          })}

          {/* Center dot */}
          <circle cx={mandalaCx} cy={mandalaCy} r={6} fill="#fbbf24" />

          {/* Mirror lines (4 of them) */}
          {[0, 45, 90, 135].map((angle, i) => {
            const rad = toRad(angle);
            const len = 65;
            return (
              <line
                key={`ml-${i}`}
                x1={mandalaCx + Math.cos(rad) * len}
                y1={mandalaCy + Math.sin(rad) * len}
                x2={mandalaCx - Math.cos(rad) * len}
                y2={mandalaCy - Math.sin(rad) * len}
                stroke="#f59e0b"
                strokeWidth="0.8"
                strokeDasharray="4,3"
                opacity={0.6}
              />
            );
          })}

          {/* Label */}
          <text x={mandalaCx} y={298} textAnchor="middle" className="label fill-green-300">Both Combined</text>
          <text x={mandalaCx} y={314} textAnchor="middle" className="sub fill-slate-400">8-fold rotation</text>
          <text x={mandalaCx} y={328} textAnchor="middle" className="sub fill-slate-400">+ 4 mirror lines</text>
        </g>

        {/* Bottom note */}
        <text x={335} y={356} textAnchor="middle" className="sub fill-slate-500">
          Mandalas use both symmetries together to create balanced, repeating beauty
        </text>
      </svg>
    </div>
  );
}
