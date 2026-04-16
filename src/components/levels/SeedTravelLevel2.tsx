import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SeedTravelLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Species distribution modeling — predicting where plants can live',
      concept: `**Species Distribution Modeling (SDM)** uses statistical relationships between known species locations and environmental conditions to predict where else a species could survive.

The process:
1. **Occurrence data**: GPS coordinates where the species has been found
2. **Environmental variables**: Temperature, rainfall, soil type, elevation at each point
3. **Statistical model**: Find the environmental "envelope" defining the species' niche
4. **Prediction**: Map everywhere on Earth matching those conditions

Common algorithms include **MaxEnt** (Maximum Entropy), **Random Forest**, and **GLM/GAM**. SDMs predict POTENTIAL distribution (where conditions suit), not ACTUAL distribution (where the species exists). A species may be absent from suitable habitat because it hasn't dispersed there yet.`,
      analogy: 'SDM is like online dating for plants and habitats. You create a "profile" for the species (likes: warm temperatures, moderate rain). Then you search the planet for matching "habitats." Just because a match exists doesn\'t mean the species lives there — it might not have "swiped right" yet (hasn\'t dispersed there).',
      storyConnection: 'The seed in our story traveled to find suitable ground. SDMs tell us where that suitable ground IS — before the seed arrives. If we could model every species\' distribution and overlay it with dispersal ability, we could predict the future geography of every forest on Earth.',
      checkQuestion: 'An SDM predicts a tropical tree could survive in southern Florida based on climate. Does that mean it WILL grow there?',
      checkAnswer: 'Not necessarily. SDMs predict climate suitability, but many other factors matter: (1) Dispersal barrier — the Pacific Ocean separates regions. (2) Biotic interactions — different competitors, herbivores, pollinators. (3) Soil differences. (4) Missing mutualists (mycorrhizal fungi). SDMs answer "could it survive?" not "will it thrive?"',
      codeIntro: 'Build a simple species distribution model using environmental variables.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
grid = 100
x = np.linspace(0, 100, grid)
y = np.linspace(0, 100, grid)
X, Y = np.meshgrid(x, y)

temperature = 30 - Y * 0.3 + np.random.normal(0, 1, (grid, grid))
rainfall = 500 + X * 15 + np.random.normal(0, 50, (grid, grid))

temp_suit = np.exp(-((temperature - 22)**2) / (2 * 4**2))
rain_suit = np.exp(-((rainfall - 1100)**2) / (2 * 300**2))
suitability = temp_suit * rain_suit

