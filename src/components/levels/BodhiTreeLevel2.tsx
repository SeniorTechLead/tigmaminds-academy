import { useState, useRef, useCallback } from 'react';
import { Loader2, FlaskConical } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BodhiTreeLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Auxin — the master hormone of plant growth',
      concept: `**Auxin** (indole-3-acetic acid, IAA) is the most important hormone in plant biology. It controls:

1. **Root initiation**: high auxin concentration at a wound triggers new root formation — this is why cuttings work
2. **Apical dominance**: auxin produced at the shoot tip suppresses growth of side branches
3. **Phototropism**: auxin accumulates on the shaded side of a stem, causing that side to grow faster, bending the plant toward light
4. **Gravitropism**: auxin accumulates on the lower side of a horizontal stem, causing upward bending

How auxin causes growth:
- Auxin binds to receptors on cell membranes
- This activates **proton pumps** that acidify the cell wall
- The acidic environment activates **expansins** — enzymes that loosen cell wall fibres
- With loosened walls, water pressure (turgor) pushes the cell to expand
- This is the **acid growth hypothesis**

Auxin concentration matters enormously:
- Low concentration → stimulates root growth
- Medium concentration → stimulates stem growth
- High concentration → INHIBITS growth (this is how synthetic auxin herbicides work — they overdose the plant)

The synthetic auxin **2,4-D** was one of the first selective herbicides. It kills broadleaf weeds (which absorb it readily) while leaving grasses (which do not) unharmed. Understanding auxin turned plant biology into agriculture.`,
      analogy: 'Auxin is like a volume knob on a stereo. At low volume (low concentration), you get a gentle effect (root growth). At medium volume, you get a full effect (stem growth). Crank it to maximum, and the speakers blow out (growth inhibition, plant death). The same molecule, at different concentrations, produces opposite effects.',
      storyConnection: 'When the Bodhi Tree cutting was planted in Sri Lankan soil, auxin accumulating at the cut end triggered root formation. Without this hormone, the cutting would have simply dried out and died. The entire Bodhi Tree lineage depends on auxin — the molecule that tells a cut stem "grow roots here."',
      checkQuestion: 'A plant on a windowsill bends toward the light. What is auxin doing?',
      checkAnswer: 'Auxin is being transported from the lit side to the shaded side of the stem. The shaded side now has more auxin, which causes those cells to elongate faster. The lit side grows slower. The difference in growth rate causes the stem to curve toward the light. If you rotate the plant 180°, auxin redistribution will cause it to curve back toward the light within hours.',
      codeIntro: 'Model auxin-driven cell elongation using the acid growth hypothesis.',
      code: `import numpy as np

np.random.seed(42)

# Acid Growth Model: auxin → proton pump → wall loosening → expansion

def cell_growth_rate(auxin_conc, cell_type='stem'):
    """Growth rate as function of auxin concentration.
    Different tissues respond differently."""
    if cell_type == 'root':
        # Roots: optimal at LOW auxin, inhibited at high
        optimal = 0.1  # mg/L
        return 2.0 * np.exp(-((np.log(auxin_conc/optimal))**2) / 2)
    elif cell_type == 'stem':
        # Stems: optimal at MEDIUM auxin
        optimal = 1.0
        return 3.0 * np.exp(-((np.log(auxin_conc/optimal))**2) / 3)
    else:  # bud
        # Buds: suppressed by auxin (apical dominance)
        return 1.0 / (1 + auxin_conc / 0.5)

# Scan auxin concentrations
concentrations = np.logspace(-3, 2, 50)  # 0.001 to 100 mg/L

print("Auxin Dose-Response Curves")
print("=" * 55)
print(f"{'[Auxin] mg/L':>14} | {'Root':>8} | {'Stem':>8} | {'Bud':>8}")
print("-" * 55)

for conc in [0.001, 0.01, 0.1, 1.0, 5.0, 10.0, 50.0, 100.0]:
    root = cell_growth_rate(conc, 'root')
    stem = cell_growth_rate(conc, 'stem')
    bud = cell_growth_rate(conc, 'bud')
    print(f"{conc:>14.3f} | {root:>8.2f} | {stem:>8.2f} | {bud:>8.2f}")

print()
print("Key insights:")
print("  Roots grow best at LOW auxin (0.1 mg/L)")
print("  Stems grow best at MEDIUM auxin (1.0 mg/L)")
print("  Buds are SUPPRESSED by auxin (apical dominance)")
print("  Too much auxin KILLS the plant (herbicide principle)")`,
      challenge: 'Model phototropism: create a 2D grid of cells where auxin flows toward the shaded side. Track differential elongation over 24 hours and calculate the bending angle.',
      successHint: 'Auxin is arguably the most important molecule in plant biology. It controls how plants grow, bend, branch, and root — and it is the molecular foundation of every cloning technique from ancient cuttings to modern tissue culture.',
    },
    {
      title: 'Cytokinin — the shoot-promoting counterpart',
      concept: `While auxin promotes roots, **cytokinin** promotes shoots. Together, they form a hormone balance system that controls plant architecture:

**What cytokinins do:**
1. **Promote cell division** (cytokinesis — that is where the name comes from)
2. **Promote shoot growth**: high cytokinin triggers bud growth and leaf expansion
3. **Delay senescence**: cytokinins keep leaves green and photosynthetically active
4. **Break apical dominance**: cytokinin applied to a side bud overrides auxin suppression

**The auxin:cytokinin ratio is the master switch:**
- High auxin / low cytokinin → ROOT formation
- Low auxin / high cytokinin → SHOOT formation
- Equal ratio → CALLUS (undifferentiated cell mass)

This ratio was discovered by **Folke Skoog and Carlos Miller** in 1957. Their experiments with tobacco tissue culture showed that by simply changing the ratio of these two hormones in the growth medium, they could direct plant tissue to become anything: roots, shoots, or an undifferentiated blob.

This discovery is the foundation of ALL modern plant tissue culture:
- Want to propagate orchids? Adjust the ratio.
- Want to create disease-free potato stock? Adjust the ratio.
- Want to clone a rare tree? Adjust the ratio.

Cytokinins are synthesized in root tips and transported upward. Auxin is synthesized in shoot tips and transported downward. The plant body is a gradient of these two hormones, and every cell "reads" the local ratio to decide what to become.`,
      analogy: 'Auxin and cytokinin are like two factions in a parliament. When auxin has the majority (high ratio), policy favours roots. When cytokinin has the majority, policy favours shoots. When they are balanced, there is gridlock — a callus that cannot decide what to become. The plant\'s growth pattern is determined by which faction dominates in each region.',
      storyConnection: 'Modern tissue culture labs propagating Bodhi Tree cuttings use the Skoog-Miller principle. A tiny explant is placed on medium with balanced hormones to produce a callus. Then the ratio is shifted — first toward cytokinin (shoots emerge), then toward auxin (roots form). From one small piece of sacred tree, hundreds of genetically identical saplings can be produced for temples worldwide.',
      checkQuestion: 'A farmer notices that when she prunes the top of her mango tree (removing the shoot tip), many side branches suddenly grow. Why?',
      checkAnswer: 'The shoot tip was producing auxin, which suppressed side bud growth (apical dominance). When the tip was removed, auxin supply stopped. The side buds, no longer suppressed, now respond to locally produced cytokinin and begin growing. This is why pruning promotes bushier growth — it removes the source of bud-suppressing auxin.',
      codeIntro: 'Simulate the Skoog-Miller experiment: vary auxin:cytokinin ratios and observe tissue fate.',
      code: `import numpy as np

np.random.seed(42)

# Skoog-Miller Tissue Culture Simulation
# Modeled on the 1957 tobacco pith experiments

class TissueCulture:
    def __init__(self, auxin, cytokinin):
        self.auxin = auxin
        self.cytokinin = cytokinin
        self.cells = {'undifferentiated': 100, 'root': 0, 'shoot': 0}
        self.day = 0

    def step(self):
        """One day of growth."""
        self.day += 1
        ratio = self.auxin / max(self.cytokinin, 0.001)

        # Cell division rate depends on total hormone level
        growth = min(0.15, 0.02 * (self.auxin + self.cytokinin))

        total = sum(self.cells.values())
        new_cells = int(total * growth)

        # Differentiation depends on ratio
        if ratio > 3:
            # Mostly roots
            self.cells['root'] += int(new_cells * 0.7)
            self.cells['undifferentiated'] += int(new_cells * 0.3)
        elif ratio < 0.3:
            # Mostly shoots
            self.cells['shoot'] += int(new_cells * 0.7)
            self.cells['undifferentiated'] += int(new_cells * 0.3)
        else:
            # Callus — undifferentiated growth
            self.cells['undifferentiated'] += new_cells

        return self.cells.copy()

# Run experiments with different ratios
experiments = [
    ("High auxin (10:1)", 10.0, 1.0),
    ("Balanced (1:1)", 1.0, 1.0),
    ("High cytokinin (1:10)", 1.0, 10.0),
    ("No hormones (0:0)", 0.0, 0.0),
]

print("Skoog-Miller Tissue Culture Experiment")
print("=" * 60)

for name, aux, cyt in experiments:
    culture = TissueCulture(aux, cyt)
    for _ in range(30):
        culture.step()

    total = sum(culture.cells.values())
    print(f"\
{name} — Day 30:")
    print(f"  Undifferentiated: {culture.cells['undifferentiated']} ({100*culture.cells['undifferentiated']/total:.0f}%)")
    print(f"  Root cells: {culture.cells['root']} ({100*culture.cells['root']/total:.0f}%)")
    print(f"  Shoot cells: {culture.cells['shoot']} ({100*culture.cells['shoot']/total:.0f}%)")
    print(f"  Total cells: {total}")

print("\
" + "=" * 60)
print("The ratio controls the fate. Same cells, same DNA,")
print("but the hormone environment determines what they become.")`,
      challenge: 'Model a two-stage tissue culture protocol: 15 days at 1:10 (shoots), then switch to 10:1 (roots). This mimics real micropropagation. How many complete plantlets (with both shoots and roots) can you produce from one explant?',
      successHint: 'The auxin:cytokinin ratio is one of the most elegant control systems in biology. By tuning a simple numerical ratio, a plant (or a tissue culture technician) can direct identical cells toward completely different fates.',
    },
    {
      title: 'Grafting mechanics — vascular cambium and compatibility',
      concept: `Grafting is not just "stick two plants together." It is a precise surgical procedure that depends on aligning the **vascular cambium** of the scion and rootstock.

**The vascular cambium** is a thin layer of dividing cells between the bark (phloem) and the wood (xylem). It is the only part of the stem that is actively growing. For a graft to succeed, the cambium layers of scion and rootstock must be in contact.

**Graft union formation:**
1. **Day 1-3**: Wound response. Cells at the cut surfaces produce auxin and ethylene, triggering rapid cell division.
2. **Day 3-7**: **Callus bridge** forms. Undifferentiated cells fill the gap between scion and rootstock.
3. **Day 7-14**: **Vascular differentiation**. Callus cells near existing xylem become new xylem. Callus cells near existing phloem become new phloem.
4. **Day 14-30**: The vascular systems of scion and rootstock connect. Water and nutrients begin flowing between them.
5. **Months 1-6**: The graft union strengthens. New wood and bark grow around the junction.

**Compatibility**: Not all plants can be grafted together. Generally:
- Same species: almost always works (apple on apple)
- Same genus: usually works (lemon on orange — both *Citrus*)
- Same family: rarely works
- Different families: never works

The barrier is **biochemical incompatibility** — the callus bridge forms but the vascular connections fail. The proteins and signaling molecules are too different.`,
      analogy: 'Grafting is like splicing two electrical cables together. For current to flow, you must align the copper wires (cambium), not just the plastic insulation (bark). If the cables use incompatible voltages (different plant families), the connection will short-circuit even if the splice looks perfect.',
      storyConnection: 'While the Bodhi Tree lineage uses cuttings rather than grafts, the same biological principles apply. When a cutting forms roots, wound callus forms at the cut surface (just like a graft union), and new vascular tissue differentiates from that callus. Grafting and rooting cuttings are two variations of the same wound-healing process, both driven by auxin.',
      checkQuestion: 'You graft a lemon scion onto an orange rootstock. The lemon branch produces lemons. The orange rootstock produces oranges on any suckers that sprout. How is this possible — one plant, two different fruits?',
      checkAnswer: 'The scion and rootstock maintain their own genomes. Grafting connects their vascular systems (plumbing) but does NOT mix their DNA. The lemon scion has lemon DNA in every cell, producing lemon fruit. The orange rootstock has orange DNA, producing orange fruit if it sprouts. They are two genetically distinct organisms sharing a vascular system — like conjoined twins with different blood types connected by a shared circulatory system.',
      codeIntro: 'Simulate graft union formation: model callus growth and vascular reconnection over 30 days.',
      code: `import numpy as np

np.random.seed(42)

# Graft Union Formation Model
# Track callus growth, vascular differentiation, and connection

class GraftUnion:
    def __init__(self, cambium_alignment=0.9, compatibility=1.0):
        self.alignment = cambium_alignment  # 0-1: how well cambium is aligned
        self.compatibility = compatibility   # 0-1: biochemical compatibility
        self.callus = 0          # callus cells
        self.xylem_bridge = 0    # connected xylem cells
        self.phloem_bridge = 0   # connected phloem cells
        self.water_flow = 0      # % of normal water flow
        self.day = 0

    def step(self):
        self.day += 1

        # Phase 1 (days 1-7): callus formation
        if self.day <= 7:
            growth_rate = 0.3 * self.alignment * self.compatibility
            self.callus += max(1, int(50 * growth_rate))

        # Phase 2 (days 7-14): vascular differentiation
        elif self.day <= 14:
            diff_rate = 0.1 * self.alignment * self.compatibility
            new_xylem = int(self.callus * diff_rate * 0.5)
            new_phloem = int(self.callus * diff_rate * 0.3)
            self.xylem_bridge += new_xylem
            self.phloem_bridge += new_phloem
            self.callus += max(1, int(20 * self.alignment))

        # Phase 3 (days 14+): maturation and flow
        else:
            self.xylem_bridge += int(5 * self.compatibility)
            self.phloem_bridge += int(3 * self.compatibility)
            # Water flow based on xylem bridge size
            max_xylem = 200
            self.water_flow = min(100, 100 * self.xylem_bridge / max_xylem)

# Compare scenarios
scenarios = [
    ("Perfect graft (same species)", 0.95, 1.0),
    ("Good graft (same genus)", 0.8, 0.85),
    ("Poor alignment", 0.3, 1.0),
    ("Incompatible (different family)", 0.9, 0.1),
]

print("Graft Union Formation Simulation")
print("=" * 65)

for name, align, compat in scenarios:
    graft = GraftUnion(align, compat)
    for _ in range(30):
        graft.step()

    print(f"\
{name}")
    print(f"  Cambium alignment: {align:.0%} | Compatibility: {compat:.0%}")
    print(f"  Callus cells: {graft.callus}")
    print(f"  Xylem bridge: {graft.xylem_bridge} cells")
    print(f"  Phloem bridge: {graft.phloem_bridge} cells")
    print(f"  Water flow restored: {graft.water_flow:.0f}%")
    success = "SUCCESS" if graft.water_flow > 50 else "FAILURE"
    print(f"  Outcome: {success}")

print("\
Alignment AND compatibility both matter.")
print("A perfect cut on incompatible species still fails.")`,
      challenge: 'Model the "scion wilting" problem: before the xylem bridge connects, the scion loses water through transpiration. Calculate how many days a scion can survive on stored water alone, and how this constrains the maximum compatible graft distance.',
      successHint: 'Grafting is living surgery — joining two vascular systems through wound healing. Understanding the mechanics explains why some grafts succeed and others fail, and why alignment, compatibility, and timing all matter.',
    },
    {
      title: 'Micropropagation protocol — from explant to 10,000 clones',
      concept: `Modern micropropagation (tissue culture cloning) follows a precise protocol:

**Stage 0 — Mother plant selection**: Choose the healthiest, most desirable individual. For the Bodhi Tree, this would be a well-documented clone with verified lineage.

**Stage 1 — Initiation**: Cut a small explant (shoot tip, leaf, or node). Sterilize it in ethanol and bleach to kill surface microbes. Place on MS medium (Murashige-Skoog, 1962) — a nutrient gel containing sugars, vitamins, minerals, and hormones.

**Stage 2 — Multiplication**: The explant produces multiple shoots. Each shoot is cut and placed on fresh medium. This is repeated every 4-6 weeks. Multiplication is exponential:
- Month 1: 1 explant → 5 shoots
- Month 2: 5 → 25
- Month 3: 25 → 125
- Month 6: → 15,625
- Month 12: → ~244 million (theoretical)

**Stage 3 — Rooting**: Transfer shoots to medium with high auxin and low cytokinin. Roots form in 2-4 weeks.

**Stage 4 — Acclimatization**: Move plantlets from sterile lab to greenhouse. Gradually reduce humidity. This is the highest-mortality step — 10-30% of plantlets die.

This technique produces banana saplings, orchids, oil palm, date palm, and forest trees at industrial scale. A single lab can produce millions of clones per year.`,
      analogy: 'Micropropagation is like a biological 3D printer. The explant is the digital file. The nutrient medium is the printing material. The hormones are the print settings. And instead of printing one copy at a time, each copy can be used to print five more copies. Exponential reproduction.',
      storyConnection: 'If a Bodhi Tree needs to be replanted at a new temple, modern tissue culture is far more reliable than carrying a cutting across an ocean (as Sanghamitta did). A lab in Sri Lanka could take one shoot tip from the Sri Maha Bodhi and produce 10,000 genetically identical saplings in under a year — all carrying the same DNA as the tree of 528 BCE.',
      checkQuestion: 'A tissue culture lab contaminates one batch of plantlets with a fungus. If all plantlets are genetically identical, what is the risk?',
      checkAnswer: 'If the fungus exploits a genetic vulnerability (a missing resistance gene), then ALL plantlets in ALL batches are equally vulnerable — not just the contaminated batch. This is the clonal crop vulnerability problem again. In practice, tissue culture labs use rigorous sterile technique to prevent contamination, but the genetic vulnerability remains inherent to any clonal population.',
      codeIntro: 'Model the micropropagation pipeline and calculate production capacity.',
      code: `import numpy as np

np.random.seed(42)

# Micropropagation Pipeline Model

class MicropropagationLab:
    def __init__(self, multiplication_rate=5, cycle_weeks=4):
        self.mult_rate = multiplication_rate  # shoots per explant per cycle
        self.cycle_weeks = cycle_weeks
        self.shoots = 1  # start with 1 explant
        self.rooted = 0
        self.acclimatized = 0
        self.week = 0
        self.history = []

    def run_week(self):
        self.week += 1

        # Multiplication (every cycle_weeks)
        if self.week % self.cycle_weeks == 0:
            new_shoots = int(self.shoots * self.mult_rate)
            # Transfer 20% to rooting, keep 80% multiplying
            to_rooting = int(new_shoots * 0.2)
            self.shoots = new_shoots - to_rooting

            # Rooting takes 3 weeks, 85% success
            rooted_success = int(to_rooting * 0.85)
            self.rooted += rooted_success

        # Acclimatization: rooted plants take 4 weeks, 80% survive
        if self.week % 4 == 0 and self.rooted > 0:
            batch = min(self.rooted, int(self.rooted * 0.5))
            survived = int(batch * 0.80)
            self.rooted -= batch
            self.acclimatized += survived

        self.history.append({
            'week': self.week,
            'multiplying': self.shoots,
            'rooting': self.rooted,
            'ready': self.acclimatized,
        })

# Run for 1 year
lab = MicropropagationLab(multiplication_rate=5, cycle_weeks=4)
for _ in range(52):
    lab.run_week()

print("Micropropagation Lab — 1 Year Production")
print("=" * 55)
print(f"Starting material: 1 explant")
print(f"Multiplication rate: {lab.mult_rate}x every {lab.cycle_weeks} weeks")
print()

# Show quarterly snapshots
for entry in lab.history:
    if entry['week'] in [4, 12, 24, 36, 52]:
        print(f"Week {entry['week']:>2}: "
              f"Multiplying: {entry['multiplying']:>10,} | "
              f"Rooting: {entry['rooting']:>8,} | "
              f"Ready: {entry['ready']:>8,}")

print()
print(f"Final count after 52 weeks:")
print(f"  Plantlets ready for planting: {lab.acclimatized:,}")
print(f"  Still multiplying: {lab.shoots:,}")
print(f"  In rooting stage: {lab.rooted:,}")
print()
print("From 1 tiny explant to thousands of clones in one year.")
print("Industrial micropropagation powers global agriculture.")`,
      challenge: 'Model contamination risk: each week, there is a 1% chance a culture gets contaminated, destroying that batch. How does this affect annual production? What if you split cultures across multiple isolated rooms?',
      successHint: 'Micropropagation is one of the most powerful biotechnologies in agriculture. It combines ancient cloning knowledge with modern sterile technique and hormone science to produce millions of identical plants from a single parent.',
    },
    {
      title: 'Somaclonal variation — when clones are not quite identical',
      concept: `In theory, all tissue culture clones should be genetically identical. In practice, they are not always. **Somaclonal variation** refers to genetic and epigenetic changes that arise during tissue culture.

Causes:
1. **Somatic mutations**: DNA copying errors during rapid cell division (more divisions = more chances for error)
2. **Chromosome rearrangements**: abnormal cell divisions can duplicate, delete, or rearrange chromosomes
3. **Transposon activation**: "jumping genes" that move around the genome, disrupting genes where they land
4. **Epigenetic changes**: chemical modifications to DNA (methylation) that alter gene expression without changing the DNA sequence
5. **Polyploidy**: some cells double their entire chromosome set, becoming tetraploid or hexaploid

Rate: typically 1-5% of tissue culture plants show detectable variation. The rate increases with:
- Number of subculture cycles (more divisions = more mutations)
- Time spent as callus (undifferentiated cells are more mutation-prone)
- Use of 2,4-D (a synthetic auxin that increases mutation rates)

For agriculture: somaclonal variation is sometimes a problem (off-type plants in a supposedly uniform batch) and sometimes an opportunity (a random mutation might improve disease resistance).

For the Bodhi Tree: tissue culture introduces more variation than traditional cuttings. For a sacred tree where genetic identity matters, fewer subcultures and minimal callus phase are preferred.`,
      analogy: 'Somaclonal variation is like photocopying a photocopy of a photocopy. Each generation introduces a tiny bit of noise — a slightly darker line here, a missing pixel there. After enough copies, the image is visibly degraded. The original (traditional cutting) is always cleaner than the copy of a copy (extended tissue culture).',
      storyConnection: 'The Bodhi Tree cuttings passed from monk to monk over 2,300 years accumulated very few mutations because each was a single cutting — one "photocopy." If the lineage had instead gone through hundreds of tissue culture cycles, somaclonal variation would have introduced many more changes. The monks\' simple method was, unintentionally, more genetically faithful than modern lab techniques.',
      checkQuestion: 'A tissue culture lab produces 10,000 banana plantlets. 300 show abnormal leaf shape. What happened, and what should the lab do?',
      checkAnswer: 'The 300 abnormal plants are somaclonal variants — mutations or epigenetic changes that arose during the culture process. The lab should: (1) discard the abnormal plantlets, (2) reduce the number of subculture cycles (fewer cell divisions = fewer mutations), (3) minimize time in the callus phase, and (4) use shoot tip culture instead of callus-based methods, since shoot tips have fewer pre-existing mutations.',
      codeIntro: 'Model somaclonal variation accumulation across multiple subculture generations.',
      code: `import numpy as np

np.random.seed(42)

# Somaclonal Variation Model
# Track mutation accumulation over subculture generations

genome_size = 530_000_000  # Ficus religiosa
mutation_rate_per_division = 5e-10  # per base per division
divisions_per_subculture = 100  # rapid division during multiplication
transposon_activation_rate = 0.001  # per subculture cycle

def run_subcultures(n_cycles, n_plants=1000):
    """Run n subculture cycles, track variation."""
    mutations_per_plant = np.zeros(n_plants)
    transposon_events = np.zeros(n_plants)

    for cycle in range(n_cycles):
        # Somatic mutations
        new_mutations = np.random.poisson(
            genome_size * mutation_rate_per_division * divisions_per_subculture,
            n_plants
        )
        mutations_per_plant += new_mutations

        # Transposon activation
        activated = np.random.random(n_plants) < transposon_activation_rate
        transposon_events += activated

    return mutations_per_plant, transposon_events

print("Somaclonal Variation vs Subculture Cycles")
print("=" * 55)

for cycles in [1, 5, 10, 20, 50]:
    mutations, transposons = run_subcultures(cycles)

    variant_threshold = 50  # mutations above this = detectable variant
    n_variants = np.sum(mutations > variant_threshold)
    variant_rate = n_variants / 1000 * 100

    print(f"\
After {cycles} subculture cycles:")
    print(f"  Mean mutations per plant: {np.mean(mutations):.1f}")
    print(f"  Max mutations: {np.max(mutations):.0f}")
    print(f"  Plants with transposon events: {np.sum(transposons > 0)}")
    print(f"  Detectable variants (>{variant_threshold} mutations): "
          f"{n_variants} ({variant_rate:.1f}%)")

print("\
" + "=" * 55)
print("Traditional cutting: ~1 cell division event, minimal variation")
print("5 subculture cycles: low variation, acceptable for most uses")
print("50 subculture cycles: significant variation, risky for sacred trees")
print("\
For the Bodhi Tree: fewer cycles = more faithful clone.")`,
      challenge: 'Model a "variant detection" system: after each subculture, a random sample of 10 plants is genotyped. If any variant is detected, the whole batch is discarded. How does this quality control affect overall production rate and final variant rate?',
      successHint: 'Somaclonal variation is the price of rapid multiplication. For commercial crops, it is manageable. For sacred trees where identity matters, traditional cuttings may be preferable to high-throughput tissue culture.',
    },
    {
      title: 'Epigenetics — same DNA, different expression',
      concept: `Two trees can have identical DNA but look different. How? Through **epigenetics** — chemical modifications that control which genes are switched on or off without changing the DNA sequence itself.

**Key epigenetic mechanisms:**
1. **DNA methylation**: adding a methyl group (-CH3) to cytosine bases. Methylated genes are usually switched OFF.
2. **Histone modification**: DNA wraps around proteins called histones. Chemical tags on histones can tighten or loosen the wrapping, making genes more or less accessible.
3. **Small RNAs**: short RNA molecules that silence specific genes by blocking their messenger RNA.

**Why this matters for clones:**
- Two Bodhi Tree clones in different climates will develop different epigenetic patterns
- A tree in hot, dry Bodh Gaya will methylate different genes than one in cool, wet Sri Lanka
- The DNA is identical, but the gene *expression* differs — leading to different growth patterns, stress responses, and even leaf shapes
- This is why clones grown in different environments can look noticeably different despite being genetically identical

**Epigenetic inheritance**: Some epigenetic marks are passed to daughter cells during mitosis. This means a cutting taken from a stressed tree may "remember" the stress even after being planted in ideal conditions — the stress-response genes remain methylated.

This has profound implications for conservation cloning: the genetic sequence is preserved, but the epigenetic "settings" depend on the environment.`,
      analogy: 'If DNA is a piano, epigenetics is the pianist. Two identical pianos (same DNA) played by different pianists (different epigenetic patterns) will produce different music (different traits). The pianos are identical, but the performances are not. Environment shapes the pianist — a tree growing in drought "learns" to play different genes than one growing in rain.',
      storyConnection: 'The Sri Maha Bodhi in Sri Lanka and the Bodhi Tree in Bodh Gaya share the same DNA, but they have grown in different climates for over 2,000 years. The Sri Lankan tree experiences monsoon rains; the Indian tree faces hot, dry summers. Their epigenetic patterns have diverged — the same genome, expressed differently. They are genetically identical but epigenetically distinct.',
      checkQuestion: 'If you take two cuttings from the same tree, plant one in a desert and one in a rainforest, then take cuttings from THOSE trees and plant them together in the same garden — will the third-generation clones look the same?',
      checkAnswer: 'Mostly yes, but not entirely. Some epigenetic marks from the desert/rainforest environments will persist in the cuttings (epigenetic inheritance). However, over multiple generations of growth in the same garden, most environment-induced epigenetic marks will reset. The DNA is identical, and given enough time in the same environment, the epigenetic profiles will converge. This is different from genetic mutations, which are permanent.',
      codeIntro: 'Model how identical genomes express differently under environmental stress — the epigenetic divergence of clones.',
      code: `import numpy as np

np.random.seed(42)

# Epigenetic Divergence Model
# Same genome, different environments → different gene expression

n_genes = 100  # simplified genome: 100 genes
n_years = 100

class EpigeneticTree:
    def __init__(self, name, environment):
        self.name = name
        self.env = environment  # dict of stress factors
        # Methylation state: 0 = unmethylated (active), 1 = methylated (silenced)
        self.methylation = np.zeros(n_genes)
        # Gene categories
        self.drought_genes = list(range(0, 20))    # genes 0-19
        self.cold_genes = list(range(20, 40))       # genes 20-39
        self.growth_genes = list(range(40, 70))     # genes 40-69
        self.defense_genes = list(range(70, 100))   # genes 70-99

    def adapt_year(self):
        """Epigenetic adaptation to environment."""
        # Drought stress → activate drought genes, silence growth
        if self.env.get('drought', 0) > 0.5:
            for g in self.drought_genes:
                self.methylation[g] = max(0, self.methylation[g] - 0.1)  # unmethylate
            for g in self.growth_genes[:10]:
                self.methylation[g] = min(1, self.methylation[g] + 0.05)  # methylate

        # Cold stress → activate cold genes
        if self.env.get('cold', 0) > 0.5:
            for g in self.cold_genes:
                self.methylation[g] = max(0, self.methylation[g] - 0.1)

        # Random drift
        noise = np.random.normal(0, 0.01, n_genes)
        self.methylation = np.clip(self.methylation + noise, 0, 1)

    def expression_profile(self):
        """Active genes (not methylated)."""
        return np.sum(self.methylation < 0.5)

# Two clones in different environments
bodh_gaya = EpigeneticTree("Bodh Gaya (hot, dry)", {'drought': 0.7, 'cold': 0.1})
sri_lanka = EpigeneticTree("Sri Lanka (wet, warm)", {'drought': 0.2, 'cold': 0.1})

print("Epigenetic Divergence of Bodhi Tree Clones")
print("=" * 55)
print("Same DNA. Different environments. Different gene expression.\
")

for year in range(n_years):
    bodh_gaya.adapt_year()
    sri_lanka.adapt_year()

    if year in [0, 9, 24, 49, 99]:
        diff = np.sum(np.abs(bodh_gaya.methylation - sri_lanka.methylation) > 0.3)
        print(f"Year {year+1:>3}:")
        print(f"  Bodh Gaya active genes: {bodh_gaya.expression_profile()}/100")
        print(f"  Sri Lanka active genes: {sri_lanka.expression_profile()}/100")
        print(f"  Differentially expressed: {diff} genes")
        print()

print("The DNA is identical. The expression is not.")
print("Same genome, different epigenetic 'settings.'")
print("This is why environment-adapted clones look different.")`,
      challenge: 'Take a "cutting" from the Bodh Gaya tree (copy its methylation pattern) and grow it in the Sri Lanka environment. How many years until its epigenetic profile converges with the Sri Lanka tree?',
      successHint: 'Epigenetics reveals that "genetically identical" does not mean "biologically identical." The genome is the hardware; epigenetics is the software configuration. Two identical computers running different software behave differently. This distinction is crucial for understanding why clones in different environments can look and behave differently.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold">
          <FlaskConical className="w-4 h-4" /> Level 2: Practitioner
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Grafting, tissue culture, and plant hormones</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for plant biology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><FlaskConical className="w-5 h-5" />Load Python</>)}
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
            />
        ))}
      </div>
    </div>
  );
}
