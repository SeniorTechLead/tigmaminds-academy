import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Square, Volume2, VolumeX, CheckCircle, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { usePrefs } from '../contexts/PrefsContext';

type Mood = 'calm' | 'nervous' | 'danger';

interface RumblePattern {
  mood: Mood;
  label: string;
  description: string;
  // Audio parameters for Web Audio API synthesis
  baseFreq: number;
  pulseRate: number; // pulses per second
  duration: number; // seconds
  amplitude: number;
  // Visualization color
  color: string;
}

const patterns: RumblePattern[] = [
  {
    mood: 'calm',
    label: 'Calm & Feeding',
    description: 'Low, steady rumble — the herd is relaxed, grazing peacefully. Like a gentle hum through the earth.',
    baseFreq: 80,
    pulseRate: 0.5,
    duration: 4,
    amplitude: 0.4,
    color: '#22c55e',
  },
  {
    mood: 'nervous',
    label: 'Nervous & Alert',
    description: 'Quick, sharp pulses — something has caught their attention. The herd is on edge, ready to move.',
    baseFreq: 110,
    pulseRate: 3,
    duration: 3,
    amplitude: 0.5,
    color: '#f59e0b',
  },
  {
    mood: 'danger',
    label: 'Danger — Run!',
    description: 'A single, enormous boom through the earth followed by frantic hammering. The herd is fleeing. Get out of the way.',
    baseFreq: 55,
    pulseRate: 8,
    duration: 3,
    amplitude: 0.7,
    color: '#ef4444',
  },
];

const TOTAL_ROUNDS = 5;

function generateRound(): RumblePattern {
  return patterns[Math.floor(Math.random() * patterns.length)];
}

