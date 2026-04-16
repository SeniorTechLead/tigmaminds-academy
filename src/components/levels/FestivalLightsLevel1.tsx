import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FestivalLightsLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Forms of energy — the many faces of one thing',
      concept: `When lamps float down the Brahmaputra during the festival, they glow with light and warmth. That light and warmth are **energy** — the ability to do work or cause change. Energy comes in many forms:

- **Chemical energy**: stored in fuels, food, batteries (the oil in the festival lamp)
- **Thermal energy** (heat): the random motion of molecules (the flame's warmth)
- **Light energy** (radiant/electromagnetic): photons traveling through space (the glow you see)
- **Electrical energy**: moving electrons in a conductor (powering an LED)
- **Kinetic energy**: energy of motion (the river carrying the lamp)
- **Potential energy**: stored energy due to position (water at the top of a hill)
- **Nuclear energy**: stored in atomic nuclei (the Sun's power source)

The **First Law of Thermodynamics** says energy cannot be created or destroyed — only converted from one form to another. The festival lamp converts chemical energy (oil) → thermal energy (heat) → light energy (glow). Every energy "source" is really an energy **conversion**.`,
      analogy: 'Energy is like money in different currencies. You can have dollars (chemical), euros (thermal), yen (light), pounds (electrical). You can exchange one for another, but the total value never changes — it just changes form. A festival lamp is a currency exchange booth: it takes chemical energy in and gives thermal + light energy out.',
      storyConnection: 'Each floating lamp on the Brahmaputra is a tiny energy converter. The oil stores chemical energy from plants that captured solar energy months ago through photosynthesis. Lighting the wick converts chemical → thermal → light. The lamp drifts on the river\'s kinetic energy. The whole festival is a cascade of energy transformations — sun to plant to oil to flame to light.',
      checkQuestion: 'A floating lamp converts chemical energy to light, but most of the energy becomes heat, not light. Is that wasted energy?',
      checkAnswer: 'From a physics perspective, no energy is "lost" — it is conserved. But from a practical perspective, yes, the heat is wasted. An oil lamp converts only about 1-2% of its chemical energy into visible light. The rest becomes heat that dissipates into the air and water. This is why efficiency matters — and why LEDs (which convert ~40% of electrical energy to light) are revolutionary.',
      codeIntro: 'Map the energy conversions in a festival lamp and compare efficiencies of different light sources.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Energy conversion efficiency of different light sources
sources = ['Oil lamp', 'Candle', 'Incandescent\
bulb', 'CFL', 'LED', 'Firefly\
(bioluminescence)']
light_efficiency = [1.5, 0.8, 5, 22, 40, 90]  # % of energy → visible light
heat_pct = [100 - e for e in light_efficiency]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Bar chart: efficiency comparison
ax1.set_facecolor('#111827')
colors_bar = ['#f59e0b', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7']
bars = ax1.bar(sources, light_efficiency, color=colors_bar, alpha=0.8)
ax1.set_ylabel('Energy → Light (%)', color='white')
ax1.set_title('Light Source Efficiency', color='white', fontsize=13)
ax1.tick_params(colors='gray', axis='both')
for bar, eff in zip(bars, light_efficiency):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, f'{eff}%',
             ha='center', color='white', fontsize=10, fontweight='bold')

# Stacked bar: light vs heat for the festival lamp
ax2.set_facecolor('#111827')
categories = ['Chemical\
energy in\
(100%)', 'Heat output', 'Light output']
values = [100, 98.5, 1.5]
colors_stack = ['#f59e0b', '#ef4444', '#fbbf24']
bars2 = ax2.bar(categories, values, color=colors_stack, alpha=0.8)
ax2.set_title('Festival Oil Lamp: Where Does the Energy Go?', color='white', fontsize=12)
ax2.set_ylabel('Energy (%)', color='white')
ax2.tick_params(colors='gray')
for bar, val in zip(bars2, values):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, f'{val}%',
             ha='center', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

print("Festival lamp energy flow:")
print("  Chemical energy (mustard oil): 100%")
print("  → Heat (warms air & water): 98.5%")
print("  → Visible light (the glow): 1.5%")
print()
print("If the festival used LEDs instead:")
print("  Same glow would need ~25x less energy")
print("  But the warm, flickering flame IS the tradition")
print("  Sometimes culture and efficiency serve different goals")`,
      challenge: 'Calculate: if 1,000 lamps each burn 50 mL of oil (energy density: 37 MJ/L), how much total energy is released during the festival? How much of that is visible light?',
      successHint: 'Understanding energy forms and conversions is the foundation of all engineering. Every power plant, battery, engine, and light source is fundamentally an energy converter — and the efficiency of that conversion determines its usefulness.',
    },
    {
      title: 'Chemical to light energy — the science of combustion',
      concept: `The festival lamp works by **combustion** — a chemical reaction between fuel (oil) and oxygen that releases energy as heat and light.

