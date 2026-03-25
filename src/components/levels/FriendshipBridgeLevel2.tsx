import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FriendshipBridgeLevel2() {
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
      title: 'Finite element analysis',
      concept: `**Finite element analysis** is a core concept in advanced structural mechanics. FEA divides a structure into small elements and solves equilibrium equations at each node. Finer meshes give more accurate results but require more computation. Convergence studies verify the mesh is adequate.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between mesh density and solution accuracy follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Finite element analysis is like adjusting a recipe: changing one ingredient (mesh density) affects the final dish (solution accuracy) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the villages must design a bridge strong enough for monsoon floods. This connects to finite element analysis because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the mesh density, what happens to the solution accuracy? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For finite element analysis, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how mesh density affects solution accuracy.',
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
ax1.set_xlabel('Elements per meter', color='white')
ax1.set_ylabel('Stress accuracy (%)', color='white')
ax1.set_title('FEA Convergence Study', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Elements per meter', color='white')
ax2.set_ylabel('Stress accuracy (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Finite element analysis analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for finite element analysis. What parameter values best fit observed measurements?',
      successHint: 'Finite element analysis is fundamental to advanced structural mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Dynamic loads and resonance',
      concept: `**Dynamic loads and resonance** is a core concept in advanced structural mechanics. When wind or marching frequency matches a bridge natural frequency, resonance occurs and oscillations grow dangerously. The Tacoma Narrows Bridge collapsed from wind-induced resonance in 1940.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between forcing frequency and amplitude response follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Dynamic loads and resonance is like adjusting a recipe: changing one ingredient (forcing frequency) affects the final dish (amplitude response) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the villages must design a bridge strong enough for monsoon floods. This connects to dynamic loads and resonance because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the forcing frequency, what happens to the amplitude response? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For dynamic loads and resonance, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how forcing frequency affects amplitude response.',
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
ax1.set_xlabel('Frequency ratio (f/fn)', color='white')
ax1.set_ylabel('Amplitude ratio', color='white')
ax1.set_title('Resonance in Bridge Structures', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Frequency ratio (f/fn)', color='white')
ax2.set_ylabel('Amplitude ratio', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Dynamic loads and resonance analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for dynamic loads and resonance. What parameter values best fit observed measurements?',
      successHint: 'Dynamic loads and resonance is fundamental to advanced structural mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Foundation engineering',
      concept: `**Foundation engineering** is a core concept in advanced structural mechanics. Bridges transmit loads to the ground through foundations. Soft soil requires deep piles or spread footings. Foundation failure is the most common cause of bridge collapse in flood-prone rivers.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between soil bearing capacity and settlement follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Foundation engineering is like adjusting a recipe: changing one ingredient (soil bearing capacity) affects the final dish (settlement) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the villages must design a bridge strong enough for monsoon floods. This connects to foundation engineering because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the soil bearing capacity, what happens to the settlement? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For foundation engineering, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how soil bearing capacity affects settlement.',
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
ax1.set_xlabel('Load (kN/m2)', color='white')
ax1.set_ylabel('Settlement (mm)', color='white')
ax1.set_title('Soil-Structure Interaction', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Load (kN/m2)', color='white')
ax2.set_ylabel('Settlement (mm)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Foundation engineering analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for foundation engineering. What parameter values best fit observed measurements?',
      successHint: 'Foundation engineering is fundamental to advanced structural mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Hydraulic forces on bridges',
      concept: `**Hydraulic forces on bridges** is a core concept in advanced structural mechanics. Fast-flowing water erodes soil around bridge piers (scour). Scour is the #1 cause of bridge failure worldwide. Scour depth increases with velocity squared and can undermine a pier in hours during a flood.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between river velocity and scour depth follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Hydraulic forces on bridges is like adjusting a recipe: changing one ingredient (river velocity) affects the final dish (scour depth) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the villages must design a bridge strong enough for monsoon floods. This connects to hydraulic forces on bridges because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the river velocity, what happens to the scour depth? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For hydraulic forces on bridges, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how river velocity affects scour depth.',
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
ax1.set_xlabel('Flow velocity (m/s)', color='white')
ax1.set_ylabel('Scour depth (m)', color='white')
ax1.set_title('Bridge Scour During Floods', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Flow velocity (m/s)', color='white')
ax2.set_ylabel('Scour depth (m)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Hydraulic forces on bridges analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for hydraulic forces on bridges. What parameter values best fit observed measurements?',
      successHint: 'Hydraulic forces on bridges is fundamental to advanced structural mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Seismic design',
      concept: `**Seismic design** is a core concept in advanced structural mechanics. Earthquake-resistant bridges use base isolation, energy dissipation devices, and ductile detailing. Design is based on response spectra that predict how structures of different periods respond to ground shaking.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between peak ground acceleration and structural response follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Seismic design is like adjusting a recipe: changing one ingredient (peak ground acceleration) affects the final dish (structural response) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the villages must design a bridge strong enough for monsoon floods. This connects to seismic design because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the peak ground acceleration, what happens to the structural response? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For seismic design, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how peak ground acceleration affects structural response.',
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
ax1.set_xlabel('PGA (g)', color='white')
ax1.set_ylabel('Displacement (cm)', color='white')
ax1.set_title('Earthquake Response Spectrum', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('PGA (g)', color='white')
ax2.set_ylabel('Displacement (cm)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Seismic design analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for seismic design. What parameter values best fit observed measurements?',
      successHint: 'Seismic design is fundamental to advanced structural mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Life-cycle cost analysis',
      concept: `**Life-cycle cost analysis** is a core concept in advanced structural mechanics. A bridge that costs $10M to build may cost $15M to maintain over its life. Preventive maintenance (painting, deck repair) is far cheaper than reactive repair. Optimal maintenance maximizes service life per dollar.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between maintenance budget and service life follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Life-cycle cost analysis is like adjusting a recipe: changing one ingredient (maintenance budget) affects the final dish (service life) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the villages must design a bridge strong enough for monsoon floods. This connects to life-cycle cost analysis because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the maintenance budget, what happens to the service life? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For life-cycle cost analysis, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how maintenance budget affects service life.',
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
ax1.set_xlabel('Annual maintenance (% of cost)', color='white')
ax1.set_ylabel('Expected life (years)', color='white')
ax1.set_title('Optimal Maintenance Strategy', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Annual maintenance (% of cost)', color='white')
ax2.set_ylabel('Expected life (years)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Life-cycle cost analysis analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for life-cycle cost analysis. What parameter values best fit observed measurements?',
      successHint: 'Life-cycle cost analysis is fundamental to advanced structural mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Structural Engineering</span>
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
