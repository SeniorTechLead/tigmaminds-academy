import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RicePlantedLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Soil science — NPK and the chemistry of fertility',
      concept: `Soil is not dirt. It's a living ecosystem containing minerals, organic matter, water, air, and billions of organisms per gram. Plants need 17 essential nutrients from soil, but three dominate:

**Nitrogen (N)**: The growth nutrient. Essential for proteins, chlorophyll, and DNA. Deficiency: yellow leaves, stunted growth. Rice needs 80-120 kg N/ha per crop.

**Phosphorus (P)**: The energy nutrient. Essential for ATP (energy currency), DNA, and root development. Deficiency: purple leaves, poor roots. Rice needs 20-40 kg P/ha.

**Potassium (K)**: The resilience nutrient. Essential for water regulation, disease resistance, and grain filling. Deficiency: brown leaf edges, weak stems. Rice needs 40-80 kg K/ha.

The **NPK ratio** on fertilizer bags (e.g., 10-20-10) tells you the percentage of each: 10% nitrogen, 20% phosphorus pentoxide, 10% potassium oxide.

**Liebig's Law of the Minimum**: Plant growth is limited by the scarcest nutrient, not the most abundant. If you have plenty of N and K but no P, the plant grows as if ALL nutrients are scarce.

The Haber-Bosch process (1909) — synthesizing ammonia from air — is considered the most important invention of the 20th century. It currently supports feeding ~4 billion people.`,
      analogy: 'NPK is like a recipe for plant food. Nitrogen is the protein (builds muscle/leaves). Phosphorus is the carbohydrate (provides energy/roots). Potassium is the vitamin (boosts immunity/resilience). Missing any one ingredient makes the whole meal inadequate.',
      storyConnection: 'When the Tiwa people planted the first rice, they didn\'t add fertilizer — the forest soil was rich in all nutrients from centuries of decomposed leaves. This is why shifting cultivation (jhum) worked: the forest accumulated nutrients over years, then the farmer harvested them in one crop season.',
      checkQuestion: 'The Haber-Bosch process consumes 1-2% of global energy to produce nitrogen fertilizer. If we eliminated synthetic nitrogen, how many people could the Earth feed?',
      checkAnswer: 'About 4 billion — roughly half the current population. Vaclav Smil calculated that without synthetic nitrogen, global food production would drop by 40-50%. We literally cannot feed 8 billion people without the Haber-Bosch process — or a replacement technology.',
      codeIntro: 'Model crop growth as a function of NPK nutrient availability using Liebig\'s Law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def growth_response(nutrient, c=0.02, ymax=100):
    return ymax * (1 - np.exp(-c * nutrient))

