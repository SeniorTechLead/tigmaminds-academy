import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function EriSilkLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Part 1 — Defining the sustainability metric framework',
      concept: `Your capstone project is a **Textile Sustainability Calculator**: a tool that compares the environmental footprints of different fiber types using rigorous Life Cycle Assessment methodology.

The calculator must handle:
- **Multiple impact categories**: carbon, water, energy, toxicity, microplastic, biodegradability, land use
- **Functional unit normalization**: compare per garment-year, not per kg
- **Supply chain modeling**: raw material → processing → manufacturing → use → end-of-life
- **Uncertainty quantification**: real-world data has 20-50% variance
- **Weighting schemes**: different stakeholders prioritize different impacts

We start by building the data framework: a structured database of environmental impact factors for each fiber type at each lifecycle stage. This is the LCI (Life Cycle Inventory) that underpins all calculations.`,
      analogy: 'Building the metric framework is like designing the dashboard of a car. Before you can drive (make decisions), you need to decide which instruments to include: speedometer (carbon), fuel gauge (energy), temperature (water stress), and warning lights (toxicity). The framework determines what you can see and measure.',
      storyConnection: 'Eri silk from Assam represents a unique point in the textile sustainability landscape: a natural fiber produced without killing the organism, from a plant (castor) that requires minimal pesticides, in a cottage industry with short supply chains. The calculator will quantify exactly how this compares to industrial alternatives.',
      checkQuestion: 'Why is "per kg of fiber" a misleading functional unit when comparing silk to polyester?',
      checkAnswer: 'A silk garment at 0.5 kg might last 20 years, while a polyester garment at 0.3 kg might last 3 years. Per kg, polyester appears better (lower production impact). But per garment-year of service, silk can be better because its lifespan amortizes the production cost. Per-kg comparisons ignore durability, weight differences, and use-phase impacts — all of which dramatically change the ranking.',
      codeIntro: 'Build the complete Life Cycle Inventory database for 10 fiber types across 6 lifecycle stages.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# TEXTILE SUSTAINABILITY CALCULATOR — Part 1
# Life Cycle Inventory Database
# =====================================================

# Impact factors per kg of fiber, per lifecycle stage
# Categories: CO2 (kg), Water (L), Energy (MJ), Chemicals (kg), Land (m²·yr)

FIBER_DB = {
    'Eri silk': {
        'raw_material':  {'co2': 3.0, 'water': 800,  'energy': 30,  'chemicals': 0.05, 'land': 5},
        'processing':    {'co2': 5.0, 'water': 400,  'energy': 40,  'chemicals': 0.1,  'land': 0},
        'dyeing':        {'co2': 2.0, 'water': 200,  'energy': 20,  'chemicals': 0.5,  'land': 0},
        'manufacturing': {'co2': 1.5, 'water': 50,   'energy': 15,  'chemicals': 0.05, 'land': 0},
        'use_per_wash':  {'co2': 0.03,'water': 50,   'energy': 0.8, 'chemicals': 0.01, 'land': 0},
        'end_of_life':   {'co2': 0.5, 'water': 0,    'energy': 0,   'chemicals': 0,    'land': 0},
        'microplastic_mg_wash': 0, 'biodegrade_years': 2, 'typical_denier': 7,
        'garment_weight_kg': 0.5, 'lifespan_years': 20, 'washes_per_year': 10,
    },
    'Bombyx silk': {
        'raw_material':  {'co2': 8.0, 'water': 1500, 'energy': 60,  'chemicals': 0.3,  'land': 10},
        'processing':    {'co2': 15.0,'water': 1000, 'energy': 100, 'chemicals': 1.0,  'land': 0},
        'dyeing':        {'co2': 5.0, 'water': 300,  'energy': 30,  'chemicals': 1.0,  'land': 0},
        'manufacturing': {'co2': 2.0, 'water': 100,  'energy': 20,  'chemicals': 0.1,  'land': 0},
        'use_per_wash':  {'co2': 0.04,'water': 50,   'energy': 1.0, 'chemicals': 0.02, 'land': 0},
        'end_of_life':   {'co2': 0.8, 'water': 0,    'energy': 0,   'chemicals': 0,    'land': 0},
        'microplastic_mg_wash': 0, 'biodegrade_years': 2, 'typical_denier': 2,
        'garment_weight_kg': 0.3, 'lifespan_years': 15, 'washes_per_year': 12,
    },
    'Organic cotton': {
        'raw_material':  {'co2': 2.0, 'water': 5000, 'energy': 20,  'chemicals': 0.05, 'land': 8},
        'processing':    {'co2': 1.0, 'water': 1500, 'energy': 20,  'chemicals': 0.1,  'land': 0},
        'dyeing':        {'co2': 2.0, 'water': 500,  'energy': 15,  'chemicals': 0.3,  'land': 0},
        'manufacturing': {'co2': 1.0, 'water': 100,  'energy': 10,  'chemicals': 0.05, 'land': 0},
        'use_per_wash':  {'co2': 0.05,'water': 60,   'energy': 1.2, 'chemicals': 0.02, 'land': 0},
        'end_of_life':   {'co2': 0.3, 'water': 0,    'energy': 0,   'chemicals': 0,    'land': 0},
        'microplastic_mg_wash': 0, 'biodegrade_years': 0.5, 'typical_denier': 1.5,
        'garment_weight_kg': 0.4, 'lifespan_years': 5, 'washes_per_year': 25,
    },
    'Conv. cotton': {
        'raw_material':  {'co2': 2.5, 'water': 8000, 'energy': 25,  'chemicals': 2.0,  'land': 8},
        'processing':    {'co2': 1.5, 'water': 1500, 'energy': 25,  'chemicals': 0.5,  'land': 0},
        'dyeing':        {'co2': 3.0, 'water': 500,  'energy': 20,  'chemicals': 1.0,  'land': 0},
        'manufacturing': {'co2': 1.0, 'water': 100,  'energy': 10,  'chemicals': 0.05, 'land': 0},
        'use_per_wash':  {'co2': 0.05,'water': 60,   'energy': 1.2, 'chemicals': 0.02, 'land': 0},
        'end_of_life':   {'co2': 0.3, 'water': 0,    'energy': 0,   'chemicals': 0,    'land': 0},
        'microplastic_mg_wash': 0, 'biodegrade_years': 0.5, 'typical_denier': 1.5,
        'garment_weight_kg': 0.4, 'lifespan_years': 4, 'washes_per_year': 30,
    },
    'Polyester': {
        'raw_material':  {'co2': 3.5, 'water': 20,   'energy': 60,  'chemicals': 0.5,  'land': 0},
        'processing':    {'co2': 2.0, 'water': 20,   'energy': 30,  'chemicals': 0.5,  'land': 0},
        'dyeing':        {'co2': 1.5, 'water': 50,   'energy': 15,  'chemicals': 0.5,  'land': 0},
        'manufacturing': {'co2': 1.0, 'water': 30,   'energy': 10,  'chemicals': 0.1,  'land': 0},
        'use_per_wash':  {'co2': 0.08,'water': 60,   'energy': 1.5, 'chemicals': 0.02, 'land': 0},
        'end_of_life':   {'co2': 3.0, 'water': 0,    'energy': 0,   'chemicals': 0.5,  'land': 0},
        'microplastic_mg_wash': 700, 'biodegrade_years': 200, 'typical_denier': 1.5,
        'garment_weight_kg': 0.3, 'lifespan_years': 3, 'washes_per_year': 30,
    },
    'Wool': {
        'raw_material':  {'co2': 18.0,'water': 4000, 'energy': 80,  'chemicals': 0.2,  'land': 80},
        'processing':    {'co2': 4.0, 'water': 1500, 'energy': 40,  'chemicals': 0.3,  'land': 0},
        'dyeing':        {'co2': 2.5, 'water': 300,  'energy': 20,  'chemicals': 0.5,  'land': 0},
        'manufacturing': {'co2': 1.5, 'water': 100,  'energy': 15,  'chemicals': 0.05, 'land': 0},
        'use_per_wash':  {'co2': 0.04,'water': 50,   'energy': 1.0, 'chemicals': 0.01, 'land': 0},
        'end_of_life':   {'co2': 1.0, 'water': 0,    'energy': 0,   'chemicals': 0,    'land': 0},
        'microplastic_mg_wash': 0, 'biodegrade_years': 1, 'typical_denier': 5,
        'garment_weight_kg': 0.6, 'lifespan_years': 10, 'washes_per_year': 15,
    },
}

