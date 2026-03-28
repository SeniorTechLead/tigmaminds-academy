export default function BalancingEquationDiagram() {
  /* Atom circle helper */
  const Atom = ({ x, y, label, color }: { x: number; y: number; label: string; color: string }) => (
    <g>
      <circle cx={x} cy={y} r={10} className={color} />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-white" fontSize="10" fontWeight="bold">{label}</text>
    </g>
  );

  /* H₂ molecule: two blue circles bonded */
  const H2 = ({ x, y }: { x: number; y: number }) => (
    <g>
      <Atom x={x - 8} y={y} label="H" color="fill-blue-500" />
      <Atom x={x + 8} y={y} label="H" color="fill-blue-500" />
    </g>
  );

  /* O₂ molecule: two red circles bonded */
  const O2 = ({ x, y }: { x: number; y: number }) => (
    <g>
      <Atom x={x - 10} y={y} label="O" color="fill-red-500" />
      <Atom x={x + 10} y={y} label="O" color="fill-red-500" />
    </g>
  );

  /* H₂O molecule: V-shape */
  const H2O = ({ x, y }: { x: number; y: number }) => (
    <g>
      <Atom x={x} y={y - 6} label="O" color="fill-red-500" />
      <Atom x={x - 12} y={y + 10} label="H" color="fill-blue-500" />
      <Atom x={x + 12} y={y + 10} label="H" color="fill-blue-500" />
      <line x1={x - 3} y1={y} x2={x - 9} y2={y + 5} className="stroke-gray-400" strokeWidth="1" />
      <line x1={x + 3} y1={y} x2={x + 9} y2={y + 5} className="stroke-gray-400" strokeWidth="1" />
    </g>
  );

  return (
    <div className="my-4">
      <svg viewBox="0 0 520 250" className="w-full max-w-2xl mx-auto" role="img" aria-label="Balancing chemical equation: 2H2 + O2 = 2H2O">
        {/* Title */}
        <text x="260" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Balancing: 2H&#8322; + O&#8322; &#8594; 2H&#8322;O
        </text>

        {/* ── Left side (Reactants) ── */}
        <text x="130" y="48" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Reactants</text>

        {/* 2 H₂ molecules */}
        <H2 x={60} y={80} />
        <text x={60} y={100} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">H&#8322;</text>

        <H2 x={120} y={80} />
        <text x={120} y={100} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">H&#8322;</text>

        {/* Plus sign */}
        <text x={165} y={85} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="16" fontWeight="bold">+</text>

        {/* 1 O₂ molecule */}
        <O2 x={210} y={80} />
        <text x={210} y={100} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">O&#8322;</text>

        {/* Arrow */}
        <line x1="245" y1="82" x2="278" y2="82" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#beqArrow)" />

        {/* ── Right side (Products) ── */}
        <text x="380" y="48" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Products</text>

        {/* 2 H₂O molecules */}
        <H2O x={340} y={76} />
        <text x={340} y={100} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">H&#8322;O</text>

        <H2O x={430} y={76} />
        <text x={430} y={100} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">H&#8322;O</text>

        {/* ── Balance scale visual ── */}
        {/* Fulcrum */}
        <polygon points="260,185 248,210 272,210" className="fill-gray-300 dark:fill-gray-600" />
        {/* Beam */}
        <line x1="120" y1="185" x2="400" y2="185" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="3" strokeLinecap="round" />
        {/* Left pan */}
        <path d="M 100,185 Q 100,200 130,200 L 150,200 Q 180,200 180,185" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <text x="140" y="197" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">4H + 2O</text>
        {/* Right pan */}
        <path d="M 340,185 Q 340,200 370,200 L 390,200 Q 420,200 420,185" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <text x="380" y="197" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">4H + 2O</text>
        {/* Equal sign */}
        <text x="260" y="170" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="16" fontWeight="bold">=</text>

        {/* ── Atom tally ── */}
        <rect x="130" y="218" width="260" height="28" rx="6" className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="1" />
        <text x="195" y="237" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="11" fontWeight="600">
          H: 4 = 4 &#10003;
        </text>
        <text x="325" y="237" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="600">
          O: 2 = 2 &#10003;
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="beqArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
