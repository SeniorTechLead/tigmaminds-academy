import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MountainEchoesLevel2() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Fourier analysis of sound',
      concept: `**Fourier analysis of sound** is a core concept in advanced wave physics. Any sound can be decomposed into a sum of pure sine waves (Fourier series). A violin and a flute playing the same note have different timbres because their harmonic content differs.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between harmonic number and amplitude follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Fourier analysis of sound is like adjusting a recipe: changing one ingredient (harmonic number) affects the final dish (amplitude) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the mountain echoes carry messages between distant villages. This connects to fourier analysis of sound because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the harmonic number, what happens to the amplitude? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For fourier analysis of sound, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how harmonic number affects amplitude.',
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
ax1.set_xlabel('Harmonic', color='white')
ax1.set_ylabel('Amplitude', color='white')
ax1.set_title('Fourier Decomposition of Sound', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Harmonic', color='white')
ax2.set_ylabel('Amplitude', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fourier analysis of sound analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for fourier analysis of sound. What parameter values best fit observed measurements?',
      successHint: 'Fourier analysis of sound is fundamental to advanced wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Room acoustics and reverberation',
      concept: `**Room acoustics and reverberation** is a core concept in advanced wave physics. RT60 is the time for sound to decay by 60 dB. Sabine equation: RT60 = 0.161*V/A, where V=volume and A=total absorption. Concert halls target 1.8-2.2 seconds.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between room volume and reverberation time follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Room acoustics and reverberation is like adjusting a recipe: changing one ingredient (room volume) affects the final dish (reverberation time) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the mountain echoes carry messages between distant villages. This connects to room acoustics and reverberation because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the room volume, what happens to the reverberation time? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For room acoustics and reverberation, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how room volume affects reverberation time.',
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
ax1.set_xlabel('Room volume (m3)', color='white')
ax1.set_ylabel('RT60 (seconds)', color='white')
ax1.set_title('Sabine Equation for Reverberation', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Room volume (m3)', color='white')
ax2.set_ylabel('RT60 (seconds)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Room acoustics and reverberation analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for room acoustics and reverberation. What parameter values best fit observed measurements?',
      successHint: 'Room acoustics and reverberation is fundamental to advanced wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Wave equation solutions',
      concept: `**Wave equation solutions** is a core concept in advanced wave physics. The 1D wave equation d2y/dt2 = c2*d2y/dx2 has solutions that are standing waves. Each mode has a specific frequency. Musical strings vibrate in multiple modes simultaneously.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between boundary conditions and mode shapes follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Wave equation solutions is like adjusting a recipe: changing one ingredient (boundary conditions) affects the final dish (mode shapes) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the mountain echoes carry messages between distant villages. This connects to wave equation solutions because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the boundary conditions, what happens to the mode shapes? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For wave equation solutions, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how boundary conditions affects mode shapes.',
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
ax1.set_xlabel('Position (x)', color='white')
ax1.set_ylabel('Amplitude', color='white')
ax1.set_title('Vibrating String Modes', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Position (x)', color='white')
ax2.set_ylabel('Amplitude', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Wave equation solutions analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for wave equation solutions. What parameter values best fit observed measurements?',
      successHint: 'Wave equation solutions is fundamental to advanced wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Diffraction and scattering',
      concept: `**Diffraction and scattering** is a core concept in advanced wave physics. Sound bends around obstacles comparable to its wavelength. Low frequencies (long wavelengths) diffract more than high frequencies. This is why you can hear someone around a corner but not see them.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between obstacle size and diffraction angle follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Diffraction and scattering is like adjusting a recipe: changing one ingredient (obstacle size) affects the final dish (diffraction angle) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the mountain echoes carry messages between distant villages. This connects to diffraction and scattering because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the obstacle size, what happens to the diffraction angle? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For diffraction and scattering, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how obstacle size affects diffraction angle.',
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
ax1.set_xlabel('Obstacle size / wavelength', color='white')
ax1.set_ylabel('Diffraction pattern', color='white')
ax1.set_title('Sound Diffraction Around Obstacles', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Obstacle size / wavelength', color='white')
ax2.set_ylabel('Diffraction pattern', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Diffraction and scattering analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for diffraction and scattering. What parameter values best fit observed measurements?',
      successHint: 'Diffraction and scattering is fundamental to advanced wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Ultrasound applications',
      concept: `**Ultrasound applications** is a core concept in advanced wave physics. Ultrasound (>20 kHz) is used for medical imaging, industrial inspection, and sonar. Higher frequencies give better resolution but less penetration. Medical ultrasound uses 2-15 MHz.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between frequency and penetration depth follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Ultrasound applications is like adjusting a recipe: changing one ingredient (frequency) affects the final dish (penetration depth) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the mountain echoes carry messages between distant villages. This connects to ultrasound applications because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the frequency, what happens to the penetration depth? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For ultrasound applications, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how frequency affects penetration depth.',
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
ax1.set_xlabel('Frequency (MHz)', color='white')
ax1.set_ylabel('Penetration depth (cm)', color='white')
ax1.set_title('Medical Ultrasound Imaging', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Frequency (MHz)', color='white')
ax2.set_ylabel('Penetration depth (cm)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Ultrasound applications analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for ultrasound applications. What parameter values best fit observed measurements?',
      successHint: 'Ultrasound applications is fundamental to advanced wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Acoustic ecology',
      concept: `**Acoustic ecology** is a core concept in advanced wave physics. Noise pollution shrinks the acoustic range of animals. Birds in cities sing at higher frequencies to be heard over traffic. Whale communication ranges have shrunk by 90% due to shipping noise.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between noise level and species communication range follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Acoustic ecology is like adjusting a recipe: changing one ingredient (noise level) affects the final dish (species communication range) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the mountain echoes carry messages between distant villages. This connects to acoustic ecology because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the noise level, what happens to the species communication range? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For acoustic ecology, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how noise level affects species communication range.',
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
ax1.set_xlabel('Background noise (dB)', color='white')
ax1.set_ylabel('Communication range (m)', color='white')
ax1.set_title('Impact of Noise Pollution on Wildlife', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Background noise (dB)', color='white')
ax2.set_ylabel('Communication range (m)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Acoustic ecology analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for acoustic ecology. What parameter values best fit observed measurements?',
      successHint: 'Acoustic ecology is fundamental to advanced wave physics. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Acoustics & Wave Theory</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
