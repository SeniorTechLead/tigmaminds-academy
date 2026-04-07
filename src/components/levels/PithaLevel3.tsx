import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PithaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Microbial growth kinetics — the math of fermentation',
      concept: `Fermentation is not magic — it is microbiology governed by precise mathematical laws. When grandmother prepares pitha batter and leaves it overnight, she is creating conditions for **Lactobacillus** and other lactic acid bacteria (LAB) to multiply exponentially.

Microbial growth follows four phases: **lag** (bacteria adapt to new environment, no growth), **exponential** (population doubles at a constant rate), **stationary** (nutrients run out, growth equals death), and **death** (population declines). The exponential phase is described by:

N(t) = N₀ × 2^(t/g)

where N₀ is the initial population, t is time, and g is the **generation time** (doubling time). For Lactobacillus in rice batter at 30°C, g ≈ 45-60 minutes. Starting from 10⁶ bacteria per mL, after 8 hours (overnight) the population reaches 10⁶ × 2^(480/50) ≈ 10⁹ per mL — a thousand-fold increase.

The **Monod equation** describes how growth rate depends on nutrient concentration: μ = μ_max × S/(Ks + S), where S is substrate concentration and Ks is the half-saturation constant. As the bacteria consume sugars, S drops, μ slows, and the culture transitions from exponential to stationary phase.`,
      analogy: 'Microbial growth is like a rumor spreading through a school. In the morning (lag phase), only one person knows. By lunch (exponential phase), everyone they told has told others — the number doubles every period. By afternoon (stationary phase), almost everyone has heard it and there are few new people to tell. The rumor does not spread linearly; it explodes exponentially and then saturates.',
      storyConnection: 'When grandmother leaves the pitha batter to rest overnight, she is not just waiting — she is running a precision fermentation process. The billions of bacteria that grow during those hours produce the lactic acid that gives pitha its tangy flavor and the CO₂ bubbles that make it fluffy. Her kitchen is a microbiology laboratory.',
      checkQuestion: 'If you halve the initial bacterial population (N₀) but keep everything else the same, how much longer does it take to reach the same final population in exponential phase?',
      checkAnswer: 'Exactly one generation time longer. If N₀ is halved, you need one extra doubling to catch up. With g=50 minutes, halving the starter culture delays peak population by about 50 minutes. This is why grandmother always saves a portion of old batter as "starter" — it provides a larger N₀, reducing lag time and ensuring the batter is ready by morning.',
      codeIntro: 'Model the four phases of microbial growth in pitha batter and visualize how temperature and starter culture size affect fermentation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Microbial growth model for pitha fermentation ---
def monod_growth(t_hours, N0, S0, mu_max, Ks, Y, death_rate=0.01):
    """Simulate microbial growth with Monod kinetics.
    N0: initial bacteria (CFU/mL)
    S0: initial substrate (g/L sugar)
    mu_max: max specific growth rate (1/h)
    Ks: half-saturation constant (g/L)
    Y: yield coefficient (CFU/g substrate)
    """
    dt = 0.01  # hours
    steps = int(t_hours / dt)
    N = np.zeros(steps)
    S = np.zeros(steps)
    mu = np.zeros(steps)
    N[0] = N0
    S[0] = S0

    for i in range(1, steps):
        mu[i-1] = mu_max * S[i-1] / (Ks + S[i-1])
        dN = (mu[i-1] - death_rate) * N[i-1] * dt
        dS = -mu[i-1] * N[i-1] / Y * dt
        N[i] = max(N[i-1] + dN, 0)
        S[i] = max(S[i-1] + dS, 0)

    time = np.linspace(0, t_hours, steps)
    return time, N, S, mu

# Parameters for Lactobacillus in rice batter
params = {
    'N0': 1e6,        # CFU/mL (with starter culture)
    'S0': 30.0,       # g/L available sugars from rice starch
    'mu_max': 0.85,   # 1/h at 30°C (generation time ~50 min)
    'Ks': 0.5,        # g/L
    'Y': 1e8,         # CFU per gram sugar consumed
}

