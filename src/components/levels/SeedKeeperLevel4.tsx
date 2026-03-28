import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function SeedKeeperLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Capstone: Seed Viability Predictor — building the model',
      concept: `Your capstone builds a **Seed Viability Predictor** that models germination probability as a function of storage time, temperature, and moisture content. This is the exact tool used by gene bank managers worldwide to decide when to regenerate their seed collections.

The model is based on the **Ellis-Roberts probit viability equation**:
v = Ki + p/sigma, where:
- v is the probit of viability (inverse normal CDF of germination fraction)
- Ki is the initial seed quality (probit of initial viability)
- p is the storage period
- sigma is the time constant: log(sigma) = KE - Cw*log(m) - Ch*T - Cq*T^2

The constants KE, Cw, Ch, Cq are species-specific and must be calibrated from germination test data. Your predictor will:
1. Accept species-specific parameters
2. Predict viability at any time/temperature/moisture combination
3. Generate viability contour maps
4. Recommend optimal storage conditions
5. Alert when viability drops below regeneration threshold (typically 85%)`,
      analogy: 'The viability predictor is like a weather forecast for seeds — it predicts the future state (alive or dead) based on current conditions (temperature, moisture) and time. Just as weather models use physics equations calibrated with data, the viability model uses biochemical equations calibrated with germination tests.',
      storyConnection: 'The seed keeper tested her seeds every spring — placing a handful in wet cloth and counting how many sprouted. She was doing germination testing, the empirical basis of our model. Our predictor automates what she did by hand and extends it across decades of storage.',
      checkQuestion: 'The Ellis-Roberts equation uses a probit (inverse normal CDF) transformation. Why probit and not a simple percentage? What advantage does this give?',
      checkAnswer: 'Probit transformation linearizes the relationship between storage time and viability. On a probit scale, viability decreases linearly with time (a straight line), making it easy to fit, extrapolate, and compare across species. On a percentage scale, the relationship is sigmoidal — harder to work with mathematically. The probit model also naturally handles the biological reality that seed populations have normally distributed individual lifespans.',
      codeIntro: 'Build the complete seed viability predictor with calibration, prediction, and visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erf, sqrt

np.random.seed(42)

def probit(p):
    """Inverse of the normal CDF (probit function). Approximate."""
    p = np.clip(p, 1e-10, 1 - 1e-10)
    # Rational approximation
    a = 8 * (np.pi - 3) / (3 * np.pi * (4 - np.pi))
    x = 2 * p - 1
    ln_term = np.log(1 - x**2)
    term1 = 2 / (np.pi * a) + ln_term / 2
    result = np.sign(x) * np.sqrt(np.sqrt(term1**2 - ln_term / a) - term1)
    return result * np.sqrt(2)

def normal_cdf(x):
    """Normal CDF."""
    return 0.5 * (1 + np.vectorize(erf)(x / sqrt(2)))

class SeedViabilityPredictor:
    """Ellis-Roberts seed viability model."""

    def __init__(self, species, KE, Cw, Ch, Cq, Ki=2.0):
        self.species = species
        self.KE = KE; self.Cw = Cw; self.Ch = Ch; self.Cq = Cq
        self.Ki = Ki  # initial quality (probit units)

    def sigma(self, temp_c, moisture_pct):
        """Time constant (time for viability to drop 1 probit unit)."""
        log_sigma = self.KE - self.Cw * np.log10(np.maximum(moisture_pct, 1)) - self.Ch * temp_c - self.Cq * temp_c**2
        return 10**np.clip(log_sigma, -2, 10)

    def predict(self, time_years, temp_c, moisture_pct):
        """Predict germination fraction."""
        s = self.sigma(temp_c, moisture_pct)
        v = self.Ki - time_years / np.maximum(s, 0.001)
        return np.clip(normal_cdf(v), 0, 1)

    def time_to_threshold(self, temp_c, moisture_pct, threshold=0.85):
        """Years until viability drops to threshold."""
        s = self.sigma(temp_c, moisture_pct)
        v_threshold = probit(threshold)
        time = (self.Ki - v_threshold) * s
        return max(0, time)

