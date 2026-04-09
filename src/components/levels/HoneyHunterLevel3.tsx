import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BeeForagingModelDiagram from '../diagrams/BeeForagingModelDiagram';
import BeePopulationDynamicsDiagram from '../diagrams/BeePopulationDynamicsDiagram';
import BeeGeneticsDiagram from '../diagrams/BeeGeneticsDiagram';
import BeeSwarmIntelligenceDiagram from '../diagrams/BeeSwarmIntelligenceDiagram';
import BeeVenomChemistryDiagram from '../diagrams/BeeVenomChemistryDiagram';

export default function HoneyHunterLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

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
    daily_deaths = adults / lifespan * np.random.uniform(0.9, 1.1)

    # New adults emerging from brood pipeline
    new_adults = brood[0]
    brood = np.roll(brood, -1)
    brood[-1] = surviving_eggs

    adults = max(100, adults + new_adults - daily_deaths)

    # Swarming check
    if adults > swarm_threshold and not swarmed and day > 120 and day < 200:
        adults *= (1 - swarm_fraction)
        swarmed = True
        swarm_day = day

    population.append(adults)
    egg_rates.append(eggs)
    death_rates.append(daily_deaths)

population = np.array(population)
egg_rates = np.array(egg_rates)

print("=== Bee Colony Annual Dynamics ===")
print(f"Starting population: 10,000 workers")
print(f"Peak population: {population.max():.0f} workers (day {np.argmax(population)})")
print(f"Minimum population: {population.min():.0f} workers (day {np.argmin(population)})")
if swarmed:
    print(f"\\nSwarming event on day {swarm_day} — colony split in half!")
    print(f"Population just before swarm: {swarm_threshold}+")
    print(f"Population just after swarm: {population[swarm_day]:.0f}")
else:
    print(f"\\nNo swarming occurred (never exceeded {swarm_threshold} threshold)")

print(f"\\n--- Seasonal breakdown ---")
spring = population[59:151]
summer = population[151:243]
fall = population[243:334]
winter = np.concatenate([population[334:], population[:59]])
print(f"Spring avg (day 60-150): {spring.mean():.0f} workers")
print(f"Summer avg (day 151-242): {summer.mean():.0f} workers")
print(f"Fall avg (day 243-333):   {fall.mean():.0f} workers")
print(f"Winter avg (day 334-59):  {winter.mean():.0f} workers")

print(f"\\n--- Egg laying ---")
print(f"Peak egg rate: {egg_rates.max():.0f} eggs/day (day {np.argmax(egg_rates)})")
print(f"Total eggs laid: {egg_rates.sum():.0f}")
print(f"Days with zero eggs: {np.sum(egg_rates < 1)}")

end_pop = population[-1]
print(f"\\nEnd-of-year population: {end_pop:.0f} workers")
if end_pop > 15000:
    print("Colony is healthy — strong winter cluster expected.")
elif end_pop > 8000:
    print("Colony is marginal — may struggle through a harsh winter.")
else:
    print("Colony is weak — high risk of winter collapse.")`,
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
        total_offspring += survivors
    return total_offspring

def colony_fitness(n_females, queen_fecundity=50, queen_survival=0.5):
    """One queen reproduces; all others help raise offspring."""
    offspring = np.random.poisson(queen_fecundity)
    # More helpers = better survival (diminishing returns)
    helper_boost = min(0.9, queen_survival + 0.02 * (n_females - 1))
    survivors = np.random.binomial(offspring, helper_boost)
    return survivors

# --- Print relatedness analysis ---
print("=== Haplodiploidy Relatedness Analysis ===")
print(f"{'Mates':>6}  {'Sister r':>10}  {'Mother-Daughter r':>18}  {'B/C threshold':>14}")
print("-" * 55)
for n in [1, 2, 5, 10, 15, 20]:
    rel = compute_relatedness(n)
    threshold = 1 / rel['r_sisters']
    print(f"{n:>6}  {rel['r_sisters']:>10.3f}  {rel['r_mother_daughter']:>18.3f}  {threshold:>14.2f}")

print(f"\\n--- Key insight ---")
r1 = compute_relatedness(1)
print(f"Single-mated queen: sisters share r = {r1['r_sisters']:.2f}")
print(f"  Workers are MORE related to sisters ({r1['r_sisters']:.2f}) than to own daughters (0.50)")
print(f"  -> Altruism evolves easily (B/C > {1/r1['r_sisters']:.2f})")

r10 = compute_relatedness(10)
print(f"\\nQueen mated with 10 males: sisters share r = {r10['r_sisters']:.2f}")
print(f"  Workers are LESS related to sisters ({r10['r_sisters']:.2f}) than to own daughters (0.50)")
print(f"  -> Queen pheromones must suppress worker reproduction")

# --- Colony vs individual fitness comparison ---
print(f"\\n=== Colony vs Individual Reproduction ===")
n_females = 20
n_trials = 500
indiv_results = [individual_fitness(n_females) for _ in range(n_trials)]
colony_results = [colony_fitness(n_females) for _ in range(n_trials)]

print(f"With {n_females} females, averaged over {n_trials} trials:")
print(f"  Individual strategy: {np.mean(indiv_results):.1f} +/- {np.std(indiv_results):.1f} total surviving offspring")
print(f"  Colony strategy:     {np.mean(colony_results):.1f} +/- {np.std(colony_results):.1f} total surviving offspring")
ratio = np.mean(colony_results) / np.mean(indiv_results)
print(f"  Colony advantage:    {ratio:.2f}x more offspring")
print(f"\\nEven though only 1 queen reproduces, cooperative care")
print(f"produces {ratio:.1f}x more surviving offspring than every")
print(f"female reproducing alone. This is why eusociality evolves.")`,
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

