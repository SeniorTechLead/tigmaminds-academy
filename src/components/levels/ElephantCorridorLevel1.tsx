import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ElephantCorridorLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Habitat fragmentation — when forests become islands',
      concept: `In the story, elephants struggle to move between two forest patches separated by farmland. This is **habitat fragmentation** — when continuous habitat is broken into isolated patches by roads, farms, or cities.

Fragmentation is devastating because:
- **Smaller patches support fewer species** (island biogeography theory)
- **Edge effects**: the boundary between forest and farmland creates a hostile zone (more light, wind, invasive species)
- **Genetic isolation**: populations in separate patches can't interbreed → inbreeding → loss of genetic diversity
- **Resource limitation**: a small patch may lack seasonal food or water

India has lost ~90% of its original forest cover. What remains is often fragmented into thousands of small patches. For large animals like elephants (home range: 100-1000 km²), a 10 km² forest fragment is a prison, not a home.`,
      analogy: 'Habitat fragmentation is like cutting a city into blocks with walls between them. Each block has a few shops, but no single block has everything you need. If you can\'t cross the walls (roads, farmland), you\'re stuck with whatever your block has. Wildlife corridors are bridges that reconnect the blocks.',
      storyConnection: 'The elephants in the story remember an ancient path through the forest — a corridor their ancestors used. But the path has been blocked by a new village. This is habitat fragmentation in action: a centuries-old migration route severed by human expansion. The elephants are trapped in a fragment too small to sustain their herd.',
      checkQuestion: 'If you have 100 km² of forest, is it better for wildlife to have one big patch or ten 10 km² patches?',
      checkAnswer: 'Almost always ONE big patch (SLOSS debate: Single Large Or Several Small). Reasons: (1) Large patch has more interior habitat (less edge effect). (2) It supports large animals that need big ranges. (3) It maintains genetic connectivity. (4) It has more habitat diversity. The exception: if species have very different habitat needs, scattered patches might cover more habitat types. But for most species, one big forest beats ten small ones.',
      codeIntro: 'Model the species-area relationship: how many species survive as habitat shrinks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Species-Area Relationship: S = c * A^z
# S = number of species, A = area, c = constant, z = slope (typically 0.15-0.35)
area = np.logspace(0, 5, 200)  # 1 to 100,000 km²

# Different z values for different ecosystems
z_island = 0.35  # true islands (high isolation)
z_fragment = 0.25  # habitat fragments (moderate isolation)
z_continent = 0.15  # connected continental habitats

c = 10  # baseline constant

species_island = c * area ** z_island
species_fragment = c * area ** z_fragment
species_continent = c * area ** z_continent

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Species-area curves
ax1.set_facecolor('#111827')
ax1.loglog(area, species_island, color='#ef4444', linewidth=2, label=f'Islands (z={z_island})')
ax1.loglog(area, species_fragment, color='#f59e0b', linewidth=2, label=f'Fragments (z={z_fragment})')
ax1.loglog(area, species_continent, color='#22c55e', linewidth=2, label=f'Connected (z={z_continent})')

# Mark habitat loss scenario
orig_area = 10000
reduced_area = 1000
ax1.axvline(orig_area, color='#22c55e', linestyle=':', alpha=0.5)
ax1.axvline(reduced_area, color='#ef4444', linestyle=':', alpha=0.5)
ax1.annotate('90% habitat loss', xy=(3000, 80), color='white', fontsize=10,
             arrowprops=dict(arrowstyle='<->', color='white'))

