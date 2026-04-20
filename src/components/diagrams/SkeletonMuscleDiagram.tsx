import { useState, useEffect } from 'react';

// ── The Antagonist Pair ──────────────────────────────────────
// Animated arm flexion: when bicep contracts (shortens, bulges),
// tricep relaxes (lengthens). Forearm swings up. When tricep
// contracts, bicep relaxes, arm extends. Classic antagonistic
// muscle pair demo. Click to manually flex.

export default function SkeletonMuscleDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoFlex, setAutoFlex] = useState(true);
  const [manualFlex, setManualFlex] = useState(0); // 0 extended, 1 flexed

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 440, H = 380;

  // Flexion amount (0 = extended, 1 = fully flexed)
  const flex = autoFlex
    ? 0.5 + Math.sin(tick * 0.04) * 0.5
    : manualFlex;

  // Upper arm is fixed (vertical, left side)
  const shoulderX = 220, shoulderY = 60;
  const upperArmLength = 130;
  const elbowX = shoulderX, elbowY = shoulderY + upperArmLength;

  // Forearm rotates around elbow
  // At flex=0: forearm points down (extended). At flex=1: forearm points up-right (flexed)
  const forearmAngle = (Math.PI / 2) + flex * (Math.PI * 0.75); // 90° to 225°
  const forearmLength = 120;
  const handX = elbowX + Math.cos(forearmAngle - Math.PI / 2) * forearmLength;
  const handY = elbowY + Math.sin(forearmAngle - Math.PI / 2) * forearmLength;

  // Wait, simpler: at flex=0, forearm extends down; at flex=1, it's horizontal or pointing up
  // Let's redo with angle from vertical
  // extended: forearm straight down (angle 0 from vertical = pointing down)
  // flexed: forearm pointing right-up (angle ~135°)
  const armAngle = -Math.PI / 2 + flex * (Math.PI * 0.75); // from straight-down to up-right
  const hx = elbowX + Math.cos(armAngle) * forearmLength;
  const hy = elbowY + Math.sin(armAngle) * forearmLength;

  // Bicep position — on the front of upper arm, bulges when contracted (flex high)
  const bicepBulge = 12 + flex * 14;
  const bicepY = shoulderY + upperArmLength * 0.5;

  // Tricep on the back of upper arm, bulges when extended (flex low)
  const tricepBulge = 12 + (1 - flex) * 14;

  return (
    <div className="bg-gradient-to-b from-rose-50 via-orange-50 to-amber-50 dark:from-rose-950 dark:via-orange-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
          The Antagonist Pair
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-orange-700 dark:text-orange-300 font-mono">
            Flexion: {Math.round(flex * 100)}%
          </span>
          <button
            onClick={() => setAutoFlex(!autoFlex)}
            className={`text-xs px-2 py-0.5 rounded transition ${
              autoFlex
                ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/50'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}
          >
            {autoFlex ? 'Auto ●' : 'Manual'}
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto" role="img"
        aria-label="Animated arm flexion showing bicep contracting while tricep relaxes">

        {/* Shoulder joint */}
        <circle cx={shoulderX} cy={shoulderY} r={18}
          fill="#e5e7eb" stroke="#64748b" strokeWidth="2" opacity="0.8" />
        <text x={shoulderX + 25} y={shoulderY + 4} className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontWeight="600">
          Shoulder
        </text>

        {/* Upper arm bone (humerus) */}
        <rect x={shoulderX - 6} y={shoulderY} width={12} height={upperArmLength}
          fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" rx={6} />

        {/* Bicep (front) — bulges when flexed */}
        <ellipse
          cx={shoulderX - 22 - bicepBulge * 0.3}
          cy={bicepY}
          rx={bicepBulge}
          ry={upperArmLength * 0.35}
          fill="#dc2626"
          stroke="#991b1b"
          strokeWidth="1.5"
          opacity="0.85"
        />
        {/* Muscle fiber hint */}
        {[0, 1, 2, 3].map(i => (
          <line key={`bf-${i}`}
            x1={shoulderX - 22 - bicepBulge * 0.3 - bicepBulge + 2}
            y1={bicepY - upperArmLength * 0.3 + i * (upperArmLength * 0.2)}
            x2={shoulderX - 22 - bicepBulge * 0.3 + bicepBulge - 2}
            y2={bicepY - upperArmLength * 0.3 + i * (upperArmLength * 0.2)}
            stroke="#7f1d1d" strokeWidth="0.5" opacity="0.5" />
        ))}

        <text x={shoulderX - 55 - bicepBulge} y={bicepY - 30} className="fill-rose-700 dark:fill-rose-300" fontSize="9" fontWeight="600">
          Bicep
        </text>
        <text x={shoulderX - 55 - bicepBulge} y={bicepY - 18} className="fill-rose-600 dark:fill-rose-400" fontSize="7">
          {flex > 0.55 ? '▼ CONTRACTED' : flex < 0.45 ? 'relaxed' : 'contracting...'}
        </text>

        {/* Tricep (back) — bulges when extended */}
        <ellipse
          cx={shoulderX + 22 + tricepBulge * 0.3}
          cy={bicepY}
          rx={tricepBulge}
          ry={upperArmLength * 0.35}
          fill="#dc2626"
          stroke="#991b1b"
          strokeWidth="1.5"
          opacity="0.85"
        />
        {[0, 1, 2, 3].map(i => (
          <line key={`tf-${i}`}
            x1={shoulderX + 22 + tricepBulge * 0.3 - tricepBulge + 2}
            y1={bicepY - upperArmLength * 0.3 + i * (upperArmLength * 0.2)}
            x2={shoulderX + 22 + tricepBulge * 0.3 + tricepBulge - 2}
            y2={bicepY - upperArmLength * 0.3 + i * (upperArmLength * 0.2)}
            stroke="#7f1d1d" strokeWidth="0.5" opacity="0.5" />
        ))}

        <text x={shoulderX + 50} y={bicepY - 30} className="fill-rose-700 dark:fill-rose-300" fontSize="9" fontWeight="600">
          Tricep
        </text>
        <text x={shoulderX + 50} y={bicepY - 18} className="fill-rose-600 dark:fill-rose-400" fontSize="7">
          {flex < 0.45 ? '▼ CONTRACTED' : flex > 0.55 ? 'relaxed' : 'relaxing...'}
        </text>

        {/* Elbow joint */}
        <circle cx={elbowX} cy={elbowY} r={10}
          fill="#e5e7eb" stroke="#64748b" strokeWidth="2" />
        <text x={elbowX + 15} y={elbowY + 3} className="fill-gray-600 dark:fill-gray-300" fontSize="8">Elbow (hinge)</text>

        {/* Forearm bone */}
        <line x1={elbowX} y1={elbowY} x2={hx} y2={hy}
          stroke="#9ca3af" strokeWidth="12" strokeLinecap="round" />
        <line x1={elbowX} y1={elbowY} x2={hx} y2={hy}
          stroke="#f3f4f6" strokeWidth="8" strokeLinecap="round" />

        {/* Hand */}
        <circle cx={hx} cy={hy} r={12}
          fill="#fecaca" stroke="#fb7185" strokeWidth="1.5" opacity="0.9" />

        {/* Tendon connection visualization — bicep tendon to forearm */}
        {flex > 0.3 && (
          <line
            x1={shoulderX - 22 - bicepBulge * 0.3 + bicepBulge * 0.5}
            y1={bicepY + upperArmLength * 0.3}
            x2={elbowX - 2 + Math.cos(armAngle) * 20}
            y2={elbowY + 2 + Math.sin(armAngle) * 20}
            stroke="#facc15" strokeWidth="1.5" opacity={0.5 + flex * 0.3} strokeDasharray="3,2" />
        )}

        {/* Status */}
        <text x={W / 2} y={H - 60} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
          {flex > 0.7 ? '💪 FLEXED' : flex < 0.3 ? '↓ EXTENDED' : flex > 0.5 ? 'Flexing...' : 'Extending...'}
        </text>
        <text x={W / 2} y={H - 42} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="9">
          Bicep contracts → forearm swings up. Tricep contracts → forearm swings down.
        </text>
        <text x={W / 2} y={H - 28} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          Muscles only pull, never push — so every joint needs an antagonistic pair
        </text>
      </svg>

      {/* Manual control slider */}
      {!autoFlex && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Extended</span>
          <input type="range" min="0" max="100" value={Math.round(manualFlex * 100)}
            onChange={(e) => setManualFlex(Number(e.target.value) / 100)}
            className="flex-1 max-w-xs accent-rose-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Flexed</span>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600" /> Muscle (contracts to pull)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-300" /> Bone
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" /> Tendon
        </span>
      </div>
    </div>
  );
}
