export default function AeroBernoulliDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 320" className="w-full max-w-xl mx-auto" role="img" aria-label="Bernoulli's principle: faster air creates lower pressure above a wing">
        <style>{`
          @keyframes aero-flow-fast {
            0% { stroke-dashoffset: 20; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes aero-flow-slow {
            0% { stroke-dashoffset: 24; }
            100% { stroke-dashoffset: 0; }
          }
          .aero-fast { animation: aero-flow-fast 0.8s linear infinite; stroke-dasharray: 10 10; }
          .aero-slow { animation: aero-flow-slow 1.6s linear infinite; stroke-dasharray: 12 12; }
        `}</style>

        {/* Title */}
        <text x="260" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Bernoulli&apos;s Principle — Why Wings Create Lift
        </text>

        {/* Wing cross-section (airfoil) */}
        <path d="M 120,160 Q 200,110 300,140 Q 360,150 400,160 Q 360,168 300,168 Q 210,172 120,160 Z"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-600 dark:stroke-slate-300" strokeWidth="2" />

        {/* Top airflow — fast, close together */}
        <path d="M 70,105 Q 180,70 310,110 L 450,100" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="aero-fast" />
        <path d="M 70,118 Q 190,88 320,122 L 450,115" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="aero-fast" />
        <path d="M 70,130 Q 200,102 330,133 L 450,128" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="aero-fast" />

        {/* Bottom airflow — slow, spread out */}
        <path d="M 70,175 Q 200,178 330,175 L 450,175" fill="none" stroke="#60a5fa" strokeWidth="1.5" className="aero-slow" />
        <path d="M 70,195 Q 200,200 330,197 L 450,195" fill="none" stroke="#60a5fa" strokeWidth="1.5" className="aero-slow" />
        <path d="M 70,215 Q 200,220 330,218 L 450,215" fill="none" stroke="#60a5fa" strokeWidth="1.5" className="aero-slow" />

        {/* Labels for top */}
        <rect x="430" y="85" width="80" height="38" rx="4" className="fill-blue-50 dark:fill-blue-900/40" stroke="#3b82f6" strokeWidth="1" />
        <text x="470" y="101" textAnchor="middle" className="fill-blue-700 dark:fill-blue-200" fontSize="10" fontWeight="bold">Faster air</text>
        <text x="470" y="115" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="10">Low pressure</text>

        {/* Labels for bottom */}
        <rect x="430" y="185" width="80" height="38" rx="4" className="fill-sky-50 dark:fill-sky-900/40" stroke="#60a5fa" strokeWidth="1" />
        <text x="470" y="201" textAnchor="middle" className="fill-sky-700 dark:fill-sky-200" fontSize="10" fontWeight="bold">Slower air</text>
        <text x="470" y="215" textAnchor="middle" className="fill-sky-600 dark:fill-sky-300" fontSize="10">High pressure</text>

        {/* Pressure arrows */}
        <text x="260" y="82" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="11">↓ low pressure</text>
        <text x="260" y="242" textAnchor="middle" className="fill-sky-600 dark:fill-sky-300" fontSize="11">↑ high pressure</text>

        {/* Net lift arrow */}
        <line x1="260" y1="240" x2="260" y2="70" className="stroke-green-500" strokeWidth="2.5" strokeDasharray="5 3" />
        <polygon points="254,72 260,55 266,72" className="fill-green-500" />
        <text x="230" y="58" className="fill-green-700 dark:fill-green-300" fontSize="11" fontWeight="bold">LIFT</text>

        {/* Explanation box */}
        <rect x="60" y="262" width="400" height="44" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="280" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="10" fontWeight="bold">
          The curved top forces air to travel farther and faster.
        </text>
        <text x="260" y="296" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          Faster air = lower pressure above the wing → net upward push = lift!
        </text>
      </svg>
    </div>
  );
}
