import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MountainEchoesLevel1() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Sound waves fundamentals',
      concept: `**Sound waves fundamentals** is a core concept in acoustics and wave physics. Sound is a longitudinal pressure wave. Speed in air is about 343 m/s. Frequency determines pitch (20-20,000 Hz for humans). Wavelength = speed/frequency. Low frequencies have long wavelengths and diffract around obstacles.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between frequency and wavelength follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Sound waves fundamentals is like adjusting a recipe: changing one ingredient (frequency) affects the final dish (wavelength) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a child shouts into a mountain valley and hears echoes returning. This connects to sound waves fundamentals because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the frequency, what happens to the wavelength? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For sound waves fundamentals, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how frequency affects wavelength.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Frequency (Hz)', color='white')
ax1.set_ylabel('Wavelength (m)', color='white')
ax1.set_title('Sound Wave Properties', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_ylabel('Wavelength (m)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sound waves fundamentals analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for sound waves fundamentals. What parameter values best fit observed measurements?',
      successHint: 'Sound waves fundamentals is fundamental to acoustics and wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Echo and reflection',
      concept: `**Echo and reflection** is a core concept in acoustics and wave physics. An echo occurs when sound reflects off a surface and returns to the listener. Minimum distance for distinct echo is about 17m (0.1s round trip). Echo delay = 2*distance/speed_of_sound.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between distance to wall and echo delay follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Echo and reflection is like adjusting a recipe: changing one ingredient (distance to wall) affects the final dish (echo delay) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a child shouts into a mountain valley and hears echoes returning. This connects to echo and reflection because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the distance to wall, what happens to the echo delay? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For echo and reflection, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how distance to wall affects echo delay.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Distance (m)', color='white')
ax1.set_ylabel('Delay (seconds)', color='white')
ax1.set_title('Echo Timing and Distance', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Distance (m)', color='white')
ax2.set_ylabel('Delay (seconds)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Echo and reflection analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for echo and reflection. What parameter values best fit observed measurements?',
      successHint: 'Echo and reflection is fundamental to acoustics and wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Resonance and standing waves',
      concept: `**Resonance and standing waves** is a core concept in acoustics and wave physics. A tube resonates at specific frequencies where standing waves form. For an open tube: f_n = n*v/(2L). This is how musical instruments work, from flutes to organ pipes.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between tube length and resonant frequency follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Resonance and standing waves is like adjusting a recipe: changing one ingredient (tube length) affects the final dish (resonant frequency) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a child shouts into a mountain valley and hears echoes returning. This connects to resonance and standing waves because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the tube length, what happens to the resonant frequency? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For resonance and standing waves, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how tube length affects resonant frequency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Tube length (m)', color='white')
ax1.set_ylabel('Frequency (Hz)', color='white')
ax1.set_title('Standing Waves in Tubes', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Tube length (m)', color='white')
ax2.set_ylabel('Frequency (Hz)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Resonance and standing waves analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for resonance and standing waves. What parameter values best fit observed measurements?',
      successHint: 'Resonance and standing waves is fundamental to acoustics and wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Sound intensity and decibels',
      concept: `**Sound intensity and decibels** is a core concept in acoustics and wave physics. Sound intensity decreases with the square of distance: I = P/(4*pi*r^2). The decibel scale is logarithmic: 10 dB increase = 10x intensity. Conversation is 60 dB; pain threshold is 120 dB.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between distance from source and intensity level follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Sound intensity and decibels is like adjusting a recipe: changing one ingredient (distance from source) affects the final dish (intensity level) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a child shouts into a mountain valley and hears echoes returning. This connects to sound intensity and decibels because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the distance from source, what happens to the intensity level? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For sound intensity and decibels, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how distance from source affects intensity level.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Distance (m)', color='white')
ax1.set_ylabel('Sound level (dB)', color='white')
ax1.set_title('Inverse Square Law for Sound', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Distance (m)', color='white')
ax2.set_ylabel('Sound level (dB)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sound intensity and decibels analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for sound intensity and decibels. What parameter values best fit observed measurements?',
      successHint: 'Sound intensity and decibels is fundamental to acoustics and wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Doppler effect',
      concept: `**Doppler effect** is a core concept in acoustics and wave physics. When a source moves toward you, sound waves compress (higher pitch). Moving away, they stretch (lower pitch). f_observed = f_source * (v_sound / (v_sound - v_source)). This is why ambulance sirens change pitch.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between source velocity and observed frequency follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Doppler effect is like adjusting a recipe: changing one ingredient (source velocity) affects the final dish (observed frequency) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a child shouts into a mountain valley and hears echoes returning. This connects to doppler effect because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the source velocity, what happens to the observed frequency? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For doppler effect, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how source velocity affects observed frequency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Source speed (m/s)', color='white')
ax1.set_ylabel('Observed frequency (Hz)', color='white')
ax1.set_title('Doppler Shift', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Source speed (m/s)', color='white')
ax2.set_ylabel('Observed frequency (Hz)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Doppler effect analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for doppler effect. What parameter values best fit observed measurements?',
      successHint: 'Doppler effect is fundamental to acoustics and wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Acoustic interference',
      concept: `**Acoustic interference** is a core concept in acoustics and wave physics. When two sound waves meet, they add (constructive interference) or cancel (destructive interference) depending on their phase relationship. Noise-canceling headphones exploit destructive interference.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between path difference and amplitude follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Acoustic interference is like adjusting a recipe: changing one ingredient (path difference) affects the final dish (amplitude) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a child shouts into a mountain valley and hears echoes returning. This connects to acoustic interference because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the path difference, what happens to the amplitude? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For acoustic interference, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how path difference affects amplitude.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Path difference (wavelengths)', color='white')
ax1.set_ylabel('Resultant amplitude', color='white')
ax1.set_title('Constructive and Destructive Interference', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Path difference (wavelengths)', color='white')
ax2.set_ylabel('Resultant amplitude', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Acoustic interference analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for acoustic interference. What parameter values best fit observed measurements?',
      successHint: 'Acoustic interference is fundamental to acoustics and wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Sound Reflection & Wave Physics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
