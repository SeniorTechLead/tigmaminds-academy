import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BeeAnatomyDiagram from '../diagrams/BeeAnatomyDiagram';
import BeeFlowerCoevolutionDiagram from '../diagrams/BeeFlowerCoevolutionDiagram';
import BeeNavigationDiagram from '../diagrams/BeeNavigationDiagram';
import BeeCommunicationDiagram from '../diagrams/BeeCommunicationDiagram';
import BeeEcosystemServiceDiagram from '../diagrams/BeeEcosystemServiceDiagram';
import BeeColonyCollapseDiagram from '../diagrams/BeeColonyCollapseDiagram';

export default function HoneyHunterLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Pollinator networks — who pollinates whom',
      concept: `In Level 1, we focused on honeybees. But pollination involves hundreds of species interacting in complex **mutualistic networks**. A pollinator network maps which pollinators visit which plants — and the structure of this network determines how resilient the ecosystem is.

**Network properties:**
- **Nestedness**: specialists tend to visit the same plants that generalists visit, forming a connected "core"
- **Modularity**: some groups of plants and pollinators interact more with each other than with outside species
- **Connectance**: the fraction of possible links that actually exist (typically 10-30%)
- **Asymmetry**: a plant may depend heavily on one pollinator, but that pollinator visits many plants

In Assam, a pollination network might include 50+ pollinator species (bees, butterflies, moths, flies, birds) and 100+ plant species, with thousands of links between them.`,
      analogy: 'A pollinator network is like an airline route map. Hub airports (generalist pollinators like honeybees) connect to many destinations. Small regional airports (specialist pollinators) connect to only a few. If a hub goes down, many routes are disrupted. If a small airport closes, few routes are affected. Network resilience depends on having multiple hubs and backup routes.',
      storyConnection: 'The honey hunter focused on one species: Apis dorsata (the giant honeybee). But the forest around his hive hosts dozens of other pollinators. If the honeybees disappeared, would the forest flowers still be pollinated? The network tells us: for some flowers (those visited by many pollinators), yes. For others (honeybee specialists), no. The network reveals hidden vulnerabilities.',
      checkQuestion: 'In a pollination network, honeybees visit 80% of flowering plant species. Does this mean the ecosystem would collapse without honeybees?',
      checkAnswer: 'Not necessarily. Most plants honeybees visit are ALSO visited by other pollinators. The network is nested: if you remove honeybees, many of their plant partners still have backup pollinators (butterflies, wild bees, flies). The plants most at risk are those where honeybees are the ONLY pollinator — and in most wild ecosystems, there are very few such obligate relationships. Monoculture farms are the exception.',
      codeIntro: 'Build a pollinator-plant network and analyze its structure and resilience.',
      code: `import numpy as np

np.random.seed(42)

# Generate a nested pollinator-plant interaction matrix
n_pollinators = 15
n_plants = 20

# Create nested matrix (generalists in top rows visit many plants)
interaction = np.zeros((n_pollinators, n_plants))
for i in range(n_pollinators):
    for j in range(n_plants):
        p = 0.7 * np.exp(-0.15 * i) * np.exp(-0.08 * j) + 0.05
        if np.random.random() < p:
            interaction[i, j] = 1

connectance = interaction.sum() / (n_pollinators * n_plants)
degree_poll = interaction.sum(axis=1)
degree_plant = interaction.sum(axis=0)


print(f"Network metrics:")
print(f"  Pollinators: {n_pollinators}, Plants: {n_plants}")
print(f"  Total interactions: {int(interaction.sum())}")
print(f"  Connectance: {connectance:.3f}")
print(f"  Most generalist: {int(degree_poll.max())} plant partners")`,
      challenge: 'What if you add a new "super-generalist" pollinator that visits ALL plants? How does network resilience change? Is this realistic (hint: invasive honeybees can act as super-generalists)?',
      successHint: 'Pollinator networks reveal the hidden architecture of ecosystems. The same network math is used for the internet, social networks, and power grids. Understanding network structure tells you where the system is robust and where it is fragile.',
    },
    {
      title: 'Colony collapse disorder data — a detective story',
      concept: `Starting in 2006, beekeepers reported a mysterious phenomenon: entire colonies vanishing almost overnight. Workers would fly out to forage and never return, leaving the queen and brood behind to die. This was named **Colony Collapse Disorder (CCD)**.

**The symptoms:**
- Rapid loss of adult workers (within weeks)
- Abandoned brood and food stores
- No dead bees in or around the hive (they disappeared)
- Delayed invasion by pests

**The investigation** tested multiple hypotheses simultaneously:
- Pesticides (neonicotinoids): disoriented foragers can't navigate home
- Varroa mites + viruses: weakened immune systems
- Poor nutrition: monoculture "food deserts"
- Stress from transportation: migratory beekeeping exhausts colonies
- Pathogens: Nosema ceranae (gut parasite)

**The verdict**: no single cause. CCD is a **syndrome** — multiple stressors interacting. Like human heart disease, there's no single smoking gun, but a combination of risk factors that together are lethal.`,
      analogy: 'CCD is like a plane crash investigation. When a plane goes down, investigators don\'t look for THE cause — they look for a chain of failures. Faulty sensor + tired pilot + bad weather = crash. Similarly, CCD = pesticide exposure + Varroa + poor nutrition + stress. No single factor is "the cause," but together they exceed the colony\'s ability to cope.',
      storyConnection: 'The honey hunter in the story would notice CCD as "the bees left and never came back." Traditional honey hunters know this phenomenon intuitively — they\'ve seen colonies abandon hives for generations. Modern CCD research quantifies what traditional knowledge always understood: bees need a healthy environment to thrive, and when conditions deteriorate past a threshold, the colony simply vanishes.',
      checkQuestion: 'US beekeepers lose 30-40% of colonies every winter (up from 10-15% historically). But total managed colonies haven\'t dropped dramatically. How is this possible?',
      checkAnswer: 'Beekeepers replace lost colonies by splitting surviving ones. This masks the problem: the LOSS rate is alarming, but replacement keeps numbers stable. It\'s like a hospital reporting "total patients steady" while admission rates double — the throughput is unsustainable. Replacement costs $200-300 per colony and takes 6-8 weeks. The system is running faster to stay in place.',
      codeIntro: 'Analyze colony loss data and model the interaction of multiple CCD risk factors.',
      code: `import numpy as np

np.random.seed(42)

# US Colony loss data (simulated based on real trends)
years = np.arange(2006, 2026)
loss_rates = [32, 36, 29, 34, 30, 22, 31, 34, 24, 23, 28, 40, 38, 37, 44, 43, 39, 48, 38, 35]
total_colonies = [2.4, 2.3, 2.3, 2.5, 2.7, 2.5, 2.6, 2.7, 2.7, 2.8, 2.8, 2.7, 2.8, 2.8, 2.7, 2.7, 2.9, 2.8, 2.7, 2.8]


print("CCD analysis:")
print(f"  Mean winter loss rate: {np.mean(loss_rates):.1f}% (pre-CCD: ~15%)")
print(f"  Colonies exceeding stress threshold: {ccd_cases.sum()/len(ccd_cases)*100:.0f}%")
print(f"\\nNo single factor causes CCD — it's the combination that matters.")`,
      challenge: 'If you could reduce ONE stress factor to zero, which would save the most colonies? Run the simulation with each factor zeroed and compare CCD rates.',
      successHint: 'CCD taught the scientific community that complex ecological problems rarely have simple causes. The multi-factor analysis framework developed for CCD is now applied to coral reef bleaching, amphibian declines, and other "mystery" die-offs.',
    },
    {
      title: 'Economic value of pollination — nature\'s hidden GDP',
      concept: `The honey hunter sells honey for income. But the bees' pollination service is worth far more. **Ecosystem service valuation** puts a dollar figure on nature's free work.

**Global estimates:**
- Pollination service value: **$235-577 billion USD per year**
- Global honey production value: **$8 billion USD per year**
- Ratio: pollination is **30-70x** more valuable than honey

**How it's calculated:**
1. **Production function approach**: how much crop yield depends on pollinators
2. **Replacement cost approach**: what would it cost to pollinate manually? Hand-pollination costs ~$10,000/hectare vs ~$200/hectare for bees

**For India:** Pollination-dependent crops (mustard, sunflower, fruits, vegetables, spices) have an estimated pollination value of $30-50 billion per year.`,
      analogy: 'The economic value of pollination is like the value of the internet. The internet itself is "free" (no one pays for the protocol). But the economic activity it enables — e-commerce, communication, finance — is worth trillions. Similarly, bees provide pollination "for free" (they\'re doing it for nectar, not for us), but the agricultural activity they enable is worth hundreds of billions.',
      storyConnection: 'The honey hunter values each hive at the honey it produces — perhaps $50-100 per year. But the pollination service of that same hive might be worth $1,000-5,000 per year. The honey is just the tip of the iceberg. When the story says "take some, leave some," the economic argument is clear: a living hive is worth 50x more than a dead one.',
      checkQuestion: 'China\'s Sichuan province lost most of its wild bees to pesticide overuse. Now, farmers hand-pollinate apple and pear trees with paintbrushes. What does this teach us?',
      checkAnswer: 'It tells us that replacing bees is absurdly expensive. One colony (worth $200) does the work of thousands of human workers. Hand-pollination in Sichuan costs $2,000-5,000 per hectare — 10-25x what bee pollination would cost. Worse, hand-pollination is less effective. The Sichuan case is a warning: once you lose your pollinators, there is no affordable replacement.',
      codeIntro: 'Calculate the economic value of pollination for different crops and compare with honey value.',
      code: `import numpy as np

crops = {
    'Almonds': {'area_Mha': 1.5, 'price_per_ton': 5000, 'yield_ton_ha': 2.5, 'poll_dep': 1.0},
    'Apples': {'area_Mha': 5.0, 'price_per_ton': 800, 'yield_ton_ha': 20, 'poll_dep': 0.9},
    'Coffee': {'area_Mha': 11.0, 'price_per_ton': 3000, 'yield_ton_ha': 1.5, 'poll_dep': 0.3},
    'Mangoes': {'area_Mha': 5.5, 'price_per_ton': 700, 'yield_ton_ha': 8, 'poll_dep': 0.7},
    'Mustard': {'area_Mha': 8.0, 'price_per_ton': 600, 'yield_ton_ha': 1.2, 'poll_dep': 0.6},
    'Sunflower': {'area_Mha': 25.0, 'price_per_ton': 400, 'yield_ton_ha': 1.8, 'poll_dep': 0.8},
    'Blueberries': {'area_Mha': 0.1, 'price_per_ton': 8000, 'yield_ton_ha': 5, 'poll_dep': 0.9},
}

poll_values = {}
for crop, data in crops.items():
    total_value = data['area_Mha'] * data['yield_ton_ha'] * data['price_per_ton']
    poll_values[crop] = total_value * data['poll_dep']


print(f"Global honey value: {honey_value}B/year")
print(f"Global pollination value: {poll_total:.0f}B/year")
print(f"Pollination is {poll_total/honey_value:.0f}x more valuable than honey")`,
      challenge: 'India\'s mustard crop covers 8 million hectares. If pollinator decline reduces yields by 30%, calculate the economic loss. Then calculate the cost of establishing enough bee colonies to restore pollination. Is it cost-effective?',
      successHint: 'Ecosystem service valuation speaks the language of policymakers and businesses. When you can show that protecting bees saves $200 billion more than it costs, conservation becomes an economic argument, not just an emotional one.',
    },
    {
      title: 'Modeling bee populations — predicting the future of hives',
      concept: `To protect bees, we need to predict how populations will change. **Population modeling** uses mathematics to project future colony numbers based on birth rates, death rates, and environmental factors.

**The logistic growth model with stochastic events:**
- dN/dt = rN(1 - N/K) - mortality_events
- N = number of colonies, K = carrying capacity, r = growth rate

**Key modeling challenges:**
- Seasonal variation (spring growth, winter contraction)
- Density dependence (too many colonies = competition for forage)
- Allee effects (too few colonies = not enough drones for mating)
- Environmental stochasticity (some years are good, some bad)`,
      analogy: 'Bee population modeling is like financial planning. You have income (new colonies from splitting), expenses (colony losses), savings (reserves of healthy colonies), and external shocks (disease outbreaks). A good financial model helps you plan for the worst while hoping for the best.',
      storyConnection: 'The honey hunter\'s forest supports a certain number of wild colonies — the "carrying capacity." If disease or overharvesting reduces colonies below a threshold, the population can\'t recover on its own. Population models identify that threshold.',
      checkQuestion: 'A region has 500 wild bee colonies and a carrying capacity of 1,000. Annual growth rate is 20%. If 100 colonies are lost to disease, how many years until recovery?',
      checkAnswer: 'Using logistic growth from 400: after year 1 N ≈ 448, year 2 ≈ 498, year 3 ≈ 548. Recovery to 500 takes about 2-3 years. Recovery time depends on how far below K the population falls — closer to K means slower growth.',
      codeIntro: 'Build a stochastic bee population model with seasonal variation and random disturbances.',
      code: `import numpy as np

np.random.seed(42)

K = 1000; r = 0.15; years = 50; months = years * 12

seasonal = np.zeros(months)
for m in range(months):
    month_of_year = m % 12
    if month_of_year in [2, 3, 4]: seasonal[m] = 1.5
    elif month_of_year in [5, 6, 7]: seasonal[m] = 1.0
    elif month_of_year in [8, 9, 10]: seasonal[m] = 0.5
    else: seasonal[m] = 0.2

n_runs = 50

print("Minimum viable population (95% survival over 10 years):")
for sp, sr in zip(start_pops, survival_rates):
    print(f"  {sp:4d} colonies: {sr:.0f}% survival")`,
      challenge: 'Add climate change: gradually increase catastrophic event frequency from 2% to 5% per month over 50 years. How does the minimum viable population change?',
      successHint: 'Population modeling is the bridge between ecological understanding and conservation action. It tells us not just that bee populations are declining, but how fast, how far, and what interventions will be most effective.',
    },
    {
      title: 'Precision beekeeping with sensors — the IoT hive',
      concept: `Traditional beekeeping relies on opening the hive to inspect it — stressing the bees. **Precision beekeeping** uses sensors to monitor hives without opening them.

**Sensors in a modern hive:**
- **Weight scale**: tracks nectar flow (gaining) and consumption (losing)
- **Temperature sensors**: brood area should be 35°C; deviations indicate problems
- **Humidity sensor**: high humidity + high temperature = healthy brood
- **Acoustic sensor**: sound changes before swarming and during queenlessness
- **Bee counter**: entrance sensor counts bees in/out; the difference = forager loss rate

**Event detection:**
- Sudden weight drop → colony swarmed (half the bees left)
- Gradual weight loss in summer → poor foraging
- Temperature below 32°C → brood area shrinking
- Acoustic change + temperature spike → swarming imminent (12-24h warning)`,
      analogy: 'Precision beekeeping is like a smartwatch for a hive. Just as a smartwatch monitors heart rate, sleep, and activity without invasive tests, hive sensors monitor weight, temperature, and sound without opening the hive. When something goes wrong, the data tells you what and when — before visible symptoms appear.',
      storyConnection: 'The honey hunter in the story assessed hive health by watching bee behavior — flight patterns, sound, activity level. Modern sensors quantify exactly the same indicators, but continuously and precisely. Technology digitizes traditional knowledge.',
      checkQuestion: 'A hive weight sensor shows: Monday 30 kg, Tuesday 31.5 kg, Wednesday 33 kg, Thursday 20 kg, Friday 20.5 kg. What happened on Thursday?',
      checkAnswer: 'The colony swarmed. A swarm takes about half the bees and honey stores. The 13 kg drop is roughly half the colony\'s biomass and food departing at once. Rapid weight gain (Mon-Wed) often precedes swarming. An acoustic sensor would have detected swarming sounds 1-2 days earlier.',
      codeIntro: 'Simulate a year of hive sensor data and detect key events automatically.',
      code: `import numpy as np

np.random.seed(42)

days = np.arange(365)
month = (days / 30.44).astype(int) % 12

# Weight
nectar_flow = np.zeros(365)
for d in range(365):
    m = month[d]
    if m in [2, 3, 4, 5]: nectar_flow[d] = 0.3
    elif m in [8, 9]: nectar_flow[d] = 0.15
    elif m in [10, 11, 0, 1]: nectar_flow[d] = -0.1
    else: nectar_flow[d] = 0.05

weight = np.zeros(365); weight[0] = 30
for d in range(1, 365):
    weight[d] = weight[d-1] + nectar_flow[d] + np.random.normal(0, 0.1)
swarm_day = 135
weight[swarm_day:] -= 8
robbing_start = 270
weight[robbing_start:robbing_start+5] -= np.linspace(0, 3, 5)

# Temperature
temp = np.zeros(365)
for d in range(365):
    if month[d] in [3, 4, 5, 6, 7, 8]: temp[d] = 35 + np.random.normal(0, 0.5)
    else: temp[d] = 30 + np.random.normal(0, 2)
temp[swarm_day:swarm_day+3] -= 3

# Bee counter
bees_out = np.zeros(365); bees_in = np.zeros(365)
for d in range(365):
    if month[d] in [3, 4, 5, 6, 7, 8]:
        base = 5000 + 3000 * np.sin((d - 90) / 180 * np.pi)
        bees_out[d] = base + np.random.normal(0, 300)
        bees_in[d] = bees_out[d] * (0.97 + np.random.normal(0, 0.01))
    else:
        bees_out[d] = 500 + np.random.normal(0, 100)
        bees_in[d] = bees_out[d] * 0.99
bees_in[150:156] = bees_out[150:156] * 0.85


print("Sensor events detected:")
print(f"  Swarm: day {swarm_day} (weight drop 8 kg)")
print(f"  Pesticide: days 150-155 (return rate {return_rate[152]:.0f}%)")
print(f"  Peak traffic: {bees_out.max():.0f} bees/day")`,
      challenge: 'Add an acoustic sensor that detects swarming sounds 24 hours before the swarm event. How would you code the alert logic to warn the beekeeper in time?',
      successHint: 'Precision beekeeping is where biology meets IoT. The same sensor + data science approach is applied in precision agriculture, environmental monitoring, and human health. If you can build a smart hive dashboard, you can build any monitoring system.',
    },
    {
      title: 'Urban beekeeping — bees in the city',
      concept: `Surprisingly, cities can be excellent habitats for bees. **Urban beekeeping** has exploded in the last decade.

**Why cities work for bees:**
- **Diverse forage**: urban gardens, parks, street trees provide diverse pollen and nectar across the entire growing season
- **Fewer pesticides**: urban areas generally use fewer agricultural pesticides than farmland
- **Warmer microclimate**: urban heat island extends the foraging season by 2-3 weeks
- **Year-round flowering**: ornamental plants flower across many months

**The data is clear**: urban honey often has LOWER pesticide residues than rural honey, and urban colonies often have higher survival rates. Paris rooftop hives average 50-60 kg/colony — higher than the French countryside average of 20-30 kg.`,
      analogy: 'Urban beekeeping is like urban farming. Just as a rooftop garden can produce surprisingly good vegetables because of careful attention, warm microclimate, and diverse plantings, a rooftop hive can thrive because of diverse urban flowers and low pesticide exposure.',
      storyConnection: 'The honey hunter in the story lives rurally. But urban cousins could keep bees too — on rooftops, in community gardens. The lesson of sustainable coexistence applies everywhere. Urban beekeeping connects urban people with the ecosystem services they depend on but rarely see.',
      checkQuestion: 'Paris has 2,000+ beehives, many on famous buildings. Honey yields average 50-60 kg/colony — higher than the countryside. Why?',
      checkAnswer: 'Paris has 400+ flowering plant species across parks and boulevards. This diversity means there\'s always something blooming — no "food desert" gaps between crop cycles. Also, Parisian parks use fewer pesticides than farms. City bees are better fed, less poisoned, and more productive.',
      codeIntro: 'Compare urban vs rural bee performance and model optimal urban hive density.',
      code: `import numpy as np

np.random.seed(42)

metrics = {
    'Honey yield\\n(kg/year)': {'Urban': 55, 'Rural': 25},
    'Winter\\nsurvival (%)': {'Urban': 85, 'Rural': 70},
    'Pesticide\\nresidues (ppb)': {'Urban': 3, 'Rural': 12},
    'Forage\\ndiversity\\n(species)': {'Urban': 150, 'Rural': 30},
    'Foraging\\nseason (days)': {'Urban': 240, 'Rural': 200},
}


print(f"Optimal hive density: {optimal}/km²")
print(f"At optimal: {yield_per_colony[optimal-1]:.0f} kg/colony, {total_yield[optimal-1]:.0f} kg/km² total")
print(f"\\nCities can be BETTER for bees than pesticide-heavy farmland.")`,
      challenge: 'Design a bee-friendly city: given a 5 km² area, plan hive placement, flower strips, and water sources to maximize colony health while respecting a 15-hive/km² density limit.',
      successHint: 'Urban beekeeping challenges the assumption that nature belongs only in the countryside. Cities can be havens for pollinators when designed with biodiversity in mind. Green roofs, wildflower verges, and community hives are ecological infrastructure that benefits humans and bees alike.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Agricultural Ecology — builds on Level 1 bee biology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecological modeling. Click to start.</p>
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
            diagram={[BeeAnatomyDiagram, BeeFlowerCoevolutionDiagram, BeeNavigationDiagram, BeeCommunicationDiagram, BeeEcosystemServiceDiagram, BeeColonyCollapseDiagram][i] ? createElement([BeeAnatomyDiagram, BeeFlowerCoevolutionDiagram, BeeNavigationDiagram, BeeCommunicationDiagram, BeeEcosystemServiceDiagram, BeeColonyCollapseDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
