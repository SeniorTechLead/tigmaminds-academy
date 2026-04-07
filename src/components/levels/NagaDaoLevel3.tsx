import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NagaDaoLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Diffusion equations — carbon migration during heat treatment',
      concept: `Carbon moves through iron by **diffusion**, governed by Fick's Second Law:

**∂C/∂t = D × ∂²C/∂x²**

The diffusion coefficient D depends exponentially on temperature:
**D = D₀ × exp(-Q/RT)**

Where D₀ = 2.3×10⁻⁵ m²/s, Q = 148,000 J/mol (activation energy), R = 8.314 J/(mol·K).

At 900°C: D ≈ 1.7×10⁻¹¹ m²/s (carbon moves ~0.1 mm in 1 hour)
At 500°C: D ≈ 3×10⁻¹⁵ m²/s (virtually frozen)

This explains why carbon redistribution only happens at high temperatures and why quenching "freezes" the carbon in place.

📚 *The diffusion equation is a partial differential equation (PDE). We solve it numerically using finite differences on a spatial grid, stepping forward in time.*`,
      analogy: 'Carbon diffusion in iron is like ink spreading in water. Drop ink (carbon) into still water (iron) at room temperature — it barely moves. Heat the water — ink spreads rapidly. The hotter the water, the faster the spreading. Quenching (cooling rapidly) is like freezing the water — the ink stops wherever it was when the freeze hit.',
      storyConnection: 'When the Naga blacksmith carburizes the dao (adds carbon by heating in charcoal), carbon diffuses from the surface inward. The depth of carbon penetration depends on time and temperature — exactly what Fick\'s Law predicts. An hour in the forge at 900°C produces a carbon-rich layer about 0.5 mm deep.',
      checkQuestion: 'Why does the blacksmith hold the dao in the forge for a specific time, not just "until it is hot enough"?',
      checkAnswer: 'Temperature determines IF carbon moves; time determines HOW FAR it moves. Reaching 900°C is necessary for diffusion, but the depth of the carbon-enriched layer grows as the square root of time: depth ∝ √(D×t). One hour at 900°C gives ~0.5 mm depth. Four hours gives ~1 mm. The blacksmith\'s holding time directly controls the thickness of the hard surface layer.',
      codeIntro: 'Simulate carbon diffusion during the carburizing process using finite differences.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fick's Second Law: dC/dt = D * d²C/dx²
# Finite difference solution

# Material parameters
D0 = 2.3e-5  # m²/s
Q = 148000   # J/mol
R = 8.314    # J/(mol·K)

def diffusion_coeff(T_celsius):
    T_kelvin = T_celsius + 273.15
    return D0 * np.exp(-Q / (R * T_kelvin))

# Spatial grid (blade cross-section)
L = 0.005  # 5 mm half-thickness
nx = 100
dx = L / nx
x = np.linspace(0, L * 1000, nx)  # mm

# Initial carbon profile: uniform 0.3%, surface at 1.0% (charcoal environment)
C_initial = 0.3  # % carbon
C_surface = 1.0  # % carbon at surface during carburizing

# Simulate at different temperatures
temperatures = [800, 900, 1000]
time_hours = 2.0
dt_factor = 0.4  # stability factor

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

colors_time = ['#60a5fa', '#10b981', '#f59e0b', '#f87171', '#a78bfa']

print("Carbon Diffusion During Carburizing")
print("=" * 55)

for idx, T in enumerate(temperatures):
    D = diffusion_coeff(T)
    dt = dt_factor * dx**2 / D  # CFL condition for stability
    n_steps = int(time_hours * 3600 / dt)

    C = np.full(nx, C_initial)
    C[0] = C_surface  # boundary condition

    # Store snapshots
    snapshot_times = [0, 0.25, 0.5, 1.0, 2.0]
    snapshots = {0: C.copy()}

    elapsed = 0
    for step in range(n_steps):
        C_new = C.copy()
        for i in range(1, nx-1):
            C_new[i] = C[i] + D * dt / dx**2 * (C[i+1] - 2*C[i] + C[i-1])
        C_new[0] = C_surface  # maintain surface condition
        C_new[-1] = C_new[-2]  # zero flux at center
        C = C_new
        elapsed += dt

        hours = elapsed / 3600
        for st in snapshot_times:
            if st not in snapshots and hours >= st:
                snapshots[st] = C.copy()

    for i, (t, profile) in enumerate(sorted(snapshots.items())):
        axes[idx].plot(x, profile, color=colors_time[i], linewidth=2,
                      label=f't = {t:.2f} h' if t < 1 else f't = {t:.1f} h')

    axes[idx].set_xlabel('Depth from surface (mm)', color='white', fontsize=10)
    axes[idx].set_ylabel('Carbon %', color='white', fontsize=10)
    axes[idx].set_title(f'T = {T}°C (D = {D:.1e} m²/s)', color='white', fontsize=11, fontweight='bold')
    axes[idx].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
    axes[idx].set_ylim(0.2, 1.1)

    # Measure penetration depth (where C drops to 0.4%)
    depth_04 = x[np.searchsorted(-C, -0.4)] if np.any(C > 0.4) else 0
    print(f"  {T}°C: D = {D:.2e} m²/s | Carbon depth (>0.4%): {depth_04:.2f} mm after {time_hours}h")

