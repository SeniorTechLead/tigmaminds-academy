'use client';
import { useState, useRef, useCallback } from 'react';

/**
 * Interactive frequency explorer for Arduino Basics lesson 7.
 * Students can:
 * 1. Click piano keys to hear different frequencies
 * 2. Drag a slider to sweep frequency and hear pitch change
 * 3. See the waveform change shape with frequency
 * 4. Compare real-world sounds at different frequencies
 */

const NOTES: { name: string; freq: number; color: string }[] = [
  { name: 'C4', freq: 262, color: '#ef4444' },
  { name: 'D4', freq: 294, color: '#f97316' },
  { name: 'E4', freq: 330, color: '#eab308' },
  { name: 'F4', freq: 349, color: '#22c55e' },
  { name: 'G4', freq: 392, color: '#3b82f6' },
  { name: 'A4', freq: 440, color: '#8b5cf6' },
  { name: 'B4', freq: 494, color: '#ec4899' },
  { name: 'C5', freq: 523, color: '#ef4444' },
];

const REAL_WORLD = [
  { label: 'Thunder rumble', freq: 40, emoji: '\u26c8\ufe0f' },
  { label: 'Bass guitar', freq: 80, emoji: '\ud83c\udfb8' },
  { label: 'Human voice', freq: 200, emoji: '\ud83d\udde3\ufe0f' },
  { label: 'Middle C (piano)', freq: 262, emoji: '\ud83c\udfb9' },
  { label: 'Smoke alarm', freq: 3000, emoji: '\ud83d\udea8' },
  { label: 'Mosquito buzz', freq: 600, emoji: '\ud83e\udd9f' },
  { label: 'Bird chirp', freq: 4000, emoji: '\ud83d\udc26' },
];

export default function FrequencyExplorerDiagram() {
  const [freq, setFreq] = useState(440);
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const playFreq = useCallback((f: number, duration?: number) => {
    // Create audio context on first interaction
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
      gainRef.current = audioCtxRef.current.createGain();
      gainRef.current.gain.value = 0.15;
      gainRef.current.connect(audioCtxRef.current.destination);
    }

    // Stop previous
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
    }

    const osc = audioCtxRef.current.createOscillator();
    osc.type = 'square'; // Matches piezo buzzer sound
    osc.frequency.value = f;
    osc.connect(gainRef.current!);
    osc.start();
    oscRef.current = osc;
    setPlaying(true);
    setFreq(f);

    if (duration) {
      setTimeout(() => {
        try { osc.stop(); } catch {}
        setPlaying(false);
      }, duration);
    }
  }, []);

  const stopSound = useCallback(() => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
      oscRef.current = null;
    }
    setPlaying(false);
  }, []);

  // Generate waveform SVG points
  const wavePoints = (() => {
    const w = 300, h = 60;
    const cycles = Math.min(freq / 50, 20); // More cycles for higher freq
    const pts: string[] = [];
    for (let x = 0; x <= w; x++) {
      const y = h / 2 + (h / 2 - 4) * Math.sin((x / w) * cycles * 2 * Math.PI);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  })();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900 dark:text-white font-bold text-sm">Frequency Explorer — Click to hear!</h3>
        {playing && (
          <button onClick={stopSound} className="text-xs bg-red-600 text-white px-3 py-1 rounded-full">
            Stop
          </button>
        )}
      </div>

      {/* Piano keys */}
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Tap a key — hear the frequency, see the wave change:</p>
        <div className="flex gap-1">
          {NOTES.map(note => (
            <button
              key={note.name}
              onClick={() => playFreq(note.freq, 500)}
              className="flex-1 py-3 rounded-lg text-center transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: freq === note.freq && playing ? note.color : undefined,
                color: freq === note.freq && playing ? 'white' : undefined,
              }}
            >
              <div className={`text-xs font-bold ${freq === note.freq && playing ? '' : 'text-gray-600 dark:text-gray-400'}`}>{note.name}</div>
              <div className={`text-[10px] ${freq === note.freq && playing ? '' : 'text-gray-500 dark:text-gray-500'}`}>{note.freq} Hz</div>
            </button>
          ))}
        </div>
      </div>

      {/* Waveform visualization */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
        <svg viewBox="0 0 300 60" className="w-full h-16">
          <polyline
            points={wavePoints}
            fill="none"
            stroke={playing ? '#22c55e' : '#9ca3af'}
            strokeWidth="2"
          />
          {/* Center line */}
          <line x1="0" y1="30" x2="300" y2="30" className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="0.5" strokeDasharray="4" />
        </svg>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-500">
            {playing ? `Playing: ${freq} Hz` : 'Click a key or drag the slider'}
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            {freq < 200 ? 'Low pitch' : freq < 500 ? 'Medium pitch' : freq < 1000 ? 'High pitch' : 'Very high pitch'}
          </span>
        </div>
      </div>

      {/* Frequency slider */}
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 dark:text-gray-400 w-12">20 Hz</span>
          <input
            type="range"
            min="20"
            max="2000"
            value={freq}
            onChange={e => {
              const f = parseInt(e.target.value);
              setFreq(f);
              playFreq(f);
            }}
            onMouseUp={stopSound}
            onTouchEnd={stopSound}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#22c55e' }}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 w-16 text-right">2000 Hz</span>
        </div>
        <div className="text-center mt-1">
          <span className="text-2xl font-bold font-mono text-emerald-400">{freq}</span>
          <span className="text-sm text-gray-500 dark:text-gray-500 ml-1">Hz</span>
        </div>
      </div>

      {/* Real-world sounds comparison */}
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Real-world sounds at different frequencies:</p>
        <div className="flex flex-wrap gap-1.5">
          {REAL_WORLD.map(s => (
            <button
              key={s.label}
              onClick={() => playFreq(s.freq, 600)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
              <span className="text-gray-500 dark:text-gray-500">{s.freq} Hz</span>
            </button>
          ))}
        </div>
      </div>

      {/* Arduino code equivalent */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
        <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1">Arduino equivalent</p>
        <code className="text-sm font-mono text-emerald-600 dark:text-emerald-400">
          tone(5, {freq});  <span className="text-gray-500 dark:text-gray-500">// Play {freq} Hz on pin 5</span>
        </code>
      </div>
    </div>
  );
}
