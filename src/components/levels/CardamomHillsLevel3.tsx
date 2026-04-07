import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CardamomHillsLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Reaction kinetics — how terpenes oxidize and degrade',
      concept: `Essential oil compounds are not stable forever. **Terpene oxidation** is a first-order reaction that degrades aroma quality over time:

**-d[A]/dt = k[A]**

Where [A] = concentration of terpene, k = rate constant.

Solution: **[A](t) = [A]₀ × e^(-kt)**

Different compounds degrade at different rates:
- **Limonene**: k ≈ 0.002/day (oxidizes to carvone — musty smell)
- **Linalool**: k ≈ 0.003/day (oxidizes to linalool oxide — woody, stale)
- **α-Pinene**: k ≈ 0.004/day (oxidizes to verbenone — camphor-like)
- **1,8-Cineole**: k ≈ 0.0005/day (very stable — ether bond resists oxidation)
- **α-Terpinyl acetate**: k ≈ 0.001/day (slow hydrolysis of ester bond)

Factors accelerating oxidation:
- **Oxygen**: the primary oxidant
- **Light**: UV breaks bonds, initiates radical chains
- **Heat**: doubles rate per 10°C (Arrhenius law)
- **Moisture**: catalyzes hydrolysis reactions

This is why cardamom oil is stored in dark glass bottles, under nitrogen, in cool conditions.

📚 *We will model multi-component degradation using coupled differential equations.*`,
      analogy: 'Terpene oxidation is like fruit ripening past its peak. At first, the fruit (cardamom) is fresh and fragrant. Over time, oxidation converts pleasant molecules into unpleasant ones — like a banana going from sweet to brown and mushy. Slowing oxidation (refrigeration, sealing) extends the "shelf life" of both fruit and spice.',
      storyConnection: 'Sikkim\'s cardamom farmers know that timing matters: harvest too early and the pods lack oil; harvest too late and oxidation has already begun. Storage in whole-pod form protects the oil from air and light. The traditional practice of storing in sealed bamboo containers is empirical chemistry.',
      checkQuestion: 'If limonene has a half-life of 350 days (k = 0.002/day), what percentage remains after 1 year?',
      checkAnswer: 'Using [A] = [A]₀ × e^(-kt): [A]/[A]₀ = e^(-0.002 × 365) = e^(-0.73) = 0.48. So 48% remains after 1 year — meaning over half the limonene has oxidized. This is why year-old ground cardamom has a flat, stale character compared to freshly ground pods.',
      codeIntro: 'Model the degradation of cardamom oil over time under different storage conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class OilDegradation:
    """Model oxidative degradation of essential oil compounds."""

    def __init__(self):
        self.compounds = {
            '1,8-Cineole':      {'k_base': 0.0005, 'initial': 35, 'color': '#ef4444'},
            'Terpinyl acetate': {'k_base': 0.001,  'initial': 30, 'color': '#f59e0b'},
            'Limonene':         {'k_base': 0.002,  'initial': 8,  'color': '#3b82f6'},
            'Linalool':         {'k_base': 0.003,  'initial': 5,  'color': '#22c55e'},
            'α-Pinene':         {'k_base': 0.004,  'initial': 4,  'color': '#8b5cf6'},
        }

    def simulate(self, days=365, temp_C=25, light=False, sealed=True):
        """Simulate degradation under given conditions."""
        dt = 1  # day
        n = days
        time = np.arange(n)

        # Arrhenius temperature effect: rate doubles per 10°C
        temp_factor = 2**((temp_C - 25) / 10)

        # Light accelerates oxidation
        light_factor = 3.0 if light else 1.0

        # Sealed reduces oxygen access
        oxygen_factor = 0.3 if sealed else 1.0

        results = {}
        for name, data in self.compounds.items():
            k = data['k_base'] * temp_factor * light_factor * oxygen_factor
            conc = data['initial'] * np.exp(-k * time)
            results[name] = conc

        return time, results

model = OilDegradation()

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Cardamom Oil Degradation — Storage Conditions Matter',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Standard conditions
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
time, results = model.simulate(days=365, temp_C=25, light=False, sealed=True)
for name, conc in results.items():
    ax.plot(time, conc, color=model.compounds[name]['color'], linewidth=2, label=name)
