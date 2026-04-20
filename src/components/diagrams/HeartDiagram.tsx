import { useState, useEffect } from 'react';

// ── A Beating Heart ──────────────────────────────────────────
// The heart contracts and relaxes. Blood particles flow through
// chambers, valves snap open/shut, and you can see oxygenated
// (red) and deoxygenated (blue) blood take separate paths.

interface BloodCell {
  id: number;
  x: number;
  y: number;
  oxygenated: boolean;
  pathIndex: number; // which waypoint it's heading toward
  speed: number;
  age: number;
}

let cellId = 0;

// Waypoints define the two circulation loops
const DEOXY_PATH: [number, number][] = [
  [120, 100],   // 0: enter SVC
  [155, 178],   // 1: right atrium top
  [205, 210],   // 2: right atrium center
  [205, 280],   // 3: through tricuspid
  [205, 340],   // 4: right ventricle center
  [180, 290],   // 5: up toward pulmonary
  [175, 200],   // 6: pulmonary artery
  [190, 115],   // 7: to lungs (exit)
];

const OXY_PATH: [number, number][] = [
  [440, 110],   // 0: enter pulmonary vein
  [410, 178],   // 1: left atrium top
  [355, 210],   // 2: left atrium center
  [355, 280],   // 3: through mitral
  [355, 340],   // 4: left ventricle center
  [375, 290],   // 5: up toward aorta
  [370, 200],   // 6: aorta
  [350, 110],   // 7: to body (exit)
];

