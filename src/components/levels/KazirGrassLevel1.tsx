import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KazirGrassLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Grassland biomes — where the tall grass grows',
      concept: `In the story, the Kaziranga grass grows so tall that it hides even elephants. This is not exaggeration — *Saccharum spontaneum* (kans grass) and *Saccharum ravennae* can reach 6 metres in Kaziranga. But why are grasslands, not forests, the dominant vegetation here?

Grasslands exist where:
- Rainfall is moderate (600-1500 mm/year) — enough for grass, not enough for dense forest year-round
- There is a distinct dry season — grasses go dormant; trees cannot
- Fire is frequent — grasses survive; most tree seedlings do not
- Grazing pressure is high — large herbivores eat tree seedlings but grass grows back from below

Kaziranga is a **tropical floodplain grassland**: the Brahmaputra floods annually, depositing nutrient-rich silt. The flood-fire-graze cycle maintains the grassland.

Global grassland types:
- **Tropical savanna**: Africa (Serengeti), South America (Cerrado)
- **Temperate steppe**: Central Asia, American Great Plains
- **Floodplain grassland**: Kaziranga, Pantanal (Brazil), Okavango (Botswana)

Grasslands cover ~40% of Earth's land surface (excluding Antarctica). They store enormous amounts of carbon in their root systems — often more than forests store above ground.`,
      analogy: 'A grassland is like a phoenix — it thrives on destruction. Flood, fire, and grazing all destroy the above-ground parts, but the grass comes back every time because its life is underground. A forest is like a castle — impressive above ground, but vulnerable to siege. Burn a forest and it takes decades to recover. Burn a grassland and it recovers in weeks.',
      storyConnection: 'The story asks: how does the Kaziranga grass grow so tall? The answer is the flood-fire-graze cycle. Annual monsoon floods deposit rich silt. Dry-season fires clear dead material and return nutrients to the soil. Grazers eat the old grass, making room for new growth. The tall grass is not despite destruction — it is because of it.',
      checkQuestion: 'Kaziranga has both grasslands and forests. What determines where each grows within the park?',
      checkAnswer: 'Elevation and flooding. Low-lying areas that flood annually support grassland (trees cannot survive prolonged submersion; grasses can). Higher ground that stays above flood level supports semi-evergreen forest. The transition zone has scattered trees in grassland (savanna). Kaziranga is a mosaic because its topography creates a mosaic of flooding regimes.',
      codeIntro: 'Compare the characteristics of major grassland biomes, including Kaziranga.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Grassland biome comparison
biomes = ['Kaziranga\
(floodplain)', 'Serengeti\
(savanna)', 'Great Plains\
(temperate)', 'Cerrado\
(tropical)', 'Steppe\
(central Asia)']

rainfall = [2000, 800, 500, 1500, 350]       # mm/year
grass_height = [6.0, 1.5, 1.0, 2.0, 0.5]    # max metres
fire_freq = [1.0, 0.3, 0.1, 0.5, 0.05]      # fires per year
grazer_biomass = [90, 85, 30, 40, 50]         # relative (0-100)
soil_carbon = [80, 50, 90, 60, 70]            # relative (0-100)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')

colors = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#ef4444']

# Rainfall
ax = axes[0, 0]
ax.set_facecolor('#111827')
bars = ax.bar(biomes, rainfall, color=colors, alpha=0.8)
ax.set_ylabel('Rainfall (mm/year)', color='white')
ax.set_title('Annual Rainfall', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)

# Grass height
ax = axes[0, 1]
ax.set_facecolor('#111827')
bars = ax.bar(biomes, grass_height, color=colors, alpha=0.8)
ax.set_ylabel('Max grass height (m)', color='white')
ax.set_title('Grass Height', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)
ax.axhline(1.5, color='gray', linestyle=':', linewidth=0.5)
ax.text(4, 1.6, 'Human height', color='gray', fontsize=8)

# Fire frequency
ax = axes[0, 2]
ax.set_facecolor('#111827')
bars = ax.bar(biomes, fire_freq, color=colors, alpha=0.8)
ax.set_ylabel('Fires per year', color='white')
ax.set_title('Fire Frequency', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)

# Grazer biomass
ax = axes[1, 0]
ax.set_facecolor('#111827')
bars = ax.bar(biomes, grazer_biomass, color=colors, alpha=0.8)
ax.set_ylabel('Grazer biomass (relative)', color='white')
ax.set_title('Large Herbivore Density', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)

# Soil carbon
ax = axes[1, 1]
ax.set_facecolor('#111827')
bars = ax.bar(biomes, soil_carbon, color=colors, alpha=0.8)
ax.set_ylabel('Soil carbon (relative)', color='white')
ax.set_title('Underground Carbon Storage', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)

# Radar chart for Kaziranga
ax = axes[1, 2]
ax = fig.add_subplot(2, 3, 6, polar=True)
ax.set_facecolor('#111827')
categories = ['Rainfall', 'Grass\
height', 'Fire', 'Grazers', 'Soil\
carbon']
values = [rainfall[0]/20, grass_height[0]/6*10, fire_freq[0]*10, grazer_biomass[0]/10, soil_carbon[0]/10]
values += values[:1]
angles = np.linspace(0, 2*np.pi, 5, endpoint=False).tolist()
angles += angles[:1]
ax.plot(angles, values, 'o-', color='#22c55e', linewidth=2)
ax.fill(angles, values, alpha=0.2, color='#22c55e')
ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, color='white', fontsize=8)
ax.set_title('Kaziranga Profile', color='#22c55e', fontsize=11, pad=15)

