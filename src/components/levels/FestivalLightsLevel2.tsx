import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FestivalLightsLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Ohm\'s law review — the foundation of every circuit',
      concept: `Before designing lighting systems, you need to master the relationship that governs all electrical circuits: **Ohm's Law**.

**V = I × R**

- **V** (Voltage, in volts): the "pressure" pushing electrons through the circuit — like water pressure in a pipe
- **I** (Current, in amperes): the "flow rate" of electrons — how many pass a point per second
- **R** (Resistance, in ohms): how much the circuit opposes electron flow — like pipe narrowness

Rearranged:
- I = V / R (more voltage or less resistance = more current)
- R = V / I (measure voltage and current to find resistance)

**Power** adds a fourth relationship: **P = V × I = I²R = V²/R**
- P (Power, in watts): energy consumed per second

For the festival lamp circuit:
- A 3.7V lithium battery driving a 1W LED
- Current: I = P/V = 1/3.7 = 0.27 A (270 mA)
- LED forward resistance (effective): R = V/I = 3.7/0.27 = 13.7 ohms

These simple equations let you design, analyse, and troubleshoot any circuit.`,
      analogy: 'Ohm\'s law is like a water system. Voltage is the water pressure (height of the water tower). Current is the flow rate (litres per second through the pipe). Resistance is the pipe diameter (narrow pipes resist flow). Power is how much useful work the water does when it arrives (turning a waterwheel). Double the pressure, double the flow. Narrow the pipe, reduce the flow. It all connects.',
      storyConnection: 'Every LED floating on the Brahmaputra obeys Ohm\'s law. The battery provides voltage (the push), the LED offers resistance (the opposition), and current flows (the glow). If you wire the lamp wrong — too much current and the LED burns out; too little and it barely glows. Ohm\'s law is the contract between battery and LED: they must agree on voltage, current, and resistance.',
      checkQuestion: 'If you connect two identical LEDs in series (one after the other) to the same battery, what happens to the brightness compared to a single LED?',
      checkAnswer: 'Each LED gets half the voltage (the battery voltage divides across them). With less voltage across each LED, less current flows, and each LED is dimmer. In series, voltage divides but current is the same through both. This is why series Christmas lights all go out when one bulb fails — the circuit is broken. For festival lamps, parallel wiring (each LED gets full battery voltage) is better.',
      codeIntro: 'Explore Ohm\'s law interactively: vary voltage and resistance, observe current and power.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Ohm's law: V = IR, P = VI
voltages = np.linspace(0.1, 12, 100)
resistances = [5, 10, 20, 50, 100]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

colors_r = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

# Current vs Voltage for different resistances
ax1.set_facecolor('#111827')
for R, color in zip(resistances, colors_r):
    I = voltages / R
    ax1.plot(voltages, I * 1000, color=color, linewidth=2, label=f'R = {R} Ω')

