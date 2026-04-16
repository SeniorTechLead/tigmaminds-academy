import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MagicJapiLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Circles, cones, and angles — the geometry of the Japi',
      concept: `The Japi (also spelled Jaapi) is the iconic conical hat of Assam — a symbol of Assamese identity worn during Bihu celebrations. Its shape is a **cone**: a 3D form created by rotating a right triangle around one of its legs.

Key geometric elements of the Japi:
- **Circle**: the base of the Japi is a circle. A circle is defined by all points equidistant from a center point. That distance is the **radius** (r).
- **Cone**: formed by connecting every point on a circular base to a single apex (tip). The Japi's peak is the apex.
- **Slant height** (l): the distance from the base edge to the apex, measured along the surface.
- **Height** (h): the vertical distance from base to apex.
- **Half-angle** (θ): the angle between the height and the slant height.

These are related by the Pythagorean theorem: **l² = r² + h²**

A typical Japi has a radius of about 30 cm and a height of about 15 cm, giving a slant height of √(900 + 225) = √1125 ≈ 33.5 cm. The half-angle is arctan(30/15) = 63.4°, making it a wide, shallow cone — perfect for rain protection.`,
      analogy: 'A cone is like an ice cream cone or a party hat — a flat circle bent up into a point. The steeper you pull the point up, the taller and narrower the cone gets. The Japi is a low, wide cone — more like a shallow funnel than a steep party hat — because its job is to shed rain sideways.',
      storyConnection: 'In the story, the magic Japi gave its wearer wisdom with every raindrop that rolled off its surface. The genius of the Japi\'s geometry is real: its conical shape means rain slides off in every direction, never pooling. The cone angle is steep enough to shed water but shallow enough to shade the face. Form follows function — and function is geometry.',
      checkQuestion: 'Why is the Japi shaped like a cone rather than a flat disc or a hemisphere?',
      checkAnswer: 'A flat disc would collect rain on top. A hemisphere would shed rain but is harder to construct from flat materials (bamboo and palm leaves). A cone sheds rain efficiently and can be made by bending a flat sector of material into shape — no stretching or compressing needed. The cone is the optimal compromise between rain-shedding, sun-shading, and constructability from flat materials.',
      codeIntro: 'Visualize the Japi\'s conical geometry and its key measurements.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Japi dimensions
radius = 30  # cm
height = 15  # cm
slant = np.sqrt(radius**2 + height**2)
half_angle = np.degrees(np.arctan(radius / height))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# --- Side view (cross-section) ---
ax1.set_facecolor('#111827')
# Draw the triangle
ax1.plot([-radius, 0, radius, -radius], [0, height, 0, 0], color='#f59e0b', linewidth=2.5)
# Height line
ax1.plot([0, 0], [0, height], color='#22c55e', linewidth=1.5, linestyle='--', label=f'Height = {height} cm')
# Slant line
ax1.plot([0, radius], [height, 0], color='#ef4444', linewidth=1.5, linestyle='--', label=f'Slant = {slant:.1f} cm')
# Radius line
ax1.plot([0, radius], [0, 0], color='#3b82f6', linewidth=1.5, linestyle='--', label=f'Radius = {radius} cm')
# Angle arc
angle_r = 5
theta_arc = np.linspace(np.pi/2, np.pi/2 - np.radians(half_angle), 30)
ax1.plot(angle_r * np.cos(theta_arc), height + angle_r * np.sin(theta_arc) - angle_r,
         color='#a855f7', linewidth=2)
ax1.text(3, height - 7, f'θ = {half_angle:.1f}°', color='#a855f7', fontsize=10)

# Rain arrows
for x in [-20, -10, 0, 10, 20]:
    ax1.annotate('', xy=(x + 3, height * (1 - abs(x)/radius) - 2),
                xytext=(x, height * (1 - abs(x)/radius) + 5),
                arrowprops=dict(arrowstyle='->', color='#06b6d4', lw=1.5))
ax1.text(-25, height + 3, 'Rain', color='#06b6d4', fontsize=9)

