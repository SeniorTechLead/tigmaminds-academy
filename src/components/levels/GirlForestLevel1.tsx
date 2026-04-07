import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GirlForestLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Deforestation causes — why forests disappear',
      concept: `The world loses approximately **10 million hectares** of forest every year — an area the size of South Korea. Deforestation is driven by a combination of human activities:

**Direct causes:**
- **Agriculture** (80% of deforestation): clearing forest for crops and pasture. In the Amazon, cattle ranching drives 80% of clearing. In Southeast Asia, palm oil plantations.
- **Logging**: commercial timber harvesting, often illegal
- **Infrastructure**: roads, dams, mines, urban expansion
- **Fire**: both natural and human-set; climate change increases fire frequency

**Underlying causes:**
- Population growth → more demand for food and land
- Poverty → short-term land use over long-term sustainability
- Weak governance → illegal logging goes unpunished
- Global demand → wealthy countries consume products that drive deforestation elsewhere

**NE India context:**
- Jhum (shifting cultivation) is the traditional practice — small plots cleared, farmed for 2-3 years, then abandoned to regenerate
- When jhum cycles shorten (due to population pressure), the land doesn't have time to recover
- Assam lost 3,199 sq km of forest between 2001-2021`,
      analogy: 'Deforestation is like withdrawing from a bank account faster than the interest accumulates. The "interest" is forest regrowth. If you withdraw (cut) occasionally and let the account (forest) recover, you stay wealthy. If you withdraw faster than it grows, you go bankrupt. Most of the world is in overdraft.',
      storyConnection: 'The Girl Who Grew a Forest looked at the bare hillside near her village and saw what was lost: the birds, the streams, the shade, the soil. She understood that the forest was not just trees — it was an entire system. Her decision to plant was not naive optimism; it was an engineering response to a systems failure.',
      checkQuestion: 'Jhum (shifting cultivation) has worked sustainably for thousands of years in NE India. Why is it now causing deforestation?',
      checkAnswer: 'The cycle time has shortened. Traditionally, a jhum plot was farmed for 2-3 years, then left fallow for 15-25 years to regenerate. With increasing population, the fallow period has dropped to 3-5 years in many areas. The forest doesn\'t have time to regrow fully before it\'s cleared again. The practice hasn\'t changed; the math has.',
      codeIntro: 'Visualize global deforestation rates and their causes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Global deforestation data
years = np.array([2001, 2005, 2010, 2015, 2018, 2020, 2022])
forest_loss_mha = [5.8, 7.2, 7.0, 8.0, 7.5, 6.8, 6.6]  # million hectares/year

