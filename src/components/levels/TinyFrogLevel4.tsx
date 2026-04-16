import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TinyFrogLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone overview — Body Size Predictor',
      concept: `In this capstone you will build a **Body Size Predictor** that takes an animal's body mass as input and predicts its metabolic rate, heart rate, lifespan, brain size, and other physiological parameters using allometric scaling laws. You will then extend this to predict which physiological constraints become limiting at extreme sizes.

The predictor combines multiple allometric equations into a unified model: given body mass M, it outputs a complete physiological profile. This is exactly what comparative physiologists do — they use scaling laws as null models (expected values) and then identify species that deviate from predictions as particularly interesting cases.

Your system will:
1. Implement 8+ allometric scaling equations with confidence intervals
2. Generate predictions for any body mass from 0.001g to 100,000 kg
3. Identify physiological constraint boundaries (where systems fail)
4. Compare predictions against real data for validation
5. Build an interactive "what-if" explorer for body size effects
6. Apply the model to conservation: predict vulnerability from body size alone`,
      analogy: 'The Body Size Predictor is like a universal translator for biology. Give it a body mass, and it translates that single number into a full physiological profile: metabolic rate, lifespan, food needs, vulnerability to climate change. It is the biological equivalent of calculating the orbital period, gravity, and escape velocity of a planet from its mass alone.',
      storyConnection: 'When NE India herpetologists discover a new miniaturized frog species, the first measurement they take is body mass. From that single number, the predictor can estimate whether the species can survive in a given habitat: can it find enough food (metabolic rate), maintain water balance (SA:V ratio), and reproduce (minimum egg size)? Body mass is the master variable of comparative biology.',
      checkQuestion: 'Your predictor says a newly discovered 0.05g frog should have a metabolic rate of 0.8 mW. The actual measured rate is 1.5 mW. What does this deviation tell you?',
      checkAnswer: 'The measured rate is 1.5/0.8 = 1.88x the predicted rate. This could mean: (1) the species is unusually active (high activity metabolism on top of basal), (2) it has an unusually high body temperature for its size, (3) it was stressed during measurement, or (4) the scaling law does not apply well at this extreme size. Deviations from scaling predictions are where the most interesting biology hides — they flag species that have evolved unusual solutions to size-related challenges.',
      codeIntro: 'Build the core allometric prediction engine with 8 physiological parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === BODY SIZE PREDICTOR: Core Engine ===

class BodySizePredictor:
    """Predict physiological traits from body mass using allometric scaling."""

    # Scaling parameters: (coefficient, exponent, unit, name)
    SCALING_LAWS = {
        'bmr':        (3.5, 0.75, 'mW', 'Basal metabolic rate'),
        'heart_rate': (240, -0.25, 'bpm', 'Heart rate'),
        'lifespan':   (11.8, 0.20, 'years', 'Maximum lifespan'),
        'brain_mass': (0.1, 0.67, 'g', 'Brain mass'),
        'lung_vol':   (0.063, 1.01, 'mL', 'Lung volume'),
        'blood_vol':  (0.065, 0.99, 'mL', 'Blood volume'),
        'home_range': (0.024, 1.02, 'ha', 'Home range'),
        'pop_density': (120, -0.75, '/km2', 'Population density'),
    }

    # Confidence: log-normal scatter (in log10 units)
    SCATTER = {k: 0.15 for k in SCALING_LAWS}  # ~40% variation
    SCATTER['lifespan'] = 0.25  # more variable
    SCATTER['home_range'] = 0.30  # highly variable

    def predict(self, mass_g, trait=None):
        """Predict one or all traits for given body mass (in grams)."""
        mass_kg = mass_g / 1000.0
        results = {}
        for key, (a, b, unit, name) in self.SCALING_LAWS.items():
            if trait and key != trait:
                continue
            val = a * mass_kg**b
            # 95% CI from log-normal scatter
            ci_low = val * 10**(-2 * self.SCATTER[key])
            ci_high = val * 10**(2 * self.SCATTER[key])
            results[key] = {
                'value': val, 'ci_low': ci_low, 'ci_high': ci_high,
                'unit': unit, 'name': name, 'exponent': b
            }
        return results

    def predict_derived(self, mass_g):
        """Calculate derived quantities."""
        base = self.predict(mass_g)
        mass_kg = mass_g / 1000.0

        # Mass-specific metabolic rate
        spec_bmr = base['bmr']['value'] / mass_kg  # mW/kg

        # Starvation time (5% body fat)
        fat_energy = 0.05 * mass_kg * 37e3  # J
        starv_hours = fat_energy / (base['bmr']['value'] / 1000 * 3600)

        # Daily food need (% body mass, assuming insect diet ~5 kJ/g)
        daily_food_pct = base['bmr']['value']/1000 * 86400 / (5000 * mass_kg) * 100

        # SA:V ratio (sphere approximation)
        radius_cm = (3 * mass_g / (4 * np.pi * 1.05))**(1/3)  # density ~1.05
        sa_v = 3 / radius_cm

        # Brain fraction
        brain_frac = base['brain_mass']['value'] / mass_g * 100

        return {
            'specific_bmr': spec_bmr,
            'starvation_hours': starv_hours,
            'daily_food_pct': daily_food_pct,
            'sa_v_ratio': sa_v,
            'brain_fraction_pct': brain_frac,
        }

# Create predictor
pred = BodySizePredictor()

# Test across a range of sizes
masses = np.logspace(-2, 4, 300)  # 0.01g to 10kg
traits = list(pred.SCALING_LAWS.keys())

