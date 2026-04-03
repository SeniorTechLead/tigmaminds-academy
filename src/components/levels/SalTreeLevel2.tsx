import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SalTreeLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stress-strain in wood — how materials deform and break',
      concept: `When you apply force to a piece of wood, it deforms. The relationship between applied force and deformation is the **stress-strain curve** — the most fundamental tool in materials engineering.

**Stress** (sigma) = Force / Area (MPa). How much force per unit area.
**Strain** (epsilon) = change in length / original length (dimensionless). How much the material stretches.

**The stress-strain curve has distinct regions:**
1. **Elastic region**: stress and strain are proportional (Hooke's Law: sigma = E * epsilon). The material returns to its original shape when the force is removed. E = Young's modulus (stiffness).
2. **Yield point**: the material begins to deform permanently. Beyond this, damage accumulates.
3. **Plastic region**: permanent deformation increases with more stress. The material doesn't return to original shape.
4. **Failure**: the material breaks.

**Wood is unusual**: it behaves differently in tension vs. compression. In tension (pulling), it's stiff and breaks suddenly (brittle). In compression (pushing), it deforms gradually (ductile). This duality makes wood uniquely useful — it warns before failing in compression but holds firmly in tension.`,
      analogy: 'The stress-strain curve is like stretching a rubber band. At first, it stretches proportionally (elastic). Then it starts to feel different — thinner, warmer (yield point). Eventually it snaps (failure). Wood\'s curve is like two different rubber bands: one for pulling (snaps suddenly) and one for pushing (deforms slowly).',
      storyConnection: 'The Sal tree "never bends" because its Young\'s modulus (stiffness) is very high — about 12,600 MPa along the grain. It resists deformation until very high loads, then fails suddenly. The "unbending" quality is literally a materials property: high stiffness.',
      checkQuestion: 'A wooden shelf sags over years even though it never exceeded its yield stress. How is this possible?',
      checkAnswer: 'Creep. Under sustained load below the yield stress, wood slowly deforms over time as cellulose chains gradually slide past each other. This viscoelastic behavior means the shelf is always slowly moving — imperceptibly, but relentlessly. Temperature and moisture increase creep rate. This is why old shelves sag.',
      codeIntro: 'Generate and compare stress-strain curves for different wood types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stress-strain models for wood
def wood_stress_strain(strain, E, yield_strain, ultimate_strain, ultimate_stress):
    """Simplified stress-strain curve for wood."""
    stress = np.zeros_like(strain)
    for i, eps in enumerate(strain):
        if eps < yield_strain:
            # Elastic region
            stress[i] = E * eps
        elif eps < ultimate_strain:
            # Plastic region (hardening)
            yield_stress = E * yield_strain
            progress = (eps - yield_strain) / (ultimate_strain - yield_strain)
            stress[i] = yield_stress + (ultimate_stress - yield_stress) * progress ** 0.5
        else:
            # Post-failure (softening)
            stress[i] = ultimate_stress * np.exp(-10 * (eps - ultimate_strain))
    return stress

strain = np.linspace(0, 0.02, 500)

