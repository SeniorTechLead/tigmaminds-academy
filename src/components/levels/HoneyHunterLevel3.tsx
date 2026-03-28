import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function HoneyHunterLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Bee colony dynamics — a superorganism with division of labor',
      concept: `A honeybee colony is not just a group of bees — it is a **superorganism** where the colony, not the individual, is the unit of selection. A single bee cannot survive alone; the colony functions as one entity with specialized "organs":

- **Queen**: the reproductive system. One per colony, lays up to 2000 eggs/day. Lives 3-5 years.
- **Workers**: female bees that do everything else. They cycle through tasks by age:
  - Days 1-3: Cell cleaning
  - Days 3-10: Nurse bees (feed larvae)
  - Days 10-18: Wax production, comb building
  - Days 18-21: Guard duty
  - Days 21+: Foragers (collect nectar, pollen, water)
- **Drones**: male bees whose only job is mating. Expelled from the hive before winter.

Colony dynamics follow predictable patterns:
- **Spring buildup**: queen increases laying; colony grows from ~10,000 to 60,000
- **Summer peak**: maximum foraging; honey production
- **Swarming**: when the colony gets too large, it splits — the old queen leaves with half the workers
- **Fall decline**: queen reduces laying; drones expelled; colony prepares for winter
- **Winter cluster**: bees form a tight ball, vibrating muscles to generate heat (~35°C inside cluster)

The colony's population follows a differential equation balancing egg-laying rate, development time (21 days egg-to-adult), and death rate (workers live ~6 weeks in summer, ~6 months in winter).`,
      analogy: 'A bee colony is like a factory with an automated assembly line. New employees (larvae) spend 3 weeks in training (development), then cycle through departments: first cleaning, then nursing, then construction, then security, and finally delivery (foraging). The factory never shuts down, never takes a day off, and the CEO (queen) is both the founder and the only one producing new employees. If the CEO dies without a successor, the factory collapses.',
      storyConnection: 'The honey hunter in the story watches the bees with respect, knowing their colony is a living community, not just a source of honey. Traditional honey hunters take only surplus honey, leaving enough for the colony to survive winter. This is the original form of sustainable harvesting — understanding colony dynamics well enough to know how much you can take without causing collapse.',
      checkQuestion: 'A colony has 40,000 workers and the queen lays 1500 eggs/day. Worker lifespan is 42 days in summer. Is the colony growing or shrinking?',
      checkAnswer: 'At steady state, the death rate equals births that survived to adulthood. Workers die at rate 40,000/42 ≈ 952 per day. Queen lays 1500 eggs/day, but not all survive: typical larval mortality is ~10-20%, so ~1200-1350 new adults per day. Since 1200-1350 > 952, the colony is growing. It will stabilize when the population reaches about 1500 × 42 × 0.85 ≈ 53,550 workers (accounting for larval mortality).',
      codeIntro: 'Model the annual dynamics of a bee colony, tracking population through spring buildup, summer peak, swarming, fall decline, and winter survival.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Bee colony annual dynamics model ---
days = 365
dt = 1  # daily timestep

# Parameters
queen_max_eggs = 2000  # max eggs per day
development_time = 21  # days from egg to adult worker
summer_lifespan = 42  # worker lifespan in summer (days)
winter_lifespan = 180  # worker lifespan in winter (days)
larval_survival = 0.85
swarm_threshold = 55000  # colony swarms above this size
swarm_fraction = 0.5  # fraction that leaves in a swarm

# Seasonal egg-laying rate (photoperiod-dependent)
def daily_egg_rate(day_of_year, max_eggs):
    """Queen adjusts laying to photoperiod."""
    # Peak in late spring (day ~150), minimum in winter (day ~350)
    photoperiod = 0.5 + 0.5 * np.sin(2 * np.pi * (day_of_year - 80) / 365)
    return max_eggs * max(0, photoperiod) ** 2

# Worker lifespan varies by season
def worker_lifespan(day_of_year):
    """Workers live longer in winter (less foraging wear)."""
    if 60 < day_of_year < 300:  # spring through fall
        return summer_lifespan
    else:
        return winter_lifespan

# Simulate colony dynamics
adults = 10000  # start with 10,000 adults (spring)
brood = np.zeros(development_time)  # pipeline of developing bees
brood[:] = 500  # some brood already present

population = []
egg_rates = []
death_rates = []
swarmed = False
swarm_day = None

for day in range(days):
    # Egg laying
    eggs = daily_egg_rate(day, queen_max_eggs)
    surviving_eggs = eggs * larval_survival

    # Deaths
    lifespan = worker_lifespan(day)
    daily_deaths = adults / lifespan
    # Add some stochasticity
    daily_deaths *= np.random.uniform(0.9, 1.1)

    # New adults emerging from brood pipeline
    new_adults = brood[0]  # oldest brood becomes adult

    # Shift brood pipeline
    brood = np.roll(brood, -1)
    brood[-1] = surviving_eggs

    # Update adult population
    adults = adults + new_adults - daily_deaths
    adults = max(100, adults)  # minimum viable

    # Swarming
    if adults > swarm_threshold and not swarmed and 120 < day < 200:
        adults *= (1 - swarm_fraction)
        brood *= (1 - swarm_fraction * 0.3)  # some brood left behind
        swarmed = True
        swarm_day = day

    population.append(adults)
    egg_rates.append(eggs)
    death_rates.append(daily_deaths)

population = np.array(population)
egg_rates = np.array(egg_rates)
death_rates = np.array(death_rates)

# Honey production model (surplus beyond colony needs)
# Each bee collects ~40mg nectar/trip, 10 trips/day during foraging season
forager_fraction = 0.35  # fraction of workers that forage
nectar_per_forager = 0.4  # grams/day
honey_conversion = 0.25  # nectar to honey ratio
colony_consumption = 100  # grams honey/day for colony metabolism

daily_honey = np.zeros(days)
cumulative_honey = np.zeros(days)
for day in range(days):
    if 90 < day < 280:  # foraging season
        foragers = population[day] * forager_fraction
        nectar = foragers * nectar_per_forager
        honey_produced = nectar * honey_conversion
        honey_surplus = max(0, honey_produced - colony_consumption)
        daily_honey[day] = honey_surplus
    if day > 0:
        cumulative_honey[day] = cumulative_honey[day-1] + daily_honey[day]

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Honeybee Colony Annual Dynamics', color='white', fontsize=14)

month_labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
month_positions = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]

# Plot 1: Colony population
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(population, color='#f59e0b', linewidth=2)
if swarm_day:
    ax.axvline(swarm_day, color='#ef4444', linestyle='--', linewidth=1, label=f'Swarm (day {swarm_day})')
ax.fill_between(range(days), population, alpha=0.2, color='#f59e0b')
ax.set_ylabel('Worker population', color='white')
ax.set_title('Colony size through the year', color='white', fontsize=11)
ax.set_xticks(month_positions)
ax.set_xticklabels(month_labels, fontsize=7)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Egg laying rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(egg_rates, color='#22c55e', linewidth=1.5)
ax.fill_between(range(days), egg_rates, alpha=0.2, color='#22c55e')
ax.set_ylabel('Eggs per day', color='white')
ax.set_title('Queen egg-laying rate', color='white', fontsize=11)
ax.set_xticks(month_positions)
ax.set_xticklabels(month_labels, fontsize=7)
ax.tick_params(colors='gray')