ax.set_title('Sealed, Dark, 25°C (ideal)', color='white', fontsize=11, fontweight='bold')
ax.set_ylabel('Concentration (%)', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Worst conditions
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
time, results = model.simulate(days=365, temp_C=35, light=True, sealed=False)
for name, conc in results.items():
    ax.plot(time, conc, color=model.compounds[name]['color'], linewidth=2, label=name)
ax.set_title('Open, Light, 35°C (worst)', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Total oil quality vs time (all conditions)
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
conditions = [
    ('Sealed, dark, 15°C', 15, False, True, '#22c55e'),
    ('Sealed, dark, 25°C', 25, False, True, '#3b82f6'),
    ('Open, dark, 25°C', 25, False, False, '#f59e0b'),
    ('Open, light, 25°C', 25, True, False, '#ef4444'),
    ('Open, light, 35°C', 35, True, False, '#ec4899'),
]
for label, temp, light, sealed, color in conditions:
    time, results = model.simulate(365, temp, light, sealed)
    total = sum(results.values())
    quality = total / sum(d['initial'] for d in model.compounds.values()) * 100
    ax.plot(time, quality, color=color, linewidth=2, label=label)

ax.axhline(y=80, color='gold', linestyle='--', alpha=0.5, label='Premium threshold (80%)')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Quality Retention (%)', color='white')
ax.set_title('Overall Quality Retention', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Shelf life comparison
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
shelf_lives = []
cond_labels = []
for label, temp, light, sealed, color in conditions:
    time, results = model.simulate(1000, temp, light, sealed)
    total = sum(results.values())
    quality = total / sum(d['initial'] for d in model.compounds.values()) * 100
    # Find day when quality drops below 80%
    below_80 = np.where(quality < 80)[0]
    shelf = below_80[0] if len(below_80) > 0 else 1000
    shelf_lives.append(shelf)
    cond_labels.append(label)

colors_bar = [c[4] for c in conditions]
bars = ax.barh(range(len(cond_labels)), shelf_lives, color=colors_bar, alpha=0.8)
ax.set_yticks(range(len(cond_labels)))
ax.set_yticklabels(cond_labels, fontsize=8, color='white')
ax.set_xlabel('Shelf Life (days to 80% quality)', color='white')
ax.set_title('Storage Shelf Life', color='white', fontsize=11, fontweight='bold')
for bar, days in zip(bars, shelf_lives):
    ax.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
            f'{days}d', va='center', color='white', fontsize=9)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='x')

plt.tight_layout()
plt.savefig('degradation.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Shelf Life Summary ===")
for label, days in zip(cond_labels, shelf_lives):
    months = days / 30
    print(f"  {label:30s}: {days:4d} days ({months:.0f} months)")`,
      challenge: 'Add a "whole pod" modifier that reduces degradation by 80% (shell protects oil from air and light). How much longer does whole-pod cardamom last vs. ground?',
      successHint: 'You have modeled multi-component chemical degradation with environmental factors — the same modeling approach used in pharmaceutical shelf-life studies and food science. The 10× difference between best and worst storage conditions explains why proper storage is critical for cardamom quality.',
    },
    {
      title: 'Molecular orbital theory — why terpenes absorb UV light',
      concept: `Terpenes with **conjugated double bonds** (alternating single-double-single-double bonds) can absorb ultraviolet light. This absorption is explained by **molecular orbital theory**:

- Electrons in bonds occupy **molecular orbitals** (MOs)
- The highest occupied MO is called **HOMO**
- The lowest unoccupied MO is called **LUMO**
- UV light promotes an electron from HOMO to LUMO (a π→π* transition)

The energy gap between HOMO and LUMO determines which wavelength is absorbed:
- **Large gap** (isolated double bond): absorbs deep UV (<200 nm) — not visible
- **Medium gap** (2-3 conjugated bonds): absorbs UV (200-350 nm) — causes degradation
- **Small gap** (many conjugated bonds): absorbs visible light → colored compound

For cardamom terpenes:
- **Limonene** (1 double bond): absorbs <200 nm (transparent to sunlight)
- **Myrcene** (2 conjugated bonds): absorbs ~220 nm (absorbs some UV)
- **β-Carotene** (11 conjugated bonds): absorbs ~450 nm (appears orange!)

UV absorption triggers **photodegradation** — the absorbed energy breaks bonds, creating free radicals that attack other molecules in a chain reaction.

📚 *We will model the HOMO-LUMO gap and UV absorption spectrum using simple quantum mechanics.*`,
      analogy: 'The HOMO-LUMO gap is like a jump between two shelves. If the shelves are far apart (big gap), you need a lot of energy (short UV wavelength) to jump. If they are close (small gap), a gentle push (longer wavelength, even visible light) is enough. Conjugated double bonds are like adding intermediate shelves — each one lowers the jump height.',
      storyConnection: 'Sikkim\'s cardamom grows in the shade of forest canopy, protected from intense UV. When pods are dried in open sunlight (as in some cheaper processing methods), UV triggers photodegradation of sensitive terpenes. The traditional shade-drying and fire-curing methods, by avoiding direct UV, preserve oil quality — an empirical discovery that molecular orbital theory explains.',
      checkQuestion: 'Why does β-carotene appear orange while limonene is colorless, even though both are terpenes?',
      checkAnswer: 'β-carotene has 11 conjugated double bonds, creating a very small HOMO-LUMO gap. It absorbs blue light (~450 nm) and transmits the rest — which appears orange. Limonene has only 1 isolated double bond (large gap), absorbing only deep UV (<200 nm) that our eyes cannot see. The number of conjugated bonds directly controls the color.',
      codeIntro: 'Calculate HOMO-LUMO gaps and predict UV absorption wavelengths for cardamom terpenes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Particle-in-a-box model for conjugated pi systems
# E = n²h²/(8mL²), gap = (n+1)² - n² = (2n+1)
# lambda = hc/ΔE
h = 6.626e-34    # Planck's constant
c = 3e8          # speed of light
m_e = 9.109e-31  # electron mass
bond_length = 1.4e-10  # average C-C bond in conjugated system

def absorption_wavelength(n_conjugated_bonds):
    """Calculate absorption wavelength using particle-in-a-box."""
    n_electrons = 2 * n_conjugated_bonds  # 2 pi electrons per double bond
    n_homo = n_electrons // 2  # highest occupied level
    L = (n_conjugated_bonds * 2 - 1) * bond_length  # box length

    E_homo = n_homo**2 * h**2 / (8 * m_e * L**2)
    E_lumo = (n_homo + 1)**2 * h**2 / (8 * m_e * L**2)
    delta_E = E_lumo - E_homo

    wavelength_m = h * c / delta_E
    wavelength_nm = wavelength_m * 1e9
    return wavelength_nm, delta_E

compounds = [
    ("α-Pinene (isolated C=C)", 1),
    ("Limonene (1 conj. bond)", 1),
    ("Myrcene (2 conj. bonds)", 2),
    ("Ocimene (3 conj. bonds)", 3),
    ("Farnesene (4 conj. bonds)", 4),
    ("Lycopene (11 conj. bonds)", 11),
    ("β-Carotene (11 conj. bonds)", 11),
]

print("=== HOMO-LUMO Gap & UV/Vis Absorption ===\\\n")
print(f"{'Compound':<35} {'Conj.':>6} {'λ_abs(nm)':>10} {'ΔE(eV)':>10} {'Region'}")
print("-" * 75)

wavelengths = []
names = []
for name, n_bonds in compounds:
    lam, dE = absorption_wavelength(n_bonds)
    eV = dE / 1.602e-19

    if lam < 200: region = "Deep UV (invisible)"
    elif lam < 315: region = "UV-B (causes degradation)"
    elif lam < 400: region = "UV-A (near visible)"
    elif lam < 500: region = "Blue/violet (COLORED)"
    elif lam < 600: region = "Green/yellow (COLORED)"
    else: region = "Red (COLORED)"

    print(f"{name:<35} {n_bonds:>6} {lam:>10.0f} {eV:>10.2f} {region}")
    wavelengths.append(lam)
    names.append(name)

# Visualization
fig, axes = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Panel 1: Absorption wavelength vs conjugation
ax = axes[0]
ax.set_facecolor('#1f2937')
n_bonds_arr = [c[1] for c in compounds]
colors = []
for lam in wavelengths:
    if lam < 380: colors.append('#8b5cf6')     # UV
    elif lam < 450: colors.append('#3b82f6')    # blue
    elif lam < 500: colors.append('#22c55e')    # green
    elif lam < 570: colors.append('#f59e0b')    # yellow
    else: colors.append('#ef4444')              # red

ax.scatter(n_bonds_arr, wavelengths, c=colors, s=100, edgecolors='white', linewidth=1, zorder=5)
ax.plot(n_bonds_arr, wavelengths, 'gray', linewidth=1, alpha=0.5)

# Visible spectrum region
ax.axhspan(380, 700, alpha=0.1, color='white')
ax.axhline(y=380, color='#8b5cf6', linestyle='--', alpha=0.5, label='Visible boundary')
ax.text(1, 410, 'Visible light', color='white', fontsize=9, alpha=0.7)
ax.text(1, 250, 'UV (causes degradation)', color='#8b5cf6', fontsize=9, alpha=0.7)

ax.set_xlabel('Number of Conjugated Bonds', color='white', fontsize=11)
ax.set_ylabel('Absorption Wavelength (nm)', color='white', fontsize=11)
ax.set_title('Conjugation Controls Absorption', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Simulated absorption spectra
ax = axes[1]
ax.set_facecolor('#1f2937')
wl_range = np.linspace(150, 600, 500)

for name, n_bonds in [(c[0][:15], c[1]) for c in compounds if c[1] <= 4]:
    lam_max, _ = absorption_wavelength(n_bonds)
    # Gaussian absorption band (width ~30 nm)
    spectrum = np.exp(-0.5 * ((wl_range - lam_max) / 25)**2)
    ax.plot(wl_range, spectrum, linewidth=2, label=f'{name} (λ={lam_max:.0f}nm)')

# Mark UV-B danger zone
ax.axvspan(280, 315, alpha=0.2, color='#ef4444', label='UV-B (degradation)')
ax.axvspan(315, 400, alpha=0.1, color='#f59e0b', label='UV-A')

ax.set_xlabel('Wavelength (nm)', color='white', fontsize=11)
ax.set_ylabel('Absorbance', color='white', fontsize=11)
ax.set_title('Simulated UV Absorption Spectra', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('homo_lumo.png', dpi=100, facecolor='#1f2937')
plt.show()

print("\\\nKey insight: cardamom's monoterpenes absorb UV-B → photodegradation")
print("This is why dark storage preserves quality!")`,
      challenge: 'If you could add a UV-absorbing compound to cardamom packaging that absorbs everything below 350 nm, which terpenes would be fully protected? Which would still degrade?',
      successHint: 'You have applied quantum mechanics (particle-in-a-box) to predict molecular absorption — bridging the gap between atomic physics and practical food science. The relationship between conjugation and color is one of the most beautiful results in chemistry.',
    },
    {
      title: 'Enzyme kinetics — how the cardamom plant makes terpenes',
      concept: `The cardamom plant synthesizes terpenes using **enzymes** — biological catalysts that speed up chemical reactions by factors of 10⁶ to 10¹². The key enzyme for monoterpene production is **terpene synthase**.

Enzyme kinetics follows the **Michaelis-Menten equation**:

**v = V_max × [S] / (K_m + [S])**

Where:
- **v** = reaction velocity (rate of terpene production)
- **V_max** = maximum rate (when enzyme is saturated)
- **[S]** = substrate concentration (GPP — geranyl pyrophosphate)
- **K_m** = Michaelis constant (substrate concentration at half-max rate)

At low [S]: v ≈ (V_max/K_m) × [S] — linear (first-order)
At high [S]: v ≈ V_max — constant (zero-order, enzyme saturated)

For cardamom terpene synthase:
- V_max ≈ 50 nmol/min/mg protein
- K_m ≈ 20 μM (moderate affinity)

The plant regulates terpene production through:
1. **Light**: more terpenes produced in bright conditions (UV defense)
2. **Herbivore damage**: wounding triggers a burst of terpene synthesis
3. **Temperature**: optimal 25-30°C, reduced below 15°C
4. **Developmental stage**: maximum during flowering

📚 *We will fit the Michaelis-Menten model to simulated data and extract kinetic parameters.*`,
      analogy: 'An enzyme is like a factory worker on an assembly line. At first (low substrate), the worker is idle most of the time — they finish each piece quickly but wait for the next. As pieces arrive faster (higher substrate), the worker stays busy. Eventually (very high substrate), the worker is maxed out — adding more pieces does not help. V_max is the worker\'s physical speed limit.',
      storyConnection: 'The cardamom plant in Sikkim\'s hills is a chemical factory running 24/7. Its enzymes — terpene synthases — convert simple precursors into the complex molecules that give cardamom its value. Understanding enzyme kinetics helps breeders select high-oil varieties and farmers optimize growing conditions for maximum oil production.',
      checkQuestion: 'Why does the plant produce MORE terpenes when attacked by insects?',
      checkAnswer: 'Terpenes are toxic to many insects — they are chemical weapons. When a caterpillar bites a leaf, the damage triggers a signal cascade (jasmonic acid pathway) that upregulates terpene synthase genes. Within hours, the plant produces 3-10× more terpenes, making itself unpalatable. Some volatiles also attract parasitic wasps that attack the herbivore — calling for reinforcements.',
      codeIntro: 'Model enzyme kinetics with the Michaelis-Menten equation and fit parameters from simulated experimental data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def michaelis_menten(S, Vmax, Km):
    """Michaelis-Menten equation."""
    return Vmax * S / (Km + S)

# Simulated experimental data
np.random.seed(42)
S_exp = np.array([1, 2, 5, 10, 20, 40, 80, 150, 300])  # μM substrate
Vmax_true = 50  # nmol/min/mg
Km_true = 20    # μM

v_exp = michaelis_menten(S_exp, Vmax_true, Km_true) + np.random.normal(0, 2, len(S_exp))
v_exp = np.maximum(v_exp, 0)

# Fit: Lineweaver-Burk (1/v vs 1/S)
inv_S = 1.0 / S_exp[1:]  # skip S=0
inv_v = 1.0 / v_exp[1:]
slope, intercept = np.polyfit(inv_S, inv_v, 1)
Vmax_fit = 1.0 / intercept
Km_fit = slope * Vmax_fit

S_model = np.linspace(0.5, 350, 200)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Enzyme Kinetics — Cardamom Terpene Synthase',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Michaelis-Menten curve
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
ax.plot(S_model, michaelis_menten(S_model, Vmax_fit, Km_fit), '#60a5fa', linewidth=2, label='M-M fit')
ax.scatter(S_exp, v_exp, color='#ef4444', s=60, zorder=5, edgecolors='white', label='Data')
ax.axhline(y=Vmax_fit, color='gold', linestyle='--', alpha=0.7, label=f'Vmax = {Vmax_fit:.1f}')
ax.axhline(y=Vmax_fit/2, color='gray', linestyle=':', alpha=0.5)
ax.axvline(x=Km_fit, color='gray', linestyle=':', alpha=0.5)
ax.annotate(f'Km = {Km_fit:.1f} μM', (Km_fit, Vmax_fit/2), color='white', fontsize=9,
           xytext=(Km_fit+30, Vmax_fit/2+3), arrowprops=dict(arrowstyle='->', color='white'))
ax.set_xlabel('[Substrate] (μM)', color='white', fontsize=11)
ax.set_ylabel('Rate (nmol/min/mg)', color='white', fontsize=11)
ax.set_title('Michaelis-Menten Plot', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Lineweaver-Burk
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
ax.scatter(inv_S, inv_v, color='#ef4444', s=60, zorder=5, edgecolors='white')
x_fit = np.linspace(-0.05, max(inv_S)*1.1, 100)
ax.plot(x_fit, slope * x_fit + intercept, '#60a5fa', linewidth=2)
ax.axhline(y=0, color='gray', linewidth=0.5)
ax.axvline(x=0, color='gray', linewidth=0.5)
ax.set_xlabel('1/[S] (1/μM)', color='white', fontsize=11)
ax.set_ylabel('1/v (min·mg/nmol)', color='white', fontsize=11)
ax.set_title('Lineweaver-Burk (double reciprocal)', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Effect of temperature on Vmax
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
temps = np.arange(5, 46)
# Bell-shaped curve: optimum at 28°C
vmax_temp = 50 * np.exp(-0.5 * ((temps - 28) / 8)**2)
# Denaturation above 40°C
vmax_temp[temps > 40] *= np.exp(-0.3 * (temps[temps > 40] - 40))

ax.plot(temps, vmax_temp, '#ef4444', linewidth=2.5)
ax.fill_between(temps, vmax_temp, alpha=0.2, color='#ef4444')
ax.axvline(x=28, color='gold', linestyle='--', alpha=0.7, label='Optimal (28°C)')

# Sikkim temp range
ax.axvspan(10, 25, alpha=0.15, color='#22c55e', label='Sikkim range')
ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Vmax (nmol/min/mg)', color='white', fontsize=11)
ax.set_title('Temperature Dependence', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Daily oil production cycle
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
hours = np.arange(0, 24, 0.5)
# Light-driven synthesis
light_intensity = np.maximum(0, np.sin(np.pi * (hours - 6) / 12))
light_intensity[hours < 6] = 0
light_intensity[hours > 18] = 0
# Temperature cycle
temp_cycle = 15 + 10 * np.sin(2 * np.pi * (hours - 6) / 24)
# Combined production rate
production = light_intensity * 50 * np.exp(-0.5 * ((temp_cycle - 28) / 8)**2)

ax.plot(hours, production, '#22c55e', linewidth=2.5, label='Terpene synthesis')
ax.fill_between(hours, production, alpha=0.2, color='#22c55e')
ax2 = ax.twinx()
ax2.plot(hours, light_intensity * 100, 'gold', linewidth=1, linestyle='--', label='Light')
ax2.plot(hours, temp_cycle, '#ef4444', linewidth=1, linestyle=':', label='Temp (°C)')
ax.set_xlabel('Hour of Day', color='white', fontsize=11)
ax.set_ylabel('Production Rate', color='#22c55e', fontsize=11)
ax2.set_ylabel('Light / Temp', color='gray', fontsize=11)
ax.set_title('Daily Terpene Production Cycle', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax2.tick_params(colors='gray')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('enzyme.png', dpi=100, facecolor='#1f2937')
plt.show()

print(f"Fitted parameters: Vmax = {Vmax_fit:.1f} nmol/min/mg, Km = {Km_fit:.1f} μM")
print(f"True parameters:   Vmax = {Vmax_true:.1f} nmol/min/mg, Km = {Km_true:.1f} μM")
print(f"\\\nPeak production: midday when light and temperature align")`,
      challenge: 'Add an "inhibitor" (a compound that competes with the substrate). Competitive inhibition changes Km but not Vmax. Model a 3× increase in apparent Km and plot the inhibited vs. uninhibited curves.',
      successHint: 'You have modeled Michaelis-Menten enzyme kinetics, performed Lineweaver-Burk analysis, and explored temperature and light effects. This is the foundation of biochemistry and is used in drug design, metabolic engineering, and agricultural optimization.',
    },
    {
      title: 'Phase equilibria — predicting steam distillation efficiency',
      concept: `**Steam distillation** works because of the physics of **immiscible liquid mixtures**. When two liquids that do not mix (water and essential oil) are heated together, their vapor pressures add:

**P_total = P_water + P_oil**

Boiling occurs when P_total = atmospheric pressure (760 mmHg).

Since water contributes most of the vapor pressure, the mixture boils near 100°C even though the oil components individually boil at 150-220°C.

The fraction of oil in the distillate depends on the ratio of vapor pressures and molecular weights:

**mass_oil/mass_water = (P_oil × MW_oil) / (P_water × MW_water)**

At 100°C:
- P_water ≈ 760 mmHg
- P_cineole ≈ 40 mmHg
- MW_cineole = 154, MW_water = 18

So: mass_cineole/mass_water ≈ (40 × 154) / (760 × 18) = 0.45

That means every gram of water that distills carries 0.45 g of cineole — a remarkably efficient extraction given that the oil boils 76°C above water!

📚 *We will model the phase equilibrium to predict distillation yield and optimize the process.*`,
      analogy: 'Immiscible distillation is like two runners on a track. Water is a fast runner (high vapor pressure). Oil is slow (low vapor pressure). But they are tied together — the pair crosses the finish line (boils) at a speed determined mainly by the fast runner. The slow runner gets carried along, arriving far earlier than it could on its own.',
      storyConnection: 'Sikkim\'s cardamom distillers use steam because it is cheap (just boil water) and effective (carries over oil at low temperature). The physics of immiscible mixtures is why this ancient technique works: it is thermodynamically impossible for the oil to resist co-distillation with steam.',
      checkQuestion: 'Why can\'t you just heat the cardamom without steam? Would that not also evaporate the oil?',
      checkAnswer: 'You could, but it would require heating to 176°C+ (the oil\'s boiling point) in an oxygen atmosphere. At those temperatures, many terpenes would decompose (oxidize, polymerize) before evaporating. Steam keeps the temperature at ~100°C — low enough to preserve the oil\'s chemical integrity. Additionally, steam provides uniform heating and prevents scorching.',
      codeIntro: 'Model steam distillation phase equilibria to predict oil recovery efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

R = 8.314
P_atm = 760  # mmHg

# Antoine equation for water
def P_water(T_C):
    T = T_C
    return 10**(8.07131 - 1730.63 / (233.426 + T))

# Terpene vapor pressures (simplified Antoine)
terpenes = {
    "α-Pinene":     {"dH": 37000, "bp": 156, "MW": 136, "color": "#22c55e"},
    "Limonene":     {"dH": 39000, "bp": 176, "MW": 136, "color": "#3b82f6"},
    "1,8-Cineole":  {"dH": 41000, "bp": 176, "MW": 154, "color": "#ef4444"},
    "Linalool":     {"dH": 44000, "bp": 198, "MW": 154, "color": "#f59e0b"},
    "Terpinyl acetate": {"dH": 48000, "bp": 220, "MW": 196, "color": "#8b5cf6"},
}

def P_terpene(T_C, dH, bp):
    T_K = T_C + 273.15
    T_bp = bp + 273.15
    return 760 * np.exp(-dH/R * (1/T_K - 1/T_bp))

# Find steam distillation temperature (P_water + P_oil = 760)
temps = np.linspace(90, 102, 1000)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Steam Distillation Phase Equilibria', color='white', fontsize=14, fontweight='bold')

# Panel 1: Vapor pressures near 100°C
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
pw = P_water(temps)
ax.plot(temps, pw, 'cyan', linewidth=2, label='Water')
for name, data in terpenes.items():
    pt = P_terpene(temps, data['dH'], data['bp'])
    ax.plot(temps, pt, color=data['color'], linewidth=2, label=name)
ax.axhline(y=760, color='white', linestyle='--', alpha=0.5, label='1 atm')
ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Vapor Pressure (mmHg)', color='white', fontsize=11)
ax.set_title('Vapor Pressures Near Boiling', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)
ax.set_ylim(0, 800)

# Panel 2: Oil/water mass ratio vs temperature
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
MW_water = 18
for name, data in terpenes.items():
    pt = P_terpene(temps, data['dH'], data['bp'])
    mass_ratio = (pt * data['MW']) / (pw * MW_water)
    ax.plot(temps, mass_ratio * 100, color=data['color'], linewidth=2, label=name)

ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Oil in Distillate (g per 100g water)', color='white', fontsize=11)
ax.set_title('Oil Recovery Efficiency', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Combined distillation temperature
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
for name, data in terpenes.items():
    pt = P_terpene(temps, data['dH'], data['bp'])
    total_P = pw + pt
    # Find where total_P = 760
    idx = np.argmin(np.abs(total_P - 760))
    dist_temp = temps[idx]
    ax.scatter([dist_temp], [760], color=data['color'], s=100, zorder=5, edgecolors='white')
    ax.annotate(f'{name[:8]}\\n{dist_temp:.1f}°C', (dist_temp, 770),
               color=data['color'], fontsize=8, ha='center')

# Pure water boiling
ax.scatter([100], [760], color='cyan', s=100, zorder=5, edgecolors='white', marker='s')
ax.annotate('Pure water\\n100.0°C', (100, 770), color='cyan', fontsize=8, ha='center')

ax.axhline(y=760, color='white', linestyle='--', alpha=0.5)
ax.set_xlim(95, 101)
ax.set_ylim(740, 800)
ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Total Pressure (mmHg)', color='white', fontsize=11)
ax.set_title('Steam Distillation Temperature', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Cumulative oil recovery during distillation
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
steam_kg = np.linspace(0, 10, 100)
initial_oil = 50  # grams of oil in 1 kg pods
for name, data in terpenes.items():
    pt = P_terpene(99, data['dH'], data['bp'])
    mass_ratio = (pt * data['MW']) / (P_water(99) * MW_water)
    recovery = initial_oil * 0.2 * (1 - np.exp(-mass_ratio * steam_kg / 0.5))
    ax.plot(steam_kg, recovery, color=data['color'], linewidth=2, label=name[:10])

ax.set_xlabel('Steam Used (kg)', color='white', fontsize=11)
ax.set_ylabel('Oil Recovered (g)', color='white', fontsize=11)
ax.set_title('Cumulative Recovery vs. Steam', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('phase_eq.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Steam Distillation Summary ===")
print(f"Pure water boiling point: 100.0°C")
for name, data in terpenes.items():
    pt = P_terpene(99, data['dH'], data['bp'])
    ratio = (pt * data['MW']) / (P_water(99) * MW_water)
    print(f"{name:25s}: BP={data['bp']}°C, but co-distills at ~99°C! ({ratio*100:.1f}g per 100g water)")`,
      challenge: 'What happens at high altitude (Sikkim at 1500m, atmospheric pressure ~640 mmHg instead of 760)? Recalculate the steam distillation temperatures. Does altitude help or hurt oil extraction?',
      successHint: 'You have modeled the thermodynamics of steam distillation using real phase equilibrium calculations. The key insight — that water "carries" oil compounds at temperatures far below their boiling points — is the principle behind one of humanity\'s oldest chemical processes.',
    },
    {
      title: 'Molecular dynamics — simulating terpene behavior at the atomic level',
      concept: `**Molecular dynamics (MD)** simulates the motion of molecules by solving Newton\'s equations of motion for every atom:

**F = ma → a = F/m → v(t+dt) = v(t) + a×dt → x(t+dt) = x(t) + v×dt**

Forces come from:
1. **Bond stretching**: F = -k(r - r₀) (Hooke\'s law for bonds)
2. **Angle bending**: F = -k(θ - θ₀) (resistance to angle changes)
3. **Van der Waals**: F ∝ -12ε(σ/r)¹³ + 6ε(σ/r)⁷ (Lennard-Jones potential)
4. **Electrostatic**: F = kq₁q₂/r² (Coulomb\'s law for partial charges)

For terpenes in essential oil:
- Van der Waals forces dominate (nonpolar molecules)
- Stronger VdW → higher boiling point
- Molecular shape affects how tightly molecules pack → affects density, viscosity

A simplified MD simulation can show:
- Why small terpenes evaporate faster (weaker intermolecular forces)
- Why oil and water do not mix (different force types)
- How temperature affects molecular motion (kinetic energy distribution)

📚 *We will build a simplified 2D molecular dynamics simulation of terpene molecules.*`,
      analogy: 'Molecular dynamics is like simulating billiard balls on a table, but the balls attract each other weakly (Van der Waals), repel strongly when overlapping, and can escape the table (evaporate) if they have enough energy. By watching the simulation, you can predict which balls leave first (most volatile) and how the remaining balls behave.',
      storyConnection: 'At the atomic level, the aroma of Sikkim\'s cardamom hills is a constant dance of molecules — terpenes vibrating, rotating, colliding, and occasionally escaping into the air. Our simulation captures this molecular ballet, connecting the invisible world of atoms to the macroscopic experience of fragrance.',
      checkQuestion: 'Why does MD use such tiny time steps (femtoseconds, 10⁻¹⁵ s)?',
      checkAnswer: 'Because molecular vibrations occur at ~10¹³ Hz. To accurately track bond stretching and atom collisions, the time step must be much smaller than the vibration period (~100 fs). A 1 picosecond time step would miss fast vibrations and produce nonsensical trajectories. This is why even powerful computers can only simulate nanoseconds of real time.',
      codeIntro: 'Build a simplified 2D molecular dynamics simulation of terpene molecules in a liquid.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class SimpleMD:
    """Simplified 2D molecular dynamics of terpene-like particles."""

    def __init__(self, n_particles=30, box_size=10, temp=300, dt=0.01):
        self.n = n_particles
        self.L = box_size
        self.dt = dt
        self.kB = 1.0  # reduced units

        # Random initial positions
        self.x = np.random.uniform(1, box_size-1, (n_particles, 2))
        # Random velocities (Maxwell-Boltzmann)
        self.v = np.random.normal(0, np.sqrt(temp), (n_particles, 2))
        # Particle properties (size = molecular weight proxy)
        self.sigma = np.random.uniform(0.8, 1.2, n_particles)
        self.mass = self.sigma**3  # heavier = larger
        self.epsilon = 1.0  # LJ well depth

    def forces(self):
        """Lennard-Jones forces between all pairs."""
        F = np.zeros_like(self.x)
        PE = 0

        for i in range(self.n):
            for j in range(i+1, self.n):
                dr = self.x[j] - self.x[i]
                # Minimum image convention
                dr -= self.L * np.round(dr / self.L)
                r = np.sqrt(np.sum(dr**2))

                sig = (self.sigma[i] + self.sigma[j]) / 2
                if r < 3 * sig and r > 0.5 * sig:
                    r6 = (sig / r)**6
                    f_mag = 24 * self.epsilon * (2 * r6**2 - r6) / r
                    f_vec = f_mag * dr / r
                    F[i] -= f_vec
                    F[j] += f_vec
                    PE += 4 * self.epsilon * (r6**2 - r6)

        return F, PE

    def step(self):
        """Velocity Verlet integration."""
        F, PE = self.forces()
        # Update velocities (half step)
        for i in range(self.n):
            self.v[i] += 0.5 * F[i] / self.mass[i] * self.dt
        # Update positions
        self.x += self.v * self.dt
        # Periodic boundaries
        self.x = self.x % self.L
        # New forces
        F_new, PE = self.forces()
        # Update velocities (second half)
        for i in range(self.n):
            self.v[i] += 0.5 * F_new[i] / self.mass[i] * self.dt

        KE = 0.5 * np.sum(self.mass[:, None] * self.v**2)
        return KE, PE

    def run(self, steps=500):
        """Run simulation and collect data."""
        KE_hist = []
        PE_hist = []
        positions = []

        for s in range(steps):
            KE, PE = self.step()
            KE_hist.append(KE)
            PE_hist.append(PE)
            if s % 50 == 0:
                positions.append(self.x.copy())

        return KE_hist, PE_hist, positions

# Run simulation
md = SimpleMD(n_particles=25, box_size=8, temp=2.0)
KE, PE, snapshots = md.run(steps=1000)

fig, axes = plt.subplots(2, 2, figsize=(11, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Molecular Dynamics — Terpene Liquid Simulation',
             color='white', fontsize=14, fontweight='bold')

# Snapshots
for idx, (ax_idx, snap_idx) in enumerate([(0,0), (0,1)]):
    ax = axes[ax_idx, snap_idx] if idx < 2 else None
    if idx >= 2:
        break

ax = axes[0, 0]
ax.set_facecolor('#1f2937')
pos = snapshots[0]
sizes = md.sigma * 200
ax.scatter(pos[:, 0], pos[:, 1], s=sizes, c=md.sigma, cmap='plasma',
          alpha=0.8, edgecolors='white', linewidth=0.5)
ax.set_xlim(0, md.L)
ax.set_ylim(0, md.L)
ax.set_title('Initial Configuration', color='white', fontsize=11, fontweight='bold')
ax.set_aspect('equal')
ax.tick_params(colors='white')

ax = axes[0, 1]
ax.set_facecolor('#1f2937')
pos = snapshots[-1]
ax.scatter(pos[:, 0], pos[:, 1], s=sizes, c=md.sigma, cmap='plasma',
          alpha=0.8, edgecolors='white', linewidth=0.5)
ax.set_xlim(0, md.L)
ax.set_ylim(0, md.L)
ax.set_title('After Equilibration', color='white', fontsize=11, fontweight='bold')
ax.set_aspect('equal')
ax.tick_params(colors='white')

# Energy
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
steps_arr = np.arange(len(KE))
ax.plot(steps_arr, KE, '#ef4444', linewidth=1, alpha=0.7, label='Kinetic')
ax.plot(steps_arr, PE, '#3b82f6', linewidth=1, alpha=0.7, label='Potential')
total = np.array(KE) + np.array(PE)
ax.plot(steps_arr, total, 'white', linewidth=1.5, label='Total')
ax.set_xlabel('Step', color='white', fontsize=11)
ax.set_ylabel('Energy', color='white', fontsize=11)
ax.set_title('Energy Conservation', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Speed distribution
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
speeds = np.sqrt(np.sum(md.v**2, axis=1))
ax.hist(speeds, bins=15, color='#f59e0b', alpha=0.8, edgecolor='white', density=True)
# Maxwell-Boltzmann fit
v_range = np.linspace(0, speeds.max()*1.5, 100)
T_eff = np.mean(md.mass * speeds**2) / 2
mb = v_range * np.exp(-0.5 * v_range**2 / T_eff) / T_eff
mb /= mb.max() / (np.histogram(speeds, bins=15, density=True)[0].max())
ax.plot(v_range, mb, 'white', linewidth=2, label='Maxwell-Boltzmann')
ax.set_xlabel('Speed', color='white', fontsize=11)
ax.set_ylabel('Probability', color='white', fontsize=11)
ax.set_title('Speed Distribution', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('md_sim.png', dpi=100, facecolor='#1f2937')
plt.show()

energy_drift = abs(total[-1] - total[0]) / abs(total[0]) * 100
print(f"Energy conservation: {energy_drift:.2f}% drift")
print(f"Average KE: {np.mean(KE):.2f}")
print(f"Average PE: {np.mean(PE):.2f}")
print(f"Effective temperature: {np.mean(KE)*2/md.n:.2f}")`,
      challenge: 'Run two simulations at different temperatures (temp=1 vs temp=5). Compare the speed distributions — which temperature would cause more evaporation?',
      successHint: 'You have built a molecular dynamics simulation with Lennard-Jones forces and velocity Verlet integration — the same algorithm used in professional MD codes like GROMACS and LAMMPS. The energy conservation and Maxwell-Boltzmann distribution confirm that the simulation is physically correct.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced organic chemistry modeling and simulation</span>
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
