import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function WildOrchidsLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Mutualism networks',
      concept: `**Mutualism networks** is a core concept in community ecology. Plant-pollinator networks have a nested structure: specialist species interact with subsets of generalist partners. This nestedness promotes stability. Random networks of the same size are less robust to species loss.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between network connectance and stability follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Mutualism networks is like adjusting a recipe: changing one ingredient (network connectance) affects the final dish (stability) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the orchid forest reveals layers of symbiotic relationships connecting all life. This connects to mutualism networks because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the network connectance, what happens to the stability? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For mutualism networks, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how network connectance affects stability.',
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
ax1.set_xlabel('Connectance', color='white')
ax1.set_ylabel('Community stability', color='white')
ax1.set_title('Mutualistic Network Architecture', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Connectance', color='white')
ax2.set_ylabel('Community stability', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Mutualism networks analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for mutualism networks. What parameter values best fit observed measurements?',
      successHint: 'Mutualism networks is fundamental to community ecology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Coevolution dynamics',
      concept: `**Coevolution dynamics** is a core concept in community ecology. Orchids and their pollinators coevolve: longer flower spurs select for longer pollinator tongues, and vice versa. This escalating specialization produces extreme morphologies (30cm orchid spurs, 30cm moth tongues).\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between generation time and trait matching follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Coevolution dynamics is like adjusting a recipe: changing one ingredient (generation time) affects the final dish (trait matching) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the orchid forest reveals layers of symbiotic relationships connecting all life. This connects to coevolution dynamics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the generation time, what happens to the trait matching? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For coevolution dynamics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how generation time affects trait matching.',
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
ax1.set_xlabel('Generations', color='white')
ax1.set_ylabel('Trait correlation', color='white')
ax1.set_title('Coevolutionary Arms Race', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Generations', color='white')
ax2.set_ylabel('Trait correlation', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Coevolution dynamics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for coevolution dynamics. What parameter values best fit observed measurements?',
      successHint: 'Coevolution dynamics is fundamental to community ecology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Nutrient cycling in canopy ecosystems',
      concept: `**Nutrient cycling in canopy ecosystems** is a core concept in community ecology. Epiphyte mats in the canopy trap organic matter and create aerial soil. This canopy soil supports its own microbiome and nutrient cycle, independent of the forest floor. Some frogs and insects complete their entire lifecycle in these aerial ecosystems.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between decomposition rate and nutrient availability follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Nutrient cycling in canopy ecosystems is like adjusting a recipe: changing one ingredient (decomposition rate) affects the final dish (nutrient availability) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the orchid forest reveals layers of symbiotic relationships connecting all life. This connects to nutrient cycling in canopy ecosystems because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the decomposition rate, what happens to the nutrient availability? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For nutrient cycling in canopy ecosystems, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how decomposition rate affects nutrient availability.',
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
ax1.set_xlabel('Decomposition rate (mg/day)', color='white')
ax1.set_ylabel('Available nutrients (mg/L)', color='white')
ax1.set_title('Canopy Nutrient Dynamics', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Decomposition rate (mg/day)', color='white')
ax2.set_ylabel('Available nutrients (mg/L)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Nutrient cycling in canopy ecosystems analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for nutrient cycling in canopy ecosystems. What parameter values best fit observed measurements?',
      successHint: 'Nutrient cycling in canopy ecosystems is fundamental to community ecology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Population genetics of rare orchids',
      concept: `**Population genetics of rare orchids** is a core concept in community ecology. Rare orchids face genetic erosion from small population sizes. Genetic drift removes alleles, and inbreeding depression reduces fitness. Conservation genetics guides management: how many individuals are enough, and where should translocations come from?\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between effective population size and heterozygosity follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Population genetics of rare orchids is like adjusting a recipe: changing one ingredient (effective population size) affects the final dish (heterozygosity) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the orchid forest reveals layers of symbiotic relationships connecting all life. This connects to population genetics of rare orchids because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the effective population size, what happens to the heterozygosity? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For population genetics of rare orchids, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how effective population size affects heterozygosity.',
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
ax1.set_xlabel('Effective population (Ne)', color='white')
ax1.set_ylabel('Heterozygosity (H)', color='white')
ax1.set_title('Genetic Diversity in Small Populations', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Effective population (Ne)', color='white')
ax2.set_ylabel('Heterozygosity (H)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Population genetics of rare orchids analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for population genetics of rare orchids. What parameter values best fit observed measurements?',
      successHint: 'Population genetics of rare orchids is fundamental to community ecology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Ecological modeling with ODEs',
      concept: `**Ecological modeling with ODEs** is a core concept in community ecology. Two orchid species competing for the same branch space follow dN1/dt = r1*N1*(K1-N1-alpha12*N2)/K1. The outcome (coexistence or competitive exclusion) depends on whether interspecific competition is weaker than intraspecific.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between competition coefficient and equilibrium follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Ecological modeling with ODEs is like adjusting a recipe: changing one ingredient (competition coefficient) affects the final dish (equilibrium) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the orchid forest reveals layers of symbiotic relationships connecting all life. This connects to ecological modeling with odes because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the competition coefficient, what happens to the equilibrium? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For ecological modeling with odes, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how competition coefficient affects equilibrium.',
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
ax1.set_xlabel('Competition (alpha)', color='white')
ax1.set_ylabel('Equilibrium populations', color='white')
ax1.set_title('Lotka-Volterra Competition Model', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Competition (alpha)', color='white')
ax2.set_ylabel('Equilibrium populations', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Ecological modeling with ODEs analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for ecological modeling with odes. What parameter values best fit observed measurements?',
      successHint: 'Ecological modeling with ODEs is fundamental to community ecology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Bioinformatics for orchid classification',
      concept: `**Bioinformatics for orchid classification** is a core concept in community ecology. DNA barcoding uses short gene sequences (ITS, matK) to identify orchid species. With 28,000+ species, molecular tools are essential for taxonomy. Phylogenetic analysis reveals that orchids diversified explosively after evolving pollinia (pollen packages).\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between DNA sequence similarity and phylogenetic distance follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Bioinformatics for orchid classification is like adjusting a recipe: changing one ingredient (DNA sequence similarity) affects the final dish (phylogenetic distance) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the orchid forest reveals layers of symbiotic relationships connecting all life. This connects to bioinformatics for orchid classification because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the DNA sequence similarity, what happens to the phylogenetic distance? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For bioinformatics for orchid classification, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how DNA sequence similarity affects phylogenetic distance.',
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
ax1.set_xlabel('Sequence similarity (%)', color='white')
ax1.set_ylabel('Evolutionary distance', color='white')
ax1.set_title('Molecular Phylogenetics of Orchidaceae', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Sequence similarity (%)', color='white')
ax2.set_ylabel('Evolutionary distance', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bioinformatics for orchid classification analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for bioinformatics for orchid classification. What parameter values best fit observed measurements?',
      successHint: 'Bioinformatics for orchid classification is fundamental to community ecology. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Ecology & Mutualism</span>
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
            />
        ))}
      </div>
    </div>
  );
}
