import { useState, useRef, useCallback } from 'react';
import { Loader2, Zap } from 'lucide-react';
import MiniLesson from './MiniLesson';
import ElephantPlayground from './ElephantPlayground';
import ElephantPlotAnatomyDiagram from './diagrams/ElephantPlotAnatomyDiagram';
import ElephantPulseDiagram from './diagrams/ElephantPulseDiagram';
import ElephantSpectrogramDiagram from './diagrams/ElephantSpectrogramDiagram';
import ElephantClassifierDiagram from './diagrams/ElephantClassifierDiagram';

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
      title: 'Plotting — turning numbers into pictures',
      concept: `In Level 1 you created signals as lists of numbers. But a list of 24,000 numbers is meaningless to a human eye. You need to **see** the shape of the data to understand it.

**Matplotlib** is Python's plotting library. It takes two lists — x values (time) and y values (signal strength) — and draws a line connecting the points. The result is a **chart**: a visual snapshot of your data that reveals patterns no spreadsheet could show.

Every chart has the same anatomy: a **title** (what you're looking at), **axes** with labels (what the numbers mean), and the **data line** itself. Understanding this structure means you can read any scientific chart — and create your own.`,
      analogy: 'A plot is like a photograph of your data. The raw numbers are like having a million individual pixels written as "red, blue, green, red..." — technically complete but useless. Arrange them on a grid and suddenly you see a face, a landscape, a pattern. plt.plot() arranges your numbers into a picture.',
      storyConnection: 'When Rongpharpi felt the elephant vibrations, she built a mental picture of the pattern — strong, weak, strong, weak. A plot does the same thing but on screen. Scientists at the Elephant Listening Project at Cornell plot years of sensor data to track herds they\'ve never seen.',
      checkQuestion: 'A chart shows time on the x-axis (0 to 3 seconds) and signal strength on the y-axis (-1 to +1). If you see a smooth wave with 5 peaks in those 3 seconds, what\'s the approximate frequency?',
      checkAnswer: '5 peaks in 3 seconds ≈ 1.67 Hz. Not quite — 5 *complete cycles* in 3 seconds means 5/3 ≈ 1.67 Hz. But 5 peaks could mean 2.5 cycles (peak-trough-peak is one cycle). Reading charts precisely matters.',
      codeIntro: 'Create your first plot — a sine wave drawn as a line chart.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 1000)