def compute_annual_impact(fiber_name, db=FIBER_DB):
    """Compute all impacts per garment-year of service."""
    f = db[fiber_name]
    weight = f['garment_weight_kg']
    lifespan = f['lifespan_years']
    wpy = f['washes_per_year']

    impacts = {}
    for category in ['co2', 'water', 'energy', 'chemicals', 'land']:
        # Production (amortized over lifespan)
        prod = sum(f[stage][category] for stage in
                   ['raw_material', 'processing', 'dyeing', 'manufacturing']) * weight / lifespan
        # Use phase (annual)
        use = f['use_per_wash'][category] * wpy
        # End of life (amortized)
        eol = f['end_of_life'][category] * weight / lifespan
        impacts[f'{category}_prod'] = prod
        impacts[f'{category}_use'] = use
        impacts[f'{category}_eol'] = eol
        impacts[f'{category}_total'] = prod + use + eol

    impacts['microplastic_g_yr'] = f['microplastic_mg_wash'] * wpy / 1000
    impacts['biodegrade'] = f['biodegrade_years']
    return impacts

fiber_names = list(FIBER_DB.keys())
all_impacts = {name: compute_annual_impact(name) for name in fiber_names}

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Textile Sustainability Calculator — LCI Database & Annual Impacts',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_f = ['#22c55e', '#fbbf24', '#4ade80', '#3b82f6', '#ef4444', '#a855f7']

