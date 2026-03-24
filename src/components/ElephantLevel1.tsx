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
      concept: `When scientists study elephants, they measure things: how fast the ground vibrates (**frequency**), how often the vibration repeats (**pulse rate**), what mood the elephant is in. Each measurement needs a name so they can refer to it later.

In programming, a **variable** is exactly that — a name attached to a value. You write \`frequency = 80\` and from that point on, the word \`frequency\` means 80. You can change it, use it in calculations, or print it out. The name is yours to choose — it should describe what the value represents.`,
      analogy: 'A variable is like a labeled jar in a kitchen. The jar labeled "sugar" holds sugar. The jar labeled "frequency" holds the number 80. You can pour the sugar out and put salt in — the label stays, but the contents change.',
      storyConnection: 'Rongpharpi noticed that calm elephants vibrate the ground about 80 times per second, nervous ones about 110, and danger signals even faster. She didn\'t know the word "variable", but she was tracking three of them: frequency, pulse rate, and mood.',
      checkQuestion: 'If you wrote `frequency = 80` and then later wrote `frequency = 110`, what does `frequency` equal now?',
      checkAnswer: '110. The old value (80) is gone. A variable always holds its most recent value — just like erasing a whiteboard and writing something new.',
      codeIntro: 'Create three variables that describe a calm elephant\'s rumble, then print them.',
      code: `frequency = 80
pulse_rate = 0.5
name = "calm"

print("Signal name:", name)
print("Frequency:", frequency, "Hz")
print("Pulse rate:", pulse_rate, "pulses per second")`,
      challenge: 'Change frequency to 110 and name to "nervous". Run again — you\'ve just described a different elephant mood with the same three variables.',
      successHint: 'Every piece of the classifier uses variables like these. You now know the most fundamental building block of all programming.',
    },
    {
      title: 'Math — letting the computer calculate',
      concept: `Rongpharpi felt the ground vibrate 80 times per second. How many vibrations in one minute? You could count on your fingers… or you could write \`80 × 60\` and let the computer do it instantly.

Programming isn't about memorizing — it's about **describing a calculation once** and letting the machine repeat it with any numbers you give it. Python uses the same math symbols you know: \`+\` (add), \`-\` (subtract), \`*\` (multiply), \`/\` (divide). The power is that you can use **variables** in your math, so one formula works for any elephant.`,
      analogy: 'Math with variables is like a recipe. "Bake for temperature × 2 minutes" works whether temperature is 150° or 200°. You write the formula once; the ingredients change.',
      storyConnection: 'When Rongpharpi warned her village, she didn\'t just say "the elephants are coming." She estimated *how fast* — by feeling how many vibrations per second and knowing how far sound travels through earth. That\'s math with variables.',
      checkQuestion: 'If frequency = 80 and duration = 60, what does `frequency * duration` equal? And what does that number *mean*?',
      checkAnswer: '4,800. It means the ground vibrated 4,800 times in 60 seconds. The number alone is meaningless — the meaning comes from knowing what the variables represent.',
      codeIntro: 'Calculate how many times the ground vibrates over different time periods.',
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
      challenge: 'A nervous elephant rumbles at 110 Hz. Change frequency to 110 on line 1 — how many vibrations per hour? The formula on line 11 doesn\'t change. That\'s the power of variables.',
      successHint: 'You changed one number and the entire calculation updated. This is why programmers use variables — write the logic once, change the inputs whenever you want.',
    },
    {
      title: 'Lists — recording many measurements',
      concept: `Rongpharpi didn't feel just one vibration — she felt **thousands** in a row. A single number can't capture that. You need a way to store a whole **sequence** of measurements in order, so you can analyze them together.

A **list** does exactly this. It holds multiple values in a specific order. The first value, the second, the hundredth — each has a position (called an **index**), and you can ask questions about the whole collection: How many values? What's the biggest? The smallest? The average?`,
      analogy: 'A list is like a roll of receipt paper from a seismograph — a long strip of measurements, one after another. Each measurement has a position (first, second, third...) and together they tell a story that no single measurement could.',
      storyConnection: 'When Rongpharpi pressed her ear to the ground, she wasn\'t hearing a single number. She was hearing a *stream* of vibrations — one after another, varying in strength. Her brain assembled the stream into a pattern. A list is how we give a computer that same stream.',
      checkQuestion: 'If vibrations = [0.2, 0.5, 0.8, 1.0, 0.7], what is vibrations[0]? What is vibrations[3]?',
      checkAnswer: 'vibrations[0] is 0.2 (the first value — Python counts from 0, not 1). vibrations[3] is 1.0 (the fourth value). This zero-based counting is strange at first but becomes natural.',
      codeIntro: 'Create a list of vibration readings and analyze them.',
      code: `vibrations = [0.2, 0.5, 0.8, 1.0, 0.7, 0.3, 0.1]

print("Number of readings:", len(vibrations))
print("First reading:", vibrations[0])
print("Last reading:", vibrations[-1])
print("Strongest:", max(vibrations))
print("Weakest:", min(vibrations))
print("Average:", sum(vibrations) / len(vibrations))`,
      challenge: 'Add 3 more numbers to the list (inside the brackets, separated by commas). Does the average go up or down? Why?',
      successHint: 'Real sensor data is just a very long list — millions of numbers. The next lesson introduces a tool that makes big lists effortless.',
    },
    {
      title: 'NumPy — working with thousands of numbers',
      concept: `A real vibration recording has **thousands of measurements per second**. Typing them by hand is impossible. **NumPy** (Numerical Python) is a library that creates, manipulates, and analyzes huge lists — called **arrays** — in a single line of code.

The key function is \`np.linspace(start, end, count)\` — it creates \`count\` evenly spaced numbers between \`start\` and \`end\`. This is how we'll create a **time axis**: a list of every point in time where we'll measure the vibration, like the tick marks on a ruler.`,
      analogy: 'Imagine you need to mark every millimeter on a 3-meter ruler. That\'s 3,000 marks. You wouldn\'t draw each one by hand — you\'d use a machine. NumPy is that machine for numbers.',
      storyConnection: 'When scientists place a geophone (ground sensor) near elephants, it records 8,000 vibration samples every second. In a 3-second recording, that\'s 24,000 numbers. NumPy handles this effortlessly.',
      checkQuestion: 'If you write np.linspace(0, 3, 10), how many numbers do you get? What\'s the spacing between them?',
      checkAnswer: '10 numbers, evenly spaced from 0 to 3. The spacing is 3/9 = 0.333... (9 gaps between 10 points). Think of 10 fence posts over a 3-meter fence.',
      codeIntro: 'Create time axes of different sizes and see how precision changes.',
      code: `import numpy as np

# 10 evenly spaced points from 0 to 3
t = np.linspace(0, 3, 10)
print("10 time points:")
print(t)
print()

# Now try 24000 points (8000 per second x 3 seconds)
t_full = np.linspace(0, 3, 24000)
print("Full recording: 24,000 time points")
print("First 5:", t_full[:5])
print("Last 5:", t_full[-5:])
print("Step size:", t_full[1] - t_full[0], "seconds")`,
      challenge: 'Change 24000 to 48000 on line 10 (double the sample rate). The step size should halve — finer detail, like zooming in on the ruler.',
      successHint: 'CD-quality audio uses 44,100 samples per second. You now understand why: more samples = more detail. The time array is the foundation for everything that follows.',
    },
    {
      title: 'Sine waves — the shape of vibration',
      concept: `When something vibrates — a guitar string, the ground under an elephant, your eardrum — it moves back and forth in a smooth, repeating pattern. The mathematical shape of this pattern is called a **sine wave**.

A sine wave has two key properties:
- **Frequency**: how many times it completes a full cycle per second, measured in **Hertz (Hz)**. 80 Hz means 80 complete back-and-forth cycles every second.
- **Amplitude**: how far it moves from center — how strong the vibration is.

The formula \`sin(2π × frequency × time)\` gives you the vibration strength at any moment. The \`2π\` is what makes the wave repeat — it's the mathematical equivalent of "go around once."`,
      analogy: 'Push a child on a swing. One full swing (back, forward, back) is one cycle. If the swing completes 2 cycles per second, the frequency is 2 Hz. A faster push = higher frequency = more cycles per second. An elephant at 80 Hz is like 80 swings per second — so fast it becomes a low hum in the ground.',
      storyConnection: 'The calm rumble Rongpharpi felt was the ground oscillating at about 80 Hz — 80 tiny push-pull cycles per second. Below human hearing, but her body could feel it through the earth. The sine wave is the mathematical model of what she felt.',
      checkQuestion: 'An elephant rumbles at 80 Hz. How long does one complete vibration cycle take? (Hint: if it does 80 cycles in 1 second...)',
      checkAnswer: '1/80 = 0.0125 seconds, or 12.5 milliseconds. Each cycle is incredibly fast — that\'s why you feel it as a continuous hum rather than individual pulses.',
      codeIntro: 'Generate a sine wave at elephant-rumble frequency and see its shape.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 3, 24000)

frequency = 80
signal = np.sin(2 * np.pi * frequency * t)

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

print(f"Frequency: {frequency} Hz")
print(f"One cycle: {1/frequency:.4f} seconds")`,
      challenge: 'Change frequency to 200 — the wave gets tighter (more cycles per second). Then try 20 — it stretches out. Can you see the connection between the number and the visual?',
      successHint: 'You now understand what a sine wave is, why frequency matters, and what the formula means. This is the building block of every signal in the classifier.',
    },
    {
      title: 'Amplitude modulation — encoding mood in a signal',
      concept: `A calm elephant doesn't rumble at a perfectly constant volume. The sound **rises and falls** in a slow, breathing rhythm — loud, then soft, then loud again, about once every 2 seconds.

This is called **amplitude modulation**: one wave (the fast rumble) carries the sound, and another wave (the slow pulse) controls its volume over time. The **pulse rate** — how many times per second the volume rises and falls — is what distinguishes a calm elephant from a nervous one.

- **Calm**: slow pulse (0.5 Hz = once every 2 seconds)
- **Nervous**: fast pulse (3 Hz = three times per second)
- **Danger**: very fast pulse (8 Hz) with an initial burst

Mathematically, you multiply the two waves: \`rumble × pulse\`. Where the pulse is high, the rumble is loud. Where the pulse is low, the rumble is quiet.`,
      analogy: 'Imagine someone playing a drum at a steady beat (the rumble). Now imagine someone else slowly turning the volume knob up and down (the pulse). The beat never changes, but the loudness breathes in and out. That breathing pattern is what tells you the drummer\'s mood.',
      storyConnection: 'This is exactly what Rongpharpi learned to read. She couldn\'t hear the individual 80 Hz vibrations — they were too fast. But she could feel the slow rise and fall of intensity through the ground. A calm, slow breathing meant the herd was feeding. Rapid pulsing meant something was wrong.',
      checkQuestion: 'If you multiply a fast wave (rumble) by a slow wave (pulse), what does the result look like? Will it be fast, slow, or something else?',
      checkAnswer: 'It looks like a fast wave whose volume changes slowly. The fast oscillations are still there, but they grow and shrink following the slow pulse. It\'s like looking at a wave through a window that opens and closes.',
      codeIntro: 'Combine a rumble wave and a pulse wave to create a calm elephant signal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 3, 24000)

rumble = np.sin(2 * np.pi * 80 * t)

pulse_rate = 0.5
pulse = 0.5 + 0.5 * np.sin(2 * np.pi * pulse_rate * t)

calm_signal = rumble * pulse

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

print("Top: constant 80 Hz rumble")
print("Middle: slow volume envelope (0.5 Hz)")
print("Bottom: rumble x pulse = a signal that breathes")`,
      challenge: 'Change pulse_rate from 0.5 to 3 on line 8. The combined wave now pulses rapidly — that\'s a nervous elephant. Try 8 for danger. Compare all three and notice how the *only* thing that changes is the pulse speed.',
      successHint: 'You\'ve just built the core insight of the whole classifier: the rumble frequency tells you it\'s an elephant, but the pulse rate tells you its mood. Calm = slow pulse, nervous = fast, danger = frantic.',
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
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
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
