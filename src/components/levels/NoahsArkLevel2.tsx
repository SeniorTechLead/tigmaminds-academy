import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import ArkBiodiversityDiagram from '../diagrams/ArkBiodiversityDiagram';
import ArkCapacityDiagram from '../diagrams/ArkCapacityDiagram';
import FoodWebDiagram from '../diagrams/FoodWebDiagram';
import FiveKingdomsDiagram from '../diagrams/FiveKingdomsDiagram';
import PopulationGrowthCurve from '../diagrams/PopulationGrowthCurve';
import DichotomousKeyDiagram from '../diagrams/DichotomousKeyDiagram';

export default function NoahsArkLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Counting life — how many species exist?',
      concept: `Before Noah can load the ark, he needs a census. How many species of land animals exist?

Scientists estimate **8.7 million species** on Earth, but most are marine creatures, insects, and microorganisms that would not need the ark. The land vertebrates that would — mammals, birds, reptiles, amphibians — number about **35,000 species**.

But here is the catch: we have only formally described about **1.2 million** of the 8.7 million. The rest are estimated from sampling methods — like estimating the number of fish in a lake by catching a sample and scaling up.

The code builds a species database by major group and visualises the breakdown.`,
      analogy: 'Imagine counting all the students in a school without a roster. You could count every classroom (exhaustive but slow) or count one hallway, note the average per classroom, and multiply by the number of rooms. Scientists estimate species the same way — sampling known areas and scaling up.',
      storyConnection: 'The Bible says "two of every kind." The Hebrew word "min" (kind) may correspond roughly to the taxonomic level of "family" rather than "species." There are about 1,500 families of land vertebrates — far fewer than 35,000 species. This distinction dramatically changes the capacity calculation.',
      checkQuestion: 'If scientists have only described 1.2 million of an estimated 8.7 million species, what percentage remains undiscovered?',
      checkAnswer: 'About 86%. That is 7.5 million species we know exist (from statistical models) but have never formally named or studied. Most are insects, fungi, and deep-sea organisms. We are losing species to extinction faster than we can discover them.',
      codeIntro: 'Build a species census by major animal group.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Estimated land vertebrate species
groups = {
    "Mammals":     6,495,
    "Birds":      11,000,
    "Reptiles":   11,700,
    "Amphibians":  8,400,
}

total = sum(groups.values())
pairs = total * 2  # two of each

print("=== Ark Species Census ===")
print(f"{'Group':<14} {'Species':>8} {'Pairs':>8}")
print("-" * 32)
for name, count in groups.items():
    print(f"{name:<14} {count:>8,} {count*2:>8,}")
print("-" * 32)
print(f"{'TOTAL':<14} {total:>8,} {pairs:>8,}")

# Pie chart
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
colors = ['#f59e0b', '#3b82f6', '#22c55e', '#a855f7']
ax1.pie(groups.values(), labels=groups.keys(), colors=colors,
        autopct='%1.0f%%', textprops={'color': 'white'})
ax1.set_title(f'Land Vertebrates: {total:,} species')

# Known vs unknown
known = 1_200_000
estimated = 8_700_000
ax2.barh(['Species'], [known], color='#22c55e', label=f'Described ({known:,})')
ax2.barh(['Species'], [estimated - known], left=[known],
         color='#374151', label=f'Undiscovered (~{estimated-known:,})')
ax2.legend(fontsize=9); ax2.set_title('Global Species: Known vs Unknown')
plt.tight_layout(); plt.show()`,
      challenge: 'Add insects (1,000,000 described species) and arachnids (100,000) to the chart. How does the picture change? If Noah took insects too, how many total animals would be aboard?',
      successHint: 'Species counting is the foundation of conservation biology. You cannot protect what you have not counted. The ark census problem — how many kinds of life exist — is a question scientists are still trying to answer today.',
    },
    {
      title: 'Taxonomy — organising life into a tree',
      concept: `With 35,000+ species to manage, Noah needs a system. **Taxonomy** is that system — a hierarchy invented by Carl Linnaeus in the 1730s.

The levels, from broadest to most specific: **Domain → Kingdom → Phylum → Class → Order → Family → Genus → Species**. A handy mnemonic: **D**ear **K**ing **P**hilip **C**ame **O**ver **F**or **G**ood **S**paghetti.

