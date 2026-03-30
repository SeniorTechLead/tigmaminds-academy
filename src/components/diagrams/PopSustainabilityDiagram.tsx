export default function PopSustainabilityDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" role="img"
        aria-label="Diagram showing three pillars of sustainable development: economy, society, environment">
        <rect width="520" height="360" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Sustainable Development: Three Pillars
        </text>
        <text x="260" y="44" textAnchor="middle" fontSize="10" fill="#94a3b8">
          Meeting present needs without compromising future generations
        </text>

        {/* Venn diagram of three pillars */}
        {/* Economy circle */}
        <circle cx="210" cy="150" r="80" fill="#fbbf24" opacity="0.12" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="160" y="115" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fde68a">Economy</text>
        <text x="160" y="130" textAnchor="middle" fontSize="10" fill="#fde68a">Jobs, growth,</text>
        <text x="160" y="143" textAnchor="middle" fontSize="10" fill="#fde68a">livelihoods</text>

        {/* Society circle */}
        <circle cx="310" cy="150" r="80" fill="#a78bfa" opacity="0.12" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="360" y="115" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#c4b5fd">Society</text>
        <text x="360" y="130" textAnchor="middle" fontSize="10" fill="#c4b5fd">Health, education,</text>
        <text x="360" y="143" textAnchor="middle" fontSize="10" fill="#c4b5fd">equity, justice</text>

        {/* Environment circle */}
        <circle cx="260" cy="220" r="80" fill="#34d399" opacity="0.12" stroke="#34d399" strokeWidth="1.5" />
        <text x="260" y="265" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6ee7b7">Environment</text>
        <text x="260" y="280" textAnchor="middle" fontSize="10" fill="#6ee7b7">Ecosystems, biodiversity,</text>
        <text x="260" y="293" textAnchor="middle" fontSize="10" fill="#6ee7b7">natural resources</text>

        {/* Overlap labels */}
        {/* Economy + Society */}
        <text x="260" y="122" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">Equitable</text>

        {/* Economy + Environment */}
        <text x="210" y="200" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">Viable</text>

        {/* Society + Environment */}
        <text x="310" y="200" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">Bearable</text>

        {/* Center - Sustainable */}
        <circle cx="260" cy="170" r="22" fill="#fbbf24" opacity="0.15" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="260" y="167" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Sustainable</text>
        <text x="260" y="179" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Development</text>

        {/* NE India example */}
        <rect x="30" y="310" width="460" height="40" rx="6" fill="none" stroke="#fbbf24" strokeWidth="1" />
        <text x="260" y="328" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">
          NE India: Biodiversity hotspot + communities needing development
        </text>
        <text x="260" y="342" textAnchor="middle" fontSize="10" fill="#94a3b8">
          NH-37 through Kaziranga: essential road but threatens wildlife | Hydropower: clean energy vs river ecosystems
        </text>
      </svg>
    </div>
  );
}
