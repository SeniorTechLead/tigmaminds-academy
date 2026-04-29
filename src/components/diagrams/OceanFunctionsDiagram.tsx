export default function OceanFunctionsDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 532 380" className="w-full h-auto" role="img"
        aria-label="Infographic showing why the ocean matters: carbon absorption, oxygen production, heat buffer, food source">
        <rect width="520" height="380" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Why the Ocean Matters
        </text>
        <text x="260" y="42" textAnchor="middle" fontSize="11" fill="#94a3b8">71% of Earth's surface | The engine of habitability</text>

        {/* Central ocean icon */}
        <circle cx="260" cy="190" r="50" fill="#0c4a6e" opacity="0.5" stroke="#3b82f6" strokeWidth="2" />
        <text x="260" y="186" textAnchor="middle" fontSize="28">&#x1F30A;</text>
        <text x="260" y="210" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#93c5fd">OCEAN</text>

        {/* Function 1: CO2 absorption (top-left) */}
        <rect x="20" y="60" width="170" height="80" rx="8" fill="none" stroke="#34d399" strokeWidth="1.5" />
        <text x="105" y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#34d399">Absorbs 30% of CO2</text>
        <text x="105" y="96" textAnchor="middle" fontSize="10" fill="#94a3b8">Slows climate change</text>
        <text x="105" y="110" textAnchor="middle" fontSize="10" fill="#94a3b8">but causes ocean</text>
        <text x="105" y="124" textAnchor="middle" fontSize="10" fill="#94a3b8">acidification</text>
        <line x1="190" y1="120" x2="215" y2="160" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" />

        {/* Function 2: Oxygen (top-right) */}
        <rect x="330" y="60" width="170" height="80" rx="8" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="415" y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">Produces 50% of O2</text>
        <text x="415" y="96" textAnchor="middle" fontSize="10" fill="#94a3b8">Phytoplankton are</text>
        <text x="415" y="110" textAnchor="middle" fontSize="10" fill="#94a3b8">Earth's biggest</text>
        <text x="415" y="124" textAnchor="middle" fontSize="10" fill="#94a3b8">oxygen factory</text>
        <line x1="330" y1="120" x2="305" y2="160" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,3" />

        {/* Function 3: Heat buffer (bottom-left) */}
        <rect x="20" y="240" width="170" height="80" rx="8" fill="none" stroke="#f87171" strokeWidth="1.5" />
        <text x="105" y="260" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f87171">Absorbs 90% of Heat</text>
        <text x="105" y="276" textAnchor="middle" fontSize="10" fill="#94a3b8">Buffers atmospheric</text>
        <text x="105" y="290" textAnchor="middle" fontSize="10" fill="#94a3b8">warming but raises</text>
        <text x="105" y="304" textAnchor="middle" fontSize="10" fill="#94a3b8">ocean temperatures</text>
        <line x1="190" y1="260" x2="215" y2="220" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3" />

        {/* Function 4: Food source (bottom-right) */}
        <rect x="330" y="240" width="170" height="80" rx="8" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="415" y="260" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Feeds 3 Billion People</text>
        <text x="415" y="276" textAnchor="middle" fontSize="10" fill="#94a3b8">Fish is primary protein</text>
        <text x="415" y="290" textAnchor="middle" fontSize="10" fill="#94a3b8">for over 3 billion</text>
        <text x="415" y="304" textAnchor="middle" fontSize="10" fill="#94a3b8">people worldwide</text>
        <line x1="330" y1="260" x2="305" y2="220" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" />

        {/* Bottom note */}
        <rect x="50" y="340" width="420" height="30" rx="6" fill="none" stroke="#475569" strokeWidth="1" />
        <text x="260" y="360" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">
          We know more about Mars than the deep ocean floor. Only 20% has been mapped in high resolution.
        </text>
      </svg>
    </div>
  );
}