# Plot 3: Birth-death balance
ax = axes[0, 2]
ax.set_facecolor('#111827')
emerging = np.zeros(days)
for day in range(development_time, days):
    emerging[day] = egg_rates[day - development_time] * larval_survival
ax.plot(emerging, color='#22c55e', linewidth=1.5, label='New adults/day')
ax.plot(death_rates, color='#ef4444', linewidth=1.5, label='Deaths/day')
ax.set_ylabel('Bees per day', color='white')
ax.set_title('Birth-death balance', color='white', fontsize=11)
ax.set_xticks(month_positions)
ax.set_xticklabels(month_labels, fontsize=7)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Division of labor
ax = axes[1, 0]
ax.set_facecolor('#111827')
roles = ['Cleaners\\n(1-3d)', 'Nurses\\n(3-10d)', 'Builders\\n(10-18d)', 'Guards\\n(18-21d)', 'Foragers\\n(21+d)']
role_fractions = [0.05, 0.20, 0.15, 0.05, 0.35]  # approximate during summer
# remaining 20% are resting/transitioning
role_fractions.append(0.20)
roles.append('Other')
colors_roles = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#6b7280']
ax.pie(role_fractions, labels=roles, colors=colors_roles, autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 8}, startangle=90)
ax.set_title('Division of labor (summer)', color='white', fontsize=11)

# Plot 5: Honey production
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(daily_honey, color='#f59e0b', linewidth=1, alpha=0.6, label='Daily surplus')
ax.plot(cumulative_honey / 1000, color='#22c55e', linewidth=2, label='Cumulative (kg)')
ax.set_ylabel('Honey (g/day or kg cumulative)', color='white')
ax.set_title('Honey production', color='white', fontsize=11)
ax.set_xticks(month_positions)
ax.set_xticklabels(month_labels, fontsize=7)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Colony phases
ax = axes[1, 2]
ax.set_facecolor('#111827')
phases = ['Winter\\ncluster', 'Spring\\nbuildup', 'Summer\\npeak', 'Fall\\ndecline']
phase_ranges = [(0, 59), (60, 150), (151, 273), (274, 365)]
phase_colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for (start, end), color, phase in zip(phase_ranges, phase_colors, phases):
    avg_pop = np.mean(population[start:end])
    ax.bar(phase, avg_pop, color=color, edgecolor='none', width=0.6)
    ax.text(phases.index(phase), avg_pop + 500, f'{avg_pop:.0f}', ha='center',
            color='white', fontsize=9)
