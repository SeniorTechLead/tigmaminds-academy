export default function BanyanCarbonFluxDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 428" className="w-full max-w-2xl mx-auto" role="img" aria-label="Carbon flux diagram showing GPP, autotrophic respiration, NPP, heterotrophic respiration, and NEP">
        <rect width="500" height="400" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Carbon Flux: From Sunlight to Storage</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">How carbon flows through an ecosystem</text>

        {/* === GPP (top, large bar) === */}
        <rect x="50" y="65" width="400" height="45" rx="8" className="fill-green-800" />
        <text x="250" y="85" textAnchor="middle" className="fill-green-300" fontSize="12" fontWeight="bold">GPP — Gross Primary Production</text>
        <text x="250" y="100" textAnchor="middle" className="fill-green-400" fontSize="9">Total carbon fixed by photosynthesis = 100%</text>

        {/* Split arrow down */}
        <line x1="180" y1="110" x2="130" y2="140" className="stroke-amber-400" strokeWidth="2" markerEnd="url(#fluxArrowAmber)" />
        <line x1="320" y1="110" x2="370" y2="140" className="stroke-green-400" strokeWidth="2" markerEnd="url(#fluxArrowGreen)" />

        {/* === Autotrophic Respiration (left branch) === */}
        <rect x="30" y="140" width="200" height="40" rx="8" className="fill-amber-900" />
        <text x="130" y="158" textAnchor="middle" className="fill-amber-300" fontSize="10" fontWeight="bold">Autotrophic Respiration</text>
        <text x="130" y="172" textAnchor="middle" className="fill-amber-400" fontSize="8">Tree uses ~50% for its own metabolism</text>

        {/* CO2 released */}
        <line x1="130" y1="180" x2="130" y2="200" className="stroke-amber-400" strokeWidth="1.5" />
        <text x="130" y="212" textAnchor="middle" className="fill-amber-400" fontSize="8">→ CO₂ back to air</text>

        {/* === NPP (right branch, remaining) === */}
        <rect x="270" y="140" width="200" height="40" rx="8" className="fill-green-700" />
        <text x="370" y="158" textAnchor="middle" className="fill-green-200" fontSize="10" fontWeight="bold">NPP — Net Primary Production</text>
        <text x="370" y="172" textAnchor="middle" className="fill-green-300" fontSize="8">Remaining ~50% → new wood, leaves, roots</text>

        {/* Split NPP down */}
        <line x1="330" y1="180" x2="290" y2="230" className="stroke-amber-400" strokeWidth="2" markerEnd="url(#fluxArrowAmber)" />
        <line x1="410" y1="180" x2="410" y2="230" className="stroke-green-400" strokeWidth="2" markerEnd="url(#fluxArrowGreen)" />

        {/* === Heterotrophic Respiration (decomposers eat dead matter) === */}
        <rect x="190" y="230" width="190" height="40" rx="8" className="fill-amber-800" />
        <text x="285" y="248" textAnchor="middle" className="fill-amber-300" fontSize="10" fontWeight="bold">Heterotrophic Respiration</text>
        <text x="285" y="262" textAnchor="middle" className="fill-amber-400" fontSize="8">Decomposers, herbivores use ~30%</text>

        {/* CO2 released */}
        <line x1="285" y1="270" x2="285" y2="290" className="stroke-amber-400" strokeWidth="1.5" />
        <text x="285" y="302" textAnchor="middle" className="fill-amber-400" fontSize="8">→ CO₂ back to air</text>

        {/* === NEP (what's left — stored) === */}
        <rect x="380" y="230" width="100" height="40" rx="8" className="fill-green-600" />
        <text x="430" y="248" textAnchor="middle" className="fill-green-100" fontSize="10" fontWeight="bold">NEP</text>
        <text x="430" y="262" textAnchor="middle" className="fill-green-200" fontSize="8">Net Ecosystem</text>

        {/* NEP stored */}
        <line x1="430" y1="270" x2="430" y2="298" className="stroke-green-400" strokeWidth="2" markerEnd="url(#fluxArrowGreen)" />
        <rect x="370" y="298" width="120" height="30" rx="6" className="fill-green-900" />
        <text x="430" y="313" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">~20% stored</text>
        <text x="430" y="324" textAnchor="middle" className="fill-green-400" fontSize="8">in wood &amp; soil</text>

        {/* Waterfall summary */}
        <rect x="30" y="345" width="440" height="45" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="250" y="363" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">
          GPP (100%) − Autotrophic Resp (50%) = NPP (50%)
        </text>
        <text x="250" y="378" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">
          NPP (50%) − Heterotrophic Resp (30%) = NEP (20%) → long-term carbon storage
        </text>

        <defs>
          <marker id="fluxArrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-green-400" />
          </marker>
          <marker id="fluxArrowAmber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
