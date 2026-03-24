import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BanyanTreeLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Carbon cycling — trees as carbon banks',
      concept: `Trees are the planet's most important **carbon banks**. They absorb CO2 from the atmosphere through photosynthesis and store the carbon in wood, roots, and soil.

The global carbon cycle:
- **Atmosphere**: ~870 Gt C (gigatonnes of carbon)
- **Forests**: ~860 Gt C (almost as much as the atmosphere!)
  - Living biomass: ~450 Gt C
  - Dead wood and litter: ~75 Gt C
  - Soil organic carbon: ~335 Gt C

Trees move carbon through these pools:
1. **Photosynthesis**: CO2 -> sugars -> wood (removes ~2.6 Gt C/year from atmosphere)
2. **Respiration**: trees burn sugars for energy, releasing some CO2 back
3. **Decomposition**: when trees die, fungi and bacteria break down wood, releasing CO2
4. **Fire**: rapid oxidation returns centuries of stored carbon to the atmosphere in hours

The net effect: forests currently absorb about **30% of human CO2 emissions** — a massive subsidy from nature. But deforestation releases stored carbon, and climate change threatens to turn forests from carbon sinks into carbon sources.

Old-growth forests like the banyan's grove are particularly valuable: they store carbon in massive trunks that took centuries to grow. Losing them creates a carbon debt that new plantings take decades to repay.`,
      analogy: 'The carbon cycle is like a bank account. Photosynthesis is income (deposits). Respiration and decomposition are expenses (withdrawals). An old-growth forest has a huge balance (stored carbon). Cutting it is like emptying the account — you can rebuild it, but it takes decades of deposits to match what was there.',
      storyConnection: 'The old banyan tree was a carbon bank with centuries of deposits. Its massive trunk, thousands of prop roots, and extensive root network stored tonnes of carbon. Every year it added more through photosynthesis. The stories it told were free — but its carbon storage service was worth millions.',
      checkQuestion: 'Some people argue that planting trees can solve climate change. Current human CO2 emissions are ~40 Gt CO2/year. Could tree planting absorb this?',
      checkAnswer: 'Not even close. The most optimistic tree-planting scenarios (restoring all degraded forests globally) could absorb ~10 Gt CO2/year at maximum — about 25% of current emissions. And that\'s assuming the trees survive, grow, and aren\'t cut down. Tree planting is necessary but far from sufficient. We must also reduce emissions at source. Trees are part of the solution, not THE solution.',
      codeIntro: 'Model the carbon cycle for a forest over 500 years, including growth, death, and decomposition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Forest carbon cycle model
years = np.arange(0, 501)

# Carbon pools (tonnes C per hectare)
living_biomass = np.zeros(501)
dead_wood = np.zeros(501)
soil_carbon = np.zeros(501)
atmosphere_flux = np.zeros(501)

living_biomass[0] = 0
dead_wood[0] = 5
soil_carbon[0] = 50

for t in range(1, 501):
    max_biomass = 200
    uptake = max_biomass * 0.02 * (1 - living_biomass[t-1] / max_biomass)
    uptake = max(0, uptake)
    respiration = living_biomass[t-1] * 0.015
    mortality_rate = 0.005 + 0.002 * (living_biomass[t-1] / max_biomass)
    mortality = living_biomass[t-1] * mortality_rate
    decomposition = dead_wood[t-1] * 0.05
    soil_respiration = soil_carbon[t-1] * 0.01

    living_biomass[t] = living_biomass[t-1] + uptake - respiration - mortality
    dead_wood[t] = dead_wood[t-1] + mortality - decomposition
    soil_carbon[t] = soil_carbon[t-1] + decomposition * 0.3 - soil_respiration
    atmosphere_flux[t] = respiration + decomposition * 0.7 + soil_respiration - uptake

