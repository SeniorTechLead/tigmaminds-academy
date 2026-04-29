export default function WoodpeckerCapstoneProjectDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Full capstone pipeline: measure impact, model skull, design protection, test prototype"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .step { font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; }
        `}</style>

        <rect width="630" height="460" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="315" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Capstone Project Pipeline
        </text>
        <text x="315" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
          From observation to prototype: the engineering design process
        </text>

        {/* Step 1: Measure */}
        <g transform="translate(20, 60)">
          <rect x="0" y="0" width="140" height="155" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#ef4444" strokeWidth="2" />
          <circle cx="70" cy="25" r="16" fill="#ef4444" opacity="0.2" />
          <text x="70" y="31" textAnchor="middle" className="step" fill="#ef4444">1</text>
          <text x="70" y="52" textAnchor="middle" className="label" fill="#fca5a5" fontWeight="600">MEASURE</text>

          {/* Accelerometer icon */}
          <rect x="45" y="62" width="50" height="30" rx="4" className="fill-white dark:fill-slate-950" stroke="#ef4444" strokeWidth="1" />
          <text x="70" y="80" textAnchor="middle" className="sm" fill="#fca5a5">ACC</text>
          {/* Wave */}
          <path d="M30,105 Q45,95 50,105 Q55,115 65,105 Q75,95 80,105 Q85,115 100,105" fill="none" stroke="#ef4444" strokeWidth="1.5" />

          <text x="70" y="130" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Record g-forces</text>
          <text x="70" y="143" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">and rotations</text>
        </g>

        {/* Arrow 1-2 */}
        <g transform="translate(160, 125)">
          <line x1="0" y1="0" x2="20" y2="0" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" markerEnd="url(#wpc-arr)" />
        </g>

        {/* Step 2: Model */}
        <g transform="translate(175, 60)">
          <rect x="0" y="0" width="140" height="155" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="70" cy="25" r="16" fill="#f59e0b" opacity="0.2" />
          <text x="70" y="31" textAnchor="middle" className="step" fill="#f59e0b">2</text>
          <text x="70" y="52" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">MODEL</text>

          {/* Skull model icon */}
          <ellipse cx="70" cy="82" rx="30" ry="25" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          {/* FEA mesh */}
          {[0, 1, 2].map(i => (
            <ellipse key={i} cx="70" cy="82" rx={30 - i * 10} ry={25 - i * 8} fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.4" />
          ))}
          {[0, 1, 2, 3].map(i => {
            const a = (i * Math.PI) / 2;
            return <line key={i} x1="70" y1="82" x2={70 + Math.cos(a) * 30} y2={82 + Math.sin(a) * 25} stroke="#f59e0b" strokeWidth="0.5" opacity="0.4" />;
          })}

          <text x="70" y="120" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">FEA simulation</text>
          <text x="70" y="133" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">of skull stress</text>
          <text x="70" y="146" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">distribution</text>
        </g>

        {/* Arrow 2-3 */}
        <g transform="translate(315, 125)">
          <line x1="0" y1="0" x2="20" y2="0" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" markerEnd="url(#wpc-arr)" />
        </g>

        {/* Step 3: Design */}
        <g transform="translate(330, 60)">
          <rect x="0" y="0" width="140" height="155" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="2" />
          <circle cx="70" cy="25" r="16" fill="#22c55e" opacity="0.2" />
          <text x="70" y="31" textAnchor="middle" className="step" fill="#22c55e">3</text>
          <text x="70" y="52" textAnchor="middle" className="label" fill="#86efac" fontWeight="600">DESIGN</text>

          {/* Layered helmet icon */}
          <path d="M35,100 Q70,60 105,100" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <path d="M40,97 Q70,65 100,97" fill="none" stroke="#22c55e" strokeWidth="4" opacity="0.4" strokeDasharray="3 2" />
          <path d="M45,94 Q70,70 95,94" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />

          <text x="70" y="120" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Multi-layer</text>
          <text x="70" y="133" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">protection</text>
          <text x="70" y="146" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">with lattice core</text>
        </g>

        {/* Arrow 3-4 */}
        <g transform="translate(470, 125)">
          <line x1="0" y1="0" x2="20" y2="0" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" markerEnd="url(#wpc-arr)" />
        </g>

        {/* Step 4: Test */}
        <g transform="translate(485, 60)">
          <rect x="0" y="0" width="130" height="155" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="65" cy="25" r="16" fill="#38bdf8" opacity="0.2" />
          <text x="65" y="31" textAnchor="middle" className="step" fill="#38bdf8">4</text>
          <text x="65" y="52" textAnchor="middle" className="label" fill="#7dd3fc" fontWeight="600">TEST</text>

          {/* Drop test icon */}
          <rect x="55" y="62" width="20" height="8" rx="2" fill="#475569" />
          <line x1="65" y1="70" x2="65" y2="95" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M50,95 Q65,80 80,95" fill="none" stroke="#38bdf8" strokeWidth="2" />
          <rect x="45" y="95" width="40" height="8" rx="2" className="fill-gray-400 dark:fill-slate-500" />

          <text x="65" y="120" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Drop test +</text>
          <text x="65" y="133" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">sensor data</text>
          <text x="65" y="146" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">vs CPSC limits</text>
        </g>

        <defs>
          <marker id="wpc-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#475569" />
          </marker>
        </defs>

        {/* Iteration loop */}
        <path d="M550,225 C570,245 570,270 530,275 L170,275 C130,275 130,250 150,235"
          fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6 3" markerEnd="url(#wpc-arr-y)" />
        <text x="350" y="268" textAnchor="middle" className="label" fill="#fbbf24">Iterate and improve</text>

        <defs>
          <marker id="wpc-arr-y" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Skills summary */}
        <g transform="translate(20, 295)">
          <rect x="0" y="0" width="590" height="145" rx="10" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <text x="295" y="22" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">
            Skills You'll Use in This Capstone
          </text>

          {[
            { skill: 'Physics', items: 'F=ma, impulse, energy', color: '#ef4444', icon: 'N' },
            { skill: 'Materials', items: 'Stress-strain, fatigue', color: '#f59e0b', icon: 'S' },
            { skill: 'CAD/FEA', items: '3D model, simulation', color: '#22c55e', icon: '3D' },
            { skill: 'Electronics', items: 'Accelerometer, BLE', color: '#38bdf8', icon: 'V' },
            { skill: 'Data Science', items: 'g-force analysis', color: '#a78bfa', icon: 'D' },
          ].map((s, i) => (
            <g key={i} transform={`translate(${i * 116 + 10}, 35)`}>
              <circle cx="50" cy="20" r="14" fill={s.color} opacity="0.15" stroke={s.color} strokeWidth="1" />
              <text x="50" y="25" textAnchor="middle" className="label" fill={s.color} fontWeight="600">{s.icon}</text>
              <text x="50" y="50" textAnchor="middle" className="sm fill-gray-900 dark:fill-slate-50">{s.skill}</text>
              <text x="50" y="65" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">{s.items}</text>
            </g>
          ))}

          <text x="295" y="130" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">
            This project combines biology, physics, engineering, and coding into one build
          </text>
        </g>
      </svg>
    </div>
  );
}
