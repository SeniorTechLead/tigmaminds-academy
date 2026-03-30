import { useState, useRef, useCallback, useEffect } from 'react';

type Mood = 'calm' | 'nervous' | 'danger';

const MOODS: { key: Mood; label: string; color: string; dimColor: string; glowColor: string }[] = [
  { key: 'calm', label: 'Calm', color: '#22c55e', dimColor: '#14532d', glowColor: 'rgba(34,197,94,0.3)' },
  { key: 'nervous', label: 'Nervous', color: '#f59e0b', dimColor: '#78350f', glowColor: 'rgba(245,158,11,0.3)' },
  { key: 'danger', label: 'Danger', color: '#ef4444', dimColor: '#7f1d1d', glowColor: 'rgba(239,68,68,0.3)' },
];

const SPEEDS = [
  { label: 'Slow', rate: 0.5 },
  { label: 'Normal', rate: 1 },
  { label: 'Fast', rate: 2 },
];

// SVG elephant silhouettes for each mood
function ElephantSilhouette({ mood, color }: { mood: Mood; color: string }) {
  // All drawn in a 60x50 viewBox
  if (mood === 'calm') {
    // Relaxed: trunk hanging down, ears flat
    return (
      <g fill={color}>
        {/* Body */}
        <ellipse cx="30" cy="28" rx="16" ry="12" />
        {/* Head */}
        <circle cx="16" cy="18" r="9" />
        {/* Ear */}
        <ellipse cx="10" cy="16" rx="5" ry="7" opacity="0.7" />
        {/* Trunk hanging down */}
        <path d="M10 24 Q8 34 6 42 Q5 44 7 44 Q9 42 10 38 Q12 32 13 26" opacity="0.85" />
        {/* Legs */}
        <rect x="20" y="36" width="4" height="12" rx="2" />
        <rect x="28" y="36" width="4" height="12" rx="2" />
        <rect x="36" y="36" width="4" height="12" rx="2" />
        {/* Tail */}
        <path d="M46 26 Q50 24 52 20" stroke={color} strokeWidth="1.5" fill="none" />
      </g>
    );
  }
  if (mood === 'nervous') {
    // Ears spread, trunk raised
    return (
      <g fill={color}>
        {/* Body */}
        <ellipse cx="30" cy="28" rx="16" ry="12" />
        {/* Head */}
        <circle cx="16" cy="18" r="9" />
        {/* Ears spread wide */}
        <ellipse cx="7" cy="14" rx="7" ry="8" opacity="0.7" />
        {/* Trunk raised up */}
        <path d="M10 20 Q6 14 4 8 Q3 5 5 6 Q7 8 8 12 Q10 16 12 20" opacity="0.85" />
        {/* Legs */}
        <rect x="20" y="36" width="4" height="12" rx="2" />
        <rect x="28" y="36" width="4" height="12" rx="2" />
        <rect x="36" y="36" width="4" height="12" rx="2" />
        {/* Tail up */}
        <path d="M46 26 Q52 22 54 16" stroke={color} strokeWidth="1.5" fill="none" />
      </g>
    );
  }
  // Danger: charging posture, trunk forward
  return (
    <g fill={color}>
      {/* Body leaning forward */}
      <ellipse cx="28" cy="26" rx="17" ry="11" transform="rotate(-8 28 26)" />
      {/* Head forward and down */}
      <circle cx="13" cy="20" r="9" />
      {/* Ears flared */}
      <ellipse cx="6" cy="16" rx="7" ry="9" opacity="0.7" />
      {/* Trunk thrust forward */}
      <path d="M8 22 Q2 22 -2 24 Q-4 25 -2 26 Q0 25 4 24 Q8 24 10 24" opacity="0.85" />
      {/* Tusks */}
      <path d="M10 26 Q6 30 4 34" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Legs in motion */}
      <rect x="18" y="34" width="4" height="13" rx="2" transform="rotate(-10 20 34)" />
      <rect x="26" y="35" width="4" height="12" rx="2" />
      <rect x="34" y="34" width="4" height="13" rx="2" transform="rotate(8 36 34)" />
      <rect x="40" y="35" width="4" height="12" rx="2" />
    </g>
  );
}

// Animated waveform strip
function WaveformStrip({ active, color, dimColor, phase }: { active: boolean; color: string; dimColor: string; phase: number }) {
  const bars = 20;
  return (
    <g>
      {Array.from({ length: bars }, (_, i) => {
        const baseH = 4;
        let h = baseH;
        if (active) {
          // Sine wave pattern that moves with phase
          h = baseH + 14 * Math.abs(Math.sin((i / bars) * Math.PI * 3 + phase));
        }
        const x = i * 6;
        const y = 15 - h / 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={4}
            height={h}
            rx={1.5}
            fill={active ? color : dimColor}
            opacity={active ? 0.9 : 0.4}
          />
        );
      })}
    </g>
  );
}

