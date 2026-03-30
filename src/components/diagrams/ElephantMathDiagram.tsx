export default function ElephantMathDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 520 450"
        className="w-full"
        role="img"
        aria-label="Math with variables: frequency times duration equals total vibrations, illustrated with elephant foot vibrations"
      >
        {/* Background */}
        <rect x="0" y="0" width="520" height="450" rx="12" className="fill-slate-900" />

        {/* ══════════ ELEPHANT FOOT ICON (left side) ══════════ */}
        <g transform="translate(28, 50)">
          {/* Foot shape */}
          <ellipse cx="0" cy="0" rx="14" ry="10" className="fill-gray-500" />
          <ellipse cx="-6" cy="-8" rx="4" ry="3" className="fill-gray-400" />
          <ellipse cx="0" cy="-9" rx="4" ry="3" className="fill-gray-400" />
          <ellipse cx="6" cy="-8" rx="4" ry="3" className="fill-gray-400" />

          {/* Ground vibration lines emanating outward */}
          <path d="M -20,14 Q -28,18 -36,14" fill="none" className="stroke-green-400" strokeWidth="1.5" opacity="0.9" />
          <path d="M -24,20 Q -34,25 -44,20" fill="none" className="stroke-green-400" strokeWidth="1.2" opacity="0.6" />
          <path d="M -26,26 Q -38,32 -50,26" fill="none" className="stroke-green-400" strokeWidth="1" opacity="0.35" />
          <path d="M 20,14 Q 28,18 36,14" fill="none" className="stroke-green-400" strokeWidth="1.5" opacity="0.9" />
          <path d="M 24,20 Q 34,25 44,20" fill="none" className="stroke-green-400" strokeWidth="1.2" opacity="0.6" />
          <path d="M 26,26 Q 38,32 50,26" fill="none" className="stroke-green-400" strokeWidth="1" opacity="0.35" />
        </g>

        {/* ══════════ TOP ROW — Visual equation ══════════ */}

        {/* — "80 vibrations" with sine wave bumps — */}
        <g transform="translate(80, 38)">
          {/* Label */}
          <text x="50" y="0" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">
            80 vibrations
          </text>

          {/* 4 small sine wave bumps */}
          <path
            d="M 10,18 Q 20,8 30,18 Q 40,28 50,18 Q 60,8 70,18 Q 80,28 90,18"
            fill="none"
            className="stroke-green-400"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* "×20 more" annotation */}
          <text x="50" y="44" textAnchor="middle" fontSize="10" fill="#9ca3af" fontStyle="italic">
            (showing 4 bumps — imagine ×20 more)
          </text>

          {/* "per second" bracket */}
          <line x1="5" y1="52" x2="95" y2="52" stroke="#6b7280" strokeWidth="1" />
          <line x1="5" y1="49" x2="5" y2="55" stroke="#6b7280" strokeWidth="1" />
          <line x1="95" y1="49" x2="95" y2="55" stroke="#6b7280" strokeWidth="1" />
          <text x="50" y="66" textAnchor="middle" fontSize="10" fill="#9ca3af">
            per second
          </text>
        </g>

        {/* Multiplication sign */}
        <text x="205" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="white">
          ×
        </text>

        {/* — "60 seconds" with timeline bar — */}
        <g transform="translate(230, 38)">
          <text x="55" y="0" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">
            60 seconds
          </text>

          {/* Timeline bar */}
          <rect x="10" y="10" width="90" height="10" rx="4" className="fill-slate-700" />
          <rect x="10" y="10" width="90" height="10" rx="4" className="fill-blue-500" opacity="0.5" />

          {/* Tick marks */}
          {[0, 15, 30, 45, 60].map((sec, i) => (
            <g key={i}>
              <line
                x1={10 + (sec / 60) * 90}
                y1="22"
                x2={10 + (sec / 60) * 90}
                y2="28"
                stroke="#9ca3af"
                strokeWidth="1"
              />
              <text
                x={10 + (sec / 60) * 90}
                y="38"
                textAnchor="middle"
                fontSize="10"
                fill="#9ca3af"
              >
                {sec}s
              </text>
            </g>
          ))}

          {/* "1 minute" label */}
          <text x="55" y="52" textAnchor="middle" fontSize="10" fill="#9ca3af">
            1 minute
          </text>
        </g>

        {/* Equals sign */}
        <text x="360" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="white">
          =
        </text>

        {/* — Result: "4,800 total" — */}
        <g transform="translate(390, 38)">
          <text x="45" y="5" textAnchor="middle" fontSize="20" fontWeight="800" className="fill-amber-400">
            4,800
          </text>
          <text x="45" y="24" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-300">
            total vibrations
          </text>
        </g>

        {/* ══════════ DIVIDER ══════════ */}
        <line x1="30" y1="118" x2="490" y2="118" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />

        {/* ══════════ SECTION 2 — Variable equation ══════════ */}

        {/* Section label */}
        <text x="260" y="148" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
          Now write it as a formula:
        </text>

        {/* Variable equation row */}
        <g transform="translate(0, 168)">
          {/* frequency */}
          <rect x="65" y="0" width="110" height="34" rx="6" className="fill-green-900/50" stroke="#22c55e" strokeWidth="1.5" />
          <text x="120" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-green-400">
            frequency
          </text>

          {/* × */}
          <text x="195" y="24" textAnchor="middle" fontSize="16" fontWeight="700" fill="white">×</text>

          {/* duration */}
          <rect x="215" y="0" width="100" height="34" rx="6" className="fill-blue-900/50" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="265" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-400">
            duration
          </text>

          {/* = */}
          <text x="335" y="24" textAnchor="middle" fontSize="16" fontWeight="700" fill="white">=</text>

          {/* total */}
          <rect x="355" y="0" width="100" height="34" rx="6" className="fill-amber-900/50" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="405" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-400">
            total
          </text>
        </g>

        {/* Numeric values below the variables */}
        <g transform="translate(0, 216)">
          <text x="120" y="0" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-green-300">
            80
          </text>
          <text x="195" y="0" textAnchor="middle" fontSize="16" fontWeight="700" fill="white">×</text>
          <text x="265" y="0" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-blue-300">
            60
          </text>
          <text x="335" y="0" textAnchor="middle" fontSize="16" fontWeight="700" fill="white">=</text>
          <text x="405" y="0" textAnchor="middle" fontSize="18" fontWeight="800" className="fill-amber-400">
            4,800
          </text>
        </g>

        {/* ══════════ DIVIDER ══════════ */}
        <line x1="30" y1="244" x2="490" y2="244" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />

        {/* ══════════ SECTION 3 — "Change the variable" insight ══════════ */}

        {/* Annotation box */}
        <rect x="50" y="264" width="420" height="140" rx="10" className="fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Arrow icon */}
        <defs>
          <marker id="arrowAmber" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" className="fill-amber-400" />
          </marker>
        </defs>

        {/* "What if…" heading */}
        <text x="260" y="292" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-400">
          What if the elephant stomps faster?
        </text>

        {/* Old vs new */}
        <g transform="translate(80, 308)">
          {/* Old frequency crossed out */}
          <text x="0" y="14" fontSize="13" fill="#6b7280" textDecoration="line-through">
            frequency = 80
          </text>

          {/* Arrow */}
          <line x1="155" y1="10" x2="195" y2="10" className="stroke-amber-400" strokeWidth="2" markerEnd="url(#arrowAmber)" />

          {/* New frequency */}
          <text x="210" y="14" fontSize="13" fontWeight="700" className="fill-green-400">
            frequency = 110
          </text>
        </g>

        {/* New calculation */}
        <g transform="translate(80, 336)">
          <text x="0" y="14" fontSize="13" fontWeight="600" className="fill-blue-300">
            110 × 60
          </text>
          <text x="80" y="14" fontSize="13" fontWeight="600" fill="white">
            =
          </text>
          <text x="110" y="14" fontSize="15" fontWeight="800" className="fill-amber-400">
            6,600 vibrations!
          </text>
        </g>

        {/* Key takeaway */}
        <text x="260" y="384" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-300">
          Change the variable, plug it in — the formula stays the same.
        </text>

        {/* Bottom decorative ground line with vibration arcs */}
        <g transform="translate(260, 420)">
          <line x1="-130" y1="0" x2="130" y2="0" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
          <path d="M -40,-4 Q -30,-10 -20,-4" fill="none" className="stroke-green-500" strokeWidth="1" opacity="0.5" />
          <path d="M -10,-4 Q 0,-10 10,-4" fill="none" className="stroke-green-500" strokeWidth="1" opacity="0.5" />
          <path d="M 20,-4 Q 30,-10 40,-4" fill="none" className="stroke-green-500" strokeWidth="1" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
