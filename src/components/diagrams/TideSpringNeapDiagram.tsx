export default function TideSpringNeapDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 440" className="w-full h-auto" role="img"
        aria-label="Diagram comparing spring tides and neap tides based on Sun-Moon-Earth alignment">
        <rect width="520" height="440" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Spring Tides vs Neap Tides
        </text>

        {/* === TOP: SPRING TIDE (Sun-Moon aligned) === */}
        <text x="260" y="52" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">
          Spring Tide: Sun + Moon pull TOGETHER
        </text>

        {/* Sun on left */}
        <circle cx="40" cy="130" r="22" fill="#fbbf24" />
        <text x="40" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Sun</text>

        {/* Earth center */}
        <circle cx="220" cy="130" r="30" fill="#1e40af" />
        <ellipse cx="215" cy="125" rx="10" ry="8" fill="#16a34a" opacity="0.6" />
        {/* Tidal bulge — big */}
        <ellipse cx="220" cy="130" rx="52" ry="28" fill="#3b82f6" opacity="0.3" />

        {/* Moon on right */}
        <circle cx="340" cy="130" r="14" fill="#d1d5db" />
        <text x="340" y="158" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#d1d5db">Moon</text>

        {/* Alignment arrows */}
        <line x1="65" y1="130" x2="185" y2="130" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="260" y1="130" x2="323" y2="130" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Extra high/low labels */}
        <text x="275" y="125" fontSize="10" fontWeight="bold" fill="#60a5fa">Extra</text>
        <text x="275" y="137" fontSize="10" fontWeight="bold" fill="#60a5fa">high!</text>
        <text x="160" y="125" fontSize="10" fontWeight="bold" fill="#60a5fa">Extra</text>
        <text x="160" y="137" fontSize="10" fontWeight="bold" fill="#60a5fa">high!</text>

        {/* Explanation */}
        <rect x="370" y="90" width="140" height="80" rx="6" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
        <text x="440" y="110" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Spring Tides</text>
        <text x="440" y="125" textAnchor="middle" fontSize="10" fill="#94a3b8">Full moon or new</text>
        <text x="440" y="138" textAnchor="middle" fontSize="10" fill="#94a3b8">moon. Sun and Moon</text>
        <text x="440" y="151" textAnchor="middle" fontSize="10" fill="#94a3b8">forces ADD together.</text>
        <text x="440" y="164" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">Biggest tidal range!</text>

        {/* Divider */}
        <line x1="20" y1="200" x2="500" y2="200" stroke="#475569" strokeWidth="1" strokeDasharray="4,4" />

        {/* === BOTTOM: NEAP TIDE (Sun-Moon at 90 degrees) === */}
        <text x="260" y="225" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a78bfa">
          Neap Tide: Sun and Moon pull at RIGHT ANGLES
        </text>

        {/* Sun on top */}
        <circle cx="220" cy="260" r="22" fill="#fbbf24" />
        <text x="250" y="260" fontSize="10" fontWeight="bold" fill="#fbbf24">Sun</text>

        {/* Earth center */}
        <circle cx="220" cy="330" r="30" fill="#1e40af" />
        <ellipse cx="215" cy="325" rx="10" ry="8" fill="#16a34a" opacity="0.6" />

        {/* Tidal bulge — smaller, pulled in two directions */}
        <ellipse cx="220" cy="330" rx="42" ry="30" fill="#3b82f6" opacity="0.2" />

        {/* Moon on right, at 90 degrees */}
        <circle cx="340" cy="330" r="14" fill="#d1d5db" />
        <text x="340" y="358" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#d1d5db">Moon</text>

        {/* Pull arrows — perpendicular */}
        <line x1="220" y1="300" x2="220" y2="282" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="255" y1="330" x2="323" y2="330" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Right angle symbol */}
        <rect x="250" y="299" width="8" height="8" fill="none" stroke="#94a3b8" strokeWidth="1" />

        {/* Labels */}
        <text x="150" y="328" fontSize="10" fontWeight="bold" fill="#93c5fd">Smaller</text>
        <text x="150" y="340" fontSize="10" fontWeight="bold" fill="#93c5fd">tides</text>

        {/* Explanation */}
        <rect x="370" y="290" width="140" height="80" rx="6" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
        <text x="440" y="310" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a78bfa">Neap Tides</text>
        <text x="440" y="325" textAnchor="middle" fontSize="10" fill="#94a3b8">Quarter moons.</text>
        <text x="440" y="338" textAnchor="middle" fontSize="10" fill="#94a3b8">Sun and Moon forces</text>
        <text x="440" y="351" textAnchor="middle" fontSize="10" fill="#94a3b8">partially CANCEL out.</text>
        <text x="440" y="364" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10b981">Smallest tidal range.</text>

        {/* Bottom note */}
        <text x="260" y="420" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">
          Fishermen have tracked this cycle for thousands of years to plan their catch.
        </text>
      </svg>
    </div>
  );
}
