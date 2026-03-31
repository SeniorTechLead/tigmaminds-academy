import { useState, useEffect, useRef, useCallback } from 'react';

const BEAT_COUNT = 12;

// "O" = over (loud), "U" = under (quiet)
const beats = Array.from({ length: BEAT_COUNT }, (_, i) =>
  i % 2 === 0 ? 'O' : 'U'
) as ('O' | 'U')[];

const SPEED_OPTIONS = [
  { label: 'Slow', ms: 400 },
  { label: 'Medium', ms: 200 },
  { label: 'Fast', ms: 120 },
];

export default function RhythmPlayerDiagram() {
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [speedIdx, setSpeedIdx] = useState(0); // start slow
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playTone = useCallback((freq: number, duration: number, volume: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.setTargetAtTime(0, ctx.currentTime + duration / 1000 * 0.7, 0.01);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (playing) {
      setPlaying(false);
      setCurrentBeat(-1);
      return;
    }
    // Create AudioContext on first user click
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setCurrentBeat(0);
    setPlaying(true);
  }, [playing]);

  // Advance the playhead
  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentBeat(prev => (prev + 1) % BEAT_COUNT);
    }, SPEED_OPTIONS[speedIdx].ms);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, speedIdx]);

  // Play sound when beat changes
  useEffect(() => {
    if (currentBeat < 0 || !playing) return;
    const beat = beats[currentBeat];
    if (beat === 'O') {
      playTone(200, 80, 0.35);
    } else {
      playTone(400, 40, 0.1);
    }
  }, [currentBeat, playing, playTone]);

  const w = 600, h = 290;
  const beatY = 90;
  const beatR = 16;
  const startX = 45;
  const spacing = (w - startX * 2) / (BEAT_COUNT - 1);

  const patternLabel = currentBeat >= 0
    ? beats.map((b, i) => {
        const label = b === 'O' ? 'BOOM' : 'tap';
        if (i === currentBeat) return label.toUpperCase();
        return label;
      }).join(' - ')
    : beats.map(b => (b === 'O' ? 'BOOM' : 'tap')).join(' - ');

  // Show a short window of the pattern centered on current beat
  const visibleLabel = (() => {
    if (currentBeat < 0) return 'BOOM - tap - BOOM - tap - BOOM - tap ...';
    const parts: string[] = [];
    for (let i = Math.max(0, currentBeat - 2); i <= Math.min(BEAT_COUNT - 1, currentBeat + 3); i++) {
      const b = beats[i];
      const label = b === 'O' ? 'BOOM' : 'tap';
      if (i === currentBeat) {
        parts.push(label);
      } else {
        parts.push(label.toLowerCase());
      }
    }
    return parts.join(' – ');
  })();

  return (
    <div className="bg-slate-900 rounded-xl p-4 my-4">
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Weaving Pattern as Rhythm
      </p>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label="Interactive rhythm player showing weaving pattern as musical beats"
      >
        {/* Beat labels: O and U */}
        {beats.map((b, i) => {
          const cx = startX + i * spacing;
          return (
            <text
              key={`label-${i}`}
              x={cx}
              y={beatY - 30}
              textAnchor="middle"
              fill={b === 'O' ? '#fbbf24' : '#6b7280'}
              fontSize="13"
              fontWeight="700"
              fontFamily="monospace"
            >
              {b}
            </text>
          );
        })}

        {/* Connecting line between beats */}
        <line
          x1={startX}
          y1={beatY}
          x2={startX + (BEAT_COUNT - 1) * spacing}
          y2={beatY}
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Beat circles */}
        {beats.map((b, i) => {
          const cx = startX + i * spacing;
          const isActive = i === currentBeat;
          const isOver = b === 'O';

          // Pulse size and color when active
          const r = isActive
            ? (isOver ? beatR + 6 : beatR - 2)
            : beatR;
          const fill = isActive
            ? (isOver ? '#f59e0b' : '#4b5563')
            : (isOver ? '#78350f' : '#1e293b');
          const stroke = isActive
            ? (isOver ? '#fbbf24' : '#6b7280')
            : (isOver ? '#92400e' : '#334155');
          const glowOpacity = isActive && isOver ? 0.4 : 0;

          return (
            <g key={`beat-${i}`}>
              {/* Glow for active BOOM beats */}
              {glowOpacity > 0 && (
                <circle
                  cx={cx}
                  cy={beatY}
                  r={r + 10}
                  fill={`rgba(251, 191, 36, ${glowOpacity})`}
                />
              )}
              <circle
                cx={cx}
                cy={beatY}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth="2"
              />
              {/* Beat number */}
              <text
                x={cx}
                y={beatY + 4}
                textAnchor="middle"
                fill={isActive ? '#fff' : '#94a3b8'}
                fontSize="10"
                fontWeight="600"
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Playhead line */}
        {currentBeat >= 0 && playing && (
          <line
            x1={startX + currentBeat * spacing}
            y1={beatY - 24}
            x2={startX + currentBeat * spacing}
            y2={beatY + 24}
            stroke="#fbbf24"
            strokeWidth="2"
            opacity="0.6"
          />
        )}

        {/* Pattern label below beats */}
        <text
          x={w / 2}
          y={beatY + 52}
          textAnchor="middle"
          className="fill-gray-400 dark:fill-gray-400"
          fontSize="13"
          fontWeight="600"
          fontFamily="monospace"
        >
          {visibleLabel}
        </text>

        {/* Play / Pause button */}
        <g
          onClick={handlePlayPause}
          cursor="pointer"
          role="button"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          <rect
            x={w / 2 - 48}
            y={beatY + 70}
            width={96}
            height={34}
            rx={8}
            fill={playing ? '#dc2626' : '#16a34a'}
            opacity="0.9"
          />
          {playing ? (
            <>
              {/* Pause icon */}
              <rect x={w / 2 - 9} y={beatY + 79} width={6} height={16} rx={1} fill="#fff" />
              <rect x={w / 2 + 3} y={beatY + 79} width={6} height={16} rx={1} fill="#fff" />
            </>
          ) : (
            /* Play triangle */
            <polygon
              points={`${w / 2 - 6},${beatY + 78} ${w / 2 - 6},${beatY + 96} ${w / 2 + 8},${beatY + 87}`}
              fill="#fff"
            />
          )}
          <text
            x={w / 2 + 20}
            y={beatY + 91}
            textAnchor="start"
            fill="#fff"
            fontSize="11"
            fontWeight="600"
          >
            {playing ? 'Stop' : 'Play'}
          </text>
        </g>

        {/* Speed controls */}
        {SPEED_OPTIONS.map((opt, i) => {
          const bx = w / 2 - 75 + i * 50;
          const by = beatY + 112;
          const active = i === speedIdx;
          return (
            <g key={opt.label} onClick={() => setSpeedIdx(i)} cursor="pointer" role="button" aria-label={`Speed: ${opt.label}`}>
              <rect x={bx} y={by} width={44} height={22} rx={6}
                fill={active ? '#475569' : '#1e293b'}
                stroke={active ? '#94a3b8' : '#334155'}
                strokeWidth={active ? 1.5 : 1} />
              <text x={bx + 22} y={by + 15} textAnchor="middle"
                fill={active ? '#f1f5f9' : '#64748b'}
                fontSize="10" fontWeight={active ? '700' : '500'}>
                {opt.label}
              </text>
            </g>
          );
        })}
        <text x={w / 2 - 110} y={beatY + 127} textAnchor="end" className="fill-gray-500 dark:fill-gray-500" fontSize="9">Speed:</text>

        {/* Bottom note */}
        <text x={w / 2} y={h - 2} textAnchor="middle" className="fill-gray-500 dark:fill-gray-500" fontSize="10">
          Same counting rule, two materials: bamboo strips become sound beats
        </text>
      </svg>
    </div>
  );
}
