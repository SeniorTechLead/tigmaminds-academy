import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LotusFloatLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Archimedes\' principle — why things float (or sink)',
      concept: `**Archimedes' principle**: Any object submerged in a fluid experiences an upward buoyant force equal to the weight of the fluid it displaces.

**F_buoyant = rho_fluid * g * V_displaced**

Where:
- rho_fluid = density of the fluid (water = 1,000 kg/m^3)
- g = gravitational acceleration (9.8 m/s^2)
- V_displaced = volume of fluid pushed aside by the object

An object floats when its buoyant force equals its weight. This happens when the object's **average density** is less than the fluid's density.

- Steel (7,800 kg/m^3) sinks in water — too dense
- Wood (500-700 kg/m^3) floats — less dense than water
- A steel ship floats because its overall volume (including air inside) makes its average density less than water

**Plants use the same trick.** A lotus leaf is denser than water if you compressed it into a solid lump. But it's full of air spaces (aerenchyma), making its average density about 200-300 kg/m^3 — well below water's 1,000.

Archimedes allegedly discovered this while taking a bath, noticing the water level rise as he got in. He reportedly ran through the streets naked shouting "Eureka!" ("I found it!").`,
      analogy: 'Buoyancy is like a crowded elevator. When you step in (submerge), you push people aside (displace fluid). The crowd pushes back (buoyant force). If you\'re lighter than the people you displaced, they push you up (you float). If you\'re heavier, you sink to the bottom. The lotus is like a person wearing a huge inflatable suit — it takes up lots of space but doesn\'t weigh much, so the crowd easily holds it up.',
      storyConnection: 'In "How the Lotus Learned to Float," the lotus discovers that the secret to living on water isn\'t fighting it — it\'s being lighter than the water it pushes aside. The story captures the elegance of Archimedes\' principle: the lotus doesn\'t float by effort. It floats by design — air-filled tissues that make it naturally buoyant.',
      checkQuestion: 'A solid block of lotus stem has a density of 800 kg/m^3. But actual lotus stems have 60% air spaces. What is the effective density? Will it float?',
      checkAnswer: 'Effective density = solid density * (1 - air fraction) = 800 * (1 - 0.6) = 800 * 0.4 = 320 kg/m^3. Since 320 < 1,000 (water density), yes, it floats easily. In fact, it only needs to be 32% submerged to float (320/1000 = 0.32). This is why lotus stems stick up out of the water rather than floating at the surface.',
      codeIntro: 'Simulate buoyancy for objects of different densities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Archimedes' principle: buoyancy simulation
water_density = 1000  # kg/m^3

