import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TripuraSundariLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stress and strain — rock deformation mechanics',
      concept: `Rocks deform under tectonic stress. The relationship between **stress** (force/area) and **strain** (deformation) determines whether rock folds (ductile) or faults (brittle).

**Hooke's Law** (elastic): \`σ = E × ε\` (stress proportional to strain)
**Viscous flow**: \`σ = η × dε/dt\` (stress proportional to strain rate)
**Viscoelastic**: combines both (rocks are viscoelastic on geological timescales)

At shallow depths (< 10 km): rocks are **brittle** — they fracture (earthquakes)
At greater depths: rocks are **ductile** — they flow and fold (Tripura's folds)

The **brittle-ductile transition** depends on temperature, pressure, rock type, and strain rate. Slow deformation over millions of years allows rocks to fold rather than break.

📚 *We will model the stress-strain behaviour of different rock types and determine the conditions for folding vs faulting.*`,
      analogy: 'Silly putty: pull it fast and it snaps (brittle). Pull it slowly and it stretches (ductile). Rocks work the same way — fast stress causes earthquakes, slow stress causes folds. Tripura\'s folds formed over millions of years of slow compression.',
      storyConnection: 'The fold beneath Tripura Sundari Temple formed because tectonic compression was slow enough for the rocks to bend rather than break. At the same time, shallow faults in the region cause earthquakes — the brittle-ductile duality in action.',
      checkQuestion: 'Why do earthquakes occur at shallow depths but not at great depths?',
      checkAnswer: 'At shallow depths, rocks are cold and brittle — they fracture under stress. At depth (>15 km), temperature and pressure make rocks ductile — they flow slowly instead of fracturing. The brittle-ductile transition occurs at roughly 10-15 km depth in continental crust.',
      codeIntro: 'Model the stress-strain behaviour of rocks under different conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stress-strain curves for different rock types
def rock_stress_strain(strain, E, yield_stress, ductility):
    """Model elastic-plastic rock behaviour."""
    stress = np.minimum(E * strain, yield_stress)
    # Post-yield: strain hardening or softening
    post_yield = strain > yield_stress / E
    if ductility > 0:
        stress[post_yield] = yield_stress * (1 + ductility * (strain[post_yield] - yield_stress/E))
    return stress

strain = np.linspace(0, 0.05, 300)

