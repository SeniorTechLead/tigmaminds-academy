import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'evolution-and-natural-selection',
  title: 'Evolution & Natural Selection',
  category: 'zoology',
  icon: '🧬',
  tagline:
    "How species change over millions of years — from ancient fish to Assam's one-horned rhino.",
  relatedStories: ['takin-face', 'red-panda-mask', 'golden-hilsa', 'turtle-slow'],
  understand: [
    // ── Section 1: Darwin's Theory ──────────────────────────────
    {
      title: 'Darwin\'s Theory of Evolution',
      diagram: 'GrassRhinoHabitatDiagram',
      beginnerContent:
        'In 1831, a young English naturalist named Charles Darwin sailed on HMS Beagle for a five-year voyage around the world. On the Galapagos Islands, he noticed that finches on different islands had distinctly different beak shapes — thick for cracking seeds, slender for probing flowers, sharp for catching insects — yet they were clearly related. How could such diversity arise among closely related birds?\n\n' +
        'Darwin spent two decades developing his answer, publishing *On the Origin of Species* in 1859. His theory rests on **four pillars**:\n\n' +
        '| Pillar | What it means | Animal example |\n' +
        '|--------|--------------|----------------|\n' +
        '| **Variation** | Individuals differ in measurable ways | Kaziranga\'s one-horned rhinos vary in horn size, skin fold depth, and body mass |\n' +
        '| **Inheritance** | Offspring resemble their parents | A hoolock gibbon\'s long arms are passed from parent to offspring |\n' +
        '| **Overproduction** | Far more offspring are born than can survive | A female golden mahseer lays ~30,000 eggs per season, but only a handful survive to adulthood |\n' +
        '| **Differential survival** | Better-suited individuals survive and reproduce more | Rhinos with thicker skin folds may better resist parasites and thorny vegetation |\n\n' +
        '**The Kaziranga rhino story:** The Indian one-horned rhinoceros (*Rhinoceros unicornis*) was hunted to fewer than 200 individuals by the early 1900s. Today, Kaziranga National Park in Assam shelters over 2,600 — about two-thirds of the world population. **Explore the diagram above** to see how this grassland habitat supports the rhino.\n\n' +
        'Over many generations, traits that help survival become more common, while less useful traits fade. Darwin called this **natural selection** — nature does the selecting, not a conscious breeder. Given enough time (thousands to millions of generations), natural selection can transform one species into another.\n\n' +
        '| Common misconception | Reality |\n' +
        '|---------------------|---------|\n' +
        '| "Evolution has a goal" | No — evolution has no direction or purpose; it responds to current conditions |\n' +
        '| "Organisms try to evolve" | No — individuals don\'t change; *populations* change over generations |\n' +
        '| "Survival of the fittest means strongest" | "Fittest" means best-suited to the environment — a small, camouflaged frog is fitter than a large, visible one if predators hunt by sight |\n' +
        '| "Humans evolved from monkeys" | Humans and monkeys share a common ancestor; neither "became" the other |',
      intermediateContent:
        '**Quantifying fitness**\n\n' +
        'Darwin\'s "fitness" can be measured precisely:\n\n' +
        '| Term | Symbol | Definition | Example |\n' +
        '|------|--------|------------|---------|\n' +
        '| Absolute fitness | W | Average offspring produced by a genotype | Green beetle: W = 3; brown beetle: W = 5 |\n' +
        '| Relative fitness | w | W / W_max (normalised to fittest) | w_green = 3/5 = 0.6; w_brown = 1.0 |\n' +
        '| Selection coefficient | s | 1 − w (disadvantage of less-fit genotype) | s_green = 1 − 0.6 = **0.4** |\n\n' +
        '**Worked example — how fast can selection work?**\n\n' +
        'The time for a beneficial allele to go from 1% to 99% frequency:\n\n' +
        '`t ≈ (2/s) × ln(99)`\n\n' +
        '| Selection coefficient (s) | Time to fixation (generations) | In years (if generation = 5 yr) |\n' +
        '|--------------------------|-------------------------------|--------------------------------|\n' +
        '| 0.01 (weak) | ~920 | ~4,600 years |\n' +
        '| 0.05 (moderate) | ~184 | ~920 years |\n' +
        '| 0.10 (strong) | ~92 | ~460 years |\n\n' +
        'Even "weak" selection (s = 0.01) drives an allele to fixation in under 5,000 years — fast on geological timescales.\n\n' +
        '**Real-time observation — Darwin\'s finches:** Peter and Rosemary Grant studied *Geospiza fortis* on Daphne Major. During the 1977 drought, average beak depth increased by **0.5 mm in a single generation** — birds with larger beaks survived on hard seeds. When rains returned, beak depth shifted back. This is natural selection observed in real time.\n\n' +
        '**The hoolock gibbon:** India\'s only ape, the western hoolock gibbon (*Hoolock hoolock*), is found in the forests of Assam, Meghalaya, and Arunachal Pradesh. Their extremely long arms (arm span 1.5× body height) are an adaptation for brachiation (swinging through the canopy). Relative fitness of longer-armed individuals is higher in closed-canopy forests; as deforestation fragments their habitat, selection pressures are shifting.',
      advancedContent:
        '**The Hardy-Weinberg equilibrium — evolution\'s null model**\n\n' +
        'In an idealised population (infinite size, random mating, no selection, no mutation, no migration), allele frequencies remain constant:\n\n' +
        '`p² + 2pq + q² = 1`\n\n' +
        'where p = frequency of dominant allele (A), q = frequency of recessive allele (a).\n\n' +
        '**Worked example — testing for evolution in a rhino population:**\n\n' +
        'Suppose a skin-thickness gene has two alleles: T (thick, dominant) and t (thin, recessive). In a sample of 500 Kaziranga rhinos, 20 show the thin-skinned phenotype (tt genotype).\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Frequency of tt (q²) | 20/500 = 0.04 |\n' +
        '| q = √0.04 | q = 0.20 |\n' +
        '| p = 1 − q | p = 0.80 |\n' +
        '| Expected TT (p²) | 0.64 × 500 = 320 |\n' +
        '| Expected Tt (2pq) | 0.32 × 500 = 160 |\n' +
        '| Expected tt (q²) | 0.04 × 500 = 20 |\n\n' +
        'If observed genotype counts deviate significantly from these expectations (chi-squared test), some evolutionary force — selection, drift, migration, or non-random mating — is acting.\n\n' +
        '**Kimura\'s neutral theory (1968):** Most molecular evolution is driven by random drift of neutral mutations, not selection. The **nearly neutral theory** (Ohta, 1973) refines this: mutations with |s| < 1/(2Nₑ) behave as effectively neutral. In small populations (low Nₑ), more mutations are effectively neutral, so drift dominates. In large populations, selection is more efficient at filtering even weakly deleterious mutations.\n\n' +
        '| Model | Key prediction | Test |\n' +
        '|-------|---------------|------|\n' +
        '| Neutral theory | dN/dS ≈ 1 for neutral genes | McDonald-Kreitman test |\n' +
        '| Purifying selection | dN/dS < 1 (most genes) | Tajima\'s D (negative) |\n' +
        '| Positive selection | dN/dS > 1 (adaptive genes) | Tajima\'s D (positive) |\n' +
        '| Balancing selection | Excess heterozygosity | HKA test |',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each pillar of Darwin\'s theory to its meaning',
          pairs: [
            ['Variation', 'Individuals in a population differ in traits like size, color, and speed'],
            ['Inheritance', 'Offspring tend to resemble their parents because traits are passed through genes'],
            ['Overproduction', 'Organisms produce far more offspring than the environment can support'],
            ['Differential survival', 'Individuals with advantageous traits survive and reproduce at higher rates'],
          ],
        },
      },
    },

    // ── Section 2: How Natural Selection Works ──────────────────
    {
      title: 'How Natural Selection Works',
      diagram: 'NaturalSelectionDiagram',
      beginnerContent:
        'Imagine a population of beetles on a forest floor. Most are green, blending with leaf litter, but a few carry a mutation making them brown. A bird that hunts by sight arrives. During the dry season, the forest floor is brown soil and dead leaves — green beetles stand out, brown beetles hide. Birds eat more green beetles. More brown beetles survive to reproduce. Since color is inherited, the next generation has more brown beetles. Over many generations, the population shifts from green to brown.\n\n' +
        'This is natural selection: not a conscious plan, not a beetle "trying" to change, but a statistical outcome of **who survives and reproduces**.\n\n' +
        '**Three conditions must be met:**\n\n' +
        '| Condition | Why it\'s needed | If it fails... |\n' +
        '|-----------|----------------|----------------|\n' +
        '| Variation exists | Nothing to select from if all identical | No evolution possible |\n' +
        '| Variation is heritable | Diet-caused differences won\'t pass to offspring | Changes die with the individual |\n' +
        '| Variation affects fitness | A neutral trait won\'t be selected for or against | Trait drifts randomly (genetic drift) |\n\n' +
        '**Four types of natural selection:**\n\n' +
        '| Type | What happens | Real example |\n' +
        '|------|-------------|---------------|\n' +
        '| **Directional** | Population shifts toward one extreme | Peppered moths darkened during Industrial Revolution — dark moths survived better on soot-covered trees |\n' +
        '| **Stabilising** | Average is favoured, extremes eliminated | Human birth weight: very small or very large babies have lower survival |\n' +
        '| **Disruptive** | Both extremes favoured over the middle | African seedcrackers: large-billed and small-billed birds both do well on different seeds; medium-billed birds do worst |\n' +
        '| **Sexual** | Mating success trumps survival cost | Peacock\'s tail: makes him visible to predators but irresistible to peahens |\n\n' +
        '**A parallel in Assam:** In the industrial areas around Guwahati and Numaligarh refinery, dark-winged moths are more common near factories (bark is soot-darkened), while lighter moths dominate in the clean forests of Manas National Park. Same principle as England\'s famous peppered moth story, playing out in Assam.',
      intermediateContent:
        '**The allele frequency equation under selection:**\n\n' +
        '`Δp = pqs[ph + q(1 − h)] / w̄`\n\n' +
        '| Symbol | Meaning | Range |\n' +
        '|--------|---------|-------|\n' +
        '| p, q | Allele frequencies (p + q = 1) | 0 to 1 |\n' +
        '| s | Selection coefficient | 0 to 1 |\n' +
        '| h | Dominance coefficient | 0 = fully dominant, 0.5 = additive, 1 = fully recessive |\n' +
        '| w̄ | Mean population fitness | Calculated from genotype fitnesses |\n\n' +
        '**Worked example — directional selection on a dominant allele:**\n\n' +
        'Brown beetle color (B) is dominant over green (b). s = 0.05, h = 0 (complete dominance), starting frequency of B: p = 0.01.\n\n' +
        '| Generation | Freq of B (p) | % brown beetles | Notes |\n' +
        '|-----------|--------------|-----------------|-------|\n' +
        '| 0 | 0.01 | 2% | Mutation just appeared |\n' +
        '| 50 | 0.08 | 15% | Slowly increasing |\n' +
        '| 100 | 0.50 | 75% | Rapid rise at intermediate freq |\n' +
        '| 200 | 0.95 | 99.7% | Nearly fixed |\n' +
        '| 1000 | 0.999 | ~100% | Fixation (green allele nearly gone) |\n\n' +
        'Notice the **S-shaped trajectory**: slow at low and high frequencies (selection can\'t "see" rare recessives hiding in heterozygotes), fast in the middle.\n\n' +
        '**Stabilising selection** is modelled as a Gaussian fitness function:\n\n' +
        '`w(z) = exp(−(z − θ)² / 2ω²)`\n\n' +
        'where θ = optimal phenotype, ω = width of the fitness peak. Narrow ω → strong stabilising selection → low phenotypic variance.',
      advancedContent:
        '**Sexual selection — two mechanisms:**\n\n' +
        '| Mechanism | What it is | Example |\n' +
        '|-----------|-----------|----------|\n' +
        '| **Intrasexual** | Same-sex competition (usually male-male) | Deer antlers, elephant tusks, hoolock gibbon territorial calls |\n' +
        '| **Intersexual** | Mate choice (usually female choosing) | Peacock tails, bowerbird nests, frog calls |\n\n' +
        '**Three hypotheses for extreme ornaments:**\n\n' +
        '| Hypothesis | Proponent | Key idea | Prediction |\n' +
        '|-----------|-----------|----------|------------|\n' +
        '| Runaway selection | Fisher (1930) | Female preference + male trait are genetically correlated → both escalate | Ornament has no survival benefit |\n' +
        '| Handicap principle | Zahavi (1975) | Costly ornaments are honest signals of quality | Only genuinely fit males afford the cost |\n' +
        '| Parasite resistance | Hamilton & Zuk (1982) | Bright plumage = low parasite load | Ornament brightness correlates with immunocompetence |\n\n' +
        '**The Red Queen hypothesis and the lek paradox:**\n\n' +
        'If females consistently choose the "best" males, genetic variation for male quality should erode. Why doesn\'t it? The **Red Queen hypothesis** provides one answer: host-parasite coevolution constantly shifts what "best" means. A male genotype resistant to this year\'s parasite strain may be vulnerable to next year\'s. This maintains genetic variation through **frequency-dependent selection** — rare genotypes have an advantage because parasites haven\'t adapted to them yet.\n\n' +
        'Male hoolock gibbons produce elaborate dawn songs lasting 10–20 minutes. Song complexity correlates with territory quality and body condition. Females preferentially pair with males whose songs have more syllable types — a potential honest signal of cognitive and physical health.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Directional selection favours individuals at both extremes of a trait.', answer: false, explanation: 'Directional selection favours ONE extreme. Disruptive selection favours both extremes.' },
            { text: 'A peacock\'s tail is an example of sexual selection, even though it reduces survival.', answer: true, explanation: 'Sexual selection can favour traits that increase mating success even at a survival cost. The tail makes peacocks visible to predators but attractive to peahens.' },
            { text: 'Natural selection requires variation, heritability, and differential fitness.', answer: true, explanation: 'All three conditions must be met. Without variation there\'s nothing to select; without heritability, advantages die with the individual; without fitness effects, traits drift randomly.' },
            { text: 'Under stabilising selection, the population mean shifts over time.', answer: false, explanation: 'Stabilising selection reduces variance without shifting the mean — it eliminates extremes and favours the average phenotype.' },
          ],
        },
      },
    },

    // ── Section 3: Evidence for Evolution ───────────────────────
    {
      title: 'Evidence for Evolution',
      diagram: 'HomologousStructuresDiagram',
      beginnerContent:
        'The evidence for evolution comes from **multiple independent lines of inquiry** — and they all point to the same conclusion.\n\n' +
        '**1. The Fossil Record**\n\n' +
        'Fossils show organisms have changed dramatically over time. Transitional fossils capture species evolving from one form to another:\n\n' +
        '| Transitional fossil | Age | What it connects | Key features |\n' +
        '|--------------------|----|-----------------|---------------|\n' +
        '| **Tiktaalik** | 375 million years | Fish → land animals | Fish body with wrist-like fin bones, flat head, neck |\n' +
        '| **Archaeopteryx** | 150 million years | Dinosaurs → birds | Feathered wings + dinosaur teeth and bony tail |\n' +
        '| **Ambulocetus** | 49 million years | Land mammals → whales | Four legs + whale-like skull, hunted in shallow water |\n' +
        '| **Sivapithecus** | 12 million years | Early primates → orangutans | Found in the Siwalik Hills (NE India/Nepal border) |\n\n' +
        '**2. Homologous Structures**\n\n' +
        'The bones in your arm, a whale\'s flipper, a bat\'s wing, and a dog\'s leg follow the same pattern: humerus → radius + ulna → carpals → phalanges. **Explore the diagram above** to see this bone-by-bone.\n\n' +
        '| Limb | Function | Same bones? |\n' +
        '|------|----------|-------------|\n' +
        '| Human arm | Grasping, writing | ✅ Yes — all share humerus, radius, ulna |\n' +
        '| Whale flipper | Swimming | ✅ Yes — bones shortened and flattened |\n' +
        '| Bat wing | Flying | ✅ Yes — fingers elongated to support membrane |\n' +
        '| Dog foreleg | Running | ✅ Yes — same plan, proportions differ |\n\n' +
        'This makes no sense if each was designed independently — but it makes perfect sense if all four inherited the same bone plan from a **common ancestor** and then modified it.\n\n' +
        '**3. DNA Evidence**\n\n' +
        'All living organisms use the same genetic code. By comparing DNA, scientists measure relatedness:\n\n' +
        '| Comparison | Shared DNA | Divergence time |\n' +
        '|-----------|-----------|------------------|\n' +
        '| Human vs chimpanzee | ~98.7% | ~6–7 million years ago |\n' +
        '| Human vs hoolock gibbon | ~96% | ~20 million years ago |\n' +
        '| Human vs dog | ~84% | ~85 million years ago |\n' +
        '| Human vs banana | ~60% | ~1.5 billion years ago |\n\n' +
        'The Gangetic river dolphin (*Platanista gangetica*) found in the Brahmaputra has tiny, nearly sightless eyes — a vestigial structure. Its ancestors had functional eyes, but millions of years in murky river water made eyesight useless. Selection stopped maintaining the eyes, and they degenerated. Yet the dolphin\'s sonar system is extraordinarily refined — selection *maintained* what matters.',
      intermediateContent:
        '**Molecular clocks — dating divergence from DNA**\n\n' +
        'Neutral mutations accumulate at a roughly constant rate, creating a "molecular clock":\n\n' +
        '| Molecule | Substitution rate | Calibration |\n' +
        '|----------|------------------|-------------|\n' +
        '| Mitochondrial DNA | ~2% per million years (mammals) | Fossil-calibrated |\n' +
        '| Cytochrome c protein | ~1 amino acid change per 20 million years | Cross-kingdom comparison |\n\n' +
        '**Worked example — dating a divergence:**\n\n' +
        'Two species differ by 10% in their mtDNA. At 2% per million years:\n\n' +
        '`Divergence time = 10% / 2% per Myr = 5 million years ago`\n\n' +
        '| Species pair | mtDNA difference | Estimated divergence | Fossil record agrees? |\n' +
        '|-------------|-----------------|---------------------|----------------------|\n' +
        '| Human vs chimp | 1.2% | ~6 Myr | ✅ (Sahelanthropus, ~7 Myr) |\n' +
        '| Human vs gorilla | 1.6% | ~8 Myr | ✅ |\n' +
        '| Human vs orangutan | 3.1% | ~15.5 Myr | ✅ |\n' +
        '| Horse vs donkey | 8% | ~4 Myr | ✅ |\n\n' +
        '**Pseudogenes — broken genes as evidence:**\n\n' +
        'Humans and guinea pigs both have a broken **GULO gene** (needed to synthesise vitamin C) with the *same inactivating mutations*. The probability of identical random breaks in the same gene positions is astronomically small — this is strong evidence of shared ancestry from a common ancestor that lost the gene.\n\n' +
        '**Cytochrome c comparison across animals:**\n\n' +
        '| Species | Amino acid differences from human cytochrome c (out of 104) | Implied divergence |\n' +
        '|---------|-----------------------------------------------------------|-----------------|\n' +
        '| Chimpanzee | 0 | Very recent |\n' +
        '| Rhesus monkey | 1 | ~25 Myr |\n' +
        '| Dog | 11 | ~85 Myr |\n' +
        '| Tuna | 21 | ~420 Myr |\n' +
        '| Yeast | 44 | ~1 billion+ years |',
      advancedContent:
        '**Phylogenomics — whole-genome evolutionary analysis**\n\n' +
        'Alignment of orthologous sequences across species reveals synonymous (dS) and nonsynonymous (dN) substitution rates. The ratio **dN/dS (ω)** reveals selection regime:\n\n' +
        '| ω value | Interpretation | Example genes |\n' +
        '|---------|---------------|---------------|\n' +
        '| ω < 1 | **Purifying selection** — mutations removed | Most housekeeping genes (~75% of genome) |\n' +
        '| ω ≈ 1 | **Neutral evolution** — mutations tolerated | Pseudogenes, introns |\n' +
        '| ω > 1 | **Positive selection** — mutations favoured | FOXP2 (language), LCT (lactose tolerance), EPAS1 (altitude) |\n\n' +
        '**Endogenous retroviruses (ERVs) — viral fossils in your DNA:**\n\n' +
        '~8% of the human genome consists of ancient retroviral DNA. When a retrovirus infected a germ cell millions of years ago, its DNA was permanently inserted and inherited by all descendants.\n\n' +
        '| Evidence | Significance |\n' +
        '|---------|-------------|\n' +
        '| Humans and chimps share ERVs at *identical* genomic positions | Common ancestor was infected before the species split |\n' +
        '| Probability of two independent insertions at the same site | ~1 in 3 billion (effectively zero) |\n' +
        '| More distant species share fewer ERV positions | Consistent with phylogenetic tree |\n\n' +
        '**Horizontal gene transfer (HGT)** complicates tree-based phylogenetics. In prokaryotes, 20–60% of genes show phylogenetic incongruence from HGT, producing a "web of life" rather than a clean tree. In eukaryotes, HGT is rarer but documented: the *bdelloid rotifers* have acquired ~8% of their genes from bacteria, fungi, and plants — an extraordinary case of cross-kingdom gene theft.\n\n' +
        'Studies of the hoolock gibbon genome revealed rapid chromosomal rearrangements (gibbons have the fastest karyotype evolution among apes — 24 major rearrangements vs 10 in the human lineage since their common ancestor). The LAVA retrotransposon, unique to gibbons, may drive this accelerated chromosomal reshuffling.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each type of evidence to its example',
          pairs: [
            ['Fossil record', 'Tiktaalik — a 375-million-year-old creature with both fish and tetrapod features'],
            ['Homologous structures', 'Human arm, whale flipper, and bat wing share the same bone layout'],
            ['DNA comparison', 'Humans and chimpanzees share 98.7% of their DNA'],
            ['Vestigial structures', 'Brahmaputra river dolphin\'s tiny, nearly sightless eyes'],
            ['Pseudogenes', 'Humans and guinea pigs have the same broken vitamin C gene (GULO)'],
          ],
        },
      },
    },

    // ── Section 4: Speciation ───────────────────────────────────
    {
      title: 'Speciation: How One Species Becomes Two',
      diagram: 'FrogBiodiversityDiagram',
      beginnerContent:
        'Speciation is the process by which one species splits into two or more distinct species. **Explore the diagram above** to see how Northeast India\'s dramatic landscape has created extraordinary frog diversity through speciation.\n\n' +
        '**The most common mechanism: allopatric speciation (geographic isolation)**\n\n' +
        'When a population is physically divided — by a mountain range, a river, or rising sea level — gene flow between the groups ceases. Each group faces different conditions, different predators, different food sources. Over thousands to millions of years, they diverge genetically until they can no longer interbreed.\n\n' +
        '| Step | What happens | Example |\n' +
        '|------|-------------|----------|\n' +
        '| 1. Barrier forms | River changes course, mountain rises, group colonises island | The Brahmaputra River divides populations of many small mammals |\n' +
        '| 2. Isolation | No gene flow between separated groups | Frogs on opposite banks can\'t cross |\n' +
        '| 3. Divergence | Different selection pressures + drift cause genetic changes | One population adapts to drier hillsides, the other to wet floodplains |\n' +
        '| 4. Reproductive isolation | Even if reunited, they can no longer interbreed | Different mating calls, different breeding seasons, or genetic incompatibility |\n\n' +
        '**A real speciation factory: Northeast India**\n\n' +
        'This region sits at the junction of three biogeographic realms (Indian, Indo-Malayan, Indo-Chinese), with deep valleys separated by steep ridges. It\'s one of the most species-rich places on Earth — and the topography is the reason why:\n\n' +
        '| Group | Species count | Why so many? |\n' +
        '|-------|----------------------|---------------|\n' +
        '| Frogs & toads | **~200 species** | Isolated valleys + high rainfall = ideal amphibian habitat |\n' +
        '| Rhododendrons | **~60+ species** | Each mountain ridge isolates a population |\n' +
        '| Primates | **12 species** (incl. hoolock gibbon, slow loris, capped langur) | Forest fragmentation by rivers and ridges |\n' +
        '| Orchids | **~800+ species** | Microclimates in every valley |\n\n' +
        '**Sympatric speciation** — splitting *without* geographic barriers — is rarer but real. **Polyploidy** (a cell division error that doubles chromosomes) can instantly create a new species: the hybrid has mismatched chromosomes and cannot breed with either parent. Many crop plants (wheat, cotton, sugarcane) are polyploids.',
      intermediateContent:
        '**Reproductive isolation — the barriers that keep species apart:**\n\n' +
        '| Barrier type | Category | Mechanism | Animal example |\n' +
        '|-------------|----------|-----------|----------------|\n' +
        '| Habitat isolation | Prezygotic | Species live in different microhabitats | Two frog species in the same Meghalaya forest — one on the forest floor, one in the canopy |\n' +
        '| Temporal isolation | Prezygotic | Different breeding seasons | Two firefly species in Majuli — one flashes in June, the other in September |\n' +
        '| Behavioural isolation | Prezygotic | Different mating calls or courtship | Male hoolock gibbons attract mates with species-specific songs |\n' +
        '| Mechanical isolation | Prezygotic | Physical incompatibility | Different-shaped genitalia in closely related beetle species |\n' +
        '| Gametic isolation | Prezygotic | Sperm cannot fertilise egg | Sea urchin species with incompatible sperm-egg recognition proteins |\n' +
        '| Hybrid inviability | Postzygotic | Embryo fails to develop | Sheep × goat crosses: embryo dies early |\n' +
        '| Hybrid sterility | Postzygotic | Offspring sterile | Mule (horse × donkey): 63 chromosomes can\'t pair properly in meiosis |\n' +
        '| Hybrid breakdown | Postzygotic | F₂ or later generations fail | Some rice hybrid lines deteriorate in later generations |\n\n' +
        '**Ring species — speciation in progress:**\n\n' +
        'The greenish warbler (*Phylloscopus trochiloides*) forms a ring around the Himalayas. Adjacent populations interbreed, but the two ends of the ring (meeting in Siberia) are reproductively isolated. This is speciation caught in the act — the gradual accumulation of differences along the ring has created a reproductive barrier at the endpoints.\n\n' +
        '**NE India\'s frog radiation — a worked example:**\n\n' +
        'The genus *Nyctibatrachus* (night frogs) diversified in the Western Ghats, but NE India has its own parallel radiation in *Amolops* (torrent frogs). Molecular clock analysis shows:\n\n' +
        '| Split event | Estimated time | Cause |\n' +
        '|------------|---------------|-------|\n' +
        '| *Amolops* ancestral split | ~25 Myr ago | Uplift of NE Indian hills |\n' +
        '| Brahmaputra valley splits | ~10 Myr ago | River drainage changes |\n' +
        '| Modern species pairs | ~2–5 Myr ago | Pleistocene glacial isolation |',
      advancedContent:
        '**The Dobzhansky-Muller model — how genetic incompatibilities evolve**\n\n' +
        'No population needs to pass through a maladaptive intermediate. In population 1, allele A mutates to A\' (compatible with B). In population 2, allele B mutates to B\' (compatible with A). But A\' and B\' have never been tested together — when populations meet, hybrids carrying A\'B\' may be inviable or infertile.\n\n' +
        '| Population 1 | Population 2 | Hybrid |\n' +
        '|-------------|-------------|--------|\n' +
        '| Ancestral: AB | Ancestral: AB | — |\n' +
        '| Mutates to: A\'B | Mutates to: AB\' | A\'B\' → incompatible? |\n' +
        '| A\'B is fit (tested) | AB\' is fit (tested) | A\'B\' was **never tested by selection** |\n\n' +
        'Genome scans in *Drosophila* identified specific **speciation genes**: Hmr and Lhr in *D. melanogaster/simulans* hybrids encode chromatin proteins whose incompatible interaction causes hybrid lethality.\n\n' +
        '**Ecological speciation — divergent adaptation drives reproductive isolation:**\n\n' +
        'Stickleback fish in post-glacial lakes diverged into benthic (bottom-feeding) and limnetic (open-water) forms within ~12,000 years. The two forms differ in body shape, jaw morphology, and mate preference — assortative mating evolved as a by-product of ecological adaptation.\n\n' +
        '| Trait | Benthic form | Limnetic form |\n' +
        '|-------|-------------|---------------|\n' +
        '| Body | Deep, robust | Slender, streamlined |\n' +
        '| Jaw | Wide gape, few gill rakers | Narrow, many gill rakers |\n' +
        '| Diet | Invertebrates on lake bottom | Plankton in open water |\n' +
        '| Mate preference | Prefer benthic partners | Prefer limnetic partners |\n\n' +
        '**Speciation with gene flow:** Modern genomic studies show that speciation often proceeds *despite* ongoing hybridisation. Strong divergent selection on a few key loci (e.g., mate preference, habitat choice) can maintain species boundaries while the rest of the genome remains permeable — a "semipermeable species boundary" or "speciation island" model. This is now thought to be common rather than exceptional.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Allopatric speciation requires a physical barrier separating populations.', answer: true, explanation: 'Allopatric = "other homeland." A geographic barrier (river, mountain, ocean) stops gene flow, allowing the separated populations to diverge independently.' },
            { text: 'A mule (horse × donkey) is evidence that horses and donkeys are the same species.', answer: false, explanation: 'Mules are sterile hybrids. Horses (2n=64) and donkeys (2n=62) produce mules (2n=63) whose odd chromosome number prevents proper meiosis. They are separate species with postzygotic isolation.' },
            { text: 'Northeast India\'s deep valleys help explain its extraordinary biodiversity.', answer: true, explanation: 'Deep valleys separated by ridges act as natural barriers, isolating populations and driving allopatric speciation. NE India is one of the world\'s most species-rich regions.' },
            { text: 'Polyploidy can create a new species in a single generation.', answer: true, explanation: 'A chromosome-doubling event creates an individual that is reproductively isolated from both parents (mismatched chromosome numbers prevent viable offspring). This is instant sympatric speciation.' },
          ],
        },
      },
    },

    // ── Section 5: Adaptation ───────────────────────────────────
    {
      title: 'Adaptation: Built for Survival',
      diagram: 'DolphinAdaptationDiagram',
      beginnerContent:
        'An **adaptation** is a genetically encoded trait shaped by natural selection over many generations. It is built into the organism\'s DNA and passed to offspring. **Explore the diagram above** to see how the Gangetic river dolphin\'s body is a masterclass in adaptation.\n\n' +
        '**Three types of adaptation:**\n\n' +
        '| Type | What it is | Animal example from NE India |\n' +
        '|------|-----------|----------------------------|\n' +
        '| **Structural** | Physical body features | Gangetic river dolphin\'s long snout for catching fish in murky water |\n' +
        '| **Physiological** | Internal body chemistry | Red panda produces extra heat via non-shivering thermogenesis in cold Himalayan winters |\n' +
        '| **Behavioural** | Actions that improve survival | Asian elephants in Kaziranga migrate to higher ground before monsoon floods — learned behaviour passed through generations |\n\n' +
        '**Case study: NE India\'s remarkable adapted animals**\n\n' +
        '| Animal | Habitat | Key adaptations |\n' +
        '|--------|---------|------------------|\n' +
        '| **Gangetic river dolphin** | Murky Brahmaputra | Echolocation (sonar), vestigial eyes, flexible neck for bottom-feeding |\n' +
        '| **Red panda** | Temperate forests (2,200–4,800 m) | Dense fur, long bushy tail for warmth, false thumb for gripping bamboo |\n' +
        '| **Snow leopard** | High Himalayas (3,000–5,000 m) | Thick fur, wide paws (natural snowshoes), long tail for balance on cliffs |\n' +
        '| **One-horned rhino** | Kaziranga grasslands | Armour-like skin folds, semi-aquatic lifestyle, prehensile upper lip for grasping grass |\n' +
        '| **Hoolock gibbon** | Canopy forests | Extremely long arms (brachiation), ball-and-socket wrist joints, no tail (balance) |\n\n' +
        '**Adaptation vs Acclimation — don\'t confuse them!**\n\n' +
        '| | Adaptation | Acclimation |\n' +
        '|--|-----------|-------------|\n' +
        '| Timescale | Hundreds to millions of generations | Hours to weeks |\n' +
        '| Mechanism | Genetic change via natural selection | Reversible physiological adjustment |\n' +
        '| Inherited? | Yes — encoded in DNA | No — dies with the individual |\n' +
        '| Example | Snow leopard\'s thick fur | Your body making more red blood cells at high altitude (Tawang, 3,048 m) |\n' +
        '| Reversible? | No (except over evolutionary time) | Yes — returns to normal when conditions change |',
      intermediateContent:
        '**Convergent evolution — same problem, same solution, different ancestry:**\n\n' +
        'Unrelated species facing similar environments often evolve strikingly similar adaptations:\n\n' +
        '| Adaptation | Species 1 | Species 2 | Shared feature | Related? |\n' +
        '|-----------|----------|----------|----------------|----------|\n' +
        '| Echolocation | Bats | Dolphins | Emit sound pulses, listen for echoes | ❌ No |\n' +
        '| Streamlined body | Sharks (fish) | Dolphins (mammals) | Torpedo shape reduces drag | ❌ No |\n' +
        '| Camera eye | Octopus | Humans | Lens, iris, retina | ❌ No |\n' +
        '| Wings | Birds | Bats | Powered flight | ❌ Different bone structure |\n' +
        '| Prehensile tail | Spider monkey | Chameleon | Grasping tail for climbing | ❌ No |\n\n' +
        '**Altitude adaptation — acclimation timeline:**\n\n' +
        '| Timeframe | Physiological change | Measurement |\n' +
        '|-----------|---------------------|-------------|\n' +
        '| Hours | Breathing rate increases 20–50% | Hypoxic ventilatory response |\n' +
        '| Days | Kidneys boost erythropoietin (EPO) 2–4× | Red blood cells begin rising from ~5 to ~6–7 million/μL |\n' +
        '| Weeks | Capillary density increases in muscles, 2,3-BPG rises | Haemoglobin dissociation curve shifts right |\n' +
        '| Return to sea level | All changes reverse within ~3 weeks | EPO drops, spleen clears excess red cells |\n\n' +
        '**But Tibetans and Sherpas don\'t just acclimate — they carry genuine genetic adaptations:**\n\n' +
        '| Population | Key gene | Adaptation | Time under selection |\n' +
        '|-----------|---------|------------|--------------------|\n' +
        '| Tibetans | EPAS1 (from Denisovans!) | Lower haemoglobin — avoids dangerous blood thickening | ~3,000 years |\n' +
        '| Ethiopians | BHLHE41, CIC, LIPA | Different molecular pathway to same outcome | ~5,000 years |\n' +
        '| Andeans | Structural changes | Larger lungs, bigger chest, higher haemoglobin | ~11,000 years |\n\n' +
        'Three populations, three independent solutions to the same problem — **convergent genetic evolution** in humans.',
      advancedContent:
        '**The EPAS1 story — Denisovan introgression and adaptive evolution:**\n\n' +
        'The Tibetan EPAS1 haplotype is one of the clearest cases of **adaptive introgression** in humans:\n\n' +
        '| Finding | Detail |\n' +
        '|---------|--------|\n' +
        '| Origin | Introgressed from **Denisovans** (archaic hominins) into Tibetan ancestors |\n' +
        '| Function | Encodes HIF-2α, a hypoxia-inducible transcription factor |\n' +
        '| Effect | *Lower* haemoglobin at altitude (counterintuitive — prevents polycythaemia) |\n' +
        '| Selection coefficient | s ≈ 0.075 — among the strongest known in humans |\n' +
        '| Allele frequency | Near-zero → >70% in ~3,000 years |\n' +
        '| Health benefit | Avoids stroke and heart failure from excessively thick blood |\n\n' +
        '**Structural color as adaptation — the physics of iridescence:**\n\n' +
        'Many animals use **structural coloration** rather than pigments. The golden colour of Assam\'s muga silk, the iridescence of morpho butterfly wings, and the shimmering scales of the golden mahseer all arise from **nanoscale physical structures** that interfere with light waves (thin-film interference, diffraction gratings, photonic crystals). Unlike pigments, structural colors never fade because they depend on geometry, not chemistry.\n\n' +
        '| Animal | Structural mechanism | Adaptive function |\n' +
        '|--------|---------------------|-------------------|\n' +
        '| Morpho butterfly | Multi-layer thin-film interference | Startle predators, species recognition |\n' +
        '| Golden mahseer | Guanine crystal platelets in scales | Camouflage in dappled river light |\n' +
        '| Peacock feather | 2D photonic crystal in barbules | Sexual selection signal |\n' +
        '| Jewel beetle | Multilayer reflector in elytra | Thermoregulation + mate attraction |\n\n' +
        '**Trade-offs and constraints in adaptation:**\n\n' +
        'No adaptation is free — every improvement carries costs:\n\n' +
        '| Adaptation | Benefit | Cost (trade-off) |\n' +
        '|-----------|---------|------------------|\n' +
        '| Sickle cell allele (HbS) | Heterozygotes resist malaria | Homozygotes get sickle cell disease |\n' +
        '| Cheetah speed (~110 km/h) | Catches prey | Overheating after 30 seconds; fragile build |\n' +
        '| Elephant large body | Few predators, thermal inertia | Needs 150+ kg food/day; slow reproduction |\n' +
        '| Gibbon long arms | Superb brachiation | Clumsy on the ground; vulnerable in fragmented forests |',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each NE India animal to its key adaptation',
          pairs: [
            ['Gangetic river dolphin', 'Echolocation for hunting in murky Brahmaputra water; vestigial eyes'],
            ['Red panda', 'Dense fur + false thumb for gripping bamboo in cold Himalayan forests'],
            ['Snow leopard', 'Wide paws as natural snowshoes + long tail for balance on cliffs'],
            ['One-horned rhino', 'Armour-like skin folds + prehensile upper lip for grasping tall grass'],
            ['Hoolock gibbon', 'Extra-long arms + ball-and-socket wrists for swinging through the canopy'],
          ],
        },
      },
    },

    // ── Section 6: Evolutionary Trees & Classification ──────────
    {
      title: 'Reading Evolutionary Trees',
      diagram: 'PhylogeneticTreeDiagram',
      beginnerContent:
        'A **phylogenetic tree** (evolutionary tree) is a diagram showing how species are related through common ancestors. Learning to read one is like learning to read a family tree — except this family goes back billions of years.\n\n' +
        '**How to read a phylogenetic tree:**\n\n' +
        '| Feature | What it means |\n' +
        '|---------|---------------|\n' +
        '| **Tips** (branch ends) | Living species (or extinct ones, marked with †) |\n' +
        '| **Nodes** (branch points) | Common ancestors — the point where two lineages split |\n' +
        '| **Branch length** | Amount of evolutionary change (longer = more change) |\n' +
        '| **Root** | The most ancient common ancestor of all species on the tree |\n' +
        '| **Sister taxa** | Two species that share their most recent common ancestor |\n\n' +
        '**Explore the tree above** to see how NE India\'s animals fit into the larger tree of life.\n\n' +
        '**Example: Where do NE India\'s iconic animals belong?**\n\n' +
        '| Animal | Class | Order | Closest relatives |\n' +
        '|--------|-------|-------|-------------------|\n' +
        '| One-horned rhino | Mammalia | Perissodactyla (odd-toed) | Horses, tapirs (NOT elephants!) |\n' +
        '| Hoolock gibbon | Mammalia | Primates | Other apes (chimps, gorillas, humans) |\n' +
        '| Gangetic dolphin | Mammalia | Cetartiodactyla | Whales, hippos (NOT fish!) |\n' +
        '| King cobra | Reptilia | Squamata | Other elapid snakes |\n' +
        '| Golden mahseer | Actinopterygii | Cypriniformes | Carp, barbs, minnows |\n\n' +
        '**Common mistake:** A rhino looks more like an elephant than a horse. But DNA, bone structure, and fossils all confirm that rhinos are more closely related to horses. Appearances can be misleading — that\'s why we need phylogenetics.\n\n' +
        '**The three domains of life:**\n\n' +
        '| Domain | Cell type | Examples |\n' +
        '|--------|-----------|----------|\n' +
        '| **Bacteria** | Prokaryotic (no nucleus) | E. coli, Streptococcus |\n' +
        '| **Archaea** | Prokaryotic (distinct chemistry) | Extremophiles in hot springs |\n' +
        '| **Eukarya** | Eukaryotic (nucleus) | Animals, plants, fungi, protists |',
      intermediateContent:
        '**Building a phylogenetic tree from molecular data:**\n\n' +
        '| Method | Approach | Strengths | Weaknesses |\n' +
        '|--------|---------|-----------|------------|\n' +
        '| **Distance-based** (UPGMA, Neighbor-Joining) | Calculate genetic distance matrix → cluster | Fast, simple | Assumes constant evolution rate |\n' +
        '| **Maximum Parsimony** | Find the tree requiring fewest evolutionary changes | Intuitive | Can fail with rapid evolution (long-branch attraction) |\n' +
        '| **Maximum Likelihood** | Find the tree most likely to produce the observed data | Statistically rigorous | Computationally expensive |\n' +
        '| **Bayesian** (MrBayes) | Posterior probability of trees given data + prior | Provides confidence measures | Requires prior assumptions |\n\n' +
        '**Worked example — building a simple tree from cytochrome c:**\n\n' +
        '| Species pair | Amino acid differences |\n' +
        '|-------------|----------------------|\n' +
        '| Human–Chimp | 0 |\n' +
        '| Human–Dog | 11 |\n' +
        '| Human–Tuna | 21 |\n' +
        '| Dog–Tuna | 18 |\n\n' +
        'Step 1: Human and Chimp are most similar (0 differences) → they are sister taxa.\n' +
        'Step 2: Dog is next closest (11 from human) → joins the human-chimp clade.\n' +
        'Step 3: Tuna is most distant → outgroup.\n\n' +
        'Result: ((Human, Chimp), Dog), Tuna) — tuna branches off earliest, confirming the fossil record.\n\n' +
        '**Molecular clock calibration:**\n\n' +
        'If the human-tuna split is dated to ~420 Myr by fossils, and they differ by 21 amino acids in cytochrome c, the rate is ~1 substitution per 20 Myr. We can then date other splits without fossils:\n\n' +
        '`Human–Dog: 11 × 20 Myr = ~220 Myr (actual: ~85 Myr)`\n\n' +
        'The discrepancy shows that molecular clocks are **approximate** — rates vary across lineages. Modern methods use multiple genes and statistical models to account for rate variation.',
      advancedContent:
        '**Coalescent theory — tracing gene genealogies backwards in time:**\n\n' +
        'Instead of building species trees forward, coalescent theory traces gene copies *backward* to their most recent common ancestor (MRCA).\n\n' +
        '| Concept | Definition | Significance |\n' +
        '|---------|-----------|-------------|\n' +
        '| Coalescence time | Time for two gene copies to trace back to their MRCA | Expected: 2Nₑ generations (diploid) |\n' +
        '| Gene tree vs species tree | Different genes may have different genealogies | Incomplete lineage sorting |\n' +
        '| Effective population size (Nₑ) | The genetic equivalent of population size | Nₑ < census N due to variance in reproductive success |\n\n' +
        '**Incomplete lineage sorting (ILS):** When speciation events are rapid (short internodes), ancestral polymorphisms may not sort into reciprocal monophyly before the next split. ~30% of the human genome supports a human-gorilla clade rather than human-chimp — not because the phylogeny is wrong, but because ancestral alleles "sorted" differently in different genomic regions.\n\n' +
        '**Network phylogenetics:**\n\n' +
        'When hybridisation, HGT, or ILS are common, tree topology is misleading. **Phylogenetic networks** (reticulate evolution) explicitly model these non-tree-like events:\n\n' +
        '| Event | Tree model | Network model |\n' +
        '|-------|-----------|---------------|\n' +
        '| Hybridisation | Ignored or conflated | Modelled as reticulation nodes |\n' +
        '| HGT in bacteria | Creates impossible topologies | Represented as lateral edges |\n' +
        '| ILS | Gene tree discordance unexplained | Captured by multispecies coalescent |\n\n' +
        '**Application to NE Indian biodiversity:** Phylogenomic analysis of *Amolops* torrent frogs across NE India revealed that what was classified as 5 species based on morphology is actually 12–15 species based on molecular data — many cryptic species hiding behind similar appearances. This "taxonomic inflation" has direct conservation implications: a species thought to be widespread may actually be several narrowly distributed species, each at greater extinction risk.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Rhinos are more closely related to elephants than to horses.', answer: false, explanation: 'Despite looking similar to elephants, rhinos belong to order Perissodactyla (odd-toed ungulates) alongside horses and tapirs. Elephants are in order Proboscidea — a completely different lineage.' },
            { text: 'A longer branch on a phylogenetic tree means more evolutionary change.', answer: true, explanation: 'Branch length represents the amount of genetic change (substitutions). Longer branches indicate more mutations accumulated since the split from a common ancestor.' },
            { text: 'Different genes in the same organism can give different phylogenetic trees.', answer: true, explanation: 'Incomplete lineage sorting, horizontal gene transfer, and hybridisation can cause different genes to have different genealogies. ~30% of the human genome actually supports a closer relationship to gorillas than chimps.' },
            { text: 'The Gangetic river dolphin is more closely related to fish than to cows.', answer: false, explanation: 'River dolphins are mammals in order Cetartiodactyla — they share a common ancestor with hippos and cows. Their fish-like body is convergent evolution, not shared ancestry.' },
          ],
        },
      },
    },

    // ── Section 7: Conservation & Extinction ────────────────────
    {
      title: 'Extinction, Conservation & Evolutionary Rescue',
      diagram: 'ElephantEcosystemDiagram',
      beginnerContent:
        'Evolution creates species. Extinction ends them. The history of life is a story of both.\n\n' +
        '**The Big Five mass extinctions:**\n\n' +
        '| Event | When | Cause | Species lost |\n' +
        '|-------|------|-------|--------------|\n' +
        '| End-Ordovician | 445 Myr ago | Ice age, sea level drop | ~85% marine species |\n' +
        '| Late Devonian | 375 Myr ago | Ocean anoxia, volcanic activity | ~75% species |\n' +
        '| End-Permian ("The Great Dying") | 252 Myr ago | Siberian volcanic eruptions | **~96% species** |\n' +
        '| End-Triassic | 201 Myr ago | Volcanic CO₂, ocean acidification | ~80% species |\n' +
        '| End-Cretaceous | 66 Myr ago | Asteroid impact (Chicxulub) | ~76% species (including non-avian dinosaurs) |\n\n' +
        'After each extinction, life bounced back — but with entirely new players. Dinosaurs dominated after the Permian extinction; mammals filled the gap after the dinosaurs disappeared.\n\n' +
        '**Are we causing the Sixth Extinction?**\n\n' +
        'Current extinction rates are **100–1,000× higher** than the natural background rate. The causes are human:\n\n' +
        '| Threat | How it works | Example |\n' +
        '|--------|-------------|------------------|\n' +
        '| Habitat loss | Forests cleared for farms, roads, cities | Hoolock gibbon habitat shrinking by ~1.5% per year |\n' +
        '| Poaching | Animals killed for horns, skins, meat | Rhino horn poaching in Kaziranga (53 rhinos killed in 2013 alone) |\n' +
        '| Climate change | Temperature/rainfall shifts faster than species can adapt | Himalayan snowline retreating — snow leopard habitat shrinking |\n' +
        '| Invasive species | Non-native species outcompete or prey on native ones | Water hyacinth choking Assam\'s wetlands |\n\n' +
        '**Explore the diagram above** to see how the Asian elephant functions as a keystone species in the ecosystem — and what happens when it disappears.\n\n' +
        '**The hopeful side:** Conservation works. The one-horned rhino recovered from ~200 to ~4,000+ individuals thanks to protected areas and anti-poaching patrols. The hoolock gibbon, while still endangered, has stable populations in well-managed reserves like Hoollongapar Gibbon Sanctuary.',
      intermediateContent:
        '**Minimum Viable Population (MVP) — how small is too small?**\n\n' +
        'Small populations face three genetic threats:\n\n' +
        '| Threat | Mechanism | Consequence |\n' +
        '|--------|-----------|-------------|\n' +
        '| **Genetic drift** | Random allele frequency changes amplified in small populations | Loss of beneficial alleles by chance |\n' +
        '| **Inbreeding depression** | Mating between relatives increases homozygosity | Harmful recessive alleles expressed → reduced fitness |\n' +
        '| **Loss of genetic diversity** | Fewer alleles in the gene pool | Reduced ability to adapt to new diseases or environmental changes |\n\n' +
        'The **50/500 rule** (Franklin, 1980):\n\n' +
        '| Threshold | Purpose | Reasoning |\n' +
        '|-----------|---------|----------|\n' +
        '| Nₑ ≥ 50 | Avoid inbreeding depression in the short term | Inbreeding rate < 1% per generation |\n' +
        '| Nₑ ≥ 500 | Maintain evolutionary potential long-term | Mutation-drift balance preserves genetic variation |\n\n' +
        '**NE India conservation genetics:**\n\n' +
        '| Species | Census population | Estimated Nₑ | Genetic concern |\n' +
        '|---------|-----------------|-------------|------------------|\n' +
        '| One-horned rhino | ~4,000 | ~800–1,200 | Moderate — above 500 but concentrated in few sites |\n' +
        '| Hoolock gibbon | ~12,000 | ~2,000–4,000 | **High** — fragmented into small, isolated groups |\n' +
        '| Pygmy hog | ~250 | ~50–80 | **Critical** — well below 500 threshold |\n' +
        '| Bengal florican | ~500 | ~100–200 | **Critical** — grassland habitat vanishing |\n\n' +
        '**Evolutionary rescue:** Can a population evolve fast enough to survive a rapid environmental change? For rescue to succeed: (1) sufficient genetic variation must exist, (2) the rate of adaptive evolution must exceed the rate of population decline, and (3) the population must not drop below the point of no return (Allee effect). Climate change is testing whether NE India\'s species can keep up.',
      advancedContent:
        '**Population genetics of conservation — the drift-selection balance:**\n\n' +
        'In small populations, genetic drift overpowers natural selection when |s| < 1/(2Nₑ). This means:\n\n' +
        '| Nₑ | Alleles effectively neutral when |s| < | Implication |\n' +
        '|----|---------------------------------------|------------|\n' +
        '| 10,000 | 0.00005 | Only very weak selection is ineffective |\n' +
        '| 500 | 0.001 | Mildly deleterious mutations can fix |\n' +
        '| 50 | 0.01 | Even moderately harmful mutations drift to fixation |\n\n' +
        'This explains **mutational meltdown**: in very small populations, deleterious mutations accumulate faster than selection can remove them → fitness declines → population shrinks further → more drift → extinction spiral.\n\n' +
        '**Conservation genomics tools:**\n\n' +
        '| Tool | What it measures | Application |\n' +
        '|------|-----------------|-------------|\n' +
        '| **Heterozygosity (H)** | Proportion of heterozygous loci | Low H = inbreeding, low adaptive potential |\n' +
        '| **Fst** | Genetic differentiation between populations | High Fst = isolated populations, candidates for genetic rescue |\n' +
        '| **Runs of homozygosity (ROH)** | Long stretches of identical alleles | Recent inbreeding (long ROH) vs ancient bottleneck (short ROH) |\n' +
        '| **Effective population size (Nₑ)** | Genetic equivalent of census size | Nₑ/N ratio typically 0.1–0.3 in wildlife |\n\n' +
        '**Genetic rescue — managed gene flow:**\n\n' +
        'When isolated populations suffer inbreeding depression, introducing individuals from a different population can restore genetic diversity. The Florida panther was rescued from near-extinction (Nₑ ≈ 25, severe inbreeding — heart defects, low sperm quality) by introducing 8 Texas pumas in 1995. Within 12 years, heterozygosity increased, survival improved, and the population tripled.\n\n' +
        '**De-extinction debate:** CRISPR gene editing could theoretically resurrect extinct species by editing the genome of a close relative. The woolly mammoth project (Colossal Biosciences) aims to create cold-adapted Asian elephants. Ethical questions: Would the habitat support them? Would resources be better spent protecting living species? Is a gene-edited elephant really a mammoth?',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each conservation concept to its definition',
          pairs: [
            ['Genetic drift', 'Random changes in allele frequency, strongest in small populations'],
            ['Inbreeding depression', 'Reduced fitness from mating between relatives — harmful recessives expressed'],
            ['Minimum viable population', 'Smallest population size that can survive long-term (Nₑ ≥ 500 for evolutionary potential)'],
            ['Evolutionary rescue', 'A population evolving fast enough to adapt before going extinct'],
            ['Genetic rescue', 'Introducing individuals from another population to restore genetic diversity'],
          ],
        },
      },
    },
  ],
};