ax.set_ylabel('Average population', color='white')
ax.set_title('Seasonal colony phases', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Colony dynamics summary:")
print(f"  Peak population: {int(max(population)):,} workers (day {int(np.argmax(population))})")
print(f"  Minimum population: {int(min(population)):,} workers")
print(f"  Swarm event: day {swarm_day} (lost {swarm_fraction*100:.0f}% of workers)")
print(f"  Total honey surplus: {cumulative_honey[-1]/1000:.1f} kg")
print(f"  Sustainable harvest: ~{cumulative_honey[-1]/1000 * 0.5:.1f} kg (take half, leave half)")`,
      challenge: 'Increase queen_max_eggs to 2500 (a productive queen) and decrease summer_lifespan to 35 (harder foraging conditions). How does this change the balance? What determines whether the colony can survive winter?',
      successHint: 'Colony dynamics is the foundation of apiculture (beekeeping) and crucial for understanding pollination services. The model you built captures why colony losses spike when any one parameter shifts — the colony is a finely balanced system.',
    },
    {
      title: 'Eusocial insect behavior — the evolutionary puzzle of worker sterility',
      concept: `Why would a worker bee give up reproduction to help the queen? This is the central puzzle of **eusociality** — societies with reproductive division of labor, cooperative brood care, and overlapping generations.

**Hamilton's rule** explains it: an altruistic act evolves when r × B > C, where:
- r = genetic relatedness between actor and beneficiary
- B = reproductive benefit to the beneficiary
- C = reproductive cost to the actor

In hymenopteran insects (bees, wasps, ants), females are **diploid** (2 copies of each chromosome) but males are **haploid** (1 copy, from unfertilized eggs). This creates unusual relatedness:

- Sisters share r = 0.75 (they share all of dad's genes + half of mom's)
- A mother is related to her daughters by r = 0.5 (standard)
- So a worker is MORE related to her sisters (0.75) than she would be to her own daughters (0.5)!

This means a worker bee propagates more of her genes by helping her mother (the queen) produce sisters than by producing her own offspring. **Kin selection** made eusociality evolutionarily stable.

But the math only works if the queen mates once. If she mates with multiple males, workers are less related to each other, and the incentive to cooperate weakens. Honeybee queens mate with 10-20 males, creating genetic conflict within the hive — which is resolved through sophisticated chemical signaling (queen pheromones that suppress worker reproduction).`,
      analogy: 'Imagine you could invest in your own children or your sibling\'s children. Normally, you prefer your own (r=0.5 vs r=0.25 for nieces/nephews). But in a bizarre world where siblings share 75% of genes, investing in your sister\'s children (r=0.375) beats investing in your own (r=0.5) ONLY IF your sister is twice as efficient at raising kids as you are. That is roughly the bee situation: the queen is the specialist mother, and workers are more genetically efficient helping her than reproducing themselves.',
      storyConnection: 'The honey hunter watches thousands of worker bees sacrificing their lives to defend the colony. Why? Not loyalty or duty in the human sense, but a deep genetic logic: by defending the queen and her brood, each worker is defending copies of her own genes. The stinger rips out the worker\'s abdomen, killing her — but the colony (and her shared genes) survives. The honey hunter benefits from this sacrifice.',
      checkQuestion: 'Worker bees can sometimes lay unfertilized eggs (which become drones). Why do other workers destroy these eggs (worker policing)?',
      checkAnswer: 'A worker\'s son (drone) carries only her genes. Other workers are more related to the queen\'s sons (their brothers, r=0.25 in multi-mated colonies) than to their sister\'s sons (r=0.125-0.375 depending on paternity). So workers preferentially protect the queen\'s drones over any single worker\'s drones. Worker policing enforces the queen\'s reproductive monopoly because it is in every other worker\'s genetic interest.',
      codeIntro: 'Model Hamilton\'s rule, haplodiploidy relatedness, and kin selection dynamics to understand why eusociality evolves in bees.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Haplodiploidy and relatedness ---
# In haplodiploid species:
# Females = diploid (2n), Males = haploid (n)
# Queen mates with n_males drones

def compute_relatedness(n_mates):
    """Compute relatedness between workers given queen mated with n_mates drones."""
    # Full sisters (same father): r = 0.75
    # Half sisters (different father): r = 0.25
    # Probability of being full sisters = 1/n_mates
    r_workers = (1/n_mates) * 0.75 + (1 - 1/n_mates) * 0.25
    r_mother_daughter = 0.5  # always
    r_worker_to_queens_son = 0.25  # workers share 0.25 with brothers
    r_worker_to_sisters_son = 0.5 * r_workers  # nephew relatedness

    return {
        'r_sisters': r_workers,
        'r_mother_daughter': r_mother_daughter,
        'r_to_brothers': r_worker_to_queens_son,
        'r_to_nephews': r_worker_to_sisters_son,
    }

# Hamilton's rule simulation
def hamiltons_rule_check(r, B, C):
    """Returns True if altruistic behavior should evolve."""
    return r * B > C

# Compute for different mating numbers
n_mates_range = range(1, 21)
sister_relatedness = []
altruism_threshold = []  # minimum B/C ratio for altruism

for n in n_mates_range:
    rel = compute_relatedness(n)
    sister_relatedness.append(rel['r_sisters'])
    # Altruism evolves when r * B > C, so B/C > 1/r
    altruism_threshold.append(1 / rel['r_sisters'])

# --- Colony fitness simulation ---
# Compare: individual reproduction vs cooperative colony
def individual_fitness(n_females, fecundity=5, survival=0.3):
    """Each female reproduces independently."""
    total_offspring = 0
    for _ in range(n_females):
        offspring = np.random.poisson(fecundity)
        survivors = np.random.binomial(offspring, survival)
        total_offspring += survivors
    return total_offspring

def eusocial_fitness(n_females, queen_fecundity=50, worker_efficiency=1.5,
                     base_survival=0.3):
    """One queen, rest are workers who boost queen's output."""
    n_workers = n_females - 1
    # Workers increase queen's fecundity and offspring survival
    boosted_fecundity = queen_fecundity * (1 + 0.1 * n_workers)
    boosted_survival = min(0.95, base_survival * (1 + 0.05 * n_workers * worker_efficiency))
    offspring = np.random.poisson(boosted_fecundity)
    survivors = np.random.binomial(offspring, boosted_survival)
    return survivors

# Compare strategies across group sizes
group_sizes = range(2, 50)
n_trials = 200
individual_means = []
eusocial_means = []

for n in group_sizes:
    ind_results = [individual_fitness(n) for _ in range(n_trials)]
    eus_results = [eusocial_fitness(n) for _ in range(n_trials)]
    individual_means.append(np.mean(ind_results))
    eusocial_means.append(np.mean(eus_results))

# --- Gene propagation comparison ---
def genes_propagated(strategy, n_mates=15, n_workers=30):
    """Compare genes propagated: reproduce directly vs help queen."""
    rel = compute_relatedness(n_mates)

    if strategy == 'reproduce':
        # Worker lays unfertilized eggs (drones only)
        own_sons = np.random.poisson(5)  # few drones
        # Each son carries 100% of her genes
        gene_copies = own_sons * 1.0
    elif strategy == 'help_queen':
        # Queen produces sisters (r=0.75 if single-mated, less with multi-mating)
        queens_daughters = np.random.poisson(20)  # queen produces many more
        gene_copies = queens_daughters * rel['r_sisters']

    return gene_copies

# Run comparison
n_sims = 1000
reproduce_genes = [genes_propagated('reproduce') for _ in range(n_sims)]
help_genes = [genes_propagated('help_queen') for _ in range(n_sims)]

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Eusociality & Kin Selection in Honeybees', color='white', fontsize=14)

# Plot 1: Relatedness vs mating number
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(list(n_mates_range), sister_relatedness, 'o-', color='#22c55e', linewidth=2, label='Sister relatedness')
ax.axhline(0.5, color='#f59e0b', linestyle='--', linewidth=1, label='Mother-daughter (r=0.5)')
ax.axhline(0.25, color='#ef4444', linestyle='--', linewidth=1, label='Half-siblings (r=0.25)')
ax.axvline(15, color='gray', linestyle=':', linewidth=1, label='Typical bee (15 mates)')
ax.set_xlabel('Number of queen\'s mates', color='white')
ax.set_ylabel('Relatedness (r)', color='white')
ax.set_title('How mating number affects worker relatedness', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Hamilton's rule threshold
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(list(n_mates_range), altruism_threshold, 'o-', color='#a855f7', linewidth=2)
ax.fill_between(list(n_mates_range), altruism_threshold, 10, alpha=0.1, color='#22c55e', label='Altruism favored')
ax.fill_between(list(n_mates_range), 0, altruism_threshold, alpha=0.1, color='#ef4444', label='Selfishness favored')
ax.set_xlabel('Number of queen\'s mates', color='white')
ax.set_ylabel('Minimum B/C ratio for altruism', color='white')
ax.set_title('Hamilton\'s rule: when does helping pay?', color='white', fontsize=10)
ax.set_ylim(1, 5)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Individual vs eusocial fitness
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(list(group_sizes), individual_means, color='#ef4444', linewidth=2, label='Individual reproduction')
ax.plot(list(group_sizes), eusocial_means, color='#22c55e', linewidth=2, label='Eusocial colony')
ax.set_xlabel('Group size', color='white')
ax.set_ylabel('Total offspring surviving', color='white')
ax.set_title('Colony vs individual reproduction', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Gene propagation comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.hist(reproduce_genes, bins=20, alpha=0.6, color='#ef4444', label='Reproduce directly', edgecolor='none')
ax.hist(help_genes, bins=20, alpha=0.6, color='#22c55e', label='Help queen', edgecolor='none')
ax.axvline(np.mean(reproduce_genes), color='#ef4444', linestyle='--', linewidth=2)
ax.axvline(np.mean(help_genes), color='#22c55e', linestyle='--', linewidth=2)
ax.set_xlabel('Gene copies propagated', color='white')
ax.set_ylabel('Frequency', color='white')
ax.set_title(f'Gene propagation: help ({np.mean(help_genes):.1f}) vs reproduce ({np.mean(reproduce_genes):.1f})', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Relatedness web
ax = axes[1, 1]
ax.set_facecolor('#111827')
rel = compute_relatedness(15)
entities = ['Queen', 'Worker A', 'Worker B', 'Drone', 'Worker\\nA\'s son']
pos = {0: (0.5, 0.9), 1: (0.2, 0.5), 2: (0.8, 0.5), 3: (0.5, 0.5), 4: (0.2, 0.1)}
for idx, (name, (x, y)) in enumerate(zip(entities, pos.values())):
    ax.scatter(x, y, s=300, c='#f59e0b' if idx == 0 else '#3b82f6' if idx < 3 else '#a855f7',
               edgecolors='white', linewidths=1, zorder=5)
    ax.text(x, y - 0.08, name, color='white', ha='center', fontsize=8)

# Draw relatedness connections
connections = [
    (0, 1, 0.5, 'Queen-Worker'), (1, 2, rel['r_sisters'], 'Sisters'),
    (0, 3, 0.5, 'Queen-Drone'), (1, 4, 1.0, 'Worker-Son'),
    (2, 4, rel['r_to_nephews'], 'Worker B-Nephew'),
]
for i, j, r_val, label in connections:
    x1, y1 = list(pos.values())[i]
    x2, y2 = list(pos.values())[j]
    ax.plot([x1, x2], [y1, y2], '-', color='white', alpha=r_val, linewidth=r_val * 3)
    mx, my = (x1+x2)/2, (y1+y2)/2
    ax.text(mx + 0.05, my, f'r={r_val:.2f}', color='#f59e0b', fontsize=7)

ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.set_title('Relatedness web (15 mates)', color='white', fontsize=11)
ax.axis('off')

# Plot 6: Summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
rel_15 = compute_relatedness(15)
rel_1 = compute_relatedness(1)
summary = [
    ['Relationship', '1 mate', '15 mates'],
    ['Sister-sister', f'{0.75:.2f}', f'{rel_15["r_sisters"]:.2f}'],
    ['Mother-daughter', '0.50', '0.50'],
    ['Worker-brother', '0.25', '0.25'],
    ['Worker-nephew', f'{0.5*0.75:.2f}', f'{rel_15["r_to_nephews"]:.3f}'],
    ['B/C threshold', f'{1/0.75:.2f}', f'{1/rel_15["r_sisters"]:.2f}'],
]
table = ax.table(cellText=summary[1:], colLabels=summary[0], cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Relatedness under haplodiploidy', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Key insight: haplodiploidy makes sisters super-related (r=0.75 with 1 mate).")
print(f"With 15 mates (real honeybees): r = {rel_15['r_sisters']:.3f}")
print(f"Hamilton's rule still favors helping IF the queen is 3x more productive.")
print("The queen IS 3x+ more productive (specialized reproduction + worker help).")
print("Eusociality is a genetically stable strategy, not self-sacrifice.")`,
      challenge: 'What happens to eusociality if a mutation makes workers reproduce at 50% queen efficiency instead of being sterile? Model the genetic conflict and predict whether the colony would fragment. (Hint: this is worker policing.)',
      successHint: 'Hamilton\'s rule and kin selection theory earned W.D. Hamilton a place among the most important evolutionary biologists of the 20th century. Understanding why bees cooperate reveals a deep truth: what looks like altruism is actually genetic self-interest at a different level.',
    },
    {
      title: 'Waggle dance communication — encoding distance and direction in movement',
      concept: `The waggle dance is one of the most remarkable communication systems in the animal kingdom. A returning forager performs a figure-eight dance on the vertical comb face, encoding the location of a food source:

**Direction**: the angle of the waggle run relative to vertical (gravity) indicates the angle of the food source relative to the sun. A waggle run pointing straight up means "fly toward the sun." A waggle run at 60° left of vertical means "fly 60° left of the sun."

**Distance**: the duration of the waggle run encodes distance. Longer waggle = farther food source. In Apis mellifera, ~1 second of waggling ≈ 1 km distance.

**Quality**: the vigor and number of dance repetitions indicate food quality. A rich nectar source gets an enthusiastic, prolonged dance. A mediocre source gets a halfhearted dance (or none at all).

The mathematics of dance decoding:
- Solar angle at time t: the bee must compensate for the sun's movement (~15° per hour)
- Distance encoding: duration_ms = α + β × distance_m (linear relationship, with species-specific α, β)
- Direction noise: dances have ±15° angular error, which creates a search cone at the destination
- Information decay: a dance describes a food source that was visited minutes ago; the sun has moved since then

This is a **vector communication** system: the bee transmits a polar coordinate (distance, direction) relative to an external reference (the sun). Karl von Frisch decoded this in the 1940s and won the Nobel Prize in 1973.`,
      analogy: 'The waggle dance is like giving driving directions using a compass and odometer. "Drive 3.2 km at bearing 210° from the sun" is exactly what the dance communicates. But instead of words, the bee uses body movements on a vertical surface, translating a horizontal direction (relative to the sun) into a vertical angle (relative to gravity). It is a coordinate transform performed by an insect brain the size of a sesame seed.',
      storyConnection: 'The honey hunter watches bees coming and going from the hive. Experienced hunters can read the bees\' behavior to find the nest — they follow the "bee line," the straight flight path of laden foragers returning home. The waggle dance is the mirror image: the bees follow each other\'s dances to find the flowers. Hunter and bee use the same information, encoded differently.',
      checkQuestion: 'A bee performs a waggle run lasting 1.5 seconds at an angle of 40° right of vertical. The sun is currently at azimuth 180° (due south). Where is the food source?',
      checkAnswer: 'Distance: 1.5 seconds ≈ 1.5 km. Direction: 40° right of the sun\'s azimuth = 180° + 40° = 220° (roughly southwest). So the food source is approximately 1.5 km to the southwest. The bee encoded this as a 40°-right waggle on the vertical comb, translating horizontal geography into a gravity-referenced dance.',
      codeIntro: 'Simulate the waggle dance communication system: encode a food source location as a dance, decode dances to reconstruct locations, and model the error distribution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Waggle dance encoding/decoding ---
def encode_dance(food_x, food_y, hive_x, hive_y, sun_azimuth_deg):
    """Encode food source location as waggle dance parameters."""
    dx = food_x - hive_x
    dy = food_y - hive_y

    # Distance
    distance = np.sqrt(dx**2 + dy**2)

    # Direction relative to sun
    food_azimuth = np.degrees(np.arctan2(dx, dy)) % 360  # 0=N, 90=E
    dance_angle = (food_azimuth - sun_azimuth_deg) % 360

    # Duration encoding: 1 second per km
    waggle_duration = distance / 1000  # km to seconds

    return {
        'distance': distance,
        'food_azimuth': food_azimuth,
        'dance_angle': dance_angle,
        'waggle_duration': waggle_duration,
    }

def decode_dance(dance_angle, waggle_duration, hive_x, hive_y, sun_azimuth_deg,
                 angle_noise_sd=15, duration_noise_sd=0.2):
    """Decode a waggle dance back to estimated food location (with noise)."""
    # Add perception noise
    perceived_angle = dance_angle + np.random.normal(0, angle_noise_sd)
    perceived_duration = waggle_duration + np.random.normal(0, duration_noise_sd)
    perceived_duration = max(0.1, perceived_duration)

    # Decode direction
    food_azimuth = (perceived_angle + sun_azimuth_deg) % 360
    azimuth_rad = np.radians(food_azimuth)

    # Decode distance
    distance = perceived_duration * 1000  # seconds to meters

    # Compute food location estimate
    est_x = hive_x + distance * np.sin(azimuth_rad)
    est_y = hive_y + distance * np.cos(azimuth_rad)

    return est_x, est_y, distance, food_azimuth

# Setup
hive = (0, 0)  # hive at origin
sun_azimuth = 150  # degrees (SSE)

# Food sources
food_sources = [
    {'name': 'Wildflowers', 'x': 1200, 'y': 800, 'quality': 0.9},
    {'name': 'Orchard', 'x': -500, 'y': 1500, 'quality': 0.7},
    {'name': 'Garden', 'x': -1000, 'y': -600, 'quality': 0.5},
    {'name': 'Meadow', 'x': 2000, 'y': -200, 'quality': 0.8},
]

# Encode dances for each source
dances = []
for food in food_sources:
    dance = encode_dance(food['x'], food['y'], hive[0], hive[1], sun_azimuth)
    dance['name'] = food['name']
    dance['quality'] = food['quality']
    dance['true_x'] = food['x']
    dance['true_y'] = food['y']
    dances.append(dance)

# Simulate 50 bees decoding each dance
n_followers = 50
decoded_positions = {}
for dance in dances:
    positions = []
    for _ in range(n_followers):
        ex, ey, _, _ = decode_dance(dance['dance_angle'], dance['waggle_duration'],
                                      hive[0], hive[1], sun_azimuth)
        positions.append((ex, ey))
    decoded_positions[dance['name']] = positions

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Waggle Dance Communication System', color='white', fontsize=14)

# Plot 1: Map with food sources and decoded positions
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(0, 0, s=200, c='#f59e0b', marker='s', zorder=5, label='Hive')
colors_food = ['#22c55e', '#3b82f6', '#a855f7', '#ef4444']
for dance, color in zip(dances, colors_food):
    ax.scatter(dance['true_x'], dance['true_y'], s=150, c=color, marker='*', zorder=5,
               label=dance['name'])
    positions = decoded_positions[dance['name']]
    xs = [p[0] for p in positions]
    ys = [p[1] for p in positions]
    ax.scatter(xs, ys, s=10, c=color, alpha=0.3, edgecolors='none')

# Sun direction arrow
sun_rad = np.radians(sun_azimuth)
ax.annotate('', xy=(500*np.sin(sun_rad), 500*np.cos(sun_rad)), xytext=(0, 0),
            arrowprops=dict(arrowstyle='->', color='#f59e0b', linewidth=2))
ax.text(400*np.sin(sun_rad), 400*np.cos(sun_rad) + 100, 'Sun', color='#f59e0b', fontsize=8)

ax.set_xlabel('East-West (m)', color='white')
ax.set_ylabel('North-South (m)', color='white')
ax.set_title('Food sources & decoded positions', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Plot 2: Dance parameters
ax = axes[0, 1]
ax.set_facecolor('#111827')
angles = [d['dance_angle'] for d in dances]
durations = [d['waggle_duration'] for d in dances]
names = [d['name'] for d in dances]
for i, (a, dur, name, color) in enumerate(zip(angles, durations, names, colors_food)):
    ax.scatter(a, dur, s=200, c=color, zorder=5, edgecolors='white')
    ax.annotate(name, (a, dur), color='white', fontsize=8,
               textcoords="offset points", xytext=(5, 5))
ax.set_xlabel('Dance angle (° from vertical)', color='white')
ax.set_ylabel('Waggle duration (seconds)', color='white')
ax.set_title('Dance encoding: angle = direction, duration = distance', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 3: Waggle dance figure-eight visualization
ax = axes[0, 2]
ax.set_facecolor('#111827')
# Simulate figure-eight dance path
dance = dances[0]
angle_rad = np.radians(dance['dance_angle'])
t = np.linspace(0, 4 * np.pi, 200)
# Waggle run (straight)
waggle_x = np.sin(angle_rad) * np.linspace(0, 2, 50)
waggle_y = np.cos(angle_rad) * np.linspace(0, 2, 50)
# Return loops
theta_r = np.linspace(0, np.pi, 50)
right_x = waggle_x[-1] + 0.5 * np.cos(theta_r + angle_rad)
right_y = waggle_y[-1] + 0.5 * np.sin(theta_r + angle_rad)
theta_l = np.linspace(np.pi, 2*np.pi, 50)
left_x = waggle_x[-1] + 0.5 * np.cos(theta_l + angle_rad)
left_y = waggle_y[-1] + 0.5 * np.sin(theta_l + angle_rad)

ax.plot(waggle_x, waggle_y, color='#f59e0b', linewidth=3, label='Waggle run')
ax.plot(right_x, right_y, color='gray', linewidth=1.5, linestyle='--', label='Return loop')
ax.plot(left_x, left_y, color='gray', linewidth=1.5, linestyle='--')
ax.annotate('', xy=(waggle_x[-1], waggle_y[-1]), xytext=(waggle_x[0], waggle_y[0]),
            arrowprops=dict(arrowstyle='->', color='#f59e0b', linewidth=2))

# Gravity arrow
ax.annotate('', xy=(0, -0.5), xytext=(0, 0.5),
            arrowprops=dict(arrowstyle='->', color='white', linewidth=1.5))
ax.text(0.1, 0, 'Gravity', color='white', fontsize=8, rotation=90)

ax.set_aspect('equal')
ax.set_title(f'Dance for {dance["name"]} ({dance["dance_angle"]:.0f}°)', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Error distribution
ax = axes[1, 0]
ax.set_facecolor('#111827')
dance = dances[0]  # wildflowers
positions = decoded_positions[dance['name']]
errors = [np.sqrt((p[0] - dance['true_x'])**2 + (p[1] - dance['true_y'])**2)
          for p in positions]
ax.hist(errors, bins=15, color='#3b82f6', edgecolor='none', alpha=0.8)
ax.axvline(np.mean(errors), color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Mean error: {np.mean(errors):.0f}m')
ax.set_xlabel('Error distance (m)', color='white')
ax.set_ylabel('Frequency', color='white')
ax.set_title(f'Decoding error: {dance["name"]}', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Dance quality (number of circuits) vs food quality
ax = axes[1, 1]
ax.set_facecolor('#111827')
qualities = [d['quality'] for d in dances]
circuits = [int(q * 20) + np.random.randint(0, 5) for q in qualities]
ax.bar(range(len(dances)), circuits, color=colors_food, edgecolor='none')
ax.set_xticks(range(len(dances)))
ax.set_xticklabels([d['name'] for d in dances], color='white', fontsize=8, rotation=15)
ax.set_ylabel('Dance circuits (repetitions)', color='white')
ax.set_title('Dance vigor correlates with food quality', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Sun compensation over time
ax = axes[1, 2]
ax.set_facecolor('#111827')
hours = np.linspace(0, 6, 100)  # 6 hours of dance
sun_movement = 15 * hours  # sun moves 15°/hour
original_angle = dances[0]['dance_angle']
compensated_angle = original_angle - sun_movement  # bee adjusts dance angle

ax.plot(hours, [original_angle] * len(hours), '--', color='gray', linewidth=1,
        label='Uncompensated')
ax.plot(hours, compensated_angle, color='#22c55e', linewidth=2, label='Sun-compensated')
ax.fill_between(hours, compensated_angle - 15, compensated_angle + 15,
                color='#22c55e', alpha=0.1, label='±15° noise')
ax.set_xlabel('Hours since food discovery', color='white')
ax.set_ylabel('Dance angle (°)', color='white')
ax.set_title('Solar compensation: bee adjusts for sun movement', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Waggle dance encoding summary:")
for d in dances:
    print(f"  {d['name']:>12}: dist={d['distance']:.0f}m  azimuth={d['food_azimuth']:.0f}°  dance_angle={d['dance_angle']:.0f}°  waggle={d['waggle_duration']:.2f}s")
print(f"\\nMean decoding error: {np.mean(errors):.0f}m (at {dances[0]['distance']:.0f}m range)")
print(f"That\'s {np.mean(errors)/dances[0]['distance']*100:.0f}% error — good enough to find a flower patch.")`,
      challenge: 'Simulate a "lying dance" — a bee dances for a food source that has been exhausted. Model how quickly the colony wastes foraging effort following stale dances, and how the colony self-corrects when scouts return empty-handed.',
      successHint: 'The waggle dance is information theory in action. The bee compresses a 2D location into two scalar values (angle, duration) with known noise characteristics. Karl von Frisch\'s decoding of this system earned the 1973 Nobel Prize and changed how we think about animal communication.',
    },
    {
      title: 'Foraging optimization — the marginal value theorem and collective intelligence',
      concept: `A foraging bee faces an optimization problem: which flower patches should she visit, how long should she stay at each, and when should she move on?

The **marginal value theorem** (Charnov, 1976) predicts: a forager should leave a patch when the instantaneous rate of return drops to the average rate for the entire habitat. Stay too long at a depleting patch and you miss better opportunities elsewhere.

For bees, this means:
- Visit the richest patches first (advertised by vigorous dances)
- Stay at a patch until nectar per flower drops below the travel-time-adjusted average
- Recruit more foragers to rich patches, fewer to poor ones

The colony achieves this through **distributed decision-making**: no bee has global knowledge, but the waggle dance creates a "marketplace" where patches compete for foragers based on profitability. Richer patches get more dances, attracting more foragers. Poorer patches get fewer dances and lose foragers.

This is equivalent to a **multi-armed bandit** problem in machine learning: explore new patches (follow random scouts) vs. exploit known good patches (follow waggle dances). The colony balances exploration and exploitation naturally through the dance system — scouts explore, recruits exploit.

The collective efficiency of bee foraging exceeds what any individual bee could achieve alone. This is **swarm intelligence** — the colony is smarter than any individual.`,
      analogy: 'Bee foraging is like a group of friends searching for the best restaurant in a new city. Some friends explore randomly (scouts). When one finds a great place, they enthusiastically recommend it (vigorous dance). Friends who have not found anything good follow the recommendation (recruits). Friends at mediocre restaurants gradually drift to the recommended one. The group converges on the best option without anyone having a complete map.',
      storyConnection: 'The honey hunter knows that bees are efficient foragers — they find the best nectar sources in the landscape and exploit them systematically. This efficiency is what produces the honey surplus that the hunter harvests. Understanding foraging optimization explains why some seasons produce abundant honey (many rich nectar sources) and others produce little (poor foraging conditions). The colony is an optimizer; the honey is the surplus.',
      checkQuestion: 'A patch has 100 flowers with 5μL nectar each. A bee extracts nectar at a declining rate: first flower takes 2 seconds, 50th flower takes 4 seconds, 100th flower takes 10 seconds. Average travel time to next patch is 60 seconds. When should the bee leave?',
      checkAnswer: 'The bee should leave when the marginal rate (nectar per second at the current flower) drops to the average habitat rate (including travel time). If the average is 5μL per 8 seconds = 0.625 μL/s, the bee should leave when extraction time per flower exceeds 5/0.625 = 8 seconds — roughly around flower 80-90. Staying for the last 10 flowers (10 seconds each) is not worth it because the time would be better spent traveling to a fresh patch.',
      codeIntro: 'Simulate bee foraging with the marginal value theorem, waggle dance recruitment, and collective patch exploitation to model colony-level foraging efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Foraging optimization model ---
n_patches = 6
n_bees = 200
n_timesteps = 100

# Patch properties
patches = {
    'name': ['Wildflowers', 'Orchard', 'Garden', 'Meadow', 'Field', 'Riverside'],
    'x': np.array([1.2, -0.5, -1.0, 2.0, 0.3, 1.5]),
    'y': np.array([0.8, 1.5, -0.6, -0.2, -1.2, 1.8]),
    'initial_nectar': np.array([1000, 800, 400, 1200, 300, 900]),  # total nectar (μL)
    'quality': np.array([0.9, 0.7, 0.4, 0.95, 0.3, 0.8]),  # nectar per flower
    'renewal_rate': np.array([20, 15, 8, 25, 5, 18]),  # μL/timestep renewal
}

# Current nectar levels
current_nectar = patches['initial_nectar'].copy().astype(float)
nectar_history = [current_nectar.copy()]

# Bee assignments (which patch each bee is visiting)
bee_patches = np.random.randint(0, n_patches, n_bees)
# Some bees are scouts (exploring randomly)
is_scout = np.random.random(n_bees) < 0.15

# Track metrics
total_collected = np.zeros(n_timesteps)
patch_visitors = np.zeros((n_timesteps, n_patches))
colony_efficiency = []

def marginal_return(nectar_remaining, initial_nectar, quality):
    """Diminishing returns: harder to extract as patch depletes."""
    fraction_remaining = nectar_remaining / max(initial_nectar, 1)
    return quality * fraction_remaining ** 0.5

for t in range(n_timesteps):
    timestep_collection = 0

    # Calculate current marginal returns for all patches
    marginal_returns = np.zeros(n_patches)
    for p in range(n_patches):
        marginal_returns[p] = marginal_return(current_nectar[p],
                                                patches['initial_nectar'][p],
                                                patches['quality'][p])

    # Average return across habitat (the threshold from MVT)
    mean_return = np.mean(marginal_returns[marginal_returns > 0])

    # Bee decisions
    for b in range(n_bees):
        if is_scout[b]:
            # Scouts explore randomly
            bee_patches[b] = np.random.randint(0, n_patches)
            is_scout[b] = np.random.random() < 0.15  # might stop scouting
        else:
            # Check if current patch is below threshold
            p = bee_patches[b]
            if marginal_returns[p] < mean_return * 0.8:
                # Leave patch, follow dance or scout
                if np.random.random() < 0.7:
                    # Follow dance (probability proportional to return)
                    probs = np.maximum(marginal_returns, 0.01)
                    probs = probs / np.sum(probs)
                    bee_patches[b] = np.random.choice(n_patches, p=probs)
                else:
                    # Become scout
                    is_scout[b] = True
                    bee_patches[b] = np.random.randint(0, n_patches)

        # Collect nectar
        p = bee_patches[b]
        collection = min(current_nectar[p] * 0.001, patches['quality'][p] * 0.5)
        current_nectar[p] -= collection
        current_nectar[p] = max(0, current_nectar[p])
        timestep_collection += collection

    # Nectar renewal
    current_nectar += patches['renewal_rate']
    current_nectar = np.minimum(current_nectar, patches['initial_nectar'] * 1.2)

    total_collected[t] = timestep_collection
    for p in range(n_patches):
        patch_visitors[t, p] = np.sum(bee_patches == p)
    colony_efficiency.append(timestep_collection / n_bees if n_bees > 0 else 0)
    nectar_history.append(current_nectar.copy())

nectar_history = np.array(nectar_history)

# Compare with naive strategy (uniform random)
np.random.seed(42)
naive_collected = np.zeros(n_timesteps)
naive_nectar = patches['initial_nectar'].copy().astype(float)
for t in range(n_timesteps):
    tc = 0
    for b in range(n_bees):
        p = np.random.randint(0, n_patches)
        collection = min(naive_nectar[p] * 0.001, patches['quality'][p] * 0.5)
        naive_nectar[p] -= collection
        naive_nectar[p] = max(0, naive_nectar[p])
        tc += collection
    naive_nectar += patches['renewal_rate']
    naive_nectar = np.minimum(naive_nectar, patches['initial_nectar'] * 1.2)
    naive_collected[t] = tc

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bee Foraging Optimization: Marginal Value Theorem & Collective Intelligence', color='white', fontsize=14)

colors_patches = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4']

# Plot 1: Forager distribution over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
for p in range(n_patches):
    ax.plot(patch_visitors[:, p], color=colors_patches[p], linewidth=1.5,
            label=patches['name'][p])
ax.set_xlabel('Timestep', color='white')
ax.set_ylabel('Number of foragers', color='white')
ax.set_title('Forager allocation to patches', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Nectar levels
ax = axes[0, 1]
ax.set_facecolor('#111827')
for p in range(n_patches):
    ax.plot(nectar_history[:, p], color=colors_patches[p], linewidth=1.5,
            label=patches['name'][p])
ax.set_xlabel('Timestep', color='white')
ax.set_ylabel('Nectar available (μL)', color='white')
ax.set_title('Patch depletion and renewal', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Smart vs naive collection
ax = axes[0, 2]
ax.set_facecolor('#111827')
# Cumulative
ax.plot(np.cumsum(total_collected), color='#22c55e', linewidth=2, label='MVT foraging')
ax.plot(np.cumsum(naive_collected), color='#ef4444', linewidth=2, label='Random foraging')
efficiency_gain = np.sum(total_collected) / max(np.sum(naive_collected), 1)
ax.set_xlabel('Timestep', color='white')
ax.set_ylabel('Cumulative nectar (μL)', color='white')
ax.set_title(f'Smart vs random ({efficiency_gain:.1f}x more efficient)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Marginal returns over time
ax = axes[1, 0]
ax.set_facecolor('#111827')
for p in range(n_patches):
    returns = [marginal_return(nectar_history[t, p], patches['initial_nectar'][p], patches['quality'][p])
               for t in range(len(nectar_history))]
    ax.plot(returns, color=colors_patches[p], linewidth=1.5, label=patches['name'][p])
ax.set_xlabel('Timestep', color='white')
ax.set_ylabel('Marginal return', color='white')
ax.set_title('Patch profitability over time', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Efficiency per bee
ax = axes[1, 1]
ax.set_facecolor('#111827')
window = 5
ma = np.convolve(colony_efficiency, np.ones(window)/window, mode='valid')
ax.plot(ma, color='#f59e0b', linewidth=2)
ax.set_xlabel('Timestep', color='white')
ax.set_ylabel('Nectar per bee per step', color='white')
ax.set_title('Colony foraging efficiency', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Final patch utilization
ax = axes[1, 2]
ax.set_facecolor('#111827')
final_visitors = patch_visitors[-1]
final_quality = patches['quality']
ax.scatter(final_quality, final_visitors, s=200, c=colors_patches, edgecolors='white',
           linewidths=1, zorder=5)
for p in range(n_patches):
    ax.annotate(patches['name'][p], (final_quality[p], final_visitors[p]),
               color='white', fontsize=8, textcoords="offset points", xytext=(5, 5))
# Fit line
z = np.polyfit(final_quality, final_visitors, 1)
x_fit = np.linspace(0.2, 1.0, 100)
ax.plot(x_fit, z[0] * x_fit + z[1], '--', color='#f59e0b', linewidth=1)
ax.set_xlabel('Patch quality', color='white')
ax.set_ylabel('Number of foragers', color='white')
ax.set_title('Foragers track quality (ideal free distribution)', color='white', fontsize=10)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Foraging results:")
print(f"  MVT-guided collection: {np.sum(total_collected):.0f} μL")
print(f"  Random foraging: {np.sum(naive_collected):.0f} μL")
print(f"  Efficiency gain: {efficiency_gain:.2f}x")
print(f"  Scouts (exploring): ~{np.mean(is_scout)*100:.0f}% of bees")
print(f"\\nThe colony allocates foragers proportional to patch quality.")
print(f"This is the 'ideal free distribution' — predicted by theory, achieved by dance.")`,
      challenge: 'Add a new patch that appears at timestep 50 with very high quality (1.0) and high nectar (2000). How quickly does the colony discover and exploit it? How does the scout fraction affect discovery speed?',
      successHint: 'Bee foraging algorithms inspired real optimization methods: Artificial Bee Colony (ABC) optimization, Swarm Intelligence, and the Explore-Exploit trade-off in reinforcement learning. The bees solved multi-armed bandits millions of years before computer scientists formalized the problem.',
    },
    {
      title: 'Pollination networks & colony collapse disorder — when the system breaks',
      concept: `Bees do not just make honey — they are the keystone of terrestrial ecosystems through **pollination**. A **pollination network** is a bipartite graph connecting plant species to their pollinator species. The structure of this network determines ecosystem resilience:

- **Nested networks**: specialist pollinators visit a subset of the plants visited by generalists. This nested structure makes the network robust — losing a specialist does not disconnect plants because generalists still visit them.
- **Connectance**: the fraction of possible plant-pollinator links that actually exist. Higher connectance = more redundancy.
- **Keystone species**: pollinators that, if removed, cause cascading extinctions of plants they uniquely serve.

**Colony Collapse Disorder (CCD)** — the sudden disappearance of worker bees — threatens this entire network. Causes include:
- **Neonicotinoid pesticides**: sublethal doses impair navigation (bees cannot find the hive) and learning (bees cannot learn new flower locations)
- **Varroa destructor mite**: parasitizes larvae, transmits viruses
- **Habitat loss**: fewer wildflowers = less diverse nutrition = weaker immune systems
- **Climate change**: phenological mismatch (bees emerge before flowers bloom)

CCD does not just kill bees — it unravels pollination networks. When bee species disappear, the plants they uniquely pollinate cannot reproduce, and the animals that eat those plants starve. This is a **trophic cascade** triggered by pollinator loss.`,
      analogy: 'A pollination network is like the electrical grid. Power plants (bees) supply electricity (pollen) to homes (plants). If a major power plant goes offline, some homes lose power unless other plants pick up the load. If the grid is well-connected (nested network), the lights stay on. If the grid is fragile (low connectance), a single plant failure causes a blackout (trophic cascade). CCD is like multiple power plants failing simultaneously.',
      storyConnection: 'The honey hunter\'s livelihood depends not just on honeybees but on the entire pollination network. If wild bees disappear from colony collapse, the wildflowers that feed the honeybees also decline. The forest that produces the honey hunter\'s other food — fruits, nuts, vegetables — all depend on pollination. The honey hunter\'s lesson is that taking too much from nature (overharvesting honey, using pesticides) destroys the system that sustains you.',
      checkQuestion: 'A pollination network has 10 bee species and 20 plant species. The most generalist bee visits 15 plants; the most specialist visits only 2. If the generalist goes extinct, what happens?',
      checkAnswer: 'Immediate impact: 15 plant species lose one pollinator. But because the network is nested, most of those plants are also visited by other bees. Only plants visited EXCLUSIVELY by the generalist (unlikely, since generalists overlap with specialists) would lose all pollination. The real danger: if the generalist was the only pollinator for even 1-2 plants, those plants go extinct, which then affects animals that depend on them. Network analysis identifies these vulnerabilities before they become crises.',
      codeIntro: 'Build a plant-pollinator network, analyze its structure (nestedness, connectance, keystone species), and simulate the cascading effects of pollinator loss from CCD.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Build a pollination network ---
n_bees = 8
n_plants = 15

bee_names = ['Apis mellifera', 'Bombus terrestris', 'Xylocopa', 'Osmia',
             'Andrena', 'Halictus', 'Megachile', 'Ceratina']
plant_names = [f'Plant_{i+1}' for i in range(n_plants)]

# Generalism score (0-1): generalists visit many plants
bee_generalism = np.array([0.9, 0.8, 0.5, 0.4, 0.6, 0.3, 0.35, 0.2])

# Create nested interaction matrix
# More generalist bees visit more plants; nested structure
interaction = np.zeros((n_bees, n_plants), dtype=int)
for b in range(n_bees):
    n_visits = max(1, int(bee_generalism[b] * n_plants))
    # Generalists visit the most popular plants first (nested)
    plant_popularity = np.random.dirichlet(np.ones(n_plants) * 2)
    visited = np.argsort(-plant_popularity)[:n_visits]
    for p in visited:
        if np.random.random() < bee_generalism[b]:
            interaction[b, p] = 1

# Ensure every plant has at least one pollinator
for p in range(n_plants):
    if np.sum(interaction[:, p]) == 0:
        interaction[np.random.randint(0, n_bees), p] = 1

# --- Network metrics ---
connectance = np.sum(interaction) / (n_bees * n_plants)
bee_degree = np.sum(interaction, axis=1)  # plants per bee
plant_degree = np.sum(interaction, axis=0)  # bees per plant

# Nestedness (NODF metric approximation)
def compute_nestedness(matrix):
    n_rows, n_cols = matrix.shape
    paired_overlaps = 0
    total_pairs = 0
    for i in range(n_rows):
        for j in range(i+1, n_rows):
            if np.sum(matrix[i]) > 0 and np.sum(matrix[j]) > 0:
                min_deg = min(np.sum(matrix[i]), np.sum(matrix[j]))
                overlap = np.sum(matrix[i] & matrix[j])
                if min_deg > 0:
                    paired_overlaps += overlap / min_deg
                    total_pairs += 1
    return paired_overlaps / total_pairs if total_pairs > 0 else 0

nestedness = compute_nestedness(interaction)

# --- Simulate CCD: remove bees and track plant extinctions ---
def simulate_removal(interaction_matrix, removal_order):
    """Remove bees in given order, track plants that lose all pollinators."""
    matrix = interaction_matrix.copy()
    n_plants_total = matrix.shape[1]
    plants_alive = n_plants_total
    results = [(0, plants_alive)]

    for bee_idx in removal_order:
        matrix[bee_idx, :] = 0
        # Count plants with zero pollinators
        plants_alive = np.sum(np.sum(matrix, axis=0) > 0)
        results.append((len(results), plants_alive))

    return results

# Different removal orders
# Most connected first (worst case)
order_most_connected = np.argsort(-bee_degree)
# Random order
order_random = np.random.permutation(n_bees)
# Least connected first (best case for network)
order_least_connected = np.argsort(bee_degree)

results_worst = simulate_removal(interaction, order_most_connected)
results_random = simulate_removal(interaction, order_random)
results_best = simulate_removal(interaction, order_least_connected)

# --- Keystone species analysis ---
keystone_impact = np.zeros(n_bees)
for b in range(n_bees):
    # How many plants would lose ALL pollinators if this bee disappears?
    test_matrix = interaction.copy()
    test_matrix[b, :] = 0
    plants_lost = np.sum(np.sum(test_matrix, axis=0) == 0)
    keystone_impact[b] = plants_lost

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Pollination Network & Colony Collapse Disorder', color='white', fontsize=14)

# Plot 1: Interaction matrix (sorted for nestedness)
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Sort both axes by degree for visual nestedness
bee_order = np.argsort(-bee_degree)
plant_order = np.argsort(-plant_degree)
sorted_matrix = interaction[bee_order][:, plant_order]
ax.imshow(sorted_matrix, cmap='YlGn', aspect='auto', interpolation='nearest')
ax.set_yticks(range(n_bees))
ax.set_yticklabels([bee_names[i][:10] for i in bee_order], color='white', fontsize=7)
ax.set_xlabel('Plants (sorted by degree)', color='white')
ax.set_title(f'Network matrix (connectance={connectance:.2f})', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 2: Degree distributions
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.barh(range(n_bees), bee_degree[bee_order], color='#f59e0b', edgecolor='none', height=0.6)
ax.set_yticks(range(n_bees))
ax.set_yticklabels([bee_names[i][:10] for i in bee_order], color='white', fontsize=7)
ax.set_xlabel('Number of plant partners', color='white')
ax.set_title('Bee generalism (degree)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Keystone species
ax = axes[0, 2]
ax.set_facecolor('#111827')
colors_ks = ['#ef4444' if k > 0 else '#22c55e' for k in keystone_impact]
ax.barh(range(n_bees), keystone_impact, color=colors_ks, edgecolor='none', height=0.6)
ax.set_yticks(range(n_bees))
ax.set_yticklabels([bee_names[i][:10] for i in range(n_bees)], color='white', fontsize=7)
ax.set_xlabel('Plants lost if this bee disappears', color='white')
ax.set_title('Keystone species analysis', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: Cascading extinction curves
ax = axes[1, 0]
ax.set_facecolor('#111827')
for results, label, color in [
    (results_worst, 'Most connected first', '#ef4444'),
    (results_random, 'Random order', '#f59e0b'),
    (results_best, 'Least connected first', '#22c55e'),
]:
    xs = [r[0] for r in results]
    ys = [r[1] for r in results]
    ax.plot(xs, ys, 'o-', color=color, linewidth=2, label=label)
ax.set_xlabel('Bee species removed', color='white')
ax.set_ylabel('Plant species with pollinators', color='white')
ax.set_title('Cascading extinctions: removal order matters', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: CCD impact simulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Simulate CCD: all bees lose 30% of colony
ccd_severities = np.linspace(0, 1, 20)
plants_functional = []
for severity in ccd_severities:
    # Each bee-plant interaction has probability (1-severity) of surviving
    test_matrix = np.zeros_like(interaction)
    for b in range(n_bees):
        for p in range(n_plants):
            if interaction[b, p] == 1:
                if np.random.random() > severity * (1 - bee_generalism[b]):
                    test_matrix[b, p] = 1
    plants_functional.append(np.sum(np.sum(test_matrix, axis=0) > 0))

ax.plot(ccd_severities * 100, plants_functional, 'o-', color='#ef4444', linewidth=2)
ax.axhline(n_plants * 0.5, color='#f59e0b', linestyle='--', linewidth=1, label='50% threshold')
ax.set_xlabel('CCD severity (% colony loss)', color='white')
ax.set_ylabel('Plants with functional pollination', color='white')
ax.set_title('CCD impact on pollination services', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Network robustness
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
rows = [
    ['Metric', 'Value', 'Interpretation'],
    ['Connectance', f'{connectance:.2f}', 'Moderate' if connectance > 0.2 else 'Low'],
    ['Nestedness', f'{nestedness:.2f}', 'High' if nestedness > 0.5 else 'Low'],
    ['Mean bee degree', f'{np.mean(bee_degree):.1f}', f'Avg {np.mean(bee_degree):.0f} plants/bee'],
    ['Max keystone impact', f'{int(max(keystone_impact))} plants', bee_names[int(np.argmax(keystone_impact))][:10]],
    ['50% plant loss at', f'{ccd_severities[np.argmin(np.abs(np.array(plants_functional) - n_plants/2))]*100:.0f}% CCD', ''],
]
table = ax.table(cellText=rows[1:], colLabels=rows[0], cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(8)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Network health assessment', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Network: {n_bees} pollinators × {n_plants} plants")
print(f"Connectance: {connectance:.2f}  Nestedness: {nestedness:.2f}")
print(f"Most generalist: {bee_names[np.argmax(bee_degree)]} ({max(bee_degree)} plants)")
print(f"Keystone pollinator: {bee_names[np.argmax(keystone_impact)]} ({int(max(keystone_impact))} unique plants)")
print(f"\\nCCD lesson: losing generalist pollinators is catastrophic.")
print(f"Nested network structure provides some resilience, but has limits.")`,
      challenge: 'Make the network more nested by ensuring every specialist bee only visits plants also visited by generalists. How does this change the robustness to CCD? Compare with a "random" network of the same connectance.',
      successHint: 'Pollination network analysis is critical for agricultural policy. Researchers use exactly these methods to predict the economic impact of pollinator loss — estimated at $235-577 billion per year globally. The honey hunter\'s lesson extends to all of agriculture: protect the pollinators, protect the food supply.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Pollination Ecologist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for pollination ecology computations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
