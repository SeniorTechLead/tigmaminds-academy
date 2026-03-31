export default function WhiskerSensorDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Tiger whisker anatomy showing the hair shaft, follicle, and mechanoreceptors at the base">
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">Whiskers as Sensors: How a Tiger Feels the World</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">A whisker is not just hair — it is a precision instrument with 200+ nerve endings</text>

        {/* Skin surface */}
        <rect x="200" y="200" width="380" height="8" rx="4" fill="#d4a574" opacity="0.5" />
        <text x="160" y="207" textAnchor="end" fontSize="11" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">Skin surface</text>

        {/* Whisker shaft above skin */}
        <line x1="390" y1="200" x2="590" y2="90" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
        <text x="510" y="130" fontSize="11" fontWeight="600" fill="#78350f">Whisker (vibrissa)</text>
        <text x="510" y="146" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Made of keratin — not alive</text>
        <text x="510" y="160" fontSize="10" className="fill-gray-500 dark:fill-slate-400">but acts as a lever</text>

        {/* Arrow showing deflection */}
        <path d="M 580 95 Q 600 80 610 95" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#deflect-arr)" />
        <text x="630" y="85" fontSize="10" fontWeight="600" fill="#ef4444">Touch!</text>
        <defs>
          <marker id="deflect-arr" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5" fill="#ef4444" />
          </marker>
        </defs>

        {/* Follicle below skin */}
        <g transform="translate(350, 210)">
          {/* Follicle capsule */}
          <ellipse cx="40" cy="80" rx="50" ry="80" fill="#fde68a" opacity="0.2" stroke="#f59e0b" strokeWidth="2" />

          {/* Hair root */}
          <line x1="40" y1="0" x2="40" y2="120" stroke="#78350f" strokeWidth="3" />

          {/* Blood sinus */}
          <ellipse cx="40" cy="60" rx="35" ry="25" fill="#fca5a5" opacity="0.2" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,2" />
          <text x="40" y="64" textAnchor="middle" fontSize="10" fill="#ef4444">Blood sinus</text>

          {/* Nerve endings - dots around base */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const cx = 40 + Math.cos(angle) * 40;
            const cy = 100 + Math.sin(angle) * 20;
            return <circle key={i} cx={cx} cy={cy} r="3" fill="#8b5cf6" opacity="0.7" />;
          })}
          <text x="40" y="140" textAnchor="middle" fontSize="10" fontWeight="600" fill="#8b5cf6">Mechanoreceptors (200+)</text>
        </g>

        {/* Nerve pathway */}
        <path d="M 390 360 L 390 390 Q 390 400 370 400 L 200 400 Q 180 400 180 410 L 180 440" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="5,3" />
        <text x="180" y="460" textAnchor="middle" fontSize="11" fontWeight="600" fill="#8b5cf6">→ To brain</text>

        {/* Signal explanation */}
        <rect x="40" y="80" width="140" height="100" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="110" y="100" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">How it works:</text>
        <text x="110" y="118" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">1. Something touches</text>
        <text x="110" y="132" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">    the whisker tip</text>
        <text x="110" y="148" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">2. Lever amplifies force</text>
        <text x="110" y="164" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">3. Receptors fire signals</text>

        {/* Comparison boxes */}
        <rect x="40" y="400" width="160" height="55" rx="6" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" strokeWidth="1" />
        <text x="120" y="420" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">Tiger whisker base</text>
        <text x="120" y="438" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f59e0b">~200 nerve endings</text>

        <rect x="580" y="400" width="160" height="55" rx="6" fill="#64748b" opacity="0.1" stroke="#64748b" strokeWidth="1" />
        <text x="660" y="420" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">Human hair follicle</text>
        <text x="660" y="438" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-gray-500 dark:fill-slate-400">~20 nerve endings</text>

        <text x="390" y="435" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f59e0b">10× more sensitive!</text>
      </svg>
    </div>
  );
}