plt.suptitle("Carbon Diffusion in Dao Steel  -  Fick's Law", color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()`,
      challenge: 'Simulate a two-step process: 1 hour at 1000°C (deep carburizing) followed by 1 hour at 800°C (slower, more uniform). Compare with 2 hours at 900°C. Which produces a better gradient?',
      successHint: 'You have numerically solved Fick\'s diffusion equation — one of the most important PDEs in materials science. The same equation governs heat conduction, chemical reactions, and many other transport processes.',
    },
    {
      title: 'Phase transformation kinetics — TTT diagrams',
      concept: `**Time-Temperature-Transformation (TTT) diagrams** show which crystal phases form during cooling at different rates.

When austenite (high-temperature phase) cools:
- **Very slow** (furnace cool): forms coarse pearlite (soft)
- **Moderate** (air cool): forms fine pearlite (medium hardness)
- **Fast** (oil quench): forms bainite (hard, tough)
- **Very fast** (water quench): forms martensite (very hard, brittle)

The TTT diagram has a characteristic **C-shape** (or nose):
- Above the nose: diffusion-controlled transformation → pearlite
- At the nose: fastest transformation rate
- Below the nose: diffusion too slow → transformation delayed
- Missing the nose entirely: → martensite (no time for diffusion)

📚 *Parametric curves (plotting one function against another) create the C-shaped TTT curve. np.exp() models the Arrhenius temperature dependence.*`,
      analogy: 'The TTT diagram is like a maze that the steel must navigate during cooling. Different cooling speeds take different paths through the maze. A slow path (furnace cooling) follows the main corridor to "Pearlite City." A fast path (water quench) blasts past all intersections and arrives at "Martensite Town." The Naga blacksmith\'s quenching technique determines which path the steel takes through this maze.',
      storyConnection: 'When the Naga blacksmith quenches the dao in water, they are racing the steel past the "nose" of the TTT diagram. If they pause (quench too slowly), pearlite forms and the blade stays soft. The water quench cools the steel fast enough to miss the nose entirely, trapping carbon in the hard martensitic structure.',
      checkQuestion: 'Why does oil quenching produce a different result than water quenching?',
      checkAnswer: 'Oil cools steel more slowly than water because oil has lower thermal conductivity and forms an insulating vapor layer (Leidenfrost effect). The slower cooling allows the steel to spend more time near the nose of the TTT diagram, where bainite can form. Bainite is harder than pearlite but tougher than martensite. Oil quenching produces a blade that is hard but less likely to crack than water quenching. This is why some blacksmiths prefer oil for high-carbon steels — it reduces the risk of quench cracking.',
      codeIntro: 'Generate a TTT diagram for the Naga dao steel composition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# TTT diagram for 0.5% carbon steel
# C-curve model: time = A * exp(B/(T-T_nose)^2)
T_nose = 550  # °C (nose of the C-curve)
T_range = np.linspace(200, 720, 200)

# Pearlite start/finish
A_start = 0.5; B_start = 8000
A_finish = 50; B_finish = 8000

t_pearlite_start = A_start * np.exp(B_start / ((T_range - T_nose)**2 + 500))
t_pearlite_finish = A_finish * np.exp(B_finish / ((T_range - T_nose)**2 + 500))

# Bainite region (lower C-curve)
T_bainite = T_range[T_range < 500]
t_bainite_start = 1 * np.exp(5000 / ((T_bainite - 350)**2 + 400))
t_bainite_finish = 100 * np.exp(5000 / ((T_bainite - 350)**2 + 400))

# Martensite start/finish lines (temperature-dependent, not time-dependent)
Ms = 350  # martensite start
Mf = 150  # martensite finish

ax1 = axes[0]
ax1.plot(t_pearlite_start, T_range, color='#f87171', linewidth=2.5, label='Pearlite start')
ax1.plot(t_pearlite_finish, T_range, color='#f87171', linewidth=2.5, linestyle='--', label='Pearlite finish')
ax1.plot(t_bainite_start, T_bainite, color='#f59e0b', linewidth=2.5, label='Bainite start')
ax1.plot(t_bainite_finish, T_bainite, color='#f59e0b', linewidth=2.5, linestyle='--', label='Bainite finish')
ax1.axhline(y=Ms, color='#60a5fa', linewidth=2, label=f'Ms = {Ms}°C')
ax1.axhline(y=Mf, color='#60a5fa', linewidth=2, linestyle='--', label=f'Mf = {Mf}°C')

# Fill regions
ax1.text(5, 650, 'PEARLITE\n(soft)', color='#f87171', fontsize=10, ha='center', fontweight='bold')
ax1.text(10, 430, 'BAINITE\n(hard, tough)', color='#f59e0b', fontsize=10, ha='center', fontweight='bold')
ax1.text(0.3, 250, 'MARTENSITE\n(very hard)', color='#60a5fa', fontsize=10, ha='center', fontweight='bold')
ax1.text(0.1, 700, 'AUSTENITE\n(unstable)', color='white', fontsize=10, ha='center', alpha=0.5)

# Cooling curves
cooling_rates = [
    ('Furnace cool', np.logspace(0, 4, 100), 720 - 520 * np.linspace(0, 1, 100), '#9ca3af'),
    ('Air cool', np.logspace(-0.5, 3, 100), 720 - 600 * np.linspace(0, 1, 100)**0.7, '#a78bfa'),
    ('Oil quench', np.logspace(-1, 2, 100), 720 - 600 * np.linspace(0, 1, 100)**0.4, '#10b981'),
    ('Water quench', np.logspace(-1.5, 1, 100), 720 - 650 * np.linspace(0, 1, 100)**0.3, '#60a5fa'),
]

for name, t, T, color in cooling_rates:
    ax1.plot(t, T, color=color, linewidth=2.5, linestyle=':', label=name)

ax1.set_xscale('log')
ax1.set_xlabel('Time (seconds)', color='white', fontsize=11)
ax1.set_ylabel('Temperature (°C)', color='white', fontsize=11)
ax1.set_title('TTT Diagram  -  0.5% C Steel', color='white', fontsize=13, fontweight='bold')
ax1.set_xlim(0.05, 1e4); ax1.set_ylim(100, 750)
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=7, loc='upper right')

# Resulting hardness for each cooling rate
ax2 = axes[1]
methods = ['Furnace\\ncool', 'Air\\ncool', 'Oil\\nquench', 'Water\\nquench']
hardness = [20, 35, 50, 63]
phases = ['Coarse pearlite', 'Fine pearlite', 'Bainite', 'Martensite']
bar_colors = ['#9ca3af', '#a78bfa', '#10b981', '#60a5fa']

bars = ax2.bar(methods, hardness, color=bar_colors, edgecolor='white', linewidth=0.5, width=0.6)
for bar, h, phase in zip(bars, hardness, phases):
    ax2.text(bar.get_x() + bar.get_width()/2, h + 1, f'{h} HRC\n{phase}',
             ha='center', color='white', fontsize=9)

ax2.set_ylabel('Hardness (HRC)', color='white', fontsize=11)
ax2.set_title('Resulting Hardness by Cooling Method', color='white', fontsize=13, fontweight='bold')

# Mark dao target
ax2.axhspan(48, 55, alpha=0.15, color='#f59e0b')
ax2.text(2.5, 51.5, 'Dao target range', color='#f59e0b', fontsize=10, fontweight='bold')

plt.suptitle('Phase Transformation Kinetics', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

print("The Naga dao process:")
print("  1. Water quench → martensite (63 HRC, too brittle)")
print("  2. Temper at 220-260°C → tempered martensite (50-54 HRC)")
print("  This two-step process gives hardness between oil quench and water quench")
print("  with better toughness than either alone.")`,
      challenge: 'Model a "interrupted quench": water quench for 5 seconds (to 400°C), then air cool. What phases form? Hint: the steel enters the bainite region after the initial quench. What hardness would you expect?',
      successHint: 'TTT diagrams are the roadmap for heat treatment. The Naga blacksmith\'s water quench takes the steel on the fastest path through this diagram, missing the pearlite nose and arriving at martensite — exactly as predicted by the theory.',
    },
    {
      title: 'Stress analysis in the blade — FEA of chopping impact',
      concept: `When a dao strikes a target, enormous stresses develop in the blade. A **finite element analysis** reveals where the blade is most likely to fail:

- **Edge**: compressive stress from impact (hardest region, resists well)
- **Spine**: tensile stress from bending (toughest region, absorbs well)
- **Transition zone**: maximum shear stress (vulnerable if heat treatment is wrong)

The von Mises stress criterion determines when yielding occurs:
**σ_vm = sqrt(σ₁² + σ₂² - σ₁σ₂ + 3τ²)**

Yielding when σ_vm ≥ σ_yield.

The differential temper (hard edge, soft spine) is optimized for this stress distribution: the hardest material is where compressive stress is highest, and the toughest material is where tensile/shear stress is highest.

📚 *2D stress fields can be computed on a grid and visualized with imshow() or contourf(). The gradient of the displacement field gives strain, and strain × stiffness gives stress.*`,
      analogy: 'A chopping impact is like a beam bending test. The bottom of the beam (blade edge) is compressed, the top (spine) is stretched, and the middle (neutral axis) has maximum shear. A smart design puts the strongest material where it faces the worst stress — which is exactly what the differential temper does.',
      storyConnection: 'When a Naga villager chops bamboo with the dao, the blade bends microscopically. The hard edge resists the compression of impact while the tough spine absorbs the bending. If both were equally hard, the spine would crack. If both were equally tough, the edge would dull immediately.',
      checkQuestion: 'Why does the transition zone between hard edge and soft spine need careful heat treatment?',
      checkAnswer: 'The transition zone has the steepest gradient in hardness and toughness. Abrupt transitions create stress concentrations where cracks can initiate. A gradual transition (which the Naga blacksmith achieves through careful tempering) distributes stress over a wider zone, preventing crack nucleation. This is the same principle as the gradient structure in the hornbill casque — gradual transitions are always stronger than abrupt ones.',
      codeIntro: 'Simulate the stress distribution in a dao blade during a chopping impact.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified 2D stress analysis of dao cross-section during impact
# Blade geometry
blade_height = 40  # mm (edge to spine)
blade_width = 4    # mm (thickness at spine)
edge_width = 0.5   # mm (thickness at edge)

ny, nx = 80, 20  # grid points
y = np.linspace(0, blade_height, ny)  # 0 = edge, 40 = spine
x = np.linspace(0, blade_width, nx)

# Blade profile: tapers from spine to edge
width_at_y = edge_width + (blade_width - edge_width) * (y / blade_height)

# Material properties (differential temper)
# Hardness gradient: hard at edge, soft at spine
hardness = 60 - 20 * (y / blade_height)  # HRC
yield_strength = 300 + 15 * hardness  # MPa (approximate)
youngs_modulus = 200e3 * (1 + 0.005 * (hardness - 40))  # MPa

# Impact loading: 500 N at the edge, bending moment
F_impact = 500  # N
moment_arm = y  # mm from edge

# Bending stress distribution (beam theory)
# I = width * height^3 / 12 for rectangular cross-section
# sigma = M * y_from_neutral / I
neutral_axis = blade_height * 0.4  # below center due to taper
y_from_neutral = y - neutral_axis
I_approx = np.mean(width_at_y) * blade_height**3 / 12  # mm^4
M = F_impact * blade_height  # N·mm

bending_stress = M * y_from_neutral / I_approx  # MPa

# Contact stress at edge (pressure = F/A)
contact_area = edge_width * 1  # mm² (1 mm contact length)
contact_stress = -F_impact / contact_area  # compressive (negative)

# Total stress field (2D)
Y, X = np.meshgrid(y, x, indexing='ij')
# Width varies with height
valid = X < width_at_y[:, np.newaxis]

stress_field = np.zeros((ny, nx))
for j in range(ny):
    for i in range(nx):
        if valid[j, i]:
            # Bending component
            stress_field[j, i] = bending_stress[j]
            # Add contact stress near edge
            if j < 5:
                stress_field[j, i] += contact_stress * (1 - j/5)

# Safety factor
sf_field = np.zeros_like(stress_field)
for j in range(ny):
    for i in range(nx):
        if valid[j, i] and abs(stress_field[j, i]) > 0:
            sf_field[j, i] = yield_strength[j] / abs(stress_field[j, i])

fig, axes = plt.subplots(1, 3, figsize=(15, 6))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')

# Stress field
stress_masked = np.ma.masked_where(~valid, stress_field)
im1 = axes[0].imshow(stress_masked, cmap='RdBu_r', origin='lower',
                      extent=[0, blade_width, 0, blade_height], aspect='auto')
axes[0].set_xlabel('Width (mm)', color='white', fontsize=10)
axes[0].set_ylabel('Height: Edge → Spine (mm)', color='white', fontsize=10)
axes[0].set_title('Stress (MPa)', color='white', fontsize=12, fontweight='bold')
cb1 = plt.colorbar(im1, ax=axes[0], shrink=0.8)
cb1.ax.tick_params(colors='white')
cb1.set_label('Stress (MPa) [blue=compression, red=tension]', color='white')

# Hardness gradient
axes[1].plot(hardness, y, color='#f59e0b', linewidth=3)
axes[1].fill_betweenx(y, hardness, 30, alpha=0.2, color='#f59e0b')
axes[1].set_xlabel('Hardness (HRC)', color='white', fontsize=10)
axes[1].set_ylabel('Height: Edge → Spine (mm)', color='white', fontsize=10)
axes[1].set_title('Differential Temper Profile', color='white', fontsize=12, fontweight='bold')
axes[1].text(55, 5, 'Hard edge\n(wear resistant)', color='#f87171', fontsize=9, ha='center')
axes[1].text(42, 35, 'Tough spine\n(impact resistant)', color='#10b981', fontsize=9, ha='center')
for s in ['top','right']: axes[1].spines[s].set_visible(False)
for s in ['bottom','left']: axes[1].spines[s].set_color('white')

# Safety factor
sf_masked = np.ma.masked_where(~valid | (sf_field == 0), np.clip(sf_field, 0, 5))
im3 = axes[2].imshow(sf_masked, cmap='RdYlGn', origin='lower', vmin=0.5, vmax=4,
                      extent=[0, blade_width, 0, blade_height], aspect='auto')
axes[2].set_xlabel('Width (mm)', color='white', fontsize=10)
axes[2].set_ylabel('Height: Edge → Spine (mm)', color='white', fontsize=10)
axes[2].set_title('Safety Factor', color='white', fontsize=12, fontweight='bold')
cb3 = plt.colorbar(im3, ax=axes[2], shrink=0.8)
cb3.ax.tick_params(colors='white')
cb3.set_label('Safety Factor (green=safe, red=yielding)', color='white')

plt.suptitle('Naga Dao: Stress Analysis During Chopping Impact', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

# Find minimum safety factor
sf_valid = sf_field[valid & (sf_field > 0)]
if len(sf_valid) > 0:
    min_sf = np.min(sf_valid)
    min_loc = np.unravel_index(np.argmin(np.where(valid & (sf_field > 0), sf_field, 999)), sf_field.shape)
    print(f"Minimum safety factor: {min_sf:.2f} at height {y[min_loc[0]]:.0f} mm")
    print(f"  (This is {'the edge' if min_loc[0] < 10 else 'the transition zone' if min_loc[0] < 30 else 'the spine'})")
print(f"Edge compressive stress: {contact_stress:.0f} MPa (edge hardness handles this)")
print(f"Spine tensile stress: {bending_stress[-1]:.0f} MPa (spine toughness handles this)")
print(f"The differential temper matches material properties to stress requirements!")`,
      challenge: 'What happens if the blade is uniformly tempered to 50 HRC (no differential temper)? Recalculate the safety factor field. Where does it fail first — edge or spine?',
      successHint: 'FEA reveals the genius of the differential temper: it matches material properties to the stress distribution, with hard steel where compressive stress is highest and tough steel where tensile/shear stress is highest.',
    },
    {
      title: 'Grain boundary engineering — controlling crystal microstructure',
      concept: `Steel\'s properties depend not just on composition but on **grain structure** — the size, shape, and orientation of crystal grains.

**Hall-Petch relationship**: yield strength increases as grain size decreases:
**σ_y = σ₀ + k / √d**

Where σ₀ is the base strength, k is a material constant, and d is the average grain diameter.

Finer grains = stronger steel. The Naga blacksmith controls grain size through:
1. **Forging temperature**: higher T → larger grains (bad)
2. **Deformation**: hammering breaks and refines grains (good)
3. **Normalizing**: heating to just above critical temperature + air cooling → fine uniform grains
4. **Rapid cooling**: quenching prevents grain growth

📚 *Voronoi diagrams (scipy.spatial.Voronoi) generate realistic grain structure visualizations. Each Voronoi cell represents one crystal grain.*`,
      analogy: 'Grains in steel are like tiles on a floor. Large tiles (coarse grains) have few boundaries — cracks can run long distances without being stopped. Small tiles (fine grains) have many boundaries that deflect and stop cracks, making the floor (blade) much tougher. The blacksmith\'s hammering is like breaking large tiles into smaller ones.',
      storyConnection: 'The rhythmic hammering of the Naga blacksmith does more than shape the blade — it refines the grain structure. Each hammer blow deforms the crystal lattice, introducing dislocations that break large grains into smaller ones. This is why hand-forged blades often outperform machine-made ones at the same composition.',
      checkQuestion: 'If finer grains are always better, why not make them infinitely small?',
      checkAnswer: 'Below about 10-20 nm grain size, the grain boundaries themselves become the dominant feature. Grain boundaries are disordered regions where atoms do not sit in regular crystal positions. When grains are very small, most atoms are AT boundaries rather than inside crystals. These boundary atoms are more mobile, making the material softer (inverse Hall-Petch effect). The optimal grain size is typically 1-10 μm for structural steels.',
      codeIntro: 'Model and visualize grain structure and its effect on blade strength.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hall-Petch relationship
sigma_0 = 200  # MPa (base strength)
k_hp = 600     # MPa·μm^0.5 (Hall-Petch constant for steel)

grain_sizes = np.logspace(-1, 2, 100)  # μm
yield_strength = sigma_0 + k_hp / np.sqrt(grain_sizes)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Hall-Petch plot
axes[0,0].plot(grain_sizes, yield_strength, color='#10b981', linewidth=2.5)
axes[0,0].set_xscale('log')
axes[0,0].set_xlabel('Grain Size (μm)', color='white', fontsize=11)
axes[0,0].set_ylabel('Yield Strength (MPa)', color='white', fontsize=11)
axes[0,0].set_title('Hall-Petch: Finer Grains = Stronger Steel', color='white', fontsize=12, fontweight='bold')

# Mark forging conditions
conditions = [
    ('Overheated (100 μm)', 100, '#f87171'),
    ('As-cast (50 μm)', 50, '#f59e0b'),
    ('Normalized (20 μm)', 20, '#60a5fa'),
    ('Forged (5 μm)', 5, '#10b981'),
    ('Heavy forging (2 μm)', 2, '#a78bfa'),
]
for name, gs, color in conditions:
    ys = sigma_0 + k_hp / np.sqrt(gs)
    axes[0,0].scatter([gs], [ys], s=100, color=color, edgecolors='white', zorder=5)
    axes[0,0].annotate(f'{name}\n{ys:.0f} MPa', (gs, ys), textcoords="offset points",
                       xytext=(10, 5), color=color, fontsize=8)

# Simulate grain structures using random Voronoi points
np.random.seed(42)

def draw_grains(ax, n_grains, title, size=10):
    """Draw a simplified grain structure."""
    # Generate random grain centers
    centers = np.random.uniform(0, size, (n_grains, 2))

    # Draw grain boundaries using a grid
    grid_res = 200
    gx = np.linspace(0, size, grid_res)
    gy = np.linspace(0, size, grid_res)
    GX, GY = np.meshgrid(gx, gy)

    # Assign each pixel to nearest center
    assignments = np.zeros((grid_res, grid_res), dtype=int)
    for i in range(grid_res):
        for j in range(grid_res):
            dists = np.sqrt((centers[:, 0] - gx[j])**2 + (centers[:, 1] - gy[i])**2)
            assignments[i, j] = np.argmin(dists)

    # Color by grain
    colors_array = np.random.rand(n_grains) * 0.3 + 0.3
    grain_colors = colors_array[assignments]

    ax.imshow(grain_colors, cmap='coolwarm', origin='lower', extent=[0, size, 0, size])

    # Draw boundaries
    boundary = np.zeros_like(assignments, dtype=bool)
    boundary[1:, :] |= assignments[1:, :] != assignments[:-1, :]
    boundary[:, 1:] |= assignments[:, 1:] != assignments[:, :-1]
    boundary_img = np.where(boundary, 1.0, np.nan)
    ax.imshow(boundary_img, cmap='gray_r', origin='lower', extent=[0, size, 0, size], alpha=0.8)

    avg_area = size**2 / n_grains
    avg_diameter = np.sqrt(avg_area) * 1000 / size  # convert to μm scale
    strength = sigma_0 + k_hp / np.sqrt(avg_diameter)
    ax.set_title(f'{title}\n~{n_grains} grains, σ_y ≈ {strength:.0f} MPa',
                 color='white', fontsize=10, fontweight='bold')
    ax.set_xticks([]); ax.set_yticks([])

# Different grain structures
grain_configs = [
    (15, 'Coarse (overheated)'),
    (80, 'Normal (as-cast)'),
    (300, 'Fine (well-forged)'),
]

for ax, (n_grains, title) in zip([axes[0,1], axes[1,0], axes[1,1]], grain_configs):
    draw_grains(ax, n_grains, title)

plt.suptitle('Grain Structure Engineering  -  Naga Dao Steel', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("Grain structure summary:")
for name, gs, color in conditions:
    ys = sigma_0 + k_hp / np.sqrt(gs)
    print(f"  {name:30s} | grain: {gs:>5.0f} μm | strength: {ys:>5.0f} MPa")
print(f"\\nHand-forging refines grains from ~50 μm to ~5 μm")
print(f"Strength increase: {(sigma_0 + k_hp/np.sqrt(5))/(sigma_0 + k_hp/np.sqrt(50)) * 100 - 100:.0f}% stronger")
print(f"This is why hand-forged Naga dao outperforms cast or stamped blades!")`,
      challenge: 'Model "grain growth" during overheating: if the smith accidentally holds the blade at 1100°C for too long, grain size doubles every 15 minutes. How quickly does strength degrade? How many minutes until the blade is weakened by 30%?',
      successHint: 'The Hall-Petch relationship quantifies what the Naga blacksmith achieves through hammering: finer grains from forging directly translate to a stronger, tougher blade. The physics validates the traditional craft.',
    },
    {
      title: 'Multi-objective optimization — designing the ideal dao',
      concept: `Designing the ideal dao requires optimizing **multiple objectives simultaneously**:

1. **Edge hardness**: maximize (sharp, holds edge)
2. **Spine toughness**: maximize (resists impact)
3. **Weight**: minimize (comfortable for all-day use)
4. **Cost**: minimize (accessible to the community)
5. **Edge retention**: maximize (fewer resharpening stops)

These objectives conflict — harder steel is heavier, tougher steel holds edges worse, etc. Multi-objective optimization finds the **Pareto-optimal** set: designs where improving one metric necessarily worsens another.

📚 *Multi-objective optimization generates a set of non-dominated solutions (Pareto front) rather than a single optimum. Plotting the Pareto front reveals the true trade-offs.*`,
      analogy: 'Multi-objective optimization is like choosing a smartphone. You want the best camera, longest battery, lightest weight, and lowest price — but maximizing all four simultaneously is impossible. The Pareto front shows all the "best possible compromises": phones where no other phone is better at everything. You choose based on your priorities. The Naga blacksmith chooses the dao based on their priorities: heavy jungle work vs light food preparation.',
      storyConnection: 'Different Naga villages and tasks call for different dao designs. A dao for clearing dense jungle needs maximum toughness and moderate sharpness. A dao for food preparation needs maximum sharpness and moderate toughness. Multi-objective optimization shows the full range of optimal designs, letting each community choose the best one for their needs.',
      checkQuestion: 'Why is the Pareto front more useful than a single "best" design?',
      checkAnswer: 'Because "best" depends on priorities, and different users have different priorities. A Pareto front shows ALL non-dominated designs, letting each user choose the one that matches their specific needs. A single "best" design imposes one set of priorities on everyone, which is inappropriate for a tool used in diverse contexts. The Pareto front respects the diversity of needs in the community.',
      codeIntro: 'Find the Pareto-optimal dao designs across multiple competing objectives.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate design candidates
n_designs = 2000

# Design variables
carbon = np.random.uniform(0.2, 1.0, n_designs)        # %
temper_temp = np.random.uniform(150, 500, n_designs)     # °C
bevel_angle = np.random.uniform(10, 45, n_designs)       # degrees
blade_thickness = np.random.uniform(2, 8, n_designs)     # mm
blade_length = np.random.uniform(200, 400, n_designs)    # mm

# Calculate objectives
edge_hardness = np.clip(20 + 60 * carbon - 0.08 * (temper_temp - 150) + np.random.normal(0, 2, n_designs), 20, 65)
spine_toughness = np.clip(80 - 50 * carbon + 0.15 * (temper_temp - 150) + np.random.normal(0, 3, n_designs), 10, 100)
weight = blade_thickness * blade_length * 0.05 * 7.8 / 1000  # kg (approx)
edge_retention = edge_hardness * bevel_angle / 30  # arbitrary composite metric
sharpness = 100 / (1 + bevel_angle / 10)

# Find Pareto front (maximize hardness, maximize toughness, minimize weight)
def is_dominated(i, objectives):
    """Check if point i is dominated by any other point."""
    for j in range(len(objectives)):
        if j == i: continue
        # j dominates i if j is better in all objectives
        if all(objectives[j] >= objectives[i]):
            if any(objectives[j] > objectives[i]):
                return True
    return False

# Normalize objectives (all should be maximized)
obj = np.column_stack([
    edge_hardness / 65,          # maximize
    spine_toughness / 100,        # maximize
    1 - weight / weight.max(),    # minimize → maximize (1-x)
    edge_retention / edge_retention.max(),  # maximize
    sharpness / 100,              # maximize
])

# Quick Pareto front (approximate for speed)
pareto_mask = np.zeros(n_designs, dtype=bool)
for i in range(n_designs):
    dominated = False
    for j in range(n_designs):
        if j == i: continue
        if np.all(obj[j] >= obj[i]) and np.any(obj[j] > obj[i]):
            dominated = True
            break
    if not dominated:
        pareto_mask[i] = True

n_pareto = pareto_mask.sum()

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Hardness vs Toughness
axes[0,0].scatter(edge_hardness[~pareto_mask], spine_toughness[~pareto_mask],
                 s=8, color='#4b5563', alpha=0.3, label='Dominated')
axes[0,0].scatter(edge_hardness[pareto_mask], spine_toughness[pareto_mask],
                 s=40, color='#10b981', edgecolors='white', linewidths=0.5, label=f'Pareto optimal ({n_pareto})')
axes[0,0].set_xlabel('Edge Hardness (HRC)', color='white', fontsize=10)
axes[0,0].set_ylabel('Spine Toughness', color='white', fontsize=10)
axes[0,0].set_title('Hardness vs Toughness', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Sharpness vs Edge Retention
axes[0,1].scatter(sharpness[~pareto_mask], edge_retention[~pareto_mask],
                 s=8, color='#4b5563', alpha=0.3)
axes[0,1].scatter(sharpness[pareto_mask], edge_retention[pareto_mask],
                 s=40, color='#f59e0b', edgecolors='white', linewidths=0.5)
axes[0,1].set_xlabel('Initial Sharpness', color='white', fontsize=10)
axes[0,1].set_ylabel('Edge Retention', color='white', fontsize=10)
axes[0,1].set_title('Sharpness vs Retention', color='white', fontsize=12, fontweight='bold')

# Weight vs Performance (combined metric)
performance = 0.3 * edge_hardness/65 + 0.3 * spine_toughness/100 + 0.2 * edge_retention/edge_retention.max() + 0.2 * sharpness/100
axes[1,0].scatter(weight[~pareto_mask]*1000, performance[~pareto_mask],
                 s=8, color='#4b5563', alpha=0.3)
axes[1,0].scatter(weight[pareto_mask]*1000, performance[pareto_mask],
                 s=40, color='#60a5fa', edgecolors='white', linewidths=0.5)
axes[1,0].set_xlabel('Weight (g)', color='white', fontsize=10)
axes[1,0].set_ylabel('Overall Performance', color='white', fontsize=10)
axes[1,0].set_title('Weight vs Performance', color='white', fontsize=12, fontweight='bold')

# Design parameter distributions for Pareto set
params = ['Carbon %', 'Temper °C', 'Bevel °', 'Thickness mm']
param_data = [carbon[pareto_mask]*100, temper_temp[pareto_mask], bevel_angle[pareto_mask], blade_thickness[pareto_mask]]
bp = axes[1,1].boxplot(param_data, labels=params, patch_artist=True)
box_colors = ['#10b981', '#f59e0b', '#60a5fa', '#a78bfa']
for patch, color in zip(bp['boxes'], box_colors):
    patch.set_facecolor(color); patch.set_alpha(0.7)
for elem in ['whiskers','caps','medians']:
    for item in bp[elem]: item.set_color('white')
axes[1,1].set_ylabel('Value', color='white', fontsize=10)
axes[1,1].set_title('Pareto-Optimal Design Parameters', color='white', fontsize=12, fontweight='bold')

plt.suptitle('Multi-Objective Optimization: Ideal Naga Dao', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

# Best overall designs
best_idx = np.argsort(-performance[pareto_mask])[:5]
pareto_indices = np.where(pareto_mask)[0]
print(f"\\nTop 5 Pareto-Optimal Designs (of {n_pareto} non-dominated):")
print(f"  {'#':>3} | {'Carbon':>6} | {'Temper':>6} | {'Bevel':>5} | {'Hardness':>8} | {'Toughness':>9} | {'Score':>5}")
print("-" * 60)
for rank, bi in enumerate(best_idx, 1):
    i = pareto_indices[bi]
    print(f"  {rank:>2} | {carbon[i]:>5.2f}% | {temper_temp[i]:>5.0f}°C | {bevel_angle[i]:>4.0f}° | {edge_hardness[i]:>6.0f} HRC | {spine_toughness[i]:>8.0f} | {performance[i]:>.3f}")`,
      challenge: 'Add a 6th objective: "ease of resharpening" (inversely proportional to hardness). How does this change the Pareto front? Do any previously optimal designs become dominated?',
      successHint: 'Multi-objective optimization reveals the true design space for the Naga dao. There is no single best design — there is a front of equally optimal trade-offs. The blacksmith chooses based on the specific community\'s needs.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Metallurgy Modeling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy, matplotlib, and scipy. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
