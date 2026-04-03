import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FireflyBurnLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The luciferin-luciferase reaction',
      concept: `Bioluminescence is light produced by a chemical reaction inside a living organism. In fireflies, the reaction involves two key molecules: **luciferin** (the substrate, or "fuel") and **luciferase** (the enzyme, or "catalyst"). The reaction is: luciferin + ATP + O2 -> (luciferase catalyst) -> oxyluciferin* + AMP + PPi + CO2 -> oxyluciferin + LIGHT.

The asterisk (*) indicates an electronically excited state. The oxyluciferin molecule is created with its electrons in a higher energy orbital. When these electrons drop back to the ground state, they release the excess energy as a photon — a particle of visible light. The wavelength (color) of the emitted light depends on the energy gap between the excited state and the ground state: E = hc/lambda, where h is Planck's constant, c is the speed of light, and lambda is the wavelength.

For fireflies, the emitted light peaks at 550-570 nm (yellow-green), corresponding to a photon energy of about 2.2 eV or 3.5 x 10^-19 joules. The reaction requires ATP (the cell's energy currency), which means bioluminescence is metabolically costly — the firefly is literally burning chemical energy to produce light. However, the conversion efficiency is extraordinary: up to 41% of the chemical energy becomes light (the rest becomes heat). By comparison, an incandescent light bulb converts only 2-5% of electrical energy to light.`,
      analogy: 'Think of the luciferin molecule as a compressed spring (stored chemical energy). The luciferase enzyme is the trigger that releases the spring. When the spring snaps open (luciferin is oxidized), it vibrates at a specific frequency (the excited state). As the vibration dies down, it emits a sound (the photon). The "pitch" of the sound (color of light) depends on how tightly the spring was compressed (the energy gap).',
      storyConnection: 'In "The Fireflies That Don\'t Burn," children marvel at how fireflies produce light without heat. The story captures the essential mystery: fire produces light AND heat (wasting most energy as thermal radiation), but fireflies produce light with almost no heat. This "cold light" is not magic — it is chemistry operating at near-maximum theoretical efficiency.',
      checkQuestion: 'Firefly light peaks at 560 nm. Calculate the energy of one photon at this wavelength. If the luciferin-luciferase reaction releases 4.0 eV of chemical energy per molecule and the quantum yield is 41%, how much energy becomes light vs heat?',
      checkAnswer: 'Photon energy: E = hc/lambda = (6.626e-34 * 3e8) / (560e-9) = 3.55e-19 J = 2.22 eV. Light energy per reaction: 4.0 * 0.41 = 1.64 eV. Heat energy: 4.0 - 1.64 = 2.36 eV. Wait — the quantum yield of 41% means 41% of reactions produce a photon (each at 2.22 eV). So: light = 0.41 * 2.22 = 0.91 eV average. Heat = 4.0 - 0.91 = 3.09 eV. The efficiency is 0.91/4.0 = 23% (energy efficiency), while the quantum yield (fraction of reactions producing photons) is 41%.',
      codeIntro: 'Model the luciferin-luciferase reaction kinetics and compare bioluminescence efficiency to artificial light sources.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Luciferin-Luciferase Bioluminescence ---

# Physical constants
h = 6.626e-34      # Planck's constant (J·s)
c = 3e8             # speed of light (m/s)
eV = 1.602e-19      # electron volt in joules

# Firefly emission spectrum (approximate Gaussian)
wavelengths = np.linspace(400, 750, 300)  # nm
peak_wavelength = 560  # nm (yellow-green)
spectral_width = 40    # nm

emission_spectrum = np.exp(-0.5 * ((wavelengths - peak_wavelength) / spectral_width)**2)
emission_spectrum /= emission_spectrum.max()

# Photon energy at each wavelength
photon_energy_eV = (h * c) / (wavelengths * 1e-9) / eV

# Efficiency comparison: different light sources
light_sources = {
    'Firefly (bioluminescence)': {'efficiency': 0.41, 'type': 'bio', 'color': '#22c55e'},
    'LED (white)':               {'efficiency': 0.30, 'type': 'elec', 'color': '#3b82f6'},
    'Fluorescent tube':          {'efficiency': 0.15, 'type': 'elec', 'color': '#a855f7'},
    'Incandescent bulb':         {'efficiency': 0.025, 'type': 'elec', 'color': '#f59e0b'},
    'Candle flame':              {'efficiency': 0.01,  'type': 'chem', 'color': '#ef4444'},
    'Chemiluminescent stick':    {'efficiency': 0.05,  'type': 'chem', 'color': '#ec4899'},
}

# Reaction kinetics: Michaelis-Menten
# rate = V_max * [luciferin] / (K_m + [luciferin])
V_max = 1.0  # normalized maximum rate
K_m = 0.5    # Michaelis constant (mM)
luciferin_conc = np.linspace(0, 5, 200)  # mM
reaction_rate = V_max * luciferin_conc / (K_m + luciferin_conc)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Firefly Bioluminescence: The Luciferin-Luciferase Reaction',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Emission spectrum with wavelength-to-color mapping
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
# Color the spectrum
for i in range(len(wavelengths)-1):
    wl = wavelengths[i]
    if 380 <= wl <= 440: rgb = (0.4*(440-wl)/60, 0, 1)
    elif 440 <= wl <= 490: rgb = (0, (wl-440)/50, 1)
    elif 490 <= wl <= 510: rgb = (0, 1, (510-wl)/20)
    elif 510 <= wl <= 580: rgb = ((wl-510)/70, 1, 0)
    elif 580 <= wl <= 645: rgb = (1, (645-wl)/65, 0)
    elif 645 <= wl <= 750: rgb = (1, 0, 0)
    else: rgb = (0.2, 0.2, 0.2)
    ax.fill_between(wavelengths[i:i+2], 0, emission_spectrum[i:i+2],
                     color=rgb, alpha=0.7)