signal = np.sin(2 * np.pi * 5 * t)

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
      challenge: 'Change the 5 on line 4 to 20. Count the cycles — you should see 20 in one second. Then try 2 — wide, slow waves.',
      successHint: 'You can now visualize any signal. Every chart in the classifier uses exactly this pattern: generate data, then plt.plot().',
    },
    {
      title: 'Subplots — comparing signals side by side',
      concept: `One plot shows one signal. But to classify elephant moods, you need to **compare** calm, nervous, and danger signals simultaneously. Are they different frequencies? Different pulse rates? You can't tell by looking at them one at a time.

**Subplots** solve this: \`plt.subplots(3, 1)\` creates 3 charts stacked vertically in a single figure. Each chart is called an **axis** (confusingly named — think of it as a "panel"). You plot different data on each panel, and because they share the same time scale, differences jump out immediately.

This is the standard format for comparing signals in science — EEG brain waves, seismograph readings, and yes, elephant rumble recordings.`,
      analogy: 'Subplots are like a split-screen video comparison. Watching one movie at a time, you might not notice the differences. Put three side by side, synchronized to the same timeline, and the differences are obvious. That\'s what subplots do for data.',
      storyConnection: 'When Rongpharpi learned to distinguish moods, she was doing a mental subplot — comparing today\'s vibration pattern to yesterday\'s calm one and last week\'s danger signal, all at once. Her brain was the comparison engine.',
      checkQuestion: 'If you stack 3 plots vertically and all share the same x-axis (time), what makes them different from each other?',
      checkAnswer: 'The y-axis data — each panel shows a different signal. Because the time scale is identical across all three, you can look straight across to see what\'s happening at the same moment in each signal. That\'s the whole point.',
      codeIntro: 'Stack 3 sine waves at different frequencies to see the visual difference.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 8000)

slow = np.sin(2 * np.pi * 3 * t)
medium = np.sin(2 * np.pi * 10 * t)
fast = np.sin(2 * np.pi * 30 * t)

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

print("All three show 1 second of data")
print("Top: 3 cycles (slow, like calm elephant)")
print("Middle: 10 cycles")
print("Bottom: 30 cycles (fast, tighter waves)")`,
      challenge: 'Change 30 to 80 on line 8 to match a real calm elephant. Notice how tightly packed it gets — that\'s why you can\'t hear individual cycles at 80 Hz.',
      successHint: 'You can now compare any signals visually. The next step is building the actual elephant signals and plotting them this way.',
    },
    {
      title: 'The 3 elephant signals — putting it all together',
      concept: `You now have all the building blocks from Level 1 (sine waves, amplitude modulation) and Level 2 (plotting, subplots). Time to combine them.

We'll generate the three elephant rumble patterns — calm, nervous, danger — using the same formulas from Level 1, then plot them side by side so you can see the differences. This is the exact visualization that a field researcher would look at when reviewing sensor data.

The key insight to watch for: the **shape** of each signal is different. Calm breathes slowly. Nervous pulses rapidly. Danger starts with a boom and descends into frantic hammering. These visual differences are what a classifier will eventually learn to detect.`,
      storyConnection: 'This is the moment where Rongpharpi\'s intuition becomes data science. She felt three distinct patterns through the earth. We\'re turning those patterns into numbers, then into pictures. The picture confirms what her body already knew.',
      checkQuestion: 'Before you run the code: the calm signal is 80 Hz with a 0.5 Hz pulse, and the nervous signal is 110 Hz with a 3 Hz pulse. Which difference will be more visible in the plot — the frequency change or the pulse rate change?',
      checkAnswer: 'The pulse rate change. At this zoom level (showing ~0.25 seconds), both 80 Hz and 110 Hz look like dense oscillations. But the pulse rate (how fast the volume rises and falls) is clearly visible as the envelope shape — slow breathing vs rapid pulsing.',
      codeIntro: 'Generate and plot all 3 elephant mood signals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 3, 24000)  # 3 seconds at 8000 samples/sec

# Three moods, three signals
calm = np.sin(2*np.pi*80*t) * (0.5 + 0.5*np.sin(2*np.pi*0.5*t))
nervous = np.sin(2*np.pi*110*t) * (0.5 + 0.5*np.sin(2*np.pi*3*t))
boom = np.exp(-t*3) * np.sin(2*np.pi*40*t)
danger = boom + np.sin(2*np.pi*55*t) * (0.5+0.5*np.sin(2*np.pi*8*t)) * (1-np.exp(-t*3))

# Plot all three
fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
for ax, sig, label, c in [(ax1,calm,'Calm','#22c55e'),
                           (ax2,nervous,'Nervous','#f59e0b'),
                           (ax3,danger,'Danger','#ef4444')]:
    ax.plot(t[:2000], sig[:2000], color=c, linewidth=0.8)
    ax.set_ylabel(label, color='white', fontsize=9)
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

ax3.set_xlabel('Time (seconds)', color='white')
plt.suptitle('Elephant Rumble Patterns', color='white')
plt.tight_layout()
plt.show()`,
      challenge: 'Look at the danger signal — can you see the boom at the start fading into hammering? Change line 11: try np.exp(-t * 0.5) for a slower fade. How does it change the shape?',
      successHint: 'You just visualized the complete signal set. A human can tell these apart by looking. The next step: teach a computer to tell them apart by measuring.',
    },
    {
      title: 'Spectrograms — seeing frequency over time',
      concept: `A waveform plot shows **amplitude** over time — how strong the vibration is at each moment. But it doesn't directly show **which frequencies** are present. For a dense signal like an 80 Hz rumble, the individual oscillations blur into a thick band.

A **spectrogram** solves this. It uses a mathematical technique called the **Fast Fourier Transform (FFT)** to decompose the signal into its frequency components at each point in time. The result is a 2D image:
- **X-axis**: time
- **Y-axis**: frequency
- **Color**: intensity (how much energy at that frequency and time)

A calm elephant shows up as a **bright horizontal band at 80 Hz** that pulses in intensity. A nervous elephant shows a band at 110 Hz that flickers rapidly. The spectrogram reveals the frequency structure that the waveform hides.

This is what real wildlife AI systems use — they don't analyze raw audio waveforms, they analyze spectrograms.`,
      analogy: 'A waveform is like listening to an orchestra and plotting the total volume over time. A spectrogram is like plotting each instrument separately — you can see the bass line at the bottom, violins in the middle, flutes at the top. Same music, but now you can see the structure.',
      storyConnection: 'Rongpharpi\'s feet and inner ear were doing a biological FFT — separating the ground vibrations into frequency bands. Low, slow pulses meant calm. Higher, faster pulses meant trouble. A spectrogram makes this decomposition visible.',
      checkQuestion: 'In a spectrogram of a calm elephant (80 Hz, 0.5 Hz pulse), where would you see a bright band? Would it be steady or flickering?',
      checkAnswer: 'A bright horizontal band centered at 80 Hz on the y-axis. It would slowly pulse in brightness — bright, then dim, then bright — at 0.5 Hz (once every 2 seconds). The flickering IS the pulse rate.',
      codeIntro: 'Plot a waveform and spectrogram of the same signal side by side.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 8000
duration = 3
t = np.linspace(0, duration, sample_rate * duration)

calm = np.sin(2 * np.pi * 80 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')

ax1.plot(t[:4000], calm[:4000], color='#22c55e', linewidth=0.5)
ax1.set_ylabel('Amplitude', color='white', fontsize=9)
ax1.set_title('Calm elephant — waveform', color='white')
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')

ax2.specgram(calm, Fs=sample_rate, cmap='inferno', NFFT=512)
ax2.set_ylabel('Frequency (Hz)', color='white', fontsize=9)
ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_title('Calm elephant — spectrogram', color='white')
ax2.set_ylim(0, 300)
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Top: the waveform you already know")
print("Bottom: spectrogram — bright band at 80 Hz")
print("The band pulses in brightness = the 0.5 Hz modulation")`,
      challenge: 'Replace the calm signal with a nervous one: change 80 to 110 and 0.5 to 3 on line 8. The bright band should jump higher and flicker faster.',
      successHint: 'You can now see what the AI sees. A waveform shows amplitude; a spectrogram shows frequency structure. The spectrogram is the input to real wildlife classifiers.',
    },
    {
      title: 'Comparing all 3 spectrograms',
      concept: `Now let's see all three elephant moods as spectrograms side by side. This is the critical comparison — if **you** can see the difference between calm, nervous, and danger spectrograms, then a computer can be taught to see it too.

What to look for:
- **Calm**: a steady band at 80 Hz, slowly pulsing in brightness
- **Nervous**: a band at 110 Hz, flickering rapidly on and off
- **Danger**: a burst of low-frequency energy (the boom), then a band at 55 Hz with very fast modulation

The differences are clear to the eye. A machine learning classifier does the same thing: it looks at the spectrogram, measures where the bright bands are, how fast they flicker, and whether there's an initial burst. Those measurements become **features** — the inputs to a classifier.`,
      storyConnection: 'If you showed these three spectrograms to Rongpharpi, she would recognize them immediately — the slow glow of calm feeding, the nervous flicker of alertness, the explosive burst of danger. The math just makes her intuition precise and repeatable.',
      checkQuestion: 'Looking at three spectrograms, what three measurements would you extract to tell the moods apart?',
      checkAnswer: '(1) The frequency of the brightest band (80 Hz vs 110 Hz vs 55 Hz). (2) How fast the brightness flickers (0.5 Hz vs 3 Hz vs 8 Hz). (3) Whether there\'s a sudden burst at the start (only danger has this). These three features are enough to classify perfectly.',
      codeIntro: 'Generate all 3 signals and compare their spectrograms.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 3, 24000)

calm = np.sin(2*np.pi*80*t) * (0.5 + 0.5*np.sin(2*np.pi*0.5*t))
nervous = np.sin(2*np.pi*110*t) * (0.5 + 0.5*np.sin(2*np.pi*3*t))
boom = np.exp(-t*3) * np.sin(2*np.pi*40*t)
danger = boom + np.sin(2*np.pi*55*t)*(0.5+0.5*np.sin(2*np.pi*8*t))*(1-np.exp(-t*3))

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
for ax, sig, label in [(ax1,calm,'Calm (80 Hz)'),
                        (ax2,nervous,'Nervous (110 Hz)'),
                        (ax3,danger,'Danger (40+55 Hz)')]:
    ax.specgram(sig, Fs=8000, cmap='inferno', NFFT=512)
    ax.set_ylabel(label, color='white', fontsize=8)
    ax.set_ylim(0, 300)
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

ax3.set_xlabel('Time (seconds)', color='white')
plt.suptitle('Elephant Mood Spectrograms', color='white')
plt.tight_layout()
plt.show()

print("3 features separate the moods:")
print("  1. Dominant frequency (where the bright band sits)")
print("  2. Pulse rate (how fast it flickers)")
print("  3. Initial burst (only danger has this)")`,
      challenge: 'What if nervous was at 85 Hz instead of 110? Change line 9. Can you still tell calm and nervous apart in the spectrogram? This is why pulse rate matters more than frequency for classification.',
      successHint: 'You can now read spectrograms — the same representation used by real wildlife AI. The last step: automate this reading with code.',
    },
    {
      title: 'Building a frequency detector — your first classifier',
      concept: `You've identified the features by eye. Now it's time to **automate** that process: write a function that takes a signal and determines the elephant's mood without any human looking at a chart.

The approach is called **rule-based classification**:
1. **Measure** the dominant frequency using the **Fast Fourier Transform** (FFT) — the same math that powers the spectrogram, but now we extract a single number: which frequency has the most energy
2. **Classify** based on simple thresholds: if the dominant frequency is below 60 Hz → danger, below 95 Hz → calm, above → nervous

This is the simplest possible classifier. It works perfectly on clean synthetic data. Level 3 (Engineer) replaces these hand-written rules with a machine learning model that **learns** the thresholds from labeled examples — no hand-coding needed. But understanding this rule-based version first is essential, because ML is just automating what you're about to do manually.`,
      analogy: 'A rule-based classifier is like a bouncer at a club checking IDs. "Under 18? You can\'t enter. 18-21? Wristband. Over 21? Full access." The rules are simple, fixed, and written by a human. Machine learning is like training a bouncer by showing them 10,000 people and telling them who should get in — the bouncer figures out the rules themselves.',
      storyConnection: 'Rongpharpi\'s brain was running exactly this algorithm. She didn\'t think "the dominant frequency is 80 Hz therefore the mood is calm." She felt a pattern and classified it from experience. We\'re making her intuition into code — first with explicit rules, later with ML.',
      checkQuestion: 'If a signal\'s FFT shows the strongest frequency at 90 Hz, and our rules are: <60 = danger, <95 = calm, else = nervous — what mood does the classifier output?',
      checkAnswer: 'Calm. 90 < 95, so it falls in the calm range. But is this right? A real 90 Hz signal might be a nervous elephant that\'s slightly calmer than usual. This is the weakness of hard thresholds — Level 3 uses ML to learn softer, more nuanced boundaries.',
      codeIntro: 'Write a function that classifies any elephant signal by its dominant frequency.',
      code: `import numpy as np

t = np.linspace(0, 3, 24000)

# Generate test signals
calm = np.sin(2*np.pi*80*t) * (0.5+0.5*np.sin(2*np.pi*0.5*t))
nervous = np.sin(2*np.pi*110*t) * (0.5+0.5*np.sin(2*np.pi*3*t))
boom = np.exp(-t*3) * np.sin(2*np.pi*40*t)
danger = boom + np.sin(2*np.pi*55*t)*(0.5+0.5*np.sin(2*np.pi*8*t))*(1-np.exp(-t*3))

def classify(signal):
    """Find the peak frequency and classify the mood."""
    fft = np.abs(np.fft.fft(signal))
    freqs = np.fft.fftfreq(len(signal), 1/8000)
    peak = freqs[freqs > 0][np.argmax(fft[freqs > 0])]

    if peak < 60:   return "DANGER", peak
    elif peak < 95:  return "CALM", peak
    else:            return "NERVOUS", peak

# Test all three
for name, sig in [("Calm",calm), ("Nervous",nervous), ("Danger",danger)]:
    mood, freq = classify(sig)
    ok = "✓" if mood == name.upper() else "✗"
    print(f"{ok} {name:8s} → {freq:.1f} Hz → {mood}")

print("\\nRule: <60=danger, 60-95=calm, >95=nervous")
print("Weakness: hand-picked thresholds. Level 3 learns them.")`,
      challenge: 'Add noise to the calm signal: calm = calm + np.random.normal(0, 0.3, len(calm)) on line 8. Does the classifier still work? At what noise level does it break?',
      successHint: 'You built a working classifier from scratch — FFT for feature extraction, thresholds for classification. You understand the full pipeline: signal → frequency → mood. Level 3 replaces the if/else with a learned model.',
    },
  ];

  // Map lesson index to diagram
  const diagrams: Record<number, React.ReactNode> = {
    0: <ElephantPlotAnatomyDiagram />,
    1: <ElephantPulseDiagram />,
    2: <ElephantPulseDiagram />,
    3: <ElephantSpectrogramDiagram />,
    4: <ElephantSpectrogramDiagram />,
    5: <ElephantClassifierDiagram />,
  };

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
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            diagram={diagrams[i]}
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