# --- Test with known food sources ---
food_sources = [
    ('Wildflower meadow', 2000, 1500),   # 2km north, 1.5km east
    ('Orchard', -500, 3000),              # 0.5km west, 3km north
    ('Garden', 800, -400),                # 0.8km east, 0.4km south
]
sun_azimuth = 150  # sun in the SSE (afternoon)

print("=== Waggle Dance Communication System ===")
print(f"Hive location: (0, 0)")
print(f"Sun azimuth: {sun_azimuth} degrees (SSE)")
print()

for name, fx, fy in food_sources:
    dance = encode_dance(fx, fy, hive[0], hive[1], sun_azimuth)
    print(f"--- {name} at ({fx}m, {fy}m) ---")
    print(f"  Distance: {dance['distance']:.0f} m")
    print(f"  Food azimuth: {dance['food_azimuth']:.1f} degrees")
    print(f"  Dance angle (relative to vertical): {dance['dance_angle']:.1f} degrees")
    print(f"  Waggle duration: {dance['waggle_duration']:.2f} seconds")
    print()

# --- Decode with noise: simulate 20 follower bees ---
print("=== Decoding Error Analysis ===")
print(f"Encoding the Wildflower meadow (2000m, 1500m)...")
dance = encode_dance(2000, 1500, 0, 0, sun_azimuth)

errors = []
for i in range(20):
    est_x, est_y, est_dist, est_az = decode_dance(
        dance['dance_angle'], dance['waggle_duration'],
        0, 0, sun_azimuth
    )
    error = np.sqrt((est_x - 2000)**2 + (est_y - 1500)**2)
    errors.append(error)

errors = np.array(errors)
print(f"20 follower bees decoded the dance:")
print(f"  Mean position error: {errors.mean():.0f} m")
print(f"  Max position error:  {errors.max():.0f} m")
print(f"  Min position error:  {errors.min():.0f} m")
print(f"  Std deviation:       {errors.std():.0f} m")

