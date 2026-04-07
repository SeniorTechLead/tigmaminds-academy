import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RicePlantedLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is agriculture — the invention that changed everything',
      concept: `**Agriculture** is the deliberate cultivation of plants and animals for food, fiber, and fuel. It is arguably the single most important invention in human history.

Before agriculture (~12,000 years ago): all humans were hunter-gatherers. Small, nomadic bands of 20-50 people followed food sources. Total human population: ~5-10 million worldwide.

After agriculture: humans settled in one place, grew food predictably, stored surpluses, and built civilizations. Population exploded.

The consequences:
- **Food surplus** -> specialization (not everyone needs to farm) -> artisans, soldiers, priests, kings
- **Settlement** -> villages -> cities -> civilizations
- **Population growth** -> 5 million to 8 billion in 12,000 years
- **Land transformation** -> 38% of Earth's land is now farmland
- **Environmental change** -> deforestation, irrigation, soil depletion, greenhouse gases

Agriculture didn't happen everywhere at once. It was independently invented at least 7 times:
- Fertile Crescent (wheat, barley) ~10,000 BCE
- China (rice, millet) ~8,000 BCE
- Mesoamerica (corn, squash) ~7,000 BCE
- Andes (potato) ~8,000 BCE
- Sub-Saharan Africa (sorghum, yams) ~5,000 BCE
- Eastern North America (sunflower) ~4,000 BCE
- New Guinea (taro, banana) ~7,000 BCE`,
      analogy: 'Agriculture is like switching from hunting for Wi-Fi hotspots to installing your own router. Hunter-gatherers wandered looking for food (searching for signal). Farmers planted crops in one place (installed the router). Once the "connection" was reliable, everything else could be built on top of it — villages, cities, the internet, everything.',
      storyConnection: 'In "How the First Rice Was Planted," a Tiwa origin tale, rice is a gift from the spirits — a magical plant that feeds the people year after year. The real origin of rice cultivation is equally remarkable: someone in ancient China noticed that certain wild grass seeds could be planted, tended, and harvested predictably. That observation changed the trajectory of human civilization.',
      checkQuestion: 'If agriculture produces more food per hectare than hunting-gathering, why did early farmers actually have WORSE nutrition than hunter-gatherers? (Archaeological evidence shows shorter stature, more tooth decay, and more disease.)',
      checkAnswer: 'Three reasons: (1) Diet narrowed — hunter-gatherers ate 200+ species; early farmers ate mostly one crop (rice or wheat), causing nutritional deficiencies. (2) Crowding — settlements allowed diseases to spread (measles, smallpox). (3) Hard labor — farming is more physically demanding than foraging. Agriculture wasn\'t adopted because it was "better" for individuals — it was adopted because it supported MORE people per unit area, even if each person was less healthy.',
      codeIntro: 'Visualize the population explosion caused by agriculture.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Human population growth: before and after agriculture
# Using historical estimates

years_bce = np.array([-100000, -50000, -12000, -10000, -5000, -3000, -1000, -500, 0])
years_ce = np.array([500, 1000, 1500, 1700, 1800, 1900, 1950, 1975, 2000, 2024])
pop_bce = np.array([0.5, 2, 5, 5, 18, 45, 100, 150, 200])  # millions
pop_ce = np.array([250, 310, 500, 600, 1000, 1600, 2500, 4000, 6100, 8100])  # millions

