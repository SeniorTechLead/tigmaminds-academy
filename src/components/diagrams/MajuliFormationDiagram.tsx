export default function MajuliFormationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 580 440" className="w-full max-w-2xl mx-auto" role="img" aria-label="Three-stage diagram showing how Majuli island formed through river avulsion">
        <defs>
          <linearGradient id="majFwater" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <marker id="majFarrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <path d="M0,0 L7,2.5 L0,5 Z" className="fill-sky-400" />
          </marker>
        </defs>

        <rect width="580" height="440" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="290" y="26" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">How Majuli Was Born: River Avulsion</text>

        {/* Stage 1: Original channels */}
        <rect x="20" y="42" width="540" height="110" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="40" y="62" className="fill-sky-300" fontSize="12" fontWeight="bold">Stage 1: Two Separate Channels</text>

        {/* Land between rivers */}
        <rect x="60" y="80" width="480" height="55" rx="4" className="fill-emerald-900" opacity="0.5" />
        <text x="300" y="110" textAnchor="middle" className="fill-emerald-400" fontSize="11">Land (future Majuli)</text>

        {/* Brahmaputra - north */}
        <path d="M 40,75 Q 200,65 350,72 Q 450,78 560,70" fill="none" stroke="url(#majFwater)" strokeWidth="10" opacity="0.8" />
        <text x="180" y="68" className="fill-sky-200" fontSize="10" fontWeight="bold">Brahmaputra (north channel)</text>
        <path d="M 440,72 L 460,72" fill="none" className="stroke-sky-400" strokeWidth="1.5" markerEnd="url(#majFarrow)" />

        {/* Subansiri - south */}
        <path d="M 40,140 Q 200,148 350,142 Q 450,138 560,145" fill="none" stroke="url(#majFwater)" strokeWidth="8" opacity="0.6" />
        <text x="180" y="148" className="fill-blue-300" fontSize="10">Subansiri (south tributary)</text>
        <path d="M 440,141 L 460,141" fill="none" className="stroke-sky-400" strokeWidth="1.5" markerEnd="url(#majFarrow)" />

        {/* Stage 2: Brahmaputra shifts south */}
        <rect x="20" y="162" width="540" height="120" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="40" y="182" className="fill-sky-300" fontSize="12" fontWeight="bold">Stage 2: Brahmaputra Shifts South (Avulsion)</text>

        {/* Old channel fading */}
        <path d="M 40,195 Q 200,188 350,192 Q 450,196 560,190" fill="none" className="stroke-blue-800" strokeWidth="6" strokeDasharray="8,6" opacity="0.4" />
        <text x="430" y="205" className="fill-gray-400 dark:fill-slate-500" fontSize="9">Old channel (drying up)</text>

        {/* Land becoming island */}
        <rect x="60" y="200" width="480" height="40" rx="4" className="fill-emerald-800" opacity="0.6" />
        <text x="300" y="224" textAnchor="middle" className="fill-emerald-300" fontSize="11" fontWeight="bold">Majuli forming</text>

        {/* Brahmaputra moving south */}
        <path d="M 40,250 Q 150,265 280,260 Q 400,255 560,260" fill="none" stroke="url(#majFwater)" strokeWidth="12" opacity="0.8" />
        <text x="280" y="275" textAnchor="middle" className="fill-sky-200" fontSize="10" fontWeight="bold">Brahmaputra captures Subansiri’s channel</text>
        <path d="M 440,258 L 460,258" fill="none" className="stroke-sky-400" strokeWidth="1.5" markerEnd="url(#majFarrow)" />

        {/* Curved arrow showing shift */}
        <path d="M 300,195 Q 320,225 300,248" fill="none" className="stroke-amber-400" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#majFarrow)">
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        <text x="325" y="222" className="fill-amber-400" fontSize="9">River shifts</text>

        {/* Stage 3: Island formed */}
        <rect x="20" y="292" width="540" height="140" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="40" y="312" className="fill-sky-300" fontSize="12" fontWeight="bold">Stage 3: Majuli Island Formed</text>

        {/* North channel */}
        <path d="M 40,325 Q 200,318 350,322 Q 450,326 560,320" fill="none" stroke="url(#majFwater)" strokeWidth="8" opacity="0.5" />
        <text x="480" y="316" className="fill-blue-400" fontSize="9">North channel</text>

        {/* The island */}
        <ellipse cx="300" cy="365" rx="200" ry="30" className="fill-emerald-700" opacity="0.7" />
        <rect x="120" y="348" width="360" height="35" rx="16" className="fill-emerald-600" opacity="0.5" />

        {/* Island features */}
        {[160, 220, 280, 340, 400].map((x, i) => (
          <g key={`tree-${i}`}>
            <line x1={x} y1={365} x2={x} y2={352} className="stroke-emerald-400" strokeWidth="1.5" />
            <circle cx={x} cy={349} r={4} className="fill-emerald-400" opacity="0.7" />
          </g>
        ))}
        <text x="300" y="370" textAnchor="middle" className="fill-white" fontSize="12" fontWeight="bold">MAJULI ISLAND</text>
        <text x="300" y="384" textAnchor="middle" className="fill-emerald-300" fontSize="10">~1,200 km² at its peak</text>

        {/* South channel */}
        <path d="M 40,400 Q 200,410 350,405 Q 450,400 560,408" fill="none" stroke="url(#majFwater)" strokeWidth="12" opacity="0.8" />
        <text x="480" y="420" className="fill-sky-200" fontSize="9">Main Brahmaputra</text>

        {/* Key insight */}
        <text x="290" y="435" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">The river flowed around the land instead of through it — creating an island by indecision.</text>
      </svg>
    </div>
  );
}