actual_dist = np.sqrt(2000**2 + 1500**2)
print(f"\\nActual distance to food: {actual_dist:.0f} m")
print(f"Error as % of distance: {errors.mean()/actual_dist*100:.1f}%")
print(f"\\nThe +/-15 degree noise creates a search cone ~{2*actual_dist*np.sin(np.radians(15)):.0f}m")
print(f"wide at the target distance. Bees spiral-search within this cone.")`,
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
    mean_return = np.mean(marginal_returns[marginal_returns > 0]) if np.any(marginal_returns > 0) else 0.01

    for bee in range(n_bees):
        patch = bee_patches[bee]

        if is_scout[bee]:
            # Scouts explore randomly
            new_patch = np.random.randint(0, n_patches)
            bee_patches[bee] = new_patch
            patch = new_patch

        # Forage at current patch
        mr = marginal_returns[patch]
        collected = mr * np.random.uniform(0.8, 1.2)
        nectar_taken = min(collected, current_nectar[patch] / max(1, np.sum(bee_patches == patch)))
        current_nectar[patch] = max(0, current_nectar[patch] - nectar_taken)
        timestep_collection += nectar_taken

        # MVT decision: leave if marginal return < average
        if not is_scout[bee] and mr < mean_return * 0.8:
            # Switch to best-advertised patch (waggle dance recruitment)
            best_patch = np.argmax(marginal_returns)
            bee_patches[bee] = best_patch

    # Nectar renewal
    for p in range(n_patches):
        current_nectar[p] = min(patches['initial_nectar'][p],
                                current_nectar[p] + patches['renewal_rate'][p])

    total_collected[t] = timestep_collection
    for p in range(n_patches):
        patch_visitors[t, p] = np.sum(bee_patches == p)
    colony_efficiency.append(timestep_collection / n_bees)
    nectar_history.append(current_nectar.copy())

nectar_history = np.array(nectar_history)

print("=== Foraging Optimization Results ===")
print(f"{n_bees} bees foraging across {n_patches} patches over {n_timesteps} timesteps")
print(f"Scout fraction: 15%\\n")

print("--- Patch summary ---")
print(f"{'Patch':<14} {'Init Nectar':>11} {'Quality':>8} {'Avg Visitors':>13} {'Final Nectar':>13}")
print("-" * 62)
for p in range(n_patches):
    avg_vis = patch_visitors[:, p].mean()
    print(f"{patches['name'][p]:<14} {patches['initial_nectar'][p]:>11.0f} {patches['quality'][p]:>8.2f} {avg_vis:>13.1f} {current_nectar[p]:>13.1f}")

print(f"\\n--- Colony performance ---")
print(f"Total nectar collected: {total_collected.sum():.0f} units")
print(f"Average per timestep:   {total_collected.mean():.1f} units")
print(f"Peak collection:        {total_collected.max():.1f} units (timestep {np.argmax(total_collected)})")
print(f"Average efficiency:     {np.mean(colony_efficiency):.2f} units/bee/timestep")

# Show how bees redistributed over time
print(f"\\n--- Bee redistribution (MVT in action) ---")
print(f"Initial distribution: roughly equal ({n_bees // n_patches} per patch)")
print(f"Final distribution:")
for p in range(n_patches):
    n_final = int(patch_visitors[-1, p])
    bar = '#' * (n_final // 2)
    print(f"  {patches['name'][p]:<14}: {n_final:>3} bees {bar}")
print(f"\\nBees concentrate on high-quality patches (Meadow, Wildflowers)")
print(f"and abandon depleted ones — the marginal value theorem in action.")`,
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
    return paired_overlaps / total_pairs if total_pairs > 0 else 0

nestedness = compute_nestedness(interaction)

# Vulnerability: plants with only 1 pollinator
vulnerable_plants = [i for i in range(n_plants) if plant_degree[i] == 1]
sole_pollinators = set()
for p in vulnerable_plants:
    sole_poll = np.where(interaction[:, p] == 1)[0][0]
    sole_pollinators.add(sole_poll)

# --- Simulate removal of most-connected pollinator ---
most_connected = np.argmax(bee_degree)
reduced = interaction.copy()
reduced[most_connected, :] = 0
plants_lost = [p for p in range(n_plants) if np.sum(reduced[:, p]) == 0]

print("=== Pollination Network Analysis ===")
print(f"Network: {n_bees} bee species x {n_plants} plant species")
print(f"Total interactions: {np.sum(interaction)}")
print(f"Connectance: {connectance:.3f} ({connectance*100:.1f}% of possible links)")
print(f"Nestedness (NODF): {nestedness:.3f}")

print(f"\\n--- Pollinator degree (plants visited) ---")
sorted_bees = np.argsort(-bee_degree)
for b in sorted_bees:
    role = " [GENERALIST]" if bee_degree[b] > np.median(bee_degree) else " [specialist]"
    sole_marker = " ** sole pollinator" if b in sole_pollinators else ""
    print(f"  {bee_names[b]:<20}: {bee_degree[b]:>2} plants{role}{sole_marker}")

print(f"\\n--- Plant vulnerability ---")
print(f"Plants with only 1 pollinator: {len(vulnerable_plants)} out of {n_plants}")
if vulnerable_plants:
    for p in vulnerable_plants:
        sole = np.where(interaction[:, p] == 1)[0][0]
        print(f"  {plant_names[p]} -> sole pollinator: {bee_names[sole]}")

print(f"\\n--- Keystone removal simulation ---")
print(f"Removing most-connected bee: {bee_names[most_connected]} (degree {bee_degree[most_connected]})")
if plants_lost:
    print(f"  Plants losing ALL pollinators: {len(plants_lost)}")
    for p in plants_lost:
        print(f"    {plant_names[p]} -> EXTINCT (no remaining pollinators)")
else:
    print(f"  No plants lose all pollinators (network is resilient)")

new_connectance = np.sum(reduced) / ((n_bees - 1) * n_plants)
print(f"  Connectance drops: {connectance:.3f} -> {new_connectance:.3f}")
print(f"\\nConclusion: {'HIGH' if len(plants_lost) > 2 else 'MODERATE' if len(plants_lost) > 0 else 'LOW'} vulnerability to keystone loss")`,
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
            />
        ))}
      </div>
    </div>
  );
}
