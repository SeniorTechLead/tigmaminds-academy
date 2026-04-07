import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RubberTripuraLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Visualising the stress-strain curve',
      concept: `When you stretch rubber, the relationship between **stress** (force per area) and **strain** (fractional extension) reveals its character.

Unlike metals (which follow a straight line then break), rubber\'s curve is S-shaped:
- **Low strain**: chains uncoil easily — low stress
- **Medium strain**: chains straighten — stress increases
- **High strain**: chains fully extended — stress rises steeply
- **Break**: chains snap

The area under the curve represents the **energy absorbed** — this is why rubber is used in shock absorbers and protective equipment.

📚 *We will use numpy arrays and matplotlib to plot the stress-strain curves of different rubber types.*`,
      analogy: 'Pull a coiled phone cord. At first it extends easily (uncoiling). Then it gets harder (cord straightening). Finally it resists strongly (cord material stretching). Rubber chains do the same — uncoil, straighten, resist, break.',
      storyConnection: 'Tripura\'s rubber is tested by stretching samples in laboratories to generate these exact curves. The shape of the curve determines what the rubber can be used for — soft curves for gloves, steep curves for tyres.',
      checkQuestion: 'Why does the stress-strain curve of rubber curve upward at high strain?',
      checkAnswer: 'At high strain, most polymer chains are fully straightened. Any further stretching must stretch the C-C bonds themselves, which requires much more force than uncoiling. The stiffness jumps because you have exhausted the "easy" deformation mechanism.',
      codeIntro: 'Plot stress-strain curves for natural rubber and compare with synthetic alternatives.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Mooney-Rivlin model for rubber: stress = 2(C1 + C2/lambda) * (lambda - 1/lambda^2)
def rubber_stress(strain, C1, C2, break_strain):
    lam = 1 + strain
    stress = 2 * (C1 + C2 / lam) * (lam - 1 / lam**2)
    stress[strain > break_strain] = np.nan
    return stress / 1e6  # Convert to MPa

strain = np.linspace(0, 8, 500)

rubbers = {
    'Natural Rubber (NR)':     {'C1': 0.16e6, 'C2': 0.01e6, 'break': 6.5, 'color': '#34d399'},
    'SBR (Synthetic)':         {'C1': 0.20e6, 'C2': 0.02e6, 'break': 5.0, 'color': '#60a5fa'},
    'Silicone Rubber':         {'C1': 0.10e6, 'C2': 0.005e6, 'break': 7.0, 'color': '#f59e0b'},
    'Nitrile (Oil-resistant)': {'C1': 0.35e6, 'C2': 0.03e6, 'break': 4.0, 'color': '#f87171'},
}

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

for name, props in rubbers.items():
    stress = rubber_stress(strain, props['C1'], props['C2'], props['break'])
    ax.plot(strain * 100, stress, color=props['color'], linewidth=2.5, label=name)
    # Mark break point
    brk_lam = 1 + props['break']
    brk_stress = 2 * (props['C1'] + props['C2'] / brk_lam) * (brk_lam - 1 / brk_lam**2) / 1e6
    ax.plot(props['break'] * 100, brk_stress, 'x', color=props['color'], markersize=12, markeredgewidth=3)

ax.set_xlabel('Strain (%)', color='white', fontsize=12)
ax.set_ylabel('Stress (MPa)', color='white', fontsize=12)
ax.set_title('Stress-Strain Curves — Rubber Types', color='white', fontsize=14)
ax.legend(facecolor='#374151', labelcolor='white', loc='upper left')
ax.set_xlim(0, 800)

plt.tight_layout()
plt.savefig('stress_strain.png', dpi=100, facecolor='#1f2937')
plt.show()
print("Natural rubber stretches the most (650%) with moderate strength.")
print("Nitrile is stiffest but breaks earliest (400%).")
print("The X marks the breaking point for each rubber type.")`,
      challenge: 'Calculate the energy absorbed (area under each curve) for all four rubbers. Which absorbs the most energy before breaking? This determines impact resistance.',
      successHint: 'The stress-strain curve is a material\'s fingerprint. From its shape, engineers can predict whether a rubber is suitable for tyres, gloves, seals, or shock absorbers.',
    },
    {
      title: 'Molecular weight distribution',
      concept: `Real polymers do not have a single chain length — they have a **distribution** of chain lengths. This distribution affects properties:

- **Narrow distribution**: uniform behaviour, predictable
- **Broad distribution**: mixed properties, may be stronger in some ways

