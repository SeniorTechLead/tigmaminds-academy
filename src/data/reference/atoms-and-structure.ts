import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'atoms-and-structure',
  title: 'Atoms & Atomic Structure',
  category: 'chemistry',
  icon: '⚛️',
  tagline:
    'Everything you can touch is made of atoms — tiny, ancient, and indestructible.',
  relatedStories: ['star-fell-deepor', 'stars-ziro-valley'],
  understand: [
    // ── Section 1: What Is an Atom? ─────────────────────────────
    {
      title: 'What Is an Atom?',
      diagram: 'AtomStructureDiagram',
      beginnerContent:
        'An atom is the smallest unit of an element that keeps that element\'s identity. Break a gold ring into smaller and smaller pieces and you eventually reach a single gold atom — go further and it stops being gold.\n\n' +
        'Think of an atom like the **solar system in miniature**. A heavy, dense core (the *nucleus*) sits at the centre, and lightweight electrons whirl around it at tremendous speed, held in place by electrical attraction — just as planets orbit the Sun held by gravity.\n\n' +
        '**How tiny is an atom?** If you lined up 10 million atoms side by side, they would stretch across 1 millimetre — about the thickness of a Muga silk thread from Sualkuchi.\n\n' +
        '| Milestone | Year | Scientist | Model |\n' +
        '|-----------|------|-----------|-------|\n' +
        '| "Atomos" — indivisible idea | ~400 BCE | Democritus | Tiny solid spheres |\n' +
        '| Atomic theory revived | 1803 | John Dalton | Solid billiard balls |\n' +
        '| Electron discovered | 1897 | J. J. Thomson | Plum pudding — electrons embedded in positive sphere |\n' +
        '| Nucleus discovered | 1911 | Ernest Rutherford | Tiny positive core, electrons orbit far away |\n' +
        '| Fixed energy levels | 1913 | Niels Bohr | Electrons on specific circular tracks |\n' +
        '| Quantum model | 1926 | Schrödinger | Probability clouds (orbitals) |\n\n' +
        '**The gold foil experiment that changed everything:** Rutherford fired tiny alpha particles at a sheet of gold foil thinner than a human hair. Most particles sailed straight through — as if the foil were mostly empty space. But about 1 in 8,000 bounced straight back. Rutherford said it was "as if you fired a cannon shell at a piece of tissue paper and it came back and hit you." The conclusion: atoms are mostly empty space with a minuscule, incredibly dense nucleus at the centre.\n\n' +
        '| If an atom were... | The nucleus would be... | The electrons would be... |\n' +
        '|---------------------|----------------------|-------------------------|\n' +
        '| A football stadium (Indira Gandhi Stadium, Guwahati) | A marble at centre spot | Gnats buzzing in the stands |\n' +
        '| The entire Earth | A 200 m ball (small hill) | Dust particles in the atmosphere |\n' +
        '| A 10-storey building | A grain of sand on the 5th floor | Mosquitoes flying between floors |\n\n' +
        '**Quick check:** If most of an atom is empty space, why can\'t you walk through a wall?\n\n' +
        '*Because the electron clouds of your atoms and the wall\'s atoms repel each other with enormous electromagnetic force — like two magnets held north-to-north.*',
      intermediateContent:
        '**From orbits to orbitals — the quantum leap**\n\n' +
        'Bohr\'s model worked beautifully for hydrogen but failed for every other element. Quantum mechanics replaced fixed orbits with **orbitals** — 3D regions where an electron has a 90% probability of being found.\n\n' +
        '| Quantum number | Symbol | Values | What it describes |\n' +
        '|----------------|--------|--------|------------------|\n' +
        '| Principal | n | 1, 2, 3… | Shell / energy level (size) |\n' +
        '| Angular momentum | l | 0 to n−1 | Subshell shape (s, p, d, f) |\n' +
        '| Magnetic | mₗ | −l to +l | Orbital orientation in space |\n' +
        '| Spin | mₛ | +½ or −½ | Electron\'s intrinsic spin |\n\n' +
        '| Subshell | l value | Shape | Orbitals | Max electrons |\n' +
        '|----------|---------|-------|----------|---------------|\n' +
        '| s | 0 | Sphere | 1 | 2 |\n' +
        '| p | 1 | Dumbbell | 3 | 6 |\n' +
        '| d | 2 | Clover-leaf | 5 | 10 |\n' +
        '| f | 3 | Complex | 7 | 14 |\n\n' +
        '**Worked example — quantum numbers for the 6th electron of carbon:**\n\n' +
        'Carbon has 6 electrons. Filling order: 1s² 2s² 2p². The 6th electron is in the 2p subshell.\n\n' +
        '- n = 2 (second shell)\n' +
        '- l = 1 (p subshell)\n' +
        '- mₗ = +1 (by Hund\'s rule, the second p electron goes into a different orbital from the 5th)\n' +
        '- mₛ = +½ (first electron in this orbital, spin up)\n\n' +
        '**The Heisenberg uncertainty principle** sets a hard limit: Δx · Δp ≥ ħ/2. You can never know both where an electron is and how fast it\'s moving. This is why we speak of probability clouds, not paths.',
      advancedContent:
        '**Solving the atom: exact and approximate methods**\n\n' +
        'The hydrogen atom is the only atom with an exact analytical solution to the Schrödinger equation: Eₙ = −13.6 eV / n².\n\n' +
        '| Method | Approach | Accuracy | Use case |\n' +
        '|--------|----------|----------|----------|\n' +
        '| Hartree–Fock | Each electron sees the average field of all others | ~99% of total energy | Starting point for multi-electron atoms |\n' +
        '| Configuration Interaction (CI) | Mixes multiple electron configurations | Higher than HF | Small–medium molecules |\n' +
        '| Coupled Cluster CCSD(T) | Systematic treatment of electron correlation | ±1 kcal/mol ("chemical accuracy") | Benchmark calculations |\n' +
        '| Density Functional Theory (DFT) | Uses electron density instead of wavefunctions | Good balance speed/accuracy | Large molecules, materials |\n\n' +
        '**Worked example — hydrogen energy levels and spectral lines:**\n\n' +
        'The transition n = 3 → n = 2 (Balmer series, visible red line):\n\n' +
        'ΔE = −13.6 × (1/2² − 1/3²) = −13.6 × (1/4 − 1/9) = −13.6 × 5/36 = **−1.89 eV**\n\n' +
        'Wavelength: λ = hc/ΔE = (4.136 × 10⁻¹⁵ eV·s × 3 × 10⁸ m/s) / 1.89 eV = **656 nm** (red light)\n\n' +
        'This is the H-alpha line — the same red glow visible in emission nebulae photographed from dark-sky sites in Meghalaya\'s Ri-Bhoi hills.\n\n' +
        '**Fine structure** arises from spin–orbit coupling (the electron\'s spin interacting with the magnetic field from its own orbital motion). The splitting scales as Z⁴α², becoming significant for heavy atoms like gold (Z = 79) — this relativistic effect is actually what makes gold *golden* rather than silver-coloured.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each atomic model to its discoverer',
          pairs: [
            ['Plum pudding model', 'J. J. Thomson — electrons embedded in positive sphere (1897)'],
            ['Nuclear model', 'Ernest Rutherford — tiny dense nucleus from gold foil experiment (1911)'],
            ['Bohr model', 'Niels Bohr — electrons in fixed circular orbits / energy levels (1913)'],
            ['Quantum model', 'Schrödinger — electron probability clouds called orbitals (1926)'],
          ],
        },
      },
    },

    // ── Section 2: Subatomic Particles ──────────────────────────
    {
      title: 'Subatomic Particles',
      diagram: 'SubatomicParticlesDiagram',
      beginnerContent:
        'Every atom is built from just **three particles** — like constructing everything in the universe from only three types of LEGO bricks.\n\n' +
        '| Particle | Charge | Mass (amu) | Mass (kg) | Location |\n' +
        '|----------|--------|------------|-----------|----------|\n' +
        '| **Proton** (p⁺) | +1 | ~1.007 | 1.673 × 10⁻²⁷ | Nucleus |\n' +
        '| **Neutron** (n⁰) | 0 | ~1.009 | 1.675 × 10⁻²⁷ | Nucleus |\n' +
        '| **Electron** (e⁻) | −1 | ~0.00055 | 9.109 × 10⁻³¹ | Orbiting nucleus |\n\n' +
        'Notice the electron is **1,836 times lighter** than a proton. Imagine a cricket ball (proton) compared to a mustard seed (electron) — that\'s roughly the mass ratio.\n\n' +
        '**Why doesn\'t the nucleus fly apart?** Protons are all positive, and positive charges repel each other. But an even stronger force — the **strong nuclear force** — acts as glue, binding protons and neutrons together. It is 100× stronger than electrical repulsion but works only over extremely tiny distances (~10⁻¹⁵ m, about the width of a nucleus).\n\n' +
        '| Force | Strength (relative) | Range | Role in atom |\n' +
        '|-------|---------------------|-------|--------------|\n' +
        '| Strong nuclear | 100 | ~10⁻¹⁵ m (nuclear) | Holds nucleus together |\n' +
        '| Electromagnetic | 1 | Infinite (falls off as 1/r²) | Attracts electrons to nucleus |\n' +
        '| Weak nuclear | 0.001 | ~10⁻¹⁸ m | Governs radioactive beta decay |\n' +
        '| Gravitational | 10⁻³⁶ | Infinite | Negligible at atomic scale |\n\n' +
        '**Neutrons are the nuclear glue.** They contribute to the strong force without adding electrical repulsion. Small nuclei need roughly equal protons and neutrons (helium: 2p + 2n). Larger nuclei need *extra* neutrons to overcome the growing repulsion — lead-208 has 82 protons but 126 neutrons.\n\n' +
        'The sand along the Brahmaputra river bed contains monazite — a mineral rich in thorium (90 protons, 142 neutrons). India\'s three-stage nuclear programme is designed around thorium as fuel, and these mineral sands are part of the thorium reserve map.\n\n' +
        '**Quick check:** If you removed all the empty space from every atom in every person on Earth, how much matter would be left?\n\n' +
        '*About the size of a sugar cube — but weighing around 5 billion tonnes, because nuclear matter is incredibly dense.*',
      intermediateContent:
        '**Inside the proton: quarks and gluons**\n\n' +
        'Protons and neutrons are not truly fundamental — they are made of **quarks**, held together by **gluons** (carriers of the strong force). The study of quarks is called **quantum chromodynamics (QCD)**.\n\n' +
        '| Particle | Quark composition | Charge calculation |\n' +
        '|----------|------------------|-------------------|\n' +
        '| Proton | up + up + down (uud) | +⅔ + ⅔ − ⅓ = **+1** |\n' +
        '| Neutron | up + down + down (udd) | +⅔ − ⅓ − ⅓ = **0** |\n\n' +
        '| Quark flavour | Charge | Mass (approx.) |\n' +
        '|---------------|--------|----------------|\n' +
        '| Up (u) | +⅔ | ~2.2 MeV/c² |\n' +
        '| Down (d) | −⅓ | ~4.7 MeV/c² |\n' +
        '| Strange (s) | −⅓ | ~96 MeV/c² |\n' +
        '| Charm (c) | +⅔ | ~1,280 MeV/c² |\n' +
        '| Bottom (b) | −⅓ | ~4,180 MeV/c² |\n' +
        '| Top (t) | +⅔ | ~173,000 MeV/c² |\n\n' +
        '**Worked example — mass mystery:** The three quarks in a proton (uud) have a combined mass of only ~9.4 MeV/c². But the proton\'s actual mass is 938.3 MeV/c². Where does the other **99%** of the mass come from? From the energy of the gluon field binding the quarks together — a direct application of E = mc². Most of your body\'s mass is literally energy, not "stuff."',
      advancedContent:
        '**The Standard Model particle zoo**\n\n' +
        '| Category | Particles | Spin | Role |\n' +
        '|----------|-----------|------|------|\n' +
        '| Quarks (6 flavours) | u, d, c, s, t, b | ½ | Build hadrons (protons, neutrons) |\n' +
        '| Leptons (6) | e⁻, μ⁻, τ⁻, νₑ, ν_μ, ν_τ | ½ | Electron family + neutrinos |\n' +
        '| Gauge bosons | γ, W±, Z⁰, g (8 gluons) | 1 | Force carriers |\n' +
        '| Scalar boson | Higgs (H⁰) | 0 | Gives mass to W, Z, quarks, leptons |\n\n' +
        '**Quark confinement:** Free quarks have never been observed. The strong force gets *stronger* with distance (unlike electromagnetism). Trying to pull quarks apart is like stretching a rubber band — eventually the energy stored in the "band" (gluon field) is enough to create a new quark-antiquark pair. This is why particle accelerators produce jets of hadrons, not free quarks.\n\n' +
        '**Worked example — beta decay and the weak force:**\n\n' +
        'In neutron decay: n → p + e⁻ + ν̄ₑ\n\n' +
        'At the quark level: a down quark becomes an up quark by emitting a W⁻ boson, which immediately decays into an electron and an anti-neutrino.\n\n' +
        'd → u + W⁻ → u + e⁻ + ν̄ₑ\n\n' +
        'The neutron\'s half-life outside a nucleus is about 10.2 minutes. Inside stable nuclei, binding energy prevents this decay.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Electrons are found inside the nucleus.', answer: false, explanation: 'Electrons orbit outside the nucleus. Only protons and neutrons (nucleons) are inside the nucleus.' },
            { text: 'A neutron is slightly heavier than a proton.', answer: true, explanation: 'Neutron mass is 1.675 × 10⁻²⁷ kg vs proton\'s 1.673 × 10⁻²⁷ kg. The extra mass allows free neutrons to decay into protons.' },
            { text: 'The strong nuclear force works across the entire atom.', answer: false, explanation: 'The strong force has an extremely short range (~10⁻¹⁵ m) — it only works within the nucleus. Electromagnetic force holds the atom together at larger scales.' },
            { text: 'Most of a proton\'s mass comes from the energy of its internal gluon field, not from the quarks themselves.', answer: true, explanation: 'The three quarks (uud) contribute only ~1% of the proton\'s mass. The other ~99% is binding energy from the strong force (E = mc²).' },
          ],
        },
      },
    },

    // ── Section 3: Electron Shells and Energy Levels ────────────
    {
      title: 'Electron Shells and Energy Levels',
      diagram: 'ElectronShellDiagram',
      beginnerContent:
        'Electrons don\'t pile up randomly around the nucleus — they arrange themselves in **layers called shells**, like the layers of an onion or the concentric rings of a Jaapi (Assamese sun hat).\n\n' +
        '| Shell | Name | Max electrons (2n²) | Distance from nucleus |\n' +
        '|-------|------|---------------------|-----------------------|\n' +
        '| n = 1 | K | 2 | Closest |\n' +
        '| n = 2 | L | 8 | Further |\n' +
        '| n = 3 | M | 18 | Even further |\n' +
        '| n = 4 | N | 32 | Farthest (in common elements) |\n\n' +
        '**How electrons fill shells:** Electrons always fill the lowest energy shell first — like water filling the lowest bowl first. For the first 20 elements, a simplified **2-8-8 rule** works: first shell takes 2, second takes 8, third takes 8 before the fourth starts.\n\n' +
        '| Element | Atomic # | Shell 1 | Shell 2 | Shell 3 | Shell 4 | Valence electrons |\n' +
        '|---------|----------|---------|---------|---------|---------|-------------------|\n' +
        '| Hydrogen (H) | 1 | 1 | — | — | — | 1 |\n' +
        '| Carbon (C) | 6 | 2 | 4 | — | — | 4 |\n' +
        '| Oxygen (O) | 8 | 2 | 6 | — | — | 6 |\n' +
        '| Sodium (Na) | 11 | 2 | 8 | 1 | — | 1 |\n' +
        '| Chlorine (Cl) | 17 | 2 | 8 | 7 | — | 7 |\n' +
        '| Calcium (Ca) | 20 | 2 | 8 | 8 | 2 | 2 |\n\n' +
        'The outermost electrons are called **valence electrons** — they are the ones that participate in chemical bonding. Think of them as the "hands" of an atom, reaching out to grab other atoms.\n\n' +
        '**Why are noble gases so stable?** Helium (2), neon (2,8), and argon (2,8,8) all have completely filled outer shells. A full shell is like a completed puzzle — there\'s no gap to fill and no extra piece sticking out. This is why neon signs glow without reacting: the gas doesn\'t bond, it just gets excited by electricity.\n\n' +
        'The colored lights you see at Rongali Bihu celebrations — the greens, blues, pinks glowing in string lights and shop signs — are discharge tubes filled with different noble gases. Each gas glows a specific colour because its electrons jump between unique energy levels:\n\n' +
        '| Gas | Colour | Why |\n' +
        '|-----|--------|-----|\n' +
        '| Neon | Red-orange | Electrons fall back to the 2p level |\n' +
        '| Argon + mercury | Blue | Mercury emission lines dominate |\n' +
        '| Helium | Yellow-pink | Multiple visible transitions |\n' +
        '| Krypton | White-green | Broad visible spectrum |\n\n' +
        '**Quick check:** Sodium has 11 electrons (2, 8, 1). Chlorine has 17 (2, 8, 7). What do you predict happens when they meet?\n\n' +
        '*Sodium gives its 1 valence electron to chlorine, filling chlorine\'s shell to 8. Both atoms end up with full outer shells — forming Na⁺Cl⁻, table salt.*',
      intermediateContent:
        '**Electron configuration notation and filling order**\n\n' +
        'Instead of just counting electrons per shell, chemists write the exact subshell: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²...\n\n' +
        '**The Aufbau (building-up) principle** says: fill lowest energy subshell first. But subshells don\'t fill in simple numerical order — 4s fills *before* 3d because 4s is lower in energy for multi-electron atoms.\n\n' +
        '| Rule | What it says | Example |\n' +
        '|------|-------------|--------|\n' +
        '| **Aufbau** | Fill lowest energy first | 4s before 3d |\n' +
        '| **Pauli exclusion** | Max 2 electrons per orbital, opposite spins | Each box in an orbital diagram gets one ↑ and one ↓ |\n' +
        '| **Hund\'s rule** | Fill orbitals singly first, all same spin | 2p: ↑\\_ ↑\\_ ↑\\_ before ↑↓ ↑\\_ ↑\\_ |\n\n' +
        '**Worked example — electron configuration of iron (Fe, Z = 26):**\n\n' +
        'Follow the filling order: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶\n\n' +
        'Count: 2 + 2 + 6 + 2 + 6 + 2 + 6 = 26 ✓\n\n' +
        'Shorthand: [Ar] 4s² 3d⁶ (argon core + valence)\n\n' +
        'Iron is why Assam\'s laterite soils are red — Fe₂O₃ (iron(III) oxide) forms when iron-bearing minerals weather in the tropical climate.\n\n' +
        '| Element | Full configuration | Shorthand | Valence electrons |\n' +
        '|---------|-------------------|-----------|-------------------|\n' +
        '| Na (11) | 1s² 2s² 2p⁶ 3s¹ | [Ne] 3s¹ | 1 |\n' +
        '| Cl (17) | 1s² 2s² 2p⁶ 3s² 3p⁵ | [Ne] 3s² 3p⁵ | 7 |\n' +
        '| Fe (26) | 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶ | [Ar] 4s² 3d⁶ | 8 |\n' +
        '| Au (79) | [Xe] 6s¹ 4f¹⁴ 5d¹⁰ | — | 1 (6s) |\n\n' +
        '**Exception alert:** Copper is [Ar] 4s¹ 3d¹⁰, not 4s² 3d⁹. A completely filled d subshell (3d¹⁰) is exceptionally stable, so one electron "moves" from 4s to 3d. Chromium shows the same pattern: [Ar] 4s¹ 3d⁵ (half-filled d is also extra stable).',
      advancedContent:
        '**Why does the 4s fill before 3d? — Penetration and shielding**\n\n' +
        'A 4s electron has a probability distribution that *penetrates* closer to the nucleus than 3d. Even though 4s is further away on average, its inner lobes experience less shielding from core electrons, so it "sees" more nuclear charge and is lower in energy.\n\n' +
        '| Subshell | Average distance from nucleus | Penetration (inner peak?) | Effective nuclear charge (Zeff) |\n' +
        '|----------|-----------------------------|--------------------------|---------------------------------|\n' +
        '| 3d | Smaller | No inner peak | Lower Zeff (more shielded) |\n' +
        '| 4s | Larger | Has inner peak near nucleus | Higher Zeff (better penetration) |\n\n' +
        'This reversal only applies during filling. Once 3d has electrons, inter-electron repulsion can make 4s higher in energy — which is why transition metal ions lose 4s electrons *first* (Fe²⁺ is [Ar] 3d⁶, not [Ar] 4s² 3d⁴).\n\n' +
        '**Worked example — calculating effective nuclear charge (Slater\'s rules) for a 3p electron of chlorine (Z = 17):**\n\n' +
        'Configuration: (1s²)(2s² 2p⁶)(3s² 3p⁵)\n\n' +
        '- Same group (3s, 3p): 6 other electrons × 0.35 = 2.10\n' +
        '- (2s, 2p) group: 8 electrons × 0.85 = 6.80\n' +
        '- (1s) group: 2 electrons × 1.00 = 2.00\n\n' +
        'Screening constant σ = 2.10 + 6.80 + 2.00 = 10.90\n\n' +
        'Zeff = Z − σ = 17 − 10.90 = **6.10**\n\n' +
        'This explains why chlorine holds its electrons tightly (high ionisation energy) and eagerly grabs one more (high electron affinity).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each element to its electron shell filling',
          pairs: [
            ['Carbon (Z = 6)', '2, 4 — four valence electrons, forms 4 bonds'],
            ['Neon (Z = 10)', '2, 8 — full outer shell, noble gas, unreactive'],
            ['Sodium (Z = 11)', '2, 8, 1 — gives away 1 electron easily, very reactive metal'],
            ['Iron (Z = 26)', '[Ar] 4s² 3d⁶ — transition metal, partially filled d orbitals'],
          ],
        },
      },
    },

    // ── Section 4: Atomic Number and Mass Number ────────────────
    {
      title: 'Atomic Number and Mass Number',
      beginnerContent:
        'Every element has an **identity card** — its atomic number. Change the atomic number and you change the element entirely.\n\n' +
        '**Atomic number (Z)** = number of protons. This is the *defining* property of an element. Every atom with 6 protons is carbon, every atom with 79 protons is gold — no exceptions, no ambiguity.\n\n' +
        '**Mass number (A)** = protons + neutrons. This is the total count of heavy particles in the nucleus.\n\n' +
        '| Quantity | Symbol | Formula | What it tells you |\n' +
        '|----------|--------|---------|-------------------|\n' +
        '| Atomic number | Z | Count of protons | Which element it is |\n' +
        '| Mass number | A | Z + N (protons + neutrons) | How heavy the nucleus is |\n' +
        '| Neutron count | N | A − Z | Extra nuclear "glue" |\n\n' +
        '**Isotope notation** packs all this information into a compact symbol: ²⁷₁₃Al means aluminium with mass number 27 and atomic number 13, so it has 27 − 13 = 14 neutrons.\n\n' +
        '**Worked example — decoding iron\'s isotope:**\n\n' +
        '⁵⁶₂₆Fe → Z = 26 (iron), A = 56, N = 56 − 26 = **30 neutrons**\n\n' +
        'Protons: 26. Electrons (in neutral atom): 26. Neutrons: 30.\n\n' +
        '| Element | Symbol | Z | A | Protons | Neutrons | Electrons (neutral) |\n' +
        '|---------|--------|---|---|---------|----------|--------------------|\n' +
        '| Hydrogen | ¹₁H | 1 | 1 | 1 | 0 | 1 |\n' +
        '| Carbon | ¹²₆C | 6 | 12 | 6 | 6 | 6 |\n' +
        '| Oxygen | ¹⁶₈O | 8 | 16 | 8 | 8 | 8 |\n' +
        '| Iron | ⁵⁶₂₆Fe | 26 | 56 | 26 | 30 | 26 |\n' +
        '| Gold | ¹⁹⁷₇₉Au | 79 | 197 | 79 | 118 | 79 |\n\n' +
        '**Why isn\'t the atomic mass on the periodic table a whole number?** The listed atomic mass (e.g., carbon = 12.011) is a *weighted average* of all naturally occurring isotopes. Carbon is 98.9% carbon-12 and 1.1% carbon-13, so the average is slightly above 12.\n\n' +
        'People have been panning gold in the Subansiri and Brahmaputra rivers for centuries. Every flake they find is ¹⁹⁷Au — the only stable isotope of gold. Every gold atom in every piece of jewellery, anywhere on Earth, has exactly 79 protons and 118 neutrons.\n\n' +
        '**Quick check:** An atom has 17 protons and 18 neutrons. What element is it, and what is its mass number?\n\n' +
        '*17 protons = chlorine (Cl). Mass number = 17 + 18 = 35. It\'s chlorine-35 (³⁵Cl).*',
      intermediateContent:
        '**Calculating weighted average atomic mass**\n\n' +
        'The periodic table lists the *weighted average* of all natural isotopes, based on their relative abundance.\n\n' +
        '**Worked example — chlorine:**\n\n' +
        '| Isotope | Mass (amu) | Natural abundance |\n' +
        '|---------|------------|-------------------|\n' +
        '| ³⁵Cl | 34.969 | 75.76% |\n' +
        '| ³⁷Cl | 36.966 | 24.24% |\n\n' +
        'Weighted average = (34.969 × 0.7576) + (36.966 × 0.2424)\n' +
        '= 26.496 + 8.960 = **35.45 amu** ✓ (matches periodic table)\n\n' +
        '**Worked example — copper:**\n\n' +
        '| Isotope | Mass (amu) | Natural abundance |\n' +
        '|---------|------------|-------------------|\n' +
        '| ⁶³Cu | 62.930 | 69.17% |\n' +
        '| ⁶⁵Cu | 64.928 | 30.83% |\n\n' +
        'Average = (62.930 × 0.6917) + (64.928 × 0.3083) = 43.529 + 20.017 = **63.55 amu** ✓\n\n' +
        '| Element | Isotopes | Why average ≠ whole number |\n' +
        '|---------|----------|---------------------------|\n' +
        '| Carbon (12.011) | ¹²C (98.9%), ¹³C (1.1%) | Tiny bit of heavier isotope pulls average above 12 |\n' +
        '| Chlorine (35.45) | ³⁵Cl (75.8%), ³⁷Cl (24.2%) | Significant ³⁷Cl pulls average well above 35 |\n' +
        '| Fluorine (19.00) | ¹⁹F (100%) | Only one stable isotope — mass is essentially whole |\n\n' +
        '**Mass spectrometry** is the instrument that measures these isotope ratios. It ionises atoms, accelerates them through a magnetic field, and separates them by mass-to-charge ratio. Heavier isotopes curve less.',
      advancedContent:
        '**Nuclear binding energy — why mass numbers matter**\n\n' +
        'A nucleus weighs *less* than the sum of its individual protons and neutrons. The "missing mass" has been converted to binding energy (E = mc²) — the energy required to tear the nucleus apart.\n\n' +
        '**Worked example — helium-4 mass defect:**\n\n' +
        '- 2 protons: 2 × 1.00728 = 2.01456 amu\n' +
        '- 2 neutrons: 2 × 1.00866 = 2.01732 amu\n' +
        '- Expected total: 4.03188 amu\n' +
        '- Actual ⁴He mass: 4.00260 amu\n' +
        '- **Mass defect: 0.02928 amu**\n' +
        '- Binding energy: 0.02928 × 931.5 MeV/amu = **27.3 MeV**\n' +
        '- Per nucleon: 27.3 / 4 = **6.82 MeV/nucleon**\n\n' +
        '| Nuclide | Binding energy/nucleon | Significance |\n' +
        '|---------|----------------------|-------------|\n' +
        '| ²H (deuterium) | 1.11 MeV | Weakly bound — fuel for fusion |\n' +
        '| ⁴He | 7.07 MeV | Tightly bound — produced in fusion |\n' +
        '| ⁵⁶Fe | **8.79 MeV** | Most tightly bound — peak of curve |\n' +
        '| ²³⁵U | 7.59 MeV | Less bound — releases energy via fission |\n\n' +
        '**Iron-56 sits at the peak** of the binding energy curve. Elements lighter than iron release energy by *fusion* (combining nuclei). Elements heavier than iron release energy by *fission* (splitting nuclei). This is why stars burn hydrogen into helium (fusion) and why nuclear reactors split uranium (fission).\n\n' +
        'Stars heavier than about 8 solar masses eventually build an iron core — and then the party stops. Iron fusion would *absorb* energy rather than release it. With no outward radiation pressure, the core collapses under gravity in milliseconds, triggering a supernova. Every atom of gold in the Brahmaputra\'s sand was forged in such an explosion.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'An atom with 8 protons and 10 neutrons is oxygen.', answer: true, explanation: 'The atomic number (Z = 8) determines the element. Protons = 8 means oxygen, regardless of the neutron count. This would be oxygen-18 (¹⁸O).' },
            { text: 'The atomic mass on the periodic table is always a whole number.', answer: false, explanation: 'It\'s a weighted average of all natural isotopes. For example, chlorine is 35.45 because it\'s a mix of ³⁵Cl (75.8%) and ³⁷Cl (24.2%).' },
            { text: 'Adding a neutron to an atom changes which element it is.', answer: false, explanation: 'Only the number of protons (Z) determines the element. Adding a neutron changes the isotope but not the element. Carbon-12 and carbon-14 are both carbon.' },
            { text: 'Iron-56 has the highest binding energy per nucleon of any nuclide.', answer: true, explanation: 'Iron-56 (and nickel-62) sit at the peak of the binding energy curve at ~8.8 MeV/nucleon. This is why iron is the "ash" of stellar fusion — fusing iron would absorb energy.' },
          ],
        },
      },
    },

    // ── Section 5: Isotopes ─────────────────────────────────────
    {
      title: 'Isotopes',
      diagram: 'IsotopeDiagram',
      beginnerContent:
        'Isotopes are atoms of the **same element** (same number of protons) but with **different numbers of neutrons**. Think of them as siblings — same family name, but different weights.\n\n' +
        '| Isotope | Protons | Neutrons | Mass number | Stable? |\n' +
        '|---------|---------|----------|-------------|--------|\n' +
        '| Carbon-12 (¹²C) | 6 | 6 | 12 | Yes |\n' +
        '| Carbon-13 (¹³C) | 6 | 7 | 13 | Yes |\n' +
        '| Carbon-14 (¹⁴C) | 6 | 8 | 14 | No — radioactive |\n' +
        '| Hydrogen-1 (¹H) | 1 | 0 | 1 | Yes |\n' +
        '| Hydrogen-2 (²H, deuterium) | 1 | 1 | 2 | Yes |\n' +
        '| Hydrogen-3 (³H, tritium) | 1 | 2 | 3 | No — radioactive |\n\n' +
        'All isotopes of an element behave almost identically in chemistry — they have the same electrons, so they form the same bonds. The difference is in the nucleus: some isotopes have too many or too few neutrons, making them **radioactive** (unstable). They spontaneously decay, emitting radiation, until they reach a stable configuration.\n\n' +
        '**Half-life** is the time it takes for half of a radioactive sample to decay:\n\n' +
        '| Isotope | Half-life | Use |\n' +
        '|---------|-----------|-----|\n' +
        '| Carbon-14 | 5,730 years | Dating ancient organic material (up to ~50,000 years) |\n' +
        '| Uranium-238 | 4.5 billion years | Dating rocks and the age of the Earth |\n' +
        '| Iodine-131 | 8 days | Treating thyroid cancer |\n' +
        '| Cobalt-60 | 5.27 years | Sterilising medical equipment |\n' +
        '| Technetium-99m | 6 hours | Medical imaging (most common) |\n\n' +
        '**Worked example — radiocarbon dating:**\n\n' +
        'A wooden beam from a medieval Ahom-era temple in Sivasagar contains only 75% of the carbon-14 expected in living wood. How old is it?\n\n' +
        'The decay formula: remaining = (½)^(t / half-life)\n\n' +
        '0.75 = (½)^(t / 5730)\n\n' +
        'Taking logarithms: ln(0.75) = (t / 5730) × ln(0.5)\n\n' +
        '−0.2877 = (t / 5730) × (−0.6931)\n\n' +
        't = 5730 × 0.2877 / 0.6931 = **2,378 years** — consistent with the Ahom period.\n\n' +
        'Radiocarbon dating has been used on wooden structures from Ahom-era temples in Sivasagar and from ancient settlements at Ambari in Guwahati — each sample tells you exactly when its tree was cut, within a window of a few decades.\n\n' +
        '**Quick check:** If you start with 100 g of carbon-14, how much remains after 11,460 years (two half-lives)?\n\n' +
        '*After one half-life (5,730 years): 50 g. After two half-lives (11,460 years): 25 g. Each half-life halves whatever remains.*',
      intermediateContent:
        '**Types of radioactive decay**\n\n' +
        '| Decay type | What\'s emitted | Symbol | Penetrating power | Stopped by |\n' +
        '|------------|---------------|--------|-------------------|------------|\n' +
        '| **Alpha (α)** | ⁴He nucleus (2p + 2n) | ⁴₂α | Low | Sheet of paper, skin |\n' +
        '| **Beta-minus (β⁻)** | Electron + antineutrino | e⁻ | Medium | Aluminium foil (~few mm) |\n' +
        '| **Beta-plus (β⁺)** | Positron + neutrino | e⁺ | Medium | Same as β⁻ |\n' +
        '| **Gamma (γ)** | High-energy photon | γ | High | Thick lead or concrete |\n\n' +
        '**Worked example — alpha decay of uranium-238:**\n\n' +
        '²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂α\n\n' +
        'Check: mass numbers: 238 = 234 + 4 ✓ | Atomic numbers: 92 = 90 + 2 ✓\n\n' +
        'The uranium atom loses 2 protons and 2 neutrons, becoming thorium.\n\n' +
        '**Worked example — beta decay of carbon-14:**\n\n' +
        '¹⁴₆C → ¹⁴₇N + e⁻ + ν̄ₑ\n\n' +
        'A neutron converts to a proton (emitting an electron and antineutrino). The mass number stays 14, but the atomic number increases from 6 to 7 — carbon becomes nitrogen.\n\n' +
        '| Parent | Decay | Daughter | Change in Z | Change in A |\n' +
        '|--------|-------|----------|-------------|-------------|\n' +
        '| ²³⁸U | α | ²³⁴Th | −2 | −4 |\n' +
        '| ¹⁴C | β⁻ | ¹⁴N | +1 | 0 |\n' +
        '| ²²Na | β⁺ | ²²Ne | −1 | 0 |\n' +
        '| ⁶⁰Co | β⁻ then γ | ⁶⁰Ni | +1 | 0 |\n\n' +
        '**Decay chains:** Uranium-238 doesn\'t decay directly to a stable atom. It goes through **14 steps** of alpha and beta decays over 4.5 billion years before finally becoming stable lead-206 (²⁰⁶Pb).',
      advancedContent:
        '**Nuclear stability — the band of stability**\n\n' +
        'Plot every known nuclide on a graph of neutrons (N) vs protons (Z). Stable nuclides form a narrow **band of stability** that starts near N = Z for light elements and curves upward (more neutrons than protons) for heavy elements.\n\n' +
        '| Region | N:Z ratio | What happens | Decay mode |\n' +
        '|--------|-----------|-------------|------------|\n' +
        '| Above band | Too many neutrons | Neutron converts to proton | β⁻ decay |\n' +
        '| Below band | Too few neutrons | Proton converts to neutron | β⁺ decay or electron capture |\n' +
        '| Z > 83 (bismuth) | All unstable | Nucleus too large for strong force to hold | α decay |\n' +
        '| Z > 103 | Very short-lived | Extreme proton repulsion | Spontaneous fission |\n\n' +
        '**Magic numbers:** Nuclei with 2, 8, 20, 28, 50, 82, or 126 protons or neutrons are exceptionally stable — analogous to filled electron shells. Lead-208 (Z = 82, N = 126) is "doubly magic" and the heaviest stable nuclide.\n\n' +
        '**Worked example — predicting decay mode:**\n\n' +
        'Phosphorus-32 (¹⁵³²P): Z = 15, N = 17, N/Z = 1.13. For this mass range, stable nuclei have N/Z ≈ 1.0. P-32 has *too many neutrons* → it lies above the band → **β⁻ decay** predicted.\n\n' +
        '¹⁵³²P → ¹⁶³²S + e⁻ + ν̄ₑ (half-life = 14.3 days)\n\n' +
        'This is confirmed experimentally — P-32 is used as a radioactive tracer in biological research.\n\n' +
        '**Kinetics of radioactive decay:**\n\n' +
        'Activity A = λN = (ln 2 / t₁/₂) × N\n\n' +
        'Where λ is the decay constant and N is the number of radioactive atoms.\n\n' +
        '**Worked example:** A hospital receives 10 mg of technetium-99m (t₁/₂ = 6 hours) at 8 AM. How much is left at 8 PM?\n\n' +
        'Time elapsed = 12 hours = 2 half-lives.\n\n' +
        'Remaining = 10 × (½)² = 10 × 0.25 = **2.5 mg**\n\n' +
        'This rapid decay is why Tc-99m is ideal for medical imaging — it provides a clear signal during the scan but doesn\'t linger in the body.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Every carbon atom in your body was made inside a star. The carbon-12 nucleus is produced by the "triple-alpha process" — three helium-4 nuclei fusing in the core of a red giant star at 100 million degrees.',
            'Bananas are slightly radioactive. They contain potassium-40 (K-40), a naturally occurring radioactive isotope with a half-life of 1.25 billion years. You would need to eat about 35 million bananas at once for a lethal radiation dose.',
            'The oldest rocks in India — found in the Singhbhum region of Jharkhand — have been dated to 4.24 billion years old using uranium-lead isotope ratios, making them nearly as old as the Earth itself (4.54 billion years).',
            'Deuterium (²H) in the world\'s oceans could theoretically power fusion reactors for billions of years. Just 1 litre of seawater contains enough deuterium to produce energy equivalent to 300 litres of petrol.',
          ],
        },
      },
    },
  ],
};
