import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CardamomHillsLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'GC-MS chromatogram — fingerprinting cardamom oil',
      concept: `**Gas Chromatography-Mass Spectrometry (GC-MS)** is the gold standard for analyzing essential oils. It separates a complex mixture into individual compounds and identifies each one.

How GC-MS works:
1. A tiny sample of oil is injected into a heated port (vaporizes instantly)
2. A carrier gas (helium) pushes the vapor through a long, thin coated tube (column)
3. Different compounds travel through the column at different speeds based on their **boiling point** and **polarity**
4. As each compound exits, a mass spectrometer fragments it and measures the fragment masses
5. The result is a **chromatogram**: peaks at different times (retention times), each representing one compound

Retention time depends on:
- **Boiling point**: lower BP compounds exit first (more volatile)
- **Polarity**: less polar compounds exit first (on non-polar columns)
- **Column temperature**: ramping temperature from 40°C to 250°C helps separate a wide range

A typical cardamom oil chromatogram shows 30-50 peaks, with 1,8-cineole and α-terpinyl acetate dominating.

📚 *We will simulate a GC-MS chromatogram and use matplotlib to create a publication-quality figure.*`,
      analogy: 'GC-MS is like a race where runners of different speeds start together. Lighter, faster molecules (pinene, limonene) sprint ahead and finish first. Heavier, slower molecules (terpinyl acetate) finish later. The finish-line camera (mass spectrometer) photographs each runner as they cross, identifying them by their unique face (mass spectrum).',
      storyConnection: 'When Sikkim cardamom is traded internationally, GC-MS analysis determines its quality grade. Premium cardamom has high cineole (>30%) and terpinyl acetate (>25%). The chromatogram is literally the chemical fingerprint that sets Sikkim cardamom apart from inferior varieties.',
      checkQuestion: 'Two cardamom samples both smell like cardamom, but their chromatograms are different. What does this mean?',
      checkAnswer: 'They contain different proportions of the same compounds. Perhaps one has more cineole (fresher, more eucalyptus-like) and less terpinyl acetate. Or one might contain compounds from adulteration (mixing with cheaper oils). GC-MS catches what the nose cannot: subtle differences in composition and quality that affect market value.',
      codeIntro: 'Simulate and plot a GC-MS chromatogram for cardamom essential oil.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulated GC-MS data for cardamom oil
compounds = [
    {"name": "α-Pinene", "rt": 5.2, "area": 3.5, "mw": 136},
    {"name": "β-Pinene", "rt": 6.1, "area": 1.5, "mw": 136},
    {"name": "Myrcene", "rt": 6.8, "area": 1.8, "mw": 136},
    {"name": "Limonene", "rt": 8.3, "area": 7.5, "mw": 136},
    {"name": "1,8-Cineole", "rt": 8.8, "area": 35.0, "mw": 154},
    {"name": "γ-Terpinene", "rt": 9.5, "area": 2.0, "mw": 136},
    {"name": "Linalool", "rt": 11.2, "area": 4.5, "mw": 154},
    {"name": "Terpinen-4-ol", "rt": 13.1, "area": 2.5, "mw": 154},
    {"name": "α-Terpineol", "rt": 13.8, "area": 3.0, "mw": 154},
    {"name": "Geraniol", "rt": 15.5, "area": 1.5, "mw": 154},
    {"name": "Linalyl acetate", "rt": 16.2, "area": 3.0, "mw": 196},
    {"name": "α-Terpinyl acetate", "rt": 17.8, "area": 30.0, "mw": 196},
    {"name": "Geranyl acetate", "rt": 18.5, "area": 2.0, "mw": 196},
    {"name": "trans-Nerolidol", "rt": 22.3, "area": 1.5, "mw": 222},
]

# Generate chromatogram
time = np.linspace(0, 25, 5000)
signal = np.zeros_like(time)

for comp in compounds:
    # Each peak is a Gaussian
    peak = comp["area"] * np.exp(-0.5 * ((time - comp["rt"]) / 0.15)**2)
    signal += peak

# Add baseline noise
signal += np.random.normal(0, 0.15, len(time))
signal = np.maximum(signal, 0)

fig, axes = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Full chromatogram
ax = axes[0]
ax.set_facecolor('#1f2937')
ax.plot(time, signal, '#60a5fa', linewidth=0.8)
ax.fill_between(time, signal, alpha=0.2, color='#3b82f6')

