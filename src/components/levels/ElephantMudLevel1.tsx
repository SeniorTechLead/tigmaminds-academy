import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ElephantMudLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Body temperature — the fire inside every animal',
      concept: `Every living animal generates heat through metabolism. The challenge is keeping internal temperature in the right range. For Asian elephants, that is about **35.5-36.5°C** — slightly lower than humans.

**Endotherms vs ectotherms:**
- **Endotherms** (mammals, birds): generate internal heat, maintain constant body temperature
- **Ectotherms** (reptiles, amphibians, insects): body temperature follows the environment

**Why temperature matters:**
- Enzymes work best at specific temperatures
- Too hot (>42°C for most mammals): proteins denature (unfold), cells die
- Too cold (<30°C): metabolism slows dangerously, organs fail
- The range is narrow: a 7°C swing from normal is lethal

**The baby elephant's first mud bath:**
A newborn Asian elephant calf weighs ~100 kg and has a high metabolic rate (growing fast). But it can't sweat, has very little hair, and has thin skin. In the Assamese heat (35-40°C), overheating is a real danger. The first mud bath isn't play — it's survival.`,
      analogy: 'Body temperature regulation is like a thermostat in a house. The thermostat (hypothalamus in the brain) has a set point (36°C). If it\'s too hot, the AC kicks on (sweating, panting, vasodilation). If it\'s too cold, the heater turns on (shivering, vasoconstriction, fat burning). The elephant\'s problem: it lives in a hot house with a massive furnace (metabolism) and a broken AC (can\'t sweat much).',
      storyConnection: 'The little elephant in the story splashes into mud for the first time — and discovers a wonderful cool feeling. That coolness isn\'t just comfort; it\'s the elephant\'s primary cooling mechanism. In Kaziranga\'s summer, when temperatures soar above 35°C, mud bathing isn\'t optional for elephants — it\'s as essential as drinking water.',
      checkQuestion: 'An elephant\'s body temperature is 36°C and the air is 40°C. Heat flows from hot to cold. So how does the elephant stay cooler than the air?',
      checkAnswer: 'It can\'t! When air temperature exceeds body temperature, the elephant GAINS heat from the environment. It must actively remove heat through evaporative cooling (water/mud evaporating from skin absorbs heat) and radiative cooling (emitting infrared radiation, especially at night when the sky is cooler). Without mud or water, an elephant in 40°C heat would overheat within hours.',
      codeIntro: 'Model body temperature regulation in elephants.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate 24-hour body temperature in an elephant
hours = np.linspace(0, 24, 1440)  # minute resolution

# Environmental temperature (Kaziranga, hot summer day)
env_temp = 28 + 10 * np.sin(np.pi * (hours - 6) / 12)  # peaks at noon
env_temp = np.clip(env_temp, 22, 40)

# Metabolic heat production (higher during activity)
basal_metabolism = 36.0  # °C contribution
activity = np.where((hours > 6) & (hours < 18), 0.3, 0.1)  # more active daytime
metabolic_heat = basal_metabolism + activity

# Cooling mechanisms
body_temp = np.zeros_like(hours)
body_temp[0] = 36.0
mud_bathing = False
mud_times = []

for i in range(1, len(hours)):
    dt = hours[i] - hours[i-1]

    # Heat gain from environment (when env > body)
    heat_gain = 0.05 * (env_temp[i] - body_temp[i-1]) * dt

    # Metabolic heat
    heat_gain += 0.02 * activity[i] * dt

    # Cooling: vasodilation in ears (elephant's radiator)
    ear_cooling = 0.03 * max(0, body_temp[i-1] - 35.5) * dt

    # Mud bath cooling (if body temp gets too high)
    mud_cooling = 0
    if body_temp[i-1] > 37.0 and 8 < hours[i] < 17:
        mud_cooling = 0.15 * dt  # significant cooling
        if not mud_bathing:
            mud_bathing = True
            mud_times.append(hours[i])
    elif body_temp[i-1] < 36.5:
        mud_bathing = False

    body_temp[i] = body_temp[i-1] + heat_gain - ear_cooling - mud_cooling
    body_temp[i] = np.clip(body_temp[i], 34, 42)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Temperature plot
ax1.set_facecolor('#111827')
ax1.plot(hours, env_temp, color='#ef4444', linewidth=2, label='Air temperature')
ax1.plot(hours, body_temp, color='#22c55e', linewidth=2, label='Body temperature')
ax1.axhline(36.0, color='gray', linestyle=':', alpha=0.3, label='Normal (36°C)')
ax1.axhline(37.5, color='#f59e0b', linestyle='--', alpha=0.5, label='Danger zone (>37.5°C)')

for mt in mud_times:
    ax1.axvline(mt, color='#3b82f6', alpha=0.3, linewidth=5)
