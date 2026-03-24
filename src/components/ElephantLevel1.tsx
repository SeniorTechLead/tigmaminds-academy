import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from './MiniLesson';

export default function ElephantLevel1() {
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
      title: 'Variables — giving things names',
      explanation: `In Python, a **variable** is a name you give to a value. Think of it as a label on a jar — the jar holds a number, and the label tells you what it is.

When Rongpharpi listened to the elephants, she noticed different **frequencies** (how fast the ground vibrated) and **pulse rates** (how quickly the vibrations repeated). Let's store those as variables.`,
      code: `# A variable stores a value you can use later
frequency = 80
pulse_rate = 0.5
name = "calm"

# Print them out
print("Signal name:", name)
print("Frequency:", frequency, "Hz")
print("Pulse rate:", pulse_rate, "pulses per second")`,
      challenge: 'Change frequency to 200 and run again. What changed in the output?',
      successHint: 'You just created 3 variables. Every piece of code in the full classifier uses variables like these.',
    },
    {
      title: 'Math with variables',
      explanation: `Python does math like a calculator — but with variables, you can build formulas that describe real things. The elephants rumble at about **80 vibrations per second**. In one minute, that's 80 × 60 = 4,800 vibrations. Let Python do the math.`,
      code: `frequency = 80  # vibrations per second
duration = 60   # seconds

total_vibrations = frequency * duration

print("In", duration, "seconds at", frequency, "Hz:")
print("Total vibrations:", total_vibrations)
print()

# How many in one hour?
hour_vibrations = frequency * 60 * 60
print("In one hour:", hour_vibrations, "vibrations")
print("That's", hour_vibrations / 1000000, "million!")`,
      challenge: 'A nervous elephant rumbles at 110 Hz. Change frequency to 110 — how many vibrations per hour?',
      successHint: 'Python handles the arithmetic. You just define the inputs — the formulas do the rest.',
    },
    {
      title: 'Lists — holding many values',
      explanation: `A **list** holds multiple values in order. Rongpharpi didn't hear just one vibration — she felt thousands. A list is like a long recording: each position holds one measurement.

In Python, we write lists with square brackets: \`[1, 2, 3]\``,
      code: `# A list of vibration strengths (made up for now)
vibrations = [0.2, 0.5, 0.8, 1.0, 0.7, 0.3, 0.1]

print("Number of readings:", len(vibrations))
print("First reading:", vibrations[0])
print("Strongest reading:", max(vibrations))
print("Average:", sum(vibrations) / len(vibrations))
print()

# The whole list
print("All readings:", vibrations)`,
      challenge: 'Add more numbers to the list. What happens to the average?',
      successHint: 'Real sensor data is just a very long list — sometimes millions of numbers. Numpy helps us work with big lists fast.',
    },
    {
      title: 'NumPy — big lists, made easy',
      explanation: `Typing thousands of numbers by hand would be insane. **NumPy** (Numerical Python) creates big lists for you. \`np.linspace(0, 3, 10)\` means: give me **10 evenly spaced numbers** from 0 to 3.

This is how we'll create our "time axis" — a list of points in time, like frames in a video.`,
      code: `import numpy as np

# 10 evenly spaced points from 0 to 3
t = np.linspace(0, 3, 10)
print("10 time points:")
print(t)
print()

# Now try 24000 points (8000 per second × 3 seconds)
t_full = np.linspace(0, 3, 24000)
print("Full recording: 24,000 time points")
print("First 5:", t_full[:5])
print("Last 5:", t_full[-5:])
print("Step size:", t_full[1] - t_full[0], "seconds")`,
      challenge: 'Change 24000 to 48000 (higher quality recording). How does the step size change?',
      successHint: 'More points = finer detail. This is the same as audio sample rate — CD quality is 44,100 samples per second.',
    },
    {
      title: 'Sine waves — the shape of sound',
      explanation: `Sound is a wave. A **sine wave** is the simplest wave — smooth, repeating, like a swing going back and forth. \`np.sin()\` creates one.

The **frequency** controls how fast it oscillates. 80 Hz means 80 complete cycles per second — that's the deep rumble of a calm elephant.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# Time axis: 3 seconds at 8000 samples/sec
t = np.linspace(0, 3, 24000)

# A sine wave at 80 Hz (calm elephant)
frequency = 80
signal = np.sin(2 * np.pi * frequency * t)

# Plot the first 500 points (just enough to see the shape)
fig, ax = plt.subplots(figsize=(10, 3))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')
ax.plot(t[:500], signal[:500], color='#22c55e', linewidth=1)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Vibration', color='white')
ax.set_title(f'Sine wave at {frequency} Hz', color='white')
ax.tick_params(colors='gray')
plt.tight_layout()
plt.show()

print(f"Created a {frequency} Hz sine wave")
print(f"One cycle takes {1/frequency:.4f} seconds")`,
      challenge: 'Change frequency to 200 and run. The wave gets tighter — that\'s a higher pitch. Try 20 for a deep rumble.',
      successHint: 'This is the exact building block used in the full classifier. Every elephant signal starts as a sine wave.',
    },
    {
      title: 'Amplitude modulation — making it pulse',
      explanation: `A calm elephant doesn't rumble at a constant volume — the sound **pulses**, getting louder and softer in a slow rhythm. This is called **amplitude modulation**: one wave controls the volume of another.

We multiply the fast sine wave (the rumble) by a slow sine wave (the pulse). The slow wave turns the volume up and down.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 3, 24000)

# The rumble (fast)
rumble = np.sin(2 * np.pi * 80 * t)

# The pulse (slow) — controls volume
pulse_rate = 0.5  # pulses per second
pulse = 0.5 + 0.5 * np.sin(2 * np.pi * pulse_rate * t)

# Combine: rumble × pulse
calm_signal = rumble * pulse

# Plot
fig, axes = plt.subplots(3, 1, figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')

for ax, data, label, color in [
    (axes[0], rumble[:2000], 'Rumble (80 Hz)', '#6b7280'),
    (axes[1], pulse[:2000], f'Pulse ({pulse_rate} Hz)', '#f59e0b'),
    (axes[2], calm_signal[:2000], 'Combined: Calm elephant', '#22c55e'),
]:
    ax.plot(t[:2000], data, color=color, linewidth=0.8)
    ax.set_ylabel(label, color='white', fontsize=9)
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')

axes[2].set_xlabel('Time (seconds)', color='white')
plt.suptitle('Amplitude Modulation', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("Top: the raw 80 Hz rumble (constant volume)")
print("Middle: the slow pulse wave (volume envelope)")
print("Bottom: rumble × pulse = a signal that breathes")`,
      challenge: 'Change pulse_rate from 0.5 to 3. Now it pulses fast — that\'s a nervous elephant! Try 8 for danger.',
      successHint: 'You just built the exact technique the full classifier uses. Calm = slow pulse, nervous = fast pulse, danger = very fast pulse.',
    },
  ];

  return (
    <div>
      {/* Level indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No coding experience needed</span>
      </div>

      {/* Load Python button */}
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises run real Python in your browser. Click below to start — it takes about 10 seconds to load.
          </p>
          <button
            onClick={loadPyodide}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {loadProgress}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
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
            id={`L1-${i + 1}`}
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
