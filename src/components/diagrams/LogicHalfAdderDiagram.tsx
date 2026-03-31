export default function LogicHalfAdderDiagram() {
  const wire = 'text-gray-400 dark:text-gray-500';
  const gate = 'text-gray-700 dark:text-gray-200';
  const label = 'fill-gray-700 dark:fill-gray-200';
  const sub = 'fill-gray-500 dark:fill-gray-400';
  const hi = 'fill-emerald-500 dark:fill-emerald-400';

  return (
    <div className="my-4">
      <svg viewBox="0 0 440 220" className="w-full max-w-xl mx-auto" role="img" aria-label="Half adder circuit built from XOR and AND gates">
        {/* Title */}
        <text x={220} y={18} textAnchor="middle" className={label} fontSize="14" fontWeight="700">Half Adder</text>

        {/* ─── Input labels ─── */}
        <text x={20} y={72} textAnchor="end" className={label} fontSize="13" fontWeight="600">A</text>
        <text x={20} y={142} textAnchor="end" className={label} fontSize="13" fontWeight="600">B</text>

        {/* ─── Input wires ─── */}
        {/* A main horizontal */}
        <line x1={25} y1={68} x2={130} y2={68} stroke="currentColor" className={wire} strokeWidth="2" />
        {/* A branch down to AND */}
        <line x1={80} y1={68} x2={80} y2={148} stroke="currentColor" className={wire} strokeWidth="2" />
        <line x1={80} y1={148} x2={130} y2={148} stroke="currentColor" className={wire} strokeWidth="2" />
        {/* Branch dots */}
        <circle cx={80} cy={68} r={3} className="fill-gray-500 dark:fill-gray-400" />

        {/* B main horizontal */}
        <line x1={25} y1={138} x2={60} y2={138} stroke="currentColor" className={wire} strokeWidth="2" />
        {/* B branch up to XOR */}
        <line x1={60} y1={138} x2={60} y2={82} stroke="currentColor" className={wire} strokeWidth="2" />
        <line x1={60} y1={82} x2={130} y2={82} stroke="currentColor" className={wire} strokeWidth="2" />
        {/* B continues to AND */}
        <line x1={60} y1={138} x2={60} y2={162} stroke="currentColor" className={wire} strokeWidth="2" />
        <line x1={60} y1={162} x2={130} y2={162} stroke="currentColor" className={wire} strokeWidth="2" />
        <circle cx={60} cy={138} r={3} className="fill-gray-500 dark:fill-gray-400" />

        {/* ─── XOR gate (top) ─── */}
        <g transform="translate(165,75)">
          {/* OR body */}
          <path d="M-18 -16 Q-4 0 -18 16 Q6 16 20 0 Q6 -16 -18 -16 Z"
            fill="none" stroke="currentColor" className={gate} strokeWidth="2" />
          {/* Extra arc for XOR */}
          <path d="M-23 -16 Q-9 0 -23 16"
            fill="none" stroke="currentColor" className={gate} strokeWidth="2" />
          <text x={0} y={4} textAnchor="middle" className={sub} fontSize="10" fontWeight="600">XOR</text>
        </g>
        {/* XOR input wires */}
        <line x1={130} y1={68} x2={142} y2={68} stroke="currentColor" className={wire} strokeWidth="2" />
        <line x1={130} y1={82} x2={142} y2={82} stroke="currentColor" className={wire} strokeWidth="2" />
        {/* XOR output wire to Sum */}
        <line x1={185} y1={75} x2={340} y2={75} stroke="currentColor" className={wire} strokeWidth="2" />

        {/* ─── AND gate (bottom) ─── */}
        <g transform="translate(165,155)">
          <path d="M-18 -16 L2 -16 A16 16 0 0 1 2 16 L-18 16 Z"
            fill="none" stroke="currentColor" className={gate} strokeWidth="2" />
          <text x={-2} y={4} textAnchor="middle" className={sub} fontSize="10" fontWeight="600">AND</text>
        </g>
        {/* AND input wires */}
        <line x1={130} y1={148} x2={147} y2={148} stroke="currentColor" className={wire} strokeWidth="2" />
        <line x1={130} y1={162} x2={147} y2={162} stroke="currentColor" className={wire} strokeWidth="2" />
        {/* AND output wire to Carry */}
        <line x1={183} y1={155} x2={340} y2={155} stroke="currentColor" className={wire} strokeWidth="2" />

        {/* ─── Output indicators ─── */}
        {/* Sum */}
        <circle cx={350} cy={75} r={12} className="fill-yellow-100 dark:fill-yellow-900/40 stroke-yellow-500" strokeWidth="2" />
        <text x={350} y={79} textAnchor="middle" className={hi} fontSize="11" fontWeight="700">S</text>
        <text x={380} y={79} className={label} fontSize="12" fontWeight="600">Sum</text>
        <text x={380} y={93} className={sub} fontSize="10">A \u2295 B</text>

        {/* Carry */}
        <circle cx={350} cy={155} r={12} className="fill-yellow-100 dark:fill-yellow-900/40 stroke-yellow-500" strokeWidth="2" />
        <text x={350} y={159} textAnchor="middle" className={hi} fontSize="11" fontWeight="700">C</text>
        <text x={380} y={159} className={label} fontSize="12" fontWeight="600">Carry</text>
        <text x={380} y={173} className={sub} fontSize="10">A \u00B7 B</text>

        {/* ─── Truth table ─── */}
        <text x={220} y={200} textAnchor="middle" className={label} fontSize="11" fontWeight="600">Truth Table</text>
        {['A','B','S','C'].map((h, i) => (
          <text key={h} x={140 + i * 40} y={215} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="600">{h}</text>
        ))}
        {([[0,0,0,0],[0,1,1,0],[1,0,1,0],[1,1,0,1]] as number[][]).map((row, ri) => (
          <g key={ri}>
            {row.map((v, ci) => (
              <text key={ci} x={140 + ci * 40} y={228 + ri * 13} textAnchor="middle" className={sub} fontSize="10">{v}</text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