export default function ElephantRumblePlayerDiagram() {
  const [activeMood, setActiveMood] = useState<Mood | null>(null);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [wavePhase, setWavePhase] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<{ oscillators: OscillatorNode[]; gains: GainNode[] } | null>(null);
  const animFrameRef = useRef<number>(0);
  const playStartRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopSound = useCallback(() => {
    if (activeNodesRef.current) {
      const { oscillators, gains } = activeNodesRef.current;
      const ctx = audioCtxRef.current;
      if (ctx) {
        gains.forEach(g => {
          try { g.gain.setTargetAtTime(0, ctx.currentTime, 0.02); } catch { /* already stopped */ }
        });
        setTimeout(() => {
          oscillators.forEach(o => { try { o.stop(); } catch { /* already stopped */ } });
        }, 100);
      }
      activeNodesRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Animate waveform while playing
  useEffect(() => {
    if (activeMood === null) return;
    const speed = SPEEDS[speedIdx].rate;
    let running = true;
    const animate = () => {
      if (!running) return;
      const elapsed = (performance.now() - playStartRef.current) / 1000;
      setWavePhase(elapsed * 6 * speed);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    playStartRef.current = performance.now();
    animate();
    return () => { running = false; cancelAnimationFrame(animFrameRef.current); };
  }, [activeMood, speedIdx]);

  const playMood = useCallback((mood: Mood) => {
    // Stop any current playback
    stopSound();

    if (activeMood === mood) {
      // Toggle off
      setActiveMood(null);
      return;
    }

    // Ensure AudioContext
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const speed = SPEEDS[speedIdx].rate;
    const duration = 3 / speed; // Adjusted for playback speed
    const now = ctx.currentTime;
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    if (mood === 'calm') {
      // 80 Hz base, amplitude modulated at 0.5 Hz (slow breathing)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 80 * speed;

      const mainGain = ctx.createGain();
      mainGain.gain.value = 0.5;

      // AM: LFO controlling gain
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.5 * speed;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.3;

      lfo.connect(lfoGain);
      lfoGain.connect(mainGain.gain);

      osc.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc.start(now);
      lfo.start(now);
      osc.stop(now + duration);
      lfo.stop(now + duration);

      oscillators.push(osc, lfo);
      gains.push(mainGain);
    } else if (mood === 'nervous') {
      // 110 Hz base, amplitude modulated at 3 Hz (rapid pulsing)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 110 * speed;

      const mainGain = ctx.createGain();
      mainGain.gain.value = 0.45;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 3 * speed;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.35;

      lfo.connect(lfoGain);
      lfoGain.connect(mainGain.gain);

      osc.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc.start(now);
      lfo.start(now);
      osc.stop(now + duration);
      lfo.stop(now + duration);

      oscillators.push(osc, lfo);
      gains.push(mainGain);
    } else {
      // Danger: 40 Hz boom decaying, then 55 Hz at 8 Hz modulation
      // Phase 1: boom
      const boom = ctx.createOscillator();
      boom.type = 'sine';
      boom.frequency.value = 40 * speed;

      const boomGain = ctx.createGain();
      boomGain.gain.setValueAtTime(0.7, now);
      boomGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8 / speed);

      boom.connect(boomGain);
      boomGain.connect(ctx.destination);
      boom.start(now);
      boom.stop(now + 1 / speed);

      // Phase 2: rapid pulsing rumble
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 55 * speed;

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(0.5, now + 0.5 / speed);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 8 * speed;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.4;

      lfo.connect(lfoGain);
      lfoGain.connect(mainGain.gain);

      osc.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc.start(now + 0.3 / speed);
      lfo.start(now + 0.3 / speed);
      osc.stop(now + duration);
      lfo.stop(now + duration);

      oscillators.push(boom, osc, lfo);
      gains.push(boomGain, mainGain);
    }

    activeNodesRef.current = { oscillators, gains };
    setActiveMood(mood);

    // Auto-stop after duration
    timeoutRef.current = setTimeout(() => {
      activeNodesRef.current = null;
      setActiveMood(null);
    }, duration * 1000);
  }, [activeMood, speedIdx, stopSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);

  const w = 460;
  const rowH = 70;
  const topPad = 10;
  const rowGap = 8;
  const totalRows = MOODS.length;
  const controlsY = topPad + totalRows * (rowH + rowGap) + 4;
  const h = controlsY + 68;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Elephant Rumble Player
        </p>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          role="img"
          aria-label="Interactive elephant rumble player showing calm, nervous, and danger moods"
        >
          {MOODS.map((mood, idx) => {
            const y = topPad + idx * (rowH + rowGap);
            const isActive = activeMood === mood.key;
            const isDimmed = activeMood !== null && !isActive;
            const rowOpacity = isDimmed ? 0.35 : 1;

            return (
              <g key={mood.key} opacity={rowOpacity}>
                {/* Row background highlight */}
                {isActive && (
                  <rect
                    x={2}
                    y={y}
                    width={w - 4}
                    height={rowH}
                    rx={10}
                    fill={mood.glowColor}
                  />
                )}
                {/* Row border */}
                <rect
                  x={2}
                  y={y}
                  width={w - 4}
                  height={rowH}
                  rx={10}
                  fill="none"
                  stroke={isActive ? mood.color : '#334155'}
                  strokeWidth={isActive ? 1.5 : 0.5}
                />

                {/* Mood label */}
                <text
                  x={14}
                  y={y + 16}
                  fill={isActive ? mood.color : '#94a3b8'}
                  fontSize="11"
                  fontWeight="700"
                >
                  {mood.label}
                </text>

                {/* Elephant silhouette */}
                <g transform={`translate(14, ${y + 18}) scale(0.85)`}>
                  <ElephantSilhouette mood={mood.key} color={isActive ? mood.color : '#475569'} />
                </g>

                {/* Waveform strip */}
                <g transform={`translate(90, ${y + 20})`}>
                  <WaveformStrip
                    active={isActive}
                    color={mood.color}
                    dimColor={mood.dimColor}
                    phase={isActive ? wavePhase * (mood.key === 'calm' ? 0.5 : mood.key === 'nervous' ? 3 : 8) : 0}
                  />
                </g>

                {/* Frequency info */}
                <text
                  x={230}
                  y={y + 16}
                  fill={isActive ? '#d1d5db' : '#4b5563'}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {mood.key === 'calm' && '80 Hz · 0.5 Hz pulse'}
                  {mood.key === 'nervous' && '110 Hz · 3 Hz pulse'}
                  {mood.key === 'danger' && '40 Hz boom → 55 Hz · 8 Hz pulse'}
                </text>

                {/* Play button */}
                <g
                  onClick={() => playMood(mood.key)}
                  cursor="pointer"
                  role="button"
                  aria-label={`Play ${mood.label} rumble`}
                >
                  <circle
                    cx={w - 40}
                    cy={y + rowH / 2}
                    r={20}
                    fill={isActive ? mood.color : '#1e293b'}
                    stroke={isActive ? mood.color : '#475569'}
                    strokeWidth={1.5}
                  />
                  {isActive ? (
                    <>
                      {/* Stop icon (square) */}
                      <rect
                        x={w - 48}
                        y={y + rowH / 2 - 8}
                        width={16}
                        height={16}
                        rx={2}
                        fill="#fff"
                      />
                    </>
                  ) : (
                    /* Play triangle */
                    <polygon
                      points={`${w - 46},${y + rowH / 2 - 10} ${w - 46},${y + rowH / 2 + 10} ${w - 30},${y + rowH / 2}`}
                      fill="#d1d5db"
                    />
                  )}
                </g>
              </g>
            );
          })}

          {/* Speed controls */}
          <text
            x={w / 2 - 100}
            y={controlsY + 14}
            fill="#6b7280"
            fontSize="10"
            fontWeight="600"
          >
            Speed:
          </text>
          {SPEEDS.map((s, i) => {
            const bx = w / 2 - 55 + i * 58;
            const by = controlsY + 2;
            const active = i === speedIdx;
            return (
              <g
                key={s.label}
                onClick={() => setSpeedIdx(i)}
                cursor="pointer"
                role="button"
                aria-label={`Speed: ${s.label}`}
              >
                <rect
                  x={bx}
                  y={by}
                  width={50}
                  height={22}
                  rx={6}
                  fill={active ? '#475569' : '#1e293b'}
                  stroke={active ? '#94a3b8' : '#334155'}
                  strokeWidth={active ? 1.5 : 1}
                />
                <text
                  x={bx + 25}
                  y={by + 15}
                  textAnchor="middle"
                  fill={active ? '#f1f5f9' : '#64748b'}
                  fontSize="10"
                  fontWeight={active ? '700' : '500'}
                >
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* Bottom text */}
          <text
            x={w / 2}
            y={controlsY + 40}
            textAnchor="middle"
            className="fill-gray-500 dark:fill-slate-400"
            fontSize="11"
            fontWeight="600"
          >
            Same elephant, different moods — listen for the pulse rate
          </text>

          {/* Headphone note */}
          <text
            x={w / 2}
            y={controlsY + 56}
            textAnchor="middle"
            fill="#4b5563"
            fontSize="9"
          >
            🎧 Use headphones for best effect — these are very low frequencies
          </text>
        </svg>
      </div>
    </div>
  );
}
