import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PaperUmbrellaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Paper science — from wood pulp to writing surface',
      concept: `Paper is one of humanity's most important inventions. It is made from **cellulose fibers** — the structural molecule of plant cell walls. The process:

1. **Pulping**: wood is broken down into individual fibers. Chemical pulping (using NaOH/Na₂S) dissolves lignin; mechanical pulping grinds wood.
2. **Beating**: fibers are mechanically processed to increase surface area and bonding ability.
3. **Sheet forming**: dilute fiber suspension is spread on a screen; water drains, fibers mat together.
4. **Pressing and drying**: removes remaining water, hydrogen bonds form between fibers.

Key properties:
- **Tensile strength**: how hard to pull apart (depends on fiber length and bonding)
- **Porosity**: how many gaps between fibers (affects water absorption)
- **Basis weight**: mass per unit area (g/m² — "gsm")
- **Smoothness**: affects printability and feel

Sualkuchi, famous for Assam's silk, also has a tradition of handmade paper from local plants. Traditional paper from bamboo, cotton rags, or tree bark uses the same cellulose chemistry as modern paper mills — just at a smaller scale.`,
      analogy: 'Making paper is like making felt from wool. You take individual fibers (cellulose instead of wool), mix them in water, spread them flat, press out the water, and let them dry into a mat. The fibers tangle and bond together through hydrogen bonds (paper) or mechanical entanglement (felt). Both are non-woven fabrics made from short fibers.',
      storyConnection: 'The paper umbrella from Sualkuchi had to be both strong enough to hold its shape AND waterproof enough to repel rain. This dual requirement drove the engineering — the paper provided structure, while oils and lacquers provided waterproofing. Two problems, two materials, one elegant solution.',
      checkQuestion: 'Paper gets weak when wet. Why, if it is made from cellulose — the same molecule that makes wood strong even in rain?',
      checkAnswer: 'In wood, cellulose fibers are embedded in lignin (a waterproof polymer) and arranged in an organized crystalline structure. In paper, fibers are held together by hydrogen bonds between cellulose chains. Water molecules compete for these hydrogen bonds, inserting themselves between fibers and breaking the fiber-to-fiber connections. Wood has lignin as backup glue; paper does not. This is why waterproofing is essential for a paper umbrella.',
      codeIntro: 'Model the tensile strength of paper as a function of fiber properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Paper strength model
# Tensile strength depends on: fiber length, fiber strength, bonding area

def paper_strength(fiber_length, fiber_strength, bonding_fraction, basis_weight):
    """Simplified paper tensile strength model (Page equation)."""
    # Page equation: 1/T = 1/(fiber_strength * basis_weight) + 1/(bonding * L * basis_weight)
    fiber_term = fiber_strength * basis_weight / 1000
    bond_term = bonding_fraction * fiber_length * basis_weight / 50
    if bond_term == 0:
        return 0
    return 1 / (1/fiber_term + 1/bond_term)

# Vary fiber length
lengths = np.linspace(0.5, 5, 100)  # mm
strengths_length = [paper_strength(l, 100, 0.5, 80) for l in lengths]

# Vary bonding
bondings = np.linspace(0.1, 0.9, 100)
strengths_bond = [paper_strength(2, 100, b, 80) for b in bondings]

# Vary basis weight
weights = np.linspace(20, 200, 100)
strengths_weight = [paper_strength(2, 100, 0.5, w) for w in weights]

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))
fig.patch.set_facecolor('#1f2937')

params = [
    (lengths, strengths_length, 'Fiber length (mm)', '#22c55e'),
    (bondings, strengths_bond, 'Bonding fraction', '#3b82f6'),
    (weights, strengths_weight, 'Basis weight (g/m²)', '#f59e0b'),
]

for ax, (x, y, xlabel, color) in zip(axes, params):
    ax.set_facecolor('#111827')
    ax.plot(x, y, color=color, linewidth=2)
    ax.fill_between(x, 0, y, alpha=0.1, color=color)
    ax.set_xlabel(xlabel, color='white')
    ax.set_ylabel('Tensile strength (kN/m)', color='white')
    ax.tick_params(colors='gray')

