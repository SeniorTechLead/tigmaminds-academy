import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PotterLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Clay mineral chemistry — what makes clay plastic',
      concept: `Clay is not just "wet dirt." It is a specific class of **phyllosilicate minerals** — layered sheets of silicon, aluminum, and oxygen atoms arranged in repeating crystalline structures. The most common clay minerals are **kaolinite** (Al₂Si₂O₅(OH)₄), **montmorillonite**, and **illite**, each with distinct properties determined by their atomic arrangement.

What makes clay uniquely useful for pottery is its **plasticity** — the ability to be shaped and hold that shape. This comes from water molecules trapped between the mineral layers. In kaolinite, each layer is about 0.7 nanometers thick, and water fills the gaps between layers. When you push on clay, the layers slide over each other on this water film, like playing cards sliding in a deck with oil between them. Remove the water (by drying or firing), and the layers lock together permanently.

The chemical composition matters enormously. Kaolinite has a 1:1 layer structure (one tetrahedral sheet bonded to one octahedral sheet), which makes it relatively non-expansive — it holds its shape well during drying. Montmorillonite has a 2:1 structure with weak interlayer bonds, so it absorbs enormous amounts of water and swells. A potter mixing these clays is essentially engineering at the molecular level, even if they do not know the chemistry.`,
      analogy: 'Think of clay layers like a stack of wet glass plates. Each plate is rigid on its own, but with water between them, the stack can flex and slide. Push gently and the plates rearrange — that is plasticity. Heat the stack until the water boils off and the glass edges fuse together — that is firing. The fused stack is rigid and permanent, just like a fired ceramic.',
      storyConnection: 'The little potter in the story shapes clay by feel, sensing when it is "just right" — neither too wet nor too dry. That intuition corresponds to an optimal water content of about 20-25% by weight for kaolinite. Too much water and the clay slumps; too little and it cracks. Generations of potters in Assam have calibrated this by hand, arriving at the same range that materials scientists measure in laboratories.',
      checkQuestion: 'If kaolinite has a layer thickness of 0.7 nm and a typical pottery clay sample is 2 mm thick, approximately how many mineral layers are stacked in that sample?',
      checkAnswer: '2 mm = 2,000,000 nm. Dividing by 0.7 nm per layer gives approximately 2,857,000 layers. Nearly 3 million layers of crystalline mineral, each sliding on a film of water molecules — this is why clay feels so smooth and responsive to touch.',
      codeIntro: 'Model the relationship between water content and plasticity for different clay minerals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Clay mineral properties
minerals = {
    'Kaolinite': {'layer_charge': 0.0, 'cec': 5, 'surface_area': 15, 'color': '#d4a373'},
    'Illite': {'layer_charge': 0.8, 'cec': 25, 'surface_area': 80, 'color': '#a3b18a'},
    'Montmorillonite': {'layer_charge': 0.6, 'cec': 100, 'surface_area': 700, 'color': '#588157'},
}

water_content = np.linspace(0, 50, 200)  # percent by weight

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plasticity vs water content for each mineral
for name, props in minerals.items():
    sa = props['surface_area']
    # Plasticity peaks at optimal water content, then drops
    optimal_water = 10 + sa * 0.04  # higher surface area needs more water
    width = 5 + sa * 0.02
    plasticity = np.exp(-0.5 * ((water_content - optimal_water) / width) ** 2)
    # Strength decreases monotonically with water
    strength = 1.0 / (1 + np.exp(0.2 * (water_content - optimal_water)))

    axes[0].plot(water_content, plasticity, color=props['color'], linewidth=2, label=name)
    axes[1].plot(water_content, strength, color=props['color'], linewidth=2, label=name)

