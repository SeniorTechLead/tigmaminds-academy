import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FirewalkerLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Temperature vs heat — two different things',
      concept: `**Temperature** and **heat** are related but fundamentally different:

- **Temperature** measures the average kinetic energy (speed) of molecules. It's measured in °C, °F, or Kelvin.
- **Heat** (Q) is the total thermal energy transferred between objects. It's measured in Joules (J) or calories.

A swimming pool at 30°C contains far more heat than a cup of tea at 80°C, even though the tea is hotter. Why? Because the pool has trillions more water molecules, each carrying kinetic energy. Total heat = temperature × mass × specific heat capacity.

**Key relationship:**
**Q = m × c × ΔT**
- Q = heat energy (Joules)
- m = mass (kg)
- c = specific heat capacity (J/kg·°C)
- ΔT = temperature change (°C)

**Specific heat capacity** is how much energy it takes to raise 1 kg of a substance by 1°C:
- Water: 4,186 J/kg·°C (very high — water resists temperature change)
- Iron: 449 J/kg·°C
- Wood: ~1,700 J/kg·°C
- Air: 1,005 J/kg·°C

This is why hot coals at 500°C can be walked on briefly — they have low heat capacity. Their temperature is high, but the total heat they can transfer to a foot in a fraction of a second is survivable.`,
      analogy: 'Temperature is like the speed of a car. Heat is like the total momentum of a traffic flow. One Formula 1 car (hot tea) moves very fast but carries little total momentum. A slow-moving freight train (warm pool) carries enormous momentum despite its low speed. You\'d rather be hit by the F1 car than the train.',
      storyConnection: 'The Firewalker\'s Daughter watched her mother stride across glowing coals without flinching. The secret was not bravery alone — it was physics. The coals were at 500°C (extreme temperature) but had low thermal conductivity and low heat capacity. The total heat transferred to her mother\'s feet in each brief step was less than you\'d think from the terrifying glow.',
      checkQuestion: 'You stick your hand in a 200°C oven for 2 seconds and it\'s fine. You dip your hand in 100°C water for 2 seconds and get severe burns. The oven is twice as hot. Why is the water more dangerous?',
      checkAnswer: 'Water has a much higher thermal conductivity (~0.6 W/m·K) than air (~0.025 W/m·K) — about 24× higher. Water is also denser and has a higher heat capacity. So water transfers heat to your skin much faster than air at the same temperature. The rate of heat transfer matters more than the temperature itself for burns.',
      codeIntro: 'Visualize the difference between temperature and total heat content.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Compare heat content of different objects
objects = {
    'Cup of tea': {'mass': 0.25, 'temp': 80, 'c': 4186, 'color': '#ef4444'},
    'Swimming pool': {'mass': 50000, 'temp': 30, 'c': 4186, 'color': '#3b82f6'},
    'Hot coal bed': {'mass': 50, 'temp': 500, 'c': 800, 'color': '#f59e0b'},
    'Iron skillet': {'mass': 3, 'temp': 200, 'c': 449, 'color': '#6b7280'},
    'Human body': {'mass': 70, 'temp': 37, 'c': 3500, 'color': '#22c55e'},
}

names = list(objects.keys())
temps = [o['temp'] for o in objects.values()]
# Heat content relative to 0°C: Q = m * c * T
heat_content = [o['mass'] * o['c'] * o['temp'] for o in objects.values()]
colors = [o['color'] for o in objects.values()]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Temperature comparison
ax1.set_facecolor('#111827')
bars1 = ax1.bar(names, temps, color=colors, edgecolor='none')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('Temperature: How Hot?', color='white', fontsize=13)
ax1.tick_params(colors='gray')
plt.setp(ax1.get_xticklabels(), rotation=20, ha='right', color='white', fontsize=8)
for bar, t in zip(bars1, temps):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
            f'{t}°C', ha='center', color='white', fontsize=9)