ax1.set_xlabel('Width (cm)', color='white')
ax1.set_ylabel('Height (cm)', color='white')
ax1.set_title('Japi Cross-Section', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.set_aspect('equal')
ax1.tick_params(colors='gray')
ax1.set_ylim(-5, height + 10)

# --- 3D-ish top view ---
ax2.set_facecolor('#111827')
theta = np.linspace(0, 2*np.pi, 100)
# Concentric circles (rings of the Japi)
for r_ring in [5, 10, 15, 20, 25, 30]:
    alpha = 0.3 + 0.5 * (r_ring / 30)
    ax2.plot(r_ring * np.cos(theta), r_ring * np.sin(theta),
             color='#f59e0b', linewidth=1, alpha=alpha)

# Radial lines (bamboo spokes)
for angle in np.linspace(0, 2*np.pi, 12, endpoint=False):
    ax2.plot([0, radius * np.cos(angle)], [0, radius * np.sin(angle)],
             color='#f59e0b', linewidth=0.8, alpha=0.5)

# Center point (apex)
ax2.plot(0, 0, 'o', color='#ef4444', markersize=8, label='Apex')
ax2.plot(0, 0, 'o', color='#ef4444', markersize=3)

ax2.set_aspect('equal')
ax2.set_title('Japi Top View', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.set_xlabel('cm', color='white')

plt.tight_layout()
plt.show()

print(f"Japi geometry:")
print(f"  Radius: {radius} cm")
print(f"  Height: {height} cm")
print(f"  Slant height: {slant:.1f} cm")
print(f"  Half-angle: {half_angle:.1f}°")
print(f"  Pythagorean check: {radius}² + {height}² = {radius**2 + height**2} = {slant:.1f}²")`,
      challenge: 'What happens to the slant height if you double the height but keep the radius the same? How does the half-angle change? A steeper Japi sheds rain faster but provides less shade. Find the angle that balances both.',
      successHint: 'The Pythagorean theorem and basic trigonometry describe the Japi perfectly. These same tools describe every cone in engineering: rocket nose cones, funnels, loudspeakers, and volcanic mountains.',
    },
    {
      title: 'Surface area of a cone — how much material to make a Japi?',
      concept: `To build a Japi, you need to know how much bamboo and palm leaf material to cut. This requires calculating the **surface area of a cone**.

A cone has two surfaces:
- **Lateral (side) surface area** = π × r × l (where l is the slant height)
- **Base area** = π × r² (but the Japi base is open — you wear it on your head!)

So for a Japi, the material needed is just the **lateral surface area**: A = π × r × l

For our Japi (r = 30 cm, l = 33.5 cm):
A = π × 30 × 33.5 = **3,157 cm²** ≈ 0.32 m²

Here's the remarkable thing: if you cut the cone along a straight line from base to apex and flatten it, you get a **sector** (pie slice) of a larger circle. The radius of this sector equals the slant height (l), and the arc length equals the circumference of the cone's base (2πr).

The sector angle: θ = (r/l) × 360° = (30/33.5) × 360° = **322.4°**

This means a Japi-maker cuts a nearly-complete circle from flat material and then brings the cut edges together to form the cone. The gap (37.6°) determines how steep the cone is.`,
      analogy: 'Imagine cutting a pizza along one radius and then overlapping the cut edges slightly. The pizza lifts up into a shallow cone — a tiny Japi! The more you overlap, the steeper the cone. No overlap = flat circle. Complete overlap = infinitely tall, zero-width spike. The Japi\'s particular overlap gives it its characteristic gentle slope.',
      storyConnection: 'In the story, the Japi was woven by an old craftsman who "knew the exact angle." That angle — the sector angle — determines everything about the hat: how steep it is, how much rain it sheds, how much shade it gives. The craftsman\'s knowledge was geometry, passed down through generations.',
      checkQuestion: 'If you want to make a taller, steeper Japi (same base radius but twice the height), how much more material do you need?',
      checkAnswer: 'Original: l = √(30² + 15²) = 33.5 cm, Area = π × 30 × 33.5 = 3,157 cm². Taller: l = √(30² + 30²) = 42.4 cm, Area = π × 30 × 42.4 = 3,997 cm². That\'s about 27% more material for twice the height. The relationship isn\'t linear because surface area depends on slant height, which grows with the square root of (r² + h²).',
      codeIntro: 'Calculate and visualize the flat pattern (net) needed to construct a Japi.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Japi dimensions
radius = 30  # cm
height = 15  # cm
slant = np.sqrt(radius**2 + height**2)
circumference = 2 * np.pi * radius
sector_angle_rad = circumference / slant  # in radians
sector_angle_deg = np.degrees(sector_angle_rad)
lateral_area = np.pi * radius * slant

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# --- Flat pattern (sector) ---
ax1.set_facecolor('#111827')
theta = np.linspace(0, sector_angle_rad, 200)
# Outer arc
x_outer = slant * np.cos(theta)
y_outer = slant * np.sin(theta)
# Fill the sector
sector_x = np.concatenate([[0], x_outer, [0]])
sector_y = np.concatenate([[0], y_outer, [0]])
ax1.fill(sector_x, sector_y, color='#f59e0b', alpha=0.2)
ax1.plot(sector_x, sector_y, color='#f59e0b', linewidth=2)

# Labels
ax1.plot([0, slant], [0, 0], color='#ef4444', linewidth=1.5, linestyle='--')
ax1.text(slant/2, -2, f'Slant = {slant:.1f} cm', color='#ef4444', fontsize=9, ha='center')

# Arc length label
mid_theta = sector_angle_rad / 2
ax1.annotate(f'Arc = 2πr = {circumference:.1f} cm',
             xy=(slant * np.cos(mid_theta), slant * np.sin(mid_theta)),
             xytext=(slant * 0.5 * np.cos(mid_theta) + 5, slant * 0.5 * np.sin(mid_theta) + 5),
             color='#3b82f6', fontsize=9, arrowprops=dict(arrowstyle='->', color='#3b82f6'))

# Angle arc
arc_r = 8
arc_theta = np.linspace(0, sector_angle_rad, 50)
ax1.plot(arc_r * np.cos(arc_theta), arc_r * np.sin(arc_theta), color='#a855f7', linewidth=2)
ax1.text(10, 5, f'{sector_angle_deg:.1f}°', color='#a855f7', fontsize=11, fontweight='bold')

# Gap annotation
gap_deg = 360 - sector_angle_deg
ax1.text(slant * 0.7, -5, f'Gap: {gap_deg:.1f}° (this closes to form the cone)',
         color='gray', fontsize=8)

ax1.set_aspect('equal')
ax1.set_title(f'Flat Pattern (Net) for Japi', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# --- Surface area vs height ---
ax2.set_facecolor('#111827')
heights = np.linspace(5, 50, 100)
slants = np.sqrt(radius**2 + heights**2)
areas = np.pi * radius * slants
angles = np.degrees(np.arctan(radius / heights))

ax2_twin = ax2.twinx()
ax2.plot(heights, areas, color='#22c55e', linewidth=2.5, label='Surface area')
ax2_twin.plot(heights, angles, color='#f59e0b', linewidth=2.5, linestyle='--', label='Half-angle')

# Mark our Japi
ax2.plot(height, lateral_area, 'o', color='#ef4444', markersize=10, zorder=5)
ax2.annotate(f'Our Japi\
{lateral_area:.0f} cm²',
             xy=(height, lateral_area), xytext=(height + 8, lateral_area + 500),
             color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.set_xlabel('Cone height (cm)', color='white')
ax2.set_ylabel('Lateral surface area (cm²)', color='#22c55e')
ax2_twin.set_ylabel('Half-angle (degrees)', color='#f59e0b')
ax2.set_title('How Height Affects Area and Angle', color='white', fontsize=13)
ax2.tick_params(colors='gray', axis='x')
ax2.tick_params(colors='#22c55e', axis='y')
ax2_twin.tick_params(colors='#f59e0b', axis='y')

plt.tight_layout()
plt.show()

print(f"Japi construction data:")
print(f"  Material needed: {lateral_area:.0f} cm² = {lateral_area/10000:.2f} m²")
print(f"  Flat pattern: a sector of radius {slant:.1f} cm")
print(f"  Sector angle: {sector_angle_deg:.1f}° (out of 360°)")
print(f"  Gap to close: {gap_deg:.1f}°")
print(f"  The flatter the cone (wider angle), the LESS material needed")`,
      challenge: 'A Japi-maker has exactly 0.5 m² (5000 cm²) of palm leaf. What is the maximum radius Japi they can make if the height is 15 cm? Solve: π × r × √(r² + 225) = 5000.',
      successHint: 'The cone\'s flat pattern (net) is one of the most useful concepts in manufacturing. Sheet metal workers, tailors, and tent-makers all use the same geometry to cut flat material that folds into 3D shapes.',
    },
    {
      title: 'Symmetry in design — why the Japi is beautiful',
      concept: `The Japi possesses multiple types of **symmetry**, and this is a large part of why humans find it aesthetically pleasing:

1. **Rotational symmetry**: Rotate the Japi around its vertical axis by any angle — it looks the same. This is **continuous rotational symmetry** (also called axial symmetry), the highest order of rotational symmetry possible.

2. **Reflection symmetry**: Any vertical plane through the apex divides the Japi into two mirror halves. There are infinitely many such planes.

3. **Pattern symmetry**: The decorative bands on a Japi use **translational symmetry** (the pattern repeats along the circumference) and **reflective symmetry** (the pattern is mirrored).

Why does symmetry feel beautiful? Evolutionary psychologists suggest our brains evolved to prefer symmetry because:
- Symmetrical faces indicate genetic health
- Symmetrical patterns in nature often signal order (crystals, flowers)
- Detecting symmetry helped our ancestors identify ripe fruit, healthy mates, and safe shelter

Mathematically, symmetry is described by **group theory** — a branch of abstract algebra that classifies all possible symmetries. The symmetry group of a cone is called **C∞v** — infinite rotational symmetry with vertical mirror planes.`,
      analogy: 'Symmetry is like a password that unlocks beauty. A face with perfect left-right symmetry (one reflection axis) is attractive. A snowflake with 6-fold rotational symmetry is stunning. A Japi with infinite rotational symmetry is, mathematically speaking, the most symmetric 3D shape possible (short of a sphere). The more symmetry axes, the more our brains say "this is right."',
      storyConnection: 'The magic Japi in the story was described as "perfectly round, perfectly balanced." That perfection is symmetry — every angle of the Japi looks the same, every raindrop slides off identically. The craftsman\'s skill lay in achieving this symmetry from imperfect natural materials: hand-split bamboo and irregular palm leaves.',
      checkQuestion: 'A butterfly has one line of symmetry. A starfish has five lines. How many lines of symmetry does a Japi have?',
      checkAnswer: 'Infinitely many. Any vertical plane through the center axis is a line of symmetry. The Japi has the same symmetry as a cone or a circle — continuous rotational symmetry. Every rotation around the central axis leaves it unchanged. Mathematically, this is a higher order of symmetry than any regular polygon.',
      codeIntro: 'Visualize the symmetry properties of the Japi and common patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Symmetry: From Nature to the Japi', color='white', fontsize=14, y=1.02)

# --- 1: Reflection symmetry ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Simple butterfly-like shape
t = np.linspace(0, 2*np.pi, 200)
r_shape = 1 + 0.3 * np.cos(2*t) + 0.1 * np.cos(4*t)
x = r_shape * np.cos(t)
y = r_shape * np.sin(t)
ax.fill(x, y, color='#f59e0b', alpha=0.3)
ax.plot(x, y, color='#f59e0b', linewidth=2)
ax.axvline(0, color='#ef4444', linewidth=2, linestyle='--', label='1 mirror line')
ax.set_title('1 Reflection Axis', color='white', fontsize=10)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

# --- 2: 4-fold rotational ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
r_shape = 1 + 0.3 * np.cos(4*t)
x = r_shape * np.cos(t)
y = r_shape * np.sin(t)
ax.fill(x, y, color='#3b82f6', alpha=0.3)
ax.plot(x, y, color='#3b82f6', linewidth=2)
for angle in [0, 45, 90, 135]:
    rad = np.radians(angle)
    ax.plot([-1.5*np.cos(rad), 1.5*np.cos(rad)], [-1.5*np.sin(rad), 1.5*np.sin(rad)],
            color='#ef4444', linewidth=1, linestyle='--')
ax.set_title('4-Fold Rotational (4 axes)', color='white', fontsize=10)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- 3: 6-fold (snowflake) ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
r_shape = 1 + 0.4 * np.cos(6*t)
x = r_shape * np.cos(t)
y = r_shape * np.sin(t)
ax.fill(x, y, color='#22c55e', alpha=0.3)
ax.plot(x, y, color='#22c55e', linewidth=2)
for angle in np.linspace(0, 150, 6):
    rad = np.radians(angle)
    ax.plot([-1.5*np.cos(rad), 1.5*np.cos(rad)], [-1.5*np.sin(rad), 1.5*np.sin(rad)],
            color='#ef4444', linewidth=1, linestyle='--')
ax.set_title('6-Fold Rotational (snowflake)', color='white', fontsize=10)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- 4: Infinite rotational (circle/Japi) ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
theta_c = np.linspace(0, 2*np.pi, 200)
for r in [0.3, 0.6, 0.9, 1.2]:
    ax.plot(r * np.cos(theta_c), r * np.sin(theta_c), color='#f59e0b', linewidth=1.5,
            alpha=0.4 + 0.4 * r/1.2)
ax.plot(0, 0, 'o', color='#ef4444', markersize=5)
ax.text(0, -1.5, '∞ rotation axes', color='#ef4444', ha='center', fontsize=9)
ax.set_title('∞-Fold Rotational (Japi top view)', color='white', fontsize=10)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- 5: Symmetry order comparison ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
objects = ['Butterfly', 'Rectangle', 'Square', 'Hexagon', 'Circle/Japi']
orders = [1, 2, 4, 6, 100]  # 100 represents infinity
colors_bar = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7']
bars = ax.barh(objects, orders, color=colors_bar, height=0.6)
ax.set_xlabel('Number of symmetry axes', color='white')
ax.set_title('Symmetry Order Comparison', color='white', fontsize=10)
ax.tick_params(colors='gray')
for bar, val in zip(bars, orders):
    label = '∞' if val == 100 else str(val)
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2, label,
            va='center', color='white', fontsize=10)
