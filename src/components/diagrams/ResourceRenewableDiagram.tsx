export default function ResourceRenewableDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 534 340" className="w-full h-auto" role="img"
        aria-label="Comparison chart of renewable versus non-renewable resources">
        <rect width="520" height="340" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Renewable vs Non-Renewable Resources
        </text>

        {/* Renewable side */}
        <rect x="20" y="45" width="235" height="240" rx="8" fill="none" stroke="#34d399" strokeWidth="1.5" />
        <rect x="20" y="45" width="235" height="28" rx="8" fill="#166534" opacity="0.3" />
        <text x="137" y="64" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6ee7b7">RENEWABLE</text>

        <text x="137" y="88" textAnchor="middle" fontSize="10" fill="#94a3b8">Replenished within a human lifetime</text>

        {/* Renewable items */}
        <circle cx="50" cy="115" r="12" fill="#fbbf24" opacity="0.3" />
        <text x="50" y="119" textAnchor="middle" fontSize="12">&#x2600;&#xFE0F;</text>
        <text x="80" y="113" fontSize="11" fontWeight="bold" fill="#6ee7b7">Solar energy</text>
        <text x="80" y="126" fontSize="10" fill="#94a3b8">Unlimited supply</text>

        <circle cx="50" cy="150" r="12" fill="#60a5fa" opacity="0.2" />
        <text x="50" y="154" textAnchor="middle" fontSize="12">&#x1F4A8;</text>
        <text x="80" y="148" fontSize="11" fontWeight="bold" fill="#6ee7b7">Wind energy</text>
        <text x="80" y="161" fontSize="10" fill="#94a3b8">Driven by Sun heating air</text>

        <circle cx="50" cy="185" r="12" fill="#3b82f6" opacity="0.2" />
        <text x="50" y="189" textAnchor="middle" fontSize="12">&#x1F4A7;</text>
        <text x="80" y="183" fontSize="11" fontWeight="bold" fill="#6ee7b7">Hydropower</text>
        <text x="80" y="196" fontSize="10" fill="#94a3b8">63,000 MW potential in NE India</text>

        <circle cx="50" cy="220" r="12" fill="#166534" opacity="0.3" />
        <text x="50" y="224" textAnchor="middle" fontSize="12">&#x1F332;</text>
        <text x="80" y="218" fontSize="11" fontWeight="bold" fill="#6ee7b7">Forests / Bamboo</text>
        <text x="80" y="231" fontSize="10" fill="#94a3b8">If managed sustainably</text>

        <circle cx="50" cy="255" r="12" fill="#60a5fa" opacity="0.15" />
        <text x="50" y="259" textAnchor="middle" fontSize="12">&#x1F41F;</text>
        <text x="80" y="253" fontSize="11" fontWeight="bold" fill="#6ee7b7">Fish stocks</text>
        <text x="80" y="266" fontSize="10" fill="#94a3b8">If harvesting is sustainable</text>

        {/* Warning */}
        <text x="137" y="282" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">
          "Renewable" does not mean infinite!
        </text>

        {/* Non-renewable side */}
        <rect x="270" y="45" width="230" height="240" rx="8" fill="none" stroke="#f87171" strokeWidth="1.5" />
        <rect x="270" y="45" width="230" height="28" rx="8" fill="#991b1b" opacity="0.3" />
        <text x="385" y="64" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fca5a5">NON-RENEWABLE</text>

        <text x="385" y="88" textAnchor="middle" fontSize="10" fill="#94a3b8">Millions of years to form, finite supply</text>

        {/* Non-renewable items */}
        <rect x="290" y="100" width="24" height="24" rx="4" fill="#1c1917" opacity="0.6" />
        <text x="324" y="113" fontSize="11" fontWeight="bold" fill="#fca5a5">Coal</text>
        <text x="324" y="126" fontSize="10" fill="#94a3b8">55% of India's electricity</text>

        <rect x="290" y="140" width="24" height="24" rx="4" fill="#451a03" opacity="0.5" />
        <text x="324" y="153" fontSize="11" fontWeight="bold" fill="#fca5a5">Petroleum</text>
        <text x="324" y="166" fontSize="10" fill="#94a3b8">Digboi: Asia's first oil well</text>

        <rect x="290" y="180" width="24" height="24" rx="4" fill="#1e293b" opacity="0.5" />
        <text x="324" y="193" fontSize="11" fontWeight="bold" fill="#fca5a5">Natural gas</text>
        <text x="324" y="206" fontSize="10" fill="#94a3b8">Assam-Arakan basin</text>

        <rect x="290" y="220" width="24" height="24" rx="4" fill="#78716c" opacity="0.4" />
        <text x="324" y="233" fontSize="11" fontWeight="bold" fill="#fca5a5">Metal ores</text>
        <text x="324" y="246" fontSize="10" fill="#94a3b8">Iron, copper, aluminium</text>

        <text x="385" y="276" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f87171">
          Once consumed, cannot be replaced
        </text>

        {/* Bottom key insight */}
        <rect x="40" y="298" width="440" height="32" rx="6" fill="none" stroke="#fbbf24" strokeWidth="1" />
        <text x="260" y="318" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">
          The sustainability of any resource depends entirely on how it is managed, not just its category.
        </text>
      </svg>
    </div>
  );
}