The reaction: **Fuel + O₂ → CO₂ + H₂O + energy**

For mustard oil (a common lamp fuel in Assam), the carbon chains break apart, each carbon atom bonding with two oxygen atoms to form CO₂, and each pair of hydrogen atoms bonding with oxygen to form water vapour. The bonds in CO₂ and H₂O are **stronger** than the bonds in oil and O₂, so the reaction releases the difference as energy.

What makes the flame glow? Two mechanisms:
1. **Incandescence**: tiny soot particles in the flame are heated to ~1,000-1,500°C and glow yellow-orange (black body radiation)
2. **Chemiluminescence**: some excited molecules emit light directly as they form

The colour of a flame tells you its temperature:
- Red: ~600-800°C (cooler)
- Yellow-orange: ~1,000-1,200°C (typical candle/lamp)
- Blue: ~1,400-1,600°C (hotter, complete combustion)

The festival lamp's warm orange glow comes from hot soot particles — it's actually a sign of **incomplete** combustion. Complete combustion would produce a blue flame with less soot and less visible light.`,
      analogy: 'Combustion is like demolishing a building (fuel molecules) to build a stronger one (CO₂ and H₂O). The new building uses less material, and the leftover material is released as energy. The "demolition sparks" are the light you see. A cleaner demolition (blue flame) is more efficient but produces fewer sparks — less visible light.',
      storyConnection: 'Each lamp on the Brahmaputra runs its own tiny combustion reaction. The wick draws oil upward by capillary action, the oil vaporises in the heat, and the vapour mixes with air and burns. The warm yellow glow that makes the festival magical is, in physics terms, thermal radiation from nanoscale carbon particles — soot heated to incandescence.',
      checkQuestion: 'Why does blowing gently on a candle make it brighter, but blowing hard puts it out?',
      checkAnswer: 'Gentle blowing adds more oxygen to the flame, improving combustion and increasing temperature — more incandescent soot, brighter glow. Hard blowing physically separates the flame from the fuel vapour, cooling the wick below the ignition temperature. The flame needs continuous heat to vaporise fuel; remove that heat and the chain reaction stops. It is a balance between oxygen supply and heat maintenance.',
      codeIntro: 'Model black body radiation: how the colour of a flame depends on its temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Planck's law: spectral radiance of a black body
def planck(wavelength_nm, T):
    """Spectral radiance in arbitrary units"""
    h = 6.626e-34   # Planck constant
    c = 3e8          # speed of light
    k = 1.381e-23    # Boltzmann constant
    lam = wavelength_nm * 1e-9  # convert to metres
    return (2 * h * c**2 / lam**5) / (np.exp(h * c / (lam * k * T)) - 1)

wavelengths = np.linspace(300, 800, 500)  # visible spectrum (nm)

# Temperatures of different flame types
temps = {
    'Red flame (800°C)': 1073,
    'Festival lamp (1100°C)': 1373,
    'Candle (1200°C)': 1473,
    'Blue flame (1500°C)': 1773,
    'Sun surface (5500°C)': 5773,
}
colors_line = ['#ef4444', '#f59e0b', '#fbbf24', '#3b82f6', '#fef08a']

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Visible spectrum background
spectrum_colors = plt.cm.nipy_spectral(np.linspace(0, 1, len(wavelengths)))
for i in range(len(wavelengths) - 1):
    ax.axvspan(wavelengths[i], wavelengths[i+1], alpha=0.05, color=spectrum_colors[i])

for (label, T), color in zip(temps.items(), colors_line):
    spectrum = planck(wavelengths, T)
    # Normalise for visibility
    spectrum = spectrum / np.max(spectrum)
    ax.plot(wavelengths, spectrum, color=color, linewidth=2, label=label)

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative intensity', color='white')
ax.set_title('Black Body Radiation: Flame Color = Temperature', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper right')
ax.tick_params(colors='gray')

# Mark visible spectrum regions
regions = [(380, 450, 'Violet'), (450, 495, 'Blue'), (495, 570, 'Green'),
           (570, 590, 'Yellow'), (590, 620, 'Orange'), (620, 750, 'Red')]
for lo, hi, name in regions:
    ax.annotate(name, xy=((lo+hi)/2, -0.05), color='gray', fontsize=7, ha='center')

plt.tight_layout()
plt.show()

print("Key insight: hotter objects emit more light AND shift")
print("their peak to shorter wavelengths (bluer).")
print()
print("This is Wien's displacement law:")
print("  Peak wavelength = 2,897,000 / Temperature(K)")
for label, T in temps.items():
    peak = 2897000 / T
    print(f"  {label}: peak at {peak:.0f} nm")
print()
print("The festival lamp's peak is in the infrared (~2100nm)")
print("— most energy is invisible heat, not visible light.")`,
      challenge: 'The Sun peaks at about 500 nm (green), yet it looks white/yellow. Why? Plot the Sun\'s spectrum and shade the portion that falls within the visible range. What fraction of its total output is visible light?',
      successHint: 'Black body radiation connects temperature to colour — a fundamental relationship used in astronomy (star temperatures), metallurgy (metal working temperatures), and everyday life (why hot coals glow red).',
    },
    {
      title: 'LED vs candle efficiency — the physics of modern light',
      concept: `The festival traditionally uses oil lamps and candles. Modern celebrations sometimes add LEDs. The difference in how they produce light is profound:

**Candle/oil lamp** (incandescence):
- Heat fuel → hot soot particles → thermal radiation (mostly infrared)
- Temperature: ~1,200°C
- Efficiency: 0.8-1.5% of energy becomes visible light
- Lifespan: hours

**LED** (electroluminescence):
- Electrons cross a semiconductor junction → photons emitted directly
- No heating required — light is produced "cold"
- Efficiency: 30-50% of electrical energy becomes visible light
- Lifespan: 25,000-50,000 hours

The LED is fundamentally different because it converts electrical energy **directly** to light, skipping the thermal step. A candle must heat material to >1,000°C to get any visible light; an LED emits light at room temperature.

**Luminous efficacy** measures this: lumens of light per watt of power consumed.
- Candle: ~0.3 lm/W
- Incandescent bulb: ~15 lm/W
- LED: ~100-150 lm/W
- Theoretical maximum (perfect green light): 683 lm/W`,
      analogy: 'A candle is like heating a whole house to cook a single egg — you get the egg cooked (light produced), but 99% of the energy goes into heating the house (infrared radiation). An LED is like a microwave that heats only the egg — targeted, efficient, minimal waste. The candle turns energy into heat first and light second; the LED turns energy into light directly.',
      storyConnection: 'Imagine the festival with 10,000 floating lamps. With traditional oil lamps, that is about 10,000 tiny fires, each converting 1.5% of their energy into the warm glow on the river. With LEDs, the same visual effect could be achieved with 25 times less energy — and the "lamps" could last for years. But the flickering, imperfect flame is part of the beauty. Engineering efficiency and cultural meaning don\'t always align.',
      checkQuestion: 'LEDs are far more efficient, so why do candles still "feel" warmer and more inviting? Is there a physics explanation?',
      checkAnswer: 'Yes. Candles emit a continuous spectrum heavily weighted toward red and infrared (warm colours). LEDs have a narrow emission peak, often supplemented with phosphors to appear "warm white." The candle also flickers at random frequencies (1/f noise pattern), which humans find soothing — it matches natural phenomena like wind and flowing water. The candle engages more senses: warmth, smell (combustion products), movement, and a broad, gentle spectrum.',
      codeIntro: 'Compare the energy cost and light output of different festival lighting options.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Festival scenario: illuminate the river for 4 hours
duration_hours = 4
num_lamps = 1000

# Light sources
sources = {
    'Oil lamp': {'power_w': 40, 'lumens': 12, 'cost_per_unit': 5, 'co2_g_per_kwh': 250},
    'Candle': {'power_w': 80, 'lumens': 13, 'cost_per_unit': 10, 'co2_g_per_kwh': 300},
    'Incandescent': {'power_w': 60, 'lumens': 800, 'cost_per_unit': 15, 'co2_g_per_kwh': 900},
    'LED (warm)': {'power_w': 8, 'lumens': 800, 'cost_per_unit': 80, 'co2_g_per_kwh': 900},
}

# Calculate totals for the festival
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Festival Lighting: {num_lamps} Lamps × {duration_hours} Hours', color='white', fontsize=14)

names = list(sources.keys())
colors_src = ['#f59e0b', '#f97316', '#fbbf24', '#3b82f6']

# Total energy consumed (kWh)
energy_kwh = [s['power_w'] * duration_hours / 1000 * num_lamps for s in sources.values()]
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.bar(names, energy_kwh, color=colors_src, alpha=0.8)
ax1.set_ylabel('Total energy (kWh)', color='white')
ax1.set_title('Energy Consumed', color='white', fontsize=11)
ax1.tick_params(colors='gray')
for i, v in enumerate(energy_kwh):
    ax1.text(i, v + 2, f'{v:.0f}', ha='center', color='white', fontsize=9)

# Efficacy (lumens per watt)
efficacy = [s['lumens'] / s['power_w'] for s in sources.values()]
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.bar(names, efficacy, color=colors_src, alpha=0.8)
ax2.set_ylabel('Luminous efficacy (lm/W)', color='white')
ax2.set_title('Light per Watt', color='white', fontsize=11)
ax2.tick_params(colors='gray')
for i, v in enumerate(efficacy):
    ax2.text(i, v + 1, f'{v:.1f}', ha='center', color='white', fontsize=9)

# Total light output (kilolumens)
total_lumens = [s['lumens'] * num_lamps / 1000 for s in sources.values()]
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.bar(names, total_lumens, color=colors_src, alpha=0.8)
ax3.set_ylabel('Total light (kilolumens)', color='white')
ax3.set_title('Total Light Output', color='white', fontsize=11)
ax3.tick_params(colors='gray')
for i, v in enumerate(total_lumens):
    ax3.text(i, v + 5, f'{v:.0f}', ha='center', color='white', fontsize=9)

# CO2 emissions
co2_kg = [s['co2_g_per_kwh'] * s['power_w'] * duration_hours / 1000 * num_lamps / 1000 for s in sources.values()]
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.bar(names, co2_kg, color=colors_src, alpha=0.8)
ax4.set_ylabel('CO₂ emissions (kg)', color='white')
ax4.set_title('Carbon Footprint', color='white', fontsize=11)
ax4.tick_params(colors='gray')
for i, v in enumerate(co2_kg):
    ax4.text(i, v + 1, f'{v:.0f}', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Festival lighting comparison:")
for name, e, eff, lum in zip(names, energy_kwh, efficacy, total_lumens):
    print(f"  {name}: {e:.0f} kWh, {eff:.1f} lm/W, {lum:.0f} klm total")
print()
print("LED advantage: same light as incandescent at 1/7th the energy")
print("Oil lamp charm: the warm, dim glow IS the festival")`,
      challenge: 'Calculate: how many LED lamps would you need to match the total light output of 1,000 oil lamps? (Hint: compare their lumen outputs.) The answer reveals why "matching the brightness" isn\'t the real goal of traditional lighting.',
      successHint: 'The LED revolution is one of the most impactful energy transitions in human history. LEDs now save about 570 terawatt-hours of electricity per year globally — more than the total electricity consumption of India in 2000.',
    },
    {
      title: 'Solar energy basics — harvesting the sun',
      concept: `The Sun delivers about **1,000 watts per square metre** (the "solar constant" at Earth's surface on a clear day) — enough to power ten 100W light bulbs from a single square metre of sunlight.

How solar panels work:
1. Sunlight hits a **semiconductor** (usually silicon) in the solar cell
2. Photons (light particles) knock electrons free from silicon atoms
3. An electric field in the cell pushes these free electrons in one direction
4. This flow of electrons is **electricity** — the photovoltaic effect

Key terms:
- **Photovoltaic (PV)**: converting light directly to electricity
- **Solar irradiance**: power of sunlight per area (W/m²)
- **Efficiency**: percentage of solar energy converted to electricity (typical: 18-22%)
- **Capacity factor**: actual output vs theoretical maximum (accounts for clouds, night, angle)

India receives **4-7 kWh/m²/day** of solar energy — among the highest in the world. Assam receives about **4.5 kWh/m²/day**, enough to power substantial energy needs if captured efficiently.

The festival's oil lamps convert stored solar energy (plant → oil). Solar panels skip the middleman — they convert sunlight to electricity directly, at ~20% efficiency vs oil lamps' ~1.5% for light.`,
      analogy: 'A solar panel is like a field of mousetraps loaded with ping-pong balls. Each "trap" is a silicon atom. When a photon (a ball of light) hits a trap, it springs and launches an electron (ping-pong ball) across the cell. Connect a wire and the electrons flow — that\'s electricity. No burning, no heat, no moving parts. Just light knocking electrons loose.',
      storyConnection: 'What if the festival lamps were solar-powered? During the day, small solar panels could charge batteries. At sunset, warm-white LEDs could float on the Brahmaputra, lasting not just one night but many nights. The same river that carries the lamps could even generate hydropower to charge them — the Brahmaputra\'s tributaries already power several hydroelectric stations in the Northeast.',
      checkQuestion: 'If solar panels are 20% efficient and the Sun delivers 1,000 W/m², why can\'t we cover a small area with panels and power the whole world?',
      checkAnswer: 'We could, in theory. The entire world\'s electricity needs could be met by covering about 0.3% of the Earth\'s land area with solar panels (roughly the area of Spain). The challenges are practical, not physical: panels work only during the day, energy storage is expensive, transmission over long distances has losses, manufacturing requires rare materials, and land use competes with agriculture and ecosystems. But the physics says it is absolutely possible.',
      codeIntro: 'Model solar energy generation throughout a day in Guwahati, Assam.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Solar irradiance model for Guwahati (26.1°N)
hours = np.linspace(0, 24, 200)

# Simplified solar model: bell curve centred at solar noon
sunrise = 5.5   # approximate
sunset = 18.0
solar_noon = (sunrise + sunset) / 2

# Irradiance (W/m²)
irradiance = np.where(
    (hours >= sunrise) & (hours <= sunset),
    1000 * np.sin(np.pi * (hours - sunrise) / (sunset - sunrise)),
    0
)

# Panel output (20% efficiency, 1 m² panel)
panel_efficiency = 0.20
panel_output = irradiance * panel_efficiency  # watts

# Cloud cover reduces output (random but heavier in afternoon)
np.random.seed(42)
cloud_factor = np.ones_like(hours)
afternoon_idx = hours > 13
cloud_factor[afternoon_idx] *= np.random.uniform(0.5, 1.0, np.sum(afternoon_idx))
panel_real = panel_output * cloud_factor

# Cumulative energy generated (Wh)
dt = 24 / len(hours)
cumulative = np.cumsum(panel_real * dt)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Irradiance and panel output
ax1.set_facecolor('#111827')
ax1.fill_between(hours, irradiance, alpha=0.15, color='#f59e0b')
ax1.plot(hours, irradiance, color='#f59e0b', linewidth=2, label='Solar irradiance (W/m²)')
ax1.plot(hours, panel_real, color='#3b82f6', linewidth=2, label='Panel output (W, with clouds)')
ax1.fill_between(hours, panel_real, alpha=0.15, color='#3b82f6')
ax1.axvspan(sunset, 24, alpha=0.1, color='#6b7280')
ax1.axvspan(0, sunrise, alpha=0.1, color='#6b7280')
ax1.annotate('Night', xy=(2, 500), color='gray', fontsize=10)
ax1.annotate('Night', xy=(20, 500), color='gray', fontsize=10)
ax1.set_ylabel('Power (W/m²)', color='white')
ax1.set_title('Solar Energy in Guwahati — One Day', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 24)

# Cumulative energy
ax2.set_facecolor('#111827')
ax2.plot(hours, cumulative, color='#22c55e', linewidth=2)
ax2.fill_between(hours, cumulative, alpha=0.1, color='#22c55e')
ax2.set_xlabel('Hour of day', color='white')
ax2.set_ylabel('Cumulative energy (Wh)', color='white')
ax2.set_title('Energy Harvested by 1m² Panel', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 24)

total_energy = cumulative[-1]
ax2.annotate(f'Total: {total_energy:.0f} Wh', xy=(20, total_energy * 0.9), color='#22c55e',
             fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()

print(f"Daily solar energy (Guwahati, 1 m² panel at 20% efficiency):")
print(f"  Total: {total_energy:.0f} Wh = {total_energy/1000:.2f} kWh")
print(f"  Peak output: {np.max(panel_real):.0f} W")
print()
print("What can {:.0f} Wh power?".format(total_energy))
print(f"  Phone charges: {total_energy / 15:.0f} (15 Wh per charge)")
print(f"  LED bulbs (10W): {total_energy / 10:.0f} hours")
print(f"  Laptop: {total_energy / 50:.0f} hours")
print(f"  Festival LED lamps (1W each): {total_energy / 1:.0f} lamp-hours")`,
      challenge: 'Model a full year: solar noon shifts with seasons, and monsoon months (June-September) have much more cloud cover. Plot monthly energy generation. Which month produces the most? The least?',
      successHint: 'Solar energy is the most abundant energy source available. In one hour, the Sun delivers more energy to Earth than all of humanity uses in a year. The challenge is capturing, storing, and distributing it efficiently.',
    },
    {
      title: 'Battery technology — storing energy for the night',
      concept: `The festival happens at night, but the sun shines during the day. This mismatch is the central challenge of renewable energy: **storage**. Batteries bridge the gap — they store electrical energy as chemical energy and release it on demand.

How a lithium-ion battery works:
1. **Charging**: electricity forces lithium ions from the cathode through an electrolyte to the anode, storing energy
2. **Discharging**: lithium ions flow back to the cathode through the electrolyte, releasing electrons through the external circuit — that flow is the electricity you use

Key battery metrics:
- **Energy density**: how much energy per kg (lithium-ion: ~250 Wh/kg)
- **Power density**: how fast it can deliver energy (important for rapid discharge)
- **Cycle life**: how many charge/discharge cycles before degradation (~500-2,000)
- **Self-discharge**: energy lost while sitting idle (~2-3% per month)
- **Round-trip efficiency**: energy out / energy in (~85-95% for lithium-ion)

For a solar-powered festival lamp, you need a battery that:
- Charges during ~12 hours of daylight
- Discharges over ~4-6 hours of festival
- Is waterproof, lightweight, and safe
- Lasts multiple festivals (many charge cycles)`,
      analogy: 'A battery is like a water tower. During the day (when the pump/solar panel is running), water is pushed up into the tower (lithium ions move to the anode). At night (when you need water/electricity), gravity pulls it back down (ions return to the cathode). The height of the tower is the voltage. The amount of water stored is the capacity. The pipe width is the maximum current.',
      storyConnection: 'If you wanted to create 1,000 solar-powered floating lamps for the Brahmaputra festival, each lamp would need a small battery: a 1W LED running for 6 hours needs 6 Wh. A tiny lithium-ion cell (like those in a smartphone) holds about 10-15 Wh — more than enough for one night, with energy left over for the next. One solar panel charging during the day, one small battery, one warm LED — a reusable festival lamp.',
      checkQuestion: 'Why do batteries degrade over time? If the chemical reaction is reversible, shouldn\'t they last forever?',
      checkAnswer: 'The reaction is reversible in principle, but not perfectly in practice. Each charge/discharge cycle causes tiny physical changes: lithium ions get trapped in the anode (forming a solid-electrolyte interphase), the cathode crystal structure slowly degrades, and dendrites (tiny metal needles) can grow. These changes are irreversible, reducing capacity over time. It is like shuffling a deck of cards — each shuffle is reversible in theory, but practically you cannot unshuffle back to the original order.',
      codeIntro: 'Simulate a solar-powered festival lamp: charge during the day, glow at night.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 48-hour simulation: day 1 (charge) + night 1 (festival) + day 2
hours = np.linspace(0, 48, 500)

# Solar panel: 2W peak, charges battery
sunrise, sunset = 5.5, 18.0
solar_power = np.zeros_like(hours)
for day_offset in [0, 24]:
    h = hours - day_offset
    mask = (h >= sunrise) & (h <= sunset)
    solar_power[mask] = 2.0 * np.sin(np.pi * (h[mask] - sunrise) / (sunset - sunrise))

# LED: 1W, runs from 18:00 to 24:00 (festival night 1)
led_power = np.zeros_like(hours)
led_power[(hours >= 18) & (hours <= 24)] = 1.0

# Battery simulation
battery_capacity = 10  # Wh (small lithium cell)
battery_level = np.zeros_like(hours)
battery_level[0] = 2  # start partially charged
efficiency_charge = 0.90
efficiency_discharge = 0.95

dt = 48 / len(hours)
for i in range(1, len(hours)):
    charge = solar_power[i] * efficiency_charge * dt
    discharge = led_power[i] / efficiency_discharge * dt
    battery_level[i] = np.clip(battery_level[i-1] + charge - discharge, 0, battery_capacity)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Solar-Powered Festival Lamp — 48 Hours', color='white', fontsize=14)

# Power flows
ax1.set_facecolor('#111827')
ax1.fill_between(hours, solar_power, alpha=0.3, color='#f59e0b')
ax1.plot(hours, solar_power, color='#f59e0b', linewidth=2, label='Solar input (W)')
ax1.fill_between(hours, -led_power, alpha=0.3, color='#3b82f6')
ax1.plot(hours, -led_power, color='#3b82f6', linewidth=2, label='LED output (W)')
ax1.axhline(0, color='gray', linewidth=0.5)
ax1.set_ylabel('Power (W)', color='white')
ax1.set_title('Energy Flows', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Night shading
for start in [0, 18, 24+18]:
    end = min(start + 12, 48)
    ax1.axvspan(start, min(end, 5.5), alpha=0.05, color='#6b7280')
ax1.axvspan(18, 24, alpha=0.1, color='#3b82f6', label='Festival')

# Battery level
ax2.set_facecolor('#111827')
ax2.plot(hours, battery_level, color='#22c55e', linewidth=2)
ax2.fill_between(hours, battery_level, alpha=0.15, color='#22c55e')
ax2.axhline(battery_capacity, color='gray', linestyle=':', linewidth=1, label=f'Full ({battery_capacity} Wh)')
ax2.axhline(1, color='#ef4444', linestyle=':', linewidth=1, label='Low warning (1 Wh)')
ax2.set_xlabel('Hours', color='white')
ax2.set_ylabel('Battery (Wh)', color='white')
ax2.set_title('Battery Level', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Add time labels
for h, label in [(6, 'Morning'), (12, 'Noon'), (18, 'Festival\
starts'), (24, 'Midnight'),
                  (30, 'Morning'), (36, 'Noon'), (42, 'Evening')]:
    ax2.annotate(label, xy=(h, -0.5), color='gray', fontsize=7, ha='center')

plt.tight_layout()
plt.show()

# Check if lamp survived the festival
festival_start = battery_level[np.argmin(np.abs(hours - 18))]
festival_end = battery_level[np.argmin(np.abs(hours - 24))]
print(f"Festival lamp performance:")
print(f"  Battery at festival start (6pm): {festival_start:.1f} Wh")
print(f"  Battery at midnight: {festival_end:.1f} Wh")
print(f"  Energy used during festival: {festival_start - festival_end:.1f} Wh")
print(f"  Lamp survived the night: {'YES' if festival_end > 0 else 'NO — went dark!'}")
print()
print(f"  Solar charged: {np.sum(solar_power[:250] * dt * efficiency_charge):.1f} Wh during day 1")
print(f"  Round-trip efficiency: {efficiency_charge * efficiency_discharge * 100:.0f}%")`,
      challenge: 'What if it\'s a cloudy day? Reduce solar power by 60%. Does the lamp still survive the festival? What battery capacity would you need to guarantee 6 hours of light even on the cloudiest day?',
      successHint: 'Battery technology is the bottleneck of the renewable energy transition. Solving storage — making batteries cheaper, denser, longer-lasting, and safer — is arguably the most important engineering challenge of our time.',
    },
    {
      title: 'Sustainable energy — powering festivals and futures',
      concept: `The festival of lights on the Brahmaputra is beautiful — but at scale, it raises questions about sustainability. 10,000 oil lamps release CO₂, consume resources, and create waste. This microcosm mirrors the global energy challenge.

**Sustainable energy** means meeting present needs without compromising future generations. The three pillars:
1. **Efficiency**: use less energy for the same result (LED vs oil lamp)
2. **Renewability**: use sources that replenish naturally (solar, wind, hydro)
3. **Equity**: ensure everyone has access to clean, affordable energy

India's energy transition:
- **Solar**: 70+ GW installed (2024), target 500 GW by 2030
- **Wind**: 45+ GW installed, strong potential in coastal and hill regions
- **Hydro**: Northeast India has ~60% of India's hydropower potential
- **Biomass**: traditional fuel in rural areas, being replaced by LPG and solar

Assam and Northeast India sit at a crossroads: abundant renewable resources (solar, hydro, biomass) but also heavy reliance on fossil fuels and traditional biomass. The festival of lights could be a symbol of this transition — from oil to solar, from combustion to electroluminescence, from consumption to sustainability.`,
      analogy: 'The energy transition is like switching from renting to owning. Fossil fuels are rented energy — you pay every time you use them, and the landlord (resource depletion, pollution) takes a cut. Renewable energy is like buying a house — high upfront cost (solar panels, wind turbines) but then the energy is nearly free forever. The festival can make this choice lamp by lamp.',
      storyConnection: 'The story\'s festival celebrates the river — the Brahmaputra, lifeline of Assam. The river itself is a vast energy resource: its flow represents stored gravitational potential energy that can generate hydropower. The sun that lights the festival day can charge batteries for the festival night. The wind that carries the lamps downstream can turn turbines. The festival, reimagined with sustainable technology, becomes not just a celebration of tradition but a demonstration of the future.',
      checkQuestion: 'If renewable energy is abundant and free, why hasn\'t the world already switched entirely to renewables?',
      checkAnswer: 'Several interconnected challenges: (1) Intermittency — solar and wind don\'t produce when the sun isn\'t shining or wind isn\'t blowing. (2) Storage — batteries are expensive and cannot yet store grid-scale energy cheaply. (3) Infrastructure — existing grids were built for centralised fossil plants, not distributed renewables. (4) Investment — fossil fuel infrastructure represents trillions of dollars of sunk cost. (5) Political economy — fossil fuel industries have economic and political power. (6) Energy density — fossil fuels pack more energy per kg than batteries, critical for transport. The physics works; the barriers are economic, political, and logistical.',
      codeIntro: 'Compare the environmental footprint of a traditional festival vs a solar-powered one.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Festival comparison: 10,000 lamps, one night
num_lamps = 10000
hours = 6  # festival duration

# Traditional: oil lamps
oil_per_lamp_ml = 50
oil_total_litres = num_lamps * oil_per_lamp_ml / 1000
co2_per_litre_oil = 2.5  # kg CO2 per litre of oil burned
oil_co2 = oil_total_litres * co2_per_litre_oil
oil_cost_per_lamp = 8  # rupees (oil + earthen cup)
oil_total_cost = num_lamps * oil_cost_per_lamp
oil_waste_kg = num_lamps * 0.05  # earthen cups, wicks, residue

# Solar-powered: LED + small solar + battery (reusable 5 years)
led_power_w = 1
battery_wh = 10
solar_panel_cost = 80  # per lamp (small panel + LED + battery)
led_energy_kwh = led_power_w * hours / 1000 * num_lamps
# Embodied CO2: manufacturing
manufacturing_co2_per_lamp = 2  # kg CO2 (amortised over 5 years)
solar_co2 = manufacturing_co2_per_lamp * num_lamps / 5  # per festival
solar_cost_per_year = solar_panel_cost * num_lamps / 5  # amortised
solar_waste = 0  # negligible per festival (reusable)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Festival Footprint: {num_lamps:,} Lamps × {hours} Hours', color='white', fontsize=14)

comparisons = [
    ('CO₂ Emissions (kg)', [oil_co2, solar_co2], axes[0,0]),
    ('Cost per Festival (₹)', [oil_total_cost, solar_cost_per_year], axes[0,1]),
    ('Waste Generated (kg)', [oil_waste_kg, solar_waste], axes[1,0]),
    ('Resource Use (litres oil\
or kWh electricity)', [oil_total_litres, led_energy_kwh], axes[1,1]),
]

for title, values, ax in comparisons:
    ax.set_facecolor('#111827')
    labels = ['Traditional\
(oil lamps)', 'Solar-powered\
(LED)']
    bars = ax.bar(labels, values, color=['#f59e0b', '#3b82f6'], alpha=0.8, width=0.5)
    ax.set_title(title, color='white', fontsize=11)
    ax.tick_params(colors='gray')
    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(values)*0.02,
                f'{val:,.0f}', ha='center', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

print("Festival footprint comparison (10,000 lamps, 6 hours):")
print(f"  {'':20s} {'Traditional':>12s} {'Solar LED':>12s} {'Reduction':>10s}")
print(f"  {'CO₂ (kg)':20s} {oil_co2:>12,.0f} {solar_co2:>12,.0f} {(1-solar_co2/oil_co2)*100:>9.0f}%")
print(f"  {'Cost (₹/festival)':20s} {oil_total_cost:>12,.0f} {solar_cost_per_year:>12,.0f} {(1-solar_cost_per_year/oil_total_cost)*100:>9.0f}%")
print(f"  {'Waste (kg)':20s} {oil_waste_kg:>12,.0f} {solar_waste:>12,.0f} {'100':>9s}%")
print()
print("After 5 years, solar LEDs pay for themselves.")
print("After 10 years, they save both money and environment.")
print("The tradition evolves — the spirit of light remains.")`,
      challenge: 'Add a hybrid option: 5,000 traditional oil lamps (for the centre of the festival, preserving tradition) + 5,000 solar LEDs (for the wider display). Calculate the combined footprint. Sometimes the best solution respects both tradition and sustainability.',
      successHint: 'From energy forms to combustion to LEDs to solar to batteries to sustainability — you have traced the complete energy story of a festival lamp. Level 2 goes deeper into circuits, solar physics, and energy policy. The festival of lights is a starting point for understanding humanity\'s biggest challenge: powering civilisation without destroying the planet.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Energy & Light Technology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for energy simulations. Click to start.</p>
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
