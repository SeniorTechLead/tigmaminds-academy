import { useState, useEffect } from 'react';

// ── The Deal: Nectar for Delivery ────────────────────────────
// A bee visits a flower: lands, collects nectar, gets dusted with
// pollen, flies to the next flower, deposits pollen on the stigma.
// The whole pollination process animated step by step.

export default function BeePollinationDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pollinated, setPollinated] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  const W = 500, H = 350;
  const cycle = tick % 300; // full cycle

  // Bee position through the cycle
  // 0-60: approach flower 1
  // 60-120: on flower 1 (collecting)
  // 120-200: fly to flower 2
  // 200-260: on flower 2 (depositing)
  // 260-300: fly away

  const flower1X = 130, flower2X = 370;
  const flowerY = 250;

  let beeX: number, beeY: number;
  let hasPollen = false;
  let onFlower = 0; // 0=flying, 1=on flower 1, 2=on flower 2

  if (cycle < 60) {
    // Approaching flower 1
    const t = cycle / 60;
    beeX = 50 + t * (flower1X - 50);
    beeY = 80 + t * (flowerY - 120 - 80) + Math.sin(cycle * 0.3) * 15;
  } else if (cycle < 120) {
    // On flower 1 — collecting nectar, picking up pollen
    onFlower = 1;
    const wobble = Math.sin((cycle - 60) * 0.2) * 5;
    beeX = flower1X + wobble;
    beeY = flowerY - 50 + Math.sin((cycle - 60) * 0.15) * 3;
    hasPollen = cycle > 90;
  } else if (cycle < 200) {
    // Flying to flower 2
    const t = (cycle - 120) / 80;
    beeX = flower1X + t * (flower2X - flower1X);
    beeY = flowerY - 120 + Math.sin(cycle * 0.25) * 20 - t * 30 + t * t * 30;
    hasPollen = true;
  } else if (cycle < 260) {
    // On flower 2 — depositing pollen
    onFlower = 2;
    const wobble = Math.sin((cycle - 200) * 0.2) * 5;
    beeX = flower2X + wobble;
    beeY = flowerY - 50 + Math.sin((cycle - 200) * 0.15) * 3;
    hasPollen = cycle < 230;
    if (cycle === 230) setPollinated(p => p + 1);
  } else {
    // Flying away
    const t = (cycle - 260) / 40;
    beeX = flower2X + t * (W - flower2X);
    beeY = flowerY - 120 - t * 80 + Math.sin(cycle * 0.3) * 10;
  }

  // Wing flap
  const wingAngle = Math.sin(tick * 0.8) * 25;

  // Pollen grains on the bee
  const pollenDots = hasPollen ? [
    { dx: -3, dy: -6 }, { dx: 2, dy: -8 }, { dx: -1, dy: -4 },
    { dx: 4, dy: -5 }, { dx: -4, dy: -7 },
  ] : [];

  // Flower petal sway
  const petalSway = Math.sin(tick * 0.04) * 3;

  // Pollen transfer indicator on flower 2
  const flower2Pollinated = cycle > 230 || pollinated > 0;

  return (
    <div className="bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-50 dark:from-sky-900 dark:via-emerald-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-pink-700 dark:text-pink-400 uppercase tracking-wider">
          The Deal: Nectar for Delivery
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-700 dark:text-amber-300 font-mono">{pollinated} pollinated</span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated pollination — bee visits flowers, carries pollen from one to another">

        {/* Ground */}
        <rect x="0" y={flowerY + 30} width={W} height={H - flowerY - 30}
          fill="#365314" opacity="0.3" />

        {/* ── Flower 1 ── */}
        <g>
          {/* Stem */}
          <line x1={flower1X} y1={flowerY + 30} x2={flower1X} y2={flowerY - 30}
            stroke="#4d7c0f" strokeWidth="4" />
          {/* Petals */}
          {[0, 1, 2, 3, 4].map(i => {
            const angle = (i * 72 + petalSway) * Math.PI / 180;
            const px = flower1X + Math.cos(angle) * 30;
            const py = (flowerY - 30) + Math.sin(angle) * 25;
            return (
              <ellipse key={`p1-${i}`} cx={px} cy={py} rx="16" ry="10"
                fill="#f472b6" opacity="0.8"
                transform={`rotate(${i * 72 + petalSway}, ${px}, ${py})`} />
            );
          })}
          {/* Center (anthers with pollen) */}
          <circle cx={flower1X} cy={flowerY - 30} r="10" fill="#fbbf24" />
          {/* Pollen on anthers (diminishes after bee visits) */}
          {(onFlower !== 1 || cycle < 90) && [0, 1, 2, 3].map(i => (
            <circle key={`ap1-${i}`}
              cx={flower1X + Math.cos(i * 1.5) * 6}
              cy={flowerY - 30 + Math.sin(i * 1.5) * 6}
              r="2" fill="#fde047" />
          ))}
          {/* Stigma */}
          <circle cx={flower1X} cy={flowerY - 35} r="3" fill="#16a34a" />
          <text x={flower1X} y={flowerY + 50} textAnchor="middle" fill="#86efac" fontSize="9">
            Flower A
          </text>
        </g>

        {/* ── Flower 2 ── */}
        <g>
          <line x1={flower2X} y1={flowerY + 30} x2={flower2X} y2={flowerY - 30}
            stroke="#4d7c0f" strokeWidth="4" />
          {[0, 1, 2, 3, 4].map(i => {
            const angle = (i * 72 - petalSway) * Math.PI / 180;
            const px = flower2X + Math.cos(angle) * 30;
            const py = (flowerY - 30) + Math.sin(angle) * 25;
            return (
              <ellipse key={`p2-${i}`} cx={px} cy={py} rx="16" ry="10"
                fill="#c084fc" opacity="0.8"
                transform={`rotate(${i * 72 - petalSway}, ${px}, ${py})`} />
            );
          })}
          <circle cx={flower2X} cy={flowerY - 30} r="10" fill="#fbbf24" />
          {/* Stigma — glows when pollinated */}
          <circle cx={flower2X} cy={flowerY - 35} r="3"
            fill={flower2Pollinated ? '#fde047' : '#16a34a'} />
          {flower2Pollinated && (
            <circle cx={flower2X} cy={flowerY - 35} r="8"
              fill="#fde047" opacity={0.2 + Math.sin(tick * 0.1) * 0.1} />
          )}
          <text x={flower2X} y={flowerY + 50} textAnchor="middle" fill="#86efac" fontSize="9">
            Flower B {flower2Pollinated ? '✓ pollinated!' : ''}
          </text>
        </g>

        {/* ── Bee ── */}
        <g transform={`translate(${beeX}, ${beeY})`}>
          {/* Wings */}
          <ellipse cx="-2" cy="-10" rx="10" ry="5" fill="#bfdbfe" opacity="0.6"
            transform={`rotate(${-wingAngle}, -2, -10)`} />
          <ellipse cx="2" cy="-10" rx="10" ry="5" fill="#bfdbfe" opacity="0.6"
            transform={`rotate(${wingAngle}, 2, -10)`} />
          {/* Body */}
          <ellipse cx="0" cy="0" rx="8" ry="6" fill="#fbbf24" />
          {/* Stripes */}
          <line x1="-4" y1="-2" x2="4" y2="-2" stroke="#1c1917" strokeWidth="2" />
          <line x1="-3" y1="2" x2="3" y2="2" stroke="#1c1917" strokeWidth="2" />
          {/* Head */}
          <circle cx="8" cy="-2" r="4" fill="#1c1917" />
          {/* Eye */}
          <circle cx="10" cy="-3" r="1.5" fill="white" />

          {/* Pollen grains on bee body */}
          {pollenDots.map((p, i) => (
            <circle key={`bp-${i}`} cx={p.dx} cy={p.dy} r="1.5"
              fill="#fde047" opacity="0.9" />
          ))}
        </g>

        {/* Flight path (dotted) */}
        {cycle > 120 && cycle < 200 && (
          <path d={`M ${flower1X},${flowerY - 60} Q ${W / 2},${flowerY - 150} ${flower2X},${flowerY - 60}`}
            fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,6" opacity="0.3" />
        )}

        {/* Step labels */}
        <g opacity="0.6">
          {onFlower === 1 && (
            <text x={flower1X} y={flowerY - 80} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">
              {cycle < 90 ? 'Drinking nectar...' : 'Covered in pollen!'}
            </text>
          )}
          {cycle > 120 && cycle < 200 && (
            <text x={W / 2} y={flowerY - 140} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">
              Carrying pollen to the next flower →
            </text>
          )}
          {onFlower === 2 && (
            <text x={flower2X} y={flowerY - 80} textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="600">
              {cycle < 230 ? 'Pollen rubs onto stigma!' : 'Pollination complete ✓'}
            </text>
          )}
        </g>

        {/* Anatomy labels on flower 1 */}
        <g opacity="0.5" fontSize="7" fill="#d1d5db">
          <text x={flower1X - 50} y={flowerY - 55}>Petals</text>
          <text x={flower1X + 25} y={flowerY - 30}>Anther (pollen)</text>
          <text x={flower1X - 45} y={flowerY - 35}>Stigma</text>
        </g>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> Bee (pollinator)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-300" /> Pollen grains
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-pink-400" /> Flower A (pollen donor)
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-400" /> Flower B (pollen receiver)
        </span>
      </div>
    </div>
  );
}