n_levels = np.linspace(0, 200, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(n_levels, growth_response(n_levels, c=0.015), color='#22c55e', linewidth=2, label='Nitrogen')
ax1.plot(n_levels, growth_response(n_levels, c=0.04), color='#3b82f6', linewidth=2, label='Phosphorus')
ax1.plot(n_levels, growth_response(n_levels, c=0.025), color='#f59e0b', linewidth=2, label='Potassium')
ax1.set_xlabel('Nutrient applied (kg/ha)', color='white')
ax1.set_ylabel('Yield potential (%)', color='white')
ax1.set_title('Diminishing Returns: Each Nutrient', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
y_n = growth_response(n_levels, c=0.015)
p_fixed = growth_response(40, c=0.04)
k_fixed = growth_response(60, c=0.025)
y_actual = np.minimum(y_n, np.minimum(p_fixed, k_fixed))
ax2.plot(n_levels, y_n, color='#22c55e', linewidth=2, linestyle='--', label='N response', alpha=0.5)
ax2.axhline(p_fixed, color='#3b82f6', linewidth=1, linestyle=':', label=f'P ceiling ({p_fixed:.0f}%)')
ax2.axhline(k_fixed, color='#f59e0b', linewidth=1, linestyle=':', label=f'K ceiling ({k_fixed:.0f}%)')
ax2.plot(n_levels, y_actual, color='#ef4444', linewidth=2, label='Actual yield (Liebig)')
ax2.fill_between(n_levels, y_actual, alpha=0.1, color='#ef4444')
ax2.set_xlabel('Nitrogen applied (kg/ha)', color='white')
ax2.set_ylabel('Yield (%)', color='white')
ax2.set_title("Liebig's Law: Scarcest Nutrient Limits Growth", color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key soil science principles:")
print("  1. Liebig's Law: weakest nutrient limits growth")
print("  2. Diminishing returns: more fertilizer -> less extra yield")
print("  3. Balance matters more than amount")
print()
print("The Haber-Bosch process provides ~50% of all nitrogen in crops.")
print("Without it, ~4 billion people would face starvation.")`,
      challenge: 'Model what happens when soil pH drops below 5.5 (acidic, common in NE India). Acid soils lock up phosphorus, making it unavailable. Add a pH correction factor to the phosphorus response curve.',
      successHint: 'Soil science is the foundation of all agriculture. Understanding NPK, Liebig\'s Law, and diminishing returns is essential for feeding 8 billion people efficiently and sustainably.',
    },
    {
      title: 'Irrigation engineering — moving water where crops need it',
      concept: `**Irrigation** transforms unproductive land into farmland and stabilizes yields against rainfall variability.

**Types of irrigation** (in order of efficiency):
1. **Flood irrigation** (30-50% efficient): Water flows across the entire field.
2. **Furrow irrigation** (50-70%): Water in channels between crop rows.
3. **Sprinkler irrigation** (70-85%): Water sprayed through the air.
4. **Drip irrigation** (85-95%): Water delivered directly to roots through emitters.
5. **Sub-surface drip** (90-98%): Drip lines buried underground.

India irrigates ~68 million hectares — the world's largest irrigated area. But average efficiency is only ~40%. Improving to 60% would save enough water to irrigate 17 million MORE hectares — enough to feed ~200 million additional people.

**Key engineering concepts**:
- **Crop water requirement** (ETc): how much water the crop actually needs
- **Irrigation scheduling**: WHEN to irrigate (soil moisture sensors)
- **Application efficiency**: fraction of applied water actually used by the crop`,
      analogy: 'Irrigation methods are like ways to give a person a drink. Flood irrigation is like throwing a bucket of water at them. Sprinklers are like a shower. Drip irrigation is like using a straw directly to their mouth — almost nothing wasted.',
      storyConnection: 'The Tiwa farmers in our story relied on rain — no irrigation. But as the climate changes and monsoons become less reliable, even traditional farming communities need irrigation. The engineering challenge: how to bring water to hillside fields without destroying the terraces or depleting the streams.',
      checkQuestion: 'Israel uses drip irrigation to farm in a desert with 50mm of annual rainfall. India has 1,200mm but struggles with water scarcity. Why?',
      checkAnswer: 'Three reasons: (1) Timing — India\'s rain falls in 3-4 monsoon months, then nothing for 8 months. (2) Efficiency — India irrigates at ~40% efficiency (flood); Israel at ~90% (drip). (3) Recycling — Israel reuses 85% of wastewater for irrigation; India reuses <5%. The problem isn\'t total rainfall; it\'s management, storage, and efficiency.',
      codeIntro: 'Compare irrigation methods: efficiency, cost, and water savings.',
      code: `import numpy as np
import matplotlib.pyplot as plt

methods = ['Flood', 'Furrow', 'Sprinkler', 'Drip', 'Sub-surface\\\ndrip']
efficiency = [40, 60, 78, 90, 95]
water_applied = [15000, 10000, 7700, 6700, 6300]
crop_need = 6000
colors_irr = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
waste = [w - crop_need for w in water_applied]
ax1.bar(methods, [crop_need]*5, color='#22c55e', alpha=0.7, label='Crop uses', width=0.6)
ax1.bar(methods, waste, bottom=[crop_need]*5, color='#ef4444', alpha=0.5, label='Wasted', width=0.6)
ax1.set_ylabel('Water (m3/ha/season)', color='white')
ax1.set_title('Water Applied: Used vs Wasted', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
current_area = 68
current_eff = 40
target_eff = np.linspace(40, 90, 100)
extra_area = current_area * (target_eff / current_eff - 1)
ax2.plot(target_eff, extra_area, color='#22c55e', linewidth=2)
ax2.fill_between(target_eff, extra_area, alpha=0.15, color='#22c55e')
ax2.axvline(60, color='#f59e0b', linestyle='--', linewidth=1)
extra_at_60 = current_area * (60 / current_eff - 1)
ax2.annotate(f'At 60%: +{extra_at_60:.0f}M ha', xy=(60, extra_at_60),
             xytext=(65, extra_at_60 + 5), color='#f59e0b', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.set_xlabel('National average efficiency (%)', color='white')
ax2.set_ylabel('Additional area irrigable (M ha)', color='white')
ax2.set_title('India: Same Water, More Farmland', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Every 1% improvement in India's irrigation efficiency:")
print(f"  Saves billions of liters of water")
print(f"  Could irrigate ~{current_area*0.01/(current_eff/100):.1f}M more hectares")
print(f"  At 60% (from 40%): +{extra_at_60:.0f}M ha (feeds ~200M people)")`,
      challenge: 'Solar-powered drip irrigation costs $1,000-2,000 for a smallholder system. Model the payback period for a 1-hectare farmer switching from flood to solar drip, including water savings and yield increase.',
      successHint: 'Irrigation engineering is where physics, economics, and food security meet. Improving efficiency by even 10% could feed hundreds of millions more people.',
    },
    {
      title: 'Pest management — IPM and the ecology of crop protection',
      concept: `**Integrated Pest Management (IPM)** minimizes chemical pesticide use while maintaining yields:

**The IPM pyramid** (most to least preferred):
1. **Prevention**: Resistant varieties, crop rotation, healthy soil
2. **Cultural controls**: Planting dates, spacing, intercropping
3. **Biological controls**: Natural predators (spiders eat pests, wasps parasitize borers)
4. **Mechanical controls**: Traps, barriers
5. **Chemical controls**: Pesticides as LAST resort only

**Why pesticide-only approaches fail**:
- Resistance develops (pests evolve to survive)
- Resurgence (pesticides kill predators, pest population rebounds higher)
- Secondary pests (minor pests become major when predators killed)
- Environmental damage (water pollution, pollinator death)

A single rice field contains 500+ arthropod species. Most are beneficial. Only 5-10 are pests. Blanket spraying kills them all — including your allies.`,
      analogy: 'IPM is like medicine for crops. A doctor doesn\'t prescribe antibiotics for every sniffle — that breeds resistant bacteria. Instead: prevention first, monitoring, targeted treatment, and strong medicine only when absolutely necessary.',
      storyConnection: 'Traditional rice farming was inherently IPM. Diverse varieties resisted different pests. Mixed cropping attracted predators. No monocultures meant no pest explosions. Modern IPM is a scientific return to indigenous wisdom.',
      checkQuestion: 'A farmer sprays insecticide: pest population drops from 1000 to 100, but spider population drops from 200 to 10. What happens next?',
      checkAnswer: 'Without spiders, the surviving 100 pests reproduce unchecked. Pest generation time: ~2 weeks; spider: ~6 weeks. In 4 weeks, pests could be back at 1000+ but spiders only at ~20. Each spray cycle worsens the imbalance. This is "pest resurgence" — the pesticide creates the problem it was supposed to solve.',
      codeIntro: 'Simulate pest-predator dynamics under different management strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def simulate(weeks, spray_weeks=None, kill_pest=0.9, kill_pred=0.95):
    dt = 0.1
    steps = int(weeks / dt)
    alpha, beta, delta, gamma = 0.5, 0.01, 0.005, 0.3
    pest = np.zeros(steps); pred = np.zeros(steps)
    pest[0] = 500; pred[0] = 50
    time = np.linspace(0, weeks, steps)
    for i in range(1, steps):
        dpest = (alpha * pest[i-1] - beta * pest[i-1] * pred[i-1]) * dt
        dpred = (delta * pest[i-1] * pred[i-1] - gamma * pred[i-1]) * dt
        pest[i] = max(1, pest[i-1] + dpest)
        pred[i] = max(1, pred[i-1] + dpred)
        if spray_weeks and any(abs(time[i] - sw) < dt for sw in spray_weeks):
            pest[i] *= (1 - kill_pest); pred[i] *= (1 - kill_pred)
    return time, pest, pred

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 10))
fig.patch.set_facecolor('#1f2937')

t1, p1, pr1 = simulate(30)
ax1.set_facecolor('#111827')
ax1.plot(t1, p1, color='#ef4444', linewidth=2, label='Pests')
ax1.plot(t1, pr1, color='#22c55e', linewidth=2, label='Spiders')
ax1.set_title('No Intervention (Natural Cycles)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray'); ax1.set_ylabel('Population', color='white')

t2, p2, pr2 = simulate(30, spray_weeks=[8, 16])
ax2.set_facecolor('#111827')
ax2.plot(t2, p2, color='#ef4444', linewidth=2, label='Pests')
ax2.plot(t2, pr2, color='#22c55e', linewidth=2, label='Spiders')
for sw in [8, 16]: ax2.axvline(sw, color='#f59e0b', linestyle='--', linewidth=1, alpha=0.7)
ax2.set_title('Broad-Spectrum Pesticide (Kills Everything)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray'); ax2.set_ylabel('Population', color='white')

t3, p3, pr3 = simulate(30, spray_weeks=[8, 16], kill_pest=0.5, kill_pred=0.1)
ax3.set_facecolor('#111827')
ax3.plot(t3, p3, color='#ef4444', linewidth=2, label='Pests')
ax3.plot(t3, pr3, color='#22c55e', linewidth=2, label='Spiders')
for sw in [8, 16]: ax3.axvline(sw, color='#a855f7', linestyle='--', linewidth=1, alpha=0.7)
ax3.set_title('IPM (Targeted, Predator-Safe)', color='white', fontsize=12)
ax3.set_xlabel('Weeks', color='white')
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray'); ax3.set_ylabel('Population', color='white')

plt.tight_layout()
plt.show()

print("Average pest populations:")
print(f"  Natural balance: {np.mean(p1):.0f}")
print(f"  Broad pesticide: {np.mean(p2):.0f} (rebounds after spraying!)")
print(f"  IPM approach:    {np.mean(p3):.0f} (controlled by predators + targeted spray)")`,
      challenge: 'Add parasitoid wasps (a third species) that are more sensitive to pesticides. How does the three-species system behave under each management scenario?',
      successHint: 'IPM is systems thinking applied to agriculture. Understanding predator-prey dynamics is essential for sustainable crop protection.',
    },
    {
      title: 'Yield optimization — getting more from less',
      concept: `**Yield optimization** maximizes crop output per unit of input. The global rice yield gap (potential minus actual) is about 40%.

**Key optimization levers**:
1. **Planting density**: Optimum ~25-35 plants/m^2 for rice
2. **Timing**: A 2-week planting date shift can change yield by 20%
3. **Nutrient timing**: Splitting fertilizer into 3-4 applications is 20-30% more efficient
4. **Water timing**: AWD saves 30% water with no yield loss
5. **Variety choice**: Matching variety to field conditions increases yield 15-25%

The optimization problem: maximize yield while minimizing inputs (cost, environmental impact). This is multi-variable constrained optimization — exactly the kind of problem that data science can help solve.`,
      analogy: 'Yield optimization is like tuning a car engine. Each adjustment (fuel mixture, ignition timing, turbo pressure) increases power but they interact: the best fuel mixture depends on the timing. You can\'t optimize one variable at a time — you need the whole system.',
      storyConnection: 'Tiwa farmers optimized by observation — centuries of trial and error. Modern yield optimization does the same thing but with sensors, data, and algorithms. The goal is identical: get the most food from the least effort.',
      checkQuestion: 'A farmer can increase yield from 4 to 6 t/ha by adding 60 kg more fertilizer and 200mm more irrigation. Is it "worth it"?',
      checkAnswer: 'The economic answer: the extra 2 tonnes ($600) costs less than inputs ($122), so it\'s profitable ($478 net). But the environmental cost (groundwater depletion, nitrogen runoff) may exceed $478 in externalities. The true optimum includes externalities — but farmers aren\'t paid to account for them. This is a policy problem as much as an agronomy problem.',
      codeIntro: 'Build a multi-variable yield optimization model for rice.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def rice_yield(N, water, density):
    n_resp = 1 - np.exp(-0.015 * N)
    w_resp = 1 - np.exp(-0.003 * water)
    d_resp = np.exp(-((density - 30)**2) / 200)
    return 10.0 * np.minimum(n_resp, w_resp) * d_resp

N_range = np.linspace(0, 200, 100)
W_range = np.linspace(200, 1500, 100)
N_grid, W_grid = np.meshgrid(N_range, W_range)
Y_grid = rice_yield(N_grid, W_grid, 30)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
contour = ax1.contourf(N_range, W_range, Y_grid, levels=20, cmap='YlGn')
plt.colorbar(contour, ax=ax1, label='Yield (t/ha)')
max_idx = np.unravel_index(Y_grid.argmax(), Y_grid.shape)
ax1.plot(N_range[max_idx[1]], W_range[max_idx[0]], '*', color='#ef4444', markersize=15,
         label=f'Max: {Y_grid.max():.1f} t/ha')
ax1.set_xlabel('Nitrogen (kg/ha)', color='white')
ax1.set_ylabel('Water (mm/season)', color='white')
ax1.set_title('Yield Surface: N x Water', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
countries = ['Japan', 'China', 'Vietnam', 'India', 'NE India', 'Sub-Saharan\\\nAfrica']
potential = [9.5, 9.0, 8.5, 8.0, 7.5, 7.0]
actual = [6.8, 7.0, 5.8, 3.9, 2.5, 1.5]
gap = [p - a for p, a in zip(potential, actual)]
x = np.arange(len(countries))
ax2.bar(x, actual, 0.6, label='Actual yield', color='#22c55e')
ax2.bar(x, gap, 0.6, bottom=actual, label='Yield gap', color='#ef4444', alpha=0.5)
ax2.set_xticks(x)
ax2.set_xticklabels(countries, color='white', fontsize=9)
ax2.set_ylabel('Yield (t/ha)', color='white')
ax2.set_title('Yield Gap: Actual vs Potential', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Global yield gap:")
for c, a, p in zip(countries, actual, potential):
    print(f"  {c.replace(chr(10), ' ')}: {a} t/ha actual, {p} potential ({(p-a)/p*100:.0f}% gap)")`,
      challenge: 'Add a "climate stress" factor: yield decreases by 5% for every degree above 30C. How does this shift the optimal nitrogen and density?',
      successHint: 'Yield optimization is where agronomy meets data science. The multi-variable nature of crop growth makes it a perfect application for computational modeling.',
    },
    {
      title: 'Precision agriculture with drones — the digital farm',
      concept: `**Precision agriculture** uses sensors, GPS, drones, and data analytics to manage crops at fine spatial scale — applying inputs exactly where needed.

**Key technologies**:
1. **Drones with multispectral cameras**: NDVI maps show healthy vs. stressed areas
2. **Soil sensors**: IoT devices measuring moisture, temperature, pH, nutrients
3. **Variable Rate Application (VRA)**: Adjust fertilizer rate by GPS position
4. **Satellite imagery**: Free Sentinel-2 at 10m resolution every 5 days
5. **Machine learning**: Predict yield, detect diseases, recommend actions

**Impact on rice**: NDVI-guided fertilizer reduces nitrogen use by 20-30%. Drone spraying uses 90% less water. Early disease detection saves 15-25% of yield.

India has ~150 million smallholder farmers. Bringing precision agriculture to fields of 0.5-2 hectares is the challenge.`,
      analogy: 'Precision agriculture switches from a shotgun to a laser pointer. Traditional farming applies inputs uniformly (covers everything, wastes most). Precision targets exactly where the problem is (hits only what needs hitting).',
      storyConnection: 'Tiwa farmers knew their fields intimately — which corner needed more compost, which edge was too dry. This was the original precision agriculture: human knowledge accumulated over generations. Modern drones are digitizing this knowledge, making it scalable.',
      checkQuestion: 'A drone surveys 10 hectares in 20 minutes with an NDVI map. A trained agronomist walking the same field takes 2 days. Which is "better"?',
      checkAnswer: 'Neither alone is sufficient. The drone provides uniform, quantitative coverage — no human can match its spatial resolution. But the agronomist provides contextual understanding — a brown patch could be drought, disease, or a broken pipe. The ideal is the combination: drone screening + agronomist diagnosis. This is "human-in-the-loop" precision agriculture.',
      codeIntro: 'Simulate drone-based NDVI mapping and precision fertilizer application.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
grid = 50
x = np.linspace(0, 100, grid)
y = np.linspace(0, 100, grid)
X, Y = np.meshgrid(x, y)

fertility = (0.7 + 0.3 * np.exp(-((X-60)**2 + (Y-40)**2) / 2000)
             - 0.2 * np.exp(-((X-20)**2 + (Y-80)**2) / 500))
fertility = np.clip(fertility + np.random.normal(0, 0.05, fertility.shape), 0.2, 1.0)

ndvi = fertility * 0.9 + np.random.normal(0, 0.03, fertility.shape)
disease_mask = np.exp(-((X-75)**2 + (Y-25)**2) / 200)
ndvi -= disease_mask * 0.3
ndvi = np.clip(ndvi, 0.1, 0.95)

fert_rx = np.clip((0.85 - ndvi) * 200, 0, 150)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
im1 = ax1.imshow(ndvi, cmap='RdYlGn', extent=[0, 100, 0, 100], origin='lower', vmin=0.2, vmax=0.95)
plt.colorbar(im1, ax=ax1, label='NDVI')
circle = plt.Circle((75, 25), 15, fill=False, color='#ef4444', linewidth=2, linestyle='--')
ax1.add_patch(circle)
ax1.annotate('Disease!', xy=(75, 25), xytext=(55, 45), color='#ef4444', fontsize=11,
             fontweight='bold', arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax1.set_xlabel('East (m)', color='white'); ax1.set_ylabel('North (m)', color='white')
ax1.set_title('Drone NDVI Map (Crop Health)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
im2 = ax2.imshow(fert_rx, cmap='YlOrRd', extent=[0, 100, 0, 100], origin='lower')
plt.colorbar(im2, ax=ax2, label='N prescription (kg/ha)')
ax2.set_xlabel('East (m)', color='white'); ax2.set_ylabel('North (m)', color='white')
ax2.set_title('Precision Fertilizer Prescription', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

uniform_n = 100 * 1  # kg for 1 ha at uniform rate
precision_n = fert_rx.mean() * 1
savings = (uniform_n - precision_n) / uniform_n * 100
stressed = (ndvi < 0.5).sum() / ndvi.size * 100

print(f"Field analysis (1 hectare):")
print(f"  Stressed area: {stressed:.0f}%")
print(f"  Disease patch detected at (75m, 25m)")
print(f"  Uniform fertilizer: {uniform_n:.0f} kg N")
print(f"  Precision fertilizer: {precision_n:.0f} kg N")
print(f"  Savings: {savings:.0f}% less fertilizer, same yield target")`,
      challenge: 'Add time: simulate NDVI at weeks 4, 8, 12, and 16. The disease should grow. When should the farmer intervene to minimize crop loss?',
      successHint: 'Precision agriculture transforms farming from art to science while preserving the art. Drones give farmers superpowers.',
    },
    {
      title: 'Climate-resilient crops — breeding for a hotter future',
      concept: `Climate change threatens rice through heat stress, drought, flooding, salinity, and new pests. **Breeding for resilience** uses three approaches:

1. **Traditional breeding**: Cross resilient traditional varieties with high-yielding modern varieties. Slow (10-15 years) but proven. Example: SUB1A flood tolerance from Indian variety FR13A.

2. **Marker-assisted selection (MAS)**: DNA markers track desired genes. Faster than visual selection.

3. **CRISPR gene editing**: Directly modify genes. Fastest but controversial.

**Northeast India's role**: The region's 5,000+ traditional rice varieties carry:
- Flood-tolerant deepwater varieties from Assam
- Drought-tolerant upland varieties from the hills
- Cold-tolerant varieties from high altitude
- Aromatic varieties (joha rice) with unique quality genes

These genes are being used in breeding programs worldwide. The next drought-resistant rice may carry genes from a Tiwa farmer's hillside field.`,
      analogy: 'Breeding climate-resilient crops is like updating an app for a new OS. The current rice "app" works great on the current "OS" (climate). But the OS is changing. Traditional breeding is manually rewriting code (slow, reliable). CRISPR is find-and-replace (fast, precise).',
      storyConnection: 'The Tiwa story speaks of rice as an eternal gift. For that gift to remain eternal, it must adapt. Traditional varieties preserved by indigenous communities are the raw material for adaptation. Each variety is a solved problem — a set of genes for a specific environment.',
      checkQuestion: 'CRISPR can make rice drought-tolerant in 2 years vs. 15 for traditional breeding. Is the 13-year time difference justified by safety concerns?',
      checkAnswer: 'A genuine dilemma. For speed: climate change is happening NOW; farmers can\'t wait 15 years. For caution: off-target effects, ecological unknowns, corporate seed control. A middle ground: expedited but rigorous testing (3-5 years), open-source gene edits (no patents), and parallel investment in traditional breeding.',
      codeIntro: 'Model crop performance under different climate scenarios and breeding strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
years = np.arange(2024, 2061)
n = len(years)

baseline_temp = 28
temp = baseline_temp + 0.04 * (years - 2024) + np.random.normal(0, 0.5, n)
drought = np.random.random(n) < (0.1 + 0.005 * (years - 2024))
flood = np.random.random(n) < (0.08 + 0.004 * (years - 2024))

def calc_yield(temp, drought, flood, ht, dt, ft, base):
    hp = np.where(temp > 35, (temp - 35) * 0.15 * (1 - ht), 0)
    dp = np.where(drought, 0.4 * (1 - dt), 0)
    fp = np.where(flood, 0.5 * (1 - ft), 0)
    return base * (1 - np.clip(hp + dp + fp, 0, 0.8))

varieties = {
    'Current HYV': (0.2, 0.2, 0.1, 5.5, '#ef4444'),
    'Traditional (NE India)': (0.4, 0.6, 0.5, 3.0, '#f59e0b'),
    'Climate-bred hybrid': (0.7, 0.7, 0.8, 5.0, '#22c55e'),
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
stats = {}
for name, (ht, dt, ft, base, color) in varieties.items():
    y = calc_yield(temp, drought, flood, ht, dt, ft, base)
    ax1.plot(years, y, color=color, linewidth=1.5, alpha=0.7, label=name)
    window = 5
    ma = np.convolve(y, np.ones(window)/window, mode='valid')
    ax1.plot(years[window-1:], ma, color=color, linewidth=2.5, linestyle='--')
    stats[name] = {'mean': np.mean(y), 'cv': np.std(y)/np.mean(y)*100}

ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Yield (t/ha)', color='white')
ax1.set_title('Variety Performance Under Climate Change', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
for name, data in stats.items():
    color = varieties[name][4]
    ax2.scatter(data['cv'], data['mean'], s=200, color=color, edgecolors='white', linewidth=2, zorder=5)
    ax2.annotate(name, xy=(data['cv'], data['mean']), xytext=(5, 5),
                 textcoords='offset points', color=color, fontsize=9)
ax2.set_xlabel('Yield variability (CV %)', color='white')
ax2.set_ylabel('Mean yield (t/ha)', color='white')
ax2.set_title('Yield vs Stability (ideal = top-left)', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate resilience comparison:")
for name, data in stats.items():
    print(f"  {name}: mean={data['mean']:.1f} t/ha, CV={data['cv']:.0f}%")
print()
print("NE India's 5,000+ traditional varieties carry the")
print("genetic raw material for breeding climate-resilient rice.")`,
      challenge: 'Add a CRISPR variety arriving in 2030 with heat_tol=0.9, drought_tol=0.8, flood_tol=0.9, base=6.0. How much does it outperform by 2060?',
      successHint: 'From soil science to irrigation to pest management to yield optimization to precision agriculture to climate-resilient crops — you\'ve built a complete toolkit for understanding how humanity feeds itself.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 agriculture foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for agricultural science simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}