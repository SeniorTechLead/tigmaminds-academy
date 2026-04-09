import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LittleChefLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Maillard reaction kinetics — modeling browning chemistry",
      concept: "The Maillard reaction is the chemical process that creates the complex flavors and brown color in cooked food — from caramelized onions to grilled meat to toasted bread. It is not a single reaction but a cascade of hundreds of reactions between amino acids and reducing sugars, accelerated by heat.\\n\\nThe overall kinetics follow the Arrhenius equation: rate = A × exp(-Ea/RT), where A is the pre-exponential factor, Ea is activation energy (~100-150 kJ/mol for Maillard), R is the gas constant, and T is temperature in Kelvin. This explains why cooking at 160°C browns food rapidly while 100°C (boiling) does not — the exponential temperature dependence makes a 60°C difference produce a 100-fold rate increase.\\n\\nKey variables: temperature (dominant), pH (alkaline accelerates browning), water activity (intermediate moisture browns fastest), sugar type (glucose reacts faster than sucrose), and amino acid type (lysine reacts fastest).",
      analogy: "The Maillard reaction is like a chain of dominoes, each triggering the next. The first domino (sugar + amino acid) falls slowly at low temperature. But at high temperature, all dominoes fall almost simultaneously, creating an avalanche of flavor compounds. The Arrhenius equation predicts how fast that first domino falls at any temperature.",
      storyConnection: "The little chef in the story knew exactly when to pull the bread from the fire — golden brown, not black, not pale. That timing was Arrhenius kinetics in action: at the fire temperature, browning reactions need exactly that many minutes. A few seconds too long, and the exponential rate drives the reaction past \"delicious\" into \"burnt.\"",
      checkQuestion: "Why does food brown much faster in a 200°C oven than in a 150°C oven, even though the temperature difference is only 50°C?",
      checkAnswer: "The Arrhenius equation has an exponential dependence on temperature. With an activation energy of ~120 kJ/mol, a 50°C increase from 150 to 200°C increases the reaction rate by approximately 10-fold. The relationship is not linear — each additional degree has a progressively larger effect. This is why professional cooks are precise about oven temperature: small changes cause large differences in browning.",
      codeIntro: "Model Maillard reaction kinetics and predict browning profiles at different temperatures.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Arrhenius kinetics for Maillard reaction ---
R = 8.314  # gas constant J/(mol·K)

def arrhenius_rate(T_celsius, Ea=120000, A=1e15):
    """Reaction rate at temperature T (Celsius)."""
    T_kelvin = T_celsius + 273.15
    return A * np.exp(-Ea / (R * T_kelvin))

def browning_curve(T, time_minutes, initial_color=0.1):
    """Simulate browning progression over time.
    Color: 0=raw/white, 1=perfectly browned, >1=burnt.
    """
    rate = arrhenius_rate(T)
    # First-order kinetics with saturation
    color = 1 - (1 - initial_color) * np.exp(-rate * time_minutes * 60)
    return color

# --- Simulate browning at different temperatures ---
temperatures = [100, 130, 160, 180, 200, 220]
time = np.linspace(0, 60, 200)  # 0-60 minutes

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Browning curves
ax0 = axes[0, 0]
colors_t = plt.cm.hot(np.linspace(0.2, 0.8, len(temperatures)))
for T, color in zip(temperatures, colors_t):
    brown = browning_curve(T, time)
    ax0.plot(time, brown, color=color, linewidth=2, label=f'{T}°C')
ax0.axhline(0.7, color='#22c55e', linestyle='--', alpha=0.5, label='Ideal browning')
ax0.axhline(1.0, color='#ef4444', linestyle='--', alpha=0.5, label='Burnt threshold')
ax0.set_xlabel('Time (minutes)', color='white')
ax0.set_ylabel('Browning index', color='white')
ax0.set_title('Browning curves at different temperatures', color='white', fontsize=11)
ax0.legend(fontsize=7, ncol=2)
ax0.set_ylim(0, 1.3)

# Arrhenius plot
ax1 = axes[0, 1]
T_range = np.linspace(80, 250, 100)
rates = [arrhenius_rate(T) for T in T_range]
ax1.semilogy(T_range, rates, color='#f59e0b', linewidth=2)
ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Reaction rate (log scale)', color='white')
ax1.set_title('Arrhenius rate vs temperature', color='white', fontsize=11)
for T in [100, 150, 200]:
    r = arrhenius_rate(T)
    ax1.plot(T, r, 'o', color='#22c55e', markersize=8)
    ax1.annotate(f'{T}°C', (T+3, r*1.5), color='white', fontsize=8)

# Optimal cooking time
ax2 = axes[1, 0]
target_browning = 0.7
optimal_times = []
for T in range(80, 251, 5):
    rate = arrhenius_rate(T)
    if rate > 0:
        t_opt = -np.log(1 - target_browning + 0.1) / (rate * 60)
        optimal_times.append((T, min(t_opt, 120)))

opt_T, opt_t = zip(*optimal_times)
ax2.plot(opt_T, opt_t, color='#22c55e', linewidth=2)
ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Time to golden brown (min)', color='white')
ax2.set_title('Optimal cooking time vs temperature', color='white', fontsize=11)
ax2.set_ylim(0, 60)

