import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'nuclear-physics',
  title: 'Nuclear Physics',
  category: 'physics',
  icon: '☢️',
  tagline: "Inside the atom's nucleus — fission, fusion, and the energy that powers stars.",
  relatedStories: ['stars-ziro-valley', 'star-fell-deepor'],
  understand: [
    // ── Section 1: The Nucleus ──────────────────────────────────
    {
      title: 'The Nucleus',
      diagram: 'NucleusStructureDiagram',
      beginnerContent:
        'Every atom has a tiny, dense core called the **nucleus**. If an atom were the size of Guwahati\'s Nehru Stadium, the nucleus would be a pea on the centre spot — yet that pea would contain more than 99.9% of the stadium\'s mass. The nucleus is made of two particle types:\n\n' +
        '| Particle | Charge | Mass (u) | Role in the nucleus |\n' +
        '|----------|--------|----------|---------------------|\n' +
        '| **Proton** | +1 | 1.0073 | Determines the element (Z = atomic number) |\n' +
        '| **Neutron** | 0 | 1.0087 | Adds mass, provides nuclear "glue" |\n\n' +
        'Together, protons and neutrons are called **nucleons**. The total number of nucleons is the **mass number A** (A = Z + N).\n\n' +
        '**The puzzle:** Protons all carry positive charge and should fly apart due to electromagnetic repulsion. What holds them together? The **strong nuclear force** — the most powerful force in nature. It acts only over a femtometre (10⁻¹⁵ m) but within that range it overpowers electromagnetic repulsion by a factor of ~100.\n\n' +
        '| Force | Relative strength | Range | What it does in the nucleus |\n' +
        '|-------|-------------------|-------|----------------------------|\n' +
        '| Strong nuclear | 1 (strongest) | ~1 fm | Holds nucleons together |\n' +
        '| Electromagnetic | 1/137 | Infinite | Pushes protons apart |\n' +
        '| Weak nuclear | 10⁻⁶ | ~0.001 fm | Causes beta decay |\n' +
        '| Gravity | 10⁻³⁹ | Infinite | Negligible at nuclear scale |\n\n' +
        'Neutrons are the peacemakers — they add to the strong force without adding repulsion. Heavier elements need *more* neutrons than protons to stay stable. Lead-208, for instance, has 82 protons but 126 neutrons.\n\n' +
        '**Binding energy** is the energy needed to pull all nucleons apart. A higher binding energy per nucleon = a more tightly bound (more stable) nucleus. **Iron-56** sits at the peak — the most stable nucleus of all. Lighter elements can release energy by *fusing* toward iron; heavier elements release energy by *splitting* away from it. This single fact explains why stars fuse hydrogen and power plants split uranium.',
      intermediateContent:
        '**Nuclear size and density**\n\n' +
        'The nuclear radius follows: **R = R₀ A^(1/3)**, where R₀ ≈ 1.2 fm.\n\n' +
        '| Nucleus | A | R (fm) | Notes |\n' +
        '|---------|---|--------|-------|\n' +
        '| Helium-4 | 4 | 1.9 | Alpha particle |\n' +
        '| Carbon-12 | 12 | 2.7 | Life\'s backbone |\n' +
        '| Iron-56 | 56 | 4.6 | Most stable nucleus |\n' +
        '| Uranium-238 | 238 | 7.4 | Heaviest natural element |\n\n' +
        '**Worked example — iron-56 radius:**\n' +
        'R = 1.2 × 56^(1/3) = 1.2 × 3.83 = **4.59 fm**\n\n' +
        'Nuclear density is roughly constant at **ρ ≈ 2.3 × 10¹⁷ kg/m³** — a teaspoon would weigh ~6 billion tonnes. This constancy means nuclear matter is essentially incompressible, like a liquid (hence the "liquid drop" model).\n\n' +
        '**Binding energy per nucleon (B/A):**\n\n' +
        '| Nucleus | B (MeV) | B/A (MeV) | Significance |\n' +
        '|---------|---------|-----------|---------------|\n' +
        '| ²H (deuterium) | 2.22 | 1.11 | Weakly bound — easy to break |\n' +
        '| ⁴He (helium) | 28.3 | 7.07 | Extremely stable (doubly magic) |\n' +
        '| ⁵⁶Fe (iron) | 492 | **8.79** | Peak stability |\n' +
        '| ²³⁵U (uranium) | 1,784 | 7.59 | Can release energy by fission |\n' +
        '| ²³⁸U (uranium) | 1,802 | 7.57 | Most common uranium isotope |\n\n' +
        'The **semi-empirical mass formula** (Bethe-Weizsacker) estimates B:\n\n' +
        '`B = a_v A − a_s A^(2/3) − a_c Z(Z−1)A^(-1/3) − a_a (N−Z)²/A + δ(A,Z)`\n\n' +
        '| Term | Name | Physics it captures |\n' +
        '|------|------|---------------------|\n' +
        '| a_v A | Volume | Bulk attraction — each nucleon attracts neighbours |\n' +
        '| −a_s A^(2/3) | Surface | Surface nucleons have fewer neighbours |\n' +
        '| −a_c Z(Z−1)A^(-1/3) | Coulomb | Proton-proton repulsion |\n' +
        '| −a_a (N−Z)²/A | Asymmetry | Penalty for unequal N and Z |\n' +
        '| δ(A,Z) | Pairing | Even-even nuclei are more stable |',
      advancedContent:
        'The strong nuclear force is mediated by **gluons** exchanged between quarks inside nucleons. At the nuclear level, this manifests as the residual strong force (nuclear force), analogous to how the van der Waals force is a residual electromagnetic effect.\n\n' +
        '**Yukawa potential:**\n\n' +
        '`V(r) = −g² exp(−r/r₀) / r`\n\n' +
        'where r₀ ≈ 1.4 fm, corresponding to the pion mass via r₀ = h/(m_π c). The pion (π) is the exchange particle at nuclear distances.\n\n' +
        '**Nuclear shell model** (Nobel Prize 1963, Goeppert Mayer/Jensen) explains **magic numbers**:\n\n' +
        '| Magic number | Nucleon count | Doubly-magic examples |\n' +
        '|-------------|---------------|----------------------|\n' +
        '| 2 | 2p or 2n | ⁴He (2p, 2n) |\n' +
        '| 8 | 8p or 8n | ¹⁶O (8p, 8n) |\n' +
        '| 20 | 20p or 20n | ⁴⁰Ca (20p, 20n) |\n' +
        '| 28 | 28p or 28n | ⁴⁸Ca (20p, 28n) |\n' +
        '| 50 | 50p or 50n | — |\n' +
        '| 82 | 82p or 82n | ²⁰⁸Pb (82p, 126n) |\n' +
        '| 126 | 126n | ²⁰⁸Pb (82p, 126n) |\n\n' +
        'Magic numbers arise from spin-orbit coupling splitting energy levels, creating large gaps in the nuclear energy spectrum. Doubly-magic nuclei (both Z and N are magic) are exceptionally stable — analogous to noble gases in chemistry.\n\n' +
        'Modern nuclear physics uses **lattice QCD** computations and **chiral effective field theory** to derive nuclear forces from first principles. The "island of stability" near Z = 114, N = 184 predicts superheavy elements with half-lives of seconds to years, compared to microseconds for their neighbours — a frontier of nuclear research.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each nuclear concept to its description',
          pairs: [
            ['Proton', 'Positively charged nucleon — its count (Z) determines the element'],
            ['Neutron', 'Neutral nucleon — adds strong force attraction without electromagnetic repulsion'],
            ['Strong nuclear force', 'Acts over ~1 fm, overpowers electromagnetic repulsion by ~100×'],
            ['Binding energy', 'Energy needed to pull all nucleons apart — higher = more stable nucleus'],
            ['Iron-56', 'Highest binding energy per nucleon (8.79 MeV) — peak of the stability curve'],
          ],
        },
      },
    },

    // ── Section 2: Radioactivity ────────────────────────────────
    {
      title: 'Radioactivity',
      diagram: 'RadioactiveDecayDiagram',
      beginnerContent:
        'Radioactivity is the spontaneous emission of particles or energy from an unstable nucleus. Think of it like an overloaded truck shedding cargo to become lighter and more stable. There are three main types:\n\n' +
        '| Type | What is emitted | Symbol | Stopped by | Charge | Speed |\n' +
        '|------|----------------|--------|------------|--------|-------|\n' +
        '| **Alpha (α)** | Helium-4 nucleus (2p + 2n) | ⁴He | Sheet of paper | +2 | ~5% of light speed |\n' +
        '| **Beta (β⁻)** | Electron + antineutrino | e⁻ | Few mm of aluminium | −1 | Up to 99% of light speed |\n' +
        '| **Gamma (γ)** | High-energy photon | γ | Thick lead or concrete | 0 | Speed of light |\n\n' +
        '**Analogy:** Imagine throwing three different objects at a bookshelf. An alpha particle is a bowling ball — heavy, slow, stopped immediately. A beta particle is a tennis ball — lighter, faster, gets past the first few books. A gamma ray is a laser beam — massless, unstoppable until it hits something truly dense.\n\n' +
        '**Why does each type have different penetrating power?**\n\n' +
        '| Property | Alpha | Beta | Gamma |\n' +
        '|----------|-------|------|-------|\n' +
        '| Mass | Heavy (4 u) | Light (0.00055 u) | None |\n' +
        '| Charge | +2 (strong interaction) | −1 (moderate) | 0 (no charge) |\n' +
        '| Ionisation per cm in air | ~100,000 pairs | ~1,000 pairs | ~10 pairs |\n' +
        '| Range in air | 3–7 cm | ~1 m | Several hundred metres |\n' +
        '| Danger | Internal (inhaled/ingested) | Skin burns, internal | Whole-body penetration |\n\n' +
        'Heavy, highly charged particles ionise air molecules rapidly, losing energy quickly — hence short range. Gamma photons rarely interact, so they travel far.\n\n' +
        'The hills of Meghalaya contain naturally radioactive monazite sands (rich in thorium-232). Background radiation levels in parts of Domiasiat are higher than average — a natural laboratory for studying low-dose radiation effects on health and soil chemistry.',
      intermediateContent:
        '**Decay equations and energy:**\n\n' +
        '**Alpha decay** — parent loses 2 protons and 2 neutrons:\n\n' +
        '`²²⁶Ra → ²²²Rn + ⁴He`  (Z → Z−2, A → A−4)\n\n' +
        '**Worked example — energy of radium-226 alpha decay:**\n\n' +
        '| Quantity | Value |\n' +
        '|----------|-------|\n' +
        '| Mass of ²²⁶Ra | 226.0254 u |\n' +
        '| Mass of ²²²Rn | 222.0176 u |\n' +
        '| Mass of ⁴He | 4.0026 u |\n' +
        '| Mass defect Δm | 226.0254 − 222.0176 − 4.0026 = **0.0052 u** |\n' +
        '| Energy released Q | 0.0052 × 931.5 MeV/u = **4.87 MeV** |\n\n' +
        '**Beta-minus decay** — a neutron becomes a proton:\n\n' +
        '`n → p + e⁻ + v̄ₑ`  (Z → Z+1, A unchanged)\n\n' +
        'Example: `¹⁴C → ¹⁴N + e⁻ + v̄ₑ`\n\n' +
        '**Gamma decay** — nucleus drops from excited state, emitting a photon. No change in Z or A. Often follows alpha or beta decay.\n\n' +
        '| Decay type | Z change | A change | Particles emitted |\n' +
        '|------------|----------|----------|--------------------|\n' +
        '| Alpha | −2 | −4 | ⁴He nucleus |\n' +
        '| Beta-minus | +1 | 0 | Electron + antineutrino |\n' +
        '| Beta-plus | −1 | 0 | Positron + neutrino |\n' +
        '| Gamma | 0 | 0 | High-energy photon |\n\n' +
        'The **inverse square law** applies to gamma radiation: **I = I₀/(4πr²)** — doubling the distance quarters the dose. This is the first principle of radiation safety: *distance is your friend*.',
      advancedContent:
        '**Alpha decay and quantum tunnelling**\n\n' +
        'Classically, the alpha particle does not have enough energy to escape the nuclear potential well — the Coulomb barrier is ~25 MeV tall, but typical alpha energies are only ~5 MeV. Gamow (1928) showed that quantum tunnelling explains alpha decay: the alpha particle has a nonzero probability of "leaking" through the barrier.\n\n' +
        'Decay rate ∝ exp(−2πη_G), where the Gamow parameter η_G = Z₁Z₂e²/(hv). Small changes in decay energy produce enormous changes in half-life:\n\n' +
        '| Isotope | Alpha energy (MeV) | Half-life | Note |\n' +
        '|---------|-------------------|-----------|------|\n' +
        '| ²³²Th | 4.08 | 1.4 × 10¹⁰ years | Barely decays |\n' +
        '| ²²⁶Ra | 4.87 | 1,600 years | Much faster |\n' +
        '| ²¹²Po | 8.95 | 0.3 μs | Nearly instantaneous |\n\n' +
        'Doubling the alpha energy from 4 to 9 MeV changes the half-life by a factor of ~10²³ — one of the most dramatic sensitivities in physics.\n\n' +
        '**Beta decay and the weak force:**\n\n' +
        'Mediated by W± and Z⁰ bosons (masses ~80–91 GeV/c²). The short range of the weak force (~10⁻¹⁸ m) explains why beta decay is slow compared to strong-force processes. Fermi\'s theory (1934) gives the decay rate ∝ |M|² f(Z, E₀), where f is the Fermi integral.\n\n' +
        '**Double beta decay** (two simultaneous beta decays) has been observed with T₁/₂ ~ 10¹⁹–10²⁴ years. The hypothetical **neutrinoless double beta decay** (0vββ) would prove neutrinos are Majorana fermions (their own antiparticles) — one of the most actively searched-for processes in modern physics.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Alpha particles are the most penetrating form of radiation.', answer: false, explanation: 'Alpha particles are the LEAST penetrating — stopped by paper or skin. Gamma rays are the most penetrating, requiring thick lead or concrete.' },
            { text: 'In beta-minus decay, a neutron transforms into a proton inside the nucleus.', answer: true, explanation: 'A neutron converts to a proton, emitting an electron and an antineutrino. The atomic number increases by 1 while mass number stays the same.' },
            { text: 'Gamma decay changes the element (atomic number) of the atom.', answer: false, explanation: 'Gamma decay only releases energy as a photon. Neither Z nor A changes — the nucleus just drops to a lower energy state.' },
            { text: 'The monazite sands of Meghalaya are naturally radioactive due to thorium content.', answer: true, explanation: 'Meghalaya\'s monazite sands contain thorium-232, creating naturally elevated background radiation in areas like Domiasiat.' },
          ],
        },
      },
    },

    // ── Section 3: Half-Life ────────────────────────────────────
    {
      title: 'Half-Life',
      diagram: 'HalfLifeDiagram',
      beginnerContent:
        'Radioactive decay is random — you cannot predict when any individual atom will decay. But with billions of atoms, the pattern is strikingly precise. The **half-life** (t₁/₂) is the time it takes for exactly half of a sample to decay.\n\n' +
        '| Half-lives elapsed | Fraction remaining | Percentage |\n' +
        '|-------------------|-------------------|------------|\n' +
        '| 0 | 1 | 100% |\n' +
        '| 1 | 1/2 | 50% |\n' +
        '| 2 | 1/4 | 25% |\n' +
        '| 3 | 1/8 | 12.5% |\n' +
        '| 4 | 1/16 | 6.25% |\n' +
        '| 5 | 1/32 | 3.125% |\n' +
        '| 10 | 1/1024 | ~0.1% |\n\n' +
        'The formula: **fraction remaining = (1/2)^n**, where n = number of half-lives.\n\n' +
        'Half-lives vary enormously:\n\n' +
        '| Isotope | Half-life | Use / Significance |\n' +
        '|---------|-----------|-------------------|\n' +
        '| Uranium-238 | 4.5 billion years | Still exists in Earth\'s crust — as old as the planet |\n' +
        '| Carbon-14 | 5,730 years | Dating organic material up to ~50,000 years |\n' +
        '| Cobalt-60 | 5.27 years | Cancer radiotherapy |\n' +
        '| Iodine-131 | 8.02 days | Thyroid treatment |\n' +
        '| Radon-222 | 3.82 days | Indoor air hazard (seeps from ground) |\n' +
        '| Polonium-214 | 0.000164 seconds | Almost instantaneous |\n\n' +
        'Half-life is an **intrinsic property** — it cannot be changed by temperature, pressure, or chemistry. It depends only on the forces inside the nucleus.\n\n' +
        'Carbon-14 dating has been used to date the earliest human settlements in the Brahmaputra valley, ancient wooden boats recovered from river sediments, and Ahom-era artifacts. A charcoal sample with half the expected C-14 is ~5,730 years old (one half-life); a quarter means ~11,460 years (two half-lives).\n\n' +
        '**Quick check:** A hospital has 80 g of iodine-131 (t₁/₂ = 8 days). How much remains after 24 days?\n\n' +
        '*24 days = 3 half-lives. 80 → 40 → 20 → **10 g** remains.*',
      intermediateContent:
        '**The mathematics of decay**\n\n' +
        'Two equivalent forms of the decay equation:\n\n' +
        '`N(t) = N₀ (1/2)^(t/t₁/₂) = N₀ e^(−λt)`\n\n' +
        'where the decay constant **λ = ln(2)/t₁/₂ = 0.693/t₁/₂**.\n\n' +
        '**Activity** (decays per second): **A = λN**, measured in becquerels (Bq, 1 decay/s).\n\n' +
        '**Worked example — iodine-131 activity:**\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|-------------|--------|\n' +
        '| Sample mass | 1 μg of ¹³¹I | 10⁻⁶ g |\n' +
        '| Number of atoms N₀ | (10⁻⁶ / 131) × 6.022 × 10²³ | 4.60 × 10¹⁵ atoms |\n' +
        '| Decay constant λ | 0.693 / (8.02 × 86,400 s) | 10⁻⁶ s⁻¹ |\n' +
        '| Initial activity A₀ | λ × N₀ = 10⁻⁶ × 4.60 × 10¹⁵ | **4.6 GBq** |\n' +
        '| After 3 half-lives (24 d) | 4.6 × 10⁹ × (1/2)³ | **575 MBq** |\n\n' +
        '**Carbon-14 dating worked example:**\n\n' +
        '| Quantity | Value |\n' +
        '|----------|-------|\n' +
        '| Living C-14 activity | ~0.25 Bq per gram of carbon |\n' +
        '| Sample activity | 0.0625 Bq/g |\n' +
        '| Ratio | 0.0625 / 0.25 = 1/4 |\n' +
        '| Half-lives elapsed | (1/2)^n = 1/4 → n = 2 |\n' +
        '| Age | 2 × 5,730 = **11,460 years** |\n\n' +
        'The detection limit (~0.25/2¹⁰ ≈ 0.0002 Bq/g) sets the maximum datable age at ~10 half-lives ≈ 57,000 years. Beyond that, there is too little C-14 left to measure reliably.',
      advancedContent:
        '**Statistical nature of decay**\n\n' +
        'Radioactive decay is a **Poisson process**: if the average number of decays in time Δt is μ = AΔt, then P(k decays) = μ^k e^(−μ) / k!. The standard deviation is √μ, so the relative uncertainty is 1/√N.\n\n' +
        '| Counts measured (N) | Uncertainty (√N) | Relative error |\n' +
        '|---------------------|-----------------|----------------|\n' +
        '| 100 | 10 | 10% |\n' +
        '| 10,000 | 100 | 1% |\n' +
        '| 1,000,000 | 1,000 | 0.1% |\n\n' +
        'This is why precision dating requires long counting times — more decays = smaller error bars.\n\n' +
        '**Decay chains:** ²³⁸U passes through 14 decays (8α + 6β) before reaching stable ²⁰⁶Pb. The chain includes radon-222 (a gas that seeps into homes) and polonium-210 (notoriously toxic).\n\n' +
        '**Secular equilibrium** (parent t₁/₂ >> daughter t₁/₂): daughter activity equals parent activity. Used in medical generator systems — a long-lived parent produces a short-lived medical isotope on demand (e.g., ⁹⁹Mo → ⁹⁹ᵐTc, the most widely used medical isotope).\n\n' +
        '**Uranium-lead dating** — the gold standard of geochronology:\n\n' +
        '| Decay chain | Half-life | Final product |\n' +
        '|-------------|-----------|---------------|\n' +
        '| ²³⁸U → ²⁰⁶Pb | 4.468 Ga | 8α + 6β decays |\n' +
        '| ²³⁵U → ²⁰⁷Pb | 0.704 Ga | 7α + 4β decays |\n\n' +
        'Zircon crystals (ZrSiO₄) incorporate uranium but reject lead during crystallization — so any lead found is radiogenic. **Isochron dating** plots ²⁰⁷Pb/²⁰⁴Pb vs ²⁰⁶Pb/²⁰⁴Pb; the slope gives the age. Patterson (1956) used this method on meteorites to determine Earth\'s age: **4.54 ± 0.05 Ga** — still accepted today.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each isotope to its half-life and primary use',
          pairs: [
            ['Uranium-238', '4.5 billion years — dating the age of rocks and the Earth itself'],
            ['Carbon-14', '5,730 years — dating organic remains up to ~50,000 years old'],
            ['Iodine-131', '8.02 days — thyroid imaging and treatment'],
            ['Cobalt-60', '5.27 years — cancer radiotherapy and food irradiation'],
            ['Radon-222', '3.82 days — indoor air hazard from natural ground seepage'],
          ],
        },
      },
    },

    // ── Section 4: Nuclear Fission ──────────────────────────────
    {
      title: 'Nuclear Fission',
      diagram: 'FissionFusionDiagram',
      beginnerContent:
        'Nuclear fission is the splitting of a heavy nucleus into two lighter ones, releasing neutrons and a staggering amount of energy. Imagine a water balloon so overfilled it bursts into two smaller balloons — except this "burst" releases 50 million times more energy than a chemical explosion.\n\n' +
        '**How it works:** A slow neutron strikes a uranium-235 nucleus. The nucleus absorbs it, wobbles violently (like a jelly), and splits — typically into two mid-sized nuclei plus 2–3 free neutrons and ~200 MeV of energy.\n\n' +
        '`²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n + ~200 MeV`\n\n' +
        '**Why is 200 MeV extraordinary?**\n\n' +
        '| Reaction | Energy per event | Comparison |\n' +
        '|----------|-----------------|------------|\n' +
        '| Burning coal (C + O₂) | ~4 eV | 1× (baseline) |\n' +
        '| TNT explosion | ~6 eV | 1.5× |\n' +
        '| **Uranium fission** | **~200,000,000 eV** | **50,000,000×** |\n\n' +
        '**Where does the energy go?**\n\n' +
        '| Component | Energy (MeV) | Percentage |\n' +
        '|-----------|-------------|------------|\n' +
        '| Kinetic energy of fragments | ~165 | 82% |\n' +
        '| Neutron kinetic energy | ~5 | 2.5% |\n' +
        '| Prompt gamma rays | ~5 | 2.5% |\n' +
        '| Beta decay energy | ~8 | 4% |\n' +
        '| Neutrino energy (lost) | ~12 | 6% |\n' +
        '| Delayed gamma rays | ~5 | 2.5% |\n' +
        '| **Total** | **~200** | **100%** |\n\n' +
        'A single kilogram of uranium-235 contains as much energy as ~2,500 tonnes of coal. Nuclear power plants use fission heat to boil water into steam, which spins turbines to generate electricity — the same basic principle as a coal plant, but without burning fossil fuels or emitting CO₂ during operation.\n\n' +
        '**The trade-off:** Fission produces radioactive waste that remains hazardous for thousands of years. The Chernobyl (1986) and Fukushima (2011) accidents show the consequences of losing control. Safe waste storage and reactor design remain engineering\'s greatest nuclear challenges.',
      intermediateContent:
        '**Mass defect and E = mc²**\n\n' +
        '**Worked example — fission energy from mass defect:**\n\n' +
        '| Quantity | Mass (u) |\n' +
        '|----------|----------|\n' +
        '| ²³⁵U | 235.0439 |\n' +
        '| Neutron absorbed | 1.0087 |\n' +
        '| **Total before** | **236.0526** |\n' +
        '| ¹⁴¹Ba | 140.9144 |\n' +
        '| ⁹²Kr | 91.9262 |\n' +
        '| 3 neutrons | 3 × 1.0087 = 3.0261 |\n' +
        '| **Total after** | **235.8667** |\n' +
        '| **Mass defect Δm** | **0.1859 u** |\n' +
        '| **Energy E = Δm × 931.5** | **173 MeV** (kinetic energy of fragments) |\n\n' +
        'The remaining ~27 MeV comes from subsequent beta/gamma decays of the fission fragments.\n\n' +
        '**Critical mass** — the minimum fissile material for a sustained chain reaction:\n\n' +
        '| Material | Bare sphere | With Be reflector | Sphere diameter |\n' +
        '|----------|-------------|-------------------|----------------|\n' +
        '| ²³⁵U (93% enriched) | ~52 kg | ~15 kg | ~17 cm bare |\n' +
        '| ²³⁹Pu | ~10 kg | ~4 kg | ~10 cm bare |\n\n' +
        '**The multiplication factor k:**\n\n' +
        '| k value | Name | What happens |\n' +
        '|---------|------|-------------|\n' +
        '| k < 1 | Subcritical | Reaction dies out |\n' +
        '| k = 1 | Critical | Steady, sustained reaction (power reactor) |\n' +
        '| k > 1 | Supercritical | Exponential growth (weapon or startup) |\n\n' +
        'Reactor operators keep k = 1.000 precisely by adjusting control rods (boron/cadmium) that absorb excess neutrons.',
      advancedContent:
        '**Fission cross-sections and reactor physics**\n\n' +
        'The fission cross-section σ_f depends dramatically on neutron energy:\n\n' +
        '| Neutron energy | σ_f for ²³⁵U | σ_f for ²³⁸U | Implication |\n' +
        '|---------------|-------------|-------------|-------------|\n' +
        '| Thermal (0.025 eV) | **584 barns** | 0 barns | Only ²³⁵U fissions |\n' +
        '| Epithermal (1 eV) | ~100 barns | 0 barns | Resonance region |\n' +
        '| Fast (1 MeV) | ~1.2 barns | ~0.5 barns | Both can fission |\n\n' +
        '(1 barn = 10⁻²⁴ cm²)\n\n' +
        'This is why thermal reactors need moderators — slowing neutrons from MeV to meV increases the fission probability by ~500×.\n\n' +
        '**The four-factor formula** for infinite multiplication:\n\n' +
        '`k_∞ = η × ε × p × f`\n\n' +
        '| Factor | Name | Typical value | Physics |\n' +
        '|--------|------|--------------|--------|\n' +
        '| η | Reproduction factor | 2.08 | Neutrons per absorption in fuel |\n' +
        '| ε | Fast fission factor | ~1.03 | Bonus fissions by fast neutrons in ²³⁸U |\n' +
        '| p | Resonance escape | ~0.87 | Fraction avoiding capture at intermediate energies |\n' +
        '| f | Thermal utilisation | ~0.71 | Fraction of thermal neutrons absorbed in fuel (vs moderator) |\n\n' +
        'Finite-size correction: k_eff = k_∞ × P_FNL × P_TNL (non-leakage probabilities).\n\n' +
        'Modern reactor simulation uses **Monte Carlo neutron transport** (MCNP, Serpent) with billions of simulated histories. Generation IV designs (molten salt, fast breeder, pebble bed) aim for passive safety, waste transmutation, and proliferation resistance.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A single uranium-235 fission releases about 200 MeV — roughly 50 million times more energy than burning one carbon atom.', answer: true, explanation: 'Coal combustion releases ~4 eV per atom. Uranium fission releases ~200 MeV = 200,000,000 eV. The ratio is 50 million to one.' },
            { text: 'In a nuclear reactor, k must be greater than 1 for safe steady-state operation.', answer: false, explanation: 'For steady operation, k must equal exactly 1 (critical). k > 1 means exponential growth — used only briefly during startup, then brought back to 1.' },
            { text: 'The critical mass of plutonium-239 is larger than that of uranium-235.', answer: false, explanation: 'Plutonium-239 has a higher fission cross-section, so its critical mass is much smaller (~10 kg bare vs ~52 kg for U-235).' },
            { text: 'Moderators like water slow neutrons down to increase the probability of fission.', answer: true, explanation: 'The fission cross-section of U-235 is ~584 barns for thermal (slow) neutrons but only ~1.2 barns for fast neutrons — slowing them increases capture probability by ~500×.' },
          ],
        },
      },
    },

    // ── Section 5: Nuclear Fusion ───────────────────────────────
    {
      title: 'Nuclear Fusion',
      beginnerContent:
        'Fusion is the opposite of fission — instead of splitting heavy nuclei, you **combine light ones**. It is the power source of every star in the universe.\n\n' +
        'In the Sun\'s core (15 million °C, 250 billion atmospheres), four hydrogen nuclei fuse into one helium-4 nucleus through the **proton-proton chain**. The helium has 0.7% less mass than the four original protons. That "missing" mass has become pure energy via **E = mc²**.\n\n' +
        '**Worked example — the Sun\'s power:**\n\n' +
        '| Quantity | Value |\n' +
        '|----------|-------|\n' +
        '| Mass converted per second | 4.3 × 10⁹ kg |\n' +
        '| E = mc² | 4.3 × 10⁹ × (3 × 10⁸)² |\n' +
        '| **Power output** | **3.8 × 10²⁶ Watts** |\n' +
        '| Hydrogen consumed per second | 600 million tonnes |\n' +
        '| Fuel remaining | ~5 billion years\' worth |\n\n' +
        'The Sun has been fusing hydrogen for 4.6 billion years and is only halfway through its fuel.\n\n' +
        '**Fusion vs fission — side by side:**\n\n' +
        '| Feature | Fission | Fusion |\n' +
        '|---------|---------|--------|\n' +
        '| Process | Split heavy nuclei | Combine light nuclei |\n' +
        '| Fuel | Uranium, plutonium (rare) | Hydrogen (abundant — in water) |\n' +
        '| Energy per kg of fuel | ~80 TJ | ~340 TJ (4× more) |\n' +
        '| Radioactive waste | Long-lived (thousands of years) | Short-lived (decades) |\n' +
        '| Meltdown risk | Yes (Chernobyl, Fukushima) | No — reaction stops if disrupted |\n' +
        '| Status on Earth | Working since 1950s | Still experimental |\n\n' +
        'The stars visible from Ziro Valley in Arunachal Pradesh — every one of them is a fusion reactor. The Sun\'s light takes 8 minutes to reach Earth; the light from Sirius (the brightest star) has travelled 8.6 years. The energy powering that starlight was created by fusion in the star\'s core.\n\n' +
        'If we can harness fusion on Earth, a single glass of seawater would contain enough deuterium to produce the energy equivalent of 300 litres of petrol. The fuel is virtually unlimited and the waste is minimal. That is why fusion is called the "holy grail" of energy.',
      intermediateContent:
        '**The D-T fusion reaction** (most promising for Earth-based reactors):\n\n' +
        '`²H + ³H → ⁴He (3.5 MeV) + n (14.1 MeV)`\n\n' +
        '**Worked example — D-T mass defect:**\n\n' +
        '| Quantity | Mass (u) |\n' +
        '|----------|----------|\n' +
        '| Deuterium (²H) | 2.0141 |\n' +
        '| Tritium (³H) | 3.0160 |\n' +
        '| **Total before** | **5.0301** |\n' +
        '| Helium-4 (⁴He) | 4.0026 |\n' +
        '| Neutron | 1.0087 |\n' +
        '| **Total after** | **5.0113** |\n' +
        '| **Mass defect** | **0.0188 u** |\n' +
        '| **Energy = 0.0188 × 931.5** | **17.5 MeV** |\n\n' +
        '**The Sun\'s proton-proton chain:**\n\n' +
        '| Step | Reaction | Energy released |\n' +
        '|------|----------|----------------|\n' +
        '| 1 | p + p → ²H + e⁺ + vₑ | 1.44 MeV |\n' +
        '| 2 | ²H + p → ³He + γ | 5.49 MeV |\n' +
        '| 3 | ³He + ³He → ⁴He + 2p | 12.86 MeV |\n' +
        '| **Net** | **4p → ⁴He + 2e⁺ + 2vₑ + 2γ** | **26.73 MeV** |\n\n' +
        '**The Lawson criterion** for breakeven fusion: **nτT > 3 × 10²¹ keV·s/m³**, where n = plasma density, τ = confinement time, T = temperature.\n\n' +
        '| Experiment | Year | Q (fusion out / heat in) | Status |\n' +
        '|------------|------|-------------------------|--------|\n' +
        '| JET (UK) | 1997 | 0.67 | Record for tokamak |\n' +
        '| NIF (USA) | 2022 | 1.5 (laser energy) | First scientific breakeven |\n' +
        '| ITER (France) | ~2035 | Target: 10 | Under construction, 35 nations |',
      advancedContent:
        '**The Gamow peak and fusion reaction rates**\n\n' +
        'Fusion requires tunnelling through the Coulomb barrier. The reaction rate depends on two opposing factors:\n\n' +
        '- **Maxwell-Boltzmann distribution** — falls exponentially at high energies (fewer particles)\n' +
        '- **Tunnelling probability** — rises exponentially with energy (easier to tunnel)\n\n' +
        'Their product peaks at the **Gamow energy**: the narrow window where fusion actually occurs.\n\n' +
        '`⟨σv⟩ ∝ T^(−2/3) exp(−3E_G^(1/3) / (kT)^(1/3))`\n\n' +
        'where E_G is the Gamow energy. For D-T fusion, the cross-section peaks at ~5 barns near 64 keV centre-of-mass energy (~700 million K), but the Gamow peak at reactor temperatures (~10–20 keV) allows significant fusion from the Maxwellian tail.\n\n' +
        '**Tokamak confinement:**\n\n' +
        '| Parameter | Symbol | Constraint |\n' +
        '|-----------|--------|------------|\n' +
        '| Safety factor | q = rB_t/(RB_p) | Must exceed 1 everywhere (kink instability) |\n' +
        '| Greenwald density | n_G = I_p/(πa²) | Maximum plasma density before disruption |\n' +
        '| Beta limit | β = p/(B²/2μ₀) | Pressure vs magnetic field — Troyon limit |\n' +
        '| Energy confinement | τ_E | Must satisfy Lawson criterion for Q > 1 |\n\n' +
        '**Inertial confinement fusion** (ICF) at NIF: 192 laser beams deliver ~2 MJ in nanoseconds to a millimetre-scale fuel pellet, compressing it to >100 billion atmospheres. In December 2022, NIF achieved Q > 1 (3.15 MJ fusion from 2.05 MJ laser energy) — a historic milestone, though the total wall-plug energy was ~300 MJ (the lasers are very inefficient).\n\n' +
        '**Stellarators** (e.g., Wendelstein 7-X in Germany) use twisted external coils instead of a plasma current for confinement — avoiding disruptions but requiring extraordinarily complex magnet geometry optimised by supercomputers.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each fusion concept to its description',
          pairs: [
            ['Proton-proton chain', 'The Sun\'s primary fusion pathway — 4 protons → helium-4 + energy (26.73 MeV)'],
            ['D-T reaction', 'Most promising for reactors — deuterium + tritium → helium + neutron (17.6 MeV)'],
            ['Lawson criterion', 'Minimum nτT product needed for fusion breakeven — density × time × temperature'],
            ['Tokamak', 'Magnetic confinement device using toroidal + poloidal fields to trap plasma'],
            ['ITER', '35-nation project in France aiming for Q = 10 — the first net-energy fusion reactor'],
          ],
        },
      },
    },

    // ── Section 6: Critical Mass and Geometry ───────────────────
    {
      title: 'Critical Mass and Geometry',
      beginnerContent:
        'For a chain reaction to sustain itself, enough neutrons from each fission must strike other nuclei before escaping from the surface. The **critical mass** is the minimum amount of fissile material needed. For uranium-235, it is about 52 kg — a sphere roughly the size of a grapefruit.\n\n' +
        '**Why a sphere?** The key is the **surface-area-to-volume ratio**:\n\n' +
        '| Shape (same volume) | Surface area (relative) | Neutrons that escape | Critical mass |\n' +
        '|--------------------|------------------------|---------------------|---------------|\n' +
        '| **Sphere** | 1.00× (minimum) | Fewest | **Smallest** |\n' +
        '| Cube | 1.24× | More | Larger |\n' +
        '| Cylinder (L = D) | 1.14× | More | Larger |\n' +
        '| Flat disc | Very high | Most | Much larger |\n\n' +
        'A sphere exposes the least surface for a given volume, so fewer neutrons leak out. This is geometry at work in nuclear physics.\n\n' +
        '**Analogy:** Imagine a crowd of people in a room, each tossing a ball randomly. In a small room (small sphere), most balls hit the walls and are lost. In a larger room, more balls hit other people before reaching the walls. At a certain room size, each person who catches a ball can throw it and reliably hit someone else — that\'s critical mass.\n\n' +
        '**The scaling law:** Volume grows as r³ but surface area only as r². So as a sphere gets bigger, the fraction of neutrons near the surface (and likely to escape) shrinks. Eventually, the production rate matches escape + absorption losses — this is the **critical radius**.\n\n' +
        '**Neutron reflectors** surround the core with dense material (beryllium, tungsten, natural uranium) that bounces escaping neutrons back in:\n\n' +
        '| Material | Bare critical mass | With reflector | Reduction |\n' +
        '|----------|-------------------|----------------|----------|\n' +
        '| ²³⁵U | ~52 kg | ~15 kg | 71% less |\n' +
        '| ²³⁹Pu | ~10 kg | ~4 kg | 60% less |\n\n' +
        'This principle matters for both reactor design (where control and safety are paramount) and understanding why nuclear materials require strict international oversight.',
      intermediateContent:
        '**Quantifying criticality**\n\n' +
        'The neutron multiplication factor **k_eff = 1** at criticality. For a bare sphere:\n\n' +
        '`B × R = π` (geometric criticality condition)\n\n' +
        'where B is the material buckling (related to neutron production vs absorption).\n\n' +
        '**Surface-area-to-volume ratio for a sphere: SA/V = 3/R**\n\n' +
        'As R increases, SA/V decreases — confirming larger spheres lose fewer neutrons.\n\n' +
        '**Worked example — critical mass of U-235:**\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|-------------|--------|\n' +
        '| Critical radius | From diffusion theory | R ≈ 8.5 cm |\n' +
        '| Volume | (4/3)π(0.085)³ | 2.57 × 10⁻³ m³ |\n' +
        '| Density of U-235 | 19,100 kg/m³ | — |\n' +
        '| Critical mass | ρ × V = 19,100 × 2.57 × 10⁻³ | **~49 kg** |\n' +
        '| Corrected (transport) | | **~52 kg** |\n\n' +
        '**Reflector effect — beryllium (10 cm shell):**\n\n' +
        '| Parameter | Bare | Reflected |\n' +
        '|-----------|------|----------|\n' +
        '| Neutron reflection probability | 0% | ~30% per bounce |\n' +
        '| Effective radius increase | — | ~4 cm equivalent |\n' +
        '| Critical mass | 52 kg | ~15 kg |\n\n' +
        '**Comparison of fissile materials:**\n\n' +
        '| Isotope | σ_f (thermal) | ν (neutrons/fission) | Critical mass (bare) |\n' +
        '|---------|--------------|---------------------|---------------------|\n' +
        '| ²³³U | 529 barns | 2.49 | ~16 kg |\n' +
        '| ²³⁵U | 584 barns | 2.43 | ~52 kg |\n' +
        '| ²³⁹Pu | 748 barns | 2.88 | ~10 kg |',
      advancedContent:
        '**Neutron diffusion theory**\n\n' +
        'The one-group diffusion equation for criticality in a sphere:\n\n' +
        '`del²φ + B²φ = 0`\n\n' +
        'with boundary condition φ(R + 0.71λ_tr) = 0 (extrapolated boundary, where λ_tr is the transport mean free path).\n\n' +
        '**Material buckling:** `B²_m = (k_∞ − 1) / M²`\n\n' +
        'where M² = L² + τ is the migration area (L = diffusion length, τ = Fermi age).\n\n' +
        '**Geometric buckling for different shapes:**\n\n' +
        '| Geometry | B²_g formula | Optimality |\n' +
        '|----------|-------------|------------|\n' +
        '| Sphere (radius R) | (π/R_e)² | Best (smallest volume for given B²) |\n' +
        '| Cylinder (R, H) | (2.405/R)² + (π/H)² | Optimal when H/D ≈ 0.924 |\n' +
        '| Rectangular (a, b, c) | (π/a)² + (π/b)² + (π/c)² | Cube is best cuboid |\n\n' +
        'R_e = R + 0.71λ_tr is the extrapolated radius.\n\n' +
        'Criticality: B²_m = B²_g. The sphere minimises critical volume because it minimises B²_g for a given volume.\n\n' +
        '**Weapons physics:** The **implosion design** uses conventional explosives to compress a subcritical sphere to supercritical density. Since R_c ∝ 1/ρ, doubling the density halves the critical radius and reduces critical mass by 8× (R_c³). Prompt criticality (k > 1/(1−β) ≈ 1.0065 for U-235) is achieved in microseconds.\n\n' +
        '**Weapons-grade** uranium is enriched to >90% U-235 (vs 3–5% for reactor fuel, vs 0.7% natural). The enrichment process (gas centrifuge) exploits the tiny mass difference between ²³⁵UF₆ and ²³⁸UF₆ — thousands of centrifuge stages are needed, making enrichment a significant technological barrier to proliferation.',
    },

    // ── Section 7: Chain Reactions ──────────────────────────────
    {
      title: 'Chain Reactions',
      diagram: 'ChainReactionDiagram',
      beginnerContent:
        'When uranium-235 fissions, it releases 2–3 free neutrons. Each can strike another U-235 nucleus, causing another fission, releasing more neutrons. This is a **chain reaction** — each event triggers the next, like dominoes falling in a branching pattern.\n\n' +
        'The crucial number is **k** (the neutron multiplication factor):\n\n' +
        '| k value | Name | What happens | Example |\n' +
        '|---------|------|-------------|--------|\n' +
        '| k < 1 | **Subcritical** | Each generation has fewer neutrons — reaction dies | Fuel rod in storage |\n' +
        '| k = 1 | **Critical** | Steady, sustained reaction — constant power | Nuclear power plant |\n' +
        '| k > 1 | **Supercritical** | Exponential growth — more neutrons each generation | Reactor startup / weapon |\n\n' +
        '**Analogy:** Imagine a forest fire. If each burning tree ignites exactly one neighbour (k = 1), the fire burns steadily. If each tree ignites two neighbours (k = 2), the fire doubles each generation and is out of control. If each tree ignites 0.5 neighbours on average (k = 0.5), the fire fizzles out.\n\n' +
        '**How reactors maintain k = 1:**\n\n' +
        '| Component | Material | Function |\n' +
        '|-----------|----------|----------|\n' +
        '| **Fuel rods** | Uranium oxide pellets (3–5% ²³⁵U) | Source of fission neutrons |\n' +
        '| **Moderator** | Water or graphite | Slows neutrons (slow neutrons cause more fissions) |\n' +
        '| **Control rods** | Boron or cadmium | Absorb excess neutrons — push in to slow, pull out to speed up |\n' +
        '| **Coolant** | Water | Carries heat away to steam turbines |\n' +
        '| **Containment** | Reinforced concrete + steel | Prevents radiation escape |\n\n' +
        '**Generation counting:** Starting from 1 neutron with k = 2, after 10 generations you have 2¹⁰ = 1,024 neutrons. After 80 generations (which happens in microseconds in a weapon): 2⁸⁰ ≈ 10²⁴ fissions — releasing the energy of ~20,000 tonnes of TNT. This exponential growth is why supercritical chain reactions are so devastatingly powerful.\n\n' +
        'India\'s nuclear programme began in the 1950s under Homi Bhabha. India operates 22 nuclear reactors (as of 2024), generating ~3% of the nation\'s electricity. The nearest reactor to NE India is the Kaiga plant in Karnataka, but proposed thorium-based reactors could one day use the thorium deposits found in Meghalaya\'s monazite sands.',
      intermediateContent:
        '**The six-factor formula**\n\n' +
        'The effective multiplication factor includes both nuclear and geometric factors:\n\n' +
        '`k_eff = η × f × p × ε × P_FNL × P_TNL`\n\n' +
        '| Factor | Name | Typical value | What it represents |\n' +
        '|--------|------|--------------|--------------------|\n' +
        '| η | Reproduction factor | 2.07 | Neutrons produced per absorption in fuel |\n' +
        '| f | Thermal utilisation | 0.71 | Fraction absorbed in fuel (vs moderator, structure) |\n' +
        '| p | Resonance escape | 0.87 | Fraction that avoid capture at intermediate energies |\n' +
        '| ε | Fast fission factor | 1.03 | Bonus from fast-neutron fissions in ²³⁸U |\n' +
        '| P_FNL | Fast non-leakage | ~0.97 | Fraction not escaping as fast neutrons |\n' +
        '| P_TNL | Thermal non-leakage | ~0.95 | Fraction not escaping as thermal neutrons |\n' +
        '| **k_eff** | **Product** | **~1.000** | **Critical** |\n\n' +
        '**The reactor period** T = l/(k−1), where l is the mean neutron generation time (~10⁻⁵ s for thermal reactors). If k = 1.001, T = 10⁻⁵/0.001 = 0.01 s — the power would double every ~7 ms without delayed neutrons.\n\n' +
        '**Delayed neutrons save the day:**\n\n' +
        '| Property | Prompt neutrons | Delayed neutrons |\n' +
        '|----------|----------------|------------------|\n' +
        '| Emission time | Within 10⁻¹⁴ s of fission | 0.2–55 s after fission |\n' +
        '| Fraction of total | ~99.35% | **~0.65%** (for U-235) |\n' +
        '| Effective generation time | ~10⁻⁵ s | ~0.1 s |\n\n' +
        'That tiny 0.65% fraction stretches the effective generation time from microseconds to ~0.1 s, making reactor control humanly possible. Without delayed neutrons, nuclear power would be uncontrollable.',
      advancedContent:
        '**Point kinetics equations**\n\n' +
        'The coupled differential equations governing reactor transients:\n\n' +
        '`dn/dt = (ρ − β)/Λ × n + Σ λᵢcᵢ`\n' +
        '`dcᵢ/dt = βᵢn/Λ − λᵢcᵢ`\n\n' +
        '| Symbol | Meaning |\n' +
        '|--------|--------|\n' +
        '| n | Neutron population |\n' +
        '| ρ = (k−1)/k | Reactivity |\n' +
        '| β | Total delayed neutron fraction (~0.0065 for U-235) |\n' +
        '| Λ | Prompt neutron generation time (~10⁻⁵ s) |\n' +
        '| cᵢ | Delayed neutron precursor concentration (6 groups) |\n' +
        '| λᵢ | Precursor decay constants (0.0124 to 3.01 s⁻¹) |\n\n' +
        '**Prompt criticality** occurs when ρ > β (i.e., k > 1/(1−β) ≈ 1.0065). The chain reaction then grows on the prompt timescale (~10⁻⁵ s) — 10,000× faster than delayed-neutron-controlled growth. This is what happened at Chernobyl: a positive void coefficient + operator error caused a prompt criticality excursion, doubling reactor power every few milliseconds.\n\n' +
        '**Inherent safety mechanisms:**\n\n' +
        '| Mechanism | Physics | Effect on reactivity |\n' +
        '|-----------|---------|---------------------|\n' +
        '| Doppler broadening | U-238 resonance capture increases with temperature | Negative (self-limiting) |\n' +
        '| Moderator temperature | Hot water is less dense → less moderation | Negative in PWRs |\n' +
        '| Void coefficient | Steam voids reduce moderation | Negative in PWRs, **positive** in RBMK (Chernobyl) |\n' +
        '| Xenon poisoning | ¹³⁵Xe has huge capture cross-section (2.6 × 10⁶ barns) | Negative (absorbs neutrons after shutdown) |\n\n' +
        'Modern PWR designs are inherently safe because *every* temperature coefficient is negative — if the reactor heats up, reactivity drops automatically. The Chernobyl RBMK design had a positive void coefficient at low power, making it the only reactor type where this specific accident sequence was possible.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The delayed neutron fraction for U-235 is only 0.65% — but without those delayed neutrons, nuclear reactors would be completely uncontrollable. That tiny fraction stretches response time from microseconds to tenths of a second.',
            'A single kg of uranium-235, fully fissioned, releases as much energy as burning 2,500 tonnes of coal — roughly 100 trainloads.',
            'India\'s thorium reserves (the world\'s largest) could power the country for centuries. Meghalaya\'s monazite sands contain significant thorium-232, which can be bred into fissile uranium-233 in advanced reactors.',
            'The Oklo natural reactor in Gabon, Africa, sustained nuclear fission 2 billion years ago — nature built a reactor long before humans did. Groundwater acted as the moderator, and the reaction self-regulated for hundreds of thousands of years.',
            'Xenon-135, a fission product, has the largest neutron capture cross-section of any known nuclide — 2.6 million barns. It builds up after shutdown and can prevent restart for 1–2 days (called "xenon poisoning").',
          ],
        },
      },
    },
  ],
};