Every species gets a unique two-part Latin name (binomial nomenclature). Humans are *Homo sapiens*. The grey wolf is *Canis lupus*. The domestic dog is *Canis lupus familiaris* — same genus and species as the wolf, just a subspecies.

The code builds a taxonomy tree and shows how species are nested within broader groups.`,
      analogy: 'Think of a library. Books are organised: Building (Domain) → Floor (Kingdom) → Section (Phylum) → Shelf (Class) → Row (Order) → Group (Family) → Author (Genus) → Title (Species). Each level narrows the search. Taxonomy does the same for living things.',
      storyConnection: 'If "kind" in the biblical text means "family" level, then Noah needed only two members of the family Canidae (dogs, wolves, foxes — all one "kind") rather than two of each of the 37 Canidae species. This reduces the passenger list dramatically and makes the ark mathematically more feasible.',
      checkQuestion: 'Wolves, dogs, and jackals are all in the genus Canis. Lions and tigers are both in the genus Panthera. What does sharing a genus tell you?',
      checkAnswer: 'It means they share a recent common ancestor and are closely related. Members of the same genus often can (or once could) interbreed. Wolves and dogs interbreed freely. Lions and tigers can produce ligers/tigons in captivity. Genus is the second-most specific level — species within a genus are biological siblings.',
      codeIntro: 'Build a taxonomy tree for animals that might have been on the ark.',
      code: `import numpy as np

# Taxonomy database: a few ark animals
ark_animals = [
    {"common": "Grey Wolf",      "class": "Mammalia",  "order": "Carnivora",
     "family": "Canidae",        "genus": "Canis",     "species": "C. lupus"},
    {"common": "Domestic Cat",   "class": "Mammalia",  "order": "Carnivora",
     "family": "Felidae",        "genus": "Felis",     "species": "F. catus"},
    {"common": "African Lion",   "class": "Mammalia",  "order": "Carnivora",
     "family": "Felidae",        "genus": "Panthera",  "species": "P. leo"},
    {"common": "Asian Elephant", "class": "Mammalia",  "order": "Proboscidea",
     "family": "Elephantidae",   "genus": "Elephas",   "species": "E. maximus"},
    {"common": "Bald Eagle",     "class": "Aves",      "order": "Accipitriformes",
     "family": "Accipitridae",   "genus": "Haliaeetus","species": "H. leucocephalus"},
    {"common": "Green Iguana",   "class": "Reptilia",  "order": "Squamata",
     "family": "Iguanidae",      "genus": "Iguana",    "species": "I. iguana"},
    {"common": "Red-eyed Frog",  "class": "Amphibia",  "order": "Anura",
     "family": "Phyllomedusidae","genus": "Agalychnis", "species": "A. callidryas"},
]

# Print as taxonomy table
print(f"{'Common':<18} {'Class':<12} {'Order':<18} {'Family':<16} {'Species'}")
print("=" * 85)
for a in ark_animals:
    print(f"{a['common']:<18} {a['class']:<12} {a['order']:<18} {a['family']:<16} {a['species']}")

# Count unique at each level
for level in ['class', 'order', 'family', 'genus']:
    unique = len(set(a[level] for a in ark_animals))
    print(f"\\nUnique {level}s: {unique} (from {len(ark_animals)} species)")

# Species vs Family comparison
print(f"\\n--- Ark loading comparison ---")
print(f"At species level: {len(ark_animals)} species × 2 = {len(ark_animals)*2} animals")
families = len(set(a['family'] for a in ark_animals))
print(f"At family level:  {families} families × 2 = {families*2} animals")
print(f"Reduction: {(1 - families/len(ark_animals))*100:.0f}%")`,
      challenge: 'Add 5 more animals (a snake, a parrot, a mouse, a horse, a tortoise) with their real taxonomy. How many unique families do you now have? What is the species-to-family reduction ratio?',
      successHint: 'Taxonomy is not just academic naming — it is the filing system for all of biology. Understanding the hierarchy tells you which animals are related, which can interbreed, and how biodiversity is structured.',
    },
    {
      title: 'Body mass scaling — Kleiber\'s law',
      concept: `Not all animals are created equal when it comes to ark logistics. An elephant eats 150 kg of food per day. A mouse eats 3 grams. To plan the ark's supplies, we need a rule that connects **body mass** to **metabolic needs**.

