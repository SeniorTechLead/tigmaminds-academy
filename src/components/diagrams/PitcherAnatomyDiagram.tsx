export default function PitcherAnatomyDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 480" className="w-full max-w-lg mx-auto" role="img" aria-label="Cross-section diagram of a pitcher plant showing peristome, waxy zone, digestive fluid, and trapping mechanism">
        <rect width="560" height="480" rx="12" className="fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#86efac">The Perfect Trap: Pitcher Anatomy</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-slate-400">Cross-section of a Nepenthes pitcher</text>

        {/* Main pitcher shape - cross section */}
        <g transform="translate(220, 60)">
          {/* Lid (operculum) */}
          <ellipse cx="60" cy="10" rx="70" ry="20" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
          <text x="60" y="14" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">Lid (Operculum)</text>

          {/* Tendril connecting to vine */}
          <path d="M 60,-5 Q 60,-30 40,-50 Q 20,-70 -10,-60" stroke="#22c55e" strokeWidth="3" fill="none" />
          <text x="-30" y="-55" fontSize="8" fill="#86efac">Tendril to vine</text>

          {/* Pitcher outer wall */}
          <path d="M -10,25 Q -30,80 -35,150 Q -38,220 -30,280 Q -20,330 60,340 Q 140,330 150,280 Q 158,220 155,150 Q 150,80 130,25" fill="#166534" stroke="#22c55e" strokeWidth="2" />

          {/* Inner wall - showing zones */}
          <path d="M 0,30 Q -18,80 -22,150 Q -25,220 -18,275 Q -10,320 60,328 Q 130,320 138,275 Q 145,220 142,150 Q 138,80 120,30" fill="#1e3a29" />

          {/* Zone 1: Peristome (slippery rim) */}
          <path d="M -10,25 Q 10,35 60,38 Q 110,35 130,25 Q 120,30 60,33 Q 0,30 -10,25" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" />
          {/* Microscopic ridges on peristome */}
          {Array.from({length: 12}, (_, i) => (
            <line key={i} x1={5 + i * 10} y1={28 + Math.sin(i) * 2} x2={5 + i * 10} y2={33 + Math.sin(i) * 2} stroke="#fca5a5" strokeWidth="0.8" />
          ))}

          {/* Zone 2: Waxy zone */}
          <rect x="-18" y="50" width="156" height="80" rx="4" fill="#854d0e" opacity="0.3" />
          {/* Wax crystal symbols */}
          {[{x: 10, y: 65}, {x: 40, y: 80}, {x: 70, y: 70}, {x: 100, y: 85}, {x: 30, y: 100}, {x: 80, y: 105}, {x: 110, y: 68}].map((p, i) => (
            <g key={i}>
              <polygon points={`${p.x},${p.y - 3} ${p.x + 3},${p.y} ${p.x},${p.y + 3} ${p.x - 3},${p.y}`} fill="#fbbf24" opacity="0.5" />
            </g>
          ))}

          {/* Zone 3: Glandular zone */}
          <rect x="-20" y="140" width="160" height="60" rx="4" fill="#4c1d95" opacity="0.2" />
          {/* Gland dots */}
          {Array.from({length: 8}, (_, i) => (
            <circle key={i} cx={5 + i * 16} cy={160 + (i % 2) * 15} r="2.5" fill="#a78bfa" opacity="0.5" />
          ))}

          {/* Zone 4: Digestive fluid pool */}
          <path d="M -15,220 Q 10,215 60,218 Q 110,215 135,220 Q 145,260 138,300 Q 130,330 60,335 Q -10,330 -18,300 Q -22,260 -15,220" fill="#365314" opacity="0.5" />
          {/* Fluid surface wave */}
          <path d="M -15,220 Q 10,215 60,218 Q 110,215 135,220" fill="none" stroke="#84cc16" strokeWidth="1.5" />

          {/* Trapped insect in fluid */}
          <g transform="translate(55, 260)">
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#44403c" />
            <line x1="-8" y1="-2" x2="-14" y2="-6" stroke="#57534e" strokeWidth="1" />
            <line x1="8" y1="-2" x2="14" y2="-6" stroke="#57534e" strokeWidth="1" />
            <line x1="-5" y1="3" x2="-10" y2="8" stroke="#57534e" strokeWidth="1" />
            <line x1="5" y1="3" x2="10" y2="8" stroke="#57534e" strokeWidth="1" />
          </g>

          {/* Downward-pointing hairs */}
          {[10, 30, 50, 70, 90, 110].map((xp, i) => (
            <line key={i} x1={xp} y1={135 + (i % 2) * 5} x2={xp - 3} y2={145 + (i % 2) * 5} stroke="#a78bfa" strokeWidth="1" />
          ))}
        </g>

        {/* Labels with leader lines */}
        {/* Peristome */}
        <line x1="280" y1="88" x2="420" y2="75" stroke="#f87171" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <g transform="translate(425, 65)">
          <text x="0" y="0" fontSize="10" fontWeight="bold" fill="#f87171">Peristome (Slippery Rim)</text>
          <text x="0" y="14" fontSize="8" className="fill-slate-400">Microscopic ridges + nectar film</text>
          <text x="0" y="26" fontSize="8" className="fill-slate-400">= aquaplaning effect for insects</text>
        </g>

        {/* Waxy zone */}
        <line x1="200" y1="135" x2="55" y2="135" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <g transform="translate(10, 120)">
          <text x="0" y="0" fontSize="10" fontWeight="bold" fill="#fbbf24">Waxy Zone</text>
          <text x="0" y="14" fontSize="8" className="fill-slate-400">Loose wax crystals (~1 \u00b5m)</text>
          <text x="0" y="26" fontSize="8" className="fill-slate-400">clog insect foot-pads</text>
        </g>

        {/* Downward hairs */}
        <line x1="200" y1="210" x2="55" y2="210" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <g transform="translate(10, 195)">
          <text x="0" y="0" fontSize="10" fontWeight="bold" fill="#a78bfa">Downward Hairs</text>
          <text x="0" y="14" fontSize="8" className="fill-slate-400">One-way passage: easy down,</text>
          <text x="0" y="26" fontSize="8" className="fill-slate-400">impossible to climb up</text>
        </g>

        {/* Digestive fluid */}
        <line x1="340" y1="310" x2="420" y2="310" stroke="#84cc16" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <g transform="translate(425, 295)">
          <text x="0" y="0" fontSize="10" fontWeight="bold" fill="#84cc16">Digestive Fluid</text>
          <text x="0" y="14" fontSize="8" className="fill-slate-400">pH 2\u20133 (like stomach acid)</text>
          <text x="0" y="26" fontSize="8" className="fill-slate-400">Nepenthesin enzyme + wetting</text>
          <text x="0" y="38" fontSize="8" className="fill-slate-400">agents reduce surface tension</text>
        </g>

        {/* Lid label */}
        <line x1="280" y1="65" x2="420" y2="45" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="425" y="44" fontSize="10" fontWeight="bold" fill="#22c55e">Lid keeps rain out</text>

        {/* Insect path arrows showing the trap sequence */}
        <g transform="translate(280, 420)">
          <rect x="-250" y="-15" width="500" height="50" rx="8" fill="#14532d" opacity="0.4" stroke="#22c55e" strokeWidth="1" />
          <text x="0" y="2" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#86efac">Trap Sequence</text>
          <text x="0" y="18" textAnchor="middle" fontSize="9" className="fill-slate-300">Nectar lure \u2192 Land on rim \u2192 Hydroplane \u2192 Slide on wax \u2192 Fall into acid pool \u2192 Digested</text>
        </g>
      </svg>
    </div>
  );
}
