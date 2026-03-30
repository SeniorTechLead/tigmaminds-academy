import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import HanumanMedicineDiagram from '../diagrams/HanumanMedicineDiagram';
import HanumanAltitudeZonesDiagram from '../diagrams/HanumanAltitudeZonesDiagram';
import HanumanDichotomousKeyDiagram from '../diagrams/HanumanDichotomousKeyDiagram';
import HanumanTectonicDiagram from '../diagrams/HanumanTectonicDiagram';
import PHScaleDiagram from '../diagrams/PHScaleDiagram';
import ActivityHerbIdentifyDiagram from '../diagrams/ActivityHerbIdentifyDiagram';

export default function HanumanMountainLevel3() {
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
      title: 'Molecular structure — how plant compounds work',
      concept: `A drug molecule works because its **shape** fits a target in your body — like a key fitting a lock. This is the **lock-and-key model** of pharmacology.

Aspirin (acetylsalicylic acid) works because its molecular shape fits into the active site of an enzyme called **COX-2**, blocking it. COX-2 produces prostaglandins, which cause pain and inflammation. Block COX-2 and you reduce pain.

The molecule's shape is determined by its atoms and the bonds between them. Carbon forms 4 bonds, oxygen 2, hydrogen 1, nitrogen 3. These rules constrain the possible 3D shapes.

We can represent molecules in code using **SMILES notation** — a text string that encodes molecular structure. Aspirin is \`CC(=O)OC1=CC=CC=C1C(=O)O\`. Each letter is an atom; numbers mark ring closures; parentheses mark branches.`,
      analogy: 'A drug molecule is like a specific key. Your body has millions of different locks (enzymes, receptors). The drug key fits only one lock. When it inserts, it either blocks the lock (inhibitor) or turns it on (agonist). A molecule that does not fit does nothing — like trying the wrong key.',
      storyConnection: 'The Sanjeevani herb contained molecules whose shapes fit the "locks" in Lakshmana\'s injured body, reversing the damage. Modern pharmacology does the same thing: identify the target (lock), find or design a molecule (key) that fits it.',
      checkQuestion: 'Why does aspirin reduce pain but not cure infections?',
      checkAnswer: 'Aspirin\'s molecular shape fits COX-2 (pain enzyme) but NOT the targets involved in fighting bacteria. It is the wrong key for the infection lock. Antibiotics have different molecular shapes that fit bacterial enzymes. Each drug works on specific targets determined by molecular fit.',
      codeIntro: 'Represent molecular formulas and calculate basic properties.',
      code: `# Molecular formulas of plant-derived drugs
drugs = {
    "Aspirin": {
        "formula": "C9H8O4",
        "atoms": {"C": 9, "H": 8, "O": 4},
        "source": "Willow bark (Salix)",
        "target": "COX-2 enzyme",
        "use": "Pain, inflammation"
    },
    "Morphine": {
        "formula": "C17H19NO3",
        "atoms": {"C": 17, "H": 19, "N": 1, "O": 3},
        "source": "Opium poppy",
        "target": "Opioid receptors",
        "use": "Severe pain"
    },
    "Artemisinin": {
        "formula": "C15H22O5",
        "atoms": {"C": 15, "H": 22, "O": 5},
        "source": "Sweet wormwood (Artemisia)",
        "target": "Malaria parasite heme",
        "use": "Malaria"
    },
    "Taxol": {
        "formula": "C47H51NO14",
        "atoms": {"C": 47, "H": 51, "N": 1, "O": 14},
        "source": "Himalayan Yew (Taxus)",
        "target": "Microtubules",
        "use": "Cancer"
    },
}

# Atomic masses
mass = {"C": 12.01, "H": 1.008, "N": 14.01, "O": 16.00}

print("=== Plant-Derived Drug Molecules ===\\n")
for name, info in drugs.items():
    mw = sum(mass[a] * n for a, n in info["atoms"].items())
    total_atoms = sum(info["atoms"].values())
    print(f"{name} ({info['formula']})")
    print(f"  Molecular weight: {mw:.1f} g/mol")
    print(f"  Total atoms: {total_atoms}")
    print(f"  Source: {info['source']}")
    print(f"  Target: {info['target']}")
    print(f"  Use: {info['use']}\\n")`,
      challenge: 'Add curcumin (C21H20O6, from turmeric, targets NF-kB pathway, anti-inflammatory) and reserpine (C33H40N2O9, from sarpagandha, targets vesicular monoamine transporter, blood pressure). Which has the highest molecular weight?',
      successHint: 'You can now calculate molecular properties from formulas. This is the first step of computational chemistry — turning molecular structure into quantitative data.',
    },
    {
      title: 'Extraction and purification — chromatography',
      concept: `In Level 1, you modelled extraction kinetics. Now let's model the purification step: **chromatography**.

Chromatography separates a mixture of compounds based on how strongly each one sticks to a solid surface. The mixture is dissolved in a liquid (the **mobile phase**) and poured through a column packed with powder (the **stationary phase**).

Compounds that stick weakly to the powder move through quickly. Compounds that stick strongly lag behind. By the time the liquid exits the bottom, the compounds have separated into bands — like runners in a race who started together but spread out based on their speed.

A **chromatogram** is a graph of "how much compound" vs "time." Each peak represents a different compound. The area under each peak tells you how much of that compound is present.`,
      analogy: 'Chromatography is like a race through mud. Some runners (molecules) wear smooth shoes and glide through easily — they reach the end first. Others wear sticky shoes and get stuck in the mud — they arrive last. Same starting line, but different speeds through the obstacle. The result: all runners separated by arrival time.',
      storyConnection: 'If scientists extracted the Sanjeevani herb, they would get a crude mixture of dozens of compounds. Chromatography would separate them into individual peaks. Each peak could then be tested to find which one has the healing effect. This is how modern drug discovery works.',
      checkQuestion: 'If two compounds have nearly identical chromatography retention times, what could you do to separate them better?',
      checkAnswer: 'Three options: (1) Use a longer column — more time to separate. (2) Change the solvent — different solvents interact differently with each compound. (3) Use a different stationary phase — one that "grips" the two compounds unequally. Real chromatographers optimise all three.',
      codeIntro: 'Simulate a chromatography experiment and plot the chromatogram.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate chromatogram: each compound is a Gaussian peak
time = np.linspace(0, 30, 500)

compounds = [
    {"name": "Chlorophyll", "rt": 4, "width": 0.8, "height": 30, "color": "green"},
    {"name": "Tannins", "rt": 8, "width": 1.2, "height": 45, "color": "brown"},
    {"name": "Active compound", "rt": 14, "width": 0.6, "height": 80, "color": "cyan"},
    {"name": "Waxes", "rt": 20, "width": 2.0, "height": 25, "color": "gray"},
]

fig, ax = plt.subplots(figsize=(10, 5))
total = np.zeros_like(time)

for c in compounds:
    peak = c["height"] * np.exp(-0.5 * ((time - c["rt"]) / c["width"])**2)
    total += peak
    ax.fill_between(time, peak, alpha=0.3, color=c["color"])
    ax.plot(time, peak, color=c["color"], linewidth=1.5)
    ax.annotate(c["name"], (c["rt"], c["height"] + 3),
                ha="center", fontsize=9, color="white")

ax.plot(time, total, 'w-', linewidth=0.8, alpha=0.5, label="Total signal")
ax.set_xlabel("Retention Time (minutes)")
ax.set_ylabel("Detector Signal (mAU)")
ax.set_title("Chromatogram: Separating Plant Extract")
ax.grid(alpha=0.15)
plt.show()

print("Each peak = one compound.")
print("The active compound (cyan) elutes at 14 min.")
print("Collect ONLY the liquid at 13-15 min = pure active compound.")`,
      challenge: 'Add a "contamination" scenario: make two peaks overlap (set retention times to 13 and 14.5 with wide widths). Then show that increasing column length (narrower peaks) resolves them. How does peak width relate to separation quality?',
      successHint: 'Chromatography is one of the most important techniques in chemistry. It purifies drugs, tests for doping in sports, solves crimes (forensic toxicology), and ensures food safety. Same principle, different applications.',
    },
    {
      title: 'Dose-response curves — how much medicine is enough?',
      concept: `Every drug has a **dose-response curve**: at low doses, little happens. As the dose increases, the effect grows. Beyond a certain dose, the effect plateaus (all target receptors are occupied). At very high doses, toxic side effects appear.

The dose-response relationship typically follows a **sigmoid** (S-shaped) curve described by the Hill equation:

Response = (dose^n) / (ED50^n + dose^n) x max_response

Where **ED50** is the dose at which the effect is 50% of maximum, and **n** controls the steepness of the curve.

The **therapeutic window** is the range between the minimum effective dose and the dose where toxic effects begin. A drug with a wide therapeutic window (aspirin) is relatively safe. A drug with a narrow window (aconite) is dangerous.`,
      analogy: 'Think of turning up the volume on a speaker. At volume 1, you can barely hear it. Volume 5 is comfortable. Volume 10 is perfect. Volume 15 starts to hurt your ears. Volume 20 damages the speaker. The "therapeutic window" for listening is volume 5-12: enough to hear clearly, not enough to cause damage.',
      storyConnection: 'The Sanjeevani herb worked at a specific dose — enough to heal Lakshmana. Too little would have no effect. Too much of any potent plant compound can be toxic. Aconite, a Himalayan herb, is used medicinally at micro-doses but is lethal in larger amounts.',
      checkQuestion: 'Drug A has ED50 = 10 mg and Drug B has ED50 = 100 mg. Which is more potent?',
      checkAnswer: 'Drug A is more potent — it achieves 50% effect at 10 mg, while Drug B needs 100 mg for the same effect. Potency measures how much drug you need. Efficacy measures the maximum effect. A drug can be highly potent (tiny dose works) but have low efficacy (limited maximum effect), or vice versa.',
      codeIntro: 'Plot dose-response curves and identify the therapeutic window.',
      code: `import numpy as np
import matplotlib.pyplot as plt

dose = np.linspace(0, 200, 500)

def hill(dose, ed50, n, max_resp):
    return max_resp * dose**n / (ed50**n + dose**n)

# Therapeutic effect
effect = hill(dose, ed50=30, n=2, max_resp=100)

# Toxic effect (starts at higher dose)
toxicity = hill(dose, ed50=120, n=3, max_resp=100)

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(dose, effect, 'g-', linewidth=2.5, label='Therapeutic effect')
ax.plot(dose, toxicity, 'r-', linewidth=2.5, label='Toxicity')

# Therapeutic window
ax.axvspan(20, 80, alpha=0.15, color='green', label='Therapeutic window')
ax.axhline(50, color='gray', ls=':', alpha=0.5)
ax.text(5, 52, 'ED50', color='gray', fontsize=9)

ax.set_xlabel('Dose (mg)')
ax.set_ylabel('Response (%)')
ax.set_title('Dose-Response: Therapeutic Window')
ax.legend(fontsize=9, loc='right')
ax.grid(alpha=0.2)
plt.show()

print("Green zone: drug works without causing harm.")
print("ED50 = 30 mg (50% therapeutic effect)")
print("Toxic threshold begins ~80 mg")
print("Therapeutic window: 20-80 mg")`,
      challenge: 'Plot aconite with a very narrow therapeutic window (ED50=5, toxic ED50=15). Compare it to aspirin (ED50=200, toxic ED50=10000). Which is safer and why?',
      successHint: 'Pharmacologists use dose-response curves to determine safe dosing for every drug. The Hill equation you just coded is the mathematical foundation of drug safety testing.',
    },
    {
      title: 'Isostasy — why mountains float like icebergs',
      concept: `Here is a surprising fact: mountains have **roots**. Just as an iceberg extends deep below the waterline, a mountain range extends deep into the mantle below the visible peaks.

This is **isostasy** — the principle that the Earth's crust floats on the denser mantle, and taller features must have deeper roots to stay in balance. The Himalayas extend about 70 km deep into the mantle — roughly 8 times their visible height.

The math is density balance:
- Crust density: ~2,700 kg/m3
- Mantle density: ~3,300 kg/m3
- For a mountain of height h above the surface, the root depth d = h x (crust density) / (mantle density - crust density)

For the Himalayas: d = 8,849 x 2700 / (3300 - 2700) = 8,849 x 4.5 = ~40 km (simplified; actual root is ~70 km due to complex structure).`,
      analogy: 'Float a block of wood in water. The thicker the block, the deeper it sinks AND the higher it sticks up. Mountains work the same way in the mantle — taller peaks mean deeper roots. This is why the crust under the Himalayas is the thickest on Earth.',
      storyConnection: 'When Hanuman "lifted" the mountain, the story implies he uprooted it entirely. Scientifically, the mountain extends ~70 km into the mantle. The visible peak is just the tip of an enormous geological structure — like an iceberg, most of the mountain is hidden below.',
      checkQuestion: 'If erosion wore away 1 km from a mountain peak, would the mountain get 1 km shorter?',
      checkAnswer: 'No — it would rise back up slightly. Removing weight from the top reduces the downward force, so the mountain "floats up" (isostatic rebound). You remove 1 km and the mountain might only lose 0.8 km net height. This is why mountain ranges last so long — erosion is partially compensated by rebound.',
      codeIntro: 'Model isostasy — calculate mountain root depth and simulate erosion rebound.',
      code: `import numpy as np
import matplotlib.pyplot as plt

crust_density = 2700  # kg/m3
mantle_density = 3300  # kg/m3

heights = np.linspace(0, 9000, 200)
roots = heights * crust_density / (mantle_density - crust_density)

fig, ax = plt.subplots(figsize=(8, 6))

# Mountain above surface
ax.fill_between(heights, 0, heights, alpha=0.4, color='sienna',
                label='Above surface')
# Root below surface
ax.fill_between(heights, 0, -roots, alpha=0.4, color='darkorange',
                label='Root below surface')
ax.axhline(0, color='white', linewidth=1.5)
ax.text(100, 500, 'Surface', color='white', fontsize=10)

# Mark Everest
ax.plot([8849], [8849], 'r^', markersize=12)
ax.text(8849, 9200, 'Everest\\n8,849 m', ha='center',
        fontsize=9, color='cyan')
ax.plot([8849], [-8849 * crust_density / (mantle_density - crust_density)],
        'rv', markersize=12)
root_ev = 8849 * crust_density / (mantle_density - crust_density)
ax.text(8849, -root_ev - 2000, f'Root\\n{root_ev:.0f} m',
        ha='center', fontsize=9, color='orange')

ax.set_xlabel('Mountain Height (m)')
ax.set_ylabel('Depth / Height (m)')
ax.set_title('Isostasy: Mountains Have Roots')
ax.legend(fontsize=10)
ax.grid(alpha=0.15)
plt.show()

print(f"Everest root depth: {root_ev:.0f} m ({root_ev/1000:.0f} km)")
print(f"Ratio: root is {root_ev/8849:.1f}x the visible height")`,
      challenge: 'Simulate erosion: remove 2,000 m from a 8,849 m peak. Calculate the new root depth. Then calculate isostatic rebound — the peak rises by (old_root - new_root). What is the net height change?',
      successHint: 'Isostasy explains why continents float, why coastlines rise when ice sheets melt, and why the Himalayas are still adjusting millions of years after the collision began. The Earth\'s surface is not rigid — it is dynamic.',
    },
    {
      title: 'Bioassays — testing if a compound actually works',
      concept: `You have extracted and purified a compound. But does it work? You need a **bioassay** — a test that measures biological activity.

The simplest bioassay: expose bacteria on a plate to different concentrations of the compound and see which concentrations stop bacterial growth. The lowest concentration that stops growth is the **MIC** (Minimum Inhibitory Concentration).

More sophisticated assays use **cell cultures** (human cells in a dish) or **enzyme assays** (measuring how much the compound blocks a specific enzyme).

The gold standard is a **randomised controlled trial** (RCT): give the drug to one group, a placebo to another, and compare outcomes. Neither patients nor doctors know who gets what (**double-blind**) to prevent bias.

This is how traditional knowledge becomes evidence-based medicine.`,
      analogy: 'A bioassay is like a taste test. You give ten people two cups — one with the new flavour, one without — and ask which they prefer. Neither the taster nor the person serving knows which is which (double-blind). If 8 out of 10 prefer the new flavour, you have evidence it works. Drug trials do the same with health outcomes instead of taste.',
      storyConnection: 'The Sanjeevani herb "worked" in the story — it revived Lakshmana. In modern science, we would need to prove this through controlled experiments. Traditional claims are valuable leads, but bioassays provide the evidence that turns a traditional remedy into an approved medicine.',
      checkQuestion: 'Why does a double-blind trial require neither the patient nor the doctor to know who gets the real drug?',
      checkAnswer: 'If the patient knows, the placebo effect skews results (believing you got the drug makes you feel better). If the doctor knows, they might unconsciously treat patients differently or interpret symptoms with bias. Double-blinding removes both sources of bias, ensuring the measured effect is truly from the drug.',
      codeIntro: 'Simulate a bioassay: measure bacterial growth inhibition at different drug concentrations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate bacterial growth inhibition assay
concentrations = [0, 0.5, 1, 2, 4, 8, 16, 32, 64]  # ug/mL

# Bacterial growth (colony count) — decreases with drug
np.random.seed(42)
growth_control = 100  # colonies without drug
mic = 8  # Minimum Inhibitory Concentration

growth = []
for conc in concentrations:
    if conc == 0:
        g = growth_control + np.random.normal(0, 5)
    else:
        g = growth_control * np.exp(-0.5 * (conc / mic * 3))
        g += np.random.normal(0, 3)
    growth.append(max(0, g))

fig, ax = plt.subplots(figsize=(8, 5))
ax.bar(range(len(concentrations)), growth, color='teal', alpha=0.7,
       edgecolor='white')
ax.set_xticks(range(len(concentrations)))
ax.set_xticklabels([str(c) for c in concentrations])
ax.set_xlabel('Drug Concentration (ug/mL)')
ax.set_ylabel('Bacterial Colonies')
ax.set_title('Bioassay: Bacterial Growth Inhibition')
ax.axhline(y=5, color='red', ls='--', alpha=0.7)
ax.text(7, 8, f'MIC = {mic} ug/mL', color='red', fontsize=10)
ax.grid(alpha=0.15, axis='y')
plt.show()

print(f"Control (no drug): ~{growth[0]:.0f} colonies")
print(f"At MIC ({mic} ug/mL): ~{growth[5]:.0f} colonies")
print(f"At 64 ug/mL: ~{growth[-1]:.0f} colonies")
print(f"\\nMIC = lowest concentration with near-zero growth")`,
      challenge: 'Add a second drug (extract from a different plant) with a higher MIC of 32 ug/mL. Plot both on the same graph. Which drug is more potent? Why?',
      successHint: 'You just simulated the key experiment in drug discovery. Every antibiotic, antiviral, and anti-cancer drug was validated through bioassays like this before reaching patients.',
    },
    {
      title: 'Conservation pharmacology — protecting medicinal plant species',
      concept: `Here is the paradox: the same medicinal plants that could save lives are being harvested to extinction. Over-collection of wild medicinal plants threatens:

- **Taxus wallichiana** (Himalayan Yew) — source of taxol (anti-cancer). Listed as Endangered.
- **Nardostachys jatamansi** (Spikenard) — traditional Ayurvedic herb. Critically Endangered.
- **Dactylorhiza hatagirea** (Himalayan orchid) — used for healing. Endangered.

Conservation strategies:
1. **Sustainable harvesting** — take only a fraction; let populations recover
2. **Cultivation** — grow medicinal plants in farms instead of wild-harvesting
3. **Chemical synthesis** — once you know the active molecule, make it in a lab
4. **Bioprospecting agreements** — ensure local communities benefit from discoveries

The code below models population dynamics of a medicinal plant under different harvesting strategies.`,
      analogy: 'Medicinal plant harvesting is like fishing. Take too many fish and the population collapses. But with sustainable quotas — take only 10% per year — the population recovers between harvests and lasts forever. The math is the same for plants: harvest rate must stay below reproduction rate.',
      storyConnection: 'In the story, Hanuman lifted the entire mountain to get one herb. That is the ultimate unsustainable harvest. Modern conservation asks: how do we get the medicine without destroying the source? The answer combines science (synthesis), ecology (sustainable harvest), and justice (benefit-sharing with local communities).',
      checkQuestion: 'Why is chemical synthesis of a drug often better for conservation than harvesting the plant?',
      checkAnswer: 'Synthesis produces the exact molecule in a factory without touching wild plants. Aspirin was originally extracted from willow bark, but now 100% is synthesised. However, synthesis requires knowing the exact molecular structure and a feasible production route. For complex molecules like taxol, partial synthesis from farmed yew needles is the current compromise.',
      codeIntro: 'Model medicinal plant population under different harvesting rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = 50
pop = np.zeros((3, years))
pop[:, 0] = 10000  # Initial population

growth_rate = 0.15  # 15% annual growth
harvest_rates = [0.05, 0.15, 0.30]  # 5%, 15%, 30%
labels = ['Sustainable (5%)', 'Break-even (15%)', 'Overharvest (30%)']
colors = ['#2ecc71', '#f39c12', '#e74c3c']

for i, harvest in enumerate(harvest_rates):
    for t in range(1, years):
        net_growth = pop[i, t-1] * growth_rate
        harvested = pop[i, t-1] * harvest
        pop[i, t] = max(0, pop[i, t-1] + net_growth - harvested)

fig, ax = plt.subplots(figsize=(8, 5))
for i in range(3):
    ax.plot(range(years), pop[i], color=colors[i],
            linewidth=2.5, label=labels[i])

ax.axhline(1000, color='red', ls=':', alpha=0.5)
ax.text(35, 1200, 'Extinction threshold', color='red', fontsize=9)
ax.set_xlabel('Years')
ax.set_ylabel('Plant Population')
ax.set_title('Medicinal Plant Population Under Harvesting')
ax.legend(fontsize=9)
ax.grid(alpha=0.2)
plt.show()

for i, label in enumerate(labels):
    final = pop[i, -1]
    print(f"{label}: {final:.0f} plants after {years} years")`,
      challenge: 'Add a fourth scenario: overharvest for 10 years (30%), then switch to sustainable (5%). Does the population recover? How many years until it returns to 10,000?',
      successHint: 'Conservation biology uses the same population models as ecology and economics. The math shows clearly: harvest above the growth rate and the population crashes. Below the growth rate and it thrives. This is the science that should guide all medicinal plant use.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Pharmacology, molecular structure, and conservation science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises explore drug discovery and conservation pharmacology. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python</>)}
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
            diagram={[HanumanMedicineDiagram, HanumanDichotomousKeyDiagram, HanumanAltitudeZonesDiagram, HanumanTectonicDiagram, PHScaleDiagram, ActivityHerbIdentifyDiagram][i] ? createElement([HanumanMedicineDiagram, HanumanDichotomousKeyDiagram, HanumanAltitudeZonesDiagram, HanumanTectonicDiagram, PHScaleDiagram, ActivityHerbIdentifyDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
