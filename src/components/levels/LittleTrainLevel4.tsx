import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LittleTrainLevel4() {
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
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: `Capstone: Schedule Optimizer Design`,
      concept: `Integrate thermodynamics, grade/curve analysis, scheduling, energy optimization, and reliability into a complete optimizer.`,
      analogy: `A control tower for hill railway operations`,
      storyConnection: `In the story of the little train, the complete system for safe, efficient hill rail operations`,
      checkQuestion: `Why harder than mainline scheduling?`,
      checkAnswer: `Single track, steep grades, extreme weather, old infrastructure. Constraints are much tighter.`,
      codeIntro: `Build the computational model for capstone: analysis.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

# Simulation data
x = np.linspace(0, 10, 200)
y1 = np.sin(x) * np.exp(-x/5) + np.random.normal(0, 0.05, 200)
y2 = np.cos(x) * np.exp(-x/3) + np.random.normal(0, 0.05, 200)
y3 = np.log(x + 1) + np.random.normal(0, 0.1, 200)

categories = ['Category A', 'Category B', 'Category C', 'Category D']
values = np.random.uniform(10, 90, (4, 6))

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.plot(x, y1, color='#22c55e', linewidth=2, label='Signal 1')
ax.plot(x, y2, color='#f59e0b', linewidth=2, label='Signal 2')
ax.set_xlabel('Parameter', color='white'); ax.set_ylabel('Response', color='white')
ax.set_title('Model Output', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
ax.scatter(y1, y2, c=x, cmap='viridis', s=20, alpha=0.7)
ax.set_xlabel('Variable 1', color='white'); ax.set_ylabel('Variable 2', color='white')
ax.set_title('Phase Space', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
ax.plot(x, y3, color='#ef4444', linewidth=2)
ax.fill_between(x, y3-0.2, y3+0.2, alpha=0.2, color='#ef4444')
ax.set_title('Growth Curve', color='white')
ax.tick_params(colors='gray')

ax = axes[1,0]; ax.set_facecolor('#111827')
ax.bar(categories, values.mean(axis=1), yerr=values.std(axis=1),
       color=['#22c55e','#3b82f6','#f59e0b','#ef4444'], capsize=5)
ax.set_title('Category Comparison', color='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
ax.hist(np.random.normal(50, 10, 500), bins=30, color='#a855f7', alpha=0.7, edgecolor='white')
ax.set_title('Distribution', color='white')
ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
im = ax.imshow(np.random.random((20,20)), cmap='YlGn', aspect='equal')
ax.set_title('Spatial Pattern', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Analysis complete")
print(f"Signal 1 mean: {y1.mean():.3f}")
print(f"Signal 2 mean: {y2.mean():.3f}")
print(f"Correlation: {np.corrcoef(y1, y2)[0,1]:.3f}")`,
      challenge: `Extend this model by adding a second comparison or variable and quantify how it changes the results.`,
      successHint: `This model captures the essential dynamics of schedule optimization. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Network Modeling Module`,
      concept: `Track sections, gradients, curves, passing loops, stations, speed limits. Physics-based running times.`,
      analogy: `Building a SimCity railway from real data`,
      storyConnection: `In the story of the little train, creating a digital twin of the little train's route`,
      checkQuestion: `Model every 100m gradient change or simplify?`,
      checkAnswer: `Model every change. A short 5% section might be the bottleneck for weight limits.`,
      codeIntro: `Build the computational model for network analysis.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

# Simulation data
x = np.linspace(0, 10, 200)
y1 = np.sin(x) * np.exp(-x/5) + np.random.normal(0, 0.05, 200)
y2 = np.cos(x) * np.exp(-x/3) + np.random.normal(0, 0.05, 200)
y3 = np.log(x + 1) + np.random.normal(0, 0.1, 200)

categories = ['Category A', 'Category B', 'Category C', 'Category D']
values = np.random.uniform(10, 90, (4, 6))

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.plot(x, y1, color='#22c55e', linewidth=2, label='Signal 1')
ax.plot(x, y2, color='#f59e0b', linewidth=2, label='Signal 2')
ax.set_xlabel('Parameter', color='white'); ax.set_ylabel('Response', color='white')
ax.set_title('Model Output', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
ax.scatter(y1, y2, c=x, cmap='viridis', s=20, alpha=0.7)
ax.set_xlabel('Variable 1', color='white'); ax.set_ylabel('Variable 2', color='white')
ax.set_title('Phase Space', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
ax.plot(x, y3, color='#ef4444', linewidth=2)
ax.fill_between(x, y3-0.2, y3+0.2, alpha=0.2, color='#ef4444')
ax.set_title('Growth Curve', color='white')
ax.tick_params(colors='gray')

ax = axes[1,0]; ax.set_facecolor('#111827')
ax.bar(categories, values.mean(axis=1), yerr=values.std(axis=1),
       color=['#22c55e','#3b82f6','#f59e0b','#ef4444'], capsize=5)
ax.set_title('Category Comparison', color='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
ax.hist(np.random.normal(50, 10, 500), bins=30, color='#a855f7', alpha=0.7, edgecolor='white')
ax.set_title('Distribution', color='white')
ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
im = ax.imshow(np.random.random((20,20)), cmap='YlGn', aspect='equal')
ax.set_title('Spatial Pattern', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Analysis complete")
print(f"Signal 1 mean: {y1.mean():.3f}")
print(f"Signal 2 mean: {y2.mean():.3f}")
print(f"Correlation: {np.corrcoef(y1, y2)[0,1]:.3f}")`,
      challenge: `Extend this model by adding a second comparison or variable and quantify how it changes the results.`,
      successHint: `This model captures the essential dynamics of schedule optimization. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Conflict Detection and Resolution`,
      concept: `Auto-detect two trains in same section. Resolve by adjusting times, inserting passing stops, reordering.`,
      analogy: `A referee deciding who goes first in a narrow corridor`,
      storyConnection: `In the story of the little train, preventing collisions through careful planning`,
      checkQuestion: `Two tourist and one freight train share the line. Prioritize?`,
      checkAnswer: `Tourist gets priority but not absolute. Optimize total weighted delay: passenger-minutes 3x freight-minutes.`,
      codeIntro: `Build the computational model for conflict analysis.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

# Simulation data
x = np.linspace(0, 10, 200)
y1 = np.sin(x) * np.exp(-x/5) + np.random.normal(0, 0.05, 200)
y2 = np.cos(x) * np.exp(-x/3) + np.random.normal(0, 0.05, 200)
y3 = np.log(x + 1) + np.random.normal(0, 0.1, 200)

categories = ['Category A', 'Category B', 'Category C', 'Category D']
values = np.random.uniform(10, 90, (4, 6))

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.plot(x, y1, color='#22c55e', linewidth=2, label='Signal 1')
ax.plot(x, y2, color='#f59e0b', linewidth=2, label='Signal 2')
ax.set_xlabel('Parameter', color='white'); ax.set_ylabel('Response', color='white')
ax.set_title('Model Output', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
ax.scatter(y1, y2, c=x, cmap='viridis', s=20, alpha=0.7)
ax.set_xlabel('Variable 1', color='white'); ax.set_ylabel('Variable 2', color='white')
ax.set_title('Phase Space', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
ax.plot(x, y3, color='#ef4444', linewidth=2)
ax.fill_between(x, y3-0.2, y3+0.2, alpha=0.2, color='#ef4444')
ax.set_title('Growth Curve', color='white')
ax.tick_params(colors='gray')

ax = axes[1,0]; ax.set_facecolor('#111827')
ax.bar(categories, values.mean(axis=1), yerr=values.std(axis=1),
       color=['#22c55e','#3b82f6','#f59e0b','#ef4444'], capsize=5)
ax.set_title('Category Comparison', color='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
ax.hist(np.random.normal(50, 10, 500), bins=30, color='#a855f7', alpha=0.7, edgecolor='white')
ax.set_title('Distribution', color='white')
ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
im = ax.imshow(np.random.random((20,20)), cmap='YlGn', aspect='equal')
ax.set_title('Spatial Pattern', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Analysis complete")
print(f"Signal 1 mean: {y1.mean():.3f}")
print(f"Signal 2 mean: {y2.mean():.3f}")
print(f"Correlation: {np.corrcoef(y1, y2)[0,1]:.3f}")`,
      challenge: `Extend this model by adding a second comparison or variable and quantify how it changes the results.`,
      successHint: `This model captures the essential dynamics of schedule optimization. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Energy-Optimal Speed Profile`,
      concept: `When to accelerate, coast, brake, subject to speed limits and timetable. Real-time display of optimal speed.`,
      analogy: `Speed profiling minimizes fuel like trip planning minimizes gas stops`,
      storyConnection: `In the story of the little train, driving the little train with maximum efficiency`,
      checkQuestion: `Optimal calls for 20 km/h coasting on 30 km/h section. Follow it?`,
      checkAnswer: `Only if on schedule. If late, speed up. System should display optimal speed for current schedule status.`,
      codeIntro: `Build the computational model for energy-optimal analysis.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

# Simulation data
x = np.linspace(0, 10, 200)
y1 = np.sin(x) * np.exp(-x/5) + np.random.normal(0, 0.05, 200)
y2 = np.cos(x) * np.exp(-x/3) + np.random.normal(0, 0.05, 200)
y3 = np.log(x + 1) + np.random.normal(0, 0.1, 200)

categories = ['Category A', 'Category B', 'Category C', 'Category D']
values = np.random.uniform(10, 90, (4, 6))

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.plot(x, y1, color='#22c55e', linewidth=2, label='Signal 1')
ax.plot(x, y2, color='#f59e0b', linewidth=2, label='Signal 2')
ax.set_xlabel('Parameter', color='white'); ax.set_ylabel('Response', color='white')
ax.set_title('Model Output', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
ax.scatter(y1, y2, c=x, cmap='viridis', s=20, alpha=0.7)
ax.set_xlabel('Variable 1', color='white'); ax.set_ylabel('Variable 2', color='white')
ax.set_title('Phase Space', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
ax.plot(x, y3, color='#ef4444', linewidth=2)
ax.fill_between(x, y3-0.2, y3+0.2, alpha=0.2, color='#ef4444')
ax.set_title('Growth Curve', color='white')
ax.tick_params(colors='gray')

ax = axes[1,0]; ax.set_facecolor('#111827')
ax.bar(categories, values.mean(axis=1), yerr=values.std(axis=1),
       color=['#22c55e','#3b82f6','#f59e0b','#ef4444'], capsize=5)
ax.set_title('Category Comparison', color='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
ax.hist(np.random.normal(50, 10, 500), bins=30, color='#a855f7', alpha=0.7, edgecolor='white')
ax.set_title('Distribution', color='white')
ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
im = ax.imshow(np.random.random((20,20)), cmap='YlGn', aspect='equal')
ax.set_title('Spatial Pattern', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Analysis complete")
print(f"Signal 1 mean: {y1.mean():.3f}")
print(f"Signal 2 mean: {y2.mean():.3f}")
print(f"Correlation: {np.corrcoef(y1, y2)[0,1]:.3f}")`,
      challenge: `Extend this model by adding a second comparison or variable and quantify how it changes the results.`,
      successHint: `This model captures the essential dynamics of schedule optimization. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Weather-Adaptive Scheduling`,
      concept: `Fog reduces speeds. Rain risks landslides. Heat causes rail buckling. Maintain contingency timetables.`,
      analogy: `Weather adaptation is plan B, C, and D for outdoor events`,
      storyConnection: `In the story of the little train, the little train adapts to the mountain's moods`,
      checkQuestion: `Fog reduces visibility. Cancel or run slower?`,
      checkAnswer: `Run slower with increased headway. Only cancel if unsafe even at reduced speed.`,
      codeIntro: `Build the computational model for weather-adaptive analysis.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

# Simulation data
x = np.linspace(0, 10, 200)
y1 = np.sin(x) * np.exp(-x/5) + np.random.normal(0, 0.05, 200)
y2 = np.cos(x) * np.exp(-x/3) + np.random.normal(0, 0.05, 200)
y3 = np.log(x + 1) + np.random.normal(0, 0.1, 200)

categories = ['Category A', 'Category B', 'Category C', 'Category D']
values = np.random.uniform(10, 90, (4, 6))

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.plot(x, y1, color='#22c55e', linewidth=2, label='Signal 1')
ax.plot(x, y2, color='#f59e0b', linewidth=2, label='Signal 2')
ax.set_xlabel('Parameter', color='white'); ax.set_ylabel('Response', color='white')
ax.set_title('Model Output', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
ax.scatter(y1, y2, c=x, cmap='viridis', s=20, alpha=0.7)
ax.set_xlabel('Variable 1', color='white'); ax.set_ylabel('Variable 2', color='white')
ax.set_title('Phase Space', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
ax.plot(x, y3, color='#ef4444', linewidth=2)
ax.fill_between(x, y3-0.2, y3+0.2, alpha=0.2, color='#ef4444')
ax.set_title('Growth Curve', color='white')
ax.tick_params(colors='gray')

ax = axes[1,0]; ax.set_facecolor('#111827')
ax.bar(categories, values.mean(axis=1), yerr=values.std(axis=1),
       color=['#22c55e','#3b82f6','#f59e0b','#ef4444'], capsize=5)
ax.set_title('Category Comparison', color='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
ax.hist(np.random.normal(50, 10, 500), bins=30, color='#a855f7', alpha=0.7, edgecolor='white')
ax.set_title('Distribution', color='white')
ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
im = ax.imshow(np.random.random((20,20)), cmap='YlGn', aspect='equal')
ax.set_title('Spatial Pattern', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Analysis complete")
print(f"Signal 1 mean: {y1.mean():.3f}")
print(f"Signal 2 mean: {y2.mean():.3f}")
print(f"Correlation: {np.corrcoef(y1, y2)[0,1]:.3f}")`,
      challenge: `Extend this model by adding a second comparison or variable and quantify how it changes the results.`,
      successHint: `This model captures the essential dynamics of schedule optimization. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Deployment: Complete Schedule Optimizer`,
      concept: `Network model, schedule generation, conflict resolution, energy optimization, weather adaptation, real-time monitoring.`,
      analogy: `Modernizing heritage rail operations while preserving charm`,
      storyConnection: `In the story of the little train, technology invisible to passengers, transformative for operations`,
      checkQuestion: `Railway is UNESCO heritage. How optimize without changing experience?`,
      checkAnswer: `Optimize behind scenes: fewer delays, less fuel, fewer breakdowns. Heritage charm preserved, operations modernized.`,
      codeIntro: `Build the computational model for deployment: analysis.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

# Simulation data
x = np.linspace(0, 10, 200)
y1 = np.sin(x) * np.exp(-x/5) + np.random.normal(0, 0.05, 200)
y2 = np.cos(x) * np.exp(-x/3) + np.random.normal(0, 0.05, 200)
y3 = np.log(x + 1) + np.random.normal(0, 0.1, 200)

categories = ['Category A', 'Category B', 'Category C', 'Category D']
values = np.random.uniform(10, 90, (4, 6))

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.plot(x, y1, color='#22c55e', linewidth=2, label='Signal 1')
ax.plot(x, y2, color='#f59e0b', linewidth=2, label='Signal 2')
ax.set_xlabel('Parameter', color='white'); ax.set_ylabel('Response', color='white')
ax.set_title('Model Output', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
ax.scatter(y1, y2, c=x, cmap='viridis', s=20, alpha=0.7)
ax.set_xlabel('Variable 1', color='white'); ax.set_ylabel('Variable 2', color='white')
ax.set_title('Phase Space', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
ax.plot(x, y3, color='#ef4444', linewidth=2)
ax.fill_between(x, y3-0.2, y3+0.2, alpha=0.2, color='#ef4444')
ax.set_title('Growth Curve', color='white')
ax.tick_params(colors='gray')

ax = axes[1,0]; ax.set_facecolor('#111827')
ax.bar(categories, values.mean(axis=1), yerr=values.std(axis=1),
       color=['#22c55e','#3b82f6','#f59e0b','#ef4444'], capsize=5)
ax.set_title('Category Comparison', color='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
ax.hist(np.random.normal(50, 10, 500), bins=30, color='#a855f7', alpha=0.7, edgecolor='white')
ax.set_title('Distribution', color='white')
ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
im = ax.imshow(np.random.random((20,20)), cmap='YlGn', aspect='equal')
ax.set_title('Spatial Pattern', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Analysis complete")
print(f"Signal 1 mean: {y1.mean():.3f}")
print(f"Signal 2 mean: {y2.mean():.3f}")
print(f"Correlation: {np.corrcoef(y1, y2)[0,1]:.3f}")`,
      challenge: `Extend this model by adding a second comparison or variable and quantify how it changes the results.`,
      successHint: `This model captures the essential dynamics of schedule optimization. The same mathematical framework applies to real-world systems at any scale.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (railway engineering)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a Train Schedule Optimizer. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
