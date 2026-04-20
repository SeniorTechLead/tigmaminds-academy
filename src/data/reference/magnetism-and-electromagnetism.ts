import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'magnetism-and-electromagnetism',
  title: 'Magnetism & Electromagnetism',
  category: 'physics',
  icon: '🧲',
  tagline: "From compass needles to electric motors — the invisible force that shapes technology.",
  relatedStories: ['map-makers-granddaughter', 'little-train'],
  understand: [
    // ── Section 1: Magnetic Poles and Fields ───────────────────
    {
      title: 'Magnetic Poles and Fields',
      diagram: 'MagneticFieldLinesDiagram',
      beginnerContent:
        'Pick up two fridge magnets and try pushing them together. Sometimes they snap together eagerly. Flip one around and they shove each other apart with surprising force. What is going on?\n\n' +
        'Every magnet has two ends called **poles** — north (N) and south (S). The rule is simple:\n\n' +
        '| Combination | What happens | Analogy |\n' +
        '|-------------|-------------|---------|\n' +
        '| N meets S | **Attract** — pull together | Two puzzle pieces clicking into place |\n' +
        '| N meets N | **Repel** — push apart | Two people trying to walk through the same narrow door |\n' +
        '| S meets S | **Repel** — push apart | Same as above |\n\n' +
        'This looks a lot like electric charges (positive and negative), but there is one crucial difference: **you can never isolate a single magnetic pole.** Break a bar magnet in half and you get two smaller magnets, each with its own N and S. Break those in half again — same result. Even individual atoms have both poles. Physicists call this "the absence of magnetic monopoles."\n\n' +
        '**Magnetic fields** are invisible, but you can *see* them. Sprinkle iron filings on a sheet of paper placed over a magnet. The filings align along curved lines that:\n' +
        '- Emerge from the **north** pole\n' +
        '- Arc through the surrounding space\n' +
        '- Re-enter at the **south** pole\n' +
        '- **Never cross** each other\n\n' +
        'Where the lines are packed close together (near the poles), the field is strong. Where they spread apart, the field is weak.\n\n' +
        '**Try it above** — drag the iron filings around the magnet and watch how the field lines change.\n\n' +
        '| Magnet type | Field strength | Where you find it |\n' +
        '|-------------|---------------|-------------------|\n' +
        '| Fridge magnet | ~0.005 T | Kitchen door |\n' +
        '| Neodymium magnet | ~1 T | Headphones, hard drives |\n' +
        '| MRI machine | ~3 T | Hospital |\n' +
        '| Strongest lab magnet | ~45 T | National High Magnetic Field Lab, USA |\n\n' +
        '*T stands for **tesla**, the unit of magnetic field strength — named after Nikola Tesla.*\n\n' +
        '**Where does magnetism come from?** Moving electric charges. Inside every atom, electrons orbit the nucleus and spin on their axes — both motions create tiny magnetic fields. In most materials, these fields point in random directions and cancel out. But in **ferromagnetic** materials (iron, nickel, cobalt), groups of atoms spontaneously align into regions called **magnetic domains**. Apply an external field and the domains line up — the material becomes a magnet.\n\n' +
        '**Quick check:** If you heat an iron magnet above 770°C (its Curie temperature), it loses its magnetism permanently. Why?\n\n' +
        '*Because thermal vibrations shake the atoms so violently that the aligned domains become randomised again — the magnetic order is destroyed by heat energy.*',
      intermediateContent:
        '**Quantifying the magnetic field**\n\n' +
        'The magnetic field B around a long straight wire carrying current I at distance r is:\n\n' +
        '**B = μ₀I / (2πr)**\n\n' +
        'where μ₀ = 4π × 10⁻⁷ T·m/A is the permeability of free space.\n\n' +
        '**Worked example — field near a wire:**\n\n' +
        '| Given | Value |\n' +
        '|-------|-------|\n' +
        '| Current I | 10 A |\n' +
        '| Distance r | 5 cm = 0.05 m |\n\n' +
        'B = (4π × 10⁻⁷ × 10) / (2π × 0.05)\n' +
        'B = (4π × 10⁻⁶) / (0.1π)\n' +
        'B = **4 × 10⁻⁵ T** (about the same as Earth\'s field!)\n\n' +
        '**Force on a moving charge — the Lorentz force:**\n\n' +
        '**F = qv × B** (cross product), magnitude: F = qvB sin θ\n\n' +
        '| Quantity | Symbol | Unit |\n' +
        '|----------|--------|------|\n' +
        '| Charge | q | Coulombs (C) |\n' +
        '| Velocity | v | m/s |\n' +
        '| Magnetic field | B | Tesla (T) |\n' +
        '| Force | F | Newtons (N) |\n' +
        '| Angle between v and B | θ | degrees or radians |\n\n' +
        '**Worked example — proton in a magnetic field:**\n\n' +
        'A proton (q = 1.6 × 10⁻¹⁹ C, m = 1.67 × 10⁻²⁷ kg) moves at v = 10⁶ m/s perpendicular to a 1 T field.\n\n' +
        'Force: F = qvB sin 90° = 1.6 × 10⁻¹⁹ × 10⁶ × 1 = **1.6 × 10⁻¹³ N**\n\n' +
        'This force is always perpendicular to velocity, so it bends the path into a circle.\n\n' +
        'Radius of circular orbit: r = mv/(qB) = (1.67 × 10⁻²⁷ × 10⁶) / (1.6 × 10⁻¹⁹ × 1) = **0.0104 m ≈ 1 cm**\n\n' +
        'This principle is how **cyclotrons** and **mass spectrometers** work — bend charged particles in a magnetic field and measure the radius to find the mass.',
      advancedContent:
        '**Maxwell\'s equation for magnetism: ∇·B = 0**\n\n' +
        'The absence of magnetic monopoles is not just an observation — it is encoded in one of Maxwell\'s four equations. The divergence of B is always zero, meaning magnetic field lines never start or end at a point (unlike electric field lines, which start on positive charges and end on negative ones).\n\n' +
        '| Maxwell\'s equation | What it says about magnetism |\n' +
        '|--------------------|--------------------------|\n' +
        '| ∇·B = 0 | No magnetic monopoles — field lines form closed loops |\n' +
        '| ∇×E = −∂B/∂t | Changing B creates electric field (Faraday\'s law) |\n' +
        '| ∇×B = μ₀J + μ₀ε₀∂E/∂t | Current and changing E create magnetic field |\n\n' +
        '**Dirac\'s monopole hypothesis (1931):** If even one magnetic monopole existed anywhere in the universe, it would explain why electric charge is quantised in units of *e*. Specifically, the Dirac quantisation condition states: qₑqₘ = nℏ/2, where qₑ is the electric charge and qₘ is the monopole strength. Despite searches at CERN, in cosmic ray detectors, and in meteorites — no monopole has ever been found.\n\n' +
        '**Spin ice and emergent monopoles:** In certain rare-earth pyrochlore crystals (Dy₂Ti₂O₇, Ho₂Ti₂O₇), the crystal structure forces magnetic moments into a "two-in, two-out" ice rule on tetrahedra. Flipping one spin creates a pair of excitations that behave mathematically like isolated north and south monopoles connected by a Dirac string of flipped spins. These are **quasiparticles**, not fundamental monopoles, but they obey a magnetic Coulomb law: F ∝ qₘ₁qₘ₂/r².\n\n' +
        '**The Curie temperature as a phase transition:** Above T_C, the ferromagnetic → paramagnetic transition is second-order (continuous). Near T_C, the magnetisation M vanishes as M ∝ (T_C − T)^β, where β ≈ 0.326 in 3D (the Ising universality class). The 2D Ising model was solved exactly by Onsager (1944) — one of the great triumphs of statistical mechanics — giving T_C = 2J/(k_B ln(1+√2)) and β = 1/8.',
    },

    // ── Section 2: Earth\'s Magnetic Field ─────────────────────
    {
      title: 'Earth\'s Magnetic Field',
      diagram: 'EarthMagnetismDiagram',
      beginnerContent:
        'The Earth is a giant magnet — but not because it has a bar magnet inside it. The magnetism comes from the **geodynamo**: massive convection currents of molten iron and nickel churning in the outer core, 2,900 km below your feet. Moving metal = moving charges = magnetic field.\n\n' +
        'This field extends tens of thousands of kilometres into space, forming an invisible shield called the **magnetosphere**. Here is what it protects us from:\n\n' +
        '| Threat | What it is | What the magnetosphere does |\n' +
        '|--------|-----------|---------------------------|\n' +
        '| Solar wind | Stream of charged particles from the Sun | Deflects them around Earth |\n' +
        '| Cosmic rays | High-energy particles from deep space | Partially blocks them |\n' +
        '| Atmospheric stripping | Solar wind eroding the air | Prevents it (Mars lost its atmosphere this way) |\n\n' +
        '**Compasses and declination**\n\n' +
        'A compass needle aligns with Earth\'s magnetic field, pointing roughly toward geographic north. But "roughly" is important — the magnetic north pole is **not** at the geographic North Pole. The angle between true north and magnetic north is called **magnetic declination**.\n\n' +
        '| Location | Declination | Practical impact |\n' +
        '|----------|------------|------------------|\n' +
        '| Guwahati, Assam | ~0.5° west | Negligible for hiking, matters for surveying |\n' +
        '| Mumbai | ~0.6° west | Similar — India is lucky to be near zero |\n' +
        '| London | ~1° west | Small correction needed |\n' +
        '| Parts of Siberia | >20° east | Major correction needed for any navigation |\n\n' +
        'The magnetic north pole is currently in the Canadian Arctic and drifting toward Siberia at **55 km per year** — faster than ever recorded.\n\n' +
        '**Geomagnetic reversals:** The geological record shows that Earth\'s magnetic field has **flipped direction hundreds of times**. Iron minerals in cooling lava lock in the field direction like tiny frozen compasses. The last flip (the Brunhes-Matuyama reversal) was about 780,000 years ago. During a reversal, the field weakens and becomes chaotic for a few thousand years — disrupting navigation and increasing radiation at the surface.\n\n' +
        '**The aurora:** When solar wind particles do get through (near the poles, where field lines funnel inward), they excite atmospheric gases and produce the **aurora borealis** (north) and **aurora australis** (south) — shimmering curtains of green and red light.',
      intermediateContent:
        '**Measuring Earth\'s field**\n\n' +
        '| Parameter | Value | Notes |\n' +
        '|-----------|-------|-------|\n' +
        '| Surface field (equator) | ~25 μT | Weakest at the equator |\n' +
        '| Surface field (poles) | ~65 μT | Strongest near poles |\n' +
        '| Dipole moment | ~8 × 10²² A·m² | Tilted ~11.5° from rotation axis |\n' +
        '| Pole drift rate | ~55 km/year (2020) | Accelerated from ~15 km/year in 1990 |\n\n' +
        'The field is modelled by the **International Geomagnetic Reference Field (IGRF)**, updated every 5 years, which decomposes it into a dominant dipole component plus higher-order multipole terms.\n\n' +
        '**Worked example — compass correction in the Brahmaputra valley:**\n\n' +
        'A surveyor in Tezpur (declination ~0.4°W) takes a compass bearing of 045° (northeast). True bearing = compass bearing + declination (adding west declination as negative):\n\n' +
        'True bearing = 045° + (−0.4°) = **044.6°**\n\n' +
        'Over a 10 km traverse, a 0.4° error shifts the endpoint by:\n' +
        'd = 10,000 × tan(0.4°) = 10,000 × 0.00698 = **~70 m** — enough to miss a bridge site.\n\n' +
        '**Secular variation** (change over time) means magnetic maps must be updated regularly. The declination at any location can change by 0.1° or more per year. GPS has largely replaced magnetic navigation, but compasses remain essential backup for trekkers in remote areas of Arunachal Pradesh and Meghalaya where phone signals vanish.\n\n' +
        '**The geodynamo mechanism:** The Coriolis force organises convection in the outer core into columnar rolls (the Taylor-Proudman theorem). These rolls create helical fluid motions that amplify the magnetic field through **self-exciting dynamo action** — like a generator that powers its own electromagnet.',
      advancedContent:
        '**The MHD induction equation**\n\n' +
        'The geodynamo is governed by:\n\n' +
        '**∂B/∂t = ∇×(v×B) + η∇²B**\n\n' +
        'where v is fluid velocity and η = 1/(μ₀σ) is magnetic diffusivity.\n\n' +
        '| Term | Physical meaning | Dominates when... |\n' +
        '|------|-----------------|-------------------|\n' +
        '| ∇×(v×B) | Advection — fluid drags field lines | Rm >> 1 (fast flow) |\n' +
        '| η∇²B | Diffusion — field decays via Ohmic resistance | Rm << 1 (slow flow) |\n\n' +
        'The **magnetic Reynolds number** Rm = vL/η must exceed ~10 for self-sustaining dynamo action. Earth\'s outer core: Rm ≈ 200–1000.\n\n' +
        '**Geomagnetic reversals** show a power-law frequency distribution — short polarity intervals are far more common than long ones, suggesting a chaotic but deterministic process. During a reversal, paleomagnetic data show:\n' +
        '- Field weakens to ~10% of normal strength\n' +
        '- Develops complex multipolar geometry\n' +
        '- Re-establishes with opposite polarity over ~1,000–10,000 years\n\n' +
        'Glatzmaier & Roberts (1995) first reproduced spontaneous reversals in 3D numerical simulations. Modern simulations use 10¹² degrees of freedom on supercomputers but still cannot fully resolve the turbulent cascade in Earth\'s core, where the viscous dissipation scale is ~0.1 mm.',
      interactive: {
        type: 'true-false',
        props: {
          title: 'True or false? Test your knowledge of Earth\'s magnetic field',
          statements: [
            { text: 'Earth\'s magnetic north pole is exactly at the geographic North Pole.', answer: false, explanation: 'The magnetic north pole is in the Canadian Arctic, about 500 km from the geographic pole, and drifting toward Siberia at ~55 km/year.' },
            { text: 'A compass in Guwahati points almost exactly at true north (declination < 1°).', answer: true, explanation: 'Guwahati has a declination of only ~0.5° west — small enough to ignore for casual navigation.' },
            { text: 'Earth\'s magnetic field has never changed direction in the past.', answer: false, explanation: 'The field has reversed hundreds of times. The last reversal was ~780,000 years ago (Brunhes-Matuyama).' },
            { text: 'The magnetosphere protects Earth\'s atmosphere from being stripped away by the solar wind.', answer: true, explanation: 'Mars lost its atmosphere after its internal dynamo shut down — without a magnetosphere, the solar wind eroded the Martian air.' },
            { text: 'Earth\'s magnetic field is generated by a giant bar magnet at the core.', answer: false, explanation: 'The field is generated by convection currents of molten iron in the outer core — the geodynamo — not a permanent magnet.' },
          ],
        },
      },
    },

    // ── Section 3: Electromagnets ─────────────────────────────
    {
      title: 'Electromagnets',
      diagram: 'ElectromagnetDiagram',
      beginnerContent:
        'In 1820, Danish physicist Hans Christian Ørsted was preparing a lecture and noticed something strange: a compass needle **deflected** when he turned on a nearby electric current. This accidental observation changed physics forever — it was the first proof that electricity and magnetism are connected.\n\n' +
        '**From wire to magnet in three steps:**\n\n' +
        '| Step | What you do | What happens | Field strength |\n' +
        '|------|-----------|-------------|----------------|\n' +
        '| 1 | Run current through a straight wire | Circular magnetic field forms around the wire | Very weak |\n' +
        '| 2 | Coil the wire into a **solenoid** | Field concentrates inside the coil — looks like a bar magnet | Moderate |\n' +
        '| 3 | Wrap the solenoid around an **iron core** | Iron domains align, amplifying the field dramatically | **Strong** |\n\n' +
        'This is an **electromagnet** — a magnet you can switch on and off by controlling the current. The beauty is that you control three things:\n\n' +
        '| Factor | Effect | Analogy |\n' +
        '|--------|--------|---------|\n' +
        '| More turns of wire | Stronger field | More people pulling a rope = more force |\n' +
        '| More current | Stronger field | Each person pulling harder |\n' +
        '| Better core material | Stronger field | Using a lever instead of bare hands |\n\n' +
        '**Use the right-hand rule** to find the field direction: curl your right hand\'s fingers in the direction the current flows through the coil, and your thumb points toward the north pole.\n\n' +
        '**Electromagnets in the real world:**\n\n' +
        '| Device | How it uses electromagnets | Fun fact |\n' +
        '|--------|--------------------------|----------|\n' +
        '| Scrapyard crane | Massive coil lifts cars; cut current to drop them | Can lift 10,000 kg |\n' +
        '| MRI machine | Superconducting coils at −269°C produce 3 T field | 60,000× Earth\'s field |\n' +
        '| Doorbell | Small electromagnet pulls striker against bell | Invented 1831 |\n' +
        '| Hard disk drive | Tiny electromagnet flips microscopic magnetic regions | Each region = 1 bit of data |\n' +
        '| Maglev train | Electromagnets lift and propel the train | Shanghai Maglev: 431 km/h |\n\n' +
        'The Numaligarh Refinery uses massive electromagnetic cranes to lift steel components during maintenance. The electric locomotives running across the Brahmaputra valley on the NF Railway haul goods using powerful electromagnets in their traction motors — every one of them a spinning application of the same physics.',
      intermediateContent:
        '**The solenoid equation**\n\n' +
        'Inside an ideal solenoid: **B = μ₀nI**\n\n' +
        'where n = turns per metre and I = current in amperes.\n\n' +
        '**Worked example — building an electromagnet:**\n\n' +
        '| Given | Value |\n' +
        '|-------|-------|\n' +
        '| Total turns | 500 |\n' +
        '| Solenoid length | 0.2 m |\n' +
        '| Current | 3 A |\n\n' +
        'n = 500 / 0.2 = 2,500 turns/m\n\n' +
        'B = 4π × 10⁻⁷ × 2,500 × 3 = **9.42 × 10⁻³ T** (about 200× Earth\'s field)\n\n' +
        'Now add an iron core with relative permeability μ_r ≈ 5,000:\n\n' +
        'B = μ₀ × μ_r × n × I = 5,000 × 9.42 × 10⁻³ = **47.1 T** (theoretical maximum)\n\n' +
        'In practice, the iron **saturates** around 1.5–2 T — you can\'t align the domains any further.\n\n' +
        '| Core material | Relative permeability μ_r | Saturation field |\n' +
        '|---------------|--------------------------|------------------|\n' +
        '| Air | 1 | N/A |\n' +
        '| Soft iron | ~5,000 | ~1.5 T |\n' +
        '| Silicon steel | ~7,000 | ~2.0 T |\n' +
        '| Mu-metal (NiFe alloy) | ~100,000 | ~0.8 T |\n' +
        '| Supermalloy | ~1,000,000 | ~0.8 T |\n\n' +
        '**Worked example — MRI magnet energy:**\n\n' +
        'An MRI machine at 3 T with a 1 m³ bore volume stores energy:\n\n' +
        'E = B²V / (2μ₀) = 9 / (2 × 4π × 10⁻⁷) ≈ **3.6 × 10⁶ J** ≈ 1 kWh\n\n' +
        'That is enough energy to lift a car 300 m into the air. This is why MRI quench events (sudden loss of superconductivity) are dangerous — all that stored energy converts to heat instantly, boiling off the liquid helium coolant.',
      advancedContent:
        '**Superconducting electromagnets**\n\n' +
        'Superconductors carry current with **zero resistance** below their critical temperature T_c, enabling persistent currents and extremely strong fields.\n\n' +
        '| Type | Examples | T_c | Max field | Key property |\n' +
        '|------|---------|-----|-----------|-------------|\n' +
        '| Type I | Lead, Mercury, Tin | 4–7 K | <0.1 T | Complete Meissner effect (expels all flux) |\n' +
        '| Type II (LTS) | NbTi, Nb₃Sn | 10–18 K | 20+ T | Mixed state — flux vortices, each carrying Φ₀ = h/(2e) |\n' +
        '| Type II (HTS) | YBCO, REBCO | 77–93 K | 45+ T | Works at liquid nitrogen temp (cheaper cryogenics) |\n\n' +
        'Each flux vortex in a Type II superconductor carries exactly one **flux quantum**: Φ₀ = h/(2e) = 2.07 × 10⁻¹⁵ Wb. This quantisation is a direct consequence of the macroscopic quantum coherence of Cooper pairs.\n\n' +
        '**Frontier applications:**\n\n' +
        '| Project | Magnet type | Field | Purpose |\n' +
        '|---------|------------|-------|---------|\n' +
        '| ITER (fusion reactor) | Nb₃Sn + NbTi | 13 T (toroidal) | Confine 150 million °C plasma |\n' +
        '| MIT SPARC | REBCO HTS tape | 20 T (record, 2021) | Compact fusion tokamak |\n' +
        '| National High Mag Lab | Bitter (resistive) | 45 T (continuous) | Materials research |\n' +
        '| LHC (CERN) | NbTi | 8.3 T | Bend proton beams at 99.999999% of c |\n\n' +
        'The **Bitter electromagnet** design uses stacked copper plates with cooling channels between them. It achieves the highest continuous fields among resistive magnets but consumes enormous power (up to 33 MW for 45 T). Hybrid magnets combine a Bitter resistive outer coil with a superconducting inner coil to push even higher.',
    },

    // ── Section 4: Electric Motors and Generators ─────────────
    {
      title: 'Electric Motors and Generators',
      diagram: 'MotorGeneratorDiagram',
      beginnerContent:
        'Here is the magic trick of electromagnetism: **electricity can create motion, and motion can create electricity.** These are two sides of the same coin.\n\n' +
        '**The motor effect** (electricity → motion):\n\n' +
        'When a wire carrying current sits inside a magnetic field, it feels a **force**. Use **Fleming\'s left-hand rule**: point your First finger in the direction of the Field, your seCond finger in the direction of the Current, and your thuMb shows the direction of Motion (force).\n\n' +
        '| Part of a DC motor | What it does |\n' +
        '|--------------------|-------------|\n' +
        '| Permanent magnets | Provide steady magnetic field |\n' +
        '| Coil (armature) | Carries current; experiences force |\n' +
        '| Commutator | Reverses current every half-turn so coil keeps spinning |\n' +
        '| Brushes | Conduct current to the spinning commutator |\n\n' +
        '**Electromagnetic induction** (motion → electricity):\n\n' +
        'Michael Faraday discovered in 1831 that if you physically spin a coil of wire inside a magnetic field, a voltage appears across its ends. Spin faster or use a stronger magnet → more voltage. This is **Faraday\'s law**.\n\n' +
        '**The punchline:** A motor and a generator are the **same device running in opposite directions.**\n\n' +
        '| Device | Input | Output | Direction |\n' +
        '|--------|-------|--------|-----------|\n' +
        '| Electric motor | Electrical energy | Mechanical energy (rotation) | Electricity → motion |\n' +
        '| Generator | Mechanical energy (rotation) | Electrical energy | Motion → electricity |\n\n' +
        '**Where you see motors every day:**\n\n' +
        '| Device | Type of motor | Power |\n' +
        '|--------|--------------|-------|\n' +
        '| Ceiling fan | AC induction | ~75 W |\n' +
        '| Washing machine | Universal motor | ~500 W |\n' +
        '| Electric scooter | Brushless DC (BLDC) | ~2,000 W |\n' +
        '| Electric train (NF Railway) | AC traction motor | ~850,000 W |\n\n' +
        'The Kopili and Ranganadi hydroelectric projects are doing this on an industrial scale: water turbines spinning massive coils, converting the gravitational energy of monsoon rainfall into electricity for homes across Assam, Meghalaya, and Arunachal Pradesh. Every light you switch on in Guwahati is running on Faraday\'s 1831 discovery.',
      intermediateContent:
        '**Motor force calculation**\n\n' +
        'Force on a current-carrying wire: **F = BIL sin θ**\n\n' +
        '| Symbol | Meaning | Unit |\n' +
        '|--------|---------|------|\n' +
        '| B | Magnetic field strength | Tesla (T) |\n' +
        '| I | Current | Amperes (A) |\n' +
        '| L | Length of wire in the field | Metres (m) |\n' +
        '| θ | Angle between wire and field | Degrees |\n\n' +
        '**Worked example — DC motor torque:**\n\n' +
        '| Given | Value |\n' +
        '|-------|-------|\n' +
        '| Number of turns | 200 |\n' +
        '| Wire length per turn in field | 0.1 m |\n' +
        '| Current | 5 A |\n' +
        '| Field strength | 0.3 T |\n' +
        '| Coil radius | 0.05 m |\n\n' +
        'Force per turn per side: F = 0.3 × 5 × 0.1 = **0.15 N**\n' +
        'Total force (200 turns): 200 × 0.15 = **30 N**\n' +
        'Torque: τ = F × r = 30 × 0.05 = **1.5 N·m**\n\n' +
        '**Generator EMF calculation (Faraday\'s law):**\n\n' +
        '**ε = −N dΦ/dt**, where Φ = BA cos θ is magnetic flux.\n\n' +
        'For a generator spinning at angular velocity ω: peak EMF = NBAω\n\n' +
        '**Worked example — AC generator:**\n\n' +
        '| Given | Value |\n' +
        '|-------|-------|\n' +
        '| Turns N | 100 |\n' +
        '| Field B | 0.5 T |\n' +
        '| Coil area A | 0.04 m² |\n' +
        '| Speed | 3,000 RPM = 50 Hz |\n\n' +
        'ω = 2π × 50 = 314 rad/s\n\n' +
        'Peak EMF = 100 × 0.5 × 0.04 × 314 = **628 V**\n\n' +
        '**Back-EMF:** When a motor spins, it also acts as a generator, producing a voltage (back-EMF) that **opposes** the supply voltage. The actual current drawn is:\n\n' +
        'I = (V_supply − ε_back) / R\n\n' +
        'When the motor first starts (ε_back = 0), it draws maximum current — which is why starting a motor causes lights to dim momentarily.',
      advancedContent:
        '**Unifying the motor effect and induction: the Lorentz force**\n\n' +
        '**F = q(E + v × B)**\n\n' +
        'Both the motor effect and electromagnetic induction are manifestations of this single equation. A "force on a current-carrying wire" is just the Lorentz force summed over billions of moving charges in the wire.\n\n' +
        '**Motor types compared:**\n\n' +
        '| Motor type | Commutation | Efficiency | Maintenance | Key application |\n' +
        '|------------|------------|------------|-------------|----------------|\n' +
        '| Brushed DC | Mechanical (commutator) | 75–80% | High (brushes wear) | Toys, power tools |\n' +
        '| Brushless DC (BLDC) | Electronic (Hall sensors) | 85–95% | Low | Drones, EVs, hard drives |\n' +
        '| AC induction | None — rotating field drags rotor | 85–95% | Very low | Industrial machinery, fans |\n' +
        '| AC synchronous | None — rotor locks to field | 90–98% | Low | Grid-scale generators |\n' +
        '| Stepper | Electronic (sequenced pulses) | 60–80% | Low | 3D printers, CNC machines |\n\n' +
        '**Three-phase AC motors** use three overlapping sinusoidal currents 120° apart to create a smoothly rotating magnetic field. In an induction motor, this rotating field drags the rotor via electromagnetic induction in the rotor bars — the rotor always turns slightly slower than the field (the difference is called **slip**, typically 2–5%).\n\n' +
        '**Losses in electric motors:**\n\n' +
        '| Loss type | Cause | Mitigation |\n' +
        '|-----------|-------|------------|\n' +
        '| Copper losses (I²R) | Resistance of windings | Use thicker wire, better conductors |\n' +
        '| Iron losses (hysteresis) | Repeated magnetisation/demagnetisation of core | Use silicon steel laminations |\n' +
        '| Iron losses (eddy currents) | Circulating currents induced in core | Laminate the core into thin sheets |\n' +
        '| Mechanical losses | Friction in bearings, air resistance | Lubrication, streamlined design |\n\n' +
        '**Lenz\'s law** (the negative sign in Faraday\'s law) ensures that induced currents always oppose the change that caused them — a direct consequence of conservation of energy. This enables **regenerative braking** in electric vehicles: the motor runs as a generator during deceleration, converting kinetic energy back to electrical energy and storing it in the battery. The Tata Nexon EV recovers up to 15% of energy through regenerative braking.',
      interactive: {
        type: 'true-false',
        props: {
          title: 'True or false? Motors and generators',
          statements: [
            { text: 'An electric motor and a generator are essentially the same device running in opposite directions.', answer: true, explanation: 'A motor converts electrical energy to mechanical energy; a generator does the reverse. Same coil-in-a-field device, opposite energy flow.' },
            { text: 'Fleming\'s left-hand rule is used to find the direction of induced current in a generator.', answer: false, explanation: 'Fleming\'s LEFT-hand rule is for the motor effect (force on a current-carrying wire). For generators (induced current), use the RIGHT-hand rule.' },
            { text: 'Back-EMF in a motor opposes the supply voltage and limits the current.', answer: true, explanation: 'As the motor spins faster, back-EMF increases, reducing the net voltage and therefore the current drawn. At startup (no spin), current is maximum.' },
            { text: 'Regenerative braking converts heat energy back into electrical energy.', answer: false, explanation: 'Regenerative braking converts KINETIC energy (motion) back to electrical energy. The motor runs as a generator during deceleration.' },
            { text: 'Hydroelectric generators at Kopili dam use Faraday\'s law to produce electricity.', answer: true, explanation: 'Water turbines spin coils in magnetic fields, and the changing magnetic flux induces voltage — exactly Faraday\'s law of electromagnetic induction.' },
          ],
        },
      },
    },

    // ── Section 5: Electromagnetic Induction in Daily Life ────
    {
      title: 'Electromagnetic Induction in Daily Life',
      beginnerContent:
        '**Transformers: stepping voltage up and down**\n\n' +
        'Two coils of wire share an iron core. Alternating current in the primary coil creates a changing magnetic field that induces voltage in the secondary coil. The turn ratio determines the voltage ratio:\n\n' +
        '| Stage | Voltage | Purpose |\n' +
        '|-------|---------|--------|\n' +
        '| Power station | ~11,000 V | Generated by spinning turbines |\n' +
        '| Step-up transformer | ~400,000 V | Long-distance transmission (less current = less heat loss) |\n' +
        '| Step-down (substation) | ~33,000 V | Regional distribution |\n' +
        '| Step-down (local) | ~240 V | Enters your home |\n\n' +
        'Think of it like water: high pressure (voltage) through a thin pipe (low current) delivers the same power as low pressure through a fat pipe — but the thin pipe loses less energy to friction.\n\n' +
        '**Induction cooktops — heat without flame:**\n\n' +
        '| Feature | Gas stove | Induction cooktop |\n' +
        '|---------|-----------|-------------------|\n' +
        '| Energy efficiency | ~40% | ~85% |\n' +
        '| Heats the pot directly? | No — heats air, then pot | **Yes** — eddy currents heat the pot itself |\n' +
        '| Surface temperature | Very hot | Cool (the cooktop is not the heat source) |\n' +
        '| Works with aluminium pots? | Yes | No — needs iron/steel (ferromagnetic) |\n' +
        '| Speed to boil 1L water | ~8 minutes | ~4 minutes |\n\n' +
        'The cooktop generates a rapidly alternating magnetic field (20,000–100,000 Hz) that induces **eddy currents** in the base of a steel pot. These currents encounter the pot\'s resistance and generate heat — right where you need it.\n\n' +
        '**Wireless phone chargers** use the same principle at a smaller scale — a coil in the charging pad creates an alternating field that induces current in a coil inside your phone.\n\n' +
'Trace the electricity reaching a home in Guwahati: the Kopili dam and Subansiri Lower Project use massive generators — spinning coils driven by water turbines — to convert the gravitational potential energy of monsoon rainfall into electricity. The power then passes through a chain of transformers (stepped up at the dam, stepped down at substations) before reaching the wall socket at 240 V. Every lightbulb, every phone charger, every induction cooktop runs on Faraday\'s 1831 discovery.',
      intermediateContent:
        '**The transformer equation**\n\n' +
        'For an ideal (lossless) transformer:\n\n' +
        '**V_s / V_p = N_s / N_p = I_p / I_s**\n\n' +
        '| Symbol | Meaning |\n' +
        '|--------|--------|\n' +
        '| V_p, V_s | Primary and secondary voltage |\n' +
        '| N_p, N_s | Primary and secondary turns |\n' +
        '| I_p, I_s | Primary and secondary current |\n\n' +
        '**Worked example — step-down transformer:**\n\n' +
        '| Given | Value |\n' +
        '|-------|-------|\n' +
        '| Primary voltage V_p | 11,000 V |\n' +
        '| Secondary voltage V_s | 240 V |\n' +
        '| Secondary current I_s | 40 A |\n\n' +
        'Turns ratio: N_s / N_p = 240 / 11,000 = **1 : 45.8**\n' +
        'Primary current: I_p = I_s × (V_s / V_p) = 40 × (240 / 11,000) = **0.87 A**\n' +
        'Power: P = V_s × I_s = 240 × 40 = **9,600 W**\n\n' +
        '**Why high-voltage transmission saves energy:**\n\n' +
        'Cable power loss = I²R. Transmitting 1 MW:\n\n' +
        '| Transmission voltage | Current needed | Relative I²R loss |\n' +
        '|---------------------|---------------|-------------------|\n' +
        '| 240 V | 4,167 A | **2,800,000×** |\n' +
        '| 33,000 V | 30.3 A | 148× |\n' +
        '| 400,000 V | 2.5 A | **1×** (baseline) |\n\n' +
        'This is why power lines carry hundreds of thousands of volts — it reduces current by the same factor, and since losses go as I², the savings are enormous.\n\n' +
        '**Induction cooktop physics:**\n\n' +
        'The skin effect concentrates induced currents in a thin surface layer. The skin depth is:\n\n' +
        '**δ = √(2ρ / ωμ)**\n\n' +
        'For iron at 25 kHz: δ ≈ 0.1 mm — virtually all heating occurs in the bottom 0.1 mm of the pot, maximising efficiency.',
      advancedContent:
        '**Maxwell\'s crowning achievement**\n\n' +
        'Maxwell added the **displacement current** term ε₀∂E/∂t to Ampere\'s law, completing the four equations that unify electricity and magnetism:\n\n' +
        '| Equation | Differential form | Physical meaning |\n' +
        '|----------|------------------|------------------|\n' +
        '| Gauss\'s law (E) | ∇·E = ρ/ε₀ | Charges create electric fields |\n' +
        '| Gauss\'s law (B) | ∇·B = 0 | No magnetic monopoles |\n' +
        '| Faraday\'s law | ∇×E = −∂B/∂t | Changing B creates E |\n' +
        '| Ampere-Maxwell law | ∇×B = μ₀J + μ₀ε₀∂E/∂t | Current and changing E create B |\n\n' +
        'From these equations, Maxwell derived that electromagnetic waves propagate at speed:\n\n' +
        '**c = 1/√(μ₀ε₀) = 299,792,458 m/s** — exactly the measured speed of light.\n\n' +
        'This was the first theoretical prediction that **light is an electromagnetic wave**.\n\n' +
        '**Energy in electromagnetic fields:**\n\n' +
        'The **Poynting vector** S = (1/μ₀) E × B gives the power flux (W/m²) carried by electromagnetic radiation.\n\n' +
        '**Wireless power transfer (WPT) — beyond Faraday:**\n\n' +
        '| Technology | Frequency | Range | Efficiency | Standard/Research |\n' +
        '|------------|-----------|-------|------------|-------------------|\n' +
        '| Qi charging pad | 100–205 kHz | Contact | >80% | Qi standard (WPC) |\n' +
        '| Resonant coupling (MIT, 2007) | ~10 MHz | 2 metres | ~40% | Kurs et al. |\n' +
        '| Microwave WPT | ~2.4 GHz | Kilometres | ~50% (theoretical) | Space-based solar power |\n\n' +
        'Resonant inductive coupling tunes two LC circuits to the same frequency f₀ = 1/(2π√(LC)). At resonance, energy oscillates between the coupled coils with minimal radiative loss. The coupling coefficient k determines transfer efficiency: k = M/√(L₁L₂), where M is mutual inductance. For the Qi standard, k ≈ 0.3–0.5 at contact; MIT\'s strongly coupled resonances achieved effective k ≈ 0.05 at 2 metres — potentially replacing power cables in hospitals and factories.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each device to the electromagnetic principle it uses',
          pairs: [
            ['Transformer', 'Mutual induction — changing current in one coil induces voltage in another'],
            ['Electric motor', 'Motor effect — current-carrying wire in a magnetic field experiences force'],
            ['Generator', 'Electromagnetic induction — spinning coil in a magnetic field produces voltage'],
            ['Induction cooktop', 'Eddy currents — alternating magnetic field induces currents in metal that generate heat'],
            ['Wireless charger', 'Mutual induction at short range — alternating field couples two coils without contact'],
          ],
        },
      },
    },
  ],
};
