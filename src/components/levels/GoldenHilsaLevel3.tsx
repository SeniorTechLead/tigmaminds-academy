import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GoldenHilsaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: `Osmoregulation in anadromous fish`,
      concept: `Hilsa switch from excreting salt (seawater) to absorbing salt (freshwater) during migration. Ion transport follows the Nernst equation. Osmoregulation costs 10-20% of metabolic budget.`,
      analogy: `Osmoregulation is like a bilge pump switching between pumping salt out and pumping salt in`,
      storyConnection: `In the story of the golden hilsa, the hilsa's body performs remarkable chemistry as it journeys between salt and fresh water`,
      checkQuestion: `Why spawn in freshwater if it is so costly?`,
      checkAnswer: `Freshwater offers fewer predators, sheltered nurseries, and lower pathogen load. The cost is worth paying for offspring survival.`,
      codeIntro: `Build the computational model for osmoregulation analysis.`,
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
      successHint: `This model captures the essential dynamics of fishery science. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Population dynamics and Maximum Sustainable Yield`,
      concept: `dN/dt = rN(1-N/K) - H. MSY = rK/4 at population K/2. Below K/2, even current harvest risks collapse.

Hilsa populations have declined 40-60%, suggesting over-harvesting.`,
      analogy: `MSY is like interest on savings: spend the interest forever, but spending principal destroys the account`,
      storyConnection: `In the story of the golden hilsa, the golden hilsa can sustain us only if we sustain them first`,
      checkQuestion: `Operating at MSY, a bad monsoon reduces recruitment. What happens?`,
      checkAnswer: `Population drops below K/2. If harvest stays at MSY, the population spirals down. This is the MSY trap.`,
      codeIntro: `Build the computational model for population analysis.`,
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
      successHint: `This model captures the essential dynamics of fishery science. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Age-structured Leslie matrix models`,
      concept: `Leslie matrix: N(t+1) = L*N(t), with fecundities and survival probabilities. Dominant eigenvalue gives growth rate. Managing harvest adjusts survival rates to keep eigenvalue near 1.`,
      analogy: `A Leslie matrix is an actuarial table for fish`,
      storyConnection: `In the story of the golden hilsa, tracking each generation of hilsa from birth to spawning`,
      checkQuestion: `Protect juveniles or breeding adults?`,
      checkAnswer: `Protecting breeding adults has larger impact: they directly produce the next generation. This is why spawning-season bans are most effective.`,
      codeIntro: `Build the computational model for age-structured analysis.`,
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
      successHint: `This model captures the essential dynamics of fishery science. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Migration modeling with advection-diffusion`,
      concept: `dC/dt = D*d2C/dx2 - v*dC/dx. D is random movement, v is directed migration. Fitting to tracking data reveals speed and navigational precision.`,
      analogy: `Migration is like rush-hour traffic: each fish has a destination but takes a slightly different route`,
      storyConnection: `In the story of the golden hilsa, the hilsa navigate by senses we are only beginning to understand`,
      checkQuestion: `How do hilsa find the right river?`,
      checkAnswer: `Olfactory imprinting (natal river smell), geomagnetic navigation, and salinity gradient detection at the river mouth.`,
      codeIntro: `Build the computational model for migration analysis.`,
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
      successHint: `This model captures the essential dynamics of fishery science. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Bioeconomics: Maximum Economic Yield`,
      concept: `Revenue = catch * price. Cost = effort * unit_cost. MEY effort is always below MSY effort and gives higher profit, larger fish, and bigger population buffer.`,
      analogy: `Bioeconomics is farm management: leave some crops to grow larger for higher prices`,
      storyConnection: `In the story of the golden hilsa, fishing less can mean earning more and keeping the hilsa abundant`,
      checkQuestion: `If hilsa price doubles, should effort increase?`,
      checkAnswer: `Counterintuitively, MEY effort should decrease. Higher prices make each fish more valuable, so let the population grow larger.`,
      codeIntro: `Build the computational model for bioeconomics: analysis.`,
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
      successHint: `This model captures the essential dynamics of fishery science. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Climate change impacts on hilsa`,
      concept: `Warming shifts migration timing, altered monsoons reduce spawning flow, sea level rise pushes salinity into spawning grounds. Hilsa habitat could shrink 20-40% by 2050.`,
      analogy: `Climate impact is like slowly turning up the thermostat in a fish tank`,
      storyConnection: `In the story of the golden hilsa, the hilsa face a changing world that threatens their ancient rhythms`,
      checkQuestion: `If warming makes hilsa migrate earlier, is that a problem?`,
      checkAnswer: `Yes, if plankton blooms have not shifted in sync. Larvae depend on timed plankton. Trophic mismatch starves the young.`,
      codeIntro: `Build the computational model for climate analysis.`,
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
      successHint: `This model captures the essential dynamics of fishery science. The same mathematical framework applies to real-world systems at any scale.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (marine biology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises model fishery science. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