n_occ = 50
prob = suitability / suitability.sum()
flat_idx = np.random.choice(grid * grid, n_occ, p=prob.flatten())
occ_y, occ_x = np.unravel_index(flat_idx, (grid, grid))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
im1 = ax1.imshow(suitability, cmap='RdYlGn', extent=[0, 100, 0, 100], origin='lower', vmin=0, vmax=1)
plt.colorbar(im1, ax=ax1, label='Habitat suitability')
ax1.scatter(occ_x, occ_y, s=20, c='white', edgecolors='black', linewidth=0.5, zorder=5)
ax1.set_title('Predicted Suitable Habitat', color='white', fontsize=13)
ax1.set_xlabel('Longitude', color='white'); ax1.set_ylabel('Latitude', color='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
occ_temps = temperature[occ_y, occ_x]
occ_rains = rainfall[occ_y, occ_x]
ax2.scatter(temperature.flatten(), rainfall.flatten(), s=1, alpha=0.1, color='gray', label='All habitat')
ax2.scatter(occ_temps, occ_rains, s=30, color='#22c55e', edgecolors='white', linewidth=0.5, label='Occurrences', zorder=5)
from matplotlib.patches import Ellipse
ellipse = Ellipse((22, 1100), 8, 600, fill=False, color='#f59e0b', linewidth=2, linestyle='--', label='Niche')
ax2.add_patch(ellipse)
ax2.set_xlabel('Temperature (C)', color='white'); ax2.set_ylabel('Rainfall (mm)', color='white')
ax2.set_title('Environmental Niche Space', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

suitable_pct = np.sum(suitability > 0.5) / suitability.size * 100
print(f"SDM results:")
print(f"  Occurrences: {n_occ}")
print(f"  Preferred temp: 18-26C, rainfall: 800-1400mm")
print(f"  Suitable habitat: {suitable_pct:.0f}% of area")`,
      challenge: 'Add climate change: temperature increases by 3C. How does suitable habitat shift? Does the species gain or lose area?',
      successHint: 'SDMs connect environmental science, statistics, and geography. They\'re the primary tool for predicting how climate change will reshape the living world.',
    },
    {
      title: 'Island biogeography — the theory that explains species on islands',
      concept: `The **Theory of Island Biogeography** (MacArthur & Wilson, 1967) explains species counts as a balance between immigration (new species arriving, decreases as species accumulate) and extinction (species dying out, increases with crowding).

Two key predictions:
1. **Larger islands have more species** (lower extinction rate)
2. **Closer islands have more species** (higher immigration rate)

The species-area relationship: **S = C * A^z** (z typically 0.2-0.35)

This applies beyond islands: mountaintops, forest fragments, nature reserves surrounded by development. For seed dispersal: remote islands are dominated by wind- and bird-dispersed plants, since only long-distance mechanisms can reach them.`,
      analogy: 'Island biogeography is like a nightclub. Immigration is people entering, extinction is people leaving. A big club (large island) has more room so fewer leave. A club near a busy street (close island) gets more foot traffic. The equilibrium crowd depends on both door size and floor area.',
      storyConnection: 'Our seed traveled to an island. Island biogeography tells us that arrival is part of a statistical process. On a small, remote island, the seed is a rare, precious event. On a large, close island, it\'s routine. The story\'s journey matters most to small, remote islands.',
      checkQuestion: 'After Krakatoa\'s 1883 eruption sterilized the island, how long did recolonization take?',
      checkAnswer: 'By 1934 (51 years): ~300 plant species. By 2014 (~130 years): ~400 species (near equilibrium). Recolonization was logarithmic: fast at first (ferns, grasses), slowing as niches filled. The sequence mirrors dispersal ability — wind-dispersed first, then bird-dispersed trees.',
      codeIntro: 'Model the species-area relationship and island equilibrium dynamics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

C, z = 20, 0.25
areas = np.logspace(-1, 4, 200)
species = C * areas ** z

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.loglog(areas, species, color='#22c55e', linewidth=2)
islands = [('Small islet', 1, '#ef4444'), ('Majuli', 1250, '#3b82f6'), ('Borneo', 743000, '#a855f7')]
for name, area, color in islands:
    s = C * area ** z
    ax1.plot(area, s, 'o', color=color, markersize=10)
    ax1.annotate(f'{name}\
({s:.0f} spp)', xy=(area, s), xytext=(5, 10),
                 textcoords='offset points', color=color, fontsize=9)
ax1.set_xlabel('Island area (km2)', color='white')
ax1.set_ylabel('Number of species', color='white')
ax1.set_title('Species-Area Relationship', color='white', fontsize=13)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
P = 200
S_range = np.linspace(0, P, 200)
imm_near = 10 * (1 - S_range / P)
imm_far = 4 * (1 - S_range / P)
ext_large = 0.02 * S_range
ext_small = 0.05 * S_range
ax2.plot(S_range, imm_near, color='#22c55e', linewidth=2, label='Immigration (near)')
ax2.plot(S_range, imm_far, color='#3b82f6', linewidth=2, label='Immigration (far)')
ax2.plot(S_range, ext_large, color='#f59e0b', linewidth=2, linestyle='--', label='Extinction (large)')
ax2.plot(S_range, ext_small, color='#ef4444', linewidth=2, linestyle='--', label='Extinction (small)')

for imm, ext, label, color in [(imm_near, ext_large, 'Near+Large', '#22c55e'),
                                 (imm_far, ext_small, 'Far+Small', '#ef4444')]:
    idx = np.argmin(np.abs(imm - ext))
    ax2.plot(S_range[idx], imm[idx], 'o', color=color, markersize=10)
    ax2.annotate(f'{label}: S*={S_range[idx]:.0f}', xy=(S_range[idx], imm[idx]),
                 xytext=(10, 10), textcoords='offset points', color=color, fontsize=9)

ax2.set_xlabel('Species on island', color='white')
ax2.set_ylabel('Rate', color='white')
ax2.set_title('Equilibrium: Immigration = Extinction', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Island Biogeography predictions:")
print("  Larger islands: more species (lower extinction)")
print("  Closer islands: more species (higher immigration)")
print("  Remote islands: dominated by wind/bird-dispersed plants")`,
      challenge: 'Model habitat fragmentation: a 1000 km2 forest cut into 10 fragments of 100 km2. Which supports more total species: one large or several small? (The SLOSS debate.)',
      successHint: 'Island biogeography is one of ecology\'s most influential theories. It explains species patterns on islands, mountaintops, and habitat fragments.',
    },
    {
      title: 'Colonization dynamics — how new populations establish',
      concept: `When a seed arrives at a new location, colonization depends on three phases:

1. **Arrival**: The seed reaches the site (dispersal)
2. **Establishment**: Germination and survival to reproduction (the bottleneck)
3. **Population growth**: Logistic growth: dN/dt = r*N*(1 - N/K)

**Propagule pressure**: More seeds arriving = higher probability of at least one succeeding. Wind-dispersed species (many tiny seeds) are better colonizers than large-seeded species.

**Founder effect**: A new population from few individuals has reduced genetic diversity, limiting adaptation.`,
      analogy: 'Colonization is like starting a restaurant in a new city. Phase 1: you get there. Phase 2: you find a location, pass inspections, get customers. Phase 3: you become profitable. Most restaurants fail in Phase 2 — and most seeds do too.',
      storyConnection: 'The seed didn\'t just travel — it had to land, germinate, grow, and reproduce. The thousand-mile journey is only the beginning. Colonization is the harder part.',
      checkQuestion: 'Why do invasive species succeed while most native species fail to expand?',
      checkAnswer: 'Invasives succeed via: (1) High propagule pressure (trade delivers millions). (2) Enemy release (leave pathogens behind). (3) Pre-adaptation to disturbed habitats. (4) Generalist traits. Native species face the opposite: low propagule pressure, full enemy suites, specialist requirements.',
      codeIntro: 'Simulate colonization from seed arrival through establishment to population growth.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def colonize(n_seeds, p_germ, p_surv, r, K, years):
    germinated = np.random.binomial(n_seeds, p_germ)
    survived = np.random.binomial(germinated, p_surv)
    if survived == 0:
        return np.zeros(years), False
    N = np.zeros(years)
    N[0] = survived
    for t in range(1, years):
        growth = r * N[t-1] * (1 - N[t-1] / K)
        N[t] = max(0, N[t-1] + growth + np.random.normal(0, max(1, N[t-1] * 0.1)))
    return N, N[-1] > 10

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
success = 0
for i in range(50):
    N, ok = colonize(100, 0.3, 0.1, 0.3, 500, 50)
    color = '#22c55e' if ok else '#ef4444'
    ax1.plot(range(50), N, color=color, linewidth=1, alpha=0.4 if ok else 0.1)
    if ok: success += 1
ax1.set_xlabel('Years', color='white'); ax1.set_ylabel('Population', color='white')
ax1.set_title(f'Colonization Attempts ({success}/50 succeeded)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
seed_counts = np.arange(1, 201, 5)
success_rates = []
for n in seed_counts:
    ok_count = sum(1 for _ in range(200) if colonize(n, 0.3, 0.1, 0.3, 500, 50)[1])
    success_rates.append(ok_count / 200 * 100)
ax2.plot(seed_counts, success_rates, color='#22c55e', linewidth=2)
ax2.fill_between(seed_counts, success_rates, alpha=0.15, color='#22c55e')
ax2.set_xlabel('Number of seeds arriving', color='white')
ax2.set_ylabel('Colonization success (%)', color='white')
ax2.set_title('Propagule Pressure: More Seeds = Higher Success', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Most colonization attempts FAIL.")
print("Success requires: enough seeds, suitable habitat, and luck.")
print("This is why invasive species need repeated introductions.")`,
      challenge: 'Add an Allee effect: below population size 10, reproduction drops (not enough mates). How does this change the minimum propagule pressure needed?',
      successHint: 'Colonization dynamics is population ecology in action. Understanding barriers to establishment explains why some species are everywhere and others are restricted.',
    },
    {
      title: 'Invasive species — when dispersal goes wrong',
      concept: `An **invasive species** is a non-native organism that spreads aggressively, causing harm. Only ~1% of introductions establish, and ~1% of those become invasive (the "tens rule").

**Why invasives succeed**: Enemy release, novel weapons (allelopathy), rapid reproduction, generalist traits, human-disturbed habitats.

**Famous invasives**: Water hyacinth (doubles in 2 weeks, blocks waterways), Kudzu (grows 30 cm/day), Lantana (most widespread invasive plant globally).

**Global cost**: $1.3 TRILLION per year in damages (Zenni et al., 2024).`,
      analogy: 'An invasive species is like a tech startup entering a market with no regulations. No competitors adapted to it, no natural enemies, and the infrastructure (disturbed habitats) is built for it. It\'s unfair competition.',
      storyConnection: 'Not all seed journeys are benign. When the "wrong" seed reaches the "wrong" ground, the result is invasion. The same dispersal mechanisms that build biodiversity can also destroy it.',
      checkQuestion: 'Water hyacinth was introduced as an ornamental for its purple flowers. How could this have been prevented?',
      checkAnswer: 'Biosecurity screening: assess (1) reproductive rate, (2) dispersal ability, (3) environmental tolerance, (4) natural enemies in target country, (5) invasive relatives elsewhere. Water hyacinth fails ALL five. Prevention is 100x cheaper than control.',
      codeIntro: 'Model invasive species spread and compare control strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
grid = 50; years = 30; K = 100; r = 0.5; D = 0.3
pop = np.zeros((grid, grid))
pop[25, 25] = 50
total_pop = [np.sum(pop)]

for year in range(years):
    pop += r * pop * (1 - pop / K)
    new_pop = pop.copy()
    for i in range(1, grid-1):
        for j in range(1, grid-1):
            new_pop[i,j] = max(0, pop[i,j] + D * (pop[i+1,j]+pop[i-1,j]+pop[i,j+1]+pop[i,j-1]-4*pop[i,j]))
    if np.random.random() < 0.1:
        rx, ry = np.random.randint(0, grid, 2)
        new_pop[rx, ry] += np.random.exponential(10)
    pop = np.clip(new_pop, 0, K)
    total_pop.append(np.sum(pop))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
im = ax1.imshow(pop, cmap='YlOrRd', extent=[0, grid, 0, grid], origin='lower', vmin=0, vmax=K)
plt.colorbar(im, ax=ax1, label='Population density')
ax1.set_title(f'Invasion After {years} Years', color='white', fontsize=13)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.plot(range(years + 1), total_pop, color='#ef4444', linewidth=2)
ax2.fill_between(range(years + 1), total_pop, alpha=0.15, color='#ef4444')
ax2.set_xlabel('Years', color='white'); ax2.set_ylabel('Total population', color='white')
ax2.set_title('Invasion Growth Curve', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

strategies = ['No control', 'Manual removal (yr 5)', 'Biocontrol (yr 5)', 'Early detection (yr 2)']
final_pct = [100, 70, 30, 5]
costs = [0, 50, 20, 5]
print("Control strategy comparison:")
for s, f, c in zip(strategies, final_pct, costs):
    print(f"  {s}: {f}% remaining, cost {c}M")
print("\
Early detection is 10x cheaper AND 10x more effective.")`,
      challenge: 'Add a biocontrol agent (predator) arriving in year 10. Does it also become invasive? (Cane toads in Australia were introduced as biocontrol.)',
      successHint: 'Invasive species are dispersal amplified by human transport. Understanding invasion dynamics is essential for biosecurity and conservation.',
    },
    {
      title: 'Seed viability over time — how long can a seed wait?',
      concept: `**Seed viability** varies enormously:

**Short-lived** (weeks): Willow, poplar — must germinate immediately.
**Medium-lived** (years-decades): Crop seeds (3-10 yr), weed seeds (20-50 yr in soil).
**Long-lived** (centuries-millennia): Sacred lotus (1,300 yr), date palm (2,000 yr "Methuselah"), Arctic lupine (claimed 10,000 yr).

**What determines viability?** Seed coat hardness, moisture content (dry = longer), temperature (cold = longer), DNA repair mechanisms.

**Harrington's rules**: Every 5C decrease in storage temperature doubles lifespan. Every 1% decrease in moisture content doubles lifespan.`,
      analogy: 'Seed viability is like food preservation. Fresh fruit (short-lived seeds) lasts days. Canned food (medium) lasts years. Freeze-dried (long-lived) lasts decades. Honey was found edible in 3,000-year-old Egyptian tombs. Seeds use similar strategies.',
      storyConnection: 'Some seeds travel through TIME, not just space. A 1,300-year-old lotus seed germinating is a message from the Tang Dynasty. The story\'s seed didn\'t just travel far; it may have traveled long.',
      checkQuestion: 'The Svalbard Vault stores seeds at -18C. If a lotus seed survives 1,300 years at room temperature, how long at -18C?',
      checkAnswer: 'Using Harrington\'s rule: 38C drop = ~7.6 doublings. 1,300 * 2^7.6 = ~250,000 years (theoretical). Practical limits (radiation, crystal damage) would cap this, but centuries to millennia is realistic.',
      codeIntro: 'Model seed viability decay under different storage conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def viability(t, temp, moisture, seed_type):
    base_hl = {'normal': 5, 'hardy': 50, 'lotus': 500}[seed_type]
    temp_factor = 2 ** ((20 - temp) / 5)
    moist_factor = 2 ** ((12 - max(moisture, 5)) / 1)
    hl = base_hl * temp_factor * moist_factor
    return 100 * np.exp(-0.693 * t / hl), hl

time = np.linspace(0, 1000, 1000)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
for stype, color, label in [('normal', '#ef4444', 'Normal crop'),
                              ('hardy', '#f59e0b', 'Hardy weed'),
                              ('lotus', '#22c55e', 'Sacred lotus')]:
    v, hl = viability(time, 20, 12, stype)
    ax1.plot(time, v, color=color, linewidth=2, label=f'{label} (t1/2={hl:.0f}yr)')
ax1.axhline(50, color='gray', linestyle=':', linewidth=1)
ax1.set_xlabel('Years', color='white'); ax1.set_ylabel('Viability (%)', color='white')
ax1.set_title('Seed Viability at Room Temperature', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
for temp, color in [(35, '#ef4444'), (20, '#f59e0b'), (5, '#3b82f6'), (-18, '#22c55e')]:
    v, hl = viability(time, temp, 12, 'normal')
    ax2.plot(time, v, color=color, linewidth=2, label=f'{temp}C (t1/2={hl:.0f}yr)')
ax2.set_xlabel('Years', color='white'); ax2.set_ylabel('Viability (%)', color='white')
ax2.set_title('Temperature Effect on Crop Seeds', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Seed viability at different temperatures:")
for stype, label in [('normal', 'Normal crop'), ('lotus', 'Sacred lotus')]:
    _, hl_room = viability(np.array([0]), 20, 12, stype)
    _, hl_vault = viability(np.array([0]), -18, 8, stype)
    print(f"  {label}: room t1/2={hl_room:.0f}yr, Svalbard t1/2={hl_vault:,.0f}yr")`,
      challenge: 'Calculate how often Svalbard seeds need regeneration to stay above 85% viability. Compare wheat (t1/2 ~200 yr at -18C) vs. lettuce (t1/2 ~30 yr).',
      successHint: 'Seed viability connects biochemistry to conservation. Understanding how long seeds survive determines strategy for seed banks, restoration, and even space agriculture.',
    },
    {
      title: 'Conservation genetics of fragmented populations — when dispersal is blocked',
      concept: `When habitat is fragmented, isolated populations face:

1. **Genetic drift**: Random loss of rare alleles in small populations
2. **Inbreeding depression**: Mating with relatives exposes harmful recessive alleles
3. **Loss of adaptive potential**: Less diversity = can't adapt to change

**Minimum viable population (MVP)**: 500-5,000 for short-term, >10,000 for long-term.

**Solutions**: Corridors connecting fragments, assisted gene flow (moving seeds between populations), seed banks, habitat restoration. This brings seed dispersal full circle: the mechanisms that built biodiversity are now disrupted by fragmentation. Conservation genetics restores dispersal — and with it, genetic health.`,
      analogy: 'Fragmented populations are like small towns with no roads. People can\'t travel, meet new partners, or bring new ideas (genes). Building a highway (corridor) restores flow. Conservation corridors do the same for plant genes.',
      storyConnection: 'What if the seed in our story couldn\'t travel? What if highways and farms blocked every route? The seed would be trapped, its population isolated, its genetic future narrowed. Conservation genetics ensures seeds CAN still travel in a fragmented world.',
      checkQuestion: 'A forest fragment has 100 trees with only 40% of mainland genetic diversity. What should a conservation manager do?',
      checkAnswer: 'Step 1: Assess cause (drift or founder effect). Step 2: Introduce seeds from mainland (assisted gene flow — even 1-2 migrants/generation restores diversity). Step 3: Be cautious of outbreeding depression. Step 4: Create corridors for natural gene flow. Step 5: Monitor diversity every 5-10 years.',
      codeIntro: 'Simulate genetic diversity loss in fragmented vs. connected populations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_genetics(n_pops, pop_size, n_alleles, migration, gens):
    freqs = np.random.dirichlet(np.ones(n_alleles), n_pops)
    diversity = []
    for gen in range(gens):
        new_freqs = np.zeros_like(freqs)
        for p in range(n_pops):
            counts = np.random.multinomial(2 * pop_size, freqs[p])
            new_freqs[p] = counts / (2 * pop_size)
        if migration > 0:
            pool = np.mean(new_freqs, axis=0)
            for p in range(n_pops):
                new_freqs[p] = (1 - migration) * new_freqs[p] + migration * pool
        freqs = new_freqs
        he = np.mean(1 - np.sum(freqs ** 2, axis=1))
        diversity.append(he)
    return diversity

gens = 200
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
div_conn = simulate_genetics(5, 100, 10, 0.05, gens)
div_frag = simulate_genetics(5, 100, 10, 0.0, gens)
div_small = simulate_genetics(5, 20, 10, 0.0, gens)
div_rest = simulate_genetics(5, 100, 10, 0.0, 100) + simulate_genetics(5, 100, 10, 0.05, 100)

ax1.plot(range(gens), div_conn, color='#22c55e', linewidth=2, label='Connected (5% migration)')
ax1.plot(range(gens), div_frag, color='#ef4444', linewidth=2, label='Fragmented (no migration)')
ax1.plot(range(gens), div_small, color='#f59e0b', linewidth=2, label='Small fragments (N=20)')
ax1.plot(range(200), div_rest, color='#3b82f6', linewidth=2, label='Corridor restored at gen 100')
ax1.axvline(100, color='#3b82f6', linestyle=':', linewidth=1, alpha=0.5)
ax1.set_xlabel('Generations', color='white')
ax1.set_ylabel('Genetic diversity (He)', color='white')
ax1.set_title('Connected vs Fragmented Populations', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
pop_sizes = [10, 25, 50, 100, 250, 500, 1000]
final_div = []
for ps in pop_sizes:
    d = simulate_genetics(1, ps, 10, 0, 100)
    final_div.append(d[-1])
ax2.plot(pop_sizes, final_div, 'o-', color='#a855f7', linewidth=2, markersize=8)
ax2.axhline(0.5, color='#f59e0b', linestyle='--', linewidth=1, label='50% threshold')
ax2.axvline(500, color='#22c55e', linestyle=':', linewidth=1, label='MVP estimate')
ax2.set_xlabel('Population size', color='white')
ax2.set_ylabel('Diversity after 100 generations', color='white')
ax2.set_title('Population Size vs Diversity Retention', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Conservation genetics findings:")
print("  Connected populations retain diversity")
print("  Fragmented populations lose diversity rapidly")
print("  Restoring corridors can reverse diversity loss")
print("  MVP of ~500 needed for short-term genetic health")
print()
print("From SDMs to island biogeography to colonization to")
print("invasive species to seed viability to conservation genetics —")
print("you've built a complete framework for how seeds shape")
print("the geography and genetics of life on Earth.")`,
      challenge: 'Model climate change + fragmentation: if suitable climate shifts 100 km north over 50 years, can a fragmented population "track" the climate? Compare connected vs. fragmented. This is the "dispersal debt" problem.',
      successHint: 'From species distribution modeling to island biogeography to colonization to invasive species to seed viability to conservation genetics — you\'ve built a complete framework for understanding how seed dispersal shapes the living world.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 seed dispersal foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecology and genetics simulations. Click to start.</p>
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