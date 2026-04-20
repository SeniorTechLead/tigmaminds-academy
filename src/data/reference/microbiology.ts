import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'microbiology',
  title: 'Microbiology',
  category: 'biology',
  tags: ['chemistry'],
  keywords: ['bacteria', 'virus', 'fungi', 'fermentation', 'antibiotic', 'enzyme', 'pathogen', 'immune'],
  icon: '🦠',
  tagline: 'The invisible world — bacteria, viruses, and fungi that shape health, soil, and fermentation.',
  relatedStories: ['witch-doctor', 'grandmothers-pitha', 'first-rice', 'little-chef'],
  understand: [
    // ── Section 1: Bacteria ───────────────────────────────────────
    {
      title: 'Bacteria',
      diagram: 'BacteriaStructureDiagram',
      beginnerContent:
        'Watch the animation above. One cell. Now two. Now four. The counter shows real-world time at the natural rate: *E. coli* divides every 20 minutes. After **one hour**: 8 cells. After 4 hours: a few thousand. After **7 hours from a single cell: 2 million bacteria.** By morning if nothing stopped them: **more bacteria than there are people on Earth.** This is why an infection can flip from "feeling a bit off" to "in the ICU" in 24 hours.\n\n' +
        'A single bacterium is 1 micrometre long — a hundredth the width of a human hair. Invisible individually, yet a spoonful of your garden soil contains more of them than Earth has humans. They\'re in your gut (you have more bacterial cells than human cells in your body), on your skin, in clouds, in boiling hot springs, in Antarctic ice, in oil wells 3km underground. There is nowhere on Earth bacteria don\'t live.\n\n' +
        'Bacteria are **prokaryotes** — they have no nucleus. Their DNA floats freely inside them as a single circular loop. Think of a eukaryotic cell (like yours) as a filing cabinet with DNA locked in a special drawer (the nucleus). A bacterium is a one-room studio apartment — DNA just sits in the middle, everything else happens around it. That simplicity is why they divide so fast.\n\n' +
        '**What does a bacterium look like inside?**\n\n' +
        '| Part | What it does | Analogy |\n' +
        '|------|-------------|--------|\n' +
        '| **Cell wall** | Rigid outer shell (peptidoglycan) | A cardboard box around a water balloon |\n' +
        '| **Cell membrane** | Controls what enters/exits | Security gate at a building |\n' +
        '| **Cytoplasm** | Jelly-like fluid inside | The water inside a balloon |\n' +
        '| **Ribosomes** | Make proteins | Assembly-line workers |\n' +
        '| **Circular DNA** | Instructions for everything | Recipe book |\n' +
        '| **Plasmids** | Extra DNA with bonus genes | Post-it notes with extra tips |\n' +
        '| **Flagellum** | Whip-like tail for swimming | Boat propeller |\n' +
        '| **Capsule** | Sticky outer coat (some bacteria) | Raincoat — helps evade immune cells |\n\n' +
        'Bacteria come in **three main shapes**:\n\n' +
        '| Shape | Name | Example | Think of... |\n' +
        '|-------|------|---------|-------------|\n' +
        '| Sphere | **Cocci** | Staphylococcus (skin infections) | Tennis balls |\n' +
        '| Rod | **Bacilli** | E. coli (gut bacterium) | Capsule pills |\n' +
        '| Spiral | **Spirilla** | Treponema (syphilis) | Corkscrews |\n\n' +
        'Bacteria reproduce by **binary fission** — one cell copies its DNA, then splits into two identical daughter cells. Under ideal conditions, E. coli divides every 20 minutes. That means one bacterium could become **over a billion** in just 10 hours.\n\n' +
        '**Are all bacteria bad?** Not at all — most are harmless or actively helpful:\n\n' +
        '| Good bacteria | What they do |\n' +
        '|--------------|-------------|\n' +
        '| **Gut microbiome** (~38 trillion bacteria) | Digest food, make vitamins B12 and K, train your immune system |\n' +
        '| **Rhizobium** (soil) | Fix nitrogen on legume roots — natural fertiliser that Assam\'s rice-pulse rotation depends on |\n' +
        '| **Lactobacillus** (dairy/fermented food) | Turn milk into doi (yogurt), preserve khorisa (bamboo shoot) |\n\n' +
        'Pathogenic (disease-causing) bacteria are a small minority, but they include serious threats like *Mycobacterium tuberculosis* (TB), *Vibrio cholerae* (cholera — historically devastating in the Brahmaputra floodplains), and *Salmonella* (food poisoning).',
      intermediateContent:
        '**Gram staining** — the single most important lab technique in bacteriology — divides bacteria into two groups based on cell wall structure:\n\n' +
        '| Feature | Gram-positive | Gram-negative |\n' +
        '|---------|--------------|---------------|\n' +
        '| **Peptidoglycan layer** | Thick (20–80 nm) | Thin (5–10 nm) |\n' +
        '| **Outer membrane** | Absent | Present (contains LPS) |\n' +
        '| **Stain colour** | Purple (retains crystal violet) | Pink (counterstain safranin) |\n' +
        '| **Example** | Staphylococcus, Streptococcus | E. coli, Salmonella |\n' +
        '| **Penicillin effect** | Very effective | Poorly penetrates outer membrane |\n\n' +
        'This distinction is clinically critical: a doctor seeing a Gram-stained slide can choose the right antibiotic in minutes.\n\n' +
        '**Bacterial growth in batch culture follows four phases:**\n\n' +
        '| Phase | What happens | Growth rate |\n' +
        '|-------|-------------|-------------|\n' +
        '| **Lag** | Bacteria adapt to new medium, synthesise enzymes | ≈ 0 |\n' +
        '| **Log (exponential)** | Rapid division: N = N₀ × 2^(t/g), where g = generation time | Maximum |\n' +
        '| **Stationary** | Nutrients deplete; death rate = birth rate | ≈ 0 (net) |\n' +
        '| **Decline** | Waste accumulates, cells die | Negative |\n\n' +
        '**Worked example — exponential growth:**\n\n' +
        'Starting with N₀ = 100 E. coli cells (generation time g = 20 min), how many cells after 4 hours?\n\n' +
        't = 240 min, so number of generations = 240/20 = 12.\n\n' +
        'N = 100 × 2¹² = 100 × 4,096 = **409,600 cells**.\n\n' +
        'After 24 hours (72 generations): 100 × 2⁷² ≈ 4.7 × 10²³ — more than Avogadro\'s number. In reality, the logistic curve plateaus at the carrying capacity long before this.',
      advancedContent:
        '**Antibiotic resistance mechanisms — how bacteria fight back:**\n\n' +
        '| Mechanism | How it works | Example |\n' +
        '|-----------|-------------|--------|\n' +
        '| **Enzyme degradation** | Bacteria produce enzymes that destroy the drug | β-lactamase cleaves penicillin\'s β-lactam ring |\n' +
        '| **Target modification** | Mutated target no longer binds the drug | MRSA: altered PBP2a (mecA gene) has low β-lactam affinity |\n' +
        '| **Efflux pumps** | Membrane proteins actively eject the drug | Tetracycline resistance in E. coli |\n' +
        '| **Reduced permeability** | Fewer/smaller porin channels block drug entry | Carbapenem resistance in Pseudomonas |\n\n' +
        'Resistance genes spread via **horizontal gene transfer** (HGT):\n\n' +
        '| HGT method | Mechanism | Speed of spread |\n' +
        '|-----------|-----------|----------------|\n' +
        '| **Conjugation** | F-pilus bridges two cells; plasmid DNA transferred directly | Fast — can cross species |\n' +
        '| **Transformation** | Cell picks up free DNA from dead neighbours | Moderate — requires competence |\n' +
        '| **Transduction** | Bacteriophage accidentally packages host DNA and delivers it | Variable — phage-dependent |\n\n' +
        '**Population genetics of resistance:** If antibiotic use creates selection coefficient s = 0.3 for resistant strains, the resistant allele can go from 0.1% frequency to >99% in ~50 bacterial generations — roughly 17 hours for E. coli. Compensatory mutations that restore fitness without losing resistance make reversion unlikely, so once resistance evolves it tends to persist even after antibiotic pressure is removed.\n\n' +
        '**CRISPR** was originally discovered as a bacterial immune system against phages: spacer sequences from past infections are stored in the bacterial genome and guide Cas nucleases to recognise and destroy matching viral DNA — adaptive immunity in prokaryotes.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each bacterial structure to its function',
          pairs: [
            ['Peptidoglycan cell wall', 'Rigid outer shell — gives shape and prevents osmotic bursting'],
            ['Plasmid', 'Small extra DNA ring — can carry antibiotic resistance genes'],
            ['Flagellum', 'Whip-like tail that rotates for swimming'],
            ['Ribosome', 'Molecular machine that translates mRNA into proteins'],
            ['Capsule', 'Sticky polysaccharide coat — helps evade immune cells'],
          ],
        },
      },
    },

    // ── Section 2: Viruses ────────────────────────────────────────
    {
      title: 'Viruses',
      diagram: 'VirusReplicationDiagram',
      beginnerContent:
        'Watch the diagram. The spider-legged thing landing on the green bacterium is a **bacteriophage** — a virus that infects bacteria. It grabs the cell surface. Its tail contracts like a syringe. It injects its DNA. Then — this is the horror — the bacterium\'s own machinery reads the viral instructions and starts building 100, 200, 300 new phages inside itself. When the cell can hold no more, it **bursts**. All those new phages spray out to find fresh hosts. This all happens in about 25 minutes.\n\n' +
        'Here\'s what should unsettle you: **a virus is not alive.** It doesn\'t eat. It doesn\'t grow. It doesn\'t move on its own. It has no metabolism. It\'s just a **packet of genetic instructions in a protein wrapper** — DNA or RNA (never both), encased in a capsid, sometimes with a stolen lipid envelope. A virus drifting in the air is as dead as a rock. Until it touches a cell.\n\n' +
        'Think of it as a **USB stick with malware**. Harmless on a shelf. Plug it into a computer, and the "instructions" hijack the hardware to replicate the malware until the system crashes. A virus is the biological version. The cell is the computer.\n\n' +
        '**Two replication strategies:**\n\n' +
        '| Strategy | What happens | Analogy |\n' +
        '|----------|-------------|--------|\n' +
        '| **Lytic cycle** | Virus enters cell → hijacks ribosomes → makes hundreds of copies → cell **bursts** (lyses) → new viruses spread | A photocopier making copies until it jams and explodes |\n' +
        '| **Lysogenic cycle** | Viral DNA quietly **integrates** into host chromosome → copied with every cell division → can switch to lytic later | A sleeper agent embedded in an organisation |\n\n' +
        '**Why antibiotics don\'t work on viruses:**\n\n' +
        '| Antibiotics target... | Viruses lack... |\n' +
        '|----------------------|----------------|\n' +
        '| Bacterial cell walls | No cell wall |\n' +
        '| Bacterial ribosomes | No ribosomes — they use yours |\n' +
        '| Bacterial metabolism | No metabolism |\n\n' +
        'Taking antibiotics for a cold or flu does **zero** against the virus and only breeds antibiotic-resistant bacteria in your gut.\n\n' +
        '**Vaccines** work by training your immune system to recognise a virus *before* you get sick:\n\n' +
        '| Vaccine type | What it contains | Example |\n' +
        '|-------------|-----------------|--------|\n' +
        '| Live attenuated | Weakened virus | MMR (measles, mumps, rubella) |\n' +
        '| Inactivated | Killed virus | Polio (IPV) |\n' +
        '| Subunit | Just one viral protein | Hepatitis B |\n' +
        '| mRNA | Instructions to make the viral protein | COVID-19 (Pfizer, Moderna) |\n\n' +
        'Assam\'s public health programmes deliver routine vaccinations through the National Immunisation Schedule — including doses for TB (BCG at birth), polio, and hepatitis B — that have dramatically reduced childhood mortality across the Brahmaputra valley.',
      intermediateContent:
        '**The Baltimore classification** (David Baltimore, 1971 Nobel laureate) groups viruses by genome type and replication strategy:\n\n' +
        '| Group | Genome | Replication logic | Example |\n' +
        '|-------|--------|------------------|--------|\n' +
        '| I | dsDNA | DNA → mRNA directly | Herpes, smallpox |\n' +
        '| II | ssDNA | ssDNA → dsDNA → mRNA | Parvovirus |\n' +
        '| III | dsRNA | Each strand acts as template | Rotavirus |\n' +
        '| IV | +ssRNA | Genome **is** the mRNA — translate immediately | SARS-CoV-2, dengue |\n' +
        '| V | −ssRNA | Must first copy to +RNA | Influenza, Ebola |\n' +
        '| VI | ssRNA-RT | RNA → DNA (reverse transcriptase) → integrates | HIV |\n' +
        '| VII | dsDNA-RT | DNA replicates through RNA intermediate | Hepatitis B |\n\n' +
        '**Virus sizes span 100-fold:**\n\n' +
        '| Virus | Diameter | Relative to... |\n' +
        '|-------|----------|----------------|\n' +
        '| Parvovirus | ~20 nm | 1/3500 of a red blood cell |\n' +
        '| SARS-CoV-2 | ~120 nm | About 6 parvoviruses across |\n' +
        '| Pithovirus (giant) | ~1,500 nm | Visible under light microscope |\n\n' +
        '**How flu changes every year:**\n\n' +
        '| Process | Mechanism | Result |\n' +
        '|---------|-----------|--------|\n' +
        '| **Antigenic drift** | Gradual point mutations in surface proteins (HA, NA) | Seasonal flu variants — vaccine must be updated yearly |\n' +
        '| **Antigenic shift** | Two flu strains co-infect one cell and swap genome segments (reassortment) | Completely new surface proteins → pandemic strain (1918, 2009) |',
      advancedContent:
        '**SARS-CoV-2 — a case study in virology:**\n\n' +
        'Coronaviruses have the **largest RNA genomes** known (~30 kb) and an unusual proofreading exonuclease (nsp14-ExoN) that gives them a mutation rate of ~10⁻⁶ per nucleotide per cycle — an order of magnitude lower than typical RNA viruses (~10⁻⁴ to 10⁻⁵).\n\n' +
        '| Feature | Value | Significance |\n' +
        '|---------|-------|-------------|\n' +
        '| Genome size | ~30 kb | Largest known RNA virus genome |\n' +
        '| Mutation rate | ~10⁻⁶/nt/cycle | Low for RNA virus (proofreading) |\n' +
        '| Spike-ACE2 affinity (Kd) | ~15 nM | High — enables efficient cell entry |\n' +
        '| Incubation period | 2–14 days | Long enough for pre-symptomatic spread |\n\n' +
        '**mRNA vaccine engineering:**\n\n' +
        'The Pfizer-BioNTech and Moderna vaccines encode the prefusion-stabilised spike protein with two proline substitutions (K986P, V987P) that lock the spike in its pre-binding conformation, exposing the most immunogenic epitopes.\n\n' +
        '| Delivery challenge | Solution |\n' +
        '|-------------------|----------|\n' +
        '| Naked mRNA is degraded by RNases in seconds | Encapsulate in lipid nanoparticle (LNP) |\n' +
        '| LNP must circulate without being cleared | Ionisable lipids: neutral at pH 7.4 (circulation), cationic at pH ~5 (endosome) |\n' +
        '| mRNA must escape endosome into cytoplasm | Cationic LNP disrupts endosomal membrane at low pH |\n' +
        '| Immune system attacks foreign mRNA | Replace uridine with N1-methylpseudouridine to avoid TLR activation |\n\n' +
        'From published sequence to first human dose: **63 days** — a pace that transformed vaccinology and earned the 2023 Nobel Prize in Physiology/Medicine for Katalin Karikó and Drew Weissman.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Viruses are living organisms that can reproduce on their own.', answer: false, explanation: 'Viruses are not considered truly alive — they have no metabolism, no ribosomes, and cannot reproduce without hijacking a living cell\'s machinery.' },
            { text: 'Antibiotics are effective against viral infections like the common cold.', answer: false, explanation: 'Antibiotics target bacterial structures (cell walls, ribosomes). Viruses lack these — antibiotics have zero effect on them and only breed resistance in gut bacteria.' },
            { text: 'HIV is a retrovirus that uses reverse transcriptase to convert its RNA into DNA.', answer: true, explanation: 'HIV carries RNA and the enzyme reverse transcriptase, which converts viral RNA → DNA. This DNA integrates into the host genome (lysogenic-like cycle).' },
            { text: 'Antigenic shift in influenza causes seasonal flu variation.', answer: false, explanation: 'Antigenic DRIFT (gradual point mutations) causes seasonal variation. Antigenic SHIFT (reassortment of genome segments) creates pandemic strains.' },
          ],
        },
      },
    },

    // ── Section 3: Fungi ──────────────────────────────────────────
    {
      title: 'Fungi',
      diagram: 'FungiDiagram',
      beginnerContent:
        'Watch the animation. See those branching threads spreading underground from the center? That\'s what a fungus *actually is*. The mushrooms popping up on the surface — the part you can see — are just the **fruiting bodies**. Less than 5% of the organism. The rest is a web called **mycelium**, threading through soil like a nervous system with no brain.\n\n' +
        'And here\'s what should floor you: **the largest organism on Earth is a fungus.** In Oregon\'s Malheur National Forest, a single honey fungus (*Armillaria ostoyae*) covers **9.6 square kilometres** — 1,350 football fields — all one connected genetic individual. It\'s an estimated 2,400 years old. Every mushroom you see popping up across that forest is a small visible piece of this one vast underground being.\n\n' +
        'Fungi are neither plants nor animals — their own kingdom entirely. They don\'t photosynthesize (no green). They don\'t hunt (no mouth). They feed by **secreting digestive enzymes onto whatever they\'re touching, then absorbing the liquefied nutrients**. Picture spraying solvent on a stain and sopping up the dissolved mess — that\'s fungal digestion. Their cell walls are made of **chitin** (the same stuff as insect shells), not cellulose like plants.\n\n' +
        'Each mushroom releases up to **30 billion spores a day**. Most die. But a few find soil, germinate, and start their own mycelial network — slowly, invisibly, for decades.\n\n' +
        '**What makes fungi special?**\n\n' +
        '| Feature | Plants | Animals | Fungi |\n' +
        '|---------|--------|---------|-------|\n' +
        '| Cell wall | Cellulose | None | **Chitin** (same as insect shells) |\n' +
        '| Nutrition | Photosynthesis (make own food) | Ingest food | **Absorb** dissolved nutrients |\n' +
        '| Body structure | Roots, stems, leaves | Organs, tissues | **Hyphae** (thread-like filaments) |\n' +
        '| Store energy as | Starch | Glycogen | **Glycogen** (like animals!) |\n\n' +
        'The body of most fungi is a network of thin threads called **hyphae** that weave through soil, wood, or other substrates. This network is called a **mycelium** — and a single mycelium can stretch for kilometres underground. What we call a "mushroom" is just the **fruiting body** — the part that pops above the surface to release spores. It is to the fungus what an apple is to an apple tree.\n\n' +
        '**Why forests need fungi:**\n\n' +
        '| Role | What fungi do | Why it matters |\n' +
        '|------|-------------|---------------|\n' +
        '| **Decomposers** | Break down dead wood, leaves, animal remains | Recycle carbon, nitrogen, phosphorus back into soil |\n' +
        '| **Mycorrhizal partners** | Extend plant root networks by up to 700× | Plants get water and minerals; fungi get sugars |\n' +
        '| **Wood Wide Web** | Connect trees of different species underground | Trees share nutrients and chemical warning signals |\n\n' +
        'In the forests of Northeast India — from the subtropical jungles of Kaziranga to the cloud forests of Meghalaya — mycorrhizal fungi connect the root systems of towering sal, teak, and hollong trees, allowing a mature tree to feed shaded seedlings with up to 5% of its sugars. Over 90% of all plant species depend on these fungal partners.',
      intermediateContent:
        'Fungi reproduce via **spores** — microscopic propagules produced sexually (after meiosis) or asexually (by mitosis). A single mushroom can release **billions of spores** per day.\n\n' +
        '**Spore dispersal — nature\'s engineering:**\n\n' +
        '| Fungus | Mechanism | Speed/Distance |\n' +
        '|--------|----------|----------------|\n' +
        '| *Pilobolus* (dung fungus) | Water-pressure cannon | **25 m/s** (90 km/h) over 2.5 m |\n' +
        '| Mushrooms | Self-generated convection currents | Evaporating water creates updraft |\n' +
        '| Puffballs | Raindrops compress the ball, ejecting spores | Millions per squeeze |\n' +
        '| Stinkhorns | Attract flies with rotting-meat smell | Spores stick to insect legs |\n\n' +
        '**Two types of mycorrhizal association:**\n\n' +
        '| Type | Hyphae location | Typical plants | Details |\n' +
        '|------|----------------|----------------|--------|\n' +
        '| **Ectomycorrhizae** | Wrap around root cells (no penetration) | Temperate forest trees (oaks, pines) | Form a visible fungal sheath |\n' +
        '| **Arbuscular (AM)** | Penetrate root cell walls → form branched **arbuscules** | ~80% of plants including **rice** | Oldest type (~450 million years) |\n\n' +
        '**Mother tree effect** (Suzanne Simard): Through mycorrhizal networks, a mature tree can transfer ~5% of its photosynthate to shaded seedlings. In experiments with Douglas fir forests, seedlings connected to a mother tree via the fungal network had **300% higher survival rates** than isolated seedlings.\n\n' +
        '**Worked example — spore production:**\n\n' +
        'A giant puffball (*Calvatia gigantea*, found in NE India\'s grasslands) produces ~7 × 10¹² spores. If each spore is ~3.5 μm across and we lined them up: 7 × 10¹² × 3.5 × 10⁻⁶ m = **24,500 km** — more than halfway around the Earth.',
      advancedContent:
        '**Evolutionary surprise:** Molecular phylogenetics places Fungi **closer to animals** than to plants. Both belong to the **Opisthokonta** clade (shared ancestor had a single posterior flagellum). This divergence occurred ~1 billion years ago.\n\n' +
        '| Clade | Includes | Key evidence |\n' +
        '|-------|---------|-------------|\n' +
        '| Opisthokonta | Animals + Fungi | Shared posterior flagellum, chitin, glycogen storage |\n' +
        '| Plants + green algae | Archaeplastida | Cellulose walls, starch storage, chloroplasts |\n\n' +
        '**Fungi shaped Earth\'s geology:** During the Carboniferous period (~360 Mya), before fungi evolved efficient lignin-degrading enzymes (laccases, peroxidases), dead trees accumulated undecomposed — forming the massive **coal deposits** we burn today. The genome of the honey fungus *Armillaria ostoyae* (~60 Mb) encodes aggressive wood-decay enzymes that can now break down **lignin** — one of the most recalcitrant biopolymers on Earth.\n\n' +
        '**Synthetic mycology — fungi as materials:**\n\n' +
        '| Application | How it works | Performance |\n' +
        '|------------|-------------|-------------|\n' +
        '| Packaging (replacing polystyrene) | Mycelium grown on agricultural waste, compressed | Fully biodegradable |\n' +
        '| Leather substitute | Mycelium sheet treated and dyed | Used by Hermès, Stella McCartney |\n' +
        '| Building insulation | Compressed mycelium panels | Thermal conductivity ~0.04 W/(m·K) — comparable to fiberglass |\n' +
        '| Bioremediation | Fungi break down petroleum, pesticides, plastics | Oyster mushrooms can degrade diesel fuel |\n\n' +
        'Northeast India, with its enormous fungal diversity (over 2,000 documented species in the Eastern Himalayas), is a largely untapped resource for discovering novel enzymes, antibiotics, and biomaterials.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The largest living organism on Earth is a honey fungus (Armillaria ostoyae) in Oregon, USA — its mycelium covers 9.6 km², weighs ~6,000 tonnes, and is estimated to be 2,400–8,650 years old.',
            'Fungi are genetically closer to animals than to plants. Both fungi and animals store energy as glycogen and have chitin in their biology (cell walls vs exoskeletons).',
            'Without fungi, Earth\'s forests would be buried under metres of undecayed wood and leaves. Fungi are the planet\'s primary recyclers of dead organic matter.',
            'A single mushroom can release up to 30,000 spores per second — billions per day — making mushroom spores one of the most abundant particles in forest air.',
            'In Meghalaya\'s subtropical forests, mycorrhizal fungi connect trees of different species underground, allowing them to share water, nutrients, and even chemical warnings about insect attacks.',
          ],
        },
      },
    },

    // ── Section 4: The Immune System ──────────────────────────────
    {
      title: 'The Immune System',
      diagram: 'ImmuneSystemDiagram',
      beginnerContent:
        'Click anywhere in the diagram above to drop a red pathogen into your bloodstream. Watch the purple blobs (**phagocytes**, a type of white blood cell) stop their patrol, pivot, and chase it down. When they catch up, they **engulf** the invader — wrap around it completely and dissolve it from the inside. This is happening in your body **right now**, millions of times, as you read this sentence.\n\n' +
        'Your body is under siege every second of your life. Every breath inhales bacteria. Every bite swallows microbes. Every tiny cut opens the gates. You don\'t get sick because a standing army keeps you alive — and it has **two divisions** working in parallel.\n\n' +
        '**Division 1 — Innate immunity (the rapid-response force)**\n\n' +
        'You\'re born with this. It fires within minutes of detecting anything foreign. It\'s not precise — it attacks anything that doesn\'t look "you" — but it\'s fast.\n\n' +
        '| Barrier/Cell | What it does | Analogy |\n' +
        '|-------------|-------------|--------|\n' +
        '| **Skin** | Physical barrier — dead, keratinised cells block pathogens | Castle walls |\n' +
        '| **Mucus + cilia** | Trap microbes in sticky mucus; cilia sweep them out | Flypaper on a conveyor belt |\n' +
        '| **Stomach acid** (pH 1.5–3) | Destroys most swallowed bacteria | Acid moat |\n' +
        '| **Macrophages** | Engulf and digest invaders (phagocytosis) | Pac-Man eating ghosts |\n' +
        '| **Neutrophils** | Swarm to infection sites, kill bacteria | Foot soldiers |\n' +
        '| **Natural killer cells** | Destroy virus-infected cells | Undercover assassins |\n' +
        '| **Inflammation** | Redness, swelling, heat — increases blood flow to rush in more immune cells | Sounding the alarm |\n\n' +
        '**Division 2: Adaptive immunity (the specialist force)**\n\n' +
        'This takes days to activate but is laser-precise — and it **remembers** every enemy it has ever fought.\n\n' +
        '| Cell type | What it does | Analogy |\n' +
        '|----------|-------------|--------|\n' +
        '| **B cells** | Produce **antibodies** — Y-shaped proteins that lock onto pathogens and mark them for destruction | Missile launchers with guided missiles |\n' +
        '| **Helper T cells** | Coordinate the whole immune response by releasing signalling molecules (cytokines) | Field commanders |\n' +
        '| **Killer T cells** | Directly destroy virus-infected cells | Snipers |\n' +
        '| **Memory cells** | Survive for years after infection; mount a faster, stronger response if the same pathogen returns | Intelligence files on known enemies |\n\n' +
        '**Vaccination** exploits immunological memory. A vaccine introduces a harmless version of the pathogen so your immune system can learn to fight it *without the danger of actual disease*. When the real pathogen arrives later, memory cells respond within hours instead of days.\n\n' +
        'Edward Jenner pioneered this in 1796 by inoculating a boy with cowpox material to protect against smallpox. India\'s national immunisation programme — which reaches villages across Assam\'s remote char areas in the Brahmaputra — delivers vaccines for TB, polio, hepatitis B, measles, and more.',
      intermediateContent:
        '**Antibody classes — five tools for different jobs:**\n\n' +
        '| Class | Structure | Where found | Key function |\n' +
        '|-------|-----------|------------|-------------|\n' +
        '| **IgM** | Pentamer (5 Y\'s joined) | Blood (first produced) | Early response; activates complement cascade |\n' +
        '| **IgG** | Monomer | Blood (most abundant) | Crosses placenta — protects newborns |\n' +
        '| **IgA** | Dimer | Mucous membranes, saliva, breast milk | Guards body surfaces |\n' +
        '| **IgE** | Monomer | Tissues | Triggers mast cell degranulation → allergy response; fights parasites |\n' +
        '| **IgD** | Monomer | B cell surface | Signals B cell activation (function debated) |\n\n' +
        '**How does the body produce antibodies for virtually ANY molecule?**\n\n' +
        'Through **V(D)J recombination** — one of the most elegant genetic mechanisms known:\n\n' +
        '| Step | What happens | Diversity generated |\n' +
        '|------|-------------|--------------------|\n' +
        '| **Segment selection** | Randomly combine V, D, and J gene segments | ~10⁴ combinations |\n' +
        '| **Junctional diversity** | Random nucleotide additions at segment joins | ~10³× more |\n' +
        '| **Somatic hypermutation** | Point mutations in V regions during immune response | Further refinement |\n' +
        '| **Heavy + light chain pairing** | Two chains combine | Multiplicative |\n' +
        '| **Total** | | >10¹¹ unique antibodies from ~400 gene segments |\n\n' +
        'That is over **100 billion** unique antibody specificities — enough to recognise virtually any molecular shape in the universe.',
      advancedContent:
        '**Clonal selection theory** (Burnet, 1957): Each lymphocyte carries receptors of a single specificity. Antigen binding triggers clonal expansion → effector cells + memory cells.\n\n' +
        '**Tolerance — how the immune system avoids attacking yourself:**\n\n' +
        '| Mechanism | Where | How |\n' +
        '|-----------|-------|-----|\n' +
        '| **Central tolerance** | Thymus (T cells), bone marrow (B cells) | Self-reactive clones are deleted during development |\n' +
        '| **Peripheral tolerance** | Everywhere | Regulatory T cells (CD4⁺CD25⁺FOXP3⁺) suppress autoreactive cells |\n\n' +
        'Tolerance breakdown causes autoimmune disease (lupus, type 1 diabetes, rheumatoid arthritis).\n\n' +
        '**Cancer immunotherapy — releasing the brakes:**\n\n' +
        '| Therapy | Mechanism | Clinical result |\n' +
        '|---------|-----------|----------------|\n' +
        '| **Anti-PD-1** (nivolumab, pembrolizumab) | Block PD-1 inhibitory receptor on T cells | 2018 Nobel Prize (Allison & Honjo) |\n' +
        '| **Anti-CTLA-4** (ipilimumab) | Block CTLA-4 checkpoint | Melanoma survival doubled |\n' +
        '| **CAR-T cell therapy** | Engineer patient\'s T cells with a chimeric antigen receptor targeting tumour antigen (e.g., CD19) | >80% remission in previously untreatable blood cancers |\n\n' +
        'Tumours exploit inhibitory receptors (PD-1, CTLA-4) on T cells to evade destruction. Checkpoint inhibitors "release the brakes," allowing anti-tumour T cells to attack. This has transformed oncology — cancers that were untreatable five years ago now have durable responses in 20–40% of patients.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each immune cell to its role',
          pairs: [
            ['Macrophage', 'Engulfs and digests pathogens (phagocytosis) — innate immunity'],
            ['B cell', 'Produces antibodies that bind and neutralise specific pathogens'],
            ['Helper T cell', 'Coordinates immune response by releasing cytokines'],
            ['Killer T cell', 'Directly destroys virus-infected cells and tumour cells'],
            ['Memory cell', 'Persists for years — enables faster response on re-infection'],
          ],
        },
      },
    },

    // ── Section 5: Antibiotic Resistance ──────────────────────────
    {
      title: 'Antibiotic Resistance',
      diagram: 'DoseResponseDiagram',
      beginnerContent:
        'Try this with the animation above. You\'re looking at a mixed population of bacteria — green are sensitive to antibiotics, red are resistant, yellow are in between. **Click "Apply antibiotic."** Most of the green ones die. A handful of red ones survive. Now the survivors reproduce, and their offspring inherit their resistance. Apply antibiotic again. Fewer greens were there to begin with — more reds survive. After 3-4 rounds, the entire population is red. **You can\'t kill them with this antibiotic anymore.**\n\n' +
        'This is evolution, happening in your hands in 30 seconds. It\'s the same process that\'s producing superbugs in hospitals around the world — but with real bacteria, real patients, and consequences we\'re running out of time to fix.\n\n' +
        'In 1928, Alexander Fleming noticed mould killing bacteria on a petri dish. That mould produced **penicillin** — the first antibiotic — and launched what was arguably the greatest medical advance in history. Diseases that had been death sentences (tuberculosis, pneumonia, infected wounds) became treatable. Life expectancy jumped by decades.\n\n' +
        'But Fleming himself warned in his 1945 Nobel lecture: *"The time may come when penicillin can be bought by anyone... then there is the danger that the ignorant man may easily underdose himself and, by exposing his microbes to non-lethal quantities of the drug, make them resistant."*\n\n' +
        'He was right. Today, drug-resistant infections kill **1.27 million people per year globally** — more than malaria or HIV/AIDS. If the trend continues, by 2050 resistant bacteria could kill more people than cancer.\n\n' +
        '**This is why your doctor insists you finish the full course.** If you stop taking antibiotics when you "feel better," you\'ve killed the weak bacteria but the stronger ones are still alive — and now you\'ve just bred a superbug inside yourself.\n\n' +
        '**How resistance develops — evolution in real time:**\n\n' +
        '| Step | What happens |\n' +
        '|------|-----------|\n' +
        '| 1 | A large bacterial population has random genetic variation — most are susceptible, but a few carry mutations that help resist the drug |\n' +
        '| 2 | Antibiotic is applied — kills the susceptible majority |\n' +
        '| 3 | Resistant mutants survive with no competition for food and space |\n' +
        '| 4 | Resistant bacteria multiply rapidly — within days, the entire population is resistant |\n\n' +
        'This is **natural selection** — Darwin\'s principle applied to bacteria. It happens incredibly fast because bacteria reproduce every 20 minutes, producing 72 generations per day.\n\n' +
        '**What accelerates resistance:**\n\n' +
        '| Human behaviour | Why it causes resistance |\n' +
        '|----------------|------------------------|\n' +
        '| **Not finishing antibiotic course** | Kills susceptible bacteria but leaves partially resistant ones alive to repopulate |\n' +
        '| **Taking antibiotics for viruses** (cold, flu) | Zero effect on the virus; breeds resistance in gut bacteria |\n' +
        '| **Livestock overuse** (~70% of global antibiotics) | Low-dose antibiotics in animal feed = perfect conditions for resistance |\n' +
        '| **Poor sanitation** | Resistant bacteria spread through contaminated water — a serious concern in flood-prone areas of Assam |\n\n' +
        'The WHO estimates drug-resistant infections already kill **over 1.2 million people annually** — more than HIV/AIDS or malaria. MRSA (Methicillin-Resistant Staphylococcus aureus) is one of the most notorious — resistant to most beta-lactam antibiotics, it causes serious infections especially in hospitals.',
      intermediateContent:
        '**Four categories of resistance mechanisms:**\n\n' +
        '| Mechanism | How it works | Example |\n' +
        '|-----------|-------------|--------|\n' +
        '| **Enzyme degradation** | Bacteria produce enzymes that destroy the drug | β-lactamase cleaves penicillin\'s β-lactam ring |\n' +
        '| **Target modification** | The drug\'s target is altered so it no longer binds | MRSA: mecA gene → altered PBP2a with low β-lactam affinity |\n' +
        '| **Efflux pumps** | Membrane proteins pump the drug out faster than it enters | Tetracycline resistance |\n' +
        '| **Reduced permeability** | Fewer or smaller porin channels block drug entry | Carbapenem resistance in Pseudomonas |\n\n' +
        'Resistance genes often reside on **plasmids** that can be transferred between bacteria via **conjugation** (horizontal gene transfer) — spreading resistance even between different species.\n\n' +
        '**The dose-response curve and MIC:**\n\n' +
        '| Concept | Definition | Clinical meaning |\n' +
        '|---------|-----------|------------------|\n' +
        '| **MIC** (Minimum Inhibitory Concentration) | Lowest antibiotic concentration that prevents visible growth | If MIC > achievable blood level → strain is resistant |\n' +
        '| **Dose-response curve** | Plots bacterial survival vs. antibiotic concentration | Resistant strains show a **rightward shift** |\n' +
        '| **MPC** (Mutant Prevention Concentration) | Concentration that suppresses even single-step mutants | Dosing above MPC minimises resistance emergence |\n\n' +
        '**Worked example — MIC interpretation:**\n\n' +
        'A lab reports MIC of amoxicillin against a wound isolate = 16 μg/mL. Standard oral amoxicillin achieves peak blood concentration ~8 μg/mL. Since MIC (16) > peak level (8), the bacterium is **resistant** — the drug cannot reach effective concentrations. The doctor must switch to a different antibiotic.',
      advancedContent:
        '**Population genetics of resistance evolution:**\n\n' +
        'For a resistance mutation with fitness cost c (without antibiotic) and selective advantage s (with antibiotic), the fixation probability under antibiotic pressure is approximately:\n\n' +
        '**P_fix ≈ 2s / N_e** (for beneficial mutations in large populations)\n\n' +
        '| Parameter | Value | Effect |\n' +
        '|-----------|-------|--------|\n' +
        '| Selection coefficient (s) | 0.3 (typical for strong resistance) | Resistant allele: 0.1% → >99% in ~50 generations (~17 hrs for E. coli) |\n' +
        '| Fitness cost (c) | 0.01–0.1 | Resistance is slightly costly without antibiotic — but compensatory mutations remove cost |\n' +
        '| Mutant Selection Window (MSW) | MIC_susceptible to MPC | Within this range, resistant mutants are enriched while susceptible bacteria die |\n\n' +
        '**Compensatory mutations** restore fitness without losing resistance, making reversion unlikely. Once resistance evolves, it tends to persist even after antibiotic pressure is removed.\n\n' +
        '**The resistome** — all resistance genes in an environment — can be surveyed by metagenomic sequencing. Antibiotic resistance genes have been found in **30,000-year-old permafrost** samples, confirming resistance predates human antibiotic use.\n\n' +
        '**Novel strategies beyond traditional antibiotics:**\n\n' +
        '| Strategy | Mechanism | Advantage |\n' +
        '|----------|-----------|----------|\n' +
        '| **Phage therapy** | Bacteriophages (viruses that kill bacteria) | Highly specific; co-evolve with target |\n' +
        '| **Antimicrobial peptides** | Short peptides that disrupt bacterial membranes | Hard for bacteria to evolve resistance (target fundamental membrane structure) |\n' +
        '| **CRISPR-based targeting** | Deliver CRISPR to cut resistance plasmids | Selectively removes resistance genes |\n' +
        '| **Antivirulence drugs** | Disarm pathogen without killing it | Reduces selective pressure for resistance |',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'You should stop taking antibiotics as soon as you feel better to avoid overuse.', answer: false, explanation: 'Not finishing the full course kills only the most susceptible bacteria, leaving partially resistant ones alive to repopulate. Always complete the prescribed course.' },
            { text: 'Antibiotics can treat the common cold because colds are caused by bacteria.', answer: false, explanation: 'The common cold is caused by viruses (rhinovirus, coronavirus). Antibiotics target bacteria only — taking them for a cold does nothing except breed resistance in your gut bacteria.' },
            { text: 'Antibiotic resistance is an example of natural selection happening in real time.', answer: true, explanation: 'Random mutations create resistant variants. The antibiotic kills susceptible bacteria, leaving resistant ones to multiply without competition — textbook natural selection, visible within days.' },
            { text: 'About 70% of global antibiotic use is in livestock agriculture, not human medicine.', answer: true, explanation: 'Most antibiotics worldwide are used in animal farming — often at low doses to promote growth, which creates ideal conditions for resistance evolution.' },
          ],
        },
      },
    },

    // ── Section 6: Fermentation ───────────────────────────────────
    {
      title: 'Fermentation',
      diagram: 'FermentationDiagram',
      beginnerContent:
        'Look at the jar above. Sugar molecules fall in at the top. Yeast cells at the bottom catch them. CO₂ bubbles rise. The yellow fill slowly climbs — that\'s **ethanol (alcohol)** accumulating. This is exactly what\'s happening inside:\n\n' +
        '- A rising loaf of bread (the yeast\'s CO₂ bubbles inflate the dough; the ethanol bakes off)\n' +
        '- A bottle of *apong* (Assamese rice beer) bubbling in a clay pot\n' +
        '- Kombucha fizzing under its scoby\n' +
        '- Wine, beer, kvass, pulque, *zu*, *chhaang* — every alcoholic drink in every culture on Earth\n\n' +
        'Fermentation is how cells squeeze energy from sugar **without oxygen**. It\'s ancient — older than photosynthesis, older than animals, older than trees. When there\'s no oxygen around, this is how life makes ATP.\n\n' +
        'It\'s also spectacularly inefficient. Aerobic respiration (with oxygen) extracts ~36 ATP per glucose molecule. Fermentation extracts just **2 ATP**. Most of the energy stays locked inside the ethanol — which is why you can then *burn* ethanol as fuel. Think of it: aerobic respiration is a furnace burning wood to ash (all the energy out). Fermentation is smouldering wood in a sealed box (charcoal left behind — that\'s the alcohol).\n\n' +
        'Your own muscles do a version of this. When you sprint up a hill and your lungs can\'t deliver oxygen fast enough, your muscle cells switch to **lactic acid fermentation**. That burn you feel the next morning? Lactic acid buildup from cells doing emergency fermentation.\n\n' +
        '**Two types of fermentation:**\n\n' +
        '| Type | Organism | Input | Output | Used in |\n' +
        '|------|----------|-------|--------|--------|\n' +
        '| **Lactic acid** | Lactobacillus bacteria; your muscle cells | Glucose | Lactic acid + 2 ATP | Yogurt (doi), cheese, sauerkraut, khorisa |\n' +
        '| **Alcoholic** | Yeast (Saccharomyces cerevisiae) | Glucose | Ethanol + CO₂ + 2 ATP | Bread, beer, wine, rice beer (apong/zu) |\n\n' +
        '**The equations:**\n\n' +
        '| Type | Chemical equation |\n' +
        '|------|------------------|\n' +
        '| Lactic acid | C₆H₁₂O₆ → 2 C₃H₆O₃ + 2 ATP |\n' +
        '| Alcoholic | C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ + 2 ATP |\n\n' +
        '**Fermentation in Assam and Northeast India:**\n\n' +
        'NE India has one of the richest traditions of fermented foods anywhere in the world:\n\n' +
        '| Food/Drink | What it is | Microbes at work | Science behind it |\n' +
        '|-----------|-----------|-----------------|-------------------|\n' +
        '| **Doi** (yogurt) | Fermented milk | Lactobacillus | Lactose → lactic acid; pH drops → casein coagulates → thick, tangy texture |\n' +
        '| **Khorisa** | Fermented bamboo shoot | Lactobacillus | Acidic environment (low pH) inhibits Clostridium botulinum → natural preservation |\n' +
        '| **Apong/Zu** (rice beer) | Fermented steamed rice | Wild moulds + yeasts | Stage 1: moulds break starch → sugars; Stage 2: yeasts ferment sugars → alcohol |\n' +
        '| **Pitha** (some varieties) | Rice batter left overnight | Wild Lactobacillus | Lactic acid gives subtle sourness and lighter, airier texture |\n' +
        '| **Akhuni** (Naga fermented soy) | Fermented soybean | Bacillus subtilis | Protein → amino acids → intense umami flavour |\n\n' +
        '**Why does bread rise?** Yeast in the dough performs alcoholic fermentation: the CO₂ gas forms bubbles that make the dough expand. The ethanol evaporates during baking.',
      intermediateContent:
        '**The biochemistry — from glucose to products:**\n\n' +
        'Both types of fermentation begin with **glycolysis** (the universal first step):\n\n' +
        '**C₆H₁₂O₆ + 2 NAD⁺ + 2 ADP + 2 Pᵢ → 2 C₃H₄O₃ + 2 NADH + 2 ATP**\n\n' +
        '| Step | Lactic acid fermentation | Alcoholic fermentation |\n' +
        '|------|-------------------------|----------------------|\n' +
        '| After glycolysis | Pyruvate + NADH → lactate + NAD⁺ | Pyruvate → acetaldehyde + CO₂ |\n' +
        '| | | Acetaldehyde + NADH → ethanol + NAD⁺ |\n' +
        '| **Purpose** | Regenerate NAD⁺ so glycolysis can continue | Same — regenerate NAD⁺ |\n' +
        '| Net ATP | 2 per glucose | 2 per glucose |\n' +
        '| Efficiency | 2/36 = **5.6%** of aerobic | Same — 5.6% |\n\n' +
        '**The Pasteur effect:** In the presence of O₂, yeast switches from fermentation to aerobic respiration (19× more ATP per glucose), dramatically reducing ethanol production. This is why winemaking excludes oxygen from fermentation vessels.\n\n' +
        '**Worked example — ethanol toxicity limit:**\n\n' +
        'Yeast ferments until ethanol reaches ~14–18% (at which point ethanol denatures yeast proteins). For wine at 14% alcohol:\n\n' +
        '- 14% ethanol = 140 mL ethanol per litre\n' +
        '- Ethanol density = 0.789 g/mL → 140 × 0.789 = 110.5 g ethanol\n' +
        '- Molecular weight of ethanol = 46 g/mol → 110.5/46 = 2.4 mol ethanol\n' +
        '- Each glucose → 2 ethanol, so 1.2 mol glucose consumed = 1.2 × 180 = **216 g sugar per litre** of wine\n\n' +
        'This matches the ~200-250 g/L sugar content of ripe grape juice.',
      advancedContent:
        '**Industrial fermentation — three operating modes:**\n\n' +
        '| Mode | How it works | Used for |\n' +
        '|------|-------------|----------|\n' +
        '| **Batch** | All nutrients added at start; products harvested at end | Small-scale, research |\n' +
        '| **Fed-batch** | Nutrients added during the run to control growth rate | Most antibiotics (penicillin) |\n' +
        '| **Continuous** | Nutrients flow in, products flow out at steady state | Ethanol, single-cell protein |\n\n' +
        '**Metabolic engineering — reprogramming cells as chemical factories:**\n\n' +
        '| Product | Organism | Engineering approach | Titre achieved |\n' +
        '|---------|----------|---------------------|---------------|\n' +
        '| **Artemisinin** (antimalarial) | Engineered *S. cerevisiae* | 12 heterologous genes from plants and bacteria (Jay Keasling, UC Berkeley) | 25 g/L |\n' +
        '| **1,3-propanediol** (plastics precursor) | Engineered *E. coli* | DuPont/Genencor pathway | 135 g/L |\n' +
        '| **Insulin** | Engineered *E. coli* or yeast | Human insulin gene inserted; first biotech drug (1982) | Industrial scale |\n\n' +
        '**Synthetic biology** treats metabolic pathways as circuits: promoters as switches, enzymes as logic gates, and feedback loops as controllers. Cell-free fermentation systems remove the cell entirely, using purified enzyme cascades *in vitro* to produce chemicals without the constraints of cell viability.\n\n' +
        'Bioprospecting is mining traditional ferments for novel enzymes. The starter cultures used in *apong*, *zu*, *mod* and other traditional rice beers harbour uncharacterised fungal and bacterial consortia — potential sources of new amylases, lipases, and antimicrobial compounds. Labs at Tezpur University and IIT Guwahati are cataloguing these microbial communities using metagenomic sequencing.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each fermented food to the science behind it',
          pairs: [
            ['Doi (yogurt)', 'Lactobacillus converts lactose → lactic acid; casein coagulates at low pH'],
            ['Bread', 'Yeast produces CO₂ gas that forms bubbles, making dough rise; ethanol evaporates during baking'],
            ['Khorisa (bamboo shoot)', 'Lactic acid fermentation creates acidic environment that naturally preserves by inhibiting dangerous bacteria'],
            ['Apong/Zu (rice beer)', 'Two-stage: moulds convert starch → sugars, then yeasts ferment sugars → ethanol + CO₂'],
            ['Wine', 'Yeast ferments grape sugar → ethanol + CO₂ in oxygen-free conditions until ~14% alcohol kills the yeast'],
          ],
        },
      },
    },
  ],
};
