export default function ElephantGroundWaveDiagram() {
  // Vibration arcs radiating DOWN from sender elephant's feet
  const senderRipples = [20, 40, 60, 80, 100].map((r, i) => ({
    d: `M${85 - r},${195} A${r},${r * 0.6} 0 0,0 ${85 + r},${195}`,
    opacity: 0.9 - i * 0.15,
    dash: i > 2 ? '4,3' : 'none',
  }));

  // Vibration arcs arriving UP at receiver elephant's feet
  const receiverRipples = [20, 40, 60, 80, 100].map((r, i) => ({
    d: `M${475 - r},${195} A${r},${r * 0.6} 0 0,1 ${475 + r},${195}`,
    opacity: 0.9 - i * 0.15,
    dash: i > 2 ? '4,3' : 'none',
  }));

  // Dotted wave path through the ground between elephants
  const wavePath = Array.from({ length: 200 }, (_, i) => {
    const t = i / 200;
    const x = 140 + t * 280;
    const baseY = 250;
    const wiggle = Math.sin(2 * Math.PI * 6 * t) * 5;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${(baseY + wiggle).toFixed(1)}`;
  }).join(' ');

  return (
    <svg
      viewBox="0 0 675 482"
      className="w-full max-w-lg mx-auto my-4"
      role="img"
      aria-label="Diagram showing how elephant calls travel through the ground as seismic waves up to 10 kilometres"
    >
      {/* Dark background */}
      <rect width="560" height="440" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="280" y="24" textAnchor="middle" className="fill-amber-400" fontSize="12" fontWeight="700">
        Seismic communication: how elephants talk through the ground
      </text>

      {/* ============================================ */}
      {/* GROUND LAYERS                                */}
      {/* ============================================ */}

      {/* Surface line */}
      <line x1="10" y1="180" x2="550" y2="180" className="stroke-amber-700" strokeWidth="2.5" />

      {/* Soil layer */}
      <rect x="10" y="180" width="540" height="80" fill="#78350f" opacity="0.3" />
      <text x="545" y="225" textAnchor="end" className="fill-amber-600" fontSize="8" fontWeight="600">
        Soil
      </text>

      {/* Rock layer */}
      <rect x="10" y="260" width="540" height="70" fill="#374151" opacity="0.4" />
      <text x="545" y="300" textAnchor="end" className="fill-gray-500" fontSize="8" fontWeight="600">
        Rock
      </text>

      {/* Surface label */}
      <text x="15" y="175" className="fill-amber-700" fontSize="8">
        Ground surface
      </text>

      {/* ============================================ */}
      {/* LEFT: Sending elephant                       */}
      {/* ============================================ */}

      {/* Body */}
      <ellipse cx="80" cy="136" rx="38" ry="26" className="fill-emerald-700" />
      {/* Head */}
      <ellipse cx="48" cy="124" rx="18" ry="16" className="fill-emerald-700" />
      {/* Trunk curled down — stamping */}
      <path d="M33,130 Q20,148 28,162" fill="none" className="stroke-emerald-700" strokeWidth="4" strokeLinecap="round" />
      {/* Ear */}
      <ellipse cx="56" cy="118" rx="9" ry="13" className="fill-emerald-600" />
      {/* Front legs — pressed firmly */}
      <rect x="60" y="155" width="8" height="25" rx="3" className="fill-emerald-700" />
      <rect x="74" y="155" width="8" height="25" rx="3" className="fill-emerald-700" />
      {/* Back legs */}
      <rect x="96" y="155" width="8" height="25" rx="3" className="fill-emerald-700" />
      <rect x="110" y="155" width="8" height="25" rx="3" className="fill-emerald-700" />
      {/* Eye */}
      <circle cx="41" cy="120" r="2" className="fill-slate-900" />
      {/* Tusk hint */}
      <path d="M36,128 L30,136" className="stroke-gray-300" strokeWidth="1.5" strokeLinecap="round" />

      {/* Foot-to-ground impact lines */}
      <line x1="64" y1="178" x2="64" y2="186" className="stroke-sky-400" strokeWidth="1.5" />
      <line x1="78" y1="178" x2="78" y2="186" className="stroke-sky-400" strokeWidth="1.5" />
      <line x1="100" y1="178" x2="100" y2="186" className="stroke-sky-400" strokeWidth="1.5" />

      {/* Label */}
      <text x="80" y="104" textAnchor="middle" className="fill-emerald-400" fontSize="9" fontWeight="600">
        Sender stomps
      </text>

      {/* Vibration arcs going DOWN into ground */}
      {senderRipples.map((r, i) => (
        <path
          key={`s${i}`}
          d={r.d}
          fill="none"
          className="stroke-sky-400"
          strokeWidth="1.2"
          opacity={r.opacity}
          strokeDasharray={r.dash}
        />
      ))}

      {/* ============================================ */}
      {/* RIGHT: Listening elephant                    */}
      {/* ============================================ */}

      {/* Body — leaning forward */}
      <ellipse cx="480" cy="134" rx="36" ry="24" className="fill-emerald-700" />
      {/* Head — lowered, listening */}
      <ellipse cx="450" cy="128" rx="17" ry="14" className="fill-emerald-700" />
      {/* Trunk — hanging low, still */}
      <path d="M436,134 Q424,152 430,164" fill="none" className="stroke-emerald-700" strokeWidth="4" strokeLinecap="round" />
      {/* Ear — flared out to listen */}
      <ellipse cx="457" cy="120" rx="10" ry="14" className="fill-emerald-600" />
      {/* Front left leg — lifted off ground */}
      <path d="M460,152 L456,168" fill="none" className="stroke-emerald-700" strokeWidth="7" strokeLinecap="round" />
      {/* Front right leg — pressed flat, feeling */}
      <rect x="470" y="152" width="9" height="28" rx="3" className="fill-emerald-700" />
      {/* Back legs */}
      <rect x="496" y="152" width="8" height="28" rx="3" className="fill-emerald-700" />
      <rect x="508" y="152" width="8" height="28" rx="3" className="fill-emerald-700" />
      {/* Eye */}
      <circle cx="443" cy="124" r="2" className="fill-slate-900" />
      {/* Tusk hint */}
      <path d="M438,132 L432,140" className="stroke-gray-300" strokeWidth="1.5" strokeLinecap="round" />

      {/* Foot-to-ground sensor lines */}
      <line x1="474" y1="178" x2="474" y2="186" className="stroke-sky-400" strokeWidth="1.5" />
      <line x1="500" y1="178" x2="500" y2="186" className="stroke-sky-400" strokeWidth="1.5" />

      {/* Labels */}
      <text x="478" y="100" textAnchor="middle" className="fill-emerald-400" fontSize="9" fontWeight="600">
        Listener (foot pressed flat)
      </text>

      {/* Pacinian corpuscle label */}
      <text x="478" y="88" textAnchor="middle" className="fill-sky-300" fontSize="8">
        Pacinian corpuscles detect the vibration
      </text>

      {/* Vibration arcs arriving UP from ground */}
      {receiverRipples.map((r, i) => (
        <path
          key={`r${i}`}
          d={r.d}
          fill="none"
          className="stroke-sky-400"
          strokeWidth="1.2"
          opacity={r.opacity}
          strokeDasharray={r.dash}
        />
      ))}

      {/* ============================================ */}
      {/* MIDDLE: Wave path + distance comparison      */}
      {/* ============================================ */}

      {/* Dotted wave path through ground */}
      <path d={wavePath} fill="none" className="stroke-sky-400" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7" />

      {/* Distance label */}
      <text x="280" y="238" textAnchor="middle" className="fill-sky-300" fontSize="10" fontWeight="700">
        Up to 10 km through the earth
      </text>

      {/* Distance bracket */}
      <line x1="140" y1="268" x2="420" y2="268" className="stroke-amber-500" strokeWidth="1" markerStart="url(#gndArrowL)" markerEnd="url(#gndArrowR)" />
      <text x="280" y="282" textAnchor="middle" className="fill-amber-400" fontSize="8">
        ~10 km
      </text>

      {/* ============================================ */}
      {/* Comparison: Air vs Ground                    */}
      {/* ============================================ */}

      <line x1="40" y1="330" x2="520" y2="330" className="stroke-slate-700" strokeWidth="1" />

      <text x="280" y="350" textAnchor="middle" className="fill-amber-400" fontSize="11" fontWeight="700">
        Air vs. ground: why elephants use their feet
      </text>

      {/* Air — short faded arrow */}
      <text x="60" y="375" className="fill-gray-500" fontSize="9" fontWeight="600">
        Air:
      </text>
      <line x1="85" y1="372" x2="135" y2="372" className="stroke-gray-500" strokeWidth="2" opacity="0.5" markerEnd="url(#gndArrowFade)" />
      <text x="140" y="375" className="fill-gray-500" fontSize="8">
        sound fades ~200 m
      </text>

      {/* Ground — long strong arrow */}
      <text x="280" y="375" className="fill-sky-300" fontSize="9" fontWeight="600">
        Ground:
      </text>
      <line x1="315" y1="372" x2="510" y2="372" className="stroke-sky-400" strokeWidth="2.5" markerEnd="url(#gndArrowR)" />
      <text x="515" y="375" className="fill-sky-300" fontSize="8">
        10 km
      </text>

      {/* ============================================ */}
      {/* BOTTOM: Frequency explanation                */}
      {/* ============================================ */}

      <text x="280" y="415" textAnchor="middle" className="fill-gray-400" fontSize="9">
        Low frequencies (8–25 Hz) travel farther because long wavelengths lose less energy
      </text>
      <text x="280" y="432" textAnchor="middle" className="fill-gray-500" fontSize="8">
        That's below human hearing (&lt;20 Hz) — we can't hear it, but elephants feel it
      </text>

      {/* ============================================ */}
      {/* Defs: arrow markers                          */}
      {/* ============================================ */}
      <defs>
        <marker id="gndArrowR" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" className="fill-amber-500" />
        </marker>
        <marker id="gndArrowL" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M10,0 L0,5 L10,10 Z" className="fill-amber-500" />
        </marker>
        <marker id="gndArrowFade" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" className="fill-gray-500" opacity="0.5" />
        </marker>
      </defs>
    </svg>
  );
}
