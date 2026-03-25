import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CloudRefusedLevel2() {
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
      title: 'Atmospheric thermodynamics',
      concept: `**Atmospheric thermodynamics** is a core concept in atmospheric science. The atmosphere cools at about 6.5C per km (lapse rate). When rising air cools below its dew point, condensation occurs and clouds form. The dry and moist adiabatic lapse rates govern cloud base height and development.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between altitude and temperature follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Atmospheric thermodynamics is like adjusting a recipe: changing one ingredient (altitude) affects the final dish (temperature) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the cloud refuses to rain on the village. This connects to atmospheric thermodynamics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the altitude, what happens to the temperature? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For atmospheric thermodynamics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how altitude affects temperature.',
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
ax1.set_xlabel('Altitude (km)', color='white')
ax1.set_ylabel('Temperature (K)', color='white')
ax1.set_title('Temperature Profile of Atmosphere', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Altitude (km)', color='white')
ax2.set_ylabel('Temperature (K)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Atmospheric thermodynamics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for atmospheric thermodynamics. What parameter values best fit observed measurements?',
      successHint: 'Atmospheric thermodynamics is fundamental to atmospheric science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Numerical weather prediction',
      concept: `**Numerical weather prediction** is a core concept in atmospheric science. Weather models divide the atmosphere into grid cells and solve fluid dynamics equations at each cell. Finer grids give better forecasts but require exponentially more computation.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between grid resolution and forecast accuracy follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Numerical weather prediction is like adjusting a recipe: changing one ingredient (grid resolution) affects the final dish (forecast accuracy) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the cloud refuses to rain on the village. This connects to numerical weather prediction because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the grid resolution, what happens to the forecast accuracy? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For numerical weather prediction, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how grid resolution affects forecast accuracy.',
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
ax1.set_xlabel('Grid size (km)', color='white')
ax1.set_ylabel('Accuracy (%)', color='white')
ax1.set_title('NWP Resolution vs Accuracy', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Grid size (km)', color='white')
ax2.set_ylabel('Accuracy (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Numerical weather prediction analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for numerical weather prediction. What parameter values best fit observed measurements?',
      successHint: 'Numerical weather prediction is fundamental to atmospheric science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Monsoon dynamics',
      concept: `**Monsoon dynamics** is a core concept in atmospheric science. The Indian monsoon is driven by differential heating between the Indian Ocean and the Tibetan Plateau. Changes in this gradient directly affect monsoon timing and intensity.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between sea-land temperature difference and monsoon strength follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Monsoon dynamics is like adjusting a recipe: changing one ingredient (sea-land temperature difference) affects the final dish (monsoon strength) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the cloud refuses to rain on the village. This connects to monsoon dynamics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the sea-land temperature difference, what happens to the monsoon strength? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For monsoon dynamics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how sea-land temperature difference affects monsoon strength.',
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
ax1.set_xlabel('Temperature gradient (C)', color='white')
ax1.set_ylabel('Rainfall (mm)', color='white')
ax1.set_title('Monsoon Intensity Drivers', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Temperature gradient (C)', color='white')
ax2.set_ylabel('Rainfall (mm)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Monsoon dynamics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for monsoon dynamics. What parameter values best fit observed measurements?',
      successHint: 'Monsoon dynamics is fundamental to atmospheric science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Chaos theory in weather',
      concept: `**Chaos theory in weather** is a core concept in atmospheric science. Weather is a chaotic system: tiny differences in initial conditions grow exponentially, limiting predictability to about 10-14 days. This is the Lorenz butterfly effect.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between initial condition perturbation and forecast divergence follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Chaos theory in weather is like adjusting a recipe: changing one ingredient (initial condition perturbation) affects the final dish (forecast divergence) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the cloud refuses to rain on the village. This connects to chaos theory in weather because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the initial condition perturbation, what happens to the forecast divergence? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For chaos theory in weather, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how initial condition perturbation affects forecast divergence.',
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
ax1.set_xlabel('Perturbation size', color='white')
ax1.set_ylabel('Error growth', color='white')
ax1.set_title('Butterfly Effect in Weather', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Perturbation size', color='white')
ax2.set_ylabel('Error growth', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Chaos theory in weather analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for chaos theory in weather. What parameter values best fit observed measurements?',
      successHint: 'Chaos theory in weather is fundamental to atmospheric science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Geoengineering proposals',
      concept: `**Geoengineering proposals** is a core concept in atmospheric science. Stratospheric aerosol injection could cool the planet by reflecting sunlight, but carries enormous risks: ozone depletion, monsoon disruption, and the termination shock if stopped suddenly.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between aerosol injection rate and global temperature change follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Geoengineering proposals is like adjusting a recipe: changing one ingredient (aerosol injection rate) affects the final dish (global temperature change) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the cloud refuses to rain on the village. This connects to geoengineering proposals because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the aerosol injection rate, what happens to the global temperature change? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For geoengineering proposals, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how aerosol injection rate affects global temperature change.',
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
ax1.set_xlabel('Aerosol injection (Tg/yr)', color='white')
ax1.set_ylabel('Temperature change (C)', color='white')
ax1.set_title('Solar Radiation Management', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Aerosol injection (Tg/yr)', color='white')
ax2.set_ylabel('Temperature change (C)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Geoengineering proposals analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for geoengineering proposals. What parameter values best fit observed measurements?',
      successHint: 'Geoengineering proposals is fundamental to atmospheric science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Climate model ensembles',
      concept: `**Climate model ensembles** is a core concept in atmospheric science. Running multiple climate models with different parameters and averaging their predictions reduces uncertainty. No single model is reliable, but the ensemble mean outperforms any individual model.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between number of models and uncertainty reduction follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Climate model ensembles is like adjusting a recipe: changing one ingredient (number of models) affects the final dish (uncertainty reduction) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the cloud refuses to rain on the village. This connects to climate model ensembles because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the number of models, what happens to the uncertainty reduction? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For climate model ensembles, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how number of models affects uncertainty reduction.',
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
ax1.set_xlabel('Ensemble size', color='white')
ax1.set_ylabel('Confidence interval width', color='white')
ax1.set_title('Multi-Model Ensemble Forecasting', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Ensemble size', color='white')
ax2.set_ylabel('Confidence interval width', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate model ensembles analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for climate model ensembles. What parameter values best fit observed measurements?',
      successHint: 'Climate model ensembles is fundamental to atmospheric science. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Atmospheric Science</span>
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
