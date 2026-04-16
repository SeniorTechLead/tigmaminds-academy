import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HornbillHelmetLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Force-displacement curves — the signature of impact absorption',
      concept: `When a material crushes, the **force-displacement curve** reveals its behavior:

- **Elastic region**: force rises linearly, material springs back
- **Plateau region**: force stays roughly constant as cells crush (THIS absorbs energy)
- **Densification**: all cells crushed, force shoots up (material is now solid)

The area under the curve = total energy absorbed.

An ideal impact absorber has a long, flat plateau — constant force over maximum displacement. The hornbill casque achieves this through progressive cell collapse.

📚 *matplotlib's plt.fill_between() shades the area under a curve — perfect for showing energy absorption as the area under a force-displacement curve.*`,
      analogy: 'A force-displacement curve is like squeezing a bag of chips. At first, slight squeeze = slight resistance (elastic). Then the chips start crushing — steady resistance as chip after chip breaks (plateau). Finally, all chips are crushed into a solid mass — sudden, hard resistance (densification). The plateau phase is where all the useful energy absorption happens.',
      storyConnection: 'The hornbill casque has an exceptionally long plateau region because its cells are arranged in layers that crush one after another. Each layer absorbs a fixed amount of energy before the next layer starts. This progressive collapse is what makes the casque superior to most synthetic foams.',
      checkQuestion: 'Why is a flat plateau better than a rising curve for impact protection?',
      checkAnswer: 'A flat plateau means constant force — the maximum force the protected structure experiences is predictable and controlled. A rising curve means force keeps increasing with compression, and the last bit of compression produces the highest force — which is the force transmitted to the skull. The flat plateau ensures the brain never experiences more than the plateau force, regardless of impact severity (up to the densification limit).',
      codeIntro: 'Plot force-displacement curves for different impact-absorbing materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

displacement = np.linspace(0, 0.9, 500)  # normalized (0 = uncompressed, 1 = fully dense)

def foam_response(x, plateau_stress, densification_start=0.7):
    """Model foam compression: elastic → plateau → densification."""
    E_elastic = plateau_stress * 30  # elastic modulus
    force = np.zeros_like(x)
    for i, xi in enumerate(x):
        if xi < 0.05:  # elastic
            force[i] = E_elastic * xi
        elif xi < densification_start:  # plateau
            force[i] = plateau_stress * (1 + 0.1 * (xi - 0.05))
        else:  # densification
            force[i] = plateau_stress * (1 + 0.1 * (densification_start - 0.05)) + \
                       plateau_stress * 5 * (xi - densification_start)**2
    return force

materials = [
    ('Hornbill casque', 0.8, 0.75, '#10b981'),    # MPa, long plateau
    ('EPS foam (helmet)', 0.5, 0.65, '#60a5fa'),
    ('EVA foam (shoe)', 0.3, 0.60, '#a78bfa'),
    ('Aluminum honeycomb', 1.5, 0.70, '#f59e0b'),
    ('Steel crumple zone', 3.0, 0.55, '#f87171'),
]