# Temperature sensitivity
ax3 = axes[1, 1]
T_base = 180
T_variations = np.linspace(-30, 30, 50)
rate_ratios = [arrhenius_rate(T_base + dT) / arrhenius_rate(T_base) for dT in T_variations]
ax3.plot(T_variations, rate_ratios, color='#a855f7', linewidth=2)
ax3.axhline(1, color='gray', linestyle='--', alpha=0.5)
ax3.axvline(0, color='gray', linestyle='--', alpha=0.5)
ax3.set_xlabel('Temperature deviation from 180°C', color='white')
ax3.set_ylabel('Rate multiplier', color='white')
ax3.set_title('Sensitivity: small T changes → large rate changes', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Maillard reaction kinetics:")
print(f"{'Temp':>6} {'Rate':>12} {'Time to brown':>15}")
for T in [100, 130, 160, 180, 200, 220]:
    r = arrhenius_rate(T)
    t = -np.log(0.4) / (r * 60) if r > 0 else float('inf')
    print(f"{T:>5}°C {r:>12.4e} {min(t,999):>12.1f} min")
print(f"\\nRate increase per 10°C (at 180°C): {arrhenius_rate(190)/arrhenius_rate(180):.1f}x")`,
      challenge: "Add water activity as a variable: Maillard rate peaks at water activity ~0.6 and decreases at both lower and higher values. Model this with a bell-shaped multiplier and find the optimal combination of temperature and water activity for maximum browning rate.",
      successHint: "You can now model the kinetics of food browning — the foundational chemistry behind every cooked flavor.",
    },
    {
      title: "Fermentation dynamics — modeling microbial growth and product formation",
      concept: "Fermentation is microbial metabolism: yeast or bacteria consume sugars and produce useful products (ethanol, lactic acid, CO2, flavor compounds). The kinetics follow the Monod equation for microbial growth: μ = μ_max × S / (K_s + S), where μ is growth rate, S is substrate (sugar) concentration, and K_s is the half-saturation constant.\\n\\nThe full fermentation model has three coupled ODEs:\\n- dX/dt = μ × X (biomass growth)\\n- dS/dt = -μ × X / Y_xs (substrate consumption)\\n- dP/dt = μ × X / Y_xp (product formation)\\n\\nWhere Y_xs and Y_xp are yield coefficients. The fermentation progresses through phases: lag (adaptation), exponential (rapid growth), stationary (nutrients depleted), and death (toxic product accumulation).",
      analogy: "Fermentation is like a population of workers in a factory. In the beginning (lag phase), they are figuring out the machinery. Then they hit their stride (exponential phase) and produce rapidly. As raw materials run low (stationary phase), production slows. Eventually, waste products make the factory uninhabitable (death phase). The Monod equation describes how production rate depends on available raw materials.",
      storyConnection: "The little chef made fermented rice beer (apong) and fermented fish (shidol). Both rely on microbial communities transforming simple ingredients into complex flavors over days. The timing — when to start, when to stop — is fermentation kinetics. Too short and the flavors are undeveloped. Too long and the product spoils.",
      checkQuestion: "Why does fermentation slow down even when there is still sugar remaining?",
      checkAnswer: "Two mechanisms: (1) Product inhibition — ethanol or lactic acid accumulate and become toxic to the microbes, reducing their growth rate even if sugar is available. (2) Nutrient limitation — besides sugar, microbes need nitrogen, vitamins, and minerals. If any essential nutrient is depleted before sugar, growth stops. Real fermentation models include inhibition terms: μ_effective = μ × S/(K_s+S) × (1 - P/P_max), where P_max is the product concentration that completely inhibits growth.",
      codeIntro: "Simulate batch fermentation with Monod kinetics and product inhibition, tracking biomass, sugar, and product over time.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Monod fermentation model ---
def fermentation_ode(X, S, P, params):
    """Compute derivatives for fermentation ODEs."""
    mu_max = params['mu_max']
    Ks = params['Ks']
    Yxs = params['Yxs']
    Yxp = params['Yxp']
    P_max = params['P_max']
    
    # Monod growth with product inhibition
    mu = mu_max * S / (Ks + S) * max(0, 1 - P / P_max)
    
    dX = mu * X
    dS = -mu * X / Yxs
    dP = mu * X / Yxp
    
    return dX, dS, dP, mu

def simulate_fermentation(params, X0, S0, P0, hours=72, dt=0.1):
    """Simulate batch fermentation using Euler's method."""
    steps = int(hours / dt)
    t = np.linspace(0, hours, steps)
    X, S, P = np.zeros(steps), np.zeros(steps), np.zeros(steps)
    mu_hist = np.zeros(steps)
    X[0], S[0], P[0] = X0, S0, P0
    
    for i in range(1, steps):
        dX, dS, dP, mu = fermentation_ode(X[i-1], S[i-1], P[i-1], params)
        X[i] = max(0, X[i-1] + dX * dt)
        S[i] = max(0, S[i-1] + dS * dt)
        P[i] = max(0, P[i-1] + dP * dt)
        mu_hist[i] = mu
    
    return t, X, S, P, mu_hist

# --- Three fermentation types ---
fermentations = {
    'Rice beer (yeast)': {
        'params': {'mu_max': 0.3, 'Ks': 2.0, 'Yxs': 0.1, 'Yxp': 0.08, 'P_max': 12},
        'X0': 0.5, 'S0': 100, 'P0': 0, 'hours': 72, 'color': '#f59e0b',
    },
    'Yogurt (bacteria)': {
        'params': {'mu_max': 0.5, 'Ks': 1.0, 'Yxs': 0.15, 'Yxp': 0.12, 'P_max': 8},
        'X0': 1.0, 'S0': 50, 'P0': 0, 'hours': 24, 'color': '#22c55e',
    },
    'Vinegar (acetobacter)': {
        'params': {'mu_max': 0.15, 'Ks': 3.0, 'Yxs': 0.08, 'Yxp': 0.06, 'P_max': 6},
        'X0': 0.3, 'S0': 80, 'P0': 0, 'hours': 120, 'color': '#3b82f6',
    },
}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Simulate and plot each fermentation
results = {}
for name, ferm in fermentations.items():
    t, X, S, P, mu = simulate_fermentation(
        ferm['params'], ferm['X0'], ferm['S0'], ferm['P0'], ferm['hours'])
    results[name] = {'t': t, 'X': X, 'S': S, 'P': P, 'mu': mu}

# Sugar consumption
ax0 = axes[0, 0]
for name, ferm in fermentations.items():
    r = results[name]
    ax0.plot(r['t'], r['S'], color=ferm['color'], linewidth=2, label=name)
ax0.set_xlabel('Time (hours)', color='white')
ax0.set_ylabel('Sugar concentration (g/L)', color='white')
ax0.set_title('Substrate (sugar) consumption', color='white', fontsize=11)
ax0.legend(fontsize=8)

# Product formation
ax1 = axes[0, 1]
for name, ferm in fermentations.items():
    r = results[name]
    ax1.plot(r['t'], r['P'], color=ferm['color'], linewidth=2, label=name)
ax1.set_xlabel('Time (hours)', color='white')
ax1.set_ylabel('Product concentration (g/L)', color='white')
ax1.set_title('Product formation', color='white', fontsize=11)
ax1.legend(fontsize=8)

# Biomass growth
ax2 = axes[1, 0]
for name, ferm in fermentations.items():
    r = results[name]
    ax2.plot(r['t'], r['X'], color=ferm['color'], linewidth=2, label=name)
ax2.set_xlabel('Time (hours)', color='white')
ax2.set_ylabel('Biomass (g/L)', color='white')
ax2.set_title('Microbial growth', color='white', fontsize=11)
ax2.legend(fontsize=8)

# Growth rate
ax3 = axes[1, 1]
for name, ferm in fermentations.items():
    r = results[name]
    ax3.plot(r['t'], r['mu'], color=ferm['color'], linewidth=2, label=name)
ax3.set_xlabel('Time (hours)', color='white')
ax3.set_ylabel('Specific growth rate (1/h)', color='white')
ax3.set_title('Growth rate (shows lag → exponential → stationary)', color='white', fontsize=11)
ax3.legend(fontsize=8)

plt.tight_layout()
plt.show()

for name, r in results.items():
    max_P = np.max(r['P'])
    time_to_max = r['t'][np.argmax(r['P'])]
    sugar_consumed = r['S'][0] - r['S'][-1]
    yield_eff = max_P / max(sugar_consumed, 0.01) * 100
    print(f"{name}: max product={max_P:.1f} g/L at {time_to_max:.0f}h, yield={yield_eff:.1f}%")`,
      challenge: "Add temperature dependence: microbial growth rate follows an Arrhenius-like curve with an optimal temperature (yeast: 30°C, bacteria: 37°C) and death at high temperatures. Simulate fermentation at 20°C, 30°C, and 40°C. Which temperature maximizes product yield?",
      successHint: "You can now model fermentation kinetics — the microbiology behind every fermented food from bread to beer to yogurt.",
    },
    {
      title: "Emulsification physics — modeling oil-water mixtures and stability",
      concept: "An emulsion is a mixture of two immiscible liquids (typically oil and water) where one is dispersed as tiny droplets in the other. Mayonnaise, milk, vinaigrette, and many sauces are emulsions. The physics involves surface tension, droplet breakup, and coalescence.\\n\\nThe key parameter is the **Weber number**: We = ρ × v² × d / σ, comparing inertial forces (mixing energy) to surface tension forces (droplet resistance). When We > 1, droplets break apart. When We < 1, droplets coalesce.\\n\\nEmulsion stability depends on:\\n- **Droplet size**: smaller droplets are more stable (Brownian motion > gravity).\\n- **Surfactant concentration**: emulsifiers coat droplet surfaces, preventing coalescence.\\n- **Viscosity ratio**: if the dispersed phase is too viscous relative to the continuous phase, droplets resist breakup.\\n- **Stokes settling**: large droplets cream (rise) or sediment (sink) at rate v = 2r²(ρ₁-ρ₂)g / 9η.",
      analogy: "An emulsion is like a crowded dance floor where two groups (oil and water) do not want to mix. The emulsifier is the DJ who keeps them moving together — coating each \"oil dancer\" with a protective layer that lets them mingle without clumping. If the DJ stops (emulsifier breaks down), the groups separate again.",
      storyConnection: "The little chef whisked egg yolk into oil, drop by drop, to make a rich sauce. The egg yolk lecithin is a natural emulsifier — each molecule has a water-loving head and an oil-loving tail, positioning itself at the oil-water interface. The slow addition and vigorous whisking create small, stable droplets. Rush the oil and the emulsion \"breaks\" — the chef knew this from painful experience.",
      checkQuestion: "Why must oil be added slowly when making mayonnaise, rather than all at once?",
      checkAnswer: "Adding oil slowly ensures each new oil drop encounters a large excess of water and emulsifier. The whisking breaks each oil addition into tiny droplets that immediately get coated by lecithin. Adding too much oil at once overwhelms the available emulsifier and water — large uncoated droplets form that coalesce into a separated oil layer. The critical parameter is the oil-to-emulsifier ratio at each moment during addition.",
      codeIntro: "Simulate emulsion formation and stability, modeling droplet size distributions and Stokes settling.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Emulsion simulation ---
def create_emulsion(n_droplets, oil_fraction, emulsifier_conc, mixing_energy):
    """Create an emulsion with given parameters.
    Returns droplet radii (micrometers).
    """
    # Base droplet size from mixing energy (Weber number scaling)
    surface_tension = 0.03  # N/m (oil-water)
    # Higher mixing energy -> smaller droplets
    d_mean = 50 * surface_tension / max(mixing_energy, 0.01)  # micrometers
    
    # Emulsifier reduces effective surface tension
    d_mean *= max(0.1, 1 - 0.8 * min(emulsifier_conc, 1.0))
    
    # Log-normal distribution (realistic for emulsions)
    radii = np.random.lognormal(np.log(d_mean), 0.5, n_droplets)
    return np.clip(radii, 0.1, 500)

def stokes_velocity(radius_um, density_diff=200, viscosity=0.001):
    """Stokes settling/creaming velocity (m/s).
    radius_um: droplet radius in micrometers
    """
    r = radius_um * 1e-6  # convert to meters
    g = 9.81
    return 2 * r**2 * density_diff * g / (9 * viscosity)

def simulate_stability(radii, hours=24, dt=0.5):
    """Simulate emulsion stability over time.
    Returns fraction of droplets that have creamed/settled.
    """
    container_height = 0.1  # 10 cm
    positions = np.random.uniform(0, container_height, len(radii))
    
    time_points = np.arange(0, hours, dt)
    creamed_fraction = []
    
    for t in time_points:
        velocities = stokes_velocity(radii)  # m/s
        positions += velocities * dt * 3600  # convert hours to seconds
        creamed = np.mean(positions > container_height)
        creamed_fraction.append(creamed)
    
    return time_points, np.array(creamed_fraction)

# --- Compare emulsion conditions ---
conditions = {
    'Vigorous mix + emulsifier': {'energy': 0.5, 'emulsifier': 0.8},
    'Gentle mix + emulsifier': {'energy': 0.1, 'emulsifier': 0.8},
    'Vigorous mix, no emulsifier': {'energy': 0.5, 'emulsifier': 0.05},
    'Gentle mix, no emulsifier': {'energy': 0.1, 'emulsifier': 0.05},
}

results = {}
for name, params in conditions.items():
    radii = create_emulsion(1000, 0.3, params['emulsifier'], params['energy'])
    time, creamed = simulate_stability(radii, hours=24)
    results[name] = {'radii': radii, 'time': time, 'creamed': creamed}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

# Droplet size distributions
ax0 = axes[0, 0]
for (name, r), color in zip(results.items(), colors):
    ax0.hist(r['radii'], bins=50, range=(0, 100), alpha=0.5, color=color, label=name)
ax0.set_xlabel('Droplet radius (μm)', color='white')
ax0.set_ylabel('Count', color='white')
ax0.set_title('Droplet size distributions', color='white', fontsize=11)
ax0.legend(fontsize=7)

# Stability curves
ax1 = axes[0, 1]
for (name, r), color in zip(results.items(), colors):
    ax1.plot(r['time'], r['creamed'] * 100, color=color, linewidth=2, label=name)
ax1.set_xlabel('Time (hours)', color='white')
ax1.set_ylabel('Creamed fraction (%)', color='white')
ax1.set_title('Emulsion stability over time', color='white', fontsize=11)
ax1.legend(fontsize=7)

# Stokes velocity vs radius
ax2 = axes[1, 0]
radii_range = np.linspace(0.1, 100, 200)
velocities = [stokes_velocity(r) * 1e6 for r in radii_range]  # μm/s
ax2.plot(radii_range, velocities, color='#f59e0b', linewidth=2)
ax2.set_xlabel('Droplet radius (μm)', color='white')
ax2.set_ylabel('Creaming velocity (μm/s)', color='white')
ax2.set_title('Stokes law: velocity ∝ radius²', color='white', fontsize=11)
ax2.axvline(10, color='#22c55e', linestyle='--', alpha=0.5, label='Stable (< 10 μm)')
ax2.legend(fontsize=8)

# Mean droplet size vs parameters
ax3 = axes[1, 1]
energies = np.linspace(0.05, 1.0, 20)
for emul, color, label in [(0.8, '#22c55e', 'With emulsifier'), (0.05, '#ef4444', 'No emulsifier')]:
    sizes = [np.median(create_emulsion(500, 0.3, emul, e)) for e in energies]
    ax3.plot(energies, sizes, 'o-', color=color, linewidth=2, label=label)
ax3.set_xlabel('Mixing energy (relative)', color='white')
ax3.set_ylabel('Median droplet radius (μm)', color='white')
ax3.set_title('Droplet size vs mixing + emulsifier', color='white', fontsize=11)
ax3.legend(fontsize=8)

plt.tight_layout()
plt.show()

for name, r in results.items():
    median_r = np.median(r['radii'])
    final_cream = r['creamed'][-1] * 100
    print(f"{name}: median radius={median_r:.1f}μm, creamed at 24h={final_cream:.0f}%")`,
      challenge: "Model a two-stage emulsification: first coarse mix, then high-shear blending. The second stage should only break droplets above a certain size. How does this two-stage process compare to a single high-energy mix?",
      successHint: "You can now model emulsion formation and stability — the physics behind sauces, dressings, and countless food products.",
    },
    {
      title: "Nutritional analysis — building a food composition calculator",
      concept: "Every food is a mixture of macronutrients (protein, carbohydrate, fat) and micronutrients (vitamins, minerals). Nutritional analysis computes the total nutrient content of a recipe from its ingredients.\\n\\nThe calculation is a matrix operation: if recipe R uses amounts a₁, a₂, ..., aₙ of ingredients 1 through n, and each ingredient has a nutrient vector (protein, carbs, fat, ...), then the recipe nutrient profile is: N_recipe = Σ aᵢ × Nᵢ.\\n\\nKey concepts:\\n- **Nutrient density**: nutrients per calorie. A food with high nutrients per calorie is \"nutrient dense.\"\\n- **Caloric balance**: 1g protein = 4 kcal, 1g carbohydrate = 4 kcal, 1g fat = 9 kcal.\\n- **Recommended Daily Intake (RDI)**: the amount of each nutrient needed per day. A recipe can be scored by how much of the RDI it provides.\\n- **Anti-nutrients**: some compounds (phytic acid, oxalates) reduce mineral absorption. Cooking often degrades these, changing effective nutrient availability.",
      analogy: "Nutritional analysis is like a financial portfolio calculator. Each ingredient is an \"investment\" with different returns in different categories (protein = stocks, carbs = bonds, fat = real estate). The recipe total is the weighted sum of all ingredient contributions. The RDI is your financial goal. The calculator tells you if your portfolio (recipe) meets your targets.",
      storyConnection: "The little chef combined ingredients intuitively, but her grandmother taught her balance — \"rice for energy, fish for strength, greens for health.\" That folk wisdom maps directly to macronutrient balance: carbs for energy, protein for muscle, micronutrients from vegetables. Our calculator quantifies what the grandmother knew qualitatively.",
      checkQuestion: "Why is caloric content alone a poor measure of food quality?",
      checkAnswer: "Two foods with 500 kcal can have vastly different nutritional profiles: 500 kcal of salmon provides ~50g protein, omega-3 fats, and vitamin D. 500 kcal of sugar provides zero protein, zero vitamins — just energy. Caloric content measures quantity (energy), not quality (nutrient density). The nutrient density score — nutrients per calorie — captures quality, which is why nutritionists care about micronutrient content, not just calories.",
      codeIntro: "Build a recipe nutrition calculator with ingredient database, macro/micro analysis, and RDI scoring.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Nutrient database (per 100g) ---
foods = {
    'Rice (cooked)': {'protein': 2.7, 'carbs': 28, 'fat': 0.3, 'fiber': 0.4,
                       'iron': 0.2, 'calcium': 10, 'vitC': 0, 'calories': 130},
    'Fish (rohu)': {'protein': 17, 'carbs': 0, 'fat': 1.4, 'fiber': 0,
                     'iron': 1.0, 'calcium': 100, 'vitC': 0, 'calories': 80},
    'Spinach': {'protein': 2.9, 'carbs': 3.6, 'fat': 0.4, 'fiber': 2.2,
                'iron': 2.7, 'calcium': 99, 'vitC': 28, 'calories': 23},
    'Lentils (dal)': {'protein': 9, 'carbs': 20, 'fat': 0.4, 'fiber': 8,
                       'iron': 3.3, 'calcium': 19, 'vitC': 1.5, 'calories': 116},
    'Mustard oil': {'protein': 0, 'carbs': 0, 'fat': 100, 'fiber': 0,
                     'iron': 0, 'calcium': 0, 'vitC': 0, 'calories': 884},
    'Onion': {'protein': 1.1, 'carbs': 9.3, 'fat': 0.1, 'fiber': 1.7,
              'iron': 0.2, 'calcium': 23, 'vitC': 7.4, 'calories': 40},
    'Potato': {'protein': 2, 'carbs': 17, 'fat': 0.1, 'fiber': 2.2,
               'iron': 0.8, 'calcium': 12, 'vitC': 19.7, 'calories': 77},
    'Egg': {'protein': 13, 'carbs': 1.1, 'fat': 11, 'fiber': 0,
            'iron': 1.8, 'calcium': 56, 'vitC': 0, 'calories': 155},
}

# RDI values (adult)
RDI = {'protein': 50, 'carbs': 300, 'fat': 65, 'fiber': 25,
       'iron': 18, 'calcium': 1000, 'vitC': 90, 'calories': 2000}

def analyze_recipe(ingredients_grams):
    """Compute total nutrition for a recipe.
    ingredients_grams: dict of {food_name: grams}
    """
    nutrients = {k: 0 for k in list(foods.values())[0].keys()}
    
    for food, grams in ingredients_grams.items():
        if food in foods:
            for nutrient, value_per_100g in foods[food].items():
                nutrients[nutrient] += value_per_100g * grams / 100
    
    # RDI percentages
    rdi_pct = {k: nutrients.get(k, 0) / RDI[k] * 100 for k in RDI}
    
    # Nutrient density score
    total_cal = max(nutrients['calories'], 1)
    density = sum(rdi_pct[k] for k in ['protein', 'iron', 'calcium', 'vitC', 'fiber']) / 5 / (total_cal / RDI['calories'] * 100) if total_cal > 0 else 0
    
    return nutrients, rdi_pct, density

# --- Analyze three recipes ---
recipes = {
    'Fish curry + rice': {'Rice (cooked)': 250, 'Fish (rohu)': 150, 'Onion': 50, 'Mustard oil': 15},
    'Dal + spinach + rice': {'Rice (cooked)': 250, 'Lentils (dal)': 100, 'Spinach': 80, 'Mustard oil': 10},
    'Egg + potato + rice': {'Rice (cooked)': 250, 'Egg': 100, 'Potato': 150, 'Onion': 30, 'Mustard oil': 10},
}

results = {}
for name, ingredients in recipes.items():
    nutrients, rdi_pct, density = analyze_recipe(ingredients)
    results[name] = {'nutrients': nutrients, 'rdi': rdi_pct, 'density': density}

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#22c55e', '#3b82f6', '#f59e0b']

# Macronutrient breakdown
ax0 = axes[0, 0]
macros = ['protein', 'carbs', 'fat']
x = np.arange(len(macros))
width = 0.25
for i, (name, r) in enumerate(results.items()):
    vals = [r['nutrients'][m] for m in macros]
    ax0.bar(x + i*width, vals, width, color=colors[i], label=name)
ax0.set_xticks(x + width)
ax0.set_xticklabels(['Protein (g)', 'Carbs (g)', 'Fat (g)'], color='white', fontsize=9)
ax0.set_title('Macronutrient content', color='white', fontsize=11)
ax0.legend(fontsize=7)

# RDI coverage
ax1 = axes[0, 1]
rdi_keys = ['protein', 'carbs', 'fat', 'fiber', 'iron', 'calcium', 'vitC']
rdi_labels = ['Protein', 'Carbs', 'Fat', 'Fiber', 'Iron', 'Calcium', 'Vit C']
x = np.arange(len(rdi_keys))
width = 0.25
for i, (name, r) in enumerate(results.items()):
    vals = [min(r['rdi'][k], 150) for k in rdi_keys]
    ax1.bar(x + i*width, vals, width, color=colors[i], label=name)
ax1.axhline(100, color='white', linestyle='--', alpha=0.5, label='100% RDI')
ax1.set_xticks(x + width)
ax1.set_xticklabels(rdi_labels, color='white', fontsize=8, rotation=30)
ax1.set_ylabel('% of RDI', color='white')
ax1.set_title('Daily value coverage', color='white', fontsize=11)
ax1.legend(fontsize=6)

# Caloric breakdown (pie-style as stacked bars)
ax2 = axes[1, 0]
for i, (name, r) in enumerate(results.items()):
    p_cal = r['nutrients']['protein'] * 4
    c_cal = r['nutrients']['carbs'] * 4
    f_cal = r['nutrients']['fat'] * 9
    total = p_cal + c_cal + f_cal
    ax2.barh(i, p_cal/total*100, color='#22c55e', alpha=0.7)
    ax2.barh(i, c_cal/total*100, left=p_cal/total*100, color='#3b82f6', alpha=0.7)
    ax2.barh(i, f_cal/total*100, left=(p_cal+c_cal)/total*100, color='#f59e0b', alpha=0.7)
ax2.set_yticks(range(len(results)))
ax2.set_yticklabels(list(results.keys()), color='white', fontsize=8)
ax2.set_xlabel('Caloric contribution (%)', color='white')
ax2.set_title('Protein (green) / Carbs (blue) / Fat (yellow)', color='white', fontsize=10)

# Nutrient density comparison
ax3 = axes[1, 1]
densities = [results[n]['density'] for n in results]
calories = [results[n]['nutrients']['calories'] for n in results]
ax3.bar(list(results.keys()), densities, color=colors)
ax3.set_ylabel('Nutrient density score', color='white')
ax3.set_title('Nutrient density (nutrients per calorie)', color='white', fontsize=11)
for label in ax3.get_xticklabels():
    label.set_color('white'); label.set_fontsize(7); label.set_rotation(20)

plt.tight_layout()
plt.show()

for name, r in results.items():
    cal = r['nutrients']['calories']
    print(f"\\n{name} ({cal:.0f} kcal):")
    for k in ['protein', 'iron', 'calcium', 'vitC']:
        print(f"  {k}: {r['nutrients'][k]:.1f} ({r['rdi'][k]:.0f}% RDI)")`,
      challenge: "Add a \"meal optimizer\": given a calorie target and minimum RDI percentages for protein, iron, and vitamin C, find the combination of ingredients from the database that meets all constraints at minimum cost (assign a price per 100g to each ingredient).",
      successHint: "You can now analyze recipe nutrition computationally — the science of dietary planning applied to traditional cuisine.",
    },
    {
      title: "pH and acidity — modeling flavor chemistry through acid-base reactions",
      concept: "pH profoundly affects food flavor, texture, and safety. The sourness of lemon juice (pH ~2), the mildness of milk (pH ~6.5), and the bitterness of baking soda (pH ~8.5) all derive from hydrogen ion concentration: pH = -log10[H+].\\n\\nIn cooking, pH changes occur through:\\n- **Acid addition**: lemon juice, vinegar, tamarind lower pH. Each pH unit = 10x more H+ ions.\\n- **Fermentation**: microbes produce lactic acid or acetic acid, lowering pH over time (Monod kinetics from Lesson 2).\\n- **Buffer systems**: foods resist pH change through buffer capacity. Proteins and amino acids in meat create a buffer around pH 5-6.\\n- **Maillard pH dependence**: browning rate increases at higher pH (alkaline). This is why pretzels (dipped in lye, pH ~13) brown intensely.\\n\\nThe Henderson-Hasselbalch equation describes buffering: pH = pKa + log10([A-]/[HA]), where HA is the acid and A- is its conjugate base.",
      analogy: "pH is like a volume knob for sourness. Turning it from 7 (neutral) toward 1 (very acidic) is like cranking up the volume — each number is 10x louder (more acidic). Buffers are like noise cancellation: they absorb added acid or base, keeping the \"volume\" (pH) steady. A well-buffered food resists flavor change when you add a squeeze of lemon.",
      storyConnection: "The little chef balanced flavors like a chemist: a squeeze of lime to brighten a dull curry, a pinch of baking soda to reduce sourness in tomato sauce. Each adjustment shifted the pH, changing how flavor molecules interact with taste receptors. The balance of sour, sweet, salty, and bitter is fundamentally acid-base chemistry.",
      checkQuestion: "Why does adding baking soda to tomato sauce reduce sourness more effectively than adding sugar?",
      checkAnswer: "Sugar masks sourness by adding a competing sweet taste — the acid is still there. Baking soda (sodium bicarbonate, NaHCO3) actually neutralizes the acid: NaHCO3 + HCl → NaCl + H2O + CO2. It raises the pH by removing hydrogen ions. The sourness is chemically eliminated, not just masked. This is why over-adding baking soda makes food taste flat and soapy — you have overshot to alkaline pH.",
      codeIntro: "Model pH changes during cooking processes: acid addition, fermentation-driven acidification, and buffering capacity.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- pH chemistry simulation ---
def acid_addition_ph(initial_ph, acid_concentration, volume_food_ml, volume_acid_ml_range):
    """Model pH change when adding acid to food.
    Uses simplified strong acid model.
    """
    H_initial = 10**(-initial_ph)
    H_acid = acid_concentration  # mol/L
    
    pH_values = []
    for v_acid in volume_acid_ml_range:
        total_volume = volume_food_ml + v_acid
        H_total = (H_initial * volume_food_ml + H_acid * v_acid) / total_volume
        pH_values.append(-np.log10(max(H_total, 1e-14)))
    
    return np.array(pH_values)

def buffer_capacity(food_ph, pKa, buffer_conc, acid_added_range):
    """Henderson-Hasselbalch buffering model.
    Shows how buffered foods resist pH change.
    """
    pH_values = []
    for acid in acid_added_range:
        # Simplified: buffer absorbs acid up to its capacity
        effective_acid = max(0, acid - buffer_conc * 0.5)
        if effective_acid < 0.01:
            pH_values.append(food_ph - acid / max(buffer_conc, 0.01) * 0.5)
        else:
            pH_values.append(food_ph - np.log10(1 + effective_acid / 0.01))
    return np.array(pH_values)

def fermentation_ph(initial_ph, rate, hours, buffer_strength=0.5):
    """pH change during fermentation (acid production)."""
    time = np.linspace(0, hours, 200)
    # Acid accumulates following logistic curve
    acid_produced = 0.1 / (1 + np.exp(-rate * (time - hours/3)))
    ph = initial_ph - acid_produced / buffer_strength
    return time, np.clip(ph, 2, 14)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Acid addition to different foods
ax0 = axes[0, 0]
v_acid = np.linspace(0, 20, 100)
foods_ph = [('Water (no buffer)', 7.0, 0.001), ('Milk (buffered)', 6.5, 0.05), ('Meat (strongly buffered)', 5.8, 0.1)]
colors_f = ['#3b82f6', '#22c55e', '#f59e0b']
for (name, ph, buf), color in zip(foods_ph, colors_f):
    if buf < 0.01:
        ph_vals = acid_addition_ph(ph, 0.1, 500, v_acid)
    else:
        ph_vals = buffer_capacity(ph, 4.6, buf, v_acid * 0.005)
    ax0.plot(v_acid, ph_vals, color=color, linewidth=2, label=name)
ax0.set_xlabel('Acid added (mL of lemon juice)', color='white')
ax0.set_ylabel('pH', color='white')
ax0.set_title('pH change with acid addition', color='white', fontsize=11)
ax0.legend(fontsize=8)
ax0.set_ylim(2, 8)

# Fermentation pH curves
ax1 = axes[0, 1]
fermentations_ph = [
    ('Yogurt (fast)', 6.5, 0.3, 12),
    ('Sauerkraut (medium)', 6.0, 0.15, 48),
    ('Cheese (slow)', 6.5, 0.08, 72),
]
for (name, ph0, rate, hours), color in zip(fermentations_ph, colors_f):
    t, ph = fermentation_ph(ph0, rate, hours)
    ax1.plot(t, ph, color=color, linewidth=2, label=name)
ax1.set_xlabel('Time (hours)', color='white')
ax1.set_ylabel('pH', color='white')
ax1.set_title('pH during fermentation', color='white', fontsize=11)
ax1.legend(fontsize=8)

# pH scale with food examples
ax2 = axes[1, 0]
food_phs = [
    ('Lemon juice', 2.0), ('Vinegar', 2.8), ('Tomato', 4.2),
    ('Coffee', 5.0), ('Milk', 6.5), ('Water', 7.0),
    ('Egg white', 8.0), ('Baking soda', 8.5),
]
names_ph = [f[0] for f in food_phs]
vals_ph = [f[1] for f in food_phs]
bar_colors = [plt.cm.RdYlGn(v/14) for v in vals_ph]
ax2.barh(range(len(food_phs)), vals_ph, color=bar_colors)
ax2.set_yticks(range(len(food_phs)))
ax2.set_yticklabels(names_ph, color='white', fontsize=9)
ax2.set_xlabel('pH', color='white')
ax2.set_title('pH of common foods', color='white', fontsize=11)
ax2.axvline(7, color='white', linestyle='--', alpha=0.5, label='Neutral')
ax2.legend(fontsize=8)

# Maillard rate vs pH
ax3 = axes[1, 1]
ph_range = np.linspace(3, 10, 100)
# Maillard rate increases ~2x per pH unit above 6
maillard_rate = np.exp(0.7 * (ph_range - 6))
maillard_rate = maillard_rate / maillard_rate[50]  # normalize
ax3.plot(ph_range, maillard_rate, color='#f59e0b', linewidth=2)
ax3.axvline(7, color='gray', linestyle='--', alpha=0.5)
ax3.set_xlabel('pH', color='white')
ax3.set_ylabel('Relative browning rate', color='white')
ax3.set_title('Maillard reaction rate vs pH', color='white', fontsize=11)
ax3.annotate('Pretzels (lye wash)', xy=(9, maillard_rate[ph_range > 9][0]),
    color='#ef4444', fontsize=8)

plt.tight_layout()
plt.show()

print("pH Chemistry in Cooking:")
print("  Acid addition: buffered foods resist pH change")
print("  Fermentation: microbes drive pH down over hours/days")
print("  Browning: alkaline pH accelerates Maillard (pretzel effect)")
print("  Balance: sour (low pH) + sweet + salt = complex flavor")`,
      challenge: "Model a titration curve: add NaOH (base) to lemon juice drop by drop and plot pH vs volume. Identify the equivalence point. Then add a phosphate buffer and show how it flattens the titration curve around pH 7.",
      successHint: "You can now model pH chemistry in cooking — the acid-base reactions that create flavor balance.",
    },
    {
      title: "Predictive recipe optimization — building a nutrition-aware recommendation engine",
      concept: "Combining all food chemistry knowledge into a predictive system: given dietary requirements (calories, protein, micronutrients) and flavor preferences (pH range, browning level, texture), recommend optimal recipes.\\n\\nThis is a constrained optimization problem:\\n- **Objective**: maximize a combined score (nutrition + flavor + cost efficiency).\\n- **Constraints**: calorie target ±10%, minimum protein/iron/vitamin C, maximum sodium, available ingredients.\\n- **Decision variables**: amount of each ingredient in grams.\\n\\nThe optimization uses a scoring function that weights multiple objectives: Score = w₁×nutrition_density + w₂×flavor_balance + w₃×cost_efficiency + w₄×preparation_simplicity.\\n\\nWe solve this as a grid search over discretized ingredient amounts (brute force for small ingredient sets) or linear programming for larger sets.",
      analogy: "Recipe optimization is like portfolio optimization in finance. You want maximum return (nutrition) with minimum risk (poor flavor) within a budget (calorie target). Each ingredient is an asset with its own risk-return profile. The optimizer finds the combination that maximizes your nutritional \"return\" without exceeding your caloric \"budget\" or your sodium \"risk tolerance.\"",
      storyConnection: "The little chef grandmother told her: \"a good meal feeds both the body and the soul.\" Our optimizer quantifies \"feeding the body\" (nutrition) and approximates \"feeding the soul\" (flavor balance through pH and Maillard chemistry). The grandmother optimization, done by intuition over a lifetime, now runs in milliseconds.",
      checkQuestion: "Why is grid search adequate for recipe optimization with 5-8 ingredients but fails for 50 ingredients?",
      checkAnswer: "With 5 ingredients at 10 levels each, grid search evaluates 10^5 = 100,000 combinations — feasible. With 50 ingredients, it would need 10^50 evaluations — more than atoms in the universe. For large ingredient sets, you need linear programming (if the objective and constraints are linear) or gradient-based optimization (if differentiable). Recipe optimization with a small traditional ingredient set is one of the rare real-world problems where brute force works well.",
      codeIntro: "Build the recipe optimization engine with multi-objective scoring, constraint handling, and recommendation output.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Ingredient database ---
ingredients = {
    'Rice': {'cal': 130, 'protein': 2.7, 'iron': 0.2, 'vitC': 0, 'cost': 2, 'ph': 6.5},
    'Fish': {'cal': 80, 'protein': 17, 'iron': 1.0, 'vitC': 0, 'cost': 15, 'ph': 6.8},
    'Dal': {'cal': 116, 'protein': 9, 'iron': 3.3, 'vitC': 1.5, 'cost': 5, 'ph': 6.2},
    'Spinach': {'cal': 23, 'protein': 2.9, 'iron': 2.7, 'vitC': 28, 'cost': 4, 'ph': 5.5},
    'Egg': {'cal': 155, 'protein': 13, 'iron': 1.8, 'vitC': 0, 'cost': 8, 'ph': 7.5},
    'Potato': {'cal': 77, 'protein': 2, 'iron': 0.8, 'vitC': 19.7, 'cost': 3, 'ph': 5.8},
    'Onion': {'cal': 40, 'protein': 1.1, 'iron': 0.2, 'vitC': 7.4, 'cost': 3, 'ph': 5.5},
    'Oil': {'cal': 884, 'protein': 0, 'iron': 0, 'vitC': 0, 'cost': 10, 'ph': 7.0},
}

# Targets
targets = {'cal': 600, 'protein': 25, 'iron': 5, 'vitC': 20}

def score_recipe(amounts_per_100g):
    """Score a recipe on nutrition, balance, and cost."""
    total = {k: 0 for k in ['cal', 'protein', 'iron', 'vitC', 'cost']}
    
    for (name, props), amount in zip(ingredients.items(), amounts_per_100g):
        for key in total:
            total[key] += props[key] * amount / 100
    
    # Nutrition score: how well targets are met
    cal_score = max(0, 1 - abs(total['cal'] - targets['cal']) / targets['cal'])
    prot_score = min(1, total['protein'] / targets['protein'])
    iron_score = min(1, total['iron'] / targets['iron'])
    vitc_score = min(1, total['vitC'] / targets['vitC'])
    nutrition = (cal_score + prot_score + iron_score + vitc_score) / 4
    
    # Cost efficiency
    cost_score = max(0, 1 - total['cost'] / 50)
    
    # Variety bonus (more ingredients = more interesting)
    variety = np.sum(np.array(amounts_per_100g) > 10) / len(amounts_per_100g)
    
    return {
        'nutrition': nutrition,
        'cost': cost_score,
        'variety': variety,
        'total_score': 0.5 * nutrition + 0.3 * cost_score + 0.2 * variety,
        'totals': total,
    }

# --- Grid search optimization ---
# Discretize: each ingredient 0, 50, 100, 150, 200, 250g
levels = [0, 50, 100, 150, 200, 250]
n_ingredients = len(ingredients)

best_score = -1
best_recipe = None
best_details = None
n_evaluated = 0

# Smart sampling (random search — faster than full grid)
n_random = 50000
for _ in range(n_random):
    amounts = [np.random.choice(levels) for _ in range(n_ingredients)]
    # Quick calorie check
    approx_cal = sum(ingredients[name]['cal'] * a / 100 for name, a in zip(ingredients.keys(), amounts))
    if approx_cal < 400 or approx_cal > 800:
        continue
    
    result = score_recipe(amounts)
    n_evaluated += 1
    
    if result['total_score'] > best_score:
        best_score = result['total_score']
        best_recipe = amounts
        best_details = result

# Get top 5 recipes
top_recipes = []
for _ in range(100000):
    amounts = [np.random.choice(levels) for _ in range(n_ingredients)]
    approx_cal = sum(ingredients[name]['cal'] * a / 100 for name, a in zip(ingredients.keys(), amounts))
    if approx_cal < 400 or approx_cal > 800:
        continue
    result = score_recipe(amounts)
    top_recipes.append((amounts, result))

top_recipes.sort(key=lambda x: x[1]['total_score'], reverse=True)
top_5 = top_recipes[:5]

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Best recipe composition
ax0 = axes[0, 0]
names = list(ingredients.keys())
nonzero = [(n, a) for n, a in zip(names, best_recipe) if a > 0]
if nonzero:
    r_names, r_amounts = zip(*nonzero)
    colors_r = plt.cm.Set2(np.linspace(0, 1, len(r_names)))
    ax0.pie(r_amounts, labels=r_names, colors=colors_r, autopct='%1.0f%%',
            textprops={'color': 'white', 'fontsize': 8})
ax0.set_title(f'Best recipe (score: {best_score:.3f})', color='white', fontsize=11)

# Nutrient coverage
ax1 = axes[0, 1]
totals = best_details['totals']
rdi_pct = {
    'Calories': totals['cal'] / targets['cal'] * 100,
    'Protein': totals['protein'] / targets['protein'] * 100,
    'Iron': totals['iron'] / targets['iron'] * 100,
    'Vitamin C': totals['vitC'] / targets['vitC'] * 100,
}
bar_colors = ['#22c55e' if v >= 80 else '#f59e0b' if v >= 50 else '#ef4444' for v in rdi_pct.values()]
ax1.bar(rdi_pct.keys(), rdi_pct.values(), color=bar_colors)
ax1.axhline(100, color='white', linestyle='--', alpha=0.5, label='Target')
ax1.set_ylabel('% of target', color='white')
ax1.set_title('Nutrient target coverage', color='white', fontsize=11)
ax1.legend(fontsize=8)
for label in ax1.get_xticklabels():
    label.set_color('white')

# Top 5 recipes comparison
ax2 = axes[1, 0]
for i, (amounts, result) in enumerate(top_5):
    metrics = [result['nutrition'], result['cost'], result['variety']]
    x = np.arange(3)
    ax2.bar(x + i*0.15, metrics, 0.15, color=plt.cm.Set1(i/5), label=f'Recipe {i+1}')
ax2.set_xticks(np.arange(3) + 0.3)
ax2.set_xticklabels(['Nutrition', 'Cost', 'Variety'], color='white')
ax2.set_title('Top 5 recipes — score breakdown', color='white', fontsize=11)
ax2.legend(fontsize=7)

# Optimization landscape (2D slice)
ax3 = axes[1, 1]
rice_range = np.arange(0, 301, 25)
fish_range = np.arange(0, 251, 25)
score_grid = np.zeros((len(fish_range), len(rice_range)))
for i, fish in enumerate(fish_range):
    for j, rice in enumerate(rice_range):
        amounts = [rice, fish, 100, 50, 0, 0, 30, 10]
        result = score_recipe(amounts)
        score_grid[i, j] = result['total_score']

im = ax3.contourf(rice_range, fish_range, score_grid, levels=15, cmap='viridis')
ax3.set_xlabel('Rice (g)', color='white')
ax3.set_ylabel('Fish (g)', color='white')
ax3.set_title('Score landscape (rice vs fish)', color='white', fontsize=11)
plt.colorbar(im, ax=ax3, label='Score')

plt.tight_layout()
plt.show()

print(f"Optimization: evaluated {n_evaluated:,} feasible recipes")
print(f"\\nBest recipe (score={best_score:.3f}):")
for name, amount in zip(names, best_recipe):
    if amount > 0:
        print(f"  {name}: {amount}g")
print(f"\\nNutrition: {totals['cal']:.0f} cal, {totals['protein']:.1f}g protein, ")
print(f"  {totals['iron']:.1f}mg iron, {totals['vitC']:.1f}mg vitamin C")
print(f"  Cost: {totals['cost']:.1f} units")`,
      challenge: "Add a \"meal plan\" mode: optimize three meals per day (breakfast, lunch, dinner) where the daily totals must meet RDI targets, but each meal can be unbalanced. Does this flexibility improve the overall nutrition score compared to requiring each meal to be balanced?",
      successHint: "You have built a complete food chemistry analysis pipeline: from molecular kinetics to nutritional optimization. The system connects the little chef kitchen wisdom to quantitative food science.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (chemistry fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for food chemistry analysis and molecular gastronomy. Click to start.</p>
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
