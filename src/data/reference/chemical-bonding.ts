import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'chemical-bonding',
  title: 'Chemical Bonding',
  category: 'chemistry',
  icon: '⚗️',
  tagline:
    'Why atoms join together — the glue that builds molecules from salt to silk protein.',
  relatedStories: ['why-the-muga-silk-is-golden', 'eri-silk', 'bridge-that-grew'],
  understand: [
    // ── Section 1: Why Atoms Bond ─────────────────────────────
    {
      title: 'Why Atoms Bond',
      beginnerContent:
        'Imagine you have a jigsaw puzzle with one piece missing. You feel uneasy until that slot is filled. Atoms are the same way — they "want" a complete outer shell of electrons, and they will bond with other atoms to get it.\n\n' +
        '**The octet rule:** Atoms are most stable when they have **8 electrons** in their outermost shell (or 2 for hydrogen and helium, which only have the first shell). Noble gases — helium, neon, argon — already have full outer shells, which is why they almost never react with anything.\n\n' +
        'Every other atom has an incomplete outer shell. To fix this, atoms use one of three strategies:\n\n' +
        '| Strategy | Who does it | How it works | Analogy |\n' +
        '|----------|------------|--------------|----------|\n' +
        '| **Give away** electrons | Metals (Na, K, Fe) | Lose 1-3 electrons → become positive ions | Donating extra puzzle pieces |\n' +
        '| **Take** electrons | Non-metals (Cl, O, S) | Gain 1-3 electrons → become negative ions | Grabbing missing pieces |\n' +
        '| **Share** electrons | Two non-metals (H₂, O₂, H₂O) | Both atoms count the shared pair | Two people sharing one puzzle piece |\n\n' +
        '**Which strategy wins?** It depends on **electronegativity** — a measure of how strongly an atom attracts electrons. Fluorine is the greediest (EN = 4.0). Francium is the most generous (EN = 0.7).\n\n' +
        '| Electronegativity difference (ΔEN) | Bond type | Example |\n' +
        '|--------------------------------------|-----------|----------|\n' +
        '| > 1.7 | **Ionic** — electron transferred | NaCl (ΔEN = 2.1) |\n' +
        '| 0.4 – 1.7 | **Polar covalent** — shared unequally | H₂O (ΔEN = 1.4) |\n' +
        '| < 0.4 | **Nonpolar covalent** — shared equally | H₂ (ΔEN = 0), O₂ (ΔEN = 0) |\n\n' +
        '**Quick check:** Table salt (NaCl) dissolves in the Brahmaputra but oil floats on top. Why? NaCl is ionic — its charged ions attract water\'s polar molecules. Oil has nonpolar covalent bonds — no charges for water to grab onto.',
      intermediateContent:
        '**Electronegativity and the periodic table:**\n\n' +
        'Electronegativity increases as you move **right** across a period (more protons pulling electrons closer) and **up** a group (electrons are closer to the nucleus). This creates a predictable pattern:\n\n' +
        '| Element | Group | EN (Pauling) | Tendency |\n' +
        '|---------|-------|-------------|----------|\n' +
        '| Na | 1 (alkali metals) | 0.9 | Loses electrons easily |\n' +
        '| Mg | 2 (alkaline earths) | 1.2 | Loses electrons |\n' +
        '| C | 14 | 2.5 | Shares electrons |\n' +
        '| N | 15 | 3.0 | Shares/gains electrons |\n' +
        '| O | 16 | 3.5 | Gains electrons |\n' +
        '| F | 17 (halogens) | **4.0** | Strongest electron attractor |\n\n' +
        '**Bond polarity and dipole moments:**\n\n' +
        'When electrons are shared unequally, one end of the bond becomes slightly negative (δ−) and the other slightly positive (δ+). The **dipole moment** μ = q × d measures this separation:\n\n' +
        '| Molecule | ΔEN | μ (Debye) | Polarity |\n' +
        '|----------|-----|-----------|----------|\n' +
        '| H₂ | 0.0 | 0.0 | Nonpolar |\n' +
        '| HCl | 0.9 | 1.08 | Polar |\n' +
        '| HF | 1.9 | 1.82 | Highly polar |\n' +
        '| CO₂ | 1.0 per bond | **0.0** | Nonpolar (dipoles cancel — linear) |\n' +
        '| H₂O | 1.4 per bond | **1.85** | Polar (dipoles add — bent shape) |\n\n' +
        'CO₂ is fascinating: each C=O bond is polar, but the linear shape means the two dipoles point in exactly opposite directions and cancel. H₂O\'s bent shape means its dipoles *add*, making water one of the most polar solvents known — which is why the rivers of Assam dissolve minerals, carry nutrients, and sustain life.',
      advancedContent:
        '**Beyond electronegativity — molecular orbital theory:**\n\n' +
        'The octet rule is a simplification. At a deeper level, bonding occurs because overlapping atomic orbitals form **molecular orbitals (MOs)**:\n\n' +
        '| MO type | Energy | Electron location | Effect on bond |\n' +
        '|---------|--------|------------------|----------------|\n' +
        '| **Bonding (σ, π)** | Lower than atomic orbitals | Between the nuclei | Strengthens bond |\n' +
        '| **Antibonding (σ*, π*)** | Higher than atomic orbitals | Away from nuclei | Weakens bond |\n' +
        '| **Nonbonding** | Same as atomic orbitals | On one atom only | No effect |\n\n' +
        '**Bond order** = ½(bonding electrons − antibonding electrons)\n\n' +
        '| Molecule | Bonding e⁻ | Antibonding e⁻ | Bond order | Stable? |\n' +
        '|----------|-----------|----------------|------------|---------|\n' +
        '| H₂ | 2 | 0 | 1 | Yes — single bond |\n' +
        '| He₂ | 2 | 2 | **0** | **No** — does not exist |\n' +
        '| O₂ | 8 | 4 | 2 | Yes — double bond |\n' +
        '| N₂ | 8 | 2 | 3 | Yes — triple bond (very strong) |\n\n' +
        'MO theory explains something valence bond theory cannot: **O₂ is paramagnetic** (attracted by a magnet). The MO diagram shows two unpaired electrons in the π* antibonding orbitals — impossible to predict from Lewis structures, which show all electrons paired.\n\n' +
        '**Density functional theory (DFT)**, the workhorse of computational chemistry, approximates the Schrödinger equation by expressing energy as a functional of electron density rather than wavefunctions. DFT calculations of silk fibroin\'s hydrogen-bond network help materials scientists understand why Muga silk combines strength with flexibility — guiding the design of bio-inspired synthetic fibres.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each bond type to its description',
          pairs: [
            ['Ionic bond', 'Electron transferred from metal to non-metal — held by electrostatic attraction (NaCl)'],
            ['Nonpolar covalent bond', 'Electrons shared equally between identical atoms (H₂, O₂, N₂)'],
            ['Polar covalent bond', 'Electrons shared unequally — one atom pulls harder (H₂O, HCl)'],
            ['Metallic bond', 'Valence electrons delocalised into a shared "sea" around positive metal ions'],
          ],
        },
      },
    },

    // ── Section 2: Ionic Bonding ──────────────────────────────
    {
      title: 'Ionic Bonding',
      diagram: 'IonicBondDiagram',
      beginnerContent:
        'Ionic bonds form when a metal **gives** electrons to a non-metal. Think of it like a transaction: one atom donates, the other receives, and the resulting opposite charges lock them together.\n\n' +
        '**Walk through NaCl step by step:**\n\n' +
        '1. **Sodium (Na)** has the electron configuration 2, 8, 1 — one lonely valence electron.\n' +
        '2. **Chlorine (Cl)** has the configuration 2, 8, 7 — needs just one more to complete its octet.\n' +
        '3. Sodium donates its extra electron → becomes **Na⁺** (2, 8 — like neon).\n' +
        '4. Chlorine accepts it → becomes **Cl⁻** (2, 8, 8 — like argon).\n' +
        '5. Opposite charges attract → **ionic bond** formed.\n\n' +
        '**But NaCl is not a pair of atoms.** In a salt crystal, each Na⁺ is surrounded by 6 Cl⁻ ions, and each Cl⁻ is surrounded by 6 Na⁺ ions, forming a 3D **crystal lattice**. The formula NaCl just tells you the 1:1 ratio.\n\n' +
        '**Properties of ionic compounds — and why:**\n\n' +
        '| Property | Observation | Explanation |\n' +
        '|----------|------------|-------------|\n' +
        '| High melting point | NaCl melts at 801°C | Must overcome millions of strong electrostatic attractions |\n' +
        '| Hard but brittle | Shatters when struck | Shifting the lattice aligns like charges → repulsion → crack |\n' +
        '| Doesn\'t conduct as solid | No current flows | Ions locked in place — can\'t move |\n' +
        '| **Conducts when dissolved/melted** | Current flows freely | Ions are free to move |\n' +
        '| Dissolves in water | Salt disappears in water | Water molecules (polar) pull ions apart |\n\n' +
        'The salt pans of Gujarat produce millions of tonnes this way — evaporate seawater, NaCl crystallises out of solution as the lattice self-assembles.\n\n' +
        '**Other ionic compounds around you:**\n\n' +
        '| Compound | Formula | Everyday name | Use |\n' +
        '|----------|---------|--------------|-----|\n' +
        '| Sodium chloride | NaCl | Table salt | Cooking, food preservation |\n' +
        '| Calcium carbonate | CaCO₃ | Limestone, chalk | Construction, antacids |\n' +
        '| Potassium nitrate | KNO₃ | Saltpetre | Fertiliser, fireworks |\n' +
        '| Sodium bicarbonate | NaHCO₃ | Baking soda | Cooking (leavening) |\n' +
        '| Calcium fluoride | CaF₂ | Fluorite | Toothpaste ingredient |',
      intermediateContent:
        '**Lattice energy — how strong is the ionic bond?**\n\n' +
        'Lattice energy is the energy released when gaseous ions assemble into a crystal lattice. Higher lattice energy = stronger bonds = higher melting point.\n\n' +
        '**Coulomb\'s law for ionic bonds:** E = k × (q⁺ × q⁻) / r\n\n' +
        'Two factors control lattice energy:\n\n' +
        '| Factor | Higher lattice energy when... | Why |\n' +
        '|--------|-------------------------------|-----|\n' +
        '| **Ion charge** | Charges are larger (Mg²⁺ vs Na⁺) | Stronger electrostatic attraction |\n' +
        '| **Ion size** | Ions are smaller (Li⁺ vs K⁺) | Charges are closer together |\n\n' +
        '| Compound | Ion charges | Lattice energy (kJ/mol) | Melting point (°C) |\n' +
        '|----------|-----------|------------------------|-----------------|\n' +
        '| NaCl | +1, −1 | 787 | 801 |\n' +
        '| KCl | +1, −1 | 715 | 770 |\n' +
        '| MgO | **+2, −2** | **3850** | **2852** |\n' +
        '| CaO | +2, −2 | 3414 | 2614 |\n\n' +
        'MgO has a lattice energy nearly 5× that of NaCl because both ions are doubly charged. This is why MgO is used as a refractory lining in furnaces — it resists melting even at extreme temperatures.\n\n' +
        '**Worked example — predicting formula:**\n\n' +
        'Calcium (Group 2) loses 2 electrons → Ca²⁺. Chlorine (Group 17) gains 1 electron → Cl⁻. To balance charges: one Ca²⁺ needs two Cl⁻ ions → **CaCl₂**.\n\n' +
        'Aluminium (Group 13) loses 3 electrons → Al³⁺. Oxygen (Group 16) gains 2 electrons → O²⁻. To balance: 2 Al³⁺ (total +6) needs 3 O²⁻ (total −6) → **Al₂O₃**.',
      advancedContent:
        '**The Born-Haber cycle — measuring what you can\'t observe directly:**\n\n' +
        'You cannot directly measure the lattice energy of NaCl, but Hess\'s law lets you calculate it from measurable steps:\n\n' +
        '| Step | Process | Energy (kJ/mol) |\n' +
        '|------|---------|----------------|\n' +
        '| 1. Sublimation | Na(s) → Na(g) | +107 |\n' +
        '| 2. Ionisation | Na(g) → Na⁺(g) + e⁻ | +496 |\n' +
        '| 3. Dissociation | ½Cl₂(g) → Cl(g) | +122 |\n' +
        '| 4. Electron affinity | Cl(g) + e⁻ → Cl⁻(g) | −349 |\n' +
        '| 5. Lattice formation | Na⁺(g) + Cl⁻(g) → NaCl(s) | **? (lattice energy)** |\n' +
        '| Overall | Na(s) + ½Cl₂(g) → NaCl(s) | −411 (measured) |\n\n' +
        'By Hess\'s law: −411 = 107 + 496 + 122 + (−349) + lattice energy\n\n' +
        'Lattice energy = −411 − 107 − 496 − 122 + 349 = **−787 kJ/mol**\n\n' +
        'The large negative value confirms NaCl is very stable once formed.\n\n' +
        '**Polarisation and Fajan\'s rules:** Not all ionic bonds are purely ionic. A small, highly charged cation (like Al³⁺) can distort the electron cloud of a large anion (like I⁻), introducing **covalent character** into an ionic bond. Fajan\'s rules predict this: more polarisation (= more covalent character) when the cation is small and highly charged, and the anion is large and highly charged. This is why AlCl₃ behaves more like a covalent compound than an ionic one, despite containing a metal.',
    },

    // ── Section 3: Covalent Bonding ───────────────────────────
    {
      title: 'Covalent Bonding',
      diagram: 'CovalentBondDiagram',
      beginnerContent:
        'When two non-metal atoms meet, neither wants to give up electrons — both want to gain them. The solution? **Share.** A covalent bond forms when two atoms share one or more pairs of electrons, so each atom can count the shared electrons toward filling its outer shell.\n\n' +
        '**Think of it like two students sharing a textbook** — both can read it, and both benefit, but neither owns it alone.\n\n' +
        '**Single, double, and triple bonds:**\n\n' +
        '| Bond type | Shared pairs | Example | Bond energy (kJ/mol) | Bond length (pm) |\n' +
        '|-----------|-------------|---------|---------------------|------------------|\n' +
        '| Single | 1 pair (2 e⁻) | H–H, C–C | 346 (C–C) | 154 |\n' +
        '| Double | 2 pairs (4 e⁻) | O=O, C=O | 614 (C=C) | 134 |\n' +
        '| Triple | 3 pairs (6 e⁻) | N≡N, C≡C | 839 (C≡C) | 120 |\n\n' +
        'More sharing = stronger bond = shorter distance. The triple bond in N₂ (945 kJ/mol) is one of the strongest bonds in nature, which is why nitrogen gas makes up 78% of the atmosphere without reacting with the oxygen beside it.\n\n' +
        '**Properties of covalent compounds — and why:**\n\n' +
        '| Property | Observation | Explanation |\n' +
        '|----------|------------|-------------|\n' +
        '| Low melting/boiling point | Water boils at 100°C | Forces *between* molecules are weak (not the bonds *within*) |\n' +
        '| Poor conductors | Sugar doesn\'t conduct | No free ions or mobile electrons |\n' +
        '| Often liquid or gas | O₂, CO₂, H₂O | Weak intermolecular forces |\n' +
        '| Soluble in organic solvents | Oil dissolves in petrol | "Like dissolves like" — nonpolar dissolves nonpolar |\n\n' +
        'The golden lustre of Muga silk is pure covalent bond chemistry: **fibroin**, a protein made of thousands of amino acids strung together by peptide bonds. Change the amino acid sequence slightly — as in Eri silk — and you get a softer, more cotton-like fibre from the same bond type. Different arrangements, different properties.',
      intermediateContent:
        '**Lewis structures — a recipe for drawing bonds:**\n\n' +
        '| Step | Action | Example: CO₂ |\n' +
        '|------|--------|-------------|\n' +
        '| 1 | Count total valence electrons | C(4) + 2×O(6) = **16** |\n' +
        '| 2 | Place central atom, connect outer atoms with single bonds | O–C–O (uses 4 e⁻) |\n' +
        '| 3 | Complete octets on outer atoms first | O has 6 more, but only 12 e⁻ left |\n' +
        '| 4 | If central atom lacks an octet, convert lone pairs to bonds | O=C=O → carbon now has 8 |\n\n' +
        '**Worked example — drawing HCN:**\n\n' +
        '1. Total valence electrons: H(1) + C(4) + N(5) = **10**\n' +
        '2. H–C–N uses 4 e⁻, leaving 6\n' +
        '3. Put remaining on N: N gets 6 e⁻ (3 lone pairs) → N has octet, but C only has 4\n' +
        '4. Move 2 lone pairs from N to form bonds: H–C≡N\n' +
        '5. Check: H has 2, C has 8 (2+6), N has 8 (6+2 lone pair) ✓\n\n' +
        '**Bond energy and chemical reactions:**\n\n' +
        'Breaking bonds costs energy. Forming bonds releases energy. The balance determines whether a reaction is exothermic or endothermic:\n\n' +
        '| Reaction | Bonds broken | Energy in (kJ) | Bonds formed | Energy out (kJ) | Net |\n' +
        '|----------|-------------|---------------|-------------|----------------|-----|\n' +
        '| H₂ + Cl₂ → 2HCl | H–H (436) + Cl–Cl (242) | +678 | 2×H–Cl (431 each) | −862 | **−184 (exothermic)** |\n' +
        '| N₂ + O₂ → 2NO | N≡N (945) + O=O (498) | +1443 | 2×N=O (631 each) | −1262 | **+181 (endothermic)** |\n\n' +
        'The enormous energy needed to break N≡N explains why nitrogen is so unreactive — and why lightning (which provides that energy) is one of the few natural ways to "fix" nitrogen from the atmosphere into compounds that plants can use.',
      advancedContent:
        '**Hybridisation — mixing orbitals to match real geometry:**\n\n' +
        'Carbon has the configuration 1s² 2s² 2p², suggesting only 2 unpaired electrons and 2 bonds. But methane (CH₄) has 4 equivalent bonds. The resolution: **orbital hybridisation**.\n\n' +
        '| Hybridisation | Orbitals mixed | Geometry | Bond angle | Example |\n' +
        '|--------------|----------------|----------|-----------|----------|\n' +
        '| sp | 1s + 1p | Linear | 180° | CO₂, C₂H₂ |\n' +
        '| sp² | 1s + 2p | Trigonal planar | 120° | BF₃, C₂H₄, graphite |\n' +
        '| sp³ | 1s + 3p | Tetrahedral | 109.5° | CH₄, diamond, H₂O |\n' +
        '| sp³d | 1s + 3p + 1d | Trigonal bipyramidal | 90°/120° | PCl₅ |\n' +
        '| sp³d² | 1s + 3p + 2d | Octahedral | 90° | SF₆ |\n\n' +
        '**Sigma (σ) vs pi (π) bonds:**\n\n' +
        '| Property | σ bond | π bond |\n' +
        '|----------|--------|--------|\n' +
        '| Overlap | Head-on (along bond axis) | Side-on (above and below) |\n' +
        '| Strength | Stronger | Weaker |\n' +
        '| Rotation | Free rotation around bond | **No rotation** (locks geometry) |\n' +
        '| In a single bond | 1 σ | 0 π |\n' +
        '| In a double bond | 1 σ | 1 π |\n' +
        '| In a triple bond | 1 σ | 2 π |\n\n' +
        'The restricted rotation of π bonds is why *cis* and *trans* isomers exist. In fats, a *cis* double bond creates a kink in the chain (unsaturated → liquid oil), while a *trans* bond keeps the chain straight (→ solid at room temperature). This is exactly why trans fats, created by partial hydrogenation of mustard oil or other vegetable oils, behave differently from the natural *cis* unsaturated fats — a molecular-geometry consequence with health implications.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A triple bond is weaker than a single bond because the electrons repel each other.', answer: false, explanation: 'A triple bond is STRONGER (and shorter) than a single bond. Three shared pairs create a very strong attraction between the nuclei. N≡N = 945 kJ/mol vs C–C = 346 kJ/mol.' },
            { text: 'CO₂ has polar bonds but is a nonpolar molecule overall.', answer: true, explanation: 'Each C=O bond is polar (ΔEN = 1.0), but CO₂ is linear so the two dipoles point in opposite directions and cancel exactly. The net dipole moment is zero.' },
            { text: 'Ionic compounds typically have higher melting points than covalent compounds.', answer: true, explanation: 'Ionic compounds are held together by strong electrostatic forces throughout a 3D lattice (NaCl melts at 801°C). Most covalent compounds are held together by weak intermolecular forces between molecules (ice melts at 0°C).' },
            { text: 'Diamond is soft because it only has covalent bonds.', answer: false, explanation: 'Diamond is the hardest natural material! Each carbon is sp³ bonded to 4 others in a continuous 3D network. Covalent bonds CAN be very strong — diamond is a network covalent solid, not a molecular compound.' },
          ],
        },
      },
    },

    // ── Section 4: Metallic Bonding ───────────────────────────
    {
      title: 'Metallic Bonding',
      diagram: 'MetallicBondDiagram',
      beginnerContent:
        'In a metal, atoms don\'t transfer or share electrons with specific neighbours. Instead, they release their valence electrons into a shared **"sea"** that flows freely throughout the entire structure. The metal atoms become positive ions sitting in a regular lattice, surrounded and held together by this electron sea.\n\n' +
        '**Analogy:** Imagine a football stadium full of fans (positive metal ions) with thousands of beach balls (electrons) bouncing freely over their heads. The beach balls don\'t belong to any one fan — they belong to everyone. This shared pool of electrons is what holds everything together.\n\n' +
        '**Properties of metals — explained by the electron sea:**\n\n' +
        '| Property | What you observe | Electron sea explanation |\n' +
        '|----------|-----------------|-------------------------|\n' +
        '| Electrical conductivity | Copper wire carries current | Free electrons flow when voltage is applied |\n' +
        '| Thermal conductivity | Metal spoon gets hot in tea | Free electrons transfer kinetic energy rapidly |\n' +
        '| Malleability | Gold can be hammered into thin sheets | Ions slide to new positions without breaking the sea |\n' +
        '| Ductility | Copper is drawn into wire | Same — ions slide, electrons readjust |\n' +
        '| Lustrous (shiny) | Polished metals reflect light | Free electrons absorb and re-emit light at all visible wavelengths |\n' +
        '| High melting point (mostly) | Iron melts at 1538°C | Strong attraction between positive ions and electron sea |\n\n' +
        '**Why is this different from ionic bonding?** In an ionic crystal, if you force the lattice to shift, like-charged ions end up next to each other and repel — the crystal shatters. In a metal, the electron sea simply readjusts around the shifted ions. No repulsion, no shattering. That is why metals bend and ionic crystals break.\n\n' +
        'Bell metal — the *kah* used for *xorai* and *bota* plates — is an alloy of ~78% copper and 22% tin. The artisans of Sarthebari have practised this for centuries: melt the alloy, pour, let it cool, then hammer sheet by sheet into bowls and lamps. Every hammer strike is a demonstration of metallic bonding — the electron sea reshuffling without cracking. And the distinctive ring of a *ghonta* bell? Delocalised electrons transmitting vibrations efficiently through the lattice.',
      intermediateContent:
        '**What controls metallic bond strength?**\n\n' +
        'Two factors determine how strong a metallic bond is:\n\n' +
        '| Factor | Stronger bond when... | Why |\n' +
        '|--------|----------------------|-----|\n' +
        '| Number of delocalised electrons | More electrons per atom | More "glue" holding ions together |\n' +
        '| Ion size | Smaller ions (higher charge density) | Ions are closer to electron sea |\n\n' +
        '| Metal | Valence e⁻ per atom | Ion radius (pm) | Melting point (°C) |\n' +
        '|-------|---------------------|-----------------|-------------------|\n' +
        '| Na | 1 | 102 | 98 |\n' +
        '| Mg | 2 | 72 | 650 |\n' +
        '| Al | 3 | 54 | 660 |\n' +
        '| Fe | 2–3 | 64 | 1538 |\n' +
        '| W (Tungsten) | 4–6 | 62 | **3422** |\n\n' +
        'Sodium melts at just 98°C — you could melt it in boiling water — because it contributes only 1 electron and has a large ion. Tungsten, with up to 6 delocalised electrons and a small ion, has the highest melting point of any metal.\n\n' +
        '**Alloys — mixing metals for better properties:**\n\n' +
        '| Alloy | Composition | Property gained | Use |\n' +
        '|-------|------------|----------------|-----|\n' +
        '| Bronze (bell metal) | Cu + Sn | Hardness, resonance | Sarthebari *xorai*, bells |\n' +
        '| Steel | Fe + C (0.2–2%) | Hardness, strength | Bridges, tools |\n' +
        '| Stainless steel | Fe + Cr + Ni | Corrosion resistance | Kitchen utensils, surgical tools |\n' +
        '| Brass | Cu + Zn | Machinability, gold colour | Musical instruments, fittings |\n' +
        '| Duralumin | Al + Cu + Mg | Lightweight strength | Aircraft bodies |\n\n' +
        'In alloys, atoms of different sizes disrupt the regular lattice, making it harder for layers to slide → the alloy is harder than either pure metal. This is why pure gold (24 karat) is too soft for jewellery — Assamese goldsmiths mix it with copper or silver (22 karat) to make it durable enough for the intricate *jonbiri* and *gamkharu* designs.',
      advancedContent:
        '**Band theory — the quantum view of metallic bonding:**\n\n' +
        'When N atoms come together, their N atomic orbitals combine into N molecular orbitals spaced so closely in energy that they form continuous **bands**:\n\n' +
        '| Band | Origin | Role |\n' +
        '|------|--------|------|\n' +
        '| **Valence band** | Filled bonding MOs | Holds electrons at rest |\n' +
        '| **Conduction band** | Empty or partially filled MOs | Electrons here are mobile |\n' +
        '| **Band gap** | Energy gap between bands | Determines conductivity |\n\n' +
        '| Material type | Band gap | Example | Conductivity |\n' +
        '|--------------|----------|---------|-------------|\n' +
        '| **Metal** | None (bands overlap) | Cu, Fe, Al | Excellent conductor |\n' +
        '| **Semiconductor** | Small (0.1–3 eV) | Si (1.1 eV), Ge (0.7 eV) | Moderate — increases with temperature |\n' +
        '| **Insulator** | Large (> 3 eV) | Diamond (5.5 eV), glass | Very poor conductor |\n\n' +
        'In metals, the valence and conduction bands overlap, so electrons move freely with zero energy input — hence metals conduct at all temperatures. In semiconductors, electrons need a small push (heat, light, or voltage) to jump the gap. This is the physics behind every transistor, solar cell, and LED.\n\n' +
        '**Superconductivity** occurs when certain metals are cooled below a critical temperature (Tc). Cooper pairs — pairs of electrons with opposite spin — form and move through the lattice without scattering, giving **zero electrical resistance**. Mercury (Tc = 4.2 K) was the first superconductor discovered (1911). High-temperature superconductors like YBCO (Tc = 93 K) work above liquid nitrogen temperature (77 K), making applications like MRI machines and maglev trains feasible.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each metal property to its electron-sea explanation',
          pairs: [
            ['Electrical conductivity', 'Free delocalised electrons flow when voltage is applied, carrying charge'],
            ['Malleability', 'Ions slide to new positions and the electron sea readjusts — no bonds break'],
            ['High thermal conductivity', 'Free electrons transfer kinetic energy rapidly from hot to cold regions'],
            ['Metallic lustre (shininess)', 'Free electrons absorb and re-emit photons across all visible wavelengths'],
          ],
        },
      },
    },

    // ── Section 5: Molecular Shapes ───────────────────────────
    {
      title: 'Molecular Shapes',
      diagram: 'MolecularShapeDiagram',
      beginnerContent:
        'Molecules are not flat drawings on paper — they have real three-dimensional shapes. And those shapes determine how molecules behave, react, and interact with each other.\n\n' +
        '**The key idea: VSEPR theory** (Valence Shell Electron Pair Repulsion). Electron pairs around a central atom repel each other and spread out as far apart as possible — just like balloons tied together push apart.\n\n' +
        '| Electron pairs | Arrangement | Bond angle | Shape name |\n' +
        '|---------------|-------------|-----------|------------|\n' +
        '| 2 | Spread to opposite sides | 180° | **Linear** |\n' +
        '| 3 | Spread into a triangle | 120° | **Trigonal planar** |\n' +
        '| 4 | Spread into a 3D pyramid shape | 109.5° | **Tetrahedral** |\n\n' +
        '**But lone pairs change things.** Lone pairs (non-bonding electrons) take up more space than bonding pairs because they\'re held closer to the central atom. They squeeze the bonds closer together:\n\n' +
        '| Molecule | Total pairs | Bonding | Lone | Electron geometry | Molecular shape | Bond angle |\n' +
        '|----------|------------|---------|------|------------------|----------------|------------|\n' +
        '| CH₄ | 4 | 4 | 0 | Tetrahedral | **Tetrahedral** | 109.5° |\n' +
        '| NH₃ | 4 | 3 | 1 | Tetrahedral | **Trigonal pyramidal** | 107° |\n' +
        '| H₂O | 4 | 2 | 2 | Tetrahedral | **Bent** | 104.5° |\n' +
        '| CO₂ | 2 | 2 | 0 | Linear | **Linear** | 180° |\n' +
        '| BF₃ | 3 | 3 | 0 | Trigonal planar | **Trigonal planar** | 120° |\n\n' +
        '**Why shapes matter — the case of water:**\n\n' +
        'Water\'s bent shape makes it a **polar molecule** — the oxygen end is slightly negative and the hydrogen end is slightly positive. This polarity is why water is such an amazing solvent, why ice floats (the crystal structure of ice has gaps), and why the vast wetland ecosystems of the Brahmaputra floodplain can sustain such extraordinary biodiversity. If water were linear (like CO₂), it would be nonpolar, would not dissolve salts, and life as we know it would be impossible.\n\n' +
        '**Quick check:** BF₃ has 3 bonding pairs and 0 lone pairs — trigonal planar, 120°. NF₃ has 3 bonding pairs and 1 lone pair — trigonal pyramidal, ~102°. Same number of bonds, completely different shapes. The lone pair makes all the difference.',
      intermediateContent:
        '**Expanded octets — when atoms break the octet rule:**\n\n' +
        'Elements in Period 3 and below have empty d orbitals that can hold extra electrons:\n\n' +
        '| Electron pairs | Geometry | Shape (all bonding) | Example |\n' +
        '|---------------|----------|--------------------|---------|\n' +
        '| 5 | Trigonal bipyramidal | Trigonal bipyramidal | PCl₅ |\n' +
        '| 5 (4 bond + 1 lone) | Trigonal bipyramidal | **Seesaw** | SF₄ |\n' +
        '| 5 (3 bond + 2 lone) | Trigonal bipyramidal | **T-shaped** | ClF₃ |\n' +
        '| 6 | Octahedral | Octahedral | SF₆ |\n' +
        '| 6 (5 bond + 1 lone) | Octahedral | **Square pyramidal** | BrF₅ |\n' +
        '| 6 (4 bond + 2 lone) | Octahedral | **Square planar** | XeF₄ |\n\n' +
        '**Polarity and molecular shape — worked example:**\n\n' +
        'Is CCl₄ polar or nonpolar?\n\n' +
        '1. Each C–Cl bond is polar (ΔEN = 0.5)\n' +
        '2. CCl₄ is tetrahedral — 4 identical polar bonds pointing symmetrically\n' +
        '3. The dipoles cancel perfectly → **nonpolar** (μ = 0)\n\n' +
        'Is CHCl₃ (chloroform) polar or nonpolar?\n\n' +
        '1. C–H and C–Cl have different polarities\n' +
        '2. Tetrahedral shape, but **not symmetric** — the dipoles do NOT cancel\n' +
        '3. **Polar** (μ = 1.04 D)\n\n' +
        '**Rule:** A molecule with identical groups around the central atom in a symmetric geometry (linear, trigonal planar, tetrahedral, octahedral) is nonpolar even if individual bonds are polar. Any asymmetry → polar.\n\n' +
        '| Molecule | Shape | Symmetric? | Polar? |\n' +
        '|----------|-------|-----------|--------|\n' +
        '| CO₂ | Linear | Yes | No |\n' +
        '| H₂O | Bent | No (lone pairs) | **Yes** |\n' +
        '| BF₃ | Trigonal planar | Yes | No |\n' +
        '| NF₃ | Trigonal pyramidal | No (lone pair) | **Yes** |\n' +
        '| CCl₄ | Tetrahedral | Yes | No |\n' +
        '| CHCl₃ | Tetrahedral | No (different groups) | **Yes** |',
      advancedContent:
        '**Intermolecular forces — shape determines how molecules stick together:**\n\n' +
        'Molecular shape controls not just polarity but also how molecules interact with each other. These intermolecular forces (IMFs) are much weaker than covalent bonds but determine melting/boiling points, solubility, and viscosity:\n\n' +
        '| Force | Strength | Requires | Example |\n' +
        '|-------|----------|---------|----------|\n' +
        '| **London dispersion** | Weakest (0.05–40 kJ/mol) | All molecules (temporary dipoles) | Br₂ (liquid at RT), noble gases |\n' +
        '| **Dipole-dipole** | Medium (5–25 kJ/mol) | Polar molecules | HCl, CHCl₃ |\n' +
        '| **Hydrogen bonding** | Strongest IMF (10–40 kJ/mol) | H bonded to F, O, or N | H₂O, NH₃, DNA base pairs |\n\n' +
        '**Why does water have an abnormally high boiling point?**\n\n' +
        '| Molecule | Molar mass | Boiling point | IMF |\n' +
        '|----------|-----------|--------------|-----|\n' +
        '| H₂S | 34 g/mol | −60°C | Dipole-dipole only |\n' +
        '| H₂O | 18 g/mol | **+100°C** | **Hydrogen bonding** |\n\n' +
        'Water is lighter than H₂S but boils 160°C higher. The bent shape of water exposes the O–H bonds for hydrogen bonding. Each water molecule can form up to **4 hydrogen bonds** (2 from its H atoms donating, 2 from its O atom\'s lone pairs accepting) → a strong 3D network.\n\n' +
        'This network is why water has high surface tension (insects walk on it), high specific heat (the Brahmaputra moderates Assam\'s climate), and why ice floats (the hydrogen-bond network in ice creates an open hexagonal structure less dense than liquid water). If ice sank, rivers would freeze solid from the bottom up, killing all aquatic life.\n\n' +
        '**Protein folding** depends on all three types of IMF. The sequence of amino acids (primary structure, covalent) folds into α-helices and β-sheets (secondary, hydrogen bonds), then into a precise 3D shape (tertiary, hydrophobic interactions + disulfide bridges). In Muga silk fibroin, extensive β-sheet regions linked by hydrogen bonds create the protein\'s crystalline strength, while amorphous regions provide elasticity — a molecular architecture that materials scientists study using X-ray crystallography and molecular dynamics simulations.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A molecule with 4 bonding pairs and 0 lone pairs on the central atom has a tetrahedral shape.', answer: true, explanation: 'Four electron pairs spread to 109.5° apart, forming a tetrahedron. Example: CH₄ (methane).' },
            { text: 'Water (H₂O) is linear because it only has 2 bonds.', answer: false, explanation: 'Water has 2 bonding pairs AND 2 lone pairs on oxygen — the 4 total pairs give a tetrahedral electron geometry, but the molecular shape (atoms only) is BENT at 104.5°.' },
            { text: 'CCl₄ is nonpolar even though each C-Cl bond is polar.', answer: true, explanation: 'CCl₄ is perfectly tetrahedral with 4 identical polar bonds. The dipoles cancel due to symmetry, giving a net dipole moment of zero.' },
            { text: 'Hydrogen bonds are a type of covalent bond.', answer: false, explanation: 'Hydrogen bonds are intermolecular forces — attractions BETWEEN molecules. They are much weaker than covalent bonds (10-40 kJ/mol vs 150-945 kJ/mol) but crucial for water\'s properties and protein structure.' },
          ],
        },
      },
    },
  ],
};