# Objects with different densities
objects = {
    'Steel ball': {'density': 7800, 'radius': 0.05},
    'Wooden block': {'density': 600, 'radius': 0.05},
    'Lotus stem': {'density': 320, 'radius': 0.05},
    'Ice cube': {'density': 917, 'radius': 0.05},
    'Air bubble': {'density': 1.2, 'radius': 0.05},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')

# Left: fraction submerged vs density
ax1.set_facecolor('#111827')
densities = np.linspace(1, 2000, 500)
fraction_submerged = np.minimum(densities / water_density, 1.0)

ax1.plot(densities, fraction_submerged * 100, color='#3b82f6', linewidth=2)
ax1.fill_between(densities, fraction_submerged * 100, alpha=0.1, color='#3b82f6')
ax1.axhline(100, color='#ef4444', linestyle='--', linewidth=1, label='Fully submerged (sinks)')
ax1.axvline(water_density, color='#f59e0b', linestyle=':', linewidth=1, label=f'Water density ({water_density} kg/m3)')

colors_obj = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for (name, props), color in zip(objects.items(), colors_obj):
    d = props['density']
    frac = min(d / water_density, 1.0) * 100
    ax1.plot(d, frac, 'o', color=color, markersize=10)
    ax1.annotate(f'{name}\
({d} kg/m3)', xy=(d, frac),
                 xytext=(10, -10), textcoords='offset points',
                 color=color, fontsize=8)

ax1.set_xlabel('Object density (kg/m3)', color='white')
ax1.set_ylabel('Fraction submerged (%)', color='white')
ax1.set_title('Archimedes: Density Determines Floating', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Right: how air spaces reduce density
ax2.set_facecolor('#111827')
air_fraction = np.linspace(0, 0.9, 100)
solid_density = 800  # plant tissue without air
effective_density = solid_density * (1 - air_fraction)

ax2.plot(air_fraction * 100, effective_density, color='#22c55e', linewidth=2)
ax2.fill_between(air_fraction * 100, effective_density, water_density,
                 where=effective_density < water_density, alpha=0.15, color='#22c55e',
                 label='Floats')
ax2.fill_between(air_fraction * 100, effective_density, water_density,
                 where=effective_density >= water_density, alpha=0.15, color='#ef4444',
                 label='Sinks')
ax2.axhline(water_density, color='#f59e0b', linestyle='--', linewidth=1, label='Water density')

# Mark real plants
plants = [('Lotus stem', 60), ('Water lily', 45), ('Reed', 30), ('Land plant', 10)]
for name, air_pct in plants:
    eff_d = solid_density * (1 - air_pct/100)
    ax2.plot(air_pct, eff_d, 'o', color='white', markersize=8)
    ax2.annotate(name, xy=(air_pct, eff_d), xytext=(5, 10),
                 textcoords='offset points', color='white', fontsize=9)

ax2.set_xlabel('Air space in tissue (%)', color='white')
ax2.set_ylabel('Effective density (kg/m3)', color='white')
ax2.set_title('How Air Spaces Make Plants Float', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Calculate the critical air fraction for floating
critical_air = 1 - water_density / solid_density
print(f"Plant tissue density (solid): {solid_density} kg/m3")
print(f"Water density: {water_density} kg/m3")
print(f"Minimum air fraction to float: {critical_air*100:.0f}%")
print()
print("Real aquatic plants:")
for name, air_pct in plants:
    eff = solid_density * (1 - air_pct/100)
    status = "FLOATS" if eff < water_density else "SINKS"
    print(f"  {name}: {air_pct}% air, density = {eff:.0f} kg/m3 — {status}")`,
      challenge: 'A cargo ship has a steel hull (density 7,800 kg/m^3) but an average density of only 250 kg/m^3 because it\'s mostly air inside. Calculate how much cargo (density 1,500 kg/m^3) you can add before the average density exceeds 1,000 and the ship sinks.',
      successHint: 'Archimedes\' principle explains everything from why boats float to why helium balloons rise to why lotus leaves sit on the water surface. It\'s one of the oldest and most universally applicable physics principles.',
    },
    {
      title: 'Aerenchyma — the air spaces that let plants breathe underwater',
      concept: `**Aerenchyma** is specialized plant tissue containing large air spaces. It serves two critical functions for aquatic plants:

1. **Buoyancy**: Air spaces reduce the plant's overall density, helping it float (as we calculated in the previous lesson)

2. **Gas transport**: Oxygen produced by photosynthesis in the leaves travels through aerenchyma channels down to the roots, which are stuck in oxygen-poor mud. Similarly, CO2 from root respiration travels up to the leaves.

Types of aerenchyma:
- **Schizogenous**: Air spaces form by cells pulling apart (splitting)
- **Lysigenous**: Air spaces form by programmed cell death (cells die and dissolve, leaving gaps)

The lotus has extensive aerenchyma in its leaves, stems (petioles), and rhizomes (underground stems). A cross-section of a lotus petiole looks like Swiss cheese — up to 60% air by volume.

This is why you can blow through a lotus stem like a straw. Ancient cultures used lotus stems as natural snorkels. The air channels run continuously from leaf to root, creating an internal atmosphere connected to the outside air.`,
      analogy: 'Aerenchyma is like the ventilation system of a building. In a skyscraper, you can\'t just open a window on the 50th floor and expect fresh air in the basement. You need ducts — continuous channels that carry air from top to bottom. Aerenchyma is the plant\'s duct system, carrying oxygen from sunny leaves at the surface down to dark roots in the mud. Without it, the roots would suffocate.',
      storyConnection: 'In our story, the lotus "learned to float" — but it also learned to breathe. The air spaces that provide buoyancy also serve as breathing tubes for roots trapped in mud. This dual function is typical of evolutionary elegance: one structure, two essential jobs. The lotus didn\'t just learn to float; it learned to survive.',
      checkQuestion: 'If the roots of a lotus are in mud with zero oxygen, and the leaves are above water producing oxygen, how fast can oxygen travel through the aerenchyma? Is diffusion fast enough?',
      checkAnswer: 'Diffusion alone is too slow — at typical aerenchyma distances (1-2 meters from leaf to root), it would take hours for oxygen to reach the roots. Instead, many aquatic plants use pressurized ventilation: warm leaves heat the internal air, which expands and flows downward through the aerenchyma, pushing stale air out through older leaves. This creates a continuous flow — like a ventilation system with a thermal chimney.',
      codeIntro: 'Model oxygen transport through aerenchyma by diffusion and convective flow.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Oxygen transport through aerenchyma: diffusion vs convective flow

# Parameters
stem_length = 1.5  # meters (leaf to root)
D_oxygen = 2.0e-5  # diffusion coefficient of O2 in air (m^2/s)

# Diffusion: time to reach concentration C at distance x
# From Fick's law: t ~ x^2 / (2D)
distances = np.linspace(0.01, stem_length, 100)
diffusion_time = distances**2 / (2 * D_oxygen)  # seconds

# Convective flow: air moves at ~1 cm/s in pressurized ventilation
flow_velocity = 0.01  # m/s
convection_time = distances / flow_velocity  # seconds

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Time comparison
ax1.set_facecolor('#111827')
ax1.semilogy(distances * 100, diffusion_time / 60, color='#ef4444', linewidth=2, label='Diffusion only')
ax1.semilogy(distances * 100, convection_time / 60, color='#22c55e', linewidth=2, label='Convective flow')
ax1.set_xlabel('Distance from leaf (cm)', color='white')
ax1.set_ylabel('Time to deliver O2 (minutes, log scale)', color='white')
ax1.set_title('Oxygen Transport: Diffusion vs Convection', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Mark typical root distance
root_d = 120  # cm
ax1.axvline(root_d, color='#f59e0b', linestyle=':', linewidth=1)
diff_at_root = (root_d/100)**2 / (2 * D_oxygen) / 60
conv_at_root = (root_d/100) / flow_velocity / 60
ax1.annotate(f'Root distance\
Diffusion: {diff_at_root:.0f} min\
Convection: {conv_at_root:.0f} min',
             xy=(root_d, conv_at_root), xytext=(root_d - 40, conv_at_root * 100),
             color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Cross-section visualization: oxygen concentration profile
ax2.set_facecolor('#111827')
# Steady-state O2 concentration with convective flow
x = np.linspace(0, stem_length, 200)
# O2 decreases along stem due to consumption by stem cells
consumption_rate = 0.1  # fraction per 10cm
o2_diffusion = 21 * np.exp(-5 * x)  # rapid drop
o2_convection = 21 * np.exp(-0.5 * x)  # gradual drop

ax2.plot(x * 100, o2_diffusion, color='#ef4444', linewidth=2, label='Diffusion only')
ax2.plot(x * 100, o2_convection, color='#22c55e', linewidth=2, label='With convective flow')
ax2.axhline(5, color='#f59e0b', linestyle='--', linewidth=1, label='Minimum for root survival')
ax2.fill_between(x * 100, o2_diffusion, 5, where=o2_diffusion < 5, alpha=0.15, color='#ef4444')
ax2.set_xlabel('Distance from leaf (cm)', color='white')
ax2.set_ylabel('Oxygen concentration (%)', color='white')
ax2.set_title('O2 Concentration Along Stem', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Oxygen delivery to roots ({stem_length*100:.0f}cm away):")
print(f"  By diffusion only: {diff_at_root:.0f} minutes")
print(f"  By convective flow: {conv_at_root:.0f} minutes")
print(f"  Speedup: {diff_at_root/conv_at_root:.0f}x faster")
print()
print("Without convective flow, roots would get almost no oxygen.")
print("The pressurized ventilation system is essential for survival.")
print("Lotus stems are hollow tubes — natural ventilation ducts.")`,
      challenge: 'What if the stem were 3 meters long instead of 1.5 meters? How does that change the diffusion time? (Hint: it scales as distance SQUARED.) This explains why giant lotus species need especially efficient ventilation.',
      successHint: 'Aerenchyma solves two problems at once: buoyancy (physics) and gas transport (biology). This dual-purpose design is a hallmark of evolutionary engineering — one structure, multiple functions, minimal material.',
    },
    {
      title: 'Surface tension — the invisible skin of water',
      concept: `**Surface tension** is the property that makes water behave as if it has an elastic skin on its surface. It's caused by the difference in forces experienced by molecules at the surface vs. inside the liquid.

Inside water: a molecule is pulled equally in all directions by neighboring molecules (net force = zero).
At the surface: a molecule is pulled inward and sideways but NOT outward (there's air above, not water). This creates a net inward force that makes the surface contract — like a stretched elastic membrane.

Surface tension (gamma) for water: **0.0728 N/m** at 20C

Effects of surface tension:
- Water drops are spherical (minimum surface area)
- Small insects (water striders) walk on water
- A needle can float on water if placed gently
- Meniscus forms in glass tubes (water climbs the walls)

For plants:
- Small leaves and seeds interact strongly with surface tension
- Lotus seeds float due to both buoyancy AND surface tension
- Water droplets bead up on waxy surfaces (the lotus effect)
- Surface tension helps pull water up through narrow tubes (capillary action)

Surface tension scales with the perimeter of the object, while weight scales with volume. This is why small things (insects, seeds) can float on surface tension, but large things (humans) cannot.`,
      analogy: 'Surface tension is like a trampoline. The surface of water is stretched tight, and small, light objects can sit on top without breaking through — just like a coin on a trampoline. But jump on the trampoline (add enough weight), and you break through the surface. A water strider is a coin; a human is a jumper.',
      storyConnection: 'In our story, the lotus "learned to float" — and part of that learning is surface tension. Young lotus leaves, small and light, float partly by surface tension. As the plant grows, buoyancy takes over. But the lotus also uses surface tension offensively: the waxy leaf surface has such low adhesion that water drops roll off, taking dirt with them. The lotus doesn\'t just float ON water; it repels water FROM itself.',
      checkQuestion: 'A water strider weighs about 0.01 grams and has legs that are 1 cm long each (6 legs). Can surface tension support it? (Surface tension of water = 0.0728 N/m)',
      checkAnswer: 'Total leg perimeter in contact with water: 6 legs * 2 * 0.01 m (each leg contacts water along both sides) = 0.12 m. Maximum upward force from surface tension: gamma * perimeter = 0.0728 * 0.12 = 0.00874 N. Weight of strider: 0.00001 kg * 9.8 = 0.000098 N. Ratio: 0.00874 / 0.000098 = 89x. Surface tension can support 89 times the strider\'s weight! This is why they can walk so effortlessly — they\'re barely using 1% of the available force.',
      codeIntro: 'Visualize surface tension forces and the maximum weight that can float on water.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Surface tension: maximum floating weight vs object perimeter
gamma = 0.0728  # N/m for water at 20°C
g = 9.8

# For a circular object of radius r:
# Perimeter = 2 * pi * r
# Maximum floating weight = gamma * perimeter = gamma * 2 * pi * r
# Maximum floating mass = gamma * 2 * pi * r / g

radii = np.linspace(0.0001, 0.05, 500)  # 0.1mm to 50mm
max_mass = gamma * 2 * np.pi * radii / g * 1000  # in grams

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Max floating mass vs radius
ax1.set_facecolor('#111827')
ax1.plot(radii * 1000, max_mass, color='#3b82f6', linewidth=2)
ax1.fill_between(radii * 1000, max_mass, alpha=0.1, color='#3b82f6')

# Mark real objects
objects = [
    ('Water strider leg', 0.1, 0.001, '#22c55e'),
    ('Mosquito', 0.5, 0.002, '#f59e0b'),
    ('Lotus seed', 5, 0.2, '#a855f7'),
    ('Needle', 1, 0.5, '#ef4444'),
    ('Coin', 10, 2.5, '#ef4444'),
]
for name, r_mm, mass_g, color in objects:
    max_m = gamma * 2 * np.pi * (r_mm/1000) / g * 1000
    can_float = "floats" if mass_g < max_m else "sinks"
    ax1.plot(r_mm, mass_g, 'o', color=color, markersize=8)
    ax1.annotate(f'{name}\
({can_float})', xy=(r_mm, mass_g),
                 xytext=(5, 5), textcoords='offset points', color=color, fontsize=8)

ax1.set_xlabel('Object radius (mm)', color='white')
ax1.set_ylabel('Mass (grams)', color='white')
ax1.set_title('Surface Tension: Max Floating Mass', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Water drop shape on different surfaces
ax2.set_facecolor('#111827')
theta = np.linspace(0, np.pi, 100)

# Different contact angles
angles = [(20, 'Glass (hydrophilic)', '#3b82f6'),
          (70, 'Normal surface', '#f59e0b'),
          (120, 'Waxy surface', '#a855f7'),
          (160, 'Lotus leaf', '#22c55e')]

for contact_angle, label, color in angles:
    # Simplified drop profile for visualization
    ca_rad = np.radians(contact_angle)
    if contact_angle < 90:
        height = 0.5 * (1 - np.cos(ca_rad))
        drop_x = np.linspace(-np.sin(ca_rad), np.sin(ca_rad), 100)
        drop_y = height * np.sqrt(np.maximum(0, 1 - (drop_x / np.sin(ca_rad))**2))
    else:
        r = 1.0
        center_y = r * np.cos(np.pi - ca_rad)
        t = np.linspace(np.pi - ca_rad, ca_rad, 100)
        drop_x = r * np.sin(t)
        drop_y = r * np.cos(t) - center_y

    offset_y = len([a for a in angles if a[0] <= contact_angle]) * 0.1
    ax2.fill(drop_x, drop_y + offset_y * 3, alpha=0.3, color=color)
    ax2.plot(drop_x, drop_y + offset_y * 3, color=color, linewidth=2, label=f'{label} ({contact_angle}deg)')

ax2.axhline(0, color='gray', linewidth=0.5)
ax2.set_xlabel('Width (relative)', color='white')
ax2.set_ylabel('Height (relative)', color='white')
ax2.set_title('Water Drop Shape vs Surface Type', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_ylim(-0.2, 2.0)

plt.tight_layout()
plt.show()

print("Surface tension supports small objects:")
print(f"  Water strider: uses ~1% of available support force")
print(f"  Needle: can float if placed VERY carefully")
print(f"  Coin: too heavy (sinks)")
print()
print("Contact angles determine how water interacts with surfaces:")
print(f"  < 90°: hydrophilic (water spreads)")
print(f"  > 90°: hydrophobic (water beads up)")
print(f"  > 150°: superhydrophobic (lotus effect)")`,
      challenge: 'Add dish soap to the simulation — soap reduces surface tension from 0.0728 to ~0.03 N/m. How does this affect the maximum floating weight? This is why soap sinks water striders.',
      successHint: 'Surface tension operates at the boundary between air and water — a thin, powerful skin that supports insects, shapes raindrops, and drives capillary action. Understanding it unlocks both biology and engineering.',
    },
    {
      title: 'The lotus effect — nature\'s self-cleaning surface',
      concept: `The **lotus effect** (discovered by botanists Wilhelm Barthlott and Christoph Neinhuis in 1997) is the self-cleaning property of lotus leaves. Water drops roll off the leaf surface, picking up dirt particles along the way, leaving the leaf clean.

The mechanism has two levels:

**Microscale**: The leaf surface is covered with tiny bumps called **papillae** (5-15 micrometers tall, spaced 10-15 micrometers apart). These are like tiny mountains on the leaf.

**Nanoscale**: Each papilla is covered with even tinier waxy tubules (~100 nanometers). These create a second level of roughness.

**Why it works**: Water drops sit on the tips of the papillae, touching only about 2-3% of the actual surface. Air is trapped in the valleys between papillae. The drop is essentially sitting on a cushion of air with tiny wax points holding it up.

Because so little surface is in contact:
- The drop has very low adhesion (nothing to stick to)
- It rolls freely under gravity or wind
- As it rolls, it touches dirt particles and picks them up (the dirt sticks to the water better than to the waxy surface)

Contact angle: **~160 degrees** (superhydrophobic). For comparison, glass is ~20 degrees.`,
      analogy: 'Imagine walking across a room full of upturned thumbtacks — you\'d be on your tiptoes, touching very little floor, and you\'d move off quickly. A water drop on a lotus leaf is the same: the tiny waxy points are like thumbtacks, and the drop "tiptoes" across, barely touching anything. Since it barely touches the surface, it can\'t stick, so it rolls away — and any dirt it encounters sticks to the water instead.',
      storyConnection: 'The lotus in our story stays clean despite growing in muddy ponds. "How the Lotus Learned to Float" could equally be titled "How the Lotus Learned to Stay Clean." This self-cleaning ability is why the lotus symbolizes purity in Asian cultures — it emerges from mud unblemished. The biology behind the symbolism is a marvel of nanotechnology.',
      checkQuestion: 'If the lotus leaf only contacts the water drop at 2-3% of the surface, where is the other 97-98%?',
      checkAnswer: 'Air. The drop is sitting on a composite surface of 2-3% wax points and 97-98% trapped air pockets. This is called a Cassie-Baxter state (vs. Wenzel state where liquid fills the valleys). The air acts as a lubricant — the drop slides on air, not on a solid surface. This is similar to an air hockey puck floating on jets of air.',
      codeIntro: 'Model the lotus effect: contact angle, adhesion, and self-cleaning efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lotus effect simulation

# Contact angle vs surface roughness and chemistry
# Cassie-Baxter equation: cos(theta*) = f * cos(theta) + f - 1
# where f = fraction of surface in contact, theta = flat surface angle

f_range = np.linspace(0.01, 1.0, 200)  # fraction of surface in contact
theta_flat = np.radians(110)  # wax on flat surface ~ 110 degrees

cos_theta_star = f_range * np.cos(theta_flat) + f_range - 1
theta_star = np.degrees(np.arccos(np.clip(cos_theta_star, -1, 1)))

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Contact angle vs surface fraction
ax1.set_facecolor('#111827')
ax1.plot(f_range * 100, theta_star, color='#3b82f6', linewidth=2)
ax1.axhline(150, color='#22c55e', linestyle='--', linewidth=1, label='Superhydrophobic (>150deg)')
ax1.axhline(90, color='#f59e0b', linestyle='--', linewidth=1, label='Hydrophobic boundary (90deg)')
ax1.plot(3, 160, 'o', color='#22c55e', markersize=12, label='Lotus leaf (~3%, ~160deg)')
ax1.plot(100, 110, 'o', color='#ef4444', markersize=12, label='Flat wax (100%, 110deg)')
ax1.set_xlabel('Surface contact fraction (%)', color='white')
ax1.set_ylabel('Apparent contact angle (degrees)', color='white')
ax1.set_title('Cassie-Baxter: Roughness Enhances Hydrophobicity', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Adhesion force vs contact fraction
ax2.set_facecolor('#111827')
# Adhesion proportional to contact area
adhesion = f_range * 100  # relative units
ax2.plot(f_range * 100, adhesion, color='#ef4444', linewidth=2)
ax2.fill_between(f_range * 100, adhesion, alpha=0.1, color='#ef4444')
ax2.plot(3, 3, 'o', color='#22c55e', markersize=12, label='Lotus leaf')
ax2.plot(100, 100, 'o', color='#ef4444', markersize=12, label='Flat surface')
ax2.set_xlabel('Surface contact fraction (%)', color='white')
ax2.set_ylabel('Relative adhesion force', color='white')
ax2.set_title('Less Contact = Less Sticking', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Self-cleaning efficiency
ax3.set_facecolor('#111827')
# Model: dirt particles removed per rolling drop
tilt_angles = np.arange(1, 46)  # degrees of tilt
# Lotus: low adhesion -> drops roll at low angles
# Glass: high adhesion -> drops need steep angle
lotus_cleaning = 100 * (1 - np.exp(-tilt_angles / 2))
glass_cleaning = 100 * (1 - np.exp(-tilt_angles / 20))
normal_cleaning = 100 * (1 - np.exp(-tilt_angles / 8))

ax3.plot(tilt_angles, lotus_cleaning, color='#22c55e', linewidth=2, label='Lotus leaf')
ax3.plot(tilt_angles, normal_cleaning, color='#f59e0b', linewidth=2, label='Normal leaf')
ax3.plot(tilt_angles, glass_cleaning, color='#ef4444', linewidth=2, label='Glass')
ax3.set_xlabel('Surface tilt angle (degrees)', color='white')
ax3.set_ylabel('Dirt removed (%)', color='white')
ax3.set_title('Self-Cleaning Efficiency', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Applications
ax4.set_facecolor('#111827')
applications = ['Lotus\
leaf', 'Self-clean\
paint', 'Anti-fog\
glass', 'Stain-free\
fabric', 'Solar\
panel']
contact_angles = [160, 155, 150, 145, 140]
effectiveness = [98, 90, 85, 80, 88]
colors_app = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444']

bars = ax4.bar(applications, effectiveness, color=colors_app, width=0.6)
ax4.set_ylabel('Self-cleaning effectiveness (%)', color='white')
ax4.set_title('Lotus Effect Applications', color='white', fontsize=12)
ax4.tick_params(colors='gray')
for bar, ca, eff in zip(bars, contact_angles, effectiveness):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{eff}%\
({ca}deg)', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("The lotus effect: key numbers")
print(f"  Contact area: ~3% of surface")
print(f"  Contact angle: ~160 degrees")
print(f"  Roll-off angle: ~2 degrees (nearly flat!)")
print(f"  Self-cleaning efficiency: ~98%")
print()
print("Biomimicry applications:")
print("  - Lotusan paint: self-cleaning building facades")
print("  - NeverWet spray: superhydrophobic coating")
print("  - Solar panels: self-cleaning to maintain efficiency")
print("  - Medical implants: anti-bacterial surfaces")`,
      challenge: 'What happens to the lotus effect when the leaf is submerged? (Hint: the air pockets can\'t survive underwater pressure.) At what depth does the superhydrophobicity fail? This is called the Cassie-to-Wenzel transition.',
      successHint: 'The lotus effect is a masterclass in how nanoscale structure creates macroscale function. From self-cleaning paint to anti-fog glass, the lotus leaf\'s secret is being applied across industries — all because a botanist looked closely at a leaf.',
    },
    {
      title: 'Aquatic plant adaptations — surviving in water',
      concept: `Aquatic plants face challenges that land plants don't:

1. **Gas exchange**: CO2 diffuses 10,000x slower in water than air. Solution: thin leaves maximize surface area, stomata on upper surface only, aerenchyma for internal gas transport.

2. **Light attenuation**: Water absorbs light rapidly — at 10m depth, only 20% of surface light remains. Solution: floating leaves, thin submerged leaves that catch scattered light.

3. **Mechanical support**: Water provides buoyancy, so thick stems are unnecessary. Solution: flexible stems that bend with currents, reduced structural tissue.

4. **Nutrient absorption**: Submerged plants can absorb nutrients directly through leaves (land plants use roots only). Solution: thin leaves with large surface area.

5. **Reproduction**: Pollination is harder in/on water. Solutions: emergent flowers (lotus, lily), water pollination (seagrass), self-pollination.

**Leaf types in a single plant** (heterophylly): Many aquatic plants produce different leaf shapes depending on whether they're submerged or floating:
- Submerged leaves: thin, ribbon-like, no waxy coating
- Floating leaves: broad, waxy, stomata on top
- Emergent leaves: similar to land plants

The lotus has all three types at different growth stages.`,
      analogy: 'Aquatic plant adaptations are like designing a car for underwater driving. You\'d need to: (1) seal the engine but provide air somehow (gas exchange), (2) switch to headlights because sunlight is limited (light capture), (3) reduce the heavy frame because water holds you up (support), (4) add a way to refuel from the water itself (nutrient absorption), and (5) figure out how to refuel other cars without gas stations (reproduction). Aquatic plants solved all five.',
      storyConnection: 'The lotus in our story "learned to float" — but floating is just the beginning. It also learned to breathe through aerenchyma, clean itself through the lotus effect, capture light through floating leaves, and reproduce through emergent flowers. Each adaptation is a chapter in the lotus\'s survival manual, written over 130 million years of evolution.',
      checkQuestion: 'CO2 diffuses 10,000x slower in water than in air. How do submerged aquatic plants get enough CO2 for photosynthesis?',
      checkAnswer: 'Multiple strategies: (1) Very thin leaves with large surface area (more absorption surface per gram). (2) Bicarbonate use — many aquatic plants can use dissolved HCO3- (bicarbonate) as a carbon source, not just CO2. (3) Carbon-concentrating mechanisms (like C4 photosynthesis on land). (4) Growing near the surface where CO2 diffuses in from air. (5) Using CO2 from their own respiration (internal recycling).',
      codeIntro: 'Compare the adaptations of different aquatic plants.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Aquatic plant adaptation comparison
plants = ['Lotus', 'Water lily', 'Duckweed', 'Seagrass', 'Water hyacinth', 'Mangrove']

# Adaptation scores (0-10)
categories = ['Buoyancy', 'Gas\
exchange', 'Light\
capture', 'Nutrient\
uptake', 'Mechanical\
flexibility', 'Reproduction']
N = len(categories)

data = {
    'Lotus':           [8, 9, 8, 6, 5, 8],
    'Water lily':      [9, 7, 9, 5, 7, 7],
    'Duckweed':        [10, 8, 7, 9, 10, 9],
    'Seagrass':        [3, 5, 4, 8, 9, 6],
    'Water hyacinth':  [9, 8, 8, 9, 8, 10],
    'Mangrove':        [2, 6, 7, 7, 3, 5],
}

colors_p = {'Lotus': '#ec4899', 'Water lily': '#22c55e', 'Duckweed': '#f59e0b',
            'Seagrass': '#3b82f6', 'Water hyacinth': '#a855f7', 'Mangrove': '#ef4444'}

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Radar chart
ax1 = fig.add_subplot(121, polar=True)
ax1.set_facecolor('#111827')
for name, values in data.items():
    vals = values + values[:1]
    ax1.plot(angles, vals, 'o-', linewidth=2, label=name, color=colors_p[name])
    ax1.fill(angles, vals, alpha=0.05, color=colors_p[name])

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(categories, color='white', fontsize=9)
ax1.set_ylim(0, 10)
ax1.set_yticks([2, 4, 6, 8, 10])
ax1.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax1.legend(loc='upper right', bbox_to_anchor=(1.35, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=8)
ax1.set_title('Aquatic Plant Adaptations', color='white', fontsize=13, pad=20)

# Light attenuation with depth
ax2 = fig.add_subplot(122)
ax2.set_facecolor('#111827')
depth = np.linspace(0, 20, 200)  # meters
# Beer-Lambert law: I = I0 * exp(-k*d)
k_clear = 0.1   # clear water
k_murky = 0.5   # murky pond
k_turbid = 1.0  # very turbid

light_clear = 100 * np.exp(-k_clear * depth)
light_murky = 100 * np.exp(-k_murky * depth)
light_turbid = 100 * np.exp(-k_turbid * depth)

ax2.plot(light_clear, -depth, color='#3b82f6', linewidth=2, label='Clear lake')
ax2.plot(light_murky, -depth, color='#f59e0b', linewidth=2, label='Murky pond')
ax2.plot(light_turbid, -depth, color='#ef4444', linewidth=2, label='Turbid river')
ax2.axhline(-1, color='#22c55e', linestyle=':', linewidth=1)
ax2.text(50, -0.7, 'Lotus leaf floating zone', color='#22c55e', fontsize=9)
ax2.axvline(1, color='gray', linestyle=':', linewidth=1)
ax2.text(2, -18, 'Min for\
photosynthesis', color='gray', fontsize=8)

ax2.set_xlabel('Light intensity (% of surface)', color='white')
ax2.set_ylabel('Depth (m)', color='white')
ax2.set_title('Light Attenuation in Water', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Aquatic plant strategies by depth:")
print("  Surface (0-0.5m): Floating leaves (lotus, lily, duckweed)")
print("  Shallow (0.5-3m): Emergent plants (reeds, lotus stems)")
print("  Mid-depth (3-10m): Submerged with thin leaves (seagrass)")
print("  Deep (>10m): Very few plants (light too low)")
print()
print("The lotus strategy: float leaves at surface for max light,")
print("send roots to nutrient-rich mud, connect with aerenchyma.")
print("It's the best of both worlds — surface light + bottom nutrients.")`,
      challenge: 'Water hyacinth is one of the world\'s most invasive species. Looking at its adaptation scores, why is it so successful? Which adaptations give it an unfair advantage? What makes it hard to control?',
      successHint: 'Aquatic plants show that adaptation is about solving a specific set of environmental challenges. Each species represents a different solution to the same set of problems — buoyancy, gas exchange, light, nutrients, and reproduction.',
    },
    {
      title: 'Biomimicry from lotus — engineering inspired by nature',
      concept: `The lotus has inspired more engineered products than almost any other plant:

**1. Self-cleaning surfaces (Lotusan paint)**:
- Sto AG developed Lotusan, a building paint with micro-bumps mimicking lotus papillae
- Rain cleans the surface automatically, reducing maintenance costs by 50%
- Used on buildings throughout Europe since 1999

**2. Superhydrophobic textiles**:
- Nanostructured fabric coatings that repel water and stains
- NeverWet, Rust-Oleum NeverWet spray
- Military uniforms that resist chemical agents

**3. Anti-biofouling ship hulls**:
- Marine organisms (barnacles, algae) add drag to ship hulls, increasing fuel consumption by 40%
- Lotus-inspired hull coatings reduce biofouling without toxic anti-fouling paints (which poisoned marine life)

**4. Self-cleaning solar panels**:
- Dust on solar panels reduces efficiency by 15-25%
- Lotus-effect coatings keep panels clean, especially in deserts
- Saves water (no manual cleaning) and increases power output

**5. Medical implants**:
- Lotus-inspired surfaces resist bacterial attachment
- Reduces implant infection rates
- Used in catheters, prosthetics, and dental implants

The pattern: nature solved a problem -> scientists understood the mechanism -> engineers replicated the structure -> products improved. This pipeline is biomimicry in action.`,
      analogy: 'Biomimicry from the lotus is like reverse-engineering a competitor\'s product. Nature built a self-cleaning surface 130 million years ago. Scientists took it apart (microscopy, physics analysis). Engineers built their own version (synthetic micro-bumps, wax coatings). The "competitor" (nature) has a 130-million-year head start, but we\'re catching up.',
      storyConnection: 'The lotus in our story floats clean above muddy water. This image — purity emerging from mud — has inspired religions, art, and philosophy for millennia. Now it inspires engineering too. The story is the same: something beautiful and functional arising from understanding nature\'s design. Biomimicry is the scientific form of the story\'s message.',
      checkQuestion: 'Self-cleaning solar panels in the Sahara Desert could increase power output by 20-25%. If the Sahara has potential for 22,000 TWh of solar energy per year, how much additional energy does lotus-effect coating provide?',
      checkAnswer: '22,000 TWh * 0.225 (midpoint of 20-25%) = 4,950 TWh. Global electricity consumption is about 25,000 TWh per year. So lotus-effect solar panel coatings in the Sahara alone could provide about 20% of global electricity demand. A plant that evolved to stay clean in a muddy pond could help power civilization — that\'s biomimicry at scale.',
      codeIntro: 'Model the economic impact of lotus-effect coatings on solar panel efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Solar panel efficiency with lotus-effect self-cleaning coating

# Dust accumulation model
days = np.arange(0, 365)

# Without coating: dust accumulates, efficiency drops
dust_rate = 0.15 / 30  # 0.5% efficiency loss per day
eff_no_coat = 100 * np.exp(-dust_rate * (days % 30))  # cleaned monthly
# Manual cleaning every 30 days resets to 100%
for i in range(len(days)):
    day_in_cycle = days[i] % 30
    eff_no_coat[i] = 100 * np.exp(-dust_rate * day_in_cycle)

# With lotus coating: self-cleaning with rain (every ~7 days average)
eff_lotus = 100 * np.exp(-dust_rate * 0.3 * (days % 7))  # much less dust sticks
for i in range(len(days)):
    day_in_cycle = days[i] % 7
    eff_lotus[i] = 100 * np.exp(-dust_rate * 0.3 * day_in_cycle)

# With no cleaning at all
eff_no_clean = 100 * np.exp(-dust_rate * days)

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Efficiency over time
ax1.set_facecolor('#111827')
ax1.plot(days, eff_no_clean, color='#ef4444', linewidth=1.5, label='No cleaning', alpha=0.7)
ax1.plot(days, eff_no_coat, color='#f59e0b', linewidth=1.5, label='Monthly manual cleaning')
ax1.plot(days, eff_lotus, color='#22c55e', linewidth=1.5, label='Lotus-effect coating')
ax1.set_xlabel('Days', color='white')
ax1.set_ylabel('Panel efficiency (%)', color='white')
ax1.set_title('Solar Panel Efficiency Over One Year', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(50, 102)

# Annual energy output comparison
ax2.set_facecolor('#111827')
# Energy = sum of daily efficiency * base output
base_daily_kwh = 5  # kWh per panel per day at 100% efficiency
annual_no_clean = base_daily_kwh * np.sum(eff_no_clean / 100)
annual_manual = base_daily_kwh * np.sum(eff_no_coat / 100)
annual_lotus = base_daily_kwh * np.sum(eff_lotus / 100)
annual_max = base_daily_kwh * 365

labels = ['No cleaning', 'Monthly\
cleaning', 'Lotus\
coating', 'Theoretical\
max']
values = [annual_no_clean, annual_manual, annual_lotus, annual_max]
colors_bar = ['#ef4444', '#f59e0b', '#22c55e', '#6b7280']
bars = ax2.bar(labels, values, color=colors_bar, width=0.6)
ax2.set_ylabel('Annual energy (kWh/panel)', color='white')
ax2.set_title('Annual Energy Output per Panel', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for bar, v in zip(bars, values):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 10,
             f'{v:.0f}', ha='center', color='white', fontsize=10)

# Cost-benefit analysis
ax3.set_facecolor('#111827')
panel_cost = 300  # $ per panel
coating_cost = 20  # $ per panel for lotus coating
cleaning_cost = 5  # $ per cleaning per panel
n_cleanings = 12  # per year

years = np.arange(1, 21)
electricity_price = 0.10  # $/kWh

# Revenue difference: lotus vs manual cleaning
extra_energy = (annual_lotus - annual_manual)  # kWh/year
annual_savings = extra_energy * electricity_price + n_cleanings * cleaning_cost
cumulative_savings = years * annual_savings - coating_cost

ax3.plot(years, cumulative_savings, color='#22c55e', linewidth=2)
ax3.fill_between(years, cumulative_savings, 0, where=cumulative_savings > 0,
                 alpha=0.15, color='#22c55e')
ax3.axhline(0, color='gray', linewidth=0.5)
payback = coating_cost / annual_savings
ax3.axvline(payback, color='#f59e0b', linestyle=':', linewidth=1)
ax3.annotate(f'Payback: {payback:.1f} years', xy=(payback, 0),
             xytext=(payback + 2, 50), color='#f59e0b', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax3.set_xlabel('Years', color='white')
ax3.set_ylabel('Net savings ($)', color='white')
ax3.set_title('Lotus Coating: Cumulative Savings', color='white', fontsize=12)
ax3.tick_params(colors='gray')

# Scale to desert solar farm
ax4.set_facecolor('#111827')
farm_sizes = np.array([100, 1000, 10000, 100000])  # number of panels
farm_savings_20yr = farm_sizes * cumulative_savings[-1]
bars4 = ax4.bar(range(len(farm_sizes)), farm_savings_20yr / 1000,
                color=['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'], width=0.6)
ax4.set_xticks(range(len(farm_sizes)))
ax4.set_xticklabels([f'{s:,} panels' for s in farm_sizes], color='white', fontsize=9)
ax4.set_ylabel('20-year savings ($1000s)', color='white')
ax4.set_title('Savings at Scale (Solar Farms)', color='white', fontsize=12)
ax4.tick_params(colors='gray')
for bar, s in zip(bars4, farm_savings_20yr):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
             f'{s/1000:,.0f}k', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print(f"Annual energy per panel:")
print(f"  No cleaning: {annual_no_clean:.0f} kWh ({annual_no_clean/annual_max*100:.0f}% of max)")
print(f"  Monthly cleaning: {annual_manual:.0f} kWh ({annual_manual/annual_max*100:.0f}%)")
print(f"  Lotus coating: {annual_lotus:.0f} kWh ({annual_lotus/annual_max*100:.0f}%)")
print(f"\
Lotus coating payback period: {payback:.1f} years")
print(f"20-year savings per panel: {cumulative_savings[-1]:.0f}")
print(f"\
For a 100,000-panel desert farm:")
print(f"  20-year savings: {100000 * cumulative_savings[-1]:,.0f}")`,
      challenge: 'Add a "sandstorm" event that drops efficiency by 30% in a single day. How does the lotus coating handle sandstorms vs. regular dust? Does it still self-clean after a major dust event, or does it need manual intervention?',
      successHint: 'From Archimedes\' principle to aerenchyma to surface tension to the lotus effect to aquatic adaptations to biomimicry — you\'ve traced a complete scientific arc from fundamental physics to real-world engineering. Level 2 goes deeper into fluid mechanics and the mathematics of surfaces.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior physics or botany experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for physics and biology simulations. Click to start.</p>
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