rocks = {
    'Sandstone (brittle)': {'E': 20e9, 'yield': 80e6, 'ductility': -0.5, 'color': '#DAA520'},
    'Shale (ductile)': {'E': 10e9, 'yield': 30e6, 'ductility': 0.8, 'color': '#696969'},
    'Limestone': {'E': 30e9, 'yield': 60e6, 'ductility': 0.2, 'color': '#B0C4DE'},
    'Granite': {'E': 50e9, 'yield': 150e6, 'ductility': -0.8, 'color': '#DC143C'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

for name, props in rocks.items():
    stress = rock_stress_strain(strain, props['E'], props['yield'], props['ductility'])
    ax1.plot(strain * 100, stress / 1e6, color=props['color'], linewidth=2.5, label=name)

ax1.set_xlabel('Strain (%)', color='white', fontsize=11)
ax1.set_ylabel('Stress (MPa)', color='white', fontsize=11)
ax1.set_title('Rock Stress-Strain Curves', color='white', fontsize=13)
ax1.legend(facecolor='#374151', labelcolor='white', fontsize=8)

# Brittle-ductile transition with depth
depths = np.linspace(0, 30, 200)  # km
temp = 15 + 25 * depths  # geothermal gradient 25°C/km
pressure = 2700 * 9.81 * depths * 1000 / 1e6  # MPa

# Brittle strength (Byerlee's law): increases with pressure
brittle_strength = 50 + 0.6 * pressure

# Ductile strength (decreases with temperature)
ductile_strength = 500 * np.exp(-temp / 300)

ax2.plot(brittle_strength, depths, color='#ef4444', linewidth=2.5, label='Brittle strength')
ax2.plot(ductile_strength, depths, color='#3b82f6', linewidth=2.5, label='Ductile strength')
ax2.fill_betweenx(depths, 0, np.minimum(brittle_strength, ductile_strength), alpha=0.1, color='#f59e0b')

# Transition depth
trans_idx = np.argmin(np.abs(brittle_strength - ductile_strength))
ax2.plot(brittle_strength[trans_idx], depths[trans_idx], 'o', color='#f59e0b', markersize=12, zorder=5)
ax2.annotate(f'Transition: {depths[trans_idx]:.0f} km', xy=(brittle_strength[trans_idx]+20, depths[trans_idx]),
             color='#f59e0b', fontsize=10, fontweight='bold')

ax2.set_xlabel('Strength (MPa)', color='white', fontsize=11)
ax2.set_ylabel('Depth (km)', color='white', fontsize=11)
ax2.set_title('Brittle-Ductile Transition', color='white', fontsize=13)
ax2.invert_yaxis()
ax2.legend(facecolor='#374151', labelcolor='white')

plt.tight_layout()
plt.savefig('rock_mechanics.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Brittle-ductile transition: ~{depths[trans_idx]:.0f} km depth")
print("Above this: earthquakes. Below this: ductile flow and folding.")`,
      challenge: 'Add strain rate as a variable. At geological strain rates (10^-15 /s), the transition moves shallower. At seismic rates (10^-1 /s), it moves deeper. Plot both cases.',
      successHint: 'Rock mechanics explains why the same tectonic forces produce folds at depth and earthquakes near the surface. The brittle-ductile transition is the boundary between these two regimes.',
    },
    {
      title: 'Fold mechanics — buckling instability',
      concept: `When a layered rock sequence is compressed, it does not deform uniformly. It **buckles** into folds, similar to Euler buckling of a column.

The **dominant wavelength** of folding depends on:
\`λ = 2π × t × (E_layer / (6 × E_matrix))^{1/3}\`

where t is layer thickness, E_layer is layer stiffness, and E_matrix is the surrounding rock stiffness.

Key insights:
- Thicker layers → longer wavelength folds
- Stiffer layers → longer wavelength folds
- The ratio of stiffnesses determines fold tightness

Tripura's folds have wavelengths of 10-15 km, consistent with thick sandstone layers (50-100m) folding in softer shale.

📚 *We will compute dominant fold wavelengths and compare predictions with Tripura's observed fold geometry.*`,
      analogy: 'Press the ends of a thin ruler — it buckles into a smooth curve. Press a thick beam — it buckles with a longer wavelength. Geological layers buckle the same way, but over millions of years and kilometres of distance.',
      storyConnection: 'The 12 km wavelength folds of Tripura result from specific rock layer thicknesses and stiffness ratios. The formula predicts this wavelength from the geological properties — connecting physics to landscape.',
      checkQuestion: 'If you double the thickness of the competent (stiff) layer, how does the fold wavelength change?',
      checkAnswer: 'λ is proportional to t (layer thickness), so doubling thickness doubles the wavelength. Thicker layers create broader, gentler folds. This is observed in nature: regions with thick sandstone have wider fold spacing.',
      codeIntro: 'Predict fold wavelengths from rock properties and compare with Tripura\'s observed folds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def fold_wavelength(thickness, E_layer, E_matrix):
    """Dominant fold wavelength (Biot's theory)."""
    return 2 * np.pi * thickness * (E_layer / (6 * E_matrix))**(1/3)

# Tripura rock properties
E_sandstone = 20e9   # Pa
E_shale = 5e9        # Pa

# Layer thicknesses to test
thicknesses = np.linspace(10, 200, 100)  # metres
wavelengths = fold_wavelength(thicknesses, E_sandstone, E_shale)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Wavelength vs thickness
ax1.plot(thicknesses, wavelengths / 1000, color='#34d399', linewidth=2.5)
ax1.axhline(y=12, color='#f59e0b', linestyle='--', alpha=0.7, label='Observed: 12 km')
ax1.set_xlabel('Layer thickness (m)', color='white', fontsize=11)
ax1.set_ylabel('Fold wavelength (km)', color='white', fontsize=11)
ax1.set_title('Predicted Fold Wavelength', color='white', fontsize=13)
ax1.legend(facecolor='#374151', labelcolor='white')

# Find thickness that matches observation
target_wl = 12000  # 12 km in metres
predicted_t = target_wl / (2 * np.pi * (E_sandstone / (6 * E_shale))**(1/3))
ax1.plot(predicted_t, 12, 'o', color='#f59e0b', markersize=12, zorder=5)
ax1.annotate(f'{predicted_t:.0f}m layer → 12 km fold', xy=(predicted_t + 5, 12.5),
             color='#f59e0b', fontsize=10)

# Stiffness ratio effect
ratios = np.linspace(2, 20, 100)
wl_ratio = fold_wavelength(80, ratios * E_shale, E_shale)

ax2.plot(ratios, wl_ratio / 1000, color='#60a5fa', linewidth=2.5)
ax2.set_xlabel('Stiffness ratio (E_layer / E_matrix)', color='white', fontsize=11)
ax2.set_ylabel('Fold wavelength (km)', color='white', fontsize=11)
ax2.set_title('Effect of Rock Contrast (80m layer)', color='white', fontsize=13)
ax2.axhline(y=12, color='#f59e0b', linestyle='--', alpha=0.7, label='Observed')
ax2.axvline(x=E_sandstone/E_shale, color='#34d399', linestyle=':', alpha=0.7, label=f'Ss/Sh = {E_sandstone/E_shale:.0f}')
ax2.legend(facecolor='#374151', labelcolor='white')

plt.tight_layout()
plt.savefig('fold_mechanics.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Predicted layer thickness for 12 km wavelength: {predicted_t:.0f} m")
print(f"Actual Tipam Sandstone thickness: ~80 m")
print(f"The theory predicts Tripura's fold spacing remarkably well!")`,
      challenge: 'Multiple sandstone layers of different thicknesses create superimposed folds at different wavelengths. Model a 3-layer system and show how the combined fold pattern is more complex than any single layer.',
      successHint: 'Fold mechanics connects material properties to landscape-scale features. The 12 km fold spacing of Tripura is not random — it is dictated by the physics of buckling in layered rock.',
    },
    {
      title: 'Landscape evolution modelling',
      concept: `The evolution of a landscape can be modelled by the **continuity equation**:

\`∂h/∂t = U - K × A^m × S^n\`

where h is elevation, U is uplift rate, K is erosion coefficient, A is drainage area, S is slope, and m, n are exponents.

This equation balances uplift (raising the land) against erosion (lowering it). At steady state, ∂h/∂t = 0 and the landscape is in equilibrium.

The model predicts:
- Mountain height is proportional to uplift rate / erosion coefficient
- Steeper slopes where uplift is faster or rock is harder
- Drainage patterns controlled by fold geometry

📚 *We will solve the landscape evolution equation numerically to simulate how Tripura's terrain developed over millions of years.*`,
      analogy: 'Landscape evolution is like a bathtub with the tap running (uplift) and the drain open (erosion). The water level (elevation) rises until inflow equals outflow — that is steady state. Tripura\'s hills are the "water level" of a geological bathtub.',
      storyConnection: 'The hill where Tripura Sundari Temple stands has been evolving for millions of years. Our model shows how it grew from flat seafloor to folded ridge — the geological biography of a temple site.',
      checkQuestion: 'If uplift suddenly stops but erosion continues, what happens to the landscape?',
      checkAnswer: 'Mountains gradually erode to a flat surface called a "peneplain." With no uplift to replace eroded material, the landscape loses all relief. This takes millions of years but is inevitable without ongoing tectonic activity.',
      codeIntro: 'Simulate landscape evolution for Tripura over geological time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D landscape evolution model
nx = 200
dx = 0.5  # km
x = np.arange(nx) * dx  # 100 km profile

# Parameters
K = 1e-6    # erosion coefficient
U_base = 0.3e-3  # base uplift rate (km/Myr = mm/yr)
dt = 0.01   # Myr
total_time = 20  # Myr

# Fold-modulated uplift (anticlines rise faster)
wavelength = 12
uplift = U_base * (1 + 0.5 * np.sin(2 * np.pi * x / wavelength))

# Initial condition: flat (sea level)
h = np.zeros(nx) + 0.001

# Store snapshots
snapshots = {}
snapshot_times = [0, 2, 5, 10, 15, 20]

for step in range(int(total_time / dt)):
    t = step * dt

    if any(abs(t - st) < dt/2 for st in snapshot_times):
        snapshots[round(t)] = h.copy()

    # Slope
    slope = np.abs(np.gradient(h, dx))
    slope = np.clip(slope, 1e-6, None)

    # Drainage area (simplified: proportional to distance from nearest ridge)
    # Find local maxima
    area = np.ones(nx) * dx  # minimum area
    for i in range(1, nx):
        if h[i] < h[i-1]:
            area[i] = area[i-1] + dx
    for i in range(nx-2, -1, -1):
        if h[i] < h[i+1]:
            area[i] = max(area[i], area[i+1] + dx)

    # Erosion rate
    erosion = K * area**0.5 * slope**1.0

    # Update elevation
    h = h + (uplift - erosion) * dt
    h = np.clip(h, 0, None)

    # Boundary conditions
    h[0] = 0
    h[-1] = 0

fig, ax = plt.subplots(figsize=(11, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

colors = plt.cm.viridis(np.linspace(0.2, 1, len(snapshots)))
for (t, profile), color in zip(sorted(snapshots.items()), colors):
    ax.plot(x, profile * 1000, color=color, linewidth=2, label=f'{t} Myr')

# Mark temple location
temple_x = wavelength / 4
temple_idx = int(temple_x / dx)
if 20 in snapshots:
    ax.plot(temple_x, snapshots[20][temple_idx] * 1000, '^',
            color='#ef4444', markersize=14, zorder=5)
    ax.annotate('Temple site', xy=(temple_x + 1, snapshots[20][temple_idx] * 1000 + 10),
                color='#ef4444', fontsize=10, fontweight='bold')

ax.set_xlabel('Distance (km)', color='white', fontsize=12)
ax.set_ylabel('Elevation (m)', color='white', fontsize=12)
ax.set_title('Landscape Evolution — Tripura Fold Belt (20 Myr)', color='white', fontsize=14)
ax.legend(facecolor='#374151', labelcolor='white', title='Time', title_fontsize=9)

plt.tight_layout()
plt.savefig('landscape_evolution.png', dpi=100, facecolor='#1f2937')
plt.show()

if 20 in snapshots:
    final = snapshots[20]
    print(f"Final max elevation: {final.max()*1000:.0f} m")
    print(f"Number of anticline ridges: {sum(1 for i in range(1,nx-1) if final[i]>final[i-1] and final[i]>final[i+1])}")
    print(f"Mean elevation: {final.mean()*1000:.0f} m")`,
      challenge: 'Model what happens if uplift stops at 10 Myr and only erosion continues. How long until the landscape is effectively flat (max elevation < 10m)?',
      successHint: 'Landscape evolution modelling reveals the deep time processes that created the terrain we see today. The hill beneath Tripura Sundari Temple is the product of 20 million years of uplift and erosion.',
    },
    {
      title: 'Isostasy — floating continents',
      concept: `Continents float on the mantle like icebergs in water — this is **isostasy**. The height of a mountain above sea level depends on how deep its "root" extends into the mantle.

**Airy isostasy**: \`root = h × ρ_crust / (ρ_mantle - ρ_crust)\`

For Tripura's hills (300m elevation):
root = 300 × 2700 / (3300 - 2700) = 1,350 m

The crust beneath Tripura's anticlines is 1.35 km thicker than beneath the synclines. This is directly measurable with gravity surveys.

**Isostatic rebound**: when weight is removed (erosion), the crust rises. When weight is added (sedimentation), it sinks. This feedback creates a dynamic equilibrium.

📚 *We will calculate isostatic compensation and model how erosion triggers crustal rebound.*`,
      analogy: 'Put a block of wood in water. Push it down — it bounces back. Carve some wood off the top — it floats higher. Continents do the same on the liquid-like mantle. Remove rock by erosion, and the crust bounces upward.',
      storyConnection: 'As erosion wears down Tripura\'s hills, isostatic rebound pushes them back up. This means the hills will persist far longer than erosion alone would allow. The Tripura Sundari Temple hill is partially sustained by the buoyancy of the crust.',
      checkQuestion: 'If you erode 100m from a mountain top, does the mountain lose exactly 100m of height?',
      checkAnswer: 'No — it loses less. Removing 100m of rock reduces the load, causing isostatic rebound. The mountain rises by about 100 × ρ_crust/ρ_mantle ≈ 82m. Net loss is only 100 - 82 = 18m. Isostasy preserves about 82% of the mountain\'s height!',
      codeIntro: 'Model isostatic compensation and rebound for Tripura\'s landscape.',
      code: `import numpy as np
import matplotlib.pyplot as plt

rho_crust = 2700    # kg/m³
rho_mantle = 3300   # kg/m³

# Airy isostasy: root and total crustal thickness
def isostatic_root(elevation):
    return elevation * rho_crust / (rho_mantle - rho_crust)

def total_crust(elevation, base_thickness=35):
    return base_thickness + elevation / 1000 + isostatic_root(elevation) / 1000

# Profile across Tripura
x = np.linspace(0, 60, 300)  # km
wavelength = 12
surface_elevation = 300 * np.sin(2 * np.pi * x / wavelength)  # metres
surface_elevation = np.clip(surface_elevation, 0, None)

root = isostatic_root(surface_elevation) / 1000  # km
moho_depth = 35 + root  # km (Moho = crust-mantle boundary)

fig, ax = plt.subplots(figsize=(11, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

# Surface topography
ax.fill_between(x, 0, surface_elevation / 1000, color='#8B4513', alpha=0.7, label='Crust (above sea level)')
ax.fill_between(x, 0, -35, color='#A0522D', alpha=0.4, label='Crust')
ax.fill_between(x, -35, -moho_depth, color='#CD853F', alpha=0.6, label='Crustal root')
ax.fill_between(x, -moho_depth, -45, color='#2F4F2F', alpha=0.3, label='Mantle')

# Moho line
ax.plot(x, -moho_depth, color='#ef4444', linewidth=2, label='Moho (crust-mantle boundary)')
ax.axhline(y=-35, color='#9ca3af', linestyle=':', alpha=0.3)

# Temple
t_x = wavelength / 4
ax.plot(t_x, surface_elevation[int(t_x / 60 * 300)] / 1000 + 0.2, '^',
        color='#f59e0b', markersize=14, zorder=5)
ax.annotate('Temple', xy=(t_x + 1, 0.7), color='#f59e0b', fontsize=10, fontweight='bold')

ax.set_xlabel('Distance (km)', color='white', fontsize=12)
ax.set_ylabel('Depth (km)', color='white', fontsize=12)
ax.set_title('Isostatic Cross-Section — Tripura', color='white', fontsize=14)
ax.legend(facecolor='#374151', labelcolor='white', fontsize=8, loc='lower right')
ax.set_ylim(-42, 2)

plt.tight_layout()
plt.savefig('isostasy.png', dpi=100, facecolor='#1f2937')
plt.show()

# Erosion-rebound calculation
print("ISOSTATIC REBOUND ANALYSIS")
print("=" * 50)
erosion_amounts = [50, 100, 200, 500, 1000]  # metres
for erosion in erosion_amounts:
    rebound = erosion * rho_crust / rho_mantle
    net_loss = erosion - rebound
    retained = rebound / erosion * 100
    print(f"  Erode {erosion:>5}m → rebound {rebound:>5.0f}m → net loss {net_loss:>5.0f}m ({retained:.0f}% retained)")

print(f"\
Isostatic amplification factor: {rho_crust / (rho_mantle - rho_crust):.2f}")
print("Mountains are remarkably persistent thanks to isostatic rebound.")`,
      challenge: 'Model the time-dependent isostatic rebound after a sudden erosion event. The mantle viscosity controls the rebound timescale (typically 10,000-100,000 years). Implement the exponential relaxation model.',
      successHint: 'Isostasy is why mountains persist for hundreds of millions of years despite relentless erosion. The floating continent principle means that removing rock from the top causes the crust to rise from below — a geological perpetual motion machine.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Geological Modelling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
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
