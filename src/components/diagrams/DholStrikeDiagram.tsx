export default function DholStrikeDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 620 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Physics of a drumstick strike showing impulse, force transfer, and membrane deformation">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes impact { 0%, 100% { transform: translateY(0); } 15% { transform: translateY(3px); } 30% { transform: translateY(-2px); } 50% { transform: translateY(1px); } }
          .impact { animation: impact 1.5s ease-out infinite; }
        `}</style>
        <rect width="620" height="340" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-red-700 dark:fill-red-300">
          Physics of a Drumstick Strike
        </text>

        {/* Phase 1: Contact */}
        <g>
          <text x="130" y="58" textAnchor="middle" className="label fill-amber-600 dark:fill-amber-400" fontWeight="600">1. Contact</text>
          {/* Drum membrane (side view) */}
          <line x1="50" y1="130" x2="210" y2="130" stroke="#d97706" strokeWidth="2" className="dark:stroke-amber-500" />
          {/* Stick hitting */}
          <line x1="130" y1="70" x2="130" y2="125" stroke="#78350f" strokeWidth="4" strokeLinecap="round" className="dark:stroke-amber-800" />
          <circle cx="130" cy="125" r="5" fill="#92400e" className="dark:fill-amber-700" />
          {/* Force arrow */}
          <line x1="150" y1="85" x2="150" y2="115" stroke="#ef4444" strokeWidth="2" markerEnd="url(#dhol-arr)" />
          <text x="175" y="100" className="small fill-red-500 dark:fill-red-400">Force (F)</text>
          <text x="130" y="155" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Stick transfers kinetic</text>
          <text x="130" y="168" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">energy to membrane</text>
        </g>

        {/* Phase 2: Deformation */}
        <g>
          <text x="330" y="58" textAnchor="middle" className="label fill-amber-600 dark:fill-amber-400" fontWeight="600">2. Deformation</text>
          {/* Membrane pushed down in the middle */}
          <path d="M 250 130 Q 290 130 330 145 Q 370 130 410 130" fill="none" stroke="#d97706" strokeWidth="2" className="dark:stroke-amber-500 impact" />
          {/* Stick bouncing back */}
          <line x1="330" y1="100" x2="330" y2="75" stroke="#78350f" strokeWidth="4" strokeLinecap="round" className="dark:stroke-amber-800" />
          <line x1="330" y1="75" x2="330" y2="60" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#dhol-arr-up)" />
          <text x="350" y="65" className="small fill-red-500 dark:fill-red-400">bounces</text>
          {/* Membrane depression */}
          <line x1="330" y1="130" x2="330" y2="145" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,2" />
          <text x="365" y="148" className="small fill-blue-500 dark:fill-blue-400">displacement</text>
          <text x="330" y="170" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Membrane stretches down,</text>
          <text x="330" y="183" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">tension pulls it back up</text>
        </g>

        {/* Phase 3: Vibration + Sound */}
        <g>
          <text x="530" y="58" textAnchor="middle" className="label fill-amber-600 dark:fill-amber-400" fontWeight="600">3. Sound Wave</text>
          {/* Membrane oscillating */}
          <path d="M 450 130 Q 470 125 490 130 Q 510 135 530 130 Q 550 125 570 130 Q 590 135 610 130"
            fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="4,2" className="dark:stroke-amber-500" />
          {/* Sound waves radiating up */}
          {[0, 1, 2].map(i => (
            <path key={i} d={`M ${505 - i * 15} ${110 - i * 15} Q ${530} ${100 - i * 18} ${555 + i * 15} ${110 - i * 15}`}
              fill="none" stroke="#6366f1" strokeWidth="1.2" opacity={1 - i * 0.25} className="dark:stroke-indigo-400" />
          ))}
          <text x="530" y="80" textAnchor="middle" className="small fill-indigo-600 dark:fill-indigo-400">sound waves</text>
          <text x="530" y="170" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Vibrating membrane</text>
          <text x="530" y="183" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">pushes air → sound</text>
        </g>

        {/* Impulse-momentum box */}
        <rect x="40" y="200" width="540" height="60" rx="6" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" className="dark:fill-amber-900/15 dark:stroke-amber-700" />
        <text x="310" y="218" textAnchor="middle" className="label fill-amber-700 dark:fill-amber-400" fontWeight="600">Impulse-Momentum Theorem</text>
        <text x="310" y="236" textAnchor="middle" className="small fill-slate-700 dark:fill-slate-300">Impulse = F × Δt = change in momentum of the membrane</text>
        <text x="310" y="252" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">A harder strike (more F) or longer contact (Δt) transfers more energy → louder sound</text>

        {/* Stick tip vs flat comparison */}
        <rect x="40" y="272" width="540" height="55" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="310" y="290" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Dhol playing technique</text>
        <text x="310" y="308" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Stick tip (small area) → high pressure → sharp attack, excites higher modes</text>
        <text x="310" y="323" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Open palm (large area) → low pressure → warm tone, excites fundamental mode</text>

        <defs>
          <marker id="dhol-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="dhol-arr-up" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#ef4444" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