Key measures:
- **Mₙ** (number-average MW): total mass / number of chains
- **Mw** (weight-average MW): biased toward heavier chains
- **PDI** (polydispersity index): Mw / Mₙ — measures width of distribution

PDI = 1 means all chains are identical (impossible in practice)
PDI ≈ 1.5-3.0 is typical for natural rubber
PDI > 5 means very broad distribution

📚 *We will generate a molecular weight distribution using numpy random distributions and plot it with matplotlib.*`,
      analogy: 'If you measure the height of 1,000 students, you get a distribution — most are near average, some are very tall, some are very short. Polymer chains are the same: most are near the average length, but there is a spread.',
      storyConnection: 'The molecular weight distribution of Tripura\'s rubber depends on the tree variety, tapping method, and processing. Labs test this distribution to grade rubber quality. Higher-quality rubber has a narrower distribution.',
      checkQuestion: 'If a rubber sample has Mₙ = 200,000 and Mw = 500,000, what is the PDI? Is this narrow or broad?',
      checkAnswer: 'PDI = Mw/Mₙ = 500,000/200,000 = 2.5. This is moderately broad — typical for natural rubber. A very narrow distribution would have PDI close to 1.0.',
      codeIntro: 'Generate and visualise the molecular weight distribution of Tripura rubber.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate molecular weight distributions for different rubbers
distributions = {
    'Tripura NR (high grade)': {'mean': 5.3, 'std': 0.25, 'n': 10000},
    'Tripura NR (standard)':   {'mean': 5.2, 'std': 0.40, 'n': 10000},
    'SBR (synthetic)':          {'mean': 5.0, 'std': 0.20, 'n': 10000},
}

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))
fig.patch.set_facecolor('#1f2937')
colors = ['#34d399', '#f59e0b', '#60a5fa']

for ax, (name, params), color in zip(axes, distributions.items(), colors):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

    # Log-normal distribution (realistic for polymers)
    log_mw = np.random.normal(params['mean'], params['std'], params['n'])
    mw = 10**log_mw  # molecular weights

    # Statistics
    Mn = np.mean(mw)
    Mw = np.sum(mw**2) / np.sum(mw)
    PDI = Mw / Mn

    ax.hist(mw / 1000, bins=60, color=color, alpha=0.7, edgecolor='white', linewidth=0.3)
    ax.axvline(x=Mn/1000, color='white', linestyle='--', linewidth=2, label=f'Mₙ={Mn/1000:.0f}k')
    ax.axvline(x=Mw/1000, color='#ef4444', linestyle='--', linewidth=2, label=f'Mw={Mw/1000:.0f}k')

    ax.set_xlabel('MW (×1000 g/mol)', color='white', fontsize=9)
    ax.set_title(f'{name}\\nPDI = {PDI:.2f}', color='white', fontsize=10)
    ax.legend(facecolor='#374151', labelcolor='white', fontsize=7)

axes[0].set_ylabel('Number of chains', color='white', fontsize=10)

plt.tight_layout()
plt.savefig('mw_dist.png', dpi=100, facecolor='#1f2937')
plt.show()

# Summary table
print("MOLECULAR WEIGHT DISTRIBUTION COMPARISON")
print("=" * 55)
print(f"{'Rubber':<25} | {'Mₙ (kg/mol)':>12} | {'Mw (kg/mol)':>12} | {'PDI':>5}")
print("-" * 55)
for name, params in distributions.items():
    log_mw = np.random.normal(params['mean'], params['std'], params['n'])
    mw = 10**log_mw
    Mn, Mw = np.mean(mw), np.sum(mw**2) / np.sum(mw)
    print(f"{name:<25} | {Mn/1000:>12.0f} | {Mw/1000:>12.0f} | {Mw/Mn:>5.2f}")`,
      challenge: 'What happens if you blend two rubbers with different distributions? Generate a bimodal distribution and calculate its PDI.',
      successHint: 'The molecular weight distribution is a hidden variable that controls rubber quality. Two rubbers can have the same average MW but very different distributions — and very different performance.',
    },
    {
      title: 'Cross-link density visualisation',
      concept: `The degree of vulcanisation can be visualised by plotting the **cross-link network**. Each cross-link connects two chains, forming a 2D or 3D network.

The **cross-link density** (ν) is the number of cross-links per unit volume:

\`ν = ρ / (2 × Mc)\`

where ρ is rubber density and Mc is the average molecular weight between cross-links.

Cross-link density directly determines:
- **Elastic modulus**: G = ν × k × T (stiffer with more cross-links)
- **Swelling resistance**: densely cross-linked rubber absorbs less solvent
- **Maximum stretch**: fewer cross-links → more extensible

📚 *We will create a visual representation of the polymer network at different cross-link densities.*`,
      analogy: 'Cross-links are like the knots in a fishing net. Few knots → a loose, stretchy net. Many knots → a tight, rigid net. The rubber network works the same way.',
      storyConnection: 'The vulcanisation process applied to Tripura\'s rubber can be tuned by adjusting sulphur content and curing time. Too little cross-linking → weak product. Too much → brittle. Getting it right is both science and craft.',
      checkQuestion: 'If the elastic modulus G = ν×k×T, and you double the cross-link density at constant temperature, what happens to the stiffness?',
      checkAnswer: 'It doubles. The modulus is directly proportional to cross-link density. This linear relationship is remarkably simple — it means you can precisely control rubber stiffness by controlling sulphur content.',
      codeIntro: 'Visualise the polymer network at low, medium, and high cross-link densities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def draw_network(ax, n_chains, n_crosslinks, title):
    """Draw a 2D polymer network visualization."""
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

    # Generate random chain paths
    for i in range(n_chains):
        # Random walk for each chain
        n_points = 30
        x = np.cumsum(np.random.randn(n_points) * 0.3) + np.random.uniform(0, 10)
        y = np.cumsum(np.random.randn(n_points) * 0.3) + np.random.uniform(0, 10)
        ax.plot(x, y, color='#60a5fa', linewidth=1, alpha=0.6)

    # Add cross-links (yellow dots connecting nearby chain points)
    xl = np.random.uniform(1, 9, n_crosslinks)
    yl = np.random.uniform(1, 9, n_crosslinks)
    ax.scatter(xl, yl, color='#fbbf24', s=40, zorder=5, edgecolors='white', linewidths=0.5)

    # Calculate properties
    k_B = 1.381e-23
    T = 300
    density = n_crosslinks / 100  # per unit area
    modulus = density * k_B * T * 1e23  # scaled

    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.set_title(f'{title}\\n{n_crosslinks} cross-links', color='white', fontsize=10)
    ax.set_aspect('equal')

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))
fig.patch.set_facecolor('#1f2937')

