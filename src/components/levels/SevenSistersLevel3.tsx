import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SevenSistersLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: `Species-area relationships and island biogeography theory`,
      concept: `The species-area relationship (SAR) is one of ecology's most robust patterns: S = c * A^z, where S is species count, A is area, c is a constant, and z typically ranges 0.15-0.35. MacArthur and Wilson's island biogeography theory explains this through equilibrium between immigration and extinction rates.

For the Seven Sisters states (northeast India), each hill range acts like an island surrounded by lowland 'ocean.' Larger ranges support more species because they have more habitat diversity and larger populations (reducing extinction risk). More isolated ranges have fewer species because immigration is harder.

The z-value reveals the biogeographic context: z~0.15 for mainland samples (connected habitat), z~0.25 for continental islands (recently isolated), z~0.35 for oceanic islands (long-isolated). Northeast India's hill ranges typically show z~0.20-0.30, reflecting their partial isolation by major river valleys.`,
      analogy: `The species-area curve is like a party invitation list and room size. A small room (small area) can only comfortably hold a few guests (species). A ballroom holds many more. But doubling the room size does not double the guests — it adds some new ones while the original ones are still there. The power law captures this diminishing return.`,
      storyConnection: `The Seven Sisters states are a mosaic of hill ranges, each harboring unique species assemblages. Island biogeography explains why Meghalaya's Khasi Hills have different species than Nagaland's Patkai range — isolation and area create distinct ecological islands.`,
      checkQuestion: `Two hill ranges of the same area but different isolation levels have different species counts. Which has more and why?`,
      checkAnswer: `The less isolated range has more species. Immigration rate decreases with isolation (fewer colonizers arrive per year), so the equilibrium species number is lower for isolated ranges. Both ranges lose species at similar rates (extinction depends on area), but the connected one replaces them faster through immigration. This is the core prediction of island biogeography theory.`,
      codeIntro: `Model species-area relationships for northeast India hill ranges and test island biogeography predictions.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Hill ranges of northeast India (synthetic data based on real geography)
ranges = {
    'Khasi Hills': {'area': 8500, 'isolation': 15, 'elevation': 1800},
    'Garo Hills': {'area': 6200, 'isolation': 25, 'elevation': 1400},
    'Jaintia Hills': {'area': 3800, 'isolation': 20, 'elevation': 1600},
    'Patkai Range': {'area': 12000, 'isolation': 30, 'elevation': 2500},
    'Barail Range': {'area': 5500, 'isolation': 22, 'elevation': 1900},
    'Lushai Hills': {'area': 7800, 'isolation': 35, 'elevation': 2100},
    'Naga Hills': {'area': 9200, 'isolation': 28, 'elevation': 3000},
    'Manipur Hills': {'area': 6800, 'isolation': 32, 'elevation': 2600},
    'Tripura Hills': {'area': 3200, 'isolation': 40, 'elevation': 900},
    'Mikir Hills': {'area': 4500, 'isolation': 18, 'elevation': 1200},
}

# Species richness model: S = c * A^z * exp(-d*isolation)
c, z_exp = 5.0, 0.25
d_isolation = 0.01

areas = np.array([r['area'] for r in ranges.values()])
isolations = np.array([r['isolation'] for r in ranges.values()])
elevations = np.array([r['elevation'] for r in ranges.values()])
names = list(ranges.keys())

# Generate species counts
S_true = c * areas**z_exp * np.exp(-d_isolation * isolations)
S_observed = np.round(S_true + np.random.normal(0, 5, len(S_true))).astype(int)
S_observed = np.clip(S_observed, 10, 500)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Island Biogeography of Northeast India Hill Ranges', color='white', fontsize=14)

# Species-area curve
ax = axes[0,0]; ax.set_facecolor('#111827')
A_fit = np.logspace(np.log10(2000), np.log10(15000), 100)
S_fit = c * A_fit**z_exp
ax.loglog(A_fit, S_fit, color='#22c55e', linewidth=2, label=f'S = {c:.0f} * A^{z_exp}')
ax.scatter(areas, S_observed, c=isolations, cmap='YlOrRd', s=80, edgecolors='white', zorder=5)
for i, name in enumerate(names):
    ax.annotate(name.split()[0], (areas[i], S_observed[i]), xytext=(5,5),
               textcoords='offset points', color='white', fontsize=6)
ax.set_xlabel('Area (km2)', color='white'); ax.set_ylabel('Species Richness', color='white')
ax.set_title('Species-Area Relationship', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Fit z-value
ax = axes[0,1]; ax.set_facecolor('#111827')
log_A = np.log10(areas)
log_S = np.log10(S_observed)
coeffs = np.polyfit(log_A, log_S, 1)
z_fitted = coeffs[0]
c_fitted = 10**coeffs[1]
ax.scatter(log_A, log_S, color='#22c55e', s=60, edgecolors='white')
x_line = np.linspace(log_A.min(), log_A.max(), 100)
ax.plot(x_line, coeffs[0]*x_line + coeffs[1], '--', color='#f59e0b', linewidth=2,
        label=f'z = {z_fitted:.3f}, c = {c_fitted:.1f}')
ax.set_xlabel('log10(Area)', color='white'); ax.set_ylabel('log10(Species)', color='white')
ax.set_title(f'Fitted z = {z_fitted:.3f}', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Isolation effect
ax = axes[0,2]; ax.set_facecolor('#111827')
residuals = log_S - (coeffs[0]*log_A + coeffs[1])
ax.scatter(isolations, residuals, color='#ef4444', s=60, edgecolors='white')
iso_fit = np.polyfit(isolations, residuals, 1)
ax.plot(isolations, iso_fit[0]*isolations + iso_fit[1], '--', color='white', linewidth=1.5)
ax.set_xlabel('Isolation Index', color='white'); ax.set_ylabel('Residual (log S)', color='white')
ax.set_title('Isolation Effect on Residuals', color='white')
ax.tick_params(colors='gray')

# Immigration-extinction equilibrium
ax = axes[1,0]; ax.set_facecolor('#111827')
S_range = np.linspace(0, 200, 100)
for iso, col, lbl in [(15,'#22c55e','Low isolation'), (30,'#f59e0b','Medium'), (45,'#ef4444','High')]:
    I_rate = 100 * np.exp(-iso*0.02) * (1 - S_range/200)
    E_rate = 0.5 * S_range
    ax.plot(S_range, I_rate, color=col, linewidth=2, label=f'Immigration ({lbl})')
    ax.plot(S_range, E_rate, color=col, linewidth=2, linestyle='--')
    eq_S = S_range[np.argmin(np.abs(I_rate - E_rate))]
    ax.scatter([eq_S], [0.5*eq_S], s=100, color=col, zorder=5)
ax.set_xlabel('Species on Island', color='white'); ax.set_ylabel('Rate', color='white')
ax.set_title('Immigration-Extinction Equilibrium', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Elevation vs richness
ax = axes[1,1]; ax.set_facecolor('#111827')
ax.scatter(elevations, S_observed, c=areas, cmap='Greens', s=80, edgecolors='white')
ax.set_xlabel('Max Elevation (m)', color='white'); ax.set_ylabel('Species', color='white')
ax.set_title('Elevation Effect (color=area)', color='white')
ax.tick_params(colors='gray')

# Rank abundance for 3 ranges
ax = axes[1,2]; ax.set_facecolor('#111827')
for i, (col, lbl) in enumerate(zip(['#22c55e','#f59e0b','#ef4444'], [names[0],names[3],names[8]])):
    n_sp = S_observed[names.index(lbl)]
    abundances = np.random.zipf(1.5, n_sp)
    abundances = np.sort(abundances)[::-1] / abundances.sum()
    ax.semilogy(range(1, len(abundances)+1), abundances, 'o-', color=col, markersize=2,
               linewidth=1.5, label=lbl.split()[0])
ax.set_xlabel('Species Rank', color='white'); ax.set_ylabel('Relative Abundance', color='white')
ax.set_title('Rank-Abundance Curves', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Biogeography Analysis:")
print(f"  Fitted z-value: {z_fitted:.3f} (typical island range: 0.20-0.35)")
print(f"  Isolation significantly reduces richness: slope = {iso_fit[0]:.4f}")
for i, name in enumerate(names):
    print(f"  {name}: area={areas[i]:.0f}km2, S={S_observed[i]}")`,
      challenge: `Add endemism analysis: compute the fraction of species unique to each range and correlate with isolation and elevation.`,
      successHint: `The species-area relationship is ecology's most reliable pattern. Combined with isolation effects, it explains why each of the Seven Sisters harbors a unique flora and fauna — and why protecting large, connected habitat patches is crucial.`,
    },
    {
      title: `Beta diversity and species turnover between ranges`,
      concept: `Beta diversity measures how different two sites are in species composition. High beta diversity means each range has unique species; low beta diversity means they share most species. For biodiversity conservation, beta diversity determines whether one large reserve or many small ones protects more total species.

The SLOSS debate (Single Large Or Several Small reserves) connects directly to beta diversity. If beta diversity is high (each range has unique species), many small reserves protect more total species than one large one. If beta diversity is low (all ranges share species), one large reserve is better because it supports larger populations of each species.

We measure beta diversity using Jaccard (presence/absence) and Bray-Curtis (abundance) indices. Decay of similarity with geographic distance reveals the spatial scale of species turnover.`,
      analogy: `Beta diversity is like comparing playlists. If two friends have identical music tastes (low beta diversity), one combined playlist covers everything. If they have completely different tastes (high beta diversity), you need both playlists to hear all the songs. The Seven Sisters are like friends with partially overlapping but distinct musical tastes.`,
      storyConnection: `Each of the Seven Sisters states has its own unique biodiversity — not just different amounts but different species entirely. This high beta diversity makes northeast India one of the world's most important biodiversity hotspots.`,
      checkQuestion: `Northeast India has 10 hill ranges with 200 total species. If beta diversity is very high (each range has mostly unique species), roughly how many reserves do you need to protect 90% of all species?`,
      checkAnswer: `With very high beta diversity, each range contributes unique species that cannot be protected elsewhere. You might need 7-8 of the 10 ranges as reserves to reach 90% coverage. With low beta diversity, just 2-3 large reserves would suffice. This is why measuring beta diversity is essential before designing reserve networks — the answer depends on how species are distributed across ranges.`,
      codeIntro: `Compute Jaccard and Bray-Curtis indices, analyze distance-decay of similarity, and evaluate reserve design.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_ranges = 10
n_species = 200
range_names = ['Khasi','Garo','Jaintia','Patkai','Barail','Lushai','Naga','Manipur','Tripura','Mikir']

# Geographic coordinates (simplified)
coords = np.array([[91.7,25.5],[90.5,25.4],[92.2,25.3],[96.0,27.0],[93.0,25.0],
                    [92.8,23.5],[94.5,26.0],[93.8,25.0],[91.5,23.8],[93.5,26.3]])

# Generate species presence (correlated with distance)
presence = np.zeros((n_ranges, n_species), dtype=int)
for sp in range(n_species):
    center = np.random.randint(n_ranges)
    spread = np.random.exponential(2)
    for r in range(n_ranges):
        dist = np.sqrt(np.sum((coords[r] - coords[center])**2))
        prob = np.exp(-dist / (spread + 0.1)) * 0.8
        if np.random.random() < prob:
            presence[r, sp] = 1

# Abundances (log-normal where present)
abundance = np.where(presence > 0, np.random.lognormal(3, 1.5, presence.shape).astype(int), 0)
abundance = np.clip(abundance, 0, 1000)

# Diversity metrics
def jaccard(a, b):
    both = np.sum((a > 0) & (b > 0))
    either = np.sum((a > 0) | (b > 0))
    return both / (either + 1e-10)

def bray_curtis(a, b):
    return 1 - 2 * np.sum(np.minimum(a, b)) / (np.sum(a) + np.sum(b) + 1e-10)

# Compute pairwise matrices
jac_mat = np.zeros((n_ranges, n_ranges))
bc_mat = np.zeros((n_ranges, n_ranges))
dist_mat = np.zeros((n_ranges, n_ranges))
for i in range(n_ranges):
    for j in range(n_ranges):
        jac_mat[i,j] = jaccard(presence[i], presence[j])
        bc_mat[i,j] = bray_curtis(abundance[i], abundance[j])
        dist_mat[i,j] = np.sqrt(np.sum((coords[i] - coords[j])**2))

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Beta Diversity Among Seven Sisters Hill Ranges', color='white', fontsize=14)

ax = axes[0,0]; ax.set_facecolor('#111827')
im = ax.imshow(jac_mat, cmap='YlGn', aspect='equal', vmin=0, vmax=1)
ax.set_xticks(range(n_ranges)); ax.set_xticklabels(range_names, rotation=45, fontsize=6, color='white')
ax.set_yticks(range(n_ranges)); ax.set_yticklabels(range_names, fontsize=6, color='white')
ax.set_title('Jaccard Similarity', color='white')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

ax = axes[0,1]; ax.set_facecolor('#111827')
im = ax.imshow(bc_mat, cmap='YlOrRd', aspect='equal', vmin=0, vmax=1)
ax.set_xticks(range(n_ranges)); ax.set_xticklabels(range_names, rotation=45, fontsize=6, color='white')
ax.set_yticks(range(n_ranges)); ax.set_yticklabels(range_names, fontsize=6, color='white')
ax.set_title('Bray-Curtis Dissimilarity', color='white')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

ax = axes[0,2]; ax.set_facecolor('#111827')
mask = np.triu_indices(n_ranges, k=1)
ax.scatter(dist_mat[mask], 1 - jac_mat[mask], color='#22c55e', s=20, alpha=0.7, label='1-Jaccard')
ax.scatter(dist_mat[mask], bc_mat[mask], color='#ef4444', s=20, alpha=0.7, label='Bray-Curtis')
d_fit = np.polyfit(dist_mat[mask], bc_mat[mask], 1)
x_line = np.linspace(0, dist_mat.max(), 100)
ax.plot(x_line, d_fit[0]*x_line + d_fit[1], '--', color='white', linewidth=1.5)
ax.set_xlabel('Geographic Distance', color='white'); ax.set_ylabel('Dissimilarity', color='white')
ax.set_title('Distance Decay of Similarity', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Species accumulation (reserve design)
ax = axes[1,0]; ax.set_facecolor('#111827')
# Random order vs optimal order
n_trials = 50
random_curves = []
for _ in range(n_trials):
    order = np.random.permutation(n_ranges)
    cum_species = []
    seen = set()
    for r in order:
        seen.update(np.where(presence[r] > 0)[0])
        cum_species.append(len(seen))
    random_curves.append(cum_species)
random_curves = np.array(random_curves)
mean_random = random_curves.mean(axis=0)
std_random = random_curves.std(axis=0)

# Complementarity-based order (greedy: always add range that adds most new species)
order_opt = []
seen_opt = set()
cum_opt = []
remaining = list(range(n_ranges))
for _ in range(n_ranges):
    best_r, best_new = -1, -1
    for r in remaining:
        new_sp = len(set(np.where(presence[r] > 0)[0]) - seen_opt)
        if new_sp > best_new: best_r, best_new = r, new_sp
    order_opt.append(best_r)
    remaining.remove(best_r)
    seen_opt.update(np.where(presence[best_r] > 0)[0])
    cum_opt.append(len(seen_opt))

x = range(1, n_ranges + 1)
ax.fill_between(x, mean_random - std_random, mean_random + std_random, alpha=0.2, color='#3b82f6')
ax.plot(x, mean_random, 'o-', color='#3b82f6', linewidth=2, label='Random order')
ax.plot(x, cum_opt, 's-', color='#22c55e', linewidth=2, label='Optimal (complementarity)')
total_sp = np.sum(np.any(presence > 0, axis=0))
ax.axhline(y=total_sp * 0.9, color='white', linestyle='--', alpha=0.5, label='90% target')
ax.set_xlabel('Number of Ranges Protected', color='white')
ax.set_ylabel('Cumulative Species', color='white')
ax.set_title('Reserve Design: Species Accumulation', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Endemism
ax = axes[1,1]; ax.set_facecolor('#111827')
endemic_count = []
for r in range(n_ranges):
    sp_here = set(np.where(presence[r] > 0)[0])
    sp_elsewhere = set(np.where(presence[np.arange(n_ranges) != r].sum(axis=0) > 0)[0])
    endemic_count.append(len(sp_here - sp_elsewhere))
colors_end = ['#ef4444' if e > 5 else '#f59e0b' if e > 2 else '#22c55e' for e in endemic_count]
ax.barh(range_names, endemic_count, color=colors_end)
ax.set_xlabel('Endemic Species', color='white')
ax.set_title('Species Found ONLY in This Range', color='white')
ax.tick_params(colors='gray')

# Map
ax = axes[1,2]; ax.set_facecolor('#111827')
richness = presence.sum(axis=1)
sc = ax.scatter(coords[:,0], coords[:,1], c=richness, cmap='YlGn', s=richness*3,
               edgecolors='white', linewidth=0.5)
for i, name in enumerate(range_names):
    ax.annotate(name, (coords[i,0], coords[i,1]), xytext=(5,5),
               textcoords='offset points', color='white', fontsize=7)
ax.set_xlabel('Longitude', color='white'); ax.set_ylabel('Latitude', color='white')
ax.set_title('Species Richness Map (size=richness)', color='white')
ax.tick_params(colors='gray')
plt.colorbar(sc, ax=ax, shrink=0.8, label='Species')

plt.tight_layout()
plt.show()

n_for_90 = next(i+1 for i, s in enumerate(cum_opt) if s >= total_sp * 0.9)
print("Beta Diversity Analysis:")
print(f"  Total species: {total_sp}")
print(f"  Mean Jaccard similarity: {jac_mat[mask].mean():.3f}")
print(f"  Ranges needed for 90% species (optimal): {n_for_90}")
print(f"  Ranges needed for 90% species (random avg): {np.mean([next(i+1 for i,s in enumerate(c) if s>=total_sp*0.9) for c in random_curves]):.0f}")
print(f"  Total endemic species: {sum(endemic_count)}")
print(f"  Optimal reserve order: {[range_names[i] for i in order_opt[:n_for_90]]}")`,
      challenge: `Add nestedness analysis: determine if smaller ranges contain subsets of larger ranges' species (nested) or have unique species (anti-nested).`,
      successHint: `Beta diversity determines conservation strategy. High beta diversity in the Seven Sisters means we cannot protect the region's biodiversity with a single reserve — we need a network spanning multiple hill ranges.`,
    },
    {
      title: `Species richness estimation from incomplete surveys`,
      concept: `Real biodiversity surveys never detect all species. Estimation methods like Chao1, Chao2, and jackknife correct for undetected species based on the number of rare species in samples.

Chao1 estimator: S_est = S_obs + f1^2 / (2*f2), where f1 = species seen exactly once (singletons), f2 = species seen exactly twice (doubletons). The logic: many singletons relative to doubletons means many undetected species.

Rarefaction standardizes comparisons: computing expected richness at equal sampling effort. Without rarefaction, comparing richness between a well-surveyed and poorly-surveyed site is meaningless.`,
      analogy: `Richness estimation is like estimating the number of fish species in a lake by fishing for a week. If you catch many species only once, there are probably many more you never caught. The ratio of rare to common catches tells you how much you are missing — like extrapolating from the tip of the iceberg to estimate the whole thing.`,
      storyConnection: `Surveyors visiting the Seven Sisters states inevitably miss species. A one-week survey finding 100 species with 30 singletons suggests a true richness much higher than 100. Estimation methods help us understand the true biodiversity even from incomplete data.`,
      checkQuestion: `A survey finds 80 species, with 20 singletons (f1) and 8 doubletons (f2). What is the Chao1 estimate?`,
      checkAnswer: `S_est = 80 + 20^2/(2*8) = 80 + 400/16 = 105 species. The 25 additional estimated species are those too rare to have been detected in this survey effort. This is a minimum estimate — the true number could be higher if there are extremely rare species that do not follow the Chao1 assumptions.`,
      codeIntro: `Implement Chao1, jackknife, and rarefaction for biodiversity estimation.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a community with known true richness
true_S = 150
true_abundances = np.random.zipf(1.8, true_S)
true_abundances = true_abundances / true_abundances.sum()

# Sample with varying effort
def sample_community(n_individuals, abundances):
    samples = np.random.choice(len(abundances), n_individuals, p=abundances)
    counts = np.bincount(samples, minlength=len(abundances))
    return counts

# Multiple sample sizes
efforts = [50, 100, 200, 500, 1000, 2000, 5000]
chao1_ests = []; jack_ests = []; observed = []; rarefied = []

for n in efforts:
    counts = sample_community(n, true_abundances)
    S_obs = np.sum(counts > 0)
    f1 = np.sum(counts == 1)
    f2 = max(np.sum(counts == 2), 1)
    chao1 = S_obs + f1**2 / (2 * f2)
    jack1 = S_obs + f1  # first-order jackknife
    observed.append(S_obs); chao1_ests.append(chao1); jack_ests.append(jack1)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Species Richness Estimation', color='white', fontsize=14)

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.plot(efforts, observed, 'o-', color='#3b82f6', linewidth=2, label='Observed')
ax.plot(efforts, chao1_ests, 's-', color='#22c55e', linewidth=2, label='Chao1')
ax.plot(efforts, jack_ests, '^-', color='#f59e0b', linewidth=2, label='Jackknife1')
ax.axhline(y=true_S, color='#ef4444', linestyle='--', linewidth=2, label=f'True S={true_S}')
ax.set_xlabel('Sample Size', color='white'); ax.set_ylabel('Estimated Richness', color='white')
ax.set_title('Estimator Performance vs Effort', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Rarefaction
ax = axes[0,1]; ax.set_facecolor('#111827')
full_counts = sample_community(5000, true_abundances)
n_steps = np.linspace(10, 5000, 50).astype(int)
rare_means = []; rare_stds = []
for n in n_steps:
    reps = [np.sum(np.bincount(np.random.choice(np.repeat(np.arange(true_S), full_counts), n), minlength=true_S) > 0) for _ in range(20)]
    rare_means.append(np.mean(reps)); rare_stds.append(np.std(reps))
rare_means = np.array(rare_means); rare_stds = np.array(rare_stds)
ax.plot(n_steps, rare_means, color='#22c55e', linewidth=2)
ax.fill_between(n_steps, rare_means-rare_stds, rare_means+rare_stds, alpha=0.2, color='#22c55e')
ax.set_xlabel('Individuals Sampled', color='white'); ax.set_ylabel('Expected Species', color='white')
ax.set_title('Rarefaction Curve', color='white')
ax.tick_params(colors='gray')

# Singleton/doubleton ratio
ax = axes[0,2]; ax.set_facecolor('#111827')
f1_vals = []; f2_vals = []
for n in efforts:
    counts = sample_community(n, true_abundances)
    f1_vals.append(np.sum(counts==1)); f2_vals.append(max(np.sum(counts==2),1))
ax.plot(efforts, np.array(f1_vals)/np.array(f2_vals), 'o-', color='#a855f7', linewidth=2)
ax.set_xlabel('Sample Size', color='white'); ax.set_ylabel('f1/f2 Ratio', color='white')
ax.set_title('Singleton/Doubleton Ratio (higher=more undetected)', color='white')
ax.tick_params(colors='gray')

# Compare 3 communities
ax = axes[1,0]; ax.set_facecolor('#111827')
for S, col, lbl in [(50,'#22c55e','Low diversity (50 sp)'), (150,'#f59e0b','Medium (150 sp)'), (300,'#ef4444','High (300 sp)')]:
    ab = np.random.zipf(1.8, S); ab = ab/ab.sum()
    obs = [np.sum(sample_community(n, ab)>0) for n in efforts]
    ax.plot(efforts, obs, 'o-', color=col, linewidth=2, label=lbl)
ax.set_xlabel('Effort', color='white'); ax.set_ylabel('Observed S', color='white')
ax.set_title('Discovery Curves by True Richness', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Rank-abundance
ax = axes[1,1]; ax.set_facecolor('#111827')
sorted_ab = np.sort(true_abundances)[::-1]
ax.semilogy(range(1, true_S+1), sorted_ab, 'o-', color='#3b82f6', markersize=3, linewidth=1)
ax.set_xlabel('Rank', color='white'); ax.set_ylabel('Relative Abundance', color='white')
ax.set_title('Rank-Abundance (true community)', color='white')
ax.tick_params(colors='gray')

# Estimation error
ax = axes[1,2]; ax.set_facecolor('#111827')
obs_err = [(o - true_S)/true_S*100 for o in observed]
chao_err = [(c - true_S)/true_S*100 for c in chao1_ests]
jack_err = [(j - true_S)/true_S*100 for j in jack_ests]
ax.plot(efforts, obs_err, 'o-', color='#3b82f6', linewidth=2, label='Observed')
ax.plot(efforts, chao_err, 's-', color='#22c55e', linewidth=2, label='Chao1')
ax.plot(efforts, jack_err, '^-', color='#f59e0b', linewidth=2, label='Jackknife')
ax.axhline(y=0, color='white', linestyle='--', alpha=0.3)
ax.set_xlabel('Effort', color='white'); ax.set_ylabel('% Error', color='white')
ax.set_title('Estimation Error', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Richness Estimation Summary:")
print(f"  True richness: {true_S}")
for i, n in enumerate(efforts):
    print(f"  n={n}: observed={observed[i]}, Chao1={chao1_ests[i]:.0f}, Jack={jack_ests[i]:.0f}")`,
      challenge: `Implement the Chao2 estimator (based on incidence data across multiple samples) and compare its performance with Chao1.`,
      successHint: `Never trust raw species counts — always estimate true richness. The gap between observed and estimated richness tells you how much biodiversity remains hidden.`,
    },
    {
      title: `Habitat fragmentation and connectivity modeling`,
      concept: `Habitat fragmentation divides continuous forest into isolated patches. Each patch is smaller (higher extinction risk) and more isolated (lower immigration). Connectivity modeling quantifies how well organisms can move between patches.

The key metric is the **Probability of Connectivity (PC)**: PC = (1/A_L^2) * sum_i sum_j (a_i * a_j * p_ij), where a_i is patch area, p_ij is the probability of dispersal between patches i and j, and A_L is the total landscape area. Higher PC means better connectivity.

Least-cost path analysis finds the easiest route between patches through a resistance surface (where roads, rivers, and deforested areas have high resistance). Graph theory models patches as nodes and connectivity as edges.`,
      analogy: `Fragmentation is like cutting a city's road network. If you close a few key highways, some neighborhoods become isolated even though they are physically close. The remaining routes (through residential streets) are possible but much slower. Connectivity modeling identifies the 'highways' that must stay open to keep the ecosystem connected.`,
      storyConnection: `The Seven Sisters region faces rapid deforestation and fragmentation. Connectivity modeling identifies the critical forest corridors that connect hill ranges — without these corridors, each range becomes an isolated island, losing species through extinction without replacement through immigration.`,
      checkQuestion: `Two forest patches are 5 km apart across grassland. A gibbons' maximum dispersal distance is 3 km. Are the patches connected?`,
      checkAnswer: `For gibbons, no — 5 km of open grassland exceeds their dispersal capacity. But connectivity depends on the species: a bird that flies 20 km easily bridges the gap, while a ground beetle that moves 100m per generation sees the patches as on different continents. Effective connectivity is species-specific, which is why we model it with resistance surfaces rather than simple distance.`,
      codeIntro: `Model habitat fragmentation, compute connectivity metrics, and identify critical corridors.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate fragmented landscape
res = 100
landscape = np.random.random((res, res))
# Forest = 1, non-forest = 0
forest_threshold = 0.45
forest = (landscape > forest_threshold).astype(int)

# Add some deforestation corridors
forest[40:45, :] = 0  # road
forest[:, 55:60] = 0  # river clearance
forest[70:75, 20:80] = 0  # agricultural belt

# Label patches
from collections import deque
def label_patches(grid):
    labels = np.zeros_like(grid, dtype=int)
    current_label = 0
    for i in range(grid.shape[0]):
        for j in range(grid.shape[1]):
            if grid[i,j] == 1 and labels[i,j] == 0:
                current_label += 1
                q = deque([(i,j)])
                labels[i,j] = current_label
                while q:
                    ci, cj = q.popleft()
                    for di, dj in [(-1,0),(1,0),(0,-1),(0,1)]:
                        ni, nj = ci+di, cj+dj
                        if 0<=ni<grid.shape[0] and 0<=nj<grid.shape[1]:
                            if grid[ni,nj]==1 and labels[ni,nj]==0:
                                labels[ni,nj] = current_label
                                q.append((ni,nj))
    return labels, current_label

labels, n_patches = label_patches(forest)
patch_areas = np.array([np.sum(labels==i) for i in range(1, n_patches+1)])

# Top 10 patches
top_patches = np.argsort(patch_areas)[::-1][:10]
patch_centers = []
for p in top_patches:
    ys, xs = np.where(labels == p+1)
    patch_centers.append((xs.mean(), ys.mean()))
patch_centers = np.array(patch_centers)

# Connectivity: pairwise dispersal probability
max_dispersal = 15  # grid cells
dist_matrix = np.zeros((10, 10))
p_matrix = np.zeros((10, 10))
for i in range(10):
    for j in range(10):
        d = np.sqrt(np.sum((patch_centers[i] - patch_centers[j])**2))
        dist_matrix[i,j] = d
        p_matrix[i,j] = np.exp(-d / max_dispersal)

# Probability of Connectivity
total_area = res * res
PC = 0
for i in range(10):
    for j in range(10):
        PC += patch_areas[top_patches[i]] * patch_areas[top_patches[j]] * p_matrix[i,j]
PC /= total_area**2

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Habitat Fragmentation and Connectivity', color='white', fontsize=14)

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.imshow(forest, cmap='Greens', origin='lower')
ax.set_title(f'Fragmented Forest ({forest.sum()/(res*res)*100:.0f}% cover)', color='white')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
display = np.zeros_like(labels, dtype=float)
for i, p in enumerate(top_patches):
    display[labels == p+1] = patch_areas[p]
ax.imshow(display, cmap='YlGn', origin='lower')
ax.scatter(patch_centers[:,0], patch_centers[:,1], c='red', s=50, zorder=5)
ax.set_title(f'Top 10 Patches (of {n_patches} total)', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
# Connectivity network
ax.imshow(forest, cmap='Greens', origin='lower', alpha=0.3)
for i in range(10):
    for j in range(i+1, 10):
        if p_matrix[i,j] > 0.1:
            lw = p_matrix[i,j] * 3
            ax.plot([patch_centers[i,0], patch_centers[j,0]],
                   [patch_centers[i,1], patch_centers[j,1]],
                   color='#f59e0b', linewidth=lw, alpha=0.7)
ax.scatter(patch_centers[:,0], patch_centers[:,1],
          s=[patch_areas[p]/5 for p in top_patches], c='#22c55e', edgecolors='white', zorder=5)
ax.set_title('Connectivity Network', color='white')
ax.tick_params(colors='gray')

# Patch size distribution
ax = axes[1,0]; ax.set_facecolor('#111827')
ax.hist(np.log10(patch_areas+1), bins=30, color='#22c55e', alpha=0.7, edgecolor='white')
ax.set_xlabel('log10(Patch Area)', color='white'); ax.set_ylabel('Count', color='white')
ax.set_title(f'Patch Size Distribution ({n_patches} patches)', color='white')
ax.tick_params(colors='gray')

# Corridor importance (remove each patch, measure PC change)
ax = axes[1,1]; ax.set_facecolor('#111827')
dPC = []
for k in range(10):
    PC_k = 0
    for i in range(10):
        for j in range(10):
            if i != k and j != k:
                PC_k += patch_areas[top_patches[i]] * patch_areas[top_patches[j]] * p_matrix[i,j]
    PC_k /= total_area**2
    dPC.append((PC - PC_k) / PC * 100)
ax.barh(range(10), dPC, color=['#ef4444' if d > 10 else '#f59e0b' if d > 5 else '#22c55e' for d in dPC])
ax.set_yticks(range(10))
ax.set_yticklabels([f'Patch {p+1} ({patch_areas[p]}px)' for p in top_patches], fontsize=6, color='white')
ax.set_xlabel('% Change in PC if Removed', color='white')
ax.set_title('Patch Importance (red=critical)', color='white')
ax.tick_params(colors='gray')

# Dispersal distance sensitivity
ax = axes[1,2]; ax.set_facecolor('#111827')
dispersals = np.linspace(3, 50, 30)
PCs = []
for md in dispersals:
    pc_val = 0
    for i in range(10):
        for j in range(10):
            d = dist_matrix[i,j]
            pc_val += patch_areas[top_patches[i]] * patch_areas[top_patches[j]] * np.exp(-d/md)
    PCs.append(pc_val / total_area**2)
ax.plot(dispersals, PCs, 'o-', color='#a855f7', linewidth=2)
ax.set_xlabel('Max Dispersal Distance (cells)', color='white')
ax.set_ylabel('Probability of Connectivity', color='white')
ax.set_title('Connectivity vs Dispersal Ability', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fragmentation Analysis:")
print(f"  Forest cover: {forest.sum()/(res*res)*100:.0f}%")
print(f"  Number of patches: {n_patches}")
print(f"  Largest patch: {patch_areas.max()} pixels")
print(f"  Probability of Connectivity: {PC:.6f}")
most_critical = np.argmax(dPC)
print(f"  Most critical patch: #{top_patches[most_critical]+1} (removing it reduces PC by {dPC[most_critical]:.1f}%)")`,
      challenge: `Add a corridor design module: identify the least-cost path between the two most isolated large patches and compute the minimum corridor width needed.`,
      successHint: `Connectivity modeling is essential for conservation in fragmented landscapes. The Seven Sisters region needs a connected network of reserves, not isolated parks.`,
    },
    {
      title: `Climate envelope modeling for species distribution`,
      concept: `Climate envelope models (also called species distribution models or SDMs) predict where a species can live based on the climate conditions where it currently occurs. The fundamental assumption: a species' geographic range is determined by the climate conditions it can tolerate.

The modeling pipeline: (1) Collect occurrence records (where the species has been found). (2) Extract climate variables at those locations (temperature, precipitation, seasonality). (3) Also sample 'background' or 'pseudo-absence' points where the species has not been found. (4) Train a classifier to distinguish occurrences from background. (5) Project the model across the landscape to create a habitat suitability map.

For northeast India, climate envelope models are critical for predicting how species will respond to climate change. If a montane species needs temperatures below 20C, warming pushes its suitable habitat upslope. Eventually, the summit is not high enough, and the species has nowhere to go — 'mountaintop extinction.'`,
      analogy: `A climate envelope model is like a dating profile for a species. Just as a person might specify 'I like warm beaches, not cold mountains,' a species has preferences: 'I need 15-25C mean temperature, 1500-2500mm annual rainfall, and moderate seasonality.' The model finds all locations that match the profile.`,
      storyConnection: `The Seven Sisters span from sea-level floodplains to 3800m peaks, creating dramatic climate gradients over short distances. Climate envelope models predict that warming will push cool-adapted species upslope, potentially squeezing them off mountaintops — a crisis for the endemic species of the Khasi and Naga hills.`,
      checkQuestion: `A bird species is found only between 1500m and 2500m elevation. If temperature warms by 2C (shifting isotherms up ~300m), what happens to its range?`,
      checkAnswer: `Its suitable elevation band shifts to 1800-2800m. If the mountain peak is 3000m, the species retains most of its range (200m reduction at the top). But if the peak is only 2600m, the new suitable range is 1800-2600m — a 20% reduction. Crucially, the area typically shrinks even faster than the elevation range because mountains are cone-shaped (less area at higher elevations). A 300m upslope shift might reduce available area by 30-50%.`,
      codeIntro: `Build a climate envelope model for a hypothetical montane species and project range shifts under warming scenarios.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate climate landscape for northeast India (simplified)
res = 80
lon = np.linspace(89, 97, res)
lat = np.linspace(22, 28, res)
LON, LAT = np.meshgrid(lon, lat)

# Elevation model (higher in north and east)
elevation = 200 + 800*(LAT-22)/6 + 500*(LON-89)/8 + 300*np.sin(LON*2)*np.cos(LAT*3) + 100*np.random.randn(res,res)
elevation = np.clip(elevation, 0, 3500)

# Temperature (decreases with elevation, lapse rate 6.5C/km)
temp_base = 28 - 0.5*(LAT-22)  # latitude effect
temperature = temp_base - 6.5 * elevation/1000

# Precipitation (higher in Meghalaya, decreasing east)
precipitation = 2000 + 1000*np.exp(-(((LON-91.5)**2+(LAT-25.5)**2))/3) + 300*np.random.randn(res,res)
precipitation = np.clip(precipitation, 500, 5000)

# Species occurrence: prefers 12-22C, 1500-3000mm rainfall
def habitat_suitability(temp, precip, t_opt=17, t_width=5, p_opt=2200, p_width=700):
    t_suit = np.exp(-0.5*((temp-t_opt)/t_width)**2)
    p_suit = np.exp(-0.5*((precip-p_opt)/p_width)**2)
    return t_suit * p_suit

suit_current = habitat_suitability(temperature, precipitation)

# Generate occurrence points (sample from high-suitability areas)
n_occ = 60
flat_suit = suit_current.ravel()
flat_suit_norm = flat_suit / flat_suit.sum()
occ_indices = np.random.choice(len(flat_suit_norm), n_occ, p=flat_suit_norm, replace=False)
occ_row, occ_col = np.unravel_index(occ_indices, suit_current.shape)
occ_lon = LON[occ_row, occ_col]
occ_lat = LAT[occ_row, occ_col]

# Background points
n_bg = 200
bg_indices = np.random.choice(res*res, n_bg, replace=False)
bg_row, bg_col = np.unravel_index(bg_indices, suit_current.shape)

# Logistic regression SDM
X_occ = np.column_stack([temperature[occ_row,occ_col], precipitation[occ_row,occ_col],
                          temperature[occ_row,occ_col]**2, precipitation[occ_row,occ_col]**2])
X_bg = np.column_stack([temperature[bg_row,bg_col], precipitation[bg_row,bg_col],
                          temperature[bg_row,bg_col]**2, precipitation[bg_row,bg_col]**2])
X = np.vstack([X_occ, X_bg])
y = np.concatenate([np.ones(n_occ), np.zeros(n_bg)])

# Standardize
mu_X = X.mean(0); sig_X = X.std(0)+1e-10
X_std = (X-mu_X)/sig_X
X_design = np.column_stack([np.ones(len(X_std)), X_std])

# Fit logistic regression
def sigmoid(z): return 1/(1+np.exp(-np.clip(z,-500,500)))
beta = np.zeros(X_design.shape[1])
for _ in range(500):
    p = sigmoid(X_design @ beta)
    grad = X_design.T @ (y - p)
    beta += 0.01 * grad / len(y)

# Predict across landscape
X_full = np.column_stack([temperature.ravel(), precipitation.ravel(),
                           temperature.ravel()**2, precipitation.ravel()**2])
X_full_std = (X_full-mu_X)/sig_X
X_full_design = np.column_stack([np.ones(len(X_full_std)), X_full_std])
pred_current = sigmoid(X_full_design @ beta).reshape(res, res)

# Climate change scenario: +2C warming
temp_future = temperature + 2
X_future = np.column_stack([temp_future.ravel(), precipitation.ravel(),
                             temp_future.ravel()**2, precipitation.ravel()**2])
X_future_std = (X_future-mu_X)/sig_X
X_future_design = np.column_stack([np.ones(len(X_future_std)), X_future_std])
pred_future = sigmoid(X_future_design @ beta).reshape(res, res)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Climate Envelope Model for Montane Species', color='white', fontsize=14)

ax = axes[0,0]; ax.set_facecolor('#111827')
im = ax.contourf(lon, lat, temperature, levels=20, cmap='RdYlBu_r')
ax.scatter(occ_lon, occ_lat, c='white', s=15, edgecolors='black', linewidth=0.5, zorder=5)
ax.set_title('Temperature + Occurrences', color='white'); ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8, label='Temp (C)')

ax = axes[0,1]; ax.set_facecolor('#111827')
im = ax.contourf(lon, lat, pred_current, levels=20, cmap='YlGn', vmin=0, vmax=1)
ax.scatter(occ_lon, occ_lat, c='white', s=15, edgecolors='black', linewidth=0.5, zorder=5)
ax.set_title('Current Habitat Suitability', color='white'); ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8, label='P(presence)')

ax = axes[0,2]; ax.set_facecolor('#111827')
im = ax.contourf(lon, lat, pred_future, levels=20, cmap='YlGn', vmin=0, vmax=1)
ax.set_title('Future Suitability (+2C)', color='white'); ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8, label='P(presence)')

# Range change
ax = axes[1,0]; ax.set_facecolor('#111827')
change = pred_future - pred_current
im = ax.contourf(lon, lat, change, levels=20, cmap='RdBu', vmin=-0.5, vmax=0.5)
ax.set_title('Change in Suitability', color='white'); ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

# Area vs threshold
ax = axes[1,1]; ax.set_facecolor('#111827')
thresholds = np.linspace(0.1, 0.9, 20)
area_current = [np.sum(pred_current > t) for t in thresholds]
area_future = [np.sum(pred_future > t) for t in thresholds]
ax.plot(thresholds, area_current, 'o-', color='#22c55e', linewidth=2, label='Current')
ax.plot(thresholds, area_future, 's-', color='#ef4444', linewidth=2, label='Future (+2C)')
ax.set_xlabel('Suitability Threshold', color='white')
ax.set_ylabel('Suitable Area (cells)', color='white')
ax.set_title('Range Area Loss', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Elevation shift
ax = axes[1,2]; ax.set_facecolor('#111827')
high_suit_current = elevation[pred_current > 0.5]
high_suit_future = elevation[pred_future > 0.5]
if len(high_suit_current) > 0:
    ax.hist(high_suit_current, bins=30, alpha=0.5, color='#22c55e', label=f'Current (mean={high_suit_current.mean():.0f}m)')
if len(high_suit_future) > 0:
    ax.hist(high_suit_future, bins=30, alpha=0.5, color='#ef4444', label=f'Future (mean={high_suit_future.mean():.0f}m)')
ax.set_xlabel('Elevation (m)', color='white'); ax.set_ylabel('Count', color='white')
ax.set_title('Elevational Range Shift', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Stats
current_area = np.sum(pred_current > 0.5)
future_area = np.sum(pred_future > 0.5)
pct_loss = (1 - future_area/current_area) * 100 if current_area > 0 else 0
print("Climate Envelope Model Results:")
print(f"  Current suitable area (>0.5): {current_area} cells")
print(f"  Future suitable area (+2C): {future_area} cells")
print(f"  Area loss: {pct_loss:.0f}%")
if len(high_suit_current) > 0 and len(high_suit_future) > 0:
    print(f"  Mean elevation shift: {high_suit_future.mean()-high_suit_current.mean():.0f}m upslope")`,
      challenge: `Add multiple climate scenarios (RCP 4.5, 6.0, 8.5 with +1.5C, +2.5C, +4C warming) and compute the probability of range collapse for each.`,
      successHint: `Climate envelope models are the primary tool for predicting species responses to climate change. For the Seven Sisters' montane endemics, the predictions are sobering: warming pushes species upslope until the mountain runs out.`,
    },
    {
      title: `Conservation prioritization using complementarity`,
      concept: `Conservation resources are limited. We cannot protect everything, so we must choose wisely. **Complementarity-based prioritization** selects sites that together maximize the number of species protected, rather than simply protecting the richest sites.

The greedy algorithm for complementarity: (1) Select the richest site first. (2) Then select the site that adds the most NEW species (not already protected). (3) Repeat until the budget is exhausted or a coverage target is reached.

This outperforms richness-based selection because high-richness sites often overlap in species composition (they share the same common species). Complementarity seeks unique species at each step.

Adding costs creates a more realistic problem: maximize species coverage subject to a budget constraint. This is a variant of the set cover problem (NP-hard), but greedy approximations perform well in practice.`,
      analogy: `Conservation prioritization is like assembling a team with diverse skills. Hiring the five best basketball players does not make the best team — you need a point guard, center, shooter, defender, and playmaker. Complementarity picks 'players' (sites) that bring unique 'skills' (species), not just the highest individual scores.`,
      storyConnection: `Protecting the Seven Sisters requires choosing which hill ranges to designate as reserves. Complementarity analysis reveals that protecting the three richest ranges is less effective than protecting three complementary ranges that together cover more unique species.`,
      checkQuestion: `Two strategies: protect the 3 richest ranges (total 120 species) or the 3 most complementary ranges (total 95 species individually but 140 unique species together). Which is better?`,
      checkAnswer: `The complementary strategy protects 140 unique species vs the richness strategy's 120. The richness strategy fails because rich ranges share many species — adding the second and third richest sites provides diminishing returns. Complementarity avoids this redundancy. The 'best' individual sites are not the best combination.`,
      codeIntro: `Implement complementarity-based reserve selection and compare with richness-based selection.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_sites = 20
n_species = 300

# Generate species presence with spatial structure
coords = np.random.uniform(0, 100, (n_sites, 2))
presence = np.zeros((n_sites, n_species), dtype=int)
for sp in range(n_species):
    center = np.random.randint(n_sites)
    spread = np.random.exponential(30)
    for s in range(n_sites):
        d = np.sqrt(np.sum((coords[s] - coords[center])**2))
        if np.random.random() < np.exp(-d/spread) * 0.6:
            presence[s, sp] = 1

# Site costs (random, 1-10)
costs = np.random.uniform(1, 10, n_sites)
richness = presence.sum(axis=1)

# Greedy complementarity
def greedy_complementarity(presence, budget=None, n_select=None):
    n_s = presence.shape[0]
    selected = []; covered = set()
    remaining = list(range(n_s))
    total_cost = 0
    while remaining:
        best_site, best_new = -1, -1
        for s in remaining:
            new_sp = len(set(np.where(presence[s]>0)[0]) - covered)
            if new_sp > best_new:
                best_site, best_new = s, new_sp
        if best_new == 0: break
        if budget and total_cost + costs[best_site] > budget: 
            remaining.remove(best_site); continue
        if n_select and len(selected) >= n_select: break
        selected.append(best_site)
        covered.update(np.where(presence[best_site]>0)[0])
        remaining.remove(best_site)
        total_cost += costs[best_site]
    return selected, covered

# Richness-based selection
richness_order = np.argsort(-richness)

# Compare strategies for n=1..n_sites
comp_species = []; rich_species = []; random_species = []
for n in range(1, n_sites+1):
    # Complementarity
    sel_c, cov_c = greedy_complementarity(presence, n_select=n)
    comp_species.append(len(cov_c))
    
    # Richness-based
    sel_r = richness_order[:n]
    cov_r = set()
    for s in sel_r: cov_r.update(np.where(presence[s]>0)[0])
    rich_species.append(len(cov_r))
    
    # Random (average)
    rands = []
    for _ in range(30):
        sel_rand = np.random.choice(n_sites, n, replace=False)
        cov_rand = set()
        for s in sel_rand: cov_rand.update(np.where(presence[s]>0)[0])
        rands.append(len(cov_rand))
    random_species.append(np.mean(rands))

total_species = len(set(np.where(presence.sum(axis=0)>0)[0]))

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Conservation Prioritization', color='white', fontsize=14)

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.plot(range(1,n_sites+1), comp_species, 'o-', color='#22c55e', linewidth=2, label='Complementarity')
ax.plot(range(1,n_sites+1), rich_species, 's-', color='#f59e0b', linewidth=2, label='Richness-based')
ax.plot(range(1,n_sites+1), random_species, '^-', color='#6b7280', linewidth=2, label='Random')
ax.axhline(y=total_species*0.9, color='white', linestyle='--', alpha=0.5, label='90% target')
ax.set_xlabel('Number of Sites Protected', color='white')
ax.set_ylabel('Species Protected', color='white')
ax.set_title('Strategy Comparison', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Map with selection
ax = axes[0,1]; ax.set_facecolor('#111827')
sel_5, _ = greedy_complementarity(presence, n_select=5)
for i in range(n_sites):
    col = '#22c55e' if i in sel_5 else '#6b7280'
    ax.scatter([coords[i,0]], [coords[i,1]], s=richness[i]*3, color=col,
              edgecolors='white' if i in sel_5 else 'none', linewidth=2)
    ax.annotate(f'S{i+1}', (coords[i,0], coords[i,1]), xytext=(3,3),
               textcoords='offset points', color='white', fontsize=6)
ax.set_title('Top 5 by Complementarity (green)', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
rich_5 = richness_order[:5]
for i in range(n_sites):
    col = '#f59e0b' if i in rich_5 else '#6b7280'
    ax.scatter([coords[i,0]], [coords[i,1]], s=richness[i]*3, color=col,
              edgecolors='white' if i in rich_5 else 'none', linewidth=2)
    ax.annotate(f'S{i+1}', (coords[i,0], coords[i,1]), xytext=(3,3),
               textcoords='offset points', color='white', fontsize=6)
ax.set_title('Top 5 by Richness (orange)', color='white')
ax.tick_params(colors='gray')

# Cost-effectiveness
ax = axes[1,0]; ax.set_facecolor('#111827')
for budget in [15, 25, 40, 60]:
    sel_b, cov_b = greedy_complementarity(presence, budget=budget)
    ax.scatter([budget], [len(cov_b)], s=100, zorder=5)
    ax.annotate(f'{len(cov_b)} sp', (budget, len(cov_b)), xytext=(5,5),
               textcoords='offset points', color='white', fontsize=8)
ax.set_xlabel('Budget', color='white'); ax.set_ylabel('Species Protected', color='white')
ax.set_title('Cost-Constrained Selection', color='white')
ax.tick_params(colors='gray')

# Irreplaceability
ax = axes[1,1]; ax.set_facecolor('#111827')
irrep = []
for s in range(n_sites):
    unique = set(np.where(presence[s]>0)[0])
    for s2 in range(n_sites):
        if s2 != s:
            unique -= set(np.where(presence[s2]>0)[0])
    irrep.append(len(unique))
sort_idx = np.argsort(irrep)[::-1]
ax.barh(range(n_sites), [irrep[i] for i in sort_idx],
       color=['#ef4444' if irrep[i]>0 else '#22c55e' for i in sort_idx])
ax.set_yticks(range(n_sites))
ax.set_yticklabels([f'S{i+1}' for i in sort_idx], fontsize=7, color='white')
ax.set_xlabel('Unique Species (found nowhere else)', color='white')
ax.set_title('Site Irreplaceability', color='white')
ax.tick_params(colors='gray')

# Efficiency gain
ax = axes[1,2]; ax.set_facecolor('#111827')
gain = np.array(comp_species) - np.array(rich_species)
ax.bar(range(1, n_sites+1), gain, color=['#22c55e' if g>0 else '#ef4444' for g in gain])
ax.set_xlabel('Number of Sites', color='white')
ax.set_ylabel('Extra Species from Complementarity', color='white')
ax.set_title('Complementarity Advantage', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

n90_comp = next(i+1 for i,s in enumerate(comp_species) if s>=total_species*0.9)
n90_rich = next((i+1 for i,s in enumerate(rich_species) if s>=total_species*0.9), n_sites)
print("Conservation Prioritization Results:")
print(f"  Total species: {total_species}")
print(f"  Sites for 90% coverage: complementarity={n90_comp}, richness={n90_rich}")
print(f"  At 5 sites: complementarity={comp_species[4]}, richness={rich_species[4]} species")
print(f"  Sites with irreplaceable species: {sum(1 for i in irrep if i>0)}")`,
      challenge: `Add a Marxan-like simulated annealing solver that finds near-optimal reserve networks under multiple constraints (budget, minimum area, connectivity).`,
      successHint: `Complementarity-based prioritization is the foundation of systematic conservation planning. It is mathematically guaranteed to outperform richness-based selection for species coverage — a principle that has reshaped how protected area networks are designed worldwide.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for biodiversity analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