ax.set_xlim(0, 120)

# --- 6: Japi band pattern (translational symmetry) ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Repeating pattern along a band
for i in range(12):
    x_start = i * 1.0
    # Triangle up
    ax.fill([x_start, x_start + 0.5, x_start + 1.0], [0, 0.8, 0],
            color='#f59e0b', alpha=0.6)
    # Triangle down (inverted)
    ax.fill([x_start, x_start + 0.5, x_start + 1.0], [0, -0.8, 0],
            color='#22c55e', alpha=0.6)
ax.set_title('Japi Band Pattern (translational symmetry)', color='white', fontsize=10)
ax.set_xlim(-0.5, 12.5); ax.set_ylim(-1.2, 1.2)
ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Symmetry orders:")
print("  Butterfly: 1 axis (bilateral)")
print("  Rectangle: 2 axes")
print("  Square: 4 axes")
print("  Hexagon: 6 axes")
print("  Circle/Japi: INFINITE axes")
print()
print("The Japi's infinite rotational symmetry makes it")
print("one of the most mathematically symmetric objects in daily life.")`,
      challenge: 'Create a shape with exactly 5-fold symmetry (like a starfish) using r = 1 + 0.3 * cos(5θ) in polar coordinates. Then try 7-fold, 3-fold. Which looks most "natural" to you?',
      successHint: 'Symmetry is the mathematical backbone of beauty — in nature, art, and design. Group theory, which classifies symmetries, is also fundamental to physics (conservation laws) and chemistry (molecular orbitals).',
    },
    {
      title: 'Tessellations — patterns that cover a surface perfectly',
      concept: `A **tessellation** (or tiling) is a pattern of shapes that covers a flat surface with no gaps and no overlaps. The Japi's woven surface is a tessellation — bamboo strips interlocking in a repeating pattern that covers the entire cone.

