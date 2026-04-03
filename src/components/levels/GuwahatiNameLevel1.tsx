import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GuwahatiNameLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Etymology and place names',
      concept: `**Etymology and place names** is a core concept in linguistics and geography. Guwahati derives from Assamese: guwa (areca nut/betel nut) + haat (market). Place names are fossils of history: they preserve the language, economy, and culture of the people who named them.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between language family and name meaning follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Etymology and place names is like adjusting a recipe: changing one ingredient (language family) affects the final dish (name meaning) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the city of Guwahati reveals its history through the origins of its name. This connects to etymology and place names because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the language family, what happens to the name meaning? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For etymology and place names, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how language family affects name meaning.',
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
ax1.set_xlabel('Language layer', color='white')
ax1.set_ylabel('Meaning depth', color='white')
ax1.set_title('Layers of Place Name Etymology', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Language layer', color='white')
ax2.set_ylabel('Meaning depth', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Etymology and place names analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for etymology and place names. What parameter values best fit observed measurements?',
      successHint: 'Etymology and place names is fundamental to linguistics and geography. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Urban growth patterns',
      concept: `**Urban growth patterns** is a core concept in linguistics and geography. Cities grow in predictable patterns: concentric rings (Burgess model), sectors along transport routes (Hoyt model), or multiple nuclei (Harris-Ullman model). Guwahati follows the river-axis pattern, elongated along the Brahmaputra.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between time period and city area follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Urban growth patterns is like adjusting a recipe: changing one ingredient (time period) affects the final dish (city area) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the city of Guwahati reveals its history through the origins of its name. This connects to urban growth patterns because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the time period, what happens to the city area? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For urban growth patterns, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how time period affects city area.',
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
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Urban area (km2)', color='white')
ax1.set_title('Urban Expansion Over Time', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Urban area (km2)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Urban growth patterns analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for urban growth patterns. What parameter values best fit observed measurements?',
      successHint: 'Urban growth patterns is fundamental to linguistics and geography. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Geographic information systems',
      concept: `**Geographic information systems** is a core concept in linguistics and geography. GIS combines map layers (topography, land use, population, infrastructure) for spatial analysis. Urban planners use GIS to identify flood zones, plan roads, and site schools.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between data layers and spatial analysis follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Geographic information systems is like adjusting a recipe: changing one ingredient (data layers) affects the final dish (spatial analysis) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the city of Guwahati reveals its history through the origins of its name. This connects to geographic information systems because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the data layers, what happens to the spatial analysis? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For geographic information systems, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how data layers affects spatial analysis.',
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
ax1.set_xlabel('Number of data layers', color='white')
ax1.set_ylabel('Analysis capability', color='white')
ax1.set_title('GIS for Urban Planning', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Number of data layers', color='white')
ax2.set_ylabel('Analysis capability', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Geographic information systems analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for geographic information systems. What parameter values best fit observed measurements?',
      successHint: 'Geographic information systems is fundamental to linguistics and geography. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Flood risk mapping',
      concept: `**Flood risk mapping** is a core concept in linguistics and geography. Guwahati floods regularly because much of the city sits in the Brahmaputra floodplain. Flood risk decreases exponentially with elevation above river level. GIS-based flood maps guide building codes and insurance.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between elevation and flood probability follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Flood risk mapping is like adjusting a recipe: changing one ingredient (elevation) affects the final dish (flood probability) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the city of Guwahati reveals its history through the origins of its name. This connects to flood risk mapping because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the elevation, what happens to the flood probability? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For flood risk mapping, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how elevation affects flood probability.',
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
ax1.set_xlabel('Elevation above river (m)', color='white')
ax1.set_ylabel('Annual flood probability (%)', color='white')
ax1.set_title('Elevation-Based Flood Risk', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Elevation above river (m)', color='white')
ax2.set_ylabel('Annual flood probability (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Flood risk mapping analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for flood risk mapping. What parameter values best fit observed measurements?',
      successHint: 'Flood risk mapping is fundamental to linguistics and geography. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Transport network analysis',
      concept: `**Transport network analysis** is a core concept in linguistics and geography. Travel time depends not just on distance but on network connectivity. A well-connected grid allows many route choices (resilience). Guwahati chokepoints (bridges, narrow roads) create congestion disproportionate to traffic volume.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between road connectivity and travel time follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Transport network analysis is like adjusting a recipe: changing one ingredient (road connectivity) affects the final dish (travel time) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the city of Guwahati reveals its history through the origins of its name. This connects to transport network analysis because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the road connectivity, what happens to the travel time? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For transport network analysis, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how road connectivity affects travel time.',
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
ax1.set_xlabel('Network density (km/km2)', color='white')
ax1.set_ylabel('Average travel time (min)', color='white')
ax1.set_title('Urban Transport Efficiency', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Network density (km/km2)', color='white')
ax2.set_ylabel('Average travel time (min)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Transport network analysis analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for transport network analysis. What parameter values best fit observed measurements?',
      successHint: 'Transport network analysis is fundamental to linguistics and geography. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Urban heat island effect',
      concept: `**Urban heat island effect** is a core concept in linguistics and geography. Cities are warmer than surrounding rural areas (2-5C) because concrete absorbs heat, AC exhaust adds heat, and fewer trees means less evaporative cooling. Guwahati temperature has risen 1.5C above regional average due to urbanization.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between built-up fraction and temperature excess follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Urban heat island effect is like adjusting a recipe: changing one ingredient (built-up fraction) affects the final dish (temperature excess) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the city of Guwahati reveals its history through the origins of its name. This connects to urban heat island effect because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the built-up fraction, what happens to the temperature excess? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For urban heat island effect, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how built-up fraction affects temperature excess.',
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
ax1.set_xlabel('Impervious surface (%)', color='white')
ax1.set_ylabel('Temperature above rural (C)', color='white')
ax1.set_title('Urban Heat Island Intensity', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Impervious surface (%)', color='white')
ax2.set_ylabel('Temperature above rural (C)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Urban heat island effect analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for urban heat island effect. What parameter values best fit observed measurements?',
      successHint: 'Urban heat island effect is fundamental to linguistics and geography. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Etymology & Urban Geography</span>
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
            />
        ))}
      </div>
    </div>
  );
}
