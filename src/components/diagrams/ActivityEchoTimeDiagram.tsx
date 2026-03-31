export default function ActivityEchoTimeDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Offline activity to measure echo time and calculate the speed of sound using a wall">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="280" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="25" textAnchor="middle" className="title fill-purple-700 dark:fill-purple-300">
          Activity: Measure the Speed of Sound
        </text>

        {/* Setup scene */}
        {/* Person */}
        <circle cx="100" cy="75" r="10" fill="#fbbf24" />
        <line x1="100" y1="85" x2="100" y2="110" stroke="#fbbf24" strokeWidth="2" />
        <text x="100" y="128" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400">You</text>

        {/* Distance arrow */}
        <line x1="120" y1="140" x2="460" y2="140" stroke="#8b5cf6" strokeWidth="1.5" />
        <line x1="120" y1="135" x2="120" y2="145" stroke="#8b5cf6" strokeWidth="1.5" />
        <line x1="460" y1="135" x2="460" y2="145" stroke="#8b5cf6" strokeWidth="1.5" />
        <text x="290" y="138" textAnchor="middle" className="label fill-purple-600 dark:fill-purple-400" fontWeight="600">50 metres (measure with steps or tape)</text>

        {/* Wall */}
        <rect x="465" y="55" width="20" height="100" rx="2" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" className="dark:fill-slate-600" />
        <rect x="485" y="50" width="25" height="110" rx="2" fill="#a1a1aa" stroke="#71717a" strokeWidth="1" className="dark:fill-slate-500" />
        <text x="505" y="95" className="small fill-slate-600 dark:fill-slate-400">Large</text>
        <text x="505" y="107" className="small fill-slate-600 dark:fill-slate-400">wall</text>

        {/* Sound path */}
        <path d="M 110 80 L 460 80" fill="none" stroke="#8b5cf6" strokeWidth="1" />
        <text x="290" y="75" textAnchor="middle" className="small fill-purple-500 dark:fill-purple-400">CLAP!</text>
        <path d="M 460 90 L 110 90" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="4,2" />
        <text x="290" y="104" textAnchor="middle" className="small fill-pink-500 dark:fill-pink-400">echo returns</text>

        {/* Method steps */}
        <rect x="30" y="160" width="560" height="110" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="50" y="180" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Method:</text>
        <text x="50" y="198" className="small fill-slate-600 dark:fill-slate-400">1. Stand 50 m from a large flat wall (school building works well)</text>
        <text x="50" y="214" className="small fill-slate-600 dark:fill-slate-400">2. Clap sharply. Adjust your timing to clap in sync with the echo (clap\u2014echo\u2014clap\u2014echo)</text>
        <text x="50" y="230" className="small fill-slate-600 dark:fill-slate-400">3. Have a friend time 20 clap-echo cycles. Divide total time by 20 = time per echo</text>
        <text x="50" y="246" className="small fill-slate-600 dark:fill-slate-400">4. Speed = (2 \u00D7 50 m) / echo time. Compare to 343 m/s!</text>
        <text x="50" y="264" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Timing 20 cycles and dividing reduces error — this is how real scientists improve accuracy</text>
      </svg>
    </div>
  );
}