That rule is **Kleiber's law**: metabolic rate scales as mass^0.75 (three-quarter power). A 5,000 kg elephant does NOT eat 250,000 times as much as a 20-gram mouse. It eats only about 6,000 times as much — because metabolism scales sub-linearly.

This means smaller animals are more "expensive" per kilogram of body weight. A mouse burns about 10 times more calories per gram than an elephant. But in absolute terms, the elephant still needs far more food.

The code calculates food requirements for different-sized animals using Kleiber's law.`,
      analogy: 'Think about fuel efficiency. A truck uses more total fuel than a bicycle, but the bicycle uses more fuel per kilogram of vehicle weight. Metabolism works the same way — big animals are more efficient per kilogram but need more total fuel.',
      storyConnection: 'Noah\'s food planning challenge: a few elephants eat as much as thousands of mice. But there are far more species of small animals. The total food supply depends on the sum of (body mass^0.75) across ALL animals aboard — a calculation that requires understanding power-law scaling.',
      checkQuestion: 'If you double an animal\'s body mass, does its daily food requirement double?',
      checkAnswer: 'No — it increases by a factor of 2^0.75 = 1.68. That is only 68% more food for twice the body mass. This is Kleiber\'s law: bigger animals are metabolically more efficient. A 100 kg animal needs only 1.68 times as much food as a 50 kg animal, not twice as much.',
      codeIntro: 'Calculate food needs across the size spectrum using Kleiber\'s law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Kleiber's law: metabolic rate = 70 * mass^0.75 (kcal/day)
def daily_food_kg(mass_kg):
    """Approximate daily food in kg (assuming 3 kcal/g food)"""
    kcal = 70 * mass_kg**0.75
    return kcal / 3000  # convert kcal to kg food

# Sample ark animals
animals = [
    ("Mouse",          0.02),
    ("Sparrow",        0.03),
    ("Rabbit",         2.0),
    ("Fox",            5.0),
    ("Sheep",         60.0),
    ("Lion",          190.0),
    ("Horse",         500.0),
    ("Giraffe",       800.0),
    ("Hippo",        1500.0),
    ("Elephant",     5000.0),
]

print(f"{'Animal':<14} {'Mass (kg)':>10} {'Food/day':>10} {'Food/year':>12}")
print("=" * 50)
total_daily = 0
for name, mass in animals:
    food = daily_food_kg(mass)
    total_daily += food * 2  # pairs
    print(f"{name:<14} {mass:>10,.1f} {food:>10.3f} kg {food*365:>10.1f} kg")

print(f"\\nTotal daily food (pairs only): {total_daily:.1f} kg")

# Plot the power law
masses = np.logspace(-2, 4, 100)  # 0.01 to 10,000 kg
foods = [daily_food_kg(m) for m in masses]

plt.figure(figsize=(10, 5))
plt.loglog(masses, foods, 'gold', linewidth=2, label='Kleiber: food ~ mass^0.75')
for name, mass in animals:
    plt.plot(mass, daily_food_kg(mass), 'o', markersize=8, color='cyan')
    plt.annotate(name, (mass, daily_food_kg(mass)), fontsize=8,
                 color='white', xytext=(5, 5), textcoords='offset points')
plt.xlabel('Body mass (kg)'); plt.ylabel('Daily food (kg)')
plt.title("Kleiber's Law: Food Scales as Mass^0.75")
plt.grid(alpha=0.3); plt.legend(); plt.show()`,
      challenge: 'Calculate the total annual food for 70,000 animals. Assume the size distribution: 45% tiny (0.05 kg avg), 35% small (3 kg), 12% medium (50 kg), 6% large (300 kg), 2% mega (3000 kg). How many tonnes of food does the ark need for one year?',
      successHint: 'Kleiber\'s law is one of the most beautiful scaling laws in biology. It connects body size to metabolism, lifespan, heart rate, and food needs — all through a single exponent of 0.75.',
    },
    {
      title: 'Keystone species — the threads that hold the web',
      concept: `Not all species are equally important to an ecosystem. Some are **keystone species** — remove them and the entire system collapses, like pulling the keystone from an arch.

The classic example: **wolves in Yellowstone**. Removed in the 1920s → elk exploded → willows overgrazed → beavers vanished → streams eroded → rivers changed shape. Wolves were reintroduced in 1995, and the cascade reversed. This is called a **trophic cascade**.

Other keystones: bees (pollinate 75% of crops), sea otters (control sea urchins that eat kelp forests), fig trees (feed 1,200+ species in tropical forests).

