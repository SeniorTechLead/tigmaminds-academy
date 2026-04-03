import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BridgeLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Forces — compression, tension, and why bridges need both',
      concept: `Every bridge on Earth — whether built from steel cables or grown from living roots — must resist two fundamental forces: **compression** and **tension**.

**Compression** is a pushing force that squeezes material together. When you stand on a stone slab, the stone is in compression — your weight pushes down, and the ground pushes up, squeezing the stone between them. Materials in compression get shorter and fatter (though you can't see it with stone — the deformation is microscopic).

**Tension** is a pulling force that stretches material apart. When you hang from a rope, the rope is in tension — your weight pulls down, your hands hold on, and the rope stretches between those two points. Materials in tension get longer and thinner.

A bridge needs both because gravity pulls everything downward, but the bridge must stay horizontal. The top of a beam bridge is in compression (being squeezed), while the bottom is in tension (being stretched). Understanding where compression and tension act in a structure is the first step to understanding why bridges stand — or collapse.`,
      analogy: 'Hold a pencil at both ends and bend it downward in the middle. The top surface is being squeezed together (compression) — if you look closely, you might see it wrinkle. The bottom surface is being pulled apart (tension) — this is where the pencil will snap. Every loaded beam works exactly like this bent pencil.',
      storyConnection: 'The living root bridges of Meghalaya work because Ficus elastica roots are excellent in tension — they can be pulled and stretched without breaking, much like natural ropes. The Khasi people understood this intuitively: they guide the roots across gaps, letting the roots carry the tension of the bridge span while the stone foundations handle compression.',
      checkQuestion: 'A suspension bridge (like the Golden Gate) has two tall towers and cables draped between them. Are the towers in compression or tension? What about the cables?',
      checkAnswer: 'The towers are in compression — the weight of the entire bridge deck pushes down through them into the ground. The cables are in tension — they are being pulled taut by the weight of the deck hanging from them. Suspension bridges are brilliant because they put each material where it performs best: steel cables (great in tension) and concrete towers (great in compression).',
      codeIntro: 'Visualize compression and tension forces in a simple beam bridge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple beam bridge force diagram
fig, axes = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# --- Top: Beam bridge schematic ---
ax = axes[0]
ax.set_facecolor('#111827')

# Bridge beam
beam_x = [1, 9]
beam_y = [3, 3]
ax.plot(beam_x, beam_y, color='#94a3b8', linewidth=8, solid_capstyle='round')

# Supports (triangles)
for sx in [1, 9]:
    triangle = plt.Polygon([[sx-0.3, 2.7], [sx+0.3, 2.7], [sx, 2.2]],
                           color='#64748b', ec='#94a3b8', linewidth=1.5)
    ax.add_patch(triangle)

# Load (person/weight at center)
ax.annotate('', xy=(5, 3), xytext=(5, 4.2),
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=3))
ax.text(5, 4.4, 'Load (Weight)', ha='center', color='#ef4444', fontsize=11, fontweight='bold')

# Support reactions
for sx in [1, 9]:
    ax.annotate('', xy=(sx, 2.2), xytext=(sx, 1.2),
                arrowprops=dict(arrowstyle='->', color='#22c55e', lw=3))
ax.text(1, 0.9, 'Reaction', ha='center', color='#22c55e', fontsize=9)
ax.text(9, 0.9, 'Reaction', ha='center', color='#22c55e', fontsize=9)

# Compression and tension labels
ax.annotate('COMPRESSION (top)', xy=(5, 3.15), fontsize=10, color='#f59e0b',
            ha='center', fontweight='bold')
ax.annotate('TENSION (bottom)', xy=(5, 2.65), fontsize=10, color='#3b82f6',
            ha='center', fontweight='bold')

ax.set_xlim(0, 10)
ax.set_ylim(0.5, 5)
ax.set_title('Forces in a Simple Beam Bridge', color='white', fontsize=13)
ax.set_aspect('equal')
ax.axis('off')

# --- Bottom: Stress distribution along beam depth ---
ax2 = axes[1]
ax2.set_facecolor('#111827')

# Stress varies linearly from compression at top to tension at bottom
y_pos = np.linspace(-1, 1, 100)  # -1 = bottom, +1 = top
stress = -y_pos  # negative = tension (bottom), positive = compression (top)

ax2.fill_betweenx(y_pos, 0, stress, where=stress > 0, alpha=0.4, color='#f59e0b', label='Compression')
ax2.fill_betweenx(y_pos, 0, stress, where=stress < 0, alpha=0.4, color='#3b82f6', label='Tension')
ax2.plot(stress, y_pos, color='white', linewidth=2)
ax2.axvline(0, color='gray', linewidth=0.5, linestyle='--')
ax2.axhline(0, color='#22c55e', linewidth=2, linestyle='-', label='Neutral axis (zero stress)')

