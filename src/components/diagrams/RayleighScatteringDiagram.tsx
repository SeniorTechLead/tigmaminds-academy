export default function RayleighScatteringDiagram() {
  // Midday vs Sunset Rayleigh scattering — why the sky is blue and sunsets orange

  // Air molecule positions for the short (midday) path
  const middayMolecules = [
    { x: 260, y: 55 }, { x: 290, y: 40 }, { x: 320, y: 62 },
    { x: 350, y: 45 }, { x: 380, y: 58 }, { x: 310, y: 30 },
    { x: 340, y: 70 }, { x: 275, y: 68 }, { x: 365, y: 35 },
  ];

  // Air molecule positions for the long (sunset) path
  const sunsetMolecules = [
    { x: 140, y: 195 }, { x: 180, y: 210 }, { x: 220, y: 190 },
    { x: 260, y: 205 }, { x: 300, y: 195 }, { x: 340, y: 210 },
    { x: 380, y: 200 }, { x: 420, y: 192 }, { x: 460, y: 208 },
    { x: 170, y: 225 }, { x: 240, y: 220 }, { x: 310, y: 225 },
    { x: 370, y: 218 }, { x: 440, y: 222 },
  ];

  // Scattered blue arrows for midday (blue goes everywhere)
  const middayScatter = [
    { x: 290, y: 40, dx: -20, dy: -25 },
    { x: 320, y: 62, dx: 15, dy: 30 },
    { x: 350, y: 45, dx: 25, dy: -15 },
    { x: 310, y: 30, dx: -10, dy: -28 },
    { x: 340, y: 70, dx: 20, dy: 25 },
    { x: 275, y: 68, dx: -25, dy: 20 },
    { x: 260, y: 55, dx: -18, dy: 28 },
    { x: 380, y: 58, dx: 22, dy: -20 },
    { x: 365, y: 35, dx: 10, dy: -25 },
  ];

  // Scattered blue arrows for sunset (blue goes away before reaching observer)
  const sunsetScatter = [
    { x: 180, y: 210, dx: -15, dy: -22 },
    { x: 220, y: 190, dx: 10, dy: -25 },
    { x: 260, y: 205, dx: -18, dy: 20 },
    { x: 300, y: 195, dx: 15, dy: -20 },
    { x: 340, y: 210, dx: -12, dy: -25 },
    { x: 380, y: 200, dx: 20, dy: -18 },
    { x: 170, y: 225, dx: -20, dy: 15 },
    { x: 310, y: 225, dx: 12, dy: 22 },
  ];

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 600 300"
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label="Rayleigh scattering diagram showing why the sky is blue at midday and orange at sunset"
      >
        <defs>
          {/* Animated dash for light rays */}
          <style>{`
            @keyframes travel {
              to { stroke-dashoffset: -40; }
            }
            @keyframes scatter-pulse {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
            .ray-anim {
              stroke-dasharray: 8 6;
              animation: travel 1.2s linear infinite;
            }
            .scatter-arrow {
              animation: scatter-pulse 2s ease-in-out infinite;
            }
          `}</style>

          {/* Sun glow gradient */}
          <radialGradient id="sun-glow">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="60%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
          </radialGradient>

          {/* Arrowhead for scatter */}
          <marker id="scatter-head" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <path d="M0,0 L5,2 L0,4 Z" fill="#60A5FA" />
          </marker>
          <marker id="red-head" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <path d="M0,0 L5,2 L0,4 Z" fill="#F97316" />
          </marker>
        </defs>

        {/* ===== Background ===== */}
        <rect width="600" height="300" fill="#1E1B2E" rx="8" />

        {/* Dividing line */}
        <line x1="0" y1="145" x2="600" y2="145" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 3" />

        {/* ===== MIDDAY (top half) ===== */}
        <text x="300" y="16" textAnchor="middle" fill="#93C5FD" fontSize="12" fontWeight="700">
          MIDDAY — Short path through atmosphere
        </text>

        {/* Sun (left) */}
        <circle cx="60" cy="55" r="22" fill="url(#sun-glow)" />
        <text x="60" y="90" textAnchor="middle" fill="#FBBF24" fontSize="8">Sun</text>

        {/* White light rays traveling right */}
        <line x1="82" y1="55" x2="250" y2="55" stroke="#FDE68A" strokeWidth="1.5" className="ray-anim" />
        <line x1="82" y1="48" x2="250" y2="42" stroke="#FDE68A" strokeWidth="1" className="ray-anim" opacity="0.7" />
        <line x1="82" y1="62" x2="250" y2="68" stroke="#FDE68A" strokeWidth="1" className="ray-anim" opacity="0.7" />

        {/* Atmosphere band (molecules) */}
        {middayMolecules.map((m, i) => (
          <circle key={`mm-${i}`} cx={m.x} cy={m.y} r="2.5" fill="#60A5FA" opacity="0.7" />
        ))}
        <text x="320" y="85" textAnchor="middle" fill="#475569" fontSize="7">air molecules</text>

        {/* Scattered blue arrows */}
        {middayScatter.map((s, i) => (
          <line
            key={`ms-${i}`}
            x1={s.x}
            y1={s.y}
            x2={s.x + s.dx}
            y2={s.y + s.dy}
            stroke="#60A5FA"
            strokeWidth="1.2"
            markerEnd="url(#scatter-head)"
            className="scatter-arrow"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}

        {/* Some transmitted light still reaches right */}
        <line x1="400" y1="55" x2="480" y2="55" stroke="#FDE68A" strokeWidth="1" className="ray-anim" opacity="0.5" />

        {/* Observer below sees blue */}
        <g transform="translate(320, 95)">
          {/* Stick figure */}
          <circle cx="0" cy="0" r="4" fill="none" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="0" y1="4" x2="0" y2="16" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="-6" y1="10" x2="6" y2="10" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="0" y1="16" x2="-4" y2="24" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="0" y1="16" x2="4" y2="24" stroke="#CBD5E1" strokeWidth="1" />
          {/* Looking up arrow */}
          <line x1="0" y1="-6" x2="0" y2="-15" stroke="#60A5FA" strokeWidth="1" strokeDasharray="2 2" />
        </g>
        <text x="355" y="108" fill="#93C5FD" fontSize="8" fontWeight="600">
          Sees BLUE sky
        </text>

        {/* ===== SUNSET (bottom half) ===== */}
        <text x="300" y="162" textAnchor="middle" fill="#FDBA74" fontSize="12" fontWeight="700">
          SUNSET — Long path through atmosphere
        </text>

        {/* Sun (far left, at horizon) */}
        <circle cx="30" cy="205" r="20" fill="#F97316" opacity="0.9" />
        <circle cx="30" cy="205" r="14" fill="#FBBF24" />
        <text x="30" y="232" textAnchor="middle" fill="#F97316" fontSize="8">Sun (horizon)</text>

        {/* White light entering from left — long path */}
        <line x1="50" y1="205" x2="130" y2="205" stroke="#FDE68A" strokeWidth="1.5" className="ray-anim" />

        {/* Atmosphere band (many molecules — long path) */}
        {sunsetMolecules.map((m, i) => (
          <circle key={`sm-${i}`} cx={m.x} cy={m.y} r="2.5" fill="#60A5FA" opacity="0.6" />
        ))}

        {/* Blue scatters away along the long path */}
        {sunsetScatter.map((s, i) => (
          <line
            key={`ss-${i}`}
            x1={s.x}
            y1={s.y}
            x2={s.x + s.dx}
            y2={s.y + s.dy}
            stroke="#60A5FA"
            strokeWidth="1"
            markerEnd="url(#scatter-head)"
            className="scatter-arrow"
            style={{ animationDelay: `${i * 0.25}s` }}
            opacity="0.6"
          />
        ))}

        {/* Only red/orange light survives to reach observer */}
        <line x1="470" y1="205" x2="530" y2="205" stroke="#F97316" strokeWidth="2" className="ray-anim" markerEnd="url(#red-head)" />
        <line x1="470" y1="200" x2="530" y2="198" stroke="#EF4444" strokeWidth="1" className="ray-anim" opacity="0.6" />
        <line x1="470" y1="210" x2="530" y2="212" stroke="#F97316" strokeWidth="1" className="ray-anim" opacity="0.6" />

        {/* Observer */}
        <g transform="translate(545, 190)">
          <circle cx="0" cy="0" r="4" fill="none" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="0" y1="4" x2="0" y2="16" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="-6" y1="10" x2="6" y2="10" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="0" y1="16" x2="-4" y2="24" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="0" y1="16" x2="4" y2="24" stroke="#CBD5E1" strokeWidth="1" />
        </g>
        <text x="545" y="222" textAnchor="middle" fill="#FDBA74" fontSize="8" fontWeight="600">
          Sees ORANGE
        </text>
        <text x="545" y="232" textAnchor="middle" fill="#FDBA74" fontSize="8" fontWeight="600">
          sunset
        </text>

        {/* ===== Bottom label ===== */}
        <rect x="80" y="258" width="440" height="22" rx="4" fill="#1E293B" />
        <text x="300" y="273" textAnchor="middle" fill="#94A3B8" fontSize="10">
          Short wavelength (blue) scatters ~10x more than long wavelength (red)
        </text>

        {/* Path length comparison arrows */}
        <g opacity="0.5">
          {/* Short path bracket — midday */}
          <line x1="250" y1="75" x2="400" y2="75" stroke="#64748B" strokeWidth="0.8" />
          <text x="325" y="82" textAnchor="middle" fill="#64748B" fontSize="7">short path</text>

          {/* Long path bracket — sunset */}
          <line x1="50" y1="240" x2="470" y2="240" stroke="#64748B" strokeWidth="0.8" />
          <text x="260" y="252" textAnchor="middle" fill="#64748B" fontSize="7">long path — blue fully scattered before reaching observer</text>
        </g>
      </svg>
    </div>
  );
}
