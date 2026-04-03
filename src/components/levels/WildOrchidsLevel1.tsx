import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function WildOrchidsLevel1() {
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
      title: 'Epiphyte ecology',
      concept: `**Epiphyte ecology** is a core concept in ecology and symbiosis. Epiphytes are plants that grow on other plants without parasitizing them. They access more light in the canopy but must obtain water and nutrients from rain, air, and debris. A single rainforest tree can host 50+ epiphyte species.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between canopy height and species diversity follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Epiphyte ecology is like adjusting a recipe: changing one ingredient (canopy height) affects the final dish (species diversity) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, wild orchids growing high in the forest canopy survive without touching the ground. This connects to epiphyte ecology because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the canopy height, what happens to the species diversity? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For epiphyte ecology, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how canopy height affects species diversity.',
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
ax1.set_xlabel('Height above ground (m)', color='white')
ax1.set_ylabel('Species count', color='white')
ax1.set_title('Vertical Stratification of Epiphytes', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Height above ground (m)', color='white')
ax2.set_ylabel('Species count', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Epiphyte ecology analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for epiphyte ecology. What parameter values best fit observed measurements?',
      successHint: 'Epiphyte ecology is fundamental to ecology and symbiosis. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Mycorrhizal networks',
      concept: `**Mycorrhizal networks** is a core concept in ecology and symbiosis. Mycorrhizal fungi connect tree roots in vast underground networks (the Wood Wide Web). Trees share carbon, water, and nutrients through these fungal highways. Orchids are especially dependent on mycorrhizal partners.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between network connections and nutrient transfer follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Mycorrhizal networks is like adjusting a recipe: changing one ingredient (network connections) affects the final dish (nutrient transfer) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, wild orchids growing high in the forest canopy survive without touching the ground. This connects to mycorrhizal networks because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the network connections, what happens to the nutrient transfer? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For mycorrhizal networks, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how network connections affects nutrient transfer.',
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
ax1.set_xlabel('Number of connected trees', color='white')
ax1.set_ylabel('Nutrient flow (mg/day)', color='white')
ax1.set_title('Underground Fungal Networks', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Number of connected trees', color='white')
ax2.set_ylabel('Nutrient flow (mg/day)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Mycorrhizal networks analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for mycorrhizal networks. What parameter values best fit observed measurements?',
      successHint: 'Mycorrhizal networks is fundamental to ecology and symbiosis. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Types of symbiosis',
      concept: `**Types of symbiosis** is a core concept in ecology and symbiosis. Symbiosis includes mutualism (+/+), commensalism (+/0), and parasitism (+/-). Most orchid-tree relationships are commensal: the orchid benefits, the tree is unaffected. But some orchids are mycoheterotrophic (parasitic on fungi).\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between interaction strength and fitness change follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Types of symbiosis is like adjusting a recipe: changing one ingredient (interaction strength) affects the final dish (fitness change) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, wild orchids growing high in the forest canopy survive without touching the ground. This connects to types of symbiosis because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the interaction strength, what happens to the fitness change? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For types of symbiosis, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how interaction strength affects fitness change.',
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
ax1.set_xlabel('Interaction intensity', color='white')
ax1.set_ylabel('Fitness impact', color='white')
ax1.set_title('Mutualism, Commensalism, and Parasitism', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Interaction intensity', color='white')
ax2.set_ylabel('Fitness impact', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Types of symbiosis analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for types of symbiosis. What parameter values best fit observed measurements?',
      successHint: 'Types of symbiosis is fundamental to ecology and symbiosis. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Pollination ecology',
      concept: `**Pollination ecology** is a core concept in ecology and symbiosis. Orchids have the most specialized pollination in the plant kingdom. Some mimic female insects to attract male pollinators (sexual deception). Others trap pollinators temporarily. Darwin predicted a moth with a 30cm tongue to pollinate a Madagascar orchid; it was found 40 years later.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between flower shape and pollinator specificity follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Pollination ecology is like adjusting a recipe: changing one ingredient (flower shape) affects the final dish (pollinator specificity) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, wild orchids growing high in the forest canopy survive without touching the ground. This connects to pollination ecology because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the flower shape, what happens to the pollinator specificity? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For pollination ecology, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how flower shape affects pollinator specificity.',
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
ax1.set_xlabel('Flower morphology index', color='white')
ax1.set_ylabel('Pollinator species', color='white')
ax1.set_title('Orchid Pollination Strategies', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Flower morphology index', color='white')
ax2.set_ylabel('Pollinator species', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Pollination ecology analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for pollination ecology. What parameter values best fit observed measurements?',
      successHint: 'Pollination ecology is fundamental to ecology and symbiosis. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Water capture strategies',
      concept: `**Water capture strategies** is a core concept in ecology and symbiosis. Canopy epiphytes face drought stress between rains. Solutions include velamen roots (spongy, absorb rain instantly), succulent leaves (store water), and CAM photosynthesis (open stomata at night to reduce water loss).\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between rainfall pattern and water storage follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Water capture strategies is like adjusting a recipe: changing one ingredient (rainfall pattern) affects the final dish (water storage) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, wild orchids growing high in the forest canopy survive without touching the ground. This connects to water capture strategies because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the rainfall pattern, what happens to the water storage? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For water capture strategies, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how rainfall pattern affects water storage.',
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
ax1.set_xlabel('Rainfall (mm/week)', color='white')
ax1.set_ylabel('Stored water (ml)', color='white')
ax1.set_title('Epiphyte Water Management', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Rainfall (mm/week)', color='white')
ax2.set_ylabel('Stored water (ml)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Water capture strategies analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for water capture strategies. What parameter values best fit observed measurements?',
      successHint: 'Water capture strategies is fundamental to ecology and symbiosis. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Conservation of orchids',
      concept: `**Conservation of orchids** is a core concept in ecology and symbiosis. Orchids are among the most threatened plant families. Over 50% face habitat loss. Their extreme pollinator specificity and mycorrhizal dependence make them vulnerable: lose the fungus or pollinator, and the orchid disappears.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between habitat loss rate and extinction probability follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Conservation of orchids is like adjusting a recipe: changing one ingredient (habitat loss rate) affects the final dish (extinction probability) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, wild orchids growing high in the forest canopy survive without touching the ground. This connects to conservation of orchids because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the habitat loss rate, what happens to the extinction probability? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For conservation of orchids, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how habitat loss rate affects extinction probability.',
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
ax1.set_xlabel('Deforestation rate (%/yr)', color='white')
ax1.set_ylabel('Extinction risk', color='white')
ax1.set_title('Orchid Conservation Status', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Deforestation rate (%/yr)', color='white')
ax2.set_ylabel('Extinction risk', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Conservation of orchids analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for conservation of orchids. What parameter values best fit observed measurements?',
      successHint: 'Conservation of orchids is fundamental to ecology and symbiosis. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Epiphytes & Symbiosis</span>
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
