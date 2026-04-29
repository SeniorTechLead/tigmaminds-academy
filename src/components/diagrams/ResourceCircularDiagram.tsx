export default function ResourceCircularDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" role="img"
        aria-label="Circular economy diagram showing reuse, repair, recycle cycle versus linear take-make-dispose">
        <rect width="520" height="380" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Sustainability: Circular vs Linear Economy
        </text>

        {/* Linear economy (top) */}
        <rect x="20" y="45" width="480" height="65" rx="6" fill="none" stroke="#f87171" strokeWidth="1.5" />
        <text x="260" y="62" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fca5a5">Linear Economy (wasteful)</text>

        {/* Linear flow */}
        <rect x="50" y="72" width="70" height="26" rx="4" fill="#854d0e" opacity="0.3" />
        <text x="85" y="89" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fde68a">TAKE</text>
        <line x1="125" y1="85" x2="160" y2="85" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#circArrow)" />

        <rect x="165" y="72" width="70" height="26" rx="4" fill="#475569" opacity="0.3" />
        <text x="200" y="89" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">MAKE</text>
        <line x1="240" y1="85" x2="275" y2="85" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#circArrow)" />

        <rect x="280" y="72" width="70" height="26" rx="4" fill="#1e3a8a" opacity="0.3" />
        <text x="315" y="89" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">USE</text>
        <line x1="355" y1="85" x2="390" y2="85" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#circArrow)" />

        <rect x="395" y="72" width="80" height="26" rx="4" fill="#991b1b" opacity="0.2" />
        <text x="435" y="89" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f87171">DISPOSE</text>

        {/* Circular economy (center) */}
        <text x="260" y="135" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#34d399">Circular Economy (sustainable)</text>

        {/* Circular flow */}
        <circle cx="260" cy="240" r="80" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="8,4" />

        {/* Nodes on circle */}
        {/* Design */}
        <circle cx="260" cy="160" r="24" fill="#166534" opacity="0.3" stroke="#34d399" strokeWidth="1.5" />
        <text x="260" y="157" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6ee7b7">Design</text>
        <text x="260" y="169" textAnchor="middle" fontSize="10" fill="#6ee7b7">for reuse</text>

        {/* Produce */}
        <circle cx="340" cy="200" r="24" fill="#1e40af" opacity="0.2" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="340" y="198" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Produce</text>
        <text x="340" y="210" textAnchor="middle" fontSize="10" fill="#93c5fd">cleanly</text>

        {/* Use */}
        <circle cx="330" cy="290" r="24" fill="#7c3aed" opacity="0.15" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="330" y="288" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#c4b5fd">Use</text>
        <text x="330" y="300" textAnchor="middle" fontSize="10" fill="#c4b5fd">longer</text>

        {/* Repair / Reuse */}
        <circle cx="260" cy="320" r="24" fill="#854d0e" opacity="0.2" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="260" y="318" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fde68a">Repair</text>
        <text x="260" y="330" textAnchor="middle" fontSize="10" fill="#fde68a">reuse</text>

        {/* Recycle */}
        <circle cx="190" cy="290" r="24" fill="#991b1b" opacity="0.15" stroke="#f87171" strokeWidth="1.5" />
        <text x="190" y="294" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fca5a5">Recycle</text>

        {/* Recover */}
        <circle cx="180" cy="200" r="24" fill="#166534" opacity="0.2" stroke="#34d399" strokeWidth="1.5" />
        <text x="180" y="198" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6ee7b7">Recover</text>
        <text x="180" y="210" textAnchor="middle" fontSize="10" fill="#6ee7b7">materials</text>

        {/* Arrow arcs (simplified with lines) */}
        <line x1="280" y1="165" x2="318" y2="182" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#circArrowG)" />
        <line x1="350" y1="220" x2="345" y2="268" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#circArrowG)" />
        <line x1="310" y1="305" x2="282" y2="315" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#circArrowG)" />
        <line x1="240" y1="315" x2="210" y2="305" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#circArrowG)" />
        <line x1="178" y1="268" x2="175" y2="222" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#circArrowG)" />
        <line x1="195" y1="182" x2="240" y2="165" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#circArrowG)" />

        {/* NE India examples */}
        <rect x="380" y="148" width="125" height="80" rx="6" fill="none" stroke="#fbbf24" strokeWidth="1" />
        <text x="442" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fde68a">NE India Examples</text>
        <text x="442" y="180" textAnchor="middle" fontSize="10" fill="#94a3b8">Bamboo: regrows</text>
        <text x="442" y="193" textAnchor="middle" fontSize="10" fill="#94a3b8">from root, no replant</text>
        <text x="442" y="206" textAnchor="middle" fontSize="10" fill="#94a3b8">Sikkim: 100% organic</text>
        <text x="442" y="219" textAnchor="middle" fontSize="10" fill="#94a3b8">state since 2016</text>

        {/* Waste = food principle */}
        <rect x="15" y="148" width="125" height="55" rx="6" fill="none" stroke="#a78bfa" strokeWidth="1" />
        <text x="77" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#c4b5fd">Key Principle</text>
        <text x="77" y="180" textAnchor="middle" fontSize="10" fill="#94a3b8">Waste from one</text>
        <text x="77" y="193" textAnchor="middle" fontSize="10" fill="#94a3b8">process = input</text>
        <text x="77" y="205" textAnchor="middle" fontSize="10" fill="#c4b5fd">for another</text>

        <defs>
          <marker id="circArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#f87171" strokeWidth="1.5" />
          </marker>
          <marker id="circArrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#34d399" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
