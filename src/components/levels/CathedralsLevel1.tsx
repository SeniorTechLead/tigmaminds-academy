import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CathedralsLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Arches vs beams — why stone arches work but stone beams crack',
      concept: `Place a stone slab across two pillars and load it from above. The top surface compresses, but the bottom surface **stretches** — it is in **tension**. Stone is strong in compression (~40 MPa for limestone) but catastrophically weak in tension (~3 MPa). The bottom of the slab cracks, and the beam collapses. This is why no ancient culture built wide stone beams.

An **arch** solves this by curving the stone into a shape that converts all loads into **compression**. Every stone (called a voussoir) is squeezed between its neighbours. No part of the arch is in tension. This is why Roman aqueducts spanning 30 metres still stand after two millennia while stone lintels crack at just 3 metres.

The pointed Gothic arch goes further. A round arch pushes outward with significant **lateral thrust** — the wider the span, the harder it pushes sideways. A pointed arch channels forces more steeply downward, reducing lateral thrust by up to 50%. This single geometric insight made the soaring interiors of Gothic cathedrals possible.

📚 The key formula: **stress = force / area**. For a beam, bending creates tension on one face. For an arch, the geometry ensures pure compression throughout.`,
      analogy: 'Hold a stick of chalk horizontally and press down in the middle — it snaps easily (tension on the bottom). Now lean two sticks of chalk against each other in an inverted V and press down on the peak — the chalk pieces squeeze together but do not snap. You have just built an arch.',
      storyConnection: 'The master builders of Chartres and Notre-Dame understood that round Roman arches limited their ceiling height. By switching to pointed arches, they could span the same width with less outward push on the walls, allowing them to build taller naves flooded with light.',
      checkQuestion: 'A limestone beam spans 4 m, is 0.3 m deep, and supports 50,000 N. The bending stress at the bottom is approximately 1.1 MPa. Will it crack? What if the span doubles to 8 m?',
      checkAnswer: 'At 4 m span the tensile stress is 1.1 MPa, below limestone tensile strength of ~3 MPa — it survives but with little margin. Double the span to 8 m and bending stress roughly quadruples to ~4.4 MPa, exceeding 3 MPa. The beam cracks. An arch at 8 m span would carry the same load in pure compression, well within limestone\'s 40 MPa compressive strength.',
      codeIntro: 'Compare bending stress in a beam versus compressive stress in an arch for the same span and load.',
      code: `import numpy as np

# Material properties — limestone
compressive_strength = 40.0   # MPa
tensile_strength = 3.0        # MPa
density = 2500                # kg/m³

# Beam parameters
spans = np.array([2, 4, 6, 8, 10, 12])   # metres
beam_width = 0.5    # m
beam_depth = 0.3    # m
load = 50000        # N (distributed load)

print("=" * 60)
print("STONE BEAM: bending creates tension on the bottom face")
print("=" * 60)

for span in spans:
    # Bending moment for uniformly loaded beam: M = wL²/8
    w = load / span           # N/m distributed
    M = w * span**2 / 8      # N·m
    # Bending stress: sigma = M * y / I
    I = beam_width * beam_depth**3 / 12   # moment of inertia
    y = beam_depth / 2                     # distance to bottom face
    stress = M * y / I / 1e6              # MPa
    safe = "OK" if stress < tensile_strength else "CRACKED"
    print(f"  Span {span:>2d}m: tensile stress = {stress:>6.2f} MPa  "
          f"[limit {tensile_strength} MPa] {safe}")

print()
print("=" * 60)
print("STONE ARCH: all forces are compressive")
print("=" * 60)

for span in spans:
    # Semicircular arch: thrust H = wL²/(8h), h = span/2
    h = span / 2
    w = load / span
    H = w * span**2 / (8 * h)   # horizontal thrust (N)
    # Compressive force in arch ≈ sqrt(V² + H²) at springing
    V = load / 2
    F = np.sqrt(V**2 + H**2)
    # Arch cross-section
    arch_area = 0.4 * 0.4       # 0.4m × 0.4m voussoirs
    stress = F / arch_area / 1e6
    safe = "OK" if stress < compressive_strength else "CRUSHED"
    print(f"  Span {span:>2d}m: compressive stress = {stress:>6.2f} MPa  "
          f"[limit {compressive_strength} MPa] {safe}")

print()
print("Key insight: the beam cracks at modest spans because stone")
print("cannot handle tension. The arch stays safe at every span")
print("because it converts ALL forces into compression.")`,
      challenge: 'Add a pointed arch calculation where the rise h = span × 0.8 (taller than the semicircular h = span/2). Compare the horizontal thrust H for both arch types at a 10 m span. By what percentage does the pointed arch reduce lateral thrust?',
      successHint: 'The arch is one of humanity\'s greatest structural inventions. By respecting stone\'s strength in compression and avoiding its weakness in tension, a simple curve unlocks spans that beams could never achieve.',
    },
    {
      title: 'Force vectors — decomposing arch thrust',
      concept: `Every force has both **magnitude** and **direction**. In structural engineering, we decompose forces into **vertical** and **horizontal** components using trigonometry. This is the key to understanding why pointed arches changed architecture forever.

At the crown of a round (semicircular) arch, the load pushes straight down. But at the springing point (where the arch meets the wall), the force has tilted — it pushes both **down** and **outward**. The angle of that force depends on the arch geometry.

For a semicircular arch, the springing angle is roughly 0° from horizontal — maximum outward thrust. For a pointed arch with a steeper rise, the angle at the springing is much steeper, meaning more of the force goes **downward** and less goes **sideways**.

Decomposition: if the total force F acts at angle θ from horizontal, the **vertical component** is F·sin(θ) and the **horizontal component** is F·cos(θ). A steeper angle means larger sin(θ) and smaller cos(θ) — more force going safely into the ground, less force pushing walls apart.

📚 This is vector decomposition: F = (F·cos θ, F·sin θ). The Gothic builders discovered empirically what trigonometry proves: **steeper arches push less sideways**.`,
      analogy: 'Lean a ladder against a wall. A nearly vertical ladder barely pushes the wall sideways — almost all your weight goes straight down through the feet. Tilt it to 45° and the wall feels serious sideways push. A pointed arch is like a steep ladder; a round arch is like a shallow one.',
      storyConnection: 'At Notre-Dame de Paris, the pointed arches of the nave rise to 33 metres. If the builders had used round arches at the same span, the lateral thrust would have been nearly double, requiring impossibly thick walls. The pointed arch made thin walls — and therefore enormous stained glass windows — structurally possible.',
      checkQuestion: 'An arch exerts a total force of 200 kN at its base at an angle of 60° from horizontal. What are the vertical and horizontal components?',
      checkAnswer: 'Vertical = 200 × sin(60°) = 200 × 0.866 = 173.2 kN (goes safely into the foundation). Horizontal = 200 × cos(60°) = 200 × 0.5 = 100 kN (pushes the wall outward). Compare with a 30° angle: vertical = 100 kN, horizontal = 173.2 kN — nearly twice the dangerous sideways push.',
      codeIntro: 'Decompose arch forces for round vs pointed arches and compare lateral thrust.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Compare round arch vs pointed arch force vectors
span = 12.0            # metres
load = 100000          # N (100 kN total vertical load)

# --- Round (semicircular) arch ---
rise_round = span / 2  # rise = half the span
# Horizontal thrust: H = wL/(8h) * L  simplified: H = wL²/(8h)
w = load / span        # load per metre
H_round = w * span**2 / (8 * rise_round)
V = load / 2           # vertical reaction = half total load

angle_round = np.degrees(np.arctan2(V, H_round))
F_round = np.sqrt(V**2 + H_round**2)

# --- Pointed arch (rise = 0.85 × span) ---
rise_pointed = span * 0.85
H_pointed = w * span**2 / (8 * rise_pointed)
angle_pointed = np.degrees(np.arctan2(V, H_pointed))
F_pointed = np.sqrt(V**2 + H_pointed**2)

print(f"Span: {span} m | Total load: {load/1000:.0f} kN")
print()
print(f"ROUND ARCH (rise = {rise_round:.1f} m)")
print(f"  Horizontal thrust: {H_round/1000:.1f} kN")
print(f"  Vertical reaction:  {V/1000:.1f} kN")
print(f"  Resultant force:    {F_round/1000:.1f} kN at {angle_round:.1f}°")
print()
print(f"POINTED ARCH (rise = {rise_pointed:.1f} m)")
print(f"  Horizontal thrust: {H_pointed/1000:.1f} kN")
print(f"  Vertical reaction:  {V/1000:.1f} kN")
print(f"  Resultant force:    {F_pointed/1000:.1f} kN at {angle_pointed:.1f}°")
print()
reduction = (1 - H_pointed / H_round) * 100
print(f"Thrust reduction: {reduction:.1f}%")
print()

# --- Plot force vectors at the springing point ---
fig, axes = plt.subplots(1, 2, figsize=(10, 5))
scale = 1 / 1000   # convert N to kN for arrow length

for ax, label, H, angle in [
    (axes[0], "Round arch", H_round, angle_round),
    (axes[1], "Pointed arch", H_pointed, angle_pointed)
]:
    ax.set_xlim(-80, 80)
    ax.set_ylim(-10, 80)
    # Total force vector
    ax.annotate("", xy=(H*scale*0.6, V*scale*0.6), xytext=(0, 0),
                arrowprops=dict(arrowstyle="->", lw=2.5, color="#7c3aed"))
    # Horizontal component
    ax.annotate("", xy=(H*scale*0.6, 0), xytext=(0, 0),
                arrowprops=dict(arrowstyle="->", lw=2, color="#ef4444"))
    # Vertical component
    ax.annotate("", xy=(0, V*scale*0.6), xytext=(0, 0),
                arrowprops=dict(arrowstyle="->", lw=2, color="#22c55e"))
    ax.set_title(f"{label}\\nH={H/1000:.0f} kN, angle={angle:.0f}°", fontsize=11)
    ax.set_aspect("equal")
    ax.grid(alpha=0.3)
    ax.set_xlabel("Horizontal (kN)")
    ax.set_ylabel("Vertical (kN)")

fig.legend(["Resultant", "H (thrust)", "V (weight)"],
           loc="lower center", ncol=3, fontsize=10)
plt.tight_layout(rect=[0, 0.08, 1, 1])
plt.show()`,
      challenge: 'Add a third arch type: an equilateral pointed arch where rise = span × sin(60°) ≈ span × 0.866. Plot all three. At what rise-to-span ratio does horizontal thrust drop below 25% of the round arch value?',
      successHint: 'Vector decomposition is the fundamental tool of structural analysis. The Gothic builders did not know trigonometry, but they learned through trial and catastrophic failure that steeper arches push walls less. Mathematics later proved what stone had already taught them.',
    },
    {
      title: 'Flying buttresses — external support against lateral thrust',
      concept: `Even a pointed arch produces some horizontal thrust. In a Roman building, you handle this with **thick walls** — brute mass resisting the outward push. But thick walls mean small windows and dark interiors.

The Gothic innovation was the **flying buttress**: an external arch that transfers the wall's lateral thrust to a heavy pier set away from the building. The flying buttress acts as a **strut** — a member in compression that redirects the horizontal force down into the ground through the pier.

The engineering challenge: the pier must be **heavy enough** that its weight creates a vertical force larger than the horizontal thrust trying to tip it over. This is a **moment balance** problem. The thrust creates a tipping moment about the pier's base (H × height). The pier's weight creates a restoring moment (W × half-width). Stability requires: **W × d/2 > H × h**.

At Chartres Cathedral, the flying buttresses span 5 metres from the nave wall to piers that are 2 metres wide and weigh over 100 tonnes each. Without them, the 37-metre-high walls would have collapsed outward within years.

📚 The stability condition: **restoring moment > overturning moment**, or equivalently, **safety factor = (W × d/2) / (H × h) > 1.5** for a comfortable margin.`,
      analogy: 'Stand sideways next to a wall and push it with your hand. Your feet slide on the floor — you cannot push hard. Now brace a heavy bookshelf against the wall. The bookshelf does not move because its weight anchors it to the ground. A flying buttress is that bookshelf: heavy, angled, and anchored by gravity.',
      storyConnection: 'When the builders of Notre-Dame removed the timber centering from the nave vault, the walls began to lean outward under the arch thrust. The flying buttresses were added to catch the walls and push back. They are not decoration — they are emergency medicine for a building trying to spread apart.',
      checkQuestion: 'A pier is 2 m wide, 8 m tall, and weighs 80,000 kg. The flying buttress delivers 150 kN of horizontal thrust at 7 m height. Is the pier stable?',
      checkAnswer: 'Overturning moment = 150,000 N × 7 m = 1,050,000 N·m. Restoring moment = 80,000 × 9.8 × (2/2) = 784,000 N·m. Safety factor = 784,000 / 1,050,000 = 0.75. The pier is NOT stable — it will tip over. The pier needs more mass or width. At 3 m width: restoring moment = 80,000 × 9.8 × 1.5 = 1,176,000 N·m, safety factor = 1.12. Still marginal. Gothic builders often added pinnacles (heavy stone spikes) on top of piers to increase the restoring weight.',
      codeIntro: 'Model flying buttress stability: calculate the pier mass needed for different amounts of thrust.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.8
density_limestone = 2500   # kg/m³

# Flying buttress parameters
thrust_range = np.linspace(50, 400, 100)  # kN
thrust_N = thrust_range * 1000

# Pier geometry
pier_width = 2.0      # m
pier_depth = 2.0      # m (into the page)
pier_height = 10.0    # m
thrust_height = 8.0   # m (where buttress meets pier)
safety_factor = 1.5

# Required pier weight: W > safety_factor * H * h / (d/2)
W_required = safety_factor * thrust_N * thrust_height / (pier_width / 2)
mass_required = W_required / g

# Actual pier mass at given dimensions
pier_volume = pier_width * pier_depth * pier_height
pier_mass = pier_volume * density_limestone
pier_weight = pier_mass * g

print("Flying Buttress Pier Stability Analysis")
print("=" * 55)
print(f"Pier: {pier_width}m × {pier_depth}m × {pier_height}m")
print(f"Pier mass: {pier_mass:,.0f} kg ({pier_mass/1000:.0f} tonnes)")
print(f"Thrust applied at: {thrust_height}m height")
print(f"Required safety factor: {safety_factor}")
print()

# Check specific thrust values
for H_kN in [50, 100, 150, 200, 300]:
    H = H_kN * 1000
    overturning = H * thrust_height
    restoring = pier_weight * (pier_width / 2)
    sf = restoring / overturning
    status = "STABLE" if sf >= safety_factor else "UNSTABLE"
    print(f"  Thrust {H_kN:>3d} kN: SF = {sf:.2f}  {status}")

# Plot
fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(thrust_range, mass_required / 1000, lw=2.5,
        color='#7c3aed', label='Required pier mass')
ax.axhline(pier_mass / 1000, color='#22c55e', lw=2,
           ls='--', label=f'Actual pier ({pier_mass/1000:.0f}t)')

ax.fill_between(thrust_range, mass_required / 1000,
                pier_mass / 1000,
                where=mass_required / 1000 < pier_mass / 1000,
                alpha=0.15, color='#22c55e', label='Safe zone')
ax.fill_between(thrust_range, mass_required / 1000,
                pier_mass / 1000,
                where=mass_required / 1000 > pier_mass / 1000,
                alpha=0.15, color='#ef4444', label='Danger zone')

ax.set_xlabel('Horizontal Thrust (kN)', fontsize=12)
ax.set_ylabel('Pier Mass (tonnes)', fontsize=12)
ax.set_title('Flying Buttress: Required Pier Mass vs Thrust', fontsize=13)
ax.legend(fontsize=10)
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()`,
      challenge: 'Gothic builders added stone pinnacles on top of piers to increase weight. Model adding a 5-tonne pinnacle to the pier. How much additional thrust can the pier now resist? What if you add a 10-tonne pinnacle?',
      successHint: 'The flying buttress is arguably the most important structural innovation of the Middle Ages. It externalized the problem of lateral thrust, freeing the walls from their load-bearing role and transforming them into mere curtains of stone and glass.',
    },
    {
      title: 'Ribbed vaults — concentrating forces to free the walls',
      concept: `A barrel vault (a continuous half-cylinder of stone) distributes its weight uniformly along both walls. Every point on the wall carries load, so the entire wall must be thick and strong. No room for windows.

A **ribbed vault** changes the game. Instead of a continuous shell, the vault is built on a skeleton of stone **ribs** — arched members that carry the concentrated loads. The thin **webbing** between ribs is just filler; it carries almost no structural load. All the vault's weight flows down the ribs to **specific points** on the wall — the column capitals.

Because forces are concentrated at discrete points, the wall **between** those points carries almost no load. Those unloaded wall sections can be removed and replaced with **stained glass windows**. This is why Gothic cathedrals are 80% glass and 20% stone — the ribs redirect all forces to the columns.

The weight distribution follows a simple model: each rib carries the load of the vault panel it borders. A four-part (quadripartite) vault has four ribs meeting at the crown, each carrying roughly one quarter of the total vault weight.

📚 The engineering principle: **concentrate forces at strong points, and the areas between those points become structurally free**. This is also how modern steel-frame buildings work — the frame carries the load, the curtain wall is just weather protection.`,
      analogy: 'Hold a bedsheet by its four corners — all the weight hangs from your four hands (the ribs), and the fabric between (the webbing) is slack and weightless. Now imagine the sheet is a stone vault: the four corners are rib-to-column connections, and the thin panels between carry no load. You could cut holes in the fabric without affecting the structure.',
      storyConnection: 'At Sainte-Chapelle in Paris, the ribbed vault allows walls that are almost entirely stained glass — 15 metres of uninterrupted colour and light. The diagonal ribs collect the vault load and deliver it to slender columns, making the stone walls between them structurally unnecessary.',
      checkQuestion: 'A ribbed vault covers a 10 m × 10 m bay and weighs 200 tonnes total. If the vault has four diagonal ribs meeting at the centre, roughly how much load does each column at the corners carry?',
      checkAnswer: 'Each of the four corner columns carries approximately 200/4 = 50 tonnes. In practice the distribution depends on rib stiffness and geometry, but the quarter-load estimate is a good first approximation. The key point: the wall between columns carries nearly zero load.',
      codeIntro: 'Model weight distribution in a ribbed vault and compare with a barrel vault.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Vault parameters
bay_length = 10.0     # m
bay_width = 10.0      # m
vault_thickness = 0.2  # m (thin webbing)
density = 2500         # kg/m³
g = 9.8

# Total vault weight
vault_area = bay_length * bay_width
vault_mass = vault_area * vault_thickness * density
vault_weight = vault_mass * g

print("RIBBED VAULT vs BARREL VAULT")
print("=" * 55)
print(f"Bay: {bay_length}m × {bay_width}m")
print(f"Total vault mass: {vault_mass:,.0f} kg")
print(f"Total vault weight: {vault_weight/1000:,.1f} kN")
print()

# --- Barrel vault: load distributed along two walls ---
print("BARREL VAULT (continuous)")
wall_load_per_metre = vault_weight / (2 * bay_length)
print(f"  Load on each wall: {vault_weight/2/1000:.1f} kN total")
print(f"  Load per metre of wall: {wall_load_per_metre/1000:.2f} kN/m")
print(f"  Wall must be load-bearing EVERYWHERE")
print(f"  Window area possible: ~20% of wall")
print()

# --- Ribbed vault: load at 4 corner columns ---
print("QUADRIPARTITE RIBBED VAULT")
n_columns = 4
column_load = vault_weight / n_columns
print(f"  Load per column: {column_load/1000:.1f} kN")
print(f"  Load on wall between columns: ~0 kN")
print(f"  Window area possible: ~80% of wall")
print()

# --- Sexpartite vault: 6 ribs, 6 load points ---
print("SEXPARTITE RIBBED VAULT (6-part)")
n_columns_6 = 6
column_load_6 = vault_weight / n_columns_6
print(f"  Load per column: {column_load_6/1000:.1f} kN")
print(f"  Even more wall freed for glass")
print()

# --- Visualise load distribution along one wall ---
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Barrel vault: uniform load
x_wall = np.linspace(0, bay_length, 200)
barrel_load = np.ones_like(x_wall) * wall_load_per_metre / 1000

axes[0].fill_between(x_wall, barrel_load, alpha=0.3, color='#ef4444')
axes[0].plot(x_wall, barrel_load, lw=2, color='#ef4444')
axes[0].set_title('Barrel Vault: Uniform Wall Load', fontsize=12)
axes[0].set_xlabel('Position along wall (m)')
axes[0].set_ylabel('Load (kN/m)')
axes[0].set_ylim(0, max(barrel_load) * 3)
axes[0].text(5, max(barrel_load) * 2, 'Entire wall\\nmust be solid',
             ha='center', fontsize=11, color='#ef4444')

# Ribbed vault: point loads at columns
col_positions = [0, bay_length]
col_loads_kN = [column_load / 1000] * 2
axes[1].bar(col_positions, col_loads_kN, width=0.4,
            color='#7c3aed', alpha=0.8)
axes[1].set_title('Ribbed Vault: Point Loads at Columns', fontsize=12)
axes[1].set_xlabel('Position along wall (m)')
axes[1].set_ylabel('Load (kN)')
axes[1].set_xlim(-1, bay_length + 1)
axes[1].set_ylim(0, max(col_loads_kN) * 1.5)
axes[1].annotate('FREE — glass here!',
                 xy=(5, 0), fontsize=12, color='#22c55e',
                 ha='center', va='bottom',
                 bbox=dict(boxstyle='round', fc='#22c55e', alpha=0.15))

for ax in axes:
    ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()`,
      challenge: 'Add an octapartite (8-rib) vault and a fan vault with 12 ribs. How does the load per column decrease as you add more ribs? At what point do the columns become so slender they risk buckling? (Use Euler\'s formula with E = 30 GPa for limestone.)',
      successHint: 'Ribbed vaults are the structural trick that made Gothic architecture possible. By concentrating forces at discrete points, they freed 80% of the wall from any structural role — and those freed walls became canvases of coloured light.',
    },
    {
      title: 'Reverberation — the acoustics of sacred space',
      concept: `Walk into a Gothic cathedral and clap your hands. The sound does not stop when you stop clapping — it lingers for **5 to 10 seconds**, wrapping around you in waves of echo. This is **reverberation**, and it is why cathedral music sounds transcendent.

The physicist **Wallace Sabine** (1898) derived the formula: **T₆₀ = 0.161 × V / A**, where T₆₀ is the reverberation time in seconds (time for sound to decay by 60 dB), V is the room volume in m³, and A is the total **absorption** in sabins (m²).

Absorption A = Σ(surface area × absorption coefficient α). Stone has α ≈ 0.02 (it reflects 98% of sound). Wood panelling has α ≈ 0.10. Carpet has α ≈ 0.50. A cathedral with vast volume and hard stone surfaces has enormous V and tiny A — yielding reverberation times of 5–10 seconds.

This long reverberation is why Gregorian chant was composed with **slow, sustained notes** and no rhythmic complexity. Fast passages would blur into mush in a 6-second reverb. The architecture shaped the music, and the music shaped the architecture.

📚 The Sabine equation: **T₆₀ = 0.161V / A**. Larger rooms and harder surfaces = longer reverb. Smaller rooms and softer surfaces = shorter reverb.`,
      analogy: 'Shout in a tiled bathroom — the sound rings. Shout in a carpeted bedroom — it dies instantly. The bathroom has hard, reflective surfaces (low absorption) and the bedroom has soft, absorptive surfaces (high absorption). A cathedral is like a bathroom the size of a football field.',
      storyConnection: 'The nave of Notre-Dame de Paris has a volume of roughly 100,000 m³. Its limestone walls absorb almost no sound. The result: a reverberation time of about 6 seconds that turns a single sung note into a shimmering cloud of harmonics. The architects may not have known Sabine\'s equation, but they heard the result and designed the liturgy to match.',
      checkQuestion: 'A cathedral has a volume of 80,000 m³. Its total interior surface area is 20,000 m² of limestone (α = 0.02). What is the reverberation time? What happens if you fill 5,000 m² of the floor with wooden pews (α = 0.10)?',
      checkAnswer: 'Without pews: A = 20,000 × 0.02 = 400 sabins. T₆₀ = 0.161 × 80,000 / 400 = 32.2 seconds — extremely long. With pews: A = 15,000 × 0.02 + 5,000 × 0.10 = 300 + 500 = 800 sabins. T₆₀ = 0.161 × 80,000 / 800 = 16.1 seconds — halved, but still very long. Adding a congregation (people absorb a lot of sound, α ≈ 0.40) drops it further to a more realistic 5–8 seconds.',
      codeIntro: 'Calculate reverberation time for different cathedral configurations using the Sabine equation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def sabine_reverb(volume, surfaces):
    """Calculate T60 using Sabine equation.
    surfaces: list of (area_m2, absorption_coeff) tuples"""
    A = sum(area * alpha for area, alpha in surfaces)
    if A == 0:
        return float('inf')
    return 0.161 * volume / A

# Absorption coefficients
alpha_stone = 0.02
alpha_wood = 0.10
alpha_glass = 0.03
alpha_carpet = 0.50
alpha_people = 0.40    # per person ≈ 0.5 m² at α=0.40

# --- Notre-Dame de Paris (approximate) ---
volume = 100000  # m³
stone_area = 18000
glass_area = 2000
floor_area = 5500

print("NOTRE-DAME DE PARIS — Acoustic Analysis")
print("=" * 55)
print(f"Volume: {volume:,} m³")
print()

configs = [
    ("Empty cathedral", [
        (stone_area, alpha_stone),
        (glass_area, alpha_glass),
        (floor_area, alpha_stone),
    ]),
    ("With wooden pews (2000 m²)", [
        (stone_area, alpha_stone),
        (glass_area, alpha_glass),
        (floor_area - 2000, alpha_stone),
        (2000, alpha_wood),
    ]),
    ("Pews + 500 people", [
        (stone_area, alpha_stone),
        (glass_area, alpha_glass),
        (floor_area - 2000, alpha_stone),
        (2000, alpha_wood),
        (250, alpha_people),   # 500 people × 0.5 m² each
    ]),
    ("Pews + 2000 people (full mass)", [
        (stone_area, alpha_stone),
        (glass_area, alpha_glass),
        (floor_area - 2000, alpha_stone),
        (2000, alpha_wood),
        (1000, alpha_people),
    ]),
]

times = []
labels = []
for name, surfaces in configs:
    t60 = sabine_reverb(volume, surfaces)
    A_total = sum(a * c for a, c in surfaces)
    times.append(t60)
    labels.append(name)
    print(f"  {name}")
    print(f"    Total absorption: {A_total:,.0f} sabins")
    print(f"    T60 = {t60:.1f} seconds")
    print()

# --- Compare with other spaces ---
print("COMPARISON WITH OTHER SPACES")
print("-" * 40)
other = [
    ("Living room", 50, [(60, 0.15), (20, 0.50)]),
    ("Concert hall", 20000, [(5000, 0.08), (2000, 0.30), (800, 0.40)]),
    ("Recording studio", 200, [(100, 0.60), (80, 0.80)]),
]
for name, vol, surf in other:
    t = sabine_reverb(vol, surf)
    print(f"  {name}: T60 = {t:.2f} s")
    times.append(t)
    labels.append(name)

# Plot
fig, ax = plt.subplots(figsize=(10, 5))
colors = ['#7c3aed', '#7c3aed', '#7c3aed', '#7c3aed',
          '#60a5fa', '#60a5fa', '#60a5fa']
ax.barh(range(len(times)), times, color=colors, alpha=0.8)
ax.set_yticks(range(len(times)))
ax.set_yticklabels(labels, fontsize=9)
ax.set_xlabel('Reverberation Time T60 (seconds)', fontsize=12)
ax.set_title('Sabine Reverberation: Cathedrals vs Other Spaces', fontsize=13)
ax.grid(axis='x', alpha=0.3)
plt.tight_layout()
plt.show()`,
      challenge: 'Model what happens when you add thick tapestries (α = 0.40) to 3,000 m² of the stone walls — as many medieval cathedrals actually had. How much does this reduce the reverberation time? Why might the removal of tapestries over centuries have changed how we hear cathedral music today?',
      successHint: 'The Sabine equation connects architecture to sound in a single formula. Gothic cathedrals were not designed for acoustics — they were designed for God — but the physics of their enormous stone volumes created the reverberant sound that defined sacred music for a thousand years.',
    },
    {
      title: 'Structural limits — the collapse of Beauvais Cathedral',
      concept: `Gothic builders competed to build the tallest vaults. Laon reached 24 m. Paris: 33 m. Chartres: 37 m. Amiens: 42 m. Then Beauvais attempted **48 metres** — and in 1284, the vault collapsed.

Why 48 m? The answer lies in the **compressive strength** of limestone. The stress at the base of a column is σ = ρgh, where ρ is density, g is gravity, and h is height. For limestone (ρ = 2500 kg/m³), the stress at the base of a 48 m column is: 2500 × 9.8 × 48 = **1.176 MPa**. This is well below limestone's compressive strength of ~40 MPa, so the columns themselves were not the problem.

The failure was in the **vault ribs**. The ribs are not vertical columns — they are curved, carrying both vertical load and lateral thrust. The total compressive force in a rib depends on both the weight above AND the horizontal thrust. At 48 m height, the thrust forces, amplified by the vault geometry, pushed the effective stress past the stone's limits at critical joints.

The deeper issue: structural **slenderness**. As vaults get taller, the columns and ribs get thinner relative to their height. Beyond a certain ratio, they fail by **buckling** before they fail by crushing. Beauvais exceeded both limits simultaneously.

📚 The maximum theoretical height for a limestone column: **h_max = σ_max / (ρg) = 40,000,000 / (2500 × 9.8) ≈ 1,633 m**. But that is a solid column with no lateral forces. Add vault thrust, wind, and slenderness, and the practical limit drops to roughly 50–60 m — exactly where Gothic builders discovered it the hard way.`,
      analogy: 'Build a tower of playing cards. Each level you add makes the tower taller but also more precarious. There is a height beyond which no amount of care can prevent collapse — the cards are too slender, the forces too amplified. Beauvais Cathedral was the tallest card tower medieval engineering could attempt.',
      storyConnection: 'After the 1284 collapse, Beauvais was rebuilt with additional buttresses and intermediate piers. The builders then attempted a 153 m crossing tower in 1569 — it collapsed in 1573. Beauvais was never completed. It stands today as a monument to the structural limits of stone: beautiful, broken, and profoundly instructive.',
      checkQuestion: 'What is the compressive stress at the base of a 60 m limestone column (density 2500 kg/m³)? Compare this to limestone\'s compressive strength of 40 MPa. Is height alone the problem?',
      checkAnswer: 'Stress = 2500 × 9.8 × 60 / 1,000,000 = 1.47 MPa. This is only 3.7% of the 40 MPa limit — the column is nowhere near being crushed by its own weight. Height alone is NOT the problem. The real killers are lateral thrust from the vault (which adds enormous compressive force in the ribs), wind loads, and buckling of slender members. The Beauvais collapse was a system failure, not a simple overloading.',
      codeIntro: 'Model the structural limits of Gothic vaults: find the maximum height before stress or buckling causes failure.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material properties — limestone
sigma_max = 40.0      # MPa compressive strength
rho = 2500            # kg/m³
g = 9.8               # m/s²
E = 30e9              # Young's modulus (Pa)

# Vault heights from 10 to 80 m
heights = np.linspace(10, 80, 200)

# --- 1. Self-weight stress ---
self_stress = rho * g * heights / 1e6   # MPa

# --- 2. Vault thrust stress (simplified model) ---
# Thrust adds compressive stress in ribs proportional to H²
# Model: total rib stress ≈ self_weight + k * H²
# k calibrated so that at 48m, total stress ≈ 30 MPa
k_thrust = (30 - rho * g * 48 / 1e6) / 48**2
thrust_stress = k_thrust * heights**2
total_stress = self_stress + thrust_stress

# --- 3. Euler buckling of rib (simplified) ---
rib_width = 0.4       # m
rib_depth = 0.5       # m
I_rib = rib_width * rib_depth**3 / 12
# Effective rib length ~ 0.6 × vault height (curved path)
L_eff = 0.6 * heights
P_buckle = np.pi**2 * E * I_rib / L_eff**2
rib_area = rib_width * rib_depth
buckle_stress = P_buckle / rib_area / 1e6   # MPa

print("GOTHIC VAULT HEIGHT LIMITS")
print("=" * 60)
print(f"Limestone: σ_max = {sigma_max} MPa, ρ = {rho} kg/m³")
print(f"Rib section: {rib_width}m × {rib_depth}m")
print()
print(f"{'Height':>8s} {'Self σ':>8s} {'Thrust σ':>9s} {'Total σ':>9s}"
      f" {'Buckle σ':>9s} {'Status':>12s}")
print("-" * 60)

cathedrals = {24: "Laon", 33: "Paris", 37: "Chartres",
              42: "Amiens", 48: "Beauvais"}

for h in [20, 24, 30, 33, 37, 42, 48, 55, 60]:
    ss = rho * g * h / 1e6
    ts = k_thrust * h**2
    total = ss + ts
    L = 0.6 * h
    Pb = np.pi**2 * E * I_rib / L**2
    bs = Pb / rib_area / 1e6
    limit = min(sigma_max, bs)
    status = "OK" if total < limit else "FAILURE"
    name = cathedrals.get(h, "")
    print(f"  {h:>4d} m  {ss:>7.2f}  {ts:>8.2f}  {total:>8.2f}"
          f"  {bs:>8.1f}  {status:>8s}  {name}")

# --- Plot ---
fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(heights, total_stress, lw=2.5, color='#ef4444',
        label='Total stress (weight + thrust)')
ax.plot(heights, buckle_stress, lw=2, color='#f59e0b',
        ls='--', label='Buckling limit')
ax.axhline(sigma_max, color='#22c55e', lw=2, ls=':',
           label=f'Compressive strength ({sigma_max} MPa)')

# Mark actual cathedrals
for h, name in cathedrals.items():
    ss = rho * g * h / 1e6
    ts = k_thrust * h**2
    total = ss + ts
    color = '#ef4444' if name == 'Beauvais' else '#7c3aed'
    ax.plot(h, total, 'o', ms=10, color=color, zorder=5)
    ax.annotate(f'{name}\\n{h}m', (h, total),
                textcoords="offset points", xytext=(10, 8),
                fontsize=9, color=color)

ax.set_xlabel('Vault Height (m)', fontsize=12)
ax.set_ylabel('Stress (MPa)', fontsize=12)
ax.set_title('Gothic Vault Limits: The Race to the Sky', fontsize=14)
ax.legend(fontsize=10)
ax.grid(alpha=0.3)
ax.set_xlim(10, 70)
ax.set_ylim(0, 60)
plt.tight_layout()
plt.show()

print()
print("Beauvais at 48m sits right at the intersection of")
print("material strength and buckling limits — the absolute")
print("edge of what limestone Gothic construction can achieve.")`,
      challenge: 'What if the builders had access to steel ribs (σ_max = 250 MPa, E = 200 GPa, ρ = 7800 kg/m³)? Recalculate the maximum vault height. Then try reinforced concrete (σ_max = 40 MPa, E = 30 GPa, ρ = 2400 kg/m³ but with steel rebar handling tension). How do modern materials change the height limit?',
      successHint: 'Beauvais Cathedral is the most important structural failure in architectural history. It marks the exact boundary where Gothic ambition exceeded the physics of stone. Every vault built after Beauvais was shorter — the builders had found nature\'s ceiling, written not in scripture but in stress and strain.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Structural engineering, acoustics, and material science through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model arch mechanics, force vectors, flying buttresses, ribbed vaults, cathedral acoustics, and structural failure.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`cathedrals-l1-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
