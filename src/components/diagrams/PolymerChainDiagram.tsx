export default function PolymerChainDiagram() {
  const monomerCount = 6;
  const mw = 55;
  const startX = 30;
  const chainY = 60;

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 520 200"
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label="Polymer chain diagram: monomers linking into a polymer, connecting to silk fibroin"
      >
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" fontSize="12"
          fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
          Polymerisation: Monomers → Polymer Chain
        </text>

        {/* Monomer chain */}
        {Array.from({ length: monomerCount }).map((_, i) => {
          const x = startX + i * mw;
          const isRepeat = i >= 1 && i <= 4;
          return (
            <g key={i}>
              {/* Bond to next monomer */}
              {i < monomerCount - 1 && (
                <line x1={x + 38} y1={chainY} x2={x + mw - 8} y2={chainY}
                  className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
              )}
              {/* Monomer unit */}
              <rect x={x} y={chainY - 20} width="40" height="40" rx="6"
                className={`${isRepeat
                  ? "fill-blue-200 dark:fill-blue-800 stroke-blue-400 dark:stroke-blue-600"
                  : "fill-blue-100 dark:fill-blue-900 stroke-blue-300 dark:stroke-blue-700"
                }`}
                strokeWidth="1.5"
                strokeDasharray={i === 0 || i === monomerCount - 1 ? "4 2" : "none"}
              />
              <text x={x + 20} y={chainY + 5} textAnchor="middle" fontSize="11"
                fontWeight="bold" className="fill-blue-700 dark:fill-blue-200">
                M
              </text>
            </g>
          );
        })}

        {/* Repeating unit bracket */}
        <line x1={startX + mw} y1={chainY + 28} x2={startX + mw} y2={chainY + 34}
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <line x1={startX + mw} y1={chainY + 34} x2={startX + 4 * mw + 40} y2={chainY + 34}
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <line x1={startX + 4 * mw + 40} y1={chainY + 28} x2={startX + 4 * mw + 40} y2={chainY + 34}
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />
        <text x={startX + 4 * mw + 50} y={chainY + 38} fontSize="14"
          fontWeight="bold" className="fill-gray-600 dark:fill-gray-300" fontFamily="serif">
          n
        </text>

        {/* Dots at ends */}
        <text x={startX - 12} y={chainY + 4} fontSize="16"
          className="fill-gray-400 dark:fill-gray-500">...</text>
        <text x={startX + monomerCount * mw - 8} y={chainY + 4} fontSize="16"
          className="fill-gray-400 dark:fill-gray-500">...</text>

        {/* Divider */}
        <line x1="30" y1="110" x2="490" y2="110"
          className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />

        {/* Silk connection */}
        <text x="260" y="130" textAnchor="middle" fontSize="11"
          fontWeight="bold" className="fill-gray-600 dark:fill-gray-300">
          Silk: a natural polymer
        </text>

        {/* Amino acids → polypeptide → silk fibroin */}
        {/* Step 1: Amino acids */}
        <rect x="30" y="145" width="100" height="35" rx="6"
          className="fill-green-100 dark:fill-green-900/40 stroke-green-300 dark:stroke-green-700" strokeWidth="1" />
        <text x="80" y="160" textAnchor="middle" fontSize="10"
          fontWeight="600" className="fill-green-700 dark:fill-green-300">
          Amino acids
        </text>
        <text x="80" y="174" textAnchor="middle" fontSize="10"
          className="fill-green-500 dark:fill-green-400">
          (monomers)
        </text>

        {/* Arrow 1 */}
        <line x1="135" y1="162" x2="175" y2="162"
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <polygon points="175,162 169,158 169,166" className="fill-gray-500 dark:fill-gray-400" />
        <text x="155" y="155" textAnchor="middle" fontSize="10"
          className="fill-gray-400 dark:fill-gray-500">
          link
        </text>

        {/* Step 2: Polypeptide */}
        <rect x="180" y="145" width="120" height="35" rx="6"
          className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="240" y="160" textAnchor="middle" fontSize="10"
          fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
          Polypeptide chain
        </text>
        <text x="240" y="174" textAnchor="middle" fontSize="10"
          className="fill-amber-500 dark:fill-amber-400">
          (polymer)
        </text>

        {/* Arrow 2 */}
        <line x1="305" y1="162" x2="345" y2="162"
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <polygon points="345,162 339,158 339,166" className="fill-gray-500 dark:fill-gray-400" />
        <text x="325" y="155" textAnchor="middle" fontSize="10"
          className="fill-gray-400 dark:fill-gray-500">
          fold
        </text>

        {/* Step 3: Silk fibroin */}
        <rect x="350" y="145" width="130" height="35" rx="6"
          className="fill-yellow-100 dark:fill-yellow-900/40 stroke-yellow-400 dark:stroke-yellow-700" strokeWidth="1" />
        <text x="415" y="160" textAnchor="middle" fontSize="10"
          fontWeight="600" className="fill-yellow-700 dark:fill-yellow-300">
          Silk fibroin
        </text>
        <text x="415" y="174" textAnchor="middle" fontSize="10"
          className="fill-yellow-600 dark:fill-yellow-400">
          (structural protein)
        </text>

        {/* Bottom note */}
        <text x="260" y="198" textAnchor="middle" fontSize="10"
          className="fill-gray-400 dark:fill-gray-500">
          Muga silk fibroin contains glycine + alanine repeating sequences
        </text>
      </svg>
    </div>
  );
}
