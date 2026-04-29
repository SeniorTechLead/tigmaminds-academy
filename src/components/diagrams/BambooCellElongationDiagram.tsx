export default function BambooCellElongationDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cell elongation vs cell division: elongation adds most of bamboo's height, division creates new cells"
      >
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-lime-600 dark:fill-lime-400">
          Cell Elongation vs Cell Division
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Most of bamboo's height comes from STRETCHING existing cells, not making new ones
        </text>

        {/* Cell Division panel */}
        <rect x="40" y="70" width="300" height="200" rx="10" className="fill-blue-50 dark:fill-blue-950/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1.5" />
        <text x="190" y="94" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Cell Division (Mitosis)</text>
        <text x="190" y="110" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">One cell → two cells</text>

        {/* Division stages */}
        <rect x="70" y="130" width="30" height="30" rx="4" className="fill-blue-200 dark:fill-blue-700" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="115" y="150" fontSize="16" className="fill-blue-400 dark:fill-blue-500">→</text>
        <rect x="130" y="130" width="30" height="30" rx="4" className="fill-blue-200 dark:fill-blue-700" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="145" y1="145" x2="145" y2="145" className="stroke-blue-400" strokeWidth="1" />
        <text x="175" y="150" fontSize="16" className="fill-blue-400 dark:fill-blue-500">→</text>
        <rect x="190" y="128" width="28" height="14" rx="3" className="fill-blue-200 dark:fill-blue-700" stroke="#3b82f6" strokeWidth="1" />
        <rect x="190" y="146" width="28" height="14" rx="3" className="fill-blue-200 dark:fill-blue-700" stroke="#3b82f6" strokeWidth="1" />

        {/* Result */}
        <text x="190" y="190" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">Creates more cells</text>
        <text x="190" y="205" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">but each is the same size</text>
        <text x="190" y="225" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Slower: hours per division</text>
        <text x="190" y="250" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">
          Adds ~10% of height
        </text>

        {/* Cell Elongation panel */}
        <rect x="360" y="70" width="300" height="200" rx="10" className="fill-emerald-50 dark:fill-emerald-950/20 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1.5" />
        <text x="510" y="94" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Cell Elongation</text>
        <text x="510" y="110" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Same cell → much bigger</text>

        {/* Elongation stages */}
        <rect x="390" y="135" width="24" height="24" rx="3" className="fill-emerald-200 dark:fill-emerald-700" stroke="#10b981" strokeWidth="1.5" />
        <text x="430" y="150" fontSize="16" className="fill-emerald-400 dark:fill-emerald-500">→</text>
        <rect x="445" y="125" width="24" height="44" rx="3" className="fill-emerald-200 dark:fill-emerald-700" stroke="#10b981" strokeWidth="1.5" />
        <text x="485" y="150" fontSize="16" className="fill-emerald-400 dark:fill-emerald-500">→</text>
        <rect x="500" y="110" width="24" height="74" rx="3" className="fill-emerald-100 dark:fill-emerald-600/40" stroke="#10b981" strokeWidth="1.5" />

        {/* Water arrows */}
        <text x="512" y="200" textAnchor="middle" fontSize="8" className="fill-cyan-600 dark:fill-cyan-400">💧 water rushes in</text>

        <text x="510" y="225" textAnchor="middle" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">Same number of cells</text>
        <text x="510" y="240" textAnchor="middle" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">but each stretches 10-100×</text>
        <text x="510" y="250" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Faster: hours per elongation</text>
        <text x="510" y="255" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
          Adds ~90% of height
        </text>

        {/* Growth curve */}
        <rect x="60" y="290" width="580" height="100" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="350" y="310" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Bamboo Growth Timeline</text>

        {/* Timeline bar */}
        <line x1="100" y1="345" x2="620" y2="345" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        {['Day 1', 'Day 15', 'Day 30', 'Day 60', 'Day 90'].map((label, i) => (
          <g key={label}>
            <line x1={100 + i * 130} y1="340" x2={100 + i * 130} y2="350" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1" />
            <text x={100 + i * 130} y="365" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{label}</text>
          </g>
        ))}

        {/* Growth rate bar */}
        <rect x="100" y="328" width="260" height="12" rx="3" fill="#10b981" opacity="0.4" />
        <text x="230" y="325" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400">Rapid elongation phase</text>
        <rect x="360" y="328" width="260" height="12" rx="3" fill="#6b7280" opacity="0.2" />
        <text x="490" y="325" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Lignification (hardening)</text>

        {/* Bottom fact */}
        <rect x="60" y="400" width="580" height="30" rx="6" className="fill-lime-50 dark:fill-lime-950/30 stroke-lime-200 dark:stroke-lime-800" strokeWidth="1" />
        <text x="350" y="420" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-lime-700 dark:fill-lime-300">
          91 cm/day = mostly water-driven cell stretching, not new cell creation
        </text>
      </svg>
    </div>
  );
}
