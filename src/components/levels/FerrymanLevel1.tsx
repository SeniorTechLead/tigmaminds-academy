import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FerrymanLevel1() {
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
      title: 'Fluid flow fundamentals',
      concept: `**Fluid flow fundamentals** is a core concept in fluid mechanics. River velocity is fastest at the center-surface and slowest near banks and bottom (due to friction). Flow rate Q = velocity * cross-section area. Understanding the flow profile is essential for navigation.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between flow velocity and flow rate follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Fluid flow fundamentals is like adjusting a recipe: changing one ingredient (flow velocity) affects the final dish (flow rate) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a ferryman navigates treacherous river currents to transport passengers between banks. This connects to fluid flow fundamentals because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the flow velocity, what happens to the flow rate? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For fluid flow fundamentals, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how flow velocity affects flow rate.',
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
ax1.set_ylabel('Flow rate (m3/s)', color='white')
ax1.set_title('River Flow Profile', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Velocity (m/s)', color='white')
ax2.set_ylabel('Flow rate (m3/s)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fluid flow fundamentals analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for fluid flow fundamentals. What parameter values best fit observed measurements?',
      successHint: 'Fluid flow fundamentals is fundamental to fluid mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Buoyancy and Archimedes principle',
      concept: `**Buoyancy and Archimedes principle** is a core concept in fluid mechanics. An object floats when the weight of displaced water equals the object weight. A ferry must displace enough water to support its load. Overloading reduces freeboard (distance from waterline to deck edge), risking capsizing.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between displaced volume and buoyant force follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Buoyancy and Archimedes principle is like adjusting a recipe: changing one ingredient (displaced volume) affects the final dish (buoyant force) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a ferryman navigates treacherous river currents to transport passengers between banks. This connects to buoyancy and archimedes principle because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the displaced volume, what happens to the buoyant force? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For buoyancy and archimedes principle, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how displaced volume affects buoyant force.',
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
ax1.set_xlabel('Volume displaced (m3)', color='white')
ax1.set_ylabel('Buoyant force (N)', color='white')
ax1.set_title('Archimedes Principle', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Volume displaced (m3)', color='white')
ax2.set_ylabel('Buoyant force (N)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Buoyancy and Archimedes principle analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for buoyancy and archimedes principle. What parameter values best fit observed measurements?',
      successHint: 'Buoyancy and Archimedes principle is fundamental to fluid mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Drag forces on boats',
      concept: `**Drag forces on boats** is a core concept in fluid mechanics. Drag = 0.5 * Cd * rho * A * v^2. It increases with the SQUARE of speed, meaning going twice as fast requires 4x the force (8x the power). This is why hull shape matters enormously for efficiency.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between boat speed and drag force follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Drag forces on boats is like adjusting a recipe: changing one ingredient (boat speed) affects the final dish (drag force) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a ferryman navigates treacherous river currents to transport passengers between banks. This connects to drag forces on boats because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the boat speed, what happens to the drag force? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For drag forces on boats, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how boat speed affects drag force.',
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
ax1.set_xlabel('Speed (m/s)', color='white')
ax1.set_ylabel('Drag (N)', color='white')
ax1.set_title('Hydrodynamic Drag', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Speed (m/s)', color='white')
ax2.set_ylabel('Drag (N)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Drag forces on boats analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for drag forces on boats. What parameter values best fit observed measurements?',
      successHint: 'Drag forces on boats is fundamental to fluid mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'River current navigation',
      concept: `**River current navigation** is a core concept in fluid mechanics. To cross a river efficiently, a ferry must aim upstream of its target. The optimal heading angle depends on the ratio of boat speed to current speed. Too much angle wastes time; too little and you are swept downstream.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between current speed and crossing angle follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'River current navigation is like adjusting a recipe: changing one ingredient (current speed) affects the final dish (crossing angle) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a ferryman navigates treacherous river currents to transport passengers between banks. This connects to river current navigation because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the current speed, what happens to the crossing angle? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For river current navigation, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how current speed affects crossing angle.',
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
ax1.set_xlabel('Current speed (m/s)', color='white')
ax1.set_ylabel('Optimal crossing angle (degrees)', color='white')
ax1.set_title('Optimal Ferry Crossing Strategy', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Current speed (m/s)', color='white')
ax2.set_ylabel('Optimal crossing angle (degrees)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("River current navigation analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for river current navigation. What parameter values best fit observed measurements?',
      successHint: 'River current navigation is fundamental to fluid mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Bernoulli equation',
      concept: `**Bernoulli equation** is a core concept in fluid mechanics. Bernoullis equation: P + 0.5*rho*v^2 + rho*g*h = constant. Faster flow means lower pressure. This explains why boats are drawn toward each other when passing, and why rapids form where rivers narrow.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between water speed and pressure follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Bernoulli equation is like adjusting a recipe: changing one ingredient (water speed) affects the final dish (pressure) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a ferryman navigates treacherous river currents to transport passengers between banks. This connects to bernoulli equation because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the water speed, what happens to the pressure? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For bernoulli equation, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how water speed affects pressure.',
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
ax1.set_ylabel('Pressure (Pa)', color='white')
ax1.set_title('Bernoulli Effect in Rivers', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Velocity (m/s)', color='white')
ax2.set_ylabel('Pressure (Pa)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bernoulli equation analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for bernoulli equation. What parameter values best fit observed measurements?',
      successHint: 'Bernoulli equation is fundamental to fluid mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Flood hydraulics',
      concept: `**Flood hydraulics** is a core concept in fluid mechanics. A hydrograph shows how river level responds to rainfall. Peak flow arrives hours to days after peak rainfall (lag time). Understanding this lag gives the ferryman time to prepare or suspend operations before the flood arrives.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between rainfall intensity and river stage follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Flood hydraulics is like adjusting a recipe: changing one ingredient (rainfall intensity) affects the final dish (river stage) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a ferryman navigates treacherous river currents to transport passengers between banks. This connects to flood hydraulics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the rainfall intensity, what happens to the river stage? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For flood hydraulics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how rainfall intensity affects river stage.',
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
ax1.set_xlabel('Rainfall (mm/hr)', color='white')
ax1.set_ylabel('Water level (m)', color='white')
ax1.set_title('Flood Hydrograph', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Rainfall (mm/hr)', color='white')
ax2.set_ylabel('Water level (m)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Flood hydraulics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for flood hydraulics. What parameter values best fit observed measurements?',
      successHint: 'Flood hydraulics is fundamental to fluid mechanics. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Fluid Mechanics & River Transport</span>
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
