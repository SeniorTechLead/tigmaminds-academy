export default function PigmentAbsorptionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how pigments absorb certain wavelengths and reflect others, creating the color you see"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          How Pigments Create Color
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Pigments absorb some wavelengths and reflect the rest {'\u2014'} you see what bounces back
        </text>

        {/* White light coming in */}
        <text x="100" y="100" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          White light (all colors)
        </text>
        {/* Rainbow arrow */}
        {[
          { y: 115, color: '#ef4444' },
          { y: 120, color: '#f97316' },
          { y: 125, color: '#eab308' },
          { y: 130, color: '#22c55e' },
          { y: 135, color: '#3b82f6' },
          { y: 140, color: '#8b5cf6' },
        ].map((ray, i) => (
          <line key={i} x1="100" y1={ray.y} x2="250" y2={200 + i * 5} stroke={ray.color} strokeWidth="2.5" opacity="0.8" />
        ))}

        {/* Yellow pigment blob */}
        <ellipse cx="300" cy="220" rx="60" ry="40" fill="#eab308" fillOpacity="0.6" stroke="#ca8a04" strokeWidth="2" />
        <text x="300" y="215" textAnchor="middle" fontSize="11" fontWeight="700" fill="#854d0e">Yellow</text>
        <text x="300" y="230" textAnchor="middle" fontSize="10" fill="#854d0e">pigment</text>

        {/* Absorbed rays (X marks) */}
        <line x1="335" y1="200" x2="400" y2="170" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" />
        <text x="410" y="170" fontSize="16" fill="#8b5cf6" opacity="0.5">{'\u2716'}</text>
        <text x="432" y="170" fontSize="10" className="fill-gray-400 dark:fill-slate-500">Violet absorbed</text>
        <line x1="340" y1="210" x2="400" y2="195" stroke="#3b82f6" strokeWidth="2" opacity="0.4" />
        <text x="410" y="195" fontSize="16" fill="#3b82f6" opacity="0.5">{'\u2716'}</text>
        <text x="432" y="195" fontSize="10" className="fill-gray-400 dark:fill-slate-500">Blue absorbed</text>

        {/* Reflected rays */}
        <line x1="300" y1="178" x2="300" y2="110" stroke="#ef4444" strokeWidth="3" opacity="0.8" />
        <line x1="280" y1="182" x2="230" y2="115" stroke="#f97316" strokeWidth="3" opacity="0.8" />
        <line x1="320" y1="182" x2="370" y2="115" stroke="#eab308" strokeWidth="3" opacity="0.8" />
        <line x1="340" y1="190" x2="420" y2="130" stroke="#22c55e" strokeWidth="3" opacity="0.8" />

        {/* Eye seeing yellow */}
        <text x="300" y="100" textAnchor="middle" fontSize="22">{'\uD83D\uDC41\uFE0F'}</text>
        <text x="300" y="85" textAnchor="middle" fontSize="11" fontWeight="600" fill="#eab308">
          You see: yellow!
        </text>

        {/* Separation line */}
        <line x1="30" y1="290" x2="750" y2="290" stroke="#64748b" strokeWidth="0.5" strokeDasharray="6 3" />

        {/* Subtractive mixing example */}
        <text x="390" y="315" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Why Yellow Paint + Blue Paint = Green
        </text>

        {/* Yellow pigment */}
        <circle cx="180" cy="380" r="50" fill="#eab308" fillOpacity="0.4" />
        <text x="180" y="375" textAnchor="middle" fontSize="11" fontWeight="600" fill="#854d0e">Yellow</text>
        <text x="180" y="392" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">absorbs blue</text>
        <text x="180" y="406" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">reflects R, G, Y</text>

        {/* Plus */}
        <text x="280" y="385" textAnchor="middle" fontSize="24" fontWeight="700" className="fill-gray-400 dark:fill-slate-500">+</text>

        {/* Blue pigment */}
        <circle cx="380" cy="380" r="50" fill="#3b82f6" fillOpacity="0.4" />
        <text x="380" y="375" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1d4ed8">Blue</text>
        <text x="380" y="392" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">absorbs red</text>
        <text x="380" y="406" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">reflects G, B</text>

        {/* Equals */}
        <text x="480" y="385" textAnchor="middle" fontSize="24" fontWeight="700" className="fill-gray-400 dark:fill-slate-500">=</text>

        {/* Green result */}
        <circle cx="580" cy="380" r="50" fill="#22c55e" fillOpacity="0.5" />
        <text x="580" y="375" textAnchor="middle" fontSize="11" fontWeight="700" fill="#166534">Green!</text>
        <text x="580" y="392" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">only green</text>
        <text x="580" y="406" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">survives both</text>

        {/* Bottom note */}
        <text x="390" y="448" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          This is subtractive mixing {'\u2014'} each pigment removes wavelengths. Only what survives ALL filters reaches your eye.
        </text>
      </svg>
    </div>
  );
}
