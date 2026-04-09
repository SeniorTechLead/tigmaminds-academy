import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LotusFloatLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The Lotus effect — superhydrophobicity at the nanoscale',
      concept: `A lotus leaf stays perfectly clean even in muddy water. Water droplets bead up into near-perfect spheres and roll off, carrying dirt particles with them. This is the **Lotus effect** — one of the most celebrated examples of biomimicry.

The secret is a hierarchical surface structure operating at two scales:

1. **Micro-scale papillae** (10-20 micrometers): bumps on the leaf surface, like tiny hills
2. **Nano-scale wax crystals** (100-200 nanometers): hydrophobic wax tubules covering each papilla

This two-level roughness creates **superhydrophobicity** — a water contact angle greater than 150 degrees (a flat hydrophobic surface achieves only ~120 degrees).

**Contact angle** is the angle where a water droplet meets a surface:
- < 90 degrees: hydrophilic (water spreads — glass, clean metal)
- 90-120 degrees: hydrophobic (water beads — wax, Teflon)
- > 150 degrees: superhydrophobic (water barely touches — lotus leaf)

The physics: on a rough hydrophobic surface, air pockets get trapped under the droplet (Cassie-Baxter state). The droplet sits on a composite surface of solid and air. Since air is perfectly non-wetting, the effective contact angle increases dramatically.`,
      analogy: 'The lotus leaf is like a bed of nails. A balloon placed on a single nail pops (full contact). The same balloon placed on a bed of nails survives because it rests on the tips with air between them (partial contact). The lotus leaf surface is a "bed of nails" for water droplets — the droplet sits on the tips of the papillae with air trapped underneath, never making full contact with the surface.',
      storyConnection: 'The story asks "why does the lotus float?" — but the lotus also does something equally remarkable on its upper surface. The leaf repels water so effectively that rain drops bounce off like balls. This self-cleaning ability keeps the leaf free of algae, bacteria, and sediment even in the murkiest pond. The lotus floats clean because its surface is engineered at the nanoscale.',
      checkQuestion: 'A lotus leaf works perfectly in rain, but if you submerge it underwater for a long time and then pull it out, it may temporarily lose its superhydrophobicity. Why?',
      checkAnswer: 'Prolonged submersion forces water into the nano-grooves under high hydrostatic pressure, collapsing the air layer (transitioning from Cassie-Baxter to Wenzel state). Without the air pockets, the surface behaves as a regular rough surface with full liquid-solid contact. The superhydrophobicity recovers once the leaf dries and air re-fills the nano-structures. This is why the lotus effect works best with rain droplets (brief contact) rather than continuous submersion.',
      codeIntro: 'Model the relationship between surface roughness, contact angle, and the transition between Cassie-Baxter and Wenzel wetting states.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Contact angle models
# Young's equation: cos(theta_Y) = (gamma_SV - gamma_SL) / gamma_LV
# Wenzel model: cos(theta_W) = r * cos(theta_Y)  (r = roughness ratio >= 1)
# Cassie-Baxter: cos(theta_CB) = f * cos(theta_Y) + f - 1  (f = solid fraction)

theta_Y_deg = np.linspace(60, 130, 100)  # Young's angle in degrees
theta_Y = np.radians(theta_Y_deg)

# Wenzel model for different roughness values
r_values = [1.0, 1.5, 2.0, 3.0, 5.0]

# Cassie-Baxter model for different solid fractions
f_values = [1.0, 0.5, 0.3, 0.15, 0.05]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Wenzel model
ax = axes[0, 0]
ax.set_facecolor('#111827')
for r in r_values:
    cos_W = r * np.cos(theta_Y)
    cos_W = np.clip(cos_W, -1, 1)
    theta_W = np.degrees(np.arccos(cos_W))
    ax.plot(theta_Y_deg, theta_W, linewidth=2, label=f'r={r:.1f}')