if mud_times:
    ax1.axvline(mud_times[0], color='#3b82f6', alpha=0.3, linewidth=5, label='Mud bath')

ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('Elephant Body Temperature Over 24 Hours', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Cooling mechanisms
ax2.set_facecolor('#111827')
ax2.fill_between(hours, activity * 100, color='#f59e0b', alpha=0.3, label='Activity level')
ax2.plot(hours, env_temp - body_temp, color='#ef4444', linewidth=1, label='Heat flux (env - body)')
ax2.axhline(0, color='gray', linestyle=':', alpha=0.3)
ax2.set_xlabel('Hour of day', color='white')
ax2.set_ylabel('°C difference / Activity %', color='white')
ax2.set_title('Heat Balance', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("24-hour thermal summary:")
print(f"  Min body temp: {min(body_temp):.1f}°C (nighttime)")
print(f"  Max body temp: {max(body_temp):.1f}°C (midday)")
print(f"  Mud baths triggered: {len(mud_times)} times")
print(f"  When air > body temp: elephant gains heat from environment")
print(f"  Key cooling: ear vasodilation + mud bathing + behavioral shade-seeking")`,
      challenge: 'Remove the mud bathing (set mud_cooling = 0). How high does the body temperature go? At what air temperature does the elephant reach the lethal 42°C threshold?',
      successHint: 'Body temperature regulation is a constant battle for large animals in hot climates. Understanding it explains why elephants need water access, why they have big ears, and why climate change threatens them — rising temperatures mean more energy spent cooling and less time foraging.',
    },
    {
      title: 'Heat transfer — conduction, convection, and radiation',
      concept: `Heat moves from hot to cold through three mechanisms. Elephants use ALL three to cool down.

**Conduction**: heat transfer through direct contact
- Elephant stands in cool river → heat flows from hot body to cool water
- Mud on skin → heat conducts from body through mud to air
- Rate depends on: temperature difference, contact area, material conductivity

**Convection**: heat transfer through moving fluid (air or water)
- Wind blowing across elephant skin carries away warm air molecules
- Blood flowing to ear surfaces carries heat from core to surface
- Rate depends on: fluid speed, temperature difference, surface area

**Radiation**: heat transfer through electromagnetic waves (infrared)
- Every object above absolute zero radiates heat
- Elephants radiate infrared from their skin (visible in thermal cameras)
- At night, elephants radiate heat to the cold sky very effectively
- Rate depends on: surface temperature⁴, surface area, emissivity

**The mud bath combines ALL three:**
1. Conduction: body heat flows into cool mud
2. Convection: air moving over wet mud surface carries heat away
3. Evaporation: water in mud evaporating absorbs enormous heat (latent heat of vaporization = 2260 kJ/kg!)`,
      analogy: 'Heat transfer modes are like three ways to cool a hot pan. Conduction: set the pan on a cold surface (direct contact). Convection: blow on it with a fan (moving air). Radiation: hold it up to a cold window (infrared radiation to cold surface). Evaporation (a bonus): splash water on it (the water absorbs heat as it evaporates). The elephant uses all four, and mud bathing is the most efficient combination.',
      storyConnection: 'When the baby elephant in the story first rolls in mud, it discovers all three cooling mechanisms at once. The cool mud conducts heat away (conduction). As the elephant walks, air flowing over the mud layer cools it further (convection). And as the mud dries, water evaporates and carries away enormous amounts of heat (evaporation). One mud bath = a complete thermal engineering solution.',
      checkQuestion: 'Why is getting out of a swimming pool on a windy day so cold, even when the air is warm?',
      checkAnswer: 'Evaporative cooling. Water on your skin absorbs heat as it evaporates (2260 J per gram). Wind speeds up evaporation (forced convection). Even at 30°C air temperature, rapid evaporation can cool your skin to 25°C or below. This is exactly why elephants coat themselves in mud — the wet surface maximizes evaporative cooling. And this is why you feel cold until you dry off.',
      codeIntro: 'Compare the three heat transfer mechanisms quantitatively.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Compare heat transfer modes for an elephant
fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Elephant parameters
body_temp = 36  # °C
mass = 4000  # kg
skin_area = 20  # m² (approximate for adult elephant)
specific_heat = 3500  # J/kg/°C (approximate)

# 1. Conduction: standing in water vs mud vs air
ax = axes[0, 0]
ax.set_facecolor('#111827')
medium_temps = np.linspace(15, 35, 100)
k_water = 0.6  # W/m/K
k_mud = 0.8  # W/m/K
k_air = 0.025  # W/m/K
thickness = 0.01  # m (contact layer)
contact_area = 5  # m² (legs + belly in water/mud)

Q_water = k_water * contact_area * (body_temp - medium_temps) / thickness
Q_mud = k_mud * contact_area * (body_temp - medium_temps) / thickness
Q_air = k_air * skin_area * (body_temp - medium_temps) / thickness

ax.plot(medium_temps, Q_water, color='#3b82f6', linewidth=2, label='Standing in water')
ax.plot(medium_temps, Q_mud, color='#f59e0b', linewidth=2, label='Standing in mud')
ax.plot(medium_temps, Q_air, color='#ef4444', linewidth=2, label='Air only')
ax.set_xlabel('Medium temperature (°C)', color='white')
ax.set_ylabel('Heat loss rate (W)', color='white')
ax.set_title('Conduction: Water > Mud > Air', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 2. Convection: wind speed effect
ax = axes[0, 1]
ax.set_facecolor('#111827')
wind_speeds = np.linspace(0, 10, 100)  # m/s
h_conv = 10 * np.sqrt(wind_speeds + 0.1)  # convection coefficient (simplified)
Q_conv_dry = h_conv * skin_area * (body_temp - 30)
Q_conv_wet = h_conv * skin_area * (body_temp - 30) * 2.5  # wet skin: enhanced

ax.plot(wind_speeds, Q_conv_dry, color='#ef4444', linewidth=2, label='Dry skin')
ax.plot(wind_speeds, Q_conv_wet, color='#3b82f6', linewidth=2, label='Mud-covered skin')
ax.set_xlabel('Wind speed (m/s)', color='white')
ax.set_ylabel('Convective heat loss (W)', color='white')
ax.set_title('Convection: Wind + Wet Skin', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Radiation: elephant ear heat dissipation
ax = axes[1, 0]
ax.set_facecolor('#111827')
sigma = 5.67e-8  # Stefan-Boltzmann constant
emissivity = 0.95
ear_area = 2 * 1.5  # m² (two large ears)
body_area = 18  # m² rest of body

ear_temps = np.linspace(30, 40, 100) + 273.15  # K
env_temp_K = 300  # K (27°C)

# Radiative heat loss from ears
Q_ears = emissivity * sigma * ear_area * (ear_temps**4 - env_temp_K**4)
Q_body = emissivity * sigma * body_area * ((body_temp + 273.15)**4 - env_temp_K**4)

ax.plot(ear_temps - 273.15, Q_ears, color='#ef4444', linewidth=2, label='From ears')
ax.axhline(Q_body, color='#3b82f6', linestyle='--', linewidth=2, label=f'From body ({Q_body:.0f}W)')
ax.set_xlabel('Ear surface temperature (°C)', color='white')
ax.set_ylabel('Radiative heat loss (W)', color='white')
ax.set_title('Radiation: Ears Are Radiators', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Evaporative cooling comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Latent heat of vaporization of water: 2260 kJ/kg
latent_heat = 2260e3  # J/kg

# How much water needs to evaporate to cool elephant by 1°C?
temp_drop = np.linspace(0, 5, 100)
heat_to_remove = mass * specific_heat * temp_drop  # J
water_needed = heat_to_remove / latent_heat  # kg

ax.plot(temp_drop, water_needed, color='#3b82f6', linewidth=2)
ax.set_xlabel('Temperature reduction (°C)', color='white')
ax.set_ylabel('Water needed to evaporate (kg)', color='white')
ax.set_title('Evaporative Cooling Power', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Annotate
for dt, label in [(1, '1°C: bathtub splash'), (3, '3°C: serious mud bath')]:
    w = mass * specific_heat * dt / latent_heat
    ax.annotate(f'{label}\\n({w:.0f} kg water)', xy=(dt, w), xytext=(dt+0.5, w+2),
                color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Heat transfer comparison for a 4000 kg elephant at 36°C:")
print(f"  Conduction (standing in 25°C water): ~{k_water * 5 * (36-25) / 0.01:.0f} W")
print(f"  Convection (5 m/s wind, wet): ~{10*np.sqrt(5)*20*(36-30)*2.5:.0f} W")
print(f"  Radiation (total): ~{Q_body:.0f} W")
print(f"  Evaporation (1 kg/hr): ~{latent_heat/3600:.0f} W")
print()
print("Evaporation is the MOST powerful cooling mechanism.")
print(f"To cool 1°C: evaporate {mass*specific_heat/latent_heat:.0f} kg of water.")`,
      challenge: 'Calculate how long a mud bath lasts in cooling effect. If 5 kg of water is in the mud coating and it evaporates over 3 hours, what is the average cooling power? Compare this to the heat gain from a 38°C day.',
      successHint: 'The three modes of heat transfer govern everything from elephant thermoregulation to building insulation to spacecraft design. Understanding them quantitatively lets you engineer cooling solutions for any system — biological or mechanical.',
    },
    {
      title: 'Surface area to volume — why big animals overheat',
      concept: `The elephant's cooling problem comes from a fundamental geometric relationship: as animals get bigger, their **volume grows faster than their surface area**.

**The math:**
- For a sphere of radius r: Surface area = 4πr², Volume = 4/3πr³
- SA/V ratio = 3/r
- As r increases, SA/V DECREASES

**Why this matters for thermoregulation:**
- Heat is generated in the VOLUME (every cell produces heat)
- Heat is lost through the SURFACE (skin)
- Big animals: lots of heat, relatively little surface → hard to cool
- Small animals: less heat, relatively more surface → lose heat easily

**Real numbers:**
- Mouse (20g): SA/V ≈ 100 cm²/cm³ → loses heat rapidly, must eat constantly
- Human (70kg): SA/V ≈ 1.8 cm²/cm³ → balanced
- Elephant (4000kg): SA/V ≈ 0.5 cm²/cm³ → generates heat faster than it can lose it

**Elephant adaptations to the SA/V problem:**
1. **Large ears**: increase surface area by ~20% (Asian elephant ears are smaller than African because Asia is less hot)
2. **Wrinkled skin**: increases surface area by ~10-20%
3. **Mud bathing**: adds evaporative surface
4. **Low metabolic rate per kg**: generates less heat per unit volume than expected`,
      analogy: 'Surface area to volume is like comparing a cube of ice to crushed ice. Same volume of ice, but the crushed ice melts WAY faster because it has more surface area exposed to warm air. An elephant is the cube — massive volume, relatively little surface. A mouse is the crushed ice — tiny volume, lots of relative surface. The elephant must find creative ways to "crush" its surface area outward (big ears, wrinkles).',
      storyConnection: 'The baby elephant in the story is smaller than an adult — meaning it has a HIGHER SA/V ratio. Paradoxically, this makes the baby better at losing heat than the adults. But the baby also has thinner skin and less body fat for insulation. The first mud bath helps with both problems: cooling on hot days, and the dried mud layer provides a thin insulation and sun protection.',
      checkQuestion: 'Elephants have large ears. Hares have large ears. Both use ears for cooling. Why don\'t ALL mammals have large ears?',
      checkAnswer: 'Because large ears are a trade-off. In hot climates, big ears help (more cooling surface). In cold climates, big ears are a LIABILITY (more heat lost). This is Allen\'s rule: animals in colder climates have smaller extremities (ears, limbs, tails) than related species in warmer climates. Arctic hares have tiny ears; desert jackrabbits have huge ones. It is the SA/V principle applied to body parts.',
      codeIntro: 'Explore the surface-area-to-volume relationship and its biological consequences.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. SA/V ratio for spheres of different sizes
ax = axes[0, 0]
ax.set_facecolor('#111827')
radii = np.linspace(0.01, 2, 200)
sa = 4 * np.pi * radii**2
vol = 4/3 * np.pi * radii**3
sa_v = sa / vol

ax.plot(radii * 100, sa_v, color='#22c55e', linewidth=2)
ax.set_xlabel('Radius (cm)', color='white')
ax.set_ylabel('SA/V ratio (cm\⁻\¹)', color='white')
ax.set_title('Surface Area to Volume Ratio', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Mark animals
animals_sav = [
    ('Mouse', 1.5, 100, '#ef4444'),
    ('Cat', 10, 15, '#f59e0b'),
    ('Human', 50, 1.8, '#3b82f6'),
    ('Elephant', 120, 0.5, '#8b5cf6'),
]
for name, r, sv, color in animals_sav:
    ax.scatter(r, sv, s=80, color=color, zorder=5, edgecolors='white')
    ax.annotate(name, xy=(r, sv), xytext=(5, 5), textcoords='offset points',
                color=color, fontsize=9)

# 2. Heat generation vs heat loss scaling
ax = axes[0, 1]
ax.set_facecolor('#111827')
masses = np.logspace(-2, 4, 100)  # 0.01 kg to 10000 kg

# Metabolic rate scales as M^0.75 (Kleiber's law)
heat_generation = 70 * masses**0.75  # kcal/day

# Heat loss capacity scales with surface area ∝ M^0.67
heat_loss_capacity = 50 * masses**0.67  # relative units

ax.plot(masses, heat_generation, color='#ef4444', linewidth=2, label='Heat generation (\∝ M\⁰\·\⁵)')
ax.plot(masses, heat_loss_capacity, color='#3b82f6', linewidth=2, label='Heat loss capacity (\∝ M\⁰\·\⁶\⁷)')
ax.fill_between(masses, heat_loss_capacity, heat_generation,
                where=heat_generation > heat_loss_capacity, alpha=0.2, color='#ef4444',
                label='Overheating risk zone')
ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Energy rate (kcal/day)', color='white')
ax.set_title('Big Animals: Heat Generation Outpaces Loss', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Ear size comparison (Allen's Rule)
ax = axes[1, 0]
ax.set_facecolor('#111827')
animals_ears = {
    'Arctic hare': {'body_mass': 4, 'ear_area': 30, 'climate': 'Cold', 'color': '#3b82f6'},
    'Desert jackrabbit': {'body_mass': 3, 'ear_area': 130, 'climate': 'Hot', 'color': '#ef4444'},
    'Asian elephant': {'body_mass': 4000, 'ear_area': 15000, 'climate': 'Tropical', 'color': '#f59e0b'},
    'African elephant': {'body_mass': 6000, 'ear_area': 25000, 'climate': 'Hot', 'color': '#ef4444'},
    'Woolly mammoth': {'body_mass': 6000, 'ear_area': 5000, 'climate': 'Cold', 'color': '#3b82f6'},
}

names = list(animals_ears.keys())
relative_ear = [v['ear_area'] / v['body_mass']**0.67 for v in animals_ears.values()]
colors_ear = [v['color'] for v in animals_ears.values()]

bars = ax.bar(names, relative_ear, color=colors_ear, alpha=0.7)
ax.set_ylabel('Relative ear size (area/mass\⁰\·\⁶\⁷)', color='white')
ax.set_title("Allen's Rule: Hot = Big Ears, Cold = Small Ears", color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.tick_params(axis='x', rotation=20)

# 4. Wrinkle effect on surface area
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Smooth sphere vs wrinkled sphere
smooth_sa = 4 * np.pi * 1.0**2  # radius = 1m
wrinkle_depths = np.linspace(0, 0.3, 100)
# Each wrinkle adds ~2x its depth in extra surface area per unit area
wrinkle_multiplier = 1 + 3 * wrinkle_depths**0.7
effective_sa = smooth_sa * wrinkle_multiplier

ax.plot(wrinkle_depths * 100, effective_sa, color='#22c55e', linewidth=2)
ax.axhline(smooth_sa, color='gray', linestyle=':', alpha=0.3, label='Smooth skin')
ax.set_xlabel('Wrinkle depth (cm)', color='white')
ax.set_ylabel('Effective surface area (m\²)', color='white')
ax.set_title('Elephant Skin Wrinkles Increase SA', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

ax.annotate(f'Elephant wrinkles: ~1cm deep\\nSA increase: ~{(wrinkle_multiplier[33]-1)*100:.0f}%',
            xy=(1, effective_sa[33]), xytext=(5, effective_sa[33]*1.05),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Surface area to volume scaling:")
print("  Mouse (20g): SA/V \≈ 100 | loses heat fast, eats 25% body weight/day")
print("  Human (70kg): SA/V \≈ 1.8 | balanced thermoregulation")
print("  Elephant (4000kg): SA/V \≈ 0.5 | overheating risk, needs active cooling")
print()
print("Elephant adaptations to low SA/V:")
print("  Large ears: +20% surface area")
print("  Wrinkled skin: +10-20% surface area")
print("  Mud bathing: evaporative cooling supplement")
print("  Low metabolic rate per kg: reduced heat generation")`,
      challenge: 'Calculate the theoretical "ideal" ear size for a mammoth living in -30°C vs an elephant in +40°C. How much bigger should tropical ears be to compensate for the temperature difference?',
      successHint: 'The SA/V relationship is one of the most fundamental scaling laws in biology. It explains why insects can survive falls (high SA/V = air resistance), why elephants can\'t jump (low SA/V = too much mass per surface), and why small animals eat more per body weight than large ones.',
    },
    {
      title: 'Cooling strategies across the animal kingdom',
      concept: `Every animal has a cooling strategy shaped by its size, habitat, and evolutionary history.

**Cooling strategies:**
1. **Sweating** (humans, horses): evaporation from skin surface. Most effective but requires water.
2. **Panting** (dogs, birds): evaporation from mouth/airway. Works but loses CO₂.
3. **Mud/water bathing** (elephants, rhinos, pigs): evaporative + conductive cooling. Very effective for large animals.
4. **Ear vasodilation** (elephants, jackrabbits): pump hot blood to ears, radiate heat.
5. **Behavioral thermoregulation**: seek shade, reduce activity, be nocturnal.
6. **Wallowing** (hippos): stay submerged in water all day.
7. **Urohidrosis** (vultures, storks): urinate on legs. Gross but effective.
8. **Gular flutter** (pelicans, nightjars): vibrate throat to evaporate moisture.
9. **Rete mirabile** (tuna, some mammals): counter-current heat exchange in blood vessels.

**Why elephants don't sweat much:**
Elephants have very few sweat glands. This might seem like a design flaw, but sweating wastes water — and a 4000 kg elephant sweating at human rates would need 300+ liters of water per day just for cooling. Mud bathing achieves similar cooling with much less water.`,
      analogy: 'Animal cooling strategies are like different air conditioning technologies. Sweating is like an evaporative swamp cooler — cheap but needs constant water. Panting is like a fan — moves air but doesn\'t actually cool it. Mud bathing is like a radiator with coolant — transfers heat to a medium that carries it away. Each technology works best in different conditions.',
      storyConnection: 'In Kaziranga, the baby elephant learns by watching adults. Mother elephants spray water on their calves, lead them to mud wallows, and stand them in shade during the hottest hours. The "first mud bath" is part of an entire behavioral cooling curriculum that baby elephants learn from their herd — thermoregulation as cultural knowledge.',
      checkQuestion: 'Hippos stay in water all day and come out at night to feed. Elephants bathe in mud periodically and feed during the day. Which strategy is more energy-efficient?',
      checkAnswer: 'Hippos are more efficient at COOLING (water is a better heat sink than mud) but less efficient at FEEDING (restricted to nighttime foraging, must return to water by dawn). Elephants trade some cooling efficiency for feeding flexibility — they can forage all day with periodic mud breaks. The elephant strategy works better in variable environments; the hippo strategy works in stable river habitats. Neither is universally better.',
      codeIntro: 'Compare cooling strategies across different animal species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Cooling power of different strategies
ax = axes[0, 0]
ax.set_facecolor('#111827')
strategies = {
    'Sweating\\n(human)': {'power': 600, 'water_use': 1.0, 'color': '#3b82f6'},
    'Panting\\n(dog)': {'power': 300, 'water_use': 0.5, 'color': '#f59e0b'},
    'Mud bath\\n(elephant)': {'power': 800, 'water_use': 0.3, 'color': '#8b5cf6'},
    'Water immersion\\n(hippo)': {'power': 2000, 'water_use': 0, 'color': '#22c55e'},
    'Ear radiation\\n(elephant)': {'power': 200, 'water_use': 0, 'color': '#ef4444'},
    'Shade seeking\\n(any)': {'power': 150, 'water_use': 0, 'color': '#6b7280'},
}

names = list(strategies.keys())
powers = [s['power'] for s in strategies.values()]
colors = [s['color'] for s in strategies.values()]

bars = ax.barh(names, powers, color=colors, alpha=0.7)
ax.set_xlabel('Cooling power (W)', color='white')
ax.set_title('Cooling Power by Strategy', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, p in zip(bars, powers):
    ax.text(bar.get_width() + 20, bar.get_y() + bar.get_height()/2,
            f'{p}W', va='center', color='white', fontsize=9)

# 2. Water efficiency of cooling
ax = axes[0, 1]
ax.set_facecolor('#111827')
for name, props in strategies.items():
    if props['water_use'] > 0:
        efficiency = props['power'] / props['water_use']
        ax.scatter(props['water_use'], props['power'], s=100, color=props['color'],
                   edgecolors='white', linewidth=1)
        ax.annotate(name.replace('\\n', ' '), xy=(props['water_use'], props['power']),
                    xytext=(5, 5), textcoords='offset points', color=props['color'], fontsize=8)

ax.set_xlabel('Water use (liters/hour)', color='white')
ax.set_ylabel('Cooling power (W)', color='white')
ax.set_title('Water Efficiency: Mud > Panting > Sweating', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Temperature regulation across species
ax = axes[1, 0]
ax.set_facecolor('#111827')
env_temps = np.linspace(10, 45, 200)

# Body temperature as function of environment
species_thermo = {
    'Elephant (endotherm)': {'Tset': 36, 'range': (10, 42), 'color': '#22c55e'},
    'Human (endotherm)': {'Tset': 37, 'range': (10, 45), 'color': '#3b82f6'},
    'Lizard (ectotherm)': {'Tset': None, 'range': (10, 45), 'color': '#f59e0b'},
}

for name, props in species_thermo.items():
    if props['Tset']:
        # Endotherm: constant body temp within range
        body_temp = np.full_like(env_temps, props['Tset'])
        # Beyond range, temperature regulation fails
        body_temp[env_temps > 42] = env_temps[env_temps > 42] - 5
        body_temp[env_temps < 5] = env_temps[env_temps < 5] + 20
    else:
        # Ectotherm: body temp follows environment
        body_temp = env_temps - 2 + np.random.normal(0, 1, len(env_temps))

    ax.plot(env_temps, body_temp, color=props['color'], linewidth=2, label=name)

ax.plot(env_temps, env_temps, '--', color='gray', alpha=0.3, label='Body = Environment')
ax.set_xlabel('Environmental temperature (°C)', color='white')
ax.set_ylabel('Body temperature (°C)', color='white')
ax.set_title('Thermoregulation: Endotherms vs Ectotherms', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Energy cost of thermoregulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
env_range = np.linspace(0, 45, 200)

# Thermoneutral zone (TNZ): range where no extra energy is needed
tnz_low, tnz_high = 20, 32  # elephant approximate TNZ
basal_rate = 100  # arbitrary units

energy_cost = np.full_like(env_range, basal_rate)
# Below TNZ: cost increases (heating)
energy_cost[env_range < tnz_low] = basal_rate + 5 * (tnz_low - env_range[env_range < tnz_low])
# Above TNZ: cost increases (cooling)
energy_cost[env_range > tnz_high] = basal_rate + 8 * (env_range[env_range > tnz_high] - tnz_high)

ax.plot(env_range, energy_cost, color='#ef4444', linewidth=2)
ax.fill_between(env_range, basal_rate, energy_cost, alpha=0.2, color='#ef4444')
ax.axvspan(tnz_low, tnz_high, alpha=0.1, color='#22c55e')
ax.text((tnz_low + tnz_high)/2, basal_rate * 0.9, 'Thermoneutral\\nZone', ha='center',
        color='#22c55e', fontsize=10)
ax.set_xlabel('Environmental temperature (°C)', color='white')
ax.set_ylabel('Energy expenditure (relative)', color='white')
ax.set_title('Energy Cost of Temperature Regulation', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cooling strategy comparison:")
for name, props in strategies.items():
    name_clean = name.replace('\\n', ' ')
    water = f"{props['water_use']} L/hr" if props['water_use'] > 0 else "none"
    print(f"  {name_clean}: {props['power']}W cooling, water: {water}")
print()
print("The elephant combines multiple strategies:")
print("  Morning: ear vasodilation + shade seeking")
print("  Midday: mud bathing (peak cooling need)")
print("  Evening: residual mud evaporation + ear radiation")
print("  Night: radiation to cold sky (most efficient)")`,
      challenge: 'Climate change is raising average temperatures in Assam by 0.5°C per decade. Recalculate the energy cost of thermoregulation at +2°C and +4°C. What percentage more energy must elephants spend on cooling?',
      successHint: 'Cooling strategies across the animal kingdom represent millions of years of engineering solutions to the same physics problem. Engineers study these solutions for biomimetic cooling technology — from building ventilation (inspired by termite mounds) to spacecraft thermal management.',
    },
    {
      title: 'Thermoregulation in large animals — the giants\' challenge',
      concept: `Large animals face unique thermoregulation challenges that small animals never encounter.

**Why large animals overheat:**
1. SA/V ratio decreases with size (as we learned)
2. Metabolic heat production scales with mass^0.75 (Kleiber's law)
3. In hot climates, the environment itself is a heat source
4. Exercise generates 10-15x more heat than resting

**Elephant-specific cooling adaptations:**
- **Ears**: 1.5 m² per ear in Asian elephants (2 m² in African). Blood flows close to surface — each ear can radiate 50-100 W.
- **Skin**: 2-3 cm thick, heavily wrinkled. Wrinkles trap mud and water, extending evaporative cooling time.
- **Blood flow**: can redirect up to 60% of blood flow to skin surface when hot.
- **Behavioral**: seek shade, spray water, mud bathe, reduce activity during hottest hours, feed at night.
- **Temporal variation**: body temperature fluctuates 1-2°C daily (heterothermy) — storing heat during the day and radiating it at night.

**Heterothermy — storing heat:**
Instead of fighting to maintain exactly 36°C all day, elephants let their body temperature RISE during the hot afternoon (up to 37-38°C) and DROP during the cool night (to 35-36°C). This saves the energy of fighting constant temperature — and the stored heat radiates away easily in the cool night.`,
      analogy: 'Heterothermy is like charging a battery during cheap nighttime electricity and using it during expensive peak hours. The elephant "charges" coolness at night (body temperature drops when it is easy to radiate heat) and "spends" this thermal buffer during the hot day (lets temperature rise instead of fighting it). It is thermal energy arbitrage — using physics to save metabolic energy.',
      storyConnection: 'The baby elephant learns that mud baths happen at specific times — not randomly. The herd\'s matriarch knows from decades of experience: morning forage in the cool, midday mud bath at the river, afternoon shade-rest, evening feeding. This behavioral rhythm is the elephant\'s thermoregulation schedule, passed down through generations of Kaziranga elephants.',
      checkQuestion: 'African elephants have bigger ears than Asian elephants. African elephants live in hotter, more open habitats. Asian elephants live in cooler, forested habitats. Is this correlation or causation?',
      checkAnswer: 'Likely causation — supported by Allen\'s rule and functional anatomy. Larger ears provide more radiative cooling surface, which is more beneficial in hot, open habitats (where radiation to the sky is unobstructed). In forests, radiation is less effective (canopy blocks the sky) but conductive/evaporative cooling from streams and mud is more available. The ear size difference matches the thermal environment perfectly.',
      codeIntro: 'Model thermoregulation strategies in large animals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Heterothermy: body temperature over 3 days
ax = axes[0, 0]
ax.set_facecolor('#111827')
hours = np.linspace(0, 72, 4320)
env_temp = 28 + 10 * np.sin(np.pi * ((hours % 24) - 6) / 12)
env_temp = np.clip(env_temp, 22, 40)

# Strict homeotherm (fights to maintain 36°C)
strict_body = np.full_like(hours, 36.0)
strict_energy = np.abs(env_temp - 36) * 10  # energy cost proportional to difference

# Heterotherm (allows 35-38°C range)
hetero_body = 36.0 + 1.0 * np.sin(np.pi * ((hours % 24) - 14) / 12)
hetero_body = np.clip(hetero_body, 35, 38)
hetero_energy = np.maximum(0, np.abs(env_temp - hetero_body) * 10 - 30)

ax.plot(hours, env_temp, color='#ef4444', linewidth=1, alpha=0.5, label='Environment')
ax.plot(hours, strict_body, color='#3b82f6', linewidth=2, label='Strict homeotherm (36°C)')
ax.plot(hours, hetero_body, color='#22c55e', linewidth=2, label='Heterotherm (35-38°C)')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Heterothermy: Flexible Body Temperature', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Energy savings from heterothermy
ax = axes[0, 1]
ax.set_facecolor('#111827')
daily_strict = np.sum(strict_energy[:1440])
daily_hetero = np.sum(hetero_energy[:1440])
savings = (daily_strict - daily_hetero) / daily_strict * 100

ax.bar(['Strict\\nhomeotherm', 'Heterotherm'], [daily_strict, daily_hetero],
       color=['#3b82f6', '#22c55e'])
ax.set_ylabel('Daily energy cost (relative)', color='white')
ax.set_title(f'Energy Savings: {savings:.0f}% less with heterothermy', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Blood flow redistribution
ax = axes[1, 0]
ax.set_facecolor('#111827')
body_temp_range = np.linspace(35, 39, 100)

# Blood flow to skin (% of cardiac output)
skin_blood_flow = 10 + 50 / (1 + np.exp(-2 * (body_temp_range - 37)))

# Blood flow to ears specifically
ear_blood_flow = 5 + 25 / (1 + np.exp(-3 * (body_temp_range - 37.5)))

ax.plot(body_temp_range, skin_blood_flow, color='#ef4444', linewidth=2, label='Total skin flow')
ax.plot(body_temp_range, ear_blood_flow, color='#f59e0b', linewidth=2, label='Ear flow')
ax.fill_between(body_temp_range, skin_blood_flow - ear_blood_flow, skin_blood_flow,
                alpha=0.2, color='#ef4444', label='Body skin')
ax.fill_between(body_temp_range, 0, ear_blood_flow, alpha=0.2, color='#f59e0b', label='Ears')

ax.set_xlabel('Core body temperature (°C)', color='white')
ax.set_ylabel('Blood flow (% cardiac output)', color='white')
ax.set_title('Blood Flow Redistribution for Cooling', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Large animal thermoregulation comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
large_animals = {
    'Asian elephant': {'mass': 4000, 'strategy': 'Ears + mud + heterothermy', 'Tmax': 45, 'color': '#22c55e'},
    'African elephant': {'mass': 6000, 'strategy': 'Huge ears + water spray', 'Tmax': 50, 'color': '#3b82f6'},
    'White rhino': {'mass': 2300, 'strategy': 'Mud wallow + shade', 'Tmax': 42, 'color': '#8b5cf6'},
    'Hippo': {'mass': 1800, 'strategy': 'Water immersion + blood sweat', 'Tmax': 40, 'color': '#ef4444'},
    'Giraffe': {'mass': 1000, 'strategy': 'High SA/V + arterial cooling', 'Tmax': 45, 'color': '#f59e0b'},
}

names = list(large_animals.keys())
masses = [a['mass'] for a in large_animals.values()]
Tmax = [a['Tmax'] for a in large_animals.values()]
colors_la = [a['color'] for a in large_animals.values()]

ax.scatter(masses, Tmax, s=[m/20 for m in masses], c=colors_la, edgecolors='white', linewidth=1)
for name, m, t, c in zip(names, masses, Tmax, colors_la):
    strategy = large_animals[name]['strategy']
    ax.annotate(f'{name}\\n({strategy})', xy=(m, t), xytext=(10, 5),
                textcoords='offset points', color=c, fontsize=7)

ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Max tolerable env. temp (°C)', color='white')
ax.set_title('Large Animal Heat Tolerance', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Thermoregulation strategies of large animals:")
for name, props in large_animals.items():
    print(f"  {name} ({props['mass']}kg): {props['strategy']}")
print()
print(f"Heterothermy saves ~{savings:.0f}% energy in elephants")
print("This is why elephants are warmest in late afternoon (stored heat)")
print("and coolest at dawn (radiated heat all night)")`,
      challenge: 'Model what happens to an elephant that cannot access water or mud for 48 hours in 38°C heat. How quickly does its body temperature reach dangerous levels? This scenario happens during droughts.',
      successHint: 'Understanding large-animal thermoregulation is increasingly critical as climate change raises temperatures. Elephants, rhinos, and other megafauna are among the most vulnerable because they already operate near their thermal limits. Conservation must now include thermal refugia — areas with shade, water, and mud.',
    },
    {
      title: 'Climate adaptation — surviving in a warming world',
      concept: `Climate change is raising temperatures in South and Southeast Asia by 0.5-1.5°C per decade in some regions. For elephants and other large animals, this is a thermoregulation crisis.

**How climate change affects elephants:**
1. **Higher average temperatures** → more energy spent cooling → less energy for growth and reproduction
2. **More heat waves** → risk of heat stroke, especially for calves and elderly
3. **Water scarcity** → fewer mud wallows and drinking water → cooling becomes impossible
4. **Habitat shift** → forests move upslope/northward → current reserves may become too hot
5. **Fire risk** → drier forests burn more → habitat loss

**Elephant responses:**
- **Behavioral**: more nocturnal activity, seeking water more frequently
- **Physiological**: may develop better heterothermy over generations
- **Range shift**: moving to higher elevations or northward (where possible)
- **Population effects**: lower calf survival in hot years, reduced reproduction

**Conservation implications:**
- Protect water sources and wallowing sites within reserves
- Create thermal corridors (shaded pathways between water sources)
- Maintain forest canopy (shade reduces ground temperature by 5-10°C)
- Reduce human-elephant conflict as elephants seek water outside reserves

**In Assam:** Kaziranga's elephants face both climate warming AND annual monsoon flooding — a dual thermal challenge of extreme heat followed by extreme water.`,
      analogy: 'Climate change for elephants is like slowly turning up the thermostat in a house where the AC is already struggling. At first, the AC works harder (more mud bathing, more water seeking). Then it starts failing (heat stress, reduced reproduction). Eventually, the house becomes uninhabitable (local extinction). The solution isn\'t a bigger AC — it\'s turning down the thermostat (reducing emissions) and insulating the house (protecting forest canopy).',
      storyConnection: 'The baby elephant in the story takes its first mud bath in a world that is warming. By the time it is a 60-year-old matriarch, Kaziranga\'s average temperature may be 2-3°C higher. The mud wallows she teaches her grandchildren to use may have dried up. The story\'s joyful first bath is also a reminder of what is at stake — the simple, essential act of cooling in mud, threatened by a changing climate.',
      checkQuestion: 'If elephants become more nocturnal to avoid heat, what cascading effects might this have on the ecosystem?',
      checkAnswer: 'Multiple effects: (1) Reduced daytime seed dispersal (elephants are major seed spreaders). (2) More nighttime human-elephant conflict (elephants raiding crops under cover of darkness). (3) Altered plant communities (elephants that feed at night eat different plants than daytime foragers). (4) Predation patterns change (tigers may adjust their activity to match elephant movements). One species\' behavioral shift cascades through the entire ecosystem.',
      codeIntro: 'Model the impact of climate change on elephant thermoregulation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Temperature projections for Assam
ax = axes[0, 0]
ax.set_facecolor('#111827')
years = np.arange(2025, 2100)

# Temperature scenarios (RCP pathways)
base_temp = 27  # current annual mean for Assam
rcp26 = base_temp + 0.01 * (years - 2025)  # best case
rcp45 = base_temp + 0.025 * (years - 2025)  # moderate
rcp85 = base_temp + 0.05 * (years - 2025)  # worst case

# Add interannual variability
rcp26 += np.random.normal(0, 0.5, len(years))
rcp45 += np.random.normal(0, 0.5, len(years))
rcp85 += np.random.normal(0, 0.7, len(years))

ax.plot(years, rcp26, color='#22c55e', linewidth=2, label='RCP 2.6 (Paris targets)')
ax.plot(years, rcp45, color='#f59e0b', linewidth=2, label='RCP 4.5 (moderate)')
ax.plot(years, rcp85, color='#ef4444', linewidth=2, label='RCP 8.5 (business as usual)')
ax.axhline(base_temp, color='gray', linestyle=':', alpha=0.3)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Mean temperature (°C)', color='white')
ax.set_title('Assam Temperature Projections', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Cooling energy cost increase
ax = axes[0, 1]
ax.set_facecolor('#111827')
temp_increases = np.linspace(0, 5, 100)
# Energy for cooling scales non-linearly with temperature above thermoneutral
tnz_upper = 32
extra_energy = np.where(base_temp + temp_increases > tnz_upper,
                        8 * (base_temp + temp_increases - tnz_upper)**1.5, 0)
baseline_energy = 100  # percent
total_energy = baseline_energy + extra_energy

ax.plot(temp_increases, total_energy, color='#ef4444', linewidth=2)
ax.fill_between(temp_increases, baseline_energy, total_energy, alpha=0.2, color='#ef4444')
ax.set_xlabel('Temperature increase (°C above current)', color='white')
ax.set_ylabel('Energy expenditure (% of current)', color='white')
ax.set_title('Energy Cost of Cooling Rises Non-Linearly', color='white', fontsize=11)
ax.tick_params(colors='gray')

for dt, label in [(1.5, 'Paris +1.5°C'), (3, '+3°C'), (5, '+5°C (catastrophic)')]:
    e = baseline_energy + (8 * max(0, base_temp + dt - tnz_upper)**1.5)
    ax.annotate(f'{label}\\n{e:.0f}% energy', xy=(dt, e), xytext=(dt+0.3, e+5),
                color='#f59e0b', fontsize=8, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# 3. Calf survival vs heat days
ax = axes[1, 0]
ax.set_facecolor('#111827')
hot_days = np.linspace(0, 150, 100)  # days above 38°C per year
# Current: ~30 hot days. Calf survival ~85%
# Survival decreases with more hot days
calf_survival = 90 * np.exp(-hot_days / 200) + 5 * np.random.normal(0, 1, len(hot_days))
calf_survival = np.clip(calf_survival, 0, 100)

ax.plot(hot_days, calf_survival, color='#22c55e', linewidth=2)
ax.axvline(30, color='#3b82f6', linestyle='--', alpha=0.5, label='Current (~30 days)')
ax.axvline(60, color='#f59e0b', linestyle='--', alpha=0.5, label='2050 projection (~60)')
ax.axvline(100, color='#ef4444', linestyle='--', alpha=0.5, label='2080 worst case (~100)')
ax.set_xlabel('Hot days per year (>38°C)', color='white')
ax.set_ylabel('Calf survival rate (%)', color='white')
ax.set_title('More Hot Days = Lower Calf Survival', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Adaptation vs mitigation
ax = axes[1, 1]
ax.set_facecolor('#111827')
decades = np.arange(2020, 2100, 10)

# Population projections under different strategies
pop_no_action = 5000 * np.exp(-0.03 * (decades - 2020))
pop_adaptation = 5000 * np.exp(-0.015 * (decades - 2020))  # water management, corridors
pop_mitigation = 5000 * np.exp(-0.005 * (decades - 2020))  # reduce emissions + adapt
pop_full = 5000 * np.exp(0.005 * (decades - 2020))  # emissions cut + full conservation

ax.plot(decades, pop_no_action, 'o--', color='#ef4444', linewidth=2, label='No action')
ax.plot(decades, pop_adaptation, 's-', color='#f59e0b', linewidth=2, label='Adaptation only')
ax.plot(decades, pop_mitigation, '^-', color='#3b82f6', linewidth=2, label='Mitigation + adaptation')
ax.plot(decades, pop_full, 'D-', color='#22c55e', linewidth=2, label='Full conservation + mitigation')
ax.axhline(1000, color='gray', linestyle=':', alpha=0.3)
ax.text(2090, 1100, 'Minimum viable', color='gray', fontsize=8)

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Elephant population', color='white')
ax.set_title('Population Outcomes Under Different Strategies', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate change impact on elephant thermoregulation:")
print(f"  Current hot days (>38°C): ~30/year in Kaziranga")
print(f"  2050 projection: ~60 hot days (+100% more cooling needed)")
print(f"  2080 worst case: ~100 hot days (calf survival drops below 70%)")
print()
print("Conservation priorities in a warming world:")
print("  1. Protect water sources and wallowing sites")
print("  2. Maintain forest canopy (5-10°C cooler than open areas)")
print("  3. Create thermal corridors between cool refugia")
print("  4. Reduce emissions (the only long-term solution)")
print("  5. Monitor heat stress indicators in wild populations")`,
      challenge: 'Add a "thermal refugia" factor: forest canopy reduces local temperature by 5°C. Calculate how much forest cover is needed in a reserve to ensure elephants always have access to below-38°C shade within 2 km of any point.',
      successHint: 'From body temperature to heat transfer to the surface-area-to-volume ratio to climate adaptation — you have traced the physics of thermoregulation from a single mud bath to a global conservation challenge. The baby elephant\'s first splash in the mud is, in miniature, the story of how life survives on a warming planet.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Thermoregulation & Animal Behavior</span>
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