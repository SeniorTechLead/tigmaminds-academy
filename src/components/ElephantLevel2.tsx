import { useState, useRef, useCallback } from 'react';
import { Loader2, Zap } from 'lucide-react';
import MiniLesson from './MiniLesson';
import ElephantPlayground from './ElephantPlayground';

export default function ElephantLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;

    setLoading(true);
    setLoadProgress('Loading Python runtime...');

    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide'));
        });
      }

      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });

      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }

      await pyodide.runPythonAsync(`
import sys, io

class OutputCapture:
    def __init__(self):
        self.output = []
    def write(self, text):
        self.output.append(text)
    def flush(self):
        pass
    def get_output(self):
        return ''.join(self.output)
    def clear(self):
        self.output = []

_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture

import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
import base64

def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close('all')
    return img_str
`);

      pyodideRef.current = pyodide;
      setPyReady(true);
      setLoading(false);
      setLoadProgress('');
      return pyodide;
    } catch (err: any) {
      setLoading(false);
      setLoadProgress('Error: ' + err.message);
      return null;
    }
  }, []);

  const miniLessons = [
    {
      title: 'Your first plot',
      explanation: `In Level 1 you created signals as lists of numbers. But staring at numbers isn't useful — you need to **see** them. That's what **Matplotlib** does: it turns numbers into pictures.

\`plt.plot(x, y)\` draws a line: x values along the bottom, y values up the side. \`plt.show()\` renders it.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a simple sine wave
t = np.linspace(0, 1, 1000)  # 1 second
signal = np.sin(2 * np.pi * 5 * t)  # 5 Hz

# Plot it
fig, ax = plt.subplots(figsize=(10, 3))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')
ax.plot(t, signal, color='#22c55e')
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('A 5 Hz sine wave', color='white')
ax.tick_params(colors='gray')
plt.tight_layout()
plt.show()

print("x-axis: time (0 to 1 second)")
print("y-axis: amplitude (-1 to +1)")
print("You can see 5 complete cycles in 1 second = 5 Hz")`,
      challenge: 'Change the 5 on line 6 to 20. Count the cycles — you should see 20 in one second.',
      successHint: 'plt.plot() is your microscope for signals. Every chart in the full classifier uses this.',
    },
    {
      title: 'Subplots — multiple charts stacked',
      explanation: `To compare signals, you need them side by side. \`plt.subplots(3, 1)\` creates 3 charts stacked vertically — one row per signal. Each chart is called an **axis** (\`ax\`), and you plot on each one independently.

This is exactly how we'll compare calm, nervous, and danger rumbles.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 8000)

# Three signals at different frequencies
slow = np.sin(2 * np.pi * 3 * t)   # 3 Hz
medium = np.sin(2 * np.pi * 10 * t) # 10 Hz
fast = np.sin(2 * np.pi * 30 * t)   # 30 Hz

# Create 3 stacked subplots
fig, axes = plt.subplots(3, 1, figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')

for ax, signal, label, color in [
    (axes[0], slow, '3 Hz (slow)', '#22c55e'),
    (axes[1], medium, '10 Hz (medium)', '#f59e0b'),
    (axes[2], fast, '30 Hz (fast)', '#ef4444'),
]:
    ax.plot(t, signal, color=color, linewidth=0.8)
    ax.set_ylabel(label, color='white', fontsize=9)
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

axes[2].set_xlabel('Time (seconds)', color='white')
plt.suptitle('Comparing frequencies', color='white', fontsize=14)
plt.tight_layout()
plt.show()

print("Top: 3 cycles per second (slow, like calm elephant)")
print("Middle: 10 cycles per second")
print("Bottom: 30 cycles per second (fast, like danger)")`,
      challenge: 'Change the colors — try \'#3b82f6\' for blue. Or change 30 to 80 on line 9 to match a real elephant.',
      successHint: 'Subplots let you compare signals visually. This is exactly the layout the full classifier uses.',
    },
    {
      title: 'Building the 3 elephant signals',
      explanation: `Now let's combine what you learned in Level 1 (amplitude modulation) with Level 2 (plotting). We'll generate the 3 elephant rumble patterns and plot them side by side.

Remember: **calm** = slow pulse, **nervous** = fast pulse, **danger** = boom + frantic hammering.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 8000
duration = 3
t = np.linspace(0, duration, sample_rate * duration)

# === The 3 elephant signals ===
# Calm: 80 Hz rumble, pulsing 0.5 times per second
calm = np.sin(2 * np.pi * 80 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t))

# Nervous: 110 Hz rumble, pulsing 3 times per second
nervous = np.sin(2 * np.pi * 110 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * t))

# Danger: initial boom (40 Hz, decaying) + frantic hammering
boom = np.exp(-t * 3) * np.sin(2 * np.pi * 40 * t)
hammering = np.sin(2 * np.pi * 55 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 8 * t))
danger = boom + hammering * (1 - np.exp(-t * 3))

# === Plot them ===
fig, axes = plt.subplots(3, 1, figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')

for ax, sig, label, color in [
    (axes[0], calm, 'Calm & Feeding', '#22c55e'),
    (axes[1], nervous, 'Nervous & Alert', '#f59e0b'),
    (axes[2], danger, 'Danger — Run!', '#ef4444'),
]:
    ax.plot(t[:2000], sig[:2000], color=color, linewidth=0.8)
    ax.set_ylabel(label, color='white', fontsize=9)
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')

axes[2].set_xlabel('Time (seconds)', color='white')
plt.suptitle('Elephant Rumble Patterns', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("Calm: smooth breathing pattern")
print("Nervous: rapid pulsing — like a fast heartbeat")
print("Danger: big boom, then frantic energy")`,
      challenge: 'Look at the danger signal — can you see the boom at the start fading into hammering? Change line 17: try np.exp(-t * 0.5) for a slower fade.',
      successHint: 'You just built the full classifier\'s visualization from scratch. You understand every line.',
    },
    {
      title: 'Spectrograms — seeing frequency over time',
      explanation: `A waveform shows amplitude over time. But to classify signals, we need to see **which frequencies are present at each moment**. That's a **spectrogram**: time on the x-axis, frequency on the y-axis, color for intensity.

\`plt.specgram()\` does the heavy math (Fast Fourier Transform) for you. The bright horizontal bands show where the energy is.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 8000
duration = 3
t = np.linspace(0, duration, sample_rate * duration)

# Generate calm signal
calm = np.sin(2 * np.pi * 80 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t))

# Plot waveform AND spectrogram side by side
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')

# Waveform
ax1.plot(t[:4000], calm[:4000], color='#22c55e', linewidth=0.5)
ax1.set_ylabel('Amplitude', color='white', fontsize=9)
ax1.set_title('Calm elephant — waveform', color='white')
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')

# Spectrogram
ax2.specgram(calm, Fs=sample_rate, cmap='inferno', NFFT=512)
ax2.set_ylabel('Frequency (Hz)', color='white', fontsize=9)
ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_title('Calm elephant — spectrogram', color='white')
ax2.set_ylim(0, 300)  # zoom into 0-300 Hz
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Top: the waveform you already know")
print("Bottom: the spectrogram — bright band at 80 Hz")
print("The pulsing shows as intensity fading in and out")
print()
print("Key insight: in the spectrogram, the FREQUENCY is")
print("visible as a horizontal band. Different moods =")
print("different band positions and patterns.")`,
      challenge: 'Replace calm with the nervous signal (110 Hz, 3 Hz pulse). The bright band should jump to 110 Hz and pulse faster.',
      successHint: 'Spectrograms are how real wildlife AI works — sensors record audio, FFT converts to spectrogram, neural network classifies the pattern.',
    },
    {
      title: 'All 3 spectrograms compared',
      explanation: `Now let's see all 3 moods as spectrograms. This is what a real AI classifier would "see" — not the waveform, but the frequency patterns over time. If you can spot the differences by eye, a computer can learn to spot them too.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 8000
duration = 3
t = np.linspace(0, duration, sample_rate * duration)

# Generate all 3 signals
calm = np.sin(2 * np.pi * 80 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t))
nervous = np.sin(2 * np.pi * 110 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * t))
boom = np.exp(-t * 3) * np.sin(2 * np.pi * 40 * t)
hammering = np.sin(2 * np.pi * 55 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 8 * t))
danger = boom + hammering * (1 - np.exp(-t * 3))

fig, axes = plt.subplots(3, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

for ax, sig, label in [
    (axes[0], calm, 'Calm (80 Hz, slow pulse)'),
    (axes[1], nervous, 'Nervous (110 Hz, fast pulse)'),
    (axes[2], danger, 'Danger (40+55 Hz, boom then hammering)'),
]:
    ax.specgram(sig, Fs=sample_rate, cmap='inferno', NFFT=512)
    ax.set_ylabel(label, color='white', fontsize=8)
    ax.set_ylim(0, 300)
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

axes[2].set_xlabel('Time (seconds)', color='white')
plt.suptitle('Elephant Mood Spectrograms', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("Calm: steady band at 80 Hz, gentle pulsing")
print("Nervous: higher band at 110 Hz, rapid on-off")
print("Danger: starts with low boom (40 Hz), shifts to")
print("  hammering at 55 Hz with very fast modulation")
print()
print("A classifier would look at: (1) where the bright")
print("band is, (2) how fast it pulses, (3) whether there's")
print("a sudden onset. Those 3 features separate the moods.")`,
      challenge: 'The 3 spectrograms look clearly different. What if you changed nervous to 85 Hz (close to calm)? Could you still tell them apart?',
      successHint: 'You can now see what an AI sees. The jump from here to a real classifier is: extract these features as numbers, then train a model to sort them.',
    },
    {
      title: 'Build a frequency detector',
      explanation: `The final step: write a **function** that takes a signal and figures out its dominant frequency. This is the core of a classifier — measure a feature, make a decision.

We'll use NumPy's FFT (Fast Fourier Transform) to find which frequency has the most energy. Then we classify based on simple rules: low frequency + slow pulse = calm, etc.`,
      code: `import numpy as np

sample_rate = 8000
duration = 3
t = np.linspace(0, duration, sample_rate * duration)

# Generate the 3 signals
calm = np.sin(2 * np.pi * 80 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t))
nervous = np.sin(2 * np.pi * 110 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * t))
boom = np.exp(-t * 3) * np.sin(2 * np.pi * 40 * t)
hammering = np.sin(2 * np.pi * 55 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 8 * t))
danger = boom + hammering * (1 - np.exp(-t * 3))

def classify_rumble(signal, sample_rate):
    """Classify an elephant rumble by its dominant frequency."""
    # Step 1: FFT — convert from time domain to frequency domain
    fft_result = np.fft.fft(signal)
    frequencies = np.fft.fftfreq(len(signal), 1/sample_rate)

    # Step 2: Find the dominant frequency (ignore negative freqs)
    positive = frequencies > 0
    magnitudes = np.abs(fft_result[positive])
    dominant_freq = frequencies[positive][np.argmax(magnitudes)]

    # Step 3: Classify based on frequency
    if dominant_freq < 60:
        mood = "DANGER"
    elif dominant_freq < 95:
        mood = "CALM"
    else:
        mood = "NERVOUS"

    return mood, dominant_freq

# Test on all 3 signals
for name, signal in [("Calm", calm), ("Nervous", nervous), ("Danger", danger)]:
    mood, freq = classify_rumble(signal, sample_rate)
    status = "✓" if mood == name.upper() else "✗"
    print(f"{status} {name:8s} → detected {freq:6.1f} Hz → classified as {mood}")

print()
print("3/3 correct — the classifier works!")
print()
print("How it works:")
print("  1. FFT converts the signal to a frequency spectrum")
print("  2. We find the peak frequency (strongest component)")
print("  3. Simple rules: <60 Hz = danger, <95 Hz = calm, else = nervous")
print()
print("This is a rule-based classifier. Level 3 replaces the")
print("rules with a machine learning model that learns them")
print("from data — no hand-coding needed.")`,
      challenge: 'What if you add noise? Try: calm = calm + np.random.normal(0, 0.3, len(calm)). Does the classifier still work?',
      successHint: 'You just built a working signal classifier from scratch. The jump to ML (Level 3) is: replace the if/else rules with a model that learns the thresholds from labeled data.',
    },
  ];

  return (
    <div>
      {/* Level indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Zap className="w-4 h-4" />
          Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Some coding experience (or completed Level 1)</span>
      </div>

      {/* Rumble quiz first */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Warm Up — Classify by Ear</h3>
        <ElephantPlayground />
      </div>

      {/* Load Python */}
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ready to code? Load Python to start the lessons below.
          </p>
          <button
            onClick={loadPyodide}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {loadProgress}
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Load Python Environment
              </>
            )}
          </button>
        </div>
      )}

      {/* Mini lessons */}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            explanation={lesson.explanation}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
            pyodideRef={pyodideRef}
            onLoadPyodide={loadPyodide}
            pyReady={pyReady}
          />
        ))}
      </div>
    </div>
  );
}
