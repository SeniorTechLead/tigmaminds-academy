import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PaperUmbrellaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Cellulose structure — the molecular backbone of paper',
      concept: `Cellulose is a linear polysaccharide made of glucose monomers linked by β-1,4-glycosidic bonds. Each glucose unit (C₆H₁₀O₅) is rotated 180° relative to its neighbor, creating a flat ribbon structure. These ribbons hydrogen-bond to each other, forming microfibrils — bundles of 30-40 cellulose chains with crystalline and amorphous regions.

The degree of polymerization (DP) — the number of glucose units in a chain — determines many paper properties. Native wood cellulose has DP ~10,000, but pulping reduces this to 500-2000. Higher DP means longer fibers, more inter-fiber bonding sites, and stronger paper. The crystallinity index (CI) measures the fraction of cellulose in ordered crystalline form versus disordered amorphous form. Higher crystallinity means stiffer, less flexible paper.

Paper is essentially a mat of entangled cellulose fibers bonded by hydrogen bonds at fiber crossings. The number of hydrogen bonds per unit area determines tensile strength. Each OH group on a glucose unit can form up to three hydrogen bonds with neighboring fibers. When paper gets wet, water molecules compete for these H-bond sites, breaking inter-fiber bonds — this is why wet paper loses 90% of its dry strength.`,
      analogy: 'Think of cellulose fibers like a bowl of spaghetti that has been partially dried. The individual strands (fibers) overlap and stick to each other at crossing points (hydrogen bonds). Freshly cooked spaghetti is slippery (wet paper — weak bonds), but once it dries, the strands fuse together at their contact points (dry paper — strong hydrogen bonds). The longer the spaghetti strands (higher DP), the more crossing points and the stronger the mat.',
      storyConnection: 'The paper umbrella maker in the story works with sheets of handmade paper, selecting the right thickness and fiber quality for each umbrella panel. The strength of each panel depends on the cellulose fiber length and how tightly the fibers are bonded — the molecular engineering that determines whether the umbrella survives Assam\'s monsoon or collapses in the first rain.',
      checkQuestion: 'Paper A has DP = 1500 and crystallinity index of 0.70. Paper B has DP = 800 and CI = 0.45. Which paper is stronger when dry? Which is more flexible? What happens to each when submerged in water?',
      checkAnswer: 'Paper A is stronger when dry — longer chains (DP 1500) create more fiber entanglements and more hydrogen bonding sites. Higher crystallinity (0.70) also means more ordered, stiffer structure. Paper B is more flexible — shorter chains and lower crystallinity (more amorphous regions) allow fibers to slide and bend. When wet, both lose ~90% strength as water breaks H-bonds, but Paper B degrades faster because its shorter fibers have fewer total bonds to begin with.',
      codeIntro: 'Model the relationship between cellulose chain length, crystallinity, and paper mechanical properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Cellulose and paper properties model
def paper_tensile_strength(DP, crystallinity, moisture_content):
    """Estimate tensile strength (MPa) from molecular properties."""
    # Base strength scales with log(DP) — diminishing returns for very long chains
    dp_factor = np.log10(DP) / np.log10(10000)  # normalized to native cellulose
    # Crystallinity increases stiffness and strength
    ci_factor = 0.3 + 0.7 * crystallinity
    # Moisture destroys hydrogen bonds exponentially
    moisture_factor = np.exp(-5.0 * moisture_content)
    # Base tensile strength of ideal paper ~100 MPa
    return 100 * dp_factor * ci_factor * moisture_factor

def paper_flexibility(DP, crystallinity):
    """Flexibility index (0-1, higher = more flexible)."""
    # Short chains and low crystallinity = more flexible
    dp_flex = np.exp(-DP / 3000)
    ci_flex = 1 - crystallinity
    return 0.5 * (dp_flex + ci_flex)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Tensile strength vs DP at different crystallinities
ax = axes[0, 0]
ax.set_facecolor('#111827')
dp_range = np.linspace(200, 5000, 200)
for ci, color, label in [(0.4, '#ef4444', 'CI = 0.40 (amorphous)'),
                          (0.6, '#f59e0b', 'CI = 0.60 (mixed)'),
                          (0.8, '#22c55e', 'CI = 0.80 (crystalline)')]:
    strengths = [paper_tensile_strength(dp, ci, 0.0) for dp in dp_range]
    ax.plot(dp_range, strengths, color=color, linewidth=2, label=label)
