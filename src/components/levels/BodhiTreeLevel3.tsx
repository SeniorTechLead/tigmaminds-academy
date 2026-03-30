import { useState, useRef, useCallback } from 'react';
import { Loader2, Dna } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BodhiTreeLevel3() {
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
      title: 'The CRISPR mechanism — bacterial immune systems repurposed',
      concept: `CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) was not invented by humans. It is a **bacterial immune system** that scientists learned to repurpose.

**How bacteria use CRISPR:**
1. A virus (bacteriophage) injects its DNA into a bacterium
2. If the bacterium survives, it stores a snippet of the viral DNA in its own genome — between palindromic repeat sequences (the "CRISPR" array)
3. Next time the same virus attacks, the bacterium transcribes the stored snippet into a **guide RNA**
4. The guide RNA + **Cas9 protein** patrol the cell. When the guide RNA finds a matching DNA sequence (the virus), Cas9 cuts the viral DNA, destroying it

**How scientists repurposed it:**
- Doudna and Charpentier (2012) showed that the guide RNA can be designed to match ANY DNA sequence, not just viral DNA
- Provide a custom guide RNA → Cas9 will cut any gene you specify
- After cutting, the cell tries to repair the break. Scientists can:
  - Let the repair be sloppy → gene is disabled (**knockout**)
  - Provide a DNA template → gene is replaced (**knock-in**)

**Precision**: CRISPR can target a specific 20-letter DNA sequence out of billions. It is not perfect — **off-target cuts** at similar sequences are a known problem — but it is far more precise than any previous gene-editing tool.

**Nobel Prize 2020**: Doudna and Charpentier shared the Nobel Prize in Chemistry for this work.`,
      analogy: 'CRISPR is like a GPS-guided scissors system. The guide RNA is the GPS coordinates — it specifies exactly where to go in the genome. Cas9 is the scissors — it cuts whatever DNA the guide RNA targets. Scientists program new GPS coordinates (custom guide RNA) to navigate to any gene they want to edit.',
      storyConnection: 'CRISPR could be used to study the Bodhi Tree genome: which genes give it drought resistance? Which control its distinctive heart-shaped leaves? By knocking out specific genes in tissue-cultured clones, scientists could map the function of every gene — understanding what makes a Bodhi Tree a Bodhi Tree, down to the molecular level.',
      checkQuestion: 'CRISPR evolved in bacteria to fight viruses. Why is this an example of evolution producing something useful that humans then repurposed?',
      checkAnswer: 'Bacteria and viruses have been locked in an evolutionary arms race for billions of years. CRISPR evolved as a highly specific, programmable defense system — traits that make it valuable for gene editing. Humans did not "invent" CRISPR; they discovered a natural system and learned to redirect it. This is a common pattern in biotechnology: PCR came from heat-loving bacteria, restriction enzymes from bacterial defense, and now CRISPR from bacterial immunity.',
      codeIntro: 'Simulate the CRISPR-Cas9 mechanism: guide RNA matching, Cas9 cutting, and repair outcomes.',
      code: `import numpy as np
import random

random.seed(42)
np.random.seed(42)

# CRISPR-Cas9 Simulation

def generate_genome(length=1000):
    """Generate a random DNA sequence."""
    return ''.join(random.choice('ATGC') for _ in range(length))

def find_target(genome, guide_rna):
    """Find where the guide RNA matches in the genome."""
    matches = []
    for i in range(len(genome) - len(guide_rna)):
        mismatches = sum(g != t for g, t in zip(guide_rna, genome[i:i+len(guide_rna)]))
        if mismatches <= 2:  # allow up to 2 mismatches (off-target risk)
            matches.append((i, mismatches))
    return matches

def crispr_cut(genome, position, repair='NHEJ'):
    """Cut genome at position and repair."""
    if repair == 'NHEJ':
        # Non-homologous end joining: sloppy, often deletes bases
        deletion_size = random.randint(1, 10)
        new_genome = genome[:position] + genome[position + deletion_size:]
        return new_genome, f"Deleted {deletion_size} bases (gene knockout)"
    elif repair == 'HDR':
        # Homology-directed repair: precise, uses template
        template = 'AATTCCGGAA'  # replacement sequence
        new_genome = genome[:position] + template + genome[position + len(template):]
        return new_genome, f"Inserted template (gene knock-in)"
    return genome, "No change"

# Generate a genome and target a specific gene
genome = generate_genome(500)
target_gene_start = 200
target_gene = genome[target_gene_start:target_gene_start + 20]

print("CRISPR-Cas9 Gene Editing Simulation")
print("=" * 55)
print(f"Genome length: {len(genome)} bp")
print(f"Target gene sequence: {target_gene}")
print(f"Target position: {target_gene_start}")
print()

# Design guide RNA (complement of target)
guide_rna = target_gene
print(f"Guide RNA designed: {guide_rna}")

# Find all matches (including off-target)
matches = find_target(genome, guide_rna)
print(f"\\nMatches found: {len(matches)}")
for pos, mm in matches:
    target_type = "ON-TARGET" if mm == 0 else f"OFF-TARGET ({mm} mismatches)"
    print(f"  Position {pos}: {target_type}")

# Perform the cut
print("\\n--- Performing CRISPR cut ---")
edited, result = crispr_cut(genome, target_gene_start, 'NHEJ')
print(f"  Repair type: NHEJ (non-homologous end joining)")
print(f"  Result: {result}")
print(f"  New genome length: {len(edited)} bp")

print("\\n--- With HDR template ---")
edited2, result2 = crispr_cut(genome, target_gene_start, 'HDR')
print(f"  Repair type: HDR (homology-directed repair)")
print(f"  Result: {result2}")

print("\\nCRISPR can disable a gene (NHEJ) or replace it (HDR).")
print("Off-target cuts are the main safety concern.")`,
      challenge: 'Design a CRISPR experiment to make the Bodhi Tree resistant to a specific fungal disease. Define the target gene (a susceptibility gene), design the guide RNA, and simulate the editing. What off-target risks must you check?',
      successHint: 'CRISPR is the most powerful gene-editing tool ever discovered. Understanding its mechanism — guide RNA targeting, Cas9 cutting, cellular repair — is essential for anyone working in modern biology or agriculture.',
    },
    {
      title: 'Somatic cell nuclear transfer — how Dolly was cloned',
      concept: `While plant cloning is as simple as taking a cutting, animal cloning requires **somatic cell nuclear transfer (SCNT)** — one of the most technically demanding procedures in biology.

**The Dolly protocol (1996):**
1. Take an **egg cell** from sheep A. Remove its nucleus (contains sheep A's DNA). This is now an **enucleated egg** — a cell with all the machinery to build an organism, but no blueprint.
2. Take a **mammary gland cell** from sheep B (the sheep to be cloned). Extract its nucleus.
3. Insert sheep B's nucleus into the enucleated egg.
4. Apply an electric pulse to fuse the nucleus with the egg cytoplasm and trigger cell division.
5. The egg begins dividing as if it were a fertilized embryo, using sheep B's DNA.
6. Implant the developing embryo into a surrogate mother (sheep C).
7. Wait. Pray.

**Why it is so hard:**
- The adult cell's DNA has been **epigenetically silenced** — many genes are turned off. The egg must "reprogram" the DNA to an embryonic state.
- Reprogramming is incomplete. Dolly showed signs of premature aging.
- Success rate: 277 attempts → 29 embryos → 1 live lamb (Dolly)
- Dolly died at age 6 (sheep normally live to 11-12) from lung disease and arthritis

**Contrast with plant cloning:**
- Plant cells are totipotent — no reprogramming needed
- A cutting just grows. No egg cell, no nuclear transfer, no surrogate
- Success rate: >90% for most species
- This is why plant cloning is 10,000 years old and animal cloning is 30 years old`,
      analogy: 'SCNT is like trying to install a used hard drive into a brand-new computer. The hard drive (adult cell nucleus) contains the right data, but it has been configured for a specific role (mammary gland cell). The new computer (enucleated egg) needs to reformat the drive to factory settings. Reformatting usually fails or is incomplete — which is why cloned animals often have health problems.',
      storyConnection: 'The contrast between plant and animal cloning illuminates why the Bodhi Tree lineage exists. If Ficus religiosa were an animal, cloning it would require extracting nuclei, enucleating eggs, electric pulses, and surrogate mothers — with a 0.36% success rate. Instead, Sanghamitta simply cut a branch, wrapped it in cloth, and sailed to Sri Lanka. Plant biology made the sacred lineage possible.',
      checkQuestion: 'If Dolly was cloned from a mammary gland cell from an adult sheep, was Dolly born "old"? Did she start life with 6-year-old DNA?',
      checkAnswer: 'The DNA sequence was the same as the 6-year-old donor sheep, but the cell was supposed to be reprogrammed to an embryonic state. In practice, reprogramming was incomplete. Dolly\'s telomeres (chromosome end-caps that shorten with age) were shorter than expected for a newborn, suggesting her cells were "older" than her chronological age. This contributed to her premature aging. The hard drive was reformatted, but some old data remained.',
      codeIntro: 'Simulate SCNT: model the reprogramming challenge and why success rates are so low.',
      code: `import numpy as np

np.random.seed(42)

# Somatic Cell Nuclear Transfer Simulation

class SCNTAttempt:
    def __init__(self):
        self.n_genes = 1000
        # Adult cell: many genes epigenetically silenced
        self.silenced = np.random.random(self.n_genes) < 0.7  # 70% silenced
        # For embryonic development, we need most genes active
        self.required_active = np.random.random(self.n_genes) > 0.3  # 70% need to be active

    def reprogram(self):
        """Attempt to reprogram adult DNA to embryonic state."""
        # Each silenced gene has a chance of being reactivated
        reactivation_prob = 0.6  # 60% chance per gene

        reprogrammed = self.silenced.copy()
        for i in range(self.n_genes):
            if self.silenced[i] and np.random.random() < reactivation_prob:
                reprogrammed[i] = False  # reactivated

        return reprogrammed

    def viable(self, reprogrammed):
        """Check if reprogramming is sufficient for development."""
        # A gene is problematic if it's required active but still silenced
        problems = np.sum(reprogrammed & self.required_active)
        # Need <5% problematic genes for viability
        return problems < 0.05 * self.n_genes, problems

# Run 277 attempts (same as Dolly experiment)
n_attempts = 277
results = {'failed_reprogram': 0, 'failed_develop': 0, 'born_unhealthy': 0, 'born_healthy': 0}

for attempt in range(n_attempts):
    scnt = SCNTAttempt()
    reprogrammed = scnt.reprogram()
    viable, n_problems = scnt.viable(reprogrammed)

    if not viable and n_problems > 100:
        results['failed_reprogram'] += 1
    elif not viable:
        results['failed_develop'] += 1
    elif n_problems > 20:
        results['born_unhealthy'] += 1
    else:
        results['born_healthy'] += 1

print("Somatic Cell Nuclear Transfer — 277 Attempts")
print("=" * 50)
print(f"  Failed at reprogramming: {results['failed_reprogram']}")
print(f"  Failed during development: {results['failed_develop']}")
print(f"  Born but unhealthy: {results['born_unhealthy']}")
print(f"  Born healthy: {results['born_healthy']}")
print(f"  Success rate: {results['born_healthy']/n_attempts:.1%}")
print()

# Compare with plant cloning
plant_attempts = 277
plant_success = int(plant_attempts * 0.90)
print(f"Plant cloning (same 277 attempts): {plant_success} successes ({plant_success/plant_attempts:.0%})")
print()
print("The difference: plant cells are totipotent.")
print("Animal cells must be reprogrammed — and reprogramming usually fails.")`,
      challenge: 'Model how improving reprogramming efficiency (from 60% to 80%, 90%, 99%) affects the SCNT success rate. At what reprogramming efficiency would animal cloning become as reliable as plant cloning?',
      successHint: 'SCNT demonstrates the fundamental difference between plant and animal biology: totipotency vs specialization. Plants kept the ability to reset their cells; animals traded it for more complex development. Both strategies have evolutionary logic.',
    },
    {
      title: 'Gene drives — editing entire wild populations',
      concept: `Standard CRISPR edits one organism at a time. A **gene drive** edits an entire wild population by forcing a gene to spread faster than normal inheritance.

**How normal inheritance works:**
- A gene has a 50% chance of being passed to each offspring (Mendelian inheritance)
- A new gene takes many generations to spread through a population
- Harmful genes are weeded out by natural selection

**How a gene drive works:**
1. Insert a CRISPR system (guide RNA + Cas9) INTO the organism's genome
2. When the organism reproduces, the CRISPR system in the edited chromosome EDITS the matching chromosome from the other parent
3. Result: instead of 50% inheritance, the gene drive achieves ~99% inheritance
4. Within 10-20 generations, the engineered gene spreads through the entire population

**Applications under research:**
- **Malaria eradication**: gene drive to make mosquitoes unable to carry the malaria parasite
- **Invasive species control**: gene drive to reduce fertility of invasive rodents on islands
- **Agricultural pest management**: gene drive to reduce crop pest populations

**The terrifying risk:**
- Once released, a gene drive CANNOT be recalled
- If it spreads to unintended species or has unforeseen effects, there is no undo button
- A gene drive targeting mosquitoes could collapse the entire species — removing a food source for birds, bats, fish, and amphibians
- This is the ultimate "should we?" question in genetics`,
      analogy: 'Normal inheritance is like a rumour spreading through a town — each person tells one of their two friends (50% spread). A gene drive is like hacking the town loudspeaker — the message reaches everyone within a few rounds, whether they want to hear it or not. And once broadcast, the message cannot be unbroadcast.',
      storyConnection: 'The Bodhi Tree lineage shows how humans have carefully stewarded genetic identity for 2,300 years. Gene drives represent the opposite philosophy: changing genetic identity across an entire wild population in a few generations. One is preservation; the other is transformation. Both require profound responsibility.',
      checkQuestion: 'Scientists propose a gene drive to eliminate mosquitoes that carry dengue fever. What are two arguments for and two arguments against?',
      checkAnswer: 'FOR: (1) Dengue kills 40,000 people per year — eliminating the vector saves lives. (2) Only a few mosquito species carry dengue; other species would fill the ecological niche. AGAINST: (1) Ecological consequences are unpredictable — removing a species cascades through food webs. (2) Gene drives cannot be recalled — if something goes wrong, there is no fix. Additionally: the gene could spread to related species through hybridization, and different countries might disagree about releasing a gene drive near their borders.',
      codeIntro: 'Model gene drive spread through a population compared to normal Mendelian inheritance.',
      code: `import numpy as np

np.random.seed(42)

# Gene Drive Population Model

def simulate_spread(n_generations, pop_size, initial_freq, drive=False):
    """Simulate gene spread through a population."""
    freq = initial_freq
    history = [freq]

    for gen in range(n_generations):
        if drive:
            # Gene drive: ~99% inheritance instead of 50%
            conversion_rate = 0.99
            # Frequency change with gene drive
            # Heterozygotes convert wild-type allele to drive allele
            heterozygotes = 2 * freq * (1 - freq)
            converted = heterozygotes * conversion_rate * 0.5
            freq = freq + converted
            # Add slight fitness cost
            freq *= 0.98  # 2% fitness cost
        else:
            # Normal Mendelian: neutral allele, random drift
            # With slight selective advantage (1%)
            fitness_advantage = 1.01
            freq = freq * fitness_advantage / (freq * fitness_advantage + (1 - freq))
            # Drift
            freq += np.random.normal(0, 0.01)

        freq = np.clip(freq, 0, 1)
        history.append(freq)

    return history

pop_size = 10000
initial_freq = 0.01  # 1% of population carries the gene
n_gen = 50

# Normal inheritance
normal = simulate_spread(n_gen, pop_size, initial_freq, drive=False)

# Gene drive
drive = simulate_spread(n_gen, pop_size, initial_freq, drive=True)

print("Gene Spread: Normal vs Gene Drive")
print("=" * 55)
print(f"Population: {pop_size:,} | Starting frequency: {initial_freq:.0%}")
print()
print(f"{'Generation':>12} | {'Normal':>10} | {'Gene Drive':>12}")
print("-" * 40)

for gen in [0, 5, 10, 15, 20, 30, 50]:
    if gen < len(normal):
        print(f"{gen:>12} | {normal[gen]:>10.1%} | {drive[gen]:>12.1%}")

print()
normal_50 = normal[50] if len(normal) > 50 else normal[-1]
drive_50 = drive[50] if len(drive) > 50 else drive[-1]
print(f"After 50 generations:")
print(f"  Normal inheritance: {normal_50:.1%} of population")
print(f"  Gene drive: {drive_50:.1%} of population")
print()
print("A gene drive can fix an allele in a wild population")
print("within ~20 generations. There is no precedent for this")
print("power, and no way to undo it once released.")`,
      challenge: 'Add a "reversal drive" — a second gene drive designed to undo the first. Model whether a reversal drive can rescue a population after the first drive reaches 90% frequency. How many generations does the rescue take?',
      successHint: 'Gene drives represent the most powerful — and most dangerous — application of gene editing. They force us to confront the question the Bodhi Tree story asks: just because we can change the code of life, should we?',
    },
    {
      title: 'Genetic diversity and conservation — the monoculture trap',
      concept: `The Bodhi Tree lineage is a monoculture — one genotype, propagated identically for 2,300 years. This is fine for a sacred tree tended by monks. It is catastrophic when applied to global food production.

**The Great Irish Famine (1845-1852):**
- Ireland's potato crop was almost entirely one variety: the Irish Lumper
- The Irish Lumper was propagated by cuttings — a monoculture of clones
- *Phytophthora infestans* (potato blight) arrived from the Americas
- Because all potatoes were genetically identical, ALL were equally susceptible
- The entire crop failed for multiple years
- ~1 million people died. ~1 million emigrated.

**The Gros Michel banana (1950s):**
- The world's dominant banana: sweet, sturdy, easy to ship
- All Gros Michel bananas were clones
- Panama disease (Fusarium wilt) destroyed the entire global crop
- The industry switched to the Cavendish banana (another clone)
- Now Panama disease TR4 threatens Cavendish — history repeating

**The solution: genetic diversity**
- Maintain **gene banks** with thousands of varieties
- Use **wild relatives** as sources of resistance genes
- Practice **polyculture** (growing multiple varieties together)
- Use CRISPR to introduce resistance genes from wild relatives into commercial clones

**Diversity is insurance**: you cannot predict which disease will strike, but if your population has variation, some individuals will survive.`,
      analogy: 'A monoculture is like an army where every soldier wears the same armour. If an enemy finds a weakness in that armour, the entire army falls. Genetic diversity is like giving every soldier different armour — some will fall, but others will survive because their armour resists the new weapon. You cannot predict the attack, so you diversify the defense.',
      storyConnection: 'The Bodhi Tree monks are genetic conservators — they maintain the original genotype with religious devotion. But the story also warns: if a disease specifically targets Ficus religiosa, every Bodhi Tree clone in the world is equally vulnerable. The solution is not to abandon cloning, but to also preserve seed-grown Ficus religiosa with diverse genetics — a living gene bank alongside the sacred clones.',
      checkQuestion: 'The Svalbard Global Seed Vault in Norway stores seeds from crops worldwide. Why seeds, not cuttings or tissue cultures?',
      checkAnswer: 'Seeds represent GENETIC DIVERSITY — each seed from sexual reproduction carries a unique genome. Storing 10,000 wheat seeds means storing 10,000 different genotypes with 10,000 different combinations of disease resistance, drought tolerance, and other traits. Storing 10,000 cuttings of the same variety stores ONE genotype 10,000 times — no diversity at all. The seed vault\'s purpose is preserving variation, not quantity. One seed with the right resistance gene is worth more than a million clones without it.',
      codeIntro: 'Model how genetic diversity protects populations from disease — the monoculture vulnerability simulation.',
      code: `import numpy as np

np.random.seed(42)

# Monoculture vs Polyculture Disease Simulation

n_plants = 10000
n_resistance_genes = 20  # 20 possible resistance genes
n_diseases = 50  # 50 disease outbreaks over simulation

# Monoculture: all plants identical
mono_resistance = np.random.binomial(1, 0.5, n_resistance_genes)  # random profile
mono_pop = np.tile(mono_resistance, (n_plants, 1))

# Polyculture: each plant has unique resistance profile
poly_pop = np.random.binomial(1, 0.5, (n_plants, n_resistance_genes))

# Wild diversity: high variation, some with rare resistance
wild_pop = np.random.binomial(1, 0.3, (n_plants, n_resistance_genes))

mono_alive = np.ones(n_plants, dtype=bool)
poly_alive = np.ones(n_plants, dtype=bool)
wild_alive = np.ones(n_plants, dtype=bool)

print("Disease Outbreak Simulation: 50 Diseases Over Time")
print("=" * 60)

for disease in range(n_diseases):
    # Each disease targets a specific resistance gene
    target = np.random.randint(0, n_resistance_genes)
    virulence = np.random.uniform(0.3, 0.8)

    for pop, alive in [(mono_pop, mono_alive), (poly_pop, poly_alive), (wild_pop, wild_alive)]:
        for i in range(n_plants):
            if alive[i] and pop[i, target] == 0:  # no resistance
                if np.random.random() < virulence:
                    alive[i] = False

    if disease in [0, 9, 24, 49]:
        print(f"After {disease+1} diseases:")
        print(f"  Monoculture: {mono_alive.sum():>6,} alive ({mono_alive.sum()/100:.1f}%)")
        print(f"  Polyculture: {poly_alive.sum():>6,} alive ({poly_alive.sum()/100:.1f}%)")
        print(f"  Wild diverse: {wild_alive.sum():>6,} alive ({wild_alive.sum()/100:.1f}%)")
        print()

print("Final survival rates:")
print(f"  Monoculture: {mono_alive.sum()/100:.1f}%")
print(f"  Polyculture: {poly_alive.sum()/100:.1f}%")
print(f"  Wild diverse: {wild_alive.sum()/100:.1f}%")
print()
print("Monocultures crash. Diversity survives.")
print("This is the Cavendish banana problem — and the potato famine.")
print("Cloning preserves the best. Diversity insures against the worst.")`,
      challenge: 'Model a "gene bank rescue" scenario: after the monoculture crashes to 10% survival, introduce resistant genes from the wild population via CRISPR. How quickly can the population recover?',
      successHint: 'The tension between cloning (preserving the best) and diversity (insuring against the unknown) is one of the central challenges in agriculture and conservation. The Bodhi Tree lineage embodies both the power of cloning and the risk of monoculture.',
    },
    {
      title: 'Telomeres, aging, and the clonal clock',
      concept: `Each time a cell divides, the **telomeres** — protective caps at the ends of chromosomes — get slightly shorter. When telomeres become critically short, the cell stops dividing and dies. This is one mechanism of aging.

**Telomere biology:**
- Human telomeres start at ~15,000 base pairs at birth
- Each cell division shortens them by ~50-100 base pairs
- When they reach ~5,000 base pairs, the cell enters **senescence** (stops dividing)
- The enzyme **telomerase** can rebuild telomeres, but it is active only in stem cells and cancer cells

**Implications for cloning:**
- Dolly's telomeres were shorter than expected for a newborn, because her DNA came from a 6-year-old adult cell
- This may have contributed to her premature aging
- Plant cells, however, maintain **telomerase activity** throughout life — their telomeres do NOT shorten with age
- This is another reason plant cloning works and animal cloning struggles

**The Bodhi Tree exception:**
- Plant meristems (growth tips) have high telomerase activity
- Cuttings taken from meristematic tissue have full-length telomeres
- This means a cutting from a 2,300-year-old tree is not "old" — its cells are as young as a seedling's
- Plants do not age the way animals do. Their growing tips are perpetually young.

This is the molecular explanation for why some trees can live for thousands of years — and why the Bodhi Tree lineage can persist indefinitely.`,
      analogy: 'Telomeres are like the plastic tips (aglets) on shoelaces. Each time the lace is used, the aglet wears down slightly. Eventually, the lace frays. Human cells are like shoelaces with non-replaceable aglets — they wear out. Plant meristem cells are like shoelaces with self-repairing aglets — they stay fresh no matter how many times they are used.',
      storyConnection: 'When monks take a cutting from the Sri Maha Bodhi, they are not taking a piece of a 2,300-year-old organism in the way we think of age. The meristematic cells at the branch tip have full-length telomeres — they are biologically young. The Bodhi Tree lineage is not "old" in any cellular sense. It is perpetually renewed. The tree that never dies is, at the molecular level, the tree that never ages.',
      checkQuestion: 'Cancer cells reactivate telomerase, allowing them to divide indefinitely. Plant meristems also have active telomerase and divide indefinitely. Why is one pathological and the other normal?',
      checkAnswer: 'Context and control. In cancer, telomerase reactivation allows a single cell to divide without limit, ignoring signals that normally stop division — this is uncontrolled growth. In plant meristems, telomerase activity is NORMAL and CONTROLLED — the plant regulates where and when meristems grow (through hormones like auxin and cytokinin). The same molecular capability (unlimited division) is dangerous in one context and essential in another.',
      codeIntro: 'Model telomere dynamics in animal vs plant cells — why plants do not age the way animals do.',
      code: `import numpy as np

np.random.seed(42)

# Telomere Dynamics: Animal vs Plant

class AnimalCell:
    def __init__(self, telomere_length=15000):
        self.telomere = telomere_length
        self.divisions = 0
        self.alive = True
        self.senescent = False

    def divide(self):
        if self.senescent or not self.alive:
            return False
        loss = np.random.randint(50, 100)
        self.telomere -= loss
        self.divisions += 1
        if self.telomere < 5000:
            self.senescent = True
            return False
        return True

class PlantMeristemCell:
    def __init__(self, telomere_length=15000):
        self.telomere = telomere_length
        self.divisions = 0
        self.alive = True

    def divide(self):
        if not self.alive:
            return False
        # Telomerase is active: rebuild after each division
        loss = np.random.randint(50, 100)
        rebuild = np.random.randint(40, 95)  # telomerase rebuilds most
        self.telomere = self.telomere - loss + rebuild
        self.divisions += 1
        return True

# Simulate many divisions
animal = AnimalCell()
plant = PlantMeristemCell()

print("Telomere Dynamics: Animal Cell vs Plant Meristem")
print("=" * 55)
print(f"{'Division':>10} | {'Animal telomere':>16} | {'Plant telomere':>16}")
print("-" * 48)

for div in range(200):
    a_ok = animal.divide()
    p_ok = plant.divide()

    if div in [0, 10, 25, 50, 75, 100, 150, 199] or not a_ok:
        a_status = f"{animal.telomere:,}" if animal.alive and not animal.senescent else "SENESCENT"
        p_status = f"{plant.telomere:,}"
        print(f"{div+1:>10} | {a_status:>16} | {p_status:>16}")

    if animal.senescent and div == animal.divisions:
        print(f"  ** Animal cell entered senescence at division {animal.divisions} **")

print()
print(f"Animal cell: {animal.divisions} divisions before senescence")
print(f"Plant cell: still dividing after 200 divisions")
print(f"  Plant telomere: {plant.telomere:,} bp (maintained by telomerase)")
print()
print("Plants do not age the way animals do.")
print("Their meristems are perpetually young.")
print("This is why the Bodhi Tree can live for millennia.")`,
      challenge: 'Dolly was cloned from a 6-year-old cell. Model her initial telomere length (shorter than normal) and predict how many fewer cell divisions she could undergo compared to a normal newborn lamb. Does this match her actual premature aging?',
      successHint: 'Telomere biology explains one of the deepest differences between plant and animal life: why trees can live for millennia while animals cannot. The Bodhi Tree\'s immortality is not metaphorical — it is molecular.',
    },
    {
      title: 'Genetic fingerprinting — verifying clone identity',
      concept: `How would a scientist PROVE that two trees are clones rather than close relatives? Through **genetic fingerprinting** using **microsatellites** (also called SSRs — Simple Sequence Repeats).

**What microsatellites are:**
- Short DNA sequences repeated in tandem: CACACACA... or AGTAGT...
- The NUMBER of repeats varies between individuals
- Each person/plant has a unique combination of repeat lengths across many loci
- Clones have IDENTICAL microsatellite profiles

**The technique:**
1. Extract DNA from both trees (leaf tissue, typically)
2. Use PCR (polymerase chain reaction) to amplify 10-20 microsatellite loci
3. Measure the length of each amplified fragment
4. Compare the profiles

**Interpreting results:**
- **All loci match** → clones (or identical twins)
- **~50% match** → parent-offspring relationship
- **~25% match** → half-siblings
- **Random match** → unrelated

This technique is used in forensics (human identification), agriculture (verifying grapevine clones), conservation (tracking animal populations), and even archaeology (identifying ancient wood).

For the Bodhi Tree: microsatellite analysis of the Sri Maha Bodhi, the Bodh Gaya tree, and Bodhi Tree cuttings around the world would definitively confirm or deny their clonal relationship.`,
      analogy: 'Microsatellite analysis is like comparing barcodes. Every individual has a unique barcode (pattern of repeat lengths). Clones have IDENTICAL barcodes. Parent-offspring pairs share about half their barcode lines. Unrelated individuals share almost none. You do not need to read the entire genome — just scan the barcode.',
      storyConnection: 'For 2,300 years, the Bodhi Tree lineage has been maintained by trust — monks record which cuttings came from which trees. Modern genetics offers verification. If a temple claims its tree is a genuine Bodhi Tree clone, microsatellite analysis can confirm or deny the claim in a few hours. Science and faith converge: the genetic evidence can support the historical record.',
      checkQuestion: 'A DNA test shows that two Bodhi Trees match at 18 out of 20 microsatellite loci. Are they clones?',
      checkAnswer: 'Probably not. True clones should match at ALL 20 loci (100%). A 90% match (18/20) is consistent with a close family relationship — perhaps one grew from a seed of the other, or they share a recent common ancestor. The 2 mismatching loci could be due to somatic mutations in a very old clone, but this needs further investigation. More loci should be tested, and the nature of the differences examined.',
      codeIntro: 'Simulate microsatellite fingerprinting to distinguish clones from relatives from unrelated individuals.',
      code: `import numpy as np

np.random.seed(42)

# Microsatellite Fingerprinting Simulation

n_loci = 20  # 20 microsatellite markers
max_repeats = 30  # max repeat count at any locus

def generate_profile(n_loci, max_repeats):
    """Generate a random microsatellite profile."""
    return np.random.randint(5, max_repeats, (n_loci, 2))  # diploid: 2 alleles per locus

def clone_profile(parent):
    """Clone: identical profile with possible somatic mutations."""
    clone = parent.copy()
    # Small chance of somatic mutation at each locus
    for i in range(len(clone)):
        if np.random.random() < 0.02:  # 2% per locus over 2300 years
            allele = np.random.randint(0, 2)
            clone[i, allele] += np.random.choice([-1, 1])
    return clone

def offspring_profile(parent_a, parent_b):
    """Sexual offspring: one allele from each parent."""
    child = np.zeros_like(parent_a)
    for i in range(len(parent_a)):
        child[i, 0] = parent_a[i, np.random.randint(0, 2)]
        child[i, 1] = parent_b[i, np.random.randint(0, 2)]
    return child

def compare_profiles(p1, p2):
    """Count matching loci (both alleles match, order-independent)."""
    matches = 0
    for i in range(len(p1)):
        set1 = set(p1[i])
        set2 = set(p2[i])
        if set1 == set2:
            matches += 1
    return matches

# Generate the original Bodhi Tree
original = generate_profile(n_loci, max_repeats)
unrelated_tree = generate_profile(n_loci, max_repeats)

# Clone (Sri Maha Bodhi)
sri_maha_bodhi = clone_profile(original)

# Seedling (sexual offspring of original)
other_parent = generate_profile(n_loci, max_repeats)
seedling = offspring_profile(original, other_parent)

print("Microsatellite Fingerprinting: Bodhi Tree Identity")
print("=" * 55)

comparisons = [
    ("Original vs Sri Maha Bodhi (clone)", original, sri_maha_bodhi),
    ("Original vs Seedling (sexual offspring)", original, seedling),
    ("Original vs Unrelated Ficus", original, unrelated_tree),
]

for name, p1, p2 in comparisons:
    matches = compare_profiles(p1, p2)
    print(f"\\n{name}")
    print(f"  Matching loci: {matches}/{n_loci} ({100*matches/n_loci:.0f}%)")
    if matches == n_loci:
        print(f"  Verdict: CONFIRMED CLONE")
    elif matches >= n_loci - 2:
        print(f"  Verdict: LIKELY CLONE (somatic mutations detected)")
    elif matches >= n_loci // 2:
        print(f"  Verdict: RELATED (parent-offspring or sibling)")
    else:
        print(f"  Verdict: UNRELATED")

print("\\n" + "=" * 55)
print("Genetic fingerprinting can verify clone identity in hours.")
print("2,300 years of monastic records, confirmed by 20 DNA markers.")`,
      challenge: 'A temple claims to have a Bodhi Tree clone but the microsatellite test shows 16/20 matches. Design a follow-up investigation: what additional tests would distinguish "old clone with many somatic mutations" from "seed-grown descendant"?',
      successHint: 'Genetic fingerprinting bridges the gap between historical tradition and scientific verification. For the Bodhi Tree lineage — and for any conservation cloning effort — it provides the definitive answer: are these two organisms really the same?',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Dna className="w-4 h-4" /> Level 3: Specialist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Genetics, CRISPR, gene editing, and conservation genetics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for genetics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Dna className="w-5 h-5" />Load Python</>)}
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
