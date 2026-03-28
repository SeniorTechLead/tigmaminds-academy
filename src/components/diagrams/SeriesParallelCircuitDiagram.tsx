export default function SeriesParallelCircuitDiagram() {
  // Battery symbol helper
  const Battery = ({ x, y }: { x: number; y: number }) => (
    <g>
      <line x1={x} y1={y - 10} x2={x} y2={y + 10} stroke="currentColor" className="text-gray-600 dark:text-gray-300" strokeWidth="2.5" />
      <line x1={x + 5} y1={y - 5} x2={x + 5} y2={y + 5} stroke="currentColor" className="text-gray-600 dark:text-gray-300" strokeWidth="1.5" />
      <text x={x + 2} y={y - 14} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">+  −</text>
    </g>
  );

  // Bulb symbol helper
  const Bulb = ({ x, y, on = true }: { x: number; y: number; on?: boolean }) => (
    <g>
      <circle cx={x} cy={y} r={8} className={on ? 'fill-yellow-200 dark:fill-yellow-700 stroke-yellow-500' : 'fill-gray-300 dark:fill-gray-600 stroke-gray-400'} strokeWidth="1.5" />
      <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} stroke="currentColor" className="text-gray-500 dark:text-gray-400" strokeWidth="1" />
      <line x1={x + 5} y1={y - 5} x2={x - 5} y2={y + 5} stroke="currentColor" className="text-gray-500 dark:text-gray-400" strokeWidth="1" />
    </g>
  );

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 250" className="w-full max-w-2xl mx-auto" role="img" aria-label="Series vs Parallel circuit diagram">
        {/* ======== SERIES CIRCUIT (left) ======== */}
        <text x={130} y={16} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="700">Series Circuit</text>

        {/* Outer loop */}
        <rect x={30} y={30} width={200} height={140} rx={8} fill="none" stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2" />

        {/* Battery on left side */}
        <Battery x={30} y={100} />

        {/* Three bulbs along the top wire */}
        <Bulb x={80} y={30} on={true} />
        <Bulb x={130} y={30} on={false} />
        <Bulb x={180} y={30} on={true} />

        {/* X mark on the off bulb */}
        <text x={130} y={54} textAnchor="middle" className="fill-red-500" fontSize="10" fontWeight="700">OFF</text>

        {/* Arrow showing break */}
        <line x1={108} y1={30} x2={122} y2={30} stroke="none" />

        {/* Ammeter symbol on bottom wire */}
        <circle cx={130} cy={170} r={10} fill="none" className="stroke-blue-500" strokeWidth="1.5" />
        <text x={130} y={174} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="700">A</text>
        <text x={130} y={192} textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="10">Same I everywhere</text>

        {/* Indication that all go off */}
        <text x={130} y={210} textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10">1 bulb off → all off</text>

        {/* Current arrows along the series path */}
        <polygon points="60,25 66,22 66,28" className="fill-sky-500" />
        <polygon points="155,25 161,22 161,28" className="fill-sky-500" />
        <polygon points="233,80 230,74 236,74" className="fill-sky-500" />
        <polygon points="155,175 149,172 149,178" className="fill-sky-500" />

        {/* Label */}
        <text x={130} y={240} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Same current, voltages add</text>

        {/* ======== PARALLEL CIRCUIT (right) ======== */}
        <text x={400} y={16} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="700">Parallel Circuit</text>

        {/* Main vertical rails */}
        <line x1={310} y1={30} x2={310} y2={190} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2" />
        <line x1={490} y1={30} x2={490} y2={190} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2" />

        {/* Top and bottom connecting wires */}
        <line x1={310} y1={30} x2={490} y2={30} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2" />
        <line x1={310} y1={190} x2={490} y2={190} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2" />

        {/* Battery on left rail */}
        <Battery x={310} y={110} />

        {/* Branch 1 (top) */}
        <line x1={310} y1={65} x2={490} y2={65} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="1.5" />
        <Bulb x={400} y={65} on={true} />
        <text x={430} y={60} className="fill-sky-600 dark:fill-sky-400" fontSize="10">I₁</text>

        {/* Branch 2 (middle) */}
        <line x1={310} y1={110} x2={490} y2={110} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="1.5" />
        <Bulb x={400} y={110} on={false} />
        <text x={400} y={130} textAnchor="middle" className="fill-red-500" fontSize="10" fontWeight="700">OFF</text>
        <text x={430} y={105} className="fill-sky-600 dark:fill-sky-400" fontSize="10">I₂</text>

        {/* Branch 3 (bottom) */}
        <line x1={310} y1={155} x2={490} y2={155} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="1.5" />
        <Bulb x={400} y={155} on={true} />
        <text x={430} y={150} className="fill-sky-600 dark:fill-sky-400" fontSize="10">I₃</text>

        {/* Current arrows on branches */}
        <polygon points="360,60 366,57 366,63" className="fill-sky-500" />
        <polygon points="360,150 366,147 366,153" className="fill-sky-500" />

        {/* Indication that others stay on */}
        <text x={400} y={208} textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">1 bulb off → others stay on</text>

        {/* Label */}
        <text x={400} y={240} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Same voltage, currents add</text>
      </svg>
    </div>
  );
}
