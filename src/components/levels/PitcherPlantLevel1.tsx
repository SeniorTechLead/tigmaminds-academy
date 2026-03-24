import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PitcherPlantLevel1() {
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
      title: 'Why some plants eat insects — when soil has no food',
      concept: `In the misty hills of Meghalaya, where rain falls more than almost anywhere else on Earth, pitcher plants cling to rocky, acidic slopes. The soil is waterlogged and leached of nutrients — especially **nitrogen** and **phosphorus**, the two elements plants need most after carbon, hydrogen, and oxygen.

Most plants get nitrogen from soil through their roots. But in nutrient-poor bogs and rocky outcrops, there's almost none. So some plants evolved a radical solution: **catch animals and digest them**.

Carnivorous plants don't eat insects for energy (they still photosynthesize). They eat insects for **minerals** — primarily nitrogen and phosphorus. It's supplementary feeding, not a replacement for photosynthesis.

There are about 800 known carnivorous plant species worldwide. They've evolved independently at least 6 times — convergent evolution driven by the same environmental pressure: nutrient poverty.`,
      analogy: 'Imagine you live in a house with a beautiful solar roof (photosynthesis) but no grocery store nearby (nutrient-poor soil). You have plenty of electricity but no food. So you set up a bird feeder trap — not for the energy, but for the protein and minerals you can\'t get any other way.',
      storyConnection: 'The story tells of a pitcher plant that "learned to catch" because the rain washed all the goodness from the soil. This is exactly right — Meghalaya receives over 11,000mm of rain per year, which leaches nutrients from the thin soil, creating the perfect evolutionary pressure for carnivory.',
      checkQuestion: 'If carnivorous plants still need sunlight for energy, why don\'t they grow in dark forests?',
      checkAnswer: 'Carnivory is expensive — building traps, producing digestive enzymes, and maintaining slippery surfaces costs energy. Carnivorous plants need plenty of light to photosynthesize enough sugar to afford these costs. They thrive in open, sunny, nutrient-poor habitats: bogs, rocky outcrops, and mountain meadows. Shade + poor soil = not enough energy to be carnivorous.',
      codeIntro: 'Compare nutrient availability in normal soil vs. the nutrient-poor habitats where carnivorous plants thrive.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Nutrient levels in different soil types (mg/kg)
soil_types = ['Garden soil', 'Forest soil', 'Bog soil\\n(pitcher plant)', 'Rocky outcrop\\n(Meghalaya)', 'Sand dune']
nitrogen = [200, 150, 15, 10, 5]
phosphorus = [50, 35, 3, 2, 1]
potassium = [180, 120, 40, 25, 10]

x = np.arange(len(soil_types))
width = 0.25

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8))
fig.patch.set_facecolor('#1f2937')

