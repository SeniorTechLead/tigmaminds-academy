export default function LogicProcessorDiagram() {
  const label = 'fill-gray-700 dark:fill-gray-200';
  const sub = 'fill-gray-500 dark:fill-gray-400';
  const border = 'text-gray-300 dark:text-gray-600';

  return (
    <div className="my-4">
      <svg viewBox="0 0 560 180" className="w-full max-w-2xl mx-auto" role="img" aria-label="Zoom from logic gates to ALU to CPU to computer">
        {/* ─── Level 1: Single Gate ─── */}
        <g>
          <rect x={10} y={50} width={80} height={80} rx={8} fill="none" stroke="currentColor" className={border} strokeWidth="1.5" strokeDasharray="4 2" />
          {/* AND gate icon */}
          <path d="M30 75 L50 75 A15 15 0 0 1 50 105 L30 105 Z"
            fill="none" stroke="currentColor" className="text-blue-500 dark:text-blue-400" strokeWidth="2" />
          {/* input wires */}
          <line x1={18} y1={82} x2={30} y2={82} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="1.5" />
          <line x1={18} y1={98} x2={30} y2={98} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="1.5" />
          {/* output wire */}
          <line x1={65} y1={90} x2={82} y2={90} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="1.5" />
          <text x={50} y={42} textAnchor="middle" className={label} fontSize="11" fontWeight="700">1 Gate</text>
          <text x={50} y={145} textAnchor="middle" className={sub} fontSize="10">AND, OR, NOT\u2026</text>
        </g>

        {/* Arrow 1 */}
        <g>
          <line x1={100} y1={90} x2={140} y2={90} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="1.5" />
          <polygon points="140,86 148,90 140,94" className="fill-gray-400 dark:fill-gray-500" />
          <text x={124} y={82} textAnchor="middle" className={sub} fontSize="10">\u00D7100s</text>
        </g>

        {/* ─── Level 2: ALU ─── */}
        <g>
          <rect x={155} y={40} width={100} height={100} rx={10} fill="none" stroke="currentColor" className="text-emerald-400 dark:text-emerald-500" strokeWidth="2" />
          {/* Tiny gate icons inside */}
          {[0,1,2,3,4,5].map(i => {
            const gx = 170 + (i % 3) * 28;
            const gy = 60 + Math.floor(i / 3) * 30;
            return (
              <rect key={i} x={gx} y={gy} width={18} height={14} rx={3}
                className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400 dark:stroke-emerald-600"
                strokeWidth="1" />
            );
          })}
          <text x={205} y={36} textAnchor="middle" className={label} fontSize="11" fontWeight="700">ALU</text>
          <text x={205} y={155} textAnchor="middle" className={sub} fontSize="10">Add, subtract,</text>
          <text x={205} y={167} textAnchor="middle" className={sub} fontSize="10">compare, shift</text>
        </g>

        {/* Arrow 2 */}
        <g>
          <line x1={265} y1={90} x2={305} y2={90} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="1.5" />
          <polygon points="305,86 313,90 305,94" className="fill-gray-400 dark:fill-gray-500" />
          <text x={289} y={82} textAnchor="middle" className={sub} fontSize="10">+Control</text>
        </g>

        {/* ─── Level 3: CPU ─── */}
        <g>
          <rect x={320} y={30} width={110} height={120} rx={10} fill="none" stroke="currentColor" className="text-purple-400 dark:text-purple-500" strokeWidth="2" />
          {/* ALU block inside */}
          <rect x={335} y={45} width={50} height={30} rx={5}
            className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="1" />
          <text x={360} y={64} textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">ALU</text>
          {/* Control unit */}
          <rect x={335} y={85} width={50} height={24} rx={5}
            className="fill-purple-100 dark:fill-purple-900/30 stroke-purple-400 dark:stroke-purple-600" strokeWidth="1" />
          <text x={360} y={101} textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="10">Control</text>
          {/* Registers */}
          <rect x={395} y={45} width={25} height={64} rx={4}
            className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1" />
          <text x={407} y={80} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10" transform="rotate(-90,407,80)">Registers</text>
          <text x={375} y={26} textAnchor="middle" className={label} fontSize="11" fontWeight="700">CPU</text>
          <text x={375} y={165} textAnchor="middle" className={sub} fontSize="10">Billions of gates</text>
        </g>

        {/* Arrow 3 */}
        <g>
          <line x1={440} y1={90} x2={470} y2={90} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="1.5" />
          <polygon points="470,86 478,90 470,94" className="fill-gray-400 dark:fill-gray-500" />
        </g>

        {/* ─── Level 4: Computer ─── */}
        <g>
          <rect x={485} y={30} width={65} height={120} rx={10} fill="none" stroke="currentColor" className="text-rose-400 dark:text-rose-500" strokeWidth="2" />
          {/* CPU block */}
          <rect x={495} y={42} width={44} height={24} rx={4}
            className="fill-purple-100 dark:fill-purple-900/30 stroke-purple-400" strokeWidth="1" />
          <text x={517} y={58} textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="10">CPU</text>
          {/* RAM */}
          <rect x={495} y={72} width={44} height={18} rx={4}
            className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-400" strokeWidth="1" />
          <text x={517} y={85} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">RAM</text>
          {/* Storage */}
          <rect x={495} y={96} width={44} height={18} rx={4}
            className="fill-gray-100 dark:fill-gray-700 stroke-gray-400" strokeWidth="1" />
          <text x={517} y={109} textAnchor="middle" className={sub} fontSize="10">SSD</text>
          {/* I/O */}
          <rect x={495} y={120} width={44} height={18} rx={4}
            className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400" strokeWidth="1" />
          <text x={517} y={133} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">I/O</text>
          <text x={517} y={26} textAnchor="middle" className={label} fontSize="11" fontWeight="700">Computer</text>
          <text x={517} y={165} textAnchor="middle" className={sub} fontSize="10">Everything</text>
          <text x={517} y={177} textAnchor="middle" className={sub} fontSize="10">is gates!</text>
        </g>
      </svg>
    </div>
  );
}
