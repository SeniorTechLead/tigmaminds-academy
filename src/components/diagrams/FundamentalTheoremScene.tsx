/**
 * The Fundamental Theorem — derivative and integral are inverse operations.
 * Tara at a chalkboard with a circular diagram: f(x) → integrate → F(x) →
 * differentiate → f(x) again.
 *
 * Used in the Fundamental Theorem of Calculus section.
 */
import Tara from './people/Tara';

export default function FundamentalTheoremScene() {
  const W = 760, H = 380;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="The Fundamental Theorem of Calculus: differentiation and integration are inverse operations">

        <rect x="0" y="0" width={W} height={H} fill="#f0f9ff" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Two sides of the same coin
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Differentiate and integrate are opposites.
        </text>

        {/* Tara on far left */}
        <Tara x={90} y={350} scale={0.9} pose="pointing" />

        {/* Two boxes — f(x) and F(x) — connected by curved arrows */}
        <g transform="translate(280, 130)">
          {/* f(x) box */}
          <rect x="0" y="40" width="160" height="80" rx="10" fill="#dbeafe" stroke="#1e40af" strokeWidth="2" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
          <text x="80" y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e40af" className="dark:fill-blue-200">f(x)</text>
          <text x="80" y="94" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">a function</text>
          <text x="80" y="108" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#475569" className="dark:fill-gray-400">e.g. 2x</text>

          {/* F(x) box */}
          <rect x="280" y="40" width="160" height="80" rx="10" fill="#dcfce7" stroke="#15803d" strokeWidth="2" className="dark:fill-emerald-900/40 dark:stroke-emerald-400" />
          <text x="360" y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill="#15803d" className="dark:fill-emerald-200">F(x)</text>
          <text x="360" y="94" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">an antiderivative</text>
          <text x="360" y="108" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#475569" className="dark:fill-gray-400">e.g. x² + C</text>

          {/* Arrow: integrate (top) — from f to F */}
          <path d="M 160 60 Q 220 0 280 60" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#arInt-ftc)" />
          <defs>
            <marker id="arInt-ftc" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill="#dc2626" />
            </marker>
            <marker id="arDiff-ftc" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill="#f59e0b" />
            </marker>
          </defs>
          <rect x="190" y="-2" width="100" height="22" rx="11" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" className="dark:fill-red-900/40 dark:stroke-red-400" />
          <text x="240" y="13" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b91c1c" className="dark:fill-red-200">
            ∫ integrate
          </text>

          {/* Arrow: differentiate (bottom) — from F back to f */}
          <path d="M 280 100 Q 220 160 160 100" fill="none" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arDiff-ftc)" />
          <rect x="190" y="138" width="100" height="22" rx="11" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
          <text x="240" y="153" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
            d/dx differentiate
          </text>
        </g>

        {/* Theorem statement */}
        <rect x="240" y="290" width="430" height="44" rx="8"
          fill="white" stroke="#475569" strokeWidth="1.5" className="dark:fill-gray-800 dark:stroke-gray-500" />
        <text x="455" y="310" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          ∫ₐᵇ f(x) dx = F(b) − F(a)
        </text>
        <text x="455" y="326" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">
          where F is any antiderivative of f
        </text>

        {/* Footer */}
        <rect x={W / 2 - 240} y={H - 26} width="480" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Newton & Leibniz, independently, ~1670s. The bridge between two worlds.
        </text>
      </svg>
    </div>
  );
}
