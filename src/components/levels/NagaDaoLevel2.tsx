import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NagaDaoLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The iron-carbon phase diagram — mapping steel territories',
      concept: `The **iron-carbon phase diagram** is the most important chart in metallurgy. It maps which crystal phases exist at each combination of temperature and carbon content.

Key features:
- **Eutectoid point** (0.76% C, 727°C): where pearlite forms on cooling
- **Austenite region** (above 727°C): all carbon dissolved in FCC crystal
- **Ferrite + pearlite** (below 727°C, < 0.76% C): typical steel
- **Pearlite + cementite** (below 727°C, > 0.76% C): hard but brittle

The Naga dao steel (~0.5% C) sits in the hypoeutectoid region: mostly ferrite with islands of pearlite. Heat treating shifts between these phases.

📚 *matplotlib can draw phase diagrams with fill_between() for regions and plot() for boundary lines. Different colors represent different crystal structures.*`,
      analogy: 'The phase diagram is like a weather map for steel. Instead of temperature vs location showing rain/snow/sun, it shows temperature vs carbon content showing ferrite/austenite/cementite. Just as a meteorologist reads a weather map to predict rain, a metallurgist reads the phase diagram to predict steel behavior.',
      storyConnection: 'When the Naga blacksmith heats the dao to cherry red (800°C), they are crossing from the ferrite+pearlite region into the austenite region on this diagram. When they quench, they bypass the pearlite region entirely, trapping carbon in martensite. The phase diagram explains every step of traditional heat treatment.',
      checkQuestion: 'Why does steel need to reach 727°C (the eutectoid temperature) before quenching works?',
      checkAnswer: 'Below 727°C, the steel is already in the ferrite+pearlite state. Carbon is bound in cementite (Fe₃C) layers, not dissolved. Quenching from below 727°C does nothing because there is no dissolved carbon to trap. Above 727°C, the steel transforms to austenite where carbon is dissolved uniformly. Only then can fast cooling trap the carbon in a supersaturated (martensitic) state.',
      codeIntro: 'Plot the iron-carbon phase diagram and mark the Naga dao steel composition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 7))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Phase boundaries (simplified)
carbon = np.linspace(0, 2.5, 500)

# Austenite upper boundary (A3 line for hypoeutectoid)
A3 = np.where(carbon <= 0.76, 912 - 240 * carbon, 727 + 0 * carbon)
# A3 for hypereutectoid (Acm line)
Acm = np.where(carbon > 0.76, 727 + 200 * (carbon - 0.76), A3)
upper = np.where(carbon <= 0.76, A3, Acm)

# Eutectoid line
eutectoid = np.full_like(carbon, 727)

# Fill regions
ax.fill_between(carbon, upper, 1100, alpha=0.3, color='#f87171', label='Austenite (γ)')
ax.fill_between(carbon[carbon <= 0.76], eutectoid[carbon <= 0.76], upper[carbon <= 0.76],
                alpha=0.3, color='#f59e0b', label='Ferrite + Austenite')
ax.fill_between(carbon[carbon > 0.76], eutectoid[carbon > 0.76], upper[carbon > 0.76],
                alpha=0.3, color='#a78bfa', label='Austenite + Cementite')
ax.fill_between(carbon[carbon <= 0.76], 200, eutectoid[carbon <= 0.76],
                alpha=0.3, color='#10b981', label='Ferrite + Pearlite')
ax.fill_between(carbon[carbon > 0.76], 200, eutectoid[carbon > 0.76],
                alpha=0.3, color='#60a5fa', label='Pearlite + Cementite')

# Boundary lines
ax.plot(carbon[carbon <= 0.76], A3[carbon <= 0.76], 'w-', linewidth=2)
ax.plot(carbon[carbon > 0.76], Acm[carbon > 0.76], 'w-', linewidth=2)
ax.plot(carbon, eutectoid, 'w--', linewidth=1.5)

# Eutectoid point
ax.scatter([0.76], [727], color='white', s=100, zorder=5)
ax.annotate('Eutectoid\\n0.76% C, 727°C', xy=(0.76, 727), xytext=(1.2, 770),
            color='white', fontsize=10, arrowprops=dict(arrowstyle='->', color='white'))

