import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import AgniCombustionTriangleDiagram from '../diagrams/AgniCombustionTriangleDiagram';
import AgniFlameColorDiagram from '../diagrams/AgniFlameColorDiagram';
import AgniHeatTransferDiagram from '../diagrams/AgniHeatTransferDiagram';
import AgniSpectroscopyDiagram from '../diagrams/AgniSpectroscopyDiagram';
import EnergyProfileDiagram from '../diagrams/EnergyProfileDiagram';
import MolecularMotionDiagram from '../diagrams/MolecularMotionDiagram';

export default function AgniLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Chemical kinetics — Arrhenius equation and reaction rates',
      concept: `The rate of a combustion reaction depends exponentially on temperature. The **Arrhenius equation** quantifies this:

**k = A × e^(-E_a / RT)**

Where k = rate constant, A = pre-exponential factor, E_a = activation energy, R = gas constant (8.314 J/mol·K), and T = temperature in Kelvin.

The exponential term e^(-E_a/RT) is key. At low T, E_a/RT is large, so e^(-large) ≈ 0 (slow reaction). At high T, E_a/RT is small, so e^(-small) ≈ 1 (fast reaction). A typical combustion reaction with E_a = 150 kJ/mol speeds up by a factor of ~10 for every 100°C increase.

This explains why a campfire builds slowly but once fully burning is hard to extinguish — the heat of the flame accelerates the reaction, which produces more heat, which accelerates it further. This positive feedback loop is called **thermal runaway**.`,
      analogy: 'The Arrhenius equation describes a gatekeeper with a variable barrier. At low temperature, few molecules have enough energy to jump the barrier — the gatekeeper blocks almost everyone. At high temperature, most molecules fly over easily. The exponential dependence means the transition from "nearly blocked" to "wide open" is sharp.',
      storyConnection: 'The arani sticks of Vedic fire-starting concentrate mechanical energy into a tiny contact point, raising the local temperature past the Arrhenius threshold. Once one spot ignites (thermal runaway begins), the reaction spreads exponentially. The mythological image of Agni "erupting" from the wood is kinetically accurate — the transition from no reaction to vigorous combustion is abrupt.',
      checkQuestion: 'Why does blowing on a campfire make it burn faster, even though the air is cool?',
      checkAnswer: 'Blowing increases the oxygen concentration at the flame surface. The Arrhenius equation shows rate depends on both temperature AND concentration. The rate law for combustion is: rate = k[fuel][O₂]. Blowing increases [O₂], directly increasing the reaction rate. It also removes the layer of CO₂/H₂O products that blanket the fuel surface, allowing fresh oxygen to reach the fuel. The slight cooling from the breeze is overwhelmed by the concentration effect.',
      codeIntro: 'Plot the Arrhenius equation and show how reaction rate depends on temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Arrhenius equation: k = A * exp(-Ea / (R * T))
R = 8.314  # J/(mol*K)

# Different activation energies
reactions = [
    {"name": "H₂ + O₂ (explosive)", "Ea": 75000, "A": 1e11},
    {"name": "CH₄ + O₂ (methane)", "Ea": 150000, "A": 1e13},
    {"name": "Wood + O₂ (slow burn)", "Ea": 200000, "A": 1e14},
    {"name": "Fe + O₂ (rusting)", "Ea": 270000, "A": 1e15},
]

T = np.linspace(300, 1500, 500)  # Kelvin

plt.figure(figsize=(10, 6))
for rxn in reactions:
    k = rxn["A"] * np.exp(-rxn["Ea"] / (R * T))
    k_norm = k / k.max()  # normalise for comparison
    plt.plot(T - 273.15, k_norm, linewidth=2.5, label=f"{rxn['name']} (Ea={rxn['Ea']/1000:.0f} kJ)")

plt.xlabel('Temperature (°C)', fontsize=12)
plt.ylabel('Relative reaction rate', fontsize=12)
plt.title('Arrhenius Equation: Reaction Rate vs Temperature', fontsize=14)
plt.legend(fontsize=9)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

# Arrhenius plot (ln(k) vs 1/T) - should be linear
plt.figure(figsize=(10, 5))
for rxn in reactions:
    k = rxn["A"] * np.exp(-rxn["Ea"] / (R * T))
    plt.plot(1000/T, np.log(k), linewidth=2, label=rxn["name"])