# Heat content comparison (log scale because of enormous differences)
ax2.set_facecolor('#111827')
bars2 = ax2.bar(names, [h/1e6 for h in heat_content], color=colors, edgecolor='none')
ax2.set_yscale('log')
ax2.set_ylabel('Heat content (MJ)', color='white')
ax2.set_title('Heat Content: How Much Total Energy?', color='white', fontsize=13)
ax2.tick_params(colors='gray')
plt.setp(ax2.get_xticklabels(), rotation=20, ha='right', color='white', fontsize=8)
for bar, h in zip(bars2, heat_content):
    ax2.text(bar.get_x() + bar.get_width()/2, h/1e6 * 1.5,
            f'{h/1e6:.1f} MJ', ha='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Temperature vs Heat Content:")
for name, obj in objects.items():
    h = obj['mass'] * obj['c'] * obj['temp']
    print(f"  {name:20s}: {obj['temp']:>5}°C, {h/1e6:>12.1f} MJ")
print()
print("The swimming pool (30°C) has ~5,000× more heat than the tea (80°C)!")
print("The coal bed (500°C) has less heat than the pool despite being 16× hotter.")
print("TEMPERATURE ≠ HEAT. Mass and specific heat capacity matter enormously.")`,
      challenge: 'Calculate how much the swimming pool\'s temperature would rise if you dumped all the heat from the coal bed into it. (Hint: Q_coal = m_coal × c_coal × T_coal, then ΔT_pool = Q_coal / (m_pool × c_pool)). The answer will surprise you.',
      successHint: 'Temperature is what you feel. Heat is what actually burns you. The Firewalker\'s Daughter survived because she understood (intuitively) this distinction. The coals were terrifying to look at but manageable to walk on — because temperature is not the whole story.',
    },
    {
      title: 'Conduction, convection, and radiation — three roads for heat',
      concept: `Heat always flows from hot to cold. But it can take three different paths:

**1. Conduction**: heat flows through direct contact between molecules. Touch a hot pan — heat conducts from pan to hand. Metals are good conductors; wood and air are poor conductors (insulators).

**2. Convection**: heat flows via bulk movement of fluid (liquid or gas). Hot air rises, cool air sinks, creating circulation. This is why the upstairs room is always warmer.

**3. Radiation**: heat flows via electromagnetic waves (infrared light). No medium needed — radiation works through vacuum. This is how the Sun heats the Earth across 150 million km of space.

**Real-world examples:**
- **Cooking**: pan conducts to food, oven uses convection (hot air circulation), grill uses radiation (infrared from coals)
- **Firewalking**: coals radiate intensely (glowing red/orange) but conduct poorly (charcoal is a bad thermal conductor). The main danger is radiation to the legs, not conduction through the feet.
- **Thermos flask**: blocks all three — vacuum blocks conduction and convection, reflective walls block radiation

Each mechanism has a different equation and different controlling variables. Understanding which dominates in a situation is the key to thermal engineering.`,
      analogy: 'Three ways to pass a ball: hand-to-hand in a line (conduction — each molecule passes energy to the next), carried by a running player (convection — the fluid itself moves), or thrown through the air (radiation — energy flies through empty space). A firewalker is standing in a game where all three passes are happening simultaneously.',
      storyConnection: 'The Firewalker\'s Daughter studied each mode of heat transfer in the coal pit. The coals radiated orange light (radiation). Hot air shimmered above (convection). Her feet touched ash-covered coals (conduction). She knew that the ash layer was a poor conductor, the brief contact time limited conduction, and the hot air rose away from her body. She managed all three modes at once.',
      checkQuestion: 'On a cold day, a metal bench and a wooden bench are both at 5°C (same temperature). Why does the metal bench feel much colder than the wooden one?',
      checkAnswer: 'Both are at 5°C, but metal conducts heat ~400× faster than wood. When you sit on the metal bench, heat flows rapidly from your body (37°C) into the metal. The wood conducts heat so slowly that your skin stays warm. You\'re not sensing temperature — you\'re sensing the rate of heat conduction away from your body.',
      codeIntro: 'Compare the three heat transfer mechanisms in a firewalking scenario.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Heat transfer rates in firewalking scenario
# Coal temperature: 500°C, Foot temperature: 37°C, ΔT = 463°C

delta_T = 463  # °C
foot_area = 0.015  # m² (bottom of a foot)
step_time = np.linspace(0.01, 2.0, 100)  # seconds

# 1. Conduction: Q = k * A * ΔT * t / d
# Charcoal: k ≈ 0.1 W/m·K, with ash layer d ≈ 0.005 m
k_coal = 0.1  # W/(m·K) — very low!
d_ash = 0.005  # m (ash layer thickness)
Q_conduction = k_coal * foot_area * delta_T * step_time / d_ash

# 2. Convection: Q = h * A * ΔT * t
# h for natural convection ≈ 10-30 W/m²·K
# But convection rises, so for legs above the coals
h_conv = 20  # W/(m²·K)
leg_area = 0.06  # m² (lower legs exposed)
delta_T_air = 200  # air above coals is cooler than coals
Q_convection = h_conv * leg_area * delta_T_air * step_time

# 3. Radiation: Q = ε * σ * A * (T_hot⁴ - T_cold⁴) * t
sigma = 5.67e-8  # Stefan-Boltzmann constant
epsilon = 0.9  # emissivity of coal
T_hot = 500 + 273  # Kelvin
T_cold = 37 + 273
Q_radiation = epsilon * sigma * leg_area * (T_hot**4 - T_cold**4) * step_time

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Heat transfer over time for each mode
ax1.set_facecolor('#111827')
ax1.plot(step_time, Q_conduction, color='#ef4444', linewidth=2, label='Conduction (feet on coals)')
ax1.plot(step_time, Q_convection, color='#f59e0b', linewidth=2, label='Convection (hot air on legs)')
ax1.plot(step_time, Q_radiation, color='#a855f7', linewidth=2, label='Radiation (infrared from coals)')

# Pain/burn threshold
burn_energy = 50  # Joules (approximate energy to cause a mild burn)
ax1.axhline(burn_energy, color='#6b7280', linestyle='--', linewidth=1)
ax1.text(1.8, burn_energy + 5, 'Pain threshold (~50 J)', color='#6b7280', fontsize=9, ha='right')

# Find time to burn for each mode
for Q, label, color in [(Q_conduction, 'Conduction', '#ef4444'),
                          (Q_convection, 'Convection', '#f59e0b'),
                          (Q_radiation, 'Radiation', '#a855f7')]:
    idx = np.argmax(Q > burn_energy)
    if Q[idx] > burn_energy:
        t = step_time[idx]
        ax1.plot(t, burn_energy, 'o', color=color, markersize=8, zorder=5)
        ax1.annotate(f'{t:.2f}s', xy=(t, burn_energy), xytext=(t+0.1, burn_energy+15),
                    color=color, fontsize=9)

ax1.set_xlabel('Contact time (seconds)', color='white')
ax1.set_ylabel('Heat transferred (Joules)', color='white')
ax1.set_title('Heat Transfer Modes in Firewalking', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Material conductivity comparison
ax2.set_facecolor('#111827')
materials = ['Copper', 'Aluminum', 'Steel', 'Stone', 'Wood', 'Charcoal', 'Ash', 'Air']
conductivity = [385, 205, 50, 2.5, 0.15, 0.1, 0.05, 0.025]
mat_colors = ['#f59e0b', '#e5e7eb', '#6b7280', '#a855f7', '#22c55e', '#ef4444', '#9ca3af', '#3b82f6']

bars = ax2.barh(materials, conductivity, color=mat_colors, edgecolor='none')
ax2.set_xscale('log')
ax2.set_xlabel('Thermal conductivity (W/m·K)', color='white')
ax2.set_title('Why Firewalking Works: Conductivity', color='white', fontsize=13)
ax2.tick_params(colors='gray')
plt.setp(ax2.get_yticklabels(), color='white')

for bar, k in zip(bars, conductivity):
    ax2.text(k * 1.5, bar.get_y() + bar.get_height()/2,
            f'{k} W/m·K', va='center', color='white', fontsize=8)

# Highlight charcoal/ash
ax2.axvspan(0.01, 0.2, alpha=0.05, color='#22c55e')
ax2.text(0.08, 7.5, 'Firewalking\\nzone', color='#22c55e', fontsize=9, ha='center')

plt.tight_layout()
plt.show()

print("Why firewalking is survivable:")
print(f"  Charcoal conductivity: {k_coal} W/m·K (3,850× less than copper)")
print(f"  Ash layer adds insulation: k ≈ 0.05 W/m·K")
print(f"  Brief contact (0.3-0.5s per step) limits total heat transfer")
print(f"  Radiation is the bigger danger for longer walks (legs, not feet)")`,
      challenge: 'What if the firewalker walked on a metal plate at 500°C instead of charcoal? Calculate the conduction heat transfer using k_metal = 50 W/m·K. How quickly would they reach the burn threshold? This is why metal burns you instantly.',
      successHint: 'The three modes of heat transfer govern everything from cooking to spacecraft design. Firewalking is a dramatic demonstration that understanding WHICH mode dominates — and controlling it — is the difference between injury and spectacle.',
    },
    {
      title: 'Thermal conductivity — why some materials feel hot and others don\'t',
      concept: `**Thermal conductivity** (k) measures how quickly a material transfers heat. It is the single most important property for understanding why firewalking works.

**k is measured in W/(m·K)** — watts of heat flow per meter of thickness per degree of temperature difference.

**Range of conductivities:**
- Diamond: 2,000 W/m·K (best natural conductor)
- Copper: 385 W/m·K
- Steel: 50 W/m·K
- Water: 0.6 W/m·K
- Wood: 0.15 W/m·K
- Charcoal: 0.1 W/m·K
- Air: 0.025 W/m·K
- Aerogel: 0.015 W/m·K (best insulator)

**The heat conduction equation (Fourier's Law):**
**q = -k × A × (dT/dx)**
- q = heat flow rate (Watts)
- k = thermal conductivity
- A = cross-sectional area
- dT/dx = temperature gradient (°C per meter)

**Why charcoal is a bad conductor:**
Charcoal is mostly carbon with a porous structure — full of tiny air pockets. Air is one of the worst thermal conductors (0.025 W/m·K). So charcoal acts like a rigid foam: solid enough to walk on, but full of insulating air. The ash layer on top adds another low-conductivity barrier.

This is why building insulation (fiberglass, foam, down feathers) all work the same way: trap still air in tiny pockets.`,
      analogy: 'Thermal conductivity is like the width of a highway. A wide highway (high k, like copper) lets many cars (heat) pass through quickly. A narrow dirt road (low k, like charcoal) creates a bottleneck — only a trickle of heat gets through. The temperature difference is the number of cars wanting to travel; the conductivity determines how fast they arrive.',
      storyConnection: 'The Firewalker\'s Daughter knew which materials were safe by touch — not temperature, but how fast they drew heat from her hand. She could hold a glowing coal in a wooden cup but not a metal one. She could walk on a bed of hot charcoal but not a hot stone floor. She was sensing thermal conductivity without knowing the word.',
      checkQuestion: 'Why do wooden spoons not burn your hand when stirring hot soup, but metal spoons do (even when both are in the same soup at the same temperature)?',
      checkAnswer: 'Wood\'s thermal conductivity (~0.15 W/m·K) is about 300× lower than stainless steel (~50 W/m·K). When you grip the spoon handle, heat from the soup travels through the spoon to your hand. In the metal spoon, heat arrives 300× faster. The temperature at the handle is actually lower for the wooden spoon because heat dissipates along the way, but even if both handles were at the same temperature, the metal would still feel hotter because it transfers heat to your skin faster.',
      codeIntro: 'Simulate heat conduction through different materials and visualize temperature profiles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D heat conduction: temperature profile along a rod
# One end at T_hot, other end at room temperature
# Steady-state: T(x) = T_hot - (T_hot - T_cold) * x / L

T_hot = 500  # °C (fire end)
T_cold = 25  # °C (room temperature end)
L = 0.1  # 10 cm length

# Materials and their conductivities
materials = {
    'Copper': {'k': 385, 'color': '#f59e0b'},
    'Steel': {'k': 50, 'color': '#6b7280'},
    'Wood': {'k': 0.15, 'color': '#22c55e'},
    'Charcoal': {'k': 0.1, 'color': '#ef4444'},
}

x = np.linspace(0, L * 100, 100)  # position in cm

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Temperature profiles (steady state with heat loss to environment)
ax1.set_facecolor('#111827')
for name, props in materials.items():
    # With heat loss, temperature drops exponentially
    decay_rate = 0.5 / np.sqrt(props['k'])  # higher k = less decay
    temp = T_cold + (T_hot - T_cold) * np.exp(-decay_rate * x)
    ax1.plot(x, temp, color=props['color'], linewidth=2, label=f'{name} (k={props["k"]})')

ax1.set_xlabel('Distance from fire end (cm)', color='white')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('Temperature Along a Rod: One End in Fire', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.axhline(60, color='#6b7280', linestyle=':', alpha=0.5)
ax1.text(9, 65, 'Pain threshold (60°C)', color='#6b7280', fontsize=8, ha='right')

# Heat flux comparison
ax2.set_facecolor('#111827')
# Heat flux: q = k * ΔT / L (W/m²)
heat_flux = {name: props['k'] * (T_hot - T_cold) / L for name, props in materials.items()}

names = list(heat_flux.keys())
fluxes = list(heat_flux.values())
colors_bar = [materials[n]['color'] for n in names]

bars = ax2.bar(names, [f/1000 for f in fluxes], color=colors_bar, edgecolor='none')
ax2.set_ylabel('Heat flux (kW/m²)', color='white')
ax2.set_title('Heat Flux Through 10cm of Material (500°C → 25°C)', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_yscale('log')
plt.setp(ax2.get_xticklabels(), color='white')

for bar, f in zip(bars, fluxes):
    ax2.text(bar.get_x() + bar.get_width()/2, f/1000 * 1.5,
            f'{f/1000:.0f} kW/m²', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Heat flux through 10cm of material (500°C to 25°C):")
for name, flux in heat_flux.items():
    print(f"  {name:10s}: {flux:>10,.0f} W/m² ({flux/1000:>8,.0f} kW/m²)")
print()
print(f"Copper transfers {heat_flux['Copper']/heat_flux['Charcoal']:.0f}× more heat than charcoal!")
print("This is why you can walk on hot charcoal but not hot copper.")`,
      challenge: 'Design the best insulator: a 3-layer sandwich of materials. Choose from the list and calculate the total heat flux using the series resistance model: R_total = L1/k1 + L2/k2 + L3/k3. What combination minimizes heat transfer?',
      successHint: 'Thermal conductivity is the key to understanding everything from firewalking to home insulation to spacesuit design. Low conductivity = slow heat transfer = survival time. The Firewalker\'s Daughter\'s life depended on this number.',
    },
    {
      title: 'Specific heat capacity — storing thermal energy',
      concept: `**Specific heat capacity** (c) measures how much energy it takes to raise the temperature of 1 kg of a substance by 1°C. It tells you how much thermal energy a material can *store*.

**Q = m × c × ΔT**

**High specific heat** = hard to heat up, hard to cool down (thermal inertia):
- Water: 4,186 J/kg·°C — the highest of common substances
- This is why oceans moderate climate: they absorb enormous amounts of heat in summer and release it slowly in winter

**Low specific heat** = heats up fast, cools down fast:
- Iron: 449 J/kg·°C
- Charcoal: ~800 J/kg·°C
- Copper: 385 J/kg·°C

**For firewalking, both k AND c matter:**
- Low k means heat flows slowly to your foot
- Low c means the surface of the coal loses temperature quickly on contact
- The coal surface actually cools down when your foot touches it (your foot absorbs heat faster than the coal's interior can resupply it)

**The contact cooling effect:** when you step on a 500°C coal, the surface in contact with your foot rapidly cools to maybe 200°C in the first 0.1 seconds. Meanwhile, heat from deeper in the coal hasn't arrived yet. This transient effect is what makes the brief contact survivable.

Water's high specific heat means it stores enormous thermal energy — which is why steam burns are so dangerous (steam releases its stored energy into your skin very efficiently).`,
      analogy: 'Specific heat capacity is like the size of a bucket. A big bucket (water, c = 4,186) holds a lot of "heat water" and takes a long time to fill or empty. A small bucket (iron, c = 449) fills and empties quickly. When a big bucket (ocean) meets a small bucket (air), the big bucket barely notices the exchange while the small bucket changes dramatically.',
      storyConnection: 'The Firewalker\'s Daughter noticed that the glowing coals dimmed slightly where she stepped — they were cooling on contact. The low specific heat of charcoal meant each coal had a limited "reservoir" of heat. Her foot absorbed a small fraction, the surface cooled, and she moved on before the coal\'s interior could reheat the surface.',
      checkQuestion: 'Why does it take much longer to boil a pot of water than to heat the same mass of cooking oil to the same temperature?',
      checkAnswer: 'Water\'s specific heat capacity (4,186 J/kg·°C) is roughly twice that of cooking oil (~2,000 J/kg·°C). So heating water requires about twice as much energy. At the same power input (same stove setting), water takes about twice as long. This is also why water is used in heating systems and car radiators — it stores a lot of heat per kg.',
      codeIntro: 'Compare specific heat capacities and their impact on heating/cooling rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Heating curves: same energy input, different materials
# 100W heat source applied to 1kg of each material

power = 100  # Watts (Joules/second)
mass = 1  # kg
time = np.linspace(0, 300, 300)  # 5 minutes

materials = {
    'Water': {'c': 4186, 'color': '#3b82f6'},
    'Wood': {'c': 1700, 'color': '#22c55e'},
    'Charcoal': {'c': 800, 'color': '#f59e0b'},
    'Iron': {'c': 449, 'color': '#6b7280'},
    'Copper': {'c': 385, 'color': '#ef4444'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Heating curves
ax1.set_facecolor('#111827')
T_start = 25  # °C

for name, props in materials.items():
    # ΔT = P * t / (m * c)
    temp = T_start + power * time / (mass * props['c'])
    ax1.plot(time, temp, color=props['color'], linewidth=2,
            label=f'{name} (c={props["c"]})')

ax1.set_xlabel('Time (seconds)', color='white')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('Heating 1 kg with 100W: Who Gets Hot Fastest?', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Contact cooling simulation
# Coal at 500°C, foot at 37°C, simulate surface temperature
ax2.set_facecolor('#111827')
T_coal = 500
T_foot = 37
contact_time = np.linspace(0, 1, 100)  # 1 second of contact

# Simplified model: surface temp decays exponentially toward a contact temperature
# Contact temp depends on thermal properties of both materials
# T_contact ≈ (T_coal * sqrt(k_coal * c_coal) + T_foot * sqrt(k_foot * c_foot)) /
#              (sqrt(k_coal * c_coal) + sqrt(k_foot * c_foot))
k_coal, c_coal, rho_coal = 0.1, 800, 300  # charcoal
k_foot, c_foot, rho_foot = 0.5, 3500, 1050  # human tissue

effusivity_coal = np.sqrt(k_coal * rho_coal * c_coal)
effusivity_foot = np.sqrt(k_foot * rho_foot * c_foot)
T_contact = (T_coal * effusivity_coal + T_foot * effusivity_foot) / (effusivity_coal + effusivity_foot)

# Surface temperature evolution
coal_surface = T_contact + (T_coal - T_contact) * np.exp(-5 * contact_time)
foot_surface = T_contact + (T_foot - T_contact) * np.exp(-3 * contact_time)

ax2.plot(contact_time * 1000, coal_surface, color='#ef4444', linewidth=2, label='Coal surface')
ax2.plot(contact_time * 1000, foot_surface, color='#22c55e', linewidth=2, label='Foot surface')
ax2.axhline(T_contact, color='#f59e0b', linestyle='--', linewidth=1, label=f'Contact temp ({T_contact:.0f}°C)')
ax2.axhline(60, color='#6b7280', linestyle=':', alpha=0.5)
ax2.text(900, 65, 'Burn threshold', color='#6b7280', fontsize=8)

ax2.set_xlabel('Contact time (ms)', color='white')
ax2.set_ylabel('Temperature (°C)', color='white')
ax2.set_title('What Happens When Foot Meets Coal', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Contact temperature analysis:")
print(f"  Coal effusivity: {effusivity_coal:.0f} J/(m²·K·s½)")
print(f"  Foot effusivity: {effusivity_foot:.0f} J/(m²·K·s½)")
print(f"  Contact temperature: {T_contact:.0f}°C")
print()
print(f"Because foot tissue has HIGHER effusivity than charcoal,")
print(f"the contact temperature is closer to the foot's temperature")
print(f"than the coal's temperature. The coal surface cools rapidly.")
print(f"A step of 0.3-0.5 seconds is survivable at this contact temp.")`,
      challenge: 'What if the coal bed were replaced with hot metal (k=50, c=450, rho=7800)? Calculate the new contact temperature. Why would metal firewalking be lethal?',
      successHint: 'Specific heat capacity and thermal effusivity together determine what happens when two objects at different temperatures touch. The Firewalker\'s Daughter survived because charcoal has low effusivity — it surrenders its surface temperature readily, cooling on contact.',
    },
    {
      title: 'The Leidenfrost effect — the physics of protection',
      concept: `The **Leidenfrost effect** occurs when a liquid contacts a surface much hotter than its boiling point. Instead of boiling immediately, the liquid forms a **vapor layer** that insulates it from the hot surface.

**How it works:**
1. Water droplet contacts a surface at 200°C+
2. The bottom of the droplet instantly vaporizes
3. The steam forms a cushion between the liquid and the surface
4. This vapor layer acts as an insulator (steam conducts heat poorly)
5. The droplet levitates on its own steam, dancing across the surface

**The Leidenfrost temperature** (for water on metal) is ~200°C. Below this, water boils violently (nucleate boiling — dangerous). Above this, the vapor layer forms (Leidenfrost — counterintuitively safer).

**Relevance to firewalking:**
- Feet naturally perspire, especially when nervous
- When a moist foot contacts a 500°C coal, the moisture may form a brief Leidenfrost layer
- This vapor layer provides an additional (thin) insulation barrier
- However: this effect is minor compared to charcoal's low conductivity — it's a contributing factor, not the main explanation

**Other applications:**
- Liquid nitrogen hand dip (brief contact — Leidenfrost protects)
- Molten lead finger dip (wet finger, very brief)
- Industrial spray cooling (precisely controlled heat removal)`,
      analogy: 'The Leidenfrost effect is like an air hockey puck. The puck floats on a cushion of air blown from tiny holes in the table. The water droplet floats on a cushion of its own steam. In both cases, the air/steam layer prevents direct contact with the surface below.',
      storyConnection: 'The Firewalker\'s Daughter noticed that her steps left tiny wisps of steam on the coals. Her feet were damp from nervousness and from the wet grass she walked through beforehand. The moisture was her secret shield — not thick enough to fully explain her survival, but enough to add a crucial extra fraction of a second of protection.',
      checkQuestion: 'If you put water on a pan at 150°C, it boils violently and evaporates in seconds. If you put water on a pan at 300°C, the droplet dances and lasts much longer. Higher temperature = slower evaporation. How is this possible?',
      checkAnswer: 'At 150°C, water is in the "nucleate boiling" regime — it contacts the surface directly and absorbs heat very efficiently, evaporating quickly. At 300°C (above the Leidenfrost point), a vapor layer forms that insulates the droplet from the surface. Heat transfer through steam is much slower than through direct contact. The droplet evaporates slower because the insulation is better. This is the counterintuitive core of the Leidenfrost effect.',
      codeIntro: 'Visualize the Leidenfrost effect: evaporation rate vs. surface temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Leidenfrost curve: droplet lifetime vs surface temperature
surface_temp = np.linspace(100, 400, 200)

# Three regimes:
# 1. Film boiling (>100°C, <120°C): slow evaporation
# 2. Nucleate boiling (120-200°C): fast evaporation (dangerous)
# 3. Leidenfrost (>200°C): slow evaporation again (vapor cushion)

def evaporation_time(T):
    """Simplified model of water droplet lifetime vs surface temp"""
    if T < 100:
        return 100  # no evaporation
    elif T < 120:
        return 80 * np.exp(-0.05 * (T - 100))  # gentle evaporation
    elif T < 200:
        return 5 + 20 * np.exp(-0.03 * (T - 120))  # nucleate boiling (fast)
    else:
        # Leidenfrost regime: lifetime increases with temperature
        return 10 + 40 * (1 - np.exp(-0.01 * (T - 200)))

lifetimes = np.array([evaporation_time(T) for T in surface_temp])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Droplet lifetime curve
ax1.set_facecolor('#111827')
# Color by regime
for i in range(len(surface_temp)-1):
    T = surface_temp[i]
    if T < 120:
        c = '#3b82f6'
    elif T < 200:
        c = '#ef4444'
    else:
        c = '#22c55e'
    ax1.plot(surface_temp[i:i+2], lifetimes[i:i+2], color=c, linewidth=3)

# Label regions
ax1.axvspan(100, 120, alpha=0.05, color='#3b82f6')
ax1.axvspan(120, 200, alpha=0.05, color='#ef4444')
ax1.axvspan(200, 400, alpha=0.05, color='#22c55e')

ax1.text(110, 65, 'Film\nevaporation', color='#3b82f6', fontsize=9, ha='center')
ax1.text(160, 40, 'Nucleate\nboiling\n(DANGER)', color='#ef4444', fontsize=9, ha='center')
ax1.text(300, 45, 'Leidenfrost\neffect\n(vapor cushion)', color='#22c55e', fontsize=9, ha='center')

# Mark Leidenfrost point
ax1.axvline(200, color='#f59e0b', linestyle='--', linewidth=1)
ax1.text(205, 75, 'Leidenfrost\npoint (200°C)', color='#f59e0b', fontsize=9)

ax1.set_xlabel('Surface temperature (°C)', color='white')
ax1.set_ylabel('Droplet lifetime (seconds)', color='white')
ax1.set_title('The Leidenfrost Curve: Hotter Can Be Safer', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Heat transfer rate vs temperature
ax2.set_facecolor('#111827')

# Heat flux is inversely related to droplet lifetime (faster evap = more heat transfer)
heat_flux = 100 / lifetimes  # arbitrary units

for i in range(len(surface_temp)-1):
    T = surface_temp[i]
    if T < 120:
        c = '#3b82f6'
    elif T < 200:
        c = '#ef4444'
    else:
        c = '#22c55e'
    ax2.plot(surface_temp[i:i+2], heat_flux[i:i+2], color=c, linewidth=3)

ax2.axvline(200, color='#f59e0b', linestyle='--', linewidth=1)

# Peak heat transfer point
peak_idx = np.argmax(heat_flux)
ax2.plot(surface_temp[peak_idx], heat_flux[peak_idx], '*', color='#f59e0b', markersize=15)
ax2.annotate(f'Maximum heat transfer\n({surface_temp[peak_idx]:.0f}°C)',
            xy=(surface_temp[peak_idx], heat_flux[peak_idx]),
            xytext=(surface_temp[peak_idx]+50, heat_flux[peak_idx]-2),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax2.set_xlabel('Surface temperature (°C)', color='white')
ax2.set_ylabel('Heat transfer rate (relative)', color='white')
ax2.set_title('Heat Transfer Rate: Peak at Nucleate Boiling', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The Leidenfrost paradox:")
print("  At 150°C: droplet dies in ~8 seconds (nucleate boiling)")
print("  At 300°C: droplet survives ~35 seconds (Leidenfrost)")
print("  HOTTER surface = SLOWER evaporation (above Leidenfrost point)")
print()
print("For firewalking:")
print("  Coal surface: ~500°C (well above Leidenfrost point)")
print("  Any moisture on feet forms a brief vapor cushion")
print("  Main protection: low charcoal conductivity")
print("  Secondary protection: Leidenfrost vapor layer")`,
      challenge: 'The Leidenfrost effect is used in liquid nitrogen demonstrations. Liquid nitrogen boils at -196°C. If your hand is at 37°C, that\'s a ΔT of 233°C. Is this above the Leidenfrost point for nitrogen on skin? (Hint: the Leidenfrost ΔT for nitrogen is about 50°C.) Why is a brief hand dip in liquid nitrogen safe?',
      successHint: 'The Leidenfrost effect is one of the most counterintuitive phenomena in physics: being hotter can be safer. It contributes to firewalking, protects cooks from splattering oil, and makes liquid nitrogen demonstrations possible. Understanding it means understanding the strange boundary between states of matter.',
    },
    {
      title: 'Thermal protection — engineering for extreme heat',
      concept: `Humans engineer thermal protection for everything from oven mitts to space shuttle tiles. The principles are the same as firewalking — just applied at different scales.

**Thermal protection strategies:**

1. **Insulation** (reduce conduction): use materials with low thermal conductivity
   - Fiberglass: k = 0.04 W/m·K
   - Aerogel: k = 0.015 W/m·K (the best insulator known)
   - Vacuum: k ≈ 0 (no conduction at all — the thermos principle)

2. **Reflection** (reduce radiation): use shiny, reflective surfaces
   - Aluminum foil: reflects 97% of infrared radiation
   - Gold-coated spacecraft visors
   - Emergency "space blankets"

3. **Ablation** (sacrifice material): a protective layer slowly burns away, carrying heat with it
   - Heat shields on spacecraft: ablative material chars and vaporizes, removing heat
   - Firewalking analogy: the ash layer ablates slightly on contact

4. **Active cooling** (remove heat): pump coolant through the material
   - Car radiators, CPU coolers, industrial furnaces
   - Space station thermal control: liquid ammonia loops

5. **Phase change** (absorb heat via melting/evaporating): materials absorb enormous energy when changing state
   - Ice absorbs 334 kJ/kg when melting (without temperature change!)
   - Phase-change materials (PCMs) in building walls regulate temperature

**The space shuttle used ALL of these**: ceramic tiles (insulation), reflective coatings (radiation), reinforced carbon-carbon on the nose (ablation), and active cooling in the engines.`,
      analogy: 'Thermal protection is like defending a castle from attack. Insulation is the thick stone walls. Reflection is the moat that bounces attackers back. Ablation is the outer wall that crumbles to absorb impact. Active cooling is archers on the walls fighting back. Phase change is a secret weapon that absorbs energy and neutralizes it.',
      storyConnection: 'The Firewalker\'s Daughter practiced her own thermal protection: she dampened her feet (phase change protection), walked on ash-covered coals (insulation), moved quickly (limiting exposure time), and chose charcoal over other fuels (low conductivity). Every firewalker unknowingly applies multiple thermal protection strategies simultaneously.',
      checkQuestion: 'Why do firefighters\' suits use multiple layers of different materials instead of one thick layer of the best insulator?',
      checkAnswer: 'Each layer addresses a different heat transfer mode: (1) outer layer reflects radiation (aluminized coating), (2) middle layer insulates against conduction (thermal batting), (3) inner moisture barrier prevents steam burns (phase change), (4) air gaps between layers add convection barriers. One thick insulator might block conduction but not radiation. The multi-layer approach creates defense-in-depth against all three heat transfer modes.',
      codeIntro: 'Model the effectiveness of different thermal protection strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Compare thermal protection strategies
# Scenario: 1000°C fire, protect a person (37°C skin) for 60 seconds

T_fire = 1000  # °C
T_skin = 37  # °C
target_flux = 2.5  # kW/m² (maximum tolerable heat flux on skin)

# Bare skin: no protection
time = np.linspace(0, 60, 200)

# Heat flux to skin under different protection
protections = {
    'No protection': {'flux': 15.0, 'color': '#ef4444', 'desc': 'Direct exposure'},
    'Cotton clothing': {'flux': 8.0, 'color': '#f59e0b', 'desc': 'k=0.04, thin'},
    'Fiberglass insulation': {'flux': 2.0, 'color': '#3b82f6', 'desc': 'k=0.04, thick'},
    'Reflective + insulation': {'flux': 0.8, 'color': '#22c55e', 'desc': 'Reflects 90% + insulates'},
    'Ablative shield': {'flux': 0.3, 'color': '#a855f7', 'desc': 'Surface ablates, carries heat away'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Heat flux comparison
ax1.set_facecolor('#111827')
names = list(protections.keys())
fluxes = [p['flux'] for p in protections.values()]
colors_p = [p['color'] for p in protections.values()]

bars = ax1.bar(names, fluxes, color=colors_p, edgecolor='none')
ax1.axhline(target_flux, color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Safe limit ({target_flux} kW/m²)')
ax1.set_ylabel('Heat flux to skin (kW/m²)', color='white')
ax1.set_title('Heat Flux Under Different Protection (1000°C fire)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')
plt.setp(ax1.get_xticklabels(), rotation=20, ha='right', color='white', fontsize=8)

for bar, f, safe in zip(bars, fluxes, [f <= target_flux for f in fluxes]):
    symbol = 'SAFE' if safe else 'BURN'
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
            f'{f} kW/m²\n({symbol})', ha='center', color='white', fontsize=8)

# Temperature evolution through a multi-layer protection system
ax2.set_facecolor('#111827')

# 3-layer system: reflective outer + insulation + air gap
layers = [
    ('Reflective coating', 0.001, 200, '#f59e0b'),     # thin, high-k but reflects
    ('Insulation', 0.02, 0.04, '#3b82f6'),              # thick, low-k
    ('Air gap', 0.005, 0.025, '#22c55e'),                # thin, very low-k
]

# Temperature drops across each layer
T_current = T_fire * 0.1  # 90% reflected, so effective T = 100°C after reflection
positions = [0]
temperatures = [T_current]
total_pos = 0

for name, thickness, k, color in layers:
    total_pos += thickness
    # Steady-state: ΔT = q * L / k (at q = 2.5 kW/m²)
    q = 2500  # W/m²
    delta_T = q * thickness / k
    T_current -= delta_T
    T_current = max(T_current, T_skin)
    positions.append(total_pos * 1000)  # convert to mm
    temperatures.append(T_current)

# Plot temperature profile
ax2.plot(positions, temperatures, 'o-', color='white', linewidth=2, markersize=8)

# Color each layer
prev_pos = 0
for (name, thickness, k, color) in layers:
    pos = prev_pos + thickness * 1000
    ax2.axvspan(prev_pos, pos, alpha=0.15, color=color)
    ax2.text((prev_pos + pos)/2, max(temperatures)*0.8, name,
            color=color, fontsize=8, ha='center', rotation=90)
    prev_pos = pos

ax2.axhline(60, color='#ef4444', linestyle=':', alpha=0.5)
ax2.text(max(positions)*0.9, 65, 'Pain threshold', color='#ef4444', fontsize=8, ha='right')

ax2.set_xlabel('Distance through protection (mm)', color='white')
ax2.set_ylabel('Temperature (°C)', color='white')
ax2.set_title('Temperature Drop Through 3-Layer Protection', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Multi-layer protection system:")
print(f"  Fire temperature: {T_fire}°C")
print(f"  After reflection: {T_fire * 0.1:.0f}°C (90% reflected)")
for i, (name, thickness, k, _) in enumerate(layers):
    print(f"  After {name}: {temperatures[i+1]:.0f}°C (k={k}, L={thickness*1000:.0f}mm)")
print(f"  Skin temperature: {temperatures[-1]:.0f}°C ({'SAFE' if temperatures[-1] < 60 else 'BURN'})")
print()
print("From firewalking to firefighting to spaceflight,")
print("thermal protection uses the same physics at different scales.")`,
      challenge: 'Design thermal protection for a spacecraft re-entering Earth\'s atmosphere at 1,650°C. You have: ceramic tiles (k=0.06, max thickness 10cm), ablative coating (removes 5kW/m² by ablation), and radiative cooling (emits heat as infrared). What combination keeps the spacecraft skin below 150°C?',
      successHint: 'From temperature vs. heat to conduction/convection/radiation to thermal conductivity to specific heat to the Leidenfrost effect to engineered thermal protection — you now understand the full physics of heat transfer. The Firewalker\'s Daughter walked on coals using intuition; you can now explain exactly why it works, design protection systems, and predict outcomes. Level 2 takes this into thermodynamics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior physics experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for thermal physics simulations. Click to start.</p>
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
