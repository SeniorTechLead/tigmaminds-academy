import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BeeForagingModelDiagram from '../diagrams/BeeForagingModelDiagram';
import BeePopulationDynamicsDiagram from '../diagrams/BeePopulationDynamicsDiagram';
import BeeGeneticsDiagram from '../diagrams/BeeGeneticsDiagram';
import BeeSwarmIntelligenceDiagram from '../diagrams/BeeSwarmIntelligenceDiagram';
import BeeVenomChemistryDiagram from '../diagrams/BeeVenomChemistryDiagram';

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

print("\n[Full visualization in playground]")`,
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

print("\n[Full visualization in playground]")`,
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

print("\n[Full visualization in playground]")`,
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

print("\n[Full visualization in playground]")`,
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

print("\n[Full visualization in playground]")`,
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
            diagram={[BeeForagingModelDiagram, BeePopulationDynamicsDiagram, BeeGeneticsDiagram, BeeSwarmIntelligenceDiagram, BeeVenomChemistryDiagram][i] ? createElement([BeeForagingModelDiagram, BeePopulationDynamicsDiagram, BeeGeneticsDiagram, BeeSwarmIntelligenceDiagram, BeeVenomChemistryDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