# Label major peaks
for comp in compounds:
    if comp["area"] > 3:
        peak_height = comp["area"] * 0.95
        ax.annotate(comp["name"], (comp["rt"], peak_height),
                   fontsize=7, color='white', rotation=45,
                   ha='left', va='bottom')

ax.set_xlabel('Retention Time (min)', color='white', fontsize=11)
ax.set_ylabel('Signal Intensity', color='white', fontsize=11)
ax.set_title('GC-MS Chromatogram — Sikkim Cardamom Essential Oil', color='white', fontsize=13, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Composition bar chart
ax = axes[1]
ax.set_facecolor('#1f2937')
sorted_comps = sorted(compounds, key=lambda x: -x["area"])
names = [c["name"] for c in sorted_comps[:10]]
areas = [c["area"] for c in sorted_comps[:10]]

colors_bar = ['#ef4444' if a > 20 else '#f59e0b' if a > 5 else '#3b82f6' for a in areas]
bars = ax.barh(range(len(names)), areas, color=colors_bar, alpha=0.8)
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, fontsize=9, color='white')
ax.set_xlabel('Relative Area (%)', color='white', fontsize=11)
ax.set_title('Top 10 Compounds by Concentration', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='x')
ax.invert_yaxis()

for bar, area in zip(bars, areas):
    ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2,
            f'{area:.1f}%', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.savefig('gcms.png', dpi=100, facecolor='#1f2937')
plt.show()

total_identified = sum(c["area"] for c in compounds)
print(f"Total identified: {total_identified:.1f}%")
print(f"Dominant compounds: 1,8-Cineole ({compounds[4]['area']}%) + α-Terpinyl acetate ({compounds[11]['area']}%)")
print(f"Together: {compounds[4]['area'] + compounds[11]['area']}% — the signature of quality cardamom")`,
      challenge: 'Create a "quality comparison" by generating a second chromatogram with lower cineole (20%) and higher limonene (15%). Plot both on the same axes. Which is the premium sample?',
      successHint: 'You have created a simulated GC-MS chromatogram — the analytical tool that controls quality in the global spice trade. The dual-panel layout (chromatogram + bar chart) is exactly how analytical chemists present essential oil data in research papers.',
    },
    {
      title: 'Vapor pressure curves — the thermodynamics of aroma',
      concept: `The **Clausius-Clapeyron equation** describes how vapor pressure changes with temperature:

**ln(P₂/P₁) = -ΔH_vap/R × (1/T₂ - 1/T₁)**

Where:
- P = vapor pressure
- ΔH_vap = enthalpy of vaporization (energy to evaporate 1 mole)
- R = gas constant (8.314 J/mol·K)
- T = absolute temperature (Kelvin)

Each compound has a characteristic ΔH_vap that determines how steeply its vapor pressure rises with temperature:
- Small molecules (α-pinene): lower ΔH_vap → pressure rises quickly
- Large molecules (terpinyl acetate): higher ΔH_vap → pressure rises slowly

This explains the temporal evolution of cardamom aroma:
1. **Cold pod**: barely any smell (all vapor pressures near zero)
2. **Warm pod**: light, citrusy (pinene, limonene dominate)
3. **Hot chai**: full aroma (cineole, terpinyl acetate now volatile enough)
4. **Boiling**: all compounds in the gas phase — maximum intensity

📚 *We will plot vapor pressure curves using the Clausius-Clapeyron equation and identify the temperature at which each compound becomes "smellable."*`,
      analogy: 'The Clausius-Clapeyron equation is like a "speed limit" for molecules escaping a liquid. Low temperature = strict speed limit, few escape. Higher temperature = relaxed limit, many escape. Each compound has a different "vehicle" — light molecules (small ΔH) are sports cars that reach escape speed easily. Heavy molecules need more temperature (a wider highway) before they can get out.',
      storyConnection: 'When Sikkim\'s chai is brewed with crushed cardamom, the boiling water unlocks the full spectrum of aroma. At room temperature, you smell only the lightest compounds. At 100°C, even the heavy base notes become airborne. The brewing temperature is not arbitrary — it is the thermodynamic key to cardamom\'s complete flavor.',
      checkQuestion: 'Why does cardamom lose its aroma over time if left exposed to air?',
      checkAnswer: 'The most volatile compounds (top notes like pinene and limonene) escape first and are not replaced. Over days, the oil loses its bright, citrusy character, leaving only the heavier, less volatile base notes. Eventually all volatile compounds evaporate, leaving behind non-volatile waxes and resins with no aroma. This is why whole pods keep their flavor longer than ground cardamom — less surface area for evaporation.',
      codeIntro: 'Plot Clausius-Clapeyron vapor pressure curves and identify the "aroma threshold temperature" for each compound.',
      code: `import numpy as np
