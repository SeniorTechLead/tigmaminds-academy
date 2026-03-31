export default function BodhiGraftingDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Grafting and tissue culture techniques for plant cloning">
        <rect width="570" height="420" rx="12" className="fill-white dark:fill-slate-900" />
        <text x="285" y="28" textAnchor="middle" className="fill-teal-400" fontSize="14" fontWeight="bold">Grafting & Tissue Culture</text>

        {/* LEFT: Grafting */}
        <text x="150" y="55" textAnchor="middle" className="fill-amber-300" fontSize="12" fontWeight="bold">Grafting</text>
        <text x="150" y="72" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Two plants joined into one</text>

        {/* Rootstock */}
        <rect x="125" y="220" width="50" height="60" rx="4" className="fill-amber-800" />
        <text x="150" y="255" textAnchor="middle" className="fill-amber-300" fontSize="8" fontWeight="bold">Rootstock</text>
        <text x="150" y="267" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">strong roots</text>
        {/* Roots */}
        <path d="M 135,280 Q 125,300 115,310" fill="none" className="stroke-amber-600" strokeWidth="1.5" />
        <path d="M 150,280 L 150,315" fill="none" className="stroke-amber-600" strokeWidth="1.5" />
        <path d="M 165,280 Q 175,300 185,310" fill="none" className="stroke-amber-600" strokeWidth="1.5" />

        {/* V-cut in rootstock */}
        <path d="M 137,220 L 150,240 L 163,220" fill="none" className="stroke-yellow-400" strokeWidth="2" />

        {/* Scion */}
        <line x1="150" y1="220" x2="150" y2="140" className="stroke-green-600" strokeWidth="3" />
        <ellipse cx="140" cy="130" rx="14" ry="8" className="fill-green-500" />
        <ellipse cx="160" cy="125" rx="12" ry="7" className="fill-green-400" />
        <ellipse cx="150" cy="115" rx="10" ry="6" className="fill-green-500" />
        <text x="150" y="100" textAnchor="middle" className="fill-green-300" fontSize="8" fontWeight="bold">Scion</text>
        <text x="150" y="88" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">desired fruit variety</text>

        {/* Graft union label */}
        <line x1="175" y1="220" x2="210" y2="210" className="stroke-yellow-400" strokeWidth="1" />
        <rect x="210" y="200" width="65" height="22" rx="4" className="fill-yellow-900" opacity="0.6" />
        <text x="242" y="215" textAnchor="middle" className="fill-yellow-300" fontSize="8">Graft union</text>

        {/* Auxin callout */}
        <rect x="55" y="180" width="60" height="35" rx="6" className="fill-purple-900" opacity="0.6" />
        <text x="85" y="195" textAnchor="middle" className="fill-purple-300" fontSize="8" fontWeight="bold">Auxin</text>
        <text x="85" y="208" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">promotes healing</text>
        <line x1="115" y1="197" x2="130" y2="220" className="stroke-purple-400" strokeWidth="1" strokeDasharray="3,2" />

        {/* Result label */}
        <text x="150" y="340" textAnchor="middle" className="fill-emerald-300" fontSize="9" fontWeight="bold">One plant, two genotypes</text>
        <text x="150" y="355" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Roots: tough wild species</text>
        <text x="150" y="368" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Fruit: sweet desired variety</text>

        {/* Divider */}
        <line x1="285" y1="50" x2="285" y2="390" className="stroke-slate-700" strokeWidth="1" strokeDasharray="6,4" />

        {/* RIGHT: Tissue Culture */}
        <text x="430" y="55" textAnchor="middle" className="fill-teal-300" fontSize="12" fontWeight="bold">Tissue Culture</text>
        <text x="430" y="72" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Cloning from a few cells</text>

        {/* Step 1: Tiny tissue sample */}
        <rect x="380" y="85" width="100" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#2dd4bf" strokeWidth="0.5" />
        <text x="430" y="100" textAnchor="middle" className="fill-teal-300" fontSize="9">1. Take tiny tissue</text>

        <line x1="430" y1="107" x2="430" y2="120" className="stroke-slate-500" strokeWidth="1" markerEnd="url(#bodhiGraftArr)" />

        {/* Step 2: Sterilize */}
        <rect x="380" y="122" width="100" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#2dd4bf" strokeWidth="0.5" />
        <text x="430" y="137" textAnchor="middle" className="fill-teal-300" fontSize="9">2. Sterilize</text>

        <line x1="430" y1="144" x2="430" y2="157" className="stroke-slate-500" strokeWidth="1" markerEnd="url(#bodhiGraftArr)" />

        {/* Step 3: Nutrient gel + hormones */}
        <rect x="370" y="160" width="120" height="30" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#2dd4bf" strokeWidth="0.5" />
        <text x="430" y="175" textAnchor="middle" className="fill-teal-300" fontSize="9">3. Nutrient gel</text>
        <text x="430" y="186" textAnchor="middle" className="fill-purple-300" fontSize="8">+ auxin + cytokinin</text>

        <line x1="430" y1="190" x2="430" y2="205" className="stroke-slate-500" strokeWidth="1" markerEnd="url(#bodhiGraftArr)" />

        {/* Step 4: Callus forms */}
        <rect x="380" y="207" width="100" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#2dd4bf" strokeWidth="0.5" />
        <text x="430" y="222" textAnchor="middle" className="fill-teal-300" fontSize="9">4. Callus (cell blob)</text>

        <line x1="430" y1="229" x2="430" y2="242" className="stroke-slate-500" strokeWidth="1" markerEnd="url(#bodhiGraftArr)" />

        {/* Step 5: Shoots and roots */}
        <rect x="370" y="245" width="120" height="30" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#2dd4bf" strokeWidth="0.5" />
        <text x="430" y="258" textAnchor="middle" className="fill-teal-300" fontSize="9">5. Shoots form</text>
        <text x="430" y="270" textAnchor="middle" className="fill-purple-300" fontSize="8">high cytokinin : auxin</text>

        <line x1="430" y1="275" x2="430" y2="290" className="stroke-slate-500" strokeWidth="1" markerEnd="url(#bodhiGraftArr)" />

        {/* Step 6: Plantlets */}
        <rect x="380" y="292" width="100" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#2dd4bf" strokeWidth="0.5" />
        <text x="430" y="307" textAnchor="middle" className="fill-teal-300" fontSize="9">6. Thousands of clones</text>

        {/* Mini plantlets */}
        {[380, 400, 420, 440, 460, 480].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="340" x2={x} y2="330" className="stroke-green-500" strokeWidth="1.5" />
            <ellipse cx={x - 3} cy={329} rx={4} ry={2.5} className="fill-green-400" />
            <ellipse cx={x + 3} cy={328} rx={3.5} ry={2} className="fill-green-500" />
          </g>
        ))}
        <text x="430" y="358" textAnchor="middle" className="fill-emerald-300" fontSize="9" fontWeight="bold">All genetically identical</text>

        {/* Bottom key insight */}
        <rect x="40" y="385" width="490" height="25" rx="6" className="fill-teal-900" opacity="0.4" />
        <text x="285" y="402" textAnchor="middle" className="fill-teal-300" fontSize="10" fontWeight="bold">Auxin promotes roots. Cytokinin promotes shoots. The ratio controls what the cells become.</text>

        <defs>
          <marker id="bodhiGraftArr" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5" fill="none" className="stroke-slate-500" strokeWidth="1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
