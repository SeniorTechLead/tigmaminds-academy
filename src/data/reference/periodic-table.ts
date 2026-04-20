import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'periodic-table',
  title: 'The Periodic Table',
  category: 'chemistry',
  icon: '⚗️',
  tagline:
    'The map of all matter — 118 elements organized by their deepest properties.',
  relatedStories: ['why-the-muga-silk-is-golden', 'little-potter'],
  understand: [
    // ── Section 1: How the Table Is Organized ──────────────────
    {
      title: 'How the Table Is Organized',
      diagram: 'PeriodicTableOverviewDiagram',
      beginnerContent:
        'Imagine a library where every book is shelved by its author\'s birthday *and* its genre — so you can find any book by date or by type. The periodic table does the same thing for elements: it arranges all 118 known elements in order of atomic number (like birthday) and groups those with similar chemical behaviour into columns (like genre).\n\n' +
        '**The grid at a glance:**\n\n' +
        '| Feature | What it is | How many | Key idea |\n' +
        '|---------|-----------|---------|----------|\n' +
        '| **Periods** (rows) | Horizontal rows, numbered 1–7 | 7 | Each period fills the *next* electron shell |\n' +
        '| **Groups** (columns) | Vertical columns, numbered 1–18 | 18 | Same group = same number of **valence electrons** = similar chemistry |\n' +
        '| **s-block** | Groups 1–2 (left side) | 2 columns | Filling s orbitals |\n' +
        '| **p-block** | Groups 13–18 (right side) | 6 columns | Filling p orbitals |\n' +
        '| **d-block** | Groups 3–12 (centre) | 10 columns | Transition metals — filling d orbitals |\n' +
        '| **f-block** | Lanthanides + actinides (below) | 14 columns | Filling f orbitals |\n\n' +
        '**How many electrons can each shell hold?**\n\n' +
        '| Shell (n) | Max electrons (2n²) | Period | Elements in that period |\n' +
        '|-----------|---------------------|--------|------------------------|\n' +
        '| 1 | 2 | Period 1 | H, He (2 elements) |\n' +
        '| 2 | 8 | Period 2 | Li → Ne (8 elements) |\n' +
        '| 3 | 8* | Period 3 | Na → Ar (8 elements) |\n' +
        '| 4 | 18 | Period 4 | K → Kr (18 elements, d-block starts) |\n\n' +
        '*Period 3 fills only 8 because the 3d subshell fills *after* 4s, not immediately after 3p.\n\n' +
        '**Why does this matter?** Because the column an element sits in tells you how it behaves. All group 1 elements are soft, explosive metals. All group 18 elements are inert gases. You don\'t need to memorise 118 separate personalities — just understand the table\'s logic.\n\n' +
        '**The Mendeleev story:** In 1869, the Russian chemist Dmitri Mendeleev arranged the 63 known elements by atomic mass and noticed a repeating pattern of properties. His genius was leaving *gaps* for elements not yet discovered. He predicted three missing elements — eka-boron, eka-aluminium, and eka-silicon — describing their density, melting point, and oxide formulas. When gallium was discovered in 1875 and matched his eka-aluminium predictions almost exactly, the scientific world was convinced. Mendeleev didn\'t just organise what was known — he predicted what was *unknown*.',
      intermediateContent:
        '**Why the filling order isn\'t simply 1s → 2s → 2p → 3s → 3p → 3d:**\n\n' +
        'The periodic table\'s shape follows the **Aufbau principle** — electrons fill orbitals from lowest to highest energy. But energy depends on *both* shell number (n) and subshell type (l). The actual filling order:\n\n' +
        '`1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p → 6s → 4f → 5d → 6p → 7s → 5f → 6d → 7p`\n\n' +
        'Notice: 4s fills *before* 3d, and 4f fills *after* 6s. This is why the d-block appears in period 4 (not period 3) and the f-block in period 6.\n\n' +
        '**Effective nuclear charge** explains periodic trends:\n\n' +
        '`Z_eff = Z − σ`\n\n' +
        '| Symbol | Meaning | Effect |\n' +
        '|--------|---------|--------|\n' +
        '| Z | Atomic number (proton count) | Pulls electrons *in* |\n' +
        '| σ | Shielding constant (from Slater\'s rules) | Inner electrons block the pull |\n' +
        '| Z_eff | Net charge felt by outer electron | Determines atom size and reactivity |\n\n' +
        '**Worked example — sodium vs magnesium:**\n\n' +
        '| Property | Na (Z = 11) | Mg (Z = 12) |\n' +
        '|----------|------------|-------------|\n' +
        '| Electron config | [Ne] 3s¹ | [Ne] 3s² |\n' +
        '| Core electrons | 10 | 10 |\n' +
        '| Approx. σ | ~10 × 0.85 = 8.5 | ~10 × 0.85 = 8.5 |\n' +
        '| Z_eff | 11 − 8.5 = **2.5** | 12 − 8.5 = **3.5** |\n\n' +
        'Magnesium\'s outer electron feels a stronger pull → smaller atom, higher ionisation energy. This is why trends *within a period* exist — same shell, but increasing nuclear charge.',
      advancedContent:
        '**Superheavy elements and relativistic effects:**\n\n' +
        'Elements 113–118 (nihonium through oganesson) were confirmed between 2002 and 2016, created by smashing accelerated ions into heavy-element targets. Oganesson (Z = 118) exists for less than a millisecond before alpha decay.\n\n' +
        '| Element | Z | Discovery | Half-life | Method |\n' +
        '|---------|---|-----------|-----------|--------|\n' +
        '| Nihonium (Nh) | 113 | RIKEN, 2003 | ~20 s | ⁷⁰Zn + ²⁰⁹Bi → ²⁷⁸Nh + n |\n' +
        '| Flerovium (Fl) | 114 | JINR, 1999 | ~2.7 s | ⁴⁸Ca + ²⁴²Pu → ²⁸⁹Fl + n |\n' +
        '| Oganesson (Og) | 118 | JINR, 2002 | ~0.7 ms | ⁴⁸Ca + ²⁴⁹Cf → ²⁹⁴Og + 3n |\n\n' +
        '**Relativistic quantum chemistry** becomes critical for heavy atoms. Inner electrons (especially 1s) travel at appreciable fractions of *c*, causing their mass to increase and orbitals to contract. Consequences:\n\n' +
        '| Effect | Explanation | Example |\n' +
        '|--------|------------|--------|\n' +
        '| s/p orbital contraction | Relativistic mass increase → tighter orbit | Gold\'s colour: 5d→6s transition shifts into visible range |\n' +
        '| d/f orbital expansion | Better shielding by contracted s/p → d/f expand | Lanthanide contraction is ~15% relativistic |\n' +
        '| Mercury is liquid | 6s² electrons tightly held → weak metallic bonding | Only metal liquid at room temperature |\n' +
        '| Lead is inert | 6s² "inert pair" too stable to bond easily | Pb²⁺ more stable than Pb⁴⁺ |\n\n' +
        'Theoretical predictions suggest element 120 (unbinilium) might begin a **g-block** if synthesised. The "island of stability" around Z ≈ 114–126 and N ≈ 184 may yield superheavy nuclei with half-lives of minutes or longer — long enough for chemical study.',
    },

    // ── Section 2: Reading an Element Box ──────────────────────
    {
      title: 'Reading an Element Box',
      diagram: 'ElementBoxDiagram',
      beginnerContent:
        'Each element on the periodic table lives inside a box packed with information. Learning to read that box is like learning to read a nutrition label — once you know the layout, you can decode any element in seconds.\n\n' +
        '**What\'s in the box:**\n\n' +
        '| Position | Information | Example (Iron, Fe) |\n' +
        '|----------|-----------|-------------------|\n' +
        '| Top | Atomic number (Z) — number of protons | **26** |\n' +
        '| Centre (large) | Chemical symbol — 1 or 2 letters, first capitalised | **Fe** (from Latin *ferrum*) |\n' +
        '| Below symbol | Full element name | **Iron** |\n' +
        '| Bottom | Atomic mass (amu) — weighted average of isotopes | **55.845** |\n\n' +
        '**Why are some symbols "weird"?** Many come from Latin or Greek names:\n\n' +
        '| Symbol | Element | Origin |\n' +
        '|--------|---------|--------|\n' +
        '| Fe | Iron | Latin *ferrum* |\n' +
        '| Au | Gold | Latin *aurum* |\n' +
        '| Ag | Silver | Latin *argentum* |\n' +
        '| Cu | Copper | Latin *cuprum* (from Cyprus) |\n' +
        '| Na | Sodium | Latin *natrium* |\n' +
        '| K | Potassium | Latin *kalium* |\n' +
        '| Sn | Tin | Latin *stannum* |\n' +
        '| Pb | Lead | Latin *plumbum* (hence "plumber") |\n\n' +
        '**Worked example — decoding iron (Fe):**\n\n' +
        'Iron sits at atomic number 26, meaning every iron atom has exactly 26 protons. Its atomic mass is 55.845 amu — not a whole number because it\'s the weighted average of four stable isotopes:\n\n' +
        '| Isotope | Protons | Neutrons | Mass (amu) | Natural abundance |\n' +
        '|---------|---------|----------|-----------|-------------------|\n' +
        '| ⁵⁴Fe | 26 | 28 | 53.940 | 5.8% |\n' +
        '| ⁵⁶Fe | 26 | 30 | 55.935 | **91.7%** |\n' +
        '| ⁵⁷Fe | 26 | 31 | 56.935 | 2.2% |\n' +
        '| ⁵⁸Fe | 26 | 32 | 57.933 | 0.3% |\n\n' +
        'Iron is in **period 4** (outermost electrons in the 4th shell) and **group 8** (d-block transition metal). Its electron configuration is [Ar] 3d⁶ 4s².\n\n' +
        'Iron smelting has ancient roots in the Brahmaputra valley. The Dimasa and other communities forged iron for centuries — producing the *dao* (machete) essential for clearing dense forest to plant wet rice. The iron ore deposits of Meghalaya and Assam are what made that craft possible.',
      intermediateContent:
        '**Calculating atomic mass from isotope data:**\n\n' +
        'Atomic mass = Σ (isotope mass × fractional abundance)\n\n' +
        '**Worked example — iron:**\n\n' +
        '`= (53.940 × 0.058) + (55.935 × 0.917) + (56.935 × 0.022) + (57.933 × 0.003)`\n' +
        '`= 3.129 + 51.292 + 1.253 + 0.174`\n' +
        '`= **55.848 amu**`\n\n' +
        '(The accepted value is 55.845 — the small difference comes from rounding isotope masses and abundances.)\n\n' +
        '**Electron configurations — the shorthand:**\n\n' +
        '| Element | Z | Full configuration | Shorthand | Valence electrons |\n' +
        '|---------|---|-------------------|-----------|-------------------|\n' +
        '| Carbon | 6 | 1s² 2s² 2p² | [He] 2s² 2p² | 4 |\n' +
        '| Silicon | 14 | 1s² 2s² 2p⁶ 3s² 3p² | [Ne] 3s² 3p² | 4 |\n' +
        '| Iron | 26 | 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s² | [Ar] 3d⁶ 4s² | 2 (from 4s) |\n' +
        '| Gold | 79 | [Xe] 4f¹⁴ 5d¹⁰ 6s¹ | [Xe] 4f¹⁴ 5d¹⁰ 6s¹ | 1 |\n\n' +
        'Notice: gold\'s configuration is [Xe] 4f¹⁴ 5d¹⁰ 6s¹, *not* 5d⁹ 6s². A half-filled or fully-filled d subshell is extra stable, so one 6s electron "drops" into 5d. Similar exceptions occur for chromium (Cr) and copper (Cu).',
      advancedContent:
        '**Mass spectrometry — how we measure isotope abundances:**\n\n' +
        'A mass spectrometer ionises atoms, accelerates them through an electric field, then deflects them with a magnetic field. Heavier ions curve less. The detector records both the mass-to-charge ratio (m/z) and the relative intensity (abundance).\n\n' +
        '| Step | What happens | Equation |\n' +
        '|------|-------------|----------|\n' +
        '| Ionisation | Atom → ion + electron | M → M⁺ + e⁻ |\n' +
        '| Acceleration | Electric field gives KE | KE = qV = ½mv² |\n' +
        '| Deflection | Magnetic field curves path | r = mv / (qB) |\n' +
        '| Detection | Ion hits detector | Signal ∝ abundance |\n\n' +
        '**From the radius equation:** r = mv/(qB), so m/q = rB/v. Lighter ions curve more (smaller r). By scanning the magnetic field B, different masses reach the detector in sequence.\n\n' +
        '**Applications beyond chemistry:**\n\n' +
        '| Application | Isotope used | What it reveals |\n' +
        '|------------|-------------|----------------|\n' +
        '| Radiocarbon dating | ¹⁴C/¹²C ratio | Age of organic material (up to ~50,000 years) |\n' +
        '| Forensic geology | ⁸⁷Sr/⁸⁶Sr ratio | Geographic origin of bones, teeth, food |\n' +
        '| Climate science | ¹⁸O/¹⁶O in ice cores | Past ocean temperatures |\n' +
        '| Drug testing | Isotope-labelled tracers | Metabolic pathways in the body |',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each symbol to its element and origin',
          pairs: [
            ['Fe', 'Iron — from Latin *ferrum*; 26 protons, d-block transition metal'],
            ['Au', 'Gold — from Latin *aurum*; prized since antiquity, relativistic colour'],
            ['Na', 'Sodium — from Latin *natrium*; soft alkali metal, reacts violently with water'],
            ['Pb', 'Lead — from Latin *plumbum*; dense, toxic, gives us the word "plumber"'],
          ],
        },
      },
    },

    // ── Section 3: Metals, Nonmetals, and Metalloids ───────────
    {
      title: 'Metals, Nonmetals, and Metalloids',
      diagram: 'MetalNonmetalDiagram',
      beginnerContent:
        'The periodic table divides neatly into three families, separated by a zigzag "staircase" line running from boron (B) down to astatine (At).\n\n' +
        '**The three families:**\n\n' +
        '| Property | Metals (left of staircase) | Nonmetals (right of staircase) | Metalloids (on the staircase) |\n' +
        '|----------|--------------------------|-------------------------------|------------------------------|\n' +
        '| **Appearance** | Shiny (lustrous) | Dull (mostly) | Variable |\n' +
        '| **Conductivity** | Good (heat & electricity) | Poor (insulators) | **Semiconductors** |\n' +
        '| **Malleability** | Can be hammered into sheets | Brittle (if solid) | Brittle |\n' +
        '| **Ductility** | Can be drawn into wires | Cannot | Cannot |\n' +
        '| **Electron tendency** | Lose electrons → cations (+) | Gain electrons → anions (−) | Can go either way |\n' +
        '| **Bonding type** | Metallic or ionic | Covalent | Covalent or metallic |\n' +
        '| **Count** | ~91 elements | ~20 elements | ~7 elements |\n\n' +
        '**Think of it this way:** Metals are *givers* (they donate electrons). Nonmetals are *takers* (they grab electrons). Metalloids are *negotiators* — they can go either way depending on the situation.\n\n' +
        '**The metalloids — why they matter:**\n\n' +
        '| Metalloid | Key property | Why it\'s important |\n' +
        '|-----------|-------------|-------------------|\n' +
        '| **Silicon (Si)** | Semiconductor | Foundation of every computer chip, solar cell, transistor |\n' +
        '| **Germanium (Ge)** | Semiconductor | Early transistors, fibre-optic lenses |\n' +
        '| **Boron (B)** | Very hard | Borosilicate glass (Pyrex), rocket fuel additive |\n' +
        '| **Arsenic (As)** | Toxic | Groundwater contamination (a serious issue in parts of Assam and Bangladesh) |\n\n' +
        'Look around and you\'re surrounded by the periodic table in action:\n' +
        '- The *dao* (machete) used by Naga, Garo, and Khasi communities is forged from **carbon steel** — iron (metal) alloyed with carbon (nonmetal)\n' +
        '- River sand is mostly **silicon dioxide (SiO₂)** — a metalloid bonded to a nonmetal\n' +
        '- **Arsenic** (a metalloid) contaminating Brahmaputra floodplain groundwater is a public health crisis affecting millions\n' +
        '- The golden colour of **Muga silk** comes from organic compounds (carbon, hydrogen, oxygen, nitrogen — all nonmetals) arranged in protein chains',
      intermediateContent:
        '**Why metals conduct electricity — the electron sea model:**\n\n' +
        'In a metal, outer electrons are not attached to individual atoms. They form a "sea" of delocalised electrons that flows freely through the lattice of positive ion cores. Apply a voltage → electrons drift → current flows.\n\n' +
        '| Metal | Electrical conductivity (×10⁶ S/m) | Common use |\n' +
        '|-------|-------------------------------------|------------|\n' +
        '| Silver (Ag) | **63.0** | Too expensive for wiring |\n' +
        '| Copper (Cu) | **59.6** | Household wiring, circuit boards |\n' +
        '| Gold (Au) | **41.0** | Corrosion-resistant connectors |\n' +
        '| Aluminium (Al) | **37.7** | Power lines (light + cheap) |\n' +
        '| Iron (Fe) | **10.0** | Structural, not wiring |\n\n' +
        '**Semiconductors — the magic in between:**\n\n' +
        'Silicon has 4 valence electrons. In pure silicon, each atom shares electrons with 4 neighbours in a **covalent crystal lattice** — no free electrons, poor conductor. But add a tiny impurity:\n\n' +
        '| Doping type | Impurity atom | Valence electrons | What happens | Result |\n' +
        '|-------------|--------------|-------------------|-------------|--------|\n' +
        '| **n-type** | Phosphorus (5 valence e⁻) | 5 | 1 extra electron per P atom | Free electrons carry current |\n' +
        '| **p-type** | Boron (3 valence e⁻) | 3 | 1 missing electron ("hole") per B atom | Holes carry current |\n\n' +
        'A p-n junction (p-type touching n-type) creates a **diode** — current flows one way only. Stack them cleverly → transistors → integrated circuits → your phone.',
      advancedContent:
        '**Band theory — why metals, semiconductors, and insulators differ:**\n\n' +
        'When atoms join a crystal, their discrete energy levels broaden into continuous **bands**:\n\n' +
        '| Material | Band gap (eV) | Conductivity | Example |\n' +
        '|----------|--------------|-------------|--------|\n' +
        '| Metal | 0 (bands overlap) | Always conducts | Cu, Fe, Al |\n' +
        '| Semiconductor | 0.1–4 eV | Conducts when excited | Si (1.1 eV), Ge (0.67 eV) |\n' +
        '| Insulator | > 4 eV | Does not conduct | Diamond (5.5 eV), SiO₂ (9 eV) |\n\n' +
        'In metals, the valence band and conduction band overlap — electrons move freely with zero energy cost. In semiconductors, a small energy gap separates filled and empty bands. At room temperature, thermal energy (kT ≈ 0.026 eV) promotes some electrons across the gap. Heating a semiconductor *increases* its conductivity (opposite of metals, where increased lattice vibrations *scatter* electrons and reduce conductivity).\n\n' +
        '**Alloy design — mixing metals for purpose:**\n\n' +
        '| Alloy | Composition | Property gained | Use |\n' +
        '|-------|-----------|----------------|-----|\n' +
        '| Steel | Fe + 0.2–2% C | Hardness, strength | Construction, tools |\n' +
        '| Stainless steel | Fe + Cr + Ni | Corrosion resistance | Cookware, surgery |\n' +
        '| Bronze | Cu + Sn | Hardness, low friction | Bells, bearings |\n' +
        '| Brass | Cu + Zn | Acoustics, machinability | Instruments, fittings |\n' +
        '| Duralumin | Al + Cu + Mg | Lightweight + strong | Aircraft frames |\n\n' +
        'Substitutional alloys (similar-sized atoms swap positions) follow the **Hume-Rothery rules**: atomic radii must differ by < 15%, similar electronegativities, same crystal structure. Interstitial alloys (small atoms like C fit in gaps between larger atoms) allow carbon steel — small carbon atoms occupy octahedral holes in the iron FCC lattice.',
    },

    // ── Section 4: Periodic Trends ─────────────────────────────
    {
      title: 'Periodic Trends',
      diagram: 'PeriodicTrendsDiagram',
      beginnerContent:
        'The periodic table isn\'t just a list — it\'s a *map*. And like any good map, it has predictable patterns. Three trends dominate:\n\n' +
        '**Trend 1: Atomic Radius (atom size)**\n\n' +
        '| Direction | What happens | Why |\n' +
        '|-----------|-------------|-----|\n' +
        '| → Across a period | Atoms get **smaller** | More protons pull electrons closer (despite adding electrons) |\n' +
        '| ↓ Down a group | Atoms get **larger** | New electron shell = more distance from nucleus |\n\n' +
        '| Element | Period | Group | Atomic radius (pm) |\n' +
        '|---------|--------|-------|--------------------|\n' +
        '| Li | 2 | 1 | 152 |\n' +
        '| Be | 2 | 2 | 112 |\n' +
        '| B | 2 | 13 | 87 |\n' +
        '| C | 2 | 14 | 77 |\n' +
        '| N | 2 | 15 | 75 |\n' +
        '| O | 2 | 16 | 73 |\n' +
        '| F | 2 | 17 | 72 |\n\n' +
        'See? Li to F — same period, atoms shrink steadily. The nucleus gains one proton each step, pulling the *same outer shell* tighter.\n\n' +
        '**Trend 2: Electronegativity (electron-grabbing power)**\n\n' +
        'Electronegativity measures how strongly an atom attracts shared electrons in a bond.\n\n' +
        '| Direction | What happens | Champion |\n' +
        '|-----------|-------------|----------|\n' +
        '| → Across a period | Increases | Fluorine (3.98) — top right |\n' +
        '| ↓ Down a group | Decreases | Caesium (0.79) — bottom left |\n\n' +
        '**Analogy:** Imagine a tug-of-war over a shared rope (electrons). A small, strong atom (fluorine) wins easily. A large, weak atom (caesium) barely tries.\n\n' +
        'When two atoms with *very different* electronegativities bond:\n' +
        '- Small difference (< 0.5) → **nonpolar covalent** bond (shared equally)\n' +
        '- Medium difference (0.5–1.7) → **polar covalent** bond (shared unevenly)\n' +
        '- Large difference (> 1.7) → **ionic** bond (electron transferred completely)\n\n' +
        '**Trend 3: Ionisation Energy (how hard it is to remove an electron)**\n\n' +
        '| Direction | What happens | Why |\n' +
        '|-----------|-------------|-----|\n' +
        '| → Across a period | Increases | Stronger nuclear charge holds electrons tighter |\n' +
        '| ↓ Down a group | Decreases | Outer electrons are farther away and shielded |\n\n' +
        '| Element | 1st Ionisation Energy (kJ/mol) | Easy or hard to ionise? |\n' +
        '|---------|-------------------------------|------------------------|\n' +
        '| Cs | 376 | Very easy — loses electron readily |\n' +
        '| Na | 496 | Easy |\n' +
        '| Fe | 762 | Moderate |\n' +
        '| O | 1,314 | Hard |\n' +
        '| F | 1,681 | Very hard |\n' +
        '| He | 2,372 | Hardest — full shell, maximum stability |\n\n' +
        '**The two competing forces:** Nuclear charge pulls electrons in. Shielding (inner electron shells) blocks the pull. Across a period, charge wins. Down a group, shielding and distance win. Every trend on the periodic table traces back to this tug-of-war.',
      intermediateContent:
        '**Successive ionisation energies — proof of electron shells:**\n\n' +
        'Remove electrons one by one from sodium (Na, Z = 11):\n\n' +
        '| Electron removed | IE (kJ/mol) | Shell removed from | What happens |\n' +
        '|-----------------|-------------|--------------------|--------------|\n' +
        '| 1st | 496 | 3s (valence) | Easy — one lonely electron |\n' +
        '| 2nd | 4,562 | 2p (core) | **9× jump!** Now removing from inner shell |\n' +
        '| 3rd | 6,912 | 2p | Harder still |\n' +
        '| ... | ... | ... | ... |\n' +
        '| 10th | 159,076 | 1s (innermost) | Enormous — stripping electron from near-naked nucleus |\n' +
        '| 11th | 208,447 | 1s | Last electron — maximum nuclear pull |\n\n' +
        'The **massive jump between IE₁ and IE₂** proves sodium has exactly 1 valence electron. For magnesium, the big jump comes between IE₂ and IE₃ — confirming 2 valence electrons.\n\n' +
        '**Electron affinity — the mirror trend:**\n\n' +
        'Electron affinity = energy released when an atom *gains* an electron.\n\n' +
        '| Element | Electron affinity (kJ/mol) | Why |\n' +
        '|---------|---------------------------|-----|\n' +
        '| Cl | −349 | Needs 1 electron to fill shell — very favourable |\n' +
        '| F | −328 | Slightly less than Cl (tiny atom, electron repulsion) |\n' +
        '| O | −141 | Needs 2 electrons — first is favourable, second costs energy |\n' +
        '| Ne | ~0 | Full shell — no desire for more electrons |\n' +
        '| Na | −53 | Would have to start a new subshell — unfavourable |\n\n' +
        '**Anomalies in the trends:**\n\n' +
        '| Anomaly | Example | Explanation |\n' +
        '|---------|---------|-------------|\n' +
        '| IE dip at group 13 | B (801) < Be (900) | B\'s electron is in a higher-energy 2p orbital |\n' +
        '| IE dip at group 16 | O (1314) < N (1402) | N has a half-filled 2p³ (extra stable); O must pair an electron |\n' +
        '| F < Cl electron affinity | F (−328) < Cl (−349) | F is so small that incoming electron repels existing ones |',
      advancedContent:
        '**Quantifying trends — Slater\'s rules for Z_eff:**\n\n' +
        'To estimate the shielding constant σ for an electron:\n\n' +
        '1. Write the electron configuration in groups: (1s)(2s,2p)(3s,3p)(3d)(4s,4p)...\n' +
        '2. Electrons in the *same* group shield by 0.35 (except 1s: 0.30)\n' +
        '3. For s/p electrons: electrons one shell below shield by 0.85; two or more shells below shield by 1.00\n' +
        '4. For d/f electrons: all electrons below shield by 1.00\n\n' +
        '**Worked example — oxygen\'s 2p electron (Z = 8):**\n\n' +
        '| Group | Electrons | Shielding per electron | Contribution |\n' +
        '|-------|-----------|----------------------|-------------|\n' +
        '| Same group (2s,2p) | 5 others | 0.35 | 5 × 0.35 = 1.75 |\n' +
        '| One shell below (1s) | 2 | 0.85 | 2 × 0.85 = 1.70 |\n' +
        '| **Total σ** | | | **3.45** |\n' +
        '| **Z_eff** | | | 8 − 3.45 = **4.55** |\n\n' +
        'Compare nitrogen (Z = 7): same calculation gives Z_eff ≈ 3.90. Oxygen\'s higher Z_eff explains its smaller radius.\n\n' +
        '**Relativistic corrections to trends:**\n\n' +
        'For heavy elements (Z > 70), Dirac\'s relativistic equation replaces Schrödinger\'s. The 1s electron velocity is approximately v ≈ Zc/137. For gold (Z = 79): v ≈ 0.58c — the electron\'s relativistic mass increases by ~20%, contracting the orbital. This propagates outward:\n\n' +
        '| Consequence | Non-relativistic prediction | Relativistic reality |\n' +
        '|------------|---------------------------|---------------------|\n' +
        '| Gold\'s colour | Silver-like (UV absorption) | Golden (blue light absorbed) |\n' +
        '| Mercury melting point | Higher | −39°C (liquid at room temp) |\n' +
        '| Lead\'s stability | Pb⁴⁺ should dominate | Pb²⁺ is more stable (inert pair) |\n' +
        '| Superheavy chemistry | Follow lighter homologues | Often deviate significantly |',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Atoms get larger as you move from left to right across a period.', answer: false, explanation: 'Atoms get SMALLER across a period. Each step adds a proton, increasing nuclear charge and pulling the same outer shell closer.' },
            { text: 'Fluorine has the highest electronegativity of all elements.', answer: true, explanation: 'Fluorine (3.98 on the Pauling scale) is the most electronegative element — small atom, high nuclear charge, needs just one electron to fill its shell.' },
            { text: 'It takes more energy to remove an electron from caesium than from helium.', answer: false, explanation: 'Caesium has one of the LOWEST ionisation energies (376 kJ/mol) because its valence electron is far from the nucleus. Helium has the HIGHEST (2,372 kJ/mol) — full shell, tight grip.' },
            { text: 'Noble gases have high electronegativities because their shells are full.', answer: false, explanation: 'Noble gases have very LOW (or undefined) electronegativity. Their full shells mean they have no need to attract additional electrons. Electronegativity measures the desire to GAIN electrons in a bond.' },
          ],
        },
      },
    },

    // ── Section 5: The Alkali Metals and Halogens ──────────────
    {
      title: 'The Alkali Metals and Halogens',
      beginnerContent:
        '**Group 1 — the alkali metals** (lithium, sodium, potassium, rubidium, caesium, francium) sit in the far-left column. Each has a single valence electron that it loses *extremely* easily. They are the most reactive metals on the table.\n\n' +
        '| Alkali metal | Z | Valence e⁻ | Density (g/cm³) | Reaction with water |\n' +
        '|-------------|---|-----------|----------------|--------------------|\n' +
        '| Lithium (Li) | 3 | 1 | 0.53 (floats!) | Gentle fizz, LiOH + H₂ |\n' +
        '| Sodium (Na) | 11 | 1 | 0.97 (floats!) | Vigorous — melts into ball, yellow flame |\n' +
        '| Potassium (K) | 19 | 1 | 0.86 (floats!) | Violent — lilac flame, may ignite H₂ |\n' +
        '| Rubidium (Rb) | 37 | 1 | 1.53 | Explosive |\n' +
        '| Caesium (Cs) | 55 | 1 | 1.87 | **Shatters the container** |\n\n' +
        '**Why does reactivity increase down the group?** Each step down adds a new electron shell. The valence electron gets *farther* from the nucleus and more shielded → easier to rip away → more violent reaction.\n\n' +
        '**Analogy:** Imagine holding a ball on a string. A short string (lithium) — you grip it tightly. A very long string (caesium) — the ball is so far away it practically falls off on its own.\n\n' +
        'All alkali metals are soft enough to cut with a knife, have low melting points, and are *never* found as free elements in nature — they react with oxygen and moisture within seconds.\n\n' +
        '---\n\n' +
        '**Group 17 — the halogens** (fluorine, chlorine, bromine, iodine, astatine) sit near the far-right column. Each needs just one more electron to fill its outer shell. They are the most reactive nonmetals.\n\n' +
        '| Halogen | Z | State at room temp | Colour | Key fact |\n' +
        '|---------|---|--------------------|--------|----------|\n' +
        '| Fluorine (F) | 9 | Gas | Pale yellow | Most reactive element *of all* |\n' +
        '| Chlorine (Cl) | 17 | Gas | Yellow-green | Disinfects drinking water |\n' +
        '| Bromine (Br) | 35 | **Liquid** | Red-brown | One of only 2 liquid elements |\n' +
        '| Iodine (I) | 53 | Solid | Purple-black | Essential for thyroid; sublimes to violet vapour |\n' +
        '| Astatine (At) | 85 | Solid (radioactive) | Unknown | Rarest naturally occurring element |\n\n' +
        '**Halogen reactivity decreases down the group** — the opposite of alkali metals! Fluorine grabs electrons ferociously because it\'s tiny and has a high nuclear charge. Iodine is larger, more shielded, and less desperate for that extra electron.\n\n' +
        'Iodine deficiency causes goitre (enlarged thyroid). It\'s historically common in hilly regions far from iodine-rich seafood — including NE India. India\'s mandatory iodised salt programme has dramatically reduced goitre rates: chemistry directly applied to public health. The chlorine that disinfects city water? Same halogen group.',
      intermediateContent:
        '**Alkali metals + halogens → ionic compounds:**\n\n' +
        'When a group 1 metal meets a group 17 nonmetal, the metal donates its one electron and the halogen accepts it. The result is an ionic compound:\n\n' +
        '`Na + Cl → Na⁺ + Cl⁻ → NaCl (table salt)`\n\n' +
        '| Alkali metal | Halogen | Product | Lattice energy (kJ/mol) | Melting point (°C) |\n' +
        '|-------------|---------|---------|------------------------|-------------------|\n' +
        '| Li | F | LiF | **1,037** | 845 |\n' +
        '| Na | Cl | NaCl | 786 | 801 |\n' +
        '| K | Br | KBr | 672 | 734 |\n' +
        '| Cs | I | CsI | **604** | 621 |\n\n' +
        'Notice: lattice energy *decreases* as ions get bigger (Li⁺F⁻ = small ions, strong attraction; Cs⁺I⁻ = big ions, weaker attraction). The **Born-Landé equation** predicts this:\n\n' +
        '`U = −(N_A · M · z⁺ · z⁻ · e²) / (4πε₀ · r₀) · (1 − 1/n)`\n\n' +
        'where r₀ is the sum of ionic radii and M is the Madelung constant (depends on crystal structure: 1.748 for NaCl, 1.763 for CsCl).\n\n' +
        '**Flame test colours — a practical identification tool:**\n\n' +
        '| Metal ion | Flame colour | Wavelength (nm) | Electron transition |\n' +
        '|-----------|-------------|----------------|--------------------|\n' +
        '| Li⁺ | Crimson red | 670 | 2p → 2s |\n' +
        '| Na⁺ | **Bright yellow** | 589 | 3p → 3s (sodium D-line) |\n' +
        '| K⁺ | Lilac/violet | 766 | 4p → 4s |\n' +
        '| Rb⁺ | Red-violet | 780 | 5p → 5s |\n' +
        '| Cs⁺ | Blue-violet | 456 | 6p → 6s |\n\n' +
        'The yellow glow of sodium street lamps (common across Indian cities) is the exact same 589 nm emission.',
      advancedContent:
        '**Halogen displacement reactions — the activity series:**\n\n' +
        'A more reactive halogen displaces a less reactive one from its salt:\n\n' +
        '| Reaction | Occurs? | Why |\n' +
        '|----------|---------|-----|\n' +
        '| Cl₂ + 2NaBr → 2NaCl + Br₂ | ✅ Yes | Cl is more reactive than Br |\n' +
        '| Cl₂ + 2NaI → 2NaCl + I₂ | ✅ Yes | Cl is more reactive than I |\n' +
        '| Br₂ + 2NaI → 2NaBr + I₂ | ✅ Yes | Br is more reactive than I |\n' +
        '| I₂ + 2NaCl → 2NaI + Cl₂ | ❌ No | I is *less* reactive than Cl |\n' +
        '| Br₂ + 2NaCl → 2NaBr + Cl₂ | ❌ No | Br is *less* reactive than Cl |\n\n' +
        'This is fundamentally about **reduction potentials**:\n\n' +
        '| Half-reaction | E° (V) |\n' +
        '|--------------|--------|\n' +
        '| F₂ + 2e⁻ → 2F⁻ | **+2.87** |\n' +
        '| Cl₂ + 2e⁻ → 2Cl⁻ | +1.36 |\n' +
        '| Br₂ + 2e⁻ → 2Br⁻ | +1.07 |\n' +
        '| I₂ + 2e⁻ → 2I⁻ | +0.54 |\n\n' +
        'A halogen with a *higher* E° can oxidise a halide with a *lower* E°. Fluorine\'s +2.87 V is the highest reduction potential of any element — it oxidises *everything*, including water, glass, and noble gases (XeF₂, XeF₄, KrF₂).\n\n' +
        '**Interhalogen compounds** form when halogens react with each other:\n\n' +
        '| Compound | Structure | Shape | Bond angle |\n' +
        '|----------|-----------|-------|------------|\n' +
        '| ClF | Linear | Linear | 180° |\n' +
        '| BrF₃ | T-shaped | T-shaped | ~86° |\n' +
        '| IF₅ | Square pyramidal | Square pyramidal | ~82° |\n' +
        '| IF₇ | Pentagonal bipyramidal | Pentagonal bipyramidal | 72°/90° |\n\n' +
        'The larger halogen is always central (it has d orbitals available for expanded octets). VSEPR theory correctly predicts each shape from the number of bonding pairs and lone pairs.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each element to its group behaviour',
          pairs: [
            [
              'Sodium (Na)',
              'Alkali metal — reacts vigorously with water, gives yellow flame',
            ],
            [
              'Fluorine (F)',
              'Halogen — most reactive element, needs one electron to fill shell',
            ],
            [
              'Neon (Ne)',
              'Noble gas — full outer shell, almost completely unreactive',
            ],
            [
              'Iron (Fe)',
              'Transition metal — forms colored compounds, multiple oxidation states',
            ],
          ],
        },
      },
    },
  ],
};