all_years = np.concatenate([years_bce, years_ce])
all_pop = np.concatenate([pop_bce, pop_ce])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Full timeline (log scale for population)
ax1.set_facecolor('#111827')
ax1.semilogy(all_years, all_pop, 'o-', color='#3b82f6', linewidth=2, markersize=4)
ax1.axvline(-10000, color='#22c55e', linestyle='--', linewidth=1, label='Agriculture begins')
ax1.axvline(1750, color='#f59e0b', linestyle='--', linewidth=1, label='Industrial Revolution')
ax1.fill_between(all_years, all_pop, 0.1, alpha=0.1, color='#3b82f6')
ax1.set_xlabel('Year (BCE negative, CE positive)', color='white')
ax1.set_ylabel('World population (millions, log scale)', color='white')
ax1.set_title('Human Population: 100,000 Years', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Agriculture origins map (simplified bar chart)
ax2.set_facecolor('#111827')
origins = ['Fertile\\nCrescent', 'China', 'Mesoamerica', 'Andes', 'Sub-Saharan\\nAfrica', 'E. North\\nAmerica', 'New Guinea']
dates_bce = [10000, 8000, 7000, 8000, 5000, 4000, 7000]
crops = ['Wheat,\\nbarley', 'Rice,\\nmillet', 'Corn,\\nsquash', 'Potato', 'Sorghum,\\nyams', 'Sunflower', 'Taro,\\nbanana']
colors_orig = ['#f59e0b', '#ef4444', '#22c55e', '#a855f7', '#3b82f6', '#ec4899', '#14b8a6']

bars = ax2.barh(origins, dates_bce, color=colors_orig, height=0.6)
ax2.set_xlabel('Years ago (BCE)', color='white')
ax2.set_title('Independent Origins of Agriculture', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_yticklabels(origins, color='white', fontsize=9)

for bar, crop, d in zip(bars, crops, dates_bce):
    ax2.text(d + 100, bar.get_y() + bar.get_height()/2,
             crop, va='center', color='white', fontsize=8)

ax2.invert_xaxis()

plt.tight_layout()
plt.show()

print("Agriculture's impact by the numbers:")
print(f"  Pre-agriculture population: ~5 million")
print(f"  Current population: ~8,100 million")
print(f"  Growth factor: {8100/5:,.0f}x in 12,000 years")
print()
print("  Farmland: 38% of Earth's land surface")
print("  Water: 70% of freshwater withdrawal is for agriculture")
print("  Emissions: 25% of greenhouse gases from farming")
print()
print("Rice alone feeds 3.5 billion people — nearly half of humanity.")`,
      challenge: 'Plot population growth on a LINEAR scale instead of log. The hockey stick shape becomes even more dramatic. At what year did population growth become exponential? What caused the acceleration?',
      successHint: 'Agriculture transformed humanity from a minor species of 5 million to a dominant force of 8 billion. Understanding this transition is essential for understanding every environmental, social, and economic challenge we face today.',
    },
    {
      title: 'Crop domestication — how wild grass became rice',
      concept: `**Domestication** is the process by which humans selectively breed wild organisms to enhance traits useful to us. Rice was domesticated from the wild grass **Oryza rufipogon** over 2,000-3,000 years of selective breeding.

Key changes from wild rice to domestic rice:

1. **Shattering**: Wild rice grains fall off the plant when ripe (shattering) — good for the plant (seed dispersal), bad for the farmer (grains lost). Domesticated rice holds its grains until harvested. A single mutation in the gene **sh4** controls this.

2. **Grain size**: Domestic rice grains are 30-50% larger than wild rice.

3. **Uniform ripening**: Wild rice grains ripen at different times (insurance against bad weather). Domestic rice ripens all at once (easier to harvest).

4. **Reduced dormancy**: Wild rice seeds can lie dormant for years. Domestic rice germinates immediately when planted.

5. **Erect growth**: Wild rice sprawls. Domestic rice grows upright, allowing denser planting.

The process: Each year, farmers saved seeds from the best plants (biggest grains, no shattering, upright growth) and planted them the next year. Over hundreds of generations, the accumulated selections transformed a weedy wild grass into the crop that feeds 3.5 billion people.

This is **artificial selection** — the same process Darwin used to understand natural selection.`,
      analogy: 'Domestication is like training a wild wolf into a pet dog over thousands of generations. The wolf that was slightly less aggressive got more food from humans. Its puppies that were even less aggressive got even more food. Over 15,000 years: wolves became chihuahuas. The same thing happened with rice: the wild grass that held its seeds slightly better got replanted. Over 3,000 years: wild grass became Basmati.',
      storyConnection: 'The Tiwa origin tale speaks of rice as a gift from the spirits. In biological terms, the "gift" was the genetic variation in wild Oryza rufipogon — the raw material for domestication. The first farmers who noticed that some plants held their grains better were the real spirits of the story. Their patient, generational selection gave humanity its most important food crop.',
      checkQuestion: 'Only about 20 plant species provide 90% of human food, out of 400,000 known plant species. Why so few? Why didn\'t we domesticate more?',
      checkAnswer: 'Not all plants are domesticable. Requirements: (1) High caloric yield per unit area. (2) Short generation time (annual plants preferred). (3) Ability to self-pollinate (for consistent offspring). (4) Seeds that store well. (5) Easy to harvest. (6) Enough genetic variation for selection. Most wild plants fail on at least one criterion. Oak trees produce nutritious acorns but take 20 years to fruit — impossible to selectively breed in a human lifetime.',
      codeIntro: 'Simulate the domestication process: selecting for larger grain size over generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate domestication: selecting top 20% of grain size each generation
n_plants = 200  # plants per generation
n_generations = 100
heritability = 0.5  # proportion of trait variation that's genetic

# Wild rice starting distribution
mean_grain = 3.0  # mm (wild rice grain length)
std_grain = 0.5

# Track mean grain size over generations
means = [mean_grain]
stds = [std_grain]
all_generations = {0: np.random.normal(mean_grain, std_grain, n_plants)}

current_mean = mean_grain
current_std = std_grain

for gen in range(1, n_generations + 1):
    # Generate this generation
    population = np.random.normal(current_mean, current_std, n_plants)

    # Select top 20% (farmer picks the best plants)
    threshold = np.percentile(population, 80)
    selected = population[population >= threshold]

    # Response to selection: R = h^2 * S
    selection_differential = np.mean(selected) - np.mean(population)
    response = heritability * selection_differential

    current_mean = np.mean(population) + response
    current_std = current_std * 0.999  # slight reduction in variation over time

    means.append(current_mean)
    stds.append(current_std)

    if gen in [0, 10, 25, 50, 100]:
        all_generations[gen] = population

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Mean grain size over generations
ax1.set_facecolor('#111827')
gens = np.arange(n_generations + 1)
ax1.plot(gens, means, color='#22c55e', linewidth=2)
ax1.fill_between(gens, [m - s for m, s in zip(means, stds)],
                 [m + s for m, s in zip(means, stds)], alpha=0.15, color='#22c55e')
ax1.set_xlabel('Generations of selection', color='white')
ax1.set_ylabel('Mean grain length (mm)', color='white')
ax1.set_title('Domestication: Grain Size Over 100 Generations', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.axhline(3.0, color='#f59e0b', linestyle='--', linewidth=1, label='Wild rice')
ax1.axhline(means[-1], color='#22c55e', linestyle='--', linewidth=1,
            label=f'Domestic rice ({means[-1]:.1f}mm)')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Distribution snapshots
ax2.set_facecolor('#111827')
gen_colors = {0: '#ef4444', 10: '#f59e0b', 25: '#22c55e', 50: '#3b82f6', 100: '#a855f7'}
for gen, pop in all_generations.items():
    ax2.hist(pop, bins=20, alpha=0.4, color=gen_colors.get(gen, '#6b7280'),
             label=f'Gen {gen} (mean={np.mean(pop):.1f}mm)', density=True)

ax2.set_xlabel('Grain length (mm)', color='white')
ax2.set_ylabel('Density', color='white')
ax2.set_title('Grain Size Distribution Over Time', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

improvement = (means[-1] - means[0]) / means[0] * 100
print(f"Domestication simulation results:")
print(f"  Starting grain size: {means[0]:.1f} mm (wild)")
print(f"  After 100 generations: {means[-1]:.1f} mm")
print(f"  Improvement: {improvement:.0f}%")
print(f"  Selection intensity: top 20% each generation")
print(f"  Heritability: {heritability}")
print()
print(f"At 1 generation per year, 100 generations = 100 years.")
print(f"Real domestication took ~2,000-3,000 years (slower, less intense selection).")`,
      challenge: 'Change heritability from 0.5 to 0.8 (strongly genetic trait). How does this speed up domestication? Now try 0.1 (mostly environmental variation). What happens? This shows why some traits are easier to breed for than others.',
      successHint: 'Domestication is applied genetics — the same principles underpin modern plant breeding, genetic engineering, and even machine learning (where "selection" is optimization). The rice in your bowl was shaped by thousands of years of cumulative human choices.',
    },
    {
      title: 'Rice biology — paddy vs. upland, the two strategies',
      concept: `Rice (**Oryza sativa**) comes in two main cultivation types that represent different survival strategies:

**Paddy (lowland/wetland) rice** — grown in flooded fields:
- Fields are flooded with 5-15 cm of standing water
- The water controls weeds (most weeds can't survive flooding)
- Rice survives because of **aerenchyma** — air channels from leaves to submerged roots
- Produces higher yields (5-10 tonnes/hectare)
- Requires flat land and abundant water
- ~75% of world rice production
- Two subspecies: **indica** (long grain, tropical) and **japonica** (short grain, temperate)

**Upland (dryland) rice** — grown in rain-fed fields:
- No flooding — relies on rainfall only
- Planted on hillsides and slopes
- Lower yields (1-3 tonnes/hectare) but needs less water
- More drought-tolerant
- Important for subsistence farmers in Assam, Southeast Asia, Africa
- Known as "bao dhan" in Assamese

Northeast India is unique: it has the highest diversity of rice varieties on Earth. Over 5,000 traditional varieties are grown, adapted to micro-environments from swamps to hilltops. This genetic diversity is a global treasure — a library of adaptive solutions for future rice breeding.`,
      analogy: 'Paddy rice is like a fish farm — you flood the field, creating an artificial aquatic environment. Upland rice is like free-range farming — the plants grow in natural conditions, no infrastructure needed. The fish farm produces more per unit area, but it needs water infrastructure. Free-range costs less but yields less. Both are valid strategies; the choice depends on the landscape.',
      storyConnection: 'The Tiwa people in our story planted rice in the hills — this is upland rice, the ancient way. Paddy rice came later, with the engineering of flat, flooded fields. The story captures the original relationship between people and rice: simple, rain-fed, and deeply connected to the land. Upland rice varieties from the Tiwa hills may hold the genetic keys to drought-resistant rice for a hotter future.',
      checkQuestion: 'Paddy rice fields produce methane (a greenhouse gas 80x more powerful than CO2 over 20 years). Why? And can we grow rice without producing methane?',
      checkAnswer: 'Flooded paddy fields create anaerobic (oxygen-free) conditions in the soil. Anaerobic bacteria called methanogens decompose organic matter and produce methane (CH4). Rice fields produce 1.5% of global greenhouse gas emissions. Solutions: (1) Alternate wetting and drying (AWD) — drain and re-flood periodically, reducing methane by 30-50%. (2) Upland rice — no flooding, no methane. (3) Rice varieties with smaller root systems that leak less oxygen (reducing methanogen habitat).',
      codeIntro: 'Compare paddy vs. upland rice across key agricultural metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Paddy vs Upland rice comparison

categories = ['Yield\\n(t/ha)', 'Water\\nneeded', 'Labor\\nintensity', 'Weed\\ncontrol', 'Drought\\ntolerance', 'Methane\\nemissions']
paddy_scores = [9, 2, 7, 9, 2, 2]  # higher = better for all except methane
upland_scores = [4, 8, 4, 4, 8, 9]

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Radar chart comparison
N = len(categories)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

ax1 = fig.add_subplot(221, polar=True)
ax1.set_facecolor('#111827')
p_vals = paddy_scores + paddy_scores[:1]
u_vals = upland_scores + upland_scores[:1]
ax1.plot(angles, p_vals, 'o-', linewidth=2, label='Paddy rice', color='#3b82f6')
ax1.fill(angles, p_vals, alpha=0.1, color='#3b82f6')
ax1.plot(angles, u_vals, 'o-', linewidth=2, label='Upland rice', color='#22c55e')
ax1.fill(angles, u_vals, alpha=0.1, color='#22c55e')
ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(categories, color='white', fontsize=8)
ax1.set_ylim(0, 10)
ax1.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=9)
ax1.set_title('Paddy vs Upland Rice', color='white', fontsize=12, pad=20)

# Yield distribution by region
ax2 = fig.add_subplot(222)
ax2.set_facecolor('#111827')
regions = ['China', 'India', 'SE Asia', 'Africa', 'Americas']
paddy_yield = [7.0, 3.9, 4.5, 2.5, 5.5]
upland_yield = [0, 1.5, 2.0, 1.2, 2.5]
x = np.arange(len(regions))
width = 0.35
ax2.bar(x - width/2, paddy_yield, width, label='Paddy', color='#3b82f6')
ax2.bar(x + width/2, upland_yield, width, label='Upland', color='#22c55e')
ax2.set_xticks(x)
ax2.set_xticklabels(regions, color='white', fontsize=9)
ax2.set_ylabel('Yield (tonnes/hectare)', color='white')
ax2.set_title('Rice Yield by Region and Type', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Water requirement through growing season
ax3 = fig.add_subplot(223)
ax3.set_facecolor('#111827')
weeks = np.arange(0, 21)  # 20-week growing season
# Paddy: constant flooding
paddy_water = np.where(weeks < 2, 30, np.where(weeks < 16, 80, 20))  # mm/week
# Upland: rain-dependent, variable
upland_water = 30 + 20 * np.sin(weeks * np.pi / 10)  # seasonal pattern
rainfall = 25 + 15 * np.sin(weeks * np.pi / 10 + 1)  # typical monsoon pattern

ax3.plot(weeks, paddy_water, color='#3b82f6', linewidth=2, label='Paddy water need')
ax3.plot(weeks, upland_water, color='#22c55e', linewidth=2, label='Upland water need')
ax3.plot(weeks, rainfall, color='#f59e0b', linewidth=2, linestyle='--', label='Rainfall')
ax3.fill_between(weeks, upland_water, rainfall, where=upland_water > rainfall,
                 alpha=0.15, color='#ef4444', label='Deficit')
ax3.set_xlabel('Weeks after planting', color='white')
ax3.set_ylabel('Water (mm/week)', color='white')
ax3.set_title('Water Needs: Paddy vs Upland vs Rainfall', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# Rice diversity in NE India
ax4 = fig.add_subplot(224)
ax4.set_facecolor('#111827')
ne_states = ['Assam', 'Manipur', 'Meghalaya', 'Nagaland', 'Mizoram', 'Tripura']
varieties = [3000, 800, 500, 400, 200, 300]
colors_ne = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#ec4899']
bars4 = ax4.bar(ne_states, varieties, color=colors_ne, width=0.6)
ax4.set_ylabel('Traditional rice varieties', color='white')
ax4.set_title('Rice Diversity in Northeast India', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.set_xticklabels(ne_states, color='white', fontsize=9)
for bar, v in zip(bars4, varieties):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 30,
             f'{v:,}', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Paddy vs Upland rice:")
print(f"  Paddy yield: 5-10 t/ha | Upland yield: 1-3 t/ha")
print(f"  Paddy water: ~1,200 mm/season | Upland: ~600 mm/season")
print(f"  Paddy methane: significant | Upland: minimal")
print()
print(f"Northeast India rice diversity:")
print(f"  Assam alone: ~3,000 traditional varieties")
print(f"  Total NE India: ~5,000+ varieties")
print(f"  This is more diversity than most entire countries.")
print(f"  Each variety is adapted to a specific micro-environment.")`,
      challenge: 'Climate change will increase droughts and reduce water availability. Model a scenario where monsoon rainfall drops by 30%. How does this affect paddy vs. upland rice? Which system is more resilient?',
      successHint: 'Understanding the paddy vs. upland distinction reveals that rice isn\'t one crop — it\'s a spectrum of strategies for feeding people in different landscapes. Northeast India\'s variety diversity is a global resource for breeding climate-resilient rice.',
    },
    {
      title: 'Water management in rice cultivation — engineering the paddy',
      concept: `A rice paddy is one of humanity's oldest and most sophisticated hydraulic engineering systems:

**Components of a paddy field system**:
1. **Bunds (levees)**: Earth walls around each field that hold water in. Must be precisely level.
2. **Canals**: Channels that distribute water from rivers or reservoirs to individual fields.
3. **Gates/weirs**: Control structures that regulate water flow and depth.
4. **Terraces**: On hillsides, stepped fields carved into the slope. The Banaue Rice Terraces in the Philippines are 2,000 years old and called the "Eighth Wonder of the World."

**Water management cycle**:
- **Land preparation**: Fields flooded, plowed in standing water (puddling)
- **Transplanting**: 5-7 cm water depth maintained
- **Vegetative growth**: 5-10 cm, periodically drained and re-flooded
- **Flowering**: Critical period — water must be maintained
- **Grain filling**: Gradual drainage
- **Harvest**: Fields drained completely, 2-3 weeks before harvest

**Water use**: A traditional paddy uses 1,200-2,000 mm of water per crop. This is 2-3x more than wheat or corn. About 50% is lost to evaporation and seepage.

Modern techniques like **Alternate Wetting and Drying (AWD)** reduce water use by 15-30% with no yield loss.`,
      analogy: 'A paddy field system is like a multi-story apartment building\'s plumbing. Each field (apartment) needs water at specific times and depths. The canal system (pipes) distributes water. The gates (valves) control flow. The bunds (walls) prevent leakage. The whole system must work together — a leak in one field floods the next. Rice paddy engineering is civil engineering at village scale.',
      storyConnection: 'The Tiwa story tells of planting the first rice — but it skips the engineering. Building a paddy field requires reshaping the land, controlling water, and coordinating among farmers who share the same water source. The "first rice" wasn\'t just planted — it was engineered. The story\'s simplicity belies thousands of years of accumulated hydraulic knowledge.',
      checkQuestion: 'The Banaue Rice Terraces in the Philippines have operated for 2,000 years without modern pumps or concrete. How do they move water uphill to the highest terrace?',
      checkAnswer: 'They don\'t move water uphill. The system intercepts rainwater and spring water at the TOP of the mountain and distributes it downhill through a network of channels and bamboo pipes. Each terrace receives water from the one above, uses it, and passes the excess down. The entire system is gravity-driven — no pumps needed. It\'s a masterpiece of passive hydraulic engineering.',
      codeIntro: 'Model water flow and management in a terraced paddy system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Paddy water management simulation
weeks = np.arange(0, 21)

# Ideal water depth for different growth stages
ideal_depth = np.piecewise(weeks.astype(float),
    [weeks < 2, (weeks >= 2) & (weeks < 4), (weeks >= 4) & (weeks < 10),
     (weeks >= 10) & (weeks < 14), (weeks >= 14) & (weeks < 18), weeks >= 18],
    [3, 7, 10, 8, 5, 0])

# Water inputs
rainfall = 20 + 15 * np.sin(weeks * np.pi / 10)  # mm/week monsoon pattern
irrigation = np.maximum(0, ideal_depth * 10 - rainfall)  # top up to ideal

# Water losses
evapotranspiration = 35 + 10 * np.sin(weeks * np.pi / 10)  # mm/week
seepage = 15  # mm/week (constant loss through soil)

# Water balance
water_balance = rainfall + irrigation - evapotranspiration - seepage

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Water depth management
ax1.set_facecolor('#111827')
ax1.fill_between(weeks, ideal_depth, alpha=0.3, color='#3b82f6', label='Target water depth')
ax1.plot(weeks, ideal_depth, color='#3b82f6', linewidth=2)
stages = ['Prep', 'Trans-\\nplant', 'Vegetative growth', 'Flower', 'Grain fill', 'Drain']
stage_weeks = [1, 3, 7, 12, 16, 19]
for sw, name in zip(stage_weeks, stages):
    ax1.annotate(name, xy=(sw, ideal_depth[sw] + 0.5), color='white', fontsize=8,
                 ha='center')
ax1.set_xlabel('Weeks after planting', color='white')
ax1.set_ylabel('Water depth (cm)', color='white')
ax1.set_title('Rice Paddy Water Management Cycle', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Water inputs vs losses
ax2.set_facecolor('#111827')
ax2.stackplot(weeks, rainfall, irrigation,
              colors=['#3b82f6', '#22c55e'], alpha=0.7,
              labels=['Rainfall', 'Irrigation'])
ax2.plot(weeks, evapotranspiration + seepage, color='#ef4444', linewidth=2,
         linestyle='--', label='Total losses (ET + seepage)')
ax2.set_xlabel('Weeks', color='white')
ax2.set_ylabel('Water (mm/week)', color='white')
ax2.set_title('Water Budget: Inputs vs Losses', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Terraced paddy system cross-section
ax3.set_facecolor('#111827')
# Draw terraces
n_terraces = 6
for i in range(n_terraces):
    x_start = i * 2
    y_start = (n_terraces - i) * 1.5
    # Flat field
    ax3.fill_between([x_start, x_start + 1.8], y_start, y_start + 0.3,
                     color='#3b82f6', alpha=0.5)
    ax3.fill_between([x_start, x_start + 1.8], y_start - 0.3, y_start,
                     color='#92400e', alpha=0.7)
    # Bund
    ax3.fill_between([x_start + 1.8, x_start + 2], y_start - 0.3, y_start + 0.5,
                     color='#78350f', alpha=0.8)
    # Water flow arrow
    if i < n_terraces - 1:
        ax3.annotate('', xy=(x_start + 2.3, y_start - 1.2),
                     xytext=(x_start + 1.7, y_start - 0.1),
                     arrowprops=dict(arrowstyle='->', color='#3b82f6', lw=2))
    # Rice plants
    for rx in np.linspace(x_start + 0.2, x_start + 1.6, 5):
        ax3.plot([rx, rx], [y_start + 0.3, y_start + 0.8], color='#22c55e', linewidth=1.5)

ax3.annotate('Spring/rain\\nwater input', xy=(0, n_terraces * 1.5 + 1),
             color='#3b82f6', fontsize=10, ha='center')
ax3.annotate('Gravity flow', xy=(6, 5), color='#3b82f6', fontsize=9, ha='center')
ax3.set_title('Terraced Paddy System (Cross-Section)', color='white', fontsize=12)
ax3.set_xlim(-0.5, 13)
ax3.set_ylim(-1, 12)
ax3.axis('off')

# Water use efficiency comparison
ax4.set_facecolor('#111827')
methods = ['Traditional\\nflooding', 'AWD\\n(alt. wet/dry)', 'SRI\\n(system of rice)', 'Drip\\nirrigation', 'Upland\\n(rainfed)']
water_use = [1500, 1050, 900, 700, 600]  # mm per season
yield_vals = [5.0, 5.0, 5.5, 4.0, 2.0]  # tonnes/ha
wue = [y / (w/1000) for y, w in zip(yield_vals, water_use)]  # kg grain per m3 water

x4 = np.arange(len(methods))
width4 = 0.35
bars_w = ax4.bar(x4 - width4/2, water_use, width4, label='Water use (mm)', color='#3b82f6')
ax4_twin = ax4.twinx()
bars_y = ax4_twin.bar(x4 + width4/2, yield_vals, width4, label='Yield (t/ha)', color='#22c55e')

ax4.set_xticks(x4)
ax4.set_xticklabels(methods, color='white', fontsize=8)
ax4.set_ylabel('Water use (mm/season)', color='#3b82f6')
ax4_twin.set_ylabel('Yield (t/ha)', color='#22c55e')
ax4.set_title('Water Use vs Yield by Method', color='white', fontsize=12)
ax4.tick_params(axis='y', colors='#3b82f6')
ax4_twin.tick_params(axis='y', colors='#22c55e')
ax4.tick_params(axis='x', colors='gray')

lines1, labels1 = ax4.get_legend_handles_labels()
lines2, labels2 = ax4_twin.get_legend_handles_labels()
ax4.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=9)

plt.tight_layout()
plt.show()

total_water = sum(rainfall) + sum(irrigation)
total_loss = sum(evapotranspiration) + seepage * len(weeks)
print(f"Season water budget:")
print(f"  Total rainfall: {sum(rainfall):.0f} mm")
print(f"  Total irrigation: {sum(irrigation):.0f} mm")
print(f"  Total input: {total_water:.0f} mm")
print(f"  Total losses: {total_loss:.0f} mm")
print(f"  Efficiency: {(1 - total_loss/total_water)*100:.0f}%")
print()
print("AWD can save 30% of water with equal yield.")
print("This matters: rice uses 34% of all irrigation water globally.")`,
      challenge: 'Climate change may shift monsoon timing by 2-4 weeks. Modify the rainfall pattern to peak 3 weeks later. How does this affect the water budget? Which growth stage suffers most from the mismatch?',
      successHint: 'Water management in rice cultivation is applied hydraulic engineering. Understanding the water budget — inputs, losses, and timing — is essential for feeding billions of people with limited freshwater resources.',
    },
    {
      title: 'The Green Revolution — feeding billions, at a cost',
      concept: `The **Green Revolution** (1960s-1980s) was a dramatic increase in agricultural productivity through science and technology:

**Key innovations**:
1. **High-Yielding Varieties (HYVs)**: Norman Borlaug bred semi-dwarf wheat varieties that produced 2-3x more grain. M.S. Swaminathan brought these to India. IR8 ("Miracle Rice") was developed at IRRI in the Philippines — doubling rice yields.

2. **Chemical fertilizers**: Synthetic nitrogen (from the Haber-Bosch process), phosphorus, and potassium dramatically increased soil fertility.

3. **Irrigation**: Dams, canals, tube wells expanded irrigated area.

4. **Pesticides/herbicides**: Chemical pest control reduced crop losses.

**Results**: India went from famine (1960s) to food exporter (1980s). Global grain production doubled. Billions fed.

**Costs**:
- **Soil degradation**: Monoculture + chemicals depleted soil organic matter
- **Water depletion**: Groundwater pumping exceeded recharge (Punjab water table drops 1m/year)
- **Pollution**: Pesticide runoff, fertilizer-caused algal blooms (eutrophication)
- **Biodiversity loss**: Thousands of traditional varieties abandoned for a few HYVs
- **Inequality**: Large farmers benefited; small farmers went into debt buying inputs

The Green Revolution saved billions from starvation but created new problems that we're still solving.`,
      analogy: 'The Green Revolution was like switching from a bicycle to a car. The car (HYVs + chemicals) goes much faster (higher yields). But it needs fuel (fertilizer), a road (irrigation), and maintenance (pesticides). It also causes pollution and accidents. The bicycle (traditional farming) was slower but sustainable and free. We can\'t go back to bicycles for 8 billion people, but we need to make the car cleaner.',
      storyConnection: 'The Tiwa origin tale speaks of rice as a harmonious gift. The Green Revolution was the opposite of harmonious — it was a forced, top-down transformation. Traditional varieties like those in the Tiwa hills were replaced by HYVs that needed purchased inputs. The story\'s "peace" was disrupted. Now, as we recognize the costs of the Green Revolution, those traditional varieties and indigenous knowledge are being sought again.',
      checkQuestion: 'India produces enough food to feed 1.4 billion people, yet 190 million Indians are undernourished. If the Green Revolution solved the production problem, why does hunger persist?',
      checkAnswer: 'Hunger is a distribution and poverty problem, not a production problem. India exports rice while millions can\'t afford to buy it. The Green Revolution increased TOTAL production but concentrated benefits among large farmers with access to irrigation and credit. Small farmers, tribal communities, and the landless poor were often left worse off. The lesson: agricultural technology alone doesn\'t solve hunger. You also need land reform, fair markets, and social safety nets.',
      codeIntro: 'Visualize the impact of the Green Revolution on yields, inputs, and environmental costs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Green Revolution impact data
decades = ['1960', '1970', '1980', '1990', '2000', '2010', '2020']
years = [1960, 1970, 1980, 1990, 2000, 2010, 2020]

# Rice yield (tonnes/hectare, India average)
rice_yield = [1.5, 1.7, 2.2, 2.9, 3.2, 3.6, 4.0]

# Fertilizer use (kg/hectare)
fertilizer = [5, 15, 40, 75, 100, 140, 170]

# Groundwater depth (meters below surface, Punjab)
groundwater = [5, 6, 8, 12, 18, 25, 32]

# Traditional varieties in use (number)
trad_varieties = [5000, 3000, 1500, 800, 500, 400, 600]  # slight recovery recently

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Yield increase
ax1.set_facecolor('#111827')
ax1.plot(years, rice_yield, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax1.fill_between(years, rice_yield, alpha=0.15, color='#22c55e')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Rice yield (t/ha)', color='white')
ax1.set_title('India Rice Yield: Green Revolution Impact', color='white', fontsize=12)
ax1.axvline(1966, color='#f59e0b', linestyle='--', linewidth=1, label='Green Revolution begins')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Fertilizer escalation
ax2.set_facecolor('#111827')
ax2.plot(years, fertilizer, 'o-', color='#ef4444', linewidth=2, markersize=8)
ax2.fill_between(years, fertilizer, alpha=0.15, color='#ef4444')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Fertilizer use (kg/ha)', color='white')
ax2.set_title('Fertilizer Use: Exponential Increase', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Groundwater depletion
ax3.set_facecolor('#111827')
ax3.plot(years, groundwater, 'o-', color='#3b82f6', linewidth=2, markersize=8)
ax3.fill_between(years, groundwater, alpha=0.15, color='#3b82f6')
ax3.invert_yaxis()
ax3.set_xlabel('Year', color='white')
ax3.set_ylabel('Groundwater depth (m below surface)', color='white')
ax3.set_title('Punjab Groundwater: Falling Fast', color='white', fontsize=12)
ax3.tick_params(colors='gray')

# Variety diversity loss
ax4.set_facecolor('#111827')
ax4.plot(years, trad_varieties, 'o-', color='#a855f7', linewidth=2, markersize=8)
ax4.fill_between(years, trad_varieties, alpha=0.15, color='#a855f7')
ax4.set_xlabel('Year', color='white')
ax4.set_ylabel('Traditional varieties in cultivation', color='white')
ax4.set_title('Biodiversity Loss (and Recent Recovery)', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.annotate('Conservation\\nefforts begin', xy=(2010, 400), xytext=(2000, 1500),
             color='#22c55e', fontsize=9, arrowprops=dict(arrowstyle='->', color='#22c55e'))

plt.tight_layout()
plt.show()

yield_increase = (rice_yield[-1] - rice_yield[0]) / rice_yield[0] * 100
fert_increase = (fertilizer[-1] - fertilizer[0]) / fertilizer[0] * 100
print(f"Green Revolution scorecard (1960-2020):")
print(f"  Yield: +{yield_increase:.0f}% ({rice_yield[0]} -> {rice_yield[-1]} t/ha)")
print(f"  Fertilizer: +{fert_increase:.0f}% ({fertilizer[0]} -> {fertilizer[-1]} kg/ha)")
print(f"  Groundwater: -{groundwater[-1]-groundwater[0]}m (dropping {(groundwater[-1]-groundwater[0])/60:.1f}m/year)")
print(f"  Variety loss: {(trad_varieties[0]-min(trad_varieties))/trad_varieties[0]*100:.0f}% of traditional varieties abandoned")
print()
print("The Green Revolution was necessary but unsustainable.")
print("The next revolution must increase yield WHILE reducing inputs.")`,
      challenge: 'Calculate the "yield response curve" for fertilizer. If doubling fertilizer from 50 to 100 kg/ha increases yield by 0.5 t/ha, but doubling from 100 to 200 only increases yield by 0.2 t/ha, what does this tell you about diminishing returns? At what point does adding more fertilizer become wasteful?',
      successHint: 'The Green Revolution shows that technology is never neutral — it solves problems and creates new ones. Understanding both the benefits and costs is essential for designing the next agricultural revolution.',
    },
    {
      title: 'Future of rice — feeding 10 billion without destroying the planet',
      concept: `By 2050, we'll need to feed ~10 billion people with less water, less land, and a hotter climate. Rice must be part of the solution:

**Current research frontiers**:

1. **C4 rice**: Rice uses C3 photosynthesis (less efficient). Converting it to C4 (like corn) could increase yields by 50%. The C4 Rice Consortium is engineering this — possibly the biggest crop improvement project in history.

2. **Flood-tolerant rice**: The SUB1A gene from a traditional Indian variety allows rice to survive 2+ weeks of complete submersion. Already deployed in Bangladesh and eastern India.

3. **Golden Rice**: Genetically engineered to produce beta-carotene (vitamin A precursor). Could prevent 500,000 cases of childhood blindness per year. Controversial due to GMO opposition.

4. **Perennial rice**: A Chinese team crossed annual rice with a perennial wild relative. The result: rice that regrows after harvest for 5+ years without replanting. Reduces soil disturbance, saves labor.

5. **Drought-tolerant varieties**: Traditional upland varieties from Northeast India and Africa carry drought-tolerance genes that are being bred into high-yielding varieties.

6. **Reduced methane varieties**: Varieties that transport less oxygen to roots starve methanogens, reducing methane emissions by 30%.

The seeds of the future may already be growing in a Tiwa farmer's hillside field.`,
      analogy: 'The future of rice is like upgrading a phone\'s operating system. The hardware (the rice plant) is the same, but the software (genes, management practices) is being rewritten. C4 rice is like upgrading the processor (faster photosynthesis). Flood tolerance is like adding waterproofing. Perennial rice is like a phone with a battery that never needs replacing. Each upgrade addresses a specific limitation.',
      storyConnection: 'The Tiwa origin tale tells of the first rice — a beginning. The future of rice is about ensuring there is no end. Traditional varieties from the hills of Assam carry genes for drought tolerance, pest resistance, and nutritional quality that modern breeding desperately needs. The story\'s gift is still giving: the genetic diversity of indigenous rice is the raw material for the next agricultural revolution.',
      checkQuestion: 'Golden Rice could prevent 500,000 cases of childhood blindness per year, but many countries have banned or delayed it due to GMO concerns. Is this justified?',
      checkAnswer: 'This is genuinely difficult. Arguments FOR: (1) Vitamin A deficiency kills and blinds hundreds of thousands of children annually. (2) Golden Rice is extensively safety-tested. (3) The technology is free for small farmers. Arguments AGAINST: (1) Corporate control of seeds concerns many. (2) Vitamin A can be provided through dietary diversity (sweet potatoes, leafy greens). (3) Approving one GMO sets precedent for others that may be less benign. The scientific consensus is that Golden Rice is safe, but the debate reflects legitimate concerns about power, equity, and food sovereignty.',
      codeIntro: 'Model the potential impact of future rice technologies on global food security.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Future rice technologies: impact modeling

years = np.arange(2024, 2051)
baseline_yield = 4.0  # current global average (t/ha)
population = 8.1 * np.exp(0.008 * (years - 2024))  # billions, slowing growth
rice_demand = population * 0.06  # tonnes per person per year

# Scenario 1: Business as usual (0.5% yield increase/year)
bau_yield = baseline_yield * (1.005 ** (years - 2024))
bau_production = bau_yield * 165  # million hectares (current rice area)

# Scenario 2: Moderate innovation (AWD, improved varieties)
moderate_yield = baseline_yield * (1.015 ** (years - 2024))
moderate_production = moderate_yield * 160  # slight area reduction

# Scenario 3: Breakthrough (C4 rice, perennial rice)
breakthrough_yield = baseline_yield * np.where(
    years < 2035,
    1.015 ** (years - 2024),
    1.015 ** (2035 - 2024) * 1.03 ** (years - 2035)  # C4 kicks in 2035
)
breakthrough_production = breakthrough_yield * 155

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Yield trajectories
ax1.set_facecolor('#111827')
ax1.plot(years, bau_yield, color='#ef4444', linewidth=2, label='Business as usual')
ax1.plot(years, moderate_yield, color='#f59e0b', linewidth=2, label='Moderate innovation')
ax1.plot(years, breakthrough_yield, color='#22c55e', linewidth=2, label='Breakthrough (C4 rice)')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Average yield (t/ha)', color='white')
ax1.set_title('Rice Yield Scenarios to 2050', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Production vs demand
ax2.set_facecolor('#111827')
demand_mt = rice_demand * 1000  # million tonnes
ax2.plot(years, demand_mt, color='white', linewidth=2, linestyle='--', label='Demand')
ax2.plot(years, bau_production, color='#ef4444', linewidth=2, label='BAU production')
ax2.plot(years, moderate_production, color='#f59e0b', linewidth=2, label='Moderate')
ax2.plot(years, breakthrough_production, color='#22c55e', linewidth=2, label='Breakthrough')
ax2.fill_between(years, demand_mt, bau_production, where=demand_mt > bau_production,
                 alpha=0.15, color='#ef4444', label='Deficit')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Million tonnes', color='white')
ax2.set_title('Production vs Demand', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Technology timeline
ax3.set_facecolor('#111827')
technologies = [
    ('Flood-tolerant (SUB1A)', 2010, 2024, '#3b82f6'),
    ('AWD water saving', 2015, 2030, '#22c55e'),
    ('Reduced methane varieties', 2020, 2035, '#a855f7'),
    ('Perennial rice', 2022, 2035, '#f59e0b'),
    ('Drought-tolerant (from NE India)', 2025, 2040, '#ec4899'),
    ('Golden Rice (vitamin A)', 2020, 2030, '#ef4444'),
    ('C4 rice (50% yield boost)', 2035, 2050, '#22c55e'),
]

for i, (name, start, end, color) in enumerate(technologies):
    ax3.barh(i, end - start, left=start, height=0.6, color=color, alpha=0.7)
    ax3.text(start - 1, i, name, ha='right', va='center', color='white', fontsize=8)

ax3.axvline(2024, color='white', linestyle=':', linewidth=1, label='Now')
ax3.set_xlabel('Year', color='white')
ax3.set_title('Rice Technology Timeline', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
ax3.set_yticks([])
ax3.set_xlim(2005, 2055)

# Environmental impact reduction
ax4.set_facecolor('#111827')
metrics = ['Water use', 'Methane\\nemissions', 'Fertilizer\\nneeded', 'Pesticide\\nuse', 'Biodiversity\\nimpact']
current_impact = [100, 100, 100, 100, 100]
future_impact = [60, 40, 70, 50, 30]  # % of current

x4 = np.arange(len(metrics))
width4 = 0.35
ax4.bar(x4 - width4/2, current_impact, width4, label='Current', color='#ef4444', alpha=0.7)
ax4.bar(x4 + width4/2, future_impact, width4, label='2050 target', color='#22c55e', alpha=0.7)
ax4.set_xticks(x4)
ax4.set_xticklabels(metrics, color='white', fontsize=9)
ax4.set_ylabel('% of current impact', color='white')
ax4.set_title('Environmental Impact Reduction Targets', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

gap_bau = demand_mt[-1] - bau_production[-1]
gap_moderate = demand_mt[-1] - moderate_production[-1]
gap_breakthrough = demand_mt[-1] - breakthrough_production[-1]
print(f"2050 food gap analysis (demand: {demand_mt[-1]:.0f} Mt):")
print(f"  Business as usual: {'deficit of ' + str(abs(int(gap_bau))) + ' Mt' if gap_bau > 0 else 'surplus'}")
print(f"  Moderate innovation: {'deficit of ' + str(abs(int(gap_moderate))) + ' Mt' if gap_moderate > 0 else 'surplus of ' + str(abs(int(gap_moderate))) + ' Mt'}")
print(f"  Breakthrough: {'surplus of ' + str(abs(int(gap_breakthrough))) + ' Mt'}")
print()
print("The C4 rice project, if successful, would be the most")
print("impactful agricultural technology since the Green Revolution.")
print("Traditional varieties from NE India are already contributing")
print("flood and drought tolerance genes to modern breeding programs.")`,
      challenge: 'Add a "climate change penalty" to the model: yields decrease by 0.5% per year due to heat stress and water scarcity. How does this change the food gap? Which technology is most important for closing the gap under climate stress?',
      successHint: 'From the invention of agriculture to crop domestication to rice biology to water management to the Green Revolution to future technologies — you\'ve traced the complete arc of humanity\'s most important crop. Level 2 goes deeper into soil science, engineering, and precision agriculture.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior agriculture or biology experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for agriculture and population simulations. Click to start.</p>
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