configs = [
    (20, 5, 'Low (soft rubber)'),
    (20, 25, 'Medium (tyre rubber)'),
    (20, 80, 'High (hard rubber)'),
]

for ax, (chains, xlinks, title) in zip(axes, configs):
    draw_network(ax, chains, xlinks, title)

plt.tight_layout()
plt.savefig('network.png', dpi=100, facecolor='#1f2937')
plt.show()

# Quantitative comparison
print("CROSS-LINK DENSITY vs PROPERTIES")
print("=" * 60)
print(f"{'Cross-links':>12} | {'Density':>8} | {'Modulus (MPa)':>13} | {'Max stretch':>11}")
print("-" * 60)

k_B = 1.381e-23
T = 300
rho = 920  # kg/m^3

for xlinks in [5, 15, 25, 50, 80, 150]:
    Mc = 400000 / xlinks  # avg MW between cross-links
    nu = rho / (2 * Mc * 0.001)  # cross-link density (mol/m^3)
    G = nu * 8.314 * T / 1e6  # modulus in MPa
    max_stretch = (Mc / 68)**0.5  # approximate
    print(f"{xlinks:>12} | {nu:>7.0f} | {G:>13.2f} | {max_stretch:>10.0f}%")`,
      challenge: 'Add sulphur content as a variable. If each sulphur bridge uses 2 S atoms (MW=64), calculate the sulphur percentage for each cross-link level.',
      successHint: 'The polymer network is the microscopic structure that determines macroscopic behaviour. A few extra cross-links transform soft latex into a rigid bowling ball.',
    },
    {
      title: 'Temperature effects — thermal analysis',
      concept: `Rubber behaviour changes dramatically with temperature:

- **Glass transition temperature (Tg)**: below this, rubber becomes glassy and brittle
  - Natural rubber: Tg ≈ -72°C
  - SBR: Tg ≈ -55°C

- **Crystallisation**: at very low temperatures, NR chains align and crystallise (stiffen)
- **Degradation**: above ~150°C, chains break down (thermal degradation)