t, N, S, mu = monod_growth(16, **params)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- Growth curve (log scale) ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.semilogy(t, N, color='#22c55e', linewidth=2)
ax.axhline(y=1e9, color='gray', linestyle='--', alpha=0.5, label='Typical pitha-ready density')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Bacteria (CFU/mL)', color='white')
ax.set_title('Microbial Growth in Pitha Batter', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Substrate depletion ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(t, S, color='#f59e0b', linewidth=2)
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Available Sugar (g/L)', color='white')
ax.set_title('Substrate Consumption', color='white')
ax.tick_params(colors='gray')

# --- Growth rate over time ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(t[:-1], mu[:-1], color='#3b82f6', linewidth=2)
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Specific Growth Rate (1/h)', color='white')
ax.set_title('Growth Rate Slows as Sugar Depletes', color='white')
ax.tick_params(colors='gray')

# --- Temperature effect ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
temps = [20, 25, 30, 35, 40]
colors_temp = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']
for temp, col in zip(temps, colors_temp):
    # Arrhenius-like temperature dependence
    mu_adj = params['mu_max'] * np.exp(-0.05 * (temp - 30)**2)
    t_t, N_t, _, _ = monod_growth(16, params['N0'], params['S0'], mu_adj, params['Ks'], params['Y'])
    ax.semilogy(t_t, N_t, color=col, linewidth=1.5, label=f'{temp}°C')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Bacteria (CFU/mL)', color='white')
ax.set_title('Temperature Effect on Growth', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Starter culture size effect ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
starters = [1e4, 1e5, 1e6, 1e7]
colors_s = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']
for n0, col in zip(starters, colors_s):
    t_s, N_s, _, _ = monod_growth(16, n0, params['S0'], params['mu_max'], params['Ks'], params['Y'])
    ax.semilogy(t_s, N_s, color=col, linewidth=1.5, label=f'N₀ = {n0:.0e}')
ax.axhline(y=1e9, color='gray', linestyle='--', alpha=0.5)
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Bacteria (CFU/mL)', color='white')
ax.set_title('Starter Culture Size Effect', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Monod equation visualization ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
S_range = np.linspace(0, 10, 200)
for ks, col, lbl in [(0.1, '#22c55e', 'Ks=0.1 (high affinity)'),
                      (0.5, '#f59e0b', 'Ks=0.5 (moderate)'),
                      (2.0, '#ef4444', 'Ks=2.0 (low affinity)')]:
    mu_range = params['mu_max'] * S_range / (ks + S_range)
    ax.plot(S_range, mu_range, color=col, linewidth=2, label=lbl)
ax.set_xlabel('Substrate Concentration (g/L)', color='white')
ax.set_ylabel('Growth Rate μ (1/h)', color='white')
ax.set_title('Monod Equation: Growth Rate vs Substrate', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

peak_N = N.max()
time_to_peak = t[np.argmax(N)]
print("Pitha Fermentation Kinetics:")
print(f"  Initial bacteria: {params['N0']:.0e} CFU/mL")
print(f"  Peak bacteria: {peak_N:.2e} CFU/mL")
print(f"  Time to peak: {time_to_peak:.1f} hours")
print(f"  Fold increase: {peak_N/params['N0']:.0f}x")
print(f"  Generation time: {np.log(2)/params['mu_max']*60:.0f} minutes")
print(f"  Sugar consumed: {params['S0'] - S[-1]:.1f} g/L ({(params['S0']-S[-1])/params['S0']*100:.0f}%)")`,
      challenge: 'Add a second bacterial species (yeast, Saccharomyces) with different growth parameters. Model competitive exclusion: both species compete for the same sugar. Which one dominates and why?',
      successHint: 'Microbial kinetics turns the art of fermentation into a predictable science. The Monod equation is to microbiology what Newton\'s laws are to physics — a simple model that captures the essential dynamics of a complex system.',
    },
    {
      title: 'Lactic acid production and pH dynamics',
      concept: `The primary product of lactic acid fermentation is, unsurprisingly, **lactic acid** (CH₃CHOHCOOH). As Lactobacillus metabolizes glucose through the glycolytic pathway, each glucose molecule yields 2 molecules of lactic acid plus 2 ATP (energy for the bacterium).

The accumulating lactic acid lowers the batter's pH. Fresh rice batter starts near pH 6.5-7.0. After overnight fermentation, the pH drops to 4.0-4.5. This pH drop is not just a side effect — it is functionally critical:

1. **Flavor**: lactic acid provides the distinctive tangy taste of fermented pitha. The sourness intensity maps directly to acid concentration and pH.
2. **Preservation**: the low pH inhibits pathogenic bacteria (Salmonella, E. coli, Staphylococcus) that cannot survive below pH 4.6. Grandmother's fermented batter is actually safer than the unfermented version.
3. **Texture**: the acid denatures proteins in the rice batter, creating a smoother, more cohesive texture.
4. **Self-regulation**: lactic acid also inhibits the Lactobacillus themselves at high concentrations (product inhibition), which prevents over-fermentation.

The **Henderson-Hasselbalch equation** relates pH to acid concentration: pH = pKa + log([A⁻]/[HA]), where pKa for lactic acid is 3.86.`,
      analogy: 'pH dynamics in fermentation are like the thermostat in a house. The bacteria produce lactic acid (heat), which lowers the pH (raises temperature). When the pH gets too low (house gets too hot), the bacteria slow down (thermostat triggers cooling). The system self-regulates toward a stable endpoint. Grandmother does not need to monitor pH — the biology does it for her.',
      storyConnection: 'The tangy flavor that makes grandmother\'s pitha special is not a secret ingredient — it is lactic acid, produced by billions of bacteria working through the night. The exact sourness depends on temperature, time, and starter culture — variables that grandmother controls intuitively through generations of practice, and that we can model mathematically.',
      checkQuestion: 'Why does the pH drop rapidly at first and then level off, even though bacteria are still alive in stationary phase?',
      checkAnswer: 'Two factors: (1) In stationary phase, the bacteria are no longer growing rapidly, so lactic acid production per unit time decreases dramatically. (2) Product inhibition — as lactic acid accumulates, it directly inhibits the enzymes of the glycolytic pathway, reducing the rate of acid production even further. Additionally, the batter\'s buffering capacity (from proteins and phosphates in rice) resists pH change, requiring more acid per pH unit as we move further from neutral.',
      codeIntro: 'Model lactic acid production, pH dynamics, and the coupled system of growth-acid-pH-inhibition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Coupled fermentation model: growth + acid + pH ---
def fermentation_model(t_hours, N0, S0, pH0, temp_C, mu_max_ref=0.85):
    dt = 0.01
    steps = int(t_hours / dt)
    N = np.zeros(steps)
    S = np.zeros(steps)
    LA = np.zeros(steps)  # lactic acid (g/L)
    pH = np.zeros(steps)

    N[0] = N0
    S[0] = S0
    pH[0] = pH0

    Ks = 0.5
    Y_NS = 1e8       # cells per g sugar
    Y_LA = 0.9       # g lactic acid per g sugar consumed
    pKa = 3.86       # lactic acid pKa
    buffer_cap = 0.03 # buffer capacity of rice batter (mol/L/pH)
    LA_inhibit = 15.0 # lactic acid concentration for 50% inhibition (g/L)
    pH_inhibit = 3.5  # pH for 50% inhibition

    # Temperature effect
    mu_max = mu_max_ref * np.exp(-0.05 * (temp_C - 30)**2)

    for i in range(1, steps):
        # Growth rate with substrate, product, and pH inhibition
        mu_S = S[i-1] / (Ks + S[i-1])  # Monod
        mu_LA = LA_inhibit / (LA_inhibit + LA[i-1])  # product inhibition
        mu_pH = 1 / (1 + 10**(pH_inhibit - pH[i-1]))  # pH inhibition
        mu = mu_max * mu_S * mu_LA * mu_pH

        # Growth
        dN = mu * N[i-1] * dt
        dS = -mu * N[i-1] / Y_NS * dt
        dLA = -dS * Y_LA  # acid produced from sugar consumed

        N[i] = max(N[i-1] + dN, 0)
        S[i] = max(S[i-1] + dS, 0)
        LA[i] = LA[i-1] + dLA

        # pH from Henderson-Hasselbalch (simplified)
        # Total acid in buffer: delta_pH = delta_acid / buffer_capacity
        if LA[i] > 0:
            pH[i] = pH0 - LA[i] / (90.08 * buffer_cap) * 0.3  # empirical scaling
            pH[i] = max(pH[i], 3.0)
        else:
            pH[i] = pH0

    time = np.linspace(0, t_hours, steps)
    return time, N, S, LA, pH

# Standard fermentation
t, N, S, LA, pH = fermentation_model(16, N0=1e6, S0=30.0, pH0=6.5, temp_C=30)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- Four-panel growth dynamics ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax2 = ax.twinx()
ax.semilogy(t, N, color='#22c55e', linewidth=2, label='Bacteria')
ax2.plot(t, S, color='#f59e0b', linewidth=2, label='Sugar')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Bacteria (CFU/mL)', color='#22c55e')
ax2.set_ylabel('Sugar (g/L)', color='#f59e0b')
ax.set_title('Growth and Substrate', color='white')
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(t, LA, color='#ef4444', linewidth=2, label='Lactic acid')
ax2b = ax.twinx()
ax2b.plot(t, pH, color='#3b82f6', linewidth=2, label='pH')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Lactic Acid (g/L)', color='#ef4444')
ax2b.set_ylabel('pH', color='#3b82f6')
ax.set_title('Acid Production and pH Drop', color='white')
ax2b.set_ylim(3, 7)
ax.tick_params(colors='gray')
ax2b.tick_params(colors='gray')

# --- pH vs lactic acid (parametric) ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(LA, pH, color='#a855f7', linewidth=2)
ax.axhline(y=4.6, color='#ef4444', linestyle='--', alpha=0.5, label='pH 4.6 (safety threshold)')
ax.axhline(y=4.0, color='#22c55e', linestyle='--', alpha=0.5, label='pH 4.0 (optimal tang)')
ax.set_xlabel('Lactic Acid (g/L)', color='white')
ax.set_ylabel('pH', color='white')
ax.set_title('pH vs Acid Concentration', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Temperature comparison ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
for temp, col in [(20, '#3b82f6'), (25, '#22c55e'), (30, '#f59e0b'), (35, '#ef4444'), (40, '#a855f7')]:
    _, _, _, LA_t, pH_t = fermentation_model(16, 1e6, 30.0, 6.5, temp)
    ax.plot(np.linspace(0,16,len(pH_t)), pH_t, color=col, linewidth=1.5, label=f'{temp}°C')
ax.axhline(y=4.6, color='white', linestyle='--', alpha=0.3)
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('pH', color='white')
ax.set_title('pH Trajectory by Temperature', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Flavor-safety window ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
times_16 = np.linspace(0, 16, len(LA))
# Safety: pH < 4.6 is safe
safety = (pH < 4.6).astype(float)
# Flavor: pH 3.8-4.5 is optimal tang
flavor = ((pH > 3.8) & (pH < 4.5)).astype(float)
ax.fill_between(times_16, 0, safety, alpha=0.3, color='#22c55e', label='Safe (pH < 4.6)')
ax.fill_between(times_16, 0, flavor, alpha=0.5, color='#f59e0b', label='Optimal flavor')
ax.plot(times_16, pH / 7, color='#3b82f6', linewidth=2, label='pH (scaled)')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Score', color='white')
ax.set_title('Flavor-Safety Window', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Lactic acid production rate ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
dLA = np.diff(LA) / 0.01
ax.plot(times_16[:-1], dLA, color='#ef4444', linewidth=1.5)
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Acid Production Rate (g/L/h)', color='white')
ax.set_title('Acid Production Rate Over Time', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

final_pH = pH[-1]
final_LA = LA[-1]
safe_time = times_16[np.argmax(pH < 4.6)] if np.any(pH < 4.6) else float('inf')
print("Lactic Acid Fermentation Results:")
print(f"  Final pH: {final_pH:.2f}")
print(f"  Final lactic acid: {final_LA:.1f} g/L")
print(f"  Time to reach pH 4.6 (safe): {safe_time:.1f} hours")
print(f"  Peak acid production rate: {dLA.max():.2f} g/L/h")
print(f"  Sugar utilization: {(30-S[-1])/30*100:.0f}%")`,
      challenge: 'Model the buffering capacity of rice batter more accurately using a titration curve approach. Rice batter has protein and phosphate buffers — add these explicitly and show how they resist the initial pH drop.',
      successHint: 'The pH dynamics of fermentation are a beautiful example of coupled differential equations: growth produces acid, acid inhibits growth, and the whole system self-regulates to a stable endpoint. Understanding this lets you predict fermentation outcomes from first principles.',
    },
    {
      title: 'Starch gelatinization — the physics of cooking rice',
      concept: `Before fermentation even begins, the rice must be processed. **Starch gelatinization** — the transformation that occurs when starch granules are heated in water — is the fundamental physics of cooking rice and preparing pitha batter.

Raw starch exists as semi-crystalline granules: alternating crystalline (amylopectin in ordered helical arrays) and amorphous (amylose in random coils) regions. When heated above the **gelatinization temperature** (65-75°C for rice starch), water penetrates the granule, disrupts hydrogen bonds in the crystalline regions, and causes the granule to swell irreversibly. The viscosity of the suspension increases dramatically.

This process follows **Avrami kinetics**: α(t) = 1 - exp(-k × tⁿ), where α is the fraction gelatinized, k is the rate constant (temperature-dependent, following Arrhenius: k = A × exp(-Ea/RT)), and n is the Avrami exponent (typically 1-2 for starch, reflecting the geometry of crystal destruction).

For pitha, the degree of gelatinization matters enormously. Under-gelatinized starch resists enzymatic attack (amylase from bacteria cannot access the crystalline regions), starving the bacteria of sugar. Over-gelatinized starch becomes gummy. The sweet spot — around 70-80% gelatinization — gives bacteria easy access to sugars while maintaining batter structure.`,
      analogy: 'Starch gelatinization is like ice melting in a glass. At first (below the melting point), ice is rigid and crystalline. As you warm it, the crystal structure breaks down and water flows freely. Starch granules do the same thing: their internal crystals "melt" when heated in water, releasing the stored sugar molecules. The gelatinization temperature is the starch\'s "melting point."',
      storyConnection: 'Grandmother soaks and grinds the rice, then heats it to just the right temperature. She knows from experience that the batter must thicken but not become paste. What she controls intuitively — the degree of gelatinization — determines whether the bacteria will have enough food for good fermentation.',
      checkQuestion: 'Why does rice soaked in cold water overnight partially gelatinize even without heating?',
      checkAnswer: 'Extended soaking allows water to penetrate the amorphous regions of starch granules through osmosis, which can partially disrupt the crystalline structure even at room temperature. This is "cold gelatinization" — much slower and less complete than thermal gelatinization, but enough to make the rice softer and more digestible. This is why grandmother soaks the rice before grinding: it pre-gelatinizes the starch, making it more accessible to bacterial enzymes during fermentation.',
      codeIntro: 'Model starch gelatinization kinetics using Avrami and Arrhenius equations, and find the optimal cooking conditions for pitha batter.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Starch gelatinization model ---
def arrhenius_rate(T_celsius, A=1e15, Ea=100000, R=8.314):
    """Temperature-dependent rate constant."""
    T_kelvin = T_celsius + 273.15
    return A * np.exp(-Ea / (R * T_kelvin))

def avrami_gelatinization(time_min, T_celsius, n=1.5):
    """Fraction gelatinized using Avrami kinetics.
    Returns alpha(t) = 1 - exp(-k * t^n)
    """
    k = arrhenius_rate(T_celsius)
    alpha = 1 - np.exp(-k * time_min**n)
    return np.clip(alpha, 0, 1)

# --- Gelatinization at different temperatures ---
time = np.linspace(0, 60, 500)  # minutes
temperatures = [55, 60, 65, 70, 75, 80, 90]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax = axes[0, 0]
ax.set_facecolor('#111827')
colors_t = plt.cm.YlOrRd(np.linspace(0.2, 0.9, len(temperatures)))
for T, col in zip(temperatures, colors_t):
    alpha = avrami_gelatinization(time, T)
    ax.plot(time, alpha * 100, color=col, linewidth=2, label=f'{T}°C')
ax.axhline(y=70, color='white', linestyle='--', alpha=0.3, label='70% target')
ax.axhline(y=80, color='white', linestyle=':', alpha=0.3, label='80% target')
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Gelatinization (%)', color='white')
ax.set_title('Starch Gelatinization Kinetics', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Rate constant vs temperature (Arrhenius plot) ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
T_range = np.linspace(40, 100, 200)
k_range = arrhenius_rate(T_range)
ax.semilogy(T_range, k_range, color='#ef4444', linewidth=2)
ax.axvline(x=65, color='#f59e0b', linestyle='--', alpha=0.5, label='Onset (65°C)')
ax.axvline(x=75, color='#22c55e', linestyle='--', alpha=0.5, label='Complete (75°C)')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Rate Constant k', color='white')
ax.set_title('Arrhenius Plot: Rate vs Temperature', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Viscosity change during gelatinization ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
# Viscosity model: increases exponentially with gelatinization, peaks, then decreases
alpha_70 = avrami_gelatinization(time, 70)
# Brabender-like viscosity curve
viscosity = 100 + 800 * alpha_70 * np.exp(-0.5 * np.maximum(alpha_70 - 0.8, 0)**2 / 0.05)
viscosity += 20 * np.random.randn(len(time))
ax.plot(time, viscosity, color='#a855f7', linewidth=2)
ax.set_xlabel('Time (minutes) at 70°C', color='white')
ax.set_ylabel('Viscosity (arbitrary units)', color='white')
ax.set_title('Batter Viscosity During Cooking', color='white')
ax.tick_params(colors='gray')

# --- Gelatinization vs enzyme accessibility ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
gelat_levels = np.linspace(0, 100, 100)
# Enzyme accessibility increases sigmoidally with gelatinization
accessibility = 100 / (1 + np.exp(-0.1 * (gelat_levels - 50)))
# Batter quality: too little = poor fermentation, too much = gummy
quality = accessibility * np.exp(-0.0005 * (gelat_levels - 75)**2)
quality = quality / quality.max() * 100

ax.plot(gelat_levels, accessibility, color='#22c55e', linewidth=2, label='Enzyme accessibility')
ax.plot(gelat_levels, quality, color='#f59e0b', linewidth=2, label='Batter quality')
optimal = gelat_levels[np.argmax(quality)]
ax.axvline(x=optimal, color='white', linestyle='--', alpha=0.5, label=f'Optimal: {optimal:.0f}%')
ax.set_xlabel('Gelatinization (%)', color='white')
ax.set_ylabel('Score (%)', color='white')
ax.set_title('Gelatinization vs Fermentation Quality', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Water absorption during soaking (room temp) ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
soak_time = np.linspace(0, 24, 500)  # hours
# Fick's law diffusion model for water uptake
D_water = 0.5e-10  # diffusion coefficient (m^2/s)
grain_radius = 2e-3  # 2mm
# Simplified: fractional uptake
water_uptake = 1 - (6 / np.pi**2) * np.exp(-D_water * soak_time * 3600 * np.pi**2 / grain_radius**2)
water_uptake = np.clip(water_uptake, 0, 0.95)
cold_gelat = water_uptake * 15  # ~15% max cold gelatinization

ax.plot(soak_time, water_uptake * 100, color='#3b82f6', linewidth=2, label='Water uptake (%)')
ax.plot(soak_time, cold_gelat, color='#22c55e', linewidth=2, label='Cold gelatinization (%)')
ax.set_xlabel('Soaking Time (hours)', color='white')
ax.set_ylabel('Percentage', color='white')
ax.set_title('Rice Soaking: Water Uptake & Cold Gelatinization', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Amylose vs amylopectin content effect ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
rice_types = {
    'Waxy (2%)': 2,
    'Bora (15%)': 15,
    'Joha (22%)': 22,
    'Long-grain (28%)': 28,
}
for name, amylose_pct in rice_types.items():
    # Higher amylose = higher gelatinization temperature = slower onset
    T_eff = 65 + amylose_pct * 0.3  # shifts onset
    alpha_rice = avrami_gelatinization(time, T_eff)
    ax.plot(time, alpha_rice * 100, linewidth=2, label=f'{name} amylose')
ax.set_xlabel('Time at 70°C (minutes)', color='white')
ax.set_ylabel('Gelatinization (%)', color='white')
ax.set_title('Effect of Rice Variety (Amylose Content)', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Starch Gelatinization Analysis:")
for T in [60, 65, 70, 75, 80]:
    alpha_30 = avrami_gelatinization(np.array([30.0]), T)[0] * 100
    print(f"  {T}°C for 30 min: {alpha_30:.0f}% gelatinized")
print(f"\\\nOptimal gelatinization for pitha: ~{optimal:.0f}%")
print("Below 60%: bacteria starve (crystalline starch is inaccessible)")
print("Above 85%: batter becomes gummy (excess starch gel)")`,
      challenge: 'Model the effect of grinding fineness: finer rice flour has smaller particles, faster water penetration, and faster gelatinization. Create a particle-size-dependent model and find the optimal grind.',
      successHint: 'Starch gelatinization is where physics meets cooking. The Avrami equation — originally developed for metal crystallization — turns out to describe rice cooking perfectly. The same math works for both steel heat treatment and pitha preparation.',
    },
    {
      title: 'CO₂ production and batter rising — gas dynamics in dough',
      concept: `The bubbles that make pitha light and fluffy come from **CO₂** produced during fermentation. While lactic acid bacteria primarily produce lactic acid (homofermentative pathway), the batter also contains yeasts and heterofermentative bacteria that produce CO₂ as a byproduct.

The key reaction: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ (alcoholic fermentation by yeast), and C₆H₁₂O₆ → CH₃CHOHCOOH + CO₂ + CH₃COOH (heterofermentative LAB pathway).

CO₂ dissolves in the aqueous batter until it reaches **saturation** (governed by Henry's Law: C = kH × P, where C is dissolved concentration, kH is Henry's constant, and P is partial pressure). Once saturated, excess CO₂ forms bubbles. These bubbles are trapped by the batter's viscous matrix (the gelatinized starch network acts like a net), causing the batter to rise.

Bubble dynamics follow the **ideal gas law**: PV = nRT. As fermentation continues, n (moles of CO₂) increases, and the bubbles expand. Temperature also matters: warmer batter holds less dissolved CO₂ (lower solubility) and produces it faster (faster fermentation), leading to more vigorous rising but also greater risk of bubble escape (collapse).

The final volume increase of the batter is typically 50-100%, depending on the starch network's ability to trap gas.`,
      analogy: 'CO₂ in fermenting batter is like air in a balloon factory. The bacteria are the factory workers inflating balloons (producing CO₂). The starch network is the net bag holding the balloons. If the net is too loose (under-gelatinized batter), balloons escape and the bag stays flat. If the net is too tight (over-gelatinized), it cannot stretch and the balloons pop. The perfect net stretches to hold many balloons without letting them escape.',
      storyConnection: 'When grandmother checks the batter in the morning and sees it has risen and is covered with tiny bubbles, she knows the fermentation is perfect. Each bubble is a tiny balloon of CO₂, inflated by microbial metabolism. The rising of the batter is the visible signature of invisible biological activity.',
      checkQuestion: 'If you ferment the same batter at 20°C vs 35°C, which produces a lighter pitha? It is not straightforward — explain the trade-offs.',
      checkAnswer: 'At 35°C: faster fermentation produces more total CO₂, BUT CO₂ solubility in water decreases with temperature, so more gas escapes as bubbles that may be too large and rise out of the batter before cooking. At 20°C: slower fermentation produces less total CO₂, BUT higher solubility means more gas stays dissolved and forms many tiny bubbles when released during cooking. The optimal is typically 28-32°C: enough CO₂ production with adequate retention. Very hot fermentation gives a sour but dense pitha; cool fermentation gives mild but also dense pitha.',
      codeIntro: 'Model CO₂ production, dissolution, bubble formation, and batter rising during pitha fermentation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- CO2 production and batter rising model ---
def batter_rising_model(t_hours, temp_C, N0=1e6, S0=30.0):
    dt = 0.01
    steps = int(t_hours / dt)
    time = np.linspace(0, t_hours, steps)

    # Microbial dynamics
    mu_max = 0.85 * np.exp(-0.05 * (temp_C - 30)**2)
    N = np.zeros(steps); S = np.zeros(steps)
    N[0] = N0; S[0] = S0

    # CO2 dynamics
    CO2_total = np.zeros(steps)      # total CO2 produced (mol/L)
    CO2_dissolved = np.zeros(steps)   # dissolved CO2 (mol/L)
    CO2_gas = np.zeros(steps)         # gas phase CO2 (mol/L equivalent)
    volume_ratio = np.zeros(steps)    # batter volume / original volume
    volume_ratio[0] = 1.0

    # Henry's law constant for CO2 (mol/L/atm), temperature dependent
    kH_25 = 0.034  # at 25°C
    kH = kH_25 * np.exp(2400 * (1/(temp_C + 273.15) - 1/298.15))  # van't Hoff

    # CO2 production rate: ~0.5 mol CO2 per mol glucose consumed
    # Glucose MW = 180, so ~0.5/180 mol CO2 per g sugar consumed
    Y_CO2 = 0.5 / 180  # mol CO2 per g sugar consumed by heterofermentative pathway
    frac_hetero = 0.3   # 30% of metabolism is heterofermentative

    P_atm = 1.0  # atmospheric pressure
    CO2_sat = kH * P_atm  # saturation concentration

    for i in range(1, steps):
        # Monod growth
        mu = mu_max * S[i-1] / (0.5 + S[i-1])
        dN = mu * N[i-1] * dt
        dS = mu * N[i-1] / 1e8 * dt

        N[i] = max(N[i-1] + dN, 0)
        S[i] = max(S[i-1] - dS, 0)

        # CO2 production
        dCO2 = dS * Y_CO2 * frac_hetero
        CO2_total[i] = CO2_total[i-1] + dCO2

        # Partition: dissolved up to saturation, rest is gas
        CO2_dissolved[i] = min(CO2_total[i], CO2_sat)
        CO2_gas[i] = max(CO2_total[i] - CO2_sat, 0)

        # Volume expansion from gas (ideal gas law: V = nRT/P)
        T_kelvin = temp_C + 273.15
        R = 0.0821  # L·atm/(mol·K)
        gas_volume = CO2_gas[i] * R * T_kelvin / P_atm  # liters of gas per liter batter
        # But batter traps only a fraction (depends on viscosity/starch network)
        trap_efficiency = 0.7
        volume_ratio[i] = 1.0 + gas_volume * trap_efficiency

    return time, N, S, CO2_total, CO2_dissolved, CO2_gas, volume_ratio

# Standard conditions
t, N, S, CO2_tot, CO2_dis, CO2_gas, vol = batter_rising_model(16, 30)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- CO2 partitioning ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.fill_between(t, 0, CO2_dis * 1000, alpha=0.5, color='#3b82f6', label='Dissolved CO₂')
ax.fill_between(t, CO2_dis * 1000, CO2_tot * 1000, alpha=0.5, color='#f59e0b', label='Gas phase CO₂')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('CO₂ (mmol/L)', color='white')
ax.set_title('CO₂ Production and Partitioning', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Volume expansion ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(t, (vol - 1) * 100, color='#22c55e', linewidth=2)
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Volume Increase (%)', color='white')
ax.set_title('Batter Rising', color='white')
ax.tick_params(colors='gray')

# --- Temperature effect on rising ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
for temp, col in [(20, '#3b82f6'), (25, '#22c55e'), (30, '#f59e0b'), (35, '#ef4444')]:
    _, _, _, _, _, _, vol_t = batter_rising_model(16, temp)
    ax.plot(np.linspace(0, 16, len(vol_t)), (vol_t - 1) * 100, color=col, linewidth=2, label=f'{temp}°C')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Volume Increase (%)', color='white')
ax.set_title('Temperature Effect on Rising', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Bubble size distribution (simulation) ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
np.random.seed(42)
# Bubble nucleation: many small, few large (log-normal distribution)
n_bubbles = 1000
bubble_radii_early = np.random.lognormal(mean=-2, sigma=0.5, size=n_bubbles)  # mm, early
bubble_radii_late = np.random.lognormal(mean=-1, sigma=0.7, size=n_bubbles)   # mm, late
ax.hist(bubble_radii_early, bins=50, alpha=0.5, color='#3b82f6', density=True, label='Early (4h)')
ax.hist(bubble_radii_late, bins=50, alpha=0.5, color='#f59e0b', density=True, label='Late (12h)')
ax.set_xlabel('Bubble Radius (mm)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Bubble Size Distribution', color='white')
ax.set_xlim(0, 2)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Henry's law: CO2 solubility vs temperature ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
T_range = np.linspace(10, 50, 100)
kH_range = 0.034 * np.exp(2400 * (1/(T_range + 273.15) - 1/298.15))
ax.plot(T_range, kH_range * 1000, color='#a855f7', linewidth=2)
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('CO₂ Solubility (mmol/L/atm)', color='white')
ax.set_title("Henry's Law: Solubility Drops with Temperature", color='white')
ax.tick_params(colors='gray')

# --- Optimal fermentation conditions ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
temps_opt = np.linspace(15, 42, 30)
final_rise = []
for temp in temps_opt:
    _, _, _, _, _, _, vol_o = batter_rising_model(12, temp)
    final_rise.append((vol_o[-1] - 1) * 100)
ax.plot(temps_opt, final_rise, 'o-', color='#22c55e', linewidth=2, markersize=4)
opt_temp = temps_opt[np.argmax(final_rise)]
ax.axvline(x=opt_temp, color='white', linestyle='--', alpha=0.5)
ax.set_xlabel('Fermentation Temperature (°C)', color='white')
ax.set_ylabel('Volume Rise After 12h (%)', color='white')
ax.set_title(f'Optimal Temperature: ~{opt_temp:.0f}°C', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("CO₂ and Batter Rising Results:")
print(f"  Total CO₂ produced: {CO2_tot[-1]*1000:.1f} mmol/L")
print(f"  Dissolved: {CO2_dis[-1]*1000:.1f} mmol/L")
print(f"  Gas phase: {CO2_gas[-1]*1000:.1f} mmol/L")
print(f"  Final volume increase: {(vol[-1]-1)*100:.0f}%")
print(f"  Optimal fermentation temperature for maximum rise: ~{opt_temp:.0f}°C")`,
      challenge: 'Model the effect of covering vs uncovering the batter. Covering traps CO₂ (higher partial pressure, more dissolved CO₂), while uncovering lets CO₂ escape. Which gives a lighter pitha and why?',
      successHint: 'The rising of fermented batter involves gas laws, solubility chemistry, and fluid mechanics all working together. Henry\'s Law explains why temperature matters for gas retention, and the ideal gas law explains why warm fermentation produces bigger bubbles. Grandmother\'s choice of where to leave the batter overnight is a thermodynamic optimization.',
    },
    {
      title: 'Enzyme kinetics — amylase breaks down starch for bacteria',
      concept: `Bacteria cannot eat starch directly. Starch molecules (polysaccharides with thousands of glucose units) must first be broken down into simple sugars by **amylase** enzymes. Understanding enzyme kinetics is essential to modeling fermentation accurately.

The **Michaelis-Menten equation** describes enzyme kinetics: v = Vmax × [S] / (Km + [S]), where v is the reaction rate, Vmax is the maximum rate (when all enzyme is saturated with substrate), [S] is substrate concentration, and Km is the Michaelis constant (substrate concentration at half-Vmax).

In pitha batter, two amylases are relevant:
1. **Alpha-amylase** (from rice grain and bacteria): cuts starch randomly into shorter chains (dextrins, maltose). High Vmax but works best at pH 6-7.
2. **Glucoamylase** (from molds sometimes present): cuts glucose units one at a time from chain ends. Lower Vmax but works at lower pH (4-5).

As pH drops during fermentation, alpha-amylase activity decreases and glucoamylase takes over — a natural relay system. The total rate of sugar release determines how fast bacteria can grow.

**Product inhibition** is also crucial: accumulated maltose and glucose can slow amylase activity through competitive inhibition, creating another self-regulating feedback loop.`,
      analogy: 'Enzymes are like specialized scissors. Alpha-amylase is like a person randomly cutting a long rope into shorter pieces (fast, creates many fragments). Glucoamylase is like someone carefully trimming single beads off a necklace (slow, precise, one unit at a time). The rope needs to be cut into pieces before individual beads can be removed — so alpha-amylase works first, glucoamylase finishes.',
      storyConnection: 'Grandmother\'s pitha relies on an invisible enzyme relay. The rice starch is like a locked pantry of sugar. Amylase enzymes are the keys that unlock it, feeding the bacteria that create flavor and texture. Without this enzymatic cascade, fermentation would stall and the pitha would be flat and flavorless.',
      checkQuestion: 'If you add commercial alpha-amylase to the batter at the start, would fermentation be faster? What would happen to the final product?',
      checkAnswer: 'Initially yes — more amylase means faster starch breakdown, more free sugar, faster bacterial growth. But the excess sugar would cause over-fermentation: too much acid, too much CO₂, and potentially alcohol production (if yeasts are present). The batter would become very sour and possibly alcoholic. The natural amylase level is tuned by evolution/tradition to release sugar at a rate that sustains moderate fermentation — not too fast, not too slow. Adding more disrupts this balance.',
      codeIntro: 'Model the coupled amylase-sugar-bacteria system using Michaelis-Menten kinetics and enzyme pH sensitivity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Enzyme kinetics coupled to fermentation ---
def enzyme_fermentation_model(t_hours, alpha_amylase=1.0, gluco_amylase=0.5):
    dt = 0.01
    steps = int(t_hours / dt)
    time = np.linspace(0, t_hours, steps)

    # State variables
    starch = np.zeros(steps)      # g/L intact starch
    dextrins = np.zeros(steps)     # g/L dextrins (intermediate)
    glucose = np.zeros(steps)      # g/L free glucose + maltose
    bacteria = np.zeros(steps)     # CFU/mL
    lactic_acid = np.zeros(steps)  # g/L
    pH = np.zeros(steps)

    starch[0] = 50.0   # starting starch
    glucose[0] = 2.0    # small amount of free sugar
    bacteria[0] = 1e6
    pH[0] = 6.5

    # Enzyme parameters
    Vmax_alpha = 5.0 * alpha_amylase    # g/L/h
    Km_alpha = 8.0                       # g/L
    pH_opt_alpha = 6.5
    pH_width_alpha = 1.5

    Vmax_gluco = 2.0 * gluco_amylase    # g/L/h
    Km_gluco = 3.0
    pH_opt_gluco = 4.5
    pH_width_gluco = 1.5

    # Bacterial parameters
    mu_max = 0.85
    Ks = 0.5
    Y = 1e8
    Y_LA = 0.9

    for i in range(1, steps):
        # pH-dependent enzyme activity (Gaussian)
        activity_alpha = np.exp(-0.5 * ((pH[i-1] - pH_opt_alpha) / pH_width_alpha)**2)
        activity_gluco = np.exp(-0.5 * ((pH[i-1] - pH_opt_gluco) / pH_width_gluco)**2)

        # Alpha-amylase: starch -> dextrins
        v_alpha = Vmax_alpha * activity_alpha * starch[i-1] / (Km_alpha + starch[i-1])
        # Product inhibition by dextrins
        v_alpha *= 10 / (10 + dextrins[i-1])

        # Glucoamylase: dextrins -> glucose
        v_gluco = Vmax_gluco * activity_gluco * dextrins[i-1] / (Km_gluco + dextrins[i-1])
        # Product inhibition by glucose
        v_gluco *= 20 / (20 + glucose[i-1])

        # Bacterial consumption of glucose
        mu = mu_max * glucose[i-1] / (Ks + glucose[i-1])
        mu *= 15 / (15 + lactic_acid[i-1])  # product inhibition

        dN = mu * bacteria[i-1] * dt
        consumed = mu * bacteria[i-1] / Y * dt

        starch[i] = max(starch[i-1] - v_alpha * dt, 0)
        dextrins[i] = max(dextrins[i-1] + v_alpha * dt - v_gluco * dt, 0)
        glucose[i] = max(glucose[i-1] + v_gluco * dt - consumed, 0)
        bacteria[i] = bacteria[i-1] + dN
        lactic_acid[i] = lactic_acid[i-1] + consumed * Y_LA
        pH[i] = max(6.5 - lactic_acid[i] * 0.15, 3.0)

    return time, starch, dextrins, glucose, bacteria, lactic_acid, pH

t, starch, dext, gluc, bact, LA, pH = enzyme_fermentation_model(16)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- Starch breakdown cascade ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(t, starch, color='#a855f7', linewidth=2, label='Starch')
ax.plot(t, dext, color='#f59e0b', linewidth=2, label='Dextrins')
ax.plot(t, gluc, color='#22c55e', linewidth=2, label='Free glucose')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Concentration (g/L)', color='white')
ax.set_title('Enzymatic Cascade: Starch → Dextrins → Glucose', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Bacteria and acid ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax2 = ax.twinx()
ax.semilogy(t, bact, color='#22c55e', linewidth=2, label='Bacteria')
ax2.plot(t, LA, color='#ef4444', linewidth=2, label='Lactic acid')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Bacteria (CFU/mL)', color='#22c55e')
ax2.set_ylabel('Lactic Acid (g/L)', color='#ef4444')
ax.set_title('Microbial Activity', color='white')
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# --- pH and enzyme activities ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
pH_range_local = np.linspace(3, 7, 200)
alpha_act = np.exp(-0.5 * ((pH_range_local - 6.5) / 1.5)**2)
gluco_act = np.exp(-0.5 * ((pH_range_local - 4.5) / 1.5)**2)
ax.plot(pH_range_local, alpha_act, color='#3b82f6', linewidth=2, label='Alpha-amylase')
ax.plot(pH_range_local, gluco_act, color='#f59e0b', linewidth=2, label='Glucoamylase')
# Show pH trajectory
for hour in [0, 4, 8, 12, 16]:
    idx = min(int(hour / 16 * len(pH)), len(pH)-1)
    ax.axvline(x=pH[idx], color='white', linestyle=':', alpha=0.2)
    ax.text(pH[idx], 1.05, f'{hour}h', color='white', fontsize=7, ha='center')
ax.set_xlabel('pH', color='white')
ax.set_ylabel('Relative Activity', color='white')
ax.set_title('Enzyme Activity vs pH (dashed = fermentation pH)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Michaelis-Menten curves ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
S_range = np.linspace(0, 30, 200)
for Km, Vmax, col, lbl in [(8, 5, '#3b82f6', f'Alpha-amylase (Km={8})'),
                             (3, 2, '#f59e0b', f'Glucoamylase (Km={3})')]:
    v = Vmax * S_range / (Km + S_range)
    ax.plot(S_range, v, color=col, linewidth=2, label=lbl)
    ax.axhline(y=Vmax, color=col, linestyle='--', alpha=0.3)
    ax.axvline(x=Km, color=col, linestyle=':', alpha=0.3)
ax.set_xlabel('Substrate (g/L)', color='white')
ax.set_ylabel('Reaction Rate (g/L/h)', color='white')
ax.set_title('Michaelis-Menten Kinetics', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Effect of extra amylase ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
for mult, col, lbl in [(0.5, '#3b82f6', '0.5x amylase'), (1.0, '#22c55e', '1x (normal)'),
                        (2.0, '#f59e0b', '2x amylase'), (4.0, '#ef4444', '4x amylase')]:
    _, _, _, gluc_m, _, _, _ = enzyme_fermentation_model(16, alpha_amylase=mult, gluco_amylase=mult*0.5)
    ax.plot(np.linspace(0, 16, len(gluc_m)), gluc_m, color=col, linewidth=1.5, label=lbl)
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Free Glucose (g/L)', color='white')
ax.set_title('Amylase Level vs Sugar Release', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Lineweaver-Burk plot ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
S_lb = np.linspace(1, 30, 50)
v_lb = 5.0 * S_lb / (8 + S_lb)
ax.plot(1/S_lb, 1/v_lb, 'o', color='#a855f7', markersize=4)
# Linear fit
x_lb = 1/S_lb; y_lb = 1/v_lb
m, b = np.polyfit(x_lb, y_lb, 1)
x_fit = np.linspace(-0.05, max(x_lb), 100)
ax.plot(x_fit, m*x_fit + b, color='white', linewidth=1.5)
ax.axhline(y=0, color='gray', linewidth=0.5)
ax.axvline(x=0, color='gray', linewidth=0.5)
ax.set_xlabel('1/[S]', color='white')
ax.set_ylabel('1/v', color='white')
ax.set_title(f'Lineweaver-Burk Plot (Km={m/b:.1f}, Vmax={1/b:.1f})', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Enzyme Kinetics Summary:")
print(f"  Starch remaining: {starch[-1]:.1f} g/L ({starch[-1]/50*100:.0f}%)")
print(f"  Peak dextrin level: {dext.max():.1f} g/L at {t[np.argmax(dext)]:.1f} hours")
print(f"  Peak glucose level: {gluc.max():.1f} g/L at {t[np.argmax(gluc)]:.1f} hours")
print(f"  pH at end: {pH[-1]:.2f}")
print(f"  Enzyme relay: alpha-amylase dominates pH>5.5, glucoamylase takes over pH<5.5")`,
      challenge: 'Add competitive inhibition to the model: maltose (a product of alpha-amylase) inhibits alpha-amylase with Ki=5 g/L. Show how this changes the starch breakdown dynamics.',
      successHint: 'The Michaelis-Menten equation is the most important equation in biochemistry. In the context of pitha, it explains why fermentation has a characteristic time course: fast at first (abundant substrate), then slowing (substrate depletion and product inhibition). The enzyme relay from alpha-amylase to glucoamylase as pH drops is a particularly elegant natural design.',
    },
    {
      title: 'Sensory science — modeling flavor profiles mathematically',
      concept: `The taste of pitha depends on a complex mix of chemical compounds, each contributing to a different sensory dimension. **Sensory science** attempts to quantify taste perception using mathematical models.

The five basic tastes and their key compounds in fermented pitha:
- **Sour**: lactic acid (primary), acetic acid (minor). Sourness intensity follows a power law: I = k × C^n, where C is acid concentration, n ≈ 0.85 for lactic acid, and k is a scaling constant.
- **Sweet**: residual glucose and maltose. Sweetness follows a similar power law with n ≈ 1.3 (superlinear — doubling sugar more than doubles perceived sweetness).
- **Umami**: free amino acids released by protein hydrolysis during fermentation.
- **Salty**: mineral salts from rice.
- **Bitter**: trace bitter compounds from Maillard reactions during cooking.

The **Weber-Fechner law** describes how humans perceive intensity: ΔI/I = constant, meaning the just-noticeable difference (JND) in taste is proportional to the current intensity. This implies a logarithmic perception function: perceived intensity = a × log(C/C_threshold).

**Flavor balance** can be modeled as a vector in sensory space. Each compound pushes the flavor in a direction; the total flavor profile is the sum. Optimal pitha has high sour, moderate sweet, low bitter — a specific region in this multidimensional space.`,
      analogy: 'Modeling flavor is like mixing colors on a painter\'s palette. Each taste compound is a pigment. Lactic acid is red (sour), glucose is blue (sweet), amino acids are yellow (umami). Mixing them in the right proportions creates the specific "color" that is grandmother\'s pitha. Too much red (too sour) or too much blue (too sweet) and the painting is wrong. The recipe specifies proportions in this flavor color space.',
      storyConnection: 'Grandmother does not measure pH or lactic acid concentration. She tastes. Her tongue is a remarkably sensitive chemical sensor that integrates dozens of compounds into a single judgment: "ready" or "not ready." What we model with equations, she evaluates in a single taste — but both approaches converge on the same optimal fermentation endpoint.',
      checkQuestion: 'Why does adding a pinch of salt to pitha batter enhance the perception of both sweetness and sourness, even though salt is neither sweet nor sour?',
      checkAnswer: 'This is the sensory phenomenon of taste enhancement (or suppression of suppression). Salt suppresses bitterness. Since bitterness partially masks sweetness and sourness, removing the bitterness via salt makes the remaining sweet and sour tastes more perceptible. This is cross-modal taste interaction — the sensory system does not operate on independent channels. It is why a tiny amount of salt improves almost every food.',
      codeIntro: 'Build a mathematical model of pitha flavor, map the sensory space, and find the optimal fermentation endpoint for flavor.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Sensory science model for pitha flavor ---

def taste_intensity(concentration, threshold, power, max_intensity=10):
    """Stevens' power law for taste perception."""
    return np.clip(max_intensity * (concentration / threshold)**power /
                   (1 + (concentration / threshold)**power), 0, max_intensity)

# Flavor compounds at different fermentation stages (0 to 16 hours)
time = np.linspace(0, 16, 200)

# Lactic acid (g/L): rises sigmoidally
lactic_acid = 15 / (1 + np.exp(-0.5 * (time - 8)))

# Glucose (g/L): peaks then declines (released by amylase, consumed by bacteria)
glucose = 5 * np.exp(-0.1 * (time - 4)**2) + 2 * np.exp(-0.2 * time)

# Acetic acid (g/L): slow accumulation
acetic_acid = 0.5 * (1 - np.exp(-0.15 * time))

# Free amino acids (g/L): slow release from protein hydrolysis
amino_acids = 0.3 * (1 - np.exp(-0.2 * time))

# Diacetyl (buttery, mg/L): peaks mid-fermentation then declines
diacetyl = 2 * time * np.exp(-0.3 * time)

# Ethanol (g/L): slow accumulation if yeast present
ethanol = 1.0 * (1 - np.exp(-0.1 * time))

# Compute sensory scores over time
sour = taste_intensity(lactic_acid + 0.8 * acetic_acid, threshold=2.0, power=0.85)
sweet = taste_intensity(glucose, threshold=3.0, power=1.3)
umami = taste_intensity(amino_acids, threshold=0.05, power=0.7)
bitter = taste_intensity(0.1 * ethanol + 0.02 * lactic_acid, threshold=0.5, power=0.6)
buttery = taste_intensity(diacetyl, threshold=0.5, power=0.9)

# Overall quality score: weighted combination
quality = (0.3 * sour + 0.25 * sweet + 0.2 * umami + 0.15 * buttery - 0.2 * bitter)
quality = quality / quality.max() * 10  # normalize to 0-10

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- Chemical compounds over time ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(time, lactic_acid, color='#ef4444', linewidth=2, label='Lactic acid')
ax.plot(time, glucose, color='#22c55e', linewidth=2, label='Glucose')
ax.plot(time, acetic_acid * 5, color='#f59e0b', linewidth=2, label='Acetic acid (×5)')
ax.plot(time, amino_acids * 10, color='#3b82f6', linewidth=2, label='Amino acids (×10)')
ax.set_xlabel('Fermentation Time (hours)', color='white')
ax.set_ylabel('Concentration (g/L)', color='white')
ax.set_title('Chemical Composition Over Time', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Sensory profile over time ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(time, sour, color='#ef4444', linewidth=2, label='Sour')
ax.plot(time, sweet, color='#22c55e', linewidth=2, label='Sweet')
ax.plot(time, umami, color='#3b82f6', linewidth=2, label='Umami')
ax.plot(time, buttery, color='#f59e0b', linewidth=2, label='Buttery')
ax.plot(time, bitter, color='#a855f7', linewidth=2, label='Bitter')
ax.set_xlabel('Fermentation Time (hours)', color='white')
ax.set_ylabel('Perceived Intensity (0-10)', color='white')
ax.set_title('Sensory Profile Over Time', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Quality score over time ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(time, quality, color='#22c55e', linewidth=3)
opt_time = time[np.argmax(quality)]
ax.axvline(x=opt_time, color='white', linestyle='--', alpha=0.5)
ax.scatter([opt_time], [quality.max()], s=100, color='#f59e0b', zorder=5)
ax.set_xlabel('Fermentation Time (hours)', color='white')
ax.set_ylabel('Overall Flavor Quality (0-10)', color='white')
ax.set_title(f'Optimal Fermentation: ~{opt_time:.0f} hours', color='white')
ax.tick_params(colors='gray')

# --- Radar chart: flavor profiles at different times ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
categories = ['Sour', 'Sweet', 'Umami', 'Buttery', 'Bitter']
n_cats = len(categories)
angles = np.linspace(0, 2 * np.pi, n_cats, endpoint=False).tolist()
angles += angles[:1]

for hour_idx, col, lbl in [(25, '#3b82f6', '2h'), (75, '#22c55e', '6h'),
                             (125, '#f59e0b', '10h'), (175, '#ef4444', '14h')]:
    values = [sour[hour_idx], sweet[hour_idx], umami[hour_idx],
              buttery[hour_idx], bitter[hour_idx]]
    values += values[:1]
    ax.plot(angles, values, 'o-', color=col, linewidth=1.5, markersize=4, label=lbl)
    ax.fill(angles, values, alpha=0.05, color=col)
ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, color='white', fontsize=8)
ax.set_title('Flavor Radar at Different Times', color='white')
ax.legend(fontsize=7, loc='upper right', facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Stevens' power law ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
C_range = np.linspace(0, 20, 200)
for power, col, lbl in [(0.5, '#3b82f6', 'n=0.5 (compressive, salt)'),
                          (0.85, '#22c55e', 'n=0.85 (sour)'),
                          (1.0, '#f59e0b', 'n=1.0 (linear)'),
                          (1.3, '#ef4444', 'n=1.3 (expansive, sweet)')]:
    I = taste_intensity(C_range, threshold=2.0, power=power)
    ax.plot(C_range, I, color=col, linewidth=2, label=lbl)
ax.set_xlabel('Concentration', color='white')
ax.set_ylabel('Perceived Intensity', color='white')
ax.set_title("Stevens' Power Law: Taste Perception", color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Weber-Fechner JND ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
base_concentrations = np.linspace(1, 20, 50)
weber_fraction = 0.15  # 15% change is detectable for sour
jnd = base_concentrations * weber_fraction
ax.plot(base_concentrations, jnd, color='#a855f7', linewidth=2, label=f'Weber fraction = {weber_fraction}')
ax.fill_between(base_concentrations, 0, jnd, alpha=0.1, color='#a855f7')
ax.set_xlabel('Base Concentration (g/L)', color='white')
ax.set_ylabel('Just-Noticeable Difference (g/L)', color='white')
ax.set_title('Weber-Fechner: JND Grows with Intensity', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

opt_idx = np.argmax(quality)
print("Sensory Analysis Results:")
print(f"  Optimal fermentation time: {time[opt_idx]:.1f} hours")
print(f"  At optimum — Sour: {sour[opt_idx]:.1f}, Sweet: {sweet[opt_idx]:.1f}, "
      f"Umami: {umami[opt_idx]:.1f}, Buttery: {buttery[opt_idx]:.1f}, Bitter: {bitter[opt_idx]:.1f}")
print(f"  Quality score: {quality[opt_idx]:.1f}/10")
print()
print("Key: the optimal pitha is NOT the most sour or the sweetest.")
print("It sits at the intersection where sour is strong, sweet is still")
print("present, umami is building, and bitter has not yet accumulated.")`,
      challenge: 'Add a "preference model" for different demographic groups: children prefer sweeter with less sour, adults prefer more sour with more umami. Plot the optimal fermentation time for each group and show how it differs.',
      successHint: 'Sensory science turns the subjective experience of taste into quantifiable mathematics. Stevens\' power law and the Weber-Fechner law are psychophysical principles that apply across all senses — vision, hearing, touch, and taste. Understanding them explains why grandmother\'s pitha tastes "perfect" at a specific fermentation time.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (fermentation science fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real fermentation modeling. Click to start.</p>
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
