import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FriendshipBridgeLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Forces on a bridge',
      concept: `**Forces on a bridge** is a core concept in structural engineering. A bridge must resist gravity (dead load), traffic (live load), wind, and earthquakes. The bending moment increases with the square of span length, which is why long bridges need deeper beams or suspension cables.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between span length and bending moment follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Forces on a bridge is like adjusting a recipe: changing one ingredient (span length) affects the final dish (bending moment) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, two villages build a bridge to connect their communities. This connects to forces on a bridge because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the span length, what happens to the bending moment? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For forces on a bridge, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how span length affects bending moment.',
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
ax1.set_xlabel('Span (m)', color='white')
ax1.set_ylabel('Bending moment (kN*m)', color='white')
ax1.set_title('Bridge Span vs Internal Forces', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Span (m)', color='white')
ax2.set_ylabel('Bending moment (kN*m)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Forces on a bridge analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for forces on a bridge. What parameter values best fit observed measurements?',
      successHint: 'Forces on a bridge is fundamental to structural engineering. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Beam bridges and bending',
      concept: `**Beam bridges and bending** is a core concept in structural engineering. A simply supported beam deflects most at its center. Deflection = WL^3/(48EI), where W=load, L=span, E=elastic modulus, I=moment of inertia. Doubling the span increases deflection 8x.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between load position and deflection follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Beam bridges and bending is like adjusting a recipe: changing one ingredient (load position) affects the final dish (deflection) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, two villages build a bridge to connect their communities. This connects to beam bridges and bending because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the load position, what happens to the deflection? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For beam bridges and bending, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how load position affects deflection.',
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
ax1.set_xlabel('Load position (m)', color='white')
ax1.set_ylabel('Deflection (mm)', color='white')
ax1.set_title('Beam Deflection Under Load', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Load position (m)', color='white')
ax2.set_ylabel('Deflection (mm)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Beam bridges and bending analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for beam bridges and bending. What parameter values best fit observed measurements?',
      successHint: 'Beam bridges and bending is fundamental to structural engineering. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Truss structures',
      concept: `**Truss structures** is a core concept in structural engineering. Trusses use triangles to distribute forces efficiently. A triangle is the only polygon that cannot be deformed without changing member lengths. This makes trusses inherently rigid and strong.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between number of triangles and load capacity follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Truss structures is like adjusting a recipe: changing one ingredient (number of triangles) affects the final dish (load capacity) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, two villages build a bridge to connect their communities. This connects to truss structures because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the number of triangles, what happens to the load capacity? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For truss structures, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how number of triangles affects load capacity.',
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
ax1.set_xlabel('Number of members', color='white')
ax1.set_ylabel('Max load (kN)', color='white')
ax1.set_title('Truss Efficiency', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Number of members', color='white')
ax2.set_ylabel('Max load (kN)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Truss structures analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for truss structures. What parameter values best fit observed measurements?',
      successHint: 'Truss structures is fundamental to structural engineering. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Suspension bridge cables',
      concept: `**Suspension bridge cables** is a core concept in structural engineering. A suspension bridge cable follows a parabolic curve (catenary under self-weight). Less sag means higher tension. The Golden Gate Bridge cables support 200 million pounds.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between cable sag and cable tension follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Suspension bridge cables is like adjusting a recipe: changing one ingredient (cable sag) affects the final dish (cable tension) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, two villages build a bridge to connect their communities. This connects to suspension bridge cables because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the cable sag, what happens to the cable tension? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For suspension bridge cables, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how cable sag affects cable tension.',
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
ax1.set_xlabel('Sag ratio (sag/span)', color='white')
ax1.set_ylabel('Cable tension (kN)', color='white')
ax1.set_title('Cable Tension vs Sag', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Sag ratio (sag/span)', color='white')
ax2.set_ylabel('Cable tension (kN)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Suspension bridge cables analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for suspension bridge cables. What parameter values best fit observed measurements?',
      successHint: 'Suspension bridge cables is fundamental to structural engineering. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Material properties',
      concept: `**Material properties** is a core concept in structural engineering. Steel is elastic up to its yield point (250-350 MPa), then deforms permanently. Concrete is strong in compression (30-50 MPa) but weak in tension (3-5 MPa). Reinforced concrete combines both.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between stress and strain follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Material properties is like adjusting a recipe: changing one ingredient (stress) affects the final dish (strain) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, two villages build a bridge to connect their communities. This connects to material properties because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the stress, what happens to the strain? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For material properties, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how stress affects strain.',
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
ax1.set_xlabel('Stress (MPa)', color='white')
ax1.set_ylabel('Strain (%)', color='white')
ax1.set_title('Stress-Strain Curves for Bridge Materials', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Stress (MPa)', color='white')
ax2.set_ylabel('Strain (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Material properties analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for material properties. What parameter values best fit observed measurements?',
      successHint: 'Material properties is fundamental to structural engineering. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Bridge failure analysis',
      concept: `**Bridge failure analysis** is a core concept in structural engineering. Bridges deteriorate through corrosion, fatigue, and wear. Regular inspection and maintenance extend service life from 50 to 100+ years. The I-35W bridge collapse (2007) killed 13 people due to inadequate inspection.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between corrosion rate and remaining capacity follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Bridge failure analysis is like adjusting a recipe: changing one ingredient (corrosion rate) affects the final dish (remaining capacity) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, two villages build a bridge to connect their communities. This connects to bridge failure analysis because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the corrosion rate, what happens to the remaining capacity? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For bridge failure analysis, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how corrosion rate affects remaining capacity.',
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
ax1.set_xlabel('Years of exposure', color='white')
ax1.set_ylabel('Structural capacity (%)', color='white')
ax1.set_title('Bridge Degradation Over Time', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Years of exposure', color='white')
ax2.set_ylabel('Structural capacity (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bridge failure analysis analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for bridge failure analysis. What parameter values best fit observed measurements?',
      successHint: 'Bridge failure analysis is fundamental to structural engineering. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Bridge Engineering & Structural Design</span>
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
