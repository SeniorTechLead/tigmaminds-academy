import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DancingDeerLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Ecosystems — living and non-living things interacting together',
      concept: `At Loktak Lake in Manipur, the sangai deer dances on floating islands called **phumdis** — masses of vegetation, soil, and organic matter that drift across the water. This is an ecosystem: a community of living organisms interacting with their non-living environment.

Every ecosystem has two categories of components:
- **Biotic** (living): the sangai deer, fish, water birds, aquatic plants, algae, bacteria, insects
- **Abiotic** (non-living): water, sunlight, temperature, dissolved oxygen, soil nutrients, wind

These components don't exist in isolation — they form a web of interactions. The water level of Loktak Lake determines how thick the phumdis are. The thickness of the phumdis determines whether the sangai can walk on them. The plants on the phumdis depend on nutrients from the water. The fish depend on the plants. The birds depend on the fish. Change one element and everything shifts.

An ecosystem is in **dynamic equilibrium** — constantly changing but staying roughly balanced. When humans build dams, drain wetlands, or introduce invasive species, they push the system out of balance. Loktak Lake has been pushed hard: the Ithai Barrage, built in 1983, raised water levels and thinned the phumdis, threatening the sangai's only habitat on Earth.`,
      analogy: 'An ecosystem is like a city. The buildings, roads, and power grid are the abiotic parts. The people, pets, trees, and rats are the biotic parts. Everyone depends on everyone else. Cut the power grid (abiotic change) and the restaurants close (biotic effect). Remove the garbage collectors (biotic change) and disease spreads (biotic + abiotic effects).',
      storyConnection: 'The sangai deer dances on phumdis because that is its entire world — Loktak Lake\'s floating islands are the only habitat this species has ever known. The ecosystem of Loktak Lake isn\'t just a backdrop to the sangai\'s story; it IS the story. Without the lake\'s unique combination of water, phumdis, grasses, and seasonal flooding, the sangai simply wouldn\'t exist.',
      checkQuestion: 'If the water level of Loktak Lake rises permanently by 1 metre (as it did after the Ithai Barrage was built), what happens to the phumdis and the sangai?',
      checkAnswer: 'Higher water levels thin the phumdis — they become waterlogged and can no longer support the weight of the deer. The sangai loses its feeding and resting ground. This is exactly what happened: after the barrage was built, phumdi thickness decreased and the sangai population dropped to fewer than 100 individuals. An abiotic change (water level) caused a biotic crisis (species decline).',
      codeIntro: 'Model a simple ecosystem with biotic and abiotic components interacting over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate Loktak Lake ecosystem over 12 months
months = np.arange(1, 13)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Abiotic: water level (metres above baseline)
# Monsoon raises levels Jun-Sep
water_level = np.array([1.5, 1.3, 1.2, 1.4, 1.8, 2.5, 3.2, 3.5, 3.0, 2.3, 1.8, 1.6])

# Biotic: phumdi thickness inversely related to water level
phumdi_thickness = 2.5 - 0.5 * water_level + np.random.normal(0, 0.1, 12)

# Biotic: vegetation cover on phumdis (depends on thickness)
vegetation = 40 + 20 * phumdi_thickness + np.random.normal(0, 3, 12)

# Biotic: sangai activity index (needs thick phumdis)
sangai_activity = np.clip(30 * (phumdi_thickness - 0.5), 0, 100)