ax.plot(wavelengths, emission_spectrum, color='white', linewidth=1.5)
ax.axvline(peak_wavelength, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.text(peak_wavelength + 5, 0.9, f'Peak: {peak_wavelength} nm', color='white', fontsize=10)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative intensity', color='white')
ax.set_title('Firefly emission spectrum', color='white')

# Panel 2: Efficiency comparison
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names = list(light_sources.keys())
effs = [light_sources[n]['efficiency'] * 100 for n in names]
colors = [light_sources[n]['color'] for n in names]
bars = ax.barh(names, effs, color=colors, alpha=0.8)
for bar, e in zip(bars, effs):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{e:.1f}%', color='white', fontsize=9, va='center')
ax.set_xlabel('Quantum yield / Luminous efficiency (%)', color='white')
ax.set_title('Light production efficiency comparison', color='white')

# Panel 3: Reaction kinetics
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(luciferin_conc, reaction_rate, color='#22c55e', linewidth=2.5)
ax.axhline(V_max, color='gray', linewidth=1, linestyle='--', alpha=0.5)
ax.axhline(V_max/2, color='gray', linewidth=0.5, linestyle=':', alpha=0.5)
ax.axvline(K_m, color='gray', linewidth=0.5, linestyle=':', alpha=0.5)
ax.text(K_m + 0.1, V_max/2, f'K_m = {K_m} mM', color='white', fontsize=9)
ax.text(3, V_max * 1.02, f'V_max = {V_max}', color='white', fontsize=9)
ax.set_xlabel('Luciferin concentration (mM)', color='white')
ax.set_ylabel('Reaction rate (normalized)', color='white')
ax.set_title('Michaelis-Menten enzyme kinetics', color='white')

# Panel 4: Energy budget per reaction
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
E_chemical = 4.0  # eV (total chemical energy released)
quantum_yield = 0.41
E_photon = 2.22   # eV (at 560 nm)
E_light = quantum_yield * E_photon
E_heat = E_chemical - E_light
labels = ['Chemical energy\\n(input)', 'Light output', 'Heat (waste)']
values = [E_chemical, E_light, E_heat]
colors_e = ['#3b82f6', '#22c55e', '#ef4444']
bars = ax.bar(labels, values, color=colors_e, alpha=0.8)
for bar, v in zip(bars, values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
            f'{v:.2f} eV', color='white', fontsize=10, ha='center')
ax.set_ylabel('Energy (eV per reaction)', color='white')
ax.set_title('Energy budget: luciferin oxidation', color='white')

plt.tight_layout()
plt.show()

print("Bioluminescence analysis:")
print(f"  Peak emission: {peak_wavelength} nm (yellow-green)")
print(f"  Photon energy at peak: {E_photon:.2f} eV")
print(f"  Chemical energy per reaction: {E_chemical:.1f} eV")
print(f"  Quantum yield: {quantum_yield*100:.0f}%")
print(f"  Energy efficiency: {E_light/E_chemical*100:.1f}%")
print(f"  Light output: {E_light:.2f} eV | Heat waste: {E_heat:.2f} eV")`,
      challenge: 'Model how pH affects the emission color. At pH 6 (acidic), the emission shifts to red (~620 nm). At pH 8 (basic), it stays yellow-green (~560 nm). Plot the emission spectra at pH 5, 6, 7, and 8, and calculate the photon energy change. This pH sensitivity is used in real-time cellular pH sensing.',
      successHint: 'The luciferin-luciferase system is one of nature\'s most efficient energy conversion processes. At 41% quantum yield, it outperforms most artificial light sources — a fact that has inspired engineers to develop bio-inspired lighting and sensing technologies.',
    },
    {
      title: 'Quantum yield & cold light physics',
      concept: `The **quantum yield** (Phi) of a luminescent process is the ratio of photons emitted to reactant molecules consumed: Phi = photons_out / reactions_total. For fireflies, Phi = 0.41, meaning 41 out of every 100 luciferin molecules that react produce a detectable photon. The other 59 dissipate their energy as heat through non-radiative pathways.

The concept of "cold light" is quantified by comparing the thermal radiation of a source to its actual light output. An incandescent bulb at 2700 K emits most of its radiation as infrared heat (Wien's law: peak wavelength = 2898/T = 1073 nm, far into the infrared). Only about 2% falls in the visible range (400-700 nm). To produce the same visible light as a firefly, an incandescent source would need to reach temperatures that would melt most materials.

**Fluorescence quantum yield** differs from the overall energy efficiency. The quantum yield counts photons regardless of their energy, while energy efficiency accounts for the Stokes shift — the fact that emitted photons have less energy (longer wavelength) than the excitation energy. For firefly bioluminescence, the Stokes shift is relatively small (the emission is close to the theoretical maximum for the chemical energy available), which is why the overall energy efficiency is so high.

The quantum yield can be measured experimentally using an integrating sphere (which captures all emitted photons) or by comparing the unknown sample to a fluorescent standard with known quantum yield. For in vivo firefly measurements, the challenge is that each flash contains a finite number of luciferin molecules, so the total photon count per flash is proportional to Phi times the number of molecules consumed.`,
      analogy: 'Quantum yield is like a factory\'s production rate. If the factory receives 100 units of raw material (luciferin molecules) and produces 41 finished products (photons) while rejecting 59 as waste (heat), the yield is 41%. An incandescent bulb is like a factory that receives 100 units and produces only 2 finished products — a terribly inefficient factory that converts most input into waste heat.',
      storyConnection: 'The story\'s central wonder — that fireflies glow without burning — is precisely the quantum yield story. A candle flame at 1400°C produces light but is overwhelmingly hot (1% quantum yield for visible light). A firefly at body temperature (~25°C) produces visible light at 41% quantum yield. The difference is not a matter of degree but of mechanism: thermal radiation vs. chemiluminescence.',
      checkQuestion: 'A firefly flash contains approximately 10^10 luciferin molecules. With a quantum yield of 0.41, how many photons are produced? If each photon has energy 3.55 x 10^-19 J, what is the total light energy of one flash?',
      checkAnswer: 'Photons = 10^10 * 0.41 = 4.1 x 10^9 photons. Light energy = 4.1e9 * 3.55e-19 = 1.46 x 10^-9 J = 1.46 nanojoules. This is an incredibly tiny amount of energy — about a billionth of a joule — yet it is visible to the human eye from tens of meters away. This speaks to the remarkable sensitivity of human scotopic (night) vision, which can detect as few as 5-10 photons arriving at the retina.',
      codeIntro: 'Compare thermal radiation (Planck\'s law) with bioluminescence to quantify why firefly light is "cold."',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Cold Light: Thermal vs Bioluminescent ---

h = 6.626e-34
c = 3e8
k_B = 1.381e-23
eV = 1.602e-19

wavelengths = np.linspace(200, 2000, 1000)  # nm
wl_m = wavelengths * 1e-9

def planck(wl_m, T):
    """Planck's spectral radiance B(lambda, T)."""
    with np.errstate(over='ignore', invalid='ignore'):
        x = h * c / (wl_m * k_B * T)
        B = (2 * h * c**2 / wl_m**5) / (np.exp(np.clip(x, 0, 500)) - 1)
    return B

# Thermal sources at different temperatures
temperatures = {
    'Candle (1400 K)': 1400,
    'Incandescent (2700 K)': 2700,
    'Halogen (3200 K)': 3200,
    'Sun surface (5778 K)': 5778,
}

# Firefly emission (Gaussian, not thermal)
firefly_emission = np.exp(-0.5 * ((wavelengths - 560) / 40)**2)

# Visible range
vis_min, vis_max = 400, 700

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Cold Light: Why Fireflies Don\\'t Burn',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Planck spectra vs firefly emission
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
colors_t = ['#f59e0b', '#ef4444', '#ec4899', '#f97316']
for (name, T), color in zip(temperatures.items(), colors_t):
    B = planck(wl_m, T)
    B_normalized = B / B.max()  # normalize for comparison
    ax.plot(wavelengths, B_normalized, color=color, linewidth=1.5, label=name)
ax.plot(wavelengths, firefly_emission, color='#22c55e', linewidth=3,
        label='Firefly (560 nm)', linestyle='--')
ax.axvspan(vis_min, vis_max, color='white', alpha=0.05, label='Visible range')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Normalized spectral intensity', color='white')
ax.set_title('Thermal radiation vs bioluminescence', color='white')
ax.legend(fontsize=7, loc='upper right')
ax.set_xlim(200, 2000)

# Panel 2: Visible fraction of each source
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
sources = list(temperatures.keys()) + ['Firefly']
vis_fractions = []
for name, T in temperatures.items():
    B = planck(wl_m, T)
    total = np.trapz(B, wl_m)
    vis_mask = (wavelengths >= vis_min) & (wavelengths <= vis_max)
    vis = np.trapz(B[vis_mask], wl_m[vis_mask])
    vis_fractions.append(vis / total * 100 if total > 0 else 0)
# Firefly: nearly all emission is visible
vis_mask = (wavelengths >= vis_min) & (wavelengths <= vis_max)
vis_fractions.append(np.trapz(firefly_emission[vis_mask], wavelengths[vis_mask]) /
                      np.trapz(firefly_emission, wavelengths) * 100)

colors_bar = colors_t + ['#22c55e']
bars = ax.barh(sources, vis_fractions, color=colors_bar, alpha=0.8)
for bar, f in zip(bars, vis_fractions):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{f:.1f}%', color='white', fontsize=9, va='center')
ax.set_xlabel('Fraction of emission in visible range (%)', color='white')
ax.set_title('Visible light fraction by source', color='white')

# Panel 3: Photon count per second per watt (luminous efficacy)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
# Luminous efficacy: how many lumens per watt
efficacies = {
    'Candle': 0.3,
    'Incandescent': 15,
    'Halogen': 25,
    'Fluorescent': 70,
    'White LED': 120,
    'Firefly': 90,  # estimated luminous efficacy
    'Theoretical max\\n(555 nm mono)': 683,
}
names_e = list(efficacies.keys())
values_e = list(efficacies.values())
colors_e = ['#f59e0b', '#ef4444', '#ec4899', '#a855f7', '#3b82f6', '#22c55e', '#6b7280']
bars = ax.barh(names_e, values_e, color=colors_e, alpha=0.8)
for bar, v in zip(bars, values_e):
    ax.text(bar.get_width() + 3, bar.get_y() + bar.get_height()/2,
            f'{v:.0f} lm/W', color='white', fontsize=9, va='center')
ax.set_xlabel('Luminous efficacy (lumens/watt)', color='white')
ax.set_title('Luminous efficacy comparison', color='white')

# Panel 4: Heat output for equal visible light
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
target_light = 1.0  # watt of visible light
sources_heat = {
    'Firefly': 1.0 / 0.41 - 1.0,
    'White LED': 1.0 / 0.30 - 1.0,
    'Fluorescent': 1.0 / 0.15 - 1.0,
    'Incandescent': 1.0 / 0.025 - 1.0,
    'Candle': 1.0 / 0.01 - 1.0,
}
names_h = list(sources_heat.keys())
heat_vals = list(sources_heat.values())
colors_h = ['#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#f59e0b']
bars = ax.barh(names_h, heat_vals, color=colors_h, alpha=0.8)
for bar, v in zip(bars, heat_vals):
    label = f'{v:.1f} W' if v < 50 else f'{v:.0f} W'
    ax.text(min(bar.get_width() + 0.5, 90), bar.get_y() + bar.get_height()/2,
            label, color='white', fontsize=9, va='center')
ax.set_xlabel('Heat waste per 1W of visible light (W)', color='white')
ax.set_title('Heat produced to get 1 watt of visible light', color='white')

plt.tight_layout()
plt.show()

print("Cold light analysis:")
print(f"  To produce 1W of visible light:")
for name, heat in sources_heat.items():
    total = heat + 1.0
    eff = 1.0 / total * 100
    print(f"  {name}: needs {total:.1f}W total, wastes {heat:.1f}W as heat ({eff:.1f}% efficient)")`,
      challenge: 'Model the spectral overlap between firefly emission and human scotopic (night) vision sensitivity (peaks at 507 nm). Calculate the effective luminous flux perceived by the human eye for a firefly flash vs the same energy as thermal radiation at 2700 K. This explains why fireflies seem so bright despite emitting nanowatts of power.',
      successHint: 'The "cold" in cold light is not a poetic metaphor — it is quantifiable physics. A firefly produces 41% light and 59% heat. An incandescent bulb produces 2.5% light and 97.5% heat. The firefly is 16x more efficient at converting energy to visible photons, which is why it can glow at body temperature while a bulb must reach 2700 K.',
    },
    {
      title: 'Flash patterns & neural timing circuits',
      concept: `Fireflies do not glow continuously — they produce precisely timed **flash patterns** that serve as species-specific mating signals. Each species has a unique pattern defined by flash duration, inter-flash interval, and the number of flashes per sequence. For example, Photinus pyralis flashes once every 5.5 seconds with a 0.5-second flash duration. Photinus consimilis uses a double flash with 2-second intervals.

The timing is controlled by a **neural oscillator** in the firefly's lantern organ. Octopamine (an insect neurotransmitter) triggers the release of nitric oxide (NO) gas, which diffuses into the light-producing cells (photocytes) and temporarily blocks mitochondrial respiration. This allows oxygen to reach the luciferase enzyme, triggering the flash. When NO dissipates, mitochondria resume consuming oxygen, and the flash ends. The duration and timing are controlled by the rate of NO production and diffusion — a chemical clock with remarkable precision (typically +/- 0.1 seconds).

Flash synchronization is one of the most spectacular phenomena in biology. In Southeast Asia and parts of the Americas, thousands of male fireflies synchronize their flashes, creating waves of light that sweep through the forest. This synchronization emerges from a simple rule: each firefly adjusts its internal clock slightly in response to the flashes of its neighbors. This is mathematically described by the **Kuramoto model** of coupled oscillators — the same mathematics that describes synchronization in heart pacemaker cells, power grid generators, and neural networks.`,
      analogy: 'Firefly flash synchronization is like an audience clapping after a performance. Initially, clapping is random. But each person unconsciously adjusts their clap timing to match nearby clappers. Within seconds, the entire audience is clapping in unison. No conductor is needed — synchronization emerges from local interactions. Fireflies are the same: each one adjusts its flash timing based on what it "sees" from neighbors, and global synchronization emerges spontaneously.',
      storyConnection: 'The story describes the magical moment when all the fireflies begin flashing in unison — a phenomenon the children find enchanting but inexplicable. The science reveals that this synchronization is not coordinated by a leader but emerges from the mathematics of coupled oscillators. It is collective behavior from simple individual rules — a concept that appears everywhere from physics to economics.',
      checkQuestion: 'Species A flashes: 0.3s on, 4.7s off, repeat. Species B: 0.5s on, 1.5s on (double flash), 3.5s off, repeat. If you observe both species simultaneously, after how many seconds will their patterns realign?',
      checkAnswer: 'Species A period: 0.3 + 4.7 = 5.0 seconds. Species B period: 0.5 + 1.5 + 3.5 = 5.5 seconds. The patterns realign when both complete integer numbers of cycles simultaneously: LCM of 5.0 and 5.5 seconds. 5.0 = 50/10, 5.5 = 55/10. LCM(50, 55) = 550. So LCM = 550/10 = 55.0 seconds. The patterns realign every 55 seconds (11 cycles of A, 10 cycles of B).',
      codeIntro: 'Simulate firefly flash patterns and the Kuramoto model of flash synchronization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Firefly Flash Patterns & Synchronization ---

# Species flash pattern definitions
species = {
    'P. pyralis': {'flash_dur': 0.5, 'period': 5.5, 'color': '#22c55e'},
    'P. consimilis': {'flash_dur': 0.3, 'period': 2.0, 'color': '#f59e0b'},
    'P. macdermotti': {'flash_dur': 0.8, 'period': 4.0, 'color': '#3b82f6'},
    'Photuris versicolor': {'flash_dur': 0.2, 'period': 1.0, 'color': '#ef4444'},
}

t_total = 20.0  # seconds
dt = 0.01
t = np.arange(0, t_total, dt)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Firefly Flash Patterns & Synchronization',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Species-specific flash patterns
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for i, (name, props) in enumerate(species.items()):
    signal = np.zeros_like(t)
    for t_idx, t_val in enumerate(t):
        phase = t_val % props['period']
        if phase < props['flash_dur']:
            signal[t_idx] = 1.0
    ax.plot(t, signal + i * 1.5, color=props['color'], linewidth=1.5)
    ax.text(-0.5, i * 1.5 + 0.5, name, color=props['color'], fontsize=9, ha='right')
ax.set_xlabel('Time (s)', color='white')
ax.set_title('Species-specific flash patterns', color='white')
ax.set_yticks([])
ax.set_xlim(-3, t_total)

# Panel 2: Kuramoto synchronization simulation
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')

n_fireflies = 20
natural_freqs = np.random.normal(1.0 / 5.5, 0.05, n_fireflies)  # ~0.18 Hz +/- noise
phases = np.random.uniform(0, 2 * np.pi, n_fireflies)
coupling_strength = 0.5  # K in Kuramoto model

dt_k = 0.01
t_k = np.arange(0, 30, dt_k)
phase_history = np.zeros((len(t_k), n_fireflies))
order_param = np.zeros(len(t_k))

for step in range(len(t_k)):
    phase_history[step] = phases.copy()
    # Order parameter r = |mean(e^(i*theta))|
    z = np.mean(np.exp(1j * phases))
    order_param[step] = np.abs(z)

    # Kuramoto model: dtheta_i/dt = omega_i + (K/N) * sum(sin(theta_j - theta_i))
    for i in range(n_fireflies):
        coupling = coupling_strength / n_fireflies * np.sum(np.sin(phases - phases[i]))
        phases[i] += (2 * np.pi * natural_freqs[i] + coupling) * dt_k
    phases = phases % (2 * np.pi)

# Plot order parameter
ax.plot(t_k, order_param, color='#f59e0b', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Order parameter r', color='white')
ax.set_title(f'Synchronization emergence (K={coupling_strength}, N={n_fireflies})', color='white')
ax.axhline(1.0, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.text(15, 0.3, 'r → 1 = fully synchronized', color='white', fontsize=9)
ax.text(1, 0.1, 'r ≈ 0 = random phases', color='gray', fontsize=9)

# Panel 3: Phase evolution (raster plot)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
# Show flash events (when phase crosses 0)
for i in range(min(n_fireflies, 15)):
    phase_mod = phase_history[:, i] % (2 * np.pi)
    # Detect crossings (phase wraps from ~2pi to ~0)
    crossings = np.where(np.diff(phase_mod) < -np.pi)[0]
    flash_times = t_k[crossings]
    ax.scatter(flash_times, [i] * len(flash_times), color='#22c55e', s=8, alpha=0.8)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Firefly index', color='white')
ax.set_title('Flash raster plot (dots align = synchronized)', color='white')

# Panel 4: Coupling strength effect
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
K_values = [0, 0.1, 0.3, 0.5, 1.0, 2.0]
colors_K = ['#6b7280', '#3b82f6', '#a855f7', '#f59e0b', '#22c55e', '#ef4444']
for K_val, color in zip(K_values, colors_K):
    phases_test = np.random.uniform(0, 2 * np.pi, n_fireflies)
    freqs_test = natural_freqs.copy()
    r_test = []
    for step in range(len(t_k)):
        z = np.mean(np.exp(1j * phases_test))
        r_test.append(np.abs(z))
        for i in range(n_fireflies):
            coupling = K_val / n_fireflies * np.sum(np.sin(phases_test - phases_test[i]))
            phases_test[i] += (2 * np.pi * freqs_test[i] + coupling) * dt_k
        phases_test = phases_test % (2 * np.pi)
    ax.plot(t_k, r_test, color=color, linewidth=1.5, label=f'K={K_val}')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Order parameter r', color='white')
ax.set_title('Effect of coupling strength K', color='white')
ax.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("Flash pattern analysis:")
for name, props in species.items():
    freq = 1.0 / props['period']
    print(f"  {name}: period={props['period']}s, freq={freq:.3f} Hz, flash={props['flash_dur']}s")
print(f"\\nSynchronization (K={coupling_strength}):")
print(f"  Final order parameter: r = {order_param[-1]:.3f}")
print(f"  Time to sync (r > 0.8): ~{t_k[np.argmax(order_param > 0.8)]:.1f}s")`,
      challenge: 'Implement the "firefly femme fatale" effect: predatory Photuris females mimic the flash patterns of Photinus species to lure males. Add a predator that dynamically switches between mimicking two different species patterns, and track which "prey" fireflies are attracted (their oscillators shift toward the predator\'s frequency).',
      successHint: 'Firefly flash patterns are nature\'s Morse code — species-specific signals encoded in precise timing. The synchronization phenomenon demonstrates that complex global behavior can emerge from simple local rules, a principle that connects biology to physics to computer science.',
    },
    {
      title: 'ATP energy budget & metabolic cost of bioluminescence',
      concept: `Bioluminescence is not free. Each flash costs the firefly **ATP** (adenosine triphosphate), the universal energy currency of cells. One luciferin molecule requires one ATP to activate (forming luciferyl-adenylate), plus the oxygen needed for oxidation. The ATP hydrolysis provides about 30.5 kJ/mol (0.32 eV per molecule).

A single firefly flash involves the oxidation of approximately 10^10 luciferin molecules, consuming an equal number of ATP molecules. The total ATP energy cost is 10^10 * 0.32 eV = 3.2 x 10^9 eV = 5.1 x 10^-10 J per flash. This might seem negligible, but a male firefly flashing at 0.18 Hz for 2 hours produces about 1300 flashes, consuming 6.6 x 10^-7 J of ATP energy in bioluminescence alone.

The metabolic overhead is much larger: synthesizing luciferin from scratch requires about 8 ATP per molecule (the biosynthetic pathway from cysteine and benzoquinone involves multiple enzymatic steps). Regenerating oxidized luciferin (oxyluciferin) back to luciferin is not possible in most species — the firefly must synthesize fresh luciferin, making it a consumable resource rather than a recyclable one.

The total metabolic cost of a mating display (2 hours of flashing) is estimated at 0.1-0.5% of daily metabolic expenditure. This is modest compared to flight (which costs 10-100x more per unit time), but the evolutionary pressure is real: a firefly that wastes energy on inefficient flashing will have less energy for flight, predator avoidance, and reproduction. This drives selection pressure toward high quantum yield — nature optimizes efficiency because waste has a fitness cost.`,
      analogy: 'Think of the firefly\'s ATP budget as a phone battery. Each flash is like sending a text message — it uses a small amount of battery. One text is nothing. But sending 1300 texts in 2 hours will drain a noticeable fraction. The firefly cannot recharge until it eats, so every flash is a deliberate investment. Evolution has "designed" the flash to be as energy-efficient as possible — like optimizing your phone\'s screen brightness to extend battery life.',
      storyConnection: 'The story\'s fireflies flash all night without apparent fatigue. The ATP budget analysis reveals the hidden cost: each flash draws from a limited energy store. The fireflies that flash most efficiently — highest quantum yield, optimal flash duration, minimum wasted light — are the ones that can signal the longest and attract the most mates. Natural selection has been optimizing this light source for 100 million years.',
      checkQuestion: 'A firefly uses 10^10 ATP molecules per flash and flashes 1300 times in a mating display. If each ATP provides 0.32 eV, what is the total energy cost in joules? If the firefly\'s total daily metabolic budget is 0.5 joules, what percentage goes to bioluminescence?',
      checkAnswer: 'Total ATP: 1300 * 10^10 = 1.3 x 10^13 molecules. Energy: 1.3e13 * 0.32 eV * 1.602e-19 J/eV = 6.66e-7 J. Percentage of daily budget: 6.66e-7 / 0.5 * 100 = 0.00013%. This is tiny — but remember this only accounts for ATP directly used in the light reaction. Including luciferin synthesis (8 ATP per molecule), the cost rises to about 9x higher: ~0.001%. Still small, confirming that bioluminescence is metabolically cheap compared to flight.',
      codeIntro: 'Model the ATP energy budget for a complete firefly mating display and compare metabolic costs across activities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- ATP Energy Budget of Bioluminescence ---

eV_to_J = 1.602e-19

# Per-flash parameters
luciferin_per_flash = 1e10  # molecules
atp_per_luciferin = 1       # for activation
atp_per_synthesis = 8       # for de novo luciferin synthesis
atp_energy = 0.32           # eV per ATP hydrolysis

# Mating display parameters
flash_rate = 0.18           # Hz (flashes per second)
display_duration = 2 * 3600 # seconds (2 hours)
n_flashes = int(flash_rate * display_duration)

# Energy calculations
atp_activation = n_flashes * luciferin_per_flash * atp_per_luciferin
atp_synthesis = n_flashes * luciferin_per_flash * atp_per_synthesis
atp_total = atp_activation + atp_synthesis

E_activation = atp_activation * atp_energy * eV_to_J
E_synthesis = atp_synthesis * atp_energy * eV_to_J
E_total_biolum = E_activation + E_synthesis

# Light energy produced
quantum_yield = 0.41
photon_energy = 2.22  # eV (560 nm)
E_light_total = n_flashes * luciferin_per_flash * quantum_yield * photon_energy * eV_to_J

# Daily metabolic budget (estimated)
mass_firefly = 0.05e-3  # 50 mg in kg
metabolic_rate = 20e-3   # W/g * mass = rough metabolic rate
daily_metabolism = metabolic_rate * mass_firefly * 1000 * 24 * 3600  # joules per day
# More reasonable estimate: ~0.1-1.0 joules per day for a 50 mg insect
daily_metabolism = 0.5  # J/day (rough estimate)

# Activity energy costs (estimated, relative)
activities = {
    'Resting metabolism\\n(24 hours)': daily_metabolism,
    'Flight (1 hour)': daily_metabolism * 0.3,
    'Bioluminescence\\n(2-hour display)': E_total_biolum,
    'Light energy\\n(visible output)': E_light_total,
}

# Flash energy time series
t_display = np.linspace(0, display_duration, n_flashes)
cumulative_atp = np.arange(1, n_flashes + 1) * luciferin_per_flash * (atp_per_luciferin + atp_per_synthesis)
cumulative_energy = cumulative_atp * atp_energy * eV_to_J
cumulative_light = np.arange(1, n_flashes + 1) * luciferin_per_flash * quantum_yield * photon_energy * eV_to_J

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('ATP Energy Budget: Metabolic Cost of Bioluminescence',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Energy flow diagram (Sankey-style)
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
stages = ['ATP\\nactivation', 'ATP\\nsynthesis', 'Light\\noutput', 'Heat\\nwaste']
values = [E_activation * 1e9, E_synthesis * 1e9, E_light_total * 1e9,
          (E_total_biolum - E_light_total) * 1e9]
colors_s = ['#3b82f6', '#a855f7', '#22c55e', '#ef4444']
bars = ax.bar(stages, values, color=colors_s, alpha=0.8)
for bar, v in zip(bars, values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(values)*0.02,
            f'{v:.2f} nJ', color='white', fontsize=9, ha='center')
ax.set_ylabel('Energy (nanojoules)', color='white')
ax.set_title('Energy flow per flash', color='white')

# Panel 2: Cumulative energy over display
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t_display / 3600, cumulative_energy * 1e6, color='#ef4444', linewidth=2,
        label='Total metabolic cost')
ax.plot(t_display / 3600, cumulative_light * 1e6, color='#22c55e', linewidth=2,
        label='Light energy output')
ax.set_xlabel('Display time (hours)', color='white')
ax.set_ylabel('Cumulative energy (μJ)', color='white')
ax.set_title(f'Energy expenditure over {display_duration/3600:.0f}-hour display', color='white')
ax.legend(fontsize=9)

# Panel 3: Activity comparison
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
act_names = list(activities.keys())
act_values = [activities[n] * 1e6 for n in act_names]  # convert to μJ
act_colors = ['#6b7280', '#f59e0b', '#3b82f6', '#22c55e']
bars = ax.barh(act_names, act_values, color=act_colors, alpha=0.8)
for bar, v in zip(bars, act_values):
    ax.text(bar.get_width() + max(act_values)*0.02,
            bar.get_y() + bar.get_height()/2,
            f'{v:.2f} μJ', color='white', fontsize=9, va='center')
ax.set_xlabel('Energy (μJ)', color='white')
ax.set_title('Activity energy comparison', color='white')
ax.set_xscale('log')

# Panel 4: Efficiency cascade
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
cascade = {
    'Chemical energy\\n(ATP + luciferin)': 100,
    'Excited state\\n(oxyluciferin*)': 65,
    'Photons emitted\\n(quantum yield)': 41,
    'Visible light\\n(in useful direction)': 20,
    'Detected by\\nfemale firefly': 0.01,
}
stages_c = list(cascade.keys())
values_c = list(cascade.values())
colors_c = plt.cm.Greens(np.linspace(0.8, 0.3, len(stages_c)))
bars = ax.barh(stages_c, values_c, color=colors_c)
for bar, v in zip(bars, values_c):
    label = f'{v:.0f}%' if v >= 1 else f'{v:.2f}%'
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            label, color='white', fontsize=9, va='center')
ax.set_xlabel('Fraction of input energy (%)', color='white')
ax.set_title('Energy efficiency cascade', color='white')
ax.set_xscale('log')

plt.tight_layout()
plt.show()

print("ATP energy budget summary:")
print(f"  Flashes per display: {n_flashes}")
print(f"  Luciferin molecules per flash: {luciferin_per_flash:.0e}")
print(f"  Total ATP consumed: {atp_total:.2e} molecules")
print(f"  Total metabolic cost: {E_total_biolum*1e6:.4f} μJ")
print(f"  Light energy output: {E_light_total*1e6:.4f} μJ")
print(f"  Overall efficiency (light/total): {E_light_total/E_total_biolum*100:.1f}%")
print(f"  Fraction of daily metabolism: {E_total_biolum/daily_metabolism*100:.4f}%")`,
      challenge: 'Model the luciferin depletion over time. If the firefly starts with a finite store of 10^12 luciferin molecules and cannot synthesize new ones during the display, at what point does the flash brightness start to decrease? Plot brightness vs time and find the optimal flash rate that maximizes the total number of photons emitted over the entire display.',
      successHint: 'The ATP budget reveals that bioluminescence is extraordinarily cheap — less than 0.01% of daily energy expenditure. But the efficiency cascade shows that only 0.01% of the invested energy actually reaches the intended receiver. The firefly is optimized not just for light production but for the entire signaling chain from chemistry to ecology.',
    },
    {
      title: 'Bioluminescence across species: a comparative study',
      concept: `Fireflies are just one of over 700 genera of bioluminescent organisms. The chemistry varies dramatically across the tree of life, but the physics is the same: a chemical reaction produces an electronically excited molecule, which relaxes by emitting a photon.

**Deep-sea organisms** (anglerfish, dragonfish, dinoflagellates) produce blue light (470-490 nm) because blue penetrates seawater best. They use **coelenterazine** as the luciferin substrate, with quantum yields of 10-30%. Some deep-sea species have evolved red-shifted bioluminescence (using chlorophyll-like filters) as "invisible flashlights" — most deep-sea animals cannot see red light, so these predators can illuminate prey without alerting them.

**Jellyfish** (Aequorea victoria) produce green fluorescent light through a two-step process: aequorin first produces blue light, which is then absorbed and re-emitted as green by **GFP** (green fluorescent protein). GFP revolutionized biology — its discovery earned the 2008 Nobel Prize in Chemistry. GFP gene tagging allows scientists to make any protein in any organism glow green under UV light, enabling real-time visualization of gene expression, protein localization, and cellular processes.

**Fungi** (Neonothopanus gardneri) glow continuously (no flash control) using a distinct luciferin derived from hispidin. Their emission is green (530 nm) and serves to attract insects for spore dispersal — using light as an ecological signal, not a mating signal.

The convergent evolution of bioluminescence (independently evolved 40+ times) demonstrates that the underlying chemistry is not complex — it requires only an oxidizable substrate and a protein catalyst. Evolution repeatedly "discovers" this solution because the fitness benefits of light production outweigh the modest metabolic costs.`,
      analogy: 'Bioluminescence evolving 40+ times independently is like humans independently inventing the wheel on different continents. The solution is so useful and the chemistry so accessible that nature keeps arriving at the same answer through different molecular pathways. The "wheel" is the chemiluminescent reaction; the "roads" are different ecological needs (mating signals, predator lures, camouflage, warning signals).',
      storyConnection: 'The story focuses on fireflies, but the children could encounter bioluminescence in many other forms — glowing fungi in the forest floor, luminescent plankton in a river, or the flash of a startled click beetle. Each organism has independently evolved its own version of "cold light," all obeying the same physics but with different chemistries tuned to different ecological niches.',
      checkQuestion: 'Deep-sea anglerfish emit at 470 nm and fireflies at 560 nm. Calculate the energy difference per photon between these wavelengths. Why would deep-sea organisms evolve blue rather than yellow-green light?',
      checkAnswer: 'E_470 = hc/(470e-9) = 4.23e-19 J = 2.64 eV. E_560 = hc/(560e-9) = 3.55e-19 J = 2.22 eV. Difference: 0.42 eV (blue photons are 19% more energetic). Deep-sea organisms emit blue because seawater absorbs red and green light quickly but transmits blue light over long distances. At 200m depth, red light (700 nm) is attenuated by a factor of 10^10, while blue light (470 nm) is attenuated by only a factor of 10^2. Blue bioluminescence travels 100 million times farther underwater than red would.',
      codeIntro: 'Compare bioluminescent systems across species: emission spectra, quantum yields, ecological functions, and evolutionary relationships.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Comparative Bioluminescence Across Species ---

h = 6.626e-34
c = 3e8
eV = 1.602e-19

organisms = {
    'Firefly (Photinus)': {
        'peak_nm': 560, 'width_nm': 40, 'quantum_yield': 0.41,
        'luciferin': 'D-luciferin', 'habitat': 'Terrestrial',
        'function': 'Mating signal', 'color': '#22c55e',
    },
    'Jellyfish (Aequorea)': {
        'peak_nm': 509, 'width_nm': 30, 'quantum_yield': 0.23,
        'luciferin': 'Coelenterazine + GFP', 'habitat': 'Marine',
        'function': 'Defense/warning', 'color': '#06b6d4',
    },
    'Deep-sea shrimp': {
        'peak_nm': 470, 'width_nm': 35, 'quantum_yield': 0.15,
        'luciferin': 'Coelenterazine', 'habitat': 'Deep ocean',
        'function': 'Counter-illumination', 'color': '#3b82f6',
    },
    'Dinoflagellate': {
        'peak_nm': 475, 'width_nm': 25, 'quantum_yield': 0.10,
        'luciferin': 'Dinoflagellate luciferin', 'habitat': 'Marine surface',
        'function': 'Burglar alarm', 'color': '#a855f7',
    },
    'Click beetle (Pyrophorus)': {
        'peak_nm': 540, 'width_nm': 45, 'quantum_yield': 0.38,
        'luciferin': 'D-luciferin', 'habitat': 'Terrestrial',
        'function': 'Mating signal', 'color': '#f59e0b',
    },
    'Fungi (Neonothopanus)': {
        'peak_nm': 530, 'width_nm': 50, 'quantum_yield': 0.03,
        'luciferin': 'Hispidin', 'habitat': 'Forest floor',
        'function': 'Spore dispersal', 'color': '#84cc16',
    },
    'Dragonfish (Malacosteus)': {
        'peak_nm': 705, 'width_nm': 30, 'quantum_yield': 0.05,
        'luciferin': 'Coelenterazine + filter', 'habitat': 'Deep ocean',
        'function': 'Invisible searchlight', 'color': '#ef4444',
    },
    'Railroad worm': {
        'peak_nm': 623, 'width_nm': 35, 'quantum_yield': 0.08,
        'luciferin': 'D-luciferin variant', 'habitat': 'Terrestrial',
        'function': 'Warning/defense', 'color': '#f97316',
    },
}

wavelengths = np.linspace(350, 800, 500)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bioluminescence Across the Tree of Life',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Emission spectra
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in organisms.items():
    spectrum = np.exp(-0.5 * ((wavelengths - props['peak_nm']) / props['width_nm'])**2)
    spectrum *= props['quantum_yield']
    ax.plot(wavelengths, spectrum, color=props['color'], linewidth=2,
            label=name.split('(')[0].strip())
ax.axvspan(400, 700, color='white', alpha=0.03)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative intensity × quantum yield', color='white')
ax.set_title('Emission spectra (scaled by efficiency)', color='white')
ax.legend(fontsize=6, loc='upper right')

# Panel 2: Quantum yield comparison
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names = list(organisms.keys())
qy_values = [organisms[n]['quantum_yield'] * 100 for n in names]
colors_qy = [organisms[n]['color'] for n in names]
short_names = [n.split('(')[0].strip() for n in names]
bars = ax.barh(short_names, qy_values, color=colors_qy, alpha=0.8)
for bar, v in zip(bars, qy_values):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{v:.1f}%', color='white', fontsize=8, va='center')
ax.set_xlabel('Quantum yield (%)', color='white')
ax.set_title('Quantum yield by organism', color='white')

# Panel 3: Peak wavelength vs photon energy
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in organisms.items():
    peak_E = (h * c) / (props['peak_nm'] * 1e-9) / eV
    ax.scatter(props['peak_nm'], peak_E, color=props['color'], s=150, zorder=10)
    ax.annotate(name.split('(')[0].strip()[:12], (props['peak_nm'], peak_E),
                textcoords="offset points", xytext=(5, 5),
                color=props['color'], fontsize=7)
# Add wavelength-energy curve
wl_range = np.linspace(400, 750, 100)
E_range = (h * c) / (wl_range * 1e-9) / eV
ax.plot(wl_range, E_range, color='gray', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Peak emission wavelength (nm)', color='white')
ax.set_ylabel('Photon energy (eV)', color='white')
ax.set_title('Wavelength vs photon energy', color='white')

# Panel 4: Ecological function categories
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
functions = {}
for name, props in organisms.items():
    func = props['function']
    if func not in functions:
        functions[func] = []
    functions[func].append((name.split('(')[0].strip(), props['quantum_yield'], props['color']))

y_pos = 0
for func, members in functions.items():
    ax.text(-0.02, y_pos + len(members)/2 - 0.5, func, color='white', fontsize=9,
            ha='right', va='center', fontweight='bold')
    for member_name, qy, color in members:
        ax.barh(y_pos, qy * 100, color=color, alpha=0.8, height=0.7)
        ax.text(qy * 100 + 1, y_pos, f'{member_name} ({qy*100:.0f}%)',
                color='white', fontsize=7, va='center')
        y_pos += 1
    y_pos += 0.5
ax.set_xlabel('Quantum yield (%)', color='white')
ax.set_title('Grouped by ecological function', color='white')
ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Comparative bioluminescence summary:")
print(f"{'Organism':<25} {'Peak nm':>8} {'QY':>6} {'Habitat':<15} {'Function'}")
print("-" * 80)
for name, props in organisms.items():
    print(f"{name:<25} {props['peak_nm']:>8} {props['quantum_yield']:>5.0%} "
          f"{props['habitat']:<15} {props['function']}")
print(f"\\nConvergent evolution: bioluminescence evolved independently 40+ times")
print(f"Highest QY: Firefly (41%) | Lowest: Fungi (3%)")`,
      challenge: 'Add seawater absorption to the model: calculate the effective visibility range for each marine organism by convolving their emission spectrum with the seawater transmission curve (strong absorption below 400 nm and above 600 nm, minimum absorption at 470 nm). Show why blue bioluminescence dominates in the ocean.',
      successHint: 'The comparative study reveals that evolution has independently discovered bioluminescence over 40 times, each time tuning the emission wavelength to the ecological niche. Blue for the ocean, green for forests, yellow for open-air mating signals. The physics constrains what is possible; ecology determines what is optimal.',
    },
    {
      title: 'Engineering bio-inspired lighting & sensors',
      concept: `Bioluminescence has inspired a wave of engineering applications. The most impactful is **GFP-based imaging**: green fluorescent protein (from jellyfish) is now used in virtually every biology lab worldwide to visualize gene expression, track cancer cells, map neural circuits, and monitor environmental pollutants. The GFP gene is inserted next to a gene of interest, and when that gene is activated, the cell glows green — a real-time readout of molecular activity.

**Bioluminescent sensors** exploit the specificity of the luciferase reaction. Because the reaction requires ATP, oxygen, and luciferin in precise ratios, measuring light output can quantify any one of these components if the others are held constant. ATP bioluminescence assays are the standard method for detecting bacterial contamination in food, water, and hospital surfaces — a swab is taken, luciferin and luciferase are added, and any ATP from living cells triggers a flash. The brightness is proportional to the number of living bacteria, giving results in seconds rather than the days required for culture-based methods.

**Bio-inspired LED design** has borrowed from firefly anatomy. The firefly's lantern has a hierarchical microstructure that enhances light extraction: a reflective backing (the urate layer), a light-producing layer (photocytes), and an anti-reflective surface (nanostructured cuticle). Engineers at KAIST and other institutions have mimicked this structure to design LEDs with 55% higher light extraction efficiency — directly inspired by studying firefly cuticle nanopatterns under electron microscopes.

Future applications include self-luminous plants (luciferase genes inserted into trees for "living streetlights"), bioluminescent medical implants that report their status by glowing, and environmental sensors where transgenic organisms glow in response to specific pollutants.`,
      analogy: 'Using GFP to track genes in cells is like putting a GPS tracker on a delivery truck. You cannot see the truck from satellite, but the GPS signal tells you exactly where it is and when it arrived. GFP is the "GPS beacon" that makes invisible molecular events visible. The bioluminescence ATP assay is like a smoke detector for bacteria — it does not identify which bacteria are present, but it instantly tells you whether any living organisms are there.',
      storyConnection: 'The fireflies in the story produce light that has inspired real technologies used in hospitals, labs, and environmental monitoring worldwide. The children watching fireflies are witnessing the same chemistry that won a Nobel Prize, drives modern biomedical imaging, and may one day illuminate our streets with living light.',
      checkQuestion: 'An ATP bioluminescence assay detects 500 relative light units (RLU) from a hospital surface swab. The calibration curve shows 100 RLU = 10^4 bacteria and the relationship is linear on a log-log scale. How many bacteria are on the surface?',
      checkAnswer: 'On a log-log scale, if 100 RLU = 10^4 bacteria, then log(RLU) = log(bacteria) + constant. log(100) = 2, log(10^4) = 4, so log(bacteria) = log(RLU) + 2. For 500 RLU: log(500) = 2.70, so log(bacteria) = 2.70 + 2 = 4.70, bacteria = 10^4.70 = 50,119 or approximately 50,000 bacteria. This exceeds the typical hospital hygiene threshold of 2.5 RLU (about 250 bacteria), indicating the surface needs re-cleaning.',
      codeIntro: 'Model a bioluminescence-based ATP assay and a bio-inspired LED with enhanced light extraction, quantifying the engineering improvements.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Bio-Inspired Engineering Applications ---

# APPLICATION 1: ATP Bioluminescence Assay
# Calibration: RLU = k * [ATP], and [ATP] proportional to bacteria count

bacteria_counts = np.logspace(1, 7, 100)  # 10 to 10 million
atp_per_bacterium = 1e-15  # femtomoles
quantum_yield = 0.41
detection_efficiency = 0.01  # 1% of photons detected

# RLU (relative light units) proportional to bacteria
k_calibration = 0.01  # RLU per bacterium (instrument-dependent)
RLU = k_calibration * bacteria_counts

# Noise floor and detection limit
noise_floor = 2.0  # RLU (instrument noise)
detection_limit = noise_floor / k_calibration  # minimum detectable bacteria

# APPLICATION 2: Bio-inspired LED light extraction
# Standard LED vs firefly-inspired nanostructured LED
angles = np.linspace(0, 90, 100)  # emission angle from normal
angle_rad = np.radians(angles)

# Standard LED: Lambertian + total internal reflection
n_led = 2.5  # refractive index of LED material
critical_angle = np.degrees(np.arcsin(1.0 / n_led))  # ~23.6 degrees
extraction_standard = np.where(angles < critical_angle,
                                np.cos(angle_rad), 0)
extraction_standard /= extraction_standard.max()

# Firefly-inspired: nanostructured surface reduces TIR
# Effective critical angle increases to ~40 degrees
critical_angle_bio = 40
extraction_bio = np.where(angles < critical_angle_bio,
                           np.cos(angle_rad) * 1.0, 0.1 * np.exp(-(angles - critical_angle_bio)/20))
extraction_bio /= extraction_bio.max()

# Total extraction efficiency
eff_standard = np.trapz(extraction_standard * np.sin(angle_rad), angle_rad)
eff_bio = np.trapz(extraction_bio * np.sin(angle_rad), angle_rad)
improvement = (eff_bio / eff_standard - 1) * 100

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bio-Inspired Engineering from Bioluminescence',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: ATP assay calibration curve
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(bacteria_counts, RLU, color='#22c55e', linewidth=2.5)
ax.axhline(noise_floor, color='#ef4444', linewidth=1.5, linestyle='--', label=f'Noise floor ({noise_floor} RLU)')
ax.axvline(detection_limit, color='#f59e0b', linewidth=1.5, linestyle='--', label=f'Detection limit ({detection_limit:.0f} bacteria)')
# Hospital hygiene zones
ax.axhspan(0, 2.5, color='#22c55e', alpha=0.1, label='Pass (<2.5 RLU)')
ax.axhspan(2.5, 25, color='#f59e0b', alpha=0.1, label='Caution (2.5-25 RLU)')
ax.axhspan(25, 1000, color='#ef4444', alpha=0.05, label='Fail (>25 RLU)')
ax.set_xlabel('Bacteria count', color='white')
ax.set_ylabel('Relative Light Units (RLU)', color='white')
ax.set_title('ATP Bioluminescence Hygiene Assay', color='white')
ax.set_xscale('log'); ax.set_yscale('log')
ax.legend(fontsize=7, loc='upper left')

# Panel 2: LED light extraction
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(angles, extraction_standard, color='#3b82f6', linewidth=2.5, label='Standard LED')
ax.plot(angles, extraction_bio, color='#22c55e', linewidth=2.5, label='Firefly-inspired LED')
ax.axvline(critical_angle, color='#3b82f6', linewidth=1, linestyle='--', alpha=0.5)
ax.axvline(critical_angle_bio, color='#22c55e', linewidth=1, linestyle='--', alpha=0.5)
ax.fill_between(angles, extraction_standard, extraction_bio,
                where=extraction_bio > extraction_standard,
                color='#22c55e', alpha=0.2, label=f'Improvement (+{improvement:.0f}%)')
ax.set_xlabel('Emission angle (degrees)', color='white')
ax.set_ylabel('Extraction efficiency', color='white')
ax.set_title('LED Light Extraction: Standard vs Bio-inspired', color='white')
ax.legend(fontsize=8)

# Panel 3: Application timeline
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
milestones = [
    (1947, 'Luciferin structure\\ndetermined'),
    (1962, 'GFP discovered\\n(Shimomura)'),
    (1992, 'GFP gene cloned\\n(Prasher/Chalfie)'),
    (1994, 'GFP expression\\nin C. elegans'),
    (2004, 'ATP hygiene assays\\ncommercialized'),
    (2008, 'Nobel Prize\\n(Shimomura/Chalfie/Tsien)'),
    (2012, 'Bio-LED nanostructure\\n(KAIST)'),
    (2020, 'Glowing plants\\n(MIT, Planta)'),
]
years = [m[0] for m in milestones]
labels = [m[1] for m in milestones]
ax.scatter(years, range(len(years)), color='#f59e0b', s=80, zorder=10)
for i, (year, label) in enumerate(milestones):
    ax.annotate(f'{year}: {label}', (year, i), textcoords="offset points",
                xytext=(15, 0), color='white', fontsize=8, va='center')
ax.set_xlabel('Year', color='white')
ax.set_title('Bioluminescence Technology Timeline', color='white')
ax.set_yticks([])

# Panel 4: Impact metrics
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
impacts = [
    'ENGINEERING IMPACTS:',
    '',
    'GFP imaging:',
    '  - Used in 100,000+ published papers',
    '  - Standard tool in every biology lab',
    '  - Enabled live cell imaging revolution',
    '',
    'ATP hygiene assays:',
    '  - 10 second results (vs 48h culture)',
    '  - Used in 90% of food factories',
    '  - Standard in hospital infection control',
    '',
    'Bio-inspired LEDs:',
    f'  - {improvement:.0f}% better light extraction',
    '  - Nanostructured surfaces from firefly',
    '  - Reduces energy waste as trapped light',
    '',
    'Future: self-luminous plants, medical',
    'implant reporters, pollution sensors',
]
for i, line in enumerate(impacts):
    weight = 'bold' if line.endswith(':') and not line.startswith(' ') else 'normal'
    color = '#f59e0b' if weight == 'bold' else 'white'
    ax.text(0.05, 0.97 - i * 0.05, line, color=color, fontsize=9,
            transform=ax.transAxes, fontfamily='monospace', fontweight=weight)

plt.tight_layout()
plt.show()

print("Bio-inspired engineering summary:")
print(f"  ATP assay detection limit: {detection_limit:.0f} bacteria")
print(f"  LED extraction improvement: +{improvement:.0f}%")
print(f"  GFP citations: >100,000 papers")
print(f"  Nobel Prize: 2008 (Chemistry)")`,
      challenge: 'Design a bioluminescence-based water quality sensor: define the detection threshold for E. coli (target: <100 CFU/mL), calculate the minimum sample volume needed for reliable detection (signal > 3x noise), and estimate the cost per test if luciferase costs $0.50/mg and you need 0.01 mg per test.',
      successHint: 'From firefly chemistry to Nobel Prize-winning imaging technology to bio-inspired LEDs — bioluminescence is a case study in how understanding fundamental science leads to transformative engineering applications. The fireflies that "don\'t burn" have lit up laboratories, hospitals, and factories worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Bioluminescence Chemistry & Physics
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (chemistry fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real bioluminescence chemistry and physics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