# Naga dao steel
dao_carbon = 0.5
ax.axvline(x=dao_carbon, color='#f59e0b', linestyle=':', linewidth=2)
ax.scatter([dao_carbon], [800], color='#f59e0b', s=150, marker='*', zorder=6, edgecolors='white')
ax.annotate('Naga Dao\\n0.5% C', xy=(dao_carbon, 800), xytext=(0.1, 900),
            color='#f59e0b', fontsize=12, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2))

# Heat treatment path
temps = [25, 800, 800, 25]
carbons = [dao_carbon] * 4
ax.annotate('', xy=(dao_carbon, 25), xytext=(dao_carbon, 800),
            arrowprops=dict(arrowstyle='<->', color='#10b981', lw=2, linestyle='--'))
ax.text(dao_carbon + 0.05, 400, 'Heat\\ntreat\\nrange', color='#10b981', fontsize=9)

ax.set_xlabel('Carbon Content (wt%)', color='white', fontsize=12)
ax.set_ylabel('Temperature (°C)', color='white', fontsize=12)
ax.set_title('Iron-Carbon Phase Diagram', color='white', fontsize=14, fontweight='bold')
ax.set_xlim(0, 2.5); ax.set_ylim(200, 1100)
ax.tick_params(colors='white')
for spine in ax.spines.values(): spine.set_color('#4b5563')
ax.legend(loc='upper right', facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)
plt.tight_layout()
plt.show()

print("Phase diagram shows the Naga dao (0.5% C) in the hypoeutectoid region")
print("Heating above 770°C transforms it fully to austenite")
print("Quenching traps carbon → martensite (hard)")
print("Tempering at 200-260°C → tempered martensite (hard + tough)")`,
      challenge: 'Mark the composition and treatment path for a different blade: a Japanese katana (0.7% C) and a European longsword (0.3% C). How does their position on the diagram predict their different properties?',
      successHint: 'The iron-carbon phase diagram is the fundamental map of metallurgy. Every heat treatment decision the Naga blacksmith makes corresponds to a path on this diagram.',
    },
    {
      title: 'Hardness vs toughness — the engineering trade-off',
      concept: `**Hardness** (resistance to indentation) and **toughness** (energy absorbed before fracture) are inversely related in steel:

- Increase carbon/quenching → harder but more brittle
- Increase tempering → tougher but softer

This creates a **Pareto frontier**: you cannot maximize both simultaneously. The Naga dao must sit on this frontier at the point that best serves its purpose.

We can plot this trade-off for different steel compositions and heat treatments, revealing the design space available to the blacksmith.

