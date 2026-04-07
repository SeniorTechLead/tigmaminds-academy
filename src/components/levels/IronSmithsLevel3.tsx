import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IronSmithsLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Heat equation — modeling temperature in a blade',
      concept: `The **heat equation** describes how temperature changes over space and time:

\`∂T/∂t = α × ∂²T/∂x²\`

Where α is the **thermal diffusivity** — how quickly heat spreads through the material.

For iron: α ≈ 23 × 10⁻⁶ m²/s (relatively high — iron conducts heat well).

To solve numerically, we discretize space and time:
\`T[x, t+dt] = T[x, t] + α × dt/dx² × (T[x+dx, t] - 2T[x, t] + T[x-dx, t])\`

This is the **FTCS** (Forward Time, Central Space) finite difference scheme. It is stable only when \`α × dt/dx² < 0.5\`.

📚 *The heat equation is a partial differential equation (PDE). We solve it by discretizing both space and time, creating a 2D grid of temperature values updated at each time step.*`,
      analogy: 'The heat equation is like a crowd of people sharing warmth. If you are warm and your neighbors are cold, heat flows from you to them. The more different the temperatures, the faster the flow. Eventually, everyone reaches the same temperature — thermal equilibrium. The heat equation tracks this sharing process at every point and every moment.',
      storyConnection: 'When a Lushai smith plunges a hot blade into water, the surface cools almost instantly while the core stays hot. This temperature gradient across the blade is what creates the hard outer surface and tough inner core — a composite structure that makes the best blades. The heat equation predicts exactly how this gradient evolves.',
      checkQuestion: 'Why does the surface of a quenched blade cool faster than the core?',
      checkAnswer: 'The surface is in direct contact with the cold water, so heat leaves immediately. The core must conduct its heat through layers of metal to reach the surface. This creates a temperature gradient: surface at water temperature, core still near forging temperature. The gradient steepness depends on blade thickness and thermal diffusivity.',
      codeIntro: 'Simulate heat distribution in a blade cross-section during quenching using the heat equation.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Blade cross-section: 1D heat equation
L = 0.01       # blade thickness: 10 mm = 0.01 m
nx = 50
dx = L / nx
x = np.linspace(0, L * 1000, nx)  # in mm for display

alpha = 23e-6  # thermal diffusivity of iron (m²/s)
dt = 0.0001    # time step (must satisfy stability: alpha*dt/dx² < 0.5)
t_max = 2.0    # simulate 2 seconds

stability = alpha * dt / dx**2
print(f"Stability parameter: {stability:.3f} (must be < 0.5)")

# Initial condition: uniform 900°C
T = np.ones(nx) * 900.0
T_water = 25.0  # boundary temperature

# Store snapshots
snapshots = {}
snap_times = [0, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0]
steps = int(t_max / dt)

for step in range(steps):
    t = step * dt
    if any(abs(t - st) < dt/2 for st in snap_times):
        snapshots[f'{t:.2f}s'] = T.copy()

    T_new = T.copy()
    for i in range(1, nx - 1):
        T_new[i] = T[i] + alpha * dt / dx**2 * (T[i+1] - 2*T[i] + T[i-1])

    # Boundary conditions: both surfaces in water
    T_new[0] = T_water
    T_new[-1] = T_water
    T = T_new

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#111827')
ax.set_facecolor('#1f2937')

colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#60a5fa']
for (label, snap), color in zip(snapshots.items(), colors):
    ax.plot(x, snap, color=color, linewidth=2.5, label=f't = {label}')

ax.axhline(727, color='white', linestyle=':', alpha=0.3, linewidth=1)
ax.text(5, 740, 'A₁ (phase transformation)', color='white', fontsize=9, ha='center')
ax.axhline(220, color='#a78bfa', linestyle=':', alpha=0.3, linewidth=1)
ax.text(5, 233, 'Ms (martensite start)', color='#a78bfa', fontsize=9, ha='center')

