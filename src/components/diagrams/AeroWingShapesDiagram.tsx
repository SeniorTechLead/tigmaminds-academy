export default function AeroWingShapesDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 380" className="w-full max-w-xl mx-auto" role="img" aria-label="Different wing shapes and their purposes">
        {/* Title */}
        <text x="260" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Wing Shapes — Form Follows Function
        </text>

        {/* 1. Standard airfoil — passenger plane */}
        <text x="30" y="58" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Passenger jet</text>
        <path d="M 30,80 Q 80,55 160,72 Q 210,78 240,82 Q 210,87 160,88 Q 80,90 30,80 Z"
          className="fill-sky-200 dark:fill-sky-700 stroke-sky-600 dark:stroke-sky-300" strokeWidth="1.5" />
        <text x="270" y="76" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Moderate curve — good lift</text>
        <text x="270" y="89" className="fill-gray-500 dark:fill-gray-400" fontSize="10">at moderate speeds</text>

        {/* 2. Flat bottom — glider */}
        <text x="30" y="128" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Glider</text>
        <path d="M 30,150 Q 80,130 160,143 Q 210,147 240,150 L 30,150 Z"
          className="fill-green-200 dark:fill-green-700 stroke-green-600 dark:stroke-green-300" strokeWidth="1.5" />
        <text x="270" y="145" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Long, thin — maximum lift,</text>
        <text x="270" y="158" className="fill-gray-500 dark:fill-gray-400" fontSize="10">minimum drag, slow flight</text>

        {/* 3. Symmetric — aerobatic */}
        <text x="30" y="198" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Aerobatic</text>
        <path d="M 30,220 Q 80,205 160,213 Q 210,217 240,220 Q 210,223 160,227 Q 80,235 30,220 Z"
          className="fill-purple-200 dark:fill-purple-700 stroke-purple-600 dark:stroke-purple-300" strokeWidth="1.5" />
        <text x="270" y="215" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Symmetric — flies equally</text>
        <text x="270" y="228" className="fill-gray-500 dark:fill-gray-400" fontSize="10">well upside down</text>

        {/* 4. Delta — fighter jet */}
        <text x="30" y="268" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Fighter jet</text>
        <path d="M 30,290 L 240,280 L 240,290 L 30,302 Z"
          className="fill-red-200 dark:fill-red-700 stroke-red-600 dark:stroke-red-300" strokeWidth="1.5" />
        <text x="270" y="283" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Thin, sharp — low drag at</text>
        <text x="270" y="296" className="fill-gray-500 dark:fill-gray-400" fontSize="10">supersonic speeds</text>

        {/* Key insight box */}
        <rect x="30" y="325" width="460" height="42" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="343" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="10" fontWeight="bold">
          Key insight: there is no &quot;best&quot; wing shape — each is a trade-off.
        </text>
        <text x="260" y="358" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          More curve = more lift but more drag. Thinner = faster but less lift at low speed.
        </text>
      </svg>
    </div>
  );
}
