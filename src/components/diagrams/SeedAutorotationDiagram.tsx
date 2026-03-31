export default function SeedAutorotationDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Maple seed autorotation: how the wing creates lift and slows descent like a helicopter"
      >
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Maple Seed Autorotation: Nature{"\u2019"}s Helicopter
        </text>

        {/* Left panel: samara anatomy */}
        <g transform="translate(200, 80)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Samara Anatomy
          </text>

          {/* Large samara */}
          <g transform="translate(0, 80) rotate(-15)">
            {/* Wing */}
            <path
              d="M 0,0 Q 20,-10 80,-18 Q 110,-15 120,-5 Q 110,0 80,8 Q 20,10 0,0 Z"
              fill="#84cc16" opacity="0.6" stroke="#4d7c0f" strokeWidth="1.5"
            />
            {/* Wing veins */}
            <line x1="10" y1="0" x2="110" y2="-8" stroke="#4d7c0f" strokeWidth="1" />
            <line x1="30" y1="-2" x2="55" y2="-14" stroke="#4d7c0f" strokeWidth="0.6" />
            <line x1="50" y1="-2" x2="75" y2="-14" stroke="#4d7c0f" strokeWidth="0.6" />
            <line x1="70" y1="-3" x2="90" y2="-13" stroke="#4d7c0f" strokeWidth="0.6" />
          </g>

          {/* Seed (nut) */}
          <ellipse cx="-10" cy="78" rx="14" ry="10" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />

          {/* Labels */}
          <line x1="-10" y1="90" x2="-10" y2="120" stroke="#78350f" strokeWidth="1" />
          <text x="-10" y="135" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
            Heavy seed (center of mass)
          </text>
          <line x1="80" y1="55" x2="80" y2="35" stroke="#4d7c0f" strokeWidth="1" />
          <text x="80" y="28" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-700 dark:fill-green-300">
            Thin wing (high drag)
          </text>

          {/* Angle of attack label */}
          <g transform="translate(50, 90)">
            <path d="M 0,0 L 40,0" stroke="#6b7280" strokeWidth="1" strokeDasharray="3,2" />
            <path d="M 0,0 L 38,-10" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M 20,0 A 20,20 0 0,0 19,-5" fill="none" stroke="#ef4444" strokeWidth="1" />
            <text x="32" y="-2" fontSize="10" className="fill-red-500 dark:fill-red-400">{"\u03B1"}</text>
            <text x="50" y="15" fontSize="10" className="fill-gray-500 dark:fill-slate-400">angle of attack</text>
          </g>
        </g>

        {/* Right panel: forces during spin */}
        <g transform="translate(560, 80)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Forces During Spin
          </text>

          {/* Spinning samara silhouette */}
          <g transform="translate(0, 120)">
            {/* Rotation circle */}
            <circle cx="0" cy="0" r="65" fill="none" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="4,3" className="dark:stroke-slate-600" />

            {/* Wing at current position */}
            <path d="M 0,0 L 60,-15" stroke="#4d7c0f" strokeWidth="3" />
            <circle cx="0" cy="0" r="8" fill="#92400e" />

            {/* Ghost positions showing rotation */}
            <path d="M 0,0 L -50,-40" stroke="#4d7c0f" strokeWidth="2" opacity="0.15" />
            <path d="M 0,0 L -60,20" stroke="#4d7c0f" strokeWidth="2" opacity="0.1" />
            <path d="M 0,0 L 10,62" stroke="#4d7c0f" strokeWidth="2" opacity="0.08" />

            {/* Rotation arrow */}
            <path d="M 45,-50 A 65,65 0 0,1 65,10" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#rot-arr)" />
            <defs>
              <marker id="rot-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M 0,0 L 8,3 L 0,6 Z" fill="#f59e0b" />
              </marker>
            </defs>
            <text x="70" y="-25" fontSize="11" className="fill-amber-600 dark:fill-amber-400">spin</text>

            {/* Force arrows */}
            {/* Lift (up) */}
            <line x1="30" y1="-8" x2="30" y2="-55" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#lift-arr)" />
            <defs>
              <marker id="lift-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M 0,0 L 8,3 L 0,6 Z" fill="#3b82f6" />
              </marker>
            </defs>
            <text x="30" y="-62" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">Lift</text>

            {/* Drag (opposing motion) */}
            <line x1="40" y1="-5" x2="75" y2="10" stroke="#ef4444" strokeWidth="2" markerEnd="url(#drag-arr)" />
            <defs>
              <marker id="drag-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M 0,0 L 8,3 L 0,6 Z" fill="#ef4444" />
              </marker>
            </defs>
            <text x="90" y="15" fontSize="11" fontWeight="600" className="fill-red-500 dark:fill-red-400">Drag</text>

            {/* Gravity (down) */}
            <line x1="0" y1="10" x2="0" y2="55" stroke="#6b7280" strokeWidth="2.5" markerEnd="url(#grav-arr)" />
            <defs>
              <marker id="grav-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M 0,0 L 8,3 L 0,6 Z" fill="#6b7280" />
              </marker>
            </defs>
            <text x="0" y="72" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">Gravity</text>
          </g>
        </g>

        {/* Bottom comparison: helicopter vs samara */}
        <g transform="translate(390, 340)">
          <rect x="-340" y="0" width="680" height="120" rx="8" className="fill-lime-50 dark:fill-lime-950" opacity="0.5" />
          <text x="0" y="25" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-lime-700 dark:fill-lime-300">
            Helicopter vs. Maple Seed: Same Physics
          </text>

          {/* Helicopter side */}
          <g transform="translate(-150, 55)">
            <text x="0" y="-10" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Helicopter</text>
            <rect x="-20" y="5" width="40" height="15" rx="3" fill="#6b7280" />
            <line x1="-40" y1="5" x2="40" y2="5" stroke="#6b7280" strokeWidth="3" />
            <text x="0" y="40" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Engine spins rotor blade</text>
            <text x="0" y="54" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Blade angle creates lift</text>
          </g>

          <text x="0" y="55" textAnchor="middle" fontSize="24" className="fill-amber-500">=</text>

          {/* Samara side */}
          <g transform="translate(150, 55)">
            <text x="0" y="-10" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Maple Seed</text>
            <circle cx="0" cy="12" r="5" fill="#92400e" />
            <line x1="0" y1="12" x2="35" y2="5" stroke="#4d7c0f" strokeWidth="3" />
            <text x="0" y="40" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Gravity spins asymmetric seed</text>
            <text x="0" y="54" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Wing angle creates lift</text>
          </g>
        </g>

        <text x="390" y="500" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Autorotation: asymmetric mass causes the seed to spin, and the wing generates lift that slows descent
        </text>
      </svg>
    </div>
  );
}