plt.xlabel('1000/T (K⁻¹)', fontsize=12)
plt.ylabel('ln(k)', fontsize=12)
plt.title('Arrhenius Plot: ln(k) vs 1/T (linear = Arrhenius behaviour)', fontsize=14)
plt.legend(fontsize=9)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

print("Lower Ea = reaction starts at lower temperature")
print("The Arrhenius plot is linear: slope = -Ea/R")
print("This is how chemists measure activation energies experimentally")`,
      challenge: 'A reaction’s rate doubles when temperature increases from 300 K to 310 K. Use the Arrhenius equation to find the activation energy. Hint: k₂/k₁ = exp((E_a/R)(1/T₁ - 1/T₂)) = 2.',
      successHint: 'The Arrhenius equation is one of the most important in chemistry. It connects molecular energy distributions to macroscopic reaction rates. Every chemical process — from drug metabolism to steel corrosion to rocket propulsion — obeys this law.',
    },
    {
      title: 'Computational flame simulation — 1D reaction-diffusion',
      concept: `Real flames involve the interplay of chemical reaction and heat diffusion. A simplified model uses the **reaction-diffusion equation**:

**∂T/∂t = α ∂²T/∂x² + Q × R(T)**

Where the first term is heat diffusion (thermal conductivity spreading heat) and the second term is heat production from combustion (which depends on temperature through the Arrhenius equation).

This creates a fascinating dynamic: the reaction produces heat, which diffuses ahead of the flame front, pre-heating fresh fuel, which then ignites. The flame propagates as a self-sustaining wave.