ax.set_xlabel('Position across blade (mm)', color='lightgray', fontsize=12)
ax.set_ylabel('Temperature (°C)', color='lightgray', fontsize=12)
ax.set_title('Blade Temperature During Water Quench', color='white', fontsize=14, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/iron_heat_eq.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

# Analysis
for label, snap in snapshots.items():
    surface_T = snap[1]
    core_T = snap[nx//2]
    gradient = core_T - surface_T
    print(f"t={label}: Surface={surface_T:.0f}°C, Core={core_T:.0f}°C, Gradient={gradient:.0f}°C")`,
      challenge: 'Compare a thin blade (5 mm) and a thick blade (20 mm). How much longer does the thick blade take to cool uniformly? This explains why thicker sections need different heat treatment than thin ones.',
      successHint: 'You solved the 1D heat equation numerically — the same method used to design heat exchangers, predict building insulation performance, and optimize industrial heat treatment. The temperature gradient you see is why quenched blades have a hard surface and tough core.',
    },
    {
      title: 'Diffusion — carbon migration in iron',
      concept: `Carbon atoms migrate through iron via **diffusion**, governed by **Fick\'s second law**:

\`∂C/∂t = D × ∂²C/∂x²\`

This is mathematically identical to the heat equation, but tracking carbon concentration instead of temperature.

Diffusion coefficient for carbon in iron:
- In FCC (austenite): D ≈ 2 × 10⁻¹¹ m²/s at 900°C
- In BCC (ferrite): D ≈ 1 × 10⁻¹⁰ m²/s at 900°C

The **diffusion length** after time t is approximately:
\`x ≈ √(2Dt)\`

At 900°C, carbon diffuses about 0.1 mm in 1 hour — very slow! This is why carburizing (adding carbon to iron surfaces) takes hours of furnace time.

📚 *The diffusion equation uses the same finite difference scheme as the heat equation. Reusing the same numerical method for different physics is a powerful computational technique.*`,
      analogy: 'Carbon diffusion is like dropping food coloring into still water. At first, the color is concentrated in one spot. Gradually, it spreads outward as dye molecules randomly wander. After a long time, the color is uniform everywhere. Carbon atoms in iron do the same thing — randomly hopping between lattice sites, gradually spreading from high-concentration to low-concentration regions.',
      storyConnection: 'When the Lushai smiths packed iron in charcoal and heated it for hours, they were carburizing — driving carbon into the iron surface by diffusion. The longer in the fire, the deeper the carbon penetrated. A blade heated for 2 hours might have 0.5 mm of high-carbon surface over a low-carbon core — the ideal structure for a cutting tool.',
      checkQuestion: 'Why is the diffusion coefficient different in FCC vs BCC iron?',
      checkAnswer: 'BCC has smaller interstitial spaces but more of them, and the jump distance between sites is shorter. Counterintuitively, carbon actually diffuses faster in BCC than FCC because the activation energy for hopping between BCC sites is lower. But FCC can hold much more carbon, so carburizing is done in the FCC (austenite) phase.',
      codeIntro: 'Simulate carbon diffusion during the carburizing process (surface carbon enrichment).',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Carbon diffusion during carburizing
L = 0.005      # 5 mm depth
nx = 100
dx = L / nx
x = np.linspace(0, L * 1000, nx)  # in mm

D = 2e-11      # diffusion coefficient at 900°C in austenite (m²/s)
dt = 0.5       # seconds
t_max = 7200   # 2 hours

stability = D * dt / dx**2
print(f"Stability: {stability:.4f} (must be < 0.5)")

# Initial: low carbon throughout (0.1%)
C = np.ones(nx) * 0.1

# Boundary: surface at high carbon (1.0% from charcoal)
C_surface = 1.0

snapshots = {}
snap_times = [0, 600, 1800, 3600, 7200]

steps = int(t_max / dt)
for step in range(steps):
    t = step * dt
    if any(abs(t - st) < dt/2 for st in snap_times):
        hrs = t / 3600
        snapshots[f'{hrs:.1f}h'] = C.copy()

    C_new = C.copy()
    for i in range(1, nx - 1):
        C_new[i] = C[i] + D * dt / dx**2 * (C[i+1] - 2*C[i] + C[i-1])
    C_new[0] = C_surface  # surface boundary
    C_new[-1] = C[-2]     # no-flux at center
    C = C_new

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Carbon profiles
ax1.set_facecolor('#1f2937')
colors = ['#6b7280', '#34d399', '#fbbf24', '#f87171', '#a78bfa']
for (label, snap), color in zip(snapshots.items(), colors):
    ax1.plot(x, snap, color=color, linewidth=2.5, label=f't = {label}')

ax1.axhline(0.77, color='white', linestyle=':', alpha=0.3)
ax1.text(4, 0.79, 'Eutectoid (0.77%)', color='white', fontsize=9)
ax1.axhline(0.3, color='#fbbf24', linestyle=':', alpha=0.3)
ax1.text(4, 0.32, 'Min for blade (0.3%)', color='#fbbf24', fontsize=9)

ax1.set_xlabel('Depth from surface (mm)', color='lightgray', fontsize=12)
ax1.set_ylabel('Carbon concentration (wt%)', color='lightgray', fontsize=12)
ax1.set_title('Carbon Diffusion During Carburizing', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Diffusion depth vs time
times_hr = np.linspace(0.1, 4, 100)
diff_depth = np.sqrt(2 * D * times_hr * 3600) * 1000  # mm

ax2.set_facecolor('#1f2937')
ax2.plot(times_hr, diff_depth, color='#34d399', linewidth=2.5)
ax2.fill_between(times_hr, diff_depth, alpha=0.2, color='#34d399')
ax2.set_xlabel('Carburizing time (hours)', color='lightgray', fontsize=12)
ax2.set_ylabel('Diffusion depth (mm)', color='lightgray', fontsize=12)
ax2.set_title('Carbon Penetration Depth vs Time', color='white', fontsize=13, fontweight='bold')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/iron_diffusion.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

for label, snap in snapshots.items():
    depth_03 = x[np.argmin(np.abs(snap - 0.3))] if any(snap > 0.3) else 0
    print(f"t={label}: carbon > 0.3% to depth {depth_03:.2f} mm")`,
      challenge: 'Compare carburizing at 850°C (D = 1×10⁻¹¹) vs 950°C (D = 5×10⁻¹¹). How much faster does carbon penetrate at higher temperature? Is the extra time/fuel worth it?',
      successHint: 'You simulated Fick\'s diffusion law — the same equation that describes drug delivery through skin, dopant diffusion in semiconductors, and pollutant spread in groundwater. The Lushai smiths were performing solid-state diffusion engineering centuries before the equation was written.',
    },
    {
      title: 'Stress-strain modeling — mechanical properties from microstructure',
      concept: `The **stress-strain curve** defines a material\'s mechanical behavior:

- **Elastic region**: stress proportional to strain (Hooke\'s law: σ = E × ε)
- **Yield point**: material starts permanently deforming
- **Plastic region**: deformation continues with increasing stress
- **Ultimate tensile strength (UTS)**: maximum stress before necking
- **Fracture**: material breaks

For steel, these properties depend on microstructure:
- Martensite: high yield strength (~1200 MPa), low elongation (~2%)
- Pearlite: moderate yield (~350 MPa), good elongation (~25%)
- Ferrite: low yield (~200 MPa), excellent elongation (~40%)

The **Hall-Petch relationship** connects grain size to strength:
\`σ_yield = σ₀ + k / √d\`

Smaller grains = stronger steel. This is why hammering (which refines grains) strengthens iron.

📚 *We model stress-strain curves as piecewise functions: linear in the elastic region, then following a power law in the plastic region.*`,
      analogy: 'A stress-strain curve is like stretching a rubber band, a piece of clay, and a glass rod. The rubber band stretches and snaps back (elastic). The clay stretches and stays deformed (plastic). The glass rod barely stretches before shattering (brittle). Steel combines all three behaviors: elastic at first, then plastic, then fracture.',
      storyConnection: 'The Lushai smiths tested their blades by flexing them — a blade that bent too easily was too soft (pearlite), one that snapped was too hard (martensite). The ideal blade flexed slightly and sprang back — a balance of elastic and plastic behavior achieved through careful heat treatment.',
      checkQuestion: 'Why does hammering (work hardening) make iron stronger?',
      checkAnswer: 'Hammering introduces dislocations — line defects in the crystal lattice. These dislocations tangle and block each other\'s movement, like tangled fishing line that resists being pulled. More dislocations = more resistance to deformation = higher strength. But too many dislocations make the metal brittle — another tradeoff.',
      codeIntro: 'Model and plot stress-strain curves for different steel microstructures.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

def stress_strain(E, sigma_y, UTS, elong_frac, n_points=200):
    """Generate a stress-strain curve."""
    strain_yield = sigma_y / E
    strain_uts = elong_frac * 0.6
    strain_frac = elong_frac

    # Elastic region
    e1 = np.linspace(0, strain_yield, n_points // 3)
    s1 = E * e1

    # Plastic region (power law hardening)
    e2 = np.linspace(strain_yield, strain_uts, n_points // 3)
    n_exp = 0.2  # strain hardening exponent
    s2 = sigma_y + (UTS - sigma_y) * ((e2 - strain_yield) / (strain_uts - strain_yield))**n_exp

    # Necking to fracture
    e3 = np.linspace(strain_uts, strain_frac, n_points // 3)
    s3 = UTS - (UTS - sigma_y * 0.8) * ((e3 - strain_uts) / (strain_frac - strain_uts))**0.5

    return np.concatenate([e1, e2, e3]) * 100, np.concatenate([s1, s2, s3])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Steel microstructures
steels = {
    'Martensite': {'E': 210e3, 'sy': 1200, 'UTS': 1500, 'elong': 0.02, 'color': '#f87171'},
    'Bainite': {'E': 210e3, 'sy': 800, 'UTS': 1100, 'elong': 0.10, 'color': '#fbbf24'},
    'Pearlite': {'E': 210e3, 'sy': 350, 'UTS': 600, 'elong': 0.25, 'color': '#34d399'},
    'Ferrite': {'E': 210e3, 'sy': 200, 'UTS': 350, 'elong': 0.40, 'color': '#60a5fa'},
}

ax1.set_facecolor('#1f2937')
for name, props in steels.items():
    strain, stress = stress_strain(props['E'], props['sy'], props['UTS'], props['elong'])
    ax1.plot(strain, stress, color=props['color'], linewidth=2.5, label=name)

ax1.set_xlabel('Strain (%)', color='lightgray', fontsize=12)
ax1.set_ylabel('Stress (MPa)', color='lightgray', fontsize=12)
ax1.set_title('Stress-Strain Curves by Microstructure', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Hall-Petch relationship
grain_sizes = np.linspace(1, 100, 200)  # micrometers
sigma_0 = 50  # MPa (lattice friction stress)
k_hp = 600    # MPa·μm^(1/2)
sigma_y = sigma_0 + k_hp / np.sqrt(grain_sizes)

ax2.set_facecolor('#1f2937')
ax2.plot(grain_sizes, sigma_y, color='#a78bfa', linewidth=2.5)
ax2.fill_between(grain_sizes, sigma_y, alpha=0.15, color='#a78bfa')

# Mark typical grain sizes
for gs, label in [(5, 'Cold-worked'), (20, 'Normalized'), (50, 'Annealed'), (80, 'Cast')]:
    sy = sigma_0 + k_hp / np.sqrt(gs)
    ax2.plot(gs, sy, 'o', color='white', markersize=8)
    ax2.annotate(f'{label}\\n({sy:.0f} MPa)', xy=(gs, sy),
                 xytext=(gs+5, sy+20), color='white', fontsize=8,
                 arrowprops=dict(arrowstyle='->', color='white', lw=0.5))

ax2.set_xlabel('Grain size (μm)', color='lightgray', fontsize=12)
ax2.set_ylabel('Yield strength (MPa)', color='lightgray', fontsize=12)
ax2.set_title('Hall-Petch: Strength vs Grain Size', color='white', fontsize=13, fontweight='bold')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/iron_stress.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Microstructure comparison:")
for name, props in steels.items():
    print(f"  {name:<12}: σ_y={props['sy']:>5} MPa, UTS={props['UTS']:>5} MPa, elongation={props['elong']*100:.0f}%")`,
      challenge: 'Model a composite blade with martensite on the surface (0-1 mm) and pearlite in the core (1-5 mm). What would the overall stress-strain curve look like? This is the "rule of mixtures" for composite materials.',
      successHint: 'You modeled mechanical behavior from microstructure — the core skill of materials engineering. The stress-strain curve and Hall-Petch relationship connect atomic-level structure to macroscopic properties, explaining why the Lushai smiths\' hammering and heat treatment techniques produced superior blades.',
    },
    {
      title: 'Grain growth kinetics and recrystallization',
      concept: `When metal is heated, its grains grow over time following the **grain growth equation**:

\`d² - d₀² = K × t × exp(-Q / RT)\`

Where:
- d = current grain diameter
- d₀ = initial grain diameter
- K = material constant
- Q = activation energy
- R = gas constant (8.314 J/mol·K)
- T = temperature (Kelvin)

**Recrystallization** is the process where deformed (cold-worked) grains are replaced by new, strain-free grains. It occurs above a critical temperature (~450°C for iron).

Grain growth is undesirable — large grains mean weaker steel (Hall-Petch). This is why smiths do not hold iron at high temperature longer than necessary.

📚 *The Arrhenius equation \`exp(-Q/RT)\` appears throughout chemistry and materials science. It describes how reaction rates increase exponentially with temperature.*`,
      analogy: 'Grain growth is like soap bubbles merging in a bath. Small bubbles have more surface energy per volume, so they tend to merge into larger bubbles (reducing total surface area). Metal grains do the same: small grains merge into larger ones, reducing grain boundary energy. Heating accelerates this process, just as warm water makes bubbles merge faster.',
      storyConnection: 'The Lushai smiths knew not to leave iron in the fire too long — it became coarse and weak. They were observing grain growth without knowing the term. Their practice of heating quickly, working quickly, and cooling quickly minimized grain growth, producing fine-grained, strong steel.',
      checkQuestion: 'Why does cold working followed by recrystallization produce finer grains than the original metal?',
      checkAnswer: 'Cold working introduces many dislocations and deformation bands. During recrystallization, new grains nucleate at these defects. More nucleation sites mean more new grains competing for space, resulting in smaller final grain size. The heavily deformed regions provide abundant nucleation sites.',
      codeIntro: 'Simulate grain growth at different temperatures and optimize the forging process.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Grain growth kinetics
Q = 120000     # activation energy (J/mol) for iron
R = 8.314      # gas constant
K = 1e8        # rate constant (μm²/s)

def grain_size(d0, T_celsius, time_s):
    """Calculate grain size after heating at temperature T for time t."""
    T_K = T_celsius + 273.15
    d_squared = d0**2 + K * time_s * np.exp(-Q / (R * T_K))
    return np.sqrt(d_squared)

times = np.linspace(0, 3600, 500)  # 0 to 1 hour
d0 = 10  # initial grain size (μm)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Grain growth at different temperatures
ax1.set_facecolor('#1f2937')
temps = [700, 800, 900, 1000, 1100]
colors = ['#34d399', '#22d3ee', '#fbbf24', '#fb923c', '#f87171']

for T, color in zip(temps, colors):
    d = grain_size(d0, T, times)
    ax1.plot(times / 60, d, color=color, linewidth=2.5, label=f'{T}°C')

ax1.axhline(20, color='white', linestyle=':', alpha=0.3)
ax1.text(55, 21, 'Max for strong steel', color='white', fontsize=9, ha='right')

ax1.set_xlabel('Time (minutes)', color='lightgray', fontsize=12)
ax1.set_ylabel('Grain size (μm)', color='lightgray', fontsize=12)
ax1.set_title('Grain Growth at Different Temperatures', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Strength vs soaking time at 900°C
ax2.set_facecolor('#1f2937')
soak_times = np.linspace(0, 3600, 200)
d_900 = grain_size(d0, 900, soak_times)
sigma_0 = 50
k_hp = 600
strength = sigma_0 + k_hp / np.sqrt(d_900)

ax2.plot(soak_times / 60, strength, color='#a78bfa', linewidth=2.5)
ax2.fill_between(soak_times / 60, strength, alpha=0.15, color='#a78bfa')

# Mark optimal window
optimal_end = soak_times[np.argmin(np.abs(strength - (strength[0] * 0.9)))] / 60
ax2.axvspan(0, optimal_end, alpha=0.1, color='#34d399')
ax2.text(optimal_end / 2, strength.min() * 1.01, 'Optimal\nwindow',
         color='#34d399', fontsize=10, ha='center')

ax2.set_xlabel('Time at 900°C (minutes)', color='lightgray', fontsize=12)
ax2.set_ylabel('Yield strength (MPa)', color='lightgray', fontsize=12)
ax2.set_title('Strength Loss from Grain Growth at 900°C', color='white', fontsize=13, fontweight='bold')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/iron_grain.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Forging window analysis at 900°C:")
for t_min in [5, 10, 20, 30, 60]:
    d = grain_size(d0, 900, t_min * 60)
    s = sigma_0 + k_hp / np.sqrt(d)
    loss = (1 - s / (sigma_0 + k_hp / np.sqrt(d0))) * 100
    print(f"  {t_min:3d} min: grain = {d:.1f} μm, strength = {s:.0f} MPa ({loss:.1f}% loss)")`,
      challenge: 'Model a multi-step forging process: heat to 900°C for 10 min (grains grow), hammer (grains refine by 50%), heat again for 5 min, hammer again. Track grain size through each step. How many heating-hammering cycles produce the finest grain?',
      successHint: 'You modeled grain growth kinetics with the Arrhenius equation — a cornerstone of materials processing. Understanding grain growth is essential for optimizing any thermal process, from forging to welding to heat treatment of surgical implants.',
    },
    {
      title: 'Phase transformation kinetics — the Avrami equation',
      concept: `Phase transformations (austenite → pearlite, austenite → martensite) do not happen instantly. The **Avrami equation** describes the fraction transformed over time:

\`f(t) = 1 - exp(-k × t^n)\`

Where:
- f = fraction of material transformed (0 to 1)
- k = rate constant (temperature-dependent)
- n = Avrami exponent (depends on nucleation and growth geometry)
- t = time

Typical values:
- n = 1: interface-controlled, no new nucleation
- n = 2: 1D growth with constant nucleation
- n = 3: 2D growth with constant nucleation
- n = 4: 3D growth with constant nucleation (most common for steel)

The **TTT diagram** plots contours of constant transformation fraction (e.g., 1%, 50%, 99%) in temperature-time space.

📚 *The Avrami equation is a stretched exponential — it starts slow (nucleation), accelerates (growth), and then decelerates (impingement of growing grains).*`,
      analogy: 'The Avrami equation describes how ice forms on a pond. First, a few ice crystals nucleate at the edges (slow start). Then they grow rapidly across the surface (fast middle). Finally, the last patches of water between ice sheets freeze slowly (slow finish). The S-shaped transformation curve looks just like the logistic growth curve from ecology.',
      storyConnection: 'The TTT diagram tells a blacksmith exactly how fast to cool to get the desired structure. The Lushai smiths did not have TTT diagrams, but they had something equally valuable: generations of experience that told them "quench in cold water for a hard edge, cool in air for a soft body." The TTT diagram is the scientific explanation of their craft.',
      checkQuestion: 'Why does the transformation rate peak at an intermediate temperature rather than at the highest or lowest temperature?',
      checkAnswer: 'At high temperature: thermodynamic driving force is low (not far below equilibrium), so nucleation is slow. At low temperature: atoms move slowly (low diffusivity), so growth is slow. The fastest transformation occurs at an intermediate temperature where both driving force and atomic mobility are reasonable. This creates the C-shaped curve in the TTT diagram.',
      codeIntro: 'Model phase transformation kinetics using the Avrami equation and construct a TTT diagram.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

def avrami(t, k, n):
    """Fraction transformed at time t."""
    return 1 - np.exp(-k * t**n)

# Temperature-dependent rate constant (C-shaped curve)
def rate_constant(T, T_eq=727, T_nose=550):
    """Rate constant with C-curve shape."""
    driving_force = max(T_eq - T, 1)  # increases as T drops below equilibrium
    diffusivity = np.exp(-15000 / (T + 273))  # decreases as T drops
    return 1e-6 * driving_force * diffusivity

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Avrami curves at different temperatures
ax1.set_facecolor('#1f2937')
n = 3  # Avrami exponent
temps = [700, 600, 500, 400, 300]
colors = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa']

t = np.linspace(0.1, 1000, 500)
for T, color in zip(temps, colors):
    k = rate_constant(T)
    f = avrami(t, k, n)
    ax1.plot(t, f * 100, color=color, linewidth=2.5, label=f'{T}°C')

ax1.axhline(50, color='white', linestyle=':', alpha=0.3)
ax1.set_xlabel('Time (seconds)', color='lightgray', fontsize=12)
ax1.set_ylabel('% Transformed', color='lightgray', fontsize=12)
ax1.set_title('Avrami Transformation Curves', color='white', fontsize=13, fontweight='bold')
ax1.set_xscale('log')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# TTT diagram
ax2.set_facecolor('#1f2937')
temp_range = np.arange(300, 720, 5)
for frac, color, label in [(0.01, '#34d399', '1% transformed'),
                             (0.50, '#fbbf24', '50% transformed'),
                             (0.99, '#f87171', '99% transformed')]:
    times_at_frac = []
    for T in temp_range:
        k = rate_constant(T)
        if k > 0:
            t_frac = (-np.log(1 - frac) / k) ** (1/n)
            times_at_frac.append(t_frac)
        else:
            times_at_frac.append(1e6)

    ax2.plot(times_at_frac, temp_range, color=color, linewidth=2.5, label=label)

# Mark regions
ax2.text(5, 650, 'Pearlite', color='#f87171', fontsize=12, fontweight='bold')
ax2.text(50, 450, 'Bainite', color='#fbbf24', fontsize=12, fontweight='bold')
ax2.axhline(220, color='#a78bfa', linewidth=1.5, linestyle='--')
ax2.text(5, 200, 'Ms (martensite)', color='#a78bfa', fontsize=10)

ax2.set_xlabel('Time (seconds, log scale)', color='lightgray', fontsize=12)
ax2.set_ylabel('Temperature (°C)', color='lightgray', fontsize=12)
ax2.set_title('TTT Diagram for Steel', color='white', fontsize=13, fontweight='bold')
ax2.set_xscale('log')
ax2.set_xlim(1, 10000)
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/iron_ttt.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("To get martensite: cool from 727°C to below 220°C in < 1 second")
print("To get bainite: cool to ~400°C and hold for ~100 seconds")
print("To get pearlite: cool slowly through 600-700°C over minutes")`,
      challenge: 'Overlay a cooling curve on the TTT diagram. Draw the path of water quench, oil quench, and air cool. Which cooling paths cross the C-curve (forming pearlite/bainite), and which avoid it (forming martensite)?',
      successHint: 'You modeled phase transformation kinetics and constructed a TTT diagram — the metallurgist\'s most essential tool. This diagram, first created experimentally in the 1930s, is now computable from thermodynamic databases. It represents the distillation of centuries of blacksmithing knowledge into a single chart.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Computational Metallurgy & Simulations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
