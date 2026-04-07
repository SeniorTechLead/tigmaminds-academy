import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function OrchidsPhawngpuiLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is pollination?',
      concept: `**Pollination** is the transfer of pollen from a male flower part (anther) to a female part (stigma). Without it, most plants cannot produce seeds.

Plants cannot move, so they need **vectors** (carriers) to transport pollen:
- **Wind** (anemophily): grasses, conifers — produce massive amounts of tiny, light pollen
- **Insects** (entomophily): most flowering plants — colorful, fragrant, nectar-producing
- **Birds** (ornithophily): tropical flowers — red, tubular, copious nectar
- **Bats** (chiropterophily): night-blooming flowers — pale, strong-scented

The efficiency varies enormously:
- Wind: ~1 in 100,000 pollen grains reaches a target
- Insect: ~1 in 100 visits results in pollination

📚 *In Python, we calculate pollination efficiency as a ratio. We use \`round()\` to format decimal outputs and comparison operators to categorize results.*`,
      analogy: 'Pollination is like a postal service for plants. Wind pollination is like throwing millions of letters out a window and hoping one reaches the right address. Insect pollination is like hiring a delivery person who goes directly to the correct house — much more efficient, but you have to pay them (with nectar).',
      storyConnection: 'The orchids of Phawngpui (Blue Mountain) in Mizoram are pollination specialists. Each species has evolved intricate mechanisms to attract specific pollinators — from deceptive mimicry to chemical lures. Understanding pollination starts with understanding why plants invest so much energy in flowers.',
      checkQuestion: 'Why do insect-pollinated flowers have colorful petals while wind-pollinated plants (like grasses) do not?',
      checkAnswer: 'Color attracts insect pollinators — it is advertising. Petals are metabolically expensive to produce, so plants only make them if they serve a purpose. Wind-pollinated plants have no reason to attract insects, so they save energy by skipping petals entirely. Every feature of a flower is a cost-benefit calculation shaped by evolution.',
      codeIntro: 'Compare pollination strategies and calculate their efficiency.',
      code: `# Pollination efficiency comparison

strategies = {
    'Wind (grass)': {
        'pollen_per_flower': 5_000_000,
        'success_rate': 0.00001,  # per grain
        'energy_cost': 10,        # relative units
        'specificity': 'none',
    },
    'Honeybee': {
        'pollen_per_flower': 50_000,
        'success_rate': 0.01,
        'energy_cost': 50,
        'specificity': 'moderate',
    },
    'Butterfly': {
        'pollen_per_flower': 20_000,
        'success_rate': 0.005,
        'energy_cost': 40,
        'specificity': 'moderate',
    },
    'Specific moth (orchid)': {
        'pollen_per_flower': 2_000,
        'success_rate': 0.05,
        'energy_cost': 80,
        'specificity': 'high',
    },
    'Deceptive orchid': {
        'pollen_per_flower': 5_000,
        'success_rate': 0.02,
        'energy_cost': 30,
        'specificity': 'very high',
    },
}

print("POLLINATION STRATEGY COMPARISON")
print("=" * 75)
print(f"{'Strategy':<25} {'Pollen/flower':>14} {'Success rate':>12} {'Seeds/flower':>12} {'Cost':>6}")
print("-" * 75)

for name, data in strategies.items():
    seeds = data['pollen_per_flower'] * data['success_rate']
    efficiency = seeds / data['energy_cost']
    bar = "█" * min(int(efficiency * 2), 30)

    print(f"{name:<25} {data['pollen_per_flower']:>14,} {data['success_rate']:>12.5f} "
          f"{seeds:>12,.0f} {data['energy_cost']:>6}")

print()
print("Efficiency (seeds per unit energy):")
for name, data in strategies.items():
    seeds = data['pollen_per_flower'] * data['success_rate']
    efficiency = seeds / data['energy_cost']
    bar = "█" * min(int(efficiency), 40)
    print(f"  {name:<25}: {efficiency:>6.1f}  {bar}")

# Key insight
print("\\\nKey insight: Wind produces the most seeds per flower,")
print("but specific pollinators are the most energy-efficient.")
print("Orchids bet on quality (specific pollinators) over quantity (wind).")`,
      challenge: 'If climate change reduces the specific moth population by 50%, how does the orchid\'s reproductive success change compared to a wind-pollinated grass? Which strategy is more resilient to environmental change?',
      successHint: 'You compared pollination strategies quantitatively. The tradeoff between specificity and resilience is central to evolutionary biology. Orchids are specialists — incredibly efficient when their pollinator is present, but vulnerable when it is not.',
    },
    {
      title: 'Flower signals — color, scent, and shape',
      concept: `Flowers are **advertisements** designed to attract specific pollinators. Each signal targets a different sensory system:

**Color perception** varies by pollinator:
- Bees see UV, blue, and green (not red) — bee flowers are blue/purple/yellow
- Birds see red well — bird flowers are red/orange
- Moths are active at night — moth flowers are white/pale (visible in moonlight)
- Butterflies see a wide range — butterfly flowers are varied colors

**Scent** is a chemical signal:
- Sweet, fruity scents → bees, butterflies
- Musky, rotting scents → flies, beetles
- Strong nocturnal scents → moths
- No scent → bird flowers (birds have poor smell)

**Shape** controls access:
- Open, flat → many visitors (generalist)
- Tubular → long tongues only (specialist)
- Trap → forces specific behavior

📚 *We represent flower traits as numerical scores and use Python dictionaries to organize multi-dimensional data.*`,
      analogy: 'Flower signals are like restaurant signs on a highway. A fast-food sign (bright, simple, visible from far) attracts many customers (generalist). A small, elegant sign for a French bistro (subtle, specific) attracts only people who know what they are looking for (specialist). Each sign is designed for its target audience.',
      storyConnection: 'Phawngpui orchids use an extraordinary range of signals. Some mimic the appearance and scent of female insects to lure males. Others produce UV-reflective patterns invisible to humans but brilliant to bees. Some emit scent only at dusk, precisely when their moth pollinator is active.',
      checkQuestion: 'Why would an orchid evolve to mimic a female insect?',
      checkAnswer: 'Sexual deception (pseudocopulation) is the ultimate in pollinator specificity. The male insect, fooled by the orchid\'s appearance and pheromone-like scent, attempts to mate with the flower. In doing so, pollen attaches to its body. When it visits another deceptive orchid, cross-pollination occurs. The orchid gets pollinated without spending any energy on nectar rewards.',
      codeIntro: 'Model the match between flower signals and pollinator preferences.',
      code: `# Flower-pollinator signal matching

# Pollinator sensory preferences (0-10 scale)
pollinators = {
    'Honeybee': {'UV': 9, 'blue': 8, 'red': 1, 'sweet_scent': 8, 'tubular': 3, 'open': 8, 'nocturnal': 0},
    'Hawk moth': {'UV': 3, 'blue': 2, 'red': 2, 'sweet_scent': 9, 'tubular': 9, 'open': 2, 'nocturnal': 10},
    'Butterfly': {'UV': 5, 'blue': 6, 'red': 7, 'sweet_scent': 7, 'tubular': 6, 'open': 7, 'nocturnal': 0},
    'Hummingbird': {'UV': 2, 'blue': 3, 'red': 10, 'sweet_scent': 1, 'tubular': 10, 'open': 3, 'nocturnal': 0},
    'Fly': {'UV': 2, 'blue': 3, 'red': 4, 'sweet_scent': 2, 'tubular': 2, 'open': 9, 'nocturnal': 3},
}

# Orchid flower traits
orchids = {
    'Dendrobium (bee orchid)': {'UV': 8, 'blue': 7, 'red': 2, 'sweet_scent': 7, 'tubular': 4, 'open': 7, 'nocturnal': 0},
    'Aerides (moth orchid)': {'UV': 2, 'blue': 1, 'red': 1, 'sweet_scent': 9, 'tubular': 8, 'open': 2, 'nocturnal': 9},
    'Vanda (general)': {'UV': 5, 'blue': 6, 'red': 5, 'sweet_scent': 6, 'tubular': 5, 'open': 6, 'nocturnal': 1},
    'Bulbophyllum (fly orchid)': {'UV': 1, 'blue': 2, 'red': 4, 'sweet_scent': 0, 'tubular': 1, 'open': 9, 'nocturnal': 2},
}

def match_score(flower, pollinator):
    """Calculate how well a flower matches a pollinator's preferences."""
    score = 0
    for trait in flower:
        score += flower[trait] * pollinator[trait]
    max_possible = sum(v**2 for v in pollinator.values())
    return score / max_possible * 100 if max_possible > 0 else 0

print("FLOWER-POLLINATOR MATCHING MATRIX")
print("=" * 70)
print(f"{'Orchid':<28}", end="")
for p in pollinators:
    print(f" {p[:8]:>9}", end="")
print("  Best match")
print("-" * 82)

for orchid_name, traits in orchids.items():
    scores = {}
    for poll_name, prefs in pollinators.items():
        scores[poll_name] = match_score(traits, prefs)

    print(f"{orchid_name:<28}", end="")
    best = max(scores, key=scores.get)
    for p in pollinators:
        s = scores[p]
        marker = " ◄" if p == best else ""
        print(f" {s:>7.1f}%{marker}", end="")
    print()

# Specialization index
print("\\\nSpecialization index (how focused on one pollinator):")
for orchid_name, traits in orchids.items():
    scores = [match_score(traits, prefs) for prefs in pollinators.values()]
    max_s = max(scores)
    mean_s = sum(scores) / len(scores)
    spec_idx = max_s / mean_s if mean_s > 0 else 0
    bar = "█" * int(spec_idx * 5)
    print(f"  {orchid_name:<28}: {spec_idx:.2f}  {bar}  {'specialist' if spec_idx > 1.5 else 'generalist'}")`,
      challenge: 'Add a "deceptive orchid" that mimics a female bee (high UV, moderate shape match, zero nectar). How does its match score compare? Why might deception be more effective than honest signaling for rare orchids?',
      successHint: 'You modeled the signal-matching system between flowers and pollinators. This is the basis of pollination ecology — understanding why each flower looks, smells, and shapes the way it does. Every petal color, every scent molecule, every curve of the corolla is an evolutionary answer to the question: "Which pollinator am I targeting?"',
    },
    {
      title: 'Pollen transfer — the mathematics of reproduction',
      concept: `For successful pollination, pollen must travel from one flower to a compatible flower of the same species. The probability depends on:

1. **Pollen production**: grains per flower
2. **Pollinator fidelity**: probability the pollinator visits another flower of the same species
3. **Pollen carryover**: how many flowers a pollen grain survives on the pollinator
4. **Stigma receptivity**: probability the target flower is ready to receive pollen

The overall success probability:
\`P_success = P_pickup × P_fidelity × P_carryover × P_receptive\`

For orchids, which produce large pollen masses (pollinia) rather than individual grains:
- P_pickup is lower (harder to attach)
- But P_carryover is higher (pollinium stays attached)
- And P_fidelity is higher (specialist pollinator)

📚 *We multiply probabilities to find joint probability. The product of many small numbers can be very small — we use Python to handle these calculations precisely.*`,
      analogy: 'Pollen transfer is like a relay race with handoffs. Each handoff (pickup, travel, delivery) has a chance of dropping the baton. Wind pollination is like throwing the baton randomly — almost always a miss. Insect pollination is like a trained relay team — each handoff is reliable, but the baton must survive the journey.',
      storyConnection: 'Orchid pollinia are remarkable structures — compact masses of thousands of pollen grains glued together. When a pollinator visits, the entire pollinium attaches to its body. This is like sending a carefully packaged parcel instead of loose letters. The orchids of Phawngpui have evolved pollinia shapes matched precisely to their specific pollinators.',
      checkQuestion: 'Why do orchids produce pollinia instead of loose pollen like most flowers?',
      checkAnswer: 'Pollinia ensure that ALL the pollen from one flower reaches a single recipient. Loose pollen gets scattered — most is lost to wind, grooming, or wrong flowers. Pollinia delivery is all-or-nothing: either the entire mass is delivered (maximum fertilization) or nothing. This gamble makes sense when your pollinator is rare but reliable.',
      codeIntro: 'Calculate pollen transfer success rates for different pollination strategies.',
      code: `# Pollen transfer mathematics

strategies = {
    'Wind (grass)': {
        'grains': 5_000_000, 'pickup': 1.0, 'fidelity': 0.001,
        'carryover': 0.01, 'receptive': 0.3, 'description': 'Scatter approach'
    },
    'Generalist bee': {
        'grains': 50_000, 'pickup': 0.2, 'fidelity': 0.3,
        'carryover': 0.1, 'receptive': 0.5, 'description': 'Moderate precision'
    },
    'Specialist moth': {
        'grains': 10_000, 'pickup': 0.3, 'fidelity': 0.8,
        'carryover': 0.3, 'receptive': 0.6, 'description': 'High fidelity'
    },
    'Orchid pollinium': {
        'grains': 100_000, 'pickup': 0.05, 'fidelity': 0.9,
        'carryover': 0.95, 'receptive': 0.7, 'description': 'All or nothing'
    },
    'Deceptive orchid': {
        'grains': 100_000, 'pickup': 0.03, 'fidelity': 0.7,
        'carryover': 0.95, 'receptive': 0.7, 'description': 'No reward, high risk'
    },
}

print("POLLEN TRANSFER SUCCESS ANALYSIS")
print("=" * 70)

for name, s in strategies.items():
    # Per-visit probability
    p_per_visit = s['pickup'] * s['fidelity'] * s['carryover'] * s['receptive']

    # Expected seeds per flower (grains × combined probability)
    seeds = s['grains'] * s['pickup'] * s['fidelity'] * s['carryover'] * s['receptive']

    # Visits needed for 95% chance of at least one success
    import math
    if p_per_visit > 0:
        visits_95 = math.ceil(math.log(0.05) / math.log(1 - p_per_visit))
    else:
        visits_95 = float('inf')

    print(f"\\\n{name} ({s['description']}):")
    print(f"  Pickup: {s['pickup']:.0%} × Fidelity: {s['fidelity']:.0%} × "
          f"Carryover: {s['carryover']:.0%} × Receptive: {s['receptive']:.0%}")
    print(f"  Per-visit success: {p_per_visit:.4f} ({p_per_visit*100:.2f}%)")
    print(f"  Expected seeds/flower: {seeds:,.0f}")
    print(f"  Visits for 95% confidence: {visits_95}")

# Comparison table
print("\\\n\\\nSUMMARY TABLE")
print(f"{'Strategy':<22} {'Success/visit':>14} {'Seeds/flower':>13} {'Visits@95%':>11}")
print("-" * 62)
for name, s in strategies.items():
    p = s['pickup'] * s['fidelity'] * s['carryover'] * s['receptive']
    seeds = s['grains'] * p
    v95 = math.ceil(math.log(0.05) / math.log(1 - p)) if p > 0 and p < 1 else 999
    print(f"{name:<22} {p:>14.4f} {seeds:>13,.0f} {v95:>11}")`,
      challenge: 'Model the effect of pollinator decline: if bee visits drop by 50%, how do seeds per flower change for each strategy? Which strategy is most resilient? Now model a 90% decline — this simulates a real conservation crisis.',
      successHint: 'You calculated the mathematics of reproductive success in plants. The probabilities reveal why orchids invest so heavily in pollinator specificity — their all-or-nothing strategy is extremely efficient when the pollinator is present. Understanding these numbers is critical for orchid conservation.',
    },
    {
      title: 'Coevolution — the dance of adaptation',
      concept: `**Coevolution** is when two species evolve in response to each other. In pollination:

- Flower evolves longer nectar tube → moth evolves longer tongue
- Moth evolves longer tongue → flower must evolve even longer tube (to force contact with pollen)

This is an **evolutionary arms race**: each adaptation by one partner drives a counter-adaptation by the other.

Darwin predicted a moth with a 30 cm tongue to pollinate a Malagasy orchid (Angraecum sesquipedale) with a 30 cm nectar spur. The moth was discovered 40 years after his death — vindication of evolutionary reasoning.

The rate of coevolution depends on:
- **Selection pressure**: how much fitness depends on the match
- **Genetic variation**: available mutations
- **Generation time**: faster-reproducing species evolve faster

📚 *We simulate coevolution using a simple model: each generation, the trait value shifts toward the partner\'s trait. The rate depends on selection strength.*`,
      analogy: 'Coevolution is like a technological arms race between lock makers and locksmiths. Each better lock (flower) drives the development of better picks (pollinator). Neither side can stop evolving without losing the competition. The result is ever-more-sophisticated designs on both sides — the biological equivalent of an engineering competition.',
      storyConnection: 'Phawngpui\'s orchids show remarkable examples of coevolution. Some orchid species have nectar spurs exactly matching the tongue length of their specific moth pollinator — not one millimeter longer or shorter. This precision took millions of years of mutual adaptation, each generation refining the fit between flower and pollinator.',
      checkQuestion: 'Why do coevolved traits tend toward extreme values (very long tongues, very long spurs)?',
      checkAnswer: 'It is an escalation dynamic. A slightly longer spur forces the moth to push deeper, ensuring pollen contact. But the moth that can reach deeper gets more nectar (fitness advantage), selecting for longer tongues. The longer tongue allows the moth to drink without touching pollen, so the flower must make the spur even longer. Each increment drives the next — runaway coevolution.',
      codeIntro: 'Simulate the coevolution of orchid nectar spur length and moth tongue length over generations.',
      code: `# Coevolution simulation: orchid spur vs moth tongue

generations = 200
spur_length = 10.0   # mm (initial orchid spur)
tongue_length = 10.0 # mm (initial moth tongue)

# Evolution parameters
spur_rate = 0.05     # how fast the orchid evolves
tongue_rate = 0.08   # moths evolve faster (shorter generation)
noise = 0.3          # random variation

spur_history = [spur_length]
tongue_history = [tongue_length]

for gen in range(generations):
    # Selection: spur should be slightly longer than tongue
    # (forces moth to contact pollen)
    spur_target = tongue_length + 2.0
    tongue_target = spur_length - 0.5  # moth needs to reach nectar

    # Evolve toward targets (with noise)
    import random
    random.seed(gen)
    spur_length += spur_rate * (spur_target - spur_length) + random.gauss(0, noise)
    tongue_length += tongue_rate * (tongue_target - tongue_length) + random.gauss(0, noise)

    # Constraints
    spur_length = max(spur_length, 5)
    tongue_length = max(tongue_length, 5)

    spur_history.append(spur_length)
    tongue_history.append(tongue_length)

print("COEVOLUTION: ORCHID SPUR vs MOTH TONGUE")
print("=" * 55)

# Show key generations
print(f"{'Gen':>5} {'Spur (mm)':>10} {'Tongue (mm)':>12} {'Difference':>11}")
print("-" * 40)
for gen in [0, 10, 25, 50, 100, 150, 200]:
    diff = spur_history[gen] - tongue_history[gen]
    print(f"{gen:>5} {spur_history[gen]:>10.1f} {tongue_history[gen]:>12.1f} {diff:>11.1f}")

# Analysis
final_spur = spur_history[-1]
final_tongue = tongue_history[-1]
increase_spur = (final_spur / spur_history[0] - 1) * 100
increase_tongue = (final_tongue / tongue_history[0] - 1) * 100

print(f"\\\nSpur increased: {spur_history[0]:.1f} → {final_spur:.1f} mm ({increase_spur:.0f}%)")
print(f"Tongue increased: {tongue_history[0]:.1f} → {final_tongue:.1f} mm ({increase_tongue:.0f}%)")
print(f"\\\nDarwin's prediction: coevolution drives ever-longer structures")
print(f"Final spur-tongue gap: {final_spur - final_tongue:.1f} mm")
print(f"(Orchid maintains ~2mm advantage to ensure pollen contact)")

# Rate comparison
print(f"\\\nEvolution rates:")
print(f"  Orchid: {spur_rate} per generation (slower, longer generation time)")
print(f"  Moth:   {tongue_rate} per generation (faster, shorter generation time)")
print(f"  The moth evolves {tongue_rate/spur_rate:.1f}x faster than the orchid")`,
      challenge: 'What happens if the moth goes extinct at generation 100? Remove the selection pressure on the orchid and continue the simulation. Does the spur length stay the same, shrink, or keep growing? This models the real threat of pollinator loss to specialized orchids.',
      successHint: 'You simulated coevolution — one of the most elegant processes in biology. The arms race between orchids and moths has produced some of nature\'s most extreme structures. Darwin\'s prediction of the long-tongued moth was one of the greatest triumphs of evolutionary reasoning, confirmed decades after his death.',
    },
    {
      title: 'Population genetics — how traits spread',
      concept: `Pollination-related traits (spur length, scent production, petal color) are encoded in genes. How do new trait variants spread through a population?

**Hardy-Weinberg equilibrium**: in a large, random-mating population with no selection, allele frequencies stay constant. The genotype frequencies are:
\`p² + 2pq + q² = 1\`

Where p = frequency of allele A, q = frequency of allele a.

**Natural selection** changes allele frequencies:
\`p' = p × w_A / w̄\`

Where w_A is the fitness of allele A carriers and w̄ is the population mean fitness.

For orchids, a mutation that improves pollinator attraction (e.g., stronger scent) will increase in frequency if it provides a fitness advantage.

📚 *We track allele frequencies over generations using a simple recurrence relation. This is the foundation of population genetics — the mathematical framework for evolution.*`,
      analogy: 'Allele frequency change is like a product gaining market share. A better product (beneficial mutation) starts rare, then gradually takes over the market (population). The speed depends on how much better it is (selection coefficient). Just as market share follows an S-curve, allele frequency follows a logistic curve from rare to common.',
      storyConnection: 'The orchid diversity on Phawngpui — dozens of species in a small area — is the result of population genetics playing out over millions of years. Each new mutation that improved pollination success was selected for, gradually spreading through the population and eventually becoming a defining feature of a new species.',
      checkQuestion: 'If a scent mutation doubles pollination success, how many generations does it take to go from 1% to 50% frequency?',
      checkAnswer: 'With selection coefficient s = 1.0 (100% fitness advantage), the allele frequency changes as p\' ≈ p(1+s)/(1+sp). Starting from p=0.01, it takes approximately 7/s ≈ 7 generations to go from 1% to 50%. With a smaller advantage (s=0.1), it takes about 70 generations. Strong selection drives rapid evolution.',
      codeIntro: 'Simulate natural selection on a pollination-enhancing trait in an orchid population.',
      code: `# Population genetics: selection on pollination traits

import random
random.seed(42)

def selection_simulation(p0, s, generations, pop_size=10000):
    """Simulate allele frequency change under selection."""
    p = p0
    history = [p]

    for gen in range(generations):
        # Fitness: AA=1+s, Aa=1+s/2, aa=1.0
        q = 1 - p
        w_bar = p**2 * (1+s) + 2*p*q * (1+s/2) + q**2 * 1.0

        # New frequency after selection
        p_new = (p**2 * (1+s) + p*q * (1+s/2)) / w_bar

        # Genetic drift (random sampling in finite population)
        n_A = round(p_new * pop_size)
        p = n_A / pop_size + random.gauss(0, 0.5/pop_size**0.5)
        p = max(0.001, min(0.999, p))

        history.append(p)

    return history

generations = 200
p0 = 0.01  # start rare

print("NATURAL SELECTION ON ORCHID POLLINATION TRAIT")
print("=" * 60)

# Different selection strengths
scenarios = {
    'Strong scent (s=0.5)': 0.5,
    'Moderate scent (s=0.1)': 0.1,
    'Weak scent (s=0.02)': 0.02,
    'Neutral drift (s=0)': 0.0,
}

print(f"Starting frequency: {p0*100:.0f}%")
print(f"Population size: 10,000")
print()

print(f"{'Scenario':<28} {'Gen 10':>7} {'Gen 50':>7} {'Gen 100':>7} {'Gen 200':>7} {'Time to 50%':>11}")
print("-" * 72)

for name, s in scenarios.items():
    hist = selection_simulation(p0, s, generations)

    # Time to 50%
    t50 = next((i for i, p in enumerate(hist) if p > 0.5), None)
    t50_str = str(t50) if t50 else ">200"

    print(f"{name:<28} {hist[10]*100:>6.1f}% {hist[50]*100:>6.1f}% "
          f"{hist[100]*100:>6.1f}% {hist[200]*100:>6.1f}% {t50_str:>11}")

# Detailed trajectory for moderate selection
print("\\\nDetailed trajectory (s=0.1):")
hist = selection_simulation(p0, 0.1, generations)
for gen in [0, 10, 20, 50, 75, 100, 150, 200]:
    bar = "█" * int(hist[gen] * 50)
    print(f"  Gen {gen:>3}: {hist[gen]*100:>5.1f}% {bar}")

# Time to fixation (99%)
for s_val in [0.02, 0.05, 0.1, 0.2, 0.5]:
    hist = selection_simulation(0.01, s_val, 500)
    t99 = next((i for i, p in enumerate(hist) if p > 0.99), None)
    print(f"  s={s_val}: fixation at gen {t99}" if t99 else f"  s={s_val}: not fixed in 500 gen")`,
      challenge: 'Add a second locus: scent production AND spur length. Both must match the pollinator for maximum fitness. How does selection on two linked traits compare to selection on each independently? This is the "cost of complexity" in adaptation.',
      successHint: 'You simulated natural selection — the engine of evolution. These allele frequency trajectories explain how orchid diversity arose: each beneficial mutation swept through the population, gradually differentiating one orchid population from another until they became separate species.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Pollination Biology & Coevolution</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