In the code, you’ll implement a simple 1D flame propagation simulation using finite differences. You will see the flame front advance through fuel as a travelling wave.`,
      analogy: 'A flame front is like a line of dominoes falling. Each domino (fuel element) is knocked over by its neighbour (heat diffusion), and as it falls, it pushes the next one (reaction heat production). The "wave" of falling dominoes is the flame front. The speed depends on how fast each domino falls (reaction rate) and how far ahead it can push (thermal diffusion).',
      storyConnection: 'The spread of fire through the arranged wood in a yajna pit is a reaction-diffusion process. The priests arranged fuel in geometric patterns (agni kund designs) that controlled flame propagation. Tighter patterns with more surface area burned faster; looser patterns with air gaps burned slower. They were empirically tuning the diffusion term.',
      checkQuestion: 'Forest fires can "jump" across gaps (roads, rivers). How is this possible if fire needs direct contact?',
      checkAnswer: 'Radiation. Intense fires radiate so much infrared energy that they can ignite fuel metres away without direct contact. At ~1,000°C, a forest fire radiates enough energy to ignite dry vegetation 20-50 metres ahead. Additionally, burning embers (firebrands) can be lofted by convection currents and carried by wind kilometres ahead of the main fire front, starting "spot fires." This is why firebreaks must be very wide to be effective against intense fires.',
      codeIntro: 'Simulate 1D flame propagation as a reaction-diffusion wave.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D reaction-diffusion flame model
# dT/dt = alpha * d2T/dx2 + Q * R(T)

N = 200          # spatial grid points
L = 1.0          # domain length (m)
dx = L / N
dt = 0.00001     # time step (s)
alpha = 0.0002   # thermal diffusivity (m²/s)

T_ambient = 300  # K
T_ignition = 600 # K (ignition threshold)
Q = 50000        # heat source strength
Ea = 80000       # activation energy (J/mol)
R_gas = 8.314

# Initial conditions: fuel at ambient temp, ignition at left end
T = np.ones(N) * T_ambient
T[:5] = 1200  # ignite left edge

# Store snapshots
snapshots = []
snap_times = [0, 500, 1500, 3000, 5000]

for step in range(5001):
    # Diffusion (second derivative)
    d2T = np.zeros(N)
    d2T[1:-1] = (T[2:] - 2*T[1:-1] + T[:-2]) / dx**2

    # Reaction (Arrhenius-like, only where T > ignition threshold)
    reaction = np.zeros(N)
    hot = T > T_ignition
    if hot.any():
        reaction[hot] = Q * np.exp(-Ea / (R_gas * T[hot]))

    # Update temperature
    T = T + dt * (alpha * d2T + reaction)
    T = np.clip(T, T_ambient, 2500)  # prevent runaway

    # Boundary conditions
    T[0] = T_ambient
    T[-1] = T_ambient

    if step in snap_times:
        snapshots.append(T.copy())

# Plot snapshots
x = np.linspace(0, L * 100, N)  # convert to cm
plt.figure(figsize=(10, 6))
colors = ['#3b82f6', '#22c55e', '#fbbf24', '#f97316', '#ef4444']
for T_snap, t, color in zip(snapshots, snap_times, colors):
    plt.plot(x, T_snap, linewidth=2, label=f't = {t} steps', color=color)

plt.axhline(T_ignition, color='white', linewidth=1, linestyle=':', alpha=0.3)
plt.text(80, T_ignition + 30, 'Ignition threshold', fontsize=9, color='lightgray')

plt.xlabel('Position (cm)', fontsize=12)
plt.ylabel('Temperature (K)', fontsize=12)
plt.title('1D Flame Propagation — Reaction-Diffusion Wave', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

print("The flame front moves left to right as a travelling wave.")
print("Heat diffuses ahead, pre-heating fuel above ignition threshold.")
print("The reaction then releases more heat, sustaining the wave.")`,
      challenge: 'Try doubling the thermal diffusivity (alpha = 0.0004). Does the flame move faster or slower? Then try halving Q (less energetic fuel). What happens? These two parameters control flame speed in real fires.',
      successHint: 'Reaction-diffusion equations model phenomena from flame propagation to nerve impulses to animal coat patterns. The interplay between local reaction and spatial diffusion creates travelling waves, patterns, and instabilities. This is computational physics at its most elegant.',
    },
    {
      title: 'Emission spectroscopy analysis — stellar composition',
      concept: `Astronomers determine what stars are made of using the same principle as flame tests: each element absorbs or emits light at specific wavelengths. In a star, the hot interior emits a continuous blackbody spectrum, but cooler outer gases absorb specific wavelengths, creating dark **absorption lines** (Fraunhofer lines).

The Sun’s spectrum shows absorption lines for hydrogen, helium, sodium, calcium, iron, magnesium, and dozens of other elements. By measuring the depth and width of each line, astronomers can determine:
- **Which** elements are present (wavelength position)
- **How much** of each element (line depth/area)
- **How hot** the gas is (line width from thermal Doppler broadening)

In the code, you’ll simulate a stellar spectrum with absorption lines and build an analysis pipeline.`,
      analogy: 'A stellar spectrum is like a barcode on a product. The continuous blackbody radiation is the "white background," and the absorption lines are the "dark bars." Each element contributes bars at specific positions. Reading the barcode tells you the star’s chemical recipe.',
      storyConnection: 'Agni’s celestial form — the Sun — reveals its composition through spectroscopy. When Joseph Fraunhofer observed dark lines in sunlight in 1814, he was reading Agni’s chemical fingerprint. Helium was discovered in the Sun’s spectrum (1868) before it was found on Earth — named after Helios, the Greek sun god. Light from the cosmic Agni revealed an element unknown on Earth.',
      checkQuestion: 'The Doppler effect shifts spectral lines. If a star is moving toward us, are its lines blue-shifted or red-shifted? How do astronomers use this?',
      checkAnswer: 'Moving toward us = blue-shifted (shorter wavelengths). Moving away = red-shifted (longer wavelengths). Astronomers measure the shift of known spectral lines (e.g., hydrogen’s Balmer series at known wavelengths) and calculate the star’s radial velocity using v/c = Δλ/λ. This is how we discovered that the universe is expanding (Edwin Hubble, 1929): distant galaxies show redshifted spectra, meaning they are moving away from us.',
      codeIntro: 'Simulate a stellar spectrum with absorption lines and analyse its composition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Blackbody spectrum (simplified Planck function)
def blackbody(wl, T):
    lam = wl * 1e-9
    h, c, k = 6.626e-34, 3e8, 1.381e-23
    exp_term = np.clip(h * c / (lam * k * T), 0, 500)
    return (2 * h * c**2 / lam**5) / (np.exp(exp_term) - 1)

# Stellar parameters
T_star = 5778  # K (Sun-like)
wavelengths = np.linspace(380, 700, 2000)  # visible range (nm)

# Continuous spectrum
spectrum = blackbody(wavelengths, T_star)
spectrum = spectrum / spectrum.max()  # normalise

# Absorption lines (element, wavelength, depth, width)
absorption_lines = [
    ("Hα", 656.3, 0.4, 0.8),
    ("Hβ", 486.1, 0.3, 0.6),
    ("Hγ", 434.0, 0.2, 0.5),
    ("Na D1", 589.0, 0.5, 0.4),
    ("Na D2", 589.6, 0.45, 0.4),
    ("Ca K", 393.4, 0.6, 1.0),
    ("Ca H", 396.8, 0.5, 0.9),
    ("Fe", 430.8, 0.15, 0.3),
    ("Fe", 438.4, 0.12, 0.3),
    ("Mg", 518.4, 0.2, 0.4),
]

# Apply absorption lines
for name, center, depth, width in absorption_lines:
    absorption = depth * np.exp(-0.5 * ((wavelengths - center) / width) ** 2)
    spectrum *= (1 - absorption)

# Plot
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))

