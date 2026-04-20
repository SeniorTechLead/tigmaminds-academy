import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'cell-structure',
  title: 'Cell Structure & Function',
  category: 'biology',
  icon: '🔬',
  tagline:
    'The basic unit of life — every living thing from a tea leaf to a one-horned rhino is built from cells.',
  relatedStories: ['old-banyan-trees-stories', 'bamboo-grows-fast', 'pitcher-plant'],
  understand: [
    // ── Section 1: What Is a Cell? ────────────────────────────────
    {
      title: 'What Is a Cell?',
      diagram: 'AnimalCellDiagram',
      beginnerContent:
        'Click the organelles in the diagram above. Every label points to a machine running right now inside every one of the **37 trillion cells in your body.** A single teaspoon of your blood contains 25 billion cells. Your body replaces 330 billion of them per day — most of your skin gets replaced every month, most of your gut lining every week.\n\n' +
        'Cells are the bricks of life. But calling them bricks undersells them. A brick is dumb matter. A cell reads DNA, burns sugar, builds proteins, senses its environment, signals its neighbours, decides whether to divide. A single cell of *E. coli* has more moving parts than a Boeing 747.\n\n' +
        'In 1665, Robert Hooke held a slice of cork under a microscope. He saw tiny compartments and called them "cells" because they reminded him of monks\' rooms (*cellae*). What he actually saw were the dead empty walls of plant cells — just the chambers, no living contents. But his accidental discovery launched one of the biggest ideas in biology: **cell theory.**\n\n' +
        '| Principle | What it means | Analogy |\n' +
        '|-----------|--------------|----------|\n' +
        '| All living things are made of cells | There is no life without cells | No building without bricks |\n' +
        '| The cell is the basic unit of life | All life functions happen inside cells | Each brick is a self-contained mini-factory |\n' +
        '| All cells come from existing cells | Cells divide to make new cells | You can\'t create bricks from nothing |\n\n' +
        'Cells come in two broad types:\n\n' +
        '| Feature | Prokaryotic (bacteria) | Eukaryotic (plants, animals, fungi) |\n' +
        '|---------|----------------------|------------------------------------|\n' +
        '| **Size** | Tiny: 1–5 μm | Larger: 10–100 μm |\n' +
        '| **Nucleus** | No — DNA floats freely | Yes — DNA inside a membrane-bound nucleus |\n' +
        '| **Organelles** | Very few | Many specialised compartments |\n' +
        '| **Examples** | *E. coli*, cyanobacteria | Human cells, rice plant cells, yeast |\n\n' +
        '**Think of it this way:** A prokaryote is like a one-room hut — everything happens in the same space. A eukaryote is like a house with separate rooms — a kitchen, bedroom, office — each doing a specialised job.\n\n' +
        '**Quick check:** Viruses are not cells — they can\'t reproduce on their own and have no internal machinery. Are viruses alive? Most biologists say *not quite* — they sit at the border of life.\n\n' +
        '**Explore the animal cell diagram above** — click on each organelle to see what it does.',
      intermediateContent:
        '**Why can\'t cells grow infinitely large?**\n\n' +
        'The answer is the **surface-area-to-volume ratio**. As a cell grows, its volume increases faster than its surface area. The membrane (surface) must supply nutrients to the entire interior (volume). Eventually the membrane can\'t keep up.\n\n' +
        '| Cell radius | Surface area (4πr²) | Volume (4/3 πr³) | SA:V ratio |\n' +
        '|-------------|---------------------|-------------------|------------|\n' +
        '| 1 μm | 12.6 μm² | 4.2 μm³ | **3.0** |\n' +
        '| 5 μm | 314 μm² | 524 μm³ | **0.6** |\n' +
        '| 10 μm | 1,257 μm² | 4,189 μm³ | **0.3** |\n' +
        '| 50 μm | 31,416 μm² | 523,599 μm³ | **0.06** |\n\n' +
        'For a sphere: **SA/V = 3/r**. As r increases, SA/V drops — the cell starves.\n\n' +
        '**How do eukaryotes get around this?** Internal membranes. The endoplasmic reticulum, mitochondria, and other organelles increase the total membrane area by roughly **10×**, creating internal "service counters" that don\'t rely on the outer membrane alone.\n\n' +
        '**Prokaryotic growth — a worked example:**\n\n' +
        '*E. coli* divides every ~20 minutes. Starting from 1 cell:\n\n' +
        '| Time | Generations | Cells (2ⁿ) |\n' +
        '|------|------------|-------------|\n' +
        '| 0 min | 0 | 1 |\n' +
        '| 1 hour | 3 | 8 |\n' +
        '| 6 hours | 18 | 262,144 |\n' +
        '| 12 hours | 36 | 6.9 × 10¹⁰ |\n' +
        '| 24 hours | 72 | 4.7 × 10²¹ |\n\n' +
        'After 24 hours, one bacterium could theoretically produce more cells than exist on Earth. In reality, nutrients run out and waste accumulates — growth follows a **logistic curve** that plateaus at the carrying capacity.',
      advancedContent:
        '**Endosymbiotic theory — how eukaryotes were born**\n\n' +
        'Lynn Margulis (1967) proposed that mitochondria and chloroplasts were once free-living bacteria that were engulfed by an ancestral host cell. Instead of being digested, they became permanent residents — a partnership that gave rise to all complex life.\n\n' +
        '| Evidence | Mitochondria | Chloroplasts |\n' +
        '|----------|-------------|---------------|\n' +
        '| **Double membrane** | Inner = original bacterium; outer = host\'s phagosomal membrane | Same |\n' +
        '| **Own DNA** | Circular, like bacteria | Circular, like bacteria |\n' +
        '| **Ribosomes** | 70S (bacterial), not 80S (eukaryotic) | 70S |\n' +
        '| **Replication** | Binary fission, independent of cell cycle | Binary fission |\n' +
        '| **Closest relatives** | α-proteobacteria (Rickettsiales) | Cyanobacteria |\n\n' +
        'The host cell was likely an **Asgard archaeon** (related to Lokiarchaeota), which possess eukaryotic signature proteins — small GTPases, ESCRT membrane-remodelling complexes — bridging the gap between archaea and eukaryotes.\n\n' +
        'This "two-domain" model suggests eukaryotes arose from a **symbiotic merger** ~2 billion years ago, not as a third independent lineage. The merger was transformative: the host gained efficient aerobic respiration; the endosymbiont gained protection and nutrients. Over time, most of the endosymbiont\'s genes transferred to the host nucleus — in humans, only 37 genes remain in mitochondrial DNA (13 proteins, 22 tRNAs, 2 rRNAs).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each cell type to its description',
          pairs: [
            ['Prokaryotic cell', 'No nucleus — DNA floats freely; small (1–5 μm); bacteria and archaea'],
            ['Eukaryotic cell', 'Membrane-bound nucleus and organelles; larger (10–100 μm); plants, animals, fungi'],
            ['Virus', 'Not a true cell — no ribosomes, cannot reproduce alone; needs a host cell'],
            ['Robert Hooke', 'First person to observe cells (1665) — saw empty walls in cork'],
          ],
        },
      },
    },

    // ── Section 2: Plant vs Animal Cells ──────────────────────────
    {
      title: 'Plant vs Animal Cells',
      diagram: 'CellComparisonDiagram',
      beginnerContent:
        'Toggle between "Plant" and "Animal" in the diagram above. The basic wiring is identical — both have nucleus, mitochondria, ribosomes, cell membrane. But plants bolt on three things animals don\'t have: a **rigid cellulose wall** on the outside (why wood is stiff), **chloroplasts** (solar panels that make food from sunlight), and one **giant central vacuole** (an internal water tank that can take up 90% of the cell\'s volume).\n\n' +
        'That last one is the secret to how a plant stands up. When the vacuole is full, it pushes outward against the cell wall — **turgor pressure** — and the plant is rigid. Let it run dry, and the cell collapses. That\'s what wilting *is*. A houseplant drooping has nothing to do with muscle or bone — it\'s a hydraulic failure inside billions of cells.\n\n' +
        '**What they share (both are eukaryotic):**\n' +
        '- Nucleus (DNA headquarters)\n' +
        '- Mitochondria (power generators)\n' +
        '- Ribosomes (protein builders)\n' +
        '- Endoplasmic reticulum + Golgi apparatus (production and shipping)\n' +
        '- Cell membrane (gatekeeper)\n\n' +
        '**What makes them different:**\n\n' +
        '| Feature | Plant cell | Animal cell |\n' +
        '|---------|-----------|-------------|\n' +
        '| **Cell wall** | Yes — rigid cellulose layer outside the membrane | No — flexible shape |\n' +
        '| **Chloroplasts** | Yes — capture sunlight for photosynthesis | No — must eat food |\n' +
        '| **Central vacuole** | One giant vacuole (up to 90% of cell) | Many small vacuoles |\n' +
        '| **Centrioles** | Usually absent | Present — organise cell division |\n' +
        '| **Lysosomes** | Rare | Common — digest waste and invaders |\n' +
        '| **Shape** | Fixed rectangular shape (wall enforces it) | Varied — round, star-shaped, flat |\n\n' +
        '**Why does this matter in Assam?**\n\n' +
        '| Local example | Cell biology connection |\n' +
        '|--------------|------------------------|\n' +
        '| Bamboo grows 30 m tall without bones | Rigid **cell walls** stacked in every cell act like a skeleton |\n' +
        '| Tea leaves are green | **Chloroplasts** filled with chlorophyll absorb red/blue light, reflect green |\n' +
        '| Wilted lettuce goes limp | Cells lost water → **vacuole** shrank → no turgor pressure |\n' +
        '| Red blood cells are disc-shaped | No cell wall → free to take any shape → fits through tiny capillaries |\n\n' +
        '**Try the diagram above** — toggle between plant and animal cells to see the differences side by side.\n\n' +
        '**Check yourself:** If you remove the cell wall from a plant cell, does it die? *No — it becomes a "protoplast" that\'s round and fragile, like an animal cell without its armour.*',
      intermediateContent:
        '**The cell wall — a composite stronger than steel**\n\n' +
        'The plant cell wall is not a simple shell. It\'s an engineered composite material:\n\n' +
        '| Component | What it is | Role | Tensile strength |\n' +
        '|-----------|-----------|------|------------------|\n' +
        '| **Cellulose** | β-1,4-glucan chains (36 per microfibril) | Tensile strength — like steel cables | ~1 GPa |\n' +
        '| **Hemicellulose** | Branched polysaccharides (xyloglucan) | Cross-links cellulose fibres | — |\n' +
        '| **Pectin** | Gel-like polysaccharide | Fills gaps, holds water | — |\n' +
        '| **Lignin** (secondary walls only) | Phenolic polymer | Compression strength + waterproofing | — |\n\n' +
        '**Primary wall** = cellulose + hemicellulose + pectin (flexible, growing cells).\n' +
        '**Secondary wall** = cellulose + hemicellulose + lignin (rigid, mature cells like xylem).\n\n' +
        '**Turgor pressure — the plant\'s hydraulic skeleton:**\n\n' +
        '| Condition | Vacuole | Turgor pressure | Plant appearance |\n' +
        '|-----------|---------|----------------|------------------|\n' +
        '| Well-watered | Full (90% of cell) | 0.5–1.5 MPa (5–15 atm) | Firm, upright |\n' +
        '| Wilting | Shrinking | Near 0 | Limp, drooping |\n' +
        '| Severe drought | Collapsed | Negative (plasmolysis) | Crispy, dying |\n\n' +
        '**Animal cell cytoskeleton — the internal scaffold:**\n\n' +
        'Without a cell wall, animal cells rely on an internal skeleton:\n\n' +
        '| Filament type | Diameter | Made of | Function |\n' +
        '|---------------|----------|---------|----------|\n' +
        '| **Microfilaments** | 7 nm | Actin | Cell shape, movement, muscle contraction |\n' +
        '| **Intermediate filaments** | 10 nm | Keratin, vimentin, etc. | Mechanical strength, anchoring nucleus |\n' +
        '| **Microtubules** | 25 nm | Tubulin | Intracellular transport, cell division (spindle) |',
      advancedContent:
        '**Cellulose synthesis — molecular construction in real time**\n\n' +
        'Cellulose synthase complexes (CSCs) are rosette structures of 36 CesA proteins embedded in the plasma membrane. They move along **cortical microtubule tracks**, extruding cellulose microfibrils whose orientation determines the direction of cell expansion (perpendicular to the fibrils).\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| CSC speed | ~300 nm/min |\n' +
        '| Glucan chains per microfibril | ~36 |\n' +
        '| Microfibril diameter | ~3 nm |\n' +
        '| Cellulose % of dry wood mass | ~40–50% |\n\n' +
        '**Animal extracellular matrix (ECM) — the wall substitute:**\n\n' +
        '| ECM component | Property | Strength/value |\n' +
        '|---------------|----------|----------------|\n' +
        '| **Collagen fibres** | Tensile strength | ~50 MPa |\n' +
        '| **Elastin** | Extensibility | Stretches to 150% strain |\n' +
        '| **Glycosaminoglycans** | Compression resistance | Osmotic swelling fills gaps |\n' +
        '| **Fibronectin** | Cell adhesion | Links ECM to integrins |\n\n' +
        '**Mechanotransduction — cells "feel" their environment:**\n\n' +
        'Cells sense ECM stiffness through **integrins** (transmembrane proteins linking ECM to the actin cytoskeleton). Stiffness-dependent FAK/Src signalling directs stem cell fate:\n\n' +
        '| Matrix stiffness | Matches tissue | Stem cell fate |\n' +
        '|-----------------|----------------|----------------|\n' +
        '| ~0.1 kPa (very soft) | Brain tissue | Neuron differentiation |\n' +
        '| ~10 kPa (medium) | Muscle tissue | Muscle differentiation |\n' +
        '| ~35 kPa (stiff) | Bone tissue | Bone differentiation |\n\n' +
        'This discovery (Engler et al., 2006) — that physical forces, not just chemical signals, direct cell identity — founded the field of **mechanobiology**.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Plant cells have mitochondria AND chloroplasts.', answer: true, explanation: 'Plants need mitochondria for cellular respiration (at night and in non-green tissues) and chloroplasts for photosynthesis. Both organelles coexist.' },
            { text: 'Animal cells have a cell wall made of cellulose.', answer: false, explanation: 'Only plant cells have a cellulose cell wall. Animal cells have a flexible membrane and rely on an internal cytoskeleton for structure.' },
            { text: 'A bamboo stalk is strong because of lignin in secondary cell walls.', answer: true, explanation: 'Lignin is a phenolic polymer deposited in secondary cell walls of xylem and sclerenchyma cells, providing compressive strength and waterproofing.' },
            { text: 'If a plant cell loses water, it grows larger.', answer: false, explanation: 'A plant cell that loses water undergoes plasmolysis — the vacuole shrinks, turgor pressure drops, and the cell (and plant) wilts.' },
          ],
        },
      },
    },

    // ── Section 3: Organelles and Their Functions ─────────────────
    {
      title: 'Organelles and Their Functions',
      beginnerContent:
        'Every cell is a city. Buildings, roads, power stations, factories, post offices, recycling centres — all running 24/7 inside a container smaller than the width of a hair. Here\'s a fact that should astonish you: **mitochondria have their own DNA.** They didn\'t evolve from your cells. They invaded. About 2 billion years ago, a primitive cell swallowed a free-living bacterium but failed to digest it. The bacterium kept doing what it always did — converting oxygen and glucose into ATP — and the host cell got the energy for free. That symbiosis stuck. Today, every complex cell on Earth (plants, animals, fungi) is a descendant of that ancient merger. **The power stations in your cells are the great-great-great-grandchildren of bacteria.**\n\n' +
        'Think of a eukaryotic cell as a **miniature city**. Each organelle is a building with a specific job:\n\n' +
        '| Organelle | City analogy | Job |\n' +
        '|-----------|-------------|-----|\n' +
        '| **Nucleus** | City hall (government HQ) | Stores DNA — the master blueprint for all proteins |\n' +
        '| **Ribosomes** | Construction workers | Read DNA instructions and build proteins |\n' +
        '| **Rough ER** | Factory floor | Folds and processes proteins (studded with ribosomes) |\n' +
        '| **Smooth ER** | Chemical plant | Makes lipids (fats) and detoxifies harmful substances |\n' +
        '| **Golgi apparatus** | Post office | Packages, labels, and ships proteins to destinations |\n' +
        '| **Mitochondria** | Power station | Burns glucose + oxygen → produces ATP (energy currency) |\n' +
        '| **Lysosomes** | Recycling centre | Digests waste, worn-out parts, and invaders (pH ~4.5) |\n' +
        '| **Cytoskeleton** | Roads + scaffolding | Structural support, transport highways, cell movement |\n\n' +
        '**The nucleus — headquarters:**\n\n' +
        'The nucleus is surrounded by a **double membrane** (nuclear envelope) with thousands of tiny pores — like security gates that control what enters and exits. Inside, a dense region called the **nucleolus** builds ribosomes. Think of the nucleus as a locked vault: the DNA never leaves, but copies of instructions (mRNA) are sent out through the pores to the ribosomes.\n\n' +
        '**Mitochondria — the power stations:**\n\n' +
        'Mitochondria take in glucose and oxygen and produce **ATP** — the energy molecule that powers nearly everything your cells do. They have their own DNA (a clue that they were once free-living bacteria!). A muscle cell in your leg might have **2,000 mitochondria** because it needs enormous amounts of energy.\n\n' +
        '**Lysosomes — handle with care:**\n\n' +
        'Lysosomes contain powerful digestive enzymes at a highly acidic pH of ~4.5. If a lysosome bursts, these enzymes digest the cell itself — a process called **autolysis**. Think of lysosomes as bags of acid with a "do not puncture" label.\n\n' +
        '**Check yourself:** A cell that needs lots of energy (like a heart muscle cell) would have more of which organelle? *Mitochondria — the more energy needed, the more power stations required.*',
      intermediateContent:
        '**Cellular respiration — turning food into ATP (step by step):**\n\n' +
        '| Stage | Location | Input | Output | ATP yield |\n' +
        '|-------|----------|-------|--------|-----------|\n' +
        '| **Glycolysis** | Cytoplasm | 1 glucose (6C) | 2 pyruvate (3C) | 2 ATP + 2 NADH |\n' +
        '| **Krebs cycle** | Mitochondrial matrix | 2 pyruvate → 2 acetyl-CoA | 6 CO₂ | 2 ATP + 8 NADH + 2 FADH₂ |\n' +
        '| **Oxidative phosphorylation** | Inner mitochondrial membrane | NADH + FADH₂ + O₂ | H₂O | ~34 ATP |\n' +
        '| **Total** | | **C₆H₁₂O₆ + 6O₂** | **6CO₂ + 6H₂O** | **~36–38 ATP** |\n\n' +
        '**Worked example — energy from one meal:**\n\n' +
        'You eat 300 g of rice (78 g carbohydrate = 78 g glucose equivalent).\n\n' +
        '- 78 g glucose ÷ 180 g/mol = **0.433 mol glucose**\n' +
        '- Each mole of glucose → ~36 mol ATP\n' +
        '- 0.433 × 36 = **~15.6 mol ATP** from that bowl of rice\n' +
        '- Each ATP releases ~30.5 kJ → 15.6 × 30.5 = **~476 kJ** of usable energy\n\n' +
        '**ATP synthase — nature\'s rotary motor:**\n\n' +
        'The electron transport chain pumps protons (H⁺) across the inner mitochondrial membrane, creating a gradient. Protons flow back through **ATP synthase**, a molecular turbine that spins at ~130 revolutions per second — each rotation producing 3 ATP molecules.\n\n' +
        '**The Golgi and your blood type:**\n\n' +
        '| Blood type | Golgi adds this sugar to red blood cells |\n' +
        '|------------|------------------------------------------|\n' +
        '| A | N-acetylgalactosamine |\n' +
        '| B | Galactose |\n' +
        '| AB | Both |\n' +
        '| O | Neither (base H-antigen only) |\n\n' +
        'Your blood type is literally determined by which sugars the Golgi apparatus attaches to proteins on your red blood cells.',
      advancedContent:
        '**ATP synthase — structure and mechanism:**\n\n' +
        '| Subunit | Location | Function |\n' +
        '|---------|----------|----------|\n' +
        '| **F₁** (α₃β₃γδε) | Matrix side | Catalytic — 3 β-subunits cycle through open→loose→tight conformations |\n' +
        '| **F₀** (ab₂c₈₋₁₅) | In the membrane | Proton-driven rotor — each H⁺ advances one c-subunit |\n' +
        '| **γ-shaft** | Connects F₀ to F₁ | Rotates with the c-ring, driving conformational changes in β-subunits |\n\n' +
        '**Stoichiometry (mammalian, 10 c-subunits):**\n\n' +
        '- 10 protons per full rotation → 3 ATP per rotation → H⁺/ATP = **3.33**\n' +
        '- At ~130 rev/s, each ATP synthase produces ~**390 ATP molecules per second**\n\n' +
        'Yoshida and Noji (1997) directly visualised the rotation by attaching a fluorescent actin filament to the γ-shaft — confirming the rotary catalysis model at the single-molecule level.\n\n' +
        '**Mitophagy — quality control for mitochondria:**\n\n' +
        '| Step | Molecular event |\n' +
        '|------|-----------------|\n' +
        '| 1. Damage detected | Mitochondrial membrane potential collapses |\n' +
        '| 2. PINK1 accumulates | Kinase stabilised on outer membrane (normally degraded in healthy mitochondria) |\n' +
        '| 3. Parkin recruited | E3 ubiquitin ligase ubiquitinates outer membrane proteins |\n' +
        '| 4. Autophagosome engulfs | LC3-decorated membrane wraps around the tagged mitochondrion |\n' +
        '| 5. Lysosomal degradation | Autophagosome fuses with lysosome → contents digested |\n\n' +
        'Defects in the **PINK1/Parkin pathway** cause early-onset Parkinson\'s disease — demonstrating that mitochondrial quality control is essential for neuronal survival. Dopaminergic neurons in the substantia nigra are especially vulnerable because of their high energy demands and extensive axonal arbors.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each organelle to its function',
          pairs: [
            ['Nucleus', 'Contains DNA — the cell\'s control centre and blueprint vault'],
            ['Mitochondria', 'Produces ATP — the cell\'s power station (from glucose + O₂)'],
            ['Rough ER', 'Folds and processes proteins — studded with ribosomes'],
            ['Golgi apparatus', 'Packages, labels, and ships proteins — the cell\'s post office'],
            ['Lysosomes', 'Digests waste and invaders — the cell\'s recycling centre (pH ~4.5)'],
            ['Ribosomes', 'Reads mRNA and builds proteins — the cell\'s construction workers'],
          ],
        },
      },
    },

    // ── Section 4: The Cell Membrane ──────────────────────────────
    {
      title: 'The Cell Membrane',
      diagram: 'CellMembraneDiagram',
      beginnerContent:
        'Look at the membrane above. Two rows of pill-shaped molecules facing each other, tails inward, heads outward. That\'s the **phospholipid bilayer** — the boundary that every cell on Earth uses to define itself. It\'s **7 nanometres thick** — one ten-thousandth the width of a human hair. But without it, there is no "inside" and "outside." No life.\n\n' +
        'The engineering trick is brilliant. Each phospholipid molecule has a water-loving (hydrophilic) head and two water-fearing (hydrophobic) tails. Drop them in water and they self-assemble — heads turn outward toward the water, tails hide inward from it, forming a perfect double layer. No assembly required. The same physics as oil droplets forming beads on wet glass. Life uses it everywhere.\n\n' +
        'Watch the particles crossing. Some slip through directly — small fats, O₂, CO₂ are small enough to squeeze between the phospholipids. But charged or large molecules can\'t. Those have to go through **channel proteins** (tunnels) or **carrier proteins** (active pumps). This is why the membrane isn\'t just a barrier — it\'s a **selectively permeable** gatekeeper.\n\n' +
        '**What is it made of?**\n\n' +
        'The membrane is built from **phospholipids** — molecules with a water-loving (hydrophilic) head and two water-fearing (hydrophobic) tails. They naturally arrange into a double layer:\n\n' +
        '- Heads face outward → toward the watery environment on both sides\n' +
        '- Tails face inward → hiding from water in the middle\n\n' +
        'Floating in this lipid sea are **proteins** (like gates and guards) and **cholesterol** (keeps the membrane flexible but not too wobbly).\n\n' +
        '**What can pass through?**\n\n' +
        '| Substance | Can it cross? | How? |\n' +
        '|-----------|-------------|------|\n' +
        '| O₂, CO₂ (small, nonpolar) | Yes — freely | Slips between phospholipids |\n' +
        '| Water (small, polar) | Slowly — or fast through aquaporins | Special channel proteins |\n' +
        '| Glucose (large, polar) | No — needs a carrier | GLUT transport proteins |\n' +
        '| Na⁺, K⁺, Ca²⁺ (charged ions) | No — blocked by lipid tails | Ion channel proteins |\n' +
        '| Proteins (very large) | No — too big for channels | Vesicle transport (endo/exocytosis) |\n\n' +
        '**Two types of transport:**\n\n' +
        '| Type | Direction | Energy needed? | Analogy |\n' +
        '|------|-----------|---------------|----------|\n' +
        '| **Passive transport** | High → low concentration | No (downhill) | A ball rolling downhill |\n' +
        '| **Active transport** | Low → high concentration | Yes — uses ATP (uphill) | Pushing a ball uphill |\n\n' +
        '**Local example:** When tea leaves are placed in hot water, flavour molecules move from high concentration (inside the leaf) to low concentration (the water) by **diffusion** — passive transport. No energy needed; the molecules spread naturally.',
      intermediateContent:
        '**The Na⁺/K⁺-ATPase pump — the cell\'s most important active transporter:**\n\n' +
        'This single pump uses ~25% of your cell\'s total ATP budget. For every ATP molecule it burns:\n\n' +
        '| Direction | Ion | Number moved |\n' +
        '|-----------|-----|-------------|\n' +
        '| Out of cell | Na⁺ | 3 |\n' +
        '| Into cell | K⁺ | 2 |\n\n' +
        'This creates massive concentration gradients:\n\n' +
        '| Ion | Inside cell | Outside cell | Gradient |\n' +
        '|-----|------------|-------------|----------|\n' +
        '| Na⁺ | ~12 mM | ~145 mM | 12× more outside |\n' +
        '| K⁺ | ~140 mM | ~4 mM | 35× more inside |\n\n' +
        'The result: a **resting membrane potential** of approximately **−70 mV** — the cell\'s interior is negatively charged relative to the outside. This electrical difference is what makes nerve signalling, muscle contraction, and heartbeat possible.\n\n' +
        '**The Goldman equation** calculates this voltage:\n\n' +
        '`V = (RT/F) × ln[(P_K[K⁺]out + P_Na[Na⁺]out + P_Cl[Cl⁻]in) / (P_K[K⁺]in + P_Na[Na⁺]in + P_Cl[Cl⁻]out)]`\n\n' +
        '**Worked example — osmotic pressure of blood:**\n\n' +
        'Hospital IV drips use **0.9% NaCl** (isotonic saline). Why exactly 0.9%?\n\n' +
        '- 0.9% NaCl = 9 g/L ÷ 58.44 g/mol = **0.154 M**\n' +
        '- NaCl dissociates → i = 2 particles per molecule\n' +
        '- Osmotic pressure π = iMRT = 2 × 0.154 × 8.314 × 310 = **793 kPa (~7.8 atm)**\n' +
        '- This matches blood plasma osmotic pressure → no net water flow → cells stay safe',
      advancedContent:
        '**Beyond the fluid mosaic — modern membrane biology:**\n\n' +
        '| Discovery | What it changed |\n' +
        '|-----------|----------------|\n' +
        '| **Lipid rafts** | Cholesterol + sphingolipid microdomains (10–200 nm) concentrate signalling proteins — platforms for signal transduction, viral entry |\n' +
        '| **Picket-fence model** | Cortical actin meshwork restricts protein diffusion 10–100× below predictions — membrane proteins don\'t float freely |\n' +
        '| **Aquaporin selectivity** | 2.8 angstrom constriction passes 3 × 10⁹ H₂O/s while completely excluding H⁺ — NPA motifs reorient water dipoles |\n\n' +
        '**Aquaporin-1 — precision engineering at the molecular level:**\n\n' +
        '| Feature | Value | Why it matters |\n' +
        '|---------|-------|----------------|\n' +
        '| Pore diameter | 2.8 angstrom (narrowest point) | Forces single-file water passage |\n' +
        '| Water throughput | ~3 × 10⁹ molecules/s/channel | 10–100× faster than bare membrane |\n' +
        '| Proton exclusion | Complete | NPA motifs flip water dipoles, blocking Grotthuss H⁺ hopping |\n' +
        '| Selectivity filter | Ar/R constriction + NPA motifs | Size + electrostatic barrier |\n\n' +
        'Peter Agre received the 2003 Nobel Prize in Chemistry for discovering aquaporins. The clinical relevance is profound: aquaporin-2 in kidney collecting ducts is regulated by vasopressin (ADH) — mutations cause nephrogenic diabetes insipidus (inability to concentrate urine, producing up to 20 L/day).\n\n' +
        'Single-molecule tracking (FRAP, SPT) reveals that membrane protein diffusion is governed not by the Saffman-Delbrück model (which predicts fast, viscosity-limited diffusion) but by **transient confinement** within actin-corralled compartments (~40–300 nm). Hop diffusion between compartments occurs stochastically, with dwell times of 1–25 ms.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each transport type to its description',
          pairs: [
            ['Simple diffusion', 'Small nonpolar molecules (O₂, CO₂) pass directly through the lipid bilayer — no energy, no protein'],
            ['Facilitated diffusion', 'Molecules move through channel or carrier proteins DOWN the concentration gradient — no energy needed'],
            ['Active transport', 'Molecules pumped AGAINST the concentration gradient — requires ATP (e.g., Na⁺/K⁺ pump)'],
            ['Osmosis', 'Water moves through a semi-permeable membrane from low solute to high solute concentration'],
          ],
        },
      },
    },

    // ── Section 5: Osmosis and Osmotic Pressure ───────────────────
    {
      title: 'Osmosis and Osmotic Pressure',
      diagram: 'OsmosisDiagram',
      beginnerContent:
        'Watch the diagram above. Water molecules on the left, sugar water on the right, a membrane between them with gaps just big enough for water but too small for sugar. Water flows **from the pure side to the sugar side.** Not because water is "attracted" to sugar — but because there are more free water molecules on the pure side, more bumping against the membrane, more finding the gaps. Net result: water migrates toward wherever the solute is more concentrated. **This is osmosis.**\n\n' +
        'This single process explains an enormous range of things:\n\n' +
        '- Why your fingers get wrinkly in the bathtub (water osmoses *into* your skin cells; tight areas buckle)\n' +
        '- Why putting salt on a slug kills it (water osmoses *out*, dehydrating every cell)\n' +
        '- Why drinking seawater makes you dehydrated (your cells leak water into the salty intestinal fluid)\n' +
        '- Why trees don\'t need a pump to move water 100m upward (evaporation from leaves creates low pressure; osmosis pulls water up to fill the gap)\n' +
        '- Why you pickle vegetables in brine (salt pulls water out of bacterial cells and kills them)\n\n' +
        'Cells care about osmotic balance *constantly*. Drift too far in either direction and they burst or shrivel:\n\n' +
        '**Three scenarios for a cell:**\n\n' +
        '| Solution type | Solute outside vs inside | What happens to the cell | Example |\n' +
        '|--------------|------------------------|-------------------------|----------|\n' +
        '| **Hypotonic** | Less outside, more inside | Water rushes IN → cell swells → may burst (lysis) | Red blood cell in pure water |\n' +
        '| **Hypertonic** | More outside, less inside | Water flows OUT → cell shrivels (crenation) | Cell in concentrated salt |\n' +
        '| **Isotonic** | Equal on both sides | No net water movement → cell stays normal | Cell in 0.9% saline |\n\n' +
        '**Osmosis in everyday Assam:**\n\n' +
        '| What you see | What\'s happening at the cell level |\n' +
        '|-------------|-----------------------------------|\n' +
        '| Tea garden plants wilt at midday | Cells lose water faster than roots absorb it → vacuoles shrink → turgor drops |\n' +
        '| Salting raw mango draws out juice | Salt creates a hypertonic environment → water leaves mango cells by osmosis |\n' +
        '| Rice grains swell in water | Water enters rice cells by osmosis (cell contents are more concentrated) |\n' +
        '| Roots absorb water from soil | Root cell sap is more concentrated than soil water → osmosis pulls water in |\n\n' +
        '**Quick check:** If you soak a wilted lettuce leaf in cold water, it becomes crisp again. Why? *Water enters the cells by osmosis (the cell sap is hypertonic), refilling the vacuoles and restoring turgor pressure.*',
      intermediateContent:
        '**The van \'t Hoff equation — calculating osmotic pressure:**\n\n' +
        '**π = iMRT**\n\n' +
        '| Symbol | Meaning | Units |\n' +
        '|--------|---------|-------|\n' +
        '| π | Osmotic pressure | kPa or atm |\n' +
        '| i | Van \'t Hoff factor (particles per formula unit) | dimensionless |\n' +
        '| M | Molarity | mol/L |\n' +
        '| R | Gas constant | 8.314 J/(mol·K) |\n' +
        '| T | Temperature | Kelvin |\n\n' +
        '**Van \'t Hoff factors for common solutes:**\n\n' +
        '| Solute | Dissociation | i |\n' +
        '|--------|-------------|---|\n' +
        '| Glucose (C₆H₁₂O₆) | Doesn\'t dissociate | 1 |\n' +
        '| NaCl | Na⁺ + Cl⁻ | 2 |\n' +
        '| CaCl₂ | Ca²⁺ + 2Cl⁻ | 3 |\n' +
        '| AlCl₃ | Al³⁺ + 3Cl⁻ | 4 |\n\n' +
        '**Worked example — blood plasma:**\n\n' +
        'Blood plasma is ~0.3 osmol/L at body temperature (310 K):\n\n' +
        '`π = 0.3 × 8.314 × 310 = 773 kPa ≈ 7.6 atm`\n\n' +
        'That\'s 7.6 times atmospheric pressure! This is why hospital IV fluids must be precisely **isotonic** (0.9% NaCl = 0.308 osmol/L).\n\n' +
        '**Water potential in plants (Ψ):**\n\n' +
        '`Ψ = Ψ_p + Ψ_s`\n\n' +
        '| Component | Symbol | Meaning | Sign |\n' +
        '|-----------|--------|---------|------|\n' +
        '| Pressure potential | Ψ_p | Turgor pressure from cell wall | Positive (in turgid cells) |\n' +
        '| Solute potential | Ψ_s | −iMRT (osmotic effect of solutes) | Always negative |\n\n' +
        '**Worked example — turgid plant cell:**\n\n' +
        '- Ψ_p = +0.8 MPa (cell wall pushing inward)\n' +
        '- Ψ_s = −0.8 MPa (solutes pulling water in)\n' +
        '- Ψ = 0.8 + (−0.8) = **0 MPa** → no net water flow → equilibrium\n\n' +
        'If the plant loses water: Ψ_p drops → Ψ becomes negative → water is drawn in from surrounding cells. Normal blood osmolarity: **275–295 mOsm/L**.',
      advancedContent:
        '**The thermodynamics of osmosis:**\n\n' +
        'Van \'t Hoff (Nobel Prize in Chemistry, 1901) recognised that osmotic pressure follows a formal analogy with the ideal gas law: **πV = nRT** for dilute solutions.\n\n' +
        '| Regime | Equation | When to use |\n' +
        '|--------|----------|-------------|\n' +
        '| Ideal (dilute) | π = iMRT | < 0.1 M solutions |\n' +
        '| Non-ideal (concentrated) | π = MRT(1 + BM + CM² + ...) | > 0.1 M — virial expansion |\n\n' +
        'The free energy of mixing: **ΔG_mix = nRT(x₁ ln x₁ + x₂ ln x₂)** is always negative for ideal solutions → osmotic flow is thermodynamically spontaneous.\n\n' +
        '**Reverse osmosis (RO) — engineering against nature:**\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| Principle | Apply pressure > π to force water from concentrated → dilute |\n' +
        '| Seawater π | ~25 atm (due to ~0.5 M NaCl) |\n' +
        '| Operating pressure | 50–80 atm (5–8 MPa) |\n' +
        '| Membrane type | Thin-film composite polyamide |\n' +
        '| Salt rejection | > 99.5% |\n' +
        '| Global RO capacity (2024) | ~100 million m³/day |\n\n' +
        '**Aquaporins in osmotic regulation:**\n\n' +
        'Membrane water permeability varies by 10–100× depending on aquaporin density:\n\n' +
        '| Tissue | Aquaporin | Regulation | Clinical relevance |\n' +
        '|--------|-----------|------------|--------------------|\n' +
        '| Kidney collecting duct | AQP2 | Vasopressin (ADH) inserts AQP2 into membrane | Nephrogenic diabetes insipidus |\n' +
        '| Red blood cells | AQP1 | Constitutive | Enables rapid volume changes in capillaries |\n' +
        '| Brain (astrocytes) | AQP4 | Constitutive | Cerebral oedema after stroke |\n\n' +
        '**Osmotic stress responses:** When cells encounter osmotic shock, MAP kinase cascades activate transcription factors (e.g., TonEBP/NFAT5 in mammals) that upregulate **compatible osmolytes** — sorbitol, betaine, taurine, myo-inositol — small organic molecules that restore cell volume without disrupting protein function.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Your blood has an osmotic pressure of ~7.6 atmospheres — equivalent to the pressure 76 metres underwater. Hospital IV fluids must match this precisely, or your red blood cells will burst or shrivel.',
            'When you salt raw mango to make achaar, you\'re using osmosis: salt creates a hypertonic environment that pulls water out of the mango cells, concentrating the flavour.',
            'Reverse osmosis desalination plants produce ~100 million cubic metres of fresh water per day globally — enough to fill 40,000 Olympic swimming pools.',
            'A single aquaporin channel passes 3 billion water molecules per second while blocking every single proton — one of the most selective filters in nature.',
          ],
        },
      },
    },

    // ── Section 6: Cell Division: Mitosis ─────────────────────────
    {
      title: 'Cell Division: Mitosis',
      diagram: 'MitosisDiagram',
      beginnerContent:
        'Right now, as you read this sentence, **25 million of your cells just divided.** Your body makes 330 billion new cells every day. You started life as one cell — a fertilised egg — and everything you are came from that cell dividing again and again, in a precisely choreographed sequence called **mitosis**.\n\n' +
        'Watch the animation above. It loops through all six phases: Interphase → Prophase → Metaphase → Anaphase → Telophase → Cytokinesis. The chromosomes are loose at first, then condense into sharp X-shapes (each X is two copies of a chromosome stuck together — **sister chromatids**). They line up at the cell\'s equator in metaphase. Spindle fibres from each pole grab them and pull. In anaphase, the sister chromatids snap apart and rocket toward opposite poles. Two new nuclei form. The cell pinches in the middle. One cell becomes two.\n\n' +
        'The whole process takes about an hour in a typical human cell. **It has to be perfect.** A single mistake — a chromosome lost, a chromosome gained — can be catastrophic. Cancer is, fundamentally, mitosis gone wrong.\n\n' +
        '**The four stages of mitosis (PMAT):**\n\n' +
        '| Stage | What happens | Analogy |\n' +
        '|-------|-------------|----------|\n' +
        '| **P**rophase | Chromosomes condense and become visible; nuclear envelope breaks down; spindle fibres form | Workers pack files into folders and dismantle the office walls |\n' +
        '| **M**etaphase | Chromosomes line up along the cell\'s equator; spindle fibres attach to centromeres | Folders lined up at the centre of the room, one rope tied to each |\n' +
        '| **A**naphase | Sister chromatids pulled to opposite poles by shortening spindle fibres | Two teams in tug-of-war — the staple breaks and each team gets a copy |\n' +
        '| **T**elophase | Nuclear envelopes reform; chromosomes decondense; spindle disassembles | Two new offices are built, files unpacked |\n\n' +
        '**Then comes cytokinesis** — physically splitting into two cells:\n\n' +
        '| Cell type | How it splits |\n' +
        '|-----------|---------------|\n' +
        '| **Animal cell** | Actin ring contracts like a drawstring purse → pinches inward (cleavage furrow) |\n' +
        '| **Plant cell** | Vesicles fuse at the middle to build a new wall (cell plate) |\n\n' +
        '**The critical outcome:** Each daughter cell gets an **exact copy** of the parent\'s DNA — same number, same type of chromosomes. If this goes wrong (wrong chromosome count), it can lead to **cancer** — uncontrolled cell division.\n\n' +
        '**Explore the diagram above** — watch each stage of mitosis unfold step by step.',
      intermediateContent:
        '**The cell cycle — timing and checkpoints:**\n\n' +
        '| Phase | What happens | Duration (human cell) |\n' +
        '|-------|-------------|----------------------|\n' +
        '| **G₁** (Gap 1) | Cell grows, produces proteins, prepares to copy DNA | ~11 hours |\n' +
        '| **S** (Synthesis) | DNA replication — all 46 chromosomes copied | ~8 hours |\n' +
        '| **G₂** (Gap 2) | Final preparations — error checking, organelle duplication | ~4 hours |\n' +
        '| **M** (Mitosis + cytokinesis) | Division into two daughter cells | ~1 hour |\n' +
        '| **Total** | | **~24 hours** |\n\n' +
        '**Three critical checkpoints — the cell\'s "quality control":**\n\n' +
        '| Checkpoint | Location | Question asked | What happens if it fails |\n' +
        '|------------|----------|---------------|-------------------------|\n' +
        '| **G₁/S** (restriction point) | End of G₁ | Is the cell big enough? Is the DNA intact? | Cell enters G₀ (resting) or triggers repair |\n' +
        '| **G₂/M** | End of G₂ | Is DNA replication complete and error-free? | Division delayed until repair is done |\n' +
        '| **Spindle assembly (SAC)** | Metaphase | Is every chromosome properly attached to spindle fibres? | Anaphase blocked until all kinetochores attached |\n\n' +
        '**The SAC in detail:**\n\n' +
        'The Mad2/BubR1 complex monitors kinetochore attachment. A **single unattached kinetochore** is enough to delay anaphase — the cell won\'t proceed until every chromosome is secured. Unattached kinetochores catalyse the conversion of O-Mad2 → C-Mad2, which inhibits the anaphase-promoting complex (APC/C). Only when all kinetochores are bioriented does the signal stop, APC/C activates, and sister chromatids separate.\n\n' +
        '**Worked example — cell turnover:**\n\n' +
        'Your gut epithelium replaces itself every 3–5 days. The human gut surface area is ~32 m². If the epithelium is one cell thick with cells ~10 μm wide:\n\n' +
        '- Cells per m² ≈ (10⁶/10)² = 10¹⁰\n' +
        '- Total gut cells ≈ 32 × 10¹⁰ = **3.2 × 10¹¹ cells**\n' +
        '- Replaced every ~4 days → ~**80 billion new cells per day** — just in your gut!',
      advancedContent:
        '**When cell division goes wrong — the molecular basis of cancer:**\n\n' +
        '| Gene type | Normal function | Cancer mutation effect | Example |\n' +
        '|-----------|----------------|----------------------|----------|\n' +
        '| **Proto-oncogene** | Promotes cell growth (accelerator) | Stuck "on" → oncogene | RAS (mutated in ~30% of all cancers) |\n' +
        '| **Tumour suppressor** | Stops cell growth (brake) | Stuck "off" → no brakes | p53 (mutated in ~50% of all cancers) |\n' +
        '| **DNA repair gene** | Fixes DNA errors | Errors accumulate → more mutations | BRCA1/2 (breast/ovarian cancer risk) |\n\n' +
        '**The Rb/E2F pathway:**\n\n' +
        '| Step | What happens |\n' +
        '|------|-----------------|\n' +
        '| 1. Rb binds E2F | E2F transcription factor sequestered → S-phase genes OFF |\n' +
        '| 2. Growth factor signal | Cyclin D/CDK4 activated |\n' +
        '| 3. Rb phosphorylated | Releases E2F |\n' +
        '| 4. E2F drives S-phase genes | DNA replication begins |\n\n' +
        '**p53 — "guardian of the genome":**\n\n' +
        'When DNA damage is detected:\n' +
        '- p53 activates **p21** (CDK inhibitor) → arrests cell cycle at G₁ for repair\n' +
        '- If damage is irreparable: p53 triggers **apoptosis** (programmed cell death)\n' +
        '- Pathway: p53 → Bax → mitochondrial cytochrome c release → caspase cascade → cell death\n\n' +
        '**Meiosis vs mitosis:**\n\n' +
        '| Feature | Mitosis | Meiosis |\n' +
        '|---------|---------|----------|\n' +
        '| Divisions | 1 | 2 (meiosis I + II) |\n' +
        '| Daughter cells | 2 diploid (2n) | 4 haploid (n) |\n' +
        '| Genetically | Identical to parent | Unique (crossing over + independent assortment) |\n' +
        '| Purpose | Growth, repair | Gamete production (eggs, sperm) |\n' +
        '| Crossing over | No | Yes — 1–3 chiasmata per chromosome pair |\n\n' +
        '**Non-disjunction** — failure of chromosomes to separate properly during meiosis — causes **aneuploidy**. Trisomy 21 (three copies of chromosome 21 → Down syndrome) is the most common viable autosomal aneuploidy in humans, occurring in ~1/700 live births. Risk increases with maternal age due to prolonged arrest of oocytes in meiosis I (up to 50 years).',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'After mitosis, each daughter cell has half the chromosomes of the parent.', answer: false, explanation: 'Mitosis produces two IDENTICAL daughter cells, each with the SAME number of chromosomes as the parent. Meiosis is the process that halves the chromosome number.' },
            { text: 'A single unattached kinetochore can delay the start of anaphase.', answer: true, explanation: 'The spindle assembly checkpoint (SAC) blocks anaphase until every single kinetochore is properly attached — even one unattached kinetochore sustains the "wait" signal via the Mad2/BubR1 complex.' },
            { text: 'Cancer is caused by a single gene mutation.', answer: false, explanation: 'Cancer typically requires multiple mutations — usually both activation of oncogenes AND inactivation of tumour suppressors. This is why cancer risk increases with age (more time to accumulate mutations).' },
            { text: 'Plant cells divide differently from animal cells during cytokinesis.', answer: true, explanation: 'Animal cells pinch inward using an actin ring (cleavage furrow). Plant cells build a new wall from the inside out using vesicles (cell plate), because the rigid cell wall prevents pinching.' },
          ],
        },
      },
    },
  ],
};
