import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'genetics-and-dna',
  title: 'Genetics & DNA',
  category: 'biology',
  icon: '🧬',
  tagline:
    'The code of life — how DNA determines whether a seed becomes bamboo or a banyan.',
  relatedStories: ['coconut-jackfruit', 'orchid-colors', 'takin-face'],
  understand: [
    // ── Section 1: DNA Structure ──────────────────────────────
    {
      title: 'DNA Structure',
      diagram: 'DNADoubleHelixDiagram',
      beginnerContent:
        'Watch the DNA helix spin in the diagram above. Those two twisted strands running around each other — that\'s a **double helix**, the shape of every gene ever expressed, every trait ever inherited, every bit of biological information on Earth. The structure was unknown until 1953. James Watson and Francis Crick worked it out in a burst of insight (using crystallography images produced by Rosalind Franklin, who never received the Nobel Prize she should have shared).\n\n' +
        'Here\'s what should astonish you: the DNA in one of your cells is **2 metres long**. And you have 37 trillion cells. If you unspooled every strand of DNA in your body and laid them end to end, you\'d have enough DNA to reach the sun — **370 times**. All of it, in you, right now, carrying instructions written in a 4-letter alphabet.\n\n' +
        'DNA is a twisted ladder. The rails are sugar and phosphate groups. The rungs are pairs of chemical bases:\n\n' +
        '| Base | Always pairs with | Number of hydrogen bonds |\n' +
        '|------|-------------------|-------------------------|\n' +
        '| **Adenine (A)** | **Thymine (T)** | 2 |\n' +
        '| **Guanine (G)** | **Cytosine (C)** | 3 |\n\n' +
        'This pairing rule is absolute — A *never* pairs with C or G. If you know one side of the ladder, you can predict the other.\n\n' +
        '**Analogy:** Think of A-T and G-C like matching puzzle pieces. Only the right shapes click together.\n\n' +
        '**How much DNA is inside you?** Each cell contains about **2 metres** of DNA — crammed into a nucleus just 6 micrometres (0.006 mm) across. That is like stuffing 40 kilometres of thread into a tennis ball. The trick? DNA wraps around protein spools called **histones**, then coils and loops into tighter and tighter bundles.\n\n' +
        '**Quick check:** If one strand of DNA reads A-T-G-C-C-A, what does the opposite strand read?\n\n' +
        '*Answer: T-A-C-G-G-T — each base pairs with its partner.*\n\n' +
        'The sequence of bases along a DNA strand is a **code**. A **gene** is a segment of DNA whose base sequence tells the cell how to make a particular protein. The human genome has roughly 20,000–25,000 genes, but they make up only ~1.5% of total DNA. The rest includes regulatory switches, structural DNA, and sequences still being studied.\n\n' +
        '| DNA component | % of human genome | What it does |\n' +
        '|---------------|-------------------|--------------|\n' +
        '| Protein-coding genes | ~1.5% | Instructions for building proteins |\n' +
        '| Regulatory sequences | ~8% | "On/off switches" that control when genes are active |\n' +
        '| Repetitive sequences | ~45% | Structural roles, some unknown functions |\n' +
        '| Other non-coding | ~45.5% | Still being researched |\n',
      intermediateContent:
        '**Precise dimensions of the double helix:**\n\n' +
        '| Property | Value |\n' +
        '|----------|-------|\n' +
        '| Width | 2 nm |\n' +
        '| Base pairs per full turn | 10 |\n' +
        '| Rise per turn (pitch) | 3.4 nm |\n' +
        '| Distance between base pairs | 0.34 nm |\n' +
        '| Human genome size | 3.2 billion base pairs |\n' +
        '| Chromosomes | 23 pairs (46 total) |\n\n' +
        'The two strands run **antiparallel** — one goes 5\' → 3\' and the other 3\' → 5\' (the numbers refer to carbon atoms on the deoxyribose sugar). This matters for replication and transcription because enzymes can only read DNA in the 5\' → 3\' direction.\n\n' +
        '**DNA packaging — from string to spool:**\n\n' +
        '| Level | Structure | Size |\n' +
        '|-------|-----------|------|\n' +
        '| Naked DNA | Double helix | 2 nm wide |\n' +
        '| Nucleosome | ~147 bp wrapped around histone octamer (2× H2A, H2B, H3, H4) | 11 nm |\n' +
        '| Beads on a string | Nucleosomes linked by ~50 bp linker DNA | 11 nm |\n' +
        '| 30 nm fibre | Nucleosomes coil into a solenoid | 30 nm |\n' +
        '| Loops | Attached to protein scaffold | 300 nm |\n' +
        '| Chromosome | Maximum compaction during cell division | 1,400 nm |\n\n' +
        '**Worked example — total DNA length:**\n\n' +
        'If 3.2 billion bp are spaced 0.34 nm apart:\n\n' +
        '`3.2 × 10⁹ × 0.34 nm = 1.09 × 10⁹ nm = 1.09 m ≈ 2 m (accounting for both chromatids)`\n\n' +
        'Your body has ~37 trillion cells. Total DNA: 37 × 10¹² × 2 m = **7.4 × 10¹³ m** — enough to stretch to the Sun and back ~250 times.',
      advancedContent:
        '**Three structural forms of DNA:**\n\n' +
        '| Form | Helix direction | bp per turn | Diameter | Where found |\n' +
        '|------|----------------|-------------|----------|-------------|\n' +
        '| **B-DNA** | Right-handed | 10 | 2.0 nm | Most common in living cells |\n' +
        '| **A-DNA** | Right-handed | 11 | 2.6 nm | Dehydrated DNA, DNA-RNA hybrids |\n' +
        '| **Z-DNA** | Left-handed | 12 | 1.8 nm | Alternating purine-pyrimidine (CGCGCG) |\n\n' +
        'Z-DNA may form transiently during transcription and has been implicated in gene regulation and immune signalling (ZBP1 protein recognizes Z-DNA as a danger signal).\n\n' +
        '**Topoisomerases — managing the twist:**\n\n' +
        'When DNA is unwound for replication or transcription, the helix ahead becomes overwound (positive supercoiling). Without relief, this tension would halt the process.\n\n' +
        '| Enzyme | Mechanism | Clinical relevance |\n' +
        '|--------|-----------|--------------------|\n' +
        '| **Type I topoisomerase** | Cuts one strand → allows rotation → reseals | Camptothecin (anti-cancer) traps Type I |\n' +
        '| **Type II (e.g., DNA gyrase)** | Cuts both strands → passes duplex through → reseals | Fluoroquinolone antibiotics (ciprofloxacin) target bacterial gyrase |\n\n' +
        '**The ENCODE project (2012)** found ~80% of the genome is biochemically active — transcribed, protein-bound, or carrying chromatin marks. Whether "biochemically active" equals "functionally important" remains debated; neutral transcription and stochastic binding could account for some of the activity.\n\n' +
        '**Epigenetics — modifications without changing the sequence:**\n\n' +
        '| Modification | Where it occurs | Effect |\n' +
        '|-------------|----------------|--------|\n' +
        '| DNA methylation (5mC) | CpG dinucleotides | Silences genes (adds methyl to cytosine) |\n' +
        '| Histone acetylation | Lysine residues on histone tails | Opens chromatin → gene activation |\n' +
        '| Histone methylation | Lysine or arginine on histone tails | Context-dependent: H3K4me3 activates, H3K27me3 silences |\n\n' +
        'These marks are heritable through cell division and can even pass across generations. Studies on the Dutch Hunger Winter (1944–45) showed that children conceived during famine had altered DNA methylation patterns 60 years later.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each DNA component to its role',
          pairs: [
            ['Adenine (A)', 'Pairs with Thymine via 2 hydrogen bonds'],
            ['Guanine (G)', 'Pairs with Cytosine via 3 hydrogen bonds'],
            ['Sugar-phosphate backbone', 'The "rails" of the DNA ladder — structural support'],
            ['Histones', 'Protein spools that DNA wraps around for compaction'],
            ['Gene', 'A segment of DNA that codes for a specific protein or RNA'],
          ],
        },
      },
    },

    // ── Section 2: Genes and Chromosomes ──────────────────────
    {
      title: 'Genes and Chromosomes',
      diagram: 'ChromosomeDiagram',
      beginnerContent:
        'Use the Zoom controls in the diagram above. Start at the full chromosome — that familiar X-shape. Zoom in. And in. And in. You\'ll eventually reach the **DNA double helix itself** — the finest level of resolution. This zoom isn\'t metaphor. It\'s how much compression happens in one cell: uncoil all 46 of your chromosomes and you get **2 metres of DNA**, folded and packed into a nucleus 6 millionths of a metre across. That\'s the equivalent of stuffing 40 km of fishing line into a pea.\n\n' +
        'If DNA is the complete instruction manual, a **gene** is one recipe in that manual. Each gene codes for one specific protein. You have about 20,000 genes spread across those 23 pairs of chromosomes — fewer than a banana, incidentally, which has about 36,000.\n\n' +
        '**How a gene becomes a protein — two steps:**\n\n' +
        '| Step | Name | What happens | Where |\n' +
        '|------|------|-------------|-------|\n' +
        '| 1 | **Transcription** | The DNA recipe is copied into a messenger molecule (mRNA) | Nucleus |\n' +
        '| 2 | **Translation** | The mRNA message is read, and amino acids are chained together into a protein | Ribosome |\n\n' +
        '**Analogy:** Transcription is like photocopying a recipe from a library book (DNA stays safe in the nucleus). Translation is like a chef reading that photocopy and cooking the dish (protein).\n\n' +
        'The mRNA is read in groups of **three bases** called **codons**. Each codon specifies one of the 20 amino acids — the building blocks of proteins.\n\n' +
        '| Codon | Amino acid |\n' +
        '|-------|------------|\n' +
        '| AUG | Methionine (also the "start" signal) |\n' +
        '| UUU | Phenylalanine |\n' +
        '| GCU | Alanine |\n' +
        '| UAA, UAG, UGA | STOP (no amino acid — end of protein) |\n\n' +
        '**Chromosomes** are the packaging system. Each chromosome is one enormously long DNA molecule wrapped tightly around proteins. Humans have **46 chromosomes** — 23 pairs. You get one set of 23 from your mother (via the egg) and one set of 23 from your father (via the sperm).\n\n' +
        '| Organism | Chromosome number | Surprise? |\n' +
        '|----------|-------------------|-----------|\n' +
        '| Human | 46 | — |\n' +
        '| Dog | 78 | More chromosomes than humans! |\n' +
        '| Rice | 24 | Fewer, but ~37,000 genes (more than us) |\n' +
        '| Muga silkworm (*Antheraea assamensis*) | 62 | Produces the golden silk unique to Assam |\n' +
        '| Atlas blue butterfly | ~450 | Highest known count |\n\n' +
        '**Key lesson:** Chromosome number tells you nothing about complexity. What matters is the information encoded in the DNA, not how many packages it comes in.',
      intermediateContent:
        '**The Central Dogma of molecular biology** (Crick, 1958):\n\n' +
        '`DNA → (transcription) → RNA → (translation) → Protein`\n\n' +
        'Information flows in one direction. There are exceptions — retroviruses like HIV use **reverse transcriptase** to go RNA → DNA — but the central dogma holds for nearly all life.\n\n' +
        '**The genetic code — key properties:**\n\n' +
        '| Property | What it means |\n' +
        '|----------|---------------|\n' +
        '| **Triplet** | 3 bases = 1 codon = 1 amino acid |\n' +
        '| **Degenerate** | Most amino acids have multiple codons (e.g., Leucine has 6) |\n' +
        '| **Universal** | Almost all life uses the same code |\n' +
        '| **Non-overlapping** | Each base belongs to exactly one codon |\n' +
        '| **Comma-free** | No gaps between codons |\n\n' +
        '**Worked example — decoding a gene fragment:**\n\n' +
        'mRNA: `AUG-GCU-UUU-GAG-UAA`\n\n' +
        '| Codon | Amino acid |\n' +
        '|-------|------------|\n' +
        '| AUG | Met (start) |\n' +
        '| GCU | Ala |\n' +
        '| UUU | Phe |\n' +
        '| GAG | Glu |\n' +
        '| UAA | STOP |\n\n' +
        'Result: Met-Ala-Phe-Glu (a 4-amino-acid peptide).\n\n' +
        '**Telomeres — chromosome end-caps:**\n\n' +
        '| Feature | Detail |\n' +
        '|---------|--------|\n' +
        '| Sequence | TTAGGG repeated ~2,500 times |\n' +
        '| Length | 5,000–15,000 bp at birth |\n' +
        '| Shortening rate | ~50–200 bp per cell division |\n' +
        '| Hayflick limit | ~50–70 divisions before senescence |\n' +
        '| Clinical use | Short telomeres linked to ageing; long telomeres linked to cancer risk |\n\n' +
        '**Karyotype analysis** (arranging chromosomes by size and banding pattern) detects abnormalities:\n\n' +
        '| Condition | Karyotype | Effect |\n' +
        '|-----------|-----------|--------|\n' +
        '| Down syndrome | Trisomy 21 (47 chromosomes) | Intellectual disability, characteristic features |\n' +
        '| Turner syndrome | 45,X (monosomy X) | Short stature, infertility in females |\n' +
        '| Klinefelter syndrome | 47,XXY | Tall stature, reduced fertility in males |',
      advancedContent:
        '**Telomere biology — connecting chromosomes to ageing and cancer:**\n\n' +
        '**Telomerase** is a reverse transcriptase with an RNA template component (hTERC: 5\'-AAUCCC-3\'). It extends the 3\' overhang of telomeric DNA, which is then filled in by DNA polymerase.\n\n' +
        '| Cell type | Telomerase activity | Consequence |\n' +
        '|-----------|--------------------|--------------|\n' +
        '| Stem cells, germ cells | Active | Telomeres maintained → indefinite division |\n' +
        '| Most somatic cells | Absent | Telomeres shorten → senescence at ~4 kb |\n' +
        '| ~85% of cancers | Reactivated | Escape senescence → immortal growth |\n' +
        '| ~15% of cancers | ALT pathway | Recombination-based telomere extension |\n\n' +
        'Blackburn, Greider, and Szostak won the 2009 Nobel Prize for discovering telomerase.\n\n' +
        '**3D genome architecture — beyond the linear sequence:**\n\n' +
        'Hi-C (chromosome conformation capture) reveals that chromosomes fold into **topologically associating domains (TADs)** — megabase-scale loops maintained by the **cohesin-CTCF** complex.\n\n' +
        '| Concept | Description | Scale |\n' +
        '|---------|-------------|-------|\n' +
        '| **Chromosome territories** | Each chromosome occupies a distinct nuclear region | Whole nucleus |\n' +
        '| **A/B compartments** | Active (A) vs inactive (B) chromatin regions | ~5 Mb |\n' +
        '| **TADs** | Self-interacting domains bounded by CTCF | 0.2–2 Mb |\n' +
        '| **Enhancer-promoter loops** | Direct gene regulation contacts | 10–500 kb |\n\n' +
        'TAD boundary disruption (e.g., by structural variants deleting a CTCF site) can cause **enhancer hijacking** — an enhancer meant for one gene activates a neighbour instead. This mechanism causes certain limb malformations and cancers.\n\n' +
        '**Worked example — the *SHH* locus:** A deletion of a TAD boundary near the *Sonic hedgehog* gene allows a limb enhancer to activate neighbouring genes, causing polydactyly (extra fingers). The *SHH* gene itself is intact — only the 3D folding is disrupted.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'An organism with more chromosomes is always more complex.', answer: false, explanation: 'Chromosome number has no relationship to complexity. Dogs have 78 chromosomes (vs 46 in humans), and rice has ~37,000 genes (more than us).' },
            { text: 'mRNA is read in groups of three bases called codons.', answer: true, explanation: 'Each codon (3-base triplet) specifies one amino acid. There are 64 possible codons coding for 20 amino acids plus stop signals.' },
            { text: 'Telomeres get longer each time a cell divides.', answer: false, explanation: 'Telomeres shorten by ~50-200 bp per division. This progressive shortening acts as a "mitotic clock" limiting cells to ~50-70 divisions.' },
            { text: 'The genetic code is nearly universal across all living organisms.', answer: true, explanation: 'From bacteria to humans, almost all life uses the same codon-to-amino-acid mapping — strong evidence for a common ancestor.' },
          ],
        },
      },
    },

    // ── Section 3: Mendelian Inheritance ──────────────────────
    {
      title: 'Mendelian Inheritance',
      diagram: 'DominantRecessiveDiagram',
      beginnerContent:
        'Try the diagram above. Pick any two parent genotypes (BB, Bb, or bb) and see the possible children. Notice something? If both parents are Bb (heterozygous), their offspring are always 1 BB : 2 Bb : 1 bb — **three purple to one white, every time, for thousands of generations.** This isn\'t chance. It\'s a mathematical law of nature.\n\n' +
        'In the 1860s, a monk named **Gregor Mendel** grew pea plants in a monastery garden in Brno. No one knew DNA existed. No one knew genes existed. By carefully crossing thousands of plants and counting offspring, Mendel worked out the mathematical rules of inheritance from pure pattern recognition. His paper was published in 1866, then **ignored for 35 years.** Only in 1900 — after Mendel was long dead — did three independent biologists rediscover it and realise what he\'d found.\n\n' +
        'Mendel\'s key insight: traits are carried by discrete "factors" (we now call them **genes**) that come in different versions (**alleles**). You inherit one allele from each parent. Some alleles dominate; others hide unless paired with a matching copy.\n\n' +
        '**Mendel\'s key insight:** Traits are determined by discrete "factors" (we now call them **genes**) that come in different versions (called **alleles**). You inherit **two alleles** for each gene — one from each parent.\n\n' +
        '| Term | Meaning | Example |\n' +
        '|------|---------|--------|\n' +
        '| **Allele** | A version of a gene | P (purple flowers) or p (white flowers) |\n' +
        '| **Dominant** | The allele whose effect shows even with one copy | P (purple) |\n' +
        '| **Recessive** | The allele whose effect only shows with two copies | p (white) |\n' +
        '| **Homozygous** | Two identical alleles | PP or pp |\n' +
        '| **Heterozygous** | Two different alleles | Pp |\n' +
        '| **Genotype** | The alleles you carry | PP, Pp, or pp |\n' +
        '| **Phenotype** | What you can observe | Purple or white flowers |\n\n' +
        '**Analogy:** Think of alleles like playing cards. If you hold a King (dominant) and a 3 (recessive), people see the King — it "wins." You need *two* 3s for the 3 to show.\n\n' +
        '**A real example from Assam:** The Muga silkworm (*Antheraea assamensis*) produces golden silk — the only insect in the world that does. The golden colour is determined by specific alleles that are dominant over paler variants. Breeders in Upper Assam select parent moths that carry these golden-colour alleles to maintain the prized hue generation after generation.\n\n' +
        '**Carrier surprise:** Two brown-eyed parents can have a blue-eyed child. If both parents are **Bb** (heterozygous carriers), there is a 1-in-4 chance the child inherits **bb** (two recessive alleles) and shows blue eyes.\n\n' +
        '| Parent 1 alleles | Parent 2 alleles | Child genotype | Child phenotype |\n' +
        '|-----------------|-----------------|----------------|----------------|\n' +
        '| B | B | BB | Brown eyes |\n' +
        '| B | b | Bb | Brown eyes (carrier) |\n' +
        '| b | B | Bb | Brown eyes (carrier) |\n' +
        '| b | b | **bb** | **Blue eyes** |',
      intermediateContent:
        '**Mendel\'s Two Laws:**\n\n' +
        '| Law | Statement | Molecular basis |\n' +
        '|-----|----------|----------------|\n' +
        '| **Segregation** | Two alleles for each gene separate during gamete formation; each gamete gets one | Homologous chromosomes separate in meiosis I |\n' +
        '| **Independent Assortment** | Alleles of different genes sort independently | Genes on different chromosomes align randomly at metaphase I |\n\n' +
        '*Independent assortment holds for genes on different chromosomes or far apart on the same one. Linked genes violate this law.*\n\n' +
        '**Beyond simple dominance:**\n\n' +
        '| Pattern | How it works | Example |\n' +
        '|---------|-------------|--------|\n' +
        '| **Incomplete dominance** | Heterozygote is intermediate | Snapdragon: RR (red) × rr (white) → Rr (**pink**) |\n' +
        '| **Codominance** | Both alleles fully expressed | Blood type: I^A I^B → type AB (both antigens present) |\n' +
        '| **Multiple alleles** | More than 2 alleles exist in the population | ABO blood group: 3 alleles (I^A, I^B, i) |\n' +
        '| **Sex-linked** | Gene is on the X chromosome | Colour blindness: X^b Y males affected; X^B X^b females are carriers |\n\n' +
        '**Worked example — blood type inheritance:**\n\n' +
        'Mother: type A (genotype I^A i) × Father: type B (genotype I^B i)\n\n' +
        '| | I^B | i |\n' +
        '|---|-----|---|\n' +
        '| **I^A** | I^A I^B (type AB) | I^A i (type A) |\n' +
        '| **i** | I^B i (type B) | ii (type O) |\n\n' +
        'Possible children: **type A, type B, type AB, or type O** — all four blood types from just two parents!\n\n' +
        '**Sex-linked inheritance — why colour blindness is more common in males:**\n\n' +
        '| Genotype | Phenotype |\n' +
        '|----------|----------|\n' +
        '| X^B X^B (female) | Normal vision |\n' +
        '| X^B X^b (female) | Normal vision (carrier) |\n' +
        '| X^b X^b (female) | Colour blind |\n' +
        '| X^B Y (male) | Normal vision |\n' +
        '| X^b Y (male) | **Colour blind** — only one X, so one recessive allele is enough |\n\n' +
        'In India, ~8% of males are colour blind vs only ~0.5% of females.',
      advancedContent:
        '**Polygenic traits and quantitative genetics:**\n\n' +
        'Most visible traits are NOT controlled by a single gene. Height, skin colour, intelligence, and disease risk are **polygenic** — influenced by many genes, each contributing a small effect, plus environmental factors.\n\n' +
        '**The variance equation:** V_P = V_G + V_E + V_GxE\n\n' +
        '| Symbol | Meaning |\n' +
        '|--------|--------|\n' +
        '| V_P | Total phenotypic variance in the population |\n' +
        '| V_G | Genetic variance |\n' +
        '| V_E | Environmental variance |\n' +
        '| V_GxE | Gene-environment interaction |\n\n' +
        '**Heritability** (h²) = V_G / V_P — the fraction of variation explained by genetics.\n\n' +
        '| Trait | Heritability (h²) | What it means |\n' +
        '|-------|-------------------|---------------|\n' +
        '| Human height | ~0.80 | 80% of height variation is genetic |\n' +
        '| BMI | ~0.40–0.70 | Strong genetic component, but environment matters |\n' +
        '| Personality traits | ~0.40–0.60 | Moderate genetic influence |\n' +
        '| Crop yield (rice) | ~0.30–0.60 | Depends heavily on growing conditions |\n\n' +
        '**GWAS (Genome-Wide Association Studies)** scan millions of SNPs (single nucleotide polymorphisms) across thousands of people to find loci associated with traits. For height, GWAS identified ~10,000 SNPs explaining ~40% of variance. The rest ("missing heritability") likely involves rare variants, epistasis, and gene-environment effects.\n\n' +
        '**Epistasis — gene-gene interaction in Labrador coat colour:**\n\n' +
        'Gene B controls pigment colour (B_ = black, bb = brown). Gene E controls pigment deposition (E_ = deposit, ee = no deposit → yellow).\n\n' +
        '| Genotype | Phenotype | Dihybrid ratio |\n' +
        '|----------|-----------|----------------|\n' +
        '| B_E_ | Black | 9 |\n' +
        '| bbE_ | Brown | 3 |\n' +
        '| B_ee | Yellow (ee masks B) | 3 + 1 = **4** |\n' +
        '| bbee | Yellow (ee masks bb) | |\n\n' +
        'The expected 9:3:3:1 becomes **9 black : 3 brown : 4 yellow** — gene E is *epistatic* to gene B.\n\n' +
        '**Marker-assisted selection (MAS)** in Indian agriculture: Researchers at AAU (Assam Agricultural University) use DNA markers to breed flood-tolerant rice varieties. The **SUB1A** gene (from the *FR13A* variety) allows rice to survive 2 weeks of complete submersion — critical for flood-prone Brahmaputra valley. MAS accelerates breeding by 50–70% over traditional phenotypic selection.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each inheritance pattern to its example',
          pairs: [
            ['Complete dominance', 'PP and Pp both show purple flowers; only pp is white'],
            ['Incomplete dominance', 'RR (red) + rr (white) = Rr (pink) — blended intermediate'],
            ['Codominance', 'Blood type AB — both A and B antigens fully expressed'],
            ['Sex-linked recessive', 'Colour blindness: ~8% of males affected vs ~0.5% of females'],
            ['Epistasis', 'Yellow Labradors: ee genotype masks both black and brown pigment genes'],
          ],
        },
      },
    },

    // ── Section 4: Punnett Squares ────────────────────────────
    {
      title: 'Punnett Squares',
      diagram: 'PunnettSquareDiagram',
      beginnerContent:
        'Try the Punnett square above. Pick two parents, and the grid shows every possible child combination, one square per outcome. It\'s a **probability calculator for genetics**, invented by Reginald Punnett in 1905 as a visual shortcut for what Mendel did by hand. Half a century later, biologists were using the same grid to predict inherited diseases like cystic fibrosis and sickle cell anaemia — work that now guides genetic counselling for millions of families.\n\n' +
        '**How to use one (step by step):**\n\n' +
        '1. Write one parent\'s alleles across the **top**\n' +
        '2. Write the other parent\'s alleles down the **side**\n' +
        '3. Fill each box with the combination\n\n' +
        '**Worked example — Bb × Bb (both parents are heterozygous for eye colour):**\n\n' +
        '| | **B** | **b** |\n' +
        '|---|-------|-------|\n' +
        '| **B** | BB (brown) | Bb (brown) |\n' +
        '| **b** | Bb (brown) | bb (blue) |\n\n' +
        '**Results:**\n\n' +
        '| Outcome | Count | Ratio |\n' +
        '|---------|-------|-------|\n' +
        '| BB (homozygous brown) | 1 | 25% |\n' +
        '| Bb (heterozygous brown, carrier) | 2 | 50% |\n' +
        '| bb (homozygous blue) | 1 | 25% |\n' +
        '| **Phenotype ratio** | **3 brown : 1 blue** | |\n\n' +
        'This is the classic **3:1 Mendelian ratio**.\n\n' +
        '**Important:** These are *probabilities*, not guarantees. A family with 4 children won\'t necessarily have 3 brown-eyed and 1 blue-eyed. With large numbers (like Mendel\'s thousands of pea plants), the ratios become very close to predicted.\n\n' +
        '**The test cross — uncovering hidden alleles:**\n\n' +
        'A brown-eyed person could be BB or Bb — you can\'t tell by looking. The **test cross** solves this: cross the unknown with a homozygous recessive (bb).\n\n' +
        '| If the unknown is... | Cross | Offspring |\n' +
        '|---------------------|-------|-----------|\n' +
        '| BB | BB × bb | All Bb (all brown) |\n' +
        '| Bb | Bb × bb | 50% Bb (brown), 50% bb (blue) |\n\n' +
        'If *any* offspring show the recessive trait, the unknown parent must be heterozygous. Assamese Muga silk breeders use a version of this logic — crossing moths with unknown genotypes against recessive-trait moths to determine which carry desirable alleles.',
      intermediateContent:
        '**The dihybrid cross — two genes at once:**\n\n' +
        'Cross AaBb × AaBb. Each parent can make 4 gamete types: AB, Ab, aB, ab.\n\n' +
        '| | AB | Ab | aB | ab |\n' +
        '|---|-------|-------|-------|-------|\n' +
        '| **AB** | AABB | AABb | AaBB | AaBb |\n' +
        '| **Ab** | AABb | AAbb | AaBb | Aabb |\n' +
        '| **aB** | AaBB | AaBb | aaBB | aaBb |\n' +
        '| **ab** | AaBb | Aabb | aaBb | aabb |\n\n' +
        '**Phenotype ratio: 9:3:3:1**\n\n' +
        '| Phenotype | Genotype(s) | Count out of 16 |\n' +
        '|-----------|-------------|----------------|\n' +
        '| Dominant for both (A_B_) | AABB, AABb, AaBB, AaBb | 9 |\n' +
        '| Dominant A, recessive b (A_bb) | AAbb, Aabb | 3 |\n' +
        '| Recessive a, dominant B (aaB_) | aaBB, aaBb | 3 |\n' +
        '| Recessive for both (aabb) | aabb | 1 |\n\n' +
        '**The chi-squared (χ²) test — does the data fit?**\n\n' +
        'Formula: **χ² = Σ(O − E)² / E**\n\n' +
        '**Worked example — Mendel\'s actual data:**\n\n' +
        '| Phenotype | Observed (O) | Expected (E) based on 9:3:3:1 | (O−E)²/E |\n' +
        '|-----------|-------------|-------------------------------|----------|\n' +
        '| Round yellow | 315 | 312.75 | 0.016 |\n' +
        '| Round green | 108 | 104.25 | 0.135 |\n' +
        '| Wrinkled yellow | 101 | 104.25 | 0.101 |\n' +
        '| Wrinkled green | 32 | 34.75 | 0.218 |\n' +
        '| **Total** | **556** | **556** | **χ² = 0.47** |\n\n' +
        'Degrees of freedom = 4 − 1 = 3. Critical value at p = 0.05 is 7.81.\n\n' +
        'Since **0.47 < 7.81**, we *fail to reject* the null hypothesis — Mendel\'s data fits the 9:3:3:1 ratio beautifully.',
      advancedContent:
        '**Beyond Punnett squares — Bayesian probability in genetic counselling:**\n\n' +
        'For rare autosomal recessive diseases, Punnett squares alone are insufficient. Genetic counsellors use **Bayes\' theorem** to calculate risk.\n\n' +
        '**Worked example — cystic fibrosis (CF):**\n\n' +
        '| Given | Value |\n' +
        '|-------|-------|\n' +
        '| CF frequency (q²) | 1/2,500 |\n' +
        '| q (recessive allele frequency) | 1/50 |\n' +
        '| Carrier frequency (2pq) | ~1/25 |\n\n' +
        'Scenario: An unaffected person (no family history) mates with a known CF carrier.\n\n' +
        '| Step | Calculation |\n' +
        '|------|-------------|\n' +
        '| P(person is carrier) | 1/25 (prior from population frequency) |\n' +
        '| P(child affected \\| both carriers) | 1/4 |\n' +
        '| P(child affected) | 1/25 × 1/4 = **1/100** |\n\n' +
        '**Bayesian update if their first child is unaffected:**\n\n' +
        '| Hypothesis | Prior P(H) | Likelihood P(data\\|H) | Prior × Likelihood | Posterior P(H\\|data) |\n' +
        '|-----------|-----------|---------------------|-------------------|--------------------|\n' +
        '| Carrier (Cc) | 1/25 = 0.04 | P(unaffected\\|both carriers) = 3/4 | 0.04 × 0.75 = 0.030 | 0.030/0.990 ≈ **0.030** |\n' +
        '| Non-carrier (CC) | 24/25 = 0.96 | P(unaffected\\|not carrier) = 1 | 0.96 × 1.0 = 0.960 | 0.960/0.990 ≈ **0.970** |\n' +
        '| **Total** | | | **0.990** | **1.000** |\n\n' +
        'The posterior probability drops slightly from 4% to 3% — an unaffected child is weak evidence against being a carrier.\n\n' +
        '**Linkage analysis — genes that travel together:**\n\n' +
        'Genes close together on the same chromosome violate independent assortment — they are **linked**. The recombination frequency between two loci measures their genetic distance:\n\n' +
        '| Recombination frequency | Genetic distance | Interpretation |\n' +
        '|------------------------|-----------------|----------------|\n' +
        '| 0% | 0 cM | Same locus or extremely close |\n' +
        '| 1% | 1 cM (~1 Mb) | Very close — rarely separated |\n' +
        '| 50% | ≥50 cM | Effectively unlinked (different chromosomes or far apart) |\n\n' +
        'A **LOD score** (logarithm of odds) > 3 confirms linkage (odds of linkage vs no linkage > 1000:1).',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Mendel\'s data was suspiciously close to expected ratios — statistician R.A. Fisher argued in 1936 that the results were "too good to be true." Whether Mendel or an assistant unconsciously biased the counts remains debated.',
            'The largest Punnett square you can draw for n independent genes is 2ⁿ × 2ⁿ. For just 5 genes, that is a 32 × 32 grid with 1,024 boxes — which is why geneticists use probability math instead.',
            'In Assam, Muga silk breeders have practised selective breeding for centuries — unknowingly applying Mendelian genetics long before Mendel was born.',
            'The chi-squared test used to validate Mendel\'s ratios was invented by Karl Pearson in 1900 — the same year Mendel\'s work was rediscovered.',
          ],
        },
      },
    },

    // ── Section 5: Mutations and Variation ────────────────────
    {
      title: 'Mutations and Variation',
      diagram: 'MutationTypesDiagram',
      beginnerContent:
        'Click through the mutation types above. Start with "Silent" — notice the protein didn\'t change. Then try "Missense" — one amino acid swapped. Then "Insertion" or "Deletion" — watch how adding or removing a single DNA base **shifts the entire reading frame** and every codon after the mutation becomes garbage. A single-base change can mean nothing, or it can destroy the protein entirely. This is how sickle cell anaemia works: one base change, one amino acid swap, red blood cells that fold wrong.\n\n' +
        'A **mutation** is any change in the DNA sequence. Think of it like a typo in a recipe — sometimes harmless, sometimes meaning-changing, sometimes devastating:\n\n' +
        '**Types of mutations:**\n\n' +
        '| Type | What happens | Analogy |\n' +
        '|------|-------------|--------|\n' +
        '| **Substitution** | One base replaced by another | "THE CAT SAT" → "THE **C**A**R** SAT" |\n' +
        '| **Insertion** | Extra base(s) added | "THE CAT SAT" → "THE C**X**AT SAT" |\n' +
        '| **Deletion** | Base(s) removed | "THE CAT SAT" → "THE C_T SAT" |\n' +
        '| **Frameshift** | Insertion/deletion shifts the reading frame | "THE CAT SAT" → "THE XCA TSA T..." (everything after is garbled) |\n\n' +
        '**Most mutations are neutral.** They land in non-coding DNA, or they change a codon to one that still codes for the same amino acid (a **silent** mutation).\n\n' +
        '**A famous harmful mutation — sickle cell disease:**\n\n' +
        'A single base change in the haemoglobin gene swaps one amino acid (glutamic acid → valine). This tiny change causes haemoglobin molecules to clump together, bending red blood cells into rigid sickle shapes that block blood vessels.\n\n' +
        '| Copies of sickle allele | Effect |\n' +
        '|------------------------|--------|\n' +
        '| 0 (HbAA) | Normal — no protection from malaria |\n' +
        '| 1 (HbAS) | **Carrier** — mild or no symptoms + significant malaria resistance |\n' +
        '| 2 (HbSS) | **Sickle cell disease** — pain crises, organ damage |\n\n' +
        '**The twist:** In malaria-prone regions of Africa and India, carrying *one* sickle allele is an *advantage*. This is why the allele persists — natural selection maintains it because carriers survive malaria better than non-carriers.\n\n' +
        '**Mutations = raw material of evolution.** Without mutations, there would be no variation, no natural selection, and no evolution. Every species alive today — including us — exists because of mutations that accumulated over billions of years.',
      intermediateContent:
        '**Effects of point mutations on proteins:**\n\n' +
        '| Mutation type | DNA change | Protein effect | Example |\n' +
        '|--------------|-----------|----------------|--------|\n' +
        '| **Silent** | GGU → GGC | Same amino acid (Gly) | No effect |\n' +
        '| **Missense** | GAG → GUG | Different amino acid (Glu → Val) | Sickle cell disease |\n' +
        '| **Nonsense** | UAC → UAA | Premature stop codon | Truncated, non-functional protein |\n' +
        '| **Frameshift** | Insert/delete non-multiple of 3 | Everything downstream wrong | Usually devastating |\n\n' +
        '**The sickle cell mutation in molecular detail:**\n\n' +
        '| Feature | Detail |\n' +
        '|---------|--------|\n' +
        '| Gene | β-globin (HBB) on chromosome 11 |\n' +
        '| Position | Codon 6 |\n' +
        '| DNA change | CTC → CAC (template strand) |\n' +
        '| mRNA change | GAG → GUG |\n' +
        '| Amino acid change | Glutamic acid (hydrophilic, charged) → Valine (hydrophobic) |\n' +
        '| Effect | Valine creates a "sticky patch" on deoxygenated HbS → polymerisation into rigid fibres |\n\n' +
        '**Heterozygote advantage (overdominance):**\n\n' +
        'In HbAS carriers, ~40% of haemoglobin is HbS. When *Plasmodium falciparum* infects a red blood cell, the cell sickles and is cleared by the spleen — killing the parasite inside. This gives carriers ~90% protection against severe malaria.\n\n' +
        '| Genotype | Fitness in malaria zone | Fitness in non-malaria zone |\n' +
        '|----------|----------------------|----------------------------|\n' +
        '| HbAA | Low (malaria vulnerability) | High |\n' +
        '| HbAS | **Highest** (malaria resistance, no disease) | High |\n' +
        '| HbSS | Low (sickle cell disease) | Low |\n\n' +
        'This is why the sickle allele frequency reaches 10–20% in malaria-endemic regions but is rare elsewhere — a textbook case of **balancing selection**.\n\n' +
        'The thalassemia trait (another haemoglobin mutation) is common among certain communities in Assam, also maintained by malaria selection pressure in the historically malaria-prone Brahmaputra valley.',
      advancedContent:
        '**Mutation rates and mechanisms:**\n\n' +
        '| Mechanism | Rate | Notes |\n' +
        '|-----------|------|-------|\n' +
        '| Spontaneous point mutations | ~1.2 × 10⁻⁸ per bp per generation | ~60–80 new mutations per child |\n' +
        '| CpG deamination | ~10× higher than average | Methylated cytosine → thymine (transition) |\n' +
        '| DNA polymerase errors | ~10⁻⁴ per bp | Corrected to ~10⁻¹⁰ by proofreading + mismatch repair |\n' +
        '| UV-induced pyrimidine dimers | ~50–100 per cell per hour of sun | Repaired by nucleotide excision repair (NER) |\n\n' +
        '**CRISPR-Cas9 gene editing — precision surgery on DNA:**\n\n' +
        '(Doudna & Charpentier, 2020 Nobel Prize)\n\n' +
        '| Component | Role |\n' +
        '|-----------|------|\n' +
        '| **Guide RNA (gRNA)** | 20-nucleotide sequence complementary to target DNA |\n' +
        '| **Cas9 nuclease** | Cuts both DNA strands at the target site |\n' +
        '| **PAM sequence** | NGG motif adjacent to target — required for Cas9 binding |\n\n' +
        '**Repair pathways after the cut:**\n\n' +
        '| Pathway | Mechanism | Outcome | Accuracy |\n' +
        '|---------|-----------|---------|----------|\n' +
        '| **NHEJ** (Non-homologous end joining) | Blunt ends ligated directly | Insertions/deletions → gene knockout | Error-prone |\n' +
        '| **HDR** (Homology-directed repair) | Uses donor template | Precise edits (e.g., correct a mutation) | High, but low efficiency (~5–20%) |\n\n' +
        '**Next-generation editing tools:**\n\n' +
        '| Tool | Developers | What it does | Advantage over Cas9 |\n' +
        '|------|-----------|-------------|--------------------|\n' +
        '| **Base editors** | Komor et al., 2016 | C→T or A→G conversion without double-strand break | No indels, higher precision |\n' +
        '| **Prime editing** | Anzalone et al., 2019 | All 12 point mutation types + small indels | Most versatile; "search and replace" |\n' +
        '| **Epigenome editors** | CRISPRi/CRISPRa | Silence or activate genes without changing DNA | Reversible; no permanent mutation |\n\n' +
        '**CRISPR in agriculture (NE India relevance):** Researchers are developing CRISPR-edited rice varieties resistant to bacterial blight (*Xanthomonas oryzae*), a major rice pathogen in the Brahmaputra flood plains. By editing the *SWEET* gene promoter (which the bacterium hijacks for sugar), resistance can be introduced without transferring foreign DNA — potentially easing regulatory approval.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Most mutations are harmful and cause disease.', answer: false, explanation: 'Most mutations are neutral — they occur in non-coding DNA or are silent mutations that don\'t change the amino acid. Only a small fraction are harmful.' },
            { text: 'A person with one sickle cell allele (HbAS) has both malaria resistance and sickle cell disease.', answer: false, explanation: 'HbAS carriers have malaria resistance but do NOT have sickle cell disease. They may experience mild symptoms under extreme conditions, but are generally healthy.' },
            { text: 'CRISPR-Cas9 can edit DNA at a specific location guided by a complementary RNA sequence.', answer: true, explanation: 'The guide RNA directs Cas9 to a matching 20-nucleotide target in the genome, where it creates a precise double-strand break.' },
            { text: 'Frameshift mutations are more damaging than substitutions because they alter every codon downstream.', answer: true, explanation: 'Inserting or deleting bases that aren\'t multiples of 3 shifts the entire reading frame, scrambling all subsequent amino acids and usually destroying protein function.' },
          ],
        },
      },
    },
  ],
};
