import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LittleTrainLevel3() {
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
      title: `Steam locomotive thermodynamics`,
      concept: `Chemical->thermal->mechanical->kinetic energy. Overall efficiency ~8-10%. Carnot limit: eta_max = 1-T_cold/T_hot ~ 25%.

Narrow-gauge hill trains: steep grades, sharp curves, altitude affects combustion.`,
      analogy: `A steam locomotive is a teakettle on wheels`,
      storyConnection: `In the story of the little train, the little train's engine is a marvel of thermodynamic compromise`,
      checkQuestion: `Why are diesel/electric more efficient than steam?`,
      checkAnswer: `Diesel: 30-40% (higher T and P). Electric: 85-95% (no onboard conversion). Steam wastes most energy as heat.`,
      codeIntro: `Build the computational model for steam analysis.`,
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
      successHint: `This model captures the essential dynamics of railway engineering. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Grade resistance and tractive effort`,
      concept: `F_grade = m*g*sin(theta). 3% grade: 294N per ton. Max TE limited by adhesion: TE_max = mu*weight_on_drivers (mu~0.30).

Hill railways use lighter trains, lower speeds, rack-and-pinion, switchbacks.`,
      analogy: `Grade resistance is pushing a shopping cart up a ramp`,
      storyConnection: `In the story of the little train, the little train battles gravity with every hill it climbs`,
      checkQuestion: `50-ton train, 3% grade, 20 tons on drivers. Can it climb?`,
      checkAnswer: `TE needed: 14,715N. TE available: 58,860N. Yes, 4x margin. Wheels slip at ~12% grade.`,
      codeIntro: `Build the computational model for grade analysis.`,
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
      successHint: `This model captures the essential dynamics of railway engineering. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Curve resistance and superelevation`,
      concept: `a = v^2/R. Superelevation banks the track: tan(theta) = v^2/(g*R). Design speed balances centripetal force.

Narrow-gauge: R<100m, requiring 15-30 km/h speed limits.`,
      analogy: `Superelevation is a velodrome track for trains`,
      storyConnection: `In the story of the little train, every curve is a physics lesson in centripetal force`,
      checkQuestion: `R=50m, 100mm superelevation, 1000mm gauge. Max speed?`,
      checkAnswer: `v = sqrt(9.81*50*0.1) = 7.0 m/s = 25 km/h. Exceeding risks derailment.`,
      codeIntro: `Build the computational model for curve analysis.`,
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
      successHint: `This model captures the essential dynamics of railway engineering. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Timetable scheduling on single-track lines`,
      concept: `Two trains cannot share a section. Job-shop scheduling problem. Greedy (priority to longer trains) gives feasible solutions; integer programming finds optimal.`,
      analogy: `Scheduling is air traffic control for a narrow corridor`,
      storyConnection: `In the story of the little train, fitting multiple trains onto shared track requires careful planning`,
      checkQuestion: `Two trains approach single track from opposite sides. Who waits?`,
      checkAnswer: `Nearest to a passing loop waits, minimizing total delay.`,
      codeIntro: `Build the computational model for timetable analysis.`,
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
      successHint: `This model captures the essential dynamics of railway engineering. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Energy-efficient coasting strategies`,
      concept: `Alternate power and coasting. On descents, convert PE to KE. Optimal control via dynamic programming. Good drivers save 15-20% fuel.`,
      analogy: `Efficient driving is like cycling: pedal uphill, coast downhill`,
      storyConnection: `In the story of the little train, the little train learns to use gravity as an ally`,
      checkQuestion: `Running 5 min early approaching descent. Slow down or coast?`,
      checkAnswer: `Coast. Convert time surplus into fuel savings. Arrive closer to schedule while saving energy.`,
      codeIntro: `Build the computational model for energy-efficient analysis.`,
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
      successHint: `This model captures the essential dynamics of railway engineering. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Reliability and failure analysis`,
      concept: `Fault tree analysis for failure modes. MTBF and MTTR determine availability. Safety-critical systems need redundancy.

A = MTBF / (MTBF + MTTR).`,
      analogy: `Reliability analysis is a medical check-up for machines`,
      storyConnection: `In the story of the little train, keeping the little train running safely day after day`,
      checkQuestion: `Brake MTBF=1000h, backup MTBF=500h. Probability both fail?`,
      checkAnswer: `P(both) = 1/500,000 per hour. At 2000h/yr: 0.4% annual risk. Still needs a third mechanical brake.`,
      codeIntro: `Build the computational model for reliability analysis.`,
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
      successHint: `This model captures the essential dynamics of railway engineering. The same mathematical framework applies to real-world systems at any scale.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (physics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises model railway engineering. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
