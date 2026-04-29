export default function StructSkyscraperDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 520 440" className="w-full h-auto" role="img"
        aria-label="Diagram of a skyscraper showing wind load, tuned mass damper, and foundation systems">
        <defs>
          <marker id="ssk-arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="ssk-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        <rect width="520" height="440" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          How Skyscrapers Stay Standing
        </text>

        {/* Ground line */}
        <rect x="0" y="360" width="520" height="80" rx="0" className="fill-amber-100 dark:fill-amber-900/30" />
        <line x1="0" y1="360" x2="520" y2="360" className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="2" />
        <text x="260" y="380" textAnchor="middle" fontSize="10" className="fill-amber-700 dark:fill-amber-300">Ground Level</text>

        {/* Building outline */}
        <rect x="190" y="50" width="100" height="310" rx="2" className="fill-slate-200 dark:fill-slate-700 stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />

        {/* Window grid */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(row => (
          <g key={`row-${row}`}>
            <rect x="198" y={60 + row * 24} width="14" height="16" rx="1" className="fill-sky-200 dark:fill-sky-800" />
            <rect x="218" y={60 + row * 24} width="14" height="16" rx="1" className="fill-sky-200 dark:fill-sky-800" />
            <rect x="238" y={60 + row * 24} width="14" height="16" rx="1" className="fill-sky-200 dark:fill-sky-800" />
            <rect x="258" y={60 + row * 24} width="14" height="16" rx="1" className="fill-sky-200 dark:fill-sky-800" />
          </g>
        ))}

        {/* Steel core */}
        <rect x="230" y="55" width="20" height="305" className="fill-slate-400 dark:fill-slate-500" opacity="0.5" />
        <text x="240" y="200" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200" transform="rotate(-90, 240, 200)">
          Steel Core
        </text>

        {/* WIND arrows from left */}
        {[80, 130, 180, 230, 280].map((y, i) => (
          <g key={`wind-${i}`}>
            <line x1={40 + i * 8} y1={y} x2={185} y2={y} stroke="#3b82f6" strokeWidth="2" markerEnd="url(#ssk-arr-b)" />
          </g>
        ))}
        <text x="60" y="68" fontSize="12" fontWeight="bold" fill="#3b82f6">WIND</text>
        <text x="60" y="310" fontSize="10" fill="#3b82f6">Wind pushes harder</text>
        <text x="60" y="323" fontSize="10" fill="#3b82f6">at the top where</text>
        <text x="60" y="336" fontSize="10" fill="#3b82f6">there is less shelter</text>

        {/* Tuned mass damper */}
        <circle cx="240" cy="72" r="12" className="fill-amber-400 dark:fill-amber-500 stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
        <line x1="240" y1="55" x2="240" y2="60" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2" />
        <text x="310" y="60" fontSize="10" fontWeight="bold" className="fill-amber-600 dark:fill-amber-400">Tuned Mass</text>
        <text x="310" y="73" fontSize="10" fontWeight="bold" className="fill-amber-600 dark:fill-amber-400">Damper</text>
        <line x1="295" y1="66" x2="255" y2="72" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" strokeDasharray="3,2" />

        {/* Sway arrows */}
        <path d="M 296,140 Q 310,200 296,260" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ssk-arr-a)" />
        <text x="320" y="200" fontSize="10" fontWeight="bold" fill="#f59e0b">Building</text>
        <text x="320" y="213" fontSize="10" fontWeight="bold" fill="#f59e0b">sways</text>

        {/* Foundation below ground */}
        <rect x="170" y="360" width="140" height="50" rx="3" className="fill-slate-400 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        <text x="240" y="390" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-slate-100 dark:fill-slate-200">Foundation</text>

        {/* Piles */}
        {[185, 215, 245, 275].map(x => (
          <rect key={`pile-${x}`} x={x - 3} y="410" width="6" height="22" className="fill-slate-500 dark:fill-slate-400" />
        ))}
        <text x="240" y="430" textAnchor="middle" fontSize="10" className="fill-amber-700 dark:fill-amber-300">
          Deep piles reach bedrock
        </text>

        {/* Labels at bottom */}
        <rect x="10" y="395" width="150" height="38" rx="6" className="fill-emerald-50 dark:fill-emerald-900/30 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="85" y="412" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-emerald-700 dark:fill-emerald-300">Taipei 101's damper:</text>
        <text x="85" y="425" textAnchor="middle" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">730-tonne steel ball!</text>

        <rect x="360" y="395" width="150" height="38" rx="6" className="fill-sky-50 dark:fill-sky-900/30 stroke-sky-300 dark:stroke-sky-700" strokeWidth="1" />
        <text x="435" y="412" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-sky-700 dark:fill-sky-300">Top sway in wind:</text>
        <text x="435" y="425" textAnchor="middle" fontSize="10" className="fill-sky-600 dark:fill-sky-400">Up to 1 metre each way</text>
      </svg>
    </div>
  );
}
