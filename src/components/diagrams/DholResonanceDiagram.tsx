export default function DholResonanceDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 620 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="How the dhol drum body acts as a resonance chamber amplifying specific frequencies">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes resonate { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
          .reson { animation: resonate 2s ease-in-out infinite; }
        `}</style>
        <rect width="620" height="340" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-red-700 dark:fill-red-300">
          Resonance — How the Drum Body Amplifies Sound
        </text>

        {/* Dhol cross-section */}
        <text x="200" y="58" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Dhol cross-section (side view):</text>

        {/* Shell */}
        <rect x="100" y="80" width="200" height="120" rx="8" fill="#92400e" opacity="0.3" stroke="#78350f" strokeWidth="2" className="dark:fill-amber-900/20 dark:stroke-amber-700" />
        <text x="200" y="145" textAnchor="middle" className="small fill-amber-800 dark:fill-amber-400">Jackfruit wood shell</text>
        <text x="200" y="158" textAnchor="middle" className="small fill-amber-800 dark:fill-amber-400">(resonance chamber)</text>

        {/* Left membrane - bass head */}
        <rect x="90" y="80" width="10" height="120" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />
        <text x="70" y="100" textAnchor="end" className="small fill-amber-600 dark:fill-amber-400">Bass</text>
        <text x="70" y="112" textAnchor="end" className="small fill-amber-600 dark:fill-amber-400">head</text>

        {/* Right membrane - treble head */}
        <rect x="300" y="80" width="10" height="120" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <text x="330" y="100" className="small fill-amber-600 dark:fill-amber-400">Treble</text>
        <text x="330" y="112" className="small fill-amber-600 dark:fill-amber-400">head</text>

        {/* Sound waves inside */}
        {[0, 1, 2].map(i => (
          <path key={i} className="reson"
            d={`M ${115 + i * 30} ${100 + i * 5} Q ${130 + i * 30} ${90 + i * 5} ${145 + i * 30} ${100 + i * 5} Q ${160 + i * 30} ${110 + i * 5} ${175 + i * 30} ${100 + i * 5}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.2" opacity="0.6" />
        ))}

        {/* Sound waves emanating from both sides */}
        {[1, 2, 3].map(i => (
          <g key={i}>
            <path d={`M ${88 - i * 8} ${105} Q ${80 - i * 12} ${140} ${88 - i * 8} ${175}`}
              fill="none" stroke="#6366f1" strokeWidth="1.2" opacity={0.8 - i * 0.2} className="dark:stroke-indigo-400" />
            <path d={`M ${312 + i * 8} ${105} Q ${320 + i * 12} ${140} ${312 + i * 8} ${175}`}
              fill="none" stroke="#6366f1" strokeWidth="1.2" opacity={0.8 - i * 0.2} className="dark:stroke-indigo-400" />
          </g>
        ))}

        {/* How resonance works */}
        <g>
          <rect x="380" y="70" width="220" height="140" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
          <text x="490" y="90" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">How resonance works:</text>

          <text x="395" y="110" className="small fill-slate-600 dark:fill-slate-400">1. Membrane vibrates</text>
          <text x="395" y="128" className="small fill-slate-600 dark:fill-slate-400">2. Air inside shell vibrates too</text>
          <text x="395" y="146" className="small fill-slate-600 dark:fill-slate-400">3. Shell reflects sound back</text>
          <text x="395" y="164" className="small fill-slate-600 dark:fill-slate-400">4. Reflected waves reinforce</text>
          <text x="405" y="178" className="small fill-slate-600 dark:fill-slate-400">original vibration at certain</text>
          <text x="405" y="192" className="small fill-slate-600 dark:fill-slate-400">frequencies = LOUDER sound</text>
        </g>

        {/* Without vs with resonance chamber */}
        <rect x="40" y="225" width="260" height="50" rx="4" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" className="dark:fill-red-900/10" />
        <text x="170" y="243" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Without shell (open membrane)</text>
        <text x="170" y="260" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Weak, thin sound — energy radiates in all directions</text>

        <rect x="320" y="225" width="260" height="50" rx="4" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/10" />
        <text x="450" y="243" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">With shell (enclosed chamber)</text>
        <text x="450" y="260" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">LOUD, resonant boom — shell focuses and amplifies</text>

        {/* Key insight */}
        <rect x="40" y="285" width="540" height="42" rx="6" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" className="dark:fill-amber-900/15 dark:stroke-amber-700" />
        <text x="310" y="303" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">The story says "the dhol had its thunder" — the thunder is resonance.</text>
        <text x="310" y="318" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">The wooden shell is what turns a soft "thup" into a chest-shaking "DHOOM"</text>
      </svg>
    </div>
  );
}
