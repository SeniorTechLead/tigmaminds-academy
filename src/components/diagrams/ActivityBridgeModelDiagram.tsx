export default function ActivityBridgeModelDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 650 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: build a model bridge from string or rope to test tension and load distribution"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 9.5px; }
          .step { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
        `}</style>

        <rect width="650" height="420" rx="8" className="fill-slate-900" />

        <text x="325" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: Build a Suspension Bridge from String
        </text>

        {/* --- Step 1: Materials --- */}
        <text x="160" y="58" textAnchor="middle" className="step fill-blue-400">Step 1: Gather</text>

        {/* Books as supports */}
        <rect x="40" y="80" width="50" height="35" rx="3" fill="#4a5568" stroke="#718096" strokeWidth="1" />
        <text x="65" y="100" textAnchor="middle" className="small fill-slate-300">book</text>
        <rect x="130" y="80" width="50" height="35" rx="3" fill="#4a5568" stroke="#718096" strokeWidth="1" />
        <text x="155" y="100" textAnchor="middle" className="small fill-slate-300">book</text>

        {/* String */}
        <line x1="40" y1="130" x2="90" y2="130" stroke="#fbbf24" strokeWidth="2" />
        <line x1="95" y1="130" x2="145" y2="130" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2" />
        <text x="92" y="145" textAnchor="middle" className="small fill-amber-300">string or jute rope</text>

        {/* Coins */}
        {[180, 195, 210].map((x, i) => (
          <circle key={i} cx={x} cy={130} r="8" fill="#a78b00" opacity={0.8 - i * 0.15} stroke="#d4a000" strokeWidth="1" />
        ))}
        <text x="195" y="150" textAnchor="middle" className="small fill-amber-300">coins for loading</text>

        {/* Small card */}
        <rect x="240" y="75" width="45" height="30" rx="2" fill="#e2e8f0" opacity="0.3" stroke="#94a3b8" strokeWidth="1" />
        <text x="262" y="93" textAnchor="middle" className="small fill-slate-300">card</text>
        <text x="262" y="118" textAnchor="middle" className="small fill-slate-400">(deck surface)</text>

        {/* --- Step 2: Build single string --- */}
        <text x="160" y="185" textAnchor="middle" className="step fill-blue-400">Step 2: One String</text>

        {/* Two book stacks as piers */}
        <rect x="50" y="210" width="35" height="50" rx="3" fill="#4a5568" />
        <rect x="220" y="210" width="35" height="50" rx="3" fill="#4a5568" />

        {/* Single string with sag */}
        <path d="M 67 215 Q 152 240 237 215"
          fill="none" stroke="#fbbf24" strokeWidth="2" />

        {/* Card on string */}
        <rect x="135" y="230" width="35" height="4" rx="1" fill="#e2e8f0" opacity="0.4" />

        {/* Coin on card */}
        <circle cx="152" cy="226" r="5" fill="#a78b00" stroke="#d4a000" strokeWidth="0.8" />
        <text x="152" y="220" textAnchor="middle" className="small fill-red-400">sags a lot!</text>

        <text x="152" y="275" textAnchor="middle" className="small fill-slate-400">How many coins before it falls?</text>

        {/* --- Step 3: Build network --- */}
        <text x="480" y="58" textAnchor="middle" className="step fill-green-400">Step 3: Many Strings</text>

        {/* Two book stacks */}
        <rect x="370" y="80" width="35" height="50" rx="3" fill="#4a5568" />
        <rect x="555" y="80" width="35" height="50" rx="3" fill="#4a5568" />

        {/* Multiple strings - like root network */}
        <path d="M 387 85 Q 480 100 572 85" fill="none" stroke="#22c55e" strokeWidth="2" />
        <path d="M 387 90 Q 480 108 572 90" fill="none" stroke="#16a34a" strokeWidth="2" />
        <path d="M 387 95 Q 480 112 572 95" fill="none" stroke="#4ade80" strokeWidth="1.5" />

        {/* Cross-ties between strings */}
        {[420, 450, 480, 510, 540].map((x, i) => (
          <line key={i} x1={x} y1={88 + (i % 2) * 2} x2={x} y2={105 + (i % 2) * 3}
            stroke="#15803d" strokeWidth="1" opacity="0.5" />
        ))}

        {/* Card + more coins */}
        <rect x="462" y="98" width="35" height="4" rx="1" fill="#e2e8f0" opacity="0.4" />
        {[470, 480, 490].map((x, i) => (
          <circle key={i} cx={x} cy={93} r="5" fill="#a78b00" stroke="#d4a000" strokeWidth="0.8" />
        ))}
        <text x="480" y="83" textAnchor="middle" className="small fill-green-300">holds much more!</text>

        <text x="480" y="145" textAnchor="middle" className="small fill-slate-400">Count the coins — compare!</text>

        {/* --- Step 4: Compare --- */}
        <rect x="340" y="170" width="280" height="120" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <text x="480" y="190" textAnchor="middle" className="step fill-amber-300">Step 4: Record</text>

        {/* Table */}
        <line x1="360" y1="200" x2="600" y2="200" stroke="#475569" strokeWidth="0.8" />
        <text x="420" y="215" textAnchor="middle" className="small fill-slate-400">Design</text>
        <text x="520" y="215" textAnchor="middle" className="small fill-slate-400">Max Coins</text>
        <text x="580" y="215" textAnchor="middle" className="small fill-slate-400">Sag</text>
        <line x1="360" y1="220" x2="600" y2="220" stroke="#475569" strokeWidth="0.5" />

        <text x="420" y="238" textAnchor="middle" className="small fill-amber-300">1 string</text>
        <text x="520" y="238" textAnchor="middle" className="small fill-slate-300">___</text>
        <text x="580" y="238" textAnchor="middle" className="small fill-slate-300">___</text>

        <text x="420" y="256" textAnchor="middle" className="small fill-green-300">3 strings</text>
        <text x="520" y="256" textAnchor="middle" className="small fill-slate-300">___</text>
        <text x="580" y="256" textAnchor="middle" className="small fill-slate-300">___</text>

        <text x="420" y="274" textAnchor="middle" className="small fill-green-400">3 + cross-ties</text>
        <text x="520" y="274" textAnchor="middle" className="small fill-slate-300">___</text>
        <text x="580" y="274" textAnchor="middle" className="small fill-slate-300">___</text>

        {/* --- Bottom: The connection --- */}
        <rect x="30" y="310" width="590" height="95" rx="6" fill="#14532d" opacity="0.3" stroke="#22c55e" strokeWidth="1" />

        <text x="325" y="332" textAnchor="middle" className="label fill-green-300" fontWeight="600">
          What You Just Discovered
        </text>
        <text x="325" y="350" textAnchor="middle" className="small fill-slate-300">
          Multiple strings with cross-ties = stronger + less sag than a single thick rope
        </text>
        <text x="325" y="365" textAnchor="middle" className="small fill-slate-300">
          This is exactly how root bridges work: many intertwined roots sharing the load
        </text>
        <text x="325" y="383" textAnchor="middle" className="small fill-green-400">
          Engineers call this structural redundancy — if one member fails, others take over
        </text>
        <text x="325" y="398" textAnchor="middle" className="small fill-amber-300">
          The Khasi people discovered this principle centuries before modern engineering
        </text>
      </svg>
    </div>
  );
}
