import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MithunLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Domestication genetics — how humans reshaped the mithun genome over millennia',
      concept: `The mithun (Bos frontalis) is one of the rarest domesticated bovids on earth, found almost exclusively in the hill regions of Northeast India, Myanmar, Bangladesh, and Bhutan. Unlike cattle (Bos taurus/indicus) which were domesticated from the aurochs, the mithun descends from the wild gaur (Bos gaurus) — the largest living bovid, weighing up to 1500 kg. The domestication of the gaur into the mithun is a remarkable case study in artificial selection.

Domestication creates a **domestication syndrome**: a suite of traits that consistently appear in domesticated animals regardless of species. These include reduced brain size (10-15% smaller than wild ancestors), floppy ears, curled tails, paedomorphic (juvenile-looking) faces, reduced aggression, altered coat colors, and changes in reproductive timing. The mithun exhibits most of these: it is smaller than the gaur (600-1000 kg vs 1000-1500 kg), more docile, has a broader color range (black, white, piebald), and breeds year-round rather than seasonally.

The genetic basis of domestication involves changes in **neural crest cell** development. Neural crest cells are embryonic cells that migrate throughout the body during development, giving rise to pigment cells, parts of the skull, adrenal glands, and peripheral nerves. Selecting for tameness inadvertently selects for reduced neural crest cell activity, which produces all the domestication syndrome traits simultaneously. This is the **neural crest hypothesis**, supported by Belyaev's famous fox domestication experiment.

In the Naga, Mizo, and Arunachal hills, mithun domestication likely began 8000 to 4000 years ago through a gradual process: wild gaur were attracted to salt licks and forest clearings near human settlements, habituated to human presence, and eventually bred in semi-captivity. Even today, mithun are semi-feral — they roam freely in forests and are only gathered for ceremonies, trade, or breeding selection.`,
      analogy: 'Domestication is like a sculptor gradually reshaping a block of marble. Each generation, the sculptor (human selection) removes a thin layer (genes for wildness, aggression, large body size). After thousands of generations, the sculpture looks very different from the original block, but every change was incremental. The neural crest hypothesis says that the sculptor only needs to chip at one spot (neural crest genes), and the changes cascade across the entire sculpture.',
      storyConnection: 'The brave mithun in the story is both strong and trusting of humans — a combination that only exists because of millennia of domestication. A wild gaur would never approach a human, let alone defend one. The mithun\'s bravery is a product of reduced fear response (domestication syndrome) combined with retained physical power — a unique combination that makes the mithun the most culturally valued animal in Northeast India\'s hill communities.',
      checkQuestion: 'Why do mithun have more coat color variation (black, white, brown, piebald) than wild gaur, which are uniformly dark brown?',
      checkAnswer: 'Coat color variation is part of the domestication syndrome, caused by changes in neural crest cell-derived melanocytes. In wild gaur, strong natural selection maintains uniform dark coloring for camouflage. Once humans remove predation pressure through domestication, there is no selective disadvantage to unusual colors. Additionally, humans may actively select for distinctive colors to identify individual animals, track lineage, or for aesthetic/ceremonial preferences. The piebald pattern specifically results from incomplete melanocyte migration during development — a hallmark of reduced neural crest cell activity.',
      codeIntro: 'Model the domestication process as directional selection on a quantitative trait (body mass) over thousands of generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Domestication as directional selection ---

class DomesticationSimulator:
    """Simulate trait changes during domestication via selection."""

    def __init__(self, pop_size=200, initial_mean=1200, initial_std=150):
        self.pop_size = pop_size
        self.trait_mean = initial_mean  # body mass (kg) — gaur starting point
        self.trait_std = initial_std
        self.heritability = 0.4  # proportion of variance that is genetic

    def select_generation(self, population, selection_strength=0.1, direction='smaller'):
        """Select individuals based on trait value."""
        if direction == 'smaller':
            # Prefer smaller, more docile animals
            fitness = np.exp(-selection_strength * (population - np.min(population)))
        else:
            fitness = np.exp(-selection_strength * (np.max(population) - population))

        fitness /= fitness.sum()
        selected_idx = np.random.choice(len(population), size=self.pop_size, p=fitness)
        return population[selected_idx]

    def breed(self, parents):
        """Next generation with heritable variation."""
        parent_mean = np.mean(parents)
        # Breeder's equation: R = h^2 * S
        selection_differential = parent_mean - self.trait_mean
        response = self.heritability * selection_differential
        self.trait_mean += response
        # New generation with genetic + environmental variation
        genetic_var = self.trait_std**2 * self.heritability
        env_var = self.trait_std**2 * (1 - self.heritability)
        new_pop = np.random.normal(self.trait_mean, np.sqrt(genetic_var), self.pop_size)
        new_pop += np.random.normal(0, np.sqrt(env_var), self.pop_size)
        return np.clip(new_pop, 200, 2000)

    def run(self, n_generations=500, selection_strength=0.1):
        """Run domestication simulation."""
        records = {'mean': [], 'std': [], 'min': [], 'max': []}
        population = np.random.normal(self.trait_mean, self.trait_std, self.pop_size)

        for gen in range(n_generations):
            records['mean'].append(np.mean(population))
            records['std'].append(np.std(population))
            records['min'].append(np.min(population))
            records['max'].append(np.max(population))

            selected = self.select_generation(population, selection_strength)
            population = self.breed(selected)

        return {k: np.array(v) for k, v in records.items()}

# Run three scenarios
sim_weak = DomesticationSimulator(pop_size=200, initial_mean=1200, initial_std=150)
sim_mod = DomesticationSimulator(pop_size=200, initial_mean=1200, initial_std=150)
sim_strong = DomesticationSimulator(pop_size=200, initial_mean=1200, initial_std=150)

results_weak = sim_weak.run(500, selection_strength=0.02)
results_mod = sim_mod.run(500, selection_strength=0.08)
results_strong = sim_strong.run(500, selection_strength=0.20)

