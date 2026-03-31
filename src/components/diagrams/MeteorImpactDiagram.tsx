export default function MeteorImpactDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 620"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Meteorite impact crater formation showing kinetic energy, shockwave, and excavation stages"
      >
        <defs>
          <linearGradient id="mi-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <radialGradient id="mi-shock" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mi-ejecta" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#92400e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="780" height="620" rx="10" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-amber-300">
          Impact! How Craters Form
        </text>

        {/* --- Stage 1: Contact & Compression --- */}
        <g transform="translate(0, 60)">
          <text x="130" y="20" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">
            Stage 1: Contact
          </text>

          {/* Ground */}
          <rect x="30" y="100" width="200" height="80" fill="url(#mi-ground)" />
          <rect x="30" y="95" width="200" height="8" rx="2" fill="#92400e" />

          {/* Meteorite approaching */}
          <circle cx="130" cy="65" r="12" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
          <line x1="130" y1="40" x2="130" y2="53" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Speed label */}
          <text x="130" y="42" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">20 km/s</text>

          {/* Shockwave at contact */}
          <ellipse cx="130" cy="95" rx="30" ry="15" fill="url(#mi-shock)" />

          {/* Labels */}
          <text x="130" y="196" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            Meteorite hits at 15\u201370 km/s.
          </text>
          <text x="130" y="210" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            Shockwave compresses rock to
          </text>
          <text x="130" y="224" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            millions of atmospheres of pressure.
          </text>
        </g>

        {/* --- Stage 2: Excavation --- */}
        <g transform="translate(270, 60)">
          <text x="130" y="20" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">
            Stage 2: Excavation
          </text>

          {/* Ground with crater forming */}
          <rect x="30" y="100" width="200" height="80" fill="url(#mi-ground)" />
          <rect x="30" y="95" width="200" height="8" rx="2" fill="#92400e" />

          {/* Crater bowl */}
          <path d="M 80 95 Q 90 140 130 150 Q 170 140 180 95" fill="#1c1917" stroke="#92400e" strokeWidth="1" />

          {/* Ejecta flying out */}
          {[[85,75,65,45],[100,70,80,35],[160,70,180,35],[175,75,195,45],[130,60,130,25]].map(([x1,y1,x2,y2], i) => (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a16207" strokeWidth="1.5" opacity="0.6" />
              <circle cx={x2} cy={y2} r={3} fill="#78350f" stroke="#92400e" strokeWidth="0.5" />
            </g>
          ))}

          {/* Expanding shockwave arcs */}
          <path d="M 70 95 Q 130 50 190 95" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

          <text x="130" y="196" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            Shockwave blasts rock outward,
          </text>
          <text x="130" y="210" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            creating a cavity. Ejecta is
          </text>
          <text x="130" y="224" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            thrown tens of km from the site.
          </text>
        </g>

        {/* --- Stage 3: Final Crater --- */}
        <g transform="translate(540, 60)">
          <text x="130" y="20" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-orange-600 dark:fill-orange-400">
            Stage 3: Final Crater
          </text>

          {/* Ground */}
          <rect x="30" y="100" width="200" height="80" fill="url(#mi-ground)" />

          {/* Raised rim */}
          <path d="M 60 100 Q 65 88 80 90 Q 130 130 180 90 Q 195 88 200 100" fill="#92400e" stroke="#a16207" strokeWidth="1" />

          {/* Crater bowl */}
          <path d="M 80 95 Q 100 140 130 145 Q 160 140 180 95" fill="#1c1917" stroke="#78350f" strokeWidth="1" />

          {/* Central peak */}
          <path d="M 120 145 L 130 125 L 140 145" fill="#78350f" stroke="#92400e" strokeWidth="0.8" />

          {/* Labels */}
          <line x1="90" y1="90" x2="70" y2="70" stroke="#a16207" strokeWidth="0.8" />
          <text x="70" y="66" textAnchor="middle" fontSize="10" className="fill-amber-700 dark:fill-amber-400">Raised rim</text>

          <line x1="130" y1="125" x2="155" y2="110" stroke="#a16207" strokeWidth="0.8" />
          <text x="175" y="108" textAnchor="middle" fontSize="10" className="fill-amber-700 dark:fill-amber-400">Central peak</text>

          <text x="130" y="196" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            Crater is 10\u201320\u00D7 wider than
          </text>
          <text x="130" y="210" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            the meteorite. Rim rises from
          </text>
          <text x="130" y="224" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            compressed, folded rock layers.
          </text>
        </g>

        {/* Kinetic energy formula */}
        <rect x="40" y="350" width="700" height="60" rx="8" className="fill-blue-50 dark:fill-blue-950/40" stroke="#3b82f6" strokeWidth="1" />
        <text x="390" y="372" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">
          Why impacts are so powerful: KE = \u00BD \u00D7 m \u00D7 v\u00B2
        </text>
        <text x="390" y="392" textAnchor="middle" fontSize="11" className="fill-blue-600 dark:fill-blue-400">
          A 10 m rock at 20 km/s carries energy equivalent to ~3 atomic bombs. Speed matters far more than size (v\u00B2).
        </text>
        <text x="390" y="404" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-500">
          Double the speed \u2192 4\u00D7 the energy. Double the mass \u2192 only 2\u00D7 the energy.
        </text>

        {/* Famous craters comparison */}
        <text x="390" y="440" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-300">
          Famous Impact Craters
        </text>

        {/* Barringer */}
        <g transform="translate(130, 460)">
          <circle cx="0" cy="30" r="25" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <text x="0" y="34" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">1.2 km</text>
          <text x="0" y="72" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Barringer, USA</text>
          <text x="0" y="86" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">50,000 yrs ago</text>
          <text x="0" y="100" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">30 m iron meteorite</text>
        </g>

        {/* Lonar */}
        <g transform="translate(350, 460)">
          <circle cx="0" cy="30" r="32" fill="none" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="34" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">1.8 km</text>
          <text x="0" y="72" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Lonar, India</text>
          <text x="0" y="86" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">50,000 yrs ago</text>
          <text x="0" y="100" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Now a salt-water lake</text>
        </g>

        {/* Chicxulub */}
        <g transform="translate(590, 460)">
          <circle cx="0" cy="30" r="45" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
          <text x="0" y="28" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">180 km</text>
          <text x="0" y="40" textAnchor="middle" fontSize="9" className="fill-red-500 dark:fill-red-400">(not to scale!)</text>
          <text x="0" y="92" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Chicxulub, Mexico</text>
          <text x="0" y="106" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">66 million yrs ago</text>
          <text x="0" y="120" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">Ended the dinosaurs</text>
        </g>
      </svg>
    </div>
  );
}