export default function ElephantPlayground() {
  const { soundEnabled, setSoundEnabled } = usePrefs();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'answered' | 'finished'>('intro');
  const [currentPattern, setCurrentPattern] = useState<RumblePattern | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Mood | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const stopAudio = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const playRumble = useCallback(async (pattern: RumblePattern) => {
    stopAudio();

    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    // Chrome requires resume() after user gesture
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const analyser = ctx.createAnalyser();
    analyserRef.current = analyser;
    analyser.fftSize = 256;

    // Create the rumble: low frequency oscillator with amplitude modulation
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    // Base rumble
    osc.type = 'sine';
    osc.frequency.value = pattern.baseFreq;

    // Add harmonics for richness
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = pattern.baseFreq * 2.1;
    const gain2 = ctx.createGain();
    gain2.gain.value = pattern.amplitude * 0.3;

    // Pulse modulation (LFO)
    lfo.type = 'sine';
    lfo.frequency.value = pattern.pulseRate;
    lfoGain.gain.value = pattern.amplitude * 0.5;

    // Envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(pattern.amplitude, ctx.currentTime + 0.3);
    gainNode.gain.setValueAtTime(pattern.amplitude, ctx.currentTime + pattern.duration - 0.5);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + pattern.duration);

    // For danger: add a big initial boom
    if (pattern.mood === 'danger') {
      const boom = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boom.type = 'sine';
      boom.frequency.value = 40;
      boomGain.gain.setValueAtTime(0.9, ctx.currentTime);
      boomGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      boom.connect(boomGain).connect(analyser);
      boom.start(ctx.currentTime);
      boom.stop(ctx.currentTime + 0.8);
    }

    // Connect
    lfo.connect(lfoGain).connect(gainNode.gain);
    osc.connect(gainNode).connect(analyser);
    osc2.connect(gain2).connect(analyser);
    // Only output audio if sound is enabled; always connect analyser for visualization
    if (soundEnabled) {
      analyser.connect(ctx.destination);
    }

    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    lfo.start(ctx.currentTime);
    osc.stop(ctx.currentTime + pattern.duration);
    osc2.stop(ctx.currentTime + pattern.duration);
    lfo.stop(ctx.currentTime + pattern.duration);

    setIsPlaying(true);

    // Visualize
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasCtx = canvas.getContext('2d')!;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;

        animationRef.current = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgba(17, 24, 39, 0.15)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 3;
        canvasCtx.strokeStyle = pattern.color;
        canvasCtx.shadowColor = pattern.color;
        canvasCtx.shadowBlur = 10;
        canvasCtx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) canvasCtx.moveTo(x, y);
          else canvasCtx.lineTo(x, y);
          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
        canvasCtx.shadowBlur = 0;
      };

      // Clear canvas
      canvasCtx.fillStyle = '#111827';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      draw();
    }

    // Auto-stop
    setTimeout(() => {
      setIsPlaying(false);
    }, pattern.duration * 1000);
  }, [stopAudio, soundEnabled]);

  const startGame = () => {
    setScore(0);
    setRound(1);
    const pattern = generateRound();
    setCurrentPattern(pattern);
    setSelectedAnswer(null);
    setGameState('playing');
  };

  const handleAnswer = (mood: Mood) => {
    if (!currentPattern || gameState !== 'playing') return;
    stopAudio();

    const correct = mood === currentPattern.mood;
    setSelectedAnswer(mood);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setGameState('answered');
  };

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS) {
      setGameState('finished');
      return;
    }
    setRound((r) => r + 1);
    const pattern = generateRound();
    setCurrentPattern(pattern);
    setSelectedAnswer(null);
    setGameState('playing');
  };

  const getScoreMessage = () => {
    if (score === TOTAL_ROUNDS) return 'Perfect! You hear like Rongpharpi herself.';
    if (score >= TOTAL_ROUNDS * 0.8) return 'Excellent! The elephants trust your ears.';
    if (score >= TOTAL_ROUNDS * 0.6) return 'Good! You\'re learning to listen through the earth.';
    return 'Keep practicing — the ground has more to teach you.';
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      {/* Visualization canvas */}
      <div className="relative" style={{ minHeight: gameState === 'intro' || gameState === 'finished' ? '280px' : '160px' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={160}
          className="w-full h-[160px]"
        />
        {gameState === 'intro' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Elephant Rumble Classifier</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                Listen to elephant ground vibrations and classify their mood.
                Can you read the earth like Rongpharpi?
              </p>
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition-colors"
              >
                <Play className="w-5 h-5" /> Start Listening
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="mt-3 flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors mx-auto"
              >
                {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                Sound: {soundEnabled ? 'On' : 'Off (visual only)'}
              </button>
            </div>
          </div>
        )}
        {gameState === 'finished' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{score} / {TOTAL_ROUNDS}</h3>
              <p className="text-gray-300 mb-6">{getScoreMessage()}</p>
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls area */}
      {(gameState === 'playing' || gameState === 'answered') && (
        <div className="p-6">
          {/* Round info + play button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Round {round} / {TOTAL_ROUNDS}</span>
              <div className="flex gap-1">
                {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < round - 1 ? 'bg-emerald-500' : i === round - 1 ? 'bg-amber-400' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-400">Score: {score}</span>
          </div>

          {gameState === 'playing' && (
            <>
              <button
                onClick={() => {
                  if (isPlaying) {
                    stopAudio();
                  } else if (currentPattern) {
                    playRumble(currentPattern);
                  }
                }}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl mb-6 transition-colors ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-5 h-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Play Rumble
                  </>
                )}
              </button>

              <p className="text-sm text-gray-400 text-center mb-4">What mood is the herd in?</p>

              <div className="grid grid-cols-3 gap-3">
                {patterns.map((p) => (
                  <button
                    key={p.mood}
                    onClick={() => handleAnswer(p.mood)}
                    className="py-3 px-4 rounded-xl border-2 border-gray-700 text-white font-semibold text-sm hover:border-amber-500 transition-colors"
                    style={{ borderColor: undefined }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: p.color }}
                    />
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {gameState === 'answered' && currentPattern && (
            <div className="space-y-4">
              <div className={`flex items-start gap-3 p-4 rounded-xl ${isCorrect ? 'bg-emerald-900/30 border border-emerald-800' : 'bg-red-900/30 border border-red-800'}`}>
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-white font-semibold mb-1">
                    {isCorrect ? 'Correct!' : `Not quite — it was "${currentPattern.label}"`}
                  </p>
                  <p className="text-gray-300 text-sm">{currentPattern.description}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">The Science</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {currentPattern.mood === 'calm' && 'Elephants produce infrasonic rumbles (8–20 Hz) that travel through the ground for up to 10 miles. Other elephants detect these vibrations through their feet, using specialized Pacinian corpuscles — the same pressure receptors in human fingertips.'}
                  {currentPattern.mood === 'nervous' && 'When alarmed, elephants increase their rumble rate and shift to higher frequencies. This is analogous to how a nervous person speaks faster. AI models can detect these frequency shifts in real-time from sensor data.'}
                  {currentPattern.mood === 'danger' && 'The "danger boom" is a seismic signal so powerful it registers on geological equipment. Scientists at Stanford used geophones (earthquake sensors) to detect elephants from 20 miles away — the same tech now used in AI-powered anti-poaching systems.'}
                </p>
              </div>

              <button
                onClick={nextRound}
                className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
              >
                {round >= TOTAL_ROUNDS ? 'See Results' : 'Next Rumble →'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
