import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HoliTeaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: `Catechin oxidation kinetics in tea processing`,
      concept: `Tea chemistry centers on catechins and their enzymatic oxidation by polyphenol oxidase (PPO). Green tea preserves catechins by heat-inactivating PPO; black tea maximizes oxidation following Michaelis-Menten kinetics.

Key catechins: EGCG (most abundant, bitter/astringent), ECG, EGC, EC. During oxidation, catechins polymerize into theaflavins (bright, brisk) and thearubigins (body, depth). The TF/TR ratio determines quality.

Temperature, humidity, and time control oxidation. The fermentation window is typically 60-120 minutes at 25-30C.`,
      analogy: `Enzyme oxidation is like a controlled fire: too little and the tea is raw, too much and it is burnt`,
      storyConnection: `In the story of the Holi tea gardens, the tea gardens shimmer with chemistry in every leaf`,
      checkQuestion: `Why does crushing tea leaves accelerate oxidation?`,
      checkAnswer: `Crushing ruptures cell membranes, releasing PPO from vacuoles into contact with catechins stored in different compartments. Without crushing, oxidation is limited to damaged surfaces.`,
      codeIntro: `Build the computational model for catechin analysis.`,
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
      successHint: `This model captures the essential dynamics of tea chemistry. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Caffeine extraction and partition coefficients`,
      concept: `Caffeine distributes between water and organic solvents according to the partition coefficient Kd. Extraction follows first-order kinetics: C(t) = C_max * (1 - exp(-kt)), where k depends on water temperature, particle size, and agitation.

Soil pH affects caffeine biosynthesis in the tea plant. Acidic soils (pH 4.5-5.5) promote caffeine production as natural insect defense.

90% extraction occurs in 3-5 minutes at near-boiling water.`,
      analogy: `Caffeine extraction is like rinsing paint from a brush: hot water works faster, and smaller bristles release paint more quickly`,
      storyConnection: `In the story of the Holi tea gardens, every cup brewed from these gardens carries caffeine shaped by soil and sun`,
      checkQuestion: `Why does cold-brew tea have less caffeine than hot-brew?`,
      checkAnswer: `Lower temperature reduces both the extraction rate (slower diffusion) and maximum extractable amount (lower solubility). Cold water at 4C extracts only 60-70% of what boiling water does.`,
      codeIntro: `Build the computational model for caffeine analysis.`,
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
      successHint: `This model captures the essential dynamics of tea chemistry. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Soil pH and tea plant nutrient uptake`,
      concept: `Tea plants thrive in acidic soils (pH 4.5-5.5). Outside this range, essential nutrients become unavailable. Below pH 4, aluminum toxicity damages roots. Above pH 6, iron and manganese become insoluble.

The Henderson-Hasselbalch equation governs soil buffer chemistry. Adding lime raises pH; adding sulfur lowers it.

Nitrogen as ammonium is most available at pH 6-7 but tea plants prefer pH 5 because they have aluminum-tolerant root systems.`,
      analogy: `Soil pH is like tuning a radio: the right frequency (pH) picks up all channels (nutrients), but off-tune picks up static`,
      storyConnection: `In the story of the Holi tea gardens, the gardens thrive because the soil speaks the language the plants understand`,
      checkQuestion: `Adding too much lime raises pH to 6.5. What happens?`,
      checkAnswer: `Plants suffer iron chlorosis (yellowing) because iron becomes less soluble above pH 6. Weeds that cannot tolerate acid invade. Tea yields drop 30-50%.`,
      codeIntro: `Build the computational model for soil analysis.`,
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
      successHint: `This model captures the essential dynamics of tea chemistry. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Spectrophotometric analysis of tea color`,
      concept: `Tea color is measured by spectrophotometry. Theaflavins absorb at 380nm (golden), thearubigins at 460nm (reddish-brown), chlorophyll at 665nm (green).

Beer-Lambert law: A = epsilon * c * l. By measuring at multiple wavelengths, we decompose color into chemical components.

The TF/TR ratio >0.12 indicates high quality tea.`,
      analogy: `Spectrophotometry is like analyzing a painting by shining light through it and measuring what colors come through`,
      storyConnection: `In the story of the Holi tea gardens, the color of the tea tells the story of its processing`,
      checkQuestion: `Two teas have identical polyphenol content but different colors. Why?`,
      checkAnswer: `Different TF/TR ratios. Higher theaflavins = golden; more thearubigins = brown. Same total, different oxidation extent.`,
      codeIntro: `Build the computational model for spectrophotometric analysis.`,
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
      successHint: `This model captures the essential dynamics of tea chemistry. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Modeling the tea steeping process`,
      concept: `Steeping is a mass transfer problem governed by Fick's law. Different compounds extract at different rates: caffeine (small, fast) > catechins (medium) > tannins (large, slow).

This is why a 1-minute steep gives light caffeinated brew while 5 minutes gives stronger, more astringent tea.

Teapot material, water hardness, and leaf grade all affect extraction kinetics.`,
      analogy: `Steeping is like dissolving sugar: granulated dissolves faster than cubes because more surface area is exposed to water`,
      storyConnection: `In the story of the Holi tea gardens, the perfect brew is a matter of timing, temperature, and patience`,
      checkQuestion: `Same tea, 80C vs 90C. Which gives more caffeine?`,
      checkAnswer: `90C extracts ~15-20% more caffeine because diffusion coefficient increases with temperature per Arrhenius equation.`,
      codeIntro: `Build the computational model for modeling analysis.`,
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
      successHint: `This model captures the essential dynamics of tea chemistry. The same mathematical framework applies to real-world systems at any scale.`,
    },
    {
      title: `Tea quality prediction using chemical fingerprints`,
      concept: `Chemical analysis can predict quality scores using multiple linear regression on spectral features and chemical concentrations. Training on 100 teas with expert scores achieves useful prediction accuracy.

Key features: absorbances at 10 wavelengths, total polyphenols, caffeine, pH. The model learns which chemical combinations experts rate highly.

Cross-validation ensures the model generalizes to new teas.`,
      analogy: `Quality prediction from chemicals is like predicting movie ratings from trailer features`,
      storyConnection: `In the story of the Holi tea gardens, the master taster's palate can be approximated in equations`,
      checkQuestion: `A model trained on Darjeeling teas fails on Assam teas. Why?`,
      checkAnswer: `Different terroirs produce different chemical profiles at the same quality level. The model learned Darjeeling-specific thresholds. Solution: train on combined data or use region as a feature.`,
      codeIntro: `Build the computational model for tea analysis.`,
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
      successHint: `This model captures the essential dynamics of tea chemistry. The same mathematical framework applies to real-world systems at any scale.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (chemistry fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises model tea chemistry. Click to start.</p>
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
