export default function WoodpeckerResonanceDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Natural frequency of skull bone vs impact frequency showing why they do not resonate"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        <rect width="600" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Why the Skull Doesn't Resonate
        </text>

        {/* Frequency response graph */}
        <g transform="translate(70, 55)">
          <line x1="0" y1="0" x2="0" y2="220" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
          <line x1="0" y1="220" x2="460" y2="220" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

          <text x="-40" y="110" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" transform="rotate(-90,-40,110)">
            Amplitude (vibration)
          </text>
          <text x="230" y="248" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">
            Frequency (Hz)
          </text>

          {/* X axis labels */}
          {[0, 100, 500, 1000, 2000, 5000, 10000].map((f, i) => (
            <g key={i}>
              <line x1={i * 65 + 5} y1="220" x2={i * 65 + 5} y2="225" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
              <text x={i * 65 + 5} y="238" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">
                {f >= 1000 ? `${f / 1000}k` : f}
              </text>
            </g>
          ))}

          {/* Natural frequency resonance curve (skull bone ~3000-6000 Hz) */}
          <path
            d="M5,218 C50,216 100,215 150,210 C200,200 250,180 290,100 C310,50 330,20 350,50 C370,100 390,180 410,210 C430,215 450,218 460,218"
            fill="#a78bfa" opacity="0.15" stroke="#a78bfa" strokeWidth="2.5"
          />
          {/* Peak label */}
          <line x1="330" y1="20" x2="380" y2="10" stroke="#c4b5fd" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="385" y="8" className="val" fill="#c4b5fd">Natural frequency</text>
          <text x="385" y="22" className="sm fill-gray-500 dark:fill-slate-400">~4000 Hz (skull bone)</text>

          {/* Drumming frequency zone (20 Hz) - far left */}
          <rect x="5" y="0" width="20" height="220" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 3" />
          <text x="15" y="-5" textAnchor="middle" className="val" fill="#86efac">20 Hz</text>
          <text x="15" y="8" textAnchor="middle" className="sm" fill="#86efac">drumming</text>

          {/* Gap annotation */}
          <line x1="30" y1="210" x2="310" y2="210" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x="170" y="200" textAnchor="middle" className="val" fill="#fbbf24">200x frequency gap</text>

          {/* Danger zone (if they overlapped) */}
          <text x="330" y="80" textAnchor="middle" className="sm" fill="#fca5a5">If drumming = natural freq</text>
          <text x="330" y="93" textAnchor="middle" className="sm" fill="#ef4444">RESONANCE = skull failure</text>
        </g>

        {/* Wine glass analogy */}
        <g transform="translate(40, 310)">
          <rect x="0" y="0" width="520" height="75" rx="8" className="fill-gray-100 dark:fill-slate-800" />

          <text x="260" y="18" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">
            Analogy: Opera Singer Shattering a Glass
          </text>

          {/* Glass icon */}
          <g transform="translate(40, 25)">
            <path d="M10,0 Q15,20 25,25 L25,40 L15,40 L15,25 Q5,20 10,0" fill="none" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="8" y1="40" x2="32" y2="40" stroke="#ef4444" strokeWidth="1.5" />
            {/* Shatter lines */}
            <line x1="25" y1="10" x2="35" y2="5" stroke="#ef4444" strokeWidth="1" />
            <line x1="26" y1="15" x2="38" y2="15" stroke="#ef4444" strokeWidth="1" />
            <text x="20" y="-5" textAnchor="middle" className="sm" fill="#fca5a5">Resonance!</text>
          </g>

          <text x="280" y="40" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            A glass shatters when sound matches its natural frequency. The woodpecker's
          </text>
          <text x="280" y="54" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            skull is designed so that its natural frequency is nowhere near the drumming frequency.
          </text>
          <text x="280" y="68" textAnchor="middle" className="sm" fill="#86efac">
            No resonance = no amplified vibrations = safe
          </text>
        </g>
      </svg>
    </div>
  );
}
