/**
 * Primes as the "atoms" of arithmetic. Tara holds up a "compound" number
 * (12) which factors into the primes 2, 2, and 3. Bipin holds up 30 = 2·3·5.
 * Visual: each prime is a coloured atom; products are atoms stuck together.
 *
 * Used in the Prime Numbers section.
 */
import Tara from './people/Tara';
import Bipin from './people/Bipin';

export default function PrimeAtomsDiagram() {
  const W = 720, H = 380;

  // Atom colours by prime
  const primeColour: Record<number, string> = {
    2: '#3b82f6', // blue
    3: '#10b981', // green
    5: '#f59e0b', // amber
    7: '#ec4899', // pink
  };

  // Tara's molecule: 12 = 2 × 2 × 3
  const taraMolecule = { num: 12, primes: [2, 2, 3], cx: 280, cy: 200 };
  // Bipin's molecule: 30 = 2 × 3 × 5
  const bipinMolecule = { num: 30, primes: [2, 3, 5], cx: 530, cy: 200 };

  const Atom = ({ cx, cy, prime, r = 22 }: { cx: number; cy: number; prime: number; r?: number }) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={primeColour[prime]} stroke="#0f172a" strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill="white">
        {prime}
      </text>
    </g>
  );

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara and Bipin show how composite numbers are built from prime atoms">

        <rect x="0" y="0" width={W} height={H} fill="#f0f9ff" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Primes are the atoms of numbers
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Every number is built by sticking primes together.
        </text>

        {/* Tara on far left, looking at her molecule */}
        <Tara x={80} y={350} scale={1.0} pose="pointing" />

        {/* Tara's molecule: 12 = 2 × 2 × 3 */}
        {/* Bonds (lines connecting atoms) */}
        <line x1={taraMolecule.cx - 35} y1={taraMolecule.cy} x2={taraMolecule.cx} y2={taraMolecule.cy} stroke="#475569" strokeWidth="2" />
        <line x1={taraMolecule.cx} y1={taraMolecule.cy} x2={taraMolecule.cx + 35} y2={taraMolecule.cy - 28} stroke="#475569" strokeWidth="2" />
        <line x1={taraMolecule.cx} y1={taraMolecule.cy} x2={taraMolecule.cx + 35} y2={taraMolecule.cy + 28} stroke="#475569" strokeWidth="2" />
        {/* Atoms */}
        <Atom cx={taraMolecule.cx - 35} cy={taraMolecule.cy} prime={2} />
        <Atom cx={taraMolecule.cx} cy={taraMolecule.cy} prime={2} />
        <Atom cx={taraMolecule.cx + 35} cy={taraMolecule.cy - 28} prime={3} />
        {/* Number label below molecule */}
        <rect x={taraMolecule.cx - 50} y={taraMolecule.cy + 60} width="100" height="30" rx="15"
          fill="white" stroke="#475569" strokeWidth="1.5" className="dark:fill-gray-700 dark:stroke-gray-400" />
        <text x={taraMolecule.cx} y={taraMolecule.cy + 80} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          12 = 2 × 2 × 3
        </text>

        {/* Bipin on far right */}
        <Bipin x={650} y={350} scale={1.0} pose="pointing" flip={true} />

        {/* Bipin's molecule: 30 = 2 × 3 × 5 — triangle of atoms */}
        <line x1={bipinMolecule.cx - 30} y1={bipinMolecule.cy + 18} x2={bipinMolecule.cx} y2={bipinMolecule.cy - 28} stroke="#475569" strokeWidth="2" />
        <line x1={bipinMolecule.cx} y1={bipinMolecule.cy - 28} x2={bipinMolecule.cx + 30} y2={bipinMolecule.cy + 18} stroke="#475569" strokeWidth="2" />
        <line x1={bipinMolecule.cx - 30} y1={bipinMolecule.cy + 18} x2={bipinMolecule.cx + 30} y2={bipinMolecule.cy + 18} stroke="#475569" strokeWidth="2" />
        <Atom cx={bipinMolecule.cx - 30} cy={bipinMolecule.cy + 18} prime={2} />
        <Atom cx={bipinMolecule.cx} cy={bipinMolecule.cy - 28} prime={3} />
        <Atom cx={bipinMolecule.cx + 30} cy={bipinMolecule.cy + 18} prime={5} />
        <rect x={bipinMolecule.cx - 50} y={bipinMolecule.cy + 60} width="100" height="30" rx="15"
          fill="white" stroke="#475569" strokeWidth="1.5" className="dark:fill-gray-700 dark:stroke-gray-400" />
        <text x={bipinMolecule.cx} y={bipinMolecule.cy + 80} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          30 = 2 × 3 × 5
        </text>

        {/* Bottom band: prime "periodic table" */}
        <rect x="120" y={H - 70} width={W - 240} height="46" rx="8"
          fill="white" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 56} textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">
          The first few primes:
        </text>
        {[2, 3, 5, 7, 11, 13].map((p, i) => {
          const ax = W / 2 + (i - 2.5) * 36;
          return (
            <g key={p}>
              <circle cx={ax} cy={H - 36} r="13" fill={primeColour[p] || '#a855f7'} stroke="#0f172a" strokeWidth="1" />
              <text x={ax} y={H - 32} textAnchor="middle" fontSize="11" fontWeight="700" fill="white">{p}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
