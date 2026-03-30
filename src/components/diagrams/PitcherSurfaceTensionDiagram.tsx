export default function PitcherSurfaceTensionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 440" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram explaining surface tension and fluid dynamics in pitcher plant traps">
        <rect width="560" height="440" rx="12" className="fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#38bdf8">Surface Tension and Fluid Dynamics</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-slate-400">Why insects cannot escape the pitcher</text>

        {/* Left panel: Normal surface vs wettable surface */}
        <g transform="translate(20, 70)">
          <text x="120" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#38bdf8">How the Peristome Works</text>

          {/* Normal dry surface */}
          <text x="120" y="25" textAnchor="middle" fontSize="10" fill="#86efac">Dry peristome: safe footing</text>
          <rect x="20" y="35" width="200" height="30" rx="4" fill="#374151" stroke="#6b7280" strokeWidth="1" />
          {/* Insect foot gripping */}
          <g transform="translate(120, 40)">
            <rect x="-8" y="-8" width="16" height="8" rx="2" fill="#78716c" />
            <text x="0" y="-2" textAnchor="middle" fontSize="6" fill="white">foot</text>
            {/* Adhesive pad */}
            <rect x="-6" y="0" width="12" height="3" rx="1" fill="#22c55e" />
            <text x="25" y="3" fontSize="7" fill="#86efac">\u2713 grip</text>
          </g>

          {/* Wet surface - aquaplaning */}
          <text x="120" y="90" textAnchor="middle" fontSize="10" fill="#f87171">Wet peristome: aquaplaning!</text>
          <rect x="20" y="100" width="200" height="30" rx="4" fill="#374151" stroke="#6b7280" strokeWidth="1" />
          {/* Water film */}
          <rect x="20" y="100" width="200" height="6" rx="2" fill="#38bdf8" opacity="0.4" />
          {/* Microscopic ridges */}
          {Array.from({length: 20}, (_, i) => (
            <line key={i} x1={25 + i * 10} y1="106" x2={25 + i * 10} y2="112" stroke="#6b7280" strokeWidth="1" />
          ))}
          {/* Insect foot sliding */}
          <g transform="translate(120, 103)">
            <rect x="-8" y="-8" width="16" height="8" rx="2" fill="#78716c" />
            <text x="0" y="-2" textAnchor="middle" fontSize="6" fill="white">foot</text>
            {/* Water layer under foot */}
            <rect x="-10" y="0" width="20" height="3" rx="1" fill="#38bdf8" opacity="0.6" />
            <text x="25" y="3" fontSize="7" fill="#f87171">\u2717 slip!</text>
            {/* Sliding arrow */}
            <line x1="15" y1="-4" x2="35" y2="-4" stroke="#f87171" strokeWidth="1.5" />
            <polygon points="35,-4 30,-7 30,-1" fill="#f87171" />
          </g>

          {/* Explanation */}
          <text x="120" y="155" textAnchor="middle" fontSize="8" className="fill-slate-400">Nectar or rain fills microscopic ridges</text>
          <text x="120" y="167" textAnchor="middle" fontSize="8" className="fill-slate-400">creating a continuous water film.</text>
          <text x="120" y="179" textAnchor="middle" fontSize="8" className="fill-slate-400">Insect feet hydroplane like tires on wet road.</text>
        </g>

        {/* Right panel: Surface tension comparison */}
        <g transform="translate(300, 70)">
          <text x="120" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#38bdf8">Surface Tension Trap</text>

          {/* High surface tension - insect floats */}
          <text x="120" y="25" textAnchor="middle" fontSize="10" fill="#86efac">Normal water: insect can float</text>
          <g transform="translate(120, 70)">
            {/* Water surface */}
            <line x1="-80" y1="0" x2="80" y2="0" stroke="#38bdf8" strokeWidth="2" />
            {/* Meniscus showing tension */}
            <path d="M -15,-8 Q -10,-2 0,0 Q 10,-2 15,-8" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Insect sitting on top */}
            <ellipse cx="0" cy="-10" rx="10" ry="5" fill="#78716c" />
            <line x1="-10" y1="-8" x2="-18" y2="-14" stroke="#57534e" strokeWidth="1" />
            <line x1="10" y1="-8" x2="18" y2="-14" stroke="#57534e" strokeWidth="1" />
            {/* Upward arrows showing surface tension */}
            <line x1="-8" y1="0" x2="-8" y2="-5" stroke="#86efac" strokeWidth="1" />
            <polygon points="-8,-6 -10,-3 -6,-3" fill="#86efac" />
            <line x1="8" y1="0" x2="8" y2="-5" stroke="#86efac" strokeWidth="1" />
            <polygon points="8,-6 6,-3 10,-3" fill="#86efac" />
            <text x="40" y="-5" fontSize="7" fill="#86efac">\u2191 tension holds</text>
          </g>

          {/* Low surface tension - insect sinks */}
          <text x="120" y="105" textAnchor="middle" fontSize="10" fill="#f87171">Pitcher fluid: insect sinks</text>
          <g transform="translate(120, 145)">
            {/* Water surface */}
            <line x1="-80" y1="0" x2="80" y2="0" stroke="#84cc16" strokeWidth="2" />
            {/* No meniscus - flat, broken tension */}
            {/* Insect sinking below */}
            <ellipse cx="0" cy="12" rx="10" ry="5" fill="#78716c" opacity="0.6" />
            <line x1="-10" y1="14" x2="-16" y2="18" stroke="#57534e" strokeWidth="1" opacity="0.5" />
            <line x1="10" y1="14" x2="16" y2="18" stroke="#57534e" strokeWidth="1" opacity="0.5" />
            {/* Downward arrows */}
            <line x1="0" y1="3" x2="0" y2="10" stroke="#f87171" strokeWidth="1.5" />
            <polygon points="0,11 -3,7 3,7" fill="#f87171" />
            <text x="40" y="12" fontSize="7" fill="#f87171">\u2193 wetting agents</text>
            <text x="40" y="22" fontSize="7" fill="#f87171">  break tension</text>
            {/* Surfactant molecules */}
            {[-30, -15, 15, 30].map((xp, i) => (
              <g key={i}>
                <circle cx={xp} cy={-2} r="2" fill="#84cc16" opacity="0.5" />
                <line x1={xp} y1={0} x2={xp} y2={5} stroke="#84cc16" strokeWidth="0.8" opacity="0.5" />
              </g>
            ))}
          </g>
        </g>

        {/* Bottom: Wax crystal mechanism */}
        <g transform="translate(280, 290)">
          <rect x="-250" y="-10" width="500" height="130" rx="8" className="fill-slate-800" stroke="#fbbf24" strokeWidth="1" />
          <text x="0" y="10" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">Wax Crystal Defence</text>

          {/* Fly foot with adhesive pad */}
          <g transform="translate(-130, 50)">
            <text x="50" y="-20" textAnchor="middle" fontSize="9" fill="#86efac">Normal surface</text>
            <rect x="10" y="0" width="80" height="20" rx="3" fill="#374151" stroke="#6b7280" strokeWidth="1" />
            {/* Foot */}
            <rect x="35" y="-10" width="30" height="10" rx="2" fill="#78716c" />
            {/* Adhesive pad making contact */}
            <rect x="38" y="0" width="24" height="3" rx="1" fill="#a78bfa" />
            <text x="50" y="40" textAnchor="middle" fontSize="8" className="fill-slate-400">Adhesive pad grips surface</text>
            <text x="50" y="52" textAnchor="middle" fontSize="8" fill="#86efac">\u2713 Stable</text>
          </g>

          {/* Fly foot on wax - crystals detaching */}
          <g transform="translate(100, 50)">
            <text x="70" y="-20" textAnchor="middle" fontSize="9" fill="#f87171">Waxy pitcher wall</text>
            <rect x="10" y="0" width="120" height="20" rx="3" fill="#374151" stroke="#6b7280" strokeWidth="1" />
            {/* Wax crystals on surface */}
            {[20, 35, 50, 65, 80, 95, 110].map((xp, i) => (
              <polygon key={i} points={`${xp},0 ${xp + 3},-4 ${xp + 6},0`} fill="#fbbf24" opacity="0.6" />
            ))}
            {/* Foot with crystals stuck to pad */}
            <rect x="50" y="-14" width="30" height="10" rx="2" fill="#78716c" />
            <rect x="53" y="-4" width="24" height="3" rx="1" fill="#a78bfa" />
            {/* Detached crystals on pad */}
            <polygon points="58,-4 60,-7 62,-4" fill="#fbbf24" opacity="0.8" />
            <polygon points="68,-4 70,-7 72,-4" fill="#fbbf24" opacity="0.8" />
            <text x="70" y="40" textAnchor="middle" fontSize="8" className="fill-slate-400">Wax crystals clog adhesive pad</text>
            <text x="70" y="52" textAnchor="middle" fontSize="8" fill="#f87171">\u2717 No grip \u2192 insect slides down</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
