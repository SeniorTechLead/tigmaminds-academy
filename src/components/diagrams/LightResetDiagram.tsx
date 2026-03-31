export default function LightResetDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 440" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="How light resets the circadian clock through the eye to the SCN, like pressing a reset button each morning">
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">Light: The Reset Button for Your Internal Clock</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Morning light travels from your eyes to your brain clock and says: "It's a new day!"</text>

        {/* Sun */}
        <g transform="translate(80, 180)">
          <circle r="40" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
            const rad = (a * Math.PI) / 180;
            return <line key={a} x1={Math.cos(rad) * 45} y1={Math.sin(rad) * 45} x2={Math.cos(rad) * 58} y2={Math.sin(rad) * 58} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />;
          })}
          <text x="0" y="5" textAnchor="middle" fontSize="24">☀️</text>
          <text x="0" y="65" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">Blue light</text>
          <text x="0" y="80" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(~480 nm)</text>
        </g>

        {/* Light beam arrow */}
        <line x1="130" y1="180" x2="230" y2="180" stroke="#fbbf24" strokeWidth="3" strokeDasharray="6,3" />
        <polygon points="230,174 244,180 230,186" fill="#fbbf24" />

        {/* Eye */}
        <g transform="translate(290, 180)">
          <ellipse rx="40" ry="25" fill="#fff" stroke="#64748b" strokeWidth="2" className="dark:fill-slate-800" />
          <circle r="15" fill="#3b82f6" />
          <circle r="7" fill="#1e293b" />
          <circle cx="-3" cy="-3" r="2" fill="#fff" />
          <text x="0" y="40" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Eye</text>
          <text x="0" y="55" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Special cells detect</text>
          <text x="0" y="68" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">blue light (ipRGCs)</text>
        </g>

        {/* Nerve pathway */}
        <path d="M 335 180 Q 390 175 440 170 Q 480 166 520 180" fill="none" stroke="#8b5cf6" strokeWidth="3" />
        <text x="430" y="160" textAnchor="middle" fontSize="10" fontWeight="600" fill="#8b5cf6">Retinohypothalamic tract</text>
        <text x="430" y="145" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(nerve highway to brain clock)</text>

        {/* SCN */}
        <g transform="translate(570, 180)">
          <circle r="35" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" className="dark:fill-amber-950/30" />
          <text x="0" y="-5" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">SCN</text>
          <text x="0" y="12" textAnchor="middle" fontSize="10" fill="#92400e">Master Clock</text>
          <text x="0" y="50" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f59e0b">Resets to "morning"</text>
        </g>

        {/* Outputs from SCN */}
        {[
          { label: 'Stop melatonin', sub: '(wake up!)', y: 100, color: '#8b5cf6' },
          { label: 'Raise cortisol', sub: '(energy boost)', y: 260, color: '#22c55e' },
          { label: 'Set body temp', sub: '(warming up)', y: 330, color: '#ef4444' },
        ].map((out, i) => (
          <g key={i}>
            <line x1="605" y1="180" x2="680" y2={out.y} stroke={out.color} strokeWidth="1.5" strokeDasharray="4,2" />
            <rect x="680" y={out.y - 18} width="85" height="36" rx="4" fill={out.color} opacity="0.1" stroke={out.color} strokeWidth="1" />
            <text x="722" y={out.y - 2} textAnchor="middle" fontSize="10" fontWeight="600" fill={out.color}>{out.label}</text>
            <text x="722" y={out.y + 12} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{out.sub}</text>
          </g>
        ))}

        {/* Jet lag explanation */}
        <rect x="60" y="360" width="660" height="60" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="382" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Why jet lag happens</text>
        <text x="390" y="400" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          Fly to a new time zone → your clock says "2 AM" but local sun says "10 AM"
        </text>
        <text x="390" y="415" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          It takes 1 day per hour of time difference for morning light to fully reset your SCN
        </text>
      </svg>
    </div>
  );
}
