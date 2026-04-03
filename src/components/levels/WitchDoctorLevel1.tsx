import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function WitchDoctorLevel1() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Medicinal plants — nature\'s original pharmacy',
      concept: `In the story, the village witch doctor uses plants from the forest to heal the sick. This isn't magic — it's **ethnobotany**, the science of how cultures use plants. For thousands of years, traditional healers across the world have catalogued which roots, leaves, and barks treat which ailments.

Modern pharmacology owes a massive debt to these traditions:
- **Aspirin** comes from willow bark (salicylic acid)
- **Morphine** comes from opium poppy
- **Quinine** (malaria treatment) comes from cinchona bark
- **Artemisinin** (another malaria drug) comes from sweet wormwood — discovered by Tu Youyou, who won the Nobel Prize in 2015

About **25% of modern medicines** are derived directly from plants. The witch doctor's knowledge wasn't superstition — it was centuries of empirical observation, encoded in tradition.`,
      analogy: 'A traditional healer is like an open-source software library maintained by generations of contributors. Each generation adds fixes and features (new plant remedies), and the whole community benefits. Modern pharma is like a company that forks that library, isolates the best functions (active compounds), and packages them for mass distribution.',
      storyConnection: 'The witch doctor knew exactly which plant to pick and how to prepare it. In pharmacology, this maps to identifying the active compound, determining the correct dosage, and choosing the right delivery method. The story\'s "magic" is really pattern recognition refined over generations.',
      checkQuestion: 'Why can\'t we just eat raw willow bark instead of taking aspirin pills?',
      checkAnswer: 'Raw willow bark contains salicin, which the body converts to salicylic acid. But the dosage is unpredictable (varies by tree, season, bark thickness), it irritates the stomach severely, and the taste is extremely bitter. Aspirin (acetylsalicylic acid) is a modified version that\'s gentler on the stomach and delivered in precise doses. Pharmacology turns folk knowledge into reliable, safe medicine.',
      codeIntro: 'Map traditional plant remedies to their modern pharmaceutical equivalents.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Traditional plants and their modern drug equivalents
