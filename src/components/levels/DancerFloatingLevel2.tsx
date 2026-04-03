import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DancerFloatingLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'General equilibrium theory',
      concept: `**General equilibrium theory** is a core concept in advanced economic theory. In a connected economy, prices in all markets are determined simultaneously. Adding a new trade route between markets changes prices everywhere, not just in the connected markets.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between number of markets and price convergence follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'General equilibrium theory is like adjusting a recipe: changing one ingredient (number of markets) affects the final dish (price convergence) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the dancer connects distant markets, serving as both cultural ambassador and economic catalyst. This connects to general equilibrium theory because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the number of markets, what happens to the price convergence? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For general equilibrium theory, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how number of markets affects price convergence.',
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
ax1.set_xlabel('Number of connected markets', color='white')
ax1.set_ylabel('Price variance', color='white')
ax1.set_title('Walrasian General Equilibrium', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Number of connected markets', color='white')
ax2.set_ylabel('Price variance', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("General equilibrium theory analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for general equilibrium theory. What parameter values best fit observed measurements?',
      successHint: 'General equilibrium theory is fundamental to advanced economic theory. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Information economics',
      concept: `**Information economics** is a core concept in advanced economic theory. Traders with better information (prices at distant markets) profit more. The dancer, traveling between markets, carries price information that reduces asymmetry and improves market efficiency.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between information asymmetry and market efficiency follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Information economics is like adjusting a recipe: changing one ingredient (information asymmetry) affects the final dish (market efficiency) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the dancer connects distant markets, serving as both cultural ambassador and economic catalyst. This connects to information economics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the information asymmetry, what happens to the market efficiency? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For information economics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how information asymmetry affects market efficiency.',
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
ax1.set_xlabel('Information gap', color='white')
ax1.set_ylabel('Price efficiency', color='white')
ax1.set_title('The Role of Information in Markets', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Information gap', color='white')
ax2.set_ylabel('Price efficiency', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Information economics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for information economics. What parameter values best fit observed measurements?',
      successHint: 'Information economics is fundamental to advanced economic theory. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Exchange rate dynamics',
      concept: `**Exchange rate dynamics** is a core concept in advanced economic theory. When village A buys more from village B than it sells, value flows from A to B. In a barter economy this manifests as terms of trade shifts; with currency it appears as exchange rate movements.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between trade balance and currency value follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Exchange rate dynamics is like adjusting a recipe: changing one ingredient (trade balance) affects the final dish (currency value) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the dancer connects distant markets, serving as both cultural ambassador and economic catalyst. This connects to exchange rate dynamics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the trade balance, what happens to the currency value? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For exchange rate dynamics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how trade balance affects currency value.',
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
ax1.set_xlabel('Trade surplus/deficit', color='white')
ax1.set_ylabel('Exchange rate', color='white')
ax1.set_title('Currency Flows in Regional Trade', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Trade surplus/deficit', color='white')
ax2.set_ylabel('Exchange rate', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Exchange rate dynamics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for exchange rate dynamics. What parameter values best fit observed measurements?',
      successHint: 'Exchange rate dynamics is fundamental to advanced economic theory. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Optimal transport theory',
      concept: `**Optimal transport theory** is a core concept in advanced economic theory. Given sources (farms) and destinations (markets), optimal transport theory finds the allocation that minimizes total transport cost. This is a linear programming problem with deep mathematical structure.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between route distance and transport cost follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Optimal transport theory is like adjusting a recipe: changing one ingredient (route distance) affects the final dish (transport cost) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the dancer connects distant markets, serving as both cultural ambassador and economic catalyst. This connects to optimal transport theory because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the route distance, what happens to the transport cost? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For optimal transport theory, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how route distance affects transport cost.',
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
ax1.set_xlabel('Distance', color='white')
ax1.set_ylabel('Optimal allocation', color='white')
ax1.set_title('Monge-Kantorovich Transport Problem', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Distance', color='white')
ax2.set_ylabel('Optimal allocation', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Optimal transport theory analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for optimal transport theory. What parameter values best fit observed measurements?',
      successHint: 'Optimal transport theory is fundamental to advanced economic theory. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Agent-based market simulation',
      concept: `**Agent-based market simulation** is a core concept in advanced economic theory. Individual traders following simple rules (buy low, sell high) create complex market patterns (price cycles, bubbles, crashes). These emergent behaviors cannot be predicted from individual behavior alone.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between number of agents and emergent patterns follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Agent-based market simulation is like adjusting a recipe: changing one ingredient (number of agents) affects the final dish (emergent patterns) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the dancer connects distant markets, serving as both cultural ambassador and economic catalyst. This connects to agent-based market simulation because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the number of agents, what happens to the emergent patterns? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For agent-based market simulation, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how number of agents affects emergent patterns.',
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
ax1.set_xlabel('Agents', color='white')
ax1.set_ylabel('Price stability', color='white')
ax1.set_title('Emergent Market Behavior', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Agents', color='white')
ax2.set_ylabel('Price stability', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Agent-based market simulation analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for agent-based market simulation. What parameter values best fit observed measurements?',
      successHint: 'Agent-based market simulation is fundamental to advanced economic theory. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Development impact of trade routes',
      concept: `**Development impact of trade routes** is a core concept in advanced economic theory. Historical evidence shows that regions with water trade access develop faster. The Brahmaputra river system enabled trade that shaped Assam and Northeast India development.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between trade connectivity and GDP growth follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Development impact of trade routes is like adjusting a recipe: changing one ingredient (trade connectivity) affects the final dish (GDP growth) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the dancer connects distant markets, serving as both cultural ambassador and economic catalyst. This connects to development impact of trade routes because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the trade connectivity, what happens to the GDP growth? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For development impact of trade routes, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how trade connectivity affects GDP growth.',
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
ax1.set_xlabel('Trade openness index', color='white')
ax1.set_ylabel('GDP growth rate (%)', color='white')
ax1.set_title('Trade as Development Engine', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Trade openness index', color='white')
ax2.set_ylabel('GDP growth rate (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Development impact of trade routes analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for development impact of trade routes. What parameter values best fit observed measurements?',
      successHint: 'Development impact of trade routes is fundamental to advanced economic theory. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Trade Economics</span>
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