# Define species
species_db = {
    'Rice':   SeedViabilityPredictor('Rice', 9.0, 4.5, 0.040, 0.000150),
    'Wheat':  SeedViabilityPredictor('Wheat', 8.5, 4.0, 0.040, 0.000140),
    'Tomato': SeedViabilityPredictor('Tomato', 7.5, 3.8, 0.040, 0.000160),
    'Onion':  SeedViabilityPredictor('Onion', 5.5, 3.0, 0.060, 0.000250),
    'Lettuce': SeedViabilityPredictor('Lettuce', 6.0, 3.5, 0.050, 0.000200),
}

# Generate viability contour maps
temps = np.linspace(-20, 40, 100)
moistures = np.linspace(3, 18, 100)
T_grid, M_grid = np.meshgrid(temps, moistures)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Viability over time for rice at different conditions
ax = axes[0, 0]
time_range = np.linspace(0, 50, 200)
conditions = [
    ('Room (25°C, 12%)', 25, 12, '#ef4444'),
    ('Cool (15°C, 8%)', 15, 8, '#f59e0b'),
    ('Gene bank (5°C, 5%)', 5, 5, '#3b82f6'),
    ('Svalbard (-18°C, 5%)', -18, 5, '#22c55e'),
]
model = species_db['Rice']
for label, t, m, color in conditions:
    viab = [model.predict(yr, t, m) * 100 for yr in time_range]
    ax.plot(time_range, viab, color=color, linewidth=2, label=label)
