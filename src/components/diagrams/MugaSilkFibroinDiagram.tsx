/**
 * MugaSilkFibroinDiagram — How silkworms spin silk: from protein solution
 * in glands to crystalline fibroin fibre through the spinneret.
 * Shows: gland -> spinneret -> fibroin strand with beta-sheet zoom.
 */

export default function MugaSilkFibroinDiagram() {
  const gold = '#C8962E';
  const goldLight = '#E8B84B';
  const sericin = '#9E9E9E';
  const hBond = '#5C9CE6';
  const glandPink = '#E8A0B4';

  return (
    <svg
      viewBox="0 0 640 420"
      className="w-full max-w-2xl mx-auto"
      role="img"
      aria-label="Diagram showing how a silkworm produces silk fibroin protein through its spinneret, with a zoom into beta-sheet crystal structure"
    >
      <defs>
        <marker id="mf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10z" className="fill-gray-500 dark:fill-gray-400" />
        </marker>
        <linearGradient id="mf-gold-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={gold} stopOpacity="0.3" />
          <stop offset="50%" stopColor={goldLight} />
          <stop offset="100%" stopColor={gold} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="640" height="420" rx="8" className="fill-[#fafaf8] dark:fill-[#1a1a2e]" />

      {/* Title */}
      <text x="320" y="24" fontSize="13" fontWeight="700" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100">
        From Gland to Golden Thread
      </text>

      {/* === STAGE 1: Silk gland === */}
      <text x="28" y="55" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-200">
        1. Silk gland (inside caterpillar)
      </text>

      {/* Gland shape - elongated sac */}
      <ellipse cx="120" cy="95" rx="80" ry="28" fill={glandPink} opacity="0.5" stroke={glandPink} strokeWidth="1.5" />
      {/* Protein molecules floating inside */}
      {[
        [70, 85], [90, 100], [110, 82], [130, 98], [150, 88], [100, 92], [140, 80], [80, 95], [160, 92], [120, 105],
      ].map(([cx, cy], i) => (
        <path
          key={`prot-${i}`}
          d={`M${cx - 6},${cy} Q${cx - 3},${cy - 4} ${cx},${cy} Q${cx + 3},${cy + 4} ${cx + 6},${cy}`}
          fill="none"
          stroke={gold}
          strokeWidth="1.2"
          opacity="0.7"
        />
      ))}
      <text x="120" y="130" fontSize="8" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
        Dissolved fibroin protein
      </text>

      {/* Arrow gland -> spinneret */}
      <line x1="205" y1="95" x2="255" y2="95" stroke="#888" strokeWidth="1.5" markerEnd="url(#mf-arrow)" />

      {/* === STAGE 2: Spinneret === */}
      <text x="268" y="55" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-200">
        2. Spinneret (nozzle)
      </text>

      {/* Funnel shape */}
      <path
        d="M270 72 L290 72 L298 95 L290 118 L270 118 L262 95 Z"
        fill="none"
        stroke="#666"
        strokeWidth="1.5"
        className="dark:stroke-gray-400"
      />
      {/* Narrowing duct */}
      <path
        d="M298 82 L340 90 L340 100 L298 108"
        fill="none"
        stroke="#666"
        strokeWidth="1.5"
        className="dark:stroke-gray-400"
      />
      {/* Wavy lines inside showing alignment */}
      {[82, 88, 95, 102, 108].map((y, i) => (
        <path
          key={`align-${i}`}
          d={`M272,${y} Q282,${y - 2} 295,${y} L335,${y > 95 ? 99 : y < 95 ? 91 : 95}`}
          fill="none"
          stroke={gold}
          strokeWidth="0.8"
          opacity="0.6"
        />
      ))}
      <text x="280" y="135" fontSize="7.5" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
        Chains align as
      </text>
      <text x="280" y="144" fontSize="7.5" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
        they are pulled through
      </text>

      {/* Arrow spinneret -> fibre */}
      <line x1="345" y1="95" x2="385" y2="95" stroke="#888" strokeWidth="1.5" markerEnd="url(#mf-arrow)" />

      {/* === STAGE 3: Extruded fibre === */}
      <text x="465" y="55" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-200">
        3. Silk fibre
      </text>

      {/* Fibre strand */}
      <rect x="395" y="87" width="220" height="16" rx="8" fill="url(#mf-gold-grad)" stroke={gold} strokeWidth="1" />
      {/* Sheen */}
      <rect x="420" y="90" width="170" height="3" rx="1.5" fill="#F5D98A" opacity="0.4" />

      {/* Sericin coating label */}
      <rect x="395" y="83" width="220" height="24" rx="10" fill="none" stroke={sericin} strokeWidth="1" strokeDasharray="3,3" />
      <text x="550" y="80" fontSize="7.5" className="fill-gray-500 dark:fill-gray-400">
        Sericin coating
      </text>

      <text x="505" y="120" fontSize="8" textAnchor="middle" fill={gold} fontWeight="600">
        Fibroin core (golden)
      </text>

      {/* === ZOOM: Beta-sheet structure === */}
      {/* Zoom line from fibre */}
      <path d="M505,103 L505,165 L320,175" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="3,3" />

      <text x="320" y="175" fontSize="11" fontWeight="700" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200">
        Zoom: Beta-sheet crystal structure
      </text>

      {/* Beta sheets - stacked rectangles */}
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 195 + i * 36;
        return (
          <g key={`sheet-${i}`}>
            {/* Sheet as zigzag chain */}
            <path
              d={`M100,${y + 5} ${Array.from({ length: 12 }, (_, j) =>
                `L${115 + j * 35},${y + (j % 2 === 0 ? 0 : 10)}`
              ).join(' ')}`}
              fill="none"
              stroke={goldLight}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Amino acid markers */}
            {Array.from({ length: 6 }, (_, j) => (
              <circle
                key={`aa-${i}-${j}`}
                cx={115 + j * 70}
                cy={y + (j % 2 === 0 ? 0 : 10)}
                r="3"
                fill={gold}
              />
            ))}
            {/* H-bonds between sheets */}
            {i < 4 &&
              Array.from({ length: 5 }, (_, j) => (
                <line
                  key={`hb-${i}-${j}`}
                  x1={132 + j * 70}
                  y1={y + 12}
                  x2={132 + j * 70}
                  y2={y + 24}
                  stroke={hBond}
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.6"
                />
              ))}
          </g>
        );
      })}

      {/* Labels for beta-sheet region */}
      <text x="80" y="215" fontSize="8" className="fill-gray-500 dark:fill-gray-400" textAnchor="end">
        Gly-Ala-Gly-Ala
      </text>
      <text x="80" y="225" fontSize="7" className="fill-gray-400 dark:fill-gray-500" textAnchor="end">
        amino acid chain
      </text>

      {/* H-bond label */}
      <line x1="535" y1="228" x2="535" y2="248" stroke={hBond} strokeWidth="1.5" strokeDasharray="2,2" />
      <text x="548" y="240" fontSize="8" fill={hBond}>H-bonds</text>
      <text x="548" y="250" fontSize="7" fill={hBond} opacity="0.7">(hold sheets together)</text>

      {/* Key facts */}
      <g>
        <circle cx="85" cy="400" r="4" fill={gold} />
        <text x="94" y="403" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Amino acid</text>

        <line x1="170" y1="400" x2="195" y2="400" stroke={goldLight} strokeWidth="2.5" />
        <text x="202" y="403" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Protein chain</text>

        <line x1="310" y1="400" x2="330" y2="400" stroke={hBond} strokeWidth="1.5" strokeDasharray="2,2" />
        <text x="337" y="403" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Hydrogen bond</text>

        <rect x="450" y="395" width="20" height="10" rx="5" fill={glandPink} opacity="0.5" />
        <text x="476" y="403" fontSize="8" className="fill-gray-600 dark:fill-gray-300">Silk gland</text>
      </g>
    </svg>
  );
}
