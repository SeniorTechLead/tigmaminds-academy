import { useState, useEffect } from 'react';

// ── A Living Atom ────────────────────────────────────────────
// Carbon atom with electrons orbiting at different speeds per shell.
// Nucleus glows with protons (red) and neutrons (gray) jostling.
// Click an electron to excite it to a higher shell — it jumps up
// and then falls back, emitting a photon flash.

export default function AtomStructureDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [excited, setExcited] = useState<number | null>(null); // which electron is excited
  const [photonFlash, setPhotonFlash] = useState<{ x: number; y: number; age: number } | null>(null);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 25);
    return () => clearInterval(interval);
  }, [paused]);

  // Decay excited electron after ~60 ticks
  useEffect(() => {
    if (excited !== null && tick % 60 === 0 && tick > 0) {
      // Emit photon at electron's current position
      const shell = 2; // excited shell
      const angle = (tick * 0.02 + excited * (Math.PI / 2)) ;
      const r = shells[shell].r;
      setPhotonFlash({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        age: 0,
      });
      setExcited(null);
    }
  }, [tick, excited]);

  // Age photon flash
  useEffect(() => {
    if (!photonFlash) return;
    const interval = setInterval(() => {
      setPhotonFlash(prev => {
        if (!prev || prev.age > 30) return null;
        return { ...prev, age: prev.age + 1, x: prev.x + 2, y: prev.y - 1.5 };
      });
    }, 33);
    return () => clearInterval(interval);
  }, [photonFlash]);

  const cx = 230, cy = 210;

  const shells = [
    { r: 55,  n: 2, speed: 0.04, color: '#60a5fa' },  // K shell: 2 electrons
    { r: 100, n: 4, speed: 0.025, color: '#34d399' },  // L shell: 4 electrons
    { r: 150, n: 0, speed: 0.015, color: '#a78bfa' },  // M shell: empty (for excitation target)
  ];

  // Nucleus particles (protons + neutrons) with jiggle
  const nucleons = [
    { type: 'p', angle: 0 },    { type: 'n', angle: 60 },
    { type: 'p', angle: 120 },  { type: 'n', angle: 180 },
    { type: 'p', angle: 240 },  { type: 'n', angle: 300 },
    { type: 'p', angle: 30 },   { type: 'n', angle: 90 },
    { type: 'p', angle: 150 },  { type: 'n', angle: 210 },
    { type: 'p', angle: 270 },  { type: 'n', angle: 330 },
  ];

  const handleElectronClick = (shellIdx: number, electronIdx: number) => {
    if (shellIdx === 0 || excited !== null) return; // only L-shell electrons can be excited
    setExcited(electronIdx);
  };

  return (
    <div className="bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          A Living Atom — Carbon-12
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Click an outer electron to excite it</span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox="0 0 460 420" className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Animated carbon atom with orbiting electrons — click to excite">

        <defs>
          <radialGradient id="nucleusGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#f97316" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="electronGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Shell orbital rings */}
        {shells.map((shell, si) => (
          <circle key={`shell-${si}`} cx={cx} cy={cy} r={shell.r}
            fill="none" stroke={shell.color} strokeWidth="0.5" opacity={si === 2 ? 0.2 : 0.3}
            strokeDasharray={si === 2 ? '4,6' : 'none'} />
        ))}

        {/* Shell labels */}
        <text x={cx + shells[0].r + 8} y={cy - 5} fill="#60a5fa" fontSize="9" opacity="0.6">n=1 (K)</text>
        <text x={cx + shells[1].r + 8} y={cy - 5} fill="#34d399" fontSize="9" opacity="0.6">n=2 (L)</text>
        <text x={cx + shells[2].r + 8} y={cy - 5} fill="#a78bfa" fontSize="9" opacity="0.3">n=3 (M)</text>

        {/* Nucleus glow */}
        <circle cx={cx} cy={cy} r="35" fill="url(#nucleusGlow)" />

        {/* Nucleons with jiggle */}
        {nucleons.map((n, i) => {
          const jiggle = Math.sin(tick * 0.15 + i * 2.1) * 1.5;
          const jiggle2 = Math.cos(tick * 0.12 + i * 1.7) * 1.5;
          const baseR = i < 6 ? 9 : 12;
          const rad = (n.angle * Math.PI) / 180;
          const nx = cx + Math.cos(rad) * baseR + jiggle;
          const ny = cy + Math.sin(rad) * baseR + jiggle2;
          const color = n.type === 'p' ? '#ef4444' : '#9ca3af';
          const label = n.type === 'p' ? 'p⁺' : 'n⁰';

          return (
            <g key={`nuc-${i}`}>
              <circle cx={nx} cy={ny} r="7" fill={color} opacity="0.85" />
              <text x={nx} y={ny + 1} textAnchor="middle" fill="white" fontSize="6"
                fontWeight="bold">{label}</text>
            </g>
          );
        })}

        {/* Electrons orbiting */}
        {shells.slice(0, 2).map((shell, si) =>
          Array.from({ length: shell.n }, (_, ei) => {
            const isExcited = si === 1 && excited === ei;
            const activeShell = isExcited ? shells[2] : shell;
            const angle = tick * shell.speed + ei * ((2 * Math.PI) / shell.n);

            // Slight elliptical orbit for visual interest
            const rx = activeShell.r;
            const ry = activeShell.r * 0.85;
            const tilt = si * 0.3 + ei * 0.1;
            const ex = cx + Math.cos(angle + tilt) * rx;
            const ey = cy + Math.sin(angle + tilt) * ry;

            return (
              <g key={`e-${si}-${ei}`}
                onClick={() => handleElectronClick(si, ei)}
                className={si === 1 ? 'cursor-pointer' : ''}>
                {/* Electron glow trail */}
                <circle cx={ex} cy={ey} r="10" fill="url(#electronGlow)" opacity={isExcited ? 0.8 : 0.4} />
                {/* Electron */}
                <circle cx={ex} cy={ey} r={isExcited ? 5 : 4}
                  fill={isExcited ? '#a78bfa' : shell.color}
                  stroke="white" strokeWidth="0.5" />
                <text x={ex} y={ey + 1} textAnchor="middle" fill="white" fontSize="5"
                  fontWeight="bold">e⁻</text>
              </g>
            );
          })
        )}

        {/* Photon flash (emitted when electron drops back) */}
        {photonFlash && (
          <g opacity={Math.max(0, 1 - photonFlash.age / 30)}>
            <circle cx={photonFlash.x} cy={photonFlash.y} r={4 + photonFlash.age * 0.5}
              fill="#fde047" opacity="0.6" />
            <circle cx={photonFlash.x} cy={photonFlash.y} r="3" fill="#fde047" />
            <text x={photonFlash.x + 10} y={photonFlash.y - 5} fill="#fde047" fontSize="8"
              fontWeight="bold">γ photon!</text>
          </g>
        )}

        {/* Info labels */}
        <g opacity="0.7">
          <text x={cx} y={cy + 30} textAnchor="middle" fill="#f97316" fontSize="9" fontWeight="600">
            6 protons + 6 neutrons
          </text>
          <text x={cx} y={cy + 42} textAnchor="middle" fill="#6b7280" fontSize="8">
            Mass ≈ 12 amu
          </text>
        </g>

        {/* Bottom info */}
        <text x={cx} y={395} textAnchor="middle" fill="#6b7280" fontSize="9">
          Carbon: 6 electrons · 2 in K shell · 4 in L shell · 4 valence electrons = 4 bonds possible
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" /> Proton (p⁺)
        </span>
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-400" /> Neutron (n⁰)
        </span>
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400" /> Electron (e⁻)
        </span>
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-300" /> Photon (emitted)
        </span>
      </div>
    </div>
  );
}