**Regular tessellations** use one type of regular polygon:
- **Triangles**: 6 meet at each vertex (60° × 6 = 360°)
- **Squares**: 4 meet at each vertex (90° × 4 = 360°)
- **Hexagons**: 3 meet at each vertex (120° × 3 = 360°)

These are the ONLY three regular tessellations. Why? Because the interior angles must sum to exactly 360° at each vertex. Pentagons (108° each) can't tile: 3 × 108° = 324° (gap), 4 × 108° = 432° (overlap).

**Semi-regular tessellations** use two or more regular polygons. There are exactly 8 of these (e.g., squares + octagons, triangles + hexagons).

Bamboo weaving in the Japi creates a tessellation of rhombuses (diamond shapes) — the natural pattern when two sets of parallel strips cross at an angle. The angle between the strips determines the shape of the rhombuses.`,
      analogy: 'Tessellation is like tiling a bathroom floor. You can use square tiles, hexagonal tiles, or triangular tiles and cover the floor perfectly. But try pentagonal tiles — you\'ll always have gaps or overlaps. The math of which shapes tile and which don\'t is surprisingly deep and connects to crystallography, materials science, and even Escher\'s art.',
      storyConnection: 'The magic Japi\'s weave was described as "seamless, without a gap or a hole." This is literally what a tessellation is — a perfect covering. The craftsman who wove the Japi chose a weave pattern (rhombic tessellation) that guaranteed no gaps in the rain-shedding surface. Geometry ensures waterproofing.',
      checkQuestion: 'Pentagons can\'t tessellate regularly. But can irregular pentagons tessellate? (This was an open math problem for decades.)',
      checkAnswer: 'Yes! As of 2015, exactly 15 types of irregular (convex) pentagons are known to tessellate the plane. The 15th was discovered by Casey Mann, Jennifer McLoud-Mann, and David Von Derau using a computer search. In 2017, Michaël Rao proved that no 16th type exists, completing the classification. Irregular shapes can tile even when regular ones can\'t — the asymmetry gives them extra flexibility.',
      codeIntro: 'Generate the three regular tessellations and a bamboo weave pattern.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(12, 12))
fig.patch.set_facecolor('#1f2937')

# --- Triangle tessellation ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
for row in range(8):
    for col in range(10):
        x0 = col * 1.0 + (row % 2) * 0.5
        y0 = row * np.sqrt(3)/2
        # Upward triangle
        tri_up = plt.Polygon([(x0, y0), (x0+1, y0), (x0+0.5, y0+np.sqrt(3)/2)],
                              fill=True, facecolor='#22c55e', edgecolor='white', linewidth=0.5, alpha=0.5)
        ax.add_patch(tri_up)
        # Downward triangle
        tri_down = plt.Polygon([(x0+0.5, y0+np.sqrt(3)/2), (x0+1, y0), (x0+1.5, y0+np.sqrt(3)/2)],
                                fill=True, facecolor='#16a34a', edgecolor='white', linewidth=0.5, alpha=0.5)
        ax.add_patch(tri_down)
ax.set_xlim(0, 10); ax.set_ylim(0, 7)
ax.set_title('Triangle Tessellation', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- Square tessellation ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
for row in range(8):
    for col in range(10):
        color = '#3b82f6' if (row + col) % 2 == 0 else '#2563eb'
        sq = plt.Rectangle((col, row), 1, 1, facecolor=color, edgecolor='white',
                            linewidth=0.5, alpha=0.5)
        ax.add_patch(sq)
ax.set_xlim(0, 10); ax.set_ylim(0, 8)
ax.set_title('Square Tessellation', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- Hexagonal tessellation ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
for row in range(6):
    for col in range(7):
        cx = col * 1.5
        cy = row * np.sqrt(3) + (col % 2) * np.sqrt(3)/2
        hex_angles = np.linspace(0, 2*np.pi, 7)
        hex_x = cx + np.cos(hex_angles)
        hex_y = cy + np.sin(hex_angles)
        color = '#f59e0b' if (row + col) % 3 == 0 else '#d97706' if (row + col) % 3 == 1 else '#b45309'
        ax.fill(hex_x, hex_y, color=color, alpha=0.5, edgecolor='white', linewidth=0.5)
ax.set_xlim(0, 10); ax.set_ylim(0, 10)
ax.set_title('Hexagonal Tessellation', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- Bamboo weave (rhombic) ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
angle = 60  # degrees between strip sets
rad = np.radians(angle)
strip_width = 0.4
n_strips = 15

# Set 1: horizontal-ish strips
for i in range(-5, n_strips):
    y_base = i * strip_width * 2
    verts = [(0, y_base), (12, y_base), (12, y_base + strip_width), (0, y_base + strip_width)]
    ax.add_patch(plt.Polygon(verts, facecolor='#f59e0b', alpha=0.4, edgecolor='none'))

# Set 2: angled strips
for i in range(-10, n_strips + 5):
    x_base = i * strip_width * 2 / np.sin(rad)
    x = [x_base, x_base + 12*np.cos(rad), x_base + 12*np.cos(rad) + strip_width/np.sin(rad),
         x_base + strip_width/np.sin(rad)]
    y = [0, 12*np.sin(rad), 12*np.sin(rad), 0]
    ax.add_patch(plt.Polygon(list(zip(x, y)), facecolor='#92400e', alpha=0.4, edgecolor='none'))

ax.set_xlim(0, 10); ax.set_ylim(0, 8)
ax.set_title('Bamboo Weave Pattern (Japi)', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Only 3 regular polygons can tessellate alone:")
print("  Triangle (6 at vertex): 60° × 6 = 360° ✓")
print("  Square (4 at vertex):   90° × 4 = 360° ✓")
print("  Hexagon (3 at vertex): 120° × 3 = 360° ✓")
print("  Pentagon: 108° × 3 = 324° ✗ (gap!)")
print()
print("The Japi uses a rhombic weave — two sets of")
print("parallel strips crossing at 60°, creating a")
print("tessellation of rhombuses. No gaps, no overlaps.")`,
      challenge: 'Change the weave angle from 60° to 45°, then to 90°. How does the rhombus shape change? At 90° the rhombuses become squares. Why might the craftsman choose 60° over 90°?',
      successHint: 'Tessellations appear in floor tiles, honeycombs, crystal structures, textile weaves, and Islamic art. Understanding which shapes tile and why is fundamental geometry with endless practical applications.',
    },
    {
      title: 'Traditional patterns — the mathematics of decoration',
      concept: `The decorative bands on a Japi follow strict mathematical rules, even though the artisans never studied formal mathematics. These rules are the **seven frieze groups** — the only possible symmetry types for a repeating pattern along a strip:

1. **Translation only** (p1): the simplest — just repeat
2. **Translation + vertical reflection** (p1m1): mirror across the strip's axis
3. **Translation + horizontal reflection** (p11m): mirror along the strip's length
4. **Translation + 180° rotation** (p2): flip the motif upside down
5. **Translation + glide reflection** (p11g): shift and mirror
6. **Translation + vertical reflection + 180° rotation** (p2mm): full symmetric
7. **Translation + glide reflection + vertical reflection** (p2mg): the most complex

The Japi's bands typically use p2mm (the most symmetric) or p1m1 patterns. The mathematical constraint is that there are exactly 7 types — no more, no fewer. This was proven using group theory.

Assamese textile patterns (mekhela chador, gamosa) also follow these frieze groups. The weavers discovered by trial and error what mathematicians proved by theorem: only 7 types of strip pattern exist.`,
      analogy: 'Frieze groups are like the seven possible ways to walk along a straight line while doing gymnastics: walk forward (translation), walk forward and clap left-right (vertical reflection), walk forward and do cartwheels (rotation), walk forward and do mirror-flips (glide reflection), and so on. There are only 7 distinct combinations — just as there are only 7 frieze group symmetries.',
      storyConnection: 'The magic Japi had "patterns that told stories" — geometric bands that encoded cultural meaning. These patterns, mathematically, can only fall into 7 symmetry categories. The artisan who decorated the Japi was working within the same mathematical framework that governs Greek friezes, Islamic borders, and Chinese lattice patterns.',
      checkQuestion: 'Why exactly 7 frieze groups? What limits the number?',
      checkAnswer: 'A frieze pattern must have translational symmetry (it repeats). The only additional symmetries possible in a 1D strip are: reflection across the strip axis, reflection along the strip length, 180° rotation, and glide reflection. These are the ONLY isometries that preserve a strip. Combining them yields exactly 7 distinct groups — this is a proven mathematical theorem, not a matter of taste or discovery.',
      codeIntro: 'Generate examples of each of the 7 frieze groups.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(7, 1, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('The 7 Frieze Groups: All Possible Strip Patterns', color='white', fontsize=14, y=1.01)

def draw_motif(ax, x, y, flip_h=False, flip_v=False, color='#f59e0b'):
    """Draw an asymmetric L-shaped motif."""
    sx = -1 if flip_h else 1
    sy = -1 if flip_v else 1
    verts = [(x, y), (x + sx*0.3, y), (x + sx*0.3, y + sy*0.15),
             (x + sx*0.15, y + sy*0.15), (x + sx*0.15, y + sy*0.4), (x, y + sy*0.4)]
    ax.add_patch(plt.Polygon(verts, facecolor=color, edgecolor='white', linewidth=0.5))

groups = [
    ('p1: Translation only', lambda ax: [draw_motif(ax, i*0.6, 0) for i in range(18)]),
    ('p11m: Translation + horizontal mirror', lambda ax: [
        (draw_motif(ax, i*0.6, 0.05), draw_motif(ax, i*0.6, -0.05, flip_v=True, color='#3b82f6'))
        for i in range(18)]),
    ('p1m1: Translation + vertical mirror', lambda ax: [
        (draw_motif(ax, i*0.6, 0), draw_motif(ax, i*0.6 + 0.3, 0, flip_h=True, color='#3b82f6'))
        for i in range(9)]),
    ('p2: Translation + 180° rotation', lambda ax: [
        (draw_motif(ax, i*0.6, 0.05),
         draw_motif(ax, i*0.6 + 0.3, -0.05, flip_h=True, flip_v=True, color='#3b82f6'))
        for i in range(9)]),
    ('p11g: Translation + glide reflection', lambda ax: [
        (draw_motif(ax, i*1.2, 0.05),
         draw_motif(ax, i*1.2 + 0.6, -0.05, flip_v=True, color='#3b82f6'))
        for i in range(9)]),
    ('p2mm: Full symmetric (common in Japi)', lambda ax: [
        (draw_motif(ax, i*0.6, 0.05), draw_motif(ax, i*0.6, -0.05, flip_v=True, color='#3b82f6'),
         draw_motif(ax, i*0.6 + 0.3, 0.05, flip_h=True, color='#22c55e'),
         draw_motif(ax, i*0.6 + 0.3, -0.05, flip_h=True, flip_v=True, color='#ef4444'))
        for i in range(9)]),
    ('p2mg: Glide + vertical mirror', lambda ax: [
        (draw_motif(ax, i*1.2, 0.05), draw_motif(ax, i*1.2 + 0.6, -0.05, flip_h=True, flip_v=True, color='#3b82f6'),
         draw_motif(ax, i*1.2 + 0.3, 0.05, flip_h=True, color='#22c55e'),
         draw_motif(ax, i*1.2 + 0.9, -0.05, flip_v=True, color='#ef4444'))
        for i in range(5)]),
]

for ax, (title, draw_fn) in zip(axes, groups):
    ax.set_facecolor('#111827')
    draw_fn(ax)
    ax.set_xlim(-0.2, 11)
    ax.set_ylim(-0.5, 0.5)
    ax.set_title(title, color='white', fontsize=9, loc='left', pad=2)
    ax.set_xticks([]); ax.set_yticks([])
    ax.axhline(0, color='gray', linewidth=0.5, linestyle=':', alpha=0.3)

plt.tight_layout()
plt.show()

print("The 7 frieze groups — ALL possible strip pattern symmetries:")
print("  p1:   translate only")
print("  p11m: translate + mirror along strip")
print("  p1m1: translate + mirror across strip")
print("  p2:   translate + 180° rotate")
print("  p11g: translate + glide reflect")
print("  p2mm: translate + both mirrors + rotate (MOST symmetric)")
print("  p2mg: translate + glide + vertical mirror")
print()
print("Every decorative border ever made falls into one of these 7.")`,
      challenge: 'Find the frieze group of a pattern on a real object near you — a fence, a wallpaper border, a belt, or a piece of fabric. Classify it using the 7 groups. Most people are surprised to find p2mm is the most common.',
      successHint: 'The 7 frieze groups prove that mathematical constraints govern art and craft. Whether it is an Assamese Japi, a Greek temple frieze, or an Islamic tile border, the patterns must follow one of exactly 7 rules.',
    },
    {
      title: 'Geometry in architecture — from Japi to buildings',
      concept: `The Japi's conical geometry appears throughout architecture, both traditional and modern:

**Traditional Assamese architecture**:
- **Xatriya prayer halls**: long rectangular halls with soaring hip roofs — the roof shape is a combination of triangular and trapezoidal faces
- **Chang ghar** (stilt houses): the raised floor uses rectangles and triangles for structural strength
- **Mooidam** (Ahom burial mounds): hemispherical domes — a different surface of revolution than the Japi's cone
- **Ranghar** (Ahom amphitheater): combines arched openings with a long boat-shaped roof

**Geometric principles in all architecture**:
- **Load distribution**: triangles are rigid (a triangle can't deform without changing side lengths). This is why roofs, bridges, and towers use triangles.
- **Arches and domes**: distribute weight radially — every point on an arch pushes against its neighbors
- **The golden ratio** (φ ≈ 1.618): appears in many buildings considered aesthetically pleasing — from the Parthenon to the Taj Mahal

The Japi's cone is strong because it's a **surface of revolution** — forces are distributed evenly around the axis. A pointed tip (apex) at the top sheds loads efficiently, which is why pagodas, church spires, and rocket nose cones all share the Japi's basic geometry.`,
      analogy: 'A building is a geometry problem with gravity. Every wall, beam, and roof must channel the force of gravity safely to the ground. Triangles are like unbreakable links in a chain — rigid and reliable. Rectangles are like wobbly parallelograms waiting to collapse. That is why triangles appear everywhere in structures: roof trusses, bridge girders, and the Japi itself.',
      storyConnection: 'The magic Japi protected its wearer from rain, sun, and even falling branches in the story. Its conical shape is structurally strong — point loads at the apex distribute radially, and the curve resists buckling. The same geometry that makes a Japi waterproof makes a dome earthquake-resistant.',
      checkQuestion: 'Why are most roofs sloped (triangular) rather than flat?',
      checkAnswer: 'Three reasons: (1) Sloped roofs shed rain and snow by gravity — water flows down the slope. Flat roofs pool water, causing leaks and structural load. (2) Triangular roof trusses are rigid structures — they resist deformation. A flat roof beam bends under load. (3) Sloped roofs create attic space for insulation and ventilation. In Assam, steep roofs are essential because annual rainfall exceeds 2,000 mm.',
      codeIntro: 'Compare the structural strength of different geometric shapes and roof profiles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# --- 1: Structural rigidity comparison ---
ax = axes[0, 0]
ax.set_facecolor('#111827')

# Triangle (rigid)
tri = plt.Polygon([(1, 0), (2, 1.5), (3, 0)], fill=False, edgecolor='#22c55e', linewidth=3)
ax.add_patch(tri)
ax.text(2, -0.3, 'Triangle: RIGID', color='#22c55e', ha='center', fontsize=10, fontweight='bold')

# Square (deformable)
sq = plt.Polygon([(4.5, 0), (5.5, 0), (5.5, 1.5), (4.5, 1.5)], fill=False, edgecolor='#ef4444', linewidth=3)
ax.add_patch(sq)
# Deformed version
sq2 = plt.Polygon([(4.7, 0), (5.7, 0), (5.5, 1.5), (4.3, 1.5)], fill=False,
                   edgecolor='#ef4444', linewidth=2, linestyle='--')
ax.add_patch(sq2)
ax.text(5, -0.3, 'Square: DEFORMS', color='#ef4444', ha='center', fontsize=10, fontweight='bold')

ax.set_xlim(0, 7); ax.set_ylim(-0.6, 2)
ax.set_title('Structural Rigidity', color='white', fontsize=12)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- 2: Load distribution on different roof shapes ---
ax = axes[0, 1]
ax.set_facecolor('#111827')

x_roof = np.linspace(0, 10, 100)
roofs = {
    'Flat': np.ones_like(x_roof) * 3,
    'Triangular (Japi-like)': 3 + 2 * (1 - 2 * np.abs(x_roof - 5) / 10),
    'Curved (dome)': 3 + 2 * np.sqrt(np.maximum(0, 1 - ((x_roof - 5)/5)**2)),
}
colors_roof = ['#ef4444', '#22c55e', '#3b82f6']

for (name, profile), color in zip(roofs.items(), colors_roof):
    ax.plot(x_roof, profile, color=color, linewidth=2.5, label=name)
    ax.fill_between(x_roof, 0, profile, alpha=0.05, color=color)

# Rain arrows
for x in range(1, 10):
    ax.annotate('', xy=(x, 5.5), xytext=(x, 6.2),
                arrowprops=dict(arrowstyle='->', color='#06b6d4', lw=1))
ax.text(5, 6.4, 'Rain load', color='#06b6d4', ha='center', fontsize=9)

ax.set_xlabel('Width', color='white')
ax.set_ylabel('Height', color='white')
ax.set_title('Roof Profiles: Rain Shedding', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- 3: Water runoff angle vs slope ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
angles = np.linspace(0, 80, 100)  # roof angle in degrees
# Runoff speed proportional to sin(angle)
runoff_speed = np.sin(np.radians(angles))
# Structural load proportional to cos(angle)
load_factor = np.cos(np.radians(angles))
# Material needed proportional to 1/cos(angle)
material = 1 / np.cos(np.radians(angles))

ax.plot(angles, runoff_speed, color='#06b6d4', linewidth=2.5, label='Rain runoff speed')
ax.plot(angles, load_factor, color='#ef4444', linewidth=2.5, label='Gravity load on slope')
ax.plot(angles, material / material.max(), color='#f59e0b', linewidth=2.5, label='Material needed (normalized)')

# Mark Japi angle
japi_angle = 63.4
ax.axvline(japi_angle, color='#a855f7', linewidth=2, linestyle='--')
ax.text(japi_angle + 1, 0.5, f'Japi angle\
{japi_angle}°', color='#a855f7', fontsize=9)

ax.set_xlabel('Roof slope angle (°)', color='white')
ax.set_ylabel('Relative value', color='white')
ax.set_title('Optimizing Roof Angle', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- 4: Golden ratio in architecture ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
phi = (1 + np.sqrt(5)) / 2  # 1.618...

# Draw golden rectangles
x0, y0, w0 = 0, 0, 5
for i in range(6):
    h0 = w0 / phi
    colors_g = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4']
    ax.add_patch(plt.Rectangle((x0, y0), w0, h0, fill=False, edgecolor=colors_g[i % 6], linewidth=2))
    # Spiral arc
    theta_arc = np.linspace(np.pi/2 * i, np.pi/2 * (i+1), 30)
    r_arc = w0 * phi**(-2)  # approximate
    # Next rectangle
    if i % 4 == 0: x0 += w0 - h0; w0 = h0
    elif i % 4 == 1: y0 += h0 - w0/phi; h_new = w0; w0 = h0; h0 = h_new
    elif i % 4 == 2: w0 = h0
    else: w0 = h0

ax.set_xlim(-0.5, 6)
ax.set_ylim(-0.5, 4)
ax.set_aspect('equal')
ax.set_title(f'Golden Ratio (φ = {phi:.3f})', color='white', fontsize=12)
ax.text(2.5, -0.3, "Each rectangle's width/height ≈ φ", color='white', ha='center', fontsize=9)
ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Architecture = geometry + gravity:")
print(f"  Triangle: rigid (cannot deform)")
print(f"  Square: can collapse into parallelogram")
print(f"  Japi angle ({japi_angle}°): excellent rain shedding")
print(f"  Golden ratio (φ = {phi:.4f}): found in Parthenon, Taj Mahal")
print()
print("From the Japi to skyscrapers, every structure is a geometry problem.")`,
      challenge: 'Design a simple house shape using basic geometric primitives: a rectangle for walls (width × height) and a triangle for the roof. Calculate the total material needed (perimeter of walls + roof surface). What roof angle minimizes total material while keeping runoff speed above 0.7?',
      successHint: 'Geometry is the language of architecture and engineering. The Japi teaches us that traditional artisans solved complex geometric optimization problems — finding the right angle, the right shape, the right pattern — centuries before these problems were formalized in mathematics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior geometry experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geometry visualizations. Click to start.</p>
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
