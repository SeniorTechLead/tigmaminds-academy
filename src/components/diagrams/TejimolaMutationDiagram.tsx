export default function TejimolaMutationDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 440"
        className="w-full h-auto"
        role="img"
        aria-label="Mutation types diagram showing substitution, insertion, and deletion mutations and their effects"
      >
        <rect width="600" height="440" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#f472b6">When Genes Go Wrong: Mutations</text>

        {/* Original sequence */}
        <text x="300" y="55" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">Original DNA sequence:</text>
        <g transform="translate(130, 65)">
          {['A', 'T', 'G', 'C', 'A', 'T', 'G', 'C', 'A', 'T'].map((base, i) => {
            const colors: Record<string, string> = { A: '#ef4444', T: '#3b82f6', G: '#f59e0b', C: '#22c55e' };
            return (
              <g key={i}>
                <rect x={i * 34} y="0" width="30" height="22" rx="4" fill={colors[base]} opacity="0.8" />
                <text x={i * 34 + 15} y="15" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{base}</text>
              </g>
            );
          })}
        </g>

        {/* 1. Substitution */}
        <rect x="20" y="105" width="560" height="92" rx="8" fill="#ef4444" opacity="0.06" />
        <text x="40" y="125" fontSize="12" fontWeight="bold" fill="#ef4444">1. Substitution (point mutation)</text>
        <text x="40" y="140" fontSize="10" fill="#d1d5db">One base is swapped for another</text>

        <g transform="translate(130, 148)">
          {['A', 'T', 'G', 'C', 'A', 'T', 'G', 'C', 'A', 'T'].map((base, i) => {
            const mutated = i === 3;
            const displayBase = mutated ? 'T' : base;
            const colors: Record<string, string> = { A: '#ef4444', T: '#3b82f6', G: '#f59e0b', C: '#22c55e' };
            return (
              <g key={i}>
                <rect x={i * 34} y="0" width="30" height="22" rx="4" fill={mutated ? '#ef4444' : colors[displayBase]} opacity={mutated ? 1 : 0.5} stroke={mutated ? '#fca5a5' : 'none'} strokeWidth={mutated ? 2 : 0} />
                <text x={i * 34 + 15} y="15" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{displayBase}</text>
                {mutated && <text x={i * 34 + 15} y="37" textAnchor="middle" fontSize="9" fill="#fca5a5">C changed to T</text>}
              </g>
            );
          })}
        </g>
        <text x="490" y="170" fontSize="10" fill="#fca5a5">Often neutral</text>
        <text x="490" y="183" fontSize="10" fill="#fca5a5">(or silent)</text>

        {/* 2. Insertion */}
        <rect x="20" y="205" width="560" height="92" rx="8" fill="#f59e0b" opacity="0.06" />
        <text x="40" y="225" fontSize="12" fontWeight="bold" fill="#f59e0b">2. Insertion (frameshift)</text>
        <text x="40" y="240" fontSize="10" fill="#d1d5db">Extra base added — shifts everything after it</text>

        <g transform="translate(108, 248)">
          {['A', 'T', 'G', '+G', 'C', 'A', 'T', 'G', 'C', 'A', 'T'].map((base, i) => {
            const inserted = base === '+G';
            const displayBase = inserted ? 'G' : base;
            const colors: Record<string, string> = { A: '#ef4444', T: '#3b82f6', G: '#f59e0b', C: '#22c55e' };
            return (
              <g key={i}>
                <rect x={i * 34} y="0" width="30" height="22" rx="4" fill={inserted ? '#f59e0b' : colors[displayBase]} opacity={inserted ? 1 : (i > 3 ? 0.35 : 0.5)} stroke={inserted ? '#fde68a' : 'none'} strokeWidth={inserted ? 2 : 0} />
                <text x={i * 34 + 15} y="15" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{displayBase}</text>
                {inserted && <text x={i * 34 + 15} y="37" textAnchor="middle" fontSize="9" fill="#fde68a">inserted!</text>}
              </g>
            );
          })}
        </g>
        <text x="490" y="270" fontSize="10" fill="#fde68a">Usually</text>
        <text x="490" y="283" fontSize="10" fill="#fde68a">harmful</text>

        {/* 3. Deletion */}
        <rect x="20" y="305" width="560" height="92" rx="8" fill="#22c55e" opacity="0.06" />
        <text x="40" y="325" fontSize="12" fontWeight="bold" fill="#22c55e">3. Deletion (frameshift)</text>
        <text x="40" y="340" fontSize="10" fill="#d1d5db">Base removed — shifts everything after it</text>

        <g transform="translate(130, 348)">
          {['A', 'T', 'G', '—', 'A', 'T', 'G', 'C', 'A', 'T'].map((base, i) => {
            const deleted = base === '—';
            const colors: Record<string, string> = { A: '#ef4444', T: '#3b82f6', G: '#f59e0b', C: '#22c55e' };
            if (deleted) {
              return (
                <g key={i}>
                  <rect x={i * 34} y="0" width="30" height="22" rx="4" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4,3" />
                  <text x={i * 34 + 15} y="15" textAnchor="middle" fontSize="14" fill="#6b7280">—</text>
                  <text x={i * 34 + 15} y="37" textAnchor="middle" fontSize="9" fill="#86efac">C deleted</text>
                </g>
              );
            }
            return (
              <g key={i}>
                <rect x={i * 34} y="0" width="30" height="22" rx="4" fill={colors[base]} opacity={i > 3 ? 0.35 : 0.5} />
                <text x={i * 34 + 15} y="15" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{base}</text>
              </g>
            );
          })}
        </g>
        <text x="490" y="370" fontSize="10" fill="#86efac">Usually</text>
        <text x="490" y="383" fontSize="10" fill="#86efac">harmful</text>

        {/* Bottom summary */}
        <rect x="100" y="408" width="400" height="24" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600"  strokeWidth="1" />
        <text x="300" y="424" textAnchor="middle" fontSize="10" className="fill-gray-700 dark:fill-slate-200">Most mutations are neutral. Rare beneficial ones drive evolution.</text>
      </svg>
    </div>
  );
}
