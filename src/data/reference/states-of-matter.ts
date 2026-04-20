import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'states-of-matter',
  title: 'States of Matter & Gas Laws',
  category: 'chemistry',
  icon: '⚗️',
  tagline: 'Solid, liquid, gas — how temperature and pressure transform everything.',
  relatedStories: ['boy-who-talked-to-clouds', 'cloud-refused-rain'],
  understand: [
    // ── Section 1: The Particle Model ──────────────────────────
    {
      title: 'The Particle Model of Matter',
      diagram: 'ParticleModelDiagram',
      beginnerContent:
        'All matter is made of tiny particles — atoms and molecules — in constant motion. What makes a solid different from a liquid or a gas is **how those particles are arranged** and **how much energy they have**.\n\n' +
        'Think of it like people in a room:\n' +
        '- **Solid** — everyone is seated in fixed chairs, shoulder to shoulder. They can fidget (vibrate) but cannot leave their seat.\n' +
        '- **Liquid** — everyone stands up and can move around, but the room is still packed. People slide past each other.\n' +
        '- **Gas** — the walls disappear. Everyone sprints in random directions, filling whatever space is available.\n\n' +
        '| Property | Solid | Liquid | Gas |\n' +
        '|----------|-------|--------|-----|\n' +
        '| **Shape** | Fixed | Takes container\'s shape | Fills entire container |\n' +
        '| **Volume** | Fixed | Fixed | Expands to fill space |\n' +
        '| **Particle spacing** | Touching, ordered | Touching, disordered | Far apart |\n' +
        '| **Particle motion** | Vibrate in place | Slide past each other | Fly freely at high speed |\n' +
        '| **Compressible?** | No | Almost no | Yes — easily |\n' +
        '| **Density** | High (~1,000–10,000 kg/m³) | Medium (~500–2,000 kg/m³) | Low (~1 kg/m³) |\n\n' +
        '**How fast do particles actually move?** Faster than you\'d expect:\n\n' +
        '| State | Example | Particle speed | What they do |\n' +
        '|-------|---------|---------------|-------------|\n' +
        '| Solid (iron at 25°C) | A nail | Vibrate at ~10¹³ Hz | Each atom shifts < 0.1 of its own diameter |\n' +
        '| Liquid (water at 20°C) | The Brahmaputra | ~590 m/s average | Collide and change direction constantly |\n' +
        '| Gas (nitrogen at 25°C) | The air around you | ~510 m/s | ~10 billion collisions per second per molecule |\n\n' +
        '**A North-East India moment:** On cool December mornings, mist rolls off the Brahmaputra and blankets the valley. That mist is the boundary between liquid and gas — tiny water droplets (liquid) suspended in air (gas). Each droplet contains roughly 10¹² water molecules that were recently part of the river\'s surface. The molecules that escaped had enough kinetic energy to break free of the liquid — the fastest molecules evaporate first, which is why evaporation cools the remaining liquid.\n\n' +
        '**Check yourself:** If gas molecules move at 510 m/s (faster than the speed of sound!), why doesn\'t a smell reach you instantly across a room?\n\n' +
        '*Because the molecules don\'t travel in straight lines. They collide billions of times per second, zigzagging randomly. The average distance between collisions — the **mean free path** — is only about 68 nanometres. The smell molecule takes a random, tortuous path that is far longer than the straight-line distance.*',
      intermediateContent:
        '**The ideal gas law** unifies three earlier laws into one powerful equation:\n\n' +
        '> **PV = nRT**\n\n' +
        '| Symbol | Meaning | SI unit |\n' +
        '|--------|---------|--------|\n' +
        '| P | Pressure | Pa (pascals) |\n' +
        '| V | Volume | m³ |\n' +
        '| n | Amount of gas | mol |\n' +
        '| R | Universal gas constant | 8.314 J/(mol·K) |\n' +
        '| T | Absolute temperature | K (kelvin) |\n\n' +
        '**Worked example — molar volume at STP:**\n\n' +
        'At STP (0°C = 273.15 K, pressure = 101,325 Pa), what volume does 1 mole of an ideal gas occupy?\n\n' +
        '`V = nRT / P = (1 × 8.314 × 273.15) / 101,325`\n' +
        '`V = 2,271 / 101,325 = 0.02241 m³ = **22.41 L**`\n\n' +
        'This is the famous **molar volume** — any ideal gas, regardless of identity, occupies 22.41 litres at STP.\n\n' +
        '**Worked example — a gas cylinder in a Guwahati workshop:**\n\n' +
        'An oxygen cylinder holds 50 L at 150 atm and 25°C. How many moles of O₂ does it contain?\n\n' +
        '`P = 150 × 101,325 = 15,198,750 Pa`\n' +
        '`V = 50 / 1000 = 0.05 m³`\n' +
        '`T = 25 + 273 = 298 K`\n' +
        '`n = PV / RT = (15,198,750 × 0.05) / (8.314 × 298)`\n' +
        '`n = 759,938 / 2,478 = **307 mol** (≈ 9.8 kg of O₂)`\n\n' +
        '**Real gases vs ideal gases:**\n\n' +
        '| Assumption | Ideal gas | Real gas |\n' +
        '|-----------|-----------|----------|\n' +
        '| Particle volume | Zero (point particles) | Finite — molecules take up space |\n' +
        '| Intermolecular forces | None | Attractive at moderate distance, repulsive at close range |\n' +
        '| Behaviour at high P | Follows PV = nRT | Volume is larger than predicted (molecules can\'t overlap) |\n' +
        '| Behaviour at low T | Follows PV = nRT | Volume is smaller than predicted (attractions pull molecules together) |\n\n' +
        'The **van der Waals equation** corrects for both:\n\n' +
        '`(P + an²/V²)(V − nb) = nRT`\n\n' +
        'Here *a* corrects for intermolecular attractions and *b* corrects for finite molecular volume.',
      advancedContent:
        '**The Maxwell-Boltzmann speed distribution**\n\n' +
        'Not all molecules in a gas move at the same speed. The Maxwell-Boltzmann distribution describes the spread:\n\n' +
        '`f(v) = 4π (M / 2πRT)^(3/2) × v² × exp(−Mv² / 2RT)`\n\n' +
        'Three characteristic speeds:\n\n' +
        '| Speed | Formula | N₂ at 300 K |\n' +
        '|-------|---------|------------|\n' +
        '| Most probable (v_p) | √(2RT/M) | 422 m/s |\n' +
        '| Mean (v_avg) | √(8RT/πM) | 476 m/s |\n' +
        '| Root-mean-square (v_rms) | √(3RT/M) | **517 m/s** |\n\n' +
        'The distribution skews right — a tail of very fast molecules always exists. This tail explains evaporation: the fastest molecules in a liquid exceed the escape velocity and leave the surface, even below the boiling point.\n\n' +
        '**Bose-Einstein condensates (BECs):** At nanokelvin temperatures, bosonic atoms collapse into a single quantum ground state, behaving as a macroscopic quantum wave. First created in 1995 by Cornell and Wieman using rubidium-87 cooled to 170 nK.\n\n' +
        '**Supercritical fluids:** Above a substance\'s critical point (CO₂: 31.1°C, 73.8 atm), the liquid-gas distinction vanishes. Supercritical CO₂ has liquid-like density (good solvent) with gas-like diffusivity (fast penetration) — used industrially to decaffeinate coffee and extract essential oils.\n\n' +
        '**Water\'s phase diagram** contains at least 17 known solid ice phases, each with a different crystal structure stable at different pressures. Ice-VII exists naturally inside diamonds formed deep in Earth\'s mantle.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each state of matter to its particle behaviour',
          pairs: [
            ['Solid', 'Particles vibrate in fixed positions in a regular lattice — holds its own shape'],
            ['Liquid', 'Particles slide past each other but stay close — flows and takes container\'s shape'],
            ['Gas', 'Particles fly freely at high speed — fills any container, easily compressed'],
            ['Plasma', 'Ionised gas with free electrons — found in stars, lightning, neon signs'],
          ],
        },
      },
    },

    // ── Section 2: Phase Transitions ───────────────────────────
    {
      title: 'Phase Transitions',
      diagram: 'PhaseTransitionDiagram',
      beginnerContent:
        'Matter changes state when you add or remove energy. Each transition has a specific name and a specific temperature:\n\n' +
        '| Transition | From → To | Everyday example |\n' +
        '|------------|-----------|------------------|\n' +
        '| **Melting** | Solid → Liquid | Ice cubes in your glass |\n' +
        '| **Freezing** | Liquid → Solid | Water becoming ice in a Tawang winter |\n' +
        '| **Boiling / Evaporation** | Liquid → Gas | Water boiling for tea |\n' +
        '| **Condensation** | Gas → Liquid | Morning dew on tea leaves in Jorhat |\n' +
        '| **Sublimation** | Solid → Gas (skips liquid) | Dry ice (solid CO₂) turning to fog |\n' +
        '| **Deposition** | Gas → Solid (skips liquid) | Frost forming on windows in Tawang |\n\n' +
        '**The key concept: latent heat.** During a phase transition, you add energy but the temperature does NOT rise. All the energy goes into breaking the bonds between particles.\n\n' +
        '| Transition | Latent heat (water) | What the energy does |\n' +
        '|-----------|--------------------|-----------------------|\n' +
        '| Melting (fusion) | **334 J/g** | Breaks the rigid crystal structure of ice |\n' +
        '| Boiling (vaporisation) | **2,260 J/g** | Separates molecules entirely |\n\n' +
        'Vaporisation needs nearly **7 times** more energy than melting. Why? Melting only loosens the lattice — molecules stay close. Boiling separates them completely against strong hydrogen bonds.\n\n' +
        '**Why steam burns worse than boiling water:** When 100°C steam touches your skin, it condenses — releasing 2,260 J/g of latent heat *on top of* its thermal energy. Boiling water at 100°C has no latent heat left to give. The steam delivers far more energy per gram.\n\n' +
        '**North-East India connections:**\n' +
        '- **Frost in Arunachal Pradesh:** On winter nights in Tawang or Mechuka, water vapour deposits directly as ice crystals on grass and windowpanes — deposition, skipping the liquid phase entirely.\n' +
        '- **Brahmaputra valley fog:** When air cools below the dew point on winter nights, billions of tiny liquid droplets condense from vapour, blanketing the valley in white. Flights from LGBI Airport are delayed for hours.\n' +
        '- **Assam tea drying:** In tea factories across Upper Assam, freshly plucked leaves are dried by evaporating water — the same phase transition that turns your wet clothes dry on a sunny day.\n\n' +
        '**Check yourself:** Why does sweating cool you down?\n\n' +
        '*Sweat (liquid water) evaporates from your skin. The latent heat of vaporisation (2,260 J/g) is drawn from your body. Each gram of sweat that evaporates removes 2,260 joules of heat from you — a remarkably efficient cooling system.*',
      intermediateContent:
        '**Heating curve of water — a worked example:**\n\n' +
        'Heat 100 g of ice at −20°C until it becomes steam at 120°C. How much total energy is needed?\n\n' +
        '| Stage | Calculation | Energy (J) |\n' +
        '|-------|-----------|------------|\n' +
        '| 1. Heat ice from −20°C to 0°C | 100 × 2.09 × 20 | 4,180 |\n' +
        '| 2. Melt ice at 0°C | 100 × 334 | 33,400 |\n' +
        '| 3. Heat water from 0°C to 100°C | 100 × 4.18 × 100 | 41,800 |\n' +
        '| 4. Boil water at 100°C | 100 × 2,260 | 226,000 |\n' +
        '| 5. Heat steam from 100°C to 120°C | 100 × 2.01 × 20 | 4,020 |\n' +
        '| **Total** | | **309,400 J (309.4 kJ)** |\n\n' +
        'Notice that **73%** of the total energy goes into the two phase transitions (stages 2 and 4), even though the temperature doesn\'t change during those stages.\n\n' +
        '**Specific heat capacities used above:**\n\n' +
        '| Substance | Specific heat capacity (J/g·°C) |\n' +
        '|-----------|--------------------------------|\n' +
        '| Ice | 2.09 |\n' +
        '| Liquid water | 4.18 |\n' +
        '| Steam | 2.01 |\n\n' +
        'Water\'s specific heat capacity (4.18 J/g·°C) is unusually high — among the highest of any common substance. This is because of **hydrogen bonding**: you must overcome significant intermolecular attraction just to speed the molecules up. This property makes water an excellent temperature buffer — which is why coastal cities have milder climates than inland cities at the same latitude.\n\n' +
        '**Clausius-Clapeyron equation** — how boiling point changes with pressure:\n\n' +
        '`dP/dT = ΔH_vap / (T × ΔV)`\n\n' +
        'At higher altitudes, atmospheric pressure is lower, so water boils below 100°C. In Tawang (~3,000 m altitude, ~70 kPa), water boils at about **90°C**. This means rice and dal take longer to cook — pressure cookers are essential in the hills of NE India.',
      advancedContent:
        '**Phase diagrams — the complete state map**\n\n' +
        'A phase diagram plots pressure vs temperature, showing which state is stable at every (P, T) combination.\n\n' +
        '| Feature | What it represents |\n' +
        '|---------|-------------------|\n' +
        '| **Triple point** | The unique (P, T) where solid, liquid, and gas coexist — water: 611.7 Pa, 0.01°C |\n' +
        '| **Critical point** | Above this, liquid and gas are indistinguishable — water: 218 atm, 374°C |\n' +
        '| **Phase boundary lines** | Curves where two phases coexist in equilibrium |\n\n' +
        '**Water\'s anomaly:** The solid-liquid boundary line slopes *left* (negative slope) — unique among common substances. This means increasing pressure on ice *melts* it (the opposite of most substances). Why? Ice is less dense than liquid water (ice floats!), so squeezing it favours the denser liquid phase. This is described by the Clausius-Clapeyron equation with a negative ΔV for melting.\n\n' +
        '**Gibbs phase rule:** F = C − P + 2, where F = degrees of freedom, C = number of components, P = number of phases.\n\n' +
        '| Point on diagram | Phases (P) | F = 1 − P + 2 | Meaning |\n' +
        '|-----------------|-----------|---------------|--------|\n' +
        '| Single phase region | 1 | 2 | Can vary both T and P freely |\n' +
        '| Phase boundary | 2 | 1 | Fixing T determines P (or vice versa) |\n' +
        '| Triple point | 3 | 0 | Fixed — no freedom at all |\n\n' +
        '**Ice polymorphs:** Water has at least 17 known crystalline ice phases. Ice-Ih (the everyday kind) has a hexagonal lattice with large channels — explaining its low density. At 2 GPa, ice-VII forms with a body-centred cubic structure — denser than liquid water. Ice-VII has been found as inclusions inside diamonds from Earth\'s lower mantle.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Temperature rises steadily throughout a phase transition (e.g., while ice is melting).', answer: false, explanation: 'Temperature stays constant during a phase transition. All added energy goes into breaking intermolecular bonds (latent heat), not increasing kinetic energy.' },
            { text: 'It takes more energy to boil 1 g of water than to melt 1 g of ice.', answer: true, explanation: 'Latent heat of vaporisation (2,260 J/g) is nearly 7× the latent heat of fusion (334 J/g). Boiling separates molecules completely; melting only loosens the lattice.' },
            { text: 'Water boils at exactly 100°C everywhere on Earth.', answer: false, explanation: 'Water boils at 100°C only at standard pressure (101.3 kPa). At higher altitudes (lower pressure), the boiling point drops — about 90°C in Tawang at 3,000 m.' },
            { text: 'Frost forms when liquid dew freezes on a cold surface.', answer: false, explanation: 'Frost forms by deposition — water vapour goes directly from gas to solid, skipping the liquid phase entirely. Frozen dew is a different phenomenon.' },
          ],
        },
      },
    },

    // ── Section 3: Boyle's Law ─────────────────────────────────
    {
      title: 'Boyle\'s Law — Pressure and Volume',
      diagram: 'BoyleLawDiagram',
      beginnerContent:
        'In 1662, Robert Boyle discovered a beautifully simple rule:\n\n' +
        '> **At constant temperature, the pressure and volume of a gas are inversely proportional.**\n\n' +
        '`P₁V₁ = P₂V₂` (temperature and amount of gas held constant)\n\n' +
        'Double the pressure → volume halves. Triple the pressure → volume drops to one-third.\n\n' +
        '**The particle explanation:** Compress a gas into a smaller space and the same number of molecules hit the container walls more often (they have less distance to travel between bounces). More frequent collisions = higher pressure.\n\n' +
        '| Pressure (atm) | Volume (L) | P × V |\n' +
        '|----------------|-----------|-------|\n' +
        '| 1 | 10.0 | 10 |\n' +
        '| 2 | 5.0 | 10 |\n' +
        '| 4 | 2.5 | 10 |\n' +
        '| 5 | 2.0 | 10 |\n' +
        '| 10 | 1.0 | 10 |\n\n' +
        'The product P × V stays constant — that\'s Boyle\'s Law in action.\n\n' +
        '**Analogy:** Imagine 20 people in a room throwing tennis balls at the walls. If you shrink the room to half its size (same people, same balls), the walls get hit twice as often — pressure doubles.\n\n' +
        '**Where you experience Boyle\'s Law:**\n\n' +
        '| Situation | What happens | Boyle\'s Law at work |\n' +
        '|-----------|-------------|--------------------|\n' +
        '| Driving up to Shillong (1,500 m) | Ears "pop" | Air in middle ear expands as external pressure drops |\n' +
        '| Opening a sealed bag of chips in the hills | Bag puffs up or bursts | Lower atmospheric pressure → gas inside expands |\n' +
        '| Scuba diving at 10 m depth | Lungs compress to half volume | Pressure doubles (1 atm water + 1 atm air = 2 atm) |\n' +
        '| Pumping a bicycle tyre | Air gets hotter and compressed | Volume decreases, pressure increases |\n' +
        '| Syringe: push the plunger | Air inside compresses | Smaller volume → higher pressure |\n\n' +
        '**Check yourself:** A sealed balloon has a volume of 3 litres at sea level (1 atm). You carry it to a mountain where pressure is 0.75 atm. What is the new volume?\n\n' +
        '`P₁V₁ = P₂V₂ → 1 × 3 = 0.75 × V₂ → V₂ = 3/0.75 = **4 litres**`\n\n' +
        'The balloon expanded by 33% — you can see this happen in real time on a flight from Guwahati to Dimapur on a small aircraft.',
      intermediateContent:
        '**Worked example 1 — a diver\'s lungs:**\n\n' +
        'A diver at the surface (1 atm) takes a full breath — lung volume = 6 L. She dives to 20 m. What is her lung volume at depth?\n\n' +
        '`Pressure at 20 m = 1 atm (air) + 2 atm (water) = 3 atm`\n' +
        '`P₁V₁ = P₂V₂ → 1 × 6 = 3 × V₂ → V₂ = 2 L`\n\n' +
        'Her lungs compress to **one-third** their surface volume. If she fills her lungs at 20 m (2 L at 3 atm) and ascends without exhaling, the air would expand to 6 L at the surface — potentially rupturing her lungs. This is why the first rule of scuba diving is "**never hold your breath**".\n\n' +
        '**Worked example 2 — compressed oxygen for hospitals:**\n\n' +
        'A hospital in Dibrugarh needs oxygen. A cylinder holds gas at 150 atm in a 50 L tank. What volume would this gas occupy at 1 atm?\n\n' +
        '`P₁V₁ = P₂V₂ → 150 × 50 = 1 × V₂ → V₂ = 7,500 L`\n\n' +
        'One small cylinder holds **7,500 litres** of oxygen at atmospheric pressure. At a flow rate of 5 L/min for a patient, this lasts 7,500/5 = **1,500 minutes = 25 hours**.\n\n' +
        '**Graphical representations of Boyle\'s Law:**\n\n' +
        '| Graph | Shape | Why |\n' +
        '|-------|-------|-----|\n' +
        '| P vs V | Hyperbola (y = k/x) | Inverse proportionality |\n' +
        '| P vs 1/V | Straight line through origin | Linearised form — slope = constant = PV |\n' +
        '| PV vs P | Horizontal line | PV = constant at all pressures (ideal gas) |\n\n' +
        'For **real gases**, the PV vs P graph deviates from horizontal at high pressures — the curve dips (due to intermolecular attractions) then rises (due to molecular volume). This deviation is quantified by the **compressibility factor Z = PV/nRT**: Z = 1 for ideal gas, Z < 1 when attractions dominate, Z > 1 when repulsion dominates.',
      advancedContent:
        '**Deriving Boyle\'s Law from kinetic theory:**\n\n' +
        'Consider N molecules of mass m in a cubic box of side L (volume V = L³).\n\n' +
        '| Step | Physics |\n' +
        '|------|--------|\n' +
        '| 1. One molecule hits a wall | Change in momentum = 2mv_x |\n' +
        '| 2. Time between hits on same wall | Δt = 2L/v_x |\n' +
        '| 3. Force from one molecule | F = Δp/Δt = mv_x²/L |\n' +
        '| 4. Pressure from N molecules | P = NF/(L²) = Nm⟨v_x²⟩/V |\n' +
        '| 5. Since ⟨v²⟩ = 3⟨v_x²⟩ | P = Nm⟨v²⟩/(3V) |\n' +
        '| 6. Rearrange | **PV = ⅓Nm⟨v²⟩ = NkT** |\n\n' +
        'At constant T, ⟨v²⟩ is constant, so PV = constant — Boyle\'s Law falls directly out of Newtonian mechanics applied to molecules.\n\n' +
        '**The virial expansion** — a systematic correction for real gases:\n\n' +
        '`PV/nRT = 1 + B/V + C/V² + D/V³ + ...`\n\n' +
        '| Virial coefficient | Physical meaning | Depends on |\n' +
        '|-------------------|-----------------|------------|\n' +
        '| B(T) | Two-body interactions | Temperature, molecule shape |\n' +
        '| C(T) | Three-body interactions | Density, T |\n\n' +
        'The **Boyle temperature** T_B is the temperature where B(T) = 0 — real gas behaves most ideally. For N₂: T_B ≈ 327°C. Below T_B, attractions dominate (Z < 1); above T_B, repulsions dominate (Z > 1).\n\n' +
        '**Industrial application — Linde process:**\n\n' +
        'Air is liquefied by repeated Boyle\'s-Law compression followed by Joule-Thomson expansion (cooling). The process: compress air to ~200 atm → cool with water → expand through a nozzle (J-T effect cools it further) → repeat until liquid forms at −196°C (N₂) and −183°C (O₂). The liquid air is then fractionally distilled. This is how Guwahati\'s industrial gas plants supply hospitals, welding shops, and the IOCL refinery.',
    },

    // ── Section 4: Charles' Law ────────────────────────────────
    {
      title: 'Charles\' Law — Temperature and Volume',
      beginnerContent:
        'In the 1780s, Jacques Charles discovered:\n\n' +
        '> **At constant pressure, the volume of a gas is directly proportional to its absolute temperature.**\n\n' +
        '`V₁/T₁ = V₂/T₂` (pressure and amount of gas held constant; T **must** be in Kelvin)\n\n' +
        'Double the Kelvin temperature → volume doubles. Halve the Kelvin temperature → volume halves.\n\n' +
        '**Why Kelvin, not Celsius?** Because Celsius has an arbitrary zero (the freezing point of water). Kelvin starts at **absolute zero** (−273.15°C) — the point where particle motion theoretically stops and gas volume would reach zero. Using Celsius in gas law calculations gives nonsensical results (a gas at −10°C doesn\'t have "negative" energy).\n\n' +
        '`T(K) = T(°C) + 273.15`\n\n' +
        '| Temperature (°C) | Temperature (K) | Volume (L) | V/T ratio |\n' +
        '|-------------------|-----------------|-----------|----------|\n' +
        '| −73 | 200 | 2.0 | 0.010 |\n' +
        '| 27 | 300 | 3.0 | 0.010 |\n' +
        '| 127 | 400 | 4.0 | 0.010 |\n' +
        '| 227 | 500 | 5.0 | 0.010 |\n' +
        '| 327 | 600 | 6.0 | 0.010 |\n\n' +
        'The V/T ratio stays constant — that\'s Charles\' Law.\n\n' +
        '**Analogy:** Think of a balloon as a room full of bouncing balls. Heat the room and the balls bounce harder and faster, pushing the walls outward — the room (balloon) expands.\n\n' +
        '**Where you see Charles\' Law:**\n\n' +
        '| Situation | What happens | Charles\' Law at work |\n' +
        '|-----------|-------------|---------------------|\n' +
        '| Hot air balloon | Air inside is heated to ~100°C above outside air | Volume increases → density drops → balloon floats |\n' +
        '| Football left outside on a cold Meghalaya night | Ball feels deflated in the morning | Air inside contracted as temperature dropped |\n' +
        '| Car tyre pressure warning in winter | Tyre pressure drops | Cold air occupies less volume → lower pressure |\n' +
        '| Bread rising in the oven | Dough puffs up | CO₂ gas inside expands as temperature rises |\n\n' +
        '**Check yourself:** A balloon has a volume of 2.5 L at 27°C. You put it in a freezer at −23°C. What\'s the new volume?\n\n' +
        '`T₁ = 27 + 273 = 300 K, T₂ = −23 + 273 = 250 K`\n' +
        '`V₁/T₁ = V₂/T₂ → 2.5/300 = V₂/250 → V₂ = 2.5 × 250/300 = **2.08 L**`\n\n' +
        'The balloon shrinks by about 17%. Try it yourself with a real balloon and your kitchen freezer!',
      intermediateContent:
        '**Worked example 1 — how hot air balloons fly:**\n\n' +
        'Outside air is at 20°C (293 K). The burner heats the air inside the balloon envelope to 120°C (393 K). By what factor does the air expand?\n\n' +
        '`V₂/V₁ = T₂/T₁ = 393/293 = **1.34**`\n\n' +
        'The air expands by 34%. Since the envelope has a fixed size, the extra air spills out the bottom opening. Now the balloon contains **less air** in the same volume — it\'s less dense than the surrounding air, so it floats.\n\n' +
        '`Density_inside / Density_outside = T_outside / T_inside = 293/393 = **0.75**`\n\n' +
        'The air inside is only 75% as dense as outside air. The buoyancy force = (mass of displaced air − mass of air inside) × g.\n\n' +
        '**Worked example 2 — gas syringe experiment:**\n\n' +
        'A sealed gas syringe holds 60 mL of air at 25°C. It\'s placed in boiling water (100°C). What volume does the gas reach?\n\n' +
        '`V₂ = V₁ × T₂/T₁ = 60 × 373/298 = **75.1 mL**`\n\n' +
        '**Combined gas law** — when both temperature and pressure change:\n\n' +
        '`P₁V₁/T₁ = P₂V₂/T₂`\n\n' +
        '**Worked example 3 — weather balloon:**\n\n' +
        'A weather balloon is filled to 1.5 m³ at sea level (1 atm, 25°C). It rises to 10 km altitude where pressure is 0.26 atm and temperature is −50°C. What is the new volume?\n\n' +
        '`V₂ = V₁ × (P₁/P₂) × (T₂/T₁)`\n' +
        '`V₂ = 1.5 × (1/0.26) × (223/298)`\n' +
        '`V₂ = 1.5 × 3.846 × 0.748 = **4.31 m³**`\n\n' +
        'The balloon expands to nearly **3 times** its original volume — this is why weather balloons eventually burst at high altitude.',
      advancedContent:
        '**Absolute zero — the theoretical limit**\n\n' +
        'Charles\' Law predicts that gas volume reaches zero at 0 K (−273.15°C). No real gas achieves this — all gases liquefy and solidify first. But the extrapolation to zero volume is how Lord Kelvin defined the absolute temperature scale in 1848.\n\n' +
        '**The Third Law of Thermodynamics** states that reaching absolute zero requires an infinite number of steps — it\'s a limit that can be approached but never attained. The current record: ~38 picokelvin (3.8 × 10⁻¹¹ K), achieved in 2021 at the University of Bremen using a BEC dropped in a microgravity tower.\n\n' +
        '**Gay-Lussac\'s Law** completes the trio — at constant volume:\n\n' +
        '`P₁/T₁ = P₂/T₂`\n\n' +
        '| Gas Law | Constant | Relationship | Graph (y vs x) |\n' +
        '|---------|----------|-------------|----------------|\n' +
        '| Boyle\'s | T, n | PV = k | P vs V: hyperbola |\n' +
        '| Charles\'s | P, n | V/T = k | V vs T: line through 0 K origin |\n' +
        '| Gay-Lussac\'s | V, n | P/T = k | P vs T: line through 0 K origin |\n' +
        '| Avogadro\'s | T, P | V/n = k | V vs n: line through origin |\n' +
        '| **Ideal gas law** | — | PV = nRT | Unifies all four |\n\n' +
        '**Dalton\'s Law of Partial Pressures:**\n\n' +
        '`P_total = P₁ + P₂ + P₃ + ...`\n\n' +
        'Each gas in a mixture contributes independently. The mole fraction x_i determines the partial pressure: P_i = x_i × P_total.\n\n' +
        '**Worked example:** Air is ~78% N₂, ~21% O₂, ~1% Ar at 1 atm.\n\n' +
        '| Gas | Mole fraction | Partial pressure (atm) |\n' +
        '|-----|--------------|----------------------|\n' +
        '| N₂ | 0.78 | 0.78 |\n' +
        '| O₂ | 0.21 | 0.21 |\n' +
        '| Ar | 0.01 | 0.01 |\n' +
        '| **Total** | **1.00** | **1.00** |\n\n' +
        'At altitude (e.g., Everest summit, ~0.33 atm), the O₂ partial pressure drops to 0.21 × 0.33 = **0.069 atm** — about one-third the sea-level value. This is why climbers need supplemental oxygen.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each gas law to the correct relationship',
          pairs: [
            ['Boyle\'s Law', 'PV = constant — pressure and volume are inversely proportional (constant T)'],
            ['Charles\'s Law', 'V/T = constant — volume and temperature are directly proportional (constant P)'],
            ['Gay-Lussac\'s Law', 'P/T = constant — pressure and temperature are directly proportional (constant V)'],
            ['Ideal Gas Law', 'PV = nRT — unifies Boyle\'s, Charles\'s, and Avogadro\'s laws'],
          ],
        },
      },
    },

    // ── Section 5: Kinetic Molecular Theory ────────────────────
    {
      title: 'Kinetic Molecular Theory',
      beginnerContent:
        'The **Kinetic Molecular Theory (KMT)** is the framework that explains *why* gas laws work. It starts with five assumptions and derives everything else:\n\n' +
        '| # | Assumption | In plain English |\n' +
        '|---|-----------|------------------|\n' +
        '| 1 | Gas particles are in constant, random, straight-line motion | They never stop moving |\n' +
        '| 2 | Particle volume is negligible compared to container volume | Gas is mostly empty space |\n' +
        '| 3 | Collisions are perfectly elastic | No kinetic energy is lost in a bounce |\n' +
        '| 4 | No attractive or repulsive forces between particles | They ignore each other between collisions |\n' +
        '| 5 | Average KE is proportional to absolute temperature | Hotter = faster |\n\n' +
        '**From these five rules, every gas law falls out:**\n\n' +
        '| Gas law | KMT explanation |\n' +
        '|---------|----------------|\n' +
        '| Boyle\'s (↑P → ↓V) | Smaller volume → more frequent wall collisions → higher pressure |\n' +
        '| Charles\'s (↑T → ↑V) | Higher temperature → faster molecules → harder collisions → walls pushed outward |\n' +
        '| Dalton\'s (P_total = ΣP_i) | Each gas type hits walls independently — total pressure is the sum |\n' +
        '| Graham\'s (lighter gases diffuse faster) | At the same T, lighter molecules move faster (KE = ½mv²) |\n\n' +
        '**The temperature-energy connection:**\n\n' +
        '`KE_avg = (3/2)kT`\n\n' +
        'where k = Boltzmann\'s constant = 1.38 × 10⁻²³ J/K\n\n' +
        'This equation is profound: **temperature IS average kinetic energy.** There\'s no deeper meaning to temperature — it\'s just how fast the particles are jiggling.\n\n' +
        '| Temperature | KE per molecule | What it means |\n' +
        '|-------------|----------------|---------------|\n' +
        '| 0 K (absolute zero) | 0 J | All motion stops (theoretical) |\n' +
        '| 300 K (27°C, room temp) | 6.2 × 10⁻²¹ J | Comfortable — molecules at ~500 m/s |\n' +
        '| 6,000 K (Sun\'s surface) | 1.24 × 10⁻¹⁹ J | Atoms ionised — plasma state |\n\n' +
        '**Lighter molecules move faster.** Since KE = ½mv², and all gases at the same temperature have the same average KE:\n\n' +
        '| Gas | Molar mass (g/mol) | v_rms at 300 K (m/s) |\n' +
        '|-----|--------------------|---------------------|\n' +
        '| Hydrogen (H₂) | 2 | **1,920** |\n' +
        '| Helium (He) | 4 | 1,370 |\n' +
        '| Water vapour (H₂O) | 18 | 645 |\n' +
        '| Nitrogen (N₂) | 28 | 517 |\n' +
        '| Oxygen (O₂) | 32 | 484 |\n' +
        '| Carbon dioxide (CO₂) | 44 | 411 |\n\n' +
        '**Why Earth has no hydrogen atmosphere:** H₂ molecules at 300 K move at ~1,920 m/s. Earth\'s escape velocity is 11,200 m/s, but the Maxwell-Boltzmann tail means some H₂ molecules exceed escape velocity. Over billions of years, essentially all H₂ has leaked away. Heavier N₂ and O₂ (at ~500 m/s) are too slow to escape. Jupiter, with its massive gravity (escape velocity 59,500 m/s), retains hydrogen easily.',
      intermediateContent:
        '**Graham\'s Law of Diffusion** — derived from KMT:\n\n' +
        '`Rate₁ / Rate₂ = √(M₂ / M₁)`\n\n' +
        'Lighter gases diffuse (spread) and effuse (escape through tiny holes) faster.\n\n' +
        '**Worked example — ammonia vs hydrochloric acid:**\n\n' +
        'Place a cotton ball soaked in ammonia (NH₃, M = 17) at one end of a tube and hydrochloric acid (HCl, M = 36.5) at the other. Where do the white fumes (NH₄Cl) form?\n\n' +
        '`Rate_NH₃ / Rate_HCl = √(36.5/17) = √2.15 = **1.47**`\n\n' +
        'NH₃ diffuses 1.47× faster, so the white ring forms closer to the HCl end — not the middle.\n\n' +
        '**Worked example — uranium enrichment:**\n\n' +
        'Uranium hexafluoride: ²³⁵UF₆ (M = 349) vs ²³⁸UF₆ (M = 352). The enrichment factor per stage:\n\n' +
        '`α = √(352/349) = √1.0086 = **1.0043**`\n\n' +
        'Only 0.43% separation per stage — this is why gaseous diffusion enrichment requires **~1,400 stages** in series. The massive scale of enrichment plants is a direct consequence of Graham\'s Law.\n\n' +
        '**Mean free path (λ) — how far a molecule travels between collisions:**\n\n' +
        '`λ = kT / (√2 × π × d² × P)`\n\n' +
        '| Condition | λ for N₂ |\n' +
        '|-----------|----------|\n' +
        '| Sea level (1 atm, 25°C) | 68 nm |\n' +
        '| 10 km altitude (0.26 atm) | 260 nm |\n' +
        '| Near-vacuum (10⁻⁶ Pa) | ~100 km |\n' +
        '| Interstellar space | ~10¹³ m |\n\n' +
        'The mean free path determines whether a gas behaves as a fluid (λ << container) or as individual particles (λ >> container). The **Knudsen number** Kn = λ/L characterises this: Kn << 1 is continuum flow; Kn >> 1 is molecular flow.',
      advancedContent:
        '**Derivation of the ideal gas law from KMT:**\n\n' +
        'Starting from assumption 5 (KE_avg = ½m⟨v²⟩ = 3kT/2), for N molecules:\n\n' +
        '`PV = ⅓Nm⟨v²⟩ = ⅓N × 2 × (3kT/2) = NkT`\n\n' +
        'Since N = nN_A and k = R/N_A:\n\n' +
        '`PV = nN_A × (R/N_A) × T = **nRT** ✓`\n\n' +
        '**Equipartition theorem** — each degree of freedom contributes ½kT to average energy:\n\n' +
        '| Molecule type | Degrees of freedom | C_v (per mol) | γ = C_p/C_v |\n' +
        '|--------------|-------------------|--------------|------------|\n' +
        '| Monatomic (He, Ar) | 3 translational | (3/2)R = 12.5 J/(mol·K) | **5/3 = 1.67** |\n' +
        '| Diatomic (N₂, O₂) at room T | 3 trans + 2 rot = 5 | (5/2)R = 20.8 J/(mol·K) | **7/5 = 1.40** |\n' +
        '| Triatomic (CO₂) | 3 trans + 2 rot + 1 vib = 6 | ~3R = 24.9 J/(mol·K) | **~1.30** |\n\n' +
        'At high temperatures, vibrational modes activate (quantum threshold ~1,000 K for N₂), increasing C_v. This is a failure of classical KMT — quantum mechanics is needed to explain why modes "freeze out" at low temperatures.\n\n' +
        '**Transport phenomena from KMT:**\n\n' +
        '| Property | What moves | Formula | Proportional to |\n' +
        '|----------|-----------|---------|----------------|\n' +
        '| Viscosity (η) | Momentum | η = ½ρ⟨v⟩λ | √(T) — increases with T for gases! |\n' +
        '| Thermal conductivity (κ) | Energy | κ = ½ρC_v⟨v⟩λ | √(T) |\n' +
        '| Diffusion (D) | Mass | D = ⅓⟨v⟩λ | T^(3/2)/P |\n\n' +
        'Counterintuitive result: gas viscosity **increases** with temperature (unlike liquids). Hotter molecules carry more momentum across layers. Also, viscosity is **independent of pressure** (at moderate P) because higher density is exactly compensated by shorter mean free path.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'At room temperature, air molecules travel at about 500 m/s — faster than the speed of sound — but they only travel 68 nm between collisions, zigzagging randomly.',
            'Earth has lost essentially all its hydrogen atmosphere over 4.5 billion years — H₂ molecules are fast enough (1,920 m/s) for some to escape Earth\'s gravity.',
            'The coldest temperature ever achieved in a lab (38 picokelvin) is colder than anything known in the natural universe — even colder than the Boomerang Nebula (1 K).',
            'Water is anomalous: its solid form (ice) is LESS dense than its liquid. If ice sank, lakes would freeze bottom-up, killing aquatic life. Life on Earth depends on this anomaly.',
            'Gas viscosity increases with temperature — the exact opposite of liquids. Hot honey flows more easily, but hot air is actually stickier.',
          ],
        },
      },
    },
  ],
};