ax.set_xlabel('Degree of polymerization (DP)', color='white')
ax.set_ylabel('Tensile strength (MPa)', color='white')
ax.set_title('Paper Strength vs Cellulose Chain Length', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.axvline(1000, color='gray', linestyle='--', linewidth=0.5, alpha=0.5)
ax.text(1050, 20, 'Typical\
paper pulp', color='gray', fontsize=8)

# Plot 2: Strength vs moisture content
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
moisture_range = np.linspace(0, 0.5, 200)
for dp, color, label in [(500, '#ef4444', 'DP = 500 (short fiber)'),
                          (1500, '#3b82f6', 'DP = 1500 (medium)'),
                          (3000, '#22c55e', 'DP = 3000 (long fiber)')]:
    strengths = [paper_tensile_strength(dp, 0.65, m) for m in moisture_range]
    ax2.plot(moisture_range * 100, strengths, color=color, linewidth=2, label=label)
ax2.axvline(10, color='#fbbf24', linestyle='--', linewidth=1, label='Ambient humidity (~10%)')
ax2.set_xlabel('Moisture content (%)', color='white')
ax2.set_ylabel('Tensile strength (MPa)', color='white')
ax2.set_title('Moisture Destroys Paper Strength', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Flexibility vs strength trade-off
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
n_samples = 200
dps = np.random.uniform(300, 4000, n_samples)
cis = np.random.uniform(0.3, 0.9, n_samples)
flex_vals = [paper_flexibility(dp, ci) for dp, ci in zip(dps, cis)]
str_vals = [paper_tensile_strength(dp, ci, 0.0) for dp, ci in zip(dps, cis)]
scatter = ax3.scatter(flex_vals, str_vals, c=cis, cmap='coolwarm', s=30, alpha=0.7, edgecolors='white', linewidths=0.3)
cbar = plt.colorbar(scatter, ax=ax3)
cbar.set_label('Crystallinity index', color='white')
cbar.ax.tick_params(colors='gray')
ax3.set_xlabel('Flexibility index', color='white')
ax3.set_ylabel('Tensile strength (MPa)', color='white')
ax3.set_title('Strength-Flexibility Trade-off', color='white', fontsize=12, fontweight='bold')
ax3.tick_params(colors='gray')
# Annotate regions
ax3.annotate('Umbrella\
sweet spot', xy=(0.4, 55), fontsize=10, color='#fbbf24',
             ha='center', fontweight='bold')

# Plot 4: Hydrogen bond density model
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
fiber_lengths = np.linspace(0.5, 5.0, 200)  # mm
# More crossings per unit area with longer fibers
crossings_per_area = 50 * fiber_lengths**1.5  # arbitrary units
hbonds_per_crossing = 12  # typical for cellulose
total_hbonds = crossings_per_area * hbonds_per_crossing
ax4.plot(fiber_lengths, total_hbonds, color='#3b82f6', linewidth=2.5)
ax4.fill_between(fiber_lengths, total_hbonds, alpha=0.15, color='#3b82f6')
ax4.set_xlabel('Average fiber length (mm)', color='white')
ax4.set_ylabel('H-bonds per cm² (×10³)', color='white')
ax4.set_title('Fiber Length → Hydrogen Bond Density', color='white', fontsize=12, fontweight='bold')
ax4.tick_params(colors='gray')
ax4.axvline(2.5, color='#fbbf24', linestyle='--', linewidth=1)
ax4.text(2.6, max(total_hbonds)*0.3, 'Typical handmade\
paper fiber', color='#fbbf24', fontsize=9)

plt.tight_layout()
plt.show()

print("=" * 60)
print("    CELLULOSE & PAPER STRENGTH MODEL")
print("=" * 60)
print(f"\
Key relationships:")
print(f"  Tensile strength ∝ log(DP) × crystallinity × exp(-5 × moisture)")
print(f"  At DP=1500, CI=0.65, dry: {paper_tensile_strength(1500, 0.65, 0):.1f} MPa")
print(f"  Same paper at 10% moisture: {paper_tensile_strength(1500, 0.65, 0.10):.1f} MPa")
print(f"  Same paper at 30% moisture: {paper_tensile_strength(1500, 0.65, 0.30):.1f} MPa")
print(f"\
Water reduces strength by {(1 - paper_tensile_strength(1500,0.65,0.30)/paper_tensile_strength(1500,0.65,0)):.0%} at 30% moisture")
print(f"This is why waterproofing is essential for paper umbrellas!")`,
      challenge: 'Add a fifth plot showing how fiber orientation (random vs aligned) affects tensile strength anisotropy. Model aligned fibers as having 3x strength along the alignment direction but only 0.3x perpendicular to it.',
      successHint: 'You have modeled the molecular basis of paper strength — every sheet of paper is a network of hydrogen bonds between cellulose chains. Understanding this lets you predict how to engineer paper for specific applications like umbrella panels.',
    },
    {
      title: 'Contact angle and surface energy — the physics of waterproofing',
      concept: `When a water droplet sits on a surface, the angle between the droplet edge and the surface is the contact angle (θ). This angle is governed by Young's equation: cos(θ) = (γSV - γSL) / γLV, where γSV is the solid-vapor surface energy, γSL is solid-liquid, and γLV is liquid-vapor surface tension (72.8 mN/m for water at 20°C).

Hydrophilic surfaces (paper, glass) have high surface energy — water spreads easily, θ < 90°. Hydrophobic surfaces (wax, oil) have low surface energy — water beads up, θ > 90°. Superhydrophobic surfaces (lotus leaf) have θ > 150° and rely on both low surface energy AND surface roughness (the Cassie-Baxter state, where air pockets beneath the droplet reduce contact area).

For paper umbrella waterproofing, the traditional method uses tung oil or lacquer. These create a hydrophobic coating (θ ≈ 95-110°) by lowering surface energy. The oil fills the pores between cellulose fibers and coats fiber surfaces, converting hydrophilic cellulose (θ ≈ 30°) to a water-repellent surface. Modern approaches use silicone or fluoropolymer treatments that can achieve θ > 130° without changing paper flexibility.`,
      analogy: 'Imagine rolling a marble across different surfaces. On a sticky surface (high surface energy), the marble quickly slows and stops — this is like water spreading on untreated paper. On a polished, waxed surface (low surface energy), the marble rolls freely and stays round — this is like water beading on an oiled umbrella. On a surface covered with tiny bumps (superhydrophobic), the marble barely touches the surface at all — it rides on the tips of the bumps with air underneath.',
      storyConnection: 'The umbrella maker in the story applies tung oil to the paper panels, transforming fragile paper into a waterproof canopy. This ancient technique is pure surface chemistry — changing the contact angle from 30° (hydrophilic cellulose) to 100°+ (hydrophobic coating). The maker knows instinctively how many coats are needed, but the physics explains exactly why: each coat lowers surface energy and fills pores.',
      checkQuestion: 'Untreated paper has contact angle θ = 30° and surface energy γSV = 55 mN/m. After one coat of tung oil, θ = 85° and γSV = 32 mN/m. After two coats, θ = 105° and γSV = 22 mN/m. Why does the second coat produce a bigger jump in contact angle than the first?',
      checkAnswer: 'The relationship between surface energy and contact angle is nonlinear (cosine function). From Young\'s equation, cos(θ) varies linearly with γSV, but θ itself changes more rapidly near 90°. First coat: θ goes from 30° to 85° (55° change) for a 23 mN/m energy drop. Second coat: θ goes from 85° to 105° (20° angular change) for only 10 mN/m drop. But the critical threshold is 90° — below 90° water still spreads; above 90° water beads and rolls off. The second coat crosses this threshold, making the qualitative difference between "water-resistant" and "waterproof."',
      codeIntro: 'Model contact angles, surface energy, and the waterproofing transition from hydrophilic to hydrophobic.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Surface energy and contact angle physics
gamma_LV = 72.8e-3  # N/m, water surface tension at 20°C

def contact_angle_from_energy(gamma_SV, gamma_SL):
    """Young's equation: cos(theta) = (gamma_SV - gamma_SL) / gamma_LV"""
    cos_theta = (gamma_SV - gamma_SL) / gamma_LV
    cos_theta = np.clip(cos_theta, -1, 1)
    return np.degrees(np.arccos(cos_theta))

def droplet_profile(theta_deg, R=1.0, n_points=200):
    """Generate 2D cross-section of a sessile droplet."""
    theta = np.radians(theta_deg)
    # Sphere radius from contact angle and base radius
    if theta_deg < 1:
        return np.array([[-R, R]]), np.array([[0, 0]])
    r_sphere = R / np.sin(theta)
    angles = np.linspace(np.pi - theta, np.pi + theta, n_points)
    x = r_sphere * np.cos(angles)
    y = r_sphere * np.sin(angles) + r_sphere * np.cos(theta)
    return x, y

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Droplet shapes at different contact angles
ax = axes[0, 0]
ax.set_facecolor('#111827')
angles_to_show = [30, 60, 90, 120, 150]
colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6']
labels = ['Paper (30°)', 'Waxed (60°)', 'Threshold (90°)', 'Oiled (120°)', 'Lotus (150°)']
for i, (angle, color, label) in enumerate(zip(angles_to_show, colors, labels)):
    x, y = droplet_profile(angle, R=0.3)
    offset = i * 0.8
    ax.plot(x + offset, y, color=color, linewidth=2)
    ax.fill_between(x + offset, 0, y, alpha=0.3, color=color)
    ax.plot([offset - 0.4, offset + 0.4], [0, 0], color='gray', linewidth=2)
    ax.text(offset, -0.15, f'{angle}°', color=color, ha='center', fontsize=10, fontweight='bold')
    ax.text(offset, max(y) + 0.05, label, color=color, ha='center', fontsize=7)
ax.set_xlim(-0.5, 4.0)
ax.set_ylim(-0.3, 0.8)
ax.set_aspect('equal')
ax.set_title('Water Droplet Contact Angles', color='white', fontsize=12, fontweight='bold')
ax.axis('off')

# Plot 2: Contact angle vs surface energy
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
gamma_SV_range = np.linspace(15e-3, 70e-3, 200)
# Approximate gamma_SL as fraction of gamma_SV
gamma_SL_values = 0.3 * gamma_SV_range  # simplified
theta_values = []
for gsv, gsl in zip(gamma_SV_range, gamma_SL_values):
    theta_values.append(contact_angle_from_energy(gsv, gsl))
theta_values = np.array(theta_values)
ax2.plot(gamma_SV_range * 1000, theta_values, color='#3b82f6', linewidth=2.5)
ax2.axhline(90, color='#fbbf24', linestyle='--', linewidth=1, label='Hydrophobic threshold (90°)')
ax2.fill_between(gamma_SV_range * 1000, theta_values, 90,
                  where=theta_values > 90, alpha=0.2, color='#22c55e', label='Hydrophobic')
ax2.fill_between(gamma_SV_range * 1000, theta_values, 90,
                  where=theta_values < 90, alpha=0.2, color='#ef4444', label='Hydrophilic')
# Mark materials
materials = [('Teflon', 18, '#22c55e'), ('Tung oil', 28, '#3b82f6'),
             ('Wax', 35, '#f59e0b'), ('Paper', 55, '#ef4444')]
for name, gsv, color in materials:
    idx = np.argmin(np.abs(gamma_SV_range * 1000 - gsv))
    ax2.plot(gsv, theta_values[idx], 'o', color=color, markersize=10, zorder=5)
    ax2.annotate(name, (gsv, theta_values[idx]), textcoords='offset points',
                 xytext=(10, 5), color=color, fontsize=9, fontweight='bold')
ax2.set_xlabel('Surface energy (mN/m)', color='white')
ax2.set_ylabel('Contact angle (°)', color='white')
ax2.set_title('Surface Energy → Contact Angle', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Oil coating penetration model
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
coats = np.arange(0, 7)
# Each coat fills pores and lowers surface energy
pore_coverage = 1 - np.exp(-0.8 * coats)  # exponential saturation
surface_energy = 55 - 35 * pore_coverage  # mN/m
contact_angles = []
for se in surface_energy:
    gsl = 0.3 * se * 1e-3
    contact_angles.append(contact_angle_from_energy(se * 1e-3, gsl))
contact_angles = np.array(contact_angles)

ax3_twin = ax3.twinx()
ax3.bar(coats - 0.15, pore_coverage * 100, 0.3, color='#3b82f6', alpha=0.7, label='Pore coverage')
ax3_twin.plot(coats, contact_angles, 'o-', color='#ef4444', linewidth=2, markersize=8, label='Contact angle')
ax3_twin.axhline(90, color='#fbbf24', linestyle='--', linewidth=1)
ax3.set_xlabel('Number of oil coats', color='white')
ax3.set_ylabel('Pore coverage (%)', color='#3b82f6')
ax3_twin.set_ylabel('Contact angle (°)', color='#ef4444')
ax3.set_title('Oil Coating → Waterproofing', color='white', fontsize=12, fontweight='bold')
ax3.tick_params(axis='y', colors='#3b82f6')
ax3_twin.tick_params(axis='y', colors='#ef4444')
ax3.tick_params(axis='x', colors='gray')

# Plot 4: Rain impact simulation
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simulate water absorption over time for different coatings
time_min = np.linspace(0, 60, 200)
untreated = 1 - np.exp(-0.15 * time_min)  # rapid absorption
one_coat = 0.3 * (1 - np.exp(-0.05 * time_min))
two_coats = 0.1 * (1 - np.exp(-0.02 * time_min))
three_coats = 0.03 * (1 - np.exp(-0.01 * time_min))

ax4.plot(time_min, untreated * 100, color='#ef4444', linewidth=2, label='Untreated paper')
ax4.plot(time_min, one_coat * 100, color='#f59e0b', linewidth=2, label='1 coat tung oil')
ax4.plot(time_min, two_coats * 100, color='#3b82f6', linewidth=2, label='2 coats tung oil')
ax4.plot(time_min, three_coats * 100, color='#22c55e', linewidth=2, label='3 coats tung oil')
ax4.axhline(50, color='gray', linestyle=':', linewidth=0.5)
ax4.text(62, 50, 'Structural\
failure', color='gray', fontsize=8)
ax4.set_xlabel('Time in rain (minutes)', color='white')
ax4.set_ylabel('Water absorption (%)', color='white')
ax4.set_title('Rain Resistance by Coating Level', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    WATERPROOFING PHYSICS — CONTACT ANGLE MODEL")
print("=" * 60)
print(f"\
Water surface tension: {gamma_LV*1000:.1f} mN/m")
print(f"\
Material contact angles:")
for name, gsv, _ in materials:
    gsl = 0.3 * gsv * 1e-3
    theta = contact_angle_from_energy(gsv * 1e-3, gsl)
    status = "HYDROPHOBIC" if theta > 90 else "hydrophilic"
    print(f"  {name:<12} γ = {gsv:>3} mN/m  →  θ = {theta:>5.1f}°  ({status})")
print(f"\
Coating analysis:")
for c in range(4):
    print(f"  {c} coats: pore coverage = {(1-np.exp(-0.8*c))*100:.0f}%, θ = {contact_angles[c]:.0f}°")`,
      challenge: 'Model the Cassie-Baxter equation for rough surfaces: cos(θ_CB) = f(1 + cos(θ)) - 1, where f is the solid fraction. Show how adding micro-texture to oiled paper could push contact angle above 150° (superhydrophobic).',
      successHint: 'You have modeled the core physics of waterproofing — the transition from hydrophilic to hydrophobic depends on surface energy, and traditional tung oil treatment works by lowering surface energy and filling pores.',
    },
    {
      title: 'Paper mechanics — stress, strain, and failure modes',
      concept: `Paper is a composite material with complex mechanical behavior. When you pull on a strip of paper (tensile test), the stress-strain curve shows three regimes: (1) elastic region — paper stretches proportionally and returns to original shape (governed by Young's modulus, E ≈ 2-8 GPa for paper); (2) plastic region — permanent deformation begins as fibers slide past each other and hydrogen bonds break; (3) failure — catastrophic tearing when enough bonds are broken.

The key mechanical properties are: tensile strength (maximum stress before failure, 20-80 MPa), elongation at break (strain at failure, 1-6%), tear resistance (energy to propagate a tear, measured in mN), and burst strength (pressure to rupture, measured in kPa). These depend on fiber length, fiber orientation, sheet density, and moisture content.

For umbrella applications, the critical property is tear resistance under cyclic rain impact. Each raindrop exerts a dynamic force: F = m × v / Δt, where a 3mm raindrop at terminal velocity (8 m/s) with impact time ~1ms produces about 0.5 N of force concentrated on a few mm². Over hours of monsoon rain, millions of such impacts create fatigue damage — microscopic fiber breakage that accumulates until macroscopic tearing occurs.`,
      analogy: 'Imagine a woven hammock. When you first sit in it (elastic region), it stretches but springs back when you stand. Add more weight (plastic region), and some threads shift permanently — the hammock sags. Add too much weight (failure), and threads snap, the mesh unravels, and you fall through. Paper under rain impact is the same: each raindrop is a tiny weight, and after millions of impacts, the cumulative fatigue causes failure.',
      storyConnection: 'The umbrella maker tests each umbrella by flicking the paper and listening to the sound — a tight, high-pitched ring means the paper is taut and strong, while a dull thud means it is too loose or too damp. This is an intuitive resonance test: the natural frequency of the paper panel depends on its tensile modulus and thickness, which are the same properties that determine rain resistance.',
      checkQuestion: 'A paper umbrella panel is 0.3 mm thick with tensile strength of 40 MPa. A monsoon raindrop (3mm diameter, 8 m/s) impacts over a 2mm² area in 1 ms. What is the impact stress? How many such impacts could the paper withstand before fatigue failure if each impact causes 0.0001% strength reduction?',
      checkAnswer: 'Raindrop mass ≈ (4/3)π(1.5e-3)³ × 1000 = 1.41×10⁻⁵ kg. Force = mv/Δt = 1.41×10⁻⁵ × 8 / 0.001 = 0.113 N. Stress = F/A = 0.113 / (2×10⁻⁶) = 56,500 Pa = 0.057 MPa. This is only 0.14% of the 40 MPa tensile strength, so a single drop is harmless. But with 0.0001% strength loss per impact, failure occurs after 1,000,000 / 0.0001 × (threshold fraction) impacts. At ~1000 drops/m²/minute in heavy rain, a square meter receives ~60,000 drops/hour — suggesting the paper could last ~17 hours of continuous heavy rain before fatigue failure.',
      codeIntro: 'Model paper stress-strain behavior, raindrop impact forces, and fatigue life under monsoon conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Paper mechanics model
def stress_strain_curve(E_GPa, sigma_yield, sigma_ultimate, strain_break):
    """Generate a realistic paper stress-strain curve."""
    # Elastic region
    strain_yield = sigma_yield / (E_GPa * 1000)  # convert GPa to MPa
    n_elastic = 100
    strain_e = np.linspace(0, strain_yield, n_elastic)
    stress_e = E_GPa * 1000 * strain_e

    # Plastic hardening region
    n_plastic = 100
    strain_p = np.linspace(strain_yield, strain_break, n_plastic)
    # Power-law hardening
    stress_p = sigma_yield + (sigma_ultimate - sigma_yield) * \
               ((strain_p - strain_yield) / (strain_break - strain_yield))**0.6

    return np.concatenate([strain_e, strain_p]), np.concatenate([stress_e, stress_p])

# Raindrop impact model
def raindrop_force(diameter_mm, velocity_ms, impact_time_s=0.001):
    """Calculate raindrop impact force (N)."""
    r = diameter_mm * 1e-3 / 2
    mass = (4/3) * np.pi * r**3 * 1000  # kg
    return mass * velocity_ms / impact_time_s

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Stress-strain curves for different paper types
ax = axes[0, 0]
ax.set_facecolor('#111827')
papers = [
    ('Newsprint', 3.5, 15, 25, 0.015, '#ef4444'),
    ('Kraft paper', 5.0, 30, 50, 0.035, '#f59e0b'),
    ('Handmade (umbrella)', 4.0, 25, 40, 0.025, '#3b82f6'),
    ('Cotton rag', 6.0, 35, 60, 0.045, '#22c55e'),
]
for name, E, sy, su, eb, color in papers:
    strain, stress = stress_strain_curve(E, sy, su, eb)
    ax.plot(strain * 100, stress, color=color, linewidth=2, label=name)
    ax.plot(eb * 100, su, 'x', color=color, markersize=10, markeredgewidth=2)
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Paper Stress-Strain Curves', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Raindrop impact analysis
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
diameters = np.linspace(0.5, 6, 100)  # mm
# Terminal velocity approximation: v ≈ 9.65 - 10.3 * exp(-0.6 * d)
velocities = 9.65 - 10.3 * np.exp(-0.6 * diameters)
forces = [raindrop_force(d, v) for d, v in zip(diameters, velocities)]
forces = np.array(forces)
# Stress on 2mm² impact area
impact_stress = forces / (2e-6) / 1e6  # MPa

ax2_twin = ax2.twinx()
ax2.plot(diameters, forces * 1000, color='#3b82f6', linewidth=2, label='Impact force')
ax2_twin.plot(diameters, impact_stress, color='#ef4444', linewidth=2, label='Impact stress (2mm²)')
ax2_twin.axhline(40, color='#fbbf24', linestyle='--', linewidth=1)
ax2_twin.text(5, 42, 'Paper ultimate\
strength', color='#fbbf24', fontsize=8)
ax2.set_xlabel('Raindrop diameter (mm)', color='white')
ax2.set_ylabel('Impact force (mN)', color='#3b82f6')
ax2_twin.set_ylabel('Impact stress (MPa)', color='#ef4444')
ax2.set_title('Raindrop Impact Force & Stress', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(axis='y', colors='#3b82f6')
ax2_twin.tick_params(axis='y', colors='#ef4444')
ax2.tick_params(axis='x', colors='gray')

# Plot 3: Fatigue life under rain
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
hours = np.linspace(0, 24, 500)
# Different rain intensities (drops per m² per minute)
rain_rates = [
    (200, 'Light rain', '#22c55e'),
    (500, 'Moderate rain', '#f59e0b'),
    (1000, 'Heavy rain', '#ef4444'),
    (2000, 'Monsoon downpour', '#a855f7'),
]
fatigue_rate = 1e-7  # fraction strength loss per impact
for rate, label, color in rain_rates:
    total_impacts = rate * 60 * hours  # per m²
    remaining_strength = 100 * (1 - fatigue_rate * total_impacts)
    remaining_strength = np.maximum(remaining_strength, 0)
    ax3.plot(hours, remaining_strength, color=color, linewidth=2, label=label)
ax3.axhline(50, color='gray', linestyle=':', linewidth=0.5)
ax3.text(0.5, 52, 'Failure threshold', color='gray', fontsize=8)
ax3.set_xlabel('Hours of continuous rain', color='white')
ax3.set_ylabel('Remaining strength (%)', color='white')
ax3.set_title('Paper Fatigue Under Rain Impact', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
ax3.set_ylim(0, 105)

# Plot 4: Optimal paper thickness analysis
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
thickness_mm = np.linspace(0.1, 1.0, 100)
# Strength scales linearly with thickness
strength_score = thickness_mm / 0.5  # normalized at 0.5mm
# Weight increases linearly
weight_score = 1 - (thickness_mm - 0.1) / 0.9  # lighter is better
# Flexibility decreases with thickness
flex_score = np.exp(-2 * (thickness_mm - 0.1))
# Combined score
combined = 0.4 * strength_score + 0.3 * weight_score + 0.3 * flex_score
combined /= combined.max()

ax4.plot(thickness_mm, strength_score / strength_score.max(), color='#ef4444', linewidth=2, label='Strength')
ax4.plot(thickness_mm, weight_score, color='#3b82f6', linewidth=2, label='Lightness')
ax4.plot(thickness_mm, flex_score, color='#22c55e', linewidth=2, label='Flexibility')
ax4.plot(thickness_mm, combined, color='#fbbf24', linewidth=3, label='Overall score', linestyle='--')
best_idx = np.argmax(combined)
ax4.axvline(thickness_mm[best_idx], color='#fbbf24', linestyle=':', linewidth=1)
ax4.plot(thickness_mm[best_idx], combined[best_idx], '*', color='#fbbf24', markersize=15)
ax4.text(thickness_mm[best_idx] + 0.03, combined[best_idx], f'Optimal: {thickness_mm[best_idx]:.2f}mm',
         color='#fbbf24', fontsize=10)
ax4.set_xlabel('Paper thickness (mm)', color='white')
ax4.set_ylabel('Normalized score', color='white')
ax4.set_title('Optimal Umbrella Paper Thickness', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    PAPER MECHANICS — UMBRELLA ENGINEERING")
print("=" * 60)
print(f"\
Optimal paper thickness: {thickness_mm[best_idx]:.2f} mm")
print(f"\
Raindrop impact (3mm drop at 8 m/s):")
f_3mm = raindrop_force(3, 8)
print(f"  Force: {f_3mm*1000:.2f} mN")
print(f"  Stress (2mm² area): {f_3mm/2e-6/1e6:.3f} MPa")
print(f"  Ratio to paper strength: {f_3mm/2e-6/1e6/40*100:.2f}%")
print(f"\
Fatigue life estimates (to 50% strength):")
for rate, label, _ in rain_rates:
    impacts_to_fail = 0.5 / fatigue_rate
    hours_to_fail = impacts_to_fail / (rate * 60)
    print(f"  {label:<20}: {hours_to_fail:.1f} hours")`,
      challenge: 'Model how fiber orientation affects tear propagation direction. Simulate a tear starting at the umbrella edge and show how aligned fibers channel the tear along the fiber direction while random fiber orientation resists tear propagation equally in all directions.',
      successHint: 'You have quantified the engineering challenge of paper umbrellas — balancing strength, weight, and flexibility while surviving thousands of raindrop impacts per minute.',
    },
    {
      title: 'Tung oil chemistry — cross-linking and polymerization',
      concept: `Tung oil (from Vernicia fordii seeds, historically cultivated in Assam) is a drying oil — it polymerizes when exposed to air, forming a hard, waterproof film. The key molecule is α-eleostearic acid (C18:3), which makes up ~80% of tung oil's fatty acids. It has three conjugated double bonds (C=C at positions 9, 11, 13), and this conjugation is what makes tung oil exceptional for waterproofing.

When tung oil is spread on paper and exposed to air, oxygen attacks the double bonds through a free radical chain reaction: (1) Initiation — oxygen abstracts a hydrogen from the allylic position, forming a radical; (2) Propagation — the radical reacts with O₂ to form a peroxy radical, which abstracts H from another chain; (3) Cross-linking — radicals on different chains combine, creating covalent C-C and C-O-C bridges between oil molecules. The result is a three-dimensional polymer network.

The curing rate depends on temperature (Arrhenius kinetics), oxygen availability, and the presence of driers (metal catalysts like cobalt or manganese naphthenate that accelerate radical formation). Full curing takes 1-7 days depending on conditions. The cross-link density determines the final film properties: more cross-links = harder, more water-resistant, but more brittle. There is an optimal cross-link density for umbrella paper — enough for waterproofing but not so much that the paper cracks when folded.`,
      analogy: 'Imagine a room full of children holding hands in a line (uncured oil molecules with double bonds). Now tell them to grab hands with children in other lines wherever they are close (cross-linking). The result is a rigid mesh of connected children that cannot be pulled apart easily. Oxygen is like the teacher giving the signal to grab — without it, the lines stay separate. More signals (catalysts) mean faster mesh formation. Too many connections and the mesh is rigid; too few and it falls apart when pushed.',
      storyConnection: 'The umbrella maker spreads tung oil on each paper panel and leaves them to dry in the sun for days. This is not just evaporation — it is oxidative polymerization. The Assam heat accelerates the cross-linking reaction, and the sun provides both warmth and UV light that helps initiate radical formation. The maker knows that "two days of good sun" produces the best umbrellas — this corresponds to the optimal cross-link density.',
      checkQuestion: 'Tung oil cures 3x faster at 40°C than at 25°C. Using the Arrhenius equation k = A·exp(-Ea/RT), estimate the activation energy. If the umbrella maker speeds up curing by adding 0.1% cobalt drier (which lowers Ea by 20%), how much faster does the oil cure at 25°C?',
      checkAnswer: 'From k₄₀/k₂₅ = 3: ln(3) = (Ea/R)(1/298 - 1/313). Solving: 1.099 = (Ea/8.314)(0.003356 - 0.003195) = (Ea/8.314)(1.61×10⁻⁴). So Ea = 1.099 × 8.314 / 1.61×10⁻⁴ ≈ 56,700 J/mol ≈ 57 kJ/mol. With cobalt drier lowering Ea by 20%: Ea_new = 45.4 kJ/mol. Rate ratio = exp((Ea_old - Ea_new)/(R×298)) = exp((57000-45400)/(8.314×298)) = exp(4.68) ≈ 108. The cobalt drier makes curing ~108x faster at 25°C — reducing cure time from days to under an hour.',
      codeIntro: 'Model the oxidative polymerization kinetics of tung oil and the relationship between curing conditions and film properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tung oil polymerization kinetics
R_gas = 8.314  # J/(mol·K)

def arrhenius_rate(A, Ea, T_celsius):
    """Rate constant from Arrhenius equation."""
    T = T_celsius + 273.15
    return A * np.exp(-Ea / (R_gas * T))

def crosslink_density(time_hours, k, max_density=1.0):
    """Cross-link density over time (logistic growth)."""
    return max_density / (1 + np.exp(-k * (time_hours - 24)))

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Curing progress at different temperatures
ax = axes[0, 0]
ax.set_facecolor('#111827')
Ea = 57000  # J/mol
A = 1e8  # pre-exponential factor
time_h = np.linspace(0, 120, 500)
temps = [15, 25, 35, 45]
colors_t = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for T, color in zip(temps, colors_t):
    k = arrhenius_rate(A, Ea, T) * 0.1
    density = crosslink_density(time_h, k)
    ax.plot(time_h, density * 100, color=color, linewidth=2, label=f'{T}°C')
ax.axhline(70, color='gray', linestyle=':', linewidth=0.5)
ax.text(2, 72, 'Waterproof threshold', color='gray', fontsize=8)
ax.axhline(95, color='gray', linestyle=':', linewidth=0.5)
ax.text(2, 96, 'Brittle threshold', color='gray', fontsize=8)
ax.fill_between(time_h, 70, 95, alpha=0.1, color='#22c55e')
ax.set_xlabel('Curing time (hours)', color='white')
ax.set_ylabel('Cross-link density (%)', color='white')
ax.set_title('Tung Oil Curing vs Temperature', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Cross-link density vs mechanical properties
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
cl_density = np.linspace(0, 1, 200)
hardness = 1 / (1 + np.exp(-8 * (cl_density - 0.5)))  # sigmoid
flexibility = np.exp(-3 * cl_density)
water_resistance = 1 / (1 + np.exp(-10 * (cl_density - 0.3)))
# Umbrella suitability = water resistance × flexibility
suitability = water_resistance * (0.3 + 0.7 * flexibility)
suitability /= suitability.max()

ax2.plot(cl_density * 100, hardness, color='#ef4444', linewidth=2, label='Hardness')
ax2.plot(cl_density * 100, flexibility, color='#22c55e', linewidth=2, label='Flexibility')
ax2.plot(cl_density * 100, water_resistance, color='#3b82f6', linewidth=2, label='Water resistance')
ax2.plot(cl_density * 100, suitability, color='#fbbf24', linewidth=3, linestyle='--', label='Umbrella suitability')
best_cl = cl_density[np.argmax(suitability)] * 100
ax2.axvline(best_cl, color='#fbbf24', linestyle=':', linewidth=1)
ax2.plot(best_cl, max(suitability), '*', color='#fbbf24', markersize=15)
ax2.set_xlabel('Cross-link density (%)', color='white')
ax2.set_ylabel('Property score (0-1)', color='white')
ax2.set_title('Film Properties vs Cross-linking', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Radical concentration during curing
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
time_cure = np.linspace(0, 72, 500)
# Radical kinetics: initiation → propagation → termination
k_init = 0.02
k_prop = 0.5
k_term = 0.8
# Simplified radical concentration profile
radicals = k_init * time_cure * np.exp(-k_term * time_cure / 48)
oxygen_consumed = 1 - np.exp(-0.05 * time_cure)
double_bonds_remaining = np.exp(-0.04 * time_cure)

ax3.plot(time_cure, radicals / radicals.max(), color='#ef4444', linewidth=2, label='Free radical conc.')
ax3.plot(time_cure, oxygen_consumed, color='#3b82f6', linewidth=2, label='O₂ consumed')
ax3.plot(time_cure, double_bonds_remaining, color='#22c55e', linewidth=2, label='C=C bonds remaining')
ax3.fill_between(time_cure, 0, radicals / radicals.max(), alpha=0.1, color='#ef4444')
ax3.set_xlabel('Curing time (hours)', color='white')
ax3.set_ylabel('Normalized quantity', color='white')
ax3.set_title('Reaction Species During Curing', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Arrhenius plot
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
T_range = np.linspace(5, 60, 100)
T_K = T_range + 273.15
inv_T = 1000 / T_K
# Without catalyst
k_no_cat = arrhenius_rate(A, Ea, T_range)
# With cobalt drier (Ea reduced by 20%)
k_with_cat = arrhenius_rate(A * 5, Ea * 0.8, T_range)

ax4.semilogy(inv_T, k_no_cat, color='#3b82f6', linewidth=2, label='Pure tung oil')
ax4.semilogy(inv_T, k_with_cat, color='#ef4444', linewidth=2, label='With Co drier (-20% Ea)')
ax4.set_xlabel('1000/T (K⁻¹)', color='white')
ax4.set_ylabel('Rate constant k (s⁻¹)', color='white')
ax4.set_title('Arrhenius Plot — Curing Kinetics', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')
# Mark typical temperatures
for T_mark, label in [(25, '25°C'), (40, '40°C (sun)')]:
    inv_mark = 1000 / (T_mark + 273.15)
    k_mark = arrhenius_rate(A, Ea, T_mark)
    ax4.plot(inv_mark, k_mark, 'o', color='#fbbf24', markersize=8)
    ax4.annotate(label, (inv_mark, k_mark), textcoords='offset points',
                 xytext=(10, 5), color='#fbbf24', fontsize=9)

plt.tight_layout()
plt.show()

print("=" * 60)
print("    TUNG OIL POLYMERIZATION KINETICS")
print("=" * 60)
print(f"\
Activation energy: {Ea/1000:.1f} kJ/mol")
print(f"\
Curing rates (relative to 25°C):")
k_25 = arrhenius_rate(A, Ea, 25)
for T in [15, 25, 35, 45]:
    k = arrhenius_rate(A, Ea, T)
    print(f"  {T}°C: {k/k_25:.1f}x")
print(f"\
With cobalt drier at 25°C: {arrhenius_rate(A*5, Ea*0.8, 25)/k_25:.0f}x faster")
print(f"\
Optimal cross-link density for umbrellas: {best_cl:.0f}%")
print(f"(Balances water resistance with flexibility for folding)")`,
      challenge: 'Model how UV radiation accelerates curing by adding a photo-initiation term. Compare cure times for umbrellas dried indoors versus in direct sunlight, accounting for both temperature and UV effects.',
      successHint: 'You have modeled the chemistry behind the umbrella maker\'s art — tung oil polymerization is a free radical chain reaction controlled by temperature and oxygen, and the optimal cure produces a film that is waterproof yet still flexible enough to fold.',
    },
    {
      title: 'Structural analysis — umbrella rib mechanics and load distribution',
      concept: `A paper umbrella is a structural system: bamboo ribs act as cantilever beams radiating from a central hub, supporting a paper membrane that spans between them. When rain falls or wind pushes on the umbrella, these forces are transmitted through the paper to the ribs, down the ribs to the hub, and through the shaft to the handle. Understanding this load path is umbrella engineering.

Each bamboo rib can be modeled as a tapered cantilever beam. The bending moment at any point along the rib is M(x) = ∫F(s)·(s-x)ds for all loads beyond position x. The maximum stress in the rib is σ = M·c/I, where c is the distance from the neutral axis and I is the moment of inertia (I = πr⁴/4 for a circular cross-section). Bamboo has a Young's modulus of ~15-20 GPa and tensile strength of ~100-230 MPa along the grain.

The paper membrane between ribs acts as a loaded plate. For a triangular panel bounded by two ribs and the umbrella edge, rain load creates a distributed pressure (typically 100-500 Pa in heavy rain). The paper deflects between ribs, creating tension along the paper and transferring load to the rib edges. The maximum deflection at the panel center determines whether water pools (bad — increases local load) or runs off (good — self-clearing design).`,
      analogy: 'Think of an umbrella like a tent. The ribs are tent poles, the paper is the tent fabric, and the rain is like snow load. Just as tent designers must ensure fabric is taut enough that snow slides off rather than accumulating and collapsing the tent, umbrella makers must ensure paper is stretched tight enough between ribs that water runs to the edges rather than pooling in the center of each panel.',
      storyConnection: 'The umbrella maker carefully selects bamboo strips of the right thickness and taper — thicker at the hub where bending moments are greatest, thinner at the tip where loads are smallest. This intuitive engineering exactly follows the structural principle of minimum weight design: material is placed where stress is highest.',
      checkQuestion: 'An umbrella has 24 ribs, each 40 cm long, with a paper panel angle of 15° between adjacent ribs. Rain exerts 300 Pa pressure. What is the total rain force on one panel? If the panel deflects 5mm at its center, what tension develops in the paper?',
      checkAnswer: 'Panel area ≈ (1/2) × 0.4² × sin(15°) = 0.0207 m². Rain force = 300 × 0.0207 = 6.2 N per panel. Total on umbrella = 6.2 × 24 = 149 N ≈ 15 kg equivalent. For the tension: treating the deflected paper as a shallow membrane with 5mm deflection over a span of ~0.4×sin(7.5°) ≈ 52mm half-width, the tension T ≈ pressure × span² / (8 × deflection) = 300 × 0.052² / (8 × 0.005) = 20.3 N/m. This tension is what keeps the paper from sagging further.',
      codeIntro: 'Model the structural mechanics of an umbrella — rib bending, paper membrane deflection, and load distribution under rain and wind.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Umbrella structural parameters
n_ribs = 24
rib_length = 0.40  # m
panel_angle = 2 * np.pi / n_ribs  # radians
bamboo_E = 17e9  # Pa (Young's modulus)
bamboo_strength = 150e6  # Pa (tensile strength along grain)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Umbrella top view with rib layout and load zones
ax = axes[0, 0]
ax.set_facecolor('#111827')
theta = np.linspace(0, 2 * np.pi, 200)
# Draw umbrella outline
ax.plot(rib_length * np.cos(theta), rib_length * np.sin(theta), color='#3b82f6', linewidth=2)
# Draw ribs
for i in range(n_ribs):
    angle = i * panel_angle
    ax.plot([0, rib_length * np.cos(angle)], [0, rib_length * np.sin(angle)],
            color='#f59e0b', linewidth=1.5, alpha=0.7)
# Color panels by load intensity (rain not uniform due to tilt)
for i in range(n_ribs):
    a1 = i * panel_angle
    a2 = (i + 1) * panel_angle
    angles = np.linspace(a1, a2, 20)
    r = np.linspace(0, rib_length, 20)
    load_intensity = 0.5 + 0.5 * np.cos(a1 - np.pi/4)  # wind from NE
    for ri in range(len(r) - 1):
        wedge_theta = np.linspace(a1, a2, 20)
        x_inner = r[ri] * np.cos(wedge_theta)
        y_inner = r[ri] * np.sin(wedge_theta)
        x_outer = r[ri+1] * np.cos(wedge_theta)
        y_outer = r[ri+1] * np.sin(wedge_theta)
        ax.fill(np.concatenate([x_inner, x_outer[::-1]]),
                np.concatenate([y_inner, y_outer[::-1]]),
                alpha=0.15 * load_intensity, color='#3b82f6')
ax.plot(0, 0, 'o', color='#ef4444', markersize=8)
ax.set_aspect('equal')
ax.set_title(f'Umbrella Plan View ({n_ribs} ribs)', color='white', fontsize=12, fontweight='bold')
ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.tick_params(colors='gray')

# Plot 2: Bending moment along a rib
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
x_rib = np.linspace(0, rib_length, 200)
# Distributed rain load on panel transfers to rib
rain_pressure = 300  # Pa
panel_width = lambda x: 2 * x * np.tan(panel_angle / 2)  # width at distance x
distributed_load = rain_pressure * np.array([panel_width(xi) for xi in x_rib])  # N/m

# Bending moment: M(x) = integral from x to L of q(s)*(s-x) ds
moment = np.zeros_like(x_rib)
for i in range(len(x_rib)):
    s = x_rib[i:]
    q = distributed_load[i:]
    if len(s) > 1:
        moment[i] = np.trapz(q * (s - x_rib[i]), s)

# Rib cross-section (tapered bamboo)
rib_radius = lambda x: 0.003 * (1 - 0.5 * x / rib_length)  # 3mm to 1.5mm
I_rib = np.array([np.pi * rib_radius(xi)**4 / 4 for xi in x_rib])
stress_rib = np.array([moment[i] * rib_radius(x_rib[i]) / I_rib[i] if I_rib[i] > 0 else 0
                        for i in range(len(x_rib))])

ax2.plot(x_rib * 100, moment * 1000, color='#3b82f6', linewidth=2, label='Bending moment')
ax2_twin = ax2.twinx()
ax2_twin.plot(x_rib * 100, stress_rib / 1e6, color='#ef4444', linewidth=2, label='Bending stress')
ax2_twin.axhline(bamboo_strength / 1e6, color='#fbbf24', linestyle='--', linewidth=1)
ax2.set_xlabel('Distance from hub (cm)', color='white')
ax2.set_ylabel('Bending moment (N·mm)', color='#3b82f6')
ax2_twin.set_ylabel('Stress (MPa)', color='#ef4444')
ax2.set_title('Rib Bending Under Rain Load', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(axis='y', colors='#3b82f6')
ax2_twin.tick_params(axis='y', colors='#ef4444')
ax2.tick_params(axis='x', colors='gray')

# Plot 3: Paper deflection between ribs
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Membrane deflection model: w = q*a²/(8*T) for membrane strip
rib_spacings = np.linspace(0.02, 0.15, 100)  # m
tensions = [5, 10, 20, 50]  # N/m paper tension
for T, color in zip(tensions, ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']):
    deflection = rain_pressure * rib_spacings**2 / (8 * T)
    ax3.plot(rib_spacings * 100, deflection * 1000, color=color, linewidth=2,
             label=f'Tension = {T} N/m')
ax3.axhline(5, color='gray', linestyle=':', linewidth=0.5)
ax3.text(1, 5.5, 'Pooling threshold (~5mm)', color='gray', fontsize=8)
ax3.set_xlabel('Rib spacing (cm)', color='white')
ax3.set_ylabel('Paper deflection (mm)', color='white')
ax3.set_title('Paper Sag Between Ribs', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Wind load analysis
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
wind_speeds = np.linspace(0, 25, 200)  # m/s
# Wind force = 0.5 * rho * v^2 * Cd * A
rho_air = 1.225  # kg/m³
Cd = 1.3  # umbrella drag coefficient
umbrella_area = np.pi * rib_length**2
wind_force = 0.5 * rho_air * wind_speeds**2 * Cd * umbrella_area
# Torque on shaft
shaft_height = 0.8  # m
torque = wind_force * shaft_height * 0.5  # approximate lever arm

ax4.plot(wind_speeds * 3.6, wind_force, color='#3b82f6', linewidth=2, label='Wind force')
ax4_twin = ax4.twinx()
ax4_twin.plot(wind_speeds * 3.6, torque, color='#ef4444', linewidth=2, label='Shaft torque')
# Mark wind categories
for v_ms, label in [(5, 'Breeze'), (10, 'Strong'), (17, 'Storm')]:
    ax4.axvline(v_ms * 3.6, color='gray', linestyle=':', linewidth=0.5, alpha=0.5)
    ax4.text(v_ms * 3.6, max(wind_force) * 0.9, label, color='gray', fontsize=8,
             rotation=90, va='top')
ax4.set_xlabel('Wind speed (km/h)', color='white')
ax4.set_ylabel('Wind force (N)', color='#3b82f6')
ax4_twin.set_ylabel('Shaft torque (N·m)', color='#ef4444')
ax4.set_title('Wind Load on Umbrella', color='white', fontsize=12, fontweight='bold')
ax4.tick_params(axis='y', colors='#3b82f6')
ax4_twin.tick_params(axis='y', colors='#ef4444')
ax4.tick_params(axis='x', colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    UMBRELLA STRUCTURAL ANALYSIS")
print("=" * 60)
print(f"\
Geometry: {n_ribs} ribs, {rib_length*100:.0f} cm long")
print(f"Panel angle: {np.degrees(panel_angle):.1f}°")
print(f"Umbrella area: {umbrella_area:.3f} m²")
print(f"\
Rain load ({rain_pressure} Pa):")
print(f"  Total force: {rain_pressure * umbrella_area:.1f} N ({rain_pressure * umbrella_area / 9.81:.2f} kg)")
print(f"  Max rib moment: {max(moment)*1000:.2f} N·mm")
print(f"  Max rib stress: {max(stress_rib)/1e6:.1f} MPa (safety factor: {bamboo_strength/1e6/max(stress_rib)*1e6:.0f}x)")
print(f"\
Wind load at 40 km/h:")
v_40 = 40 / 3.6
f_40 = 0.5 * rho_air * v_40**2 * Cd * umbrella_area
print(f"  Force: {f_40:.1f} N ({f_40/9.81:.1f} kg equivalent)")
print(f"  Shaft torque: {f_40 * shaft_height * 0.5:.1f} N·m")`,
      challenge: 'Add analysis of asymmetric wind loading — when wind hits from one side, some ribs are in compression (windward) and others in tension (leeward). Model the inversion failure mode where wind catches the underside and flips the umbrella inside-out.',
      successHint: 'You have performed a real structural analysis of a paper umbrella — load paths, bending moments, membrane deflection, and wind forces. Traditional umbrella makers solved these engineering problems intuitively over centuries.',
    },
    {
      title: 'Paper folding mechanics — origami mathematics and crease patterns',
      concept: `Paper umbrella construction involves precise folding — the paper must be shaped into a conical surface and creased at regular intervals to fold flat when closed. The mathematics of paper folding is governed by origami axioms and the physics of crease formation.

When paper is creased, the cellulose fibers at the fold line are permanently deformed (plastic deformation). The fold creates a hinge with a residual angle that depends on crease sharpness, paper thickness, and fiber orientation. For a mountain fold (fold away from you) or valley fold (fold toward you), the crease angle φ determines how flat the fold lies: φ = 0° is perfectly flat, while φ = 180° is no fold at all.

Flat-foldability of an umbrella requires satisfying Kawasaki's theorem: at any interior vertex where creases meet, the alternating sum of angles between creases must equal zero (Σ(-1)ⁱ αᵢ = 0, modulo 360°). For an n-rib umbrella with equal panels, this is automatically satisfied, but when crease patterns become complex (as in decorative umbrella patterns), the theorem becomes a critical design constraint.

The fold endurance of paper — how many times it can be folded at the same crease before tearing — depends on fiber length, paper thickness, and moisture content. Typical paper survives 5-15 folds at the same crease. Umbrella paper must survive thousands of open-close cycles, so the fold radius, paper thickness, and fiber orientation at creases are carefully optimized.`,
      analogy: 'Think of folding a sheet of aluminum foil versus a sheet of fabric. The foil takes a sharp crease (low fold radius, plastic deformation) but tears after a few folds. The fabric bends smoothly (large fold radius, elastic deformation) and survives unlimited folding. Paper is between these extremes — it creases but degrades with repeated folding. The umbrella maker must find the sweet spot: creases sharp enough to fold flat, but gentle enough to survive a season of daily use.',
      storyConnection: 'Opening and closing the umbrella each day creates the same crease pattern in the paper panels. The maker reinforces crease lines with extra oil or thin bamboo strips, knowing these are the failure points. This is engineering at fold lines — managing the stress concentration where paper fibers are most damaged.',
      checkQuestion: 'An umbrella with 24 ribs must fold into a cylinder 3cm in diameter. What is the fold radius at each crease? If the paper is 0.3mm thick and tears after 500 folds at a 1mm radius, but can withstand 5000 folds at a 5mm radius, how many open-close cycles can this umbrella survive?',
      checkAnswer: 'With 24 ribs folding into a 3cm diameter cylinder: circumference = π × 3 = 9.42 cm. Each of the 24 panels contributes 9.42/24 = 0.39 cm to the circumference, so the fold radius ≈ cylinder radius / number of layers ≈ 15mm / 24 ≈ 0.63 mm at the innermost crease, increasing to ~15mm at the outermost. The average fold radius is roughly 3-4mm. Given the empirical relationship (500 cycles at 1mm, 5000 at 5mm — approximately linear in log-log), at 3.5mm radius: log(N) = log(500) + (log(5000)-log(500)) × (log(3.5)-log(1))/(log(5)-log(1)) ≈ 2.70 + 1 × 0.544/0.699 ≈ 3.48, so N ≈ 3000 cycles — roughly 4 years of twice-daily use.',
      codeIntro: 'Model paper folding mechanics, crease patterns, and fold endurance for umbrella design.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Umbrella crease pattern (flat projection)
ax = axes[0, 0]
ax.set_facecolor('#111827')
n_ribs = 24
R = 1.0
# Draw flat crease pattern
theta_ribs = np.linspace(0, 2*np.pi, n_ribs + 1)
for th in theta_ribs[:-1]:
    ax.plot([0, R * np.cos(th)], [0, R * np.sin(th)],
            color='#ef4444', linewidth=1.5, linestyle='--')  # mountain folds
# Valley folds (between ribs)
for i in range(n_ribs):
    th_mid = (theta_ribs[i] + theta_ribs[i+1]) / 2
    ax.plot([0, 0.95 * R * np.cos(th_mid)], [0, 0.95 * R * np.sin(th_mid)],
            color='#3b82f6', linewidth=1, linestyle=':')  # valley folds
# Draw circle
circle = plt.Circle((0, 0), R, fill=False, color='#f59e0b', linewidth=2)
ax.add_patch(circle)
ax.plot(0, 0, 'o', color='white', markersize=6)
ax.set_aspect('equal')
ax.set_xlim(-1.3, 1.3); ax.set_ylim(-1.3, 1.3)
ax.set_title('Umbrella Crease Pattern', color='white', fontsize=12, fontweight='bold')
ax.text(0.6, -1.15, '— Mountain fold', color='#ef4444', fontsize=9)
ax.text(0.6, -1.25, '··· Valley fold', color='#3b82f6', fontsize=9)
ax.tick_params(colors='gray')

# Plot 2: Fold endurance vs fold radius
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
fold_radius = np.linspace(0.5, 10, 200)  # mm
# Empirical power law: N = A * r^b
A_fold = 200
b_fold = 1.5
paper_types = [
    ('Thin (0.1mm)', 200, 1.5, '#ef4444'),
    ('Medium (0.3mm)', 150, 1.3, '#f59e0b'),
    ('Thick (0.5mm)', 80, 1.2, '#3b82f6'),
    ('Reinforced (0.3mm + oil)', 400, 1.5, '#22c55e'),
]
for name, A, b, color in paper_types:
    endurance = A * fold_radius**b
    ax2.semilogy(fold_radius, endurance, color=color, linewidth=2, label=name)
ax2.axhline(2000, color='gray', linestyle=':', linewidth=0.5)
ax2.text(0.6, 2200, '2 years daily use', color='gray', fontsize=8)
ax2.axhline(5000, color='gray', linestyle=':', linewidth=0.5)
ax2.text(0.6, 5500, '5 years', color='gray', fontsize=8)
ax2.set_xlabel('Fold radius (mm)', color='white')
ax2.set_ylabel('Fold endurance (cycles)', color='white')
ax2.set_title('Fold Endurance vs Fold Radius', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Crease angle relaxation over time
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
cycles = np.linspace(0, 3000, 500)
# Crease angle starts at target (flat = 0°) and relaxes toward open
initial_angle = 5  # degrees (nearly flat)
relaxation_rates = [0.001, 0.003, 0.005, 0.01]
labels_r = ['Reinforced', 'Well-oiled', 'Normal', 'Dry paper']
colors_r = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for rate, label, color in zip(relaxation_rates, labels_r, colors_r):
    angle = initial_angle + 60 * (1 - np.exp(-rate * cycles))
    ax3.plot(cycles, angle, color=color, linewidth=2, label=label)
ax3.axhline(30, color='gray', linestyle=':', linewidth=0.5)
ax3.text(50, 32, "Won't fold flat anymore", color='gray', fontsize=8)
ax3.set_xlabel('Open-close cycles', color='white')
ax3.set_ylabel('Residual crease angle (°)', color='white')
ax3.set_title('Crease Degradation Over Time', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Kawasaki's theorem verification
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Test different rib counts for flat-foldability
rib_counts = range(4, 33, 2)
kawasaki_residuals = []
fold_compactness = []
for n in rib_counts:
    # Equal panels: alternating angles automatically sum correctly
    panel_angle = 360 / n
    # Alternating sum of angles
    angles = [panel_angle] * n
    alt_sum = sum(a * (-1)**i for i, a in enumerate(angles))
    kawasaki_residuals.append(abs(alt_sum) % 360)
    # Compactness: ratio of folded to open diameter
    fold_compactness.append(n * 0.3 / (2 * np.pi * 40))  # rough estimate

ax4.bar([str(n) for n in rib_counts], kawasaki_residuals,
        color=['#22c55e' if r < 1 else '#ef4444' for r in kawasaki_residuals],
        alpha=0.7, edgecolor='white', linewidth=0.5)
ax4.set_xlabel('Number of ribs', color='white')
ax4.set_ylabel('Kawasaki residual (°)', color='white')
ax4.set_title('Flat-Foldability Check (Kawasaki)', color='white', fontsize=12, fontweight='bold')
ax4.tick_params(colors='gray', axis='both')
for tick in ax4.get_xticklabels():
    tick.set_fontsize(7)
ax4.axhline(0, color='#22c55e', linestyle='--', linewidth=0.5)
ax4.text(0.5, max(kawasaki_residuals) * 0.8, 'Green = flat-foldable',
         color='#22c55e', fontsize=9, transform=ax4.get_xaxis_transform())

plt.tight_layout()
plt.show()

print("=" * 60)
print("    PAPER FOLDING MECHANICS")
print("=" * 60)
print(f"\
Umbrella with {n_ribs} ribs:")
print(f"  Panel angle: {360/n_ribs:.1f}°")
print(f"  Kawasaki check: {'PASS' if kawasaki_residuals[-1] < 1 else 'FAIL'}")
print(f"\
Fold endurance (at 3.5mm fold radius):")
for name, A, b, _ in paper_types:
    N = A * 3.5**b
    years = N / (365 * 2)
    print(f"  {name:<25}: {N:.0f} cycles ({years:.1f} years at 2x/day)")`,
      challenge: 'Implement Maekawa\'s theorem (the difference between mountain and valley folds at each vertex equals ±2) and verify it for the umbrella crease pattern. Then design a crease pattern for a collapsible umbrella that folds into thirds.',
      successHint: 'You have combined origami mathematics with materials science to analyze paper umbrella folding — the intersection of geometry and mechanics that determines how long an umbrella lasts.',
    },
    {
      title: 'Bamboo material science — the engineering behind umbrella frames',
      concept: `Bamboo is a natural composite material with remarkable engineering properties. Its structure is a hollow cylinder of lignified cellulose fibers embedded in a parenchyma matrix — functionally similar to fiber-reinforced polymer composites. The fibers (vascular bundles) are concentrated near the outer surface, creating a functionally graded material that is strongest where bending stresses are highest.

The mechanical properties of bamboo vary dramatically with position: the outer 20% of the culm wall has fiber volume fraction ~60% and tensile strength up to 230 MPa (comparable to mild steel!), while the inner region has ~15% fiber fraction and much lower strength. This grading is evolutionarily optimized for resisting wind loads — bamboo is a cantilever beam loaded by wind, just like an umbrella rib.

For umbrella ribs, the bamboo is split along the grain and shaved to the desired taper. This process preserves the outer high-strength layer while removing inner material. The fiber orientation along the rib length provides excellent bending resistance (longitudinal strength), but the rib is weak against splitting perpendicular to the fibers (transverse strength is only 5-10% of longitudinal). This anisotropy is both a strength and a weakness in umbrella design — the rib resists bending beautifully but can split if loaded sideways.

Moisture content significantly affects bamboo properties. Fresh bamboo (60% MC) has only 40% of the strength of properly dried bamboo (12% MC). The umbrella maker's practice of seasoning bamboo for months is essential engineering — it reduces moisture, increases stiffness, and stabilizes dimensions.`,
      analogy: 'Bamboo is like a bundle of drinking straws glued together — each straw (vascular bundle) is strong along its length but weak sideways. The outer straws are packed tightly (high fiber fraction), and the inner ones are spaced apart (low fiber fraction). This is exactly how engineers design carbon fiber tubes: strong fibers near the outside where bending stress is greatest. Nature invented fiber-reinforced composites 50 million years before humans did.',
      storyConnection: 'The umbrella maker selects bamboo culms by age (3-4 years old is strongest), tests flexibility by bending, and seasons them for months before splitting into ribs. This careful material selection is the same process a modern engineer uses when specifying composite materials — testing modulus, strength, and durability before committing to a design.',
      checkQuestion: 'A bamboo strip is 5mm wide, 3mm thick, with outer fiber fraction 55% and inner fiber fraction 20%. Fiber tensile strength = 400 MPa, matrix strength = 30 MPa. Estimate the tensile strength of the outer and inner layers using the rule of mixtures. What is the effective tensile strength of the strip?',
      checkAnswer: 'Rule of mixtures: σ = Vf·σf + (1-Vf)·σm. Outer layer: σ = 0.55×400 + 0.45×30 = 220 + 13.5 = 233.5 MPa. Inner layer: σ = 0.20×400 + 0.80×30 = 80 + 24 = 104 MPa. The effective strength depends on the thickness ratio. If outer 1mm and inner 2mm: σ_eff = (1×233.5 + 2×104)/3 = (233.5 + 208)/3 = 147.2 MPa. The outer layer is 2.2x stronger per unit area — this is why the umbrella maker keeps the outer bamboo surface on the outside of the rib.',
      codeIntro: 'Model bamboo as a functionally graded composite material and analyze its properties for umbrella rib applications.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Bamboo composite model
def fiber_volume_fraction(r_normalized):
    """Fiber fraction vs normalized radial position (0=inner, 1=outer)."""
    return 0.15 + 0.45 * r_normalized**1.5

def rule_of_mixtures(Vf, prop_fiber, prop_matrix):
    """Composite property from fiber and matrix properties."""
    return Vf * prop_fiber + (1 - Vf) * prop_matrix

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Fiber distribution across bamboo wall
ax = axes[0, 0]
ax.set_facecolor('#111827')
r_pos = np.linspace(0, 1, 200)
vf = fiber_volume_fraction(r_pos)
# Mechanical properties
sigma_f = 400  # MPa fiber strength
sigma_m = 30   # MPa matrix strength
E_f = 40       # GPa fiber modulus
E_m = 2        # GPa matrix modulus

strength = rule_of_mixtures(vf, sigma_f, sigma_m)
modulus = rule_of_mixtures(vf, E_f, E_m)

ax.fill_between(r_pos * 100, 0, vf * 100, alpha=0.3, color='#3b82f6')
ax.plot(r_pos * 100, vf * 100, color='#3b82f6', linewidth=2, label='Fiber fraction')
ax_twin = ax.twinx()
ax_twin.plot(r_pos * 100, strength, color='#ef4444', linewidth=2, label='Tensile strength')
ax.set_xlabel('Position through wall (% from inner)', color='white')
ax.set_ylabel('Fiber volume fraction (%)', color='#3b82f6')
ax_twin.set_ylabel('Tensile strength (MPa)', color='#ef4444')
ax.set_title('Bamboo: Functionally Graded Composite', color='white', fontsize=12, fontweight='bold')
ax.tick_params(axis='y', colors='#3b82f6')
ax_twin.tick_params(axis='y', colors='#ef4444')
ax.tick_params(axis='x', colors='gray')

# Plot 2: Bamboo vs other materials
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
materials = [
    ('Bamboo (outer)', 230, 20, '#22c55e'),
    ('Bamboo (avg)', 150, 15, '#3b82f6'),
    ('Mild steel', 250, 200, '#ef4444'),
    ('Aluminum', 270, 69, '#f59e0b'),
    ('Oak wood', 100, 12, '#a855f7'),
    ('Pine wood', 40, 9, '#818cf8'),
    ('GFRP', 300, 25, '#14b8a6'),
]
names = [m[0] for m in materials]
strengths_m = [m[1] for m in materials]
moduli_m = [m[2] for m in materials]
colors_m = [m[3] for m in materials]
# Specific strength (strength/density)
densities = [700, 700, 7800, 2700, 700, 500, 1800]  # kg/m³
specific_strength = [s / (d / 1000) for s, d in zip(strengths_m, densities)]

bars = ax2.barh(names, specific_strength, color=colors_m, alpha=0.8,
                edgecolor='white', linewidth=0.5)
ax2.set_xlabel('Specific strength (MPa·m³/kg)', color='white')
ax2.set_title('Specific Strength: Bamboo vs Materials', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(colors='gray')
for bar, val in zip(bars, specific_strength):
    ax2.text(val + 5, bar.get_y() + bar.get_height()/2,
             f'{val:.0f}', va='center', color='white', fontsize=9)

# Plot 3: Moisture effect on bamboo properties
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
moisture = np.linspace(5, 60, 200)  # %
# Properties decrease with moisture
E_bamboo = 20 * np.exp(-0.015 * (moisture - 12))  # GPa, optimum at 12%
strength_bamboo = 180 * np.exp(-0.012 * (moisture - 12))  # MPa
shrinkage = 0.2 * (moisture - 12)  # % dimensional change

ax3.plot(moisture, E_bamboo, color='#3b82f6', linewidth=2, label="Young's modulus (GPa)")
ax3.plot(moisture, strength_bamboo, color='#ef4444', linewidth=2, label='Tensile strength (MPa)')
ax3.axvline(12, color='#fbbf24', linestyle='--', linewidth=1.5)
ax3.text(13, max(strength_bamboo) * 0.9, 'Optimal MC\
(12%)', color='#fbbf24', fontsize=9)
ax3.axvspan(10, 15, alpha=0.1, color='#22c55e')
ax3.set_xlabel('Moisture content (%)', color='white')
ax3.set_ylabel('Property value', color='white')
ax3.set_title('Moisture Effect on Bamboo Properties', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Rib taper optimization
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
rib_x = np.linspace(0, 40, 200)  # cm from hub
# Different taper profiles
tapers = [
    ('Linear taper', lambda x: 4 - 2.5 * x / 40, '#3b82f6'),
    ('Parabolic taper', lambda x: 4 - 2.5 * (x / 40)**2, '#ef4444'),
    ('Optimal (stress-matched)', lambda x: 4 * (1 - 0.6 * (x / 40))**0.5, '#22c55e'),
    ('Uniform', lambda x: np.ones_like(x) * 3, '#f59e0b'),
]
for name, taper_fn, color in tapers:
    width = taper_fn(rib_x)
    ax4.plot(rib_x, width, color=color, linewidth=2, label=name)
    ax4.fill_between(rib_x, 0, width, alpha=0.1, color=color)
ax4.set_xlabel('Distance from hub (cm)', color='white')
ax4.set_ylabel('Rib width (mm)', color='white')
ax4.set_title('Bamboo Rib Taper Profiles', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    BAMBOO MATERIAL SCIENCE FOR UMBRELLA RIBS")
print("=" * 60)
print(f"\
Bamboo fiber properties:")
print(f"  Fiber strength: {sigma_f} MPa")
print(f"  Matrix strength: {sigma_m} MPa")
print(f"  Outer wall (Vf=60%): {rule_of_mixtures(0.6, sigma_f, sigma_m):.0f} MPa")
print(f"  Inner wall (Vf=15%): {rule_of_mixtures(0.15, sigma_f, sigma_m):.0f} MPa")
print(f"\
Specific strength comparison:")
for mat, ss in sorted(zip(names, specific_strength), key=lambda x: -x[1]):
    print(f"  {mat:<20}: {ss:.0f} MPa·m³/kg")
print(f"\
Bamboo outer layer rivals steel in specific strength")
print(f"while weighing 10x less — nature's optimal structural material!")`,
      challenge: 'Model the splitting failure mode of bamboo ribs. When a lateral force is applied (e.g., wind catching the umbrella at an angle), calculate the transverse stress that could cause splitting and determine the maximum safe lateral load.',
      successHint: 'You have analyzed bamboo as an engineering material — a functionally graded composite that rivals modern materials in specific strength. Understanding bamboo mechanics explains why it has been used for umbrella frames for centuries.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Cellulose chemistry, waterproofing physics, and structural engineering of paper umbrellas</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for materials science, structural analysis, and chemistry. Click to start.</p>
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