# Full spectrum
ax1.plot(wavelengths, spectrum, linewidth=1, color='#fef08a')
ax1.fill_between(wavelengths, spectrum, alpha=0.3, color='#fef08a')
for name, center, depth, width in absorption_lines:
    if 380 < center < 700:
        ax1.axvline(center, color='#ef4444', linewidth=0.8, alpha=0.5)
        ax1.text(center, 1.02, name, fontsize=8, ha='center',
                 color='lightgray', rotation=45)
ax1.set_xlabel('Wavelength (nm)', fontsize=11)
ax1.set_ylabel('Intensity', fontsize=11)
ax1.set_title('Simulated Solar Spectrum with Fraunhofer Lines', fontsize=14)
ax1.grid(alpha=0.1)

# Element abundance estimation (based on line depths)
elements = {}
for name, center, depth, width in absorption_lines:
    elem = name.split()[0] if ' ' in name else name.rstrip('0123456789αβγ')
    if elem not in elements:
        elements[elem] = 0
    elements[elem] += depth  # crude abundance proxy

elem_names = list(elements.keys())
abundances = list(elements.values())

ax2.barh(elem_names, abundances, color=['#3b82f6', '#fbbf24', '#ef4444', '#6b7280', '#22c55e'])
ax2.set_xlabel('Relative absorption strength (abundance proxy)', fontsize=11)
ax2.set_title('Estimated Element Abundances from Spectral Lines', fontsize=14)
ax2.grid(alpha=0.2)

plt.tight_layout()
plt.show()

print("Calcium and Hydrogen show the strongest absorption → most abundant")
print("This is how we know the Sun is ~73% hydrogen, ~25% helium,")
print("and ~2% heavier elements — all from reading its light.")`,
      challenge: 'Add a Doppler shift to simulate a star moving away at 100 km/s. Shift all absorption line centres by Δλ = λ × v/c. How much do the lines shift? Can you build a velocity-measuring function?',
      successHint: 'Spectral analysis is how we know the composition and motion of every star, galaxy, and nebula in the universe. The same electron transitions that colour a campfire flame reveal the chemistry of objects billions of light-years away.',
    },
    {
      title: 'Detonation vs deflagration — flame speed regimes',
      concept: `There are two fundamentally different modes of combustion propagation:

**Deflagration** (normal burning): The flame front travels at subsonic speeds (0.01-10 m/s). Heat diffuses ahead of the front, pre-heating fuel. This is what happens in candles, campfires, and car engines.

**Detonation**: The flame front travels at supersonic speeds (1,500-3,000 m/s). A shock wave compresses and heats the fuel ahead of the reaction zone, creating an extremely fast, self-sustaining wave. This is what happens in explosives and certain engine knock events.

The transition from deflagration to detonation (DDT) is a critical phenomenon in safety engineering. It explains why grain dust explosions in silos, gas leaks in mines, and vapour cloud explosions can be so devastating — they start as normal burns but can transition to detonation.