fig, axes = plt.subplots(2, 4, figsize=(18, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Body Size Predictor: Allometric Engine', color='white', fontsize=14, fontweight='bold')

colors = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4', '#f97316']

for idx, trait in enumerate(traits):
    ax = axes[idx // 4, idx % 4]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    vals = [pred.predict(m, trait)[trait] for m in masses]
    centers = [v['value'] for v in vals]
    lows = [v['ci_low'] for v in vals]
    highs = [v['ci_high'] for v in vals]

    ax.loglog(masses, centers, color=colors[idx], linewidth=2.5)
    ax.fill_between(masses, lows, highs, color=colors[idx], alpha=0.15)

    info = pred.SCALING_LAWS[trait]
    ax.set_xlabel('Body mass (g)', color='white', fontsize=8)
    ax.set_ylabel(f'{info[2]}', color='white', fontsize=8)
    ax.set_title(f'{info[3]} [M^{info[1]}]', color=colors[idx], fontsize=9, fontweight='bold')

    # Mark specific animals
    for m, name in [(0.01, 'Tiny frog'), (5, 'Tree frog'), (500, 'Bullfrog')]:
        r = pred.predict(m, trait)[trait]
        ax.scatter(m, r['value'], c='white', s=40, zorder=5)

plt.tight_layout()
plt.show()

# Print predictions for a specific animal
test_mass = 0.05  # 50mg frog
print(f"=== PREDICTIONS FOR {test_mass}g FROG ===")
results = pred.predict(test_mass)
for key, r in results.items():
    print(f"  {r['name']:<25}: {r['value']:.4f} {r['unit']}  (95% CI: {r['ci_low']:.4f}-{r['ci_high']:.4f})")

derived = pred.predict_derived(test_mass)
print(f"\
  Derived quantities:")
print(f"  {'Specific BMR':<25}: {derived['specific_bmr']:.0f} mW/kg")
print(f"  {'Starvation time':<25}: {derived['starvation_hours']:.1f} hours")
print(f"  {'Daily food need':<25}: {derived['daily_food_pct']:.1f}% body mass")
print(f"  {'SA:V ratio':<25}: {derived['sa_v_ratio']:.1f} cm^-1")
print(f"  {'Brain fraction':<25}: {derived['brain_fraction_pct']:.1f}% body mass")`,
      challenge: 'Add a new scaling law for "call frequency" (sound pitch). The exponent is approximately -0.33. Predict the call frequency for a 0.01g frog and compare to a 500g bullfrog. Is the tiny frog\'s call ultrasonic?',
      successHint: 'With 8 scaling laws and derived quantities, you can generate a comprehensive physiological profile from a single measurement: body mass. This is the foundation of comparative biology.',
    },
    {
      title: 'Constraint mapping — physiological limits at extreme sizes',
      concept: `Your predictor gives point estimates, but the real power comes from identifying **where constraints become limiting**. At extreme body sizes, one or more physiological systems approach failure thresholds. Mapping these thresholds reveals the boundaries of viable body plans.

For miniaturized frogs, the critical constraints are:
- **Desiccation**: SA:V ratio exceeds critical threshold, requiring >90% humidity at all times
- **Starvation**: metabolic rate so high that starvation occurs in <12 hours without food
- **Thermal vulnerability**: body equilibrates with environment in <2 minutes, no thermoregulation possible
- **Neural minimum**: brain too small for essential circuits (predator avoidance, prey capture, mate finding)
- **Reproductive minimum**: eggs too small for viable embryonic development

Each constraint defines a **minimum viable body mass**. The overall minimum is determined by whichever constraint is most restrictive (Liebig's law again). Below this mass, the body plan becomes non-viable — no amount of evolutionary optimization can overcome fundamental physics.`,
      analogy: 'Constraint mapping is like a car safety rating that tests multiple crash scenarios. A car might ace the frontal crash test but fail the rollover test — it is the weakest test that determines the overall rating. Similarly, a tiny frog might handle desiccation fine (because it lives in cloud forest) but fail the starvation constraint (because insects are seasonally scarce). The weakest link determines survival.',
      storyConnection: 'Conservation biologists in NE India use this approach implicitly when assessing habitat suitability for miniaturized species. They ask: is the humidity high enough? Are small invertebrates abundant enough? Is the temperature stable enough? Your constraint mapper formalizes these questions into quantitative thresholds that can be compared across sites.',
      checkQuestion: 'If climate change reduces humidity in Meghalaya cloud forests from 95% to 75%, which body size classes of frogs would be most affected and why?',
      checkAnswer: 'The smallest frogs would be devastated. At 95% humidity, a 10mm frog can survive hours between rain events. At 75% humidity, the evaporation rate through their skin increases 4x (because 1-0.75 = 0.25 vs 1-0.95 = 0.05). Their desiccation survival time drops from hours to minutes. Frogs above ~30mm would be less affected because their lower SA:V ratio buffers water loss. The humidity constraint shifts the minimum viable body size upward, potentially eliminating all miniaturized species.',
      codeIntro: 'Map physiological constraints across body sizes to identify the minimum viable mass for amphibians.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Constraint mapping: where does each physiological system fail?

mass_g = np.logspace(-3, 4, 500)  # 0.001g to 10,000g
mass_kg = mass_g / 1000

# Constraint functions: return "viability score" (1 = fine, 0 = failed)

def desiccation_constraint(mass, humidity=0.85):
    """Water loss rate relative to reserves."""
    radius = (3 * mass / (4 * np.pi * 1.05))**(1/3)  # cm
    sa = 4 * np.pi * radius**2
    vol = 4/3 * np.pi * radius**3
    water_reserve = vol * 0.8  # 80% water
    evap_rate = 0.005 * sa * (1 - humidity)  # mg/min equivalent
    survival_min = 0.2 * water_reserve * 1000 / evap_rate  # minutes to 20% loss
    return np.clip(survival_min / 120, 0, 1)  # normalize: 2 hours = fully viable

def starvation_constraint(mass):
    """Time to starvation from fat reserves."""
    bmr_w = 3.5 * (mass/1000)**0.75
    fat_energy = 0.05 * mass/1000 * 37e3  # J
    hours = fat_energy / (bmr_w / 1000 * 3600)
    return np.clip(hours / 24, 0, 1)  # normalize: 24 hours = viable

def thermal_constraint(mass):
    """Thermal equilibration time (vulnerability to temperature swings)."""
    radius = (3 * mass / (4 * np.pi * 1.05))**(1/3)
    sa = 4 * np.pi * radius**2
    vol = 4/3 * np.pi * radius**3
    tau_min = 4.2e6 * (vol * 1e-6) / (10 * sa * 1e-4) / 60
    return np.clip(tau_min / 5, 0, 1)  # normalize: 5 min = viable

def neural_constraint(mass):
    """Brain volume relative to minimum functional."""
    brain_g = 0.1 * (mass/1000)**0.67
    brain_vol_mm3 = brain_g * 1000  # ~1g/mL density
    min_vol = 0.1  # mm^3 minimum for basic function
    return np.clip(brain_vol_mm3 / min_vol, 0, 1)

def reproductive_constraint(mass):
    """Minimum egg size for viable development."""
    egg_mass = 0.03 * mass**0.85  # mg
    min_egg = 0.05  # mg minimum
    return np.clip(egg_mass / min_egg, 0, 1)

# Calculate all constraints
constraints = {
    'Desiccation': np.array([desiccation_constraint(m) for m in mass_g]),
    'Starvation': np.array([starvation_constraint(m) for m in mass_g]),
    'Thermal': np.array([thermal_constraint(m) for m in mass_g]),
    'Neural': np.array([neural_constraint(m) for m in mass_g]),
    'Reproductive': np.array([reproductive_constraint(m) for m in mass_g]),
}

# Overall viability
overall = np.ones_like(mass_g)
for v in constraints.values():
    overall = np.minimum(overall, v)

# Find minimum viable mass (where overall > 0.5)
viable_idx = np.where(overall > 0.5)[0]
min_viable = mass_g[viable_idx[0]] if len(viable_idx) > 0 else mass_g[0]

# Find which constraint is limiting at each size
limiting = np.zeros_like(mass_g, dtype=int)
for i in range(len(mass_g)):
    values = [constraints[k][i] for k in constraints]
    limiting[i] = np.argmin(values)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Constraint Mapping: Minimum Viable Body Size', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#3b82f6', '#ef4444', '#f59e0b', '#a855f7', '#22c55e']
cnames = list(constraints.keys())

# 1: All constraints overlaid
for i, (name, vals) in enumerate(constraints.items()):
    axes[0, 0].semilogx(mass_g, vals, color=colors[i], linewidth=2, label=name, alpha=0.8)
axes[0, 0].semilogx(mass_g, overall, color='white', linewidth=3, label='Overall', linestyle='--')
axes[0, 0].axhline(0.5, color='gray', linestyle=':', alpha=0.5)
axes[0, 0].axvline(min_viable, color='#ef4444', linestyle='--', linewidth=2,
                     label=f'Min viable: {min_viable:.3f}g')
axes[0, 0].set_xlabel('Body mass (g)', color='white')
axes[0, 0].set_ylabel('Viability (0-1)', color='white')
axes[0, 0].set_title('All constraints', color='white', fontsize=10)
axes[0, 0].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: Limiting constraint map
cmap = plt.cm.colors.ListedColormap(colors)
axes[0, 1].scatter(mass_g, np.ones_like(mass_g), c=limiting, cmap=cmap, s=5, alpha=0.8)
for i, name in enumerate(cnames):
    mask = limiting == i
    if np.any(mask):
        range_str = f"{mass_g[mask].min():.3f}-{mass_g[mask].max():.1f}g"
        axes[0, 1].text(np.sqrt(mass_g[mask].min() * mass_g[mask].max()), 1.02,
                          name[:6], color=colors[i], fontsize=7, ha='center')
axes[0, 1].set_xscale('log')
axes[0, 1].set_xlabel('Body mass (g)', color='white')
axes[0, 1].set_title('Which constraint limits? (by body size)', color='white', fontsize=10)
axes[0, 1].set_ylim(0.95, 1.1)

# 3: Humidity sensitivity
for h in [0.70, 0.80, 0.90, 0.95]:
    desic = np.array([desiccation_constraint(m, h) for m in mass_g])
    axes[0, 2].semilogx(mass_g, desic, linewidth=2, label=f'{h*100:.0f}%')
axes[0, 2].axhline(0.5, color='gray', linestyle=':', alpha=0.5)
axes[0, 2].set_xlabel('Body mass (g)', color='white')
axes[0, 2].set_ylabel('Desiccation viability', color='white')
axes[0, 2].set_title('Humidity shifts the size limit', color='white', fontsize=10)
axes[0, 2].legend(title='Humidity', fontsize=7, title_fontsize=8,
                    facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4-6: Individual constraint detail plots
for i, (name, vals) in enumerate(list(constraints.items())[:3]):
    ax = axes[1, i]
    ax.semilogx(mass_g, vals, color=colors[i], linewidth=2.5)
    ax.fill_between(mass_g, vals, alpha=0.15, color=colors[i])
    ax.axhline(0.5, color='gray', linestyle=':', alpha=0.5)

    # Mark real frogs
    for m, fname in [(0.01, 'P.amauensis'), (0.1, 'Mini'), (5, 'Tree'), (500, 'Bull')]:
        idx = np.argmin(np.abs(mass_g - m))
        ax.scatter(m, vals[idx], c='white', s=50, zorder=5)
        ax.annotate(fname, (m, vals[idx]), fontsize=6, color='white', xytext=(3,3), textcoords='offset points')

    ax.set_xlabel('Body mass (g)', color='white')
    ax.set_ylabel('Viability', color='white')
    ax.set_title(f'{name} constraint detail', color=colors[i], fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

print(f"=== MINIMUM VIABLE BODY SIZE ===")
print(f"  Overall minimum: {min_viable:.4f}g ({min_viable*1000:.1f}mg)")
print(f"  This corresponds to ~{(min_viable/0.001)**(1/3) * 10:.1f}mm body length")
print(f"\
  Limiting constraints by size:")
for i, name in enumerate(cnames):
    mask = limiting == i
    if np.any(mask):
        print(f"    {name}: limits at {mass_g[mask].min():.4f}g - {mass_g[mask].max():.1f}g")`,
      challenge: 'Add a "habitat quality" parameter that simultaneously adjusts humidity (desiccation), insect density (starvation), and temperature stability (thermal). Map how the minimum viable body size changes across a habitat quality gradient from 0 (desert) to 1 (pristine cloud forest).',
      successHint: 'Constraint mapping reveals that miniaturization is not one challenge but many. The limiting factor changes with body size, and environmental conditions shift the boundaries. This is the foundation of body size ecology.',
    },
    {
      title: 'Validation against real data',
      concept: `A model is only useful if its predictions match reality. To validate the Body Size Predictor, we compare its predictions against **measured values** from real amphibian species and calculate the prediction error.

Validation metrics:
- **Mean Absolute Error (MAE)**: average |predicted - observed|. Easy to interpret.
- **Mean Absolute Percentage Error (MAPE)**: average |predicted - observed| / observed * 100. Scale-independent.
- **R-squared (R2)**: fraction of variance in observations explained by predictions. R2 = 1 means perfect prediction.
- **Residual analysis**: plot predicted vs observed. Points should fall on the 1:1 line.

For allometric scaling, we work in **log space**: log(Y) = log(a) + b * log(M). In log space, the power law becomes a straight line, and residuals should be normally distributed with constant variance.

Systematic deviations from the 1:1 line reveal where the scaling law breaks down — perhaps at very small sizes (where quantum effects of organ minimum sizes matter) or at very large sizes (where biomechanical constraints alter the relationship).`,
      analogy: 'Validation is like checking a weather forecast against actual weather. If the forecast says 25C and it is actually 23C, the error is small and the model is useful. If it says 25C and it is 10C, the model is broken. You validate a model not by whether it is perfect, but by whether its errors are small enough to be useful for decision-making.',
      storyConnection: 'When researchers in Meghalaya measure the metabolic rate of a newly discovered mini frog, they compare it to the allometric prediction. If it falls within the expected range, the species is "normal." If it deviates significantly, it flags the species as physiologically unusual — perhaps it has evolved a novel adaptation to extreme miniaturization. Validation turns the predictor into a discovery tool.',
      checkQuestion: 'If your model predicts BMR = 0.5 mW for a 0.05g frog but the measured value is 0.8 mW, what are the MAE, MAPE, and what does the residual suggest?',
      checkAnswer: 'MAE = |0.5 - 0.8| = 0.3 mW. MAPE = 0.3/0.8 * 100 = 37.5%. In log space: residual = log10(0.8) - log10(0.5) = -0.097 - (-0.301) = 0.204 log units. This means the actual value is 10^0.204 = 1.6x higher than predicted. A 37.5% error is moderate for biological scaling — typical scatter in allometric data is 30-50%. But consistent underestimation at small sizes would suggest the scaling exponent changes for miniaturized species.',
      codeIntro: 'Validate the allometric predictor against real amphibian data and analyze prediction accuracy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate "real" amphibian data with realistic scatter
# (In a real study, this would be actual measured values)

def generate_validation_data(n=60):
    """Generate realistic amphibian data with species-specific variation."""
    masses = np.sort(np.concatenate([
        10**np.random.uniform(-2, 0, 20),   # tiny frogs
        10**np.random.uniform(0, 1.5, 20),   # medium frogs
        10**np.random.uniform(1.5, 3.5, 20), # large frogs/salamanders
    ]))

    # True values follow allometric laws with realistic scatter
    bmr_true = 3.5 * (masses/1000)**0.75 * 10**np.random.normal(0, 0.12, n)
    hr_true = 240 * (masses/1000)**(-0.25) * 10**np.random.normal(0, 0.08, n)
    life_true = 11.8 * (masses/1000)**0.20 * 10**np.random.normal(0, 0.20, n)
    brain_true = 0.1 * (masses/1000)**0.67 * 10**np.random.normal(0, 0.10, n)

    return masses, {
        'bmr': bmr_true,
        'heart_rate': hr_true,
        'lifespan': life_true,
        'brain_mass': brain_true,
    }

masses, real_data = generate_validation_data()

# Predictions from our model
pred_data = {}
for trait in ['bmr', 'heart_rate', 'lifespan', 'brain_mass']:
    a, b = {'bmr': (3.5, 0.75), 'heart_rate': (240, -0.25),
             'lifespan': (11.8, 0.20), 'brain_mass': (0.1, 0.67)}[trait]
    pred_data[trait] = a * (masses/1000)**b

# Validation metrics
def calc_metrics(pred, obs):
    mae = np.mean(np.abs(pred - obs))
    mape = np.mean(np.abs(pred - obs) / obs) * 100
    ss_res = np.sum((obs - pred)**2)
    ss_tot = np.sum((obs - obs.mean())**2)
    r2 = 1 - ss_res / ss_tot
    # Log-space residuals
    log_residuals = np.log10(obs) - np.log10(pred)
    return {'mae': mae, 'mape': mape, 'r2': r2, 'log_residuals': log_residuals}

fig, axes = plt.subplots(2, 4, figsize=(18, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Model Validation: Predicted vs Observed', color='white', fontsize=14, fontweight='bold')

trait_info = {
    'bmr': ('BMR (mW)', '#22c55e'),
    'heart_rate': ('Heart rate (bpm)', '#ef4444'),
    'lifespan': ('Lifespan (years)', '#3b82f6'),
    'brain_mass': ('Brain mass (g)', '#f59e0b'),
}

for idx, trait in enumerate(trait_info):
    ax_scatter = axes[0, idx]
    ax_resid = axes[1, idx]
    ax_scatter.set_facecolor('#111827'); ax_scatter.tick_params(colors='gray')
    ax_resid.set_facecolor('#111827'); ax_resid.tick_params(colors='gray')

    name, color = trait_info[trait]
    metrics = calc_metrics(pred_data[trait], real_data[trait])

    # Predicted vs observed scatter
    ax_scatter.loglog(pred_data[trait], real_data[trait], 'o', color=color, alpha=0.6, markersize=5)
    # 1:1 line
    lims = [min(pred_data[trait].min(), real_data[trait].min()) * 0.5,
            max(pred_data[trait].max(), real_data[trait].max()) * 2]
    ax_scatter.loglog(lims, lims, 'w--', linewidth=1, alpha=0.5)
    ax_scatter.set_xlabel('Predicted', color='white', fontsize=8)
    ax_scatter.set_ylabel('Observed', color='white', fontsize=8)
    ax_scatter.set_title(f'{name}\
R2={metrics["r2"]:.3f}, MAPE={metrics["mape"]:.1f}%',
                          color=color, fontsize=9, fontweight='bold')

    # Residual plot
    ax_resid.semilogx(masses, metrics['log_residuals'], 'o', color=color, alpha=0.6, markersize=5)
    ax_resid.axhline(0, color='white', linestyle='--', linewidth=1, alpha=0.5)
    ax_resid.axhline(0.2, color='gray', linestyle=':', alpha=0.3)
    ax_resid.axhline(-0.2, color='gray', linestyle=':', alpha=0.3)
    ax_resid.set_xlabel('Body mass (g)', color='white', fontsize=8)
    ax_resid.set_ylabel('Log residual', color='white', fontsize=8)
    ax_resid.set_title('Residuals (0 = perfect)', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("=== VALIDATION SUMMARY ===")
for trait in trait_info:
    metrics = calc_metrics(pred_data[trait], real_data[trait])
    name = trait_info[trait][0]
    print(f"\
  {name}:")
    print(f"    R2 = {metrics['r2']:.3f}")
    print(f"    MAPE = {metrics['mape']:.1f}%")
    print(f"    Mean log residual = {metrics['log_residuals'].mean():.3f} (0 = unbiased)")
    print(f"    Std log residual = {metrics['log_residuals'].std():.3f}")

# Check for size-dependent bias
print(f"\
  Size-dependent bias check:")
small = masses < 1
large = masses > 100
for trait in trait_info:
    metrics = calc_metrics(pred_data[trait], real_data[trait])
    bias_small = metrics['log_residuals'][small].mean()
    bias_large = metrics['log_residuals'][large].mean()
    print(f"    {trait_info[trait][0]}: small={bias_small:+.3f}, large={bias_large:+.3f}")`,
      challenge: 'Introduce a systematic bias: make tiny frogs (<1g) have 50% higher BMR than predicted (simulating thermal stress). Re-run validation. Can the residual analysis detect this bias?',
      successHint: 'Validation separates useful models from useless ones. An R2 of 0.95 with no size-dependent bias means the model is reliable. Any systematic deviation at extreme sizes flags where the scaling law needs refinement.',
    },
    {
      title: 'Interactive scenario explorer — what-if analysis',
      concept: `The predictor's most valuable application is **what-if analysis**: exploring how changes in body size affect the complete physiological profile. This is especially useful for understanding evolutionary transitions (why did frogs miniaturize?) and conservation scenarios (what happens if habitat degrades?).

Key scenarios:
- **Evolutionary miniaturization**: starting from a 20g ancestor, track how each physiological parameter changes as body size shrinks to 0.01g over evolutionary time
- **Habitat degradation**: how does declining humidity shift the minimum viable body size?
- **Climate change**: warmer temperatures increase metabolic rate and water loss simultaneously
- **Prey availability**: if insect density drops, what is the minimum body size that can sustain itself?

Each scenario reveals different aspects of the size-physiology relationship and helps predict which species are most vulnerable to environmental change.`,
      analogy: 'The what-if explorer is like a flight simulator for body size. Instead of asking "what happens if I pull back on the stick?" you ask "what happens if body mass drops to 0.05g?" and the simulator shows you the consequences for every physiological system simultaneously. You can explore evolutionary trajectories without waiting millions of years.',
      storyConnection: 'NE India\'s miniaturized frogs likely evolved from larger ancestors over millions of years. Your simulator lets you trace this evolutionary path: starting from a typical 20g tree frog, shrink step by step and watch which constraints emerge. The order matters — the first constraint to appear likely drove the key adaptive innovations that made miniaturization possible.',
      checkQuestion: 'As a frog lineage evolves smaller body size, which physiological constraint appears first, and what adaptation might evolve to overcome it?',
      checkAnswer: 'Desiccation appears first (SA:V ratio increases linearly with shrinking). The key adaptation: shift to permanently humid microhabitats (leaf litter, moss, cloud forest). This explains why all miniaturized frogs are found in wet habitats. The second constraint is starvation (metabolic rate per gram increases). Adaptation: shift to energy-rich prey or reduce activity. The third is sensory reduction (brain and ear size approach minimums). Adaptation: paedomorphosis — simplify neural architecture.',
      codeIntro: 'Build the complete scenario explorer with evolutionary trajectory tracking and conservation predictions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# === SCENARIO EXPLORER ===

def full_profile(mass_g):
    """Complete physiological profile for a given body mass."""
    m_kg = mass_g / 1000
    radius_cm = (3 * mass_g / (4 * np.pi * 1.05))**(1/3)

    return {
        'bmr_mW': 3.5 * m_kg**0.75,
        'spec_bmr_mW_g': 3.5 * m_kg**0.75 / mass_g * 1000,
        'heart_bpm': 240 * m_kg**(-0.25),
        'lifespan_yr': 11.8 * m_kg**0.20,
        'brain_pct': 0.1 * m_kg**0.67 / mass_g * 100 * 1000,
        'sa_v': 3 / radius_cm,
        'starv_hr': 0.05 * mass_g/1000 * 37e3 / (3.5 * m_kg**0.75 / 1000 * 3600),
        'food_pct': 3.5 * m_kg**0.75 / 1000 * 86400 / (5 * mass_g / 1000) * 100,
    }

# Scenario 1: Evolutionary miniaturization trajectory
ancestor_mass = 20  # grams
final_mass = 0.01
n_steps = 100
evo_masses = np.logspace(np.log10(ancestor_mass), np.log10(final_mass), n_steps)

evo_profiles = {k: [] for k in full_profile(1).keys()}
for m in evo_masses:
    p = full_profile(m)
    for k in p:
        evo_profiles[k].append(p[k])

# Scenario 2: Habitat degradation (humidity decline)
humidities = np.linspace(0.95, 0.50, 50)
min_viable_masses = []
for h in humidities:
    # Find mass where desiccation survival < 2 hours
    for m in np.logspace(-3, 2, 200):
        radius = (3 * m / (4 * np.pi * 1.05))**(1/3)
        sa = 4 * np.pi * radius**2
        vol = 4/3 * np.pi * radius**3
        water = vol * 0.8 * 1000  # mg
        evap = 0.005 * sa * (1 - h)  # mg/min
        surv = 0.2 * water / max(evap, 1e-10)  # minutes
        if surv > 120:  # 2 hours
            min_viable_masses.append(m)
            break
    else:
        min_viable_masses.append(np.nan)

# Scenario 3: Temperature effect on metabolic demand
temps = [15, 20, 25, 30, 35]
temp_masses = np.logspace(-2, 2, 100)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Body Size Predictor: Scenario Explorer', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Evolutionary trajectory — multi-trait
trait_plot = ['spec_bmr_mW_g', 'sa_v', 'starv_hr', 'food_pct', 'brain_pct', 'heart_bpm']
trait_labels = ['Spec. BMR (mW/g)', 'SA:V (cm^-1)', 'Starv. time (hr)', 'Food (% mass/day)', 'Brain (%)', 'Heart (bpm)']
trait_colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7', '#ec4899']

for i, (trait, label, color) in enumerate(zip(trait_plot[:3], trait_labels[:3], trait_colors[:3])):
    vals = np.array(evo_profiles[trait])
    vals_norm = vals / vals[0]  # normalize to ancestor
    axes[0, 0].semilogx(evo_masses, vals_norm, color=color, linewidth=2, label=label)

axes[0, 0].axhline(1, color='gray', linestyle='--', alpha=0.5)
axes[0, 0].invert_xaxis()
axes[0, 0].set_xlabel('Body mass (g) - evolutionary direction ->', color='white')
axes[0, 0].set_ylabel('Relative to ancestor', color='white')
axes[0, 0].set_title('Evolutionary miniaturization trajectory', color='white', fontsize=10)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: Habitat degradation — minimum viable mass
axes[0, 1].plot(humidities * 100, min_viable_masses, color='#ef4444', linewidth=2.5)
axes[0, 1].fill_between(humidities * 100, min_viable_masses, alpha=0.15, color='#ef4444')
axes[0, 1].axhline(0.01, color='#f59e0b', linestyle='--', label='P. amauensis (0.01g)')
axes[0, 1].axhline(0.1, color='#22c55e', linestyle='--', label='NE India mini (0.1g)')
axes[0, 1].set_xlabel('Humidity (%)', color='white')
axes[0, 1].set_ylabel('Min viable mass (g)', color='white')
axes[0, 1].set_title('Habitat degradation shifts size limit', color='white', fontsize=10)
axes[0, 1].set_yscale('log')
axes[0, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[0, 1].invert_xaxis()

# 3: Temperature sensitivity
for temp in temps:
    # Q10 effect: metabolic rate doubles per 10C increase
    q10_factor = 2.0 ** ((temp - 20) / 10)
    food_need = 3.5 * (temp_masses/1000)**0.75 / 1000 * 86400 * q10_factor / (5 * temp_masses/1000) * 100
    axes[0, 2].semilogx(temp_masses, food_need, linewidth=2, label=f'{temp}C')
axes[0, 2].axhline(30, color='gray', linestyle='--', alpha=0.5, label='Feasible food limit')
axes[0, 2].set_xlabel('Body mass (g)', color='white')
axes[0, 2].set_ylabel('Daily food (% body mass)', color='white')
axes[0, 2].set_title('Temperature effect on food needs', color='white', fontsize=10)
axes[0, 2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4: Complete profile comparison (3 species)
species = {'Tiny frog (0.05g)': 0.05, 'Tree frog (5g)': 5, 'Bullfrog (500g)': 500}
metrics_all = ['spec_bmr_mW_g', 'sa_v', 'food_pct', 'brain_pct']
metric_names = ['Specific BMR', 'SA:V ratio', 'Food need', 'Brain %']

bar_data = []
for sp, mass in species.items():
    p = full_profile(mass)
    bar_data.append([p[m] for m in metrics_all])

# Normalize each metric to max across species
bar_arr = np.array(bar_data)
bar_norm = bar_arr / bar_arr.max(axis=0)

x = np.arange(len(metric_names))
sp_colors = ['#ef4444', '#22c55e', '#3b82f6']
for i, (sp, _) in enumerate(species.items()):
    axes[1, 0].bar(x + i*0.25 - 0.25, bar_norm[i], 0.22, color=sp_colors[i], label=sp, alpha=0.8)
axes[1, 0].set_xticks(x)
axes[1, 0].set_xticklabels(metric_names, fontsize=8, color='white')
axes[1, 0].set_ylabel('Relative value', color='white')
axes[1, 0].set_title('Species comparison (normalized)', color='white', fontsize=10)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5: Conservation vulnerability score
vuln_masses = np.logspace(-2, 3, 100)
vuln_scores = []
for m in vuln_masses:
    p = full_profile(m)
    # Vulnerability = weighted sum of risk factors
    desic_risk = p['sa_v'] / 10  # high SA:V = high risk
    starv_risk = 24 / max(p['starv_hr'], 1)  # fewer hours = higher risk
    food_risk = p['food_pct'] / 50  # higher food need = higher risk
    vuln = 0.4 * desic_risk + 0.3 * starv_risk + 0.3 * food_risk
    vuln_scores.append(min(vuln, 1))

axes[1, 1].semilogx(vuln_masses, vuln_scores, color='#ef4444', linewidth=2.5)
axes[1, 1].fill_between(vuln_masses, vuln_scores, alpha=0.15, color='#ef4444')
axes[1, 1].axhline(0.5, color='#f59e0b', linestyle='--', alpha=0.7, label='High vulnerability')
axes[1, 1].set_xlabel('Body mass (g)', color='white')
axes[1, 1].set_ylabel('Vulnerability score', color='white')
axes[1, 1].set_title('Conservation vulnerability by size', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6: Final summary report
report = "=== BODY SIZE PREDICTOR REPORT ===\
"
for sp, mass in species.items():
    p = full_profile(mass)
    report += f"\
{sp}:\
"
    report += f"  BMR: {p['bmr_mW']:.3f} mW\
"
    report += f"  Heart: {p['heart_bpm']:.0f} bpm\
"
    report += f"  Lifespan: {p['lifespan_yr']:.1f} yr\
"
    report += f"  Starve in: {p['starv_hr']:.1f} hr\
"
    report += f"  Food: {p['food_pct']:.1f}%/day\
"

axes[1, 2].text(0.05, 0.95, report, transform=axes[1, 2].transAxes,
                 fontsize=7, color='#22c55e', family='monospace', verticalalignment='top')
axes[1, 2].set_title('Species profiles', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(report)
print("\
Key insight: the smallest frogs live on a knife edge —")
print("any environmental change (humidity, temperature, prey) can push")
print("them past physiological limits. Conservation must protect not")
print("just the frogs, but the microhabitat conditions they depend on.")`,
      challenge: 'Add a "climate change scenario" that increases temperature by 2C AND reduces humidity by 10%. Calculate the combined effect on the minimum viable body size. Is the shift larger than either factor alone?',
      successHint: 'The scenario explorer transforms scaling laws from academic curiosities into conservation tools. By predicting physiological profiles from body mass alone, it enables rapid vulnerability assessment for any species.',
    },
    {
      title: 'Ensemble predictions with uncertainty',
      concept: `Single-point predictions are misleading because they hide uncertainty. A prediction of "lifespan = 3.5 years" means nothing without knowing whether the 95% confidence interval is 3.0-4.0 years or 1.0-12.0 years. **Uncertainty quantification** is essential for honest science.

Sources of uncertainty in allometric predictions:
1. **Parameter uncertainty**: the scaling coefficient and exponent are estimated from data with error bars
2. **Species-specific variation**: some species deviate from the general trend due to unique adaptations
3. **Measurement error**: body mass itself may be imprecisely measured (especially for tiny frogs)
4. **Model uncertainty**: the power law may not be the correct functional form for all size ranges

We handle these with **Monte Carlo simulation**: sample parameters from their probability distributions, run the prediction many times, and report the distribution of outcomes rather than a single number. This gives us prediction intervals that honestly represent what we know and do not know.`,
      analogy: 'Ensemble prediction with uncertainty is like a weather forecast that says "tomorrow: 20-25C, 60% chance of rain" instead of "tomorrow: 22.5C, no rain." The range and probability are more useful than a single number because they let you plan for multiple outcomes. Your predictor should do the same: "this frog\'s lifespan is 2-6 years (95% CI)" is more useful than "3.5 years."',
      storyConnection: 'When NE India conservation planners assess a newly discovered miniaturized frog, they need to know not just the expected lifespan or metabolic rate, but the range of plausible values. A frog with predicted starvation time of "8-24 hours (95% CI)" needs different habitat protection than one with "2-8 hours." Uncertainty quantification directly influences conservation decisions.',
      checkQuestion: 'You run 1000 Monte Carlo simulations for a 0.05g frog\'s metabolic rate. The distribution is log-normal with mean 0.8 mW and 95% CI of 0.4-1.6 mW. A measured value of 1.5 mW falls within the CI. Is the scaling law "correct" for this species?',
      checkAnswer: 'The measured value (1.5 mW) falls within the 95% CI (0.4-1.6), so the scaling law is consistent with this species at the 95% confidence level. However, 1.5 mW is near the upper boundary — the species may have a genuinely elevated metabolic rate. You would need multiple measurements to distinguish random variation from a systematic deviation. One measurement cannot confirm or reject a scaling law.',
      codeIntro: 'Implement Monte Carlo ensemble predictions with full uncertainty quantification.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Monte Carlo ensemble predictions

class EnsemblePredictor:
    """Allometric predictor with uncertainty quantification."""

    # Parameters: (mean_a, std_a, mean_b, std_b, residual_scatter)
    PARAMS = {
        'bmr':       (3.5, 0.3, 0.75, 0.02, 0.12),
        'heart_rate': (240, 20, -0.25, 0.01, 0.08),
        'lifespan':  (11.8, 2.0, 0.20, 0.03, 0.20),
        'brain':     (0.1, 0.01, 0.67, 0.02, 0.10),
    }
    UNITS = {'bmr': 'mW', 'heart_rate': 'bpm', 'lifespan': 'years', 'brain': 'g'}
    NAMES = {'bmr': 'Metabolic rate', 'heart_rate': 'Heart rate', 'lifespan': 'Lifespan', 'brain': 'Brain mass'}

    def predict_ensemble(self, mass_g, n_samples=1000):
        """Generate ensemble of predictions for each trait."""
        m_kg = mass_g / 1000
        results = {}

        for trait, (a_mu, a_std, b_mu, b_std, scatter) in self.PARAMS.items():
            # Sample parameters
            a_samples = np.random.lognormal(np.log(a_mu), a_std/a_mu, n_samples)
            b_samples = np.random.normal(b_mu, b_std, n_samples)

            # Generate predictions with residual scatter
            predictions = a_samples * m_kg**b_samples * 10**np.random.normal(0, scatter, n_samples)

            results[trait] = {
                'samples': predictions,
                'mean': np.mean(predictions),
                'median': np.median(predictions),
                'ci_2_5': np.percentile(predictions, 2.5),
                'ci_97_5': np.percentile(predictions, 97.5),
                'ci_10': np.percentile(predictions, 10),
                'ci_90': np.percentile(predictions, 90),
                'std': np.std(predictions),
                'cv': np.std(predictions) / np.mean(predictions) * 100,
            }
        return results

ep = EnsemblePredictor()

# Test three species
test_species = {
    'Tiny frog (0.05g)': 0.05,
    'Tree frog (5g)': 5.0,
    'Bullfrog (500g)': 500.0,
}

fig, axes = plt.subplots(2, 4, figsize=(18, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Ensemble Predictions with Uncertainty', color='white', fontsize=14, fontweight='bold')

colors = {'Tiny frog (0.05g)': '#ef4444', 'Tree frog (5g)': '#22c55e', 'Bullfrog (500g)': '#3b82f6'}

for idx, trait in enumerate(ep.PARAMS):
    ax = axes[0, idx]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    for sp, mass in test_species.items():
        result = ep.predict_ensemble(mass)
        samples = result[trait]['samples']
        ax.hist(samples, bins=40, alpha=0.5, color=colors[sp], density=True, label=sp)
        ax.axvline(result[trait]['median'], color=colors[sp], linestyle='--', linewidth=1.5)

    ax.set_xlabel(f'{ep.NAMES[trait]} ({ep.UNITS[trait]})', color='white', fontsize=8)
    ax.set_ylabel('Density', color='white', fontsize=8)
    ax.set_title(ep.NAMES[trait], color='white', fontsize=10)
    if idx == 0:
        ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Row 2: Prediction bands across body size range
masses_sweep = np.logspace(-2, 3, 80)
for idx, trait in enumerate(ep.PARAMS):
    ax = axes[1, idx]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    medians, lo95, hi95, lo80, hi80 = [], [], [], [], []
    for m in masses_sweep:
        r = ep.predict_ensemble(m, n_samples=500)
        t = r[trait]
        medians.append(t['median'])
        lo95.append(t['ci_2_5'])
        hi95.append(t['ci_97_5'])
        lo80.append(t['ci_10'])
        hi80.append(t['ci_90'])

    ax.fill_between(masses_sweep, lo95, hi95, alpha=0.1, color='#22c55e', label='95% CI')
    ax.fill_between(masses_sweep, lo80, hi80, alpha=0.2, color='#22c55e', label='80% CI')
    ax.loglog(masses_sweep, medians, color='#22c55e', linewidth=2.5, label='Median')

    ax.set_xlabel('Body mass (g)', color='white', fontsize=8)
    ax.set_ylabel(f'{ep.UNITS[trait]}', color='white', fontsize=8)
    ax.set_title(f'{ep.NAMES[trait]} prediction band', color='white', fontsize=9)
    if idx == 0:
        ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Detailed report
print("=== ENSEMBLE PREDICTION REPORT ===")
for sp, mass in test_species.items():
    result = ep.predict_ensemble(mass, n_samples=5000)
    print(f"\
{sp} ({mass}g):")
    for trait in ep.PARAMS:
        t = result[trait]
        print(f"  {ep.NAMES[trait]:<20}: {t['median']:.3f} {ep.UNITS[trait]}  "
              f"(95% CI: {t['ci_2_5']:.3f}-{t['ci_97_5']:.3f}, CV={t['cv']:.1f}%)")

print(f"\
Smaller species have WIDER confidence intervals (higher CV)")
print(f"because scaling laws are less well-calibrated at extreme sizes.")
print(f"This uncertainty must be reported alongside any prediction.")`,
      challenge: 'Add a "measurement error" parameter: body mass itself is uncertain (e.g., +/- 10% for field measurements). Sample mass from a distribution and propagate this through all predictions. How much does mass uncertainty contribute to total prediction uncertainty?',
      successHint: 'Uncertainty quantification is what separates science from guessing. Every prediction should come with error bars. The Monte Carlo approach works for any model, no matter how complex — just sample and count.',
    },
    {
      title: 'Capstone finale — conservation vulnerability assessment',
      concept: `Your Body Size Predictor is now a complete tool. In this final lesson, you apply it to a real conservation question: **which amphibian species in NE India are most vulnerable to climate change, based on their body size alone?**

The assessment combines:
1. **Physiological predictions** from body mass (metabolic rate, water balance, food needs)
2. **Environmental sensitivity** (how changes in temperature and humidity affect each size class)
3. **Population vulnerability** (smaller species have lower population densities and higher extinction risk)
4. **Adaptive capacity** (larger species have more physiological buffer against environmental change)

The output is a **vulnerability ranking** for each species/size class, with specific conservation recommendations: which habitats to protect, what microclimatic conditions to maintain, and which species need monitoring most urgently.

This is precisely how conservation biologists use scaling biology: body mass predicts vulnerability because it determines the physiological constraints an organism faces. Your simulator automates this reasoning.`,
      analogy: 'The vulnerability assessment is like a triage system in an emergency room. Instead of treating every patient the same, you assess who is most critical (smallest frogs with highest SA:V ratios), who needs urgent care (medium frogs in degrading habitat), and who is stable (large species with physiological buffers). Resources go where they are needed most.',
      storyConnection: 'NE India faces rapid environmental change: deforestation, altered monsoon patterns, and warming temperatures. The region hosts dozens of miniaturized frog species, each living at the edge of physiological viability. Your vulnerability assessment identifies which species are most at risk and what specific conditions must be maintained to ensure their survival. This is conservation biology informed by physics.',
      checkQuestion: 'Your assessment ranks a 0.1g species as "critically vulnerable" and a 50g species as "low vulnerability." A conservation manager asks: "Can we just move the small frogs to a protected area?" What is your response?',
      checkAnswer: 'It is not that simple. The 0.1g species requires very specific microclimatic conditions: >90% humidity, stable temperature (22-28C), abundant tiny invertebrates. A "protected area" that does not maintain these conditions is useless. You need to protect the specific microhabitat (moss, leaf litter, canopy structure) that creates the right microclimate. Translocation would require replicating these conditions exactly. It is usually easier to protect the existing habitat than to create new habitat for miniaturized species.',
      codeIntro: 'Build the complete conservation vulnerability assessment for NE India amphibians.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# === CONSERVATION VULNERABILITY ASSESSMENT ===

# Simulated species data for NE India amphibians
species_db = {
    'Nyctibatrachus minimus': {'mass_g': 0.08, 'habitat': 'Cloud forest', 'elevation': 1500},
    'Raorchestes sp. nov.': {'mass_g': 0.15, 'habitat': 'Montane forest', 'elevation': 1800},
    'Microhyla ornata': {'mass_g': 0.8, 'habitat': 'Leaf litter', 'elevation': 800},
    'Philautus sp.': {'mass_g': 0.5, 'habitat': 'Epiphytic', 'elevation': 1200},
    'Polypedates maculatus': {'mass_g': 8, 'habitat': 'Forest edge', 'elevation': 500},
    'Rhacophorus bipunctatus': {'mass_g': 12, 'habitat': 'Canopy', 'elevation': 1000},
    'Hoplobatrachus tigerinus': {'mass_g': 250, 'habitat': 'Wetland', 'elevation': 200},
    'Duttaphrynus melanostictus': {'mass_g': 45, 'habitat': 'Generalist', 'elevation': 400},
    'Amolops sp.': {'mass_g': 3, 'habitat': 'Stream', 'elevation': 1400},
    'Megophrys sp.': {'mass_g': 15, 'habitat': 'Forest floor', 'elevation': 1600},
}

def vulnerability_score(mass_g, elevation, climate_change_c=2, humidity_loss=0.10):
    """Calculate composite vulnerability score (0-1, higher = more vulnerable)."""
    m_kg = mass_g / 1000

    # 1. Physiological vulnerability (from body size)
    radius = (3 * mass_g / (4 * np.pi * 1.05))**(1/3)
    sa_v = 3 / radius
    desic_vuln = min(1, sa_v / 8)  # normalize: SA:V > 8 = max vulnerability

    # Starvation vulnerability
    bmr = 3.5 * m_kg**0.75
    fat_energy = 0.05 * m_kg * 37e3
    starv_hr = fat_energy / (bmr / 1000 * 3600)
    starv_vuln = min(1, 24 / max(starv_hr, 1))

    # 2. Climate sensitivity
    # Q10 metabolic increase from warming
    q10_increase = 2 ** (climate_change_c / 10) - 1  # fractional increase
    climate_vuln = min(1, q10_increase * 3)  # amplified at small sizes

    # Humidity loss effect (scales with SA:V)
    humid_vuln = min(1, humidity_loss * sa_v * 2)

    # 3. Population vulnerability (smaller species = rarer)
    pop_density = 120 * m_kg**(-0.75)  # individuals per km2
    # But small species have small ranges
    range_km2 = 0.024 * m_kg**1.02 * 1000  # approximate
    total_pop = pop_density * range_km2
    pop_vuln = min(1, 1000 / max(total_pop, 1))  # <1000 individuals = max vulnerability

    # 4. Elevation risk (montane species face range squeeze)
    elev_vuln = min(1, max(0, (elevation - 800) / 2000))  # higher = more squeezed

    # Composite score (weighted)
    composite = (0.25 * desic_vuln + 0.20 * starv_vuln + 0.20 * climate_vuln +
                 0.15 * humid_vuln + 0.10 * pop_vuln + 0.10 * elev_vuln)

    return {
        'composite': composite,
        'desiccation': desic_vuln,
        'starvation': starv_vuln,
        'climate': climate_vuln,
        'humidity': humid_vuln,
        'population': pop_vuln,
        'elevation': elev_vuln,
    }

# Calculate for all species
results = {}
for sp, info in species_db.items():
    results[sp] = vulnerability_score(info['mass_g'], info['elevation'])

# Sort by vulnerability
sorted_species = sorted(results.items(), key=lambda x: x[1]['composite'], reverse=True)

fig, axes = plt.subplots(2, 3, figsize=(16, 11))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('NE India Amphibian Vulnerability Assessment', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Overall vulnerability ranking
sp_names = [s[0].split(' ')[0][:8] for s in sorted_species]
scores = [s[1]['composite'] for s in sorted_species]
colors_bar = ['#ef4444' if s > 0.6 else '#f59e0b' if s > 0.4 else '#22c55e' for s in scores]
axes[0, 0].barh(range(len(sp_names)), scores, color=colors_bar, alpha=0.8)
axes[0, 0].set_yticks(range(len(sp_names)))
axes[0, 0].set_yticklabels(sp_names, fontsize=8, color='white')
axes[0, 0].set_xlabel('Vulnerability score', color='white')
axes[0, 0].set_title('Species vulnerability ranking', color='white', fontsize=10)
axes[0, 0].axvline(0.6, color='#ef4444', linestyle='--', alpha=0.7, label='Critical')
axes[0, 0].axvline(0.4, color='#f59e0b', linestyle='--', alpha=0.7, label='High')
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: Vulnerability components (stacked)
components = ['desiccation', 'starvation', 'climate', 'humidity', 'population', 'elevation']
comp_colors = ['#3b82f6', '#ef4444', '#f59e0b', '#06b6d4', '#a855f7', '#22c55e']
bottom = np.zeros(len(sorted_species))
for comp, color in zip(components, comp_colors):
    vals = [s[1][comp] * [0.25, 0.20, 0.20, 0.15, 0.10, 0.10][components.index(comp)]
            for s in sorted_species]
    axes[0, 1].barh(range(len(sp_names)), vals, left=bottom, color=color, alpha=0.8, label=comp[:7])
    bottom += vals
axes[0, 1].set_yticks(range(len(sp_names)))
axes[0, 1].set_yticklabels(sp_names, fontsize=8, color='white')
axes[0, 1].set_xlabel('Weighted vulnerability', color='white')
axes[0, 1].set_title('Vulnerability breakdown', color='white', fontsize=10)
axes[0, 1].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3: Mass vs vulnerability scatter
masses_all = [species_db[s[0]]['mass_g'] for s in sorted_species]
vuln_all = [s[1]['composite'] for s in sorted_species]
axes[0, 2].scatter(masses_all, vuln_all, c=vuln_all, cmap='RdYlGn_r', s=100,
                    edgecolors='white', linewidths=0.5, zorder=5)
for i, (sp, _) in enumerate(sorted_species):
    axes[0, 2].annotate(sp.split(' ')[0][:6], (masses_all[i], vuln_all[i]),
                          fontsize=6, color='white', xytext=(5, 3), textcoords='offset points')
axes[0, 2].set_xscale('log')
axes[0, 2].set_xlabel('Body mass (g)', color='white')
axes[0, 2].set_ylabel('Vulnerability score', color='white')
axes[0, 2].set_title('Size predicts vulnerability', color='white', fontsize=10)

# 4: Climate change sensitivity (different warming levels)
warming_levels = [1, 2, 3, 4]
vuln_by_warming = {sp: [] for sp in species_db}
for w in warming_levels:
    for sp, info in species_db.items():
        v = vulnerability_score(info['mass_g'], info['elevation'], climate_change_c=w)
        vuln_by_warming[sp].append(v['composite'])

for sp in list(species_db.keys())[:5]:
    color = '#ef4444' if species_db[sp]['mass_g'] < 1 else '#22c55e'
    axes[1, 0].plot(warming_levels, vuln_by_warming[sp], 'o-', color=color, linewidth=1.5,
                     label=sp.split(' ')[0][:8], alpha=0.7)
axes[1, 0].set_xlabel('Warming (C)', color='white')
axes[1, 0].set_ylabel('Vulnerability', color='white')
axes[1, 0].set_title('Climate change scenarios', color='white', fontsize=10)
axes[1, 0].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5: Habitat recommendations
hab_data = {}
for sp, info in species_db.items():
    h = info['habitat']
    v = results[sp]['composite']
    if h not in hab_data:
        hab_data[h] = {'count': 0, 'max_vuln': 0, 'total_vuln': 0}
    hab_data[h]['count'] += 1
    hab_data[h]['max_vuln'] = max(hab_data[h]['max_vuln'], v)
    hab_data[h]['total_vuln'] += v

habs = list(hab_data.keys())
max_vulns = [hab_data[h]['max_vuln'] for h in habs]
sorted_h = np.argsort(max_vulns)[::-1]
axes[1, 1].barh(range(len(habs)), [max_vulns[i] for i in sorted_h],
                  color=['#ef4444' if v > 0.5 else '#f59e0b' if v > 0.3 else '#22c55e' for v in [max_vulns[i] for i in sorted_h]],
                  alpha=0.8)
axes[1, 1].set_yticks(range(len(habs)))
axes[1, 1].set_yticklabels([habs[i] for i in sorted_h], fontsize=8, color='white')
axes[1, 1].set_xlabel('Max species vulnerability', color='white')
axes[1, 1].set_title('Priority habitats for protection', color='white', fontsize=10)

# 6: Conservation report
n_critical = sum(1 for s in sorted_species if s[1]['composite'] > 0.6)
n_high = sum(1 for s in sorted_species if 0.4 < s[1]['composite'] <= 0.6)
n_moderate = sum(1 for s in sorted_species if s[1]['composite'] <= 0.4)

report = f"CONSERVATION ASSESSMENT\
{'='*40}\
"
report += f"Species assessed: {len(species_db)}\
"
report += f"Critical: {n_critical} | High: {n_high} | Moderate: {n_moderate}\
\
"
report += "PRIORITY ACTIONS:\
"
report += "1. Protect cloud forest humidity\
"
report += "   (critical for species <1g)\
"
report += "2. Maintain canopy cover\
"
report += "   (buffers temperature extremes)\
"
report += "3. Monitor insect populations\
"
report += "   (prey base for all species)\
"
report += "4. Establish humidity refugia\
"
report += "   at 1200-2000m elevation\
"

axes[1, 2].text(0.05, 0.95, report, transform=axes[1, 2].transAxes,
                 fontsize=8, color='#22c55e', family='monospace', verticalalignment='top')
axes[1, 2].set_title('Conservation recommendations', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("=== FINAL VULNERABILITY REPORT ===")
for sp, v in sorted_species:
    mass = species_db[sp]['mass_g']
    level = 'CRITICAL' if v['composite'] > 0.6 else 'HIGH' if v['composite'] > 0.4 else 'MODERATE'
    print(f"  [{level:>8}] {sp:<30} {mass:>8.2f}g  vuln={v['composite']:.2f}")

print(f"\
Body mass is the strongest predictor of vulnerability.")
print(f"Protecting microhabitat conditions (humidity, temperature)")
print(f"is more important than protecting area for miniaturized species.")`,
      challenge: 'Extend the assessment to include an "adaptive capacity" metric: species with wider geographic ranges (from IUCN data) can shift their distribution in response to climate change. How does range size modify vulnerability?',
      successHint: 'You built a complete conservation tool from allometric scaling laws. From a single measurement (body mass) you can predict physiological vulnerability, identify limiting constraints, and recommend conservation actions. This is the power of scaling biology applied to real-world problems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Body Size Predictor
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Model physiology from body mass using scaling laws</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete body size prediction system. Click to load Python.</p>
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
