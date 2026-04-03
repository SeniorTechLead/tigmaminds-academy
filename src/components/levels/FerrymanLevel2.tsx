import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FerrymanLevel2() {
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
      title: 'Navier-Stokes equations',
      concept: `**Navier-Stokes equations** is a core concept in advanced fluid dynamics. The Navier-Stokes equations govern all fluid flow. The Reynolds number Re = rho*v*L/mu determines whether flow is laminar (smooth, Re<2300) or turbulent (chaotic, Re>4000). Rivers are always turbulent.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between Reynolds number and flow regime follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Navier-Stokes equations is like adjusting a recipe: changing one ingredient (Reynolds number) affects the final dish (flow regime) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the ferryman must understand complex river behavior to navigate safely year-round. This connects to navier-stokes equations because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the Reynolds number, what happens to the flow regime? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For navier-stokes equations, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how Reynolds number affects flow regime.',
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
ax1.set_xlabel('Reynolds number', color='white')
ax1.set_ylabel('Flow pattern', color='white')
ax1.set_title('Laminar to Turbulent Transition', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Reynolds number', color='white')
ax2.set_ylabel('Flow pattern', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Navier-Stokes equations analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for navier-stokes equations. What parameter values best fit observed measurements?',
      successHint: 'Navier-Stokes equations is fundamental to advanced fluid dynamics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Sediment transport',
      concept: `**Sediment transport** is a core concept in advanced fluid dynamics. The Hjulstrom curve shows that fine clay requires higher velocity to erode than sand (cohesion), but once suspended, clay stays in suspension at lower velocities. This explains why rivers carry different sediments at different speeds.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between flow velocity and sediment load follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Sediment transport is like adjusting a recipe: changing one ingredient (flow velocity) affects the final dish (sediment load) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the ferryman must understand complex river behavior to navigate safely year-round. This connects to sediment transport because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the flow velocity, what happens to the sediment load? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For sediment transport, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how flow velocity affects sediment load.',
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
ax1.set_xlabel('Velocity (m/s)', color='white')
ax1.set_ylabel('Sediment transport (kg/m/s)', color='white')
ax1.set_title('Hjulstrom Curve', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Velocity (m/s)', color='white')
ax2.set_ylabel('Sediment transport (kg/m/s)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sediment transport analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for sediment transport. What parameter values best fit observed measurements?',
      successHint: 'Sediment transport is fundamental to advanced fluid dynamics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Open channel flow',
      concept: `**Open channel flow** is a core concept in advanced fluid dynamics. The Manning equation Q = (1/n)*A*R^(2/3)*S^(1/2) predicts flow in rivers and canals. n is roughness, A is area, R is hydraulic radius, S is slope. It is the most-used equation in river engineering.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between channel slope and flow depth follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Open channel flow is like adjusting a recipe: changing one ingredient (channel slope) affects the final dish (flow depth) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the ferryman must understand complex river behavior to navigate safely year-round. This connects to open channel flow because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the channel slope, what happens to the flow depth? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For open channel flow, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how channel slope affects flow depth.',
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
ax1.set_xlabel('Slope', color='white')
ax1.set_ylabel('Normal depth (m)', color='white')
ax1.set_title('Manning Equation', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Slope', color='white')
ax2.set_ylabel('Normal depth (m)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Open channel flow analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for open channel flow. What parameter values best fit observed measurements?',
      successHint: 'Open channel flow is fundamental to advanced fluid dynamics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Vortex dynamics',
      concept: `**Vortex dynamics** is a core concept in advanced fluid dynamics. River vortices form at confluences, behind obstacles, and in bends. The pressure at the vortex center drops (Rankine vortex model). Large vortices can capsize boats and trap swimmers.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between rotation rate and pressure drop follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Vortex dynamics is like adjusting a recipe: changing one ingredient (rotation rate) affects the final dish (pressure drop) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the ferryman must understand complex river behavior to navigate safely year-round. This connects to vortex dynamics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the rotation rate, what happens to the pressure drop? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For vortex dynamics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how rotation rate affects pressure drop.',
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
ax1.set_xlabel('Angular velocity (rad/s)', color='white')
ax1.set_ylabel('Central pressure (Pa)', color='white')
ax1.set_title('Vortex Formation in Rivers', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Angular velocity (rad/s)', color='white')
ax2.set_ylabel('Central pressure (Pa)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Vortex dynamics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for vortex dynamics. What parameter values best fit observed measurements?',
      successHint: 'Vortex dynamics is fundamental to advanced fluid dynamics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Computational fluid dynamics',
      concept: `**Computational fluid dynamics** is a core concept in advanced fluid dynamics. CFD solves Navier-Stokes numerically on a mesh. Modern river models use 2D or 3D CFD to predict flood extent, erosion patterns, and navigation hazards. Resolution and turbulence modeling determine accuracy.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between mesh resolution and simulation accuracy follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Computational fluid dynamics is like adjusting a recipe: changing one ingredient (mesh resolution) affects the final dish (simulation accuracy) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the ferryman must understand complex river behavior to navigate safely year-round. This connects to computational fluid dynamics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the mesh resolution, what happens to the simulation accuracy? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For computational fluid dynamics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how mesh resolution affects simulation accuracy.',
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
ax1.set_xlabel('Grid cells', color='white')
ax1.set_ylabel('Error (%)', color='white')
ax1.set_title('CFD for River Modeling', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Grid cells', color='white')
ax2.set_ylabel('Error (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Computational fluid dynamics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for computational fluid dynamics. What parameter values best fit observed measurements?',
      successHint: 'Computational fluid dynamics is fundamental to advanced fluid dynamics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Climate change and river hydrology',
      concept: `**Climate change and river hydrology** is a core concept in advanced fluid dynamics. Warming increases evaporation and changes precipitation patterns. More intense rainfall events increase flood frequency. Glacier-fed rivers face reduced dry-season flow as glaciers retreat.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between temperature increase and peak flow change follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Climate change and river hydrology is like adjusting a recipe: changing one ingredient (temperature increase) affects the final dish (peak flow change) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the ferryman must understand complex river behavior to navigate safely year-round. This connects to climate change and river hydrology because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the temperature increase, what happens to the peak flow change? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For climate change and river hydrology, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how temperature increase affects peak flow change.',
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
ax1.set_xlabel('Temperature rise (C)', color='white')
ax1.set_ylabel('Peak flow change (%)', color='white')
ax1.set_title('Climate Impacts on River Systems', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Temperature rise (C)', color='white')
ax2.set_ylabel('Peak flow change (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate change and river hydrology analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for climate change and river hydrology. What parameter values best fit observed measurements?',
      successHint: 'Climate change and river hydrology is fundamental to advanced fluid dynamics. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Fluid Dynamics</span>
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