plt.tight_layout()
plt.show()

print("Kaziranga stands out because of:")
print("  Highest rainfall -> tallest grass (up to 6 metres)")
print("  Annual flooding -> nutrient-rich silt deposits")
print("  Highest fire frequency -> grassland maintained")
print("  Highest grazer density -> rhinos, elephants, buffalo")
print()
print("The tall grass is not a coincidence — it is the product")
print("of extreme rainfall, extreme fertility, and extreme disturbance.")`,
      challenge: 'The American Great Plains was once a vast grassland with 60 million bison. Now it is mostly farmland with almost no bison. Add a "Great Plains (1800)" entry with higher grazer biomass. What changed?',
      successHint: 'Grasslands are among the most productive and least understood ecosystems on Earth. They store vast amounts of carbon, support megafauna, and depend on disturbance. Kaziranga is a world-class example of this dynamic ecosystem.',
    },
    {
      title: 'Why grass grows back — meristems below ground',
      concept: `Most plants grow from their tips — cut the tip and the plant stops growing. Grasses are different. They grow from the **base** of each leaf, not the tip. This growing point is called the **basal meristem**, and it sits at or below ground level.

A **meristem** is a region of undifferentiated cells that can divide and produce new tissue — the plant equivalent of stem cells. In grass:
- The **shoot apical meristem** stays at ground level (protected from fire and grazing)
- **Intercalary meristems** at the base of each leaf blade push the blade upward
- **Root meristems** at the tips of roots grow downward

This is why you can mow a lawn every week and it keeps growing. The mower cuts the leaf blades, but the meristems are safely underground. A tree has its growing point (apical bud) at the top — cut it and growth stops.

In Kaziranga:
- Elephants eat the grass tops — meristems survive, grass regrows
- Fire burns the above-ground parts — meristems survive underground
- Floods submerge the grass — meristems survive in the saturated soil
- Once the flood recedes, the grass shoots up from the protected meristems