ax.axhline(85, color='gray', linestyle=':', label='Regen threshold (85%)')
ax.set_xlabel('Years in storage', color='white')
ax.set_ylabel('Germination (%)', color='white')
ax.set_title('Rice Viability Predictions', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Contour map — time to 85% for rice
ax = axes[0, 1]
time_to_85 = np.vectorize(model.time_to_threshold)(T_grid, M_grid, 0.85)
time_to_85 = np.clip(time_to_85, 0, 500)
contour = ax.contourf(T_grid, M_grid, time_to_85, levels=20, cmap='viridis')
plt.colorbar(contour, ax=ax, label='Years to 85% viability')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Moisture content (%)', color='white')
ax.set_title('Rice: Years Until Regeneration Needed', color='white', fontsize=10)
# Mark optimal zone
ax.plot(-18, 5, '*', color='white', markersize=15, label='Svalbard')
ax.plot(5, 5, 'o', color='white', markersize=10, label='Gene bank')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Species comparison at gene bank conditions
ax = axes[0, 2]
time_long = np.linspace(0, 200, 500)
for sp_name, model_sp in species_db.items():
    viab = [model_sp.predict(yr, 5, 5) * 100 for yr in time_long]
    ax.plot(time_long, viab, linewidth=2, label=sp_name)
ax.axhline(85, color='gray', linestyle=':', label='85% threshold')
ax.set_xlabel('Years at 5°C, 5% moisture', color='white')
ax.set_ylabel('Germination (%)', color='white')
ax.set_title('Species Comparison (Gene Bank)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Regeneration schedule
ax = axes[1, 0]
for sp_name, model_sp in species_db.items():
    t85 = model_sp.time_to_threshold(5, 5, 0.85)
    ax.barh(sp_name, t85, color='#3b82f6', edgecolor='none')
    ax.text(t85 + 1, sp_name, f'{t85:.0f} yr', va='center', color='white', fontsize=9)
ax.set_xlabel('Years until regeneration needed', color='white')
ax.set_title('Regeneration Schedule (5°C, 5%)', color='white', fontsize=11)

# Plot 5: Sensitivity — temperature vs moisture importance
ax = axes[1, 1]
base_t85 = model.time_to_threshold(5, 5, 0.85)
# Vary temperature
temp_range = np.linspace(-20, 30, 50)
t85_by_temp = [model.time_to_threshold(t, 5, 0.85) for t in temp_range]
# Vary moisture
moist_range = np.linspace(3, 15, 50)
t85_by_moist = [model.time_to_threshold(5, m, 0.85) for m in moist_range]

ax.plot(temp_range, t85_by_temp, color='#ef4444', linewidth=2, label='Varying temp (moisture=5%)')
ax.set_xlabel('Temperature (°C) / Moisture (%)', color='white')
ax.set_ylabel('Years to 85%', color='white')
ax2 = ax.twiny()
ax2.plot(moist_range, t85_by_moist, color='#3b82f6', linewidth=2, label='Varying moisture (temp=5°C)')
ax2.set_xlabel('Moisture (%)', color='#3b82f6')
ax.set_title('Sensitivity Analysis', color='white', fontsize=11)
ax.legend(fontsize=8, loc='upper right', facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 6: Practical recommendations
ax = axes[1, 2]
ax.axis('off')
regen_times = {sp: m.time_to_threshold(5, 5, 0.85) for sp, m in species_db.items()}
sorted_species = sorted(regen_times.items(), key=lambda x: x[1])

text = "Seed Viability Predictor — Recommendations\\n"
text += "=" * 45 + "\\n\\n"
text += "Storage: 5°C, 5% moisture (gene bank standard)\\n\\n"
text += f"{'Species':<12} {'Regen at':<12} {'Next test':<12}\\n"
text += "-" * 36 + "\\n"
for sp, years in sorted_species:
    test_interval = max(5, years // 4)
    text += f"{sp:<12} {years:>6.0f} yr    every {test_interval:.0f} yr\\n"
text += "\\nSvalbard (-18°C, 5% moisture):\\n"
for sp, m in species_db.items():
    t85_sv = m.time_to_threshold(-18, 5, 0.85)
    text += f"  {sp}: {t85_sv:.0f} years\\n"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Seed Viability Predictor built and calibrated.")
print("\\nPredicted storage life at gene bank conditions (5°C, 5%):")
for sp, m in species_db.items():
    t85 = m.time_to_threshold(5, 5, 0.85)
    print(f"  {sp:10s}: {t85:.0f} years until regeneration needed")`,
      challenge: 'Add a "monitoring schedule optimizer": given a collection of 1000 accessions across 5 species, design the minimum number of germination tests per year that ensures no accession drops below 85% without being caught. This is a real gene bank management problem.',
      successHint: 'You have built a professional seed viability predictor — the same tool used by CGIAR, USDA, and national gene banks worldwide. The model translates biochemistry into practical management decisions.',
    },
    {
      title: 'Capstone: Monte Carlo risk analysis — when will our seeds die?',
      concept: `Real seed lots have variability — initial quality differs between harvests, storage conditions fluctuate, and the model parameters themselves have uncertainty. A deterministic prediction ("this lot lasts 87 years") gives false precision. We need **probabilistic predictions**.

Monte Carlo analysis adds randomness to the model inputs:
- Initial quality Ki varies between lots (normal distribution, mean 2.0, sd 0.3)
- Temperature fluctuates (±2°C around set point due to equipment variation)
- Moisture varies (±1% due to measurement error and equilibration)
- Model parameters have calibration uncertainty (±10%)

By running the model thousands of times with random perturbations, we get a **distribution of outcomes** rather than a single number. From this distribution we extract:
- Mean predicted lifespan
- Confidence intervals (e.g., 90% CI: "we are 90% confident viability exceeds 85% for at least X years")
- Risk quantification: "probability of falling below 85% in Y years is Z%"

This is how modern gene banks manage risk — they do not ask "when will it die?" but "what is the probability it is still viable?"`,
      analogy: 'Monte Carlo analysis is like predicting the weather. Instead of saying "it will be 25°C tomorrow" (which is always wrong), you say "there is a 70% chance of 23-27°C and a 5% chance of rain." The prediction acknowledges uncertainty and gives actionable probabilities.',
      storyConnection: 'The seed keeper did not know exactly how long each seed batch would last — but she knew from experience that some batches lasted longer than others. Her rule was conservative: always replant before you think you need to. Monte Carlo analysis formalizes this intuition into quantitative risk management.',
      checkQuestion: 'A gene bank manager gets a Monte Carlo result: "90% probability that rice viability exceeds 85% for at least 35 years." Should they schedule regeneration at year 35, year 30, or year 25?',
      checkAnswer: 'Year 25. The 90% confidence means 10% of scenarios fall below 85% before year 35 — that is a 1-in-10 chance of losing the accession. Gene banks typically add a safety margin of 25-30%, so testing at year 25 and regenerating if needed provides a comfortable buffer. In conservation, the cost of losing an irreplaceable accession far outweighs the cost of early regeneration.',
      codeIntro: 'Run Monte Carlo risk analysis on the seed viability predictor and generate probabilistic management recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erf, sqrt

np.random.seed(42)

def normal_cdf(x):
    return 0.5 * (1 + np.vectorize(erf)(x / sqrt(2)))

def predict_viability(time_yr, temp_c, moisture_pct, KE, Cw, Ch, Cq, Ki):
    log_sigma = KE - Cw * np.log10(max(moisture_pct, 1)) - Ch * temp_c - Cq * temp_c**2
    sigma = 10**np.clip(log_sigma, -2, 10)
    v = Ki - time_yr / max(sigma, 0.001)
    return np.clip(normal_cdf(v), 0, 1)

# Monte Carlo parameters for rice
n_mc = 3000
years_range = np.arange(0, 101)

# Nominal conditions
nominal = {'KE': 9.0, 'Cw': 4.5, 'Ch': 0.040, 'Cq': 0.000150, 'Ki': 2.0,
           'temp': 5.0, 'moisture': 5.0}

# Uncertainty ranges (standard deviations)
uncertainty = {'KE': 0.3, 'Cw': 0.2, 'Ch': 0.003, 'Cq': 0.00002, 'Ki': 0.3,
               'temp': 1.5, 'moisture': 0.8}

# Run Monte Carlo
mc_viabilities = np.zeros((n_mc, len(years_range)))

for i in range(n_mc):
    # Sample parameters
    KE = np.random.normal(nominal['KE'], uncertainty['KE'])
    Cw = np.random.normal(nominal['Cw'], uncertainty['Cw'])
    Ch = np.random.normal(nominal['Ch'], uncertainty['Ch'])
    Cq = np.random.normal(nominal['Cq'], uncertainty['Cq'])
    Ki = np.random.normal(nominal['Ki'], uncertainty['Ki'])
    temp = np.random.normal(nominal['temp'], uncertainty['temp'])
    moist = np.random.normal(nominal['moisture'], uncertainty['moisture'])
    moist = max(moist, 2)

    for j, yr in enumerate(years_range):
        mc_viabilities[i, j] = predict_viability(yr, temp, moist, KE, Cw, Ch, Cq, Ki)

# Compute statistics
mean_viab = np.mean(mc_viabilities, axis=0)
p5 = np.percentile(mc_viabilities, 5, axis=0)
p25 = np.percentile(mc_viabilities, 25, axis=0)
p75 = np.percentile(mc_viabilities, 75, axis=0)
p95 = np.percentile(mc_viabilities, 95, axis=0)

# Risk: probability of being below 85% at each year
risk_85 = np.mean(mc_viabilities < 0.85, axis=0)

# Time to threshold for each MC run
time_to_85 = []
for i in range(n_mc):
    below_idx = np.where(mc_viabilities[i] < 0.85)[0]
    if len(below_idx) > 0:
        time_to_85.append(years_range[below_idx[0]])
    else:
        time_to_85.append(100)
time_to_85 = np.array(time_to_85)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Viability fan chart
ax = axes[0, 0]
ax.fill_between(years_range, p5 * 100, p95 * 100, alpha=0.15, color='#3b82f6', label='90% CI')
ax.fill_between(years_range, p25 * 100, p75 * 100, alpha=0.3, color='#3b82f6', label='50% CI')
ax.plot(years_range, mean_viab * 100, color='#22c55e', linewidth=2, label='Mean')
ax.axhline(85, color='#f59e0b', linestyle='--', linewidth=1.5, label='85% threshold')
ax.set_xlabel('Years in storage', color='white')
ax.set_ylabel('Germination (%)', color='white')
ax.set_title('Rice Viability Fan Chart (5°C, 5%)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Risk curve
ax = axes[0, 1]
ax.plot(years_range, risk_85 * 100, color='#ef4444', linewidth=2)
ax.fill_between(years_range, 0, risk_85 * 100, alpha=0.15, color='#ef4444')
ax.axhline(10, color='#f59e0b', linestyle='--', label='10% risk tolerance')
# Find year where risk crosses 10%
risk_10_year = years_range[np.searchsorted(risk_85, 0.10)]
ax.axvline(risk_10_year, color='#f59e0b', linestyle=':', alpha=0.5)
ax.annotate(f'Year {risk_10_year}: 10% risk', xy=(risk_10_year, 10),
            xytext=(risk_10_year + 10, 30), color='#f59e0b', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax.set_xlabel('Years in storage', color='white')
ax.set_ylabel('Risk of < 85% viability (%)', color='white')
ax.set_title('Risk Curve', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Distribution of time to threshold
ax = axes[0, 2]
ax.hist(time_to_85, bins=40, color='#3b82f6', edgecolor='none', alpha=0.7)
ax.axvline(np.mean(time_to_85), color='#22c55e', linewidth=2, linestyle='--',
           label=f'Mean: {np.mean(time_to_85):.0f} yr')
ax.axvline(np.percentile(time_to_85, 10), color='#ef4444', linewidth=2, linestyle=':',
           label=f'10th pctl: {np.percentile(time_to_85, 10):.0f} yr')
ax.set_xlabel('Years to 85% viability', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Time-to-Threshold Distribution', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Sample MC trajectories
ax = axes[1, 0]
# Plot 50 random trajectories
for i in np.random.choice(n_mc, 50, replace=False):
    ax.plot(years_range, mc_viabilities[i] * 100, color='#3b82f6', alpha=0.1, linewidth=0.5)
ax.plot(years_range, mean_viab * 100, color='#22c55e', linewidth=2, label='Mean')
ax.axhline(85, color='#f59e0b', linestyle='--', linewidth=1.5)
ax.set_xlabel('Years in storage', color='white')
ax.set_ylabel('Germination (%)', color='white')
ax.set_title(f'50 Monte Carlo Trajectories', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Sensitivity — which uncertainty matters most?
ax = axes[1, 1]
param_names = ['Ki (quality)', 'Temp', 'Moisture', 'KE', 'Cw']
sensitivities = []
for param in ['Ki', 'temp', 'moisture', 'KE', 'Cw']:
    # Run MC varying only this parameter
    t85_values = []
    for _ in range(500):
        params_test = nominal.copy()
        params_test[param] = np.random.normal(nominal[param], uncertainty[param])
        if param == 'moisture':
            params_test[param] = max(params_test[param], 2)
        v = predict_viability(50, params_test['temp'], params_test['moisture'],
                              params_test['KE'], params_test['Cw'],
                              params_test['Ch'], params_test['Cq'], params_test['Ki'])
        t85_values.append(v)
    sensitivities.append(np.std(t85_values))

# Normalize
total_s = sum(sensitivities)
norm_s = [s / total_s * 100 for s in sensitivities]
colors_s = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#a855f7']
bars = ax.barh(param_names, norm_s, color=colors_s, edgecolor='none')
ax.set_xlabel('Contribution to uncertainty (%)', color='white')
ax.set_title('Sensitivity: Which Parameter Matters Most?', color='white', fontsize=10)

# Plot 6: Management recommendations
ax = axes[1, 2]
ax.axis('off')
safe_year = int(np.percentile(time_to_85, 10) * 0.8)  # 80% of 10th percentile
test_interval = max(3, safe_year // 4)

text = f"""Monte Carlo Risk Analysis
==============================
n = {n_mc} simulations

Rice at 5°C, 5% moisture:
  Mean time to 85%: {np.mean(time_to_85):.0f} years
  10th percentile:  {np.percentile(time_to_85, 10):.0f} years
  5th percentile:   {np.percentile(time_to_85, 5):.0f} years

Risk assessment:
  10% risk reached at year {risk_10_year}
  50% risk reached at year {years_range[np.searchsorted(risk_85, 0.50)]}

RECOMMENDATIONS:
  Schedule regeneration by year {safe_year}
  Test germination every {test_interval} years
  First test at year {test_interval}

Safety margin built in:
  Regeneration target = 80% of worst-case
  This provides buffer for unexpected
  events (power failure, equipment drift)"""

ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Monte Carlo analysis complete ({n_mc} simulations).")
print(f"Safe regeneration year: {safe_year} (with 80% safety margin)")
print(f"Test schedule: every {test_interval} years starting year {test_interval}")
print(f"The seed keeper's conservative approach was exactly right.")`,
      challenge: 'Run the same analysis for Svalbard conditions (-18°C, 5%). Then model a "warming permafrost" scenario where temperature rises from -18°C to -10°C linearly over 50 years. How does this affect the risk curve and regeneration schedule?',
      successHint: 'You have completed a full capstone: seed viability prediction with uncertainty quantification and risk-based management recommendations. This is the exact workflow used by gene bank managers to protect the world\'s crop genetic heritage. The seed keeper\'s wisdom, formalized into mathematics.',
    },
    {
      title: 'Capstone: Multi-species collection management dashboard',
      concept: `The final piece integrates everything into a **collection management dashboard** — a tool that a gene bank manager could use to monitor hundreds of seed lots across multiple species.

A real gene bank manages 10,000-500,000 accessions. Each has different:
- Species (different viability parameters)
- Initial quality (depends on harvest conditions)
- Storage conditions (some in -18°C vault, some in 5°C active collection)
- Storage history (some recently deposited, others decades old)

The dashboard must:
1. **Prioritize**: which accessions need urgent germination testing?
2. **Schedule**: when should each accession be regenerated?
3. **Budget**: how many regeneration events per year? (Each costs money and requires growing facilities.)
4. **Optimize**: can we reduce costs by adjusting storage conditions?

This is a **resource allocation problem** — limited budget and labor must be distributed across thousands of accessions to minimize the probability of losing any of them.`,
      analogy: 'Managing a gene bank is like managing a hospital ICU. Thousands of "patients" (seed lots) with varying conditions. Limited resources (staff, growing space). The dashboard is the triage system — it identifies who needs immediate attention, who can wait, and how to allocate resources optimally.',
      storyConnection: 'The seed keeper managed 30 varieties in her clay pots — a micro gene bank. She knew which pots to open first each spring, which seeds needed replanting, and which could wait another year. Our dashboard scales her intuition to 100,000 accessions.',
      checkQuestion: 'A gene bank has 50,000 accessions and budget for 500 regeneration events per year. Monte Carlo predicts 600 accessions will need regeneration this year. What should the manager do?',
      checkAnswer: 'Prioritize by uniqueness and risk. Accessions that are unique (no duplicates elsewhere, rare wild relatives) get regenerated first. Accessions with duplicates in Svalbard can wait. The manager should also request emergency funding for the shortfall, and investigate whether storage conditions can be improved for the remaining 100 to buy time. Triage, not panic.',
      codeIntro: 'Build a collection management dashboard that prioritizes, schedules, and budgets regeneration events.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erf, sqrt

np.random.seed(42)

def normal_cdf(x):
    return 0.5 * (1 + np.vectorize(erf)(x / sqrt(2)))

# Simplified viability predictor
def predict_viab(time_yr, temp, moisture, KE, Cw, Ch, Cq, Ki):
    log_s = KE - Cw * np.log10(max(moisture, 1)) - Ch * temp - Cq * temp**2
    sigma = 10**np.clip(log_s, -2, 10)
    return float(np.clip(normal_cdf(Ki - time_yr / max(sigma, 0.001)), 0, 1))

# Generate a synthetic gene bank collection
n_accessions = 5000

species_params = {
    'Rice':   (9.0, 4.5, 0.040, 0.000150),
    'Wheat':  (8.5, 4.0, 0.040, 0.000140),
    'Tomato': (7.5, 3.8, 0.040, 0.000160),
    'Onion':  (5.5, 3.0, 0.060, 0.000250),
    'Lettuce': (6.0, 3.5, 0.050, 0.000200),
}

collection = []
for i in range(n_accessions):
    species = np.random.choice(list(species_params.keys()),
                                p=[0.3, 0.25, 0.15, 0.15, 0.15])
    age = np.random.exponential(20)  # years since deposit
    Ki = np.random.normal(2.0, 0.3)
    temp = np.random.choice([5, -18], p=[0.6, 0.4])
    moisture = np.random.normal(5, 0.5)
    has_svalbard_backup = np.random.random() < 0.5
    uniqueness = np.random.choice(['common', 'rare', 'unique'], p=[0.6, 0.3, 0.1])

    KE, Cw, Ch, Cq = species_params[species]
    current_viab = predict_viab(age, temp, max(moisture, 2), KE, Cw, Ch, Cq, Ki)

    collection.append({
        'id': f'ACC-{i:05d}',
        'species': species,
        'age': age,
        'Ki': Ki,
        'temp': temp,
        'moisture': max(moisture, 2),
        'viability': current_viab,
        'has_backup': has_svalbard_backup,
        'uniqueness': uniqueness,
    })

# Compute risk scores
for acc in collection:
    # Risk = probability of dropping below 85% in next 5 years
    KE, Cw, Ch, Cq = species_params[acc['species']]
    viab_5yr = predict_viab(acc['age'] + 5, acc['temp'], acc['moisture'],
                             KE, Cw, Ch, Cq, acc['Ki'])
    # Priority score: weighted by uniqueness and backup status
    uniqueness_weight = {'common': 1, 'rare': 3, 'unique': 10}[acc['uniqueness']]
    backup_factor = 0.5 if acc['has_backup'] else 1.0
    acc['viab_5yr'] = viab_5yr
    acc['risk_score'] = (1 - viab_5yr) * uniqueness_weight * backup_factor
    acc['needs_regen'] = acc['viability'] < 0.85

# Sort by risk
collection.sort(key=lambda x: -x['risk_score'])

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Current viability distribution
ax = axes[0, 0]
viabilities = [a['viability'] * 100 for a in collection]
ax.hist(viabilities, bins=50, color='#3b82f6', edgecolor='none', alpha=0.7)
ax.axvline(85, color='#ef4444', linewidth=2, linestyle='--', label='Threshold (85%)')
n_below = sum(1 for v in viabilities if v < 85)
ax.text(0.05, 0.95, f'{n_below} accessions below 85%\\n({n_below/n_accessions*100:.1f}%)',
        transform=ax.transAxes, color='#ef4444', fontsize=10, va='top')
ax.set_xlabel('Current viability (%)', color='white')
ax.set_ylabel('Number of accessions', color='white')
ax.set_title(f'Collection Health ({n_accessions} accessions)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Viability by species
ax = axes[0, 1]
sp_viabs = {}
for sp in species_params:
    sp_viabs[sp] = [a['viability'] * 100 for a in collection if a['species'] == sp]
positions = np.arange(len(species_params))
bp = ax.boxplot([sp_viabs[sp] for sp in species_params], positions=positions,
                patch_artist=True, widths=0.5)
colors_sp = ['#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#3b82f6']
for patch, color in zip(bp['boxes'], colors_sp):
    patch.set_facecolor(color)
    patch.set_alpha(0.5)
for element in ['whiskers', 'caps', 'medians']:
    for item in bp[element]:
        item.set_color('white')
ax.set_xticks(positions)
ax.set_xticklabels(list(species_params.keys()), color='white', fontsize=9)
ax.axhline(85, color='#ef4444', linestyle='--', linewidth=1)
ax.set_ylabel('Viability (%)', color='white')
ax.set_title('Viability by Species', color='white', fontsize=11)

# Plot 3: Risk priority matrix
ax = axes[0, 2]
for acc in collection[:200]:  # plot top 200 by risk
    x = acc['viability'] * 100
    y = acc['viab_5yr'] * 100
    size = {'common': 10, 'rare': 30, 'unique': 80}[acc['uniqueness']]
    color = '#ef4444' if not acc['has_backup'] else '#f59e0b'
    ax.scatter(x, y, s=size, color=color, alpha=0.4, edgecolors='none')
ax.axhline(85, color='gray', linestyle=':', alpha=0.5)
ax.axvline(85, color='gray', linestyle=':', alpha=0.5)
ax.plot([50, 100], [50, 100], color='gray', linestyle='--', alpha=0.3)
ax.scatter([], [], s=10, color='gray', label='Common')
ax.scatter([], [], s=30, color='gray', label='Rare')
ax.scatter([], [], s=80, color='gray', label='Unique')
ax.scatter([], [], color='#ef4444', label='No backup')
ax.scatter([], [], color='#f59e0b', label='Has backup')
ax.set_xlabel('Current viability (%)', color='white')
ax.set_ylabel('Predicted viability in 5 years (%)', color='white')
ax.set_title('Risk Priority Matrix', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='lower right')

# Plot 4: Regeneration budget forecast
ax = axes[1, 0]
forecast_years = 20
regen_needed = []
for yr in range(1, forecast_years + 1):
    count = 0
    for acc in collection:
        KE, Cw, Ch, Cq = species_params[acc['species']]
        future_viab = predict_viab(acc['age'] + yr, acc['temp'], acc['moisture'],
                                    KE, Cw, Ch, Cq, acc['Ki'])
        if future_viab < 0.85:
            count += 1
    regen_needed.append(count)

ax.bar(range(1, forecast_years + 1), regen_needed, color='#ef4444', edgecolor='none', width=0.7)
ax.axhline(300, color='#22c55e', linestyle='--', linewidth=2, label='Annual budget (300)')
ax.set_xlabel('Years from now', color='white')
ax.set_ylabel('Accessions needing regeneration', color='white')
ax.set_title('Regeneration Demand Forecast', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Storage condition optimization
ax = axes[1, 1]
# What if we moved all 5°C accessions to -18°C?
current_regen = sum(1 for a in collection if a['viability'] < 0.85)
improved_regen = 0
for acc in collection:
    KE, Cw, Ch, Cq = species_params[acc['species']]
    viab_improved = predict_viab(acc['age'], -18, acc['moisture'], KE, Cw, Ch, Cq, acc['Ki'])
    if viab_improved < 0.85:
        improved_regen += 1

scenarios_opt = ['Current mix\\n(5°C + -18°C)', 'All at -18°C', 'All at 5°C']
counts_opt = [current_regen, improved_regen,
              sum(1 for a in collection if predict_viab(a['age'], 5, a['moisture'],
                  *species_params[a['species']], a['Ki']) < 0.85)]
colors_opt = ['#f59e0b', '#22c55e', '#ef4444']
ax.bar(scenarios_opt, counts_opt, color=colors_opt, edgecolor='none', width=0.5)
for i, c in enumerate(counts_opt):
    ax.text(i, c + 20, str(c), ha='center', color='white', fontsize=11)
ax.set_ylabel('Accessions below 85%', color='white')
ax.set_title('Storage Optimization Impact', color='white', fontsize=11)

# Plot 6: Dashboard summary
ax = axes[1, 2]
ax.axis('off')
urgent = sum(1 for a in collection if a['viability'] < 0.85 and a['uniqueness'] == 'unique' and not a['has_backup'])
high_risk = sum(1 for a in collection if a['risk_score'] > 2)
text = f"""Gene Bank Dashboard Summary
================================
Total accessions: {n_accessions:,}
Below 85%: {n_below} ({n_below/n_accessions*100:.1f}%)

URGENT (unique, no backup, <85%): {urgent}
HIGH RISK (score > 2): {high_risk}

Species breakdown:"""
for sp in species_params:
    n = sum(1 for a in collection if a['species'] == sp)
    below = sum(1 for a in collection if a['species'] == sp and a['viability'] < 0.85)
    text += f"\n  {sp:10s}: {n:>5} total, {below:>4} need regen"

text += f"""

Budget status:
  This year: {regen_needed[0]} needed, 300 budgeted
  {'ON TRACK' if regen_needed[0] <= 300 else 'OVER BUDGET (' + str(regen_needed[0] - 300) + ' shortfall)'}"""

ax.text(0.02, 0.97, text, transform=ax.transAxes, fontsize=8,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Dashboard built for {n_accessions} accessions.")
print(f"Urgent regeneration needed: {urgent} unique, unbackedup accessions below 85%")
print(f"The seed keeper's intuition, scaled to a global collection.")`,
      challenge: 'Add a "climate disaster" scenario: a flood damages 20% of the active collection (5°C storage). Which accessions are irreplaceable (unique, no Svalbard backup)? Build an emergency response prioritization list. This is exactly what happened to the Philippine gene bank in 2006.',
      successHint: 'You have built a complete capstone: from biochemical viability equations to probabilistic risk analysis to operational gene bank management. This is real-world conservation informatics — the kind of system that protects the genetic heritage of human agriculture. The seed keeper would be proud.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Seed Viability Predictor
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (seed science & conservation biology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone uses Python with numpy and matplotlib to build a seed viability prediction system. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