The code simulates a simple food web and shows what happens when you remove a keystone.`,
      analogy: 'In a football team, every player matters, but the goalkeeper is a keystone. Remove the goalkeeper and the whole team collapses defensively — goals pour in. Remove a midfielder and the team adapts. Keystone species are the goalkeepers of ecosystems.',
      storyConnection: 'If Noah had skipped wolves because they seemed dangerous, the entire post-flood grassland ecosystem would have been unbalanced. Elk would overgraze, willows would vanish, beavers would die, rivers would erode. Saving "every kind" was not sentimentality — it was ecological necessity.',
      checkQuestion: 'Bees pollinate 75% of food crops. If bees went extinct, could we replace them with technology?',
      checkAnswer: 'Partially, but at enormous cost. In parts of China where bees have been killed by pesticides, farmers pollinate apple trees BY HAND with tiny brushes. It works, but it is incredibly slow and expensive. Robotic pollinators are being developed but are decades from being practical. The economic value of bee pollination is estimated at $235-577 billion per year globally. Replacing a keystone species is theoretically possible but practically devastating.',
      codeIntro: 'Simulate a food web and observe what happens when a keystone is removed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple ecosystem: population model
# Each species has a growth rate affected by its predators and prey
species = ["Grass", "Insects", "Rabbits", "Songbirds", "Fox", "Hawk", "Wolf"]
# Initial populations (thousands)
pop = np.array([500, 200, 80, 60, 15, 10, 5], dtype=float)

# Who eats whom (prey_idx -> predator_idx, strength)
links = [
    (0, 1, 0.3), (0, 2, 0.2),     # grass feeds insects, rabbits
    (1, 3, 0.25),                    # insects feed songbirds
    (2, 4, 0.15), (2, 5, 0.1),     # rabbits feed fox, hawk
    (2, 6, 0.2),                     # rabbits feed wolf
    (4, 6, 0.05),                    # fox also prey for wolf
]

def simulate(pop0, remove_idx=None, steps=50):
    p = pop0.copy()
    if remove_idx is not None:
        p[remove_idx] = 0
    history = [p.copy()]
    for _ in range(steps):
        growth = np.array([0.05, 0.03, 0.04, 0.02, 0.01, 0.01, 0.005])
        new_p = p * (1 + growth)
        for prey, pred, strength in links:
            if p[pred] > 0 and p[prey] > 0:
                eaten = strength * p[pred] * (p[prey] / (p[prey] + 50))
                new_p[prey] -= eaten
                new_p[pred] += eaten * 0.1
        new_p = np.clip(new_p, 0, 2000)
        p = new_p
        history.append(p.copy())
    return np.array(history)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Normal ecosystem
h1 = simulate(pop)
for i, name in enumerate(species):
    ax1.plot(h1[:, i], label=name, linewidth=1.5)
ax1.set_title('Healthy Ecosystem'); ax1.set_xlabel('Time')
ax1.set_ylabel('Population (thousands)'); ax1.legend(fontsize=8)

# Remove wolves (index 6)
h2 = simulate(pop, remove_idx=6)
for i, name in enumerate(species):
    ax2.plot(h2[:, i], label=name, linewidth=1.5,
             linestyle='--' if i != 6 else ':')
ax2.set_title('Wolves Removed — Trophic Cascade')
ax2.set_xlabel('Time'); ax2.legend(fontsize=8)

plt.suptitle('Keystone Species: Remove One, Disrupt All', fontsize=13)
plt.tight_layout(); plt.show()
print("Notice: without wolves, rabbits explode, grass crashes, "
      "and the whole web destabilises.")`,
      challenge: 'Try removing insects (index 1) instead of wolves. What happens to songbirds? Then try removing grass (index 0) — the base of the food web. Which removal causes the most damage?',
      successHint: 'Keystone species reveal that ecosystems are networks, not lists. The value of a species is not its size or beauty but its connections. Conservation biology is increasingly about identifying and protecting keystones.',
    },
    {
      title: 'Species-area relationship — how much space does biodiversity need?',
      concept: `There is a mathematical law that connects the **area** of a habitat to the **number of species** it can support:

**S = c * A^z**

Where S is species count, A is area, c is a constant, and z is typically about **0.25**. This means that to double the number of species, you need to increase the area by about 16 times (2^(1/0.25) = 16).

This is the **species-area relationship**, one of ecology's most robust laws. It was discovered by studying islands: big islands have more species than small islands, but the relationship is not linear — it follows a power law.

For the ark: its floor area of ~9,100 m² is tiny compared to natural habitats. The species-area curve tells us how much nature is being compressed into how little space.`,
      analogy: 'Think about a school. A small school (100 students) might have 3 sports teams. A school 10 times bigger (1,000 students) does not have 30 teams — maybe 12. The variety increases, but not proportionally to size. Species diversity works the same way with habitat area.',
      storyConnection: 'The ark compressed thousands of species into 9,100 square metres — an area smaller than two football fields. In nature, supporting 35,000 species would require millions of square kilometres. The ark was not a habitat — it was emergency storage. The animals needed to survive, not thrive. This distinction matters: short-term survival needs are very different from long-term ecological needs.',
      checkQuestion: 'If you cut a forest in half, do you lose half the species?',
      checkAnswer: 'No — you lose about 16% (1 - 0.5^0.25 = 0.16). The species-area relationship is sub-linear. But lose 90% of the forest and you lose about 44% of species. And the species lost first are often the rarest and most specialised — the ones ecosystems can least afford to lose.',
      codeIntro: 'Plot the species-area curve and see where the ark falls.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Species-area relationship: S = c * A^z
c = 20   # constant (varies by region)
z = 0.25  # typical exponent

areas = np.logspace(0, 10, 200)  # 1 m² to 10 billion m²
species = c * areas**z

plt.figure(figsize=(10, 6))
plt.loglog(areas, species, 'lime', linewidth=2.5,
           label=f'S = {c} × A^{z}')

# Mark key areas
markers = {
    "Ark (9,100 m²)": 9100,
    "Football field": 7140,
    "City park (1 km²)": 1e6,
    "National park (1000 km²)": 1e9,
    "Amazon basin": 5.5e12,
}
for name, area in markers.items():
    s = c * area**z
    plt.plot(area, s, 'o', markersize=10)
    plt.annotate(f'{name}\\n~{s:.0f} species', xy=(area, s),
                 fontsize=8, color='white', xytext=(10, 10),
                 textcoords='offset points')

plt.xlabel('Area (m²)', fontsize=12)
plt.ylabel('Species supported', fontsize=12)
plt.title("Species-Area Relationship: S = c × A^0.25", fontsize=14)
plt.grid(alpha=0.3); plt.legend(fontsize=10)
plt.show()

ark_species = c * 9100**z
print(f"Ark area: 9,100 m²")
print(f"Natural species capacity: ~{ark_species:.0f}")
print(f"Actual species loaded: ~35,000")
print(f"Compression ratio: {35000/ark_species:.0f}x beyond natural capacity")
print(f"\\nThis is why the ark was emergency storage, not a habitat.")`,
      challenge: 'If the ark were 10 times bigger (91,000 m²), how many more species could it naturally support? What area would be needed to naturally support 35,000 species? Solve: A = (35000/c)^(1/z).',
      successHint: 'The species-area relationship is ecology\'s power law. It governs island biogeography, habitat fragmentation, and conservation planning. The ark broke this law by sheer density — possible for short-term survival, impossible long-term.',
    },
    {
      title: 'The ark passenger manifest — a biodiversity database',
      concept: `Let's build the complete database: a passenger manifest for Noah's ark that combines everything — taxonomy, body mass, food requirements, pen size, and deck assignment.

This is a **data analysis** problem. We have 7 taxonomic classes of land vertebrates, each with different size distributions, metabolic rates, and space needs. The code builds a summary manifest and calculates the total logistical requirements.

This final simulation answers the question: is the ark physically feasible as an engineering project?`,
      analogy: 'This is like planning a massive conference. You need to know: how many attendees (species count), their dietary needs (food types), room sizes (pen areas), floor assignments (deck allocation), and total cost (weight budget). Miss any category and the conference fails.',
      storyConnection: 'Noah had no spreadsheet, no calculator, no database. He had divine instruction and practical wisdom. But the logistics he managed — housing, feeding, and cleaning up after thousands of animals for over a year — is one of the most ambitious project management challenges in any ancient text. Modern analysis lets us quantify exactly how ambitious it was.',
      checkQuestion: 'If 80% of species weigh less than 10 kg, but the remaining 20% account for 95% of total food consumption, where should supply planning focus?',
      checkAnswer: 'On the large animals. Even though they are few in number, their metabolic needs dominate. A single elephant pair eats as much as 6,000 mice pairs. Supply planning should prioritise by total consumption, not by species count. This is a Pareto principle in action — 20% of species drive 80%+ of resource needs.',
      codeIntro: 'Build the complete ark passenger manifest and logistics summary.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Size categories with species counts and average masses
categories = [
    {"name": "Tiny",   "species": 15750, "avg_mass": 0.05, "pen_m2": 0.04},
    {"name": "Small",  "species": 12250, "avg_mass": 3.0,  "pen_m2": 0.15},
    {"name": "Medium", "species":  4200, "avg_mass": 50.0, "pen_m2": 1.0},
    {"name": "Large",  "species":  2100, "avg_mass": 300,  "pen_m2": 4.0},
    {"name": "Mega",   "species":   700, "avg_mass": 3000, "pen_m2": 15.0},
]

def food_kg_day(mass):
    return 70 * mass**0.75 / 3000

print("=" * 72)
print(f"{'NOAH\\'S ARK — PASSENGER MANIFEST':^72}")
print("=" * 72)
print(f"{'Category':<10} {'Species':>8} {'Animals':>8} {'Mass(t)':>10} "
      f"{'Food/day':>10} {'Area(m²)':>10}")
print("-" * 72)

total_animals = total_mass = total_food = total_area = 0
for cat in categories:
    animals = cat["species"] * 2
    mass_t = animals * cat["avg_mass"] / 1000
    food = animals * food_kg_day(cat["avg_mass"])
    area = animals * cat["pen_m2"]
    total_animals += animals
    total_mass += mass_t
    total_food += food
    total_area += area
    print(f"{cat['name']:<10} {cat['species']:>8,} {animals:>8,} "
          f"{mass_t:>10,.1f} {food:>10,.0f} kg {area:>10,.0f}")

print("-" * 72)
print(f"{'TOTAL':<10} {sum(c['species'] for c in categories):>8,} "
      f"{total_animals:>8,} {total_mass:>10,.1f} {total_food:>10,.0f} kg "
      f"{total_area:>10,.0f}")

# Annual totals
food_year_t = total_food * 365 / 1000
water_year_t = total_animals * 0.5 * 365 / 1000  # 0.5 L/animal/day avg

print(f"\\n--- ANNUAL SUPPLY REQUIREMENTS ---")
print(f"Food: {food_year_t:,.0f} tonnes/year")
print(f"Water: {water_year_t:,.0f} tonnes/year")
print(f"Total supplies: {food_year_t + water_year_t:,.0f} tonnes")

# Feasibility check
ark_area = 9112 * 0.65  # usable
ark_cargo = 25375 - 5000  # max displacement minus hull
print(f"\\n--- FEASIBILITY ---")
print(f"Pen area needed: {total_area:,.0f} m² | Available: {ark_area:,.0f} m²")
print(f"Cargo needed: {total_mass + food_year_t + water_year_t:,.0f}t "
      f"| Capacity: {ark_cargo:,.0f}t")

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
names = [c["name"] for c in categories]
ax = axes[0]
ax.bar(names, [c["species"]*2 for c in categories], color='#3b82f6')
ax.set_title('Animals by Size Category'); ax.set_ylabel('Count')
ax = axes[1]
foods = [c["species"]*2*food_kg_day(c["avg_mass"])*365/1000 for c in categories]
ax.bar(names, foods, color='#f59e0b')
ax.set_title('Annual Food by Category (tonnes)'); ax.set_ylabel('Tonnes')
plt.tight_layout(); plt.show()`,
      challenge: 'Run the analysis at "family" level instead of "species" level (about 1,500 families). Scale all species counts by 1500/35000. Does the ark become feasible at the family level? What is the surplus capacity?',
      successHint: 'You built a complete biodiversity logistics model. This is real data science: gathering data, applying scaling laws, computing totals, and checking feasibility against constraints. The ark is a fascinating case study precisely because the numbers are so challenging.',
    },
  ];

  const diagrams = [ArkBiodiversityDiagram, FiveKingdomsDiagram, PopulationGrowthCurve, FoodWebDiagram, DichotomousKeyDiagram, ArkCapacityDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Biodiversity, classification, and species counting</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biodiversity analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
