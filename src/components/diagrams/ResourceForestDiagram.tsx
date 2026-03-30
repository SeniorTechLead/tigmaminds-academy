export default function ResourceForestDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" role="img"
        aria-label="Diagram showing forest ecosystem services: carbon, water, biodiversity, livelihoods">
        <rect width="520" height="360" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Forest Ecosystem Services
        </text>
        <text x="260" y="42" textAnchor="middle" fontSize="10" fill="#94a3b8">
          NE India: 65% forest cover (national average 22%) | 25% of India's total forest
        </text>

        {/* Central forest */}
        {/* Tree trunks */}
        <rect x="230" y="130" width="8" height="50" fill="#713f12" opacity="0.7" />
        <rect x="258" y="120" width="10" height="65" fill="#713f12" opacity="0.7" />
        <rect x="282" y="135" width="7" height="45" fill="#713f12" opacity="0.7" />
        {/* Canopies */}
        <ellipse cx="234" cy="115" rx="28" ry="22" fill="#166534" opacity="0.6" />
        <ellipse cx="263" cy="100" rx="32" ry="26" fill="#15803d" opacity="0.5" />
        <ellipse cx="286" cy="118" rx="25" ry="20" fill="#166534" opacity="0.6" />
        {/* Ground */}
        <rect x="200" y="180" width="120" height="12" rx="4" fill="#3f6212" opacity="0.3" />

        {/* Service 1: Carbon (top-left) */}
        <rect x="20" y="60" width="160" height="70" rx="8" fill="none" stroke="#34d399" strokeWidth="1.5" />
        <text x="100" y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6ee7b7">Carbon Storage</text>
        <text x="100" y="96" textAnchor="middle" fontSize="10" fill="#94a3b8">Absorb CO2, store carbon</text>
        <text x="100" y="110" textAnchor="middle" fontSize="10" fill="#94a3b8">in wood and soil</text>
        <text x="100" y="124" textAnchor="middle" fontSize="10" fill="#6ee7b7">Climate regulation</text>
        <line x1="180" y1="100" x2="210" y2="115" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" />

        {/* Service 2: Water (top-right) */}
        <rect x="340" y="60" width="160" height="70" rx="8" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="420" y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#93c5fd">Water Cycle</text>
        <text x="420" y="96" textAnchor="middle" fontSize="10" fill="#94a3b8">Regulate rainfall, prevent</text>
        <text x="420" y="110" textAnchor="middle" fontSize="10" fill="#94a3b8">floods, filter water</text>
        <text x="420" y="124" textAnchor="middle" fontSize="10" fill="#93c5fd">Watershed protection</text>
        <line x1="340" y1="100" x2="310" y2="115" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,3" />

        {/* Service 3: Biodiversity (bottom-left) */}
        <rect x="20" y="155" width="160" height="70" rx="8" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="100" y="175" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c4b5fd">Biodiversity</text>
        <text x="100" y="191" textAnchor="middle" fontSize="10" fill="#94a3b8">Hoolock gibbon, red panda,</text>
        <text x="100" y="205" textAnchor="middle" fontSize="10" fill="#94a3b8">clouded leopard, 1000s of</text>
        <text x="100" y="219" textAnchor="middle" fontSize="10" fill="#c4b5fd">endemic plant species</text>
        <line x1="180" y1="185" x2="210" y2="170" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" />

        {/* Service 4: Livelihoods (bottom-right) */}
        <rect x="340" y="155" width="160" height="70" rx="8" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="420" y="175" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fde68a">Livelihoods</text>
        <text x="420" y="191" textAnchor="middle" fontSize="10" fill="#94a3b8">Timber, bamboo (60% of</text>
        <text x="420" y="205" textAnchor="middle" fontSize="10" fill="#94a3b8">India's supply), honey,</text>
        <text x="420" y="219" textAnchor="middle" fontSize="10" fill="#fde68a">medicinal plants, food</text>
        <line x1="340" y1="185" x2="310" y2="170" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" />

        {/* Threats and heroes */}
        <rect x="20" y="240" width="230" height="75" rx="6" fill="none" stroke="#f87171" strokeWidth="1" />
        <text x="135" y="258" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fca5a5">Threats</text>
        <text x="135" y="274" textAnchor="middle" fontSize="10" fill="#94a3b8">Jhum with shortened fallow (3-5 years)</text>
        <text x="135" y="288" textAnchor="middle" fontSize="10" fill="#94a3b8">Legal and illegal logging</text>
        <text x="135" y="302" textAnchor="middle" fontSize="10" fill="#94a3b8">Roads, dams fragmenting habitat</text>

        <rect x="270" y="240" width="230" height="75" rx="6" fill="none" stroke="#34d399" strokeWidth="1" />
        <text x="385" y="258" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6ee7b7">Conservation Heroes</text>
        <text x="385" y="274" textAnchor="middle" fontSize="10" fill="#94a3b8">Jadav Payeng: planted forest larger</text>
        <text x="385" y="288" textAnchor="middle" fontSize="10" fill="#94a3b8">than Central Park, single-handedly</text>
        <text x="385" y="302" textAnchor="middle" fontSize="10" fill="#94a3b8">Sacred groves: indigenous protection</text>

        {/* Bottom note */}
        <text x="260" y="340" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">
          Part of two global biodiversity hotspots: Eastern Himalayas and Indo-Burma region
        </text>
      </svg>
    </div>
  );
}