import matplotlib.pyplot as plt

R = 8.314  # J/(mol·K)

# Compounds with thermodynamic data
compounds = {
    "α-Pinene":        {"dH": 37000, "bp": 156, "threshold_ppm": 0.005, "color": "#22c55e"},
    "Limonene":         {"dH": 39000, "bp": 176, "threshold_ppm": 0.01,  "color": "#3b82f6"},
    "1,8-Cineole":      {"dH": 41000, "bp": 176, "threshold_ppm": 0.003, "color": "#ef4444"},
    "Linalool":         {"dH": 44000, "bp": 198, "threshold_ppm": 0.002, "color": "#f59e0b"},
    "α-Terpinyl acetate": {"dH": 48000, "bp": 220, "threshold_ppm": 0.01, "color": "#8b5cf6"},
}

T_range = np.linspace(10 + 273.15, 110 + 273.15, 200)  # 10-110°C in Kelvin
T_celsius = T_range - 273.15

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Panel 1: Vapor pressure vs temperature
ax = axes[0]
ax.set_facecolor('#1f2937')
for name, data in compounds.items():
    T_bp = data["bp"] + 273.15
    # Clausius-Clapeyron: ln(P/760) = -dH/R * (1/T - 1/Tbp)
    ln_P = -data["dH"] / R * (1/T_range - 1/T_bp)
    P = 760 * np.exp(ln_P)  # mmHg
    ax.plot(T_celsius, P, color=data["color"], linewidth=2, label=name)

ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Vapor Pressure (mmHg)', color='white', fontsize=11)
ax.set_title('Vapor Pressure Curves', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)
ax.set_ylim(0, 50)

# Panel 2: Log scale (clearer exponential behavior)
ax = axes[1]
ax.set_facecolor('#1f2937')
for name, data in compounds.items():
    T_bp = data["bp"] + 273.15
    ln_P = -data["dH"] / R * (1/T_range - 1/T_bp)
    P = 760 * np.exp(ln_P)
    ax.semilogy(T_celsius, P, color=data["color"], linewidth=2, label=name)

