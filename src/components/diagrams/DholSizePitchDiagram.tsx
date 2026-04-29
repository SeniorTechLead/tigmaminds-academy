export default function DholSizePitchDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 620 350" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="How drum size and membrane tension affect pitch with three drums of different sizes">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .formula { font-family: system-ui, sans-serif; font-size: 11px; font-style: italic; }
        `}</style>
        <rect width="620" height="350" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-red-700 dark:fill-red-300">
          How Drum Size Affects Pitch
        </text>

        {/* Three drums of different sizes */}
        {/* Small drum - high pitch */}
        <g>
          <text x="120" y="60" textAnchor="middle" className="label fill-blue-600 dark:fill-blue-400" fontWeight="600">Small Drum</text>
          <ellipse cx="120" cy="85" rx="35" ry="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" className="dark:fill-blue-900/20" />
          <rect x="85" y="85" width="70" height="50" rx="2" fill="#1e3a5f" opacity="0.4" stroke="#3b82f6" strokeWidth="1" />
          <ellipse cx="120" cy="135" rx="35" ry="10" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="120" y="160" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400" fontWeight="600">High pitch</text>
          <text x="120" y="175" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">D = 20 cm</text>
          {/* Sound wave - tight/high frequency */}
          <path d="M 165 90 Q 175 80 185 90 Q 195 100 205 90 Q 215 80 225 90 Q 235 100 245 90" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        </g>

        {/* Medium drum - medium pitch */}
        <g>
          <text x="310" y="55" textAnchor="middle" className="label fill-amber-600 dark:fill-amber-400" fontWeight="600">Medium Drum (Dhol)</text>
          <ellipse cx="310" cy="80" rx="50" ry="13" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" className="dark:fill-amber-900/20" />
          <rect x="260" y="80" width="100" height="65" rx="2" fill="#92400e" opacity="0.4" stroke="#d97706" strokeWidth="1" />
          <ellipse cx="310" cy="145" rx="50" ry="13" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="310" y="172" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400" fontWeight="600">Medium pitch</text>
          <text x="310" y="187" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">D = 35 cm</text>
        </g>

        {/* Large drum - low pitch */}
        <g>
          <text x="500" y="48" textAnchor="middle" className="label fill-red-600 dark:fill-red-400" fontWeight="600">Large Drum</text>
          <ellipse cx="500" cy="75" rx="65" ry="16" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" className="dark:fill-red-900/20" />
          <rect x="435" y="75" width="130" height="80" rx="2" fill="#7f1d1d" opacity="0.3" stroke="#ef4444" strokeWidth="1" />
          <ellipse cx="500" cy="155" rx="65" ry="16" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="500" y="185" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Low pitch</text>
          <text x="500" y="200" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">D = 50 cm</text>
          {/* Sound wave - wide/low frequency */}
          <path d="M 435 80 Q 455 60 475 80 Q 495 100 515 80 Q 535 60 555 80" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        </g>

        {/* Formula box */}
        <rect x="40" y="215" width="540" height="50" rx="6" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" className="dark:fill-amber-900/15 dark:stroke-amber-700" />
        <text x="310" y="235" textAnchor="middle" className="formula fill-amber-800 dark:fill-amber-300">
          f = (0.766 / D) × √(T / σ)
        </text>
        <text x="310" y="255" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">
          f = frequency, D = diameter, T = tension (force/length), σ = surface density (mass/area)
        </text>

        {/* Three factors */}
        <text x="310" y="285" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Three ways to change drum pitch:</text>

        {[
          { x: 60, label: 'Change Diameter', desc: 'Bigger drum = lower pitch\n(f inversely proportional to D)', color: '#3b82f6' },
          { x: 230, label: 'Change Tension', desc: 'Tighter head = higher pitch\n(f proportional to \u221AT)', color: '#d97706' },
          { x: 400, label: 'Change Mass', desc: 'Heavier membrane = lower\npitch (tabla syahi adds mass)', color: '#ef4444' },
        ].map((f, i) => (
          <g key={i}>
            <rect x={f.x} y={298} width={160} height={42} rx="4" fill={`${f.color}15`} stroke={f.color} strokeWidth="1" />
            <text x={f.x + 80} y={313} textAnchor="middle" className="small" fill={f.color} fontWeight="600">{f.label}</text>
            {f.desc.split('\n').map((line, j) => (
              <text key={j} x={f.x + 80} y={326 + j * 12} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">{line}</text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
