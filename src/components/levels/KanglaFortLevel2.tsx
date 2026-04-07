import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KanglaFortLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Mapping the moat — visualising the fort perimeter',
      concept: `The Kangla Fort has an irregular shape — not a perfect rectangle. To understand its hydraulic system, engineers need to **map** the moat's path and calculate the true perimeter.

We can approximate the fort's shape as a series of (x, y) coordinates and use **matplotlib** to plot it. The distance between consecutive points gives us the true perimeter — which is always longer than a simple length x width estimate.

**numpy** provides \`np.sqrt()\` for the distance formula:
\`d = sqrt((x2-x1)² + (y2-y1)²)\`

This is the same Pythagorean theorem you know, applied point by point around the fort.`,
      analogy: 'Measuring a perimeter with coordinates is like measuring a running track with a flexible tape measure. You follow every curve, not just the straight-line approximation. The more points you measure, the more accurate your answer.',
      storyConnection: 'The Meitei engineers who built Kangla did not have GPS or numpy — but they walked the perimeter, measured it with ropes, and knew its shape intimately. We are doing the same thing, but with code.',
      checkQuestion: 'Why does approximating the fort as a rectangle underestimate the moat volume?',
      checkAnswer: 'Real fort shapes have irregular curves and corners. A rectangle with the same area has the minimum perimeter. Any deviation from a rectangle adds perimeter, which means more moat length, more water, and more earth to move. The true moat is always longer than the simple estimate.',
      codeIntro: 'Plot the approximate shape of Kangla Fort and calculate its true perimeter.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Approximate Kangla Fort outline (simplified coordinates in metres)
# Origin at centre of fort
x = np.array([0, 200, 380, 400, 380, 200, 0, -200, -380, -400, -380, -200, 0])
y = np.array([300, 280, 200, 0, -200, -280, -300, -280, -200, 0, 200, 280, 300])

# Calculate perimeter
dx = np.diff(x)
dy = np.diff(y)
segment_lengths = np.sqrt(dx**2 + dy**2)
perimeter = np.sum(segment_lengths)

fig, ax = plt.subplots(1, 1, figsize=(8, 6))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Plot fort outline
ax.fill(x, y, alpha=0.3, color='#60a5fa', label='Fort area')
ax.plot(x, y, 'o-', color='#34d399', linewidth=2, markersize=5, label='Moat path')

