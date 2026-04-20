import { useState, useEffect } from 'react';

// ── A Thought, in Motion ─────────────────────────────────────
// Animated action potential traveling along a neuron's axon.
// Click the cell body to fire a signal. Electrical impulse
// (yellow spark) travels along axon, jumps between myelin
// sheaths (saltatory conduction), releases neurotransmitters
// at synapse to the next neuron.

interface Spike {
  id: number;
  progress: number; // 0 (soma) to 1 (synapse)
  age: number;
}

let spikeId = 0;

export default function NeuronDiagram() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [spikes, setSpikes] = useState<Spike[]>([]);
  const [neurotransmitters, setNeurotransmitters] = useState<{ id: number; x: number; y: number; age: number }[]>([]);
  const [firedCount, setFiredCount] = useState(0);
  let ntId = 0;

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTick(t => t + 1), 30);
    return () => clearInterval(interval);
  }, [paused]);

  // Auto-fire every 180 ticks
  useEffect(() => {
    if (paused) return;
    if (tick % 180 === 0 && tick > 0) {
      fire();
    }
  }, [tick, paused]);

  const fire = () => {
    setSpikes(s => [...s, { id: spikeId++, progress: 0, age: 0 }]);
    setFiredCount(f => f + 1);
  };

  // Axon path — from soma (left) to synapse (right). Myelinated with gaps.
  const somaX = 90, somaY = 175;
  const axonStartX = 140, axonEndX = 450;
  const synapseX = 475, synapseY = 175;

  // Myelin sheaths along the axon (each with a Node of Ranvier gap)
  const myelinSheaths = [
    { x: 165, width: 40 },
    { x: 215, width: 40 },
    { x: 265, width: 40 },
    { x: 315, width: 40 },
    { x: 365, width: 40 },
    { x: 415, width: 30 },
  ];

  useEffect(() => {
    if (paused) return;

    setSpikes(prev => {
      return prev
        .map(s => {
          // Speed up at nodes of Ranvier (saltatory conduction)
          const pxPos = axonStartX + s.progress * (axonEndX - axonStartX);
          let atNode = true;
          for (const sh of myelinSheaths) {
            if (pxPos >= sh.x && pxPos <= sh.x + sh.width) {
              atNode = false;
              break;
            }
          }
          const speed = atNode ? 0.025 : 0.012;
          return { ...s, progress: s.progress + speed, age: s.age + 1 };
        })
        .filter(s => {
          if (s.progress >= 1) {
            // Release neurotransmitters at synapse
            setNeurotransmitters(nts => [
              ...nts,
              ...Array.from({ length: 4 }, (_, i) => ({
                id: ntId++,
                x: synapseX + Math.cos(i * 1.57) * 3,
                y: synapseY + Math.sin(i * 1.57) * 3,
                age: 0,
              })),
            ]);
            return false;
          }
          return true;
        });
    });

    setNeurotransmitters(prev => prev
      .map(n => ({ ...n, x: n.x + 0.8, y: n.y + (n.id % 2 === 0 ? 0.3 : -0.3), age: n.age + 1 }))
      .filter(n => n.age < 50));

  }, [tick, paused]);

  const W = 560, H = 350;

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-purple-50 to-slate-50 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
          A Thought, in Motion
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-purple-700 dark:text-purple-300 font-mono">
            {firedCount} action potentials
          </span>
          <button
            onClick={fire}
            className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/30 transition"
          >
            ⚡ Fire
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto cursor-pointer" role="img"
        onClick={fire}
        aria-label="Animated neuron — click to fire an action potential traveling down the axon">

        {/* ── Dendrites (left side, receiving signals) ── */}
        {[0, 1, 2, 3, 4].map(i => {
          const angle = (-120 + i * 20) * Math.PI / 180;
          return (
            <line key={`dend-${i}`}
              x1={somaX} y1={somaY}
              x2={somaX + Math.cos(angle) * 60}
              y2={somaY + Math.sin(angle) * 60}
              stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          );
        })}
        {/* Smaller dendrite branches */}
        {[0, 1, 2, 3, 4].map(i => {
          const angle = (-120 + i * 20) * Math.PI / 180;
          const px = somaX + Math.cos(angle) * 60;
          const py = somaY + Math.sin(angle) * 60;
          return (
            <g key={`db-${i}`}>
              <line x1={px} y1={py} x2={px - 15} y2={py - 10}
                stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
              <line x1={px} y1={py} x2={px - 12} y2={py + 8}
                stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
            </g>
          );
        })}
        <text x="15" y="100" className="fill-purple-700 dark:fill-purple-300" fontSize="9" fontWeight="600">Dendrites</text>
        <text x="15" y="112" className="fill-gray-500 dark:fill-gray-400" fontSize="7">(inputs)</text>

        {/* ── Soma (cell body) ── */}
        <circle cx={somaX} cy={somaY} r={25}
          fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="2" opacity="0.85" />
        <circle cx={somaX} cy={somaY} r={8}
          fill="#7c3aed" opacity="0.7" />
        <text x={somaX} y={somaY + 40} textAnchor="middle" className="fill-purple-800 dark:fill-purple-200" fontSize="9" fontWeight="600">
          Soma
        </text>

        {/* ── Axon (the long wire) ── */}
        <line x1={axonStartX} y1={somaY} x2={axonEndX} y2={somaY}
          stroke="#fbcfe8" strokeWidth="4" opacity="0.6" />

        {/* Myelin sheaths (fatty insulation) */}
        {myelinSheaths.map((sh, i) => (
          <g key={`myelin-${i}`}>
            <rect x={sh.x} y={somaY - 8} width={sh.width} height={16} rx={8}
              fill="#fed7aa" stroke="#fb923c" strokeWidth="1.5" opacity="0.85" />
          </g>
        ))}

        {/* Nodes of Ranvier (gaps) */}
        {myelinSheaths.slice(0, -1).map((sh, i) => {
          const nx = sh.x + sh.width;
          const next = myelinSheaths[i + 1];
          const gapW = next.x - nx;
          return (
            <rect key={`node-${i}`} x={nx} y={somaY - 3} width={gapW} height={6} rx={3}
              fill="#fbbf24" opacity="0.7" />
          );
        })}

        <text x={255} y={205} textAnchor="middle" className="fill-orange-700 dark:fill-orange-300" fontSize="9" fontWeight="600">
          Myelin sheaths
        </text>
        <text x={255} y={217} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">
          (signal jumps node to node)
        </text>

        {/* ── Spikes (action potentials traveling) ── */}
        {spikes.map(s => {
          const x = axonStartX + s.progress * (axonEndX - axonStartX);
          return (
            <g key={s.id}>
              <circle cx={x} cy={somaY} r="14" fill="#fde047" opacity="0.4" />
              <circle cx={x} cy={somaY} r="8" fill="#facc15" opacity="0.8" />
              <circle cx={x} cy={somaY} r="4" fill="#fef9c3" opacity="1" />
              {/* Lightning trail */}
              <line x1={x - 20} y1={somaY - 2} x2={x - 5} y2={somaY + 2}
                stroke="#fde047" strokeWidth="2" opacity="0.5" />
            </g>
          );
        })}

        {/* ── Axon terminal / synapse ── */}
        <g>
          {[0, 1, 2].map(i => (
            <circle key={`term-${i}`}
              cx={axonEndX + 15 + i * 8}
              cy={somaY + (i - 1) * 12}
              r="8" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1.5" opacity="0.85" />
          ))}
        </g>

        {/* Synapse gap */}
        <line x1={axonEndX + 40} y1={somaY - 30} x2={axonEndX + 40} y2={somaY + 30}
          stroke="#f472b6" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />

        {/* Next neuron (partial, receiving) */}
        <circle cx={axonEndX + 75} cy={somaY} r={18}
          fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="2" opacity="0.6" />

        <text x={axonEndX + 10} y={245} className="fill-pink-700 dark:fill-pink-300" fontSize="9" fontWeight="600">
          Synapse
        </text>

        {/* Neurotransmitters crossing synapse */}
        {neurotransmitters.map(n => (
          <circle key={n.id} cx={n.x} cy={n.y} r="2" fill="#ec4899"
            opacity={1 - n.age / 50} />
        ))}

        {/* Click instruction */}
        <text x={W / 2} y={H - 10} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          Click anywhere to fire • Signal travels at ~120 m/s • Repeats automatically
        </text>

        {/* Voltage graph inline */}
        <g transform="translate(40, 280)">
          <rect x={0} y={-5} width={W - 80} height={30} fill="none"
            stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" opacity="0.3" />
          <text x="0" y={-10} className="fill-gray-500 dark:fill-gray-400" fontSize="7">-70 mV (resting)</text>
          <text x="0" y={22} className="fill-gray-500 dark:fill-gray-400" fontSize="7">+40 mV (firing)</text>
          {spikes.length > 0 && (
            <circle
              cx={spikes[0].progress * (W - 80)}
              cy={spikes[0].progress > 0.02 && spikes[0].progress < 0.95 ? -2 : 20}
              r="2" fill="#facc15" />
          )}
        </g>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-400" /> Soma / dendrites
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-300" /> Myelin insulation
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" /> Action potential
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-pink-500" /> Neurotransmitters
        </span>
      </div>
    </div>
  );
}
