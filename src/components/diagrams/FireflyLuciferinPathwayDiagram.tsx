export default function FireflyLuciferinPathwayDiagram() {
  const w = 520, h = 380;
  const cx = w / 2;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Biochemical pathway: Luciferin plus ATP yields Luciferyl-AMP, then with oxygen produces Oxyluciferin plus light">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={cx} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">The Bioluminescence Pathway</text>
        <text x={cx} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">How fireflies turn chemistry into light</text>

        {/* Step 1: Luciferin + ATP */}
        <rect x="30" y="70" width="110" height="50" rx="8" className="fill-white dark:fill-slate-950" stroke="#a3e635" strokeWidth="1.5" />
        <text x="85" y="92" textAnchor="middle" fill="#a3e635" fontSize="11" fontWeight="600">Luciferin</text>
        <text x="85" y="107" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">(substrate)</text>

        <text x="170" y="98" textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="700">+</text>

        <rect x="200" y="70" width="80" height="50" rx="8" className="fill-white dark:fill-slate-950" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="240" y="92" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="600">ATP</text>
        <text x="240" y="107" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">(energy)</text>

        {/* Enzyme label */}
        <rect x="320" y="75" width="90" height="40" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#c084fc" strokeWidth="1" />
        <text x="365" y="93" textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="600">Luciferase</text>
        <text x="365" y="106" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">(enzyme catalyst)</text>

        {/* Arrow down */}
        <line x1={cx} y1="125" x2={cx} y2="155" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#pathArrow)" />
        <text x={cx + 15} y="144" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Step 1</text>

        {/* Step 2: Luciferyl-AMP + PPi */}
        <rect x="100" y="165" width="160" height="50" rx="8" className="fill-white dark:fill-slate-950" stroke="#facc15" strokeWidth="1.5" />
        <text x="180" y="187" textAnchor="middle" fill="#facc15" fontSize="11" fontWeight="600">Luciferyl-AMP</text>
        <text x="180" y="202" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">(activated intermediate)</text>

        <text x="290" y="193" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="700">+</text>

        <rect x="310" y="173" width="60" height="35" rx="6" className="fill-white dark:fill-slate-950" stroke="#94a3b8" strokeWidth="1" />
        <text x="340" y="195" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">PPi</text>

        {/* Arrow to next + O2 */}
        <line x1={cx} y1="220" x2={cx} y2="250" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#pathArrow)" />
        <text x={cx + 15} y="239" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Step 2</text>

        {/* O2 input */}
        <rect x="350" y="230" width="60" height="30" rx="6" className="fill-white dark:fill-slate-950" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="380" y="250" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">O₂</text>
        <line x1="350" y1="245" x2={cx + 40} y2="245" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 2" />

        {/* Step 3: Products */}
        <rect x="60" y="260" width="160" height="50" rx="8" className="fill-white dark:fill-slate-950" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="140" y="282" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="600">Oxyluciferin*</text>
        <text x="140" y="297" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">(excited state)</text>

        <text x="250" y="288" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="700">+</text>

        <text x="270" y="288" className="fill-gray-500 dark:fill-slate-400" fontSize="10">CO₂</text>

        <text x="320" y="288" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="700">→</text>

        {/* LIGHT output */}
        <g>
          <circle cx="410" cy="283" r="28" fill="#a3e635" opacity="0.06" />
          <circle cx="410" cy="283" r="18" fill="#a3e635" opacity="0.12" />
          <circle cx="410" cy="283" r="10" fill="#a3e635" opacity="0.3" />
          <text x="410" y="287" textAnchor="middle" fill="#a3e635" fontSize="13" fontWeight="700">LIGHT!</text>
          {/* Light rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={angle}
                x1={410 + Math.cos(rad) * 22}
                y1={283 + Math.sin(rad) * 22}
                x2={410 + Math.cos(rad) * 32}
                y2={283 + Math.sin(rad) * 32}
                stroke="#a3e635"
                strokeWidth="1"
                opacity="0.4"
              />
            );
          })}
        </g>

        {/* Wavelength note */}
        <text x="410" y="320" textAnchor="middle" fill="#4ade80" fontSize="8">λ = 510-670 nm</text>
        <text x="410" y="332" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">(yellow-green)</text>

        {/* Bottom summary */}
        <rect x="40" y="345" width="440" height="25" rx="5" className="fill-white dark:fill-slate-950" stroke="#4ade80" strokeWidth="1" />
        <text x={cx} y="362" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="600">Excited oxyluciferin releases a photon as it relaxes — that's the flash</text>

        <defs>
          <marker id="pathArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