ax.set_title(f'Kangla Fort Perimeter: {perimeter:.0f} m', color='white', fontsize=14, fontweight='bold')
ax.set_xlabel('East-West (m)', color='white')
ax.set_ylabel('North-South (m)', color='white')
ax.tick_params(colors='white')
ax.set_aspect('equal')
ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('fort_perimeter.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()
print(f"Perimeter: {perimeter:.0f} m")
print(f"Average segment length: {np.mean(segment_lengths):.0f} m")`,
      challenge: 'Add 4 more points to make the shape more realistic (less like an oval, more irregular). How does the perimeter change?',
      successHint: 'You just used coordinate geometry and matplotlib to map a real structure. Surveyors and architects use this exact approach with GPS coordinates.',
    },
    {
      title: 'Cross-section of a moat — area under a curve',
      concept: `A moat is not a perfect rectangle in cross-section. It has sloped sides (like a trapezoid) to prevent the banks from collapsing. The actual shape might look like a shallow bowl.

To calculate the volume of water, we need the **cross-sectional area** at many points along the moat. In calculus, this is integration — but with numpy we can use the **trapezoidal rule**: \`np.trapz(y, x)\`.

The trapezoidal rule approximates the area under a curve by dividing it into trapezoids. More points = better accuracy.

For a moat cross-section:
- The bottom is flat (about 5m wide)
- The sides slope outward at about 45 degrees
- The top is wider than the bottom`,
      analogy: 'The trapezoidal rule is like estimating the area of a lake by laying out a grid of rectangular tiles. Some tiles stick out past the edge, some fall short — but on average, the total tile area is close to the real lake area. More tiles = better estimate.',
      storyConnection: 'The Kangla moat was not a simple ditch. It was carefully shaped so the sides would not collapse during monsoons. The cross-section tells us how much water it actually held — the real defensive capacity of the fort.',
      checkQuestion: 'Why are moat sides sloped rather than vertical?',
      checkAnswer: 'Vertical earth walls collapse. Soil has an "angle of repose" — the steepest angle it can maintain without sliding. For most soils, this is 30-45 degrees. The Kangla engineers sloped the moat sides to match the local soil properties, preventing cave-ins that would fill in the moat.',
      codeIntro: 'Plot the cross-section of the Kangla moat and calculate its area using the trapezoidal rule.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Moat cross-section profile (distance from left bank, depth)
x_cross = np.array([0, 2, 4, 6, 8, 10, 12, 14, 15])  # metres from left bank
depth = np.array([0, -1.0, -2.2, -2.8, -3.0, -2.8, -2.2, -1.0, 0])  # depth below surface

# Calculate cross-sectional area using trapezoidal rule
area = np.trapz(-depth, x_cross)  # negative because depth is negative

fig, ax = plt.subplots(1, 1, figsize=(8, 5))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Fill water area
ax.fill_between(x_cross, depth, 0, alpha=0.4, color='#3b82f6', label='Water')
ax.fill_between(x_cross, depth, min(depth)-0.5, color='#92400e', alpha=0.6, label='Earth')
ax.plot(x_cross, depth, 'o-', color='#fbbf24', linewidth=2, markersize=6, label='Moat profile')
ax.axhline(y=0, color='#60a5fa', linestyle='--', alpha=0.5, label='Surface')

ax.set_title(f'Kangla Moat Cross-Section — Area = {area:.1f} m²', color='white', fontsize=13, fontweight='bold')
ax.set_xlabel('Distance from left bank (m)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.tick_params(colors='white')
ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('moat_cross_section.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()
print(f"Cross-sectional area: {area:.1f} m²")
print(f"Width at surface: {x_cross[-1] - x_cross[0]} m")
print(f"Maximum depth: {-min(depth):.1f} m")
print(f"If perimeter = 1580m, total volume ≈ {area * 1580:,.0f} m³")`,
      challenge: 'Reshape the moat to have a flat bottom 6m wide and steeper sides. Plot the new profile and compare the cross-sectional area.',
      successHint: 'The trapezoidal rule is a fundamental numerical integration technique. You just used it to solve a real engineering problem that calculus textbooks would express as an integral.',
    },
    {
      title: 'Flow rate through sluice gates — Torricelli\'s law',
      concept: `When a sluice gate opens, water rushes through. How fast? **Torricelli's law** tells us:

**v = sqrt(2 x g x h)**

Where:
- v = velocity of water exiting the gate (m/s)
- g = 9.8 m/s²
- h = height of water above the gate opening

The **flow rate** Q (cubic metres per second) is:
**Q = v x A**

Where A is the area of the gate opening.

This law was discovered by Evangelista Torricelli in 1643, but Meitei engineers understood it intuitively centuries earlier — they knew that a deeper moat pushes water out faster when the gate opens.`,
      analogy: 'Torricelli\'s law is why a water bottle empties faster when you poke a hole near the bottom versus near the top. More water above the hole means more pressure pushing the water out, which means higher exit velocity.',
      storyConnection: 'When Kangla Fort defenders opened a sluice gate, they needed to know how quickly the moat would drain or fill. Too slow, and the tactic fails. Too fast, and the flooding is uncontrollable. Torricelli\'s law governs this balance.',
      checkQuestion: 'If you double the water height above the gate, does the flow rate double?',
      checkAnswer: 'No — it increases by a factor of sqrt(2) ≈ 1.41. Because velocity depends on sqrt(h), doubling h increases velocity by 41%, not 100%. To double the flow rate, you need to quadruple the water height. This is the square root relationship at work.',
      codeIntro: 'Plot how flow rate changes with water depth behind a Kangla Fort sluice gate.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.8  # gravity
gate_width = 2.0   # metres
gate_height = 0.5  # opening height in metres
gate_area = gate_width * gate_height

# Water depth above the gate opening
h = np.linspace(0.1, 5.0, 100)

# Torricelli's law
velocity = np.sqrt(2 * g * h)
flow_rate = velocity * gate_area  # m³/s
flow_rate_lps = flow_rate * 1000   # litres per second

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.plot(h, velocity, color='#34d399', linewidth=2)
ax1.set_title('Exit Velocity vs Water Height', color='white', fontsize=11, fontweight='bold')
ax1.set_xlabel('Water height above gate (m)', color='white')
ax1.set_ylabel('Velocity (m/s)', color='white')
ax1.tick_params(colors='white')
ax1.grid(True, alpha=0.2, color='white')

ax2.plot(h, flow_rate_lps, color='#f59e0b', linewidth=2)
ax2.set_title('Flow Rate vs Water Height', color='white', fontsize=11, fontweight='bold')
ax2.set_xlabel('Water height above gate (m)', color='white')
ax2.set_ylabel('Flow rate (litres/s)', color='white')
ax2.tick_params(colors='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('sluice_flow.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()
print(f"At h=1m: velocity = {np.sqrt(2*g*1):.2f} m/s, flow = {np.sqrt(2*g*1)*gate_area*1000:.0f} L/s")
print(f"At h=3m: velocity = {np.sqrt(2*g*3):.2f} m/s, flow = {np.sqrt(2*g*3)*gate_area*1000:.0f} L/s")
print(f"At h=5m: velocity = {np.sqrt(2*g*5):.2f} m/s, flow = {np.sqrt(2*g*5)*gate_area*1000:.0f} L/s")`,
      challenge: 'What gate opening size would you need to drain 10,000 cubic metres of moat water in 2 hours, if the water height is 3m? Solve for gate_area.',
      successHint: 'Torricelli\'s law connects depth, velocity, and flow rate. It is the foundation of all hydraulic engineering — from ancient moats to modern dams and fire hydrants.',
    },
    {
      title: 'Soil analysis — what makes good rammed earth?',
      concept: `Not all soil is suitable for rammed earth construction. The ideal mix is:
- **30-40% sand**: provides structure (skeleton)
- **30-40% silt**: fills gaps (muscle)
- **10-20% clay**: acts as binder (glue)
- **5-10% gravel**: adds compressive strength (bone)

Too much clay → wall cracks as it dries.
Too much sand → wall crumbles, won't hold together.
The right mix → wall is strong, stable, and water-resistant.

We can visualise soil composition using **bar charts** and **pie charts** in matplotlib. These charts help engineers compare soil samples and decide which is best for building.`,
      analogy: 'Soil composition is like a recipe. Too much of any ingredient ruins the dish. Sand alone is like dry flour — it falls apart. Clay alone is like too much egg — it cracks when it dries. The perfect rammed earth has the right proportions, just like the perfect cake.',
      storyConnection: 'The Kangla builders tested their soil by feel — squeezing it, rolling it, wetting it. Modern soil scientists do the same thing with lab equipment. The fort\'s survival for centuries proves the Meitei got the recipe right.',
      checkQuestion: 'If a soil sample is 60% sand, would it make good rammed earth? Why or why not?',
      checkAnswer: 'No — 60% sand is too sandy. It would not hold together because there is not enough clay to bind the particles. The wall would crumble under its own weight. The builders would need to mix in clay-rich soil from another location, or find a better site.',
      codeIntro: 'Analyse and visualise three soil samples to find the best one for Kangla Fort walls.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Three soil samples from around Kangla Fort
samples = {
    'Site A (River bank)': [55, 25, 10, 10],  # sand, silt, clay, gravel
    'Site B (Hillside)':   [20, 25, 45, 10],
    'Site C (Valley floor)':[35, 30, 20, 15],
}
components = ['Sand', 'Silt', 'Clay', 'Gravel']
ideal = [35, 35, 15, 15]  # ideal composition

fig, axes = plt.subplots(1, 3, figsize=(12, 4))
fig.patch.set_facecolor('#1f2937')
colors = ['#f59e0b', '#a78bfa', '#ef4444', '#6b7280']

for idx, (name, composition) in enumerate(samples.items()):
    ax = axes[idx]
    ax.set_facecolor('#1f2937')
    bars = ax.bar(components, composition, color=colors, alpha=0.8, edgecolor='white', linewidth=0.5)
    ax.bar(components, ideal, fill=False, edgecolor='#34d399', linewidth=2, linestyle='--', label='Ideal')
    ax.set_title(name, color='white', fontsize=10, fontweight='bold')
    ax.set_ylabel('Percentage' if idx == 0 else '', color='white')
    ax.set_ylim(0, 65)
    ax.tick_params(colors='white', labelsize=8)
    if idx == 0:
        ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Score each sample (distance from ideal)
print("Soil Analysis Results:")
print("-" * 50)
for name, comp in samples.items():
    diff = sum(abs(c - i) for c, i in zip(comp, ideal))
    score = max(0, 100 - diff * 2)
    print(f"{name}: {comp}")
    print(f"  Score: {score}/100 {'*** BEST ***' if score > 70 else ''}")

plt.suptitle('Soil Composition Analysis for Rammed Earth', color='white', fontsize=13, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('soil_analysis.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()`,
      challenge: 'Create a fourth soil sample "Site D" with composition [40, 30, 15, 15]. Calculate its score. Can you find the composition that scores a perfect 100?',
      successHint: 'Material analysis is a core engineering skill. You just compared real-world samples against an ideal standard — the same process used in construction, manufacturing, and quality control.',
    },
    {
      title: 'Monsoon rainfall patterns — time series data',
      concept: `Imphal\'s monsoon determines how the Kangla moat operates. Engineers need to understand the **rainfall pattern** across the year to:
- Size the sluice gates (must handle peak flow)
- Plan maintenance (dry season = low water)
- Predict flooding risks (which months are dangerous?)

A **time series** is data measured at regular intervals over time — like monthly rainfall. We plot these with matplotlib to see trends, peaks, and patterns.

Key numpy functions for time series:
- \`np.max()\` — find the wettest month
- \`np.cumsum()\` — running total of rainfall
- \`np.mean()\` — average rainfall`,
      analogy: 'A time series is like a heartbeat monitor. Each data point is one pulse. Looking at a single pulse tells you very little, but the pattern over time reveals everything — regularity, spikes, abnormalities. Rainfall data works the same way.',
      storyConnection: 'The Kangla Fort commanders planned their military campaigns around the monsoon. They knew which months the moat would be full (impassable) and which months it would be low (vulnerable). Rainfall data was military intelligence.',
      checkQuestion: 'If May through September have the most rain, when would be the worst time to attack Kangla Fort?',
      checkAnswer: 'June-August would be the worst time to attack. The moat is at maximum depth, river currents are strongest, and the surrounding land is waterlogged mud. The best time to attack would be January-March, when the moat is at its shallowest — which is exactly what historical records show.',
      codeIntro: 'Plot Imphal\'s monthly rainfall and identify the critical months for moat management.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monthly rainfall in Imphal (mm) — historical average
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
rainfall = np.array([15, 28, 55, 110, 185, 260, 310, 280, 210, 120, 35, 12])
cumulative = np.cumsum(rainfall)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Monthly rainfall
colors = ['#3b82f6' if r < 100 else '#ef4444' if r > 250 else '#f59e0b' for r in rainfall]
ax1.bar(months, rainfall, color=colors, edgecolor='white', linewidth=0.5)
ax1.axhline(y=np.mean(rainfall), color='#34d399', linestyle='--', linewidth=2, label=f'Mean: {np.mean(rainfall):.0f} mm')
ax1.set_title('Monthly Rainfall in Imphal — Moat Management Guide', color='white', fontsize=13, fontweight='bold')
ax1.set_ylabel('Rainfall (mm)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')

# Cumulative rainfall
ax2.plot(months, cumulative, 'o-', color='#a78bfa', linewidth=2, markersize=6)
ax2.fill_between(months, cumulative, alpha=0.2, color='#a78bfa')
ax2.set_title('Cumulative Rainfall — Total Water Budget', color='white', fontsize=13, fontweight='bold')
ax2.set_ylabel('Cumulative rainfall (mm)', color='white')
ax2.tick_params(colors='white')

plt.tight_layout()
plt.savefig('rainfall.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print(f"Annual total: {cumulative[-1]} mm")
print(f"Wettest month: {months[np.argmax(rainfall)]} ({np.max(rainfall)} mm)")
print(f"Driest month: {months[np.argmin(rainfall)]} ({np.min(rainfall)} mm)")
print(f"Monsoon months (May-Sep): {np.sum(rainfall[4:9])} mm ({np.sum(rainfall[4:9])/cumulative[-1]*100:.0f}% of annual)")`,
      challenge: 'Calculate the standard deviation of monthly rainfall using np.std(). A high standard deviation means the rainfall is very uneven — which makes flood management harder.',
      successHint: 'You now know how to analyse time series data. This skill applies to weather, stock prices, sensor readings, and any data that changes over time.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Hydraulic Analysis & Visualization</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
