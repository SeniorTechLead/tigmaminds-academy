import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'forces-and-motion',
  title: 'Forces & Motion',
  category: 'physics',
  icon: '🚀',
  tagline: 'Newton\'s laws, gravity, friction, and why woodpeckers don\'t get headaches.',
  relatedStories: ['woodpeckers-drum', 'the-little-boat', 'kite-festival', 'flying-squirrel', 'lotus-float', 'ferrymans-riddle'],
  understand: [
    // ── Section 1: Newton's First Law ─────────────────────────────
    {
      title: 'Newton\'s First Law — Inertia',
      beginnerContent:
        'Imagine you are sitting on a ferry crossing the Brahmaputra. The ferry is moving steadily. You don\'t feel any motion — you could close your eyes and think you were sitting on the bank. But when the ferry suddenly slows to dock, you lurch forward. Why? Because **your body was moving with the ferry**, and when the ferry stopped, your body wanted to keep going.\n\n' +
        'This is **Newton\'s First Law**, also called the **law of inertia**: an object at rest stays at rest, and an object in motion keeps moving in a straight line at constant speed, **unless a force acts on it**.\n\n' +
        '**Analogy:** Think of inertia as laziness — objects are "lazy" and resist any change. A parked bicycle doesn\'t start moving on its own. A rolling ball doesn\'t stop on its own (it\'s friction that stops it).\n\n' +
        '| Situation | What you observe | Inertia explanation |\n' +
        '|-----------|-----------------|---------------------|\n' +
        '| Bus brakes suddenly | You lurch forward | Your body resists the change from moving to stopped |\n' +
        '| Tablecloth trick | Plates stay on table | Plates resist being set in motion |\n' +
        '| Shaking a wet umbrella | Water droplets fly off | Droplets resist the change in direction |\n' +
        '| Coin on cardboard over glass | Coin drops into glass when card is flicked | Coin resists horizontal motion, gravity pulls it down |\n\n' +
        'Inertia depends on **mass**: heavier objects resist changes more. A loaded truck needs far more braking force than a bicycle at the same speed.\n\n' +
        '| Object | Mass | Ease of stopping at 30 km/h |\n' +
        '|--------|------|----------------------------|\n' +
        '| Cricket ball | 0.16 kg | Very easy — catch it with one hand |\n' +
        '| Bicycle + rider | 80 kg | Moderate — squeeze both brakes |\n' +
        '| Auto-rickshaw | 400 kg | Hard — needs good brakes |\n' +
        '| Loaded truck | 20,000 kg | Very hard — long stopping distance |\n\n' +
        '**In space**, where there is no friction or air resistance, a spacecraft launched at a certain speed will coast at that speed **forever** unless something pushes or pulls it. The Voyager 1 probe, launched in 1977, is still drifting at 61,000 km/h with its engines off — pure inertia.',
      intermediateContent:
        'Newton\'s First Law is really a special case of the Second Law when net force is zero: if **ΣF = 0**, then **a = 0**, meaning velocity stays constant (or zero).\n\n' +
        '**Worked example — balanced forces on a ferry:**\n\n' +
        'A Brahmaputra ferry (mass 5,000 kg) cruises at constant 8 m/s. The engine provides 3,000 N forward thrust. Water drag = 2,400 N backward. Air resistance = 600 N backward.\n\n' +
        '`ΣF = 3,000 − 2,400 − 600 = 0 N`\n\n' +
        'Net force is zero, so acceleration is zero — the ferry moves at constant speed. This is Newton\'s First Law in action.\n\n' +
        'Now the engine cuts out:\n\n' +
        '`ΣF = 0 − 2,400 − 600 = −3,000 N`\n' +
        '`a = F/m = −3,000 / 5,000 = −0.6 m/s²`\n\n' +
        'The ferry decelerates at 0.6 m/s². Time to stop: `t = v/a = 8/0.6 = 13.3 seconds`.\n\n' +
        '**Inertial vs non-inertial frames:**\n\n' +
        '| Frame type | Example | Newton\'s 1st Law holds? |\n' +
        '|------------|---------|------------------------|\n' +
        '| **Inertial** | Ground (approximately), a train at constant speed | Yes |\n' +
        '| **Non-inertial** | Accelerating car, spinning merry-go-round | No — objects seem to move without forces |\n\n' +
        '| Inertia quantity | Formula | Units | What it measures |\n' +
        '|-----------------|---------|-------|------------------|\n' +
        '| Mass (translational) | m | kg | Resistance to linear acceleration |\n' +
        '| Moment of inertia (rotational) | I = Σmr² | kg·m² | Resistance to angular acceleration |\n\n' +
        'A 20,000 kg truck at 30 m/s has the same speed as a 0.16 kg cricket ball at 30 m/s, but stopping the truck requires **125,000× more force** over the same time (because force = mass × deceleration).',
      advancedContent:
        'In **non-inertial reference frames** (accelerating frames), Newton\'s First Law appears to break down — objects seem to accelerate without any real force. To fix the math, we introduce **pseudo-forces** (fictitious forces).\n\n' +
        '| Pseudo-force | Formula | Where it appears |\n' +
        '|-------------|---------|------------------|\n' +
        '| Centrifugal | F = −m**ω** × (**ω** × **r**) | Rotating frames — pushes outward |\n' +
        '| Coriolis | F = −2m(**ω** × **v**) | Moving objects in rotating frames — deflects sideways |\n' +
        '| Translational | F = −m**a**_frame | Linearly accelerating frames |\n\n' +
        'These are not real forces — no physical interaction produces them — but they are essential for calculations inside rotating systems like Earth. The Coriolis effect deflects cyclones clockwise in the Southern Hemisphere and counter-clockwise in the Northern — including the devastating cyclones that hit the Bay of Bengal and affect Assam\'s monsoon patterns.\n\n' +
        '**Relativistic inertia:** In special relativity, inertia increases with speed. The relativistic momentum is **p = γmv**, where γ = 1/√(1 − v²/c²).\n\n' +
        '| Speed (% of c) | γ factor | Effective inertia |\n' +
        '|----------------|----------|-------------------|\n' +
        '| 10% | 1.005 | Nearly classical |\n' +
        '| 50% | 1.155 | 15% more than rest mass |\n' +
        '| 90% | 2.294 | 2.3× rest mass |\n' +
        '| 99% | 7.089 | 7× rest mass |\n' +
        '| 99.99% | 70.71 | 71× rest mass |\n\n' +
        'This is why particle accelerators need exponentially more energy to push particles closer to light speed — the effective inertia grows without bound as v → c. At CERN\'s LHC, protons circulate at 99.9999991% of c, with γ ≈ 7,454.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each everyday situation to the inertia principle it demonstrates',
          pairs: [
            ['Lurch forward when bus brakes', 'Body in motion resists stopping (moving inertia)'],
            ['Ketchup won\'t come out until you shake the bottle', 'Ketchup at rest resists being set in motion (rest inertia)'],
            ['Heavier shopping bag is harder to swing', 'Greater mass = greater resistance to acceleration'],
            ['Spacecraft coasts forever after engines off', 'No friction in space, so no force to change motion'],
          ],
        },
      },
    },

    // ── Section 2: Newton's Second Law ────────────────────────────
    {
      title: 'Newton\'s Second Law — Force, Mass, Acceleration',
      diagram: 'WorkForceDiagram',
      beginnerContent:
        'Newton\'s Second Law answers the question: **how much** does a force change an object\'s motion?\n\n' +
        '> **F = m × a** — Force equals mass times acceleration\n\n' +
        'This one equation is the foundation of nearly all engineering. It tells you three things:\n\n' +
        '| If you... | Then... | Example |\n' +
        '|-----------|---------|--------|\n' +
        '| Apply more force to the same mass | Acceleration increases | Kick a football harder → it goes faster |\n' +
        '| Apply the same force to more mass | Acceleration decreases | Kick a bowling ball with the same force → barely moves |\n' +
        '| Want more acceleration with more mass | You need more force | A truck engine is far more powerful than a scooter\'s |\n\n' +
        '**Analogy:** Imagine pushing a shopping cart at Fancy Bazaar in Guwahati. An empty cart is easy to push (low mass, high acceleration). Load it with 50 kg of rice and try again — same push, much slower acceleration. Want the loaded cart to accelerate just as fast? Push much harder.\n\n' +
        '**Everyday F = ma:**\n\n' +
        '| Situation | Force (N) | Mass (kg) | Acceleration (m/s²) |\n' +
        '|-----------|-----------|-----------|---------------------|\n' +
        '| Kicking a football | 900 | 0.45 | 2,000 |\n' +
        '| Pushing a chair | 20 | 5 | 4 |\n' +
        '| Car engine accelerating | 4,000 | 1,000 | 4 |\n' +
        '| Rocket at liftoff | 35,000,000 | 2,800,000 | 12.5 |\n\n' +
        '**Prediction:** If you double the force on the same object, what happens to the acceleration? It doubles. If you double the mass but keep the same force? Acceleration halves. Test this next time you push a swing — push harder or add weight.',
      intermediateContent:
        'The full vector form is **ΣF = ma** — the **net** force (sum of all forces) determines acceleration.\n\n' +
        '**Worked example 1 — kicking a football vs a bowling ball:**\n\n' +
        'A player kicks with 900 N for 0.01 s.\n\n' +
        '| Object | Mass (kg) | a = F/m (m/s²) | v = at (m/s) | v in km/h |\n' +
        '|--------|-----------|----------------|-------------|----------|\n' +
        '| Football | 0.45 | 2,000 | 20 | 72 |\n' +
        '| Bowling ball | 6.0 | 150 | 1.5 | 5.4 |\n\n' +
        'Same force, 13× difference in speed — that\'s mass in action.\n\n' +
        '**Worked example 2 — ferry acceleration on the Brahmaputra:**\n\n' +
        'A 5,000 kg ferry needs to reach 10 m/s from rest. Engine thrust = 8,000 N, water drag = 3,000 N.\n\n' +
        '`ΣF = 8,000 − 3,000 = 5,000 N`\n' +
        '`a = ΣF/m = 5,000/5,000 = 1.0 m/s²`\n' +
        '`Time to reach 10 m/s: t = v/a = 10/1.0 = 10 seconds`\n\n' +
        '**The impulse form** is also useful: **F × Δt = m × Δv** (force × time = change in momentum).\n\n' +
        '| Scenario | Δv (m/s) | Δt (s) | Peak force | Injury risk |\n' +
        '|----------|----------|--------|-----------|-------------|\n' +
        '| Car crash into wall | 15 | 0.05 | 30,000 N | Fatal |\n' +
        '| Car crash with airbag | 15 | 0.3 | 5,000 N | Survivable |\n' +
        '| Jumping onto concrete | 3 | 0.01 | 24,000 N | Leg fracture |\n' +
        '| Jumping onto grass | 3 | 0.1 | 2,400 N | Safe landing |\n\n' +
        'Airbags save lives by increasing collision time Δt, reducing peak force for the same momentum change.',
      advancedContent:
        'Newton\'s Second Law in its most general form is **F = dp/dt** — force equals the rate of change of momentum. This handles cases where mass changes, like a rocket burning fuel.\n\n' +
        '**Rocket equation (Tsiolkovsky):**\n\n' +
        '`Δv = v_exhaust × ln(m_initial / m_final)`\n\n' +
        '| Rocket stage | m_initial (kg) | m_final (kg) | v_exhaust (m/s) | Δv (m/s) |\n' +
        '|-------------|----------------|-------------|-----------------|----------|\n' +
        '| ISRO PSLV Stage 1 | 295,000 | 97,000 | 2,700 | 3,006 |\n' +
        '| Stage 2 | 45,000 | 8,000 | 2,950 | 5,134 |\n' +
        '| Combined | | | | **8,140** |\n\n' +
        'You need ~7,800 m/s to reach orbit — this is why rockets need multiple stages.\n\n' +
        '**Beyond F = ma — Lagrangian mechanics:**\n\n' +
        'In university physics, F = ma is replaced by the **Euler-Lagrange equation**:\n\n' +
        '`d/dt(∂L/∂q̇) − ∂L/∂q = 0`\n\n' +
        'where L = T − V (kinetic minus potential energy).\n\n' +
        '| Formulation | Best for | Advantage |\n' +
        '|------------|---------|----------|\n' +
        '| **Newtonian** (F = ma) | Simple point masses, free bodies | Intuitive, works with vectors |\n' +
        '| **Lagrangian** (L = T − V) | Constrained systems (pendulums, rolling wheels) | Handles constraints elegantly |\n' +
        '| **Hamiltonian** (H = T + V) | Quantum mechanics, statistical mechanics | Phase-space formulation, conserved quantities |\n\n' +
        'In quantum mechanics, F = ma has no direct analogue — instead, the time evolution of a particle\'s state follows the **Schrodinger equation**: iℏ ∂ψ/∂t = Ĥψ. The expectation values of position and momentum still obey Newton\'s law on average (Ehrenfest\'s theorem), bridging classical and quantum physics.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'If you double the force on an object, its acceleration doubles (mass unchanged).', answer: true, explanation: 'F = ma: doubling F with constant m doubles a. This is the direct proportionality in Newton\'s Second Law.' },
            { text: 'A 10 kg object and a 1 kg object need the same force to reach the same speed.', answer: false, explanation: 'They need the same impulse (F×t) for the same speed change, but if the time is the same, the heavier object needs 10× the force (F = ma).' },
            { text: 'An airbag reduces the total momentum change in a crash.', answer: false, explanation: 'The momentum change is the same (determined by the collision). The airbag increases the time over which the change happens, reducing peak force (F = Δp/Δt).' },
            { text: 'A rocket can accelerate in space even though there is nothing to push against.', answer: true, explanation: 'The rocket pushes exhaust gas backward; by Newton\'s Third Law, the gas pushes the rocket forward. No external surface is needed.' },
          ],
        },
      },
    },

    // ── Section 3: Newton's Third Law ─────────────────────────────
    {
      title: 'Newton\'s Third Law — Action and Reaction',
      diagram: 'NewtonForceDiagram',
      beginnerContent:
        'For every action, there is an **equal and opposite reaction**. This is the most quoted — and most misunderstood — law in physics.\n\n' +
        '**Key point:** The two forces act on *different* objects. They never cancel each other out.\n\n' +
        '| Action force | Reaction force | Acts on |\n' +
        '|-------------|---------------|--------|\n' +
        '| You push the ground backward (walking) | Ground pushes you forward | You ≠ Ground |\n' +
        '| Rocket pushes exhaust gas downward | Exhaust pushes rocket upward | Rocket ≠ Gas |\n' +
        '| Woodpecker strikes tree with beak | Tree pushes back on beak with equal force | Bird ≠ Tree |\n' +
        '| Bat hits cricket ball | Ball pushes back on bat | Bat ≠ Ball |\n' +
        '| Majuli ferry propeller pushes water backward | Water pushes ferry forward | Ferry ≠ Water |\n\n' +
        '**The woodpecker puzzle:** A woodpecker strikes a tree trunk at up to 20 times per second. Each strike hits with a force of ~400 N — and the tree pushes back with exactly 400 N. How does the bird survive?\n\n' +
        '| Shock-absorber feature | How it helps |\n' +
        '|-----------------------|-------------|\n' +
        '| Thick, slightly flexible beak | Spreads impact over longer time |\n' +
        '| Hyoid bone wrapping around skull | Distributes force like a seatbelt |\n' +
        '| Spongy bone behind beak | Absorbs kinetic energy as deformation |\n' +
        '| Tiny brain mass | Even at 1,200 g, force on brain stays below injury threshold |\n\n' +
        'Engineers have studied woodpecker skulls to design better protective helmets and shock absorbers for electronics.\n\n' +
        '**Common mistake:** Students often think action-reaction forces cancel out. They don\'t — because they act on different objects. The ground pushes you up (that\'s why you don\'t fall through the floor), but it\'s pushing *you*, not cancelling *your weight*.',
      intermediateContent:
        'The Third Law means forces always come in **action-reaction pairs** that act on *different* objects.\n\n' +
        '**Worked example 1 — standing on the floor:**\n\n' +
        'You (60 kg) stand on a floor. Your weight pushes down: W = mg = 60 × 9.8 = **588 N**.\n' +
        'The floor\'s normal force pushes you up: N = **588 N**.\n\n' +
        'These are equal and opposite, but act on different bodies (you and the floor), so they do NOT cancel.\n\n' +
        '**Worked example 2 — ISRO rocket thrust:**\n\n' +
        'A rocket engine has exhaust mass flow rate ṁ = 500 kg/s at exhaust velocity v_e = 3,000 m/s.\n\n' +
        '`Thrust F = ṁ × v_e = 500 × 3,000 = 1,500,000 N (1.5 MN)`\n\n' +
        'The gas is pushed backward with 1.5 MN. The rocket is pushed forward with 1.5 MN. Equal and opposite, on different objects.\n\n' +
        '**Distinguishing force pairs:**\n\n' +
        '| Scenario | Force pair 1 (action-reaction) | Force pair 2 (NOT a pair) |\n' +
        '|----------|-------------------------------|---------------------------|\n' +
        '| Book on table | Book pushes table down / Table pushes book up | Book\'s weight / Table\'s normal force (same object!) |\n' +
        '| Horse pulling cart | Horse pulls cart forward / Cart pulls horse backward | Ground friction on horse / Ground friction on cart |\n' +
        '| Swimming | Hand pushes water backward / Water pushes hand forward | Drag on body / Thrust from stroke |\n\n' +
        '**Why does the horse-cart system move?** The horse pushes backward on the ground (Third Law: ground pushes horse forward). This forward friction on the horse exceeds the backward pull from the cart. Net force on the horse is forward → the system accelerates.',
      advancedContent:
        'Newton\'s Third Law has deep connections to **symmetry principles**.\n\n' +
        'In Lagrangian mechanics, it follows from the assumption that the potential energy between two particles depends only on their separation: V = V(|r₁ − r₂|). This leads to **F₁₂ = −F₂₁** automatically.\n\n' +
        '**Noether\'s theorem connections:**\n\n' +
        '| Symmetry | Conservation law | Newton\'s law involved |\n' +
        '|----------|-----------------|----------------------|\n' +
        '| Translational (space is uniform) | Momentum | Third Law (forces balance → total p constant) |\n' +
        '| Rotational (space is isotropic) | Angular momentum | Torque pairs cancel |\n' +
        '| Time translation (laws don\'t change) | Energy | Second Law (work-energy theorem) |\n\n' +
        '**Where the Third Law breaks down:**\n\n' +
        'The Third Law fails for **moving charges in electrodynamics**. The magnetic force between two moving charges is NOT equal and opposite in general.\n\n' +
        '| System | Third Law holds? | Why |\n' +
        '|--------|-----------------|-----|\n' +
        '| Contact forces (push, pull) | Yes | Direct interaction |\n' +
        '| Gravitational (static) | Yes | Central force |\n' +
        '| Electrostatic (Coulomb) | Yes | Central force |\n' +
        '| Magnetic (moving charges) | **No** | Fields carry momentum |\n' +
        '| Radiation pressure | **No** | Photon momentum transfer |\n\n' +
        'The "missing" momentum is carried by the **electromagnetic field** itself (Poynting vector). The full momentum conservation includes field momentum: **p_total = p_particles + ε₀∫(E × B)dV**. This was a major puzzle in 19th-century physics that Maxwell resolved by showing fields carry energy and momentum.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each action to its reaction force',
          pairs: [
            ['You push the wall', 'The wall pushes you back with equal force'],
            ['Rocket pushes exhaust gas downward', 'Exhaust gas pushes rocket upward'],
            ['Earth pulls you downward (gravity)', 'You pull Earth upward with equal force'],
            ['Swimmer pushes water backward', 'Water pushes swimmer forward'],
          ],
        },
      },
    },

    // ── Section 4: Gravity ────────────────────────────────────────
    {
      title: 'Gravity — The Force That Shapes the Universe',
      beginnerContent:
        'Gravity is the attractive force between **any two objects that have mass**. You are gravitationally attracted to your chair, to your phone, and to the Brahmaputra River — but these objects are so light compared to Earth that you only feel Earth\'s pull.\n\n' +
        'Earth\'s gravity accelerates falling objects at about **9.8 m/s²** — meaning a dropped stone gains roughly 9.8 metres per second of speed for every second it falls (ignoring air resistance).\n\n' +
        '| After falling for... | Speed reached | Distance fallen |\n' +
        '|---------------------|--------------|----------------|\n' +
        '| 1 second | 9.8 m/s (35 km/h) | 4.9 m |\n' +
        '| 2 seconds | 19.6 m/s (71 km/h) | 19.6 m |\n' +
        '| 3 seconds | 29.4 m/s (106 km/h) | 44.1 m |\n' +
        '| 5 seconds | 49.0 m/s (176 km/h) | 122.5 m |\n\n' +
        '**Gravity on different worlds:**\n\n' +
        '| Location | Surface gravity (m/s²) | Your weight if 60 kg on Earth |\n' +
        '|----------|----------------------|------------------------------|\n' +
        '| Moon | 1.62 | 97 N (feels like 10 kg) |\n' +
        '| Mars | 3.72 | 223 N (feels like 23 kg) |\n' +
        '| **Earth** | **9.81** | **588 N (60 kg)** |\n' +
        '| Jupiter | 24.79 | 1,487 N (feels like 152 kg) |\n' +
        '| Sun (surface) | 274 | 16,440 N — you\'d be crushed flat |\n\n' +
        '**Key insight:** All objects fall at the same rate under gravity (ignoring air resistance). A feather and a hammer dropped on the Moon — where there is no air — hit the ground at the same time. Apollo 15 astronaut David Scott demonstrated this in 1971.\n\n' +
        '**Prediction:** Drop a cricket ball and a tennis ball from the same height at the same time. Which hits first? Try it — they hit simultaneously!',
      intermediateContent:
        '**Newton\'s Law of Universal Gravitation:**\n\n' +
        '> **F = G × m₁ × m₂ / r²**\n\n' +
        'where G = 6.674 × 10⁻¹¹ N·m²/kg²\n\n' +
        '**Worked example 1 — your weight on the Moon:**\n\n' +
        'Mass = 60 kg. Moon\'s surface gravity g_moon = 1.62 m/s².\n' +
        'Moon weight = 60 × 1.62 = **97.2 N** (about one-sixth of Earth weight).\n\n' +
        '**Worked example 2 — gravity at the ISS orbit (400 km up):**\n\n' +
        '`g = GM/r² = 6.674×10⁻¹¹ × 5.97×10²⁴ / (6,771,000)² ≈ 8.69 m/s²`\n\n' +
        'That\'s only 11% less than at the surface! Astronauts float NOT because there is no gravity, but because they are in **free fall** — the station falls around Earth continuously.\n\n' +
        '| Altitude | g (m/s²) | % of surface gravity |\n' +
        '|----------|---------|---------------------|\n' +
        '| 0 km (surface) | 9.81 | 100% |\n' +
        '| 10 km (airliner) | 9.78 | 99.7% |\n' +
        '| 400 km (ISS) | 8.69 | 88.6% |\n' +
        '| 35,786 km (geostationary) | 0.224 | 2.3% |\n' +
        '| 384,400 km (Moon\'s orbit) | 0.0027 | 0.027% |\n\n' +
        '**Orbital velocity** — how fast you must go to stay in orbit:\n\n' +
        '`v = √(GM/r)`\n\n' +
        '| Orbit | Altitude | Orbital speed | Period |\n' +
        '|-------|----------|--------------|--------|\n' +
        '| Low Earth (ISS) | 400 km | 7.67 km/s | 92 min |\n' +
        '| GPS satellites | 20,200 km | 3.87 km/s | 12 hr |\n' +
        '| Geostationary | 35,786 km | 3.07 km/s | 24 hr |\n' +
        '| Moon | 384,400 km | 1.02 km/s | 27.3 days |',
      advancedContent:
        'Einstein\'s **General Relativity** (1915) replaced Newton\'s gravitational force with the curvature of spacetime.\n\n' +
        'Mass and energy warp the fabric of spacetime according to the **Einstein field equations**:\n\n' +
        '`Gμν + Λgμν = (8πG/c⁴)Tμν`\n\n' +
        'Objects follow **geodesics** (straightest possible paths) through curved spacetime, which we perceive as gravitational attraction.\n\n' +
        '**Where Newton fails and Einstein succeeds:**\n\n' +
        '| Phenomenon | Newtonian prediction | General Relativity prediction | Observed |\n' +
        '|-----------|---------------------|------------------------------|----------|\n' +
        '| Mercury\'s orbit precession | 5,557\'/century | 5,600\'/century (+43\") | **5,600\'** |\n' +
        '| Light bending near Sun | 0.87\" | **1.75\"** | 1.75\" (Eddington 1919) |\n' +
        '| Gravitational time dilation | None | Clocks run slower in stronger gravity | GPS corrects +45 μs/day |\n' +
        '| Gravitational waves | None | Ripples in spacetime | **LIGO detected 2015** |\n' +
        '| Black holes | Undefined | Event horizon at r_s = 2GM/c² | Imaged by EHT 2019 |\n\n' +
        '**Gravitational time dilation — practical impact:**\n\n' +
        'GPS satellites orbit at 20,200 km where gravity is weaker. Their clocks run **faster** by 45 μs/day relative to ground clocks. Without GR corrections, GPS positions would drift by ~10 km/day — making navigation useless.\n\n' +
        '| Effect | Magnitude per day | Direction |\n' +
        '|--------|------------------|-----------|\n' +
        '| GR (weaker gravity = faster clock) | +45.0 μs | Clock runs fast |\n' +
        '| SR (orbital speed = slower clock) | −7.2 μs | Clock runs slow |\n' +
        '| **Net correction** | **+37.8 μs** | Must slow satellite clock |',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Astronauts on the ISS float because there is no gravity at 400 km altitude.', answer: false, explanation: 'Gravity at the ISS is still 89% of surface gravity. Astronauts float because they are in free fall — the station and everything in it falls around Earth together.' },
            { text: 'Your mass on the Moon is the same as on Earth.', answer: true, explanation: 'Mass is the amount of matter and doesn\'t change with location. Weight (the force of gravity on you) does change — you weigh 1/6 as much on the Moon.' },
            { text: 'A feather and a hammer dropped on the Moon hit the ground at the same time.', answer: true, explanation: 'With no air resistance, all objects fall at the same rate regardless of mass. Apollo 15 astronaut David Scott demonstrated this in 1971.' },
            { text: 'Gravity gets weaker as you move away from Earth, following an inverse-square law.', answer: true, explanation: 'F = GMm/r² — double the distance and gravity drops to 1/4. At the Moon\'s orbit (60× Earth\'s radius), gravity is only 1/3,600 of surface value.' },
          ],
        },
      },
    },

    // ── Section 5: Friction ───────────────────────────────────────
    {
      title: 'Friction — The Force That Slows Things Down',
      diagram: 'TrainFrictionDiagram',
      beginnerContent:
        'Friction is the force that resists motion when two surfaces slide or try to slide against each other. Without it, you couldn\'t walk, cars couldn\'t brake, and you couldn\'t hold a pen.\n\n' +
        '**Analogy:** Rub your palms together quickly. The heat you feel is friction converting kinetic energy into thermal energy.\n\n' +
        'There are two main types:\n\n' +
        '| Type | What it does | Strength | Example |\n' +
        '|------|-------------|----------|--------|\n' +
        '| **Static friction** | Prevents a stationary object from starting to move | Stronger | Trying to push a heavy almirah (wardrobe) |\n' +
        '| **Kinetic friction** | Slows a moving object | Weaker | Sliding the almirah once it\'s moving |\n\n' +
        'Static friction is always stronger than kinetic — this is why it takes more force to *start* pushing a heavy box than to *keep* it moving.\n\n' +
        '**Friction can be helpful or harmful:**\n\n' +
        '| Helpful friction | Harmful friction |\n' +
        '|-----------------|------------------|\n' +
        '| Shoes gripping the ground | Engine parts wearing down |\n' +
        '| Brakes stopping a vehicle | Rope burning your hands |\n' +
        '| Chalk writing on a blackboard | Wasted energy as heat in machines |\n' +
        '| Tyre grip on wet Guwahati roads | Knee joint cartilage wearing thin |\n\n' +
        'During the monsoon, Guwahati\'s hilly roads become dangerously slippery — water acts as a lubricant that reduces friction between tyres and the road. This is why accidents spike during heavy rain. Road engineers add rough textures and grooves to increase friction on wet surfaces.\n\n' +
        '**Lubricants** like oil, grease, or even water reduce friction between surfaces by creating a thin film that keeps the surfaces apart.',
      intermediateContent:
        'Friction is calculated using:\n\n' +
        '> **f = μ × N**\n\n' +
        'where μ is the coefficient of friction and N is the normal force.\n\n' +
        '| Friction type | Formula | Key feature |\n' +
        '|--------------|---------|-------------|\n' +
        '| Static | f_s ≤ μ_s × N | Can be any value up to the maximum |\n' +
        '| Kinetic | f_k = μ_k × N | Constant once sliding |\n\n' +
        '**Coefficient of friction for common surfaces:**\n\n' +
        '| Surface pair | μ_s (static) | μ_k (kinetic) |\n' +
        '|-------------|-------------|---------------|\n' +
        '| Rubber on dry concrete | 1.0 | 0.8 |\n' +
        '| Rubber on wet concrete | 0.7 | 0.5 |\n' +
        '| Wood on wood | 0.5 | 0.3 |\n' +
        '| Steel on steel | 0.74 | 0.57 |\n' +
        '| Ice on ice | 0.03 | 0.01 |\n' +
        '| Synovial joint (knee) | 0.01 | 0.003 |\n\n' +
        '**Worked example — pushing a box on a floor:**\n\n' +
        'A 50 kg box on a floor with μ_s = 0.4, μ_k = 0.3.\n\n' +
        '`Normal force N = mg = 50 × 9.8 = 490 N`\n' +
        '`Max static friction = μ_s × N = 0.4 × 490 = 196 N`\n' +
        '`Kinetic friction = μ_k × N = 0.3 × 490 = 147 N`\n\n' +
        'You need **more than 196 N** to start the box moving. Once sliding, only **147 N** of resistance.\n\n' +
        '**Friction on an incline:**\n\n' +
        'On a slope at angle θ:\n' +
        '- Gravity component along slope: mg sin θ\n' +
        '- Friction resistance: μ mg cos θ\n' +
        '- The box slides when **tan θ > μ_s**\n\n' +
        '| Slope angle | tan θ | Slides if μ_s < |\n' +
        '|------------|-------|----------------|\n' +
        '| 10° | 0.18 | 0.18 |\n' +
        '| 20° | 0.36 | 0.36 |\n' +
        '| 30° | 0.58 | 0.58 |\n' +
        '| 45° | 1.00 | 1.00 |',
      advancedContent:
        'At the microscopic level, friction arises from **surface asperities** — tiny peaks on even "smooth" surfaces that interlock and must be sheared apart.\n\n' +
        '| Scale | Friction mechanism | Model |\n' +
        '|-------|-------------------|-------|\n' +
        '| Macroscopic | Amontons\' laws: f = μN, independent of area | Empirical |\n' +
        '| Microscopic | Asperity interlocking, real contact area | Bowden-Tabor |\n' +
        '| Nanoscale | Atomic bond breaking, phonon generation | Tomlinson model |\n' +
        '| Quantum | Casimir forces, electron tunneling | Quantum tribology |\n\n' +
        'The real contact area between two surfaces is typically only **1-10%** of the apparent area. Friction force is proportional to this real contact area (which increases linearly with normal force, explaining Amontons\' laws).\n\n' +
        '**The Tomlinson model** describes atomic-scale friction as a tip dragged over a periodic potential: the tip "sticks" in energy wells and "slips" to the next one, producing characteristic **stick-slip motion**. This is the same physics behind:\n\n' +
        '| Phenomenon | Scale | Stick-slip mechanism |\n' +
        '|-----------|-------|---------------------|\n' +
        '| Violin bow on string | mm | Rosin provides stick; string vibration is the slip |\n' +
        '| Earthquake fault rupture | km | Tectonic plates lock then suddenly slip |\n' +
        '| Squeaky door hinge | cm | Metal surfaces alternately grip and release |\n' +
        '| Chattering brake disc | cm | Pad grips then skips |\n\n' +
        '**Superlubricity** — near-zero friction — occurs when two crystalline surfaces are rotated to incommensurate angles, so their atomic lattices never align. Graphite layers can achieve friction coefficients below **0.001** in this regime. This has applications in MEMS devices and nanomachinery where traditional lubricants cannot be used.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each friction concept to its description',
          pairs: [
            ['Static friction', 'Prevents a stationary object from moving — stronger than kinetic'],
            ['Kinetic friction', 'Opposes motion of a sliding object — constant value μ_k × N'],
            ['Coefficient of friction (μ)', 'A dimensionless number describing how "grippy" two surfaces are'],
            ['Normal force (N)', 'The perpendicular push between two surfaces in contact'],
            ['Lubricant', 'A substance (oil, grease) that reduces friction by separating surfaces'],
          ],
        },
      },
    },

    // ── Section 6: Momentum ───────────────────────────────────────
    {
      title: 'Momentum — Mass in Motion',
      beginnerContent:
        'Momentum is **mass multiplied by velocity**: **p = m × v**. It measures how hard something is to stop.\n\n' +
        '**Analogy:** Imagine you are standing on a road in Guwahati. Which would you rather be hit by — a slow bicycle or a fast truck? Your gut feeling is correct: the truck has far more momentum.\n\n' +
        '| Object | Mass (kg) | Speed (m/s) | Momentum (kg·m/s) |\n' +
        '|--------|-----------|------------|-------------------|\n' +
        '| Walking person | 60 | 1.5 | 90 |\n' +
        '| Cricket ball (fast bowl) | 0.16 | 40 | 6.4 |\n' +
        '| Bicycle + rider | 80 | 5 | 400 |\n' +
        '| Auto-rickshaw | 400 | 10 | 4,000 |\n' +
        '| ASTC bus | 10,000 | 15 | 150,000 |\n' +
        '| Indian Railways loco | 120,000 | 30 | 3,600,000 |\n\n' +
        'The **law of conservation of momentum** says: in any closed system, the total momentum before a collision equals the total momentum after. Momentum is never created or destroyed — only transferred.\n\n' +
        '| Collision type | What happens | Example |\n' +
        '|---------------|-------------|--------|\n' +
        '| **Elastic** | Objects bounce apart; both momentum and kinetic energy conserved | Billiard balls |\n' +
        '| **Inelastic** | Objects stick together or deform; momentum conserved, KE lost as heat/sound | Clay lumps, car crashes |\n\n' +
        'During Assam\'s **kite festivals**, a kite stays aloft because the momentum of the wind is transferred to the kite through aerodynamic forces. The kite string provides tension that balances the pull. Cut the string, and the kite drifts with the wind until friction and gravity bring it down.\n\n' +
        '**Check yourself:** A heavy bowling ball at 2 m/s and a light tennis ball at 20 m/s collide head-on. Which one reverses direction? *The lighter one — it has less momentum to resist the change.*',
      intermediateContent:
        'Momentum **p = mv** is a vector — direction matters.\n\n' +
        '**Conservation of momentum:** m₁v₁ + m₂v₂ = m₁v₁\' + m₂v₂\'\n\n' +
        '**Worked example — cricket ball hitting bat:**\n\n' +
        'A 0.16 kg cricket ball at 40 m/s hits a stationary 3 kg bat. The ball rebounds at −20 m/s. Find the bat\'s velocity.\n\n' +
        '`0.16 × 40 + 3 × 0 = 0.16 × (−20) + 3 × v₂\'`\n' +
        '`6.4 = −3.2 + 3v₂\'`\n' +
        '`v₂\' = 9.6/3 = 3.2 m/s`\n\n' +
        '**Verify momentum is conserved:** Before: 6.4 kg·m/s. After: 0.16×(−20) + 3×3.2 = −3.2 + 9.6 = 6.4 kg·m/s. ✓\n\n' +
        '**The impulse-momentum theorem:**\n\n' +
        '> **F × Δt = Δp = m × Δv**\n\n' +
        '| Sport technique | Purpose | How it uses impulse |\n' +
        '|----------------|---------|--------------------|\n' +
        '| Batsman "plays soft" | Reduce impact force | Increases contact time Δt → reduces F |\n' +
        '| Goalkeeper catches ball by moving hands back | Reduce sting | Increases Δt → reduces F |\n' +
        '| Boxer rolls with a punch | Avoid knockout | Increases Δt → reduces peak force on head |\n' +
        '| Jumping onto sand vs concrete | Avoid injury | Sand increases Δt → reduces F |\n\n' +
        '**Coefficient of restitution** (e) distinguishes collision types:\n\n' +
        '| Type | e value | KE conserved? | Example |\n' +
        '|------|---------|--------------|--------|\n' +
        '| Perfectly elastic | e = 1 | Yes | Ideal billiard balls |\n' +
        '| Partially elastic | 0 < e < 1 | Partially | Cricket ball on pitch (e ≈ 0.6) |\n' +
        '| Perfectly inelastic | e = 0 | Minimum (not zero) | Two clay lumps sticking |',
      advancedContent:
        'In **relativistic mechanics**, momentum becomes **p = γmv** where γ = 1/√(1 − v²/c²).\n\n' +
        '| Particle | Speed | γ | Effective momentum vs classical |\n' +
        '|---------|-------|---|--------------------------------|\n' +
        '| Electron in CRT | 0.1c | 1.005 | ~Classical |\n' +
        '| Proton in medical cyclotron | 0.3c | 1.048 | 5% higher |\n' +
        '| LHC proton | 0.9999999c | 7,454 | 7,454× classical |\n\n' +
        'Conservation of **four-momentum** (E/c, p_x, p_y, p_z) unifies energy and momentum conservation into a single Lorentz-invariant law.\n\n' +
        'The invariant mass from **E² = (pc)² + (mc²)²** lets physicists discover new particles: if two collision products have total energy E_total and total momentum p_total, any "missing" invariant mass reveals an unseen particle. This is exactly how the Higgs boson was found at CERN in 2012.\n\n' +
        '**Quantum momentum:**\n\n' +
        'In quantum mechanics, momentum is an **operator**: p̂ = −iℏ∂/∂x.\n\n' +
        '| Principle | Statement | Implication |\n' +
        '|----------|-----------|-------------|\n' +
        '| Heisenberg uncertainty | ΔxΔp ≥ ℏ/2 | Position and momentum cannot both be known precisely |\n' +
        '| De Broglie relation | λ = h/p | Every particle has a wavelength inversely proportional to momentum |\n' +
        '| Ehrenfest\'s theorem | ⟨F⟩ = d⟨p⟩/dt | Expectation values obey Newton\'s law on average |\n\n' +
        '| Particle | Momentum (kg·m/s) | De Broglie λ | Can we see wave behavior? |\n' +
        '|---------|-------------------|-------------|-------------------------|\n' +
        '| Electron (100 eV) | 5.4 × 10⁻²⁴ | 0.12 nm | Yes — electron diffraction |\n' +
        '| Cricket ball (40 m/s) | 6.4 | 1.0 × 10⁻³⁴ m | No — absurdly small wavelength |\n' +
        '| Proton (LHC, 7 TeV) | 3.7 × 10⁻¹⁵ | 1.8 × 10⁻¹⁹ m | Yes — probes quark structure |',
    },

    // ── Section 7: Biomechanics ───────────────────────────────────
    {
      title: 'Biomechanics — Forces in Living Things',
      diagram: 'GlidingVsFlyingDiagram',
      beginnerContent:
        'Biomechanics is the study of forces and motion in biological systems — how animals walk, fly, swim, and survive impacts.\n\n' +
        '**The flying squirrel of NE India** does not actually fly — it **glides**. When it leaps from a high branch in the forests of Meghalaya or Nagaland, it spreads a membrane of skin called a **patagium** between its front and back legs, creating a large surface area.\n\n' +
        '| Force on the squirrel | Direction | What it does |\n' +
        '|----------------------|-----------|-------------|\n' +
        '| **Gravity** (weight) | Downward | Pulls the squirrel toward the ground |\n' +
        '| **Lift** (from air hitting patagium) | Upward + forward | Slows descent, converts down into forward |\n' +
        '| **Drag** (air resistance) | Opposite to motion | Limits speed |\n\n' +
        'At steady glide, lift + drag balance gravity — the squirrel descends gently while travelling far horizontally. Some flying squirrels can glide over **100 metres** from a single leap!\n\n' +
        '**More biomechanics examples:**\n\n' +
        '| Animal | Biomechanics feat | Physics involved |\n' +
        '|--------|------------------|------------------|\n' +
        '| **One-horned rhino** | Supports 2,000 kg on 4 legs | Pressure distribution, bone strength |\n' +
        '| **Hoolock gibbon** | Swings branch to branch (brachiation) | Pendulum motion, energy conservation |\n' +
        '| **Asian elephant** | Walks silently despite 5,000 kg | Fat pads absorb impact, slow foot placement |\n' +
        '| **Golden langur** | Leaps 10+ m between trees | Projectile motion, elastic tendons |\n' +
        '| **Ganges river dolphin** | Navigates murky water blind | Echolocation (sonar), momentum transfer |\n\n' +
        'Understanding how forces act on living bodies has led to better prosthetic limbs, more efficient running shoes, and safer helmets.',
      intermediateContent:
        '**Analysing a flying squirrel\'s glide with force vectors:**\n\n' +
        'At steady glide, **lift** (L) and **drag** (D) from air resistance balance gravity (W = mg). The glide angle θ satisfies **tan θ = D/L**.\n\n' +
        '| Parameter | Value | Formula |\n' +
        '|-----------|-------|--------|\n' +
        '| Squirrel mass | 0.15 kg | — |\n' +
        '| Weight | 1.47 N | W = mg |\n' +
        '| Glide ratio (L/D) | ~3 | Measured |\n' +
        '| Tree height | 30 m | — |\n' +
        '| Horizontal range | 30 × 3 = **90 m** | Range = height × L/D |\n' +
        '| Glide speed | ~10 m/s | Measured |\n\n' +
        '**Drag force calculation:**\n\n' +
        '`F_drag = ½ρv²C_DA`\n\n' +
        'where ρ = 1.225 kg/m³ (air density), v = speed, C_D = drag coefficient, A = area.\n\n' +
        'Squirrel with spread patagium (A ≈ 0.05 m², C_D ≈ 1.0) at 10 m/s:\n\n' +
        '`F_drag ≈ 0.5 × 1.225 × 100 × 1.0 × 0.05 ≈ 3.06 N`\n\n' +
        'This exceeds the squirrel\'s weight (1.47 N), which makes sense — the total aerodynamic force (lift + drag combined) must equal the weight at steady glide.\n\n' +
        '**Comparing flyers and gliders:**\n\n' +
        '| Animal | Type | L/D ratio | Range from 30 m |\n' +
        '|--------|------|----------|----------------|\n' +
        '| Flying squirrel | Glider | 3 | 90 m |\n' +
        '| Flying fish | Glider | 4–5 | 120–150 m |\n' +
        '| Albatross | Dynamic soarer | 20+ | Thousands of km |\n' +
        '| Hummingbird | Powered hover | N/A | Sustained flight |',
      advancedContent:
        'Biomechanics research uses **inverse dynamics** — measuring motion with high-speed cameras and working backward to calculate forces and torques at each joint.\n\n' +
        '**Ground reaction forces during locomotion:**\n\n' +
        '| Activity | Peak GRF (× body weight) | Achilles tendon force |\n' +
        '|----------|-------------------------|----------------------|\n' +
        '| Walking | 1.2× | ~3× body weight |\n' +
        '| Running | 2.5–3× | ~6–8× body weight |\n' +
        '| Sprinting | 3.5–5× | ~10× body weight |\n' +
        '| Jumping (landing) | 5–12× | ~12× body weight |\n\n' +
        'The Achilles tendon stores elastic energy like a spring (stiffness ~200 N/mm), returning ~35% of the energy needed for each stride.\n\n' +
        '**The Froude number — a universal gait predictor:**\n\n' +
        '`Fr = v²/(gL)` where L = leg length\n\n' +
        'Alexander (1976) showed all animals switch from walk to run at **Fr ≈ 0.5**, regardless of size:\n\n' +
        '| Animal | Leg length (m) | Walk-run transition speed (m/s) | Fr |\n' +
        '|--------|---------------|-------------------------------|----|\n' +
        '| Mouse | 0.03 | 0.38 | 0.49 |\n' +
        '| Cat | 0.25 | 1.1 | 0.49 |\n' +
        '| Human | 0.9 | 2.1 | 0.50 |\n' +
        '| Horse | 1.5 | 2.7 | 0.49 |\n' +
        '| Elephant | 2.0 | 3.1 | 0.48 |\n\n' +
        '**Woodpecker impact biomechanics (Wang et al., 2022, *Current Biology*):**\n\n' +
        'Recent research overturned the popular "shock absorber" hypothesis. High-speed CT scans showed the skull is actually **rigid**, not cushioning. The bird survives because its small brain mass means even at **1,200 g** deceleration, the force on the brain stays below the concussion threshold. This is an F = ma insight: tiny mass × huge acceleration = tolerable force on neural tissue.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'In outer space, a moving object will eventually slow down and stop on its own.', answer: false, explanation: 'Without friction or air resistance, a moving object in space continues at constant speed forever (Newton\'s First Law).' },
            { text: 'A heavier object falls faster than a lighter one (ignoring air resistance).', answer: false, explanation: 'All objects accelerate at the same rate under gravity. A feather and a hammer dropped on the Moon (no air) hit the ground at the same time.' },
            { text: 'Friction always works against you.', answer: false, explanation: 'Friction is essential for walking, gripping, and braking. Without it, you couldn\'t take a single step.' },
            { text: 'A woodpecker strikes a tree with its beak at up to 20 times per second.', answer: true, explanation: 'Woodpeckers can drum at 18-22 strikes per second, with each impact reaching ~1,200 g deceleration.' },
            { text: 'A flying squirrel generates lift by flapping a membrane.', answer: false, explanation: 'Flying squirrels glide — they spread their patagium to create a wing-like surface but do not flap. Gravity provides all the energy.' },
          ],
        },
      },
    },

    // ── Section 8: Square-Cube Law ────────────────────────────────
    {
      title: 'The Square-Cube Law',
      diagram: 'SquareCubeLawDiagram',
      beginnerContent:
        'Why can an ant carry 50 times its own body weight while an elephant struggles to carry even a fraction of its weight on top of its own? Why do small insects survive falls from any height while a horse would be killed? The answer is the **square-cube law** — one of the most powerful scaling principles in science.\n\n' +
        '**The core idea:** When you scale an object up, different things scale at different rates:\n\n' +
        '| Property | Scales with | Double every dimension → |\n' +
        '|----------|-----------|------------------------|\n' +
        '| Length | L | 2× longer |\n' +
        '| Surface area (including muscle cross-section) | L² | **4×** more area |\n' +
        '| Volume (and mass) | L³ | **8×** heavier |\n\n' +
        'If you double an ant\'s size in every direction: its muscles are 4× stronger (area scales as L²), but its weight is 8× greater (volume scales as L³). The strength-to-weight ratio **halves** with every doubling of size.\n\n' +
        '**This is why:**\n\n' +
        '| Observation | Square-cube explanation |\n' +
        '|------------|------------------------|\n' +
        '| Ants carry 50× their weight | Tiny size → enormous strength-to-weight ratio |\n' +
        '| Elephants can\'t jump | Huge mass → muscles too weak relative to weight |\n' +
        '| Insects survive any fall | Tiny mass → very low terminal velocity (~2 m/s) |\n' +
        '| Giants in movies couldn\'t exist | Bones would snap under their own weight |\n' +
        '| A model bridge works but full-size version may not | Weight grows faster than structural strength |\n\n' +
        'The one-horned rhinoceros of Kaziranga weighs up to 2,000 kg. Its legs are thick, column-like pillars — much thicker *relative to its body* than a deer\'s legs. The square-cube law demands this: double the rhino\'s size and its weight increases 8× while bone strength only increases 4×. Without proportionally thicker legs, it would collapse.',
      intermediateContent:
        'Quantitatively: if a creature\'s linear dimensions scale by factor L, then:\n\n' +
        '| Quantity | Scales as | Consequence |\n' +
        '|---------|----------|-------------|\n' +
        '| Muscle force | L² | Cross-sectional area |\n' +
        '| Body mass | L³ | Volume × density |\n' +
        '| Strength-to-weight ratio | **1/L** | Inversely proportional to size |\n' +
        '| Bone stress (σ = mg/A) | L | Larger = higher stress |\n' +
        '| Terminal velocity | √L | Larger = faster fall |\n\n' +
        '**Worked example — scaling an ant:**\n\n' +
        'An ant (L = 2 mm) lifts 50× its body weight. Scale it to L = 200 mm (100× bigger).\n\n' +
        '`Strength-to-weight ratio drops by 100×`\n' +
        '`New lifting capacity: 50/100 = 0.5× its body weight`\n\n' +
        'It can barely support itself — let alone carry anything.\n\n' +
        '**Worked example — terminal velocity and survival:**\n\n' +
        '`v_t = √(2mg / (ρC_dA))`\n\n' +
        'Since m ∝ L³ and A ∝ L², terminal velocity v_t ∝ √(L³/L²) = √L.\n\n' +
        '| Animal | Size (L) | Terminal velocity | Survival |\n' +
        '|--------|---------|------------------|----------|\n' +
        '| Ant | 2 mm | ~2 m/s | Always survives |\n' +
        '| Mouse | 8 cm | ~13 m/s | Usually survives |\n' +
        '| Cat | 40 cm | ~27 m/s | Often survives (righting reflex) |\n' +
        '| Human | 1.8 m | ~55 m/s | Fatal without parachute |\n' +
        '| Horse | 1.5 m | ~52 m/s | Fatal |\n\n' +
        '**Bone scaling:** Elephant leg bones are **7% of body mass** (vs 3% for a mouse) — they must be disproportionately thick to handle the L-scaled bone stress.',
      advancedContent:
        'Galileo first identified the square-cube law in *Discorsi* (1638), noting that bones of large animals are proportionally thicker than those of small animals.\n\n' +
        '**Kleiber\'s law** extends scaling to metabolism:\n\n' +
        '> **Metabolic rate ∝ M^0.75**\n\n' +
        '| Scaling model | Predicted exponent | Basis |\n' +
        '|-------------|-------------------|-------|\n' +
        '| Surface area (heat loss) | 0.67 (2/3) | Surface area ∝ M^(2/3) |\n' +
        '| Observed (Kleiber) | **0.75 (3/4)** | Empirical |\n' +
        '| Fractal network (West-Brown-Enquist 1997) | 0.75 | Optimised vascular branching |\n\n' +
        '| Animal | Mass (kg) | Metabolic rate (W) | Rate per kg (W/kg) |\n' +
        '|--------|-----------|-------------------|-------------------|\n' +
        '| Shrew | 0.005 | 0.034 | 6.8 |\n' +
        '| Mouse | 0.025 | 0.13 | 5.2 |\n' +
        '| Cat | 4 | 7.3 | 1.8 |\n' +
        '| Human | 70 | 80 | 1.1 |\n' +
        '| Elephant | 4,000 | 2,500 | 0.63 |\n' +
        '| Blue whale | 100,000 | 30,000 | 0.30 |\n\n' +
        'Smaller animals burn energy faster per kilogram — a shrew\'s heart beats 600 times/min vs an elephant\'s 30 beats/min.\n\n' +
        '**Engineering implications:**\n\n' +
        '| Application | Square-cube constraint |\n' +
        '|------------|----------------------|\n' +
        '| Aircraft wing loading (W/A ∝ L) | Larger planes need higher takeoff speeds |\n' +
        '| Ship hull stress | Doubled ship has 2× hull stress → limits practical size |\n' +
        '| Skyscrapers | Base columns disproportionately thick (not a scaled-up house) |\n' +
        '| MEMS devices | At μm scale, surface forces (electrostatic, van der Waals) dominate gravity |',
    },

    // ── Section 9: Projectile Motion ──────────────────────────────
    {
      title: 'Projectile Motion — Why Kites Fly and Balls Curve',
      diagram: 'ProjectileArcDiagram',
      beginnerContent:
        'When you throw a ball, **two motions happen simultaneously**:\n' +
        '1. The ball moves **forward** at whatever speed you gave it (constant, ignoring air)\n' +
        '2. **Gravity** pulls it **downward** at 9.8 m/s² (accelerating)\n\n' +
        'The combination produces a curved path called a **parabola**.\n\n' +
        '| Component | Direction | Acceleration | Speed changes? |\n' +
        '|-----------|-----------|-------------|----------------|\n' +
        '| Horizontal | Forward | 0 (no horizontal force) | No — stays constant |\n' +
        '| Vertical | Downward | 9.8 m/s² (gravity) | Yes — increases downward |\n\n' +
        '**Kite festivals in Assam:**\n\n' +
        'During kite festivals, flyers intuitively master projectile motion and aerodynamics. A kite is held aloft because the wind pushes against its angled surface, generating **lift** (upward) and **drag** (backward). The string provides tension that balances these forces.\n\n' +
        '| Kite angle | What happens | Why |\n' +
        '|-----------|-------------|-----|\n' +
        '| Too steep | Stalls and nosedives | Drag overwhelms lift |\n' +
        '| Too shallow | Drifts and falls | Not enough lift to overcome gravity |\n' +
        '| **Sweet spot** (~20-30°) | Flies stably | Lift and drag balanced by string tension |\n\n' +
        'Change the wind speed or the kite\'s angle, and the entire force balance shifts — skilled flyers constantly adjust string tension, performing real-time physics without writing a single equation.\n\n' +
        '**Prediction:** Throw a ball horizontally from a height of 1 metre. At the same instant, drop another ball from the same height. Which hits the ground first? *They hit at the same time!* The horizontal motion doesn\'t affect the vertical fall.',
      intermediateContent:
        '**Key equations for projectile motion (no air resistance):**\n\n' +
        '| Quantity | Formula |\n' +
        '|---------|--------|\n' +
        '| Horizontal position | x = v₀ cos θ × t |\n' +
        '| Vertical position | y = v₀ sin θ × t − ½gt² |\n' +
        '| Range (level ground) | **R = v₀² sin 2θ / g** |\n' +
        '| Maximum height | **H = v₀² sin²θ / (2g)** |\n' +
        '| Time of flight | **T = 2v₀ sin θ / g** |\n\n' +
        '**Worked example — cricket ball bowled at 140 km/h (38.9 m/s):**\n\n' +
        '| Launch angle | Range (m) | Max height (m) | Time of flight (s) |\n' +
        '|-------------|-----------|----------------|-------------------|\n' +
        '| 5° | 26.8 | 0.59 | 0.69 |\n' +
        '| 15° | 76.9 | 5.2 | 2.1 |\n' +
        '| 30° | 133.7 | 19.3 | 4.0 |\n' +
        '| **45°** | **154.4** | **38.6** | **5.6** |\n' +
        '| 60° | 133.7 | 57.9 | 6.9 |\n\n' +
        'Maximum range occurs at **θ = 45°**. Notice that 30° and 60° give the same range — complementary angles always do (sin 2θ is the same for θ and 90°−θ).\n\n' +
        '**Worked example — how far can you throw from the top of a Guwahati hill?**\n\n' +
        'Throw a ball at 20 m/s, 30° above horizontal, from a hill 50 m high:\n\n' +
        'Horizontal: `x = 20 cos 30° × t = 17.3t`\n' +
        'Vertical: `−50 = 20 sin 30° × t − 4.9t²` → `−50 = 10t − 4.9t²`\n' +
        'Solving: `t = 4.35 s` → `x = 17.3 × 4.35 = 75.3 m`\n\n' +
        'The extra height adds significant range compared to flat ground (where R = 35.3 m at 30°).',
      advancedContent:
        'Real projectile motion includes **air resistance**, which makes the math far harder.\n\n' +
        '`F_d = ½ρv²C_dA` (depends on v², making the ODE non-linear)\n\n' +
        '**With drag vs without drag (cricket ball at 40 m/s, 45°):**\n\n' +
        '| Parameter | Without drag | With drag | % change |\n' +
        '|-----------|-------------|-----------|----------|\n' +
        '| Range | 163 m | **82 m** | −50% |\n' +
        '| Max height | 40.8 m | 28 m | −31% |\n' +
        '| Optimal angle | 45° | ~38° | −7° |\n' +
        '| Trajectory shape | Symmetric parabola | Asymmetric — steeper descent | — |\n\n' +
        'The differential equation `m(dv/dt) = mg − ½ρv²C_dA` has no closed-form solution and must be solved numerically (Euler or Runge-Kutta methods).\n\n' +
        '**The Magnus effect — why balls curve:**\n\n' +
        'A spinning ball experiences a sideways force perpendicular to both its velocity and spin axis.\n\n' +
        '| Sport | Spin type | Effect | Physics |\n' +
        '|-------|----------|--------|--------|\n' +
        '| Cricket (swing bowling) | Seam + air asymmetry | Ball curves laterally | Differential boundary layer separation |\n' +
        '| Football (banana kick) | Sidespin | Ball curves around wall | Magnus force: F = ½C_L ρAv² |\n' +
        '| Table tennis (topspin) | Forward spin | Ball dips faster | Downward Magnus force adds to gravity |\n' +
        '| Golf (backspin) | Backward spin | Ball stays airborne longer | Upward Magnus force opposes gravity |\n\n' +
        'For a cricket ball (C_d ≈ 0.5, A ≈ 0.004 m²) at 40 m/s, drag ≈ 0.49 N — about 31% of the ball\'s weight (1.57 N). Air resistance matters enormously in cricket, which is why fast bowlers, swing bowlers, and spin bowlers all exploit aerodynamics.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each projectile concept to its value or description',
          pairs: [
            ['Optimal launch angle (no air)', '45° gives maximum range on flat ground'],
            ['Complementary angles (30° and 60°)', 'Give the same range because sin(2×30°) = sin(2×60°)'],
            ['Magnus effect', 'Spinning ball curves due to pressure difference'],
            ['Time of flight formula', 'T = 2v₀ sin θ / g'],
          ],
        },
      },
    },

    // ── Section 10: Momentum and Collisions ───────────────────────
    {
      title: 'Momentum and Collisions',
      diagram: 'WoodpeckerImpactDiagram',
      beginnerContent:
        'When two objects collide, the total momentum before the collision **always equals** the total momentum after. This is the **conservation of momentum** — one of the most fundamental laws in physics.\n\n' +
        '| Collision type | What happens | Momentum conserved? | Energy conserved? | Example |\n' +
        '|---------------|-------------|--------------------|-----------------|---------|\n' +
        '| **Elastic** | Objects bounce apart | Yes | Yes | Billiard balls, Newton\'s cradle |\n' +
        '| **Inelastic** | Objects deform or stick | Yes | No (lost as heat/sound) | Car crash, catching a ball |\n\n' +
        '**Woodpeckers — masters of controlled collision:**\n\n' +
        'When a woodpecker strikes a tree at up to 7 m/s, the impact deceleration can reach **1,200 g** — forces that would cause serious brain injury in humans. How does the bird survive?\n\n' +
        '| Adaptation | Physics principle | How it helps |\n' +
        '|-----------|-----------------|-------------|\n' +
        '| Thick, slightly flexible beak | Increases contact time (Δt) | Reduces peak force (F = Δp/Δt) |\n' +
        '| Hyoid bone wrapping skull | Distributes force across wider area | Reduces pressure (P = F/A) |\n' +
        '| Spongy bone behind beak | Elastic deformation | Converts KE to elastic PE, not brain damage |\n' +
        '| Tiny brain mass (2 g) | F = ma → small m means small F on brain | Even at 1,200 g, brain force is tolerable |\n\n' +
        'Engineers studying these impact biomechanics have designed better motorcycle helmets, phone cases, and car crumple zones — all based on the same principle: **increase the collision time to reduce the peak force**.\n\n' +
        '**Everyday collisions on NE India roads:**\n\n' +
        '| Scenario | Physics lesson |\n' +
        '|----------|---------------|\n' +
        '| Crumple zones on cars | Metal deforms slowly, increasing Δt → lower force on passengers |\n' +
        '| Helmet padding | Foam compresses on impact → increases Δt → protects skull |\n' +
        '| Speed bumps | Force drivers to reduce v before collision-risk zones |',
      intermediateContent:
        '**For elastic collisions in 1D** (m₂ starts at rest):\n\n' +
        '| Quantity | Formula |\n' +
        '|---------|--------|\n' +
        '| v₁\' (object 1 after) | (m₁ − m₂)v₁ / (m₁ + m₂) |\n' +
        '| v₂\' (object 2 after) | 2m₁v₁ / (m₁ + m₂) |\n\n' +
        '**Special cases:**\n\n' +
        '| Condition | v₁\' | v₂\' | Example |\n' +
        '|-----------|-----|-----|--------|\n' +
        '| m₁ = m₂ | 0 | v₁ | Newton\'s cradle — perfect transfer |\n' +
        '| m₁ >> m₂ | ≈ v₁ | ≈ 2v₁ | Truck hits ping-pong ball |\n' +
        '| m₁ << m₂ | ≈ −v₁ | ≈ 0 | Tennis ball hits wall — bounces back |\n\n' +
        '**Worked example — woodpecker impact force:**\n\n' +
        'A 30 g woodpecker head strikes a tree at 7 m/s, decelerating to 0 in 0.5 ms (perfectly inelastic with effectively infinite-mass tree).\n\n' +
        '`Impulse = Δp = m × Δv = 0.03 × 7 = 0.21 kg·m/s`\n' +
        '`F = Δp/Δt = 0.21 / 0.0005 = 420 N`\n' +
        '`Deceleration = F/m = 420/0.03 = 14,000 m/s² ≈ 1,429 g`\n\n' +
        '**Worked example — Newton\'s cradle (5 balls):**\n\n' +
        'Pull 1 ball back and release. Why does exactly 1 ball fly out the other end (not 2 at half speed)?\n\n' +
        'Both **momentum** and **kinetic energy** must be conserved:\n\n' +
        '| Option | Momentum (mv) | KE (½mv²) | Valid? |\n' +
        '|--------|--------------|-----------|--------|\n' +
        '| 1 ball at v | mv ✓ | ½mv² ✓ | **Yes** |\n' +
        '| 2 balls at v/2 | mv ✓ | ½m(v/2)² × 2 = ¼mv² ✗ | No — KE not conserved |\n' +
        '| 5 balls at v/5 | mv ✓ | ½m(v/5)² × 5 = 1/10 mv² ✗ | No — even worse |',
      advancedContent:
        'The **Head Injury Criterion (HIC)**, used in automotive safety, integrates acceleration over time:\n\n' +
        '`HIC = max{(t₂−t₁) × [(1/(t₂−t₁)) × ∫a(t)dt]^2.5}`\n\n' +
        '| HIC value | Injury level | Probability of AIS 4+ |\n' +
        '|-----------|-------------|----------------------|\n' +
        '| < 500 | Safe | < 5% |\n' +
        '| 700 | Moderate | ~30% |\n' +
        '| 1,000 | Severe | ~50% |\n' +
        '| > 1,500 | Critical | > 80% |\n\n' +
        'Recent research (Van Wassenbergh et al., 2022) showed the woodpecker skull acts as a **rigid hammer**, not a shock absorber. The bird survives because its **tiny brain mass** means even at 1,200 g, the actual force on neural tissue stays within tolerance.\n\n' +
        '**2D collisions — scattering:**\n\n' +
        'In 2D, conserve momentum in x and y separately. The scattering angle depends on the **impact parameter** (b = perpendicular distance between centres of mass).\n\n' +
        '| Impact parameter | Result | Lab frame |\n' +
        '|-----------------|--------|----------|\n' +
        '| b = 0 (head-on) | 1D collision | Full transfer (if equal mass) |\n' +
        '| 0 < b < r₁+r₂ | Glancing collision | Both deflected at angles |\n' +
        '| b = r₁+r₂ | Grazing | Minimal deflection |\n' +
        '| b > r₁+r₂ | Miss | No collision |\n\n' +
        'In nuclear physics, Rutherford used elastic scattering equations:\n\n' +
        '`dσ/dΩ = (Z₁Z₂e²/4E)² × 1/sin⁴(θ/2)`\n\n' +
        'This **Rutherford scattering formula** — the same momentum conservation principles applied at femtometre scales — led to the discovery of the atomic nucleus in 1911. The angular distribution of scattered alpha particles was incompatible with the "plum pudding" model and demanded a tiny, dense, positive core.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'A woodpecker\'s beak hits a tree at 1,200 g deceleration — enough to cause brain damage in any mammal. The bird survives because its 2-gram brain is so light that the actual force (F = ma) stays below the injury threshold.',
            'Newton\'s cradle only works if BOTH momentum and kinetic energy are conserved. That\'s why 1 ball in = 1 ball out (not 2 at half speed) — the math demands it.',
            'The Brahmaputra ferry system moves over 2 million passengers per year. Every docking involves a carefully managed inelastic collision between boat and jetty — controlled by reducing approach speed (and therefore momentum) to safe levels.',
            'In 1911, Ernest Rutherford discovered the atomic nucleus by firing alpha particles at gold foil and analysing the scattering angles — using the exact same momentum conservation equations that describe billiard ball collisions.',
          ],
        },
      },
    },
  ]
};