The **modulus-temperature curve** shows these transitions:
- Below Tg: high modulus (glassy, brittle)
- At Tg: modulus drops sharply (glass transition)
- Above Tg: low modulus (rubbery, elastic)
- Above 150°C: modulus drops further (degradation)

📚 *We will model the temperature-dependent modulus and plot the characteristic rubber thermal response.*`,
      analogy: 'Butter in a fridge is hard (glassy). At room temperature it is soft and spreadable (rubbery). In a hot pan it melts (degradation). Rubber follows the same pattern but at different temperatures. The glass transition is where butter goes from hard to spreadable.',
      storyConnection: 'Tripura has a tropical climate (15-35°C), well above natural rubber\'s Tg of -72°C. This means the rubber is always in its elastic state — ideal for harvesting and processing. In cold countries, rubber products must be formulated to keep Tg below winter temperatures.',
      checkQuestion: 'The Challenger space shuttle disaster was partly caused by an O-ring at -1°C. If the O-ring rubber had Tg = -10°C, was it in the rubbery or glassy state?',
      checkAnswer: 'At -1°C, it was in the transition zone — partially glassy, losing its elasticity. It could not flex and seal properly. This is why the investigation concluded that cold weather was a contributing factor. The rubber needed a Tg well below -1°C.',
      codeIntro: 'Model how rubber modulus changes with temperature and plot the glass transition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Modulus vs temperature model
def rubber_modulus(T_celsius, Tg, G_glassy, G_rubbery, transition_width=15):
    """Model glass transition with sigmoid function."""
    T = T_celsius
    # Sigmoid transition
    x = (T - Tg) / transition_width
    fraction_rubbery = 1 / (1 + np.exp(-x))
    log_G = np.log10(G_glassy) * (1 - fraction_rubbery) + np.log10(G_rubbery) * fraction_rubbery
    # Thermal degradation above 150°C
    degradation = np.where(T > 150, 0.98 ** (T - 150), 1.0)
    return 10**log_G * degradation

T = np.linspace(-100, 200, 600)

rubbers = {
    'Natural Rubber (Tripura)': {'Tg': -72, 'G_glass': 3e9, 'G_rubber': 2e6, 'color': '#34d399'},
    'SBR Synthetic':            {'Tg': -55, 'G_glass': 2.5e9, 'G_rubber': 3e6, 'color': '#60a5fa'},
    'Nitrile':                  {'Tg': -30, 'G_glass': 2e9, 'G_rubber': 5e6, 'color': '#f87171'},
    'Silicone':                 {'Tg': -120, 'G_glass': 1.5e9, 'G_rubber': 0.5e6, 'color': '#f59e0b'},
}

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

for name, p in rubbers.items():
    G = rubber_modulus(T, p['Tg'], p['G_glass'], p['G_rubber'])
    ax.semilogy(T, G, color=p['color'], linewidth=2.5, label=name)
    ax.axvline(x=p['Tg'], color=p['color'], linestyle=':', alpha=0.3)

# Tripura climate range
ax.axvspan(15, 35, alpha=0.1, color='#34d399', label='Tripura climate')

ax.set_xlabel('Temperature (°C)', color='white', fontsize=12)
ax.set_ylabel('Modulus (Pa)', color='white', fontsize=12)
ax.set_title('Rubber Modulus vs Temperature — Glass Transition', color='white', fontsize=13)
ax.legend(facecolor='#374151', labelcolor='white', fontsize=8)
ax.set_xlim(-100, 200)

# Annotate regions
ax.text(-80, 5e9, 'GLASSY\\n(brittle)', color='#9ca3af', fontsize=10, ha='center')
ax.text(50, 5e5, 'RUBBERY\\n(elastic)', color='#9ca3af', fontsize=10, ha='center')

plt.tight_layout()
plt.savefig('thermal.png', dpi=100, facecolor='#1f2937')
plt.show()

print("Glass transition temperatures:")
for name, p in rubbers.items():
    safe_range = f"{p['Tg'] + 20}°C to 150°C"
    print(f"  {name:<25}: Tg = {p['Tg']}°C, safe use: {safe_range}")
print("\\nSilicone has the widest usable range (-100°C to 200°C).")
print("Natural rubber is ideal for Tripura's tropical climate.")`,
      challenge: 'Plot the loss tangent (tan delta) at the glass transition. This peaks at Tg and indicates energy dissipation. Use a Gaussian peak centred at Tg.',
      successHint: 'The glass transition is the most important single number for any rubber product. It determines whether the material works in winter, in the tropics, or in space.',
    },
    {
      title: 'Rubber ageing — degradation over time',
      concept: `Rubber degrades over time through several mechanisms:

1. **Oxidation**: O₂ attacks double bonds, breaking chains → softening
2. **Ozone cracking**: O₃ breaks surface bonds → visible cracks
3. **UV degradation**: sunlight energy breaks bonds → embrittlement
4. **Thermal ageing**: heat accelerates all degradation reactions

Degradation follows the **Arrhenius equation**:
\`rate = A × exp(-Ea/RT)\`

This means degradation rate doubles approximately every 10°C increase in temperature (the "10-degree rule").

Engineers predict product lifetime using **accelerated ageing tests**: test at high temperature, then extrapolate to use temperature.

📚 *We will model rubber ageing and predict how long Tripura\'s rubber products will last under different conditions.*`,
      analogy: 'A rubber band left in a sunny window becomes brittle and snaps within months. The same band kept in a dark drawer stays elastic for years. Light and heat are the enemies of rubber — they break the very chains that give it elasticity.',
      storyConnection: 'Rubber products made from Tripura\'s natural rubber are marketed with a shelf life. Understanding degradation rates helps manufacturers guarantee quality — and helps farmers produce rubber that resists ageing better.',
      checkQuestion: 'If rubber degrades twice as fast for every 10°C increase, how much faster does it degrade at 50°C compared to 20°C?',
      checkAnswer: '(50-20)/10 = 3 doublings. 2³ = 8 times faster. A tyre at 50°C ages 8 times faster than one stored at 20°C. This is why hot climates are harsher on rubber products.',
      codeIntro: 'Model rubber degradation and predict product lifetime at different temperatures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Arrhenius degradation model
Ea = 80000      # J/mol (activation energy for NR oxidation)
R = 8.314       # gas constant
A = 1e10        # pre-exponential factor

def degradation_rate(T_celsius):
    T = T_celsius + 273.15
    return A * np.exp(-Ea / (R * T))

def lifetime(T_celsius, threshold=0.5):
    """Time until rubber loses 50% of its properties."""
    rate = degradation_rate(T_celsius)
    return threshold / rate / (365.25 * 24 * 3600)  # years

temps = np.linspace(-10, 80, 200)
lifetimes = np.array([lifetime(T) for T in temps])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Degradation rate vs temperature
rates = np.array([degradation_rate(T) for T in temps])
ax1.semilogy(temps, rates, color='#f87171', linewidth=2.5)
ax1.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax1.set_ylabel('Degradation rate (1/s)', color='white', fontsize=11)
ax1.set_title('Degradation Rate vs Temperature', color='white', fontsize=12)
ax1.axvspan(15, 35, alpha=0.1, color='#34d399', label='Tripura climate')
ax1.legend(facecolor='#374151', labelcolor='white')

# Lifetime vs temperature
ax2.semilogy(temps, lifetimes, color='#34d399', linewidth=2.5)
ax2.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax2.set_ylabel('Lifetime (years)', color='white', fontsize=11)
ax2.set_title('Rubber Product Lifetime', color='white', fontsize=12)
ax2.axvspan(15, 35, alpha=0.1, color='#34d399', label='Tripura')
ax2.axhline(y=5, color='#f59e0b', linestyle='--', alpha=0.7, label='5-year warranty')
ax2.legend(facecolor='#374151', labelcolor='white')

plt.tight_layout()
plt.savefig('ageing.png', dpi=100, facecolor='#1f2937')
plt.show()

# Print lifetime table
print("RUBBER LIFETIME vs TEMPERATURE")
print("=" * 45)
for T in [10, 20, 25, 30, 40, 50, 60, 70]:
    lt = lifetime(T)
    print(f"  {T:>3d}°C: {lt:>8.1f} years")

# 10-degree rule verification
print("\\n10-DEGREE RULE VERIFICATION:")
for T in [20, 30, 40, 50]:
    r1 = degradation_rate(T)
    r2 = degradation_rate(T + 10)
    print(f"  {T}°C → {T+10}°C: rate increases {r2/r1:.1f}x")`,
      challenge: 'Antioxidants slow degradation by a factor of 3-5. Add an antioxidant-treated curve to the lifetime plot. How much does it extend the product life at 30°C?',
      successHint: 'Degradation modelling predicts when products fail. For Tripura\'s rubber industry, this means setting realistic warranties and optimising antioxidant formulations.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualising Polymer Properties</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