fig, axes = plt.subplots(4, 1, figsize=(10, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Water level
axes[0].set_facecolor('#111827')
axes[0].fill_between(months, water_level, alpha=0.3, color='#3b82f6')
axes[0].plot(months, water_level, 'o-', color='#3b82f6', linewidth=2)
axes[0].set_ylabel('Water level (m)', color='white')
axes[0].set_title('Loktak Lake Ecosystem: Abiotic Drives Biotic', color='white', fontsize=13)
axes[0].tick_params(colors='gray')

# Phumdi thickness
axes[1].set_facecolor('#111827')
axes[1].fill_between(months, phumdi_thickness, alpha=0.3, color='#f59e0b')
axes[1].plot(months, phumdi_thickness, 'o-', color='#f59e0b', linewidth=2)
axes[1].set_ylabel('Phumdi thickness (m)', color='white')
axes[1].tick_params(colors='gray')

# Vegetation
axes[2].set_facecolor('#111827')
axes[2].fill_between(months, vegetation, alpha=0.3, color='#22c55e')
axes[2].plot(months, vegetation, 'o-', color='#22c55e', linewidth=2)
axes[2].set_ylabel('Vegetation cover (%)', color='white')
axes[2].tick_params(colors='gray')

# Sangai activity
axes[3].set_facecolor('#111827')
axes[3].fill_between(months, sangai_activity, alpha=0.3, color='#a855f7')
axes[3].plot(months, sangai_activity, 'o-', color='#a855f7', linewidth=2)
axes[3].set_ylabel('Sangai activity index', color='white')
axes[3].set_xlabel('Month', color='white')
axes[3].set_xticks(months)
axes[3].set_xticklabels(month_names)
axes[3].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Notice the cascade:")
print("  Water rises (abiotic) → phumdis thin → vegetation drops → sangai activity drops")
print("  Water falls (abiotic) → phumdis thicken → vegetation recovers → sangai returns")
print()
print("This is how ecosystems work: abiotic changes ripple through biotic components.")`,
      challenge: 'Simulate what happens if water level stays permanently at 3.0m (like after a dam). How does sangai activity change across all 12 months?',
      successHint: 'Understanding ecosystems means understanding connections. Every conservation decision — building a dam, creating a reserve, removing invasive species — sends ripples through the entire system.',
    },
    {
      title: 'Food chains and webs — who eats whom, energy flow',
      concept: `In Loktak Lake, the sangai deer grazes on grasses and sedges growing on the phumdis. The grasses get their energy from sunlight (photosynthesis). Insects eat the grasses too. Fish eat aquatic plants and insects. Birds eat fish. Pythons eat the deer's young.

This is a **food chain**: a linear path showing who eats whom.

**Sunlight → Grasses → Sangai deer**
**Sunlight → Algae → Small fish → Large fish → Kingfisher**

But real ecosystems aren't simple chains — they're **food webs**, with multiple interconnected chains. The sangai eats many plant species. Birds eat both fish and insects. Decomposers (bacteria, fungi) break down dead organisms at every level.

Energy flows through these webs following strict rules:
- **Producers** (plants, algae) capture solar energy — about 1% of available sunlight
- **Primary consumers** (herbivores like the sangai) get about 10% of the energy stored in plants
- **Secondary consumers** (predators) get about 10% of the herbivore's energy
- This **10% rule** means energy decreases at each level — that's why there are more plants than deer, and more deer than predators

This is why the sangai population can never be huge: there's only so much grass energy to go around on the phumdis of Loktak Lake.`,
      analogy: 'A food chain is like a salary chain. The sun is the original employer paying $1,000,000. Plants keep $10,000 (1%). A herbivore takes $1,000 from the plant (10%). A predator gets $100 from the herbivore (10%). By the top of the chain, there\'s almost nothing left. That\'s why top predators are always rare.',
      storyConnection: 'The sangai dances on the phumdis while grazing — it\'s literally dancing on its food source. Those floating islands of vegetation are the base of the food chain that sustains the deer. If the phumdis thin or degrade, the food chain collapses from the bottom up, and the sangai\'s dance ends.',
      checkQuestion: 'If a disease kills 50% of the grasses on Loktak Lake\'s phumdis, what happens to the sangai population? What about the predators that occasionally take young sangai?',
      checkAnswer: 'The sangai population would decline — less food means fewer deer can survive (carrying capacity drops). The predators would also decline, but with a time delay: they\'d keep eating deer until deer became too scarce to hunt efficiently. Energy loss at each trophic level means a 50% loss at the base doesn\'t mean a 50% loss at the top — it could mean much more, because the deer were already getting only 10% of plant energy.',
      codeIntro: 'Visualize energy flow through Loktak Lake\'s food web with the 10% rule.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Energy flow through trophic levels (kJ/m²/year)
levels = ['Sunlight', 'Producers\\n(grasses, algae)', 'Primary consumers\\n(sangai, insects, fish)',
          'Secondary consumers\\n(birds, snakes)', 'Decomposers\\n(bacteria, fungi)']
energy = [1000000, 10000, 1000, 100, 0]  # decomposers recycle, don't store

# Energy transferred vs lost at each level
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Trophic pyramid
ax1.set_facecolor('#111827')
colors = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#a855f7']
widths = [10, 8, 4, 1.5, 6]  # proportional representation
y_positions = [0, 1, 2, 3, -1]

for i in range(4):  # skip decomposers for pyramid
    ax1.barh(i, widths[i], height=0.7, color=colors[i], alpha=0.8, align='center')
    if energy[i] > 0:
        ax1.text(widths[i] + 0.3, i, f'{energy[i]:,} kJ/m²/yr', color='white',
                va='center', fontsize=9)
    ax1.text(-0.5, i, levels[i], color='white', va='center', ha='right', fontsize=9)

ax1.set_xlim(-6, 14)
ax1.set_ylim(-0.5, 3.8)
ax1.set_title('Ecological Pyramid of Energy', color='white', fontsize=13)
ax1.set_xlabel('Relative energy', color='white')
ax1.tick_params(colors='gray')
ax1.set_yticks([])

# Energy transfer efficiency
ax2.set_facecolor('#111827')
trophic = ['Sun→Plants', 'Plants→Herbivores', 'Herbivores→Predators']
efficiency = [1, 10, 10]
lost = [99, 90, 90]

x = np.arange(len(trophic))
bars1 = ax2.bar(x - 0.15, efficiency, 0.3, label='Energy transferred (%)', color='#22c55e', alpha=0.8)
bars2 = ax2.bar(x + 0.15, lost, 0.3, label='Energy lost as heat (%)', color='#ef4444', alpha=0.8)

ax2.set_xticks(x)
ax2.set_xticklabels(trophic, color='white', fontsize=9)
ax2.set_ylabel('Percentage', color='white')
ax2.set_title('Energy Transfer Efficiency (10% Rule)', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

for bar in bars1:
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{bar.get_height():.0f}%', ha='center', color='#22c55e', fontsize=10)
for bar in bars2:
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{bar.get_height():.0f}%', ha='center', color='#ef4444', fontsize=10)

plt.tight_layout()
plt.show()

print("The 10% rule explains why:")
print("  - Loktak Lake has LOTS of grass and algae")
print("  - Fewer sangai deer and fish (herbivores)")
print("  - Very few pythons and eagles (predators)")
print("  - The sangai population is limited by available plant energy")
print()
print(f"If phumdis produce {energy[1]:,} kJ/m²/yr,")
print(f"  sangai get ~{energy[2]:,} kJ/m²/yr")
print(f"  predators get ~{energy[3]:,} kJ/m²/yr")`,
      challenge: 'What if producers only transfer 5% instead of 10% to herbivores (stressed ecosystem)? Recalculate energy at each level. How many fewer sangai could the lake support?',
      successHint: 'The 10% rule is why ecosystems shaped like pyramids are the norm — wide at the base, narrow at the top. Protecting the base (producers) is the most efficient way to protect everything above.',
    },
    {
      title: 'Wetlands — why they matter (water filtration, flood control, biodiversity)',
      concept: `Loktak Lake is the largest freshwater lake in northeast India and one of the most important wetlands in Asia. Wetlands — areas where water covers the soil or is present at or near the surface — are among the most productive and valuable ecosystems on Earth.

Wetlands provide **ecosystem services** that benefit humans directly:

**Water filtration**: Wetland plants and soils act as natural filters. As water flows through, sediments settle, plants absorb excess nutrients (nitrogen, phosphorus), and microbes break down pollutants. A single hectare of wetland can filter millions of litres of water per year — for free.

**Flood control**: Wetlands act as sponges. During monsoon, Loktak Lake absorbs enormous volumes of rainwater, releasing it slowly over months. Without the lake, downstream areas would flood far more severely. One hectare of wetland can store 5,000-7,500 cubic metres of floodwater.

**Biodiversity**: Wetlands cover only about 6% of Earth's land surface but support roughly 40% of all species. Loktak Lake alone hosts over 200 plant species, 100+ bird species, 400+ animal species, and the sangai — found nowhere else on Earth.

**Carbon storage**: Wetland soils store twice as much carbon as forests per unit area. Draining a wetland releases this carbon as CO₂, accelerating climate change.

Despite all this, the world has lost over 85% of its wetlands since 1700. Loktak Lake is shrinking — from human encroachment, pollution, and the Ithai Barrage.`,
      analogy: 'A wetland is like a city\'s infrastructure combined. It\'s the water treatment plant (filtration), the flood reservoir (flood control), the nature reserve (biodiversity), and the carbon vault (carbon storage) — all in one. Destroying a wetland is like demolishing all four facilities and expecting the city to function.',
      storyConnection: 'The sangai\'s dance is possible only because Loktak Lake exists as a functioning wetland. The phumdis that form the sangai\'s stage are themselves a product of the wetland ecosystem — decomposing vegetation compressed over centuries into floating islands. Destroy the wetland, and you destroy the stage, the dancer, and the dance.',
      checkQuestion: 'If you had to put a dollar value on the ecosystem services Loktak Lake provides (filtration, flood control, biodiversity, carbon storage), how would you estimate it? Why is this hard?',
      checkAnswer: 'You could estimate the cost of replacing each service artificially: building a water treatment plant, constructing flood barriers, creating a zoo/seed bank, running carbon capture machines. Studies suggest wetlands provide $25,000-$50,000 per hectare per year in services. But some services — like housing the only sangai population on Earth — are literally priceless. You can\'t build a replacement sangai.',
      codeIntro: 'Compare the ecosystem services of wetlands vs. other land types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Ecosystem service values ($/hectare/year) — based on Costanza et al. estimates
ecosystems = ['Wetlands', 'Forests', 'Grasslands', 'Croplands', 'Urban']
services = {
    'Water filtration': [4500, 800, 200, 50, 0],
    'Flood control':    [5000, 1200, 300, 100, 0],
    'Biodiversity':     [3500, 2500, 1000, 200, 50],
    'Carbon storage':   [3000, 2000, 500, 300, 0],
    'Food production':  [1000, 500, 1500, 4000, 0],
    'Recreation':       [1500, 1000, 500, 100, 500],
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Stacked bar chart
ax1.set_facecolor('#111827')
colors_svc = ['#3b82f6', '#06b6d4', '#22c55e', '#84cc16', '#f59e0b', '#a855f7']
bottom = np.zeros(len(ecosystems))

for i, (service, values) in enumerate(services.items()):
    ax1.bar(ecosystems, values, bottom=bottom, label=service,
            color=colors_svc[i], alpha=0.85)
    bottom += np.array(values)

ax1.set_ylabel('Value ($/hectare/year)', color='white')
ax1.set_title('Ecosystem Service Values by Land Type', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Totals on top
totals = [sum(v[i] for v in services.values()) for i in range(len(ecosystems))]
for i, total in enumerate(totals):
    ax1.text(i, total + 200, f'{total:,}', ha='center', color='white', fontsize=9, fontweight='bold')

# Wetland loss over time
ax2.set_facecolor('#111827')
years = [1700, 1800, 1900, 1950, 1980, 2000, 2020]
wetland_pct = [100, 87, 64, 50, 35, 20, 15]  # approximate % remaining

ax2.fill_between(years, wetland_pct, alpha=0.3, color='#3b82f6')
ax2.plot(years, wetland_pct, 'o-', color='#3b82f6', linewidth=2, markersize=6)
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Wetlands remaining (% of 1700)', color='white')
ax2.set_title('Global Wetland Loss Since 1700', color='white', fontsize=13)
ax2.tick_params(colors='gray')

# Annotate key points
ax2.annotate('Industrial Revolution', xy=(1800, 87), xytext=(1820, 95),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.annotate('85% lost', xy=(2020, 15), xytext=(1960, 25),
            color='#ef4444', fontsize=11, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

plt.tight_layout()
plt.show()

print("Wetlands are the most valuable ecosystems per hectare:")
print(f"  Wetlands: {totals[0]:,}/ha/yr")
print(f"  Forests:  {totals[1]:,}/ha/yr")
print(f"  Grasslands: {totals[2]:,}/ha/yr")
print()
print("Yet we've destroyed 85% of them.")
print("Loktak Lake is one of the survivors — but it's shrinking.")`,
      challenge: 'Calculate the total value of Loktak Lake\'s ecosystem services. The lake covers about 28,700 hectares. Multiply by the wetland value per hectare. What\'s the annual value?',
      successHint: 'Putting dollar values on ecosystems is controversial but powerful. It forces decision-makers to see that "undeveloped" land isn\'t worthless — it\'s performing billions of dollars of work for free.',
    },
    {
      title: 'Biodiversity — measuring species richness and evenness',
      concept: `Loktak Lake is one of the most biodiverse places in northeast India. But what does "biodiverse" actually mean, and how do we measure it?

**Biodiversity** has two key components:

**Species richness**: simply the number of different species present. If Loktak Lake has 233 plant species and a degraded pond has 12, the lake is richer.

**Species evenness**: how evenly individuals are distributed among species. Imagine two lakes, each with 100 birds and 5 species:
- Lake A: 20, 20, 20, 20, 20 (perfectly even)
- Lake B: 96, 1, 1, 1, 1 (one species dominates)

Both have the same richness (5 species), but Lake A is more biodiverse because the species are evenly distributed. Lake B is practically a monoculture.

Scientists combine richness and evenness into **diversity indices**:
- **Shannon index (H')**: accounts for both richness and evenness. Higher = more diverse.
- **Simpson index (D)**: measures the probability that two random individuals are different species. Higher = more diverse.

At Loktak Lake, biodiversity is declining. Invasive species like water hyacinth are spreading, choking out native plants. Pollution reduces sensitive species. The phumdis — which host unique plant communities — are degrading. Each lost species weakens the web that supports the sangai.`,
      analogy: 'Biodiversity is like a library. Species richness is the number of different book titles. Evenness is whether each title has the same number of copies. A library with 1000 titles (10 copies each) is richer than one with 1000 titles where 9990 copies are a single bestseller and every other title has one copy. The "diverse" library serves more readers.',
      storyConnection: 'The sangai doesn\'t survive alone — it depends on dozens of grass and sedge species on the phumdis for food, on the fish and bird populations that cycle nutrients through the lake, on the decomposers that build the phumdis themselves. The deer\'s dance is a solo performance supported by a cast of thousands of species.',
      checkQuestion: 'Water hyacinth is an invasive species spreading across Loktak Lake. It grows fast and covers the surface. What happens to biodiversity (both richness AND evenness)?',
      checkAnswer: 'Richness drops because water hyacinth shades out native plants and depletes oxygen, killing fish and aquatic species. Evenness drops because one species (water hyacinth) comes to dominate the community. Both components of biodiversity decline simultaneously. The Shannon index would plummet.',
      codeIntro: 'Calculate and compare biodiversity indices for healthy vs. degraded lake sections.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Species abundance data for two sections of Loktak Lake
# Healthy section: many species, relatively even
healthy = {
    'Zizania latifolia': 45, 'Phragmites karka': 40, 'Saccharum spp.': 38,
    'Leersia hexandra': 35, 'Oryza rufipogon': 30, 'Nymphaea spp.': 28,
    'Euryale ferox': 25, 'Trapa natans': 22, 'Utricularia spp.': 18,
    'Hydrilla verticillata': 15, 'Other native spp.': 50
}

# Degraded section: dominated by invasive species
degraded = {
    'Water hyacinth': 250, 'Phragmites karka': 15, 'Zizania latifolia': 8,
    'Leersia hexandra': 5, 'Nymphaea spp.': 3, 'Other native spp.': 10
}

def shannon_index(abundances):
    total = sum(abundances)
    proportions = [n / total for n in abundances]
    return -sum(p * np.log(p) for p in proportions if p > 0)

def simpson_index(abundances):
    total = sum(abundances)
    return 1 - sum(n * (n - 1) for n in abundances) / (total * (total - 1))

h_shannon = shannon_index(list(healthy.values()))
d_shannon = shannon_index(list(degraded.values()))
h_simpson = simpson_index(list(healthy.values()))
d_simpson = simpson_index(list(degraded.values()))

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Healthy section pie chart
axes[0].set_facecolor('#111827')
colors_h = plt.cm.Greens(np.linspace(0.3, 0.9, len(healthy)))
axes[0].pie(healthy.values(), labels=None, colors=colors_h, startangle=90)
axes[0].set_title(f'Healthy section\\nRichness: {len(healthy)} species', color='white', fontsize=11)

# Degraded section pie chart
axes[1].set_facecolor('#111827')
colors_d = plt.cm.Reds(np.linspace(0.3, 0.9, len(degraded)))
axes[1].pie(degraded.values(), labels=None, colors=colors_d, startangle=90)
axes[1].set_title(f'Degraded section\\nRichness: {len(degraded)} species', color='white', fontsize=11)

# Comparison bar chart
axes[2].set_facecolor('#111827')
metrics = ['Shannon (H\')', 'Simpson (1-D)']
healthy_vals = [h_shannon, h_simpson]
degraded_vals = [d_shannon, d_simpson]

x = np.arange(len(metrics))
axes[2].bar(x - 0.15, healthy_vals, 0.3, label='Healthy', color='#22c55e', alpha=0.8)
axes[2].bar(x + 0.15, degraded_vals, 0.3, label='Degraded', color='#ef4444', alpha=0.8)
axes[2].set_xticks(x)
axes[2].set_xticklabels(metrics, color='white')
axes[2].set_ylabel('Index value', color='white')
axes[2].set_title('Diversity Indices Comparison', color='white', fontsize=11)
axes[2].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[2].tick_params(colors='gray')

for i, (hv, dv) in enumerate(zip(healthy_vals, degraded_vals)):
    axes[2].text(i - 0.15, hv + 0.03, f'{hv:.2f}', ha='center', color='#22c55e', fontsize=10)
    axes[2].text(i + 0.15, dv + 0.03, f'{dv:.2f}', ha='center', color='#ef4444', fontsize=10)

plt.tight_layout()
plt.show()

print("Healthy section:")
print(f"  Species richness: {len(healthy)}")
print(f"  Shannon index: {h_shannon:.3f}")
print(f"  Simpson index: {h_simpson:.3f}")
print()
print("Degraded section:")
print(f"  Species richness: {len(degraded)}")
print(f"  Shannon index: {d_shannon:.3f}")
print(f"  Simpson index: {d_simpson:.3f}")
print()
print("Both indices are MUCH lower in the degraded section.")
print("Water hyacinth dominance crushes both richness and evenness.")`,
      challenge: 'What if you removed the water hyacinth from the degraded section? Recalculate the Shannon index with just the native species. Does removing one invasive species restore diversity?',
      successHint: 'Biodiversity indices are tools, not goals. A Shannon index of 2.5 means nothing in isolation — but comparing it across time or sites tells you whether an ecosystem is healthy or declining. Conservation scientists track these numbers like doctors track vital signs.',
    },
    {
      title: 'Endangered species — the sangai deer (fewer than 300 left)',
      concept: `The sangai (*Rucervus eldii eldii*) is one of the rarest deer on Earth. Fewer than 300 individuals remain, all confined to the floating phumdis of Loktak Lake in Manipur. It's classified as **Endangered** on the IUCN Red List.

The IUCN (International Union for Conservation of Nature) classifies species into threat categories:
- **Least Concern (LC)**: widespread and abundant (house sparrow, rats)
- **Near Threatened (NT)**: likely to qualify as threatened soon
- **Vulnerable (VU)**: high risk of extinction (polar bears, hippos)
- **Endangered (EN)**: very high risk of extinction (sangai, tigers, orangutans)
- **Critically Endangered (CR)**: extremely high risk (Sumatran rhino, vaquita)
- **Extinct in the Wild (EW)**: only survives in captivity
- **Extinct (EX)**: gone forever (dodo, passenger pigeon)

Why is the sangai endangered?
1. **Habitat loss**: phumdi degradation from the Ithai Barrage (raised water levels)
2. **Tiny range**: the entire species lives in one location (~40 km²)
3. **Small population**: fewer than 300 individuals (low genetic diversity)
4. **Poaching**: despite legal protection, illegal hunting continues
5. **Human encroachment**: fishing camps and agriculture on phumdis
6. **Inbreeding**: with so few individuals, harmful genetic mutations accumulate

The sangai was once thought extinct. In 1953, six individuals were discovered in the phumdis of Loktak Lake. The species has slowly recovered but remains critically vulnerable to any single disaster — a disease outbreak, a severe flood, a fire on the phumdis.`,
      analogy: 'Imagine all the copies of a rare book are stored in a single library. If that library floods, burns, or closes, the book is gone forever. That\'s the sangai\'s situation — one population, one location, no backup copies. Creating a second population (a "backup library") is the most urgent conservation priority.',
      storyConnection: 'The sangai\'s dance on Loktak Lake\'s phumdis isn\'t just beautiful — it\'s precarious. With fewer than 300 individuals balancing on shrinking floating islands, every dance could be the last. The story of the Dancing Deer is really a story about survival against impossible odds — a species clinging to existence on the thinnest of margins.',
      checkQuestion: 'The sangai was thought extinct until 6 individuals were found in 1953. The population is now around 260. Why is recovery so slow for a deer species (deer usually reproduce quickly)?',
      checkAnswer: 'Several compounding factors: (1) Habitat is limited — the phumdis can only support so many deer; (2) Inbreeding from the tiny founding population reduces fitness; (3) Ongoing threats (poaching, habitat degradation) counteract reproduction; (4) Small populations are vulnerable to random events (disease, bad monsoon seasons); (5) Each female produces only 1-2 fawns per year. Recovery from near-extinction is a decades-long process.',
      codeIntro: 'Visualize the sangai population history and compare it to the IUCN threat thresholds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sangai population estimates over time (approximate)
years = [1950, 1953, 1960, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2003,
         2006, 2009, 2013, 2016, 2019, 2022, 2024]
population = [0, 6, 14, 30, 50, 60, 80, 100, 120, 150, 180,
              204, 215, 230, 240, 252, 260, 268]

# IUCN thresholds for deer-like species
iucn_thresholds = {
    'Critically Endangered': 50,
    'Endangered': 250,
    'Vulnerable': 1000,
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Population trajectory
ax1.set_facecolor('#111827')
ax1.plot(years, population, 'o-', color='#a855f7', linewidth=2, markersize=5)
ax1.fill_between(years, population, alpha=0.15, color='#a855f7')

# IUCN threshold lines
ax1.axhline(50, color='#ef4444', linestyle='--', alpha=0.7, linewidth=1)
ax1.text(1952, 55, 'CR threshold (50)', color='#ef4444', fontsize=8)
ax1.axhline(250, color='#f59e0b', linestyle='--', alpha=0.7, linewidth=1)
ax1.text(1952, 260, 'EN threshold (250)', color='#f59e0b', fontsize=8)
ax1.axhline(1000, color='#22c55e', linestyle='--', alpha=0.7, linewidth=1)
ax1.text(1952, 1020, 'VU threshold (1000)', color='#22c55e', fontsize=8)

# Annotate key events
ax1.annotate('Rediscovered!\\n6 individuals', xy=(1953, 6), xytext=(1960, -50),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax1.annotate('Keibul Lamjao\\nNational Park\\ncreated (1977)', xy=(1977, 55), xytext=(1964, 150),
            color='#3b82f6', fontsize=8, arrowprops=dict(arrowstyle='->', color='#3b82f6'))
ax1.annotate(f'Current: ~{population[-1]}', xy=(years[-1], population[-1]),
            xytext=(2010, 350), color='#a855f7', fontsize=10, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#a855f7'))

ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Estimated population', color='white')
ax1.set_title('Sangai Deer Population Recovery', color='white', fontsize=13)
ax1.set_ylim(-30, 1100)
ax1.tick_params(colors='gray')

# Threats breakdown
ax2.set_facecolor('#111827')
threats = ['Habitat\\ndegradation', 'Tiny\\nrange', 'Small\\npopulation',
           'Poaching', 'Human\\nencroachment', 'Inbreeding']
severity = [9, 9, 8, 6, 7, 7]
colors_t = ['#ef4444' if s >= 8 else '#f59e0b' if s >= 6 else '#22c55e' for s in severity]

bars = ax2.barh(threats, severity, color=colors_t, alpha=0.8)
ax2.set_xlabel('Threat severity (1-10)', color='white')
ax2.set_title('Threats to Sangai Survival', color='white', fontsize=13)
ax2.set_xlim(0, 10)
ax2.tick_params(colors='gray')

for bar, sev in zip(bars, severity):
    ax2.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height()/2,
             f'{sev}/10', color='white', va='center', fontsize=10)

plt.tight_layout()
plt.show()

print("The sangai's story is one of fragile recovery:")
print(f"  1953: 6 individuals (thought extinct)")
print(f"  2024: ~{population[-1]} individuals")
print(f"  Still classified as Endangered (< 250 mature adults)")
print()
print("The population has grown ~45x in 70 years, but remains")
print("dangerously small and confined to a single location.")
print("A single catastrophe could undo decades of recovery.")`,
      challenge: 'Calculate the average annual growth rate of the sangai population from 1953 to 2024. Use the formula: rate = (final/initial)^(1/years) - 1. Is this fast or slow for a deer species?',
      successHint: 'The sangai\'s recovery from 6 to 268 is a conservation success — but the job is far from done. Until there are multiple populations in multiple locations with at least 1000 individuals total, the species remains one disaster away from extinction.',
    },
    {
      title: 'Conservation strategies — protected areas, habitat restoration, community involvement',
      concept: `Saving the sangai requires more than good intentions — it requires a strategy. Conservation biology offers three main approaches, and the sangai needs all three:

**1. Protected areas**
Keibul Lamjao National Park was created in 1977 — the world's only floating national park. It covers 40 km² of phumdis on Loktak Lake. Protection means no hunting, no fishing camps, no agriculture within the park. But 40 km² is tiny. A single fire, disease, or flood could affect the entire park.

**2. Habitat restoration**
The Ithai Barrage raised water levels, thinning the phumdis. Restoration means: managing water levels to allow phumdi regeneration, removing invasive species (water hyacinth), reducing pollution from surrounding communities. The Loktak Development Authority works on this, but progress is slow against ongoing degradation.

**3. Community involvement**
200,000+ people live around Loktak Lake and depend on it for fishing, farming, and transport. Conservation that ignores local needs will fail. Successful programs involve communities as partners: eco-tourism that employs locals, sustainable fishing practices, education about the sangai's uniqueness.

The most critical need is a **captive breeding program** to create a backup population. If all sangai live in one place, a single catastrophe ends the species. Zoos and wildlife centres could maintain a second population — genetic insurance against extinction.

Conservation isn't about freezing nature in place. It's about maintaining the processes — flooding cycles, plant succession, nutrient cycling — that allow ecosystems to function and species to survive.`,
      analogy: 'Conservation is like maintaining a historical building. Protected areas are the fence around it (keep threats out). Habitat restoration is the repair crew (fix the damage). Community involvement is the neighbourhood watch (locals care for it daily). A captive breeding program is the architectural blueprint stored offsite — if the building burns, you can rebuild.',
      storyConnection: 'The sangai\'s dance can only continue if we preserve the stage (Loktak Lake), repair the damage (phumdi restoration), and involve the audience (local communities). The story of the Dancing Deer of Loktak Lake isn\'t finished — its ending depends on whether we choose conservation or neglect.',
      checkQuestion: 'Why might a conservation program that bans all fishing in Loktak Lake fail, even if it\'s good for the ecosystem?',
      checkAnswer: 'Because 200,000+ people depend on fishing for their livelihood. A total ban would impoverish communities, creating resentment and resistance. People would fish illegally. Conservation works best when it provides alternatives: eco-tourism jobs, sustainable fishing zones, compensation for losses. Conservation that makes people poorer is conservation that gets overthrown.',
      codeIntro: 'Simulate the impact of different conservation strategies on sangai population over 50 years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

years = 50
t = np.arange(years)

def simulate_population(initial, growth_rate, capacity, threat_reduction, catastrophe_prob):
    pop = np.zeros(years)
    pop[0] = initial
    for i in range(1, years):
        # Logistic growth with threats
        r = growth_rate * (1 - pop[i-1] / capacity)
        # Random variation
        r += np.random.normal(0, 0.02)
        # Threat reduction factor
        r *= (1 + threat_reduction)
        # Catastrophe (10% population loss)
        if np.random.random() < catastrophe_prob:
            pop[i] = pop[i-1] * 0.9  # lose 10%
        else:
            pop[i] = pop[i-1] * (1 + r)
        pop[i] = max(pop[i], 0)
    return pop

# Scenario 1: No action (current trajectory)
no_action = simulate_population(260, 0.03, 300, -0.01, 0.05)

# Scenario 2: Protected area only
protected = simulate_population(260, 0.03, 400, 0.02, 0.03)

# Scenario 3: Protection + habitat restoration
restored = simulate_population(260, 0.04, 600, 0.03, 0.02)

# Scenario 4: Full strategy (protection + restoration + community + captive breeding)
full_strategy = simulate_population(260, 0.05, 1000, 0.04, 0.01)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Population trajectories
ax1.set_facecolor('#111827')
ax1.plot(t, no_action, color='#ef4444', linewidth=2, label='No action')
ax1.plot(t, protected, color='#f59e0b', linewidth=2, label='Protected area only')
ax1.plot(t, restored, color='#3b82f6', linewidth=2, label='Protection + restoration')
ax1.plot(t, full_strategy, color='#22c55e', linewidth=2, label='Full strategy')

# Threshold lines
ax1.axhline(250, color='gray', linestyle=':', alpha=0.5)
ax1.text(1, 260, 'EN threshold', color='gray', fontsize=8)
ax1.axhline(1000, color='gray', linestyle=':', alpha=0.5)
ax1.text(1, 1020, 'VU threshold', color='gray', fontsize=8)
ax1.axhline(50, color='#ef4444', linestyle=':', alpha=0.5)
ax1.text(1, 60, 'CR threshold', color='#ef4444', fontsize=8)

ax1.set_xlabel('Years from now', color='white')
ax1.set_ylabel('Population', color='white')
ax1.set_title('Sangai Population Under Different Strategies', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Cost-benefit comparison
ax2.set_facecolor('#111827')
strategies = ['No\\naction', 'Protected\\narea', 'Protection +\\nrestoration', 'Full\\nstrategy']
costs = [0, 2, 5, 10]  # million $ over 50 years
final_pops = [no_action[-1], protected[-1], restored[-1], full_strategy[-1]]
colors_s = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

ax2_twin = ax2.twinx()
bars = ax2.bar(strategies, costs, alpha=0.3, color=colors_s, label='Cost ($M)')
ax2_twin.plot(strategies, final_pops, 'o-', color='white', linewidth=2,
              markersize=8, label='Final population')

ax2.set_ylabel('Cost ($ millions over 50 years)', color='white')
ax2_twin.set_ylabel('Final population', color='white')
ax2.set_title('Conservation: Cost vs. Outcome', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='gray')

for i, (cost, pop) in enumerate(zip(costs, final_pops)):
    ax2_twin.annotate(f'{pop:.0f}', xy=(i, pop), xytext=(0, 10),
                     textcoords='offset points', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("50-year projections:")
print(f"  No action:           {no_action[-1]:.0f} sangai (likely decline to extinction)")
print(f"  Protected area only: {protected[-1]:.0f} sangai (stable but fragile)")
print(f"  + Habitat restoration: {restored[-1]:.0f} sangai (growing)")
print(f"  Full strategy:       {full_strategy[-1]:.0f} sangai (recovery toward safety)")
print()
print("Key insight: each additional strategy multiplies the impact.")
print("Protection alone isn't enough — you need restoration AND community buy-in.")
print("The full strategy costs more but is the only path to long-term survival.")`,
      challenge: 'Add a 5th scenario: "Full strategy + second population" where a captive breeding program establishes 50 deer at a new site. Simulate both populations independently. What\'s the combined total?',
      successHint: 'Conservation is a science, not just a sentiment. Modelling population trajectories under different strategies helps decision-makers allocate limited funding where it matters most. The sangai\'s future depends on choosing the right strategy — and funding it.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior ecology experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecology simulations. Click to start.</p>
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
