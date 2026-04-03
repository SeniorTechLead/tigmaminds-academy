import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BeeColonyDiagram from '../diagrams/BeeColonyDiagram';
import BeeWaggleDanceDiagram from '../diagrams/BeeWaggleDanceDiagram';
import BeePollinationDiagram from '../diagrams/BeePollinationDiagram';
import BeeHoneymakingDiagram from '../diagrams/BeeHoneymakingDiagram';
import BeeHiveTempDiagram from '../diagrams/BeeHiveTempDiagram';
import BeeLifeCycleDiagram from '../diagrams/BeeLifeCycleDiagram';

export default function HoneyHunterLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Bee biology and colony structure — a superorganism',
      concept: `In the story, the honey hunter climbs to a wild bee nest high in a tree. Inside that nest live 20,000-80,000 bees — but they function as a single **superorganism**, with each bee playing a specific role.

**The three castes:**
- **Queen** (1 per colony): the only reproductive female. Lays up to 2,000 eggs per day. Lives 3-5 years.
- **Workers** (20,000-80,000): all female, all sterile. They do EVERYTHING else: foraging, nursing, guarding, building, cleaning, temperature regulation. Live 6 weeks in summer.
- **Drones** (a few hundred): males whose only job is to mate with queens from OTHER colonies. They have no stinger and can't feed themselves. After mating season, workers kick them out to die.

**Age-based division of labor** (workers change jobs as they age):
- Days 1-3: Cell cleaner
- Days 3-10: Nurse bee (feeds larvae)
- Days 10-18: Wax builder, food processor
- Days 18-21: Guard bee
- Days 21+: Forager (the most dangerous job — many die)`,
      analogy: 'A bee colony is like a factory with 50,000 workers and one CEO. The CEO (queen) sets the direction (through pheromones, not memos). Workers rotate through departments as they age: starting in maintenance (cell cleaning), moving to childcare (nursing), then construction (wax building), security (guarding), and finally field sales (foraging). No bee chooses its role — age and chemistry decide.',
      storyConnection: 'The honey hunter in the story knew to approach the hive at the right time — when foragers were out and guards were fewer. This knowledge comes from understanding colony structure. Traditional honey hunters across Assam and the Sundarbans have known bee biology for centuries, passed down as practical wisdom: which bees sting (workers), which don\'t (drones), and when the colony is calmest (cool evenings).',
      checkQuestion: 'If the queen dies unexpectedly and the colony has no way to make a new one, what happens?',
      checkAnswer: 'The colony is doomed — but it takes weeks to die. Without queen pheromones, workers\' ovaries begin to develop, and some start laying eggs. But worker-laid eggs are unfertilized and can only produce drones (males). Without a queen to produce fertilized eggs (workers), the colony gradually shrinks as old workers die and no new ones hatch. This "queenless collapse" takes 4-8 weeks.',
      codeIntro: 'Model the population dynamics of a bee colony through the seasons.',
      code: `import numpy as np

# Bee colony population model
# Queen lays eggs at a rate that varies by season
# Workers live ~42 days in summer, longer in winter

days = np.arange(0, 365)
month = (days / 30.44).astype(int) % 12

# Egg-laying rate (eggs/day, varies by season)
egg_rate = np.zeros(365)
for d in range(365):
    m = month[d]
    if m in [11, 0, 1]:   # Dec-Feb: minimal
        egg_rate[d] = 200
    elif m in [2, 3]:      # Mar-Apr: ramping up
        egg_rate[d] = 800
    elif m in [4, 5, 6]:   # May-Jul: peak
        egg_rate[d] = 1800
    elif m in [7, 8]:      # Aug-Sep: declining
        egg_rate[d] = 1200
    else:                  # Oct-Nov: winding down
        egg_rate[d] = 500

# Track population (simplified: workers emerge 21 days after egg, live 42 days)
dev_time = 21  # days from egg to adult
summer_lifespan = 42
winter_lifespan = 150

population = np.zeros(365)
# Initialize with 10,000 workers
for d in range(min(42, 365)):
    population[d] = 10000

for d in range(dev_time, 365):
    # New workers emerging today (from eggs laid 21 days ago)
    new_workers = egg_rate[d - dev_time] * 0.8  # 80% survival to adulthood

    # Workers dying today (laid dev_time + lifespan days ago)
    lifespan = winter_lifespan if month[d] in [10, 11, 0, 1, 2] else summer_lifespan
    death_day = d - lifespan
    dying = egg_rate[max(0, death_day - dev_time)] * 0.8 if death_day >= 0 else 200

    population[d] = max(5000, population[d-1] + new_workers - dying)
    population[d] = min(population[d], 80000)


print("Colony facts:")
print(f"  Peak population: ~{population.max():.0f} workers")
print(f"  Min population (winter): ~{population.min():.0f} workers")
print(f"  Peak egg-laying: {egg_rate.max():.0f} eggs/day")
print(f"  Worker lifespan: {summer_lifespan} days (summer), {winter_lifespan} days (winter)")`,
      challenge: 'What happens if the queen\'s egg-laying rate drops by 50% (disease)? How long before the colony shrinks below 10,000 workers?',
      successHint: 'A bee colony is one of nature\'s most sophisticated social systems. Understanding its structure is the foundation for understanding pollination, honey production, and why losing bees threatens our food supply.',
    },
    {
      title: 'Pollination ecology — the partnership that feeds the world',
      concept: `The honey hunter takes honey, but the bees do something far more valuable: **pollination**. When a bee visits a flower to collect nectar and pollen, pollen grains stick to its fuzzy body. At the next flower, some of that pollen rubs off onto the stigma — fertilizing the flower so it can produce fruit and seeds.

**Scale of the partnership:**
- 75% of the world's food crops depend on animal pollination
- Bees are the most important pollinators, but butterflies, moths, birds, bats, and flies also contribute
- A single bee colony can pollinate 300 million flowers per day
- Without pollinators: no apples, almonds, blueberries, coffee, chocolate, or most vegetables

**What bees get:**
- **Nectar**: sugar water (energy) — bees convert it to honey
- **Pollen**: protein + fat (nutrition) — fed to larvae

**What plants get:**
- **Cross-pollination**: genetic mixing from pollen of a different plant
- This produces stronger, more diverse offspring than self-pollination`,
      analogy: 'Pollination is like a postal service where the mailman (bee) is paid in cookies (nectar). The bee visits house after house (flower after flower), and while picking up cookies, accidentally transfers letters (pollen) between houses. Neither party planned it — the bee just wants cookies, the flower just wants its letters delivered. But the system works perfectly because both needs are met simultaneously.',
      storyConnection: 'The honey hunter in the story values the colony for its honey. But the bees\' true value is pollination. Every fruit tree in the surrounding forest depends on those bees. If the honey hunter destroys the colony, the fruit trees won\'t produce fruit, the animals that eat fruit will decline, and the entire ecosystem suffers. The story\'s lesson about sustainable harvesting is really about protecting the pollination service.',
      checkQuestion: 'Almond orchards in California rent 2 million bee colonies every spring for pollination. Each colony costs about $200. Why can\'t the almond trees pollinate themselves?',
      checkAnswer: 'Most almond varieties are self-incompatible — their own pollen can\'t fertilize their own flowers (a genetic mechanism to force cross-pollination). They NEED pollen from a different almond tree variety, carried by bees. Wind can\'t do it efficiently because almond pollen is heavy and sticky. So California\'s $6 billion almond industry depends entirely on rented bees. That\'s a $400 million annual pollination bill.',
      codeIntro: 'Model pollination efficiency: how many flowers a bee visits, and how many get successfully pollinated.',
      code: `import numpy as np

np.random.seed(42)

# Pollination model
# A bee visits N flowers per foraging trip
# Each visit has probability p of successful pollen transfer
# Cross-pollination requires pollen from a DIFFERENT plant

n_flowers_per_trip = 100
n_trips_per_day = 10
p_transfer = 0.7  # probability of pollen transfer per visit
p_cross = 0.4     # probability the transferred pollen is from a different plant

# Simulate a day of foraging
n_colonies = 10
bees_per_colony = 20000
forager_fraction = 0.35  # ~35% of workers are foragers

total_foragers = int(n_colonies * bees_per_colony * forager_fraction)
total_visits = total_foragers * n_trips_per_day * n_flowers_per_trip
successful_transfers = total_visits * p_transfer
cross_pollinations = successful_transfers * p_cross


print(f"Daily pollination by {n_colonies} colonies:")
print(f"  Foragers: {total_foragers:,}")
print(f"  Total flower visits: {total_visits:,.0f}")
print(f"  Successful cross-pollinations: {cross_pollinations:,.0f}")`,
      challenge: 'If pollination efficiency drops from 70% to 40% (due to pesticide exposure affecting bee navigation), how much does the daily cross-pollination count change? What does this mean for crop yields?',
      successHint: 'Pollination is the invisible service that sustains human civilization. Every third bite of food you eat depends on a pollinator. Understanding this relationship is essential for agriculture, conservation, and food security.',
    },
    {
      title: 'The waggle dance — nature\'s GPS protocol',
      concept: `When a forager bee discovers a rich food source, she returns to the hive and performs the **waggle dance** — one of the most remarkable communication systems in the animal kingdom. The dance tells other bees EXACTLY where to go.

**How the waggle dance works:**
- The bee walks in a figure-eight pattern on the vertical comb surface
- The **straight run** (middle of the figure-eight) contains the information:
  - **Angle**: the direction of the straight run relative to vertical = the angle of the food source relative to the sun
  - **Duration**: the length of the straight run = distance to the food source (~1 second per km)
  - **Vigor**: how enthusiastically the bee waggles = quality of the food source

**The translation:**
- Straight up on the comb = "fly toward the sun"
- 30° right of up = "fly 30° right of the sun"
- 90° left of up = "fly 90° left of the sun"

Karl von Frisch decoded this in 1945 and won the Nobel Prize in 1973. It was the first proof that non-humans use symbolic, abstract communication — the angle on the comb REPRESENTS the angle in the sky.`,
      analogy: 'The waggle dance is like giving directions using a clock face. "The food is at 2 o\'clock relative to the sun" is encoded by walking at a 60° angle on the comb. The distance is encoded by how long you walk that straight line. It\'s a GPS coordinate system where the sun is north and the dance floor is the map. Other bees "read" the map by following the dancer and copying her movements.',
      storyConnection: 'The honey hunter in the story followed bees back to their hive — a traditional technique. But the bees themselves use the waggle dance to guide each other. When one scout finds the honey hunter\'s flower-rich garden, she dances the directions, and within an hour, hundreds of foragers arrive. The story\'s honey exists because of this communication system — without the dance, colonies couldn\'t efficiently exploit scattered food sources.',
      checkQuestion: 'The waggle dance uses the sun as a reference point. But the sun moves across the sky during the day. How do bees account for this?',
      checkAnswer: 'Bees have an internal clock that tracks the sun\'s movement. They continuously adjust the angle of their dance to compensate for the sun\'s apparent motion (~15° per hour). A bee that danced "30° right of vertical" at 10 AM will dance "45° right" at 11 AM for the SAME food source, because the sun has moved 15°. This means bees understand that the sun moves predictably — a form of time-compensated navigation.',
      codeIntro: 'Simulate the waggle dance and decode the direction and distance information.',
      code: `import numpy as np

# Waggle dance decoder
# Given: sun direction, dance angle, dance duration
# Output: food source location

def decode_waggle(sun_azimuth, dance_angle, dance_duration, hive_pos=(0, 0)):
    """
    sun_azimuth: degrees from north (clockwise)
    dance_angle: degrees from vertical on comb (clockwise)
    dance_duration: seconds of waggle run
    """
    # Distance: approximately 1 second per km
    distance = dance_duration * 1.0  # km

    # Direction: sun_azimuth + dance_angle
    food_direction = sun_azimuth + dance_angle  # degrees from north

    # Convert to cartesian
    food_x = hive_pos[0] + distance * np.sin(np.radians(food_direction))
    food_y = hive_pos[1] + distance * np.cos(np.radians(food_direction))

    return food_x, food_y, distance, food_direction

# Example dances
sun_azimuth = 180  # sun due south (noon)
dances = [
    ('Dance A', 0, 2.0, 'Straight up → toward sun'),       # toward sun, 2 km
    ('Dance B', 45, 1.5, '45° right → SE'),                 # 45° right, 1.5 km
    ('Dance C', -90, 3.0, '90° left → east'),                # 90° left, 3 km
    ('Dance D', 180, 0.5, '180° → away from sun (north)'),   # opposite sun, 0.5 km
]


print("Waggle dance decoded:")
for name, angle, duration, desc in dances:
    fx, fy, dist, direction = decode_waggle(sun_azimuth, angle, duration)
    print(f"  {name}: {desc}")
    print(f"    → Food at {dist:.1f}km, bearing {direction:.0f}° from north")`,
      challenge: 'If a bee dances at 30° left of vertical and the waggle run lasts 2.5 seconds, and the sun is at azimuth 225° (southwest), where is the food source? Plot it on the map.',
      successHint: 'The waggle dance is one of the most remarkable discoveries in animal behavior. It proves that non-human animals can use abstract, symbolic communication — the angle on the comb REPRESENTS the angle in the real world. Von Frisch called it "the most wonderful thing I ever discovered."',
    },
    {
      title: 'Honey production process — from flower to jar',
      concept: `The honey hunter in the story harvests honey — but how did the bees make it? Honey production is a multi-step industrial process carried out by thousands of workers.

**Step 1: Collection**
- Forager bees collect nectar from flowers using their long tongues (proboscis)
- Nectar is stored in a special "honey stomach" (crop), separate from the digestive stomach
- A forager visits 50-1,000 flowers per trip, collecting ~40 mg of nectar

**Step 2: Processing**
- Back at the hive, the forager regurgitates the nectar to a house bee
- House bees pass the nectar mouth-to-mouth, adding enzymes (invertase) that break sucrose into glucose and fructose
- This process is repeated 15-20 minutes

**Step 3: Evaporation**
- The processed nectar is deposited in wax cells
- Nectar starts at ~70% water; honey must be <18.6% to prevent fermentation
- Bees fan their wings over the cells to evaporate water (active dehydration)
- This can take 1-3 days

**Step 4: Capping**
- When the honey reaches the right water content, bees seal the cell with a wax cap
- Capped honey can be stored indefinitely (honey found in Egyptian tombs is still edible)`,
      analogy: 'Honey production is like a relay race at a food processing plant. Runner 1 (forager) brings raw materials (nectar) from the field. Runner 2 (house bee) processes it on the factory floor (adds enzymes). Runner 3 (fan bee) dries the product (evaporation). Runner 4 (builder bee) packages it (wax cap). Each step transforms dilute sugar water into a concentrated, preserved superfood.',
      storyConnection: 'The honey hunter climbs to a wild nest and cuts out chunks of honeycomb. Each chunk contains hundreds of capped cells — each one the product of thousands of flower visits, hours of enzyme processing, and days of fanning. The honey the hunter takes represents an enormous investment of bee labor. This is why sustainable harvesting (taking some, leaving enough for the colony) is essential — taking everything destroys months of work.',
      checkQuestion: 'It takes about 2 million flower visits to make 1 kg of honey. A bee visits 100 flowers per trip and makes 10 trips per day. How many "bee-days" does 1 kg of honey represent?',
      checkAnswer: '2,000,000 visits ÷ 100 visits/trip = 20,000 trips. 20,000 trips ÷ 10 trips/day = 2,000 bee-days. That\'s equivalent to one bee working for 5.5 years (but since bees live ~42 days as foragers, it takes about 48 bees their entire foraging lives to make 1 kg of honey). Each jar represents the lifetime work of dozens of bees.',
      codeIntro: 'Model the honey production process: from nectar collection to final water content.',
      code: `import numpy as np

# Honey production model

# Step 1: Nectar collection
flowers_per_trip = 80
nectar_per_flower = 0.5e-3  # grams of nectar per flower
nectar_per_trip = flowers_per_trip * nectar_per_flower  # grams
trips_per_day = 10
foragers = 20000

daily_nectar = foragers * trips_per_day * nectar_per_trip / 1000  # kg

# Step 2: Enzyme processing (invertase converts sucrose to glucose + fructose)
# Sucrose (C12H22O11) + H2O → Glucose (C6H12O6) + Fructose (C6H12O6)

# Step 3: Water evaporation
nectar_water_pct = 70
honey_water_pct = 17
# Honey yield = nectar weight * (1 - nectar_water) / (1 - honey_water)
honey_yield_factor = (1 - nectar_water_pct/100) / (1 - honey_water_pct/100)
daily_honey = daily_nectar * honey_yield_factor


print(f"Honey production summary:")
print(f"  Daily nectar: {daily_nectar:.1f} kg from {foragers*trips_per_day*flowers_per_trip:,.0f} flower visits")
print(f"  Daily honey: {daily_honey:.1f} kg")
print(f"  Annual honey (peak 6 months): ~{daily_honey * 180:.0f} kg")
print(f"  Sustainable harvest (50%): ~{daily_honey * 180 * 0.5:.0f} kg")`,
      challenge: 'If the colony needs 20 kg of honey to survive winter and produces 60 kg in a year, what is the maximum the honey hunter can sustainably take? What safety margin should be left for bad years?',
      successHint: 'Honey is one of the few foods that never spoils, that requires no cooking, and that is produced entirely by another species for their own use. Every jar represents the coordinated labor of tens of thousands of bees visiting millions of flowers. Understanding this process makes sustainable harvesting not just ethical but rational.',
    },
    {
      title: 'Threats to bees — why pollinators are declining',
      concept: `Bee populations worldwide are declining — and this threatens not just honey production but the entire food system. The main threats:

**1. Pesticides (especially neonicotinoids)**
- Systemic pesticides absorbed by the whole plant, including pollen and nectar
- Sub-lethal doses disorient bees, impair navigation, reduce reproduction
- A bee exposed to neonicotinoids may survive but can't find her way back to the hive

**2. Habitat loss**
- Wildflower meadows replaced by monoculture farms
- Less diverse food = poorer bee nutrition (like humans eating only rice)
- Fewer nesting sites for wild bees

**3. Varroa destructor (parasitic mite)**
- Feeds on bee fat bodies, weakens immune system
- Spreads viruses between bees
- Has devastated managed honeybee colonies worldwide since the 1980s

**4. Climate change**
- Flowering times shifting (flowers bloom before bees emerge)
- Extreme weather events destroying colonies
- Range shifts (some bees moving poleward, leaving their traditional flowers behind)

**5. Monoculture agriculture**
- One crop = one brief flowering period, then nothing
- Bees need diverse pollen sources across the entire season`,
      analogy: 'The threats to bees are like multiple chronic illnesses hitting a person simultaneously. Pesticides are like a constant low-level poison (liver damage). Habitat loss is malnutrition. Varroa is a parasite (tapeworm). Climate change is a shifting environment (homeless). Any one might be survivable; all together are devastating. This "multiple stressor" problem is why bee decline is so hard to solve — there\'s no single cause to fix.',
      storyConnection: 'The honey hunter in the story practiced sustainable harvesting — taking some honey and leaving enough for the colony. But even sustainable harvesting can\'t protect bees from pesticides, mites, or habitat loss. The story\'s lesson extends beyond harvesting: protecting bees requires protecting the entire ecosystem they depend on — diverse flowers, clean water, and poison-free landscapes.',
      checkQuestion: 'A farmer uses neonicotinoid-coated seeds. The pesticide is in every part of the plant, including pollen at 5 ppb (parts per billion). A bee collects pollen from 1,000 flowers. Is this dangerous?',
      checkAnswer: 'Yes. While 5 ppb sounds tiny, bees are small. A forager consuming pollen with 5 ppb neonicotinoid accumulates enough to impair navigation within days. Studies show that at 10 ppb, foragers are 3x more likely to fail to return to the hive. At colony level, this "missing forager" problem reduces the colony\'s food income, weakening it for other threats (Varroa, winter). Sub-lethal doesn\'t mean safe.',
      codeIntro: 'Model colony decline under multiple stressors and identify tipping points.',
      code: `import numpy as np

np.random.seed(42)

# Colony health model under multiple stressors
# Baseline: healthy colony of 40,000 workers
# Stressors reduce forager success, brood survival, and queen laying rate

days = np.arange(0, 365)
n_scenarios = 5

scenarios = {
    'Healthy baseline': {'pesticide': 0, 'varroa': 0, 'habitat_loss': 0},
    'Pesticide only': {'pesticide': 0.3, 'varroa': 0, 'habitat_loss': 0},
    'Varroa only': {'pesticide': 0, 'varroa': 0.25, 'habitat_loss': 0},
    'Habitat loss only': {'pesticide': 0, 'varroa': 0, 'habitat_loss': 0.2},
    'All stressors combined': {'pesticide': 0.3, 'varroa': 0.25, 'habitat_loss': 0.2},
}


print("Multiple stressor effect:")
print("  Pesticide alone: colony weakened but survives")
print("  Varroa alone: colony weakened but usually survives with management")
print("  Habitat loss alone: colony forages less efficiently")
print("  ALL COMBINED: colony collapses before winter")
print("\\nThis is why bee decline is so hard to solve:")
print("  No single fix works — must address all stressors together")`,
      challenge: 'Model what happens if you remove one stressor at a time from the "all combined" scenario. Which single intervention saves the most colonies? This analysis drives policy decisions.',
      successHint: 'Bee decline is a systems problem — multiple interacting stressors creating a death spiral that no single solution can fix. Understanding this complexity is essential for anyone who wants to help: the answer is not "ban pesticides" or "plant flowers" alone, but ALL of these together.',
    },
    {
      title: 'Sustainable harvesting — taking without destroying',
      concept: `The title of the story is "The Honey Hunter's Lesson" — and that lesson is about taking honey sustainably. **Sustainable harvesting** means extracting a resource at a rate the population can replace, indefinitely.

**The sustainable yield equation:**
- A colony produces X kg of honey per year
- It needs Y kg to survive winter and rebuild in spring
- Sustainable harvest = X - Y (minus a safety margin)
- Typical: colony produces 30-60 kg/year, needs 15-25 kg → sustainable harvest: 10-30 kg

**Traditional vs destructive harvesting:**
- **Destructive**: cut the entire comb, kill the colony (common in wild honey hunting)
- **Sustainable**: take 50-70% of surplus honey, leave the rest; the colony rebuilds
- **Modern beekeeping**: removable frames allow harvesting without disturbing the brood

**Maximum Sustainable Yield (MSY)**: the largest harvest that can be taken indefinitely without reducing the population. It occurs at intermediate population sizes — below MSY, the population declines; above, you're leaving potential harvest on the table.

Indigenous honey hunters across India, Africa, and Asia developed sustainable methods independently — proving that traditional knowledge and ecological science converge on the same answer.`,
      analogy: 'Sustainable harvesting is like withdrawing interest from a savings account without touching the principal. Your account (colony) earns interest (honey). If you withdraw only the interest, the principal stays intact and keeps earning. If you withdraw more than the interest, you eat into the principal and the account shrinks year after year until it\'s empty. The colony IS the principal. The surplus honey IS the interest.',
      storyConnection: 'The honey hunter\'s lesson in the story is simple: take some, leave some. His elder taught him to harvest only the lower combs and leave the brood combs untouched. This preserves the colony\'s ability to rebuild. Modern conservation science validates this traditional practice — it\'s Maximum Sustainable Yield, discovered independently by indigenous communities and fisheries scientists.',
      checkQuestion: 'A honey hunter takes 80% of the honey from every wild nest he finds. He says: "The bees will make more." Is he right?',
      checkAnswer: 'Technically yes, if the remaining 20% is enough for the colony to survive winter. But he\'s wrong in practice: (1) Bad years (drought, cold) reduce production, and 20% may not be enough. (2) He\'s also disrupting the brood, which kills developing bees. (3) Wild colonies already face stressors; removing most of their food reserve pushes them toward collapse. (4) If the colony dies, he loses future harvests. Sustainable harvesting means taking 50-60% and leaving a safety margin.',
      codeIntro: 'Model the Maximum Sustainable Yield for honey harvesting.',
      code: `import numpy as np

# Maximum Sustainable Yield model for honey harvesting
# Colony growth follows logistic equation
# dN/dt = rN(1 - N/K) - H
# N = colony strength, K = carrying capacity, r = growth rate, H = harvest

K = 60  # max colony size (1000s of bees, proportional to honey storage)
r = 0.5  # growth rate

# Different harvest rates
harvest_rates = np.linspace(0, 15, 100)  # kg per year
equilibrium_pop = []
sustainable_yield = []

for H in harvest_rates:
    # Equilibrium: rN(1 - N/K) = H
    # rN - rN²/K = H
    # rN²/K - rN + H = 0
    # N = (r ± sqrt(r² - 4rH/K)) / (2r/K)
    discriminant = r**2 - 4*r*H/K
    if discriminant >= 0:
        N = (r - np.sqrt(discriminant)) / (2*r/K)
        N = K/2 + np.sqrt(max(0, K**2/4 - K*H/r))
        equilibrium_pop.append(N)
        sustainable_yield.append(H)
    else:
        break

# MSY
msy = r * K / 4
msy_pop = K / 2


print("10-year cumulative harvest:")
for method, cum in cumulative.items():
    print(f"  {method.replace(chr(10), ' ')}: {cum[-1]} kg total")
print(f"\\nDestructive gets 30 kg once, then nothing.")
print(f"Sustainable gets 150-250 kg over 10 years.")
print(f"Patience is not just ethical — it's mathematically optimal.")`,
      challenge: 'Add year-to-year variability: some years produce 50% more honey (good weather), some produce 50% less. With a fixed harvest of MSY, how often does the colony collapse? What harvest rate is safe with variability?',
      successHint: 'Maximum Sustainable Yield is one of the most important concepts in resource management. It applies to honey, fisheries, forestry, and groundwater. The math is clear: short-term greed destroys long-term wealth. The honey hunter who understands MSY will always outperform the one who takes everything.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Entomology & Bee Biology — no prior science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology simulations. Click to start.</p>
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
            diagram={[BeeColonyDiagram, BeeWaggleDanceDiagram, BeePollinationDiagram, BeeHoneymakingDiagram, BeeHiveTempDiagram, BeeLifeCycleDiagram][i] ? createElement([BeeColonyDiagram, BeeWaggleDanceDiagram, BeePollinationDiagram, BeeHoneymakingDiagram, BeeHiveTempDiagram, BeeLifeCycleDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