ax2.set_xlabel('Stress (compression ← → tension)', color='white')
ax2.set_ylabel('Position in beam (bottom → top)', color='white')
ax2.set_title('Stress Distribution Through a Beam Cross-Section', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key takeaways:")
print("  - Top of beam: compression (being squeezed)")
print("  - Bottom of beam: tension (being stretched)")
print("  - Middle: neutral axis (zero stress)")
print("  - This is why I-beams have thick flanges at top and bottom")
print("    but thin webs in the middle — material where stress is highest.")`,
      challenge: 'What happens if you flip the load — push upward from below instead of downward from above? Which side is now in compression? Modify the stress plot to show this reversed scenario.',
      successHint: 'Understanding compression and tension is the foundation of all structural engineering. Every bridge, building, and tower is designed by mapping where these forces act and choosing materials that resist them.',
    },
    {
      title: 'Bridge types — beam, arch, suspension, truss (and living root!)',
      concept: `Humans have invented five major bridge types over thousands of years, each handling forces differently:

**Beam bridge**: The simplest — a flat slab resting on two supports. Forces: top in compression, bottom in tension. Limited to short spans because the beam sags under its own weight. Example: a log across a stream.

**Arch bridge**: A curved structure that converts all downward loads into compression, pushing outward into the ground at each end. Arches are ancient (Romans built them) and incredibly efficient because stone and concrete are strong in compression. Example: Roman aqueducts.

**Suspension bridge**: A deck hangs from cables draped over tall towers. The cables carry tension, the towers carry compression. Can span enormous distances (the Akashi Kaikyo Bridge spans 1,991 meters). Example: Golden Gate Bridge.

**Truss bridge**: Uses triangles — the only rigid polygon — to distribute forces through a network of members. Each member is in pure compression or pure tension, never both. Extremely material-efficient. Example: railway bridges.

**Living root bridge**: Unique to Meghalaya, India. The Khasi and Jaintia people guide the aerial roots of Ficus elastica across streams using betel nut tree trunks as scaffolding. Over 15-30 years, the roots grow, thicken, and interweave into a living bridge that gets stronger with age. Some are over 500 years old.`,
      analogy: 'Think of bridge types as different strategies for crossing a river. A beam bridge is like laying a plank across — simple but short. An arch is like cupping your hands — strong in the middle. A suspension bridge is like holding a rope hammock — the ropes do the work. A truss is like building with triangles of sticks. A living root bridge is like training a tree to become the crossing — the slowest method, but it maintains itself forever.',
      storyConnection: 'The living root bridges of Meghalaya represent a fundamentally different philosophy of engineering. Instead of extracting materials, shaping them, and assembling them (as with steel or concrete bridges), the Khasi people work with nature, guiding growth over decades. The bridge IS the tree. It self-repairs, gets stronger with age, and requires no external maintenance — a bridge that is alive.',
      checkQuestion: 'Why can an arch bridge span further than a beam bridge of the same material?',
      checkAnswer: 'An arch converts bending forces (which create both compression and tension) into pure compression along the curve. Since stone and concrete are 10-20x stronger in compression than tension, eliminating tension lets you span much further. A beam must resist both — and it fails at its tension limit, which is much lower.',
      codeIntro: 'Visualize the five major bridge types and their force paths.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Five Bridge Types and Their Force Paths', color='white', fontsize=14, fontweight='bold')

def setup_ax(ax, title):
    ax.set_facecolor('#111827')
    ax.set_title(title, color='white', fontsize=11, fontweight='bold')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.set_aspect('equal')
    ax.axis('off')

# 1. Beam bridge
ax = axes[0, 0]
setup_ax(ax, 'Beam Bridge')
ax.plot([2, 8], [3, 3], color='#94a3b8', linewidth=6, solid_capstyle='round')
for sx in [2, 8]:
    t = plt.Polygon([[sx-0.3, 2.7], [sx+0.3, 2.7], [sx, 2.2]], color='#64748b')
    ax.add_patch(t)
ax.annotate('', xy=(5, 3), xytext=(5, 4.5), arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))
ax.text(5, 1.5, 'Top: compression\\nBottom: tension', ha='center', color='#f59e0b', fontsize=8)
ax.text(5, 5, 'Simple, short spans', ha='center', color='gray', fontsize=8)

# 2. Arch bridge
ax = axes[0, 1]
setup_ax(ax, 'Arch Bridge')
theta = np.linspace(0, np.pi, 50)
arch_x = 2 + 6 * (theta / np.pi)
arch_y = 2 + 2.5 * np.sin(theta)
ax.plot(arch_x, arch_y, color='#f59e0b', linewidth=4)
ax.plot([2, 8], [4.5, 4.5], color='#94a3b8', linewidth=3)
# Compression arrows along arch
for i in range(1, 6):
    t = i * np.pi / 6
    x = 2 + 6 * (t / np.pi)
    y = 2 + 2.5 * np.sin(t)
    dx = -np.cos(t) * 0.3
    dy = -np.sin(t) * 0.3
    ax.annotate('', xy=(x + dx, y + dy), xytext=(x - dx, y - dy),
                arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=1.5))
ax.text(5, 1.2, 'All compression\\nalong the curve', ha='center', color='#f59e0b', fontsize=8)
ax.text(5, 5.5, 'Strong, medium spans', ha='center', color='gray', fontsize=8)

# 3. Suspension bridge
ax = axes[0, 2]
setup_ax(ax, 'Suspension Bridge')
# Towers
ax.plot([3, 3], [2, 6], color='#94a3b8', linewidth=4)
ax.plot([7, 7], [2, 6], color='#94a3b8', linewidth=4)
# Main cable (catenary)
x_cable = np.linspace(1, 9, 50)
y_cable = 6 - 2.5 * ((x_cable - 5) / 4) ** 2 + 1
ax.plot(x_cable, y_cable, color='#3b82f6', linewidth=2.5)
# Deck
ax.plot([1, 9], [2.5, 2.5], color='#94a3b8', linewidth=3)
# Hangers
for hx in np.linspace(2, 8, 7):
    hy = 6 - 2.5 * ((hx - 5) / 4) ** 2 + 1
    ax.plot([hx, hx], [2.5, hy], color='#3b82f6', linewidth=0.8, alpha=0.6)
ax.text(5, 1.2, 'Cables: tension\\nTowers: compression', ha='center', color='#3b82f6', fontsize=8)
ax.text(5, 7.2, 'Longest spans possible', ha='center', color='gray', fontsize=8)

# 4. Truss bridge
ax = axes[1, 0]
setup_ax(ax, 'Truss Bridge')
# Top and bottom chords
ax.plot([2, 8], [4.5, 4.5], color='#a855f7', linewidth=2.5)
ax.plot([2, 8], [2.5, 2.5], color='#a855f7', linewidth=2.5)
# Verticals and diagonals
for i in range(7):
    x = 2 + i
    ax.plot([x, x], [2.5, 4.5], color='#a855f7', linewidth=1.5)
    if i < 6:
        ax.plot([x, x + 1], [2.5, 4.5], color='#a855f7', linewidth=1, alpha=0.7)
ax.text(5, 1.2, 'Triangles: rigid\\nPure comp/tension', ha='center', color='#a855f7', fontsize=8)
ax.text(5, 5.5, 'Material-efficient', ha='center', color='gray', fontsize=8)

# 5. Living root bridge
ax = axes[1, 1]
setup_ax(ax, 'Living Root Bridge')
# Organic root shape
t = np.linspace(0, np.pi, 100)
root_x = 2 + 6 * (t / np.pi)
root_y = 3 + 0.8 * np.sin(t) + 0.2 * np.sin(3 * t)
ax.plot(root_x, root_y, color='#22c55e', linewidth=5, alpha=0.8)
# Secondary roots
for rx in [3, 4.5, 5.5, 7]:
    ry = 3 + 0.8 * np.sin(np.pi * (rx - 2) / 6) + 0.2 * np.sin(3 * np.pi * (rx - 2) / 6)
    ax.plot([rx, rx + np.random.uniform(-0.3, 0.3)], [ry, ry + 1.5],
            color='#22c55e', linewidth=2, alpha=0.5)
# Tree on each side
for tx in [1.5, 8.5]:
    ax.plot([tx, tx], [2, 6], color='#166534', linewidth=6, alpha=0.5)
    circle = plt.Circle((tx, 6.5), 1, color='#22c55e', alpha=0.3)
    ax.add_patch(circle)
ax.text(5, 1, 'Self-repairing\\nGets stronger with age', ha='center', color='#22c55e', fontsize=8)
ax.text(5, 7.5, '500+ years old', ha='center', color='gray', fontsize=8)

# 6. Comparison chart
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.set_title('Max Span Comparison', color='white', fontsize=11, fontweight='bold')

types = ['Beam', 'Arch', 'Truss', 'Root', 'Suspension']
spans = [60, 300, 500, 50, 2000]
colors = ['#94a3b8', '#f59e0b', '#a855f7', '#22c55e', '#3b82f6']

bars = ax.barh(types, spans, color=colors, height=0.6)
for bar, span in zip(bars, spans):
    ax.text(bar.get_width() + 20, bar.get_y() + bar.get_height() / 2,
            f'{span}m', va='center', color='white', fontsize=9)
ax.set_xlabel('Max span (meters)', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bridge type strengths:")
print("  Beam:       Simple, cheap, short spans (< 60m)")
print("  Arch:       Pure compression, great for stone/concrete (< 300m)")
print("  Truss:      Material-efficient, triangles are rigid (< 500m)")
print("  Root:       Self-repairing, zero-carbon, but slow to grow (< 50m)")
print("  Suspension: Longest spans possible with cables (< 2000m)")`,
      challenge: 'Research the double-decker living root bridge at Nongriat, Meghalaya. It has two levels of roots stacked vertically. Sketch what its force diagram might look like — does the lower bridge help support the upper one?',
      successHint: 'Every bridge type represents a different answer to the same question: how do you transfer loads from the deck to the ground? The living root bridge is humanity\'s only answer that is also alive.',
    },
    {
      title: 'Materials — comparing wood, steel, concrete, and living roots',
      concept: `The material you choose for a bridge determines everything: how far it can span, how much it can carry, how long it lasts, and how it fails.

**Concrete**: Excellent in compression (30-50 MPa), terrible in tension (~3 MPa — ten times weaker). That's why reinforced concrete embeds steel bars (rebar) inside — the concrete handles compression, the steel handles tension. It's cheap, moldable, and lasts decades.

**Steel**: Strong in both compression and tension (~250 MPa yield strength). This versatility makes it the material of choice for modern bridges. But it rusts if not maintained, and it's expensive. Steel is about 3x heavier than concrete per unit volume but 5-8x stronger.

**Wood**: Moderate strength, light weight, and — crucially — renewable. It's anisotropic: much stronger along the grain than across it. Traditional bridges in Northeast India used bamboo and hardwoods. Wood rots in wet conditions unless treated.

**Living Ficus elastica roots**: The roots have tensile strength of roughly 10-20 MPa — weaker than steel but remarkable for a biological material. Their advantage: they are self-healing (a cut root will regrow), they get stronger over time as they thicken, and they require zero manufactured input. A living root bridge has a negative carbon footprint — it absorbs CO2 as it grows.`,
      analogy: 'Materials are like employees with different strengths. Concrete is the strong-but-inflexible worker — great at pushing but breaks if pulled. Steel is the all-rounder — good at everything but expensive. Wood is the renewable intern — decent at most things, needs protection from weather. Living roots are the employee who keeps getting better every year and never needs a salary — slow to train, but worth the wait.',
      storyConnection: 'The Khasi people chose Ficus elastica specifically because its aerial roots are flexible when young (easy to guide into position) but become rigid and strong as they mature. No other tree species in Meghalaya has this combination of properties. Material selection was just as deliberate for the living root bridges as it is for modern steel bridges — the Khasi engineers simply selected from nature\'s catalog.',
      checkQuestion: 'Reinforced concrete uses steel bars embedded in concrete. Why not just use all steel or all concrete?',
      checkAnswer: 'Pure concrete would crack under tension (the bottom of a beam). Pure steel would need much thicker sections for the same compressive strength and would cost far more. The combination is synergistic: concrete provides cheap compression resistance and protects the steel from rust, while steel provides the tension resistance that concrete lacks. Together they are better than either alone.',
      codeIntro: 'Compare the mechanical properties of bridge materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material properties
materials = ['Concrete', 'Steel', 'Wood\\n(along grain)', 'Ficus\\nRoots', 'Bamboo']

# Tensile strength (MPa)
tensile = [3, 250, 50, 15, 40]
# Compressive strength (MPa)
compressive = [40, 250, 30, 8, 60]
# Density (kg/m³)
density = [2400, 7850, 500, 800, 700]
# Cost (relative, 1 = cheapest)
cost = [1, 5, 2, 0, 1.5]  # roots are free
# Carbon footprint (relative)
carbon = [5, 8, 1, -1, 0.5]  # roots absorb carbon

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bridge Material Properties Compared', color='white', fontsize=14, fontweight='bold')

colors = ['#94a3b8', '#3b82f6', '#f59e0b', '#22c55e', '#a855f7']

# 1. Tensile vs Compressive strength
ax = axes[0, 0]
ax.set_facecolor('#111827')
x = np.arange(len(materials))
w = 0.35
ax.bar(x - w/2, compressive, w, color=colors, alpha=0.9, label='Compressive')
ax.bar(x + w/2, tensile, w, color=colors, alpha=0.5, label='Tensile', edgecolor='white', linewidth=0.5)
ax.set_xticks(x)
ax.set_xticklabels(materials, color='white', fontsize=8)
ax.set_ylabel('Strength (MPa)', color='white')
ax.set_title('Compressive vs Tensile Strength', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Strength-to-weight ratio
ax = axes[0, 1]
ax.set_facecolor('#111827')
stw_tensile = [t / (d / 1000) for t, d in zip(tensile, density)]
stw_compress = [c / (d / 1000) for c, d in zip(compressive, density)]
ax.bar(x - w/2, stw_compress, w, color=colors, alpha=0.9, label='Compressive')
ax.bar(x + w/2, stw_tensile, w, color=colors, alpha=0.5, label='Tensile', edgecolor='white', linewidth=0.5)
ax.set_xticks(x)
ax.set_xticklabels(materials, color='white', fontsize=8)
ax.set_ylabel('Strength / Weight (MPa·m³/kg)', color='white')
ax.set_title('Strength-to-Weight Ratio', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Cost and Carbon
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.bar(x - w/2, cost, w, color=colors, alpha=0.9, label='Relative cost')
ax.bar(x + w/2, carbon, w, color=colors, alpha=0.5, label='Carbon footprint', edgecolor='white', linewidth=0.5)
ax.axhline(0, color='gray', linewidth=0.5, linestyle='--')
ax.set_xticks(x)
ax.set_xticklabels(materials, color='white', fontsize=8)
ax.set_ylabel('Relative scale', color='white')
ax.set_title('Cost and Carbon Footprint', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.annotate('Absorbs CO₂!', xy=(3, -1), xytext=(3.5, -2),
            color='#22c55e', fontsize=9, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#22c55e'))

# 4. Stress-strain sketch
ax = axes[1, 1]
ax.set_facecolor('#111827')
strain_steel = np.concatenate([np.linspace(0, 0.002, 50), np.linspace(0.002, 0.15, 50)])
stress_steel = np.concatenate([250 * strain_steel[:50] / 0.002,
                               250 + 50 * np.sqrt((strain_steel[50:] - 0.002) / 0.148)])
strain_concrete = np.linspace(0, 0.003, 100)
stress_concrete = 40 * (2 * strain_concrete / 0.002 - (strain_concrete / 0.002) ** 2)
stress_concrete = np.clip(stress_concrete, 0, 40)
strain_wood = np.linspace(0, 0.01, 100)
stress_wood = 50 * (1 - np.exp(-300 * strain_wood))

ax.plot(strain_steel * 100, stress_steel, color='#3b82f6', linewidth=2, label='Steel')
ax.plot(strain_concrete * 100, stress_concrete, color='#94a3b8', linewidth=2, label='Concrete')
ax.plot(strain_wood * 100, stress_wood, color='#f59e0b', linewidth=2, label='Wood')
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Stress-Strain Behavior', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_xlim(0, 1.5)

plt.tight_layout()
plt.show()

print("Material selection rules of thumb:")
print("  Need compression?  → Concrete (cheap, strong in compression)")
print("  Need tension?      → Steel (strong in both, expensive)")
print("  Need light weight? → Wood or bamboo")
print("  Need zero carbon?  → Living roots (negative carbon!)")
print("  Need longevity?    → Living roots (500+ years, self-repairing)")`,
      challenge: 'Add bamboo to the stress-strain plot. Bamboo has a tensile strength of ~40 MPa and a Young\'s modulus of about 15 GPa. How does it compare to wood and steel?',
      successHint: 'No material is universally "best." The right material depends on the forces, the span, the budget, the environment, and the time scale. The Khasi people optimized for centuries of maintenance-free service — a design constraint that modern engineering is only beginning to appreciate.',
    },
    {
      title: 'Load and stress — how weight distributes across a structure',
      concept: `When you walk across a bridge, your weight doesn't just push straight down into one point. It distributes through the structure, spreading across members and into the supports. Understanding this distribution is the core skill of structural engineering.

**Load** is any force applied to a structure. It can be a **point load** (a person standing at one spot), a **distributed load** (the weight of the bridge deck spread evenly), or a **dynamic load** (a truck driving across — the load moves).

**Stress** is force divided by area: stress = F / A. A 1000 N force spread over 1 m² produces 1000 Pa of stress. The same force through a 1 cm² area produces 10,000,000 Pa (10 MPa). This is why stiletto heels damage floors but boots don't — same person, wildly different stress.

**Strain** is how much a material deforms: strain = change in length / original length. A 1-meter rod that stretches by 1 mm has a strain of 0.001 (0.1%).

The relationship between stress and strain defines a material's behavior. For most materials under small loads, stress = E x strain, where E is the **Young's modulus** (stiffness). Steel has E = 200 GPa (very stiff). Rubber has E = 0.01 GPa (very flexible). Ficus roots have E = roughly 1-3 GPa — flexible enough to guide when young, stiff enough to walk on when mature.`,
      analogy: 'Imagine lying on a bed of nails versus standing on one nail. Your total weight (load) is the same, but the stress on your skin is completely different. The bed of nails distributes the load across hundreds of points, reducing stress at each point below the threshold that would puncture skin. Every bridge does the same thing: distribute loads so that stress at any point stays below the material\'s strength.',
      storyConnection: 'A living root bridge distributes load beautifully because the interwoven root network acts like a natural truss. When someone steps on one part of the bridge, the load travels through dozens of interconnected roots to the anchor trees on each bank. Over centuries, the roots thicken most where stress is highest — the bridge literally adapts its structure to its loads, something no concrete bridge can do.',
      checkQuestion: 'An elephant weighs 5000 kg and has four feet, each roughly 0.08 m² in area. A woman weighs 60 kg and wears stiletto heels with a heel area of 0.0001 m². Who exerts more pressure on the ground?',
      checkAnswer: 'The woman in stilettos! Elephant: 5000 × 9.8 / (4 × 0.08) = 153,125 Pa. Woman on one heel: 60 × 9.8 / 0.0001 = 5,880,000 Pa — that\'s 38 times more pressure. This is why stilettos are banned on some historic wooden floors and aircraft.',
      codeIntro: 'Calculate and visualize how load distributes across a simple beam bridge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simply supported beam with a point load
# Using beam theory to calculate deflection, shear, and moment

L = 10.0  # beam length (m)
P = 10000  # point load (N) = ~1 tonne
a = 5.0   # load position (m from left)
E = 200e9  # Young's modulus (Pa) - steel
I = 1e-4   # second moment of area (m^4) - I-beam

x = np.linspace(0, L, 500)

# Reactions at supports
R_left = P * (L - a) / L
R_right = P * a / L

# Shear force diagram
V = np.where(x < a, R_left, R_left - P)

# Bending moment diagram
M = np.where(x < a, R_left * x, R_left * x - P * (x - a))

# Deflection (using double integration)
def deflection(x, P, a, L, E, I):
    b = L - a
    result = np.zeros_like(x)
    for i, xi in enumerate(x):
        if xi <= a:
            result[i] = P * b * xi / (6 * L * E * I) * (L**2 - xi**2 - b**2)
        else:
            result[i] = P * a * (L - xi) / (6 * L * E * I) * (2*L*(L-xi) - (L-xi)**2 - a**2)
    return result

delta = deflection(x, P, a, L, E, I) * 1000  # convert to mm

# Stress at top and bottom of beam (assuming beam depth h = 0.2m)
h = 0.2
stress_top = -M * (h/2) / I / 1e6  # compression (MPa)
stress_bottom = M * (h/2) / I / 1e6  # tension (MPa)

fig, axes = plt.subplots(4, 1, figsize=(12, 12), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Load Analysis: {P/1000:.0f} kN Point Load at x={a}m on {L}m Beam',
             color='white', fontsize=13, fontweight='bold')

# Deflection
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(x, delta, color='#22c55e', linewidth=2)
ax.fill_between(x, delta, alpha=0.2, color='#22c55e')
ax.set_ylabel('Deflection (mm)', color='white')
ax.set_title('Deflection (exaggerated)', color='white', fontsize=11)
ax.tick_params(colors='gray')
max_d = np.max(np.abs(delta))
ax.annotate(f'Max: {max_d:.2f} mm', xy=(x[np.argmax(delta)], max_d),
            xytext=(x[np.argmax(delta)] + 1, max_d * 0.8),
            color='#22c55e', fontsize=10, arrowprops=dict(arrowstyle='->', color='#22c55e'))

# Shear force
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(x, V / 1000, color='#3b82f6', linewidth=2)
ax.fill_between(x, V / 1000, alpha=0.2, color='#3b82f6')
ax.axhline(0, color='gray', linewidth=0.5, linestyle='--')
ax.set_ylabel('Shear (kN)', color='white')
ax.set_title('Shear Force Diagram', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Bending moment
ax = axes[2]
ax.set_facecolor('#111827')
ax.plot(x, M / 1000, color='#f59e0b', linewidth=2)
ax.fill_between(x, M / 1000, alpha=0.2, color='#f59e0b')
ax.set_ylabel('Moment (kN·m)', color='white')
ax.set_title('Bending Moment Diagram', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Stress
ax = axes[3]
ax.set_facecolor('#111827')
ax.plot(x, stress_top, color='#ef4444', linewidth=2, label='Top (compression)')
ax.plot(x, stress_bottom, color='#3b82f6', linewidth=2, label='Bottom (tension)')
ax.fill_between(x, stress_top, alpha=0.15, color='#ef4444')
ax.fill_between(x, stress_bottom, alpha=0.15, color='#3b82f6')
ax.axhline(0, color='gray', linewidth=0.5, linestyle='--')
ax.set_xlabel('Position along beam (m)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Stress at Top and Bottom of Beam', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Reactions: Left = {R_left/1000:.1f} kN, Right = {R_right/1000:.1f} kN")
print(f"Max deflection: {max_d:.2f} mm at x = {x[np.argmax(delta)]:.1f} m")
print(f"Max bending moment: {np.max(M)/1000:.1f} kN·m")
print(f"Max stress: {np.max(stress_bottom):.1f} MPa (tension at bottom)")
print(f"Steel yield stress: 250 MPa — safety factor = {250/np.max(stress_bottom):.1f}x")`,
      challenge: 'Move the load from the center (a=5) to a=3 (off-center). How do the diagrams change? Which support now carries more load? What happens to the maximum deflection?',
      successHint: 'Shear, moment, and deflection diagrams are the language structural engineers use to design every beam in every building and bridge you\'ve ever walked on. If you can read these diagrams, you can understand any structure.',
    },
    {
      title: 'Living root bridges — how Ficus elastica roots are trained over decades',
      concept: `The living root bridges of Meghalaya are perhaps the most remarkable examples of bio-engineering on Earth. They are built by the Khasi and Jaintia peoples using a process that takes 15-30 years and produces structures that last centuries.

The process begins with a **Ficus elastica** (rubber fig) tree planted on each bank of a stream. This species produces strong, flexible aerial roots that hang down from branches. The builders create a framework — traditionally using hollowed-out trunks of betel nut palms (Areca catechu) — across the gap. They guide young aerial roots into the hollow trunks, which channel the roots to the opposite bank.

Over years, the roots grow across the gap, reach the other side, and anchor into the soil. The betel nut framework eventually rots away (it's biodegradable scaffolding), leaving only the living roots. As more roots are guided and existing roots thicken, the bridge becomes stronger.

The roots respond to **mechanical stress** through a process called **thigmomorphogenesis** — plants that experience wind, weight, or bending grow thicker and stronger. A living root bridge literally becomes stronger because people walk on it. The mechanical loading stimulates the roots to produce more wood tissue, reinforcing precisely the areas under greatest stress.

Some living root bridges in Meghalaya are estimated to be over 500 years old. The double-decker bridge at Nongriat has two levels and can support the weight of 50+ people simultaneously.`,
      analogy: 'Imagine if you could plant two fence posts, stretch a rope between them, and over the next 20 years the rope turned into a steel cable — thickening, strengthening, and repairing itself whenever it was damaged. That\'s essentially what a living root bridge does. The "construction" is more like gardening: the builder is a guide, not a manufacturer.',
      storyConnection: 'The story says these bridges were "grown over decades by Khasi people." That phrase — grown, not built — captures the fundamental difference. A steel bridge is assembled at peak strength and then degrades. A living root bridge starts weak and grows stronger for centuries. It\'s anti-fragile: stress makes it better, not worse.',
      checkQuestion: 'Why does the living root bridge get stronger when people walk on it, while a steel bridge gets weaker with use?',
      checkAnswer: 'Living roots respond to mechanical stress by producing more lignin and secondary xylem (wood tissue) — a biological response called thigmomorphogenesis. More stress = more growth = more strength. Steel, by contrast, accumulates micro-cracks under repeated loading (metal fatigue). Each cycle weakens it slightly. Biology repairs; metal accumulates damage.',
      codeIntro: 'Model how a living root bridge strengthens over time compared to a conventional bridge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model: Living root bridge vs conventional bridge over time
years = np.arange(0, 200, 1)

# Conventional steel bridge
# Starts at full strength, degrades due to corrosion and fatigue
steel_initial = 100  # relative strength
steel_life = 75  # years before major repair needed
steel_strength = steel_initial * np.exp(-0.01 * years)
# Major repairs at year 75 and 150 (partial restoration)
steel_strength_maintained = steel_strength.copy()
for repair_year in [75, 150]:
    mask = years >= repair_year
    boost = 30 * np.exp(-0.01 * (years[mask] - repair_year))
    steel_strength_maintained[mask] += boost

# Living root bridge
# Starts weak, grows stronger over decades, then plateaus
root_max = 120  # eventually exceeds steel bridge
root_growth_rate = 0.03
root_strength = root_max * (1 - np.exp(-root_growth_rate * years))
# Add thigmomorphogenesis boost (usage makes it stronger)
usage_start = 20  # bridge becomes usable after 20 years
usage_boost = np.zeros_like(years, dtype=float)
usage_boost[years >= usage_start] = 15 * (1 - np.exp(-0.02 * (years[years >= usage_start] - usage_start)))
root_strength += usage_boost

fig, axes = plt.subplots(2, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Strength over time
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(years, steel_strength_maintained, color='#3b82f6', linewidth=2.5,
        label='Steel bridge (with repairs)')
ax.plot(years, steel_strength, color='#3b82f6', linewidth=1, linestyle='--',
        alpha=0.5, label='Steel bridge (no repairs)')
ax.plot(years, root_strength, color='#22c55e', linewidth=2.5,
        label='Living root bridge')

# Mark events
ax.axvline(usage_start, color='#22c55e', linewidth=0.8, linestyle=':', alpha=0.5)
ax.annotate('Bridge becomes\\nwalkable', xy=(usage_start, 30), color='#22c55e', fontsize=8)
for ry in [75, 150]:
    ax.axvline(ry, color='#3b82f6', linewidth=0.8, linestyle=':', alpha=0.5)
    ax.annotate(f'Major repair\\n($$$$)', xy=(ry, 80), color='#3b82f6', fontsize=8)

# Crossover point
crossover = np.argmin(np.abs(root_strength - steel_strength_maintained))
ax.plot(years[crossover], root_strength[crossover], 'o', color='#f59e0b', markersize=10)
ax.annotate(f'Crossover: year {years[crossover]}', xy=(years[crossover], root_strength[crossover]),
            xytext=(years[crossover] + 10, root_strength[crossover] - 15),
            color='#f59e0b', fontsize=10, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax.set_xlabel('Years', color='white')
ax.set_ylabel('Relative Strength', color='white')
ax.set_title('Bridge Strength Over Time: Steel vs Living Root', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')
ax.set_xlim(0, 200)

# Cumulative cost
ax2 = axes[1]
ax2.set_facecolor('#111827')

# Steel costs: construction + periodic maintenance + major repairs
steel_cost = np.zeros_like(years, dtype=float)
steel_cost[0] = 100  # initial construction
steel_cost += 2  # annual maintenance
for ry in [75, 150]:
    steel_cost[years >= ry] += 50  # major repair cost
steel_cumulative = np.cumsum(steel_cost)

# Root bridge costs: minimal — just labor to guide roots
root_cost = np.zeros_like(years, dtype=float)
root_cost[:30] = 3  # guiding roots for first 30 years
root_cost[30:] = 0.5  # minimal maintenance after maturity
root_cumulative = np.cumsum(root_cost)

ax2.plot(years, steel_cumulative, color='#3b82f6', linewidth=2.5, label='Steel bridge')
ax2.plot(years, root_cumulative, color='#22c55e', linewidth=2.5, label='Living root bridge')
ax2.fill_between(years, steel_cumulative, root_cumulative, alpha=0.1, color='#f59e0b')

ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Cumulative Cost (relative units)', color='white')
ax2.set_title('Cumulative Cost: The Long-Term Economics', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key insight: time horizon changes everything.")
print(f"  At year 50:  steel is stronger, root is catching up")
print(f"  At year {years[crossover]}: root bridge overtakes steel")
print(f"  At year 200: root bridge is stronger AND has cost ~{root_cumulative[-1]/steel_cumulative[-1]*100:.0f}% of steel")
print()
print("Modern engineering optimizes for 50-100 year lifespans.")
print("The Khasi people optimized for 500+ years.")
print("Different time horizons → different 'best' solutions.")`,
      challenge: 'Add a third line for a concrete bridge (starts strong, degrades faster than steel, cheaper initial cost but no self-repair). How does it compare over 200 years?',
      successHint: 'The living root bridge teaches a profound engineering lesson: if you design for centuries instead of decades, the optimal solution might be biological, not mechanical. This insight is driving the emerging field of bio-engineering.',
    },
    {
      title: 'Bio-engineering — growing structures instead of building them',
      concept: `Bio-engineering — also called biological engineering or biodesign — is the discipline of using living organisms or biological principles to solve engineering problems. The living root bridges of Meghalaya are perhaps the oldest and most dramatic example, but the field is exploding with modern applications.

**Biomimicry** copies nature's designs: Velcro (inspired by burrs), bullet trains (kingfisher beak shape), self-cleaning surfaces (lotus leaf). These use conventional materials but nature's geometry.

**Biocomposite materials** embed biological fibers in synthetic matrices: bamboo-reinforced concrete, mycelium-based insulation, spider-silk-inspired cables. These use nature's materials in engineered contexts.

**Living architecture** grows structures from living organisms: mycelium bricks (grown from fungus in 5 days), bacterial concrete (bacteria that produce limestone to self-heal cracks), and living root bridges. These use living organisms as the structure itself.

**Synthetic biology** engineers organisms to produce materials: bacteria that secrete spider silk proteins, yeast that produces bio-cement, algae that grow into structural panels. This is the frontier — designing life itself to solve engineering problems.

The living root bridges sit at the intersection of traditional ecological knowledge and cutting-edge bio-engineering. Researchers from IIT Meghalaya, MIT, and TU Munich are now studying them to understand how biological structures can inform modern sustainable infrastructure.`,
      analogy: 'Traditional engineering is like sculpture — you take raw material and carve it into shape. Bio-engineering is like farming — you plant something, create the right conditions, and let it grow into the shape you need. Sculpture gives you instant results but the piece degrades. Farming takes patience but the result is alive, self-repairing, and sustainable.',
      storyConnection: 'The Khasi builders of Meghalaya were bio-engineers centuries before the term existed. They understood that you don\'t always need to fight nature to build — sometimes you can collaborate with it. Every living root bridge is a testament to this philosophy: patient, sustainable, and built to last not decades but centuries. Modern bio-engineering is rediscovering what the Khasi always knew.',
      checkQuestion: 'Bacterial concrete contains bacteria that produce limestone (CaCO3) when cracks form, sealing them automatically. What advantage does this have over regular concrete maintenance?',
      checkAnswer: 'Regular concrete cracks are repaired only when detected by human inspection — which means water and salt can penetrate and corrode the rebar long before repair happens. Bacterial concrete heals cracks immediately and automatically, even in places humans can\'t reach (inside walls, underwater foundations). It\'s the difference between going to the hospital after you\'re sick and having an immune system that fights infection in real time.',
      codeIntro: 'Compare conventional vs bio-engineered approaches across multiple criteria.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Comparison: Conventional vs Bio-engineered approaches
categories = ['Construction\\nSpeed', 'Initial\\nStrength', 'Long-term\\nDurability',
              'Self-\\nRepair', 'Carbon\\nFootprint', 'Material\\nCost', 'Adaptability']
N = len(categories)

approaches = {
    'Steel/Concrete': [9, 10, 5, 1, 2, 4, 2],
    'Living Root Bridge': [1, 2, 10, 10, 10, 9, 8],
    'Mycelium Brick': [7, 5, 6, 3, 8, 7, 5],
    'Bacterial Concrete': [8, 8, 8, 8, 6, 5, 4],
    'Bamboo Composite': [7, 6, 6, 2, 9, 8, 5],
}

colors = {
    'Steel/Concrete': '#3b82f6',
    'Living Root Bridge': '#22c55e',
    'Mycelium Brick': '#a855f7',
    'Bacterial Concrete': '#f59e0b',
    'Bamboo Composite': '#ef4444',
}

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7),
                                subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Conventional vs Bio-Engineered Structures', color='white',
             fontsize=14, fontweight='bold')

# Radar chart
ax1.set_facecolor('#111827')
for name, values in approaches.items():
    vals = values + values[:1]
    ax1.plot(angles, vals, 'o-', linewidth=2, label=name, color=colors[name], markersize=4)
    ax1.fill(angles, vals, alpha=0.08, color=colors[name])

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(categories, color='white', fontsize=8)
ax1.set_ylim(0, 10)
ax1.set_yticks([2, 4, 6, 8, 10])
ax1.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax1.tick_params(colors='gray')
ax1.legend(loc='upper right', bbox_to_anchor=(0.1, -0.05), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=8, ncol=2)

# Timeline: when each technology becomes viable
ax2.set_facecolor('#111827')
# Convert to regular axes for timeline
ax2.remove()
ax2 = fig.add_subplot(122)
ax2.set_facecolor('#111827')

tech_timeline = {
    'Stone arch\\n(3000 BCE)': (-3000, '#94a3b8'),
    'Living root\\n(~500 yrs ago)': (-500, '#22c55e'),
    'Steel truss\\n(1840s)': (1840, '#3b82f6'),
    'Reinforced\\nconcrete (1850s)': (1850, '#64748b'),
    'Suspension\\n(1880s)': (1880, '#8b5cf6'),
    'Bamboo\\ncomposite (2000s)': (2000, '#ef4444'),
    'Mycelium\\nbrick (2010s)': (2010, '#a855f7'),
    'Bacterial\\nconcrete (2020s)': (2020, '#f59e0b'),
    'Synthetic bio\\nstructures (2030s?)': (2030, '#22d3ee'),
}

y_positions = np.arange(len(tech_timeline))
names = list(tech_timeline.keys())
dates = [v[0] for v in tech_timeline.values()]
clrs = [v[1] for v in tech_timeline.values()]

ax2.barh(y_positions, [2030 - d for d in dates], left=dates, color=clrs, height=0.5, alpha=0.6)
ax2.scatter(dates, y_positions, color=clrs, s=60, zorder=5)
ax2.set_yticks(y_positions)
ax2.set_yticklabels(names, color='white', fontsize=8)
ax2.set_xlabel('Year', color='white')
ax2.set_title('Timeline of Bridge/Structure Technologies', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_xlim(-3500, 2050)
ax2.axvline(2025, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax2.text(2025, len(tech_timeline) - 0.5, 'Today', color='white', fontsize=8, ha='center')

plt.tight_layout()
plt.show()

print("The future of structural engineering is biological:")
print()
print("  TODAY:")
print("  - Mycelium insulation panels (commercial)")
print("  - Bamboo-reinforced concrete (used in Asia, Africa)")
print("  - Bacterial self-healing concrete (pilot projects)")
print()
print("  NEAR FUTURE:")
print("  - 3D-printed bio-structures")
print("  - Genetically engineered fast-growing structural plants")
print("  - Carbon-negative buildings that absorb CO₂ as they grow")
print()
print("  The Khasi people's living root bridges aren't relics —")
print("  they're prototypes for the future of sustainable engineering.")`,
      challenge: 'Research one more bio-engineering approach (e.g., hempcrete, cross-laminated timber, or bio-plastics) and add it to the radar chart with your own scores for each category. Justify your scores.',
      successHint: 'You\'ve completed Level 1 — from understanding forces and materials to exploring the frontier of bio-engineering. The living root bridges of Meghalaya taught us that engineering isn\'t just about building faster and stronger. Sometimes the best engineering means growing slower and lasting longer. Level 2 takes you into the mathematics: calculating forces, analyzing trusses, and designing your own bridge.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Bio-engineering & Structures — no prior engineering experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for structural engineering simulations. Click to start.</p>
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