# Mark key temperatures
for t, label in [(25, 'Room'), (65, 'Chai water'), (100, 'Boiling')]:
    ax.axvline(x=t, color='gray', linestyle=':', alpha=0.5)
    ax.text(t+1, 0.02, label, color='gray', fontsize=8, rotation=90)

ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Vapor Pressure (mmHg, log)', color='white', fontsize=11)
ax.set_title('Log Scale — Exponential Rise', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Relative aroma intensity
ax = axes[2]
ax.set_facecolor('#1f2937')
temps_of_interest = [20, 40, 60, 80, 100]
width = 0.15
x = np.arange(len(temps_of_interest))

for i, (name, data) in enumerate(compounds.items()):
    T_bp = data["bp"] + 273.15
    intensities = []
    for t in temps_of_interest:
        T_k = t + 273.15
        ln_P = -data["dH"] / R * (1/T_k - 1/T_bp)
        P = 760 * np.exp(ln_P)
        # Intensity proportional to P / threshold
        intensity = min(10, P / data["threshold_ppm"])
        intensities.append(intensity)
    ax.bar(x + i*width - 2*width, intensities, width, color=data["color"],
           alpha=0.8, label=name[:10])

ax.set_xticks(x)
ax.set_xticklabels([f'{t}°C' for t in temps_of_interest], color='white')
ax.set_ylabel('Relative Aroma Intensity', color='white')
ax.set_title('Aroma Intensity by Temperature', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

plt.tight_layout()
plt.savefig('vapor_curves.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Aroma Evolution with Temperature ===")
for t in [20, 40, 60, 80, 100]:
    print(f"\\\nAt {t}°C:")
    for name, data in compounds.items():
        T_k = t + 273.15
        T_bp = data["bp"] + 273.15
        P = 760 * np.exp(-data["dH"]/R * (1/T_k - 1/T_bp))
        smellable = "DETECTABLE" if P > data["threshold_ppm"] else "too faint"
        print(f"  {name:25s} P={P:.4f} mmHg  [{smellable}]")`,
      challenge: 'At what temperature do ALL five compounds become detectable? This is the "full aroma temperature" — is it close to the temperature of chai?',
      successHint: 'You have applied the Clausius-Clapeyron equation to a real chemical system. The grouped bar chart reveals why temperature transforms cardamom\'s aroma from simple to complex — each compound has its own "wake-up temperature." This is the thermodynamics that every chai maker exploits intuitively.',
    },
    {
      title: 'Oil yield vs. growing conditions — the terroir of cardamom',
      concept: `**Terroir** (from French "terre" = land) describes how environmental conditions affect crop quality. For cardamom, key factors include:

- **Altitude**: optimal 600-1500 m in Sikkim
- **Rainfall**: 2000-3000 mm/year (monsoon-dependent)
- **Temperature**: 10-35°C range, optimal 15-25°C
- **Shade**: 40-60% canopy cover (understory crop)
- **Soil**: well-drained, organic-rich, slightly acidic (pH 5-6.5)

Sikkim\'s large cardamom (*Amomum subulatum*) differs from green cardamom (*Elettaria cardamomum*):
- Larger pods, smokier flavor
- Higher altitude tolerance
- Fire-cured (traditional drying method)
- Contains different volatile profile: more cineole, less terpinyl acetate

Oil yield and composition change with:
- **Harvest timing**: early harvest = more terpenes, late = more oxygenated compounds
- **Post-harvest drying**: sun-dried vs. fire-cured affects flavor dramatically
- **Storage**: quality declines ~15-20% per year in ground form

📚 *We will use matplotlib to create multi-factor visualizations showing how environment affects oil quality.*`,
      analogy: 'Terroir for cardamom is like terroir for wine. A Burgundy grape and a Napa grape are the same species, but their wines taste different because of soil, climate, and altitude. Sikkim cardamom tastes different from Kerala cardamom for the same reason: altitude changes the chemical synthesis pathways in the plant.',
      storyConnection: 'The cardamom hills of Sikkim produce a uniquely flavored spice because of their specific combination of altitude, rainfall, and shade. The story\'s setting — misty mountain slopes under a forest canopy — is not just scenery. It is the terroir that makes Sikkim cardamom irreplaceable.',
      checkQuestion: 'Why does higher altitude generally produce more aromatic cardamom?',
      checkAnswer: 'Higher altitude means cooler temperatures, which slow the plant\'s growth. Slower growth allows more time for secondary metabolite production (terpenes, essential oils). Also, higher UV radiation at altitude triggers more terpene synthesis as a protective response. The plant produces more "chemical armor" at altitude, which happens to be what we value as aroma.',
      codeIntro: 'Visualize how altitude, rainfall, and shade affect cardamom oil yield and composition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate farm data: 50 cardamom plantations across Sikkim
n_farms = 50
altitude = np.random.uniform(400, 2000, n_farms)  # meters
rainfall = np.random.uniform(1500, 4000, n_farms)  # mm/year
shade = np.random.uniform(20, 80, n_farms)          # % canopy cover
soil_ph = np.random.uniform(4.5, 7.5, n_farms)

# Oil yield model (% by weight)
# Optimal: altitude 800-1400m, rainfall 2000-3000mm, shade 40-60%
yield_alt = 1 - 0.5 * ((altitude - 1100) / 600)**2
yield_rain = 1 - 0.5 * ((rainfall - 2500) / 800)**2
yield_shade = 1 - 0.5 * ((shade - 50) / 20)**2
yield_ph = 1 - 0.5 * ((soil_ph - 5.5) / 1.5)**2

oil_yield = 4 * np.clip(yield_alt * yield_rain * yield_shade * yield_ph, 0.1, 1)
oil_yield += np.random.normal(0, 0.3, n_farms)
oil_yield = np.clip(oil_yield, 0.5, 6.0)

# Cineole content (% of oil) — increases with altitude
cineole = 25 + 10 * (altitude - 800) / 1000 + np.random.normal(0, 3, n_farms)
cineole = np.clip(cineole, 15, 45)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Cardamom Terroir Analysis — Sikkim', color='white', fontsize=14, fontweight='bold')

# Altitude vs yield
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
sc = ax.scatter(altitude, oil_yield, c=cineole, cmap='RdYlGn', s=50, alpha=0.8, edgecolors='white', linewidth=0.5)
plt.colorbar(sc, ax=ax, label='Cineole %')
ax.set_xlabel('Altitude (m)', color='white', fontsize=11)
ax.set_ylabel('Oil Yield (%)', color='white', fontsize=11)
ax.set_title('Altitude vs. Yield (color = cineole)', color='white', fontsize=11, fontweight='bold')
ax.axvspan(800, 1400, alpha=0.1, color='#22c55e', label='Optimal zone')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Rainfall vs yield
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
sc = ax.scatter(rainfall, oil_yield, c=shade, cmap='YlGn', s=50, alpha=0.8, edgecolors='white', linewidth=0.5)
plt.colorbar(sc, ax=ax, label='Shade %')
ax.set_xlabel('Rainfall (mm/year)', color='white', fontsize=11)
ax.set_ylabel('Oil Yield (%)', color='white', fontsize=11)
ax.set_title('Rainfall vs. Yield (color = shade)', color='white', fontsize=11, fontweight='bold')
ax.axvspan(2000, 3000, alpha=0.1, color='#22c55e', label='Optimal zone')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Shade vs cineole content
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
ax.scatter(shade, cineole, c=altitude, cmap='plasma', s=50, alpha=0.8, edgecolors='white', linewidth=0.5)
ax.set_xlabel('Shade Cover (%)', color='white', fontsize=11)
ax.set_ylabel('Cineole Content (%)', color='white', fontsize=11)
ax.set_title('Shade vs. Quality (color = altitude)', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Quality grade distribution
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
# Grade: Premium (yield>3.5, cineole>30), Standard, Low
grades = []
for y, c in zip(oil_yield, cineole):
    if y > 3.5 and c > 30:
        grades.append('Premium')
    elif y > 2.5 and c > 25:
        grades.append('Standard')
    else:
        grades.append('Low')

grade_counts = {g: grades.count(g) for g in ['Premium', 'Standard', 'Low']}
colors_grade = ['#22c55e', '#f59e0b', '#ef4444']
bars = ax.bar(grade_counts.keys(), grade_counts.values(), color=colors_grade, alpha=0.8)
for bar, count in zip(bars, grade_counts.values()):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            str(count), ha='center', color='white', fontsize=12)
ax.set_ylabel('Number of Farms', color='white', fontsize=11)
ax.set_title('Quality Grade Distribution', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

plt.tight_layout()
plt.savefig('terroir.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Terroir Summary ===")
print(f"Premium farms: {grade_counts['Premium']}/{n_farms}")
print(f"Average oil yield: {oil_yield.mean():.1f}%")
print(f"Average cineole: {cineole.mean():.0f}%")
premium_mask = np.array([g == 'Premium' for g in grades])
if premium_mask.any():
    print(f"\\\nPremium farms are at: {altitude[premium_mask].mean():.0f}m avg altitude")
    print(f"  with {shade[premium_mask].mean():.0f}% shade and {rainfall[premium_mask].mean():.0f}mm rainfall")`,
      challenge: 'Add a "climate change" scenario: increase temperature by 2°C (shifts optimal altitude up by 300m). How many farms drop from Premium to Standard grade?',
      successHint: 'You have created a multi-factor terroir analysis using scatter plots with color coding — the same visualization technique used in agronomy and flavor science. The premium cardamom zone is surprisingly narrow: only specific combinations of altitude, rainfall, and shade produce the best oil.',
    },
    {
      title: 'Distillation column efficiency — separating compound by compound',
      concept: `Industrial essential oil production uses **fractional distillation** to separate individual compounds from the crude oil. A distillation column contains multiple **theoretical plates** — stages where liquid and vapor reach equilibrium.

The number of plates determines separation quality:
- **1 plate** (simple distillation): poor separation, crude fractions
- **5-10 plates**: good separation of compounds with different boiling points
- **50+ plates**: near-perfect separation (used in perfumery)

The key equation is **Raoult\'s Law** for ideal mixtures:
**P_i = x_i × P_i°**

Where P_i = partial pressure of component i, x_i = mole fraction in liquid, P_i° = pure component vapor pressure.

For cardamom oil distillation:
- **First fraction** (140-160°C): pinenes, limonene (top notes)
- **Main fraction** (170-200°C): cineole, linalool (heart of the oil)
- **Last fraction** (200-230°C): terpinyl acetate, heavy esters (base notes)
- **Residue**: non-volatile waxes, pigments

Each fraction has different market value — cineole-rich fractions command premium prices in pharmaceutical and flavor markets.

📚 *We will simulate a fractional distillation and plot temperature vs. composition over time.*`,
      analogy: 'Fractional distillation is like sifting sand through progressively finer sieves. The coarsest sieve (lowest plate) removes the biggest particles (heaviest compounds). Each finer sieve (higher plate) removes smaller and smaller particles. The top of the column produces the finest, purest material.',
      storyConnection: 'Sikkim\'s cardamom cooperatives are moving from crude steam distillation to fractional distillation to increase the value of their product. By separating the oil into fractions, a kilogram of crude oil worth Rs 3,000 becomes fractions collectively worth Rs 8,000-12,000.',
      checkQuestion: 'Why is it impossible to perfectly separate two compounds with the same boiling point (like limonene and cineole, both at 176°C)?',
      checkAnswer: 'If two compounds have identical boiling points, they evaporate at the same rate at every temperature. No number of distillation plates can separate them. In this case, you must use a different technique: (1) chemical extraction (different solubilities), (2) chromatography (different affinities for the column material), or (3) crystallization (different melting points). GC-MS can separate them analytically even if distillation cannot.',
      codeIntro: 'Simulate a fractional distillation of cardamom oil and plot the separation of compounds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified distillation simulation
compounds = {
    "α-Pinene":     {"bp": 156, "initial_pct": 3.5, "color": "#22c55e"},
    "Limonene":     {"bp": 176, "initial_pct": 7.5, "color": "#3b82f6"},
    "1,8-Cineole":  {"bp": 176, "initial_pct": 35.0, "color": "#ef4444"},
    "Linalool":     {"bp": 198, "initial_pct": 4.5, "color": "#f59e0b"},
    "α-Terpineol":  {"bp": 219, "initial_pct": 3.0, "color": "#8b5cf6"},
    "Terpinyl acetate": {"bp": 220, "initial_pct": 30.0, "color": "#ec4899"},
}

# Distillation: ramp temperature from 140°C to 240°C
temp_ramp = np.linspace(140, 240, 200)
distillate_composition = {name: np.zeros(200) for name in compounds}
total_distillate = np.zeros(200)

remaining = {name: data["initial_pct"] for name, data in compounds.items()}

for i, T in enumerate(temp_ramp):
    for name, data in compounds.items():
        bp = data["bp"]
        # Evaporation rate: proportional to how close T is to bp
        # Gaussian centered at bp with width ~15°C
        rate = 0.15 * np.exp(-0.5 * ((T - bp) / 12)**2)
        evaporated = min(remaining[name], remaining[name] * rate)
        remaining[name] -= evaporated
        distillate_composition[name][i] = evaporated
        total_distillate[i] += evaporated

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fractional Distillation of Cardamom Oil', color='white', fontsize=14, fontweight='bold')

# Panel 1: Instantaneous distillate composition vs temperature
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
for name, data in compounds.items():
    ax.plot(temp_ramp, distillate_composition[name], color=data["color"],
            linewidth=2, label=name)
ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Distillate Rate (%/°C)', color='white', fontsize=11)
ax.set_title('Distillation Curves', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Stacked area (what comes out when)
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
arrays = [distillate_composition[name] for name in compounds]
colors_stack = [data["color"] for data in compounds.values()]
ax.stackplot(temp_ramp, *arrays, labels=list(compounds.keys()),
             colors=colors_stack, alpha=0.8)
ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Composition', color='white', fontsize=11)
ax.set_title('Stacked Distillate Composition', color='white', fontsize=12, fontweight='bold')
ax.legend(loc='upper right', facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=6)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Fraction purity
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
fractions = {
    'Light (140-165°C)': (140, 165),
    'Medium (165-195°C)': (165, 195),
    'Heavy (195-240°C)': (195, 240),
}
frac_names = list(fractions.keys())
x_pos = np.arange(len(frac_names))
width = 0.12

for i, (name, data) in enumerate(compounds.items()):
    amounts = []
    for frac_name, (t_lo, t_hi) in fractions.items():
        mask = (temp_ramp >= t_lo) & (temp_ramp < t_hi)
        amounts.append(distillate_composition[name][mask].sum())
    ax.bar(x_pos + i*width - 2.5*width, amounts, width,
           color=data["color"], alpha=0.8, label=name[:10])

ax.set_xticks(x_pos)
ax.set_xticklabels(frac_names, fontsize=9, color='white')
ax.set_ylabel('Amount in Fraction (%)', color='white', fontsize=11)
ax.set_title('Compound Distribution by Fraction', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=6)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

# Panel 4: Cumulative yield
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
cumulative = np.cumsum(total_distillate)
ax.plot(temp_ramp, cumulative, '#60a5fa', linewidth=2.5)
ax.fill_between(temp_ramp, cumulative, alpha=0.2, color='#3b82f6')
ax.axhline(y=cumulative[-1]*0.9, color='gold', linestyle='--', alpha=0.7, label='90% recovery')
ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Cumulative Yield (%)', color='white', fontsize=11)
ax.set_title('Cumulative Distillation Yield', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('distillation.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Fraction Composition ===")
for frac_name, (t_lo, t_hi) in fractions.items():
    mask = (temp_ramp >= t_lo) & (temp_ramp < t_hi)
    print(f"\\\n{frac_name}:")
    for name in compounds:
        amt = distillate_composition[name][mask].sum()
        print(f"  {name:25s}: {amt:.1f}%")`,
      challenge: 'Add a "residue" category — what percentage of the original oil remains undistilled after reaching 240°C? This residue is the non-volatile waxy material.',
      successHint: 'You have simulated fractional distillation with four visualization panels. The stacked area chart and fraction distribution show how careful temperature control separates a complex mixture into valuable fractions. This is the core operation of the flavor and fragrance industry.',
    },
    {
      title: 'Aroma wheel — visualizing the sensory profile of Sikkim cardamom',
      concept: `An **aroma wheel** is a circular visualization that maps the sensory descriptors of a food or beverage. For cardamom, the wheel includes:

**Inner ring**: primary categories
- Fresh/Cooling, Sweet/Floral, Woody/Spicy, Citrus, Herbal/Green

**Middle ring**: specific descriptors
- Eucalyptus, menthol, camphor (under Fresh)
- Rose, jasmine, honey (under Sweet)
- Cedar, clove, pepper (under Woody)
- Lemon, orange, bergamot (under Citrus)
- Mint, grass, tea (under Herbal)

**Outer ring**: chemical compounds responsible
- 1,8-Cineole → Eucalyptus
- Linalool → Rose, floral
- α-Terpinyl acetate → Sweet, balsamic
- Limonene → Citrus
- α-Pinene → Pine, resinous

The aroma profile of Sikkim large cardamom differs from southern green cardamom:
- More smoky/woody notes (from fire-curing)
- Higher cineole (more medicinal/cooling)
- Less floral (lower linalool)
- Unique "campfire" character from drying process

📚 *We will create a radar/spider chart comparing aroma profiles of different cardamom origins.*`,
      analogy: 'An aroma wheel is like a color wheel for flavors. Just as artists use the color wheel to describe hues (blue, blue-green, green), flavor scientists use the aroma wheel to describe scents (floral, floral-sweet, sweet). Both organize continuous spectra into named categories that people can communicate about.',
      storyConnection: 'The unique aroma of Sikkim cardamom — smokier, more medicinal, more complex than other varieties — is the product of both terroir and traditional processing. The aroma wheel captures this uniqueness in a visual format that can be shared with buyers, chefs, and scientists around the world.',
      checkQuestion: 'Why does fire-curing create "smoky" flavors that are not present in the fresh pods?',
      checkAnswer: 'Fire-curing (drying pods over a wood fire) introduces new molecules through two processes: (1) Pyrolysis — heat breaks down some terpenes into smaller fragments, creating new compounds. (2) Smoke absorption — wood smoke contains phenolic compounds (guaiacol, syringol) that are absorbed by the pods. These smoke molecules are not produced by the cardamom plant — they are artifacts of processing, like how roasting creates coffee\'s flavor from bland green beans.',
      codeIntro: 'Create radar charts comparing the aroma profiles of Sikkim cardamom, Kerala cardamom, and Guatemalan cardamom.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Aroma descriptors and compound correlations
descriptors = ['Fresh/\\nCooling', 'Sweet/\\nFloral', 'Woody/\\nSpicy', 'Citrus', 'Herbal/\\nGreen',
               'Smoky', 'Camphor', 'Balsamic']

# Scores (0-10) for different origins
profiles = {
    'Sikkim Large': [8, 5, 7, 4, 6, 8, 7, 6],
    'Kerala Green':  [7, 8, 4, 7, 5, 1, 5, 7],
    'Guatemala':     [6, 7, 3, 8, 4, 1, 4, 5],
}

colors = {'Sikkim Large': '#ef4444', 'Kerala Green': '#22c55e', 'Guatemala': '#3b82f6'}

n = len(descriptors)
angles = np.linspace(0, 2 * np.pi, n, endpoint=False).tolist()
angles += angles[:1]  # close the polygon

fig, axes = plt.subplots(1, 2, figsize=(14, 6),
                         subplot_kw=dict(polar=True) if True else {})
fig.patch.set_facecolor('#1f2937')

# Panel 1: Overlay radar chart
ax = fig.add_subplot(121, polar=True)
ax.set_facecolor('#1f2937')

for origin, scores in profiles.items():
    values = scores + scores[:1]
    ax.plot(angles, values, 'o-', linewidth=2, color=colors[origin], label=origin, markersize=6)
    ax.fill(angles, values, alpha=0.15, color=colors[origin])

ax.set_xticks(angles[:-1])
ax.set_xticklabels(descriptors, fontsize=8, color='white')
ax.set_ylim(0, 10)
ax.set_yticks([2, 4, 6, 8, 10])
ax.set_yticklabels(['2', '4', '6', '8', '10'], fontsize=7, color='gray')
ax.set_title('Cardamom Aroma Profiles', color='white', fontsize=13, fontweight='bold', pad=20)
ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), facecolor='#374151',
          edgecolor='gray', labelcolor='white', fontsize=8)
ax.grid(color='gray', alpha=0.3)
ax.spines['polar'].set_color('gray')

# Panel 2: Compound-to-descriptor mapping (bar chart)
ax2 = fig.add_subplot(122)
ax2.set_facecolor('#1f2937')

compound_map = {
    '1,8-Cineole\\n(35%)': [9, 2, 3, 1, 2, 0, 8, 3],
    'Terpinyl\\nacetate (30%)': [3, 8, 2, 2, 3, 0, 2, 7],
    'Limonene\\n(8%)': [2, 1, 1, 9, 2, 0, 1, 1],
    'Linalool\\n(5%)': [1, 9, 1, 2, 4, 0, 1, 3],
    'Smoke\\ncompounds': [0, 0, 5, 0, 1, 10, 2, 2],
}

x = np.arange(len(descriptors))
width = 0.15
comp_colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#6b7280']

for i, (comp, scores) in enumerate(compound_map.items()):
    ax2.bar(x + i*width - 2*width, scores, width, color=comp_colors[i],
            alpha=0.8, label=comp)

ax2.set_xticks(x)
ax2.set_xticklabels([d.replace('\\\n', ' ') for d in descriptors], fontsize=7,
                     rotation=45, ha='right', color='white')
ax2.set_ylabel('Contribution Score', color='white', fontsize=11)
ax2.set_title('Which Compound Causes Which Aroma?', color='white', fontsize=12, fontweight='bold')
ax2.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax2.tick_params(colors='white')
ax2.grid(alpha=0.15, axis='y')

plt.tight_layout()
plt.savefig('aroma_wheel.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Aroma Profile Comparison ===\\\n")
for origin, scores in profiles.items():
    dominant = descriptors[scores.index(max(scores))].replace('\\\n', ' ')
    print(f"{origin:20s} — Dominant: {dominant} (score {max(scores)})")
    overall = sum(scores) / len(scores)
    print(f"{'':20s}   Complexity: {overall:.1f}/10")

print("\\\nSikkim's signature: high smoky + camphor notes from fire-curing")
print("This is what makes it irreplaceable in Tibetan butter tea and biryani")`,
      challenge: 'Add a "synthetic cardamom flavoring" profile (high cineole 10, everything else 2-3). How different does it look on the radar chart? Why do chefs prefer natural cardamom?',
      successHint: 'You have created radar charts — the standard visualization for sensory analysis in food science. The overlay clearly shows what makes Sikkim cardamom unique: the smoky, camphor-forward profile from fire-curing. The compound-to-descriptor mapping connects chemistry to sensation.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Essential oil analysis with matplotlib</span>
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
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