export default function HeartDiagram() {
  const [tick, setTick] = useState(0);
  const [cells, setCells] = useState<BloodCell[]>([]);
  const [paused, setPaused] = useState(false);

  // Beat cycle: 0–100. Systole (contraction) = 0–40, Diastole (relaxation) = 40–100
  const beatPhase = tick % 100;
  const isSystole = beatPhase < 40;

  // Heart scale for beat effect
  const beatScale = isSystole
    ? 1 - Math.sin((beatPhase / 40) * Math.PI) * 0.03
    : 1 + Math.sin(((beatPhase - 40) / 60) * Math.PI * 0.5) * 0.015;

  // Valve states
  const avValvesOpen = !isSystole; // AV valves open during diastole (filling)
  const slValvesOpen = isSystole;  // Semilunar valves open during systole (ejection)

  // BPM display
  const bpm = 72;

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 25);
    return () => clearInterval(interval);
  }, [paused]);

  // Spawn and move blood cells
  useEffect(() => {
    if (paused) return;

    setCells(prev => {
      const next: BloodCell[] = [];

      // Spawn new cells at entry points
      if (tick % 12 === 0) {
        next.push({
          id: cellId++, oxygenated: false, pathIndex: 0,
          x: DEOXY_PATH[0][0] + (Math.random() - 0.5) * 10,
          y: DEOXY_PATH[0][1],
          speed: 0.8 + Math.random() * 0.4, age: 0,
        });
        next.push({
          id: cellId++, oxygenated: true, pathIndex: 0,
          x: OXY_PATH[0][0] + (Math.random() - 0.5) * 10,
          y: OXY_PATH[0][1],
          speed: 0.8 + Math.random() * 0.4, age: 0,
        });
      }

      for (const cell of prev) {
        const path = cell.oxygenated ? OXY_PATH : DEOXY_PATH;
        if (cell.pathIndex >= path.length) continue; // exited

        const target = path[cell.pathIndex];
        const dx = target[0] - cell.x;
        const dy = target[1] - cell.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Gate logic: cells wait at valves
        const atAVValve = cell.pathIndex === 3;
        const atSLValve = cell.pathIndex === 5;
        const blocked = (atAVValve && !avValvesOpen) || (atSLValve && !slValvesOpen);

        if (blocked) {
          next.push({ ...cell, age: cell.age + 1 });
          continue;
        }

        // Speed boost during systole for cells past the valve
        const speedMul = (isSystole && cell.pathIndex >= 5) ? 2.0 : 1.0;

        if (dist < 4) {
          // Reached waypoint
          next.push({ ...cell, pathIndex: cell.pathIndex + 1, age: cell.age + 1 });
        } else {
          const moveSpeed = cell.speed * speedMul;
          next.push({
            ...cell,
            x: cell.x + (dx / dist) * moveSpeed,
            y: cell.y + (dy / dist) * moveSpeed,
            age: cell.age + 1,
          });
        }
      }

      // Cap total cells
      const all = [...prev.filter(c => {
        const path = c.oxygenated ? OXY_PATH : DEOXY_PATH;
        return c.pathIndex < path.length && c.age < 500;
      }).map(c => {
        // Apply same movement logic (simplified: just keep them)
        const path = c.oxygenated ? OXY_PATH : DEOXY_PATH;
        if (c.pathIndex >= path.length) return null;
        const target = path[c.pathIndex];
        const dx = target[0] - c.x;
        const dy = target[1] - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const atAVValve = c.pathIndex === 3;
        const atSLValve = c.pathIndex === 5;
        const blocked = (atAVValve && !avValvesOpen) || (atSLValve && !slValvesOpen);
        if (blocked) return { ...c, age: c.age + 1 };
        const speedMul = (isSystole && c.pathIndex >= 5) ? 2.0 : 1.0;
        if (dist < 4) return { ...c, pathIndex: c.pathIndex + 1, age: c.age + 1 };
        return {
          ...c,
          x: c.x + (dx / dist) * c.speed * speedMul,
          y: c.y + (dy / dist) * c.speed * speedMul,
          age: c.age + 1,
        };
      }).filter(Boolean) as BloodCell[], ...next];

      return all.slice(-80); // keep max 80 cells
    });
  }, [tick, paused, avValvesOpen, slValvesOpen, isSystole]);

  // Heartbeat indicator
  const pulseOpacity = isSystole ? 0.8 + Math.sin((beatPhase / 40) * Math.PI) * 0.2 : 0.5;

  return (
    <div className="bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">
          A Beating Heart
        </p>
        <div className="flex items-center gap-3">
          {/* Heartbeat indicator */}
          <span className="flex items-center gap-1.5 text-xs text-rose-300 font-mono">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 transition-opacity"
              style={{ opacity: pulseOpacity }}
            />
            {bpm} bpm
          </span>
          <span className="text-xs text-gray-500">
            {isSystole ? 'SQUEEZE' : 'FILL'}
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 hover:bg-white/20 transition"
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <svg
        viewBox="0 0 560 520"
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label="Animated beating heart showing blood flow through four chambers"
      >
        <defs>
          <marker id="hb-arrow-red" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#ef4444" />
          </marker>
          <marker id="hb-arrow-blue" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#3b82f6" />
          </marker>
          <filter id="heartGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Heart shape — scales with beat */}
        <g transform={`translate(280, 280) scale(${beatScale}) translate(-280, -280)`}>
          {/* Outer heart */}
          <path
            d="M 280,440 C 160,395 75,295 95,210 C 105,155 150,120 200,120 C 238,120 260,142 280,165
               C 300,142 322,120 360,120 C 410,120 455,155 465,210 C 485,295 400,395 280,440 Z"
            fill="#4a1020"
            stroke="#be123c"
            strokeWidth="3"
            filter="url(#heartGlow)"
          />

          {/* Septum */}
          <line x1="280" y1="155" x2="280" y2="415" stroke="#7f1d1d" strokeWidth="4" />
          <line x1="280" y1="155" x2="280" y2="415" stroke="#be123c" strokeWidth="1.5" />

          {/* AV boundary */}
          <path d="M 130,265 Q 205,282 280,265 Q 355,282 430,265" fill="none" stroke="#7f1d1d" strokeWidth="3" />

          {/* ── Chambers ── */}
          {/* Right atrium */}
          <rect x="145" y="175" width="120" height="75" rx="12"
            fill={isSystole ? '#1e3a5f' : '#1e40af'}
            opacity="0.6" />
          <text x="205" y="205" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">Right</text>
          <text x="205" y="220" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">Atrium</text>

          {/* Right ventricle */}
          <rect x="145" y="290" width="120" height="105" rx="12"
            fill={isSystole ? '#1e40af' : '#1e3a5f'}
            opacity="0.6" />
          <text x="205" y="340" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">Right</text>
          <text x="205" y="356" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">Ventricle</text>

          {/* Left atrium */}
          <rect x="295" y="175" width="120" height="75" rx="12"
            fill={isSystole ? '#4a1020' : '#991b1b'}
            opacity="0.6" />
          <text x="355" y="205" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">Left</text>
          <text x="355" y="220" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">Atrium</text>

          {/* Left ventricle */}
          <rect x="295" y="290" width="120" height="105" rx="12"
            fill={isSystole ? '#991b1b' : '#4a1020'}
            opacity="0.6" />
          <text x="355" y="340" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">Left</text>
          <text x="355" y="356" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">Ventricle</text>

          {/* ── Valves ── */}
          {/* Tricuspid valve */}
          <path
            d={avValvesOpen
              ? 'M 175,268 L 205,278 L 235,268'   // open — V shape
              : 'M 175,272 L 205,272 L 235,272'}   // closed — flat
            fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round"
          />
          <text x="205" y="260" textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="600">
            Tricuspid {avValvesOpen ? '○' : '●'}
          </text>

          {/* Mitral valve */}
          <path
            d={avValvesOpen
              ? 'M 325,268 L 355,278 L 385,268'
              : 'M 325,272 L 355,272 L 385,272'}
            fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round"
          />
          <text x="355" y="260" textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="600">
            Mitral {avValvesOpen ? '○' : '●'}
          </text>

          {/* ── Blood vessels ── */}
          {/* Superior vena cava */}
          <path d="M 120,85 L 120,130 Q 120,160 155,178" fill="none" stroke="#3b82f6" strokeWidth="6" opacity="0.7" />
          <text x="50" y="82" fill="#60a5fa" fontSize="10" fontWeight="600">Superior</text>
          <text x="50" y="95" fill="#60a5fa" fontSize="10" fontWeight="600">vena cava</text>

          {/* Inferior vena cava */}
          <path d="M 130,460 L 130,425 Q 130,405 158,393" fill="none" stroke="#3b82f6" strokeWidth="6" opacity="0.7" />
          <text x="50" y="465" fill="#60a5fa" fontSize="10" fontWeight="600">Inferior</text>
          <text x="50" y="478" fill="#60a5fa" fontSize="10" fontWeight="600">vena cava</text>

          {/* Pulmonary artery */}
          <path d="M 180,290 Q 155,170 190,115 L 220,100" fill="none" stroke="#3b82f6" strokeWidth="5" opacity="0.7" />
          <text x="195" y="88" fill="#60a5fa" fontSize="10" fontWeight="600">→ Lungs</text>

          {/* Pulmonary vein */}
          <path d="M 460,100 L 425,120 Q 415,155 410,178" fill="none" stroke="#ef4444" strokeWidth="5" opacity="0.7" />
          <text x="440" y="88" fill="#fca5a5" fontSize="10" fontWeight="600">← Lungs</text>

          {/* Aorta */}
          <path d="M 355,290 Q 380,180 365,125 L 335,105" fill="none" stroke="#ef4444" strokeWidth="6" opacity="0.7" />
          <text x="345" y="95" fill="#fca5a5" fontSize="10" fontWeight="600">Aorta → Body</text>
        </g>

        {/* ── Blood cells (particles) ── */}
        {cells.map(cell => {
          const path = cell.oxygenated ? OXY_PATH : DEOXY_PATH;
          if (cell.pathIndex >= path.length) return null;
          const color = cell.oxygenated ? '#ef4444' : '#3b82f6';
          const glow = cell.oxygenated ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)';
          return (
            <g key={cell.id}>
              <circle cx={cell.x} cy={cell.y} r="5" fill={glow} />
              <circle cx={cell.x} cy={cell.y} r="3" fill={color} opacity="0.9" />
            </g>
          );
        })}

        {/* Bottom annotation */}
        <text x="280" y="505" textAnchor="middle" fill="#6b7280" fontSize="10">
          Blue cells = deoxygenated (heading to lungs) · Red cells = oxygenated (heading to body)
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" />
          Deoxygenated blood
        </span>
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
          Oxygenated blood
        </span>
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-500" />
          Valves open/close with each beat
        </span>
      </div>
    </div>
  );
}