This is why *Saccharum spontaneum* can grow 2-3 cm per day after disturbance — the meristem is already in place, ready to push new growth.`,
      analogy: 'A grass plant is like an iceberg — the important part is below the surface. Cut off the visible top (leaf blades) and the main body (meristems, root system) remains intact, ready to regrow. A tree is more like a skyscraper — the vital structures (growing tip, canopy) are at the top. Damage the top and the whole structure suffers.',
      storyConnection: 'The story asks: how does the Kaziranga grass grow tall after being burned, grazed, and flooded year after year? The answer is the basal meristem — a hidden growth engine protected below ground. The grass\'s "secret" is architectural: it keeps its factory underground while sending only replaceable products (leaf blades) above.',
      checkQuestion: 'Bamboo is a grass (family Poaceae). After flowering and dying, bamboo groves regrow from underground rhizomes. How does this relate to meristem biology?',
      checkAnswer: 'Bamboo rhizomes are underground stems packed with meristematic tissue. Each node on the rhizome can produce a new shoot. When the above-ground culms die after flowering, the rhizome meristems activate and push new shoots upward. The grove "dies" above ground but is alive below — the same survival strategy as Kaziranga grass, scaled up to massive bamboo size.',
      codeIntro: 'Model grass regrowth after fire, grazing, and flooding using meristem-based growth.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Grass growth model: height depends on meristem activity
days = np.arange(0, 365)

# Growth rate depends on:
# 1. Meristem activity (temperature and water dependent)
# 2. Disturbance events reset above-ground height to 0

# Temperature cycle (Kaziranga: 10-35°C)
temp = 22.5 + 12.5 * np.sin(2 * np.pi * (days - 90) / 365)

# Rainfall cycle (monsoon June-September)
rainfall = 50 + 150 * np.exp(-0.5 * ((days - 200) / 40)**2)

# Growth rate (cm/day): function of temp and moisture
growth_rate = 0.5 * np.clip((temp - 10) / 25, 0, 1) * np.clip(rainfall / 100, 0.2, 1)

# Disturbance events
# Fire in February (day ~45), Flood peak in August (day ~230)
fire_day = 45
flood_start = 180
flood_end = 260

height = np.zeros_like(days, dtype=float)
for i in range(1, len(days)):
    if days[i] == fire_day:
        height[i] = 5  # fire burns to 5cm stubble
    elif flood_start <= days[i] <= flood_end:
        # Submerged: growth slows but meristems survive
        height[i] = height[i-1] + growth_rate[i] * 0.3
    else:
        height[i] = height[i-1] + growth_rate[i]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Growth curve with disturbances
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(days, height, color='#22c55e', linewidth=2)
ax.fill_between(days, height, alpha=0.15, color='#22c55e')
ax.axvline(fire_day, color='#ef4444', linestyle='--', linewidth=1, label='Fire')
ax.axvspan(flood_start, flood_end, alpha=0.1, color='#3b82f6', label='Monsoon flood')
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Grass height (cm)', color='white')
ax.set_title('Kaziranga Grass Growth Cycle', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# Growth rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(days, growth_rate, color='#f59e0b', linewidth=2)
ax.fill_between(days, growth_rate, alpha=0.15, color='#f59e0b')
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Growth rate (cm/day)', color='white')
ax.set_title('Daily Growth Rate', color='#f59e0b', fontsize=11)
ax.tick_params(colors='gray')

# Tree vs grass response to fire
ax = axes[1, 0]
ax.set_facecolor('#111827')
days_post = np.arange(0, 180)
grass_recovery = np.minimum(5 + 2 * days_post, 400)  # fast, meristem-driven
tree_recovery = 0.1 * days_post ** 1.2  # slow, seed-based

ax.plot(days_post, grass_recovery, color='#22c55e', linewidth=2, label='Grass (meristem regrowth)')
ax.plot(days_post, tree_recovery, color='#f59e0b', linewidth=2, label='Tree seedling (from seed)')
ax.set_xlabel('Days after fire', color='white')
ax.set_ylabel('Height (cm)', color='white')
ax.set_title('Recovery Speed: Grass vs Tree After Fire', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# Biomass allocation: above vs below ground
ax = axes[1, 1]
ax.set_facecolor('#111827')
plants = ['Kaziranga\
grass', 'Oak\
tree', 'Corn\
(crop)', 'Bamboo']
above = [30, 70, 80, 60]
below = [70, 30, 20, 40]

x = np.arange(len(plants))
ax.bar(x, above, color='#22c55e', label='Above ground')
ax.bar(x, [-b for b in below], color='#f59e0b', label='Below ground')
ax.set_xticks(x)
ax.set_xticklabels(plants, color='white')
ax.axhline(0, color='white', linewidth=0.5)
ax.set_ylabel('Biomass %', color='white')
ax.set_title('Above vs Below Ground Biomass', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(-80, 90)

plt.tight_layout()
plt.show()

print("Why grass wins after disturbance:")
print(f"  Post-fire grass height at day 30: {min(5 + 2*30, 400):.0f} cm")
print(f"  Post-fire tree height at day 30: {0.1 * 30**1.2:.1f} cm")
print(f"  Grass is {min(5 + 2*30, 400) / (0.1 * 30**1.2):.0f}x taller after 30 days")
print()
print("The secret: 70% of grass biomass is underground.")
print("Fire and grazing only destroy the 30% above ground.")
print("The meristems are safe, ready to regrow immediately.")`,
      challenge: 'Add a grazing event (elephants eat grass to 50cm height on day 100). How does this affect the annual growth curve? Does it help or hurt total grass production?',
      successHint: 'The basal meristem is one of the most important adaptations in plant biology. It explains why grasslands dominate in disturbed environments, why lawns survive mowing, and why Kaziranga grass can grow tall year after year despite fire, flood, and megafauna.',
    },
    {
      title: 'Fire ecology — why fire helps grasslands',
      concept: `Fire seems destructive, but in grasslands it is **essential**. Without fire, grasslands slowly convert to forest (a process called **succession**). Fire resets the succession clock, keeping the grassland in its productive state.

How fire helps grasslands:
- **Removes dead material**: old grass shades out new growth. Fire clears the thatch, letting sunlight reach the soil.
- **Returns nutrients**: burning converts dead biomass into ash — a fast-release fertilizer rich in potassium, calcium, and phosphorus.
- **Kills tree seedlings**: young trees have thin bark and above-ground meristems. Fire kills them. Grass meristems are underground and survive.
- **Stimulates germination**: some grass seeds require fire (heat or smoke chemicals) to break dormancy.
- **Reduces disease**: fire kills parasites, fungi, and accumulated pathogens in the thatch layer.

In Kaziranga, park managers conduct **controlled burns** (prescribed fires) every dry season. Without these burns:
- The tall grass would accumulate several years of dead material
- Tree seedlings would establish and grow into woodland
- Grassland-dependent species (Indian rhino, swamp deer) would lose habitat
- The diverse grassland ecosystem would collapse into monotonous forest

Fire is not the enemy of Kaziranga — it is the gardener.`,
      analogy: 'Fire in a grassland is like pruning a fruit tree. It seems violent — cutting away living material. But the result is healthier, more productive growth. The tree responds to pruning with vigorous new branches. The grassland responds to fire with vigorous new shoots. Both are managed disturbances that enhance productivity.',
      storyConnection: 'The story describes fire sweeping through the tall grass, and the grass growing back even taller. This is ecologically accurate. Post-fire grasslands often show a burst of growth called "green-up" — the ash provides nutrients, the cleared canopy lets sunlight reach the soil, and the meristems push new growth rapidly.',
      checkQuestion: 'Kaziranga is home to 2/3 of the world\'s Indian one-horned rhinoceros. Why do rhinos need tall grasslands, and why does fire help maintain their habitat?',
      checkAnswer: 'Indian rhinos are grazers that depend on tall grass for food and cover (they hide from tigers in the grass). Without fire, the grasslands would succeed to woodland, which provides neither the grazing quality nor the cover that rhinos need. Fire maintains the grassland in its ideal state for rhinos: tall, dense, nutritious grass. Paradoxically, burning the grass is essential for the survival of the species that eats it.',
      codeIntro: 'Model grassland succession with and without fire, showing how fire maintains the ecosystem.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(0, 50)

# Model: grass cover vs tree cover
# Without fire: trees gradually invade, grass declines
# With fire: trees are suppressed, grass maintained

def succession(years, fire_interval=None):
    grass = np.zeros_like(years, dtype=float)
    trees = np.zeros_like(years, dtype=float)
    grass[0] = 90  # initial grass cover %
    trees[0] = 10  # initial tree cover %

    for i in range(1, len(years)):
        # Natural tree invasion rate
        tree_growth = 2.0  # % per year
        grass_decline = 1.5  # % per year (shading by trees)

        if fire_interval and years[i] % fire_interval == 0:
            # Fire kills 80% of tree seedlings, burns grass thatch
            trees[i] = trees[i-1] * 0.2
            grass[i] = min(95, grass[i-1] + 10)  # post-fire green-up
        else:
            trees[i] = min(80, trees[i-1] + tree_growth * (1 - trees[i-1]/100))
            grass[i] = max(10, grass[i-1] - grass_decline * trees[i-1]/100)

    return grass, trees

# Three scenarios
grass_no_fire, trees_no_fire = succession(years, fire_interval=None)
grass_5yr, trees_5yr = succession(years, fire_interval=5)
grass_1yr, trees_1yr = succession(years, fire_interval=1)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# No fire
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.fill_between(years, grass_no_fire, color='#22c55e', alpha=0.6, label='Grass')
ax.fill_between(years, 100, 100 - trees_no_fire, color='#f59e0b', alpha=0.6, label='Trees')
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Cover (%)', color='white')
ax.set_title('No Fire: Forest Takes Over', color='#ef4444', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 100)

# Fire every 5 years
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.fill_between(years, grass_5yr, color='#22c55e', alpha=0.6, label='Grass')
ax.fill_between(years, 100, 100 - trees_5yr, color='#f59e0b', alpha=0.6, label='Trees')
for y in range(0, 50, 5):
    ax.axvline(y, color='#ef4444', linewidth=0.5, alpha=0.3)
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Cover (%)', color='white')
ax.set_title('Fire Every 5 Years: Grassland Maintained', color='#22c55e', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 100)

# Fire every year (Kaziranga-like)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.fill_between(years, grass_1yr, color='#22c55e', alpha=0.6, label='Grass')
ax.fill_between(years, 100, 100 - trees_1yr, color='#f59e0b', alpha=0.6, label='Trees')
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Cover (%)', color='white')
ax.set_title('Annual Fire (Kaziranga): Pure Grassland', color='#22c55e', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 100)

# Nutrient pulse after fire
ax = axes[1, 1]
ax.set_facecolor('#111827')
days_post = np.arange(0, 120)
# Nutrient availability spikes after fire (ash), then declines
nitrogen = 100 * np.exp(-0.03 * days_post) + 20
phosphorus = 80 * np.exp(-0.02 * days_post) + 15
potassium = 120 * np.exp(-0.04 * days_post) + 10

ax.plot(days_post, nitrogen, color='#22c55e', linewidth=2, label='Nitrogen')
ax.plot(days_post, phosphorus, color='#3b82f6', linewidth=2, label='Phosphorus')
ax.plot(days_post, potassium, color='#f59e0b', linewidth=2, label='Potassium')
ax.set_xlabel('Days after fire', color='white')
ax.set_ylabel('Available nutrients (relative)', color='white')
ax.set_title('Post-Fire Nutrient Pulse', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fire is essential for Kaziranga:")
print(f"  Without fire: grass drops to {grass_no_fire[-1]:.0f}% after 50 years")
print(f"  Fire every 5 years: grass stays at {grass_5yr[-1]:.0f}%")
print(f"  Annual fire: grass stays at {grass_1yr[-1]:.0f}%")
print()
print("Fire suppression is one of the biggest threats to")
print("grassland ecosystems worldwide. 'Protecting' grasslands")
print("from fire actually destroys them.")`,
      challenge: 'What fire interval maintains grass at exactly 70% cover? Try intervals of 2, 3, 7, and 10 years. This is a real management question for conservationists.',
      successHint: 'Fire ecology inverts our intuition: destruction is maintenance, burning is gardening, and the most "natural" grassland is the one that is regularly set ablaze. This understanding is critical for managing Kaziranga and grasslands worldwide.',
    },
    {
      title: 'Grazing and grass coevolution — why herbivores help',
      concept: `Grasses and large herbivores have been coevolving for ~20 million years. This coevolution means they depend on each other:

**How grass benefits from grazing**:
- Removes old, shading leaf blades, letting new growth access sunlight
- Stimulates tillering (branching at the base), making the grass denser
- Deposits nutrients (dung and urine are natural fertilizer)
- Breaks soil crust with hooves, helping seeds germinate and water infiltrate

**How grass survives grazing**:
- Basal meristems are below the bite point
- Silica in leaf blades wears down herbivore teeth (forcing them to move on before over-grazing)
- Rapid regrowth rate after defoliation
- Many grass species increase toxin production when grazed (induced defence)

**The grazing optimization hypothesis**: moderate grazing actually increases grass productivity above the ungrazed level. There is an optimal grazing intensity where production is maximized. Too little grazing: old material accumulates, shading reduces growth. Too much grazing: meristems damaged, root reserves depleted.

In Kaziranga: the Indian rhino, Asian elephant, and wild water buffalo are the primary grazers. Their combined grazing maintains the grass in its most productive state — a partnership 20 million years in the making.`,
      analogy: 'Grazing and grass coevolution is like a gardener and a hedge. The gardener clips the hedge (grazing), which makes it grow denser and bushier (tillering). Without clipping, the hedge grows tall and thin. Without the hedge, the gardener has nothing to tend. Each needs the other for the best outcome.',
      storyConnection: 'The story hints that the elephants and the grass have a secret understanding — the elephants eat, and the grass grows taller in return. This is not fiction; it is the grazing optimization hypothesis. Moderate herbivory genuinely increases grass productivity. The elephants and the grass are partners, not adversaries.',
      checkQuestion: 'Grass leaves contain silica (essentially tiny glass particles). How did this evolve, and what does it do to herbivores?',
      checkAnswer: 'Silica is an anti-herbivore defence. It wears down teeth, making grazing painful and less efficient. Herbivores with worn teeth eat less and eventually cannot graze at all. This selects for herbivores with high-crowned, continuously growing teeth (like horse molars) — a direct evolutionary response to silica. The arms race: grass evolved silica, herbivores evolved tougher teeth, grass evolved more silica.',
      codeIntro: 'Model the grazing optimization curve and simulate grass-herbivore dynamics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Grazing optimization curve
ax = axes[0, 0]
ax.set_facecolor('#111827')
grazing_intensity = np.linspace(0, 1, 200)  # 0 = no grazing, 1 = complete removal

# Grass production follows a hump-shaped curve
# Low grazing: thatch accumulates, shading
# Medium grazing: optimal light + nutrient cycling
# High grazing: meristem damage
production = 100 * grazing_intensity * np.exp(-3 * grazing_intensity**2) / 0.408  # normalized to peak at 100

ax.plot(grazing_intensity * 100, production, color='#22c55e', linewidth=3)
ax.fill_between(grazing_intensity * 100, production, alpha=0.15, color='#22c55e')

# Mark optimal
opt_idx = np.argmax(production)
ax.plot(grazing_intensity[opt_idx] * 100, production[opt_idx], 'o', color='#f59e0b', markersize=10)
ax.annotate(f'Optimal: {grazing_intensity[opt_idx]*100:.0f}% grazed',
            xy=(grazing_intensity[opt_idx]*100, production[opt_idx]),
            xytext=(50, 85), color='#f59e0b', fontsize=10, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax.set_xlabel('Grazing intensity (%)', color='white')
ax.set_ylabel('Grass production (relative)', color='white')
ax.set_title('Grazing Optimization Hypothesis', color='white', fontsize=13)
ax.tick_params(colors='gray')

# 2. Herbivore population dynamics
ax = axes[0, 1]
ax.set_facecolor('#111827')
years = np.arange(0, 100)

# Lotka-Volterra-like model
grass_biomass = np.zeros(100)
herbivore_pop = np.zeros(100)
grass_biomass[0] = 500
herbivore_pop[0] = 50

r_grass = 0.5      # grass growth rate
K_grass = 1000     # carrying capacity
a = 0.005          # grazing rate
b = 0.0001         # herbivore benefit from grazing
d = 0.2            # herbivore death rate

for i in range(1, 100):
    dG = r_grass * grass_biomass[i-1] * (1 - grass_biomass[i-1]/K_grass) - a * grass_biomass[i-1] * herbivore_pop[i-1]
    dH = b * grass_biomass[i-1] * herbivore_pop[i-1] - d * herbivore_pop[i-1]
    grass_biomass[i] = max(10, grass_biomass[i-1] + dG)
    herbivore_pop[i] = max(1, herbivore_pop[i-1] + dH)

ax.plot(years, grass_biomass, color='#22c55e', linewidth=2, label='Grass biomass')
ax.plot(years, herbivore_pop * 10, color='#f59e0b', linewidth=2, label='Herbivore pop (x10)')
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Population/Biomass', color='white')
ax.set_title('Grass-Herbivore Population Dynamics', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Kaziranga grazers and their grass preferences
ax = axes[1, 0]
ax.set_facecolor('#111827')
grazers = ['Indian\
Rhino', 'Asian\
Elephant', 'Wild\
Buffalo', 'Swamp\
Deer', 'Hog\
Deer']
daily_intake = [60, 150, 30, 10, 5]   # kg grass per day
preferred_height = [50, 200, 80, 30, 20]  # cm

x = np.arange(len(grazers))
w = 0.35
ax.bar(x - w/2, daily_intake, w, color='#22c55e', label='Daily intake (kg)')
ax.bar(x + w/2, preferred_height, w, color='#3b82f6', label='Preferred grass height (cm)')
ax.set_xticks(x)
ax.set_xticklabels(grazers, color='white', fontsize=8)
ax.set_ylabel('Value', color='white')
ax.set_title('Kaziranga Grazers: Intake & Preference', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Grazing creates a mosaic
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Simulate a grazing mosaic: different heights across a landscape
np.random.seed(42)
landscape = np.random.uniform(50, 500, (20, 20))  # grass height in cm
# Grazing patches (randomly placed)
for _ in range(15):
    cx, cy = np.random.randint(2, 18, 2)
    r = np.random.randint(1, 4)
    for x in range(max(0, cx-r), min(20, cx+r)):
        for y in range(max(0, cy-r), min(20, cy+r)):
            landscape[x, y] *= 0.3  # grazed down

cmap = plt.cm.YlGn
ax.imshow(landscape, cmap=cmap, interpolation='nearest')
cbar = plt.colorbar(ax.imshow(landscape, cmap=cmap, interpolation='nearest'), ax=ax)
cbar.set_label('Grass height (cm)', color='white')
cbar.ax.tick_params(colors='gray')
ax.set_title('Grazing Creates Habitat Mosaic', color='white', fontsize=11)
ax.set_xlabel('(Dark patches = grazed areas)', color='gray')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Grazing optimization in Kaziranga:")
print(f"  Optimal grazing intensity: ~{grazing_intensity[opt_idx]*100:.0f}%")
print()
print("Daily grass consumption by Kaziranga megafauna:")
for name, intake in zip(['Rhino', 'Elephant', 'Buffalo', 'Swamp deer', 'Hog deer'], daily_intake):
    print(f"  {name}: {intake} kg/day")
print(f"  Total for ~2500 rhinos alone: {60*2500:,} kg/day = {60*2500/1000:.0f} tonnes/day")`,
      challenge: 'What happens if poaching reduces the rhino population to 100 (from 2500)? Reduce herbivore_pop[0] to 5. How does the grass biomass change? Does the ecosystem lose its grazing benefit?',
      successHint: 'The grass-grazer partnership is one of the great coevolutionary stories in biology. Understanding it changes how we think about conservation: protecting megafauna is not just about the animals — it is about maintaining the ecosystem they help create.',
    },
    {
      title: 'Kaziranga ecosystem — a world within the grass',
      concept: `Kaziranga National Park is a UNESCO World Heritage Site, home to:
- **2/3 of the world's Indian one-horned rhinoceros** (~2,600 individuals)
- The **highest density of tigers** in any protected area
- Large populations of Asian elephants, wild water buffalo, and swamp deer
- Over 500 bird species

The ecosystem is structured by the **tall grass**:
- **Short grass** (grazed or recently burned areas, <50 cm): preferred by hog deer and swamp deer
- **Medium grass** (50-200 cm): used by rhinos for feeding and by tigers for stalking
- **Tall grass** (200-600 cm): cover for rhinos, nesting for birds, habitat for small mammals

The grass creates a three-dimensional habitat. Different heights support different species, creating high biodiversity in a seemingly uniform landscape.

The annual cycle:
- **Winter (Nov-Feb)**: dry season, grass dormant, controlled burns
- **Pre-monsoon (Mar-May)**: rapid grass growth, animals spread across grassland
- **Monsoon (Jun-Sep)**: floods submerge 2/3 of the park; animals migrate to higher ground (Karbi Anglong hills)
- **Post-monsoon (Oct-Nov)**: flood recedes, explosive grass regrowth`,
      analogy: 'Kaziranga\'s tall grassland is like a multi-story building. The "ground floor" (0-50 cm) is for small mammals and ground-nesting birds. The "middle floors" (50-200 cm) are for rhinos, deer, and stalking tigers. The "penthouse" (200-600 cm) is for elephants and nesting raptors. Same building, different tenants on each floor.',
      storyConnection: 'The story says the tall grass "shelters all creatures" — and this is literally true. The grass is not just a food source; it is architecture. It provides cover from predators, nesting sites, thermal shelter, and microhabitat diversity. The grass IS the habitat, not just the vegetation within it.',
      checkQuestion: 'During monsoon floods, Kaziranga animals cross National Highway 37 to reach higher ground. Why is this road one of the biggest threats to the park?',
      checkAnswer: 'The highway cuts through the narrow corridor between the park and the Karbi Anglong hills. During floods, animals must cross this busy road. Dozens of rhinos, elephants, and deer are killed by vehicles each year during migration. Proposed solutions include underpasses, speed restrictions, and road closures during peak migration. The road is a fatal barrier in a life-saving migration route.',
      codeIntro: 'Visualize the Kaziranga ecosystem structure: species distribution across grass heights.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Species by grass height preference
ax = axes[0, 0]
ax.set_facecolor('#111827')
species = ['Hog deer', 'Swamp deer', 'Indian rhino', 'Tiger', 'Asian elephant', 'Bengal florican']
min_height = [0, 10, 50, 80, 0, 30]
max_height = [50, 100, 300, 250, 600, 150]
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4']

for i, (sp, lo, hi, c) in enumerate(zip(species, min_height, max_height, colors)):
    ax.barh(i, hi - lo, left=lo, color=c, alpha=0.7, height=0.6)
    ax.text(hi + 10, i, sp, color='white', fontsize=9, va='center')

ax.set_xlabel('Grass height (cm)', color='white')
ax.set_title('Species Habitat by Grass Height', color='white', fontsize=13)
ax.set_yticks([])
ax.tick_params(colors='gray')
ax.axvline(50, color='gray', linestyle=':', linewidth=0.5)
ax.axvline(200, color='gray', linestyle=':', linewidth=0.5)
ax.text(25, -0.5, 'Short', color='gray', fontsize=8, ha='center')
ax.text(125, -0.5, 'Medium', color='gray', fontsize=8, ha='center')
ax.text(400, -0.5, 'Tall', color='gray', fontsize=8, ha='center')

# 2. Annual cycle
ax = axes[0, 1]
ax.set_facecolor('#111827')
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
grass_height_monthly = [100, 50, 80, 200, 350, 300, 200, 150, 250, 400, 300, 150]
flood_level = [0, 0, 0, 0, 0, 30, 70, 90, 50, 10, 0, 0]
fire = [0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

x = np.arange(12)
ax.bar(x, grass_height_monthly, color='#22c55e', alpha=0.7, label='Grass height (cm)')
ax.bar(x, [-f for f in flood_level], color='#3b82f6', alpha=0.5, label='Flood depth (cm)')
ax.bar(x, fire, color='#ef4444', alpha=0.5, label='Fire (burn %)')
ax.set_xticks(x)
ax.set_xticklabels(months, color='white', fontsize=8)
ax.set_ylabel('Height/Depth (cm)', color='white')
ax.set_title('Kaziranga Annual Cycle', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 3. Population data
ax = axes[1, 0]
ax.set_facecolor('#111827')
census_years = [1966, 1972, 1978, 1984, 1991, 1999, 2006, 2013, 2018, 2022]
rhino_pop = [366, 658, 938, 1080, 1164, 1552, 1855, 2290, 2413, 2613]

ax.plot(census_years, rhino_pop, 'o-', color='#f59e0b', linewidth=2, markersize=6)
ax.fill_between(census_years, rhino_pop, alpha=0.15, color='#f59e0b')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Indian Rhino Population', color='white')
ax.set_title('Kaziranga Rhino Population Recovery', color='#f59e0b', fontsize=13)
ax.tick_params(colors='gray')
ax.annotate('Conservation\
success story', xy=(2015, 2400),
            color='white', fontsize=10, fontweight='bold')

# 4. Food web
ax = axes[1, 1]
ax.set_facecolor('#111827')

# Simplified food web as a diagram
levels = {
    'Top predator': (['Tiger'], '#ef4444', 0.9),
    'Large herbivore': (['Rhino', 'Elephant', 'Buffalo'], '#f59e0b', 0.65),
    'Medium herbivore': (['Swamp deer', 'Hog deer'], '#22c55e', 0.4),
    'Primary producer': (['Tall grass', 'Short grass', 'Aquatic plants'], '#3b82f6', 0.15),
}

for level_name, (species_list, color, y_pos) in levels.items():
    ax.text(-0.1, y_pos, level_name, color='gray', fontsize=8, ha='right', va='center')
    for j, sp in enumerate(species_list):
        x_pos = (j + 0.5) / len(species_list)
        ax.text(x_pos, y_pos, sp, color=color, fontsize=9, ha='center', va='center',
                fontweight='bold', bbox=dict(boxstyle='round', facecolor=color, alpha=0.2))

# Arrows
arrow_style = dict(arrowstyle='->', color='gray', linewidth=0.5)
ax.annotate('', xy=(0.5, 0.85), xytext=(0.3, 0.70), arrowprops=arrow_style)
ax.annotate('', xy=(0.5, 0.85), xytext=(0.7, 0.70), arrowprops=arrow_style)
ax.annotate('', xy=(0.3, 0.60), xytext=(0.3, 0.45), arrowprops=arrow_style)
ax.annotate('', xy=(0.5, 0.35), xytext=(0.3, 0.20), arrowprops=arrow_style)

ax.set_xlim(-0.3, 1.1)
ax.set_ylim(0, 1)
ax.set_title('Kaziranga Food Web (simplified)', color='white', fontsize=11)
ax.axis('off')

plt.tight_layout()
plt.show()

print("Kaziranga by numbers:")
print("  Area: 430 km² (relatively small)")
print("  Rhinos: ~2,613 (2022 census)")
print("  Tigers: ~104 (highest density in India)")
print("  Elephants: ~1,165")
print("  Bird species: 500+")
print()
print("The tall grass makes all of this possible.")
print("Without the grass, there is no Kaziranga.")`,
      challenge: 'The rhino population has grown from 366 to 2613 in 56 years. Calculate the average annual growth rate. At this rate, when will the population reach 5000? Is this sustainable given Kaziranga\'s size?',
      successHint: 'Kaziranga is a conservation success story built on understanding ecology. The tall grass is not scenery — it is infrastructure. Fire management, flood management, and anti-poaching together maintain the conditions that support one of the richest wildlife assemblages in Asia.',
    },
    {
      title: 'Controlled burns in conservation — fire as a tool',
      concept: `Controlled burns (prescribed fires) are deliberate, planned fires set by park managers to achieve specific ecological goals. In Kaziranga, they are conducted every January-February.

The process:
1. **Planning**: identify which areas to burn based on grass age, species composition, and wildlife needs
2. **Firebreaks**: clear strips of vegetation around the burn area to prevent fire spreading to forests or villages
3. **Weather check**: burn only on days with low wind, moderate humidity, and predictable wind direction
4. **Ignition**: teams use drip torches to light the grass in a controlled pattern, usually starting from the downwind side (backfire technique — slower, cooler, more controllable)
5. **Monitoring**: fire behavior is watched constantly; teams with water and beaters stand ready
6. **Post-burn assessment**: check that the fire stayed within planned boundaries, assess any damage

Benefits specific to Kaziranga:
- Creates a mosaic of grass heights (recently burned = short; unburned = tall)
- Short-grass areas attract grazers, making wildlife viewing easier for tourists (tourism funds conservation)
- Reduces fuel load, preventing catastrophic wildfire that could burn uncontrollably
- Returns nutrients to the soil for the next growing season

The paradox: to preserve a "natural" ecosystem, you must actively manage it. Kaziranga without controlled burns would lose its grassland character within a decade.`,
      analogy: 'Controlled burns are like a doctor prescribing a controlled dose of a substance that is harmful in excess. Fire in an uncontrolled wildfire is the disease. Fire in a prescribed burn is the medicine. The dose, timing, and application determine whether it heals or harms.',
      storyConnection: 'The story describes the grass renewing itself after fire — a cycle that repeats endlessly. Controlled burns in Kaziranga are the human management of this ancient cycle. Park rangers are not fighting nature; they are partnering with it, using fire the way the ecosystem has used it for millions of years, but with precision and planning.',
      checkQuestion: 'Some conservationists argue that all human intervention in national parks should stop — let nature take its course. Why is this problematic for Kaziranga?',
      checkAnswer: 'Kaziranga exists in a landscape heavily modified by humans: highways cut through migration corridors, rivers are managed by upstream dams, and surrounding land is converted to tea plantations and farms. "Letting nature take its course" in this context means letting the park be degraded by human-altered conditions (changed flood patterns, invasive species, no natural fire regime). Active management (controlled burns, anti-poaching, corridor restoration) compensates for the human alterations that surround the park.',
      codeIntro: 'Simulate a controlled burn strategy and its effects on habitat mosaic diversity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate a burn plan: grid of the park, burn different sections in different years
np.random.seed(42)
grid_size = 20  # 20x20 grid representing the park

# Each cell: years since last burn (0 = just burned)
years_since_burn = np.random.randint(0, 5, (grid_size, grid_size))

# Grass height depends on years since burn
def grass_height(years):
    return np.minimum(50 + 80 * years, 500)  # caps at 500 cm

# Habitat quality for different species
def rhino_habitat(height):
    return np.where((height > 100) & (height < 400), 1, 0.3)

def deer_habitat(height):
    return np.where(height < 100, 1, 0.2)

def tiger_habitat(height):
    return np.where((height > 150) & (height < 350), 1, 0.3)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Year 0: initial state
heights = grass_height(years_since_burn)
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(heights, cmap='YlGn', vmin=0, vmax=500)
ax.set_title('Year 0: Grass Height Map', color='white', fontsize=10)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='cm')

# Apply a burn plan: burn ~25% of the park each year (rotation)
def apply_burn(grid, burn_fraction=0.25):
    new_grid = grid + 1  # age everything by one year
    n_cells = int(grid_size * grid_size * burn_fraction)
    # Prioritize oldest cells for burning
    flat = new_grid.flatten()
    oldest_indices = np.argsort(flat)[-n_cells:]
    flat[oldest_indices] = 0
    return flat.reshape(grid_size, grid_size)

# Simulate 4 years
states = [years_since_burn.copy()]
for year in range(4):
    states.append(apply_burn(states[-1]))

# Show years 1 and 4
for plot_idx, year_idx in enumerate([1, 4]):
    heights = grass_height(states[year_idx])
    ax = axes[0, plot_idx + 1]
    ax.set_facecolor('#111827')
    im = ax.imshow(heights, cmap='YlGn', vmin=0, vmax=500)
    ax.set_title(f'Year {year_idx}: After {year_idx} Rotational Burns', color='white', fontsize=10)
    ax.tick_params(colors='gray')

# Habitat quality maps for final state
final_heights = grass_height(states[4])

habitat_maps = [
    ('Rhino Habitat Quality', rhino_habitat(final_heights), '#f59e0b'),
    ('Deer Habitat Quality', deer_habitat(final_heights), '#22c55e'),
    ('Tiger Habitat Quality', tiger_habitat(final_heights), '#ef4444'),
]

for ax, (title, quality, color) in zip(axes[1], habitat_maps):
    ax.set_facecolor('#111827')
    cmap = plt.cm.colors.LinearSegmentedColormap.from_list('c', ['#111827', color])
    ax.imshow(quality, cmap=cmap, vmin=0, vmax=1)
    good_pct = np.mean(quality > 0.5) * 100
    ax.set_title(f'{title}\
({good_pct:.0f}% suitable)', color=color, fontsize=10)
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Diversity metric: Shannon index of grass height classes
def shannon_diversity(heights, n_classes=5):
    hist, _ = np.histogram(heights.flatten(), bins=n_classes, range=(0, 500))
    props = hist / hist.sum()
    props = props[props > 0]
    return -np.sum(props * np.log(props))

diversities = [shannon_diversity(grass_height(state)) for state in states]
print("Habitat diversity (Shannon index) over time:")
for i, d in enumerate(diversities):
    print(f"  Year {i}: H = {d:.3f}")
print()
print("Higher Shannon index = more diverse grass heights = more species supported")
print("Rotational burning INCREASES habitat diversity by creating a mosaic.")
print()
print("This is why controlled burns are not just fire management —")
print("they are HABITAT management. The burn plan is a landscape design tool.")`,
      challenge: 'What burn fraction maximizes the Shannon diversity index? Try 10%, 25%, 40%, and 60%. Is there an optimal rotation?',
      successHint: 'Controlled burns in Kaziranga are a masterclass in applied ecology. The science of fire, meristems, grazing, and succession comes together in a management plan that sustains one of the world\'s most valuable ecosystems. The tall grass grows because humans learned to wield fire as a tool, not a weapon.',
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