ax1.set_xlabel('Voltage (V)', color='white')
ax1.set_ylabel('Current (mA)', color='white')
ax1.set_title('Ohm\'s Law: I = V/R', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Power vs Voltage for different resistances
ax2.set_facecolor('#111827')
for R, color in zip(resistances, colors_r):
    P = voltages**2 / R
    ax2.plot(voltages, P, color=color, linewidth=2, label=f'R = {R} Ω')

ax2.set_xlabel('Voltage (V)', color='white')
ax2.set_ylabel('Power (W)', color='white')
ax2.set_title('Power: P = V²/R', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Festival lamp calculations
print("Festival LED lamp design:")
V_battery = 3.7  # lithium cell
P_led = 1.0  # watts
I_led = P_led / V_battery
R_effective = V_battery / I_led
print(f"  Battery: {V_battery} V (lithium-ion)")
print(f"  LED power: {P_led} W")
print(f"  Current: {I_led*1000:.0f} mA")
print(f"  Effective resistance: {R_effective:.1f} Ω")
print()
print("If we add a 10Ω resistor (current limiter):")
R_total = R_effective + 10
I_new = V_battery / R_total
P_led_new = I_new * (V_battery - I_new * 10)  # voltage across LED
print(f"  New current: {I_new*1000:.0f} mA")
print(f"  LED power: {P_led_new:.2f} W (dimmer but safer)")
print(f"  Resistor wastes: {I_new**2 * 10:.2f} W as heat")`,
      challenge: 'Design a circuit with 3 LEDs in parallel, each drawing 20 mA at 3.2V, powered by a 5V USB source. What value resistor do you need for each LED? What is the total current draw?',
      successHint: 'Ohm\'s law is not just a formula — it is the language of electrical engineering. Every circuit, from a festival lamp to a supercomputer, is governed by V = IR. Master this and you can understand any electrical system.',
    },
    {
      title: 'Circuits for lighting — series, parallel, and real-world design',
      concept: `Festival lighting requires connecting multiple LEDs. How you connect them determines brightness, reliability, and efficiency.

**Series circuit** (LEDs in a chain):
- Same current flows through all LEDs
- Voltages add up: V_total = V₁ + V₂ + V₃
- If one LED fails (open), ALL go dark
- Lower current draw, higher voltage needed

**Parallel circuit** (LEDs side by side):
- Each LED gets full voltage
- Currents add up: I_total = I₁ + I₂ + I₃
- If one LED fails, others keep working
- Higher current draw, same voltage

**Series-parallel** (real-world approach):
- Groups of 2-3 LEDs in series, then groups in parallel
- Balances voltage, current, and reliability
- Used in LED strips, car headlights, festival decorations

For the floating lamp, a single LED per lamp in parallel with the battery is simplest. For a string of lights along the riverbank, series-parallel is best: groups of 3 LEDs in series (using ~10V), with many groups in parallel.`,
      analogy: 'Series is like a single-lane road — all traffic goes through every point, and one accident blocks everyone. Parallel is like a multi-lane highway — each lane handles independent traffic, and one blocked lane doesn\'t stop the others. Real lighting design (series-parallel) is like a highway with multiple lanes that each have multiple toll booths — balancing flow and redundancy.',
      storyConnection: 'Imagine decorating both banks of the Brahmaputra for the festival. You need hundreds of lights along each bank, plus thousands of floating lamps on the water. The bankside lights would be series-parallel strings (efficient, easy to install). The floating lamps would each be independent parallel circuits (one lamp sinking doesn\'t affect others). Two different circuit topologies for two different needs — that\'s real engineering.',
      checkQuestion: 'LED Christmas lights used to be wired in series, and now most are wired in series-parallel. What practical problem did the old design cause?',
      checkAnswer: 'In pure series, if one bulb burns out and creates an open circuit, ALL lights go out. You then had to test each bulb individually to find the dead one — sometimes checking 50+ bulbs. Worse, when one bulb fails in series, the voltage across the remaining bulbs increases, accelerating their failure (domino effect). Series-parallel limits failure to one group of 3-5 LEDs, and the rest stay lit.',
      codeIntro: 'Simulate and compare series, parallel, and series-parallel circuits.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# LED properties
V_led = 3.2   # forward voltage (V)
I_led = 0.02  # operating current (A) = 20 mA
P_led = V_led * I_led  # 0.064 W per LED
num_leds = 12

# Circuit configurations
configs = {
    'All Series': {
        'V_supply': V_led * num_leds,  # need high voltage
        'I_total': I_led,
        'survive_one_fail': 0,  # all go out
    },
    'All Parallel': {
        'V_supply': V_led,
        'I_total': I_led * num_leds,  # high current
        'survive_one_fail': num_leds - 1,
    },
    'Series-Parallel\\n(3s × 4p)': {
        'V_supply': V_led * 3,  # 3 in series
        'I_total': I_led * 4,  # 4 parallel groups
        'survive_one_fail': num_leds - 3,  # one group fails
    },
}

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Circuit Configurations for 12 LEDs', color='white', fontsize=14)

metrics = ['V_supply', 'I_total', 'survive_one_fail']
titles = ['Supply Voltage Required (V)', 'Total Current Draw (A)', 'LEDs Surviving One Failure']
colors_m = ['#3b82f6', '#f59e0b', '#22c55e']

for ax, metric, title, color in zip(axes, metrics, titles, colors_m):
    ax.set_facecolor('#111827')
    names = list(configs.keys())
    values = [configs[n][metric] for n in names]
    bars = ax.bar(names, values, color=color, alpha=0.8, width=0.5)
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray')
    for bar, val in zip(bars, values):
        label = f'{val:.1f}' if isinstance(val, float) else str(val)
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(values)*0.03,
                label, ha='center', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

# Detailed analysis
print("12-LED Festival Light String Analysis:")
print(f"{'':25s} {'Series':>10s} {'Parallel':>10s} {'3s×4p':>10s}")
print(f"{'Supply voltage (V)':25s} {V_led*12:>10.1f} {V_led:>10.1f} {V_led*3:>10.1f}")
print(f"{'Total current (mA)':25s} {I_led*1000:>10.0f} {I_led*12*1000:>10.0f} {I_led*4*1000:>10.0f}")
print(f"{'Total power (W)':25s} {P_led*12:>10.2f} {P_led*12:>10.2f} {P_led*12:>10.2f}")
print(f"{'LEDs after 1 failure':25s} {'0':>10s} {'11':>10s} {'9':>10s}")
print(f"{'Practical?':25s} {'No (38V!)':>10s} {'Yes':>10s} {'Best':>10s}")
print()
print("Winner: Series-Parallel (3 in series × 4 parallel)")
print("  - Moderate voltage (9.6V — USB-compatible)")
print("  - Moderate current (80mA — safe for small wires)")
print("  - Good fault tolerance (only 3 LEDs fail at once)")`,
      challenge: 'Design a 50-LED riverbank installation using series-parallel. Find the optimal grouping (how many in series × how many in parallel) for a 12V power supply. Each LED needs 3.2V at 20mA.',
      successHint: 'Circuit topology is the first decision in any lighting design. Understanding series vs parallel is the foundation for designing everything from festival lights to building wiring to power grids.',
    },
    {
      title: 'Solar panel physics — semiconductors and the photovoltaic effect',
      concept: `Level 1 covered what solar panels do. Now let's understand **how** they work at the atomic level.

Silicon has 4 valence electrons. In pure silicon, every electron is locked in bonds — no free electrons, no current. To make a solar cell, we create two layers:

**N-type silicon**: doped with phosphorus (5 valence electrons). One extra electron per atom, free to move.
**P-type silicon**: doped with boron (3 valence electrons). One missing electron per atom (a "hole").

At the **P-N junction** (where they meet), electrons from the N-side fill holes on the P-side, creating an **electric field** (depletion zone).

When a **photon** hits the junction:
1. Its energy frees an electron from its bond (creating an electron-hole pair)
2. The electric field pushes the electron toward the N-side and the hole toward the P-side
3. If connected to an external circuit, electrons flow from N → circuit → P — that flow is electricity

The photon must have enough energy to free the electron: **E = hf ≥ bandgap energy**. For silicon, the bandgap is 1.1 eV, corresponding to wavelengths shorter than ~1,100 nm (near-infrared and shorter).

Photons with too little energy (infrared) pass through. Photons with too much energy (UV) free the electron but the excess becomes heat. This is why even perfect silicon cells max out at ~33% efficiency (the **Shockley-Queisser limit**).`,
      analogy: 'The P-N junction is like a hill with a one-way gate at the top. Electrons on the N-side are at the bottom. Photons act like kicks that launch electrons up the hill. The one-way gate (the electric field) only lets them pass in one direction — through the external circuit and back around. No photon kicks = no electrons crossing = no electricity. The gate ensures they go through the circuit (doing useful work) rather than just falling back.',
      storyConnection: 'Each solar-powered festival lamp has a small solar cell converting the Brahmaputra-reflected sunlight into electricity all day. At the atomic level, billions of photons are kicking billions of electrons across billions of P-N junctions, each electron adding a tiny increment to the battery\'s charge. By sunset, enough electrons have been moved to power the LED through the night.',
      checkQuestion: 'If a solar cell\'s bandgap is 1.1 eV and a red photon has 1.8 eV, what happens to the extra 0.7 eV?',
      checkAnswer: 'The extra 0.7 eV becomes heat (phonons — lattice vibrations in the crystal). This "thermalisation loss" is one of the two main reasons solar cells can\'t reach 100% efficiency. The other is that photons below the bandgap (with less than 1.1 eV) pass right through without being absorbed. Together, these two losses account for the ~33% theoretical limit. Multi-junction cells stack different bandgaps to capture more of the spectrum — reaching 47% in labs.',
      codeIntro: 'Model how a solar cell\'s response varies across the light spectrum and calculate theoretical efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Solar spectrum (simplified AM1.5G)
wavelengths = np.linspace(280, 2500, 500)  # nm
# Approximate solar spectral irradiance (W/m²/nm)
solar_spectrum = 1.5 * np.exp(-((wavelengths - 500)**2) / (2 * 200**2)) + \
                 0.8 * np.exp(-((wavelengths - 800)**2) / (2 * 300**2))

# Silicon bandgap
bandgap_eV = 1.1
h = 6.626e-34; c = 3e8; eV = 1.602e-19
bandgap_wavelength = h * c / (bandgap_eV * eV) * 1e9  # ~1127 nm

# Energy of each photon
photon_energy_eV = h * c / (wavelengths * 1e-9) / eV

# Useful energy per absorbed photon (capped at bandgap)
useful_energy = np.where(photon_energy_eV >= bandgap_eV, bandgap_eV, 0)
wasted_above = np.where(photon_energy_eV >= bandgap_eV, photon_energy_eV - bandgap_eV, 0)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Solar spectrum with absorption regions
ax1.set_facecolor('#111827')
ax1.fill_between(wavelengths, solar_spectrum, where=wavelengths <= bandgap_wavelength,
                 alpha=0.4, color='#22c55e', label='Absorbed (above bandgap)')
ax1.fill_between(wavelengths, solar_spectrum, where=wavelengths > bandgap_wavelength,
                 alpha=0.4, color='#ef4444', label='Transmitted (below bandgap)')
ax1.plot(wavelengths, solar_spectrum, color='#f59e0b', linewidth=1.5, label='Solar spectrum')
ax1.axvline(bandgap_wavelength, color='white', linestyle='--', linewidth=1.5)
ax1.annotate(f'Si bandgap\\n{bandgap_wavelength:.0f} nm\\n({bandgap_eV} eV)',
             xy=(bandgap_wavelength, 1.2), color='white', fontsize=9, fontweight='bold')
ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Spectral irradiance (arb.)', color='white')
ax1.set_title('Solar Spectrum & Silicon Absorption', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Visible range
ax1.axvspan(380, 750, alpha=0.05, color='white')
ax1.annotate('Visible', xy=(565, 0.1), color='gray', fontsize=8, ha='center')

# Efficiency breakdown by photon energy
ax2.set_facecolor('#111827')
absorbed = solar_spectrum * (photon_energy_eV >= bandgap_eV)
useful_fraction = absorbed * (bandgap_eV / np.maximum(photon_energy_eV, 0.01))
thermalisation = absorbed - useful_fraction
not_absorbed = solar_spectrum * (photon_energy_eV < bandgap_eV)

ax2.fill_between(wavelengths, 0, useful_fraction, color='#22c55e', alpha=0.7, label='Electrical output')
ax2.fill_between(wavelengths, useful_fraction, useful_fraction + thermalisation,
                 color='#f59e0b', alpha=0.7, label='Thermalisation loss')
ax2.fill_between(wavelengths, useful_fraction + thermalisation,
                 useful_fraction + thermalisation + not_absorbed,
                 color='#ef4444', alpha=0.7, label='Not absorbed')
ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Energy (arb.)', color='white')
ax2.set_title('Where Does the Solar Energy Go?', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Calculate approximate efficiency
total_solar = np.trapz(solar_spectrum, wavelengths)
total_useful = np.trapz(useful_fraction, wavelengths)
total_thermal = np.trapz(thermalisation, wavelengths)
total_lost = np.trapz(not_absorbed, wavelengths)
efficiency = total_useful / total_solar * 100

print(f"Silicon solar cell energy budget:")
print(f"  Electrical output: {total_useful/total_solar*100:.1f}%")
print(f"  Thermalisation (excess energy → heat): {total_thermal/total_solar*100:.1f}%")
print(f"  Not absorbed (below bandgap): {total_lost/total_solar*100:.1f}%")
print(f"  Theoretical max efficiency: ~33% (Shockley-Queisser)")
print(f"  Real-world best silicon: ~26.7% (lab), ~22% (commercial)")`,
      challenge: 'Try different bandgap values: GaAs (1.42 eV), CdTe (1.5 eV), perovskite (1.55 eV). Which bandgap gives the highest theoretical efficiency? Why is 1.34 eV considered the "optimal" bandgap?',
      successHint: 'Understanding the photovoltaic effect at this level is what separates someone who uses solar panels from someone who can design them. The Shockley-Queisser limit is one of the most important results in renewable energy physics.',
    },
    {
      title: 'Energy storage — beyond batteries',
      concept: `Batteries are the most common energy storage for small devices, but the festival-scale and grid-scale challenge requires thinking bigger. Energy storage technologies span many orders of magnitude:

**Electrochemical** (batteries):
- Lithium-ion: 250 Wh/kg, 500-2000 cycles, dominant in electronics/EVs
- Sodium-ion: cheaper, slightly lower density, emerging for grid storage
- Flow batteries: liquid electrolytes in tanks, scalable to MW, long-duration

**Mechanical**:
- Pumped hydro: pump water uphill when energy is cheap, release through turbines when needed (90% of global grid storage)
- Compressed air: pump air into underground caverns, release through turbines
- Flywheels: spin a heavy rotor, extract kinetic energy when needed

**Thermal**:
- Molten salt: store heat from solar concentrators, generate steam at night
- Ice storage: make ice at night (cheap electricity), melt for cooling during the day

**Chemical**:
- Hydrogen: electrolyse water → H₂, burn or fuel-cell later (round-trip ~30-40%)
- Synthetic fuels: combine H₂ + CO₂ into liquid fuels (very low efficiency but high energy density)

The choice depends on **duration** (seconds to seasons), **scale** (mW to GW), **cost** ($/kWh), and **location**.`,
      analogy: 'Energy storage technologies are like different types of containers. A battery is a thermos — portable, quick to pour, but small. Pumped hydro is a swimming pool — massive capacity but you need a hill and you cannot carry it. Hydrogen is a pressurised gas canister — lots of energy inside but wasteful to fill and empty. Each container fits different needs.',
      storyConnection: 'The Brahmaputra itself is a massive energy storage system. Water evaporated by the sun falls as rain in the Himalayas (solar energy → gravitational potential energy). It flows downstream, converting potential to kinetic energy. Dams capture this at ~85% efficiency. The festival\'s river is literally a giant, solar-charged battery. Northeast India\'s untapped hydro potential could power the region many times over.',
      checkQuestion: 'Why is pumped hydro storage (90% of global grid storage) not built everywhere? What limits it?',
      checkAnswer: 'Pumped hydro requires very specific geography: two reservoirs at different elevations, connected by pipes and turbines. You need a hill or mountain, large amounts of water, and suitable terrain for reservoirs. It also requires significant land area, can disrupt river ecosystems, and takes years to build. Flat regions like the Netherlands or Bangladesh cannot use it at all. This is why battery and other storage technologies are critical for universal energy storage.',
      codeIntro: 'Compare energy storage technologies across key metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Energy storage technologies
techs = {
    'Li-ion\\nbattery': {'density': 250, 'efficiency': 92, 'cycles': 2000, 'cost': 150, 'duration': 4},
    'Pumped\\nhydro': {'density': 1, 'efficiency': 80, 'cycles': 50000, 'cost': 20, 'duration': 12},
    'Flow\\nbattery': {'density': 30, 'efficiency': 75, 'cycles': 15000, 'cost': 80, 'duration': 10},
    'Compressed\\nair': {'density': 5, 'efficiency': 65, 'cycles': 30000, 'cost': 50, 'duration': 24},
    'Hydrogen': {'density': 400, 'efficiency': 35, 'cycles': 100000, 'cost': 300, 'duration': 168},
    'Molten\\nsalt': {'density': 50, 'efficiency': 70, 'cycles': 30000, 'cost': 25, 'duration': 15},
}

fig, axes = plt.subplots(2, 3, figsize=(15, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Energy Storage Technologies Compared', color='white', fontsize=14)

metrics = [
    ('density', 'Energy Density (Wh/kg)', '#22c55e'),
    ('efficiency', 'Round-trip Efficiency (%)', '#3b82f6'),
    ('cycles', 'Cycle Life', '#f59e0b'),
    ('cost', 'Cost ($/kWh)', '#ef4444'),
    ('duration', 'Discharge Duration (hours)', '#a855f7'),
]

names = list(techs.keys())
colors_tech = ['#3b82f6', '#22c55e', '#f59e0b', '#94a3b8', '#ef4444', '#a855f7']

for ax, (metric, title, color) in zip(axes.flat[:5], metrics):
    ax.set_facecolor('#111827')
    values = [techs[n][metric] for n in names]
    bars = ax.bar(names, values, color=colors_tech, alpha=0.8)
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=7)
    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(values)*0.02,
                f'{val:,}', ha='center', color='white', fontsize=7)

# Scatter: efficiency vs cost (the key trade-off)
ax6 = axes[1, 2]
ax6.set_facecolor('#111827')
for name, color in zip(names, colors_tech):
    t = techs[name]
    ax6.scatter(t['cost'], t['efficiency'], color=color, s=t['duration']*20, alpha=0.8,
                edgecolors='white', linewidth=0.5)
    ax6.annotate(name.replace('\\n', ' '), xy=(t['cost'], t['efficiency']),
                 xytext=(t['cost']+5, t['efficiency']+1), color=color, fontsize=7)
ax6.set_xlabel('Cost ($/kWh)', color='white')
ax6.set_ylabel('Efficiency (%)', color='white')
ax6.set_title('Efficiency vs Cost (size = duration)', color='white', fontsize=10)
ax6.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Best technology depends on the use case:")
print("  Festival lamps (4-6 hrs, portable): Li-ion battery")
print("  Grid overnight (8-12 hrs, stationary): Pumped hydro or flow battery")
print("  Seasonal storage (weeks): Hydrogen or compressed air")
print("  Solar thermal plants: Molten salt")
print()
print("No single technology wins on all metrics.")
print("The future grid will use MANY storage types together.")`,
      challenge: 'Calculate: if you wanted to store enough energy to power the entire festival (10,000 1W lamps for 6 hours = 60 kWh) using each technology, how much would each cost? Which is cheapest?',
      successHint: 'Energy storage is often called the "holy grail" of the clean energy transition. The technology you choose depends on scale, duration, location, and budget — there is no one-size-fits-all solution.',
    },
    {
      title: 'Smart lighting systems — intelligence in illumination',
      concept: `Modern lighting goes far beyond "switch on, switch off." **Smart lighting** uses sensors, microcontrollers, and algorithms to optimise energy use, comfort, and safety.

Components of a smart lighting system:
- **Sensors**: ambient light (photoresistor), motion (PIR), presence (occupancy)
- **Microcontroller**: Arduino, ESP32, or Raspberry Pi — the "brain"
- **Communication**: WiFi, Bluetooth, Zigbee — lets lights talk to each other and to a central system
- **Actuators**: LED drivers that can dim, change colour, or switch on/off
- **Algorithm**: decision logic — when to turn on, how bright, what colour

Smart lighting saves energy by:
- **Dimming** when full brightness isn't needed (daylight harvesting)
- **Turning off** when no one is present (occupancy sensing)
- **Scheduling** based on time of day and usage patterns
- **Adapting** colour temperature to circadian rhythms (warm at night, cool in morning)

A smart festival: sensors could detect approaching boats, ripple patterns on the water, or crowd density along the bank — adjusting lamp brightness, colour, and patterns in real time. The Brahmaputra becomes an interactive light display.`,
      analogy: 'Traditional lighting is like a tap that is either full on or full off. Smart lighting is like a shower with a thermostat, a flow sensor, and a timer — it adjusts water temperature and pressure based on who is using it, when, and how much hot water is left. The result: more comfort with less waste.',
      storyConnection: 'Imagine the floating lamps with tiny microcontrollers. As they drift downstream, GPS tracks their position. When two lamps get close, they synchronise their flicker patterns. When a lamp nears the riverbank, it brightens so spectators can see. When the festival ends, all lamps gradually dim together. The technology exists today — it is used in drone light shows, which can coordinate thousands of flying lights in real time.',
      checkQuestion: 'A building installs smart lighting that dims to 50% when daylight provides adequate ambient light. If the building\'s lights use 100 kW normally and daylight is adequate for 6 of 12 operating hours, how much energy is saved per day?',
      checkAnswer: 'During the 6 daylit hours, lights dim to 50%: 100 kW × 0.5 × 6 h = 300 kWh consumed (vs 600 kWh at full). During the 6 dark hours, full power: 100 kW × 6 h = 600 kWh. Total: 900 kWh vs 1,200 kWh without dimming. Savings: 300 kWh/day (25%). Over a year: 109,500 kWh saved. At ₹8/kWh, that is ₹876,000 saved annually — and the system pays for itself in months.',
      codeIntro: 'Simulate a smart lighting controller that adapts to ambient light and occupancy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 24-hour simulation
minutes = np.arange(0, 24 * 60)
hours = minutes / 60

# Ambient daylight (lux)
sunrise, sunset = 6, 18.5
daylight = np.where(
    (hours >= sunrise) & (hours <= sunset),
    500 * np.sin(np.pi * (hours - sunrise) / (sunset - sunrise)),
    0
) + np.random.randn(len(minutes)) * 10

# Occupancy (probability of someone being present)
occupancy_prob = np.zeros(len(minutes))
occupancy_prob[(hours >= 6) & (hours <= 9)] = 0.8    # morning
occupancy_prob[(hours >= 9) & (hours <= 12)] = 0.6   # mid-morning
occupancy_prob[(hours >= 12) & (hours <= 14)] = 0.4  # lunch
occupancy_prob[(hours >= 14) & (hours <= 18)] = 0.7  # afternoon
occupancy_prob[(hours >= 18) & (hours <= 22)] = 0.9  # evening
occupancy = (np.random.rand(len(minutes)) < occupancy_prob).astype(float)

# Smart lighting algorithm
target_lux = 300  # desired illumination level
max_power = 100   # W at full brightness

# Traditional: on 6am-10pm, always 100%
traditional = np.where((hours >= 6) & (hours <= 22), max_power, 0)

# Smart: adjust based on daylight and occupancy
smart = np.zeros(len(minutes))
for i in range(len(minutes)):
    if occupancy[i] > 0:
        # How much artificial light is needed?
        deficit = max(0, target_lux - max(0, daylight[i]))
        smart[i] = max_power * (deficit / target_lux) * 0.8  # 80% max for efficiency
    else:
        smart[i] = max_power * 0.05  # 5% standby (safety lighting)

fig, axes = plt.subplots(4, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Smart Lighting vs Traditional — 24 Hours', color='white', fontsize=14)

# Daylight
ax1 = axes[0]
ax1.set_facecolor('#111827')
ax1.fill_between(hours, daylight, alpha=0.3, color='#f59e0b')
ax1.plot(hours, daylight, color='#f59e0b', linewidth=1)
ax1.axhline(target_lux, color='gray', linestyle=':', linewidth=1, label=f'Target: {target_lux} lux')
ax1.set_ylabel('Daylight (lux)', color='white')
ax1.set_title('Ambient Daylight', color='white', fontsize=10)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Occupancy
ax2 = axes[1]
ax2.set_facecolor('#111827')
ax2.fill_between(hours, occupancy, alpha=0.3, color='#a855f7')
ax2.set_ylabel('Occupied', color='white')
ax2.set_title('Room Occupancy', color='white', fontsize=10)
ax2.set_yticks([0, 1])
ax2.set_yticklabels(['Empty', 'Occupied'], color='white')
ax2.tick_params(colors='gray')

# Power comparison
ax3 = axes[2]
ax3.set_facecolor('#111827')
ax3.plot(hours, traditional, color='#ef4444', linewidth=1.5, alpha=0.7, label='Traditional')
ax3.plot(hours, smart, color='#22c55e', linewidth=1.5, label='Smart')
ax3.set_ylabel('Power (W)', color='white')
ax3.set_title('Power Consumption', color='white', fontsize=10)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Cumulative energy
dt_h = 1 / 60
cum_trad = np.cumsum(traditional * dt_h) / 1000
cum_smart = np.cumsum(smart * dt_h) / 1000
ax4 = axes[3]
ax4.set_facecolor('#111827')
ax4.plot(hours, cum_trad, color='#ef4444', linewidth=2, label=f'Traditional: {cum_trad[-1]:.2f} kWh')
ax4.plot(hours, cum_smart, color='#22c55e', linewidth=2, label=f'Smart: {cum_smart[-1]:.2f} kWh')
ax4.set_xlabel('Hour of day', color='white')
ax4.set_ylabel('Cumulative (kWh)', color='white')
ax4.set_title('Cumulative Energy Use', color='white', fontsize=10)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

savings = (1 - cum_smart[-1] / cum_trad[-1]) * 100
print(f"Daily energy comparison:")
print(f"  Traditional: {cum_trad[-1]:.2f} kWh")
print(f"  Smart: {cum_smart[-1]:.2f} kWh")
print(f"  Savings: {savings:.0f}%")
print(f"  Annual savings: {(cum_trad[-1] - cum_smart[-1]) * 365:.0f} kWh")
print(f"  At ₹8/kWh: ₹{(cum_trad[-1] - cum_smart[-1]) * 365 * 8:,.0f}/year")`,
      challenge: 'Add a "festival mode" that overrides the algorithm between 18:00-24:00: all lights at 100% in warm white (3000K). Recalculate the daily energy use. How much does festival mode cost in energy?',
      successHint: 'Smart lighting is a $30+ billion global market. The skills behind it — sensor integration, control algorithms, energy optimisation — are the same skills used in smart buildings, autonomous vehicles, and industrial automation.',
    },
    {
      title: 'Energy policy and access — who gets to turn on the light?',
      concept: `Technology alone doesn't solve energy problems. **Energy policy** — the rules, incentives, and infrastructure decisions that governments make — determines who benefits from energy technology and who doesn't.

India's energy landscape:
- **770 million** people gained electricity access between 2000-2019 (one of history's greatest infrastructure achievements)
- But **access ≠ reliability**: many rural areas get only 12-16 hours of power daily
- **Energy poverty**: households spending >10% of income on energy, or unable to afford basic lighting/cooking/heating
- **Last-mile challenge**: remote villages in Northeast India, islands, hill stations are expensive to connect to the grid

Policy tools:
- **Subsidies**: reduce the cost of solar panels, LEDs, and clean cooking fuels
- **Feed-in tariffs**: pay households for solar electricity they export to the grid
- **Microgrids**: small, local power systems for remote communities
- **Standards**: minimum efficiency requirements for appliances (BEE star ratings)

The Northeast India challenge: dense forests, steep terrain, low population density, high rainfall. Running power lines is expensive. **Decentralised solar + battery** may be more practical than grid extension for many communities. The festival's floating lamps, reimagined as solar-powered, are a metaphor for decentralised energy: each lamp is its own power system, independent of any grid.`,
      analogy: 'Energy policy is like traffic rules. Technology gives you cars (solar panels, batteries, LEDs). But without roads (grid infrastructure), traffic lights (regulations), and driving tests (standards), cars cause chaos. Good policy creates a system where the technology benefits everyone fairly, not just those who can afford the latest model.',
      storyConnection: 'The festival of lights is, at its heart, about community — everyone contributes a lamp, and the collective glow is greater than any individual light. Energy access works the same way. A microgrid in a remote Assam village is a shared resource: solar panels on a community building, batteries in a central location, electricity distributed to each home. The festival\'s communal spirit maps perfectly onto the communal energy model.',
      checkQuestion: 'India has installed 70+ GW of solar capacity, but solar accounts for only ~7% of actual electricity generation. Why the gap between installed capacity and generation?',
      checkAnswer: 'Three main reasons: (1) Capacity factor — solar panels generate electricity only during daylight hours, so a 1 GW solar plant produces only ~0.2 GW on average (20% capacity factor). (2) Curtailment — sometimes solar produces more than the grid can absorb, and excess is wasted. (3) Intermittency — cloudy days, monsoon season, and dust reduce output. Installed capacity is the theoretical maximum; actual generation depends on weather, storage, and grid capacity. This is why energy storage and grid modernisation are as important as building more panels.',
      codeIntro: 'Model energy access and the economics of grid extension vs decentralised solar for remote communities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cost model: grid extension vs solar microgrid
# For villages at various distances from the nearest grid connection

distances_km = np.linspace(0, 100, 200)

# Grid extension cost
grid_cost_per_km = 800000  # ₹ per km of power line
grid_fixed_cost = 500000   # transformer, metering
grid_total = grid_fixed_cost + grid_cost_per_km * distances_km
# Ongoing cost: ₹3/kWh grid electricity
grid_annual_per_household = 3 * 2 * 365  # 2 kWh/day average use
num_households = 50  # typical village

# Solar microgrid cost
solar_fixed = 3000000  # ₹ for 10 kW system + batteries for 50 homes
solar_per_km = 0  # no distance dependency
solar_total = np.full_like(distances_km, solar_fixed)
# Ongoing cost: minimal (maintenance only)
solar_annual_per_household = 1 * 2 * 365  # ₹1/kWh equivalent

# Break-even: when is solar cheaper over 10 years?
years = 10
grid_10yr = grid_total + grid_annual_per_household * num_households * years
solar_10yr = solar_total + solar_annual_per_household * num_households * years

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Cost vs distance
ax1.set_facecolor('#111827')
ax1.plot(distances_km, grid_10yr / 100000, color='#ef4444', linewidth=2, label='Grid extension (10-yr)')
ax1.plot(distances_km, solar_10yr / 100000, color='#22c55e', linewidth=2, label='Solar microgrid (10-yr)')

# Break-even point
breakeven_idx = np.argmin(np.abs(grid_10yr - solar_10yr))
breakeven_dist = distances_km[breakeven_idx]
ax1.axvline(breakeven_dist, color='#f59e0b', linestyle='--', linewidth=1.5)
ax1.annotate(f'Break-even:\\n{breakeven_dist:.0f} km', xy=(breakeven_dist, solar_10yr[breakeven_idx]/100000),
             xytext=(breakeven_dist + 10, solar_10yr[breakeven_idx]/100000 + 50),
             color='#f59e0b', fontsize=10, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax1.set_xlabel('Distance from grid (km)', color='white')
ax1.set_ylabel('10-year cost (₹ lakhs)', color='white')
ax1.set_title('Grid Extension vs Solar Microgrid', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Energy access metrics for NE India
ax2.set_facecolor('#111827')
states = ['Assam', 'Meghalaya', 'Nagaland', 'Mizoram', 'Manipur', 'Tripura', 'Arunachal\\nPradesh', 'Sikkim']
electrification = [97, 92, 85, 88, 82, 95, 78, 99]
reliability_hours = [18, 14, 12, 15, 11, 16, 10, 20]

x = np.arange(len(states))
width = 0.35
bars1 = ax2.bar(x - width/2, electrification, width, color='#3b82f6', alpha=0.8, label='Electrification (%)')
bars2 = ax2.bar(x + width/2, [h/24*100 for h in reliability_hours], width, color='#f59e0b', alpha=0.8, label='Reliability (% of 24h)')

ax2.set_xticks(x)
ax2.set_xticklabels(states, fontsize=7)
ax2.set_ylabel('Percentage', color='white')
ax2.set_title('NE India: Access vs Reliability', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Key findings:")
print(f"  Grid extension break-even: {breakeven_dist:.0f} km")
print(f"  Villages beyond {breakeven_dist:.0f} km: solar microgrid is cheaper")
print()
print("NE India energy access:")
for state, elec, rel in zip(states, electrification, reliability_hours):
    gap = elec - (rel/24*100)
    print(f"  {state.replace(chr(10),' '):18s}: {elec}% connected, {rel}h/day reliable (gap: {gap:.0f}%)")
print()
print("The gap between 'connected' and 'reliable' is the real challenge.")
print("A solar microgrid can provide 24/7 power to a village")
print("that is 'connected' but only gets 10-12 hours of grid power.")`,
      challenge: 'Add a third option: a hybrid system (small solar + grid connection). The grid provides backup when solar is insufficient. Model the cost assuming the grid line is subsidised at 50%. At what distance does each option win?',
      successHint: 'From Ohm\'s law to energy policy — you have traced the complete engineering chain of lighting. Understanding both the physics and the policy is essential for anyone who wants to bring sustainable energy to the communities that need it most. The festival of lights is both a tradition and a blueprint for energy equity.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Energy Engineering</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for energy engineering simulations. Click to start.</p>
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
