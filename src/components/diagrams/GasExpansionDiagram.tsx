const GasExpansionDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Gas expansion diagram showing three stages: solid gunpowder, gas pressure buildup, and projectile expulsion"
      >
        <style>{`
          @keyframes pressurePulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .pressure-pulse { animation: pressurePulse 1.5s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small-text { font-family: system-ui, sans-serif; font-size: 9px; }
          .step-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="gas-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="gas-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="540" height="300" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Gas Expansion — Gunpowder in a Sealed Chamber
        </text>

        {/* === Panel 1: Solid gunpowder === */}
        <text x="95" y="52" textAnchor="middle" className="step-text fill-slate-600 dark:fill-slate-300">
          1. Before
        </text>

        {/* Chamber */}
        <rect x="40" y="70" width="110" height="70" rx="4"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />

        {/* Gunpowder granules */}
        <circle cx="70" cy="115" r="5" fill="#1e293b" />
        <circle cx="85" cy="120" r="4" fill="#1e293b" />
        <circle cx="95" cy="112" r="5" fill="#1e293b" />
        <circle cx="110" cy="118" r="4" fill="#1e293b" />
        <circle cx="80" cy="108" r="3" fill="#334155" />
        <circle cx="100" cy="125" r="3" fill="#334155" />

        <text x="95" y="100" textAnchor="middle" className="small-text fill-slate-700 dark:fill-slate-200">
          Solid powder
        </text>

        {/* Sealed label */}
        <text x="95" y="158" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400" style={{ fontStyle: 'italic' }}>
          Sealed chamber
        </text>
        <text x="95" y="170" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          Low pressure
        </text>

        {/* Arrow to panel 2 */}
        <text x="175" y="108" className="label-text fill-slate-400">→</text>
        <text x="170" y="125" className="small-text fill-red-500 dark:fill-red-400">
          ignite
        </text>

        {/* === Panel 2: Gas produced, pressure arrows === */}
        <text x="290" y="52" textAnchor="middle" className="step-text fill-slate-600 dark:fill-slate-300">
          2. Reaction
        </text>

        {/* Chamber */}
        <rect x="215" y="70" width="150" height="70" rx="4"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />

        {/* Gas cloud */}
        <ellipse cx="290" cy="105" rx="45" ry="25"
          fill="#fbbf24" opacity="0.3" className="pressure-pulse" />
        <text x="290" y="100" textAnchor="middle" className="small-text fill-amber-700 dark:fill-amber-300">
          Hot gas
        </text>
        <text x="290" y="112" textAnchor="middle" className="small-text fill-amber-700 dark:fill-amber-300">
          (CO₂, N₂, H₂O)
        </text>

        {/* Pressure arrows pushing outward */}
        <line x1="255" y1="105" x2="225" y2="105"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#gas-arrow)" />
        <line x1="325" y1="105" x2="355" y2="105"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#gas-arrow)" />
        <line x1="290" y1="85" x2="290" y2="72"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#gas-arrow)" />
        <line x1="290" y1="125" x2="290" y2="138"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#gas-arrow)" />

        <text x="290" y="158" textAnchor="middle"
          className="small-text fill-red-500 dark:fill-red-400" fontWeight="600">
          Pressure builds in all directions
        </text>
        <text x="290" y="170" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          ~3000× volume expansion
        </text>

        {/* Arrow to panel 3 */}
        <text x="380" y="108" className="label-text fill-slate-400">→</text>

        {/* === Panel 3: Tube with open end, projectile expelled === */}
        <text x="470" y="52" textAnchor="middle" className="step-text fill-slate-600 dark:fill-slate-300">
          3. Barrel
        </text>

        {/* Barrel (tube) */}
        <rect x="400" y="92" width="120" height="26" rx="2"
          className="fill-slate-400 dark:fill-slate-500 stroke-slate-600 dark:stroke-slate-400" strokeWidth="2" />

        {/* Closed back end */}
        <rect x="396" y="88" width="8" height="34" rx="1"
          className="fill-slate-600 dark:fill-slate-400" />

        {/* Gas in barrel */}
        <rect x="408" y="95" width="50" height="20" rx="2"
          fill="#fbbf24" opacity="0.25" />

        {/* Pressure arrow pushing projectile */}
        <line x1="458" y1="105" x2="490" y2="105"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#gas-arrow)" />

        {/* Projectile */}
        <circle cx="502" cy="105" r="8"
          className="fill-slate-700 dark:fill-slate-300 stroke-slate-800 dark:stroke-slate-200" strokeWidth="1.5" />

        {/* Open end marker */}
        <text x="525" y="108" className="small-text fill-slate-500 dark:fill-slate-400">
          →
        </text>

        {/* Labels */}
        <text x="430" y="85" className="small-text fill-amber-600 dark:fill-amber-400">
          Gas pushes
        </text>
        <text x="495" y="85" className="small-text fill-slate-600 dark:fill-slate-300">
          Projectile
        </text>

        <text x="470" y="140" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400" style={{ fontStyle: 'italic' }}>
          Open end directs force
        </text>
        <text x="470" y="152" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          one way → kinetic energy
        </text>

        {/* Bottom summary */}
        <rect x="40" y="190" width="460" height="50" rx="6"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="270" y="210" textAnchor="middle"
          className="label-text fill-slate-700 dark:fill-slate-200" fontWeight="600">
          Key insight: Rapid gas expansion in a confined space creates directed force
        </text>
        <text x="270" y="228" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          KNO₃ + C + S → CO₂ + N₂ + K₂S + heat | Gas volume expands ~3000× instantly
        </text>

        {/* Bottom note */}
        <text x="270" y="265" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400" style={{ fontStyle: 'italic' }}>
          Same principle: fireworks (open top), bombs (sealed), cannons (one open end)
        </text>
      </svg>
    </div>
  );
};

export default GasExpansionDiagram;