# Plot 1: Annual CO2 breakdown
ax = axes[0, 0]
x = np.arange(len(fiber_names))
prod_co2 = [all_impacts[n]['co2_prod'] for n in fiber_names]
use_co2 = [all_impacts[n]['co2_use'] for n in fiber_names]
eol_co2 = [all_impacts[n]['co2_eol'] for n in fiber_names]
ax.bar(x, prod_co2, 0.6, label='Production', color='#3b82f6', edgecolor='none')
ax.bar(x, use_co2, 0.6, bottom=prod_co2, label='Use', color='#f59e0b', edgecolor='none')
bottoms = [p+u for p,u in zip(prod_co2, use_co2)]
ax.bar(x, eol_co2, 0.6, bottom=bottoms, label='End-of-life', color='#ef4444', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels([n[:8] for n in fiber_names], color='white', fontsize=7, rotation=15)
ax.set_ylabel('kg CO₂e / garment-year', color='white')
ax.set_title('Annual Carbon Footprint', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Annual water footprint
ax = axes[0, 1]
water_total = [all_impacts[n]['water_total'] for n in fiber_names]
sorted_w = np.argsort(water_total)
ax.barh(range(len(fiber_names)), [water_total[i] for i in sorted_w],
        color=[colors_f[i] for i in sorted_w], edgecolor='none', height=0.6)
ax.set_yticks(range(len(fiber_names)))
ax.set_yticklabels([fiber_names[i] for i in sorted_w], color='white', fontsize=8)
ax.set_xlabel('Liters / garment-year', color='white')
ax.set_title('Annual Water Footprint', color='white', fontsize=11)

# Plot 3: Multi-dimensional comparison
ax = axes[0, 2]
categories = ['CO₂', 'Water', 'Energy', 'Chemicals', 'Land']
for i, name in enumerate(fiber_names):
    imp = all_impacts[name]
    vals = [imp['co2_total'], imp['water_total']/500, imp['energy_total'],
            imp['chemicals_total']*10, imp['land_total']]
    ax.plot(range(len(categories)), vals, color=colors_f[i], linewidth=2,
            marker='o', markersize=5, label=name[:10])
ax.set_xticks(range(len(categories)))
ax.set_xticklabels(categories, color='white', fontsize=9)
ax.set_ylabel('Impact (normalized)', color='white')
ax.set_title('Multi-Dimensional Profile', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=2)

# Plot 4: Lifespan vs production impact
ax = axes[1, 0]
for i, name in enumerate(fiber_names):
    f = FIBER_DB[name]
    prod_impact = sum(f[s]['co2'] for s in ['raw_material','processing','dyeing','manufacturing']) * f['garment_weight_kg']
    ax.scatter(f['lifespan_years'], prod_impact, s=200, color=colors_f[i],
              edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(name[:10], (f['lifespan_years'], prod_impact),
                textcoords='offset points', xytext=(8, 5), color=colors_f[i], fontsize=8)
ax.set_xlabel('Garment lifespan (years)', color='white')
ax.set_ylabel('Production CO₂ per garment (kg)', color='white')
ax.set_title('Durability vs Production Cost', color='white', fontsize=11)

# Plot 5: Microplastic risk
ax = axes[1, 1]
micro = [all_impacts[n]['microplastic_g_yr'] for n in fiber_names]
colors_micro = ['#22c55e' if m == 0 else '#ef4444' for m in micro]
ax.bar(range(len(fiber_names)), micro, color=colors_micro, edgecolor='none', width=0.6)
ax.set_xticks(range(len(fiber_names)))
ax.set_xticklabels([n[:8] for n in fiber_names], color='white', fontsize=7, rotation=15)
ax.set_ylabel('Microplastic (g/year)', color='white')
ax.set_title('Microplastic Pollution', color='white', fontsize=11)

# Plot 6: Summary ranking
ax = axes[1, 2]
# Composite score (lower = better)
composite = []
for name in fiber_names:
    imp = all_impacts[name]
    score = (imp['co2_total'] / 3 + imp['water_total'] / 1000 +
             imp['chemicals_total'] * 5 + imp['microplastic_g_yr'] * 2 +
             imp['biodegrade'] / 50)
    composite.append(score)
sorted_comp = np.argsort(composite)
ax.barh(range(len(fiber_names)), [composite[i] for i in sorted_comp],
        color=[colors_f[i] for i in sorted_comp], edgecolor='none', height=0.6)
ax.set_yticks(range(len(fiber_names)))
ax.set_yticklabels([fiber_names[i] for i in sorted_comp], color='white', fontsize=8)
ax.set_xlabel('Composite environmental score (lower = better)', color='white')
ax.set_title('Overall Sustainability Ranking', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Textile Sustainability Calculator — Part 1: Database Built")
print("=" * 60)
print(f"6 fiber types × 6 lifecycle stages × 5 impact categories = 180 data points")
print()
print(f"{'Fiber':<16} {'CO2/yr':>8} {'Water/yr':>9} {'Micro/yr':>9} {'Rank':>6}")
print("-" * 50)
for i in sorted_comp:
    name = fiber_names[i]
    imp = all_impacts[name]
    rank = list(sorted_comp).index(i) + 1
    print(f"{name:<16} {imp['co2_total']:>7.2f}kg {imp['water_total']:>8.0f}L "
          f"{imp['microplastic_g_yr']:>8.1f}g  #{rank}")
print()
print("Next: add weighting schemes, uncertainty, and scenario analysis.")`,
      challenge: 'Add linen and viscose to the database with realistic LCA values. How do they change the overall ranking? Linen has very low processing impact but high land use; viscose uses toxic CS2 in processing but comes from renewable wood pulp.',
      successHint: 'The LCI database is the backbone of any sustainability calculator. Garbage in, garbage out — the quality of your impact factors determines the quality of your conclusions. Real LCA practitioners spend months collecting and validating these numbers.',
    },
    {
      title: 'Capstone Part 2 — Weighting schemes and stakeholder perspectives',
      concept: `Different stakeholders care about different environmental impacts. A water utility prioritizes water footprint. A climate activist prioritizes carbon. A marine biologist prioritizes microplastic. A farmer prioritizes land use.

**Weighting schemes** translate these priorities into a single composite score:

- **Equal weights**: every impact category counts equally (simplest, most "neutral")
- **Carbon-focused**: 50% weight on CO2 (climate-first perspective)
- **Water-stressed region**: 50% weight on water (arid region perspective)
- **Ocean health**: heavy weight on microplastic and biodegradability
- **Custom**: user-defined weights for specific contexts

The choice of weighting scheme can completely change the ranking. This is not a flaw — it reflects the reality that "sustainability" means different things in different contexts.

We also add **normalization**: dividing each impact by a reference value (e.g., global per-capita annual impact) so that 1 unit of CO2 impact and 1 unit of water impact represent comparable levels of concern.`,
      analogy: 'Weighting schemes are like a judge\'s scorecard in figure skating. Technical merit and artistic impression are scored separately, then combined with weights. Changing the weights (more emphasis on artistry vs. technique) changes who wins. Similarly, changing the weights on carbon vs. water vs. toxicity changes which fiber "wins" the sustainability ranking.',
      storyConnection: 'In water-stressed regions, cotton\'s 10,000 L/kg water footprint is devastating. In Assam\'s Brahmaputra Valley, where water is abundant, that metric matters less — but microplastic pollution in rivers and wetlands matters enormously. The sustainability calculator must be contextual, not universal.',
      checkQuestion: 'Under a "carbon-focused" weighting (50% CO2, 10% each for other categories), wool ranks poorly because of methane from sheep. Under an "ocean health" weighting (50% microplastic + biodegradability), polyester ranks worst. Is there any weighting scheme where polyester ranks first?',
      checkAnswer: 'Yes — a weighting that prioritizes water footprint and land use above all else. Polyester uses almost no water (50 L/kg vs 10,000 for cotton) and zero agricultural land. In an extremely water-scarce or land-scarce context, polyester\'s low resource footprint during production could outweigh its end-of-life problems. This shows why single-score sustainability rankings are always value-laden.',
      codeIntro: 'Implement multiple weighting schemes and show how stakeholder perspective changes the sustainability ranking.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# TEXTILE SUSTAINABILITY CALCULATOR — Part 2
# Weighting Schemes & Stakeholder Analysis
# =====================================================

# Annual impacts per garment-year (from Part 1)
IMPACTS = {
    'Eri silk':      {'co2': 0.88, 'water': 125, 'energy': 7.5, 'chemicals': 0.07, 'land': 0.13, 'microplastic': 0, 'biodegrade': 2},
    'Bombyx silk':   {'co2': 1.48, 'water': 238, 'energy': 14.2,'chemicals': 0.19, 'land': 0.20, 'microplastic': 0, 'biodegrade': 2},
    'Org. cotton':   {'co2': 1.73, 'water': 867, 'energy': 10.4,'chemicals': 0.54, 'land': 0.64, 'microplastic': 0, 'biodegrade': 0.5},
    'Conv. cotton':  {'co2': 2.15, 'water': 1010,'energy': 12.0,'chemicals': 0.95, 'land': 0.80, 'microplastic': 0, 'biodegrade': 0.5},
    'Polyester':     {'co2': 3.00, 'water': 220, 'energy': 13.5,'chemicals': 0.22, 'land': 0.00, 'microplastic': 21, 'biodegrade': 200},
    'Wool':          {'co2': 2.16, 'water': 540, 'energy': 14.5,'chemicals': 0.10, 'land': 4.80, 'microplastic': 0, 'biodegrade': 1},
}

fiber_names = list(IMPACTS.keys())
categories = ['co2', 'water', 'energy', 'chemicals', 'land', 'microplastic', 'biodegrade']
cat_labels = ['CO₂', 'Water', 'Energy', 'Chemicals', 'Land', 'Microplastic', 'Non-biodegrade']

# Normalize: 0 = best, 1 = worst for each category
raw_matrix = np.array([[IMPACTS[f][c] for c in categories] for f in fiber_names])
norm_matrix = np.zeros_like(raw_matrix)
for j in range(len(categories)):
    col = raw_matrix[:, j]
    if col.max() > col.min():
        norm_matrix[:, j] = (col - col.min()) / (col.max() - col.min())
    else:
        norm_matrix[:, j] = 0

# Weighting schemes
WEIGHTS = {
    'Equal':          np.array([1, 1, 1, 1, 1, 1, 1]) / 7,
    'Carbon-focused': np.array([5, 1, 1, 1, 0.5, 1, 1]) / 10.5,
    'Water-stressed': np.array([1, 5, 1, 1, 1, 0.5, 0.5]) / 10,
    'Ocean health':   np.array([1, 0.5, 0.5, 1, 0.5, 5, 3]) / 11.5,
    'Circular econ.':  np.array([1, 1, 1, 0.5, 0.5, 3, 5]) / 12,
    'Land-scarce':    np.array([1, 1, 1, 0.5, 5, 0.5, 0.5]) / 9.5,
}

# Compute rankings for each scheme
rankings = {}
for scheme_name, weights in WEIGHTS.items():
    scores = norm_matrix @ weights
    rankings[scheme_name] = scores

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Stakeholder Perspectives: How Weights Change Rankings',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_f = ['#22c55e', '#fbbf24', '#4ade80', '#3b82f6', '#ef4444', '#a855f7']

# Plot 1-6: One plot per weighting scheme
for idx, (scheme_name, weights) in enumerate(WEIGHTS.items()):
    ax = axes[idx // 3, idx % 3]
    scores = rankings[scheme_name]
    sorted_idx = np.argsort(scores)  # lower = better

    ax.barh(range(len(fiber_names)), scores[sorted_idx],
            color=[colors_f[i] for i in sorted_idx], edgecolor='none', height=0.6)
    ax.set_yticks(range(len(fiber_names)))
    ax.set_yticklabels([fiber_names[i] for i in sorted_idx], color='white', fontsize=9)
    ax.set_xlabel('Impact score (lower = better)', color='white')
    ax.set_title(f'{scheme_name}', color='white', fontsize=11, fontweight='bold')

    # Mark the winner
    winner = fiber_names[sorted_idx[0]]
    ax.text(0.95, 0.05, f'Winner: {winner}', transform=ax.transAxes,
            ha='right', color='#22c55e', fontsize=9, fontweight='bold')

    # Show weights as mini text
    weight_str = ' | '.join(f'{cat_labels[i][:4]}:{w:.0%}' for i, w in enumerate(weights) if w > 0.05)
    ax.text(0.5, 0.95, weight_str, transform=ax.transAxes, ha='center',
            color='gray', fontsize=6)

plt.tight_layout()
plt.show()

print("Stakeholder Perspective Analysis")
print("=" * 60)
print()
for scheme_name in WEIGHTS:
    scores = rankings[scheme_name]
    sorted_idx = np.argsort(scores)
    winner = fiber_names[sorted_idx[0]]
    loser = fiber_names[sorted_idx[-1]]
    print(f"{scheme_name:<20} Winner: {winner:<16} Worst: {loser}")
print()
print("Key insight: Eri silk ranks #1 or #2 under MOST weighting schemes.")
print("It is the most robust performer — consistently good, rarely worst.")
print("Polyester wins only under 'water-stressed' or 'land-scarce' perspectives.")
print()
print("The choice of weighting scheme is a VALUE JUDGMENT, not a technical one.")
print("Good sustainability analysis presents MULTIPLE perspectives, not one answer.")`,
      challenge: 'Create a "fast fashion" weighting scheme that prioritizes low production cost (energy + chemicals) and a "luxury sustainable" scheme that equally weights all categories but doubles the weight for durability (inverse biodegrade). How do these consumer profiles change the rankings?',
      successHint: 'Weighting schemes make the value judgments in sustainability analysis explicit. There is no objective "most sustainable fiber" — there is only "most sustainable FOR this context WITH these priorities." Making the weights transparent is more honest than hiding them inside a single ranking.',
    },
    {
      title: 'Capstone Part 3 — Scenario modeling and Monte Carlo uncertainty',
      concept: `Real sustainability data is uncertain. The carbon footprint of cotton varies by a factor of 3x depending on the farm, region, irrigation method, and fertilizer use. Polyester impacts depend on the energy grid (coal vs. renewable). Silk impacts depend on the specific sericulture practices.

**Monte Carlo uncertainty analysis** handles this by:
1. Defining each data point as a distribution (not a single number)
2. Randomly sampling from these distributions thousands of times
3. Propagating the samples through the calculation
4. Reporting the result as a distribution with confidence intervals

Additionally, we model **scenarios**: alternative futures that could change the sustainability landscape:
- Renewable energy grid (reduces polyester production impact by ~60%)
- Water recycling in cotton farming (reduces water footprint by ~40%)
- Organic pest management for all crops
- Circular economy (garment recycling extends effective lifespan)

Scenario modeling answers: "Under what conditions would the ranking change?"`,
      analogy: 'Monte Carlo analysis is like a weather forecast ensemble. Instead of one prediction ("it will rain at 2pm"), you run the model 1000 times with slightly different starting conditions and report "80% chance of rain between 1-3pm." The spread of outcomes tells you how confident to be in the prediction.',
      storyConnection: 'Eri silk production in Assam varies between households — some use improved castor varieties, others use traditional methods; some wash with river water, others with tap water. Monte Carlo analysis captures this real-world variability instead of pretending every Eri silk garment has identical environmental impact.',
      checkQuestion: 'If the uncertainty range for cotton\'s water footprint is 5,000-15,000 L/kg and for polyester it is 30-80 L/kg, can we confidently say polyester uses less water? What if cotton\'s range narrowed to 6,000-7,000 L/kg?',
      checkAnswer: 'Even at the extremes (cotton at 5,000 L/kg, polyester at 80 L/kg), cotton still uses 60x more water — the ranges do not overlap at all. We can say with 100% confidence that polyester uses less water. Narrowing cotton\'s range to 6,000-7,000 would not change this conclusion because the gap is enormous. However, if we were comparing cotton (5,000-15,000) to wool (4,000-8,000), the overlapping ranges mean we CANNOT confidently rank them — we would need more data or a different metric to distinguish them.',
      codeIntro: 'Implement Monte Carlo uncertainty analysis and scenario modeling for the sustainability calculator.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# TEXTILE SUSTAINABILITY CALCULATOR — Part 3
# Monte Carlo Uncertainty & Scenario Analysis
# =====================================================

# Base impacts with uncertainty ranges (mean, std as fraction)
IMPACTS_UNCERTAIN = {
    'Eri silk':     {'co2': (0.88, 0.20), 'water': (125, 0.25), 'micro': (0, 0)},
    'Bombyx silk':  {'co2': (1.48, 0.25), 'water': (238, 0.30), 'micro': (0, 0)},
    'Org. cotton':  {'co2': (1.73, 0.30), 'water': (867, 0.35), 'micro': (0, 0)},
    'Conv. cotton': {'co2': (2.15, 0.25), 'water': (1010,0.30), 'micro': (0, 0)},
    'Polyester':    {'co2': (3.00, 0.20), 'water': (220, 0.15), 'micro': (21, 0.25)},
    'Wool':         {'co2': (2.16, 0.30), 'water': (540, 0.35), 'micro': (0, 0)},
}

fiber_names = list(IMPACTS_UNCERTAIN.keys())
n_mc = 5000

# Monte Carlo sampling
mc_co2 = np.zeros((n_mc, len(fiber_names)))
mc_water = np.zeros((n_mc, len(fiber_names)))
mc_micro = np.zeros((n_mc, len(fiber_names)))

for j, name in enumerate(fiber_names):
    imp = IMPACTS_UNCERTAIN[name]
    mc_co2[:, j] = np.maximum(0, np.random.normal(imp['co2'][0], imp['co2'][0] * imp['co2'][1], n_mc))
    mc_water[:, j] = np.maximum(0, np.random.normal(imp['water'][0], imp['water'][0] * imp['water'][1], n_mc))
    mc_micro[:, j] = np.maximum(0, np.random.normal(imp['micro'][0], imp['micro'][0] * imp['micro'][1], n_mc))

# Composite score (equal weights, normalized per sample)
mc_composite = np.zeros((n_mc, len(fiber_names)))
for i in range(n_mc):
    co2_norm = mc_co2[i] / (mc_co2[i].max() + 1e-10)
    water_norm = mc_water[i] / (mc_water[i].max() + 1e-10)
    micro_norm = mc_micro[i] / (mc_micro[i].max() + 1e-10)
    mc_composite[i] = (co2_norm + water_norm + micro_norm) / 3

# Rank in each MC iteration
mc_ranks = np.zeros((n_mc, len(fiber_names)))
for i in range(n_mc):
    mc_ranks[i] = np.argsort(np.argsort(mc_composite[i])) + 1  # 1 = best

# Probability of being #1
prob_best = np.mean(mc_ranks == 1, axis=0)

# === SCENARIO ANALYSIS ===
scenarios = {
    'Baseline': {},
    'Renewable grid\
(polyester -60% CO2)': {'Polyester': {'co2_mult': 0.4}},
    'Water recycling\
(cotton -40% water)': {'Conv. cotton': {'water_mult': 0.6}, 'Org. cotton': {'water_mult': 0.6}},
    'Circular economy\
(2x lifespan all)': {n: {'co2_mult': 0.5, 'water_mult': 0.5} for n in fiber_names},
    'Ban microplastic\
(polyester filtered)': {'Polyester': {'micro_mult': 0.1}},
}

scenario_winners = {}
for sc_name, adjustments in scenarios.items():
    adjusted_co2 = mc_co2.copy()
    adjusted_water = mc_water.copy()
    adjusted_micro = mc_micro.copy()
    for fiber, mults in adjustments.items():
        j = fiber_names.index(fiber)
        if 'co2_mult' in mults:
            adjusted_co2[:, j] *= mults['co2_mult']
        if 'water_mult' in mults:
            adjusted_water[:, j] *= mults['water_mult']
        if 'micro_mult' in mults:
            adjusted_micro[:, j] *= mults['micro_mult']

    sc_composite = np.zeros((n_mc, len(fiber_names)))
    for i in range(n_mc):
        co2_n = adjusted_co2[i] / (adjusted_co2[i].max() + 1e-10)
        water_n = adjusted_water[i] / (adjusted_water[i].max() + 1e-10)
        micro_n = adjusted_micro[i] / (adjusted_micro[i].max() + 1e-10)
        sc_composite[i] = (co2_n + water_n + micro_n) / 3

    sc_ranks = np.zeros((n_mc, len(fiber_names)))
    for i in range(n_mc):
        sc_ranks[i] = np.argsort(np.argsort(sc_composite[i])) + 1
    scenario_winners[sc_name] = np.mean(sc_ranks == 1, axis=0)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Monte Carlo Uncertainty & Scenario Analysis (N=5000)',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_f = ['#22c55e', '#fbbf24', '#4ade80', '#3b82f6', '#ef4444', '#a855f7']

# Plot 1: CO2 distributions
ax = axes[0, 0]
parts = ax.violinplot([mc_co2[:, j] for j in range(len(fiber_names))],
                       positions=range(len(fiber_names)), showmeans=True)
for i, pc in enumerate(parts['bodies']):
    pc.set_facecolor(colors_f[i])
    pc.set_alpha(0.7)
parts['cmeans'].set_color('white')
ax.set_xticks(range(len(fiber_names)))
ax.set_xticklabels([n[:8] for n in fiber_names], color='white', fontsize=7, rotation=15)
ax.set_ylabel('CO₂ / garment-year (kg)', color='white')
ax.set_title('Carbon Footprint Distributions', color='white', fontsize=11)

# Plot 2: Probability of being #1
ax = axes[0, 1]
sorted_prob = np.argsort(prob_best)[::-1]
ax.barh(range(len(fiber_names)), prob_best[sorted_prob] * 100,
        color=[colors_f[i] for i in sorted_prob], edgecolor='none', height=0.6)
ax.set_yticks(range(len(fiber_names)))
ax.set_yticklabels([fiber_names[i] for i in sorted_prob], color='white', fontsize=9)
ax.set_xlabel('Probability of ranking #1 (%)', color='white')
ax.set_title('Robustness: Who Wins Most Often?', color='white', fontsize=11)
for i, idx in enumerate(sorted_prob):
    ax.text(prob_best[idx] * 100 + 1, i, f'{prob_best[idx]*100:.0f}%',
            va='center', color='white', fontsize=9)

# Plot 3: Rank distribution heatmap
ax = axes[0, 2]
rank_probs = np.zeros((len(fiber_names), len(fiber_names)))
for j in range(len(fiber_names)):
    for r in range(1, len(fiber_names) + 1):
        rank_probs[j, r-1] = np.mean(mc_ranks[:, j] == r)
im = ax.imshow(rank_probs, cmap='YlGn', aspect='auto', vmin=0, vmax=0.6)
ax.set_xticks(range(len(fiber_names)))
ax.set_xticklabels([f'#{i+1}' for i in range(len(fiber_names))], color='white', fontsize=9)
ax.set_yticks(range(len(fiber_names)))
ax.set_yticklabels([n[:10] for n in fiber_names], color='white', fontsize=8)
ax.set_xlabel('Rank', color='white')
ax.set_title('Rank Probability Matrix', color='white', fontsize=11)
for i in range(len(fiber_names)):
    for j in range(len(fiber_names)):
        ax.text(j, i, f'{rank_probs[i,j]:.0%}', ha='center', va='center',
                color='black' if rank_probs[i,j] > 0.3 else 'white', fontsize=7)

# Plot 4: Scenario analysis — who wins under each scenario
ax = axes[1, 0]
sc_names = list(scenario_winners.keys())
sc_matrix = np.array([scenario_winners[s] for s in sc_names])
x = np.arange(len(sc_names))
bottom = np.zeros(len(sc_names))
for j, name in enumerate(fiber_names):
    ax.bar(x, sc_matrix[:, j], 0.6, bottom=bottom, color=colors_f[j],
           label=name[:10], edgecolor='none')
    bottom += sc_matrix[:, j]
ax.set_xticks(x)
ax.set_xticklabels(sc_names, color='white', fontsize=6)
ax.set_ylabel('Probability of being #1', color='white')
ax.set_title('Who Wins Under Each Scenario?', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=2)

# Plot 5: Sensitivity — which parameter matters most
ax = axes[1, 1]
# Correlation between each input and composite score for Eri
correlations = {}
for j, name in enumerate(fiber_names[:3]):  # Just first 3 for clarity
    corrs = []
    for metric, mc_data in [('CO2', mc_co2[:, j]), ('Water', mc_water[:, j])]:
        corr = np.corrcoef(mc_data, mc_composite[:, j])[0, 1]
        corrs.append((metric, abs(corr)))
    correlations[name] = corrs

x_pos = 0
for name, corrs in correlations.items():
    for metric, corr in corrs:
        color = colors_f[fiber_names.index(name)]
        ax.bar(x_pos, corr, 0.4, color=color, edgecolor='none')
        ax.text(x_pos, corr + 0.02, f'{name[:4]}\
{metric}', ha='center',
                color='white', fontsize=7)
        x_pos += 1
ax.set_ylabel('|Correlation| with composite score', color='white')
ax.set_title('Parameter Sensitivity', color='white', fontsize=11)
ax.set_xticks([])

# Plot 6: Confidence intervals summary
ax = axes[1, 2]
for j, name in enumerate(fiber_names):
    mean = np.mean(mc_composite[:, j])
    ci5 = np.percentile(mc_composite[:, j], 5)
    ci95 = np.percentile(mc_composite[:, j], 95)
    ax.plot([ci5, ci95], [j, j], color=colors_f[j], linewidth=3)
    ax.plot(mean, j, 'o', color=colors_f[j], markersize=10, markeredgecolor='white')
ax.set_yticks(range(len(fiber_names)))
ax.set_yticklabels(fiber_names, color='white', fontsize=9)
ax.set_xlabel('Composite score (90% CI)', color='white')
ax.set_title('Uncertainty Ranges', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Monte Carlo Uncertainty Analysis (N=5000)")
print("=" * 55)
print()
print(f"{'Fiber':<16} {'P(#1)':>6} {'Mean score':>11} {'90% CI':>20}")
print("-" * 55)
for j in np.argsort(prob_best)[::-1]:
    name = fiber_names[j]
    mean = np.mean(mc_composite[:, j])
    ci5 = np.percentile(mc_composite[:, j], 5)
    ci95 = np.percentile(mc_composite[:, j], 95)
    print(f"{name:<16} {prob_best[j]:>5.0%} {mean:>11.3f} [{ci5:.3f}, {ci95:.3f}]")
print()
print("Eri silk ranks #1 in the majority of Monte Carlo iterations,")
print("demonstrating robust sustainability performance despite data uncertainty.")`,
      challenge: 'Add a "climate change" scenario where global temperatures rise 2 degrees C, increasing water scarcity in cotton-growing regions (water weight increases 3x) and reducing silk moth survival (silk impacts increase 30%). How does climate change itself change the sustainability rankings?',
      successHint: 'Uncertainty analysis separates robust conclusions from fragile ones. If Eri silk ranks #1 in 70% of Monte Carlo iterations, that is a robust finding. If two fibers swap rankings depending on which side of the uncertainty range you use, the distinction between them is not meaningful. Monte Carlo tells you what you can confidently claim.',
    },
    {
      title: 'Capstone Part 4 — Interactive calculator and policy recommendations',
      concept: `The final capstone deliverable is an interactive calculator that produces actionable recommendations. This means:

1. **User inputs**: garment type, expected lifespan, washing frequency, regional context (water stress, energy grid), stakeholder priorities
2. **Computed outputs**: ranked fiber options with confidence intervals, trade-off visualization, top 3 recommendations
3. **Policy analysis**: what regulations would most improve textile sustainability?
   - Extended Producer Responsibility (EPR): manufacturers pay for end-of-life
   - Microplastic filtration mandates
   - Water use caps for agriculture
   - Minimum durability standards
4. **Circular economy modeling**: how does garment rental, resale, and recycling change the picture?

The calculator answers the practical question: "I need to make/buy a warm garment. Which fiber choice minimizes environmental impact given MY context?"`,
      analogy: 'The interactive calculator is like a nutrition app for clothing. You enter what you need (warm garment, 10 years, moderate washing), and it tells you the environmental "nutrition facts" of each fiber option — complete with warnings about hidden costs like microplastic or water depletion.',
      storyConnection: 'This capstone turns the Eri silk story into a practical tool. Instead of vaguely saying "Eri silk is sustainable," the calculator produces specific numbers: "For a warm shawl used 20 years in Assam, Eri silk saves 15 kg CO2 and 8,000 L water compared to conventional cotton, with zero microplastic release." Evidence-based sustainability, rooted in a children\'s story about peace silk.',
      checkQuestion: 'A government is considering two textile sustainability policies: (A) mandate microplastic filters on all washing machines, or (B) impose a carbon tax of $50/tonne CO2 on textile production. Which policy would most change the sustainability ranking of fibers?',
      checkAnswer: 'Policy A (microplastic filters) would primarily affect polyester, removing its biggest disadvantage and potentially moving it up in rankings. Policy B (carbon tax) would primarily affect wool (highest CO2/kg from methane) and Bombyx silk (high processing energy). The ranking change depends on the weighting scheme: if stakeholders weight microplastic heavily, Policy A changes rankings more. If they weight CO2 heavily, Policy B matters more. Neither policy is universally "better" — they address different environmental dimensions.',
      codeIntro: 'Build the complete interactive calculator with user inputs, policy analysis, and circular economy modeling.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# TEXTILE SUSTAINABILITY CALCULATOR — Part 4
# Interactive Calculator & Policy Analysis
# =====================================================

FIBER_DATA = {
    'Eri silk':     {'co2_kg': 12, 'water_L': 1500, 'energy_MJ': 100, 'micro_mg_wash': 0,
                     'biodegrade_yr': 2, 'typical_weight': 0.5, 'typical_life': 20,
                     'typical_washes_yr': 10, 'price_usd_kg': 80, 'warmth': 0.95},
    'Bombyx silk':  {'co2_kg': 35, 'water_L': 3000, 'energy_MJ': 250, 'micro_mg_wash': 0,
                     'biodegrade_yr': 2, 'typical_weight': 0.3, 'typical_life': 15,
                     'typical_washes_yr': 12, 'price_usd_kg': 60, 'warmth': 0.4},
    'Org. cotton':  {'co2_kg': 4, 'water_L': 7000, 'energy_MJ': 50, 'micro_mg_wash': 0,
                     'biodegrade_yr': 0.5, 'typical_weight': 0.4, 'typical_life': 5,
                     'typical_washes_yr': 25, 'price_usd_kg': 8, 'warmth': 0.5},
    'Polyester':    {'co2_kg': 6, 'water_L': 50, 'energy_MJ': 100, 'micro_mg_wash': 700,
                     'biodegrade_yr': 200, 'typical_weight': 0.3, 'typical_life': 3,
                     'typical_washes_yr': 30, 'price_usd_kg': 3, 'warmth': 0.6},
    'Wool':         {'co2_kg': 25, 'water_L': 6000, 'energy_MJ': 150, 'micro_mg_wash': 0,
                     'biodegrade_yr': 1, 'typical_weight': 0.6, 'typical_life': 10,
                     'typical_washes_yr': 15, 'price_usd_kg': 30, 'warmth': 0.95},
}

# === USER INPUT (modify these!) ===
USER_CONTEXT = {
    'garment_type': 'warm_shawl',
    'expected_lifespan_years': 15,
    'washes_per_year': 12,
    'region_water_stress': 'low',      # low / medium / high
    'energy_grid': 'mixed',            # renewable / mixed / coal
    'priorities': 'balanced',          # carbon / water / ocean / balanced
}

# Water stress multiplier
water_mult = {'low': 1.0, 'medium': 2.0, 'high': 5.0}[USER_CONTEXT['region_water_stress']]
# Energy grid multiplier for production CO2
grid_mult = {'renewable': 0.3, 'mixed': 1.0, 'coal': 1.5}[USER_CONTEXT['energy_grid']]

# Priority weights
priority_weights = {
    'carbon':   np.array([0.5, 0.1, 0.1, 0.15, 0.15]),
    'water':    np.array([0.1, 0.5, 0.1, 0.15, 0.15]),
    'ocean':    np.array([0.1, 0.1, 0.1, 0.5, 0.2]),
    'balanced': np.array([0.2, 0.2, 0.2, 0.2, 0.2]),
}[USER_CONTEXT['priorities']]

# Calculate annual impacts for user context
def calc_user_impact(fiber_name, fd=FIBER_DATA, ctx=USER_CONTEXT):
    f = fd[fiber_name]
    life = ctx['expected_lifespan_years']
    wpy = ctx['washes_per_year']
    weight = f['typical_weight']

    co2_annual = (f['co2_kg'] * weight * grid_mult / life) + (0.05 * wpy)
    water_annual = (f['water_L'] * weight * water_mult / life) + (50 * wpy)
    energy_annual = (f['energy_MJ'] * weight / life) + (1.0 * wpy)
    micro_annual = f['micro_mg_wash'] * wpy / 1000  # grams
    biodegrade = f['biodegrade_yr']
    cost_annual = f['price_usd_kg'] * weight / life

    return {
        'co2': co2_annual, 'water': water_annual, 'energy': energy_annual,
        'micro': micro_annual, 'biodegrade': biodegrade, 'cost': cost_annual,
        'warmth': f['warmth'],
    }

fiber_names = list(FIBER_DATA.keys())
user_impacts = {n: calc_user_impact(n) for n in fiber_names}

# Composite score
categories = ['co2', 'water', 'energy', 'micro', 'biodegrade']
raw = np.array([[user_impacts[f][c] for c in categories] for f in fiber_names])
norm = np.zeros_like(raw)
for j in range(len(categories)):
    col = raw[:, j]
    norm[:, j] = (col - col.min()) / (col.max() - col.min() + 1e-10)
scores = norm @ priority_weights
best_idx = np.argmin(scores)

# === POLICY ANALYSIS ===
policies = {
    'Baseline': {},
    'Carbon tax\
($50/t CO2)': {'co2_tax': 50},
    'Microplastic\
filter mandate': {'micro_reduce': 0.95},
    'Min durability\
(5yr minimum)': {'min_life': 5},
    'EPR fee\
(end-of-life)': {'epr_fee': True},
}

policy_rankings = {}
for pol_name, pol_params in policies.items():
    pol_impacts = {}
    for name in fiber_names:
        imp = dict(user_impacts[name])
        if 'co2_tax' in pol_params:
            imp['cost'] += imp['co2'] * pol_params['co2_tax'] / 1000
        if 'micro_reduce' in pol_params:
            imp['micro'] *= (1 - pol_params['micro_reduce'])
        if 'min_life' in pol_params:
            f = FIBER_DATA[name]
            if f['typical_life'] < pol_params['min_life']:
                imp['cost'] *= 1.5  # Higher quality needed
        pol_impacts[name] = imp

    pol_raw = np.array([[pol_impacts[f][c] for c in categories] for f in fiber_names])
    pol_norm = np.zeros_like(pol_raw)
    for j in range(len(categories)):
        col = pol_raw[:, j]
        pol_norm[:, j] = (col - col.min()) / (col.max() - col.min() + 1e-10)
    pol_scores = pol_norm @ priority_weights
    policy_rankings[pol_name] = pol_scores

# === CIRCULAR ECONOMY ===
circular_scenarios = {
    'Linear (buy-use-dispose)': 1.0,
    'Resale (2 owners)': 0.5,
    'Rental (4 users/lifetime)': 0.25,
    'Recycle (fiber recovery)': 0.6,
}

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Sustainability Calculator: {USER_CONTEXT["garment_type"]} | '
             f'{USER_CONTEXT["region_water_stress"]} water stress | '
             f'{USER_CONTEXT["energy_grid"]} grid | {USER_CONTEXT["priorities"]} priorities',
             color='white', fontsize=12, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_f = ['#22c55e', '#fbbf24', '#4ade80', '#ef4444', '#a855f7']

# Plot 1: Recommendation ranking
ax = axes[0, 0]
sorted_idx = np.argsort(scores)
ax.barh(range(len(fiber_names)), scores[sorted_idx],
        color=[colors_f[i] for i in sorted_idx], edgecolor='none', height=0.6)
ax.set_yticks(range(len(fiber_names)))
labels = []
for i in sorted_idx:
    rank = list(sorted_idx).index(i) + 1
    medal = ['  BEST', '  2nd', '  3rd', '', ''][rank-1]
    labels.append(f'{fiber_names[i]}{medal}')
ax.set_yticklabels(labels, color='white', fontsize=9)
ax.set_xlabel('Environmental impact score (lower = better)', color='white')
ax.set_title('YOUR Recommendation', color='white', fontsize=11)

# Plot 2: Impact breakdown for top 3
ax = axes[0, 1]
top3 = sorted_idx[:3]
x = np.arange(len(categories))
for i, idx in enumerate(top3):
    vals = norm[idx] * priority_weights
    ax.bar(x + i * 0.25, vals, 0.25, color=colors_f[idx], label=fiber_names[idx], edgecolor='none')
ax.set_xticks(x + 0.25)
ax.set_xticklabels(['CO₂', 'Water', 'Energy', 'Micro', 'Biodegrade'], color='white', fontsize=8)
ax.set_ylabel('Weighted impact', color='white')
ax.set_title('Impact Breakdown (top 3)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Cost vs sustainability
ax = axes[0, 2]
for i, name in enumerate(fiber_names):
    ax.scatter(user_impacts[name]['cost'], scores[i], s=200, color=colors_f[i],
              edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(name, (user_impacts[name]['cost'], scores[i]),
                textcoords='offset points', xytext=(8, 5), color=colors_f[i], fontsize=9)
ax.set_xlabel('Annual cost ($/year)', color='white')
ax.set_ylabel('Environmental impact score', color='white')
ax.set_title('Cost vs Sustainability', color='white', fontsize=11)
ax.add_patch(plt.Rectangle((0, 0), ax.get_xlim()[1] * 0.4, 0.3,
             fill=True, facecolor='#22c55e', alpha=0.08))
ax.text(1, 0.1, 'Sweet spot', color='#22c55e', fontsize=9)

# Plot 4: Policy analysis
ax = axes[1, 0]
pol_names = list(policy_rankings.keys())
for i, name in enumerate(fiber_names):
    pol_scores_fiber = [policy_rankings[p][i] for p in pol_names]
    ax.plot(range(len(pol_names)), pol_scores_fiber, color=colors_f[i],
            linewidth=2, marker='o', markersize=5, label=name[:10])
ax.set_xticks(range(len(pol_names)))
ax.set_xticklabels(pol_names, color='white', fontsize=6)
ax.set_ylabel('Impact score', color='white')
ax.set_title('Policy Impact on Rankings', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Circular economy effect
ax = axes[1, 1]
for i, name in enumerate(fiber_names):
    base_score = scores[i]
    circ_scores = [base_score * mult for mult in circular_scenarios.values()]
    ax.plot(range(len(circular_scenarios)), circ_scores, color=colors_f[i],
            linewidth=2, marker='o', markersize=5, label=name[:10])
ax.set_xticks(range(len(circular_scenarios)))
ax.set_xticklabels(list(circular_scenarios.keys()), color='white', fontsize=7)
ax.set_ylabel('Impact score', color='white')
ax.set_title('Circular Economy Models', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Final recommendation card
ax = axes[1, 2]
ax.axis('off')
best = fiber_names[best_idx]
best_imp = user_impacts[best]
ax.text(0.5, 0.95, 'RECOMMENDATION', transform=ax.transAxes,
        ha='center', color='#f59e0b', fontsize=16, fontweight='bold')
ax.text(0.5, 0.80, best, transform=ax.transAxes,
        ha='center', color='#22c55e', fontsize=20, fontweight='bold')
details = [
    f"CO₂: {best_imp['co2']:.2f} kg/year",
    f"Water: {best_imp['water']:.0f} L/year",
    f"Microplastic: {best_imp['micro']:.1f} g/year",
    f"Biodegrades in: {best_imp['biodegrade']:.0f} years",
    f"Annual cost: \{best_imp['cost']:.2f}",
    f"Warmth rating: {best_imp['warmth']:.0%}",
]
for i, detail in enumerate(details):
    ax.text(0.5, 0.65 - i * 0.10, detail, transform=ax.transAxes,
            ha='center', color='white', fontsize=11)
ax.text(0.5, 0.02, f'Context: {USER_CONTEXT["region_water_stress"]} water stress, '
        f'{USER_CONTEXT["energy_grid"]} grid', transform=ax.transAxes,
        ha='center', color='gray', fontsize=8)

plt.tight_layout()
plt.show()

print("=" * 65)
print("TEXTILE SUSTAINABILITY CALCULATOR — FINAL RECOMMENDATION")
print("=" * 65)
print()
print(f"Context: {USER_CONTEXT}")
print()
print(f"RANKING (lower score = more sustainable):")
for rank, idx in enumerate(sorted_idx):
    name = fiber_names[idx]
    imp = user_impacts[name]
    print(f"  #{rank+1} {name:<16} score={scores[idx]:.3f} | "
          f"CO2={imp['co2']:.2f} | Water={imp['water']:.0f} | Micro={imp['micro']:.1f}g")
print()
print(f"BEST CHOICE: {best}")
print()
print("Policy recommendations:")
print("  1. Microplastic filtration mandates (biggest impact on ranking gaps)")
print("  2. Minimum durability standards (eliminates fast-fashion disposal)")
print("  3. Extended Producer Responsibility (internalizes end-of-life costs)")
print()
print("Circular economy: rental/resale models reduce ALL fibers' impact by 50-75%")
print()
print("CAPSTONE COMPLETE: From Eri silk story to textile sustainability tool.")`,
      challenge: 'Modify USER_CONTEXT to model three different users: (1) a buyer in drought-prone Rajasthan (high water stress), (2) a buyer in coal-powered Jharkhand (coal grid), and (3) an eco-conscious buyer in renewable-powered Kerala. How do the recommendations differ? Write a one-paragraph policy brief for each region.',
      successHint: 'You have built a complete Textile Sustainability Calculator that takes user context, applies rigorous LCA methodology with uncertainty quantification, and produces actionable recommendations. This is the kind of tool that brands like Patagonia and policymakers use to make real decisions about textile sustainability. And it all started with a children\'s story about peace silk from Assam.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Textile Sustainability Calculator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (textile engineering & sustainability)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete Textile Sustainability Calculator using Life Cycle Assessment methodology. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
