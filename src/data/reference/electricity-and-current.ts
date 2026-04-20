import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'electricity-and-current',
  title: 'Electricity & Current',
  category: 'physics',
  tags: ['math', 'engineering'],
  keywords: ['ohms law', 'resistance', 'capacitance', 'inductance', 'kirchhoff', 'coulomb', 'voltage divider'],
  icon: '⚡',
  tagline: 'How electrons flow, circuits work, and lightning strikes over the Brahmaputra.',
  relatedStories: ['firefly-festival-of-majuli', 'festival-lights', 'fireflies-dont-burn'],
  understand: [
    // ── Section 1: Electric Charge ─────────────────────────────
    {
      title: 'What Is Electric Charge?',
      diagram: 'StaticElectricityDiagram',
      beginnerContent:
        'Every atom is built from three kinds of particles:\n\n' +
        '| Particle | Charge | Location | Mass |\n' +
        '|----------|--------|----------|------|\n' +
        '| **Proton** | Positive (+) | Nucleus (centre) | 1.67 × 10⁻²⁷ kg |\n' +
        '| **Neutron** | None (0) | Nucleus (centre) | 1.67 × 10⁻²⁷ kg |\n' +
        '| **Electron** | Negative (−) | Orbiting outside | 9.11 × 10⁻³¹ kg |\n\n' +
        'In most everyday objects, protons and electrons are equal in number, so the object is **electrically neutral**. But electrons sit on the outer edges of atoms and can be knocked loose relatively easily — rub a balloon on your hair, and electrons transfer from your hair to the balloon, leaving your hair positively charged and the balloon negatively charged.\n\n' +
        'This transfer of electrons is the basis of **static electricity**. The fundamental rule is simple:\n\n' +
        '- **Like charges repel** — positive pushes positive away, negative pushes negative away\n' +
        '- **Unlike charges attract** — positive pulls negative toward it\n\n' +
        'The force between charges follows **Coulomb\'s law** — it is proportional to the product of the two charges and inversely proportional to the square of the distance between them. Double the distance and the force drops to one quarter.\n\n' +
        '**The triboelectric series** ranks materials by how easily they gain or lose electrons when rubbed together:\n\n' +
        '| Tends to LOSE electrons (become +) | Tends to GAIN electrons (become −) |\n' +
        '|--------------------------------------|-------------------------------------|\n' +
        '| Human hair | Rubber |\n' +
        '| Glass | Teflon |\n' +
        '| Nylon | PVC |\n' +
        '| Wool | Polyethylene |\n' +
        '| Silk | Polystyrene |\n\n' +
        'This is why rubbing a plastic comb through your hair lets the comb pick up tiny scraps of paper — the comb acquires a net negative charge that induces a positive charge on the near side of each paper scrap, creating an attractive force strong enough to overcome gravity.\n\n' +
        '**Try the diagram above** — rub different materials together and watch electrons transfer.',
      intermediateContent:
        'Coulomb\'s law gives the exact force:\n\n' +
        '> **F = kq₁q₂ / r²**\n\n' +
        'where k = 8.99 × 10⁹ N·m²/C² and q is charge in coulombs. The elementary charge is **e = 1.602 × 10⁻¹⁹ C** — the charge of one proton (or the magnitude of one electron\'s charge).\n\n' +
        '**Worked example — two point charges:**\n\n' +
        'Two charges of +1 μC and −2 μC are separated by 0.5 m. Find the force.\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Identify values | q₁ = 1 × 10⁻⁶ C, q₂ = 2 × 10⁻⁶ C, r = 0.5 m |\n' +
        '| Apply formula | F = 8.99×10⁹ × (1×10⁻⁶ × 2×10⁻⁶) / (0.5)² |\n' +
        '| Simplify numerator | = 8.99×10⁹ × 2×10⁻¹² = 0.01798 |\n' +
        '| Divide by r² | = 0.01798 / 0.25 = **0.072 N (attractive)** |\n\n' +
        'The electric field **E = F/q = kQ/r²** has units N/C or V/m.\n\n' +
        '**Worked example — field from a point charge:**\n\n' +
        'At 1 m from a +1 μC point charge: E = 8.99×10⁹ × 10⁻⁶ / 1² = **8,990 V/m**.\n\n' +
        '| Quantity | Symbol | Unit | Meaning |\n' +
        '|----------|--------|------|---------|\n' +
        '| Charge | q | Coulomb (C) | Amount of electric charge |\n' +
        '| Force | F | Newton (N) | Push or pull between charges |\n' +
        '| Electric field | E | V/m or N/C | Force per unit charge |\n' +
        '| Potential | V | Volt (V) | Energy per unit charge |\n\n' +
        'Triboelectric charging transfers roughly 10⁻⁹ to 10⁻⁶ C, producing voltages of thousands of volts but negligible current — which is why a static shock stings but doesn\'t kill.',
      advancedContent:
        'Coulomb\'s law is the electrostatic limit of the full electromagnetic theory described by **Maxwell\'s equations**. The permittivity of free space ε₀ = 8.854 × 10⁻¹² F/m relates to k by:\n\n' +
        '> **k = 1 / (4πε₀)**\n\n' +
        '| Maxwell\'s Equation | Name | What it says |\n' +
        '|--------------------|------|-------------|\n' +
        '| ∮**E**·d**A** = Q/ε₀ | Gauss\'s law (electric) | Charges create electric fields |\n' +
        '| ∮**B**·d**A** = 0 | Gauss\'s law (magnetic) | No magnetic monopoles |\n' +
        '| ∮**E**·d**l** = −dΦ_B/dt | Faraday\'s law | Changing magnetic fields create electric fields |\n' +
        '| ∮**B**·d**l** = μ₀I + μ₀ε₀ dΦ_E/dt | Ampere-Maxwell law | Currents and changing electric fields create magnetic fields |\n\n' +
        'In quantum electrodynamics (QED), electromagnetic forces are mediated by virtual photon exchange between charged particles. The electric field is the gradient of the scalar potential: **E = −∇V**.\n\n' +
        'Gauss\'s law provides an elegant way to calculate fields for symmetric charge distributions — a uniformly charged sphere behaves exactly like a point charge from outside. For a uniformly charged infinite plane: **E = σ / (2ε₀)**, independent of distance.\n\n' +
        'Recent research (2019, *Nature*) showed that even identical materials can develop charge differences due to nanoscale surface roughness and local electron energy variations, challenging the classical contact-potential model of triboelectric charging.',
    },

    // ── Section 2: Current, Voltage, and Resistance ────────────
    {
      title: 'Current, Voltage, and Resistance',
      diagram: 'OhmsLawDiagram',
      beginnerContent:
        '**Electric current** is the flow of electric charge through a conductor — typically electrons moving through a metal wire. Think of it like water flowing through a pipe.\n\n' +
        '| Electrical concept | Water analogy | Unit |\n' +
        '|--------------------|---------------|------|\n' +
        '| **Voltage** (V) | Water pressure from a tank on a hill | Volt (V) |\n' +
        '| **Current** (I) | Flow rate of water through the pipe | Ampere (A) |\n' +
        '| **Resistance** (R) | Narrowness of the pipe | Ohm (Ω) |\n\n' +
        'Current is measured in **amperes** (amps, A), where one amp means about 6.24 × 10¹⁸ electrons passing a point every second. In a metal wire, individual electrons actually drift quite slowly — only about 0.1 mm per second in a typical household wire — but the electric field that pushes them propagates at nearly the speed of light, which is why a light turns on the instant you flip the switch.\n\n' +
        '**Voltage** (measured in volts, V) is the electrical pressure — the force that pushes electrons through a circuit:\n\n' +
        '| Source | Voltage | Use |\n' +
        '|--------|---------|-----|\n' +
        '| AA battery | 1.5 V | Torch, remote control |\n' +
        '| Car battery | 12 V | Headlights, starter motor |\n' +
        '| USB charger | 5 V | Phone charging |\n' +
        '| Indian wall socket | 240 V | Household appliances |\n' +
        '| High-tension power line | 400,000 V | Long-distance transmission |\n\n' +
        '**Resistance** (measured in ohms, Ω) is the opposition a material offers to the flow of current:\n\n' +
        '| Material | Resistance | Category |\n' +
        '|----------|-----------|----------|\n' +
        '| Silver, copper | Very low | Conductors |\n' +
        '| Silicon, germanium | Medium | Semiconductors |\n' +
        '| Rubber, glass, dry air | Very high | Insulators |\n\n' +
        '**Ohm\'s law** ties these three quantities together: **V = I × R**. If you know any two, you can calculate the third.\n\n' +
        '**Quick check:** A 240V supply pushes current through a 60Ω heater. How much current flows?\n\n' +
        '*I = V / R = 240 / 60 = **4 amps***',
      intermediateContent:
        '**Ohm\'s law in full: V = IR**\n\n' +
        'From this single equation, three useful forms:\n\n' +
        '| Find... | Formula | Example |\n' +
        '|---------|---------|--------|\n' +
        '| Voltage | V = IR | 3 A through 4 Ω → 12 V |\n' +
        '| Current | I = V/R | 12 V across 3 Ω → 4 A |\n' +
        '| Resistance | R = V/I | 240 V, 10 A → 24 Ω |\n\n' +
        '**Power** (rate of energy use) has three equivalent forms:\n\n' +
        '| Formula | When to use it |\n' +
        '|---------|---------------|\n' +
        '| **P = IV** | When you know current and voltage |\n' +
        '| **P = I²R** | When you know current and resistance |\n' +
        '| **P = V²/R** | When you know voltage and resistance |\n\n' +
        '**Worked example — car headlight:**\n\n' +
        'A 12V car battery powers a headlight with 3Ω resistance.\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Current | I = V/R = 12/3 = **4 A** |\n' +
        '| Power | P = I²R = 4² × 3 = **48 W** per headlight |\n' +
        '| Energy in 1 hour | E = Pt = 48 × 3600 = **172,800 J** = 172.8 kJ |\n\n' +
        '**Electron drift velocity** is surprisingly slow:\n\n' +
        '> **v_d = I / (nAe)**\n\n' +
        'where n is the free-electron density (~8.5 × 10²⁸/m³ for copper), A is cross-sectional area, e is electron charge.\n\n' +
        '**Worked example:** For 4 A through a 2 mm² copper wire:\n\n' +
        '`v_d = 4 / (8.5×10²⁸ × 2×10⁻⁶ × 1.6×10⁻¹⁹) = 0.15 mm/s`\n\n' +
        'That\'s slower than a snail! Yet the light turns on instantly because the electric field propagates at ~2/3 the speed of light — like pushing one end of a full pipe and water immediately flowing out the other end.\n\n' +
        '**Resistivity** (ρ) relates resistance to geometry: **R = ρL/A**\n\n' +
        '| Material | Resistivity (Ω·m) | Use |\n' +
        '|----------|-------------------|-----|\n' +
        '| Copper | 1.68 × 10⁻⁸ | House wiring |\n' +
        '| Aluminium | 2.65 × 10⁻⁸ | Power lines (lighter, cheaper) |\n' +
        '| Nichrome | 1.10 × 10⁻⁶ | Heating elements |\n' +
        '| Silicon | 6.40 × 10² | Semiconductors |\n' +
        '| Glass | ~10¹⁰ | Insulation |',
      advancedContent:
        'Ohm\'s law is an empirical approximation — it fails for semiconductors, superconductors, and nonlinear devices like diodes.\n\n' +
        '**The Drude model** provides a microscopic origin. Electrons accelerate under the electric field E, then collide with lattice ions, reaching an average drift velocity:\n\n' +
        '> **v_d = eEτ/m**\n\n' +
        'where τ is the mean collision time (~2.5 × 10⁻¹⁴ s for copper). This yields conductivity **σ = ne²τ/m** and Ohm\'s law emerges as **J = σE**.\n\n' +
        '| Model | Prediction | Accuracy |\n' +
        '|-------|-----------|----------|\n' +
        '| **Drude** (classical) | σ = ne²τ/m | Correct for metals at room temperature |\n' +
        '| **Sommerfeld** (quantum) | Uses Fermi-Dirac distribution for electrons | Explains specific heat discrepancy |\n' +
        '| **Band theory** | Conductivity depends on band gap | Explains semiconductors and insulators |\n' +
        '| **BCS theory** | Cooper pairs with zero resistance | Explains superconductivity |\n\n' +
        '**Superconductivity:** Below a critical temperature, some materials enter a superconducting state with exactly zero resistance — current flows indefinitely without energy loss.\n\n' +
        '| Material | Critical temperature | Type |\n' +
        '|----------|---------------------|------|\n' +
        '| Mercury | 4.2 K | Type I |\n' +
        '| Niobium-tin (Nb₃Sn) | 18.3 K | Type II |\n' +
        '| YBCO (YBa₂Cu₃O₇) | 93 K | High-Tc (above liquid N₂) |\n' +
        '| H₃S (under 150 GPa) | 203 K | Pressure-induced |\n\n' +
        'BCS theory (1957) explains this via Cooper pairs: electrons form bound pairs mediated by lattice phonon exchange, creating a macroscopic quantum state that flows without scattering. The 2023 room-temperature superconductor claims (LK-99) were debunked, but the search continues — true room-temperature superconductors would revolutionize power transmission, maglev transport, and quantum computing.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the electrical quantity to its unit and meaning',
          pairs: [
            ['Voltage (V)', 'Measured in Volts — electrical pressure that pushes current'],
            ['Current (I)', 'Measured in Amperes — rate of charge flow (electrons per second)'],
            ['Resistance (R)', 'Measured in Ohms — opposition to current flow'],
            ['Power (P)', 'Measured in Watts — rate of energy conversion (P = IV)'],
            ['Resistivity (ρ)', 'Measured in Ω·m — intrinsic property of the material itself'],
          ],
        },
      },
    },

    // ── Section 3: Series and Parallel Circuits ────────────────
    {
      title: 'Series and Parallel Circuits',
      diagram: 'SeriesParallelCircuitDiagram',
      beginnerContent:
        'There are two fundamental ways to connect components in a circuit:\n\n' +
        '**Series circuit** — components connected end-to-end in a single loop:\n\n' +
        '| Property | Series behaviour |\n' +
        '|----------|------------------|\n' +
        '| Current | **Same** through every component |\n' +
        '| Voltage | **Shared** — each component gets a fraction |\n' +
        '| Resistance | **Adds up**: R_total = R₁ + R₂ + R₃ |\n' +
        '| If one breaks | **Entire** circuit stops |\n' +
        '| Example | Old Christmas tree lights — one bulb fails, all go dark |\n\n' +
        '**Parallel circuit** — components connected across the same two points:\n\n' +
        '| Property | Parallel behaviour |\n' +
        '|----------|--------------------|\n' +
        '| Current | **Splits** — more flows through lower resistance |\n' +
        '| Voltage | **Same** across every branch |\n' +
        '| Resistance | **Decreases**: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃ |\n' +
        '| If one breaks | **Others** keep working |\n' +
        '| Example | House wiring — one light off, rest stay on |\n\n' +
        'This is how wiring works in homes across Assam and everywhere else: every socket and light is connected in parallel to the 240V supply, so turning off one light does not affect the others.\n\n' +
        'Real circuits usually combine both arrangements. A string of decorative LED lights at Bihu celebrations might have groups of LEDs in series (to share the voltage), with multiple groups wired in parallel (so one failed group does not kill the rest).\n\n' +
        '**Quick check:** You have three 6Ω bulbs. In series: R_total = 6 + 6 + 6 = **18Ω**. In parallel: 1/R = 1/6 + 1/6 + 1/6 = 3/6, so R_total = **2Ω**. The parallel combination has 9× less resistance!',
      intermediateContent:
        '**Series circuits — worked example:**\n\n' +
        'Three resistors of 4Ω, 6Ω, and 10Ω in series with a 12V battery.\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Total resistance | R = 4 + 6 + 10 | **20 Ω** |\n' +
        '| Total current | I = V/R = 12/20 | **0.6 A** (same everywhere) |\n' +
        '| Voltage across 4Ω | V = IR = 0.6 × 4 | **2.4 V** |\n' +
        '| Voltage across 6Ω | V = IR = 0.6 × 6 | **3.6 V** |\n' +
        '| Voltage across 10Ω | V = IR = 0.6 × 10 | **6.0 V** |\n' +
        '| Check: voltages sum | 2.4 + 3.6 + 6.0 | **12 V** ✓ |\n\n' +
        '**Parallel circuits — worked example:**\n\n' +
        'Two 6Ω resistors in parallel with a 12V battery.\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Combined resistance | 1/R = 1/6 + 1/6 = 2/6 | **3 Ω** |\n' +
        '| Total current | I = V/R = 12/3 | **4 A** |\n' +
        '| Current in each branch | I = V/R = 12/6 | **2 A** each |\n' +
        '| Check: branch currents sum | 2 + 2 | **4 A** ✓ |\n' +
        '| Total power | P = VI = 12 × 4 | **48 W** |\n\n' +
        '**Kirchhoff\'s laws** formalize these rules:\n\n' +
        '| Law | Statement | Based on |\n' +
        '|-----|----------|----------|\n' +
        '| **KCL** (Current Law) | Currents entering a junction = currents leaving | Conservation of charge |\n' +
        '| **KVL** (Voltage Law) | Voltages around any closed loop sum to zero | Conservation of energy |\n\n' +
        '**Voltage divider** — a practical series circuit:\n\n' +
        'Two resistors R₁ and R₂ in series. The voltage across R₂ is:\n\n' +
        '> **V_out = V_in × R₂ / (R₁ + R₂)**\n\n' +
        '**Worked example:** R₁ = 10 kΩ, R₂ = 20 kΩ, V_in = 5V.\n' +
        'V_out = 5 × 20,000 / (10,000 + 20,000) = 5 × 2/3 = **3.33V**.\n\n' +
        'Light-dependent resistors (LDRs) in voltage dividers are used in street lights across Guwahati — resistance drops as light increases, automatically switching off the lamp at dawn.',
      advancedContent:
        'Kirchhoff\'s laws extend to complex networks unsolvable by simple series-parallel reduction.\n\n' +
        '**Analysis techniques for complex circuits:**\n\n' +
        '| Method | When to use | Procedure |\n' +
        '|--------|------------|----------|\n' +
        '| **Mesh analysis** | Circuits with multiple loops | Assign loop currents, write KVL for each mesh |\n' +
        '| **Nodal analysis** | Circuits with multiple nodes | Assign node voltages, write KCL for each node |\n' +
        '| **Superposition** | Multiple independent sources | Find response from each source alone, add them |\n' +
        '| **Thevenin\'s theorem** | Simplify to load analysis | Reduce to V_Th in series with R_Th |\n' +
        '| **Norton\'s theorem** | Dual of Thevenin | Reduce to I_N in parallel with R_N |\n\n' +
        'Thevenin and Norton are equivalent: **V_Th = I_N × R_N**.\n\n' +
        'For **AC circuits**, impedance replaces resistance:\n\n' +
        '> **Z = R + jX**\n\n' +
        'where j = √(−1) and X is reactance.\n\n' +
        '| Component | Impedance | Phase |\n' +
        '|-----------|-----------|-------|\n' +
        '| Resistor | Z = R | Current in phase with voltage |\n' +
        '| Capacitor | Z = −j/(ωC) = 1/(jωC) | Current leads voltage by 90° |\n' +
        '| Inductor | Z = jωL | Current lags voltage by 90° |\n\n' +
        'The complex power **S = P + jQ** separates real power (watts, actually consumed) from reactive power (VAR, stored and returned by capacitors and inductors). Power factor = P/|S| = cos(φ). India\'s power grid penalizes industrial consumers with power factor below 0.85 — capacitor banks are installed to correct it.\n\n' +
        '**Maximum power transfer theorem:** A load receives maximum power when its impedance equals the conjugate of the source impedance: **Z_load = Z_source***.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the circuit property to its behaviour',
          pairs: [
            ['Series: current', 'Same through all components'],
            ['Series: voltage', 'Divided proportionally across components'],
            ['Parallel: current', 'Splits across branches (more through lower R)'],
            ['Parallel: voltage', 'Same across all branches'],
            ['Series: total R', 'Sum of individual resistances (R₁ + R₂ + R₃)'],
            ['Parallel: total R', 'Less than the smallest individual resistance'],
          ],
        },
      },
    },

    // ── Section 4: Static Electricity and Lightning ────────────
    {
      title: 'Static Electricity and Lightning',
      beginnerContent:
        'Static electricity builds up whenever two materials rub together and electrons transfer from one to the other. You experience this when you walk across a carpet in dry weather and get a shock touching a metal doorknob — your body accumulated excess electrons, and they discharge through the small air gap to the metal.\n\n' +
        'That tiny spark is a miniature version of **lightning**.\n\n' +
        '**How lightning forms inside a thundercloud:**\n\n' +
        '| Step | What happens |\n' +
        '|------|-------------|\n' +
        '| 1 | Strong updrafts carry water droplets and ice crystals upward |\n' +
        '| 2 | Gravity pulls larger hailstones downward |\n' +
        '| 3 | Collisions strip electrons from ice → deposited on hail |\n' +
        '| 4 | Cloud top becomes **positive**, bottom becomes **negative** |\n' +
        '| 5 | Negative cloud bottom induces **positive** charge on ground below |\n' +
        '| 6 | When the electric field reaches ~3 million V/m, air breaks down |\n' +
        '| 7 | A conducting channel forms — **lightning bolt** |\n\n' +
        '**Lightning in numbers:**\n\n' +
        '| Property | Value |\n' +
        '|----------|-------|\n' +
        '| Current | ~30,000 amps (peak up to 200,000 A) |\n' +
        '| Temperature | 30,000°C (5× hotter than the Sun\'s surface) |\n' +
        '| Duration | ~0.001 seconds per stroke |\n' +
        '| Speed of return stroke | ~100 million m/s (1/3 speed of light) |\n' +
        '| Voltage | 100–300 million volts |\n\n' +
        'The explosive heating of air creates the shockwave we hear as **thunder**. Sound travels at ~343 m/s, so count the seconds between flash and thunder, divide by 3 — that\'s the distance in kilometres.\n\n' +
        'During the monsoon season, the Brahmaputra valley sees some of India\'s highest lightning densities. The wide river surface and surrounding wetlands create ideal conditions: intense surface heating drives powerful updrafts, and abundant moisture fuels massive cumulonimbus clouds towering 15 km high. The region records over 20 lightning deaths per year — making lightning safety knowledge genuinely life-saving.\n\n' +
        '**Safety rule of thumb:** When you hear thunder, go indoors. The safest place is inside a building or a car (the metal shell acts as a Faraday cage).',
      intermediateContent:
        'The electric field required to ionize air (dielectric breakdown) is approximately **3 × 10⁶ V/m**.\n\n' +
        '**Worked example — lightning energy:**\n\n' +
        '| Quantity | Value |\n' +
        '|----------|-------|\n' +
        '| Potential difference | V ≈ 3 × 10⁸ V |\n' +
        '| Average current | I ≈ 5,000 A |\n' +
        '| Duration | t ≈ 0.001 s |\n' +
        '| Charge transferred | Q = It = 5,000 × 0.001 = **5 C** |\n' +
        '| Energy | E = VQ = 3×10⁸ × 5 = **1.5 × 10⁹ J** |\n' +
        '| In kWh | 1.5×10⁹ / 3.6×10⁶ = **~400 kWh** |\n\n' +
        'That\'s enough to power an average Indian home for about two weeks! But the discharge is too brief and unpredictable to harvest efficiently.\n\n' +
        '**Types of lightning:**\n\n' +
        '| Type | Description | Frequency |\n' +
        '|------|------------|----------|\n' +
        '| Cloud-to-ground (CG) | Strikes the surface — the dangerous kind | ~25% |\n' +
        '| Intra-cloud (IC) | Discharge within the same cloud | ~75% |\n' +
        '| Cloud-to-cloud (CC) | Between two separate clouds | Rare |\n' +
        '| Positive CG (+CG) | From positive cloud top — 10× more powerful | ~5% of CG |\n\n' +
        '**The thunder-distance method:**\n\n' +
        '| Seconds between flash and thunder | Distance |\n' +
        '|----------------------------------|----------|\n' +
        '| 3 seconds | ~1 km |\n' +
        '| 6 seconds | ~2 km |\n' +
        '| 15 seconds | ~5 km |\n' +
        '| 30 seconds | ~10 km (you\'re still at risk up to this range) |\n\n' +
        '**The 30-30 rule:** If the flash-to-thunder interval is under 30 seconds, seek shelter. Stay sheltered until 30 minutes after the last thunder.',
      advancedContent:
        '**The stepped leader process:**\n\n' +
        '| Stage | Speed | Description |\n' +
        '|-------|-------|------------|\n' +
        '| **Stepped leader** | ~10⁶ m/s | Invisible, negatively charged channel descends in ~50 m steps |\n' +
        '| **Streamers** | ~10⁵ m/s | Positive channels rise from pointed objects (trees, towers, lightning rods) |\n' +
        '| **Connection** | — | Leader and streamer meet at ~50–100 m above ground |\n' +
        '| **Return stroke** | ~10⁸ m/s | Bright flash races upward — this is what you see |\n' +
        '| **Dart leaders** | ~10⁷ m/s | Subsequent strokes along the same channel (cause flickering) |\n\n' +
        '**Transient luminous events (TLEs)** above thunderstorms:\n\n' +
        '| Event | Altitude | Colour | Cause |\n' +
        '|-------|----------|--------|-------|\n' +
        '| **Sprites** | 40–90 km | Red | Electric field of strong +CG strokes |\n' +
        '| **Elves** | ~90 km | Expanding ring | Electromagnetic pulse from lightning |\n' +
        '| **Blue jets** | 15–40 km | Blue | Upward discharge from storm tops |\n' +
        '| **Gigantic jets** | 15–90 km | Blue-red | Bridge from cloud top to ionosphere |\n\n' +
        'Research using high-speed cameras (2018, *Geophysical Research Letters*) revealed that lightning initiates from narrow bipolar events — tiny (~1 m) discharges inside the cloud that cascade into full channels.\n\n' +
        '**The global electric circuit:** Fair-weather electric field at Earth\'s surface is ~100 V/m downward, maintained by ~1,800 thunderstorms active at any time worldwide, driving a ~1 kA current through the atmosphere. The ionosphere acts as the return conductor.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each lightning stage to what happens',
          pairs: [
            ['Step 1: Charge separation', 'Ice collisions inside the cloud create positive top and negative bottom'],
            ['Step 2: Stepped leader', 'Invisible negative channel descends from cloud in 50 m steps'],
            ['Step 3: Streamers', 'Positive channels rise from pointed objects on the ground'],
            ['Step 4: Connection', 'Leader meets streamer — conducting channel complete'],
            ['Step 5: Return stroke', 'Bright flash races upward at 100 million m/s'],
            ['Step 6: Thunder', 'Air superheats to 30,000°C and expands explosively'],
          ],
        },
      },
    },

    // ── Section 5: Electrical Safety ───────────────────────────
    {
      title: 'Electrical Safety',
      beginnerContent:
        'Household electricity in India runs at **240 volts AC** (alternating current) at 50 Hz — significantly higher than the 120V used in the United States.\n\n' +
        '**How much current is dangerous?**\n\n' +
        '| Current through body | Effect |\n' +
        '|---------------------|--------|\n' +
        '| 1 mA | Barely felt — tingling |\n' +
        '| 5 mA | Painful but you can let go |\n' +
        '| 10 mA | Muscles seize — **can\'t let go** |\n' +
        '| 30 mA | Breathing difficulty, possible heart disruption |\n' +
        '| 100 mA | **Ventricular fibrillation** — usually fatal |\n' +
        '| 1 A+ | Severe burns, cardiac arrest |\n\n' +
        '**Key insight:** At 240V, your body\'s resistance determines whether you live or die:\n\n' +
        '| Condition | Body resistance | Current (I = 240/R) | Result |\n' +
        '|-----------|----------------|---------------------|--------|\n' +
        '| Dry skin | ~100,000 Ω | 2.4 mA | Tingling |\n' +
        '| Damp skin | ~10,000 Ω | 24 mA | Can\'t let go |\n' +
        '| Wet skin | ~1,000 Ω | **240 mA** | **Fatal** |\n\n' +
        'This is why electrical accidents are far more common during the monsoon season — wet skin dramatically lowers resistance.\n\n' +
        '**Protection devices in your home:**\n\n' +
        '| Device | What it does | Trips at |\n' +
        '|--------|-------------|----------|\n' +
        '| **Fuse** | Wire melts and breaks circuit | Specific current rating (e.g., 13 A) |\n' +
        '| **MCB** (Miniature Circuit Breaker) | Electromagnetic trip — reusable | 16 A or 32 A |\n' +
        '| **RCCB** (Residual Current Circuit Breaker) | Detects current leaking to earth | **30 mA** in < 30 ms |\n\n' +
        '**Why do birds sit safely on power lines?** Both feet touch the same wire — no voltage difference across their body means no current flows. If a bird touched two wires at different voltages simultaneously, it would be electrocuted — this is what happens to large birds of prey whose wingspan can bridge two conductors.\n\n' +
        '**Earthing (grounding):** The earth pin in a three-pin plug connects the metal casing of an appliance to the ground. If a live wire accidentally touches the casing, current flows safely to earth and trips the breaker — instead of flowing through the next person who touches the appliance.',
      intermediateContent:
        '**The danger threshold in detail:**\n\n' +
        'Using V = IR at 240V:\n\n' +
        '| Scenario | Resistance | Current | Time to fatal | Outcome |\n' +
        '|----------|-----------|---------|---------------|---------|\n' +
        '| Dry hands, brief touch | 100,000 Ω | 2.4 mA | — | Sensation only |\n' +
        '| Sweaty hands gripping wire | 10,000 Ω | 24 mA | >3 s | Muscle lock, can\'t let go |\n' +
        '| Standing in puddle | 1,000 Ω | 240 mA | <1 s | **Lethal** |\n' +
        '| Submerged (bathtub) | 500 Ω | 480 mA | <0.5 s | **Lethal** |\n\n' +
        '**How an RCCB works:**\n\n' +
        'The live and neutral wires pass through the same magnetic core. Normally, current out (live) equals current back (neutral), so the magnetic fields cancel. If current leaks to earth through a person, the imbalance creates a net magnetic field that trips a relay — disconnecting power in **under 30 milliseconds**.\n\n' +
        '**Fuse calculations:**\n\n' +
        '| Parameter | Normal operation | Fault condition |\n' +
        '|-----------|-----------------|----------------|\n' +
        '| Current | 13 A | 100 A |\n' +
        '| Fuse resistance | 0.01 Ω | 0.01 Ω |\n' +
        '| Power in fuse (P = I²R) | 13² × 0.01 = **1.69 W** | 100² × 0.01 = **100 W** |\n' +
        '| Result | Manageable heat | Fuse wire melts → circuit breaks |\n\n' +
        'The **I²t rating** (e.g., 80 A²s for a 13 A fuse) determines how fast the fuse blows at a given overcurrent.\n\n' +
        '**Worked example — choosing a fuse:**\n\n' +
        'An electric kettle is rated 2,400 W at 240V.\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Normal current | I = P/V = 2400/240 = **10 A** |\n' +
        '| Choose fuse | Next standard size up: **13 A** |\n' +
        '| Why not 10 A? | Fuse must handle brief startup surges without nuisance-tripping |\n' +
        '| Why not 30 A? | Too high — would not blow during a dangerous fault |',
      advancedContent:
        '**Physiological effects of electric shock:**\n\n' +
        'The heart is most vulnerable during the **T-wave** of the cardiac cycle — a ~200 ms window when a re-entrant circuit can trigger ventricular fibrillation.\n\n' +
        '| Frequency | Effect on body | Why |\n' +
        '|-----------|---------------|-----|\n' +
        '| DC | Single muscle contraction, can be thrown clear | No repetitive stimulation |\n' +
        '| 50–60 Hz (mains) | **Most dangerous** — tetanic contraction, can\'t let go | Frequency matches heart\'s vulnerable period |\n' +
        '| 1–10 kHz | Painful but less likely to fibrillate | Above cardiac response range |\n' +
        '| >100 kHz | Surface heating only (skin effect) | Current travels on body surface |\n\n' +
        'This is why Tesla could safely demonstrate high-frequency, high-voltage discharges — at MHz frequencies, current channels along the skin surface without penetrating to vital organs.\n\n' +
        '**Arc flash hazards** in industrial settings:\n\n' +
        '| Parameter | Typical value |\n' +
        '|-----------|---------------|\n' +
        '| Arc temperature | >20,000°C |\n' +
        '| Blast pressure | Up to 2,000 lb/ft² |\n' +
        '| Sound level | 140+ dB (immediate hearing damage) |\n' +
        '| Incident energy at 60 cm | 1.2–40 cal/cm² (severe burns at >8) |\n\n' +
        'Arc flash is the leading cause of electrical workplace fatalities. **NFPA 70E** defines hazard categories requiring personal protective equipment (PPE) rated to specific incident energy levels.\n\n' +
        '**Modern protection — AFCIs:**\n\n' +
        'Arc-fault circuit interrupters use spectral analysis of current waveforms to detect the chaotic signature of an electrical arc (different from normal switching arcs) and disconnect power before a fire starts. Combined AFCI/GFCI (ground-fault) devices provide both arc and leakage protection.\n\n' +
        '**Assam context:** Rural electrification under the Saubhagya scheme brought 240V power to villages across the Brahmaputra valley, but many homes lack proper earthing and RCCB protection. During monsoon floods, submerged wiring and makeshift connections create lethal hazards — proper earthing, RCCB installation, and community electrical safety education save lives.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            {
              text: 'Current kills, not voltage.',
              answer: false,
              explanation: 'Both matter. Current through the heart is what kills, but voltage drives current through resistance (your body). V=IR means you need voltage to push dangerous current through you.',
            },
            {
              text: 'A bird on a power line is safe because it touches only one wire.',
              answer: true,
              explanation: 'Correct — no voltage difference means no current flows through the bird. If it touched two wires or a wire and ground, it would be electrocuted.',
            },
            {
              text: 'Rubber-soled shoes protect you from lightning.',
              answer: false,
              explanation: 'Lightning has already jumped kilometres through air. A centimetre of rubber makes no difference. The safest place is inside a building or car.',
            },
            {
              text: 'Wet skin makes electric shock more dangerous.',
              answer: true,
              explanation: 'Wet skin can drop body resistance from 100,000 Ω to 1,000 Ω — increasing current by 100×. At 240V, that\'s the difference between a tingle (2.4 mA) and death (240 mA).',
            },
            {
              text: 'An RCCB protects against overcurrent (too many appliances on one circuit).',
              answer: false,
              explanation: 'An RCCB detects current leaking to earth (e.g., through a person). Overcurrent protection is the job of MCBs and fuses. A home needs both.',
            },
          ],
        },
      },
    },
  ],
};