ax.axhline(150, color='#ef4444', linestyle='--', alpha=0.5, label='Superhydrophobic (150°)')
ax.axhline(90, color='#f59e0b', linestyle='--', alpha=0.5, label='Hydrophobic threshold')
ax.plot(theta_Y_deg, theta_Y_deg, 'k--', alpha=0.3, label='Flat surface')
ax.set_xlabel("Young's angle (degrees)", color='white')
ax.set_ylabel('Apparent contact angle (degrees)', color='white')
ax.set_title('Wenzel model: roughness amplifies wetting', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Cassie-Baxter model
ax = axes[0, 1]
ax.set_facecolor('#111827')
for f in f_values:
    cos_CB = f * np.cos(theta_Y) + f - 1
    cos_CB = np.clip(cos_CB, -1, 1)
    theta_CB = np.degrees(np.arccos(cos_CB))
    ax.plot(theta_Y_deg, theta_CB, linewidth=2, label=f'f={f:.2f}')

ax.axhline(150, color='#ef4444', linestyle='--', alpha=0.5, label='Superhydrophobic')
ax.set_xlabel("Young's angle (degrees)", color='white')
ax.set_ylabel('Apparent contact angle (degrees)', color='white')
ax.set_title('Cassie-Baxter model: air trapping', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Surface comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
surfaces = {
    'Glass': 20,
    'Steel': 70,
    'Wax': 105,
    'Teflon': 115,
    'Rough wax': 130,
    'Lotus leaf': 162,
    'Artificial\\nsuperhydrophobic': 170,
}
names = list(surfaces.keys())
angles = list(surfaces.values())
colors = ['#3b82f6', '#60a5fa', '#22c55e', '#86efac', '#f59e0b', '#ef4444', '#a855f7']
bars = ax.barh(names, angles, color=colors, edgecolor='none')
ax.axvline(90, color='white', linestyle='--', alpha=0.3)
ax.axvline(150, color='#ef4444', linestyle='--', alpha=0.3)
ax.set_xlabel('Contact angle (degrees)', color='white')
ax.set_title('Contact angles across surfaces', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, angle in zip(bars, angles):
    ax.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
            f'{angle}°', va='center', color='white', fontsize=9)

# Droplet shape at different contact angles
ax = axes[1, 1]
ax.set_facecolor('#111827')
contact_angles_demo = [30, 90, 120, 160]
colors_demo = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

for i, (ca, col) in enumerate(zip(contact_angles_demo, colors_demo)):
    # Draw droplet cross-section
    cx = i * 2.5
    ca_rad = np.radians(ca)
    R = 0.8
    # Arc from surface
    theta_range = np.linspace(np.pi/2 - ca_rad + np.pi/2, np.pi/2 + ca_rad - np.pi/2, 100)
    if ca > 90:
        theta_range = np.linspace(-(ca_rad - np.pi/2), np.pi + (ca_rad - np.pi/2), 100)
    else:
        theta_range = np.linspace(0, np.pi, 100)

    x_drop = cx + R * np.cos(theta_range)
    y_drop = R * np.sin(theta_range) * (ca / 90)
    ax.fill(x_drop, y_drop, color=col, alpha=0.6)
    ax.plot([cx - R, cx + R], [0, 0], color='gray', linewidth=2)
    ax.text(cx, -0.3, f'{ca}°', ha='center', color='white', fontsize=10, fontweight='bold')

ax.set_xlim(-1, 10)
ax.set_ylim(-0.6, 2)
ax.set_title('Droplet shape vs contact angle', color='white', fontsize=11)
ax.set_aspect('equal')
ax.axis('off')

plt.tight_layout()
plt.show()

print("SUPERHYDROPHOBICITY ANALYSIS")
print(f"Lotus leaf contact angle: 162° (Cassie-Baxter state)")
print(f"Solid fraction f ≈ 0.05 (only 5% of droplet touches solid)")
print(f"Air fraction: 95% — the droplet essentially sits on air")
print()
print("The Lotus effect requires BOTH:")
print("  1. Hydrophobic chemistry (wax, theta_Y > 90°)")
print("  2. Hierarchical roughness (micro-papillae + nano-crystals)")
print("Either alone is insufficient. Together they produce superhydrophobicity.")`,
      challenge: 'Calculate the critical pressure at which water is forced into the nano-grooves (Cassie-to-Wenzel transition). Use the Laplace pressure equation: P = 2*gamma*cos(theta)/d, where gamma = 0.072 N/m and d is the groove width.',
      successHint: 'The Lotus effect has inspired self-cleaning glass, water-resistant textiles, anti-fouling ship hulls, and non-stick cookware. Understanding the physics of contact angle and surface roughness is the foundation of surface engineering.',
    },
    {
      title: 'Surface tension and contact angle physics',
      concept: `Surface tension is the force that makes water form droplets instead of spreading into a thin film. It arises because water molecules at the surface have unbalanced intermolecular forces — they are pulled inward by neighboring water molecules but not from the air side.

**Surface tension** (gamma) = force per unit length along the surface, or energy per unit area. For water at 25C: gamma = 0.072 N/m.

**Young's equation** defines the contact angle at the triple line (where liquid, solid, and gas meet):

cos(theta) = (gamma_SV - gamma_SL) / gamma_LV

where:
- gamma_SV = solid-vapor surface energy
- gamma_SL = solid-liquid interfacial energy
- gamma_LV = liquid-vapor surface tension

High solid surface energy (glass, metals) means gamma_SV >> gamma_SL, giving cos(theta) > 0, theta < 90 degrees — water spreads (hydrophilic). Low solid surface energy (waxes, fluorocarbons) gives theta > 90 degrees — water beads up.

**Capillary rise**: water rises in narrow tubes because the adhesive force (water-glass) overcomes gravity. Height h = 2*gamma*cos(theta) / (rho*g*r). This is how plants transport water from roots to leaves!`,
      analogy: 'Surface tension is like a stretched rubber sheet. The molecules at the surface are under tension, pulling inward. A small object (like a water strider) can sit on the "sheet" without breaking through, just as you can place a needle on the surface of water if you are careful. The lotus leaf exploits this tension: the wax surface is so repulsive to water that the surface tension pulls the droplet into a sphere rather than letting it spread.',
      storyConnection: 'Why does the lotus float? Partly because of surface tension. The underside of a lotus leaf has fine hairs that trap a layer of air, creating a silvery sheen underwater. This air layer provides buoyancy. But more importantly, the superhydrophobic surface prevents water from wetting the leaf and weighing it down. Surface tension is the lotus leaf\'s defense against sinking.',
      checkQuestion: 'A water strider walks on water using surface tension. If you add soap to the water, the strider sinks. Why?',
      checkAnswer: 'Soap is a surfactant — it dramatically reduces surface tension (from 0.072 to ~0.035 N/m). The water strider depends on surface tension to support its weight. With reduced surface tension, the force supporting each leg drops below the insect\'s weight, and it breaks through the surface. This also explains why soapy water wets surfaces that pure water beads on — reduced surface tension means the water spreads more easily.',
      codeIntro: 'Model surface tension, capillary rise, and the forces acting on objects at the water surface.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Surface tension physics
gamma_water = 0.072  # N/m at 25C
rho_water = 998  # kg/m^3
g = 9.81  # m/s^2

# Capillary rise: h = 2*gamma*cos(theta) / (rho*g*r)
def capillary_height(radius_m, theta_deg=0, gamma=gamma_water):
    theta = np.radians(theta_deg)
    return 2 * gamma * np.cos(theta) / (rho_water * g * radius_m)

# Radius range from 0.01mm to 10mm
radii = np.logspace(-5, -2, 100)  # meters

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Capillary rise vs tube radius
ax = axes[0, 0]
ax.set_facecolor('#111827')
for theta in [0, 30, 60, 90, 120]:
    h = capillary_height(radii, theta)
    label = f'theta={theta}°'
    if theta == 0:
        label += ' (glass)'
    elif theta == 120:
        label += ' (wax)'
    ax.plot(radii * 1000, h * 1000, linewidth=2, label=label)

ax.set_xscale('log')
ax.set_xlabel('Tube radius (mm)', color='white')
ax.set_ylabel('Capillary rise (mm)', color='white')
ax.set_title('Capillary rise: surface tension vs gravity', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.axhline(0, color='gray', linewidth=0.5)

# Plant xylem: capillary rise in different vessel sizes
ax = axes[0, 1]
ax.set_facecolor('#111827')
xylem_types = {
    'Grass xylem': 0.01e-3,   # 10 um
    'Hardwood vessel': 0.05e-3,  # 50 um
    'Softwood tracheid': 0.02e-3,  # 20 um
    'Lotus petiole': 0.03e-3,  # 30 um
}
names = list(xylem_types.keys())
radii_xy = list(xylem_types.values())
heights = [capillary_height(r, 30) for r in radii_xy]

bars = ax.barh(names, [h * 100 for h in heights],
               color=['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'], edgecolor='none')
ax.set_xlabel('Capillary rise (cm)', color='white')
ax.set_title('Water transport in plant xylem', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, h in zip(bars, heights):
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{h*100:.0f} cm', va='center', color='white', fontsize=9)

# Water strider force balance
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Force supported by surface tension = 2 * gamma * L * cos(theta)
# where L = total leg contact length
leg_lengths = np.linspace(1e-3, 50e-3, 100)  # 1mm to 50mm
theta_contact = 100  # degrees (hydrophobic leg)
force_supported = 2 * gamma_water * leg_lengths * np.cos(np.radians(theta_contact))
# This is per leg, 6 legs total
total_force = 6 * force_supported
weight_strider = 0.001 * g  # ~1g = typical water strider weight

# With soap (reduced surface tension)
gamma_soap = 0.035
force_soap = 6 * 2 * gamma_soap * leg_lengths * np.cos(np.radians(theta_contact))

ax.plot(leg_lengths * 1000, total_force * 1000, color='#22c55e', linewidth=2,
        label=f'Pure water (γ={gamma_water*1000:.0f} mN/m)')
ax.plot(leg_lengths * 1000, force_soap * 1000, color='#ef4444', linewidth=2,
        label=f'Soapy water (γ={gamma_soap*1000:.0f} mN/m)')
ax.axhline(weight_strider * 1000, color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Strider weight ({weight_strider*1000:.1f} mN)')
ax.set_xlabel('Leg contact length (mm)', color='white')
ax.set_ylabel('Surface tension force (mN)', color='white')
ax.set_title('Water strider: surface tension vs weight', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Surfactant effect on surface tension
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Szyszkowski equation: gamma = gamma_0 * (1 - B * ln(1 + c/a))
conc = np.logspace(-5, -1, 100)  # mol/L
B = 0.3
a = 1e-3
gamma_surf = gamma_water * (1 - B * np.log(1 + conc / a))
gamma_surf = np.clip(gamma_surf, 0.025, gamma_water)

ax.plot(conc * 1000, gamma_surf * 1000, color='#a855f7', linewidth=2)
ax.set_xscale('log')
ax.set_xlabel('Surfactant concentration (mM)', color='white')
ax.set_ylabel('Surface tension (mN/m)', color='white')
ax.set_title('Surfactant reduces surface tension', color='white', fontsize=11)
ax.axhline(gamma_water * 1000, color='#22c55e', linestyle='--', alpha=0.5, label='Pure water')
ax.axhline(25, color='#ef4444', linestyle='--', alpha=0.5, label='CMC limit')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("SURFACE TENSION PHYSICS")
print(f"Water surface tension: {gamma_water*1000:.1f} mN/m")
print(f"Capillary rise in 10um tube: {capillary_height(10e-6, 0)*100:.0f} cm")
print(f"Capillary rise in 50um tube: {capillary_height(50e-6, 0)*100:.0f} cm")
print()
print("Plants use capillary action + transpiration pull to move water to the canopy.")
print("The lotus leaf uses surface tension to stay dry and buoyant.")
print("Surface tension is the molecular force that shapes water at every scale.")`,
      challenge: 'Calculate how many lotus leaves (each 30cm diameter) it would take to support a 1kg weight by surface tension alone, assuming superhydrophobic contact. Compare this to the actual buoyancy from the air trapped under the leaf.',
      successHint: 'Surface tension governs phenomena from the nanoscale (wetting of nanoparticles) to the macroscale (shape of raindrops, capillary rise in trees). It is one of the most important interfacial phenomena in nature and engineering.',
    },
    {
      title: 'Biomimicry — from lotus to self-cleaning technology',
      concept: `The Lotus effect inspired an entire field of **biomimicry** — engineering solutions by copying nature\'s designs. Self-cleaning surfaces based on lotus leaf microstructure are now commercial products worth billions of dollars.

Key biomimetic applications:

- **Lotusan paint** (Sto Corporation): exterior paint with micro-rough surface that stays clean for decades without washing. Buildings coated in Lotusan shed dirt with every rain.
- **Self-cleaning glass**: nano-structured coatings that combine superhydrophobicity with photocatalytic decomposition of organic dirt (TiO2).
- **Anti-fouling ship hulls**: reducing marine organism attachment saves fuel (smoother hull = less drag). Biomimetic coatings reduce fouling without toxic anti-fouling paints.
- **Water-repellent textiles**: NanoTex fabric treatments create superhydrophobic fibers that repel water, oil, and stains.
- **Medical implants**: superhydrophobic coatings prevent bacterial biofilm formation on surgical instruments and implants.

The design principle: you need BOTH chemistry (low surface energy) AND structure (hierarchical roughness). Neither alone achieves superhydrophobicity:
- Smooth Teflon: contact angle = 115 degrees (hydrophobic, not superhydrophobic)
- Rough glass: contact angle = 0 degrees (superhydrophilic — roughness amplifies wetting for hydrophilic materials)
- Rough Teflon: contact angle = 170 degrees (superhydrophobic!)`,
      analogy: 'Biomimicry is like industrial espionage from nature\'s R&D lab. Nature has been running experiments for 3.8 billion years with trillions of test subjects. Every organism alive today is a successful design that passed the ultimate test: survival. The lotus leaf passed 80 million years of testing. We can shortcut billions of years of R&D by copying designs that already work.',
      storyConnection: 'The lotus in the story floats serenely on muddy water, perfectly clean. For millennia, this was just a beautiful image. Now it is a technology platform. Engineers who studied why the lotus stays clean discovered the nano-structure and replicated it in paint, glass, and textiles. The story of the lotus is literally the story of biomimicry: nature solved the problem first, and we learned to read the answer.',
      checkQuestion: 'Why can\'t you simply spray a lotus leaf with Teflon to make any surface superhydrophobic?',
      checkAnswer: 'A smooth Teflon coating gives ~115 degree contact angle — hydrophobic but not superhydrophobic. You need the hierarchical roughness to push it above 150 degrees. The Teflon provides the chemistry (low surface energy), but without the micro/nano structure, there are no air pockets to amplify the hydrophobicity. You need to create the roughness first (etching, nanoparticle deposition, electrospinning) and then coat with a hydrophobic material.',
      codeIntro: 'Design and simulate biomimetic surfaces with different roughness patterns and predict their contact angles and self-cleaning performance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate different surface designs and their performance
designs = {
    'Smooth Teflon': {'theta_Y': 115, 'r': 1.0, 'f': 1.0, 'hierarchy': 'none'},
    'Rough Teflon (micro)': {'theta_Y': 115, 'r': 2.5, 'f': 0.3, 'hierarchy': 'micro'},
    'Lotus-inspired (micro+nano)': {'theta_Y': 110, 'r': 4.0, 'f': 0.08, 'hierarchy': 'dual'},
    'Nano-pillar array': {'theta_Y': 100, 'r': 3.0, 'f': 0.15, 'hierarchy': 'nano'},
    'Rough glass': {'theta_Y': 30, 'r': 2.0, 'f': 0.5, 'hierarchy': 'micro'},
    'Shark skin (riblets)': {'theta_Y': 80, 'r': 1.8, 'f': 0.6, 'hierarchy': 'micro'},
}

def calc_contact_angle(theta_Y_deg, r, f):
    theta_Y = np.radians(theta_Y_deg)
    cos_Y = np.cos(theta_Y)

    # Wenzel
    cos_W = np.clip(r * cos_Y, -1, 1)
    theta_W = np.degrees(np.arccos(cos_W))

    # Cassie-Baxter
    cos_CB = np.clip(f * cos_Y + f - 1, -1, 1)
    theta_CB = np.degrees(np.arccos(cos_CB))

    # Use CB if theta_Y > 90, Wenzel otherwise
    if theta_Y_deg > 90:
        return theta_CB, 'Cassie-Baxter'
    else:
        return theta_W, 'Wenzel'

# Self-cleaning efficiency model
# Dirt removal depends on: contact angle, sliding angle, and drop velocity
def self_cleaning_efficiency(contact_angle, sliding_angle=5, drop_size=2e-3):
    # Higher contact angle = better self-cleaning
    # Sliding angle < 10° needed for drops to roll
    if contact_angle < 90:
        return 0  # hydrophilic — no self-cleaning
    elif contact_angle < 150:
        return (contact_angle - 90) / 90 * 0.5  # partial
    else:
        return 0.5 + (contact_angle - 150) / 40 * 0.5  # superhydrophobic

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Contact angles for all designs
ax = axes[0, 0]
ax.set_facecolor('#111827')
design_names = list(designs.keys())
contact_angles = []
ca_colors = []
for name, d in designs.items():
    ca, mode = calc_contact_angle(d['theta_Y'], d['r'], d['f'])
    contact_angles.append(ca)
    if ca > 150:
        ca_colors.append('#22c55e')
    elif ca > 90:
        ca_colors.append('#f59e0b')
    else:
        ca_colors.append('#ef4444')

bars = ax.barh(design_names, contact_angles, color=ca_colors, edgecolor='none')
ax.axvline(90, color='white', linestyle='--', alpha=0.3, label='Hydrophobic')
ax.axvline(150, color='#ef4444', linestyle='--', alpha=0.3, label='Superhydrophobic')
ax.set_xlabel('Contact angle (degrees)', color='white')
ax.set_title('Contact angle by surface design', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Self-cleaning efficiency
ax = axes[0, 1]
ax.set_facecolor('#111827')
efficiencies = [self_cleaning_efficiency(ca) for ca in contact_angles]
bars = ax.barh(design_names, [e * 100 for e in efficiencies], color=ca_colors, edgecolor='none')
ax.set_xlabel('Self-cleaning efficiency (%)', color='white')
ax.set_title('Self-cleaning performance', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Design space exploration: theta_Y vs solid fraction
ax = axes[1, 0]
ax.set_facecolor('#111827')
theta_range = np.linspace(60, 130, 50)
f_range = np.linspace(0.01, 1.0, 50)
T, F = np.meshgrid(theta_range, f_range)

# Compute Cassie-Baxter contact angle for each combination
cos_CB_grid = F * np.cos(np.radians(T)) + F - 1
cos_CB_grid = np.clip(cos_CB_grid, -1, 1)
CA_grid = np.degrees(np.arccos(cos_CB_grid))

im = ax.contourf(T, F, CA_grid, levels=np.arange(60, 175, 5), cmap='RdYlGn')
ax.contour(T, F, CA_grid, levels=[150], colors=['white'], linewidths=2)
plt.colorbar(im, ax=ax, label='Contact angle (°)')
ax.set_xlabel("Material contact angle θ_Y (degrees)", color='white')
ax.set_ylabel('Solid fraction f', color='white')
ax.set_title('Design space: θ_Y vs f (150° line shown)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Mark actual designs
for name, d in designs.items():
    if d['theta_Y'] > 60:
        ax.scatter([d['theta_Y']], [d['f']], c='white', s=50, edgecolors='black', zorder=5)

# Application timeline
ax = axes[1, 1]
ax.set_facecolor('#111827')
applications = [
    (1997, 'Lotus effect\\ndiscovered', '#22c55e'),
    (2003, 'Lotusan\\npaint', '#3b82f6'),
    (2005, 'Self-cleaning\\nglass', '#f59e0b'),
    (2008, 'NanoTex\\ntextiles', '#a855f7'),
    (2012, 'Anti-ice\\ncoatings', '#ef4444'),
    (2018, 'Medical\\nimplants', '#06b6d4'),
    (2023, 'Smart responsive\\nsurfaces', '#f59e0b'),
]

for year, label, color in applications:
    ax.scatter([year], [0.5], c=color, s=100, zorder=5)
    ax.annotate(label, xy=(year, 0.5), xytext=(year, 0.8),
                fontsize=7, color='white', ha='center',
                arrowprops=dict(arrowstyle='->', color=color))

ax.set_xlim(1995, 2025)
ax.set_ylim(0, 1.5)
ax.set_xlabel('Year', color='white')
ax.set_title('Lotus effect: from discovery to application', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_yticks([])

plt.tight_layout()
plt.show()

print("BIOMIMICRY DESIGN ANALYSIS")
print(f"{'Design':<30} {'Contact angle':>14} {'Self-clean':>12}")
print("-" * 58)
for name, ca, eff in zip(design_names, contact_angles, efficiencies):
    print(f"{name:<30} {ca:>10.0f}° {eff*100:>10.0f}%")
print()
print("The lotus-inspired design achieves the highest contact angle")
print("because it combines low surface energy with hierarchical roughness.")
print("Biomimicry works by identifying nature's design principles, not just copying shapes.")`,
      challenge: 'Design a surface that is superhydrophobic to water but superoleophilic (attracts oil). This would be useful for oil-water separation in environmental cleanup. What combination of surface energy and roughness is needed?',
      successHint: 'Biomimicry is not just copying nature — it is understanding the design principle and applying it to new problems. The lotus effect principle (chemistry + roughness = extreme wetting behavior) has applications far beyond self-cleaning surfaces.',
    },
    {
      title: 'Aerenchyma tissue — how the lotus breathes underwater',
      concept: `The lotus does not just float — it actively manages gas transport between its submerged roots and its aerial leaves. The secret is **aerenchyma** — a specialized plant tissue filled with large air spaces.

Aerenchyma can constitute 20-60% of the total tissue volume in aquatic plants like lotus. These air channels serve three functions:

1. **Oxygen transport**: photosynthesis in leaves produces O2 that diffuses down through aerenchyma to roots. Submerged roots in anaerobic mud depend on this supply.
2. **Buoyancy**: the air-filled channels reduce tissue density, helping leaves and petioles float.
3. **Gas exchange**: CO2 from root respiration and methane from surrounding sediment travel up through aerenchyma to the atmosphere.

Two types of aerenchyma formation:
- **Schizogenous**: cells separate at their middle lamella to create spaces (in lotus petioles)
- **Lysigenous**: programmed cell death creates cavities (in rice roots under flooding)

The physics of gas transport through aerenchyma follows **Fick's law of diffusion**:
J = -D * (dC/dx)

where J is flux, D is the diffusion coefficient, and dC/dx is the concentration gradient. Diffusion of O2 is 10,000 times faster in air than in water, which is why aerenchyma (air-filled channels) is critical — it provides a fast highway for gas transport through what would otherwise be an impermeable water barrier.`,
      analogy: 'Aerenchyma is like a ventilation system in a building. The lotus leaf is the rooftop air intake (where fresh air enters). The petiole is the main ventilation shaft (aerenchyma channels carrying air downward). The roots are the basement rooms that need ventilation (they produce CO2 and need O2). Without the shaft, the basement suffocates. The shaft makes the whole building livable, just as aerenchyma makes aquatic life possible for the lotus.',
      storyConnection: 'Why does the lotus float? Because its tissues are filled with air. Not trapped air, but a sophisticated network of channels that the plant built on purpose. The lotus petiole (stem) is like a bundle of drinking straws — each straw is an aerenchyma channel connecting the leaf to the root. Cut a lotus petiole and you can see the channels with your naked eye. Blow through it and air flows from leaf to root.',
      checkQuestion: 'A lotus plant is growing in a pond that becomes polluted with hydrogen sulfide (H2S), a toxic gas. Could H2S travel through the aerenchyma to the leaves?',
      checkAnswer: 'Yes. Aerenchyma channels transport any gas, not just O2 and CO2. H2S from anaerobic sediment can diffuse through the aerenchyma to the leaves, potentially damaging photosynthetic tissues. Some aquatic plants have evolved enzymatic defenses (sulfide oxidation) in their aerenchyma tissues to detoxify H2S before it reaches the leaves. This is an active area of wetland ecology research, especially relevant to constructed wetlands for wastewater treatment.',
      codeIntro: 'Model gas transport through aerenchyma channels using Fick\'s law and calculate the oxygen supply rate to submerged roots.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Gas diffusion model through aerenchyma
# Fick's law: J = -D * dC/dx
# D_O2_air = 2.0e-5 m^2/s
# D_O2_water = 2.0e-9 m^2/s (10,000x slower!)

D_O2_air = 2.0e-5  # m^2/s
D_O2_water = 2.0e-9  # m^2/s

# Lotus petiole model
petiole_length = 1.0  # meters
petiole_radius = 0.01  # meters (1cm)
aerenchyma_fraction = 0.40  # 40% air space

# Concentration: C_O2 at leaf surface = atmospheric (21% = 8.6 mol/m^3)
# C_O2 at root = near zero (consumed by respiration)
C_leaf = 8.6  # mol/m^3
C_root = 0.5  # mol/m^3

# Cross-sectional area for gas transport
A_aer = np.pi * petiole_radius**2 * aerenchyma_fraction
A_water = np.pi * petiole_radius**2 * (1 - aerenchyma_fraction)

# Steady-state diffusion
def oxygen_flux(length, C_top, C_bottom, D, A):
    """Steady-state diffusive flux through a column."""
    dC = C_top - C_bottom
    return D * A * dC / length  # mol/s

flux_aerenchyma = oxygen_flux(petiole_length, C_leaf, C_root, D_O2_air, A_aer)
flux_water_only = oxygen_flux(petiole_length, C_leaf, C_root, D_O2_water, A_water)

# Time-dependent diffusion (1D)
def diffusion_1D(length, n_cells, D, C_top, C_bottom, dt, n_steps):
    dx = length / n_cells
    C = np.linspace(C_top, C_bottom, n_cells)
    history = [C.copy()]

    for step in range(n_steps):
        C_new = C.copy()
        for i in range(1, n_cells - 1):
            C_new[i] = C[i] + D * dt / dx**2 * (C[i+1] - 2*C[i] + C[i-1])
        C_new[0] = C_top  # boundary: leaf
        C_new[-1] = max(0, C_new[-1] - 0.01 * C_new[-1])  # root consumption
        C = C_new
        if step % 100 == 0:
            history.append(C.copy())

    return np.array(history), np.linspace(0, length, n_cells)

# Run simulations
aer_hist, x_pos = diffusion_1D(petiole_length, 50, D_O2_air, C_leaf, C_root, 0.01, 5000)
water_hist, _ = diffusion_1D(petiole_length, 50, D_O2_water, C_leaf, C_root, 0.1, 5000)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# O2 concentration profile: aerenchyma vs water
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, time_label in [(0, 't=0'), (-1, 'Steady state')]:
    ax.plot(x_pos * 100, aer_hist[i], linewidth=2, label=f'Aerenchyma ({time_label})',
            color='#22c55e' if i == -1 else '#86efac')
    ax.plot(x_pos * 100, water_hist[i], linewidth=2, label=f'Water only ({time_label})',
            color='#ef4444' if i == -1 else '#fca5a5')

ax.set_xlabel('Distance from leaf (cm)', color='white')
ax.set_ylabel('[O2] (mol/m³)', color='white')
ax.set_title('O2 profile: leaf to root', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Flux comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
fluxes = [flux_aerenchyma * 1e6, flux_water_only * 1e6]
labels = ['With\\naerenchy.', 'Water\\nonly']
colors = ['#22c55e', '#ef4444']
bars = ax.bar(labels, fluxes, color=colors, edgecolor='none', width=0.5)
ax.set_ylabel('O2 flux (μmol/s)', color='white')
ax.set_title(f'O2 delivery: {flux_aerenchyma/flux_water_only:.0f}x advantage', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, f in zip(bars, fluxes):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(fluxes)*0.02,
            f'{f:.4f}', ha='center', color='white', fontsize=10)

# Buoyancy contribution
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Tissue density calculation
rho_cell_wall = 1500  # kg/m^3 (cellulose)
rho_cytoplasm = 1050  # kg/m^3
rho_air = 1.2  # kg/m^3

aer_fractions = np.linspace(0, 0.7, 100)
tissue_density = (1 - aer_fractions) * (0.3 * rho_cell_wall + 0.7 * rho_cytoplasm) + aer_fractions * rho_air

ax.plot(aer_fractions * 100, tissue_density, color='#22c55e', linewidth=2)
ax.axhline(rho_water, color='#3b82f6', linestyle='--', linewidth=2, label='Water density (998 kg/m³)')
ax.fill_between(aer_fractions * 100, tissue_density, rho_water,
                where=tissue_density < rho_water, alpha=0.2, color='#22c55e', label='Floats')
ax.fill_between(aer_fractions * 100, tissue_density, rho_water,
                where=tissue_density > rho_water, alpha=0.2, color='#ef4444', label='Sinks')

# Mark lotus
lotus_aer = 40
lotus_density = (1 - 0.4) * (0.3 * 1500 + 0.7 * 1050) + 0.4 * 1.2
ax.scatter([lotus_aer], [lotus_density], c='#ef4444', s=100, zorder=5, label=f'Lotus (40% aer.)')

ax.set_xlabel('Aerenchyma fraction (%)', color='white')
ax.set_ylabel('Tissue density (kg/m³)', color='white')
ax.set_title('Buoyancy: aerenchyma makes plants float', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Cross-section visualization
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Draw a lotus petiole cross-section with aerenchyma channels
theta = np.linspace(0, 2*np.pi, 100)
# Outer circle
ax.plot(np.cos(theta), np.sin(theta), color='#22c55e', linewidth=3)

# Aerenchyma channels (large)
n_channels = 12
for i in range(n_channels):
    angle = 2 * np.pi * i / n_channels
    cx = 0.55 * np.cos(angle)
    cy = 0.55 * np.sin(angle)
    r = 0.18
    channel = plt.Circle((cx, cy), r, color='#111827', edgecolor='#22c55e', linewidth=1)
    ax.add_patch(channel)

# Small central channels
for i in range(6):
    angle = 2 * np.pi * i / 6 + np.pi / 6
    cx = 0.2 * np.cos(angle)
    cy = 0.2 * np.sin(angle)
    channel = plt.Circle((cx, cy), 0.08, color='#111827', edgecolor='#22c55e', linewidth=1)
    ax.add_patch(channel)

ax.set_xlim(-1.3, 1.3)
ax.set_ylim(-1.3, 1.3)
ax.set_aspect('equal')
ax.set_title('Lotus petiole cross-section (aerenchyma)', color='white', fontsize=11)
ax.text(0, -1.15, 'Dark = air channels, Green = tissue', ha='center', color='gray', fontsize=8)
ax.axis('off')

plt.tight_layout()
plt.show()

print("AERENCHYMA ANALYSIS")
print(f"Aerenchyma fraction: {aerenchyma_fraction:.0%}")
print(f"O2 flux (aerenchyma): {flux_aerenchyma*1e6:.4f} μmol/s")
print(f"O2 flux (water only): {flux_water_only*1e6:.8f} μmol/s")
print(f"Advantage: {flux_aerenchyma/flux_water_only:.0f}x faster O2 delivery")
print(f"Tissue density: {lotus_density:.0f} kg/m³ (water: {rho_water} kg/m³)")
print(f"Buoyancy: tissue is {(1 - lotus_density/rho_water)*100:.0f}% less dense than water")
print()
print("Aerenchyma solves two problems simultaneously:")
print("  1. Gas transport (O2 to roots, CO2 to leaves)")
print("  2. Buoyancy (air-filled tissue floats)")`,
      challenge: 'Model what happens when the water level suddenly rises 50cm, submerging half the petiole. How quickly does the O2 concentration at the roots drop? Some rice varieties can form new aerenchyma in response to flooding — model this adaptive response.',
      successHint: 'Aerenchyma is found in all aquatic and wetland plants — rice, mangroves, water lilies, cattails. Understanding aerenchyma gas transport is critical for wetland conservation, rice cultivation under flooding, and even designing constructed wetlands for wastewater treatment.',
    },
    {
      title: 'Aquatic plant adaptations — a comparative survey',
      concept: `The lotus is one of many aquatic plants, each with a unique set of adaptations to life in water. Comparing them reveals convergent solutions and trade-offs.

**Types of aquatic plants:**

1. **Emergent** (lotus, cattail, rice): rooted in sediment, leaves above water. Must transport O2 to submerged roots. Thick aerenchyma, rigid petioles.

2. **Floating-leaf** (water lily, duckweed): leaves on water surface. Stomata only on upper surface. Flat leaves with aerenchyma for buoyancy.

3. **Submerged** (Elodea, seagrass): entirely underwater. Absorb CO2 and minerals directly from water. Thin leaves (no need for structural support), no stomata, reduced vascular tissue.

4. **Free-floating** (water hyacinth, Salvinia): not rooted. Bladder-like floats filled with spongy tissue. Can reproduce rapidly (water hyacinth doubles in 12 days).

Key adaptations:
- **Flexible petioles**: bend without breaking in currents (unlike rigid terrestrial stems)
- **Mucilage secretion**: slimy coating reduces drag and prevents epiphyte colonization
- **Heterophylly**: same plant produces different leaf shapes above and below water
- **Gas film retention**: superhydrophobic surfaces trap an air layer (plastron) that allows gas exchange even when submerged`,
      analogy: 'Aquatic plants are like different building designs for a flood zone. Emergent plants are houses on stilts — they keep their important structures above the flood line. Floating-leaf plants are houseboats — they rise and fall with the water level. Submerged plants are submarines — they operate entirely underwater. Free-floating plants are life rafts — no foundation, going wherever the current takes them. Each design solves the water problem differently.',
      storyConnection: 'The lotus in the story floats because it has solved every challenge of aquatic life: buoyancy (aerenchyma), gas transport (ventilation channels), water repellency (superhydrophobic surface), and structural support (flexible petiole). It is not a single adaptation but a coordinated suite of solutions — an engineering masterclass written in plant tissue.',
      checkQuestion: 'Submerged aquatic plants like Elodea have no stomata. How do they absorb CO2 for photosynthesis?',
      checkAnswer: 'They absorb dissolved CO2 (and bicarbonate ions HCO3-) directly through their thin leaf epidermis. Submerged leaves are often just 2-3 cells thick (vs. hundreds of cells in a terrestrial leaf) to minimize diffusion distance. Some species actively pump CO2 using carbonic anhydrase enzymes that convert HCO3- to CO2 inside the cell. The trade-off: thin leaves photosynthesize efficiently but have no structural support — they collapse immediately when removed from water.',
      codeIntro: 'Compare aquatic plant adaptation strategies across multiple trait dimensions and model the trade-offs between different life forms.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Aquatic plant traits comparison
species = {
    'Lotus\\n(Nelumbo)': {
        'type': 'emergent',
        'aerenchyma': 0.40, 'leaf_thickness': 0.5, 'root_depth': 0.8,
        'growth_rate': 0.4, 'buoyancy': 0.9, 'photosynthesis': 0.8,
        'flood_tolerance': 0.7, 'drag_resistance': 0.5, 'color': '#22c55e'
    },
    'Water lily\\n(Nymphaea)': {
        'type': 'floating-leaf',
        'aerenchyma': 0.50, 'leaf_thickness': 0.3, 'root_depth': 0.5,
        'growth_rate': 0.5, 'buoyancy': 0.95, 'photosynthesis': 0.7,
        'flood_tolerance': 0.8, 'drag_resistance': 0.6, 'color': '#f59e0b'
    },
    'Elodea\\n(submerged)': {
        'type': 'submerged',
        'aerenchyma': 0.20, 'leaf_thickness': 0.05, 'root_depth': 0.2,
        'growth_rate': 0.9, 'buoyancy': 0.3, 'photosynthesis': 0.5,
        'flood_tolerance': 1.0, 'drag_resistance': 0.9, 'color': '#3b82f6'
    },
    'Water hyacinth\\n(Eichhornia)': {
        'type': 'free-floating',
        'aerenchyma': 0.60, 'leaf_thickness': 0.6, 'root_depth': 0.1,
        'growth_rate': 1.0, 'buoyancy': 1.0, 'photosynthesis': 0.9,
        'flood_tolerance': 0.9, 'drag_resistance': 0.3, 'color': '#a855f7'
    },
    'Cattail\\n(Typha)': {
        'type': 'emergent',
        'aerenchyma': 0.35, 'leaf_thickness': 0.8, 'root_depth': 0.9,
        'growth_rate': 0.6, 'buoyancy': 0.4, 'photosynthesis': 0.85,
        'flood_tolerance': 0.6, 'drag_resistance': 0.4, 'color': '#ef4444'
    },
    'Duckweed\\n(Lemna)': {
        'type': 'free-floating',
        'aerenchyma': 0.30, 'leaf_thickness': 0.02, 'root_depth': 0.05,
        'growth_rate': 0.95, 'buoyancy': 0.98, 'photosynthesis': 0.6,
        'flood_tolerance': 0.95, 'drag_resistance': 0.95, 'color': '#06b6d4'
    },
}

traits = ['aerenchyma', 'leaf_thickness', 'root_depth', 'growth_rate',
          'buoyancy', 'photosynthesis', 'flood_tolerance', 'drag_resistance']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Radar chart (as line plot approximation)
ax = axes[0, 0]
ax.set_facecolor('#111827')
angles = np.linspace(0, 2*np.pi, len(traits), endpoint=False).tolist()
angles += angles[:1]

for sp_name, data in species.items():
    values = [data[t] for t in traits]
    values += values[:1]
    ax.plot(angles, values, 'o-', color=data['color'], linewidth=1.5, label=sp_name, markersize=4)
    ax.fill(angles, values, alpha=0.05, color=data['color'])

ax.set_xticks(angles[:-1])
ax.set_xticklabels([t.replace('_', '\\n') for t in traits], color='white', fontsize=7)
ax.set_ylim(0, 1.1)
ax.set_title('Trait comparison across aquatic plants', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=6, loc='upper right')
ax.tick_params(colors='gray')

# Trade-off: buoyancy vs structural support
ax = axes[0, 1]
ax.set_facecolor('#111827')
for sp_name, data in species.items():
    ax.scatter([data['buoyancy']], [data['leaf_thickness']], c=data['color'],
               s=100, zorder=5, edgecolors='white', linewidths=0.5)
    ax.annotate(sp_name.split('\\n')[0], xy=(data['buoyancy'], data['leaf_thickness']),
                xytext=(5, 5), textcoords='offset points', fontsize=8, color='white')
ax.set_xlabel('Buoyancy', color='white')
ax.set_ylabel('Leaf thickness (structural support)', color='white')
ax.set_title('Trade-off: buoyancy vs structure', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Growth rate simulation: water hyacinth exponential growth
ax = axes[1, 0]
ax.set_facecolor('#111827')
days = np.arange(0, 90)
doubling_times = {
    'Water hyacinth': 12,
    'Duckweed': 5,
    'Lotus': 30,
    'Cattail': 45,
}
for name, dt_days in doubling_times.items():
    growth = np.exp(np.log(2) / dt_days * days)
    color = '#a855f7' if 'hyacinth' in name else '#06b6d4' if 'Duckweed' in name else '#22c55e' if 'Lotus' in name else '#ef4444'
    ax.plot(days, growth, color=color, linewidth=2, label=f'{name} (dt={dt_days}d)')

ax.set_xlabel('Days', color='white')
ax.set_ylabel('Relative biomass', color='white')
ax.set_title('Growth rates: invasion potential', color='white', fontsize=11)
ax.set_yscale('log')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Water depth tolerance
ax = axes[1, 1]
ax.set_facecolor('#111827')
depth_data = {
    'Lotus': (0, 200),        # cm depth tolerance
    'Water lily': (30, 300),
    'Elodea': (50, 500),
    'Water hyacinth': (0, 0),  # surface
    'Cattail': (0, 100),
    'Duckweed': (0, 0),
}
names_d = list(depth_data.keys())
for i, (name, (min_d, max_d)) in enumerate(depth_data.items()):
    color = list(species.values())[i]['color']
    ax.barh(i, max_d - min_d, left=min_d, color=color, edgecolor='none', height=0.6)
    ax.text(max_d + 5, i, f'{min_d}-{max_d}cm', va='center', color='white', fontsize=8)

ax.set_yticks(range(len(names_d)))
ax.set_yticklabels(names_d, color='white', fontsize=9)
ax.set_xlabel('Water depth tolerance (cm)', color='white')
ax.set_title('Depth niche partitioning', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("AQUATIC PLANT ADAPTATIONS")
print()
print("Life form strategies:")
print("  Emergent (lotus, cattail): high photosynthesis, limited flood tolerance")
print("  Floating-leaf (water lily): balanced buoyancy + photosynthesis")
print("  Submerged (Elodea): maximum flood tolerance, limited light")
print("  Free-floating (hyacinth, duckweed): maximum growth rate, no anchoring")
print()
print("The lotus combines high buoyancy, strong photosynthesis, and deep roots —")
print("a rare combination that explains its success across tropical and temperate wetlands.")`,
      challenge: 'Model competition between lotus and water hyacinth in a shared pond. Water hyacinth grows faster but lotus is taller. Does the lotus canopy shade out the hyacinth? Include light competition and nutrient uptake in your model.',
      successHint: 'Comparative plant biology reveals that there is no single "best" adaptation — every trait involves trade-offs. The lotus sacrifices growth rate for structural permanence. Water hyacinth sacrifices stability for explosive growth. Understanding these trade-offs is essential for wetland ecology and invasive species management.',
    },
    {
      title: 'Nanoscale surface structures — engineering at the molecular level',
      concept: `The lotus leaf's superhydrophobicity arises from structures at the **nanoscale** — 100 to 200 nanometer wax tubules covering each micro-papilla. To understand and replicate this, we need to think about physics at the nanoscale.

At the nanoscale, familiar forces change in importance:
- **Gravity** becomes negligible (a 100nm particle weighs 10^-18 grams)
- **Surface forces** dominate: van der Waals attraction, electrostatic repulsion, capillary forces
- **Thermal fluctuations** matter: Brownian motion moves nanoparticles randomly
- **Quantum effects** emerge for structures below ~10nm

Fabrication methods for nano-structured surfaces:

1. **Self-assembly**: molecules spontaneously organize into ordered structures (like soap molecules forming micelles). Nature uses this — wax molecules self-assemble into tubules on the lotus leaf.
2. **Lithography**: use light or electron beams to pattern surfaces with nanoscale precision. Expensive but highly controlled.
3. **Electrospinning**: create nanofiber mats by pulling polymer jets with electric fields.
4. **Chemical vapor deposition (CVD)**: grow thin films atom by atom on a substrate.
5. **Template-based**: use natural structures as templates, coat with metal, dissolve the template.

The lotus leaf uses method 1 — self-assembly of epicuticular wax crystals. No factory, no clean room, no equipment — just molecular self-organization driven by thermodynamics.`,
      analogy: 'Nanoscale engineering is like building with LEGO at a scale where each brick is an atom. At the macroscale, you stack bricks with your hands (top-down). At the nanoscale, the bricks assemble themselves (bottom-up) because molecular forces guide them into position. The lotus wax crystals form by self-assembly — the wax molecules "know" how to arrange themselves because the lowest-energy configuration happens to be a tubular crystal. Nature builds nanostructures for free; we pay billions for clean rooms.',
      storyConnection: 'When the lotus leaf surface is examined under an electron microscope, the "secret" of its superhydrophobicity is revealed at the nanoscale: tiny wax crystals covering each bump, creating a fractal-like surface that water cannot penetrate. This nano-architecture evolved before humans existed, and we are still trying to replicate it perfectly in the lab.',
      checkQuestion: 'A company claims to have created a "permanent" superhydrophobic coating for smartphones. Is this realistic?',
      checkAnswer: 'Unlikely to be truly permanent. Superhydrophobic coatings degrade through: (1) mechanical abrasion — touching the surface wears away nano-structures, (2) UV degradation — sunlight breaks down organic hydrophobic molecules, (3) contamination — oils from fingers reduce hydrophobicity, (4) condensation — tiny water droplets that nucleate on the surface can infiltrate nano-structures. Current best coatings last months to years depending on use. The lotus solves this by continuously regenerating its wax layer — a self-healing surface. Artificial self-healing superhydrophobic coatings are an active research frontier.',
      codeIntro: 'Simulate the self-assembly of wax nanocrystals on a surface and model how the resulting structure affects contact angle and self-cleaning performance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Self-assembly simulation: nanoparticles on a surface
# Simplified model: particles deposit and form clusters
# The resulting roughness determines contact angle

def simulate_deposition(grid_size=100, n_particles=5000, diffusion_steps=50):
    """Monte Carlo simulation of nanoparticle deposition and self-assembly."""
    surface = np.zeros((grid_size, grid_size))
    positions = []

    for p in range(n_particles):
        # Random deposition site
        x = np.random.randint(0, grid_size)
        y = np.random.randint(0, grid_size)

        # Diffuse to find stable site (attracted to existing particles)
        for step in range(diffusion_steps):
            # Check neighbors
            neighbors = 0
            for dx in [-1, 0, 1]:
                for dy in [-1, 0, 1]:
                    if dx == 0 and dy == 0:
                        continue
                    nx = (x + dx) % grid_size
                    ny = (y + dy) % grid_size
                    if surface[nx, ny] > 0:
                        neighbors += 1

            # Stick with probability proportional to neighbors
            if neighbors > 0 and np.random.random() < 0.3 * neighbors:
                break

            # Random walk
            x = (x + np.random.choice([-1, 0, 1])) % grid_size
            y = (y + np.random.choice([-1, 0, 1])) % grid_size

        surface[x, y] += 1
        positions.append((x, y))

    return surface

# Generate different surface morphologies
ordered = simulate_deposition(100, 3000, 100)   # High diffusion = ordered
disordered = simulate_deposition(100, 3000, 5)   # Low diffusion = disordered
dense = simulate_deposition(100, 8000, 50)        # High coverage

def calc_roughness_metrics(surface):
    """Calculate surface roughness metrics."""
    Sa = np.mean(np.abs(surface - np.mean(surface)))  # avg roughness
    Sq = np.sqrt(np.mean((surface - np.mean(surface))**2))  # RMS roughness
    coverage = np.mean(surface > 0)  # solid fraction
    max_height = np.max(surface)
    return {'Sa': Sa, 'Sq': Sq, 'coverage': coverage, 'max_h': max_height}

def estimate_contact_angle(surface, theta_Y=110):
    """Estimate contact angle from surface morphology."""
    metrics = calc_roughness_metrics(surface)
    f = metrics['coverage']
    r = 1 + metrics['Sq'] * 0.5  # roughness ratio
    cos_Y = np.cos(np.radians(theta_Y))

    cos_CB = f * cos_Y + f - 1
    cos_CB = np.clip(cos_CB, -1, 1)
    return np.degrees(np.arccos(cos_CB)), metrics

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

surfaces_data = [
    ('Ordered assembly\\n(high diffusion)', ordered),
    ('Disordered\\n(low diffusion)', disordered),
    ('Dense coverage', dense),
]

for i, (name, surf) in enumerate(surfaces_data):
    ax = axes[0, i]
    ax.set_facecolor('#111827')
    ax.imshow(surf, cmap='YlGn', interpolation='nearest')
    ca, metrics = estimate_contact_angle(surf)
    ax.set_title(f'{name}\\nCA={ca:.0f}°, coverage={metrics["coverage"]:.0%}',
                 color='white', fontsize=10)
    ax.tick_params(colors='gray')

# Height distribution comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
for (name, surf), color in zip(surfaces_data, ['#22c55e', '#ef4444', '#3b82f6']):
    heights = surf[surf > 0].flatten()
    ax.hist(heights, bins=20, alpha=0.5, color=color, label=name.split('\\n')[0])
ax.set_xlabel('Particle stack height', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Height distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Contact angle vs deposition parameters
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_particles_range = [500, 1000, 2000, 3000, 5000, 8000]
diff_steps_range = [5, 20, 50, 100]

for diff_s in diff_steps_range:
    cas = []
    for n_p in n_particles_range:
        s = simulate_deposition(50, n_p, diff_s)
        ca, _ = estimate_contact_angle(s)
        cas.append(ca)
    ax.plot(n_particles_range, cas, 'o-', linewidth=2, label=f'Diffusion={diff_s}')

ax.axhline(150, color='#ef4444', linestyle='--', alpha=0.5, label='Superhydrophobic')
ax.set_xlabel('Number of deposited particles', color='white')
ax.set_ylabel('Contact angle (degrees)', color='white')
ax.set_title('Contact angle vs fabrication parameters', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Durability model
ax = axes[1, 2]
ax.set_facecolor('#111827')
abrasion_cycles = np.arange(0, 1000)
# Contact angle degradation
ca_initial = 165
ca_ordered = ca_initial * np.exp(-0.001 * abrasion_cycles) + 90 * (1 - np.exp(-0.001 * abrasion_cycles))
ca_disordered = ca_initial * np.exp(-0.003 * abrasion_cycles) + 90 * (1 - np.exp(-0.003 * abrasion_cycles))
ca_selfhealing = ca_initial * np.exp(-0.001 * abrasion_cycles) * (1 + 0.0005 * abrasion_cycles) + 90 * (1 - np.exp(-0.001 * abrasion_cycles))
ca_selfhealing = np.minimum(ca_selfhealing, ca_initial)

ax.plot(abrasion_cycles, ca_ordered, color='#22c55e', linewidth=2, label='Ordered coating')
ax.plot(abrasion_cycles, ca_disordered, color='#ef4444', linewidth=2, label='Disordered coating')
ax.plot(abrasion_cycles, ca_selfhealing, color='#a855f7', linewidth=2, label='Self-healing (lotus-like)')
ax.axhline(150, color='#f59e0b', linestyle='--', alpha=0.5, label='Superhydrophobic threshold')
ax.set_xlabel('Abrasion cycles', color='white')
ax.set_ylabel('Contact angle (degrees)', color='white')
ax.set_title('Durability: coating degradation under wear', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

ca_results = [(name.split(chr(10))[0], *estimate_contact_angle(s)) for name, s in surfaces_data]
print("NANOSCALE SURFACE ENGINEERING")
for name, ca, metrics in ca_results:
    print(f"  {name}: CA={ca:.0f}°, roughness Sa={metrics['Sa']:.2f}, coverage={metrics['coverage']:.0%}")
print()
print("Self-assembly produces ordered structures that maximize air trapping.")
print("Random deposition gives irregular surfaces with lower contact angles.")
print("The lotus leaf achieves ordered self-assembly through wax crystal growth —")
print("a process perfected over 80 million years of evolution.")`,
      challenge: 'Implement a model where the surface can "heal" (regenerate nanostructures in damaged areas). How often must healing occur to maintain superhydrophobicity under constant abrasion? This models the lotus leaf\'s continuous wax regeneration.',
      successHint: 'Nanoscale engineering is where physics, chemistry, and biology converge. Understanding how molecules self-assemble into functional structures is the key to next-generation materials — from self-cleaning windows to anti-bacterial medical devices to energy-harvesting surfaces.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Surface Science & Aquatic Biology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (plant biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for surface physics and biological modeling. Click to start.</p>
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
