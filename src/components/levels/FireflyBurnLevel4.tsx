import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FireflyBurnLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: Bioluminescence Efficiency Calculator',
      concept: `Our capstone is a **Bioluminescence Efficiency Calculator** — a tool that takes the parameters of any chemiluminescent system (substrate concentration, enzyme kinetics, quantum yield, emission wavelength) and computes the complete energy budget: chemical energy input, light energy output, heat waste, photon flux, and cost-per-photon.

This has real applications in biotechnology: designing brighter reporter genes for medical imaging, optimizing ATP hygiene assays for maximum sensitivity, engineering bio-LEDs, and evaluating the economic viability of bioluminescent lighting systems. The tool will accept inputs like luciferin concentration, luciferase activity, oxygen availability, and pH, then output photon production rate, spectral power distribution, luminous flux, and metabolic cost.

The six capstone lessons build: (1) the reaction kinetics engine, (2) the spectral emission model, (3) the quantum yield calculator, (4) the photon flux integrator, (5) a comparison dashboard across organisms, and (6) a design optimization tool for engineering applications.`,
      analogy: `Building this calculator is like designing a power plant efficiency monitor. The inputs are fuel type and consumption rate; the outputs are electrical power produced, heat wasted, and cost per kilowatt-hour. Our 'fuel' is luciferin, our 'electricity' is photons, and our efficiency metric is quantum yield.`,
      storyConnection: `The fireflies that don\'t burn have inspired a tool that can evaluate ANY bioluminescent system — from deep-sea anglerfish to engineered glowing plants. The calculator bridges the gap between the wonder of watching fireflies and the quantitative engineering needed to harness their chemistry.`,
      checkQuestion: `What makes a bioluminescence efficiency calculator different from a simple quantum yield measurement?`,
      checkAnswer: `Quantum yield is a single number (photons per reaction). The calculator goes further: it computes the full energy budget including ATP cost of luciferin synthesis, oxygen consumption, heat generation, spectral distribution of emitted light, luminous efficacy (how useful the light is to human eyes or photosensors), and the steady-state photon flux at given substrate concentrations. It answers 'how bright, how long, and at what cost?' — not just 'what fraction of reactions produce photons.'`,
      codeIntro: `Define the calculator architecture, implement the reaction kinetics engine, and generate synthetic data for testing.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# =============================================
# BIOLUMINESCENCE EFFICIENCY CALCULATOR — v1.0
# =============================================

class BiolumCalculator:
    """Complete bioluminescence efficiency analysis tool."""

    # Reaction parameters database
    SYSTEMS = {
        'firefly': {
            'name': 'Firefly (Photinus pyralis)',
            'Vmax': 1.0,        # normalized max rate
            'Km_luciferin': 0.5, # mM
            'Km_ATP': 0.1,       # mM
            'Km_O2': 0.05,       # mM
            'quantum_yield': 0.41,
            'peak_nm': 560,
            'width_nm': 40,
            'atp_per_reaction': 1,
            'atp_per_synthesis': 8,
        },
        'jellyfish': {
            'name': 'Jellyfish (Aequorea victoria)',
            'Vmax': 0.6,
            'Km_luciferin': 0.8,
            'Km_ATP': 0.0,       # no ATP required
            'Km_O2': 0.1,
            'quantum_yield': 0.23,
            'peak_nm': 509,
            'width_nm': 30,
            'atp_per_reaction': 0,
            'atp_per_synthesis': 5,
        },
        'dinoflagellate': {
            'name': 'Dinoflagellate',
            'Vmax': 0.3,
            'Km_luciferin': 1.0,
            'Km_ATP': 0.0,
            'Km_O2': 0.15,
            'quantum_yield': 0.10,
            'peak_nm': 475,
            'width_nm': 25,
            'atp_per_reaction': 0,
            'atp_per_synthesis': 6,
        },
    }

    def __init__(self, system='firefly'):
        self.params = self.SYSTEMS[system].copy()

    def reaction_rate(self, luciferin, atp=2.0, o2=0.25):
        """Michaelis-Menten rate with multiple substrates."""
        p = self.params
        rate = p['Vmax']
        rate *= luciferin / (p['Km_luciferin'] + luciferin)
        if p['Km_ATP'] > 0:
            rate *= atp / (p['Km_ATP'] + atp)
        rate *= o2 / (p['Km_O2'] + o2)
        return rate

    def photon_rate(self, luciferin, atp=2.0, o2=0.25):
        return self.reaction_rate(luciferin, atp, o2) * self.params['quantum_yield']

    def emission_spectrum(self, wavelengths):
        p = self.params
        return np.exp(-0.5 * ((wavelengths - p['peak_nm']) / p['width_nm'])**2)

# Test the calculator
calc = BiolumCalculator('firefly')
conc_range = np.linspace(0, 5, 200)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bioluminescence Efficiency Calculator — Reaction Engine',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Reaction rate vs luciferin
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for sys_name, color in [('firefly', '#22c55e'), ('jellyfish', '#06b6d4'), ('dinoflagellate', '#a855f7')]:
    c = BiolumCalculator(sys_name)
    rates = [c.reaction_rate(conc) for conc in conc_range]
    ax.plot(conc_range, rates, color=color, linewidth=2.5, label=c.params['name'][:20])
ax.set_xlabel('Luciferin concentration (mM)', color='white')
ax.set_ylabel('Reaction rate (normalized)', color='white')
ax.set_title('Michaelis-Menten kinetics', color='white')
ax.legend(fontsize=8)

# Panel 2: Photon rate (rate * quantum yield)
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for sys_name, color in [('firefly', '#22c55e'), ('jellyfish', '#06b6d4'), ('dinoflagellate', '#a855f7')]:
    c = BiolumCalculator(sys_name)
    photons = [c.photon_rate(conc) for conc in conc_range]
    ax.plot(conc_range, photons, color=color, linewidth=2.5, label=c.params['name'][:20])
ax.set_xlabel('Luciferin concentration (mM)', color='white')
ax.set_ylabel('Photon production rate (normalized)', color='white')
ax.set_title('Photon output = rate × quantum yield', color='white')
ax.legend(fontsize=8)

# Panel 3: Emission spectra
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
wl = np.linspace(400, 700, 200)
for sys_name, color in [('firefly', '#22c55e'), ('jellyfish', '#06b6d4'), ('dinoflagellate', '#a855f7')]:
    c = BiolumCalculator(sys_name)
    spec = c.emission_spectrum(wl) * c.params['quantum_yield']
    ax.fill_between(wl, 0, spec, color=color, alpha=0.3)
    ax.plot(wl, spec, color=color, linewidth=2, label=c.params['name'][:20])
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Spectral power (normalized × QY)', color='white')
ax.set_title('Emission spectra scaled by efficiency', color='white')
ax.legend(fontsize=8)

# Panel 4: ATP cost comparison
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
sys_names = list(BiolumCalculator.SYSTEMS.keys())
atp_costs = []
labels_a = []
for s in sys_names:
    p = BiolumCalculator.SYSTEMS[s]
    total_atp = p['atp_per_reaction'] + p['atp_per_synthesis']
    photons_per_atp = p['quantum_yield'] / max(total_atp, 0.1)
    atp_costs.append(total_atp)
    labels_a.append(p['name'][:20])
colors_a = ['#22c55e', '#06b6d4', '#a855f7']
bars = ax.bar(labels_a, atp_costs, color=colors_a, alpha=0.8)
for bar, v in zip(bars, atp_costs):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
            f'{v} ATP', color='white', fontsize=10, ha='center')
ax.set_ylabel('ATP molecules per photon attempt', color='white')
ax.set_title('Metabolic cost per bioluminescent event', color='white')

plt.tight_layout()
plt.show()

print("Calculator initialized with 3 bioluminescent systems")
print(f"Systems: {', '.join(sys_names)}")
for s in sys_names:
    p = BiolumCalculator.SYSTEMS[s]
    print(f"  {p['name']}: QY={p['quantum_yield']:.0%}, peak={p['peak_nm']}nm, ATP cost={p['atp_per_reaction']+p['atp_per_synthesis']}")`,
      challenge: `Add two more organisms to the database: click beetle (Pyrophorus, QY=0.38, peak=540nm) and fungi (Neonothopanus, QY=0.03, peak=530nm). Rerun the comparison to show how fungi sacrifice efficiency for continuous glow.`,
      successHint: `The calculator architecture separates data (organism parameters) from computation (kinetics engine) from visualization (dashboard). This clean separation makes it easy to add new organisms or modify the physics without rewriting the entire system.`,
    },
    {
      title: 'Spectral Power Distribution & Color Science',
      concept: `The spectral power distribution (SPD) describes how a light source distributes its energy across wavelengths. For bioluminescence, the SPD is determined by the emission spectrum of the excited-state molecule (oxyluciferin). Converting an SPD to perceived color requires the CIE color matching functions — three curves (x-bar, y-bar, z-bar) that describe how the human eye's cone cells respond to each wavelength.

The tristimulus values X, Y, Z are computed by integrating the product of the SPD with each color matching function: X = integral(SPD * x_bar), Y = integral(SPD * y_bar), Z = integral(SPD * z_bar). The Y value also represents luminance (perceived brightness). Converting XYZ to sRGB for display involves a matrix transformation followed by gamma correction.

For our calculator, computing the perceived color of each bioluminescent system allows direct visual comparison: firefly emission appears yellow-green, jellyfish appears cyan-green, and deep-sea organisms appear blue. The luminous efficacy (lumens per watt of radiant power) is computed as: K = 683 * integral(SPD * V_lambda) / integral(SPD), where V_lambda is the photopic luminosity function (which peaks at 555 nm). Sources with emission near 555 nm have higher luminous efficacy — which is one reason firefly emission evolved near this peak.`,
      analogy: `The SPD-to-color conversion is like translating a foreign language. The SPD is the 'foreign text' (light described in physics terms — power at each wavelength). The color matching functions are the 'dictionary' (how the eye translates wavelengths to neural signals). The resulting XYZ values are the 'translation' (perceived color). Different SPDs can produce the same perceived color (metamerism) — just as different foreign phrases can translate to the same English meaning.`,
      storyConnection: `The yellow-green glow of the fireflies in the story is not an arbitrary color — it is precisely tuned by evolution to maximize visibility. The peak at 560 nm is close to the 555 nm peak of human photopic vision and even closer to the 507 nm peak of scotopic (night) vision. The firefly's emission is optimized for the vision of potential mates, not for human observers.`,
      checkQuestion: `Why does firefly emission peak at 560 nm rather than 555 nm (the peak of human photopic sensitivity)?`,
      checkAnswer: `Fireflies are active at dusk and night when scotopic (rod-mediated) vision dominates. Scotopic sensitivity peaks at 507 nm. The firefly's 560 nm peak is a compromise between maximizing visibility to dark-adapted eyes (which would favor shorter wavelengths) and the chemical constraints of the luciferin emission (which naturally favors 560 nm). The emission is close to both the scotopic and photopic peaks, making it visible in both dim and moderate light conditions — a broad-spectrum optimization.`,
      codeIntro: `Compute the SPD, CIE tristimulus values, sRGB color, and luminous efficacy for each bioluminescent system.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Spectral Power Distribution & Color Science ---

h = 6.626e-34; c_light = 3e8; eV = 1.602e-19
wl = np.linspace(380, 780, 200)  # visible range

# Approximate CIE 1931 color matching functions (Gaussian fits)
def cie_x(w): return 1.056*np.exp(-0.5*((w-599.8)/33.33)**2) + 0.362*np.exp(-0.5*((w-442.0)/16.0)**2) - 0.065*np.exp(-0.5*((w-501.1)/20.4)**2)
def cie_y(w): return 0.821*np.exp(-0.5*((w-568.8)/46.9)**2) + 0.286*np.exp(-0.5*((w-530.9)/16.3)**2)
def cie_z(w): return 1.217*np.exp(-0.5*((w-437.0)/11.8)**2) + 0.681*np.exp(-0.5*((w-459.0)/26.0)**2)

# Photopic luminosity function V(lambda) ≈ y_bar normalized
V_lambda = cie_y(wl)
V_lambda /= V_lambda.max()

x_bar = np.clip(cie_x(wl), 0, None)
y_bar = np.clip(cie_y(wl), 0, None)
z_bar = np.clip(cie_z(wl), 0, None)

# Bioluminescent systems
systems = {
    'Firefly': {'peak': 560, 'width': 40, 'qy': 0.41, 'color': '#22c55e'},
    'Jellyfish GFP': {'peak': 509, 'width': 30, 'qy': 0.23, 'color': '#06b6d4'},
    'Dinoflagellate': {'peak': 475, 'width': 25, 'qy': 0.10, 'color': '#3b82f6'},
    'Click beetle': {'peak': 540, 'width': 45, 'qy': 0.38, 'color': '#f59e0b'},
    'Deep-sea shrimp': {'peak': 470, 'width': 35, 'qy': 0.15, 'color': '#a855f7'},
    'Railroad worm (red)': {'peak': 623, 'width': 35, 'qy': 0.08, 'color': '#ef4444'},
}

def spd(wl_arr, peak, width, qy):
    return qy * np.exp(-0.5 * ((wl_arr - peak) / width)**2)

def xyz_to_srgb(X, Y, Z):
    # XYZ to linear sRGB
    r = 3.2406*X - 1.5372*Y - 0.4986*Z
    g = -0.9689*X + 1.8758*Y + 0.0415*Z
    b = 0.0557*X - 0.2040*Y + 1.0570*Z
    # Gamma correction
    def gamma(v): return np.where(v <= 0.0031308, 12.92*v, 1.055*v**(1/2.4) - 0.055)
    return np.clip([gamma(r), gamma(g), gamma(b)], 0, 1)

results = {}
for name, params in systems.items():
    s = spd(wl, params['peak'], params['width'], params['qy'])
    X = np.trapz(s * x_bar, wl)
    Y = np.trapz(s * y_bar, wl)
    Z = np.trapz(s * z_bar, wl)
    total = X + Y + Z
    if total > 0:
        x_chrom = X / total; y_chrom = Y / total
    else:
        x_chrom = y_chrom = 0.33
    rgb = xyz_to_srgb(X/max(Y, 0.001), 1.0, Z/max(Y, 0.001))
    lum_eff = 683 * np.trapz(s * V_lambda, wl) / max(np.trapz(s, wl), 1e-10)
    results[name] = {'X': X, 'Y': Y, 'Z': Z, 'x': x_chrom, 'y': y_chrom,
                     'rgb': tuple(rgb), 'lum_eff': lum_eff, 'spd': s}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Spectral Analysis & Color Science of Bioluminescence',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: SPDs with CIE functions overlay
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(wl, x_bar/x_bar.max()*0.3, color='#ef4444', linewidth=1, alpha=0.3, label='CIE x̄')
ax.plot(wl, y_bar/y_bar.max()*0.3, color='#22c55e', linewidth=1, alpha=0.3, label='CIE ȳ')
ax.plot(wl, z_bar/z_bar.max()*0.3, color='#3b82f6', linewidth=1, alpha=0.3, label='CIE z̄')
for name, r in results.items():
    ax.plot(wl, r['spd'], color=systems[name]['color'], linewidth=2, label=name)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Spectral power (norm)', color='white')
ax.set_title('Emission spectra with CIE functions', color='white')
ax.legend(fontsize=6)

# Panel 2: CIE chromaticity diagram
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
# Plot spectral locus
mono_x = [cie_x(w)/(cie_x(w)+cie_y(w)+cie_z(w)+1e-10) for w in range(380, 781, 5)]
mono_y = [cie_y(w)/(cie_x(w)+cie_y(w)+cie_z(w)+1e-10) for w in range(380, 781, 5)]
ax.plot(mono_x, mono_y, color='gray', linewidth=1, alpha=0.5)
for name, r in results.items():
    ax.scatter(r['x'], r['y'], color=systems[name]['color'], s=100, zorder=10,
               edgecolors='white', linewidth=1.5)
    ax.annotate(name[:10], (r['x'], r['y']), textcoords="offset points",
                xytext=(5, 5), color='white', fontsize=7)
ax.scatter([0.3127], [0.3290], color='white', s=50, marker='+', zorder=10)
ax.text(0.32, 0.34, 'D65', color='white', fontsize=8)
ax.set_xlabel('CIE x', color='white')
ax.set_ylabel('CIE y', color='white')
ax.set_title('CIE 1931 chromaticity diagram', color='white')
ax.set_xlim(0, 0.8); ax.set_ylim(0, 0.9)

# Panel 3: Luminous efficacy
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names_le = list(results.keys())
le_vals = [results[n]['lum_eff'] for n in names_le]
colors_le = [systems[n]['color'] for n in names_le]
bars = ax.barh(names_le, le_vals, color=colors_le, alpha=0.8)
ax.axvline(683, color='white', linewidth=1, linestyle='--', alpha=0.3)
ax.text(683, -0.5, 'Max possible\n(555 nm mono)', color='gray', fontsize=7)
for bar, v in zip(bars, le_vals):
    ax.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
            f'{v:.0f} lm/W', color='white', fontsize=9, va='center')
ax.set_xlabel('Luminous efficacy (lm/W of radiant power)', color='white')
ax.set_title('How well does each emission match human vision?', color='white')

# Panel 4: Color swatches
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for i, (name, r) in enumerate(results.items()):
    rect = plt.Rectangle((0, i*0.8), 3, 0.6, facecolor=r['rgb'], edgecolor='white', linewidth=0.5)
    ax.add_patch(rect)
    ax.text(3.2, i*0.8 + 0.3, f"{name}: RGB=({r['rgb'][0]:.2f},{r['rgb'][1]:.2f},{r['rgb'][2]:.2f})",
            color='white', fontsize=8, va='center')
ax.set_xlim(-0.5, 10); ax.set_ylim(-0.5, len(results)*0.8 + 0.5)
ax.set_title('Perceived colors (sRGB)', color='white')
ax.axis('off')

plt.tight_layout()
plt.show()

print("Color science results:")
for name, r in results.items():
    print(f"  {name}: CIE({r['x']:.3f},{r['y']:.3f}), efficacy={r['lum_eff']:.0f} lm/W")`,
      challenge: `Add scotopic luminous efficacy (using rod sensitivity peaking at 507 nm) alongside photopic. Compare which organism is most visible in daylight vs at night.`,
      successHint: `Color science reveals why firefly emission is so effective: it is optimized for maximum luminous efficacy, producing more perceived brightness per watt of radiant power than most artificial sources.`,
    },
    {
      title: 'Quantum Yield Measurement Simulator',
      concept: `Measuring quantum yield experimentally requires careful photon counting. The standard method uses a calibrated photomultiplier tube (PMT) or photodiode in an integrating sphere — a hollow sphere coated with a highly reflective diffuse material (barium sulfate) that ensures all emitted photons, regardless of direction, are eventually detected.

The quantum yield is calculated as: Phi = (photons detected / detector_efficiency) / (reactant molecules consumed). The detector efficiency includes geometric factors (solid angle captured), optical losses (window absorption, filter transmission), and quantum efficiency of the detector (fraction of incident photons that produce an electrical signal).

Noise sources in the measurement include: (1) dark current (thermal electrons in the detector), (2) stray light (photons from non-bioluminescent sources), (3) photobleaching (luciferase degradation during measurement), and (4) inner filter effect (at high concentrations, the luciferin itself absorbs emitted photons before they reach the detector).

Our simulator models all these effects, allowing the user to design an optimal measurement protocol: what concentration to use, how long to count, what detector to choose, and how to correct for systematic errors. This is how experimental physics works in practice — the measurement design is as important as the sample.`,
      analogy: `Measuring quantum yield is like counting raindrops. You place a bucket (integrating sphere) to catch all the rain (photons). You know how many clouds formed (reactions started). The yield is drops-caught / clouds-formed. But your bucket has a small hole (detector inefficiency), some rain evaporates before counting (photobleaching), and fog adds fake drops (dark current). Correcting for all these is the art of measurement.`,
      storyConnection: `The children in the story see fireflies as magic — each flash a tiny miracle. The quantum yield measurement turns this magic into numbers: exactly 41 out of every 100 luciferin molecules produce a detectable photon. The magic is not diminished by measurement; it is deepened — because now we know just how remarkable the firefly's chemistry truly is.`,
      checkQuestion: `A PMT detects 4100 photons from a sample containing 10^4 luciferin molecules (all consumed). The detector has 10% quantum efficiency and captures 5% of the solid angle. What is the true quantum yield?`,
      checkAnswer: `Detected photons = true_photons × detector_QE × geometric_factor. 4100 = true_photons × 0.10 × 0.05 = true_photons × 0.005. True photons = 4100 / 0.005 = 820,000. Quantum yield = 820,000 / 10,000 = 82. That\'s impossibly high (>1), indicating an error — likely the sample contained more than 10^4 molecules, or the geometric factor was higher. This illustrates why calibration is critical.`,
      codeIntro: `Build a quantum yield measurement simulator that models photon counting with realistic noise sources.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Quantum Yield Measurement Simulator ---
np.random.seed(42)

def simulate_qy_measurement(n_molecules, true_qy, detector_qe=0.15,
                             geometric_factor=0.05, dark_rate=10,
                             measurement_time=10.0, n_trials=1000):
    """Simulate quantum yield measurements with realistic noise."""
    # True photons emitted
    true_photons = np.random.binomial(n_molecules, true_qy, n_trials)
    # Detected photons (geometric and detector efficiency losses)
    detection_prob = detector_qe * geometric_factor
    detected = np.random.binomial(true_photons, detection_prob)
    # Dark current noise
    dark_counts = np.random.poisson(dark_rate * measurement_time, n_trials)
    # Total signal
    total_signal = detected + dark_counts
    # Estimated QY (correcting for known detector properties)
    estimated_qy = (total_signal - dark_rate * measurement_time) / (n_molecules * detection_prob)
    return {
        'true_photons': true_photons,
        'detected': detected,
        'dark_counts': dark_counts,
        'total_signal': total_signal,
        'estimated_qy': estimated_qy,
        'true_qy': true_qy,
    }

# Run simulations at different molecule counts
molecule_counts = [1e3, 1e4, 1e5, 1e6, 1e7]
true_qy = 0.41

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Quantum Yield Measurement Simulator',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: QY estimate distribution vs molecule count
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
colors_m = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for n_mol, color in zip(molecule_counts, colors_m):
    result = simulate_qy_measurement(int(n_mol), true_qy)
    qy_est = result['estimated_qy']
    qy_est = qy_est[(qy_est > 0) & (qy_est < 1)]
    if len(qy_est) > 0:
        ax.hist(qy_est, bins=30, alpha=0.5, color=color,
                label=f'N={n_mol:.0e} (σ={np.std(qy_est):.3f})')
ax.axvline(true_qy, color='white', linewidth=2, linestyle='--', label=f'True QY = {true_qy}')
ax.set_xlabel('Estimated quantum yield', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('QY measurement precision vs sample size', color='white')
ax.legend(fontsize=7)

# Panel 2: Signal-to-noise ratio
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
n_range = np.logspace(2, 8, 50)
snr_values = []
for n in n_range:
    r = simulate_qy_measurement(int(n), true_qy, n_trials=100)
    signal = np.mean(r['detected'])
    noise = np.sqrt(np.mean(r['dark_counts']) + signal)  # Poisson noise
    snr_values.append(signal / max(noise, 1))
ax.plot(n_range, snr_values, color='#f59e0b', linewidth=2.5)
ax.axhline(10, color='#22c55e', linewidth=1, linestyle='--', label='SNR = 10 (good)')
ax.axhline(3, color='#ef4444', linewidth=1, linestyle='--', label='SNR = 3 (minimum)')
ax.set_xlabel('Number of molecules', color='white')
ax.set_ylabel('Signal-to-noise ratio', color='white')
ax.set_title('SNR improves with √N', color='white')
ax.set_xscale('log'); ax.set_yscale('log')
ax.legend(fontsize=9)

# Panel 3: Systematic error from dark current
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
dark_rates = [0, 5, 10, 50, 100]
colors_d = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
for dr, color in zip(dark_rates, colors_d):
    result = simulate_qy_measurement(100000, true_qy, dark_rate=dr)
    ax.hist(result['estimated_qy'], bins=30, alpha=0.4, color=color,
            label=f'Dark rate={dr}/s')
ax.axvline(true_qy, color='white', linewidth=2, linestyle='--')
ax.set_xlabel('Estimated QY', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Effect of dark current on measurement', color='white')
ax.legend(fontsize=8)

# Panel 4: Measurement accuracy summary
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
n_test = [1e3, 1e4, 1e5, 1e6]
biases = []
precisions = []
for n in n_test:
    r = simulate_qy_measurement(int(n), true_qy, n_trials=500)
    qy_est = r['estimated_qy']
    biases.append(np.mean(qy_est) - true_qy)
    precisions.append(np.std(qy_est))
ax.plot(n_test, np.abs(biases), 'o-', color='#ef4444', linewidth=2, label='|Bias| (accuracy)')
ax.plot(n_test, precisions, 's-', color='#3b82f6', linewidth=2, label='Std dev (precision)')
ax.set_xlabel('Number of molecules', color='white')
ax.set_ylabel('Error in QY estimate', color='white')
ax.set_title('Accuracy and precision vs sample size', color='white')
ax.set_xscale('log'); ax.set_yscale('log')
ax.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Measurement simulator results:")
for n in molecule_counts:
    r = simulate_qy_measurement(int(n), true_qy)
    print(f"  N={n:.0e}: QY_est = {np.mean(r['estimated_qy']):.3f} ± {np.std(r['estimated_qy']):.3f}")`,
      challenge: `Add photobleaching: after each photon emission, there is a 0.001% chance the luciferase molecule is permanently deactivated. How does this affect the measured quantum yield over time? Plot the apparent QY as a function of measurement duration.`,
      successHint: `The measurement simulator teaches the critical lesson that every experimental measurement is a negotiation between signal and noise. More molecules give better precision, but systematic errors (dark current, photobleaching) set an accuracy floor that no amount of averaging can overcome.`,
    },
    {
      title: 'Photon Flux & Luminous Output Calculator',
      concept: `The photon flux calculator converts reaction kinetics into practical lighting units. Given a reaction rate (molecules per second), quantum yield, and emission spectrum, we compute: (1) photon emission rate (photons/s), (2) radiant flux (watts of electromagnetic radiation), (3) luminous flux (lumens — perceived brightness), and (4) illuminance at a given distance (lux — light falling on a surface).

The key conversions are: Radiant flux Phi_e = photon_rate × E_photon (watts). Luminous flux Phi_v = 683 × integral(SPD × V_lambda) (lumens). Illuminance E = Phi_v / (4π × r²) for an isotropic point source at distance r (lux).

For practical applications: a single firefly produces about 0.01 lumens during a flash. A standard 60W incandescent bulb produces 800 lumens. To replace one light bulb, you would need approximately 80,000 fireflies flashing simultaneously. This calculation reveals both the marvel of bioluminescence (extraordinary efficiency per reaction) and its limitation (tiny total power per organism).

For engineered bioluminescent systems, the calculation changes. A 1-liter bioreactor of bioluminescent bacteria at high density (10^9 cells/mL) with each cell producing 10^4 photons/second generates 10^13 photons/s × 3.5×10^-19 J = 3.5 μW = about 2 millilumens. This is enough to read by in a dark room but not to illuminate a building. Current research focuses on increasing per-cell brightness by 100-1000× through genetic engineering.`,
      analogy: `Converting from photons to lumens is like converting from raw computational power to useful work. A computer might execute a billion operations per second (photons/s), but only some of those operations produce useful results for the user (lumens = perceived brightness). The 'V(lambda) function' in lighting is like the 'usefulness function' in computing — it weights each operation by how much it contributes to the goal.`,
      storyConnection: `Could the fireflies in the story ever replace electric lights? The photon flux calculation gives a precise answer: not with individual organisms, but potentially with engineered bioluminescent systems. The dream of 'living streetlights' — trees that glow enough to illuminate a sidewalk — requires about 10 lumens per meter, achievable with genetically enhanced bioluminescent plants at densities current research is approaching.`,
      checkQuestion: `A bioluminescent lamp contains 1 liter of bacteria at 10^9 cells/mL, each emitting 5×10^4 photons/s at 500 nm. What is the luminous flux in lumens?`,
      checkAnswer: `Total photons/s = 10^12 cells × 5×10^4 = 5×10^16 photons/s. Photon energy at 500 nm: E = hc/λ = 3.97×10^-19 J. Radiant power: 5×10^16 × 3.97×10^-19 = 0.0199 W ≈ 20 mW. Luminous efficacy at 500 nm: V(500nm) ≈ 0.323, so luminous flux = 683 × 0.323 × 0.0199 = 4.4 lumens. That is about 0.5% of a standard light bulb — enough to see by in a dark room but not for general illumination.`,
      codeIntro: `Build the photon flux calculator and model practical bioluminescent lighting scenarios.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Photon Flux & Luminous Output Calculator ---
h = 6.626e-34; c = 3e8; eV = 1.602e-19

def V_lambda(wl_nm):
    """Photopic luminosity function (approximate)."""
    return np.exp(-0.5 * ((wl_nm - 555) / 50)**2)

class PhotonFluxCalc:
    def __init__(self, peak_nm=560, width_nm=40, quantum_yield=0.41):
        self.peak = peak_nm
        self.width = width_nm
        self.qy = quantum_yield
        self.wl = np.linspace(380, 780, 200)
        self.spd = np.exp(-0.5 * ((self.wl - peak_nm) / width_nm)**2)
        self.spd /= np.trapz(self.spd, self.wl)  # normalize

    def compute(self, reaction_rate):
        """Given reactions/second, compute all lighting metrics."""
        photon_rate = reaction_rate * self.qy  # photons/s
        # Average photon energy
        E_avg = h * c / (self.peak * 1e-9)  # J
        radiant_flux = photon_rate * E_avg  # watts
        # Luminous flux
        spd_power = self.spd * radiant_flux
        lum_flux = 683 * np.trapz(spd_power * V_lambda(self.wl), self.wl)
        # Luminous efficacy
        lum_eff = lum_flux / max(radiant_flux, 1e-20)
        return {
            'photon_rate': photon_rate,
            'radiant_flux_W': radiant_flux,
            'luminous_flux_lm': lum_flux,
            'luminous_efficacy': lum_eff,
        }

# Scenarios
scenarios = {
    'Single firefly flash': {'rate': 1e10 / 0.1, 'peak': 560, 'qy': 0.41},
    '1L bacteria bioreactor': {'rate': 1e12 * 5e4, 'peak': 490, 'qy': 0.15},
    '10L high-density reactor': {'rate': 1e13 * 1e5, 'peak': 490, 'qy': 0.15},
    'Engineered glowing plant': {'rate': 1e14, 'peak': 530, 'qy': 0.05},
    'Future bio-LED (target)': {'rate': 1e17, 'peak': 555, 'qy': 0.50},
}

results = {}
for name, params in scenarios.items():
    calc = PhotonFluxCalc(params['peak'], 40, params['qy'])
    results[name] = calc.compute(params['rate'])

# Reference: common light sources
references = {
    'Candle': 13,
    'Phone screen': 40,
    'Desk lamp (LED)': 450,
    '60W equivalent bulb': 800,
    'Office ceiling': 3000,
    'Direct sunlight': 120000,
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Photon Flux & Luminous Output: Can Biology Replace Light Bulbs?',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Luminous flux comparison
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
all_names = list(results.keys()) + list(references.keys())
all_lumens = [results[n]['luminous_flux_lm'] for n in results] + list(references.values())
all_colors = ['#22c55e']*len(results) + ['#3b82f6']*len(references)
bars = ax.barh(all_names, [max(v, 1e-5) for v in all_lumens], color=all_colors, alpha=0.8)
for bar, v in zip(bars, all_lumens):
    label = f'{v:.4f}' if v < 1 else f'{v:.0f}'
    ax.text(max(bar.get_width() * 1.1, 0.001), bar.get_y() + bar.get_height()/2,
            f'{label} lm', color='white', fontsize=7, va='center')
ax.set_xlabel('Luminous flux (lumens)', color='white')
ax.set_title('Bioluminescent (green) vs artificial (blue)', color='white')
ax.set_xscale('log')

# Panel 2: Illuminance at 1 meter
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, r in results.items():
    distances = np.linspace(0.01, 5, 100)
    illuminance = r['luminous_flux_lm'] / (4 * np.pi * distances**2)
    ax.plot(distances, illuminance, linewidth=2, label=name[:20])
ax.axhline(1, color='white', linewidth=1, linestyle='--', alpha=0.3)
ax.text(3, 1.2, '1 lux (moonlit night)', color='gray', fontsize=8)
ax.axhline(50, color='white', linewidth=1, linestyle='--', alpha=0.3)
ax.text(3, 55, '50 lux (dim indoor)', color='gray', fontsize=8)
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('Illuminance (lux)', color='white')
ax.set_title('Illuminance vs distance', color='white')
ax.set_yscale('log'); ax.legend(fontsize=7)

# Panel 3: Scaling — how many organisms needed?
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
target_lumens = [1, 10, 100, 800]  # candle, reading, task, room
firefly_lm = results['Single firefly flash']['luminous_flux_lm']
bacteria_lm = results['1L bacteria bioreactor']['luminous_flux_lm']
for target, color in zip(target_lumens, ['#22c55e', '#f59e0b', '#ef4444', '#a855f7']):
    n_fireflies = target / max(firefly_lm, 1e-10)
    n_liters = target / max(bacteria_lm, 1e-10)
    ax.scatter([n_fireflies], [target], color=color, s=100, marker='*', zorder=10)
    ax.scatter([n_liters], [target], color=color, s=100, marker='D', zorder=10)
ax.set_xlabel('Number of units needed', color='white')
ax.set_ylabel('Target lumens', color='white')
ax.set_title('Scaling: units needed per target brightness', color='white')
ax.set_xscale('log')

# Panel 4: Summary metrics
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
lines = ['PHOTON FLUX SUMMARY:', '']
for name, r in results.items():
    lines.append(f"{name}:")
    lines.append(f"  Photons/s: {r['photon_rate']:.2e}")
    lines.append(f"  Power: {r['radiant_flux_W']*1e6:.2f} μW")
    lines.append(f"  Lumens: {r['luminous_flux_lm']:.4f}")
    lines.append(f"  Efficacy: {r['luminous_efficacy']:.0f} lm/W")
    lines.append('')
for i, line in enumerate(lines):
    color = '#f59e0b' if line.endswith(':') and not line.startswith(' ') else 'white'
    ax.text(0.02, 0.97 - i * 0.042, line, color=color, fontsize=8,
            transform=ax.transAxes, fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Can bioluminescence replace light bulbs?")
for name, r in results.items():
    bulb_equiv = r['luminous_flux_lm'] / 800 * 100
    print(f"  {name}: {r['luminous_flux_lm']:.4f} lm ({bulb_equiv:.4f}% of a 60W bulb)")`,
      challenge: `Design the minimum viable bioluminescent reading lamp: determine the required cell density, volume, nutrient supply rate, and maintenance cost for a lamp producing 50 lumens (enough to read by). Include nutrient (glucose/oxygen) consumption rates and estimate how often the culture needs to be refreshed.`,
      successHint: `The photon flux calculator reveals the fundamental scaling challenge of bioluminescent lighting: individual organisms are remarkably efficient but produce tiny amounts of light. Engineering viable bio-lighting requires either massive scale-up or dramatic increases in per-cell brightness — both active areas of current research.`,
    },
    {
      title: 'Multi-Organism Comparison Dashboard',
      concept: `The comparison dashboard brings together all metrics for side-by-side evaluation of bioluminescent systems. For each organism, we display: quantum yield, emission spectrum, photon energy, metabolic cost, luminous efficacy, ecological function, and potential engineering applications.

This comparative approach reveals optimization trade-offs. Fireflies maximize quantum yield (41%) but only flash intermittently. Dinoflagellates have low quantum yield (10%) but produce light mechanically (shear-triggered) without ATP cost. Fungi glow continuously at very low brightness (3% yield) but require no neural control circuitry. Deep-sea organisms sacrifice quantum yield for wavelength optimization (blue light travels farthest in water).

The dashboard format enables rapid assessment of which organism is best suited for each engineering application: firefly luciferase for high-sensitivity ATP assays (highest yield), GFP for cell imaging (stable, genetically encodable), bacterial luciferase for continuous environmental monitoring (constitutive expression), and fungal bioluminescence for decorative/ambient applications (no external substrate needed).

Each metric is presented with error bars reflecting measurement uncertainty, color-coded by category, and ranked to highlight the best performer for each criterion. This is the kind of multi-criteria analysis that engineers use to select materials, components, and biological systems for real applications.`,
      analogy: `The comparison dashboard is like a Consumer Reports comparison chart for bioluminescent systems. Just as CR compares cars on fuel efficiency, safety, reliability, and cost — with each criterion mattering differently depending on what you need — our dashboard compares organisms on quantum yield, spectrum, cost, and stability, with the 'best' choice depending on the application.`,
      storyConnection: `The story's fireflies are just one entry in nature\'s catalog of bioluminescent solutions. Our dashboard shows how each organism has optimized its light production for a specific ecological niche — and how engineers can select the best biological 'chassis' for each technological application. The firefly remains the efficiency champion, but for many applications, other organisms offer advantages.`,
      checkQuestion: `For a hospital surface hygiene test that needs maximum sensitivity (detecting the fewest possible bacteria), which bioluminescent system should you use and why?`,
      checkAnswer: `Firefly luciferase is the clear winner for maximum sensitivity because: (1) highest quantum yield (41% vs 10-23% for alternatives) means more photons per ATP molecule detected, (2) the emission at 560 nm matches common PMT sensitivity better than blue emitters, (3) the reaction requires ATP as a mandatory substrate, making it specific to living cells, and (4) decades of optimization have produced commercial kits with detection limits below 100 bacteria. The high quantum yield directly translates to a lower detection limit because more of the available signal is converted to detectable photons.`,
      codeIntro: `Build the comprehensive multi-organism comparison dashboard with rankings across all metrics.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Multi-Organism Comparison Dashboard ---

organisms = {
    'Firefly': {'qy': 0.41, 'peak': 560, 'atp': 9, 'continuous': False, 'eff': 350, 'app': 'ATP assays'},
    'Jellyfish/GFP': {'qy': 0.23, 'peak': 509, 'atp': 5, 'continuous': False, 'eff': 280, 'app': 'Cell imaging'},
    'Click beetle': {'qy': 0.38, 'peak': 540, 'atp': 9, 'continuous': False, 'eff': 340, 'app': 'Dual-color reporters'},
    'Bacteria (lux)': {'qy': 0.12, 'peak': 490, 'atp': 3, 'continuous': True, 'eff': 200, 'app': 'Env monitoring'},
    'Dinoflagellate': {'qy': 0.10, 'peak': 475, 'atp': 0, 'continuous': False, 'eff': 150, 'app': 'Mechanical sensing'},
    'Fungi': {'qy': 0.03, 'peak': 530, 'atp': 4, 'continuous': True, 'eff': 100, 'app': 'Ambient lighting'},
    'Deep-sea shrimp': {'qy': 0.15, 'peak': 470, 'atp': 5, 'continuous': False, 'eff': 130, 'app': 'Camouflage'},
    'Railroad worm': {'qy': 0.08, 'peak': 623, 'atp': 9, 'continuous': True, 'eff': 120, 'app': 'Dual-color defense'},
}

metrics = ['qy', 'peak', 'atp', 'eff']
metric_labels = ['Quantum yield', 'Peak λ (nm)', 'ATP cost', 'Lum. efficacy']
metric_good = ['high', 'near 555', 'low', 'high']  # what\'s desirable

names = list(organisms.keys())
n_org = len(names)

fig = plt.figure(figsize=(18, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('BIOLUMINESCENCE COMPARISON DASHBOARD',
             color='white', fontsize=16, fontweight='bold', y=0.98)

gs = fig.add_gridspec(3, 4, hspace=0.4, wspace=0.35)

# Panel 1: Quantum yield ranking
ax = fig.add_subplot(gs[0, 0])
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
qy_sorted = sorted(organisms.items(), key=lambda x: x[1]['qy'], reverse=True)
qy_names = [q[0] for q in qy_sorted]
qy_vals = [q[1]['qy'] * 100 for q in qy_sorted]
colors_qy = ['#22c55e' if v > 30 else '#f59e0b' if v > 10 else '#ef4444' for v in qy_vals]
ax.barh(qy_names, qy_vals, color=colors_qy, alpha=0.8)
ax.set_xlabel('QY (%)', color='white')
ax.set_title('Quantum Yield Ranking', color='white', fontsize=10)

# Panel 2: Emission spectra overlay
ax = fig.add_subplot(gs[0, 1:3])
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
wl = np.linspace(400, 700, 200)
cmap = plt.cm.Set2
for i, (name, props) in enumerate(organisms.items()):
    spec = np.exp(-0.5 * ((wl - props['peak']) / 35)**2) * props['qy']
    ax.plot(wl, spec, color=cmap(i/n_org), linewidth=2, label=name)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Intensity × QY', color='white')
ax.set_title('Emission Spectra (scaled by efficiency)', color='white', fontsize=10)
ax.legend(fontsize=6, ncol=2)

# Panel 3: Radar chart data
ax = fig.add_subplot(gs[0, 3])
ax.set_facecolor('#111827')
ax.axis('off')
ax.set_title('Application Guide', color='white', fontsize=10)
apps = [(name, props['app']) for name, props in organisms.items()]
for i, (name, app) in enumerate(apps):
    ax.text(0.05, 0.95 - i * 0.11, f"• {name}:", color='#f59e0b', fontsize=8,
            transform=ax.transAxes, fontweight='bold')
    ax.text(0.05, 0.95 - i * 0.11 - 0.05, f"  → {app}", color='white', fontsize=8,
            transform=ax.transAxes)

# Panel 4: Cost efficiency (photons per ATP)
ax = fig.add_subplot(gs[1, 0:2])
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
photon_per_atp = [(name, props['qy'] / max(props['atp'], 0.1))
                   for name, props in organisms.items()]
photon_per_atp.sort(key=lambda x: x[1], reverse=True)
pa_names = [p[0] for p in photon_per_atp]
pa_vals = [p[1] for p in photon_per_atp]
colors_pa = plt.cm.viridis(np.linspace(0.3, 0.9, len(pa_names)))
bars = ax.barh(pa_names, pa_vals, color=colors_pa, alpha=0.8)
for bar, v in zip(bars, pa_vals):
    ax.text(bar.get_width() + 0.005, bar.get_y() + bar.get_height()/2,
            f'{v:.3f}', color='white', fontsize=8, va='center')
ax.set_xlabel('Photons per ATP invested', color='white')
ax.set_title('Cost Efficiency: Best photon-per-ATP ratio', color='white', fontsize=10)

# Panel 5: Continuous vs flash
ax = fig.add_subplot(gs[1, 2:4])
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
t_demo = np.linspace(0, 10, 1000)
for i, (name, props) in enumerate(list(organisms.items())[:4]):
    if props['continuous']:
        signal = np.ones_like(t_demo) * props['qy'] * 0.5
        signal += np.random.normal(0, 0.01, len(t_demo))
    else:
        period = 3 + i
        signal = props['qy'] * np.where(t_demo % period < 0.5, 1, 0)
    ax.plot(t_demo, signal + i * 0.6, linewidth=1.5, label=name)
ax.set_xlabel('Time (s)', color='white')
ax.set_title('Flash vs Continuous Emission Patterns', color='white', fontsize=10)
ax.legend(fontsize=8)
ax.set_yticks([])

# Panel 6: Summary scorecard
ax = fig.add_subplot(gs[2, :])
ax.set_facecolor('#111827')
ax.axis('off')

# Create scorecard
headers = ['Organism', 'QY', 'Peak', 'ATP', 'Cont?', 'Efficacy', 'Best For']
col_x = [0.02, 0.18, 0.28, 0.38, 0.48, 0.58, 0.72]
for j, header in enumerate(headers):
    ax.text(col_x[j], 0.95, header, color='#f59e0b', fontsize=9,
            transform=ax.transAxes, fontweight='bold', fontfamily='monospace')
ax.plot([0.02, 0.98], [0.92, 0.92], color='gray', linewidth=0.5, transform=ax.transAxes)

for i, (name, props) in enumerate(organisms.items()):
    y = 0.85 - i * 0.10
    qy_color = '#22c55e' if props['qy'] > 0.3 else '#f59e0b' if props['qy'] > 0.1 else '#ef4444'
    ax.text(col_x[0], y, name[:15], color='white', fontsize=8, transform=ax.transAxes, fontfamily='monospace')
    ax.text(col_x[1], y, f"{props['qy']:.0%}", color=qy_color, fontsize=8, transform=ax.transAxes, fontfamily='monospace')
    ax.text(col_x[2], y, f"{props['peak']}", color='white', fontsize=8, transform=ax.transAxes, fontfamily='monospace')
    ax.text(col_x[3], y, f"{props['atp']}", color='white', fontsize=8, transform=ax.transAxes, fontfamily='monospace')
    ax.text(col_x[4], y, 'Yes' if props['continuous'] else 'No', color='white', fontsize=8, transform=ax.transAxes, fontfamily='monospace')
    ax.text(col_x[5], y, f"{props['eff']}", color='white', fontsize=8, transform=ax.transAxes, fontfamily='monospace')
    ax.text(col_x[6], y, props['app'], color='#06b6d4', fontsize=8, transform=ax.transAxes, fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Dashboard complete: 8 organisms compared across 6 metrics")
print(f"Top QY: {qy_sorted[0][0]} ({qy_sorted[0][1]['qy']:.0%})")
print(f"Top cost efficiency: {photon_per_atp[0][0]} ({photon_per_atp[0][1]:.3f} photons/ATP)")`,
      challenge: `Add a "recommendation engine": given a user-specified application (maximum sensitivity, continuous monitoring, ambient lighting, or underwater signaling), automatically rank the organisms and highlight the top choice with a justification based on the relevant metrics.`,
      successHint: `The comparison dashboard demonstrates that there is no single "best" bioluminescent system — only the best system for a given application. This multi-criteria thinking is the essence of engineering design: understanding trade-offs and selecting the optimal solution for the specific problem at hand.`,
    },
    {
      title: 'Final Integration: Bioluminescence Design Optimizer',
      concept: `The capstone concludes with a **design optimizer** that finds the optimal parameters for a bioluminescent system given a set of constraints. The user specifies: target brightness (lumens), maximum power budget (watts of metabolic energy), acceptable wavelength range, and whether continuous or flash operation is needed.

The optimizer searches the parameter space — varying organism type, cell density, reactor volume, substrate concentration, and operating temperature — to find the combination that meets all constraints while minimizing cost. This is a **constrained optimization problem** that we solve using a grid search (exhaustive evaluation of discrete parameter combinations).

The optimization landscape reveals interesting trade-offs: increasing cell density increases brightness but also increases oxygen consumption and heat generation. Higher substrate concentrations improve reaction rate but increase cost and can cause inner filter effects. Flash operation uses less energy per unit time but produces lower average brightness.

The final output is a design specification: organism choice, reactor dimensions, substrate feed rate, expected brightness, metabolic cost, and maintenance schedule. This is the deliverable that a biotech engineer would present to a project manager — a complete, quantified proposal for a bioluminescent system.

This capstone demonstrates the full arc from fundamental science (quantum chemistry of excited states) through engineering analysis (kinetics, thermodynamics, color science) to practical design (optimization, specification, costing). It is the shape of real engineering work.`,
      analogy: `The design optimizer is like an architect's site planning software. Given constraints (lot size, budget, building codes, client requirements), the software searches through millions of floor plan combinations to find the design that maximizes living space, natural light, and energy efficiency while staying within budget. Our optimizer does the same for bioluminescent systems — searching through biological and engineering parameters to find the best design.`,
      storyConnection: `The fireflies that don\'t burn have taken us on a journey from wonder to science to engineering. The design optimizer closes the loop: we can now take the fundamental chemistry of bioluminescence, quantified and understood, and use it to design real devices. The firefly's 41% quantum yield, 100 million years in the making, is now a design parameter in an engineering specification — nature\'s invention becoming humanity's tool.`,
      checkQuestion: `An optimizer finds two solutions: (A) 50 lumens using firefly luciferase at $500/month substrate cost, and (B) 45 lumens using bacterial lux at $50/month. Which is better and why might the answer depend on context?`,
      checkAnswer: `It depends on the application. (A) is better for a medical imaging application where 50 lumens is the minimum required brightness and cost is secondary. (B) is better for environmental monitoring where slightly less brightness is acceptable and the 10x lower operating cost makes the system economically viable for long-term deployment. The optimizer should present both solutions with clear trade-off analysis, not just pick one. Real engineering often involves Pareto-optimal solutions where no single option dominates all criteria.`,
      codeIntro: `Build the complete bioluminescence design optimizer with constraint handling, multi-objective evaluation, and specification output.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# ================================================
# BIOLUMINESCENCE DESIGN OPTIMIZER
# ================================================

class BiolumDesignOptimizer:
    """Find optimal bioluminescent system for given requirements."""

    ORGANISMS = {
        'firefly': {'qy': 0.41, 'peak': 560, 'cost_per_mol': 500, 'rate_factor': 1.0,
                    'continuous': False, 'lum_eff': 350},
        'bacteria': {'qy': 0.12, 'peak': 490, 'cost_per_mol': 5, 'rate_factor': 0.3,
                     'continuous': True, 'lum_eff': 200},
        'jellyfish': {'qy': 0.23, 'peak': 509, 'cost_per_mol': 200, 'rate_factor': 0.6,
                      'continuous': False, 'lum_eff': 280},
        'fungi': {'qy': 0.03, 'peak': 530, 'cost_per_mol': 1, 'rate_factor': 0.05,
                  'continuous': True, 'lum_eff': 100},
    }

    def evaluate(self, organism, volume_L, cell_density, substrate_conc):
        org = self.ORGANISMS[organism]
        # Photon production rate
        total_cells = volume_L * 1e3 * cell_density  # cells
        rate_per_cell = org['rate_factor'] * substrate_conc / (0.5 + substrate_conc) * 1e5
        total_rate = total_cells * rate_per_cell * org['qy']  # photons/s

        # Radiant power
        E_photon = 6.626e-34 * 3e8 / (org['peak'] * 1e-9)
        radiant_W = total_rate * E_photon

        # Luminous flux
        lum_flux = radiant_W * org['lum_eff']

        # Cost (substrate consumption per month)
        substrate_rate = total_cells * rate_per_cell * 1e-23  # mol/s (rough)
        monthly_cost = substrate_rate * 3600 * 24 * 30 * org['cost_per_mol']

        # Metabolic heat
        heat_W = radiant_W * (1 / max(org['qy'], 0.01) - 1)

        return {
            'organism': organism,
            'volume_L': volume_L,
            'cell_density': cell_density,
            'substrate_conc': substrate_conc,
            'luminous_flux_lm': lum_flux,
            'radiant_power_W': radiant_W,
            'heat_W': heat_W,
            'monthly_cost': monthly_cost,
            'continuous': org['continuous'],
        }

    def optimize(self, target_lumens=10, max_volume=50, max_cost=100,
                 require_continuous=False):
        """Grid search for optimal design."""
        best = None
        all_results = []

        for org_name in self.ORGANISMS:
            org = self.ORGANISMS[org_name]
            if require_continuous and not org['continuous']:
                continue
            for vol in [0.5, 1, 2, 5, 10, 20, 50]:
                if vol > max_volume:
                    continue
                for density in [1e6, 1e7, 1e8, 1e9]:
                    for substrate in [0.1, 0.5, 1.0, 2.0, 5.0]:
                        r = self.evaluate(org_name, vol, density, substrate)
                        r['meets_brightness'] = r['luminous_flux_lm'] >= target_lumens
                        r['meets_cost'] = r['monthly_cost'] <= max_cost
                        r['meets_all'] = r['meets_brightness'] and r['meets_cost']
                        r['score'] = (r['luminous_flux_lm'] / max(target_lumens, 0.1) *
                                     (1 - r['monthly_cost'] / max(max_cost, 1)) *
                                     (1 if r['meets_all'] else 0.1))
                        all_results.append(r)
                        if r['meets_all']:
                            if best is None or r['score'] > best['score']:
                                best = r

        return best, all_results

# Run optimization
optimizer = BiolumDesignOptimizer()
best, all_results = optimizer.optimize(target_lumens=5, max_volume=20, max_cost=200)

# Separate feasible and infeasible
feasible = [r for r in all_results if r['meets_all']]
infeasible = [r for r in all_results if not r['meets_all']]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('BIOLUMINESCENCE DESIGN OPTIMIZER — Results',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Brightness vs Cost (Pareto front)
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
org_colors = {'firefly': '#22c55e', 'bacteria': '#3b82f6', 'jellyfish': '#f59e0b', 'fungi': '#a855f7'}
for r in infeasible[:500]:  # limit points for clarity
    ax.scatter(r['monthly_cost'], r['luminous_flux_lm'],
               color=org_colors.get(r['organism'], 'gray'), s=5, alpha=0.1)
for r in feasible[:200]:
    ax.scatter(r['monthly_cost'], r['luminous_flux_lm'],
               color=org_colors.get(r['organism'], 'gray'), s=30, alpha=0.6)
if best:
    ax.scatter(best['monthly_cost'], best['luminous_flux_lm'],
               color='white', s=200, marker='*', zorder=10, label='OPTIMAL')
ax.axhline(5, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.5)
ax.axvline(200, color='#ef4444', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Monthly cost ($)', color='white')
ax.set_ylabel('Luminous flux (lm)', color='white')
ax.set_title('Design space: brightness vs cost', color='white')
ax.set_xscale('log'); ax.set_yscale('log')
ax.legend(fontsize=9)

# Panel 2: Best design by organism
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
best_per_org = {}
for r in feasible:
    org = r['organism']
    if org not in best_per_org or r['score'] > best_per_org[org]['score']:
        best_per_org[org] = r
if best_per_org:
    org_names_b = list(best_per_org.keys())
    lm_vals = [best_per_org[o]['luminous_flux_lm'] for o in org_names_b]
    cost_vals = [best_per_org[o]['monthly_cost'] for o in org_names_b]
    colors_b = [org_colors[o] for o in org_names_b]
    x_pos = np.arange(len(org_names_b))
    bars = ax.bar(x_pos - 0.2, lm_vals, 0.35, color=colors_b, alpha=0.8, label='Lumens')
    ax2 = ax.twinx()
    bars2 = ax2.bar(x_pos + 0.2, cost_vals, 0.35, color=colors_b, alpha=0.4, label='Cost')
    ax.set_xticks(x_pos); ax.set_xticklabels(org_names_b, color='white', fontsize=9)
    ax.set_ylabel('Lumens', color='white')
    ax2.set_ylabel('$/month', color='gray')
    ax.set_title('Best design per organism', color='white')

# Panel 3: Volume vs brightness
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for org_name in ['firefly', 'bacteria', 'fungi']:
    vols = [r['volume_L'] for r in all_results if r['organism'] == org_name and r['cell_density'] == 1e9]
    lms = [r['luminous_flux_lm'] for r in all_results if r['organism'] == org_name and r['cell_density'] == 1e9]
    if vols:
        ax.scatter(vols, lms, color=org_colors[org_name], s=20, alpha=0.5, label=org_name)
ax.set_xlabel('Volume (L)', color='white')
ax.set_ylabel('Luminous flux (lm)', color='white')
ax.set_title('Scaling: how volume affects brightness', color='white')
ax.legend(fontsize=9)

# Panel 4: Optimal design specification
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
if best:
    spec = [
        'OPTIMAL DESIGN SPECIFICATION',
        '=' * 35,
        f'Organism: {best["organism"]}',
        f'Volume: {best["volume_L"]:.1f} L',
        f'Cell density: {best["cell_density"]:.0e} cells/mL',
        f'Substrate: {best["substrate_conc"]:.1f} mM',
        f'',
        f'PERFORMANCE:',
        f'  Brightness: {best["luminous_flux_lm"]:.3f} lumens',
        f'  Radiant power: {best["radiant_power_W"]*1e6:.1f} μW',
        f'  Heat output: {best["heat_W"]*1e6:.1f} μW',
        f'  Continuous: {"Yes" if best["continuous"] else "No"}',
        f'',
        f'ECONOMICS:',
        f'  Monthly substrate: \{best["monthly_cost"]:.2f}',
        f'  Score: {best["score"]:.3f}',
    ]
else:
    spec = ['No feasible design found.', 'Try relaxing constraints.']

for i, line in enumerate(spec):
    weight = 'bold' if i == 0 or line.endswith(':') else 'normal'
    color = '#22c55e' if i == 0 else '#f59e0b' if line.endswith(':') else 'white'
    ax.text(0.05, 0.95 - i * 0.055, line, color=color, fontsize=9,
            transform=ax.transAxes, fontfamily='monospace', fontweight=weight)

plt.tight_layout()
plt.show()

print("Design optimization complete.")
print(f"Evaluated {len(all_results)} configurations")
print(f"Feasible designs: {len(feasible)}")
if best:
    print(f"Optimal: {best['organism']}, {best['volume_L']}L, {best['luminous_flux_lm']:.3f} lm, \{best['monthly_cost']:.2f}/mo")`,
      challenge: `Add a Pareto front visualization: find all designs where no other design is simultaneously brighter AND cheaper. Plot the Pareto front and identify the "knee" — the design with the best balance between brightness and cost. This is multi-objective optimization in action.`,
      successHint: `You have built a complete Bioluminescence Efficiency Calculator — from quantum chemistry through color science to engineering design optimization. This capstone demonstrates that understanding nature\'s solutions (firefly light) enables engineering nature-inspired solutions (bioluminescent devices). The 41% quantum yield, evolved over 100 million years, is now a parameter in your optimizer.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (bioluminescence chemistry)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Bioluminescence Efficiency Calculator. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            />
        ))}
      </div>
    </div>
  );
}
