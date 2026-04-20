import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'heat-and-thermodynamics',
  title: 'Heat & Thermodynamics',
  category: 'physics',
  tags: ['math', 'engineering'],
  keywords: ['entropy', 'enthalpy', 'carnot', 'specific heat', 'conduction', 'convection', 'radiation', 'boltzmann'],
  icon: '🌡️',
  tagline: "Why tea cools, metals expand, and the monsoon drives weather across Assam.",
  relatedStories: ['grandmothers-pitha', 'holi-tea-gardens', 'little-chef', 'monsoon-home'],
  understand: [
    // ── Section 1: Temperature vs Heat ─────────────────────────
    {
      title: 'Temperature vs Heat',
      diagram: 'MolecularMotionDiagram',
      beginnerContent:
        'Temperature and heat are related but fundamentally different — and confusing them is one of the most common mistakes in physics.\n\n' +
        '**Temperature** = a measure of how fast the particles in a substance are moving on average.\n' +
        '**Heat** = the transfer of thermal energy from a hotter object to a cooler one.\n\n' +
        'Think of it this way: temperature is like the *speed* of cars on a highway, while heat is like the *flow of traffic* between two roads.\n\n' +
        '| Concept | What it measures | Units | Analogy |\n' +
        '|---------|-----------------|-------|---------|\n' +
        '| **Temperature** | Average kinetic energy of particles | °C, K, °F | Speed of individual cars |\n' +
        '| **Heat** | Energy transferred between objects | Joules (J) | Traffic flowing between roads |\n' +
        '| **Thermal energy** | Total kinetic energy of all particles | Joules (J) | Total cars on the road |\n\n' +
        '**Key insight:** A large object at a low temperature can hold more total thermal energy than a small object at a high temperature. A bathtub of warm water at 40°C contains far more thermal energy than a red-hot spark at 3,000°C — because the bathtub has trillions of times more molecules.\n\n' +
        '**Temperature scales:**\n\n' +
        '| Scale | Freezing point of water | Boiling point of water | Absolute zero |\n' +
        '|-------|------------------------|----------------------|---------------|\n' +
        '| Celsius (°C) | 0°C | 100°C | −273.15°C |\n' +
        '| Kelvin (K) | 273.15 K | 373.15 K | **0 K** |\n' +
        '| Fahrenheit (°F) | 32°F | 212°F | −459.67°F |\n\n' +
        'The Kelvin scale starts at **absolute zero** — the theoretical temperature where all particle motion ceases. One Kelvin degree equals one Celsius degree, so converting is simple: K = °C + 273.15.\n\n' +
        '**Try the diagram above** — watch how molecules move faster as temperature increases and nearly freeze at very low temperatures.\n\n' +
        'When you pour a fresh cup of Assam tea, the tea is at ~90°C and the surrounding air is at ~25°C. Heat flows from the tea into the air — never the reverse. The tea cools, the air warms (slightly). This one-way flow is a fundamental law of nature.',
      intermediateContent:
        'The relationship between heat transferred and temperature change is the most important equation in this chapter:\n\n' +
        '> **Q = mcΔT**\n\n' +
        '| Symbol | Meaning | Units |\n' +
        '|--------|---------|-------|\n' +
        '| Q | Heat energy transferred | Joules (J) |\n' +
        '| m | Mass of the substance | kilograms (kg) |\n' +
        '| c | Specific heat capacity | J/(kg·°C) |\n' +
        '| ΔT | Temperature change (T_final − T_initial) | °C or K |\n\n' +
        '**Worked example — heating water for tea:**\n\n' +
        'You want to heat 0.5 kg of water from 20°C to 100°C in a kettle (c_water = 4,186 J/(kg·°C)).\n\n' +
        '`Q = mcΔT = 0.5 × 4,186 × (100 − 20) = 0.5 × 4,186 × 80`\n' +
        '`Q = 167,440 J ≈ 167 kJ`\n\n' +
        'If the electric kettle is rated at 2,000 W:\n\n' +
        '`t = Q / P = 167,440 / 2,000 = 84 seconds ≈ 1.4 minutes`\n\n' +
        '**The kinetic theory connects temperature to molecular motion:**\n\n' +
        '| Quantity | Formula | At 300 K (room temp) |\n' +
        '|----------|---------|----------------------|\n' +
        '| Average KE per molecule | ⟨KE⟩ = (3/2)kT | 6.21 × 10⁻²¹ J |\n' +
        '| RMS speed of N₂ | v_rms = √(3kT/m) | **517 m/s** — faster than sound! |\n' +
        '| RMS speed of O₂ | v_rms = √(3kT/m) | **483 m/s** |\n' +
        '| RMS speed of H₂ | v_rms = √(3kT/m) | **1,920 m/s** |\n\n' +
        'Here k = 1.381 × 10⁻²³ J/K is Boltzmann\'s constant — the bridge between the microscopic world (individual molecules) and the macroscopic world (temperature you can feel).',
      advancedContent:
        'Temperature in statistical mechanics is defined via the Boltzmann distribution: the probability of a system being in a state with energy E is **P(E) ∝ exp(−E/kT)**. Formally:\n\n' +
        '> **1/T = ∂S/∂E**\n\n' +
        'where S is entropy and E is internal energy. This definition allows **negative absolute temperatures** — not "colder than zero" but "hotter than infinity."\n\n' +
        '| Temperature regime | Meaning | Example |\n' +
        '|-------------------|---------|--------|\n' +
        '| T > 0 | Normal — higher energy states less populated | Everything around you |\n' +
        '| T → ∞ | All states equally populated | Extremely hot plasma |\n' +
        '| T < 0 | **Population inversion** — higher energy states MORE populated | Lasers, spin systems |\n\n' +
        'A negative-temperature system spontaneously transfers energy to any positive-temperature system — it is "hotter than infinity" on the energy-transfer scale.\n\n' +
        '**The Third Law and heat capacity at low T:**\n\n' +
        'As T → 0 K, entropy approaches a minimum and heat capacity approaches zero. Einstein (1907) and Debye (1912) explained this using quantum mechanics: at low T, lattice vibration modes "freeze out" because kT is too small to excite them.\n\n' +
        '| Model | Prediction | Range |\n' +
        '|-------|-----------|-------|\n' +
        '| Classical (Dulong-Petit) | C_V = 3R = 25 J/(mol·K) | High T |\n' +
        '| Einstein model | C_V → 0 exponentially | Qualitative at low T |\n' +
        '| **Debye model** | **C_V ∝ T³** | Low T (beautifully confirmed) |\n\n' +
        'The Debye T³ law was one of the early triumphs of quantum theory — classical physics predicted a constant heat capacity that contradicted experiment at low temperatures.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each concept to its correct description',
          pairs: [
            ['Temperature', 'Average kinetic energy of particles — measured in °C or K'],
            ['Heat', 'Transfer of thermal energy from hot to cold — measured in Joules'],
            ['Thermal energy', 'Total kinetic energy of ALL particles in an object'],
            ['Absolute zero', '0 K (−273.15°C) — theoretical limit where particle motion ceases'],
          ],
        },
      },
    },

    // ── Section 2: Conduction, Convection, Radiation ───────────
    {
      title: 'Conduction, Convection, Radiation',
      diagram: 'HeatTransferDiagram',
      beginnerContent:
        'Heat moves from hot to cold through three distinct mechanisms. Understanding all three explains everything from why a metal spoon gets hot to why monsoons happen.\n\n' +
        '| Mechanism | How it works | Medium needed? | Example |\n' +
        '|-----------|-------------|----------------|--------|\n' +
        '| **Conduction** | Molecule-to-molecule contact | Yes (solid, liquid, gas) | Metal spoon in hot tea |\n' +
        '| **Convection** | Bulk movement of heated fluid | Yes (liquid or gas only) | Monsoon winds over Assam |\n' +
        '| **Radiation** | Electromagnetic waves | **No** — works through vacuum | Sunlight warming Earth |\n\n' +
        '**Conduction** happens when fast-vibrating molecules bump into slower neighbours, passing energy along. Stir Assam tea with a metal spoon — the handle warms because metal atoms at the submerged end vibrate rapidly and pass that energy up the handle atom by atom. Metals are excellent conductors because their free electrons carry energy quickly.\n\n' +
        '| Material | Conductor or insulator? | Everyday example |\n' +
        '|----------|----------------------|----------------------------|\n' +
        '| Copper, steel | Excellent conductor | Metal cookware heats fast — but handles burn you |\n' +
        '| Bamboo, wood | Good insulator | Bamboo-handled utensils stay cool in Assamese kitchens |\n' +
        '| Thatch, straw | Good insulator | Chang ghar thatched roofs keep interiors cool in summer, warm in winter |\n' +
        '| Air (trapped) | Excellent insulator | Layered clothing traps air pockets — warmth in Tezpur winters |\n\n' +
        '**Convection** is heat transfer through the bulk movement of a fluid. Heat water in a pot: the bottom layer gets hot, expands, becomes less dense, and rises. Cooler, denser water sinks to replace it — creating a circulation loop called a **convection current**.\n\n' +
        'This same mechanism drives the **monsoon**. During summer, the Indian subcontinent heats up faster than the Indian Ocean, creating rising air over land that draws in moisture-laden ocean air — the southwest monsoon that brings 70-80% of Assam\'s annual rainfall between June and September.\n\n' +
        '**Radiation** is heat transfer through electromagnetic waves. Every object above absolute zero emits thermal radiation — no medium required. The Sun heats Earth through 150 million km of vacuum entirely by radiation. Darker surfaces absorb more radiation (black roads scorching in Guwahati summers), lighter surfaces reflect more (traditional whitewashed Assamese houses).',
      intermediateContent:
        '**Fourier\'s law of conduction:**\n\n' +
        '> **Q/t = kA(T_hot − T_cold) / L**\n\n' +
        '| Symbol | Meaning | Units |\n' +
        '|--------|---------|-------|\n' +
        '| Q/t | Rate of heat flow | Watts (W) |\n' +
        '| k | Thermal conductivity | W/(m·K) |\n' +
        '| A | Cross-sectional area | m² |\n' +
        '| L | Thickness | m |\n\n' +
        '**Thermal conductivity of common materials:**\n\n' +
        '| Material | k (W/(m·K)) | Relative speed |\n' +
        '|----------|------------|----------------|\n' +
        '| Copper | 401 | ⚡ Fastest |\n' +
        '| Aluminium | 237 | Very fast |\n' +
        '| Steel | 50 | Moderate |\n' +
        '| Glass | 1.0 | Slow |\n' +
        '| Wood | 0.15 | Very slow |\n' +
        '| Air | 0.026 | 🐢 Slowest |\n\n' +
        '**Worked example — window heat loss:**\n\n' +
        'A single-pane glass window (k = 1.0, A = 1.5 m², L = 5 mm) with T_in = 25°C, T_out = 5°C:\n\n' +
        '`Q/t = 1.0 × 1.5 × 20 / 0.005 = **6,000 W** — enormous!`\n\n' +
        'Double glazing (two 4 mm panes with 12 mm air gap): the air gap (k = 0.026) dominates:\n\n' +
        '`Q/t ≈ 0.026 × 1.5 × 20 / 0.012 = **65 W** — a 100× reduction!`\n\n' +
        '**Stefan-Boltzmann law (radiation):**\n\n' +
        '> **P = εσAT⁴**\n\n' +
        '| Symbol | Meaning | Value |\n' +
        '|--------|---------|-------|\n' +
        '| ε | Emissivity (0 to 1) | 0.05 for polished aluminium, 0.98 for human skin |\n' +
        '| σ | Stefan-Boltzmann constant | 5.67 × 10⁻⁸ W/(m²·K⁴) |\n' +
        '| A | Surface area | m² |\n' +
        '| T | Absolute temperature | Kelvin |\n\n' +
        'A human body (ε ≈ 0.98, A ≈ 1.7 m², T = 310 K) radiates:\n\n' +
        '`P = 0.98 × 5.67×10⁻⁸ × 1.7 × 310⁴ = **814 W**`\n\n' +
        'But the surroundings at 293 K radiate back 688 W, so net loss = **126 W**.',
      advancedContent:
        'Convection is governed by the **Navier-Stokes equations** coupled with the heat equation. The onset of natural convection depends on the **Rayleigh number**:\n\n' +
        '> **Ra = gβΔTL³ / (να)**\n\n' +
        '| Symbol | Meaning |\n' +
        '|--------|---------|\n' +
        '| g | Gravitational acceleration |\n' +
        '| β | Thermal expansion coefficient |\n' +
        '| ν | Kinematic viscosity |\n' +
        '| α | Thermal diffusivity |\n\n' +
        '| Rayleigh number | Flow regime |\n' +
        '|----------------|-------------|\n' +
        '| Ra < 1,708 | Pure conduction — no convection cells |\n' +
        '| 1,708 < Ra < 10⁶ | Laminar convection — orderly Benard cells |\n' +
        '| Ra > 10⁶ | **Turbulent convection** — chaotic mixing |\n\n' +
        'The **Nusselt number** Nu = hL/k compares convective to conductive heat transfer. Nu = 1 means pure conduction; Nu = 100 means convection is 100× more effective.\n\n' +
        '**Planck\'s radiation law:**\n\n' +
        '> **B(λ,T) = (2hc²/λ⁵) × 1/(exp(hc/λkT) − 1)**\n\n' +
        '**Wien\'s displacement law** follows from differentiating Planck\'s function:\n\n' +
        '| Object | Temperature | λ_max | Spectrum region |\n' +
        '|--------|------------|-------|----------------|\n' +
        '| Sun | 5,778 K | 501 nm | Green-yellow visible |\n' +
        '| Lava | ~1,200 K | 2.4 μm | Near-infrared (+ red glow) |\n' +
        '| Human body | 310 K | 9.35 μm | Mid-infrared — thermal cameras |\n' +
        '| Earth surface | 288 K | 10.1 μm | Mid-infrared — greenhouse |\n\n' +
        '**Kirchhoff\'s law of radiation:** At thermal equilibrium, emissivity = absorptivity at each wavelength. Good absorbers are good emitters — matte black surfaces both absorb and radiate heat effectively.',
      interactive: {
        type: 'true-false',
        props: {
          title: 'True or False: Heat Transfer',
          statements: [
            { text: 'Radiation requires a medium (like air) to transfer heat.', answer: false, explanation: 'Radiation travels as electromagnetic waves and needs NO medium — it works through vacuum. That\'s how sunlight crosses 150 million km of empty space to reach Earth.' },
            { text: 'Metals feel cold to the touch because they are at a lower temperature than wood.', answer: false, explanation: 'Both are at room temperature. Metal feels colder because it conducts heat AWAY from your skin faster than wood does. Your skin is the hot object; the metal is a faster heat thief.' },
            { text: 'Double-glazed windows work mainly by trapping an insulating layer of air between two panes.', answer: true, explanation: 'Air has very low thermal conductivity (0.026 W/(m·K)), so the trapped air layer drastically reduces conductive heat loss — up to 100× compared to a single pane.' },
            { text: 'The southwest monsoon is driven by convection — warm air rising over the Indian subcontinent.', answer: true, explanation: 'Land heats faster than ocean in summer, creating rising air over land (low pressure) that draws in moist ocean air — a giant convection current.' },
          ],
        },
      },
    },

    // ── Section 3: Specific Heat Capacity ──────────────────────
    {
      title: 'Specific Heat Capacity',
      diagram: 'SpecificHeatBarsDiagram',
      beginnerContent:
        'Why does a metal pan heat up in seconds while the water inside stays cool for minutes? The answer is **specific heat capacity** — the amount of heat energy needed to raise 1 kg of a substance by 1°C.\n\n' +
        '| Substance | Specific heat c (J/(kg·°C)) | What this means |\n' +
        '|-----------|---------------------------|------------------|\n' +
        '| Water | **4,186** | Very hard to heat up — and very hard to cool down |\n' +
        '| Ice | 2,090 | About half of liquid water |\n' +
        '| Steam | 2,010 | About half of liquid water |\n' +
        '| Iron | 449 | Heats up ~9× faster than water |\n' +
        '| Copper | 385 | Heats up ~11× faster than water |\n' +
        '| Aluminium | 897 | Heats up ~5× faster than water |\n' +
        '| Sand/soil | ~800 | Heats up ~5× faster than water |\n' +
        '| Air | 1,005 | Moderate |\n\n' +
        'Water\'s specific heat is **exceptionally high** — among the highest of any common substance. This one number explains huge phenomena:\n\n' +
        '**Why Guwahati has milder weather than Delhi:**\n' +
        'The Brahmaputra River — one of the world\'s largest by discharge — flows through the heart of Assam carrying an immense thermal mass. It absorbs heat during scorching April days and releases it during cool January nights, moderating Guwahati\'s temperature extremes. Mumbai (coastal) swings only ~7°C between its coldest and warmest months; Delhi (inland) swings over 25°C.\n\n' +
        '**Analogy:** Imagine water as a giant sponge for heat — it soaks up enormous amounts without getting much hotter, and releases heat slowly when things cool down. Metal is like a thin paper towel — it absorbs and releases heat almost instantly.\n\n' +
        '**Quick check:** A metal tawa and a pot of water sit on the same stove. After 2 minutes, which is hotter to the touch?\n\n' +
        '*The tawa — because metal has a much lower specific heat capacity, so the same amount of heat raises its temperature much more.*',
      intermediateContent:
        '**The specific heat equation and calorimetry:**\n\n' +
        '> **Q = mcΔT**\n\n' +
        'When two objects at different temperatures are mixed, heat lost by the hot object = heat gained by the cold object (conservation of energy):\n\n' +
        '> **m₁c₁(T₁ − T_f) = m₂c₂(T_f − T₂)**\n\n' +
        '**Worked example 1 — mixing water:**\n\n' +
        'Mix 200 g of hot water at 80°C with 300 g of cold water at 20°C. Since both are water, c cancels:\n\n' +
        '`200(80 − T_f) = 300(T_f − 20)`\n' +
        '`16,000 − 200T_f = 300T_f − 6,000`\n' +
        '`22,000 = 500T_f`\n' +
        '`T_f = **44°C**`\n\n' +
        '**Worked example 2 — metal in water (calorimetry):**\n\n' +
        'A 0.5 kg iron block at 200°C is dropped into 2 kg of water at 20°C.\n\n' +
        '| Object | m (kg) | c (J/(kg·°C)) | T_initial |\n' +
        '|--------|--------|---------------|----------|\n' +
        '| Iron | 0.5 | 449 | 200°C |\n' +
        '| Water | 2.0 | 4,186 | 20°C |\n\n' +
        '`0.5 × 449 × (200 − T_f) = 2.0 × 4,186 × (T_f − 20)`\n' +
        '`224.5(200 − T_f) = 8,372(T_f − 20)`\n' +
        '`44,900 − 224.5T_f = 8,372T_f − 167,440`\n' +
        '`212,340 = 8,596.5T_f`\n' +
        '`T_f = **24.7°C**`\n\n' +
        'The water barely warms! This dramatically shows water\'s enormous heat capacity.\n\n' +
        '**Molar heat capacities of ideal gases:**\n\n' +
        '| Gas type | Degrees of freedom | C_v | C_p = C_v + R |\n' +
        '|----------|-------------------|-----|---------------|\n' +
        '| Monatomic (He, Ar) | 3 translational | (3/2)R = 12.47 | (5/2)R = 20.79 |\n' +
        '| Diatomic (N₂, O₂) | 3 trans + 2 rot | (5/2)R = 20.79 | (7/2)R = 29.10 |\n' +
        '| Polyatomic (CO₂) | 3 trans + 3 rot | 3R = 24.94 | 4R = 33.26 |',
      advancedContent:
        '**The equipartition theorem** assigns (1/2)kT of energy per quadratic degree of freedom per molecule.\n\n' +
        '| Temperature range | Active modes for H₂ | C_v prediction |\n' +
        '|------------------|--------------------|-----------------|\n' +
        '| < 100 K | 3 translational only | (3/2)R = 12.47 J/(mol·K) |\n' +
        '| 100–1,000 K | 3 trans + 2 rotational | (5/2)R = 20.79 |\n' +
        '| > 1,000 K | 3 trans + 2 rot + 2 vibrational | (7/2)R = 29.10 |\n\n' +
        'This stepwise "unfreezing" of modes as temperature rises was one of the key puzzles that led to quantum mechanics — classical physics predicted a constant (7/2)R at all temperatures.\n\n' +
        '**Why water\'s specific heat is so high:**\n\n' +
        'Water molecules form a strong **hydrogen bonding** network. Heating water requires energy not just to speed up molecules, but also to break and reform H-bonds — this "extra" energy sink makes c anomalously high.\n\n' +
        '**The Dulong-Petit law:**\n\n' +
        '| Prediction | Value | Validity |\n' +
        '|-----------|-------|----------|\n' +
        '| All solid elements: C = 3R | ~25 J/(mol·K) | Good near room temperature for most metals |\n' +
        '| Diamond: C at 300 K | **6.1 J/(mol·K)** | Fails! Θ_D = 2,230 K — room temp is well below |\n' +
        '| Lead: C at 300 K | 26.4 J/(mol·K) | Works well — Θ_D = 105 K |\n\n' +
        'Below the **Debye temperature** Θ_D, quantum effects cause C to drop toward zero as T³. Diamond\'s extremely high Θ_D means room temperature is "cold" for diamond, explaining its anomalously low measured heat capacity versus the Dulong-Petit prediction.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each substance to its thermal behaviour',
          pairs: [
            ['Water (c = 4,186)', 'Heats/cools very slowly — moderates coastal climates'],
            ['Iron (c = 449)', 'Heats/cools ~9× faster than water — tawa gets hot fast'],
            ['Copper (c = 385)', 'Best common metal conductor — used in cooking vessel bases'],
            ['Air (c = 1,005)', 'Moderate heat capacity — trapped layers provide insulation'],
          ],
        },
      },
    },

    // ── Section 4: Phase Changes ───────────────────────────────
    {
      title: 'Phase Changes & Latent Heat',
      diagram: 'PhaseChangeDiagram',
      beginnerContent:
        'Matter exists in three common phases — solid, liquid, and gas — and transitions between them by absorbing or releasing heat. The most counterintuitive fact about phase changes is that **temperature stays constant** during the transition, even though heat is being continuously added.\n\n' +
        '| Phase change | Direction | Heat absorbed or released? | Name |\n' +
        '|-------------|-----------|--------------------------|------|\n' +
        '| Melting | Solid → Liquid | Absorbed | Latent heat of fusion |\n' +
        '| Freezing | Liquid → Solid | Released | Latent heat of fusion |\n' +
        '| Boiling | Liquid → Gas | Absorbed | Latent heat of vaporisation |\n' +
        '| Condensation | Gas → Liquid | Released | Latent heat of vaporisation |\n' +
        '| Sublimation | Solid → Gas | Absorbed | Latent heat of sublimation |\n' +
        '| Deposition | Gas → Solid | Released | Latent heat of sublimation |\n\n' +
        '**Why does temperature plateau?** When ice is at 0°C and you keep heating it, all the energy goes into breaking the bonds between ice crystals — not into speeding up molecules. The energy is "hidden" (latent means hidden) in the breaking of bonds. Only after all the ice has melted does the temperature start rising again.\n\n' +
        '**Latent heats of water:**\n\n' +
        '| Phase change | Latent heat | What this means |\n' +
        '|-------------|------------|------------------|\n' +
        '| Melting ice | 334 J/g | Takes 334 J to melt 1 g of ice — without ANY temperature change |\n' +
        '| Boiling water | **2,260 J/g** | Takes 2,260 J to boil 1 g of water — 6.8× more than melting! |\n\n' +
        '**Why steam burns are so dangerous:** When steam at 100°C touches your skin, it condenses — releasing 2,260 J per gram directly into your tissue. Hot water at 100°C would only transfer heat by cooling down. Steam delivers **far more energy** at the same temperature.\n\n' +
        'On a cold winter morning, frost on grass can sublimate directly into water vapour on a sunny day without visibly melting — the solid ice skips the liquid phase entirely.',
      intermediateContent:
        '**The heat equation for phase changes:**\n\n' +
        '> **Q = mL** (during phase change — temperature constant)\n' +
        '> **Q = mcΔT** (between phase changes — temperature changing)\n\n' +
        '**Worked example — ice at −10°C to steam at 100°C (200 g):**\n\n' +
        '| Step | Calculation | Energy (J) | % of total |\n' +
        '|------|-----------|------------|------------|\n' +
        '| 1. Warm ice −10°C → 0°C | 0.2 × 2,090 × 10 | **4,180** | 0.7% |\n' +
        '| 2. Melt ice at 0°C | 0.2 × 334,000 | **66,800** | 11.0% |\n' +
        '| 3. Warm water 0°C → 100°C | 0.2 × 4,186 × 100 | **83,720** | 13.8% |\n' +
        '| 4. Boil water at 100°C | 0.2 × 2,260,000 | **452,000** | **74.5%** |\n' +
        '| **Total** | | **606,700 J ≈ 607 kJ** | 100% |\n\n' +
        'Vaporisation alone takes **74.5%** of the total energy — this is why boiling a kettle takes so long compared to just heating the water.\n\n' +
        '**Boiling point changes with pressure:**\n\n' +
        '| Location | Altitude | Pressure | Boiling point |\n' +
        '|----------|---------|----------|---------------|\n' +
        '| Sea level | 0 m | 101.3 kPa | 100°C |\n' +
        '| Shillong | 1,496 m | ~85 kPa | ~95°C |\n' +
        '| Tawang | 3,048 m | ~70 kPa | ~90°C |\n' +
        '| Mt Everest summit | 8,849 m | ~34 kPa | ~71°C |\n\n' +
        'At Tawang, water boils at only ~90°C — your tea brews at a lower temperature, and cooking rice takes noticeably longer. Pressure cookers solve this by raising the internal pressure above atmospheric, pushing the boiling point above 100°C.',
      advancedContent:
        '**Ehrenfest classification of phase transitions:**\n\n' +
        '| Order | Discontinuity in | Examples |\n' +
        '|-------|-----------------|----------|\n' +
        '| **First-order** | First derivative of Gibbs free energy (S, V) | Melting, boiling, sublimation |\n' +
        '| **Second-order** | Second derivative (C_p, compressibility) | Ferromagnetic → paramagnetic, superfluid transition |\n\n' +
        '**The Clausius-Clapeyron equation:**\n\n' +
        '> **dP/dT = L / (TΔV)**\n\n' +
        'This relates the slope of a phase boundary to the latent heat and volume change.\n\n' +
        '| Phase boundary | ΔV | dP/dT | Consequence |\n' +
        '|---------------|-----|-------|-------------|\n' +
        '| Ice → Water | **Negative** (ice is less dense) | **Negative** | Pressure lowers the melting point |\n' +
        '| Water → Steam | Positive (steam expands) | Positive | Pressure raises the boiling point |\n\n' +
        'The ice-water anomaly (dP/dT < 0) is unusual — most substances have positive slopes. This is sometimes cited for ice skating, but the effect is only ~0.01°C/atm — far too small to explain it.\n\n' +
        '**Special states of matter:**\n\n' +
        '| State | Conditions | Properties |\n' +
        '|-------|-----------|------------|\n' +
        '| **Triple point** | T = 273.16 K, P = 611.7 Pa (for water) | Solid, liquid, and gas coexist — defines the Kelvin scale |\n' +
        '| **Supercritical fluid** | T > 374°C, P > 22.1 MPa (for water) | Neither liquid nor gas — unique dissolving properties |\n\n' +
        'Supercritical CO₂ is used industrially for decaffeinating coffee and extracting essential oils — it dissolves like a liquid but flows like a gas.',
      interactive: {
        type: 'true-false',
        props: {
          title: 'True or False: Phase Changes',
          statements: [
            { text: 'The temperature of water remains constant at 100°C while it is boiling, even as heat is continuously added.', answer: true, explanation: 'During boiling, all added heat goes into breaking intermolecular bonds (latent heat of vaporisation), not into raising the temperature.' },
            { text: 'Steam at 100°C and liquid water at 100°C transfer the same amount of heat to your skin.', answer: false, explanation: 'Steam releases an additional 2,260 J/g of latent heat when it condenses on your skin, making steam burns far more severe than hot water burns at the same temperature.' },
            { text: 'Water always boils at 100°C regardless of altitude.', answer: false, explanation: 'Boiling point depends on pressure. At higher altitudes (lower pressure), water boils at lower temperatures — only ~71°C at the top of Mt Everest.' },
            { text: 'It takes more energy to boil 1 kg of water than to melt 1 kg of ice.', answer: true, explanation: 'Latent heat of vaporisation (2,260 kJ/kg) is about 6.8× greater than latent heat of fusion (334 kJ/kg). Converting liquid to gas requires completely separating molecules.' },
          ],
        },
      },
    },

    // ── Section 5: Laws of Thermodynamics ──────────────────────
    {
      title: 'Laws of Thermodynamics',
      diagram: 'HeatTransferCookingDiagram',
      beginnerContent:
        'The laws of thermodynamics are among the most fundamental and inviolable principles in all of physics. They set the absolute boundaries of what is physically possible.\n\n' +
        '| Law | Statement (simplified) | What it forbids |\n' +
        '|-----|----------------------|------------------|\n' +
        '| **Zeroth** | If A is in thermal equilibrium with B, and B with C, then A is with C | — (defines temperature) |\n' +
        '| **First** | Energy cannot be created or destroyed, only converted | Perpetual motion machines (Type 1) |\n' +
        '| **Second** | Heat flows from hot to cold; entropy always increases | 100% efficient engines; perpetual motion (Type 2) |\n' +
        '| **Third** | Absolute zero can never be reached in a finite number of steps | Reaching 0 K |\n\n' +
        '**The First Law** is conservation of energy. When you burn wood in a traditional Assamese kitchen, the chemical energy in the wood becomes thermal energy (heat and light) — the total energy before and after is exactly the same. Nothing is created; nothing is lost.\n\n' +
        '**The Second Law** is the arrow of time. Your cup of Assam tea always cools to room temperature; it never spontaneously heats up by absorbing energy from the cooler air. You *can* force heat from cold to hot — that is exactly what a refrigerator does — but it requires external energy input.\n\n' +
        '**Analogy:** The First Law says you can\'t win (you can\'t get more energy out than you put in). The Second Law says you can\'t even break even (some energy is always "wasted" as heat).\n\n' +
        '| Machine | Fuel energy → Useful work | "Wasted" as heat |\n' +
        '|---------|--------------------------|------------------|\n' +
        '| Car engine | 25-30% | 70-75% |\n' +
        '| Coal power plant | 33-40% | 60-67% |\n' +
        '| Human body | ~25% | ~75% |\n' +
        '| LED light bulb | ~40% | ~60% |\n\n' +
        '**The Third Law** says absolute zero (0 K) is forever unreachable — scientists have cooled atoms to within billionths of a degree, but true zero remains like a wall you can approach but never touch.',
      intermediateContent:
        '**The First Law in equation form:**\n\n' +
        '> **ΔU = Q − W**\n\n' +
        '| Symbol | Meaning | Sign convention |\n' +
        '|--------|---------|----------------|\n' +
        '| ΔU | Change in internal energy | + means system gained energy |\n' +
        '| Q | Heat added to system | + means heat flows IN |\n' +
        '| W | Work done BY system | + means system expands |\n\n' +
        '**Worked example — gas expansion:**\n\n' +
        'A gas expands from 2 L to 5 L at constant pressure of 100 kPa, absorbing 500 J of heat.\n\n' +
        '`W = PΔV = 100,000 × (5 − 2) × 10⁻³ = **300 J**`\n' +
        '`ΔU = Q − W = 500 − 300 = **200 J** (internal energy increased)`\n\n' +
        '**Carnot efficiency — the theoretical maximum for any heat engine:**\n\n' +
        '> **η = 1 − T_cold / T_hot** (temperatures in Kelvin!)\n\n' +
        '| Engine | T_hot | T_cold | Max efficiency | Real efficiency |\n' +
        '|--------|-------|--------|---------------|----------------|\n' +
        '| Coal power plant | 873 K (600°C) | 303 K (30°C) | 65.3% | ~35-40% |\n' +
        '| Car engine | 573 K (300°C) | 303 K (30°C) | 47.1% | ~25-30% |\n' +
        '| Nuclear plant | 593 K (320°C) | 303 K (30°C) | 48.9% | ~33% |\n\n' +
        'No real engine can reach Carnot efficiency — friction, turbulence, and heat leaks always reduce it.\n\n' +
        '**Entropy change (reversible process):**\n\n' +
        '> **ΔS = Q / T**\n\n' +
        'Melting 1 kg of ice at 273 K: ΔS = 334,000 / 273 = **1,224 J/K** — entropy increases because the ordered crystal becomes a disordered liquid.',
      advancedContent:
        '**Equivalent formulations of the Second Law:**\n\n' +
        '| Formulation | Statement |\n' +
        '|------------|----------|\n' +
        '| **Clausius** | No process can transfer heat from cold to hot without external work |\n' +
        '| **Kelvin-Planck** | No cyclic process can convert heat entirely to work |\n' +
        '| **Entropy** | Total entropy of an isolated system never decreases |\n' +
        '| **Boltzmann** | S = k ln Ω (carved on his tombstone) |\n\n' +
        'Boltzmann connected entropy to microstates: **S = k ln Ω**, where Ω is the number of accessible microstates.\n\n' +
        '| System (N coins) | Macrostate | Ω (microstates) | S = k ln Ω |\n' +
        '|-----------------|-----------|-----------------|------------|\n' +
        '| 100 coins | All heads | 1 | 0 (perfect order) |\n' +
        '| 100 coins | 50 heads/50 tails | ~10²⁹ | Maximum |\n\n' +
        'The overwhelming likelihood of the high-Ω macrostate explains the **arrow of time** — systems evolve toward disorder not because of a force, but because disordered arrangements are overwhelmingly more numerous.\n\n' +
        '**Maxwell\'s demon** — a hypothetical creature that sorts fast and slow molecules to create a temperature difference without doing work — was resolved by **Landauer\'s principle** (1961): erasing one bit of information dissipates at least kT ln 2 ≈ **2.9 × 10⁻²¹ J** at room temperature. This links thermodynamics to information theory and sets fundamental limits on computation.\n\n' +
        'Modern research explores **quantum thermodynamics**: single-atom heat engines, quantum refrigerators, and the role of entanglement in thermalisation.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each law to what it forbids',
          pairs: [
            ['First Law', 'Creating or destroying energy — rules out perpetual motion machines (Type 1)'],
            ['Second Law', '100% efficient engines — some energy always "wasted" as heat'],
            ['Third Law', 'Reaching absolute zero — can only approach, never arrive'],
            ['Carnot efficiency', 'The theoretical maximum η = 1 − T_cold/T_hot — no real engine can exceed it'],
          ],
        },
      },
    },

    // ── Section 6: Radiative Cooling ───────────────────────────
    {
      title: 'Radiative Cooling & Blackbody Radiation',
      diagram: 'ConductionBarsDiagram',
      beginnerContent:
        'Every object above absolute zero emits energy as electromagnetic radiation — even you, right now. You cannot see this radiation from everyday objects because it is in the **infrared** range, invisible to human eyes but detectable by thermal cameras.\n\n' +
        '| Object | Temperature | Peak emission | Can you see it? |\n' +
        '|--------|------------|--------------|----------------|\n' +
        '| Ice cube | 273 K (0°C) | Far infrared | No |\n' +
        '| Human body | 310 K (37°C) | Mid infrared (9.35 μm) | No — but thermal cameras can |\n' +
        '| Stove coil | ~800 K (~500°C) | Near infrared + dull red | Yes — dim red glow |\n' +
        '| Iron in a forge | ~1,300 K | Orange-yellow | Yes — bright glow |\n' +
        '| Sun\'s surface | 5,778 K | Green-yellow visible (501 nm) | Yes — blinding white |\n\n' +
        'The hotter the object, the more energy it radiates and the shorter the peak wavelength becomes. This is why heated metal goes from invisible → dull red → orange → yellow → white as temperature increases.\n\n' +
        '**Radiative cooling** is what happens on clear nights. The ground and buildings radiate infrared energy upward into space. With no sunlight to replace this energy, surfaces cool down.\n\n' +
        '| Night condition | What happens | Result |\n' +
        '|----------------|-------------|--------|\n' +
        '| **Clear sky** | Ground radiation escapes to space freely | Coldest nights — frost in upper Assam |\n' +
        '| **Cloudy sky** | Clouds absorb and re-radiate heat back down | Warmer nights — clouds act as thermal blanket |\n\n' +
        'This explains why clear winter nights in upper Assam bring frost even when daytime temperatures are mild, and why deserts have extreme day-night temperature swings of 30-40°C.\n\n' +
        '**A blackbody** is an ideal emitter/absorber (ε = 1) — it radiates perfectly at all wavelengths. Real surfaces have ε < 1:\n\n' +
        '| Surface | Emissivity (ε) | Behaviour |\n' +
        '|---------|---------------|----------|\n' +
        '| Matte black paint | 0.95 | Excellent radiator — used on spacecraft radiator panels |\n' +
        '| Human skin | 0.98 | Nearly perfect emitter in infrared |\n' +
        '| Polished aluminium | 0.05 | Poor radiator, excellent reflector — used on spacecraft sun shields |',
      intermediateContent:
        '**The Stefan-Boltzmann law:**\n\n' +
        '> **P = εσAT⁴**\n\n' +
        'The T⁴ dependence is dramatic: double the temperature → 16× more radiated power.\n\n' +
        '**Worked example — net heat loss from a human body:**\n\n' +
        '| Quantity | Value |\n' +
        '|----------|-------|\n' +
        '| ε (skin) | 0.98 |\n' +
        '| A (surface area) | 1.7 m² |\n' +
        '| T_body | 310 K |\n' +
        '| T_room | 293 K (20°C) |\n\n' +
        '`P_out = 0.98 × 5.67×10⁻⁸ × 1.7 × 310⁴ = **814 W**`\n' +
        '`P_in = 0.98 × 5.67×10⁻⁸ × 1.7 × 293⁴ = **688 W**`\n' +
        '`Net loss = 814 − 688 = **126 W**`\n\n' +
        'This is significant — it explains why you feel cold near cold walls even if the air is warm (radiant asymmetry).\n\n' +
        '**Wien\'s displacement law:**\n\n' +
        '> **λ_max = 2,898,000 / T nm**\n\n' +
        '| Object | T (K) | λ_max | Spectrum |\n' +
        '|--------|-------|-------|----------|\n' +
        '| Sun | 5,778 | 501 nm | Green-yellow visible |\n' +
        '| Human | 310 | 9,348 nm | Mid-infrared |\n' +
        '| Earth surface | 288 | 10,063 nm | Mid-infrared |\n\n' +
        '**The greenhouse effect explained:**\n\n' +
        'The atmosphere is largely transparent to visible light (solar input at ~500 nm) but **absorbs infrared** at specific wavelengths:\n\n' +
        '| Gas | Absorption wavelength | Contribution to greenhouse |\n' +
        '|-----|---------------------|--------------------------|\n' +
        '| H₂O | ~6 μm | Largest contributor (~60%) |\n' +
        '| CO₂ | ~15 μm | Second largest (~26%) |\n' +
        '| CH₄ | ~3.3 μm, ~7.7 μm | Potent per molecule (~6%) |\n\n' +
        'Sunlight gets in (visible), Earth re-radiates (infrared), greenhouse gases trap the infrared — the wavelength mismatch is the entire mechanism.',
      advancedContent:
        '**Planck\'s radiation law:**\n\n' +
        '> **B(λ,T) = (2hc²/λ⁵) / (exp(hc/(λkT)) − 1)**\n\n' +
        'Integrating over all wavelengths yields the Stefan-Boltzmann law: σ = 2π⁵k⁴/(15h³c²).\n\n' +
        '| Limit | Name | Formula | Valid when |\n' +
        '|-------|------|---------|----------|\n' +
        '| Long wavelength | Rayleigh-Jeans | B ≈ 2ckT/λ⁴ | hc/λ ≪ kT |\n' +
        '| Short wavelength | Wien\'s approximation | B ≈ (2hc²/λ⁵)exp(−hc/λkT) | hc/λ ≫ kT |\n\n' +
        'The Rayleigh-Jeans law diverges at short wavelengths — the **ultraviolet catastrophe**. Planck\'s 1900 resolution, requiring energy quantised in units of E = hf, launched quantum mechanics.\n\n' +
        '**Modern passive radiative cooling:**\n\n' +
        'Nanostructured surfaces can be engineered to:\n' +
        '1. Emit strongly in the 8-13 μm atmospheric transparency window (where the atmosphere is transparent to outgoing infrared)\n' +
        '2. Reflect solar radiation (0.3-2.5 μm) almost perfectly\n\n' +
        '| Parameter | Achievement |\n' +
        '|-----------|------------|\n' +
        '| Cooling below ambient | Yes — even in direct sunlight |\n' +
        '| Cooling power | 40-100 W/m² |\n' +
        '| Energy input needed | **Zero** — completely passive |\n\n' +
        'Applications include building cooling (reducing AC load), improving power plant condenser efficiency, and food preservation in off-grid communities — particularly relevant for rural NE India where electricity access is inconsistent.',
    },

    // ── Section 7: Evaporative Cooling ─────────────────────────
    {
      title: 'Evaporative Cooling & Humidity',
      diagram: 'EvaporativeCoolingDiagram',
      beginnerContent:
        'Step out of a swimming pool on a windy day and you feel cold — much colder than the air temperature. This is **evaporative cooling**, one of nature\'s most important cooling mechanisms.\n\n' +
        '**What happens, step by step:**\n\n' +
        '| Step | What occurs | Why it matters |\n' +
        '|------|-----------|----------------|\n' +
        '| 1 | Water molecules on your skin have a range of speeds | Some slow, some fast |\n' +
        '| 2 | The **fastest** molecules have enough energy to escape the surface | They fly off as water vapour |\n' +
        '| 3 | The highest-energy molecules have left | Average energy of remaining molecules drops |\n' +
        '| 4 | Lower average energy = lower temperature | **Your skin feels cold** |\n\n' +
        'This is exactly how **sweating** works. Your body pumps warm water onto your skin surface. As it evaporates, it carries heat away. A fan speeds up evaporation by replacing the humid air near your skin with drier air — fans make you feel cooler even though they don\'t change the air temperature.\n\n' +
        '**The wet-bulb temperature** is the lowest temperature air can reach through evaporation alone:\n\n' +
        '| Air condition | Wet-bulb vs dry-bulb | Evaporation effectiveness |\n' +
        '|--------------|---------------------|---------------------------|\n' +
        '| Dry air (desert) | Wet-bulb MUCH lower | ✅ Very effective — desert coolers work great |\n' +
        '| Humid air (Assam monsoon) | Wet-bulb CLOSE to dry-bulb | ❌ Poor — sweating barely helps |\n' +
        '| Wet-bulb > 35°C | **Dangerous** | 🚨 Human body cannot cool itself — heat stroke risk |\n\n' +
        '**Why Assam summers feel worse than Delhi summers:** Delhi at 45°C with low humidity has a wet-bulb around 25°C — uncomfortable but survivable because sweating works. Assam at 35°C with 90% humidity has a wet-bulb near 33°C — far more dangerous because evaporation is nearly impossible.\n\n' +
        '**Traditional cooling technology:**\n\n' +
        '| Method | How it works | Where used |\n' +
        '|--------|-------------|------------|\n' +
        '| **Matka** (clay pot) | Water seeps through porous clay walls and evaporates | Across India — keeps water 8-10°C below ambient |\n' +
        '| Desert cooler | Fan blows air through wet pads | Dry climates (not effective in humid Assam!) |\n' +
        '| Wet cloth on forehead | Direct evaporative cooling on skin | Everywhere — basic first aid for heat |\n' +
        '| Chang ghar raised floor | Air circulates under the house | Traditional Assamese architecture |',
      intermediateContent:
        '**The energy cost of evaporation:**\n\n' +
        '> **Q = ṁ × L_v** (cooling power = evaporation rate × latent heat)\n\n' +
        '| Temperature | L_v (latent heat of vaporisation) | Why it changes |\n' +
        '|------------|----------------------------------|----------------|\n' +
        '| 100°C | 2,260 kJ/kg | Molecules already moving fast |\n' +
        '| 37°C (body temp) | 2,420 kJ/kg | More bonds to break at lower T |\n' +
        '| 20°C | 2,450 kJ/kg | Even more bonds to break |\n\n' +
        '**Worked example — sweating:**\n\n' +
        'A person sweating 1 litre per hour during heavy exercise:\n\n' +
        '`ṁ = 1 kg / 3,600 s = 2.78 × 10⁻⁴ kg/s`\n' +
        '`Q = 2.78 × 10⁻⁴ × 2,420,000 = **673 W** of cooling`\n\n' +
        'This is comparable to the ~700 W of heat a vigorously exercising body produces — sweating is an impressively powerful cooling system when the air is dry enough.\n\n' +
        '**Humidity and the psychrometric chart:**\n\n' +
        '| Concept | Definition | Practical meaning |\n' +
        '|---------|-----------|-------------------|\n' +
        '| Relative humidity (RH) | (Actual vapour pressure / Saturation vapour pressure) × 100% | How "full" the air is |\n' +
        '| Dew point | Temperature at which RH reaches 100% | Below this → fog, condensation |\n' +
        '| Wet-bulb depression | T_dry − T_wet | Large = dry air = effective cooling |\n\n' +
        '**Worked example — matka cooling:**\n\n' +
        'A clay pot (surface area ~0.15 m²) loses water at ~50 g/hour through its porous walls.\n\n' +
        '`Q = (0.05 / 3,600) × 2,450,000 = **34 W** of cooling`\n\n' +
        'This modest cooling power, concentrated on the small pot, is enough to keep the water inside 8-10°C below ambient — remarkably effective for zero energy input.',
      advancedContent:
        '**The Penman equation** models evaporation from surfaces using energy balance and aerodynamic transport:\n\n' +
        '> **E = (Δ·R_n + ρ_a·c_p·(e_s − e_a)/r_a) / (Δ + γ(1 + r_s/r_a))**\n\n' +
        '| Symbol | Meaning |\n' +
        '|--------|---------|\n' +
        '| Δ | Slope of saturation vapour pressure curve |\n' +
        '| R_n | Net radiation |\n' +
        '| ρ_a | Air density |\n' +
        '| e_s − e_a | Vapour pressure deficit |\n' +
        '| r_a | Aerodynamic resistance |\n' +
        '| r_s | Surface resistance |\n' +
        '| γ | Psychrometric constant |\n\n' +
        '**The Clausius-Clapeyron relation and climate change:**\n\n' +
        'Saturation vapour pressure increases ~7% per °C of warming. This means:\n\n' +
        '| Warming | Extra atmospheric moisture | Consequence |\n' +
        '|---------|--------------------------|-------------|\n' +
        '| +1°C | +7% | More intense rainfall events |\n' +
        '| +2°C | +14% | Significantly worse flooding — critical for Assam |\n' +
        '| +3°C | +21% | Wet-bulb temperatures cross 35°C danger zone in parts of South Asia |\n\n' +
        'At wet-bulb temperatures above 35°C, the human body cannot maintain core temperature regardless of fitness, hydration, or shade — a hard physiological limit. Climate projections suggest parts of the Indo-Gangetic plain may regularly exceed this threshold by 2100 under high-emission scenarios. The Brahmaputra valley\'s combination of high humidity and rising temperatures makes this particularly relevant for NE India.\n\n' +
        'Modern research into **radiative sky cooling** (Section 6) combined with evaporative cooling creates hybrid systems achieving cooling powers of 150+ W/m² — promising for sustainable agriculture and off-grid food preservation.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'A wet-bulb temperature of 35°C is a hard limit for human survival — above this, no amount of sweating, shade, or fitness can prevent fatal overheating. Parts of South Asia have already recorded wet-bulb temperatures above 33°C.',
            'The humble clay matka keeps water 8-10°C below ambient temperature using zero electricity — the same principle (evaporative cooling) that your body uses when sweating.',
            'Assam at 35°C with 90% humidity feels worse than Delhi at 45°C with 20% humidity because evaporation (your body\'s cooling system) is nearly impossible in humid air.',
            'The Clausius-Clapeyron relation predicts 7% more atmospheric moisture per degree of warming — directly linking climate change to the worsening floods in the Brahmaputra valley.',
          ],
        },
      },
    },
  ],
};
