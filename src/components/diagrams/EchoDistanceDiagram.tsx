export default function EchoDistanceDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 620 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="How to calculate distance from echo timing using the speed of sound formula">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .formula { font-family: system-ui, sans-serif; font-size: 13px; font-style: italic; }
          @keyframes wave { 0% { opacity: 0.8; transform: translateX(0); } 100% { opacity: 0; transform: translateX(30px); } }
        `}</style>
        <rect width="620" height="340" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-purple-700 dark:fill-purple-300">
          Calculating Distance from an Echo
        </text>

        {/* Scene: person and cliff */}
        {/* Person */}
        <circle cx="80" cy="105" r="10" fill="#fbbf24" />
        <line x1="80" y1="115" x2="80" y2="145" stroke="#fbbf24" strokeWidth="2" />
        <line x1="80" y1="125" x2="65" y2="135" stroke="#fbbf24" strokeWidth="2" />
        <line x1="80" y1="125" x2="95" y2="135" stroke="#fbbf24" strokeWidth="2" />
        <line x1="80" y1="145" x2="70" y2="165" stroke="#fbbf24" strokeWidth="2" />
        <line x1="80" y1="145" x2="90" y2="165" stroke="#fbbf24" strokeWidth="2" />
        <text x="80" y="182" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">You shout!</text>

        {/* Cliff */}
        <rect x="490" y="70" width="30" height="120" rx="2" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" className="dark:fill-slate-600" />
        <rect x="500" y="60" width="40" height="130" rx="2" fill="#a1a1aa" stroke="#71717a" strokeWidth="1" className="dark:fill-slate-500" />
        <rect x="515" y="65" width="35" height="125" rx="2" fill="#b4b4b4" stroke="#8b8b8b" strokeWidth="1" className="dark:fill-slate-500/80" />
        <text x="525" y="55" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Cliff</text>

        {/* Outgoing sound */}
        <line x1="100" y1="110" x2="480" y2="110" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#echo-arr)" />
        <text x="290" y="102" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-400">Sound travels to cliff</text>

        {/* Returning echo */}
        <line x1="480" y1="130" x2="100" y2="130" stroke="#ec4899" strokeWidth="1.5" markerEnd="url(#echo-arr-back)" strokeDasharray="6,3" />
        <text x="290" y="148" textAnchor="middle" className="small fill-pink-600 dark:fill-pink-400">Echo returns</text>

        {/* Distance label */}
        <line x1="80" y1="168" x2="510" y2="168" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3" />
        <text x="290" y="165" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300">d = distance to cliff</text>

        {/* Formula section */}
        <rect x="40" y="195" width="540" height="85" rx="6" fill="#faf5ff" stroke="#c084fc" strokeWidth="1" className="dark:fill-purple-900/15 dark:stroke-purple-700" />
        <text x="310" y="215" textAnchor="middle" className="label fill-purple-700 dark:fill-purple-300" fontWeight="600">The Echo Distance Formula</text>
        <text x="310" y="238" textAnchor="middle" className="formula fill-purple-800 dark:fill-purple-200">
          d = (v × t) / 2
        </text>
        <text x="310" y="260" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">d = distance (m), v = speed of sound (343 m/s at 20°C), t = echo return time (s)</text>
        <text x="310" y="275" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Divide by 2 because sound travels THERE and BACK</text>

        {/* Worked example */}
        <rect x="40" y="290" width="540" height="40" rx="6" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/10 dark:stroke-emerald-800" />
        <text x="50" y="308" className="small fill-emerald-700 dark:fill-emerald-400" fontWeight="600">Example:</text>
        <text x="120" y="308" className="small fill-slate-600 dark:fill-slate-400">You clap and hear the echo 1.2 seconds later.</text>
        <text x="50" y="323" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">d = (343 × 1.2) / 2 = 205.8 m</text>
        <text x="310" y="323" className="small fill-slate-500 dark:fill-slate-400">— the cliff is about 206 metres away.</text>

        <defs>
          <marker id="echo-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
          </marker>
          <marker id="echo-arr-back" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 10 0 L 0 5 L 10 10 z" fill="#ec4899" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
