/**
 * Conditional probability: 1000 people tested for a rare disease (1% prevalence).
 * Test is 95% accurate. If you test positive, what's the chance you actually have
 * the disease? Counterintuitive answer.
 *
 * Used in the Conditional Probability section.
 */
import Tara from './people/Tara';

export default function MedicalTestConditionalScene() {
  const W = 760, H = 380;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A 95% accurate test for a rare disease: positive result still means low chance of disease — Bayes' theorem">

        <rect x="0" y="0" width={W} height={H} fill="#f0f9ff" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="370" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          A 95% accurate test gives a positive result. Are you sick?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          The answer depends on how rare the disease is.
        </text>

        {/* Tara on left looking puzzled */}
        <Tara x={80} y={340} scale={0.85} pose="thinking" />

        {/* Tree diagram */}
        {/* Root: 1000 people */}
        <rect x="200" y="84" width="120" height="40" rx="6"
          fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" className="dark:fill-blue-900/40 dark:stroke-blue-400" />
        <text x="260" y="100" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e40af" className="dark:fill-blue-200">1,000 people</text>
        <text x="260" y="116" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">tested</text>

        {/* Branches */}
        <line x1="260" y1="124" x2="170" y2="170" stroke="#0f172a" strokeWidth="1.2" />
        <line x1="260" y1="124" x2="370" y2="170" stroke="#0f172a" strokeWidth="1.2" />

        {/* 10 sick (1%) */}
        <rect x="100" y="170" width="120" height="40" rx="6"
          fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" className="dark:fill-red-900/40 dark:stroke-red-400" />
        <text x="160" y="188" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b91c1c" className="dark:fill-red-200">10 sick</text>
        <text x="160" y="202" textAnchor="middle" fontSize="9" fill="#475569" className="dark:fill-gray-400">(1% of 1000)</text>

        {/* 990 healthy */}
        <rect x="320" y="170" width="120" height="40" rx="6"
          fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-emerald-900/40 dark:stroke-emerald-400" />
        <text x="380" y="188" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d" className="dark:fill-emerald-200">990 healthy</text>
        <text x="380" y="202" textAnchor="middle" fontSize="9" fill="#475569" className="dark:fill-gray-400">(99% of 1000)</text>

        {/* Branch from sick → tested positive (95%) */}
        <line x1="160" y1="210" x2="160" y2="260" stroke="#dc2626" strokeWidth="1.2" />
        <rect x="100" y="260" width="120" height="40" rx="6"
          fill="white" stroke="#dc2626" strokeWidth="1.5" className="dark:fill-gray-800" />
        <text x="160" y="278" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">9–10 test +</text>
        <text x="160" y="293" textAnchor="middle" fontSize="9" fill="#475569" className="dark:fill-gray-400">95% × 10 ≈ 9.5</text>

        {/* Branch from healthy → false positive (5%) */}
        <line x1="380" y1="210" x2="380" y2="260" stroke="#16a34a" strokeWidth="1.2" />
        <rect x="320" y="260" width="120" height="40" rx="6"
          fill="white" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-gray-800" />
        <text x="380" y="278" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-emerald-300">~50 test +</text>
        <text x="380" y="293" textAnchor="middle" fontSize="9" fill="#475569" className="dark:fill-gray-400">5% × 990 = 49.5</text>

        {/* Punchline panel on right */}
        <rect x="500" y="84" width="240" height="220" rx="10"
          fill="white" stroke="#f59e0b" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-amber-400" />
        <text x="620" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          You tested positive.
        </text>
        <text x="620" y="124" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Are you actually sick?
        </text>
        <line x1="514" y1="134" x2="726" y2="134" stroke="#cbd5e1" strokeWidth="0.8" />
        <text x="620" y="160" textAnchor="middle" fontSize="11" fill="#1e293b" className="dark:fill-gray-100">
          Total positives: 9.5 + 49.5 = 59
        </text>
        <text x="620" y="180" textAnchor="middle" fontSize="11" fill="#1e293b" className="dark:fill-gray-100">
          Of those, sick: 9.5
        </text>
        <text x="620" y="208" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-300">
          P(sick | +) = 9.5 / 59
        </text>
        <text x="620" y="232" textAnchor="middle" fontSize="20" fontWeight="700" fill="#dc2626">
          ≈ 16%
        </text>
        <text x="620" y="258" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          84% chance you&apos;re HEALTHY
        </text>
        <text x="620" y="276" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          even after a positive test!
        </text>
        <text x="620" y="294" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#475569" className="dark:fill-gray-400">
          Why? Disease is rare.
        </text>

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Conditional probability: P(A | B) — what is A given that B happened?
        </text>
      </svg>
    </div>
  );
}
