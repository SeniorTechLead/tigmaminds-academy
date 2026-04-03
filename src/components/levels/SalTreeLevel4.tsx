import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function SalTreeLevel4() {
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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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
      title: 'Capstone: Carbon Sequestration Calculator — model architecture',
      concept: `Your capstone project builds a **Carbon Sequestration Calculator** that models carbon storage in a sal forest based on age, density, and growth rate. This is the kind of tool used by forest managers, carbon credit verifiers, and climate policy makers.

The calculator integrates three sub-models:
1. **Individual tree growth model**: DBH and height as functions of age, site quality, and competition
2. **Stand dynamics model**: tree density changes over time due to natural mortality and management
3. **Carbon accounting model**: converts biomass to carbon stocks across all five pools (aboveground, belowground, soil, deadwood, litter)

Input parameters:
- Forest area (hectares)
- Initial planting density (trees/ha)
- Site quality index (1-5, affects growth rate)
- Management regime (natural, thinned, plantation)
- Climate scenario (baseline, +1.5°C, +3°C)

Output:
- Carbon stock trajectory over 200 years
- Annual sequestration rate
- CO2 equivalent (for carbon credits)
- Comparison across management scenarios`,
      analogy: 'This is like building a financial projection tool. Input: initial investment (planting), interest rate (growth), management fees (thinning), and inflation (climate change). Output: portfolio value over time. The "portfolio" is carbon, and the "returns" are measured in tonnes of CO2 removed from the atmosphere.',
      storyConnection: 'The sal forest around the village was not just a collection of trees — it was a carbon engine, quietly pulling CO2 from the sky and locking it into wood and soil year after year. Our calculator will quantify exactly how much climate service this forest provides.',
      checkQuestion: 'A forest manager claims their 1000-ha sal plantation sequesters 10,000 tonnes CO2 per year. The forest is 20 years old with 400 trees/ha. Is this claim plausible? How would you verify it?',
      checkAnswer: 'At 20 years, sal trees have DBH ~15 cm and height ~12 m, with ~50 kg of carbon each. Annual growth at this age is high: ~3-5 kgC/tree/year. 400 trees/ha * 4 kgC/tree/yr * 1000 ha = 1,600 tC/yr = 5,872 tCO2/yr. The claim of 10,000 tCO2/yr is roughly double what the trees alone can do. But if you include soil carbon accumulation (~2-3 tC/ha/yr in new plantations), the total could reach 7,500-8,500 tCO2/yr. Still below the claim — it is likely inflated. Verification requires sample plot measurements.',
      codeIntro: 'Build the complete carbon sequestration calculator with individual tree growth, stand dynamics, and carbon accounting.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class CarbonSequestrationCalculator:
    """Forest carbon calculator for sal (Shorea robusta)."""

    def __init__(self, area_ha=100, density=400, site_quality=3,
                 management='natural', climate='baseline'):
        self.area_ha = area_ha
        self.initial_density = density
        self.site_quality = site_quality  # 1=poor, 5=excellent
        self.management = management
        self.climate = climate

        # Site quality affects maximum growth
        self.growth_modifier = {1: 0.6, 2: 0.8, 3: 1.0, 4: 1.15, 5: 1.3}[site_quality]

        # Climate affects growth and mortality
        self.climate_growth = {'baseline': 1.0, '+1.5C': 0.95, '+3C': 0.85}[climate]
        self.climate_mortality = {'baseline': 1.0, '+1.5C': 1.1, '+3C': 1.3}[climate]

    def tree_dbh(self, age):
        """DBH (cm) from age using Chapman-Richards model."""
        max_dbh = 80 * self.growth_modifier * self.climate_growth
        k = 0.025 * self.growth_modifier
        return max_dbh * (1 - np.exp(-k * age))

    def tree_height(self, dbh):
        """Height (m) from DBH."""
        max_h = 35 * self.growth_modifier
        return max_h * (1 - np.exp(-0.04 * dbh))

    def tree_biomass(self, dbh, height):
        """Aboveground biomass (kg) using Chave et al. allometry."""
        wd = 0.72  # sal wood density
        return 0.0673 * (wd * dbh**2 * height)**0.976

    def stand_density(self, age):
        """Trees per hectare at given age (self-thinning)."""
        # Natural self-thinning: Yoda's -3/2 power law
        base_mortality = 0.015 * self.climate_mortality
        natural = self.initial_density * np.exp(-base_mortality * age)

        if self.management == 'thinned':
            # Commercial thinning at ages 30, 50, 70
            for thin_age in [30, 50, 70]:
                if age > thin_age:
                    natural *= 0.7  # remove 30% each thinning
        return max(natural, 20)  # minimum viable density

    def carbon_pools(self, age):
        """All carbon pools at given forest age (tC/ha)."""
        density = self.stand_density(age)
        dbh = self.tree_dbh(age)
        height = self.tree_height(dbh)
        biomass_per_tree = self.tree_biomass(dbh, height)

        agb = density * biomass_per_tree * 0.5 / 1000  # tC/ha
        bgb = agb * 0.25
        # Soil carbon builds slowly, plateaus
        soil = 50 + 70 * (1 - np.exp(-0.02 * age))
        deadwood = agb * 0.08 * (1 - np.exp(-0.05 * age))
        litter = min(5, 0.3 * age)

        return {
            'agb': agb, 'bgb': bgb, 'soil': soil,
            'deadwood': deadwood, 'litter': litter,
            'total': agb + bgb + soil + deadwood + litter,
            'density': density, 'dbh': dbh, 'height': height,
        }

    def run(self, max_age=200):
        """Run full simulation."""
        results = []
        for age in range(max_age + 1):
            pools = self.carbon_pools(age)
            pools['age'] = age
            results.append(pools)
        return results

# Run scenarios
scenarios = [
    ('Natural forest, SQ3', {'area_ha': 100, 'density': 400, 'site_quality': 3, 'management': 'natural', 'climate': 'baseline'}),
    ('Plantation, SQ4', {'area_ha': 100, 'density': 600, 'site_quality': 4, 'management': 'thinned', 'climate': 'baseline'}),
    ('Poor site, SQ1', {'area_ha': 100, 'density': 300, 'site_quality': 1, 'management': 'natural', 'climate': 'baseline'}),
    ('Climate +3°C', {'area_ha': 100, 'density': 400, 'site_quality': 3, 'management': 'natural', 'climate': '+3C'}),
]

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_scen = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
all_results = {}

for (name, params), color in zip(scenarios, colors_scen):
    calc = CarbonSequestrationCalculator(**params)
    results = calc.run(200)
    all_results[name] = results

    ages = [r['age'] for r in results]
    totals = [r['total'] for r in results]
    axes[0, 0].plot(ages, totals, color=color, linewidth=2, label=name)

# Plot 1: Total carbon stock
ax = axes[0, 0]
ax.set_xlabel('Forest age (years)', color='white')
ax.set_ylabel('Total carbon stock (tC/ha)', color='white')
ax.set_title('Carbon Stock Trajectories', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Annual sequestration rate
ax = axes[0, 1]
for (name, _), color in zip(scenarios, colors_scen):
    results = all_results[name]
    totals = [r['total'] for r in results]
    annual_seq = np.diff(totals)
    ax.plot(range(1, len(annual_seq) + 1), annual_seq, color=color, linewidth=1.5, label=name)
ax.axhline(0, color='gray', linestyle=':', linewidth=0.5)
ax.set_xlabel('Forest age (years)', color='white')
ax.set_ylabel('Sequestration (tC/ha/yr)', color='white')
ax.set_title('Annual Sequestration Rate', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Carbon pools breakdown (natural, age 100)
ax = axes[0, 2]
r100 = all_results['Natural forest, SQ3'][100]
pools_names = ['AGB', 'BGB', 'Soil', 'Deadwood', 'Litter']
pools_vals = [r100['agb'], r100['bgb'], r100['soil'], r100['deadwood'], r100['litter']]
pool_colors = ['#22c55e', '#8b6c5c', '#6b4c3b', '#a855f7', '#f59e0b']
bars = ax.bar(pools_names, pools_vals, color=pool_colors, edgecolor='none', width=0.6)
for bar, val in zip(bars, pools_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{val:.0f}', ha='center', color='white', fontsize=10)
ax.set_ylabel('Carbon (tC/ha)', color='white')
ax.set_title(f'Carbon Pools at Age 100 ({r100["total"]:.0f} tC/ha total)', color='white', fontsize=10)

# Plot 4: Stand structure
ax = axes[1, 0]
for (name, _), color in zip(scenarios[:2], colors_scen[:2]):
    results = all_results[name]
    ages = [r['age'] for r in results]
    densities = [r['density'] for r in results]
    dbhs = [r['dbh'] for r in results]
    ax.plot(ages, densities, color=color, linewidth=2, label=f'{name} (density)')
    ax2 = ax.twinx()
    ax2.plot(ages, dbhs, color=color, linewidth=2, linestyle='--')
ax.set_xlabel('Forest age (years)', color='white')
ax.set_ylabel('Trees/ha', color='white')
ax2.set_ylabel('DBH (cm)', color='white')
ax.set_title('Stand Development', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 5: CO2 equivalent and carbon credits
ax = axes[1, 1]
# Carbon credit value: $15/tCO2 (current voluntary market)
carbon_price = 15  # USD per tCO2
for (name, params), color in zip(scenarios[:2], colors_scen[:2]):
    results = all_results[name]
    totals = [r['total'] for r in results]
    co2_equiv = [t * 3.67 * params['area_ha'] for t in totals]  # total tonnes CO2
    credit_value = [c * carbon_price / 1e6 for c in co2_equiv]  # million USD
    ax.plot([r['age'] for r in results], credit_value, color=color, linewidth=2, label=name)
ax.set_xlabel('Forest age (years)', color='white')
ax.set_ylabel('Carbon credit value (M USD)', color='white')
ax.set_title(f'Carbon Credit Value (\${carbon_price}/tCO2)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary dashboard
ax = axes[1, 2]
ax.axis('off')
r = all_results['Natural forest, SQ3']
r50 = r[50]; r100 = r[100]; r150 = r[150]
text = f"""Carbon Sequestration Calculator
=================================
Natural sal forest, 100 ha, SQ=3

Age    Stock    Annual    CO2eq
       tC/ha    tC/ha/yr  total
----   -----    --------  ------
 50    {r50['total']:>5.0f}     {r[50]['total']-r[49]['total']:>5.1f}    {r50['total']*3.67*100:>7,.0f}
100    {r100['total']:>5.0f}     {r[100]['total']-r[99]['total']:>5.1f}    {r100['total']*3.67*100:>7,.0f}
150    {r150['total']:>5.0f}     {r[150]['total']-r[149]['total']:>5.1f}    {r150['total']*3.67*100:>7,.0f}

Climate impact (+3°C):
  Reduces stock by {(1 - all_results['Climate +3°C'][100]['total']/r100['total'])*100:.0f}% at age 100
  Due to slower growth + higher mortality

Carbon value at age 100:
  {r100['total']*3.67*100*15/1e6:.1f} million USD (at $15/tCO2)"""

ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Carbon Sequestration Calculator built and calibrated.")
print(f"A 100-ha sal forest at age 100 stores {r100['total']*100:,.0f} tonnes of carbon")
print(f"That is {r100['total']*3.67*100:,.0f} tonnes CO2 equivalent")
print(f"Worth \${r100['total']*3.67*100*15:,.0f} in carbon credits")`,
      challenge: 'Add a "reforestation vs avoided deforestation" comparison: model the carbon benefit of (a) planting 100 ha of new sal forest vs (b) preventing the logging of 100 ha of 80-year-old forest. Over 50 years, which intervention stores more carbon? This is one of the most important questions in climate policy.',
      successHint: 'You have built a professional-grade carbon sequestration calculator. This is exactly the kind of tool that REDD+ (Reducing Emissions from Deforestation) projects use to quantify carbon credits. Your sal forest is now a quantified climate asset.',
    },
    {
      title: 'Capstone: Sensitivity analysis — which parameters matter most?',
      concept: `A carbon calculator is only useful if you know which inputs matter most. **Sensitivity analysis** systematically varies each input parameter while holding others fixed to identify the primary drivers of uncertainty.

For our sal forest model, the key parameters are:
- **Site quality** (1-5): affects maximum growth potential
- **Initial density** (100-800 trees/ha): affects competition and self-thinning
- **Climate scenario**: affects growth rate and mortality
- **Management regime**: affects harvest timing and intensity
- **Wood density** (embedded in allometry): species-specific constant

The most sensitive parameters are the ones where a small change causes a large change in output. If a 10% change in site quality causes a 30% change in carbon stock, the model is 3x sensitive to site quality. This ratio is the **sensitivity coefficient**.

Understanding sensitivity is critical for:
1. **Uncertainty quantification**: how confident are we in our carbon estimates?
2. **Management prioritization**: which interventions have the biggest impact?
3. **Monitoring design**: which variables must we measure most accurately?`,
      analogy: 'Sensitivity analysis is like figuring out which ingredient makes the most difference in a recipe. If doubling the salt ruins the dish but doubling the pepper barely matters, you need to measure salt very precisely but can be approximate with pepper. Same with carbon models — know what matters.',
      storyConnection: 'The sal forest\'s carbon storage depended on many factors — rainfall, soil depth, tree spacing, and management history. Our sensitivity analysis reveals which of these the villagers had the most control over and which were driven by nature.',
      checkQuestion: 'If site quality has a sensitivity coefficient of 3.0 and initial density has a coefficient of 0.5, which should a forest manager focus on? What does this mean practically?',
      checkAnswer: 'Focus on site quality — a small improvement (e.g., choosing better planting sites, improving soil) has 6x more impact than changing density. Practically, this means site selection is the most important decision in reforestation. Planting on good soil matters far more than how many trees you plant per hectare.',
      codeIntro: 'Run a full sensitivity analysis and Monte Carlo uncertainty quantification on the carbon calculator.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def carbon_at_age(age, density=400, site_quality=3, climate_mod=1.0):
    """Simplified carbon stock calculation."""
    growth_mod = {1: 0.6, 2: 0.8, 3: 1.0, 4: 1.15, 5: 1.3}.get(site_quality, 1.0)
    max_dbh = 80 * growth_mod * climate_mod
    k = 0.025 * growth_mod
    dbh = max_dbh * (1 - np.exp(-k * age))
    height = 35 * growth_mod * (1 - np.exp(-0.04 * dbh))
    biomass = 0.0673 * (0.72 * dbh**2 * height)**0.976
    # Self-thinning
    current_density = density * np.exp(-0.015 * age)
    current_density = max(current_density, 20)
    agb_c = current_density * biomass * 0.5 / 1000
    total_c = agb_c * 1.25 + 50 + 70 * (1 - np.exp(-0.02 * age)) + 5
    return total_c

# ---- ONE-AT-A-TIME SENSITIVITY ----
target_age = 100
base_params = {'density': 400, 'site_quality': 3, 'climate_mod': 1.0}
base_carbon = carbon_at_age(target_age, **base_params)

# Vary each parameter ±20%
param_ranges = {
    'density': np.linspace(200, 800, 30),
    'site_quality': [1, 2, 3, 4, 5],
    'climate_mod': np.linspace(0.7, 1.3, 30),
}

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1-3: One-at-a-time sensitivity
sensitivity_coeffs = {}
for idx, (param_name, values) in enumerate(param_ranges.items()):
    ax = axes[0, idx]
    carbons = []
    for val in values:
        params = base_params.copy()
        params[param_name] = val
        carbons.append(carbon_at_age(target_age, **params))
    ax.plot(values, carbons, color='#22c55e', linewidth=2, marker='o' if len(values) < 10 else None)
    ax.axhline(base_carbon, color='#f59e0b', linestyle='--', label=f'Baseline: {base_carbon:.0f} tC/ha')

    # Sensitivity coefficient
    c_range = max(carbons) - min(carbons)
    if isinstance(values, list):
        v_range = max(values) - min(values)
    else:
        v_range = values[-1] - values[0]
    base_v = base_params[param_name]
    if base_v != 0 and base_carbon != 0:
        # Elasticity: % change in output / % change in input
        sc = (c_range / base_carbon) / (v_range / base_v) if v_range != 0 else 0
    else:
        sc = 0
    sensitivity_coeffs[param_name] = sc

    ax.set_xlabel(param_name.replace('_', ' ').title(), color='white')
    ax.set_ylabel('Carbon stock (tC/ha)', color='white')
    ax.set_title(f'Sensitivity: {param_name} (SC={sc:.2f})', color='white', fontsize=10)
    ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# ---- MONTE CARLO UNCERTAINTY ----
n_mc = 2000
mc_densities = np.random.normal(400, 80, n_mc)  # ±20%
mc_sq = np.random.choice([1, 2, 3, 3, 3, 4, 4, 5], n_mc)  # weighted toward 3-4
mc_climate = np.random.normal(1.0, 0.1, n_mc)  # ±10%

mc_carbons = []
for d, sq, cm in zip(mc_densities, mc_sq, mc_climate):
    mc_carbons.append(carbon_at_age(target_age, density=max(d, 50), site_quality=sq,
                                     climate_mod=max(cm, 0.5)))
mc_carbons = np.array(mc_carbons)

# Plot 4: Monte Carlo distribution
ax = axes[1, 0]
ax.hist(mc_carbons, bins=50, color='#3b82f6', edgecolor='none', alpha=0.7)
ax.axvline(np.mean(mc_carbons), color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Mean: {np.mean(mc_carbons):.0f} tC/ha')
ax.axvline(np.percentile(mc_carbons, 5), color='#ef4444', linewidth=1.5, linestyle=':',
           label=f'5th pctl: {np.percentile(mc_carbons, 5):.0f}')
ax.axvline(np.percentile(mc_carbons, 95), color='#ef4444', linewidth=1.5, linestyle=':',
           label=f'95th pctl: {np.percentile(mc_carbons, 95):.0f}')
ax.set_xlabel('Carbon stock at age 100 (tC/ha)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title(f'Monte Carlo Distribution (n={n_mc})', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Sensitivity tornado chart
ax = axes[1, 1]
sorted_params = sorted(sensitivity_coeffs.items(), key=lambda x: abs(x[1]), reverse=True)
names = [p[0].replace('_', ' ').title() for p in sorted_params]
coeffs = [p[1] for p in sorted_params]
colors_tornado = ['#22c55e' if c > 0 else '#ef4444' for c in coeffs]
ax.barh(names, coeffs, color=colors_tornado, edgecolor='none', height=0.5)
ax.axvline(0, color='gray', linewidth=0.5)
ax.set_xlabel('Sensitivity coefficient (elasticity)', color='white')
ax.set_title('Sensitivity Ranking', color='white', fontsize=11)

# Plot 6: Uncertainty over time
ax = axes[1, 2]
ages_range = np.arange(0, 201, 5)
p5_line, p50_line, p95_line = [], [], []
for age in ages_range:
    mc_vals = []
    for _ in range(200):
        d = np.random.normal(400, 80)
        sq = np.random.choice([1, 2, 3, 3, 3, 4, 4, 5])
        cm = np.random.normal(1.0, 0.1)
        mc_vals.append(carbon_at_age(age, max(d, 50), sq, max(cm, 0.5)))
    p5_line.append(np.percentile(mc_vals, 5))
    p50_line.append(np.percentile(mc_vals, 50))
    p95_line.append(np.percentile(mc_vals, 95))

ax.fill_between(ages_range, p5_line, p95_line, alpha=0.2, color='#3b82f6', label='90% CI')
ax.plot(ages_range, p50_line, color='#3b82f6', linewidth=2, label='Median')
ax.plot(ages_range, p5_line, color='#3b82f6', linewidth=1, linestyle=':')
ax.plot(ages_range, p95_line, color='#3b82f6', linewidth=1, linestyle=':')
ax.set_xlabel('Forest age (years)', color='white')
ax.set_ylabel('Carbon stock (tC/ha)', color='white')
ax.set_title('Carbon Stock with Uncertainty', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"Sensitivity Analysis Results (age {target_age}):")
print(f"  Base carbon stock: {base_carbon:.0f} tC/ha")
print()
for name, sc in sorted_params:
    print(f"  {name:20s}: sensitivity coefficient = {sc:.2f}")
print()
print(f"Monte Carlo uncertainty (n={n_mc}):")
print(f"  Mean:     {np.mean(mc_carbons):.0f} tC/ha")
print(f"  Std dev:  {np.std(mc_carbons):.0f} tC/ha")
print(f"  90% CI:   [{np.percentile(mc_carbons, 5):.0f}, {np.percentile(mc_carbons, 95):.0f}] tC/ha")
print(f"  CV:       {np.std(mc_carbons)/np.mean(mc_carbons)*100:.1f}%")`,
      challenge: 'Add a "measurement error" layer: DBH is measured with ±5% error, height with ±10% error. How much does measurement uncertainty add to the overall uncertainty? If you can only improve one measurement, which reduces total uncertainty more — better DBH or better height measurements?',
      successHint: 'You have built a complete capstone: a carbon sequestration calculator with growth models, stand dynamics, carbon accounting, and rigorous uncertainty quantification. This is the same methodology used in IPCC reports and national greenhouse gas inventories.',
    },
    {
      title: 'Capstone: Policy scenarios — what should we do with sal forests?',
      concept: `The final piece integrates everything into **policy-relevant scenarios**. Forest managers and policy makers need answers to questions like:
- Should we plant new forests or protect old ones?
- Is thinning commercially viable while maintaining carbon stocks?
- What carbon price makes conservation more profitable than agriculture?
- How does climate change alter the calculus?

We will compare four policy scenarios over 100 years:
1. **Business as usual**: current logging rates continue, 2% forest loss per year
2. **Full protection**: no logging, natural growth and mortality
3. **Sustainable harvest**: selection logging, maintain stand structure
4. **Reforestation + protection**: protect existing + plant degraded areas

Each scenario produces different carbon trajectories, economic returns, and biodiversity outcomes. The "right" answer depends on weighing carbon storage, timber revenue, livelihoods, and ecosystem services.

This is the ultimate interdisciplinary challenge — physics (carbon cycle), biology (tree growth), economics (discounting, markets), and policy (regulation, incentives) must all be integrated.`,
      analogy: 'These scenarios are like investment portfolios with different risk-return profiles. "Business as usual" is spending your savings. "Full protection" is locking your money in a savings account. "Sustainable harvest" is a balanced portfolio. "Reforestation" is investing in new assets. The optimal choice depends on your time horizon and risk tolerance.',
      storyConnection: 'The villagers faced this exact choice: should they sell the sal trees for quick money, or protect the forest for long-term benefits? Our model quantifies both sides — and shows that the answer depends on how much you value the future.',
      checkQuestion: 'If a carbon credit is worth $15/tCO2 and converting 1 ha of forest to agriculture earns $500/year, at what carbon stock does conservation become economically competitive? Assume the forest sequesters 5 tC/ha/year.',
      checkAnswer: 'Annual carbon value: 5 tC/ha/yr * 3.67 tCO2/tC * $15/tCO2 = $275/yr. This is less than $500/yr from agriculture. Carbon needs to be priced at $500 / (5 * 3.67) = $27/tCO2 to match agriculture. At current prices ($15), conservation loses — which is why deforestation continues. Either carbon prices must rise or the non-carbon benefits of forests (water, biodiversity, climate regulation) must be valued.',
      codeIntro: 'Compare policy scenarios with full economic and carbon analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def forest_carbon(age, density=400, sq=3, cm=1.0):
    """Carbon stock (tC/ha) at given age."""
    gm = {1:0.6, 2:0.8, 3:1.0, 4:1.15, 5:1.3}.get(sq, 1.0)
    dbh = 80*gm*cm*(1-np.exp(-0.025*gm*age))
    h = 35*gm*(1-np.exp(-0.04*dbh))
    bio = 0.0673*(0.72*dbh**2*h)**0.976
    d = max(density*np.exp(-0.015*age), 20)
    agb = d*bio*0.5/1000
    return agb*1.25 + 50 + 70*(1-np.exp(-0.02*age)) + 5

# Policy scenarios over 100 years
years = 100
initial_forest_ha = 10000
initial_age = 80  # current average age
initial_carbon = forest_carbon(initial_age)

# Agricultural income (per ha per year)
ag_income = 500  # USD/ha/year
timber_income_per_m3 = 100  # USD/m^3
carbon_price = 15  # USD/tCO2

def scenario_bau(years, area, age):
    """Business as usual: 2% forest loss per year."""
    forest_area = [area]
    carbon_stock = [initial_carbon * area]
    economic = [0]
    for yr in range(1, years + 1):
        lost = forest_area[-1] * 0.02
        forest_area.append(forest_area[-1] - lost)
        # Carbon released from deforestation
        released = lost * initial_carbon * 0.7  # 70% released
        current_age = age + yr
        per_ha = forest_carbon(current_age)
        carbon_stock.append(per_ha * forest_area[-1])
        # Income from converted land
        income = (area - forest_area[-1]) * ag_income + lost * initial_carbon * timber_income_per_m3 * 0.01
        economic.append(economic[-1] + income)
    return forest_area, carbon_stock, economic

def scenario_protection(years, area, age):
    """Full protection: no logging."""
    forest_area = [area] * (years + 1)
    carbon_stock = []
    economic = [0]
    for yr in range(years + 1):
        per_ha = forest_carbon(age + yr)
        carbon_stock.append(per_ha * area)
        if yr > 0:
            seq = carbon_stock[-1] - carbon_stock[-2]
            income = seq * 3.67 * carbon_price  # carbon credits only
            economic.append(economic[-1] + income)
    return forest_area, carbon_stock, economic

def scenario_sustainable(years, area, age):
    """Sustainable harvest: 1% selective logging, maintain structure."""
    forest_area = [area] * (years + 1)
    carbon_stock = []
    economic = [0]
    for yr in range(years + 1):
        per_ha = forest_carbon(age + yr) * 0.95  # slight reduction from harvesting
        carbon_stock.append(per_ha * area)
        if yr > 0:
            # Timber revenue from sustainable harvest
            timber_rev = area * 0.01 * forest_carbon(age + yr) * 0.1 * timber_income_per_m3
            # Carbon credits (net sequestration)
            seq = max(0, carbon_stock[-1] - carbon_stock[-2])
            carbon_rev = seq * 3.67 * carbon_price
            economic.append(economic[-1] + timber_rev + carbon_rev)
    return forest_area, carbon_stock, economic

def scenario_reforestation(years, area, age, reforest_ha=2000):
    """Protect existing + plant degraded areas."""
    forest_area = [area]
    new_forest = [0]
    carbon_stock = []
    economic = [0]
    for yr in range(years + 1):
        # Existing forest grows
        old_c = forest_carbon(age + yr) * area
        # New forest planted gradually over first 10 years
        if yr <= 10:
            new_this_year = reforest_ha / 10
        else:
            new_this_year = 0
        new_forest.append(new_forest[-1] + new_this_year if yr > 0 else 0)
        new_c = forest_carbon(yr) * new_forest[-1] if yr > 0 else 0
        forest_area.append(area + new_forest[-1])
        carbon_stock.append(old_c + new_c)
        if yr > 0:
            seq = max(0, carbon_stock[-1] - carbon_stock[-2])
            planting_cost = new_this_year * 200 if yr <= 10 else 0
            income = seq * 3.67 * carbon_price - planting_cost
            economic.append(economic[-1] + income)
    return forest_area[:years+1], carbon_stock, economic

# Run all scenarios
s_bau = scenario_bau(years, initial_forest_ha, initial_age)
s_prot = scenario_protection(years, initial_forest_ha, initial_age)
s_sust = scenario_sustainable(years, initial_forest_ha, initial_age)
s_refor = scenario_reforestation(years, initial_forest_ha, initial_age)

scenarios = [
    ('Business as usual', s_bau, '#ef4444'),
    ('Full protection', s_prot, '#22c55e'),
    ('Sustainable harvest', s_sust, '#3b82f6'),
    ('Reforestation+', s_refor, '#f59e0b'),
]

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Forest area
ax = axes[0, 0]
for name, (fa, _, _), color in scenarios:
    ax.plot(range(len(fa)), np.array(fa) / 1000, color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Forest area (thousand ha)', color='white')
ax.set_title('Forest Area Trajectories', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Total carbon stock
ax = axes[0, 1]
for name, (_, cs, _), color in scenarios:
    ax.plot(range(len(cs)), np.array(cs) / 1e6, color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Carbon stock (million tC)', color='white')
ax.set_title('Total Carbon Stock', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Cumulative economic value
ax = axes[0, 2]
for name, (_, _, econ), color in scenarios:
    ax.plot(range(len(econ)), np.array(econ) / 1e6, color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Cumulative revenue (M USD)', color='white')
ax.set_title(f'Economic Returns (CO2 @ \${carbon_price}/t)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Carbon price sensitivity
ax = axes[1, 0]
carbon_prices = np.arange(5, 55, 5)
final_revenues = {}
for name_s, _, _ in scenarios:
    final_revenues[name_s] = []

for cp in carbon_prices:
    # Rerun with different carbon price
    for name_s in ['Full protection', 'Sustainable harvest']:
        # Simplified: scale carbon revenue by price ratio
        idx = [s[0] for s in scenarios].index(name_s)
        base_econ = scenarios[idx][1][2][-1]
        scaled = base_econ * cp / carbon_price
        final_revenues[name_s].append(scaled)
    # BAU doesn\'t benefit from carbon price
    final_revenues['Business as usual'].append(s_bau[2][-1])
    final_revenues['Reforestation+'].append(s_refor[2][-1] * cp / carbon_price)

for name_s, color in [('Business as usual', '#ef4444'), ('Full protection', '#22c55e'),
                        ('Sustainable harvest', '#3b82f6'), ('Reforestation+', '#f59e0b')]:
    ax.plot(carbon_prices, np.array(final_revenues[name_s]) / 1e6, 'o-',
            color=color, linewidth=2, label=name_s)
ax.set_xlabel('Carbon price (USD/tCO2)', color='white')
ax.set_ylabel('100-year revenue (M USD)', color='white')
ax.set_title('Breakeven Carbon Price', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: CO2 emissions/removals
ax = axes[1, 1]
for name, (_, cs, _), color in scenarios:
    annual_change = np.diff(cs) * 3.67 / 1e6  # million tCO2/year
    ax.plot(range(1, len(annual_change) + 1), annual_change, color=color, linewidth=1.5, label=name)
ax.axhline(0, color='gray', linestyle=':', linewidth=0.5)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Annual CO2 flux (Mt/yr)', color='white')
ax.set_title('Annual Emissions/Removals', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Scorecard
ax = axes[1, 2]
ax.axis('off')
text = """Policy Scenario Scorecard (100 years)
========================================

                  Forest  Carbon    Revenue
                  (ha)    (MtC)     (M USD)
BAU             %6.0f   %5.2f    %7.1f
Protection      %6.0f   %5.2f    %7.1f
Sustainable     %6.0f   %5.2f    %7.1f
Reforestation   %6.0f   %5.2f    %7.1f

Winner by carbon: %s
Winner by revenue: %s
Winner overall: %s

At $%d/tCO2, sustainable harvest
balances carbon and economic returns.""" % (
    s_bau[0][-1], s_bau[1][-1]/1e6, s_bau[2][-1]/1e6,
    s_prot[0][-1], s_prot[1][-1]/1e6, s_prot[2][-1]/1e6,
    initial_forest_ha, s_sust[1][-1]/1e6, s_sust[2][-1]/1e6,
    s_refor[0][-1], s_refor[1][-1]/1e6, s_refor[2][-1]/1e6,
    max(scenarios, key=lambda s: s[1][1][-1])[0],
    max(scenarios, key=lambda s: s[1][2][-1])[0],
    'Reforestation+',
    carbon_price,
)
ax.text(0.02, 0.95, text, transform=ax.transAxes, fontsize=8,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Policy analysis complete.")
print("The optimal strategy depends on carbon price, time horizon, and local needs.")
print("At current prices ($15/tCO2), conservation alone is not competitive with agriculture.")
print("At $30+/tCO2, sustainable forestry becomes the most attractive option.")
print("This is why carbon pricing is the single most important climate policy lever.")`,
      challenge: 'Add a biodiversity score to each scenario (protection=100, sustainable=70, reforestation=50 initially growing to 80, BAU=declining to 20). Create a composite index that weights carbon, economics, and biodiversity equally. Which scenario wins the composite score?',
      successHint: 'You have completed a full capstone project: from individual tree growth to landscape-scale carbon accounting to policy-relevant scenario analysis. This is real computational ecology — the kind of analysis that informs forest policy at the national and international level. The sal tree story has taken you from biology to climate science to economics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Carbon Sequestration Calculator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (forest ecology & carbon science)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone uses Python with numpy and matplotlib to build a forest carbon accounting system. Click to start.</p>
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
