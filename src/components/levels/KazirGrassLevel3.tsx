import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function KazirGrassLevel3() {
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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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
      title: `C3 vs C4 photosynthesis`,
      concept: `C3 grasses fix CO2 via RuBisCO; C4 uses PEP carboxylase with a CO2-concentrating mechanism. C4 is more efficient in hot, sunny conditions. Kaziranga's tall grasses are mostly C4.

The quantum yield crossover temperature (~25C) determines which pathway dominates. Below it, C3 wins; above, C4.`,
      analogy: `C3 vs C4 is like two engine designs: C3 is simpler but wastes fuel at high RPM; C4 has a turbocharger that shines at high temperature`,
      storyConnection: `In the story of Kaziranga's tall grass, the tall grasses dominate because their C4 engine runs perfectly in subtropical heat`,
      checkQuestion: `Why do C4 grasses dominate tropical grasslands but not temperate forests?`,
      checkAnswer: `C4 eliminates photorespiration which wastes 25-30% of C3 fixed carbon at high temperatures. Below 25C the extra cost is not worth it.`,
      codeIntro: `Build the computational model for c3 analysis.`,
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
      successHint: `This model captures the essential dynamics of grassland ecology. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `NDVI remote sensing for vegetation health`,
      concept: `NDVI = (NIR - Red)/(NIR + Red). Healthy vegetation reflects NIR and absorbs red. NDVI >0.6 = dense healthy vegetation.

Temporal NDVI tracks grassland phenology and flags drought, flooding, or degradation.`,
      analogy: `NDVI is like taking a plant's pulse from space`,
      storyConnection: `In the story of Kaziranga's tall grass, satellites watch over the grasslands the way the story watches over its characters`,
      checkQuestion: `Why does NDVI drop after flooding?`,
      checkAnswer: `Standing water absorbs NIR, lowering NDVI. Submerged plants contribute less. After water recedes, NDVI rebounds as new growth emerges.`,
      codeIntro: `Build the computational model for ndvi analysis.`,
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
      successHint: `This model captures the essential dynamics of grassland ecology. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Fire ecology and controlled burning`,
      concept: `Fire removes dead biomass, returns nutrients, and prevents woody invasion. Annual burns favor grasses. Kaziranga uses controlled burns for rhino habitat maintenance.

Fire regime (frequency, intensity, season) determines community composition.`,
      analogy: `Fire is like pruning a garden: destructive short-term but essential long-term`,
      storyConnection: `In the story of Kaziranga's tall grass, the grassland needs fire like the story needs conflict: it drives renewal`,
      checkQuestion: `Why burn annually rather than every 3-5 years?`,
      checkAnswer: `Annual burns prevent fuel accumulation. Multi-year gaps create intense fires that damage soil and kill mature trees.`,
      codeIntro: `Build the computational model for fire analysis.`,
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
      successHint: `This model captures the essential dynamics of grassland ecology. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Logistic growth modeling for grass biomass`,
      concept: `dB/dt = r*B*(1-B/K) - g*B, where g is grazing intensity. After fire, B drops and regrows.

Equilibrium biomass B* = K*(1-g/r). Critical grazing threshold: g=r causes collapse.`,
      analogy: `Grass growth is like filling a bathtub: fast when empty, slowing as it fills`,
      storyConnection: `In the story of Kaziranga's tall grass, the grass rebounds after every setback, following the same mathematical curve`,
      checkQuestion: `Doubling grazing intensity g: does equilibrium biomass halve?`,
      checkAnswer: `No. B* = K*(1-g/r). Doubling g reduces B* by K*g/r, not by half. If g approaches r, the grassland collapses.`,
      codeIntro: `Build the computational model for logistic analysis.`,
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
      successHint: `This model captures the essential dynamics of grassland ecology. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Spatial patterns using Ripley's K-function`,
      concept: `K(r) > pi*r^2 indicates clustering; K(r) < pi*r^2 indicates regularity. Tall grasses cluster (vegetative reproduction); short grasses are random (seed dispersal).`,
      analogy: `Spatial analysis is like reading a crowd: clumps = friends, even spacing = concert seating, random = shoppers`,
      storyConnection: `In the story of Kaziranga's tall grass, the patterns in the grass reveal the ecology beneath`,
      checkQuestion: `Tall grasses cluster while short grasses are random. Why?`,
      checkAnswer: `Tall grasses spread by rhizomes (clumping). Short grasses rely on seeds (random distribution).`,
      codeIntro: `Build the computational model for spatial analysis.`,
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
      successHint: `This model captures the essential dynamics of grassland ecology. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Carbon flux and climate feedbacks`,
      concept: `NEE = GPP - R_eco. Grasslands store 30% of global terrestrial carbon. Fire releases carbon but stimulates regrowth. Well-managed grasslands are approximately carbon-neutral.

Flooding creates anaerobic conditions preserving soil carbon.`,
      analogy: `Carbon flux is like a bank account: photosynthesis deposits, respiration withdraws`,
      storyConnection: `In the story of Kaziranga's tall grass, every blade of grass is a small carbon engine, collectively shaping the atmosphere`,
      checkQuestion: `How does flooding affect carbon flux?`,
      checkAnswer: `Flooding slows decomposition (anaerobic), preserving soil carbon. Short-term GPP drops but long-term soil C increases.`,
      codeIntro: `Build the computational model for carbon analysis.`,
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
      successHint: `This model captures the essential dynamics of grassland ecology. The same mathematical framework applies to real-world systems at any scale.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises model grassland ecology. Click to start.</p>
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