# Causes of deforestation (global average)
causes = ['Agriculture\n(crops)', 'Agriculture\n(livestock)', 'Logging', 'Infrastructure', 'Fire\n(human-set)', 'Other']
cause_pct = [35, 30, 15, 8, 7, 5]
cause_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#6b7280']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Forest loss over time
ax1.set_facecolor('#111827')
ax1.bar(years, forest_loss_mha, width=1.5, color='#ef4444', alpha=0.8, edgecolor='none')
ax1.plot(years, forest_loss_mha, 'o-', color='#f59e0b', linewidth=2, markersize=6)
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Forest loss (million hectares/year)', color='white')
ax1.set_title('Annual Global Forest Loss', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Cumulative loss annotation
cumulative = np.cumsum(forest_loss_mha) * 2  # approximate (gaps between data points)
ax1.text(2015, max(forest_loss_mha) * 0.9,
        f'~{sum(forest_loss_mha)*3:.0f}M ha lost\\n2001-2022',
        color='#f59e0b', fontsize=10, ha='center',
        bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#f59e0b'))

# Causes pie chart
ax2.set_facecolor('#111827')
wedges, texts, autotexts = ax2.pie(cause_pct, labels=causes, autopct='%1.0f%%',
                                     colors=cause_colors, textprops={'color': 'white', 'fontsize': 9},
                                     wedgeprops={'edgecolor': '#1f2937', 'linewidth': 2})
for t in autotexts:
    t.set_fontsize(8)
ax2.set_title('Causes of Deforestation (Global)', color='white', fontsize=13)

plt.tight_layout()
plt.show()

print("Key deforestation facts:")
print("  ~10 million hectares lost per year (net, after regrowth)")
print("  80% driven by agriculture (food demand)")
print("  Tropical forests account for 95% of loss")
print()
print("NE India specifics:")
print("  Assam lost 3,199 sq km of forest (2001-2021)")
print("  Major drivers: tea plantations, jhum shortening, logging")
print("  Kaziranga buffer forests are under pressure")`,
      challenge: 'If 10 million hectares are lost per year and forest regrowth adds back 5 million hectares per year, what is the net loss? At this rate, if there are 4 billion hectares of forest remaining, how many years until half is gone?',
      successHint: 'Deforestation is a math problem as much as an environmental one. The numbers are clear: we are losing forests faster than they regrow. Understanding the causes — especially the dominance of agriculture — is essential for finding solutions.',
    },
    {
      title: 'Carbon cycle basics — where carbon goes',
      concept: `**Carbon** is the backbone of life and the driver of climate change. The **carbon cycle** describes how carbon moves between four major reservoirs:

1. **Atmosphere**: CO₂ gas (currently ~420 ppm, up from 280 ppm pre-industrial)
2. **Biosphere**: all living things (plants, animals, microbes) — ~550 Gt C in plants
3. **Oceans**: dissolved CO₂ and carbonates — ~38,000 Gt C (the largest active reservoir)
4. **Lithosphere**: fossil fuels, rocks, sediments — ~66 million Gt C (the deep store)

**Natural carbon flows** (Gt C/year):
- Photosynthesis: 120 Gt C from atmosphere → plants
- Respiration: 118 Gt C from living things → atmosphere
- Ocean absorption: 90 Gt C from atmosphere → ocean
- Ocean release: 88 Gt C from ocean → atmosphere

**Human disruption:**
- Burning fossil fuels: +9.5 Gt C/year → atmosphere
- Deforestation: +1.5 Gt C/year → atmosphere
- Total human emissions: ~11 Gt C/year
- Natural sinks absorb ~5 Gt C/year
- **Net increase: ~6 Gt C/year accumulating in atmosphere**

This net accumulation is what drives climate change. The pre-industrial balance was nearly zero; human activity has tipped the scales.`,
      analogy: 'The carbon cycle is like a global bank account. For millions of years, deposits (photosynthesis, ocean absorption) roughly equaled withdrawals (respiration, ocean release). The balance stayed stable. Then humans started making massive extra withdrawals (burning fossil fuels, cutting forests) without matching deposits. The atmospheric "debt" is growing by 6 billion tonnes per year.',
      storyConnection: 'When the Girl planted trees, she was making deposits back into the carbon bank. Each tree she grew absorbed CO₂ from the atmosphere and locked it into wood, roots, and soil. She didn\'t know the numbers, but she understood the principle: trees take something bad out of the air and turn it into something good.',
      checkQuestion: 'The ocean absorbs about 25% of human CO₂ emissions. This sounds helpful. What is the downside?',
      checkAnswer: 'Ocean acidification. When CO₂ dissolves in seawater, it forms carbonic acid (H₂CO₃), lowering the pH. Ocean pH has dropped from 8.2 to 8.1 since pre-industrial times. This sounds small but it\'s a 30% increase in acidity (pH is logarithmic). Acidification dissolves the calcium carbonate shells of corals, shellfish, and plankton — threatening entire marine food chains.',
      codeIntro: 'Visualize the carbon cycle and its human disruption.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Carbon cycle: natural and human flows
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Natural carbon balance (pre-industrial)
ax1.set_facecolor('#111827')
reservoirs = ['Atmosphere\\n(590 Gt)', 'Plants\\n(550 Gt)', 'Soil\\n(1,500 Gt)',
              'Ocean\\n(38,000 Gt)', 'Fossil fuels\\n(10,000 Gt)']
sizes = [590, 550, 1500, 38000, 10000]
colors_r = ['#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#6b7280']

# Simplified: show reservoirs as bars
bars = ax1.bar(range(len(reservoirs)), [np.log10(s) for s in sizes],
              color=colors_r, edgecolor='none')
ax1.set_xticks(range(len(reservoirs)))
ax1.set_xticklabels(reservoirs, color='white', fontsize=8)
ax1.set_ylabel('Log₁₀(Gt Carbon)', color='white')
ax1.set_title('Carbon Reservoirs (size comparison)', color='white', fontsize=12)
ax1.tick_params(colors='gray')

for bar, size in zip(bars, sizes):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
            f'{size:,} Gt', ha='center', color='white', fontsize=9)

# Human impact: atmospheric CO2 over time
ax2.set_facecolor('#111827')
years_co2 = np.arange(1850, 2025)
# Approximate CO2 curve
co2_ppm = 280 + 0.5 * (years_co2 - 1850) + 0.01 * (years_co2 - 1850)**1.7
co2_ppm = np.clip(co2_ppm, 280, 425)
# Actual data points for calibration
actual_years = [1850, 1900, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024]
actual_co2 = [280, 296, 311, 317, 326, 339, 354, 370, 390, 414, 422]

ax2.plot(actual_years, actual_co2, 'o', color='#f59e0b', markersize=6, zorder=5, label='Measured CO₂')
ax2.fill_between(actual_years, 280, actual_co2, alpha=0.2, color='#ef4444')
ax2.axhline(280, color='#22c55e', linestyle='--', linewidth=1, label='Pre-industrial (280 ppm)')
ax2.axhline(350, color='#f59e0b', linestyle=':', linewidth=1, label='Safe limit (350 ppm)')

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('CO₂ concentration (ppm)', color='white')
ax2.set_title('Atmospheric CO₂: The Human Signal', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Annotate key periods
ax2.annotate('Industrial\\nRevolution', xy=(1870, 290), color='#9ca3af', fontsize=8, ha='center')
ax2.annotate('Post-WWII\\nacceleration', xy=(1950, 315), xytext=(1935, 340),
            color='#f59e0b', fontsize=8, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("The carbon math:")
print(f"  Pre-industrial CO₂: 280 ppm")
print(f"  Current CO₂: 422 ppm (+51%)")
print(f"  Rate of increase: ~2.5 ppm/year (accelerating)")
print()
print("  Human emissions: ~11 Gt C/year")
print("  Natural absorption: ~5 Gt C/year")
print("  Net atmospheric increase: ~6 Gt C/year")
print()
print("To stabilize climate, we need net emissions → 0.")`,
      challenge: 'If CO₂ increases by 2.5 ppm per year, when will it hit 500 ppm? What if we reduce emissions by 5% per year starting now — plot the trajectory. Does it still hit 500?',
      successHint: 'The carbon cycle is a balance sheet, and humanity is running a deficit. Every tree planted, every fossil fuel left unburned, shifts the balance. Understanding the numbers is the first step to meaningful action.',
    },
    {
      title: 'How trees store carbon — the biology of sequestration',
      concept: `Trees are carbon-capture machines. Through **photosynthesis**, they absorb CO₂ from the air, split it apart, release the O₂, and use the carbon to build their bodies.

**Where carbon goes in a tree:**
- **Trunk and branches** (50% of tree carbon): cellulose and lignin — solid, long-lasting
- **Roots** (25%): extend deep underground, pumping carbon into the soil
- **Leaves** (5%): temporary carbon store, recycled annually in deciduous trees
- **Soil organic matter** (20%): dead roots, leaf litter, fungal networks — can persist for centuries

**How much carbon does a tree store?**
- A typical tropical hardwood: ~22 kg of CO₂ per year
- A mature oak tree: ~900 kg of CO₂ stored over its lifetime
- 1 hectare of tropical forest: ~150-200 tonnes of carbon in biomass

**The math:**
- A tree is roughly 50% carbon by dry weight
- A 10-tonne tree (dry weight) contains ~5 tonnes of carbon
- That 5 tonnes of C was extracted from ~18.3 tonnes of CO₂ (C is 27% of CO₂ by weight)

Young, fast-growing trees sequester carbon fastest. Old-growth forests store the most carbon total but absorb less new carbon per year.`,
      analogy: 'A tree is like a solar-powered carbon vacuum cleaner. Sunlight provides the energy, leaves are the intake nozzle, photosynthesis is the motor, and the wood is the bag where carbon is permanently stored. The bigger the tree grows, the fuller the bag gets — and it never needs emptying.',
      storyConnection: 'Every sapling the Girl planted was a new carbon vacuum cleaner switched on. In the first few years, each tree absorbed a modest amount. But as they grew — trunks thickening, roots deepening, canopies spreading — the carbon capture accelerated. After a decade, her forest was pulling tonnes of CO₂ out of the atmosphere every year.',
      checkQuestion: 'If a forest fire destroys 1,000 hectares of tropical forest, how much CO₂ is released back into the atmosphere?',
      checkAnswer: 'A tropical forest stores ~150-200 tonnes of carbon per hectare in biomass, plus ~100 tonnes in soil. If the fire burns the biomass: 1,000 × 175 = 175,000 tonnes of carbon = 641,000 tonnes of CO₂ (multiply by 3.67 to convert C to CO₂). That\'s equivalent to the annual emissions of ~130,000 cars. Soil carbon may partially survive the fire depending on intensity.',
      codeIntro: 'Model carbon accumulation in a growing tree over its lifetime.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Carbon accumulation model for a tropical hardwood tree
years = np.arange(0, 101)

# Sigmoid growth model for tree biomass (kg dry weight)
max_biomass = 5000  # kg (large tropical tree)
k = 0.06  # growth rate
t_mid = 40  # years to half max

biomass = max_biomass / (1 + np.exp(-k * (years - t_mid)))
carbon = biomass * 0.5  # 50% of dry weight is carbon
co2_stored = carbon * 3.67  # convert C to CO2 equivalent

# Annual carbon sequestration rate
annual_seq = np.diff(carbon)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Cumulative carbon storage
ax1.set_facecolor('#111827')
ax1.fill_between(years, co2_stored, alpha=0.2, color='#22c55e')
ax1.plot(years, co2_stored, color='#22c55e', linewidth=2, label='CO₂ stored')
ax1.plot(years, carbon, color='#3b82f6', linewidth=2, label='Carbon stored')

# Mark key stages
stages = [(10, 'Sapling'), (25, 'Young tree'), (50, 'Mature'), (80, 'Old growth')]
for yr, label in stages:
    c = carbon[yr]
    ax1.plot(yr, c, 'o', color='#f59e0b', markersize=8)
    ax1.annotate(f'{label}\\n{c:.0f} kg C', xy=(yr, c), xytext=(yr+3, c+200),
                color='#f59e0b', fontsize=9)

ax1.set_ylabel('Mass stored (kg)', color='white')
ax1.set_title('Carbon Accumulation in a Tropical Hardwood Tree', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Annual sequestration rate
ax2.set_facecolor('#111827')
ax2.fill_between(years[1:], annual_seq, alpha=0.3, color='#22c55e')
ax2.plot(years[1:], annual_seq, color='#22c55e', linewidth=2)
ax2.set_xlabel('Tree age (years)', color='white')
ax2.set_ylabel('Carbon sequestered (kg C/year)', color='white')
ax2.set_title('Annual Sequestration Rate (fastest at middle age)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

peak_year = np.argmax(annual_seq) + 1
peak_rate = annual_seq.max()
ax2.annotate(f'Peak: {peak_rate:.1f} kg C/yr\\nat age {peak_year}',
            xy=(peak_year, peak_rate), xytext=(peak_year+15, peak_rate-5),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Tree carbon storage over its lifetime:")
print(f"  At 10 years:  {carbon[10]:.0f} kg C ({co2_stored[10]:.0f} kg CO₂)")
print(f"  At 25 years:  {carbon[25]:.0f} kg C ({co2_stored[25]:.0f} kg CO₂)")
print(f"  At 50 years:  {carbon[50]:.0f} kg C ({co2_stored[50]:.0f} kg CO₂)")
print(f"  At 100 years: {carbon[100]:.0f} kg C ({co2_stored[100]:.0f} kg CO₂)")
print(f"\\nPeak sequestration: {peak_rate:.1f} kg C/yr at age {peak_year}")
print("\\nYoung trees absorb carbon fastest.")
print("Old trees store the most total carbon.")
print("Both are needed for climate strategy.")`,
      challenge: 'Model a forest of 1,000 trees planted in the same year. Add natural mortality (2% of trees die per year after age 20). How does this change the forest-level carbon curve compared to 1,000 immortal trees?',
      successHint: 'Every tree is a carbon-capture device with a known capacity and rate curve. When the Girl planted her forest, she was deploying thousands of these devices. Understanding the math lets us plan reforestation at the scale needed to make a difference.',
    },
    {
      title: 'Reforestation methods — how to grow a forest',
      concept: `Reforestation is not just "planting trees." Successful forest restoration requires choosing the right method for the site, climate, and goals.

**Methods of reforestation:**

1. **Natural regeneration**: remove the pressure (grazing, logging) and let the forest regrow on its own. Cheapest, but slowest (decades). Works best where seed sources exist nearby.

2. **Direct seeding**: scatter seeds of native species. Low cost, moderate success rate (10-30% of seeds germinate and survive). Good for large areas.

3. **Nursery planting**: grow seedlings in a nursery for 6-12 months, then plant them. Higher cost but much higher survival rate (60-80%). The most common method.

4. **Miyawaki method**: plant native species very densely (3-5 per sq meter). Creates a diverse, multi-layered forest that grows 10x faster than conventional plantations. Used in urban areas and degraded land.

5. **Agroforestry**: integrate trees with crops or livestock. Not a full forest, but provides ecosystem services while maintaining food production. Common in NE India.

**Key decisions:**
- Species selection: native vs. exotic, fast-growing vs. long-lived
- Spacing: dense (competition drives upward growth) vs. sparse (each tree gets more resources)
- Maintenance: watering, weeding, protection from grazing for first 3-5 years
- Monitoring: track survival rates, growth, biodiversity return`,
      analogy: 'Reforestation methods are like cooking techniques. Natural regeneration is leaving bread dough to rise on its own. Direct seeding is scattering ingredients in a pot and hoping for the best. Nursery planting is following a recipe carefully. The Miyawaki method is a pressure cooker — intense conditions for fast results. Agroforestry is a stir-fry: combining ingredients (trees + crops) for a quick, practical meal.',
      storyConnection: 'The Girl started with nursery planting — carefully growing saplings from seeds she collected, then transplanting them to the bare hillside. As the first trees matured and dropped seeds, natural regeneration took over. She didn\'t know the terminology, but she instinctively combined methods: human effort to start, then nature to continue.',
      checkQuestion: 'A government announces it will plant 1 billion trees. Why might this NOT result in 1 billion new trees in 10 years?',
      checkAnswer: 'Multiple reasons: (1) Survival rates — typically 60-80% survive the first year, and continued mortality reduces this further. (2) Many "plantations" use monocultures (single species like eucalyptus) that don\'t create real forests. (3) Trees planted in wrong locations or wrong species for the climate will die. (4) Without maintenance (watering, weeding, protection) in the first 3-5 years, mortality skyrockets. A better metric than "trees planted" is "forest area established and surviving after 5 years."',
      codeIntro: 'Compare reforestation methods on cost, speed, survival rate, and biodiversity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Reforestation methods comparison
methods = ['Natural\\nRegeneration', 'Direct\\nSeeding', 'Nursery\\nPlanting', 'Miyawaki\\nMethod', 'Agroforestry']

# Scores (0-10 scale)
cost_per_ha = [1, 3, 6, 9, 5]         # higher = more expensive
survival_rate = [5, 3, 7, 8, 7]        # higher = better
growth_speed = [3, 4, 5, 9, 4]         # higher = faster
biodiversity = [9, 7, 5, 8, 6]         # higher = more diverse
labor_needed = [1, 3, 7, 9, 5]         # higher = more labor

# Years to canopy closure
years_to_canopy = [25, 15, 10, 3, 12]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Grouped bar chart
ax1.set_facecolor('#111827')
x = np.arange(len(methods))
w = 0.15
metrics = [
    (cost_per_ha, 'Cost', '#ef4444'),
    (survival_rate, 'Survival', '#22c55e'),
    (growth_speed, 'Speed', '#3b82f6'),
    (biodiversity, 'Biodiversity', '#f59e0b'),
]

for i, (vals, label, color) in enumerate(metrics):
    ax1.bar(x + i*w - 1.5*w, vals, w, color=color, label=label, alpha=0.8)

ax1.set_xticks(x)
ax1.set_xticklabels(methods, color='white', fontsize=8)
ax1.set_ylabel('Score (0-10)', color='white')
ax1.set_title('Reforestation Methods Compared', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Time to canopy closure
ax2.set_facecolor('#111827')
method_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899']

# Simulate canopy cover over time for each method
time = np.arange(0, 31)
for i, (method, yrs, color) in enumerate(zip(methods, years_to_canopy, method_colors)):
    # Sigmoid canopy closure
    canopy = 100 / (1 + np.exp(-0.3 * (time - yrs)))
    ax2.plot(time, canopy, color=color, linewidth=2, label=method.replace('\\n', ' '))

ax2.axhline(80, color='#6b7280', linestyle='--', linewidth=0.5, alpha=0.5)
ax2.text(28, 82, '80% canopy', color='#6b7280', fontsize=8, ha='right')

ax2.set_xlabel('Years after planting', color='white')
ax2.set_ylabel('Canopy cover (%)', color='white')
ax2.set_title('Time to Forest Canopy Closure', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8, loc='lower right')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Method trade-offs:")
print("  Natural regeneration: cheapest, slowest, highest biodiversity")
print("  Miyawaki: fastest (3 yrs to canopy!), most expensive")
print("  Nursery planting: the standard middle ground")
print("  Agroforestry: practical compromise for farming communities")
print()
print("The 'best' method depends on goals:")
print("  Maximum carbon capture? → Miyawaki (fast growth)")
print("  Maximum biodiversity? → Natural regeneration")
print("  Minimum cost? → Natural regeneration")
print("  Feed people AND restore forest? → Agroforestry")`,
      challenge: 'Calculate the cost-effectiveness of each method in terms of "tonnes CO₂ sequestered per dollar spent per year." Which method gives the best return on investment at 5 years? At 20 years? The answer changes with the time horizon.',
      successHint: 'Reforestation is an engineering problem with multiple valid solutions. The Girl chose the method that matched her resources (seeds, labor, time) and her goals (bring back the forest ecosystem). Modern reforestation programs make the same trade-offs at larger scales.',
    },
    {
      title: 'Measuring forest cover with satellites — seeing the whole picture',
      concept: `You can't manage what you can't measure. Satellite remote sensing allows us to monitor the world's forests at a scale impossible from the ground.

**How satellite forest monitoring works:**

1. **Optical satellites** (Landsat, Sentinel-2): photograph Earth in visible and infrared light. Healthy vegetation strongly reflects near-infrared (NIR) light — a property invisible to the human eye but obvious to sensors.

2. **NDVI** (Normalized Difference Vegetation Index): the most common vegetation index
   - **NDVI = (NIR - Red) / (NIR + Red)**
   - Ranges from -1 to +1
   - Dense forest: 0.6-0.9
   - Grassland: 0.2-0.4
   - Bare soil: 0.0-0.1
   - Water: negative values

3. **Change detection**: compare images of the same area taken months or years apart. Where NDVI drops significantly, deforestation has occurred.

4. **Global Forest Watch**: a free platform that tracks forest loss and gain worldwide, updated weekly. Anyone can check deforestation in their area.

**Limitations:**
- Cloud cover blocks optical satellites (a big problem in tropical/monsoon regions like NE India)
- Radar satellites (Sentinel-1) can see through clouds but provide less detail
- Resolution: Landsat = 30m pixels, Sentinel-2 = 10m pixels. Individual trees are barely visible.`,
      analogy: 'Satellite forest monitoring is like a doctor taking regular X-rays of the planet. The NDVI image shows "healthy" (green, high NDVI) vs. "sick" (brown, low NDVI) areas. Change detection is like comparing this month\'s X-ray to last month\'s — any new dark spots indicate a problem (deforestation).',
      storyConnection: 'If satellites had existed when the Girl started her forest, the change would have been visible from space. The bare hillside (low NDVI, brown) would have gradually turned green (high NDVI) over years. Each year\'s satellite image would have shown the forest expanding. Her work would have been documented in data, pixel by pixel.',
      checkQuestion: 'Why does healthy vegetation reflect near-infrared light so strongly? (Hint: it\'s not about the chlorophyll.)',
      checkAnswer: 'Chlorophyll absorbs red and blue light for photosynthesis but is transparent to NIR. The spongy mesophyll cells inside leaves scatter NIR light strongly, reflecting it back. This is a structural property of leaves, not a pigment property. Dead or stressed vegetation has collapsed mesophyll cells, so NIR reflectance drops dramatically. This is why NDVI is so effective — it measures the internal structure of leaves, not just their color.',
      codeIntro: 'Simulate NDVI calculations and forest change detection from satellite data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a satellite image of a 100x100 pixel area
# Each pixel represents 30m x 30m (Landsat resolution)
size = 100

# Create a landscape: forest in the center and south, agriculture in north
landscape = np.zeros((size, size))

# Dense forest (NDVI 0.6-0.9)
landscape[30:90, 20:80] = np.random.uniform(0.6, 0.9, (60, 60))

# Grassland/agriculture (NDVI 0.2-0.4)
landscape[:30, :] = np.random.uniform(0.2, 0.4, (30, size))
landscape[90:, :] = np.random.uniform(0.2, 0.4, (10, size))
landscape[30:90, :20] = np.random.uniform(0.15, 0.35, (60, 20))
landscape[30:90, 80:] = np.random.uniform(0.15, 0.35, (60, 20))

# Water body (negative NDVI)
landscape[70:80, 60:75] = np.random.uniform(-0.3, -0.1, (10, 15))

# Simulate deforestation: clear a patch
landscape_after = landscape.copy()
landscape_after[40:55, 35:55] = np.random.uniform(0.05, 0.15, (15, 20))  # cleared area

# Change map
change = landscape_after - landscape

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Before
ax1 = axes[0]
im1 = ax1.imshow(landscape, cmap='RdYlGn', vmin=-0.3, vmax=0.9)
ax1.set_title('NDVI: Before (Year 1)', color='white', fontsize=12)
ax1.set_xlabel('Pixel (30m each)', color='white')
ax1.set_ylabel('Pixel', color='white')
ax1.tick_params(colors='gray')
plt.colorbar(im1, ax=ax1, label='NDVI', shrink=0.8)

# After
ax2 = axes[1]
im2 = ax2.imshow(landscape_after, cmap='RdYlGn', vmin=-0.3, vmax=0.9)
ax2.set_title('NDVI: After (Year 2)', color='white', fontsize=12)
ax2.set_xlabel('Pixel (30m each)', color='white')
ax2.tick_params(colors='gray')
plt.colorbar(im2, ax=ax2, label='NDVI', shrink=0.8)

# Change detection
ax3 = axes[2]
im3 = ax3.imshow(change, cmap='RdBu', vmin=-0.8, vmax=0.8)
ax3.set_title('Change Detection (red = loss)', color='white', fontsize=12)
ax3.set_xlabel('Pixel (30m each)', color='white')
ax3.tick_params(colors='gray')
plt.colorbar(im3, ax=ax3, label='NDVI change', shrink=0.8)

# Outline deforested area
from matplotlib.patches import Rectangle
for ax in [axes[1], axes[2]]:
    rect = Rectangle((34.5, 39.5), 20, 15, linewidth=2, edgecolor='#f59e0b', facecolor='none', linestyle='--')
    ax.add_patch(rect)

plt.tight_layout()
plt.show()

# Calculate statistics
forest_before = np.sum(landscape > 0.5)
forest_after = np.sum(landscape_after > 0.5)
lost = forest_before - forest_after

print(f"Forest analysis (pixels with NDVI > 0.5):")
print(f"  Before: {forest_before} pixels ({forest_before * 0.09:.1f} hectares)")
print(f"  After:  {forest_after} pixels ({forest_after * 0.09:.1f} hectares)")
print(f"  Lost:   {lost} pixels ({lost * 0.09:.1f} hectares)")
print(f"  Loss:   {lost/forest_before*100:.1f}%")
print()
print("Each pixel = 30m × 30m = 900 m² = 0.09 hectares")
print("The deforested patch is clearly visible in the change map.")`,
      challenge: 'Add "reforestation" to the simulation: in Year 3, the deforested patch starts regrowing (NDVI increases by 0.1/year). After 5 years, what does the change map look like? How many years until the patch reaches NDVI 0.6 again?',
      successHint: 'Satellite monitoring turns forest management from guesswork into data science. NDVI, change detection, and platforms like Global Forest Watch give us the tools to track every hectare of forest on Earth. The Girl\'s forest is now measurable from space.',
    },
    {
      title: 'Community forestry — people and trees together',
      concept: `The most successful reforestation programs are not run by governments or NGOs alone — they are run by **communities**. Community forestry gives local people the rights, responsibilities, and benefits of managing their own forests.

**Why community forestry works:**
- People protect what they own and benefit from
- Local knowledge of species, soil, and seasons is irreplaceable
- Monitoring is continuous (people live there) vs. periodic (government inspectors visit occasionally)
- Economic incentives align: forest products (fruit, honey, medicinal plants, timber) provide income

**India's Joint Forest Management (JFM):**
- Started in 1990
- ~118,000 committees managing ~23 million hectares
- Communities share forest revenues with the government
- Mixed results: works well where communities are empowered, poorly where they're marginalized

**NE India examples:**
- **Community forests of Meghalaya**: some of the best-preserved forests in India, managed by Khasi and Garo village councils for centuries
- **Sacred groves**: forests protected by religious tradition — an ancient form of community conservation
- **Bamboo management**: communities in Mizoram and Nagaland manage bamboo forests for sustainable harvest

**Key principle**: forests succeed when the people who live next to them have a stake in their survival. Top-down conservation without community buy-in almost always fails.`,
      analogy: 'Community forestry is like a neighborhood watch for trees. When everyone on the street watches out for crime, crime drops. When everyone in the village watches out for illegal logging, the forest survives. The key is that everyone has a personal stake — it\'s their forest, their income, their responsibility.',
      storyConnection: 'The Girl didn\'t grow a forest alone. The story tells of neighbors who joined her — first skeptically, then enthusiastically, as they saw birds returning, streams flowing again, and forest products appearing. Her forest succeeded because it became the community\'s forest. The lesson is universal: one person can start, but it takes a village to sustain.',
      checkQuestion: 'Why do sacred groves in NE India (protected for religious reasons) have higher biodiversity than government-managed "protected areas"?',
      checkAnswer: 'Three reasons: (1) Duration — sacred groves have been protected for centuries (even millennia), while government reserves are decades old. (2) Consistency — religious taboos are enforced daily by the entire community, while government rules are enforced sporadically. (3) Completeness — sacred groves are completely untouched (no "sustainable harvest," no tourism infrastructure), preserving the ecosystem in its entirety. The social enforcement mechanism is stronger than the legal one.',
      codeIntro: 'Model the impact of community forestry on forest survival rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate forest survival under different management regimes
years = np.arange(0, 51)

# Open access (no management): steady decline
open_access = 100 * np.exp(-0.04 * years) + np.random.normal(0, 2, len(years))
open_access = np.clip(open_access, 0, 100)

# Government managed: slow decline (enforcement is imperfect)
gov_managed = 100 * np.exp(-0.015 * years) + np.random.normal(0, 3, len(years))
gov_managed = np.clip(gov_managed, 0, 100)

# Community forestry: stable or slight increase
community = 85 + 15 * (1 - np.exp(-0.05 * years)) + np.random.normal(0, 2, len(years))
community = np.clip(community, 0, 100)

# Sacred grove: minimal change (ancient protection)
sacred = 95 + np.random.normal(0, 1, len(years))
sacred = np.clip(sacred, 0, 100)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Forest cover over time
ax1.set_facecolor('#111827')
ax1.plot(years, open_access, color='#ef4444', linewidth=2, label='Open access (no rules)')
ax1.plot(years, gov_managed, color='#f59e0b', linewidth=2, label='Government managed')
ax1.plot(years, community, color='#22c55e', linewidth=2, label='Community forestry')
ax1.plot(years, sacred, color='#a855f7', linewidth=2, label='Sacred grove')

ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Forest cover (%)', color='white')
ax1.set_title('Forest Survival by Management Type', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 105)

# Benefits distribution
ax2.set_facecolor('#111827')
management = ['Open\nAccess', 'Government', 'Community\nForestry', 'Sacred\nGrove']
benefits = {
    'Timber income': [8, 5, 7, 0],
    'Forest products': [3, 2, 8, 1],
    'Carbon credit': [0, 3, 6, 2],
    'Biodiversity': [2, 5, 7, 10],
    'Water services': [2, 5, 8, 9],
}
colors_b = ['#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
bottom = np.zeros(4)

for (benefit, vals), color in zip(benefits.items(), colors_b):
    ax2.bar(management, vals, bottom=bottom, color=color, label=benefit, edgecolor='none')
    bottom += np.array(vals)

ax2.set_ylabel('Benefit score', color='white')
ax2.set_title('Total Benefits by Management Type', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
plt.setp(ax2.get_xticklabels(), color='white')

plt.tight_layout()
plt.show()

print("50-year forest cover outcomes:")
print(f"  Open access:      {open_access[-1]:.0f}% (almost gone)")
print(f"  Government:       {gov_managed[-1]:.0f}% (declining)")
print(f"  Community forest: {community[-1]:.0f}% (stable/growing)")
print(f"  Sacred grove:     {sacred[-1]:.0f}% (pristine)")
print()
print("Community forestry wins on TOTAL benefits because it")
print("combines economic returns with environmental services.")
print("Sacred groves win on biodiversity but provide less income.")`,
      challenge: 'Add a scenario: "Community forestry with carbon credits." Carbon credits add $10/tonne CO₂/year to the community income. If the forest stores 150 tonnes C/ha and covers 500 hectares, what is the annual carbon credit income? How does this change the incentive to protect vs. clear the forest?',
      successHint: 'From deforestation causes to carbon cycles to tree biology to reforestation methods to satellite monitoring to community management — you now understand the full chain of forest restoration. The Girl Who Grew a Forest did all of this intuitively. Level 2 takes it to the global scale with climate science and carbon markets.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior environmental science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for environmental science simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