# Nutrient comparison
ax1.set_facecolor('#111827')
ax1.bar(x - width, nitrogen, width, color='#22c55e', label='Nitrogen (N)')
ax1.bar(x, phosphorus, width, color='#3b82f6', label='Phosphorus (P)')
ax1.bar(x + width, potassium, width, color='#f59e0b', label='Potassium (K)')
ax1.set_xticks(x)
ax1.set_xticklabels(soil_types, color='white', fontsize=9)
ax1.set_ylabel('Nutrient level (mg/kg)', color='white')
ax1.set_title('Soil Nutrients: Why Carnivorous Plants Need Insects', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Highlight pitcher plant habitat
ax1.axvspan(1.5, 3.5, alpha=0.1, color='#ef4444')
ax1.text(2.5, max(nitrogen) * 0.85, 'Carnivorous plant\\nhabitats', ha='center',
         color='#ef4444', fontsize=9, fontweight='bold')

# Nutrient budget: soil vs insects
ax2.set_facecolor('#111827')
sources = ['Soil N\\n(bog)', 'Insect N\\n(per prey)', 'Soil P\\n(bog)', 'Insect P\\n(per prey)']
soil_vals = [15, 0, 3, 0]
insect_vals = [0, 8, 0, 1.5]
colors_bar = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b']

bars = ax2.bar(range(len(sources)), [s + i for s, i in zip(soil_vals, insect_vals)],
               color=colors_bar, alpha=0.85)
ax2.set_xticks(range(len(sources)))
ax2.set_xticklabels(sources, color='white', fontsize=9)
ax2.set_ylabel('Amount (mg/kg or mg/prey)', color='white')
ax2.set_title('Insect Prey: A Significant Nutrient Supplement', color='white', fontsize=11)
ax2.tick_params(colors='gray')

for bar, val in zip(bars, [s + i for s, i in zip(soil_vals, insect_vals)]):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
             f'{val:.1f}', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("A single ant contains about 8mg of nitrogen.")
print("A pitcher plant in Meghalaya might catch 50-100 insects per month.")
print(f"That's {50*8}-{100*8}mg of nitrogen from prey alone.")
print(f"Compare to {15}mg/kg available in bog soil.")
print()
print("Insect prey can provide 50-80% of a carnivorous plant's nitrogen.")
print("Without prey, the plants survive but grow much slower.")`,
      challenge: 'Calculate: if a pitcher plant catches 75 insects per month, each providing 8mg of nitrogen, how does its annual nitrogen intake compare to what a non-carnivorous plant gets from garden soil through its roots?',
      successHint: 'Carnivory in plants is an economic strategy: spend energy on traps to gain nutrients you can\'t get from soil. It only works when the soil is poor enough that the cost of traps is worth the nutritional return.',
    },
    {
      title: 'Pitcher plant anatomy — a perfect trap',
      concept: `The pitcher plant (*Nepenthes* in Meghalaya) is an engineering marvel. Its "pitcher" is actually a modified leaf, and every part of it serves a function:

**From top to bottom:**
1. **Lid (operculum)**: prevents rain from diluting the digestive fluid. In some species, it also has nectar glands to attract insects from above.
2. **Peristome (rim)**: the slippery, ribbed lip. When wet, it's one of the most slippery natural surfaces known. Insects step on it and slide in.
3. **Waxy zone**: the upper inner wall, coated with loose wax crystals. Insect feet can't grip these crystals — they crumble like stepping on marbles.
4. **Glandular zone**: the lower inner wall, covered with thousands of digestive glands. These secrete enzymes and absorb nutrients.
5. **Digestive pool**: acidic fluid (pH 2-3, like stomach acid) containing enzymes that break down the insect.

The whole structure is a **pitfall trap** — passive capture using gravity and slippery surfaces. No moving parts, no muscle, no energy spent on capture.`,
      analogy: 'A pitcher plant is like a hotel that advertises free food (nectar on the rim). Guests check in (step on the peristome), slip on the wet lobby floor (waxy zone), fall into the basement pool (digestive fluid), and never check out. The hotel runs on solar power (photosynthesis) and feeds on the guests.',
      storyConnection: 'The story describes the pitcher plant "learning" to catch — first a clumsy cup, then a refined trap. Evolution works the same way: early pitchers were simple rolled leaves. Over millions of years, each part — the lid, the rim, the wax, the glands — was refined by natural selection into the precision trap we see today.',
      checkQuestion: 'Why is the peristome slippery only when wet? What advantage does intermittent slipperiness give?',
      checkAnswer: 'If the rim were always slippery, scout ants would never return to the colony to recruit others. When the rim is dry, scouts walk safely, find nectar, and recruit nestmates. When humidity rises (morning dew, rain), the rim becomes slippery and the entire recruited group falls in. Intermittent trapping catches groups, not individuals — far more efficient.',
      codeIntro: 'Visualize the pitcher plant anatomy as an engineering diagram with functional zones.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 7))
fig.patch.set_facecolor('#1f2937')

# Left: pitcher cross-section diagram
ax1.set_facecolor('#111827')
ax1.set_xlim(-3, 3)
ax1.set_ylim(-1, 12)
ax1.set_aspect('equal')

# Draw pitcher shape (simplified as zones)
zones = [
    (10, 12, '#22c55e', 'Lid (operculum)', 'Keeps rain out,\\nattracts from above'),
    (9, 10, '#ef4444', 'Peristome (rim)', 'Slippery when wet,\\ninsects slide in'),
    (6, 9, '#f59e0b', 'Waxy zone', 'Loose wax crystals,\\nno grip for insect feet'),
    (2, 6, '#a855f7', 'Glandular zone', 'Digestive glands,\\nenzyme secretion'),
    (0, 2, '#3b82f6', 'Digestive pool', 'pH 2-3, protease,\\nlipase, esterase'),
]

for y_low, y_high, color, name, func in zones:
    # Pitcher walls (tapered)
    width_low = 1.5 + (y_low / 12) * 0.5
    width_high = 1.5 + (y_high / 12) * 0.5
    rect = plt.Rectangle((-width_low, y_low), width_low * 2, y_high - y_low,
                          facecolor=color, alpha=0.3, edgecolor=color, linewidth=1.5)
    ax1.add_patch(rect)
    ax1.text(2.2, (y_low + y_high) / 2, f'{name}\\n{func}',
             fontsize=7, color=color, va='center')

ax1.set_title('Pitcher Plant Anatomy', color='white', fontsize=13)
ax1.set_xticks([])
ax1.set_yticks([])

# Right: capture efficiency by zone
ax2.set_facecolor('#111827')
zone_names = ['Attraction\\n(nectar)', 'Landing\\n(peristome)', 'Slipping\\n(wax zone)', 'Retention\\n(fluid)', 'Digestion\\n(enzymes)']
# Percentage of insects that pass through each stage
# Funnel model: many attracted, fewer captured
insects_at_stage = [100, 60, 45, 40, 38]

ax2.barh(range(len(zone_names)), insects_at_stage, color=['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#a855f7'],
         alpha=0.85)
ax2.set_yticks(range(len(zone_names)))
ax2.set_yticklabels(zone_names, color='white', fontsize=9)
ax2.set_xlabel('Insects remaining (out of 100 attracted)', color='white')
ax2.set_title('Capture Funnel: From Attraction to Digestion', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.invert_yaxis()

for i, count in enumerate(insects_at_stage):
    ax2.text(count + 1, i, f'{count}', va='center', color='white', fontsize=10)

# Loss annotations
losses = [('40 escape\\nbefore landing', 70), ('15 grip and\\nclimb out', 52),
          ('5 fly out', 42), ('2 not fully\\ndigested', 39)]
for (label, x_pos), i in zip(losses, range(len(losses))):
    ax2.annotate(label, xy=(insects_at_stage[i+1], i+0.5),
                 xytext=(x_pos + 15, i + 0.5), color='gray', fontsize=7,
                 arrowprops=dict(arrowstyle='->', color='gray', lw=0.5))

plt.tight_layout()
plt.show()

print("Pitcher plant capture efficiency:")
print(f"  Attracted: 100 insects visit")
print(f"  Captured: ~38-40 (38-40% capture rate)")
print(f"  Main loss: escape before landing (40%)")
print()
print("The peristome is the critical component.")
print("When wet: 80%+ of landing insects fall in.")
print("When dry: only 20% fall in (but scouts recruit more).")`,
      challenge: 'What if you could redesign the pitcher to increase capture from 38% to 60%? Which zone would you improve? Model the effect of making the waxy zone 2x more slippery (reduce loss from 15 to 5).',
      successHint: 'Every part of the pitcher plant has been optimized by natural selection over millions of years. Understanding this anatomy is understanding biological engineering at its finest.',
    },
    {
      title: 'Digestive enzymes — breaking down prey with chemistry',
      concept: `Once an insect falls into the pitcher's pool, it drowns in a cocktail of **digestive enzymes** — proteins that break down the insect's body into absorbable nutrients.

Key enzymes in pitcher fluid:
- **Proteases** (like nepenthesin): break proteins into amino acids. Proteins are chains of amino acids linked by peptide bonds; proteases cut these bonds.
- **Esterases**: break down fats (lipids) into fatty acids and glycerol
- **Phosphatases**: release phosphorus from organic molecules
- **Chitinases**: break down chitin — the tough material in insect exoskeletons

The fluid is **acidic** (pH 2-3), similar to human stomach acid. This low pH:
- Activates the enzymes (they work best at low pH)
- Kills bacteria that would otherwise decompose the prey (reducing competition)
- Denatures (unfolds) prey proteins, making them easier to digest

Digestion takes 5-8 days for a typical ant. Larger prey (a cockroach) can take 2-3 weeks. Only the chitin exoskeleton remains — the indigestible "bones."`,
      analogy: 'Pitcher plant digestion is like a slow cooker. The enzymes are the recipe, the acid is the heat, and time does the rest. Just as a slow cooker breaks down tough meat into tender shreds over hours, the pitcher breaks down an insect over days. The exoskeleton is like bone — too tough for the cooker.',
      storyConnection: 'The story speaks of the pitcher plant\'s "stomach" that dissolved everything but the shell. This is remarkably accurate — the chitinous exoskeleton resists digestion, and accumulates in old pitchers like tiny insect fossils. Scientists study these remains to learn what the plant ate.',
      checkQuestion: 'Human stomach acid has a pH of about 1.5-3.5. Pitcher plant fluid is pH 2-3. Are we really that similar to a carnivorous plant?',
      checkAnswer: 'The chemistry is strikingly similar. Both use acid + proteases to break down protein. Human stomachs use pepsin (activated at low pH); pitcher plants use nepenthesin (also activated at low pH). This is convergent evolution at the molecular level — the same chemical solution to the same problem (digesting protein) evolved independently.',
      codeIntro: 'Model enzyme activity as a function of pH and temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Enzyme activity curves
# Nepenthesin (pitcher plant protease): optimal pH ~2.5
# Pepsin (human stomach): optimal pH ~2.0
# Trypsin (human intestine): optimal pH ~8.0

ph = np.linspace(0, 14, 500)

def enzyme_activity(ph_range, optimal_ph, width):
    return np.exp(-0.5 * ((ph_range - optimal_ph) / width) ** 2)

nepenthesin = enzyme_activity(ph, 2.5, 0.8)
pepsin = enzyme_activity(ph, 2.0, 0.7)
trypsin = enzyme_activity(ph, 8.0, 1.0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# pH vs activity
ax1.set_facecolor('#111827')
ax1.plot(ph, nepenthesin, color='#22c55e', linewidth=2, label='Nepenthesin (pitcher plant)')
ax1.plot(ph, pepsin, color='#ef4444', linewidth=2, label='Pepsin (human stomach)')
ax1.plot(ph, trypsin, color='#3b82f6', linewidth=2, label='Trypsin (human intestine)')

ax1.axvspan(2, 3, alpha=0.1, color='#22c55e')
ax1.text(2.5, 1.05, 'Pitcher\\nfluid', ha='center', color='#22c55e', fontsize=8)

ax1.set_xlabel('pH', color='white')
ax1.set_ylabel('Relative activity', color='white')
ax1.set_title('Enzyme Activity vs pH', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Digestion timeline
ax2.set_facecolor('#111827')
days = np.arange(0, 15, 0.1)

# Different components digested at different rates
protein_remaining = 100 * np.exp(-0.5 * days)
lipid_remaining = 100 * np.exp(-0.3 * days)
chitin_remaining = 100 * np.exp(-0.02 * days)  # barely digested

ax2.plot(days, protein_remaining, color='#ef4444', linewidth=2, label='Protein')
ax2.plot(days, lipid_remaining, color='#f59e0b', linewidth=2, label='Lipids (fat)')
ax2.plot(days, chitin_remaining, color='#6b7280', linewidth=2, label='Chitin (exoskeleton)')

ax2.axhline(10, color='gray', linestyle=':', linewidth=0.5)
ax2.text(12, 13, '90% digested', color='gray', fontsize=8)

ax2.set_xlabel('Days after capture', color='white')
ax2.set_ylabel('Material remaining (%)', color='white')
ax2.set_title('Digestion Timeline: What Gets Broken Down?', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Digestion rates:")
print(f"  Protein: 90% digested in ~{np.log(10)/0.5:.1f} days")
print(f"  Lipids:  90% digested in ~{np.log(10)/0.3:.1f} days")
print(f"  Chitin:  90% digested in ~{np.log(10)/0.02:.0f} days (effectively never)")
print()
print("The exoskeleton remains are like fossils — they tell us")
print("exactly what the plant ate, sometimes months later.")`,
      challenge: 'If rain dilutes the pitcher fluid from pH 2.5 to pH 5, how much does nepenthesin activity drop? Calculate the percentage reduction and explain why the lid exists.',
      successHint: 'Enzyme biochemistry is the foundation of digestion, medicine, and biotechnology. The same principles governing pitcher plant enzymes apply to every enzyme in your body.',
    },
    {
      title: 'Nutrient-poor soils — why Meghalaya\'s hills create carnivores',
      concept: `Meghalaya means "abode of clouds." Cherrapunji and Mawsynram receive 11,000-12,000mm of rain per year — the highest in the world. This extreme rainfall creates a paradox: lush green hills with almost no soil nutrients.

**Why rain causes nutrient poverty:**
1. **Leaching**: water percolates through soil, dissolving and washing away soluble nutrients (nitrogen, phosphorus, calcium, magnesium)
2. **Acidification**: CO₂ dissolved in rain forms carbonic acid; organic matter decomposition produces more acids. Meghalaya's soils are pH 4-5.
3. **Thin soil**: steep slopes + heavy rain = rapid erosion. Soil barely accumulates.
4. **Waterlogging**: saturated soils lack oxygen → anaerobic conditions → denitrification (bacteria convert nitrate to N₂ gas, releasing it to the atmosphere)

These four processes combine to create some of the most nutrient-poor soils in the world — despite the abundant water and sunlight. It's this specific combination that makes carnivory a viable evolutionary strategy.`,
      analogy: 'Heavy rain on soil is like running a tap over a sponge full of sugar. The water dissolves the sugar and carries it away. The more water you pour, the less sugar remains. Meghalaya\'s soils are the most "washed" sponges on Earth.',
      storyConnection: 'The story says "the rain took everything from the soil, so the plant had to take from the sky." This is poetically accurate — leaching removes nutrients downward, and the pitcher plant captures nutrients from flying insects above. It literally feeds from the sky.',
      checkQuestion: 'If heavy rain removes nutrients, why are tropical rainforests (which also get heavy rain) so lush and productive?',
      checkAnswer: 'Rainforest nutrients are stored in the living biomass, not the soil. Dead leaves decompose on the surface and nutrients are immediately reabsorbed by the dense root mat. It\'s a closed loop — nutrients cycle between organisms without passing through the soil. Cut down the forest, and the nutrients wash away in a few years. This is why slash-and-burn farming fails long-term in the tropics.',
      codeIntro: 'Simulate nutrient leaching under different rainfall levels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Nutrient leaching model
# N(t) = N0 * exp(-k * rainfall * t)
# Higher rainfall = faster nutrient loss

years = np.arange(0, 50, 0.1)
n0 = 100  # initial nutrient level (%)

rainfall_scenarios = {
    'Temperate (800mm/yr)': 800,
    'Tropical wet (2000mm/yr)': 2000,
    'Meghalaya (11000mm/yr)': 11000,
}

k = 0.00003  # leaching rate constant (per mm per year)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Leaching over time
ax1.set_facecolor('#111827')
colors = ['#22c55e', '#f59e0b', '#ef4444']
for (name, rain), color in zip(rainfall_scenarios.items(), colors):
    nutrients = n0 * np.exp(-k * rain * years)
    ax1.plot(years, nutrients, linewidth=2, label=name, color=color)

# Carnivory threshold
ax1.axhline(15, color='#a855f7', linestyle='--', linewidth=1)
ax1.text(35, 17, 'Carnivory becomes\\nviable below this', color='#a855f7', fontsize=8)

ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Soil nutrient level (% of original)', color='white')
ax1.set_title('Nutrient Leaching Under Different Rainfall', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Nutrient budget comparison
ax2.set_facecolor('#111827')
habitats = ['Garden\\n(800mm rain)', 'Rainforest\\n(2000mm)', 'Meghalaya\\nbog (11000mm)']
soil_n = [95, 40, 8]
insect_n = [0, 0, 45]
recycled_n = [5, 55, 2]

x = np.arange(len(habitats))
ax2.bar(x, soil_n, 0.5, color='#22c55e', label='From soil')
ax2.bar(x, insect_n, 0.5, bottom=soil_n, color='#ef4444', label='From insects')
ax2.bar(x, recycled_n, 0.5, bottom=[s+i for s, i in zip(soil_n, insect_n)],
        color='#3b82f6', label='Recycled from dead matter')

ax2.set_xticks(x)
ax2.set_xticklabels(habitats, color='white', fontsize=9)
ax2.set_ylabel('Nitrogen source (%)', color='white')
ax2.set_title('Where Plants Get Their Nitrogen', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Time to reach 'carnivory threshold' (15% nutrients remaining):")
for name, rain in rainfall_scenarios.items():
    t = -np.log(0.15) / (k * rain)
    print(f"  {name}: {t:.1f} years")
print()
print("Meghalaya's extreme rainfall creates nutrient-poor soil 10x faster")
print("than temperate regions — explaining why carnivorous plants thrive there.")`,
      challenge: 'Add a "nutrient input" term to the model: some nutrients return through decomposition (say 5 units/year). With input and leaching, does the soil reach a steady state? At what level?',
      successHint: 'Soil chemistry determines what grows where. Understanding leaching, pH, and nutrient cycling is fundamental to agriculture, ecology, and conservation — and explains why Meghalaya is a carnivorous plant paradise.',
    },
    {
      title: 'Other carnivorous plants — sundew, Venus flytrap, and more',
      concept: `Pitcher plants use pitfall traps, but carnivorous plants have evolved at least **five distinct trap types**:

1. **Pitfall traps** (pitcher plants — *Nepenthes*, *Sarracenia*): passive; prey falls into a pool of enzymes
2. **Flypaper traps** (sundews — *Drosera*): sticky tentacles covered in glue-like mucilage. An insect sticks, and the tentacles slowly curl inward
3. **Snap traps** (Venus flytrap — *Dionaea*): two lobes snap shut in 100 milliseconds when trigger hairs are touched twice. One of the fastest movements in the plant kingdom
4. **Suction traps** (bladderworts — *Utricularia*): underwater vacuum bladders that suck in prey in less than 1 millisecond. The fastest plant movement known
5. **Lobster-pot traps** (corkscrew plants — *Genlisea*): underground spiral tubes with inward-pointing hairs that guide prey toward digestive chambers

Each trap evolved independently — convergent evolution solving the same problem (catching prey in nutrient-poor habitats) with radically different engineering.`,
      analogy: 'The five trap types are like five different ways to catch a mouse: a pit (pitfall), glue board (flypaper), snap trap (Venus flytrap), vacuum cleaner (bladderwort), and a one-way maze (lobster pot). All solve the same problem; each uses a different mechanism.',
      storyConnection: 'Our story focused on the pitcher plant of Meghalaya, but Meghalaya is also home to sundews (*Drosera peltata*) on wet rocks and bladderworts (*Utricularia* species) in streams. The same nutrient-poor environment produced multiple carnivorous strategies — evolution\'s creativity on display.',
      checkQuestion: 'The Venus flytrap can count to two — it only snaps shut when two trigger hairs are touched within 20 seconds. Why not snap on the first touch?',
      checkAnswer: 'The two-touch requirement prevents false triggers from raindrops, falling debris, or wind. Closing and reopening costs a lot of energy (the trap can only close ~5-7 times in its life). By requiring two touches within 20 seconds, the plant ensures something is actually moving inside the trap — almost certainly a live insect, not a random stimulus.',
      codeIntro: 'Compare the speed, energy cost, and efficiency of different trap types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Trap type comparison
traps = ['Pitfall\\n(pitcher)', 'Flypaper\\n(sundew)', 'Snap\\n(Venus)', 'Suction\\n(bladderwort)', 'Lobster-pot\\n(Genlisea)']

# Metrics
capture_speed_ms = [np.nan, 60000, 100, 0.5, np.nan]  # ms (NaN = passive)
energy_cost = [2, 3, 8, 5, 1]  # relative (1-10)
prey_size_range = [9, 4, 6, 3, 2]  # relative (1-10)
capture_rate = [7, 6, 4, 9, 3]  # insects per week (relative)
reset_time_hrs = [0, 0.5, 12, 0.01, 0]  # hours to reset

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
trap_colors = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7']

# Capture speed (log scale)
ax = axes[0, 0]
ax.set_facecolor('#111827')
speeds = [s if not np.isnan(s) else 0 for s in capture_speed_ms]
active = [not np.isnan(s) for s in capture_speed_ms]
bars = ax.bar(range(5), speeds, color=trap_colors, alpha=0.85)
ax.set_yscale('symlog', linthresh=1)
ax.set_xticks(range(5))
ax.set_xticklabels(traps, color='white', fontsize=7)
ax.set_ylabel('Capture speed (ms)', color='white')
ax.set_title('Capture Speed (lower = faster)', color='white', fontsize=11)
ax.tick_params(colors='gray')
for i, (bar, spd, act) in enumerate(zip(bars, speeds, active)):
    label = f'{spd:.0f}ms' if act and spd > 0 else 'Passive'
    ax.text(bar.get_x() + bar.get_width()/2, max(bar.get_height(), 1) * 1.5,
            label, ha='center', color='white', fontsize=8)

# Energy cost vs capture rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i, trap in enumerate(traps):
    ax.scatter(energy_cost[i], capture_rate[i], s=200, color=trap_colors[i],
               edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(trap.replace('\\n', ' '), xy=(energy_cost[i], capture_rate[i]),
                xytext=(energy_cost[i]+0.3, capture_rate[i]+0.3),
                color=trap_colors[i], fontsize=7)
ax.set_xlabel('Energy cost (relative)', color='white')
ax.set_ylabel('Capture rate (relative)', color='white')
ax.set_title('Efficiency: Cost vs Capture Rate', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Prey size range
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.barh(range(5), prey_size_range, color=trap_colors, alpha=0.85)
ax.set_yticks(range(5))
ax.set_yticklabels(traps, color='white', fontsize=8)
ax.set_xlabel('Prey size range (relative)', color='white')
ax.set_title('Prey Size Versatility', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Radar comparison (simplified)
ax = axes[1, 1]
ax.set_facecolor('#111827')
categories = ['Speed', 'Efficiency', 'Prey range', 'Capture rate', 'Low energy']
N = len(categories)
angles = np.linspace(0, 2*np.pi, N, endpoint=False).tolist()
angles += angles[:1]

for i, trap in enumerate(traps):
    speed_score = 10 - min(speeds[i] / 10000, 10) if active[i] else 5
    values = [speed_score, capture_rate[i], prey_size_range[i],
              capture_rate[i], 10 - energy_cost[i]]
    values += values[:1]
    ax.plot(angles, values, 'o-', color=trap_colors[i], linewidth=1.5,
            label=trap.replace('\\n', ' '), markersize=3)
    ax.fill(angles, values, alpha=0.05, color=trap_colors[i])

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, color='white', fontsize=7)
ax.set_ylim(0, 10)
ax.tick_params(colors='gray')
ax.legend(loc='upper right', bbox_to_anchor=(1.4, 1.1), facecolor='#1f2937',
          edgecolor='gray', labelcolor='white', fontsize=7)
ax.set_title('Overall Comparison', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Key insights:")
print("  Bladderwort: fastest trap in nature (0.5ms), aquatic specialist")
print("  Venus flytrap: snap mechanism, but slow reset (12hrs)")
print("  Pitcher plant: passive (no speed), catches the most prey overall")
print("  Sundew: best for small, slow-moving insects")
print()
print("No single trap type is 'best' — each is optimized for a niche.")`,
      challenge: 'Add a 6th trap type to the comparison: the "aquatic pitfall" (Brocchinia — a bromeliad). Research its properties and add it to all four charts.',
      successHint: 'The diversity of trap mechanisms shows that evolution is not a single path but many parallel experiments. The same evolutionary pressure (poor soil) produced at least five completely different engineering solutions.',
    },
    {
      title: 'Extreme adaptation — when survival requires radical change',
      concept: `Carnivory is one of the most extreme adaptations in the plant kingdom. But plants have evolved many other radical strategies to survive hostile environments:

- **Epiphytism**: growing on other plants (orchids, ferns) — access to light without competing for soil
- **Parasitism**: stealing nutrients from other plants (*Rafflesia*, *Cuscuta/dodder*) — abandoning photosynthesis entirely
- **CAM photosynthesis**: opening stomata only at night (cacti, succulents) — conserving water in deserts
- **Carnivory**: catching animals — compensating for nutrient-poor soil
- **Mycoheterotrophy**: feeding on fungi (*Monotropa/ghost plant*) — living in permanent darkness underground

Each represents a departure from "normal" plant behaviour. They evolved because the standard strategy (roots in soil, leaves in sun) doesn't work in their specific habitat.

The common thread: **adaptation is costly**. Carnivory requires trap construction. CAM requires modified biochemistry. Parasitism requires losing photosynthetic genes. Every adaptation is a trade-off — gaining one advantage while paying a price somewhere else.`,
      analogy: 'Extreme adaptations are like specialized career paths. A normal plant is a generalist with a steady job (photosynthesis + soil nutrients). A carnivorous plant is like someone who became a professional poker player — high reward in the right environment, but it only works if you\'re very good and in the right game.',
      storyConnection: 'The pitcher plant of Meghalaya didn\'t choose to be carnivorous — natural selection shaped it over millions of years because catching insects provided an advantage in nutrient-poor soil. The story\'s narrative of "learning to catch" is the folktale version of millions of generations of incremental adaptation.',
      checkQuestion: 'Rafflesia arnoldii produces the world\'s largest flower (1 metre wide) but has no stems, leaves, or roots. How does it survive?',
      checkAnswer: 'It\'s a parasite — it lives entirely inside the tissue of a host vine (Tetrastigma), absorbing nutrients directly. The only visible part is the flower, which emerges to be pollinated by flies (attracted by its rotting-meat smell). It abandoned photosynthesis, roots, and stems — keeping only the reproductive organ. Maximum reduction, minimum investment.',
      codeIntro: 'Map the relationship between environmental stress and adaptation extremity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Extreme adaptations: environmental stress vs adaptation cost vs fitness benefit
adaptations = [
    ('Normal plant', 1, 1, 8, '#22c55e'),
    ('Epiphyte\\n(orchid)', 4, 3, 7, '#3b82f6'),
    ('CAM plant\\n(cactus)', 5, 4, 6, '#f59e0b'),
    ('Carnivore\\n(pitcher)', 7, 6, 6, '#ef4444'),
    ('Parasite\\n(dodder)', 8, 7, 5, '#a855f7'),
    ('Myco-\\nheterotroph', 9, 8, 3, '#6b7280'),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Scatter: stress vs adaptation cost
ax1.set_facecolor('#111827')
for name, stress, cost, fitness, color in adaptations:
    ax1.scatter(stress, cost, s=fitness*40, color=color, edgecolor='white',
                linewidth=1, zorder=5, alpha=0.85)
    ax1.annotate(name, xy=(stress, cost), xytext=(stress+0.3, cost+0.3),
                 color=color, fontsize=8)

# Trend line
stresses = [a[1] for a in adaptations]
costs = [a[2] for a in adaptations]
z = np.polyfit(stresses, costs, 1)
p = np.poly1d(z)
x_trend = np.linspace(0, 10, 100)
ax1.plot(x_trend, p(x_trend), '--', color='gray', linewidth=1, alpha=0.5)

ax1.set_xlabel('Environmental stress level', color='white')
ax1.set_ylabel('Adaptation cost', color='white')
ax1.set_title('More Stress = More Extreme Adaptation', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 10)
ax1.set_ylim(0, 10)
ax1.text(5, 1, 'Bubble size = fitness in native habitat', color='gray', fontsize=8, ha='center')

# Trade-off chart
ax2.set_facecolor('#111827')
names = [a[0].replace('\\n', ' ') for a in adaptations]
fitness_vals = [a[3] for a in adaptations]
cost_vals = [a[2] for a in adaptations]
colors_list = [a[4] for a in adaptations]

x = np.arange(len(adaptations))
width = 0.35
ax2.bar(x - width/2, fitness_vals, width, color=colors_list, alpha=0.85, label='Fitness in native habitat')
ax2.bar(x + width/2, cost_vals, width, color=colors_list, alpha=0.4, label='Adaptation cost', edgecolor='white', linewidth=0.5)

ax2.set_xticks(x)
ax2.set_xticklabels(names, color='white', fontsize=7, rotation=20, ha='right')
ax2.set_ylabel('Score (0-10)', color='white')
ax2.set_title('The Trade-off: Fitness vs Cost', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The spectrum of plant adaptation:")
print("  Low stress -> low cost, high fitness (normal plants)")
print("  High stress -> high cost, lower fitness but SURVIVAL")
print()
print("Carnivorous plants sit in the middle: moderate cost,")
print("moderate fitness, but they survive where nothing else can.")
print()
print("The lesson: adaptation is always a trade-off.")
print("There is no 'perfect' organism — only organisms perfectly")
print("suited to their specific environment.")`,
      challenge: 'Add humans to this chart as "tool users." How would you score environmental stress, adaptation cost, and fitness? What does this tell us about technology as an adaptation strategy?',
      successHint: 'Understanding adaptation as trade-offs is one of the deepest ideas in biology. Every organism — including us — is a bundle of compromises. The pitcher plant traded simplicity for survival in one of the harshest soil environments on Earth.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Carnivorous Plants & Adaptation</span>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}