fig, axes = plt.subplots(1, 2, figsize=(13, 5.5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

print("Force-Displacement Analysis")
print("=" * 55)

for name, plateau, dens_start, color in materials:
    force = foam_response(displacement, plateau, dens_start)

    # Force vs displacement
    axes[0].plot(displacement * 100, force, color=color, linewidth=2, label=name)

    # Energy absorbed (area under curve)
    energy = np.trapz(force, displacement)
    axes[1].fill_between(displacement * 100, foam_response(displacement, plateau, dens_start),
                        alpha=0.3, color=color)
    axes[1].plot(displacement * 100, np.cumsum(force) * (displacement[1]-displacement[0]),
                color=color, linewidth=2, label=f'{name}: {energy:.2f} MJ/m³')

    print(f"  {name:25s} | plateau: {plateau:.1f} MPa | densification: {dens_start*100:.0f}% | energy: {energy:.2f} MJ/m³")

axes[0].set_xlabel('Compression (%)', color='white', fontsize=11)
axes[0].set_ylabel('Stress (MPa)', color='white', fontsize=11)
axes[0].set_title('Force-Displacement Curves', color='white', fontsize=13, fontweight='bold')
axes[0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Mark regions on first material
axes[0].annotate('Elastic', xy=(2, 0.3), color='white', fontsize=9)
axes[0].annotate('Plateau\
(energy absorption)', xy=(30, 0.4), color='white', fontsize=9)
axes[0].annotate('Densification\
(danger!)', xy=(75, 2.5), color='white', fontsize=9)

axes[1].set_xlabel('Compression (%)', color='white', fontsize=11)
axes[1].set_ylabel('Cumulative Energy (MJ/m³)', color='white', fontsize=11)
axes[1].set_title('Energy Absorption', color='white', fontsize=13, fontweight='bold')
axes[1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

plt.suptitle('Materials Science: Impact Absorption Comparison', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()`,
      challenge: 'Plot what happens when the casque reaches densification — the force spikes. At what compression percentage does the force exceed the brain\'s tolerance (50 N for the hornbill)? This is the casque\'s safety limit.',
      successHint: 'The force-displacement curve is the most important tool in impact engineering. The area under the curve is energy absorbed, and the shape tells you whether the material is good (flat plateau) or dangerous (sharp spike).',
    },
    {
      title: 'Stress-strain diagrams — comparing material toughness',
      concept: `**Stress** (force/area) and **strain** (deformation/original length) are normalized versions of force and displacement that allow comparison across different sizes.

**Toughness** = total area under the stress-strain curve = energy absorbed per unit volume.

For impact protection, we want:
- **High toughness**: absorbs maximum energy before failure
- **Moderate strength**: enough to resist crushing too easily
- **High ductility**: large strain before failure (lots of crush room)

The hornbill casque achieves high toughness through:
1. Moderate stress plateau (~0.5-1 MPa)
2. Large densification strain (~75%)
3. Combined: toughness ≈ 0.5 × 0.75 = 0.375 MJ/m³

📚 *numpy's np.trapz(y, x) calculates the area under a curve using the trapezoidal rule — essential for computing energy absorption from stress-strain data.*`,
      analogy: 'Toughness is like the total "damage budget" of a material. A tough material can absorb a lot of punishment before failing. A glass is strong but NOT tough — it takes high force to break but absorbs almost no energy in the process (it snaps). The casque is tough — it absorbs enormous energy per gram through gradual crushing.',
      storyConnection: 'The hornbill headbutts repeatedly throughout its life. Each impact must stay within the casque\'s toughness budget. If total impacts exceeded the casque\'s capacity, the bird would suffer brain damage. Evolution sized the casque\'s toughness to exceed a lifetime of territorial combat.',
      checkQuestion: 'Is diamond a good material for helmets? It is the hardest material known.',
      checkAnswer: 'Terrible choice. Diamond is extremely hard and stiff but has very low toughness — it shatters (brittle fracture) rather than deforming. A diamond helmet would transmit the full impact force to the skull and then shatter into sharp fragments. Hardness and toughness are different properties. Helmets need toughness (energy absorption through deformation), not hardness (resistance to scratching).',
      codeIntro: 'Create a toughness comparison chart for biological and synthetic impact materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material property database
materials = {
    'Hornbill casque':    {'strength': 0.8,  'max_strain': 0.75, 'density': 285,  'category': 'biological'},
    'Woodpecker sponge':  {'strength': 0.6,  'max_strain': 0.70, 'density': 400,  'category': 'biological'},
    'Antler (trabecular)':{'strength': 3.0,  'max_strain': 0.30, 'density': 900,  'category': 'biological'},
    'EPS (helmet foam)':  {'strength': 0.5,  'max_strain': 0.65, 'density': 80,   'category': 'synthetic'},
    'EPP foam':           {'strength': 0.8,  'max_strain': 0.60, 'density': 120,  'category': 'synthetic'},
    'Aluminum honeycomb': {'strength': 1.5,  'max_strain': 0.70, 'density': 50,   'category': 'synthetic'},
    'D3O smart foam':     {'strength': 1.2,  'max_strain': 0.55, 'density': 450,  'category': 'synthetic'},
    'Kevlar composite':   {'strength': 50.0, 'max_strain': 0.04, 'density': 1440, 'category': 'synthetic'},
    'Mild steel':         {'strength': 250,  'max_strain': 0.25, 'density': 7800, 'category': 'synthetic'},
}

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Calculate toughness and specific toughness
results = []
for name, props in materials.items():
    toughness = props['strength'] * props['max_strain'] * 0.8  # approximate
    specific_toughness = toughness / (props['density'] / 1000)  # MJ/m³ per kg/m³ × 1000 = kJ/kg
    results.append((name, props['strength'], props['max_strain'], toughness,
                    specific_toughness, props['density'], props['category']))

# Sort by specific toughness
results.sort(key=lambda x: -x[4])

# Plot 1: Toughness (strength × strain)
bio = [(r[0], r[3]) for r in results if r[6] == 'biological']
syn = [(r[0], r[3]) for r in results if r[6] == 'synthetic']

names = [r[0] for r in results]
toughness_vals = [r[3] for r in results]
colors = ['#10b981' if r[6] == 'biological' else '#60a5fa' for r in results]
axes[0].barh(range(len(names)), toughness_vals, color=colors, edgecolor='white', linewidth=0.5)
axes[0].set_yticks(range(len(names)))
axes[0].set_yticklabels(names, fontsize=8)
axes[0].set_xlabel('Toughness (MJ/m³)', color='white', fontsize=10)
axes[0].set_title('Volumetric Toughness', color='white', fontsize=12, fontweight='bold')

# Plot 2: Specific toughness (per kg)
specific = [r[4] for r in results]
axes[1].barh(range(len(names)), specific, color=colors, edgecolor='white', linewidth=0.5)
axes[1].set_yticks(range(len(names)))
axes[1].set_yticklabels(names, fontsize=8)
axes[1].set_xlabel('Specific Toughness (kJ/kg)', color='white', fontsize=10)
axes[1].set_title('Toughness per Unit Mass', color='white', fontsize=12, fontweight='bold')

# Plot 3: Strength vs Strain (Ashby-style)
for r in results:
    c = '#10b981' if r[6] == 'biological' else '#60a5fa'
    axes[2].scatter(r[2]*100, r[1], s=r[5]/5+20, color=c, edgecolors='white',
                   linewidths=1, alpha=0.8)
    axes[2].annotate(r[0], (r[2]*100, r[1]), textcoords="offset points",
                    xytext=(5, 5), color='white', fontsize=7)

axes[2].set_xlabel('Maximum Strain (%)', color='white', fontsize=10)
axes[2].set_ylabel('Plateau Strength (MPa)', color='white', fontsize=10)
axes[2].set_title('Strength vs Ductility (size=density)', color='white', fontsize=12, fontweight='bold')
axes[2].set_yscale('log')

plt.suptitle('Material Toughness Comparison: Biological vs Synthetic', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

print("\
Ranking by Specific Toughness (energy per kg):")
for i, r in enumerate(results, 1):
    marker = " ***" if 'Hornbill' in r[0] else ""
    print(f"  {i}. {r[0]:25s} | {r[4]:>6.1f} kJ/kg | {r[5]:>5.0f} kg/m³ | {r[6]}{marker}")`,
      challenge: 'Add the pomelo peel (strength ~0.3 MPa, strain ~80%, density 300 kg/m³) and abalone shell (strength ~200 MPa, strain ~1%, density 2600 kg/m³). How do they compare? Which is better for impact protection?',
      successHint: 'The Ashby-style material property chart reveals that biological materials often occupy unique regions that synthetic materials have not yet reached. The hornbill casque achieves an exceptional combination of low density, high strain, and moderate strength.',
    },
    {
      title: 'Impact velocity vs survivability — the critical threshold',
      concept: `For any protective system, there is a **critical velocity** above which it fails:

**v_critical = sqrt(2 × E_absorbed / m)**

Where E_absorbed = total energy the protector can absorb before densification.

Below v_critical: the protector absorbs all kinetic energy — survivable.
Above v_critical: the protector is fully crushed, remaining energy transmits to the occupant — dangerous.

The critical velocity depends on:
- Material toughness (energy per volume)
- Thickness (volume of material)
- Area (contact surface)

📚 *matplotlib's plt.fill_between() can shade different regions based on conditions, using the where parameter.*`,
      analogy: 'Think of a car hitting a wall at different speeds. At 10 km/h, the bumper absorbs everything — you feel a gentle push. At 30 km/h, the crumple zone absorbs everything — you feel a jolt but survive. At 100 km/h, the crumple zone is fully used up and the remaining energy crushes the passenger compartment — fatal. The critical speed is the boundary between "crumple zone handles it" and "crumple zone is overwhelmed."',
      storyConnection: 'The hornbill casque evolved to handle the speeds of aerial territorial combat (~40 km/h). At this speed, the casque has sufficient thickness and toughness to absorb the full impact. If hornbills flew faster (like peregrine falcons at 300+ km/h), the casque would be overwhelmed and the bird would suffer brain damage.',
      checkQuestion: 'If you double the thickness of a helmet, does the critical velocity double?',
      checkAnswer: 'No. Critical velocity goes as the square root of absorbed energy, and energy scales linearly with thickness. So doubling thickness increases critical velocity by sqrt(2) ≈ 1.41×, not 2×. To double the critical velocity, you need 4× the thickness (since KE = ½mv² scales with v²). This diminishing return is why very thick helmets are impractical — each additional millimeter gives less benefit.',
      codeIntro: 'Plot survivability curves for different protective systems as a function of impact velocity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

velocities = np.linspace(0, 30, 300)  # m/s

def survivability(v, v_critical, steepness=5):
    """Sigmoid survival probability curve."""
    return 100 / (1 + np.exp(steepness * (v - v_critical)))

# Different protective systems
systems = [
    ('Hornbill casque (15mm)', 0.3, 0.015, 0.03, 0.6, '#10b981'),
    ('Bicycle helmet (25mm)', 5.0, 0.025, 0.04, 0.325, '#60a5fa'),
    ('Motorcycle helmet (35mm)', 5.0, 0.035, 0.04, 0.45, '#f59e0b'),
    ('Car crumple zone (600mm)', 80.0, 0.60, 0.15, 1.2, '#a78bfa'),
    ('No protection', 5.0, 0.001, 0.001, 0.0005, '#f87171'),
]

fig, axes = plt.subplots(1, 2, figsize=(13, 5.5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

print("Critical Velocity Analysis")
print("=" * 65)
print(f"{'System':>30} | {'Thickness':>9} | {'v_crit':>8} | {'v_crit km/h':>11}")
print("-" * 65)

for name, mass, thickness, area, toughness_MJ_m3, color in systems:
    # Energy capacity = toughness × volume
    volume = thickness * area  # m³
    E_max = toughness_MJ_m3 * 1e6 * volume  # Joules
    v_crit = np.sqrt(2 * E_max / mass) if E_max > 0 else 0.5

    survival = survivability(velocities, v_crit)

    axes[0].plot(velocities * 3.6, survival, color=color, linewidth=2.5, label=name)
    axes[0].axvline(x=v_crit * 3.6, color=color, linestyle=':', alpha=0.3)

    # KE vs capacity
    KE = 0.5 * mass * velocities**2
    axes[1].plot(velocities * 3.6, KE, color=color, linewidth=2, label=name)
    axes[1].axhline(y=E_max, color=color, linestyle='--', alpha=0.5)

    print(f"  {name:>28} | {thickness*1000:>6.0f} mm | {v_crit:>6.1f} m/s | {v_crit*3.6:>8.1f} km/h")

axes[0].set_xlabel('Impact Velocity (km/h)', color='white', fontsize=11)
axes[0].set_ylabel('Survival Probability (%)', color='white', fontsize=11)
axes[0].set_title('Survivability vs Impact Speed', color='white', fontsize=13, fontweight='bold')
axes[0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[0].set_xlim(0, 100)

axes[1].set_xlabel('Impact Velocity (km/h)', color='white', fontsize=11)
axes[1].set_ylabel('Kinetic Energy (J)', color='white', fontsize=11)
axes[1].set_title('KE vs Absorption Capacity', color='white', fontsize=13, fontweight='bold')
axes[1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[1].set_yscale('log')
axes[1].set_xlim(0, 100)

plt.suptitle('Impact Protection: Critical Velocity Thresholds', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()`,
      challenge: 'Design a helmet for e-scooter riders (head mass 5 kg, typical crash speed 25 km/h). What minimum thickness of EPS foam is needed for 95% survival probability?',
      successHint: 'The critical velocity concept ties together all impact engineering: material properties, geometry, and physics determine the speed threshold between safe and dangerous. Every protective device has this limit.',
    },
    {
      title: 'Gradient structures — why the casque is not uniform',
      concept: `The hornbill casque is not a single material — it has a **gradient structure**:

- **Outer layer**: dense, hard bone (high stiffness, distributes load)
- **Middle layer**: medium-density cellular bone (moderate energy absorption)
- **Inner layer**: very porous, low-density bone (maximum energy absorption)
- **Inner surface**: thin dense layer (prevents core from touching skull)

This gradient is NOT random — it is optimized by evolution:
1. Hard outside distributes the impact over a large area
2. Progressively softer inside absorbs energy gradually
3. Force transmitted to the skull is minimized

Modern helmet designs now mimic this gradient structure: hard polycarbonate shell → EPS foam → comfort padding.

📚 *numpy's np.gradient() calculates numerical derivatives. We can also create gradient arrays with np.linspace() to model material property variation.*`,
      analogy: 'A gradient structure is like a security system with multiple layers: a solid gate (hard outer shell) stops casual intrusion, an alarm system (medium foam) handles moderate threats, and a safe room (soft core) protects the most valuable contents from the worst scenarios. Each layer handles a different severity of threat.',
      storyConnection: 'When Naga artisans craft traditional hornbill-inspired headgear, they intuitively use layered construction — a hard outer surface decorated with hornbill feathers, a woven middle layer, and soft padding inside. This traditional design principle matches the hornbill casque\'s gradient architecture.',
      checkQuestion: 'Would it be better to put the soft material on the outside and the hard material inside?',
      checkAnswer: 'No. If the soft material is outside, it deforms immediately on contact, concentrating the impact on a small area (like pushing a stick into foam — it pokes through). The hard outer layer is essential for distributing the impact force over the entire surface before the soft core absorbs it. Think of a hard-boiled egg vs a soft-boiled egg: the hard shell distributes force, the soft interior absorbs it. Reverse them and protection fails.',
      codeIntro: 'Model and visualize the gradient structure of the hornbill casque.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model casque as layers from outer to inner surface
n_layers = 100
position = np.linspace(0, 15, n_layers)  # mm from outer surface

# Property gradient through the casque
# Dense outside, porous inside
density = 1800 - 1500 * (1 - np.exp(-position / 3))  # kg/m³
stiffness = 15000 - 14000 * (1 - np.exp(-position / 4))  # MPa
porosity = 1 - density / 1900  # fraction air

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Density profile
axes[0,0].fill_between(position, density, alpha=0.3, color='#10b981')
axes[0,0].plot(position, density, color='#10b981', linewidth=2.5)
axes[0,0].set_xlabel('Depth from outer surface (mm)', color='white', fontsize=10)
axes[0,0].set_ylabel('Density (kg/m³)', color='white', fontsize=10)
axes[0,0].set_title('Density Gradient', color='white', fontsize=12, fontweight='bold')

# Stiffness profile
axes[0,1].fill_between(position, stiffness, alpha=0.3, color='#f59e0b')
axes[0,1].plot(position, stiffness, color='#f59e0b', linewidth=2.5)
axes[0,1].set_xlabel('Depth (mm)', color='white', fontsize=10)
axes[0,1].set_ylabel('Stiffness (MPa)', color='white', fontsize=10)
axes[0,1].set_title('Stiffness Gradient', color='white', fontsize=12, fontweight='bold')

# Cross-section visualization
ax_cross = axes[1,0]
y_layers = np.linspace(0, 15, 50)
for i in range(len(y_layers)-1):
    depth = y_layers[i]
    d = 1800 - 1500 * (1 - np.exp(-depth / 3))
    gray_val = d / 1900
    ax_cross.fill_between([0, 40], y_layers[i], y_layers[i+1],
                          color=plt.cm.YlGn(gray_val), alpha=0.9)
# Labels
ax_cross.text(20, 1, 'Dense outer shell', ha='center', color='black', fontsize=9, fontweight='bold')
ax_cross.text(20, 5, 'Transition zone', ha='center', color='white', fontsize=9)
ax_cross.text(20, 10, 'Porous cellular core', ha='center', color='white', fontsize=9)
ax_cross.text(20, 14, 'Inner membrane', ha='center', color='white', fontsize=8)
ax_cross.set_xlim(0, 40)
ax_cross.set_ylabel('Depth (mm)', color='white', fontsize=10)
ax_cross.set_title('Cross-Section (outer → inner)', color='white', fontsize=12, fontweight='bold')
ax_cross.set_xticks([])
ax_cross.invert_yaxis()

# Energy absorption per layer
crush_energy = np.zeros(n_layers)
for i in range(n_layers):
    # Energy ∝ plateau stress × available strain
    plateau_stress = stiffness[i] * 0.01  # roughly 1% of stiffness
    max_strain = porosity[i] * 0.9  # can crush to 90% of pore space
    crush_energy[i] = plateau_stress * max_strain  # MJ/m³ (simplified)

axes[1,1].fill_between(position, crush_energy, alpha=0.3, color='#a78bfa')
axes[1,1].plot(position, crush_energy, color='#a78bfa', linewidth=2.5)
axes[1,1].set_xlabel('Depth from outer surface (mm)', color='white', fontsize=10)
axes[1,1].set_ylabel('Energy Absorption Capacity', color='white', fontsize=10)
axes[1,1].set_title('Energy Absorption by Layer', color='white', fontsize=12, fontweight='bold')

plt.suptitle('Hornbill Casque: Gradient Structure Analysis', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

total_energy = np.trapz(crush_energy, position / 1000)
print(f"Total energy absorption capacity: {total_energy:.2f} MJ/m³ × depth")
print(f"Outer shell (0-2mm): hard, distributes impact load")
print(f"Core (2-12mm): porous, absorbs {np.trapz(crush_energy[13:80], position[13:80]/1000)/total_energy*100:.0f}% of energy")
print(f"Inner membrane (12-15mm): prevents core collapse onto skull")`,
      challenge: 'Design an optimized gradient: instead of the natural exponential gradient, try a linear gradient and a step-function (3 discrete layers). Which absorbs the most energy? Is the natural gradient actually optimal?',
      successHint: 'The gradient structure is one of the most important design principles from the hornbill casque. Modern helmet standards are beginning to require gradient construction, moving away from uniform foam.',
    },
    {
      title: 'Repeated impact performance — fatigue and degradation',
      concept: `The hornbill casque must survive not just ONE impact but **hundreds** over the bird's lifetime. Each impact causes micro-damage that accumulates:

- **Impact 1**: some cells crush, energy absorbed, casque slightly compressed
- **Impact 10**: more cells damaged, total crush distance increases
- **Impact 100**: significant degradation, energy absorption capacity reduced

This is **fatigue damage** — the gradual weakening of a material under repeated loading.

The casque counteracts fatigue through:
1. **Biological remodeling**: osteocytes (bone cells) repair micro-cracks
2. **Redundant cells**: millions of cells, so losing some is tolerable
3. **Progressive crush zones**: different cells crush at different impacts

📚 *matplotlib can show multiple lines with a color gradient using a colormap, revealing how a property changes over many cycles.*`,
      analogy: 'Fatigue is like wearing a path through a carpet. One footstep does nothing visible. A thousand footsteps wear a faint trail. Ten thousand footsteps wear a deep groove. Each step is fine individually, but they accumulate. The casque similarly accumulates micro-damage, but unlike a carpet, it can partially repair itself between fights.',
      storyConnection: 'Hornbills are long-lived birds (up to 50 years). The casque must function reliably for decades of territorial combat. This durability requirement is more demanding than most human protective equipment, which is replaced after a single impact.',
      checkQuestion: 'Why are motorcycle helmets single-use (must be replaced after one impact) while the hornbill casque handles hundreds of impacts?',
      checkAnswer: 'EPS foam (in helmets) absorbs energy through permanent plastic deformation — once crushed, it cannot uncrush. The energy absorption capacity is permanently reduced. Bone in the casque also crushes, but osteocytes remodel and repair the micro-damage over days to weeks. The biological material self-heals; the synthetic material does not. This is why biomimetics researchers are developing self-healing foams — to achieve the hornbill\'s repeated-impact capability.',
      codeIntro: 'Simulate how the casque\'s protection degrades over multiple impacts and recovers through healing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_casque_life(n_impacts, healing_rate=0.02, impact_severity=0.05):
    """Simulate casque degradation and healing over many impacts."""
    capacity = 1.0  # normalized energy absorption capacity
    history = [capacity]
    healed = [0]
    damaged = [0]

    for i in range(n_impacts):
        # Impact damage (random severity)
        damage = np.random.exponential(impact_severity)
        damage = min(damage, capacity * 0.3)  # single impact max 30% capacity loss
        capacity -= damage
        capacity = max(capacity, 0.1)  # minimum 10% capacity

        # Healing between impacts (time-dependent)
        time_between = np.random.exponential(7)  # days between fights
        healing = healing_rate * time_between * (1 - capacity)  # heals toward 100%
        capacity += healing
        capacity = min(capacity, 1.0)

        history.append(capacity)
        healed.append(healing)
        damaged.append(damage)

    return np.array(history), np.array(healed), np.array(damaged)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Scenario 1: Normal hornbill (with healing)
n = 200
cap_normal, heal_n, dam_n = simulate_casque_life(n, healing_rate=0.02, impact_severity=0.05)
axes[0,0].plot(cap_normal * 100, color='#10b981', linewidth=2, label='With biological healing')

# Compare: synthetic helmet (no healing)
cap_synthetic = [1.0]
for i in range(n):
    damage = np.random.exponential(0.05)
    cap_synthetic.append(max(0.1, cap_synthetic[-1] - damage))
axes[0,0].plot(np.array(cap_synthetic) * 100, color='#f87171', linewidth=2, label='Synthetic (no healing)')

axes[0,0].axhline(y=50, color='white', linestyle=':', alpha=0.3, label='50% threshold')
axes[0,0].set_xlabel('Impact Number', color='white', fontsize=10)
axes[0,0].set_ylabel('Protection Capacity (%)', color='white', fontsize=10)
axes[0,0].set_title('Capacity Over Lifetime', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Different healing rates
healing_rates = [0.0, 0.01, 0.02, 0.05, 0.10]
h_colors = ['#f87171', '#f59e0b', '#10b981', '#60a5fa', '#a78bfa']
for rate, color in zip(healing_rates, h_colors):
    cap, _, _ = simulate_casque_life(300, healing_rate=rate)
    axes[0,1].plot(cap * 100, color=color, linewidth=1.5, alpha=0.8,
                   label=f'Heal rate: {rate}')

axes[0,1].set_xlabel('Impact Number', color='white', fontsize=10)
axes[0,1].set_ylabel('Capacity (%)', color='white', fontsize=10)
axes[0,1].set_title('Effect of Healing Rate', color='white', fontsize=12, fontweight='bold')
axes[0,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Impact severity distribution
severities = np.random.exponential(0.05, 1000)
axes[1,0].hist(severities * 100, bins=40, color='#f59e0b', alpha=0.7, edgecolor='white', linewidth=0.5)
axes[1,0].set_xlabel('Impact Severity (% capacity loss)', color='white', fontsize=10)
axes[1,0].set_ylabel('Frequency', color='white', fontsize=10)
axes[1,0].set_title('Impact Severity Distribution', color='white', fontsize=12, fontweight='bold')

# Lifetime analysis: how many impacts before replacement needed?
n_trials = 500
lifetimes_bio = []
lifetimes_syn = []
for _ in range(n_trials):
    cap, _, _ = simulate_casque_life(500, healing_rate=0.02)
    below_50 = np.where(cap < 0.5)[0]
    lifetimes_bio.append(below_50[0] if len(below_50) > 0 else 500)

    cap_s = [1.0]
    for i in range(500):
        cap_s.append(max(0, cap_s[-1] - np.random.exponential(0.05)))
    cap_s = np.array(cap_s)
    below_50_s = np.where(cap_s < 0.5)[0]
    lifetimes_syn.append(below_50_s[0] if len(below_50_s) > 0 else 500)

axes[1,1].hist(lifetimes_bio, bins=30, alpha=0.6, color='#10b981', label=f'Biological (median: {np.median(lifetimes_bio):.0f})', edgecolor='white', linewidth=0.5)
axes[1,1].hist(lifetimes_syn, bins=30, alpha=0.6, color='#f87171', label=f'Synthetic (median: {np.median(lifetimes_syn):.0f})', edgecolor='white', linewidth=0.5)
axes[1,1].set_xlabel('Impacts Until 50% Capacity', color='white', fontsize=10)
axes[1,1].set_ylabel('Frequency', color='white', fontsize=10)
axes[1,1].set_title('Lifetime Distribution', color='white', fontsize=12, fontweight='bold')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

plt.suptitle('Repeated Impact: Biological vs Synthetic Performance', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print(f"Biological casque median lifetime: {np.median(lifetimes_bio):.0f} impacts")
print(f"Synthetic foam median lifetime: {np.median(lifetimes_syn):.0f} impacts")
print(f"Self-healing extends useful life by {np.median(lifetimes_bio)/np.median(lifetimes_syn):.1f}x")`,
      challenge: 'Model an "aging" hornbill where healing rate decreases with age (from 0.03 at age 5 to 0.005 at age 40). At what age does the casque become dangerously degraded? Does this match observed behavior changes in old hornbills?',
      successHint: 'Self-healing is the ultimate engineering advantage of biological materials. Achieving even partial self-healing in synthetic materials is one of the most active areas of materials science research, directly inspired by structures like the hornbill casque.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualizing Impact Engineering</span>
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