total_carbon = living_biomass + dead_wood + soil_carbon

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.stackplot(years, living_biomass, dead_wood, soil_carbon,
             colors=['#22c55e', '#8B4513', '#f59e0b'], alpha=0.7,
             labels=['Living biomass', 'Dead wood', 'Soil carbon'])
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Carbon (tonnes/ha)', color='white')
ax.set_title('Forest Carbon Pools Over 500 Years', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')
ax.tick_params(colors='gray')

ax = axes[0, 1]
ax.set_facecolor('#111827')
window = 10
smooth_flux = np.convolve(atmosphere_flux, np.ones(window)/window, mode='same')
ax.plot(years, smooth_flux, color='#3b82f6', linewidth=2)
ax.fill_between(years, smooth_flux, 0, where=smooth_flux < 0, alpha=0.3, color='#22c55e', label='Carbon sink')
ax.fill_between(years, smooth_flux, 0, where=smooth_flux > 0, alpha=0.3, color='#ef4444', label='Carbon source')
ax.axhline(0, color='gray', linestyle='--', linewidth=0.5)
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Net flux (+ = emission)', color='white')
ax.set_title('Is the Forest a Sink or Source?', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Deforestation scenario at year 300
defor_total = total_carbon.copy()
for t in range(301, 501):
    if t == 301:
        defor_total[t] = total_carbon[t-1] * 0.2
    else:
        recovery = 200 * 0.015 * (1 - defor_total[t-1] / 250)
        defor_total[t] = defor_total[t-1] + max(0, recovery)

ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(years, total_carbon, color='#22c55e', linewidth=2.5, label='Undisturbed forest')
ax.plot(years, defor_total, color='#ef4444', linewidth=2.5, label='Clear-cut at year 300')
ax.axvline(300, color='#f59e0b', linestyle='--', linewidth=2)
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Total carbon (tonnes/ha)', color='white')
ax.set_title('Deforestation Carbon Impact', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1, 1]
ax.set_facecolor('#111827')
carbon_debt = total_carbon - defor_total
ax.fill_between(years[300:], carbon_debt[300:], alpha=0.5, color='#ef4444')
ax.plot(years[300:], carbon_debt[300:], color='#ef4444', linewidth=2)
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Carbon debt (tonnes/ha)', color='white')
ax.set_title('Carbon Debt from Deforestation', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Forest carbon at year 300: {total_carbon[300]:.0f} tonnes C/ha")
print(f"After clear-cut, immediate carbon loss: {total_carbon[300] - defor_total[301]:.0f} tonnes C/ha")
print("Recovery takes decades to centuries.")`,
      challenge: 'Add a "selective logging" scenario where only 30% of biomass is removed instead of clear-cut. Compare the carbon debt and recovery time. Is selective logging more climate-friendly?',
      successHint: 'Carbon cycling connects individual trees to global climate. Every old banyan, every ancient forest, is a carbon bank built over centuries. Protecting them is one of the most cost-effective climate actions available.',
    },
    {
      title: 'Forest succession — from bare ground to old growth',
      concept: `Forests develop through a predictable sequence of stages called **ecological succession**:

**1. Pioneer stage** (years 0-20): Bare ground colonized by grasses, herbs, and fast-growing trees (bamboo, birch, poplar). Sun-loving, short-lived species that stabilize soil.

**2. Early successional** (years 20-80): Shade-tolerant species germinate under pioneers. Mid-canopy trees overtop pioneers. Biodiversity increases.

**3. Mid-successional** (years 80-200): Large, long-lived species dominate. Complex vertical structure develops. Dead wood accumulates.

**4. Old-growth / climax** (years 200+): Maximum structural complexity — gaps, fallen logs, standing dead trees, epiphytes. Maximum carbon storage. Self-replacing: when old trees die, new ones grow in the gaps.

The banyan is a **late-successional** species — it thrives in established forests, not on bare ground. But once established, it can persist for centuries, becoming a structural keystone.`,
      analogy: 'Forest succession is like building a city. First, temporary shelters (pioneers). Then basic buildings (early succession). Then skyscrapers (canopy trees). Finally, a mature city with infrastructure and history (old-growth). You can\'t skip stages.',
      storyConnection: 'The old banyan tree didn\'t grow on bare ground — it grew in an established forest that went through decades of succession before conditions were right for a banyan seed to germinate.',
      checkQuestion: 'After a forest fire, should we replant with mature species or let nature take its course?',
      checkAnswer: 'Natural succession is almost always better. Planting climax species on recently burned ground often fails because the soil, microclimate, and mycorrhizal networks aren\'t ready. Pioneer species naturally prepare the site. Trying to skip stages rarely works.',
      codeIntro: 'Simulate 300 years of forest succession, tracking species composition and structural complexity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(0, 301)

def succession_curve(t, peak_time, spread, max_abundance):
    return max_abundance * np.exp(-0.5 * ((t - peak_time) / spread) ** 2)

pioneers = succession_curve(years, 15, 20, 80) + 20 * np.exp(-0.1 * years)
pioneers = np.clip(pioneers, 0, 100)
early = succession_curve(years, 50, 30, 70)
mid = succession_curve(years, 130, 50, 60)
late = 80 / (1 + np.exp(-0.03 * (years - 150)))

total = pioneers + early + mid + late
pioneers_pct = pioneers / total * 100
early_pct = early / total * 100
mid_pct = mid / total * 100
late_pct = late / total * 100

complexity = np.log1p(years) * 15 + late / late.max() * 40
complexity = np.clip(complexity, 0, 100)

carbon = 200 / (1 + np.exp(-0.02 * (years - 100))) + 50 * np.log1p(years/50)
biodiversity = 10 + 50 * (1 - np.exp(-0.015 * years)) + 20 * np.sin(years/50)**2

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.stackplot(years, pioneers_pct, early_pct, mid_pct, late_pct,
             colors=['#f59e0b', '#22c55e', '#3b82f6', '#8B4513'], alpha=0.7,
             labels=['Pioneer', 'Early', 'Mid', 'Late (climax)'])
ax.set_ylabel('% of canopy cover', color='white')
ax.set_title('Species Composition Over Succession', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(years, complexity, color='#a855f7', linewidth=2.5)
ax.fill_between(years, complexity, alpha=0.15, color='#a855f7')
stages = [(0, 'Pioneer'), (40, 'Early'), (120, 'Mid'), (220, 'Old-growth')]
for yr, label in stages:
    ax.axvline(yr, color='gray', linestyle=':', alpha=0.3)
    ax.text(yr + 5, 95, label, color='white', fontsize=9)
ax.set_ylabel('Structural complexity (%)', color='white')
ax.set_title('Forest Structure Over Time', color='white', fontsize=12)
ax.tick_params(colors='gray')

ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(years, carbon, color='#22c55e', linewidth=2.5)
ax.fill_between(years, carbon, alpha=0.15, color='#22c55e')
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Carbon stored (tonnes/ha)', color='white')
ax.set_title('Carbon Accumulation', color='white', fontsize=12)
ax.tick_params(colors='gray')

ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(years, biodiversity, color='#f59e0b', linewidth=2.5)
ax.fill_between(years, biodiversity, alpha=0.15, color='#f59e0b')
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Species richness index', color='white')
ax.set_title('Biodiversity During Succession', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Succession milestones:")
print("  Year 0-20: Pioneer stage")
print("  Year 20-80: Early successional")
print("  Year 80-200: Mid successional")
print("  Year 200+: Old-growth (maximum complexity and carbon)")
print("\\nOld-growth forests take 200+ years. No shortcuts.")`,
      challenge: 'Add a disturbance at year 150 that removes 80% of biomass. How does secondary succession differ from primary? Is recovery faster the second time?',
      successHint: 'Forest succession explains why old-growth forests are irreplaceable on human timescales. You can plant a forest in a day, but you can\'t create old-growth in less than two centuries.',
    },
    {
      title: 'Old-growth vs secondary forest — what\'s the difference?',
      concept: `Not all forests are equal. An **old-growth forest** (never logged, 200+ years old) is fundamentally different from a **secondary forest** (regrown after disturbance):

**Old-growth**: Multiple canopy layers, large-diameter trees, standing dead trees (snags) and fallen logs, canopy gaps, deep complex soil with extensive mycorrhizal networks, specialized species.

**Secondary forest**: Even-aged canopy, fewer large trees, less dead wood, simpler soil ecology, more generalist species.

**Globally**: Only ~33% of remaining forests are old-growth. Old-growth is being lost at ~3.6 million hectares/year. Once lost, it takes 200-500+ years to recover.

In Northeast India, old-growth forests in the Eastern Himalayas are globally significant — among the most biodiverse temperate/subtropical forests on Earth.`,
      analogy: 'Old-growth forest is like a 500-year-old library: irreplaceable collections, expert librarians, complex organization. Secondary forest is like a bookstore that just opened: new books, basic shelving. Both have books, but the library has something the bookstore can\'t buy — time.',
      storyConnection: 'The old banyan tree stood in what was presumably old-growth forest — a complex, layered ecosystem that had been developing for centuries.',
      checkQuestion: 'A logging company claims: "We practice sustainable forestry — we replant after logging." Is replanted forest equivalent to old-growth?',
      checkAnswer: 'No. Replanted forest (plantation) is a crop, not an ecosystem. It has even-aged trees of one species, no structural complexity, no dead wood, simplified soil ecology, and few specialist species. "Sustainable" forestry can maintain wood production, but it cannot maintain old-growth values.',
      codeIntro: 'Compare old-growth and secondary forest on multiple ecological metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

metrics = {
    'Carbon storage': {'old_growth': 250, 'secondary': 120, 'plantation': 80},
    'Species richness': {'old_growth': 200, 'secondary': 120, 'plantation': 40},
    'Structural complexity': {'old_growth': 95, 'secondary': 45, 'plantation': 15},
    'Dead wood (m3/ha)': {'old_growth': 80, 'secondary': 20, 'plantation': 5},
    'Soil carbon': {'old_growth': 150, 'secondary': 90, 'plantation': 60},
    'Water retention': {'old_growth': 90, 'secondary': 60, 'plantation': 35},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
cats = list(metrics.keys())
x = np.arange(len(cats))
width = 0.25

og = [metrics[c]['old_growth'] for c in cats]
sec = [metrics[c]['secondary'] for c in cats]
plan = [metrics[c]['plantation'] for c in cats]

og_norm = [100] * len(cats)
sec_norm = [s/o*100 for s, o in zip(sec, og)]
plan_norm = [p/o*100 for p, o in zip(plan, og)]

ax1.bar(x - width, og_norm, width, label='Old-growth (200+ yr)', color='#22c55e', alpha=0.8)
ax1.bar(x, sec_norm, width, label='Secondary (50 yr)', color='#f59e0b', alpha=0.8)
ax1.bar(x + width, plan_norm, width, label='Plantation', color='#ef4444', alpha=0.8)
ax1.set_xticks(x)
ax1.set_xticklabels(cats, color='gray', fontsize=8, rotation=20, ha='right')
ax1.set_ylabel('% of old-growth value', color='white')
ax1.set_title('Forest Quality Comparison', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
recovery_years = np.arange(0, 501)
metrics_recovery = {
    'Carbon storage': {'rate': 0.007, 'color': '#22c55e'},
    'Species richness': {'rate': 0.005, 'color': '#3b82f6'},
    'Structural complexity': {'rate': 0.004, 'color': '#a855f7'},
    'Soil ecology': {'rate': 0.003, 'color': '#f59e0b'},
    'Specialist species': {'rate': 0.002, 'color': '#ef4444'},
}

for name, props in metrics_recovery.items():
    recovery = 100 * (1 - np.exp(-props['rate'] * recovery_years))
    ax2.plot(recovery_years, recovery, linewidth=2, color=props['color'], label=name)
    t90 = -np.log(0.1) / props['rate']
    if t90 < 500:
        ax2.plot(t90, 90, 'o', color=props['color'], markersize=6)

ax2.axhline(90, color='white', linestyle='--', alpha=0.3, label='90% recovery')
ax2.set_xlabel('Years since disturbance', color='white')
ax2.set_ylabel('% of old-growth level', color='white')
ax2.set_title('Recovery Time to Match Old-Growth', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Recovery times to reach 90% of old-growth level:")
for name, props in metrics_recovery.items():
    t90 = -np.log(0.1) / props['rate']
    print(f"  {name}: {t90:.0f} years")
print("\\nSpecialist species take the longest: 500+ years.")`,
      challenge: 'Add a "degraded secondary" scenario where recovery rates are halved. Some degraded forests never reach old-growth status — they get stuck in a "degraded steady state."',
      successHint: 'The difference between old-growth and secondary forest is not just age — it\'s accumulated complexity and irreplaceable ecology.',
    },
    {
      title: 'Urban tree canopy — forests in cities',
      concept: `Trees in cities provide critical ecosystem services:

**Urban heat island mitigation**: Cities are 2-8 degrees C hotter than rural areas. Tree shade reduces surface temperatures by 11-25 degrees C. Cities with 40%+ tree canopy have measurably lower heat-related mortality.

**Air quality**: A mature tree removes 22 kg of pollutants per year. Streets with trees have 50-60% less air pollution.

**Stormwater**: A large tree intercepts 15,000 liters of rainwater per year, reducing flooding.

**Mental health**: Views of trees reduce cortisol within minutes. Hospital patients with tree views recover faster. Children in greener schools show better attention.

**Economic**: Mature trees increase property values by 10-15%. Annual ecosystem service value of US urban trees: ~$18 billion.`,
      analogy: 'Urban trees are like free infrastructure that runs on sunlight. Air conditioners that cool without electricity. Water treatment plants that work without pipes. A city without trees is like a building without plumbing — it functions, but everyone suffers.',
      storyConnection: 'The old banyan tree was the center of village life. In modern cities, urban trees serve the same functions. A single mature tree in a city provides hundreds of thousands of dollars in lifetime services.',
      checkQuestion: 'Budget constraints force a choice: plant 10,000 saplings or protect 100 existing mature trees threatened by development. Which has more impact?',
      checkAnswer: 'Protecting the 100 mature trees. Each provides 5-10x the services of a sapling. Many saplings will die before maturity (~30% urban tree mortality in first 5 years). The mature trees provide immediate, full-scale services. Plant saplings too, but never at the cost of existing mature trees.',
      codeIntro: 'Model the urban heat island effect and how tree canopy reduces it.',
      code: `import numpy as np
import matplotlib.pyplot as plt

canopy_pct = np.linspace(0, 60, 100)
base_temp = 35
rural_temp = 28

temp_reduction = 0.12 * canopy_pct
urban_temp = base_temp - temp_reduction

mortality_baseline = 100
mortality_risk = mortality_baseline * np.exp(0.15 * (urban_temp - 28))

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(canopy_pct, urban_temp, color='#ef4444', linewidth=2.5, label='Urban temperature')
ax.axhline(rural_temp, color='#22c55e', linestyle='--', linewidth=2, label=f'Rural ({rural_temp} C)')
ax.fill_between(canopy_pct, urban_temp, rural_temp, alpha=0.15, color='#ef4444')
ax.set_xlabel('Tree canopy coverage (%)', color='white')
ax.set_ylabel('Temperature (C)', color='white')
ax.set_title('Urban Heat Island vs Tree Canopy', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(canopy_pct, mortality_risk, color='#ef4444', linewidth=2.5)
ax.fill_between(canopy_pct, mortality_risk, alpha=0.15, color='#ef4444')
ax.set_xlabel('Tree canopy coverage (%)', color='white')
ax.set_ylabel('Heat deaths (per million/summer)', color='white')
ax.set_title('Heat Mortality Risk', color='white', fontsize=12)
ax.tick_params(colors='gray')

ax = axes[1, 0]
ax.set_facecolor('#111827')
tree_ages = np.arange(1, 101)
canopy_area = np.minimum(tree_ages ** 1.5 * 0.2, 80)
shade_value = canopy_area * 5
carbon_value = tree_ages * 0.5 * 50
stormwater_value = canopy_area * 3
property_value = canopy_area * 10
total_value = shade_value + carbon_value + stormwater_value + property_value

ax.stackplot(tree_ages, shade_value, carbon_value, stormwater_value, property_value,
             colors=['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'], alpha=0.7,
             labels=['Cooling', 'Carbon', 'Stormwater', 'Property value'])
ax.set_xlabel('Tree age (years)', color='white')
ax.set_ylabel('Annual value ($/year)', color='white')
ax.set_title('Ecosystem Service Value by Tree Age', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

ax = axes[1, 1]
ax.set_facecolor('#111827')
cities = ['Singapore', 'Sydney', 'London', 'New York', 'Guwahati\\n(est.)', 'Delhi', 'Mumbai']
canopy_data = [29, 26, 21, 20, 18, 12, 8]
bar_colors = ['#22c55e' if c > 20 else '#f59e0b' if c > 15 else '#ef4444' for c in canopy_data]
bars = ax.barh(range(len(cities)), canopy_data, color=bar_colors, alpha=0.8)
ax.set_yticks(range(len(cities)))
ax.set_yticklabels(cities, color='white')
ax.set_xlabel('Tree canopy coverage (%)', color='white')
ax.set_title('Urban Tree Canopy: City Comparison', color='white', fontsize=12)
ax.tick_params(colors='gray')
ax.axvline(20, color='#f59e0b', linestyle='--', linewidth=1, label='Recommended minimum')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
for bar, pct in zip(bars, canopy_data):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{pct}%', va='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Urban tree canopy impacts:")
print(f"  0% canopy: {base_temp} C (full heat island)")
print(f"  20% canopy: {base_temp - 0.12*20:.1f} C")
print(f"  40% canopy: {base_temp - 0.12*40:.1f} C (near rural)")
print(f"\\nA 50-year-old urban tree provides ~{total_value[49]:,.0f}/year in services")`,
      challenge: 'Model climate change: add 2 degrees C to the base temperature. How much additional canopy is needed to maintain current heat levels?',
      successHint: 'Urban forestry is where ecology meets city planning. Trees are the cheapest cooling, cleaning, and calming technology a city can deploy.',
    },
    {
      title: 'Remote sensing of forests — seeing trees from space',
      concept: `Modern forest ecology relies on **remote sensing** — observing forests from satellites:

**NDVI** (Normalized Difference Vegetation Index): compares near-infrared (reflected by healthy plants) to visible red (absorbed by chlorophyll). NDVI = (NIR - Red) / (NIR + Red). Values >0.6 = dense forest.

**LiDAR**: fires millions of laser pulses to measure 3D canopy structure with centimeter accuracy. Used for carbon estimation.

**Radar (SAR)**: penetrates clouds, critical for tropical forests. Used by Global Forest Watch for near-real-time deforestation alerts.

**High-resolution optical** (Planet Labs): sub-meter resolution, daily global coverage. Tracks illegal logging in near-real-time.`,
      analogy: 'Remote sensing is like a doctor\'s toolkit for the planet. NDVI is taking the forest\'s temperature. LiDAR is an X-ray showing structure. Radar is an ultrasound that works through clouds.',
      storyConnection: 'If we could use satellite imagery over the banyan tree\'s village, we\'d see centuries of forest change — the banyan expanding, surrounding forests cleared, urban encroachment approaching.',
      checkQuestion: 'Global Forest Watch sends deforestation alerts within days. Why is speed important?',
      checkAnswer: 'Most illegal logging happens in remote areas. By the time authorities arrive weeks later, timber is gone. Near-real-time alerts allow enforcement while logging is happening. Studies show alert systems reduce deforestation by 10-20%.',
      codeIntro: 'Calculate NDVI from simulated satellite data and classify land cover types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

grid_size = 100
land_cover = np.zeros((grid_size, grid_size), dtype=int)
land_cover[:50, :50] = 0  # dense forest
land_cover[:50, 50:] = 1  # degraded
land_cover[50:, :50] = 2  # agriculture
land_cover[50:, 50:] = 3  # urban

for i in range(grid_size):
    for j in range(grid_size):
        if (i-25)**2 + (j-25)**2 < 100:
            land_cover[i, j] = 0

nir_values = {0: 0.55, 1: 0.40, 2: 0.45, 3: 0.15}
red_values = {0: 0.05, 1: 0.10, 2: 0.15, 3: 0.20}

nir = np.zeros((grid_size, grid_size))
red = np.zeros((grid_size, grid_size))
for i in range(grid_size):
    for j in range(grid_size):
        lc = land_cover[i, j]
        nir[i, j] = nir_values[lc] + np.random.normal(0, 0.03)
        red[i, j] = red_values[lc] + np.random.normal(0, 0.02)
nir = np.clip(nir, 0, 1)
red = np.clip(red, 0, 1)
ndvi = (nir - red) / (nir + red + 1e-10)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

ax = axes[0, 0]
ax.set_facecolor('#111827')
cover_colors = {0: [0.1, 0.5, 0.1], 1: [0.3, 0.5, 0.2], 2: [0.7, 0.7, 0.3], 3: [0.5, 0.5, 0.5]}
rgb = np.zeros((grid_size, grid_size, 3))
for i in range(grid_size):
    for j in range(grid_size):
        rgb[i, j] = cover_colors[land_cover[i, j]]
        rgb[i, j] += np.random.normal(0, 0.05, 3)
rgb = np.clip(rgb, 0, 1)
ax.imshow(rgb)
ax.set_title('Simulated Satellite Image', color='white', fontsize=12)
ax.tick_params(colors='gray')

ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(ndvi, cmap='RdYlGn', vmin=-0.2, vmax=0.9)
plt.colorbar(im, ax=ax, label='NDVI')
ax.set_title('NDVI Map', color='white', fontsize=12)
ax.tick_params(colors='gray')

ax = axes[1, 0]
ax.set_facecolor('#111827')
labels_list = ['Dense forest', 'Degraded', 'Agriculture', 'Urban']
hist_colors = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444']
for lc, label, color in zip(range(4), labels_list, hist_colors):
    ax.hist(ndvi[land_cover == lc], bins=30, alpha=0.5, color=color, label=label, edgecolor='none')
ax.set_xlabel('NDVI', color='white')
ax.set_ylabel('Pixel count', color='white')
ax.set_title('NDVI Distribution by Land Cover', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1, 1]
ax.set_facecolor('#111827')
classified = np.zeros_like(land_cover)
classified[ndvi > 0.6] = 0
classified[(ndvi > 0.35) & (ndvi <= 0.6)] = 1
classified[(ndvi > 0.1) & (ndvi <= 0.35)] = 2
classified[ndvi <= 0.1] = 3
accuracy = np.mean(classified == land_cover) * 100
class_cmap = plt.cm.colors.ListedColormap(['#22c55e', '#f59e0b', '#3b82f6', '#ef4444'])
ax.imshow(classified, cmap=class_cmap, vmin=0, vmax=3)
ax.set_title(f'NDVI Classification (accuracy: {accuracy:.0f}%)', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("NDVI classification thresholds:")
print("  > 0.6: Dense forest")
print("  0.35-0.6: Degraded / crops")
print("  0.1-0.35: Sparse vegetation")
print("  < 0.1: Urban / water")
print(f"\\nClassification accuracy: {accuracy:.0f}%")`,
      challenge: 'Simulate deforestation: remove 20% of dense forest pixels and recalculate NDVI. Can the satellite detect the change?',
      successHint: 'Remote sensing has transformed forest ecology from local observation to global monitoring. Every hectare of forest on Earth is now watched by satellites.',
    },
    {
      title: 'Forest fire ecology — destruction as renewal',
      concept: `Fire is not just destruction — it's a natural ecological process that many forests depend on.

**Fire-adapted forests**: Boreal forests burn every 50-200 years; some trees have cones that only open in fire heat (serotiny). Mediterranean forests have fire-resistant bark. Tropical savannas need fire every 1-5 years to remain open.

**Fire suppression problems**: Decades of suppressing natural fires allow fuel to accumulate. When fire comes, it's catastrophic instead of moderate. California's mega-fires are partly caused by a century of fire suppression.

**In Northeast India**: Jhum (shifting cultivation) involves deliberate burning. When fallow periods are long enough (15-20+ years), jhum is ecologically sustainable.

**Fire and the banyan**: Banyans are somewhat fire-resistant (thick bark, high water content), but severe fires can kill aerial roots. Fire creates gaps that allow pioneer species to establish — beginning a new round of succession.`,
      analogy: 'Fire in a forest is like a reset button on a computer. Sometimes the system gets cluttered (accumulated dead wood), and the best solution is a controlled restart. A planned restart (prescribed burn) is very different from a random crash (wildfire in a fuel-loaded forest).',
      storyConnection: 'The old banyan tree survived fires because of its thick bark and water-rich tissues. But fire played a role in the broader ecosystem — creating clearings where the banyan\'s figs could germinate.',
      checkQuestion: 'Australian Aboriginal peoples practiced "fire-stick farming" for 65,000+ years. How is this different from wildfire?',
      checkAnswer: 'Aboriginal burning was low-intensity, patchy, and timed to specific seasons. It created a mosaic of burned and unburned patches, maintaining biodiversity. It reduced fuel loads, preventing catastrophic fires. When Aboriginal burning stopped after European colonization, fuel accumulated and mega-fires became common.',
      codeIntro: 'Model fire regimes: compare natural fire cycles with fire suppression and their long-term effects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

years = np.arange(0, 501)

def simulate_fire_regime(n_years, suppressed_years=0):
    biomass = np.zeros(n_years)
    fuel_load = np.zeros(n_years)
    biodiversity = np.zeros(n_years)
    fire_events = []

    biomass[0] = 50
    fuel_load[0] = 10
    biodiversity[0] = 50

    for t in range(1, n_years):
        biomass[t] = biomass[t-1] + 3 * (1 - biomass[t-1] / 200)
        fuel_load[t] = fuel_load[t-1] + 1.5
        biodiversity[t] = biodiversity[t-1] + 0.2 * (1 - biodiversity[t-1] / 100)

        fire_occurs = False
        if t > suppressed_years:
            fire_prob = 0.01 * (fuel_load[t] / 30)
            if np.random.random() < fire_prob and t > 10:
                fire_occurs = True

        if fire_occurs:
            fire_events.append(t)
            intensity = min(fuel_load[t] / 100, 1.0)
            biomass[t] *= (1 - intensity * 0.8)
            fuel_load[t] = 5
            if intensity < 0.5:
                biodiversity[t] = min(100, biodiversity[t] * 1.1)
            else:
                biodiversity[t] *= 0.5

    return biomass, fuel_load, biodiversity, fire_events

nat_bio, nat_fuel, nat_div, nat_fires = simulate_fire_regime(501)

np.random.seed(42)
sup_bio, sup_fuel, sup_div, sup_fires = simulate_fire_regime(501, suppressed_years=150)

np.random.seed(123)
pre_bio, pre_fuel, pre_div, pre_fires = simulate_fire_regime(501)

fig, axes = plt.subplots(3, 1, figsize=(14, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

scenarios = [
    ('Natural fire regime', nat_bio, nat_fuel, nat_div, nat_fires, '#22c55e'),
    ('Fire suppression (150yr)', sup_bio, sup_fuel, sup_div, sup_fires, '#ef4444'),
    ('Prescribed burning', pre_bio, pre_fuel, pre_div, pre_fires, '#3b82f6'),
]

ax = axes[0]
ax.set_facecolor('#111827')
for name, bio, _, _, fires, color in scenarios:
    ax.plot(years, bio, color=color, linewidth=1.5, label=name, alpha=0.8)
ax.set_ylabel('Biomass (tonnes/ha)', color='white')
ax.set_title('Forest Biomass Under Different Fire Regimes', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

ax = axes[1]
ax.set_facecolor('#111827')
for name, _, fuel, _, _, color in scenarios:
    ax.plot(years, fuel, color=color, linewidth=1.5, alpha=0.8)
ax.axhline(60, color='#f59e0b', linestyle='--', linewidth=1, label='Catastrophic threshold')
ax.set_ylabel('Fuel load', color='white')
ax.set_title('Accumulated Fuel (Fire Risk)', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

ax = axes[2]
ax.set_facecolor('#111827')
for name, _, _, div, _, color in scenarios:
    ax.plot(years, div, color=color, linewidth=1.5, alpha=0.8)
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Biodiversity index', color='white')
ax.set_title('Biodiversity Response', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

for name, bio, fuel, div, fires, _ in scenarios:
    print(f"\\n{name}:")
    print(f"  Fires: {len(fires)}")
    print(f"  Avg biomass (yr 100+): {np.mean(bio[100:]):.0f}")
    print(f"  Avg biodiversity: {np.mean(div[100:]):.0f}")`,
      challenge: 'Add climate change: increase fire probability by 50% after year 250. Which regime is most resilient to increased fire risk?',
      successHint: 'Fire ecology transforms our understanding of landscapes. Many ecosystems need fire. Suppressing it creates a time bomb. The banyan\'s forest was shaped by fire as much as by rain.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for forest ecology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}