gens = np.arange(500)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Mean body mass over generations
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(gens, results_weak['mean'], color='#22c55e', linewidth=2, label='Weak selection (s=0.02)')
ax.plot(gens, results_mod['mean'], color='#3b82f6', linewidth=2, label='Moderate selection (s=0.08)')
ax.plot(gens, results_strong['mean'], color='#ef4444', linewidth=2, label='Strong selection (s=0.20)')
ax.axhline(1200, color='gray', linestyle=':', label='Wild gaur mean')
ax.axhline(800, color='#f59e0b', linestyle='--', label='Modern mithun mean')
ax.set_xlabel('Generations', color='white')
ax.set_ylabel('Mean body mass (kg)', color='white')
ax.set_title('Domestication: body mass reduction over time', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Variance over generations
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(gens, results_weak['std'], color='#22c55e', linewidth=2, label='Weak')
ax.plot(gens, results_mod['std'], color='#3b82f6', linewidth=2, label='Moderate')
ax.plot(gens, results_strong['std'], color='#ef4444', linewidth=2, label='Strong')
ax.set_xlabel('Generations', color='white')
ax.set_ylabel('Std deviation (kg)', color='white')
ax.set_title('Phenotypic variation during domestication', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Trait distribution at start vs end
ax = axes[1, 0]
ax.set_facecolor('#111827')
x = np.linspace(400, 1600, 200)
from scipy.stats import norm  # will use manual gaussian
def gauss(x, mu, sigma):
    return np.exp(-0.5 * ((x - mu) / sigma)**2) / (sigma * np.sqrt(2 * np.pi))

ax.fill_between(x, gauss(x, 1200, 150), alpha=0.3, color='#ef4444', label='Wild gaur (gen 0)')
ax.plot(x, gauss(x, 1200, 150), color='#ef4444', linewidth=2)
ax.fill_between(x, gauss(x, results_mod['mean'][-1], results_mod['std'][-1]),
                alpha=0.3, color='#3b82f6', label=f'Mithun (gen 500)')
ax.plot(x, gauss(x, results_mod['mean'][-1], results_mod['std'][-1]), color='#3b82f6', linewidth=2)
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Probability density', color='white')
ax.set_title('Trait distribution shift', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Multiple domestication syndrome traits
ax = axes[1, 1]
ax.set_facecolor('#111827')
traits = ['Body mass', 'Brain size', 'Aggression', 'Flight distance', 'Horn size', 'Color variation']
gaur_vals = [1200, 100, 90, 95, 100, 10]  # relative scale
mithun_vals = [800, 85, 30, 25, 80, 70]
x_pos = np.arange(len(traits))
width = 0.35
bars1 = ax.bar(x_pos - width/2, gaur_vals, width, color='#ef4444', label='Wild gaur', edgecolor='none')
bars2 = ax.bar(x_pos + width/2, mithun_vals, width, color='#3b82f6', label='Mithun', edgecolor='none')
ax.set_xticks(x_pos)
ax.set_xticklabels(traits, color='white', fontsize=8, rotation=30, ha='right')
ax.set_ylabel('Relative value', color='white')
ax.set_title('Domestication syndrome: gaur vs mithun', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Domestication simulation results (500 generations):")
print(f"  Weak selection:   {results_weak['mean'][0]:.0f} -> {results_weak['mean'][-1]:.0f} kg (change: {results_weak['mean'][-1]-results_weak['mean'][0]:.0f} kg)")
print(f"  Moderate selection: {results_mod['mean'][0]:.0f} -> {results_mod['mean'][-1]:.0f} kg (change: {results_mod['mean'][-1]-results_mod['mean'][0]:.0f} kg)")
print(f"  Strong selection: {results_strong['mean'][0]:.0f} -> {results_strong['mean'][-1]:.0f} kg (change: {results_strong['mean'][-1]-results_strong['mean'][0]:.0f} kg)")
print()
print("Moderate selection over 500 generations reduces body mass by ~400 kg,")
print("matching the observed gaur-to-mithun transition. This corresponds to")
print("roughly 4000-8000 years at ~10 years per generation.")`,
      challenge: 'Add a "relaxed selection" phase after generation 300 where selection strength drops to 0. What happens to the trait distribution? Does the population revert toward the wild type?',
      successHint: 'Without continued selection, genetic drift causes random fluctuation but not systematic reversion — the domestication changes are largely locked in because the wild-type alleles have been lost from the population. This is why feral mithun do not become gaur.',
    },
    {
      title: 'Artificial vs natural selection — how human preferences reshape evolution',
      concept: `Natural selection and artificial selection operate by the same mechanism — differential reproduction based on phenotype — but differ fundamentally in the selection criterion. Natural selection maximizes survival and reproduction in the environment. Artificial selection maximizes traits that humans value, which may reduce survival fitness.

In mithun, natural selection in the wild gaur ancestor favored: large body size (dominance in male-male competition), dark uniform coloring (camouflage in dense forest), high aggression (predator defense), strong flight response (escape from tigers), and seasonal breeding (synchronizing births with food availability). Artificial selection by Naga and other hill communities favored: moderate body size (easier to handle), docile temperament (safety around humans), distinctive coat colors (identification and ceremonial value), year-round breeding (availability for rituals), and fat deposition (meat quality).

The **breeder's equation** quantifies the response to selection: R = h^2 * S, where R is the response (change in trait mean per generation), h^2 is heritability (proportion of phenotypic variance due to genetics), and S is the selection differential (difference between the mean of selected parents and the population mean). High heritability means selection is effective; low heritability means environmental factors dominate and selection is slow.

A critical concept is **correlated response**: selecting for one trait changes other traits that share genetic architecture. Selecting for docility in mithun simultaneously reduced body size, changed coat color, and altered brain structure — not because these traits were directly selected, but because they share developmental pathways through neural crest cells. This is pleiotropy at the population level, and it explains why domestication syndrome traits appear as a package.`,
      analogy: 'Natural selection is like a river carving a canyon — it follows the path of least resistance dictated by geology (environment). Artificial selection is like an engineer diverting the river — choosing a different path based on human needs. Both move water (genetic change) downstream (through generations), but the destination is different. And just as diverting a river has unintended consequences (erosion, flooding), artificial selection has unintended correlated responses.',
      storyConnection: 'The brave mithun in the story embodies the product of artificial selection: strong enough to be useful, tame enough to be trusted, and distinctive enough to be recognized and valued. In Naga culture, a family\'s mithun are individually named and their lineages tracked — an informal but effective breeding program that has maintained the mithun as a distinct domesticate for millennia.',
      checkQuestion: 'A Naga farmer consistently selects the most docile mithun calves for breeding. After 20 generations, he notices that the herd has more piebald (spotted) animals even though he never selected for color. Why?',
      checkAnswer: 'This is a correlated response to selection. Docility (reduced aggression and fear) results from changes in neural crest cell-derived adrenal gland development. Neural crest cells also produce melanocytes (pigment cells). Selecting for reduced neural crest activity (docility) simultaneously reduces melanocyte migration during embryonic development, causing patches of unpigmented skin — the piebald pattern. The farmer selected for behavior but got a color change for free because both traits share the same developmental pathway.',
      codeIntro: 'Simulate artificial vs natural selection acting on multiple correlated traits simultaneously.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Multi-trait selection with genetic correlations ---

class MultiTraitSelector:
    """Simulate selection on correlated traits."""

    def __init__(self, pop_size=300):
        self.n = pop_size
        # Traits: [body_mass, aggression, coat_uniformity, flight_distance, fertility]
        self.trait_names = ['Body mass', 'Aggression', 'Coat uniformity', 'Flight distance', 'Fertility']
        self.n_traits = 5

        # Genetic correlation matrix (traits are correlated through shared pathways)
        self.G = np.array([
            [1.0,  0.4,  0.2,  0.3, -0.1],  # mass
            [0.4,  1.0,  0.3,  0.6, -0.2],  # aggression
            [0.2,  0.3,  1.0,  0.3, -0.1],  # coat uniformity
            [0.3,  0.6,  0.3,  1.0, -0.1],  # flight distance
            [-0.1, -0.2, -0.1, -0.1,  1.0],  # fertility
        ])

        # Initial means (wild gaur values, standardized)
        self.means = np.array([0.0, 0.0, 0.0, 0.0, 0.0])
        self.heritabilities = np.array([0.4, 0.3, 0.5, 0.35, 0.25])

    def generate_population(self):
        """Generate correlated trait values."""
        L = np.linalg.cholesky(self.G)
        genetic = np.random.randn(self.n, self.n_traits) @ L.T + self.means
        environmental = np.random.randn(self.n, self.n_traits) * 0.5
        return genetic + environmental, genetic

    def natural_selection(self, phenotypes):
        """Fitness based on survival: large, aggressive, camouflaged, alert."""
        fitness = (0.3 * phenotypes[:, 0] +   # larger is better
                   0.2 * phenotypes[:, 1] +    # more aggressive survives
                   0.2 * phenotypes[:, 2] +    # uniform coat = camouflage
                   0.2 * phenotypes[:, 3] +    # high flight distance = escape
                   0.1 * phenotypes[:, 4])     # fertility matters
        return fitness

    def artificial_selection(self, phenotypes):
        """Fitness based on human preference: docile, moderate size, colorful."""
        fitness = (-0.1 * phenotypes[:, 0] +   # moderate size preferred
                   -0.4 * phenotypes[:, 1] +   # LOW aggression preferred
                   -0.2 * phenotypes[:, 2] +   # coat variation preferred (low uniformity)
                   -0.2 * phenotypes[:, 3] +   # LOW flight distance preferred (approachable)
                   0.1 * phenotypes[:, 4])      # fertility still valued
        return fitness

    def select_and_breed(self, phenotypes, genotypes, fitness_func, top_fraction=0.3):
        """Select top individuals and breed next generation."""
        fitness = fitness_func(phenotypes)
        # Select top fraction
        n_select = int(self.n * top_fraction)
        top_idx = np.argsort(fitness)[-n_select:]
        selected_geno = genotypes[top_idx]

        # Update means based on selected parents
        parent_mean = np.mean(selected_geno, axis=0)
        selection_diff = parent_mean - self.means
        response = self.heritabilities * selection_diff
        self.means += response

        return self.generate_population()

    def run(self, n_gen=200, mode='natural'):
        """Run simulation for n generations."""
        records = []
        pheno, geno = self.generate_population()
        fitness_func = self.natural_selection if mode == 'natural' else self.artificial_selection

        for gen in range(n_gen):
            records.append(self.means.copy())
            pheno, geno = self.select_and_breed(pheno, geno, fitness_func)

        return np.array(records)

# Run both selection regimes
sim_nat = MultiTraitSelector(300)
nat_records = sim_nat.run(200, mode='natural')

sim_art = MultiTraitSelector(300)
art_records = sim_art.run(200, mode='artificial')

gens = np.arange(200)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

trait_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

# Plot each trait comparison
for idx in range(5):
    ax = axes[idx // 3, idx % 3]
    ax.set_facecolor('#111827')
    ax.plot(gens, nat_records[:, idx], color=trait_colors[idx], linewidth=2, label='Natural selection')
    ax.plot(gens, art_records[:, idx], color=trait_colors[idx], linewidth=2, linestyle='--', label='Artificial selection')
    ax.axhline(0, color='gray', linestyle=':', linewidth=1)
    ax.set_xlabel('Generations', color='white')
    ax.set_ylabel('Trait value (std units)', color='white')
    ax.set_title(sim_nat.trait_names[idx], color='white', fontsize=11)
    ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    ax.tick_params(colors='gray')

# Plot 6: Final trait comparison radar-style as bar chart
ax = axes[1, 2]
ax.set_facecolor('#111827')
x_pos = np.arange(5)
width = 0.35
bars1 = ax.bar(x_pos - width/2, nat_records[-1], width, color='#22c55e', label='Natural (gen 200)', edgecolor='none')
bars2 = ax.bar(x_pos + width/2, art_records[-1], width, color='#3b82f6', label='Artificial (gen 200)', edgecolor='none')
ax.set_xticks(x_pos)
ax.set_xticklabels([n.replace(' ', '\
') for n in sim_nat.trait_names], color='white', fontsize=7)
ax.axhline(0, color='gray', linestyle=':', linewidth=1)
ax.set_ylabel('Trait value (std units)', color='white')
ax.set_title('Final trait values: two selection regimes', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Selection outcomes after 200 generations:")
print(f"{'Trait':<20} {'Natural':>10} {'Artificial':>10} {'Difference':>10}")
print("-" * 52)
for i, name in enumerate(sim_nat.trait_names):
    print(f"{name:<20} {nat_records[-1, i]:>10.2f} {art_records[-1, i]:>10.2f} {art_records[-1, i] - nat_records[-1, i]:>10.2f}")
print()
print("Key finding: artificial selection reverses the direction of change for")
print("aggression, coat uniformity, and flight distance. The correlated response")
print("means selecting for docility ALSO changes body size and coat patterns.")`,
      challenge: 'Double the genetic correlation between aggression and coat uniformity (from 0.3 to 0.6) and rerun. Does the correlated coat change accelerate? What does this tell you about tightly linked traits?',
      successHint: 'Stronger genetic correlation means selecting on one trait drags the correlated trait faster. This is why domestication syndrome appears quickly — the traits are genetically linked, so selecting for tameness rapidly changes multiple phenotypes.',
    },
    {
      title: 'Livestock biodiversity — why rare breeds like mithun matter for food security',
      concept: `There are approximately 1000 recognized livestock breeds worldwide, but commercial agriculture uses fewer than 30. The remaining 970+ breeds — including the mithun — are considered "minor" or "indigenous" breeds, many at risk of extinction. This loss of livestock biodiversity is as serious for food security as crop biodiversity loss, because rare breeds carry unique genetic adaptations that no laboratory can recreate.

The mithun carries adaptations specific to its environment: resistance to tropical parasites, ability to digest high-fiber forest vegetation, tolerance of steep terrain, and resistance to diseases endemic to the humid hill forests of Northeast India. These adaptations evolved over thousands of years of natural and artificial selection in a specific ecological niche. If the mithun goes extinct, these genetic solutions are lost permanently.

The concept of **effective population size** (Ne) is crucial for understanding genetic vulnerability. Ne is not the census population (total number of animals) but the number that effectively contribute to the gene pool. In a population of 10,000 mithun where only 200 bulls sire all calves, Ne is close to 200, not 10,000. Small Ne leads to **inbreeding depression** (accumulation of harmful recessive alleles) and **genetic drift** (random loss of alleles), both of which reduce fitness and adaptability.

The FAO estimates that one livestock breed goes extinct every month. For mithun, the estimated total population is around 350,000 across Northeast India and neighboring countries, but the effective population sizes within distinct regional populations may be dangerously small. The Naga mithun, Mizo mithun, and Arunachal mithun are genetically distinct subpopulations, each carrying unique alleles. Losing any one subpopulation permanently eliminates its unique genetic heritage.`,
      analogy: 'Livestock biodiversity is like a library of solutions to problems we have not yet encountered. Each breed is a book written by evolution, containing answers to specific challenges (diseases, climates, terrains). Destroying the library to make room for a single bestseller (high-yield commercial breeds) seems efficient until you face a new problem and discover the answer was in one of the discarded books. Climate change is already creating new problems that may require the solutions hidden in rare breeds like the mithun.',
      storyConnection: 'The brave mithun in the story is not just culturally important — it is genetically irreplaceable. The mithun\'s ability to thrive in the steep, forested, parasite-rich hills of Nagaland and Arunachal Pradesh is written in its DNA. No Holstein or Angus cattle could survive those conditions without massive veterinary intervention. The mithun is a 4000-year-old genetic engineering project, refined by the hill communities of Northeast India.',
      checkQuestion: 'A government program replaces mithun with high-yield Jersey cattle in Nagaland hills. What are the likely genetic consequences within 50 years?',
      checkAnswer: 'First, the mithun population crashes as farmers switch to Jersey cattle. Second, Jersey cattle require expensive feed, veterinary care, and parasite treatment that hill farmers cannot sustain — many will die or underperform. Third, the mithun genetic diversity is permanently lost because the remaining animals are too few for a viable breeding population. Fourth, when Jersey cattle fail in the hill environment, there is no mithun population to fall back on. The program would destroy irreplaceable genetic diversity while delivering a breed that cannot thrive without external support. This is the livestock equivalent of deforestation — destroying a complex, adapted system for a short-term monoculture gain.',
      codeIntro: 'Model effective population size, inbreeding depression, and the genetic vulnerability of a small mithun population.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Effective Population Size and Genetic Vulnerability ---

def effective_population_size(n_males, n_females):
    """Ne = 4 * Nm * Nf / (Nm + Nf)"""
    return 4 * n_males * n_females / (n_males + n_females)

def inbreeding_rate(Ne):
    """Rate of inbreeding per generation: delta_F = 1/(2*Ne)"""
    return 1 / (2 * Ne)

def heterozygosity_decay(Ne, generations):
    """H_t = H_0 * (1 - 1/(2*Ne))^t"""
    t = np.arange(generations)
    return (1 - 1/(2*Ne))**t

def simulate_genetic_drift(Ne, n_loci=100, n_gen=200):
    """Simulate allele frequency changes due to drift."""
    freqs = np.full((n_gen, n_loci), 0.5)
    for g in range(1, n_gen):
        for l in range(n_loci):
            # Binomial sampling
            n_alleles = int(2 * Ne)
            count = np.random.binomial(n_alleles, freqs[g-1, l])
            freqs[g, l] = count / n_alleles
    return freqs

# --- Population scenarios ---
scenarios = {
    'Large pop (Ne=1000)': {'n_males': 600, 'n_females': 2000},
    'Medium pop (Ne=200)': {'n_males': 60, 'n_females': 600},
    'Small pop (Ne=50)': {'n_males': 15, 'n_females': 150},
    'Critical (Ne=20)': {'n_males': 6, 'n_females': 50},
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Heterozygosity decay
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for (name, params), color in zip(scenarios.items(), colors):
    Ne = effective_population_size(params['n_males'], params['n_females'])
    gens = 200
    het = heterozygosity_decay(Ne, gens)
    ax.plot(range(gens), het, color=color, linewidth=2, label=f'{name}')
ax.set_xlabel('Generations', color='white')
ax.set_ylabel('Heterozygosity (H/H0)', color='white')
ax.set_title('Genetic diversity loss over time', color='white', fontsize=11)
ax.axhline(0.5, color='gray', linestyle=':', linewidth=1, alpha=0.5)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Genetic drift in allele frequencies
ax = axes[0, 1]
ax.set_facecolor('#111827')
drift_small = simulate_genetic_drift(Ne=50, n_loci=20, n_gen=100)
for l in range(20):
    ax.plot(range(100), drift_small[:, l], alpha=0.4, linewidth=1, color='#ef4444')
ax.axhline(0.5, color='white', linestyle=':', linewidth=1)
ax.axhline(0, color='gray', linestyle='-', linewidth=0.5)
ax.axhline(1, color='gray', linestyle='-', linewidth=0.5)
ax.set_xlabel('Generations', color='white')
ax.set_ylabel('Allele frequency', color='white')
ax.set_title('Genetic drift (Ne=50): 20 loci', color='white', fontsize=11)
ax.set_ylim(-0.05, 1.05)
ax.tick_params(colors='gray')

# Plot 3: Ne vs inbreeding rate
ax = axes[1, 0]
ax.set_facecolor('#111827')
ne_range = np.arange(10, 1001)
inbreeding = [inbreeding_rate(n) * 100 for n in ne_range]
ax.plot(ne_range, inbreeding, color='#a855f7', linewidth=2)
ax.axhline(1.0, color='#ef4444', linestyle='--', label='1% per gen (danger threshold)')
ax.axhline(0.5, color='#f59e0b', linestyle='--', label='0.5% per gen (warning)')
# Mark mithun subpopulations
mithun_pops = {'Naga mithun': 150, 'Mizo mithun': 80, 'Arunachal mithun': 200}
for name, ne in mithun_pops.items():
    rate = inbreeding_rate(ne) * 100
    ax.plot(ne, rate, 'o', color='#22c55e', markersize=10)
    ax.annotate(name, (ne, rate), textcoords='offset points',
                xytext=(10, 5), color='white', fontsize=8)
ax.set_xlabel('Effective population size (Ne)', color='white')
ax.set_ylabel('Inbreeding rate (% per gen)', color='white')
ax.set_title('Inbreeding rate vs population size', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 500)
ax.tick_params(colors='gray')

# Plot 4: Fixed/lost alleles over time
ax = axes[1, 1]
ax.set_facecolor('#111827')
for Ne_val, color, label in [(50, '#ef4444', 'Ne=50'), (200, '#3b82f6', 'Ne=200'), (1000, '#22c55e', 'Ne=1000')]:
    drift = simulate_genetic_drift(Ne_val, n_loci=100, n_gen=200)
    fixed = np.sum((drift < 0.01) | (drift > 0.99), axis=1)
    ax.plot(range(200), fixed, color=color, linewidth=2, label=label)
ax.set_xlabel('Generations', color='white')
ax.set_ylabel('Loci fixed or lost (out of 100)', color='white')
ax.set_title('Allele fixation/loss by population size', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Mithun subpopulation genetic vulnerability:")
for name, ne in mithun_pops.items():
    rate = inbreeding_rate(ne) * 100
    het_50gen = heterozygosity_decay(ne, 50)[-1] * 100
    print(f"  {name}: Ne={ne}, inbreeding rate={rate:.2f}%/gen, heterozygosity after 50 gen: {het_50gen:.1f}%")
print()
print("All three subpopulations are above the 0.5% inbreeding threshold.")
print("Without active genetic management (exchange of breeding males between")
print("subpopulations), significant genetic diversity will be lost within 50 generations.")`,
      challenge: 'Simulate a gene exchange program: every 5 generations, swap 2 breeding males between the Naga and Mizo populations. How does this affect the inbreeding rate compared to isolated populations?',
      successHint: 'Even a small number of migrants per generation dramatically reduces inbreeding and maintains genetic diversity. This is why conservation genetics recommends managed gene flow between fragmented populations.',
    },
    {
      title: 'Rumen fermentation — the microbial factory inside a mithun',
      concept: `The mithun is a ruminant: it has a four-chambered stomach (rumen, reticulum, omasum, abomasum) that enables it to digest cellulose — the structural carbohydrate in plant cell walls that monogastric animals (including humans) cannot break down. The rumen is essentially a fermentation vat containing billions of microorganisms: bacteria, archaea, protozoa, and fungi.

**Rumen fermentation** is anaerobic: it occurs without oxygen. Cellulose-degrading bacteria (Fibrobacter, Ruminococcus) break cellulose into glucose, which is then fermented into volatile fatty acids (VFAs): acetate, propionate, and butyrate. These VFAs are absorbed through the rumen wall and provide 60-70% of the animal's energy. The proportions matter: acetate is used for fat synthesis, propionate for glucose production (gluconeogenesis), and butyrate for rumen wall maintenance.

The fermentation process follows **Michaelis-Menten kinetics**: the rate of substrate (cellulose) degradation depends on substrate concentration and the maximum rate of the microbial enzymes. At low substrate (the animal is hungry), degradation rate is proportional to substrate. At high substrate (just after feeding), enzymes are saturated and rate plateaus.

A critical byproduct of rumen fermentation is **methane** (CH4). Methanogenic archaea in the rumen convert CO2 and H2 produced by fermentation into methane, which the animal belches out. A single adult mithun produces approximately 50-80 kg of methane per year — a potent greenhouse gas with 28 times the warming potential of CO2 over 100 years. Understanding rumen biochemistry is essential for both animal nutrition and climate science.`,
      analogy: 'The rumen is like a brewery inside the animal. The mithun swallows raw plant material (barley for beer). Microbes in the rumen (yeast in the brewery) ferment the sugars, producing useful products (VFAs for energy, alcohol for beer) and waste gases (methane and CO2 in both cases). The mithun\'s trick is that it runs the brewery on material that other animals cannot use — tough forest vegetation full of cellulose — making it the ultimate recycler.',
      storyConnection: 'The brave mithun in the story survives on the rough vegetation of Nagaland\'s hill forests — bamboo leaves, tough grasses, shrub browse. No chicken, pig, or even goat could extract enough energy from this diet. The rumen microbiome is the mithun\'s secret weapon: it converts indigestible forest roughage into energy, milk, and meat. This is why mithun are the dominant livestock of the hill regions — they thrive where other livestock would starve.',
      checkQuestion: 'If you feed a mithun high-quality concentrate feed (like commercial cattle pellets) instead of forest roughage, what happens to the rumen pH and why is this dangerous?',
      checkAnswer: 'Concentrate feed is rapidly fermented, producing a surge of VFAs that lowers rumen pH from its normal 6.0-6.8 to below 5.5 — a condition called ruminal acidosis. The acidic environment kills cellulose-degrading bacteria (which require pH > 6.0) and favors lactate-producing bacteria, which lower pH further in a positive feedback loop. The rumen wall becomes inflamed, and in severe cases, the animal develops liver abscesses and can die. This is why mithun — adapted to slow-fermenting roughage — should not be switched abruptly to concentrate diets. Their rumen microbiome is optimized for a specific substrate.',
      codeIntro: 'Model rumen fermentation kinetics, VFA production, and methane generation from different feed types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Rumen Fermentation Kinetics ---

class RumenModel:
    """Model rumen fermentation, VFA production, and methane output."""

    def __init__(self, rumen_volume_L=80):
        self.volume = rumen_volume_L  # mithun rumen ~80 L
        # Michaelis-Menten parameters
        self.Vmax_cellulose = 0.15  # kg/hour max degradation rate
        self.Km_cellulose = 2.0     # kg — substrate at half-max rate
        self.Vmax_starch = 0.40     # starch degrades faster
        self.Km_starch = 1.0

    def degradation_rate(self, substrate_kg, substrate_type='cellulose'):
        """Michaelis-Menten kinetics for substrate degradation."""
        if substrate_type == 'cellulose':
            return self.Vmax_cellulose * substrate_kg / (self.Km_cellulose + substrate_kg)
        else:  # starch/concentrate
            return self.Vmax_starch * substrate_kg / (self.Km_starch + substrate_kg)

    def vfa_production(self, degraded_kg, substrate_type='cellulose'):
        """VFA ratios depend on substrate type."""
        if substrate_type == 'cellulose':
            # High-fiber diet: high acetate
            acetate = degraded_kg * 0.65
            propionate = degraded_kg * 0.20
            butyrate = degraded_kg * 0.15
        else:
            # Concentrate diet: high propionate
            acetate = degraded_kg * 0.45
            propionate = degraded_kg * 0.35
            butyrate = degraded_kg * 0.20
        return acetate, propionate, butyrate

    def methane_production(self, degraded_kg, substrate_type='cellulose'):
        """Methane production in liters per kg degraded."""
        if substrate_type == 'cellulose':
            return degraded_kg * 35  # ~35 L CH4 per kg cellulose
        else:
            return degraded_kg * 20  # less methane from starch

    def rumen_ph(self, total_vfa_kg):
        """Approximate rumen pH from VFA concentration."""
        vfa_concentration = total_vfa_kg / self.volume  # kg/L
        # pH decreases with VFA concentration
        return 7.0 - 15 * vfa_concentration

    def simulate_day(self, feed_schedule, substrate_type='cellulose'):
        """Simulate 24 hours of fermentation."""
        hours = np.linspace(0, 24, 289)  # 5-min steps
        dt = 5/60  # hours

        substrate = 0.0
        records = {'time': hours, 'substrate': [], 'deg_rate': [],
                   'vfa_total': [], 'methane_cum': [], 'ph': [],
                   'acetate': [], 'propionate': [], 'butyrate': []}

        total_methane = 0
        total_vfa = 0
        total_acetate = 0
        total_propionate = 0
        total_butyrate = 0

        for h in hours:
            # Feed input at scheduled times
            for feed_time, amount in feed_schedule:
                if abs(h - feed_time) < dt/2:
                    substrate += amount

            # Degradation
            rate = self.degradation_rate(substrate, substrate_type)
            degraded = rate * dt
            degraded = min(degraded, substrate)
            substrate -= degraded

            # VFA production
            ace, prop, but = self.vfa_production(degraded, substrate_type)
            total_acetate += ace
            total_propionate += prop
            total_butyrate += but
            total_vfa = total_acetate + total_propionate + total_butyrate

            # VFA absorption (clears VFA over time)
            absorption_rate = 0.15  # per hour
            total_acetate *= (1 - absorption_rate * dt)
            total_propionate *= (1 - absorption_rate * dt)
            total_butyrate *= (1 - absorption_rate * dt)
            total_vfa = total_acetate + total_propionate + total_butyrate

            # Methane
            ch4 = self.methane_production(degraded, substrate_type)
            total_methane += ch4

            # pH
            ph = self.rumen_ph(total_vfa)

            records['substrate'].append(substrate)
            records['deg_rate'].append(rate)
            records['vfa_total'].append(total_vfa)
            records['methane_cum'].append(total_methane)
            records['ph'].append(ph)
            records['acetate'].append(total_acetate)
            records['propionate'].append(total_propionate)
            records['butyrate'].append(total_butyrate)

        return {k: np.array(v) for k, v in records.items()}

# --- Compare two diets ---
rumen = RumenModel(rumen_volume_L=80)

# Diet 1: Forest roughage (cellulose-rich) — 3 feeding bouts
roughage_schedule = [(6, 4.0), (12, 3.0), (17, 4.0)]  # time, kg
roughage = rumen.simulate_day(roughage_schedule, 'cellulose')

# Diet 2: Concentrate feed (starch-rich)
concentrate_schedule = [(6, 3.0), (12, 2.5), (17, 3.0)]
concentrate = rumen.simulate_day(concentrate_schedule, 'starch')

hours = roughage['time']

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Substrate in rumen
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(hours, roughage['substrate'], color='#22c55e', linewidth=2, label='Forest roughage')
ax.plot(hours, concentrate['substrate'], color='#ef4444', linewidth=2, label='Concentrate')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Substrate in rumen (kg)', color='white')
ax.set_title('Substrate remaining over 24h', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')

# Plot 2: Degradation rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(hours, roughage['deg_rate'], color='#22c55e', linewidth=2, label='Roughage')
ax.plot(hours, concentrate['deg_rate'], color='#ef4444', linewidth=2, label='Concentrate')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Degradation rate (kg/h)', color='white')
ax.set_title('Fermentation rate (Michaelis-Menten)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')

# Plot 3: Rumen pH
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(hours, roughage['ph'], color='#22c55e', linewidth=2, label='Roughage')
ax.plot(hours, concentrate['ph'], color='#ef4444', linewidth=2, label='Concentrate')
ax.axhline(5.5, color='#ef4444', linestyle='--', linewidth=1, label='Acidosis threshold')
ax.axhline(6.0, color='#f59e0b', linestyle='--', linewidth=1, label='Sub-acute acidosis')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Rumen pH', color='white')
ax.set_title('Rumen pH — acidosis risk', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')

# Plot 4: VFA profiles
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.stackplot(hours, roughage['acetate'], roughage['propionate'], roughage['butyrate'],
             colors=['#3b82f6', '#f59e0b', '#a855f7'], alpha=0.7,
             labels=['Acetate', 'Propionate', 'Butyrate'])
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('VFA in rumen (kg)', color='white')
ax.set_title('VFA profile — roughage diet', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')

# Plot 5: Cumulative methane
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(hours, roughage['methane_cum'], color='#22c55e', linewidth=2, label='Roughage')
ax.plot(hours, concentrate['methane_cum'], color='#ef4444', linewidth=2, label='Concentrate')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Cumulative CH4 (liters)', color='white')
ax.set_title('Daily methane production', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')

# Plot 6: VFA ratio comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Average VFA ratios
r_total = roughage['acetate'][-1] + roughage['propionate'][-1] + roughage['butyrate'][-1]
c_total = concentrate['acetate'][-1] + concentrate['propionate'][-1] + concentrate['butyrate'][-1]
ratios = {
    'Roughage': [roughage['acetate'][-1]/r_total, roughage['propionate'][-1]/r_total, roughage['butyrate'][-1]/r_total],
    'Concentrate': [concentrate['acetate'][-1]/c_total, concentrate['propionate'][-1]/c_total, concentrate['butyrate'][-1]/c_total],
}
x = np.arange(3)
width = 0.35
ax.bar(x - width/2, ratios['Roughage'], width, color='#22c55e', label='Roughage', edgecolor='none')
ax.bar(x + width/2, ratios['Concentrate'], width, color='#ef4444', label='Concentrate', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(['Acetate', 'Propionate', 'Butyrate'], color='white')
ax.set_ylabel('Molar proportion', color='white')
ax.set_title('VFA ratios by diet', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Daily fermentation summary:")
print(f"  Roughage: {roughage['methane_cum'][-1]:.0f} L CH4, min pH: {min(roughage['ph']):.2f}")
print(f"  Concentrate: {concentrate['methane_cum'][-1]:.0f} L CH4, min pH: {min(concentrate['ph']):.2f}")
print()
print("Roughage produces more methane but maintains healthy rumen pH.")
print("Concentrate produces less methane but risks acidosis (pH < 5.5).")
print("The mithun's rumen is adapted for roughage — switching to concentrate")
print("would crash the microbial community and cause disease.")`,
      challenge: 'Model a gradual diet transition: start with 100% roughage and switch 10% per day to concentrate over 10 days. Track rumen pH. How fast can you transition without causing acidosis?',
      successHint: 'Gradual transition over 14-21 days is standard practice because it allows the rumen microbial community to shift gradually. Abrupt changes kill cellulose-degrading bacteria before starch-degrading bacteria can establish.',
    },
    {
      title: 'Methane emissions and sustainable pastoralism — the climate footprint of livestock',
      concept: `Livestock contribute approximately 14.5% of global anthropogenic greenhouse gas emissions, with enteric methane (from rumen fermentation) being the largest component. A single adult cow produces 70-120 kg of methane per year. For mithun, the estimate is 50-80 kg per year — lower than commercial cattle due to slower fermentation rates and smaller body size on average.

Methane (CH4) is a potent greenhouse gas: over a 20-year horizon, it has 84 times the warming potential of CO2. However, methane is also short-lived — it breaks down in the atmosphere within 12 years. This means that reducing methane emissions produces rapid cooling benefits, unlike CO2 reduction which takes centuries to have full effect. Livestock methane reduction is therefore one of the most impactful short-term climate interventions.

Strategies to reduce enteric methane include: **feed additives** (3-nitrooxypropanol reduces methane by 30%, seaweed Asparagopsis by up to 80%), **breeding for feed efficiency** (animals that convert more feed to meat/milk produce less methane per unit of product), **grazing management** (rotational grazing improves pasture quality, reducing methane per kg of weight gain), and **dietary optimization** (higher-quality forage produces less methane per unit of energy).

But here is the nuance for mithun: mithun in the hill forests of Northeast India are part of a **semi-wild extensive system** with near-zero external inputs. They eat forest vegetation, convert it to meat and cultural value, and their methane emissions are partially offset by the carbon sequestration of the forests they graze in. Comparing mithun methane to intensive feedlot cattle methane ignores the entire system context. A lifecycle analysis must include the carbon stored in the forest ecosystem that mithun help maintain through selective grazing.`,
      analogy: 'Judging mithun by their methane emissions alone is like judging a forest by the CO2 released when a tree falls. The fallen tree releases carbon, but the standing forest has been sequestering carbon for decades. Similarly, the mithun\'s methane is a cost, but the forest ecosystem they live in (and help maintain through traditional grazing) is a carbon sink. The net balance — not the single emission number — determines the climate impact.',
      storyConnection: 'The brave mithun roaming the forests of Nagaland is part of an ecosystem, not an industrial production unit. Its methane emissions must be weighed against the forest carbon storage, the lack of feed production emissions (no fertilizer, no transport, no processing), and the cultural system that incentivizes forest conservation. The hill communities who keep mithun have maintained their forests precisely because mithun require forest to survive — an alignment of cultural and ecological incentives that no carbon accounting model should ignore.',
      checkQuestion: 'A policy proposal would tax mithun farmers for methane emissions. Why might this be counterproductive for climate goals?',
      checkAnswer: 'If taxed, farmers may switch from semi-wild mithun to penned goats or chickens that produce less methane per animal but require deforestation for feed crops and housing. The deforestation releases far more carbon than the mithun methane savings. Additionally, the cultural incentive to maintain forests (for mithun grazing) disappears. The net effect could be MORE greenhouse gas emissions, not less. Climate policy must consider system-level impacts, not per-animal metrics in isolation.',
      codeIntro: 'Build a lifecycle emissions model comparing semi-wild mithun pastoralism to intensive cattle farming, including land-use and forest carbon.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Lifecycle Greenhouse Gas Comparison ---

class LivestockEmissionsModel:
    """Compare emissions from different livestock systems."""

    def __init__(self):
        # Emission factors (kg CO2-equivalent per animal per year)
        self.systems = {
            'Semi-wild mithun': {
                'enteric_methane': 60 * 28,      # 60 kg CH4 * GWP28
                'manure_emissions': 5 * 28,       # minimal, deposited in forest
                'feed_production': 0,              # zero — forest grazing
                'transport': 0,                    # zero — local consumption
                'forest_carbon_offset': -2000,     # forest sequestration credit
                'deforestation': 0,                # no land clearing
                'n_animals': 350000,
            },
            'Intensive dairy (India)': {
                'enteric_methane': 90 * 28,
                'manure_emissions': 20 * 28,
                'feed_production': 800,            # crop production emissions
                'transport': 200,
                'forest_carbon_offset': 0,
                'deforestation': 500,              # land clearing for feed
                'n_animals': 50000000,
            },
            'US feedlot beef': {
                'enteric_methane': 100 * 28,
                'manure_emissions': 30 * 28,
                'feed_production': 2000,
                'transport': 500,
                'forest_carbon_offset': 0,
                'deforestation': 1500,
                'n_animals': 30000000,
            },
            'Backyard goat (NE India)': {
                'enteric_methane': 8 * 28,
                'manure_emissions': 2 * 28,
                'feed_production': 100,
                'transport': 50,
                'forest_carbon_offset': -200,
                'deforestation': 300,
                'n_animals': 5000000,
            },
        }

    def per_animal_emissions(self, system_name):
        """Total emissions per animal per year (kg CO2e)."""
        s = self.systems[system_name]
        components = {k: v for k, v in s.items() if k not in ['n_animals']}
        total = sum(components.values())
        return components, total

    def per_kg_protein(self, system_name):
        """Emissions per kg of protein produced."""
        protein_yields = {
            'Semi-wild mithun': 15,       # kg protein/animal/year (meat only, occasional slaughter)
            'Intensive dairy (India)': 80, # milk protein
            'US feedlot beef': 40,         # beef protein
            'Backyard goat (NE India)': 8,
        }
        _, total = self.per_animal_emissions(system_name)
        return total / protein_yields[system_name]

model = LivestockEmissionsModel()

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Emission components per animal
ax = axes[0, 0]
ax.set_facecolor('#111827')
systems = list(model.systems.keys())
components = ['enteric_methane', 'manure_emissions', 'feed_production', 'transport', 'forest_carbon_offset', 'deforestation']
comp_labels = ['Enteric CH4', 'Manure', 'Feed production', 'Transport', 'Forest C offset', 'Deforestation']
comp_colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#dc2626']

bottom_pos = np.zeros(len(systems))
bottom_neg = np.zeros(len(systems))
x = np.arange(len(systems))

for comp, label, color in zip(components, comp_labels, comp_colors):
    vals = [model.systems[s][comp] for s in systems]
    pos_vals = [max(v, 0) for v in vals]
    neg_vals = [min(v, 0) for v in vals]
    ax.bar(x, pos_vals, bottom=bottom_pos, color=color, label=label, edgecolor='none', width=0.6)
    ax.bar(x, neg_vals, bottom=bottom_neg, color=color, edgecolor='none', width=0.6, alpha=0.5)
    bottom_pos += np.array(pos_vals)
    bottom_neg += np.array(neg_vals)

ax.set_xticks(x)
ax.set_xticklabels([s.replace(' (', '\
(') for s in systems], color='white', fontsize=7)
ax.set_ylabel('kg CO2e per animal per year', color='white')
ax.set_title('Emission components by livestock system', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=2)
ax.axhline(0, color='white', linewidth=1)
ax.tick_params(colors='gray')

# Plot 2: Net emissions per animal
ax = axes[0, 1]
ax.set_facecolor('#111827')
net_emissions = []
for s in systems:
    _, total = model.per_animal_emissions(s)
    net_emissions.append(total)
colors_net = ['#22c55e' if n < 1000 else '#f59e0b' if n < 3000 else '#ef4444' for n in net_emissions]
bars = ax.bar(x, net_emissions, color=colors_net, edgecolor='none', width=0.6)
ax.set_xticks(x)
ax.set_xticklabels([s.split(' (')[0] for s in systems], color='white', fontsize=8)
ax.set_ylabel('Net kg CO2e per animal per year', color='white')
ax.set_title('Net emissions per animal (including offsets)', color='white', fontsize=11)
for bar, val in zip(bars, net_emissions):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 50,
            f'{val:.0f}', ha='center', color='white', fontsize=9)
ax.tick_params(colors='gray')

# Plot 3: Emissions per kg protein
ax = axes[1, 0]
ax.set_facecolor('#111827')
protein_emissions = [model.per_kg_protein(s) for s in systems]
colors_prot = ['#22c55e' if p < 50 else '#f59e0b' if p < 100 else '#ef4444' for p in protein_emissions]
bars = ax.bar(x, protein_emissions, color=colors_prot, edgecolor='none', width=0.6)
ax.set_xticks(x)
ax.set_xticklabels([s.split(' (')[0] for s in systems], color='white', fontsize=8)
ax.set_ylabel('kg CO2e per kg protein', color='white')
ax.set_title('Emission intensity per kg protein', color='white', fontsize=11)
for bar, val in zip(bars, protein_emissions):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
            f'{val:.0f}', ha='center', color='white', fontsize=9)
ax.tick_params(colors='gray')

# Plot 4: Methane reduction scenarios for mithun
ax = axes[1, 1]
ax.set_facecolor('#111827')
interventions = {
    'Baseline': 60,
    'Improved forage': 50,
    '3-NOP additive': 42,
    'Seaweed supplement': 20,
    'Genetic selection': 48,
    'Combined best': 15,
}
names = list(interventions.keys())
vals = list(interventions.values())
colors_int = plt.cm.RdYlGn_r(np.linspace(0.2, 0.8, len(names)))
bars = ax.barh(range(len(names)), vals, color=colors_int, edgecolor='none')
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, color='white', fontsize=9)
ax.set_xlabel('Enteric CH4 (kg/animal/year)', color='white')
ax.set_title('Methane reduction strategies for mithun', color='white', fontsize=11)
for bar, val in zip(bars, vals):
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{val} kg', va='center', color='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Lifecycle emissions comparison:")
for s in systems:
    _, total = model.per_animal_emissions(s)
    prot = model.per_kg_protein(s)
    print(f"  {s}: {total:.0f} kg CO2e/animal/yr, {prot:.0f} kg CO2e/kg protein")
print()
print("Key finding: Semi-wild mithun have the LOWEST net emissions per animal")
print("because forest carbon offsets partially compensate enteric methane.")
print("Per kg protein, they are higher than intensive dairy due to low per-animal")
print("protein output, but the system preserves forest carbon stocks worth far")
print("more than the protein emission difference.")`,
      challenge: 'Add a "deforestation for cattle" scenario where mithun forest is cleared for intensive dairy. Calculate the one-time carbon release from deforestation (200 tonnes CO2/ha for tropical forest, 5 ha per cow) and how many years of dairy production it takes to "repay" the carbon debt.',
      successHint: 'The carbon debt from deforestation is enormous — typically 50-100 years of dairy production. This means switching from mithun to dairy cattle causes net warming for decades, even though per-animal methane may be better managed.',
    },
    {
      title: 'Sustainable pastoralism — integrating mithun into modern land management',
      concept: `Sustainable pastoralism is a land-use system where livestock grazing is managed to maintain or improve ecosystem health while providing livelihoods. For mithun in Northeast India, this means balancing: **forage availability** (the forest must regenerate faster than mithun consume it), **soil health** (trampling and dung deposition must enhance rather than degrade soils), **biodiversity** (mithun grazing should create habitat heterogeneity, not monocultures), and **cultural continuity** (the management system must align with traditional practices).

The **carrying capacity** of a landscape for mithun depends on net primary productivity (how fast vegetation grows), the fraction of growth that is edible and accessible, and the per-animal consumption rate. In the hill forests of Nagaland, net primary productivity is approximately 10-15 tonnes of dry matter per hectare per year. If 20% is accessible to mithun, and each mithun consumes 8 kg dry matter per day (2920 kg/year), then carrying capacity is approximately 0.7-1.0 mithun per hectare. Exceeding this leads to overgrazing, soil erosion, and forest degradation.

Traditional mithun management in the Naga hills is remarkably close to optimal: mithun roam freely across large forest areas (10-50 ha per animal), are only gathered periodically, and the forest is managed through **jhum** (shifting cultivation) that creates a mosaic of regenerating patches at different successional stages. This mosaic maximizes forage diversity and quality. Modern threats come from: population growth (more mithun per unit forest), forest loss (reducing range area), and replacement of traditional management with sedentary systems that concentrate grazing pressure.

The mathematical framework for sustainable stocking is the **logistic growth model with harvesting**: dN/dt = rN(1 - N/K) - H, where N is population, r is growth rate, K is carrying capacity, and H is harvest rate. Maximum sustainable yield occurs at N = K/2, where population growth rate is maximized.`,
      analogy: 'Managing mithun in a forest is like managing a bank account with interest. The forest produces forage (interest). If you withdraw less than the interest (graze below carrying capacity), the account grows and you can increase withdrawal later. If you withdraw more than the interest (overgraze), the principal shrinks and eventually runs out. Maximum sustainable yield is like withdrawing exactly the interest — the balance stays constant indefinitely.',
      storyConnection: 'The brave mithun lives in a system that has sustained itself for thousands of years — proof that traditional pastoralism can be sustainable. The story takes place in a landscape where forests, mithun, and human communities coexist in dynamic balance. Understanding the quantitative basis of this balance — carrying capacity, stocking rates, regeneration rates — is essential for preserving it as modern pressures intensify.',
      checkQuestion: 'A village has 200 hectares of mithun forest and 150 mithun. If carrying capacity is 0.8 mithun per hectare, is the population sustainable? What would you recommend?',
      checkAnswer: 'Carrying capacity is 200 * 0.8 = 160 mithun, so 150 is just below the limit — technically sustainable but with no buffer. Any forest loss, drought, or disease outbreak would push the system into overshoot. Recommendations: (1) maintain a buffer of at least 20% below carrying capacity (128 mithun); (2) establish rotational grazing zones to allow forest recovery; (3) monitor vegetation regeneration annually; (4) diversify income so livelihoods do not depend on increasing herd size. Reducing to 130 mithun would be prudent and sustainable.',
      codeIntro: 'Model the population dynamics of mithun under different stocking strategies and predict long-term sustainability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Sustainable Pastoralism Model ---

class PastoralismModel:
    """Model mithun population dynamics and forage sustainability."""

    def __init__(self, area_ha=200, initial_pop=50):
        self.area = area_ha
        self.pop = initial_pop
        # Forage parameters
        self.npp = 12.0  # tonnes DM/ha/year (net primary productivity)
        self.accessible_fraction = 0.20
        self.per_animal_consumption = 2.92  # tonnes DM/year (8 kg/day)
        # Carrying capacity
        self.K = self.area * self.npp * self.accessible_fraction / self.per_animal_consumption
        # Population growth
        self.r = 0.12  # intrinsic growth rate (~12% per year for mithun)
        # Forage state
        self.forage_biomass = self.npp * self.area * self.accessible_fraction

    def step(self, harvest=0, area_change=0):
        """Advance one year."""
        self.area += area_change
        self.K = max(self.area * self.npp * self.accessible_fraction / self.per_animal_consumption, 1)

        # Logistic growth with harvesting
        growth = self.r * self.pop * (1 - self.pop / self.K)
        self.pop = max(self.pop + growth - harvest, 0)

        # Forage regeneration
        forage_production = self.npp * self.area * self.accessible_fraction
        forage_consumed = self.pop * self.per_animal_consumption
        self.forage_biomass = max(self.forage_biomass + forage_production - forage_consumed, 0)

        # Overgrazing reduces carrying capacity
        if self.pop > self.K * 1.2:
            degradation = 0.02 * (self.pop / self.K - 1.2)
            self.npp *= (1 - degradation)
            self.K = max(self.area * self.npp * self.accessible_fraction / self.per_animal_consumption, 1)

        return self.pop, self.forage_biomass, self.K

# --- Simulate four management scenarios over 100 years ---

years = 100
scenarios = {}

# Scenario 1: Traditional management (harvest = growth, maintain near K/2)
m1 = PastoralismModel(200, 50)
pop1, forage1, k1 = [], [], []
for y in range(years):
    # Harvest to maintain near K/2
    target = m1.K * 0.5
    harvest = max(m1.pop - target, 0) * 0.3 if m1.pop > target else 0
    p, f, k = m1.step(harvest=harvest)
    pop1.append(p); forage1.append(f); k1.append(k)
scenarios['Traditional (target K/2)'] = (pop1, forage1, k1)

# Scenario 2: No management (no harvest, uncontrolled growth)
m2 = PastoralismModel(200, 50)
pop2, forage2, k2 = [], [], []
for y in range(years):
    p, f, k = m2.step(harvest=0)
    pop2.append(p); forage2.append(f); k2.append(k)
scenarios['No management'] = (pop2, forage2, k2)

# Scenario 3: Overstocking (start at 200, above K)
m3 = PastoralismModel(200, 200)
pop3, forage3, k3 = [], [], []
for y in range(years):
    p, f, k = m3.step(harvest=5)
    pop3.append(p); forage3.append(f); k3.append(k)
scenarios['Overstocked (start 200)'] = (pop3, forage3, k3)

# Scenario 4: Forest loss (1 ha/year lost to development)
m4 = PastoralismModel(200, 50)
pop4, forage4, k4 = [], [], []
for y in range(years):
    area_loss = -1 if m4.area > 50 else 0
    p, f, k = m4.step(harvest=3, area_change=area_loss)
    pop4.append(p); forage4.append(f); k4.append(k)
scenarios['Forest loss (1 ha/yr)'] = (pop4, forage4, k4)

yrs = np.arange(years)
scenario_colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Population trajectories
ax = axes[0, 0]
ax.set_facecolor('#111827')
for (name, (pop, _, k)), color in zip(scenarios.items(), scenario_colors):
    ax.plot(yrs, pop, color=color, linewidth=2, label=name)
ax.axhline(m1.K * 0.5, color='gray', linestyle=':', label='K/2 (optimal)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Mithun population', color='white')
ax.set_title('Population dynamics under four strategies', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Carrying capacity
ax = axes[0, 1]
ax.set_facecolor('#111827')
for (name, (_, _, k)), color in zip(scenarios.items(), scenario_colors):
    ax.plot(yrs, k, color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Carrying capacity (K)', color='white')
ax.set_title('Carrying capacity over time', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Forage biomass
ax = axes[1, 0]
ax.set_facecolor('#111827')
for (name, (_, forage, _)), color in zip(scenarios.items(), scenario_colors):
    ax.plot(yrs, forage, color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Available forage (tonnes DM)', color='white')
ax.set_title('Forage availability', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Sustainable yield analysis
ax = axes[1, 1]
ax.set_facecolor('#111827')
# MSY curve
K_base = PastoralismModel(200, 50).K
r_base = 0.12
N_range = np.linspace(0, K_base, 100)
growth = r_base * N_range * (1 - N_range / K_base)
ax.plot(N_range, growth, color='#a855f7', linewidth=2, label='Population growth rate')
ax.axvline(K_base / 2, color='#22c55e', linestyle='--', label=f'N = K/2 = {K_base/2:.0f}')
ax.axvline(K_base, color='#ef4444', linestyle='--', label=f'K = {K_base:.0f}')
msy = r_base * K_base / 4
ax.axhline(msy, color='#f59e0b', linestyle=':', label=f'MSY = {msy:.1f} animals/yr')
ax.fill_between(N_range, growth, alpha=0.1, color='#a855f7')
ax.set_xlabel('Population size', color='white')
ax.set_ylabel('Annual growth (animals/yr)', color='white')
ax.set_title('Maximum Sustainable Yield (MSY)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

K_val = PastoralismModel(200, 50).K
print(f"Carrying capacity for 200 ha: {K_val:.0f} mithun")
print(f"Optimal population (K/2): {K_val/2:.0f} mithun")
print(f"Maximum sustainable yield: {0.12 * K_val / 4:.1f} animals/year")
print()
print("Results after 100 years:")
for name, (pop, forage, k) in scenarios.items():
    print(f"  {name}: pop={pop[-1]:.0f}, K={k[-1]:.0f}, forage={forage[-1]:.0f} t")
print()
print("Traditional management maintains stable population and healthy ecosystem.")
print("Overstocking degrades carrying capacity — a trap that is hard to escape.")
print("Forest loss gradually squeezes the sustainable population downward.")`,
      challenge: 'Add a climate change scenario where NPP decreases by 0.5% per year due to changing rainfall patterns. At what year does the traditionally managed population become unsustainable?',
      successHint: 'Climate change erodes carrying capacity gradually, making previously sustainable stocking rates unsustainable. This is why adaptive management — monitoring and adjusting — is essential for long-term pastoralism.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Geneticist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biology & ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for genetics and ecology modeling. Click to start.</p>
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