📚 *matplotlib scatter plots with variable color and size can show 4 dimensions of data at once: x-position, y-position, color, and marker size.*`,
      analogy: 'The hardness-toughness trade-off is like the speed-fuel efficiency trade-off in cars. You can have a fast car (hard steel) or an efficient car (tough steel), but maximizing both simultaneously is nearly impossible. The best designs sit on the frontier where improving one metric necessarily worsens the other.',
      storyConnection: 'The Naga blacksmith\'s differential temper — hard edge, tough spine — is a brilliant solution to the trade-off. Instead of choosing ONE point on the hardness-toughness curve for the entire blade, they put the edge at the hard end and the spine at the tough end. Two regions, two different optimal points.',
      checkQuestion: 'Is there any way to get BOTH maximum hardness AND maximum toughness?',
      checkAnswer: 'Not with simple carbon steel. However, alloy steels (adding chromium, vanadium, molybdenum, tungsten) shift the entire Pareto frontier outward — giving higher toughness at the same hardness, or higher hardness at the same toughness. Modern knife steels like S30V and M390 achieve this through complex alloying. Damascus steel (wootz) historically achieved it through micro-banding of high and low carbon layers.',
      codeIntro: 'Plot the hardness-toughness trade-off for different steel compositions and treatments.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate steel data points
steels = []
# Various carbon contents and temper temperatures
for carbon in np.arange(0.1, 1.1, 0.05):
    for temper in np.arange(150, 600, 25):
        # Hardness model: increases with C, decreases with temper
        hardness = 20 + 60 * carbon - 0.08 * (temper - 150)
        hardness = np.clip(hardness + np.random.normal(0, 2), 15, 67)

        # Toughness model: decreases with C, increases with temper
        toughness = 80 - 50 * carbon + 0.15 * (temper - 150)
        toughness = np.clip(toughness + np.random.normal(0, 5), 5, 100)

        steels.append((carbon, temper, hardness, toughness))

steels = np.array(steels)

fig, axes = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Plot 1: Hardness vs Toughness (colored by carbon)
scatter = axes[0].scatter(steels[:,2], steels[:,3], c=steels[:,0], cmap='RdYlGn_r',
                          s=20, alpha=0.6, edgecolors='none')
cb = plt.colorbar(scatter, ax=axes[0], shrink=0.8, label='Carbon %')
cb.ax.yaxis.label.set_color('white'); cb.ax.tick_params(colors='white')

# Mark Naga dao region
dao_mask = (steels[:,0] > 0.4) & (steels[:,0] < 0.7) & (steels[:,1] > 200) & (steels[:,1] < 280)
axes[0].scatter(steels[dao_mask, 2], steels[dao_mask, 3], edgecolors='#f59e0b',
               facecolors='none', s=80, linewidths=2, label='Naga dao zone')

# Mark specific blades
blade_points = [
    ('Razor', 62, 10, '#f87171'),
    ('Kitchen knife', 55, 25, '#f59e0b'),
    ('Naga dao', 50, 35, '#10b981'),
    ('Axe', 42, 55, '#60a5fa'),
    ('Spring', 35, 75, '#a78bfa'),
]
for name, h, t, color in blade_points:
    axes[0].scatter([h], [t], s=150, color=color, edgecolors='white', linewidths=2, zorder=5)
    axes[0].annotate(name, (h, t), textcoords="offset points", xytext=(8, 5),
                    color=color, fontsize=10, fontweight='bold')

axes[0].set_xlabel('Hardness (HRC)', color='white', fontsize=11)
axes[0].set_ylabel('Toughness (relative)', color='white', fontsize=11)
axes[0].set_title('Hardness-Toughness Trade-off', color='white', fontsize=13, fontweight='bold')
axes[0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Plot 2: 3D-like view — carbon, temper, hardness
scatter2 = axes[1].scatter(steels[:,0]*100, steels[:,1], c=steels[:,2], cmap='hot',
                           s=20, alpha=0.6)
cb2 = plt.colorbar(scatter2, ax=axes[1], shrink=0.8, label='Hardness (HRC)')
cb2.ax.yaxis.label.set_color('white'); cb2.ax.tick_params(colors='white')

# Naga dao zone
rect = plt.Rectangle((40, 200), 30, 80, fill=False, edgecolor='#10b981', linewidth=2, linestyle='--')
axes[1].add_patch(rect)
axes[1].text(55, 320, 'Naga dao\\nsweet spot', color='#10b981', ha='center', fontsize=10, fontweight='bold')

axes[1].set_xlabel('Carbon Content (%×100)', color='white', fontsize=11)
axes[1].set_ylabel('Temper Temperature (°C)', color='white', fontsize=11)
axes[1].set_title('Steel Design Space', color='white', fontsize=13, fontweight='bold')

plt.suptitle('Metallurgy: The Hardness-Toughness Trade-off', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

print("The Naga dao sits at the intersection of:")
print("  Carbon: 0.4-0.7% (hypoeutectoid, good balance)")
print("  Temper: 200-280°C (straw to brown color)")
print("  Hardness: 48-54 HRC (holds edge, resists chipping)")
print("  Toughness: 30-40% (survives chopping impacts)")`,
      challenge: 'Add modern alloy steels to the plot (e.g., 440C stainless, D2 tool steel). They sit OUTSIDE the Pareto frontier of plain carbon steel. What does this tell you about the advantage of alloying?',
      successHint: 'The hardness-toughness trade-off is the central design constraint in blade metallurgy. Understanding this frontier lets you appreciate why the Naga dao sits exactly where it does — optimized for a jungle tool that must be both sharp and resilient.',
    },
    {
      title: 'Edge retention — modeling how a blade dulls',
      concept: `A blade dulls through several mechanisms:
- **Abrasive wear**: hard particles in the material scrape the edge
- **Micro-chipping**: small pieces break off under impact
- **Rolling**: the thin edge bends over to one side
- **Corrosion**: chemical attack weakens the edge metal

The rate of dulling depends on:
- Hardness (harder = slower abrasive wear)
- Toughness (tougher = fewer micro-chips)
- Edge geometry (thicker = more durable)
- Material being cut (harder material = faster dulling)

We can model edge retention as exponential decay of sharpness over use:
**S(n) = S₀ × exp(-λn)**

Where S₀ is initial sharpness, n is number of cuts, and λ is the dulling rate.

📚 *numpy's np.exp() calculates exponential functions for arrays — each element is computed independently, making it easy to model decay curves.*`,
      analogy: 'Edge dulling is like tire wear on a car. A harder tire compound (harder steel) wears slower on smooth roads but chips on potholes. A softer compound (tougher steel) handles potholes but wears faster on smooth roads. The best tire for your car depends on your roads, just as the best steel for your dao depends on what you are cutting.',
      storyConnection: 'A Naga villager might use the dao for 8 hours straight — chopping bamboo, slicing vegetation, preparing food. The blade must stay sharp enough for all tasks throughout the day. Edge retention is not academic — it determines whether the tool is practical for all-day jungle work.',
      checkQuestion: 'If you sharpen a dao to extreme sharpness but it dulls in 10 cuts, is it better than a moderately sharp dao that holds its edge for 1,000 cuts?',
      checkAnswer: 'For a working tool, the moderately sharp dao is far better. The practical metric is not peak sharpness but AVERAGE sharpness over a work session. A dao that starts extremely sharp but dulls quickly has a high peak but low average. One that starts moderately sharp and dulls slowly has a lower peak but much higher average. The Naga preference for a 25-30° bevel reflects this: maximum average performance over a full day of use.',
      codeIntro: 'Simulate blade dulling over time for different steel types and bevel angles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

cuts = np.arange(0, 2001)

# Dulling model: S(n) = S0 * exp(-lambda * n) + S_min
def blade_performance(cuts, S0, dulling_rate, chip_rate, S_min=10):
    """Model blade sharpness over use."""
    abrasive = S0 * np.exp(-dulling_rate * cuts)
    chipping_events = np.random.binomial(1, chip_rate, len(cuts))
    chip_damage = np.cumsum(chipping_events) * 2
    sharpness = np.maximum(S_min, abrasive - chip_damage)
    return sharpness

np.random.seed(42)

blades = [
    ('Hard (62 HRC, 15° bevel)', 100, 0.001, 0.008, '#f87171'),  # razor-sharp, dulls and chips fast
    ('Medium-hard (55 HRC, 20°)', 90, 0.0008, 0.003, '#f59e0b'),
    ('Naga dao (50 HRC, 27°)', 80, 0.0005, 0.001, '#10b981'),
    ('Tough (42 HRC, 35°)', 65, 0.0003, 0.0003, '#60a5fa'),
    ('Very tough (35 HRC, 40°)', 50, 0.0002, 0.0001, '#a78bfa'),
]

fig, axes = plt.subplots(1, 2, figsize=(13, 5.5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Minimum useful sharpness threshold
useful_threshold = 40
axes[0].axhline(y=useful_threshold, color='white', linestyle=':', alpha=0.3, label='Min useful sharpness')

avg_sharpnesses = []
useful_lifetimes = []

print("Edge Retention Analysis")
print("=" * 70)

for name, S0, dulling, chipping, color in blades:
    sharpness = blade_performance(cuts, S0, dulling, chipping)
    axes[0].plot(cuts, sharpness, color=color, linewidth=2, label=name[:20], alpha=0.8)

    # Calculate average sharpness over first 1000 cuts
    avg = np.mean(sharpness[:1000])
    avg_sharpnesses.append((name, avg))

    # Useful lifetime (cuts until below threshold)
    below = np.where(sharpness < useful_threshold)[0]
    lifetime = below[0] if len(below) > 0 else 2000
    useful_lifetimes.append((name, lifetime))

    print(f"  {name:35s} | avg sharpness (1000 cuts): {avg:.0f} | useful life: {lifetime} cuts")

axes[0].set_xlabel('Number of Cuts', color='white', fontsize=11)
axes[0].set_ylabel('Sharpness Score', color='white', fontsize=11)
axes[0].set_title('Sharpness Degradation Over Use', color='white', fontsize=13, fontweight='bold')
axes[0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Average sharpness comparison
names_short = [n.split('(')[0].strip() for n, _ in avg_sharpnesses]
avgs = [a for _, a in avg_sharpnesses]
lifetimes = [l for _, l in useful_lifetimes]
colors_bar = [b[4] for b in blades]

x = np.arange(len(blades))
width = 0.35
axes[1].bar(x - width/2, avgs, width, color=colors_bar, label='Avg sharpness (1000 cuts)', alpha=0.7)
ax2 = axes[1].twinx()
ax2.bar(x + width/2, lifetimes, width, color=colors_bar, label='Useful lifetime (cuts)', alpha=0.4, edgecolor='white')
axes[1].set_xticks(x)
axes[1].set_xticklabels(names_short, fontsize=8, rotation=15)
axes[1].set_ylabel('Average Sharpness', color='#60a5fa', fontsize=10)
ax2.set_ylabel('Useful Lifetime (cuts)', color='#f59e0b', fontsize=10)
ax2.tick_params(colors='#f59e0b')
axes[1].set_title('Performance Comparison', color='white', fontsize=13, fontweight='bold')

plt.suptitle('Blade Edge Retention: Sharpness vs Durability', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

print(f"\\nBest AVERAGE performance over 1000 cuts: {max(avg_sharpnesses, key=lambda x: x[1])[0]}")
print(f"Longest useful life: {max(useful_lifetimes, key=lambda x: x[1])[0]}")`,
      challenge: 'Add a "resharpening" event every 500 cuts (sharpness jumps back to 90% of original). Which blade benefits most from periodic resharpening? How does this change the ranking?',
      successHint: 'Edge retention analysis confirms what Naga blacksmiths know empirically: a moderately hard blade with a working-angle bevel provides the best all-day performance. Peak sharpness matters less than sustained sharpness.',
    },
    {
      title: 'Forging temperature map — when to shape the steel',
      concept: `Steel must be forged (shaped by hammering) at the right temperature:
- **Too cold** (< 500°C): too hard, cracks, damages tools
- **Forging range** (800-1100°C): soft enough to shape, hot enough to recrystallize
- **Too hot** (> 1200°C): grain growth, surface oxidation, burning

The forging temperature map shows safe working zones for different operations:
- **Rough shaping**: 1000-1100°C (bright orange to yellow)
- **Drawing out**: 900-1000°C (cherry red to orange)
- **Fine shaping**: 800-900°C (dark cherry to cherry red)
- **Stop forging**: below 750°C (dark red — metal too stiff)

📚 *matplotlib's imshow() and contourf() can create heatmap visualizations showing temperature zones across the blade during forging.*`,
      analogy: 'Forging temperature is like butter consistency. Cold butter (cold steel) cracks when you try to spread it. Room-temperature butter (forging range) spreads smoothly. Melted butter (too hot) runs everywhere and cannot be controlled. The blacksmith must keep the steel in the "spreadable butter" zone throughout forging.',
      storyConnection: 'Naga blacksmiths judge temperature entirely by color — a skill that takes years to master. In a dim forge, the steel\'s color tells the smith its temperature to within 30-50°C. This visual temperature sensing is remarkable and has been validated by modern pyrometry.',
      checkQuestion: 'Why do blacksmiths work in dimly lit forges rather than bright sunlight?',
      checkAnswer: 'In bright light, the steel\'s color is washed out — you cannot distinguish cherry red (800°C) from dark red (650°C). In dim light, the color differences are vivid and unmistakable. This is why traditional forges have few windows and why Naga blacksmiths prefer to work in the early morning or late evening. Modern blacksmiths sometimes wear tinted glasses for the same reason.',
      codeIntro: 'Create a forging temperature chart with color-temperature relationships.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Temperature-color-workability relationship
temps = np.arange(200, 1301, 10)

def steel_color_rgb(temp):
    """Approximate visible color of heated steel."""
    if temp < 400: return (0.2, 0.2, 0.2)
    elif temp < 500: return (0.3, 0.1, 0.1)
    elif temp < 600: return (0.5, 0.1, 0.05)
    elif temp < 700: return (0.7, 0.15, 0.05)
    elif temp < 800: return (0.85, 0.2, 0.05)
    elif temp < 900: return (0.95, 0.3, 0.05)
    elif temp < 1000: return (1.0, 0.5, 0.1)
    elif temp < 1100: return (1.0, 0.7, 0.2)
    elif temp < 1200: return (1.0, 0.85, 0.4)
    else: return (1.0, 0.95, 0.7)

# Workability score
def workability(temp, carbon=0.5):
    if temp < 600: return 0
    elif temp < 750: return 20
    elif temp < 800: return 50  # marginal
    elif temp < 1100: return 90 + 10 * np.sin(np.pi * (temp - 800) / 300)
    elif temp < 1200: return 80
    else: return 40  # burning risk

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Color strip
for i, temp in enumerate(temps):
    color = steel_color_rgb(temp)
    axes[0,0].bar(temp, 1, width=10, color=color, edgecolor='none')

# Zone labels
zones = [
    (300, 'Black heat\\n(no glow)', 'white'),
    (550, 'Faint red', 'white'),
    (700, 'Dark cherry', 'white'),
    (800, 'Cherry red', 'black'),
    (950, 'Bright cherry', 'black'),
    (1050, 'Orange', 'black'),
    (1150, 'Yellow', 'black'),
]
for temp, label, tc in zones:
    axes[0,0].text(temp, 0.5, label, ha='center', va='center', color=tc, fontsize=7, fontweight='bold', rotation=90)

axes[0,0].set_xlabel('Temperature (°C)', color='white', fontsize=10)
axes[0,0].set_title('Steel Color vs Temperature', color='white', fontsize=12, fontweight='bold')
axes[0,0].set_yticks([])

# Workability curve
work = [workability(t) for t in temps]
axes[0,1].fill_between(temps, work, alpha=0.3, color='#10b981')
axes[0,1].plot(temps, work, color='#10b981', linewidth=2.5)
axes[0,1].axvspan(800, 1100, alpha=0.1, color='#f59e0b', label='Optimal forging zone')
axes[0,1].axvline(x=727, color='#f87171', linestyle='--', alpha=0.7, label='Eutectoid (727°C)')
axes[0,1].set_xlabel('Temperature (°C)', color='white', fontsize=10)
axes[0,1].set_ylabel('Workability Score', color='white', fontsize=10)
axes[0,1].set_title('Forging Workability', color='white', fontsize=12, fontweight='bold')
axes[0,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Forging operations chart
operations = [
    ('Rough shaping', 1000, 1100, '#f87171'),
    ('Drawing/tapering', 900, 1000, '#f59e0b'),
    ('Fine shaping', 800, 900, '#10b981'),
    ('Edge setting', 750, 830, '#60a5fa'),
    ('STOP forging', 200, 750, '#9ca3af'),
]
for i, (name, lo, hi, color) in enumerate(operations):
    axes[1,0].barh(i, hi-lo, left=lo, color=color, height=0.6, edgecolor='white', linewidth=0.5)
    axes[1,0].text(lo + (hi-lo)/2, i, f'{name}\\n{lo}-{hi}°C', ha='center', va='center', color='white', fontsize=8, fontweight='bold')

axes[1,0].set_xlabel('Temperature (°C)', color='white', fontsize=10)
axes[1,0].set_title('Forging Operations by Temperature', color='white', fontsize=12, fontweight='bold')
axes[1,0].set_yticks([])

# Grain size vs temperature
grain_size = np.where(temps < 727, 20, 10 + 0.05 * (temps - 727)**1.3)
grain_size = np.clip(grain_size, 5, 200)
axes[1,1].plot(temps, grain_size, color='#a78bfa', linewidth=2.5)
axes[1,1].axvspan(800, 1100, alpha=0.1, color='#10b981', label='Forging range')
axes[1,1].axvspan(1100, 1300, alpha=0.1, color='#f87171', label='Grain growth danger')
axes[1,1].set_xlabel('Temperature (°C)', color='white', fontsize=10)
axes[1,1].set_ylabel('Grain Size (μm)', color='white', fontsize=10)
axes[1,1].set_title('Grain Size vs Temperature', color='white', fontsize=12, fontweight='bold')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

plt.suptitle('Naga Dao Forging: Temperature Control', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("Naga blacksmith's forging sequence:")
print("  1. Heat to bright cherry/orange (950-1050°C) → rough shape")
print("  2. Reheat to cherry red (850-950°C) → draw out the blade")
print("  3. Reheat to dark cherry (800-850°C) → fine shape and edge setting")
print("  4. Below dark red (< 750°C) → STOP, reheat before continuing")
print("  5. Final heat to cherry red → quench for hardening")`,
      challenge: 'Model what happens if the smith accidentally overheats to 1250°C ("burning" the steel). How does grain size increase, and why does large grain size weaken the blade? Plot the grain size distribution before and after overheating.',
      successHint: 'Temperature control is the most critical skill in blacksmithing. The Naga smith\'s ability to read color as temperature, validated by modern instruments, represents centuries of accumulated empirical knowledge.',
    },
    {
      title: 'Spark testing — identifying steel by its fireworks',
      concept: `**Spark testing** is a traditional method for identifying steel composition by observing the sparks produced when grinding against a stone wheel:

- **Low carbon** (< 0.2%): few sparks, long straight lines, small forks
- **Medium carbon** (0.3-0.5%): moderate sparks, some bursts, medium forks
- **High carbon** (0.6-1.0%): many sparks, complex bursts ("flowers"), bright white
- **Cast iron** (> 2%): short red sparks, few forks, dull appearance

The physics: grinding heats tiny particles of steel. Carbon in the particles burns (oxidizes), releasing additional energy as micro-explosions — the "flowers" and "forks" in the spark stream.

📚 *matplotlib can simulate particle trajectories using random walks with physics-based constraints.*`,
      analogy: 'Spark testing is like listening to popcorn. Low-carbon steel is like old, dried corn — few pops, little energy. High-carbon steel is like fresh, moist corn — vigorous popping with many bursts. An experienced blacksmith reads sparks the way a cook reads popping sounds — instantly identifying the material.',
      storyConnection: 'Naga blacksmiths use spark testing to select scrap metal for dao-making. When recycling old tools, springs, and railroad spikes, the spark pattern tells them the carbon content without any laboratory equipment. A bright, bushy spark pattern means "good dao steel." Straight, dull sparks mean "not enough carbon — add more."',
      checkQuestion: 'Why do higher-carbon steels produce more complex spark patterns?',
      checkAnswer: 'When a hot particle of high-carbon steel is thrown from the grinding wheel, the carbon at the particle surface burns first, releasing CO₂ gas. This gas explosion breaks the particle into smaller fragments, each of which has more carbon exposed to air, causing secondary explosions. Low-carbon particles do not have enough carbon for these cascading explosions. The visual result: high carbon = complex branching sparks; low carbon = simple straight sparks.',
      codeIntro: 'Simulate spark patterns for different carbon content steels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def generate_spark_pattern(n_sparks, carbon_pct, ax, title):
    """Simulate spark trajectories for a given carbon content."""
    ax.set_facecolor('#0f1520')

    for i in range(n_sparks):
        # Initial trajectory
        v0 = np.random.uniform(3, 8)  # initial velocity
        angle = np.random.normal(30, 15)  # degrees from horizontal
        angle_rad = np.radians(angle)

        # Trajectory with gravity
        t = np.linspace(0, np.random.uniform(0.3, 1.0), 50)
        x = v0 * np.cos(angle_rad) * t
        y = v0 * np.sin(angle_rad) * t - 0.5 * 9.81 * t**2

        # Brightness based on carbon (more carbon = brighter)
        brightness = 0.5 + 0.5 * carbon_pct
        base_color = (1.0, brightness * 0.8 + 0.2, brightness * 0.3)

        # Main spark line
        mask = y >= 0
        if np.any(mask):
            ax.plot(x[mask], y[mask], color=base_color, linewidth=0.5, alpha=0.7)

        # Carbon-dependent bursts ("flowers")
        n_bursts = np.random.poisson(carbon_pct * 5)
        for b in range(n_bursts):
            burst_t = np.random.uniform(0.1, 0.6)
            burst_idx = int(burst_t / t[-1] * len(t)) if t[-1] > 0 else 0
            burst_idx = min(burst_idx, len(x)-1)
            bx, by = x[burst_idx], y[burst_idx]
            if by < 0: continue

            # Fork branches
            n_forks = np.random.randint(2, 4 + int(carbon_pct * 5))
            for f in range(n_forks):
                fork_angle = np.random.normal(0, 40)
                fork_len = np.random.uniform(0.1, 0.4) * (1 + carbon_pct)
                fx = bx + fork_len * np.cos(np.radians(fork_angle))
                fy = by + fork_len * np.sin(np.radians(fork_angle))
                bright_fork = min(1, brightness + 0.2)
                fork_color = (1.0, bright_fork * 0.6, 0.1)
                ax.plot([bx, fx], [by, fy], color=fork_color, linewidth=0.3, alpha=0.8)

                # Secondary burst for high carbon
                if carbon_pct > 0.5 and np.random.random() < carbon_pct * 0.5:
                    for sf in range(np.random.randint(1, 3)):
                        sf_angle = np.random.normal(0, 50)
                        sf_len = np.random.uniform(0.05, 0.15)
                        sfx = fx + sf_len * np.cos(np.radians(sf_angle))
                        sfy = fy + sf_len * np.sin(np.radians(sf_angle))
                        ax.plot([fx, sfx], [fy, sfy], color=(1, 1, 0.5), linewidth=0.2, alpha=0.6)

    ax.set_xlim(0, 6); ax.set_ylim(-0.5, 4)
    ax.set_title(title, color='white', fontsize=11, fontweight='bold')
    ax.set_xlabel('Distance', color='white', fontsize=9)
    ax.set_ylabel('Height', color='white', fontsize=9)
    ax.set_aspect('equal')

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#0f1520')

steels_to_test = [
    (0.10, 40, 'Wrought Iron (0.1% C) — straight, few forks'),
    (0.35, 60, 'Mild Steel (0.35% C) — some bursts'),
    (0.55, 80, 'Dao Steel (0.55% C) — moderate flowers'),
    (0.90, 100, 'High Carbon (0.9% C) — complex flowers'),
]

for ax, (carbon, n_sparks, title) in zip(axes.flat, steels_to_test):
    generate_spark_pattern(n_sparks, carbon, ax, title)

plt.suptitle('Spark Testing — Identifying Steel by Carbon Content', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("Spark Testing Guide for Naga Blacksmiths:")
print("  Wrought iron: long straight sparks, few forks → NOT good for dao")
print("  Mild steel: some forking, moderate length → usable but soft")
print("  Medium carbon: bushy forks, bright bursts → IDEAL for dao")
print("  High carbon: complex flowers, very bright → good edge but brittle")
print("\\nThe blacksmith grinds a corner of scrap metal and reads its identity")
print("in the spark pattern — no laboratory needed, just trained eyes.")`,
      challenge: 'Simulate testing an unknown metal sample. Generate a random carbon content between 0.1% and 1.0%, show the spark pattern, and ask the user to guess the carbon content from the visual pattern.',
      successHint: 'Spark testing demonstrates that traditional metallurgical knowledge is grounded in real physics. The spark pattern directly reflects carbon content because carbon\'s combustion energy drives the micro-explosions visible as forks and flowers.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualizing Steel Science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with matplotlib and numpy. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
