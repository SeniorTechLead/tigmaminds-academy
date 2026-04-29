/**
 * Tara considers a lottery. ₹100 ticket. 1-in-1000 chance to win ₹50,000.
 * Expected value = 0.001 × 50,000 + 0.999 × 0 − 100 = 50 − 100 = −50.
 * On average, every ticket loses ₹50.
 *
 * Used in the Expected Value section.
 */
import Tara from './people/Tara';

export default function LotteryExpectedValueScene() {
  const W = 760, H = 380;
  const groundY = 320;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Should Tara buy a 100-rupee lottery ticket? Expected-value calculation says no.">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Should Tara buy this ticket?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Expected value: average outcome over many trials.
        </text>

        {/* Tara on left, with a thoughtful look */}
        <Tara x={100} y={groundY} scale={1.0} pose="thinking" />

        {/* Lottery ticket */}
        <g transform="translate(220, 130)">
          <rect x="0" y="0" width="180" height="100" rx="6" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
          {/* Edge serration */}
          <path d="M 0 0 L -8 8 L 0 16 L -8 24 L 0 32 L -8 40 L 0 48 L -8 56 L 0 64 L -8 72 L 0 80 L -8 88 L 0 96 L -8 100"
            fill="#fef3c7" stroke="#92400e" strokeWidth="1.5" />
          <text x="90" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e">
            🎫 LUCKY DRAW
          </text>
          <line x1="14" y1="30" x2="166" y2="30" stroke="#92400e" strokeWidth="0.8" />
          <text x="90" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#dc2626">
            Cost: ₹100
          </text>
          <text x="90" y="68" textAnchor="middle" fontSize="11" fill="#475569">
            Win: ₹50,000
          </text>
          <text x="90" y="86" textAnchor="middle" fontSize="11" fill="#475569">
            Odds: 1 in 1,000
          </text>
        </g>

        {/* Calculation panel on right */}
        <g transform="translate(440, 80)">
          <rect x="0" y="0" width="290" height="220" rx="10"
            fill="white" stroke="#475569" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-500" />
          <text x="145" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
            Expected Value
          </text>
          <line x1="14" y1="32" x2="276" y2="32" stroke="#cbd5e1" strokeWidth="0.8" />
          {/* Win row */}
          <text x="14" y="56" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-emerald-300">If WIN (1/1000):</text>
          <text x="276" y="56" textAnchor="end" fontSize="11" fontWeight="600" fill="#1e293b" className="dark:fill-gray-100">₹50,000 − 100 = +₹49,900</text>
          {/* Lose row */}
          <text x="14" y="80" fontSize="11" fontWeight="700" fill="#dc2626" className="dark:fill-red-300">If LOSE (999/1000):</text>
          <text x="276" y="80" textAnchor="end" fontSize="11" fontWeight="600" fill="#1e293b" className="dark:fill-gray-100">−₹100</text>
          <line x1="14" y1="92" x2="276" y2="92" stroke="#cbd5e1" strokeWidth="0.6" />
          {/* EV calc */}
          <text x="14" y="114" fontSize="11" fill="#475569" className="dark:fill-gray-300">EV =</text>
          <text x="276" y="114" textAnchor="end" fontSize="11" fontWeight="600" fill="#1e293b" className="dark:fill-gray-100">(1/1000)(49,900)</text>
          <text x="276" y="132" textAnchor="end" fontSize="11" fontWeight="600" fill="#1e293b" className="dark:fill-gray-100">+ (999/1000)(−100)</text>
          <line x1="14" y1="142" x2="276" y2="142" stroke="#cbd5e1" strokeWidth="0.6" />
          <text x="14" y="160" fontSize="11" fill="#475569" className="dark:fill-gray-300">= 49.9 − 99.9</text>
          <line x1="14" y1="172" x2="276" y2="172" stroke="#475569" strokeWidth="1" />
          <text x="145" y="194" textAnchor="middle" fontSize="16" fontWeight="700" fill="#dc2626">
            EV = −₹50
          </text>
          <text x="145" y="212" textAnchor="middle" fontSize="10" fill="#475569" fontStyle="italic" className="dark:fill-gray-400">
            Average loss per ticket.
          </text>
        </g>

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Expected value = sum of (outcome × probability) over all outcomes.
        </text>
      </svg>
    </div>
  );
}