woods = {
    'Sal (tension)': {'E': 12600, 'yield': 0.005, 'ult_strain': 0.008, 'ult_stress': 120, 'color': '#8b4513'},
    'Sal (compression)': {'E': 10000, 'yield': 0.004, 'ult_strain': 0.015, 'ult_stress': 65, 'color': '#d2691e'},
    'Pine (tension)': {'E': 8500, 'yield': 0.003, 'ult_strain': 0.005, 'ult_stress': 40, 'color': '#deb887'},
    'Pine (compression)': {'E': 7000, 'yield': 0.003, 'ult_strain': 0.012, 'ult_stress': 35, 'color': '#f5deb3'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Stress-strain curves
ax1.set_facecolor('#111827')
for name, props in woods.items():
    stress = wood_stress_strain(strain, props['E'], props['yield'],
                                 props['ult_strain'], props['ult_stress'])
    linestyle = '-' if 'tension' in name else '--'
    ax1.plot(strain * 100, stress, linewidth=2, label=name, color=props['color'],
             linestyle=linestyle)

ax1.set_xlabel('Strain (%)', color='white')
ax1.set_ylabel('Stress (MPa)', color='white')
ax1.set_title('Stress-Strain Curves: Tension (solid) vs Compression (dashed)', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Mark elastic region
ax1.annotate('Elastic\\nregion', xy=(0.2, 25), color='#22c55e', fontsize=9)
ax1.annotate('Yield', xy=(0.5, 63), xytext=(0.7, 90),
             color='#f59e0b', fontsize=8, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Young's modulus comparison
ax2.set_facecolor('#111827')
materials = ['Sal wood', 'Oak', 'Pine', 'Bamboo', 'Mild steel', 'Concrete', 'Rubber']
youngs_modulus = [12600, 11000, 8500, 18000, 200000, 30000, 50]

bars = ax2.barh(range(len(materials)), youngs_modulus,
                color=['#8b4513', '#a0522d', '#deb887', '#22c55e', '#6b7280', '#94a3b8', '#ef4444'],
                alpha=0.85)
ax2.set_yticks(range(len(materials)))
ax2.set_yticklabels(materials, color='white', fontsize=9)
ax2.set_xlabel("Young's Modulus E (MPa)", color='white')
ax2.set_title("Stiffness Comparison (Young's Modulus)", color='white', fontsize=11)
ax2.set_xscale('log')
ax2.tick_params(colors='gray')
ax2.invert_yaxis()

for bar, val in zip(bars, youngs_modulus):
    ax2.text(bar.get_width() * 1.2, bar.get_y() + bar.get_height()/2,
             f'{val:,}', va='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Stress-strain key values:")
for name, props in woods.items():
    print(f"  {name}:")
    print(f"    Young's modulus: {props['E']:,} MPa")
    print(f"    Yield strain: {props['yield']*100:.1f}%")
    print(f"    Ultimate stress: {props['ult_stress']} MPa")
print()
print("Wood in compression deforms GRADUALLY (warning before failure)")
print("Wood in tension snaps SUDDENLY (no warning)")
print("This is why engineers design wood structures to fail in compression first.")`,
      challenge: 'Add a creep curve: apply a constant stress of 30 MPa to Sal wood and plot strain over 10 years. Use a logarithmic creep model: strain(t) = elastic_strain + A * log(1 + t/tau).',
      successHint: 'Stress-strain curves are the Rosetta Stone of materials engineering. Every material — wood, metal, plastic, bone — has its own curve, and reading it tells you everything about how that material will behave under load.',
    },
    {
      title: 'Moisture and wood strength — the hidden variable',
      concept: `Wood strength changes dramatically with moisture content. This is because water molecules insert themselves between cellulose chains, acting as a lubricant and weakening hydrogen bonds.

**Fiber Saturation Point (FSP)**: ~28-30% moisture content. Below FSP, water is bound within cell walls (affects properties). Above FSP, water fills cell cavities (doesn't affect properties much).

**Effects of moisture below FSP:**
- **Strength decreases ~3-5% per 1% increase in moisture content**
- At 12% moisture (air-dried): full strength
- At 28% moisture (FSP): roughly 40-50% of dry strength
- Green wood (fresh-cut, >50% moisture): weakest

**Why this matters:**
- Kiln-dried construction lumber (12% MC) is much stronger than green lumber
- Outdoor wood swings between dry (strong) and wet (weak) with weather
- Sal's natural resins partially waterproof its heartwood, reducing moisture absorption — one reason it's preferred for outdoor use
- Building codes require specifying wood strength at a reference moisture content (usually 12%)

**Dimensional changes**: wood shrinks when drying and swells when wetting. This is why wooden doors stick in humid weather and have gaps in dry weather.`,
      analogy: 'Water in wood is like oil in a stack of playing cards. Dry cards (dry wood) grip each other tightly — high friction, strong stack. Add oil (water) between the cards, and they slide easily — lower friction, weaker stack. The fiber saturation point is when every card surface is coated; adding more oil to the table (cell cavities) doesn\'t change the card-to-card friction.',
      storyConnection: 'Sal thrives in NE India\'s monsoon climate where humidity swings from 40% to 95%. Its natural resins minimize moisture absorption, so its strength stays more consistent than other woods. The "never bends" quality is partly about moisture resistance.',
      checkQuestion: 'Why do wooden boats need to be soaked before launching?',
      checkAnswer: 'Wood swells when wet, closing the gaps between planks. A dry wooden boat has tiny gaps where planks have shrunk. Soaking the hull causes the wood to expand, pressing planks tightly together and sealing the gaps. The boat literally seals itself with water. This is why wooden boats left on land too long develop leaks when relaunched.',
      codeIntro: 'Model wood strength as a function of moisture content.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Moisture-strength relationship
moisture = np.linspace(0, 50, 200)  # percentage

# Strength decreases linearly below FSP, constant above
fsp = 28  # fiber saturation point

def strength_at_moisture(mc, dry_strength, fsp=28):
    """Wood strength vs moisture content."""
    strength = np.where(
        mc < fsp,
        dry_strength * (1 - 0.04 * mc),  # ~4% loss per 1% MC
        dry_strength * (1 - 0.04 * fsp)   # constant above FSP
    )
    return np.clip(strength, 0, None)

sal_dry = 120  # MPa tensile (oven dry)
pine_dry = 55

sal_strength = strength_at_moisture(moisture, sal_dry)
pine_strength = strength_at_moisture(moisture, pine_dry)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Strength vs moisture
ax1.set_facecolor('#111827')
ax1.plot(moisture, sal_strength, color='#8b4513', linewidth=2, label='Sal')
ax1.plot(moisture, pine_strength, color='#deb887', linewidth=2, label='Pine')

ax1.axvline(fsp, color='#3b82f6', linestyle='--', linewidth=1)
ax1.text(fsp+1, sal_dry*0.9, 'Fiber Saturation\\nPoint (28%)', color='#3b82f6', fontsize=8)

# Mark standard conditions
for mc, label, color in [(12, 'Air-dried (12%)', '#22c55e'),
                          (20, 'Outdoor (20%)', '#f59e0b'),
                          (45, 'Green/fresh (45%)', '#ef4444')]:
    sal_s = strength_at_moisture(np.array([mc]), sal_dry)[0]
    ax1.plot(mc, sal_s, 'o', color=color, markersize=8)
    ax1.annotate(label, xy=(mc, sal_s), xytext=(mc+2, sal_s+5),
                 color=color, fontsize=7)

ax1.set_xlabel('Moisture content (%)', color='white')
ax1.set_ylabel('Tensile strength (MPa)', color='white')
ax1.set_title('Wood Strength vs Moisture Content', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Dimensional change (shrinkage/swelling)
ax2.set_facecolor('#111827')
# Shrinkage: tangential > radial > longitudinal
mc_range = np.linspace(0, 30, 100)
tangential_shrink = np.where(mc_range < fsp, (fsp - mc_range) / fsp * 8, 0)  # 8% total
radial_shrink = np.where(mc_range < fsp, (fsp - mc_range) / fsp * 4, 0)  # 4% total
longitudinal_shrink = np.where(mc_range < fsp, (fsp - mc_range) / fsp * 0.3, 0)  # 0.3% total

ax2.plot(mc_range, tangential_shrink, color='#ef4444', linewidth=2, label='Tangential (max)')
ax2.plot(mc_range, radial_shrink, color='#f59e0b', linewidth=2, label='Radial')
ax2.plot(mc_range, longitudinal_shrink, color='#22c55e', linewidth=2, label='Longitudinal (min)')

ax2.set_xlabel('Moisture content (%)', color='white')
ax2.set_ylabel('Shrinkage from green (%)', color='white')
ax2.set_title('Dimensional Shrinkage: Why Doors Stick and Gaps Form', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.invert_xaxis()

plt.tight_layout()
plt.show()

print("Moisture effects on Sal wood:")
print(f"  Oven dry (0% MC): {sal_dry:.0f} MPa (maximum strength)")
print(f"  Air dried (12% MC): {strength_at_moisture(np.array([12]), sal_dry)[0]:.0f} MPa")
print(f"  Outdoor (20% MC): {strength_at_moisture(np.array([20]), sal_dry)[0]:.0f} MPa")
print(f"  Green (45% MC): {strength_at_moisture(np.array([45]), sal_dry)[0]:.0f} MPa")
print()
print("Strength loss from oven-dry to air-dried: ~48%")
print("This is why building codes specify moisture content.")
print("Sal's natural resins reduce moisture pickup — a built-in advantage.")`,
      challenge: 'Simulate a year of outdoor exposure: moisture cycles between 12% (dry season) and 25% (monsoon). Plot the cyclic strength variation. How does this affect structural reliability?',
      successHint: 'Moisture is the single most important variable in wood engineering. Controlling moisture is controlling strength, dimensions, and durability. Every wood structure is a conversation with water.',
    },
    {
      title: 'Wood joints and construction — connecting pieces',
      concept: `Wood's anisotropy (strong along grain, weak across) makes joining pieces a unique engineering challenge. The joint is almost always the weakest part of a wood structure.

**Traditional joints:**
- **Mortise and tenon**: a tongue (tenon) fits into a hole (mortise). Loaded in shear along the grain — strong and reliable. Used for thousands of years.
- **Dovetail**: interlocking wedge-shaped cuts. Resists pulling apart. Classic for drawer construction.
- **Scarf joint**: angled splice to join two pieces end-to-end. Transfers tension through shear over a large area.
- **Lap joint**: pieces overlap and are fastened. Simple but weaker.

**Modern connectors:**
- **Bolts/screws**: concentrate force at points — risk of splitting along grain if too close to the edge
- **Steel plates/brackets**: distribute force over larger area
- **Glued joints**: can be stronger than the wood itself (modern adhesives exceed wood shear strength)
- **Cross-laminated timber (CLT)**: alternating grain directions eliminate the weakness of single-direction grain

**The rule**: always design joints so the force path avoids loading wood across the grain or splitting it along the grain. The best joints convert all loads into shear-along-grain or compression-along-grain.`,
      analogy: 'Designing wood joints is like linking paper chains. If you pull a paper strip along its length, it holds. If you pull across (tearing), it fails easily. A good joint links the "strips" so that every pull becomes along-the-grain shear, never across-grain tearing.',
      storyConnection: 'Traditional NE Indian bamboo and Sal construction uses sophisticated joints developed over centuries — mortise and tenon for Sal door frames, lashed joints for bamboo. These joints work with the grain, not against it. Modern engineering is now rediscovering and formalizing this traditional knowledge.',
      checkQuestion: 'Why are screws stronger than nails in wood, even though nails are thicker?',
      checkAnswer: 'Screws create mechanical interlock: the threads grip the wood fibers, converting pull-out force into compression against the thread surfaces (a large area). Nails rely only on friction between the smooth shaft and wood fibers (a small area). The screw\'s thread effectively increases the contact area by 5-10x. This is why engineers specify screws, not nails, for structural connections.',
      codeIntro: 'Compare the load-bearing capacity of different joint types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Joint strength comparison
joints = {
    'Mortise & tenon': {'shear': 85, 'tension': 70, 'cost': 8, 'skill': 9},
    'Dovetail': {'shear': 75, 'tension': 90, 'cost': 9, 'skill': 10},
    'Bolted': {'shear': 65, 'tension': 80, 'cost': 4, 'skill': 3},
    'Screwed': {'shear': 50, 'tension': 60, 'cost': 2, 'skill': 2},
    'Nailed': {'shear': 30, 'tension': 25, 'cost': 1, 'skill': 1},
    'Glued (modern)': {'shear': 95, 'tension': 95, 'cost': 3, 'skill': 4},
    'Steel bracket': {'shear': 90, 'tension': 85, 'cost': 5, 'skill': 3},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Strength comparison
ax1.set_facecolor('#111827')
names = list(joints.keys())
x = np.arange(len(names))
width = 0.35

shear_vals = [j['shear'] for j in joints.values()]
tension_vals = [j['tension'] for j in joints.values()]

ax1.barh(x - width/2, shear_vals, width, color='#22c55e', alpha=0.85, label='Shear strength')
ax1.barh(x + width/2, tension_vals, width, color='#3b82f6', alpha=0.85, label='Tension strength')

ax1.set_yticks(x)
ax1.set_yticklabels(names, color='white', fontsize=9)
ax1.set_xlabel('Strength (% of solid wood)', color='white')
ax1.set_title('Joint Strength Comparison', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

# Cost vs strength trade-off
ax2.set_facecolor('#111827')
colors = ['#8b4513', '#d2691e', '#6b7280', '#94a3b8', '#deb887', '#22c55e', '#3b82f6']
for i, (name, props) in enumerate(joints.items()):
    avg_strength = (props['shear'] + props['tension']) / 2
    ax2.scatter(props['cost'], avg_strength, s=props['skill']*30,
                color=colors[i], edgecolor='white', linewidth=1, zorder=5)
    ax2.annotate(name, xy=(props['cost'], avg_strength),
                 xytext=(props['cost']+0.3, avg_strength+2),
                 color=colors[i], fontsize=7)

ax2.set_xlabel('Cost (relative)', color='white')
ax2.set_ylabel('Average strength (% of solid)', color='white')
ax2.set_title('Cost vs Strength (bubble size = skill required)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Best joint by application:")
print("  Maximum strength: Glued joint (95% of solid wood)")
print("  Maximum pull-out resistance: Dovetail (90%)")
print("  Best value (strength/cost): Modern glue (95%/3 = 32)")
print("  Easiest to make: Nailed (skill=1, but weakest)")
print()
print("Traditional NE Indian Sal construction used mortise & tenon")
print("— the best mechanical joint before modern adhesives.")
print("These joints have lasted centuries in Sal temples and bridges.")`,
      challenge: 'Design a joint for a bamboo-to-Sal connection (a bamboo beam meeting a Sal post). What joint type would work best, given that bamboo is round and hollow while Sal is rectangular and solid?',
      successHint: 'Joint design is where materials science meets practical engineering. The joint is always the critical point in a structure — understanding joint mechanics is understanding structural safety.',
    },
    {
      title: 'Cross-laminated timber — wood that rivals concrete',
      concept: `**Cross-laminated timber (CLT)** is engineered wood made by gluing layers of lumber at right angles to each other. This alternating grain direction eliminates wood's biggest weakness: anisotropy.

**How CLT is made:**
1. Kiln-dried lumber boards are arranged in layers (typically 3, 5, or 7 layers)
2. Each layer is rotated 90 degrees from the previous one
3. Layers are bonded with structural adhesive under pressure
4. The result: a solid panel that is strong in all directions

**Why CLT is revolutionary:**
- **Eliminates splitting**: alternating grain prevents cracks from propagating
- **Reduces shrinkage**: layers constrain each other's moisture movement
- **Fire resistant**: thick CLT chars on the surface, protecting the core (counterintuitive but true — large wood members are safer in fire than steel, which softens at 550C)
- **Carbon negative**: the wood stores CO2 that the trees absorbed. A CLT building is a carbon sink.

**CLT buildings:**
- Brock Commons (Vancouver): 18 storeys, tallest wood building when completed (2017)
- Mjostaarnet (Norway): 85.4m tall, world's tallest timber building
- CLT is now competitive with concrete for buildings up to 20 storeys`,
      analogy: 'CLT is to solid wood what plywood is to veneer — taking a weak direction and canceling it out by alternating orientations. It\'s like weaving: a single thread is weak, but woven fabric (alternating directions) is strong in all directions. CLT is woven wood at a building scale.',
      storyConnection: 'Sal wood is strong but anisotropic. If you could make CLT from Sal — cross-laminating its already-dense heartwood — you\'d have one of the strongest engineered timber products possible. Research into tropical hardwood CLT is underway in India.',
      checkQuestion: 'A 18-storey wooden building sounds like a fire hazard. Why isn\'t it?',
      checkAnswer: 'Large CLT panels char predictably at 0.65mm per minute. The char layer insulates the core, preventing further burning. A 200mm CLT panel can withstand 2+ hours of fire — exceeding building code requirements. Steel, by contrast, softens at 550C and can fail suddenly without warning. In fire testing, CLT buildings often outperform steel buildings.',
      codeIntro: 'Model CLT panel strength as a function of layer count and orientation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# CLT strength model
# Each layer contributes strength based on its grain orientation relative to load

def clt_strength(n_layers, load_angle_deg, wood_strength_along=120, wood_strength_across=12):
    """Calculate CLT panel strength at a given load angle."""
    load_angle = np.radians(load_angle_deg)
    total_strength = 0

    for i in range(n_layers):
        # Each layer is rotated 90 degrees from the previous
        layer_angle = (i * 90) % 360
        # Relative angle between layer grain and load direction
        rel_angle = np.radians(layer_angle) - load_angle

        # Hankinson's formula for off-axis wood strength
        cos_a = np.cos(rel_angle)
        sin_a = np.sin(rel_angle)
        layer_strength = (wood_strength_along * wood_strength_across /
                         (wood_strength_along * sin_a**2 + wood_strength_across * cos_a**2))
        total_strength += layer_strength

    return total_strength / n_layers  # average per layer

# Compare solid wood vs CLT at different load angles
angles = np.linspace(0, 90, 100)

solid_strength = [clt_strength(1, a) for a in angles]
clt_3 = [clt_strength(3, a) for a in angles]
clt_5 = [clt_strength(5, a) for a in angles]
clt_7 = [clt_strength(7, a) for a in angles]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Strength vs load angle
ax1.set_facecolor('#111827')
ax1.plot(angles, solid_strength, color='#ef4444', linewidth=2, label='Solid wood (1 layer)')
ax1.plot(angles, clt_3, color='#f59e0b', linewidth=2, label='CLT 3-layer')
ax1.plot(angles, clt_5, color='#3b82f6', linewidth=2, label='CLT 5-layer')
ax1.plot(angles, clt_7, color='#22c55e', linewidth=2, label='CLT 7-layer')

ax1.set_xlabel('Load angle (degrees from grain)', color='white')
ax1.set_ylabel('Effective strength (MPa)', color='white')
ax1.set_title('CLT vs Solid: Strength at Any Angle', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# At 45 degrees (worst case for solid wood)
ax1.annotate('45° = worst case\\nfor solid wood', xy=(45, solid_strength[50]),
             xytext=(55, solid_strength[50]+10), color='#ef4444', fontsize=8,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Fire resistance comparison
ax2.set_facecolor('#111827')
time_min = np.arange(0, 180)  # minutes

# CLT: chars at 0.65mm/min, 200mm panel
clt_thickness = 200  # mm
char_rate = 0.65  # mm/min
remaining_clt = clt_thickness - char_rate * time_min
remaining_clt = np.clip(remaining_clt, 0, clt_thickness)
clt_capacity = remaining_clt / clt_thickness * 100

# Steel: maintains strength to ~300C, loses rapidly above
# Assume fire reaches 800C in 30 minutes
steel_temp = 20 + 780 * (1 - np.exp(-time_min / 20))
steel_capacity = np.where(steel_temp < 300, 100, 100 * np.exp(-0.01 * (steel_temp - 300)))

# Concrete: gradual strength loss
concrete_temp = 20 + 600 * (1 - np.exp(-time_min / 40))
concrete_capacity = np.where(concrete_temp < 200, 100, 100 * np.exp(-0.003 * (concrete_temp - 200)))

ax2.plot(time_min, clt_capacity, color='#22c55e', linewidth=2, label='CLT (200mm)')
ax2.plot(time_min, steel_capacity, color='#6b7280', linewidth=2, label='Steel beam')
ax2.plot(time_min, concrete_capacity, color='#94a3b8', linewidth=2, label='Concrete')

ax2.axhline(60, color='#ef4444', linestyle='--', linewidth=1)
ax2.text(150, 63, 'Code minimum (60%)', color='#ef4444', fontsize=8)

ax2.set_xlabel('Fire exposure time (minutes)', color='white')
ax2.set_ylabel('Structural capacity (%)', color='white')
ax2.set_title('Fire Resistance: CLT vs Steel vs Concrete', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("CLT advantages over solid wood:")
print(f"  Solid wood at 45°: {solid_strength[50]:.0f} MPa (weakest)")
print(f"  CLT 5-layer at 45°: {clt_5[50]:.0f} MPa ({clt_5[50]/solid_strength[50]:.1f}x stronger)")
print()
print("Fire performance (time to drop below 60% capacity):")
for name, data in [('CLT 200mm', clt_capacity), ('Steel', steel_capacity), ('Concrete', concrete_capacity)]:
    idx = np.argmax(data < 60)
    if idx > 0:
        print(f"  {name}: {time_min[idx]} minutes")
    else:
        print(f"  {name}: >180 minutes")`,
      challenge: 'Design a Sal CLT panel for a floor: it must support 5 kN/m2 over a 4m span. Calculate the minimum panel thickness needed. Compare with a concrete slab for the same span.',
      successHint: 'CLT is transforming construction — making wood competitive with steel and concrete for multi-storey buildings while sequestering carbon. It\'s materials engineering solving climate change.',
    },
    {
      title: 'Wood vs. steel vs. concrete — the sustainability comparison',
      concept: `Building materials account for ~11% of global CO2 emissions. Choosing between wood, steel, and concrete is not just an engineering decision — it's a climate decision.

**Embodied carbon** (kg CO2 per kg of material):
- Concrete: 0.15 kg CO2/kg (low per kg, but used in huge quantities)
- Steel: 2.5 kg CO2/kg (high energy smelting)
- Engineered wood (CLT): -1.0 to +0.5 kg CO2/kg (negative because trees absorb CO2!)
- Sal wood (air-dried): -1.5 to 0 kg CO2/kg (minimal processing)

**Lifecycle comparison for a typical 5-storey building:**
- Concrete frame: ~500 tonnes CO2
- Steel frame: ~300 tonnes CO2
- CLT frame: ~-50 to +100 tonnes CO2 (can be carbon negative!)

**The catch**: wood requires forests, and forests take decades to regrow. Sustainable forestry is essential — if forests are destroyed for timber, wood is worse than concrete.

**The opportunity**: NE India has massive bamboo and Sal resources. Engineered timber from sustainably managed NE Indian forests could reduce India's construction emissions while creating rural livelihoods.`,
      analogy: 'Choosing building materials is like choosing energy sources. Concrete and steel are like fossil fuels: reliable, proven, but polluting. Wood is like solar energy: clean, renewable, but requires good planning (sustainable forestry) and new infrastructure (engineered timber manufacturing). The transition is inevitable — the question is how fast.',
      storyConnection: 'The Sal tree "never bends" — and now we can build 18-storey buildings from wood that never bends either. The story\'s reverence for Sal\'s strength is vindicated by modern engineering: wood is not a primitive material. It\'s the material of the future, rediscovered.',
      checkQuestion: 'If a CLT building stores 100 tonnes of CO2, what happens to that carbon when the building is demolished in 80 years?',
      checkAnswer: 'Three options: (1) Reuse the CLT panels in a new building (carbon stays stored). (2) Recycle into particle board or other products (carbon stays stored). (3) Burn or landfill (carbon released as CO2). The best approach is cascading use: structural timber -> furniture -> particle board -> biochar. Each step delays carbon release. If the final step is biochar (permanent storage), the carbon is effectively sequestered forever.',
      codeIntro: 'Compare the lifecycle carbon footprint of buildings using different materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lifecycle carbon analysis for a 5-storey building
years = np.arange(0, 101)

# Embodied carbon (at construction)
concrete_embodied = 500  # tonnes CO2
steel_embodied = 300
clt_embodied = -50  # carbon negative (stored CO2 > processing CO2)

# Operational carbon (heating/cooling — assume same for all)
operational_per_year = 10  # tonnes CO2/year

# End-of-life
concrete_eol = 50  # demolition energy
steel_eol = -30  # recycling credit
clt_eol_reuse = -20  # reuse credit (carbon stays stored)
clt_eol_burn = 100  # if burned, releases stored carbon

# Cumulative carbon
concrete_total = concrete_embodied + operational_per_year * years
concrete_total[-1] += concrete_eol

steel_total = steel_embodied + operational_per_year * years
steel_total[-1] += steel_eol

clt_reuse = clt_embodied + operational_per_year * years
clt_reuse[-1] += clt_eol_reuse

clt_burn = clt_embodied + operational_per_year * years
clt_burn[-1] += clt_eol_burn

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Lifecycle comparison
ax1.set_facecolor('#111827')
ax1.plot(years, concrete_total, color='#94a3b8', linewidth=2, label='Concrete')
ax1.plot(years, steel_total, color='#6b7280', linewidth=2, label='Steel')
ax1.plot(years, clt_reuse, color='#22c55e', linewidth=2, label='CLT (timber reused)')
ax1.plot(years, clt_burn, color='#22c55e', linewidth=2, linestyle='--', label='CLT (timber burned)')

ax1.fill_between(years, concrete_total, clt_reuse, alpha=0.1, color='#22c55e')
ax1.axhline(0, color='gray', linestyle=':', linewidth=0.5)

ax1.set_xlabel('Building age (years)', color='white')
ax1.set_ylabel('Cumulative CO2 (tonnes)', color='white')
ax1.set_title('Lifecycle Carbon: Concrete vs Steel vs CLT', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Savings annotation
savings = concrete_total[50] - clt_reuse[50]
ax1.annotate(f'50-year savings:\\n{savings:.0f} tonnes CO2', xy=(50, clt_reuse[50]),
             xytext=(60, clt_reuse[50]-100), color='#22c55e', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#22c55e'))

# Material comparison radar
ax2 = plt.subplot(122, polar=True)
ax2.set_facecolor('#111827')

categories = ['Strength', 'Cost', 'Carbon\\nfootprint', 'Fire\\nresistance', 'Durability', 'Renewability']
N = len(categories)
angles = np.linspace(0, 2*np.pi, N, endpoint=False).tolist()
angles += angles[:1]

# Scores (0-10, higher = better)
concrete_scores = [6, 8, 4, 8, 9, 2] + [6]
steel_scores = [10, 5, 3, 4, 8, 1] + [10]
clt_scores = [7, 6, 9, 7, 7, 10] + [7]

for scores, name, color in [(concrete_scores, 'Concrete', '#94a3b8'),
                              (steel_scores, 'Steel', '#6b7280'),
                              (clt_scores, 'CLT (wood)', '#22c55e')]:
    ax2.plot(angles, scores, 'o-', linewidth=2, label=name, color=color)
    ax2.fill(angles, scores, alpha=0.08, color=color)

ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(categories, color='white', fontsize=8)
ax2.set_ylim(0, 10)
ax2.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=8)
ax2.set_title('Material Comparison', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("Lifecycle carbon comparison (100-year building):")
print(f"  Concrete: {concrete_total[-1]:.0f} tonnes CO2")
print(f"  Steel: {steel_total[-1]:.0f} tonnes CO2")
print(f"  CLT (reused): {clt_reuse[-1]:.0f} tonnes CO2")
print(f"  CLT (burned): {clt_burn[-1]:.0f} tonnes CO2")
print()
print(f"CLT saves {concrete_total[-1] - clt_reuse[-1]:.0f} tonnes vs concrete")
print(f"That's equivalent to taking {(concrete_total[-1] - clt_reuse[-1])/4.6:.0f} cars off the road for a year.")
print()
print("Global potential: if 10% of new buildings used CLT instead of concrete,")
print(f"it would save ~{0.1 * 500 * 1e6 / 1e9:.1f} billion tonnes CO2 per year")
print("(about 1% of global emissions)")`,
      challenge: 'Add a "hybrid" scenario: concrete foundation + CLT upper floors (the most practical current approach). How does its carbon profile compare to all-concrete and all-CLT? What is the optimal number of concrete floors vs. CLT floors?',
      successHint: 'From stress-strain to moisture to joints to CLT to sustainability — you\'ve traced timber engineering from molecular properties to global climate impact. The Sal tree that "never bends" is not just a story — it\'s a blueprint for sustainable construction.',
    },
    {
      title: 'Sustainable building materials — the future of construction',
      concept: `The construction industry uses 40% of global raw materials and produces 38% of CO2 emissions. Rethinking materials is not optional — it's urgent.

**Emerging sustainable materials:**
- **Mass timber (CLT, glulam)**: carbon-negative, renewable, strong. Already in buildings up to 25 storeys.
- **Bamboo composites**: strand-woven bamboo has steel-like strength, grows in 3-5 years. Ideal for tropical construction.
- **Rammed earth**: compressed soil walls, extremely low carbon, good thermal mass. Ancient technique, modern revival.
- **Hempcrete**: hemp fiber + lime binder. Carbon-negative (hemp sequesters CO2). Excellent insulation.
- **Mycelium composites**: grown from fungal networks binding agricultural waste. Lightweight, fire-resistant, fully biodegradable.
- **Recycled steel/concrete**: reduces embodied carbon by 50-75% compared to virgin materials.

**The NE India opportunity:**
NE India has abundant bamboo (~50% of India's reserves), Sal forests, and traditional earthen construction knowledge. Combining traditional materials with modern engineering (lamination, treatment, CLT) could create a regionally appropriate, low-carbon construction industry.

**Lifecycle thinking**: the best material isn't always the strongest or cheapest — it's the one with the lowest total environmental impact over its entire life: extraction, processing, transport, use, and disposal.`,
      analogy: 'Choosing sustainable building materials is like choosing a diet. The "healthiest" food isn\'t just about calories (strength) or taste (appearance) — it\'s about the whole system: how it was grown (extraction), how far it traveled (transport), what waste it creates (disposal), and whether the land can keep producing it (renewability). Sustainable materials are the "whole foods" of construction.',
      storyConnection: 'The Sal tree "never bends" — and sustainable construction must never bend either. The principles that make Sal strong (cellulose + lignin composites, interlocked grain, dense heartwood) are the same principles engineers use to design the next generation of building materials. Nature solved the engineering problem; we just need to learn from it.',
      checkQuestion: 'If mycelium (mushroom) composites can be grown in a mold in 5 days, why haven\'t they replaced styrofoam insulation already?',
      checkAnswer: 'Three barriers: (1) Scale: mycelium production is still small-scale and artisanal. Industrial-scale bioreactors are being developed but aren\'t yet competitive. (2) Moisture sensitivity: mycelium absorbs water unless treated, which degrades performance. (3) Building codes: no standards exist yet for mycelium in construction. Regulatory approval takes 5-10 years. But all three barriers are being actively worked on — mycelium insulation may be mainstream within a decade.',
      codeIntro: 'Build a multi-criteria sustainability comparison of building materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sustainable materials comparison
materials = {
    'Concrete': {'strength': 40, 'carbon': 150, 'renewable': 1, 'cost': 50, 'local_ne': 5, 'color': '#94a3b8'},
    'Steel': {'strength': 250, 'carbon': 2500, 'renewable': 1, 'cost': 800, 'local_ne': 2, 'color': '#6b7280'},
    'Sal CLT': {'strength': 120, 'carbon': -500, 'renewable': 6, 'cost': 600, 'local_ne': 9, 'color': '#8b4513'},
    'Bamboo\\ncomposite': {'strength': 185, 'carbon': -800, 'renewable': 9, 'cost': 400, 'local_ne': 10, 'color': '#22c55e'},
    'Rammed\\nearth': {'strength': 3, 'carbon': 20, 'renewable': 10, 'cost': 30, 'local_ne': 8, 'color': '#d2691e'},
    'Hempcrete': {'strength': 1, 'carbon': -100, 'renewable': 8, 'cost': 200, 'local_ne': 4, 'color': '#86efac'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Carbon footprint vs strength
ax1.set_facecolor('#111827')
for name, props in materials.items():
    size = props['renewable'] * 30 + 50
    ax1.scatter(props['strength'], props['carbon'], s=size, color=props['color'],
                edgecolor='white', linewidth=1.5, zorder=5)
    ax1.annotate(name.replace('\\n', ' '), xy=(props['strength'], props['carbon']),
                 xytext=(props['strength']+5, props['carbon']+80),
                 color=props['color'], fontsize=7)

ax1.axhline(0, color='#22c55e', linestyle='--', linewidth=1)
ax1.text(200, 50, 'CARBON POSITIVE (above)', color='#ef4444', fontsize=7)
ax1.text(200, -100, 'CARBON NEGATIVE (below)', color='#22c55e', fontsize=7)

ax1.set_xlabel('Compressive strength (MPa)', color='white')
ax1.set_ylabel('Embodied carbon (kg CO2/m3)', color='white')
ax1.set_title('Strength vs Carbon Footprint\\n(bubble size = renewability)', color='white', fontsize=11)
ax1.tick_params(colors='gray')

# NE India suitability score
ax2.set_facecolor('#111827')
categories = ['Strength', 'Low carbon', 'Renewable', 'Affordable', 'Locally\\navailable']
N = len(categories)
angles = np.linspace(0, 2*np.pi, N, endpoint=False).tolist()
angles += angles[:1]

for name, props in materials.items():
    # Normalize scores to 0-10
    strength_score = min(props['strength'] / 25, 10)
    carbon_score = min((3000 - props['carbon']) / 350, 10)
    renew_score = props['renewable']
    cost_score = min((1000 - props['cost']) / 100, 10)
    local_score = props['local_ne']

    values = [strength_score, carbon_score, renew_score, cost_score, local_score]
    values += values[:1]
    ax2.plot(angles, values, 'o-', linewidth=1.5, label=name.replace('\\n', ' '),
             color=props['color'], markersize=3)
    ax2.fill(angles, values, alpha=0.05, color=props['color'])

ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(categories, color='white', fontsize=8)
ax2.set_ylim(0, 10)
ax2.set_yticks([2, 4, 6, 8, 10])
ax2.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax2.legend(loc='upper right', bbox_to_anchor=(1.45, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=6)
ax2.set_title('NE India Suitability Score', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("NE India sustainable construction potential:")
print()
print("Best options by application:")
print("  Structural frame: Sal CLT or bamboo composite")
print("    -> Carbon negative, locally available, strong")
print("  Walls: Rammed earth or bamboo panels")
print("    -> Ultra-low carbon, affordable, traditional knowledge exists")
print("  Insulation: Hempcrete or bamboo fiber")
print("    -> Carbon negative, good thermal performance")
print("  Foundation: Concrete (still needed for waterproofing/strength)")
print("    -> Minimize amount, use recycled aggregate")
print()
print("A hybrid building using these materials could be")
print("carbon-negative over its lifecycle — absorbing more CO2")
print("than it emits. This is the future of construction.")`,
      challenge: 'Design a carbon-negative 3-storey building for Guwahati using only materials available in NE India. Specify the material for each component (foundation, frame, walls, roof, insulation) and calculate the total lifecycle carbon. Can you achieve net-negative?',
      successHint: 'Sustainable building materials bring together everything from this course: wood science, bamboo biology, materials engineering, and carbon accounting. The knowledge to build a carbon-negative future already exists — in the forests and traditions of NE India.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Timber Engineering</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for structural engineering simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}