import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'energy-and-work',
  title: 'Energy & Work',
  category: 'physics',
  tags: ['math', 'engineering'],
  keywords: ['kinetic energy', 'potential energy', 'conservation of energy', 'joule', 'watt', 'power', 'efficiency'],
  icon: '💪',
  tagline: "The currency of the universe — from a falling mango to a hydroelectric dam.",
  relatedStories: ['honey-hunters-lesson', 'kite-festival', 'the-little-boat', 'ferrymans-riddle'],
  understand: [
    // ── Section 1: Forms of Energy ─────────────────────────────
    {
      title: 'Forms of Energy',
      diagram: 'EnergyBarChartDiagram',
      beginnerContent:
        'Energy is the capacity to do work — to push, pull, heat, light, or move something. Think of energy as **money**: you can hold it in different currencies, spend it in different ways, but the total amount in your wallet only changes when you earn or pay.\n\n' +
        'Your body, a bicycle, a river, a bonfire — they all run on energy. The trick is recognising **which form** it takes:\n\n' +
        '| Form | What it is | Everyday example |\n' +
        '|------|-----------|------------------|\n' +
        '| **Kinetic** | Energy of motion | A flowing Brahmaputra, a spinning bicycle wheel |\n' +
        '| **Gravitational PE** | Stored by height above ground | A mango hanging on a tree in Jorhat |\n' +
        '| **Chemical PE** | Stored in molecular bonds | Rice, petrol, firewood, your lunch |\n' +
        '| **Elastic PE** | Stored in stretched/compressed objects | A drawn bamboo bow, a compressed spring |\n' +
        '| **Thermal** | Random motion of molecules | A hot cup of Assam tea |\n' +
        '| **Electrical** | Moving electrons through conductors | Current flowing through a Guwahati street light |\n' +
        '| **Nuclear** | Bonds holding atomic nuclei together | The Sun, nuclear power plants |\n' +
        '| **Electromagnetic** | Energy carried by waves | Sunlight, radio waves, X-rays |\n\n' +
        '**The key insight:** Energy is always *converting* from one form to another. The Sun\'s nuclear energy becomes light (electromagnetic), which plants absorb to make food (chemical PE), which you eat and burn to run (kinetic + thermal). Nothing is created or destroyed — just transformed.\n\n' +
        '**Try the diagram above** — toggle between a falling mango, a pendulum, and a roller coaster to see how PE and KE bars trade places at each position.\n\n' +
        '**Quick check:** A honey hunter in a Karbi Anglong forest climbs 15 metres up a tree. Does he *gain* or *lose* gravitational PE?\n\n' +
        '*He gains PE — the higher he climbs, the more stored energy he has relative to the ground. If he slips, all that PE converts to KE on the way down.*',
      intermediateContent:
        '**The two energy formulas you must know:**\n\n' +
        '| Quantity | Formula | Units | What each variable means |\n' +
        '|----------|---------|-------|-------------------------|\n' +
        '| Kinetic energy | KE = ½mv² | Joules (J) | m = mass (kg), v = velocity (m/s) |\n' +
        '| Gravitational PE | PE = mgh | Joules (J) | m = mass (kg), g = 9.81 m/s², h = height (m) |\n\n' +
        '**Worked example 1 — falling mango:**\n' +
        'A 0.2 kg mango hangs 10 m above the ground.\n' +
        '- PE at top = mgh = 0.2 x 9.81 x 10 = **19.6 J**\n' +
        '- Just before hitting the ground (h = 0): all PE has become KE\n' +
        '- Speed: v = sqrt(2 x 19.6 / 0.2) = **14.0 m/s** (about 50 km/h!)\n\n' +
        '**Worked example 2 — why speed matters more than mass:**\n\n' +
        '| Vehicle | Mass (kg) | Speed (km/h) | Speed (m/s) | KE (J) |\n' +
        '|---------|-----------|-------------|-------------|--------|\n' +
        '| Bicycle | 80 | 20 | 5.6 | **1,254** |\n' +
        '| Car | 1,000 | 50 | 13.9 | **96,605** |\n' +
        '| Same car | 1,000 | 100 | 27.8 | **386,420** |\n' +
        '| Truck | 10,000 | 50 | 13.9 | **966,050** |\n\n' +
        'Notice: doubling the car\'s speed from 50 to 100 km/h **quadruples** the KE (because v is squared). This is why high-speed crashes are so much more devastating — and why speed limits exist.\n\n' +
        '**Energy density — how much energy is packed into different fuels:**\n\n' +
        '| Fuel | Energy density | Comparison |\n' +
        '|------|---------------|------------|\n' +
        '| Uranium-235 | 82,000,000 MJ/kg | 2 million x petrol |\n' +
        '| Petrol | 46 MJ/kg | Baseline |\n' +
        '| Chocolate bar | 22 MJ/kg | Half of petrol |\n' +
        '| Wood / bamboo | 16 MJ/kg | Common in rural Assam |\n' +
        '| Li-ion battery | 0.5 MJ/kg | 90x less than petrol |\n\n' +
        'This table explains why electric cars need massive battery packs — batteries store far less energy per kilogram than liquid fuels.',
      advancedContent:
        '**The Lagrangian formulation** replaces Newton\'s F = ma with a single elegant function:\n\n' +
        '**L = T - V** (kinetic minus potential energy)\n\n' +
        'All equations of motion follow from the **Euler-Lagrange equation**:\n\n' +
        '`d/dt(dL/dq_dot) - dL/dq = 0`\n\n' +
        'This works in *any* coordinate system and naturally handles constraints — far more powerful than tracking forces.\n\n' +
        '**Noether\'s theorem (1918)** — the deepest connection in physics:\n\n' +
        '| Symmetry | Conserved quantity |\n' +
        '|----------|-------------------|\n' +
        '| Time-translation (physics is the same today as yesterday) | **Energy** |\n' +
        '| Space-translation (physics is the same here as there) | **Momentum** |\n' +
        '| Rotational (physics is the same in every direction) | **Angular momentum** |\n\n' +
        'Energy conservation is not an accident — it is a *consequence* of time-translation symmetry. If the laws of physics changed over time, energy would NOT be conserved.\n\n' +
        'This actually happens in cosmology: the expansion of the universe breaks time-translation symmetry. Photon energy decreases with cosmological redshift — and that energy is genuinely "lost," not transferred elsewhere.\n\n' +
        'The **Hamiltonian** H = T + V governs quantum evolution via the Schrodinger equation: ih_bar dPsi/dt = H Psi. Energy sits at the centre of both classical and quantum physics.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each energy form to its real-world example',
          pairs: [
            ['Kinetic energy', 'A Brahmaputra river ferry moving at 15 km/h'],
            ['Gravitational PE', 'Water stored behind the Kopili dam at 200 m height'],
            ['Chemical PE', 'A kilogram of rice waiting to be digested'],
            ['Thermal energy', 'A hot cup of Assam red tea at 80 degrees C'],
            ['Elastic PE', 'A bamboo fishing rod bent by a caught fish'],
          ],
        },
      },
    },

    // ── Section 2: Work = Force x Distance ─────────────────────
    {
      title: 'Work = Force x Distance',
      diagram: 'WorkForceDiagram',
      beginnerContent:
        'In everyday language, "work" means effort. In physics, it has a precise meaning: **work is done when a force moves an object in the direction of that force.**\n\n' +
        'The formula is:\n\n' +
        '> **W = F x d x cos(theta)**\n\n' +
        'where F is force (Newtons), d is distance (metres), and theta is the angle between force and motion.\n\n' +
        '**Analogy:** Imagine pushing a heavy boat along the banks of the Brahmaputra. You push horizontally, the boat moves horizontally — all your force does work. Now imagine carrying a basket of tea leaves on your head across a flat field. Your upward force supports the basket, but the motion is horizontal — the force is *perpendicular* to the motion, so in physics, you do **zero work** on the basket!\n\n' +
        '| Scenario | Force direction | Motion direction | Work done? |\n' +
        '|----------|----------------|-----------------|------------|\n' +
        '| Pushing a box across the floor | Horizontal | Horizontal | Yes (theta = 0 degrees) |\n' +
        '| Carrying a pot on your head, walking flat | Vertical (up) | Horizontal | No (theta = 90 degrees) |\n' +
        '| Pulling a suitcase at 30 degrees | Angled | Horizontal | Partial (cos 30 degrees = 0.87) |\n' +
        '| Gravity on a satellite in circular orbit | Inward | Tangential | No (theta = 90 degrees) |\n\n' +
        '**Why can you feel exhausted without doing physics-work?** Because your muscles are doing *biological* work internally — fibres contract and relax, burning ATP — even if the object doesn\'t move. Physics-work only counts displacement.\n\n' +
        '**The unit of work is the Joule (J):** 1 Joule = 1 Newton x 1 metre. Named after James Prescott Joule, who proved that heat is a form of energy.',
      intermediateContent:
        '**The work-energy theorem** connects work to motion:\n\n' +
        '> **W_net = delta KE = ½mv_2² - ½mv_1²**\n\n' +
        'The net work done on an object equals its change in kinetic energy.\n\n' +
        '**Worked example — tea crate sliding down a ramp:**\n\n' +
        'A 20 kg crate of Assam tea slides down a 5 m ramp inclined at 30 degrees. Friction coefficient mu = 0.25.\n\n' +
        '| Force | Calculation | Value |\n' +
        '|-------|------------|-------|\n' +
        '| Gravity along ramp | mg sin 30 = 20 x 9.81 x 0.5 | **98.1 N** |\n' +
        '| Normal force | mg cos 30 = 20 x 9.81 x 0.866 | **169.9 N** |\n' +
        '| Friction force | mu x N = 0.25 x 169.9 | **42.5 N** |\n' +
        '| Net force along ramp | 98.1 - 42.5 | **55.6 N** |\n\n' +
        '| Work component | Calculation | Value |\n' +
        '|---------------|------------|-------|\n' +
        '| Work by gravity | 98.1 x 5 | **+490.5 J** |\n' +
        '| Work by friction | -42.5 x 5 | **-212.5 J** (opposes motion) |\n' +
        '| Net work | 490.5 - 212.5 | **278.0 J** |\n' +
        '| Final speed | v = sqrt(2 x 278 / 20) | **5.27 m/s** |\n\n' +
        '**Worked example — pushing at an angle:**\n\n' +
        'A farmer pushes a 50 kg rice sack with 80 N of force at 25 degrees below horizontal across 10 m of flat ground.\n' +
        '- Horizontal component: 80 x cos 25 = **72.5 N**\n' +
        '- Work done: 72.5 x 10 = **725 J**\n' +
        '- The vertical component (80 x sin 25 = 33.8 N) pushes the sack into the ground — increasing friction but doing no work in the direction of motion.\n\n' +
        'For **variable forces**, work is the area under the force-displacement graph: **W = integral of F dx**.',
      advancedContent:
        'In its most general form, work is the **path integral**:\n\n' +
        '**W = integral_C F . dr**\n\n' +
        'along curve C. Whether this integral depends on the path or only on the endpoints determines whether the force is **conservative**.\n\n' +
        '| Property | Conservative force | Non-conservative force |\n' +
        '|----------|-------------------|----------------------|\n' +
        '| Path dependence | Independent — only endpoints matter | Depends on exact path taken |\n' +
        '| Curl condition | curl F = 0 | curl F != 0 |\n' +
        '| Potential energy | Can define V where F = -grad V | Cannot define a PE function |\n' +
        '| Round-trip work | Zero (returns to start = no net work) | Non-zero (energy lost to heat) |\n' +
        '| Examples | Gravity, electrostatic, spring | Friction, air resistance |\n\n' +
        '**The virial theorem** for systems bound by inverse-square forces: <T> = -½<V>, where T is kinetic and V is potential energy averaged over time. For a planet orbiting a star, if PE averages -2E (where E is total energy), then KE averages +E.\n\n' +
        'Paradox: a satellite that loses energy through atmospheric drag *speeds up*. As it spirals lower, PE decreases more than KE increases. The total energy drops, but the velocity rises — the virial theorem in action.\n\n' +
        'In quantum mechanics, the work-energy theorem is replaced by the expectation value of the Hamiltonian: <E> = <Psi|H|Psi>. The uncertainty principle delta E . delta t >= h_bar/2 allows brief energy "loans" (virtual particles) that produce real effects: the Casimir force and the Lamb shift.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A woman carrying a water pot on her head across flat ground does work on the pot (in physics).', answer: false, explanation: 'The supporting force is vertical but the motion is horizontal — the force is perpendicular to the displacement, so cos(90) = 0 and no physics-work is done on the pot.' },
            { text: 'Friction always does negative work.', answer: true, explanation: 'Friction always opposes the direction of motion, so the angle between friction force and displacement is 180 degrees. cos(180) = -1, making friction work always negative.' },
            { text: 'If you push a wall and it does not move, you have done zero work on the wall.', answer: true, explanation: 'Work = Force x distance. If distance = 0, work = 0 regardless of how much force you apply. Your muscles burn energy internally, but the wall receives no energy.' },
            { text: 'Doubling the force on an object doubles the work done over the same distance.', answer: true, explanation: 'W = Fd. If F doubles and d stays the same, W doubles. Work is directly proportional to force.' },
          ],
        },
      },
    },

    // ── Section 3: Conservation of Energy ──────────────────────
    {
      title: 'Conservation of Energy',
      diagram: 'EnergyConversionChainDiagram',
      beginnerContent:
        'The **law of conservation of energy** states: energy cannot be created or destroyed — only transformed from one form to another. The total energy in an isolated system stays constant.\n\n' +
        'This is one of the most reliable principles in all of physics. Every experiment ever conducted confirms it.\n\n' +
        '**A falling mango in a Jorhat orchard:**\n\n' +
        '| Position | Height | PE (mgh) | KE (½mv²) | Total |\n' +
        '|----------|--------|----------|-----------|-------|\n' +
        '| Top (just released) | 8 m | 23.5 J | 0 J | 23.5 J |\n' +
        '| Halfway down | 4 m | 11.8 J | 11.8 J | 23.5 J |\n' +
        '| Near ground | 1 m | 2.9 J | 20.6 J | 23.5 J |\n' +
        '| Impact | 0 m | 0 J | 23.5 J | 23.5 J |\n\n' +
        'The total never changes — PE trades smoothly into KE.\n\n' +
        '**A pendulum** shows the same principle: at the peak, all energy is PE; at the bottom, all energy is KE. In a perfect pendulum (no friction), it would swing forever. In reality, friction and air resistance convert some energy to heat, so the swing gradually dies — but the *total* energy (kinetic + potential + thermal) is still exactly the same.\n\n' +
        '**Try the diagram above** — follow the energy conversion chain from sunlight to the electricity in your home.\n\n' +
        'The hydroelectric dams across Assam and Arunachal Pradesh are conservation of energy in action. Water at height h has gravitational PE = mgh. As it falls through turbines, PE becomes KE of spinning blades, which becomes electrical energy in generators. No energy is created — it is all transformed from the PE the rain gained when the Sun evaporated it from the Brahmaputra.\n\n' +
        '**Quick check:** A roller coaster\'s first hill is always the tallest. Why can\'t the second hill be taller?\n\n' +
        '*Because some energy is lost to friction and air resistance at every point. The car can never regain more height than it started with.*',
      intermediateContent:
        '**At any point during free fall:** ½mv² + mgh = constant (E_total)\n\n' +
        '**Worked example 1 — mango drop (m = 0.3 kg, h = 8 m):**\n\n' +
        '| Quantity | At top | At h = 4 m | At ground |\n' +
        '|----------|--------|-----------|----------|\n' +
        '| PE = mgh | 0.3 x 9.81 x 8 = **23.54 J** | 0.3 x 9.81 x 4 = **11.77 J** | **0 J** |\n' +
        '| KE = E - PE | 0 J | **11.77 J** | **23.54 J** |\n' +
        '| Speed v = sqrt(2KE/m) | 0 m/s | **8.86 m/s** | **12.53 m/s** |\n\n' +
        'Cross-check at ground: v = sqrt(2gh) = sqrt(2 x 9.81 x 8) = **12.53 m/s**. Matches.\n\n' +
        '**Worked example 2 — roller coaster with friction:**\n\n' +
        'A 500 kg car starts from rest at h_1 = 30 m. It reaches h_2 = 10 m. Friction does -15,000 J of work.\n\n' +
        '| Energy component | Value |\n' +
        '|-----------------|-------|\n' +
        '| Initial PE | mgh_1 = 500 x 9.81 x 30 = **147,150 J** |\n' +
        '| Final PE | mgh_2 = 500 x 9.81 x 10 = **49,050 J** |\n' +
        '| Energy lost to friction | **15,000 J** |\n' +
        '| KE at h_2 | 147,150 - 49,050 - 15,000 = **83,100 J** |\n' +
        '| Speed at h_2 | v = sqrt(2 x 83,100 / 500) = **18.2 m/s = 65.7 km/h** |\n\n' +
        'Without friction: v = sqrt(2 x 9.81 x 20) = **19.8 m/s = 71.3 km/h** — friction costs about 8% of the speed.\n\n' +
        '**Energy conversion chains:**\n\n' +
        '| Stage | Energy form | Location example |\n' +
        '|-------|-----------|------------------|\n' +
        '| Sun heats ocean | Electromagnetic -> Thermal | Bay of Bengal |\n' +
        '| Water evaporates, rises | Thermal -> Gravitational PE | Monsoon clouds |\n' +
        '| Rain falls on hills | Gravitational PE -> Kinetic | Meghalaya (wettest place on Earth) |\n' +
        '| River flows through turbine | Kinetic -> Rotational KE | Kopili HEP, Assam |\n' +
        '| Generator spins | Rotational KE -> Electrical | Power station |\n' +
        '| Light bulb in Guwahati home | Electrical -> Light + Heat | End user |',
      advancedContent:
        'Conservation of energy is a *consequence* of **time-translation symmetry** via Noether\'s theorem. This is the deepest explanation — not a law handed down, but a mathematical inevitability of symmetric physics.\n\n' +
        '**Where energy conservation gets subtle:**\n\n' +
        '| Context | Is energy conserved? | Why |\n' +
        '|---------|---------------------|-----|\n' +
        '| Isolated lab system | Yes, exactly | Time-translation symmetry holds |\n' +
        '| Expanding universe | Not globally | No global time-translation symmetry |\n' +
        '| Quantum vacuum | Locally, within delta E . delta t >= h_bar/2 | Virtual particles "borrow" energy briefly |\n' +
        '| General relativity | Locally: div T^mu_nu = 0 | Stress-energy tensor conserved locally |\n\n' +
        'In expanding spacetime, photons lose energy (cosmological redshift) with no simple accounting of where it goes. This is not a failure of physics — it is a reminder that "conservation of energy" is a theorem with premises, and curved spacetime violates one of them.\n\n' +
        '**Pair production** demonstrates E = mc² directly: a gamma-ray photon with energy >= 2m_e c² = 1.022 MeV can spontaneously create an electron-positron pair near a nucleus. The reverse (pair annihilation) converts matter entirely to energy. These processes underpin PET scanning, antimatter research, and our understanding of the early universe when T > 10^10 K.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each energy transformation to its real-world example',
          pairs: [
            ['Chemical PE -> Thermal + Light', 'Burning bamboo in a Mishing village cooking fire'],
            ['Gravitational PE -> Kinetic -> Electrical', 'Kopili Hydroelectric Plant turbines'],
            ['Electromagnetic -> Chemical PE', 'Tea plants in Dibrugarh photosynthesising sunlight'],
            ['Chemical PE -> Kinetic + Thermal', 'A Kaziranga rhino running after eating grass'],
            ['Electrical -> Electromagnetic', 'LED streetlights along Guwahati\'s GS Road'],
          ],
        },
      },
    },

    // ── Section 4: Power and Efficiency ────────────────────────
    {
      title: 'Power and Efficiency',
      beginnerContent:
        '**Power** is the rate at which work is done or energy is transferred. It answers: *how fast* is energy being used?\n\n' +
        '> **Power = Work / Time** (measured in Watts; 1 W = 1 J/s)\n\n' +
        '**Analogy:** Two porters carry identical 30 kg sacks of rice up a 10 m staircase at a Sivasagar warehouse. One takes 20 seconds, the other takes 60 seconds. Both do the same work (about 2,943 J), but the fast porter\'s power output is 3x higher.\n\n' +
        '| Porter | Work done (J) | Time (s) | Power (W) |\n' +
        '|--------|-------------|---------|----------|\n' +
        '| Fast porter | 2,943 | 20 | **147 W** |\n' +
        '| Slow porter | 2,943 | 60 | **49 W** |\n\n' +
        'Some everyday power comparisons:\n\n' +
        '| Source | Power | Context |\n' +
        '|--------|------|---------|\n' +
        '| Human at rest | ~80 W | Just keeping alive — heart, brain, breathing |\n' +
        '| Cycling steadily | ~75 W | Enough to power a laptop |\n' +
        '| Sprinting upstairs | ~500 W | Short bursts only |\n' +
        '| LED bulb | 10 W | Same brightness as 60 W incandescent |\n' +
        '| Ceiling fan | 75 W | Typical Indian ceiling fan |\n' +
        '| Kopili HEP | 275,000,000 W | Powers much of central Assam |\n\n' +
        '**Efficiency** measures how much input energy becomes *useful* output:\n\n' +
        '> **Efficiency = (useful output / total input) x 100%**\n\n' +
        'No real machine is 100% efficient — some energy always escapes as waste heat.\n\n' +
        '| Device | Efficiency | Where the rest goes |\n' +
        '|--------|-----------|--------------------|\n' +
        '| Incandescent bulb | ~5% | 95% becomes heat (hot to touch) |\n' +
        '| LED bulb | ~40% | 60% becomes heat (cool to touch) |\n' +
        '| Petrol car engine | ~25% | 75% lost as heat via exhaust and radiator |\n' +
        '| Electric motor | ~90% | Very little waste heat |\n' +
        '| Human body (exercise) | ~25% | 75% becomes body heat (why you sweat) |\n' +
        '| Hydroelectric turbine | ~90% | Among the most efficient machines ever built |\n\n' +
        '**Quick check:** An incandescent bulb and an LED both light a room equally. The incandescent uses 60 W, the LED uses 10 W. Where does the extra 50 W go in the incandescent?\n\n' +
        '*It becomes heat. The incandescent bulb is essentially a heater that happens to glow.*',
      intermediateContent:
        '**Two forms of the power equation:**\n\n' +
        '| Formula | When to use it |\n' +
        '|---------|---------------|\n' +
        '| P = W/t | When you know total work and time |\n' +
        '| P = Fv | When you know force and velocity (instantaneous power) |\n\n' +
        '**Worked example 1 — cyclist on a Guwahati road:**\n\n' +
        'A cyclist pedals at 20 km/h (5.56 m/s) against 30 N total drag.\n' +
        '- P = Fv = 30 x 5.56 = **167 W**\n\n' +
        'At 40 km/h (11.1 m/s), air drag roughly quadruples to ~120 N:\n' +
        '- P = 120 x 11.1 = **1,333 W**\n\n' +
        '| Speed | Drag (N) | Power (W) | Ratio |\n' +
        '|-------|---------|----------|-------|\n' +
        '| 20 km/h | 30 | 167 | 1x |\n' +
        '| 40 km/h | ~120 | 1,333 | **8x** |\n\n' +
        'Doubling speed requires **8x the power** (because drag is proportional to v², and P = Fv, so P is proportional to v³).\n\n' +
        '**Worked example 2 — hydroelectric power:**\n\n' +
        'The Kopili dam: head h = 200 m, flow Q = 160 m³/s, turbine efficiency eta = 0.9.\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|-----------|--------|\n' +
        '| Available power | P = rho x g x Q x h = 1000 x 9.81 x 160 x 200 | **313.9 MW** |\n' +
        '| After turbine efficiency | 313.9 x 0.9 | **282.5 MW** |\n' +
        '| Actual rated capacity | | **275 MW** (close!) |\n\n' +
        '**Worked example 3 — LED vs incandescent cost:**\n\n' +
        'Both produce ~800 lumens. Running 8 hours/day for a year at Rs 6/kWh:\n\n' +
        '| Bulb | Power | Daily energy | Annual energy | Annual cost |\n' +
        '|------|-------|-------------|--------------|------------|\n' +
        '| Incandescent | 60 W | 0.48 kWh | 175.2 kWh | **Rs 1,051** |\n' +
        '| LED | 10 W | 0.08 kWh | 29.2 kWh | **Rs 175** |\n' +
        '| **Savings** | | | **146 kWh** | **Rs 876/year** |',
      advancedContent:
        '**The Carnot cycle** defines the theoretical maximum efficiency for any heat engine:\n\n' +
        '> eta_Carnot = 1 - T_C / T_H\n\n' +
        'where T_C and T_H are cold and hot reservoir temperatures (in Kelvin). No real engine can exceed this.\n\n' +
        '| Engine type | T_H | T_C | Carnot limit | Actual efficiency |\n' +
        '|-------------|-----|-----|-------------|-------------------|\n' +
        '| Car petrol engine | ~600 K | ~300 K | 50% | **~25%** |\n' +
        '| Coal power plant | ~800 K | ~300 K | 62.5% | **~33%** |\n' +
        '| Combined-cycle gas turbine | ~1700 K | ~300 K | 82% | **~60%** |\n' +
        '| Carnot engine (ideal) | any | any | 100% at T_C=0 K | Impossible to reach |\n\n' +
        '**Coefficient of Performance (COP)** for a refrigerator:\n\n' +
        'COP = T_C / (T_H - T_C). At T_C = 273 K (fridge interior), T_H = 300 K (room):\n' +
        'COP_max = 273 / 27 = **10.1** — meaning 10 J of cooling per 1 J of electrical work (maximum). Real fridges achieve COP = 2-4.\n\n' +
        '**Exergy** (available work) quantifies how much energy can *theoretically* become useful work. Hot water at 80 degrees C in a 20 degrees C room has thermal energy mcDeltaT, but not all of it is available — some must be rejected to the cold reservoir. The **second-law efficiency** eta_II = actual work / exergy measures how close a real process comes to the thermodynamic ideal.\n\n' +
        'Combined-cycle gas turbine plants achieve eta_II > 60% — the highest of any thermal power technology, because they extract work from *both* the high-temperature gas expansion and the lower-temperature steam cycle using exhaust heat.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A 100 W bulb always does more total work than a 60 W bulb.', answer: false, explanation: 'Power is energy per unit time. The 60 W bulb running for 10 hours delivers 600 Wh; the 100 W bulb running for 2 hours delivers only 200 Wh. Total work depends on both power AND time.' },
            { text: 'A hydroelectric turbine at 90% efficiency is more efficient than a car engine at 25%.', answer: true, explanation: 'Hydroelectric turbines convert gravitational PE to electricity with very little waste. Car engines lose ~75% of fuel energy as heat through the exhaust and radiator.' },
            { text: 'The Carnot efficiency of a heat engine can reach 100% if the hot reservoir is hot enough.', answer: false, explanation: 'eta = 1 - T_C/T_H. For 100%, you would need T_C = 0 K (absolute zero), which is physically impossible to achieve. Or T_H = infinity, also impossible.' },
            { text: 'Power equals force times velocity.', answer: true, explanation: 'P = W/t = (F x d)/t = F x (d/t) = F x v. This instantaneous form is useful when force and velocity are known directly.' },
          ],
        },
      },
    },

    // ── Section 5: Renewable Energy — Rivers, Sun, and Biomass ──────────
    {
      title: 'Renewable Energy — Rivers, Sun, and Biomass',
      diagram: 'HydroelectricDiagram',
      beginnerContent:
        'Northeast India is one of the most energy-rich regions in the country. Its steep terrain, heavy rainfall, and abundant biomass create ideal conditions for renewable energy.\n\n' +
        '**Hydroelectric power** leads the way:\n\n' +
        '| Dam / Project | State | Capacity (MW) | River |\n' +
        '|--------------|-------|--------------|-------|\n' +
        '| Kopili HEP | Assam | 275 | Kopili |\n' +
        '| Ranganadi HEP | Arunachal Pradesh | 405 | Ranganadi |\n' +
        '| Subansiri Lower (planned) | Assam-Arunachal border | 2,000 | Subansiri |\n' +
        '| Pare HEP | Arunachal Pradesh | 110 | Pare |\n' +
        '| Doyang HEP | Nagaland | 75 | Doyang |\n\n' +
        'The Brahmaputra and its tributaries drop thousands of metres from the Himalayan plateau to the Assam plains, carrying enormous gravitational PE. NE India produces about **40% of India\'s total hydroelectric output**.\n\n' +
        '**How it works (energy conservation in action):**\n' +
        '1. Water at height h stores gravitational PE = mgh\n' +
        '2. It falls through penstocks (large pipes), gaining KE\n' +
        '3. KE spins turbine blades (rotational KE)\n' +
        '4. Generators convert rotational KE to electrical energy via electromagnetic induction\n\n' +
        '**Solar energy** is growing fast. Assam receives 4-5 kWh/m²/day of solar radiation. Floating solar installations on reservoirs, beels (oxbow lakes), and wetlands are especially promising — the water cools panels (improving efficiency by 5-10%), no farmland is lost, and panel shade reduces water evaporation.\n\n' +
        '**Biomass** is the traditional energy source. Over 70% of rural Assam households use wood, bamboo, or rice husk for cooking. The shift from open burning (~10% efficient) to gasification (~65% efficient) is a direct application of thermodynamic efficiency.\n\n' +
        '| Resource | Annual production in Assam | Energy potential |\n' +
        '|----------|--------------------------|------------------|\n' +
        '| Rice husk | ~1 million tonnes | ~100 MW of electricity |\n' +
        '| Bamboo waste | Abundant | Gasification fuel |\n' +
        '| Cattle dung | Millions of tonnes | Biogas for cooking |\n' +
        '| Solar radiation | 4-5 kWh/m²/day | Floating solar on beels |',
      intermediateContent:
        '**Hydropower calculation: P = eta x rho x g x Q x h**\n\n' +
        '| Variable | Meaning | Typical value |\n' +
        '|----------|---------|---------------|\n' +
        '| eta | Turbine efficiency | 0.85-0.92 |\n' +
        '| rho | Water density | 1000 kg/m³ |\n' +
        '| g | Gravitational acceleration | 9.81 m/s² |\n' +
        '| Q | Flow rate | m³/s (varies by season) |\n' +
        '| h | Head (height drop) | metres |\n\n' +
        '**Worked example — Kopili HEP:**\n' +
        'h = 200 m, Q = 160 m³/s, eta = 0.9\n' +
        'P = 0.9 x 1000 x 9.81 x 160 x 200 = **282 MW** (rated: 275 MW)\n\n' +
        '**Worked example — rooftop solar in Guwahati:**\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| Panel area | 10 m² |\n' +
        '| Panel efficiency | 20% |\n' +
        '| Peak irradiance | 1000 W/m² |\n' +
        '| Peak output | 10 x 1000 x 0.2 = **2,000 W (2 kW)** |\n' +
        '| Average daily insolation (Assam) | 4.5 kWh/m² |\n' +
        '| Daily yield | 10 x 4.5 x 0.2 = **9 kWh/day** |\n' +
        '| Monthly yield | 9 x 30 = **270 kWh/month** |\n' +
        '| Average Assam household consumption | ~120 kWh/month |\n' +
        '| Surplus | **150 kWh** (can sell back to grid) |\n\n' +
        '**Worked example — biogas from cattle dung:**\n' +
        '1 kg dung produces ~40 litres of biogas (60% methane).\n' +
        'Energy: 40 x 0.6 x 35.8 MJ/m³ x 10⁻³ = **0.86 MJ = 0.24 kWh** — enough to cook one meal.\n' +
        'A household with 3 cows producing 10 kg dung/day: 10 x 0.24 = **2.4 kWh/day** of cooking fuel — replacing firewood entirely.\n\n' +
        '**Renewable sources comparison:**\n\n' +
        '| Source | Capacity factor | Advantage | Challenge |\n' +
        '|--------|----------------|-----------|----------|\n' +
        '| Hydropower | 30-60% | High power, reliable | Seasonal flow, displacement |\n' +
        '| Solar PV | 15-20% | Scalable, low maintenance | Monsoon clouds, land use |\n' +
        '| Biomass | 60-80% | Uses waste, baseload | Supply chain, emissions |\n' +
        '| Small hydro (<25 MW) | 40-60% | Low impact, local power | Limited capacity |',
      advancedContent:
        '**Capacity factor** = actual output / theoretical maximum. This single number determines how much energy a source really delivers:\n\n' +
        '| Source | Capacity factor | 1 GW nameplate delivers annually |\n' +
        '|--------|----------------|----------------------------------|\n' +
        '| Nuclear | 80-90% | ~7,500 GWh |\n' +
        '| Hydropower | 30-60% | ~3,900 GWh |\n' +
        '| Wind (onshore) | 25-45% | ~3,100 GWh |\n' +
        '| Solar PV | 15-25% | ~1,750 GWh |\n\n' +
        'A 1 GW solar farm produces the same annual energy as a ~250 MW nuclear plant.\n\n' +
        '**Levelized Cost of Energy (LCOE)** — the true cost comparison:\n\n' +
        '| Source | LCOE (India, 2024) | Trend |\n' +
        '|--------|-------------------|-------|\n' +
        '| Utility solar | Rs 2-3/kWh | Falling 10%/year |\n' +
        '| Onshore wind | Rs 3-4/kWh | Stable |\n' +
        '| Coal thermal | Rs 4-5/kWh | Rising (fuel + carbon) |\n' +
        '| Small hydro | Rs 3-5/kWh | Stable |\n\n' +
        'Renewables are now *cheaper* than fossil fuels in India — the transition is economic, not just environmental.\n\n' +
        '**The intermittency challenge:**\n\n' +
        'Solar output varies from 0 (night) to peak (noon). Grid-scale storage solutions:\n\n' +
        '| Technology | Round-trip efficiency | Storage duration | NE India suitability |\n' +
        '|-----------|---------------------|-----------------|---------------------|\n' +
        '| Pumped-storage hydro | ~80% | Hours to days | Excellent — existing reservoirs |\n' +
        '| Li-ion batteries | ~90% | Hours | Good for urban, expensive at scale |\n' +
        '| Green hydrogen | ~35% (electrolysis + fuel cell) | Days to months | Emerging — long-duration storage |\n' +
        '| Compressed air | ~70% | Hours | Needs suitable geology |\n\n' +
        'NE India\'s existing reservoir infrastructure is ideally suited for **pumped-storage hydro**: pump water uphill when solar exceeds demand; release through turbines during evening peaks. This is the most mature and cost-effective grid-scale storage technology.\n\n' +
        '**Green hydrogen** (H₂ from renewable electrolysis) stores ~33 kWh/kg — high energy density — and can be reconverted in fuel cells at ~60% efficiency or burned in modified turbines. It is the most promising medium for seasonal storage and heavy transport decarbonization.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The Subansiri Lower project, when completed, will be India\'s largest hydroelectric dam at 2,000 MW — enough to power over 2 million homes.',
            'Cherrapunji in Meghalaya receives ~11,777 mm of rain per year. If all that water fell from 500 m through turbines, the energy potential per square metre would be about 57,800 kWh/year.',
            'Assam\'s annual rice husk production (~1 million tonnes) could generate enough electricity to power 200,000 rural homes — currently most of it is burned inefficiently or discarded.',
            'A single floating solar panel on a beel (oxbow lake) produces 5-10% more electricity than the same panel on land, because the water keeps it cooler.',
          ],
        },
      },
    },
  ],
};