In the code, you’ll compare deflagration and detonation propagation speeds and pressures.`,
      analogy: 'Deflagration is like whispering a message down a line of people — each person turns to the next and speaks quietly (diffusion-driven). Detonation is like shouting so loud that the sound wave itself knocks each person over before they hear the message (shock-driven). Both transmit information, but the mechanism and speed are completely different.',
      storyConnection: 'The Vedic distinction between the steady sacrificial fire (controlled deflagration) and lightning (natural detonation) maps directly to this physics. Lightning is a detonation-like process: the electrical discharge superheats a narrow air channel to ~30,000 K in microseconds, creating a shock wave (thunder). The slow yajna and the instant lightning are both Agni, but in different propagation regimes.',
      checkQuestion: 'Why is a bullet fired from a gun a deflagration (not detonation), but dynamite is a detonation?',
      checkAnswer: 'Gunpowder in a cartridge burns as a deflagration (subsonic flame front, ~400 m/s). The expanding gas pushes the bullet, but the reaction front does not outrun sound. Dynamite contains nitroglycerin, which detonates (supersonic reaction front, ~7,700 m/s). The shock wave shatters rather than pushes. The key difference is whether the reaction front is subsonic (deflagration, pressure builds gradually) or supersonic (detonation, instantaneous pressure spike). This is why dynamite is shattering and gunpowder is propelling.',
      codeIntro: 'Compare deflagration and detonation wave properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Flame propagation comparison
substances = [
    {"name": "Candle", "speed": 0.02, "peak_P": 1.01, "mode": "Deflagration"},
    {"name": "Methane-air", "speed": 0.4, "peak_P": 8, "mode": "Deflagration"},
    {"name": "Hydrogen-air", "speed": 3.5, "peak_P": 8, "mode": "Deflagration"},
    {"name": "Grain dust", "speed": 10, "peak_P": 10, "mode": "Deflagration/DDT"},
    {"name": "H₂ detonation", "speed": 1980, "peak_P": 20, "mode": "Detonation"},
    {"name": "TNT", "speed": 6900, "peak_P": 210, "mode": "Detonation"},
    {"name": "C-4 explosive", "speed": 8050, "peak_P": 340, "mode": "Detonation"},
]

# Speed comparison (log scale)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

names = [s["name"] for s in substances]
speeds = [s["speed"] for s in substances]
pressures = [s["peak_P"] for s in substances]
colors = ['#86efac' if s["mode"] == "Deflagration" else
          '#fbbf24' if 'DDT' in s["mode"] else '#ef4444'
          for s in substances]

ax1.barh(names, speeds, color=colors)
ax1.set_xscale('log')
ax1.axvline(343, color='white', linewidth=1.5, linestyle='--', alpha=0.5)
ax1.text(343, -0.5, 'Speed of\\nsound', fontsize=9, color='lightgray', ha='center')
ax1.set_xlabel('Flame speed (m/s) — log scale', fontsize=11)
ax1.set_title('Flame Propagation Speed', fontsize=13)
ax1.grid(alpha=0.2)

ax2.barh(names, pressures, color=colors)
ax2.set_xscale('log')
ax2.set_xlabel('Peak pressure (atm) — log scale', fontsize=11)
ax2.set_title('Peak Pressure', fontsize=13)
ax2.grid(alpha=0.2)

# Legend
from matplotlib.patches import Patch
legend_elements = [
    Patch(facecolor='#86efac', label='Deflagration (subsonic)'),
    Patch(facecolor='#fbbf24', label='DDT transition'),
    Patch(facecolor='#ef4444', label='Detonation (supersonic)'),
]
ax2.legend(handles=legend_elements, fontsize=9, loc='lower right')

plt.tight_layout()
plt.show()

# Wave profile comparison
x = np.linspace(0, 10, 500)
t = 5  # time snapshot

# Deflagration: smooth pressure rise
P_deflag = 1 + 7 * 0.5 * (1 + np.tanh(3 * (x - 3)))
T_deflag = 300 + 700 * 0.5 * (1 + np.tanh(3 * (x - 3)))

# Detonation: sharp shock front
P_deton = 1 + 200 * np.where(x > 7, np.exp(-5 * (x - 7)), 0)
P_deton += 1 + 200 * np.where(x < 7, np.exp(-0.5 * (7 - x)), 0) * (x > 6)

fig2, ax3 = plt.subplots(figsize=(10, 5))
ax3.plot(x, P_deflag, linewidth=2.5, color='#86efac', label='Deflagration (gradual)')
ax3.plot(x, np.clip(P_deton, 1, 250), linewidth=2.5, color='#ef4444', label='Detonation (shock)')
ax3.set_xlabel('Position', fontsize=12)
ax3.set_ylabel('Pressure (atm)', fontsize=12)
ax3.set_title('Pressure Profiles: Deflagration vs Detonation', fontsize=14)
ax3.legend(fontsize=10)
ax3.grid(alpha=0.2)
plt.tight_layout()
plt.show()

print("Deflagration: subsonic, gradual pressure rise, heat-diffusion driven")
print("Detonation: supersonic, sharp shock front, compression-driven")
print("DDT (deflagration-to-detonation transition) is the critical safety concern")`,
      challenge: 'Research the Chapman-Jouguet detonation velocity for hydrogen-air mixtures. Calculate it from: D_CJ = sqrt(γ × R × T_CJ / M), where γ=1.2, T_CJ=2,800 K, M=0.018 kg/mol. Does your answer match the table value?',
      successHint: 'Understanding the difference between deflagration and detonation is critical for safety engineering, mining, chemical processing, and military science. The same Agni can be a gentle cooking flame or a devastating explosion — the difference is propagation speed.',
    },
    {
      title: 'Radiative transfer — how fire heats distant objects',
      concept: `When a fire radiates heat, not all of it reaches you. The radiation must travel through the atmosphere, where it is partially absorbed and scattered. The **Beer-Lambert law** describes this attenuation:

**I(x) = I₀ × e^(-αx)**

Where I₀ = initial intensity, α = absorption coefficient, and x = distance.

Additionally, the radiation received depends on geometry: intensity falls off as **1/r²** (inverse square law). Combined with atmospheric absorption:

**I(r) = I₀ / (4πr²) × e^(-αr)**

This explains why you feel a campfire’s heat at 2 metres but not at 20. And why a forest fire can still radiate enough to ignite objects 30 metres away — the inverse square law drops intensity, but the initial power is enormous.

In the code, you’ll model radiative heat transfer from fires of different sizes and calculate safe distances.`,
      analogy: 'Radiation from a fire is like the sound from a speaker. Close up, it is overwhelming. Walk away and it drops rapidly (inverse square law). If there are walls or trees in between, they absorb some of the sound (Beer-Lambert attenuation). The "safe distance" from a fire is where the received intensity drops below a threshold — just like finding the distance where music becomes inaudible.',
      storyConnection: 'The Vedic fire pit’s design included a surrounding wall of clay bricks. These served dual purposes: reflecting radiation back into the pit (increasing internal temperature) and shielding observers from excessive radiative heat. The priests stood close enough to feel warmth but far enough to be safe — they were empirically finding the inverse-square sweet spot.',
      checkQuestion: 'Firefighters sometimes deploy reflective "fire shelters" as a last resort. Why does a reflective surface help against radiative heat?',
      checkAnswer: 'Reflective surfaces have low emissivity (ε), meaning they absorb less radiation and reflect most of it away. A polished aluminium surface reflects ~95% of infrared radiation, so a fire shelter absorbs only ~5% of the incoming radiant heat. This buys critical time (minutes, not hours) in an overrun situation. The shelter also provides an insulating air gap (convection barrier). Note: it only helps against radiation; direct flame contact (convection + conduction) overwhelms the shelter quickly.',
      codeIntro: 'Model radiative heat transfer from fires and calculate safe distances.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Radiative intensity: I = P / (4*pi*r^2) * exp(-alpha*r)
sigma = 5.67e-8  # Stefan-Boltzmann constant
alpha_air = 0.001  # atmospheric absorption coefficient (1/m)

# Different fire sizes
fires = [
    {"name": "Candle", "T": 1300, "area": 0.001},
    {"name": "Campfire", "T": 1100, "area": 0.3},
    {"name": "Bonfire", "T": 1200, "area": 2.0},
    {"name": "House fire", "T": 1100, "area": 50},
    {"name": "Forest fire front", "T": 1200, "area": 500},
]

r = np.linspace(0.5, 100, 1000)  # distance (m)

# Pain threshold for skin: ~2 kW/m² (can’t stand more than a few seconds)
# Ignition threshold for wood: ~12 kW/m²

plt.figure(figsize=(12, 6))
for fire in fires:
    P = sigma * fire["area"] * fire["T"]**4  # total power (W)
    I = P / (4 * np.pi * r**2) * np.exp(-alpha_air * r)  # W/m²
    I_kW = I / 1000
    plt.plot(r, I_kW, linewidth=2.5, label=f"{fire['name']} ({P/1000:.0f} kW)")

plt.axhline(2, color='#fbbf24', linewidth=1.5, linestyle='--', alpha=0.5)
plt.text(80, 2.3, 'Pain threshold (2 kW/m²)', fontsize=9, color='#fbbf24')
plt.axhline(12, color='#ef4444', linewidth=1.5, linestyle='--', alpha=0.5)
plt.text(80, 12.5, 'Wood ignition (12 kW/m²)', fontsize=9, color='#ef4444')

plt.xlabel('Distance from fire (m)', fontsize=12)
plt.ylabel('Received intensity (kW/m²)', fontsize=12)
plt.title('Radiative Heat Flux vs Distance', fontsize=14)
plt.yscale('log')
plt.legend(fontsize=9)
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()

# Calculate safe distances
print("\\n=== Safe Distance Calculator ===")
print(f"{'Fire':<22} {'Power (kW)':>12} {'Pain dist (m)':>14} {'Ignition dist (m)':>18}")
print("-" * 68)
for fire in fires:
    P = sigma * fire["area"] * fire["T"]**4
    # Solve: 2000 = P / (4*pi*r^2) for r (ignoring atmospheric absorption)
    r_pain = np.sqrt(P / (4 * np.pi * 2000))
    r_ignite = np.sqrt(P / (4 * np.pi * 12000))
    print(f"{fire['name']:<22} {P/1000:>12.1f} {r_pain:>14.1f} {r_ignite:>18.1f}")`,
      challenge: 'Add a "Wildfire" with T=1300 K and area=5,000 m². At what distance would you feel pain? At what distance could it ignite a wooden building? Compare your answer to actual wildfire evacuation guidelines (typically 100-200 m minimum).',
      successHint: 'Radiative transfer calculations are essential for firefighting, building codes (how far from a fire can a wall ignite?), spacecraft thermal design, and industrial furnace engineering. The inverse-square law and Beer-Lambert attenuation govern how energy propagates through space.',
    },
    {
      title: 'Capstone — build a complete combustion analysis tool',
      concept: `In this final mini-lesson, you’ll combine everything from all four levels into a single comprehensive combustion analysis tool:

1. **Input**: A hydrocarbon formula (CxHy)
2. **Balance** the combustion equation automatically
3. **Calculate** the heat of combustion from bond energies
4. **Estimate** flame temperature using adiabatic flame temperature
5. **Predict** the emission spectrum based on products
6. **Calculate** safe distance based on radiative output

This is a simplified version of what combustion engineers use to design engines, furnaces, and safety systems. Each step uses concepts from different levels: stoichiometry (L1), bond energies (L2), thermodynamics (L3), and radiation (L4).`,
      analogy: 'This capstone tool is like a flight simulator for combustion. A flight simulator combines aerodynamics, engine physics, weather, and control systems into one interactive model. Your combustion tool combines chemistry, thermodynamics, spectroscopy, and radiation into one analysis pipeline.',
      storyConnection: 'Agni, in the Vedic tradition, embodies the complete cycle of fire: chemical energy in fuel (dormant Agni) → activation by friction (birth of Agni) → combustion releasing heat and light (Agni the transformer) → radiation warming distant observers (Agni the messenger). Your capstone tool models this entire journey computationally.',
      checkQuestion: 'If you had to add one more feature to this tool, what would be the most useful for real-world application?',
      checkAnswer: 'Exhaust gas composition analysis. Real combustion engineers need to know not just energy output but exactly what comes out: CO₂, H₂O, CO (from incomplete combustion), NOx (from high-temperature nitrogen oxidation), and unburned hydrocarbons. This information is critical for emissions compliance, air quality regulation, and engine tuning. Adding a variable oxygen ratio (lean/rich mixture) would make the tool production-ready.',
      codeIntro: 'Build a complete combustion analysis pipeline for any hydrocarbon fuel.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === COMPLETE COMBUSTION ANALYSIS TOOL ===

def analyse_combustion(C, H, fuel_name="Unknown"):
    """Full combustion analysis for CxHy fuels."""
    print(f"{'='*50}")
    print(f"COMBUSTION ANALYSIS: {fuel_name} (C{C}H{H})")
    print(f"{'='*50}\\n")

    # 1. Balance equation: CxHy + (x + y/4)O2 -> xCO2 + (y/2)H2O
    o2_coeff = C + H / 4
    co2_coeff = C
    h2o_coeff = H / 2

    print(f"1. BALANCED EQUATION:")
    print(f"   C{C}H{H} + {o2_coeff}O₂ → {co2_coeff}CO₂ + {h2o_coeff}H₂O\\n")

    # 2. Bond energies (kJ/mol)
    E_CH = 413
    E_OO = 498
    E_CO = 805  # in CO2
    E_OH = 463

    broken = C * 0 + H * E_CH + o2_coeff * E_OO  # approximate
    # For CxHy: (C-1) C-C bonds + H C-H bonds
    E_CC = 347
    cc_bonds = max(0, C - 1)
    broken = cc_bonds * E_CC + H * E_CH + o2_coeff * E_OO
    formed = co2_coeff * 2 * E_CO + h2o_coeff * 2 * E_OH
    dH = -(formed - broken)

    print(f"2. ENERGY (Bond Energy Estimate):")
    print(f"   Bonds broken: {broken:.0f} kJ")
    print(f"   Bonds formed: {formed:.0f} kJ")
    print(f"   ΔH = {dH:.0f} kJ/mol (negative = exothermic)\\n")

    # 3. Adiabatic flame temperature estimate
    # T_ad = T_initial + |dH| / (n_products * Cp)
    Cp_avg = 40  # J/(mol*K) average for products
    n_products = co2_coeff + h2o_coeff
    T_ad = 298 + abs(dH) * 1000 / (n_products * Cp_avg)

    print(f"3. FLAME TEMPERATURE (Adiabatic):")
    print(f"   T_ad ≈ {T_ad:.0f} K ({T_ad - 273:.0f}°C)\\n")

    # 4. Radiation
    sigma = 5.67e-8
    A_flame = 0.1  # m² (small burner)
    P_rad = sigma * A_flame * T_ad**4
    r_safe = np.sqrt(P_rad / (4 * np.pi * 2000))

    print(f"4. RADIATION (for {A_flame} m² flame):")
    print(f"   Radiated power: {P_rad:.1f} W")
    print(f"   Safe distance (pain): {r_safe:.2f} m\\n")

    return {"dH": dH, "T_ad": T_ad, "P_rad": P_rad, "name": fuel_name}

# Analyse several fuels
fuels = [
    (1, 4, "Methane"),
    (2, 6, "Ethane"),
    (3, 8, "Propane"),
    (8, 18, "Octane"),
]

results = []
for C, H, name in fuels:
    r = analyse_combustion(C, H, name)
    results.append(r)

# Comparative plot
fig, axes = plt.subplots(1, 3, figsize=(14, 5))

names = [r["name"] for r in results]
colors = ['#3b82f6', '#8b5cf6', '#f97316', '#ef4444']

axes[0].bar(names, [abs(r["dH"]) for r in results], color=colors)
axes[0].set_ylabel('|ΔH| (kJ/mol)', fontsize=11)
axes[0].set_title('Heat of Combustion', fontsize=13)
axes[0].grid(alpha=0.2)

axes[1].bar(names, [r["T_ad"] for r in results], color=colors)
axes[1].set_ylabel('T (K)', fontsize=11)
axes[1].set_title('Adiabatic Flame Temp', fontsize=13)
axes[1].grid(alpha=0.2)

axes[2].bar(names, [r["P_rad"] for r in results], color=colors)
axes[2].set_ylabel('Power (W)', fontsize=11)
axes[2].set_title('Radiated Power', fontsize=13)
axes[2].grid(alpha=0.2)

plt.suptitle('Comparative Combustion Analysis', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("\\nFrom methane to octane: larger molecules release more total energy")
print("but flame temperatures are similar (limited by product heat capacity).")
print("\\nYou have built a combustion engineer’s toolkit — Agni, quantified.")`,
      challenge: 'Extend the tool to handle oxygenated fuels (CxHyOz) like ethanol (C₂H₆O). The balanced equation becomes: CxHyOz + (x + y/4 - z/2)O₂ → xCO₂ + (y/2)H₂O. Add ethanol and methanol to the comparison.',
      successHint: 'You have built a complete combustion analysis pipeline from first principles. This integrates stoichiometry, bond energies, thermodynamics, and radiation physics into a single tool. Real combustion engineering software (CHEMKIN, Cantera) does exactly this at much higher fidelity. The Vedic Agni — fire as transformer — is now fully quantified.',
    },
  ];

  const diagrams = [EnergyProfileDiagram, MolecularMotionDiagram, AgniSpectroscopyDiagram, AgniCombustionTriangleDiagram, AgniHeatTransferDiagram, AgniFlameColorDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced combustion science and engineering</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced combustion modelling and analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
