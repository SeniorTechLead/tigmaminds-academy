export default function StarMagnitudeFormulaDiagram() {
  return (
    <svg viewBox="0 0 546 333" className="w-full max-w-2xl mx-auto my-4" role="img" aria-label="Magnitude formula m1 minus m2 equals negative 2.5 log base 10 of flux ratio">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">The Magnitude Formula</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Relating brightness to magnitude mathematically</text>

      {/* Formula box */}
      <rect x="80" y="60" width="360" height="50" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#fbbf24" strokeWidth="1.5" />
      <text x="260" y="82" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="16" fontWeight="700" fontFamily="serif">
        m₁ - m₂ = -2.5 log₁₀(F₁/F₂)
      </text>
      <text x="260" y="100" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">m = magnitude, F = flux (brightness received)</text>

      {/* Worked example */}
      <rect x="50" y="125" width="420" height="130" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="145" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">Worked Example</text>

      {/* Star A */}
      <circle cx="130" cy="175" r="8" fill="#fef3c7" />
      <circle cx="130" cy="175" r="12" fill="#fef3c7" opacity={0.15} />
      <text x="130" y="195" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">Star A</text>
      <text x="130" y="207" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Flux = 100 units</text>

      {/* Star B */}
      <circle cx="370" cy="175" r="4" fill="#93c5fd" />
      <circle cx="370" cy="175" r="8" fill="#93c5fd" opacity={0.1} />
      <text x="370" y="195" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">Star B</text>
      <text x="370" y="207" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Flux = 1 unit</text>

      {/* Calculation */}
      <text x="250" y="163" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Star A is 100× brighter than Star B</text>

      <text x="250" y="225" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10">
        m_A - m_B = -2.5 × log₁₀(100/1) = -2.5 × 2 = <tspan fill="#fbbf24" fontWeight="700">-5</tspan>
      </text>
      <text x="250" y="245" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Star A is 5 magnitudes brighter (lower number)</text>

      {/* Key insight */}
      <rect x="80" y="265" width="360" height="28" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="283" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">5 magnitudes = exactly 100× brightness (by design!)</text>
    </svg>
  );
}