ax1.set_xlabel('Habitat area (km², log scale)', color='white')
ax1.set_ylabel('Number of species (log scale)', color='white')
ax1.set_title('Species-Area Relationship', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Edge effect visualization
patch_size = np.linspace(1, 100, 100)  # km per side (square patch)
total_area = patch_size ** 2
edge_width = 0.5  # km of edge effect
interior_side = np.maximum(patch_size - 2 * edge_width, 0)
interior_area = interior_side ** 2
interior_fraction = interior_area / total_area

ax2.set_facecolor('#111827')
ax2.plot(patch_size, interior_fraction * 100, color='#22c55e', linewidth=2)
ax2.fill_between(patch_size, interior_fraction * 100, 100, alpha=0.15, color='#ef4444', label='Edge habitat')
ax2.fill_between(patch_size, 0, interior_fraction * 100, alpha=0.15, color='#22c55e', label='Interior habitat')
ax2.axhline(50, color='#f59e0b', linestyle='--', alpha=0.5)
ax2.set_xlabel('Patch side length (km)', color='white')
ax2.set_ylabel('Interior habitat (%)', color='white')
ax2.set_title('Edge Effects: Small Patches Are Mostly Edge', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Species loss from 90% habitat reduction:")
for name, z in [('Islands', z_island), ('Fragments', z_fragment), ('Connected', z_continent)]:
    s_orig = c * orig_area ** z
    s_reduced = c * reduced_area ** z
    loss = (1 - s_reduced / s_orig) * 100
    print(f"  {name}: {loss:.0f}% species lost")
print()
print("A 2×2 km patch is 75% edge habitat — barely any interior!")
print("A 20×20 km patch is only 10% edge — much better for wildlife.")`,
      challenge: 'Model 10 small patches of 10 km² each vs. 1 patch of 100 km². Calculate total species for each using the fragment z-value. Which configuration has more species? Now add a corridor connecting all 10 small patches — does the effective z-value change?',
      successHint: 'Habitat fragmentation is the #1 threat to biodiversity worldwide. Understanding the species-area relationship and edge effects is essential for conservation planning. The elephants need connected habitat, not isolated patches.',
    },
    {
      title: 'Wildlife corridors — reconnecting the landscape',
      concept: `A **wildlife corridor** is a strip of habitat connecting two larger patches, allowing animals to move between them. Corridors are a key conservation tool because they:
- Restore **gene flow** between isolated populations
- Allow **seasonal migration** to access food, water, and mates
- Enable **recolonization** of patches after local extinctions
- Increase **effective habitat size** without buying as much land

India has identified **101 elephant corridors** connecting habitat patches. Many are narrow — some just 1 km wide — and constantly threatened by development.

Corridor design matters:
- **Width**: wider is better (reduces edge effects). Minimum for elephants: ~1 km
- **Length**: shorter is better (animals must cross it)
- **Quality**: native vegetation, water sources, no fences
- **Continuity**: even a single road across a corridor can make it useless

The cost of a corridor is tiny compared to the cost of managing two completely isolated populations.`,
      analogy: 'A wildlife corridor is like a highway connecting two cities. Without the highway, each city is self-contained (and limited). With the highway, resources, people, and ideas flow between them, making both cities stronger. For elephants, the "resource" flowing through the corridor is genetic diversity, seasonal food access, and population stability.',
      storyConnection: 'The story\'s resolution involves the village creating a safe passage for the elephants — planting trees and removing fences to restore the ancient path. This is exactly how real wildlife corridors work. The village doesn\'t need to give up all its farmland — just a narrow strip that reconnects two forest patches.',
      checkQuestion: 'A proposed highway will cut through an elephant corridor. The government offers two options: (A) cancel the highway, or (B) build the highway with animal underpasses. Which is better?',
      checkAnswer: 'Usually (B), if the underpasses are well-designed. A highway brings economic benefits (trade, connectivity, jobs). Animal underpasses (or overpasses — "green bridges") maintain wildlife connectivity while allowing development. The Netherlands has 600+ wildlife crossings. Banff National Park in Canada has 44 overpasses and underpasses, used by bears, elk, and wolves. Canceling infrastructure entirely is usually politically impossible; designing it to coexist with wildlife is practical and effective.',
      codeIntro: 'Model how corridor width affects population connectivity between two forest patches.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulation: two populations connected by a corridor
# Migration rate depends on corridor width
corridor_widths = np.linspace(0, 5, 50)  # km
n_years = 100

# Population dynamics with migration
def simulate_populations(width, years=100):
    pop_a = np.zeros(years)
    pop_b = np.zeros(years)
    pop_a[0] = 100  # starting populations
    pop_b[0] = 50

    K = 200  # carrying capacity per patch
    r = 0.1  # growth rate

    # Migration rate: logistic function of corridor width
    migration_rate = 0.15 / (1 + np.exp(-3 * (width - 1)))  # 0 at width=0, ~0.15 at width>>1

    for y in range(1, years):
        # Logistic growth
        growth_a = r * pop_a[y-1] * (1 - pop_a[y-1] / K)
        growth_b = r * pop_b[y-1] * (1 - pop_b[y-1] / K)

        # Migration (net flow from larger to smaller)
        migration = migration_rate * (pop_a[y-1] - pop_b[y-1])

        pop_a[y] = max(pop_a[y-1] + growth_a - migration + np.random.normal(0, 3), 0)
        pop_b[y] = max(pop_b[y-1] + growth_b + migration + np.random.normal(0, 3), 0)

    return pop_a, pop_b

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Population trajectories for different corridor widths
ax1.set_facecolor('#111827')
for width, color, label in [(0, '#ef4444', 'No corridor'), (1, '#f59e0b', '1 km wide'),
                             (3, '#22c55e', '3 km wide')]:
    pop_a, pop_b = simulate_populations(width)
    ax1.plot(range(n_years), pop_a, color=color, linewidth=2, label=f'Patch A ({label})')
    ax1.plot(range(n_years), pop_b, color=color, linewidth=1, linestyle='--')

ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Population size', color='white')
ax1.set_title('Population Stability with Different Corridor Widths', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Genetic diversity vs corridor width
# Genetic diversity measured by heterozygosity
genetic_diversity = []
extinction_risk = []

for width in corridor_widths:
    migration_rate = 0.15 / (1 + np.exp(-3 * (width - 1)))
    # Effective population: Ne ≈ 4*Na*Nb/(Na+Nb) with migration boost
    Ne_base = 120
    Ne_effective = Ne_base * (1 + 5 * migration_rate)
    # Heterozygosity: H = 1 - 1/(2*Ne) (simplified)
    h = 1 - 1 / (2 * Ne_effective)
    genetic_diversity.append(h)
    # Extinction risk inversely proportional to Ne
    extinction_risk.append(1 / (1 + 0.01 * Ne_effective))

ax2.set_facecolor('#111827')
ax2_twin = ax2.twinx()
l1 = ax2.plot(corridor_widths, np.array(genetic_diversity) * 100, color='#22c55e', linewidth=2, label='Genetic diversity')
l2 = ax2_twin.plot(corridor_widths, np.array(extinction_risk) * 100, color='#ef4444', linewidth=2, label='Extinction risk')
ax2.set_xlabel('Corridor width (km)', color='white')
ax2.set_ylabel('Genetic diversity (%)', color='#22c55e')
ax2_twin.set_ylabel('Extinction risk (%)', color='#ef4444')
ax2.set_title('Corridor Width vs. Conservation Outcomes', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='gray')

lines = l1 + l2
labels = [l.get_label() for l in lines]
ax2.legend(lines, labels, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Impact of corridor width:")
for w, g, e in zip([0, 1, 2, 3, 5], genetic_diversity[::10][:5], extinction_risk[::10][:5]):
    print(f"  Width {w}km: genetic diversity={g*100:.1f}%, extinction risk={e*100:.1f}%")
print()
print("Even a narrow 1km corridor dramatically improves outcomes.")
print("The jump from 0 to 1km is the most impactful — just connecting is key.")`,
      challenge: 'Add a road crossing the corridor. Model this as reducing the effective width by 50%. How does a single road change the conservation outcomes? This is why wildlife crossings (underpasses/overpasses) matter.',
      successHint: 'Wildlife corridors are one of the most cost-effective conservation tools. You don\'t need to protect entire landscapes — just the narrow strips that connect habitat patches. For elephants, these corridors are literally the difference between a viable population and extinction.',
    },
    {
      title: 'GPS tracking — how we map elephant movements',
      concept: `Modern conservation relies on **GPS telemetry** — fitting animals with GPS collars that record their position every few hours. This technology has revolutionized our understanding of animal movement.

An elephant GPS collar:
- Records position every 1-4 hours
- Accurate to ~5 meters
- Battery lasts 2-3 years
- Transmits data via satellite (no cell towers needed)
- Costs ~$3,000-5,000

What GPS data reveals:
- **Home range**: the total area an elephant uses (typically 100-1000 km²)
- **Core areas**: where the elephant spends most of its time (food, water)
- **Movement corridors**: paths between core areas
- **Seasonal patterns**: migration routes tied to monsoon, food availability
- **Human-elephant conflict zones**: where elephants cross into farmland

This data is essential for corridor planning — you can't protect a route if you don't know where it is.`,
      analogy: 'GPS tracking is like Google Maps tracking your phone location. It builds a heatmap of where you spend time (home, office, gym). For elephants, the heatmap reveals forest patches they depend on, and the lines between hotspots reveal the corridors they need. The data turns conservation from guesswork into precision planning.',
      storyConnection: 'In the story, the village elder remembers where elephants once walked. GPS collars provide scientific evidence for what elders knew intuitively. The data proves that elephants return to the same paths year after year — ancestral routes encoded not in maps but in herd memory passed from mother to daughter.',
      checkQuestion: 'An elephant\'s GPS collar shows it enters farmland every October. Is this the elephant\'s "fault"?',
      checkAnswer: 'No. October is when rice ripens — a high-calorie food source. The elephant enters farmland because its natural food source in the forest has been reduced by habitat loss. The elephant is following its survival instinct using the best available resources. The "fault" is the loss of natural habitat that forces the elephant into conflict with humans. GPS data helps identify these conflict zones so they can be managed (buffer zones, early warning systems, crop compensation).',
      codeIntro: 'Simulate GPS tracking data for an elephant and identify home range, core areas, and corridors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate elephant GPS data over 1 year (4 readings/day)
n_days = 365
readings_per_day = 4
n_points = n_days * readings_per_day

# Two core areas (food/water sources)
core_a = np.array([20, 30])  # forest patch A
core_b = np.array([60, 50])  # forest patch B

# Elephant moves between cores with seasonal pattern
x = np.zeros(n_points)
y = np.zeros(n_points)

for i in range(n_points):
    day = i // readings_per_day
    # Seasonal: prefer core_a in monsoon (days 120-270), core_b otherwise
    if 120 < (day % 365) < 270:
        target = core_a + np.random.normal(0, 5, 2)
    else:
        target = core_b + np.random.normal(0, 5, 2)

    # Random walk with drift toward target
    if i == 0:
        x[i], y[i] = core_a + np.random.normal(0, 3, 2)
    else:
        drift = 0.1 * (target - np.array([x[i-1], y[i-1]]))
        x[i] = x[i-1] + drift[0] + np.random.normal(0, 2)
        y[i] = y[i-1] + drift[1] + np.random.normal(0, 2)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# GPS track
ax1.set_facecolor('#111827')
colors_time = plt.cm.viridis(np.linspace(0, 1, n_points))
ax1.scatter(x, y, c=np.arange(n_points), cmap='viridis', s=1, alpha=0.3)
ax1.plot(core_a[0], core_a[1], '*', color='#22c55e', markersize=20, label='Core A (monsoon)')
ax1.plot(core_b[0], core_b[1], '*', color='#ef4444', markersize=20, label='Core B (dry season)')

# Draw corridor between cores
ax1.annotate('', xy=core_b, xytext=core_a,
             arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2, linestyle='--'))
ax1.text((core_a[0]+core_b[0])/2, (core_a[1]+core_b[1])/2 + 5, 'Corridor',
         color='#f59e0b', fontsize=12, ha='center')

ax1.set_xlabel('Easting (km)', color='white')
ax1.set_ylabel('Northing (km)', color='white')
ax1.set_title('Elephant GPS Track (1 year, 1460 points)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Home range estimation (kernel density)
from matplotlib.colors import LinearSegmentedColormap
colors_heatmap = ['#111827', '#1e3a5f', '#22c55e', '#f59e0b', '#ef4444']
cmap_custom = LinearSegmentedColormap.from_list('custom', colors_heatmap, N=100)

ax2.set_facecolor('#111827')
heatmap, xedges, yedges = np.histogram2d(x, y, bins=50)
ax2.imshow(heatmap.T, origin='lower', cmap=cmap_custom, aspect='auto',
           extent=[xedges[0], xedges[-1], yedges[0], yedges[-1]])
ax2.plot(core_a[0], core_a[1], '*', color='white', markersize=15)
ax2.plot(core_b[0], core_b[1], '*', color='white', markersize=15)
ax2.set_xlabel('Easting (km)', color='white')
ax2.set_ylabel('Northing (km)', color='white')
ax2.set_title('Home Range Heatmap (Kernel Density)', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Calculate home range
home_range = (x.max() - x.min()) * (y.max() - y.min())
core_a_time = np.sum(np.sqrt((x - core_a[0])**2 + (y - core_a[1])**2) < 10) / n_points * 100
core_b_time = np.sum(np.sqrt((x - core_b[0])**2 + (y - core_b[1])**2) < 10) / n_points * 100

print(f"Home range (bounding box): ~{home_range:.0f} km²")
print(f"Time in Core A (monsoon habitat): {core_a_time:.0f}%")
print(f"Time in Core B (dry season habitat): {core_b_time:.0f}%")
print(f"Distance between cores: {np.linalg.norm(core_b - core_a):.1f} km")
print()
print("The corridor between cores is CRITICAL:")
print("  - Used twice per year (seasonal migration)")
print("  - Only a few km wide in the data")
print("  - Losing it would trap the elephant in one patch")`,
      challenge: 'Add "farmland" as a rectangle between the two cores. Count how many GPS points fall in the farmland zone. This is a proxy for human-elephant conflict risk. Can you identify the time of year when conflict is highest?',
      successHint: 'GPS tracking transforms conservation from anecdote to data. Every corridor protected, every underpass built, every conflict zone managed — it starts with GPS data showing exactly where elephants go and when.',
    },
    {
      title: 'Metapopulation theory — survival through connected patches',
      concept: `A **metapopulation** is a "population of populations" — multiple groups of the same species living in separate habitat patches, connected by occasional migration.

The key insight (Richard Levins, 1969): a species can survive in a landscape of patches even if individual patches regularly go extinct, AS LONG AS:
- Patches are close enough for recolonization
- Not all patches go extinct at the same time
- Some patches act as "sources" (high survival, excess individuals) that repopulate "sinks" (low survival, need immigrants)

This is the **rescue effect**: migration from a healthy population saves a declining one.

For elephants:
- Each forest patch is a "population"
- Corridors enable migration between patches
- If one patch is disturbed (fire, drought), elephants can move to another
- Without corridors: local extinction becomes permanent extinction`,
      analogy: 'A metapopulation is like a chain of restaurants. If one location closes due to a kitchen fire, the brand survives because other locations are still open — and the closed location can be restocked and reopened from the others. But if each location is completely isolated (no supply chain), a single closure is permanent. Corridors are the supply chain.',
      storyConnection: 'The elephants in the story survived a drought in one forest patch by migrating to another through the corridor. If the corridor had been blocked, the entire herd in the drought-affected patch would have died. The corridor didn\'t prevent the drought — it provided an escape route.',
      checkQuestion: 'A national park has 5 isolated elephant populations of 20 each (100 total). Another park has 1 connected population of 80. Which is more resilient?',
      checkAnswer: 'The connected population of 80 is more resilient. Five populations of 20 are each below the minimum viable population (~50 for short-term, ~500 for long-term genetic viability). Any random fluctuation (disease, drought) could wipe out a patch of 20. The connected population of 80 can absorb shocks, maintain genetic diversity, and recover from losses. Isolation is the enemy of persistence.',
      codeIntro: 'Simulate metapopulation dynamics: how patch connectivity determines long-term species survival.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Metapopulation simulation
n_patches = 8
n_years = 200

# Patch properties
patch_capacity = np.random.randint(20, 60, n_patches)

# Simulation 1: No corridors (isolated)
def simulate_metapop(connectivity, years, patches):
    occupied = np.ones(patches, dtype=bool)  # all start occupied
    pops = patch_capacity.copy().astype(float)
    occupied_history = []
    total_pop_history = []

    for y in range(years):
        occupied_history.append(np.sum(occupied))
        total_pop_history.append(np.sum(pops))

        for i in range(patches):
            if occupied[i]:
                # Local extinction probability (higher for small pops)
                ext_prob = 0.05 if pops[i] > 20 else 0.15
                if np.random.random() < ext_prob:
                    occupied[i] = False
                    pops[i] = 0
            else:
                # Recolonization from connected neighbors
                col_prob = connectivity * np.sum(occupied) / patches
                if np.random.random() < col_prob:
                    occupied[i] = True
                    pops[i] = 10  # small founding population

            # Population growth
            if occupied[i]:
                r = 0.1
                K = patch_capacity[i]
                growth = r * pops[i] * (1 - pops[i] / K)
                pops[i] = max(pops[i] + growth + np.random.normal(0, 2), 0)
                if pops[i] < 2:
                    occupied[i] = False
                    pops[i] = 0

    return occupied_history, total_pop_history

# Three scenarios
isolated = simulate_metapop(0.0, n_years, n_patches)
partial = simulate_metapop(0.3, n_years, n_patches)
connected = simulate_metapop(0.8, n_years, n_patches)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Occupied patches over time
ax1.set_facecolor('#111827')
ax1.plot(isolated[0], color='#ef4444', linewidth=2, label='Isolated (no corridors)')
ax1.plot(partial[0], color='#f59e0b', linewidth=2, label='Partial connectivity')
ax1.plot(connected[0], color='#22c55e', linewidth=2, label='Well-connected')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Occupied patches (out of 8)', color='white')
ax1.set_title('Metapopulation Persistence', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Total population
ax2.set_facecolor('#111827')
ax2.plot(isolated[1], color='#ef4444', linewidth=2, label='Isolated')
ax2.plot(partial[1], color='#f59e0b', linewidth=2, label='Partial')
ax2.plot(connected[1], color='#22c55e', linewidth=2, label='Connected')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Total population', color='white')
ax2.set_title('Total Elephant Population Over Time', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("After 200 years:")
print(f"  Isolated: {isolated[0][-1]} patches occupied, pop={isolated[1][-1]:.0f}")
print(f"  Partial:  {partial[0][-1]} patches occupied, pop={partial[1][-1]:.0f}")
print(f"  Connected: {connected[0][-1]} patches occupied, pop={connected[1][-1]:.0f}")
print()
print("Connectivity doesn't prevent local extinctions — it enables recovery.")
print("The rescue effect: immigrants from healthy patches repopulate empty ones.")`,
      challenge: 'Add a catastrophic event at year 100 that empties 5 of the 8 patches simultaneously (wildfire, disease). How quickly does each scenario recover? This tests resilience — the ability to bounce back from shocks.',
      successHint: 'Metapopulation theory is the scientific foundation for wildlife corridors. It proves mathematically that connectivity between habitat patches is as important as the size of the patches themselves.',
    },
    {
      title: 'Human-elephant conflict — living with giants',
      concept: `When elephants and humans share a landscape, conflict is inevitable. In India, ~500 people and ~100 elephants die each year from human-elephant conflict.

Types of conflict:
- **Crop raiding**: elephants eat/destroy rice, sugarcane, banana crops (one elephant can destroy ₹50,000 worth in a night)
- **Property damage**: elephants break fences, walls, granaries
- **Human injury/death**: elephants attack when surprised or cornered
- **Elephant death**: retaliation poisoning, electrocution from illegal fences, train collisions

Solutions being implemented:
- **Early warning systems**: GPS collars + SMS alerts when elephants approach villages
- **Physical barriers**: elephant-proof trenches, bee-fence deterrents (elephants fear bees!)
- **Crop insurance**: compensation for farmers who lose crops
- **Land-use planning**: keeping corridors clear, growing non-palatable crops near forest edges
- **Community-based conservation**: villages earn from eco-tourism, making elephants an asset rather than a threat`,
      analogy: 'Human-elephant conflict is like traffic at a busy intersection. The "cars" (elephants) and "pedestrians" (farmers) both need to use the same space. Without traffic lights (management measures), collisions happen. The solution isn\'t to ban cars or pedestrians — it\'s to redesign the intersection so both can use it safely.',
      storyConnection: 'The story\'s central conflict is a village blocking an elephant corridor. The resolution — creating a safe passage — mirrors real-world solutions. The key insight is that the elephants aren\'t the problem. The problem is a landscape design that forces elephants and humans into the same space without management measures.',
      checkQuestion: 'A farmer suggests poisoning the elephants to protect crops. Why is this both unethical AND bad economics?',
      checkAnswer: 'Ethically: elephants are endangered — every death threatens the species. Economically: (1) Dead elephants destroy eco-tourism revenue (one elephant generates ~₹50 lakh/year in tourism revenue vs. ₹50,000 in crop damage). (2) Poisoning doesn\'t solve the underlying problem — more elephants will come because the corridor/habitat issue remains. (3) International reputation damage can affect trade and aid. (4) Poison kills non-target animals too (birds, cattle). Coexistence pays better than extermination.',
      codeIntro: 'Map human-elephant conflict hotspots and model the effectiveness of different mitigation strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a landscape with forest, farmland, and conflict zones
grid_size = 50
landscape = np.zeros((grid_size, grid_size))

# Forest patches
landscape[5:20, 5:20] = 1    # Forest A
landscape[30:45, 30:45] = 1  # Forest B

# Corridor between them
for i in range(20, 30):
    for j in range(max(5, i-5), min(45, i+5)):
        landscape[i, j] = 0.5  # corridor zone

# Farmland = everything else (0)
# Villages near forest edges
villages = [(22, 15), (25, 25), (28, 35), (18, 22)]

# Simulate elephant movement and conflict
n_elephants = 20
n_days = 365
conflict_map = np.zeros((grid_size, grid_size))
elephant_visits = np.zeros((grid_size, grid_size))

for e in range(n_elephants):
    # Start in Forest A or B
    if np.random.random() < 0.5:
        pos = np.array([12.0, 12.0]) + np.random.normal(0, 3, 2)
    else:
        pos = np.array([37.0, 37.0]) + np.random.normal(0, 3, 2)

    for d in range(n_days):
        # Random walk with preference for forest
        step = np.random.normal(0, 1.5, 2)
        new_pos = pos + step
        new_pos = np.clip(new_pos, 0, grid_size - 1)

        ix, iy = int(new_pos[0]), int(new_pos[1])
        elephant_visits[ix, iy] += 1

        # Conflict occurs when elephant is on farmland (0) near village
        if landscape[ix, iy] == 0:
            for vx, vy in villages:
                if np.sqrt((ix - vx)**2 + (iy - vy)**2) < 5:
                    conflict_map[ix, iy] += 1

        pos = new_pos

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Landscape with conflict overlay
ax1.set_facecolor('#111827')
ax1.imshow(landscape.T, origin='lower', cmap='Greens', alpha=0.5, extent=[0, grid_size, 0, grid_size])
conflict_masked = np.ma.masked_where(conflict_map == 0, conflict_map)
ax1.imshow(conflict_masked.T, origin='lower', cmap='Reds', alpha=0.7, extent=[0, grid_size, 0, grid_size])
for vx, vy in villages:
    ax1.plot(vx, vy, 's', color='#f59e0b', markersize=12)
    ax1.annotate('Village', xy=(vx, vy), xytext=(vx+2, vy+2), color='#f59e0b', fontsize=8)
ax1.set_title('Human-Elephant Conflict Hotspots (red)', color='white', fontsize=13)
ax1.set_xlabel('km', color='white')
ax1.set_ylabel('km', color='white')
ax1.tick_params(colors='gray')

# Mitigation strategies comparison
strategies = ['No action', 'SMS alerts', 'Bee fences', 'Crop buffer', 'Corridor\\nrestoration', 'Combined']
conflict_reduction = [0, 30, 45, 35, 60, 85]  # % reduction
cost_per_year = [0, 2, 8, 5, 15, 25]  # lakhs

ax2.set_facecolor('#111827')
bar_colors = ['#ef4444', '#f59e0b', '#eab308', '#3b82f6', '#22c55e', '#a855f7']
bars = ax2.bar(range(len(strategies)), conflict_reduction, color=bar_colors, width=0.6)
ax2.set_xticks(range(len(strategies)))
ax2.set_xticklabels(strategies, color='gray', fontsize=9)
ax2.set_ylabel('Conflict reduction (%)', color='white')
ax2.set_title('Mitigation Strategy Effectiveness', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, cost in zip(bars, cost_per_year):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
             f'₹{cost}L/yr', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

total_conflicts = np.sum(conflict_map)
print(f"Total conflict events (1 year): {total_conflicts:.0f}")
print(f"Conflict hotspots: near villages in corridor zone")
print()
print("Strategy cost-effectiveness:")
for s, r, c in zip(strategies, conflict_reduction, cost_per_year):
    if c > 0:
        eff = r / c
        print(f"  {s}: {r}% reduction at ₹{c}L/yr ({eff:.1f}% per lakh)")`,
      challenge: 'The most effective single strategy is corridor restoration (60% reduction). But it\'s also the most expensive. Calculate the break-even: if crop damage costs ₹20 lakhs/year, how many years until corridor restoration pays for itself?',
      successHint: 'Human-elephant conflict is solvable — but it requires data (GPS tracking), theory (metapopulation, corridor design), and practical solutions (barriers, alerts, compensation). The story\'s message of coexistence isn\'t just idealistic — it\'s the most economically rational approach.',
    },
    {
      title: 'Connectivity modeling — designing optimal corridor networks',
      concept: `Given limited resources, where should we build corridors? **Circuit theory** and **least-cost path analysis** answer this by modeling how animals move through landscapes.

**Least-cost path**: each landscape cell has a "resistance" (forest = low, farmland = medium, highway = high, city = impassable). The algorithm finds the path between two habitat patches that minimizes total resistance.

**Circuit theory** (McRae 2006): models the landscape as an electrical circuit. Habitat patches are nodes, landscape cells are resistors. Current flow between nodes shows where animals are most likely to move. Multiple corridors appear naturally — not just one "best" path.

Why circuit theory is better:
- Least-cost path gives ONE path (unrealistic — animals don't all take the same route)
- Circuit theory gives a flow FIELD (animals take many routes, some more popular than others)
- It identifies **pinch points** — narrow spots where all flow is forced through a bottleneck

Assam's elephant corridors have been mapped using these methods, identifying the 101 most critical connections.`,
      analogy: 'Least-cost path is like Google Maps giving you ONE driving route. Circuit theory is like a traffic flow map showing where ALL cars go — revealing not just the best route but the bottlenecks where congestion is worst. For conservation, pinch points (bottlenecks) are where corridor protection is most urgent.',
      storyConnection: 'The village in the story sits at a pinch point — the narrowest part of the corridor between two forests. This is exactly where conflict is highest and where protection matters most. Circuit theory would have identified this village as a critical bottleneck decades before the conflict escalated.',
      checkQuestion: 'You have ₹10 crore to protect elephant corridors. Should you protect: (A) 10 km of wide, easy corridor, or (B) 2 km at a critical pinch point?',
      checkAnswer: 'Almost always (B) — the pinch point. A corridor is only as strong as its weakest point. Protecting 10 km of already-functional corridor adds marginal value. Protecting 2 km at a pinch point can save the entire corridor network. This is the conservation equivalent of "a chain is only as strong as its weakest link." Circuit theory identifies which links are weakest.',
      codeIntro: 'Build a simple resistance landscape and find the least-cost corridor between two habitat patches.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a resistance landscape
grid_size = 60
resistance = np.ones((grid_size, grid_size)) * 5  # default: farmland

# Forest patches (low resistance)
resistance[5:20, 5:20] = 1
resistance[40:55, 40:55] = 1

# Villages (high resistance)
for vx, vy in [(25, 20), (30, 30), (35, 35)]:
    resistance[vx-2:vx+2, vy-2:vy+2] = 50

# River (medium-high resistance but crossable)
resistance[28:32, :] = 20

# Road (high resistance)
resistance[:, 25:27] = 30

# Simple least-cost path using dynamic programming (simplified Dijkstra)
# From patch A center (12,12) to patch B center (47,47)
start = (12, 12)
end = (47, 47)

# Simplified: accumulated cost from start
cost = np.full((grid_size, grid_size), np.inf)
cost[start] = 0
visited = np.zeros((grid_size, grid_size), dtype=bool)

# Simple wavefront propagation
for _ in range(grid_size * grid_size):
    # Find unvisited cell with minimum cost
    temp_cost = np.where(visited, np.inf, cost)
    if np.all(np.isinf(temp_cost)):
        break
    current = np.unravel_index(np.argmin(temp_cost), cost.shape)
    if current == end:
        break
    visited[current] = True

    # Update neighbors
    for dx, dy in [(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)]:
        nx, ny = current[0]+dx, current[1]+dy
        if 0 <= nx < grid_size and 0 <= ny < grid_size and not visited[nx, ny]:
            dist = np.sqrt(dx**2 + dy**2)
            new_cost = cost[current] + resistance[nx, ny] * dist
            if new_cost < cost[nx, ny]:
                cost[nx, ny] = new_cost

# Simulate current flow (simplified: random walks weighted by inverse resistance)
n_walkers = 5000
flow_map = np.zeros((grid_size, grid_size))

for _ in range(n_walkers):
    pos = list(start)
    for step in range(500):
        if abs(pos[0] - end[0]) < 3 and abs(pos[1] - end[1]) < 3:
            break
        ix, iy = int(pos[0]), int(pos[1])
        flow_map[ix, iy] += 1

        # Move toward end with resistance weighting
        neighbors = []
        weights = []
        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
            nx, ny = ix+dx, iy+dy
            if 0 <= nx < grid_size and 0 <= ny < grid_size:
                # Prefer low resistance and toward goal
                goal_pull = 1 / (1 + np.sqrt((nx-end[0])**2 + (ny-end[1])**2))
                w = goal_pull / resistance[nx, ny]
                neighbors.append((nx, ny))
                weights.append(w)

        if neighbors:
            weights = np.array(weights)
            weights /= weights.sum()
            chosen = np.random.choice(len(neighbors), p=weights)
            pos = list(neighbors[chosen])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Resistance landscape
ax1.set_facecolor('#111827')
im = ax1.imshow(resistance.T, origin='lower', cmap='RdYlGn_r', extent=[0, grid_size, 0, grid_size])
ax1.plot(start[0], start[1], '*', color='white', markersize=15, label='Start (Forest A)')
ax1.plot(end[0], end[1], '*', color='white', markersize=15, label='End (Forest B)')
ax1.set_title('Landscape Resistance', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
cbar = plt.colorbar(im, ax=ax1)
cbar.set_label('Resistance', color='white')
cbar.ax.tick_params(colors='gray')

# Current flow (corridor identification)
ax2.set_facecolor('#111827')
flow_masked = np.ma.masked_where(flow_map < 5, flow_map)
ax2.imshow(resistance.T, origin='lower', cmap='Greys', alpha=0.3, extent=[0, grid_size, 0, grid_size])
ax2.imshow(flow_masked.T, origin='lower', cmap='hot', alpha=0.8, extent=[0, grid_size, 0, grid_size])
ax2.plot(start[0], start[1], '*', color='#22c55e', markersize=15)
ax2.plot(end[0], end[1], '*', color='#22c55e', markersize=15)
ax2.set_title('Corridor Flow Map (pinch points in yellow)', color='white', fontsize=13)
ax2.tick_params(colors='gray')

# Identify pinch point
pinch = np.where(flow_map == flow_map[20:40, 20:40].max())
if len(pinch[0]) > 0:
    ax2.annotate('Pinch point!', xy=(pinch[0][0], pinch[1][0]),
                 xytext=(pinch[0][0]+5, pinch[1][0]+5),
                 color='#f59e0b', fontsize=12, fontweight='bold',
                 arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Corridor analysis:")
print(f"  Landscape: {grid_size}x{grid_size} km grid")
print(f"  Forest A: 15x15 km, Forest B: 15x15 km")
print(f"  Barriers: 3 villages, 1 river, 1 road")
print(f"  Simulated {n_walkers} animal movements")
print()
print("The flow map reveals:")
print("  - Multiple possible routes (not just one)")
print("  - Pinch points where all routes converge")
print("  - These pinch points are conservation PRIORITIES")`,
      challenge: 'Add an "overpass" at the road crossing (set resistance back to 5 at one point). How much does this increase flow through the corridor? A single wildlife crossing at the right location can transform connectivity.',
      successHint: 'From habitat fragmentation to corridor design to GPS tracking to metapopulations to conflict management to connectivity modeling — you\'ve built a complete toolkit for elephant conservation. Every concept connects: GPS data feeds connectivity models, which identify corridors, which inform metapopulation management, which reduces conflict. Conservation is systems thinking.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Wildlife Corridors & Habitat Connectivity</span>
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