axes[0].set_title('Longer fibers = stronger paper', color='white', fontsize=10)
axes[1].set_title('Better bonding = stronger paper', color='white', fontsize=10)
axes[2].set_title('Heavier paper = stronger (but diminishing)', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Paper strength depends on three key factors:")
print("  1. Fiber length — longer fibers overlap more, creating more bonds")
print("  2. Bonding fraction — how well fibers stick to each other")
print("  3. Basis weight — more fibers per area = more strength")
print()
print("Traditional Sualkuchi paper uses long bamboo fibers (~3mm)")
print("Modern office paper uses short wood fibers (~1mm)")
print("Bamboo paper is inherently stronger per unit weight.")`,
      challenge: 'If you double the fiber length from 1mm to 2mm, how much does strength increase? Is the improvement linear? Why does strength eventually plateau as fibers get longer?',
      successHint: 'The Page equation connects material properties to paper performance. Understanding it helps engineers design papers for specific applications — from tissue paper (weak, soft) to cardboard (strong, rigid) to umbrella paper (strong, flexible, water-resistant).',
    },
    {
      title: 'Waterproofing — the science of keeping water out',
      concept: `A paper umbrella must repel water. **Waterproofing** involves manipulating how water interacts with surfaces. The key concept is **contact angle** — the angle a water droplet makes with a surface:

- **Hydrophilic** (water-loving): contact angle < 90°. Water spreads out. Clean glass, untreated paper.
- **Hydrophobic** (water-fearing): contact angle > 90°. Water beads up. Wax, oil, some polymers.
- **Superhydrophobic**: contact angle > 150°. Water rolls off. Lotus leaf, treated nanostructured surfaces.

Traditional waterproofing methods:
- **Oil/wax impregnation**: fills paper pores, creates hydrophobic surface. Used for millennia.
- **Lacquer coating**: creates a hard, waterproof shell. Japanese wagasa umbrellas use persimmon tannin lacquer.
- **Tung oil**: penetrates fibers and polymerizes (cross-links), creating a durable waterproof matrix.

The contact angle depends on two things:
1. **Surface chemistry**: low-energy molecules (wax, oil, fluoropolymers) repel water
2. **Surface texture**: microscopic roughness amplifies hydrophobicity (Cassie-Baxter state)

The lotus leaf combines both: waxy chemistry + microscopic bumps → superhydrophobic, self-cleaning surface.`,
      analogy: 'Waterproofing is like choosing between a sponge and a rubber ball. The sponge (untreated paper) absorbs water because it has pores and hydrophilic surfaces. The rubber ball (waterproofed paper) repels water because its surface chemistry and smoothness prevent water from entering. Coating paper with oil is like wrapping the sponge in a rubber skin.',
      storyConnection: 'The paper umbrella\'s magic was in its waterproofing — oil or lacquer that turned absorbent paper into a rain shield. Without this treatment, the first raindrop would destroy it. The waterproofing was the engineering that made art functional.',
      checkQuestion: 'A Gore-Tex jacket is both waterproof and breathable. How is this possible if waterproof means blocking water?',
      checkAnswer: 'Gore-Tex has microscopic pores that are too small for liquid water droplets to pass through but large enough for water vapor (individual molecules) to escape. Liquid water molecules cluster into droplets ~100 micrometers across; water vapor molecules are ~0.0003 micrometers. The pores are ~0.2 micrometers — between these two sizes. This is size-selective filtration, and it works because of the enormous size difference between liquid and gas-phase water.',
      codeIntro: 'Simulate water droplet contact angles on different surfaces.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Contact angle simulation
def draw_droplet(ax, contact_angle, surface_name, color):
    """Draw a water droplet at a given contact angle on a surface."""
    theta = np.radians(contact_angle)

    if contact_angle < 180:
        # Droplet geometry: circular arc
        R = 1.0 / np.sin(theta)  # radius of curvature
        center_y = R * np.cos(theta)

        # Arc from -base_half to +base_half
        base_half = R * np.sin(theta) if theta < np.pi else 1.0
        t = np.linspace(-np.arcsin(min(base_half/R, 1)), np.arcsin(min(base_half/R, 1)), 100)
        x = R * np.sin(t)
        y = R * np.cos(t) - center_y + 0.001

        # Only show part above surface
        mask = y >= 0
        if np.any(mask):
            ax.fill(np.concatenate([x[mask], [x[mask][-1], x[mask][0]]]),
                    np.concatenate([y[mask], [0, 0]]),
                    color='#3b82f6', alpha=0.6)
            ax.plot(x[mask], y[mask], color='#60a5fa', linewidth=2)

    # Surface
    ax.axhline(0, color=color, linewidth=3)
    ax.fill_between([-2, 2], -0.3, 0, color=color, alpha=0.3)

    # Contact angle arc
    if contact_angle < 150:
        arc_r = 0.3
        arc_t = np.linspace(0, np.radians(contact_angle), 30)
        ax.plot(base_half - arc_r * np.cos(arc_t) if contact_angle < 90 else -base_half + arc_r * np.cos(arc_t),
               arc_r * np.sin(arc_t), color='#f59e0b', linewidth=1.5)

    ax.text(0, -0.5, f'{surface_name}\\n(θ = {contact_angle}°)', ha='center',
           color='white', fontsize=10, fontweight='bold')
    ax.set_xlim(-2, 2)
    ax.set_ylim(-0.8, 2)
    ax.set_aspect('equal')
    ax.axis('off')

surfaces = [
    (30, 'Untreated paper', '#854d0e'),
    (75, 'Oiled paper', '#f59e0b'),
    (110, 'Waxed paper', '#22c55e'),
    (155, 'Lotus leaf', '#3b82f6'),
]

fig, axes = plt.subplots(1, 4, figsize=(14, 3.5))
fig.patch.set_facecolor('#1f2937')

for ax, (angle, name, color) in zip(axes, surfaces):
    ax.set_facecolor('#1f2937')
    draw_droplet(ax, angle, name, color)

plt.suptitle('Water Contact Angle on Different Surfaces', color='white', fontsize=13, y=1.05)
plt.tight_layout()
plt.show()

# Waterproofing effectiveness over time
fig2, ax = plt.subplots(figsize=(10, 5))
fig2.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

hours = np.linspace(0, 48, 200)
treatments = {
    'Untreated paper': 30 * np.exp(-hours / 2),  # rapid failure
    'Single oil coat': 75 - 15 * (1 - np.exp(-hours / 12)),
    'Double oil + wax': 110 - 5 * (1 - np.exp(-hours / 24)),
    'Modern polymer': 115 - 2 * (1 - np.exp(-hours / 48)),
}
colors_t = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

for (name, values), color in zip(treatments.items(), colors_t):
    ax.plot(hours, values, color=color, linewidth=2, label=name)

ax.axhline(90, color='gray', linestyle='--', alpha=0.3)
ax.text(40, 92, 'Hydrophobic threshold', color='gray', fontsize=8)
ax.set_xlabel('Hours of rain exposure', color='white')
ax.set_ylabel('Contact angle (degrees)', color='white')
ax.set_title('Waterproofing Durability Over Time', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Waterproofing hierarchy:")
for name, values in treatments.items():
    final = values[-1] if isinstance(values, np.ndarray) else values
    status = "hydrophobic" if final > 90 else "FAILED"
    print(f"  {name}: final angle = {final:.0f}° ({status})")`,
      challenge: 'The lotus effect uses surface roughness to amplify hydrophobicity. If you could add microscopic bumps to oiled paper, estimate how much the contact angle would increase using the Cassie-Baxter equation.',
      successHint: 'Waterproofing technology spans from ancient tung oil to modern PTFE (Teflon) coatings. The same surface chemistry principles apply everywhere — from paper umbrellas to spacecraft heat shields.',
    },
    {
      title: 'Structural engineering — the umbrella as a mechanical system',
      concept: `An umbrella is a **tension structure** — it uses fabric (or paper) in tension, stretched over a frame of ribs in compression. This is the same structural principle as a tent, a parachute, or a bicycle wheel.

Key structural elements:
- **Shaft**: central column, resists bending from wind forces
- **Ribs**: radial members that push the canopy outward (compression)
- **Stretchers**: links between shaft and ribs that control the opening angle
- **Canopy**: paper or fabric in tension between ribs
- **Tip**: joint at the top that distributes force from shaft to ribs

Structural analysis:
- Wind force on umbrella: F = ½ρv²CdA (same as drag equation)
- At 30 km/h wind, a 1m diameter umbrella experiences ~15 N (about 1.5 kg force)
- This force must be resisted by the shaft and ribs
- The canopy transmits wind force to ribs as tension
- Ribs transmit force to shaft as compression

The paper umbrella of Sualkuchi uses bamboo ribs — bamboo has excellent strength-to-weight ratio (comparable to steel per unit mass) and natural flexibility that absorbs wind gusts rather than breaking.`,
      analogy: 'An umbrella is like a satellite dish: a curved surface (canopy/dish) supported by a central mast (shaft) and radiating ribs. Both must resist forces (wind/gravity) while maintaining their shape. The design distributes concentrated forces into distributed loads — the fundamental principle of structural engineering.',
      storyConnection: 'The paper umbrella combined art and engineering. The bamboo frame provided strength and flexibility; the oiled paper provided a waterproof canopy. Each element was optimized for its role — tension in the paper, compression in the ribs, flexibility in the joints. It was a complete structural system.',
      checkQuestion: 'Why do umbrellas flip inside out in strong wind instead of just bending?',
      checkAnswer: 'The canopy acts like a sail. Wind creates higher pressure on the underside and lower pressure on top (Bernoulli effect). This upward force exceeds the downward force of the ribs. Once the canopy starts to invert, the ribs — designed for downward loads — buckle under the reversed force direction. The ribs are in tension instead of compression, and since they are designed for compression (rigid, straight), they cannot resist the reversal. This is a classic buckling failure.',
      codeIntro: 'Calculate wind forces on an umbrella and the stresses in its structural elements.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wind force on an umbrella
rho = 1.225  # air density kg/m³
Cd = 1.3  # drag coefficient for concave surface
diameter = 1.0  # meters
area = np.pi * (diameter/2)**2

# Wind speed range
wind_speeds = np.linspace(0, 100, 200)  # km/h
wind_ms = wind_speeds / 3.6  # convert to m/s
force = 0.5 * rho * wind_ms**2 * Cd * area  # Newtons

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Wind force
ax1.set_facecolor('#111827')
ax1.plot(wind_speeds, force, color='#ef4444', linewidth=2)
ax1.fill_between(wind_speeds, 0, force, alpha=0.1, color='#ef4444')

# Mark wind categories
categories = [(20, 'Light breeze'), (40, 'Moderate wind'), (60, 'Strong wind'),
              (80, 'Gale'), (100, 'Storm')]
for speed, name in categories:
    f = 0.5 * rho * (speed/3.6)**2 * Cd * area
    ax1.plot(speed, f, 'o', color='#f59e0b', markersize=6)
    ax1.annotate(f'{name}\\n{f:.0f}N', xy=(speed, f), xytext=(speed-10, f+5),
                color='#f59e0b', fontsize=8)

ax1.set_xlabel('Wind speed (km/h)', color='white')
ax1.set_ylabel('Force on umbrella (N)', color='white')
ax1.set_title('Wind Force vs Speed', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Stress in ribs
ax2.set_facecolor('#111827')
n_ribs = np.arange(4, 16)
wind_force = 0.5 * rho * (40/3.6)**2 * Cd * area  # 40 km/h wind

# Force per rib (assuming equal distribution)
force_per_rib = wind_force / n_ribs

# Rib cross-section (bamboo: 5mm diameter hollow tube)
rib_diameter = 5e-3  # m
rib_area = np.pi * rib_diameter**2 / 4  # simplified solid
stress = force_per_rib / rib_area / 1e6  # MPa

# Bamboo strength ~100 MPa
bamboo_strength = 100

ax2.plot(n_ribs, stress, 'o-', color='#22c55e', linewidth=2, label='Stress in each rib')
ax2.axhline(bamboo_strength, color='#ef4444', linestyle='--', label=f'Bamboo strength ({bamboo_strength} MPa)')
ax2.fill_between(n_ribs, stress, bamboo_strength, where=stress < bamboo_strength,
                alpha=0.1, color='#22c55e', label='Safe zone')
ax2.fill_between(n_ribs, stress, bamboo_strength, where=stress > bamboo_strength,
                alpha=0.1, color='#ef4444', label='Failure zone')

ax2.set_xlabel('Number of ribs', color='white')
ax2.set_ylabel('Stress per rib (MPa)', color='white')
ax2.set_title(f'Rib Stress at 40 km/h Wind', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

min_ribs = n_ribs[stress < bamboo_strength][0] if np.any(stress < bamboo_strength) else 'N/A'
print(f"At 40 km/h wind ({wind_force:.1f}N total force):")
print(f"  Minimum ribs needed: {min_ribs} (for bamboo)")
print(f"  Traditional umbrellas use 8-12 ribs")
print(f"  8 ribs: {wind_force/8:.1f}N per rib, stress={wind_force/8/rib_area/1e6:.0f} MPa")`,
      challenge: 'Modern umbrellas use fiberglass ribs instead of bamboo or steel. Fiberglass has a tensile strength of ~500 MPa. How many fewer ribs could you use compared to bamboo?',
      successHint: 'Every umbrella you open is a lesson in structural engineering — tension, compression, drag, and material properties all working together. The paper umbrella of Sualkuchi solved these engineering problems with bamboo and oiled paper centuries ago.',
    },
    {
      title: 'Material properties — comparing paper, fabric, and polymers',
      concept: `The paper umbrella maker must choose materials wisely. Each material has different **mechanical properties** that determine its suitability:

- **Tensile strength**: resistance to being pulled apart (paper: 30-80 MPa; silk: 500 MPa; nylon: 75 MPa)
- **Elastic modulus**: stiffness — resistance to stretching (paper: 2-8 GPa; silk: 10 GPa; nylon: 2.5 GPa)
- **Elongation at break**: how much it stretches before snapping (paper: 1-6%; silk: 15-30%; nylon: 15-30%)
- **Tear resistance**: how easily a small cut propagates into a tear
- **Water absorption**: how much water the material absorbs (paper: 50-300%; silk: 30%; nylon: 4%)

**Stress-strain curves** reveal a material's complete mechanical behavior:
- Initial linear region: elastic (returns to original shape)
- Yield point: permanent deformation begins
- Ultimate strength: maximum stress before failure
- Fracture: material breaks

Paper has high stiffness but low elongation — it is rigid but brittle. Fabric has lower stiffness but high elongation — it is flexible and tough. This trade-off determines why fabric replaced paper in modern umbrellas.`,
      analogy: 'Material properties are like personality traits. Paper is strong but inflexible — like someone who is competent but cannot adapt. Silk is strong AND flexible — like an adaptable expert. Nylon is a good all-rounder — competent, adaptable, and affordable. Each has a role, and the best material depends on the job.',
      storyConnection: 'The Sualkuchi umbrella makers chose paper because it was available, affordable, and — with oil treatment — waterproof. They worked within their material constraints, optimizing what they had. Modern engineering does the same: the "best" material is not the strongest but the one that best matches the application requirements.',
      checkQuestion: 'Kevlar is 5× stronger than steel per unit weight. Why don\'t we make umbrellas from Kevlar?',
      checkAnswer: 'Cost and overkill. Kevlar costs ~$30/kg vs paper at ~$0.5/kg. An umbrella only needs to survive light wind and rain — not bullets. Engineering is about matching material properties to requirements, not using the strongest possible material. Using Kevlar for an umbrella is like using a tank for a grocery run — technically effective but absurdly wasteful.',
      codeIntro: 'Generate and compare stress-strain curves for paper, silk, and nylon.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stress-strain curves for different materials
def stress_strain(E, yield_stress, ultimate_stress, elongation_at_break, n_points=200):
    """Generate a simplified stress-strain curve."""
    # Elastic region
    yield_strain = yield_stress / E
    elastic_strain = np.linspace(0, yield_strain, n_points // 3)
    elastic_stress = E * elastic_strain

    # Plastic region (hardening)
    plastic_strain = np.linspace(yield_strain, elongation_at_break * 0.7, n_points // 3)
    plastic_stress = yield_stress + (ultimate_stress - yield_stress) * \
                    (1 - np.exp(-5 * (plastic_strain - yield_strain) / elongation_at_break))

    # Failure region (necking)
    fail_strain = np.linspace(elongation_at_break * 0.7, elongation_at_break, n_points // 3)
    fail_stress = plastic_stress[-1] * np.exp(-3 * (fail_strain - fail_strain[0]) / (fail_strain[-1] - fail_strain[0]))

    return (np.concatenate([elastic_strain, plastic_strain, fail_strain]),
            np.concatenate([elastic_stress, plastic_stress, fail_stress]))

materials = {
    'Handmade paper': {'E': 3000, 'yield': 20, 'ultimate': 40, 'elongation': 0.03, 'color': '#854d0e'},
    'Oiled paper': {'E': 2500, 'yield': 25, 'ultimate': 45, 'elongation': 0.05, 'color': '#f59e0b'},
    'Silk': {'E': 10000, 'yield': 200, 'ultimate': 500, 'elongation': 0.20, 'color': '#a855f7'},
    'Nylon': {'E': 2500, 'yield': 50, 'ultimate': 75, 'elongation': 0.30, 'color': '#3b82f6'},
    'Polyester': {'E': 3000, 'yield': 55, 'ultimate': 80, 'elongation': 0.25, 'color': '#22c55e'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Stress-strain curves
ax1.set_facecolor('#111827')
for name, props in materials.items():
    strain, stress = stress_strain(props['E'], props['yield'], props['ultimate'], props['elongation'])
    ax1.plot(strain * 100, stress, color=props['color'], linewidth=2, label=name)

ax1.set_xlabel('Strain (%)', color='white')
ax1.set_ylabel('Stress (MPa)', color='white')
ax1.set_title('Stress-Strain Curves: Umbrella Materials', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Property comparison radar chart
ax2 = fig.add_subplot(122, polar=True)
ax2.set_facecolor('#111827')

categories = ['Strength', 'Flexibility', 'Water\\nresistance', 'Cost', 'Durability']
n_cats = len(categories)
angles = np.linspace(0, 2 * np.pi, n_cats, endpoint=False).tolist()
angles += angles[:1]

radar_data = {
    'Handmade paper': [3, 2, 3, 9, 3],
    'Oiled paper': [3, 3, 7, 8, 5],
    'Silk': [9, 8, 5, 2, 7],
    'Nylon': [6, 8, 8, 7, 9],
}

for name, values in radar_data.items():
    values += values[:1]
    ax2.plot(angles, values, 'o-', linewidth=1.5, label=name,
            color=materials[name]['color'] if name in materials else '#22c55e')
    ax2.fill(angles, values, alpha=0.05, color=materials[name]['color'] if name in materials else '#22c55e')

ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(categories, color='white', fontsize=8)
ax2.set_ylim(0, 10)
ax2.set_yticks([2, 4, 6, 8])
ax2.set_yticklabels(['2', '4', '6', '8'], color='gray', fontsize=7)
ax2.legend(loc='upper right', bbox_to_anchor=(1.4, 1.1), facecolor='#1f2937', labelcolor='white', fontsize=7)
ax2.set_title('Material Trade-offs', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("Material comparison for umbrella canopy:")
print(f"{'Material':<18} {'Strength':>10} {'Elongation':>12} {'Water resist':>14}")
print("-" * 56)
for name, props in materials.items():
    water_resist = 'Good' if 'oil' in name.lower() or name in ['Nylon', 'Polyester'] else 'Poor' if 'paper' in name.lower() else 'Moderate'
    print(f"{name:<18} {props['ultimate']:>8} MPa {props['elongation']*100:>10.0f}% {water_resist:>14}")`,
      challenge: 'A new biodegradable polymer has: strength 60 MPa, elongation 20%, water resistance 7/10, cost 6/10. Add it to both plots. Could it replace nylon in eco-friendly umbrellas?',
      successHint: 'Material selection is at the heart of all engineering. The paper umbrella makers of Sualkuchi were material scientists — choosing, treating, and combining materials to achieve the best possible performance from locally available resources.',
    },
    {
      title: 'The geometry of rain protection — optimizing umbrella shape',
      concept: `What is the ideal shape for an umbrella? The answer involves **geometry**, **aerodynamics**, and **coverage optimization**.

Key geometric considerations:
- **Coverage area**: a circle of radius r protects πr² area. But rain falls at an angle in wind, reducing effective coverage.
- **Height**: the canopy must be high enough to clear the user's head but low enough to maximize lateral coverage.
- **Curvature**: a deeper dome sheds water better (rain runs off) but catches more wind.
- **Asymmetry**: some umbrellas are designed asymmetric to protect against wind-driven rain from one direction.

Rain protection in wind:
- In still air, rain falls vertically → umbrella directly overhead gives full protection
- In wind, rain approaches at an angle: θ = arctan(v_wind / v_rain)
- At 20 km/h wind and 7 m/s rain speed: θ = arctan(5.6/7) = 39° from vertical
- The "shadow" of protection shifts and narrows

The effective protected area in windy rain:
A_eff = A_umbrella × cos(θ)

At 39° angle, effective coverage drops to cos(39°) ≈ 77% of the umbrella area. In strong wind, you get wet no matter how big the umbrella.`,
      analogy: 'An umbrella in wind is like a sundial in angled light. At noon (no wind), the shadow is directly below, perfectly round. As the sun angles (wind increases), the shadow elongates, shifts, and gets smaller. The umbrella\'s "rain shadow" behaves exactly like a light shadow — because rain drops follow straight-line trajectories, just like light rays.',
      storyConnection: 'The paper umbrella makers understood intuitively what geometry confirms: in heavy monsoon rain with wind, no umbrella is perfect. The umbrella is a compromise — optimizing coverage, wind resistance, portability, and waterproofing. The Sualkuchi design balanced these trade-offs for Assam\'s specific rain conditions.',
      checkQuestion: 'Why are golf umbrellas much larger than regular umbrellas?',
      checkAnswer: 'Golf is played in open fields with no shelter. Golfers need to protect not just themselves but their equipment (bag, clubs). The larger area compensates for wind-driven rain angle, providing better coverage even when rain is not falling vertically. The trade-off: larger umbrellas catch more wind force (F ∝ A), so they need stronger frames. Golf umbrellas use fiberglass ribs and vented canopies to handle the increased wind load.',
      codeIntro: 'Model rain protection coverage as a function of wind speed and umbrella geometry.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Rain protection model
# Rain falls at angle theta = arctan(v_wind / v_rain)

v_rain = 7.0  # m/s (terminal velocity of typical raindrop)
umbrella_radius = 0.5  # meters
umbrella_height = 1.8  # meters above ground (carried overhead)

wind_speeds = np.linspace(0, 30, 100)  # km/h
wind_ms = wind_speeds / 3.6
rain_angles = np.arctan(wind_ms / v_rain)  # radians

# Effective coverage at ground level
# The "shadow" of the umbrella shifts by h * tan(theta)
shadow_shift = umbrella_height * np.tan(rain_angles)  # meters
effective_coverage = np.pi * umbrella_radius**2 * np.cos(rain_angles)

# What fraction of a person (0.4m radius circle) is protected?
person_radius = 0.4
person_area = np.pi * person_radius**2

# Overlap of shifted umbrella shadow with person
# Simplified: if shift > umbrella_radius - person_radius, partial coverage
protection_fraction = np.clip(1 - shadow_shift / (umbrella_radius + person_radius), 0, 1)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.5))
fig.patch.set_facecolor('#1f2937')

# Coverage vs wind speed
ax1.set_facecolor('#111827')
ax1.plot(wind_speeds, protection_fraction * 100, color='#3b82f6', linewidth=2, label='Standard (r=0.5m)')

# Compare umbrella sizes
for r, color, name in [(0.3, '#ef4444', 'Compact (r=0.3m)'),
                        (0.5, '#3b82f6', 'Standard (r=0.5m)'),
                        (0.7, '#22c55e', 'Golf (r=0.7m)')]:
    shift = umbrella_height * np.tan(rain_angles)
    prot = np.clip(1 - shift / (r + person_radius), 0, 1)
    ax1.plot(wind_speeds, prot * 100, color=color, linewidth=2, label=name)

ax1.set_xlabel('Wind speed (km/h)', color='white')
ax1.set_ylabel('Body protection (%)', color='white')
ax1.set_title('Rain Protection vs Wind Speed', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 105)

# Geometric visualization at different wind speeds
ax2.set_facecolor('#111827')
# Show top-down view of umbrella shadow at different wind speeds
for i, (ws, color) in enumerate([(0, '#22c55e'), (10, '#3b82f6'),
                                   (20, '#f59e0b'), (30, '#ef4444')]):
    ws_ms = ws / 3.6
    angle = np.arctan(ws_ms / v_rain)
    shift_x = umbrella_height * np.tan(angle)

    # Umbrella shadow (ellipse due to projection)
    theta = np.linspace(0, 2*np.pi, 100)
    x_shadow = umbrella_radius * np.cos(theta) + shift_x
    y_shadow = umbrella_radius * np.sin(theta)

    ax2.fill(x_shadow, y_shadow + i*2.5, alpha=0.2, color=color)
    ax2.plot(x_shadow, y_shadow + i*2.5, color=color, linewidth=1.5)

    # Person position
    x_person = person_radius * np.cos(theta)
    y_person = person_radius * np.sin(theta)
    ax2.plot(x_person, y_person + i*2.5, '--', color='white', linewidth=1, alpha=0.5)

    ax2.text(-1.5, i*2.5, f'{ws} km/h\\nwind', color=color, fontsize=9, ha='right')

ax2.set_title('Rain Shadow (top view) at Different Wind Speeds', color='white', fontsize=11)
ax2.set_aspect('equal')
ax2.set_xlim(-2, 3)
ax2.axis('off')
ax2.text(2, 9, '--- = person position', color='gray', fontsize=8)

plt.tight_layout()
plt.show()

print("Wind speed → rain angle → protection:")
for ws in [0, 10, 20, 30]:
    ws_ms = ws / 3.6
    angle = np.degrees(np.arctan(ws_ms / v_rain))
    shift = umbrella_height * np.tan(np.radians(angle))
    prot = max(0, 1 - shift / (umbrella_radius + person_radius)) * 100
    print(f"  {ws:>3} km/h wind → rain at {angle:.0f}° from vertical → {prot:.0f}% protected")`,
      challenge: 'Design an asymmetric umbrella that extends 0.8m forward (into the wind) and 0.3m backward. How does it compare to a symmetric 0.5m radius umbrella in 15 km/h wind?',
      successHint: 'The geometry of rain protection connects trigonometry, fluid dynamics, and practical design. Every umbrella is a solved geometry problem — optimizing coverage given constraints of size, weight, wind, and portability.',
    },
    {
      title: 'Biomimicry — learning waterproofing from nature',
      concept: `Nature has solved the waterproofing problem millions of times. Engineers study these solutions — **biomimicry** — to create better materials.

Natural waterproofing examples:
- **Lotus leaf** (superhydrophobic): waxy surface + microscopic bumps → water rolls off carrying dirt. Inspired self-cleaning glass and paint.
- **Duck feathers**: barbs interlock creating a mesh coated with preen oil. Traps air for insulation AND repels water.
- **Namib beetle**: alternating hydrophilic/hydrophobic patches on its back. Fog condenses on hydrophilic spots, rolls to hydrophobic channels, and flows to its mouth. Inspired fog-collection systems.
- **Shark skin**: microscopic tooth-like structures (denticles) reduce drag and prevent biofouling. Inspired swimsuits and ship coatings.
- **Springtail insect**: skin has a mushroom-shaped nanostructure that repels oil AND water. This is the holy grail of surface engineering.

For paper umbrellas: the traditional oil coating mimics the waxy cuticle of leaves. Modern research on nanostructured paper coatings is directly inspired by the lotus effect. The ancient umbrella maker and the modern nanotechnologist are solving the same problem — keeping water out.`,
      analogy: 'Biomimicry is like cheating on nature\'s test — except it is encouraged. Nature has had 3.8 billion years to test solutions. We have had a few centuries. Rather than starting from scratch, we look at what already works (lotus leaf) and copy the design principles (microscopic texture + low-energy surface) into our own materials.',
      storyConnection: 'The paper umbrella from Sualkuchi was already biomimetic — oiling paper mimics the waxy cuticle of leaves. Traditional craftspeople were the first biomimetic engineers, observing nature and applying its solutions with available materials. Modern biomimicry formalizes this ancient practice.',
      checkQuestion: 'The Namib beetle lives in one of the driest deserts on Earth yet collects enough water to survive from morning fog. Could this principle provide drinking water in other desert regions?',
      checkAnswer: 'Yes, and it already does. Fog nets inspired by the Namib beetle (and similar organisms) are deployed in Chile, Morocco, and Oman. They use mesh surfaces with alternating hydrophilic (fog-catching) and hydrophobic (water-channeling) zones. A single fog net can collect 200-1,000 liters per day. This biomimetic technology provides water to communities that have no other freshwater source — all inspired by a beetle.',
      codeIntro: 'Simulate the lotus effect showing how surface texture amplifies hydrophobicity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lotus effect: Wenzel and Cassie-Baxter models
# How surface roughness affects contact angle

# Young's equation (flat surface): cos(theta_Y) = (gamma_SV - gamma_SL) / gamma_LV
# Wenzel (rough, wetted): cos(theta_W) = r * cos(theta_Y), r = roughness ratio (>1)
# Cassie-Baxter (rough, air trapped): cos(theta_CB) = f * cos(theta_Y) + f - 1

# Intrinsic contact angle of the material
theta_Y_range = np.linspace(60, 120, 100)  # degrees

# Roughness parameters
r = 2.5  # Wenzel roughness ratio
f = 0.15  # Cassie-Baxter solid fraction (fraction touching water)

# Wenzel model
theta_W = np.degrees(np.arccos(np.clip(r * np.cos(np.radians(theta_Y_range)), -1, 1)))

# Cassie-Baxter model
theta_CB = np.degrees(np.arccos(np.clip(
    f * np.cos(np.radians(theta_Y_range)) + f - 1, -1, 1)))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.5))
fig.patch.set_facecolor('#1f2937')

# Contact angle comparison
ax1.set_facecolor('#111827')
ax1.plot(theta_Y_range, theta_Y_range, '--', color='gray', linewidth=1, label='Flat surface (Young)')
ax1.plot(theta_Y_range, theta_W, color='#3b82f6', linewidth=2, label=f'Wenzel (r={r})')
ax1.plot(theta_Y_range, theta_CB, color='#22c55e', linewidth=2, label=f'Cassie-Baxter (f={f})')

ax1.axhline(150, color='#f59e0b', linestyle=':', alpha=0.5)
ax1.text(65, 152, 'Superhydrophobic threshold (150°)', color='#f59e0b', fontsize=8)
ax1.axhline(90, color='#ef4444', linestyle=':', alpha=0.5)
ax1.text(65, 92, 'Hydrophobic threshold (90°)', color='#ef4444', fontsize=8)

ax1.set_xlabel('Intrinsic contact angle (flat surface, °)', color='white')
ax1.set_ylabel('Apparent contact angle (textured surface, °)', color='white')
ax1.set_title('Surface Texture Amplifies Hydrophobicity', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Biomimicry examples
ax2.set_facecolor('#111827')
examples = {
    'Plain paper': {'angle': 40, 'color': '#854d0e'},
    'Oiled paper\\n(traditional)': {'angle': 95, 'color': '#f59e0b'},
    'Waxed surface': {'angle': 110, 'color': '#22c55e'},
    'Lotus-inspired\\nnano coating': {'angle': 160, 'color': '#3b82f6'},
    'Actual lotus\\nleaf': {'angle': 164, 'color': '#a855f7'},
}

names = list(examples.keys())
angles = [examples[n]['angle'] for n in names]
colors_bar = [examples[n]['color'] for n in names]

bars = ax2.barh(names, angles, color=colors_bar, alpha=0.8)
ax2.axvline(90, color='#ef4444', linestyle='--', linewidth=1)
ax2.axvline(150, color='#f59e0b', linestyle='--', linewidth=1)
ax2.set_xlabel('Contact angle (degrees)', color='white')
ax2.set_title('From Traditional to Bio-inspired', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Labels
for bar, angle in zip(bars, angles):
    ax2.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
            f'{angle}°', va='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Biomimicry progress:")
print("  Plain paper → oiled paper: +55° (ancient technology)")
print("  Oiled paper → waxed: +15° (chemical improvement)")
print("  Waxed → lotus-inspired: +50° (nanotechnology)")
print()
print("The lotus leaf achieves 164° through structure, not chemistry.")
print("Copying that structure onto paper creates superhydrophobic paper.")
print("Nature's solution is 100 million years old; we copied it in 2003.")`,
      challenge: 'The springtail insect repels both water AND oil (omniphobic). Its surface has mushroom-shaped pillars. Research why mushroom shapes work better than cylindrical pillars for omniphobicity.',
      successHint: 'From tung oil to nanotechnology, waterproofing has evolved by copying nature more precisely. The paper umbrella of Sualkuchi was the beginning; lotus-inspired nanocoatings are the current frontier. In both cases, the teacher was the same: nature itself.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior engineering experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for paper engineering simulations. Click to start.</p>
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
