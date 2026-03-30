export default function TejimolaDNADiagram() {
  /* DNA double helix (simplified ladder) with base pairs highlighted */
  const basePairs: [string, string, string, string][] = [
    ['A', 'T', '#ef4444', '#3b82f6'],
    ['T', 'A', '#3b82f6', '#ef4444'],
    ['C', 'G', '#22c55e', '#f59e0b'],
    ['G', 'C', '#f59e0b', '#22c55e'],
    ['A', 'T', '#ef4444', '#3b82f6'],
    ['C', 'G', '#22c55e', '#f59e0b'],
    ['T', 'A', '#3b82f6', '#ef4444'],
    ['G', 'C', '#f59e0b', '#22c55e'],
    ['A', 'T', '#ef4444', '#3b82f6'],
    ['C', 'G', '#22c55e', '#f59e0b'],
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 460"
        className="w-full h-auto"
        role="img"
        aria-label="DNA structure diagram showing the double helix, base pairing rules, and how genes encode instructions"
      >
        <rect width="600" height="460" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="30" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#a78bfa">The Instruction Manual Inside Every Cell</text>

        {/* DNA ladder (left side) */}
        <text x="140" y="60" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#e2e8f0">DNA Double Helix</text>

        {/* Sugar-phosphate backbone — left strand */}
        <line x1="80" y1="80" x2="80" y2="380" stroke="#6366f1" strokeWidth="4" opacity="0.6" />
        {/* Right strand */}
        <line x1="200" y1="80" x2="200" y2="380" stroke="#6366f1" strokeWidth="4" opacity="0.6" />

        {/* Base pairs as rungs */}
        {basePairs.map(([left, right, lColor, rColor], i) => {
          const y = 95 + i * 28;
          return (
            <g key={i}>
              {/* Left base */}
              <rect x="80" y={y - 8} width="50" height="16" rx="3" fill={lColor} opacity="0.8" />
              <text x="105" y={y + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">{left}</text>
              {/* Hydrogen bond dashes */}
              <line x1="130" y1={y} x2="150" y2={y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2" />
              {/* Right base */}
              <rect x="150" y={y - 8} width="50" height="16" rx="3" fill={rColor} opacity="0.8" />
              <text x="175" y={y + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">{right}</text>
            </g>
          );
        })}

        {/* Backbone labels */}
        <text x="62" y="230" textAnchor="middle" fontSize="9" fill="#818cf8" transform="rotate(-90, 62, 230)">sugar-phosphate backbone</text>
        <text x="218" y="230" textAnchor="middle" fontSize="9" fill="#818cf8" transform="rotate(90, 218, 230)">sugar-phosphate backbone</text>

        {/* Pairing rules box */}
        <rect x="50" y="390" width="180" height="55" rx="6" fill="#312e81" />
        <text x="140" y="407" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a5b4fc">Pairing Rules</text>
        <text x="140" y="422" textAnchor="middle" fontSize="10" fill="#c4b5fd">A always pairs with T</text>
        <text x="140" y="437" textAnchor="middle" fontSize="10" fill="#c4b5fd">C always pairs with G</text>

        {/* RIGHT: Gene to Protein flow */}
        <text x="430" y="60" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#e2e8f0">From Gene to Organism</text>

        {/* DNA → Gene → Protein → Trait flow */}
        {[
          { y: 90, label: 'Chromosome', desc: '23 pairs in humans', icon: 'X', color: '#818cf8' },
          { y: 155, label: 'Gene', desc: 'Section of DNA', icon: '===', color: '#34d399' },
          { y: 220, label: 'mRNA', desc: 'Copy of the gene', icon: '~~~', color: '#fbbf24' },
          { y: 285, label: 'Protein', desc: 'Folded molecule', icon: '{}', color: '#f472b6' },
          { y: 350, label: 'Trait', desc: 'What you can see', icon: '!', color: '#22d3ee' },
        ].map((step, i) => (
          <g key={i}>
            <rect x="330" y={step.y - 5} width="200" height="42" rx="8" fill={step.color} opacity="0.12" />
            <circle cx="355" cy={step.y + 16} r="14" fill={step.color} opacity="0.3" />
            <text x="355" y={step.y + 20} textAnchor="middle" fontSize="12" fontWeight="bold" fill={step.color}>{step.icon}</text>
            <text x="380" y={step.y + 11} fontSize="11" fontWeight="bold" fill={step.color}>{step.label}</text>
            <text x="380" y={step.y + 26} fontSize="9" fill="#d1d5db">{step.desc}</text>
            {i < 4 && (
              <line x1="430" y1={step.y + 37} x2="430" y2={step.y + 55} stroke={step.color} strokeWidth="1.5" markerEnd="url(#arrowDna)" />
            )}
          </g>
        ))}

        {/* Key insight box */}
        <rect x="330" y="395" width="200" height="48" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <text x="430" y="413" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">Same DNA in every cell</text>
        <text x="430" y="428" textAnchor="middle" fontSize="10" fill="#94a3b8">Different genes switched on</text>
        <text x="430" y="440" textAnchor="middle" fontSize="10" fill="#94a3b8">= different cell types</text>

        <defs>
          <marker id="arrowDna" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