plants = ['Willow bark', 'Opium poppy', 'Cinchona bark', 'Foxglove', 'Pacific yew', 'Sweet wormwood']
compounds = ['Aspirin', 'Morphine', 'Quinine', 'Digitalis', 'Taxol', 'Artemisinin']
uses = ['Pain relief', 'Pain relief', 'Malaria', 'Heart failure', 'Cancer', 'Malaria']
year_discovered = [1897, 1804, 1820, 1785, 1971, 1972]
trad_use_years = [3500, 5000, 400, 800, 200, 2000]  # approx years of traditional use

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Timeline of modern discovery
ax1.set_facecolor('#111827')
colors = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899']
ax1.barh(compounds, year_discovered, color=colors, height=0.6)
ax1.set_xlabel('Year of modern isolation', color='white')
ax1.set_title('When Science Caught Up to Tradition', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_xlim(1750, 2000)
for i, (yr, use) in enumerate(zip(year_discovered, uses)):
    ax1.text(yr + 5, i, f'{yr} ({use})', color='white', fontsize=8, va='center')

# Traditional use duration vs modern discovery
ax2.set_facecolor('#111827')
ax2.bar(range(len(plants)), trad_use_years, color=colors, alpha=0.8)
ax2.set_xticks(range(len(plants)))
ax2.set_xticklabels([p.split()[0] for p in plants], color='gray', rotation=45, ha='right')
ax2.set_ylabel('Years of traditional use before isolation', color='white')
ax2.set_title('Centuries of Knowledge Before Modern Chemistry', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key insight: Traditional medicine preceded modern pharmacology by centuries.")
print("The witch doctor's 'magic' was empirical observation — science before the scientific method.")
print()
for p, c, u, y in zip(plants, compounds, uses, trad_use_years):
    print(f"  {p} -> {c} (used traditionally for ~{y} years)")`,
      challenge: 'Research one more plant-to-drug connection (e.g., rosy periwinkle to vincristine for leukemia). Add it to both charts. How many years was it used traditionally before modern isolation?',
      successHint: 'The WHO estimates that 80% of the world\'s population still relies on traditional plant-based medicine. Ethnobotany isn\'t just history — it\'s an active field guiding drug discovery today.',
    },
    {
      title: 'Active compounds — isolating what actually works',
      concept: `A medicinal plant contains hundreds of different chemical compounds. Only a few of them are responsible for the healing effect — these are called **active compounds** or **active ingredients**.

The process of finding them:
1. **Extraction**: crush the plant, dissolve in a solvent (water, alcohol, etc.)
2. **Fractionation**: separate the extract into groups of compounds
3. **Bioassay**: test each fraction against the disease/symptom
4. **Purification**: isolate the single compound responsible
5. **Characterization**: determine its chemical structure

This is called **bioassay-guided fractionation** — let the biology tell you which chemistry matters.

For example, the bark of the cinchona tree contains over 30 alkaloids. Only **quinine** effectively treats malaria. The rest are inactive or cause side effects. Without isolation, you'd be dosing the patient with 29 useless compounds alongside the one that works.`,
      analogy: 'Imagine a noisy room with 30 people talking. One person has the answer you need. Extraction is recording everyone. Fractionation is splitting them into smaller groups. Bioassay is asking each group if they know the answer. Purification is finding the one person who does. Characterization is writing down exactly what they said.',
      storyConnection: 'The witch doctor doesn\'t just hand over a whole plant — they prepare it in a specific way: grinding certain parts, boiling at certain temperatures, discarding others. This preparation is a rudimentary form of extraction and fractionation, concentrating the active compounds while removing harmful ones.',
      checkQuestion: 'If a plant extract cures headaches but also causes nausea, what does that tell a pharmacologist?',
      checkAnswer: 'The active compound for pain relief and the compound causing nausea are likely different molecules. By fractionating the extract further and testing each fraction, you can find the pain-relief compound without the nausea compound. This is exactly how aspirin was developed — salicylic acid from willow bark worked but destroyed the stomach. Acetylation (adding an acetyl group) solved the side effect.',
      codeIntro: 'Simulate bioassay-guided fractionation: narrowing down which fraction contains the active compound.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate fractionation steps
# We have a plant extract with 32 compounds, only compound #17 is active

n_compounds = 32
active_compound = 17

# Step 1: Split into 4 fractions (8 compounds each)
# Step 2: Test each, split the active one into 4 sub-fractions
# Step 3: Test each, split again
# Step 4: Pure compound

steps = ['Crude extract', 'Fraction B\n(of 4)', 'Sub-fraction B3\n(of 4)', 'Compound 17\n(pure)']
n_compounds_at_step = [32, 8, 2, 1]
activity = [100, 95, 92, 100]  # % activity relative to crude
purity = [3.1, 12.5, 50, 100]  # % purity

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Number of compounds narrowing down
ax1.set_facecolor('#111827')
bars = ax1.bar(range(4), n_compounds_at_step, color=['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'])
ax1.set_xticks(range(4))
ax1.set_xticklabels(steps, color='gray', fontsize=9)
ax1.set_ylabel('Number of compounds in fraction', color='white')
ax1.set_title('Narrowing Down: Bioassay-Guided Fractionation', color='white', fontsize=12)
ax1.tick_params(colors='gray')
for bar, n in zip(bars, n_compounds_at_step):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
             str(n), ha='center', color='white', fontsize=12, fontweight='bold')

# Purity increasing
ax2.set_facecolor('#111827')
ax2.plot(range(4), purity, 'o-', color='#22c55e', linewidth=2, markersize=10)
ax2.fill_between(range(4), purity, alpha=0.15, color='#22c55e')
ax2.set_xticks(range(4))
ax2.set_xticklabels(steps, color='gray', fontsize=9)
ax2.set_ylabel('Purity (%)', color='white')
ax2.set_title('Purity Increases at Each Step', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for i, p in enumerate(purity):
    ax2.annotate(f'{p}%', xy=(i, p), xytext=(i+0.15, p+5), color='#f59e0b', fontsize=10)

plt.tight_layout()
plt.show()

print("Bioassay-guided fractionation:")
print("  Start: 32 compounds, 3.1% purity")
print("  Step 1: Test 4 fractions -> Fraction B is active (8 compounds)")
print("  Step 2: Test 4 sub-fractions -> B3 is active (2 compounds)")
print("  Step 3: Separate and test -> Compound 17 is the one")
print()
print("Each step: fewer compounds, higher purity, same biological activity.")
print("This is how Tu Youyou found artemisinin in sweet wormwood.")`,
      challenge: 'What if two compounds work together (synergy) and neither works alone? Modify the simulation so activity drops when you isolate either compound separately. This is a real problem in pharmacology!',
      successHint: 'Bioassay-guided fractionation is the bridge between the witch doctor\'s whole-plant remedy and a modern pill. It\'s detective work — the biology tells the chemistry where to look.',
    },
    {
      title: 'Dose-response curves — the poison is in the dose',
      concept: `Paracelsus, the father of toxicology, said: "All things are poison, and nothing is without poison; only the dose makes a thing not a poison." This is the foundation of **pharmacology**.

Every drug has a **dose-response curve** — a graph showing how the body responds as the dose increases:
- **No effect zone**: dose too low, nothing happens
- **Therapeutic range**: dose is right, drug works as intended
- **Toxic range**: dose too high, harmful side effects
- **Lethal dose**: LD₅₀ — the dose that kills 50% of test subjects

Key metrics:
- **EC₅₀**: dose that produces 50% of maximum effect (potency measure)
- **Therapeutic index**: ratio of toxic dose to effective dose (safety measure)
- A drug with a HIGH therapeutic index is SAFER (big gap between helping and harming)`,
      analogy: 'A dose-response curve is like the volume knob on a speaker. Too low and you can\'t hear the music (no effect). The sweet spot is clear and enjoyable (therapeutic range). Too high and it distorts and hurts your ears (toxicity). The therapeutic index is how far apart "comfortable volume" and "painful volume" are on the dial.',
      storyConnection: 'The witch doctor carefully measures the remedy — a pinch of this root, a few drops of that extract. Too little and the patient stays sick. Too much and they get worse. The witch doctor\'s expertise is really an intuitive understanding of dose-response relationships, learned through generations of trial and observation.',
      checkQuestion: 'Caffeine is safe at 200mg (a cup of coffee) but lethal at ~10,000mg. Water is safe at 2 liters but lethal at ~6 liters (water intoxication). Which has a higher therapeutic index?',
      checkAnswer: 'Caffeine: 10,000/200 = 50. Water: 6/2 = 3. Caffeine has a much higher therapeutic index than water for its "therapeutic effect" (alertness vs. hydration). This sounds counterintuitive — we think of caffeine as dangerous and water as safe — but it illustrates that the therapeutic index depends on the specific effect being measured.',
      codeIntro: 'Plot dose-response curves for two drugs with different therapeutic indices.',
      code: `import numpy as np
import matplotlib.pyplot as plt

dose = np.linspace(0, 100, 500)

# Sigmoid dose-response: effect = Emax / (1 + (EC50/dose)^n)
def dose_response(dose, ec50, emax, n=2):
    with np.errstate(divide='ignore', invalid='ignore'):
        return np.where(dose > 0, emax / (1 + (ec50/dose)**n), 0)

# Drug A: narrow therapeutic index (dangerous)
drug_a_effect = dose_response(dose, ec50=10, emax=100)
drug_a_toxic = dose_response(dose, ec50=30, emax=100)

# Drug B: wide therapeutic index (safe)
drug_b_effect = dose_response(dose, ec50=10, emax=100)
drug_b_toxic = dose_response(dose, ec50=80, emax=100)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

for ax, ta, tb, title, ti in [(ax1, drug_a_toxic, drug_a_effect, 'Drug A: Narrow Therapeutic Index', 3),
                                (ax2, drug_b_toxic, drug_b_effect, 'Drug B: Wide Therapeutic Index', 8)]:
    ax.set_facecolor('#111827')
    ax.plot(dose, drug_a_effect if ax == ax1 else drug_b_effect, color='#22c55e', linewidth=2, label='Therapeutic effect')
    ax.plot(dose, ta if ax == ax1 else drug_b_toxic, color='#ef4444', linewidth=2, label='Toxic effect')
    ax.axhline(50, color='gray', linestyle=':', alpha=0.5)

    ec50 = 10
    td50 = 30 if ax == ax1 else 80
    ax.fill_betweenx([0, 100], ec50, td50, alpha=0.1, color='#22c55e')
    ax.annotate('Therapeutic\\nwindow', xy=((ec50+td50)/2, 50), ha='center', color='#22c55e', fontsize=9)
    ax.set_xlabel('Dose (mg)', color='white')
    ax.set_ylabel('Response (%)', color='white')
    ax.set_title(f'{title} (TI={ti})', color='white', fontsize=11)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Therapeutic Index (TI) = TD50 / ED50")
print(f"  Drug A: TI = 30/10 = 3.0 (DANGEROUS - narrow window)")
print(f"  Drug B: TI = 80/10 = 8.0 (SAFER - wide window)")
print()
print("Real examples:")
print("  Lithium (mood stabilizer): TI ≈ 3 (requires blood monitoring)")
print("  Ibuprofen (pain relief): TI ≈ 10 (relatively safe)")
print("  Penicillin (antibiotic): TI > 100 (very safe)")`,
      challenge: 'Add a third drug with EC50=5 (very potent) but TD50=10 (toxic at low doses). Even though it works at lower doses, is it safer? Plot it alongside Drugs A and B.',
      successHint: 'Every pill you\'ve ever taken was approved because its dose-response curve showed a wide enough therapeutic index. The witch doctor\'s careful dosing is the same principle — just without the graph.',
    },
    {
      title: 'Alkaloids — the chemistry behind the cure',
      concept: `Most medicinal plant compounds belong to a class called **alkaloids** — nitrogen-containing molecules produced by plants, often as defense chemicals against herbivores.

Key alkaloids and their effects:
- **Caffeine** (coffee, tea): stimulates the central nervous system by blocking adenosine receptors
- **Nicotine** (tobacco): mimics acetylcholine, causing both stimulation and addiction
- **Morphine** (opium poppy): binds to opioid receptors, blocking pain signals
- **Quinine** (cinchona): kills malaria parasites inside red blood cells
- **Capsaicin** (chili peppers): activates pain receptors (TRPV1), creating a burning sensation

Plants make these to DISCOURAGE being eaten. It's ironic — the defense chemicals are what make them medically useful to us. A molecule designed to cause pain in insects can block pain in humans, because our receptors are different.

Alkaloids share a common feature: at least one nitrogen atom in a ring structure. This nitrogen is key — it allows the molecule to interact with receptors in the nervous system.`,
      analogy: 'Alkaloids are like keys that fit into locks (receptors) in the body. A plant makes a key to jam the lock in an insect\'s nervous system (defense). But the same key might turn a different lock in the human body — one that blocks pain or kills a parasite. Same key, different lock, different outcome.',
      storyConnection: 'The witch doctor selects specific plants for specific ailments — bitter bark for fever, aromatic leaves for pain. Bitterness is often a sign of alkaloids. The traditional correlation between bitter taste and medicinal power has a chemical basis: alkaloids taste bitter and have potent biological activity.',
      checkQuestion: 'Why do we find caffeine pleasant but insects find it toxic? We\'re both affected by the same molecule.',
      checkAnswer: 'Dosage and receptor differences. Caffeine at human-scale doses blocks adenosine receptors (making us alert). At insect-scale doses (much higher relative to body mass), it disrupts the nervous system lethally. Also, insect adenosine receptors are more sensitive to caffeine. The molecule is the same; the biology interpreting it is different.',
      codeIntro: 'Visualize how different alkaloids interact with different receptor types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Alkaloid-receptor binding affinity matrix
# Higher = stronger binding (0-10 scale)
alkaloids = ['Caffeine', 'Nicotine', 'Morphine', 'Quinine', 'Capsaicin', 'Atropine']
receptors = ['Adenosine', 'Nicotinic\\nACh', 'Opioid\\n(mu)', 'Heme\\n(parasite)', 'TRPV1\\n(pain)', 'Muscarinic\\nACh']

# Binding matrix (rows=alkaloids, cols=receptors)
binding = np.array([
    [9, 1, 0, 0, 0, 0],   # Caffeine -> adenosine
    [0, 9, 0, 0, 0, 1],   # Nicotine -> nicotinic ACh
    [0, 0, 10, 0, 0, 0],  # Morphine -> opioid
    [0, 0, 0, 9, 0, 0],   # Quinine -> heme
    [0, 0, 0, 0, 9, 0],   # Capsaicin -> TRPV1
    [0, 0, 0, 0, 0, 9],   # Atropine -> muscarinic
])

fig, ax = plt.subplots(figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

im = ax.imshow(binding, cmap='YlOrRd', aspect='auto')
ax.set_xticks(range(len(receptors)))
ax.set_xticklabels(receptors, color='white', fontsize=9, ha='center')
ax.set_yticks(range(len(alkaloids)))
ax.set_yticklabels(alkaloids, color='white', fontsize=10)
ax.set_title('Alkaloid-Receptor Binding Affinity (Lock & Key)', color='white', fontsize=13, pad=15)

# Annotate cells
for i in range(len(alkaloids)):
    for j in range(len(receptors)):
        val = binding[i, j]
        if val > 0:
            ax.text(j, i, str(val), ha='center', va='center',
                    color='white' if val > 5 else 'gray', fontsize=12, fontweight='bold')

cbar = plt.colorbar(im, ax=ax, label='Binding strength')
cbar.ax.yaxis.label.set_color('white')
cbar.ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key insight: Each alkaloid binds STRONGLY to one receptor type.")
print("This specificity is why different plants treat different conditions:")
print("  Caffeine -> blocks adenosine -> wakefulness")
print("  Morphine -> activates opioid -> pain relief")
print("  Quinine -> disrupts heme -> kills malaria parasite")
print("  Capsaicin -> activates TRPV1 -> 'burning' sensation")
print()
print("The witch doctor knows WHICH plant for WHICH ailment.")
print("Pharmacology explains WHY: receptor specificity.")`,
      challenge: 'Some alkaloids bind to multiple receptors (causing side effects). Modify morphine to also have a binding strength of 3 for muscarinic receptors. What real-world side effect does this explain? (Hint: constipation.)',
      successHint: 'The lock-and-key model of drug-receptor interaction is the foundation of modern drug design. Every new medicine starts with finding the right key for the right lock — exactly what the witch doctor does intuitively.',
    },
    {
      title: 'Drug resistance — when the cure stops working',
      concept: `The witch doctor notices that a remedy that once worked brilliantly now seems less effective. This is **drug resistance** — one of the biggest challenges in modern medicine.

How it happens (using bacteria as an example):
1. A population of bacteria is exposed to an antibiotic
2. Most die, but a few have random mutations that give partial resistance
3. The survivors multiply (with the resistance trait)
4. Next exposure: more survive, more resistant offspring
5. Eventually: the antibiotic doesn't work at all

This is **natural selection in real time**. The antibiotic doesn't cause the mutation — it selects for bacteria that already have it.

The same process happens with:
- **Malaria parasites** developing resistance to quinine and chloroquine
- **Cancer cells** developing resistance to chemotherapy
- **Weeds** developing resistance to herbicides
- **Insects** developing resistance to pesticides`,
      analogy: 'Drug resistance is like a video game that learns your strategy. The first time you use a fire attack, most enemies die. But the few fire-resistant ones survive and multiply. Next level, there are more fire-resistant enemies. Eventually, fire attacks are useless and you need a new strategy. The enemies didn\'t "learn" — the game selected for fire resistance.',
      storyConnection: 'The witch doctor must constantly seek new remedies, combining plants in different ways. This mirrors real medicine: when resistance develops, we need new drugs or drug combinations. The witch doctor\'s diverse pharmacopoeia is an intuitive response to the same evolutionary pressure that drives modern antibiotic research.',
      checkQuestion: 'Doctors always say "finish your full course of antibiotics, even if you feel better." Why does stopping early promote resistance?',
      checkAnswer: 'When you feel better, most bacteria are dead — but not all. The survivors are the ones with the highest natural resistance. If you stop the antibiotic early, these resistant survivors multiply and repopulate. Next time you get infected, it\'s with the resistant strain. Finishing the course kills even the partially resistant ones, leaving no survivors to evolve further.',
      codeIntro: 'Simulate the evolution of drug resistance in a bacterial population over multiple antibiotic exposures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate bacterial population with varying resistance levels
# Resistance score: 0 (no resistance) to 1 (full resistance)
n_bacteria = 1000
n_generations = 10

# Initial population: most are susceptible
resistance = np.random.beta(1, 10, n_bacteria)  # skewed toward low resistance

mean_resistance = [np.mean(resistance)]
pop_sizes = [n_bacteria]

for gen in range(n_generations):
    # Apply antibiotic: kills bacteria based on resistance
    # Survival probability = resistance score
    survival_threshold = 0.3  # antibiotic efficacy
    survivors = resistance[resistance > survival_threshold]

    if len(survivors) < 5:
        survivors = resistance[np.argsort(resistance)[-5:]]

    # Survivors reproduce with slight mutation
    n_offspring = n_bacteria
    parents = np.random.choice(survivors, n_offspring, replace=True)
    resistance = parents + np.random.normal(0, 0.02, n_offspring)
    resistance = np.clip(resistance, 0, 1)

    mean_resistance.append(np.mean(resistance))
    pop_sizes.append(len(survivors))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Mean resistance over generations
ax1.set_facecolor('#111827')
ax1.plot(range(n_generations + 1), mean_resistance, 'o-', color='#ef4444', linewidth=2, markersize=6)
ax1.fill_between(range(n_generations + 1), mean_resistance, alpha=0.15, color='#ef4444')
ax1.axhline(0.3, color='#f59e0b', linestyle='--', label='Antibiotic threshold')
ax1.set_xlabel('Antibiotic exposure (generation)', color='white')
ax1.set_ylabel('Mean resistance score', color='white')
ax1.set_title('Evolution of Drug Resistance', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 1)

# Resistance distribution: first vs last generation
ax2.set_facecolor('#111827')
initial = np.random.beta(1, 10, 1000)
ax2.hist(initial, bins=30, alpha=0.6, color='#3b82f6', label='Before antibiotics', density=True)
ax2.hist(resistance, bins=30, alpha=0.6, color='#ef4444', label='After 10 exposures', density=True)
ax2.axvline(0.3, color='#f59e0b', linestyle='--', linewidth=2, label='Antibiotic threshold')
ax2.set_xlabel('Resistance score', color='white')
ax2.set_ylabel('Density', color='white')
ax2.set_title('Population Shift: Susceptible to Resistant', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Initial mean resistance: {mean_resistance[0]:.3f}")
print(f"After 10 exposures: {mean_resistance[-1]:.3f}")
print(f"Increase: {(mean_resistance[-1]/mean_resistance[0] - 1)*100:.0f}%")
print()
print("The antibiotic didn't CAUSE resistance.")
print("It SELECTED for bacteria that were already partially resistant.")
print("This is natural selection — Darwin in a petri dish.")`,
      challenge: 'Add a second antibiotic with threshold 0.6 that\'s applied after the first one fails (when mean resistance > 0.3). How many more generations before resistance to BOTH drugs evolves?',
      successHint: 'Antibiotic resistance is evolution happening in real time. The WHO calls it one of the top 10 global health threats. The witch doctor\'s practice of rotating remedies is an ancient strategy that modern medicine is rediscovering as "cycling" and "combination therapy."',
    },
    {
      title: 'Bioprospecting — from forest to pharmacy',
      concept: `**Bioprospecting** is the systematic search for new drugs from natural sources — plants, fungi, marine organisms, even soil bacteria. It's the scientific version of what the witch doctor does.

The numbers tell the story:
- There are an estimated **400,000 plant species** on Earth
- Only about **10%** have been studied for medicinal properties
- Rain forests (which cover 6% of Earth's surface) contain **over 50%** of all plant species
- We're losing about **137 species per day** to deforestation

This means we're losing potential cures before we even discover them.

Modern bioprospecting combines:
- **Ethnobotanical surveys**: interviewing traditional healers (like our witch doctor)
- **High-throughput screening**: testing thousands of extracts against disease targets
- **Genomics**: reading a plant's DNA to predict what compounds it can make
- **AI/machine learning**: predicting drug candidates from chemical structures

The big ethical question: when a pharmaceutical company profits from traditional knowledge, who should benefit? This is called the **access and benefit-sharing** debate.`,
      analogy: 'Bioprospecting is like data mining. The forest is the database. Each plant is a data record with hundreds of fields (chemical compounds). Traditional healers are the expert consultants who know which records are worth querying. High-throughput screening is the automated query. The drug is the insight extracted from the data.',
      storyConnection: 'The witch doctor\'s forest is a living pharmacy — but it\'s also a pharmacy that\'s burning down. The story carries an implicit message: protect the forest, protect the knowledge. In real-world terms, deforestation and the loss of indigenous knowledge are destroying potential medicines at an alarming rate.',
      checkQuestion: 'A pharmaceutical company discovers a cancer drug from a plant used by indigenous healers in Brazil. The drug earns $2 billion per year. Should the indigenous community receive compensation? Why or why not?',
      checkAnswer: 'The Nagoya Protocol (2010) says yes. It establishes that access to genetic resources and traditional knowledge must involve "fair and equitable sharing of benefits." Without the healers\' knowledge, the company might never have tested that plant. However, enforcement is weak, and many historic cases (like the rosy periwinkle from Madagascar) involved no compensation to local communities. This remains a major ethical debate.',
      codeIntro: 'Model the race between drug discovery and species loss — how many potential drugs are we losing?',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(2000, 2051)

# Estimated total plant species
total_species_2000 = 400000
loss_rate = 137 * 365  # species lost per year (estimated)
remaining = total_species_2000 - loss_rate * (years - 2000)
remaining = np.maximum(remaining, 100000)  # floor estimate

# Species studied for medicine (growing, but slowly)
studied_2000 = 40000
study_rate = 800  # new species studied per year
studied = studied_2000 + study_rate * (years - 2000)
studied = np.minimum(studied, remaining * 0.5)  # can't study more than exist

# Potential drugs lost forever
drugs_per_1000_species = 5  # rough estimate: 1 in 200 species yields a drug
species_lost = total_species_2000 - remaining
drugs_lost = species_lost * drugs_per_1000_species / 1000

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Species remaining vs studied
ax1.set_facecolor('#111827')
ax1.plot(years, remaining/1000, color='#ef4444', linewidth=2, label='Species remaining')
ax1.plot(years, studied/1000, color='#22c55e', linewidth=2, label='Species studied')
ax1.fill_between(years, studied/1000, remaining/1000, alpha=0.1, color='#f59e0b', label='Unstudied (potential drugs)')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Species (thousands)', color='white')
ax1.set_title('The Race: Discovery vs. Extinction', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Cumulative drugs lost
ax2.set_facecolor('#111827')
ax2.plot(years, drugs_lost, color='#ef4444', linewidth=2)
ax2.fill_between(years, drugs_lost, alpha=0.15, color='#ef4444')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Potential drugs lost (cumulative)', color='white')
ax2.set_title('Medicines We May Never Discover', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for yr in [2025, 2040]:
    idx = yr - 2000
    ax2.annotate(f'{yr}: ~{drugs_lost[idx]:.0f} drugs lost',
                 xy=(yr, drugs_lost[idx]), xytext=(yr-8, drugs_lost[idx]+100),
                 color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("The witch doctor's forest is a pharmacy we're burning down.")
print(f"  Species lost by 2025: ~{(total_species_2000 - remaining[25]):,}")
print(f"  Potential drugs lost by 2025: ~{drugs_lost[25]:.0f}")
print(f"  Potential drugs lost by 2050: ~{drugs_lost[50]:.0f}")
print()
print("Every species lost is a library book burned before anyone read it.")
print("Bioprospecting is a race against extinction.")`,
      challenge: 'What if we doubled the study rate from 800 to 1600 species per year? How does that change the gap between studied and remaining? Is faster study enough, or do we also need to slow species loss?',
      successHint: 'The witch doctor\'s knowledge is humanity\'s knowledge. When a traditional healer dies without passing on their remedies, or when a forest is cleared, potential cures for cancer, malaria, and diseases we haven\'t even named yet are lost forever. Bioprospecting urgency is both scientific and cultural.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Medicinal Plants & Pharmacology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for pharmacology simulations. Click to start.</p>
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