axes[0].set_xlabel('Water content (%)', color='white')
axes[0].set_ylabel('Plasticity index', color='white')
axes[0].set_title('Plasticity vs water content', color='white', fontsize=11)
axes[0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

axes[1].set_xlabel('Water content (%)', color='white')
axes[1].set_ylabel('Green strength', color='white')
axes[1].set_title('Unfired strength vs water', color='white', fontsize=11)
axes[1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Workability window (plasticity x strength)
for name, props in minerals.items():
    sa = props['surface_area']
    optimal_water = 10 + sa * 0.04
    width = 5 + sa * 0.02
    plasticity = np.exp(-0.5 * ((water_content - optimal_water) / width) ** 2)
    strength = 1.0 / (1 + np.exp(0.2 * (water_content - optimal_water)))
    workability = plasticity * strength
    axes[2].plot(water_content, workability, color=props['color'], linewidth=2, label=name)
    peak_idx = np.argmax(workability)
    axes[2].axvline(water_content[peak_idx], color=props['color'], linestyle='--', alpha=0.5)
    axes[2].annotate(f'{water_content[peak_idx]:.0f}%', xy=(water_content[peak_idx], workability[peak_idx]),
                     color=props['color'], fontsize=8, ha='center', va='bottom')

axes[2].set_xlabel('Water content (%)', color='white')
axes[2].set_ylabel('Workability (plasticity x strength)', color='white')
axes[2].set_title('Optimal working range', color='white', fontsize=11)
axes[2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Clay mineral comparison:")
for name, props in minerals.items():
    sa = props['surface_area']
    optimal = 10 + sa * 0.04
    print(f"  {name}: optimal water = {optimal:.0f}%, surface area = {sa} m2/g, CEC = {props['cec']} meq/100g")
print("\\\nHigher surface area minerals need more water but are more plastic.")
print("Potters blend clays to balance workability and fired strength.")`,
      challenge: 'Add a fourth clay mineral "Vermiculite" with surface_area=600, cec=150, layer_charge=0.7. How does its workability window compare to montmorillonite?',
      successHint: 'Understanding clay at the molecular level explains why different pottery traditions use different clays. Assamese potters prefer kaolinite-rich clays because they are forgiving — a wide workability window and minimal shrinkage during firing.',
    },
    {
      title: 'Kiln thermodynamics — heat transfer in ceramic firing',
      concept: `Firing pottery is a precisely controlled thermodynamic process. A kiln must raise the temperature of clay objects from ambient (~25°C) to between 900°C and 1300°C, depending on the desired ceramic type. The physics governing this process involves three modes of heat transfer: **conduction**, **convection**, and **radiation**, each dominating at different temperature ranges.

At low temperatures (below ~500°C), **convection** dominates — hot air circulates around the pottery, transferring heat through fluid motion. As temperature rises above 500°C, **radiation** becomes increasingly important because radiative heat transfer scales with the fourth power of absolute temperature (Stefan-Boltzmann law: P = σεAT⁴). By 1000°C, radiation accounts for over 80% of heat transfer. This is why potters watch the "color" of the kiln interior — the visible glow is literally the thermal radiation that is doing most of the work.

The heating rate matters as much as the final temperature. Water trapped in clay expands as steam at 100°C, and if the temperature rises too fast, steam pressure builds inside the clay body faster than it can escape through pores. The result is **spalling** — explosive fracture. Traditional potters learned to heat slowly through the "water smoking" phase (100-200°C) and the "quartz inversion" at 573°C, where crystalline quartz undergoes a sudden volume change. These are not arbitrary traditions — they are thermodynamic necessities.`,
      analogy: 'A kiln is like an oven cooking a turkey, but far more demanding. If you cook a turkey too fast on the outside, the inside stays raw while the skin burns. Similarly, if a kiln heats too fast, the outside of a pot reaches 1000°C while the inside is still releasing steam at 200°C. The thermal gradient creates stress that cracks the piece. Slow, even heating — just like good cooking — is about patience and physics.',
      storyConnection: 'The story describes the potter carefully feeding the fire, watching its color shift from red to orange to white. These colors correspond to precise temperatures: dull red is ~700°C, cherry red is ~850°C, bright orange is ~1000°C, and white heat is ~1200°C. Before thermometers, potters used their eyes as temperature sensors, a skill refined over thousands of years in Assam pottery villages.',
      checkQuestion: 'Using the Stefan-Boltzmann law, by what factor does radiative heat transfer increase when kiln temperature rises from 500°C (773 K) to 1000°C (1273 K)?',
      checkAnswer: 'Ratio = (1273/773)⁴ = (1.647)⁴ = 7.35. Radiative heat transfer increases by a factor of 7.35 — more than seven times the power at 1000°C compared to 500°C. This explains why kilns consume most of their fuel in the final temperature push and why radiation dominates at high temperatures.',
      codeIntro: 'Simulate heat transfer in a kiln and visualize the temperature distribution through a clay body during firing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D heat conduction through a clay wall (finite difference method)
# Clay properties
k = 1.0          # thermal conductivity (W/m·K)
rho = 1800       # density (kg/m³)
cp = 900         # specific heat capacity (J/kg·K)
alpha = k / (rho * cp)  # thermal diffusivity (m²/s)

# Spatial discretization
wall_thickness = 0.01  # 1 cm thick wall
nx = 50
dx = wall_thickness / nx
x = np.linspace(0, wall_thickness * 100, nx)  # in cm for display

# Time discretization
dt = 0.5  # seconds
total_time = 8 * 3600  # 8 hours in seconds
nt = int(total_time / dt)

# Stability check (CFL condition)
cfl = alpha * dt / dx**2
print(f"CFL number: {cfl:.4f} (must be < 0.5 for stability)")

# Kiln heating schedule (outside temperature vs time)
def kiln_temp(t_seconds):
    t_hours = t_seconds / 3600
    if t_hours < 1:
        return 25 + 175 * t_hours        # slow initial: 25 -> 200C
    elif t_hours < 3:
        return 200 + 200 * (t_hours - 1)  # water smoking: 200 -> 600C
    elif t_hours < 5:
        return 600 + 250 * (t_hours - 3)  # ramp: 600 -> 1100C
    elif t_hours < 7:
        return 1100                         # soak at peak
    else:
        return 1100 - 550 * (t_hours - 7)  # cool down

# Initialize temperature field
T = np.ones(nx) * 25.0  # room temperature

# Store snapshots
snapshot_times = [0, 0.5, 1, 2, 3, 5, 7, 8]  # hours
snapshots = {}
surface_temps = []
center_temps = []
time_hours = []

for n in range(nt):
    t_sec = n * dt
    t_hr = t_sec / 3600

    # Boundary conditions
    T_surface = kiln_temp(t_sec)
    T[0] = T_surface   # outer surface = kiln temp
    T[-1] = T[-2]       # inner surface: insulated (symmetric)

    # Forward Euler step
    T_new = T.copy()
    for i in range(1, nx - 1):
        T_new[i] = T[i] + alpha * dt / dx**2 * (T[i+1] - 2*T[i] + T[i-1])
    T = T_new

    # Record
    if n % 100 == 0:
        surface_temps.append(T[0])
        center_temps.append(T[nx//2])
        time_hours.append(t_hr)

    for st in snapshot_times:
        if abs(t_hr - st) < dt / 7200:
            snapshots[st] = T.copy()

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Temperature profiles at different times
colors = plt.cm.hot(np.linspace(0.2, 0.9, len(snapshot_times)))
for (st, T_snap), c in zip(sorted(snapshots.items()), colors):
    axes[0, 0].plot(x, T_snap, color=c, linewidth=2, label=f't={st:.1f}h')
axes[0, 0].set_xlabel('Depth into wall (cm)', color='white')
axes[0, 0].set_ylabel('Temperature (°C)', color='white')
axes[0, 0].set_title('Temperature profile through clay wall', color='white', fontsize=11)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Surface vs center temperature
axes[0, 1].plot(time_hours, surface_temps, color='#ef4444', linewidth=2, label='Surface')
axes[0, 1].plot(time_hours, center_temps, color='#3b82f6', linewidth=2, label='Center')
axes[0, 1].fill_between(time_hours, surface_temps, center_temps, alpha=0.2, color='#f59e0b')
axes[0, 1].set_xlabel('Time (hours)', color='white')
axes[0, 1].set_ylabel('Temperature (°C)', color='white')
axes[0, 1].set_title('Surface vs center temperature', color='white', fontsize=11)
axes[0, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Thermal gradient (stress indicator)
gradients = [np.max(np.abs(np.diff(snapshots[st]))) / dx * 100 for st in sorted(snapshots.keys()) if st in snapshots]
axes[1, 0].bar(range(len(gradients)), gradients, color='#f59e0b', alpha=0.8)
axes[1, 0].set_xticks(range(len(gradients)))
axes[1, 0].set_xticklabels([f'{st}h' for st in sorted(snapshots.keys())], color='gray', fontsize=8)
axes[1, 0].set_ylabel('Max thermal gradient (°C/cm)', color='white')
axes[1, 0].set_title('Thermal stress indicator', color='white', fontsize=11)

# Heat transfer modes vs temperature
T_range = np.linspace(300, 1600, 100)  # Kelvin
sigma = 5.67e-8
conv_coeff = 15  # W/m²·K (natural convection)
emissivity = 0.9
radiation = sigma * emissivity * T_range**4 / 1e4  # normalized
convection = conv_coeff * (T_range - 300) / 1e3
total = radiation + convection
axes[1, 1].stackplot(T_range - 273, [convection, radiation],
                     colors=['#3b82f6', '#ef4444'], alpha=0.7,
                     labels=['Convection', 'Radiation'])
axes[1, 1].set_xlabel('Temperature (°C)', color='white')
axes[1, 1].set_ylabel('Heat flux (normalized)', color='white')
axes[1, 1].set_title('Convection vs radiation dominance', color='white', fontsize=11)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Kiln thermodynamics summary:")
print(f"  Wall thickness: {wall_thickness*100:.1f} cm")
print(f"  Peak surface-center lag: {max(np.array(surface_temps) - np.array(center_temps)):.0f}°C")
print(f"  Thermal diffusivity: {alpha:.2e} m²/s")
print(f"\\\nRadiation dominates above ~500°C — this is why kiln color matters.")`,
      challenge: 'Double the wall thickness to 2 cm and rerun. How much longer does the center take to reach peak temperature? What does this tell you about optimal pottery wall thickness?',
      successHint: 'Thermal gradients cause stress. Thin walls heat evenly but are fragile; thick walls are strong but crack during firing. Every potter navigates this tradeoff, whether they know the physics or not.',
    },
    {
      title: 'Phase transformations — from clay to ceramic',
      concept: `When clay is fired, it undergoes a series of irreversible **phase transformations** — changes in crystal structure that fundamentally alter the material. These are not gradual changes but distinct events at specific temperatures, each governed by thermodynamic energy barriers.

The first major transformation occurs at 573°C: the **quartz inversion**. Crystalline quartz (SiO₂) exists in two forms — alpha-quartz (below 573°C) and beta-quartz (above). The transition involves a sudden 0.45% volume change as the crystal lattice rearranges. This seems tiny, but in a ceramic body containing millions of quartz grains, even 0.45% expansion concentrated at grain boundaries creates enormous local stress. This is why kilns must heat (and cool!) slowly through 573°C.

Between 600-900°C, the clay mineral itself decomposes in a process called **dehydroxylation**. Kaolinite loses its structural hydroxyl groups: Al₂Si₂O₅(OH)₄ → Al₂Si₂O₇ + 2H₂O. The water is not surface moisture — it is water chemically bonded within the crystal lattice, and releasing it collapses the layered structure permanently. The resulting **metakaolin** is amorphous and reactive.

Above 1000°C, **mullite** (3Al₂O₃·2SiO₂) begins to crystallize from the amorphous metakaolin. Mullite is one of the strongest ceramic phases — its needle-like crystals interlock to create a material harder than steel. The remaining silica melts into a glass phase that fills pores and bonds everything together. This process is called **sintering**, and it is what transforms soft, crumbly fired clay into a dense, impermeable ceramic.`,
      analogy: 'Phase transformations in clay are like cooking an egg. A raw egg is a liquid protein solution. At 63°C, the whites begin to solidify — proteins unfold and bond together (denaturation). At 70°C, the yolks set. At 100°C, all water evaporates. You cannot "uncook" an egg, just as you cannot "unfire" a ceramic. Each temperature threshold triggers an irreversible structural change that creates a new material.',
      storyConnection: 'When the little potter taps a finished piece and hears a clear ring, that sound is the signature of mullite crystals interlocked with glass phase — a material that did not exist in the original clay. The transformation happened invisibly inside the kiln. Traditional Assamese potters judge firing success by this resonance: a dull thud means underfired (incomplete sintering), while a sharp ring means the crystalline structure formed properly.',
      checkQuestion: 'If kaolinite (Al₂Si₂O₅(OH)₄, molar mass 258 g/mol) loses 2 water molecules (molar mass 18 g/mol each) during dehydroxylation, what percentage of its mass is lost?',
      checkAnswer: 'Mass lost = 2 × 18 = 36 g/mol. Percentage = 36/258 × 100 = 13.95%. This means roughly 14% of the clay mass escapes as water vapor during firing. This mass loss, combined with the volume changes from phase transformations, causes significant shrinkage — typically 8-12% linear shrinkage from wet clay to finished ceramic.',
      codeIntro: 'Model the phase transformations during firing and visualize the changing composition of clay as temperature increases.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Phase transformation model during ceramic firing
temp = np.linspace(25, 1300, 1000)

# Phase fractions as functions of temperature
def sigmoid(T, T_mid, width):
    return 1 / (1 + np.exp(-(T - T_mid) / width))

# Free water loss (25-200°C)
free_water = 1 - sigmoid(temp, 100, 20)

# Kaolinite -> metakaolin (dehydroxylation, 450-700°C)
kaolinite = 1 - sigmoid(temp, 550, 40)
metakaolin = sigmoid(temp, 550, 40) * (1 - sigmoid(temp, 1000, 50))

# Quartz phases
alpha_quartz = 0.3 * (1 - sigmoid(temp, 573, 5))  # sharp transition
beta_quartz = 0.3 * sigmoid(temp, 573, 5) * (1 - sigmoid(temp, 1100, 60))

# Mullite formation (>950°C)
mullite = 0.4 * sigmoid(temp, 1050, 50)

# Glass phase (>900°C)
glass = 0.3 * sigmoid(temp, 1000, 80)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Phase diagram
axes[0, 0].stackplot(temp,
    free_water * 0.15, kaolinite * 0.5, metakaolin * 0.3,
    alpha_quartz, beta_quartz, mullite, glass,
    colors=['#60a5fa', '#d4a373', '#92400e', '#94a3b8', '#cbd5e1', '#f43f5e', '#a78bfa'],
    labels=['Free water', 'Kaolinite', 'Metakaolin', 'α-Quartz', 'β-Quartz', 'Mullite', 'Glass'],
    alpha=0.8)
axes[0, 0].set_xlabel('Temperature (°C)', color='white')
axes[0, 0].set_ylabel('Phase fraction', color='white')
axes[0, 0].set_title('Phase composition during firing', color='white', fontsize=11)
axes[0, 0].legend(loc='center right', fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Volume change
volume_change = np.zeros_like(temp)
# Water loss shrinkage
volume_change -= 0.08 * sigmoid(temp, 100, 20)
# Quartz inversion expansion
volume_change += 0.0045 * 0.3 * sigmoid(temp, 573, 5)
# Dehydroxylation shrinkage
volume_change -= 0.04 * sigmoid(temp, 550, 40)
# Sintering shrinkage
volume_change -= 0.12 * sigmoid(temp, 1050, 80)

axes[0, 1].plot(temp, volume_change * 100, color='#f59e0b', linewidth=2)
axes[0, 1].fill_between(temp, volume_change * 100, alpha=0.3, color='#f59e0b')
axes[0, 1].axhline(0, color='gray', linewidth=0.5)
axes[0, 1].axvline(573, color='#ef4444', linestyle='--', alpha=0.7, linewidth=1)
axes[0, 1].annotate('Quartz\\\ninversion', xy=(573, 0.5), color='#ef4444', fontsize=8, ha='center')
axes[0, 1].set_xlabel('Temperature (°C)', color='white')
axes[0, 1].set_ylabel('Volume change (%)', color='white')
axes[0, 1].set_title('Dimensional changes during firing', color='white', fontsize=11)

# Energy absorption (DTA-like curve)
energy = np.zeros_like(temp)
# Endothermic: water loss
energy += 5 * np.exp(-0.5 * ((temp - 100) / 30)**2)
# Endothermic: dehydroxylation
energy += 8 * np.exp(-0.5 * ((temp - 550) / 40)**2)
# Exothermic: mullite crystallization
energy -= 3 * np.exp(-0.5 * ((temp - 1000) / 30)**2)
# Quartz inversion (small endothermic)
energy += 2 * np.exp(-0.5 * ((temp - 573) / 5)**2)

axes[1, 0].plot(temp, energy, color='#22c55e', linewidth=2)
axes[1, 0].fill_between(temp, energy, where=energy > 0, alpha=0.3, color='#ef4444', label='Endothermic')
axes[1, 0].fill_between(temp, energy, where=energy < 0, alpha=0.3, color='#3b82f6', label='Exothermic')
axes[1, 0].axhline(0, color='gray', linewidth=0.5)
axes[1, 0].set_xlabel('Temperature (°C)', color='white')
axes[1, 0].set_ylabel('Heat flow (a.u.)', color='white')
axes[1, 0].set_title('Thermal analysis (DTA-like)', color='white', fontsize=11)
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Material properties vs firing temperature
firing_temps = np.array([600, 700, 800, 900, 1000, 1100, 1200, 1300])
porosity = np.array([40, 35, 30, 25, 18, 12, 6, 3])
strength = np.array([5, 10, 18, 30, 50, 75, 100, 110])
water_absorption = np.array([25, 22, 18, 14, 9, 5, 2, 0.5])

ax2 = axes[1, 1].twinx()
axes[1, 1].plot(firing_temps, porosity, 'o-', color='#3b82f6', linewidth=2, label='Porosity (%)')
axes[1, 1].plot(firing_temps, water_absorption, 's-', color='#60a5fa', linewidth=2, label='Water absorption (%)')
ax2.plot(firing_temps, strength, '^-', color='#ef4444', linewidth=2, label='Strength (MPa)')
axes[1, 1].set_xlabel('Firing temperature (°C)', color='white')
axes[1, 1].set_ylabel('Porosity / Absorption (%)', color='white')
ax2.set_ylabel('Compressive strength (MPa)', color='#ef4444')
ax2.tick_params(colors='#ef4444')
axes[1, 1].set_title('Fired properties vs temperature', color='white', fontsize=11)
lines1, labels1 = axes[1, 1].get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
axes[1, 1].legend(lines1 + lines2, labels1 + labels2, fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Phase transformation summary:")
print("  100°C: Free water evaporates (endothermic)")
print("  450-700°C: Kaolinite dehydroxylation → metakaolin (endothermic)")
print("  573°C: Quartz α→β inversion (0.45% volume change)")
print("  950-1100°C: Mullite crystallization (exothermic)")
print("  >1000°C: Glass phase forms, sintering closes pores")
print("\\\nEach transformation is irreversible — clay becomes ceramic permanently.")`,
      challenge: 'Add a cooling curve analysis: plot the reverse quartz inversion at 573°C during cooling. Why is this transition equally dangerous during cooling? What happens if you cool too fast?',
      successHint: 'Phase transformations are the bridge between chemistry and engineering. Understanding them explains why certain temperatures are critical, why firing schedules exist, and why a 10°C mistake can ruin an entire kiln load.',
    },
    {
      title: 'Thermal stress and fracture mechanics in ceramics',
      concept: `Ceramics are strong under compression but catastrophically weak under tension. A ceramic pot can support 100 kg of weight on top of it, yet shatter if dropped from waist height. This asymmetry comes from the nature of **ionic and covalent bonds** in ceramic materials — they resist being pushed together (compression) but snap cleanly when pulled apart (tension).

**Thermal stress** arises whenever different parts of an object are at different temperatures. The hot outer surface of a pot in a kiln expands, while the cooler interior does not. This creates a tensile stress on the interior and compressive stress on the exterior. The thermal stress is given by σ = Eα(ΔT)/(1-ν), where E is Young's modulus, α is the coefficient of thermal expansion, ΔT is the temperature difference, and ν is Poisson's ratio. For typical ceramics, E ≈ 70 GPa and α ≈ 7×10⁻⁶/°C. A temperature difference of just 100°C creates stresses of about 50 MPa — dangerously close to the tensile strength of many ceramics.

**Fracture mechanics** tells us that cracks propagate when the stress intensity at the crack tip exceeds a critical value called the **fracture toughness** (K_IC). Ceramics have extremely low fracture toughness — about 1-3 MPa·√m compared to 50-100 for steel. This means even tiny flaws (microcracks, inclusions, pores) can become crack initiation sites. The stress concentrates at the tip of a flaw like water pressure at the end of a crack in a dam, and the crack grows explosively once started.`,
      analogy: 'Think of a ceramic as a wall of bricks without mortar. Push from both sides and the wall stands firm — each brick supports its neighbors in compression. But pull from one side and the wall collapses instantly because nothing holds the bricks together in tension. A crack in a ceramic is like removing one brick from the base — all the load redistributes to neighboring bricks, which then fail in a chain reaction.',
      storyConnection: 'Every potter knows the heartbreak of a cracked pot discovered after opening the kiln. The little potter in the story learns to fire slowly and cool slowly — wisdom passed down through generations. The science confirms this: thermal shock resistance is proportional to strength divided by (modulus × expansion coefficient). Slow temperature changes keep ΔT small, keeping stress below the failure threshold.',
      checkQuestion: 'If a ceramic has E = 70 GPa, α = 7×10⁻⁶/°C, ν = 0.25, and tensile strength = 60 MPa, what is the maximum allowable temperature difference across the wall before fracture?',
      checkAnswer: 'σ = Eα(ΔT)/(1-ν), so ΔT = σ(1-ν)/(Eα) = 60×10⁶ × 0.75 / (70×10⁹ × 7×10⁻⁶) = 45×10⁶ / 490×10³ = 91.8°C. A temperature difference of just 92°C across the wall can cause fracture. This explains why heating rates of 50-100°C per hour are typical — they keep the temperature gradient below the critical value.',
      codeIntro: 'Calculate thermal stress distribution in a cylindrical pot during firing and identify failure conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Thermal stress in a cylindrical ceramic wall
# Material properties
E = 70e9        # Young's modulus (Pa)
alpha_th = 7e-6 # thermal expansion coefficient (1/°C)
nu = 0.25       # Poisson's ratio
sigma_tensile = 60e6  # tensile strength (Pa)
K_IC = 2.0      # fracture toughness (MPa·√m)

# Wall geometry
R_outer = 0.05  # 5 cm radius
wall_thickness = 0.008  # 8 mm
R_inner = R_outer - wall_thickness
r = np.linspace(R_inner, R_outer, 100)

# Temperature distribution (parabolic approximation)
# During heating: outer surface is hotter
delta_T_values = [20, 50, 80, 100, 150]  # surface-center temp difference

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = plt.cm.YlOrRd(np.linspace(0.3, 0.9, len(delta_T_values)))

for dT, c in zip(delta_T_values, colors):
    # Temperature profile (parabolic: hot outside, cool inside)
    T_profile = dT * ((r - R_inner) / wall_thickness)**2

    # Thermal stress in a thick cylinder (Timoshenko)
    T_mean = np.trapz(T_profile * r, r) / np.trapz(r * np.ones_like(r), r)
    sigma_r = E * alpha_th / (1 - nu) * (T_mean - T_profile)

    # Hoop stress (tangential)
    sigma_theta = E * alpha_th / (1 - nu) * (T_mean - T_profile) * 0.8  # simplified

    r_mm = (r - R_inner) * 1000  # convert to mm from inner surface

    axes[0, 0].plot(r_mm, T_profile, color=c, linewidth=2, label=f'ΔT={dT}°C')
    axes[0, 1].plot(r_mm, sigma_r / 1e6, color=c, linewidth=2, label=f'ΔT={dT}°C')

axes[0, 0].set_xlabel('Distance from inner surface (mm)', color='white')
axes[0, 0].set_ylabel('Temperature above center (°C)', color='white')
axes[0, 0].set_title('Temperature profiles', color='white', fontsize=11)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

axes[0, 1].axhline(sigma_tensile / 1e6, color='#ef4444', linestyle='--', linewidth=1, label='Tensile strength')
axes[0, 1].axhline(-sigma_tensile / 1e6, color='#ef4444', linestyle='--', linewidth=1)
axes[0, 1].set_xlabel('Distance from inner surface (mm)', color='white')
axes[0, 1].set_ylabel('Thermal stress (MPa)', color='white')
axes[0, 1].set_title('Stress distribution', color='white', fontsize=11)
axes[0, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Thermal shock resistance parameter
# R = sigma_f(1-nu) / (E*alpha)
R_param = sigma_tensile * (1 - nu) / (E * alpha_th)
print(f"Thermal shock resistance parameter R = {R_param:.1f}°C")

# Fracture mechanics: critical flaw size
flaw_sizes = np.linspace(0.01e-3, 2e-3, 100)  # 10 um to 2 mm
stresses = np.linspace(10e6, 80e6, 5)

for s in stresses:
    K_I = s * np.sqrt(np.pi * flaw_sizes) * 1.12  # edge crack factor
    axes[1, 0].plot(flaw_sizes * 1000, K_I / 1e6, linewidth=2,
                     label=f'σ={s/1e6:.0f} MPa')

axes[1, 0].axhline(K_IC, color='#ef4444', linestyle='--', linewidth=2, label=f'K_IC = {K_IC} MPa√m')
axes[1, 0].set_xlabel('Flaw size (mm)', color='white')
axes[1, 0].set_ylabel('Stress intensity K_I (MPa·√m)', color='white')
axes[1, 0].set_title('Fracture mechanics: flaw size vs K_I', color='white', fontsize=11)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Heating rate vs survival probability (Weibull-like)
heating_rates = np.linspace(10, 500, 100)  # °C/hour
# Faster heating -> larger ΔT -> higher stress -> more failures
delta_T_from_rate = heating_rates * 0.3  # rough: ΔT scales with rate
stress_from_rate = E * alpha_th * delta_T_from_rate / (1 - nu)
# Weibull survival probability
m_weibull = 8  # Weibull modulus for ceramics
sigma_0 = sigma_tensile
survival = np.exp(-(stress_from_rate / sigma_0)**m_weibull)

axes[1, 1].plot(heating_rates, survival * 100, color='#22c55e', linewidth=2)
axes[1, 1].fill_between(heating_rates, survival * 100, alpha=0.2, color='#22c55e')
axes[1, 1].axhline(95, color='#f59e0b', linestyle='--', alpha=0.7, label='95% target')
safe_rate = heating_rates[np.argmin(np.abs(survival - 0.95))]
axes[1, 1].axvline(safe_rate, color='#f59e0b', linestyle='--', alpha=0.7)
axes[1, 1].annotate(f'Safe: {safe_rate:.0f}°C/h', xy=(safe_rate, 95), color='#f59e0b',
                     fontsize=9, ha='right', va='bottom')
axes[1, 1].set_xlabel('Heating rate (°C/hour)', color='white')
axes[1, 1].set_ylabel('Survival probability (%)', color='white')
axes[1, 1].set_title('Survival vs heating rate', color='white', fontsize=11)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"\\\nFracture analysis:")
print(f"  Critical flaw size at 40 MPa: {(K_IC / (40 * 1.12))**2 / np.pi * 1e6:.1f} μm")
print(f"  Safe heating rate (95% survival): {safe_rate:.0f}°C/hour")
print(f"  Max ΔT before fracture: {R_param:.0f}°C")`,
      challenge: 'Model the cooling phase: reverse the temperature gradient (inner surface hotter than outer as kiln cools). Where does the maximum tensile stress occur now? Why is cooling through 573°C (quartz inversion) especially dangerous?',
      successHint: 'Fracture mechanics explains why ancient potters added sand (grog) to clay — the quartz particles create many small flaws instead of few large ones, distributing stress more evenly. A counterintuitive solution: more flaws can mean fewer failures.',
    },
    {
      title: 'Glaze chemistry — silica melts and color from metal ions',
      concept: `A ceramic glaze is a thin layer of **glass** fused to the pottery surface. Glass is an amorphous (non-crystalline) solid formed when a silica-rich liquid cools too fast to crystallize. The basic glass former is **silica** (SiO₂), but pure silica melts at 1713°C — far too hot for a pottery kiln. To lower this melting point, potters add **fluxes**: metal oxides that break Si-O-Si bonds and disrupt the silica network.

Common fluxes include sodium oxide (Na₂O, melts to ~800°C), potassium oxide (K₂O), and calcium oxide (CaO). Each flux atom inserts itself between silica tetrahedra, breaking bridging oxygen bonds and creating "non-bridging oxygens." The more flux, the lower the melting point — but also the weaker the glass and the more it flows. Too much flux creates a glaze that runs off the pot; too little creates an underfired, rough surface.

The beautiful colors in glazes come from **transition metal ions** absorbing specific wavelengths of light. Copper (Cu²⁺) absorbs red light and appears blue-green in oxidizing atmospheres, but Cu⁺ in reducing conditions creates deep red (the famous copper red of Chinese ceramics). Iron (Fe³⁺) gives amber and brown in oxidation, while Fe²⁺ gives green-blue in reduction. Cobalt (Co²⁺) gives an intense blue in virtually all conditions — it is the most reliable ceramic colorant, used from ancient Mesopotamia to modern Delftware. The color depends on the ion's **crystal field splitting** — the energy gap between d-orbital electrons, which determines which wavelengths are absorbed.`,
      analogy: 'A glaze is like a candy coating on chocolate. Pure sugar (like pure silica) needs very high heat to melt. Adding corn syrup (a flux) lowers the melting point. Food coloring (like metal ions) gives it color. The ratio of sugar to syrup determines whether the coating is hard and glossy or soft and matte — exactly the tradeoff potters navigate with flux ratios.',
      storyConnection: 'Assamese pottery traditionally uses ash glazes — wood ash mixed with clay and water, painted onto pots before firing. Wood ash is a natural flux: it contains potassium, calcium, and phosphorus compounds that lower silica melting points. The specific trees burned (sal, bamboo, banana) produce ashes with different chemical compositions, giving each village a distinctive glaze character. The little potter discovers that different ashes produce different colors — an empirical discovery of crystal field chemistry.',
      checkQuestion: 'If a glaze recipe has 60% SiO₂, 20% Na₂O, 15% CaO, and 5% Al₂O₃, and the eutectic melting point follows approximately T_melt = 1713 - 12×(%Na₂O) - 8×(%CaO) - 3×(%Al₂O₃) °C, what is the approximate melting temperature?',
      checkAnswer: 'T_melt = 1713 - 12×20 - 8×15 - 3×5 = 1713 - 240 - 120 - 15 = 1338°C. This is within range of a well-fired kiln (1200-1350°C). If we increase Na₂O to 25%, T_melt drops to 1278°C — a 60°C reduction from just 5% more flux. This sensitivity is why glaze recipes are guarded secrets.',
      codeIntro: 'Model glaze melting as a function of flux composition and visualize the color-producing absorption spectra of transition metal ions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Glaze chemistry simulation

# 1. Ternary phase diagram: SiO2 - Na2O - CaO
# Simplified melting point as function of composition
n = 100
sio2 = np.zeros((n, n))
na2o = np.zeros((n, n))
cao = np.zeros((n, n))
T_melt = np.full((n, n), np.nan)

for i in range(n):
    for j in range(n - i):
        s = 100 - i - j  # SiO2 percentage
        if s >= 30:  # need minimum SiO2 for glass
            sio2[i, j] = s
            na2o[i, j] = i
            cao[i, j] = j
            T_melt[i, j] = 1713 - 12 * i - 8 * j - 0.05 * i * j  # interaction term

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Melting temperature heatmap (Na2O vs CaO, SiO2 = remainder)
na_range = np.arange(0, 40)
ca_range = np.arange(0, 30)
Na, Ca = np.meshgrid(na_range, ca_range)
Si = 100 - Na - Ca
T = np.where(Si >= 30, 1713 - 12*Na - 8*Ca - 0.05*Na*Ca, np.nan)

im = axes[0, 0].contourf(na_range, ca_range, T, levels=20, cmap='RdYlBu_r')
axes[0, 0].contour(na_range, ca_range, T, levels=[1100, 1200, 1300], colors='white', linewidths=1)
plt.colorbar(im, ax=axes[0, 0], label='Melting T (°C)')
axes[0, 0].set_xlabel('Na₂O (%)', color='white')
axes[0, 0].set_ylabel('CaO (%)', color='white')
axes[0, 0].set_title('Glaze melting temperature', color='white', fontsize=11)

# Transition metal absorption spectra (crystal field theory)
wavelength = np.linspace(380, 750, 500)  # visible spectrum

def gaussian(x, center, width, height):
    return height * np.exp(-0.5 * ((x - center) / width)**2)

metals = {
    'Co²⁺ (blue)': {'absorptions': [(500, 30, 0.9), (580, 40, 0.7)], 'color': '#1e40af'},
    'Cu²⁺ (green)': {'absorptions': [(650, 50, 0.6), (430, 30, 0.3)], 'color': '#059669'},
    'Fe³⁺ (amber)': {'absorptions': [(420, 40, 0.5), (480, 30, 0.3)], 'color': '#d97706'},
    'Mn³⁺ (purple)': {'absorptions': [(500, 35, 0.7), (550, 25, 0.4)], 'color': '#7c3aed'},
    'Cr³⁺ (green)': {'absorptions': [(450, 30, 0.6), (650, 35, 0.8)], 'color': '#15803d'},
}

for name, data in metals.items():
    absorption = np.zeros_like(wavelength)
    for center, width, height in data['absorptions']:
        absorption += gaussian(wavelength, center, width, height)
    transmission = 1 - np.clip(absorption, 0, 1)
    axes[0, 1].plot(wavelength, absorption, color=data['color'], linewidth=2, label=name)

axes[0, 1].set_xlabel('Wavelength (nm)', color='white')
axes[0, 1].set_ylabel('Absorption', color='white')
axes[0, 1].set_title('Metal ion absorption spectra', color='white', fontsize=11)
axes[0, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Visible spectrum background
for i in range(len(wavelength)-1):
    wl = wavelength[i]
    if wl < 450: c = (0.3, 0, 0.5, 0.1)
    elif wl < 495: c = (0, 0, 0.5, 0.1)
    elif wl < 570: c = (0, 0.5, 0, 0.1)
    elif wl < 590: c = (0.5, 0.5, 0, 0.1)
    elif wl < 620: c = (0.5, 0.3, 0, 0.1)
    else: c = (0.5, 0, 0, 0.1)
    axes[0, 1].axvspan(wavelength[i], wavelength[i+1], color=c)

# Viscosity vs temperature for different flux levels
temp_range = np.linspace(800, 1400, 200)
flux_levels = [10, 15, 20, 25, 30]
for flux in flux_levels:
    # Arrhenius-like viscosity
    T_melt_est = 1713 - 12 * flux
    log_visc = 2 + 15 * np.exp(-0.005 * (temp_range - T_melt_est + 200))
    log_visc = np.clip(log_visc, 2, 14)
    axes[1, 0].plot(temp_range, log_visc, linewidth=2, label=f'{flux}% flux')

axes[1, 0].axhspan(3, 5, alpha=0.15, color='#22c55e')
axes[1, 0].annotate('Working range', xy=(850, 4), color='#22c55e', fontsize=9)
axes[1, 0].set_xlabel('Temperature (°C)', color='white')
axes[1, 0].set_ylabel('log₁₀(Viscosity) [Pa·s]', color='white')
axes[1, 0].set_title('Glaze viscosity vs temperature', color='white', fontsize=11)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Oxidation vs reduction: how atmosphere changes color
conditions = ['Oxidation', 'Reduction']
ions = ['Cu', 'Fe', 'Mn', 'Ti']
ox_colors = ['#0ea5e9', '#92400e', '#7c3aed', '#fafafa']
red_colors = ['#dc2626', '#22c55e', '#d4a373', '#1e3a5f']

x_pos = np.arange(len(ions))
width = 0.35
for i, (cond, colors_list) in enumerate(zip(conditions, [ox_colors, red_colors])):
    bars = axes[1, 1].bar(x_pos + i*width, [0.8]*len(ions), width, color=colors_list,
                           edgecolor='gray', linewidth=0.5)
    for bar, ion, col in zip(bars, ions, colors_list):
        axes[1, 1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
                        cond, ha='center', va='bottom', color='white', fontsize=7)

axes[1, 1].set_xticks(x_pos + width/2)
axes[1, 1].set_xticklabels(ions, color='white')
axes[1, 1].set_ylabel('(Color shown by bar fill)', color='white')
axes[1, 1].set_title('Color change: oxidation vs reduction', color='white', fontsize=11)
axes[1, 1].set_ylim(0, 1.2)

plt.tight_layout()
plt.show()

print("Glaze chemistry summary:")
print("  Glass former: SiO2 (structure)")
print("  Fluxes: Na2O, K2O, CaO (lower melting point)")
print("  Colorants: transition metal ions (d-orbital absorption)")
print("\\nKey insight: SAME metal, DIFFERENT atmosphere = DIFFERENT color")
print("  Cu in oxidation → blue-green | Cu in reduction → red")
print("  Fe in oxidation → amber/brown | Fe in reduction → green/blue")`,
      challenge: 'Add Al₂O₃ as a third axis on the melting temperature model. Alumina is a "glass modifier" that increases viscosity without lowering melting point much. Plot how adding 5%, 10%, and 15% Al₂O₃ changes the melting temperature contours.',
      successHint: 'Glaze chemistry is applied materials science. Every glaze recipe is a point in a high-dimensional composition space, and finding good glazes is essentially optimization — the same mathematical framework used in machine learning.',
    },
    {
      title: 'Ceramic material science — porosity, density, and mechanical properties',
      concept: `A fired ceramic is not a uniform solid. It is a composite of crystalline phases (mullite needles, residual quartz grains), an amorphous glass phase, and **pores** — tiny voids left where water escaped or gases formed. The relative proportions of these components determine every mechanical property: strength, hardness, thermal conductivity, and durability.

**Porosity** is the fraction of a ceramic body that is empty space. Earthenware fired at 900°C might have 25-30% porosity — it is porous enough to absorb water and is therefore not waterproof without a glaze. Stoneware fired at 1200°C has 2-5% porosity because the glass phase has flowed into and sealed most pores. Porcelain, fired at 1300°C with specific mineral compositions, approaches 0% porosity — fully vitrified and translucent.

The relationship between porosity and strength follows a roughly exponential decay: σ = σ₀ × exp(-bP), where σ₀ is the strength at zero porosity, P is the porosity fraction, and b is a constant around 4-7 for ceramics. This means reducing porosity from 20% to 10% roughly doubles the strength. Each pore acts as a stress concentrator — a tiny internal crack that weakens the material. The densification process during sintering is therefore the key to strong ceramics: achieving high density means closing pores, which requires sufficient temperature, time, and the right flux chemistry to generate enough liquid phase to fill voids.`,
      analogy: 'Think of porosity like Swiss cheese versus cheddar. Swiss cheese (high porosity) has large holes that weaken its structure — press hard and it deforms around the holes. Cheddar (low porosity) is dense and firm. Now imagine loading both with weight: the Swiss cheese fails at every hole because stress concentrates at the curved surfaces of each void. The same physics applies to ceramic pores.',
      storyConnection: 'The potter in the story makes both everyday cooking pots (porous earthenware that "breathes" and keeps water cool through evaporation) and decorative pieces (dense, glazed stoneware that holds liquids). These are not just different products — they are different materials, made from different firing temperatures and clay formulations. The potter chooses porosity deliberately: high for evaporative cooling, low for impermeability.',
      checkQuestion: 'If a ceramic with zero porosity has a compressive strength of 200 MPa and the porosity-strength constant b = 5, what is the strength at 15% porosity and at 30% porosity?',
      checkAnswer: 'At 15% porosity: σ = 200 × exp(-5 × 0.15) = 200 × exp(-0.75) = 200 × 0.472 = 94.5 MPa. At 30% porosity: σ = 200 × exp(-5 × 0.30) = 200 × exp(-1.50) = 200 × 0.223 = 44.6 MPa. Doubling the porosity from 15% to 30% cuts the strength by more than half. This exponential sensitivity is why controlling firing temperature (which controls porosity) is the most critical variable in ceramics.',
      codeIntro: 'Model the relationship between firing conditions, porosity, and mechanical properties of ceramics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Ceramic material properties model

# Sintering model: porosity as function of temperature and time
def porosity_model(T_fire, time_hours, initial_porosity=0.40):
    """Sintering kinetics: porosity decreases with temperature and time."""
    # Arrhenius-type densification rate
    activation_energy = 250e3  # J/mol (typical for silicate sintering)
    R_gas = 8.314
    T_kelvin = T_fire + 273.15
    rate = 5e8 * np.exp(-activation_energy / (R_gas * T_kelvin))
    # First-order kinetics: P(t) = P0 * exp(-rate * t)
    porosity = initial_porosity * np.exp(-rate * time_hours)
    return np.clip(porosity, 0.005, initial_porosity)

# Temperature range
temps = np.linspace(700, 1350, 200)
times = [1, 2, 4, 8, 16]  # hours

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Porosity vs temperature for different hold times
for t in times:
    porosity = np.array([porosity_model(T, t) for T in temps])
    axes[0, 0].plot(temps, porosity * 100, linewidth=2, label=f'{t}h hold')

axes[0, 0].set_xlabel('Firing temperature (°C)', color='white')
axes[0, 0].set_ylabel('Porosity (%)', color='white')
axes[0, 0].set_title('Porosity vs firing conditions', color='white', fontsize=11)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[0, 0].axhspan(0, 5, alpha=0.1, color='#22c55e')
axes[0, 0].annotate('Vitrified', xy=(1300, 2.5), color='#22c55e', fontsize=8)

# 2. Strength vs porosity
porosity_range = np.linspace(0, 0.40, 200)
sigma_0 = 200  # zero-porosity strength (MPa)
b_values = {'Tensile': 6, 'Compressive': 4, 'Flexural': 5}

for name, b in b_values.items():
    strength = sigma_0 * np.exp(-b * porosity_range)
    axes[0, 1].plot(porosity_range * 100, strength, linewidth=2, label=f'{name} (b={b})')

axes[0, 1].set_xlabel('Porosity (%)', color='white')
axes[0, 1].set_ylabel('Strength (MPa)', color='white')
axes[0, 1].set_title('Strength vs porosity', color='white', fontsize=11)
axes[0, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3. Thermal conductivity vs porosity
# Maxwell model: k_eff = k_solid * (1 - 1.5*P) / (1 + 0.5*P) for spherical pores
k_solid = 2.5  # W/m·K for dense ceramic
k_eff = k_solid * (1 - 1.5 * porosity_range) / (1 + 0.5 * porosity_range)
k_eff = np.clip(k_eff, 0.1, k_solid)
axes[0, 2].plot(porosity_range * 100, k_eff, color='#f59e0b', linewidth=2)
axes[0, 2].fill_between(porosity_range * 100, k_eff, alpha=0.2, color='#f59e0b')
axes[0, 2].set_xlabel('Porosity (%)', color='white')
axes[0, 2].set_ylabel('Thermal conductivity (W/m·K)', color='white')
axes[0, 2].set_title('Thermal conductivity vs porosity', color='white', fontsize=11)

# 4. Ceramic types comparison
types = ['Earthenware', 'Terracotta', 'Stoneware', 'Porcelain']
fire_temps = [900, 1000, 1200, 1300]
porosities = [30, 20, 5, 0.5]
strengths_comp = [40, 70, 150, 200]
water_abs = [15, 10, 2, 0]

x = np.arange(len(types))
width = 0.25
axes[1, 0].bar(x - width, porosities, width, color='#3b82f6', label='Porosity (%)')
axes[1, 0].bar(x, water_abs, width, color='#60a5fa', label='Water abs. (%)')
ax2 = axes[1, 0].twinx()
ax2.bar(x + width, strengths_comp, width, color='#ef4444', label='Strength (MPa)')
ax2.tick_params(colors='#ef4444')
ax2.set_ylabel('Strength (MPa)', color='#ef4444')
axes[1, 0].set_xticks(x)
axes[1, 0].set_xticklabels(types, color='white', fontsize=8)
axes[1, 0].set_ylabel('Percentage', color='white')
axes[1, 0].set_title('Ceramic type comparison', color='white', fontsize=11)
lines1, labels1 = axes[1, 0].get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
axes[1, 0].legend(lines1 + lines2, labels1 + labels2, fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5. Density and Archimedes principle measurement
apparent_density = np.linspace(1.2, 2.5, 100)
true_density = 2.6  # g/cm³ for kaolinite-derived ceramic
calculated_porosity = (1 - apparent_density / true_density) * 100
axes[1, 1].plot(apparent_density, calculated_porosity, color='#a78bfa', linewidth=2)
axes[1, 1].set_xlabel('Measured density (g/cm³)', color='white')
axes[1, 1].set_ylabel('Calculated porosity (%)', color='white')
axes[1, 1].set_title('Archimedes method: density → porosity', color='white', fontsize=11)
axes[1, 1].axhline(5, color='#22c55e', linestyle='--', alpha=0.5)
axes[1, 1].annotate('Vitrification threshold', xy=(1.3, 6), color='#22c55e', fontsize=8)

# 6. Shrinkage vs temperature
linear_shrinkage = np.array([porosity_model(T, 4) for T in temps])
shrinkage_pct = (1 - (1 - linear_shrinkage)**(1/3)) * 100  # cubic root for linear from volumetric
axes[1, 2].plot(temps, shrinkage_pct, color='#ec4899', linewidth=2)
axes[1, 2].fill_between(temps, shrinkage_pct, alpha=0.2, color='#ec4899')
axes[1, 2].set_xlabel('Firing temperature (°C)', color='white')
axes[1, 2].set_ylabel('Linear shrinkage (%)', color='white')
axes[1, 2].set_title('Firing shrinkage (4h hold)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Material properties summary:")
for t, ft, p, s in zip(types, fire_temps, porosities, strengths_comp):
    print(f"  {t:15s}: fire at {ft}°C, {p:5.1f}% porosity, {s:4d} MPa strength")
print(f"\\nKey relationship: σ = σ₀ × exp(-bP)")
print(f"  Halving porosity approximately doubles strength.")`,
      challenge: 'Add a cost model: firing at higher temperatures costs more fuel per hour. Calculate the cost-per-MPa-of-strength for each ceramic type. At what point do diminishing returns make higher firing uneconomical?',
      successHint: 'Material selection in engineering always involves tradeoffs. A porous earthenware pot is "worse" than porcelain by strength metrics, but better for evaporative cooling. The best material depends on the application, not just raw numbers.',
    },
    {
      title: 'Comparative ceramics — clay traditions worldwide and material fingerprints',
      concept: `Every pottery tradition in the world uses locally available clay, and the chemical composition of that clay creates a unique **material fingerprint**. Archaeologists use techniques like **X-ray fluorescence** (XRF) and **neutron activation analysis** (NAA) to measure the elemental composition of ancient pottery sherds, then use statistical methods to trace them back to their source clay deposits.

The key insight is that clay deposits in different geological regions have characteristic ratios of trace elements — titanium, zirconium, rare earth elements, chromium, and others. These ratios remain essentially unchanged through firing (trace elements do not evaporate at kiln temperatures), so a pot made from Assamese clay will have a different Ti/Zr ratio than one made from Japanese Karatsu clay or Nigerian Nok terracotta clay.

The statistical method used is **principal component analysis** (PCA) — a technique that reduces high-dimensional chemical data (perhaps 30 elements measured per sample) to 2-3 principal components that capture most of the variation. When plotted in PCA space, samples from the same clay source cluster together, and different sources separate into distinct groups. This is the same mathematics used in face recognition, gene expression analysis, and any problem where you need to find patterns in high-dimensional data.

Beyond fingerprinting, comparative ceramics reveals how ancient trade networks functioned. Finding a pot with Egyptian clay composition in a Mesopotamian city means someone transported that pot (or its clay) across hundreds of kilometers — direct evidence of trade routes that textbooks only infer from written records.`,
      analogy: 'Material fingerprinting is like DNA testing for pottery. Just as every person has unique DNA that identifies them, every clay deposit has a unique elemental signature. And just as forensic scientists use DNA to trace a person to a location, archaeologists use chemical fingerprints to trace a pot to its origin. PCA is the algorithm that reads the "DNA" and groups related samples together.',
      storyConnection: 'The clays used by potters along the Brahmaputra river contain specific ratios of iron and titanium that differ from clays in the Barak Valley or Meghalaya Plateau. If an archaeologist finds ancient pottery in a Southeast Asian site with the Brahmaputra clay signature, it suggests trade connections between Assam and Southeast Asia — physical proof of the cultural links described in the stories of the region.',
      checkQuestion: 'If you measure 25 elements in each of 200 pottery samples from 5 regions, and PCA reduces this to 2 principal components that explain 75% of variance, how many data points does the original dataset have and what information is lost?',
      checkAnswer: 'Original dataset: 200 samples × 25 elements = 5,000 data points. PCA reduces each sample from 25 dimensions to 2, keeping 200 × 2 = 400 values (92% fewer numbers). The lost 25% of variance represents minor variations — measurement noise, secondary mineral differences, or post-depositional alteration. The retained 75% captures the primary geological differences between clay sources.',
      codeIntro: 'Generate synthetic ceramic composition data for multiple regions and use PCA to create a provenance classification system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Synthetic ceramic composition data for 6 pottery traditions
np.random.seed(42)

traditions = {
    'Assam Brahmaputra': {
        'n': 40, 'color': '#ef4444',
        'means': [4.5, 120, 25, 60, 8, 2.1, 15, 0.8],  # Fe%, Ti, Zr, Cr, Rb, La, Ba, Th (ppm)
        'stds':  [0.8, 15, 4, 10, 1.5, 0.3, 3, 0.15]
    },
    'Japanese Karatsu': {
        'n': 35, 'color': '#3b82f6',
        'means': [2.1, 80, 45, 30, 15, 3.5, 40, 1.2],
        'stds':  [0.5, 10, 6, 5, 2, 0.4, 5, 0.2]
    },
    'Nigerian Nok': {
        'n': 30, 'color': '#22c55e',
        'means': [6.2, 180, 35, 90, 5, 1.5, 10, 0.5],
        'stds':  [1.0, 20, 5, 15, 1, 0.2, 2, 0.1]
    },
    'Peruvian Moche': {
        'n': 35, 'color': '#f59e0b',
        'means': [3.8, 95, 55, 45, 12, 4.0, 55, 2.0],
        'stds':  [0.6, 12, 7, 8, 2, 0.5, 7, 0.3]
    },
    'Chinese Jingdezhen': {
        'n': 40, 'color': '#a78bfa',
        'means': [1.5, 60, 30, 20, 20, 5.0, 60, 1.8],
        'stds':  [0.3, 8, 4, 4, 3, 0.6, 8, 0.25]
    },
    'Greek Attic': {
        'n': 30, 'color': '#ec4899',
        'means': [5.0, 140, 40, 70, 10, 2.8, 25, 1.0],
        'stds':  [0.7, 15, 5, 12, 1.5, 0.35, 4, 0.15]
    }
}

elements = ['Fe%', 'Ti', 'Zr', 'Cr', 'Rb', 'La', 'Ba', 'Th']

# Generate data
all_data = []
all_labels = []
all_colors = []
for name, info in traditions.items():
    data = np.random.randn(info['n'], len(elements)) * info['stds'] + info['means']
    all_data.append(data)
    all_labels.extend([name] * info['n'])
    all_colors.extend([info['color']] * info['n'])

X = np.vstack(all_data)

# Standardize (zero mean, unit variance per element)
X_std = (X - X.mean(axis=0)) / X.std(axis=0)

# PCA by hand (eigendecomposition of covariance matrix)
cov_matrix = np.cov(X_std.T)
eigenvalues, eigenvectors = np.linalg.eigh(cov_matrix)
# Sort descending
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx]
eigenvectors = eigenvectors[:, idx]

# Project onto first 2 PCs
pc_scores = X_std @ eigenvectors[:, :2]
var_explained = eigenvalues / eigenvalues.sum() * 100

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# PCA scatter plot
for name, info in traditions.items():
    mask = [l == name for l in all_labels]
    axes[0, 0].scatter(pc_scores[mask, 0], pc_scores[mask, 1],
                        c=info['color'], s=30, alpha=0.7, label=name, edgecolors='white', linewidths=0.3)

axes[0, 0].set_xlabel(f'PC1 ({var_explained[0]:.1f}% variance)', color='white')
axes[0, 0].set_ylabel(f'PC2 ({var_explained[1]:.1f}% variance)', color='white')
axes[0, 0].set_title('PCA: Ceramic provenance fingerprints', color='white', fontsize=11)
axes[0, 0].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='best')

# Scree plot
axes[0, 1].bar(range(len(eigenvalues)), var_explained, color='#60a5fa', alpha=0.8)
axes[0, 1].plot(range(len(eigenvalues)), np.cumsum(var_explained), 'ro-', linewidth=2, markersize=5)
axes[0, 1].axhline(75, color='#22c55e', linestyle='--', alpha=0.5)
axes[0, 1].set_xlabel('Principal Component', color='white')
axes[0, 1].set_ylabel('Variance explained (%)', color='white')
axes[0, 1].set_title('Scree plot', color='white', fontsize=11)

# Loading plot (which elements drive each PC)
loadings = eigenvectors[:, :2]
for i, elem in enumerate(elements):
    axes[1, 0].annotate(elem, xy=(loadings[i, 0], loadings[i, 1]),
                         color='white', fontsize=9, ha='center', fontweight='bold')
    axes[1, 0].arrow(0, 0, loadings[i, 0]*0.9, loadings[i, 1]*0.9,
                      color='#60a5fa', alpha=0.7, head_width=0.03, head_length=0.02)

circle = plt.Circle((0, 0), 1, fill=False, color='gray', linewidth=0.5)
axes[1, 0].add_patch(circle)
axes[1, 0].set_xlim(-1.2, 1.2)
axes[1, 0].set_ylim(-1.2, 1.2)
axes[1, 0].set_xlabel('PC1 loading', color='white')
axes[1, 0].set_ylabel('PC2 loading', color='white')
axes[1, 0].set_title('Element loadings (biplot)', color='white', fontsize=11)
axes[1, 0].set_aspect('equal')

# Classification accuracy: leave-one-out nearest-neighbor
correct = 0
total = len(all_labels)
unique_labels = list(traditions.keys())
for i in range(total):
    distances = np.sqrt(np.sum((pc_scores - pc_scores[i])**2, axis=1))
    distances[i] = np.inf  # exclude self
    nearest = np.argmin(distances)
    if all_labels[nearest] == all_labels[i]:
        correct += 1

accuracy = correct / total * 100

# Confusion-like: pairwise distances between group centroids
centroids = {}
for name in unique_labels:
    mask = [l == name for l in all_labels]
    centroids[name] = pc_scores[mask].mean(axis=0)

dist_matrix = np.zeros((len(unique_labels), len(unique_labels)))
for i, n1 in enumerate(unique_labels):
    for j, n2 in enumerate(unique_labels):
        dist_matrix[i, j] = np.sqrt(np.sum((centroids[n1] - centroids[n2])**2))

im = axes[1, 1].imshow(dist_matrix, cmap='YlOrRd_r')
axes[1, 1].set_xticks(range(len(unique_labels)))
axes[1, 1].set_xticklabels([n.split()[0] for n in unique_labels], color='white', fontsize=7, rotation=45)
axes[1, 1].set_yticks(range(len(unique_labels)))
axes[1, 1].set_yticklabels([n.split()[0] for n in unique_labels], color='white', fontsize=7)
axes[1, 1].set_title(f'Centroid distances (NN accuracy: {accuracy:.0f}%)', color='white', fontsize=11)
plt.colorbar(im, ax=axes[1, 1])

plt.tight_layout()
plt.show()

print(f"PCA Provenance Analysis:")
print(f"  Samples: {total} from {len(unique_labels)} traditions")
print(f"  Elements measured: {len(elements)}")
print(f"  PC1 explains {var_explained[0]:.1f}%, PC2 explains {var_explained[1]:.1f}%")
print(f"  Leave-one-out NN classification accuracy: {accuracy:.1f}%")
print(f"\\\nTop PC1 drivers: {elements[np.argmax(np.abs(loadings[:, 0]))]}, {elements[np.argsort(np.abs(loadings[:, 0]))[-2]]}")
print(f"Top PC2 drivers: {elements[np.argmax(np.abs(loadings[:, 1]))]}, {elements[np.argsort(np.abs(loadings[:, 1]))[-2]]}")`,
      challenge: 'Add 5 "mystery sherds" with compositions intermediate between two traditions. Can the PCA still classify them? What does ambiguity in classification suggest about ancient trade or clay mixing?',
      successHint: 'PCA on ceramic compositions is identical mathematically to PCA on gene expression, stock returns, or image pixels. The technique transcends domains — learn it once for pottery, apply it anywhere.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Clay Chemistry & Ceramic Science
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Minerals, thermodynamics & material properties</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for ceramic science modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
